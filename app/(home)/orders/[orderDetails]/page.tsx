"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusBadgeClass } from "@/lib/utils";

const OrderDetails = () => {
  const [order, setOrder] = useState<OrderType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem("selectedOrder");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      console.log(parsedOrder);
      setOrder(parsedOrder);
    }
  }, []);

  if (!order) return <p>Loading...</p>;

  const handleNavigation = (e) => {
    e.preventDefault();
    router.back(); // Go back without re-rendering
  };

  return (
    <div className="md:mt-20">
      <span className="px-2 md:py-0 py-1 font-bold font-mono text-sm text-gray-400">
        <a href="/orders" onClick={handleNavigation} className="dark:hover:text-white hover:text-black cursor-pointer">
          orders
        </a>
        /#{order.id}
      </span>
      <div className="px-4 py-2">
        <div className="flex items-center gap-2"><h1 className="text-2xl font-semibold">Order ID: {order.id}</h1>
          <Badge className={`rounded-full md:font-normal font-xs select-none shadow-none ${getPaymentStatusBadgeClass(order.paymentStatus || "")}`}>
              Payment {order.paymentStatus}
          </Badge>
        </div>
        <span>{order.orderDate}</span>
      
      <p className="mt-4">
        <span className="font-semibold">Order ID:</span> {order.id}
      </p>
      <p>
        <span className="font-semibold">Customer Name:</span> {order.customer.name}
      </p>
      <p>
        <span className="font-semibold">Order Value:</span> ₹ {order.totalAmount.toFixed(2)}
      </p>
      <p>
        <span className="font-semibold">Order Status:</span> {order.status}
      </p>
      <p>
        <span className="font-semibold">Payment Status:</span> {order.paymentStatus}
      </p>
      <p>
        <span className="font-semibold">Order Date:</span> {order.orderDate}
      </p>
      </div>
    </div>
  );
};

export default OrderDetails;
