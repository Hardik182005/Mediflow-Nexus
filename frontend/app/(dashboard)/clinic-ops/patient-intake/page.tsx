"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Filter, FileText, CheckCircle, AlertCircle, Clock, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusOptions = ['intake', 'verified', 'authorized', 'in_treatment', 'completed', 'dropped'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'intake': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case 'verified': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case 'authorized': return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case 'in_treatment': return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case 'completed': return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    case 'dropped': return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const getScoreColor = (score: number) => {
  return "text-white/60";
};

const getScoreBar = (score: number) => {
  return "bg-white";
};

export default function PatientIntakePage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    insurance_provider: "",
    policy_number: "",
    diagnosis_code: "",
    status: "intake"
  });

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // For demo/dev purposes, if no clinic_id is assigned to user yet, we'll use a placeholder
    // In production, user.clinic_id would be mandatory
    const clinic_id = "00000000-0000-0000-0000-000000000000"; 

    const { error } = await supabase
      .from('patients')
      .insert([{
        ...formData,
        clinic_id: user?.user_metadata?.clinic_id || clinic_id,
        treatment_readiness_score: Math.floor(Math.random() * 40) + 40, // Mock AI calculation
        document_completeness: Math.floor(Math.random() * 30) + 20     // Mock initial scan
      }]);

    if (!error) {
      setShowModal(false);
      setFormData({ first_name: "", last_name: "", insurance_provider: "", policy_number: "", diagnosis_code: "", status: "intake" });
      fetchPatients();
    }
    setIsSubmitting(false);
  };

  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.insurance_provider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Patients", value: patients.length.toString(), icon: UserPlus, color: "white" },
    { label: "Avg Readiness", value: patients.length ? `${Math.round(patients.reduce((acc, p) => acc + (p.treatment_readiness_score || 0), 0) / patients.length)}%` : "0%", icon: CheckCircle, color: "white" },
    { label: "Docs Incomplete", value: patients.filter(p => p.document_completeness < 80).length.toString(), icon: AlertCircle, color: "white" },
    { label: "Recent Additions", value: patients.filter(p => new Date(p.created_at) > new Date(Date.now() - 86400000)).length.toString(), icon: Clock, color: "white" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patient Intake Intelligence</h1>
          <p className="text-sm text-white/40 mt-1">Smart intake, document tracking & readiness scoring</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={16} /> New Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0]" />
          <input 
            type="text" 
            placeholder="Search patients by name or insurance..." 
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary flex items-center gap-2"><Filter size={14} /> Filter</button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
              <p className="text-sm text-white/20">Accessing secure health records...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Insurance</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>Readiness</th>
                  <th>Doc Complete</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((p, i) => (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }} 
                      className="cursor-pointer"
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center text-xs font-bold border border-white/[0.1] uppercase">
                            {p.first_name[0]}{p.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{p.first_name} {p.last_name}</p>
                            <p className="text-[10px] font-mono text-white/20">{p.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-sm text-white/60">{p.insurance_provider}</p>
                        <p className="text-xs text-white/20">{p.policy_number}</p>
                      </td>
                      <td><code className="text-xs bg-white/[0.03] border border-white/[0.06] text-[#c7c4d7] px-1.5 py-0.5 rounded">{p.diagnosis_code || 'N/A'}</code></td>
                      <td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(p.status)}`}>{p.status.replace("_", " ")}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-white" 
                              style={{ width: `${p.treatment_readiness_score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-white/60">{p.treatment_readiness_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-emerald-500" 
                              style={{ width: `${p.document_completeness}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-emerald-400/60">{p.document_completeness}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {!loading && filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-white/20 italic">No patients found. Click "New Patient" to begin.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus size={18} className="text-white" /> New Patient Intake
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">First Name</label>
                    <input required className="input-field" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="Jane" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Last Name</label>
                    <input required className="input-field" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Insurance Provider</label>
                    <input className="input-field" value={formData.insurance_provider} onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})} placeholder="UnitedHealthcare" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Policy ID</label>
                    <input className="input-field" value={formData.policy_number} onChange={(e) => setFormData({...formData, policy_number: e.target.value})} placeholder="UHC-9988-X" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Diagnosis Code (ICD-10)</label>
                    <input className="input-field" value={formData.diagnosis_code} onChange={(e) => setFormData({...formData, diagnosis_code: e.target.value})} placeholder="F32.9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Intake Status</label>
                    <select className="input-field" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Finalize Intake
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

