"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Filter, FileText, CheckCircle, AlertCircle, Clock, X, Loader2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const statusOptions = ['intake', 'verified', 'authorized', 'in_treatment', 'completed', 'dropped'];

const getStatusBadge = (status: string) => {
  return "bg-white text-black border-black";
};

const getScoreColor = (score: number) => {
  return "text-black";
};

const getScoreBar = (score: number) => {
  return "bg-black";
};

export default function PatientIntakePage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    try {
      console.log("[Patient Intake] Fetching patients...");
      const response = await fetch("/api/patients");
      const data = await response.json();
      console.log("[Patient Intake] Response:", JSON.stringify(data).slice(0, 200));
      
      if (!response.ok) {
        const errMsg = data.error || `HTTP ${response.status}`;
        console.error("[Patient Intake] API error:", errMsg);
        setError(errMsg);
        return;
      }
      
      if (Array.isArray(data)) {
        setPatients(data);
        console.log(`[Patient Intake] Loaded ${data.length} patients`);
      } else {
        console.error("Error fetching patients:", data.error);
        setError(data.error || "Unexpected response format");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add patient");
      }

      setShowModal(false);
      setFormData({ 
        first_name: "", 
        last_name: "", 
        insurance_provider: "", 
        policy_number: "", 
        diagnosis_code: "", 
        status: "intake" 
      });
      await fetchPatients();
      console.log("Patient added successfully:", result);
    } catch (err: any) {
      console.error("Unexpected error during patient intake:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.insurance_provider?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Patients", value: patients.length.toString(), icon: UserPlus, color: "black" },
    { label: "Avg Readiness", value: patients.length ? `${Math.round(patients.reduce((acc, p) => acc + (p.treatment_readiness_score || 0), 0) / patients.length)}%` : "0%", icon: CheckCircle, color: "black" },
    { label: "Docs Incomplete", value: patients.filter(p => p.document_completeness < 80).length.toString(), icon: AlertCircle, color: "black" },
    { label: "Recent Additions", value: patients.filter(p => new Date(p.created_at) > new Date(Date.now() - 86400000)).length.toString(), icon: Clock, color: "black" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Patient Intake Intelligence</h1>
          <p className="text-sm text-black mt-1">Smart intake, document tracking & readiness scoring</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={async () => {
              const res = await fetch("/api/debug/fix-rls");
              const data = await res.json();
              alert(data.message);
              fetchPatients();
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} /> Fix DB
          </button>
          <button 
            onClick={async () => {
              const res = await fetch("/api/debug/check-db");
              const data = await res.json();
              alert(data.message);
              fetchPatients();
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={16} /> Check Backend
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={16} /> New Patient
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Backend Error: {error}</span>
          </div>
          <button onClick={() => { setError(null); fetchPatients(); }} className="text-red-600 hover:text-red-800 text-sm font-bold">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white border border-black rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center">
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-black">{s.value}</p>
                <p className="text-xs text-black">{s.label}</p>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white border border-black rounded-2xl-static overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
              <p className="text-sm text-black">Accessing secure health records...</p>
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
                          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold border border-black uppercase">
                            {p.first_name[0]}{p.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-black">{p.first_name} {p.last_name}</p>
                            <p className="text-[10px] font-mono text-black">{p.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-sm text-black">{p.insurance_provider}</p>
                        <p className="text-xs text-black">{p.policy_number}</p>
                      </td>
                      <td><code className="text-xs bg-white border border-black text-black px-1.5 py-0.5 rounded">{p.diagnosis_code || 'N/A'}</code></td>
                      <td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(p.status)}`}>{p.status.replace("_", " ")}</span></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-black" 
                              style={{ width: `${p.treatment_readiness_score}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-black">{p.treatment_readiness_score}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-black" 
                              style={{ width: `${p.document_completeness}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-black">{p.document_completeness}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {!loading && filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-black italic">No patients found. Click "New Patient" to begin.</td>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white border border-black rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-black flex items-center justify-between">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <UserPlus size={18} className="text-black" /> New Patient Intake
                </h3>
                <button onClick={() => setShowModal(false)} className="text-black hover:text-black transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">First Name</label>
                    <input required className="input-field" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="Jane" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">Last Name</label>
                    <input required className="input-field" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">Insurance Provider</label>
                    <input className="input-field" value={formData.insurance_provider} onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})} placeholder="UnitedHealthcare" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">Policy ID</label>
                    <input className="input-field" value={formData.policy_number} onChange={(e) => setFormData({...formData, policy_number: e.target.value})} placeholder="UHC-9988-X" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">Diagnosis Code (ICD-10)</label>
                    <input className="input-field" value={formData.diagnosis_code} onChange={(e) => setFormData({...formData, diagnosis_code: e.target.value})} placeholder="F32.9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-black uppercase tracking-widest">Intake Status</label>
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

