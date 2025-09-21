"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/types/orderType";
import { useParams, useRouter } from "next/navigation";
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
import {
  getOrderFromFirestore,
  updateOrderInFirestore,
} from "@/utils/order/getFireStoreOrders";
import { STATUS_WHATSAPP_CONFIG } from "@/utils/whatsappConfig";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/config/firebase";
import { Check, ChevronRight, Send, X } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { handleSendPaymentReminder } from "@/utils/sendPaymentReminder";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
import SendTrackingDialog from "@/components/SendTrackingDialog";
import { set } from "lodash";
import { Dialog } from "@/components/ui/dialog";
import { format } from "date-fns";
import OrderPaymentCollect from "@/components/OrderPaymentCollect";

const OrderDetails = () => {
  const { allOrders, loadOrders } = useOrderStore(); // Ensure you have loadOrders
  const { customers, loadCustomers } = useCustomerStore();
  const { id } = useParams(); // Get the order ID from the URL
  //console.table({"Current Order" : id})

  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);

  const { toast, dismiss } = useToast();
  const userId = auth.currentUser?.uid;

  const [showLinkInp, setShowLinkInp] = useState(false);
  const [showPaymentCollect, setShowPaymentCollect] = useState(false);

  const [orderEditting, setOrderEditting] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Attempt to find the order from the Zustand store first
    const foundOrder = allOrders.find((o) => o.id === id);

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // If not found in the store, fetch it directly
      // This is the fallback for when the store is empty (e.g., on mobile)
      const fetchOrder = async () => {
        const orderData = await getOrderFromFirestore(userId, id); // You'll need this function
        setOrder(orderData);
        // You may also want to update the Zustand store with this new data
        // For a more robust solution
      };

      fetchOrder();
    }

    // Load customers as well
    loadCustomers(userId);
  }, [id, userId, allOrders, loadCustomers]);

  if (!order) {
    // Correctly show loading state while data is being fetched
    return <p>Loading...</p>;
  }

  const relCustomer = customers.find((c) => c.id === order?.customer?.id);

  const handleNavigation = (e: any) => {
    e.preventDefault();
    router.back();
  };

  const handleSendInvoice = () => {
    router.push(`/invoice/${order.id}`);
  };

  const handleSendTracking = async () => {
    router.push(`/tracking/${order.id}`);

    // const res = await fetch("/api/send-track", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     phoneNumber: order.customer?.whatsappNumber,
    //     orderId: order.id,
    //     eta: "Tomorrow 5PM",
    //     trackingId: "12345", // could be your real tracking code
    //   }),
    // });

    // const data = await res.json();
    // if (data.success) {
    //   alert("✅ Tracking link sent via WhatsApp!");
    // } else {
    //   alert("❌ Failed to send tracking link.");
    // }
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 mb-8">
      {/* Breadcrumb */}
      <span className="px-2 py-1 font-bold font-mono text-md text-gray-400 ">
        <Link
          href="/orders"
          onClick={handleNavigation}
          className="hover:text-black dark:hover:text-white underline underline-offset-4"
        >
          orders
        </Link>
        <ChevronRight className="inline mx-1" size={14} />#{order.id}
      </span>

      {/* Header */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <Badge
              className={`rounded-full text-xs mt-1 ${getBadgeClass(
                order.paymentStatus || "",
                "payment"
              )}`}
            >
              Payment {order.paymentStatus}
            </Badge>
          </div>
          <p className="text-md font-semibold text-gray-500">
            {format(new Date(order.orderDate), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left 2/3 */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Order Info */}
          <section className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Order Information</h2>
              <Badge
                className={`rounded-full text-xs ${getBadgeClass(
                  order.status || "",
                  "order"
                )}`}
              >
                {order.status}
              </Badge>
            </div>
            <OrderDetailComponent order={order} />
            <FooterComponent
              text="Review items"
              order={order}
              status={order.status}
              buttonOneLabel="Send Tracking Link"
              buttonTwoLabel="Update Order"
              onButtonOneClick={() => setShowLinkInp(true)}
              onButtonTwoClick={() => console.log("Update order", order.id)}
            />
            {showLinkInp && (
              <SendTrackingDialog
                orderId={order.id}
                open={showLinkInp}
                phoneNumber={order.customer?.whatsappNumber}
                customerName={order.customer?.name || "Customer"}
                onClose={() => setShowLinkInp(false)}
                userId={userId}
                onOpenChange={setShowLinkInp}
              />
            )}
          </section>

          {/* Payment Info */}
          <section className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <p className="text-sm text-gray-500 mb-2">
              Invoice No: {order.invoiceNumber}
            </p>
            <OrderPaymentDetailComponent order={order} />
            {showPaymentCollect && (
              <OrderPaymentCollect
                order={order}
                setOpen={setShowPaymentCollect}
                refreshOrders={loadOrders}
              />
            )}
            <FooterComponent
              text="Manage payment"
              order={order}
              status={order.paymentStatus}
              buttonOneLabel="Send Invoice"
              buttonTwoLabel="Collect Payment"
              onButtonOneClick={() => handleSendInvoice()}
              onButtonTwoClick={() => setShowPaymentCollect(true)}
            />
          </section>
        </div>

        {/* Right 1/3 */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <section className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <OrderCustomerRel
              customer={relCustomer || order.customer}
              userId={userId}
            />
          </section>

          {/* Timeline */}
          <section className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <OrderTimeline timeline={order.timeline} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
