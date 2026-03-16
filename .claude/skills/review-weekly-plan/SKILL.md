# Skill: /review-weekly-plan

Traza la ejecución del algoritmo de personalización y del generador semanal con datos de entrada específicos, e identifica inconsistencias.

## Uso
```
/review-weekly-plan [descripción del usuario o JSON de assessment]
```
Ejemplo: `/review-weekly-plan tobillo derecho 8cm, izquierdo 11cm, glúteo hamstrings_first, plancha 20s`

## context: fork

Este skill trabaja con una copia del contexto para no contaminar la conversación principal con datos de debug.

## Pasos

1. **Parsear la entrada**
   - Si es descripción natural → convertir a objeto assessment con los campos correctos
   - Si es JSON → validar estructura

2. **Leer el algoritmo**
   - Lee `src/lib/personalization.js` completo
   - Lee `src/lib/weeklyPlanGenerator.js` completo

3. **Trazar la ejecución paso a paso**
   - Ejecutar mentalmente `validateAssessmentData` — ¿pasa la validación?
   - Ejecutar cada evaluador — ¿qué prioridades activa?
   - Calcular `calculateSeverityScore` — ¿cuántos puntos? ¿por qué?
   - Calcular `calculateProgramDuration` — ¿qué duración y por qué?
   - Identificar `deloadWeeks`

4. **Output estructurado**
   ```
   PRIORIDADES ACTIVADAS:
   - [HIGH] Tobillo: 8cm < 10cm → 3pts + bonus extremo 0pts
   - [HIGH] Glúteo: hamstrings_first → 3pts
   - [HIGH] Core: 20s < 30s → 3pts

   SCORE TOTAL: 9 → 8 semanas de fundamentos
   DELOAD WEEKS: [4]
   TOTAL: 12 semanas

   POOLS USADOS (semana 1 de 8, phase1 = sem 1-3):
   - Tobillo: ankle_wall_mobility, ankle_circles, dorsiflexion_active
   - Glúteo: glute_bridge, clams, fire_hydrants, donkey_kicks
   - Core: dead_bug, bird_dog, plank_progression

   INCONSISTENCIAS DETECTADAS:
   - Ninguna / [lista de problemas si los hay]
   ```

5. **Detectar inconsistencias**
   - ¿Ejercicios en pools que no corresponden a la fase (ej. compound en phase1)?
   - ¿Áreas con prioridad HIGH pero weeklyMinutes insuficientes?
   - ¿Campos del assessment que faltan para calcular correctamente?
