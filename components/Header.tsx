"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/app/context/AuthContext";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "./ui/button";
import useActiveSection from "@/hooks/use-active-section";
import LoginDialog from "./LoginDialog";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const active = useActiveSection(["hero", "features", "genjaadu", "footer"]);

  const navLink = (id: string, label: string) => (
    <a
      href={`#${id}`}
      className={cn(
        "group relative px-2 py-1 text-sm font-medium transition-colors duration-300",
        active === id ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={cn(
          "absolute left-1/2 bottom-0 h-[2px] w-0 -translate-x-1/2 transform bg-primary transition-all duration-300 ease-in-out",
          "group-hover:w-full bg-light-primary", // animate on hover
          active === id && "w-full drop-shadow-[0_0_6px_rgba(99,102,241,0.8)]" // glow if active
        )}
      />
    </a>
  );
  
  
  return (
    <header className="flex justify-between items-center py-4 px-4 md:px-24 w-full fixed top-0 z-50 backdrop-blur-md mb-6 bg-transparent border-b border-border">
      <Link href="/" className="text-2xl md:text-3xl font-clash font-bold">
        ShipTrack
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navLink("hero", "Home")}
        {navLink("features", "Features")}
        {navLink("genjaadu", "AI")}
        {navLink("footer", "Contact")}
      </nav>

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        {user ? (
          <Button
            variant="destructive"
            onClick={logout}
            className="text-white hover:scale-105 transition-transform"
          >
            Logout
          </Button>
        ): <LoginDialog />}
      </div>
    </header>
  );
};

export default Header;
