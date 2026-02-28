import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getUserPlan, completeSession, getCompletedSessions, calculateCurrentWeek, calculateStreak } from '../lib/supabaseHelpers'
import { generateWeeklyPlan } from '../lib/weeklyPlanGenerator'
import { getExercisesByIds } from '../lib/exerciseHelpers'
import Button from '../components/ui/Button'

// ============================================================================
// CONSTANTS
// ============================================================================

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

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-accent-orange/10 text-accent-orange',
  abandoned: 'bg-surface text-muted'
}

const STATUS_LABELS = {
  active: 'Activo',
  completed: 'Completado',
  abandoned: 'Abandonado'
}

const DAY_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

const SESSION_TYPE_NAMES = {
  mobility_activation: 'Movilidad + Activación',
  strength: 'Fuerza',
  capacity: 'Capacidad aeróbica',
  running: 'Running',
  maintenance: 'Mantenimiento',
  rest: 'Descanso',
  assessment: 'Evaluación'
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

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function StatsBar({ completedCount, totalSessions, currentStreak, longestStreak }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white/10 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-white">{completedCount}</div>
        <div className="text-xs text-white/60">Sesiones completadas</div>
      </div>
      <div className="bg-white/10 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-white">{totalSessions}</div>
        <div className="text-xs text-white/60">Sesiones totales</div>
      </div>
      <div className="bg-white/10 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-accent-orange">{currentStreak}</div>
        <div className="text-xs text-white/60">Racha actual (días)</div>
      </div>
      <div className="bg-white/10 rounded-xl p-3 text-center">
        <div className="text-2xl font-bold text-white">{longestStreak}</div>
        <div className="text-xs text-white/60">Mejor racha</div>
      </div>
    </div>
  )
}

function DifficultyRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
            value === n
              ? 'bg-accent-orange text-white scale-110'
              : 'bg-surface text-muted hover:bg-border'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

function getCurrentPhase(currentWeek, plan) {
  if (currentWeek <= plan.foundationsDuration) {
    return 'Fundamentos'
  }
  return 'Transición running'
}

function getTodayDayKey() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}

function countTotalTrainingSessions(weeklyPlan) {
  if (!weeklyPlan?.weeks) return 0
  return weeklyPlan.weeks.reduce((total, week) => {
    return total + week.sessions.filter(s => s.type !== 'rest').length
  }, 0)
}

function isSessionCompletedToday(completedSessions, currentWeek, todayKey) {
  if (!completedSessions) return false
  return completedSessions.some(
    s => s.week === currentWeek && s.day === todayKey
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [plan, setPlan] = useState(null)
  const [weeklyPlan, setWeeklyPlan] = useState(null)
  const [exercisesData, setExercisesData] = useState({})
  const [todaySession, setTodaySession] = useState(null)
  const [completedSessions, setCompletedSessions] = useState([])
  const [currentWeek, setCurrentWeek] = useState(1)
  const [isCompleting, setIsCompleting] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [difficultyRating, setDifficultyRating] = useState(null)
  const [showRating, setShowRating] = useState(false)

  useEffect(() => {
    async function loadPlanData() {
      setIsLoading(true)

      const planFromState = location.state?.plan
      let activePlan = planFromState

      if (!planFromState) {
        const { data: planData, error } = await getUserPlan('TEMP_USER_ID')
        if (error || !planData) {
          setPlan(null)
          setIsLoading(false)
          return
        }
        activePlan = planData
      }

      setPlan(activePlan)

      // Calculate real current week from plan creation date
      const week = activePlan.createdAt
        ? Math.min(calculateCurrentWeek(activePlan.createdAt), activePlan.totalWeeks)
        : 1
      setCurrentWeek(week)

      // Generate weekly plan
      const weekly = generateWeeklyPlan(activePlan, {})
      setWeeklyPlan(weekly)

      // Load exercise data
      const allExerciseIds = weekly.weeks
        .flatMap(w => w.sessions)
        .flatMap(s => s.exercises || [])
        .map(e => e.exerciseId)

      const uniqueIds = [...new Set(allExerciseIds)]
      const { data: exercises } = await getExercisesByIds(uniqueIds)

      const exercisesMap = {}
      exercises?.forEach(ex => { exercisesMap[ex.id] = ex })
      setExercisesData(exercisesMap)

      // Find today's session from the CURRENT week
      const currentWeekData = weekly.weeks.find(w => w.weekNumber === week)
      const today = getTodayDayKey()
      const session = currentWeekData?.sessions.find(s => s.day === today)
      setTodaySession(session)

      // Load completed sessions
      if (activePlan.id && activePlan.userId) {
        const { data: sessions } = await getCompletedSessions(activePlan.userId, activePlan.id)
        if (sessions) {
          setCompletedSessions(sessions)
          setSessionCompleted(isSessionCompletedToday(sessions, week, today))
        }
      }

      setIsLoading(false)
    }

    loadPlanData()
  }, [location.state])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  async function handleCompleteSession() {
    if (!todaySession || todaySession.type === 'rest' || sessionCompleted) return

    // If no rating shown yet, show rating first
    if (!showRating) {
      setShowRating(true)
      return
    }

    setIsCompleting(true)

    if (plan.id && plan.userId) {
      const { error } = await completeSession(
        plan.userId,
        plan.id,
        currentWeek,
        todaySession.day,
        todaySession.type,
        difficultyRating
      )

      if (error) {
        console.error('Error completing session:', error)
        setIsCompleting(false)
        return
      }

      // Refresh completed sessions
      const { data: sessions } = await getCompletedSessions(plan.userId, plan.id)
      if (sessions) setCompletedSessions(sessions)
    } else {
      // Offline/temp mode: track locally
      setCompletedSessions(prev => [...prev, {
        week: currentWeek,
        day: todaySession.day,
        session_type: todaySession.type,
        completed: true,
        completed_at: new Date().toISOString(),
        difficulty_rating: difficultyRating
      }])
    }

    setSessionCompleted(true)
    setIsCompleting(false)
    setShowRating(false)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Cargando tu plan...</p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // NO PLAN STATE
  // ============================================================================

  if (!plan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-elevated border border-border p-8 text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-black mb-2">
            Aún no has completado tu evaluación
          </h2>
          <p className="text-muted mb-6">
            Para crear tu plan personalizado de 12 semanas, necesitas completar las 7 pruebas de evaluación inicial.
            Solo te tomará 15-20 minutos.
          </p>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/assessment')}
          >
            Empezar evaluación
          </Button>

          <p className="text-xs text-muted mt-4">
            El Pre-Running System reduce la tasa de lesiones del 70% al 5-10%
          </p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // DASHBOARD WITH PLAN
  // ============================================================================

  const currentPhase = getCurrentPhase(currentWeek, plan)
  const progressPercent = Math.round((currentWeek / plan.totalWeeks) * 100)
  const totalTrainingSessions = countTotalTrainingSessions(weeklyPlan)
  const completedCount = completedSessions.length
  const { currentStreak, longestStreak } = calculateStreak(completedSessions)

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <section className="bg-black px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Mi programa Pre-Running
          </h1>
          <p className="text-white/60 text-center mb-6">
            Fase {currentPhase} — Semana {currentWeek} de {plan.totalWeeks}
          </p>

          {/* Stats bar */}
          <StatsBar
            completedCount={completedCount}
            totalSessions={totalTrainingSessions}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          {/* Progress bar */}
          <div className="bg-white/10 rounded-2xl p-4 mt-4">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Progreso del programa</span>
              <span className="font-semibold text-accent-orange">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent-orange to-accent-pink h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>Semana {currentWeek}</span>
              <span>Semana {plan.totalWeeks}</span>
            </div>

            {/* Session progress bar */}
            {totalTrainingSessions > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                  <span>Sesiones</span>
                  <span>{completedCount} de {totalTrainingSessions}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent-orange h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((completedCount / totalTrainingSessions) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCION 1: ESTADO ACTUAL */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Estado actual</h2>

          <div className="bg-white rounded-2xl shadow-card border border-border p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted mb-1">Fase</div>
                <div className="text-lg font-semibold text-black">{currentPhase}</div>
              </div>
              <div>
                <div className="text-sm text-muted mb-1">Semana</div>
                <div className="text-lg font-semibold text-black">
                  {currentWeek} de {plan.totalWeeks}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted mb-1">Progreso</div>
                <div className="text-lg font-semibold bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">{progressPercent}%</div>
              </div>
              <div>
                <div className="text-sm text-muted mb-1">Estado</div>
                <StatusBadge status={plan.status || 'active'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RE-EVALUATION PROMPT (weeks 4 and 8) */}
      {(currentWeek === 4 || currentWeek === 8) && (
        <section className="px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-accent-orange/10 to-accent-pink/10 border-2 border-accent-orange/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-orange/20 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-accent-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black">
                    Es hora de re-evaluar tu progreso
                  </h3>
                  <p className="text-muted text-sm mt-1">
                    Semana {currentWeek}: repite las pruebas para ver cuánto has mejorado.
                    Compararemos tus resultados con la evaluación inicial.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    className="mt-4"
                    onClick={() => navigate('/assessment', { state: { isReEvaluation: true, previousPlan: plan } })}
                  >
                    Repetir evaluación
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCION 2: MIS PRIORIDADES */}
      <section className="bg-surface px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Mis prioridades</h2>

          {plan.priorities && plan.priorities.length > 0 ? (
            <div className="space-y-3">
              {plan.priorities.map((priority, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-card border border-border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-muted">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-black">{priority.area}</div>
                      <div className="text-sm text-muted mt-0.5">
                        {priority.weeklyMinutes} min/semana
                      </div>
                    </div>
                  </div>
                  <SeverityBadge severity={priority.severity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <p className="text-green-700">
                No tienes prioridades pendientes. ¡Excelente trabajo!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECCION 3: SESION DE HOY */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">Sesión de hoy</h2>

          {todaySession ? (
            <div className="bg-white rounded-2xl shadow-card border border-border p-6">
              <h3 className="text-xl font-bold mb-4">
                {DAY_NAMES[todaySession.day] || todaySession.day}
              </h3>

              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-black text-white rounded-full text-sm font-semibold">
                  {SESSION_TYPE_NAMES[todaySession.type] || todaySession.type}
                </span>
                <span className="ml-3 text-muted">
                  {todaySession.duration} minutos
                </span>
              </div>

              {todaySession.type === 'rest' ? (
                <p className="text-muted">
                  Día de descanso. Tu cuerpo necesita recuperar para adaptarse.
                </p>
              ) : todaySession.type === 'running' ? (
                <div className="bg-accent-orange/5 border border-accent-orange/20 rounded-xl p-4">
                  <p className="font-semibold text-black mb-2">
                    Running Intervals
                  </p>
                  <p className="text-muted">
                    {todaySession.notes || 'Consulta tu plan para más detalles'}
                  </p>
                </div>
              ) : todaySession.type === 'assessment' ? (
                <div className="bg-surface border border-border rounded-xl p-4">
                  <p className="font-semibold text-black mb-2">
                    Evaluación
                  </p>
                  <p className="text-muted">
                    {todaySession.notes || 'Completa los tests de evaluación'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaySession.exercises && todaySession.exercises.length > 0 ? (
                    todaySession.exercises.map((ex, idx) => {
                      const exercise = exercisesData[ex.exerciseId]
                      if (!exercise) {
                        return (
                          <div key={idx} className="border-l-4 border-border pl-4 py-2 bg-surface rounded-lg">
                            <p className="font-semibold text-muted">{ex.exerciseId}</p>
                            <p className="text-sm text-muted">
                              {ex.sets} series x {ex.reps || `${ex.holdSeconds}seg hold`}
                            </p>
                          </div>
                        )
                      }

                      return (
                        <div key={idx} className="border-l-4 border-accent-orange pl-4 py-2 bg-surface rounded-lg">
                          <p className="font-semibold text-black">{exercise.name_es}</p>
                          <p className="text-sm text-muted">
                            {ex.sets} series x {ex.reps ? `${ex.reps} reps` : `${ex.holdSeconds}seg hold`}
                          </p>
                          {ex.notes && (
                            <p className="text-xs text-muted mt-1">{ex.notes}</p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-muted text-sm">
                      {todaySession.notes || 'No hay ejercicios específicos para esta sesión'}
                    </p>
                  )}
                </div>
              )}

              {/* Complete session button / rating / completed state */}
              {todaySession.type !== 'rest' && (
                <div className="mt-6">
                  {sessionCompleted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <p className="text-green-700 font-semibold">Sesión completada</p>
                      <p className="text-green-600 text-sm mt-1">
                        {completedCount} de {totalTrainingSessions} sesiones totales
                      </p>
                    </div>
                  ) : showRating ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-black mb-2">
                          ¿Cómo de difícil fue la sesión? (1 = fácil, 5 = muy difícil)
                        </p>
                        <DifficultyRating value={difficultyRating} onChange={setDifficultyRating} />
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-accent-orange to-accent-pink text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                        onClick={handleCompleteSession}
                        disabled={isCompleting}
                      >
                        {isCompleting ? 'Guardando...' : 'Confirmar sesión completada'}
                      </button>
                      <button
                        className="w-full text-muted text-sm hover:text-black transition-colors"
                        onClick={() => setShowRating(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full bg-gradient-to-r from-accent-orange to-accent-pink text-white py-3 rounded-xl font-semibold hover:scale-[1.01] transition-all duration-300"
                      onClick={handleCompleteSession}
                    >
                      Marcar como completada
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border p-6">
              <p className="text-muted text-center">
                No hay sesión programada para hoy o es día de descanso.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECCION 4: SEMANA ACTUAL */}
      {weeklyPlan && (
        <section className="bg-surface px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-4">
              Semana {currentWeek}
            </h2>

            <div className="space-y-2">
              {weeklyPlan.weeks.find(w => w.weekNumber === currentWeek)?.sessions.map((session, idx) => {
                const isToday = session.day === getTodayDayKey()
                const isCompleted = completedSessions.some(
                  s => s.week === currentWeek && s.day === session.day
                )

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isToday
                        ? 'border-accent-orange bg-accent-orange/5'
                        : 'border-border bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : session.type === 'rest'
                          ? 'bg-surface text-muted'
                          : 'bg-surface text-black'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          DAY_NAMES[session.day]?.charAt(0) || '?'
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${isToday ? 'text-accent-orange' : 'text-black'}`}>
                          {DAY_NAMES[session.day]}
                          {isToday && <span className="ml-2 text-xs font-normal text-accent-orange">(hoy)</span>}
                        </div>
                        <div className="text-xs text-muted">
                          {SESSION_TYPE_NAMES[session.type] || session.type}
                          {session.duration > 0 && ` — ${session.duration} min`}
                        </div>
                      </div>
                    </div>

                    {isCompleted && (
                      <span className="text-xs text-green-600 font-medium">Completada</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECCION 5: ACCIONES */}
      <section className="px-4 py-8 md:py-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/results', { state: { plan } })}
            >
              Ver plan completo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/assessment')}
            >
              Repetir evaluación
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
