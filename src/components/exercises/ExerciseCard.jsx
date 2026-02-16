import PropTypes from 'prop-types';

/**
 * ExerciseCard Component
 *
 * Componente para mostrar un ejercicio individual en formato card.
 * Dos variantes: 'compact' para listas y 'full' para vista detallada.
 *
 * @param {Object} exercise - Objeto completo del ejercicio de Supabase
 * @param {string} variant - 'compact' | 'full' (default: 'compact')
 * @param {Function} onSelect - Función opcional para manejar click en el ejercicio
 */
export default function ExerciseCard({ exercise, variant = 'compact', onSelect }) {
  // Mapeo de categorías a colores y emojis
  const categoryConfig = {
    mobility: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Movilidad',
      emoji: '🔄'
    },
    activation: {
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Activación',
      emoji: '⚡'
    },
    strength: {
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Fuerza',
      emoji: '💪'
    },
    capacity: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      label: 'Capacidad',
      emoji: '🏃'
    }
  };

  // Mapeo de targets a español
  const targetLabels = {
    ankle: 'Tobillo',
    hip: 'Cadera',
    glute: 'Glúteos',
    core: 'Core',
    posterior_chain: 'Cadena Posterior',
    balance: 'Equilibrio',
    full_body: 'Cuerpo Completo'
  };

  // Mapeo de dificultad a español
  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  const categoryInfo = categoryConfig[exercise.category] || categoryConfig.mobility;
  const targetLabel = targetLabels[exercise.target] || exercise.target;
  const difficultyLabel = difficultyLabels[exercise.difficulty] || exercise.difficulty;

  // Función para truncar texto
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Handler para click
  const handleClick = () => {
    if (onSelect) {
      onSelect(exercise);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white border border-gray-200 rounded-lg shadow-sm
        ${onSelect ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200' : ''}
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
            <span>{categoryInfo.emoji}</span>
            <span>{categoryInfo.label}</span>
          </span>

          {variant === 'full' && (
            <span className="text-xs text-gray-500 font-medium">
              ID: {exercise.id}
            </span>
          )}
        </div>

        <h3 className={`font-semibold text-gray-900 ${variant === 'full' ? 'text-xl' : 'text-base'}`}>
          {exercise.name_es}
        </h3>
      </div>

      {/* Metadata: Target + Duración + Dificultad */}
      <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          🎯 {targetLabel}
        </span>
        <span className="flex items-center gap-1">
          ⏱️ {exercise.duration_minutes} min
        </span>
        <span className="flex items-center gap-1">
          📊 {difficultyLabel}
        </span>
      </div>

      {/* Descripción */}
      <p className={`text-gray-700 ${variant === 'full' ? 'text-base mb-4' : 'text-sm mb-2'}`}>
        {variant === 'compact'
          ? truncateText(exercise.description, 120)
          : exercise.description}
      </p>

      {/* COMPACT: Solo mostrar lo básico */}
      {variant === 'compact' && (
        <div className="text-xs text-gray-500 mt-2">
          Click para ver detalles
        </div>
      )}

      {/* FULL: Mostrar todos los detalles */}
      {variant === 'full' && (
        <div className="space-y-4 mt-4">
          {/* Video Placeholder */}
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <span className="text-4xl mb-2 block">📹</span>
              <p className="text-gray-600 font-medium">Video próximamente</p>
              <p className="text-gray-500 text-sm mt-1">
                {exercise.video_url ? 'URL disponible' : 'Sin video'}
              </p>
            </div>
          </div>

          {/* Sets/Reps o Hold Time */}
          {(exercise.sets_reps || exercise.hold_time) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 text-sm mb-1">
                📝 Dosificación
              </h4>
              <p className="text-blue-800 text-sm">
                {exercise.sets_reps && <span>{exercise.sets_reps}</span>}
                {exercise.sets_reps && exercise.hold_time && <span> • </span>}
                {exercise.hold_time && <span>Mantener: {exercise.hold_time}</span>}
              </p>
            </div>
          )}

          {/* Instrucciones */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📋 Instrucciones
              </h4>
              <ol className="space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 text-sm pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Errores Comunes */}
          {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                ⚠️ Errores Comunes
              </h4>
              <ul className="space-y-1.5">
                {exercise.common_mistakes.map((mistake, index) => (
                  <li key={index} className="flex gap-2 text-yellow-800 text-sm">
                    <span className="flex-shrink-0">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipamiento */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                🏋️ Equipamiento Necesario
              </h4>
              <ul className="space-y-1.5">
                {exercise.equipment.map((item, index) => (
                  <li key={index} className="flex gap-2 text-gray-700 text-sm">
                    <span className="flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata adicional */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Categoría</span>
                <span className="font-medium text-gray-900">{categoryInfo.label}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Target</span>
                <span className="font-medium text-gray-900">{targetLabel}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Duración</span>
                <span className="font-medium text-gray-900">{exercise.duration_minutes} minutos</span>
              </div>
              <div>
                <span className="text-gray-500 block">Dificultad</span>
                <span className="font-medium text-gray-900">{difficultyLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
