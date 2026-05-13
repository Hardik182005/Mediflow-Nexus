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
      "Up to 500 patients/month", "Basic VOB Verification", "GTM Strategy Generator",
      "5 AI Pitch Decks/month", "Email Support", "1 User Seat", "Basic Reports", "Community Access",
    ],
    cta: "Start Free Trial", action: "trial", icon: Zap,
  },
  {
    name: "Professional",
    price: "$1,499",
    period: "/month",
    description: "For growing clinics and funded startups scaling their operations and outreach.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Up to 5,000 patients/month", "AI-Powered VOB + Denial Prediction", "Buyer Discovery (30+ hospitals)",
      "Unlimited AI Pitch Decks", "AI Email Outreach Drafter", "Priority Support (24h SLA)",
      "10 User Seats", "Revenue Intelligence Dashboard", "Payer Analytics", "Sales Pipeline (Kanban)", "API Access",
    ],
    cta: "Start Free Trial", action: "trial", icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For hospital networks and health systems requiring full platform deployment.",
    highlight: false,
    features: [
      "Unlimited patients", "Full AI Intelligence Suite", "Custom buyer datasets", "White-label deployment",
      "Dedicated account manager", "SSO & RBAC", "Unlimited seats", "Custom integrations (Epic, Cerner)",
      "HIPAA BAA included", "NABH/JCI compliance modules", "On-premise option", "99.9% SLA guarantee",
    ],
    cta: "Contact Sales", action: "contact", icon: Rocket,
  },
];

const faqs = [
  { q: "Is there a free trial?", a: "Yes. All plans include a 14-day free trial with full access. No credit card required." },
  { q: "Can I switch plans?", a: "Absolutely. Upgrade or downgrade at any time. Changes are prorated." },
  { q: "Is patient data secure?", a: "Yes. All data is encrypted at rest and in transit. We are HIPAA-ready and SOC2 compliant." },
  { q: "Do you support Indian insurance?", a: "Yes. Our VOB engine supports Star Health, ICICI Lombard, HDFC ERGO, and 50+ Indian insurers." },
  { q: "What about Singapore / ASEAN?", a: "MediFlow Nexus is designed for global healthcare markets including Singapore, Malaysia, Thailand, and the UAE." },
];

export default function PricingPage() {
  const router = useRouter();

  const handleCTA = (action: string) => {
    if (action === "trial") router.push("/launch-engine/onboarding");
    else if (action === "contact") window.location.href = "mailto:sales@mediflownexus.com?subject=Enterprise%20Inquiry";
  };

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto pb-16 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black text-[12px] font-medium text-black mb-6">
            <Shield size={12} /> SOC2 + HIPAA Compliant
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Simple, transparent pricing
          </h1>
          <p className="text-black max-w-xl mx-auto text-[15px] leading-relaxed">
            Start free. Scale when ready. No hidden fees. Cancel anytime.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-200 ${
              tier.highlight
                ? "bg-black text-white border-2 border-black shadow-2xl scale-[1.02]"
                : "bg-white border border-black hover:border-black hover:shadow-lg"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest border border-black">
                {tier.badge}
              </div>
            )}

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.highlight ? "bg-white/10" : "bg-white border border-black"}`}>
                <tier.icon size={18} className={tier.highlight ? "text-white" : "text-black"} />
              </div>
              <h3 className={`text-[17px] font-bold ${tier.highlight ? "text-white" : "text-black"}`}>{tier.name}</h3>
            </div>

            <div className="mb-4">
              <span className={`text-4xl font-bold tracking-tight ${tier.highlight ? "text-white" : "text-black"}`}>{tier.price}</span>
              <span className={`text-[13px] ml-1 ${tier.highlight ? "text-white" : "text-black"}`}>{tier.period}</span>
            </div>

            <p className={`text-[13px] mb-6 leading-relaxed ${tier.highlight ? "text-white" : "text-black"}`}>{tier.description}</p>

            <div className="space-y-2.5 flex-1 mb-8">
              {tier.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check size={14} className={`mt-0.5 flex-shrink-0 ${tier.highlight ? "text-white" : "text-black"}`} />
                  <span className={`text-[13px] ${tier.highlight ? "text-white" : "text-black"}`}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCTA(tier.action)}
              className={`w-full py-3 rounded-xl font-semibold text-[13.5px] transition-all flex items-center justify-center gap-2 ${
                tier.highlight
                  ? "bg-white text-black hover:bg-zinc-50"
                  : "bg-black text-white hover:bg-zinc-900"
              }`}
            >
              {tier.cta} <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black rounded-2xl p-8 text-center">
        <h3 className="text-[20px] font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Need a custom deployment?</h3>
        <p className="text-white text-[13.5px] max-w-lg mx-auto mb-6 leading-relaxed">
          We offer white-label, on-premise, and custom API integrations for hospital networks and health systems across India, Singapore, and ASEAN markets.
        </p>
        <button
          onClick={() => window.location.href = "mailto:sales@mediflownexus.com?subject=Enterprise%20Custom%20Deployment"}
          className="bg-white text-black font-semibold text-[13.5px] px-6 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors inline-flex items-center gap-2"
        >
          Talk to Sales <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* FAQs */}
      <div>
        <h3 className="text-[20px] font-bold text-black mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-white border border-black rounded-xl p-5 hover:border-black transition-colors"
            >
              <div className="flex items-start gap-3">
                <HelpCircle size={14} className="text-black mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13.5px] font-semibold text-black mb-1.5">{faq.q}</p>
                  <p className="text-[12.5px] text-black leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
