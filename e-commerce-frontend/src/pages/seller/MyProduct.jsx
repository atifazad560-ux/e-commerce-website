import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyProduct.css';

function MyProduct() {

  const [product, setProduct] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {

    try {

      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:4000/api/v1/my-products',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProduct(response?.data?.products || []);

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="my-products-container">

      <h2 className="my-products-title">
        My Products
      </h2>

      {
        product?.length > 0 ? (

          <div className="products-grid">

            {
              product.map((item) => (

                <div
                  className="product-card"
                  key={item._id}
                >

                  <div className="product-image-wrapper">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                    />

                  </div>

                  <div className="product-content">

                    <h3 className="product-name">
                      {item.name}
                    </h3>

                    <p className="product-price">
                      ₹ {item.price}
                    </p>

                    <p className="product-description">
                      {item.description}
                    </p>

                  </div>

                </div>

              ))
            }

          </div>

        ) : (

          <p className="no-products">
            No Products Found
          </p>

        )
      }

    </div>

  );
}

export default MyProduct;
