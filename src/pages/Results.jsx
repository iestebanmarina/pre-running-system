import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { getExercisesByIds } from '../lib/exerciseHelpers'
import ExerciseCard from '../components/exercises/ExerciseCard'

// ============================================================================
// MOCK DATA (fallback for direct URL access / page refresh)
// ============================================================================

const MOCK_PLAN = {
  priorities: [
    {
      area: 'Dorsiflexión del tobillo',
      severity: 'HIGH',
      current: '8 cm',
      target: '13 cm',
      weeklyMinutes: 70,
      exercises: ['ankle_wall_mobility', 'calf_stretch', 'dorsiflexion_active']
    },
    {
      area: 'Activación del glúteo',
      severity: 'HIGH',
      current: 'Isquiotibiales primero',
      target: 'Glúteo primero',
      weeklyMinutes: 105,
      exercises: ['clams', 'bridge', 'single_leg_bridge', 'fire_hydrants']
    },
    {
      area: 'Estabilidad del core',
      severity: 'HIGH',
      current: '25 segundos',
      target: '60 segundos',
      weeklyMinutes: 60,
      exercises: ['plank_progression', 'dead_bug', 'bird_dog']
    },
    {
      area: 'Flexibilidad de cadena posterior',
      severity: 'MEDIUM',
      current: 'Rodillas',
      target: 'Espinillas o mejor',
      weeklyMinutes: 40,
      exercises: ['toe_touch_progression', 'hamstring_stretch', 'good_morning']
    },
    {
      area: 'Equilibrio y estabilidad',
      severity: 'MEDIUM',
      current: '30 segundos',
      target: '60 segundos',
      weeklyMinutes: 30,
      exercises: ['single_leg_stand', 'balance_progression', 'stability_exercises']
    }
  ],
  phase1Duration: 2,
  phase2Duration: 10,
  phase3Duration: 4,
  estimatedWeeks: 10,
  totalWeeks: 16
}

// ============================================================================
// CONSTANTS — full Tailwind class strings (no dynamic interpolation)
// ============================================================================

const SEVERITY_BAR = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-gray-400'
}

const SEVERITY_BADGE_STYLES = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-600'
}

const SEVERITY_LABELS = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja'
}

const PHASE_COLORS = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500'
}

const PHASE_DOT = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500'
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_BADGE_STYLES[severity]}`}>
      {SEVERITY_LABELS[severity]}
    </span>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
      <div className="text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  )
}

function PhaseTimeline({ phase1, phase2, phase3 }) {
  const total = phase1 + phase2 + phase3

  return (
    <div className="mt-8">
      <div className="flex rounded-full overflow-hidden h-4">
        <div
          className={`${PHASE_COLORS.blue}`}
          style={{ width: `${(phase1 / total) * 100}%` }}
        />
        <div
          className={`${PHASE_COLORS.green}`}
          style={{ width: `${(phase2 / total) * 100}%` }}
        />
        <div
          className={`${PHASE_COLORS.orange}`}
          style={{ width: `${(phase3 / total) * 100}%` }}
        />
      </div>
      <div className="flex mt-2 text-xs text-gray-600">
        <div style={{ width: `${(phase1 / total) * 100}%` }} className="text-center">
          <span className="font-medium text-blue-700">Evaluación</span>
          <br />{phase1} sem
        </div>
        <div style={{ width: `${(phase2 / total) * 100}%` }} className="text-center">
          <span className="font-medium text-green-700">Fundamentos</span>
          <br />{phase2} sem
        </div>
        <div style={{ width: `${(phase3 / total) * 100}%` }} className="text-center">
          <span className="font-medium text-orange-700">Transición</span>
          <br />{phase3} sem
        </div>
      </div>
    </div>
  )
}

function formatExerciseId(id) {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function PriorityCard({ priority, exercisesData, loadingExercises }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex">
        {/* Color stripe */}
        <div className={`w-1.5 shrink-0 ${SEVERITY_BAR[priority.severity]}`} />

        <div className="flex-1 p-4 sm:p-5">
          {/* Top row: area + badge + minutes */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{priority.area}</h3>
              <SeverityBadge severity={priority.severity} />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {priority.weeklyMinutes} min/sem
            </span>
          </div>

          {/* Current → Target */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>Actual: <span className="font-medium text-gray-900">{priority.current}</span></span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span>Objetivo: <span className="font-medium text-green-700">{priority.target}</span></span>
          </div>

          {/* Exercise pills */}
          <div className="flex flex-wrap gap-1.5">
            {priority.exercises.map(ex => (
              <span
                key={ex}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
                {formatExerciseId(ex)}
              </span>
            ))}
          </div>

          {/* Ejercicios Recomendados */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              📋 Ejercicios Recomendados
            </h4>

            {loadingExercises ? (
              <p className="text-sm text-gray-500">Cargando ejercicios...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {priority.exercises?.slice(0, 4).map(exerciseId => {
                    const exercise = exercisesData[exerciseId]
                    if (!exercise) return null

                    return (
                      <ExerciseCard
                        key={exerciseId}
                        exercise={exercise}
                        variant="compact"
                      />
                    )
                  })}
                </div>

                {priority.exercises?.length > 4 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{priority.exercises.length - 4} ejercicios más
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TIMELINE HELPERS
// ============================================================================

function getPhase1Weeks(startWeek) {
  return [
    { week: startWeek, description: 'Tests iniciales — Evaluación completa de las 7 pruebas' },
    { week: startWeek + 1, description: 'Repetición tests base — Confirmar resultados iniciales' }
  ]
}

function getPhase2Weeks(startWeek, duration) {
  const weeks = []
  for (let i = 0; i < duration; i++) {
    const weekNum = startWeek + i
    let description
    if (i < 2) {
      description = 'Movilidad + Activación — Corrección de patrones básicos'
    } else if (i < duration - 2) {
      description = 'Movilidad + Activación + Fuerza — Construcción progresiva'
    } else {
      description = 'Fuerza + Capacidad — Preparación para la transición'
    }
    weeks.push({ week: weekNum, description })
  }
  return weeks
}

function getPhase3Weeks(startWeek) {
  return [
    { week: startWeek, description: 'Caminar 45min + 4x30s trote suave con 2min caminando' },
    { week: startWeek + 1, description: 'Caminar 40min + 6x45s trote con 90s caminando' },
    { week: startWeek + 2, description: 'Caminar 30min + 8x1min trote con 1min caminando' },
    { week: startWeek + 3, description: 'Caminar 20min + 10x1.5min trote con 1min caminando' }
  ]
}

// ============================================================================
// ACCORDION PHASE BLOCK
// ============================================================================

function PhaseBlock({ color, name, weekRange, description, weeks, defaultExpanded }) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${PHASE_DOT[color]}`} />
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{weekRange}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 sm:px-5 pb-4 sm:pb-5">
          <p className="text-sm text-gray-600 mt-3 mb-4">{description}</p>
          <div className="space-y-2">
            {weeks.map(w => (
              <div key={w.week} className="flex gap-3 text-sm">
                <span className="font-medium text-gray-500 shrink-0 w-20">Semana {w.week}</span>
                <span className="text-gray-700">{w.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()

  const hasPlanData = location.state?.plan != null
  const plan = location.state?.plan ?? MOCK_PLAN
  const highCount = plan.priorities.filter(p => p.severity === 'HIGH').length
  const noPriorities = plan.priorities.length === 0

  // State para ejercicios
  const [exercisesData, setExercisesData] = useState({})
  const [loadingExercises, setLoadingExercises] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Cargar ejercicios de Supabase
  useEffect(() => {
    async function loadExercises() {
      if (!plan?.priorities) {
        setLoadingExercises(false)
        return
      }

      // Extraer todos los exercise IDs de todas las prioridades
      const allExerciseIds = plan.priorities
        .flatMap(p => p.exercises || [])

      // Remover duplicados
      const uniqueIds = [...new Set(allExerciseIds)]

      if (uniqueIds.length === 0) {
        setLoadingExercises(false)
        return
      }

      // Cargar ejercicios de Supabase
      const { data, error } = await getExercisesByIds(uniqueIds)

      if (error) {
        console.error('Error cargando ejercicios:', error)
        setLoadingExercises(false)
        return
      }

      // Convertir array a objeto { id: exercise } para lookup rápido
      const exercisesMap = {}
      data.forEach(ex => {
        exercisesMap[ex.id] = ex
      })

      setExercisesData(exercisesMap)
      setLoadingExercises(false)
    }

    loadExercises()
  }, [plan])

  // Phase week ranges
  const phase1Start = 1
  const phase2Start = phase1Start + plan.phase1Duration
  const phase3Start = phase2Start + plan.phase2Duration

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock data banner */}
      {!hasPlanData && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center text-sm text-yellow-800">
          Mostrando datos de ejemplo. <button onClick={() => navigate('/assessment')} className="underline font-medium hover:text-yellow-900">Completa tu evaluación</button> para ver tu plan personalizado.
        </div>
      )}

      {/* ================================================================ */}
      {/* SECTION 1: HEADER */}
      {/* ================================================================ */}
      <section className="bg-blue-50 px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Evaluación completada
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Tu Plan Personalizado Pre-Running
          </h1>
          <p className="text-gray-600 text-center mt-2">
            {noPriorities
              ? 'Tu evaluación muestra que estás en buena forma para empezar.'
              : `Un programa de ${plan.totalWeeks} semanas diseñado para tus necesidades específicas`
            }
          </p>

          {/* Stat cards */}
          {!noPriorities && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <StatCard value={plan.totalWeeks} label="Semanas totales" />
                <StatCard value={plan.priorities.length} label="Áreas a trabajar" />
                <StatCard value={highCount} label="Prioridad alta" />
              </div>

              {/* Phase timeline bar */}
              <PhaseTimeline
                phase1={plan.phase1Duration}
                phase2={plan.phase2Duration}
                phase3={plan.phase3Duration}
              />
            </>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: PRIORITIES */}
      {/* ================================================================ */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tus Prioridades</h2>
          <p className="text-gray-600 mt-1 mb-6">
            Ordenadas por importancia para tu preparación
          </p>

          {noPriorities ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-green-800 text-lg mb-1">
                ¡Enhorabuena!
              </h3>
              <p className="text-green-700 text-sm">
                {plan.message || 'No tienes limitaciones significativas. Puedes comenzar con un plan de mantenimiento general.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {plan.priorities.map((priority, index) => (
                <PriorityCard
                  key={index}
                  priority={priority}
                  exercisesData={exercisesData}
                  loadingExercises={loadingExercises}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: TIMELINE */}
      {/* ================================================================ */}
      {!noPriorities && (
        <section className="bg-gray-100 px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tu Recorrido Semana a Semana</h2>
            <p className="text-gray-600 mt-1 mb-6">
              Así se estructura tu programa personalizado
            </p>

            <div className="space-y-4">
              <PhaseBlock
                color="blue"
                name="Fase 1 — Evaluación"
                weekRange={`Semanas ${phase1Start}-${phase1Start + plan.phase1Duration - 1}`}
                description="Establecemos tu línea base y confirmamos los resultados de tus pruebas iniciales."
                weeks={getPhase1Weeks(phase1Start)}
                defaultExpanded={true}
              />
              <PhaseBlock
                color="green"
                name="Fase 2 — Fundamentos"
                weekRange={`Semanas ${phase2Start}-${phase2Start + plan.phase2Duration - 1}`}
                description="Corregimos tus limitaciones con un plan progresivo de movilidad, activación y fuerza."
                weeks={getPhase2Weeks(phase2Start, plan.phase2Duration)}
                defaultExpanded={false}
              />
              <PhaseBlock
                color="orange"
                name="Fase 3 — Transición a correr"
                weekRange={`Semanas ${phase3Start}-${phase3Start + plan.phase3Duration - 1}`}
                description="Introducción gradual a la carrera con intervalos de caminar/trotar progresivos."
                weeks={getPhase3Weeks(phase3Start)}
                defaultExpanded={false}
              />
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* SECTION 4: CTA */}
      {/* ================================================================ */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            ¿Estás listo para empezar?
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            12 semanas de preparación = 10-20 años corriendo sin lesiones
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => alert('El dashboard se implementará próximamente.')}
            >
              Empezar Programa
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/assessment')}
            >
              Repetir Evaluación
            </Button>
            <button
              onClick={() => navigate('/exercises')}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver Biblioteca Completa
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
