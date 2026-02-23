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
      label: 'Gluteo primero',
      value: 'glute_first',
      description: 'El gluteo se contrae antes que los isquiotibiales'
    },
    {
      label: 'Simultaneo',
      value: 'simultaneous',
      description: 'Gluteo e isquiotibiales se contraen al mismo tiempo'
    },
    {
      label: 'Isquiotibiales primero',
      value: 'hamstrings_first',
      description: 'Los isquiotibiales se contraen antes que el gluteo'
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
        return { text: 'COMPENSACION', color: 'text-red-600' }
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
          Test #3: Activacion del Gluteo
        </h2>
        <p className="text-muted">
          Evalua el patron de activacion muscular durante el puente. Observa que musculo
          se contrae primero al elevar la cadera: gluteo o isquiotibiales.
        </p>
      </div>

      <TestInstructions
        illustrationText="Posicion de puente: boca arriba, caderas elevadas, manos palpando gluteo e isquiotibiales"
        steps={[
          'Acuestate boca arriba con rodillas flexionadas',
          'Pies apoyados en el suelo a la anchura de caderas',
          'Coloca una mano en tu gluteo derecho y otra en isquiotibiales (parte trasera del muslo)',
          'Levanta la cadera hacia arriba haciendo un puente',
          'Que musculo sientes que se ACTIVA PRIMERO? Tu gluteo (nalga)? Ambos al mismo tiempo? Tus isquiotibiales (atras del muslo)?',
          'Baja y repite 3 veces para confirmar',
          'Repite con atencion en lado izquierdo'
        ]}
        tips={[
          'Ve despacio para sentir que se activa primero',
          'Es normal sentir ambos musculos, pero cual primero?',
          'Repite 3 veces para estar seguro'
        ]}
        warnings={[
          'Ir muy rapido (no sientes que activa primero)',
          'Palpar en el lugar equivocado',
          'Confundir isquiotibiales con gluteo'
        ]}
      />

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Glute */}
        <div className="space-y-2">
          <GluteSelector
            value={rightGlute}
            onChange={setRightGlute}
            label="Gluteo Derecho"
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
            label="Gluteo Izquierdo"
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
