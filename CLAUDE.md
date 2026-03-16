# Pre-Running System

Web app que prepara a personas sedentarias para correr: programa de 12 semanas con evaluación biomecánica personalizada para reducir el 70% de lesiones en corredores principiantes.

## Fases del programa
1. **Evaluación (sem 1-2)**: 7 tests para identificar limitaciones
2. **Fundamentos (sem 3-8/10)**: Plan personalizado por disfunciones
3. **Transición (sem 9-12)**: Introducción gradual a correr

## Stack
| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Routing | React Router v6 |
| Charts | Recharts |
| State | Context API + hooks |
| Backend | Supabase (Postgres + Auth + Storage) |
| Hosting | Vercel (frontend) + Supabase (backend) |
| Pagos | Stripe (Fase 4) |
| Email | Resend.com (Fase 3) |

## Estado y tareas
Ver `ROADMAP.md` para el plan detallado y estado actual.

## Archivos clave
- `src/lib/personalization.js` — Algoritmo de generación de plan (pools, scores, duraciones)
- `src/lib/weeklyPlanGenerator.js` — Generador semanal (horario, periodización, deload)
- `src/lib/supabaseHelpers.js` — Helpers DB (sesiones, racha, normalización)
- `src/components/assessment/` — Tests de evaluación (7 tests)
- `src/pages/Assessment.jsx` — Flujo completo de evaluación
- `src/pages/Results.jsx` — Resultados con radar chart
- `src/pages/Dashboard.jsx` — Dashboard funcional
- `supabase/migrations/` — Schema actual de la DB

## Comandos
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run lint      # ESLint
npm run format    # Prettier
```

## Convenciones
- **Idioma UI**: español
- **Commits**: español, estilo convencional (`feat:`, `fix:`, `refactor:`)
- **Diseño**: mobile-first, touch targets ≥ 44px
- **Auth**: `TEMP_USER_ID = null` hasta implementar Supabase Auth
- **DB queries**: patrón `const { data, error }` con try/catch + toast en error

## Rules activas
@.claude/rules/assessment.md
@.claude/rules/personalization-algorithm.md
@.claude/rules/supabase-patterns.md
@.claude/rules/react-components.md
@.claude/rules/exercises.md
