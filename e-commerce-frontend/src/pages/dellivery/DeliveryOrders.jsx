import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "./DeliveryOrders.css";

function DeliveryOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

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

    return (
        <div className="delivery-orders-page">


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
                                <button className="action-btn out-btn">
                                    Out for Delivery
                                </button>}

                            {order.deliveryStatus === `out_for_delivery` &&
                                <button className="action-btn verify-btn">
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