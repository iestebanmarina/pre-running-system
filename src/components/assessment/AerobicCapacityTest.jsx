import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import TestInstructions from './TestInstructions'

const AerobicCapacityTest = ({ onComplete, initialData = {} }) => {
  const [capacity, setCapacity] = useState(initialData.aerobic_capacity || null)

  const options = [
    {
      label: '45 minutos cómodo',
      value: '45min_easy',
      description: 'Puedo caminar 45 minutos sin fatigarme'
    },
    {
      label: '30-45 minutos con fatiga leve',
      value: '30-45min_mild',
      description: 'Entre 30-45 min, siento fatiga leve'
    },
    {
      label: 'Menos de 30 minutos con fatiga alta',
      value: 'under_30min_hard',
      description: 'Me canso mucho en menos de 30 minutos'
    }
  ]

  const getInterpretation = (value) => {
    if (!value) return null

    switch (value) {
      case '45min_easy': return { text: 'LISTO', color: 'text-green-600' }
      case '30-45min_mild': return { text: 'ACEPTABLE', color: 'text-yellow-600' }
      case 'under_30min_hard': return { text: 'CAPACIDAD INSUFICIENTE', color: 'text-red-600' }
      default: return null
    }
  }

  const isFormValid = capacity !== null

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({ aerobic_capacity: capacity })
    }
  }

  const interpretation = getInterpretation(capacity)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">
          Test #6: Capacidad aeróbica
        </h2>
        <p className="text-muted">
          Evalúa tu capacidad aeróbica base con el test de caminata de 45 minutos. Camina a
          paso constante y evalúa tu nivel de fatiga.
        </p>
      </div>

      <TestInstructions
        illustrationText="Persona caminando a paso activo durante 45 minutos"
        steps={[
          'Piensa en tu última caminata de 45 minutos (o haz una ahora)',
          'Ritmo: conversacional pero activo (no paseo, caminar con propósito)',
          'Evalúa cómo te sentiste al terminar',
          'Selecciona la opción que mejor describe tu experiencia'
        ]}
        tips={[
          'No corras, solo camina activamente',
          '"Conversacional" = puedes hablar pero no cantar',
          'Si no has caminado 45 min recientemente, hazlo para saber'
        ]}
        warnings={[
          'Confundir caminar con correr',
          'Ir demasiado despacio (paseo vs. caminata activa)',
          'No dar tiempo suficiente al test (menos de 30 min)'
        ]}
      />

      <div className="max-w-md space-y-2">
        <label className="block text-sm font-medium text-black mb-3">
          ¿Cómo te sientes durante una caminata? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCapacity(option.value)}
              className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ${
                capacity === option.value
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

AerobicCapacityTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    aerobic_capacity: PropTypes.string
  })
}

export default AerobicCapacityTest
