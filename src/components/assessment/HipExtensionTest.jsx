import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'

const HipExtensionTest = ({ onComplete, initialData = {} }) => {
  const [rightHip, setRightHip] = useState(initialData.hip_extension_right ?? null)
  const [leftHip, setLeftHip] = useState(initialData.hip_extension_left ?? null)

  // Hip extension options (visual descriptors mapped to degrees)
  const options = [
    { label: 'Muslo elevado', value: -10, description: 'Por encima de la horizontal' },
    { label: 'Muslo horizontal', value: 0, description: 'En línea con el cuerpo' },
    { label: 'Muslo bajo horizontal', value: 15, description: 'Por debajo de la horizontal' }
  ]

  // Interpretation function
  const getInterpretation = (value) => {
    if (value === null) return null

    if (value < -5) {
      return { text: 'LIMITACIÓN SEVERA', color: 'text-red-600' }
    } else if (value >= -5 && value < 0) {
      return { text: 'LIMITACIÓN MODERADA', color: 'text-yellow-600' }
    } else if (value === 0) {
      return { text: 'NEUTRAL', color: 'text-yellow-600' }
    } else {
      return { text: 'ÓPTIMO', color: 'text-green-600' }
    }
  }

  const isFormValid = rightHip !== null && leftHip !== null

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({
        hip_extension_right: rightHip,
        hip_extension_left: leftHip
      })
    }
  }

  const rightInterpretation = getInterpretation(rightHip)
  const leftInterpretation = getInterpretation(leftHip)

  // Reusable selector component
  const HipSelector = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
              value === option.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium text-gray-900">{option.label}</div>
            <div className="text-sm text-gray-600 mt-1">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test #2: Extensión de Cadera
        </h2>
        <p className="text-gray-600">
          Evalúa el rango de extensión de cadera con el test de Thomas. Observa la posición
          del muslo cuando la rodilla opuesta está flexionada contra el pecho.
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">
          Video: Test de Thomas (próximamente)
        </p>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Hip */}
        <div className="space-y-2">
          <HipSelector
            value={rightHip}
            onChange={setRightHip}
            label="Cadera Derecha"
          />
          {rightInterpretation && (
            <p className={`text-sm font-medium ${rightInterpretation.color}`}>
              {rightInterpretation.text}
            </p>
          )}
        </div>

        {/* Left Hip */}
        <div className="space-y-2">
          <HipSelector
            value={leftHip}
            onChange={setLeftHip}
            label="Cadera Izquierda"
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

HipExtensionTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    hip_extension_right: PropTypes.number,
    hip_extension_left: PropTypes.number
  })
}

export default HipExtensionTest
