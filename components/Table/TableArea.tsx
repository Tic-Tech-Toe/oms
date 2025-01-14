"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import Pagination from "../pagination/Pagination";

const TableArea = () => {
  const tabs = [
    { value: "all", label: "All Orders", count: 88 },
    { value: "pending", label: "Pending", count: 22 },
    { value: "shipped", label: "Shipped", count: 22 },
    { value: "delivered", label: "Delivered", count: 22 },
    { value: "cancelled", label: "Cancelled", count: 22 },
  ];

  const [activeTab, setActiveTab] = useState("all");

  return (
    <Card className="m-6 shadow-none">
      <div className="p-8">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="mb-6 w-full"
        >
          {/* Desktop Tabs List */}
          <div className="flex items-center justify-between mb-4 max-md:flex-col max-lg:gap-2 max-sm:items-start">
            <div className="hidden md:flex flex-wrap gap-4">
              <TabsList className="h-10">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`flex items-center gap-4 h-8 rounded-md transition-all ${
                      activeTab === tab.value
                        ? "bg-light-primary text-white"
                        : "text-gray-600"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`size-5 rounded-full ${
                        activeTab === tab.value
                          ? "text-dark-primary"
                          : "text-gray-500"
                      } text-xs flex items-center justify-center`}
                    >
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden w-full ">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-light-background text-dark-dark-gray dark:bg-dark-dark-gray dark:text-light-light-gray border rounded-md p-2"
              >
                {tabs.map((tab) => (
                  <option key={tab.value} value={tab.value}>
                    {tab.label} ({tab.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Button for Download */}
            <Button className="flex items-center gap-2 max-lg:w-full max-sm:mb-4 bg-light-primary hover:bg-light-button-hover text-black">
              <Download className="size-4" />
              <span>Download as CSV</span>
            </Button>
          </div>

          {/* Tabs Content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="w-full mt-9">
              {activeTab && (<span>{tab.value}</span>)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Pagination />
    </Card>
  );
};

export default TableArea;                                                                                       
