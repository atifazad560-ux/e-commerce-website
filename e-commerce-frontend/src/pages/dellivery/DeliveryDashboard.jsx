import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DeliveryDashboard() {

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:4000/api/v1/my-delivery`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data?.orders);


    } catch (error) {
      toast.error(`couldn't fetch your orders`);
      console.log(error.response?.data);
    }
  };

  return (

    <div>
      <h1>Hello {user?.name}</h1>

      <div onClick={() => navigate(`/delivery/my-delivery`)}>
        Assigned Orders : {orders.length}
      </div>


    </div>

  )
}

export default DeliveryDashboard