const UserType = require("../models/userType");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Category = require("../models/category");
const { sendEmail } = require("../utils/sendMail");
const Order = require("../models/order");
const Product = require("../models/product");
const bcrypt = require("bcrypt");

// Generate a random secure temporary password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

exports.createAdminUser = async (req, res) => {
  try {
    // Protect this one-time endpoint with a secret setup key
    // const { setupKey } = req.body;
    // if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
    //     return res.status(403).json({ message: 'Invalid or missing setup key' });
    // }

    const adminType = await UserType.findOne({ role: 'admin' });
    if (!adminType) {
      return res.status(400).json({ message: 'Admin user type not found' });
    }
    const isAdminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (isAdminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Generate secure password
    // const defaultPassword = generateTempPassword();
    const defaultPassword = "Admin@123"; // For demo purposes only. In production, always generate a secure random password.
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newAdmin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      address: "Admin Address",
      mobile: "0000000000",
      userType: adminType._id,
      isVerified: true,
      isActive: true
    });
    await newAdmin.save();

    // Send credentials via email
    await sendEmail(
      "admin@gmail.com",
      "Admin Account Created - Login Credentials",
      `
            <div style="font-family: Arial, sans-serif;">
              <h2>Admin Account Created</h2>
              <p>Your admin account has been created successfully.</p>
              <p><strong>Email:</strong> admin@gmail.com</p>
              <p><strong>Temporary Password:</strong> ${defaultPassword}</p>
              <p><strong>Please change your password immediately after login.</strong></p>
            </div>
            `
    );

    res.status(201).json({
      message: 'Admin user created successfully. Credentials sent to email.',
      user: { name: newAdmin.name, email: newAdmin.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// to change Admin Password

exports.changeAdminPassword = async (req, res) => {

  try {

    const { oldPassword, newPassword, confirmPassword } = req.body;


    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    };

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different"
      })
    }



    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "newPassword and confirmPassword are not same"
      })
    };

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character"
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


// Create Seller
exports.createSeller = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;

    // 1️⃣ check existing seller
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // 2️⃣ get seller role
    const sellerRole = await UserType.findOne({ role: "seller" });


    if (!sellerRole) {
      return res.status(500).json({ message: "Seller role not found" });

    }


    // 3️⃣ generate + hash a secure temporary password (never use admin-supplied plain text)
    // const tempPassword = generateTempPassword();
    const tempPassword = "Seller@123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 4️⃣ create seller
    const seller = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      userType: sellerRole._id,
      isActive: true,
      isVerified: true
    });

    await seller.save();

    // 5️⃣ send credentials email with temporary password
    await sendEmail(
      email,
      "Seller Account Created – Login Credentials",
      `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">
        <h2>Welcome to Our Platform</h2>
        <p>Dear ${name},</p>
        <p>
          Your seller account has been successfully created by the administrator.
          You can now log in using the credentials below:
        </p>
        <p style="background:#f5f5f5; padding:10px; border-radius:6px;">
          <strong>Email:</strong> ${email}<br/>
          <strong>Temporary Password:</strong> ${tempPassword}
        </p>
        <p style="color: #c0392b;">
          <strong>⚠️ Please change your password immediately after your first login.</strong>
        </p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br/>
        <p>Best regards,<br/><strong>Your Company Name</strong><br/>Support Team</p>
      </div>
      `
    );

    res.status(201).json({
      message: "Seller created successfully and credentials sent via email"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      createdBy: req.user._id
    });

    await category.save();

    res.status(201).json({
      message: "Category added successfully",
      category
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get User Details

exports.getAllUsers = async (req, res) => {
  try {

    const userRole = await UserType.findOne({ role: "user" });

    const users = await User.find({
      userType: userRole._id,
      isDeleted: false
    })
      .select("-password -otp -otpExpires")
      .populate("userType", "role");

    const usersWithOrders = await Promise.all(
      users.map(async (user) => {

        const ordersCount = await Order.countDocuments({
          user: user._id
        });

        return {
          ...user.toObject(),
          ordersCount
        };
      })
    );

    res.json({
      success: true,
      users: usersWithOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// viewProduct by Admin

exports.AdminProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");

    res.status(200).json({
      success: true,
      count: products.length,
      products

    })

    console.log(req.user);
    console.log(req.user.userType.role);

  } catch (error) {
    console.log(error);


    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
}


// Admin Dashboard Stats

exports.getDashboardStats = async (req, res) => {

  try {

    const userRole = await UserType.findOne({ role: "user" });
    const sellerRole = await UserType.findOne({ role: "seller" });
    const deliveryRole = await UserType.findOne({ role: "delivery" })

    const totalUsers = await User.countDocuments({
      userType: userRole?._id,
      isDeleted: false
    });

    const totalSellers = await User.countDocuments({
      userType: sellerRole?._id,
      isDeleted: false
    });

    const totalDelivery = await User.countDocuments({
      userType: deliveryRole._id,
      isDeleted: false
    })
    const totalProducts = await Product.countDocuments({
      isActive: true
    });

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalDelivery,
      }
    })
  } catch (error) {

    console.log("DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error?.message
    })
  }
}




// Create Delivery Boy

exports.createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, mobile, vehicleNumber, vehicleType } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Delivery boy already exists" });
    }

    // Generate a secure temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const deliveryRole = await UserType.findOne({ role: "delivery" });

    const deliveryBoy = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      userType: deliveryRole._id,
      deliveryInfo: { vehicleNumber, vehicleType },
      isActive: true,
      isVerified: true
    });

    await deliveryBoy.save();

    await sendEmail(
      email,
      "Delivery Partner Account Created – Login Credentials",
      `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.7; color: #333;">
    <h2>Welcome to Our Delivery Team 🚚</h2>
    <p>Dear ${name},</p>
    <p>Your <strong>Delivery Partner account</strong> has been successfully created by the administrator.</p>
    <p>You can log in to the delivery app/portal using the credentials below:</p>
    <p style="background:#f5f5f5; padding:10px; border-radius:6px;">
      <strong>Email:</strong> ${email}<br/>
      <strong>Temporary Password:</strong> ${tempPassword}
    </p>
    <p style="color: #c0392b;">
      <strong>⚠️ Please change your password immediately after your first login.</strong>
    </p>
    <p>Once logged in, you will be able to:
      <ul>
        <li>View assigned deliveries</li>
        <li>Update delivery status</li>
        <li>Verify delivery using OTP</li>
      </ul>
    </p>
    <p>If you face any issues, please contact our support team.</p>
    <br/>
    <p>Best regards,<br/><strong>Your Company Name</strong><br/>Delivery Operations Team</p>
  </div>
  `
    );

    res.status(201).json({
      message: "Delivery boy created successfully",
      deliveryBoy
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getDeliveryBoys = async (req, res) => {
  try {
    const deliveryRole = await UserType.findOne({ role: "delivery" });


    if (!deliveryRole) {
      return res.status(404).json({
        message: "Delivery Roole not found"
      })
    }

    const users = await User.find({
      userType: deliveryRole._id
    }).
      select("-password");

    const deliveryBoys = [];

    for (let user of users) {
      const count = await Order.countDocuments({
        deliveryBoy: user._id,
        deliveryStatus: { $ne: "delivered" }
      });

      deliveryBoys.push({
        _id: user._id,
        name: user.name,
        activeAssignments: count,
        vehicleType: user.deliveryInfo?.vehicleType
      })

    }
    res.json({
      success: true,
      deliveryBoys
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

}




exports.assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoy: deliveryBoyId,
        deliveryStatus: "assigned"
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      message: "Delivery boy assigned successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


