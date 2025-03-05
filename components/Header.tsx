"use client"

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useOrderStore } from "@/hooks/useOrderStore";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import ThemeSwitch from "./ThemeSwitch";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the search query
  const allOrders = useOrderStore((state) => state.allOrders); // Get orders from the store

  // Function to handle search logic
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const filteredOrders = allOrders.filter(
      (order) =>
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log("Filtered Orders:", filteredOrders);
  };

  

  return (
    <header className="flex justify-between py-4 px-2 gap-2 md:gap-0 md:px-24 items-center bg-transparent">
      <div>
      <Link href={"/"}><h1 className="md:text-3xl text-2xl font-bold ">ShipTrack</h1></Link>
      </div>
      
      
      
      {/* Search Bar */}
      <div className="bg-light-light-gray font-semibold py-4 dark:bg-dark-dark-gray md:flex md:w-2/5 w-full rounded-full justify-around relative p-2 hidden">
        {/* <Input
          placeholder="Search by customer name or order id..."
          className="h-10 border-none px-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0 !important"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="dark:bg-light-text-secondary/[0.6] absolute bottom-1 right-1 rounded-full bg-dark-dark-gray p-2">
          <Button className="h-8 border-none shadow-none" onClick={handleSearch}>
            <Search size={48} className="text-white" />
          </Button>
        </div> */}
      </div>

      {/* Theme Toggle Button */}
      <div className="flex items-center gap-2">

      <ThemeSwitch />
      
        <Dialog>
          <DialogTrigger asChild>
          <Button className="bg-dark-primary/[0.8] text-white hover:scale-x-110 shadow-none transition-all duration-400">Login</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Login to access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@rishi"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              defaultValue=""
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Link href={"/orders"} className=" hover:bg-dark-button-hover py-2 rounded-xl w-full bg-dark-primary text-center text-lg font-semibold">Login</Link>
        </DialogFooter>
      </DialogContent>
        </Dialog>
      
        </div>
    </header>
  );
};

export default Header;
