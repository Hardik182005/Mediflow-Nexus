"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Mail, Star, Loader2, ArrowRight, ShieldCheck, Zap, Presentation, FileText, X, SlidersHorizontal, Copy, ExternalLink, Check, Sparkles, Mic } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PitchDeckModal from "@/components/pitch-deck-modal";
import ContextFileUpload from "@/components/context-file-upload";
import RoleplayModal from "@/components/roleplay-modal";
import type { PitchDeck } from "@/types/pitch-deck";
import { useLaunchEngineStore } from "@/store/useLaunchEngineStore";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'perfect': return "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]";
    case 'strong': return "bg-white/10 text-white border-white/20";
    case 'potential': return "bg-white/[0.05] text-white/40 border-white/[0.1]";
    default: return "bg-white/[0.05] text-white/40 border-white/[0.1]";
  }
};

export default function BuyerDiscoveryPage() {
  const { buyers, setBuyers, productFiles, setProductFiles, selectedStartupId, setSelectedStartupId } = useLaunchEngineStore();
  const [loading, setLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [startups, setStartups] = useState<any[]>([]);
  
  // Pitch Deck State
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<string | null>(null);
  const [activeDeck, setActiveDeck] = useState<PitchDeck | null>(null);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [selectedBuyerName, setSelectedBuyerName] = useState("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  // Connect Modal State
  const [connectModal, setConnectModal] = useState<any | null>(null);
  const [connectEmail, setConnectEmail] = useState("");
  const [connectMessage, setConnectMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedBuyers, setConnectedBuyers] = useState<string[]>([]);
  const [notification, setNotification] = useState("");

  // AI Email State
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string; recipientName: string; hospitalName: string; wordCount: number } | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  // Roleplay State
  const [roleplayModalOpen, setRoleplayModalOpen] = useState(false);
  const [roleplayBuyer, setRoleplayBuyer] = useState<any | null>(null);

  const openRoleplayModal = (buyer: any) => {
    setRoleplayBuyer(buyer);
    setRoleplayModalOpen(true);
  };

  const supabase = createClient();

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch startups
    const { data: startupData } = await supabase.from('startup_profiles').select('id, name');
    if (startupData) {
      setStartups(startupData);
      if (startupData.length > 0 && !useLaunchEngineStore.getState().selectedStartupId) {
        setSelectedStartupId(startupData[0].id);
      }
    }

    // Fetch previously matched buyers only if we don't have any in store
    if (useLaunchEngineStore.getState().buyers.length === 0) {
      const { data: matchData } = await supabase
        .from('marketplace_matches')
        .select('*')
        .order('match_score', { ascending: false });
      
      if (matchData) {
        // Map clinic_name to buyer_org for the UI
        const mappedData = matchData.map(m => ({
          ...m,
          buyer_org: m.clinic_name || m.buyer_name,
          match_reason: m.match_reasons?.[0] || 'Strong synergy identified.'
        }));
        setBuyers(mappedData);
      }
    }
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
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        // Build buyer rows directly from API response for immediate display
        const newBuyers = data.matches.map((match: any, idx: number) => ({
          id: `discovery-${Date.now()}-${idx}`,
          startup_id: selectedStartupId,
          buyer_name: match.name,
          buyer_org: match.organization,
          match_score: match.score,
          match_reason: match.reason,
          status: match.score > 85 ? 'perfect' : 'strong'  // UI display only
        }));

        // Update UI immediately
        setBuyers(newBuyers);

        // Best-effort save to Supabase (non-blocking)
        // Note: DB enum does not have 'perfect' — map it to 'strong'
        for (const match of newBuyers) {
          const dbStatus = match.status === 'perfect' ? 'strong' : match.status;
          supabase.from('marketplace_matches').upsert({
            startup_id: match.startup_id,
            buyer_name: match.buyer_name,
            clinic_name: match.buyer_org,
            match_score: match.match_score,
            match_reasons: [match.match_reason],
            status: dbStatus
          }).then(({ error }) => {
            if (error) console.warn("Supabase save skipped:", error.message);
          });
        }
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
    
    // Find full buyer context from local state since Supabase might have been skipped
    const buyerMatch = buyers.find(b => b.id === buyerId);

    try {
      const res = await fetch("/api/gtm/pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startupId: selectedStartupId,
          buyerId,
          buyerOrg: buyerMatch?.buyer_org || buyerName,
          matchReason: buyerMatch?.match_reason || "Strong synergy identified.",
          productFiles: productFiles.map(f => ({ base64: f.base64, mimeType: f.mimeType, name: f.name }))
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }

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

  const handleConnect = async () => {
    if (!connectEmail.trim() || !connectModal) return;
    setIsConnecting(true);
    try {
      // Use the backend outreach API
      const res = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: connectModal.id,
          startupId: selectedStartupId,
          email: connectEmail,
          message: connectMessage,
          pitchDeck: connectModal.pitch_deck_json || null,
          productFiles: productFiles || []
        }),
      });

      if (!res.ok) throw new Error("Failed to send outreach");

      // Still update the local supabase so the UI reflects the connection
      await supabase.from('marketplace_matches').upsert({
        id: connectModal.id,
        status: 'connected',
        match_reasons: [connectMessage].filter(Boolean),
      });

      setConnectedBuyers([...connectedBuyers, connectModal.id]);
      setConnectModal(null);
      setConnectEmail("");
      setConnectMessage("");
      showToast(`✅ Outreach sent to ${connectModal.buyer_org}`);
    } catch (err) {
      console.error('Outreach failed:', err);
      showToast(`❌ Failed to send outreach.`);
    } finally {
      setIsConnecting(false);
    }
  };

  const openOutreachModal = (buyer: any) => {
    setGeneratedEmail(null);
    setConnectEmail("");
    setConnectMessage("");
    setEmailCopied(false);
    setConnectModal(buyer);
  };

  const handleGenerateEmail = async (buyer: any) => {
    if (!selectedStartupId) return;
    setIsGeneratingEmail(true);
    setGeneratedEmail(null);
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startupId: selectedStartupId,
          buyerOrg: buyer.buyer_org,
          buyerName: buyer.buyer_name,
        }),
      });
      const data = await res.json();
      if (data.email) {
        setGeneratedEmail(data.email);
        setConnectMessage(data.email.body);
      } else {
        showToast("❌ Failed to generate email: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      showToast("❌ Email generation failed");
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleCopyEmail = async () => {
    if (!generatedEmail) return;
    const full = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
    await navigator.clipboard.writeText(full);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleOpenGmail = () => {
    if (!generatedEmail) return;
    const subject = encodeURIComponent(generatedEmail.subject);
    const body = encodeURIComponent(generatedEmail.body);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
  };

  // Filter buyers
  const filteredBuyers = buyers.filter(b => {
    const matchesSearch = searchTerm === "" ||
      (b.buyer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.buyer_org || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScore = (b.match_score || 0) >= minScore;
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesScore && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-bold shadow-2xl animate-fade-in border border-white">
          {notification}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Discovery</h1>
          <p className="text-sm text-white/40 mt-1">AI-powered hospital & clinic targeting</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedStartupId} 
            onChange={(e) => setSelectedStartupId(e.target.value)}
            className="bg-black text-xs font-bold text-white/50 px-4 py-2.5 rounded-lg border border-white/10 outline-none cursor-pointer hover:border-white/20 transition-all"
          >
            {startups.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
          </select>
          <button 
            onClick={handleDiscover}
            disabled={isDiscovering || !selectedStartupId}
            className="btn-primary flex items-center gap-2 py-2.5 px-6 text-sm"
          >
            {isDiscovering ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
            {isDiscovering ? "Analyzing Markets..." : "Discover Perfect Matches"}
          </button>
        </div>
      </div>

      {/* Product Context Upload */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={16} className="text-white" />
          Supplemental Product Context (Optional)
        </h2>
        <ContextFileUpload onChange={(files: any) => setProductFiles(files)} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: "Total Target Entities", value: "248", icon: ShieldCheck },
          { label: "AI Perfect Matches", value: buyers.filter(b => b.match_score >= 90).length.toString(), icon: Star },
          { label: "Strong Leads", value: buyers.filter(b => b.match_score >= 75 && b.match_score < 90).length.toString(), icon: Zap },
          { label: "Market Reach", value: "12 States", icon: MapPin },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} 
            className="glass-card p-5 border-white/[0.05] hover:border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                <s.icon size={20} className="text-white/30" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Search discovered buyers..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="input-field pl-12 h-12 bg-black border-white/10" 
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="btn-secondary h-12 px-6 flex items-center gap-2 border-white/10"
        >
          <SlidersHorizontal size={16} /> Filter
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-4 overflow-hidden">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/40 font-medium">Min Score:</label>
                <input type="range" min={0} max={100} value={minScore} onChange={(e) => setMinScore(parseInt(e.target.value))} className="w-32 accent-white" />
                <span className="text-xs font-bold text-white w-8">{minScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/40 font-medium">Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0A0A0A] text-xs text-white/60 px-3 py-1.5 rounded-lg border border-white/[0.1] outline-none">
                  <option value="all">All</option>
                  <option value="perfect">Perfect</option>
                  <option value="strong">Strong</option>
                  <option value="potential">Potential</option>
                  <option value="connected">Connected</option>
                </select>
              </div>
              <button onClick={() => { setMinScore(0); setStatusFilter('all'); setSearchTerm(''); }} className="text-xs text-white/30 hover:text-white transition-colors">Clear All</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-white/10 animate-spin" />
          <p className="text-sm text-white/20">Analyzing market opportunities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredBuyers.map((b, i) => (
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
                    <div className="flex items-center gap-1 text-white">
                      <Star size={12} className="fill-white" />
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
                        className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-2"
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
                    {connectedBuyers.includes(b.id) ? (
                      <span className="text-[10px] font-bold text-white flex items-center gap-1 py-2 px-4">
                        ✓ Connected
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => openRoleplayModal(b)}
                          className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-2"
                        >
                          <Mic size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:block">Mock Pitch</span>
                        </button>
                        <button
                          onClick={() => openOutreachModal(b)}
                          className="btn-primary text-[10px] py-2 px-4 uppercase font-bold tracking-widest flex items-center gap-2"
                        >
                          Send Outreach <ArrowRight size={12} />
                        </button>
                      </>
                    )}
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

          {roleplayBuyer && (
            <RoleplayModal
              isOpen={roleplayModalOpen}
              onClose={() => setRoleplayModalOpen(false)}
              buyerOrg={roleplayBuyer.buyer_org}
              startupId={selectedStartupId}
            />
          )}

          {filteredBuyers.length === 0 && !loading && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-white/20">
                <Search size={32} />
              </div>
              <div>
                <p className="text-white font-bold">{buyers.length === 0 ? 'No Buyer Discoveries Yet' : 'No matches found'}</p>
                <p className="text-sm text-white/40 mt-1 max-w-xs mx-auto">
                  {buyers.length === 0 ? 'Select a startup and click "Discover Perfect Matches" to find your ideal healthcare buyers.' : 'Try adjusting your search or filters.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Connect Modal — AI Email */}
      <AnimatePresence>
        {connectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConnectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white text-base font-bold uppercase">
                    {(connectModal.buyer_org || "?")[0]}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white">{connectModal.buyer_org}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{connectModal.buyer_name} · {connectModal.match_score}% AI Match</p>
                  </div>
                </div>
                <button onClick={() => setConnectModal(null)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
              </div>

              {/* Generate Button */}
              {!generatedEmail && (
                <button
                  onClick={() => handleGenerateEmail(connectModal)}
                  disabled={isGeneratingEmail}
                  className="w-full mb-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {isGeneratingEmail
                    ? <><Loader2 size={16} className="animate-spin" /> Generating personalised email...</>
                    : <><Sparkles size={16} /> Generate AI Outreach Email</>}
                </button>
              )}

              {/* AI Email Preview */}
              {generatedEmail && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5"
                >
                  {/* Email Card */}
                  <div className="rounded-xl border border-white/[0.1] bg-white/[0.02] overflow-hidden">
                    {/* Email meta bar */}
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Subject</p>
                        <p className="text-[13px] font-bold text-white leading-snug">{generatedEmail.subject}</p>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono mt-1 shrink-0">{generatedEmail.wordCount}w</span>
                    </div>

                    {/* Email body */}
                    <div className="px-4 py-4">
                      <p className="text-[11px] text-white/30 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                        <Mail size={10} /> To: {generatedEmail.recipientName} · {connectModal.buyer_org}
                      </p>
                      <pre className="text-[12px] text-white/70 leading-relaxed whitespace-pre-wrap font-sans">
                        {generatedEmail.body}
                      </pre>
                    </div>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                      <button
                        onClick={handleCopyEmail}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider"
                      >
                        {emailCopied ? <><Check size={12} className="text-white" /> Copied!</> : <><Copy size={12} /> Copy Email</>}
                      </button>
                    <button
                      onClick={handleOpenGmail}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider"
                    >
                      <ExternalLink size={12} /> Open Gmail
                    </button>
                    <button
                      onClick={() => { setConnectMessage(generatedEmail.body); }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider"
                    >
                      <Sparkles size={12} /> Use for Send
                    </button>
                  </div>

                  {/* Regenerate */}
                  <button
                    onClick={() => handleGenerateEmail(connectModal)}
                    disabled={isGeneratingEmail}
                    className="mt-2 w-full text-[10px] text-white/20 hover:text-white/50 transition-colors text-center"
                  >
                    {isGeneratingEmail ? "Regenerating..." : "↻ Regenerate email"}
                  </button>
                </motion.div>
              )}

              {/* Send via Platform section — shown after "Use for Send" */}
              {connectMessage && generatedEmail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 pt-4 border-t border-white/[0.06]"
                >
                  <p className="text-[11px] text-white/40 font-medium">Send via MediFlow Nexus (Resend)</p>
                  <div>
                    <label className="text-[11px] font-medium text-white/40 mb-1.5 block">Your verified sender email</label>
                    <input
                      type="email"
                      value={connectEmail}
                      onChange={(e) => setConnectEmail(e.target.value)}
                      className="input-field text-[13px]"
                      placeholder="you@company.com"
                    />
                  </div>
                  <button
                    onClick={handleConnect}
                    disabled={!connectEmail.trim() || isConnecting}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30 text-sm font-bold"
                  >
                    {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    {isConnecting ? "Sending..." : `Send to ${connectModal.buyer_org}`}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

