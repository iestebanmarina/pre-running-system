import { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '../ui/Input'
import Button from '../ui/Button'

const BalanceTest = ({ onComplete, initialData = {} }) => {
  const [balanceRight, setBalanceRight] = useState(initialData.balance_right || '')
  const [balanceLeft, setBalanceLeft] = useState(initialData.balance_left || '')

  const getInterpretation = (value) => {
    const num = parseFloat(value)
    if (isNaN(num)) return null

    if (num >= 60) return { text: 'BUENO', color: 'text-green-600' }
    if (num >= 40 && num < 60) return { text: 'ACEPTABLE', color: 'text-yellow-600' }
    return { text: 'DÉFICIT ESTABILIDAD', color: 'text-red-600' }
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Test #7: Balance y Estabilidad
        </h2>
        <p className="text-gray-600">
          Evalúa tu equilibrio unipodal. Mantente sobre un pie con los ojos abiertos y
          cronometra cuánto tiempo puedes mantener el equilibrio sin apoyar el otro pie.
        </p>
      </div>

      <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">
          Video: Test de Equilibrio Unipodal (próximamente)
        </p>
      </div>

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
