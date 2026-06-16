import { Navigate } from "react-router-dom"

import { useSelector } from "react-redux"

const DeliveryRoute = ({ children }) => {

  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

 if (user?.userType?.role !== "delivery") {
  return <Navigate to="/" />
}

  return children
}

export default DeliveryRoute