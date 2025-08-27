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
    if (userId) {
      loadCustomers(userId);
    }
  }, [userId, loadCustomers]);

  if (!order) return <p>Loading...</p>;

  const relCustomer = customers.find((c) => c.id === order?.customer?.id);

  const handleNavigation = (e: any) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="px-4 md:px-10 lg:px-20">
      {/* Breadcrumb */}
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
          <p className="text-sm text-gray-500">{order.orderDate}</p>
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
              buttonOneLabel="Mark as Processing"
              buttonTwoLabel="Update Order"
              onButtonOneClick={() => console.log("Process order")}
              onButtonTwoClick={() => console.log("Update order", order.id)}
            />
          </section>

          {/* Payment Info */}
          <section className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment Information
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Invoice No: {order.invoiceNumber}
            </p>
            <OrderPaymentDetailComponent order={order} />
            <FooterComponent
              text="Manage payment"
              order={order}
              status={order.paymentStatus}
              buttonOneLabel="Send Reminder"
              buttonTwoLabel="Collect Payment"
              onButtonOneClick={() => console.log("Send reminder")}
              onButtonTwoClick={() => console.log("Collect payment")}
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
