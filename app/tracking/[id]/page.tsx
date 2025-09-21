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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 max-w-sm mx-auto text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">{modalMessage}</p>
            <Button
              onClick={() => setShowModal(false)}
              className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
          <p className="text-sm text-gray-500">
            Order ID: {order.invoiceNumber || id}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-6 relative">
          {steps.map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div
                className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  index <= currentStep ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10">
            <div
              className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                width: `${(currentStep / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Delivery Info Card */}
          <div className="bg-white flex-1 dark:bg-zinc-950 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Delivery Details</h2>
            </div>
            <p className="text-sm">Customer: {order.customer?.name}</p>
            <p className="text-sm">Phone: +91 {order.customer?.whatsappNumber}</p>
            <p className="text-sm">
              Date: {format(new Date(order.orderDate), "dd MMM yyyy")}
            </p>
            <Badge
              className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.status}
            </Badge>

            <div className="mt-4">
              <a
                href={
                  order?.trackingLink?.startsWith("http")
                    ? order.trackingLink
                    : `https://${order.trackingLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
              >
                Track Package
              </a>
            </div>
          </div>
          {/* Payment Card */}
          <div className="bg-white flex flex-col justify-between dark:bg-zinc-950 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>
            <div>
              <p className="text-sm mb-2">Total Payable</p>
              <p className="text-xl font-bold text-green-600 mb-4">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            <Button
              onClick={handlePayment}
              disabled={isPaying}
              className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium shadow hover:bg-green-700 transition"
            >
              {isPaying ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span>
                  {item.itemName} × {item.quantity}
                </span>
                <span className="font-medium">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-semibold text-sm">
            <span>Total:</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          🚀 Powered by Shiptrack
        </div>
      </div>
    </>
  );
}