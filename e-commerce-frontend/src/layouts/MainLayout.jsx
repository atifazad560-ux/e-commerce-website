import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar"

const MainLayout = () => {

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  )
}

export default MainLayout