# Pre-Running System 🏃

**Prepara tu cuerpo para correr sin lesiones**

Pre-Running System es una aplicación web que ayuda a personas sedentarias a preparar su cuerpo para correr a través de un programa personalizado de 12 semanas, evitando el 70% de lesiones que afectan a corredores principiantes.

---

## 🎯 El Problema

- **10+ millones** de personas corren en España
- **70%** se lesionan en su primer año
- La mayoría son sedentarios (8+ horas/día sentados) con disfunciones estructurales
- Empiezan a correr sin preparación → lesiones predecibles en 3-6 semanas

## 💡 La Solución

Un programa de **12 semanas** dividido en 3 fases:

1. **Evaluación (Semanas 1-2)**: 7 tests específicos para identificar limitaciones individuales
2. **Fundamentos (Semanas 3-8/10)**: Plan personalizado para corregir disfunciones (movilidad, activación, fuerza, capacidad)
3. **Transición (Semanas 9-12)**: Introducción gradual al running

### Propuesta de Valor

- **Camino tradicional**: 0 preparación → 70% lesión en 6 semanas → frustración, abandono
- **Pre-Running System**: 12 semanas prep → 5-10% lesión → correr 10-20 años sin lesiones

---

## 🛠️ Tech Stack

### Frontend
- **React 18** con Vite
- **TailwindCSS** para estilos
- **React Router v6** para navegación
- **React Context API** para estado global

### Backend
- **Supabase** (BaaS)
  - PostgreSQL database
  - Authentication (email/password, Google)
  - Storage (videos, imágenes)
  - Real-time subscriptions

### Hosting
- **Vercel** para frontend
- **Supabase** para backend (hosted)

### Futuro (Fases 2-4)
- Stripe (pagos y suscripciones)
- Resend.com (emails transaccionales)
- Google Analytics 4 + Mixpanel (analytics)

---

## 🚀 Setup Local

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita)

### Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPO]
cd pre-training-system
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y completar con tus credenciales de Supabase
# VITE_SUPABASE_URL=tu_url_de_supabase
# VITE_SUPABASE_ANON_KEY=tu_anon_key
```

Para obtener las credenciales de Supabase:
- Ve a https://app.supabase.com
- Crea un nuevo proyecto (o selecciona uno existente)
- Ve a Settings > API
- Copia "Project URL" y "anon public" key

4. **Configurar la base de datos**
```bash
# Ejecuta las migraciones SQL desde supabase/migrations/
# en el SQL Editor de tu proyecto Supabase
```

5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview de build de producción

# Código
npm run lint         # Ejecuta ESLint
```

---

## 🌐 Deploy

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
   - Ve a https://vercel.com
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

2. **Configurar variables de entorno**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Añade:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel hará auto-deploy en cada push a `main`
   - También crea preview deployments para PRs

**Link de producción**: [Pendiente - se añadirá tras primer deploy]

---

## 📊 Estado Actual - Fase 1 (MVP)

### ✅ Completado
- [x] Setup inicial (Vite + React + TailwindCSS)
- [x] Integración con Supabase
- [x] Estructura de componentes base
- [x] 7 tests de assessment con validación
- [x] Algoritmo de personalización
- [x] Pantalla de resultados con prioridades
- [x] Database schema completo
- [x] Preparación para deploy

### 🔜 Próximos Pasos

**Fase 2: Contenido & Ejecución (Semanas 4-6)**
- [ ] Biblioteca de ejercicios (30 ejercicios con videos)
- [ ] Generación de plan semanal
- [ ] Vista de sesión (ejercicios del día)
- [ ] Marcar sesión como completada
- [ ] Re-test semanal
- [ ] Gráficos de progreso

**Fase 3: Engagement (Semanas 7-8)**
- [ ] Sistema de logros
- [ ] Tracking de rachas
- [ ] Notificaciones por email
- [ ] Contenido educativo
- [ ] Flow de ajuste (si hay dolor)

**Fase 4: Monetización (Semanas 9-10)**
- [ ] Tiers de pricing (Free/Pro/Pro+)
- [ ] Integración Stripe
- [ ] Paywall (4 semanas gratis, luego upgrade)
- [ ] Landing page
- [ ] Analytics
- [ ] Contenido de marketing

---

## 📁 Estructura del Proyecto

```
pre-training-system/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # UI base (Button, Input, Card)
│   │   ├── assessment/     # Componentes específicos de assessment
│   │   └── ...
│   ├── pages/              # Páginas (rutas)
│   │   ├── Assessment.jsx
│   │   ├── Results.jsx
│   │   └── ...
│   ├── lib/                # Utilidades y configs
│   │   ├── supabase.js     # Cliente Supabase
│   │   ├── supabaseHelpers.js  # Funciones de DB
│   │   ├── personalization.js  # Algoritmo de personalización
│   │   └── constants.js    # Constantes
│   ├── App.jsx
│   └── main.jsx
├── public/                 # Assets estáticos
├── supabase/              # Migraciones y funciones
│   └── migrations/
├── .env.example           # Template de variables de entorno
├── vercel.json            # Config de Vercel
├── package.json
└── README.md             # Este archivo
```

---

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Si quieres contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Proprietary - Todos los derechos reservados

---

## 📞 Contacto

**Producto**: [Tu Nombre]
**Email**: support@prerunningsystem.com
**Repositorio**: [GitHub URL cuando esté disponible]

---

## 🎯 Visión

Pre-Running System tiene como objetivo convertirse en la plataforma de referencia para **preparación física pre-running**, ayudando a miles de personas a comenzar a correr de forma segura y sostenible.

### Roadmap Futuro
- Apps nativas (React Native)
- Verificación de forma con IA (pose estimation)
- Features sociales/comunidad
- Más deportes (Pre-Padel, Pre-CrossFit)
- Matching con coaches
- Integración con wearables (Apple Watch, Garmin)

---

**Última actualización**: Febrero 2026
**Versión**: 0.1.0 (MVP - Fase 1)
**Estado**: 🚀 Listo para deploy
