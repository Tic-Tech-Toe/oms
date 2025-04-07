"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import FloatingIcon from "./FloatingIcon";

const features = [
  {
    title: "Smart Inventory Alerts",
    description: "Get AI-driven notifications before you run low or overstock.",
    glow: "from-pink-500 to-red-400",
  },
  {
    title: "Order Risk Detection",
    description: "Detect suspicious orders automatically using behavioral analysis.",
    glow: "from-yellow-500 to-orange-400",
  },
  {
    title: "Auto-Followups",
    description: "Let AI nudge your customers & vendors with timely reminders.",
    glow: "from-purple-500 to-indigo-400",
  },
];

const GenJaadu = ({ id }: { id?: string }) => {
  return (
    <section className="relative w-full py-20 px-6 md:px-20 bg-black text-white overflow-hidden" id={id}>
      {/* Floating Icons */}
      <FloatingIcon xRange={15} yRange={10} delay={0} className="top-10 left-10">
        📦
      </FloatingIcon>
      <FloatingIcon xRange={25} yRange={15} delay={2} size="text-2xl" className="top-24 right-12">
        🤖
      </FloatingIcon>
      <FloatingIcon xRange={10} yRange={30} delay={4} size="text-4xl" className="bottom-16 left-28">
        🚚
      </FloatingIcon>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-semibold text-center mb-16"
      >
        AI-Powered Enhancements
      </motion.h2>

      {/* Feature Boxes with Glassmorphism */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-xl hover:scale-[1.02] transition"
          >
            {/* Icon */}
            <motion.div
              className={`p-3 rounded-full bg-gradient-to-br ${feature.glow} shadow-lg mb-4 w-fit`}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <Sparkles className="text-white w-5 h-5" />
            </motion.div>

            {/* Text */}
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-400 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150%] h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 opacity-10 blur-3xl z-0" />
    </section>
  );
};

export default GenJaadu;
