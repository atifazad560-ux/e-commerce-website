import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalDelivery: 0,
    totalProducts: 0,
    totalOrders: 0,
  })

  const navigate = useNavigate();


  useEffect(() => {
    fetchStats();
  }, [])

const fetchStats = async () =>{

  try {
    const user= localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
console.log("TOKEN:", token);
    const response =await axios.get('http://localhost:4000/api/v1/dashboard-stats',
      {
        headers : {
          Authorization : `Bearer ${user, token}`
        }
      }
    )

    setStats(response.data.stats);

  } catch (error) {
    console.log(error);
    
  }
}
  return (
    <div className="admin-dashboard">


      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>
          Manage users, sellers, products and orders from one place.
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div onClick={()=>navigate(`/admin/get-user`)}>
            <h3>Total Users</h3>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div>
            <h3>Total Sellers</h3>
            <h2>{stats.totalSellers}</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div>
            <h3>Total Delivery Boy</h3>
            <h2>{stats.totalDelivery}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div onClick={()=>navigate(`/admin/products`)}>
            <h3>Total Products</h3>
            <h2>{stats.totalProducts}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div onClick={()=>navigate(`/admin/orders`)}>
            <h3 >Total Orders</h3>
            <h2>{stats.totalOrders}</h2>
          </div>
        </div>

      </div>

      <div className="dashboard-section">

        <h2>Platform Overview</h2>

        <div className="overview-card">
          <p>
            Dashboard statistics will appear here once backend APIs are connected.
          </p>
        </div>

      </div>

    </div>


  );
}

export default AdminDashboard;
