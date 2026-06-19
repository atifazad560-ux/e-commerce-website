import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "./ViewProduct.css";
import { toast } from 'react-toastify';

function ViewProduct() {

    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        viewData();
    }, [])


    // For viewing a specific product of HomePage
    const viewData = async () => {
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            const response = await axios.get(`http://localhost:4000/api/v1/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user, token}`
                    }
                }
            );
            setProduct(response.data.product);
        }

        catch (error) {
            console.log(error);

        }
    }




    // add to cart api post function

    const addToCart = async (cartProductId) => {
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            const response = await axios.post(`http://localhost:4000/api/v1/add-cart`,
                { cartProductId },
                {
                    headers: {
                        Authorization: `Bearer ${user, token}`
                    }
                }
            )


            if (response.data.carted) {
                toast.success("product added to cart")
            } else {
                toast.info("Removed from cart")
            }
        } catch (error) {
            console.log(error);

        }
    }


    return (
        <div className="page-wrapper">

            {/* TOP BAR - ALWAYS VISIBLE */}
            <div className="top-bar">
                <button onClick={() => navigate(`/user/dashboard`)}>
                    Home Page
                </button>
            </div>

            {/* CONTENT */}
            <div className="view-product-container">

                {!product ? (
                    <div className="loading">Loading product...</div>
                ) : (
                    <div className="view-product-card">
                        <img
                            src={product?.image || "/fallback img.png"}
                            alt={product?.name}
                        />

                        <h2>{product?.name}</h2>
                        <p>{product?.description}</p>
                        <h3>₹{product?.price}</h3>

                        <div className="action-buttons">
                            <button className="cart-btn" onClick={() => addToCart(product._id)}>
                                Add to Cart
                            </button>
                            <button className="buy-btn">
                                Buy Now
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ViewProduct