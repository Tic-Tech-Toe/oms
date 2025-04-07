// app/components/OrderDialog.tsx

"use client";

import React, { useState } from "react";
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
import PickOrderField from "./forms/Add-Order/PickOrder";
import OrderStatus from "./forms/Add-Order/OrderStatus";
import OrderDate from "./forms/Add-Order/OrderDate";
import { AddOrderSchema } from "@/lib/validations";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderItem, OrderType } from "@/types/orderType";
import { mockItemsData } from "@/data/item";
import { useOrderStore } from "@/hooks/useOrderStore";
import { useToast } from "@/hooks/use-toast";

type FormData = z.infer<typeof AddOrderSchema>;

const OrderDialog = () => {
  const [sendToWhatsapp, setSendToWhatsapp] = useState(false);
  const [whatsappNum, setWhatsappNum] = useState("");
  const [status, setStatus] = useState("pending");

  const methods = useForm<FormData>({
    resolver: zodResolver(AddOrderSchema),
    defaultValues: {
      customerName: "",
      items: [],
    },
  });

  const { addOrder } = useOrderStore(); // Access addOrder from store
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FormData) => {
    console.log("Inside form submission");
    console.log(data);

    // Transform the items data into the required format
    const transformedItems: OrderItem[] = data.items.map((item) => {
      const productData = mockItemsData.find(
        (product) => product.itemId === item.itemId
      );
      if (!productData) {
        return {
          itemId: item.itemId,
          quantity: item.quantity,
          price: 0,
          total: 0,
          sku: "Unknown",
          category: "Unknown",
          itemName: "unknown",
        };
      }

      return {
        itemId: productData.itemId,
        quantity: item.quantity,
        price: productData.price,
        total: productData.price * item.quantity,
        sku: productData.sku,
        category: productData.category,
        itemName: productData.name,
      };
    });

    // Create a new order object
    const newOrder: OrderType = {
      id: "Dy-001",
      orderDate: data.orderDate.toDateString(),
      status: "processing",
      paymentStatus: "pending",
      totalAmount: 444,
      items: transformedItems,
      customer: {
        name: data.customerName,
        whatsappNumber: whatsappNum,
        rewardPoint: 0,
      },
      createdAt: data.orderDate.toISOString(),
      updatedAt: data.orderDate.toISOString(),
    };

    // Add the new order to the store
    const result = await addOrder(newOrder);

    if (result.success) {
      toast({
        title: "Order Added!",
        description: `The order has been placed for ${data.customerName} successfully.`,
      });

      // Handle WhatsApp sending logic if the checkbox is checked
      if (sendToWhatsapp) {
        const messageBody = [
          data.customerName,
          newOrder.id,
          data.orderDate.toDateString(),
          transformedItems
            .map((item) => `- ${item.quantity} × ${item.itemName}`)
            .join(", "),
        ];

        console.log("Message body:", messageBody);

        // Check for missing details in messageBody
        if (messageBody.some((item) => !item)) {
          toast({
            title: "Error",
            description: "The message body is missing some details.",
            variant: "destructive",
          });
          return;
        }

        try {
          const whatsappResponse = await fetch("/api/order-received", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phoneNumber: whatsappNum,
              messageBody,
            }),
          });

          const whatsappResult = await whatsappResponse.json();
          // console.log(whatsappResult);

          if (whatsappResult.success) {
            toast({
              title: "Message Sent!",
              description: `Order details sent to ${data.customerName} on WhatsApp.`,
            });
          } else {
            toast({
              title: "Failed to Send Message",
              description: whatsappResult.message || "Unknown error",
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
    }

    handleDialogClose();
    setOpen(false);
    console.log(newOrder);
  };

  const handleDialogClose = () => {
    methods.reset();
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleSendToWhatsapp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendToWhatsapp(e.target.checked);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="text-sm font-semibold text-light-primary border-2 border-light-primary hover:border-light-button-hover px-6 py-2 rounded-md ">
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
              <CustomerNameField />
              <WhatsAppNumberField setWhatsappNum={setWhatsappNum} />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-sm:grid-cols-1 max-sm:gap-y-4 mt-4">
              <OrderStatus status={status} setStatus={setStatus} />
              <OrderDate />
            </div>
            <PickOrderField />

            <DialogFooter className="mt-10 mb-4 w-full">
              {/* Mobile layout */}
              <div className="sm:hidden flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center gap-4">
                  {/* Cancel Button */}
                  <Button
                    type="button"
                    onClick={handleDialogClose}
                    className="h-12 w-1/2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-150 flex items-center justify-center"
                    variant="ghost"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </Button>

                  {/* WhatsApp Toggle */}
                  <label className="w-1/2 flex items-center justify-center gap-3 h-12 px-2 border-2 rounded-xl transition-all duration-150 cursor-pointer hover:shadow-md border-light-primary dark:border-zinc-600">
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
                        className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                          sendToWhatsapp
                            ? "bg-green-500"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                            sendToWhatsapp ? "translate-x-5" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold tracking-wide shadow-md transition-all"
                >
                  Add Order
                </Button>
              </div>

              {/* Desktop layout */}
              <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                {/* Cancel Button */}
                <Button
                  type="button"
                  onClick={handleDialogClose}
                  className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-150 flex items-center justify-center"
                  variant="ghost"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </Button>

                {/* WhatsApp Toggle */}
                <label className="w-full sm:flex-1 flex items-center justify-center gap-3 h-12 px-4 border-2 rounded-xl transition-all duration-150 cursor-pointer hover:shadow-md border-light-primary dark:border-zinc-600">
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
                      className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                        sendToWhatsapp
                          ? "bg-green-500"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                          sendToWhatsapp ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </div>
                </label>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="h-12 w-full sm:flex-[2] rounded-xl bg-light-primary text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold tracking-wide shadow-md transition-all"
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
