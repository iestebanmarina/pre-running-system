# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-23

### Added - Fase 2: Contenido y Ejercicios
- ✅ Biblioteca completa de 30 ejercicios
  - 10 ejercicios de movilidad
  - 10 ejercicios de activación
  - 8 ejercicios de fuerza
  - 2 ejercicios de capacidad aeróbica
- ✅ Sistema de ejercicios
  - Componente ExerciseCard (variants: compact/full)
  - Página ExerciseCatalog con filtros por categoría
  - Integración en Results page mostrando ejercicios recomendados
- ✅ Plan semanal generado
  - Algoritmo weeklyPlanGenerator (430 líneas)
  - 16 semanas completas (assessment + fundamentos + transición)
  - Distribución inteligente de ejercicios por día
  - Progresión automática de running intervals
- ✅ Dashboard ejecutable
  - "Sesión de hoy" con ejercicios específicos
  - Visualización de tipo de sesión (movilidad/fuerza/running/descanso)
  - Sets, reps y notas por ejercicio
- ✅ Base de datos ampliada
  - Tabla exercises con 30 registros
  - Helpers: getAllExercises, getExercisesByCategory, getExercisesByTarget, getExercisesByIds
  - Testing page para verificar integridad de datos

### Changed
- Algoritmo de personalización expandido (5-8 ejercicios por prioridad vs 2-3 anteriormente)
- Results page ahora muestra hasta 4 ejercicios por prioridad
- ExerciseCatalog subtitle dinámico ("30 ejercicios disponibles")

### Technical
- 4 nuevas migraciones SQL (002-005)
- 6 nuevos archivos creados
- ~1,500 líneas de código añadidas
- Integración completa Supabase ↔ Plan Semanal ↔ Dashboard

---

---

## [0.1.0] - 2026-02-16

### 🎉 MVP - Fase 1 Completada

Primera versión funcional del Pre-Running System. Los usuarios pueden completar la evaluación inicial y recibir un plan personalizado.

### ✨ Añadido

#### Core Features
- **Assessment Flow**: 7 tests interactivos para evaluar limitaciones físicas
  - Test 1: Ankle ROM (Rango de movimiento de tobillo)
  - Test 2: Hip Extension (Extensión de cadera)
  - Test 3: Glute Activation (Activación de glúteos)
  - Test 4: Core Stability (Estabilidad del core)
  - Test 5: Posterior Chain Flexibility (Flexibilidad cadena posterior)
  - Test 6: Aerobic Capacity (Capacidad aeróbica)
  - Test 7: Balance/Stability (Balance y estabilidad)

- **Personalization Algorithm**: Generación de plan personalizado basado en:
  - Priorización automática de áreas (HIGH/MEDIUM/LOW)
  - Cálculo de duración del programa (6/8/10 semanas)
  - Asignación de ejercicios por área de mejora
  - Estimación de minutos semanales por categoría

- **Results Dashboard**: Visualización de resultados
  - Lista de prioridades con severidad
  - Métricas actuales vs objetivos
  - Duración estimada del programa
  - Desglose de fases (Assessment → Foundations → Transition)

#### Technical Infrastructure
- **Setup del proyecto**: React 18 + Vite + TailwindCSS
- **Routing**: React Router v6 con navegación entre pantallas
- **Database**: Supabase PostgreSQL con schema completo
  - Tabla `assessments`: Almacenamiento de evaluaciones
  - Tabla `plans`: Planes personalizados generados
  - Tablas preparadas para Fase 2: `exercises`, `weekly_plans`, `user_sessions`, `user_progress`, `subscriptions`

- **UI Components**: Sistema de componentes reutilizables
  - `Button`: Componente base con variantes (primary, outline, ghost)
  - `Card`: Contenedor con estilos consistentes
  - `Input`: Inputs con validación y manejo de errores
  - `TestCard`: Wrapper para tests de assessment
  - `PriorityBadge`: Badges para mostrar severidad (HIGH/MEDIUM/LOW)

#### Developer Experience
- **Supabase Helpers**: Abstracción de operaciones de BD
  - `saveAssessment()`: Guardar evaluaciones
  - `getLatestAssessment()`: Obtener última evaluación
  - `savePlan()`: Guardar plan personalizado
  - `getUserPlan()`: Obtener plan activo del usuario
  - Validación temporal de `userId` hasta implementar auth

- **Constants & Utils**: Configuración centralizada
  - Escalas de interpretación para cada test
  - Thresholds para clasificación de severidad
  - Valores de referencia clínicos

#### Deployment Preparation
- `.env.example` con documentación completa de variables
- `vercel.json` para configuración de deploy
- `.gitignore` actualizado (node_modules, dist, .env)
- README.md con instrucciones de setup y deploy
- CHANGELOG.md (este archivo)

### 🔧 Configuración

#### Variables de Entorno
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Scripts NPM
```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # ESLint
```

### 📝 Notas Técnicas

#### Decisiones de Arquitectura
- **Mobile-first**: Diseño responsive con TailwindCSS
- **Simplicidad**: MVP enfocado en funcionalidad core, sin over-engineering
- **Escalabilidad**: Database schema preparado para features futuras
- **Developer Experience**: Helpers y utils para facilitar desarrollo

#### Limitaciones Conocidas (MVP)
- ⚠️ **No hay autenticación**: Usando `TEMP_USER_ID` temporalmente
- ⚠️ **No hay persistencia de sesión**: Assessment se pierde al refrescar
- ⚠️ **No hay biblioteca de ejercicios**: Fase 2
- ⚠️ **No hay plan semanal ejecutable**: Fase 2
- ⚠️ **Videos son placeholders**: Se necesitan videos reales

#### Tech Debt Aceptable (se resolverá en fases posteriores)
- Autenticación real (Supabase Auth) → Fase 2 inicio
- Context API para estado global → Fase 2
- Validación de formularios mejorada → Fase 2
- Tests automatizados → Post-MVP
- Error boundaries → Post-MVP

### 🎯 Próximos Pasos

**Fase 2: Contenido & Ejecución** (Semanas 4-6)
- Implementar biblioteca de 30 ejercicios con videos
- Generación automática de planes semanales
- Vista de sesión diaria con ejercicios
- Sistema de completado de sesiones
- Re-test semanal
- Gráficos de progreso

**Fase 3: Engagement** (Semanas 7-8)
- Sistema de logros y gamificación
- Tracking de rachas
- Emails transaccionales (Resend)
- Contenido educativo inline

**Fase 4: Monetización** (Semanas 9-10)
- Tiers de pricing (Free/Pro/Pro+)
- Integración Stripe
- Paywall estratégico
- Landing page de marketing
- Analytics (GA4 + Mixpanel)

### 🐛 Bugs Conocidos

Ninguno crítico identificado en MVP.

Para reportar bugs: [GitHub Issues URL cuando esté disponible]

### 🙏 Agradecimientos

Desarrollado con **Claude Code** (Anthropic)

---

## [Unreleased]

### 🚀 En Desarrollo

_Próximas features se documentarán aquí_

---

**Formato del Changelog**:
- `✨ Añadido` para nuevas features
- `🔧 Cambiado` para cambios en funcionalidad existente
- `🐛 Corregido` para bug fixes
- `🗑️ Eliminado` para features removidas
- `⚠️ Deprecado` para features que se eliminarán
- `🔒 Seguridad` para parches de seguridad
