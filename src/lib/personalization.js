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
const EXERCISES = {
  ANKLE_ROM: [
    'ankle_wall_mobility',
    'ankle_circles',
    'toe_walking',
    'calf_raises',
    'dorsiflexion_active',
    'hip_flexor_stretch'
  ],
  HIP_EXTENSION: [
    'hip_flexor_stretch',
    'couch_stretch',
    '90_90_hip_mobility',
    'hip_car',
    'worlds_greatest_stretch',
    'hip_opener'
  ],
  GLUTE_ACTIVATION: [
    'glute_bridge',
    'clams',
    'fire_hydrants',
    'banded_walks',
    'single_leg_bridge',
    'glute_kickback',
    'hip_thrust',
    'bulgarian_split_squat'
  ],
  CORE: [
    'plank_progression',
    'dead_bug',
    'bird_dog',
    'pallof_press',
    'side_plank',
    'anti_rotation'
  ],
  POSTERIOR_CHAIN: [
    'toe_touch_progression',
    'hamstring_stretch',
    'good_morning',
    'single_leg_rdl',
    'thoracic_rotation',
    'cat_cow'
  ],
  AEROBIC: [
    'walking_progression',
    'zone2_cardio',
    'incline_walking'
  ],
  BALANCE: [
    'single_leg_stand',
    'balance_progression',
    'stability_exercises',
    'single_leg_rdl',
    'step_ups'
  ]
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
 * Evaluates ankle dorsiflexion ROM and determines priority
 *
 * Medical context: Ankle ROM <10cm is the #1 predictor of running injuries.
 * Insufficient dorsiflexion leads to compensations up the kinetic chain.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateAnkleROM(data) {
  if (!data.ankle_rom_right || !data.ankle_rom_left) return null

  const minRom = Math.min(data.ankle_rom_right, data.ankle_rom_left)
  const { HIGH_SEVERITY, MEDIUM_SEVERITY, TARGET, WEEKLY_MINUTES_HIGH, WEEKLY_MINUTES_MEDIUM } = THRESHOLDS.ANKLE_ROM

  if (minRom < HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.ANKLE_ROM,
      severity: 'HIGH',
      current: `${minRom} cm`,
      target: `${TARGET} cm`,
      weeklyMinutes: WEEKLY_MINUTES_HIGH,
      exercises: EXERCISES.ANKLE_ROM
    }
  } else if (minRom < MEDIUM_SEVERITY) {
    return {
      area: AREA_NAMES.ANKLE_ROM,
      severity: 'MEDIUM',
      current: `${minRom} cm`,
      target: `${TARGET} cm`,
      weeklyMinutes: WEEKLY_MINUTES_MEDIUM,
      exercises: EXERCISES.ANKLE_ROM
    }
  }

  return null // ROM is adequate
}

/**
 * Evaluates hip extension ROM and determines priority
 *
 * Medical context: Sedentary people develop hip flexor tightness.
 * Lack of hip extension prevents proper running mechanics and overloads lower back.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateHipExtension(data) {
  if (data.hip_extension_right === undefined || data.hip_extension_left === undefined) return null

  const minExtension = Math.min(data.hip_extension_right, data.hip_extension_left)
  const { HIGH_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.HIP_EXTENSION

  if (minExtension < HIGH_SEVERITY) {
    return {
      area: AREA_NAMES.HIP_EXTENSION,
      severity: 'HIGH',
      current: `${minExtension}°`,
      target: `${TARGET}°`,
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.HIP_EXTENSION
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
      severity: 'HIGH',
      current: 'Isquiotibiales primero',
      target: 'Glúteo primero',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.GLUTE_ACTIVATION
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
      severity: 'HIGH',
      current: `${plankTime} segundos`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES_HIGH,
      exercises: EXERCISES.CORE
    }
  } else if (plankTime < MEDIUM_SEVERITY) {
    return {
      area: AREA_NAMES.CORE,
      severity: 'MEDIUM',
      current: `${plankTime} segundos`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES_MEDIUM,
      exercises: EXERCISES.CORE
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
      severity: 'MEDIUM',  // Never HIGH - not as critical as ankle/glute/hip
      current: flexibility === 'thighs' ? 'Muslos' : 'Rodillas',
      target: 'Espinillas o mejor',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.POSTERIOR_CHAIN
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
      severity: 'HIGH',
      current: 'Menos de 30min caminando (fatiga alta)',
      target: '45min caminando fácil',
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.AEROBIC
    }
  }

  return null
}

/**
 * Evaluates balance/stability and determines priority
 *
 * Medical context: Single-leg balance is critical for running (single-leg activity).
 * Poor balance indicates neuromuscular control issues.
 *
 * @param {Object} data - Assessment data
 * @returns {Object|null} Priority object or null if not a priority
 */
function evaluateBalance(data) {
  if (data.balance_right === undefined || data.balance_left === undefined) return null

  const minBalance = Math.min(data.balance_right, data.balance_left)
  const { MEDIUM_SEVERITY, TARGET, WEEKLY_MINUTES } = THRESHOLDS.BALANCE

  if (minBalance < MEDIUM_SEVERITY) {
    return {
      area: AREA_NAMES.BALANCE,
      severity: 'MEDIUM',  // Never HIGH - improves naturally with other training
      current: `${minBalance} segundos`,
      target: `${TARGET} segundos`,
      weeklyMinutes: WEEKLY_MINUTES,
      exercises: EXERCISES.BALANCE
    }
  }

  return null
}

// ============================================================================
// DURATION CALCULATOR
// ============================================================================

/**
 * Calculates program duration based on number of HIGH priorities
 *
 * Logic:
 * - 3+ HIGH priorities = 10 weeks foundations (severe case)
 * - 2 HIGH priorities = 8 weeks foundations (moderate case)
 * - 0-1 HIGH priorities = 6 weeks foundations (mild case)
 * - Total = foundations + 4 weeks transition (assessment is a prior step, not a phase)
 *
 * @param {Array} priorities - Array of priority objects
 * @returns {Object} Duration breakdown
 */
function calculateProgramDuration(priorities) {
  const highPriorityCount = priorities.filter(p => p.severity === 'HIGH').length

  let foundationsDuration
  if (highPriorityCount >= 3) {
    foundationsDuration = 10
  } else if (highPriorityCount === 2) {
    foundationsDuration = 8
  } else {
    foundationsDuration = 6
  }

  return {
    foundationsDuration,      // Fase 1: Fundamentos (variable)
    transitionDuration: 4,    // Fase 2: Transición a correr (fixed)
    estimatedWeeks: foundationsDuration,
    totalWeeks: foundationsDuration + 4
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

  // Step 4: Calculate program duration based on HIGH priorities
  const duration = calculateProgramDuration(priorities)

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
        message: '¡Excelente! No tienes limitaciones significativas. Puedes comenzar con un plan de mantenimiento general.'
      },
      warnings: validation.warnings,
      metadata: {
        testsCompleted: validation.testsCompleted,
        testsTotal: validation.testsTotal,
        highPriorities: 0,
        mediumPriorities: 0,
        assessmentQuality: validation.testsCompleted === validation.testsTotal ? 'complete' : 'partial'
      }
    }
  }

  // Step 6: Return complete plan
  const highPriorities = priorities.filter(p => p.severity === 'HIGH').length
  const mediumPriorities = priorities.filter(p => p.severity === 'MEDIUM').length

  return {
    success: true,
    plan: {
      priorities,
      foundationsDuration: duration.foundationsDuration,
      transitionDuration: duration.transitionDuration,
      estimatedWeeks: duration.estimatedWeeks,
      totalWeeks: duration.totalWeeks
    },
    warnings: validation.warnings,
    metadata: {
      testsCompleted: validation.testsCompleted,
      testsTotal: validation.testsTotal,
      highPriorities,
      mediumPriorities,
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
