"use client";

import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useCurrency } from "@/hooks/useCurrency";
import { Mail, Phone } from "lucide-react";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
import { useEffect, useState } from "react";

export default function InvoicePreview({
  order,
  userDoc,
  isPaid,
  paidDate,
  invoiceRef,
  userId
}: any) {
  const balanceDue = order.totalAmount - (order.payment?.totalPaid || 0);
  const [customer, setCustomer] = useState<any>(null);
   const getCustomerById = useCustomerStore((state) => state.getCustomerById);
  useEffect(() => {
    let isMounted = true; // prevent state update after unmount
    async function fetchCustomer() {
      if (!userId || !order?.customer?.id) return;
      const data = await getCustomerById(userId, order.customer.id);
      if (isMounted) setCustomer(data);
    }
    fetchCustomer();
    return () => {
      isMounted = false;
    };
  }, [userId, order?.customer?.id]);

  console.log("Fetched customer:", customer);
  return (
    <div
      ref={invoiceRef}
      className="bg-white dark:bg-zinc-950 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 relative overflow-hidden"
    >
      {/* PAID Watermark */}
      {isPaid && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] pointer-events-none">
          <span className="text-7xl sm:text-8xl font-extrabold text-green-600 dark:text-green-500 opacity-10">
            PAID
          </span>
          {paidDate && (
            <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-sm text-green-600 dark:text-green-500 opacity-20">
              {format(paidDate, "dd MMM yyyy, hh:mm a")}
            </span>
          )}
        </div>
      )}

      {/* === HEADER === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userDoc?.company || "Your Company Name"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userDoc?.tagline || "Trusted Partner in Quality Products"}
          </p>
          <p className="text-sm text-gray-500 mt-1 inline-flex items-center gap-1">
            {userDoc?.email && <><div>
                 <Mail size={16} fill="black" className="inline-flex" /> {userDoc.email}
              </div></>}{" "}
            {userDoc?.phone && (
              <div>
                 <Phone size={16} fill="black" className="inline-flex" /> {userDoc.phone}
              </div>
            )}
          </p>
          {userDoc?.GSTNumber && (
            <p className="text-xs text-gray-500 mt-1">
              GSTIN: <span className="font-medium">{userDoc.GSTNumber}</span>
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-0 md:text-right">
          <h2 className="text-xl font-semibold">INVOICE</h2>
          <p className="text-sm text-gray-500">
            Invoice No: {order.invoiceNumber || `INV-${order.id.slice(0, 6)}`}
          </p>
          <p className="text-sm text-gray-500">
            Date: {format(new Date(order.orderDate), "dd MMM yyyy")}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* === BILL FROM / BILL TO === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Bill From
          </h2>
          <p className="text-sm">{userDoc?.company}</p>
          {userDoc?.address && (
            <p className="text-sm text-gray-500">{userDoc.address}</p>
          )}
          {userDoc?.GSTNumber && (
            <p className="text-sm text-gray-500">
              GSTIN: {userDoc.GSTNumber}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Bill To
          </h2>
          <p className="text-sm font-medium">{customer?.name}</p>
          <p className="text-sm text-gray-500">
            +91 {customer?.whatsappNumber}
          </p>
          {customer?.shippingAddress && (
            <p className="text-sm text-gray-500">
              {customer.shippingAddress.replaceAll("|", ", ")}
            </p>
          )}
          {customer?.GSTNumber && (
            <p className="text-sm text-gray-500">
              GSTIN: {customer.GSTNumber}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Customer ID: {customer?.id}
          </p>
        </div>
      </div>

      {/* === ITEMS TABLE === */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 mb-8">
        <table className="min-w-full border-collapse">
          <thead className="bg-zinc-100 dark:bg-zinc-900">
            <tr className="text-left text-sm font-semibold">
              <th className="p-3">Item</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, idx: number) => (
              <tr
                key={idx}
                className="text-sm border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="p-3">{item.itemName}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{useCurrency(item.price)}</td>
                <td className="p-3 text-right">{useCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* === TOTAL SUMMARY === */}
      <div className="flex justify-end">
        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.subtotal.toLocaleString()}</span>
          </div>
          {order.charges.map((charge: any) => (
            <div key={charge.id} className="flex justify-between">
              <span>{charge.name}</span>
              <span>
                {charge.type === "percent"
                  ? `${charge.value}%`
                  : `₹${charge.value}`}
              </span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>₹{order.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span>₹{order.payment?.totalPaid.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between text-red-600 font-bold">
            <span>Balance Due:</span>
            <span>₹{balanceDue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* === ORDER TIMELINE === */}
      <div>
        <h2 className="font-semibold mb-3">Order Timeline</h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
          {order.timeline.map((event: any, idx: number) => (
            <li key={idx}>
              <span className="font-medium">{event.action}</span> –{" "}
              {format(new Date(event.date), "dd MMM yyyy, hh:mm a")}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        Thank you for your business ✨
      </div>
    </div>
  );
}
