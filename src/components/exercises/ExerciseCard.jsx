import { useState } from 'react';
import PropTypes from 'prop-types';
import ExerciseModal from './ExerciseModal';

export default function ExerciseCard({ exercise, variant = 'compact', onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryConfig = {
    mobility: { accent: 'accent-orange', label: 'MOV' },
    activation: { accent: 'accent-pink', label: 'ACT' },
    strength: { accent: 'black', label: 'STR' },
    capacity: { accent: 'accent-orange', label: 'CAP' }
  };

  const targetLabels = {
    ankle: 'Tobillo',
    hip: 'Cadera',
    glute: 'Glúteos',
    core: 'Core',
    posterior_chain: 'Cadena Posterior',
    balance: 'Equilibrio',
    full_body: 'Full Body'
  };

  const difficultyConfig = {
    beginner: { label: 'NIVEL 1', bars: 1 },
    intermediate: { label: 'NIVEL 2', bars: 2 },
    advanced: { label: 'NIVEL 3', bars: 3 }
  };

  const cat = categoryConfig[exercise.category] || categoryConfig.mobility;
  const targetLabel = targetLabels[exercise.target] || exercise.target;
  const diff = difficultyConfig[exercise.difficulty] || difficultyConfig.beginner;

  const accentClasses = {
    'accent-orange': {
      bg: 'bg-accent-orange',
      text: 'text-accent-orange',
      border: 'border-accent-orange',
      bgLight: 'bg-accent-orange/10',
    },
    'accent-pink': {
      bg: 'bg-accent-pink',
      text: 'text-accent-pink',
      border: 'border-accent-pink',
      bgLight: 'bg-accent-pink/10',
    },
    black: {
      bg: 'bg-black',
      text: 'text-black',
      border: 'border-black',
      bgLight: 'bg-black/10',
    }
  };

  const accent = accentClasses[cat.accent];

  const handleClick = () => {
    setIsModalOpen(true);
    if (onSelect) onSelect(exercise);
  };

  if (variant === 'compact') {
    return (
      <>
        <div
          onClick={handleClick}
          className="group relative bg-white border-2 border-black/5 cursor-pointer
            hover:scale-[1.04] hover:shadow-elevated hover:border-black
            transition-all duration-200 ease-out overflow-hidden"
        >
          {/* Top accent stripe */}
          <div className={`h-1 w-full ${accent.bg}`} />

          <div className="p-5 pb-4">
            {/* Category tag — top left, bold */}
            <span className={`inline-block text-[10px] font-black tracking-[0.2em] uppercase ${accent.text} mb-3`}>
              {cat.label}
            </span>

            {/* Exercise name — large, bold, tight tracking */}
            <h3 className="text-lg font-black text-black tracking-tight leading-tight mb-3
              group-hover:text-accent-orange transition-colors duration-200">
              {exercise.name_es}
            </h3>

            {/* Metadata row */}
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="font-semibold uppercase tracking-wide">{targetLabel}</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span className="font-mono font-bold text-black">{exercise.duration_minutes}'</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              {/* Difficulty bars */}
              <span className="flex items-center gap-0.5">
                {[1, 2, 3].map(i => (
                  <span
                    key={i}
                    className={`w-3 h-1 ${i <= diff.bars ? accent.bg : 'bg-black/10'}`}
                  />
                ))}
              </span>
            </div>
          </div>

          {/* Bottom hover reveal — arrow indicator */}
          <div className="absolute bottom-0 right-0 w-10 h-10 flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </div>
        </div>

        <ExerciseModal
          exercise={exercise}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // FULL variant
  return (
    <>
      <div
        onClick={handleClick}
        className="group bg-white border-2 border-black cursor-pointer
          hover:shadow-elevated transition-all duration-200 ease-out overflow-hidden"
      >
        {/* Header block — black bg */}
        <div className="bg-black text-white p-6 pb-5">
          <div className="flex items-start justify-between mb-4">
            <span className={`inline-block text-[10px] font-black tracking-[0.2em] uppercase
              ${cat.accent === 'black' ? 'text-white/60' : accent.text}`}>
              {cat.label} — {targetLabel.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              {exercise.id}
            </span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-4">
            {exercise.name_es}
          </h3>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wide font-semibold">Duración</span>
              <span className="text-sm font-mono font-bold text-white">{exercise.duration_minutes}'</span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/50 uppercase tracking-wide font-semibold">Nivel</span>
              <span className="flex items-center gap-0.5">
                {[1, 2, 3].map(i => (
                  <span
                    key={i}
                    className={`w-4 h-1 ${i <= diff.bars ? 'bg-accent-orange' : 'bg-white/20'}`}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="text-sm text-muted leading-relaxed">
            {exercise.description}
          </p>

          {/* Video Placeholder */}
          <div className="bg-black/[0.03] border-2 border-dashed border-black/10 h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 border-2 border-black/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wide">
                {exercise.video_url ? 'Video disponible' : 'Próximamente'}
              </p>
            </div>
          </div>

          {/* Dosificación */}
          {(exercise.sets_reps || exercise.hold_time) && (
            <div className={`${accent.bgLight} border-l-4 ${accent.border} p-4`}>
              <span className="block text-[10px] font-black tracking-[0.2em] uppercase text-black/40 mb-1">
                DOSIFICACIÓN
              </span>
              <p className={`text-sm font-bold ${accent.text}`}>
                {exercise.sets_reps && <span>{exercise.sets_reps}</span>}
                {exercise.sets_reps && exercise.hold_time && <span className="text-black/20"> — </span>}
                {exercise.hold_time && <span>Mantener: {exercise.hold_time}</span>}
              </p>
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-black/40 mb-3">
                INSTRUCCIONES
              </h4>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className={`flex-shrink-0 w-6 h-6 ${accent.bg} text-white
                      flex items-center justify-center text-xs font-black`}>
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted leading-relaxed pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Common Mistakes */}
          {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
            <div className="bg-accent-pink/5 border-l-4 border-accent-pink p-4">
              <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-black/40 mb-2">
                ERRORES COMUNES
              </h4>
              <ul className="space-y-2">
                {exercise.common_mistakes.map((mistake, index) => (
                  <li key={index} className="flex gap-2 text-sm text-muted">
                    <span className="flex-shrink-0 text-accent-pink font-black">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-black/40 mb-2">
                EQUIPAMIENTO
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <span key={index} className="px-3 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wide">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom metadata grid */}
          <div className="border-t-2 border-black/10 pt-4 mt-6">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Categoría', value: categoryConfig[exercise.category]?.label || 'MOV' },
                { label: 'Target', value: targetLabel },
                { label: 'Duración', value: `${exercise.duration_minutes} min` },
                { label: 'Nivel', value: diff.label }
              ].map((item, i) => (
                <div key={i}>
                  <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted mb-0.5">
                    {item.label}
                  </span>
                  <span className="block text-xs font-black text-black">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ExerciseModal
        exercise={exercise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

ExerciseCard.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name_es: PropTypes.string.isRequired,
    category: PropTypes.oneOf(['mobility', 'activation', 'strength', 'capacity']).isRequired,
    target: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number.isRequired,
    difficulty: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']).isRequired,
    video_url: PropTypes.string,
    thumbnail_url: PropTypes.string,
    instructions: PropTypes.arrayOf(PropTypes.string),
    common_mistakes: PropTypes.arrayOf(PropTypes.string),
    equipment: PropTypes.arrayOf(PropTypes.string),
    sets_reps: PropTypes.string,
    hold_time: PropTypes.string
  }).isRequired,
  variant: PropTypes.oneOf(['compact', 'full']),
  onSelect: PropTypes.func
};
