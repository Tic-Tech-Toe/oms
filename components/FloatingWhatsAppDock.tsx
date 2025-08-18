"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"; // your custom toast

interface FloatingWhatsAppDockProps {
  phoneNumber: string;
  message: string;
  onClose?: () => void;
}

export default function FloatingWhatsAppDock({
  phoneNumber,
  message,
  onClose,
}: FloatingWhatsAppDockProps) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleSend = async () => {
    setLoading(true);

    // Show loading toast and keep reference
    const loadingToast = toast({
      title: "Sending WhatsApp message...",
      description: `Sending to ${phoneNumber}...`,
    });

    try {
      const res = await fetch("/api/order-processing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message }),
      });

      if (!res.ok) throw new Error("Failed to send");

      // Update to success
      toast({
        title: "✅ Message Sent",
        description: `WhatsApp message sent to ${phoneNumber}.`,
      });

      setVisible(false);
      onClose?.();
    } catch (error) {
      toast({
        title: "❌ Failed to Send",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      loadingToast.dismiss?.(); // close the loading toast
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="font-medium">Send to WhatsApp</span>

          <Button
            onClick={handleSend}
            disabled={loading}
            size="sm"
            className="bg-white text-green-500 hover:bg-gray-100"
          >
            {loading ? "Sending..." : "Send"}
          </Button>

          <button
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
            className="ml-2 hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
