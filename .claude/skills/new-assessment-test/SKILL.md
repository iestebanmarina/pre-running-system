# Skill: /new-assessment-test

Crea un nuevo test de evaluación con scaffolding completo: componente, integración en Assessment.jsx, migración de columna y evaluador en personalization.js.

## Uso
```
/new-assessment-test [nombre] [tipo: numeric|selector] [área]
```
Ejemplo: `/new-assessment-test shoulder_mobility numeric shoulder`

## Pasos

1. **Leer el template correcto**
   - `numeric` → leer `src/components/assessment/AnkleROMTest.jsx` como referencia
   - `selector` → leer `src/components/assessment/GluteActivationTest.jsx` como referencia

2. **Entender cómo se registran los tests**
   - Leer `src/pages/Assessment.jsx` → ver el array de tests y cómo se monta el flujo
   - Ver cómo `onComplete` pasa datos al estado global

3. **Crear el componente `[Nombre]Test.jsx`**
   - En `src/components/assessment/`
   - Misma estructura de props: `{ onComplete, initialData = {} }`
   - Para `numeric`: dos inputs (right/left) con validación de rango, interpretación inline
   - Para `selector`: opciones en botones estilizados con borde naranja al seleccionar
   - El test number será el siguiente al último existente (actualmente hay 7)
   - Texto en español

4. **Añadir al flujo en Assessment.jsx**
   - Añadir al array de tests en el orden apropiado
   - El componente debe poder recibir `initialData` para re-tests

5. **Crear migración SQL**
   - Número secuencial siguiente
   - `ALTER TABLE assessments ADD COLUMN IF NOT EXISTS {campo}_right DECIMAL;`
   - Y columna `_left` si es bilateral
   - Con cabecera y comentario de propósito

6. **Añadir evaluador en personalization.js**
   - Seguir el patrón de `evaluateAnkleROM` (numeric) o `evaluateGluteActivation` (selector)
   - Incluir comentario JSDoc con el contexto médico del umbral
   - Añadir la llamada al array de evaluadores en `generatePersonalizedPlan`
   - Añadir thresholds en la constante `THRESHOLDS`
   - Añadir nombre en español en `AREA_NAMES`
   - Crear el pool de ejercicios en `EXERCISES`

7. **Confirmar plan completo** antes de escribir ningún archivo
