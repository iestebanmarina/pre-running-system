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
      areaKey: 'ANKLE_ROM',
      severity: 'HIGH',
      current: 'D: 8 cm / I: 12 cm',
      target: '13 cm',
      weeklyMinutes: 70,
      exercises: ['ankle_wall_mobility', 'ankle_circles', 'dorsiflexion_active'],
      asymmetry: { present: true, weakerSide: 'right', difference: 4, rightValue: 8, leftValue: 12 }
    },
    {
      area: 'Activación del glúteo',
      areaKey: 'GLUTE_ACTIVATION',
      severity: 'HIGH',
      current: 'Isquiotibiales primero',
      target: 'Glúteo primero',
      weeklyMinutes: 105,
      exercises: ['glute_bridge', 'clams', 'fire_hydrants', 'donkey_kicks']
    },
    {
      area: 'Estabilidad del core',
      areaKey: 'CORE',
      severity: 'HIGH',
      current: '25 segundos',
      target: '60 segundos',
      weeklyMinutes: 60,
      exercises: ['dead_bug', 'bird_dog', 'plank_progression']
    },
    {
      area: 'Flexibilidad de cadena posterior',
      areaKey: 'POSTERIOR_CHAIN',
      severity: 'MEDIUM',
      current: 'Rodillas',
      target: 'Espinillas o mejor',
      weeklyMinutes: 40,
      exercises: ['toe_touch_progression', 'hamstring_stretch', 'cat_cow']
    },
    {
      area: 'Equilibrio y estabilidad',
      areaKey: 'BALANCE',
      severity: 'MEDIUM',
      current: 'D: 30s / I: 25s',
      target: '60 segundos',
      weeklyMinutes: 30,
      exercises: ['single_leg_stand', 'balance_progression', 'stability_exercises']
    }
  ],
  foundationsDuration: 10,
  transitionDuration: 4,
  estimatedWeeks: 10,
  totalWeeks: 14,
  deloadWeeks: [4, 8],
  aerobicLevel: 'standard'
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEVERITY_BAR = {
  HIGH: 'bg-accent-pink',
  MEDIUM: 'bg-accent-orange',
  LOW: 'bg-muted'
}

const SEVERITY_BADGE_STYLES = {
  HIGH: 'bg-accent-pink/10 text-accent-pink',
  MEDIUM: 'bg-accent-orange/10 text-accent-orange',
  LOW: 'bg-surface text-muted'
}

const SEVERITY_LABELS = {
  HIGH: 'Alta',
  MEDIUM: 'Media',
  LOW: 'Baja'
}

const PHASE_COLORS = {
  orange: 'bg-accent-orange',
  pink: 'bg-accent-pink'
}

const PHASE_DOT = {
  orange: 'bg-accent-orange',
  pink: 'bg-accent-pink'
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
    <div className="bg-white rounded-2xl shadow-card border border-border p-6 text-center hover:shadow-card-hover transition-all duration-300">
      <div className="text-3xl font-bold bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">{value}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  )
}

function PhaseTimeline({ foundations, transition }) {
  const total = foundations + transition

  return (
    <div className="mt-8">
      <div className="flex rounded-full overflow-hidden h-4">
        <div
          className={`${PHASE_COLORS.orange}`}
          style={{ width: `${(foundations / total) * 100}%` }}
        />
        <div
          className={`${PHASE_COLORS.pink}`}
          style={{ width: `${(transition / total) * 100}%` }}
        />
      </div>
      <div className="flex mt-2 text-xs text-muted">
        <div style={{ width: `${(foundations / total) * 100}%` }} className="text-center">
          <span className="font-medium text-accent-orange">Fundamentos</span>
          <br />{foundations} sem
        </div>
        <div style={{ width: `${(transition / total) * 100}%` }} className="text-center">
          <span className="font-medium text-accent-pink">Transición</span>
          <br />{transition} sem
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
    <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300">
      <div className="flex">
        {/* Color stripe */}
        <div className={`w-1.5 shrink-0 ${SEVERITY_BAR[priority.severity]}`} />

        <div className="flex-1 p-4 sm:p-5">
          {/* Top row: area + badge + minutes */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-black">{priority.area}</h3>
              <SeverityBadge severity={priority.severity} />
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-muted">
              {priority.weeklyMinutes} min/sem
            </span>
          </div>

          {/* Current -> Target */}
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <span>Actual: <span className="font-medium text-black">{priority.current}</span></span>
            <svg className="w-4 h-4 text-border shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span>Objetivo: <span className="font-medium text-accent-orange">{priority.target}</span></span>
          </div>

          {/* Asymmetry warning */}
          {priority.asymmetry?.present && (
            <div className="flex items-center gap-2 text-sm mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="text-amber-700 text-xs">
                Asimetría detectada: lado {priority.asymmetry.weakerSide === 'right' ? 'derecho' : 'izquierdo'} más débil
                (diferencia: {priority.asymmetry.difference}{priority.area.includes('tobillo') ? ' cm' : priority.area.includes('cadera') ? '°' : 's'})
              </span>
            </div>
          )}

          {/* Exercise pills */}
          <div className="flex flex-wrap gap-1.5">
            {priority.exercises.map(ex => (
              <span
                key={ex}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-surface text-muted"
              >
                {formatExerciseId(ex)}
              </span>
            ))}
          </div>

          {/* Ejercicios Recomendados */}
          <div className="mt-4 border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-black mb-3">
              Ejercicios recomendados
            </h4>

            {loadingExercises ? (
              <p className="text-sm text-muted">Cargando ejercicios...</p>
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
                  <p className="text-xs text-muted mt-2">
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

function getFoundationsWeeks(startWeek, duration) {
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

function getTransitionWeeks(startWeek) {
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
    <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-surface transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${PHASE_DOT[color]}`} />
          <div>
            <div className="font-semibold text-black">{name}</div>
            <div className="text-sm text-muted">{weekRange}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 sm:px-5 pb-4 sm:pb-5">
          <p className="text-sm text-muted mt-3 mb-4">{description}</p>
          <div className="space-y-2">
            {weeks.map(w => (
              <div key={w.week} className="flex gap-3 text-sm">
                <span className="font-medium text-muted shrink-0 w-20">Semana {w.week}</span>
                <span className="text-black">{w.description}</span>
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

  const [exercisesData, setExercisesData] = useState({})
  const [loadingExercises, setLoadingExercises] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function loadExercises() {
      if (!plan?.priorities) {
        setLoadingExercises(false)
        return
      }

      const allExerciseIds = plan.priorities
        .flatMap(p => p.exercises || [])

      const uniqueIds = [...new Set(allExerciseIds)]

      if (uniqueIds.length === 0) {
        setLoadingExercises(false)
        return
      }

      const { data, error } = await getExercisesByIds(uniqueIds)

      if (error) {
        console.error('Error cargando ejercicios:', error)
        setLoadingExercises(false)
        return
      }

      const exercisesMap = {}
      data.forEach(ex => {
        exercisesMap[ex.id] = ex
      })

      setExercisesData(exercisesMap)
      setLoadingExercises(false)
    }

    loadExercises()
  }, [plan])

  const foundationsStart = 1
  const transitionStart = 1 + plan.foundationsDuration

  return (
    <div className="min-h-screen bg-white">
      {/* Mock data banner */}
      {!hasPlanData && (
        <div className="bg-surface border-b border-border px-4 py-3 text-center text-sm text-muted">
          Mostrando datos de ejemplo. <button onClick={() => navigate('/assessment')} className="underline font-medium hover:text-black">Completa tu evaluación</button> para ver tu plan personalizado.
        </div>
      )}

      {/* SECTION 1: HEADER */}
      <section className="bg-gradient-to-r from-accent-orange to-accent-pink px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Evaluación completada
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Tu plan personalizado Pre-Running
          </h1>
          <p className="text-white/80 text-center mt-2">
            {noPriorities
              ? 'Tu evaluación muestra que estás en buena forma para empezar.'
              : `Un programa de ${plan.totalWeeks} semanas diseñado para tus necesidades específicas`
            }
          </p>

          {!noPriorities && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <StatCard value={plan.totalWeeks} label="Semanas totales" />
                <StatCard value={plan.priorities.length} label="Áreas a trabajar" />
                <StatCard value={highCount} label="Prioridad alta" />
              </div>

              <PhaseTimeline
                foundations={plan.foundationsDuration}
                transition={plan.transitionDuration}
              />
            </>
          )}
        </div>
      </section>

      {/* SECTION 2: PRIORITIES */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-black">Tus prioridades</h2>
          <p className="text-muted mt-1 mb-6">
            Ordenadas por importancia para tu preparación
          </p>

          {noPriorities ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
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

      {/* SECTION 3: TIMELINE */}
      {!noPriorities && (
        <section className="bg-surface px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Tu recorrido semana a semana</h2>
            <p className="text-muted mt-1 mb-6">
              Así se estructura tu programa personalizado
            </p>

            <div className="space-y-4">
              <PhaseBlock
                color="orange"
                name="Fase 1 — Fundamentos"
                weekRange={`Semanas ${foundationsStart}-${foundationsStart + plan.foundationsDuration - 1}`}
                description="Corregimos tus limitaciones con un plan progresivo de movilidad, activación y fuerza."
                weeks={getFoundationsWeeks(foundationsStart, plan.foundationsDuration)}
                defaultExpanded={true}
              />
              <PhaseBlock
                color="pink"
                name="Fase 2 — Transición a correr"
                weekRange={`Semanas ${transitionStart}-${transitionStart + plan.transitionDuration - 1}`}
                description="Introducción gradual a la carrera con intervalos de caminar/trotar progresivos."
                weeks={getTransitionWeeks(transitionStart)}
                defaultExpanded={false}
              />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: CTA */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            ¿Estás listo para empezar?
          </h2>
          <p className="text-muted mt-2 mb-8">
            12 semanas de preparación = 10-20 años corriendo sin lesiones
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard', { state: { plan } })}
            >
              Empezar programa
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/assessment')}
            >
              Repetir evaluación
            </Button>
            <button
              onClick={() => navigate('/exercises')}
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-black text-black rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300"
            >
              Ver biblioteca completa
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
