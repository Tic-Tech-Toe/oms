"use client"

import MainHead from '@/components/MainHead'
import Sidebar from '@/components/Sidebar'
// import ThemeSwitch from '@/components/ThemeSwitch'
import Topbar from '@/components/Topbar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
    
  return (
    <div className='dark:bg-dark-dark-gray bg-light-background flex md:flex-row flex-col relative'>
        <Sidebar />
        {/* <div><ThemeSwitch /></div> */}
        <Topbar />
        {/* <h1 className='text-4xl dark:text-dark-text-primary text-light-text-primary'>Root</h1> */}
        {/* <div></div> */}
        <div className="overflow-y-auto h-screen w-full">
        <MainHead />
        {children}
      </div>
    </div>
  )
}

export default Layout