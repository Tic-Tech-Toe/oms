"use client";

import { useRouteChange } from "@/app/context/RouteChangeContext";

const RouteChangeLoader = () => {
  const { routeLoading } = useRouteChange();

  if (!routeLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      {/* Cartoonish Box Bounce */}
      <div className="relative flex items-end h-24 w-40 overflow-visible">
        <div className="box w-12 h-12 bg-yellow-300 rounded-md shadow-md animate-bounce-box" />
        <div className="belt absolute bottom-0 w-full h-2 bg-gray-400 rounded-full animate-move-belt" />
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-xl font-bold text-primary animate-pulse">Loading your dashboard...</p>
        <p className="text-sm text-muted-foreground">Shipping data in progress 📦</p>
      </div>
    </div>
  );
};

export default RouteChangeLoader;
