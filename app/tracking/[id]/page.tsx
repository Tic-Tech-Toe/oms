"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderType } from "@/types/orderType";
import { format } from "date-fns";
import { CreditCard, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// A simple local function to format currency since the hook could not be imported.
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export default function TrackingPage() {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Get the shareKey from the URL pathname
  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/public-order/${id}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  console.log(order)

  // Load the Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Function to handle the payment process
  const handlePayment = async () => {
    if (!order) return;
    setIsPaying(true);

    try {
      // Assuming your API now creates a Razorpay Order and returns order_id
      const response = await fetch("/api/rzrpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiptId: order.id,
          amount: order.totalAmount * 100, // Amount must be in paise
          customer: {
            name: order.customer?.name,
            email: "customer@example.com", // Assuming a placeholder email
            contact: order.customer?.whatsappNumber,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        const options = {
          key: process.env.RAZORPAY_KEY_ID, // Your Key ID
          amount: data.amount,
          currency: data.currency,
          name: "Shiptrack",
          description: `Payment for Order ID: ${order.invoiceNumber || order.id}`,
          image: "https://placehold.co/100x100/A3E635/000?text=S",
          order_id: data.orderId,
          handler: function (response) {
            // Handle successful payment here
            setModalMessage("Payment successful! Your payment ID is " + response.razorpay_payment_id);
            setShowModal(true);
          },
          prefill: {
            name: order.customer?.name,
            email: "customer@example.com",
            contact: order.customer?.whatsappNumber,
          },
          modal: {
            ondismiss: function() {
              setModalMessage("Payment was cancelled. Please try again.");
              setShowModal(true);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        console.error("Payment order creation failed:", data.error);
        setModalMessage("Failed to start payment. Please try again.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      setModalMessage("An unexpected error occurred. Please try again.");
      setShowModal(true);
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading order tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading order tracking...</p>
      </div>
    );
  }

  const steps = ["Placed", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = steps.findIndex(
    (s) => s.toLowerCase() === order.status?.toLowerCase()
  );

  return (
    <>
  {/* ====== iOS Style Modal ====== */}
  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-80 text-center">
        <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-base font-medium text-zinc-800 dark:text-zinc-200">
          {modalMessage}
        </p>
        <Button
          onClick={() => setShowModal(false)}
          className="mt-5 w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Close
        </Button>
      </div>
    </div>
  )}

  {/* ====== Main Container ====== */}
  <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">

    {/* -------- Header -------- */}
    <div className="text-center space-y-1">
      <h1 className="text-2xl font-bold tracking-tight">Order Tracking</h1>
      <p className="text-xs text-gray-500">
        Invoice: {order.invoiceNumber}
      </p>
    </div>

    {/* -------- Delivery Details Card -------- */}
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Delivery Details</h2>
      </div>

      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Customer:</span> {order.customer?.name}</p>
        <p>
          <span className="font-medium">Phone:</span> +91 {order.customer?.whatsappNumber}
        </p>
        <p>
          <span className="font-medium">Order Date:</span>{" "}
          {format(new Date(order.orderDate), "dd MMM yyyy")}
        </p>
      </div>

      {/* Status Badge */}
      <div className="mt-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status.toLowerCase() === "delivered"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Tracking Link Button */}
      <a
        href={
          order.trackingLink?.startsWith("http")
            ? order.trackingLink
            : `https://${order.trackingLink}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full block text-center py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
      >
        Track Package
      </a>
    </div>

    {/* -------- Payment Card -------- */}
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold">Payment</h2>
      </div>

      <p className="text-sm mb-1">Total Payable</p>
      <p className="text-2xl font-bold text-green-600 mb-4">
        {formatCurrency(order.totalAmount)}
      </p>

      <Button
        onClick={handlePayment}
        disabled={isPaying}
        className="w-full py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
      >
        {isPaying ? "Processing..." : "Pay Now"}
      </Button>
    </div>

    {/* -------- Items -------- */}
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-3">Order Items</h2>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {order.items.map((item, idx) => (
          <div key={idx} className="py-3 flex justify-between text-sm">
            <span>{item.itemName} × {item.quantity}</span>
            <span className="font-medium">{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800 font-semibold text-sm">
        <span>Total</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>

    {/* -------- Timeline (Clean Apple Style) -------- */}
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
      <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>

      <div className="space-y-4 relative">
        {order.timeline?.map((t, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium">{t.action}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(t.date), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <p className="pt-6 text-center text-xs text-gray-400">
      🚀 Powered by ShipTrack
    </p>
  </div>
</>


  );
}