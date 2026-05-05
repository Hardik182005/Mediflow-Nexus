-- ==========================================
-- Migration: Add AI intelligence columns + schema fixes
-- Safe to re-run (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Add VOB/AI columns to insurance_cases
ALTER TABLE insurance_cases
  ADD COLUMN IF NOT EXISTS vob_data jsonb,
  ADD COLUMN IF NOT EXISTS risk_score text,
  ADD COLUMN IF NOT EXISTS denial_probability numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_reimbursement numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS denial_risk_score numeric DEFAULT 0;

-- 2. Add solution_type and user_id to startup_profiles
ALTER TABLE startup_profiles
  ADD COLUMN IF NOT EXISTS solution_type text,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2b. Add unique constraint on user_id for upsert support
DO $$ BEGIN
  ALTER TABLE startup_profiles ADD CONSTRAINT startup_profiles_user_id_key UNIQUE (user_id);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- 3. Make clinic_id nullable in marketplace_matches (for buyers.json matching)
ALTER TABLE marketplace_matches
  ALTER COLUMN clinic_id DROP NOT NULL;

-- 4. Make startup_id nullable in marketplace_matches (for intro requests)
ALTER TABLE marketplace_matches
  ALTER COLUMN startup_id DROP NOT NULL;

-- 5. Add buyer fields to marketplace_matches
ALTER TABLE marketplace_matches
  ADD COLUMN IF NOT EXISTS buyer_id text,
  ADD COLUMN IF NOT EXISTS buyer_name text;
