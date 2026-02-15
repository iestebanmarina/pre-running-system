import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    { id: 1, name: 'Ankle ROM', component: AnkleROMTest },
    { id: 2, name: 'Hip Extension', component: HipExtensionTest },
    { id: 3, name: 'Glute Activation', component: GluteActivationTest },
    { id: 4, name: 'Core Stability', component: CoreStabilityTest },
    { id: 5, name: 'Posterior Chain', component: PosteriorChainTest },
    { id: 6, name: 'Aerobic Capacity', component: AerobicCapacityTest },
    { id: 7, name: 'Balance', component: BalanceTest }
  ]

  const handleTestComplete = (data) => {
    // Merge new test data into assessment data
    setAssessmentData((prev) => ({ ...prev, ...data }))

    // Move to next test or complete assessment
    if (currentStep < tests.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Assessment complete - you can handle submission here
      handleAssessmentComplete({ ...assessmentData, ...data })
    }
  }

  const handleAssessmentComplete = async (completeData) => {
    console.log('Assessment Complete:', completeData)

    // Generate personalized plan
    const result = generatePersonalizedPlan(completeData)

    if (!result.success) {
      console.error('Error generando plan:', result.errors)
      alert('Error: No se pudo generar el plan. ' + result.errors.join(', '))
      return
    }

    // Display warnings if any
    if (result.warnings && result.warnings.length > 0) {
      console.warn('Advertencias:', result.warnings)
    }

    // Log the generated plan
    console.log('Plan generado:', result.plan)
    console.log('Metadata:', result.metadata)
    console.log('\n' + formatPlanSummary(result.plan))

    // Phase 1: Save to Supabase (assessments + plans tables)
    try {
      // TODO Phase 1.5: Replace with actual user ID from AuthContext
      // Using NULL for MVP since we don't have auth yet
      const TEMP_USER_ID = null

      // Step 1: Save assessment to database
      const { data: assessmentRecord, error: assessmentError } = await saveAssessment(
        completeData,
        TEMP_USER_ID,
        0 // week 0 = baseline assessment
      )

      if (assessmentError) {
        console.error('Failed to save assessment:', assessmentError)
        alert('Error al guardar la evaluación. Por favor, intenta de nuevo.')
        // Don't block navigation - user can still see results even if save fails
        // return
      }

      // Step 2: Save plan to database (only if assessment saved successfully)
      if (assessmentRecord) {
        const { data: planRecord, error: planError } = await savePlan(
          result.plan,
          TEMP_USER_ID,
          assessmentRecord.id
        )

        if (planError) {
          console.error('Failed to save plan:', planError)
          alert('Error al guardar el plan. Por favor, contacta soporte.')
          // Don't block navigation
        } else {
          console.log('✅ Assessment and plan saved to Supabase!')
        }
      }

    } catch (error) {
      console.error('Unexpected error during save:', error)
      // Don't block user - log error but continue to results
    }

    // Navigate to Results page with plan data
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
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              Test {currentStep + 1} de {tests.length}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {Math.round(progress)}% Completado
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : index < currentStep
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
            ← Anterior
          </Button>
        </div>
      )}
    </div>
  )
}

export default Assessment
