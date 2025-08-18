"use client";

import TableArea from "@/components/Table/TableArea";
import StatCards from "@/components/StatCards/page";
import DashboardTable from "@/components/Table/DashboardTable";

const Overview = () => {
  

  return (
    <div className="px-2 md:px-0">
      <h1 className="md:text-3xl text-xl font-bold px-4 py-2 font-satoshi">
        Order Dashboard
      </h1>

      {/* <StatCards allOrders={allOrders} /> */}
      <StatCards />
      <DashboardTable />
      {/* <TableArea allOrders={allOrders} /> */}
    </div>
  );
};

export default Overview;
