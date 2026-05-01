"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, Shield, FileText, DollarSign, TrendingDown } from "lucide-react";
import { denials, denialsByReason } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const statusBadge: Record<string, string> = { predicted: "badge-warning", denied: "badge-danger", appealed: "badge-info", overturned: "badge-success", upheld: "badge-danger" };

export default function DenialsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Denial Intelligence</h1>
          <p className="text-sm text-surface-400 mt-1">Prediction, analysis, fix recommendations & auto-appeals</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><FileText size={16} /> Generate Appeal</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Denials", value: "14", icon: AlertTriangle, color: "#ef4444" },
          { label: "At Risk Amount", value: "$47.2K", icon: DollarSign, color: "#f59e0b" },
          { label: "Appeals Pending", value: "6", icon: Shield, color: "#3b82f6" },
          { label: "Overturn Rate", value: "62%", icon: TrendingDown, color: "#10b981" },
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
        {/* Denial by Reason Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Denials by Reason</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={denialsByReason} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Denial Cards */}
        <div className="space-y-4">
          {denials.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{d.patientName}</p>
                  <p className="text-xs text-surface-400">{d.insuranceProvider} • CPT {d.cptCode}</p>
                </div>
                <span className={`badge ${statusBadge[d.status]}`}>{d.status}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-red-400">{d.denialReason}</p>
                <p className="text-sm font-bold text-white">{formatCurrency(d.claimAmount)}</p>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-400">Risk Score</span>
                  <span className="text-red-400 font-bold">{d.riskScore}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500" style={{ width: `${d.riskScore}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-surface-500 font-medium">AI Fix Recommendations:</p>
                {d.fixRecommendations.map((r, j) => (
                  <p key={j} className="text-xs text-surface-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400" /> {r}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn-primary text-xs flex-1">Generate Appeal</button>
                <button className="btn-secondary text-xs">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
