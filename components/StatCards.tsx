import {
  CheckCircle,
  IndianRupee,
  Recycle,
  Clock4,
  Repeat,
} from 'lucide-react';
import React, { ReactNode } from 'react';
import { OrderType } from '@/types/orderType';
import { useCurrency } from '@/hooks/useCurrency';
import dayjs from 'dayjs';

type SingleCard = {
  title: string;
  value: string;
  icon: ReactNode;
  subtitle?: string;
  additionalInfo?: string;
};

const SingleStatCard = ({ SingleCard }: { SingleCard: SingleCard }) => {
  return (
    <div className="relative rounded-2xl p-6 bg-gradient-to-br from-white/70 via-slate-100/70 to-white/30 dark:from-[#1f1f1f] dark:via-[#121212] dark:to-[#0a0a0a] backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl transition-all hover:scale-[1.05] hover:shadow-2xl cursor-pointer group">
      {/* Floating icon */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-purple-600 dark:to-pink-600 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition">
        {SingleCard.icon}
      </div>

      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide mb-1">
        {SingleCard.title}
      </div>
      <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {SingleCard.value}
      </div>
      {SingleCard.subtitle && (
        <div className="text-xs text-muted-foreground mt-1">
          {SingleCard.subtitle}
        </div>
      )}
      
      {/* On hover: extra details */}
      <div className="absolute inset-0 flex justify-center items-center bg-opacity-40 bg-black rounded-2xl opacity-0 group-hover:opacity-100 transition-all">
        <div className="text-center text-white p-4 bg-black/60 rounded-lg">
          <div className="text-lg font-semibold">More Insights</div>
          <div className="text-sm">{SingleCard.additionalInfo}</div>
        </div>
      </div>
    </div>
  );
};

const StatCards = ({ allOrders }: { allOrders: OrderType[] }) => {
  const now = dayjs();
  const startOfWeek = now.startOf('week');
  const thisWeeksOrders = allOrders.filter(order =>
    dayjs(order.orderDate).isAfter(startOfWeek)
  );

  // Calculate total unique customers and repeat customers
  const uniqueCustomerIds = new Set(allOrders.map(order => order.customerId));
  const repeatCustomerIds = allOrders.filter((order, _, arr) => {
    return arr.filter(o => o.customerId === order.customerId).length > 1;
  });

  // Count orders in specific states
  const orderInProgress = allOrders.filter(order =>
    ['Shipped', 'Processing'].includes(order.status)
  ).length;
  const completedOrders = allOrders.filter(order => order.status === 'Delivered').length;

  // Calculate total sales (currency converted)
  const totalSales = allOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  // Stats array based on actual data
  const stats: SingleCard[] = [
    {
      title: 'Total Sales',
      value: useCurrency(totalSales),
      subtitle: `${allOrders.length} total orders`,
      additionalInfo: `Total sales: ${useCurrency(totalSales)} from ${allOrders.length} orders.`,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    {
      title: 'Orders This Week',
      value: thisWeeksOrders.length.toString(),
      subtitle: `${dayjs().format('MMM D')}–Now`,
      additionalInfo: `Orders this week: ${thisWeeksOrders.length}`,
      icon: <Clock4 className="w-5 h-5" />,
    },
    // {
    //   title: 'Repeat Customers',
    //   value: repeatCustomerIds.length.toString(),
    //   subtitle: `of ${uniqueCustomerIds.size} total customers`,
    //   additionalInfo: `Repeat customers: ${repeatCustomerIds.length}. Repeat customer rate: ${(
    //     (repeatCustomerIds.length / uniqueCustomerIds.size) *
    //     100
    //   ).toFixed(1)}%`,
    //   icon: <Repeat className="w-5 h-5" />,
    // },
    {
      title: 'Orders in Progress',
      value: orderInProgress.toString(),
      subtitle: 'Shipped or Processing',
      additionalInfo: `Orders in progress: ${orderInProgress}`,
      icon: <Recycle className="w-5 h-5" />,
    },
    {
      title: 'Completed Orders',
      value: completedOrders.toString(),
      subtitle: 'Delivered successfully',
      additionalInfo: `Completed orders: ${completedOrders}. Completion rate: ${
        (completedOrders / allOrders.length) * 100
      }%`,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 mt-8">
      {stats.map((stat, index) => (
        <SingleStatCard key={index} SingleCard={stat}  />
      ))}
    </div>
  ); 
};

export default StatCards;
