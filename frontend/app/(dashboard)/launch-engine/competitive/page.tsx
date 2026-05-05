"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CompetitivePage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCompetitors = async () => {
      setLoading(true);
      const { data } = await supabase.from('competitors').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setCompetitors(data);
      } else {
        setCompetitors([
          { id: "CP001", competitor_name: "Nuance DAX", category: "Clinical AI", strengths: ["Microsoft backing", "Large install base", "Brand recognition"], weaknesses: ["Expensive", "Complex implementation", "Limited customization"], pricing: "$500-1500/provider/month", market_share: "35%", recent_launches: ["DAX Copilot v3", "Ambient AI Update"], threat_level: "high" },
          { id: "CP002", competitor_name: "Abridge", category: "Clinical AI", strengths: ["Modern UX", "Fast deployment", "Strong NLP"], weaknesses: ["Limited EHR integrations", "Newer company"], pricing: "$300-800/provider/month", market_share: "8%", recent_launches: ["Real-time summarization"], threat_level: "medium" },
          { id: "CP003", competitor_name: "Waystar", category: "Revenue Cycle", strengths: ["Full RCM suite", "Large customer base", "Proven ROI"], weaknesses: ["Legacy tech stack", "Slow innovation"], pricing: "$2000-5000/month", market_share: "22%", recent_launches: ["AI-powered denials module"], threat_level: "medium" },
        ]);
      }
      setLoading(false);
    };
    fetchCompetitors();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-white/10 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Competitive Intelligence</h1>
        <p className="text-sm text-white/40 mt-1">Track competitors, positioning & market differentiation</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {competitors.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center"><Swords size={18} className="text-white/40" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{c.competitor_name}</h3>
                  <p className="text-xs text-white/40">{c.category}</p>
                </div>
              </div>
              <span className="badge badge-neutral">{c.threat_level} threat</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06]"><p className="text-[10px] text-white/20">Market Share</p><p className="text-xs font-medium text-white">{c.market_share}</p></div>
              <div className="p-2 rounded bg-white/[0.03] border border-white/[0.06]"><p className="text-[10px] text-white/20">Pricing</p><p className="text-xs font-medium text-white">{c.pricing}</p></div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-white/60 font-medium mb-1">Strengths</p>
              <div className="flex flex-wrap gap-1">
                {(c.strengths || []).map((s: string) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.1]">{s}</span>)}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-white/40 font-medium mb-1">Weaknesses</p>
              <div className="flex flex-wrap gap-1">
                {(c.weaknesses || []).map((w: string) => <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.02] text-white/20 border border-white/[0.06]">{w}</span>)}
              </div>
            </div>
            {(c.recent_launches || []).length > 0 && (
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[10px] text-white/20 font-medium mb-1">Recent Launches</p>
                <p className="text-xs text-white/60">{c.recent_launches.join(", ")}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
