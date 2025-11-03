"use client";

import { useEffect, useState } from "react";
import { CustomerType } from "@/types/orderType";
import { useToast } from "@/hooks/use-toast";
import AddCustomerDialog from "@/components/AddCustomerDialog";
import EditCustomerDialog from "@/components/EditCustomerDialog";
import { auth } from "@/app/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { MessageCircle, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddCustomerByCSV from "@/components/AddCustomerByCSV";
import clsx from "clsx";

export default function People() {
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof CustomerType>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      // alert("Adding customer...");
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

  // Filter + Sort
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = (a[sortKey] ?? "") as string | number;
    const bVal = (b[sortKey] ?? "") as string | number;

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof CustomerType) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">People</h1>
            <p className="text-gray-500 text-sm">Your customer directory</p>
          </div>
          <div className="flex gap-2 items-center">
            <AddCustomerByCSV handleAddCustomer = {handleAddCustomer} />
          <AddCustomerDialog onSubmitCustomer={handleAddCustomer} />
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs w-full"
          />
        </div>

        {/* Table for desktop, cards for mobile */}
        <div className="hidden sm:block rounded-xl border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Name <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("whatsappNumber")}>
                  WhatsApp <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead>Reward Points</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length > 0 ? (
                sorted.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell className="font-medium">{cust.name}</TableCell>
                    <TableCell>{cust.email || "—"}</TableCell>
                    <TableCell className="text-md">
                      <span className="text-[14px] font-semibold">
                        +91{"-"}
                        {cust.whatsappNumber.length > 10 &&
                        cust.whatsappNumber.startsWith("91")
                          ? cust.whatsappNumber.slice(2)
                          : cust.whatsappNumber}
                      </span>
                    </TableCell>
                    {/* === ADDED CELLS HERE === */}
                    <TableCell
                      className={clsx(
                        "font-mono",
                        cust.GSTNumber === "No GST" &&
                          "text-orange-700 font-semibold border-2 border-orange-700 rounded-lg"
                      )}
                    >
                      {cust.GSTNumber || "—"}
                    </TableCell>
                    <TableCell>
                      {cust.shippingAddress?.replaceAll("|", ",") || "—"}
                    </TableCell>
                    <TableCell>
                      {cust.rewardPoint !== undefined ? (
                        <span className=" text-amber-700 text-md font-semibold px-2 py-1 rounded-full">
                           {cust.rewardPoint}
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <a
                        href={`https://wa.me/91${cust.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCustomer(cust)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cust.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden space-y-3">
          {sorted.length > 0 ? (
            sorted.map((cust) => (
              <div
                key={cust.id}
                className="rounded-xl border shadow-sm p-4 bg-white flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{cust.name}</h3>
                  {cust.rewardPoint !== undefined && (
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                       {cust.rewardPoint}
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-0.5">
                  <p>{cust.email || "—"}</p>
                  <p>
                    <span className="font-medium">WhatsApp:</span>{" "}
                    {cust.whatsappNumber.length > 10 &&
                    cust.whatsappNumber.startsWith("91")
                      ? cust.whatsappNumber.slice(2)
                      : cust.whatsappNumber}
                  </p>
                  <p>
                    <span className="font-medium">GST:</span>{" "}
                    {cust.GSTNumber || "—"}
                  </p>
                  <p className="truncate">
                    <span className="font-medium">Address:</span>{" "}
                    {cust.shippingAddress?.replaceAll("|", ",") || "—"}
                  </p>
                </div>

                <div className="flex gap-1.5 mt-2 justify-end">
                  <a
                    href={`https://wa.me/91${cust.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCustomer(cust)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(cust.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No customers found.</p>
          )}
        </div>

        {/* Edit Dialog */}
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
