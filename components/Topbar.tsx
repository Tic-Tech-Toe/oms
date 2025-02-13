"use client";

import {
  Menu,
  Moon,
  Sun,
  LayoutGrid,
  UserRound,
  Layers,
  X,
  Search,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useState } from "react";

const Topbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const menuItems = [
    {
      name: "dashboard",
      icon: LayoutGrid,
      path: "/overview",
    },
    {
      name: "people",
      icon: UserRound,
      path: "/overview/people",
    },
    {
      name: "inventory",
      icon: Layers,
      path: "/overview/inventory",
    },
    {
        name: "search",
        icon: Search,
        path:"/"
    }
  ];

  return (
    <div className="block md:hidden bg-light-light-gray dark:bg-dark-background">
      <div className="flex p-4 justify-between items-center">
        <h1 className="text-2xl font-bold text-dark-background dark:text-light-light-gray">
          Shiptrack
        </h1>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-800 rounded-lg" />
          {theme === "light" ? (
            <Moon
              className="cursor-pointer text-dark-background"
              fill="black"
              size={24}
              onClick={toggleTheme}
            />
          ) : (
            <Sun
              className="cursor-pointer"
              color="yellow"
              fill="yellow"
              size={24}
              onClick={toggleTheme}
            />
          )}
          <div className="block md:hidden ">
            {isMenuOpen?<X className="text-dark-background dark:text-light-light-gray cursor-pointer"
              size={28}
              onClick={() => setIsMenuOpen(!isMenuOpen)} /> :<Menu
              className="text-dark-background dark:text-light-light-gray cursor-pointer"
              size={28}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            /> }
            
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        className={` ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex justify-around p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <item.icon
                  className={`transition-colors duration-300 p-2 ${
                    isActive
                      ? "text-primary bg-dark-primary rounded-xl"
                      : "text-dark-background dark:text-light-light-gray group-hover:text-dark-primary"
                  }`}
                  size={36}
                />
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-1"></div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
