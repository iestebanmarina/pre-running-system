-- =====================================================
-- PRE-RUNNING SYSTEM - INITIAL DATABASE SCHEMA
-- Migration: 001_initial_schema
-- Created: 2026-02-15
-- Description: Creates core tables for assessments, plans,
--              and user profiles with Row Level Security
-- =====================================================

-- =====================================================
-- TABLE: user_profiles
-- Description: Extended user information (Supabase Auth handles authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: assessments
-- Description: Stores user assessment results (baseline + weekly re-tests)
-- Week 0 = initial baseline assessment
-- Week 1-12 = weekly re-tests to track progress
-- =====================================================
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week INTEGER DEFAULT 0, -- 0 = baseline, 1-12 = re-tests

  -- Test 1: Ankle ROM (Dorsiflexion)
  -- Unit: centimeters (cm)
  -- Range: 5-20 cm
  -- Interpretation: <10cm = HIGH priority, 10-12cm = MEDIUM, >12cm = OPTIMAL
  ankle_rom_right DECIMAL,
  ankle_rom_left DECIMAL,

  -- Test 2: Hip Extension
  -- Unit: degrees
  -- Range: -15 to +20 degrees
  -- Interpretation: <-5° = HIGH priority (tight hip flexors)
  hip_extension_right DECIMAL,
  hip_extension_left DECIMAL,

  -- Test 3: Glute Activation
  -- Values: 'glute_first' | 'simultaneous' | 'hamstrings_first'
  -- Interpretation: 'hamstrings_first' = HIGH priority (glute dysfunction)
  glute_activation_right TEXT,
  glute_activation_left TEXT,

  -- Test 4: Core Stability
  -- Unit: seconds (plank hold time)
  -- Range: 5-300 seconds
  -- Interpretation: <30s = HIGH, 30-60s = MEDIUM, >60s = GOOD
  core_plank_time INTEGER,

  -- Test 5: Posterior Chain Flexibility
  -- Values: 'toes' | 'shins' | 'knees' | 'thighs'
  -- Interpretation: 'knees' or 'thighs' = MEDIUM priority
  posterior_chain_flexibility TEXT,

  -- Test 6: Aerobic Capacity
  -- Values: '45min_easy' | '30-45min_mild' | 'under_30min_hard'
  -- Interpretation: 'under_30min_hard' = HIGH priority (poor aerobic base)
  aerobic_capacity TEXT,

  -- Test 7: Balance/Stability
  -- Unit: seconds (single leg stand time)
  -- Range: 5-300 seconds
  -- Interpretation: <60s = MEDIUM priority
  balance_right INTEGER,
  balance_left INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: plans
-- Description: Personalized training plans generated from assessments
-- Each user gets a plan based on their baseline assessment
-- =====================================================
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id),

  -- Plan data stored as JSONB for flexibility
  -- Structure: [{ area, severity, current, target, weeklyMinutes, exercises }]
  priorities JSONB NOT NULL,

  -- Program duration (calculated based on priorities)
  estimated_weeks INTEGER NOT NULL, -- 6, 8, or 10 weeks for Phase 2
  phase_1_duration INTEGER DEFAULT 2, -- Assessment phase (always 2 weeks)
  phase_2_duration INTEGER NOT NULL, -- Foundations phase (6-10 weeks)
  phase_3_duration INTEGER DEFAULT 4, -- Transition to running (always 4 weeks)
  total_weeks INTEGER NOT NULL, -- Total program duration (12-16 weeks)

  -- Plan metadata
  status TEXT DEFAULT 'active', -- 'active' | 'completed' | 'abandoned'
  current_week INTEGER DEFAULT 1, -- Tracks user progress through the plan

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- Description: Improve query performance for common lookups
-- =====================================================
CREATE INDEX idx_assessments_user_week ON public.assessments(user_id, week);
CREATE INDEX idx_plans_user_status ON public.plans(user_id, status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Description: Enable RLS to ensure users can only access their own data
-- =====================================================
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES: assessments
-- Description: Users can only view and insert their own assessments
-- =====================================================
CREATE POLICY "Users can view own assessments"
  ON public.assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLICIES: plans
-- Description: Users can view, insert, and update their own plans
-- =====================================================
CREATE POLICY "Users can view own plans"
  ON public.plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON public.plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans"
  ON public.plans FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- POLICIES: user_profiles
-- Description: Users can view and update their own profile
-- =====================================================
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- TRIGGER: Update user_profiles.updated_at on changes
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- END OF MIGRATION
-- =====================================================
