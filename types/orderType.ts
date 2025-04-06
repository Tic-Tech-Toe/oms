export type ItemType = {
  itemId: string; // Unique identifier for the item
  name: string; // Item name
  price: number; // Price per unit of the item
  itemImage?: string; // URL or path to item image
  sku?: string; // Optional SKU for the item
  category?: string; // Optional category (e.g., Electronics, Clothing)
};

export type OrderItem = {
  itemId?: string; // Link to ItemType by itemId
  quantity: number; // Quantity ordered
  price: number; // Price of the item in the current order
  total?: number; // Total cost for this item (quantity * price)
  sku?: string; // Optional SKU for the order item
  category?: string; // Optional category for the order item
  itemName: string;
};


export type OrderType = {
  id: string; // Unique order ID
  orderDate: string; // Date when order was placed
  // status: "processing" | "shipped" | "delivered" | "cancelled" | "pending";
  status: string;
  totalAmount: number; // Total amount of the order
  // paymentStatus: "pending" | "partially_paid" | "paid" | "failed" | "refunded"; 
  paymentStatus: string; 
  shippingAddress?: string; // Shipping address
  billingAddress?: string; // Billing address
  items: OrderItem[]; // List of items in the order (linked to ItemType)
  customer: CustomerType; // Customer information
  paymentMethod?: "credit card" | "UPI" | "bank transfer" | "cash on delivery"; // Payment method
  payment?: PaymentType; // ✅ Linking payment details inside Order
  trackingNumber?: string; // Tracking number for shipped orders
  shippingDate?: string; // Date when the order was shipped
  estimatedDeliveryDate?: string; // Estimated delivery date
  deliveredDate?: string; // Date when the order was delivered
  cancelationDate?: string; // Date when the order was canceled
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last updated timestamp
};


export type CustomerType = {
  name: string; // Customer's full name
  whatsappNumber: string; // WhatsApp number for customer contact
  rewardPoint?: number;
  shippingAddress?: string; // Shipping address
  billingAddress?: string; // Billing address
  email?: string; // Optional email address
  phoneNumber?: string; // Optional phone number
  alternatePhoneNumber?: string; // Optional alternate contact number
};

export type PaymentType = {
  id: string;
  orderId: string;
  customerId: string;
  paymentMethod: string;
  totalPaid: number; // Sum of all partial payments
  partialPayments: { date: string; amountPaid: number }[];
};
