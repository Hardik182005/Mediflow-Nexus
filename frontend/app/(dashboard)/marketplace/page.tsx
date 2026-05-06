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
      await supabase.from('marketplace_matches').insert([{
        startup_name: introModal.name,
        clinic_name: introEmail,
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
          <h1 className="text-[24px] font-bold text-black tracking-tight font-serif">Marketplace</h1>
          <p className="text-[13px] text-black/40 font-medium">Discover integrations, startups, and enterprise buyers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/[0.02] border border-black/[0.05] text-black text-[13px] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-black/20 transition-all placeholder-black/20"
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
            className={`px-4 py-2 text-[12px] font-bold rounded-full transition-all border ${
              selectedFilter === cat
                ? "bg-black text-white border-black"
                : "bg-white border-black/[0.05] text-black/40 hover:text-black hover:border-black/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-black/[0.02] border border-black/[0.05] rounded-2xl p-6 flex flex-wrap items-center gap-x-8 gap-y-4 text-[12px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-3 text-black/60">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white shadow-lg">1</div>
          <span>Browse solutions</span>
        </div>
        <ArrowUpRight size={14} className="text-black/10 hidden md:block" />
        <div className="flex items-center gap-3 text-black/60">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white shadow-lg">2</div>
          <span>Request Introduction</span>
        </div>
        <ArrowUpRight size={14} className="text-black/10 hidden md:block" />
        <div className="flex items-center gap-3 text-black/60">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white shadow-lg">3</div>
          <span>Email parties</span>
        </div>
        <ArrowUpRight size={14} className="text-black/10 hidden md:block" />
        <div className="flex items-center gap-3 text-black/60">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[11px] font-bold text-white shadow-lg">4</div>
          <span>Match logged</span>
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
            className="bg-white border border-black/[0.05] rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl">
                {item.icon}
              </div>
              <div className="flex items-center gap-2">
                {item.verified && (
                  <span className="bg-black/5 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tight">Verified</span>
                )}
                <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{item.category}</span>
              </div>
            </div>
            
            <h3 className="text-[18px] font-bold text-black tracking-tight font-serif">{item.name}</h3>
            <p className="text-[13px] text-black/60 mt-2 leading-relaxed line-clamp-2 font-medium">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {item.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-black/[0.02] border border-black/[0.05] text-black/40 font-bold uppercase">{tag}</span>
              ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-black/[0.05] pt-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[13px] font-bold text-black">
                  <Star size={14} className="text-black fill-black" />
                  {item.rating}
                </div>
                <div className="text-[12px] text-black/30 font-bold flex items-center gap-1 uppercase tracking-tighter">
                  <Users size={12} /> {item.users}
                </div>
              </div>
              
              {introSent.includes(item.name) ? (
                <span className="text-[12px] font-bold text-black flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Intro Sent
                </span>
              ) : (
                <button
                  onClick={() => setIntroModal(item)}
                  className="bg-black text-white text-[12px] font-bold py-2 px-4 rounded-xl hover:bg-black/90 transition-all shadow-lg flex items-center gap-2"
                >
                  Connect <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 text-black/20">
          <Search size={48} className="mx-auto mb-6 opacity-20" />
          <p className="text-xl font-bold font-serif text-black">No solutions found</p>
          <p className="text-sm font-medium mt-2">Try adjusting your search filters</p>
        </div>
      )}

      {/* Request Introduction Modal */}
      <AnimatePresence>
        {introModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIntroModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-black font-serif">Request Intro</h3>
                <button onClick={() => setIntroModal(null)} className="text-black/30 hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-black/[0.02] border border-black/[0.05] p-5 rounded-2xl mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-lg">
                  {introModal.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-black">{introModal.name}</p>
                  <p className="text-[12px] text-black/40 font-bold uppercase tracking-wider">{introModal.category}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Your Enterprise Email</label>
                  <input
                    type="email"
                    value={introEmail}
                    onChange={(e) => setIntroEmail(e.target.value)}
                    className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder="name@organization.com"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    className="w-full bg-black/[0.02] border border-black/10 rounded-xl px-4 py-3 text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[100px] resize-none"
                    placeholder="Tell them about your interest..."
                    rows={3}
                  />
                </div>

                <div className="flex items-start gap-3 text-[11px] text-black/40 font-medium leading-relaxed bg-black/[0.02] p-4 rounded-xl">
                  <Mail size={16} className="mt-0.5 flex-shrink-0 text-black/20" />
                  <span>MediFlow will facilitate a direct introduction. Your enterprise profile and contact details will be shared with {introModal.name}.</span>
                </div>

                <button
                  onClick={handleRequestIntro}
                  disabled={!introEmail.trim() || isSaving}
                  className="w-full bg-black text-white py-4 rounded-2xl font-bold text-[14px] shadow-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} {isSaving ? 'Sending Request...' : 'Send Introduction Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
