"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Zap, Shield, Search, Star, ArrowUpRight, Filter, Building2, Rocket, CheckCircle2, Mail, X, Clock, Users, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MarketplaceItem = {
  name: string;
  category: "Startup Solution" | "Integration" | "Data Source" | "Service Partner" | "Buyer Network";
  description: string;
  rating: number;
  users: string;
  icon: React.ReactNode;
  verified: boolean;
  tags: string[];
};

const marketplaceItems: MarketplaceItem[] = [
  { name: "CareAI Flow", category: "Startup Solution", description: "AI-powered patient flow optimization. Reduces OPD wait times by 40% using predictive scheduling.", rating: 4.9, users: "12 hospitals", icon: <Rocket size={20} />, verified: true, tags: ["AI", "OPD", "Scheduling"] },
  { name: "InsureBot", category: "Startup Solution", description: "Automated insurance verification and prior auth platform for specialty clinics.", rating: 4.8, users: "8 clinics", icon: <Shield size={20} />, verified: true, tags: ["RCM", "Insurance", "Prior Auth"] },
  { name: "Epic EHR Sync", category: "Integration", description: "Seamless bidirectional sync with Epic EHR. HL7/FHIR compliant.", rating: 4.9, users: "15k+ installs", icon: <Zap size={20} />, verified: true, tags: ["EHR", "FHIR", "HL7"] },
  { name: "Cerner Bridge", category: "Integration", description: "Oracle Cerner integration for real-time patient data exchange.", rating: 4.7, users: "8k+ installs", icon: <Zap size={20} />, verified: true, tags: ["EHR", "Oracle", "Data"] },
  { name: "Alpha Health Partners", category: "Buyer Network", description: "Exclusive network of 50+ hospital chains across India and ASEAN seeking healthtech solutions.", rating: 5.0, users: "Exclusive", icon: <Building2 size={20} />, verified: true, tags: ["Enterprise", "India", "ASEAN"] },
  { name: "Medicaid Intel API", category: "Data Source", description: "Real-time payer intelligence data. Coverage rules, denial rates, and reimbursement benchmarks.", rating: 4.9, users: "15k+ users", icon: <Search size={20} />, verified: true, tags: ["Data", "Payer", "Analytics"] },
  { name: "RevCycle Pro", category: "Service Partner", description: "End-to-end revenue cycle management consulting. Specialized in denial recovery.", rating: 4.6, users: "2k+ clients", icon: <Star size={20} />, verified: false, tags: ["Consulting", "Denials", "RCM"] },
  { name: "RadiologyAI", category: "Startup Solution", description: "AI diagnostic imaging assistant. FDA-cleared for chest X-ray and CT interpretation.", rating: 4.8, users: "6 hospitals", icon: <Rocket size={20} />, verified: true, tags: ["AI", "Radiology", "Imaging"] },
];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [introModal, setIntroModal] = useState<MarketplaceItem | null>(null);
  const [introSent, setIntroSent] = useState<string[]>([]);
  const [introEmail, setIntroEmail] = useState("");
  const [introMessage, setIntroMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const categories = ["All", "Startup Solution", "Integration", "Data Source", "Service Partner", "Buyer Network"];

  const filtered = marketplaceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedFilter === "All" || item.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRequestIntro = async () => {
    if (!introEmail.trim() || !introModal) return;
    setIsSaving(true);

    try {
      // Save intro request to marketplace_matches table
      await supabase.from('marketplace_matches').insert([{
        startup_name: introModal.name,
        clinic_name: introEmail, // using email as identifier for now
        match_score: introModal.rating * 20,
        match_reasons: [introModal.category, ...introModal.tags, introMessage].filter(Boolean),
        status: 'connected'
      }]);
    } catch (err) {
      console.error('Failed to save intro request:', err);
    }

    setIntroSent([...introSent, introModal.name]);
    setIntroModal(null);
    setIntroEmail("");
    setIntroMessage("");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Marketplace</h1>
          <p className="text-[13px] text-white/40 mt-1">Discover integrations, startups, and enterprise buyers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] text-white text-[13px] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-white/40 transition-all placeholder-white/20"
            />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
              selectedFilter === cat
                ? "bg-white text-black"
                : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* How It Works */}
      <div className="glass-card p-4 flex items-center gap-6 text-[12px]">
        <div className="flex items-center gap-2 text-white/60">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">1</div>
          <span>Browse solutions</span>
        </div>
        <ArrowUpRight size={12} className="text-white/20" />
        <div className="flex items-center gap-2 text-white/60">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">2</div>
          <span>Request Introduction</span>
        </div>
        <ArrowUpRight size={12} className="text-white/20" />
        <div className="flex items-center gap-2 text-white/60">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">3</div>
          <span>Both parties notified via email</span>
        </div>
        <ArrowUpRight size={12} className="text-white/20" />
        <div className="flex items-center gap-2 text-white/60">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">4</div>
          <span>Match logged in pipeline</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="pipeline-card group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white">
                {item.icon}
              </div>
              <div className="flex items-center gap-2">
                {item.verified && (
                  <span className="badge badge-info">Verified</span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40">{item.category}</span>
              </div>
            </div>
            
            <h3 className="text-[16px] font-bold text-white tracking-tight">{item.name}</h3>
            <p className="text-[12px] text-white/40 mt-1 leading-relaxed line-clamp-2">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/30 font-medium">{tag}</span>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between border-t border-white/[0.04] pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[12px] font-medium text-white">
                  <Star size={12} className="text-white fill-white/20" />
                  {item.rating}
                </div>
                <div className="text-[12px] text-white/20 flex items-center gap-1">
                  <Users size={10} /> {item.users}
                </div>
              </div>
              
              {introSent.includes(item.name) ? (
                <span className="text-[12px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Intro Sent
                </span>
              ) : (
                <button
                  onClick={() => setIntroModal(item)}
                  className="text-[12px] font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  Request Intro <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <Search size={32} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Request Introduction Modal */}
      <AnimatePresence>
        {introModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIntroModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Request Introduction</h3>
                <button onClick={() => setIntroModal(null)} className="text-white/30 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="glass-card p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white">
                  {introModal.icon}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">{introModal.name}</p>
                  <p className="text-[11px] text-white/40">{introModal.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-medium text-white/60 mb-1 block">Your Email</label>
                  <input
                    type="email"
                    value={introEmail}
                    onChange={(e) => setIntroEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-white/60 mb-1 block">Message (Optional)</label>
                  <textarea
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Tell them why you're interested..."
                    rows={3}
                  />
                </div>

                <div className="glass-card p-3 text-[11px] text-white/40 flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <span>Both you and {introModal.name} will receive an email notification. Your contact details will be shared with them.</span>
                </div>

                <button
                  onClick={handleRequestIntro}
                  disabled={!introEmail.trim() || isSaving}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />} {isSaving ? 'Sending...' : 'Send Introduction Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
