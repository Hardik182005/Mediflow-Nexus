// ========================
// Core Types
// ========================

export type UserRole = "admin" | "clinic_admin" | "clinic_staff" | "startup_admin" | "startup_member";
export type SideType = "clinic" | "startup";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  side: SideType;
  avatar?: string;
  clinicId?: string;
  startupId?: string;
  createdAt: string;
}

// ========================
// Clinic Side Types
// ========================

export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  npi: string;
  taxId: string;
  patientCount: number;
  monthlyRevenue: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Patient {
  id: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  diagnosisCode: string;
  cptCodes: string[];
  treatmentReadinessScore: number;
  documentCompleteness: number;
  status: "intake" | "verified" | "authorized" | "in_treatment" | "completed" | "dropped";
  createdAt: string;
}

export interface InsuranceCase {
  id: string;
  patientId: string;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  cptCode: string;
  status: "pending" | "verified" | "expired" | "denied";
  coverageActive: boolean;
  deductible: number;
  deductibleMet: number;
  copay: number;
  coinsurance: number;
  outOfPocketMax: number;
  outOfPocketMet: number;
  cptCovered: boolean;
  expiryDate: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface VOBResult {
  id: string;
  caseId: string;
  benefits: {
    deductible: number;
    deductibleMet: number;
    copay: number;
    coinsurance: number;
    outOfPocketMax: number;
    outOfPocketMet: number;
  };
  coverageDetails: string;
  estimatedPatientCost: number;
  estimatedReimbursement: number;
}

export interface PriorAuthCase {
  id: string;
  patientId: string;
  patientName: string;
  cptCode: string;
  diagnosisCode: string;
  insuranceProvider: string;
  status: "required" | "submitted" | "approved" | "denied" | "not_required";
  approvalProbability: number;
  missingDocuments: string[];
  submittedAt?: string;
  decidedAt?: string;
  expiresAt?: string;
  authNumber?: string;
  createdAt: string;
}

export interface Denial {
  id: string;
  patientId: string;
  patientName: string;
  cptCode: string;
  insuranceProvider: string;
  denialReason: string;
  denialCode: string;
  claimAmount: number;
  riskScore: number;
  status: "predicted" | "denied" | "appealed" | "overturned" | "upheld";
  fixRecommendations: string[];
  appealDeadline?: string;
  createdAt: string;
}

export interface Appeal {
  id: string;
  denialId: string;
  patientName: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  letterContent: string;
  submittedAt?: string;
  resolvedAt?: string;
}

export interface RevenuePrediction {
  id: string;
  clinicId: string;
  cptCode: string;
  expectedReimbursement: number;
  actualReimbursement?: number;
  delayRisk: "low" | "medium" | "high";
  leakageAmount: number;
  leakageReason?: string;
  predictedDate: string;
}

export interface PayerAnalytics {
  id: string;
  payerName: string;
  avgApprovalTime: number;
  denialRate: number;
  avgReimbursement: number;
  totalClaims: number;
  approvedClaims: number;
  deniedClaims: number;
  pendingClaims: number;
  avgPaymentDelay: number;
  performanceScore: number;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerType: string;
  patientCount: number;
  revenue: number;
  conversionRate: number;
  trend: "up" | "down" | "stable";
}

export interface DropoffPrediction {
  id: string;
  patientId: string;
  patientName: string;
  riskScore: number;
  predictedStage: string;
  reasons: string[];
  recommendedActions: string[];
}

// ========================
// Startup Side Types
// ========================

export interface StartupProfile {
  id: string;
  name: string;
  website: string;
  description: string;
  category: string;
  stage: string;
  targetMarket: string;
  icp: string;
  valueProposition: string;
  fundingStage: string;
  teamSize: number;
  founded: string;
  hqLocation: string;
  logo?: string;
  pitchDeckUrl?: string;
  productCategory: string;
  matchScore?: number;
  status: "onboarding" | "active" | "paused";
  createdAt: string;
}

export interface BuyerProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  organizationType: "clinic" | "hospital" | "health_system";
  email: string;
  phone: string;
  city: string;
  state: string;
  specialty: string;
  buyerScore: number;
  interests: string[];
  decisionMakerLevel: "C-Suite" | "VP" | "Director" | "Manager";
  budgetRange: string;
  status: "discovered" | "contacted" | "engaged" | "qualified" | "converted";
  lastContactedAt?: string;
  createdAt: string;
}

export interface SalesPipelineItem {
  id: string;
  startupId: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization: string;
  dealValue: number;
  stage: "lead" | "meeting" | "demo" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  winProbability: number;
  nextAction: string;
  nextActionDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceMatch {
  id: string;
  startupId: string;
  startupName: string;
  clinicId: string;
  clinicName: string;
  matchScore: number;
  matchReasons: string[];
  status: "recommended" | "connected" | "in_discussion" | "partnered" | "rejected";
  createdAt: string;
}

export interface CompetitorProfile {
  id: string;
  startupId: string;
  competitorName: string;
  website: string;
  category: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  marketShare: string;
  recentLaunches: string[];
  differentiators: string[];
  threatLevel: "low" | "medium" | "high";
}

export interface GTMRecommendation {
  id: string;
  startupId: string;
  type: "outreach" | "pitch" | "roi" | "positioning";
  title: string;
  content: string;
  targetBuyerId?: string;
  confidence: number;
  createdAt: string;
}

// ========================
// Dashboard Types
// ========================

export interface KPICard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  trend: "up" | "down" | "stable";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

// ========================
// AI Copilot Types
// ========================

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "chart" | "table" | "action";
}

export interface CopilotSuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  category: string;
}
