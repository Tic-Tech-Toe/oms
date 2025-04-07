"use client"
import React, { useEffect, useState } from 'react';
import StatCards from '@/components/StatCards';
import TableArea from '@/components/Table/TableArea';
import { useOrderStore } from '@/hooks/useOrderStore'; // Access orders from the store
import EditOrderDialog from '@/components/EditOrderDialog'; 
import { auth } from '@/app/config/firebase';
import { getOrders } from '@/utils/getFireStoreOrders';
import { onAuthStateChanged } from 'firebase/auth';

const Overview = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orders,setOrders]=useState([])

   // Listen to user auth state and set userId
   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (user) {
         setUserId(user.uid);
       } else {
         console.warn("User not logged in.");
       }
     });
 
     return () => unsubscribe();
   }, []);
 
   // Fetch customers when userId is available
   useEffect(() => {
     const fetchOrders = async () => {
       if (!userId) return;
       const data = await getOrders(userId);
       setOrders(data);
     };
     fetchOrders();
   }, [userId]);

  // Function to add a new order
  // const handleAddOrder = async () => {
  //   const newOrder = {
  //     id: "new-order-id-test-1", // Dynamically generate order ID
  //     orderDate: new Date().toISOString(),
  //     status: "processing",
  //     totalAmount: 100, // Example total
  //     paymentStatus: "pending",
  //     items: [], // Example items, you can replace with real data
  //     customer: { name: "New Customer", whatsappNumber: "1234567890" },
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };

  //   // Add order to the store
  //   await addOrder(newOrder);
  // };

  return (
    <div className=''>
      <div>
        <h1 className="text-3xl font-bold px-4 py-2 font-satoshi">Order Dashboard</h1>
      </div>
      

      {/* Stat Cards - Displays summary statistics about orders */}
      <StatCards allOrders={orders} />

      {/* Table Area - Pass the orders from the store */}
      <TableArea allOrders={orders} />

      {/* Conditionally render Edit Order Dialog */}
      {/* {openEditDialog && <EditOrderDialog />} */}

      {/* Button to add a new order */}
      {/* <Button onClick={handleAddOrder}>
        <Plus className="text-xl mr-2" />
        Add New Order
      </Button> */}
    </div>
  );
};

export default Overview;
