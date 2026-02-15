import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Input from '../ui/Input'
import Button from '../ui/Button'

const AnkleROMTest = ({ onComplete, initialData = {} }) => {
  const [rightAnkle, setRightAnkle] = useState(initialData.ankle_rom_right || '')
  const [leftAnkle, setLeftAnkle] = useState(initialData.ankle_rom_left || '')

  // Interpretation function
  const getInterpretation = (value) => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (num < 10) {
      return { text: 'LIMITACIÓN SEVERA', color: 'text-red-600' }
    } else if (num >= 10 && num < 12) {
      return { text: 'LIMITACIÓN MODERADA', color: 'text-yellow-600' }
    } else if (num >= 12 && num <= 15) {
      return { text: 'ÓPTIMO', color: 'text-green-600' }
    } else {
      return { text: 'EXCELENTE', color: 'text-blue-600' }
    }
  }

  // Validation function
  const isValid = (value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 5 && num <= 20
  }

  // Check if both values are valid
  const isFormValid = isValid(rightAnkle) && isValid(leftAnkle)

  // Get error messages
  const getRightError = () => {
    if (!rightAnkle) return ''
    return !isValid(rightAnkle) ? 'Valor debe estar entre 5 y 20 cm' : ''
  }

  const getLeftError = () => {
    if (!leftAnkle) return ''
    return !isValid(leftAnkle) ? 'Valor debe estar entre 5 y 20 cm' : ''
  }

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({
        ankle_rom_right: parseFloat(rightAnkle),
        ankle_rom_left: parseFloat(leftAnkle)
      })
    }
  }

  const rightInterpretation = getInterpretation(rightAnkle)
  const leftInterpretation = getInterpretation(leftAnkle)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test #1: Rango de Movimiento del Tobillo
        </h2>
        <p className="text-gray-600">
          Mide la flexión dorsal del tobillo con el test de pared. Registra la distancia máxima
          desde la punta del pie hasta la pared manteniendo el talón en el suelo.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">
          Video: Test de Pared (próximamente)
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Ankle */}
        <div className="space-y-2">
          <Input
            label="Pie Derecho (cm)"
            type="number"
            value={rightAnkle}
            onChange={(e) => setRightAnkle(e.target.value)}
            placeholder="Ej: 12.5"
            error={getRightError()}
            required
          />
          {rightInterpretation && !getRightError() && (
            <p className={`text-sm font-medium ${rightInterpretation.color}`}>
              {rightInterpretation.text}
            </p>
          )}
        </div>

        {/* Left Ankle */}
        <div className="space-y-2">
          <Input
            label="Pie Izquierdo (cm)"
            type="number"
            value={leftAnkle}
            onChange={(e) => setLeftAnkle(e.target.value)}
            placeholder="Ej: 13.0"
            error={getLeftError()}
            required
          />
          {leftInterpretation && !getLeftError() && (
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

AnkleROMTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    ankle_rom_right: PropTypes.number,
    ankle_rom_left: PropTypes.number
  })
}

export default AnkleROMTest
