import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { toast } from 'react-toastify';
import "./Profile.css";


function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    address: "",
    dob: "",
    gender: ""
  })


  // to store userProfile data 


  useEffect(() => {
    getUserProfile()
  }, []);


  const getUserProfile = async () => {

    try {
      const token = localStorage.getItem(`token`);

      const response = await axios.get(`http://localhost:4000/api/v1/get-profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfile(response.data.profile)
      console.log(response.data.profile);

    } catch (error) {
      toast.error(response.error)
      console.log(error);

    }
  }


  const updateUserProfile = async (e) => {

    e.preventDefault()

    try {
      const token = localStorage.getItem(`token`);

      const response = await axios.put(`http://localhost:4000/api/v1/update-profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`Profile Updated`)

    } catch (error) {
      toast.error(`Couldn't Update`)

    }
  }

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }



  return (
    <div className="profile-page">

      <h1 className="profile-title">Profile</h1>

      <div className="profile-card">
        <form className="profile-form" onSubmit={updateUserProfile}>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              name='name'
              placeholder='Name'
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile</label>
            <input
              className="form-input"
              type="phone"
              name='mobile'
              placeholder='Phone'
              value={profile.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              className="form-input"
              type="text"
              name='address'
              placeholder='Address'
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">DOB</label>
            <input
              className="form-input"
              type="date"
              name='dob'
              placeholder='Date of Birth'
              value={profile.dob || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button className="update-btn" type='submit'>
            Update
          </button>

        </form>
      </div>
    </div>
  )
}

export default Profile