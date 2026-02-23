import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../ui/Input'
import Button from '../ui/Button'
import TestInstructions from './TestInstructions'

const BalanceTest = ({ onComplete, initialData = {} }) => {
  const [balanceRight, setBalanceRight] = useState(initialData.balance_right || '')
  const [balanceLeft, setBalanceLeft] = useState(initialData.balance_left || '')

  const getInterpretation = (value) => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (num >= 60) return { text: 'BUENO', color: 'text-green-600' }
    if (num >= 40 && num < 60) return { text: 'ACEPTABLE', color: 'text-yellow-600' }
    return { text: 'DEFICIT ESTABILIDAD', color: 'text-red-600' }
  }

  const isValid = (value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 5 && num <= 300
  }

  const isFormValid = isValid(balanceRight) && isValid(balanceLeft)

  const getRightError = () => {
    if (!balanceRight) return ''
    return !isValid(balanceRight) ? 'Valor debe estar entre 5 y 300 segundos' : ''
  }

  const getLeftError = () => {
    if (!balanceLeft) return ''
    return !isValid(balanceLeft) ? 'Valor debe estar entre 5 y 300 segundos' : ''
  }

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete({
        balance_right: parseFloat(balanceRight),
        balance_left: parseFloat(balanceLeft)
      })
    }
  }

  const rightInterpretation = getInterpretation(balanceRight)
  const leftInterpretation = getInterpretation(balanceLeft)

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black mb-2">
          Test #7: Balance y Estabilidad
        </h2>
        <p className="text-muted">
          Evalua tu equilibrio unipodal. Mantente sobre un pie con los ojos abiertos y
          cronometra cuanto tiempo puedes mantener el equilibrio sin apoyar el otro pie.
        </p>
      </div>

      <TestInstructions
        illustrationText="De pie sobre una pierna, brazos a los lados, cronometro corriendo"
        steps={[
          'Parate descalzo sobre tu pierna derecha',
          'Flexiona ligeramente la rodilla de apoyo',
          'Levanta el pie izquierdo del suelo (no importa cuanto)',
          'Manten los brazos a los lados (no apoyes en nada)',
          'Cronometra cuanto tiempo aguantas SIN poner el otro pie en el suelo, tocar algo para equilibrarte, o mover el pie de apoyo',
          'Maximo 60 segundos por pierna',
          'Repite con pierna izquierda'
        ]}
        tips={[
          'Mira un punto fijo en la pared (ayuda al equilibrio)',
          'Esta bien tambalearse, cuenta mientras el pie no toque',
          'Haz 2-3 intentos y quedate con el mejor tiempo'
        ]}
        warnings={[
          'Apoyarse en algo (debe ser sin apoyo)',
          'Rodilla de apoyo completamente recta (flexiona ligeramente)',
          'Contar despues de tocar el suelo'
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Input
            label="Pie Derecho (segundos)"
            type="number"
            value={balanceRight}
            onChange={(e) => setBalanceRight(e.target.value)}
            placeholder="Ej: 55"
            error={getRightError()}
            required
          />
          {rightInterpretation && !getRightError() && (
            <p className={`text-sm font-medium ${rightInterpretation.color}`}>
              {rightInterpretation.text}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            label="Pie Izquierdo (segundos)"
            type="number"
            value={balanceLeft}
            onChange={(e) => setBalanceLeft(e.target.value)}
            placeholder="Ej: 60"
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

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!isFormValid}>
          Continuar
        </Button>
      </div>
    </div>
  )
}

BalanceTest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    balance_right: PropTypes.number,
    balance_left: PropTypes.number
  })
}

export default BalanceTest
