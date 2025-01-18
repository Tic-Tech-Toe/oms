"use client"

import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Table, TableCaption } from './ui/table'
import TableArea from './Table/TableArea'
import OrderDialog from './OrderDialog'
import { orders } from '@/data/orders'
import { OrderType } from '@/types/orderType'

const Hero = () => {

  const [order, setOrder] = useState<OrderType[]>(orders);
  const addNewOrder = (newOrder: OrderType) => {
    setOrder((prevOrders) => [...prevOrders, newOrder]); // Add the new order to the orders array
  };
  return (
    <section className='w-full'>
        <h1 className='text-4xl font-bold text-light-text-primary dark:text-dark-text-primary text-center mt-6'>Welcome to <span>ShipTrack</span> 🚚🛤️</h1>
        <h2 className='text-light-text-secondary dark:text-dark-text-secondary text-center text-lg pt-2'>Track and manage orders with precision and ease. 📦🔍</h2>
        <div className='flex md:flex-row flex-col w-full  justify-center gap-4 pt-4'>
            <Link href="/order-dashboard" className='text-lg text-center font-semibold text-light-primary border-2 border-light-primary hover:border-light-button-hover h-12 px-6 py-2 rounded-md hover:scale-110'>View Dashboard</Link>
            {/* <Link href="/add-order" className='text-lg font-semibold h-12 px-6 py-2 rounded-md hover:scale-110 bg-dark-primary text-white border-2 border-light-primary'></Link> */}
            <OrderDialog  />
        </div>
        <div>
            <TableArea orders={order} />
            <div></div>
        </div>
    </section>
  )
}

export default Hero