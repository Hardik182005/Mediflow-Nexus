/**
 * Hardcoded fallback responses for demo scenarios.
 * Used when Gemini API is slow (>8s), rate-limited, or unavailable.
 * This is standard practice for hackathon demos.
 */

export const FALLBACK_PITCH_DECK = {
  slide1: { headline: "Reducing Apollo's OPD Wait Time by 40%", subline: "AI-powered patient flow optimization for India's largest hospital network" },
  slide2: { title: "Apollo's Current Challenge", pain_points: ["18-minute average OPD wait across 73 hospitals", "23% patient walkaway rate during peak hours", "₹47Cr annual revenue loss from scheduling inefficiencies"], key_stat: "₹47Cr lost annually" },
  slide3: { title: "The Cost of Inaction", consequences: ["Patient satisfaction scores dropping 12% YoY", "Competitor hospitals capturing walk-in patients", "Staff burnout increasing 28% from manual scheduling"], revenue_at_risk: "₹47Cr+ annually" },
  slide4: { solution_line: "Our AI engine predicts patient flow 4 hours ahead, dynamically adjusts scheduling, and routes patients to optimal departments — reducing wait times from 18 minutes to under 5 minutes.", steps: ["Deploy AI prediction model on existing HIS data", "Integrate with Apollo's appointment system via HL7/FHIR", "Real-time dashboard for floor managers within 2 weeks"] },
  slide5: { title: "Proven Results", proof_points: ["Reduced OPD wait by 62% at Manipal Hospitals pilot (3 months)", "₹8.2Cr additional revenue captured from reduced walkaway at Fortis trial", "99.7% uptime across 15,000+ daily patient interactions"] },
  slide6: { current_loss: "₹47Cr/year", savings: "₹18.8Cr/year", payback_period: "45 days", year1_roi: "340%" },
  slide7: { integration_title: "Seamless Fit with Apollo's Stack", tech_points: ["Direct HIS integration (works with existing Epic/Cerner)", "No hardware changes — runs on existing infrastructure", "NABH-compliant data handling, HIPAA-ready encryption"] },
  slide8: { cta: "Start a 30-day pilot at one Apollo location — zero upfront cost, pay only on proven reduction", contact: "Schedule a 15-minute call this week" }
};

export const FALLBACK_GTM_STRATEGY = {
  startupSummary: {
    companyName: "HealthTech AI",
    industry: "Healthcare Technology",
    productType: "AI-Powered Clinical Decision Support",
    stage: "Series A",
    tagline: "Smarter decisions, faster outcomes"
  },
  productIntelligence: {
    problemStatement: "Hospitals lose 15-20% of revenue due to inefficient clinical workflows and manual processes",
    solutionDescription: "AI platform that automates clinical documentation, predicts patient outcomes, and optimizes resource allocation",
    keyFeatures: ["Real-time clinical documentation", "Predictive analytics dashboard", "Automated resource scheduling", "Integration with major EHR systems"],
    keyBenefits: ["40% reduction in documentation time", "25% improvement in bed utilization", "60% faster discharge planning"],
    differentiation: "Only platform combining NLP documentation with predictive resource optimization",
    complexityLevel: "Medium — requires EHR integration",
    deploymentType: "Cloud-based SaaS with on-premise option",
    pricingModel: "Per-bed per-month subscription"
  },
  marketAnalysis: {
    tamSize: "$12.4B globally by 2028",
    samSize: "$3.2B in India & ASEAN",
    somSize: "$180M addressable in Year 1",
    growthRate: "34% CAGR",
    keyTrends: ["AI adoption in Indian hospitals accelerating post-COVID", "NABH mandating digital health records by 2026", "Government push for Ayushman Bharat Digital Mission"]
  },
  gtmStrategy: {
    primaryChannel: "Direct enterprise sales to hospital CXOs",
    secondaryChannels: ["Healthcare conferences (HIMSS, AHPI)", "Strategic partnerships with EHR vendors", "Government tender participation"],
    salesCycle: "3-6 months for enterprise deals",
    pilotStrategy: "30-day free pilot at one department, expand on proven ROI",
    pricingStrategy: "₹150-300 per bed per month, volume discounts for 500+ beds"
  },
  competitiveAnalysis: {
    competitors: ["Nuance DAX", "Abridge", "Practo Enterprise"],
    advantages: ["India-first design with local language support", "50% lower TCO than global competitors", "Pre-built NABH compliance modules"],
    moat: "Proprietary training data from 50+ Indian hospital partnerships"
  },
  actionPlan: {
    immediate: ["Finalize pilot with 3 anchor hospitals", "Build case study from existing deployments", "Hire 2 enterprise sales reps for Delhi NCR and Mumbai"],
    shortTerm: ["Launch partner program with top 5 EHR vendors", "Apply for NASSCOM DeepTech certification", "Submit for AHPI Innovation Award"],
    longTerm: ["Expand to Singapore and UAE markets", "Build API marketplace for third-party integrations", "Pursue Series B with proven unit economics"]
  }
};

export const FALLBACK_VOB_REPORT = {
  patientInfo: {
    name: "Rahul Sharma",
    dob: "12/03/1985",
    policyNumber: "STRHLT-2024-78432",
    groupNumber: "GRP-APOLLO-2024",
    insuranceCompany: "Star Health Insurance",
    planName: "Star Comprehensive Gold",
    policyHolder: "Rahul Sharma (Self)",
    policyStatus: "Active",
    effectiveDate: "01/01/2024",
    terminationDate: "12/31/2024"
  },
  coverageSummary: {
    inNetworkDeductible: "₹10,000",
    outOfNetworkDeductible: "₹25,000",
    copay: "20%",
    maxOutOfPocket: "₹2,00,000",
    lifetimeMaximum: "₹50,00,000"
  },
  servicesCovered: [
    { service: "Inpatient Hospitalization", covered: true, preAuthRequired: true, limit: "₹10,00,000/year" },
    { service: "Outpatient Consultations", covered: true, preAuthRequired: false, limit: "₹50,000/year" },
    { service: "Diagnostic Tests", covered: true, preAuthRequired: false, limit: "₹1,00,000/year" },
    { service: "Surgical Procedures", covered: true, preAuthRequired: true, limit: "₹15,00,000/year" },
    { service: "Maternity Benefits", covered: true, preAuthRequired: true, limit: "₹75,000 per delivery" },
    { service: "Mental Health", covered: false, preAuthRequired: false, limit: "Not covered" }
  ],
  riskAssessment: {
    denialProbability: "18%",
    riskLevel: "Medium",
    flags: [
      "Pre-authorization required for planned surgery",
      "Maternity sub-limit may not cover full cost",
      "Mental health services excluded — patient may need separate coverage"
    ]
  },
  financialBreakdown: {
    estimatedTotalCost: "₹3,50,000",
    insuranceCovers: "₹2,72,000",
    patientResponsibility: "₹78,000",
    deductibleRemaining: "₹10,000",
    coinsurance: "₹68,000"
  }
};

export const FALLBACK_EMAIL_DRAFT = `Subject: Reducing OPD Wait Times at Apollo — Proven 62% Improvement

Dear Dr. Reddy,

I'm reaching out because Apollo Hospitals faces a challenge we've solved at scale — long OPD wait times that directly impact patient satisfaction and revenue.

Our AI platform reduced wait times by 62% at Manipal Hospitals within 3 months, capturing ₹8.2Cr in previously lost revenue from patient walkaway.

For Apollo's scale of 73 hospitals and 10,000+ daily patients, our analysis projects:
• ₹18.8Cr annual savings from reduced walkaway
• 45-day payback period
• Zero hardware changes — integrates with your existing HIS

I'd love to offer a 30-day zero-cost pilot at one Apollo location to demonstrate measurable results.

Would 15 minutes this week work for a quick call?

Best regards,
[Your Name]
[Your Company]`;

export const FALLBACK_COPILOT_RESPONSES: Record<string, string> = {
  "denial": "**Top Denial Reasons & Fixes:**\n\n1. **Missing Prior Authorization (35% of denials)**\n   - Fix: Implement automated PA verification before scheduling\n   - Impact: Reduces denials by ~₹12L/month\n\n2. **Incorrect Patient Info (22%)**\n   - Fix: Real-time eligibility check at registration\n   - Impact: Catches errors before claim submission\n\n3. **Medical Necessity (18%)**\n   - Fix: AI-powered documentation assistance\n   - Impact: Stronger clinical justification\n\n→ Check the **Denial Intelligence** page for real-time tracking.",
  "vob": "**VOB Verification Process:**\n\n1. Upload insurance document (PDF/image)\n2. AI extracts: policy number, coverage limits, exclusions\n3. System checks: deductible status, pre-auth requirements\n4. Risk assessment: denial probability + financial breakdown\n5. Output: actionable report with patient responsibility estimate\n\n→ Go to **Insurance Intelligence** to run a VOB analysis now.",
  "default": "I can help with:\n- **Revenue Cycle**: Denial analysis, claim optimization, A/R management\n- **Insurance**: VOB verification, coverage analysis, payer comparison\n- **GTM Strategy**: Market sizing, buyer matching, pitch optimization\n- **Compliance**: HIPAA, NABH, JCI requirements\n\nWhat specific area would you like to explore?"
};
