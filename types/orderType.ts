export type ItemType = {
  itemId: string; // Unique identifier for the item
  quantity:number;
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


export type OrderTimelineEntry = {
  date: string; // ISO string or formatted timestamp
  action: string; // Description of what happened (e.g., "Order placed", "Payment received")
};

export type OrderType = {
  id: string;
  customerId: string;
  customer?: CustomerType; // optional for full info in UI
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  invoiceNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
  items: OrderItem[];
  paymentMethod?: "credit card" | "UPI" | "bank transfer" | "cash on delivery";
  payment?: PaymentType;
  trackingLink?: string;
  shippingDate?: string;
  estimatedDeliveryDate?: string;
  deliveredDate?: string;
  cancelationDate?: string;
  createdAt: string;
  updatedAt: string;
  timeline?: OrderTimelineEntry[];
};


export type PaymentType = {
  id: string;
  orderId: string;
  customerId: string;
  paymentMethod?: string;
  totalPaid: number; // Sum of all partial payments
  partialPayments: { date: string; amountPaid: number }[];
};

export type CustomerType = {
  id:string;
  name: string; // Customer's full name
  whatsappNumber: string; // WhatsApp number for customer contact
  rewardPoint?: number;
  shippingAddress?: string; // Shipping address
  billingAddress?: string; // Billing address
  email?: string; // Optional email address
  phoneNumber?: string; // Optional phone number
  alternatePhoneNumber?: string; // Optional alternate contact number
};


