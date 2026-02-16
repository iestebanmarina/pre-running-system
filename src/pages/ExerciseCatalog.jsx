import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExercises } from '../lib/exerciseHelpers';
import ExerciseCard from '../components/exercises/ExerciseCard';

/**
 * ExerciseCatalog Page
 *
 * Página para explorar todos los ejercicios con filtros por categoría.
 * Muestra un grid responsive de ejercicios usando ExerciseCard.
 */
export default function ExerciseCatalog() {
  const navigate = useNavigate();

  // Estado
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  // Categorías para los tabs
  const categories = [
    { id: 'all', label: 'Todos', emoji: '📚' },
    { id: 'mobility', label: 'Movilidad', emoji: '🔄' },
    { id: 'activation', label: 'Activación', emoji: '⚡' },
    { id: 'strength', label: 'Fuerza', emoji: '💪' },
    { id: 'capacity', label: 'Capacidad', emoji: '🏃' }
  ];

  // Cargar ejercicios al montar
  useEffect(() => {
    async function loadExercises() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await getAllExercises();

        if (fetchError) {
          console.error('Error loading exercises:', fetchError);
          setError('Error al cargar ejercicios. Por favor, intenta de nuevo.');
          return;
        }

        console.log('✅ Loaded exercises:', data?.length || 0);
        setExercises(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Error inesperado. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  // Filtrar ejercicios según categoría seleccionada
  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory);

  // Handler para seleccionar ejercicio
  const handleSelectExercise = (exercise) => {
    console.log('📋 Selected exercise:', exercise.id, '-', exercise.name_es);
    // TODO: Navegar a /exercises/:id cuando esté implementada la página de detalle
    // navigate(`/exercises/${exercise.id}`);
  };

  // Handler para cambiar categoría
  const handleCategoryChange = (categoryId) => {
    console.log('🔄 Changing category to:', categoryId);
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Biblioteca de Ejercicios
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {exercises.length} ejercicios base • Más próximamente
              </p>
            </div>

            {/* Botón para volver */}
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      {/* Filtros (Tabs) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(category => {
              const isActive = selectedCategory === category.id;
              const count = category.id === 'all'
                ? exercises.length
                : exercises.filter(ex => ex.category === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                    transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-blue-700' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando ejercicios...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <span className="text-4xl mb-3 block">⚠️</span>
            <h3 className="text-red-900 font-semibold text-lg mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredExercises.length === 0 && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-12 text-center">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-gray-900 font-semibold text-xl mb-2">
              No hay ejercicios en esta categoría todavía
            </h3>
            <p className="text-gray-600 mb-6">
              Selecciona otra categoría o vuelve a "Todos"
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver todos los ejercicios
            </button>
          </div>
        )}

        {/* Grid de Ejercicios */}
        {!isLoading && !error && filteredExercises.length > 0 && (
          <>
            {/* Info de resultados */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Mostrando <span className="font-semibold text-gray-900">{filteredExercises.length}</span>
                {' '}ejercicio{filteredExercises.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <span>
                    {' '}en{' '}
                    <span className="font-semibold text-gray-900">
                      {categories.find(c => c.id === selectedCategory)?.label}
                    </span>
                  </span>
                )}
              </p>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Limpiar filtro
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map(exercise => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  variant="compact"
                  onSelect={handleSelectExercise}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
