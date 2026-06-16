const Category = require("../models/category");
const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category , image , stock  } = req.body;

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




// Get Seller dashboard
