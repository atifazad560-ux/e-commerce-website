import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/v1/signup",
        formData
      );

      setMessage(res.data.message || "Signup successful!");

      // redirect to Verify email page in 2 Second

      setTimeout(() => {
        navigate('/verify-email', { state: { email: formData.email } });
      }, 2000);

    } catch (err) {
      if (err.message === 'User already exists' || err.message?.includes('already exists')) {
        setError('This email is already registered. Please login or use a different email.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
      console.error('Signup error:', err?.response?.data);
    } finally {
      setLoading(false);
    };
  }


  return (
    <div className="signup-container">
      <h2 className="title">Create Account</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="input"
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="input"
        />

        <button className="btn" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignUp;