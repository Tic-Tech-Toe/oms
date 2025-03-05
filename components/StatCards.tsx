import { CheckCircle, DollarSign, IndianRupee, Recycle } from 'lucide-react';
import React, { ReactNode } from 'react'
import { Card } from './ui/card';
import { OrderType } from '@/types/orderType';
import { useCurrency } from '@/hooks/useCurrency';


type SingleCard = {
    title: string;
    value: string;
    icon: ReactNode;
}

const SingleStatCard = ({SingleCard}:{SingleCard: SingleCard}) => {
    return(
        <Card className='p-4 flex flex-col gap-2 shadow-none'>
            <div className='flex items-center justify-between'>
                <span className='text-sm font-semibold dark:text-dark-text-secondary text-light-text-primary'>
                    {SingleCard.title}
                </span>
                <div className='size-7 rounded-md flex items-center justify-center text-sm bg-light-primary/25 font-bold text-dark-primary'>
                    {SingleCard.icon}
                </div>
            </div>
            <div className='text-3xl font-bold'>{SingleCard.value}</div>
        </Card>
    )
}

const StatCards = ({allOrders}:{allOrders:OrderType[]}) => {
    const orderInProgress = allOrders.filter(order => order.status === "shipped" || order.status === "processing").length;
    const stats: SingleCard[] = [
        {
            title: "Total Sales",
            value:  useCurrency((allOrders.reduce((sum, order) => sum + order.totalAmount, 0))),
            icon: <IndianRupee />
        },
        {
            title: "Order in progress",
            value: orderInProgress.toString(),
            icon: <Recycle />
        },
        {
            title: "Completed Orders",
            value: (allOrders.length-orderInProgress).toString(),
            icon: <CheckCircle />
        }
    ]
  return (
    <div className='grid grid-cols-3 max-sm:grid-cols-1 mt-7 gap-6 p-6'>
        {stats.map((stat,index) => (
            <SingleStatCard key={index} SingleCard={stat} />
        ))}
    </div>
  )
}

export default StatCards