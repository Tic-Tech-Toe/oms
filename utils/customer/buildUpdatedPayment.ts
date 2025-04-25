import { OrderType, PaymentType } from "@/types/orderType";

export function buildUpdatedPayment(
  order: OrderType,
  amountPaidNow: number,
  method?: string
): PaymentType {
  const prevPayment = order.payment ?? {
    id: "",
    orderId: order.id,
    customerId: order.customerId,
    totalPaid: 0,
    partialPayments: [],
  };

  const today = new Date().toISOString();

  return {
    ...prevPayment,
    paymentMethod: method ?? prevPayment.paymentMethod,
    totalPaid: prevPayment.totalPaid + amountPaidNow,
    partialPayments: [
      ...(prevPayment.partialPayments || []),
      { date: today, amountPaid: amountPaidNow },
    ],
  };
}
