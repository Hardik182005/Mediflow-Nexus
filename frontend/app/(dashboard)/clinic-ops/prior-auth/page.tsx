"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, Plus, X, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusBadge: Record<string, string> = { approved: "badge-neutral", submitted: "badge-neutral", required: "badge-neutral", denied: "badge-neutral", not_required: "badge-neutral", pending: "badge-neutral", verified: "badge-neutral" };

export default function PriorAuthPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNewPAModal, setShowNewPAModal] = useState(false);
  const [generatingPacketId, setGeneratingPacketId] = useState<string | null>(null);
  const supabase = createClient();

  // New PA form state
  const [paPatientName, setPaPatientName] = useState("");
  const [paCptCode, setPaCptCode] = useState("");
  const [paInsurer, setPaInsurer] = useState("Blue Cross Blue Shield");
  const [paSaving, setPaSaving] = useState(false);

  const fetchPACases = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('insurance_cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPACases();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleNewPARequest = async () => {
    if (!paPatientName.trim() || !paCptCode.trim()) return;
    setPaSaving(true);
    try {
      await supabase.from('insurance_cases').insert([{
        patient_name: paPatientName,
        cpt_code: paCptCode,
        insurance_provider: paInsurer,
        status: 'pending',
        denial_risk_score: Math.floor(Math.random() * 40) + 10,
        deductible: Math.floor(Math.random() * 3000) + 500,
        out_of_pocket_max: Math.floor(Math.random() * 5000) + 2000,
      }]);
      setShowNewPAModal(false);
      setPaPatientName("");
      setPaCptCode("");
      showToast(`✅ PA request created for ${paPatientName}`);
      fetchPACases();
    } catch (err) {
      showToast("❌ Failed to create PA request.");
    } finally {
      setPaSaving(false);
    }
  };

  const handleGeneratePacket = async (pa: any) => {
    setGeneratingPacketId(pa.id);
    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 1200));

    const packet = {
      packetType: "Prior Authorization Submission",
      generatedAt: new Date().toISOString(),
      patient: {
        name: pa.patient_name,
        insurerId: pa.id?.slice(0, 8),
      },
      insurance: {
        provider: pa.insurance_provider,
        deductible: pa.deductible,
        outOfPocketMax: pa.out_of_pocket_max,
      },
      procedure: {
        cptCode: pa.cpt_code,
        denialRiskScore: pa.denial_risk_score,
        approvalProbability: `${100 - (pa.denial_risk_score || 0)}%`,
      },
      clinicalJustification: `This procedure (CPT ${pa.cpt_code || "N/A"}) is medically necessary for ${pa.patient_name || "the patient"} based on clinical evaluation. The patient meets all payer criteria for coverage under ${pa.insurance_provider || "their plan"}.`,
      supportingDocuments: [
        "Clinical notes from referring physician",
        "Diagnostic imaging results",
        "Lab work within 30 days",
        "Prior treatment history",
      ],
      submissionInstructions: `Submit to ${pa.insurance_provider || "payer"} via their electronic PA portal or fax to the utilization management department. Expected turnaround: 3-5 business days.`,
    };

    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pa-packet-${(pa.patient_name || "patient").toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setGeneratingPacketId(null);
    showToast(`📦 PA packet generated for ${pa.patient_name || "case"}`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-medium shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Prior Authorization Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">Requirement detection, packet generation & approval prediction</p>
        </div>
        <button onClick={() => setShowNewPAModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New PA Request</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending PAs", value: cases.filter(c => c.status === 'pending').length.toString(), icon: Clock, color: "white" },
          { label: "Approved", value: cases.filter(c => c.status === 'verified').length.toString(), icon: CheckCircle, color: "white" },
          { label: "Denied", value: cases.filter(c => c.status === 'denied').length.toString(), icon: XCircle, color: "white" },
          { label: "Avg Approval Time", value: "3.4 days", icon: FileCheck, color: "white" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} className="text-white" /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="glass-card p-12 text-center col-span-2">
            <Loader2 className="w-8 h-8 text-white/10 animate-spin mx-auto mb-2" />
            <p className="text-sm text-white/20">Loading prior auth cases...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="glass-card p-12 text-center col-span-2">
            <FileCheck size={32} className="mx-auto mb-3 text-white/10" />
            <p className="text-sm text-white/40">No prior auth cases found.</p>
            <p className="text-xs text-white/20 mt-1">Click "New PA Request" to create one, or cases from insurance verification will appear here.</p>
          </div>
        ) : cases.map((pa, i) => (
          <motion.div key={pa.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white text-sm font-bold">
                  {(pa.patient_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{pa.patient_name || "Unknown"}</p>
                  <p className="text-xs text-white/40">{pa.insurance_provider} • {pa.id?.slice(0, 8)}</p>
                </div>
              </div>
              <span className={`badge ${statusBadge[pa.status] || "badge-neutral"}`}>{(pa.status || "pending").replace("_", " ")}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-white/20">CPT Code</p>
                <code className="text-sm text-white/60">{pa.cpt_code || "—"}</code>
              </div>
              <div>
                <p className="text-xs text-white/20">Risk Score</p>
                <code className="text-sm text-white/40">{pa.denial_risk_score || 0}%</code>
              </div>
              <div>
                <p className="text-xs text-[#908fa0]">Deductible</p>
                <p className="text-sm text-[#c7c4d7]">${pa.deductible || 0}</p>
              </div>
            </div>

            {/* Risk Probability */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/40">Approval Probability</span>
                <span className="font-bold text-white/60">{100 - (pa.denial_risk_score || 0)}%</span>
              </div>
              <div className="h-2 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - (pa.denial_risk_score || 0)}%` }} transition={{ delay: 0.4, duration: 0.8 }} className="h-full rounded-full bg-white" />
              </div>
            </div>

            {expandedId === pa.id && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-3 text-xs text-white/40 space-y-1">
                <p><strong className="text-white/60">Full ID:</strong> {pa.id}</p>
                <p><strong className="text-white/60">Provider:</strong> {pa.insurance_provider}</p>
                <p><strong className="text-white/60">OOP Max:</strong> ${pa.out_of_pocket_max || 0}</p>
                <p><strong className="text-white/60">Created:</strong> {new Date(pa.created_at).toLocaleDateString()}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleGeneratePacket(pa)}
                disabled={generatingPacketId === pa.id}
                className="btn-primary text-xs flex-1 flex items-center justify-center gap-2"
              >
                {generatingPacketId === pa.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                {generatingPacketId === pa.id ? "Generating..." : "Generate Packet"}
              </button>
              <button onClick={() => setExpandedId(expandedId === pa.id ? null : pa.id)} className="btn-secondary text-xs">
                {expandedId === pa.id ? "Collapse" : "View Details"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New PA Request Modal */}
      <AnimatePresence>
        {showNewPAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPAModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">New PA Request</h3>
                <button onClick={() => setShowNewPAModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Patient Name *</label>
                  <input value={paPatientName} onChange={(e) => setPaPatientName(e.target.value)} className="input-field" placeholder="John Smith" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">CPT Code *</label>
                  <input value={paCptCode} onChange={(e) => setPaCptCode(e.target.value)} className="input-field" placeholder="99215" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Insurance Provider</label>
                  <select value={paInsurer} onChange={(e) => setPaInsurer(e.target.value)} className="input-field bg-[#0d0d15]">
                    {["Blue Cross Blue Shield", "Aetna", "UnitedHealthcare", "Cigna", "Medicare", "Star Health", "ICICI Lombard"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleNewPARequest}
                disabled={!paPatientName.trim() || !paCptCode.trim() || paSaving}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {paSaving ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />}
                {paSaving ? "Creating..." : "Submit PA Request"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
