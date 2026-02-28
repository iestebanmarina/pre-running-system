/**
 * Pre-Running System - Personalization Algorithm
 *
 * Analyzes assessment data (7 biomechanical tests) and generates a personalized
 * 12-week training plan with specific priorities, exercises, and duration.
 *
 * Medical rationale:
 * - 70% of beginner runners get injured due to structural dysfunctions
 * - Sedentary lifestyle creates predictable limitations (ankle ROM, hip extension, glute activation)
 * - Individualized preparation reduces injury rate from 70% to 5-10%
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Exercise IDs referenced in the plan
 * Actual exercise content (videos, instructions) will be in exercises database (Phase 2)
 */
/**
 * Exercise pools organized by training phase.
 *
 * Phase 1 (isolation): weeks 1-4 — CNS re-education, isolated activation
 * Phase 2 (integration): weeks 5-8 — multi-joint movements, stability under load
 * Phase 3 (compound): weeks 9+ — compound movements, running-specific
 *
 * Corrections applied:
 * - ANKLE_ROM: removed hip_flexor_stretch (wrong category), calf_raises (strengthens
 *   plantiflexion, doesn't improve dorsiflexion ROM). Added tibialis_anterior_strengthening
 *   and dorsiflexion_eccentric.
 * - GLUTE_ACTIVATION: removed hip_thrust, bulgarian_split_squat (strength exercises that
 *   reinforce hamstring dominance before pattern is restored). Removed glute_kickback
 *   (prone position shortens hamstrings). Moved compound exercises to phase 3.
 * - POSTERIOR_CHAIN: removed good_morning (loaded spinal flexion with tight hamstrings =
 *   high lumbar injury risk). Added romanian_deadlift_bodyweight.
 * - BALANCE: single_leg_rdl requires prerequisite balance > 30s (enforced in evaluator).
 */
const EXERCISES = {
  ANKLE_ROM: {
    phase1: ['ankle_wall_mobility', 'ankle_circles', 'dorsiflexion_active'],
    phase2: ['ankle_wall_mobility', 'ankle_circles', 'dorsiflexion_active', 'toe_walking', 'tibialis_anterior_strengthening'],
    phase3: ['ankle_wall_mobility', 'dorsiflexion_active', 'dorsiflexion_eccentric', 'tibialis_anterior_strengthening', 'toe_walking'],
    all: ['ankle_wall_mobility', 'ankle_circles', 'toe_walking', 'dorsiflexion_active', 'tibialis_anterior_strengthening', 'dorsiflexion_eccentric']
  },
  HIP_EXTENSION: {
    phase1: ['hip_flexor_stretch', 'couch_stretch', '90_90_hip_mobility'],
    phase2: ['hip_flexor_stretch', 'couch_stretch', '90_90_hip_mobility', 'hip_car', 'worlds_greatest_stretch'],
    phase3: ['hip_car', 'worlds_greatest_stretch', 'hip_opener', 'couch_stretch'],
    all: ['hip_flexor_stretch', 'couch_stretch', '90_90_hip_mobility', 'hip_car', 'worlds_greatest_stretch', 'hip_opener']
  },
  GLUTE_ACTIVATION: {
    phase1: ['glute_bridge', 'clams', 'fire_hydrants', 'donkey_kicks'],
    phase2: ['single_leg_bridge', 'banded_walks', 'clams', 'fire_hydrants', 'prone_hip_extension_bent_knee'],
    phase3: ['hip_thrust', 'bulgarian_split_squat', 'single_leg_bridge', 'banded_walks', 'step_ups'],
    all: ['glute_bridge', 'clams', 'fire_hydrants', 'donkey_kicks', 'single_leg_bridge', 'banded_walks', 'prone_hip_extension_bent_knee', 'hip_thrust', 'bulgarian_split_squat', 'step_ups']
  },
  CORE: {
    phase1: ['dead_bug', 'bird_dog', 'plank_progression'],
    phase2: ['plank_progression', 'dead_bug', 'bird_dog', 'side_plank', 'pallof_press'],
    phase3: ['side_plank', 'pallof_press', 'anti_rotation', 'plank_progression'],
    all: ['plank_progression', 'dead_bug', 'bird_dog', 'pallof_press', 'side_plank', 'anti_rotation']
  },
  POSTERIOR_CHAIN: {
    phase1: ['toe_touch_progression', 'hamstring_stretch', 'cat_cow'],
    phase2: ['toe_touch_progression', 'hamstring_stretch', 'cat_cow', 'thoracic_rotation', 'romanian_deadlift_bodyweight'],
    phase3: ['romanian_deadlift_bodyweight', 'thoracic_rotation', 'single_leg_rdl'],
    all: ['toe_touch_progression', 'hamstring_stretch', 'cat_cow', 'thoracic_rotation', 'romanian_deadlift_bodyweight', 'single_leg_rdl']
  },
  AEROBIC: {
    phase1: ['walking_progression'],
    phase2: ['walking_progression', 'incline_walking'],
    phase3: ['zone2_cardio', 'incline_walking'],
    all: ['walking_progression', 'zone2_cardio', 'incline_walking']
  },
  BALANCE: {
    phase1: ['single_leg_stand', 'balance_progression'],
    phase2: ['single_leg_stand', 'balance_progression', 'stability_exercises'],
    phase3: ['stability_exercises', 'single_leg_rdl', 'step_ups'],
    all: ['single_leg_stand', 'balance_progression', 'stability_exercises', 'single_leg_rdl', 'step_ups']
  }
}

/**
 * Returns the correct exercise pool for a given area and week number.
 *
 * @param {string} area - Exercise area key (e.g., 'ANKLE_ROM')
 * @param {number} weekNumber - Current week in the foundations phase (1-based)
 * @param {number} foundationsDuration - Total weeks in foundations
 * @returns {string[]} Array of exercise IDs for the appropriate phase
 */
function getExercisesForPhase(area, weekNumber, foundationsDuration) {
  const pool = EXERCISES[area]
  if (!pool) return []

  // If pool is a flat array (backward compatibility), return as-is
  if (Array.isArray(pool)) return pool

  const thirdOfProgram = Math.ceil(foundationsDuration / 3)

  if (weekNumber <= thirdOfProgram) {
    return pool.phase1
  } else if (weekNumber <= thirdOfProgram * 2) {
    return pool.phase2
  }
  return pool.phase3
}

/**
 * Medical thresholds for each test
 * Based on running biomechanics research and injury prevention literature
 */
const THRESHOLDS = {
  ANKLE_ROM: {
    HIGH_SEVERITY: 10,    // < 10cm = high injury risk
    MEDIUM_SEVERITY: 12,  // 10-12cm = moderate limitation
    TARGET: 13,           // 13cm+ = optimal for running
    WEEKLY_MINUTES_HIGH: 70,   // 10min daily
    WEEKLY_MINUTES_MEDIUM: 35  // 5min daily
  },
  HIP_EXTENSION: {
    HIGH_SEVERITY: -5,    // < -5° = hip flexor tightness
    TARGET: 5,            // 5°+ = optimal hip extension
    WEEKLY_MINUTES: 70
  },
  GLUTE_ACTIVATION: {
    TARGET_PATTERN: 'glute_first',
    HIGH_SEVERITY_PATTERN: 'hamstrings_first',
    WEEKLY_MINUTES: 105   // 15min daily - critical for running
  },
  CORE: {
    HIGH_SEVERITY: 30,    // < 30s plank = weak core
    MEDIUM_SEVERITY: 60,  // 30-60s = developing
    TARGET: 60,           // 60s+ = adequate
    WEEKLY_MINUTES_HIGH: 60,   // 3x 20min/week
    WEEKLY_MINUTES_MEDIUM: 40
  },
  POSTERIOR_CHAIN: {
    HIGH_SEVERITY: ['thighs', 'knees'],  // Can't reach past knees
    TARGET: 'shins',      // Reach shins or better
    WEEKLY_MINUTES: 40
  },
  AEROBIC: {
    HIGH_SEVERITY: 'under_30min_hard',
    TARGET: '45min_easy',
    WEEKLY_MINUTES: 150   // Build aerobic base before running
  },
  BALANCE: {
    MEDIUM_SEVERITY: 40,  // < 40s = stability issue
    TARGET: 60,           // 60s+ = adequate
    WEEKLY_MINUTES: 30
  }
}

/**
 * Spanish area names for user-facing display
 * Keep medical terminology accessible
 */
const AREA_NAMES = {
  ANKLE_ROM: 'Dorsiflexión del tobillo',
  HIP_EXTENSION: 'Extensión de cadera',
  GLUTE_ACTIVATION: 'Activación del glúteo',
  CORE: 'Estabilidad del core',
  POSTERIOR_CHAIN: 'Flexibilidad de cadena posterior',
  AEROBIC: 'Capacidad aeróbica',
  BALANCE: 'Equilibrio y estabilidad'
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates assessment data structure and completeness
 * @param {Object} data - Assessment data from test flow
 * @returns {Object} Validation result with isValid, errors, warnings
 */
function validateAssessmentData(data) {
  const errors = []
  const warnings = []

  if (!data || typeof data !== 'object') {
    errors.push('Datos de evaluación inválidos')
    return { isValid: false, errors, warnings }
  }

  // Check required fields for each test
  const requiredFields = {
    ankle_rom: ['ankle_rom_right', 'ankle_rom_left'],
    hip_extension: ['hip_extension_right', 'hip_extension_left'],
    glute_activation: ['glute_activation_right', 'glute_activation_left'],
    core: ['core_plank_time'],
    posterior_chain: ['posterior_chain_flexibility'],
    aerobic: ['aerobic_capacity'],
    balance: ['balance_right', 'balance_left']
  }

  let completedTests = 0
  const totalTests = Object.keys(requiredFields).length

  for (const [testName, fields] of Object.entries(requiredFields)) {
    const hasAllFields = fields.every(field =>
      data[field] !== undefined && data[field] !== null && data[field] !== ''
    )

    if (hasAllFields) {
      completedTests++
    } else {
      warnings.push(`Test incompleto: ${testName}`)
    }
  }

  // Require at least 3 tests to generate a meaningful plan
  if (completedTests < 3) {
    errors.push(`Evaluación insuficiente: ${completedTests}/${totalTests} tests completados. Mínimo 3 requeridos.`)
  }

  // Validate numeric ranges
  if (data.ankle_rom_right !== undefined) {
    if (data.ankle_rom_right < 0 || data.ankle_rom_right > 25) {
      warnings.push('Valor de ROM tobillo derecho fuera de rango esperado (0-25cm)')
    }
  }
  if (data.ankle_rom_left !== undefined) {
    if (data.ankle_rom_left < 0 || data.ankle_rom_left > 25) {
      warnings.push('Valor de ROM tobillo izquierdo fuera de rango esperado (0-25cm)')
    }
  }
  if (data.core_plank_time !== undefined) {
    if (data.core_plank_time < 0 || data.core_plank_time > 600) {
      warnings.push('Tiempo de plancha fuera de rango esperado (0-600s)')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    testsCompleted: completedTests,
    testsTotal: totalTests
  }
}

// ============================================================================
// EVALUATORS (One per test)
// ============================================================================

/**
 * Detects bilateral asymmetry and returns metadata if significant.
 *
 * @param {number} right - Right side value
 * @param {number} left - Left side value
 * @param {number} threshold - Minimum difference to flag asymmetry
 * @param {'higher_better'|'lower_better'} direction - Which direction is better
 * @returns {Object|null} Asymmetry info or null
 */
function detectAsymmetry(right, left, threshold, direction = 'higher_better') {
  const diff = Math.abs(right - left)
  if (diff < threshold) return null

  let weakerSide
  if (direction === 'higher_better') {
    weakerSide = right < left ? 'right' : 'left'
  } else {
    weakerSide = right > left ? 'right' : 'left'
  }

  return {
    present: true,
    weakerSide,
    strongerSide: weakerSide === 'right' ? 'left' : 'right',
    difference: diff,
    rightValue: right,
    leftValue: left
  }
}

/**
 * Evaluates ankle dorsiflexion ROM and determines priority.
 * Now evaluates each side independently and flags asymmetry.
 *
 * Medical context: Ankle ROM <10cm is the #1 predictor of running injuries.
 * Insufficient dorsiflexion leads to compensations up the kinetic chain.
 * Asymmetry >2cm between sides indicates unilateral compensation risk.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateAnkleROM(data) {
  if (!data.ankle_rom_right || !data.ankle_rom_left) return null

  const right = data.ankle_rom_right
  const left = data.ankle_rom_left
  const minRom = Math.min(right, left)
  const { HIGH_SEVERITY, MEDIUM_SEVERITY, TARGET, WEEKLY_MINUTES_HIGH, WEEKLY_MINUTES_MEDIUM } = THRESHOLDS.ANKLE_ROM

  // Detect asymmetry (threshold: 2cm)
  const asymmetry = detectAsymmetry(right, left, 2, 'higher_better')

  if (minRom < HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.ANKLE_ROM,
      areaKey: 'ANKLE_ROM',
      severity: 'HIGH',
      current: `D: ${right} cm / I: ${left} cm`,
      target: `${TARGET} cm`,
      weeklyMinutes: WEEKLY_MINUTES_HIGH,
      exercises: EXERCISES.ANKLE_ROM.all,
      asymmetry
    }
  } else if (minRom < MEDIUM_SEVERITY || asymmetry) {
    return {
      area: AREA_NAMES.ANKLE_ROM,
      areaKey: 'ANKLE_ROM',
      severity: asymmetry && minRom >= MEDIUM_SEVERITY ? 'MEDIUM' : 'MEDIUM',
      current: `D: ${right} cm / I: ${left} cm`,
      target: `${TARGET} cm`,
      weeklyMinutes: WEEKLY_MINUTES_MEDIUM,
      exercises: EXERCISES.ANKLE_ROM.all,
      asymmetry
    }
  }

  return null
}

/**
 * Evaluates hip extension ROM and determines priority.
 * Now evaluates each side independently and flags asymmetry.
 *
 * Medical context: Sedentary people develop hip flexor tightness.
 * Lack of hip extension prevents proper running mechanics and overloads lower back.
 * Asymmetry >5° between sides indicates unilateral compensation risk.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateHipExtension(data) {
  if (data.hip_extension_right === undefined || data.hip_extension_left === undefined) return null

  const right = data.hip_extension_right
  const left = data.hip_extension_left
  const minExtension = Math.min(right, left)
  const { HIGH_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.HIP_EXTENSION

  // Detect asymmetry (threshold: 5°)
  const asymmetry = detectAsymmetry(right, left, 5, 'higher_better')

  if (minExtension < HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.HIP_EXTENSION,
      areaKey: 'HIP_EXTENSION',
      severity: 'HIGH',
      current: `D: ${right}° / I: ${left}°`,
      target: `${TARGET}°`,
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.HIP_EXTENSION.all,
      asymmetry
    }
  } else if (asymmetry) {
    return {
      area: AREA_NAMES.HIP_EXTENSION,
      areaKey: 'HIP_EXTENSION',
      severity: 'MEDIUM',
      current: `D: ${right}° / I: ${left}°`,
      target: `${TARGET}°`,
      weeklyMinutes: Math.round(WEEKLY_MINUTES * 0.5),
      exercises: EXERCISES.HIP_EXTENSION.all,
      asymmetry
    }
  }

  return null
}

/**
 * Evaluates glute activation pattern and determines priority
 *
 * Medical context: Sedentary lifestyle causes "glute amnesia" - hamstrings dominate.
 * This is the #2 cause of running injuries. Must fix before running.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateGluteActivation(data) {
  if (!data.glute_activation_right || !data.glute_activation_left) return null

  const { HIGH_SEVERITY_PATTERN, TARGET_PATTERN, WEEKLY_MINUTES } = THRESHOLDS.GLUTE_ACTIVATION

  const hasIssue = data.glute_activation_right === HIGH_SEVERITY_PATTERN ||
                   data.glute_activation_left === HIGH_SEVERITY_PATTERN

  if (hasIssue) {
    return {
      area: AREA_NAMES.GLUTE_ACTIVATION,
      areaKey: 'GLUTE_ACTIVATION',
      severity: 'HIGH',
      current: 'Isquiotibiales primero',
      target: 'Glúteo primero',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.GLUTE_ACTIVATION.all
    }
  }

  return null
}

/**
 * Evaluates core stability and determines priority
 *
 * Medical context: Core stability is essential for force transfer during running.
 * Weak core leads to excessive spinal rotation and energy leaks.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateCoreStability(data) {
  if (data.core_plank_time === undefined || data.core_plank_time === null) return null

  const plankTime = data.core_plank_time
  const { HIGH_SEVERITY, MEDIUM_SEVERITY, TARGET, WEEKLY_MINUTES_HIGH, WEEKLY_MINUTES_MEDIUM } = THRESHOLDS.CORE

  if (plankTime < HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.CORE,
      areaKey: 'CORE',
      severity: 'HIGH',
      current: `${plankTime} segundos`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES_HIGH,
      exercises: EXERCISES.CORE.all
    }
  } else if (plankTime < MEDIUM_SEVERITY) {
    return {
      area: AREA_NAMES.CORE,
      areaKey: 'CORE',
      severity: 'MEDIUM',
      current: `${plankTime} segundos`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES_MEDIUM,
      exercises: EXERCISES.CORE.all
    }
  }

  return null
}

/**
 * Evaluates posterior chain flexibility and determines priority
 *
 * Medical context: Tight hamstrings alter pelvic tilt and running mechanics.
 * Less critical than other tests but still important.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluatePosteriorChain(data) {
  if (!data.posterior_chain_flexibility) return null

  const flexibility = data.posterior_chain_flexibility
  const { HIGH_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.POSTERIOR_CHAIN

  if (HIGH_SEVERITY.includes(flexibility)) {
    return {
      area: AREA_NAMES.POSTERIOR_CHAIN,
      areaKey: 'POSTERIOR_CHAIN',
      severity: 'MEDIUM',  // Never HIGH - not as critical as ankle/glute/hip
      current: flexibility === 'thighs' ? 'Muslos' : 'Rodillas',
      target: 'Espinillas o mejor',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.POSTERIOR_CHAIN.all
    }
  }

  return null
}

/**
 * Evaluates aerobic capacity and determines priority
 *
 * Medical context: Sedentary people lack aerobic base. Starting running without
 * aerobic capacity leads to excessive fatigue and breakdown in form.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateAerobicCapacity(data) {
  if (!data.aerobic_capacity) return null

  const capacity = data.aerobic_capacity
  const { HIGH_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.AEROBIC

  if (capacity === HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.AEROBIC,
      areaKey: 'AEROBIC',
      severity: 'HIGH',
      current: 'Menos de 30min caminando (fatiga alta)',
      target: '45min caminando fácil',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.AEROBIC.all,
      aerobicLevel: 'beginner'
    }
  }

  if (capacity === '30-45min_mild') {
    return {
      area: AREA_NAMES.AEROBIC,
      areaKey: 'AEROBIC',
      severity: 'MEDIUM',
      current: '30-45min caminando (fatiga leve)',
      target: '45min caminando fácil',
      weeklyMinutes: Math.round(WEEKLY_MINUTES * 0.6),
      exercises: EXERCISES.AEROBIC.all,
      aerobicLevel: 'standard'
    }
  }

  // 45min_easy → no priority needed but aerobicLevel is tracked in the plan
  return null
}

/**
 * Evaluates balance/stability and determines priority.
 * Now evaluates each side independently and flags asymmetry.
 *
 * Medical context: Single-leg balance is critical for running (single-leg activity).
 * Poor balance indicates neuromuscular control issues.
 * Asymmetry >15s between sides = significant unilateral deficit.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateBalance(data) {
  if (data.balance_right === undefined || data.balance_left === undefined) return null

  const right = data.balance_right
  const left = data.balance_left
  const minBalance = Math.min(right, left)
  const { MEDIUM_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.BALANCE

  // Detect asymmetry (threshold: 15s)
  const asymmetry = detectAsymmetry(right, left, 15, 'higher_better')

  if (minBalance < MEDIUM_SEVERITY || asymmetry) {
    return {
      area: AREA_NAMES.BALANCE,
      areaKey: 'BALANCE',
      severity: 'MEDIUM',  // Never HIGH - improves naturally with other training
      current: `D: ${right}s / I: ${left}s`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.BALANCE.all,
      asymmetry
    }
  }

  return null
}

// ============================================================================
// DURATION CALCULATOR
// ============================================================================

/**
 * Calculates a continuous severity score (0-20) from priorities.
 *
 * Scoring:
 * - HIGH priority: 3 points
 * - MEDIUM priority: 1 point
 * - Asymmetry present: +0.5 per area
 * - Very low values add bonus:
 *   ankle < 7cm: +1, plank < 15s: +1, hip < -10°: +1
 *
 * @param {Array} priorities - Array of priority objects
 * @param {Object} rawData - Original assessment data for bonus scoring
 * @returns {number} Score from 0-20
 */
function calculateSeverityScore(priorities, rawData = {}) {
  let score = 0

  for (const p of priorities) {
    score += p.severity === 'HIGH' ? 3 : 1
    if (p.asymmetry?.present) score += 0.5
  }

  // Bonus for extreme cases
  if (rawData.ankle_rom_right && rawData.ankle_rom_left) {
    if (Math.min(rawData.ankle_rom_right, rawData.ankle_rom_left) < 7) score += 1
  }
  if (rawData.core_plank_time !== undefined && rawData.core_plank_time < 15) score += 1
  if (rawData.hip_extension_right !== undefined && rawData.hip_extension_left !== undefined) {
    if (Math.min(rawData.hip_extension_right, rawData.hip_extension_left) < -10) score += 1
  }

  return Math.min(score, 20)
}

/**
 * Calculates program duration from continuous severity score.
 *
 * Produces 6-10 weeks with smooth gradient instead of 3-bucket system.
 * Also identifies deload weeks (week 4 and week 8).
 *
 * Score mapping:
 * - 0-3: 6 weeks (mild)
 * - 4-6: 7 weeks
 * - 7-9: 8 weeks
 * - 10-12: 9 weeks
 * - 13+: 10 weeks (severe)
 *
 * @param {Array} priorities - Array of priority objects
 * @param {Object} rawData - Original assessment data
 * @returns {Object} Duration breakdown with deload weeks
 */
function calculateProgramDuration(priorities, rawData = {}) {
  const score = calculateSeverityScore(priorities, rawData)

  let foundationsDuration
  if (score >= 13) {
    foundationsDuration = 10
  } else if (score >= 10) {
    foundationsDuration = 9
  } else if (score >= 7) {
    foundationsDuration = 8
  } else if (score >= 4) {
    foundationsDuration = 7
  } else {
    foundationsDuration = 6
  }

  // Deload weeks: week 4 always, week 8 if program >= 9 weeks
  const deloadWeeks = [4]
  if (foundationsDuration >= 9) {
    deloadWeeks.push(8)
  }

  return {
    foundationsDuration,
    transitionDuration: 4,
    estimatedWeeks: foundationsDuration,
    totalWeeks: foundationsDuration + 4,
    severityScore: score,
    deloadWeeks
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generates a personalized training plan based on assessment data
 *
 * This is the main entry point for the personalization algorithm.
 * Orchestrates validation, evaluation, sorting, and duration calculation.
 *
 * @param {Object} assessmentData - Complete assessment data from all 7 tests
 * @returns {Object} Result object with success, plan, warnings, metadata
 *
 * @example
 * const result = generatePersonalizedPlan({
 *   ankle_rom_right: 8,
 *   ankle_rom_left: 9,
 *   hip_extension_right: -10,
 *   hip_extension_left: -8,
 *   glute_activation_right: 'hamstrings_first',
 *   glute_activation_left: 'simultaneous',
 *   core_plank_time: 25,
 *   posterior_chain_flexibility: 'knees',
 *   aerobic_capacity: 'under_30min_hard',
 *   balance_right: 35,
 *   balance_left: 30
 * })
 *
 * if (result.success) {
 *   console.log('Plan duration:', result.plan.totalWeeks, 'weeks')
 *   console.log('Priorities:', result.plan.priorities.length)
 * }
 */
export { EXERCISES, getExercisesForPhase }

export function generatePersonalizedPlan(assessmentData) {
  // Step 1: Validate input
  const validation = validateAssessmentData(assessmentData)

  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
      warnings: validation.warnings,
      plan: null,
      metadata: {
        testsCompleted: validation.testsCompleted,
        testsTotal: validation.testsTotal,
        assessmentQuality: 'incomplete'
      }
    }
  }

  // Step 2: Run all evaluators to identify priorities
  const priorities = [
    evaluateAnkleROM(assessmentData),
    evaluateHipExtension(assessmentData),
    evaluateGluteActivation(assessmentData),
    evaluateCoreStability(assessmentData),
    evaluatePosteriorChain(assessmentData),
    evaluateAerobicCapacity(assessmentData),
    evaluateBalance(assessmentData)
  ].filter(p => p !== null)  // Remove null entries (no priority)

  // Step 3: Sort priorities by severity, then by time commitment
  // Order: HIGH priorities first, then MEDIUM, then by weeklyMinutes descending
  priorities.sort((a, b) => {
    // Primary sort: severity
    const severityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
    if (severityDiff !== 0) return severityDiff

    // Secondary sort: weekly time commitment (more time = higher priority)
    return b.weeklyMinutes - a.weeklyMinutes
  })

  // Step 4: Calculate program duration from continuous severity score
  const duration = calculateProgramDuration(priorities, assessmentData)

  // Step 5: Handle edge case - perfect scores (no priorities)
  if (priorities.length === 0) {
    return {
      success: true,
      plan: {
        priorities: [],
        foundationsDuration: duration.foundationsDuration,
        transitionDuration: duration.transitionDuration,
        estimatedWeeks: duration.estimatedWeeks,
        totalWeeks: duration.totalWeeks,
        deloadWeeks: [],
        message: '¡Excelente! No tienes limitaciones significativas. Puedes comenzar con un plan de mantenimiento general.'
      },
      warnings: validation.warnings,
      metadata: {
        testsCompleted: validation.testsCompleted,
        testsTotal: validation.testsTotal,
        highPriorities: 0,
        mediumPriorities: 0,
        severityScore: 0,
        assessmentQuality: validation.testsCompleted === validation.testsTotal ? 'complete' : 'partial'
      }
    }
  }

  // Step 6: Detect aerobic level for differentiated running progression
  const aerobicPriority = priorities.find(p => p.areaKey === 'AEROBIC')
  const aerobicLevel = aerobicPriority?.aerobicLevel || (
    assessmentData.aerobic_capacity === '45min_easy' ? 'advanced' :
    assessmentData.aerobic_capacity === '30-45min_mild' ? 'standard' : 'standard'
  )

  // Step 7: Return complete plan
  const highPriorities = priorities.filter(p => p.severity === 'HIGH').length
  const mediumPriorities = priorities.filter(p => p.severity === 'MEDIUM').length
  const hasAsymmetry = priorities.some(p => p.asymmetry?.present)

  return {
    success: true,
    plan: {
      priorities,
      foundationsDuration: duration.foundationsDuration,
      transitionDuration: duration.transitionDuration,
      estimatedWeeks: duration.estimatedWeeks,
      totalWeeks: duration.totalWeeks,
      deloadWeeks: duration.deloadWeeks,
      aerobicLevel
    },
    warnings: validation.warnings,
    metadata: {
      testsCompleted: validation.testsCompleted,
      testsTotal: validation.testsTotal,
      highPriorities,
      mediumPriorities,
      severityScore: duration.severityScore,
      hasAsymmetry,
      assessmentQuality: validation.testsCompleted === validation.testsTotal ? 'complete' : 'partial'
    }
  }
}

/**
 * Helper function to format plan for display
 * Useful for debugging and results page
 *
 * @param {Object} plan - Plan object from generatePersonalizedPlan
 * @returns {string} Formatted text summary
 */
export function formatPlanSummary(plan) {
  if (!plan || !plan.priorities) return 'Plan no disponible'

  const lines = [
    `PLAN PERSONALIZADO - ${plan.totalWeeks} SEMANAS TOTAL`,
    `Fase 1 (Fundamentos): ${plan.foundationsDuration} semanas`,
    `Fase 2 (Transición): ${plan.transitionDuration} semanas`,
    '',
    `PRIORIDADES (${plan.priorities.length}):`,
    ''
  ]

  plan.priorities.forEach((p, index) => {
    lines.push(`${index + 1}. [${p.severity}] ${p.area}`)
    lines.push(`   Actual: ${p.current} → Objetivo: ${p.target}`)
    lines.push(`   Tiempo semanal: ${p.weeklyMinutes} minutos`)
    lines.push(`   Ejercicios: ${p.exercises.join(', ')}`)
    lines.push('')
  })

  return lines.join('\n')
}
