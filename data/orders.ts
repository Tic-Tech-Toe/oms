import { OrderType } from "@/types/orderType";
import { mockItemsData } from "./item";
import { mockCustomers } from "./customers";

// Helper function to get item details by itemId
export function getItemDetailsById(itemId: string) {
  return mockItemsData.find(item => item.itemId === itemId);
}

export const orders: OrderType[] = [
    {
      id: '12345',
      orderDate: '2023-01-12',
      status: 'processing',
      totalAmount: 150.75,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[0].shippingAddress,
      billingAddress: mockCustomers[0].billingAddress,
      items: [
        { itemId: 'item001', quantity: 2 },
        { itemId: 'item002', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
      
        if (itemDetails) {
          return { 
            ...itemDetails, 
            quantity: item.quantity, 
            total: itemDetails.price * item.quantity 
          };
        } else {
          // Handle the case where item details are not found
          return {
            itemId: item.itemId,
            quantity: item.quantity,
            price: 0,
            total: 0,
            name: 'Unknown Item', // Default values
          };
        }
      }),
      customer: mockCustomers[0],
      paymentMethod: 'credit card',
      trackingNumber: 'TRK123456',
      shippingDate: '2023-01-13',
      estimatedDeliveryDate: '2023-01-20',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-12',
    },
    {
      id: '12346',
      orderDate: '2023-01-15',
      status: 'pending',
      totalAmount: 75.00,
      paymentStatus: 'pending',
      shippingAddress: mockCustomers[1].shippingAddress,
      billingAddress: mockCustomers[1].billingAddress,
      items: [
        { itemId: 'item003', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[1],
      paymentMethod: 'UPI',
      trackingNumber: '',
      shippingDate: '',
      estimatedDeliveryDate: '',
      createdAt: '2023-01-05',
      updatedAt: '2023-01-15',
    },
    {
      id: '12347',
      orderDate: '2023-02-01',
      status: 'pending',
      totalAmount: 200.50,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[2].shippingAddress,
      billingAddress: mockCustomers[2].billingAddress,
      items: [
        { itemId: 'item004', quantity: 3 },
        { itemId: 'item005', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[2],
      paymentMethod: 'bank transfer',
      trackingNumber: '',
      shippingDate: '',
      estimatedDeliveryDate: '2023-02-10',
      createdAt: '2023-01-30',
      updatedAt: '2023-02-01',
    },
    {
      id: '12348',
      orderDate: '2023-02-05',
      status: 'shipped',
      totalAmount: 180.99,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[3].shippingAddress,
      billingAddress: mockCustomers[3].billingAddress,
      items: [
        { itemId: 'item001', quantity: 5 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[3],
      paymentMethod: 'debit card',
      trackingNumber: 'TRK654321',
      shippingDate: '2023-02-06',
      estimatedDeliveryDate: '2023-02-14',
      createdAt: '2023-01-28',
      updatedAt: '2023-02-05',
    },
    {
      id: '12349',
      orderDate: '2023-02-07',
      status: 'delivered',
      totalAmount: 99.99,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[4].shippingAddress,
      billingAddress: mockCustomers[4].billingAddress,
      items: [
        { itemId: 'item002', quantity: 2 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[4],
      paymentMethod: 'debit card',
      trackingNumber: 'TRK789012',
      shippingDate: '2023-02-08',
      estimatedDeliveryDate: '2023-02-12',
      createdAt: '2023-01-30',
      updatedAt: '2023-02-07',
    },
    {
      id: '12350',
      orderDate: '2023-02-10',
      status: 'processing',
      totalAmount: 110.00,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[5].shippingAddress,
      billingAddress: mockCustomers[5].billingAddress,
      items: [
        { itemId: 'item003', quantity: 3 },
        { itemId: 'item004', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[5],
      paymentMethod: 'credit card',
      trackingNumber: 'TRK111223',
      shippingDate: '2023-02-12',
      estimatedDeliveryDate: '2023-02-18',
      createdAt: '2023-02-01',
      updatedAt: '2023-02-10',
    },
    {
      id: '12351',
      orderDate: '2023-02-15',
      status: 'shipped',
      totalAmount: 230.99,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[6].shippingAddress,
      billingAddress: mockCustomers[6].billingAddress,
      items: [
        { itemId: 'item005', quantity: 2 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[6],
      paymentMethod: 'UPI',
      trackingNumber: 'TRK998877',
      shippingDate: '2023-02-16',
      estimatedDeliveryDate: '2023-02-20',
      createdAt: '2023-02-10',
      updatedAt: '2023-02-15',
    },
    {
      id: '12352',
      orderDate: '2023-02-18',
      status: 'cancelled',
      totalAmount: 50.00,
      paymentStatus: 'failed',
      shippingAddress: mockCustomers[7].shippingAddress,
      billingAddress: mockCustomers[7].billingAddress,
      items: [
        { itemId: 'item001', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[7],
      paymentMethod: 'bank transfer',
      trackingNumber: '',
      shippingDate: '',
      estimatedDeliveryDate: '',
      createdAt: '2023-02-12',
      updatedAt: '2023-02-18',
    },
    {
      id: '12353',
      orderDate: '2023-02-20',
      status: 'shipped',
      totalAmount: 145.50,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[8].shippingAddress,
      billingAddress: mockCustomers[8].billingAddress,
      items: [
        { itemId: 'item002', quantity: 3 },
        { itemId: 'item003', quantity: 1 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[8],
      paymentMethod: 'debit card',
      trackingNumber: 'TRK223344',
      shippingDate: '2023-02-21',
      estimatedDeliveryDate: '2023-02-25',
      createdAt: '2023-02-15',
      updatedAt: '2023-02-20',
    },
    {
      id: '12354',
      orderDate: '2023-02-22',
      status: 'processing',
      totalAmount: 320.00,
      paymentStatus: 'paid',
      shippingAddress: mockCustomers[9].shippingAddress,
      billingAddress: mockCustomers[9].billingAddress,
      items: [
        { itemId: 'item004', quantity: 2 },
        { itemId: 'item005', quantity: 2 },
      ].map(item => {
        const itemDetails = getItemDetailsById(item.itemId);
        return { ...itemDetails, quantity: item.quantity, total: itemDetails.price * item.quantity };
      }),
      customer: mockCustomers[9],
      paymentMethod: 'credit card',
      trackingNumber: 'TRK556677',
      shippingDate: '2023-02-23',
      estimatedDeliveryDate: '2023-02-28',
      createdAt: '2023-02-16',
      updatedAt: '2023-02-22',
    },
    // Add more entries here as needed
  ];
  