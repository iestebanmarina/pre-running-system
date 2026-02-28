import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const scrollToSolucion = () => {
    document.getElementById('solucion')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section — Bento Grid */}
      <section className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-black mb-6">
                Prepara tu cuerpo{' '}
                <span className="bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
                  antes de correr.
                </span>
              </h1>
              <p className="text-xl text-muted max-w-lg mb-10">
                El 70% de nuevos corredores se lesionan en el primer año.
                12 semanas de preparación personalizada cambian eso para siempre.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/onboarding')}
                  className="bg-gradient-to-r from-accent-orange to-accent-pink text-white font-bold text-lg px-8 py-4 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-card hover:shadow-card-hover"
                >
                  Descubre tu PLAN
                </button>
                <button
                  onClick={scrollToSolucion}
                  className="border-2 border-black text-black font-semibold text-lg px-8 py-4 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  Cómo funciona
                </button>
              </div>
            </div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-2xl p-6 border border-border">
                <div className="text-4xl font-bold text-black">10M+</div>
                <div className="text-sm text-muted mt-1">corredores en España</div>
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">70%</div>
                <div className="text-sm text-muted mt-1">se lesionan el primer año</div>
              </div>
              <div className="bg-black rounded-2xl p-6 text-white">
                <div className="text-4xl font-bold">30</div>
                <div className="text-sm text-white/70 mt-1">ejercicios especializados</div>
              </div>
              <div className="bg-black rounded-2xl p-6 text-white">
                <div className="text-4xl font-bold">12</div>
                <div className="text-sm text-white/70 mt-1">semanas de programa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-20 px-6 md:px-12 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            El problema: una lesión predecible
          </h2>
          <p className="text-lg text-muted text-center max-w-2xl mx-auto mb-12">
            La mayoría de nuevos corredores siguen el mismo patrón lesivo
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Sedentarismo', desc: '8+ horas sentado al día. Tobillos rígidos, glúteos dormidos, cadera bloqueada, core débil.' },
              { num: '2', title: 'Empiezan a correr', desc: 'Sin preparación previa. El cuerpo no está listo para el impacto repetitivo de correr.' },
              { num: '3', title: 'Lesión', desc: 'En 3-6 semanas aparecen fascitis plantar, rodilla del corredor, periostitis... y abandonan.' },
            ].map((item) => (
              <div key={item.num} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 p-8 text-center border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.num}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solucion Section — Horizontal Timeline */}
      <section id="solucion" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">
            La solución: Pre-Running System
          </h2>
          <p className="text-lg text-muted text-center max-w-2xl mx-auto mb-16">
            Un programa de 12 semanas que prepara tu cuerpo antes de correr
          </p>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-accent-orange via-accent-pink to-black" />

            {[
              { color: 'bg-black', label: 'Paso previo', title: 'Evaluación', desc: '7 tests específicos que realizas hoy, una sola vez, para identificar tus limitaciones individuales: tobillos, cadera, glúteos, core, flexibilidad, capacidad y equilibrio.' },
              { color: 'bg-gradient-to-br from-accent-orange to-accent-pink', label: 'Semanas 1-10', title: 'Fundamentos', desc: 'Plan personalizado para corregir tus disfunciones: movilidad, activación, fuerza y capacidad aeróbica.' },
              { color: 'bg-black', label: 'Semanas 7-14', title: 'Transición', desc: 'Introducción gradual al running. Tu cuerpo ya está preparado para correr de forma segura y sostenible.' },
            ].map((phase) => (
              <div key={phase.title} className="text-center">
                <div className={`w-16 h-16 ${phase.color} text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4 relative z-10`}>
                  {phase.title.charAt(0)}
                </div>
                <span className="inline-block bg-surface text-black text-sm font-semibold px-3 py-1 rounded-full mb-3 border border-border">
                  {phase.label}
                </span>
                <h3 className="text-xl font-bold text-black mb-2">{phase.title}</h3>
                <p className="text-muted">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 md:px-12 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            ¿Por qué Pre-Running System?
          </h2>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-border">
            <div className="grid grid-cols-3 font-bold text-sm md:text-base">
              <div className="p-4 md:p-6" />
              <div className="p-4 md:p-6 text-center text-muted">Programas genéricos</div>
              <div className="p-4 md:p-6 text-center text-white bg-gradient-to-r from-accent-orange to-accent-pink font-bold">Pre-Running System</div>
            </div>
            {[
              ['Evaluación inicial', 'No evalúan', '7 tests específicos'],
              ['Personalización', 'Plan único para todos', 'Adaptado a tus limitaciones'],
              ['Tasa de lesión', '~70% en primer año', '5-10% con preparación'],
              ['Resultado', 'Frustración y abandono', 'Correr 10-20 años sin lesión'],
            ].map(([label, generic, prerunning], i) => (
              <div key={i} className="grid grid-cols-3 border-t border-border">
                <div className="p-4 md:p-6 font-medium text-black text-sm md:text-base">{label}</div>
                <div className="p-4 md:p-6 text-center text-muted text-sm md:text-base">{generic}</div>
                <div className="p-4 md:p-6 text-center text-sm md:text-base font-medium text-black bg-accent-orange/5">{prerunning}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-6 md:px-12 bg-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Empieza tu evaluación ahora
          </h2>
          <p className="text-xl text-white/60 mb-10">
            Descubre qué necesita tu cuerpo antes de correr.
            En 15 minutos tendrás tu plan personalizado.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-gradient-to-r from-accent-orange to-accent-pink text-white font-bold text-xl px-10 py-5 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-elevated mb-4"
          >
            Empezar mi evaluación gratuita
          </button>
          <p className="text-white/40 text-sm">
            No requiere registro &bull; Resultados inmediatos &bull; By Iñigo Esteban
          </p>
        </div>
      </section>
    </div>
  )
}
