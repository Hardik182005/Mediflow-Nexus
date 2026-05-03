"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Search, BarChart3, Users, Zap, Plus, Loader2, Save, History, ChevronRight } from "lucide-react";
import GTMFileUpload, { type UploadedFile } from "@/components/gtm-file-upload";
import GTMResults from "@/components/gtm-results";
import { createClient } from "@/lib/supabase/client";
import type { GTMStrategy } from "@/types/gtm";

type Phase = "input" | "loading" | "result" | "error";

const LOADING_STEPS = [
  "Reading uploaded documents...",
  "Extracting product intelligence...",
  "Building ICP & buyer personas...",
  "Generating messaging & outreach...",
  "Computing ROI & marketplace match...",
];

export default function GTMPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [strategy, setStrategy] = useState<GTMStrategy | null>(null);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [startups, setStartups] = useState<any[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchStartups = async () => {
      const { data } = await supabase.from('startup_profiles').select('id, name');
      if (data) {
        setStartups(data);
        if (data.length > 0) setSelectedStartupId(data[0].id);
      }
    };
    fetchStartups();
  }, []);

  const handleGenerate = async (files: UploadedFile[], textContext: string) => {
    if (!selectedStartupId) {
      setError("Please select a startup first. Go to 'Onboarding' if you haven't created one.");
      setPhase("error");
      return;
    }

    setPhase("loading");
    setError("");
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 4000);

    try {
      const res = await fetch("/api/gtm/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: files.map((f) => ({
            name: f.name,
            ext: f.ext,
            base64: f.base64,
            label: f.label,
          })),
          textContext,
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) throw new Error(data.error || "Failed to generate strategy");

      if (data.strategy) {
        setStrategy(data.strategy);
        setPhase("result");
        
        // Auto-save to Supabase
        await handleSaveStrategy(data.strategy);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : "Unknown error");
      setPhase("error");
    }
  };

  const handleSaveStrategy = async (strat: GTMStrategy) => {
    setIsSaving(true);
    const { error: saveError } = await supabase
      .from('gtm_recommendations')
      .insert([{
        startup_id: selectedStartupId,
        strategy_json: strat,
        icp_data: strat.icp,
        persona_data: strat.personas,
        messaging_data: strat.messaging,
        status: 'completed'
      }]);
    setIsSaving(false);
  };

  const handleReset = () => {
    setStrategy(null);
    setError("");
    setPhase("input");
    setLoadingStep(0);
  };

  return (
    <div className="max-w-[960px] mx-auto">
      <AnimatePresence mode="wait">
        {/* ── Input Phase ───────────────────────────────────── */}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                  <Target size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Select Target Startup</p>
                  <select 
                    value={selectedStartupId} 
                    onChange={(e) => setSelectedStartupId(e.target.value)}
                    className="bg-transparent text-sm font-bold text-white outline-none cursor-pointer"
                  >
                    {startups.length === 0 && <option value="">No startups onboarded</option>}
                    {startups.map(s => <option key={s.id} value={s.id} className="bg-[#0A0A0A]">{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary text-[10px] flex items-center gap-2"><History size={12} /> View History</button>
              </div>
            </div>

            <GTMFileUpload onGenerate={handleGenerate} isLoading={false} />
          </motion.div>
        )}

        {/* ── Loading Phase ─────────────────────────────────── */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-36 space-y-8"
          >
            {/* Animated ring */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-white/[0.06] animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-0 rounded-full border-2 border-t-white border-white/10 animate-spin" style={{ animationDuration: "1.2s" }} />
              <div className="absolute inset-3 rounded-full border border-white/10 animate-spin" style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
            </div>

            {/* Step indicator */}
            <div className="text-center space-y-2 max-w-xs">
              <p className="text-white font-semibold text-sm">Analyzing with Gemini 1.5 Pro</p>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/40 text-xs"
              >
                {LOADING_STEPS[loadingStep]}
              </motion.p>
              <p className="text-white/20 text-[11px]">This may take 20–40 seconds for large files</p>
            </div>

            {/* Step dots */}
            <div className="flex gap-1.5">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === loadingStep ? "w-6 bg-white" : i < loadingStep ? "w-1.5 bg-white/40" : "w-1.5 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Result Phase ──────────────────────────────────── */}
        {phase === "result" && strategy && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GTMResults strategy={strategy} onReset={handleReset} />
          </motion.div>
        )}

        {/* ── Error Phase ───────────────────────────────────── */}
        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 space-y-4 max-w-lg mx-auto mt-20"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠</span>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Analysis Failed</p>
                <p className="text-xs text-white/50 leading-relaxed">{error}</p>
              </div>
            </div>
            <div className="text-xs text-white/30 space-y-1 pt-1 border-t border-white/[0.06]">
              <p>Possible causes:</p>
              <p>· GEMINI_API_KEY not set in .env.local</p>
              <p>· File too large or format unsupported</p>
              <p>· API quota exceeded</p>
            </div>
            <button onClick={handleReset} className="btn-primary text-xs">← Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
