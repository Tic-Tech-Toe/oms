"use client";

import { OrderType } from "@/types/orderType";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { auth } from "@/app/config/firebase";
import { updateOrderInFirestore } from "@/utils/order/getFireStoreOrders";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { STATUS_WHATSAPP_CONFIG } from "@/utils/whatsappConfig";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface OrderUpdateDialogProps {
  order: OrderType;
  setOpen: (open: boolean) => void;
  refreshOrders: () => void;
}

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const OrderUpdateDialog = ({ order, setOpen, refreshOrders }: OrderUpdateDialogProps) => {
  const { toast, dismiss } = useToast();
  const { updateOrder } = useOrderStore();
  const user = auth.currentUser;
  const [invoiceNumber, setInvoiceNumber] = useState(order.invoiceNumber || "");
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress || "");
  const [billingAddress, setBillingAddress] = useState(order.billingAddress || "");
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || "UPI");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingLink || "");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<Date | null>(
    order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate) : null
  );
  const [status, setStatus] = useState(order.status);

  const handleUpdate = async () => {
    if (!user) return;

    // Build update payload and filter out undefined/null
    const rawPayload: any = {
      invoiceNumber,
      shippingAddress,
      billingAddress,
      paymentMethod,
      trackingNumber,
      // only include if set
      estimatedDeliveryDate: estimatedDeliveryDate ? estimatedDeliveryDate.toISOString() : undefined,
      status,
      timeline: [
        ...(order.timeline || []),
        { date: new Date().toISOString(), action: status === order.status ? "Details updated" : status },
      ],
    };
    const updatePayload = Object.fromEntries(
      Object.entries(rawPayload).filter(([_, v]) => v !== undefined && v !== null)
    );

    try {
      // Firestore
      // await updateOrderInFirestore(user.uid, order.id, updatePayload as Partial<OrderType>);
      // Zustand store
      await updateOrder(user.uid, order.id, updatePayload as Partial<OrderType>);

      // WhatsApp prompt for status change
      if (status !== order.status && STATUS_WHATSAPP_CONFIG[status]) {
        const { apiRoute, getPayload } = STATUS_WHATSAPP_CONFIG[status];
        const payload = getPayload({ original: { ...order, ...updatePayload } });
        const toastHandle = toast({
          title: `Order ${status}`,
          description: `Send '${status}' update via WhatsApp?`,
          duration: 5000,
          action: (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  const res = await fetch(apiRoute, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (!data.success) {
                    toast({ title: "WhatsApp error", description: data.message, variant: "destructive" });
                  }
                  dismiss(toastHandle.id);
                }}
              >
                ✅
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismiss(toastHandle.id)}
              >
                ❌
              </Button>
            </div>
          ),
        });
      } else {
        toast({ title: "Order Updated", description: "Order details saved successfully." });
      }

      refreshOrders();
      setOpen(false);
    } catch (err) {
      console.error("Error updating order:", err);
      toast({ title: "Update Failed", description: "Could not save changes.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">Update Order Details</h2>
        <p className="text-muted-foreground text-sm">Modify status, shipping, payment, and tracking information as needed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select value={status} onValueChange={setStatus} className="rounded-xl border-2 border-purple-200 dark:border-purple-700">
            <SelectTrigger><span>{status}</span></SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {/* Invoice Number */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Invoice Number</label>
          <Input
            placeholder="Enter invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="rounded-xl border-2 border-purple-200 dark:border-purple-700"
          />
        </div>
        {/* Payment Method */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-foreground">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="rounded-xl border-2 border-purple-200 dark:border-purple-700 px-3 py-2 text-sm bg-background"
          >
            <option value="UPI">UPI</option>
            <option value="credit card">Credit Card</option>
            <option value="bank transfer">Bank Transfer</option>
            <option value="cash on delivery">Cash on Delivery</option>
          </select>
        </div>
        {/* Shipping Address */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Shipping Address</label>
          <Input
            placeholder="Enter shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="rounded-xl border-2 border-purple-200 dark:border-purple-700"
          />
        </div>
        {/* Billing Address */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Billing Address</label>
          <Input
            placeholder="Enter billing address"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="rounded-xl border-2 border-purple-200 dark:border-purple-700"
          />
        </div>
        {/* Tracking Number */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Tracking Number</label>
          <Input
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="rounded-xl border-2 border-purple-200 dark:border-purple-700"
          />
        </div>
        {/* Estimated Delivery Date */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-sm font-medium text-foreground">Estimated Delivery Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl border-2 border-purple-200 dark:border-purple-700",
                  !estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {estimatedDeliveryDate ? format(estimatedDeliveryDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={estimatedDeliveryDate}
                onSelect={setEstimatedDeliveryDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
        <Button onClick={handleUpdate} className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-2 shadow-lg transition-all duration-200">Save Changes</Button>
      </div>
    </div>
  );
};

export default OrderUpdateDialog;
