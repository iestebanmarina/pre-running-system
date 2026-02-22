import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const scrollToSolucion = () => {
    document.getElementById('solucion')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            70% de personas que empiezan a correr se lesionan en el primer año
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Prepara tu cuerpo en 12 semanas con un programa personalizado basado en ciencia.
            Corre sin dolor, sin lesiones, durante décadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Descubre Tu Plan Personalizado
            </button>
            <button
              onClick={scrollToSolucion}
              className="border-2 border-white/50 hover:border-white text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              ¿Cómo funciona?
            </button>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            El Problema: Una Cascada Predecible
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
            La mayoría de nuevos corredores siguen el mismo patrón destructivo
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center">
              <div className="text-6xl mb-4">🪑</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sedentarismo</h3>
              <p className="text-gray-600">
                8+ horas sentado al día. Tobillos rígidos, glúteos dormidos,
                cadera bloqueada, core débil.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center relative">
              <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-3xl text-blue-400">→</div>
              <div className="text-6xl mb-4">🏃</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Empiezan a Correr</h3>
              <p className="text-gray-600">
                Sin preparación previa. El cuerpo no está listo para el impacto
                repetitivo de correr.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-center relative">
              <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 text-3xl text-blue-400">→</div>
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lesión</h3>
              <p className="text-gray-600">
                En 3-6 semanas aparecen fascitis plantar, rodilla del corredor,
                periostitis... y abandonan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solución Section */}
      <section id="solucion" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            La Solución: Pre-Running System
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Un programa de 12 semanas que prepara tu cuerpo antes de correr
          </p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-blue-200" />

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 relative z-10">
                📋
              </div>
              <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                Semanas 1-2
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Evaluación</h3>
              <p className="text-gray-600">
                7 tests específicos que identifican tus limitaciones individuales:
                tobillos, cadera, glúteos, core, flexibilidad, capacidad y equilibrio.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 relative z-10">
                💪
              </div>
              <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                Semanas 3-10
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fundamentos</h3>
              <p className="text-gray-600">
                Plan personalizado para corregir tus disfunciones: movilidad,
                activación, fuerza y capacidad aeróbica.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 relative z-10">
                🏃
              </div>
              <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full mb-3">
                Semanas 9-12
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transición</h3>
              <p className="text-gray-600">
                Introducción gradual al running. Tu cuerpo ya está preparado
                para correr de forma segura y sostenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciador Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ¿Por Qué Pre-Running System?
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 font-bold text-sm md:text-base">
              <div className="p-4 md:p-6" />
              <div className="p-4 md:p-6 text-center text-gray-500">Programas Genéricos</div>
              <div className="p-4 md:p-6 text-center text-blue-700 bg-blue-50">Pre-Running System</div>
            </div>
            {[
              ['Evaluación inicial', '❌ No evalúan', '✅ 7 tests específicos'],
              ['Personalización', '❌ Plan único para todos', '✅ Adaptado a tus limitaciones'],
              ['Tasa de lesión', '❌ ~70% en primer año', '✅ 5-10% con preparación'],
              ['Resultado', '❌ Frustración y abandono', '✅ Correr 10-20 años sin lesión'],
            ].map(([label, generic, prerunning], i) => (
              <div key={i} className="grid grid-cols-3 border-t border-gray-100">
                <div className="p-4 md:p-6 font-medium text-gray-900 text-sm md:text-base">{label}</div>
                <div className="p-4 md:p-6 text-center text-gray-500 text-sm md:text-base">{generic}</div>
                <div className="p-4 md:p-6 text-center text-sm md:text-base bg-blue-50/50">{prerunning}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Empieza Tu Evaluación Ahora
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Descubre qué necesita tu cuerpo antes de correr.
            En 15 minutos tendrás tu plan personalizado.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-10 py-5 rounded-xl shadow-lg hover:scale-105 transition-transform mb-4"
          >
            Empezar Mi Evaluación Gratuita
          </button>
          <p className="text-blue-200 text-sm">
            No requiere registro &bull; Resultados inmediatos
          </p>
        </div>
      </section>
    </div>
  )
}
