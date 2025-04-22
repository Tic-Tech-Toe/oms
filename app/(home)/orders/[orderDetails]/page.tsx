"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowDown, Edit } from "lucide-react";
import OrderDetailComponent from "@/components/OrderDetailComponent";
import FooterComponent from "@/components/FooterComponent";
import OrderPaymentDetailComponent from "@/components/OrderPaymentDetailComponent";
import OrderCustomerRel from "@/components/OrderCustomerRel";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore"; // ✅ Import Zustand Store
import OrderTimeline from "@/components/OrderTimeline";
import { getBadgeClass } from "@/utils/statusUtils";

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
    router.back(); // Go back without re-rendering
  };

  // Order Summary Section
  const orderSummary = (
    <div className="shadow-xl border-light-light-gray dark:border-zinc-900 border-2 rounded-2xl overflow-hidden">
      <div className="p-2">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <Badge
          className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getBadgeClass(
            order.status || "",
            "order"
          )}`}
        >
          {order.status}
        </Badge>
        <OrderDetailComponent order={order} />
      </div>
      <FooterComponent
        text="Review items"
        order={order}
        status={order.status}
        buttonOne="Order processed"
        buttonTwo="Update order"
      />
    </div>
  );

  // Payment Summary Section
  const paymentSummary = (
    <div className="shadow-xl border-light-light-gray dark:border-zinc-900 border-2 rounded-2xl overflow-hidden">
      <div className="p-2">
        <h3 className="text-xl font-semibold mb-2">Payment Summary</h3>
        <Badge
          className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getBadgeClass(
            order.paymentStatus || "",
            "payment"
          )}`}
        >
          {order.paymentStatus}
        </Badge>
        <OrderPaymentDetailComponent order={order} />
      </div>
      <FooterComponent
        order={order}
        status={order.paymentStatus}
        text="Review order and set payment status"
        buttonOne="Send Payment Reminder"
        buttonTwo="Collect payment"
      />
    </div>
  );

  return (
    <div className="px-4">
      <span className="px-2 md:py-0 py-1 font-bold font-mono text-sm text-gray-400">
        <Link
          href="/orders"
          onClick={handleNavigation} // Go back without re-rendering
          className="dark:hover:text-white hover:text-black cursor-pointer"
        >
          orders
        </Link>
        /#{order.id}
      </span>

      <div className="w-full h-10 rounded-xl mt-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">Order ID: {order.id}</span>
            <Badge
              className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getBadgeClass(
                order.paymentStatus || "",
                "payment"
              )}`}
            >
              Payment {order.paymentStatus}
            </Badge>
          </div>
          <span className="text-sm font-semibold">{order.orderDate}</span>
        </div>
      </div>

      {/* Parent div for details section */}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Details Section (2/3 width) */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {orderSummary}
          {paymentSummary}
        </div>

        {/* Right Sidebar (Customer and Timeline Info) */}
        <div className="w-full md:w-1/3">
          <div className="p-4 border rounded-2xl shadow-xl">
            <OrderCustomerRel customer={order.customer} />
          </div>
          <div className="p-4 border rounded-2xl shadow-xl mt-4">
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
