"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  ChevronDown,
  ChevronUp,
  User,
  ShoppingCart,
  Receipt,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FloatingWhatsAppDock from "@/components/FloatingWhatsAppDock";
import { useCurrency } from "@/hooks/useCurrency";
import {
  useOrderStore,
  decreaseInventoryStock,
} from "@/hooks/zustand_stores/useOrderStore";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/app/context/AuthContext";
import OrderItemsCard from "./OrderItemCard";
import CollapsibleWrapper from "./CollapsibleWrapper";
import ChargesEditor from "./ChargesEditor";
import QuickSummaryCard from "./QuickSummaryCard";
import BillDetailsCard from "./BillDetailsCard";

// --- TYPE DEFINITIONS ---
type Customer = {
  name: string;
  whatsappNumber: string;
};

type OrderItem = {
  itemId: string;
  itemName: string;
  sku?: string;
  sPrice: number;
  quantity: number;
};

// --- HELPER COMPONENT 1: CustomerInfoCard ---
const CustomerInfoCard = ({ customer }: { customer: Customer }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm text-muted-foreground">Name</div>
        <div className="text-base font-medium">{customer.name}</div>
        <div className="text-sm text-muted-foreground mt-2">Phone</div>
        <div className="text-base font-medium">{customer.whatsappNumber}</div>
      </CardContent>
    </Card>
  );
};

export default function ConfirmOrder() {
  const router = useRouter();
  const { user } = useAuth();
  const { tempOrderData, setTempOrderData, addOrder } = useOrderStore();

  const [items, setItems] = useState(tempOrderData?.items || []);
  const [charges, setCharges] = useState<Charge[]>([
    { id: `c-${Date.now()}`, name: "GST", type: "percent", value: 0 },
  ]);

  const [showDock, setShowDock] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tempOrderData) return;
    setTempOrderData({
      ...tempOrderData,
      items,
      charges,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, charges]);

  if (!tempOrderData || !tempOrderData.customer || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        No order data found.
      </div>
    );
  }

  const handleQuantityChange = (idx: number, newQty: number) => {
    const updated = [...items];
    updated[idx].quantity = newQty > 0 ? newQty : 1;
    setItems(updated);
  };

  const handleDelete = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[idx], [field]: value };

      // --- Auto calculation of GST amount ---
      // If GST fields are updated, recompute item's price with GST
      if (field === "gstRate" || field === "gstType") {
        const gstRate = parseFloat(item.gstRate || 0);
        const basePrice = item.sPrice ?? item.price ?? 0;

        // calculate gstAmount and total
        const gstAmount = (basePrice * gstRate) / 100;
        item.gstAmount = gstAmount;
        item.priceWithGST = basePrice + gstAmount;

        // If GST type is IGST or GST, you could later split this for invoice
        if (item.gstType === "IGST") {
          item.igst = gstAmount;
          item.cgst = 0;
          item.sgst = 0;
        } else {
          item.igst = 0;
          item.cgst = gstAmount / 2;
          item.sgst = gstAmount / 2;
        }
      }

      // --- Apply back into list ---
      updated[idx] = item;
      return updated;
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const totalItemGst = items.reduce((sum, item) => {
    const baseTotal = (item.price || 0) * item.quantity;
    const gstRate = item.gstRate ?? 0;
    const gstAmount = (baseTotal * gstRate) / 100;
    return sum + gstAmount;
  }, 0);

  const percentChargesAmount = charges
    .filter((c) => c.type === "percent")
    .reduce((sum, c) => sum + (subtotal * (c.value || 0)) / 100, 0);

  const fixedChargesAmount = charges
    .filter((c) => c.type === "amount")
    .reduce((sum, c) => sum + (c.value || 0), 0);

  const totalAmount =
    subtotal + totalItemGst + percentChargesAmount + fixedChargesAmount;

  const handlePlaceOrder = async () => {
    if (!user?.uid) {
      toast({
        title: "Not Logged In",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const loadingToast = toast({
      title: "Placing Order...",
      description: "Please wait while we save your order.",
    });

    try {
      const orderData = {
        ...tempOrderData,
        items,
        charges,
        subtotal,
        totalItemGst, // <-- Save this
        totalCharges: percentChargesAmount + fixedChargesAmount, // <-- This is just order-level charges
        totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await addOrder(user.uid, orderData);

      if (!result || !result.success) {
        throw new Error("Failed to place order");
      }

      setCreatedOrderId(result.orderId);

      toast({
        title: "✅ Order Placed",
        description: `Order for ${tempOrderData.customer.name} has been placed.`,
      });

      const invResult = await decreaseInventoryStock(
        user.uid,
        items.map((it) => ({ itemId: it.itemId, quantity: it.quantity }))
      );

      if (!invResult.success) {
        toast({
          title: "⚠️ Inventory update issue",
          description: `Some items couldn't be updated: ${invResult.failedItems.join(", ")}`,
          variant: "warning",
        });
      }

      setShowDock(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Error",
        description: "Something went wrong while placing the order.",
        variant: "destructive",
      });
    } finally {
      loadingToast.dismiss?.();
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Confirm Your Order</h1>
            <p className="text-sm text-muted-foreground">
              Review items, add charges, then place the order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CustomerInfoCard customer={tempOrderData.customer} />
            <OrderItemsCard
              items={items}
              onQuantityChange={handleQuantityChange}
              onDelete={handleDelete}
              onItemChange={handleItemChange}
            />
          </div>

          <div className="space-y-6">
            <BillDetailsCard
              charges={charges}
              setCharges={setCharges}
              subtotal={subtotal}
              totalAmount={totalAmount}
              totalItemGst={totalItemGst}
              fixedChargesAmount={fixedChargesAmount}
              percentChargesAmount={percentChargesAmount}
              loading={loading}
              onPlaceOrder={handlePlaceOrder}
            />
            <QuickSummaryCard
              itemsCount={items.length}
              subtotal={subtotal}
              totalCharges={totalItemGst + fixedChargesAmount + percentChargesAmount}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>

      {showDock && createdOrderId && (
        <FloatingWhatsAppDock
          phoneNumber={tempOrderData.customer.whatsappNumber || "9635901369"}
          message={`Hello ${tempOrderData.customer.name}, your order #${createdOrderId} has been placed. Total: ${useCurrency(totalAmount)}.`}
          onClose={() => {
            setShowDock(false);
            setTempOrderData(null);
            router.push("/orders");
          }}
        />
      )}
    </>
  );
}
