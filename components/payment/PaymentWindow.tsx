"use client";

import React, { useState } from "react";

interface PaymentWindowProps {
  plan: "monthly" | "yearly";
  user: any;
  onClose: () => void;
}

const PaymentWindow: React.FC<PaymentWindowProps> = ({ plan, user, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const receiptId = `receipt_${Date.now()}`;
    //   const amount = plan === "monthly" ? 1200 * 100 : 12000 * 100; // in paise
    const amount = 100;

      const customer = {
        name: user?.displayName || "Guest",
        email: user?.email || "no-email",
        contact: "9635901369",
      };

      const res = await fetch("/api/rzrpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId, amount, customer,plan }),
      });

      const data = await res.json();
      if (data.success) {
        window.open(data.paymentLinkUrl, "_blank");
      } else {
        console.error("Payment link failed:", data.error);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Subscription</h2>
        <p className="text-gray-600 mb-6">
          You have selected the{" "}
          <span className="font-semibold text-indigo-600">
            {plan === "monthly" ? "Monthly Plan (₹1)" : "Yearly Plan (₹12000)"}
          </span>
          . Continue to payment?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Yes, Pay Now"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentWindow;
