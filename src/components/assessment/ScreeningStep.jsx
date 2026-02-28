import { useState } from 'react'
import Button from '../ui/Button'

const PAIN_LOCATIONS = [
  { id: 'knee', label: 'Rodilla' },
  { id: 'ankle', label: 'Tobillo' },
  { id: 'hip', label: 'Cadera' },
  { id: 'lower_back', label: 'Zona lumbar' },
  { id: 'shin', label: 'Espinilla' },
  { id: 'foot', label: 'Pie / planta' }
]

const INJURY_LOCATIONS = [
  { id: 'knee_injury', label: 'Rodilla' },
  { id: 'ankle_injury', label: 'Tobillo' },
  { id: 'hip_injury', label: 'Cadera' },
  { id: 'back_injury', label: 'Espalda' },
  { id: 'muscle_injury', label: 'Muscular (desgarro, rotura)' }
]

const SITTING_OPTIONS = [
  { value: 'less_4', label: 'Menos de 4 horas' },
  { value: '4_6', label: '4-6 horas' },
  { value: '6_8', label: '6-8 horas' },
  { value: 'more_8', label: 'Más de 8 horas' }
]

const RUNNING_HISTORY_OPTIONS = [
  { value: 'never', label: 'Nunca he corrido regularmente' },
  { value: 'long_ago', label: 'Hace más de 2 años' },
  { value: 'recent', label: 'En los últimos 2 años' },
  { value: 'current', label: 'Corro actualmente (poco)' }
]

export default function ScreeningStep({ onComplete, initialData = {} }) {
  const [hasPain, setHasPain] = useState(initialData.screening_has_pain ?? null)
  const [painLocations, setPainLocations] = useState(initialData.screening_pain_locations || [])
  const [hasInjuries, setHasInjuries] = useState(initialData.screening_has_injuries ?? null)
  const [injuryLocations, setInjuryLocations] = useState(initialData.screening_injury_locations || [])
  const [sittingHours, setSittingHours] = useState(initialData.screening_sitting_hours || '')
  const [runningHistory, setRunningHistory] = useState(initialData.screening_running_history || '')

  const togglePainLocation = (id) => {
    setPainLocations(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  const toggleInjuryLocation = (id) => {
    setInjuryLocations(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    )
  }

  const isValid = hasPain !== null && hasInjuries !== null && sittingHours && runningHistory

  const handleSubmit = () => {
    if (!isValid) return

    onComplete({
      screening_has_pain: hasPain,
      screening_pain_locations: hasPain ? painLocations : [],
      screening_has_injuries: hasInjuries,
      screening_injury_locations: hasInjuries ? injuryLocations : [],
      screening_sitting_hours: sittingHours,
      screening_running_history: runningHistory
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black">Antes de empezar</h2>
        <p className="text-muted mt-2">
          Estas preguntas nos ayudan a personalizar tu plan y evitar ejercicios que puedan ser contraproducentes.
        </p>
      </div>

      {/* Pain screening */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-3">
          ¿Tienes dolor actualmente en piernas o espalda?
        </h3>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setHasPain(true)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              hasPain === true
                ? 'bg-accent-pink/10 text-accent-pink border-2 border-accent-pink'
                : 'bg-surface text-muted border-2 border-transparent hover:border-border'
            }`}
          >
            Sí
          </button>
          <button
            onClick={() => { setHasPain(false); setPainLocations([]) }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              hasPain === false
                ? 'bg-green-50 text-green-700 border-2 border-green-300'
                : 'bg-surface text-muted border-2 border-transparent hover:border-border'
            }`}
          >
            No
          </button>
        </div>

        {hasPain && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-2">¿Dónde sientes dolor?</p>
            <div className="flex flex-wrap gap-2">
              {PAIN_LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => togglePainLocation(loc.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    painLocations.includes(loc.id)
                      ? 'bg-accent-pink/10 text-accent-pink border border-accent-pink'
                      : 'bg-surface text-muted border border-border hover:border-accent-pink/30'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-accent-pink mt-2">
              Los ejercicios que afecten estas zonas se adaptarán o sustituirán en tu plan.
            </p>
          </div>
        )}
      </div>

      {/* Injury history */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-3">
          ¿Has tenido lesiones previas en piernas o espalda?
        </h3>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setHasInjuries(true)}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              hasInjuries === true
                ? 'bg-accent-orange/10 text-accent-orange border-2 border-accent-orange'
                : 'bg-surface text-muted border-2 border-transparent hover:border-border'
            }`}
          >
            Sí
          </button>
          <button
            onClick={() => { setHasInjuries(false); setInjuryLocations([]) }}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              hasInjuries === false
                ? 'bg-green-50 text-green-700 border-2 border-green-300'
                : 'bg-surface text-muted border-2 border-transparent hover:border-border'
            }`}
          >
            No
          </button>
        </div>

        {hasInjuries && (
          <div className="space-y-2">
            <p className="text-sm text-muted mb-2">¿En qué zona?</p>
            <div className="flex flex-wrap gap-2">
              {INJURY_LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => toggleInjuryLocation(loc.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    injuryLocations.includes(loc.id)
                      ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange'
                      : 'bg-surface text-muted border border-border hover:border-accent-orange/30'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sitting hours */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-3">
          ¿Cuántas horas al día pasas sentado/a?
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {SITTING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSittingHours(opt.value)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                sittingHours === opt.value
                  ? 'bg-black text-white'
                  : 'bg-surface text-muted hover:bg-border'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Running history */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-semibold text-black mb-3">
          ¿Has corrido antes?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RUNNING_HISTORY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRunningHistory(opt.value)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left ${
                runningHistory === opt.value
                  ? 'bg-black text-white'
                  : 'bg-surface text-muted hover:bg-border'
              }`}
            >
              {opt.label}
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
