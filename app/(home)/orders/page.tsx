//@ts-nocheck

"use client";
import React, { useEffect } from "react";
import StatCards from "@/components/StatCards";
import TableArea from "@/components/Table/TableArea";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import EditOrderDialog from "@/components/EditOrderDialog";
import { auth } from "@/app/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Overview = () => {
  const {
    allOrders,
    loadAllOrders,
  } = useOrderStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadAllOrders(user.uid); // 🔥 Load into Zustand
      } else {
        console.warn("User not logged in.");
      }
    });

    return () => unsubscribe();
  }, [loadAllOrders]);

  return (
    <div>
      <h1 className="text-3xl font-bold px-4 py-2 font-satoshi">
        Order Dashboard
      </h1>

      <StatCards allOrders={allOrders} />
      <TableArea allOrders={allOrders} />
    </div>
  );
};

export default Overview;
