"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, DollarSign, TrendingUp, Calendar, ArrowRight, Loader2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

const stages = ["lead", "meeting", "demo", "proposal", "negotiation", "closed_won", "closed_lost"];
const stageLabels: Record<string, string> = { lead: "Lead", meeting: "Meeting", demo: "Demo", proposal: "Proposal", negotiation: "Negotiation", closed_won: "Won", closed_lost: "Lost" };
const stageColors: Record<string, string> = { lead: "border-t-white/10", meeting: "border-t-white/20", demo: "border-t-white/30", proposal: "border-t-white/40", negotiation: "border-t-white/50", closed_won: "border-t-white", closed_lost: "border-t-white/5" };

export default function SalesPipelinePage() {
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ buyer_name: "", buyer_organization: "", deal_value: "", stage: "lead", win_probability: "50", next_action: "" });
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const fetchPipeline = async () => {
    setLoading(true);
    const { data } = await supabase.from('sales_pipeline').select('*').order('created_at', { ascending: false });
    if (data) {
      setPipeline(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPipeline(); }, []);

  const handleAddDeal = async () => {
    if (!newDeal.buyer_name.trim() || !newDeal.deal_value) return;
    setIsSaving(true);
    await supabase.from('sales_pipeline').insert([{
      buyer_name: newDeal.buyer_name,
      buyer_organization: newDeal.buyer_organization,
      deal_value: parseInt(newDeal.deal_value),
      stage: newDeal.stage,
      win_probability: parseInt(newDeal.win_probability),
      next_action: newDeal.next_action,
    }]);
    setIsSaving(false);
    setShowAddModal(false);
    setNewDeal({ buyer_name: "", buyer_organization: "", deal_value: "", stage: "lead", win_probability: "50", next_action: "" });
    fetchPipeline();
  };

  const activeStages = stages.filter(s => pipeline.some(d => d.stage === s));
  const totalValue = pipeline.reduce((a, d) => a + (d.deal_value || 0), 0);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-white/10 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-sm text-white/40 mt-1">Deal tracking, stage progression & win probability</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Deal</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pipeline", value: formatCurrency(totalValue), icon: DollarSign },
          { label: "Avg Deal Size", value: formatCurrency(pipeline.length ? totalValue / pipeline.length : 0), icon: TrendingUp },
          { label: "Avg Win Rate", value: `${pipeline.length ? Math.round(pipeline.reduce((a, d) => a + (d.win_probability || 0), 0) / pipeline.length) : 0}%`, icon: BarChart3 },
          { label: "Active Deals", value: pipeline.filter(d => !d.stage?.startsWith("closed")).length.toString(), icon: Calendar },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} className="text-white" /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        {activeStages.length > 0 ? (
          activeStages.map((stage, si) => {
            const deals = pipeline.filter(d => d.stage === stage);
            return (
              <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + si * 0.05 }} className={`min-w-[300px] flex-shrink-0 rounded-xl bg-white/[0.03] border border-white/[0.06] border-t-2 ${stageColors[stage] || "border-t-white/10"}`}>
                <div className="p-3 border-b border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{stageLabels[stage]}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60">{deals.length}</span>
                  </div>
                  <p className="text-xs text-white/20 mt-0.5">{formatCurrency(deals.reduce((a, d) => a + (d.deal_value || 0), 0))} total</p>
                </div>
                <div className="p-3 space-y-3">
                  {deals.map((deal, di) => (
                    <motion.div key={deal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + di * 0.05 }} className="pipeline-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{deal.buyer_name}</p>
                        <span className="text-xs font-bold text-white/80">{deal.win_probability}%</span>
                      </div>
                      <p className="text-xs text-white/40 mb-2">{deal.buyer_organization}</p>
                      <p className="text-sm font-semibold text-white mb-2">{formatCurrency(deal.deal_value)}</p>
                      <div className="h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full bg-white" style={{ width: `${deal.win_probability}%` }} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <ArrowRight size={10} />
                        <span>{deal.next_action}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
            <BarChart3 size={40} className="text-white/10 mb-4" />
            <h3 className="text-sm font-semibold text-white">No active deals</h3>
            <p className="text-xs text-white/30 mt-1">Add a deal to start tracking your pipeline.</p>
            <button onClick={() => setShowAddModal(true)} className="mt-4 btn-secondary text-xs">Add First Deal</button>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Add New Deal</h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div><label className="text-xs text-white/60 mb-1 block">Buyer Name *</label><input value={newDeal.buyer_name} onChange={(e) => setNewDeal({ ...newDeal, buyer_name: e.target.value })} className="input-field" placeholder="Dr. Jane Smith" /></div>
                <div><label className="text-xs text-white/60 mb-1 block">Organization</label><input value={newDeal.buyer_organization} onChange={(e) => setNewDeal({ ...newDeal, buyer_organization: e.target.value })} className="input-field" placeholder="Pacific Health Partners" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-white/60 mb-1 block">Deal Value ($) *</label><input type="number" value={newDeal.deal_value} onChange={(e) => setNewDeal({ ...newDeal, deal_value: e.target.value })} className="input-field" placeholder="250000" /></div>
                  <div><label className="text-xs text-white/60 mb-1 block">Win Probability (%)</label><input type="number" value={newDeal.win_probability} onChange={(e) => setNewDeal({ ...newDeal, win_probability: e.target.value })} className="input-field" /></div>
                </div>
                <div><label className="text-xs text-white/60 mb-1 block">Stage</label>
                  <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} className="input-field bg-[#0d0d15]">
                    {stages.filter(s => s !== "closed_lost").map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-white/60 mb-1 block">Next Action</label><input value={newDeal.next_action} onChange={(e) => setNewDeal({ ...newDeal, next_action: e.target.value })} className="input-field" placeholder="Schedule demo call" /></div>
              </div>
              <button onClick={handleAddDeal} disabled={!newDeal.buyer_name.trim() || !newDeal.deal_value || isSaving} className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isSaving ? "Saving..." : "Add Deal to Pipeline"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
