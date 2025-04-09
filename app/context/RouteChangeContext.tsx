// components/context/RouteChangeContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type ContextType = {
  routeLoading: boolean;
  setRouteLoading: (loading: boolean) => void;
};

const RouteChangeContext = createContext<ContextType | undefined>(undefined);

export const RouteChangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [routeLoading, setRouteLoading] = useState(false);

  return (
    <RouteChangeContext.Provider value={{ routeLoading, setRouteLoading }}>
      {children}
    </RouteChangeContext.Provider>
  );
};

export const useRouteChange = () => {
  const ctx = useContext(RouteChangeContext);
  if (!ctx) throw new Error("useRouteChange must be used within RouteChangeProvider");
  return ctx;
};
