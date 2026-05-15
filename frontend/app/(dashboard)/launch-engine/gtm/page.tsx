"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Loader2, History, ChevronRight } from "lucide-react";
import GTMFileUpload, { type UploadedFile } from "@/components/gtm-file-upload";
import GTMResults from "@/components/gtm-results";
import { createClient } from "@/lib/supabase/client";
import type { GTMStrategy } from "@/types/gtm";
import { useLaunchEngineStore } from "@/store/useLaunchEngineStore";
import { useSearchParams } from "next/navigation";
import RoleplayModal from "@/components/roleplay-modal";

type Phase = "input" | "loading" | "result" | "error";

const LOADING_STEPS = [
  "Reading uploaded documents...",
  "Extracting product intelligence...",
  "Building ICP & buyer personas...",
  "Generating messaging & outreach...",
  "Computing ROI & marketplace match...",
];

function GTMContent() {
  const { gtmPhase: phase, setGtmPhase: setPhase, gtmStrategy: strategy, setGtmStrategy: setStrategy, selectedStartupId, setSelectedStartupId } = useLaunchEngineStore();
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [startups, setStartups] = useState<any[]>([]);
  const [isRoleplayOpen, setIsRoleplayOpen] = useState(false);
  const [roleplayBuyer, setRoleplayBuyer] = useState("");
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const fetchStartups = async () => {
      const { data } = await supabase.from('startup_profiles').select('id, name');
      if (data) {
        setStartups(data);
        if (data.length > 0 && !useLaunchEngineStore.getState().selectedStartupId) {
          setSelectedStartupId(data[0].id);
        }
      }
    };
    fetchStartups();
  }, [supabase, setSelectedStartupId]);

  useEffect(() => {
    const roleplay = searchParams.get("roleplay");
    const buyer = searchParams.get("buyer");
    if (roleplay === "true" && buyer) {
      setRoleplayBuyer(buyer);
      setIsRoleplayOpen(true);
    }
  }, [searchParams]);

  const handleGenerate = async (files: UploadedFile[], textContext: string) => {
    if (!selectedStartupId) {
      setError("Please select a startup first.");
      setPhase("error");
      return;
    }
    setPhase("loading");
    setLoadingStep(0);
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < LOADING_STEPS.length - 1 ? s + 1 : s));
    }, 4000);

    try {
      const res = await fetch("/api/gtm/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: files.map((f) => ({ name: f.name, ext: f.ext, base64: f.base64, label: f.label })),
          textContext,
        }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      if (!res.ok) throw new Error(data.error || "Failed to generate strategy");
      setStrategy(data.strategy);
      setPhase("result");
      await supabase.from('gtm_recommendations').insert([{
        startup_id: selectedStartupId,
        strategy_json: data.strategy,
        icp_data: data.strategy.icp,
        persona_data: data.strategy.buyerPersona,
        messaging_data: data.strategy.messaging,
        status: 'completed'
      }]);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || "Unknown error");
      setPhase("error");
    }
  };

  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const { data } = await supabase.from('gtm_recommendations').select('*').order('created_at', { ascending: false }).limit(10);
    if (data) setHistory(data);
    setHistoryLoading(false);
  };

  const toggleHistory = () => {
    if (!showHistory) fetchHistory();
    setShowHistory(!showHistory);
  };

  const loadHistoryItem = (item: any) => {
    if (item.strategy_json) {
      setStrategy(item.strategy_json);
      setPhase("result");
      setShowHistory(false);
      showToast("📂 Loaded saved strategy");
    }
  };

  const handleReset = () => {
    setStrategy(null);
    setError("");
    setPhase("input");
  };

  return (
    <div className="max-w-[960px] mx-auto">
      <AnimatePresence mode="wait">
        {phase === "input" && (
          <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
            <div className="bg-white border border-black rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-black flex items-center justify-center"><Target size={20} className="text-black" /></div>
                <div>
                  <p className="text-xs font-bold text-black uppercase tracking-widest">Select Target Startup</p>
                  <select value={selectedStartupId || ""} onChange={(e) => setSelectedStartupId(e.target.value)} className="bg-transparent text-sm font-bold text-black outline-none cursor-pointer">
                    {startups.length === 0 && <option value="">No startups onboarded</option>}
                    {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={toggleHistory} className="btn-secondary text-[10px] flex items-center gap-2"><History size={12} /> View History</button>
            </div>
            {showHistory && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white border border-black rounded-2xl p-4 overflow-hidden -mt-6 pt-8">
                <h4 className="text-xs font-bold text-black mb-3 uppercase tracking-wider">Recent Analyses</h4>
                {historyLoading ? <div className="flex items-center gap-2 text-black text-xs py-4"><Loader2 size={14} className="animate-spin" /> Loading history...</div> : history.length === 0 ? <p className="text-black text-xs py-4">No history found.</p> : (
                  <div className="space-y-2">
                    {history.map((h) => (
                      <button key={h.id} onClick={() => loadHistoryItem(h)} className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-black hover:bg-black group transition-all">
                        <div className="group-hover:text-white"><p className="text-sm font-semibold">Strategy on {new Date(h.created_at).toLocaleDateString()}</p></div>
                        <ChevronRight size={16} className="group-hover:text-white" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            <GTMFileUpload onGenerate={handleGenerate} isLoading={false} />
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-36 space-y-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-black animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-black border-black animate-spin" />
            </div>
            <div className="text-center space-y-2 max-w-xs">
              <p className="text-black font-semibold text-sm">Analyzing with GPT-4o</p>
              <motion.p key={loadingStep} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-black text-xs">{LOADING_STEPS[loadingStep]}</motion.p>
            </div>
          </motion.div>
        )}

        {phase === "result" && strategy && (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GTMResults 
              strategy={strategy} 
              onReset={handleReset}
              onPracticePitch={(buyerOrg) => {
                setRoleplayBuyer(buyerOrg);
                setIsRoleplayOpen(true);
              }}
            />
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-black rounded-2xl p-6 space-y-4 max-w-lg mx-auto mt-20">
            <p className="text-sm font-semibold text-black mb-1">Analysis Failed</p>
            <p className="text-xs text-black">{error}</p>
            <button onClick={handleReset} className="btn-primary text-xs">← Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
      <RoleplayModal isOpen={isRoleplayOpen} onClose={() => setIsRoleplayOpen(false)} buyerOrg={roleplayBuyer} startupId={selectedStartupId || "default"} />
      {notification && <div className="fixed bottom-10 right-10 bg-black text-white px-6 py-3 rounded-xl shadow-2xl z-50">{notification}</div>}
    </div>
  );
}

export default function GTMPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-black" /></div>}>
      <GTMContent />
    </Suspense>
  );
}
