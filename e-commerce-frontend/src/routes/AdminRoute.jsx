import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // ✅ FIXED ROLE PATH + REDIRECT
  if (user?.userType?.role !== "admin") {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute