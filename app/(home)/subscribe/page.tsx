"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/app/config/firebase";
import { useRouter } from "next/navigation";
import PaymentWindow from "@/components/payment/PaymentWindow";

const SubscribePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [joinedDate, setJoinedDate] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(null);

  useEffect(() => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      setJoinedDate(
        date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("/api/logout", { method: "POST" });
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmSubscribe = (plan: "monthly" | "yearly") => {
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Greeting */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome, {user?.displayName?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Your trial has ended. Pick a plan to continue using ShipTrack 🚀
        </p>
      </div>

      {/* Plans */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
        {/* Monthly */}
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-lg border hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-bold text-gray-800">Monthly</h3>
          <p className="mt-2 text-3xl font-extrabold text-indigo-600">
            ₹1200 <span className="text-lg font-medium text-gray-500">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-gray-600 text-sm">
            <li>✔ 100 orders / month</li>
            <li>✔ Email support</li>
          </ul>
          <button
            onClick={() => confirmSubscribe("monthly")}
            disabled={loading}
            className="mt-8 w-full px-5 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Subscribe
          </button>
        </div>

        {/* Yearly (highlighted) */}
        <div className="flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-xl text-white border hover:shadow-2xl transition-all scale-105 relative">
          <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">
            Best Value
          </span>
          <h3 className="text-2xl font-bold">Yearly</h3>
          <p className="mt-2 text-3xl font-extrabold">
            ₹12000 <span className="text-lg font-medium opacity-80"> /yr</span>
          </p>
          <p className="text-sm italic opacity-80">Save 15%</p>
          <ul className="mt-6 space-y-3 text-white/90 text-sm">
            <li>✔ 1200 orders / year</li>
            <li>✔ Priority support</li>
            <li>✔ Save 15% vs monthly</li>
          </ul>
          <button
            onClick={() => confirmSubscribe("yearly")}
            disabled={loading}
            className="mt-8 w-full px-5 py-3 bg-white text-indigo-600 rounded-2xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Payment Dialog */}
      {showDialog && selectedPlan && (
        <PaymentWindow
          plan={selectedPlan}
          user={user}
          onClose={() => setShowDialog(false)}
        />
      )}

      {/* User Info */}
      <div className="w-full max-w-3xl mt-12 bg-white rounded-2xl shadow p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="Avatar"
            className="w-14 h-14 rounded-full border shadow"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {user?.displayName || "Guest"}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400">Joined {joinedDate}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default SubscribePage;
