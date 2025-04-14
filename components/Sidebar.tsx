"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  ChevronsLeftRight,
  ChevronsUpDown,
  Layers,
  LayoutGrid,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Sidebar = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, logout } = useAuth();

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
    <div
      className={`bg-light-light-gray dark:bg-dark-background hidden  backdrop-blur-xl shadow-xl   h-screen md:flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-5">
        <h1 className="text-2xl font-extrabold tracking-wide text-dark-primary font-clash">
          {isCollapsed ? "ST" : "ShipTrack"}
        </h1>
        <ChevronsLeftRight
          className="cursor-pointer text-gray-500 hover:text-dark-primary transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Menu */}
      <div className={`flex flex-col gap-2 px-2 ${isCollapsed ? "mb-40" : ""}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`group flex items-center gap-4 cursor-pointer py-3 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                size={22}
                className={`${
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-indigo-600"
                }`}
              />
              {!isCollapsed && (
                <span className="capitalize font-medium tracking-wide">
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div
        className={`py-4 px-4 border-t border-gray-200 dark:border-gray-700 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="relative group cursor-pointer"
              title={!isCollapsed ? "" : user?.displayName || "Profile"}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 p-[2px] shadow-md hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-white dark:bg-[#121212] rounded-full flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.displayName
                    ? user.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "RK"}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align={isCollapsed ? "center" : "end"}
            className="min-w-[160px] p-2 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border dark:border-gray-700 space-y-1"
          >
            {!isCollapsed && (
              <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => router.push("/orders/account")}
              >
                <Settings size={16} />
                <span className="text-sm">Account Settings</span>
              </div>
            )}
            <div
              className={`flex items-center gap-2 cursor-pointer p-2 rounded-md text-red-500 ${
                isCollapsed
                  ? "justify-center hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "hover:bg-red-100 dark:hover:bg-red-900/30"
              } transition-colors`}
              onClick={logout}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <h1 className="font-semibold text-sm truncate">
              {user?.displayName || "Rishi Kumarr"}
            </h1>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Sidebar;
