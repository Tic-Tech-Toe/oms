"use client";

import TableArea from "@/components/Table/TableArea";
import StatCards from "@/components/StatCards/page";
import DashboardTable from "@/components/Table/DashboardTable";
import NotificationBell from "@/components/NotificationBell";

const Overview = () => {
  

  return (
    <div className="px-2 md:px-0">
      <div className="w-full flex justify-between md:pr-8 items-center mb-6 md:mb-0">

      <h1 className="md:text-3xl text-xl font-bold px-4 py-2 font-satoshi">
        Order Dashboard
      </h1>
      </div>

      {/* <StatCards allOrders={allOrders} /> */}
      <StatCards />
      <DashboardTable />
      {/* <TableArea allOrders={allOrders} /> */}
    </div>
  );
};

export default Overview;
