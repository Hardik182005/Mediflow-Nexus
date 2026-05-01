"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import type { VOBReport } from "@/types/vob";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="btn-ghost p-1.5 text-white/30 hover:text-white/70">
      {copied ? <Check size={12} className="text-white/60" /> : <Copy size={12} />}
    </button>
  );
}

function Section({ title, icon, badge, badgeVariant = "neutral", children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; badge?: string;
  badgeVariant?: "neutral" | "high" | "medium" | "low"; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const badgeStyle = {
    high: "bg-white/10 text-white border border-white/20",
    medium: "bg-white/[0.06] text-white/60 border border-white/10",
    low: "bg-white/[0.03] text-white/30 border border-white/[0.06]",
    neutral: "bg-white/[0.06] text-white/40 border border-white/[0.08]",
  }[badgeVariant];

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-white/60">{icon}</span>
          <span className="text-sm font-semibold text-white">{title}</span>
          {badge && <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badgeStyle}`}>{badge}</span>}
        </div>
        <ChevronDown size={13} className={`text-white/20 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">{children}</div>}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">{label}</p>
      <p className="text-sm text-white/70">{value || "—"}</p>
    </div>
  );
}

function RiskPill({ level }: { level: "Low" | "Medium" | "High" }) {
  const styles = { High: "bg-white/10 text-white border-white/20", Medium: "bg-white/[0.06] text-white/60 border-white/10", Low: "bg-white/[0.03] text-white/30 border-white/[0.06]" };
  return <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${styles[level]}`}>{level} Risk</span>;
}

function StatusPill({ status }: { status: string }) {
  const isGood = ["Active", "Covered", "Not Required", "Ready", "Proceed with scheduling"].includes(status);
  const isBad = ["Inactive", "Not Covered", "Required", "Not Ready", "Hold until prior auth"].includes(status);
  const style = isGood ? "bg-white/10 text-white border-white/20" : isBad ? "bg-white/[0.04] text-white/40 border-white/[0.08]" : "bg-white/[0.06] text-white/50 border-white/[0.1]";
  return <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${style}`}>{status}</span>;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "text-white" : score >= 50 ? "text-white/60" : "text-white/30";
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeWidth="5"
            strokeDasharray={`${(score / 100) * 138} 138`} strokeLinecap="round" strokeOpacity={score / 100} />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-white">Data Confidence</p>
        <p className="text-[10px] text-white/30">{score >= 75 ? "High confidence" : score >= 50 ? "Moderate — review assumptions" : "Low — verify manually"}</p>
      </div>
    </div>
  );
}

interface Props { report: VOBReport; onReset: () => void; }

export default function VOBResults({ report, onReset }: Props) {
  const { insuranceSummary: is, dataConfidence: dc, coverageBenefits: cb, priorAuth: pa, denialRisk: dr, revenueIntelligence: ri, operationalRecommendation: or_, patientSummary: ps } = report;

  return (
    <div className="space-y-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{is.patientName}</p>
            <p className="text-xs text-white/30">{is.payerName} · {is.planType} · {is.memberId}</p>
          </div>
          <StatusPill status={is.coverageStatus} />
        </div>
        <button onClick={onReset} className="btn-secondary text-xs">← New Analysis</button>
      </div>

      {/* Operational Recommendation Banner */}
      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {or_.action.includes("Proceed") ? <CheckCircle size={18} className="text-white mt-0.5" /> :
           or_.action.includes("Hold") ? <Clock size={18} className="text-white/40 mt-0.5" /> :
           <AlertTriangle size={18} className="text-white/60 mt-0.5" />}
          <div>
            <p className="text-sm font-bold text-white">{or_.action}</p>
            <p className="text-xs text-white/40 mt-0.5">{or_.reasoning}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <RiskPill level={dr.level} />
        </div>
      </div>

      {/* Section 1: Insurance Summary */}
      <Section title="Insurance Summary" icon={<Shield size={15} />} defaultOpen>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Field label="Payer" value={is.payerName} />
          <Field label="Plan Type" value={is.planType} />
          <Field label="Member ID" value={is.memberId} />
          <Field label="Group Number" value={is.groupNumber} />
          <Field label="Patient Name" value={is.patientName} />
          <Field label="Date of Birth" value={is.dob} />
        </div>
      </Section>

      {/* Section 2: Data Confidence */}
      <Section title="Data Confidence & Issues" icon={<CheckCircle size={15} />} badge={`${dc.score}/100`}>
        <div className="space-y-3">
          <ScoreRing score={dc.score} />
          {dc.missingFields.length > 0 && (
            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Missing Fields</p>
              <div className="flex flex-wrap gap-1.5">
                {dc.missingFields.map((f) => <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40">{f}</span>)}
              </div>
            </div>
          )}
          {dc.assumptions.length > 0 && (
            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Assumptions Made</p>
              <div className="space-y-1">
                {dc.assumptions.map((a, i) => <p key={i} className="text-xs text-white/40 flex gap-2"><span className="text-white/20">·</span>{a}</p>)}
              </div>
            </div>
          )}
          {dc.conflicts.length > 0 && (
            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Conflicts Detected</p>
              <div className="space-y-1">
                {dc.conflicts.map((c, i) => <p key={i} className="text-xs text-white/40 flex gap-2"><span>⚠</span>{c}</p>)}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Section 3: Coverage & Benefits */}
      <Section title="Coverage & Benefits (VOB)" icon={<CheckCircle size={15} />} badge={cb.coverageStatus} badgeVariant={cb.coverageStatus === "Active" ? "high" : "neutral"}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill status={cb.coverageStatus} />
            <StatusPill status={cb.serviceEligibility} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Field label="Deductible (Total)" value={cb.deductibleTotal} />
            <Field label="Deductible Remaining" value={cb.deductibleRemaining} />
            <Field label="Copay" value={cb.copay} />
            <Field label="Coinsurance" value={cb.coinsurance} />
            <Field label="OOP Max" value={cb.outOfPocketMax} />
            <Field label="OOP Met" value={cb.outOfPocketMet} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1">Patient Responsibility Est.</p>
              <p className="text-lg font-bold text-white">{cb.patientResponsibilityEstimate}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-center">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1">Expected Reimbursement</p>
              <p className="text-lg font-bold text-white">{cb.expectedReimbursement}</p>
            </div>
          </div>
          {cb.notes.length > 0 && (
            <div className="space-y-1">
              {cb.notes.map((n, i) => <p key={i} className="text-xs text-white/40 flex gap-2"><span className="text-white/20">→</span>{n}</p>)}
            </div>
          )}
        </div>
      </Section>

      {/* Section 4: Prior Auth */}
      <Section title="Prior Authorization Status" icon={<Clock size={15} />} badge={pa.required} badgeVariant={pa.required === "Not Required" ? "low" : pa.required === "Required" ? "high" : "medium"}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <StatusPill status={pa.required} />
            <StatusPill status={pa.submissionReadiness} />
          </div>
          {pa.requiredDocuments.length > 0 && (
            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Required Documents</p>
              <div className="space-y-1">
                {pa.requiredDocuments.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                    {pa.missingDocuments.includes(d)
                      ? <XCircle size={12} className="text-white/30 flex-shrink-0" />
                      : <CheckCircle size={12} className="text-white/60 flex-shrink-0" />}
                    <span className="text-xs text-white/50">{d}</span>
                    {pa.missingDocuments.includes(d) && <span className="text-[10px] text-white/20 ml-auto">Missing</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {pa.notes && <p className="text-xs text-white/40 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">{pa.notes}</p>}
        </div>
      </Section>

      {/* Section 5: Denial Risk */}
      <Section title="Denial Risk & Mitigation" icon={<AlertTriangle size={15} />} badge={`${dr.level} Risk`} badgeVariant={dr.level === "High" ? "high" : dr.level === "Medium" ? "medium" : "low"}>
        <div className="space-y-3">
          <RiskPill level={dr.level} />
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Risk Factors</p>
            <div className="space-y-1">
              {dr.reasons.map((r, i) => <p key={i} className="text-xs text-white/50 flex gap-2"><span>⚠</span>{r}</p>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Mitigation Steps</p>
            <div className="space-y-1">
              {dr.mitigationSteps.map((s, i) => <p key={i} className="text-xs text-white/60 flex gap-2"><span className="text-white/30">✓</span>{s}</p>)}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 6: Revenue Intelligence */}
      <Section title="Revenue Intelligence" icon={<Shield size={15} />}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-center">
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">Expected Reimbursement</p>
              <p className="text-base font-bold text-white">{ri.expectedReimbursementRange}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-center">
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1">Patient Responsibility</p>
              <p className="text-base font-bold text-white">{ri.patientResponsibilityRange}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
              <p className="text-[10px] text-white/20 font-bold mb-0.5">Revenue at Risk</p>
              <RiskPill level={ri.revenueAtRisk} />
            </div>
            <div className="flex-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-center">
              <p className="text-[10px] text-white/20 font-bold mb-0.5">Delay Risk</p>
              <RiskPill level={ri.delayRisk} />
            </div>
          </div>
          {ri.revenueNotes.length > 0 && (
            <div className="space-y-1">
              {ri.revenueNotes.map((n, i) => <p key={i} className="text-xs text-white/40 flex gap-2"><span className="text-white/20">·</span>{n}</p>)}
            </div>
          )}
        </div>
      </Section>

      {/* Section 7: Operational Recommendation */}
      <Section title="Operational Recommendation" icon={<CheckCircle size={15} />} badge={or_.action.split(" ").slice(0, 2).join(" ")} defaultOpen>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.1]">
            <p className="text-sm font-semibold text-white mb-1">{or_.action}</p>
            <p className="text-xs text-white/50">{or_.reasoning}</p>
          </div>
          {or_.urgentActions.length > 0 && (
            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Urgent Actions</p>
              <div className="space-y-1">
                {or_.urgentActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-white/40 text-xs mt-0.5">→</span>
                    <p className="text-xs text-white/60">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Section 8: Patient Summary */}
      <Section title="Patient-Friendly Summary" icon={<Shield size={15} />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold">Patient Summary</p>
            <CopyButton text={`Estimated Cost: ${ps.estimatedCost}\n\nWhat Insurance Covers: ${ps.whatInsuranceCovers}\n\nNext Steps:\n${ps.nextSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Your Estimated Cost" value={ps.estimatedCost} />
            <Field label="What Insurance Covers" value={ps.whatInsuranceCovers} />
          </div>
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold mb-1.5">Next Steps for Patient</p>
            <div className="space-y-1">
              {ps.nextSteps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/[0.08] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-xs text-white/60 pt-0.5">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
