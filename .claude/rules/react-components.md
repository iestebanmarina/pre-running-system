---
paths:
  - "src/components/**"
  - "src/pages/**"
---

# React Component Rules

## Patrón base

```jsx
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)

  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
}
```

Siempre `export default` al final del archivo (no inline en la declaración de función, excepto para componentes pequeños locales).

## Tokens de color para estados médicos

| Severidad | Color Tailwind | Uso |
|---|---|---|
| HIGH / SEVERO | `text-red-600`, `bg-red-50`, `border-red-500` | Prioridad alta, limitación severa |
| MEDIUM / MODERADO | `text-yellow-600`, `bg-yellow-50`, `border-yellow-500` | Prioridad media |
| LOW / ÓPTIMO | `text-green-600`, `bg-green-50`, `border-green-500` | Sin problema, buena medición |
| Acento (CTA) | `text-accent-orange`, `bg-[#FFF5F0]`, `border-accent-orange` | Botones primarios, selección activa |

No usar colores semánticos hardcoded — usar siempre los tokens de color definidos en `tailwind.config.js`.

## Touch targets (mobile-first)

- Mínimo 44×44px para cualquier elemento interactivo
- Botones con `py-3 px-6` como mínimo
- Opciones de selector con `p-4` y `w-full`
- Inputs con `py-3` para altura adecuada en móvil

## Cuándo extraer a `ui/` vs. inline

**Extraer a `src/components/ui/`** si:
- El componente se usa en 3+ lugares
- Tiene variantes controladas por props (`variant`, `size`)
- Ejemplos existentes: `Button`, `Input`, `Card`

**Inline** si:
- Específico de un solo test o página
- Menos de ~30 líneas
- No tiene variants

## Selectors (tipo GluteActivationTest)

Para inputs de tipo selector (opciones discretas), el patrón es:
```jsx
<button
  type="button"
  onClick={() => onChange(option.value)}
  className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 ${
    value === option.value
      ? 'border-accent-orange bg-[#FFF5F0]'
      : 'border-border hover:border-muted'
  }`}
>
```

## Validación en tests de assessment

- Mostrar error solo si el campo tiene valor (no al primer render)
- Mostrar interpretación solo si el valor es válido (no si hay error)
- El botón "Continuar" siempre `disabled={!isFormValid}`

## Estructura de página

```
<div className="w-full max-w-4xl mx-auto p-4 space-y-6">
  <div>                    {/* Título + descripción */}
  <TestInstructions ... /> {/* Instrucciones del test */}
  <div className="grid">   {/* Inputs */}
  <div className="flex justify-end">  {/* Botón continuar */}
```
