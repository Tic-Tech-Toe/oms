import React from 'react'
import SearchBar from './SearchBar'
import ThemeSwitch from './ThemeSwitch'

const MainHead = () => {
  return (
    <div className='bg-light-light-gray dark:bg-dark-background fixed w-full py-2 px-6 hidden md:flex  gap-6'>
        <SearchBar />
        <ThemeSwitch />
    </div>
  )
}

export default MainHead