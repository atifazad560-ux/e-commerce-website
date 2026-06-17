import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AdminUser.css";

function AdminUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:4000/api/v1/get-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-users-page">

      {/* Header */}
      <div className="admin-users-header">
        <h1>Users Management</h1>
        <p>Manage all registered users in your platform</p>
      </div>

      {/* Table Card */}
      <div className="admin-users-card">

        <table className="admin-users-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Orders</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="table-row">

                <td className="user-name">
                  {user.name}
                </td>

                <td className="user-email">
                  {user.email}
                </td>

                <td className="user-mobile">
                  {user.mobile || "N/A"}
                </td>

                <td>
                  <span
                    className={
                      user.isVerified
                        ? "status verified"
                        : "status unverified"
                    }
                  >
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </td>

                <td className="user-orders">
                  {user.ordersCount}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default AdminUser;