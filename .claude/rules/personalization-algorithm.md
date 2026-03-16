---
paths:
  - "src/lib/personalization.js"
  - "src/lib/weeklyPlanGenerator.js"
---

# Personalization Algorithm Rules

## Estructura de pools de ejercicios

Cada área tiene 3 fases + `all`:
```js
AREA: {
  phase1: [...],  // semanas 1–(foundationsDuration/3): CNS re-educación, aislamiento
  phase2: [...],  // siguiente tercio: movimientos multi-articulares, estabilidad con carga
  phase3: [...],  // último tercio: compuestos, específicos de carrera
  all: [...]      // todos los IDs del área (para mostrar en results, búsquedas)
}
```

`getExercisesForPhase(area, weekNumber, foundationsDuration)` selecciona el pool correcto.

## Umbrales médicos (THRESHOLDS)

| Área | HIGH | MEDIUM | Target | Minutos/semana |
|---|---|---|---|---|
| ANKLE_ROM | `<10 cm` | `10-12 cm` | `13 cm` | 70 (HIGH) / 35 (MED) |
| HIP_EXTENSION | `<-5°` | asimetría >5° | `5°` | 70 |
| GLUTE_ACTIVATION | `hamstrings_first` | — | `glute_first` | 105 |
| CORE | `<30s` | `30-60s` | `60s` | 60 (HIGH) / 40 (MED) |
| POSTERIOR_CHAIN | `thighs`/`knees` | — | `shins` | 40 (siempre MEDIUM, nunca HIGH) |
| AEROBIC | `under_30min_hard` | `30-45min_mild` | `45min_easy` | 150 |
| BALANCE | `<40s` o asimetría >15s | — | `60s` | 30 (siempre MEDIUM) |

**Nota**: `POSTERIOR_CHAIN` y `BALANCE` nunca generan prioridades HIGH.

## Sistema de scoring continuo (0–20)

```
HIGH priority:   +3 pts
MEDIUM priority: +1 pt
Asimetría:       +0.5 pts por área afectada
Casos extremos:  +1 pt si tobillo <7cm, plancha <15s, o cadera <-10°
```

Mapeo score → duración de fundamentos:
- 0–3 → 6 semanas
- 4–6 → 7 semanas
- 7–9 → 8 semanas
- 10–12 → 9 semanas
- 13+ → 10 semanas

## Semanas de deload

- Semana 4: siempre
- Semana 8: si foundationsDuration ≥ 9

## Retorno de `generatePersonalizedPlan(assessmentData)`

```js
{
  success: boolean,
  plan: {
    priorities: Array<Priority>,      // ordenadas: HIGH primero, luego por weeklyMinutes desc
    foundationsDuration: number,       // 6-10
    transitionDuration: number,        // siempre 4
    estimatedWeeks: number,            // = foundationsDuration
    totalWeeks: number,                // foundationsDuration + 4
    deloadWeeks: number[],             // [4] o [4, 8]
    aerobicLevel: 'beginner'|'standard'|'advanced',
    userProfile: { availableDays, sessionDuration, equipment }
  },
  warnings: string[],
  metadata: {
    testsCompleted, testsTotal,
    highPriorities, mediumPriorities,
    severityScore, hasAsymmetry,
    assessmentQuality: 'complete'|'partial'|'incomplete'
  }
}
```

## Reglas de periodización (weeklyPlanGenerator.js)

Los tipos de sesión rotan según la semana dentro del programa:
- **Semanas de deload**: volumen reducido (~60%), sin nuevos ejercicios
- **Fase 1** (isolation): prioridad a activación y movilidad aislada
- **Fase 2** (integration): añadir movimientos de estabilidad con carga
- **Fase 3** (compound): movimientos compuestos y específicos de carrera

El horario semanal se construye desde `userProfile.availableDays` — nunca añadir días que el usuario no marcó.

## Validación mínima

Requiere al menos 3 tests completados para generar plan. Con menos, retorna `success: false` con `errors`.
