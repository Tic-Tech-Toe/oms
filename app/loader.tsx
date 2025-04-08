// components/FullScreenLoader.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FullScreenLoader = ({ show }: { show: boolean }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="fullscreen-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white"
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Loader2 className="animate-spin h-10 w-10 text-white" />
          </motion.div>
          <div className="text-sm opacity-70 tracking-wide">
            Signing you in. Summoning greatness…
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
