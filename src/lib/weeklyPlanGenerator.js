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
 * Running interval progression over 4 weeks of Phase 3.
 * Each entry: { runMinutes, walkMinutes, intervals, totalMinutes, description }
 */
const RUNNING_PROGRESSION = [
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
]

const MAX_SESSION_MINUTES = 60

/**
 * Regex patterns to infer exercise category from its ID when not in exercisesData.
 * Checked in order — first match wins.
 */
const CATEGORY_INFERENCE_RULES = [
  { pattern: /stretch|mobility|rom|dorsiflexion|90_90|cat_cow|flexor/, category: 'mobility' },
  { pattern: /bridge|clam|fire_hydrant|dead_bug|bird_dog|activation|balance|stability|single_leg_stand/, category: 'activation' },
  { pattern: /squat|plank|lunge|step_up|good_morning|progression/, category: 'strength' },
  { pattern: /walk|cardio|zone2|aerobic|capacity/, category: 'capacity' }
]

/**
 * General maintenance exercises used when the plan has no priorities.
 * These are IDs from the seeded exercises.
 */
const GENERAL_MAINTENANCE_EXERCISES = {
  mobility_activation: ['cat_cow', 'hip_flexor_stretch', 'ankle_wall_mobility', 'glute_bridge', 'dead_bug'],
  strength: ['bodyweight_squat', 'plank', 'glute_bridge'],
  capacity: ['walking']
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
 * Resolves sets/reps/hold for an exercise, applying progression.
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

  let baseSets = dbExercise?.sets ?? defaults.sets
  let baseReps = dbExercise?.reps ?? defaults.reps
  let baseHold = dbExercise?.hold_seconds ?? (dbExercise?.holdSeconds ?? defaults.holdSeconds)
  let baseDuration = dbExercise?.duration_minutes ?? (dbExercise?.durationMinutes ?? defaults.durationMinutes)

  // Apply progression factor
  let sets, reps, holdSeconds

  if (progressionFactor < 0.33) {
    // Early phase: easier
    sets = Math.max(1, baseSets - 1)
    reps = baseReps != null ? Math.round(baseReps * 0.8) : null
    holdSeconds = baseHold != null ? Math.round(baseHold * 0.8) : null
  } else if (progressionFactor < 0.66) {
    // Mid phase: base values
    sets = baseSets
    reps = baseReps
    holdSeconds = baseHold
  } else {
    // Late phase: harder
    sets = baseSets + 1
    reps = baseReps != null ? Math.min(Math.round(baseReps * 1.2), 25) : null
    holdSeconds = baseHold != null ? Math.min(Math.round(baseHold * 1.2), 60) : null
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
 * Classifies all priority exercises into session type buckets.
 *
 * @param {Array} priorities - plan priorities
 * @param {Object} exercisesData
 * @returns {{ mobilityActivation: Array, strength: Array, capacity: Array }}
 *   Each entry: { exerciseId, severity, weeklyMinutes, priorityArea }
 */
function classifyPriorityExercises(priorities, exercisesData) {
  const classified = {
    mobilityActivation: [],
    strength: [],
    capacity: []
  }

  for (const priority of priorities) {
    for (const exerciseId of priority.exercises) {
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
        // default bucket
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
 * Distributes exercises into session slots for a Foundations week.
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
    ? classifyPriorityExercises(priorities, exercisesData)
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

  // Separate HIGH and MEDIUM
  const highMobAct = classified.mobilityActivation.filter(e => e.severity === 'HIGH')
  const medMobAct = classified.mobilityActivation.filter(e => e.severity !== 'HIGH')
  const highStrength = classified.strength.filter(e => e.severity === 'HIGH')
  const medStrength = classified.strength.filter(e => e.severity !== 'HIGH')

  // When no HIGH priorities, give MEDIUM exercises more slots
  const medMobActCount = highMobAct.length > 0 ? 1 : 3
  const medStrengthCount = highStrength.length > 0 ? 1 : 2

  const dayExercises = {}

  // --- Monday (mobility_activation) ---
  const monExerciseIds = [
    ...selectExercisesForDay(highMobAct.map(e => e.exerciseId), 0, weekIndex, highMobAct.length > 0 ? 3 : 0),
    ...selectExercisesForDay(medMobAct.map(e => e.exerciseId), 0, weekIndex, medMobActCount)
  ]
  dayExercises.monday = buildExerciseList(monExerciseIds, exercisesData, progressionFactor)

  // --- Tuesday (strength) ---
  const tueExerciseIds = [
    ...selectExercisesForDay(highStrength.map(e => e.exerciseId), 1, weekIndex, highStrength.length > 0 ? 2 : 0),
    ...selectExercisesForDay(medStrength.map(e => e.exerciseId), 1, weekIndex, medStrengthCount)
  ]
  // If no strength exercises from priorities, use general
  if (tueExerciseIds.length === 0 && hasPriorities) {
    const generalStrength = selectExercisesForDay(
      GENERAL_MAINTENANCE_EXERCISES.strength, 1, weekIndex, 2
    )
    dayExercises.tuesday = buildExerciseList(generalStrength, exercisesData, progressionFactor)
  } else {
    dayExercises.tuesday = buildExerciseList(tueExerciseIds, exercisesData, progressionFactor)
  }

  // --- Wednesday (mobility_activation) — different subset from Monday ---
  const wedExerciseIds = [
    ...selectExercisesForDay(highMobAct.map(e => e.exerciseId), 2, weekIndex, highMobAct.length > 0 ? 3 : 0),
    ...selectExercisesForDay(medMobAct.map(e => e.exerciseId), 2, weekIndex, medMobActCount)
  ]
  dayExercises.wednesday = buildExerciseList(wedExerciseIds, exercisesData, progressionFactor)

  // --- Thursday (rest) ---
  dayExercises.thursday = []

  // --- Friday (strength) — different subset from Tuesday ---
  const friExerciseIds = [
    ...selectExercisesForDay(highStrength.map(e => e.exerciseId), 4, weekIndex, highStrength.length > 0 ? 2 : 0),
    ...selectExercisesForDay(medStrength.map(e => e.exerciseId), 4, weekIndex, medStrengthCount)
  ]
  if (friExerciseIds.length === 0 && hasPriorities) {
    const generalStrength = selectExercisesForDay(
      GENERAL_MAINTENANCE_EXERCISES.strength, 4, weekIndex, 2
    )
    dayExercises.friday = buildExerciseList(generalStrength, exercisesData, progressionFactor)
  } else {
    dayExercises.friday = buildExerciseList(friExerciseIds, exercisesData, progressionFactor)
  }

  // --- Saturday (capacity) ---
  const capacityIds = classified.capacity.map(e => e.exerciseId)
  const satIds = capacityIds.length > 0
    ? selectExercisesForDay(capacityIds, 5, weekIndex, 1)
    : ['walking']
  const capacityDuration = Math.round(30 + progressionFactor * 30) // 30min -> 60min
  dayExercises.saturday = satIds.map(id => ({
    exerciseId: id,
    sets: 1,
    reps: null,
    holdSeconds: null,
    durationMinutes: Math.min(capacityDuration, MAX_SESSION_MINUTES),
    notes: `Duración: ${Math.min(capacityDuration, MAX_SESSION_MINUTES)} min`
  }))

  // --- Sunday (rest) ---
  dayExercises.sunday = []

  return dayExercises
}

/**
 * Builds an exercise list with resolved params, capping total duration.
 */
function buildExerciseList(exerciseIds, exercisesData, progressionFactor) {
  const uniqueIds = [...new Set(exerciseIds)]
  const exercises = []
  let totalDuration = 0

  for (const id of uniqueIds) {
    const category = inferExerciseCategory(id, exercisesData)
    const params = resolveExerciseParams(id, exercisesData, category, progressionFactor)

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
function generateFoundationsWeek(weekNumber, weekIndex, priorities, exercisesData, foundationsDuration) {
  const dayExercises = distributeFoundationsExercises(priorities, exercisesData, weekIndex, foundationsDuration)
  const progressionFactor = foundationsDuration <= 1 ? 0.5 : weekIndex / (foundationsDuration - 1)

  // Progression tier for notes
  let tierNote
  if (progressionFactor < 0.33) {
    tierNote = 'Fase inicial: enfoque en movilidad y activación con carga baja'
  } else if (progressionFactor < 0.66) {
    tierNote = 'Fase intermedia: aumentando volumen y añadiendo fuerza'
  } else {
    tierNote = 'Fase avanzada: máxima carga, preparando la transición a correr'
  }

  const sessions = DAYS.map(day => {
    const type = FOUNDATIONS_TEMPLATE[day]
    const exercises = dayExercises[day] || []

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
    phaseName: 'Fundamentos',
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
 * @returns {Object} week object
 */
function generateTransitionWeek(weekNumber, weekIndex, priorities, exercisesData) {
  const runProgression = RUNNING_PROGRESSION[Math.min(weekIndex, RUNNING_PROGRESSION.length - 1)]

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
    totalWeeks: expectedTotal
  } = plan

  const totalWeeks = expectedTotal || (foundationsDuration + transitionDuration)
  const weeks = []

  for (let w = 1; w <= totalWeeks; w++) {
    if (w <= foundationsDuration) {
      // Phase 1: Foundations
      const weekIndex = w - 1 // 0-based within Foundations
      weeks.push(generateFoundationsWeek(w, weekIndex, priorities, exercisesData, foundationsDuration))
    } else {
      // Phase 2: Transition
      const weekIndex = w - foundationsDuration - 1 // 0-based within Transition
      weeks.push(generateTransitionWeek(w, weekIndex, priorities, exercisesData))
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
