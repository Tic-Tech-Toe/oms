//@ts-nocheck

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
// import OrderActions from "../order/OrderActions";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import StatusActions from "./StatusActions";
import { Button } from "../ui/button";
import { ArrowUpDown, Check, MessageCircle, Pencil, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCurrency } from "@/hooks/useCurrency";


export const getBadgeClass = (status: string, type: "order" | "payment") => {
  const statusClasses: Record<"order" | "payment", Record<string, string>> = {
    order: {
      pending:
        "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      processing:
        "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
      shipped:
        "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      delivered:
        "bg-teal-500/40 border border-teal-500 text-teal-700 dark:bg-teal-500/30 dark:border-teal-500 dark:text-teal-200",
      cancelled:
        "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
    },
    payment: {
      pending:
        "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      paid: "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      failed:
        "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
      refunded:
        "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
    },
  };

  return (
    statusClasses[type]?.[status.toLowerCase()] ??
    "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200"
  );
};

export const columns = ({
  editingRowId,
  setEditingRowId,
}: {
  editingRowId: string | null;
  setEditingRowId: (id: string | null) => void;
}): ColumnDef<OrderType>[] => [
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
    cell: ({ row }) => <span>{row?.original?.customer?.name}</span>,
  },
  {
    header: "Order Value",
    accessorKey: "totalAmount",
    cell: ({ row }) => (
      <span className="font-semibold">
        ₹ {row.original.totalAmount.toFixed(2)}
      </span>
    ),
  },
  {
    header: "Order Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusActions
        key={`${row.original.id}-status-${editingRowId}`}
        row={row}
        field="status"
        statuses={[
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ]}
        getStatusBadgeClass={(status) => getBadgeClass(status, "order")}
        // forceOpen={editingRowId === row.original.id}
        isEditing={editingRowId === row.original.id}
      />
    ),
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order Date
        <ArrowUpDown className="h-2 w-2" />
      </Button>
    ),
    accessorKey: "orderDate",
    cell: ({ row }) => {
      const orderDate = row.original.orderDate;
      const formatDate = orderDate
        ? format(new Date(orderDate), "dd/MM/yy")
        : "N/A";
      return <span className="text-center ml-4">{formatDate}</span>;
    },
  },
  {
    header: "Payment Status",
    accessorKey: "paymentStatus",
    cell: ({ row }) => (
      <StatusActions
        key={`${row.original.id}-status-${editingRowId}`}
        row={row}
        field="paymentStatus"
        statuses={["Pending", "Paid", "Failed", "Refunded"]}
        getStatusBadgeClass={(status) => getBadgeClass(status, "payment")}
        isEditing={editingRowId === row.original.id}
        // forceOpen={editingRowId === row.original.id}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isEditing = editingRowId === row.original.id;

      const handleSendReminder = async () => {
        const order = row.original;
      
        const phoneNumber = order.customer?.whatsappNumber;
        if (!phoneNumber) {
          alert("Customer WhatsApp number is missing.");
          return;
        }
      
        const messageBody = [
          order.customer?.name || "Customer",
          `${ useCurrency( order.totalAmount - order.payment.totalPaid )}`, // amount due
          order.id, // invoiceId
          order.orderDate || "N/A", // dueDate (can be improved later)
          `${order.payment.totalPaid || 0}`, // paidAmount
          `${order.totalAmount}`, // totalAmount
        ];
      
        try {
          const res = await fetch("/api/payment-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, messageBody }),
          });
      
          const data = await res.json();
          if (data.success) {
            alert("✅ Payment reminder sent successfully!");
          } else {
            alert("❌ Failed to send reminder: " + data.message);
          }
        } catch (err) {
          console.error(err);
          alert("❌ Something went wrong while sending the reminder.");
        }
      };
      

      if (isEditing) {
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-600 hover:scale-105 transition-all duration-200"
                    onClick={() => {
                      // Save logic
                      setEditingRowId(null);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-md shadow-md border bg-green-200 text-black">
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:scale-105 transition-all duration-200"
                    onClick={() => setEditingRowId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-md shadow-md border bg-red-200 text-black">
                  <p>Cancel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>

          <Tooltip>
            <TooltipTrigger asChild>
            <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={() => setEditingRowId(row.original.id)}
          >
            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Button>
            </TooltipTrigger>
            <TooltipContent className=" rounded-md shadow-md border bg-cyan-500 text-black">

              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
            <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-green-100 dark:hover:bg-green-900"
            onClick={handleSendReminder}
            >
            <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </Button>
            </TooltipTrigger>
            <TooltipContent className=" rounded-md shadow-md border bg-green-500 text-black">
              <p>Send payment reminder</p>
            </TooltipContent>
          </Tooltip>
          
          
            </TooltipProvider>
        </div>
      );
    },
  },
];
