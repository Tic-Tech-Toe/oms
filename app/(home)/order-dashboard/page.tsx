import StatCards from '@/components/StatCards';
import TableArea from '@/components/Table/TableArea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orders } from '@/data/orders';
import React from 'react'

const AddOrder = () => {
  
  
  return (
    <>
    <h1 className='text-3xl font-bold px-4 py-2'>Order Dashboard</h1>
    <StatCards />
    <TableArea orders={orders} />
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