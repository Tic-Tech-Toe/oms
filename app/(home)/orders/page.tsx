"use client"
import React, { useEffect } from 'react';
import StatCards from '@/components/StatCards';
import TableArea from '@/components/Table/TableArea';
import { useOrderStore } from '@/hooks/useOrderStore'; // Access orders from the store
import EditOrderDialog from '@/components/EditOrderDialog'; 

const Overview = () => {
  const { allOrders, loadAllOrders, openEditDialog, addOrder } = useOrderStore(); // Access orders from the store

  // Load orders initially
  useEffect(() => {
    loadAllOrders();
  }, []);

  // Function to add a new order
  const handleAddOrder = async () => {
    const newOrder = {
      id: "new-order-id", // Dynamically generate order ID
      orderDate: new Date().toISOString(),
      status: "pending",
      totalAmount: 100, // Example total
      paymentStatus: "pending",
      items: [], // Example items, you can replace with real data
      customer: { name: "New Customer", whatsappNumber: "1234567890" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add order to the store
    await addOrder(newOrder);
  };

  return (
    <div className='md:mt-20'>
      <div>
        <h1 className="text-3xl font-bold px-4 py-2">Order Dashboard</h1>
      </div>
      

      {/* Stat Cards - Displays summary statistics about orders */}
      <StatCards allOrders={allOrders} />

      {/* Table Area - Pass the orders from the store */}
      <TableArea />

      {/* Conditionally render Edit Order Dialog */}
      {openEditDialog && <EditOrderDialog />}

      {/* Button to add a new order */}
      {/* <Button onClick={handleAddOrder}>
        <Plus className="text-xl mr-2" />
        Add New Order
      </Button> */}
    </div>
  );
};

export default Overview;
