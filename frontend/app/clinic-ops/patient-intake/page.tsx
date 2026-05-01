"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Filter, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { patients } from "@/lib/demo-data";

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    intake: "badge-warning", verified: "badge-info", authorized: "badge-success",
    in_treatment: "badge-success", completed: "badge-neutral", dropped: "badge-danger",
  };
  return map[status] || "badge-neutral";
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
};

const getScoreBar = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

export default function PatientIntakePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Patient Intake Intelligence</h1>
          <p className="text-sm text-surface-400 mt-1">Smart intake, document tracking & readiness scoring</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={16} /> New Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Patients", value: "255", icon: UserPlus, color: "#3b82f6" },
          { label: "Avg Readiness", value: "77%", icon: CheckCircle, color: "#10b981" },
          { label: "Docs Incomplete", value: "12", icon: AlertCircle, color: "#f59e0b" },
          { label: "Avg Intake Time", value: "4.2 min", icon: Clock, color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-surface-400">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search patients by name, ID, or diagnosis..." className="input-field pl-10" />
        </div>
        <button className="btn-secondary flex items-center gap-2"><Filter size={14} /> Filter</button>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Insurance</th>
                <th>Diagnosis</th>
                <th>CPT Codes</th>
                <th>Status</th>
                <th>Readiness</th>
                <th>Doc Complete</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="cursor-pointer">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-bold">
                        {p.firstName[0]}{p.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-surface-500">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm">{p.insuranceProvider}</p>
                    <p className="text-xs text-surface-500">{p.policyNumber}</p>
                  </td>
                  <td><code className="text-xs bg-white/[0.04] px-1.5 py-0.5 rounded">{p.diagnosisCode}</code></td>
                  <td>
                    <div className="flex gap-1">
                      {p.cptCodes.map((c) => (
                        <code key={c} className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{c}</code>
                      ))}
                    </div>
                  </td>
                  <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status.replace("_", " ")}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getScoreBar(p.treatmentReadinessScore)}`} style={{ width: `${p.treatmentReadinessScore}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${getScoreColor(p.treatmentReadinessScore)}`}>{p.treatmentReadinessScore}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${getScoreBar(p.documentCompleteness)}`} style={{ width: `${p.documentCompleteness}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${getScoreColor(p.documentCompleteness)}`}>{p.documentCompleteness}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
