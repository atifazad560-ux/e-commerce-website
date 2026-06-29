import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Buynow.css";

function Buynow() {
    const navigate = useNavigate();
    const location = useLocation();

    const product = location.state?.product;
    const initialQuantity = location.state?.quantity || 1;

    const [order, setOrder] = useState({
        product,
        quantity: initialQuantity,
        paymentMethod: "COD",
        shippingAddress: {
            fullName: "",
            mobile: "",
            addressLine: "",
            city: "",
            state: "",
            pincode: ""
        }
    });

    const handleChange = (e) => {
        setOrder((prev) => ({
            ...prev,
            shippingAddress: {
                ...prev.shippingAddress,
                [e.target.name]: e.target.value
            }
        }));
    };


    const validateOrder = () => {
        const { fullName, mobile, addressLine, city, state, pincode } = order.shippingAddress;

        if (!fullName || !mobile || !addressLine || !city || !state || !pincode) {
            toast.error("Please fill all the fields !!")
            return false;
        }

        if (mobile.length !== 10) {
            toast.error("Phone no. must be 10 digits")
            return false;
        }

        if (pincode.length !== 6) {
            toast.error("Pincode must be 6 digits")
            return false;
        }

        if (order.quantity < 1) {
            toast.error("Invalid QUantity")
            return false;

        }

        return true
    }

    const placeOrder = async () => {

        if (!validateOrder()) {
            return;
        };

        try {

            const token = localStorage.getItem("token");


            const response = await axios.post(
                "http://localhost:4000/api/v1/place-order",
                {
                    productId: order.product._id,
                    quantity: order.quantity,
                    paymentMethod: order.paymentMethod,
                    shippingAddress: order.shippingAddress
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);
            toast.success("Order placed successfully");
            navigate("/user/order-success",);
        } catch (error) {
            console.log(error);
            toast.error("Order failed");
        }
    };

    if (!order.product) {
        return <h2>No Product Selected</h2>;
    }

    return (
        <div className="buy-container">
            <h1 className="buy-title">Checkout</h1>

            {/* Product Card */}
            <div className="product-section">
                <img
                    src={order.product.image}
                    alt={order.product.name}
                />

                <div className="product-info">
                    <h2>{order.product.name}</h2>
                    <p>{order.product.description}</p>
                    <h3 className="price">
                        ₹{order.product.price}
                    </h3>
                </div>
            </div>

            {/* Quantity */}
            <div className="quantity-box">
                <label>Quantity:</label>
                <input
                    type="number"
                    min="1"
                    value={order.quantity}
                    onChange={(e) =>
                        setOrder((prev) => ({
                            ...prev,
                            quantity: Number(e.target.value)
                        }))
                    }
                />
            </div>

            {/* Total */}
            <h2 className="total">
                Total: ₹{order.product.price * order.quantity}
            </h2>

            {/* Shipping Address */}
            <div className="address-section">
                <h2>📦 Shipping Address</h2>

                <div className="address-grid">
                    <input
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="mobile"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="addressLine"
                        placeholder="Street Address"
                        onChange={handleChange}
                    />

                    <input
                        name="city"
                        placeholder="City"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="state"
                        placeholder="State"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="pincode"
                        placeholder="Pincode"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Payment Method */}
                <h2>💳 Payment Method</h2>

                <select
                    className="payment-select"
                    value={order.paymentMethod}
                    onChange={(e) =>
                        setOrder((prev) => ({
                            ...prev,
                            paymentMethod: e.target.value
                        }))
                    }
                    required
                >
                    <option value="COD">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                </select>

                {/* Place Order */}
                <button
                    className="place-order-btn"
                    onClick={placeOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}

export default Buynow;  