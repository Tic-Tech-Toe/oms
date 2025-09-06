"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, ChevronDown, ChevronUp, User, ShoppingCart, Receipt, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FloatingWhatsAppDock from "@/components/FloatingWhatsAppDock";
import { useCurrency } from "@/hooks/useCurrency";
import { useOrderStore, decreaseInventoryStock } from "@/hooks/zustand_stores/useOrderStore";
// import { useAuth } from "@/hooks/useAuthStore";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuth } from "@/app/context/AuthContext";

type Charge = {
  id: string;
  name: string;
  type: "amount" | "percent";
  value: number;
};

export default function ConfirmOrder() {
  const router = useRouter();
  const { user } = useAuth();
  const { tempOrderData, setTempOrderData, addOrder } = useOrderStore();

  console.log("Current User : ", user);

  const [items, setItems] = useState(tempOrderData?.items || []);
  const [charges, setCharges] = useState<Charge[]>(
    // default: one GST percent line (editable)
    [{ id: `c-${Date.now()}`, name: "GST", type: "percent", value: 0 }]
  );

  const [billOpen, setBillOpen] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // keep temp order in sync when items or charges change
  useEffect(() => {
    if (!tempOrderData) return;
    setTempOrderData({
      ...tempOrderData,
      items,
      charges,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (!tempOrderData || !tempOrderData.customer || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-muted-foreground">
        No order data found.
      </div>
    );
  }

  // items handlers
  const handleQuantityChange = (idx: number, newQty: number) => {
    const updated = [...items];
    updated[idx].quantity = newQty > 0 ? newQty : 1;
    setItems(updated);
  };

  const handleDelete = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
  };

  // charges helpers
  const addCharge = () => {
    setCharges((prev) => [
      ...prev,
      { id: `c-${Date.now()}-${Math.floor(Math.random() * 9999)}`, name: "Charge", type: "amount", value: 0 },
    ]);
  };

  const updateCharge = (id: string, patch: Partial<Charge>) => {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeCharge = (id: string) => {
    setCharges((prev) => prev.filter((c) => c.id !== id));
  };

  // totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const percentChargesAmount = charges
    .filter((c) => c.type === "percent")
    .reduce((sum, c) => sum + (subtotal * (c.value || 0)) / 100, 0);

  const fixedChargesAmount = charges
    .filter((c) => c.type === "amount")
    .reduce((sum, c) => sum + (c.value || 0), 0);

  const totalAmount = subtotal + percentChargesAmount + fixedChargesAmount;

  // place order flow
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
        totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await addOrder(user.uid, orderData);

      if (!result || !result.success) {
        toast({
          title: "❌ Failed to place order",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      setCreatedOrderId(result.orderId);

      toast({
        title: "✅ Order Placed",
        description: `Order for ${tempOrderData.customer.name} has been placed.`,
      });

      // best-effort: decrease inventory
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

      // show dock and do not clear tempOrderData yet (dock close will clear)
      setShowDock(true);
      // optionally collapse bill and scroll to dock if needed
      setBillOpen(false);
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

  // small helper: smooth collapse content (custom)
  function CollapsibleWrapper({ open, children }: { open: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [maxH, setMaxH] = useState<string>("0px");

    useEffect(() => {
      if (!ref.current) return;
      if (open) {
        const h = ref.current.scrollHeight;
        setMaxH(`${h}px`);
        // after animation allow auto height
        const t = setTimeout(() => setMaxH("none"), 350);
        return () => clearTimeout(t);
      } else {
        // when closing, set back to measured px then to 0 for smooth
        const h = ref.current.scrollHeight;
        setMaxH(`${h}px`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setMaxH("0px"));
        });
      }
    }, [open]);

    return (
      <div
        ref={ref}
        style={{
          maxHeight: maxH,
          overflow: "hidden",
          transition: "max-height 280ms ease",
        }}
        aria-hidden={!open}
      >
        {children}
      </div>
    );
  }

  // ChargesEditor helper component (inline)
  function ChargesEditor({ charges, onChange, subtotal }: { charges: Charge[]; onChange: (c: Charge[]) => void; subtotal: number }) {
    return (
      <div className="space-y-3">
        {charges.map((c) => {
          const computed = c.type === "percent" ? (subtotal * (c.value || 0)) / 100 : c.value || 0;
          return (
            <div key={c.id} className="flex items-center gap-3">
              <Input
                value={c.name}
                onChange={(e) => onChange(charges.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)))}
                className="flex-1"
                placeholder="Charge name (eg. GST or Delivery)"
              />
              <div className="flex items-center gap-2">
                <select
                  value={c.type}
                  onChange={(e) => onChange(charges.map((x) => (x.id === c.id ? { ...x, type: e.target.value as Charge["type"] } : x)))}
                  className="rounded-md border px-2 py-1 bg-transparent"
                >
                  <option value="amount">₹</option>
                  <option value="percent">%</option>
                </select>

                <Input
                  type="number"
                  min={0}
                  value={String(c.value)}
                  onChange={(e) =>
                    onChange(charges.map((x) => (x.id === c.id ? { ...x, value: parseFloat(e.target.value || "0") } : x)))
                  }
                  className="w-28 text-right"
                />
              </div>

              <div className="w-28 text-right font-medium">{useCurrency(computed)}</div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange(charges.filter((x) => x.id !== c.id))}
                className="text-red-500"
                aria-label={`Remove ${c.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}

        <div className="pt-1">
          <Button
            variant="ghost"
            onClick={() =>
              onChange([
                ...charges,
                { id: `c-${Date.now()}-${Math.floor(Math.random() * 9999)}`, name: "Charge", type: "amount", value: 0 },
              ])
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add charge
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto px-6 py-2 space-y-6">
        {/* Top Bar */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Confirm Your Order</h1>
            <p className="text-sm text-muted-foreground">Review items, add charges, then place the order.</p>
          </div>
        </div>

        {/* Layout grid: left column cards; right column summary on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Customer Card */}
            <Card>
              <CardHeader className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="text-base font-medium">{tempOrderData.customer.name}</div>
                <div className="text-sm text-muted-foreground mt-2">Phone</div>
                <div className="text-base font-medium">{tempOrderData.customer.whatsappNumber}</div>
              </CardContent>
            </Card>

            {/* Items Card */}
            <Card className="overflow-x-scroll md:overflow-x-hidden">
              <CardHeader className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, idx) => (
                  <div key={item.itemId ?? idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-sm text-muted-foreground">SKU: {item.sku ?? "—"}</div>
                    </div>

                    <div className="w-28 text-right">
                      <div className="text-sm text-muted-foreground">Rate</div>
                      <div className="font-mono font-semibold">{useCurrency(item.price)}</div>
                    </div>

                    <div className="w-28 text-center">
                      <div className="text-sm text-muted-foreground">Qty</div>
                      <Input
                        type="number"
                        min={1}
                        value={String(item.quantity)}
                        onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value || "1"))}
                        className="w-20 text-center mx-auto"
                      />
                    </div>

                    <div className="w-28 text-right font-medium">
                      {useCurrency(item.quantity * item.price)}
                    </div>

                    <div className="w-10">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column: bill summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Bill</CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                  <div className="font-mono font-semibold">{useCurrency(subtotal)}</div>

                  <Button variant="ghost" size="icon" onClick={() => setBillOpen((s) => !s)}>
                    {billOpen ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Collapsible area (custom) */}
                <CollapsibleWrapper open={billOpen}>
                  <div className="py-2">
                    <div className="text-sm text-muted-foreground mb-2">Apply charges (amount or %)</div>

                    <ChargesEditor
                      charges={charges}
                      subtotal={subtotal}
                      onChange={(next) => {
                        setCharges(next);
                      }}
                    />

                    <div className="mt-4 border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Fixed charges</span>
                        <span>{useCurrency(fixedChargesAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Percent charges</span>
                        <span>{useCurrency(percentChargesAmount)}</span>
                      </div>
                    </div>
                  </div>
                </CollapsibleWrapper>

                {/* total */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-2xl font-mono font-bold">{useCurrency(totalAmount)}</span>
                  </div>

                  <div className="flex gap-3 mt-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => router.push("/add-items")}>
                      Add More Items
                    </Button>
                    <Button className="flex-1 bg-dark-primary text-white" onClick={handlePlaceOrder} disabled={loading}>
                      {loading ? "Placing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small helper card: quick summary */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span>Items ({items.length})</span>
                  <span>{useCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Charges</span>
                  <span>{useCurrency(fixedChargesAmount + percentChargesAmount)}</span>
                </div>
                <div className="flex justify-between mt-3 font-semibold">
                  <span>Grand Total</span>
                  <span>{useCurrency(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Dock */}
      {showDock && createdOrderId && (
        <FloatingWhatsAppDock
          phoneNumber={tempOrderData.customer.whatsappNumber || "9635901369"}
          message={`Hello ${tempOrderData.customer.name}, your order #${createdOrderId} has been placed. Total: ₹${totalAmount}.`}
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
