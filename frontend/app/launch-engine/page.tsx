"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { Rocket, Users, Target, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const leadsByMonth = [
  { month: "Jan", leads: 18 }, { month: "Feb", leads: 24 }, { month: "Mar", leads: 32 },
  { month: "Apr", leads: 28 }, { month: "May", leads: 42 }, { month: "Jun", leads: 38 },
  { month: "Jul", leads: 48 }, { month: "Aug", leads: 56 }, { month: "Sep", leads: 52 },
  { month: "Oct", leads: 65 },
];

const dealValueTrend = [
  { month: "Jan", value: 120000 }, { month: "Feb", value: 180000 }, { month: "Mar", value: 250000 },
  { month: "Apr", value: 320000 }, { month: "May", value: 280000 }, { month: "Jun", value: 450000 },
  { month: "Jul", value: 520000 }, { month: "Aug", value: 680000 }, { month: "Sep", value: 750000 },
  { month: "Oct", value: 890000 },
];

export default function LaunchEnginePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Startup Launch Engine</h1>
        <p className="text-sm text-surface-400 mt-1">GTM intelligence for healthcare startups</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Startups", value: "5", icon: Rocket, color: "#8b5cf6" },
          { label: "Total Leads", value: "156", icon: Users, color: "#3b82f6" },
          { label: "Win Rate", value: "38%", icon: Target, color: "#10b981" },
          { label: "Pipeline Value", value: "$1.23M", icon: DollarSign, color: "#f59e0b" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Lead Generation Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="leads" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline Value Growth</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dealValueTrend}>
                <defs><linearGradient id="dvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#dvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
