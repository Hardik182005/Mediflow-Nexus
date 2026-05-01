import type { Patient, InsuranceCase, PriorAuthCase, Denial, PayerAnalytics, StartupProfile, BuyerProfile, SalesPipelineItem, MarketplaceMatch, Referral, CompetitorProfile } from "@/types";

export const revenueChartData = [
  { month: "Jul", revenue: 285000, predicted: 290000, leakage: 12000 },
  { month: "Aug", revenue: 302000, predicted: 310000, leakage: 15000 },
  { month: "Sep", revenue: 298000, predicted: 305000, leakage: 11000 },
  { month: "Oct", revenue: 325000, predicted: 330000, leakage: 8000 },
  { month: "Nov", revenue: 340000, predicted: 345000, leakage: 9500 },
  { month: "Dec", revenue: 358000, predicted: 365000, leakage: 7200 },
  { month: "Jan", revenue: 372000, predicted: 380000, leakage: 6800 },
  { month: "Feb", revenue: 385000, predicted: 390000, leakage: 5500 },
  { month: "Mar", revenue: 398000, predicted: 405000, leakage: 4200 },
  { month: "Apr", revenue: 415000, predicted: 420000, leakage: 3800 },
];

export const denialsByReason = [
  { reason: "Missing Documentation", count: 45, amount: 128000 },
  { reason: "Coding Errors", count: 38, amount: 95000 },
  { reason: "Auth Not Obtained", count: 29, amount: 87000 },
  { reason: "Not Medically Necessary", count: 22, amount: 72000 },
  { reason: "Timely Filing", count: 15, amount: 42000 },
  { reason: "Duplicate Claims", count: 11, amount: 28000 },
];

export const pipelineStages = [
  { name: "Lead", count: 48, value: 2400000, color: "#3b82f6" },
  { name: "Meeting", count: 32, value: 1800000, color: "#8b5cf6" },
  { name: "Demo", count: 24, value: 1400000, color: "#06b6d4" },
  { name: "Proposal", count: 16, value: 980000, color: "#f59e0b" },
  { name: "Negotiation", count: 8, value: 520000, color: "#f97316" },
  { name: "Closed Won", count: 12, value: 890000, color: "#10b981" },
];

export const patients: Patient[] = [
  { id: "P001", clinicId: "C001", firstName: "Sarah", lastName: "Mitchell", dob: "1985-03-15", gender: "Female", email: "sarah.m@email.com", phone: "(555) 234-5678", insuranceProvider: "Blue Cross Blue Shield", policyNumber: "BCBS-882341", groupNumber: "GRP-4421", diagnosisCode: "M54.5", cptCodes: ["99213", "97110"], treatmentReadinessScore: 92, documentCompleteness: 95, status: "verified", createdAt: "2025-04-01" },
  { id: "P002", clinicId: "C001", firstName: "James", lastName: "Rodriguez", dob: "1972-08-22", gender: "Male", email: "james.r@email.com", phone: "(555) 345-6789", insuranceProvider: "Aetna", policyNumber: "AET-554231", groupNumber: "GRP-8812", diagnosisCode: "S83.511A", cptCodes: ["29881", "99214"], treatmentReadinessScore: 67, documentCompleteness: 72, status: "intake", createdAt: "2025-04-02" },
  { id: "P003", clinicId: "C001", firstName: "Emily", lastName: "Chen", dob: "1990-11-08", gender: "Female", email: "emily.c@email.com", phone: "(555) 456-7890", insuranceProvider: "UnitedHealthcare", policyNumber: "UHC-773421", groupNumber: "GRP-2205", diagnosisCode: "G43.909", cptCodes: ["99215", "96127"], treatmentReadinessScore: 85, documentCompleteness: 88, status: "authorized", createdAt: "2025-04-03" },
  { id: "P004", clinicId: "C001", firstName: "Michael", lastName: "Thompson", dob: "1968-05-30", gender: "Male", email: "mike.t@email.com", phone: "(555) 567-8901", insuranceProvider: "Cigna", policyNumber: "CIG-991122", groupNumber: "GRP-6633", diagnosisCode: "E11.9", cptCodes: ["99214", "83036"], treatmentReadinessScore: 45, documentCompleteness: 52, status: "intake", createdAt: "2025-04-04" },
  { id: "P005", clinicId: "C001", firstName: "Lisa", lastName: "Park", dob: "1995-01-17", gender: "Female", email: "lisa.p@email.com", phone: "(555) 678-9012", insuranceProvider: "Humana", policyNumber: "HUM-334455", groupNumber: "GRP-1198", diagnosisCode: "F41.1", cptCodes: ["90834", "90837"], treatmentReadinessScore: 78, documentCompleteness: 82, status: "verified", createdAt: "2025-04-05" },
  { id: "P006", clinicId: "C001", firstName: "Robert", lastName: "Davis", dob: "1960-09-12", gender: "Male", email: "rob.d@email.com", phone: "(555) 789-0123", insuranceProvider: "Medicare", policyNumber: "MED-112233", groupNumber: "N/A", diagnosisCode: "I10", cptCodes: ["99213", "93000"], treatmentReadinessScore: 95, documentCompleteness: 98, status: "in_treatment", createdAt: "2025-04-06" },
];

export const insuranceCases: InsuranceCase[] = [
  { id: "IC001", patientId: "P001", patientName: "Sarah Mitchell", insuranceProvider: "Blue Cross Blue Shield", policyNumber: "BCBS-882341", cptCode: "99213", status: "verified", coverageActive: true, deductible: 2000, deductibleMet: 1800, copay: 35, coinsurance: 20, outOfPocketMax: 6000, outOfPocketMet: 3200, cptCovered: true, expiryDate: "2025-12-31", verifiedAt: "2025-04-01", createdAt: "2025-04-01" },
  { id: "IC002", patientId: "P002", patientName: "James Rodriguez", insuranceProvider: "Aetna", policyNumber: "AET-554231", cptCode: "29881", status: "pending", coverageActive: true, deductible: 3000, deductibleMet: 500, copay: 50, coinsurance: 30, outOfPocketMax: 8000, outOfPocketMet: 1200, cptCovered: true, expiryDate: "2025-06-30", createdAt: "2025-04-02" },
  { id: "IC003", patientId: "P003", patientName: "Emily Chen", insuranceProvider: "UnitedHealthcare", policyNumber: "UHC-773421", cptCode: "99215", status: "verified", coverageActive: true, deductible: 1500, deductibleMet: 1500, copay: 25, coinsurance: 15, outOfPocketMax: 5000, outOfPocketMet: 4200, cptCovered: true, expiryDate: "2025-12-31", verifiedAt: "2025-04-03", createdAt: "2025-04-03" },
  { id: "IC004", patientId: "P004", patientName: "Michael Thompson", insuranceProvider: "Cigna", policyNumber: "CIG-991122", cptCode: "99214", status: "expired", coverageActive: false, deductible: 2500, deductibleMet: 0, copay: 40, coinsurance: 25, outOfPocketMax: 7000, outOfPocketMet: 0, cptCovered: false, expiryDate: "2025-03-31", createdAt: "2025-04-04" },
];

export const priorAuthCases: PriorAuthCase[] = [
  { id: "PA001", patientId: "P002", patientName: "James Rodriguez", cptCode: "29881", diagnosisCode: "S83.511A", insuranceProvider: "Aetna", status: "submitted", approvalProbability: 78, missingDocuments: ["MRI Report"], submittedAt: "2025-04-02", createdAt: "2025-04-02" },
  { id: "PA002", patientId: "P003", patientName: "Emily Chen", cptCode: "96127", diagnosisCode: "G43.909", insuranceProvider: "UnitedHealthcare", status: "approved", approvalProbability: 95, missingDocuments: [], submittedAt: "2025-04-01", decidedAt: "2025-04-03", authNumber: "AUTH-88421", expiresAt: "2025-07-03", createdAt: "2025-04-01" },
  { id: "PA003", patientId: "P005", patientName: "Lisa Park", cptCode: "90837", diagnosisCode: "F41.1", insuranceProvider: "Humana", status: "required", approvalProbability: 62, missingDocuments: ["Treatment Plan", "Clinical Notes"], createdAt: "2025-04-05" },
  { id: "PA004", patientId: "P006", patientName: "Robert Davis", cptCode: "93000", diagnosisCode: "I10", insuranceProvider: "Medicare", status: "not_required", approvalProbability: 100, missingDocuments: [], createdAt: "2025-04-06" },
];

export const denials: Denial[] = [
  { id: "D001", patientId: "P002", patientName: "James Rodriguez", cptCode: "29881", insuranceProvider: "Aetna", denialReason: "Prior Authorization Not Obtained", denialCode: "CO-197", claimAmount: 8500, riskScore: 82, status: "predicted", fixRecommendations: ["Submit PA request immediately", "Include MRI report", "Add physician letter of necessity"], createdAt: "2025-04-02" },
  { id: "D002", patientId: "P004", patientName: "Michael Thompson", cptCode: "99214", insuranceProvider: "Cigna", denialReason: "Coverage Expired", denialCode: "CO-27", claimAmount: 325, riskScore: 95, status: "denied", fixRecommendations: ["Verify current coverage status", "Contact patient for updated insurance"], appealDeadline: "2025-05-04", createdAt: "2025-04-04" },
  { id: "D003", patientId: "P001", patientName: "Sarah Mitchell", cptCode: "97110", insuranceProvider: "Blue Cross Blue Shield", denialReason: "Insufficient Documentation", denialCode: "CO-16", claimAmount: 1200, riskScore: 45, status: "appealed", fixRecommendations: ["Attach therapy progress notes", "Include functional assessment"], createdAt: "2025-03-28" },
];

export const payerAnalytics: PayerAnalytics[] = [
  { id: "PAY001", payerName: "Blue Cross Blue Shield", avgApprovalTime: 3.2, denialRate: 8.5, avgReimbursement: 1250, totalClaims: 342, approvedClaims: 313, deniedClaims: 29, pendingClaims: 18, avgPaymentDelay: 14, performanceScore: 88 },
  { id: "PAY002", payerName: "Aetna", avgApprovalTime: 5.8, denialRate: 15.2, avgReimbursement: 980, totalClaims: 228, approvedClaims: 193, deniedClaims: 35, pendingClaims: 22, avgPaymentDelay: 21, performanceScore: 72 },
  { id: "PAY003", payerName: "UnitedHealthcare", avgApprovalTime: 4.1, denialRate: 11.3, avgReimbursement: 1120, totalClaims: 415, approvedClaims: 368, deniedClaims: 47, pendingClaims: 31, avgPaymentDelay: 18, performanceScore: 79 },
  { id: "PAY004", payerName: "Cigna", avgApprovalTime: 6.5, denialRate: 18.7, avgReimbursement: 890, totalClaims: 187, approvedClaims: 152, deniedClaims: 35, pendingClaims: 14, avgPaymentDelay: 25, performanceScore: 64 },
  { id: "PAY005", payerName: "Humana", avgApprovalTime: 4.8, denialRate: 12.1, avgReimbursement: 1050, totalClaims: 156, approvedClaims: 137, deniedClaims: 19, pendingClaims: 9, avgPaymentDelay: 16, performanceScore: 76 },
  { id: "PAY006", payerName: "Medicare", avgApprovalTime: 2.1, denialRate: 5.3, avgReimbursement: 780, totalClaims: 523, approvedClaims: 495, deniedClaims: 28, pendingClaims: 8, avgPaymentDelay: 12, performanceScore: 92 },
];

export const referrals: Referral[] = [
  { id: "R001", referrerName: "Dr. Amanda Foster", referrerType: "Primary Care", patientCount: 45, revenue: 125000, conversionRate: 82, trend: "up" },
  { id: "R002", referrerName: "Northwest Medical Group", referrerType: "Medical Group", patientCount: 38, revenue: 98000, conversionRate: 75, trend: "up" },
  { id: "R003", referrerName: "Dr. Kevin Shah", referrerType: "Specialist", patientCount: 28, revenue: 85000, conversionRate: 88, trend: "stable" },
  { id: "R004", referrerName: "City Health Clinic", referrerType: "Clinic", patientCount: 22, revenue: 62000, conversionRate: 68, trend: "down" },
  { id: "R005", referrerName: "Dr. Rachel Kim", referrerType: "Primary Care", patientCount: 19, revenue: 54000, conversionRate: 79, trend: "up" },
];

export const startupProfiles: StartupProfile[] = [
  { id: "S001", name: "MedSync AI", website: "medsync.ai", description: "AI-powered clinical documentation automation that reduces physician charting time by 70%", category: "Clinical AI", stage: "Series A", targetMarket: "Primary Care Clinics", icp: "Mid-size primary care clinics with 5-20 providers", valueProposition: "Reduce charting time by 70%, increase patient throughput by 35%", fundingStage: "Series A - $12M", teamSize: 42, founded: "2023", hqLocation: "San Francisco, CA", productCategory: "Documentation AI", matchScore: 94, status: "active", createdAt: "2025-01-15" },
  { id: "S002", name: "InsureBot", website: "insurebot.health", description: "Automated insurance verification and prior auth platform for specialty clinics", category: "Revenue Cycle", stage: "Seed", targetMarket: "Specialty Clinics", icp: "Orthopedic and cardiology clinics processing 100+ claims/month", valueProposition: "Automate 90% of insurance verifications, reduce PA turnaround by 60%", fundingStage: "Seed - $3.5M", teamSize: 18, founded: "2024", hqLocation: "Austin, TX", productCategory: "RCM Automation", matchScore: 88, status: "active", createdAt: "2025-02-01" },
  { id: "S003", name: "PatientPulse", website: "patientpulse.io", description: "Patient engagement platform with AI-driven follow-up and retention tools", category: "Patient Engagement", stage: "Series B", targetMarket: "Multi-location Clinics", icp: "Healthcare systems with 3+ locations and high patient churn", valueProposition: "Reduce patient no-shows by 45%, increase retention by 30%", fundingStage: "Series B - $28M", teamSize: 85, founded: "2022", hqLocation: "Boston, MA", productCategory: "Patient Engagement", matchScore: 76, status: "active", createdAt: "2025-01-20" },
  { id: "S004", name: "ClaimGuard", website: "claimguard.com", description: "Predictive denial prevention and automated appeals management", category: "Denial Management", stage: "Series A", targetMarket: "Hospitals & Health Systems", icp: "Hospitals processing 500+ claims/month with >10% denial rate", valueProposition: "Reduce denials by 55%, recover 40% more denied revenue", fundingStage: "Series A - $8M", teamSize: 35, founded: "2023", hqLocation: "Chicago, IL", productCategory: "Denial Prevention", matchScore: 91, status: "active", createdAt: "2025-02-10" },
  { id: "S005", name: "TeleHealth Plus", website: "telehealthplus.com", description: "White-label telehealth platform with integrated billing and scheduling", category: "Telehealth", stage: "Seed", targetMarket: "Rural Clinics", icp: "Rural and underserved clinics looking to expand reach", valueProposition: "Launch telehealth in 48 hours, integrate with existing EHR", fundingStage: "Seed - $2M", teamSize: 12, founded: "2024", hqLocation: "Nashville, TN", productCategory: "Telehealth", matchScore: 72, status: "onboarding", createdAt: "2025-03-01" },
];

export const buyerProfiles: BuyerProfile[] = [
  { id: "B001", name: "Dr. Catherine Wells", title: "Chief Medical Officer", organization: "Pacific Health Partners", organizationType: "health_system", email: "cwells@pacifichealth.org", phone: "(555) 111-2233", city: "Portland", state: "OR", specialty: "Multi-specialty", buyerScore: 92, interests: ["Clinical AI", "Documentation"], decisionMakerLevel: "C-Suite", budgetRange: "$100K-$500K", status: "engaged", lastContactedAt: "2025-04-15", createdAt: "2025-03-01" },
  { id: "B002", name: "Mark Johnson", title: "VP of Operations", organization: "Midwest Orthopedic Group", organizationType: "clinic", email: "mjohnson@midwestortho.com", phone: "(555) 222-3344", city: "Columbus", state: "OH", specialty: "Orthopedics", buyerScore: 85, interests: ["RCM Automation", "Prior Auth"], decisionMakerLevel: "VP", budgetRange: "$50K-$200K", status: "qualified", lastContactedAt: "2025-04-12", createdAt: "2025-03-05" },
  { id: "B003", name: "Dr. Priya Sharma", title: "Medical Director", organization: "Valley Heart Center", organizationType: "clinic", email: "psharma@valleyheart.com", phone: "(555) 333-4455", city: "Phoenix", state: "AZ", specialty: "Cardiology", buyerScore: 78, interests: ["Patient Engagement", "Telehealth"], decisionMakerLevel: "Director", budgetRange: "$25K-$100K", status: "contacted", createdAt: "2025-03-10" },
  { id: "B004", name: "Jennifer Liu", title: "CTO", organization: "Sunrise Health Network", organizationType: "health_system", email: "jliu@sunrisehealth.org", phone: "(555) 444-5566", city: "San Diego", state: "CA", specialty: "Multi-specialty", buyerScore: 95, interests: ["Clinical AI", "Denial Management"], decisionMakerLevel: "C-Suite", budgetRange: "$200K-$1M", status: "engaged", lastContactedAt: "2025-04-18", createdAt: "2025-02-28" },
  { id: "B005", name: "David Park", title: "Operations Director", organization: "Greenville Primary Care", organizationType: "clinic", email: "dpark@greenvillepc.com", phone: "(555) 555-6677", city: "Greenville", state: "SC", specialty: "Primary Care", buyerScore: 71, interests: ["Documentation AI", "Patient Engagement"], decisionMakerLevel: "Director", budgetRange: "$10K-$50K", status: "discovered", createdAt: "2025-03-15" },
];

export const salesPipeline: SalesPipelineItem[] = [
  { id: "SP001", startupId: "S001", buyerId: "B001", buyerName: "Dr. Catherine Wells", buyerOrganization: "Pacific Health Partners", dealValue: 250000, stage: "demo", winProbability: 72, nextAction: "Schedule technical deep-dive", nextActionDate: "2025-04-25", notes: "Very interested in AI charting. Wants to pilot with 3 providers.", createdAt: "2025-03-15", updatedAt: "2025-04-20" },
  { id: "SP002", startupId: "S002", buyerId: "B002", buyerName: "Mark Johnson", buyerOrganization: "Midwest Orthopedic Group", dealValue: 85000, stage: "proposal", winProbability: 65, nextAction: "Send revised proposal with implementation timeline", nextActionDate: "2025-04-22", notes: "Budget approved. Finalizing contract terms.", createdAt: "2025-03-20", updatedAt: "2025-04-18" },
  { id: "SP003", startupId: "S004", buyerId: "B004", buyerName: "Jennifer Liu", buyerOrganization: "Sunrise Health Network", dealValue: 450000, stage: "meeting", winProbability: 45, nextAction: "Present denial analytics dashboard", nextActionDate: "2025-04-28", notes: "Interested but evaluating 2 competitors.", createdAt: "2025-04-01", updatedAt: "2025-04-19" },
  { id: "SP004", startupId: "S001", buyerId: "B004", buyerName: "Jennifer Liu", buyerOrganization: "Sunrise Health Network", dealValue: 380000, stage: "lead", winProbability: 25, nextAction: "Initial outreach email", nextActionDate: "2025-04-24", notes: "Referred by Pacific Health Partners.", createdAt: "2025-04-15", updatedAt: "2025-04-15" },
  { id: "SP005", startupId: "S003", buyerId: "B003", buyerName: "Dr. Priya Sharma", buyerOrganization: "Valley Heart Center", dealValue: 65000, stage: "closed_won", winProbability: 100, nextAction: "Kick off implementation", nextActionDate: "2025-05-01", notes: "12-month contract signed.", createdAt: "2025-02-10", updatedAt: "2025-04-10" },
];

export const marketplaceMatches: MarketplaceMatch[] = [
  { id: "MM001", startupId: "S001", startupName: "MedSync AI", clinicId: "C001", clinicName: "Pacific Health Partners", matchScore: 94, matchReasons: ["High documentation burden", "5+ providers", "EHR integration ready"], status: "connected", createdAt: "2025-03-01" },
  { id: "MM002", startupId: "S002", startupName: "InsureBot", clinicId: "C002", clinicName: "Midwest Orthopedic Group", matchScore: 88, matchReasons: ["High PA volume", "Specialty clinic", "Manual verification process"], status: "in_discussion", createdAt: "2025-03-05" },
  { id: "MM003", startupId: "S004", startupName: "ClaimGuard", clinicId: "C003", clinicName: "Valley Heart Center", matchScore: 91, matchReasons: ["15% denial rate", "Complex cardiology claims", "Appeals backlog"], status: "recommended", createdAt: "2025-03-10" },
  { id: "MM004", startupId: "S003", startupName: "PatientPulse", clinicId: "C004", clinicName: "Greenville Primary Care", matchScore: 76, matchReasons: ["High no-show rate", "Multi-location", "Patient retention issues"], status: "partnered", createdAt: "2025-02-15" },
  { id: "MM005", startupId: "S005", startupName: "TeleHealth Plus", clinicId: "C005", clinicName: "Mountain Rural Health", matchScore: 82, matchReasons: ["Rural location", "Limited specialist access", "No existing telehealth"], status: "recommended", createdAt: "2025-03-20" },
];

export const competitors: CompetitorProfile[] = [
  { id: "CP001", startupId: "S001", competitorName: "Nuance DAX", website: "nuance.com", category: "Clinical AI", strengths: ["Microsoft backing", "Large install base", "Brand recognition"], weaknesses: ["Expensive", "Complex implementation", "Limited customization"], pricing: "$500-1500/provider/month", marketShare: "35%", recentLaunches: ["DAX Copilot v3", "Ambient AI Update"], differentiators: ["Enterprise-grade", "Dragon integration"], threatLevel: "high" },
  { id: "CP002", startupId: "S001", competitorName: "Abridge", website: "abridge.com", category: "Clinical AI", strengths: ["Modern UX", "Fast deployment", "Strong NLP"], weaknesses: ["Limited EHR integrations", "Newer company", "Smaller team"], pricing: "$300-800/provider/month", marketShare: "8%", recentLaunches: ["Real-time summarization"], differentiators: ["Patient-facing features"], threatLevel: "medium" },
  { id: "CP003", startupId: "S002", competitorName: "Waystar", website: "waystar.com", category: "Revenue Cycle", strengths: ["Full RCM suite", "Large customer base", "Proven ROI"], weaknesses: ["Legacy tech stack", "Slow innovation", "High switching cost"], pricing: "$2000-5000/month", marketShare: "22%", recentLaunches: ["AI-powered denials module"], differentiators: ["End-to-end RCM"], threatLevel: "medium" },
];
