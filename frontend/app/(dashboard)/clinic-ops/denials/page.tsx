"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Shield, FileText, DollarSign, TrendingDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

const statusBadge: Record<string, string> = { predicted: "badge-neutral", denied: "badge-neutral", appealed: "badge-neutral", overturned: "badge-neutral", upheld: "badge-neutral" };

export default function DenialsPage() {
  const [denials, setDenials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchDenials = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('insurance_cases')
        .select('*')
        .or('status.eq.denied,denial_risk_score.gt.50')
        .order('created_at', { ascending: false });
      if (data) setDenials(data);
      setLoading(false);
    };
    fetchDenials();
  }, []);

  const denialsByReason = [
    { reason: "Missing Documentation", count: 45, amount: 128000 },
    { reason: "Coding Errors", count: 38, amount: 95000 },
    { reason: "Auth Not Obtained", count: 29, amount: 87000 },
    { reason: "Not Medically Necessary", count: 22, amount: 72000 },
    { reason: "Timely Filing", count: 15, amount: 42000 },
    { reason: "Duplicate Claims", count: 11, amount: 28000 },
  ];

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const [generatingAppealId, setGeneratingAppealId] = useState<string | null>(null);

  const handleGenerateAppeal = async (denial?: any) => {
    const patientName = denial?.patient_name || "selected case";
    const caseId = denial?.id || "header";
    setGeneratingAppealId(caseId);

    // Simulate AI generation time
    await new Promise((r) => setTimeout(r, 1200));

    const appeal = {
      documentType: "Insurance Denial Appeal Letter",
      generatedAt: new Date().toISOString(),
      patient: {
        name: patientName,
        caseId: denial?.id || "N/A",
        cptCode: denial?.cpt_code || "N/A",
      },
      insurer: denial?.insurance_provider || "Unknown Insurer",
      denialReason: denial?.denial_reason || "Not specified",
      riskScore: denial?.denial_risk_score || 0,
      claimAmount: denial?.claim_amount || 0,
      appealBody: `Dear ${denial?.insurance_provider || "Claims Department"},\n\nI am writing to formally appeal the denial of coverage for ${patientName} (Case ID: ${denial?.id?.slice(0, 8) || "N/A"}, CPT Code: ${denial?.cpt_code || "N/A"}).\n\nThe procedure was deemed medically necessary by the treating physician based on the patient's clinical presentation, diagnostic findings, and established medical guidelines.\n\nDenial Reason Cited: ${denial?.denial_reason || "Not specified"}\n\nWe respectfully disagree with this determination and submit the following supporting documentation:\n1. Updated clinical notes from the treating physician\n2. Relevant diagnostic imaging and lab results\n3. Published medical literature supporting medical necessity\n4. Peer-reviewed guidelines from relevant specialty societies\n\nWe request a prompt review and reversal of this denial determination.\n\nSincerely,\nMediFlow Nexus Revenue Cycle Team`,
      nextSteps: [
        "Attach supporting clinical documentation",
        "Submit within 60 days of denial notice",
        "Request expedited review if urgent",
        "Follow up within 30 business days",
      ],
    };

    const blob = new Blob([JSON.stringify(appeal, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appeal-${patientName.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setGeneratingAppealId(null);
    showToast(`✨ Appeal letter generated for ${patientName}`);
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
          <h1 className="text-2xl font-bold text-white">Denial Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">Prediction, analysis, fix recommendations & auto-appeals</p>
        </div>
        <button onClick={() => handleGenerateAppeal()} disabled={generatingAppealId === 'header'} className="btn-primary flex items-center gap-2">
          {generatingAppealId === 'header' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {generatingAppealId === 'header' ? 'Generating...' : 'Generate Appeal'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Denials", value: denials.length.toString(), icon: AlertTriangle, color: "white" },
          { label: "At Risk Amount", value: "$47.2K", icon: DollarSign, color: "white" },
          { label: "Appeals Pending", value: "6", icon: Shield, color: "white" },
          { label: "Overturn Rate", value: "62%", icon: TrendingDown, color: "white" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-white/40">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denial by Reason Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Denials by Reason</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={denialsByReason} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ background: "black", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="white" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Denial Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="glass-card p-12 text-center">
              <Loader2 className="w-8 h-8 text-white/10 animate-spin mx-auto mb-2" />
              <p className="text-sm text-white/20">Loading denial data...</p>
            </div>
          ) : denials.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Shield size={32} className="mx-auto mb-3 text-white/10" />
              <p className="text-sm text-white/40">No active denials found.</p>
              <p className="text-xs text-white/20 mt-1">Denials from insurance cases will appear here.</p>
            </div>
          ) : denials.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">{d.patient_name || "Patient"}</p>
                  <p className="text-xs text-white/40">{d.insurance_provider} • CPT {d.cpt_code}</p>
                </div>
                <span className={`badge ${statusBadge[d.status] || "badge-neutral"}`}>{d.status}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-white/60">{d.denial_reason || "Review required"}</p>
                <p className="text-sm font-bold text-white">{formatCurrency(d.claim_amount || 0)}</p>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">Risk Score</span>
                  <span className="text-white font-bold">{d.denial_risk_score || 0}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-white" style={{ width: `${d.denial_risk_score || 0}%` }} />
                </div>
              </div>
              {expandedId === d.id && (
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] mb-3 text-xs text-white/40 space-y-1">
                  <p><strong className="text-white/60">Case ID:</strong> {d.id}</p>
                  <p><strong className="text-white/60">Provider:</strong> {d.insurance_provider}</p>
                  <p><strong className="text-white/60">Deductible:</strong> {formatCurrency(d.deductible || 0)}</p>
                  <p><strong className="text-white/60">Created:</strong> {new Date(d.created_at).toLocaleDateString()}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleGenerateAppeal(d)} disabled={generatingAppealId === d.id} className="btn-primary text-xs flex-1 flex items-center justify-center gap-2">
                  {generatingAppealId === d.id ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
                  {generatingAppealId === d.id ? 'Generating...' : 'Generate Appeal'}
                </button>
                <button onClick={() => setExpandedId(expandedId === d.id ? null : d.id)} className="btn-secondary text-xs">
                  {expandedId === d.id ? "Collapse" : "View Details"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
