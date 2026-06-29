import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import "./Order.css";

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
    <div className='order-page'>
      <h1 className='order-heading'>Orders</h1>

     <div className='orders-container'>
      {orders.map((items)=>(
        <div key={items._id} className='order-card'>
          <h2 className='product-name'>Product Name : {items?.productName}</h2>
          <h5 className='order-info'>Total Quantity : {items?.quantity}</h5>
          <h5 className='order-info'>Costumer Name : {items?.userName}</h5>
          <h5 className='order-info'>Delivery Adress : {items?.deliveryAddress}</h5>
          <h5 className='order-info'>Delivery Boy : {items?.deliveryBoy}</h5>
          <h5 className='order-info'>Delivery Boy Contact : {items?.deliveryBoyPhone || "contact not available"}</h5>
          <h5 className='order-status'>Order Status : {items?.orderStatus}</h5>
        </div>
      ))}
     </div>
    </div>
  )
}

export default Order