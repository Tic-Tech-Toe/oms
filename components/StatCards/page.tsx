import React from 'react'
import ProfitCard from './ProfitCard';
import { SalesChart } from './SalesChart';

const StatCards = () => {
  return (
  <div className="md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 ">
    {/* First Card - Square Profit Card */}
    <div className="w-full md:col-span-1 rounded-[2.5rem] dark:bg-zinc-900 flex items-center justify-center bg-neutral-100">
      {/* <ProfitCard /> */}
      <SalesChart />
    </div>

    {/* Second Card - Wide Chart Card */}
    <div className="w-full md:col-span-2 rounded-[2.5rem] dark:bg-zinc-900 flex items-center justify-center bg-neutral-100">
      {/* <span className="text-sm font-medium">Chart Area</span> */}
      <SalesChart />
    </div>
  </div>
);


}

export default StatCards