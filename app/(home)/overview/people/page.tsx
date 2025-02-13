import { mockCustomers } from '@/data/customers'
import React from 'react'

const People = () => {
  return (
    <div className='p-4 h-[100dvh]'>
      <h1 className='md:text-3xl text-2xl font-bold '>People</h1>
      <div className='bg-light-light-gray dark:bg-dark-background rounded-2xl mt-6 px-4'>
        <div>
          <div></div>
          <div></div>
        </div>
        
      {/* {{mockCustomers.map((people) => (
        <div className=''>
        <h1>{people.name}</h1>
        <h1>{people.whatsappNumber}</h1>
        </div>
      ))}  */}
      </div>
      
    </div>
  )
}

export default People