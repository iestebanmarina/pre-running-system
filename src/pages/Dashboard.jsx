import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserPlan } from '../lib/supabaseHelpers'
import Button from '../components/ui/Button'

// ============================================================================
// CONSTANTS — Reutilizados de Results.jsx
// ============================================================================

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

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-gray-100 text-gray-600'
}

const STATUS_LABELS = {
  active: 'Activo',
  completed: 'Completado',
  abandoned: 'Abandonado'
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

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Determina la fase actual según la semana del programa
 * @param {number} currentWeek - Semana actual (1-based)
 * @param {Object} plan - Plan con phase_1_duration, phase_2_duration
 * @returns {string} - "Evaluación" | "Fundamentos" | "Transición Running"
 */
function getCurrentPhase(currentWeek, plan) {
  const phase1End = plan.phase_1_duration
  const phase2End = plan.phase_1_duration + plan.phase_2_duration

  if (currentWeek <= phase1End) {
    return 'Evaluación'
  } else if (currentWeek <= phase2End) {
    return 'Fundamentos'
  } else {
    return 'Transición Running'
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    async function loadUserPlan() {
      setIsLoading(true)

      // TODO: Replace with actual user ID from auth context
      const userId = 'TEMP_USER_ID'

      const { data, error } = await getUserPlan(userId)

      if (error) {
        console.error('Error loading plan:', error)
        // Asumir que no hay plan si hay error
        setPlan(null)
      } else {
        setPlan(data) // Puede ser null si no hay plan activo
      }

      setIsLoading(false)
    }

    loadUserPlan()
  }, [])

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu plan...</p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // NO PLAN STATE
  // ============================================================================

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Aún no has completado tu evaluación
          </h2>
          <p className="text-gray-600 mb-6">
            Para crear tu plan personalizado de 12 semanas, necesitas completar las 7 pruebas de evaluación inicial.
            Solo te tomará 15-20 minutos.
          </p>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/assessment')}
          >
            Empezar Evaluación
          </Button>

          {/* Info */}
          <p className="text-xs text-gray-500 mt-4">
            El Pre-Running System reduce la tasa de lesiones del 70% al 5-10%
          </p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // DASHBOARD WITH PLAN
  // ============================================================================

  const currentWeek = 1 // TODO: En Fase 2 será plan.current_week
  const currentPhase = getCurrentPhase(currentWeek, plan)
  const progressPercent = Math.round((currentWeek / plan.total_weeks) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}
      <section className="bg-blue-50 px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Mi Programa Pre-Running
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Fase {currentPhase} — Semana {currentWeek} de {plan.total_weeks}
          </p>

          {/* Progress bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progreso del programa</span>
              <span className="font-semibold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Semana {currentWeek}</span>
              <span>Semana {plan.total_weeks}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECCIÓN 1: ESTADO ACTUAL */}
      {/* ================================================================ */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Estado Actual</h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fase actual */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Fase</div>
                <div className="text-lg font-semibold text-gray-900">{currentPhase}</div>
              </div>

              {/* Semana actual */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Semana</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentWeek} de {plan.total_weeks}
                </div>
              </div>

              {/* Progreso */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Progreso</div>
                <div className="text-lg font-semibold text-blue-600">{progressPercent}%</div>
              </div>

              {/* Estado */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Estado</div>
                <StatusBadge status={plan.status} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECCIÓN 2: MIS PRIORIDADES */}
      {/* ================================================================ */}
      <section className="bg-gray-100 px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Mis Prioridades</h2>

          {plan.priorities && plan.priorities.length > 0 ? (
            <div className="space-y-3">
              {plan.priorities.map((priority, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-gray-400">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{priority.area}</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {priority.weeklyMinutes} min/semana
                      </div>
                    </div>
                  </div>
                  <SeverityBadge severity={priority.severity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700">
                No tienes prioridades pendientes. ¡Excelente trabajo!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECCIÓN 3: PRÓXIMOS PASOS (Placeholder) */}
      {/* ================================================================ */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Próximos Pasos</h2>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h3 className="font-semibold text-blue-900 text-lg mb-2">
              Contenido en desarrollo — Fase 2
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Aquí verás:
            </p>
            <ul className="text-blue-700 text-sm space-y-1 max-w-xs mx-auto">
              <li>✓ Ejercicios de hoy</li>
              <li>✓ Progreso semanal</li>
              <li>✓ Re-tests programados</li>
              <li>✓ Historial de sesiones</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECCIÓN 4: ACCIONES */}
      {/* ================================================================ */}
      <section className="px-4 py-8 md:py-12 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/results', { state: { plan } })}
            >
              Ver Plan Completo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/assessment')}
            >
              Repetir Evaluación
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
