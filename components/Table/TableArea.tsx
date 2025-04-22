import React, { useMemo, useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { columns } from "./columns";
import {
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "../pagination/Pagination";
import { OrderType } from "@/types/orderType";
import OrderDialog from "../OrderDialog";

export interface PaginationType {
  pageIndex: number;
  pageSize: number;
}

interface TableAreaProps {
  allOrders: OrderType[];
}

const TableArea: React.FC<TableAreaProps> = ({ allOrders }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationType>({ pageIndex: 0, pageSize: 8 });
  const [showInvoice, setShowInvoice] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const tabs = [
    { value: "all", label: "All Orders", count: allOrders.length },
    { value: "pending", label: "Pending", count: allOrders.filter(f => f.status === "pending").length },
    { value: "shipped", label: "Shipped", count: allOrders.filter(f => f.status === "shipped").length },
    { value: "delivered", label: "Delivered", count: allOrders.filter(f => f.status === "delivered").length },
    { value: "cancelled", label: "Cancelled", count: allOrders.filter(f => f.status === "cancelled").length },
  ];

  const filteredData = useMemo(() => {
    if (activeTab === "all") return allOrders;
    return allOrders.filter((data) => data?.status.toLowerCase() === activeTab);
  }, [activeTab, allOrders]);

  const memoizedColumns = useMemo(() => {
    return columns({
      editingRowId,
      setEditingRowId,
      showInvoice, // Pass this state to columns
      toggleInvoiceVisibility: () => setShowInvoice(prev => !prev),
    });
  }, [editingRowId, showInvoice]); // Re-create columns when state changes

  const table = useReactTable({
    data: filteredData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  });

  // ✅ Toggle column visibility on switch
  useEffect(() => {
    const orderOrInvoiceCol = table.getColumn("orderOrInvoice");
  
    if (orderOrInvoiceCol) {
      orderOrInvoiceCol.toggleVisibility(true); // Always show since it handles both
    }
  }, [showInvoice, table]);
  

  return (
    <Card className="md:m-6 shadow-none">
      <div className="md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 w-full">
          {/* Tabs UI goes here... */}
        </Tabs>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={() => {
                      if (header.id === "orderId") {
                        setShowInvoice(prev => !prev);
                      }
                    }}
                    className={`cursor-pointer transition-all ${header.id === "orderId" ? "hover:text-dark-primary font-medium" : ""}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isEditing = editingRowId === row.original.id;
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={`transition-all ${isEditing ? "bg-muted/40" : ""}`}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination table={table} pagination={pagination} setPagination={setPagination} />
    </Card>
  );
};

export default TableArea;
