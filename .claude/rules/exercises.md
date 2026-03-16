---
paths:
  - "src/lib/exerciseHelpers.js"
  - "supabase/migrations/*exercise*"
  - "supabase/migrations/*seed*"
---

# Exercise Rules

## Schema del objeto ejercicio (tabla `exercises`)

```sql
id              TEXT PRIMARY KEY    -- 'ankle_wall_mobility' (snake_case, target anatómico primero)
name            TEXT NOT NULL       -- Nombre en inglés
name_es         TEXT                -- Nombre en español
category        TEXT NOT NULL       -- 'mobility' | 'activation' | 'strength' | 'capacity'
target          TEXT                -- target anatómico primario
description     TEXT                -- 1-2 frases explicando el propósito biomecánico
instructions    JSONB               -- Array de strings: pasos numerados
common_mistakes JSONB               -- Array de strings: errores frecuentes
equipment       JSONB               -- Array de strings: equipamiento necesario
duration_minutes INTEGER
difficulty      TEXT                -- 'beginner' | 'intermediate' | 'advanced'
sets            INTEGER
reps            INTEGER             -- NULL si se mide por tiempo
hold_seconds    INTEGER             -- NULL si se mide por reps
```

## Convención de IDs

Formato: `{target}_{descriptor}` en snake_case

Ejemplos correctos: `ankle_wall_mobility`, `hip_flexor_stretch`, `glute_bridge`, `core_plank_progression`
Incorrecto: `mobilityAnkle`, `bridge_glute`, `plank`

## Taxonomía de categorías

| Categoría | Propósito | Fase típica |
|---|---|---|
| `mobility` | Aumentar ROM articular | Phase 1–2 |
| `activation` | Re-educar patrones neuromusculares | Phase 1–2 |
| `strength` | Fortalecer músculos objetivo | Phase 2–3 |
| `capacity` | Resistencia aeróbica / cardiovascular | Phase 1–3 |

## Pools por área (qué ejercicios van dónde)

Ver `src/lib/personalization.js` → constante `EXERCISES` para los pools completos.

Resumen de targets por área:
- `ANKLE_ROM` → target: `ankle` — categorías: mobility, strength
- `HIP_EXTENSION` → target: `hip` — categorías: mobility
- `GLUTE_ACTIVATION` → target: `glute` — categorías: activation, strength
- `CORE` → target: `core` — categorías: activation, strength
- `POSTERIOR_CHAIN` → target: `hamstrings`/`spine` — categorías: mobility, strength
- `AEROBIC` → target: `cardiovascular` — categorías: capacity
- `BALANCE` → target: `balance` — categorías: activation, strength

## Formato INSERT en migraciones

```sql
INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'exercise_id',
  'English Name',
  'Nombre en Español',
  'mobility',
  'ankle',
  'Descripción del propósito biomecánico.',
  '["Paso 1", "Paso 2", "Paso 3"]'::jsonb,
  '["Error común 1", "Error común 2"]'::jsonb,
  '["Equipamiento 1"]'::jsonb,
  5,         -- duration_minutes
  'beginner', -- difficulty
  3,         -- sets
  10,        -- reps (NULL si es isométrico)
  NULL       -- hold_seconds (NULL si es por reps)
);
```

Al añadir un ejercicio, también actualizar su pool en `src/lib/personalization.js`.
