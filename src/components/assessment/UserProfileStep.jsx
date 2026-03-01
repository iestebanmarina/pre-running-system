import { useState } from 'react'
import Button from '../ui/Button'

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Lun' },
  { id: 'tuesday', label: 'Mar' },
  { id: 'wednesday', label: 'Mié' },
  { id: 'thursday', label: 'Jue' },
  { id: 'friday', label: 'Vie' },
  { id: 'saturday', label: 'Sáb' },
  { id: 'sunday', label: 'Dom' }
]

const SESSION_DURATION_OPTIONS = [
  { value: 20, label: '20 min', description: 'Sesiones cortas, ideal si tienes poco tiempo' },
  { value: 35, label: '30-45 min', description: 'Duración recomendada para resultados óptimos' },
  { value: 60, label: '60 min', description: 'Sesiones completas con calentamiento y vuelta a la calma' }
]

const EQUIPMENT_OPTIONS = [
  { value: 'bodyweight', label: 'Solo cuerpo', description: 'Sin equipamiento. Ejercicios con peso corporal.' },
  { value: 'resistance_band', label: 'Bandas elásticas', description: 'Bandas de resistencia + peso corporal.' },
  { value: 'full_gym', label: 'Gym completo', description: 'Acceso a mancuernas, barras, máquinas.' }
]

export default function UserProfileStep({ onComplete, initialData = {} }) {
  const [availableDays, setAvailableDays] = useState(
    initialData.profile_available_days || ['monday', 'wednesday', 'friday', 'saturday']
  )
  const [sessionDuration, setSessionDuration] = useState(
    initialData.profile_session_duration || 35
  )
  const [equipment, setEquipment] = useState(
    initialData.profile_equipment || 'bodyweight'
  )

  const toggleDay = (dayId) => {
    setAvailableDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(d => d !== dayId)
      }
      return [...prev, dayId]
    })
  }

  const isValid = availableDays.length >= 3 && sessionDuration && equipment

  const handleSubmit = () => {
    if (!isValid) return

    onComplete({
      profile_available_days: availableDays,
      profile_session_duration: sessionDuration,
      profile_equipment: equipment
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black">Tu perfil de entrenamiento</h2>
        <p className="text-muted mt-2">
          Adaptamos el plan a tu disponibilidad y recursos para que sea realista y sostenible.
        </p>
      </div>

      {/* Available days */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-1">
          ¿Qué días puedes entrenar?
        </h3>
        <p className="text-sm text-muted mb-4">
          Selecciona al menos 3 días. Recomendamos 4-5 para mejores resultados.
        </p>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                availableDays.includes(day.id)
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'bg-surface text-muted hover:bg-border'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`text-sm font-medium ${
            availableDays.length >= 3 ? 'text-green-600' : 'text-accent-pink'
          }`}>
            {availableDays.length} días seleccionados
          </span>
          {availableDays.length < 3 && (
            <span className="text-xs text-accent-pink">(mínimo 3)</span>
          )}
          {availableDays.length >= 5 && (
            <span className="text-xs text-green-600">Ideal para progreso rápido</span>
          )}
        </div>
      </div>

      {/* Session duration */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-1">
          ¿Cuánto tiempo por sesión?
        </h3>
        <p className="text-sm text-muted mb-4">
          El plan ajustará la cantidad de ejercicios a tu tiempo disponible.
        </p>

        <div className="space-y-2">
          {SESSION_DURATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSessionDuration(opt.value)}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all ${
                sessionDuration === opt.value
                  ? 'bg-black text-white'
                  : 'bg-surface text-black hover:bg-border'
              }`}
            >
              <div>
                <span className="font-semibold">{opt.label}</span>
                <p className={`text-sm mt-0.5 ${
                  sessionDuration === opt.value ? 'text-white/70' : 'text-muted'
                }`}>
                  {opt.description}
                </p>
              </div>
              {opt.value === 35 && sessionDuration !== 35 && (
                <span className="text-xs bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full shrink-0 ml-2">
                  Recomendado
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-1">
          ¿A qué equipamiento tienes acceso?
        </h3>
        <p className="text-sm text-muted mb-4">
          Solo te asignaremos ejercicios que puedas hacer con tu equipamiento.
        </p>

        <div className="space-y-2">
          {EQUIPMENT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setEquipment(opt.value)}
              className={`w-full flex items-start p-4 rounded-xl text-left transition-all ${
                equipment === opt.value
                  ? 'bg-black text-white'
                  : 'bg-surface text-black hover:bg-border'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 shrink-0 flex items-center justify-center ${
                equipment === opt.value
                  ? 'border-white bg-white'
                  : 'border-border'
              }`}>
                {equipment === opt.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-black" />
                )}
              </div>
              <div>
                <span className="font-semibold">{opt.label}</span>
                <p className={`text-sm mt-0.5 ${
                  equipment === opt.value ? 'text-white/70' : 'text-muted'
                }`}>
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full sm:w-auto"
        >
          Continuar con la evaluación
        </Button>
      </div>
    </div>
  )
}
