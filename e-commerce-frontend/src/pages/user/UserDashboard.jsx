import { useSelector } from "react-redux"

const UserDashboard = () => {

  const { user } = useSelector(
    (state) => state.auth
  )

  return (
    <div>

      <h1>User Dashboard</h1>

      <h2>Welcome {user?.name}</h2>

      <p>Role: {user?.role}</p>

    </div>
  )
}

export default UserDashboard