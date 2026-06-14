"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS = ["#6366f1", "#22d3ee", "#a855f7", "#10b981", "#f59e0b"];

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useSWR("/api/dashboard/analytics", fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Insights into your product performance</p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20"
        >
          <h3 className="text-xl font-semibold mb-6">Daily Diagnostic Queries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics?.dailyQueries || []}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
              <XAxis dataKey="date" stroke="#8888a8" />
              <YAxis stroke="#8888a8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d14",
                  border: "1px solid #1e1e30",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorQueries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20"
          >
            <h3 className="text-xl font-semibold mb-6">Top Products by Queries</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topProducts || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e30" />
                <XAxis dataKey="name" stroke="#8888a8" />
                <YAxis stroke="#8888a8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d14",
                    border: "1px solid #1e1e30",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="queries" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20"
          >
            <h3 className="text-xl font-semibold mb-6">Query Resolution Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.resolutionData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analytics?.resolutionData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d14",
                    border: "1px solid #1e1e30",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-900/20"
        >
          <h3 className="text-xl font-semibold mb-6">Most Common Problems</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-border">
                <tr className="text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Problem</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Frequency</th>
                  <th className="pb-3 font-medium">Avg Resolution Time</th>
                  <th className="pb-3 font-medium">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.commonProblems || []).map((problem: any, index: number) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-4">{problem.description}</td>
                    <td className="py-4 text-muted-foreground">{problem.product}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs text-indigo-400">{problem.count} times</span>
                    </td>
                    <td className="py-4 text-muted-foreground">{problem.avgTime}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 max-w-[100px] flex-1 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-green-400" style={{ width: `${problem.successRate}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{problem.successRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
