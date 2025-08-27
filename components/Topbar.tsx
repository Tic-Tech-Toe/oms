"use client";

import { Menu, X, LayoutGrid, UserRound, Layers, Radio } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn button

const BottomNav = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
    { name: "broadcast", icon: Radio, path: "/orders/broadcast" },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-between  gap-4 items-center px-4 z-50 md:hidden">
      {/* Dock */}
      <div
        className={`flex items-center gap-4 px-5 py-3 rounded-full w-full justify-between shadow-lg border border-white/20 backdrop-blur-xl bg-white/30 dark:bg-zinc-800/30 transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-5 pointer-events-none"
        }`}
      >
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center  rounded-full transition hover:scale-110 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] capitalize">{item.name}</span>
            </Link>
          );
        })}

        {/* Profile */}
        {/* <Link
          href="/orders/account"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md hover:scale-110 transition"
        >
          {initials}
        </Link> */}
      </div>

      {/* Floating Toggle Button */}
      <Button
        size="icon"
        onClick={() => setMenuOpen((prev) => !prev)}
        className={` w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 text-white shadow-lg transform transition-all duration-300 aspect-square ${
          menuOpen ? "rotate-90" : ""
        }`}
      >
        {menuOpen ? <X size={26} /> : <Menu size={26} />}
      </Button>
    </div>
  );
};

export default BottomNav;
