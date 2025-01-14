"use client"

import { Order } from '@/data/orders';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Order>[] = [
  {
    header: 'Order ID',
    accessorKey: 'id',
  },
  {
    header: 'Customer ID',
    accessorKey: 'customerId',
  },
  {
    header: 'Order Date',
    accessorKey: 'orderDate',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Payment Status',
    accessorKey: 'paymentStatus',
  },
  {
    header: 'Total Amount',
    accessorKey: 'totalAmount',
    Cell: ({ value }: any) => `$${value}`, // Format total amount as currency
  },
  {
    header: 'Payment Method',
    accessorKey: 'paymentMethod',
  },
  {
    header: 'Tracking Number',
    accessorKey: 'trackingNumber',
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    Cell: () => <button className="text-blue-500">View</button>, // Example action button
  },
];
