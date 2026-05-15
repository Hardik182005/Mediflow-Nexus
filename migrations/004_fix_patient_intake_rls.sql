-- ==========================================
-- Migration: Fix Patient Intake RLS Policies
-- Run this in your Supabase SQL Editor
-- This adds permissive policies so patient CRUD works
-- even when user-clinic associations are missing.
-- ==========================================

-- Drop existing restrictive patient policies
DROP POLICY IF EXISTS "Clinic staff can read their patients" ON patients;
DROP POLICY IF EXISTS "Clinic staff can create patients" ON patients;
DROP POLICY IF EXISTS "Clinic staff can update their patients" ON patients;

-- Create permissive policies for patients table
-- Allow all authenticated users to read all patients (for demo/hackathon)
CREATE POLICY "Authenticated users can read patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to insert patients
CREATE POLICY "Authenticated users can create patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow all authenticated users to update patients
CREATE POLICY "Authenticated users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true);

-- Also allow anon role (for server-side API without auth context)
CREATE POLICY "Anon can read patients"
  ON patients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can create patients"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update patients"
  ON patients FOR UPDATE
  TO anon
  USING (true);

-- Also fix clinics table - ensure anon can read/create
DROP POLICY IF EXISTS "Authenticated users can read clinics" ON clinics;

CREATE POLICY "Anyone can read clinics"
  ON clinics FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create clinics"
  ON clinics FOR INSERT
  WITH CHECK (true);

-- Fix users table - allow anon to read/write for server-side operations
CREATE POLICY "Anon can read users"
  ON public.users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert users"
  ON public.users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update users"
  ON public.users FOR UPDATE
  TO anon
  USING (true);
