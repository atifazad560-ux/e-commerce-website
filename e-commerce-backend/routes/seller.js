const express = require('express');
const { addProduct, getCategories, getSellerProducts, getSellerDashboardStats, getSellerOrders,  } = require('../controllers/seller');
const { authSeller } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

router.post('/add-product', authSeller, addProduct);

// public / seller use this
router.get("/categories",authSeller, getCategories);


router.get('/my-products',authSeller, getSellerProducts);

// to get seller stats
router.get(`/get-seller-stats` ,authSeller,getSellerDashboardStats)

router.get(`/seller-orders` , authSeller , getSellerOrders)


module.exports = router;