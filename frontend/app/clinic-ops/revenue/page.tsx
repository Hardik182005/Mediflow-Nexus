"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Zap } from "lucide-react";
import { revenueChartData } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const cptProfitability = [
  { code: "99215", name: "Office Visit (Complex)", revenue: 285, cost: 95, margin: 66.7, volume: 342, color: "#10b981" },
  { code: "99214", name: "Office Visit (Moderate)", revenue: 175, cost: 65, margin: 62.8, volume: 528, color: "#3b82f6" },
  { code: "90837", name: "Psychotherapy (60min)", revenue: 220, cost: 90, margin: 59.1, volume: 186, color: "#8b5cf6" },
  { code: "97110", name: "Therapeutic Exercise", revenue: 95, cost: 35, margin: 63.2, volume: 415, color: "#06b6d4" },
  { code: "29881", name: "Knee Arthroscopy", revenue: 8500, cost: 3200, margin: 62.4, volume: 28, color: "#f59e0b" },
];

const leakageItems = [
  { source: "Unbilled CPT codes", amount: 12400, trend: "up", severity: "high" },
  { source: "Undercoded visits", amount: 8200, trend: "stable", severity: "medium" },
  { source: "Missing modifiers", amount: 5600, trend: "down", severity: "medium" },
  { source: "Timely filing misses", amount: 3100, trend: "down", severity: "low" },
  { source: "Credentialing gaps", amount: 2800, trend: "stable", severity: "low" },
];

const delayRisks = [
  { payer: "Cigna", avgDelay: 25, riskLevel: "high", amount: 45000 },
  { payer: "Aetna", avgDelay: 21, riskLevel: "medium", amount: 38000 },
  { payer: "UnitedHealthcare", avgDelay: 18, riskLevel: "medium", amount: 52000 },
  { payer: "BCBS", avgDelay: 14, riskLevel: "low", amount: 62000 },
  { payer: "Medicare", avgDelay: 12, riskLevel: "low", amount: 78000 },
];

export default function RevenuePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Revenue Intelligence</h1>
        <p className="text-sm text-surface-400 mt-1">Reimbursement prediction, leakage detection & CPT profitability</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "$415K", change: 4.3, icon: DollarSign, color: "#10b981" },
          { label: "Revenue Leakage", value: "$32.1K", change: -18.5, icon: AlertCircle, color: "#ef4444" },
          { label: "Avg Reimbursement", value: "$1,080", change: 2.1, icon: TrendingUp, color: "#3b82f6" },
          { label: "Collection Rate", value: "94.2%", change: 1.8, icon: Zap, color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
                <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
              </div>
              <span className={`text-xs font-semibold ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue vs Predicted</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
                <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Leakage */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Leakage Detector</h3>
          <div className="space-y-3">
            {leakageItems.map((item, i) => (
              <div key={item.source} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.severity === "high" ? "bg-red-400" : item.severity === "medium" ? "bg-amber-400" : "bg-emerald-400"}`} />
                  <span className="text-sm text-surface-200">{item.source}</span>
                </div>
                <span className="text-sm font-semibold text-red-400">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CPT Profitability */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static overflow-hidden">
        <div className="p-5 pb-0"><h3 className="text-sm font-semibold text-white">CPT Profitability Engine</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>CPT Code</th><th>Description</th><th>Revenue</th><th>Cost</th><th>Margin</th><th>Volume</th><th>Total Revenue</th></tr></thead>
            <tbody>
              {cptProfitability.map((c, i) => (
                <tr key={c.code}>
                  <td><code className="text-sm text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{c.code}</code></td>
                  <td className="text-sm">{c.name}</td>
                  <td className="text-sm text-emerald-400">{formatCurrency(c.revenue)}</td>
                  <td className="text-sm text-surface-300">{formatCurrency(c.cost)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.margin}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">{c.margin}%</span>
                    </div>
                  </td>
                  <td className="text-sm text-surface-300">{c.volume}</td>
                  <td className="text-sm font-semibold text-white">{formatCurrency(c.revenue * c.volume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
