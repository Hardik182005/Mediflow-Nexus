"use client";

import { motion } from "framer-motion";
import { Target, MessageSquare, Presentation, Calculator, Copy } from "lucide-react";

const icpData = {
  title: "Ideal Customer Profile",
  segments: [
    { label: "Organization Type", value: "Multi-specialty clinics & health systems" },
    { label: "Size", value: "5-50 providers, $2M-$50M annual revenue" },
    { label: "Pain Points", value: "High denial rates (>10%), manual PA processes, revenue leakage" },
    { label: "Technology", value: "EHR-integrated, cloud-ready, HIPAA compliant" },
    { label: "Geography", value: "United States, Urban & Suburban markets" },
    { label: "Decision Maker", value: "CTO, CMO, VP Operations, IT Director" },
  ],
};

const outreachMessages = [
  { buyer: "Dr. Catherine Wells", org: "Pacific Health Partners", subject: "Reducing Charting Time by 70% at Pacific Health", preview: "Hi Dr. Wells, I noticed Pacific Health Partners has been expanding its provider network. Our AI documentation solution has helped similar multi-specialty groups reduce charting time by 70%...", score: 88 },
  { buyer: "Mark Johnson", org: "Midwest Orthopedic Group", subject: "Automating Prior Auth for Orthopedic Practices", preview: "Hi Mark, With the volume of surgical authorizations at Midwest Orthopedic, I thought you'd be interested in how we've automated 90% of the PA process for similar practices...", score: 82 },
  { buyer: "Jennifer Liu", org: "Sunrise Health Network", subject: "Cutting Denial Rates by 55% with AI", preview: "Hi Jennifer, As CTO of a growing health network, you understand the impact of claim denials on revenue. Our predictive denial prevention platform has helped similar organizations...", score: 91 },
];

const pitches = [
  { buyer: "Pacific Health Partners", hook: "What if your providers could save 2 hours per day on documentation?", value: "AI-powered clinical documentation that learns each provider's style, integrating directly with your EHR to eliminate copy-paste charting.", metrics: ["70% less charting time", "35% more patient throughput", "99.2% accuracy rate"], roi: "$450K annual savings" },
  { buyer: "Midwest Orthopedic Group", hook: "What if prior authorizations took minutes instead of days?", value: "Automated PA detection, packet generation, and submission for orthopedic procedures — reducing delays and accelerating patient care.", metrics: ["90% PA automation", "60% faster approvals", "45% fewer denials"], roi: "$180K annual savings" },
];

export default function GTMPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">GTM Intelligence Engine</h1>
        <p className="text-sm text-surface-400 mt-1">ICP building, outreach generation & ROI calculators</p>
      </div>

      {/* ICP Builder */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-white">{icpData.title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {icpData.segments.map((seg) => (
            <div key={seg.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-blue-400 font-medium mb-1">{seg.label}</p>
              <p className="text-sm text-surface-200">{seg.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outreach Messages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-violet-400" />
            <h3 className="text-sm font-semibold text-white">AI Outreach Messages</h3>
          </div>
          <button className="btn-primary text-xs">Generate New</button>
        </div>
        <div className="space-y-3">
          {outreachMessages.map((msg, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{msg.subject}</p>
                  <p className="text-xs text-surface-400">To: {msg.buyer} at {msg.org}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400">{msg.score}% relevance</span>
                  <button className="btn-ghost p-1.5"><Copy size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-surface-300 line-clamp-2">{msg.preview}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Buyer-Specific Pitches */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
        <div className="flex items-center gap-2 mb-4">
          <Presentation size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Buyer-Specific Pitches</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pitches.map((pitch, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-blue-400 font-medium mb-1">For: {pitch.buyer}</p>
              <p className="text-sm font-semibold text-white mb-2">"{pitch.hook}"</p>
              <p className="text-xs text-surface-300 mb-3">{pitch.value}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {pitch.metrics.map(m => (
                  <span key={m} className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{m}</span>
                ))}
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-xs text-surface-300">Estimated ROI</span>
                <span className="text-sm font-bold text-emerald-400">{pitch.roi}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
