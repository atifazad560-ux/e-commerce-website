import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import "./AdminOrder.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectOrder, setSelectOrder] = useState(null);

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchOrders();
  }, []);



  const handleFilter = (value) => {
    setFilter(value);

  }



  // to change delivery status of each card by Admin in MyOrder 

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



  // to fetch all orders from Order Schema from DB using backend
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
      console.log(response.data);

    } catch (error) {
      toast.error("Couldn't fetch orders");
    }
  };



  // to filter the order (pending/delivered/shipped ,etc) using a drop down
  const filteredOrders =
    filter === "all"
      ? orders
      : filter === "cancelled"
        ? orders.filter(
          order => order.status?.toLowerCase() === "cancelled"
        )
        : orders.filter(
          order =>
            order.deliveryStatus?.toLowerCase() === filter.toLowerCase()
        );



  return (
    <div className="admin-orders-pager">
      <div className="admin-orders-container">
        <div className="orders-header">
          <div className="header-left">
            <h2 className="page-title">📋 Admin Orders</h2>
            <p className="orders-count">
              📦 Total Orders: {filteredOrders.length}
            </p>
          </div>

          <div className="filter-box">
            <label className="filter-label">🔍 Filter Orders</label>

            <select
              className="filter-select"
              value={filter}
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="all">📦 All</option>
              <option value="pending">⏳ Pending Delivery</option>
              <option value="packed">📦 Packed</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>



        {selectOrder && (
          <div className="modal-overlay" onClick={() => setSelectOrder(null)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setSelectOrder(null)}
                >
                  Close
                </button>
              </div>

              {/* CRITICAL SCROLLABLE CONTAINER */}
              <div className="modal-body">
                <div className="order-summary-grid">
                  <div className="summary-card">
                    <p><strong>👤 User:</strong> {selectOrder?.user?.name}</p>
                    <p><strong>Order No:</strong> {selectOrder?.orderNumber}</p>
                    <p>
                      <strong>Ordered On:</strong>{" "}
                      {new Date(selectOrder.createdAt).toDateString()}
                    </p>
                  </div>

                  <div className="summary-card">
                    <p><strong>Payment Method:</strong> {selectOrder?.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {selectOrder?.paymentStatus}</p>
                  </div>
                </div>

                <div className="shipping-card">
                  <h3>Shipping Address</h3>
                  <p>{selectOrder?.shippingAddress?.fullName}</p>
                  <p>{selectOrder?.shippingAddress?.city}</p>
                  <p>{selectOrder?.shippingAddress?.state}</p>
                  <p>{selectOrder?.shippingAddress?.pincode}</p>
                </div>

                <h3 className="product-title">Products</h3>

                {selectOrder?.items?.map((item) => (
                  <div className="product-card" key={item._id}>
                    <div className="product-image-box">
                      <img
                        src={item?.product?.image}
                        alt={item?.product?.name}
                        className="product-image"
                      />
                    </div>

                    <div className="product-info">
                      <h4>{item?.product?.name}</h4>

                      <div className="product-details">
                        <p>
                          <strong>Price:</strong> ₹{item?.product?.price}
                        </p>

                        <p>
                          <strong>Quantity:</strong> {item?.quantity}
                        </p>

                        <p>
                          <strong>Total:</strong> ₹
                          {item?.product?.price * item?.quantity}
                        </p>

                        <p>
                          <strong>Seller:</strong> {item?.seller?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* END OF SCROLLABLE CONTAINER */}

            </div>
          </div>
        )}




        {/* starting of the card */}

        {filteredOrders.length === 0 ? (
          <p className="no-orders">No Orders Found</p>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div className="order-card" key={order._id}>
                <h3 className="order-number">
                  Order No: {order.orderNumber}
                </h3>

                <p className="order-info">
                  <strong>👤 User:</strong> {order?.user?.name}
                </p>

                <p className="order-info">
                  <strong>🛒 Total Items:</strong> {order?.items?.length}
                </p>

                <p className="order-info">
                  <strong>💰 Total Price:</strong> ₹{order?.totalAmount}
                </p>

                <p className="order-info">
                  <strong>Order Status:</strong>
                  <span className={`status-badge ${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>

                <div className="delivery-section">
                  <strong>Delivery Status:</strong>

                  {order.status?.toLowerCase() === "cancelled" ? (
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

                <button
                  className="view-details-btn"
                  onClick={() => setSelectOrder(order)}>
                  🔎 View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;