"use client"

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="bg-background font-semibold  flex md:w-3/5 rounded-full justify-around relative px-4 p-2">
              <Input
                placeholder="Search..."
                className="h-10 border-none px-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0 !important"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
              <div className="dark:bg-light-text-secondary/[0.6] absolute bottom-1 right-1 rounded-full bg-dark-dark-gray p-2">
                <Button className="h-8 border-none shadow-none">
                  <Search size={48} strokeWidth={4} className="text-white" />
                </Button>
              </div>
            </div>
  )
}

export default SearchBar