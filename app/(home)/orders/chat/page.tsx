"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Menu, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hey there 👋, welcome to support! How can I assist you today?",
      timestamp: "10:00 AM",
    },
  ]);

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Got it! I'll forward this to our team 🚀",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 800);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const chats = [
    { id: 1, name: "Rishi Kumar", lastMsg: "Hey, checking on update!", time: "9:45 AM" },
    { id: 2, name: "Customer Support", lastMsg: "We'll update you soon.", time: "10:30 AM" },
  ];

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-background via-muted/20 to-background text-foreground overflow-hidden">
      {/* --- Collapsible Sidebar --- */}
      <motion.aside
        animate={{
          width: collapsed ? "4rem" : "16rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden sm:flex flex-col border-r border-muted/40 bg-background/40 backdrop-blur-xl overflow-hidden relative"
      >
        

        <div className="p-5 border-b border-muted/30 font-semibold text-lg tracking-tight flex items-center gap-2">
          {!collapsed && "Conversations"}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-xl transition cursor-pointer hover:bg-muted/40"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/70 text-white flex items-center justify-center font-bold">
                {getInitials(chat.name)}
              </div>
              {!collapsed && (
                <div>
                  <div className="font-medium">{chat.name}</div>
                  <div className="text-xs text-muted-foreground">{chat.lastMsg}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.aside>

      {/* --- Mobile Sidebar Drawer --- */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden fixed inset-y-0 left-0 w-64 bg-background/95 backdrop-blur-lg shadow-xl border-r border-muted/30 z-40 flex flex-col"
          >
            <div className="p-4 border-b font-semibold text-lg flex justify-between items-center">
              <span>Chats</span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                ✕
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 bg-primary/10 hover:bg-primary/20 transition rounded-xl cursor-pointer"
                >
                  <div className="font-medium">{chat.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{chat.lastMsg}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Chat Area --- */}
      <main className="flex-1 flex flex-col relative backdrop-blur-sm bg-gradient-to-b from-muted/10 to-background">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3 bg-background/70 backdrop-blur-md border-b border-muted/30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="sm:hidden p-1 -ml-2 text-muted-foreground"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 text-white flex items-center justify-center font-bold">
              C
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base">Customer Support</div>
              <div className="text-xs text-muted-foreground">Online • Active now</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 sm:px-6 sm:py-5">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className={clsx("flex flex-col", {
                  "items-end": msg.sender === "user",
                  "items-start": msg.sender === "bot",
                })}
              >
                <div
                  className={clsx(
                    "max-w-[80%] px-4 py-2.5 text-sm sm:text-base rounded-2xl shadow-sm break-words backdrop-blur-md",
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-primary/40 rounded-br-none"
                      : "bg-background/70 border border-muted/30 text-foreground shadow-sm rounded-bl-none"
                  )}
                >
                  {msg.text}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        {/* <motion.div
          className="sticky bottom-0 border-t border-muted/30 bg-background/80 backdrop-blur-md p-2 sm:p-3 flex items-center gap-2"
          animate={{ y: input ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-sm sm:text-base rounded-full px-4 py-2 shadow-inner border-muted/40 focus:ring-2 focus:ring-primary/40"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-gradient-to-br from-primary to-primary/80  shadow-md hover:shadow-primary/40"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div> */}
      </main>
    </div>
  );
};

export default ChatPage;
