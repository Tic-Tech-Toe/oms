"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ For programmatic routing
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
import { Plus, X } from "lucide-react";
import CustomerNameField from "../forms/Add-Order/CustomerName";
import WhatsAppNumberField from "../forms/Add-Order/WhatsappNumber";
import OrderDate from "../forms/Add-Order/OrderDate";
import { AddOrderSchema } from "@/lib/validations";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemType, OrderItem, OrderType } from "@/types/orderType";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/app/config/firebase";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import {
  addCustomer,
  getCustomers,
} from "@/utils/customer/getFirestoreCustomers";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import PickOrderField from "../forms/Add-Order/PickOrder";

type FormData = z.infer<typeof AddOrderSchema>;

const OrderDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [whatsappNum, setWhatsappNum] = useState("");
  const [status, setStatus] = useState("pending");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const { toast } = useToast();
  const { setTempOrderData } = useOrderStore(); // ✅ Zustand setter for temp order
  const user = auth.currentUser;
  const router = useRouter(); // ✅ for redirecting

  const { inventory, loadInventory } = useInventoryStore();
  const items = inventory;

  const methods = useForm<FormData>({
    resolver: zodResolver(AddOrderSchema),
    defaultValues: {
      customerName: "",
      items: [],
    },
  });

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
        console.error("Error fetching data:", error);
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
  };

  const onSubmit = async (data: FormData) => {
    if (!items || items.length === 0) {
      toast({
        title: "No Inventory Loaded",
        description: "Cannot place order as inventory data is missing.",
        variant: "destructive",
      });
      return;
    }

    const transformedItems: OrderItem[] = data.items.map((item) => {
      const productData = items.find(
        (product: ItemType) => product.itemId === item.itemId
      );

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

    const totalAmount = transformedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    let customerId = "";
    let customerName = data.customerName;

    if (isNewCustomer && user?.uid) {
      try {
        const newCustomer = await addCustomer(user.uid, {
          name: customerName,
          whatsappNumber: whatsappNum,
          rewardPoint: 0,
          createdAt: new Date().toISOString(),
        });
        customerId = newCustomer;
      } catch (error) {
        console.error("❌ Failed to add new customer:", error);
        toast({
          title: "Error",
          description: "Failed to add the new customer to the database.",
          variant: "destructive",
        });
        return;
      }
    } else if (selectedCustomer) {
      customerId = selectedCustomer.id;
    }

    const newOrder: OrderType = {
      orderDate: data.orderDate.toISOString(),
      status,
      paymentStatus: "pending",
      totalAmount,
      invoiceNumber: "",
      items: transformedItems,
      customer: {
        id: customerId || "unknown",
        name: data.customerName,
        whatsappNumber: whatsappNum,
      },
      createdAt: data.orderDate.toISOString(),
      updatedAt: data.orderDate.toISOString(),
      timeline: [
        { date: data.orderDate.toISOString(), action: "Order placed" },
      ],
      payment: {
        id: `pay-${Date.now()}`,
        orderId: "Dy-001",
        customerId: user?.uid || "unknown",
        totalPaid: 0,
        partialPayments: [],
      },
    };

    // ✅ Save to Zustand temporarily
    setTempOrderData(newOrder);

    // ✅ Redirect to confirmation step
    router.push("/orders/new/confirm-order");

    // ✅ Optional: close dialog if needed
    handleDialogClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="p-7 px-8 w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto max-sm:w-full max-sm:max-h-[85vh] backdrop-blur-xl border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium text-zinc-900 dark:text-zinc-100">
            Add Order
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Fill the form to add a new order
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-sm:grid-cols-1 max-sm:gap-y-4 mt-6">
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

            <div className="grid grid-cols-1 gap-y-6 mt-4">
              <OrderDate />
            </div>

            <PickOrderField userId={user?.uid || ""} />

            <DialogFooter className="mt-10 mb-4 w-full">
              <div className="flex justify-end w-full gap-4">
                <Button
                  type="button"
                  onClick={handleDialogClose}
                  className="h-12 px-5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-red-100 dark:hover:bg-red-900"
                  variant="ghost"
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-md"
                >
                  Next
                </Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
