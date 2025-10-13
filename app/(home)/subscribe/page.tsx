"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { PaymentStatusCard } from "./PaymentStatusCard";

// --- MOCKED DEPENDENCIES ---
// The original code had errors because it couldn't find these imports.
// I've created mock (simulated) versions of them so the component can run.



// MOCK: lucide-react icons
const CheckCircle2 = ({ className }: { className: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const Lock = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const ShieldCheck = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const ExternalLink = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;

// MOCK: canvas-confetti
const confetti = (options: any) => console.log("🎉 Confetti launched with options:", options);

// MOCK: useRouter & useSearchParams (using local state for search params simulation)
const useRouter = () => ({
  push: (path: string) => console.log("Router navigating to:", path),
  back: () => console.log("Router navigating back"),
});
const useSearchParams = () =>
  new URLSearchParams({ planId: "2", cycle: "yearly" }); // Mock default parameters

// MOCK: useCurrency (since we are focused on INR/paise with Razorpay)
const useCurrency = (amount: number | string) => {
  if (typeof amount === "string") amount = parseFloat(amount);
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// MOCK: Button
const Button = ({ onClick, disabled, className, children }: { onClick: () => void; disabled: boolean; className: string; children: React.ReactNode }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

// --- MERGED COMPONENT: PaymentStatusCard ---
// The original code imported this from another file, which caused an error.
// I've moved it into this file to make everything self-contained.

// function PaymentStatusCard({ orderId, paymentLinkUrl, onRetry }: {
//  orderId: string
//  paymentLinkUrl: string
//  onRetry: () => void
// }) {
//  const [status, setStatus] = useState<"pending"|"success"|"failed">("pending")
//  const [time, setTime] = useState(600) // 10 min

//  // Countdown timer effect
//   useEffect(() => {
//    if (status !== "pending" || time === 0) return;
//    const id = setInterval(() => setTime(t => Math.max(0, t - 1)), 1000);
//    return () => clearInterval(id);
//   }, [status, time]);


//   // Status polling effect
//   useEffect(() => {
//    if (status !== "pending") return;

//    const intervalId = setInterval(async () => {
//      try {
//        const res = await fetch(`/api/rzrpay/status/${orderId}`);
//         if (!res.ok) {
//           console.error("Polling request failed with status:", res.status);
//           return;
//         }
//        const { paid } = await res.json();
//        if (paid) {
//          setStatus("success");
//           // Stop the interval once payment is successful
//           clearInterval(intervalId);

//           //Update user doc
          

//          confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
//        }
//      } catch (e) {
//        console.error("Polling failed:", e);
//      }
//    }, 5000); // Poll every 5 seconds

//    return () => clearInterval(intervalId);
//   }, [orderId, status]);

//   // Effect to handle the timeout
//   useEffect(() => {
//     if (time === 0 && status === "pending") {
//       setStatus("failed");
//     }
//   }, [time, status]);


//  const minutes = Math.floor(time / 60)
//  const seconds = time % 60
//  const progress = ((600 - time) / 600) * 100

//  return (
//    <div className="w-full mx-auto p-6 rounded-2xl shadow-xl text-center bg-gradient-to-br from-sky-100 to-indigo-50 dark:from-sky-900/50 dark:to-indigo-900/50">
//      <AnimatePresence mode="wait">
//        {status === "pending" && (
//          <motion.div
//            key="pending"
//            initial={{ opacity: 0, y: 20 }}
//            animate={{ opacity: 1, y: 0 }}
//            exit={{ opacity: 0, y: -20 }}
//            transition={{ duration: .4 }}
//          >
//            <div className="text-3xl mb-2">💸</div>
//            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
//              Waiting for payment confirmation…
//            </h2>
            
//             <a 
//               href={paymentLinkUrl} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="mt-4 mb-2 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-md"
//             >
//               <ExternalLink size={16} />
//               Open Payment Page
//             </a>

//            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//              A secure link has also been sent to your SMS/Email.
//            </p>

//            <div className="w-full h-2 bg-white/50 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
//              <motion.div
//                className="h-full bg-green-500"
//                animate={{ width: `${progress}%` }}
//                   transition={{ duration: 1, ease: "linear" }}
//              />
//            </div>
//            <div className="text-gray-600 dark:text-gray-300 text-sm">
//              {minutes}:{seconds.toString().padStart(2,"0")} remaining
//            </div>
//          </motion.div>
//        )}

//        {status === "success" && (
//          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>
//            <div className="text-5xl mb-3">🎉</div>
//            <h2 className="font-bold text-xl text-green-700 dark:text-green-400">Payment received successfully!</h2>
//            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Your subscription is now active.</p>
//          </motion.div>
//        )}

//        {status === "failed" && (
//          <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>
//            <div className="text-4xl mb-3">❌</div>
//            <h2 className="font-bold text-lg text-red-600 dark:text-red-400">Payment failed or timed out</h2>
//            <button onClick={onRetry} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Try Again</button>
//          </motion.div>
//        )}
//      </AnimatePresence>
//    </div>
//  )
// }


// --- Plan Definitions ---
const allPlans = [
  {
    id: 1,
    title: "Starter",
    priceMonthly: 1200,
    priceYearly: 12000,
    featuresMonthly: ["Track up to 50 shipments", "Email notifications", "Basic analytics"],
    featuresYearly: ["Track up to 50 shipments", "Email notifications", "Basic analytics", "Save 15% yearly"],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
  {
    id: 2,
    title: "Pro",
    priceMonthly: 2500,
    priceYearly: 25000,
    featuresMonthly: ["Unlimited shipments", "SMS + Email alerts", "Advanced analytics", "Priority support"],
    featuresYearly: ["Unlimited shipments", "SMS + Email alerts", "Advanced analytics", "Priority support", "Save 15% yearly"],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
  {
    id: 3,
    title: "Enterprise",
    priceMonthly: 5000,
    priceYearly: 50000,
    featuresMonthly: ["Custom shipment limits", "Dedicated account manager", "API & integrations", "24/7 support"],
    featuresYearly: ["Custom shipment limits", "Dedicated account manager", "API & integrations", "24/7 support", "Custom annual savings"],
    billingCycle: { monthly: "monthly", yearly: "yearly" },
  },
];

// --- Main Checkout Page Component ---
const CheckoutPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPlanId = parseInt(searchParams.get("planId") || "2");
  const initialCycle = searchParams.get("cycle") === "monthly" ? "monthly" : "yearly";

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(initialCycle);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- STATE FOR PAYMENT PROCESSING ---
  const [showStatus, setShowStatus] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentLinkUrl, setPaymentLinkUrl] = useState("");


  const handlePlanSelect = (id: number) => {
    setSelectedPlanId(id);
  };

  const planData = allPlans.find((p) => p.id === selectedPlanId);

  const defaultPlan = {
    title: "Error: Plan Not Found",
    price: 0,
    features: ["Please return to the pricing page to select a valid plan."],
    id: "error",
    planName: "error",
  };

  const selectedPlan = useMemo(() => {
    if (!planData) return defaultPlan;
    const isMonthly = billingCycle === "monthly";
    const priceKey = isMonthly ? "priceMonthly" : "priceYearly";
    const title = planData.title + (isMonthly ? " (Monthly)" : " (Yearly)");
    return {
      id: planData.id.toString(),
      title: title,
      price: planData[priceKey],
      features: isMonthly ? planData.featuresMonthly : planData.featuresYearly,
      planName: planData.title,
    };
  }, [planData, billingCycle]);

  const priceDetails = useMemo(() => {
    const subtotal = selectedPlan.price;
    const taxRate = 0.18;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      totalForApi: Math.round(total * 100),
    };
  }, [selectedPlan]);

  async function handlePay() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const receiptId = `receipt_${Date.now()}_${selectedPlan.planName.toLowerCase()}`;
      const customer = {
        name: user?.displayName || "Guest",
        email: user?.email,
        contact: user?.phoneNumber || "",
      };

      const res = await fetch("/api/rzrpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptId,
          amount: parseFloat(priceDetails.total),
          customer,
          plan: billingCycle,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Payment link creation failed");
      }

      setOrderId(data.paymentLinkId);
      setPaymentLinkUrl(data.paymentLinkUrl);
      setShowStatus(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }
  
  const isPaymentInProgress = showStatus || loading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <PlanSelector
        allPlans={allPlans}
        selectedPlanId={selectedPlanId}
        handlePlanSelect={handlePlanSelect}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        useCurrency={useCurrency}
      />

      <main className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 grid lg:grid-cols-2 mt-8">
        {/* --- Left Column: Order Summary --- */}
        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Summary
          </h2>
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
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{useCurrency(priceDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{useCurrency(priceDetails.tax)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Total</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{useCurrency(priceDetails.total)}</span>
            </div>
          </div>
        </div>

        {/* --- Right Column: Payment Details --- */}
        <div className="p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You are subscribing as:</p>
            <div className="flex items-center gap-4">
              <img
                src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.displayName || "User"}`}
                alt="User Avatar"
                className="w-14 h-14 rounded-full border-2 border-indigo-200 dark:border-indigo-800 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{user?.displayName || "Valued User"}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {errorMessage && <div className="mt-4 text-red-500 text-sm text-center">{errorMessage}</div>}

          <div className="mt-8 flex-grow flex flex-col justify-end">
            {showStatus ? (
              <PaymentStatusCard
                orderId={orderId}
                paymentLinkUrl={paymentLinkUrl}
                onRetry={() => setShowStatus(false)}
                billingCycle={billingCycle}
                selectedPlanId={selectedPlanId}
                paymentAmount={priceDetails.totalForApi}
                planName={selectedPlan.planName}
              />
            ) : (
              <>
                <Button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Initializing Payment..." : `Proceed to Pay ${useCurrency(priceDetails.total)}`}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Lock size={12} />
                  <span>Secure payment via Razorpay</span>
                  <ShieldCheck size={12} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


// --- Helper Components (No changes needed below this line) ---
const PlanSelector = ({ allPlans, selectedPlanId, handlePlanSelect, billingCycle, setBillingCycle, useCurrency }: any) => {
    return (
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
            Pick Your Best Plan
          </h1>
          <div className="mt-6">
            <BillingToggle
              billingCycle={billingCycle}
              setBillingCycle={setBillingCycle}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {allPlans.map((plan: any) => {
              const isSelected = plan.id === selectedPlanId;
              const isYearly = billingCycle === "yearly";
              const priceKey = isYearly ? "priceYearly" : "priceMonthly";
              const price = plan[priceKey];
    
              return (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`rounded-xl border cursor-pointer transition-all duration-300 ${ isSelected ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40" : "border-gray-200 bg-white dark:bg-gray-700" } hover:border-indigo-400 hover:shadow-md sm:hover:scale-[1.02] p-4 sm:p-6`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-lg sm:text-xl font-bold ${isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-white"}`}>
                      {plan.title}
                    </h3>
                  </div>
                  <p>
                    <span className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                      {useCurrency(price)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
};

const BillingToggle = ({ billingCycle, setBillingCycle }: any) => {
    const isYearly = billingCycle === "yearly";
    return (
        <div className="relative flex max-w-sm mx-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner-sm">
          <span className="absolute top-1 bottom-1 w-1/2 bg-white dark:bg-purple-600 rounded-lg shadow-md transition-transform duration-300 ease-in-out" style={{ transform: isYearly ? "translateX(100%)" : "translateX(0)" }} />
          <button onClick={() => setBillingCycle("monthly")} className={`relative z-10 w-1/2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ease-in-out tracking-wide ${!isYearly ? "text-purple-700 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            Monthly
          </button>
          <button onClick={() => setBillingCycle("yearly")} className={`relative z-10 w-1/2 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ease-in-out tracking-wide ${isYearly ? "text-purple-700 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            Yearly
            <span className="ml-2 px-2 py-0.5 text-xs font-extrabold bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full align-middle shadow-sm">SAVE 15%</span>
          </button>
        </div>
      );
};

export default CheckoutPage;

