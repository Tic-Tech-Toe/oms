"use client"

import Link from "next/link";
import React from "react";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { log } from "console";
import { Input } from "./ui/input";
import { Moon, Search, Sun } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
    const {theme,setTheme} = useTheme("light");
    console.log(theme)

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      };
    
  return (
    <header className="flex justify-between  py-4 px-2 gap-2 md:gap-0 md:px-4  items-center bg-background">
      <h1 className="md:text-3xl text-2xl font-bold hidden md:block">ShipTrack</h1>
      <div className="bg-light-light-gray font-semibold dark:bg-dark-dark-gray flex md:w-2/5 w-full rounded-full justify-around relative  p-2">
        <Input placeholder="Search..." className="h-10 border-none px-4 text-lg font-semibold rounded-full focus:outline-none focus:ring-0 shadow-none focus:border-none focus-visible:outline-none focus-visible:ring-0 !important" />
        <div className="dark:bg-light-text-secondary/[0.6] absolute bottom-1 right-1 rounded-full bg-dark-dark-gray p-2">
            <Button className="h-8 border-none shadow-none">
                <Search size={48} className="text-white"/>
            </Button>
            
        </div>
        {/* <Link href="/dashboard" className=""><span className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all duration-300 ">DASHBOARD</span></Link>
        <span className="text-light-primary">|</span>
        <Link href="/orders" className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all duration-300 "><span>ORDERS</span></Link>
        <span className="text-light-primary">|</span>
        <Link href="/report"><span className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all duration-300 ">REPORT</span></Link> */}
      </div>
      <div className="flex items-center md:mr-6 ">
      {/* Render Moon when in light mode, Sun when in dark mode */}
      {theme === "light" ? (
        <Moon
          className="cursor-pointer text-black"
          fill="black"
          size={24}
          onClick={toggleTheme}
        />
      ) : (
        <Sun
          className="cursor-pointer  "
          color="yellow"
          fill="yellow"
          size={24}
          onClick={toggleTheme}
        />
      )}
    </div>
    </header>
  );
};

export default Header;
