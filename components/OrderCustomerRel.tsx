"use client";

import { useEffect, useState } from "react";
import { User, ShoppingBag } from "lucide-react";
import { CustomerType } from "@/types/orderType";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore"; 
import { useCurrency } from "@/hooks/useCurrency";

interface OrderCustomerRelProps {
  customer: CustomerType;
  userId: string;
}

export function OrderCustomerRel({ customer, userId }: OrderCustomerRelProps) {
  const { allOrders, loadAllOrders, isLoading } = useOrderStore();

  // State for showing/hiding order info
  const [showInfo, setShowInfo] = useState(false);

  // Trigger loadOrders when component mounts or when userId changes
  useEffect(() => {
    loadAllOrders(userId);
  }, [userId, loadAllOrders]);

  // Wait for allOrders to be populated
  if (isLoading) {
    return <div>Loading...</div>;  // Add a loading state to show while orders are being fetched
  }

  // Filter orders by the current customerId to get the orders of this customer
  const customerOrders = allOrders.filter((order) => order?.customer?.id === customer.id);

  // Function to toggle the info visibility
  const toggleInfo = () => setShowInfo((prev) => !prev);

  return (
    <>
      <div className="border-b-2 border-gray-300 py-4 text-5xl font-bold text-amber-400 flex flex-col items-center">
        <span className="font-bold text-center text-2xl text-dark-background dark:text-white">
          Rewards
        </span>
        <span>{customer.rewardPoint}</span>
      </div>
      <div className="mt-2">
        <span className="text-xl font-semibold">Customer</span>
        <div className="p-2">
          <div className="flex gap-2 items-center">
            <User size={14} />
            <span className="text-sm text-gray-600 font-medium dark:text-gray-300">
              {customer.name}
            </span>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <ShoppingBag size={14} className="text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {customerOrders.length} Orders
            </span>
          </div>

          {/* Show "Show Info" link */}
          <div className="mt-4">
            <span
              className="text-blue-500 cursor-pointer underline"
              onClick={toggleInfo}
            >
              {showInfo ? "Hide Info" : "Show Info"}
            </span>

            {/* Display additional info when showInfo is true */}
            {showInfo && (
              <div className="mt-4 space-y-4">
                {customerOrders.length > 0 ? (
                  customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          Order ID: {order.id}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            order.status === "Completed" ? "text-green-500" : "text-yellow-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Items: {order.items.length}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Total: {useCurrency(order.totalAmount)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          Order Date: {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No orders for this customer.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
