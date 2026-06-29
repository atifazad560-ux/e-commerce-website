
const express = require('express');
const { createAdminUser, addCategory, createSeller, createDeliveryBoy, assignDeliveryBoy, AdminProduct, getDashboardStats, getAllUsers, getDeliveryBoys, changeAdminPassword } = require('../controllers/admin');
const { authAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const router = express.Router();

router.post('/create-admin', createAdminUser);
router.post('/add-category', authAdmin,  addCategory);
router.post('/create-seller', authAdmin,  createSeller);
router.get('/get-user', authAdmin, getAllUsers)
router.get('/admin-product', authAdmin, AdminProduct);
router.get('/dashboard-stats', authAdmin, getDashboardStats)
router.post("/create-delivery-boy", authAdmin,  createDeliveryBoy);
router.put("/assign-delivery/:orderId", authAdmin,  assignDeliveryBoy);

router.get("/get-delivery-boys", authAdmin  , getDeliveryBoys)

router.put(`/change-admin-password` , authAdmin , changeAdminPassword)

module.exports = router;