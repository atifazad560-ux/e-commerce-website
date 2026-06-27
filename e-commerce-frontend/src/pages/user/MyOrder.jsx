import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import "./MyOrder.css";

function MyOrder() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])



    // get orders from dataBase using Server
    const fetchData = async () => {

        try {

            const user = localStorage.getItem('user')
            const token = localStorage.getItem('token')

            const response = await axios.get(`http://localhost:4000/api/v1/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${user, token}`
                    }
                }
            );
            console.log(response.data)

            setOrders(response?.data || []);


        } catch (error) {
            toast.info("Unable to Fetch Order");
            console.log(error);

        };
    }


    //  to cancel order


    const cancelOrder = async (_id) => {

        const oldOrder = [...orders]
        setOrders(prev =>
            prev.map(order =>
                order._id === _id
                    ? { ...order, status: "cancelled" }
                    : order
            )
        );

        try {
            const user = localStorage.getItem(`user`);
            const token = localStorage.getItem(`token`);

            const response = await axios.put(`http://localhost:4000/api/v1/cancel/${_id}`,
                {},
                {
                    headers:{
                        Authorization:`Bearer ${user , token}`
                    }
                }
            );

            toast.success("Order Cancelled !!");
        } catch (error) {
            setOrders(oldOrder);
            toast.error("Cancel request failed !!")
        }


    }


    return (
        <div className="orders-container">

            {orders.length === 0 ? (
                <h2>No Orders Found</h2>
            ) : (
                orders.map((order) => {
                    const total = order.items.reduce((sum, item) => {
                        return sum + item.price * item.quantity;
                    }, 0);

                    return (
                        <div className="order-card" key={order._id}>
                            <h2>Order ID: {order._id.slice(-6).toUpperCase()}</h2>
                            <div className={`status-badge ${order.status}`}>
                                {order.status}
                            </div>

                            {order.items.map((item) => (
                                <div
                                    className="order-item"
                                    key={item.product._id}
                                >
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        width="120"
                                    />

                                    <div>
                                        <h3>{item.product.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₹{item.price}</p>
                                        <p>Seller: {item.seller.name}</p>
                                    </div>
                                </div>
                            ))}

                            <h3>Total: ₹{total}</h3>

                            {order.status === "pending" && (
                                <button onClick={() =>
                                    cancelOrder(order._id)}>
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    );
                })
            )}

        </div>
    )
}

export default MyOrder