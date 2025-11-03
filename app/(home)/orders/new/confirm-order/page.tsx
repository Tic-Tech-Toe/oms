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
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/app/context/AuthContext";
import OrderItemsCard from "./OrderItemCard";
import CollapsibleWrapper from "./CollapsibleWrapper";
import ChargesEditor, { Charge } from "./ChargesEditor";
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

type Charge = {
  id: string;
  name: string;
  type: "amount" | "percent";
  value: number;
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

// --- HELPER COMPONENT 2: OrderItemsCard ---
const OrderItemsCard = ({ items, onQuantityChange, onDelete }: { items: OrderItem[]; onQuantityChange: (idx: number, newQty: number) => void; onDelete: (idx: number) => void; }) => {
  return (
    <Card className="overflow-x-scroll md:overflow-x-hidden">
      <CardHeader className="flex flex-row items-center gap-2">
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
                onChange={(e) => onQuantityChange(idx, parseInt(e.target.value || "1"))}
                className="w-20 text-center mx-auto"
              />
            </div>

            <div className="w-28 text-right font-medium">
              {useCurrency(item.quantity * item.price)}
            </div>

            <div className="w-10">
              <Button variant="ghost" size="icon" onClick={() => onDelete(idx)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// --- HELPERS FOR BILL CARD ---
function CollapsibleWrapper({ open, children }: { open: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [maxH, setMaxH] = useState<string>("0px");

    useEffect(() => {
        if (!ref.current) return;
        if (open) {
            const h = ref.current.scrollHeight;
            setMaxH(`${h}px`);
            const t = setTimeout(() => setMaxH("none"), 350);
            return () => clearTimeout(t);
        } else {
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
                transition: "max-height 280ms ease-in-out",
            }}
            aria-hidden={!open}
        >
            {children}
        </div>
    );
}

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
                                className="rounded-md border px-2 py-1 bg-transparent h-10"
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

// --- HELPER COMPONENT 3: BillDetailsCard ---
const BillDetailsCard = ({ charges, setCharges, subtotal, totalAmount, fixedChargesAmount, percentChargesAmount, loading, onPlaceOrder }: { charges: Charge[]; setCharges: (charges: Charge[]) => void; subtotal: number; totalAmount: number; fixedChargesAmount: number; percentChargesAmount: number; loading: boolean; onPlaceOrder: () => void; }) => {
    const [billOpen, setBillOpen] = useState(false);
    const router = useRouter();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
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
                <CollapsibleWrapper open={billOpen}>
                    <div className="py-2">
                        <div className="text-sm text-muted-foreground mb-2">Apply charges (amount or %)</div>
                        <ChargesEditor charges={charges} subtotal={subtotal} onChange={setCharges} />

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

                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="text-2xl font-mono font-bold">{useCurrency(totalAmount)}</span>
                    </div>

                    <div className="flex gap-3 mt-2 w-full">
                        {/* <Button variant="outline" className="flex-1" onClick={() => router.push("/add-items")}>
                            Add More Items
                        </Button> */}
                        <Button className="flex-1 bg-dark-primary text-white" onClick={onPlaceOrder} disabled={loading}>
                            {loading ? "Placing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- HELPER COMPONENT 4: QuickSummaryCard ---
const QuickSummaryCard = ({ itemsCount, subtotal, totalCharges, totalAmount }: { itemsCount: number; subtotal: number; totalCharges: number; totalAmount: number; }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <span>Items ({itemsCount})</span>
                    <span>{useCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between mt-1">
                    <span>Charges</span>
                    <span>{useCurrency(totalCharges)}</span>
                </div>
                <div className="flex justify-between mt-3 font-semibold border-t pt-2">
                    <span>Grand Total</span>
                    <span>{useCurrency(totalAmount)}</span>
                </div>
            </CardContent>
        </Card>
    );
};


// --- MAIN COMPONENT ---
export default function ConfirmOrder() {
    const router = useRouter();
    const { user } = useAuth();
    const { tempOrderData, setTempOrderData, addOrder } = useOrderStore();

    const [items, setItems] = useState(tempOrderData?.items || []);
    const [charges, setCharges] = useState<Charge[]>(
        [{ id: `c-${Date.now()}`, name: "GST", type: "percent", value: 0 }]
    );

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

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const percentChargesAmount = charges
        .filter((c) => c.type === "percent")
        .reduce((sum, c) => sum + (subtotal * (c.value || 0)) / 100, 0);

    const fixedChargesAmount = charges
        .filter((c) => c.type === "amount")
        .reduce((sum, c) => sum + (c.value || 0), 0);

    const totalAmount = subtotal + percentChargesAmount + fixedChargesAmount;

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
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Confirm Your Order</h1>
                        <p className="text-sm text-muted-foreground">Review items, add charges, then place the order.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <CustomerInfoCard customer={tempOrderData.customer} />
                        <OrderItemsCard items={items} onQuantityChange={handleQuantityChange} onDelete={handleDelete} />
                    </div>

                    <div className="space-y-6">
                        <BillDetailsCard
                            charges={charges}
                            setCharges={setCharges}
                            subtotal={subtotal}
                            totalAmount={totalAmount}
                            fixedChargesAmount={fixedChargesAmount}
                            percentChargesAmount={percentChargesAmount}
                            loading={loading}
                            onPlaceOrder={handlePlaceOrder}
                        />
                        <QuickSummaryCard
                            itemsCount={items.length}
                            subtotal={subtotal}
                            totalCharges={fixedChargesAmount + percentChargesAmount}
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
