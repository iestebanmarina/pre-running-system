import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import TestInstructions from './TestInstructions'

const PosteriorChainTest = ({ onComplete, initialData = {} }) => {
  const [flexibility, setFlexibility] = useState(initialData.posterior_chain_flexibility || null)

  const options = [
    { label: 'Dedos de los pies', value: 'toes', description: 'Puedo tocar los dedos de mis pies' },
    { label: 'Espinillas', value: 'shins', description: 'Llego hasta las espinillas' },
    { label: 'Rodillas', value: 'knees', description: 'Llego hasta las rodillas' },
    { label: 'Muslos', value: 'thighs', description: 'Solo llego a los muslos' }
  ]

  const getInterpretation = (value) => {
    if (!value) return null

    switch (value) {
      case 'toes': return { text: 'FLEXIBLE', color: 'text-green-600' }
      case 'shins': return { text: 'MODERADAMENTE RIGIDO', color: 'text-yellow-600' }
      case 'knees': return { text: 'RÍGIDO', color: 'text-red-600' }
      case 'thighs': return { text: 'MUY RÍGIDO', color: 'text-red-600' }
      default: return null
    }
  }

  const isFormValid = flexibility !== null

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({ posterior_chain_flexibility: flexibility })
    }
  }

  const interpretation = getInterpretation(flexibility)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">
          Test #5: Flexibilidad de cadena posterior
        </h2>
        <p className="text-muted">
          Evalúa la flexibilidad de tu cadena posterior con el test de toe touch. De pie con
          piernas rectas, intenta tocar el suelo y registra hasta dónde llegas.
        </p>
      </div>

      <TestInstructions
        illustrationText="De pie, inclinado hacia adelante con piernas rectas intentando tocar el suelo"
        steps={[
          'Párate descalzo con pies juntos',
          'Piernas completamente rectas (rodillas no dobladas)',
          'Inclínate hacia delante dejando los brazos colgar',
          'Intenta tocar el suelo con las manos',
          'NO fuerces, solo ve hasta donde llegues cómodamente',
          '¿Hasta dónde llegan tus dedos? ¿Tocas los dedos de los pies o más allá? ¿Llegas a tus espinillas? ¿Solo a tus rodillas? ¿Te quedas en los muslos?'
        ]}
        tips={[
          'Rodillas SIEMPRE rectas (sin trampa)',
          'Relájate y respira profundo',
          'No rebotes, solo mantén la posición'
        ]}
        warnings={[
          'Doblar las rodillas (invalida el test)',
          'Forzar con dolor (solo llega cómodo)',
          'Compararte con otros (cada cuerpo es diferente)'
        ]}
      />

      <div className="max-w-md space-y-2">
        <label className="block text-sm font-medium text-black mb-3">
          ¿Hasta dónde llegas? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFlexibility(option.value)}
              className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ${
                flexibility === option.value
                  ? 'border-accent-orange bg-[#FFF5F0]'
                  : 'border-border hover:border-muted'
              }`}
            >
              <div className="font-medium text-black">{option.label}</div>
              <div className="text-sm text-muted mt-1">{option.description}</div>
            </button>
          ))}
        </div>
        {interpretation && (
          <p className={`text-sm font-medium mt-3 ${interpretation.color}`}>
            {interpretation.text}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!isFormValid}>
          Continuar
        </Button>
      </div>
    </div>
  )
}

PosteriorChainTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    posterior_chain_flexibility: PropTypes.string
  })
}

export default PosteriorChainTest
