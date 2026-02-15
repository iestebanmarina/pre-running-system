# Supabase Migrations

This directory contains SQL migration files for the Pre-Running System database schema.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Migration Files](#migration-files)
- [Database Schema](#database-schema)
- [Running Migrations](#running-migrations)
- [Data Structures](#data-structures)

---

## 🚀 Quick Start

### Option 1: Supabase Dashboard (Recommended for MVP)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `001_initial_schema.sql`
5. Paste into the query editor
6. Click **Run** (or press `Ctrl/Cmd + Enter`)
7. Verify tables were created in **Database** → **Tables**

### Option 2: Supabase CLI (For production)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## 📁 Migration Files

| File | Description | Status |
|------|-------------|--------|
| `001_initial_schema.sql` | Core tables: `user_profiles`, `assessments`, `plans` with RLS policies | ✅ Active |

---

## 🗂️ Database Schema

### Tables Overview

#### 1. `user_profiles`
Extended user information (authentication handled by Supabase Auth).

**Columns:**
- `id` (UUID, PK) - References `auth.users(id)`
- `full_name` (TEXT) - User's full name
- `created_at` (TIMESTAMPTZ) - Record creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Purpose:** Store additional user data beyond Supabase Auth (name, preferences, etc.)

---

#### 2. `assessments`
Stores user assessment results for baseline and weekly re-tests.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `week` (INTEGER) - 0 = baseline, 1-12 = weekly re-tests

**Test Data:**
- `ankle_rom_right/left` (DECIMAL) - Ankle dorsiflexion in cm (5-20 cm range)
- `hip_extension_right/left` (DECIMAL) - Hip extension in degrees (-15 to +20°)
- `glute_activation_right/left` (TEXT) - 'glute_first' | 'simultaneous' | 'hamstrings_first'
- `core_plank_time` (INTEGER) - Plank hold time in seconds
- `posterior_chain_flexibility` (TEXT) - 'toes' | 'shins' | 'knees' | 'thighs'
- `aerobic_capacity` (TEXT) - '45min_easy' | '30-45min_mild' | 'under_30min_hard'
- `balance_right/left` (INTEGER) - Single leg stand time in seconds

**Purpose:** Track user's physical limitations and progress over 12 weeks.

**Indexes:**
- `idx_assessments_user_week` on `(user_id, week)` - Fast lookup of user's weekly assessments

---

#### 3. `plans`
Personalized training plans generated from baseline assessments.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `assessment_id` (UUID, FK → assessments)
- `priorities` (JSONB) - Array of priority objects (see structure below)
- `estimated_weeks` (INTEGER) - 6, 8, or 10 weeks for Phase 2
- `phase_1_duration` (INTEGER) - Assessment phase (always 2 weeks)
- `phase_2_duration` (INTEGER) - Foundations phase (6-10 weeks)
- `phase_3_duration` (INTEGER) - Transition to running (always 4 weeks)
- `total_weeks` (INTEGER) - Total program duration (12-16 weeks)
- `status` (TEXT) - 'active' | 'completed' | 'abandoned'
- `current_week` (INTEGER) - User's progress (1-12+)

**Purpose:** Store personalized training plan based on user's assessment results.

**Indexes:**
- `idx_plans_user_status` on `(user_id, status)` - Fast lookup of active user plans

---

## 📊 Data Structures

### Assessment Interpretation Rules

| Test | Metric | High Priority | Medium Priority | Optimal |
|------|--------|---------------|-----------------|---------|
| Ankle ROM | cm | < 10 | 10-12 | ≥ 12 |
| Hip Extension | degrees | < -5 | -5 to 0 | ≥ 0 |
| Glute Activation | pattern | hamstrings_first | simultaneous | glute_first |
| Core | seconds | < 30 | 30-60 | ≥ 60 |
| Posterior Chain | reach | knees/thighs | shins | toes |
| Aerobic | capacity | under_30min_hard | 30-45min_mild | 45min_easy |
| Balance | seconds | < 30 | 30-60 | ≥ 60 |

### Priorities JSONB Structure

The `plans.priorities` column stores an array of priority objects:

```json
[
  {
    "area": "Ankle ROM",
    "severity": "HIGH",
    "current": 8.5,
    "target": 13,
    "weeklyMinutes": 70,
    "exercises": ["ankle_wall_mobility", "calf_stretch", "dorsiflexion_active"]
  },
  {
    "area": "Glute Activation",
    "severity": "HIGH",
    "current": "hamstrings_first",
    "target": "glute_first",
    "weeklyMinutes": 105,
    "exercises": ["clams", "bridge", "single_leg_bridge", "fire_hydrants"]
  }
]
```

**Fields:**
- `area` (string) - Name of the limitation (e.g., "Ankle ROM", "Core Stability")
- `severity` (string) - "HIGH" | "MEDIUM" | "LOW"
- `current` (number|string) - User's current measurement
- `target` (number|string) - Goal value to achieve
- `weeklyMinutes` (number) - Recommended weekly training time for this area
- `exercises` (array) - List of exercise IDs to address this limitation

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled to ensure data privacy.

### Policies Summary

| Table | Policy | Rule |
|-------|--------|------|
| `user_profiles` | SELECT | User can view own profile (`auth.uid() = id`) |
| `user_profiles` | UPDATE | User can update own profile |
| `assessments` | SELECT | User can view own assessments (`auth.uid() = user_id`) |
| `assessments` | INSERT | User can insert own assessments |
| `plans` | SELECT | User can view own plans |
| `plans` | INSERT | User can insert own plans |
| `plans` | UPDATE | User can update own plans |

**Note:** DELETE policies are intentionally omitted for data integrity. Users should not delete assessments or plans. Use `status = 'abandoned'` for soft deletes.

---

## 🧪 Testing the Schema

After running the migration, verify the setup:

### 1. Check Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_profiles', 'assessments', 'plans');
```

### 2. Verify RLS is Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'assessments', 'plans');
```

### 3. Check Policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

### 4. Insert Test Data (as authenticated user)
```sql
-- This should work if you're authenticated
INSERT INTO public.assessments (user_id, week, ankle_rom_right, ankle_rom_left)
VALUES (auth.uid(), 0, 12.5, 11.8);
```

---

## 📝 Adding New Migrations

When creating new migrations, follow this naming convention:

```
XXX_description.sql
```

- `XXX` - Sequential number (002, 003, etc.)
- `description` - Brief description in snake_case

**Examples:**
- `002_add_exercises_table.sql`
- `003_add_weekly_plans.sql`
- `004_add_user_sessions.sql`

**Template:**
```sql
-- =====================================================
-- PRE-RUNNING SYSTEM - [MIGRATION DESCRIPTION]
-- Migration: XXX_description
-- Created: YYYY-MM-DD
-- Description: Brief description of what this migration does
-- =====================================================

-- Your SQL here

-- =====================================================
-- END OF MIGRATION
-- =====================================================
```

---

## 🆘 Troubleshooting

### Issue: RLS blocking inserts
**Solution:** Ensure you're authenticated when testing. Use Supabase client with valid session.

### Issue: Foreign key constraint fails
**Solution:** Ensure `auth.users` exists (it's created automatically by Supabase Auth).

### Issue: Duplicate table errors
**Solution:** Use `CREATE TABLE IF NOT EXISTS` or drop existing tables first (⚠️ loses data).

### Issue: Policy not working
**Solution:** Verify `auth.uid()` returns correct user ID. Check Supabase logs for RLS violations.

---

## 📚 Resources

- [Supabase SQL Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)

---

**Last Updated:** 2026-02-15
**Migration Version:** 001
**Status:** ✅ Ready for production
