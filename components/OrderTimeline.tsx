import React, { JSX } from "react";
import {
  FaCheckCircle,
  FaDotCircle,
  FaTimesCircle,
  FaTruck,
  FaBox,
} from "react-icons/fa";
import clsx from "clsx"; // optional, but nice for conditional classes
import { format } from "date-fns";

export type TimelineEntry = {
  date: string;
  label: string;
};

type Props = {
  timeline: TimelineEntry[];
};

const iconMap: Record<string, JSX.Element> = {
  "Order Placed": <FaDotCircle className="text-blue-500" />,
  "Payment Received": <FaCheckCircle className="text-green-500" />,
  Shipped: <FaTruck className="text-orange-500" />,
  Delivered: <FaBox className="text-purple-500" />,
  Cancelled: <FaTimesCircle className="text-red-500" />,
};

const OrderTimeline: React.FC<Props> = ({ timeline }) => {
  if (!timeline?.length)
    return (
      <p className="text-sm text-muted-foreground">No timeline available</p>
    );

  return (
    <div className="relative border-l-[3px] border-neutral-300 dark:border-neutral-600 pl-6 space-y-10 py-4">
      {timeline.slice().reverse().map((entry, idx) => {
        const icon = iconMap[entry.label] || (
          <FaDotCircle className="text-gray-400" />
        );
        return (
          <div key={idx} className="relative group">
            {/* Icon */}
            <div className="absolute -left-[1.35rem] top-0">
              <div className="bg-white dark:bg-neutral-900 rounded-full p-[2px] shadow-md">
                {icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col text-[15px] sm:text-base transition-all duration-300 group-hover:scale-[1.01]">
              <span className="font-semibold text-neutral-800 dark:text-white tracking-wide">
                {entry?.action}
              </span>
              <span className="text-sm text-neutral-500">
                {format(new Date(entry.date), "dd/MM/yy · hh:mm a")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
