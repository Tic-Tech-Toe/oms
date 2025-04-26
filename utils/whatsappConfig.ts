// utils/statusWhatsappConfig.ts

import { ORDER_STATUSES } from "./statusUtils";

export const STATUS_WHATSAPP_CONFIG: Record<
  typeof ORDER_STATUSES[number],
  {
    apiRoute: string;
    getPayload: (row: any) => Record<string, any>;
  }
> = {
  Pending: {
    apiRoute: "/api/order-received",
    getPayload: (row) => ({
      phoneNumber: row.original.customer.whatsappNumber,
      customerName: row.original.customer.name,
      orderId: row.original.id,
      orderDate: row.original.orderDate,
    }),
  },
  Processing: {
    apiRoute: "/api/order-processing",
    getPayload: (row) => ({
      phoneNumber: row.original.customer.whatsappNumber,
      customerName: row.original.customer.name,
      orderId: row.original.id,
      orderDate: row.original.orderDate,
    }),
  },
  Shipped: {
    apiRoute: "/api/order-out-delivery",
    getPayload: (row) => ({
      phoneNumber: row.original.customer.whatsappNumber,
      customerName: row.original.customer.name,
      deliveryWindow: row.original.deliveryWindow,
      // deliveryWindow: ,
    }),
  },
  Delivered: {
    apiRoute: "/api/order-delivered",
    getPayload: (row) => ({
      phoneNumber: row.original.customer.whatsappNumber,
      customerName: row.original.customer.name,
      orderId: row.original.id,
      totalAmount: row.original.totalAmount,
    }),
  },
  Cancelled: {
    // no WhatsApp route for cancellations—just a placeholder
    apiRoute: "",
    getPayload: () => ({}),
  },
};
