
import { CustomerType, OrderType } from "@/types/orderType";
import { mockCustomers } from "./customers";  // Ensure correct path for mockCustomers
import { mockItemsData } from "./item";  // Ensure correct path for mockItemsData

// Function to get item details by itemId
function getItemDetailsById(itemId: string) {
  return mockItemsData.find(item => item.itemId === itemId);
}

// Orders array with the correct mapping and updated order statuses
export const orders: OrderType[] = [
  {
    id: "Test-ord-001",
    orderDate: "Sun Mar 02 2025",
    status: "processing",  // Updated to 'processing'
    paymentStatus: "paid",
    totalAmount: 444,
    shippingAddress: mockCustomers[0].shippingAddress,
    billingAddress: mockCustomers[0].billingAddress,
    items: [
      { itemId: "item001", quantity: 3 },
      { itemId: "item002", quantity: 1 },
      { itemId: "item004", quantity: 1 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[0],
    paymentMethod: "credit card",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T09:25:02.821Z",
    updatedAt: "2025-03-02T09:25:02.821Z",
  },
  {
    id: "Test-ord-002",
    orderDate: "Sun Mar 02 2025",
    status: "shipped",  // Updated to 'shipped'
    paymentStatus: "paid",
    totalAmount: 500,
    shippingAddress: mockCustomers[1].shippingAddress,
    billingAddress: mockCustomers[1].billingAddress,
    items: [
      { itemId: "item001", quantity: 4 },
      { itemId: "item002", quantity: 2 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[1],
    paymentMethod: "UPI",
    trackingNumber: "TRK12345",
    shippingDate: "2025-03-03",
    estimatedDeliveryDate: "2025-03-10",
    createdAt: "2025-03-02T09:30:02.821Z",
    updatedAt: "2025-03-02T09:30:02.821Z",
  },
  {
    id: "Test-ord-003",
    orderDate: "Sun Mar 02 2025",
    status: "delivered",  // Updated to 'delivered'
    paymentStatus: "paid",
    totalAmount: 300,
    shippingAddress: mockCustomers[2].shippingAddress,
    billingAddress: mockCustomers[2].billingAddress,
    items: [
      { itemId: "item004", quantity: 2 },
      { itemId: "item005", quantity: 1 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[2],
    paymentMethod: "bank transfer",
    trackingNumber: "TRK67890",
    shippingDate: "2025-03-01",
    estimatedDeliveryDate: "2025-03-02",
    createdAt: "2025-03-02T09:35:02.821Z",
    updatedAt: "2025-03-02T09:35:02.821Z",
  },
  {
    id: "Test-ord-004",
    orderDate: "Sun Mar 02 2025",
    status: "cancelled",  // Updated to 'cancelled'
    paymentStatus: "failed",
    totalAmount: 150,
    shippingAddress: mockCustomers[3].shippingAddress,
    billingAddress: mockCustomers[3].billingAddress,
    items: [
      { itemId: "item002", quantity: 1 },
      { itemId: "item003", quantity: 3 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[3],
    paymentMethod: "debit card",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T09:40:02.821Z",
    updatedAt: "2025-03-02T09:40:02.821Z",
  },
  {
    id: "Test-ord-005",
    orderDate: "Sun Mar 02 2025",
    status: "pending",  // Left as 'pending'
    paymentStatus: "pending",
    totalAmount: 444,
    shippingAddress: mockCustomers[4].shippingAddress,
    billingAddress: mockCustomers[4].billingAddress,
    items: [
      { itemId: "item001", quantity: 5 },
      { itemId: "item004", quantity: 2 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[4],
    paymentMethod: "credit card",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T09:45:02.821Z",
    updatedAt: "2025-03-02T09:45:02.821Z",
  },
  {
    id: "Test-ord-006",
    orderDate: "Sun Mar 02 2025",
    status: "shipped",  // Updated to 'shipped'
    paymentStatus: "paid",
    totalAmount: 520,
    shippingAddress: mockCustomers[5].shippingAddress,
    billingAddress: mockCustomers[5].billingAddress,
    items: [
      { itemId: "item003", quantity: 2 },
      { itemId: "item004", quantity: 1 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[5],
    paymentMethod: "debit card",
    trackingNumber: "TRK54321",
    shippingDate: "2025-03-03",
    estimatedDeliveryDate: "2025-03-07",
    createdAt: "2025-03-02T09:50:02.821Z",
    updatedAt: "2025-03-02T09:50:02.821Z",
  },
  {
    id: "Test-ord-007",
    orderDate: "Sun Mar 02 2025",
    status: "pending",  // Left as 'pending'
    paymentStatus: "pending",
    totalAmount: 350,
    shippingAddress: mockCustomers[6].shippingAddress,
    billingAddress: mockCustomers[6].billingAddress,
    items: [
      { itemId: "item001", quantity: 2 },
      { itemId: "item005", quantity: 3 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[6],
    paymentMethod: "bank transfer",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T09:55:02.821Z",
    updatedAt: "2025-03-02T09:55:02.821Z",
  },
  {
    id: "Test-ord-008",
    orderDate: "Sun Mar 02 2025",
    status: "delivered",  // Updated to 'delivered'
    paymentStatus: "paid",
    totalAmount: 620,
    shippingAddress: mockCustomers[7].shippingAddress,
    billingAddress: mockCustomers[7].billingAddress,
    items: [
      { itemId: "item003", quantity: 3 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[7],
    paymentMethod: "credit card",
    trackingNumber: "TRK67890",
    shippingDate: "2025-03-01",
    estimatedDeliveryDate: "2025-03-02",
    createdAt: "2025-03-02T10:00:02.821Z",
    updatedAt: "2025-03-02T10:00:02.821Z",
  },
  {
    id: "Test-ord-009",
    orderDate: "Sun Mar 02 2025",
    status: "cancelled",  // Updated to 'cancelled'
    paymentStatus: "failed",
    totalAmount: 140,
    shippingAddress: mockCustomers[8].shippingAddress,
    billingAddress: mockCustomers[8].billingAddress,
    items: [
      { itemId: "item002", quantity: 1 },
      { itemId: "item004", quantity: 2 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[8],
    paymentMethod: "debit card",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T10:05:02.821Z",
    updatedAt: "2025-03-02T10:05:02.821Z",
  },
  {
    id: "Test-ord-010",
    orderDate: "Sun Mar 02 2025",
    status: "pending",  // Left as 'pending'
    paymentStatus: "pending",
    totalAmount: 444,
    shippingAddress: mockCustomers[9].shippingAddress,
    billingAddress: mockCustomers[9].billingAddress,
    items: [
      { itemId: "item003", quantity: 2 },
      { itemId: "item002", quantity: 1 }
    ].map(item => {
      const itemDetails = getItemDetailsById(item.itemId);
      return {
        ...itemDetails,
        quantity: item.quantity,
        total: itemDetails ? itemDetails.price * item.quantity : 0
      };
    }),
    customer: mockCustomers[9],
    paymentMethod: "credit card",
    trackingNumber: "",
    shippingDate: "",
    estimatedDeliveryDate: "",
    createdAt: "2025-03-02T10:10:02.821Z",
    updatedAt: "2025-03-02T10:10:02.821Z",
  }
];



