"use client";

import { motion } from "framer-motion";
import { FileCheck, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import { priorAuthCases } from "@/lib/demo-data";

const statusBadge: Record<string, string> = { approved: "badge-success", submitted: "badge-info", required: "badge-warning", denied: "badge-danger", not_required: "badge-neutral" };

export default function PriorAuthPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Prior Authorization Intelligence</h1>
          <p className="text-sm text-surface-400 mt-1">Requirement detection, packet generation & approval prediction</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><FileCheck size={16} /> New PA Request</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending PAs", value: "23", icon: Clock, color: "#f59e0b" },
          { label: "Approved", value: "45", icon: CheckCircle, color: "#10b981" },
          { label: "Denied", value: "8", icon: XCircle, color: "#ef4444" },
          { label: "Avg Approval Time", value: "3.4 days", icon: FileCheck, color: "#3b82f6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorAuthCases.map((pa, i) => (
          <motion.div key={pa.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center text-white text-sm font-bold">
                  {pa.patientName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{pa.patientName}</p>
                  <p className="text-xs text-surface-400">{pa.insuranceProvider} • {pa.id}</p>
                </div>
              </div>
              <span className={`badge ${statusBadge[pa.status]}`}>{pa.status.replace("_", " ")}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-surface-500">CPT Code</p>
                <code className="text-sm text-blue-400">{pa.cptCode}</code>
              </div>
              <div>
                <p className="text-xs text-surface-500">Diagnosis</p>
                <code className="text-sm text-surface-200">{pa.diagnosisCode}</code>
              </div>
              <div>
                <p className="text-xs text-surface-500">Auth Number</p>
                <p className="text-sm text-surface-200">{pa.authNumber || "—"}</p>
              </div>
            </div>

            {/* Approval Probability */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-surface-400">Approval Probability</span>
                <span className={`font-bold ${pa.approvalProbability >= 80 ? "text-emerald-400" : pa.approvalProbability >= 50 ? "text-amber-400" : "text-red-400"}`}>
                  {pa.approvalProbability}%
                </span>
              </div>
              <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pa.approvalProbability}%` }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className={`h-full rounded-full ${pa.approvalProbability >= 80 ? "bg-emerald-500" : pa.approvalProbability >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                />
              </div>
            </div>

            {/* Missing Docs */}
            {pa.missingDocuments.length > 0 && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-400">Missing Documents</p>
                  <p className="text-xs text-surface-300 mt-0.5">{pa.missingDocuments.join(", ")}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button className="btn-primary text-xs flex-1">Generate Packet</button>
              <button className="btn-secondary text-xs">View Details</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
