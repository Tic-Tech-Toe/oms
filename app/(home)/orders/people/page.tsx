"use client";

import { useEffect, useState } from "react";
import { CustomerType } from "@/types/orderType";
import { addCustomer, getCustomers } from "@/utils/getFirestoreCustomers";
import { useToast } from "@/hooks/use-toast";
import AddCustomerDialog from "@/components/AddCustomerDialog";
import { auth } from "@/app/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { mockCustomers } from "@/data/customers";

export default function People() {
  const [userId, setUserId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Listen to user auth state and set userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.warn("User not logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch customers when userId is available
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!userId) return;
      const data = await getCustomers(userId);
      setCustomers(data);
    };
    fetchCustomers();
  }, [userId]);

  // Handle adding new customer
  const handleAddCustomer = async (customerData: CustomerType) => {
    if (!userId) return;
    try {
      await addCustomer(userId, customerData);
      const updated = await getCustomers(userId);
      setCustomers(updated);
      toast({ title: "Customer added" });
    } catch (err) {
      console.error("Failed to add customer:", err);
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  };

  // console.log(userId,"....................")

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">People</h1>
            <p className="text-gray-500 text-sm">Your customer directory</p>
          </div>
          <AddCustomerDialog onSubmitCustomer={handleAddCustomer} />
        </div>

        {/* Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {customers.map((cust, idx) => (
    <div
      key={idx}
      className=" backdrop-blur-md border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 relative overflow-hidden group"
    >
      {/* Reward Badge */}
      {/* {cust.rewardPoint && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          ⭐ {cust.rewardPoint} pts
        </div>
      )} */}

      {/* Customer Name */}
      <h2 className="text-2xl font-bold  ">
        {cust.name}
      </h2>

      {/* Info */}
      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <p>Email: <span className="font-medium">{cust.email || "Not Provided"}</span></p>
        <p>WhatsApp: <span className="font-medium">{cust.whatsappNumber}</span></p>
        {cust.phoneNumber && (
          <p>Phone: <span className="font-medium">{cust.phoneNumber}</span></p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/91${cust.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-green-600 text-sm font-medium hover:underline transition"
          >
            💬 WhatsApp
          </a>
          {cust.phoneNumber && (
            <a
              href={`tel:${cust.phoneNumber}`}
              className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline transition"
            >
              📞 Call
            </a>
          )}
        </div>
        <button className="text-sm text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition">
          ✏️ Edit
        </button>
      </div>
    </div>
  ))}
</div>


        {/* Empty State */}
        {customers.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-sm">
            No customers yet.
          </div>
        )}
      </div>
    </div>
  );
}
