import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='justify-center  flex items-center flex-col  h-screen'>
      <span className='text-3xl font-bold'>

      Still working on this
      </span>
      <Button className='bg-light-primary mt-6'> <Link href="https://www.tic-tech-toe.com">Click here </Link> </Button>
    
     </div>
  )
}

export default page