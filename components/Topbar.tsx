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
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "@/app/context/AuthContext"; // Import Auth Context

const Topbar = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { user, logout } = useAuth(); // Get user data and logout function

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
          {user ? (
            // ✅ Show Profile Picture if Logged In
            <img
              src={user.profilePic || "/default-profile.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-400"
            />
          ) : (
            <UserRound className="text-gray-500" size={32} />
          )}

          <ThemeSwitch />

          {/* Logout Button - Only visible when logged in */}
          {user && (
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <LogOut className="text-red-500" size={24} />
            </button>
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
                  setIsSearchActive(false);
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
