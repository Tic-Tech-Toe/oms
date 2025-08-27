"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import Sidebar from "@/components/Sidebar";
// import ThemeSwitch from '@/components/ThemeSwitch'
import Topbar from "@/components/Topbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row bg-light-background dark:bg-dark-dark-gray min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col w-full h-screen">
        <Topbar />
        <main className="flex-1 overflow-y-auto  md:mt-4">
          {/* <br /> */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
