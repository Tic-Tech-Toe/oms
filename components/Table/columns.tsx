"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import StatusActions from "./StatusActions";
import { Button } from "../ui/button";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  MessageCircle,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useCurrency } from "@/hooks/useCurrency";
import {
  getBadgeClass,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/utils/statusUtils";
import UpdateInvoice from "./UpdateInvoice";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/app/config/firebase";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { handleSendPaymentReminder } from "@/utils/sendPaymentReminder";

export const columns = ({
  editingRowId,
  setEditingRowId,
  showInvoice,
  toggleInvoiceVisibility,
}: {
  editingRowId: string | null;
  setEditingRowId: (id: string | null) => void;
  showInvoice: boolean;
  toggleInvoiceVisibility: () => void;
}): ColumnDef<OrderType>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="pl-4">
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="pl-4">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(v) => row.toggleSelected(!!v)}
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  // Order ID or Invoice
  {
    id: "orderOrInvoice",
    header: () => (
      <Button
        variant="ghost"
        onClick={toggleInvoiceVisibility}
        className="flex items-center gap-1"
      >
        {showInvoice ? "Invoice No." : "Order Id"}
        <ArrowUpDown className="h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const invoice = row.original.invoiceNumber || "";
      if (showInvoice) {
        return invoice && invoice.trim() !== "" ? (
          <span className="font-bold underline underline-offset-2 cursor-pointer transition-opacity duration-300">
            {invoice}
          </span>
        ) : (
          <UpdateInvoice orderId={row.original.id} invoiceNumber={invoice} />
        );
      }

      // Order ID mode
      return (
        <span
          className="font-bold underline underline-offset-2 cursor-pointer transition-opacity duration-300"
          onClick={() => {
            localStorage.setItem("selectedOrder", JSON.stringify(row.original));
            router.push(`/orders/${row.original.id}`);
          }}
        >
          {"# " + row.original.id}
        </span>
      );
    },
  },

  // Customer Name
  {
    header: "Customer Name",
    accessorKey: "customerName",
    cell: ({ row }) => <span>{row?.original?.customer?.name}</span>,
  },

  // Order Value
  {
    header: "Order Value",
    accessorKey: "totalAmount",
    cell: ({ row }) => (
      <span className="font-semibold">
        ₹ {useCurrency(row.original.totalAmount)}
      </span>
    ),
  },

  // Order Status
  {
    header: () => <div className="flex items-center gap-1">Order Status</div>,
    accessorKey: "status",
    cell: ({ row }) => (
      <StatusActions
        key={`${row.original.id}-os`}
        row={row}
        field="status"
        statuses={ORDER_STATUSES}
        getSolidStatusClass={(status) => getBadgeClass(status, "order")}
      />
    ),
  },

  // Order Date
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
        ? format(new Date(orderDate), "dd/MM/yy hh:mm a")
        : "N/A";
      return <span className="text-center ml-4">{formatDate}</span>;
    },
  },

  // Payment Status
  {
    header: () => <div className="flex items-center gap-1">Payment Status</div>,
    accessorKey: "paymentStatus",
    cell: ({ row }) => (
      <StatusActions
        key={`${row.original.id}-ps`}
        row={row}
        field="paymentStatus"
        statuses={PAYMENT_STATUSES}
        getSolidStatusClass={(status) => getBadgeClass(status, "payment")}
      />
    ),
  },

  // Actions (Save, Edit, Cancel, Reminder)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { updateOrder, loadAllOrders } = useOrderStore.getState();
      const { toast } = useToast();
      const userId = auth?.currentUser?.uid;
      const order=row.original;
      // const handleSendReminder = async () => {
      //   const order = row.original;
      //   const phoneNumber = order.customer?.whatsappNumber;
      //   if (!phoneNumber) {
      //     alert("Customer WhatsApp number is missing.");
      //     return;
      //   }

      //   const messageBody = [
      //     order.customer?.name || "Customer",
      //     `${useCurrency(order.totalAmount - (order?.payment?.totalPaid || 0))}`,
      //     order.invoiceNumber || order.id,
      //     order.orderDate || "N/A",
      //     `${order?.payment?.totalPaid || 0}`,
      //     `${order.totalAmount}`,
      //   ];

      //   try {
      //     const res = await fetch("/api/payment-reminder", {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ phoneNumber, messageBody }),
      //     });

      //     const data = await res.json();
      //     if (data.success) {
      //       toast({
      //         title: "Success",
      //         description: "Payment reminder sent successfully.",
      //       });
            
      //     } else {
      //       toast({
      //         title: "Failed ",
      //         description: "Payment reminder was not sent.",
      //         variant: "destructive",
      //       });
            
      //     }
      //   } catch (err) {
      //     console.error(err);
      //     alert("❌ Something went wrong while sending the reminder.");
      //   }
      // };

      const handleDelete = async () => {
        const confirmDelete = confirm(
          "Are you sure you want to delete this order?"
        );
        if (!confirmDelete) return;

        try {
          if (!userId) {
            // Handle the case where userId is undefined
            console.error("User ID is not defined");
            return;
          }
          const orderDoc = doc(db, "users", userId, "orders", row.original.id);
          await deleteDoc(orderDoc);
          await loadAllOrders(userId || ""); // Refresh local state
          toast({
            title: "Deleted",
            description: "Order has been removed.",
            variant: "destructive",
          });
        } catch (error) {
          console.error("Delete failed:", error);
          toast({
            title: "Error",
            description: "Could not delete the order. Try again.",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-green-100 dark:hover:bg-green-900"
                  onClick={() => {
                    let selectedDueDate = new Date().toISOString().split("T")[0]; // Default today
                  
                    const toastId = toast({
                      title: "Set Due Date",
                      description: (
                        <div className="flex flex-col gap-2">
                          <input
                            type="date"
                            id="dueDateInput"
                            className="border rounded p-2 w-full"
                            defaultValue={selectedDueDate}
                            onChange={(e) => {
                              selectedDueDate = e.target.value;
                            }}
                          />
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                await handleSendPaymentReminder(row.original, selectedDueDate); // ✅ Send the selected due date
                                dismiss(toastId.id);
                              }}
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => dismiss(toastId.id)}
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ),
                      duration: 999999, // Until manually closed
                    });
                  }}
                  
                >
                  <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl shadow-md border bg-green-300 text-black">
                <p>Send payment reminder</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl shadow-md border bg-red-300 text-black">
                <p>Delete order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
