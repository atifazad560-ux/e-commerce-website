const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,


  image: {
    type: String,
    default: ""
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


let Product = mongoose.model('Product', productSchema);
module.exports = Product;