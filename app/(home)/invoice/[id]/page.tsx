"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getBadgeClass } from "@/utils/statusUtils";
import { OrderType } from "@/types/orderType";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";
import { Printer } from "lucide-react";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderType | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
    }
  }, []);

  const handleSendInvoice = async () => {
    if (!invoiceRef.current || !order) return;

    try {
      // 1. Generate PDF Blob
      const opt = {
        margin: 0.5,
        filename: `invoice_${order.invoiceNumber || order.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      const pdfBlob: Blob = await html2pdf().set(opt).from(invoiceRef.current).outputPdf("blob");

      // 2. Convert Blob to Base64
      const base64Pdf = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // 3. Call Send Invoice API
      const res = await fetch("/api/send-inv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerNumber: order.customer?.whatsappNumber,
          fileName: opt.filename,
          fileData: base64Pdf, // sending base64 pdf to backend
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Invoice sent successfully via WhatsApp!");
      } else {
        alert("❌ Failed to send invoice.");
      }
    } catch (err) {
      console.error("Send invoice error:", err);
      alert("❌ Error while sending invoice.");
    }
  };
  const handleDownloadPDF = () => {
    if (!invoiceRef.current || !order) return;

    const options = {
      margin: 0.5,
      filename: `invoice_${order.invoiceNumber || order.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(invoiceRef.current).save();
  };

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading invoice...</p>
      </div>
    );
  }

  const balanceDue = order.totalAmount - (order.payment?.totalPaid || 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Actions */}
      <div className="flex justify-end gap-4 mb-4">
        <Button onClick={handleDownloadPDF} className="rounded-xl flex gap-2 px-4 py-2">
          <Printer />
          <span>Print as pdf</span>
        </Button>
        <Button onClick={handleSendInvoice} className="rounded-xl px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white">
          Send Invoice via WhatsApp
        </Button>
      </div>


      {/* Invoice */}
      <div
        ref={invoiceRef}
        className="bg-white dark:bg-zinc-950 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
            <p className="text-sm text-gray-500">
              Invoice No: {order.invoiceNumber || `INV-${order.id.slice(0, 6)}`}
            </p>
            <p className="text-sm text-gray-500">
              Date: {format(new Date(order.orderDate), "dd MMM yyyy")}
            </p>
          </div>
          {/* <div className="text-right">
            <Badge
              className={`text-xs rounded-full ${getBadgeClass(
                order.paymentStatus || "",
                "payment"
              )}`}
            >
              {order.paymentStatus}
            </Badge>
            <br />
            <Badge
              className={`mt-2 text-xs rounded-full ${getBadgeClass(
                order.status || "",
                "order"
              )}`}
            >
              {order.status}
            </Badge>
          </div> */}
        </div>

        <Separator className="my-6" />

        {/* Parties Info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Seller Info */}
          <div>
            <h2 className="font-semibold mb-1">From</h2>
            <p className="text-sm">Your Company Pvt Ltd</p>
            <p className="text-sm">123 Street, Bangalore</p>
            <p className="text-sm">support@yourcompany.com</p>
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="font-semibold mb-1">Bill To</h2>
            <p className="text-sm">{order.customer?.name}</p>
            <p className="text-sm">+91 {order.customer?.whatsappNumber}</p>
            <p className="text-sm">Customer ID: {order.customer?.id}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 mb-8">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr className="text-left text-sm font-semibold">
                <th className="p-3">Item</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-sm border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="p-3">{item.itemName}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">
                    ₹{item.price.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    ₹{item.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.charges.map((charge) => (
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

        {/* Timeline */}
        <div>
          <h2 className="font-semibold mb-3">Order Timeline</h2>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
            {order.timeline.map((event, idx) => (
              <li key={idx}>
                <span className="font-medium">{event.action}</span> –{" "}
                {format(new Date(event.date), "dd MMM yyyy, hh:mm a")}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Thank you for your business ✨
        </div>
      </div>
    </div>
  );
}
