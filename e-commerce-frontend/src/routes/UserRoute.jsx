import { Navigate } from "react-router-dom"

import { useSelector } from "react-redux"

const UserRoute = ({ children }) => {


  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

   console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("role:", user?.role);
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (user?.userType?.role !== "user") {
    return <Navigate to="/" />
  }

  return children
}

export default UserRoute