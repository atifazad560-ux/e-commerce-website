import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
            phone: "",
            street: "",
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

    const placeOrder = async () => {
        try {
            const user = localStorage.getItem(`user`);
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
                        Authorization: `Bearer ${user , token}`
                    }
                }
            );

            toast.success("Order placed successfully");
            console.log(response.data);

            navigate("/order-success");

        } catch (error) {
            console.log(error);
            toast.error("Order failed");
        }
    };

    if (!order.product) {
        return <h2>No Product Selected</h2>;
    }

    return (
        <div>
            <h1>Buy Now</h1>

            <img
                src={order.product.image}
                alt={order.product.name}
                width="200"
            />

            <h2>{order.product.name}</h2>
            <p>{order.product.description}</p>
            <h3>₹{order.product.price}</h3>

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

            <h2>
                Total: ₹{order.product.price * order.quantity}
            </h2>

            <h2>Shipping Address</h2>

            <input
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
            />

            <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
            />

            <input
                name="street"
                placeholder="Street"
                onChange={handleChange}
            />

            <input
                name="city"
                placeholder="City"
                onChange={handleChange}
            />

            <input
                name="state"
                placeholder="State"
                onChange={handleChange}
            />

            <input
                name="pincode"
                placeholder="Pincode"
                onChange={handleChange}
            />

            <h2>Payment Method</h2>

            <select
                value={order.paymentMethod}
                onChange={(e) =>
                    setOrder((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value
                    }))
                }
            >
                <option value="COD">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
            </select>

            <br />
            <br />

            <button onClick={placeOrder}>
                Place Order
            </button>
        </div>
    );
}

export default Buynow;