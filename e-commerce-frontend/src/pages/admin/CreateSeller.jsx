import React, { useState } from "react";
import "./CreateSeller.css";
import axios from "axios";


const CreateSeller = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

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

  const token=localStorage.getItem('token');
  const user = localStorage.getItem('user')
  
  const response = await axios.post("http://localhost:4000/api/v1/create-seller",
    formData,
  {
    headers:{
      Authorization:`Bearer ${user,token}`
    }
  });

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: ""
      });

    } catch (error) {

      // console.log(error.response);

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
    <div className="createSellerContainer">

      <div className="createSellerCard">

        <h2>Create Seller</h2>
        <p>Add new seller account</p>

        <form onSubmit={handleSubmit}>

          <div className="formGroup">
            <label>Seller Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter seller name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Mobile</label>

            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="createSellerBtn"
          >
            {
              loading
                ? "Creating..."
                : "Create Seller"
            }
          </button>

        </form>

      </div>

    </div>
  );
};

export default CreateSeller;