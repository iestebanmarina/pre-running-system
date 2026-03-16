# Skill: /check-schema

Verifica que el schema de la DB (según migraciones) coincide con las queries del código.

## Uso
```
/check-schema
```
Sin argumentos — analiza todo el proyecto.

## context: fork

Trabaja en copia del contexto para no contaminar la conversación principal.

## Pasos

1. **Construir el schema actual**
   - Leer todas las migraciones en orden numérico (`001_`, `002_`, ...)
   - Construir un mapa mental de: tabla → columnas actuales (con tipo)
   - Tener en cuenta `ALTER TABLE ADD COLUMN`, `DROP COLUMN`, etc.

2. **Extraer todas las queries del código**
   - Buscar `supabase.from(` en `src/lib/supabaseHelpers.js`
   - Buscar `supabase.from(` en cualquier otro archivo de `src/`
   - Para cada query, identificar: tabla, operación (select/insert/update/upsert), columnas referenciadas

3. **Cruzar referencias**
   - Para cada columna usada en el código: ¿existe en el schema?
   - Para cada tabla usada: ¿existe?
   - Verificar también los campos en `savePlan` (dbRecord), `saveAssessment` (dbRecord)

4. **Output: tabla de resultados**
   ```
   SCHEMA CHECK — {fecha}

   TABLAS: ✓ assessments, ✓ plans, ✓ user_sessions, ...

   COLUMNAS OK:
   - assessments.ankle_rom_right ✓
   - plans.deload_weeks ✓ (columna en código pero ¿está en schema?)

   MISMATCHES DETECTADOS:
   - plans.deload_weeks: usada en supabaseHelpers.js:181 pero NO existe en migraciones
   - [o "Ninguno detectado ✓"]

   COLUMNAS EN SCHEMA NO USADAS EN CÓDIGO:
   - assessments.week (puede ser intencional)
   ```

5. **Recomendaciones** si hay mismatches
   - Sugerir migración para añadir columnas faltantes
   - O suggerir limpiar referencias a columnas que ya no existen
