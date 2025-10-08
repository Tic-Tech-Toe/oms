"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentWindow from "@/components/payment/PaymentWindow";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

// --- Plan Definitions ---
const allPlans = [
  {
    id: 1,
    title: "Starter",
    priceMonthly: 1200,
    priceYearly: 12000,
    featuresMonthly: [
      "Track up to 50 shipments",
      "Email notifications",
      "Basic analytics",
    ],
    featuresYearly: [
      "Track up to 50 shipments",
      "Email notifications",
      "Basic analytics",
      "Save 15% yearly",
    ],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
  {
    id: 2,
    title: "Pro",
    priceMonthly: 2500,
    priceYearly: 25000,
    featuresMonthly: [
      "Unlimited shipments",
      "SMS + Email alerts",
      "Advanced analytics",
      "Priority support",
    ],
    featuresYearly: [
      "Unlimited shipments",
      "SMS + Email alerts",
      "Advanced analytics",
      "Priority support",
      "Save 15% yearly",
    ],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
  {
    id: 3,
    title: "Enterprise",
    priceMonthly: 5000,
    priceYearly: 50000,
    featuresMonthly: [
      "Custom shipment limits",
      "Dedicated account manager",
      "API & integrations",
      "24/7 support",
    ],
    featuresYearly: [
      "Custom shipment limits",
      "Dedicated account manager",
      "API & integrations",
      "24/7 support",
      "Custom annual savings",
    ],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
];

// --- Main Checkout Page Component ---
const CheckoutPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPlanId = parseInt(searchParams.get("planId") || "2"); // Default to Pro (ID 2)
  const initialCycle =
    searchParams.get("cycle") === "monthly" ? "monthly" : "yearly"; // Default to yearly

  // State for billing cycle, loading, and payment dialog
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    initialCycle
  );
  const [loading, setLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const planData = allPlans.find((p) => p.id === initialPlanId);

  // Fallback to a default plan if the ID is invalid
  const defaultPlan = {
    title: "Error: Plan Not Found",
    price: 0,
    features: ["Please return to the pricing page to select a valid plan."],
    id: "error",
  };

  const selectedPlan = useMemo(() => {
    if (!planData) return defaultPlan;

    const isMonthly = billingCycle === "monthly";
    const priceKey = isMonthly ? "priceMonthly" : "priceYearly";
    const featuresKey = isMonthly ? "featuresMonthly" : "featuresYearly";
    const title = planData.title + (isMonthly ? " (Monthly)" : " (Yearly)");

    return {
      id: planData.id.toString(), // Convert to string for key
      title: title,
      price: planData[priceKey],
      features: isMonthly ? planData.featuresMonthly : planData.featuresYearly,
    };
  }, [planData, billingCycle]);

  // --- Price Calculation with useMemo for efficiency ---
  const priceDetails = useMemo(() => {
    const subtotal = selectedPlan.price; // Use the dynamic price
    const tax = subtotal * 0.18; // Example: 18% GST
    const total = subtotal + tax;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      totalForApi: Math.round(total * 100), // Price in paise for Razorpay
    };
  }, [selectedPlan]);

  const handlePayment = () => {
    console.log("Proceeding to payment for:", selectedPlan.title);
    setShowPaymentDialog(true);
  };

  // Effect to handle routing if user is not available
  useEffect(() => {
    // You might want to redirect if the user is not logged in after a short delay
    // if (!user) router.push('/login');
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {/* --- Back Navigation --- */}
      <div className="w-full max-w-5xl mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Plans
        </button>
      </div>

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 grid lg:grid-cols-2">
        {/* --- Left Column: Order Summary --- */}
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Summary
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review your subscription details before payment.
          </p>

          {initialCycle === 'monthly' && (
            <div className="mt-8">
              <BillingToggle 
                billingCycle={billingCycle} 
                setBillingCycle={setBillingCycle} 
              />
            </div>
          )}

          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedPlan.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {useCurrency(priceDetails.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax (18% GST)
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {useCurrency(priceDetails.tax)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                Total
              </span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {useCurrency(priceDetails.total)}
              </span>
            </div>
          </div>
        </div>

        {/* --- Right Column: Payment Details --- */}
        <div className="p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Details
          </h2>

          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You are subscribing as:
            </p>
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/8.x/initials/svg?seed=${user?.displayName || "User"}`
                }
                alt="User Avatar"
                className="w-14 h-14 rounded-full border-2 border-indigo-200 dark:border-indigo-800 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/8.x/initials/svg?seed=User`;
                }}
              />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {user?.displayName || "Valued User"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex-grow flex flex-col justify-end">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `Proceed to Pay ${useCurrency(priceDetails.total)}`}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Lock size={12} />
              <span>Secure payment via Razorpay</span>
              <ShieldCheck size={12} />
            </div>
          </div>
        </div>
      </main>

      {/* --- Payment Dialog Modal --- */}
      {showPaymentDialog && (
        <PaymentWindow
          plan={selectedPlan.id}
          user={user}
          amount={priceDetails.totalForApi}
          onClose={() => setShowPaymentDialog(false)}
        />
      )}

      <footer className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} ShipTrack. All Rights Reserved.</p>
        <p className="mt-1">
          Need help?{" "}
          <a
            href="#"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </footer>
    </div>
  );
};

// --- Helper Component for Billing Toggle ---
const BillingToggle = ({ billingCycle, setBillingCycle }) => {
  // Determine if the toggle is in the 'yearly' state
  const isYearly = billingCycle === "yearly";

  // Base classes for the outer container
  const containerClasses =
    "relative flex max-w-sm mx-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner-sm";

  // Classes for the sliding indicator
  const indicatorClasses = `
    absolute top-1 bottom-1 w-1/2
    bg-white dark:bg-purple-600
    rounded-lg shadow-md
    transition-transform duration-300 ease-in-out
  `;

  // Calculate the transform for the indicator
  const indicatorStyle = {
    transform: isYearly ? "translateX(100%)" : "translateX(0)",
  };

  // Base classes for the buttons
  const buttonBaseClasses =
    "relative z-10 w-1/2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ease-in-out tracking-wide";

  // Classes for the active button text
  const activeTextClasses = "text-purple-700 dark:text-white";

  // Classes for the inactive button text
  const inactiveTextClasses = "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";

  // Classes for the 'SAVE' badge
  const badgeClasses = `
    ml-2 px-2 py-0.5 text-xs font-extrabold
    bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300
    rounded-full align-middle
    shadow-sm
  `;

  return (
    <div className={containerClasses}>
      {/* Sliding Indicator */}
      <span
        className={indicatorClasses}
        style={indicatorStyle}
      />

      {/* Monthly Button */}
      <button
        onClick={() => setBillingCycle("monthly")}
        className={`${buttonBaseClasses} ${!isYearly ? activeTextClasses : inactiveTextClasses}`}
      >
        Monthly
      </button>

      {/* Yearly Button */}
      <button
        onClick={() => setBillingCycle("yearly")}
        className={`${buttonBaseClasses} ${isYearly ? activeTextClasses : inactiveTextClasses}`}
      >
        Yearly
        {/* 'SAVE' Badge */}
        <span className={badgeClasses}>
          SAVE 15%
        </span>
      </button>
    </div>
  );
};

export default CheckoutPage;
