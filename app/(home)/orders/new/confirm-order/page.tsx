"use client";

import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import React from "react";

const ConfirmOrder = () => {
  const {tempOrderData} = useOrderStore(); // ✅ Zustand store to get temp order data   

  if (!tempOrderData || !tempOrderData.customer || tempOrderData.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        No order data found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-semibold text-center">Confirm Your Order</h1>

      {/* Customer Info */}
      <div className="p-4 border rounded-xl bg-white shadow">
        <h2 className="text-xl font-medium mb-2">Customer Details</h2>
        <p><span className="font-medium">Name:</span> {tempOrderData.customer.name}</p>
        <p><span className="font-medium">Phone:</span> {tempOrderData.customer.phoneNumber}</p>
        {/* Add more fields as needed */}
      </div>

      {/* Items Info */}
      <div className="p-4 border rounded-xl bg-white shadow">
        <h2 className="text-xl font-medium mb-4">Items</h2>
        <ul className="space-y-3">
          {tempOrderData.items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.itemName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <p className="font-semibold text-right">
                ₹{item.quantity * item.price}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="text-right text-xl font-bold">
        Total: ₹{tempOrderData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)}
      </div>
    </div>
  );
};

export default ConfirmOrder;
