"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@/types/orderType";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getPaymentStatusBadgeClass, getStatusBadgeClass } from "@/components/Table/columns";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDown01, Edit } from "lucide-react";
import { log } from "console";
import OrderDetailComponent from "@/components/OrderDetailComponent";
import FooterComponent from "@/components/FooterComponent";
import OrderPaymentDetailComponent from "@/components/OrderPaymentDetailComponent";



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

  const renderData =  [
    {
      heading: "Order Summary",
      badge: (
        <Badge
          className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getStatusBadgeClass(
            order.status || ""
          )}`}
        >
          {order.status}
        </Badge>
      ),
      component: <OrderDetailComponent order={order} />,
      footer: (
        <FooterComponent
          text="Review items"
          buttonOne="Fulfill Item"
          buttonTwo="Update order"
        />
      ),
    },
    {
      heading: "Payment Summary",
      badge: (
        <Badge
          className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getPaymentStatusBadgeClass(
            order.paymentStatus || ""
          )}`}
        >
          {order.paymentStatus}
        </Badge>
      ),
      component: <OrderPaymentDetailComponent order={order} />,
      footer: (
        <FooterComponent
          text="Review order and set payment status"
          buttonOne="Send invoice"
          buttonTwo="Collect payment"
        />
      ),
    },
  ];

  const handleNavigation = (e) => {
    e.preventDefault();
    router.back(); // Go back without re-rendering
  };
  return (
    <div className="md:mt-20 px-4">
      <span className="px-2 md:py-0 py-1 font-bold font-mono text-sm text-gray-400">
        <Link
          href="/orders"
          onClick={handleNavigation}
          className="dark:hover:text-white hover:text-black cursor-pointer"
        >
          orders
        </Link>
        /#{order.id}
      </span>
      <div className="w-full h-10  rounded-xl mt-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 ">
            <span className="text-2xl font-bold">Order ID: {order.id}</span>
            <Badge
              className={`rounded-full md:font-normal text-xs select-none shadow-none mt-1 ${getPaymentStatusBadgeClass(
                order.paymentStatus || ""
              )}`}
            >
              Payment {order.paymentStatus}
            </Badge>
          </div>
          <span className="text-sm font-semibold">{order.orderDate}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2   rounded">
            <button className="flex items-center gap-1 px-2 py-1  text-sm bg-light-light-gray dark:bg-gray-800 rounded-md">
              <Edit size={16} /> Edit
            </button>
            <button className="flex items-center gap-1 px-2 py-1  text-sm bg-light-light-gray dark:bg-gray-800 rounded-md">
              More actions <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Parent div for details section */}
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {/* Details Section (2/3 width) */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {renderData.map((sec, index) => (
            <div
              key={index}
              className="shadow-xl border-light-light-gray dark:border-zinc-900 border-2 rounded-2xl overflow-hidden"
            >
              <div className="p-2">
              <h3 className="text-xl font-semibold mb-2">{sec.heading}</h3>
              {sec.badge}
              <div>{sec.component}
              </div>
              </div>
              <div>{sec.footer}</div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3">
          <div className="p-4 border rounded-md bg-light-gray dark:bg-gray-800">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
