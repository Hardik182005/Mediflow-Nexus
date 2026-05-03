import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Upload, Zap, Target, Globe, Users, X, Loader2, Plus, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STAGES = ["Stealth", "MVP", "Scaling", "Mature"];
const FUNDING = ["Pre-seed", "Seed", "Series A", "Series B", "Bootstrapped"];

export default function OnboardingPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    stage: "MVP",
    funding_stage: "Seed",
    hq_location: "",
    team_size: 5,
    value_proposition: "",
    icp: ""
  });

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('startup_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('startup_profiles')
      .insert([{
        ...formData,
        user_id: user?.id,
        status: 'active'
      }]);

    if (!error) {
      setShowModal(false);
      setFormData({ name: "", category: "", description: "", stage: "MVP", funding_stage: "Seed", hq_location: "", team_size: 5, value_proposition: "", icp: "" });
      fetchProfiles();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Startup Engine</h1>
          <p className="text-sm text-white/40 mt-1">AI-powered product understanding & positioning</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Rocket size={16} /> Onboard Startup
        </button>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-white/10 animate-spin" />
          <p className="text-sm text-white/20 font-medium">Syncing startup ecosystem...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {profiles.map((s, i) => (
              <motion.div 
                key={s.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.05 }} 
                className="glass-card p-5 group hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white text-lg font-bold group-hover:bg-white/[0.06] transition-colors">
                      {s.name[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{s.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{s.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10 bg-white/5 text-white/60 uppercase tracking-wider`}>
                    {s.stage}
                  </span>
                </div>
                
                <p className="text-xs text-white/40 mb-4 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9px] text-white/20 uppercase font-bold">Funding</p>
                    <p className="text-xs font-semibold text-white/80">{s.funding_stage}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9px] text-white/20 uppercase font-bold">HQ</p>
                    <p className="text-xs font-semibold text-white/80">{s.hq_location || 'Remote'}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] mb-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Zap size={10} className="text-white/60" />
                    <p className="text-[9px] text-white/40 uppercase font-bold">Value Proposition</p>
                  </div>
                  <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed italic">
                    "{s.value_proposition}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Target size={12} className="text-white/20" />
                    <span className="text-[10px] text-white/20 font-medium">ICP: {s.icp?.slice(0, 20)}...</span>
                  </div>
                  <button className="text-[10px] font-bold text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-wider transition-colors">
                    View Strategy <Plus size={10} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {profiles.length === 0 && (
            <button 
              onClick={() => setShowModal(true)}
              className="glass-card p-10 border-dashed flex flex-col items-center justify-center gap-4 text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-all"
            >
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">
                <Plus size={24} />
              </div>
              <p className="text-sm font-medium">Add your first startup profile</p>
            </button>
          )}
        </div>
      )}

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Rocket size={18} className="text-white" /> Startup Onboarding
                  </h3>
                  <p className="text-[11px] text-white/40 uppercase tracking-widest font-bold mt-0.5">Initialize GTM Intelligence</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleOnboard} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      Company Name <Info size={10} />
                    </label>
                    <input required className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="MediFlow Nexus" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Category</label>
                    <input required className="input-field" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="HealthTech / SaaS" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
                  <textarea required rows={3} className="input-field resize-none py-3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="What are you building?" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Stage</label>
                    <select className="input-field" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})}>
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Funding</label>
                    <select className="input-field" value={formData.funding_stage} onChange={(e) => setFormData({...formData, funding_stage: e.target.value})}>
                      {FUNDING.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">HQ Location</label>
                    <input className="input-field" value={formData.hq_location} onChange={(e) => setFormData({...formData, hq_location: e.target.value})} placeholder="San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Team Size</label>
                    <input type="number" className="input-field" value={formData.team_size} onChange={(e) => setFormData({...formData, team_size: parseInt(e.target.value)})} placeholder="10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Value Proposition</label>
                  <input required className="input-field" value={formData.value_proposition} onChange={(e) => setFormData({...formData, value_proposition: e.target.value})} placeholder="AI-driven reimbursement optimization..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ideal Customer Profile (ICP)</label>
                  <textarea rows={2} className="input-field resize-none py-3" value={formData.icp} onChange={(e) => setFormData({...formData, icp: e.target.value})} placeholder="Mid-sized oncology clinics with high claim denial rates..." />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3 text-xs font-bold uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                    Launch Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

