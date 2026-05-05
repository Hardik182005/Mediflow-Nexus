"use client";

import { useState } from "react";
import { Target, Search, BarChart3, Users, Zap, ArrowUpRight, ArrowDownRight, Layers, DollarSign, Plus, X, Loader2, Mail, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { AnimatePresence, motion } from "framer-motion";

const pipelineData = [
  { month: "Jan", leads: 40, qualified: 24, closed: 12 },
  { month: "Feb", leads: 55, qualified: 35, closed: 18 },
  { month: "Mar", leads: 70, qualified: 45, closed: 25 },
  { month: "Apr", leads: 90, qualified: 60, closed: 35 },
  { month: "May", leads: 110, qualified: 75, closed: 42 },
  { month: "Jun", leads: 130, qualified: 90, closed: 55 },
];

const defaultSequences = [
  { name: "Enterprise Clinics", type: "Email", status: "Running", progress: 68 },
  { name: "West Coast Payers", type: "LinkedIn", status: "Paused", progress: 45 },
  { name: "Q3 Expansion", type: "Multi", status: "Draft", progress: 0 },
  { name: "Churn Recovery", type: "Email", status: "Running", progress: 89 },
];

export default function LaunchEngine() {
  const [showSequences, setShowSequences] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [sequences, setSequences] = useState(defaultSequences);
  const [notification, setNotification] = useState("");

  // Campaign form state
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("Email");
  const [campaignTarget, setCampaignTarget] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleStartCampaign = async () => {
    if (!campaignName.trim()) return;
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSequences([
      { name: campaignName, type: campaignType, status: "Draft", progress: 0 },
      ...sequences,
    ]);
    setIsSaving(false);
    setShowCampaignModal(false);
    setCampaignName("");
    setCampaignType("Email");
    setCampaignTarget("");
    showToast(`🚀 Campaign "${campaignName}" created successfully!`);
  };

  const sequencesRef = () => {
    const el = document.getElementById("active-sequences");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-1", "ring-white/20");
      setTimeout(() => el.classList.remove("ring-1", "ring-white/20"), 2000);
    }
    setShowSequences(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-medium shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Launch Engine</h1>
          <p className="text-[13px] text-white/40 mt-1">Accelerate GTM and automate buyer discovery.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={sequencesRef} className="btn-secondary">View Sequences</button>
          <button onClick={() => setShowCampaignModal(true)} className="btn-primary flex items-center gap-2">
            <Zap size={14} />
            Start Campaign
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Campaigns", value: sequences.filter(s => s.status === "Running").length.toString(), change: "+2", icon: <Target size={16} />, positive: true },
          { title: "New Leads Found", value: "1,240", change: "+14.2%", icon: <Search size={16} />, positive: true },
          { title: "Conversion Rate", value: "8.4%", change: "-0.5%", icon: <BarChart3 size={16} />, positive: false },
          { title: "Pipeline Value", value: "$4.2M", change: "+$800k", icon: <DollarSign size={16} />, positive: true },
        ].map((kpi, i) => (
          <div key={i} className="glass-card kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white">
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                kpi.positive ? "text-white bg-white/10" : "text-white/40 bg-white/5"
              }`}>
                {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-white tracking-tight">{kpi.value}</h3>
            <p className="text-[12px] text-white/40 font-medium mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass-card lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-bold text-white">Pipeline Generation</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Lead to Close Velocity</p>
            </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                <span className="text-[11px] text-white/40 font-medium">Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <span className="text-[11px] text-white/40 font-medium">Qualified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <span className="text-[11px] text-white/40 font-medium">Leads</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                   <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="qualified" stackId="2" stroke="rgba(255,255,255,0.5)" strokeWidth={2} fill="url(#colorQual)" />
                <Area type="monotone" dataKey="closed" stackId="3" stroke="#ffffff" strokeWidth={2} fill="url(#colorClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Activity */}
        <div id="active-sequences" className="glass-card p-0 overflow-hidden flex flex-col transition-all duration-500">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-white">Active Sequences</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Outbound Status</p>
            </div>
            <button
              onClick={() => setCompactView(!compactView)}
              className={`btn-ghost p-1 transition-colors ${compactView ? "bg-white/10 text-white" : ""}`}
              title={compactView ? "Expand view" : "Compact view"}
            >
              <Layers size={14} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
             {sequences.map((seq, i) => (
                <div key={i} className={`pipeline-card mb-2 mx-2 ${compactView ? "py-2" : ""}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[13px] font-semibold text-white">{seq.name}</h4>
                      {!compactView && <p className="text-[11px] text-white/40 mt-0.5">{seq.type} Sequence</p>}
                    </div>
                   <span className="badge badge-neutral">{seq.status}</span>
                 </div>
                 {!compactView && (
                   <div className="space-y-1">
                     <div className="flex justify-between text-[10px] font-medium text-white/20 uppercase tracking-wider">
                       <span>Progress</span>
                       <span>{seq.progress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full bg-white" 
                         style={{ width: `${seq.progress}%` }}
                       ></div>
                     </div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Start Campaign Modal */}
      <AnimatePresence>
        {showCampaignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCampaignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Start New Campaign</h3>
                <button onClick={() => setShowCampaignModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Campaign Name *</label>
                  <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="input-field" placeholder="e.g. Q3 Hospital Outreach" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Channel Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Email", icon: <Mail size={14} /> },
                      { label: "LinkedIn", icon: <Users size={14} /> },
                      { label: "Multi", icon: <Globe size={14} /> },
                    ].map((ch) => (
                      <button
                        key={ch.label}
                        onClick={() => setCampaignType(ch.label)}
                        className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                          campaignType === ch.label
                            ? "bg-white text-black"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white"
                        }`}
                      >
                        {ch.icon} {ch.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Target Audience</label>
                  <input value={campaignTarget} onChange={(e) => setCampaignTarget(e.target.value)} className="input-field" placeholder="e.g. Multi-specialty clinics, 100+ beds" />
                </div>
              </div>
              <button
                onClick={handleStartCampaign}
                disabled={!campaignName.trim() || isSaving}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {isSaving ? "Creating..." : "Launch Campaign"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
