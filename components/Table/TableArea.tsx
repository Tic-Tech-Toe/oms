"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Download, Receipt, ReceiptText, Search } from "lucide-react";
import { columns } from "./columns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming table components are imported here
import { Input } from "../ui/input";
import Pagination from "../pagination/Pagination";
import { OrderType } from "@/types/orderType";
import { useOrderStore } from "@/hooks/useOrderStore"; // Assuming a custom store to manage orders
import OrderDialog from "../OrderDialog";

export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

const TableArea = () => {
  const { allOrders, loadAllOrders } = useOrderStore();
  console.log(allOrders);
  const tabs = [
    { value: "all", label: "All Orders", count: allOrders.length },
    {
      value: "pending",
      label: "Pending",
      count: allOrders.filter((f) => f.status === "pending").length,
    },
    {
      value: "shipped",
      label: "Shipped",
      count: allOrders.filter((f) => f.status === "shipped").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: allOrders.filter((f) => f.status === "delivered").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: allOrders.filter((f) => f.status === "cancelled").length,
    },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [columnFilters, setColumnFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });

  useEffect(() => {
    loadAllOrders();
  }, []);

  const filteredData = useMemo(() => {
    if (activeTab === "all") return allOrders;
    return allOrders.filter((data) => data.status.toLowerCase() === activeTab);
  }, [activeTab, allOrders]);

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedData = useMemo(() => filteredData, [filteredData]);
  
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      columnFilters,
    },
  });

  useEffect(() => {
    table.getColumn("customerName")?.setFilterValue(searchQuery);
  }, [searchQuery, table]);

  return (
    <Card className="md:m-6 shadow-none">
      <div className="md:p-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="mb-6 w-full"
        >
          {/* Desktop Tabs List */}
          <div className="flex items-center justify-between mb-4 mt-2 max-md:flex-col max-lg:gap-2 max-sm:items-start">
            <div className="flex px-1 md:px-0 gap-4">
              <TabsList className="h-10 rounded-xl md:rounded-md">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center md:gap-4 gap-2 h-8 md:rounded-md rounded-xl transition-all ${
                      activeTab === tab.value
                        ? "bg-light-primary text-white"
                        : "text-gray-600"
                    }`}
                  >
                    <span className="text-xs">{tab.label}</span>
                    {/* <ReceiptText className="md:hidden"/> */}
                    <span
                      className={`size-5 rounded-full ${
                        activeTab === tab.value
                          ? "text-dark-primary"
                          : "text-gray-500"
                      } text-xs  items-center justify-center hidden md:flex`}
                    >
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* SearchBar */}
            {/* <div className="bg-light-light-gray font-semibold dark:bg-dark-dark-gray flex md:w-2/5 w-full rounded-md justify-around relative  p-2">
              <Input
                placeholder="Search..."
                className="h-10 border-none px-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0 !important"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <div className="dark:bg-light-text-secondary/[0.6] absolute bottom-1 right-1 rounded-md bg-dark-dark-gray p-2">
                <Button className="h-8 border-none shadow-none">
                  <Search size={48} strokeWidth={4} className="text-white" />
                </Button>
              </div>
            </div> */}

            {/* Button for Download */}
            <div className="flex items-center justify-center md:justify-end w-full gap-2 px-2 md:px-0">
              <Button className="flex items-center gap-2 max-lg:w-full  bg-light-primary hover:bg-light-button-hover">
                <Download className="size-4 text-white" />
                <span className="text-white">Download as CSV</span>
              </Button>
              <OrderDialog />
            </div>
          </div>

          {/* Tabs Content */}
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="w-full mt-9"
            >
              {activeTab === tab.value && (
                <div className="md:rounded-md rounded-none border-none  md:border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={table.getAllColumns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Pagination
        table={table}
        pagination={pagination}
        setPagination={setPagination}
      />
      {/* <h1>Hi</h1> */}
    </Card>
  );
};

export default TableArea;
