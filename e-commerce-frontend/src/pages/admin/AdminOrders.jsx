import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "./AdminOrder.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const DeliveryStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/v1/admin/status/${orderId}`,
        {
          deliveryStatus: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchOrders();
      toast.success("Status Updated");
    } catch (error) {
      toast.error("Couldn't change status!");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:4000/api/v1/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);
    } catch (error) {
      toast.error("Couldn't fetch orders");
    }
  };

  return (

    <div className="admin-orders-pager">

      <div className="admin-orders-container">
        <h2 className="page-title">Admin Orders</h2>

        {orders.length === 0 ? (
          <p className="no-orders">No Orders Found</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <h3 className="order-number">
                  Order No: {order.orderNumber}
                </h3>

                <p className="order-info">
                  <strong>User:</strong> {order?.user?.name}
                </p>

                <p className="order-info">
                  <strong>Total Items:</strong> {order?.items?.length}
                </p>

                <p className="order-info">
                  <strong>Total Price:</strong> ₹{order?.totalAmount}
                </p>

                <p className="order-info">
                  <strong>Order Status:</strong>
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                </p>

                <div className="delivery-section">
                  <strong>Delivery Status:</strong>

                  {order.status === "cancelled" ? (
                    <p className="cancelled-text">
                      Order Cancelled / No Edit
                    </p>
                  ) : (
                    <select
                      className="status-select"
                      value={order.deliveryStatus}
                      onChange={(e) =>
                        DeliveryStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
}

export default AdminOrders;