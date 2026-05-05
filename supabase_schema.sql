-- ==========================================
-- Supabase Schema Migration (Safe to re-run)
-- All tables use IF NOT EXISTS
-- All enums use DO $$ BEGIN wrapper
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- Enums (safe re-run wrappers)
-- ========================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'clinic_admin', 'clinic_staff', 'startup_admin', 'startup_member');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE patient_status AS ENUM ('intake', 'verified', 'authorized', 'in_treatment', 'completed', 'dropped');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE insurance_status AS ENUM ('pending', 'verified', 'expired', 'denied');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE pa_status AS ENUM ('required', 'submitted', 'approved', 'denied', 'not_required');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE denial_status AS ENUM ('predicted', 'denied', 'appealed', 'overturned', 'upheld');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE deal_stage AS ENUM ('lead', 'meeting', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('recommended', 'connected', 'in_discussion', 'partnered', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ========================
-- Tables (all IF NOT EXISTS)
-- ========================

-- Clinics
CREATE TABLE IF NOT EXISTS clinics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    name text NOT NULL,
    specialty text,
    address text,
    city text,
    state text,
    zip text,
    phone text,
    email text,
    npi text UNIQUE,
    tax_id text,
    patient_count integer DEFAULT 0,
    monthly_revenue numeric DEFAULT 0,
    status text DEFAULT 'active'
);

-- Startup Profiles
CREATE TABLE IF NOT EXISTS startup_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid UNIQUE REFERENCES auth.users(id),
    name text NOT NULL,
    website text,
    description text,
    category text,
    stage text,
    target_market text,
    icp text,
    value_proposition text,
    funding_stage text,
    team_size integer,
    founded text,
    hq_location text,
    logo_url text,
    pitch_deck_url text,
    product_category text,
    match_score numeric,
    solution_type text,
    status text DEFAULT 'onboarding'
);

-- Users (links to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    role user_role DEFAULT 'clinic_staff',
    avatar_url text,
    clinic_id uuid REFERENCES clinics(id),
    startup_id uuid REFERENCES startup_profiles(id)
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    clinic_id uuid REFERENCES clinics(id) NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    dob text,
    gender text,
    email text,
    phone text,
    insurance_provider text,
    policy_number text,
    group_number text,
    diagnosis_code text,
    cpt_codes jsonb DEFAULT '[]'::jsonb,
    treatment_readiness_score numeric DEFAULT 0,
    document_completeness numeric DEFAULT 0,
    status patient_status DEFAULT 'intake'
);

-- Insurance Cases
CREATE TABLE IF NOT EXISTS insurance_cases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    patient_id uuid REFERENCES patients(id) NOT NULL,
    patient_name text,
    insurance_provider text,
    policy_number text,
    cpt_code text,
    status insurance_status DEFAULT 'pending',
    coverage_active boolean DEFAULT true,
    deductible numeric DEFAULT 0,
    deductible_met numeric DEFAULT 0,
    copay numeric DEFAULT 0,
    coinsurance numeric DEFAULT 0,
    out_of_pocket_max numeric DEFAULT 0,
    out_of_pocket_met numeric DEFAULT 0,
    cpt_covered boolean DEFAULT true,
    expiry_date text,
    verified_at timestamptz,
    vob_data jsonb,
    risk_score text,
    denial_probability numeric DEFAULT 0,
    estimated_reimbursement numeric DEFAULT 0,
    denial_risk_score numeric DEFAULT 0
);

-- Prior Auth Cases
CREATE TABLE IF NOT EXISTS prior_auth_cases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    patient_id uuid REFERENCES patients(id) NOT NULL,
    patient_name text,
    cpt_code text,
    diagnosis_code text,
    insurance_provider text,
    status pa_status DEFAULT 'required',
    approval_probability numeric DEFAULT 0,
    missing_documents jsonb DEFAULT '[]'::jsonb,
    submitted_at timestamptz,
    decided_at timestamptz,
    expires_at timestamptz,
    auth_number text
);

-- Denials
CREATE TABLE IF NOT EXISTS denials (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    patient_id uuid REFERENCES patients(id) NOT NULL,
    patient_name text,
    cpt_code text,
    insurance_provider text,
    denial_reason text,
    denial_code text,
    claim_amount numeric DEFAULT 0,
    risk_score numeric DEFAULT 0,
    status denial_status DEFAULT 'predicted',
    fix_recommendations jsonb DEFAULT '[]'::jsonb,
    appeal_deadline text
);

-- Appeals
CREATE TABLE IF NOT EXISTS appeals (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    denial_id uuid REFERENCES denials(id) NOT NULL,
    patient_name text,
    status text DEFAULT 'draft',
    letter_content text,
    submitted_at timestamptz,
    resolved_at timestamptz
);

-- Payer Rules
CREATE TABLE IF NOT EXISTS payer_rules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    payer_name text NOT NULL,
    rule_type text,
    cpt_code text,
    requires_pa boolean DEFAULT false,
    documentation_required jsonb DEFAULT '[]'::jsonb,
    avg_approval_days integer,
    denial_rate numeric
);

-- Revenue Predictions
CREATE TABLE IF NOT EXISTS revenue_predictions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    clinic_id uuid REFERENCES clinics(id) NOT NULL,
    cpt_code text,
    expected_reimbursement numeric,
    actual_reimbursement numeric,
    delay_risk text DEFAULT 'low',
    leakage_amount numeric DEFAULT 0,
    leakage_reason text,
    predicted_date text
);

-- Payer Analytics
CREATE TABLE IF NOT EXISTS payer_analytics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    payer_name text NOT NULL,
    avg_approval_time numeric,
    denial_rate numeric,
    avg_reimbursement numeric,
    total_claims integer,
    approved_claims integer,
    denied_claims integer,
    pending_claims integer,
    avg_payment_delay numeric,
    performance_score numeric
);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    clinic_id uuid REFERENCES clinics(id),
    referrer_name text,
    referrer_type text,
    patient_count integer DEFAULT 0,
    revenue numeric DEFAULT 0,
    conversion_rate numeric DEFAULT 0,
    trend text DEFAULT 'stable'
);

-- Dropoff Predictions
CREATE TABLE IF NOT EXISTS dropoff_predictions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    patient_id uuid REFERENCES patients(id),
    patient_name text,
    risk_score numeric,
    predicted_stage text,
    reasons jsonb DEFAULT '[]'::jsonb,
    recommended_actions jsonb DEFAULT '[]'::jsonb
);

-- Buyer Profiles
CREATE TABLE IF NOT EXISTS buyer_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    name text NOT NULL,
    title text,
    organization text,
    organization_type text,
    email text,
    phone text,
    city text,
    state text,
    specialty text,
    buyer_score numeric DEFAULT 0,
    interests jsonb DEFAULT '[]'::jsonb,
    decision_maker_level text,
    budget_range text,
    status text DEFAULT 'discovered',
    last_contacted_at timestamptz
);

-- Sales Pipeline
CREATE TABLE IF NOT EXISTS sales_pipeline (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    startup_id uuid REFERENCES startup_profiles(id) NOT NULL,
    buyer_id uuid REFERENCES buyer_profiles(id) NOT NULL,
    buyer_name text,
    buyer_organization text,
    deal_value numeric DEFAULT 0,
    stage deal_stage DEFAULT 'lead',
    win_probability numeric DEFAULT 0,
    next_action text,
    next_action_date text,
    notes text
);

-- Marketplace Matches (clinic_id nullable for buyers.json-based matching)
CREATE TABLE IF NOT EXISTS marketplace_matches (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    startup_id uuid REFERENCES startup_profiles(id),
    startup_name text,
    clinic_id uuid REFERENCES clinics(id),
    clinic_name text,
    buyer_id text,
    buyer_name text,
    match_score numeric DEFAULT 0,
    match_reasons jsonb DEFAULT '[]'::jsonb,
    status match_status DEFAULT 'recommended'
);

-- Competitor Tracking
CREATE TABLE IF NOT EXISTS competitor_tracking (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    startup_id uuid REFERENCES startup_profiles(id) NOT NULL,
    competitor_name text,
    website text,
    category text,
    strengths jsonb DEFAULT '[]'::jsonb,
    weaknesses jsonb DEFAULT '[]'::jsonb,
    pricing text,
    market_share text,
    recent_launches jsonb DEFAULT '[]'::jsonb,
    differentiators jsonb DEFAULT '[]'::jsonb,
    threat_level text DEFAULT 'medium'
);

-- GTM Recommendations
CREATE TABLE IF NOT EXISTS gtm_recommendations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    startup_id uuid REFERENCES startup_profiles(id) NOT NULL,
    type text,
    title text,
    content text,
    target_buyer_id text,
    confidence numeric DEFAULT 0
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    resource_type text,
    resource_id text,
    details jsonb,
    ip_address text
);

-- ==============================================================================
-- Row Level Security (RLS) — ENABLED
-- Full policies are defined in migrations/003_enable_rls.sql
-- Run that migration in your Supabase SQL Editor to activate security.
-- ==============================================================================

-- Allow users to insert their own startup profile
CREATE POLICY "Users can insert own startup profile"
ON startup_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own startup profile
CREATE POLICY "Users can read own startup profile"
ON startup_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to update their own startup profile
CREATE POLICY "Users can update own startup profile"
ON startup_profiles FOR UPDATE
USING (auth.uid() = user_id);
