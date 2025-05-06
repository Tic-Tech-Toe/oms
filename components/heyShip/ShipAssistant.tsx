"use client";

import { SendHorizonal, Ship, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export default function ShipAssistant() {
  const [isAlwaysActive, setIsAlwaysActive] = useState(false);
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    // This will open the chatbox later
    // setOpen((prev) => !prev)
    console.log("Open AI Assistant Chat");
  };

  return (
    <div
      className="flex items-center justify-center py-4 cursor-pointer group"
      onClick={handleClick}
      onDoubleClick={() => setIsAlwaysActive((prev) => !prev)} // toggle "Always Active" on double click
    >
      <div
        className={cn(
          "relative size-12 rounded-full p-[2px] transition-all",
          "bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500",
          "shadow-lg hover:scale-105"
        )}
      >
        {isAlwaysActive && (
          <span className="absolute inset-0 animate-ping rounded-full bg-pink-500/20 z-0" />
        )}

        <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-background dark:bg-[#121212]">
          <Ship className="group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 left-6 !z-50 w-[360px] h-[400px] bg-background border rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-primary transition"
          >
            <X size={18} />
          </button>

          <div className="flex-1 p-4 space-y-3 pt-8 ">
            <div className="text-sm bg-muted px-4 py-2 rounded-xl self-start">Hi! I'm Ship 👋</div>
            <div className="text-sm bg-primary text-white px-4 py-2 rounded-xl self-end">What's up?</div>
          </div>

          <div className="p-3 border-t border-muted flex items-center gap-2">
            <Input
              placeholder="Ask me anything..."
              className="flex-1 rounded-xl bg-muted text-sm px-4"
            />
            <button className="p-2 text-primary hover:bg-muted rounded-full transition">
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
