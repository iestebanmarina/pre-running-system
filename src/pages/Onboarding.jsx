import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

const steps = [
  {
    title: 'Cómo funciona el assessment',
    content: (
      <>
        <p className="text-muted mb-6">
          Realizarás <strong className="text-black">7 tests rápidos</strong> para evaluar las áreas clave de tu cuerpo:
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
              <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-black">{test}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 bg-surface rounded-xl p-4 text-center border border-border">
          <span className="text-black font-semibold">Duración estimada: 15 minutos</span>
        </div>
      </>
    ),
  },
  {
    title: 'Lo que necesitas',
    content: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { num: '1', label: 'Una pared lisa', desc: 'Para el test de tobillo' },
          { num: '2', label: 'Tu teléfono', desc: 'Para cronometrar' },
          { num: '3', label: 'Ropa cómoda', desc: 'Para moverte libremente' },
          { num: '4', label: '15 minutos', desc: 'Sin interrupciones' },
        ].map((item, i) => (
          <div key={i} className="bg-surface rounded-2xl p-5 text-center border border-border">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
              {item.num}
            </div>
            <div className="font-semibold text-black">{item.label}</div>
            <div className="text-sm text-muted">{item.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Instrucciones importantes',
    content: (
      <ul className="space-y-4 text-left">
        {[
          { num: '1', text: 'Sé honesto con tus resultados. No hay respuestas "buenas" o "malas", solo información para personalizar tu plan.' },
          { num: '2', text: 'Si algo duele, no fuerces. Anota la limitación y continúa con el siguiente test.' },
          { num: '3', text: 'Cada test incluye un video explicativo. Míralos antes de realizar la prueba.' },
          { num: '4', text: 'Puedes pausar y retomar en cualquier momento. Tu progreso se guarda automáticamente.' },
        ].map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
              {item.num}
            </span>
            <span className="text-muted pt-1">{item.text}</span>
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-elevated max-w-lg w-full p-8 border border-border">
        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentStep ? 'bg-black' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-black text-center mb-6">
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
              className="bg-gradient-to-r from-accent-orange to-accent-pink text-white font-bold px-6 py-3 rounded-xl hover:scale-[1.02] transition-all duration-300"
            >
              Empezar evaluación
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
