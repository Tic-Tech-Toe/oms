"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { OrderItem, OrderType } from "@/types/orderType";
import { auth } from "@/app/config/firebase";

const ZohoEstimate = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [estimateId, setEstimateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setTempOrderData } = useOrderStore();
  const user = auth.currentUser;

  const handleNext = async () => {
    if (!estimateId.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/zoho-estimate?estimate_number=${encodeURIComponent(estimateId)}`
      );
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      //console.log("Zoho Estimate Data:", data);

      // Transform Zoho API response to OrderType
      const transformedItems: OrderItem[] = data.items.map(
        (item: any, idx: number) => ({
          itemId: `zoho-${idx}`,
          quantity: item.quantity,
          price: item.rate,
          total: item.rate * item.quantity,
          sku: "Unknown",
          category: "Unknown",
          itemName: item.item_name,
        })
      );

      const newOrder: OrderType = {
        orderDate: new Date().toISOString(),
        status: "pending",
        paymentStatus: "pending",
        totalAmount: data.total_amount,
        invoiceNumber: "",
        items: transformedItems,
        customer: {
          id: "zoho-contact",
          name: data.contact_person_name || "Unknown",
          whatsappNumber: data.contact_number || "",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [{ date: new Date().toISOString(), action: "Order placed" }],
        payment: {
          id: `pay-${Date.now()}`,
          orderId: "Dy-zoho",
          customerId: user?.uid || "unknown",
          totalPaid: 0,
          partialPayments: [],
        },
      };

      // Save to Zustand
      setTempOrderData(newOrder);

      // Redirect to confirmation page
      router.push("/orders/new/confirm-order");

      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Fetch Zoho Estimate</DialogTitle>
        </DialogHeader>
        <Separator />
        <p className="text-md mt-4 text-slate-400">
          Enter the Zoho Estimate ID to automatically populate order details.
        </p>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="zoho-id" className="text-slate-600">
              Estimate ID
            </Label>
            <Input
              id="zoho-id"
              type="text"
              placeholder="Enter Zoho Estimate ID"
              className="h-11 rounded-xl shadow-none"
              value={estimateId}
              onChange={(e) => setEstimateId(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            onClick={handleNext}
            className="h-12 w-full sm:flex-[2] rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-md"
            disabled={!estimateId.trim() || loading}
          >
            {loading ? "Fetching..." : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZohoEstimate;
