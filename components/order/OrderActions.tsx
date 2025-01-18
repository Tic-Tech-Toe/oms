import { OrderType } from '@/types/orderType'
import { Copy, Delete, Edit, EllipsisVertical, Icon, MessageSquareShare } from 'lucide-react'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Row } from '@tanstack/react-table'

const OrderActions = ({row} : {row:Row<OrderType>}) => {
    const menuItems = [
        { icon: <MessageSquareShare />, label: 'Send',className:""},
        { icon: <Copy />, label: 'Copy',className:""},
        { icon: <Edit />, label: 'Edit',className:""},
        { icon: <Delete className='text-lg' />, label: 'Delete',className:"text-red-600"},
    ]

    // console.log(row)
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <EllipsisVertical className='h-4 w-4 text-slate-400' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=''>
            {menuItems.map((item,i) =>(
                <DropdownMenuItem key={i} className={`flex items-center gap-2 p-[10px] ${item.className}`}>
                    {item.icon}
                    <span>{item.label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrderActions