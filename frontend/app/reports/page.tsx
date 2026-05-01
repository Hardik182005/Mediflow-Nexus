"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileBarChart, Download, Calendar } from "lucide-react";
import { revenueChartData, denialsByReason, pipelineStages, payerAnalytics } from "@/lib/demo-data";

const clinicMetrics = [
  { label: "Total Revenue", value: "$3.58M", change: "+12.4%" },
  { label: "Total Patients", value: "2,847", change: "+8.2%" },
  { label: "Denial Rate", value: "11.3%", change: "-3.1%" },
  { label: "Collection Rate", value: "94.2%", change: "+1.8%" },
  { label: "Avg Reimbursement", value: "$1,080", change: "+2.1%" },
  { label: "PA Approval Rate", value: "82%", change: "+5.4%" },
];

const startupMetrics = [
  { label: "Pipeline Value", value: "$1.23M", change: "+24.5%" },
  { label: "Active Leads", value: "156", change: "+18.2%" },
  { label: "Win Rate", value: "38%", change: "+6.1%" },
  { label: "Avg Deal Size", value: "$246K", change: "+15.3%" },
  { label: "Marketplace Matches", value: "32", change: "+42.1%" },
  { label: "Partnerships", value: "8", change: "+100%" },
];

const statusBreakdown = [
  { name: "Verified", value: 45, color: "#10b981" },
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Denied", value: 8, color: "#ef4444" },
  { name: "Expired", value: 5, color: "#64748b" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-sm text-surface-400 mt-1">Unified intelligence across clinic, startup & marketplace</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs flex items-center gap-1"><Calendar size={14} /> Date Range</button>
          <button className="btn-primary text-xs flex items-center gap-1"><Download size={14} /> Export PDF</button>
        </div>
      </div>

      {/* Clinic Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Clinic Intelligence Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {clinicMetrics.map((m) => (
            <div key={m.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-lg font-bold text-white">{m.value}</p>
              <p className="text-xs text-surface-400">{m.label}</p>
              <p className={`text-xs font-semibold mt-1 ${m.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{m.change}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Startup Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Startup Launch Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {startupMetrics.map((m) => (
            <div key={m.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-lg font-bold text-white">{m.value}</p>
              <p className="text-xs text-surface-400">{m.label}</p>
              <p className={`text-xs font-semibold mt-1 ${m.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{m.change}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend (10 Months)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insurance Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Insurance Status Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                  {statusBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {statusBreakdown.map(s => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs text-surface-300">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} /> {s.name}: {s.value}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pipeline Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Sales Pipeline Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineStages}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {pipelineStages.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Payer Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Payer Performance Overview</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payerAnalytics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="payerName" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="performanceScore" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
