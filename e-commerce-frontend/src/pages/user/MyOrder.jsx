import React from 'react'

function MyOrder() {

    const orders = [
        {
            id: "ORD123",
            date: "18 June 2026",
            amount: 1499,
            status: "Shipped"
        },
        {
            id: "ORD124",
            date: "17 June 2026",
            amount: 699,
            status: "Delivered"
        },
        {
            id: "ORD125",
            date: "15 June 2026",
            amount: 299,
            status: "Pending"
        }
    ];

    return (
        <div className="orders-container">
            <h2>My Orders</h2>

            <p className="subtitle">
                Track all my placed orders
            </p>

            <div className="order-table">
                <div className="table-header">
                    <span>Order ID</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                </div>

                {orders.map((order) => (
                    <div className="table-row" key={orders.id}>
                        <span>{order.amount}</span>
                        <span>{order.id}</span>
                        <span>{order.date}</span>
                        <span className={`status ${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrder