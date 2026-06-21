
const express = require('express');
const router = express.Router();

const { login, signup, verifyEmail, forgotPassword, resetPassword, getAllUsers, getAllProducts, getProducts, addToWishList, getWishList, addtoCart, getCart, removeCart } = require('../controllers/user');
const { validate } = require('../middleware/validation');
const { authUser } = require('../middleware/auth');

// User Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email",  verifyEmail);
// Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);

router.get("/get-Allusers",  getAllUsers);
router.get("/get-all-products" , getAllProducts);
router.get("/products/:id" ,authUser, getProducts);

router.post("/add-wishlist" ,authUser, addToWishList);
router.get("/get-wishlist" ,authUser, getWishList);

// router.post('/add-cart', authUser, addtoCart);
// router.get('/get-cart', authUser, getCart);
// router.delete('/remove-cart/:id', authUser, removeCart);
module.exports = router;