"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { OrderType } from "@/types/orderType";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getBadgeClass } from "@/utils/statusUtils";

interface DashboardMobileOrderCardsProps {
  orders: OrderType[];
}

export default function DashboardMobileOrderCards({
  orders,
}: DashboardMobileOrderCardsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function formatInvoiceNumber(invoice?: string) {
    if (!invoice) return "";
    return invoice.length > 100 ? `…${invoice.slice(-4)}` : invoice;
  }

  return (
    <div className="space-y-3 px-4 md:hidden">
      {orders.map((order) => {
        const isOpen = expanded === order.id;
        const firstItem = order.items?.[0];
        const extraItems = (order.items?.length || 0) - 1;

        return (
          <Card
            key={order.id}
            className={cn(
              "rounded-2xl shadow-sm bg-white dark:bg-zinc-900 transition-all",
              isOpen ? "p-4" : "p-2"
            )}
          >
            {/* Collapsed view */}
            {!isOpen && (
              <div className="flex items-center justify-between">
                {/* Customer + status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.customer?.name || "Unknown"}
                  </span>
                  <Badge
                    className={getBadgeClass(order.status, "order") }
                  >
                    {order.status}
                  </Badge>
                </div>

                {/* Invoice + Amount + toggle */}
                <div className="flex items-center gap-2">
                  {order.invoiceNumber && (
                    <span
                      title={order.invoiceNumber}
                      className="text-xs text-gray-500"
                    >
                      {formatInvoiceNumber(order.invoiceNumber)}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpanded(order.id)}
                    className="h-6 px-1 text-gray-500 hover:text-gray-800"
                  >
                    <ChevronDown size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* Expanded view */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {/* Top row: Order ID + Order Date */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">#{order.id}</span>
                    <span className="text-xs text-gray-400">
                      {order.orderDate}
                    </span>
                  </div>

                  {/* Invoice */}
                  {order.invoiceNumber && (
                    <p className="text-xs text-gray-500 mb-2">
                      Invoice: {order.invoiceNumber}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className={cn(
                        "text-xs capitalize",
                        order.status === "pending" &&
                          "bg-yellow-100 text-yellow-800",
                        order.status === "shipped" &&
                          "bg-blue-100 text-blue-800",
                        order.status === "delivered" &&
                          "bg-green-100 text-green-800",
                        order.status === "cancelled" &&
                          "bg-red-100 text-red-800"
                      )}
                    >
                      {order.status}
                    </Badge>
                    {order.paymentStatus && (
                      <Badge
                        className={cn(
                          "text-xs capitalize",
                          order.paymentStatus.toLowerCase() === "failed" &&
                            "bg-red-100 text-red-800",
                          order.paymentStatus.toLowerCase() === "paid" &&
                            "bg-green-100 text-green-800"
                        )}
                      >
                        {order.paymentStatus}
                      </Badge>
                    )}
                  </div>

                  {/* Customer */}
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {order.customer?.name || "Unknown Customer"}
                  </p>

                  {/* Items */}
                  {firstItem && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {firstItem.itemName} × {firstItem.quantity}
                      {extraItems > 0 && `, +${extraItems} more`}
                    </p>
                  )}

                  {/* Timeline */}
                  {order.timeline?.length > 0 && (
                    <div className="space-y-1 mt-3">
                      {order.timeline.map((t, idx) => (
                        <p key={idx} className="text-xs text-gray-500">
                          {t.action} —{" "}
                          {t.date ? new Date(t.date).toLocaleDateString() : ""}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <Link href={`/orders/${order.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        View Details <ArrowRight size={14} />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpanded(null)}
                      className="h-6 px-1 text-gray-500 hover:text-gray-800"
                    >
                      <ChevronUp size={14} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
