---
paths:
  - "src/components/assessment/**"
  - "src/pages/Assessment*"
---

# Assessment Rules

## Los 7 tests

| # | Test | Tipo input | Campos DB | Rangos válidos |
|---|---|---|---|---|
| 1 | Tobillo (dorsiflexión) | Numérico (cm) | `ankle_rom_right`, `ankle_rom_left` | 5–20 cm |
| 2 | Extensión de cadera | Selector visual | `hip_extension_right`, `hip_extension_left` | -15 a +20° |
| 3 | Activación glúteo | Selector 3 opciones | `glute_activation_right`, `glute_activation_left` | `glute_first` \| `simultaneous` \| `hamstrings_first` |
| 4 | Core (plancha) | Numérico (seg) | `core_plank_time` | 5–300 s |
| 5 | Cadena posterior | Selector 4 opciones | `posterior_chain_flexibility` | `toes` \| `shins` \| `knees` \| `thighs` |
| 6 | Capacidad aeróbica | Selector 3 opciones | `aerobic_capacity` | `45min_easy` \| `30-45min_mild` \| `under_30min_hard` |
| 7 | Equilibrio | Numérico (seg) | `balance_right`, `balance_left` | 0–300 s |

## Umbrales de interpretación (inline en los tests)

**Tobillo**: `<10` → LIMITACIÓN SEVERA (rojo) / `10-12` → MODERADA (amarillo) / `12-15` → ÓPTIMO (verde) / `>15` → EXCELENTE
**Cadera**: `elevated` = -10°, `horizontal` = 0°, `below` = +15°
**Glúteo**: `glute_first` → CORRECTO / `simultaneous` → ACEPTABLE / `hamstrings_first` → COMPENSACIÓN
**Core**: `<30s` → BAJO / `30-60s` → MODERADO / `>60s` → ÓPTIMO
**Cadena posterior**: `thighs`/`knees` → LIMITACIÓN / `shins` → NORMAL / `toes` → ÓPTIMO
**Aeróbico**: `under_30min_hard` → BAJO / `30-45min_mild` → MODERADO / `45min_easy` → ÓPTIMO
**Equilibrio**: `<40s` → LIMITACIÓN / `40-60s` → MODERADO / `>60s` → ÓPTIMO

## Interface de props (todos los test components)

```jsx
ComponentName.propTypes = {
  onComplete: PropTypes.func.isRequired,  // ({ field_right, field_left }) => void
  initialData: PropTypes.shape({ ... })   // para re-test: pre-rellenar con datos anteriores
}
```

`onComplete` se llama con un objeto que contiene exactamente los campos DB del test (snake_case).

## ScreeningStep (antes del test 1)

Campos que guarda en `assessmentData`:
- `screening_pain`: boolean — ¿dolor actual?
- `screening_injury`: boolean — ¿lesión reciente?
- `screening_hours_sitting`: number — horas sentado/día (1–16)
- `screening_running_history`: string — `never` | `beginner` | `intermediate` | `advanced`

## UserProfileStep (después del screening)

Campos que guarda en `assessmentData` (prefijo `profile_`):
- `profile_available_days`: string[] — días disponibles para entrenar (`['monday', 'wednesday', 'friday']`)
- `profile_session_duration`: number — duración preferida en minutos (15–90)
- `profile_equipment`: string — `bodyweight` | `basic` | `gym`

## Patrón de asimetría bilateral

Los tests con dos lados (tobillo, cadera, equilibrio) deben:
1. Mostrar interpretación individual por lado
2. El algoritmo usa `Math.min(right, left)` para severidad principal
3. Si `|right - left| > umbral`, se detecta asimetría (ver `detectAsymmetry` en personalization.js)

Umbrales de asimetría: tobillo = 2 cm, cadera = 5°, equilibrio = 15 s
