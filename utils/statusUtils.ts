export const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
export const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

export const getBadgeClass = (status: string, type: "order" | "payment") => {
  const classes: Record<"order" | "payment", Record<string, string>> = {
    order: {
      pending: "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      processing: "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
      shipped: "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      delivered: "bg-teal-500/40 border border-teal-500 text-teal-700 dark:bg-teal-500/30 dark:border-teal-500 dark:text-teal-200",
      cancelled: "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
    },
    payment: {
      pending: "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200",
      paid: "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200",
      failed: "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200",
      refunded: "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200",
    },
  };

  return (
    classes[type]?.[status?.toLowerCase()] ??
    "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200"
  );
};
