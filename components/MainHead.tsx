import React from 'react'
import SearchBar from './SearchBar'
import ThemeSwitch from './ThemeSwitch'

const MainHead = () => {
  return (
    <div className="bg-light-light-gray dark:bg-dark-background sticky top-0 z-40 w-full py-4 px-6 hidden md:flex items-center justify-between">
      <SearchBar />
      <ThemeSwitch />
    </div>
  )
}

export default MainHead
