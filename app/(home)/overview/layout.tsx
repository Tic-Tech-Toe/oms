import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
    
  return (
    
    <div className='dark:bg-dark-dark-gray bg-light-background flex md:flex-row flex-col'>
        <Sidebar />
        <Topbar />
        {/* <h1 className='text-4xl dark:text-dark-text-primary text-light-text-primary'>Root</h1> */}
        <div className="overflow-y-auto h-screen w-full">
        {children}
      </div>
    </div>
  )
}

export default Layout