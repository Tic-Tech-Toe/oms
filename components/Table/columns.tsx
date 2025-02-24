"use client";

import { orders } from "@/data/orders";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import OrderActions from "../order/OrderActions"; 
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { getPaymentStatusBadgeClass, getStatusBadgeClass } from "@/lib/utils";



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
      <Badge className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(row.original.status)}`}>
        {row.original.status}
      </Badge>
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
