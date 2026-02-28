import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import TestInstructions from './TestInstructions'

const GluteActivationTest = ({ onComplete, initialData = {} }) => {
  const [rightGlute, setRightGlute] = useState(initialData.glute_activation_right || null)
  const [leftGlute, setLeftGlute] = useState(initialData.glute_activation_left || null)

  // Glute activation options
  const options = [
    {
      label: 'Glúteo primero',
      value: 'glute_first',
      description: 'El glúteo se contrae antes que los isquiotibiales'
    },
    {
      label: 'Simultáneo',
      value: 'simultaneous',
      description: 'Glúteo e isquiotibiales se contraen al mismo tiempo'
    },
    {
      label: 'Isquiotibiales primero',
      value: 'hamstrings_first',
      description: 'Los isquiotibiales se contraen antes que el glúteo'
    }
  ]

  // Interpretation function
  const getInterpretation = (value) => {
    if (!value) return null

    switch (value) {
      case 'glute_first':
        return { text: 'CORRECTO', color: 'text-green-600' }
      case 'simultaneous':
        return { text: 'ACEPTABLE', color: 'text-yellow-600' }
      case 'hamstrings_first':
        return { text: 'COMPENSACIÓN', color: 'text-red-600' }
      default:
        return null
    }
  }

  const isFormValid = rightGlute !== null && leftGlute !== null

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({
        glute_activation_right: rightGlute,
        glute_activation_left: leftGlute
      })
    }
  }

  const rightInterpretation = getInterpretation(rightGlute)
  const leftInterpretation = getInterpretation(leftGlute)

  // Reusable selector component
  const GluteSelector = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-black mb-3">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ${
              value === option.value
                ? 'border-accent-orange bg-[#FFF5F0]'
                : 'border-border hover:border-muted'
            }`}
          >
            <div className="font-medium text-black">{option.label}</div>
            <div className="text-sm text-muted mt-1">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">
          Test #3: Activación del glúteo
        </h2>
        <p className="text-muted">
          Evalúa el patrón de activación muscular durante el puente. Observa qué músculo
          se contrae primero al elevar la cadera: glúteo o isquiotibiales.
        </p>
      </div>

      <TestInstructions
        illustrationText="Posición de puente: boca arriba, caderas elevadas, manos palpando glúteo e isquiotibiales"
        steps={[
          'Acuéstate boca arriba con rodillas flexionadas',
          'Pies apoyados en el suelo a la anchura de caderas',
          'Coloca una mano en tu glúteo derecho y otra en isquiotibiales (parte trasera del muslo)',
          'Levanta la cadera hacia arriba haciendo un puente',
          '¿Qué músculo sientes que se ACTIVA PRIMERO? ¿Tu glúteo (nalga)? ¿Ambos al mismo tiempo? ¿Tus isquiotibiales (detrás del muslo)?',
          'Baja y repite 3 veces para confirmar',
          'Repite con atención en el lado izquierdo'
        ]}
        tips={[
          'Ve despacio para sentir qué se activa primero',
          'Es normal sentir ambos músculos, ¿pero cuál primero?',
          'Repite 3 veces para estar seguro'
        ]}
        warnings={[
          'Ir muy rápido (no sentirás qué se activa primero)',
          'Palpar en el lugar equivocado',
          'Confundir isquiotibiales con glúteo'
        ]}
      />

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Glute */}
        <div className="space-y-2">
          <GluteSelector
            value={rightGlute}
            onChange={setRightGlute}
            label="Glúteo derecho"
          />
          {rightInterpretation && (
            <p className={`text-sm font-medium ${rightInterpretation.color}`}>
              {rightInterpretation.text}
            </p>
          )}
        </div>

        {/* Left Glute */}
        <div className="space-y-2">
          <GluteSelector
            value={leftGlute}
            onChange={setLeftGlute}
            label="Glúteo izquierdo"
          />
          {leftInterpretation && (
            <p className={`text-sm font-medium ${leftInterpretation.color}`}>
              {leftInterpretation.text}
            </p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}

GluteActivationTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    glute_activation_right: PropTypes.string,
    glute_activation_left: PropTypes.string
  })
}

export default GluteActivationTest
