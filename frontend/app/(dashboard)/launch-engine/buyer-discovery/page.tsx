import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MapPin, Mail, Phone, Star, Rocket, Loader2, Plus, ArrowRight, ShieldCheck, Zap, Presentation, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PitchDeckModal from "@/components/pitch-deck-modal";
import type { PitchDeck } from "@/types/pitch-deck";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'perfect': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case 'strong': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case 'potential': return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

export default function BuyerDiscoveryPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [startups, setStartups] = useState<any[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>("");
  
  // Pitch Deck State
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<string | null>(null);
  const [activeDeck, setActiveDeck] = useState<PitchDeck | null>(null);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [selectedBuyerName, setSelectedBuyerName] = useState("");

  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    // Fetch startups
    const { data: startupData } = await supabase.from('startup_profiles').select('id, name');
    if (startupData) {
      setStartups(startupData);
      if (startupData.length > 0) setSelectedStartupId(startupData[0].id);
    }

    // Fetch previously matched buyers
    const { data: matchData } = await supabase
      .from('marketplace_matches')
      .select('*')
      .order('match_score', { ascending: false });
    
    if (matchData) setBuyers(matchData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDiscover = async () => {
    if (!selectedStartupId) return;
    setIsDiscovering(true);
    
    try {
      const res = await fetch("/api/gtm/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          discoveryMode: true,
          startupId: selectedStartupId 
        }),
      });
      
      const data = await res.json();
      if (data.matches) {
        // Save matches to Supabase
        for (const match of data.matches) {
          await supabase.from('marketplace_matches').upsert({
            startup_id: selectedStartupId,
            buyer_name: match.name,
            buyer_org: match.organization,
            match_score: match.score,
            match_reason: match.reason,
            status: match.score > 85 ? 'perfect' : 'strong'
          });
        }
        fetchData();
      }
    } catch (err) {
      console.error("Discovery failed", err);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleGeneratePitch = async (buyerId: string, buyerName: string) => {
    if (!selectedStartupId) return;
    setIsGeneratingPitch(buyerId);
    setSelectedBuyerName(buyerName);
    
    try {
      const res = await fetch("/api/gtm/pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId: selectedStartupId,
          buyerId 
        }),
      });
      
      const data = await res.json();
      if (data.pitchDeck) {
        setActiveDeck(data.pitchDeck);
        setDeckModalOpen(true);
        fetchData(); // Refresh to show saved deck if any
      }
    } catch (err) {
      console.error("Pitch generation failed", err);
    } finally {
      setIsGeneratingPitch(null);
    }
  };

  const handleViewPitch = (deck: PitchDeck, buyerName: string) => {
    setActiveDeck(deck);
    setSelectedBuyerName(buyerName);
    setDeckModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Discovery</h1>
          <p className="text-sm text-white/40 mt-1">AI-powered hospital & clinic targeting</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedStartupId} 
            onChange={(e) => setSelectedStartupId(e.target.value)}
            className="glass-card bg-[#0A0A0A] text-xs font-bold text-white/60 px-4 py-2.5 outline-none cursor-pointer border-white/10"
          >
            {startups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button 
            onClick={handleDiscover}
            disabled={isDiscovering || startups.length === 0}
            className="btn-primary flex items-center gap-2"
          >
            {isDiscovering ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            Discover Perfect Matches
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Target Entities", value: "248", icon: ShieldCheck },
          { label: "AI Perfect Matches", value: buyers.filter(b => b.match_score >= 90).length.toString(), icon: Star },
          { label: "Strong Leads", value: buyers.filter(b => b.match_score >= 75 && b.match_score < 90).length.toString(), icon: Zap },
          { label: "Market Reach", value: "12 States", icon: MapPin },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <s.icon size={18} className="text-white/40" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0]" />
          <input type="text" placeholder="Search discovered buyers..." className="input-field pl-10" />
        </div>
        <button className="btn-secondary flex items-center gap-2"><Filter size={14} /> Filter</button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
          <p className="text-sm text-white/20">Analyzing market opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {buyers.map((b, i) => (
              <motion.div 
                key={b.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.03 }} 
                className="glass-card p-6 group hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white text-lg font-bold group-hover:bg-white/[0.06] transition-colors uppercase">
                      {b.buyer_org[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{b.buyer_org}</h3>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{b.buyer_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Star size={12} className="fill-emerald-400" />
                      <span className="text-sm font-bold">{b.match_score}%</span>
                    </div>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">AI Score</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] mb-4">
                  <p className="text-[9px] text-white/20 uppercase font-bold mb-1 flex items-center gap-1.5">
                    <Zap size={10} /> AI Match Rationale
                  </p>
                  <p className="text-[11px] text-white/60 leading-relaxed italic line-clamp-3">
                    "{b.match_reason}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${getStatusBadge(b.status)}`}>
                    {b.status}
                  </span>
                  <div className="flex gap-2">
                    {b.pitch_deck_json ? (
                      <button 
                        onClick={() => handleViewPitch(b.pitch_deck_json, b.buyer_org)}
                        className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                      >
                        <Presentation size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">View Pitch</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleGeneratePitch(b.id, b.buyer_org)}
                        disabled={!!isGeneratingPitch}
                        className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-2"
                      >
                        {isGeneratingPitch === b.id ? <Loader2 size={14} className="animate-spin" /> : <Presentation size={14} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {isGeneratingPitch === b.id ? "Analyzing..." : "AI Pitch"}
                        </span>
                      </button>
                    )}
                    <button className="btn-primary text-[10px] py-2 px-4 uppercase font-bold tracking-widest flex items-center gap-2">
                      Connect <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeDeck && (
            <PitchDeckModal 
              isOpen={deckModalOpen}
              onClose={() => setDeckModalOpen(false)}
              deck={activeDeck}
              buyerName={selectedBuyerName}
              startupId={selectedStartupId}
            />
          )}

          {buyers.length === 0 && !loading && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-white/20">
                <Search size={32} />
              </div>
              <div>
                <p className="text-white font-bold">No Buyer Discoveries Yet</p>
                <p className="text-sm text-white/40 mt-1 max-w-xs mx-auto">
                  Select a startup and click "Discover Perfect Matches" to find your ideal healthcare buyers.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

