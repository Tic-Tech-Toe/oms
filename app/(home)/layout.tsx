// import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { AuthProvider } from "../context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <AuthProvider>

      {children}
      <Toaster />
    </AuthProvider>
    </>
  );
};

export default Layout;
