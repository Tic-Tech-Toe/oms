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

const SingleStatCard = ({ SingleCard }: { SingleCard: SingleCard }) => {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-br from-white via-light-background to-slate-100 dark:from-[#1f1f1f] dark:via-dark-dark-gray dark:to-[#121212] shadow-md dark:shadow-none border border-light-border dark:border-dark-border transition-all hover:scale-[1.015] hover:shadow-lg dark:hover:shadow-xl cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
            {SingleCard.title}
          </span>
          <div className="size-9 min-w-9 rounded-full bg-gradient-to-br from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent flex items-center justify-center text-white shadow-sm">
            {SingleCard.icon}
          </div>
        </div>
        <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {SingleCard.value}
        </div>
      </div>
    );
  };
  
  

  const StatCards = ({ allOrders }: { allOrders: OrderType[] }) => {
    const orderInProgress = allOrders.filter(order =>
      order.status === "shipped" || order.status === "processing"
    ).length;
  
    const stats: SingleCard[] = [
      {
        title: "Total Sales",
        value: useCurrency(allOrders.reduce((sum, order) => sum + order.totalAmount, 0)),
        icon: <IndianRupee className="w-5 h-5" />
      },
      {
        title: "Orders in Progress",
        value: orderInProgress.toString(),
        icon: <Recycle className="w-5 h-5" />
      },
      {
        title: "Completed Orders",
        value: (allOrders.length - orderInProgress).toString(),
        icon: <CheckCircle className="w-5 h-5" />
      }
    ];
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mt-8">
        {stats.map((stat, index) => (
          <SingleStatCard key={index} SingleCard={stat} />
        ))}
      </div>
    );
  };
  

export default StatCards