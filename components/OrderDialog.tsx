"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import CustomerNameField from "./forms/Add-Order/CustomerName";
import WhatsAppNumberField from "./forms/Add-Order/WhatsappNumber";
import OrderDate from "./forms/Add-Order/OrderDate";
import { AddOrderSchema } from "@/lib/validations";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemType, OrderItem, OrderType } from "@/types/orderType";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/app/config/firebase";
import {
  decreaseInventoryStock,
  useOrderStore,
} from "@/hooks/zustand_stores/useOrderStore";
import {
  addCustomer,
  getCustomers,
} from "@/utils/customer/getFirestoreCustomers";
import { useInventoryStore } from "@/hooks/zustand_stores/useInventoryStore";
import OrderStatus from "./forms/Add-Order/OrderStatus";
import PickOrderField from "./forms/Add-Order/PickOrder";

type FormData = z.infer<typeof AddOrderSchema>;

const OrderDialog = () => {
  const [sendToWhatsapp, setSendToWhatsapp] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState("");
  const [status, setStatus] = useState("pending");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const { addOrder } = useOrderStore();
  const user = auth.currentUser;

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
    setSendToWhatsapp(false);
    setStatus("pending");
    setOpen(false);
  };

  const handleSendToWhatsapp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendToWhatsapp(e.target.checked);
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
        // console.log("Is this customerId",newCustomer)
        // console.log(customerId);
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
      orderDate: data.orderDate.toDateString(),
      status,
      paymentStatus: "pending",
      totalAmount,
      invoiceNumber: "",
      items: transformedItems,
      customer: {
        id: customerId || "unknown",
        name: data.customerName,
        whatsappNumber: whatsappNum,
        // rewardPoint: 0,
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

    const result = await addOrder(user?.uid || "", newOrder);
    // console.log(result);

    if (result.success) {
      // 🔽 Decrease stock quantities in Firestore
      const updateResult = await decreaseInventoryStock(
        user?.uid || "",
        transformedItems
      );

      if (!updateResult.success) {
        toast({
          title: "Partial Inventory Update",
          description: `Order placed, but failed to update stock for: ${updateResult.failedItems.join(", ")}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order Added!",
          description: `Order placed for ${data.customerName}. Inventory updated.`,
        });
      }

      // 🔄 Reload Zustand inventory
      const { loadInventory } = useInventoryStore.getState();
      await loadInventory(user?.uid || "");

      // 📤 Send WhatsApp message if enabled
      if (sendToWhatsapp) {
        try {
          const messageBody = [
            data.customerName,
            result.orderId,
            // result.invoiceNumber === "" ? result.orderId : result.invoiceNumber,
            data.orderDate.toDateString(),
            transformedItems
              .map((item) => `${item.quantity} × ${item.itemName}`)
              .join(", "),
          ];

          console.log(messageBody);

          if (messageBody.some((item) => !item)) {
            toast({
              title: "Error",
              description: "The message body is missing some details.",
              variant: "destructive",
            });
            return;
          }

          const res = await fetch("/api/order-received", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: whatsappNum,
              messageBody,
            }),
          });

          const resData = await res.json();
          if (resData.success) {
            toast({
              title: "Message Sent!",
              description: `Order details sent to ${data.customerName} on WhatsApp.`,
            });
          } else {
            toast({
              title: "Failed to Send Message",
              description: resData.message || "Unknown error",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error sending WhatsApp message:", error);
          toast({
            title: "Error",
            description:
              "There was an error sending the message. Please try again.",
            variant: "destructive",
          });
        }
      }

      handleDialogClose();
      // console.log("📝 New Order:", newOrder);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="bg-light-primary text-white px-4 py-2 rounded-2xl hover:bg-blue-700">
          <Plus className="text-xl mr-2" />
          Add Order
        </Button>
      </DialogTrigger>

      <DialogContent className="animate-in fade-in-0 zoom-in-95 p-7 px-8 w-[90vw] max-w-[600px] max-h-[90vh] overflow-y-auto max-sm:w-full max-sm:max-h-[85vh] backdrop-blur-xl border border-zinc-300/20 dark:border-white/10 shadow-2xl rounded-xl transition-all duration-300">
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

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-sm:grid-cols-1 max-sm:gap-y-4 mt-4">
              <OrderStatus status={status} setStatus={setStatus} />
              <OrderDate />
            </div>

            <PickOrderField userId={user?.uid || ""} />

            <DialogFooter className="mt-10 mb-4 w-full">
              {/* Mobile layout */}
              <div className="sm:hidden flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleDialogClose}
                    className="h-12 w-1/2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-red-100 dark:hover:bg-red-900"
                    variant="ghost"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <label className="w-1/2 flex items-center justify-center gap-3 h-12 px-2 border-2 rounded-xl cursor-pointer hover:shadow-md border-light-primary dark:border-zinc-600">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      WhatsApp
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={sendToWhatsapp}
                        onChange={handleSendToWhatsapp}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${sendToWhatsapp ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${sendToWhatsapp ? "translate-x-5" : ""}`}
                        />
                      </div>
                    </div>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-md"
                >
                  Add Order
                </Button>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:flex sm:items-center sm:justify-between gap-4 w-full">
                <Button
                  type="button"
                  onClick={handleDialogClose}
                  className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-red-100 dark:hover:bg-red-900"
                  variant="ghost"
                >
                  <X className="w-5 h-5" />
                </Button>
                <label className="w-full sm:flex-1 flex items-center justify-center gap-3 h-12 px-4 border-2 rounded-xl cursor-pointer hover:shadow-md border-light-primary dark:border-zinc-600">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Send to WhatsApp
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={sendToWhatsapp}
                      onChange={handleSendToWhatsapp}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 flex items-center rounded-full p-1 transition-all ${sendToWhatsapp ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${sendToWhatsapp ? "translate-x-5" : ""}`}
                      />
                    </div>
                  </div>
                </label>
                <Button
                  type="submit"
                  className="h-12 w-full sm:flex-[2] rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold shadow-md"
                >
                  Add Order
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
