import { Routes, Route } from "react-router-dom"

import MainLayout from "../layouts/MainLayout"

// Public Pages
import Home from "../pages/home/Home"
import Login from "../pages/auth/Login"
import SignUp from "../pages/auth/SignUp"
import Navbar from "../components/common/Navbar"


// User
import UserDashboard from "../pages/user/UserDashboard"
import UserRoute from "./UserRoute"

// Admin
import AdminRoute from "./AdminRoute"
import AdminDashboard from "../pages/admin/AdminDashboard"
import CreateSeller from "../pages/admin/CreateSeller"
import CreateDeliveryBoy from "../pages/admin/CreateDeliveryBoy"
import CreateCategory from "../pages/admin/CreateCategory"
import AdminUser from "../pages/admin/AdminUser"
import AdminProduct from "../pages/admin/AdminProduct"
import AdminOrders from "../pages/admin/AdminOrders"
import AdminSetting from "../pages/admin/AdminSetting"

// Seller
import SellerRoute from "./SellerRoute"
import SellerDashboard from "../pages/seller/SellerDashboard"
import AddProduct from "../pages/seller/AddProduct"
import MyProduct from "../pages/seller/MyProduct"
import Order from "../pages/seller/Order"

// Delivery
import DeliveryRoute from "./DeliveryRoute"
import DeliveryDashboard from "../pages/dellivery/DeliveryDashboard"
import DashboardLayout from "../components/dashboard/DashboardLayout"
import VerifyEmail from "../pages/auth/VerifyEmail"



const AppRoutes = () => {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<MainLayout />}>

        <Route index element={<Home />} />

        <Route path="login" element={<Login />} />

        <Route path="signup" element={<SignUp />} />

        <Route path="verify-email" element={<VerifyEmail />} />


      </Route>


      {/* USER ROUTES */}
      <Route
        path="/user"
        element={
          <UserRoute>
            <Navbar />
            <DashboardLayout role="user" />
          </UserRoute>
        }
      >

        <Route path="dashboard" element={<UserDashboard />} />

      </Route>


      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Navbar />
            <DashboardLayout role="admin" />
          </AdminRoute>
        }
      >

        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="get-user" element={<AdminUser />} />

        <Route path="products" element={<AdminProduct />} />

        <Route path="create-seller" element={<CreateSeller />} />

        <Route path="create-delivery-boy" element={<CreateDeliveryBoy />} />

        <Route path="category" element={<CreateCategory />} />

        <Route path="orders" element={<AdminOrders />} />

        <Route path="settings" element={<AdminSetting />} />

      </Route>


      {/* SELLER ROUTES */}
      <Route
        path="/seller"
        element={
          <SellerRoute>
            <Navbar />
            <DashboardLayout role="seller" />
          </SellerRoute>
        }
      >

        <Route path="dashboard" element={<SellerDashboard />} />

        <Route path="add-products" element={<AddProduct />} />

        <Route path="my-products" element={<MyProduct />} />

        <Route path="orders" element={<Order />} />

      </Route>


      {/* DELIVERY ROUTES */}
      <Route
        path="/delivery"
        element={
          <DeliveryRoute>
            <MainLayout />
          </DeliveryRoute>
        }
      >

        <Route path="dashboard" element={<DeliveryDashboard />} />

      </Route>

    </Routes>

  )
}

export default AppRoutes