const Category = require("../models/category");
const Order = require("../models/order");
const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, stock } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      image,
      stock,
      seller: req.user._id
    });
    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};




// Get Product category
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    res.status(200).json({
      categories
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// Get product list

exports.getSellerProducts = async (req, res) => {

  try {
    const sellerID = req.user._id;
    const products = await Product.find({ seller: sellerID });

    res.status(200).json({
      message: "Product fetched successfully",
      products
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }

}




// Get Seller dashboard stats
exports.getSellerDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1 products count
    const totalProducts = await Product.countDocuments({
      seller: sellerId
    })

    // 2 out of stock count
    const outOfStockProducts = await Product.countDocuments({
      seller: sellerId,
      stock: 0
    });

    // 3 seller orders fetch
    const orders = await Order.find({
      "items.seller": sellerId
    });

    // 4 pending count
    const pendingOrders = orders.filter(order => order.status === "pending").length;

    // 5 delivered count
    const deliveredOrders = orders.filter(order => order.status === "delivered").length;

    // 6 revenue calculate
    let revenue = 0;


    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.seller.toString() === sellerId.toString()) {
          revenue += item.price * item.quantity
        }
      });
    });

    res.status(200).json({
      totalProducts: totalProducts,
      totalOrders: orders.length,
      pendingOrders: pendingOrders,
      deliveredOrders: deliveredOrders,
      totalRevenue: revenue,
      outOfStockProducts: outOfStockProducts
    })


  }
  catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}
