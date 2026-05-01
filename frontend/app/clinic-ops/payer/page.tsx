"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Landmark, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { payerAnalytics } from "@/lib/demo-data";

const radarData = payerAnalytics.map(p => ({
  name: p.payerName.split(" ")[0],
  score: p.performanceScore,
  denial: 100 - p.denialRate * 3,
  speed: Math.max(0, 100 - p.avgApprovalTime * 10),
  reimbursement: (p.avgReimbursement / 1250) * 100,
}));

export default function PayerPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Payer Intelligence</h1>
        <p className="text-sm text-surface-400 mt-1">Compare payer performance, approval times & denial rates</p>
      </div>

      {/* Payer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {payerAnalytics.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{p.payerName}</h3>
                <p className="text-xs text-surface-400">{p.totalClaims} total claims</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                p.performanceScore >= 85 ? "bg-emerald-500/20 text-emerald-400" :
                p.performanceScore >= 70 ? "bg-blue-500/20 text-blue-400" :
                "bg-amber-500/20 text-amber-400"
              }`}>
                {p.performanceScore}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.02]">
                <p className="text-xs text-surface-500 mb-1">Denial Rate</p>
                <p className={`text-sm font-bold ${p.denialRate <= 10 ? "text-emerald-400" : p.denialRate <= 15 ? "text-amber-400" : "text-red-400"}`}>{p.denialRate}%</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02]">
                <p className="text-xs text-surface-500 mb-1">Avg Approval</p>
                <p className="text-sm font-bold text-blue-400">{p.avgApprovalTime} days</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02]">
                <p className="text-xs text-surface-500 mb-1">Avg Reimburse</p>
                <p className="text-sm font-bold text-emerald-400">${p.avgReimbursement}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02]">
                <p className="text-xs text-surface-500 mb-1">Payment Delay</p>
                <p className={`text-sm font-bold ${p.avgPaymentDelay <= 14 ? "text-emerald-400" : p.avgPaymentDelay <= 20 ? "text-amber-400" : "text-red-400"}`}>{p.avgPaymentDelay} days</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(p.approvedClaims / p.totalClaims) * 100}%` }} />
              </div>
              <span className="text-[10px] text-surface-400">{Math.round((p.approvedClaims / p.totalClaims) * 100)}% approved</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Payer Performance Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payerAnalytics} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="payerName" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="approvedClaims" fill="#10b981" name="Approved" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deniedClaims" fill="#ef4444" name="Denied" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendingClaims" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
