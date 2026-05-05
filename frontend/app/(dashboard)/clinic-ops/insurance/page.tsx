"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Loader2, Brain } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VOBInputPanel from "@/components/vob-input-panel";
import VOBResults from "@/components/vob-results";
import type { VOBReport } from "@/types/vob";
import type { VOBInput } from "@/types/vob";
import { formatCurrency } from "@/lib/utils";

type Tab = "records" | "analyzer";
type Phase = "input" | "loading" | "result" | "error";

export default function InsurancePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("records");
  const [phase, setPhase] = useState<Phase>("input");
  const [report, setReport] = useState<VOBReport | null>(null);
  const [error, setError] = useState("");
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: caseData } = await supabase
      .from('insurance_cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (caseData) setCases(caseData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'denied': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const handleGenerate = async (inputs: VOBInput[]) => {
    setPhase("loading");
    try {
      const res = await fetch("/api/clinic/vob/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: inputs.map(i => ({ type: i.type, content: i.content })) }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
        setPhase("result");
        fetchData();
      } else {
        setError(data.error || "Analysis failed. Please try again.");
        setPhase("error");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setPhase("error");
    }
  };

  const handleReset = () => {
    setPhase("input");
    setReport(null);
    setError("");
  };

  const stats = [
    { label: "Total Cases", value: cases.length.toString(), icon: ShieldCheck },
    { label: "Verified", value: cases.filter(c => c.status === 'verified').length.toString(), icon: CheckCircle2 },
    { label: "Pending", value: cases.filter(c => c.status === 'pending').length.toString(), icon: Clock },
    { label: "Denied", value: cases.filter(c => c.status === 'denied').length.toString(), icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Insurance Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">AI-powered VOB analysis, verification & denial prediction</p>
        </div>
        <button onClick={() => setTab("analyzer")} className="btn-primary flex items-center gap-2">
          <Brain size={15} /> AI Analyzer
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                <s.icon size={18} className="text-white/60" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
        {(["records", "analyzer"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
              tab === t ? "bg-white text-black" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t === "analyzer" ? "🧠 AI Analyzer" : "📋 VOB Records"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Records Tab */}
        {tab === "records" && (
          <motion.div key="records" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass-card-static overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>CPT</th>
                      <th>Status</th>
                      <th>Provider</th>
                      <th>Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20">
                          <Loader2 className="w-8 h-8 text-white/10 animate-spin mx-auto mb-2" />
                          <p className="text-xs text-white/20">Loading insurance cases...</p>
                        </td>
                      </tr>
                    ) : cases.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-20 text-white/20 italic text-sm">
                          No active insurance cases. Start an AI VOB analysis to generate records.
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {cases.map((c, i) => (
                          <motion.tr
                            key={c.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * i }}
                            className="group cursor-pointer"
                          >
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-white transition-colors">
                                  {(c.patient_name || "?")[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{c.patient_name || "Unknown"}</p>
                                </div>
                              </div>
                            </td>
                            <td><code className="text-xs bg-white/[0.04] border border-white/[0.1] text-white/60 px-1.5 py-0.5 rounded">{c.cpt_code}</code></td>
                            <td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                            <td className="text-xs text-white/40">{c.insurance_provider}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${(c.denial_risk_score || 0) > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {c.denial_risk_score || 0}%
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Analyzer Tab */}
        {tab === "analyzer" && (
          <motion.div key="analyzer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AnimatePresence mode="wait">
              {phase === "input" && (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VOBInputPanel onGenerate={handleGenerate} isLoading={false} />
                </motion.div>
              )}

              {phase === "loading" && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 space-y-5">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-white border-white/10 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-semibold text-sm">Running AI VOB Analysis</p>
                    <p className="text-white/40 text-xs">Checking coverage, PA requirements, denial risk & revenue impact...</p>
                    <p className="text-white/20 text-[11px]">This may take 15–30 seconds</p>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "result" && report && (
                <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <VOBResults report={report} onReset={handleReset} />
                </motion.div>
              )}

              {phase === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5 space-y-3">
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <AlertTriangle size={15} className="text-white/60" /> Analysis Failed
                  </p>
                  <p className="text-xs text-white/50">{error}</p>
                  <button onClick={handleReset} className="btn-primary text-xs">← Try Again</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
