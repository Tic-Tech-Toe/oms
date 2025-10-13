"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "@/app/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/config/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// MOCK: ExternalLink icon
const ExternalLink = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

interface PaymentStatusCardProps {
  orderId: string;
  paymentLinkUrl: string;
  onRetry: () => void;
  billingCycle: "monthly" | "yearly";
  selectedPlanId: string;
  paymentAmount: number;
  planName: string;
}

export function PaymentStatusCard({ orderId, paymentLinkUrl, onRetry, billingCycle, selectedPlanId, paymentAmount, planName }: PaymentStatusCardProps) {
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");
  const [time, setTime] = useState(600); // 10 minutes countdown

  const {user, userDoc} = useAuth();
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (status !== "pending" || time === 0) return;
    const id = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [status, time]);

  // Polling payment status
useEffect(() => {
  if (status !== "pending") return;

  const intervalId = setInterval(async () => {
    try {
      const res = await fetch(`/api/rzrpay/status/${orderId}`);
      if (!res.ok) return;

      const { paid, paymentId, planId, amount } = await res.json();
      console.table({ paid, paymentId, planId, amount });
      if (paid) {
        setStatus("success");
        clearInterval(intervalId);

        if (user) {
          try {
            const startedAt = new Date();

            // Determine end date based on selected billing cycle
            const endAt = new Date(startedAt);
            if (billingCycle === "monthly") {
              endAt.setMonth(endAt.getMonth() + 1);
            } else {
              endAt.setFullYear(endAt.getFullYear() + 1);
            }

            await updateDoc(doc(db, "users", user.uid), {
              subscription: {
                status: "Active",
                planId:selectedPlanId,
                planName:planName,
                paymentId:orderId,
                amount:paymentAmount/100,
                startedAt,
                endAt,
                billingCycle,
              },
            });

            console.log("Subscription updated successfully ✅");
          } catch (err) {
            console.error("Error updating subscription:", err);
          }
        }

        confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
      }
    } catch (e) {
      console.error("Polling failed:", e);
    }
  }, 5000);

  return () => clearInterval(intervalId);
}, [orderId, status, user, billingCycle]);


  // Timeout effect
  useEffect(() => {
    if (time === 0 && status === "pending") {
      setStatus("failed");
    }
  }, [time, status]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = ((600 - time) / 600) * 100;

  return (
    <div className="w-full mx-auto p-6 rounded-2xl shadow-xl text-center bg-gradient-to-br from-sky-100 to-indigo-50 dark:from-sky-900/50 dark:to-indigo-900/50">
      <AnimatePresence mode="wait">
        {status === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-3xl mb-2">💸</div>
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              Waiting for payment confirmation…
            </h2>
            <a
              href={paymentLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 mb-2 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <ExternalLink size={16} />
              Open Payment Page
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              A secure link has also been sent to your SMS/Email.
            </p>
            <div className="w-full h-2 bg-white/50 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-green-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              {minutes}:{seconds.toString().padStart(2, "0")} remaining
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-bold text-xl text-green-700 dark:text-green-400">Payment received successfully!</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Your subscription is now active.</p>
            <Button onClick={() => router.replace("/orders")} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Go to Dashboard</Button>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-4xl mb-3">❌</div>
            <h2 className="font-bold text-lg text-red-600 dark:text-red-400">Payment failed or timed out</h2>
            <button onClick={onRetry} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
