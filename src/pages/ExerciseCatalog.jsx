import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExercises } from '../lib/exerciseHelpers';
import ExerciseCard from '../components/exercises/ExerciseCard';

export default function ExerciseCatalog() {
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'mobility', label: 'Movilidad' },
    { id: 'activation', label: 'Activación' },
    { id: 'strength', label: 'Fuerza' },
    { id: 'capacity', label: 'Capacidad' }
  ];

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

  const filteredExercises = selectedCategory === 'all'
    ? exercises
    : exercises.filter(ex => ex.category === selectedCategory);

  const handleSelectExercise = (exercise) => {
    console.log('Selected exercise:', exercise.id, '-', exercise.name_es);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-orange to-accent-pink">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Biblioteca de ejercicios
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {exercises.length} ejercicios disponibles
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white font-medium text-sm transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Filtros (Tabs) */}
      <div className="bg-white border-b border-border sticky top-16 z-10">
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
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap
                    transition-all duration-300
                    ${isActive
                      ? 'bg-black text-white'
                      : 'bg-surface text-muted hover:bg-border'
                    }
                  `}
                >
                  <span>{category.label}</span>
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-white/20' : 'bg-border text-muted'}
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
            <div className="w-12 h-12 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted font-medium">Cargando ejercicios...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <h3 className="text-red-900 font-semibold text-lg mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredExercises.length === 0 && (
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <h3 className="text-black font-semibold text-xl mb-2">
              No hay ejercicios en esta categoría todavía
            </h3>
            <p className="text-muted mb-6">
              Selecciona otra categoría o vuelve a "Todos"
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-2 bg-gradient-to-r from-accent-orange to-accent-pink text-white rounded-xl font-medium hover:scale-[1.02] transition-all duration-300"
            >
              Ver todos los ejercicios
            </button>
          </div>
        )}

        {/* Grid de Ejercicios */}
        {!isLoading && !error && filteredExercises.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted text-sm">
                Mostrando <span className="font-semibold text-black">{filteredExercises.length}</span>
                {' '}ejercicio{filteredExercises.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <span>
                    {' '}en{' '}
                    <span className="font-semibold text-black">
                      {categories.find(c => c.id === selectedCategory)?.label}
                    </span>
                  </span>
                )}
              </p>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-accent-orange hover:text-accent-pink text-sm font-medium transition-colors"
                >
                  Limpiar filtro
                </button>
              )}
            </div>

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
