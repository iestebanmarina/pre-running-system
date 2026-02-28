import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreeningStep from '../components/assessment/ScreeningStep'
import AnkleROMTest from '../components/assessment/AnkleROMTest'
import HipExtensionTest from '../components/assessment/HipExtensionTest'
import GluteActivationTest from '../components/assessment/GluteActivationTest'
import CoreStabilityTest from '../components/assessment/CoreStabilityTest'
import PosteriorChainTest from '../components/assessment/PosteriorChainTest'
import AerobicCapacityTest from '../components/assessment/AerobicCapacityTest'
import BalanceTest from '../components/assessment/BalanceTest'
import Button from '../components/ui/Button'
import { generatePersonalizedPlan, formatPlanSummary } from '../lib/personalization'
import { saveAssessment, savePlan } from '../lib/supabaseHelpers'

const Assessment = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [assessmentData, setAssessmentData] = useState({})

  const tests = [
    { id: 0, name: 'Screening', component: ScreeningStep },
    { id: 1, name: 'Ankle ROM', component: AnkleROMTest },
    { id: 2, name: 'Hip Extension', component: HipExtensionTest },
    { id: 3, name: 'Glute Activation', component: GluteActivationTest },
    { id: 4, name: 'Core Stability', component: CoreStabilityTest },
    { id: 5, name: 'Posterior Chain', component: PosteriorChainTest },
    { id: 6, name: 'Aerobic Capacity', component: AerobicCapacityTest },
    { id: 7, name: 'Balance', component: BalanceTest }
  ]

  const handleTestComplete = (data) => {
    setAssessmentData((prev) => ({ ...prev, ...data }))

    if (currentStep < tests.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleAssessmentComplete({ ...assessmentData, ...data })
    }
  }

  const handleAssessmentComplete = async (completeData) => {
    console.log('Assessment Complete:', completeData)

    const result = generatePersonalizedPlan(completeData)

    if (!result.success) {
      console.error('Error generando plan:', result.errors)
      alert('Error: No se pudo generar el plan. ' + result.errors.join(', '))
      return
    }

    if (result.warnings && result.warnings.length > 0) {
      console.warn('Advertencias:', result.warnings)
    }

    console.log('Plan generado:', result.plan)
    console.log('Metadata:', result.metadata)
    console.log('\n' + formatPlanSummary(result.plan))

    try {
      const TEMP_USER_ID = null

      const { data: assessmentRecord, error: assessmentError } = await saveAssessment(
        completeData,
        TEMP_USER_ID,
        0
      )

      if (assessmentError) {
        console.error('Failed to save assessment:', assessmentError)
        alert('Error al guardar la evaluación. Por favor, intenta de nuevo.')
      }

      if (assessmentRecord) {
        const { data: planRecord, error: planError } = await savePlan(
          result.plan,
          TEMP_USER_ID,
          assessmentRecord.id
        )

        if (planError) {
          console.error('Failed to save plan:', planError)
          alert('Error al guardar el plan. Por favor, contacta soporte.')
        } else {
          console.log('Assessment and plan saved to Supabase!')
        }
      }

    } catch (error) {
      console.error('Unexpected error during save:', error)
    }

    navigate('/results', {
      state: {
        plan: result.plan,
        metadata: result.metadata,
        warnings: result.warnings
      }
    })
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentTestComponent = tests[currentStep].component
  const progress = ((currentStep + 1) / tests.length) * 100

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="sticky top-16 bg-white/80 backdrop-blur-md shadow-sm z-10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted">
              Test {currentStep + 1} de {tests.length}
            </div>
            <div className="text-sm font-medium text-black">
              {Math.round(progress)}% Completado
            </div>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent-orange to-accent-pink h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Test Navigation Pills */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {tests.map((test, index) => (
            <button
              key={test.id}
              onClick={() => setCurrentStep(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                index === currentStep
                  ? 'bg-black text-white'
                  : index < currentStep
                  ? 'bg-accent-orange/10 text-accent-orange hover:bg-accent-orange/20'
                  : 'bg-surface text-muted hover:bg-border'
              }`}
            >
              {test.id}. {test.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Test Component */}
      <div className="pb-8">
        <CurrentTestComponent
          onComplete={handleTestComplete}
          initialData={assessmentData}
        />
      </div>

      {/* Back Button (if not first step) */}
      {currentStep > 0 && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <Button variant="secondary" onClick={handlePrevious}>
            Anterior
          </Button>
        </div>
      )}
    </div>
  )
}

export default Assessment
