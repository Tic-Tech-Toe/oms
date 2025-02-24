import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200";
    case "processing":
      return "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200";
    case "shipped":
      return "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200";
    case "delivered":
      return "bg-teal-500/40 border border-teal-500 text-teal-700 dark:bg-teal-500/30 dark:border-teal-500 dark:text-teal-200";
    case "cancelled":
      return "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200";
    default:
      return "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200";
  }
};

export const getPaymentStatusBadgeClass = (paymentStatus: string) => {
  switch (paymentStatus) {
    case "pending":
      return "bg-yellow-500/40 border border-yellow-500 text-yellow-700 dark:bg-yellow-500/30 dark:border-yellow-500 dark:text-yellow-200";
    case "paid":
      return "bg-green-500/40 border border-green-500 text-green-700 dark:bg-green-500/30 dark:border-green-500 dark:text-green-200";
    case "failed":
      return "bg-red-500/40 border border-red-500 text-red-700 dark:bg-red-500/30 dark:border-red-500 dark:text-red-200";
    case "refunded":
      return "bg-blue-500/40 border border-blue-500 text-blue-700 dark:bg-blue-500/30 dark:border-blue-500 dark:text-blue-200";
    default:
      return "bg-gray-500/40 border border-gray-500 text-gray-700 dark:bg-gray-500/30 dark:border-gray-500 dark:text-gray-200";
  }
};