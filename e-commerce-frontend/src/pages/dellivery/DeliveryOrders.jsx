import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "./DeliveryOrders.css";

function DeliveryOrders() {
    const [orders, setOrders] = useState([]);

    const [otpVerify, setOtpVerify] = useState(null);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);



    // to get delievry data
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:4000/api/v1/my-delivery`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(response.data?.orders);
            console.log("set orders", response.data.orders);

        } catch (error) {

            toast.error(`couldn't fetch your orders`);
            console.log(error.response?.data);
        }
    };


    //  to accpet delievry assigned by admin

    const acceptDelivery = async (orderId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.patch(
                `http://localhost:4000/api/v1/accept-delivery/${orderId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data.message);

            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed");
        }
    };



    // to give notification of out for delivery

    const outForDelivery = async (orderId) => {
        try {
            const token = localStorage.getItem(`token`);

            const response = await axios.put(`http://localhost:4000/api/v1/out-for-delivery/${orderId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(`out for delivery`)
            fetchOrders();
        } catch (error) {
            toast.error(`somethignwent wrong`)
            console.log(error?.response?.data?.message || `something went wrong`);

        }
    }



    // to verify OTP

    const verifyOtp = async (orderId) => {

        try {
            const token = localStorage.getItem(`token`);
            console.log("otpVerify", otpVerify);
            console.log("otp", otp);

            const response = await axios.put(`http://localhost:4000/api/v1/verify-delivery/${orderId}`,
                { otp },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            toast.success(`otp verified`)
            setOtp("");
            setOtpVerify(null);
            fetchOrders();

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong")

        }
    }


    return (

        <div className="delivery-orders-page">

            {otpVerify && (
                <div className="otp-modal-overlay">
                    <div className="otp-modal">

                        <h1 className="otp-title">Verify OTP</h1>

                        <button
                            className="otp-close-btn"
                            onClick={() => setOtpVerify(null)}
                        >
                            Close
                        </button>

                        <input
                            className="otp-input"
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            placeholder="Enter OTP"
                        />

                        <div className="otp-btn-group">
                            <button
                                className="otp-submit-btn"
                                onClick={() => verifyOtp(otpVerify._id)}
                            >
                                Submit OTP
                            </button>

                            <button
                                className="otp-resend-btn"
                                onClick={() => outForDelivery(otpVerify._id)}
                            >
                                Resend OTP
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <h3 className="page-title">
                You have {orders.length} Assignments left right now !!
            </h3>

            <div className="orders-container">



                {orders.map((order) => (
                    <div className="order-card" key={order._id}>



                        <h3 className="order-id">Order ID: {order?._id.slice(-6).toUpperCase()}</h3>



                        <div className="order-section">



                            <p className="section-title">Items:</p>
                            <ul className="items-list">
                                {order.items?.map((item) => (
                                    <li className="item-row" key={item._id}>
                                        {item.product?.name} - Qty: {item.quantity}
                                    </li>
                                ))}
                            </ul>



                        </div>




                        <p className="order-detail">
                            <span>Customer:</span> {order?.user?.name}
                        </p>

                        <p className="order-detail">
                            <span>Mobile:</span> {order?.user?.mobile}
                            <a
                                className="call-btn"
                                href={`tel:${order?.user?.mobile}`}
                            >
                                Call
                            </a>
                        </p>

                        <p className="order-detail">
                            <span>Address:</span>{" "}
                            {order?.shippingAddress?.street},{" "}
                            {order?.shippingAddress?.city}
                        </p>

                        <p className="order-detail">
                            <span>Total Amount:</span> ₹{order?.totalAmount}
                        </p>

                        <p className="order-detail">
                            <span>Payment Method:</span> {order?.paymentMethod}
                        </p>

                        {order.paymentMethod === "COD" && (
                            <h3 className="cod-warning">
                                Collect ₹{order.totalAmount}
                            </h3>
                        )}

                        <p className="order-detail">
                            <span>Delivery Status:</span> {order?.deliveryStatus}
                        </p>

                        <p className="order-detail">
                            <span>Payment Status:</span> {order.paymentStatus}
                        </p>



                        <div className="button-group">


                            {order.deliveryStatus === `assigned` &&
                                <button
                                    className="action-btn out-btn"
                                    onClick={() => acceptDelivery(order._id)}>
                                    Accept Order
                                </button>}

                            {order.deliveryStatus === `accepted` &&
                                <button
                                    className="action-btn out-btn"
                                    onClick={() => outForDelivery(order._id)}>
                                    Out for Delivery
                                </button>}

                            {order.deliveryStatus === `out_for_delivery` &&
                                <button
                                    className="action-btn verify-btn"
                                    onClick={() => setOtpVerify(order)}>
                                    Verify Delivery
                                </button>}



                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeliveryOrders;