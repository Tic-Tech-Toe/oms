"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // adjust path to your firebase config

export default function PaymentSuccessPage() {
  const [message, setMessage] = useState("Verifying payment...");
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const data = Object.fromEntries(params.entries());

      try {
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.success) {
          // ✅ Payment verified → update Firestore
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid);

            const plan = data?.plan || "monthly"; // send plan param during payment creation
            const endDate =
              plan === "yearly"
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            await updateDoc(userRef, {
              subscriptionStatus: plan,
              subscriptionEndDate: endDate,
            });
          }

          setMessage("✅ Your plan is activated!");
          // start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push("/orders");
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setMessage("❌ Payment verification failed.");
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Something went wrong.");
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Status</h1>
        <p className="text-gray-600 mb-2">{message}</p>
        {message.includes("activated") && (
          <p className="text-sm text-gray-500">
            Redirecting to dashboard in {countdown} seconds...
          </p>
        )}
      </div>
    </div>
  );
}
