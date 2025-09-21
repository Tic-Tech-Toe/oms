import React, { useRef } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import { format } from "date-fns";

export type TimelineEntry = {
  date: string;
  action: string;
};

type Props = {
  timeline: TimelineEntry[];
};

const OrderTimeline: React.FC<Props> = ({ timeline }) => {
  if (!timeline?.length) {
    return <p className="text-sm text-neutral-500">No timeline available</p>;
  }

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 1 });

  const lineHeight = useMotionValue(0); // 0 → 100% in pixels

  return (
    <div
      ref={ref}
      className="relative pl-12 py-8 h-[400px] overflow-y-scroll mb-12 custom-scrollbar"
    >
      {/* Vertical line */}
      <motion.div
        style={{ height: lineHeight }}
        initial={{ height: 0 }}
        animate={isInView ? { height: 400 } : { height: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute left-6 top-8 w-1.5 bg-blue-500 rounded-full origin-top"
      />

      {/* Discs with rectangle cards */}
      {timeline.slice().reverse().map((entry, idx) => {
        const positionPx = (idx / (timeline.length - 1)) * 400;

        return (
          <motion.div
            key={idx}
            initial={{ scale: 0, opacity: 0, y: -10 }}
            animate={
              isInView
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0, opacity: 0, y: -10 }
            }
            transition={{
              type: "tween",
              duration: 0.6,
              delay: idx * 0.3,
              ease: "easeOut",
            }}
            style={{ top: positionPx }}
            className="absolute left-[19px] flex items-center gap-4"
          >
            {/* Disc */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{
                type: "tween",
                duration: 0.5,
                delay: idx * 0.3,
                ease: "easeOut",
              }}
              className="w-4 h-4 rounded-full bg-amber-500"
            />

            {/* Rectangle card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                type: "tween",
                duration: 0.6,
                delay: idx * 0.35,
                ease: "easeOut",
              }}
              className="w-64 bg-gray-100 dark:bg-neutral-800 rounded-md p-3 flex flex-col justify-center shadow-sm"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {entry.action}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(entry.date), "dd/MM/yy hh:mm a")}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
