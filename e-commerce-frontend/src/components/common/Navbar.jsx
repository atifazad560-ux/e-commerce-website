import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { logout } from "../../redux/features/authSlice"

const Navbar = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

const handleLogout = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")

  dispatch(logout())

  navigate("/login")
}

  return (
    <nav
      style={{
        background: "black",
        padding: "15px",
        display: "flex",
        gap: "20px",
        alignItems: "center"
      }}
    >

      <Link to="/" style={{ color: "white" }}>
        Home
      </Link>

      {
        !isAuthenticated ? (
          <>

            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>

            <Link to="/signup" style={{ color: "white" }}>
              Signup
            </Link>

          </>
        ) : (

          <>

            {
              user?.role === "admin" && (

                <Link
                  to="/admin/dashboard"
                  style={{ color: "white" }}
                >
                  Admin Dashboard
                </Link>

              )
            }

            {
              user?.role === "seller" && (

                <Link
                  to="/seller/dashboard"
                  style={{ color: "white" }}
                >
                  Seller Dashboard
                </Link>

              )
            }

            {
              user?.role === "delivery" && (

                <Link
                  to="/delivery/dashboard"
                  style={{ color: "white" }}
                >
                  Delivery Dashboard
                </Link>

              )
            }

            {
              user?.role === "user" && (

                <Link
                  to="/user/dashboard"
                  style={{ color: "white" }}
                >
                  User Dashboard
                </Link>

              )
            }

            <span
             style={{ color: "yellow" }}
             onClick={()=>navigate(`/${user?.userType?.role}/profile`)}>
              👤{user?.name}
            </span>

            <button
              onClick={handleLogout}

              style={{
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>

          </>

        )
      }

    </nav>
  )
}

export default Navbar