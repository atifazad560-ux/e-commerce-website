import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import API from "../../api/axios"
import { loginSuccess } from "../../redux/features/authSlice"

import "./Login.css"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    let newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await API.post("/login", formData)

      dispatch(
        loginSuccess({
          user: response.data.user,
          token: response.data.token
        })
      )

      const role = response.data.user?.userType?.role

      if (role === "admin") navigate("/admin/dashboard")
      else if (role === "seller") navigate("/seller/dashboard")
      else if (role === "delivery") navigate("/delivery/dashboard")
      else navigate("/user/dashboard")

    } catch (error) {
      alert(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to continue</p>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="footer-text">
            Don’t have an account? <span onClick={()=>navigate(`/signup`)}>Sign up</span>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login