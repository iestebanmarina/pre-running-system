/**
 * Weekly Plan Generator
 *
 * Converts the high-level personalized plan (from personalization.js) into a
 * week-by-week executable plan with specific sessions, exercises, sets/reps,
 * and progression.
 *
 * Input: plan object from generatePersonalizedPlan() + exercisesData lookup
 * Output: { weeks: [{ weekNumber, phase, sessions: [...] }] }
 */

import { getExercisesForPhase } from './personalization'

// Local alias to avoid issues with hoisting in classifyPriorityExercises
const getExercisesForPhaseLocal = getExercisesForPhase

// ============================================================================
// CONSTANTS
// ============================================================================

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

/**
 * Fallback exercise parameters when exercise is not found in exercisesData.
 * Keyed by category.
 */
const DEFAULT_EXERCISE_PARAMS = {
  mobility: { sets: 2, reps: null, holdSeconds: 30, durationMinutes: 5 },
  activation: { sets: 3, reps: 15, holdSeconds: null, durationMinutes: 6 },
  strength: { sets: 3, reps: 12, holdSeconds: null, durationMinutes: 8 },
  capacity: { sets: 1, reps: null, holdSeconds: null, durationMinutes: 30 }
}

/**
 * Foundations phase (Phase 2) weekly template.
 * Maps each day to a session type.
 */
const FOUNDATIONS_TEMPLATE = {
  monday: 'mobility_activation',
  tuesday: 'strength',
  wednesday: 'mobility_activation',
  thursday: 'rest',
  friday: 'strength',
  saturday: 'capacity',
  sunday: 'rest'
}

/**
 * Transition phase (Phase 3) weekly template.
 * Maps each day to a session type.
 */
const TRANSITION_TEMPLATE = {
  monday: 'maintenance',
  tuesday: 'running',
  wednesday: 'rest',
  thursday: 'running',
  friday: 'maintenance',
  saturday: 'running',
  sunday: 'rest'
}

/**
 * Running interval progressions differentiated by aerobic capacity.
 *
 * - beginner: under_30min_hard → very gradual, starts with 30s run intervals
 * - standard: 30-45min_mild → current progression (1min → 5min)
 * - advanced: 45min_easy → accelerated, starts with 5min running
 */
const RUNNING_PROGRESSIONS = {
  beginner: [
    {
      runMinutes: 0.5,
      walkMinutes: 4.5,
      intervals: 4,
      totalMinutes: 20,
      description: '4x (30seg trote suave + 4.5min caminando) = 20min'
    },
    {
      runMinutes: 1,
      walkMinutes: 4,
      intervals: 5,
      totalMinutes: 25,
      description: '5x (1min trote + 4min caminando) = 25min'
    },
    {
      runMinutes: 1.5,
      walkMinutes: 3.5,
      intervals: 6,
      totalMinutes: 30,
      description: '6x (1.5min trote + 3.5min caminando) = 30min'
    },
    {
      runMinutes: 2,
      walkMinutes: 3,
      intervals: 6,
      totalMinutes: 30,
      description: '6x (2min trote + 3min caminando) = 30min'
    }
  ],
  standard: [
    {
      runMinutes: 1,
      walkMinutes: 4,
      intervals: 6,
      totalMinutes: 30,
      description: '6x (1min trote + 4min caminando) = 30min'
    },
    {
      runMinutes: 2,
      walkMinutes: 3,
      intervals: 6,
      totalMinutes: 30,
      description: '6x (2min trote + 3min caminando) = 30min'
    },
    {
      runMinutes: 3,
      walkMinutes: 2,
      intervals: 6,
      totalMinutes: 30,
      description: '6x (3min trote + 2min caminando) = 30min'
    },
    {
      runMinutes: 5,
      walkMinutes: 1,
      intervals: 5,
      totalMinutes: 30,
      description: '5x (5min trote + 1min caminando) = 30min'
    }
  ],
  advanced: [
    {
      runMinutes: 5,
      walkMinutes: 2,
      intervals: 4,
      totalMinutes: 28,
      description: '4x (5min trote + 2min caminando) = 28min'
    },
    {
      runMinutes: 8,
      walkMinutes: 2,
      intervals: 3,
      totalMinutes: 30,
      description: '3x (8min trote + 2min caminando) = 30min'
    },
    {
      runMinutes: 10,
      walkMinutes: 2,
      intervals: 3,
      totalMinutes: 36,
      description: '3x (10min trote + 2min caminando) = 36min'
    },
    {
      runMinutes: 15,
      walkMinutes: 1,
      intervals: 2,
      totalMinutes: 32,
      description: '2x (15min trote + 1min caminando) = 32min'
    }
  ]
}

// Backward compatibility alias
const RUNNING_PROGRESSION = RUNNING_PROGRESSIONS.standard

const MAX_SESSION_MINUTES = 60

/**
 * Regex patterns to infer exercise category from its ID when not in exercisesData.
 * Checked in order — first match wins.
 */
const CATEGORY_INFERENCE_RULES = [
  { pattern: /stretch|mobility|rom|dorsiflexion|90_90|cat_cow|flexor|opener|car$/, category: 'mobility' },
  { pattern: /bridge|clam|fire_hydrant|dead_bug|bird_dog|activation|balance|stability|single_leg_stand|donkey_kick|prone_hip|banded_walk/, category: 'activation' },
  { pattern: /squat|plank|lunge|step_up|thrust|rdl|deadlift|anti_rotation|pallof|side_plank|tibialis/, category: 'strength' },
  { pattern: /walk|cardio|zone2|aerobic|capacity/, category: 'capacity' }
]

/**
 * Session phase order for correct exercise sequencing within a session.
 *
 * Science-based ordering:
 * 1. Tissue prep / warmup (foam roll, dynamic warmup)
 * 2. Activation (isolated, CNS fresh — glute bridges, clams)
 * 3. Mobility (ROM work, stretching — while nervous system is primed)
 * 4. Strength / integration (compound or loaded movements)
 * 5. Cooldown (gentle stretching)
 */
const SESSION_PHASE_ORDER = {
  warmup: 0,
  activation: 1,
  mobility: 2,
  strength: 3,
  capacity: 4,
  cooldown: 5
}

/**
 * Maps exercise categories to session phase for ordering purposes.
 */
function getSessionPhase(category) {
  switch (category) {
    case 'activation': return 'activation'
    case 'mobility': return 'mobility'
    case 'strength': return 'strength'
    case 'capacity': return 'capacity'
    default: return 'mobility'
  }
}

/**
 * General maintenance exercises used when the plan has no priorities.
 * These are IDs from the seeded exercises.
 */
const GENERAL_MAINTENANCE_EXERCISES = {
  mobility_activation: ['cat_cow', 'hip_flexor_stretch', 'ankle_wall_mobility', 'glute_bridge', 'dead_bug'],
  strength: ['bodyweight_squat', 'plank_progression', 'glute_bridge'],
  capacity: ['walking_progression']
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Infers the category of an exercise from its ID.
 * Looks up in exercisesData first; falls back to regex matching on the ID.
 *
 * @param {string} exerciseId
 * @param {Object} exercisesData - { exerciseId: { category, ... } }
 * @returns {string} category: 'mobility' | 'activation' | 'strength' | 'capacity'
 */
function inferExerciseCategory(exerciseId, exercisesData) {
  if (exercisesData[exerciseId]?.category) {
    return exercisesData[exerciseId].category
  }

  for (const rule of CATEGORY_INFERENCE_RULES) {
    if (rule.pattern.test(exerciseId)) {
      return rule.category
    }
  }

  return 'mobility' // safe fallback
}

/**
 * Periodization phases for proper progression.
 *
 * Neural (weeks 1-3): Low reps, focus on form and CNS adaptation. RIR 3-4.
 * Hypertrophy (weeks 4-7): Higher reps, moderate intensity. RIR 1-2.
 * Power/endurance (weeks 8-10): High reps or tempo work.
 *
 * Progression increments are capped at ~10-15% per phase transition
 * (not the previous 20% which was too aggressive).
 */
const PERIODIZATION = {
  neural: {
    setsMultiplier: 1.0,
    repsRange: { min: 8, max: 10 },
    holdMultiplier: 0.8,
    rirNote: 'RIR 3-4 (deja 3-4 repeticiones en reserva)'
  },
  hypertrophy: {
    setsMultiplier: 1.0,
    repsRange: { min: 12, max: 15 },
    holdMultiplier: 1.0,
    rirNote: 'RIR 1-2 (cerca del fallo, con buena forma)'
  },
  power: {
    setsMultiplier: 0.85, // slightly fewer sets, higher reps
    repsRange: { min: 15, max: 20 },
    holdMultiplier: 1.15,
    rirNote: 'Velocidad controlada, máximo rango de movimiento'
  }
}

/**
 * Determines the periodization phase from the progression factor.
 *
 * @param {number} progressionFactor - 0.0 (start) to 1.0 (end of phase)
 * @returns {'neural'|'hypertrophy'|'power'}
 */
function getPeriodizationPhase(progressionFactor) {
  if (progressionFactor < 0.3) return 'neural'
  if (progressionFactor < 0.7) return 'hypertrophy'
  return 'power'
}

/**
 * Resolves sets/reps/hold for an exercise, applying periodized progression.
 *
 * @param {string} exerciseId
 * @param {Object} exercisesData
 * @param {string} category - pre-resolved category
 * @param {number} progressionFactor - 0.0 (start) to 1.0 (end of phase)
 * @returns {{ sets: number, reps: number|null, holdSeconds: number|null, durationMinutes: number }}
 */
function resolveExerciseParams(exerciseId, exercisesData, category, progressionFactor) {
  const dbExercise = exercisesData[exerciseId]
  const defaults = DEFAULT_EXERCISE_PARAMS[category] || DEFAULT_EXERCISE_PARAMS.mobility

  const baseSets = dbExercise?.sets ?? defaults.sets
  const baseReps = dbExercise?.reps ?? defaults.reps
  const baseHold = dbExercise?.hold_seconds ?? (dbExercise?.holdSeconds ?? defaults.holdSeconds)
  const baseDuration = dbExercise?.duration_minutes ?? (dbExercise?.durationMinutes ?? defaults.durationMinutes)

  const phase = getPeriodizationPhase(progressionFactor)
  const periodConfig = PERIODIZATION[phase]

  // Apply periodization
  const sets = Math.max(1, Math.round(baseSets * periodConfig.setsMultiplier))

  let reps = null
  if (baseReps != null) {
    // Adjust reps within the phase's range, proportional to the base value
    const rangeCenter = (periodConfig.repsRange.min + periodConfig.repsRange.max) / 2
    const ratio = baseReps / 12 // normalize around default 12 reps
    reps = Math.round(rangeCenter * ratio)
    reps = Math.max(periodConfig.repsRange.min, Math.min(reps, periodConfig.repsRange.max))
  }

  let holdSeconds = null
  if (baseHold != null) {
    holdSeconds = Math.round(baseHold * periodConfig.holdMultiplier)
    holdSeconds = Math.max(10, Math.min(holdSeconds, 60))
  }

  return {
    sets,
    reps,
    holdSeconds,
    durationMinutes: baseDuration
  }
}

/**
 * Selects a rotating subset of exercises for a given day.
 * Ensures variety across days of the same week and across weeks.
 *
 * @param {string[]} exerciseIds - full pool of exercise IDs
 * @param {number} dayIndex - 0-6 within the week
 * @param {number} weekIndex - 0-based index within the phase
 * @param {number} maxCount - maximum exercises to pick
 * @returns {string[]} selected exercise IDs
 */
function selectExercisesForDay(exerciseIds, dayIndex, weekIndex, maxCount) {
  if (!exerciseIds || exerciseIds.length === 0) return []

  const count = Math.min(maxCount, exerciseIds.length)
  const offset = (weekIndex * 2 + dayIndex) % exerciseIds.length
  const selected = []

  for (let i = 0; i < count; i++) {
    selected.push(exerciseIds[(offset + i) % exerciseIds.length])
  }

  return selected
}

/**
 * Classifies priority exercises into session type buckets.
 * Uses phase-specific exercise pools when available (areaKey + weekNumber).
 *
 * @param {Array} priorities - plan priorities
 * @param {Object} exercisesData
 * @param {number} weekNumber - current week number (1-based) for phase selection
 * @param {number} foundationsDuration - total foundations weeks for phase calculation
 * @returns {{ mobilityActivation: Array, strength: Array, capacity: Array }}
 *   Each entry: { exerciseId, severity, weeklyMinutes, priorityArea }
 */
function classifyPriorityExercises(priorities, exercisesData, weekNumber = 1, foundationsDuration = 6) {
  const classified = {
    mobilityActivation: [],
    strength: [],
    capacity: []
  }

  for (const priority of priorities) {
    // Use phase-specific exercises if areaKey is available
    let exerciseIds = priority.exercises
    if (priority.areaKey && typeof getExercisesForPhaseLocal === 'function') {
      const phaseExercises = getExercisesForPhaseLocal(priority.areaKey, weekNumber, foundationsDuration)
      if (phaseExercises && phaseExercises.length > 0) {
        exerciseIds = phaseExercises
      }
    }

    for (const exerciseId of exerciseIds) {
      const category = inferExerciseCategory(exerciseId, exercisesData)

      const entry = {
        exerciseId,
        severity: priority.severity,
        weeklyMinutes: priority.weeklyMinutes,
        priorityArea: priority.area
      }

      if (category === 'mobility' || category === 'activation') {
        classified.mobilityActivation.push(entry)
      } else if (category === 'strength') {
        classified.strength.push(entry)
      } else if (category === 'capacity') {
        classified.capacity.push(entry)
      } else {
        classified.mobilityActivation.push(entry)
      }
    }
  }

  return classified
}

/**
 * Estimates duration of a list of exercise objects in minutes.
 */
function estimateSessionDuration(exercises) {
  return exercises.reduce((sum, ex) => sum + (ex.durationMinutes || 5), 0)
}

// ============================================================================
// PHASE GENERATORS
// ============================================================================

/**
 * Calculates how many minutes each session type should have per session,
 * based on the total weeklyMinutes from priorities.
 *
 * Template: Mon=mob/act, Tue=strength, Wed=mob/act, Thu=rest, Fri=strength, Sat=capacity
 * So: 2 mob/act sessions, 2 strength sessions, 1 capacity session per week.
 *
 * @param {Array} priorities
 * @returns {{ mobilityActivation: number, strength: number, capacity: number }}
 */
function calculateTargetMinutesPerSession(priorities) {
  let mobActTotal = 0
  let strengthTotal = 0
  let capacityTotal = 0

  for (const p of priorities) {
    // Classify the priority's weeklyMinutes by the dominant exercise type
    const area = p.areaKey || p.area
    if (['AEROBIC'].includes(area) || area === 'Capacidad aeróbica') {
      capacityTotal += p.weeklyMinutes
    } else if (['CORE'].includes(area) || area === 'Estabilidad del core') {
      // Core is split between strength and activation
      strengthTotal += p.weeklyMinutes * 0.6
      mobActTotal += p.weeklyMinutes * 0.4
    } else {
      // Ankle, hip, glute, posterior chain, balance → mostly mob/act
      mobActTotal += p.weeklyMinutes * 0.7
      strengthTotal += p.weeklyMinutes * 0.3
    }
  }

  // Minimum session durations
  const MIN_SESSION = 15

  return {
    // 2 mob/act sessions per week
    mobilityActivation: Math.max(MIN_SESSION, Math.round(mobActTotal / 2)),
    // 2 strength sessions per week
    strength: Math.max(MIN_SESSION, Math.round(strengthTotal / 2)),
    // 1 capacity session per week
    capacity: Math.max(30, Math.round(capacityTotal))
  }
}

/**
 * Builds an exercise list to fill a target duration in minutes.
 * Cycles through available exercises, repeating the pool if needed
 * to reach the target duration.
 *
 * @param {string[]} exerciseIds - Pool of exercises to select from
 * @param {Object} exercisesData
 * @param {number} progressionFactor
 * @param {number} targetMinutes - Target session duration in minutes
 * @param {number} dayIndex - For rotation variety
 * @param {number} weekIndex - For rotation variety
 * @returns {Array} Exercise list
 */
function buildExerciseListForDuration(exerciseIds, exercisesData, progressionFactor, targetMinutes, dayIndex, weekIndex) {
  if (!exerciseIds || exerciseIds.length === 0) return []

  const cappedTarget = Math.min(targetMinutes, MAX_SESSION_MINUTES)

  // Select exercises with rotation for variety
  const rotated = selectExercisesForDay(exerciseIds, dayIndex, weekIndex, exerciseIds.length)

  // Resolve all exercises
  const resolved = rotated.map(id => {
    const category = inferExerciseCategory(id, exercisesData)
    const params = resolveExerciseParams(id, exercisesData, category, progressionFactor)
    const sessionPhase = getSessionPhase(category)
    return { id, category, sessionPhase, params }
  })

  // Sort by session phase
  resolved.sort((a, b) => {
    const orderA = SESSION_PHASE_ORDER[a.sessionPhase] ?? 2
    const orderB = SESSION_PHASE_ORDER[b.sessionPhase] ?? 2
    return orderA - orderB
  })

  // Fill until target minutes reached
  const exercises = []
  let totalDuration = 0
  let cycleIndex = 0

  while (totalDuration < cappedTarget && cycleIndex < resolved.length * 2) {
    const item = resolved[cycleIndex % resolved.length]

    // Don't add duplicate exercise IDs in same session
    if (exercises.some(e => e.exerciseId === item.id)) {
      cycleIndex++
      continue
    }

    if (totalDuration + item.params.durationMinutes > cappedTarget + 5) {
      cycleIndex++
      continue
    }

    exercises.push({
      exerciseId: item.id,
      sets: item.params.sets,
      reps: item.params.reps,
      holdSeconds: item.params.holdSeconds,
      durationMinutes: item.params.durationMinutes,
      notes: null
    })
    totalDuration += item.params.durationMinutes
    cycleIndex++
  }

  return exercises
}

/**
 * Distributes exercises into session slots for a Foundations week.
 * Builds sessions from weeklyMinutes targets, not arbitrary exercise counts.
 *
 * @param {Array} priorities
 * @param {Object} exercisesData
 * @param {number} weekIndex - 0-based index within Foundations phase
 * @param {number} foundationsDuration - total weeks in Foundations phase
 * @returns {Object} map of day -> exercise array
 */
function distributeFoundationsExercises(priorities, exercisesData, weekIndex, foundationsDuration) {
  const progressionFactor = foundationsDuration <= 1 ? 0.5 : weekIndex / (foundationsDuration - 1)
  const hasPriorities = priorities.length > 0

  // Classify exercises
  const classified = hasPriorities
    ? classifyPriorityExercises(priorities, exercisesData, weekIndex + 1, foundationsDuration)
    : {
      mobilityActivation: GENERAL_MAINTENANCE_EXERCISES.mobility_activation.map(id => ({
        exerciseId: id, severity: 'MEDIUM', weeklyMinutes: 30, priorityArea: 'General'
      })),
      strength: GENERAL_MAINTENANCE_EXERCISES.strength.map(id => ({
        exerciseId: id, severity: 'MEDIUM', weeklyMinutes: 30, priorityArea: 'General'
      })),
      capacity: GENERAL_MAINTENANCE_EXERCISES.capacity.map(id => ({
        exerciseId: id, severity: 'MEDIUM', weeklyMinutes: 30, priorityArea: 'General'
      }))
    }

  // Calculate target minutes per session from priority weeklyMinutes
  const targetMinutes = hasPriorities
    ? calculateTargetMinutesPerSession(priorities)
    : { mobilityActivation: 20, strength: 20, capacity: 30 }

  // Build exercise pools, prioritizing HIGH severity exercises first
  const highMobAct = classified.mobilityActivation.filter(e => e.severity === 'HIGH').map(e => e.exerciseId)
  const medMobAct = classified.mobilityActivation.filter(e => e.severity !== 'HIGH').map(e => e.exerciseId)
  const mobActPool = [...highMobAct, ...medMobAct]

  const highStrength = classified.strength.filter(e => e.severity === 'HIGH').map(e => e.exerciseId)
  const medStrength = classified.strength.filter(e => e.severity !== 'HIGH').map(e => e.exerciseId)
  let strengthPool = [...highStrength, ...medStrength]
  if (strengthPool.length === 0 && hasPriorities) {
    strengthPool = GENERAL_MAINTENANCE_EXERCISES.strength
  }

  const capacityPool = classified.capacity.map(e => e.exerciseId)
  const dayExercises = {}

  // --- Monday (mobility_activation) ---
  dayExercises.monday = buildExerciseListForDuration(
    mobActPool, exercisesData, progressionFactor, targetMinutes.mobilityActivation, 0, weekIndex
  )

  // --- Tuesday (strength) ---
  dayExercises.tuesday = buildExerciseListForDuration(
    strengthPool, exercisesData, progressionFactor, targetMinutes.strength, 1, weekIndex
  )

  // --- Wednesday (mobility_activation) — different subset from Monday ---
  dayExercises.wednesday = buildExerciseListForDuration(
    mobActPool, exercisesData, progressionFactor, targetMinutes.mobilityActivation, 2, weekIndex
  )

  // --- Thursday (rest) ---
  dayExercises.thursday = []

  // --- Friday (strength) — different subset from Tuesday ---
  dayExercises.friday = buildExerciseListForDuration(
    strengthPool, exercisesData, progressionFactor, targetMinutes.strength, 4, weekIndex
  )

  // --- Saturday (capacity) ---
  const satPool = capacityPool.length > 0 ? capacityPool : ['walking_progression']
  const capacityDuration = Math.min(
    Math.round(30 + progressionFactor * 30), // 30min -> 60min progression
    targetMinutes.capacity,
    MAX_SESSION_MINUTES
  )
  const satIds = selectExercisesForDay(satPool, 5, weekIndex, 1)
  dayExercises.saturday = satIds.map(id => ({
    exerciseId: id,
    sets: 1,
    reps: null,
    holdSeconds: null,
    durationMinutes: capacityDuration,
    notes: `Duración: ${capacityDuration} min`
  }))

  // --- Sunday (rest) ---
  dayExercises.sunday = []

  return dayExercises
}

/**
 * Builds an exercise list with resolved params, ordered by session phase,
 * capping total duration.
 *
 * Order: activation → mobility → strength → capacity
 * This ensures CNS-fresh exercises first, ROM work while primed, then load.
 */
function buildExerciseList(exerciseIds, exercisesData, progressionFactor) {
  const uniqueIds = [...new Set(exerciseIds)]

  // Resolve all exercises first
  const resolved = uniqueIds.map(id => {
    const category = inferExerciseCategory(id, exercisesData)
    const params = resolveExerciseParams(id, exercisesData, category, progressionFactor)
    const sessionPhase = getSessionPhase(category)
    return { id, category, sessionPhase, params }
  })

  // Sort by session phase order
  resolved.sort((a, b) => {
    const orderA = SESSION_PHASE_ORDER[a.sessionPhase] ?? 2
    const orderB = SESSION_PHASE_ORDER[b.sessionPhase] ?? 2
    return orderA - orderB
  })

  // Build list respecting max duration
  const exercises = []
  let totalDuration = 0

  for (const { id, params } of resolved) {
    if (totalDuration + params.durationMinutes > MAX_SESSION_MINUTES) break

    exercises.push({
      exerciseId: id,
      sets: params.sets,
      reps: params.reps,
      holdSeconds: params.holdSeconds,
      durationMinutes: params.durationMinutes,
      notes: null
    })
    totalDuration += params.durationMinutes
  }

  return exercises
}

/**
 * Generates a single Foundations week (Phase 1).
 *
 * @param {number} weekNumber - absolute week number
 * @param {number} weekIndex - 0-based index within Foundations phase
 * @param {Array} priorities
 * @param {Object} exercisesData
 * @param {number} foundationsDuration
 * @returns {Object} week object
 */
function generateFoundationsWeek(weekNumber, weekIndex, priorities, exercisesData, foundationsDuration, isDeload = false) {
  const dayExercises = distributeFoundationsExercises(priorities, exercisesData, weekIndex, foundationsDuration)
  const progressionFactor = foundationsDuration <= 1 ? 0.5 : weekIndex / (foundationsDuration - 1)

  // Progression tier for notes
  let tierNote
  if (isDeload) {
    tierNote = 'Semana de descarga: mismos ejercicios, volumen reducido al 60%'
  } else if (progressionFactor < 0.33) {
    tierNote = 'Fase neural: enfoque en movilidad y activación con carga baja (RIR 3-4)'
  } else if (progressionFactor < 0.66) {
    tierNote = 'Fase de desarrollo: aumentando volumen y añadiendo fuerza (RIR 1-2)'
  } else {
    tierNote = 'Fase de potencia: máxima carga, preparando la transición a correr'
  }

  const sessions = DAYS.map(day => {
    const type = FOUNDATIONS_TEMPLATE[day]
    let exercises = dayExercises[day] || []

    // Apply deload: reduce sets by 40% (volume × 0.6), keep exercises and frequency
    if (isDeload && exercises.length > 0) {
      exercises = exercises.map(ex => ({
        ...ex,
        sets: Math.max(1, Math.round(ex.sets * 0.6)),
        reps: ex.reps != null ? Math.round(ex.reps * 0.8) : null,
        holdSeconds: ex.holdSeconds != null ? Math.round(ex.holdSeconds * 0.8) : null,
        notes: 'Descarga: reduce intensidad, mantén la forma'
      }))
    }

    return {
      day,
      type,
      duration: type === 'rest' ? 0 : estimateSessionDuration(exercises),
      exercises,
      notes: type === 'rest' ? 'Descanso' : tierNote
    }
  })

  return {
    weekNumber,
    phase: 'foundations',
    phaseName: isDeload ? 'Fundamentos (descarga)' : 'Fundamentos',
    isDeload,
    sessions
  }
}

/**
 * Generates a single Transition week (Phase 3).
 *
 * @param {number} weekNumber - absolute week number
 * @param {number} weekIndex - 0-based index within Phase 3 (0-3)
 * @param {Array} priorities
 * @param {Object} exercisesData
 * @param {string} aerobicLevel - 'beginner' | 'standard' | 'advanced'
 * @returns {Object} week object
 */
function generateTransitionWeek(weekNumber, weekIndex, priorities, exercisesData, aerobicLevel = 'standard') {
  const progression = RUNNING_PROGRESSIONS[aerobicLevel] || RUNNING_PROGRESSIONS.standard
  const runProgression = progression[Math.min(weekIndex, progression.length - 1)]

  // For maintenance days, pick top exercises from HIGH priorities
  const highPriorities = priorities.filter(p => p.severity === 'HIGH')
  const maintenanceExerciseIds = highPriorities.length > 0
    ? highPriorities.flatMap(p => p.exercises).slice(0, 6)
    : GENERAL_MAINTENANCE_EXERCISES.mobility_activation.slice(0, 4)

  const sessions = DAYS.map(day => {
    const type = TRANSITION_TEMPLATE[day]

    if (type === 'running') {
      return {
        day,
        type: 'running',
        duration: runProgression.totalMinutes,
        exercises: [],
        notes: runProgression.description,
        runningDetails: {
          runMinutes: runProgression.runMinutes,
          walkMinutes: runProgression.walkMinutes,
          intervals: runProgression.intervals
        }
      }
    }

    if (type === 'maintenance') {
      const dayIndex = DAYS.indexOf(day)
      const selected = selectExercisesForDay(maintenanceExerciseIds, dayIndex, weekIndex, 4)
      const exercises = buildExerciseList(selected, exercisesData, 0.5) // mid-range params

      return {
        day,
        type: 'maintenance',
        duration: estimateSessionDuration(exercises),
        exercises,
        notes: 'Mantenimiento: movilidad y activación para complementar la carrera'
      }
    }

    // rest
    return {
      day,
      type: 'rest',
      duration: 0,
      exercises: [],
      notes: 'Descanso'
    }
  })

  return {
    weekNumber,
    phase: 'transition',
    phaseName: 'Transición',
    sessions
  }
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

/**
 * Generates a complete week-by-week plan from the personalization output.
 *
 * @param {Object} plan - plan object from generatePersonalizedPlan().plan
 *   Required fields: priorities, foundationsDuration, transitionDuration, totalWeeks
 * @param {Object} [exercisesData={}] - { exerciseId: { category, sets, reps, hold_seconds, duration_minutes, ... } }
 * @returns {{ weeks: Array, totalWeeks: number }}
 *
 * @example
 * import { generatePersonalizedPlan } from './personalization'
 * import { generateWeeklyPlan } from './weeklyPlanGenerator'
 *
 * const result = generatePersonalizedPlan(assessmentData)
 * if (result.success) {
 *   const weeklyPlan = generateWeeklyPlan(result.plan, exercisesData)
 *   console.log(weeklyPlan.weeks.length) // === result.plan.totalWeeks
 * }
 */
export function generateWeeklyPlan(plan, exercisesData = {}) {
  if (!plan) {
    return { weeks: [], totalWeeks: 0, error: 'No plan provided' }
  }

  const {
    priorities = [],
    foundationsDuration = 6,
    transitionDuration = 4,
    totalWeeks: expectedTotal,
    deloadWeeks = [],
    aerobicLevel = 'standard'
  } = plan

  const totalWeeks = expectedTotal || (foundationsDuration + transitionDuration)
  const weeks = []

  for (let w = 1; w <= totalWeeks; w++) {
    if (w <= foundationsDuration) {
      // Phase 1: Foundations
      const weekIndex = w - 1 // 0-based within Foundations
      const isDeload = deloadWeeks.includes(w)
      weeks.push(generateFoundationsWeek(w, weekIndex, priorities, exercisesData, foundationsDuration, isDeload))
    } else {
      // Phase 2: Transition
      const weekIndex = w - foundationsDuration - 1 // 0-based within Transition
      weeks.push(generateTransitionWeek(w, weekIndex, priorities, exercisesData, aerobicLevel))
    }
  }

  return { weeks, totalWeeks }
}

/**
 * Generates a human-readable summary of a week (for debugging / display).
 *
 * @param {Object} week - a single week object from generateWeeklyPlan().weeks
 * @returns {string} formatted summary
 */
export function generateWeekSummary(week) {
  if (!week) return 'Week data not available'

  const lines = [
    `=== Semana ${week.weekNumber} (${week.phaseName}) ===`
  ]

  for (const session of week.sessions) {
    if (session.type === 'rest') {
      lines.push(`  ${session.day}: Descanso`)
      continue
    }

    const exerciseCount = session.exercises.length
    const exerciseNames = session.exercises.map(e => e.exerciseId).join(', ')
    lines.push(
      `  ${session.day}: ${session.type} (${session.duration}min) - ${exerciseCount} ejercicios`
    )
    if (exerciseNames) {
      lines.push(`    [${exerciseNames}]`)
    }
    if (session.notes) {
      lines.push(`    Nota: ${session.notes}`)
    }
  }

  return lines.join('\n')
}
