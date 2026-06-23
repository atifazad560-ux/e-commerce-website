import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="success-page">
            <div className="success-card">
                <div className="success-icon">✅</div>

                <h1>Order Placed Successfully!</h1>

                <p>
                    Thank you for shopping with us.
                    Your order has been placed successfully
                    and is being processed.
                </p>

                <div className="delivery-box">
                    <h3>Estimated Delivery</h3>
                    <p>Within 3–5 business days</p>
                </div>

                <div className="success-buttons">
                    <button
                        className="orders-btn"
                        onClick={() => navigate("/user/orders")}
                    >
                        View My Orders
                    </button>

                    <button
                        className="shop-btn"
                        onClick={() => navigate("/user/dashboard")}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;