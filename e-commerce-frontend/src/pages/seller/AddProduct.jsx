import { useState, useEffect } from "react";
import "./AddProduct.css";
import React from "react";
import axios from "axios";

const AddProduct = () => {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: ""
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 fetch categories from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const user =localStorage.getItem('user');
      const res = await axios.get("http://localhost:4000/api/v1/categories" ,
        {
          headers :{
            Authorization:`Bearer ${user , token}`
          }
        }
      );
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      const response = await axios.post(
        "http://localhost:4000/api/v1/add-product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user , token}`
          }
        }
      );

      alert(response.data.message);

      // reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        image: "",
        stock: ""
      });

    } catch (error) {
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="addProductContainer">

      <div className="addProductCard">

        <h2>Add Product</h2>

       
        <form
          onSubmit={handleSubmit}
          className="addProductForm"
        >

          <div className="productFormGroup">

            <label>Product Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

          <div className="productFormGroup">

            <label>Price</label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
            />

          </div>

          <div className="productFormGroup">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />

          </div>

          {/* 🔥 CATEGORY DROPDOWN FIX */}
          <div className="productFormGroup">

            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

          </div>

          <div className="productFormGroup">

            <label>Image URL</label>

            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={handleChange}
            />

          </div>

          <div className="productFormGroup">

            <label>Stock</label>

            <input
              type="number"
              name="stock"
              placeholder="Enter stock quantity"
              value={formData.stock}
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="addProductBtn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>

      </div>

    </div>

  );
};

export default AddProduct;