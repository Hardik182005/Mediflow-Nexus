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
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      clinicOpsKPIs: {
        patientsToday: 142,
        insuranceVerified: "94%",
        priorAuthsPending: 18,
        avgWaitTime: "14m",
      },
      patientIntakeFlow: intakeData,
      actionQueue: [
        { name: "S. Miller", status: "Missing Info", urgent: true },
        { name: "J. Doe", status: "Payer Review", urgent: true },
        { name: "A. Smith", status: "Appealed", urgent: false },
        { name: "M. Johnson", status: "Draft", urgent: false },
        { name: "K. Williams", status: "Draft", urgent: false },
      ],
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinic-ops-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      const blob = new Blob([JSON.stringify(intakeData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "patient-intake-flow.json";
      a.click();
      URL.revokeObjectURL(url);
      showToast("📊 Chart data exported!");
    } else if (action === "fullReport") {
      router.push("/reports");
    }
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
          <h1 className="text-[20px] font-bold text-white tracking-tight">Clinic Operations</h1>
          <p className="text-[13px] text-white/40 mt-1">Manage intake, verifications, and staff performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportData} className="btn-secondary flex items-center gap-2">
            <Download size={14} /> Export Data
          </button>
          <button onClick={() => setShowWorkflowModal(true)} className="btn-primary flex items-center gap-2">
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
              <h3 className="text-[14px] font-bold text-white">Patient Intake Flow</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Today's Volume</p>
            </div>
            <div className="relative">
              <button onClick={() => setShowChartMenu(!showChartMenu)} className="btn-ghost">
                <MoreHorizontal size={16} />
              </button>
              {showChartMenu && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-[#0d0d15] border border-white/[0.1] rounded-xl py-1 z-30 shadow-xl">
                  <button onClick={() => handleChartAction("fullReport")} className="w-full text-left px-4 py-2 text-xs text-white/60 hover:bg-white/[0.04] hover:text-white flex items-center gap-2">
                    <BarChart3 size={12} /> View Full Report
                  </button>
                  <button onClick={() => handleChartAction("refresh")} className="w-full text-left px-4 py-2 text-xs text-white/60 hover:bg-white/[0.04] hover:text-white flex items-center gap-2">
                    <RefreshCw size={12} /> Refresh Data
                  </button>
                  <button onClick={() => handleChartAction("export")} className="w-full text-left px-4 py-2 text-xs text-white/60 hover:bg-white/[0.04] hover:text-white flex items-center gap-2">
                    <Download size={12} /> Export Chart
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intakeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }}
                />
                <Bar dataKey="patients" radius={[4, 4, 0, 0]} barSize={32} fill="url(#barGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auth Queue */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-white">Action Required</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Pending Auths</p>
            </div>
            <span className="badge badge-neutral">4 Urgent</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "S. Miller", status: "Missing Info", urgent: true },
                  { name: "J. Doe", status: "Payer Review", urgent: true },
                  { name: "A. Smith", status: "Appealed", urgent: false },
                  { name: "M. Johnson", status: "Draft", urgent: false },
                  { name: "K. Williams", status: "Draft", urgent: false },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <span className={`badge ${item.urgent ? 'badge-neutral' : 'badge-neutral opacity-40'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => router.push("/clinic-ops/prior-auth")}
                        className="text-white/60 hover:text-white font-semibold text-[11px] transition-colors"
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

      {/* New Workflow Modal */}
      <AnimatePresence>
        {showWorkflowModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWorkflowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Create New Workflow</h3>
                <button onClick={() => setShowWorkflowModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Workflow Name *</label>
                  <input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} className="input-field" placeholder="e.g. Insurance Pre-Check" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Type</label>
                  <select value={workflowType} onChange={(e) => setWorkflowType(e.target.value)} className="input-field bg-[#0d0d15]">
                    {["Prior Authorization", "Insurance Verification", "Patient Intake", "Denial Management", "Billing Review"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setWorkflowPriority(p)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          workflowPriority === p
                            ? "bg-white text-black"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white"
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
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isSaving ? "Creating..." : "Create Workflow"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
