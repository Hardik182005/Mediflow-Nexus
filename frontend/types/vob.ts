// Types for the VOB / Insurance Intelligence output from Gemini API

export interface InsuranceSummary {
  patientName: string;
  dob: string;
  payerName: string;
  memberId: string;
  groupNumber: string;
  planType: string;
  coverageStatus: "Active" | "Inactive" | "Unknown";
}

export interface DataConfidence {
  score: number; // 0-100
  missingFields: string[];
  conflicts: string[];
  assumptions: string[];
}

export interface CoverageBenefits {
  coverageStatus: "Active" | "Inactive" | "Unknown";
  serviceEligibility: "Covered" | "Possibly Covered" | "Not Determined" | "Not Covered";
  deductibleTotal: string;
  deductibleRemaining: string;
  copay: string;
  coinsurance: string;
  outOfPocketMax: string;
  outOfPocketMet: string;
  patientResponsibilityEstimate: string;
  expectedReimbursement: string;
  notes: string[];
}

export interface PriorAuth {
  required: "Required" | "Possibly Required" | "Not Required" | "Unknown";
  requiredDocuments: string[];
  missingDocuments: string[];
  submissionReadiness: "Ready" | "Missing Docs" | "Not Ready";
  notes: string;
}

export interface DenialRisk {
  level: "Low" | "Medium" | "High";
  reasons: string[];
  mitigationSteps: string[];
}

export interface RevenueIntelligence {
  expectedReimbursementRange: string;
  patientResponsibilityRange: string;
  revenueAtRisk: "Low" | "Medium" | "High";
  delayRisk: "Low" | "Medium" | "High";
  revenueNotes: string[];
}

export interface OperationalRecommendation {
  action: "Proceed with scheduling" | "Hold until prior auth" | "Require additional verification" | "Collect upfront payment estimate";
  reasoning: string;
  urgentActions: string[];
}

export interface PatientSummary {
  estimatedCost: string;
  whatInsuranceCovers: string;
  nextSteps: string[];
}

export interface VOBReport {
  insuranceSummary: InsuranceSummary;
  dataConfidence: DataConfidence;
  coverageBenefits: CoverageBenefits;
  priorAuth: PriorAuth;
  denialRisk: DenialRisk;
  revenueIntelligence: RevenueIntelligence;
  operationalRecommendation: OperationalRecommendation;
  patientSummary: PatientSummary;
}

export interface VOBInput {
  id: string;
  type: "Insurance Card" | "Benefits PDF" | "Manual Form" | "Clinical Context";
  content: string;
}
