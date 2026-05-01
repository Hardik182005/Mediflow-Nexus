// Types for the GTM Strategy output from Gemini API

export interface StartupSummary {
  companyName: string;
  industry: string;
  productType: string;
  stage: string;
  tagline: string;
}

export interface ProductIntelligence {
  problemStatement: string;
  solutionDescription: string;
  keyFeatures: string[];
  keyBenefits: string[];
  differentiation: string;
  complexityLevel: string;
  deploymentType: string;
  pricingModel: string;
}

export interface ICP {
  targetSegments: string[];
  specializations: string[];
  organizationSize: string;
  geography: string;
  technologyMaturity: string;
  annualRevenue: string;
}

export interface BuyerPersona {
  primaryBuyer: {
    title: string;
    painPoints: string[];
    motivation: string;
  };
  secondaryBuyers: { title: string; role: string }[];
  buyingTriggers: string[];
}

export interface ValueProposition {
  headline: string;
  statements: string[];
  roi: string;
}

export interface Messaging {
  elevatorPitch: string;
  salesPitch: string;
  emailOutreach: { subject: string; body: string };
  linkedinOutreach: string;
  tagline: string;
  keyMarketingPoints: string[];
}

export interface DemoStrategy {
  workflowSteps: string[];
  talkingPoints: string[];
  objectionHandling: { objection: string; response: string }[];
}

export interface BuyerDiscovery {
  targetClinicTypes: string[];
  referralPartners: string[];
  strategicPartnerships: string[];
  sampleBuyerProfiles: { orgName: string; type: string; reason: string }[];
}

export interface SalesStrategy {
  approach: string;
  funnel: string[];
  conversionDrivers: string[];
  objections: { objection: string; solution: string }[];
}

export interface ROIImpact {
  revenueImpact: string;
  costSavings: string;
  efficiencyGain: string;
  paybackPeriod: string;
  metrics: string[];
}

export interface MarketplaceMatch {
  idealMatches: { clinicType: string; reason: string; fitScore: number }[];
  recommendedAction: string;
}

export interface GTMStrategy {
  startupSummary: StartupSummary;
  productIntelligence: ProductIntelligence;
  icp: ICP;
  buyerPersona: BuyerPersona;
  valueProposition: ValueProposition;
  messaging: Messaging;
  demoStrategy: DemoStrategy;
  buyerDiscovery: BuyerDiscovery;
  salesStrategy: SalesStrategy;
  roiImpact: ROIImpact;
  marketplaceMatch: MarketplaceMatch;
}

export interface GTMInput {
  id: string;
  type: "Pitch Deck" | "Product Document" | "Website Content" | "Brochure" | "Video Transcript";
  content: string;
}
