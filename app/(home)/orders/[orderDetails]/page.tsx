"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import OrderDetailComponent from "@/components/OrderDetailComponent";
import OrderPaymentDetailComponent from "@/components/OrderPaymentDetailComponent";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import OrderTimeline from "@/components/OrderTimeline";
import { getBadgeClass } from "@/utils/statusUtils";
import { OrderCustomerRel } from "@/components/OrderCustomerRel";
import FooterComponent from "@/components/FooterComponent";
import { useToast } from "@/hooks/use-toast";
import { updateOrderInFirestore } from "@/utils/order/getFireStoreOrders";
import { STATUS_WHATSAPP_CONFIG } from "@/utils/whatsappConfig";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/config/firebase";
import { Check, X } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { handleSendPaymentReminder } from "@/utils/sendPaymentReminder";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserData } from "@/utils/user/fetchUseData";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";

const OrderDetails = () => {
  const { allOrders } = useOrderStore();
  const { customers, loadCustomers } = useCustomerStore();

  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);

  const { toast, dismiss } = useToast();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");

    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      const latestOrder =
        allOrders.find((o) => o.id === parsedOrder.id) || parsedOrder;
      setOrder(latestOrder);
    }
  }, [allOrders]);

  useEffect(() => {
    if(userId){
      loadCustomers(userId)
    }
  },[userId, loadCustomers])

  const relCustomer = customers.find((c) => c.id === order?.customer?.id)

  const handleOrderProcess = async (order: OrderType) => {
    alert("Order processing");
    if (!order || !userId) return;

    const timelineEntry = {
      date: new Date().toISOString(),
      action: "Marked as Processing",
    };

    const updatePayload = {
      status: "Processing",
      timeline: [...(order.timeline ?? []), timelineEntry],
    };

    try {
      await updateOrderInFirestore(userId, order.id, updatePayload);

      // 👇 Update local order state so the badge reflects new status
      setOrder({
        ...order,
        status: "Processing",
        timeline: [...(order.timeline ?? []), timelineEntry],
      });

      const { apiRoute, getPayload } = STATUS_WHATSAPP_CONFIG["Processing"];
      const payload = getPayload({ original: order });

      const handle = toast({
        title: "Order Marked as Processing",
        description: "Send update via WhatsApp?",
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
                  toast({
                    title: "WhatsApp error",
                    description: data.message,
                    variant: "destructive",
                  });
                }
                dismiss(handle.id);
              }}
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dismiss(handle.id)}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Failed to mark order as processing",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // const handleSendPaymentReminder = async () => {
  //   if (!order) {
  //     alert("Order data is missing.");
  //     return;
  //   }

  //   const phoneNumber = order.customer?.whatsappNumber;

  //   if (!phoneNumber) {
  //     alert("Customer WhatsApp number is missing.");
  //     return;
  //   }

  //   const messageBody = [
  //     order.customer?.name || "Customer",
  //     `${useCurrency(order.totalAmount - (order?.payment?.totalPaid || 0))}`,
  //     order.invoiceNumber || order.id,
  //     order.orderDate || "N/A",
  //     `${order?.payment?.totalPaid || 0}`,
  //     `${order.totalAmount}`,
  //   ];

  //   try {
  //     const res = await fetch("/api/payment-reminder", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phoneNumber, messageBody }),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       alert("✅ Payment reminder sent successfully!");
  //     } else {
  //       alert("❌ Failed to send reminder: " + data.message);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Something went wrong while sending the reminder.");
  //   }
  // };

  if (!order) return <p>Loading...</p>;

  const handleNavigation = (e: any) => {
    e.preventDefault();
    router.back();
  };

  const orderSummary = (
    <div className="shadow-xl border border-light-light-gray dark:border-zinc-900 rounded-2xl overflow-hidden">
      <div className="p-4">
        <span className="inline-flex items-center gap-2">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <Badge
            className={`rounded-full text-xs mt-1 ${getBadgeClass(order.status || "", "order")}`}
          >
            {order.status}
          </Badge>
        </span>
        <OrderDetailComponent order={order} />
      </div>
      <FooterComponent
        text="Review items"
        order={order}
        status={order.status}
        buttonOneLabel="Order processed"
        buttonTwoLabel="Update order"
        onButtonOneClick={() => handleOrderProcess(order)}
        onButtonTwoClick={() => console.log("Updating order", order.id)}
      />
    </div>
  );

  const paymentSummary = (
    <div className="shadow-xl border border-light-light-gray dark:border-zinc-900 rounded-2xl overflow-hidden">
      <h3 className="ml-6">Invoice No. : {order.invoiceNumber}</h3>
      <div className="p-4">
        <span className="inline-flex items-center gap-2">
          <h3 className="text-xl font-semibold mb-2">Payment Summary</h3>
          <Badge
            className={`rounded-full text-xs mt-1 ${getBadgeClass(order.paymentStatus || "", "payment")}`}
          >
            {order.paymentStatus}
          </Badge>
        </span>
        <OrderPaymentDetailComponent order={order} />
      </div>
      <FooterComponent
        text="Review order and set payment status"
        order={order}
        status={order.paymentStatus}
        buttonOneLabel="Send Payment Reminder"
        buttonTwoLabel="Collect payment"
        onButtonOneClick={() => {
          let selectedDueDate = new Date().toISOString().split("T")[0]; // default today

          const toastId = toast({
            title: "Set Due Date",
            description: (
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  id="dueDateInput"
                  className="border rounded p-2 w-full"
                  defaultValue={selectedDueDate}
                  onChange={(e) => {
                    selectedDueDate = e.target.value;
                  }}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      // alert(selectedDueDate); //  selected date
                      await handleSendPaymentReminder(order, selectedDueDate);
                      dismiss(toastId.id);
                    }}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dismiss(toastId.id)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ),
            duration: 999999, // until dismissed manually
          });
        }}
        showDialogForButtonTwo={true}
      />
    </div>
  );

  return (
    <div className="px-4">
      <span className="px-2 py-1 font-bold font-mono text-sm text-gray-400">
        <Link
          href="/orders"
          onClick={handleNavigation}
          className="hover:text-black dark:hover:text-white"
        >
          orders
        </Link>
        /#{order.id}
      </span>

      <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">Order ID: {order.id}</span>
            <Badge
              className={`rounded-full text-xs mt-1 ${getBadgeClass(order.paymentStatus || "", "payment")}`}
            >
              Payment {order.paymentStatus}
            </Badge>
          </div>
          <span className="text-sm font-semibold">{order.orderDate}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {orderSummary}
          {paymentSummary}
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="p-4 border rounded-2xl shadow-xl">
            <OrderCustomerRel customer={relCustomer || order.customer} userId={userId} />
          </div>
          <div className="p-4 border rounded-2xl shadow-xl">
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
