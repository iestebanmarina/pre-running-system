# Skill: /add-exercise

Añade un nuevo ejercicio al sistema: migración SQL + pool en personalization.js.

## Uso
```
/add-exercise [nombre] [categoría]
```
Ejemplo: `/add-exercise calf_raise_eccentric mobility`

## Pasos

1. **Identificar el pool correcto**
   - Lee `src/lib/personalization.js` → constante `EXERCISES`
   - Determina qué área(s) corresponden según la categoría y target anatómico
   - Consulta `.claude/rules/exercises.md` para la taxonomía

2. **Determinar el número de migración**
   - `ls supabase/migrations/` → encuentra el número más alto
   - El nuevo archivo será `{N+1}_add_{nombre}_exercise.sql`

3. **Leer una migración de referencia**
   - Lee `supabase/migrations/003_seed_exercises.sql` para ver el formato INSERT exacto

4. **Crear la migración**
   - Genera el INSERT con todos los campos del schema de exercises
   - ID en snake_case con target anatómico primero
   - `instructions` y `common_mistakes` como JSONB arrays
   - Si es isométrico: `reps = NULL`, `hold_seconds = valor`; si es por reps: `hold_seconds = NULL`
   - Incluir cabecera con descripción y fecha

5. **Actualizar el pool en personalization.js**
   - Añadir el ID al array `phase1`, `phase2`, `phase3` y `all` del área correspondiente
   - Solo añadir a las fases donde tenga sentido médicamente (ver comentarios en el archivo)

6. **Confirmar**
   - Mostrar el SQL generado y el cambio en personalization.js antes de escribir
   - Preguntar al usuario si quiere proceder
