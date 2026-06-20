import axios from "axios";
import { useEffect, useState } from "react";
import "./UserDashboard.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const [data, setData] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchWishlist();
  }, []);


  // for fetching data from server to user HomePage
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


  // for fetching wish list to toggle the heart 
  const fetchWishlist = async () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:4000/api/v1/get-wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // assuming backend returns array of products
      const ids = res.data.wishlist.map(item => item._id);
      setWishlist(ids);

    } catch (err) {
      console.log(err);
    }
  };


  // add to wishList api call function
  const addToWishList = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:4000/api/v1/add-wishlist",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // backend tells if added or removed
      const isAdded = response.data.wishlisted;

      if (isAdded) {
        setWishlist(prev => [...prev, productId]);
        toast.success("Added to wishlist");
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.info("Removed from wishlist");
      }

    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>Created by Atif Azad</h2>
        <button onClick={() => navigate('/user/cart')}>View Cart</button>
      </nav>

      <section className="hero">
        <h1>Discover Premium Products</h1>
        <p>Best deals from trusted sellers</p>
      </section>

      <div className="products-grid">
        {data.map((item) => (

          <div className="product-card" key={item._id}>

            <div
              className={`wishlist ${wishlist.includes(item._id) ? "active" : ""}`}
              onClick={() => addToWishList(item._id)}
            >
              ♥
            </div>
            
            <img src={item?.image || "/fallback img.png"} alt={item.name} />

            <div className="product-info">
              <h2>{item.name}</h2>

              <p className="description">{item.description}</p>

              <h3>₹{item.price}</h3>

              <button onClick={() => navigate(`/user/view-product/${item._id}`)}>
                View Product
              </button>

            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default UserDashboard;