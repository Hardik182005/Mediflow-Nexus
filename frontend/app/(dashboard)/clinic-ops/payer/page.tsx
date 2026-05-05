"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PayerPage() {
  const [payers, setPayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPayers = async () => {
      setLoading(true);
      const { data } = await supabase.from('insurance_cases').select('insurance_provider, status, denial_risk_score');
      if (data && data.length > 0) {
        const grouped: Record<string, { total: number; approved: number; denied: number; pending: number; riskSum: number }> = {};
        data.forEach((c) => {
          const p = c.insurance_provider || "Unknown";
          if (!grouped[p]) grouped[p] = { total: 0, approved: 0, denied: 0, pending: 0, riskSum: 0 };
          grouped[p].total++;
          if (c.status === 'verified') grouped[p].approved++;
          else if (c.status === 'denied') grouped[p].denied++;
          else grouped[p].pending++;
          grouped[p].riskSum += c.denial_risk_score || 0;
        });
        setPayers(Object.entries(grouped).map(([name, v]) => ({
          id: name, payerName: name, totalClaims: v.total, approvedClaims: v.approved, deniedClaims: v.denied, pendingClaims: v.pending,
          denialRate: v.total > 0 ? parseFloat(((v.denied / v.total) * 100).toFixed(1)) : 0,
          performanceScore: v.total > 0 ? Math.round(100 - (v.riskSum / v.total)) : 50,
          avgApprovalTime: 4.2, avgReimbursement: 1050, avgPaymentDelay: 17,
        })));
      } else {
        setPayers([
          { id: "1", payerName: "Blue Cross Blue Shield", totalClaims: 342, approvedClaims: 313, deniedClaims: 29, pendingClaims: 18, denialRate: 8.5, avgApprovalTime: 3.2, avgReimbursement: 1250, avgPaymentDelay: 14, performanceScore: 88 },
          { id: "2", payerName: "Aetna", totalClaims: 228, approvedClaims: 193, deniedClaims: 35, pendingClaims: 22, denialRate: 15.2, avgApprovalTime: 5.8, avgReimbursement: 980, avgPaymentDelay: 21, performanceScore: 72 },
          { id: "3", payerName: "UnitedHealthcare", totalClaims: 415, approvedClaims: 368, deniedClaims: 47, pendingClaims: 31, denialRate: 11.3, avgApprovalTime: 4.1, avgReimbursement: 1120, avgPaymentDelay: 18, performanceScore: 79 },
          { id: "4", payerName: "Cigna", totalClaims: 187, approvedClaims: 152, deniedClaims: 35, pendingClaims: 14, denialRate: 18.7, avgApprovalTime: 6.5, avgReimbursement: 890, avgPaymentDelay: 25, performanceScore: 64 },
          { id: "5", payerName: "Medicare", totalClaims: 523, approvedClaims: 495, deniedClaims: 28, pendingClaims: 8, denialRate: 5.3, avgApprovalTime: 2.1, avgReimbursement: 780, avgPaymentDelay: 12, performanceScore: 92 },
        ]);
      }
      setLoading(false);
    };
    fetchPayers();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 text-white/10 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Payer Intelligence</h1>
        <p className="text-sm text-white/40 mt-1">Compare payer performance, approval times & denial rates</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {payers.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-sm font-semibold text-white">{p.payerName}</h3><p className="text-xs text-white/40">{p.totalClaims} total claims</p></div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold bg-white/[0.06] border border-white/[0.1] text-white">{p.performanceScore}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"><p className="text-xs text-white/40 mb-1">Denial Rate</p><p className="text-sm font-bold text-white/60">{p.denialRate}%</p></div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"><p className="text-xs text-white/40 mb-1">Avg Approval</p><p className="text-sm font-bold text-white/60">{p.avgApprovalTime} days</p></div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"><p className="text-xs text-white/40 mb-1">Avg Reimburse</p><p className="text-sm font-bold text-white/60">${p.avgReimbursement}</p></div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"><p className="text-xs text-white/40 mb-1">Payment Delay</p><p className="text-sm font-bold text-white/60">{p.avgPaymentDelay} days</p></div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] overflow-hidden">
                <div className="h-full rounded-full bg-white" style={{ width: `${(p.approvedClaims / p.totalClaims) * 100}%` }} />
              </div>
              <span className="text-[10px] text-white/40">{Math.round((p.approvedClaims / p.totalClaims) * 100)}% approved</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Payer Performance Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payers} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="payerName" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "black", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="approvedClaims" fill="white" name="Approved" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deniedClaims" fill="rgba(255,255,255,0.3)" name="Denied" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendingClaims" fill="rgba(255,255,255,0.1)" name="Pending" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
