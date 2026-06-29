const Order = require("../models/order");
const User = require("../models/user");
const { sendEmail } = require("../utils/sendMail");

const bcrypt = require(`bcrypt`)

exports.changeDeliveryPassword = async (req, res) => {

  try {

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    };

    if(oldPassword===newPassword){
      return res.status(400).json({
        success:false,
        message:"New password must be different"
      })
    }



    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "newPassword and confirmPassword are not same"
      })
    };

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }



    const storedPassword = req.user.password

    const isMatch = await bcrypt.compare(oldPassword, storedPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      })
    };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    req.user.password = hashedPassword;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
}


exports.getMyDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user._id,
      //   deliveryBoy: req.user._id,
      deliveryStatus: { $ne: "delivered" }
    })
      .populate("user")              // customer details
      .populate("items.product")     // product details
      .sort({ createdAt: -1 });      // latest first

    res.json({
      total: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.acceptDelivery = async (req, res) => {

  try {

    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryBoy: req.user._id
    })

    if (!order) {
      return res.status(400).json({
        message: "Order not found or not assigned to you"
      })
    }

    if (order.deliveryStatus !== "assigned") {
      return res.status(400).json({
        message: `Order cannot be accepted || Current status : ${order.deliveryStatus}`
      })
    }


    order.deliveryStatus = "accepted";
    await order.save();

    res.status(200).json({
      message: "Order accepted",
      order
    })

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

exports.outForDelivery = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryBoy: req.user._id
    }).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    order.deliveryStatus = "out_for_delivery";
    order.deliveryOTP = otp;
    order.deliveryOTPExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await order.save();

    // 📧 Send OTP to CUSTOMER
    await sendEmail(
      order.user.email,
      "Delivery OTP – Order Verification",
      `
      <div style="font-family: Arial">
        <h3>Your order is out for delivery 🚚</h3>
        <p>Order ID: <b>${order.orderNumber}</b></p>
        <p>Your delivery OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 15 minutes.</p>
      </div>
      `
    );

    res.json({ message: "OTP sent to customer email" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.verifyDeliveryOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const order = await Order.findOne({
      _id: req.params.orderId,
      deliveryBoy: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (Date.now() > order.deliveryOTPExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Mark delivered
    order.deliveryStatus = "delivered";
    order.status = "delivered";
    order.deliveredAt = new Date();
    order.deliveryOTP = null;
    order.deliveryOTPExpires = null;

    // COD handling
    if (order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.json({
      message: "Order delivered successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
