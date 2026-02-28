import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'

export default function ExerciseModal({ exercise, isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !exercise) return null

  const categoryColors = {
    mobility: { accent: 'border-accent-orange', badge: 'text-accent-orange border-accent-orange' },
    activation: { accent: 'border-accent-pink', badge: 'text-accent-pink border-accent-pink' },
    strength: { accent: 'border-black', badge: 'text-black border-black' },
    capacity: { accent: 'border-accent-orange', badge: 'text-accent-orange border-accent-orange' }
  }

  const categoryLabels = {
    mobility: 'Movilidad',
    activation: 'Activación',
    strength: 'Fuerza',
    capacity: 'Capacidad'
  }

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  }

  const colors = categoryColors[exercise.category] || categoryColors.mobility

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — white bg with category accent top stripe */}
        <div className={`sticky top-0 z-10 bg-white border-t-4 ${colors.accent} border-b border-border px-6 py-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 bg-white ${colors.badge} border rounded-full text-xs font-bold uppercase tracking-wide`}>
                  {categoryLabels[exercise.category] || exercise.category}
                </span>
                <span className="px-2.5 py-0.5 bg-white border border-border text-muted rounded-full text-xs">
                  {difficultyLabels[exercise.difficulty] || exercise.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-black mb-1">
                {exercise.name_es}
              </h2>

              {exercise.name && (
                <p className="text-sm text-muted">
                  {exercise.name}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-black">{exercise.duration_minutes} min</span>
            </div>

            {exercise.sets_reps && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium text-black">{exercise.sets_reps}</span>
              </div>
            )}

            {exercise.hold_time && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-black">{exercise.hold_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-6">
          {/* Descripción */}
          <div className="mb-6">
            <p className="text-base text-muted leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Instrucciones */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-black mb-3">
                Instrucciones paso a paso
              </h3>
              <ol className="space-y-2">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Errores comunes */}
          {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-black mb-3">
                Errores comunes a evitar
              </h3>
              <div className="bg-white border-l-4 border-accent-pink p-4 rounded-r-lg">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {exercise.common_mistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Equipamiento */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-black mb-3">
                Equipamiento necesario
              </h3>
              <div className="bg-white border-l-4 border-accent-orange p-4 rounded-r-lg">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {exercise.equipment.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Video placeholder */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">
              Demostración en video
            </h3>
            <div className="bg-surface rounded-2xl border border-border p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-muted text-base">
                Video demostrativo próximamente
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4">
          <Button variant="primary" size="lg" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

ExerciseModal.propTypes = {
  exercise: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}
