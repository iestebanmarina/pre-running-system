-- PRE-RUNNING SYSTEM - TEMPORARY ANONYMOUS INSERTS
-- Migration: 002_temp_allow_anonymous_inserts
-- Created: 2026-02-15
-- Description: Allow anonymous inserts for MVP development
-- WARNING: REVERT THIS IN PRODUCTION AFTER AUTH IS IMPLEMENTED

-- TEMPORARY POLICIES FOR MVP DEVELOPMENT
-- These policies allow inserts without authentication
-- Remove these when Auth is implemented in Phase 1.5

-- Allow anonymous inserts to assessments (for testing without auth)
CREATE POLICY "TEMP: Allow anonymous inserts to assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (true);

-- Allow anonymous inserts to plans (for testing without auth)
CREATE POLICY "TEMP: Allow anonymous inserts to plans"
  ON public.plans FOR INSERT
  WITH CHECK (true);

-- Allow anonymous selects (for viewing results without auth)
CREATE POLICY "TEMP: Allow anonymous selects on assessments"
  ON public.assessments FOR SELECT
  USING (true);

CREATE POLICY "TEMP: Allow anonymous selects on plans"
  ON public.plans FOR SELECT
  USING (true);

-- NOTES FOR FUTURE CLEANUP (Phase 1.5 - Auth Implementation)
-- When implementing authentication, run this cleanup:
-- DROP POLICY "TEMP: Allow anonymous inserts to assessments" ON public.assessments;
-- DROP POLICY "TEMP: Allow anonymous inserts to plans" ON public.plans;
-- DROP POLICY "TEMP: Allow anonymous selects on assessments" ON public.assessments;
-- DROP POLICY "TEMP: Allow anonymous selects on plans" ON public.plans;
