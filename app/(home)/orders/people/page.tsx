"use client";

import { useEffect, useState } from "react";
import { CustomerType } from "@/types/orderType";
import { useToast } from "@/hooks/use-toast";
import AddCustomerDialog from "@/components/AddCustomerDialog";
import EditCustomerDialog from "@/components/EditCustomerDialog";
import { auth } from "@/app/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { MessageCircle, Phone, Edit, Trash2 } from "lucide-react";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";

export default function People() {
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(
    null
  );

  const {
    customers,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadCustomers(user.uid);
      }
    });
    return () => unsubscribe();
  }, [loadCustomers]);

  const handleAddCustomer = async (customerData: CustomerType) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addCustomer(user.uid, customerData);
      toast({ title: "Customer added!" });
    } catch {
      toast({ title: "Failed to add customer", variant: "destructive" });
    }
  };

  const handleUpdateCustomer = async (updatedData: CustomerType) => {
    const user = auth.currentUser;
    if (!user) return;
  
    try {
      await updateCustomer(user.uid, updatedData.id!, updatedData);
      toast({ title: "Customer updated!" });
      setEditingCustomer(null);
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };
  

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteCustomer(user.uid, id);
      toast({ title: "Customer deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="relative group bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-3xl px-5 py-4 shadow-sm hover:shadow-md transition flex justify-between items-start"
            >
              {/* Info */}
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{cust.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cust.email || "No email"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +91 {cust.whatsappNumber}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-3 opacity-70 group-hover:opacity-100 transition">
                <a
                  href={`https://wa.me/91${cust.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/action relative hover:text-green-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="absolute right-full mr-2 text-xs bg-black text-white px-1 py-0.5 rounded opacity-0 group-hover/action:opacity-100 transition">
                    WhatsApp
                  </span>
                </a>

                {/* {cust.phoneNumber && (
                  <a
                    href={`tel:${cust.phoneNumber}`}
                    className="group/action relative hover:text-blue-500"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="absolute right-full mr-2 text-xs bg-black text-white px-1 py-0.5 rounded opacity-0 group-hover/action:opacity-100 transition">
                      Call
                    </span>
                  </a>
                )} */}

                <button
                  onClick={() => setEditingCustomer(cust)}
                  className="group/action relative hover:text-black dark:hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                  <span className="absolute right-full mr-2 text-xs bg-black text-white px-1 py-0.5 rounded opacity-0 group-hover/action:opacity-100 transition">
                    Edit
                  </span>
                </button>

                <button
                  onClick={() => handleDelete(cust.id!)}
                  className="group/action relative hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="absolute right-full mr-2 text-xs bg-black text-white px-1 py-0.5 rounded opacity-0 group-hover/action:opacity-100 transition">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="text-center text-gray-400 mt-20 text-sm">
            No customers yet.
          </div>
        )}

        {editingCustomer && (
          <EditCustomerDialog
            customer={editingCustomer}
            open={!!editingCustomer}
            onClose={() => setEditingCustomer(null)}
            onSave={handleUpdateCustomer}
          />
        )}
      </div>
    </div>
  );
}
