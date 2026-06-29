import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import "./ChangePassword.css";

function ChangePassword() {

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (password.newPassword !== password.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    changePassword();
  };

  const changePassword = async () => {
    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.put(
        `http://localhost:4000/api/v1/change-delivery-password`,
        {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
          confirmPassword: password.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success(response.data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h1 className="change-password-title">Change Password</h1>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <input
            className="password-input"
            type="password"
            name='oldPassword'
            placeholder='Old Password'
            value={password.oldPassword}
            onChange={handleChange}
          />

          <input
            className="password-input"
            type="password"
            name='newPassword'
            placeholder='New Password'
            value={password.newPassword}
            onChange={handleChange}
          />

          <input
            className="password-input"
            type="password"
            name='confirmPassword'
            placeholder='Confirm Password'
            value={password.confirmPassword}
            onChange={handleChange}
          />

          <button className="submit-password-btn" type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;