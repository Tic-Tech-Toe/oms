"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import OrderActions from "../order/OrderActions"; 
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Row } from '@tanstack/react-table';

const StatusActions = ({row}: {row: Row<OrderType>}) => {
    const [status, setStatus] = useState(row.original.status);
    
    const statuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];
    // Function to handle status change
    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      // Optional: You can call a function to update the status in the backend or elsewhere
    };

    return (
      <div className="flex items-center justify-between md:w-2/3 space-x-2">
        <Badge className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(status)}`}>
          {status}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ChevronDown size={16} className="mr-2 cursor-pointer" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
              {statuses.map((status,i) => (
                <DropdownMenuRadioItem value={status.toLowerCase()} key={i}><Badge className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(status.toLowerCase())}`}>
                {status}
              </Badge></DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
}

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200";
    case "processing":
      return "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200";
    case "shipped":
      return "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200";
    case "delivered":
      return "bg-teal-500/40 border border-teal-500 text-teal-700 dark:bg-teal-500/30 dark:border-teal-500 dark:text-teal-200";
    case "cancelled":
      return "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200";
    default:
      return "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200";
  }
};

export const getPaymentStatusBadgeClass = (paymentStatus: string) => {
  switch (paymentStatus) {
    case "pending":
      return "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200";
    case "paid":
      return "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200";
    case "failed":
      return "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200";
    case "refunded":
      return "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200";
    default:
      return "bg-red-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200";
  }
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
    cell: ({ row }) => <StatusActions row={row} />
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
      <Badge className={`rounded-full font-normal select-none shadow-none ${getPaymentStatusBadgeClass(row.original.paymentStatus || "")}`}>
        {row.original.paymentStatus || "N/A"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions row={row} />,
  },
];
