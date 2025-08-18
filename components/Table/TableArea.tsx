import React, { useMemo, useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { columns } from "./columns";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "../pagination/Pagination";
import { OrderType } from "@/types/orderType";
import OrderDialog from "../add-order/OrderDialog";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrdersTableTabs from "./OrderTableTabs";
import DashboardMobileOrderCards from "./DashboardsMobile";

export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

interface TableAreaProps {
  allOrders: OrderType[];
}

const TableArea: React.FC<TableAreaProps> = ({ allOrders }) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 8,
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const tabs = [
    { value: "all", label: "All Orders", count: allOrders.length },
    {
      value: "pending",
      label: "Pending",
      count: allOrders.filter((f) => f.status.toLowerCase() === "pending")
        .length,
    },
    {
      value: "shipped",
      label: "Shipped",
      count: allOrders.filter((f) => f.status.toLowerCase() === "shipped")
        .length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: allOrders.filter((f) => f.status.toLowerCase() === "delivered")
        .length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: allOrders.filter((f) => f.status.toLowerCase() === "cancelled")
        .length,
    },
  ];

  // Filter by tab, then by search term
  const filteredData = useMemo(() => {
    let data =
      activeTab === "all"
        ? allOrders
        : allOrders.filter((o) => o.status.toLowerCase() === activeTab);
    const search = globalFilter.trim().toLowerCase();
    if (search) {
      data = data.filter((o) => {
        const invoice = o.invoiceNumber || "";
        return (
          o.id.toLowerCase().includes(search) ||
          (o.customer?.name || "").toLowerCase().includes(search) ||
          invoice.toLowerCase().includes(search)
        );
      });
    }
    return data;
  }, [allOrders, activeTab, globalFilter]);

  const memoizedColumns = useMemo(
    () =>
      columns({
        editingRowId,
        setEditingRowId,
        showInvoice,
        toggleInvoiceVisibility: () => setShowInvoice((prev) => !prev),
      }),
    [editingRowId, showInvoice]
  );

  const table = useReactTable({
    data: filteredData,
    columns: memoizedColumns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const col = table.getColumn("orderOrInvoice");
    if (col) col.toggleVisibility(true);
  }, [showInvoice, table]);

  return (
    <Card className="md:m-6 shadow-none rounded-[2.5rem] dark:bg-zinc-900 bg-neutral-100 ">
      <div className="md:p-8">
        {/* Search bar */}
        {/* <div className="mb-4 flex justify-end">
          <Input
            placeholder="Search by order ID, customer, or invoice"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div> */}

        {/* Tabs and Add Order button */}
        <OrdersTableTabs tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} table={table} />
        <DashboardMobileOrderCards orders={filteredData} />
      </div>
      <Pagination
        table={table}
        pagination={pagination}
        setPagination={setPagination}
      />
    </Card>
  );
};

export default TableArea;
