"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, Filter, ArrowUpRight, AlertTriangle, CheckCircle2, Clock, FileText, Upload, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import VOBReportView from "@/components/vob-report-view";
import type { VOBReport } from "@/types/vob";
import { formatCurrency } from "@/lib/utils";

export default function InsurancePage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReport, setActiveReport] = useState<VOBReport | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: caseData } = await supabase
      .from('insurance_cases')
      .select('*, patients(name)')
      .order('created_at', { ascending: false });
    
    if (caseData) setCases(caseData);

    const { data: patientData } = await supabase.from('patients').select('id, name');
    if (patientData) {
      setPatients(patientData);
      if (patientData.length > 0) setSelectedPatientId(patientData[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPatientId || !treatmentType) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/clinic/vob/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentBase64: reader.result,
            treatmentType,
            patientId: selectedPatientId
          })
        });
        const data = await res.json();
        if (data.report) {
          setActiveReport(data.report);
          setShowUploadModal(false);
          fetchData();
        }
      } catch (err) {
        console.error("VOB failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
            <Brain size={15} /> AI Analyzer
          </button>
        </div>
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
                      <th>Deductible</th>
                      <th>OOP Max</th>
                      <th>Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-20">
                          <Loader2 className="w-8 h-8 text-white/10 animate-spin mx-auto mb-2" />
                          <p className="text-xs text-white/20">Loading insurance cases...</p>
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
                                  {c.patients?.first_name[0]}{c.patients?.last_name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{c.patients?.first_name} {c.patients?.last_name}</p>
                                  <p className="text-[10px] text-white/20 uppercase tracking-widest">{c.insurance_provider}</p>
                                </div>
                              </div>
                            </td>
                            <td><code className="text-xs bg-white/[0.04] border border-white/[0.1] text-white/60 px-1.5 py-0.5 rounded">{c.cpt_code}</code></td>
                            <td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                            <td>
                              <p className="text-xs text-white/60">{formatCurrency(c.deductible_met)} / {formatCurrency(c.deductible)}</p>
                              <div className="w-20 h-1 bg-white/[0.06] rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-white/40" style={{ width: `${(c.deductible_met / c.deductible) * 100}%` }} />
                              </div>
                            </td>
                            <td>
                              <p className="text-xs text-white/60">{formatCurrency(c.out_of_pocket_met)} / {formatCurrency(c.out_of_pocket_max)}</p>
                              <div className="w-20 h-1 bg-white/[0.06] rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-white" style={{ width: `${(c.out_of_pocket_met / c.out_of_pocket_max) * 100}%` }} />
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${c.denial_risk_score > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {c.denial_risk_score}%
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                    {!loading && cases.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-white/20 italic text-sm">
                          No active insurance cases. Start an AI VOB analysis to generate records.
                        </td>
                      </tr>
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
