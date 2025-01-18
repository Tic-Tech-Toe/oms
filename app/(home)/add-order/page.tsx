"use client"

import AddOrderForm from '@/components/forms/Add-Order/AddOrderForm'
import { AddOrderSchema } from '@/lib/validations'
import React from 'react'

const AddOrder = () => {
  return (
    <>
    <h1 className='text-3xl font-bold px-4  py-2'>Add order</h1>
    <div className='mt-6 md:px-16 px-6 gap-6 md:flex justify-start w-full'>
        <AddOrderForm schema={AddOrderSchema} formType="ADD_ORDER" defaultVal={{custName:"",whatsappNo:"",pickOrder:""}} onSubmit={(data => Promise.resolve({success:true, data}))}/>

        {/* <div className='bg-gray-100 rounded-3xl md:w-1/5 w-full mt-10 py-6'>
            <h1 className='text-center font-bold text-2xl '>Order summary</h1>
        </div> */}
    </div>
    </>
  )
}

export default AddOrder