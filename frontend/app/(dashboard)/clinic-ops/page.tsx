"use client";

import { useState } from "react";
import { Building2, FileCheck, ShieldAlert, Users, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download, RefreshCw, BarChart3, X, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const intakeData = [
  { time: "08:00", patients: 12 },
  { time: "10:00", patients: 24 },
  { time: "12:00", patients: 18 },
  { time: "14:00", patients: 32 },
  { time: "16:00", patients: 15 },
  { time: "18:00", patients: 8 },
];

export default function ClinicOps() {
  const router = useRouter();
  const [notification, setNotification] = useState("");
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowType, setWorkflowType] = useState("Prior Authorization");
  const [workflowPriority, setWorkflowPriority] = useState("Medium");
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleExportData = () => {
    showToast("📥 Clinic Ops data exported successfully!");
  };

  const handleAddWorkflow = async () => {
    if (!workflowName.trim()) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setShowWorkflowModal(false);
    setWorkflowName("");
    showToast(`✅ Workflow "${workflowName}" created!`);
  };

  const handleChartAction = (action: string) => {
    setShowChartMenu(false);
    if (action === "refresh") {
      showToast("🔄 Patient intake data refreshed.");
    } else if (action === "export") {
      showToast("📊 Chart data exported!");
    } else if (action === "fullReport") {
      router.push("/reports");
    }
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
          <h1 className="text-[24px] font-bold text-black tracking-tight font-serif">Clinic Operations</h1>
          <p className="text-[13px] text-black/40 font-medium">Manage intake, verifications, and staff performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportData} className="bg-white border border-black/10 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/5 transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} /> Export Data
          </button>
          <button onClick={() => setShowWorkflowModal(true)} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-all flex items-center gap-2 shadow-lg">
            <Plus size={14} />
            New Workflow
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Patients Today", value: "142", change: "+12", icon: <Users size={16} />, positive: true },
          { title: "Insurance Verified", value: "94%", change: "+2.1%", icon: <ShieldAlert size={16} />, positive: true },
          { title: "Prior Auths Pending", value: "18", change: "-4", icon: <FileCheck size={16} />, positive: true },
          { title: "Avg Wait Time", value: "14m", change: "+2m", icon: <Building2 size={16} />, positive: false },
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
              <h3 className="text-[16px] font-bold text-black font-serif">Patient Intake Flow</h3>
              <p className="text-[11px] text-black/40 uppercase tracking-widest font-bold mt-1">Today's Volume</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowChartMenu(!showChartMenu)} className="p-2 rounded-lg hover:bg-black/5 text-black/40 transition-colors">
                <MoreHorizontal size={18} />
              </button>
              {showChartMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-2xl py-2 z-30 shadow-2xl overflow-hidden">
                  <button onClick={() => handleChartAction("fullReport")} className="w-full text-left px-4 py-2.5 text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black flex items-center gap-2">
                    <BarChart3 size={14} /> View Full Report
                  </button>
                  <button onClick={() => handleChartAction("refresh")} className="w-full text-left px-4 py-2.5 text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black flex items-center gap-2">
                    <RefreshCw size={14} /> Refresh Data
                  </button>
                  <button onClick={() => handleChartAction("export")} className="w-full text-left px-4 py-2.5 text-xs font-bold text-black/60 hover:bg-black/5 hover:text-black flex items-center gap-2 border-t border-black/[0.05]">
                    <Download size={14} /> Export Chart
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intakeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: '#000000', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="patients" radius={[6, 6, 0, 0]} barSize={40} fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auth Queue */}
        <div className="bg-white border border-black/[0.05] rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-black/[0.05] flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-black">Action Required</h3>
              <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest mt-1">Pending Auths</p>
            </div>
            <div className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase">4 Urgent</div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/[0.05]">
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-black/40 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {[
                  { name: "S. Miller", status: "Missing Info", urgent: true },
                  { name: "J. Doe", status: "Payer Review", urgent: true },
                  { name: "A. Smith", status: "Appealed", urgent: false },
                  { name: "M. Johnson", status: "Draft", urgent: false },
                  { name: "K. Williams", status: "Draft", urgent: false },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 text-[13px] font-bold text-black">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${item.urgent ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push("/clinic-ops/prior-auth")}
                        className="text-black hover:underline font-bold text-[11px] uppercase tracking-tighter"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Workflow Modal */}
      <AnimatePresence>
        {showWorkflowModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWorkflowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black font-serif">New Workflow</h3>
                <button onClick={() => setShowWorkflowModal(false)} className="text-black/30 hover:text-black"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Workflow Name</label>
                  <input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5" placeholder="e.g. Insurance Pre-Check" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Category</label>
                  <select value={workflowType} onChange={(e) => setWorkflowType(e.target.value)} className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none">
                    {["Prior Authorization", "Insurance Verification", "Patient Intake", "Denial Management", "Billing Review"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Priority Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setWorkflowPriority(p)}
                        className={`py-3 rounded-xl text-[12px] font-bold transition-all border ${
                          workflowPriority === p
                            ? "bg-black text-white border-black"
                            : "bg-white border-black/10 text-black/40 hover:text-black hover:border-black/20"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddWorkflow}
                disabled={!workflowName.trim() || isSaving}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[14px] shadow-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {isSaving ? "Creating Workflow..." : "Create New Workflow"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
