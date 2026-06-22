import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Cart.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Cart() {
  // const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // creating states to tarnsfer in next page using useLocation
  const [product, setProduct] = useState([])
  const [quantity, setQuantity] = useState(1)


  useEffect(() => {
    fetchData();
  }, []);



  const fetchData = async () => {
    try {
      setLoading(true);


      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `http://localhost:4000/api/v1/getCart`,
        {
          headers: {
            Authorization: `Bearer ${user, token}`
          }
        }
      );

      setProduct(response.data.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }


  };

  const removeCart = async (productId) => {
    const oldProduct = product;


    setProduct(prev =>
      prev.filter(item => item.product._id !== productId)
    );

    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      await axios.delete(
        `http://localhost:4000/api/v1/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${user, token}`
          }
        }
      );

      toast.success("Removed from cart");
    } catch (error) {
      setProduct(oldProduct);
      toast.error("Failed to remove item");
    }


  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="cart-page"> <div className="top-bar">
      <button
        className='home-button'
        onClick={() => navigate(`/user/dashboard`)}
      >
        Home Page
      </button>
    </div>


      <h1 className="cart-title">My Cart</h1>

      {product.length === 0 ? (
        <div className="empty-cart">Your cart is empty 🛒</div>
      ) : (
        <div className="cart-container">
          {product.map((item) => (
            <div className="cart-card" key={item._id}>
              <img
                className="cart-image"
                src={item.product?.image}
                alt={item.product?.name}
              />

              <div className="cart-content">
                <h2 className="product-name">
                  {item.product?.name}
                </h2>

                <h3 className="product-price">
                  ₹ {item.product?.price}
                </h3>

                <p className="product-description">
                  {item.product?.description}
                </p>

                <p>Quantity: {item.quantity}</p>

                <button className="buy-btn" onClick={() => navigate("/user/buy-now", {

                  state: {
                    product : item.product,
                    quantity: item.quantity
                  }
                }
                )}>
                  Buy Now
                </button>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeCart(item.product._id)
                  }
                >
                  Remove from cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>


  );
}

export default Cart;
