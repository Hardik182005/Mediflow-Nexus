-- ==========================================
-- Migration: Enable Row Level Security (RLS)
-- Run this in your Supabase SQL Editor
-- ==========================================

-- ========================
-- Enable RLS on all tables
-- ========================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE prior_auth_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE denials ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payer_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropoff_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE gtm_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ========================
-- Users table policies
-- ========================
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================
-- Clinics — authenticated read, owner write
-- ========================
CREATE POLICY "Authenticated users can read clinics"
  ON clinics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clinic members can update their clinic"
  ON clinics FOR UPDATE
  TO authenticated
  USING (
    id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Startup Profiles — authenticated read, startup members write
-- ========================
CREATE POLICY "Authenticated users can read startups"
  ON startup_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create startups"
  ON startup_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Startup members can update their profile"
  ON startup_profiles FOR UPDATE
  TO authenticated
  USING (
    id IN (SELECT startup_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Patients — clinic-scoped access
-- ========================
CREATE POLICY "Clinic staff can read their patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Clinic staff can create patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (
    clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Clinic staff can update their patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (
    clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Insurance Cases — follow patient access
-- ========================
CREATE POLICY "Read insurance cases for own clinic patients"
  ON insurance_cases FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Create insurance cases for own clinic patients"
  ON insurance_cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Prior Auth — follow patient access
-- ========================
CREATE POLICY "Read prior auth for own clinic"
  ON prior_auth_cases FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Create prior auth"
  ON prior_auth_cases FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Denials — follow patient access
-- ========================
CREATE POLICY "Read denials for own clinic"
  ON denials FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE clinic_id IN (
        SELECT clinic_id FROM public.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Create denials"
  ON denials FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Appeals — follow denial access
-- ========================
CREATE POLICY "Read appeals"
  ON appeals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Create appeals"
  ON appeals FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Payer Rules — read-only for all authenticated
-- ========================
CREATE POLICY "Read payer rules"
  ON payer_rules FOR SELECT
  TO authenticated
  USING (true);

-- ========================
-- Revenue Predictions — clinic-scoped
-- ========================
CREATE POLICY "Read revenue predictions for own clinic"
  ON revenue_predictions FOR SELECT
  TO authenticated
  USING (
    clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Payer Analytics — read-only for authenticated
-- ========================
CREATE POLICY "Read payer analytics"
  ON payer_analytics FOR SELECT
  TO authenticated
  USING (true);

-- ========================
-- Referrals — clinic-scoped
-- ========================
CREATE POLICY "Read referrals for own clinic"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Dropoff Predictions — authenticated read
-- ========================
CREATE POLICY "Read dropoff predictions"
  ON dropoff_predictions FOR SELECT
  TO authenticated
  USING (true);

-- ========================
-- Buyer Profiles — authenticated read/write
-- ========================
CREATE POLICY "Read buyer profiles"
  ON buyer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Create buyer profiles"
  ON buyer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Sales Pipeline — startup-scoped
-- ========================
CREATE POLICY "Read own sales pipeline"
  ON sales_pipeline FOR SELECT
  TO authenticated
  USING (
    startup_id IN (SELECT startup_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Create pipeline entries"
  ON sales_pipeline FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Update own pipeline entries"
  ON sales_pipeline FOR UPDATE
  TO authenticated
  USING (
    startup_id IN (SELECT startup_id FROM public.users WHERE id = auth.uid())
  );

-- ========================
-- Marketplace Matches — authenticated read/write
-- ========================
CREATE POLICY "Read marketplace matches"
  ON marketplace_matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Create marketplace matches"
  ON marketplace_matches FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Competitor Tracking — startup-scoped
-- ========================
CREATE POLICY "Read own competitor tracking"
  ON competitor_tracking FOR SELECT
  TO authenticated
  USING (
    startup_id IN (SELECT startup_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Create competitor entries"
  ON competitor_tracking FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- GTM Recommendations — startup-scoped
-- ========================
CREATE POLICY "Read own GTM recommendations"
  ON gtm_recommendations FOR SELECT
  TO authenticated
  USING (
    startup_id IN (SELECT startup_id FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "Create GTM recommendations"
  ON gtm_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ========================
-- Audit Log — read own, write all
-- ========================
CREATE POLICY "Read own audit log"
  ON audit_log FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Create audit log entries"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);
