import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

const steps = [
  {
    title: 'Cómo Funciona el Assessment',
    content: (
      <>
        <p className="text-gray-600 mb-6">
          Realizarás <strong>7 tests rápidos</strong> para evaluar las áreas clave de tu cuerpo:
        </p>
        <ol className="space-y-3 text-left">
          {[
            'Movilidad de tobillo',
            'Extensión de cadera',
            'Activación de glúteos',
            'Estabilidad del core',
            'Flexibilidad posterior',
            'Capacidad aeróbica',
            'Equilibrio y estabilidad',
          ].map((test, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-gray-700">{test}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 bg-blue-50 rounded-lg p-4 text-center">
          <span className="text-blue-700 font-semibold">Duración estimada: 15 minutos</span>
        </div>
      </>
    ),
  },
  {
    title: 'Lo Que Necesitas',
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { emoji: '📏', label: 'Una pared lisa', desc: 'Para el test de tobillo' },
          { emoji: '📱', label: 'Tu teléfono', desc: 'Para cronometrar' },
          { emoji: '👟', label: 'Ropa cómoda', desc: 'Para moverte libremente' },
          { emoji: '⏱️', label: '15 minutos', desc: 'Sin interrupciones' },
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-5 text-center">
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="font-semibold text-gray-900">{item.label}</div>
            <div className="text-sm text-gray-500">{item.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Instrucciones Importantes',
    content: (
      <ul className="space-y-4 text-left">
        {[
          { icon: '🎯', text: 'Sé honesto con tus resultados. No hay respuestas "buenas" o "malas", solo información para personalizar tu plan.' },
          { icon: '🚫', text: 'Si algo duele, no fuerces. Anota la limitación y continúa con el siguiente test.' },
          { icon: '📝', text: 'Cada test incluye un video explicativo. Míralos antes de realizar la prueba.' },
          { icon: '⏸️', text: 'Puedes pausar y retomar en cualquier momento. Tu progreso se guarda automáticamente.' },
        ].map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <span className="text-gray-700">{item.text}</span>
          </li>
        ))}
      </ul>
    ),
  },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          {steps[currentStep].title}
        </h2>
        <div className="mb-8">
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {currentStep > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Anterior
            </Button>
          ) : (
            <div />
          )}
          {isLastStep ? (
            <button
              onClick={() => navigate('/assessment')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform"
            >
              Empezar Evaluación
            </button>
          ) : (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
