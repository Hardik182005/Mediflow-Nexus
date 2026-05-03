-- ==========================================
-- Supabase Schema Migration
-- Auto-generated from previous FastAPI models
-- ==========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================
-- Enums
-- ========================
create type user_role as enum ('admin', 'clinic_admin', 'clinic_staff', 'startup_admin', 'startup_member');
create type patient_status as enum ('intake', 'verified', 'authorized', 'in_treatment', 'completed', 'dropped');
create type insurance_status as enum ('pending', 'verified', 'expired', 'denied');
create type pa_status as enum ('required', 'submitted', 'approved', 'denied', 'not_required');
create type denial_status as enum ('predicted', 'denied', 'appealed', 'overturned', 'upheld');
create type deal_stage as enum ('lead', 'meeting', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
create type match_status as enum ('recommended', 'connected', 'in_discussion', 'partnered', 'rejected');

-- ========================
-- Tables
-- ========================

-- Clinics
create table clinics (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    name text not null,
    specialty text,
    address text,
    city text,
    state text,
    zip text,
    phone text,
    email text,
    npi text unique,
    tax_id text,
    patient_count integer default 0,
    monthly_revenue numeric default 0,
    status text default 'active'
);

-- Startup Profiles
create table startup_profiles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    name text not null,
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
    status text default 'onboarding'
);

-- Users (links to Supabase auth.users)
create table public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    email text unique not null,
    name text not null,
    role user_role default 'clinic_staff',
    avatar_url text,
    clinic_id uuid references clinics(id),
    startup_id uuid references startup_profiles(id)
);

-- Patients
create table patients (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    clinic_id uuid references clinics(id) not null,
    first_name text not null,
    last_name text not null,
    dob text,
    gender text,
    email text,
    phone text,
    insurance_provider text,
    policy_number text,
    group_number text,
    diagnosis_code text,
    cpt_codes jsonb default '[]'::jsonb,
    treatment_readiness_score numeric default 0,
    document_completeness numeric default 0,
    status patient_status default 'intake'
);

-- Insurance Cases
create table insurance_cases (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    patient_id uuid references patients(id) not null,
    patient_name text,
    insurance_provider text,
    policy_number text,
    cpt_code text,
    status insurance_status default 'pending',
    coverage_active boolean default true,
    deductible numeric default 0,
    deductible_met numeric default 0,
    copay numeric default 0,
    coinsurance numeric default 0,
    out_of_pocket_max numeric default 0,
    out_of_pocket_met numeric default 0,
    cpt_covered boolean default true,
    expiry_date text,
    verified_at timestamptz
);

-- Prior Auth Cases
create table prior_auth_cases (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    patient_id uuid references patients(id) not null,
    patient_name text,
    cpt_code text,
    diagnosis_code text,
    insurance_provider text,
    status pa_status default 'required',
    approval_probability numeric default 0,
    missing_documents jsonb default '[]'::jsonb,
    submitted_at timestamptz,
    decided_at timestamptz,
    expires_at timestamptz,
    auth_number text
);

-- Denials
create table denials (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    patient_id uuid references patients(id) not null,
    patient_name text,
    cpt_code text,
    insurance_provider text,
    denial_reason text,
    denial_code text,
    claim_amount numeric default 0,
    risk_score numeric default 0,
    status denial_status default 'predicted',
    fix_recommendations jsonb default '[]'::jsonb,
    appeal_deadline text
);

-- Appeals
create table appeals (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    denial_id uuid references denials(id) not null,
    patient_name text,
    status text default 'draft',
    letter_content text,
    submitted_at timestamptz,
    resolved_at timestamptz
);

-- Payer Rules
create table payer_rules (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    payer_name text not null,
    rule_type text,
    cpt_code text,
    requires_pa boolean default false,
    documentation_required jsonb default '[]'::jsonb,
    avg_approval_days integer,
    denial_rate numeric
);

-- Revenue Predictions
create table revenue_predictions (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    clinic_id uuid references clinics(id) not null,
    cpt_code text,
    expected_reimbursement numeric,
    actual_reimbursement numeric,
    delay_risk text default 'low',
    leakage_amount numeric default 0,
    leakage_reason text,
    predicted_date text
);

-- Payer Analytics
create table payer_analytics (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    payer_name text not null,
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
create table referrals (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    clinic_id uuid references clinics(id),
    referrer_name text,
    referrer_type text,
    patient_count integer default 0,
    revenue numeric default 0,
    conversion_rate numeric default 0,
    trend text default 'stable'
);

-- Dropoff Predictions
create table dropoff_predictions (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    patient_id uuid references patients(id),
    patient_name text,
    risk_score numeric,
    predicted_stage text,
    reasons jsonb default '[]'::jsonb,
    recommended_actions jsonb default '[]'::jsonb
);

-- Buyer Profiles
create table buyer_profiles (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    name text not null,
    title text,
    organization text,
    organization_type text,
    email text,
    phone text,
    city text,
    state text,
    specialty text,
    buyer_score numeric default 0,
    interests jsonb default '[]'::jsonb,
    decision_maker_level text,
    budget_range text,
    status text default 'discovered',
    last_contacted_at timestamptz
);

-- Sales Pipeline
create table sales_pipeline (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    startup_id uuid references startup_profiles(id) not null,
    buyer_id uuid references buyer_profiles(id) not null,
    buyer_name text,
    buyer_organization text,
    deal_value numeric default 0,
    stage deal_stage default 'lead',
    win_probability numeric default 0,
    next_action text,
    next_action_date text,
    notes text
);

-- Marketplace Matches
create table marketplace_matches (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    startup_id uuid references startup_profiles(id) not null,
    startup_name text,
    clinic_id uuid references clinics(id) not null,
    clinic_name text,
    match_score numeric default 0,
    match_reasons jsonb default '[]'::jsonb,
    status match_status default 'recommended'
);

-- Competitor Tracking
create table competitor_tracking (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    startup_id uuid references startup_profiles(id) not null,
    competitor_name text,
    website text,
    category text,
    strengths jsonb default '[]'::jsonb,
    weaknesses jsonb default '[]'::jsonb,
    pricing text,
    market_share text,
    recent_launches jsonb default '[]'::jsonb,
    differentiators jsonb default '[]'::jsonb,
    threat_level text default 'medium'
);

-- GTM Recommendations
create table gtm_recommendations (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    startup_id uuid references startup_profiles(id) not null,
    type text,
    title text,
    content text,
    target_buyer_id text,
    confidence numeric default 0
);

-- Audit Log
create table audit_log (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    user_id uuid references auth.users(id),
    action text not null,
    resource_type text,
    resource_id text,
    details jsonb,
    ip_address text
);

-- ==============================================================================
-- Add RLS (Row Level Security) - Minimal setup (Allow all for development)
-- You will need to restrict these before production!
-- ==============================================================================

-- Example for users table:
-- alter table public.users enable row level security;
-- create policy "Allow public read-access" on public.users for select using (true);
-- create policy "Allow individuals to update their own user." on public.users for update using (auth.uid() = id);

