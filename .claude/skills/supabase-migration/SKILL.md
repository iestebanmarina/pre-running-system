# Skill: /supabase-migration

Genera una nueva migración SQL correctamente numerada y formateada.

## Uso
```
/supabase-migration [descripción de lo que hace la migración]
```
Ejemplo: `/supabase-migration añadir columna shoulder_rom a assessments`

## Pasos

1. **Encontrar el siguiente número de secuencia**
   - Listar `supabase/migrations/*.sql` ordenado
   - El nombre del nuevo archivo será `{N+1}_descripcion.sql` con padding a 3 dígitos

2. **Leer el estado actual del schema**
   - Lee la migración más reciente para entender el estado actual de las tablas afectadas
   - Lee `supabase/migrations/001_initial_schema.sql` si se toca una tabla base

3. **Generar el SQL**
   - Siempre usar `IF NOT EXISTS` / `IF EXISTS` para idempotencia
   - Usar `ADD COLUMN IF NOT EXISTS` para columnas nuevas
   - Cabecera obligatoria:
     ```sql
     -- Migración NNN: descripción breve
     -- Fecha: YYYY-MM-DD
     -- Propósito: explicación en una línea
     ```
   - Comentarios en línea para columnas no obvias

4. **Verificar impacto**
   - ¿Alguna función en `supabaseHelpers.js` usa esta tabla? → verificar que los campos mapeados siguen siendo correctos
   - ¿Hay columnas generadas (`GENERATED ALWAYS AS`) que podrían verse afectadas?

5. **Mostrar el SQL completo** antes de crear el archivo — confirmar con el usuario

6. **Crear el archivo** en `supabase/migrations/`

## Formato de nombre
`NNN_verbo_objeto.sql`
Ejemplos: `006_add_shoulder_columns.sql`, `007_create_achievements_table.sql`
