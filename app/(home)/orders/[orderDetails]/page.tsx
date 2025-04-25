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

const OrderDetails = () => {
  const { allOrders } = useOrderStore();
  const router = useRouter();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      const latestOrder = allOrders.find((o) => o.id === parsedOrder.id) || parsedOrder;
      setOrder(latestOrder);
    }
  }, [allOrders]);

  if (!order) return <p>Loading...</p>;

  const handleNavigation = (e: any) => {
    e.preventDefault();
    router.back();
  };

  const orderSummary = (
    <div className="shadow-xl border border-light-light-gray dark:border-zinc-900 rounded-2xl overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <Badge className={`rounded-full text-xs mt-1 ${getBadgeClass(order.status || "", "order")}`}>
          {order.status}
        </Badge>
        <OrderDetailComponent order={order} />
      </div>
      <FooterComponent  
        text="Review items"
        order={order}
        status={order.status}
        buttonOneLabel="Order processed"
        buttonTwoLabel="Update order"
        onButtonOneClick={() => console.log("Processing order", order.id)}
        onButtonTwoClick={() => console.log("Updating order", order.id)}
      />
    </div>
  );

  const paymentSummary = (
    <div className="shadow-xl border border-light-light-gray dark:border-zinc-900 rounded-2xl overflow-hidden">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Payment Summary</h3>
        <Badge className={`rounded-full text-xs mt-1 ${getBadgeClass(order.paymentStatus || "", "payment")}`}>
          {order.paymentStatus}
        </Badge>
        <OrderPaymentDetailComponent order={order} />
      </div>
      <FooterComponent
        text="Review order and set payment status"
        order={order}
        status={order.paymentStatus}
        buttonOneLabel="Send Payment Reminder"
        buttonTwoLabel="Collect payment"
        onButtonOneClick={() => console.log("Sending payment reminder for", order.id)}
        showDialogForButtonTwo
      />
    </div>
  );

  return (
    <div className="px-4">
      <span className="px-2 py-1 font-bold font-mono text-sm text-gray-400">
        <Link href="/orders" onClick={handleNavigation} className="hover:text-black dark:hover:text-white">
          orders
        </Link>
        /#{order.id}
      </span>

      <div className="w-full mt-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">Order ID: {order.id}</span>
            <Badge className={`rounded-full text-xs mt-1 ${getBadgeClass(order.paymentStatus || "", "payment")}`}>
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
            <OrderCustomerRel customer={order.customer} />
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
