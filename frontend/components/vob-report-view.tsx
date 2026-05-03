"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, XCircle, Info, User, 
  CreditCard, Home, DollarSign, Ban, FileText, 
  Globe, Zap, ArrowRight, Printer, Share2, CheckCircle2
} from "lucide-react";
import type { VOBReport } from "@/types/vob";

interface VOBReportViewProps {
  report: VOBReport;
}

const riskStyles = {
  Low: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: CheckCircle2,
    banner: "bg-emerald-500",
    label: "Safe to Proceed"
  },
  Medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: AlertTriangle,
    banner: "bg-amber-500",
    label: "Proceed with Caution"
  },
  High: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    icon: XCircle,
    banner: "bg-red-500",
    label: "High Denial Risk"
  }
};

export default function VOBReportView({ report }: VOBReportViewProps) {
  const risk = riskStyles[report.ai_risk_assessment.risk_score];

  return (
    <div className="space-y-6">
      {/* Risk Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${risk.bg} ${risk.border} flex items-center justify-between`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${risk.banner} text-black`}>
            <risk.icon size={24} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${risk.text}`}>{report.ai_risk_assessment.risk_score} Risk — {risk.label}</h2>
            <p className="text-sm text-white/40 mt-0.5">
              AI Prediction: {report.ai_risk_assessment.denial_probability} Denial Probability
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Est. Reimbursement</p>
          <p className={`text-2xl font-bold ${risk.text}`}>{report.ai_risk_assessment.estimated_reimbursement}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Patient Info */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <User size={18} className="text-white/40" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Patient Information</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Name", value: report.patient_info.name },
                { label: "DOB", value: report.patient_info.dob },
                { label: "Policy #", value: report.patient_info.policy_number },
                { label: "Plan", value: report.patient_info.plan_name },
                { label: "Insurer", value: report.patient_info.insurance_company },
                { label: "Valid To", value: report.patient_info.valid_to },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[10px] text-white/20 uppercase font-bold mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-white/80">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 & 3: Coverage & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <ShieldCheck size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Coverage Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/20 uppercase font-bold">Sum Insured</p>
                    <p className="text-lg font-bold text-white">{report.coverage_summary.sum_insured}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/20 uppercase font-bold">Remaining</p>
                    <p className="text-lg font-bold text-emerald-400">{report.coverage_summary.remaining_balance}</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: "85%" }} />
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-white/20 uppercase font-bold mb-2">Waiting Periods</p>
                  {report.coverage_summary.waiting_periods.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-white/60 mb-1">
                      <Info size={12} className="text-amber-400" /> {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <Home size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hospitalization</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Room Type", value: report.hospitalization_benefits.room_type_allowed },
                  { label: "Room Rent Limit", value: report.hospitalization_benefits.room_rent_limit },
                  { label: "Day Care", value: report.hospitalization_benefits.day_care_procedures ? "Covered" : "Not Covered" },
                  { label: "In-patient", value: report.hospitalization_benefits.inpatient_covered ? "Fully Covered" : "Exclusions Apply" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-white/[0.03]">
                    <span className="text-white/40">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4 & 5: Financials & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <DollarSign size={18} className="text-white/40" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Financials</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[9px] text-white/20 uppercase font-bold mb-1">Co-payment</p>
                  <p className="text-sm font-bold text-white">{report.financials.copayment_percent}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[9px] text-white/20 uppercase font-bold mb-1">Deductible</p>
                  <p className="text-sm font-bold text-white">{report.financials.deductible}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-red-500/10">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                <Ban size={18} className="text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Major Exclusions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.exclusions.map((e, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded bg-red-500/5 text-red-400/80 border border-red-500/10">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Next Steps */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${risk.bg} ${risk.border}`}>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className={risk.text} />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Recommendations</h3>
            </div>
            <div className="space-y-4">
              {report.ai_risk_assessment.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${risk.banner}`} />
                  <p className="text-xs text-white/70 leading-relaxed font-medium">{r}</p>
                </div>
              ))}
            </div>
            <button className="btn-primary w-full mt-8 py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2">
              Generate Pre-Auth Request <ArrowRight size={14} />
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Network Status</h3>
            </div>
            <div className="p-4 rounded-xl bg-blue-400/5 border border-blue-400/10 text-center">
              <p className="text-lg font-bold text-blue-400">{report.network_status.status}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
                {report.network_status.cashless_eligible ? "✓ Cashless Eligible" : "⚠️ Reimbursement Basis"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2">
              <Printer size={16} /> <span className="text-xs font-bold uppercase">Print</span>
            </button>
            <button className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2">
              <Share2 size={16} /> <span className="text-xs font-bold uppercase">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
