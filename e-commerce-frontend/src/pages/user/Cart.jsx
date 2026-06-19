import axios from 'axios';
import React from 'react'
import "./Cart.css";
import { useEffect } from 'react';
import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart() {

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:4000/api/v1/get-cart`,
        {
          headers: {
            Authorization: `Bearer ${user, token}`
          }
        }
      )
      setCart(response.data.cart);
      setLoading(false)

    } catch (error) {
      toast.error(error?.response?.data)
    }
  }
  return(
    <div className="cart-page">
      <h1 className="cart-title">My Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty 🛒</div>
      ) : (
        <div className="cart-container">
          {cart.map((item) => (
            <div className="cart-card" key={item._id}>
              <img
                className="cart-image"
                src={item?.image}
                alt={item?.name}
              />

              <div className="cart-content">
                <h2 className="product-name">{item?.name}</h2>

                <h3 className="product-price">₹ {item?.price}</h3>

                <p className="product-description">
                  {item?.description}
                </p>

                <button className="buy-btn">Buy Now</button>
                
                <button className="remove-btn">Remove from cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart
