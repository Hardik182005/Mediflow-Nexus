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
    await new Promise((r) => setTimeout(r, 800));
    setSequences([
      { name: campaignName, type: campaignType, status: "Draft", progress: 0 },
      ...sequences,
    ]);
    setIsSaving(false);
    setShowCampaignModal(false);
    setCampaignName("");
    showToast(`🚀 Campaign "${campaignName}" created successfully!`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans">
      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-black text-white text-sm font-bold shadow-2xl animate-fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight font-serif">Launch Engine</h1>
          <p className="text-[13px] text-black/40 font-medium">Accelerate GTM and automate buyer discovery.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-black/10 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/5 transition-all shadow-sm">View Sequences</button>
          <button onClick={() => setShowCampaignModal(true)} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-all flex items-center gap-2 shadow-lg">
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
          <div key={i} className="bg-white border border-black/[0.05] rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-black text-white">
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                kpi.positive ? "text-black bg-black/5" : "text-black/40 bg-black/[0.02]"
              }`}>
                {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-black tracking-tight">{kpi.value}</h3>
            <p className="text-[12px] text-black/40 font-bold uppercase tracking-wider mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white border border-black/[0.05] rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-bold text-black font-serif">Pipeline Generation</h3>
              <p className="text-[11px] text-black/40 uppercase tracking-widest font-bold mt-1">Lead to Close Velocity</p>
            </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                <span className="text-[11px] text-black/60 font-bold">Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black/40"></div>
                <span className="text-[11px] text-black/60 font-bold">Qualified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black/10"></div>
                <span className="text-[11px] text-black/60 font-bold">Leads</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: '#000000', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="rgba(0,0,0,0.1)" strokeWidth={2} fill="rgba(0,0,0,0.02)" />
                <Area type="monotone" dataKey="qualified" stackId="2" stroke="rgba(0,0,0,0.3)" strokeWidth={2} fill="rgba(0,0,0,0.05)" />
                <Area type="monotone" dataKey="closed" stackId="3" stroke="#000000" strokeWidth={2} fill="rgba(0,0,0,0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Activity */}
        <div id="active-sequences" className="bg-white border border-black/[0.05] rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-black/[0.05] flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-black">Active Sequences</h3>
              <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest mt-1">Outbound Status</p>
            </div>
            <button
              onClick={() => setCompactView(!compactView)}
              className={`p-2 rounded-lg hover:bg-black/5 text-black/40 transition-colors ${compactView ? "bg-black text-white" : ""}`}
            >
              <Layers size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {sequences.map((seq, i) => (
                <div key={i} className={`bg-black/[0.02] border border-black/[0.05] rounded-2xl p-4 transition-all ${compactView ? "py-2" : ""}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[13px] font-bold text-black">{seq.name}</h4>
                      {!compactView && <p className="text-[11px] text-black/40 font-bold uppercase mt-0.5 tracking-tight">{seq.type} Sequence</p>}
                    </div>
                   <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">{seq.status}</span>
                 </div>
                 {!compactView && (
                   <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-bold text-black/40 uppercase tracking-widest">
                       <span>Progress</span>
                       <span>{seq.progress}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full rounded-full bg-black" 
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCampaignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black font-serif">Launch Campaign</h3>
                <button onClick={() => setShowCampaignModal(false)} className="text-black/30 hover:text-black"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Campaign Name</label>
                  <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="e.g. Q3 Hospital Outreach" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Channel</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Email", icon: <Mail size={14} /> },
                      { label: "LinkedIn", icon: <Users size={14} /> },
                      { label: "Multi", icon: <Globe size={14} /> },
                    ].map((ch) => (
                      <button
                        key={ch.label}
                        onClick={() => setCampaignType(ch.label)}
                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold transition-all border ${
                          campaignType === ch.label
                            ? "bg-black text-white border-black"
                            : "bg-white border-black/10 text-black/40 hover:text-black hover:border-black/20"
                        }`}
                      >
                        {ch.icon} {ch.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Target Audience</label>
                  <input value={campaignTarget} onChange={(e) => setCampaignTarget(e.target.value)} className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="e.g. Multi-specialty clinics" />
                </div>
              </div>
              <button
                onClick={handleStartCampaign}
                disabled={!campaignName.trim() || isSaving}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[14px] shadow-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {isSaving ? "Launching..." : "Launch Campaign"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
