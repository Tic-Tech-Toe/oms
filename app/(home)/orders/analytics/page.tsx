"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart2,
  Box,
  Users,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  Smile,
} from "lucide-react";
import MetricCard from "./MetricCard";

type Summary = {
  revenue: number;
  orders: number;
  customers: number;
  inventoryValue: number;
  revenueChangePct: number;
  ordersChangePct: number;
  customersChangePct: number;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n
  );

export default function AnalyticsMainPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // simulate fetching summary (replace with real API)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Replace these with actual fetch to your analytics endpoints
        await new Promise((r) => setTimeout(r, 400));
        if (!mounted) return;
        setSummary({
          revenue: 125320,
          orders: 86,
          customers: 54,
          inventoryValue: 238900,
          revenueChangePct: 12.4,
          ordersChangePct: 3.2,
          customersChangePct: -1.1,
        });

        setRecentOrders([
          {
            id: "INV-202511-0003",
            name: "Chandradeep Prasad",
            total: 3622,
            status: "pending",
            date: "2025-11-16",
          },
          {
            id: "INV-202511-0002",
            name: "Kaushal",
            total: 1540,
            status: "delivered",
            date: "2025-11-15",
          },
          {
            id: "INV-202511-0001",
            name: "Asha Traders",
            total: 7820,
            status: "shipped",
            date: "2025-11-14",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-br from-background to-muted/20 dark:from-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-2xl md:text-3xl font-semibold tracking-tight"
            >
              Analytics
            </motion.h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live overview — Sales, inventory and people. Tap any card to dive
              deeper.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/analytics/sales" className="hidden sm:inline-block">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:opacity-95">
                <BarChart2 className="w-4 h-4" />
                View Sales
              </button>
            </Link>

            <Link href="/analytics/inventory" className="hidden sm:inline-block">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 dark:bg-muted/30 text-sm">
                <Box className="w-4 h-4" />
                Inventory
              </button>
            </Link>

            <Link href="/analytics/people" className="hidden sm:inline-block">
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 dark:bg-muted/30 text-sm">
                <Users className="w-4 h-4" />
                People
              </button>
            </Link>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Revenue (30d)"
            value={loading ? "—" : summary ? formatCurrency(summary.revenue) : "—"}
            subtitle={loading ? "" : `${summary?.revenueChangePct ?? 0}% vs prev`}
            icon={<ShoppingCart className="w-5 h-5" />}
            positive={summary ? summary.revenueChangePct >= 0 : true}
            to="/orders/analytics/sales"
            loading={loading}
          />
          <MetricCard
            title="Orders"
            value={loading ? "—" : String(summary?.orders ?? "—")}
            subtitle={loading ? "" : `${summary?.ordersChangePct ?? 0}%`}
            icon={<Clock className="w-5 h-5" />}
            positive={summary ? summary.ordersChangePct >= 0 : true}
            to="/analytics/sales"
            loading={loading}
          />
          <MetricCard
            title="Customers"
            value={loading ? "—" : String(summary?.customers ?? "—")}
            subtitle={loading ? "" : `${summary?.customersChangePct ?? 0}%`}
            icon={<Users className="w-5 h-5" />}
            positive={summary ? summary.customersChangePct >= 0 : true}
            to="/analytics/people"
            loading={loading}
          />
          <MetricCard
            title="Inventory value"
            value={loading ? "—" : summary ? formatCurrency(summary.inventoryValue) : "—"}
            subtitle="Current stock valuation"
            icon={<Box className="w-5 h-5" />}
            positive
            to="/analytics/inventory"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main charts / cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Revenue trend" cta={{ href: "/analytics/sales", label: "Open chart" }}>
                <div className="text-sm text-muted-foreground">
                  Live revenue for the last 30 days
                </div>
              </CardHeader>
              <CardContent>
                <SimpleLineChart loading={loading} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Top products" cta={{ href: "/analytics/inventory", label: "See all" }}>
                <div className="text-sm text-muted-foreground">
                  Best sellers this month
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <TopProductRow title="Dried Dragonfruit 2kgs" sold={124} revenue={124 * 3500} />
                  <TopProductRow title="Plates" sold={98} revenue={98 * 122} />
                  <TopProductRow title="Assorted Spices Pack" sold={56} revenue={56 * 410} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: quick lists */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Recent orders" cta={{ href: "/orders", label: "View orders" }} />
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-sm text-muted-foreground">Loading…</div>
                  ) : (
                    recentOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{o.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{o.id} • {o.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(o.total)}</div>
                          <div className="text-xs text-muted-foreground">{o.status}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Quick actions" />
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Link href="/orders/new">
                    <button className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <Smile className="w-5 h-5 text-muted-foreground" />
                        <div className="text-sm font-medium">Create manual order</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </Link>

                  <Link href="/analytics/sales">
                    <button className="w-full px-4 py-2 rounded-xl border bg-transparent">
                      Export Sales report
                    </button>
                  </Link>

                  <Link href="/analytics/inventory">
                    <button className="w-full px-4 py-2 rounded-xl border bg-transparent">
                      Inventory health
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer small */}
        <div className="mt-8 text-xs text-muted-foreground text-center">
          Live since <strong>Nov 2025</strong> · Shiptrack Analytics
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Small subcomponents used above
   You can replace these with your UI library components
   ------------------------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800">
      {children}
    </div>
  );
}

function CardHeader({
  title,
  cta,
  children,
}: {
  title?: string;
  cta?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div>
        {title && <h3 className="text-sm font-medium">{title}</h3>}
        {children}
      </div>
      {cta && (
        <Link href={cta.href}>
          <span className="text-xs text-muted-foreground underline cursor-pointer">
            {cta.label}
          </span>
        </Link>
      )}
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}

// function MetricCard({
//   title,
//   value,
//   subtitle,
//   icon,
//   positive,
//   to,
//   loading,
// }: {
//   title: string;
//   value: React.ReactNode;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   positive?: boolean;
//   to?: string;
//   loading?: boolean;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white dark:bg-zinc-950 rounded-2xl p-4 shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
//     >
//       <div>
//         <div className="flex items-center gap-3">
//           <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-zinc-50 to-white dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
//             {icon}
//           </div>
//           <div>
//             <div className="text-xs text-muted-foreground">{title}</div>
//             <div className="text-lg font-semibold mt-1">{value}</div>
//             {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
//           </div>
//         </div>
//       </div>

//       <div className="text-right">
//         <div
//           className={`text-sm font-medium ${positive ? "text-green-600" : "text-red-500"}`}
//         >
//           {loading ? "…" : positive ? "▲" : "▼"}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

function SimpleLineChart({ loading }: { loading?: boolean }) {
  // Very small SVG sparkline + axis. Replace with real chart lib later.
  const points = [10, 14, 12, 18, 20, 16, 22, 26, 24, 28];
  const max = Math.max(...points);
  const w = 560;
  const h = 120;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");

  return (
    <div className="w-full h-40 flex items-center justify-center">
      {loading ? (
        <div className="text-muted-foreground">Loading chart…</div>
      ) : (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="url(#g)" strokeWidth={3} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function TopProductRow({ title, sold, revenue }: { title: string; sold: number; revenue: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs text-muted-foreground">{sold} sold</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{formatCurrency(revenue)}</div>
      </div>
    </div>
  );
}
