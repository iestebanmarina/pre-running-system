import { useState, useEffect } from 'react'
import { getAllExercises } from '../lib/exerciseHelpers'

export default function ExerciseTest() {
  const [exercises, setExercises] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const { data } = await getAllExercises()
      setExercises(data || [])

      // Calcular stats
      const byCategory = {}
      const byTarget = {}
      data?.forEach(ex => {
        byCategory[ex.category] = (byCategory[ex.category] || 0) + 1
        byTarget[ex.target] = (byTarget[ex.target] || 0) + 1
      })

      setStats({ byCategory, byTarget, total: data?.length || 0 })
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        📊 Exercise Database Test
      </h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando ejercicios...</p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-bold mb-2 text-lg">📈 Estadísticas</h2>
            <p className="text-2xl font-bold text-blue-600 mb-3">
              Total Exercises: {stats.total}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-semibold mb-2 text-gray-700">Por Categoría:</p>
                <pre className="text-sm bg-white p-3 rounded border border-blue-100">
                  {JSON.stringify(stats.byCategory, null, 2)}
                </pre>
              </div>

              <div>
                <p className="font-semibold mb-2 text-gray-700">Por Target:</p>
                <pre className="text-sm bg-white p-3 rounded border border-blue-100">
                  {JSON.stringify(stats.byTarget, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h2 className="font-bold mb-3 text-lg">📚 Todos los Ejercicios ({exercises.length})</h2>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="border p-3 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm text-gray-500 min-w-[40px]">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{ex.name_es}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded font-medium">
                          {ex.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>🎯 {ex.target}</span>
                        <span>•</span>
                        <span>⏱️ {ex.duration_minutes} min</span>
                        <span>•</span>
                        <span className="font-mono text-xs">{ex.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verificación de valores esperados */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-bold mb-2 text-lg text-green-800">✅ Verificación</h2>
            <div className="space-y-1 text-sm">
              <p className={stats.total === 30 ? 'text-green-700' : 'text-red-700 font-bold'}>
                {stats.total === 30 ? '✓' : '✗'} Total: {stats.total} (esperado: 30)
              </p>
              <p className={stats.byCategory?.mobility === 10 ? 'text-green-700' : 'text-red-700'}>
                {stats.byCategory?.mobility === 10 ? '✓' : '✗'} Mobility: {stats.byCategory?.mobility || 0} (esperado: 10)
              </p>
              <p className={stats.byCategory?.activation === 10 ? 'text-green-700' : 'text-red-700'}>
                {stats.byCategory?.activation === 10 ? '✓' : '✗'} Activation: {stats.byCategory?.activation || 0} (esperado: 10)
              </p>
              <p className={stats.byCategory?.strength === 8 ? 'text-green-700' : 'text-red-700'}>
                {stats.byCategory?.strength === 8 ? '✓' : '✗'} Strength: {stats.byCategory?.strength || 0} (esperado: 8)
              </p>
              <p className={stats.byCategory?.capacity === 2 ? 'text-green-700' : 'text-red-700'}>
                {stats.byCategory?.capacity === 2 ? '✓' : '✗'} Capacity: {stats.byCategory?.capacity || 0} (esperado: 2)
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
