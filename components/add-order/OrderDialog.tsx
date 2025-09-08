"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomerNameField from "../forms/Add-Order/CustomerName";
import WhatsAppNumberField from "../forms/Add-Order/WhatsappNumber";
import OrderDate from "../forms/Add-Order/OrderDate";
import PickOrderField from "../forms/Add-Order/PickOrder";
import { AddOrderSchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/app/config/firebase";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import { addCustomer, getCustomers } from "@/utils/customer/getFirestoreCustomers";
import { ItemType, OrderItem, OrderType } from "@/types/orderType";

type FormData = z.infer<typeof AddOrderSchema>;

const OrderDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [whatsappNum, setWhatsappNum] = useState("");
  const [status, setStatus] = useState("pending");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const { toast } = useToast();
  const { setTempOrderData } = useOrderStore();
  const user = auth.currentUser;
  const router = useRouter();
  const { inventory, loadInventory } = useInventoryStore();

  const methods = useForm<FormData>({
    resolver: zodResolver(AddOrderSchema),
    defaultValues: { customerName: "", items: [] },
  });

  // 🔍 watch form data to show live summary
  const watchedItems = useWatch({ control: methods.control, name: "items" });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const [customerData] = await Promise.all([
          getCustomers(user.uid),
          loadInventory(user.uid),
        ]);
        setCustomers(customerData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load customer or inventory data.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [user?.uid]);

  const handleDialogClose = () => {
    methods.reset();
    setWhatsappNum("");
    setStatus("pending");
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    const items = inventory;
    if (!items || items.length === 0) {
      toast({
        title: "No Inventory Loaded",
        description: "Cannot place order as inventory data is missing.",
        variant: "destructive",
      });
      return;
    }

    const transformedItems: OrderItem[] = data.items.map((item) => {
      const productData = items.find((p: ItemType) => p.itemId === item.itemId);
      return productData
        ? {
            itemId: productData.itemId,
            quantity: item.quantity,
            price: productData.price,
            total: productData.price * item.quantity,
            sku: productData.sku,
            category: productData.category,
            itemName: productData.name,
          }
        : {
            itemId: item.itemId,
            quantity: item.quantity,
            price: 0,
            total: 0,
            sku: "Unknown",
            category: "Unknown",
            itemName: "unknown",
          };
    });

    const totalAmount = transformedItems.reduce((sum, item) => sum + item.total, 0);

    const newOrder: OrderType = {
      orderDate: data.orderDate.toISOString(),
      status,
      paymentStatus: "pending",
      totalAmount,
      invoiceNumber: "",
      items: transformedItems,
      customer: {
        id: selectedCustomer?.id || "unknown",
        name: data.customerName,
        whatsappNumber: whatsappNum,
      },
      createdAt: data.orderDate.toISOString(),
      updatedAt: data.orderDate.toISOString(),
      timeline: [{ date: data.orderDate.toISOString(), action: "Order placed" }],
      payment: {
        id: `pay-${Date.now()}`,
        orderId: "Dy-001",
        customerId: user?.uid || "unknown",
        totalPaid: 0,
        partialPayments: [],
      },
    };

    setTempOrderData(newOrder);
    router.push("/orders/new/confirm-order");
    handleDialogClose();
  };

  // 📝 compute summary
  const summaryItems = watchedItems?.map((item) => {
    const product = inventory.find((p) => p.itemId === item.itemId);
    return {
      name: product?.name || "Unknown",
      qty: item.quantity,
      price: product?.price || 0,
      total: (product?.price || 0) * item.quantity,
    };
  }) || [];

  const total = summaryItems.reduce((sum, i) => sum + i.total, 0);

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className=" overflow-y-auto  max-w-6xl backdrop-blur-xl border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium">Add Order</DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill the form to add a new order
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card → Form */}
          <div className="p-6 rounded-2xl border bg-white/80 dark:bg-zinc-900/50 shadow-md">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                  <CustomerNameField
                    customers={customers}
                    isNewCustomer={isNewCustomer}
                    setIsNewCustomer={setIsNewCustomer}
                    setWhatsappNum={setWhatsappNum}
                    setSelectedCustomer={setSelectedCustomer}
                  />
                  <WhatsAppNumberField
                    whatsappNum={whatsappNum}
                    setWhatsappNum={setWhatsappNum}
                  />
                </div>
                <OrderDate />
                <PickOrderField userId={user?.uid || ""} />
                <DialogFooter className="pt-6 flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={handleDialogClose}
                    className="h-12 px-5 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                    variant="ghost"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-light-primary text-white font-semibold shadow-md"
                  >
                    Next
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </div>

          {/* Right Card → Order Summary */}
          <div className="p-6 rounded-2xl border bg-zinc-50 dark:bg-zinc-800/40 shadow-md hidden md:block">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {summaryItems.length > 0 ? (
                summaryItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm border-b pb-2 last:border-none last:pb-0"
                  >
                    <span>{item.name} × {item.qty}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 text-sm">No items selected</p>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
