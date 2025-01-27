"use client"

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useOrderStore } from "@/hooks/useOrderStore";
import Link from "next/link";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the search query
  const allOrders = useOrderStore((state) => state.allOrders); // Get orders from the store

  // Function to handle search logic
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const filteredOrders = allOrders.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Search by customer name
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) // Search by order ID
    );

    console.log("Filtered Orders:", filteredOrders); // Display filtered orders in the console or render them
    // You can now pass the filteredOrders to a component or render them directly
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="flex justify-between py-4 px-2 gap-2 md:gap-0 md:px-4 items-center bg-background">
      <Link href={"/"}><h1 className="md:text-3xl text-2xl font-bold hidden md:block">ShipTrack</h1></Link>
      
      
      {/* Search Bar */}
      <div className="bg-light-light-gray font-semibold dark:bg-dark-dark-gray flex md:w-2/5 w-full rounded-full justify-around relative p-2">
        <Input
          placeholder="Search by customer name or order id..."
          className="h-10 border-none px-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0 !important"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="dark:bg-light-text-secondary/[0.6] absolute bottom-1 right-1 rounded-full bg-dark-dark-gray p-2">
          <Button className="h-8 border-none shadow-none" onClick={handleSearch}>
            <Search size={48} className="text-white" />
          </Button>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <div className="flex items-center md:mr-6">
        {theme === "light" ? (
          <Moon className="cursor-pointer text-black" fill="black" size={24} onClick={toggleTheme} />
        ) : (
          <Sun className="cursor-pointer" color="yellow" fill="yellow" size={24} onClick={toggleTheme} />
        )}
      </div>
    </header>
  );
};

export default Header;
