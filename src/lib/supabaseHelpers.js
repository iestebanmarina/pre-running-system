/**
 * Supabase Helper Functions
 *
 * Abstraction layer for database operations related to assessments and plans.
 * Provides clean async functions with error handling for CRUD operations.
 *
 * Usage:
 * - Call these functions from components/pages
 * - Always handle the { data, error } response pattern
 * - Show user-friendly error messages on failure
 */

import { supabase } from './supabase'

// ============================================================================
// ASSESSMENTS
// ============================================================================

/**
 * Saves an assessment to the database
 *
 * @param {Object} assessmentData - Complete assessment data from all 7 tests
 * @param {string} userId - User's UUID from auth
 * @param {number} week - Week number (0 = baseline, 1-12 = weekly re-tests)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 *
 * @example
 * const { data, error } = await saveAssessment(assessmentData, userId, 0)
 * if (error) {
 *   console.error('Failed to save assessment:', error)
 *   toast.error('No se pudo guardar la evaluación')
 * }
 */
export async function saveAssessment(assessmentData, userId, week = 0) {
  try {
    // Validate userId (temporary until auth is implemented)
    if (!userId || userId === 'TEMP_USER_ID') {
      console.warn('⚠️ Usuario temporal - en producción necesitas autenticación')
    }

    // Prepare data for database insertion
    // Map from assessment component keys to database column names
    const dbRecord = {
      user_id: userId,
      week: week,

      // Ankle ROM (Test 1)
      ankle_rom_right: assessmentData.ankle_rom_right || null,
      ankle_rom_left: assessmentData.ankle_rom_left || null,

      // Hip Extension (Test 2)
      hip_extension_right: assessmentData.hip_extension_right ?? null,
      hip_extension_left: assessmentData.hip_extension_left ?? null,

      // Glute Activation (Test 3)
      glute_activation_right: assessmentData.glute_activation_right || null,
      glute_activation_left: assessmentData.glute_activation_left || null,

      // Core Stability (Test 4)
      core_plank_time: assessmentData.core_plank_time ?? null,

      // Posterior Chain Flexibility (Test 5)
      posterior_chain_flexibility: assessmentData.posterior_chain_flexibility || null,

      // Aerobic Capacity (Test 6)
      aerobic_capacity: assessmentData.aerobic_capacity || null,

      // Balance (Test 7)
      balance_right: assessmentData.balance_right ?? null,
      balance_left: assessmentData.balance_left ?? null
    }

    // Insert into database
    const { data, error } = await supabase
      .from('assessments')
      .insert([dbRecord])
      .select() // Return the inserted record
      .single() // Expect single row

    if (error) {
      console.error('Supabase error saving assessment:', error)
      return { data: null, error }
    }

    console.log('Assessment saved successfully:', data.id)
    return { data, error: null }

  } catch (error) {
    console.error('Unexpected error saving assessment:', error)
    return { data: null, error }
  }
}

/**
 * Gets the latest assessment for a user
 * Useful for pre-populating re-tests or viewing progress
 *
 * @param {string} userId - User's UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 *
 * @example
 * const { data: latestAssessment, error } = await getLatestAssessment(userId)
 * if (latestAssessment) {
 *   console.log('Week:', latestAssessment.week)
 * }
 */
export async function getLatestAssessment(userId) {
  try {
    // Validate userId (temporary until auth is implemented)
    if (!userId || userId === 'TEMP_USER_ID') {
      console.warn('⚠️ Usuario temporal - en producción necesitas autenticación')
    }

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() // Returns null if no results, doesn't throw

    if (error) {
      console.error('Supabase error fetching latest assessment:', error)
      return { data: null, error }
    }

    return { data, error: null }

  } catch (error) {
    console.error('Unexpected error fetching latest assessment:', error)
    return { data: null, error }
  }
}

// ============================================================================
// PLANS
// ============================================================================

/**
 * Saves a personalized plan to the database
 *
 * @param {Object} planData - Generated plan from personalization algorithm
 * @param {string} userId - User's UUID
 * @param {string} assessmentId - UUID of the assessment this plan is based on
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 *
 * @example
 * const { data: planRecord, error } = await savePlan(plan, userId, assessmentId)
 * if (error) {
 *   console.error('Failed to save plan:', error)
 * }
 */
export async function savePlan(planData, userId, assessmentId) {
  try {
    // Validate userId (temporary until auth is implemented)
    if (!userId || userId === 'TEMP_USER_ID') {
      console.warn('⚠️ Usuario temporal - en producción necesitas autenticación')
    }

    // Prepare data for database insertion
    const dbRecord = {
      user_id: userId,
      assessment_id: assessmentId,

      // Plan structure (JSONB)
      priorities: planData.priorities || [],

      // Duration breakdown
      estimated_weeks: planData.estimatedWeeks || planData.foundationsDuration,
      phase_1_duration: 0,
      phase_2_duration: planData.foundationsDuration,
      phase_3_duration: planData.transitionDuration || 4,
      total_weeks: planData.totalWeeks,

      // Plan metadata
      status: 'active',
      current_week: 1
    }

    // Insert into database
    const { data, error } = await supabase
      .from('plans')
      .insert([dbRecord])
      .select() // Return the inserted record
      .single()

    if (error) {
      console.error('Supabase error saving plan:', error)
      return { data: null, error }
    }

    console.log('Plan saved successfully:', data.id)
    return { data, error: null }

  } catch (error) {
    console.error('Unexpected error saving plan:', error)
    return { data: null, error }
  }
}

/**
 * Gets the active plan for a user
 * Returns the most recent active plan
 *
 * @param {string} userId - User's UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 *
 * @example
 * const { data: activePlan, error } = await getUserPlan(userId)
 * if (activePlan) {
 *   console.log('Current week:', activePlan.current_week)
 *   console.log('Total weeks:', activePlan.total_weeks)
 * }
 */
export async function getUserPlan(userId) {
  try {
    // Validate userId (temporary until auth is implemented)
    if (!userId || userId === 'TEMP_USER_ID') {
      console.warn('⚠️ Usuario temporal - en producción necesitas autenticación')
    }

    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle() // Returns null if no active plan

    if (error) {
      console.error('Supabase error fetching user plan:', error)
      return { data: null, error }
    }

    return { data: normalizePlan(data), error: null }

  } catch (error) {
    console.error('Unexpected error fetching user plan:', error)
    return { data: null, error }
  }
}

// ============================================================================
// NORMALIZERS
// ============================================================================

/**
 * Normaliza un plan de Supabase (snake_case) al formato frontend (camelCase)
 */
export function normalizePlan(planFromDb) {
  if (!planFromDb) return null

  return {
    id: planFromDb.id,
    userId: planFromDb.user_id,
    assessmentId: planFromDb.assessment_id,
    priorities: planFromDb.priorities,
    estimatedWeeks: planFromDb.estimated_weeks,
    foundationsDuration: planFromDb.phase_2_duration,
    transitionDuration: planFromDb.phase_3_duration,
    totalWeeks: planFromDb.total_weeks,
    status: planFromDb.status,
    currentWeek: planFromDb.current_week,
    createdAt: planFromDb.created_at,
    updatedAt: planFromDb.updated_at
  }
}
