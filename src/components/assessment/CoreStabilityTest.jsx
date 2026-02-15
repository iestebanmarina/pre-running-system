import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../ui/Input'
import Button from '../ui/Button'

const CoreStabilityTest = ({ onComplete, initialData = {} }) => {
  const [plankTime, setPlankTime] = useState(initialData.core_plank_time || '')

  const getInterpretation = (value) => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (num < 30) return { text: 'DEBILIDAD SEVERA', color: 'text-red-600' }
    if (num >= 30 && num < 60) return { text: 'ACEPTABLE', color: 'text-yellow-600' }
    if (num >= 60 && num < 90) return { text: 'BUENO', color: 'text-green-600' }
    return { text: 'EXCELENTE', color: 'text-blue-600' }
  }

  const isValid = (value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 5 && num <= 300
  }

  const isFormValid = isValid(plankTime)

  const getError = () => {
    if (!plankTime) return ''
    return !isValid(plankTime) ? 'Valor debe estar entre 5 y 300 segundos' : ''
  }

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({ core_plank_time: parseFloat(plankTime) })
    }
  }

  const interpretation = getInterpretation(plankTime)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test #4: Estabilidad del Core
        </h2>
        <p className="text-gray-600">
          Mide la resistencia del core con la plancha. Cronometra cuánto tiempo puedes mantener
          una plancha perfecta con forma correcta antes de perder la alineación.
        </p>
      </div>

      <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">
          Video: Plancha Correcta (próximamente)
        </p>
      </div>

      <div className="max-w-md space-y-2">
        <Input
          label="Tiempo en Plancha (segundos)"
          type="number"
          value={plankTime}
          onChange={(e) => setPlankTime(e.target.value)}
          placeholder="Ej: 45"
          error={getError()}
          required
        />
        {interpretation && !getError() && (
          <p className={`text-sm font-medium ${interpretation.color}`}>
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

CoreStabilityTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    core_plank_time: PropTypes.number
  })
}

export default CoreStabilityTest
