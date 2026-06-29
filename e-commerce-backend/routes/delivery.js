
const express = require('express');
const router = express.Router();
const { getMyDeliveryOrders, outForDelivery, verifyDeliveryOTP, acceptDelivery, changeDeliveryPassword } = require("../controllers/delivery");
const { authDeliveryBot } = require("../middleware/auth");
const { validate } = require("../middleware/validation");



router.get("/my-delivery", authDeliveryBot, getMyDeliveryOrders);
router.patch(`/accept-delivery/:orderId`, authDeliveryBot , acceptDelivery);
router.put("/out-for-delivery/:orderId", authDeliveryBot, outForDelivery);
router.put("/verify-delivery/:orderId", authDeliveryBot, verifyDeliveryOTP);
router.put(`/change-delivery-password` , authDeliveryBot, changeDeliveryPassword)

module.exports = router;