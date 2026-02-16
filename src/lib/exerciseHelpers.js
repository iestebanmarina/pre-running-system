/**
 * Exercise Helpers
 *
 * Funciones para interactuar con la tabla de ejercicios en Supabase.
 * Proporciona acceso a los ejercicios por categoría, target, ID, etc.
 */

import { supabase } from './supabase';

/**
 * Obtiene todos los ejercicios ordenados por categoría y dificultad
 *
 * @returns {Promise<{data: Array|null, error: Error|null}>} Objeto con data y error
 *
 * @example
 * const { data, error } = await getAllExercises();
 * if (error) console.error(error);
 * else console.log(data); // Array de todos los ejercicios
 */
export async function getAllExercises() {
  try {
    console.log('📚 Fetching all exercises...');

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('category', { ascending: true })
      .order('difficulty', { ascending: true });

    if (error) {
      console.error('❌ Error fetching exercises:', error);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data?.length || 0} exercises`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Unexpected error in getAllExercises:', error);
    return { data: null, error };
  }
}

/**
 * Obtiene ejercicios filtrados por categoría
 *
 * @param {string} category - Categoría del ejercicio: 'mobility' | 'activation' | 'strength' | 'capacity'
 * @returns {Promise<{data: Array|null, error: Error|null}>} Objeto con data y error
 *
 * @example
 * const { data, error } = await getExercisesByCategory('mobility');
 * // Retorna solo ejercicios de movilidad
 */
export async function getExercisesByCategory(category) {
  try {
    console.log(`📚 Fetching exercises for category: ${category}`);

    // Validar categoría
    const validCategories = ['mobility', 'activation', 'strength', 'capacity'];
    if (!validCategories.includes(category)) {
      const error = new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
      console.error('❌', error.message);
      return { data: null, error };
    }

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('category', category)
      .order('difficulty', { ascending: true });

    if (error) {
      console.error(`❌ Error fetching exercises for category ${category}:`, error);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data?.length || 0} exercises for category: ${category}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Unexpected error in getExercisesByCategory:', error);
    return { data: null, error };
  }
}

/**
 * Obtiene ejercicios filtrados por target (área del cuerpo)
 *
 * @param {string} target - Área objetivo: 'ankle' | 'hip' | 'glute' | 'core' | 'posterior_chain' | 'balance' | 'full_body'
 * @returns {Promise<{data: Array|null, error: Error|null}>} Objeto con data y error
 *
 * @example
 * const { data, error } = await getExercisesByTarget('ankle');
 * // Retorna ejercicios que trabajan el tobillo
 */
export async function getExercisesByTarget(target) {
  try {
    console.log(`🎯 Fetching exercises for target: ${target}`);

    // Validar target
    const validTargets = ['ankle', 'hip', 'glute', 'core', 'posterior_chain', 'balance', 'full_body'];
    if (!validTargets.includes(target)) {
      const error = new Error(`Invalid target: ${target}. Must be one of: ${validTargets.join(', ')}`);
      console.error('❌', error.message);
      return { data: null, error };
    }

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('target', target)
      .order('category', { ascending: true })
      .order('difficulty', { ascending: true });

    if (error) {
      console.error(`❌ Error fetching exercises for target ${target}:`, error);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data?.length || 0} exercises for target: ${target}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Unexpected error in getExercisesByTarget:', error);
    return { data: null, error };
  }
}

/**
 * Obtiene un ejercicio específico por su ID
 *
 * @param {string} id - ID del ejercicio (ej: 'ankle_wall_mobility')
 * @returns {Promise<{data: Object|null, error: Error|null}>} Objeto con data (ejercicio único) y error
 *
 * @example
 * const { data, error } = await getExerciseById('ankle_wall_mobility');
 * if (data) console.log(data.name_es); // "Movilidad Tobillo - Test de Pared"
 */
export async function getExerciseById(id) {
  try {
    console.log(`🔍 Fetching exercise by ID: ${id}`);

    if (!id || typeof id !== 'string') {
      const error = new Error('Invalid exercise ID provided');
      console.error('❌', error.message);
      return { data: null, error };
    }

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single(); // Retorna un solo objeto, no un array

    if (error) {
      // Si no se encuentra, Supabase retorna un error específico
      if (error.code === 'PGRST116') {
        console.warn(`⚠️ Exercise not found: ${id}`);
        return { data: null, error: new Error(`Exercise not found: ${id}`) };
      }
      console.error(`❌ Error fetching exercise ${id}:`, error);
      return { data: null, error };
    }

    console.log(`✅ Fetched exercise: ${id}`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ Unexpected error in getExerciseById:', error);
    return { data: null, error };
  }
}

/**
 * Extrae los IDs de ejercicios de un objeto priority
 *
 * Esta es una función LOCAL (no async, no hace query a Supabase).
 * Simplemente extrae el array de IDs de ejercicios del objeto priority.
 *
 * @param {Object} priority - Objeto priority del plan generado
 * @param {string} priority.area - Área de prioridad (ej: 'Ankle ROM')
 * @param {Array<string>} priority.exercises - Array de IDs de ejercicios
 * @returns {Array<string>} Array de IDs de ejercicios
 *
 * @example
 * const priority = {
 *   area: 'Ankle ROM',
 *   severity: 'HIGH',
 *   exercises: ['ankle_wall_mobility', 'calf_stretch']
 * };
 * const exerciseIds = getExercisesForPriority(priority);
 * // Retorna: ['ankle_wall_mobility', 'calf_stretch']
 */
export function getExercisesForPriority(priority) {
  if (!priority || !priority.exercises) {
    console.warn('⚠️ Invalid priority object provided to getExercisesForPriority');
    return [];
  }

  console.log(`📋 Extracting exercise IDs for priority: ${priority.area}`);
  console.log(`✅ Found ${priority.exercises.length} exercise(s)`);

  return priority.exercises;
}

/**
 * Obtiene múltiples ejercicios por sus IDs
 *
 * Útil para cargar todos los ejercicios de un priority o de una sesión.
 *
 * @param {Array<string>} exerciseIds - Array de IDs de ejercicios
 * @returns {Promise<{data: Array|null, error: Error|null}>} Objeto con data y error
 *
 * @example
 * const ids = ['ankle_wall_mobility', 'hip_flexor_stretch', 'glute_bridge'];
 * const { data, error } = await getExercisesByIds(ids);
 * // Retorna array con los 3 ejercicios completos
 */
export async function getExercisesByIds(exerciseIds) {
  try {
    console.log(`📚 Fetching ${exerciseIds.length} exercises by IDs...`);

    if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
      console.warn('⚠️ No exercise IDs provided');
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .in('id', exerciseIds);

    if (error) {
      console.error('❌ Error fetching exercises by IDs:', error);
      return { data: null, error };
    }

    console.log(`✅ Fetched ${data?.length || 0} exercises`);

    // Advertir si algunos IDs no se encontraron
    if (data.length < exerciseIds.length) {
      const foundIds = data.map(ex => ex.id);
      const missingIds = exerciseIds.filter(id => !foundIds.includes(id));
      console.warn(`⚠️ Some exercises not found: ${missingIds.join(', ')}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('❌ Unexpected error in getExercisesByIds:', error);
    return { data: null, error };
  }
}

/*
===============================================================================
EJEMPLOS DE USO
===============================================================================

// 1. Obtener todos los ejercicios
const { data: allExercises, error: allError } = await getAllExercises();
if (allError) {
  console.error('Error:', allError);
} else {
  console.log(`Total exercises: ${allExercises.length}`);
  allExercises.forEach(ex => console.log(`- ${ex.name_es} (${ex.category})`));
}

// 2. Obtener ejercicios de movilidad
const { data: mobilityExercises, error: mobError } = await getExercisesByCategory('mobility');
if (!mobError) {
  console.log('Mobility exercises:', mobilityExercises.map(ex => ex.name_es));
}

// 3. Obtener ejercicios para tobillo
const { data: ankleExercises, error: ankleError } = await getExercisesByTarget('ankle');
if (!ankleError) {
  console.log('Ankle exercises:', ankleExercises.map(ex => ex.name_es));
}

// 4. Obtener un ejercicio específico
const { data: exercise, error: exError } = await getExerciseById('ankle_wall_mobility');
if (!exError && exercise) {
  console.log('Exercise:', exercise.name_es);
  console.log('Instructions:', exercise.instructions);
  console.log('Duration:', exercise.duration_minutes, 'min');
}

// 5. Extraer IDs de un priority object
const priority = {
  area: 'Ankle ROM',
  severity: 'HIGH',
  exercises: ['ankle_wall_mobility', 'calf_stretch']
};
const exerciseIds = getExercisesForPriority(priority);
console.log('Exercise IDs:', exerciseIds);

// 6. Obtener múltiples ejercicios por IDs
const ids = ['ankle_wall_mobility', 'hip_flexor_stretch', 'glute_bridge'];
const { data: exercises, error: idsError } = await getExercisesByIds(ids);
if (!idsError) {
  console.log('Loaded exercises:', exercises.map(ex => ex.name_es));
}

// 7. Uso en un componente React
import { getAllExercises, getExercisesByCategory } from '@/lib/exerciseHelpers';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    async function loadExercises() {
      const { data, error } = await getExercisesByCategory('mobility');
      if (!error) setExercises(data);
    }
    loadExercises();
  }, []);

  return (
    <div>
      {exercises.map(ex => (
        <div key={ex.id}>
          <h3>{ex.name_es}</h3>
          <p>{ex.description}</p>
        </div>
      ))}
    </div>
  );
}

===============================================================================
*/
