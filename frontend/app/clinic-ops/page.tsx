"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Shield, FileCheck, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, AlertCircle, Clock } from "lucide-react";

const patientPipeline = [
  { stage: "Intake", count: 24, color: "#3b82f6" },
  { stage: "Verified", count: 18, color: "#8b5cf6" },
  { stage: "Authorized", count: 15, color: "#06b6d4" },
  { stage: "In Treatment", count: 42, color: "#10b981" },
  { stage: "Completed", count: 156, color: "#14b8a6" },
];

const insurancePipeline = [
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Verified", value: 45, color: "#10b981" },
  { name: "Expired", value: 5, color: "#ef4444" },
  { name: "Denied", value: 3, color: "#dc2626" },
];

const weeklyRevenue = [
  { day: "Mon", revenue: 42000, claims: 28 },
  { day: "Tue", revenue: 38000, claims: 24 },
  { day: "Wed", revenue: 51000, claims: 35 },
  { day: "Thu", revenue: 45000, claims: 30 },
  { day: "Fri", revenue: 56000, claims: 38 },
];

const kpis = [
  { title: "Active Patients", value: "255", change: 12, icon: Users, color: "#3b82f6" },
  { title: "Insurance Verified", value: "82%", change: 5.3, icon: Shield, color: "#10b981" },
  { title: "PA Approved", value: "68%", change: -2.1, icon: FileCheck, color: "#8b5cf6" },
  { title: "Weekly Revenue", value: "$232K", change: 8.7, icon: DollarSign, color: "#14b8a6" },
];

const alerts = [
  { text: "3 insurance policies expiring this week", type: "warning", action: "Review" },
  { text: "PA required for 5 pending cases", type: "info", action: "Submit" },
  { text: "2 high-risk denial predictions", type: "danger", action: "Fix" },
  { text: "Revenue leakage detected: $3.8K", type: "warning", action: "Investigate" },
];

export default function ClinicOpsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Clinic Operations</h1>
        <p className="text-sm text-surface-400 mt-1">Unified operational intelligence dashboard</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card kpi-card" style={{ "--kpi-color": kpi.color } as any}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <kpi.icon size={18} style={{ color: kpi.color }} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${kpi.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(kpi.change)}%
              </span>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-surface-400 mt-1">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Pipeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Patient Pipeline</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientPipeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="stage" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {patientPipeline.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insurance Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Insurance Verification Status</h3>
          <div className="space-y-4">
            {insurancePipeline.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-surface-300">{item.name}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / 71) * 100}%` }} transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }} className="h-full rounded-full" style={{ background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Revenue</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Action Required</h3>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className={alert.type === "danger" ? "text-red-400" : alert.type === "warning" ? "text-amber-400" : "text-blue-400"} />
                  <span className="text-sm text-surface-200">{alert.text}</span>
                </div>
                <button className="btn-ghost text-xs">{alert.action}</button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
