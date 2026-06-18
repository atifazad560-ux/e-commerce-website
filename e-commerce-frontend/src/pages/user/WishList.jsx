import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./WishList.css";

function WishList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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

      setData(response.data?.wishlist || []);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (product) => {
    console.log("Buy:", product);
    toast.success(`Buying ${product.name}`);
  };

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="wishlist-grid">
          {data.length > 0 ? (
            data.map((item, index) => (
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
                    onClick={() => handleBuyNow(item)}
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