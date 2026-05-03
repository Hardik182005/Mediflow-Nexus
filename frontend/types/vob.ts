export interface VOBReport {
  patient_info: {
    name: string;
    dob: string;
    policy_number: string;
    group_number: string;
    insurance_company: string;
    plan_name: string;
    valid_from: string;
    valid_to: string;
  };
  coverage_summary: {
    sum_insured: string;
    amount_used_ytd: string;
    remaining_balance: string;
    waiting_periods: string[];
  };
  hospitalization_benefits: {
    inpatient_covered: boolean;
    room_type_allowed: string;
    room_rent_limit: string;
    day_care_procedures: boolean;
  };
  financials: {
    copayment_percent: string;
    deductible: string;
    surgery_sublimit: string;
    diagnostics_sublimit: string;
  };
  exclusions: string[];
  prior_auth: {
    required: boolean;
    procedures: string[];
    contact_info: string;
    tat_hours: string;
  };
  network_status: {
    status: "IN-NETWORK" | "OUT-OF-NETWORK";
    cashless_eligible: boolean;
    limit: string;
  };
  ai_risk_assessment: {
    risk_score: "Low" | "Medium" | "High";
    risk_factors: string[];
    denial_probability: string;
    estimated_reimbursement: string;
    recommendations: string[];
  };
}
