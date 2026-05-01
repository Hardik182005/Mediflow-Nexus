"use client";

import { motion } from "framer-motion";
import { Store, ArrowLeftRight, Zap, CheckCircle, MessageCircle, Star } from "lucide-react";
import { marketplaceMatches, startupProfiles } from "@/lib/demo-data";

const statusBadge: Record<string, string> = { recommended: "badge-info", connected: "badge-warning", in_discussion: "badge-warning", partnered: "badge-success", rejected: "badge-danger" };

export default function MarketplacePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          <p className="text-sm text-surface-400 mt-1">AI-powered startup ↔ clinic matching engine</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Zap size={16} /> Find Matches</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Matches", value: "32", icon: ArrowLeftRight, color: "#3b82f6" },
          { label: "Partnerships", value: "8", icon: CheckCircle, color: "#10b981" },
          { label: "In Discussion", value: "12", icon: MessageCircle, color: "#f59e0b" },
          { label: "Avg Match Score", value: "86%", icon: Star, color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {marketplaceMatches.map((match, i) => (
          <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`badge ${statusBadge[match.status]}`}>{match.status.replace("_", " ")}</span>
              <div className="flex items-center gap-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  match.matchScore >= 90 ? "bg-emerald-500/20 text-emerald-400" :
                  match.matchScore >= 80 ? "bg-blue-500/20 text-blue-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {match.matchScore}%
                </div>
              </div>
            </div>

            {/* Connection Visual */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 p-3 rounded-lg bg-violet-500/5 border border-violet-500/10 text-center">
                <div className="w-8 h-8 rounded-full gradient-purple mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold">
                  {match.startupName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <p className="text-xs font-medium text-white">{match.startupName}</p>
                <p className="text-[10px] text-surface-400">Startup</p>
              </div>
              <ArrowLeftRight size={16} className="text-surface-500 flex-shrink-0" />
              <div className="flex-1 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
                <div className="w-8 h-8 rounded-full gradient-blue mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold">
                  {match.clinicName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <p className="text-xs font-medium text-white">{match.clinicName}</p>
                <p className="text-[10px] text-surface-400">Clinic</p>
              </div>
            </div>

            {/* Match Reasons */}
            <div className="space-y-1 mb-3">
              <p className="text-xs text-surface-500 font-medium">Match Reasons:</p>
              {match.matchReasons.map((r) => (
                <p key={r} className="text-xs text-surface-300 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" /> {r}
                </p>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="btn-primary text-xs flex-1">Connect</button>
              <button className="btn-secondary text-xs">Details</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Startups */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-static p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Featured Startups in Marketplace</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {startupProfiles.map((s) => (
            <div key={s.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
              <div className="w-10 h-10 rounded-xl gradient-purple mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
                {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <p className="text-xs font-medium text-white">{s.name}</p>
              <p className="text-[10px] text-surface-400">{s.category}</p>
              <p className="text-xs font-bold text-emerald-400 mt-1">{s.matchScore}%</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
