import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./WishList.css";
import { useNavigate } from "react-router-dom";

function WishList() {
  const [product, setProduct] = useState([]);
  const [quantity,setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/api/v1/get-wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProduct(response.data?.wishlist || []);

    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="wishlist-container">

          {/* TOP BAR - ALWAYS VISIBLE */}
            <div className="top-bar">
                <button className='home-button' onClick={() => navigate(`/user/dashboard`)}>
                    Home Page
                </button>
                <button className='cart-button' onClick={() => navigate(`/user/cart`)}>
                    View Cart
                </button>
            </div>
      <h1 className="wishlist-title">My Wishlist</h1>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="wishlist-grid">
          {product.length > 0 ? (
            product.map((item, index) => (
              <div className="product-card" key={item?._id || index}>
                <img
                  className="product-image"
                  src={item?.image || "/fallback-img.png"}
                  alt={item?.name || "product"}
                />

                <div className="product-info">
                  <h3>{item?.name}</h3>
                  <p className="price">₹ {item?.price}</p>

                  <button
                    className="buy-btn"
                    onClick={() => navigate(`/user/buy-now`,{
                      state:{
                        product : item,
                        quantity
                      }
                    })}
                  >
                    Buy Now

                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">No products in wishlist</p>
          )}
        </div>
      )}
    </div>
  );
}

export default WishList;