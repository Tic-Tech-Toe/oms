"use client";
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-dark-primary dark:text-light-primary" />
        <p className="text-gray-500 dark:text-gray-300 text-sm">Loading your orders...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
