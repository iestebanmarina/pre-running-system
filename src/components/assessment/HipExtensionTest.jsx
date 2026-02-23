import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../ui/Button'
import TestInstructions from './TestInstructions'

const HipExtensionTest = ({ onComplete, initialData = {} }) => {
  const [rightHip, setRightHip] = useState(initialData.hip_extension_right ?? null)
  const [leftHip, setLeftHip] = useState(initialData.hip_extension_left ?? null)

  // Hip extension options (visual descriptors mapped to degrees)
  const options = [
    { label: 'Muslo elevado', value: -10, description: 'Por encima de la horizontal' },
    { label: 'Muslo horizontal', value: 0, description: 'En linea con el cuerpo' },
    { label: 'Muslo bajo horizontal', value: 15, description: 'Por debajo de la horizontal' }
  ]

  // Interpretation function
  const getInterpretation = (value) => {
    if (value === null) return null

    if (value < -5) {
      return { text: 'LIMITACION SEVERA', color: 'text-red-600' }
    } else if (value >= -5 && value < 0) {
      return { text: 'LIMITACION MODERADA', color: 'text-yellow-600' }
    } else if (value === 0) {
      return { text: 'NEUTRAL', color: 'text-yellow-600' }
    } else {
      return { text: 'OPTIMO', color: 'text-green-600' }
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
          Test #2: Extension de Cadera
        </h2>
        <p className="text-muted">
          Evalua el rango de extension de cadera con el test de Thomas. Observa la posicion
          del muslo cuando la rodilla opuesta esta flexionada contra el pecho.
        </p>
      </div>

      <TestInstructions
        illustrationText="Acostado boca arriba en el borde de una mesa, pierna colgando"
        steps={[
          'Acuestate boca arriba en el borde de una cama o mesa',
          'Deja que la pierna derecha cuelgue fuera del borde',
          'Abraza tu rodilla izquierda contra tu pecho',
          'Relaja la pierna derecha completamente',
          'Observa la posicion del muslo derecho: esta ELEVADO (por encima de horizontal)? HORIZONTAL (paralelo al suelo)? BAJO (cae por debajo de horizontal)?',
          'Repite con la otra pierna'
        ]}
        tips={[
          'Usa una mesa o cama a la altura de tu cadera',
          'Relaja completamente la pierna que cuelga',
          'Pide a alguien que observe desde el lado si es posible'
        ]}
        warnings={[
          'Tensar la pierna (debe estar relajada)',
          'No abrazar bien la rodilla opuesta (afecta la medicion)',
          'Mesa muy alta o muy baja'
        ]}
      />

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
