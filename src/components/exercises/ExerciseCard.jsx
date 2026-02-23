import { useState } from 'react';
import PropTypes from 'prop-types';
import ExerciseModal from './ExerciseModal';

export default function ExerciseCard({ exercise, variant = 'compact', onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryConfig = {
    mobility: {
      color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
      label: 'Movilidad'
    },
    activation: {
      color: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
      label: 'Activacion'
    },
    strength: {
      color: 'bg-black/10 text-black border-black/20',
      label: 'Fuerza'
    },
    capacity: {
      color: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
      label: 'Capacidad'
    }
  };

  const targetLabels = {
    ankle: 'Tobillo',
    hip: 'Cadera',
    glute: 'Gluteos',
    core: 'Core',
    posterior_chain: 'Cadena Posterior',
    balance: 'Equilibrio',
    full_body: 'Cuerpo Completo'
  };

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  const categoryInfo = categoryConfig[exercise.category] || categoryConfig.mobility;
  const targetLabel = targetLabels[exercise.target] || exercise.target;
  const difficultyLabel = difficultyLabels[exercise.difficulty] || exercise.difficulty;

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleClick = () => {
    setIsModalOpen(true);
    if (onSelect) onSelect(exercise);
  };

  return (
    <>
    <div
      onClick={handleClick}
      className={`
        bg-white border border-border rounded-2xl shadow-card
        cursor-pointer hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300
        ${variant === 'full' ? 'p-6' : 'p-4'}
      `}
    >
      {/* Header: Badge + Nombre */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between">
          <span
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border
              ${categoryInfo.color}
            `}
          >
            <span>{categoryInfo.label}</span>
          </span>

          {variant === 'full' && (
            <span className="text-xs text-muted font-medium">
              ID: {exercise.id}
            </span>
          )}
        </div>

        <h3 className={`font-semibold text-black ${variant === 'full' ? 'text-xl' : 'text-base'}`}>
          {exercise.name_es}
        </h3>
      </div>

      {/* Metadata: Target + Duracion + Dificultad */}
      <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted">
        <span className="flex items-center gap-1">
          {targetLabel}
        </span>
        <span className="flex items-center gap-1">
          {exercise.duration_minutes} min
        </span>
        <span className="flex items-center gap-1">
          {difficultyLabel}
        </span>
      </div>

      {/* Descripcion */}
      <p className={`text-muted ${variant === 'full' ? 'text-base mb-4' : 'text-sm mb-2'}`}>
        {variant === 'compact'
          ? truncateText(exercise.description, 120)
          : exercise.description}
      </p>

      {/* COMPACT: Solo mostrar lo basico */}
      {variant === 'compact' && (
        <div className="text-xs text-muted mt-2">
          Click para ver detalles
        </div>
      )}

      {/* FULL: Mostrar todos los detalles */}
      {variant === 'full' && (
        <div className="space-y-4 mt-4">
          {/* Video Placeholder */}
          <div className="bg-surface rounded-xl h-48 flex items-center justify-center border border-border">
            <div className="text-center">
              <p className="text-muted font-medium">Video proximamente</p>
              <p className="text-muted text-sm mt-1">
                {exercise.video_url ? 'URL disponible' : 'Sin video'}
              </p>
            </div>
          </div>

          {/* Sets/Reps o Hold Time */}
          {(exercise.sets_reps || exercise.hold_time) && (
            <div className="bg-accent-orange/5 border border-accent-orange/20 rounded-xl p-3">
              <h4 className="font-semibold text-black text-sm mb-1">
                Dosificacion
              </h4>
              <p className="text-accent-orange text-sm">
                {exercise.sets_reps && <span>{exercise.sets_reps}</span>}
                {exercise.sets_reps && exercise.hold_time && <span> - </span>}
                {exercise.hold_time && <span>Mantener: {exercise.hold_time}</span>}
              </p>
            </div>
          )}

          {/* Instrucciones */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h4 className="font-semibold text-black mb-2">
                Instrucciones
              </h4>
              <ol className="space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-accent-orange to-accent-pink text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-muted text-sm pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Errores Comunes */}
          {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
            <div className="bg-accent-pink/5 border border-accent-pink/20 rounded-xl p-4">
              <h4 className="font-semibold text-black mb-2">
                Errores Comunes
              </h4>
              <ul className="space-y-1.5">
                {exercise.common_mistakes.map((mistake, index) => (
                  <li key={index} className="flex gap-2 text-muted text-sm">
                    <span className="flex-shrink-0">-</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipamiento */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-4">
              <h4 className="font-semibold text-black mb-2">
                Equipamiento Necesario
              </h4>
              <ul className="space-y-1.5">
                {exercise.equipment.map((item, index) => (
                  <li key={index} className="flex gap-2 text-muted text-sm">
                    <span className="flex-shrink-0">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata adicional */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted block">Categoria</span>
                <span className="font-medium text-black">{categoryInfo.label}</span>
              </div>
              <div>
                <span className="text-muted block">Target</span>
                <span className="font-medium text-black">{targetLabel}</span>
              </div>
              <div>
                <span className="text-muted block">Duracion</span>
                <span className="font-medium text-black">{exercise.duration_minutes} minutos</span>
              </div>
              <div>
                <span className="text-muted block">Dificultad</span>
                <span className="font-medium text-black">{difficultyLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
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
