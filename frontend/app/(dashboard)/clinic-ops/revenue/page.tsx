"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const revenueChartData = [
  { month: "Jul", revenue: 285000, predicted: 290000 },
  { month: "Aug", revenue: 302000, predicted: 310000 },
  { month: "Sep", revenue: 298000, predicted: 305000 },
  { month: "Oct", revenue: 325000, predicted: 330000 },
  { month: "Nov", revenue: 340000, predicted: 345000 },
  { month: "Dec", revenue: 358000, predicted: 365000 },
  { month: "Jan", revenue: 372000, predicted: 380000 },
  { month: "Feb", revenue: 385000, predicted: 390000 },
  { month: "Mar", revenue: 398000, predicted: 405000 },
  { month: "Apr", revenue: 415000, predicted: 420000 },
];

const cptProfitability = [
  { code: "99215", name: "Office Visit (Complex)", revenue: 285, cost: 95, margin: 66.7, volume: 342 },
  { code: "99214", name: "Office Visit (Moderate)", revenue: 175, cost: 65, margin: 62.8, volume: 528 },
  { code: "90837", name: "Psychotherapy (60min)", revenue: 220, cost: 90, margin: 59.1, volume: 186 },
  { code: "97110", name: "Therapeutic Exercise", revenue: 95, cost: 35, margin: 63.2, volume: 415 },
  { code: "29881", name: "Knee Arthroscopy", revenue: 8500, cost: 3200, margin: 62.4, volume: 28 },
];

const leakageItems = [
  { source: "Unbilled CPT codes", amount: 12400, severity: "high" },
  { source: "Undercoded visits", amount: 8200, severity: "medium" },
  { source: "Missing modifiers", amount: 5600, severity: "medium" },
  { source: "Timely filing misses", amount: 3100, severity: "low" },
  { source: "Credentialing gaps", amount: 2800, severity: "low" },
];

export default function RevenuePage() {
  const [notification, setNotification] = useState("");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-medium shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-white">Revenue Intelligence</h1>
        <p className="text-sm text-white/40 mt-1">Reimbursement prediction, leakage detection & CPT profitability</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "$415K", change: 4.3, icon: DollarSign },
          { label: "Revenue Leakage", value: "$32.1K", change: -18.5, icon: AlertCircle },
          { label: "Avg Reimbursement", value: "$1,080", change: 2.1, icon: TrendingUp },
          { label: "Collection Rate", value: "94.2%", change: 1.8, icon: Zap },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} className="text-white" /></div>
                <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
              </div>
              <span className="text-xs font-semibold text-white/60">{s.change >= 0 ? "+" : ""}{s.change}%</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue vs Predicted</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="white" stopOpacity={0.2} /><stop offset="100%" stopColor="white" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip contentStyle={{ background: "black", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="white" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
                <Area type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Leakage Detector</h3>
          <div className="space-y-3">
            {leakageItems.map((item) => (
              <div key={item.source} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.severity === "high" ? "bg-white" : item.severity === "medium" ? "bg-white/40" : "bg-white/10"}`} />
                  <span className="text-sm text-white/60">{item.source}</span>
                </div>
                <span className="text-sm font-semibold text-white/40">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static overflow-hidden">
        <div className="p-5 pb-0"><h3 className="text-sm font-semibold text-white">CPT Profitability Engine</h3></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>CPT Code</th><th>Description</th><th>Revenue</th><th>Cost</th><th>Margin</th><th>Volume</th><th>Total Revenue</th></tr></thead>
            <tbody>
              {cptProfitability.map((c) => (
                <tr key={c.code}>
                  <td><code className="text-sm text-white bg-white/10 px-2 py-0.5 rounded">{c.code}</code></td>
                  <td className="text-sm text-white/60">{c.name}</td>
                  <td className="text-sm text-white">{formatCurrency(c.revenue)}</td>
                  <td className="text-sm text-white/20">{formatCurrency(c.cost)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ width: `${c.margin}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-white/60">{c.margin}%</span>
                    </div>
                  </td>
                  <td className="text-sm text-white/20">{c.volume}</td>
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
