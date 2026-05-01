"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, ArrowUpRight, ArrowDownRight, Minus, Lightbulb, UserMinus } from "lucide-react";
import { referrals } from "@/lib/demo-data";

const growthOpportunities = [
  { title: "Add Telehealth Services", impact: "High", revenue: "$45K/mo", confidence: 88, reason: "32% of patients requested remote visits" },
  { title: "Extend Weekend Hours", impact: "Medium", revenue: "$22K/mo", confidence: 72, reason: "18% drop-off due to scheduling conflicts" },
  { title: "Add Physical Therapy", impact: "High", revenue: "$65K/mo", confidence: 81, reason: "45% of orthopedic patients referred externally" },
  { title: "Launch Wellness Program", impact: "Low", revenue: "$12K/mo", confidence: 55, reason: "Growing demand in patient demographic" },
];

const dropoffs = [
  { name: "Michael Thompson", stage: "Insurance Verification", risk: 85, reason: "Coverage expired, no response to outreach" },
  { name: "Jennifer Walsh", stage: "Scheduling", risk: 72, reason: "Missed 2 appointment slots" },
  { name: "David Kim", stage: "Prior Authorization", risk: 65, reason: "PA delayed 14+ days" },
  { name: "Amanda Foster", stage: "Treatment Start", risk: 45, reason: "Cost concerns flagged" },
];

export default function GrowthPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Growth Intelligence</h1>
        <p className="text-sm text-surface-400 mt-1">Referral network, patient retention & growth opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Intelligence */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {referrals.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
                    {r.referrerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.referrerName}</p>
                    <p className="text-xs text-surface-400">{r.referrerType} • {r.patientCount} patients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">${(r.revenue / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 text-xs">
                    {r.trend === "up" ? <ArrowUpRight size={12} className="text-emerald-400" /> : r.trend === "down" ? <ArrowDownRight size={12} className="text-red-400" /> : <Minus size={12} className="text-surface-400" />}
                    <span className="text-surface-400">{r.conversionRate}% conv</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Patient Drop-off */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserMinus size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Patient Drop-off Predictions</h3>
          </div>
          <div className="space-y-3">
            {dropoffs.map((d, i) => (
              <div key={d.name} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{d.name}</p>
                  <span className={`text-xs font-bold ${d.risk >= 70 ? "text-red-400" : d.risk >= 50 ? "text-amber-400" : "text-emerald-400"}`}>{d.risk}% risk</span>
                </div>
                <p className="text-xs text-surface-400 mb-2">Stage: {d.stage}</p>
                <p className="text-xs text-surface-300">{d.reason}</p>
                <div className="h-1.5 bg-white/[0.06] rounded-full mt-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.risk}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className={`h-full rounded-full ${d.risk >= 70 ? "bg-red-500" : d.risk >= 50 ? "bg-amber-500" : "bg-emerald-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Growth Opportunities */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Growth Opportunity Engine</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growthOpportunities.map((opp, i) => (
            <motion.div key={opp.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="pipeline-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{opp.title}</h4>
                <span className={`badge ${opp.impact === "High" ? "badge-success" : opp.impact === "Medium" ? "badge-warning" : "badge-neutral"}`}>{opp.impact}</span>
              </div>
              <p className="text-xs text-surface-300 mb-3">{opp.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-400">{opp.revenue}</span>
                <span className="text-xs text-surface-400">{opp.confidence}% confidence</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
