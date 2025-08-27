import React from "react";
import {
  FaCheckCircle,
  FaDotCircle,
  FaTimesCircle,
  FaTruck,
  FaBox,
} from "react-icons/fa";
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
  if (!timeline?.length) {
    return (
      <p className="text-sm text-neutral-500">No timeline available</p>
    );
  }

  return (
    <div className="relative pl-6 py-2">
      {/* Vertical line */}
      <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-700 rounded-full" />

      <div className="space-y-8">
        {timeline
          .slice()
          .reverse()
          .map((entry, idx) => {
            const icon = iconMap[entry.label] || (
              <FaDotCircle className="text-gray-400" />
            );

            return (
              <div key={idx} className="relative flex items-start gap-4 group">
                {/* Icon circle */}
                <div className="absolute -left-[1.5rem] flex items-center justify-center bg-white dark:bg-neutral-900 rounded-full shadow-md w-6 h-6">
                  {icon}
                </div>

                {/* Content */}
                <div className="flex flex-col left-4">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition">
                    {entry.label}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {format(new Date(entry.date), "dd MMM yyyy · hh:mm a")}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OrderTimeline;
