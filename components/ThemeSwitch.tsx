"use client"

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'

const ThemeSwitch = () => {
      const { theme, setTheme } = useTheme();

      const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      };
    
  return (
    <div className="flex items-center gap-4 ">
        {theme === "light" ? (
          <Moon className="cursor-pointer text-black" fill="black" size={24} onClick={toggleTheme} />
        ) : (
          <Sun className="cursor-pointer" color="white" fill="white" size={24} onClick={toggleTheme} />
        )} </div>
  )
}

export default ThemeSwitch