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
import Link from "next/link";
import SearchBar from "./SearchBar";

// const SearchBar = () => {
//   return (
//     <div className="p-4">
//       <input
//         type="text"
//         placeholder="Search..."
//         className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-dark-primary"
//       />
//     </div>
//   );
// };

const Topbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // NEW STATE

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
      path: "/orders",
    },
    {
      name: "people",
      icon: UserRound,
      path: "/orders/people",
    },
    {
      name: "inventory",
      icon: Layers,
      path: "/orders/inventory",
    },
  ];

  return (
    <div className="block md:hidden bg-light-light-gray dark:bg-dark-background">
      <div className="flex p-4 justify-between items-center">
        <Link href={"/orders"}>
          <h1 className="text-2xl font-bold text-dark-background dark:text-light-light-gray">
            Shiptrack
          </h1>
        </Link>

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
          <div className="block md:hidden">
            {isMenuOpen ? (
              <X
                className="text-dark-background dark:text-light-light-gray cursor-pointer"
                size={28}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            ) : (
              <Menu
                className="text-dark-background dark:text-light-light-gray cursor-pointer"
                size={28}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} p-2`}>
        <ul className="flex justify-around p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => {
                  setIsSearchActive(false); // Close SearchBar if navigating
                  router.push(item.path);
                }}
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
              </li>
            );
          })}
          <li
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <Search
              className={`transition-colors duration-300 p-2 ${
                isSearchActive
                  ? "text-primary bg-dark-primary rounded-xl"
                  : "text-dark-background dark:text-light-light-gray group-hover:text-dark-primary"
              }`}
              size={36}
            />
          </li>
        </ul>

        {/* SearchBar Component */}
        {isSearchActive && <SearchBar />}
      </div>
    </div>
  );
};

export default Topbar;
