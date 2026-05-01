"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, Clock, DollarSign, Zap, Brain } from "lucide-react";
import { insuranceCases } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import VOBInputPanel from "@/components/vob-input-panel";
import VOBResults from "@/components/vob-results";
import type { VOBInput, VOBReport } from "@/types/vob";

type Tab = "records" | "analyzer";
type Phase = "input" | "loading" | "result" | "error";

const getStatusBadge = (_s: string) => "badge-neutral";

export default function InsurancePage() {
  const [tab, setTab] = useState<Tab>("records");

  // Analyzer state
  const [phase, setPhase] = useState<Phase>("input");
  const [report, setReport] = useState<VOBReport | null>(null);
  const [error, setError] = useState<string>("");

  const handleGenerate = async (inputs: VOBInput[]) => {
    setPhase("loading");
    setError("");
    try {
      const res = await fetch("/api/vob/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");
      if (data.report) { setReport(data.report); setPhase("result"); }
      else throw new Error(data.raw ? "AI returned unstructured output" : "Unexpected server response");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  };

  const handleReset = () => { setReport(null); setError(""); setPhase("input"); };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Insurance Intelligence (VOB)</h1>
          <p className="text-sm text-white/40 mt-1">Benefits verification, eligibility tracking & cost transparency</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setTab("analyzer")}>
          <Brain size={15} /> AI Analyzer
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Coverages", value: "71", icon: CheckCircle },
          { label: "Pending VOB", value: "18", icon: Clock },
          { label: "Expiring Soon", value: "5", icon: AlertTriangle },
          { label: "Avg Reimbursement", value: "$1,080", icon: DollarSign },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <s.icon size={18} className="text-white" />
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
                      <th>Patient</th><th>Provider</th><th>CPT</th><th>Status</th>
                      <th>Deductible</th><th>Copay</th><th>OOP Max</th><th>Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insuranceCases.map((c, i) => (
                      <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}>
                        <td>
                          <p className="text-sm font-medium text-white">{c.patientName}</p>
                          <p className="text-xs text-white/20">{c.policyNumber}</p>
                        </td>
                        <td className="text-sm text-white/60">{c.insuranceProvider}</td>
                        <td><code className="text-xs bg-white/[0.04] border border-white/[0.1] text-white/60 px-1.5 py-0.5 rounded">{c.cptCode}</code></td>
                        <td><span className={`badge ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                        <td>
                          <p className="text-sm text-white/60">{formatCurrency(c.deductibleMet)} / {formatCurrency(c.deductible)}</p>
                          <div className="w-20 h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full bg-white" style={{ width: `${(c.deductibleMet / c.deductible) * 100}%` }} />
                          </div>
                        </td>
                        <td className="text-sm text-white/60">{formatCurrency(c.copay)}</td>
                        <td>
                          <p className="text-sm text-white/60">{formatCurrency(c.outOfPocketMet)} / {formatCurrency(c.outOfPocketMax)}</p>
                          <div className="w-20 h-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full mt-1 overflow-hidden">
                            <div className="h-full rounded-full bg-white/40" style={{ width: `${(c.outOfPocketMet / c.outOfPocketMax) * 100}%` }} />
                          </div>
                        </td>
                        <td className="text-sm text-white/20">{c.expiryDate}</td>
                      </motion.tr>
                    ))}
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
