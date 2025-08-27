"use client";

import { auth } from '@/app/config/firebase';
import { useOrderStore } from '@/hooks/zustand_stores/useOrderStore';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react'
import TableArea from './TableArea';
import DashboardMobileOrderCards from './DashboardsMobile';

const DashboardTable = () => {
    const { allOrders, loadAllOrders } = useOrderStore();

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
    <div className='mt-4'>
        <TableArea allOrders={allOrders} />
        {/* <DashboardMobileOrderCards /> */}
    </div>
  )
}

export default DashboardTable