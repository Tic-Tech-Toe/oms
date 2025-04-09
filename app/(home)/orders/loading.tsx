// components/FullScreenLoader.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

 const Loading = () => {
  return (
    <div className="w-[100vw] h-[100vh] bg-red-400">
      <span className="text-[100px]">Loading orders</span>
    </div>
  
  );
};

export default Loading
