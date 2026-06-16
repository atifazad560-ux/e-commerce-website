const express = require('express');
const { addProduct, getCategories, getSellerProducts, getSellerDashboard } = require('../controllers/seller');
const { authSeller } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post('/add-product', authSeller, addProduct);

// public / seller use this
router.get("/categories",authSeller, getCategories);


router.get('/my-products',authSeller, getSellerProducts);


module.exports = router;