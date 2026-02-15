import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test #6: Capacidad Aeróbica
        </h2>
        <p className="text-gray-600">
          Evalúa tu capacidad aeróbica base con el test de caminata de 45 minutos. Camina a
          paso constante y evalúa tu nivel de fatiga.
        </p>
      </div>

      <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">
          Video: Test de Caminata 45min (próximamente)
        </p>
      </div>

      <div className="max-w-md space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ¿Cómo te sientes durante una caminata? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCapacity(option.value)}
              className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                capacity === option.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
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
