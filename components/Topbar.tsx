"use client";

import {
  Menu,
  X,
  Search,
  LayoutGrid,
  UserRound,
  Layers,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeSwitch from "./ThemeSwitch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Topbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "RK";

  const menuItems = [
    { name: "dashboard", icon: LayoutGrid, path: "/orders" },
    { name: "people", icon: UserRound, path: "/orders/people" },
    { name: "inventory", icon: Layers, path: "/orders/inventory" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 dark:bg-[#111111]/60 border-b border-zinc-200 dark:border-zinc-800 shadow-sm md:hidden transition-all">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/orders">
          <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white font-clash">
            ShipTrack
          </h1>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:bg-black/5 dark:hover:bg-white/5 rounded-md p-2 transition"
          >
            <Search
              size={20}
              className={`transition ${
                searchOpen ? "text-indigo-600" : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </button>

          {/* Theme Switcher */}
          <ThemeSwitch />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-9 h-9 bg-gradient-to-br from-fuchsia-500 to-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md cursor-pointer hover:scale-105 transition">
                {initials}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-xl shadow-xl mt-2 p-2 w-44"
            >
              <DropdownMenuItem onClick={() => router.push("/orders/account")}>
                <Settings size={16} className="mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:bg-black/5 dark:hover:bg-white/5 rounded-md p-2 transition"
          >
            {menuOpen ? (
              <X size={22} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu size={22} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && <div className="px-4 pb-2"><SearchBar /></div>}

      {/* Navigation */}
      {menuOpen && (
        <nav className="border-t border-zinc-200 dark:border-zinc-800">
          <ul className="flex justify-around px-2 py-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li
                  key={item.name}
                  onClick={() => {
                    router.push(item.path);
                    setMenuOpen(false);
                  }}
                  className={`flex flex-col items-center text-sm transition-colors ${
                    isActive
                      ? "text-indigo-600 font-medium"
                      : "text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                  }`}
                >
                  <item.icon size={22} />
                  <span className="mt-1 capitalize">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Topbar;
