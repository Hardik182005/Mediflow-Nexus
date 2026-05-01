"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle, XCircle, Clock, DollarSign, FileText } from "lucide-react";
import { insuranceCases } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

const getStatusBadge = (s: string) => {
  const m: Record<string, string> = { verified: "badge-success", pending: "badge-warning", expired: "badge-danger", denied: "badge-danger" };
  return m[s] || "badge-neutral";
};

export default function InsurancePage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Insurance Intelligence (VOB)</h1>
          <p className="text-sm text-surface-400 mt-1">Benefits verification, eligibility tracking & cost transparency</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Shield size={16} /> Verify New</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Coverages", value: "71", icon: CheckCircle, color: "#10b981" },
          { label: "Pending VOB", value: "18", icon: Clock, color: "#f59e0b" },
          { label: "Expiring Soon", value: "5", icon: AlertTriangle, color: "#ef4444" },
          { label: "Avg Reimbursement", value: "$1,080", icon: DollarSign, color: "#3b82f6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><s.icon size={18} style={{ color: s.color }} /></div>
              <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-surface-400">{s.label}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Provider</th><th>CPT</th><th>Status</th><th>Deductible</th><th>Copay</th><th>OOP Max</th><th>Expiry</th></tr>
            </thead>
            <tbody>
              {insuranceCases.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <td>
                    <p className="text-sm font-medium text-white">{c.patientName}</p>
                    <p className="text-xs text-surface-500">{c.policyNumber}</p>
                  </td>
                  <td className="text-sm">{c.insuranceProvider}</td>
                  <td><code className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">{c.cptCode}</code></td>
                  <td><span className={`badge ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                  <td>
                    <div>
                      <p className="text-sm text-white">{formatCurrency(c.deductibleMet)} / {formatCurrency(c.deductible)}</p>
                      <div className="w-20 h-1.5 bg-white/[0.06] rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(c.deductibleMet / c.deductible) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{formatCurrency(c.copay)}</td>
                  <td>
                    <div>
                      <p className="text-sm text-white">{formatCurrency(c.outOfPocketMet)} / {formatCurrency(c.outOfPocketMax)}</p>
                      <div className="w-20 h-1.5 bg-white/[0.06] rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(c.outOfPocketMet / c.outOfPocketMax) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-surface-300">{c.expiryDate}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
