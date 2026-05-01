"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  DollarSign, AlertTriangle, FileCheck, Rocket, Users, Store,
  TrendingUp, TrendingDown, ArrowUpRight, Activity
} from "lucide-react";
import { revenueChartData, denialsByReason, pipelineStages, salesPipeline, marketplaceMatches } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const kpis = [
  { title: "Revenue at Risk", value: "$47,200", change: -12.3, icon: DollarSign, color: "#ef4444", gradient: "from-red-500/20 to-red-500/5" },
  { title: "Pending PA", value: "23", change: -8.1, icon: FileCheck, color: "#f59e0b", gradient: "from-amber-500/20 to-amber-500/5" },
  { title: "Denial Risk", value: "14.2%", change: -3.4, icon: AlertTriangle, color: "#f97316", gradient: "from-orange-500/20 to-orange-500/5" },
  { title: "Startup Leads", value: "156", change: 24.5, icon: Rocket, color: "#8b5cf6", gradient: "from-violet-500/20 to-violet-500/5" },
  { title: "Active Buyers", value: "48", change: 18.2, icon: Users, color: "#3b82f6", gradient: "from-blue-500/20 to-blue-500/5" },
  { title: "Marketplace Matches", value: "32", change: 42.1, icon: Store, color: "#10b981", gradient: "from-emerald-500/20 to-emerald-500/5" },
];

const recentActivity = [
  { text: "PA approved for Emily Chen — Auth #AUTH-88421", time: "2 min ago", type: "success" },
  { text: "Denial risk detected — James Rodriguez (82% probability)", time: "15 min ago", type: "warning" },
  { text: "MedSync AI matched with Pacific Health Partners (94% fit)", time: "1 hr ago", type: "info" },
  { text: "Revenue leakage: $3,800 in uncaptured CPT codes", time: "2 hrs ago", type: "danger" },
  { text: "New buyer discovered — Jennifer Liu, CTO at Sunrise Health", time: "3 hrs ago", type: "info" },
  { text: "InsureBot deal moved to Proposal stage ($85K)", time: "4 hrs ago", type: "success" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card-static p-3 text-xs">
      <p className="text-surface-300 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-400 mt-1">Healthcare intelligence overview — April 2025</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-xs">Export Report</button>
          <button className="btn-primary text-xs">+ New Case</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="glass-card kpi-card"
            style={{ "--kpi-color": kpi.color } as any}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-surface-400 mt-1">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card-static p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue Trend</h3>
              <p className="text-xs text-surface-400 mt-0.5">Actual vs Predicted Revenue</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Predicted</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Leakage</span>
            </div>
          </div>
          <div className="h-64 chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" name="Actual" />
                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fill="url(#purpleGrad)" name="Predicted" />
                <Area type="monotone" dataKey="leakage" stroke="#ef4444" strokeWidth={1.5} fill="none" name="Leakage" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Denial Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card-static p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Denial Breakdown</h3>
          <p className="text-xs text-surface-400 mb-4">By reason category</p>
          <div className="space-y-3">
            {denialsByReason.map((d, i) => (
              <div key={d.reason}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-surface-300">{d.reason}</span>
                  <span className="text-surface-400">{d.count} claims</span>
                </div>
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / 45) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, #ef4444 0%, #f97316 100%)`, opacity: 1 - i * 0.12 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pipeline + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card-static p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Sales Pipeline</h3>
          <p className="text-xs text-surface-400 mb-4">Startup deal progression</p>
          <div className="h-52 chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineStages} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Deals">
                  {pipelineStages.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card-static p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-1">Recent Activity</h3>
          <p className="text-xs text-surface-400 mb-4">Platform-wide events</p>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.type === "success" ? "bg-emerald-400" :
                  item.type === "warning" ? "bg-amber-400" :
                  item.type === "danger" ? "bg-red-400" : "bg-blue-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-200 leading-snug">{item.text}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Marketplace Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="glass-card-static p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Top Marketplace Matches</h3>
            <p className="text-xs text-surface-400 mt-0.5">AI-powered startup ↔ clinic connections</p>
          </div>
          <button className="btn-ghost text-xs flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {marketplaceMatches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="pipeline-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`badge ${
                  match.status === "partnered" ? "badge-success" :
                  match.status === "connected" ? "badge-info" :
                  match.status === "in_discussion" ? "badge-warning" : "badge-neutral"
                }`}>
                  {match.status.replace("_", " ")}
                </span>
                <span className="text-sm font-bold text-emerald-400">{match.matchScore}%</span>
              </div>
              <p className="text-sm font-medium text-white truncate">{match.startupName}</p>
              <p className="text-xs text-surface-400 truncate">↔ {match.clinicName}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {match.matchReasons.slice(0, 2).map((r) => (
                  <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-surface-400">
                    {r}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
