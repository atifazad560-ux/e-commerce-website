import axios from "axios";
import { useEffect, useState } from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = localStorage.getItem("user");

      const response = await axios.get(
        "http://localhost:4000/api/v1/get-all-products",
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      setData(response?.data?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Created by Atif Azad</h2>
        <button>Cart</button>
      </nav>

      <section className="hero">
        <h1>Discover Premium Products</h1>
        <p>Best deals from trusted sellers</p>
      </section>

      <div className="products-grid">
        {data.map((item) => (
<div className="product-card" key={item._id}>
  <div className="wishlist">♡</div>

  <img src={item.image} alt={item.name} />

  <div className="product-info">
    <h2>{item.name}</h2>
    <p className="description">{item.description}</p>
    <h3>₹{item.price}</h3>
    <button>View Product</button>
  </div>
</div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;