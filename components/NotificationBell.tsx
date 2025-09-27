"use client";

import React, { useEffect, useRef, useState } from "react";
// We now only import Lucide icons and React hooks, removing the non-resolvable local imports.
import { Bell, RotateCw, CheckCheck, X } from "lucide-react"; 
import ThemeSwitch from "./ThemeSwitch";

// --- Custom Button Wrapper for Liquid Effect ---
// This component replaces the external './ui/button' and implements the fluid hover/active animations.
const GlassButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
    ({ className, children, ...props }, ref) => (
      <button
        ref={ref}
        className={`
          flex items-center justify-center transition-all duration-200 ease-out 
          active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-blue-500/70 
          hover:shadow-lg hover:scale-[1.03]
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
);
GlassButton.displayName = "GlassButton";
// ----------------------------------------------

type WhatsAppRaw = any;

type WAParsedMessage = {
  id: string;
  from: string;
  body?: string;
  timestamp?: string;
  type?: string;
  contactName?: string | null;
};

interface Props {
  /** API endpoint that returns a WhatsApp-like webhook JSON (default: /api/mockWebhook) */
  endpoint?: string;
  /** Poll interval in ms (default: 15s). Set to 0 to disable polling. */
  pollInterval?: number;
}

export default function NotificationBell({ endpoint = "/api/mock-hook", pollInterval = 15000 }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WAParsedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seenIds, setSeenIds] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<number | null>(null);

  // Helper: parse WhatsApp webhook-like payload into flat messages
  const parse = (data: WhatsAppRaw): WAParsedMessage[] => {
    try {
      const entry = data?.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value || {};
      const rawMessages = value?.messages || [];
      const contacts: { wa_id?: string; profile?: { name?: string } }[] = value?.contacts || [];

      // Make a lookup for wa_id -> name
      const nameByWaId = new Map<string, string>();
      for (const c of contacts) {
        if (c?.wa_id && c?.profile?.name) nameByWaId.set(c.wa_id, c.profile.name);
      }

      return rawMessages.map((m: any) => ({
        id: m.id,
        from: m.from,
        body: m?.text?.body ?? (m?.type === "image" ? "<image>" : m?.body ?? ""),
        timestamp: m.timestamp,
        type: m.type,
        contactName: nameByWaId.get(m.from) ?? null,
      }));
    } catch (e) {
      return [];
    }
  };

  const fetchMessages = async (opts?: { markSeen?: boolean }) => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const res = await fetch(endpoint, { signal: controller.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const parsed = parse(data);

      // merge new messages (dedupe by id) keeping newest first
      setMessages((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]));
        for (const p of parsed) byId.set(p.id, p);
        // Sort by timestamp descending
        const merged = Array.from(byId.values()).sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
        return merged;
      });

      if (opts?.markSeen) {
        setSeenIds((prev) => {
          const copy = { ...prev };
          for (const m of parsed) copy[m.id] = true;
          return copy;
        });
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // polling
  useEffect(() => {
    if (!pollInterval || pollInterval <= 0) return;
    const id = window.setInterval(() => fetchMessages(), pollInterval);
    pollRef.current = id;
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, pollInterval]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const unreadCount = messages.filter((m) => !seenIds[m.id]).length;

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      // when opening, refresh and mark as seen
      await fetchMessages({ markSeen: true });
      setSeenIds((prev) => {
        const copy = { ...prev };
        for (const m of messages) copy[m.id] = true;
        return copy;
      });
    }
  };

  const markAllRead = () => {
    setSeenIds((prev) => {
      const copy = { ...prev };
      for (const m of messages) copy[m.id] = true;
      return copy;
    });
  };
  
  // A small helper to format time for better UX
  const formatTimestamp = (timestamp?: string) => {
      if (!timestamp) return "";
      const date = new Date(Number(timestamp) * 1000);
      const now = new Date();
      const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);

      if (diffInDays < 1) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInDays < 7) {
          return date.toLocaleDateString([], { weekday: 'short' });
      } else {
          return date.toLocaleDateString();
      }
  };

  return (
    <>
      {/* Custom CSS for the "Liquid Glass" (High Blur) effect and scrollbar */}
      <style jsx global>{`
        /* Custom scrollbar for a sleek look */
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(128, 128, 128, 0.5); /* Semi-transparent grey */
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .liquid-glass {
          /* REFINED: Liquid Glass (Water Droplet Effect) - Light Mode */
          background-color: rgba(255, 255, 255, 0.08); /* Highly transparent/bright base */
          backdrop-filter: blur(30px) saturate(180%); /* Increased blur and saturation */
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          
          /* Border to simulate light refraction on the edge of the liquid surface */
          border: 2px solid transparent; 
          
          /* Multiple shadows for depth and shine, similar to the provided snippet */
          box-shadow: 
            /* Inner ring/highlight, simulating the bright edge of a water droplet */
            0 0 0 2px rgba(255, 255, 255, 0.6), 
            /* Strong outer shadow for depth above the background */
            0 16px 32px rgba(0, 0, 0, 0.25), 
            /* Subtle inner highlight for convex shape */
            inset 2px 2px 10px rgba(255, 255, 255, 0.5);
        }

        .dark .liquid-glass {
          /* REFINED: Dark Mode Liquid Glass */
          background-color: rgba(10, 10, 20, 0.01); /* Darker, more saturated base */
          border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle white border for edge definition */
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(100%);
          box-shadow: 
            /* Inner ring/highlight */
            0 0 0 2px rgba(255, 255, 255, 0.1), 
            /* Stronger outer shadow for depth */
            0 16px 32px rgba(0, 0, 0, 0.5), 
            /* Subtle inner highlight for convex shape */
            inset 2px 2px 10px rgba(255, 255, 255, 0.1);
        }

        /* Hover effect for list items inside the glass element */
        .liquid-item-hover:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .dark .liquid-item-hover:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
      
      {/* Container is fixed to the top right of the viewport */}
      <div 
        ref={containerRef} 
        className="fixed right-10 top-6 z-[100] text-left font-inter"
      >
        <div className="flex items-center gap-4 border-2 p-2 rounded-full liquid-glass">
                <ThemeSwitch />
                {/* Bell Button: Using GlassButton for fluid transitions */}
        <GlassButton
          onClick={toggleOpen}
          // ADDED: 'relative' back to the button class name for the unread badge to position correctly
          className="relative h-10 w-10 p-2 rounded-full bg-white/60 dark:bg-slate-800/60 shadow-lg" 
          title="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </GlassButton>

        </div>
        
        
        

        {/* Dropdown: Liquid Glass Card (Replaced Card component with styled div) */}
        {open && (
          <div 
            className={`
              absolute right-0 mt-3 w-80 md:w-96 shadow-2xl z-50 transform origin-top-right transition-all duration-300 p-0 border-none
              ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
              liquid-glass
              rounded-[2rem] /* UPDATED: Increased rounding for a droplet/liquid shape */
            `}
          >
            {/* CardHeader (Replaced with styled div) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50">
              {/* CardTitle (Replaced with styled strong tag) */}
              <strong className="text-xl font-semibold text-gray-800 dark:text-white">Messages</strong>
              <div className="flex items-center gap-2">
                {/* Refresh Button (Now using GlassButton) */}
                <GlassButton
                  onClick={() => fetchMessages()} 
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 shadow-none text-sm"
                  title="Refresh"
                  disabled={loading}
                >
                  <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </GlassButton>
                
                {/* Mark All Read Button (Now using GlassButton) */}
                <GlassButton
                  onClick={markAllRead}
                  className="text-sm px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/50 shadow-none"
                  title="Mark all read"
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Read All
                </GlassButton>
              </div>
            </div>
            {/* Separator (Replaced with <hr>) */}
            <hr className="border-t border-gray-200/50 dark:border-slate-700/50 opacity-0 m-0" />

            {/* CardContent (Replaced with styled div) */}
            <div className="p-0">
              {/* ScrollArea (Replaced with styled div with overflow) */}
              <div className="max-h-80 overflow-y-auto custom-scroll">
                {loading && (
                  <div className="p-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Loading...
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <X className="h-4 w-4" /> Error: {error}
                  </div>
                )}
                {!loading && messages.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>✨ All clear! You have no new messages.</p>
                  </div>
                )}

                {/* Message Items */}
                {messages.map((m) => {
                  const isUnread = !seenIds[m.id];
                  return (
                    <div
                      key={m.id}
                      // Use liquid-item-hover for glass-like hover transition
                      className={`
                        p-4 border-b border-gray-200/50 dark:border-slate-700/50 last:border-b-0 cursor-pointer liquid-item-hover
                        ${isUnread ? "bg-blue-50/50 dark:bg-blue-950/50" : "bg-transparent"}
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className={`text-sm ${isUnread ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-700 dark:text-gray-200"} truncate`}>
                            {m.contactName ?? m.from}
                          </div>
                          <div className={`text-sm mt-0.5 break-words whitespace-pre-wrap ${isUnread ? "text-gray-800 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                            {m.body}
                          </div>
                        </div>
                        {/* Timestamp */}
                        <div className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-0.5 ml-2">
                          {formatTimestamp(m.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Separator (Replaced with <hr>) */}
            <hr className="border-t border-gray-200/50 dark:border-slate-700/50 opacity-0 m-0" />
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200/50 dark:border-slate-700/50 text-xs text-center text-gray-500 dark:text-gray-400 rounded-b-xl">
              Powered by Shiptrack
            </div>
          </div>
        )}
      </div>
    </>
  );
}
