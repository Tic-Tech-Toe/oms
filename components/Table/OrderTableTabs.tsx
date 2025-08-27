"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";

export default function OrdersTableTabs({ tabs, activeTab, setActiveTab, table }) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="mb-6 w-full"
    >
      <div className="flex items-center justify-between mb-4 mt-2 px-4 pt-2">
        
        {/* Desktop Tabs */}
        <TabsList className="hidden md:flex h-10 rounded-2xl md:rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`flex items-center gap-2 h-8 rounded-xl transition-all ${
                activeTab === tab.value
                  ? "bg-light-primary text-white"
                  : "text-gray-600"
              }`}
            >
              <span className="text-xs">{tab.label}</span>
              <span className="text-xs hidden md:inline-block">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Mobile Select */}
        <div className="md:hidden">
          <Select
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <SelectTrigger className="h-8 w-[120px] border-slate-300/30 bg-white/50 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors duration-200
               dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 rounded-full">
              <SelectValue placeholder="Select Tab" />
            </SelectTrigger>
            <SelectContent className="rounded-xl  border border-slate-300/30 bg-white shadow-lg backdrop-blur-lg p-1
               dark:border-white/10 dark:bg-slate-900/95">
              <SelectGroup className="space-y-1">
                {tabs.map((tab) => (
                  <SelectItem
                    key={tab.value}
                    value={tab.value}
                    className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors
                     text-slate-700 hover:bg-slate-100 focus:bg-slate-100
                     dark:text-slate-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:text-white"
                  >
                    {tab.label} ({tab.count})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Link href="/orders/new">
          <Button className="bg-light-primary text-white px-4 py-2 rounded-2xl hover:bg-blue-700">
            <Plus className="text-xl mr-2" />
            Add Order
          </Button>
        </Link>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="w-full mt-9"
        >
          <div className="md:rounded-md rounded-none md:border hidden md:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
