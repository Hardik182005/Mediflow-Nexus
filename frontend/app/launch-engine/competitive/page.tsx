"use client";

import { motion } from "framer-motion";
import { Users, AlertTriangle, Globe, TrendingUp, Shield, Swords } from "lucide-react";
import { competitors } from "@/lib/demo-data";

export default function CompetitivePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Competitive Intelligence</h1>
        <p className="text-sm text-surface-400 mt-1">Track competitors, positioning & market differentiation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {competitors.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center"><Swords size={18} className="text-surface-300" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{c.competitorName}</h3>
                  <p className="text-xs text-surface-400">{c.category}</p>
                </div>
              </div>
              <span className={`badge ${c.threatLevel === "high" ? "badge-danger" : c.threatLevel === "medium" ? "badge-warning" : "badge-success"}`}>
                {c.threatLevel} threat
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Market Share</p><p className="text-xs font-medium text-white">{c.marketShare}</p></div>
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Pricing</p><p className="text-xs font-medium text-white">{c.pricing}</p></div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-emerald-400 font-medium mb-1">Strengths</p>
              <div className="flex flex-wrap gap-1">
                {c.strengths.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{s}</span>)}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-red-400 font-medium mb-1">Weaknesses</p>
              <div className="flex flex-wrap gap-1">
                {c.weaknesses.map(w => <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{w}</span>)}
              </div>
            </div>

            {c.recentLaunches.length > 0 && (
              <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <p className="text-[10px] text-blue-400 font-medium mb-1">Recent Launches</p>
                <p className="text-xs text-surface-200">{c.recentLaunches.join(", ")}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
