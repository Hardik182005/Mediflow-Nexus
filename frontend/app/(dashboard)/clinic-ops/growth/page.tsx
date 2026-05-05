"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Lightbulb, UserMinus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      const { data } = await supabase.from('referrals').select('*').order('revenue', { ascending: false });
      if (data && data.length > 0) {
        setReferrals(data);
      } else {
        setReferrals([
          { id: "R001", referrerName: "Dr. Michael Chen", referrerType: "Orthopedic Surgeon", patientCount: 45, revenue: 285000, conversionRate: 72, trend: "up" },
          { id: "R002", referrerName: "Memorial Hospital", referrerType: "Hospital System", patientCount: 128, revenue: 450000, conversionRate: 45, trend: "up" },
          { id: "R003", referrerName: "Dr. Sarah Williams", referrerType: "Primary Care", patientCount: 38, revenue: 142000, conversionRate: 68, trend: "stable" },
          { id: "R004", referrerName: "HealthFirst Clinic", referrerType: "Urgent Care", patientCount: 22, revenue: 95000, conversionRate: 52, trend: "down" },
          { id: "R005", referrerName: "Dr. James Patel", referrerType: "Pain Management", patientCount: 31, revenue: 198000, conversionRate: 78, trend: "up" },
        ]);
      }
      setLoading(false);
    };
    fetchReferrals();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-white/10 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Growth Intelligence</h1>
        <p className="text-sm text-white/40 mt-1">Referral network, patient retention & growth opportunities</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {referrals.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white text-xs font-bold">
                    {(r.referrerName || r.referrer_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.referrerName || r.referrer_name}</p>
                    <p className="text-xs text-white/40">{r.referrerType || r.referrer_type} • {r.patientCount || r.patient_count} patients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">${((r.revenue || 0) / 1000).toFixed(0)}K</p>
                  <div className="flex items-center gap-1 text-xs">
                    {r.trend === "up" ? <ArrowUpRight size={12} className="text-white" /> : r.trend === "down" ? <ArrowDownRight size={12} className="text-white/40" /> : <Minus size={12} className="text-white/20" />}
                    <span className="text-white/40">{r.conversionRate || r.conversion_rate}% conv</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-4">
            <UserMinus size={16} className="text-white" />
            <h3 className="text-sm font-semibold text-white">Patient Drop-off Predictions</h3>
          </div>
          <div className="space-y-3">
            {dropoffs.map((d, i) => (
              <div key={d.name} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{d.name}</p>
                  <span className="text-xs font-bold text-white/60">{d.risk}% risk</span>
                </div>
                <p className="text-xs text-white/40 mb-2">Stage: {d.stage}</p>
                <p className="text-xs text-white/40">{d.reason}</p>
                <div className="h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full mt-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.risk}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }} className="h-full rounded-full bg-white" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-white" />
          <h3 className="text-sm font-semibold text-white">Growth Opportunity Engine</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growthOpportunities.map((opp, i) => (
            <motion.div key={opp.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }} className="pipeline-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{opp.title}</h4>
                <span className="badge badge-neutral">{opp.impact}</span>
              </div>
              <p className="text-xs text-[#908fa0] mb-3">{opp.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{opp.revenue}</span>
                <span className="text-xs text-white/40">{opp.confidence}% confidence</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
