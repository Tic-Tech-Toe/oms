// import Header from "@/components/Header";
import RouteChangeLoader from "@/components/RouteChangeLoader";
// import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { RouteChangeProvider } from "../context/RouteChangeContext";
import { Toaster } from "@/components/Toaster";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RouteChangeProvider>
      <RouteChangeLoader />
      {children}
      <Toaster />
    </RouteChangeProvider>
  );
};

export default Layout;
