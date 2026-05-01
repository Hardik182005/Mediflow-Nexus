from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.db.database import BaseModel
import enum


# ========================
# Enums
# ========================

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CLINIC_ADMIN = "clinic_admin"
    CLINIC_STAFF = "clinic_staff"
    STARTUP_ADMIN = "startup_admin"
    STARTUP_MEMBER = "startup_member"


class PatientStatus(str, enum.Enum):
    INTAKE = "intake"
    VERIFIED = "verified"
    AUTHORIZED = "authorized"
    IN_TREATMENT = "in_treatment"
    COMPLETED = "completed"
    DROPPED = "dropped"


class InsuranceStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    EXPIRED = "expired"
    DENIED = "denied"


class PAStatus(str, enum.Enum):
    REQUIRED = "required"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    DENIED = "denied"
    NOT_REQUIRED = "not_required"


class DenialStatus(str, enum.Enum):
    PREDICTED = "predicted"
    DENIED = "denied"
    APPEALED = "appealed"
    OVERTURNED = "overturned"
    UPHELD = "upheld"


class DealStage(str, enum.Enum):
    LEAD = "lead"
    MEETING = "meeting"
    DEMO = "demo"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"


class MatchStatus(str, enum.Enum):
    RECOMMENDED = "recommended"
    CONNECTED = "connected"
    IN_DISCUSSION = "in_discussion"
    PARTNERED = "partnered"
    REJECTED = "rejected"


# ========================
# Models
# ========================

class User(BaseModel):
    __tablename__ = "users"
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.CLINIC_STAFF)
    firebase_uid = Column(String, unique=True, index=True)
    avatar_url = Column(String)
    clinic_id = Column(String, ForeignKey("clinics.id"), nullable=True)
    startup_id = Column(String, ForeignKey("startup_profiles.id"), nullable=True)


class Clinic(BaseModel):
    __tablename__ = "clinics"
    name = Column(String, nullable=False)
    specialty = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip = Column(String)
    phone = Column(String)
    email = Column(String)
    npi = Column(String, unique=True)
    tax_id = Column(String)
    patient_count = Column(Integer, default=0)
    monthly_revenue = Column(Float, default=0)
    status = Column(String, default="active")


class Patient(BaseModel):
    __tablename__ = "patients"
    clinic_id = Column(String, ForeignKey("clinics.id"), nullable=False, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(String)
    gender = Column(String)
    email = Column(String)
    phone = Column(String)
    insurance_provider = Column(String)
    policy_number = Column(String)
    group_number = Column(String)
    diagnosis_code = Column(String)
    cpt_codes = Column(JSON, default=list)
    treatment_readiness_score = Column(Float, default=0)
    document_completeness = Column(Float, default=0)
    status = Column(SAEnum(PatientStatus), default=PatientStatus.INTAKE)


class InsuranceCase(BaseModel):
    __tablename__ = "insurance_cases"
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    patient_name = Column(String)
    insurance_provider = Column(String)
    policy_number = Column(String)
    cpt_code = Column(String)
    status = Column(SAEnum(InsuranceStatus), default=InsuranceStatus.PENDING)
    coverage_active = Column(Boolean, default=True)
    deductible = Column(Float, default=0)
    deductible_met = Column(Float, default=0)
    copay = Column(Float, default=0)
    coinsurance = Column(Float, default=0)
    out_of_pocket_max = Column(Float, default=0)
    out_of_pocket_met = Column(Float, default=0)
    cpt_covered = Column(Boolean, default=True)
    expiry_date = Column(String)
    verified_at = Column(DateTime(timezone=True))


class PriorAuthCase(BaseModel):
    __tablename__ = "prior_auth_cases"
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    patient_name = Column(String)
    cpt_code = Column(String)
    diagnosis_code = Column(String)
    insurance_provider = Column(String)
    status = Column(SAEnum(PAStatus), default=PAStatus.REQUIRED)
    approval_probability = Column(Float, default=0)
    missing_documents = Column(JSON, default=list)
    submitted_at = Column(DateTime(timezone=True))
    decided_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    auth_number = Column(String)


class Denial(BaseModel):
    __tablename__ = "denials"
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False, index=True)
    patient_name = Column(String)
    cpt_code = Column(String)
    insurance_provider = Column(String)
    denial_reason = Column(String)
    denial_code = Column(String)
    claim_amount = Column(Float, default=0)
    risk_score = Column(Float, default=0)
    status = Column(SAEnum(DenialStatus), default=DenialStatus.PREDICTED)
    fix_recommendations = Column(JSON, default=list)
    appeal_deadline = Column(String)


class Appeal(BaseModel):
    __tablename__ = "appeals"
    denial_id = Column(String, ForeignKey("denials.id"), nullable=False)
    patient_name = Column(String)
    status = Column(String, default="draft")
    letter_content = Column(Text)
    submitted_at = Column(DateTime(timezone=True))
    resolved_at = Column(DateTime(timezone=True))


class PayerRule(BaseModel):
    __tablename__ = "payer_rules"
    payer_name = Column(String, nullable=False)
    rule_type = Column(String)
    cpt_code = Column(String)
    requires_pa = Column(Boolean, default=False)
    documentation_required = Column(JSON, default=list)
    avg_approval_days = Column(Integer)
    denial_rate = Column(Float)


class RevenuePrediction(BaseModel):
    __tablename__ = "revenue_predictions"
    clinic_id = Column(String, ForeignKey("clinics.id"), nullable=False)
    cpt_code = Column(String)
    expected_reimbursement = Column(Float)
    actual_reimbursement = Column(Float)
    delay_risk = Column(String, default="low")
    leakage_amount = Column(Float, default=0)
    leakage_reason = Column(String)
    predicted_date = Column(String)


class PayerAnalyticsModel(BaseModel):
    __tablename__ = "payer_analytics"
    payer_name = Column(String, nullable=False)
    avg_approval_time = Column(Float)
    denial_rate = Column(Float)
    avg_reimbursement = Column(Float)
    total_claims = Column(Integer)
    approved_claims = Column(Integer)
    denied_claims = Column(Integer)
    pending_claims = Column(Integer)
    avg_payment_delay = Column(Float)
    performance_score = Column(Float)


class Referral(BaseModel):
    __tablename__ = "referrals"
    clinic_id = Column(String, ForeignKey("clinics.id"))
    referrer_name = Column(String)
    referrer_type = Column(String)
    patient_count = Column(Integer, default=0)
    revenue = Column(Float, default=0)
    conversion_rate = Column(Float, default=0)
    trend = Column(String, default="stable")


class DropoffPrediction(BaseModel):
    __tablename__ = "dropoff_predictions"
    patient_id = Column(String, ForeignKey("patients.id"))
    patient_name = Column(String)
    risk_score = Column(Float)
    predicted_stage = Column(String)
    reasons = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)


class StartupProfile(BaseModel):
    __tablename__ = "startup_profiles"
    name = Column(String, nullable=False)
    website = Column(String)
    description = Column(Text)
    category = Column(String)
    stage = Column(String)
    target_market = Column(String)
    icp = Column(Text)
    value_proposition = Column(Text)
    funding_stage = Column(String)
    team_size = Column(Integer)
    founded = Column(String)
    hq_location = Column(String)
    logo_url = Column(String)
    pitch_deck_url = Column(String)
    product_category = Column(String)
    match_score = Column(Float)
    status = Column(String, default="onboarding")


class BuyerProfile(BaseModel):
    __tablename__ = "buyer_profiles"
    name = Column(String, nullable=False)
    title = Column(String)
    organization = Column(String)
    organization_type = Column(String)
    email = Column(String)
    phone = Column(String)
    city = Column(String)
    state = Column(String)
    specialty = Column(String)
    buyer_score = Column(Float, default=0)
    interests = Column(JSON, default=list)
    decision_maker_level = Column(String)
    budget_range = Column(String)
    status = Column(String, default="discovered")
    last_contacted_at = Column(DateTime(timezone=True))


class SalesPipeline(BaseModel):
    __tablename__ = "sales_pipeline"
    startup_id = Column(String, ForeignKey("startup_profiles.id"), nullable=False)
    buyer_id = Column(String, ForeignKey("buyer_profiles.id"), nullable=False)
    buyer_name = Column(String)
    buyer_organization = Column(String)
    deal_value = Column(Float, default=0)
    stage = Column(SAEnum(DealStage), default=DealStage.LEAD)
    win_probability = Column(Float, default=0)
    next_action = Column(String)
    next_action_date = Column(String)
    notes = Column(Text)


class MarketplaceMatch(BaseModel):
    __tablename__ = "marketplace_matches"
    startup_id = Column(String, ForeignKey("startup_profiles.id"), nullable=False)
    startup_name = Column(String)
    clinic_id = Column(String, ForeignKey("clinics.id"), nullable=False)
    clinic_name = Column(String)
    match_score = Column(Float, default=0)
    match_reasons = Column(JSON, default=list)
    status = Column(SAEnum(MatchStatus), default=MatchStatus.RECOMMENDED)


class CompetitorTracking(BaseModel):
    __tablename__ = "competitor_tracking"
    startup_id = Column(String, ForeignKey("startup_profiles.id"), nullable=False)
    competitor_name = Column(String)
    website = Column(String)
    category = Column(String)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    pricing = Column(String)
    market_share = Column(String)
    recent_launches = Column(JSON, default=list)
    differentiators = Column(JSON, default=list)
    threat_level = Column(String, default="medium")


class GTMRecommendation(BaseModel):
    __tablename__ = "gtm_recommendations"
    startup_id = Column(String, ForeignKey("startup_profiles.id"), nullable=False)
    type = Column(String)
    title = Column(String)
    content = Column(Text)
    target_buyer_id = Column(String)
    confidence = Column(Float, default=0)


class AuditLog(BaseModel):
    __tablename__ = "audit_log"
    user_id = Column(String, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    resource_type = Column(String)
    resource_id = Column(String)
    details = Column(JSON)
    ip_address = Column(String)
