import { CustomerType, OrderType } from '@/types/orderType'
import { ShoppingCart, User } from 'lucide-react'
import React from 'react'
import CountUp from 'react-countup';

const OrderCustomerRel = ({customer}:{customer:CustomerType}) => {
    // const {customer}=order.customer
    // console.log(customer)
  return (
    <>
        <div className=' border-b-2 border-gray-300 py-4 text-5xl font-bold text-amber-400 flex flex-col items-center'>
            <span className='font-bold text-center text-2xl  text-dark-background dark:text-white'>Rewards</span>
            <CountUp end={customer.rewardPoint} duration={1} className='flex items-center justify-center border-blue-600 border-4 rounded-full mt-4 p-6  aspect-square' />
            
        </div>
        <div className='mt-2'>
            <span className='text-xl font-semibold'>Customer</span>
            <div className='p-2'>
                <div className='flex gap-2 items-center'>
                    <User size={14} /> <span className='text-sm text-gray-600 font-medium dark:text-gray-300'>{customer.name}</span>
                </div>
                <div className='flex gap-2 items-center'>
                    {/* <ShoppingCart size={14} /> <span className='text-sm text-gray-600 font-medium dark:text-gray-300'>{`6 Orders`}</span> */}
                </div>
            </div>
        </div>
    </>
  )
}

export default OrderCustomerRel