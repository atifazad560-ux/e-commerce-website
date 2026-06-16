import axios from "axios";
import React, {
  useEffect,
  useState
} from "react";

import "./AdminProduct.css";

function AdminProduct() {

  const [product, setProduct] =
    useState([]);

  useEffect(() => {

    fetchProduct();

  }, []);

  const fetchProduct = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/api/v1/admin-product",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setProduct(
        response?.data?.products || []
      );

    }

    catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="admin-products">

      <div className="admin-products-header">

        <h1>
          Product Management
        </h1>

        <p>
          Monitor and manage all
          seller products
        </p>

      </div>

      <div className="products-grid">

        {
          product.map((item) => (

            <div
              key={item._id}
              className="product-card"
            >

              <div className="product-image-wrapper">

                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />

              </div>

              <div className="product-content">

                <h2>
                  {item.name}
                </h2>

                <div className="product-price">

                  ₹{item.price}

                </div>

                <div className="seller-info">

                  <p>
                    <span>
                      Seller:
                    </span>

                    {
                      item?.seller?.name
                    }
                  </p>

                  <p>
                    <span>
                      Email:
                    </span>

                    {
                      item?.seller?.email
                    }
                  </p>

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}

export default AdminProduct;