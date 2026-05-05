"use client";

import { useState } from "react";
import { 
  Copy, Check, ChevronDown, Cpu, Target, User, Lightbulb, 
  Megaphone, PlayCircle, Search, BarChart3, PieChart, Hospital 
} from "lucide-react";
import type { GTMStrategy } from "@/types/gtm";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="btn-ghost p-1.5 text-white/30 hover:text-white/70">
      {copied ? <Check size={13} className="text-white/60" /> : <Copy size={13} />}
    </button>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-white/40" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <ChevronDown size={14} className={`text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 border-t border-white/[0.04]">{children}</div>}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">{label}</span>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
      <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-white/70">{value}</p>
    </div>
  );
}

interface Props {
  strategy: GTMStrategy;
  onReset: () => void;
}

export default function GTMResults({ strategy, onReset }: Props) {
  const { startupSummary: ss, productIntelligence: pi, icp, buyerPersona: bp, valueProposition: vp, messaging, demoStrategy, buyerDiscovery, salesStrategy, roiImpact, marketplaceMatch } = strategy;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">{ss.companyName || "GTM Strategy"}</h1>
          <p className="text-[13px] text-white/40 mt-1">"{ss.tagline}"</p>
        </div>
        <button onClick={onReset} className="btn-secondary text-xs">← New Analysis</button>
      </div>

      {/* Summary Bar */}
      <div className="glass-card p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Industry", value: ss.industry },
          { label: "Product Type", value: ss.productType },
          { label: "Stage", value: ss.stage },
          { label: "Deployment", value: pi.deploymentType },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-bold">{item.label}</p>
            <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Section 2: Product Intelligence */}
      <Section title="Product Intelligence" icon={Cpu} defaultOpen>
        <div className="pt-3 space-y-3">
          <Row label="Problem" value={pi.problemStatement} />
          <Row label="Solution" value={pi.solutionDescription} />
          <Row label="Differentiation" value={pi.differentiation} />
          <div className="grid grid-cols-3 gap-3">
            <Row label="Complexity" value={pi.complexityLevel} />
            <Row label="Pricing" value={pi.pricingModel} />
            <Row label="Deployment" value={pi.deploymentType} />
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Key Features</p>
            <div className="flex flex-wrap gap-2">{pi.keyFeatures.map((f) => <Tag key={f} label={f} />)}</div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Key Benefits</p>
            <div className="flex flex-wrap gap-2">{pi.keyBenefits.map((b) => <Tag key={b} label={b} />)}</div>
          </div>
        </div>
      </Section>

      {/* Section 3: ICP */}
      <Section title="Ideal Customer Profile" icon={Target}>
        <div className="pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Row label="Org Size" value={icp.organizationSize} />
            <Row label="Geography" value={icp.geography} />
            <Row label="Tech Maturity" value={icp.technologyMaturity} />
            <Row label="Annual Revenue" value={icp.annualRevenue} />
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Target Segments</p>
            <div className="flex flex-wrap gap-2">{icp.targetSegments.map((s) => <Tag key={s} label={s} />)}</div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Specializations</p>
            <div className="flex flex-wrap gap-2">{icp.specializations.map((s) => <Tag key={s} label={s} />)}</div>
          </div>
        </div>
      </Section>

      {/* Section 4: Buyer Persona */}
      <Section title="Buyer Persona" icon={User}>
        <div className="pt-3 space-y-3">
          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <p className="text-xs font-semibold text-white mb-1">Primary Buyer: {bp.primaryBuyer.title}</p>
            <p className="text-xs text-white/50 mb-2">{bp.primaryBuyer.motivation}</p>
            <div className="flex flex-wrap gap-1">{bp.primaryBuyer.painPoints.map((p) => <Tag key={p} label={p} />)}</div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Secondary Buyers</p>
            <div className="space-y-2">
              {bp.secondaryBuyers.map((b) => (
                <div key={b.title} className="flex items-center justify-between p-2 rounded bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-xs text-white font-medium">{b.title}</span>
                  <span className="text-xs text-white/40">{b.role}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Buying Triggers</p>
            <div className="flex flex-wrap gap-2">{bp.buyingTriggers.map((t) => <Tag key={t} label={t} />)}</div>
          </div>
        </div>
      </Section>

      {/* Section 5: Value Proposition */}
      <Section title="Value Proposition" icon={Lightbulb}>
        <div className="pt-3 space-y-3">
          <div className="p-4 rounded-lg bg-white/[0.04] border border-white/[0.1] text-center">
            <p className="text-base font-bold text-white">"{vp.headline}"</p>
          </div>
          <div className="space-y-2">
            {vp.statements.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-white/20 text-xs mt-0.5">→</span>
                <p className="text-sm text-white/60">{s}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-white/30">Estimated ROI</span>
            <span className="text-sm font-bold text-white">{vp.roi}</span>
          </div>
        </div>
      </Section>

      {/* Section 6: Messaging */}
      <Section title="Messaging Engine" icon={Megaphone}>
        <div className="pt-3 space-y-3">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Elevator Pitch</p>
              <CopyButton text={messaging.elevatorPitch} />
            </div>
            <p className="text-sm text-white/70 italic">"{messaging.elevatorPitch}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Tagline</p>
              <CopyButton text={messaging.tagline} />
            </div>
            <p className="text-sm font-semibold text-white">"{messaging.tagline}"</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Email Outreach</p>
              <CopyButton text={`Subject: ${messaging.emailOutreach.subject}\n\n${messaging.emailOutreach.body}`} />
            </div>
            <p className="text-xs text-white/40 font-medium mb-1">Subject: {messaging.emailOutreach.subject}</p>
            <p className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">{messaging.emailOutreach.body}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">LinkedIn Message</p>
              <CopyButton text={messaging.linkedinOutreach} />
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{messaging.linkedinOutreach}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Key Marketing Points</p>
            <div className="space-y-1">
              {messaging.keyMarketingPoints.map((pt, i) => (
                <div key={i} className="flex gap-2 items-start p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-white/20 text-xs mt-0.5">✦</span>
                  <p className="text-xs text-white/60">{pt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Full Sales Pitch</p>
              <CopyButton text={messaging.salesPitch} />
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{messaging.salesPitch}</p>
          </div>
        </div>
      </Section>

      {/* Section 7: Demo Strategy */}
      <Section title="Demo Strategy" icon={PlayCircle}>
        <div className="pt-3 space-y-3">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Workflow Steps</p>
            <div className="space-y-2">
              {demoStrategy.workflowSteps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/[0.08] text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-xs text-white/60 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Objection Handling</p>
            <div className="space-y-2">
              {demoStrategy.objectionHandling.map((obj, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-white/40 font-medium mb-1">❓ {obj.objection}</p>
                  <p className="text-xs text-white/60">✓ {obj.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 8: Buyer Discovery */}
      <Section title="Buyer Discovery" icon={Search}>
        <div className="pt-3 space-y-3">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Target Clinic Types</p>
            <div className="flex flex-wrap gap-2">{buyerDiscovery.targetClinicTypes.map((t) => <Tag key={t} label={t} />)}</div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Sample Buyer Profiles</p>
            <div className="space-y-2">
              {buyerDiscovery.sampleBuyerProfiles.map((b, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white">{b.orgName}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.08]">{b.type}</span>
                  </div>
                  <p className="text-xs text-white/40">{b.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Referral Partners</p>
              <div className="flex flex-wrap gap-1">{buyerDiscovery.referralPartners.map((p) => <Tag key={p} label={p} />)}</div>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Strategic Partnerships</p>
              <div className="flex flex-wrap gap-1">{buyerDiscovery.strategicPartnerships.map((p) => <Tag key={p} label={p} />)}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 9: Sales Strategy */}
      <Section title="Sales Strategy" icon={BarChart3}>
        <div className="pt-3 space-y-3">
          <Row label="Sales Approach" value={salesStrategy.approach} />
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Sales Funnel</p>
            <div className="flex items-center gap-2 flex-wrap">
              {salesStrategy.funnel.map((stage, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 font-medium">{stage}</span>
                  {i < salesStrategy.funnel.length - 1 && <span className="text-white/20 text-xs">→</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Objections & Solutions</p>
            <div className="space-y-2">
              {salesStrategy.objections.map((obj, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-white/40 font-medium mb-1">⚠ {obj.objection}</p>
                  <p className="text-xs text-white/60">→ {obj.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 10: ROI Impact */}
      <Section title="ROI & Business Impact" icon={PieChart}>
        <div className="pt-3 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Revenue Impact", value: roiImpact.revenueImpact },
              { label: "Cost Savings", value: roiImpact.costSavings },
              { label: "Efficiency Gain", value: roiImpact.efficiencyGain },
              { label: "Payback Period", value: roiImpact.paybackPeriod },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-2">Key Metrics</p>
            <div className="flex flex-wrap gap-2">{roiImpact.metrics.map((m) => <Tag key={m} label={m} />)}</div>
          </div>
        </div>
      </Section>

      {/* Section 11: Marketplace Match */}
      <Section title="Marketplace Match" icon={Hospital}>
        <div className="pt-3 space-y-3">
          <div className="space-y-2">
            {marketplaceMatch.idealMatches.map((match, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-white">{match.clinicType}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${match.fitScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white/60">{match.fitScore}%</span>
                  </div>
                </div>
                <p className="text-xs text-white/40">{match.reason}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.1]">
            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-1">Recommended Action</p>
            <p className="text-sm text-white/70">{marketplaceMatch.recommendedAction}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
