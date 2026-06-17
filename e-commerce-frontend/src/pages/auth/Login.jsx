import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import API from "../../api/axios"

import { loginSuccess } from "../../redux/features/authSlice"



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

    // Email validation

    if (!formData.email) {

      newErrors.email = "Email is required"
    }

    else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {

      newErrors.email = "Invalid email format"
    }

    // Password validation

    if (!formData.password) {

      newErrors.password =
        "Password is required"
    }

    else if (
      formData.password.length < 6
    ) {

      newErrors.password =
        "Password must be at least 6 characters"
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
    if (!validateForm()) {
      return
    }

    try {

      const response = await API.post(
        "/login",
        formData
      )

      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      })
      )

      const role = response.data.user?.userType?.role

      if (role === "admin") {
        navigate("/admin/dashboard")
      }

      else if (role === "seller") {
        navigate("/seller/dashboard")
      }
      else if (role === "delivery") {
        navigate("/delivery/dashboard")
      }

      else {
        navigate("/user/dashboard")
      }
      

    }



    catch (error) {

      console.log(error)

      alert(
        error.response?.data?.message ||
        "Login failed"
      )
    }
  }

  return (

    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        {
          errors.email && (
            <p style={{ color: "red" }}>
              {errors.email}
            </p>
          )
        }

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />

        {
          errors.password && (
            <p style={{ color: "red" }}>
              {errors.password}
            </p>
          )
        }

        <br />
        <br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  )
}

export default Login