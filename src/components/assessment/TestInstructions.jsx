import PropTypes from 'prop-types'

const TestInstructions = ({ illustrationText, steps, tips, warnings }) => {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold text-black mb-4">
        Cómo hacer este test
      </h3>

      {/* Ilustracion visual */}
      <div className="bg-white rounded-xl p-6 mb-4 border border-border">
        <div className="text-center">
          <p className="text-sm text-muted">{illustrationText}</p>
        </div>
      </div>

      {/* Instrucciones numeradas */}
      <ol className="space-y-2 mb-4">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span className="text-gray-800">{step}</span>
          </li>
        ))}
      </ol>

      {/* Tips importantes */}
      <div className="bg-white border-l-4 border-accent-orange p-4 mb-4 rounded-r-lg">
        <p className="font-semibold text-black mb-2">Tips importantes:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Errores comunes */}
      <div className="bg-white border-l-4 border-accent-pink p-4 rounded-r-lg">
        <p className="font-semibold text-black mb-2">Evita estos errores:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

TestInstructions.propTypes = {
  illustrationText: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  tips: PropTypes.arrayOf(PropTypes.string).isRequired,
  warnings: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default TestInstructions
