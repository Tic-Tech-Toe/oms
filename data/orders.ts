//@ts-nocheck

import { CustomerType, OrderType, PaymentType } from "@/types/orderType";
import { mockCustomers } from "./customers";
import { mockItemsData } from "./item";

// Function to get item details by itemId
function getItemDetailsById(itemId: string) {
  return mockItemsData.find((item) => item.itemId === itemId);
}

// Function to calculate total amount for an order
function calculateTotalAmount(items: { itemId: string; quantity: number }[]) {
  return items.reduce((total, item) => {
    const itemDetails = getItemDetailsById(item.itemId);
    return total + (itemDetails ? itemDetails.price * item.quantity : 0);
  }, 0);
}

// Function to generate random partial payments
function generatePartialPayments(totalAmount: number) {
  let remainingAmount = totalAmount;
  const partialPayments = [];

  while (remainingAmount > 0) {
    const paymentAmount = Math.min(
      remainingAmount,
      Math.floor(Math.random() * (remainingAmount / 2)) + 10
    );
    partialPayments.push({
      date: new Date().toISOString(),
      amountPaid: paymentAmount,
    });
    remainingAmount -= paymentAmount;
  }

  return partialPayments;
}

// Generate 50 mock orders dynamically
export const orders: OrderType[] = Array.from({ length: 50 }, (_, index) => {
  const customer = mockCustomers[index % mockCustomers.length];
  const randomItems = [
    { itemId: "item001", quantity: Math.ceil(Math.random() * 500) },
    { itemId: "item002", quantity: Math.ceil(Math.random() * 300) },
    { itemId: "item003", quantity: Math.ceil(Math.random() * 200) },
  ].filter(() => Math.random() > 0.3);

  const totalAmount = calculateTotalAmount(randomItems);

  const paymentStatusOptions: OrderType["paymentStatus"][] = [
    "pending",
    "partially_paid",
    "paid",
    "failed",
    "refunded",
  ];
  const paymentStatus = paymentStatusOptions[Math.floor(Math.random() * 5)];

  // Generate partial payments if status is "partially_paid"
  const partialPayments =
    paymentStatus === "partially_paid" ? generatePartialPayments(totalAmount / 2) : [];

  // Calculate total paid amount
  const totalPaid =
    paymentStatus === "paid"
      ? totalAmount
      : partialPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);

  const payment: PaymentType = {
    id: `PAY-${(index + 1).toString().padStart(3, "0")}`,
    orderId: `Test-ord-${(index + 1).toString().padStart(3, "0")}`,
    customerId: customer.whatsappNumber, // Assuming unique identifier
    paymentMethod: ["credit card", "UPI", "bank transfer", "cash on delivery"][
      Math.floor(Math.random() * 4)
    ],
    totalPaid,
    partialPayments,
  };

  return {
    id: `Test-ord-${(index + 1).toString().padStart(3, "0")}`,
    orderDate: new Date().toISOString(),
    status: ["processing", "shipped", "delivered", "cancelled", "pending"][
      Math.floor(Math.random() * 5)
    ],
    paymentStatus,
    shippingAddress: customer.shippingAddress,
    billingAddress: customer.billingAddress,
    items: randomItems.map((item) => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0,
      };
    }),
    totalAmount,
    customer,
    paymentMethod: payment.paymentMethod,
    payment, // ✅ Linking payment details inside Order
    trackingNumber: Math.random() > 0.5 ? `TRK${10000 + index}` : "",
    shippingDate: Math.random() > 0.5 ? new Date().toISOString() : "",
    estimatedDeliveryDate: Math.random() > 0.5 ? new Date().toISOString() : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
