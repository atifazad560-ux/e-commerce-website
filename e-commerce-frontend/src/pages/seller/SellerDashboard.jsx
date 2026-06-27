import React, { useState } from "react";
import "./SellerDashboard.css";
import axios from "axios";
import { toast } from "react-toastify";




function SellerDashboard() {

  const [products ,setProducts] = useState([]);

  const getProducts =async ()=>{
 
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(`http://localhost:4000/api/v1/my-products`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setProducts(response.data.products)
      console.log(response.data.products);
      
    } catch (error) {
      toast.error(`couldn't fetch your data`);
      console.log(error.message);
      
    }
  }

  return (


    <div className="seller-dashboard">

      {/* Header */}
      <div className="seller-header">
        <h1>Welcome Back 👋</h1>
        <p>
          Here's what's happening in your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="seller-stats">

        <div className="seller-stat-card" onClick={getProducts}>
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
        </div>

        <div className="seller-stat-card">
          <h3>Total Orders</h3>
          <h2>142</h2>
        </div>

        <div className="seller-stat-card">
          <h3>Pending Orders</h3>
          <h2>18</h2>
        </div>

        <div className="seller-stat-card">
          <h3>Total Revenue</h3>
          <h2>₹45,500</h2>
        </div>

      </div>

      {/* Main Content */}
      <div className="seller-dashboard-grid">

        {/* Recent Orders */}
        <div className="seller-section">

          <div className="section-header">
            <h2>Recent Orders</h2>
          </div>

          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>#1021</td>
                <td>Amit Kumar</td>
                <td>₹1299</td>
                <td>
                  <span className="status pending">
                    Pending
                  </span>
                </td>
              </tr>

              <tr>
                <td>#1022</td>
                <td>Rahul Singh</td>
                <td>₹799</td>
                <td>
                  <span className="status shipped">
                    Shipped
                  </span>
                </td>
              </tr>

              <tr>
                <td>#1023</td>
                <td>Priya Sharma</td>
                <td>₹1599</td>
                <td>
                  <span className="status delivered">
                    Delivered
                  </span>
                </td>
              </tr>
            </tbody>

          </table>

        </div>

        {/* Low Stock */}
        <div className="seller-section">

          <div className="section-header">
            <h2>Low Stock Alerts</h2>
          </div>

          <div className="stock-alert">

            <div className="stock-item">
              <h4>Nike Shoes</h4>
              <p>Only 2 left</p>
            </div>

            <div className="stock-item">
              <h4>Wireless Earbuds</h4>
              <p>Only 4 left</p>
            </div>

            <div className="stock-item">
              <h4>T-Shirt</h4>
              <p>Only 3 left</p>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Products */}

      <div className="seller-section recent-products">

        <div className="section-header">
          <h2>Recent Products</h2>
        </div>

        <div className="products-grid">

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              alt="product"
            />
            <h4>Nike Shoes</h4>
            <p>₹2999</p>
          </div>

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1585386959984-a41552231658"
              alt="product"
            />
            <h4>Smart Watch</h4>
            <p>₹1999</p>
          </div>

          <div className="product-card">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
              alt="product"
            />
            <h4>T-Shirt</h4>
            <p>₹499</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SellerDashboard;