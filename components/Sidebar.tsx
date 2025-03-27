"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  ChevronsLeftRight,
  ChevronsUpDown,
  Layers,
  LayoutGrid,
  LogOut,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { Dropdown } from "react-day-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Sidebar = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { user, logout } = useAuth();

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
    <div
      className={`dark:bg-dark-background bg-light-light-gray h-screen  flex-col justify-between hidden md:flex 
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className="font-bold text-3xl ">
          {isCollapsed ? "ST" : "Shiptrack"}
        </h1>
        <ChevronsLeftRight
          className="cursor-col-resize"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <div
        className={`flex flex-col gap-2 rounded-xl px-2 ${
          isCollapsed && "items-center mb-48"
        } transition-all duration-500`}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`group flex items-center gap-4 cursor-pointer py-4 px-4  ${
                isActive
                  ? "bg-dark-primary rounded-xl text-white"
                  : " hover:text-dark-primary"
              }`}
            >
              <item.icon
                className={` ${
                  isActive
                    ? "text-primary"
                    : " group-hover:text-dark-primary"
                }`}
              />
              {!isCollapsed && (
                <h1 className="capitalize font-semibold">{item.name}</h1>
              )}
            </div>
          );
        })}
      </div>

      {/* Profile */}
      <div
        className={`py-4 flex gap-2 ${
          isCollapsed ? "justify-center" : "items-center px-4"
        } `}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-900" />
        {!isCollapsed && user && (
          <div>
            <h1 className="font-bold text-lg ">{user.displayName}</h1>
            <span className="text-sm font-semibold dark:text-gray-400 text-gray-800">
              {user.email}
            </span>
          </div>
        )}
        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronsUpDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 flex items-center gap-2 cursor-pointer">
              <LogOut onClick={() => logout()} />
                <span>Logout</span>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
});

export default Sidebar;
