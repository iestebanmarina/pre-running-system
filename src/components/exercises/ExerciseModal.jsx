import { useEffect } from 'react'
import PropTypes from 'prop-types'

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
    mobility: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-900' },
    activation: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900' },
    strength: { bg: 'bg-accent-pink/10', border: 'border-accent-pink', text: 'text-accent-pink' },
    capacity: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-900' }
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
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 ${colors.bg} border-b-4 ${colors.border} px-8 py-6`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 ${colors.bg} ${colors.text} border ${colors.border} rounded-full text-sm font-bold`}>
                  {categoryLabels[exercise.category] || exercise.category}
                </span>
                <span className="px-3 py-1 bg-white border border-border text-muted rounded-full text-sm">
                  {difficultyLabels[exercise.difficulty] || exercise.difficulty}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-black mb-1">
                {exercise.name_es}
              </h2>

              {exercise.name && (
                <p className="text-lg text-muted">
                  {exercise.name}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-black">{exercise.duration_minutes} min</span>
            </div>

            {exercise.sets_reps && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="font-medium text-black">{exercise.sets_reps}</span>
              </div>
            )}

            {exercise.hold_time && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-black">{exercise.hold_time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-8 py-6">
          {/* Descripción */}
          <div className="mb-8">
            <p className="text-lg text-muted leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Instrucciones */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-pink rounded-xl flex items-center justify-center text-white font-bold">
                  1
                </div>
                Instrucciones Paso a Paso
              </h3>
              <ol className="space-y-4">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-base text-black leading-relaxed pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Errores comunes */}
          {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-pink rounded-xl flex items-center justify-center text-white font-bold">
                  !
                </div>
                Errores Comunes a Evitar
              </h3>
              <div className="bg-red-50 border-l-4 border-accent-pink rounded-xl p-6">
                <ul className="space-y-3">
                  {exercise.common_mistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-accent-pink mt-1 flex-shrink-0">▸</span>
                      <span className="text-base text-red-900 leading-relaxed">
                        {mistake}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Equipamiento */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-orange rounded-xl flex items-center justify-center text-white font-bold">
                  #
                </div>
                Equipamiento Necesario
              </h3>
              <div className="bg-orange-50 border-l-4 border-accent-orange rounded-xl p-6">
                <ul className="space-y-2">
                  {exercise.equipment.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-accent-orange rounded-full flex-shrink-0"></span>
                      <span className="text-base text-orange-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Video placeholder */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-pink rounded-xl flex items-center justify-center text-white font-bold">
                ▶
              </div>
              Demostración en Video
            </h3>
            <div className="bg-surface rounded-2xl border border-border p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-muted text-lg">
                Video demostrativo próximamente
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-8 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gradient-to-r hover:from-accent-orange hover:to-accent-pink transition-all"
          >
            Cerrar
          </button>
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
