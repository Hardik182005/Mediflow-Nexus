"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, Shield, FileText, DollarSign, TrendingDown } from "lucide-react";
import { denials, denialsByReason } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const statusBadge: Record<string, string> = { predicted: "badge-neutral", denied: "badge-neutral", appealed: "badge-neutral", overturned: "badge-neutral", upheld: "badge-neutral" };

export default function DenialsPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Denial Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">Prediction, analysis, fix recommendations & auto-appeals</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><FileText size={16} /> Generate Appeal</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Denials", value: "14", icon: AlertTriangle, color: "white" },
          { label: "At Risk Amount", value: "$47.2K", icon: DollarSign, color: "white" },
          { label: "Appeals Pending", value: "6", icon: Shield, color: "white" },
          { label: "Overturn Rate", value: "62%", icon: TrendingDown, color: "white" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ background: "black", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="white" />
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
                  <p className="text-xs text-white/40">{d.insuranceProvider} • CPT {d.cptCode}</p>
                </div>
                <span className={`badge ${statusBadge[d.status]}`}>{d.status}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/60">{d.denialReason}</p>
                <p className="text-sm font-bold text-white">{formatCurrency(d.claimAmount)}</p>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Risk Score</span>
                  <span className="text-white font-bold">{d.riskScore}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-white" style={{ width: `${d.riskScore}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/40 font-medium">AI Fix Recommendations:</p>
                {d.fixRecommendations.map((r, j) => (
                  <p key={j} className="text-xs text-white/40 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-white/20" /> {r}
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

