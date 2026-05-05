"use client";

import { motion } from "framer-motion";
import { Check, Zap, Building2, Rocket, ArrowRight, HelpCircle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "For small clinics and early-stage startups getting started with healthcare intelligence.",
    highlight: false,
    features: [
      "Up to 500 patients/month",
      "Basic VOB Verification",
      "GTM Strategy Generator",
      "5 AI Pitch Decks/month",
      "Email Support",
      "1 User Seat",
      "Basic Reports",
      "Community Access",
    ],
    cta: "Start Free Trial",
    action: "trial",
    icon: Zap,
  },
  {
    name: "Professional",
    price: "$1,499",
    period: "/month",
    description: "For growing clinics and funded startups scaling their operations and outreach.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 5,000 patients/month",
      "AI-Powered VOB + Denial Prediction",
      "Buyer Discovery (30+ hospitals)",
      "Unlimited AI Pitch Decks",
      "AI Email Outreach Drafter",
      "Priority Support (24h SLA)",
      "10 User Seats",
      "Revenue Intelligence Dashboard",
      "Payer Analytics",
      "Sales Pipeline (Kanban)",
      "API Access",
    ],
    cta: "Start Free Trial",
    action: "trial",
    icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For hospital networks and health systems requiring full platform deployment.",
    highlight: false,
    features: [
      "Unlimited patients",
      "Full AI Intelligence Suite",
      "Custom buyer datasets",
      "White-label deployment",
      "Dedicated account manager",
      "SSO & RBAC",
      "Unlimited seats",
      "Custom integrations (Epic, Cerner)",
      "HIPAA BAA included",
      "NABH/JCI compliance modules",
      "On-premise option",
      "99.9% SLA guarantee",
    ],
    cta: "Contact Sales",
    action: "contact",
    icon: Rocket,
  },
];

const faqs = [
  { q: "Is there a free trial?", a: "Yes. All plans include a 14-day free trial with full access. No credit card required." },
  { q: "Can I switch plans?", a: "Absolutely. Upgrade or downgrade at any time. Changes are prorated." },
  { q: "Is patient data secure?", a: "Yes. All data is encrypted at rest and in transit. We are HIPAA-ready and SOC2 compliant." },
  { q: "Do you support Indian insurance?", a: "Yes. Our VOB engine supports Star Health, ICICI Lombard, HDFC ERGO, and 50+ Indian insurers." },
  { q: "What about Singapore / ASEAN?", a: "MediFlow Nexus is designed for global healthcare markets including Singapore, Malaysia, Thailand, and the UAE. Our GTM engine includes ASEAN hospital datasets." },
];

export default function PricingPage() {
  const router = useRouter();

  const handleCTA = (action: string) => {
    if (action === "trial") {
      router.push("/launch-engine/onboarding");
    } else if (action === "contact") {
      window.location.href = "mailto:sales@mediflownexus.com?subject=Enterprise%20Inquiry";
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-16 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-white/60 mb-6">
            <Shield size={12} /> SOC2 + HIPAA Compliant
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-lg">
            Start free. Scale when ready. No hidden fees. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
              tier.highlight
                ? "bg-white text-black border-2 border-white shadow-[0_0_60px_rgba(255,255,255,0.1)] scale-[1.02]"
                : "glass-card hover:border-white/20"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
                {tier.badge}
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tier.highlight ? "bg-black/10" : "bg-white/[0.06] border border-white/[0.1]"
              }`}>
                <tier.icon size={20} className={tier.highlight ? "text-black" : "text-white"} />
              </div>
              <h3 className={`text-lg font-bold ${tier.highlight ? "text-black" : "text-white"}`}>
                {tier.name}
              </h3>
            </div>

            <div className="mb-4">
              <span className={`text-4xl font-extrabold tracking-tight ${tier.highlight ? "text-black" : "text-white"}`}>
                {tier.price}
              </span>
              <span className={`text-sm ${tier.highlight ? "text-black/40" : "text-white/40"}`}>
                {tier.period}
              </span>
            </div>

            <p className={`text-sm mb-6 leading-relaxed ${tier.highlight ? "text-black/60" : "text-white/40"}`}>
              {tier.description}
            </p>

            <div className="space-y-3 flex-1 mb-8">
              {tier.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <Check size={16} className={`mt-0.5 flex-shrink-0 ${tier.highlight ? "text-black" : "text-white/60"}`} />
                  <span className={`text-sm ${tier.highlight ? "text-black/80" : "text-white/60"}`}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCTA(tier.action)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              tier.highlight
                ? "bg-black text-white hover:bg-black/90"
                : "bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.1]"
            }`}>
              {tier.cta} <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 text-center"
      >
        <h3 className="text-xl font-bold text-white mb-2">Need a custom deployment?</h3>
        <p className="text-white/40 text-sm max-w-lg mx-auto mb-6">
          We offer white-label, on-premise, and custom API integrations for hospital networks and health systems across India, Singapore, and ASEAN markets.
        </p>
        <button
          onClick={() => window.location.href = "mailto:sales@mediflownexus.com?subject=Enterprise%20Custom%20Deployment"}
          className="btn-primary"
        >
          Talk to Sales <ArrowRight size={14} className="ml-2 inline" />
        </button>
      </motion.div>

      {/* FAQs */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle size={16} className="text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{faq.q}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
