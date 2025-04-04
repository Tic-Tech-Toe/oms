"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingIconProps {
  children: ReactNode;
  xRange?: number;
  yRange?: number;
  size?: string;
  delay?: number;
  className?: string;
}

const FloatingIcon = ({
  children,
  xRange = 20,
  yRange = 20,
  size = "text-3xl",
  delay = 0,
  className = "",
}: FloatingIconProps) => {
  return (
    <motion.div
      className={`absolute ${size} ${className}`}
      initial={{ x: 0, y: 0 }}
      animate={{
        x: [0, xRange, 0, -xRange, 0],
        y: [0, yRange, 0, -yRange, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FloatingIcon;
