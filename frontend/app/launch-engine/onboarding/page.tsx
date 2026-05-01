"use client";

import { motion } from "framer-motion";
import { Rocket, Upload, Zap, Target, Globe, Users } from "lucide-react";
import { startupProfiles } from "@/lib/demo-data";

export default function OnboardingPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Startup Onboarding</h1>
          <p className="text-sm text-surface-400 mt-1">AI-powered product understanding & positioning</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Upload size={16} /> Onboard Startup</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {startupProfiles.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center text-white text-sm font-bold">
                  {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                  <p className="text-xs text-surface-400">{s.category}</p>
                </div>
              </div>
              <span className={`badge ${s.status === "active" ? "badge-success" : s.status === "onboarding" ? "badge-warning" : "badge-neutral"}`}>{s.status}</span>
            </div>
            <p className="text-xs text-surface-300 mb-3 line-clamp-2">{s.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Stage</p><p className="text-xs font-medium text-white">{s.stage}</p></div>
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Team</p><p className="text-xs font-medium text-white">{s.teamSize} people</p></div>
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Funding</p><p className="text-xs font-medium text-white">{s.fundingStage.split(" - ")[1]}</p></div>
              <div className="p-2 rounded bg-white/[0.02]"><p className="text-[10px] text-surface-500">Location</p><p className="text-xs font-medium text-white">{s.hqLocation.split(",")[0]}</p></div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 mb-3">
              <p className="text-[10px] text-blue-400 font-medium mb-1">AI Value Proposition</p>
              <p className="text-xs text-surface-200">{s.valueProposition}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400">ICP: {s.icp.slice(0, 40)}...</span>
              {s.matchScore && <span className="text-sm font-bold text-emerald-400">{s.matchScore}% match</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
