"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { Button } from "../ui/button";

const chartData = [
  { day: "Sun", value: 12000 },
  { day: "Mon", value: 5000 },
  { day: "Tue", value: 15000 },
  { day: "Wed", value: 9000 },
  { day: "Thu", value: 17000 },
  { day: "Fri", value: 4000 },
  { day: "Sat", value: 14000 },
];

// pick today for highlight
const todayIndex = new Date().getDay(); // 0=Sun

export function SalesChart() {
  const [activeTab, setActiveTab] = useState<"earnings" | "payments">(
    "earnings"
  );

  return (
    <div className="px-6 py-6 w-full h-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight ">
            Sales Report
          </h3>
          <div className="flex gap-2 mt-2">
            {["earnings", "payments"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-7 rounded-full px-4 text-xs font-medium transition-colors duration-200
      ${
        activeTab === tab
          ? // active
            "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          : // inactive
            "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
      }
    `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Select>
          <SelectTrigger
            className="h-7 w-[100px] rounded-full border border-slate-300/30 bg-white/50 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors duration-200
               dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <SelectValue placeholder="Week" />
          </SelectTrigger>

          <SelectContent
            className="rounded-xl  border border-slate-300/30 bg-white shadow-lg backdrop-blur-lg p-1
               dark:border-white/10 dark:bg-slate-900/95"
          >
            <SelectGroup className="space-y-1">
              {[
                { label: "Week", value: "week" },
                { label: "Month", value: "month" },
                { label: "5 Yr", value: "year" },
              ].map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors
                     text-slate-700 hover:bg-slate-100 focus:bg-slate-100
                     dark:text-slate-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="h-48 md:h-60 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={20}>
            <CartesianGrid
              vertical={false}
              stroke="hsl(215, 25%, 27%)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: "white" }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              isAnimationActive
              animationDuration={400}
            >
              {chartData.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={
                    idx === todayIndex
                      ? "#fb923c" // orange highlight
                      : "#475569" // default
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
