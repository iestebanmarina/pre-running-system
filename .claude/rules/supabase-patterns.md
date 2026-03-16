---
paths:
  - "src/lib/supabase*.js"
  - "supabase/**"
  - "src/contexts/**"
---

# Supabase Patterns

## Patrón estándar para todas las queries

```js
try {
  const { data, error } = await supabase
    .from('tabla')
    .insert([record])
    .select()
    .single()

  if (error) throw error
  return { data, error: null }
} catch (error) {
  console.error('Context: operation failed:', error)
  toast.error('Mensaje amigable para el usuario.')
  return { data: null, error }
}
```

**Reglas**:
- Siempre `try/catch` — Supabase puede lanzar excepciones de red además del `error` en la respuesta
- Siempre `if (error) throw error` dentro del try — no ignorar el error del response
- `toast.error(...)` en el catch — el usuario debe saber que algo falló
- Retornar `{ data, error: null }` en éxito, `{ data: null, error }` en fallo

## Auth / TEMP_USER_ID

La autenticación no está implementada todavía. Patrón actual:
```js
const userId = null  // TEMP_USER_ID
if (!userId) {
  console.warn('⚠️ Usuario temporal - en producción necesitas autenticación')
}
```

Cuando se implemente auth, el `userId` vendrá de `supabase.auth.getUser()` o del `AuthContext`.

## RLS (Row Level Security)

Todas las policies son user-scoped vía `auth.uid()`:
```sql
-- Patrón estándar de policy
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

Las inserciones anónimas actuales funcionan por la migración `002_temp_allow_anonymous_inserts` — esto se revertirá cuando se implemente auth.

## Funciones helper en supabaseHelpers.js

| Función | Tabla | Operación |
|---|---|---|
| `saveAssessment(data, userId, week)` | `assessments` | INSERT |
| `getLatestAssessment(userId)` | `assessments` | SELECT + ORDER + LIMIT 1 |
| `savePlan(planData, userId, assessmentId)` | `plans` | INSERT |
| `getUserPlan(userId)` | `plans` | SELECT WHERE status='active' |
| `completeSession(userId, planId, week, day, type, rating)` | `user_sessions` | UPSERT |
| `getCompletedSessions(userId, planId)` | `user_sessions` | SELECT WHERE completed=true |
| `calculateCurrentWeek(createdAt)` | — | Cálculo de fecha |
| `calculateStreak(sessions)` | — | Cálculo de racha |
| `normalizePlan(planFromDb)` | — | snake_case → camelCase |

## Normalización DB → Frontend

La DB usa `snake_case`. El frontend usa `camelCase`. Siempre normalizar via `normalizePlan()` u otras funciones `normalize*` al leer de la DB. No acceder directamente a `plan.phase_2_duration` en componentes — usar `plan.foundationsDuration`.

## Convención de migraciones

Formato de nombre: `NNN_descripcion_corta.sql`
- `NNN` es el siguiente número secuencial (3 dígitos, con padding de ceros)
- Descripción en snake_case, máximo ~30 chars
- Siempre incluir cabecera con descripción y fecha

```sql
-- Migración NNN: descripción
-- Fecha: YYYY-MM-DD
-- Propósito: ...

-- Usar IF NOT EXISTS / IF EXISTS para idempotencia
ALTER TABLE tabla ADD COLUMN IF NOT EXISTS nueva_columna TEXT;
```

## Tablas actuales

`users`, `assessments`, `plans`, `exercises`, `weekly_plans`, `user_sessions`, `user_progress`, `subscriptions`

Schema completo en `supabase/migrations/001_initial_schema.sql` y `002_exercises_schema.sql`.
