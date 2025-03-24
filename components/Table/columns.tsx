"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import OrderActions from "../order/OrderActions"; 
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import StatusActions from "./StatusActions";



export const getBadgeClass = (status: string, type: "order" | "payment") => {
  const statusClasses = {
    order: {
      pending: "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      processing: "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
      shipped: "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      delivered: "bg-teal-500/40 border border-teal-500 text-teal-700 dark:bg-teal-500/30 dark:border-teal-500 dark:text-teal-200",
      cancelled: "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
    },
    payment: {
      pending: "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      paid: "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      failed: "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
      refunded: "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
    },
  };

  return statusClasses[type][status.toLowerCase()] || 
         "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200";
};

export const columns: ColumnDef<OrderType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="pl-4">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pl-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Order Id",
    accessorKey: "id",
    cell: ({ row }) => {
      const router = useRouter();
  
      const handleOrderClick = () => {
        localStorage.setItem("selectedOrder", JSON.stringify(row.original));
        router.push(`/orders/${row.original.id}`);
      };
  
      return (
        <span
          onClick={handleOrderClick}
          className="font-bold underline underline-offset-2 dark:hover:text-gray-400 cursor-pointer"
        >
          {"# " + row.original.id}
        </span>
      );
    },
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ row }) => <span>{row.original.customer.name}</span>,
  },
  {
    header: "Order Value",
    accessorKey: "totalAmount",
    cell: ({ row }) => <span className="font-semibold">₹ {row.original.totalAmount.toFixed(2)}</span>,
  },
  {
    header: "Order Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusActions
        row={row}
        field="status"
        statuses={["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]}
        getStatusBadgeClass={(status) => getBadgeClass(status, "order")}
      />
    ),
  },
  {
    header: "Order Date",
    accessorKey: "orderDate",
    cell: ({ row }) => {
      const orderDate = row.original.orderDate;
      const formatDate = orderDate ? format(new Date(orderDate), "dd/MM/yy") : "N/A";
      return <span>{formatDate}</span>;
    },
  },
  {
    header: "Payment Status",
    accessorKey: "paymentStatus",
    cell: ({ row }) => (
      <StatusActions
        row={row}
        field="paymentStatus"
        statuses={["Pending", "Paid", "Failed", "Refunded"]}
        getStatusBadgeClass={(status) => getBadgeClass(status, "payment")}
      />
    ),
  },,
  {
    id: "actions",
    cell: ({ row }) => <OrderActions row={row} />,
  },
];
