"use client";

import { motion } from "framer-motion";
import { BarChart3, DollarSign, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { salesPipeline } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const stages = ["lead", "meeting", "demo", "proposal", "negotiation", "closed_won", "closed_lost"];
const stageLabels: Record<string, string> = { lead: "Lead", meeting: "Meeting", demo: "Demo", proposal: "Proposal", negotiation: "Negotiation", closed_won: "Won", closed_lost: "Lost" };
const stageColors: Record<string, string> = { lead: "border-t-white/10", meeting: "border-t-white/20", demo: "border-t-white/30", proposal: "border-t-white/40", negotiation: "border-t-white/50", closed_won: "border-t-white", closed_lost: "border-t-white/5" };
const stageBg: Record<string, string> = { lead: "bg-white/5", meeting: "bg-white/5", demo: "bg-white/5", proposal: "bg-white/5", negotiation: "bg-white/5", closed_won: "bg-white/10", closed_lost: "bg-white/5" };

export default function SalesPipelinePage() {
  const activeStages = stages.filter(s => salesPipeline.some(d => d.stage === s));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-sm text-white/40 mt-1">Deal tracking, stage progression & win probability</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><BarChart3 size={16} /> Add Deal</button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pipeline", value: formatCurrency(salesPipeline.reduce((a, d) => a + d.dealValue, 0)), icon: DollarSign, color: "white" },
          { label: "Avg Deal Size", value: formatCurrency(salesPipeline.reduce((a, d) => a + d.dealValue, 0) / salesPipeline.length), icon: TrendingUp, color: "white" },
          { label: "Avg Win Rate", value: `${Math.round(salesPipeline.reduce((a, d) => a + d.winProbability, 0) / salesPipeline.length)}%`, icon: BarChart3, color: "white" },
          { label: "Active Deals", value: salesPipeline.filter(d => !d.stage.startsWith("closed")).length.toString(), icon: Calendar, color: "white" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {activeStages.map((stage, si) => {
          const deals = salesPipeline.filter(d => d.stage === stage);
          return (
            <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + si * 0.05 }} className={`min-w-[300px] flex-shrink-0 rounded-xl bg-white/[0.03] border border-white/[0.06] border border-white/[0.04] border-t-2 ${stageColors[stage]}`}>
              <div className="p-3 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{stageLabels[stage]}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${stageBg[stage]} text-white/60`}>{deals.length}</span>
                </div>
                <p className="text-xs text-white/20 mt-0.5">{formatCurrency(deals.reduce((a, d) => a + d.dealValue, 0))} total</p>
              </div>
              <div className="p-3 space-y-3">
                {deals.map((deal, di) => (
                  <motion.div key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + di * 0.05 }} className="pipeline-card">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">{deal.buyerName}</p>
                      <span className="text-xs font-bold text-white/80">{deal.winProbability}%</span>
                    </div>
                    <p className="text-xs text-white/40 mb-2">{deal.buyerOrganization}</p>
                    <p className="text-sm font-semibold text-white mb-2">{formatCurrency(deal.dealValue)}</p>
                    <div className="h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-white" style={{ width: `${deal.winProbability}%` }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <ArrowRight size={10} />
                      <span>{deal.nextAction}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

