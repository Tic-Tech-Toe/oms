"use client";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, ShoppingCart, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AnalyticsSalesPage() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-background to-muted/20">

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Sales Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Deep insights about your revenue, orders, growth trends & GST patterns.
        </p>
      </motion.div>


      {/* ================= FILTERS ================= */}
      <div className="flex items-center justify-between mb-6">
        <Select defaultValue="30d">
          <SelectTrigger className="w-36">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="fy">Financial Year</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="rounded-xl">
          Download Report (PDF)
        </Button>
      </div>


      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Metric 
          title="Revenue"
          value="₹ 5,42,890"
          change="+12.4%"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
        />
        <Metric 
          title="Orders"
          value="312"
          change="+4.1%"
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
        />
        <Metric 
          title="Avg Order Value"
          value="₹ 1,740"
          change="-2.1%"
          icon={<BarChart2 className="w-5 h-5 text-purple-500" />}
        />
        <Metric 
          title="GST Collected"
          value="₹ 62,831"
          change="+6.8%"
          icon={<BarChart2 className="w-5 h-5 text-orange-500" />}
        />
      </div>


      {/* ================= CHART ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>

            <div className="h-64 w-full bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              📊 Revenue Chart Placeholder  
              <br />
              (You will plug Recharts or Chart.js here)
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* ================= TABLE PREVIEW ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10"
      >
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">GST</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-2 font-medium text-foreground">#ORD1123</td>
                    <td className="py-2">Rohit Sharma</td>
                    <td className="py-2 text-green-600 font-medium">₹ 2,890</td>
                    <td className="py-2">₹ 342</td>
                    <td className="py-2">12 Dec 2025</td>
                  </tr>

                  <tr className="border-b">
                    <td className="py-2 font-medium text-foreground">#ORD1124</td>
                    <td className="py-2">Ananya Singh</td>
                    <td className="py-2 text-green-600 font-medium">₹ 1,540</td>
                    <td className="py-2">₹ 181</td>
                    <td className="py-2">13 Dec 2025</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Button variant="ghost" className="mt-4 px-4">
              View All → 
            </Button>
          </CardContent>
        </Card>
      </motion.div>


      {/* ================= DEEP DIVE SECTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20">
        <DeepDiveCard
          title="GST Breakdown"
          desc="Total tax collected, output tax, input credits & month-wise tax analysis."
        />
        <DeepDiveCard
          title="Top Products"
          desc="See which items generate most revenue & which need attention."
        />
        <DeepDiveCard
          title="Customer Insights"
          desc="New vs returning customers, high-value buyers & churn analysis."
        />
        <DeepDiveCard
          title="Payment Insights"
          desc="Mode of payment distribution, gateway charges & settlement times."
        />
      </div>

    </div>
  );
}



/* ============================================================================ */
/* COMPONENTS */
/* ============================================================================ */

const Metric = ({ title, value, change, icon }) => (
  <Card className="rounded-2xl shadow-sm border hover:shadow-md transition-all">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-semibold mt-1">{value}</h3>
          <p className="text-xs mt-1 text-green-600">{change}</p>
        </div>
        <div className="p-3 bg-muted rounded-xl">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const DeepDiveCard = ({ title, desc }) => (
  <Card className="rounded-2xl shadow-sm border hover:bg-muted/30 transition-colors">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <Button variant="ghost" className="mt-3 px-0">
        Explore →
      </Button>
    </CardContent>
  </Card>
);
