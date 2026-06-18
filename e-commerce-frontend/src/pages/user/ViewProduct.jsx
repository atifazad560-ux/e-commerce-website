import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./ViewProduct.css";

function ViewProduct() {

    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        viewData();
    }, [])


    // For viewing a specific product of HomePage
    const viewData = async () => {
        try {
            const user = localStorage.getItem('user');

            const response = await axios.get(`http://localhost:4000/api/v1/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user}`
                    }
                }
            );
            setProduct(response.data.product);
        }

        catch (error) {
            console.log(error);

        }
    }


    return (
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
                </div>
            )}
        </div>
    );
}

export default ViewProduct