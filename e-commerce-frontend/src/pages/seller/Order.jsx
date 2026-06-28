import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function Order() {

  const [orders, setOrders] = useState([]);


  useEffect(() => {
    sellerOrders();
  }, []);

  
  const sellerOrders = async () => {

    try {
      const token = localStorage.getItem(`token`);
      const response = await axios.get(`http://localhost:4000/api/v1/seller-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data.sellerOrders)
      console.log(response.data);

    } catch (error) {
      toast.error(`couldn't fetch your data`);
      console.log(error.message);

    }
  }

  return (
    <div>
      <h1>Orders</h1>

     <div>
      {orders.map((items)=>(
        <div key={items._id}>
          <h2>Product Name : {items?.productName}</h2>
          <h5>Total Quantity : {items?.quantity}</h5>
          <h5>Costumer Name : {items?.userName}</h5>
          <h5>Delivery Adress : {items?.deliveryAddress}</h5>
          <h5>Delivery Boy : {items?.deliveryBoy}</h5>
          <h5>Delivery Boy Contact : {items?.deliveryBoyPhone || "contact not available"}</h5>
          <h5>Order Status : {items?.orderStatus}</h5>
        </div>
      ))}
     </div>

     
    </div>
  )
}

export default Order