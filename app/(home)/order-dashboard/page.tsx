import StatCards from '@/components/StatCards';
import TableArea from '@/components/Table/TableArea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react'

const AddOrder = () => {
  const orders = [
    {
      orderNo: "ORD001",
      dateReceived: "2025-01-07",
      custName: "John Doe",
      whatsappNo: "+1234567890",
      orderStatus: "Pending",
    },
    {
      orderNo: "ORD002",
      dateReceived: "2025-01-06",
      custName: "Alice Smith",
      whatsappNo: "+0987654321",
      orderStatus: "Shipped",
    },
    {
      orderNo: "ORD003",
      dateReceived: "2025-01-05",
      custName: "Bob Johnson",
      whatsappNo: "+1122334455",
      orderStatus: "Delivered",
    },
    {
      orderNo: "ORD004",
      dateReceived: "2025-01-04",
      custName: "Charlie Brown",
      whatsappNo: "+1223344556",
      orderStatus: "Cancelled",
    },
    {
      orderNo: "ORD005",
      dateReceived: "2025-01-03",
      custName: "Diana Clark",
      whatsappNo: "+1444666777",
      orderStatus: "Pending",
    },
  ];
  
  return (
    <>
    <h1 className='text-3xl font-bold px-4 py-2'>Order Dashboard</h1>
    <StatCards />
    <TableArea />
    <div className='px-4'>
      <div></div>
      <div>

      </div>
    {/* <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order No.</TableHead>
          <TableHead>Date Received</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>WhatsApp No.</TableHead>
          <TableHead>Order Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(({orderNo, dateReceived,custName,whatsappNo,orderStatus}) => (
          <TableRow key={orderNo}>
            <TableCell className="font-medium">{orderNo}</TableCell>
            <TableCell>{dateReceived}</TableCell>
            <TableCell>{custName}</TableCell>
            <TableCell>{whatsappNo}</TableCell>
            <TableCell>{orderStatus}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      
    </Table> */}
    </div>
    </>
    
  )
}

export default AddOrder