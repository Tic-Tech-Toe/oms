"use client";

import {
  ChevronsLeftRight,
  ChevronsUpDown,
  Layers,
  LayoutGrid,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      icon: Search
    }
  ];

  return (
    <div
      className={`bg-dark-background h-screen  flex-col justify-between  transition-all duration-300 hidden md:flex ${
        isCollapsed ? "md:w-20" : "md:w-1/5"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className="font-bold text-3xl text-light-light-gray">
          {isCollapsed ? "ST" : "Shiptrack"}
        </h1>
        <ChevronsLeftRight
          className="text-light-light-gray cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <div className={`flex flex-col gap-2 rounded-xl px-2 ${ isCollapsed && 'items-center mb-48'} transition-all duration-500`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`group flex items-center gap-4 cursor-pointer py-4 px-4 transition-colors duration-300 ${
                isActive
                  ? "bg-dark-primary rounded-xl text-white"
                  : "text-light-light-gray hover:text-dark-primary"
              }`}
            >
              <item.icon
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-white group-hover:text-dark-primary"
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
      <div className={`py-4 flex gap-2 ${isCollapsed ? 'justify-center':'items-center px-4'} `}>
        <div className="w-12 h-12 rounded-2xl bg-indigo-900" />
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-lg text-white">Rishi</h1>
            <span className="text-sm font-semibold text-gray-400">
              rishi96350@outlook.com
            </span>
          </div>
        )}
        {!isCollapsed && (<ChevronsUpDown className="text-white" />)}
        
      </div>
    </div>
  );
});

export default Sidebar;
