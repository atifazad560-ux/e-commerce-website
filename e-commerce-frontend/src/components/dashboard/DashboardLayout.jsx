// DashboardLayout.jsx

import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./DashboardLayout.css";
import { useSelector } from "react-redux";

function DashboardLayout({ role }) {

  const location = useLocation();

  const { user } = useSelector((state) => state.auth)

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      name: "Create Seller",
      path: "/admin/create-seller"
    },
    {
      name: "Create Product Category",
      path : "/admin/category"
    },
    {
      name: "Users",
      path: "/admin/users"
    },
    {
      name: "Products",
      path: "/admin/products"
    },
    {
      name: "Orders",
      path: "/admin/orders"
    },
    {
      name: "Settings",
      path: "/admin/settings"
    }

  ];

  const sellerLinks = [
    {
      name: "Dashboard",
      path: "/seller/dashboard"
    },
    {
      name: "Add Product",
      path: "/seller/add-products"
    },
    {
      name: "My Products",
      path: "/seller/my-products"
    },
    {
      name: "Orders",
      path: "/seller/orders"
    }
  ];

  const userLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard"
    },
    {
      name: "Profile",
      path: "/user/profile"
    },
    {
      name: "My Orders",
      path: "/user/orders"
    }
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "seller"
        ? sellerLinks
        : userLinks;

  return (

    <div className="dashboard-layout">

      {/* Sidebar */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-top">

          <h2 className="sidebar-logo">
            {user?.name}
          </h2>

          <p className="sidebar-role">
            {role} panel
          </p>

        </div>

        <nav className="sidebar-nav">

          {
            links.map((link, index) => (

              <Link
                key={index}
                to={link.path}
                className={
                  location.pathname === link.path
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                {link.name}
              </Link>
            ))
          }

        </nav>

      </aside>

      {/* Main Content */}

      <main className="dashboard-main">

        <div className="dashboard-main-content">
          {/* {children} */}
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;