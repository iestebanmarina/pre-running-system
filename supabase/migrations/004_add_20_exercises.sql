-- Add 20 additional exercises to complete exercise library
-- Exercises 11-30: Movilidad (6), Activación (7), Fuerza (6), Capacidad (1)

-- ============================================================
-- MOVILIDAD (6 ejercicios: 11-16)
-- ============================================================

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'couch_stretch',
  'Couch Stretch',
  'Estiramiento de Sofá',
  'mobility',
  'hip',
  'Estiramiento profundo del flexor de cadera (psoas y recto femoral) para mejorar la extensión de cadera, especialmente efectivo para sedentarios.',
  '["Coloca una rodilla contra la pared o sofá, pierna doblada hacia atrás", "Pie trasero apoyado verticalmente contra la pared", "Pierna delantera adelantada en ángulo de 90 grados", "Activa el glúteo de la pierna trasera fuertemente", "Lleva la cadera hacia adelante manteniendo el torso vertical", "Siente el estiramiento profundo en la parte frontal de la cadera", "Mantén sin arquear la espalda baja"]'::jsonb,
  '["Arquear la espalda baja (compensación)", "No activar el glúteo trasero", "Inclinarse hacia adelante", "Forzar la posición con dolor agudo"]'::jsonb,
  '["Sofá o pared", "Esterilla o cojín para rodilla"]'::jsonb,
  5,
  'intermediate',
  2,
  NULL,
  60
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'ankle_circles',
  'Ankle Circles',
  'Círculos de Tobillo',
  'mobility',
  'ankle',
  'Movilidad rotacional del tobillo en todos los planos de movimiento, mejora la propiocepción y prepara el tobillo para el movimiento multidireccional.',
  '["Siéntate o mantente de pie apoyado en una pared", "Levanta un pie del suelo", "Dibuja círculos grandes con los dedos del pie", "Realiza 15 círculos en sentido horario", "Luego 15 círculos en sentido antihorario", "Mantén el movimiento fluido y controlado", "Repite con el otro pie"]'::jsonb,
  '["Hacer círculos demasiado pequeños", "Mover la rodilla en lugar del tobillo", "Hacer el movimiento muy rápido sin control", "No completar el rango completo de movimiento"]'::jsonb,
  '["Ninguno", "Opcional: silla para apoyo"]'::jsonb,
  5,
  'beginner',
  3,
  15,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'hip_car',
  'Hip CAR',
  'Círculos Controlados de Cadera',
  'mobility',
  'hip',
  'Controlled Articular Rotations para la cadera. Mejora el control motor y rango de movimiento activo de la cadera en todos los ángulos.',
  '["Posición de cuadrupedia estable", "Mantén el core activado para evitar movimiento de columna", "Levanta una rodilla hacia el pecho", "Abre la rodilla hacia el lateral manteniendo 90 grados", "Lleva la rodilla hacia atrás en extensión", "Cierra el círculo volviendo al centro", "Movimiento lento y controlado", "Repite 10 veces por dirección"]'::jsonb,
  '["Mover la columna o cadera de apoyo", "Hacer el movimiento con impulso", "No mantener la rodilla a 90 grados", "Perder la activación del core"]'::jsonb,
  '["Esterilla"]'::jsonb,
  8,
  'intermediate',
  2,
  10,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'thoracic_rotation',
  'Thoracic Rotation',
  'Rotación Torácica',
  'mobility',
  'posterior_chain',
  'Movilidad de la columna torácica para mejorar la postura de carrera y permitir un balanceo natural de brazos sin compensaciones lumbares.',
  '["Posición de cuadrupedia o sentado sobre talones", "Coloca una mano detrás de la cabeza", "Mano contraria apoyada en el suelo", "Rota el torso llevando el codo hacia arriba", "Sigue el codo con la mirada", "Mantén la cadera estable sin rotar", "Siente la rotación en la parte media de la espalda", "Vuelve al centro y repite"]'::jsonb,
  '["Rotar la cadera en lugar de la columna torácica", "Mover solo el cuello", "No seguir con la mirada", "Forzar el rango con dolor"]'::jsonb,
  '["Esterilla"]'::jsonb,
  5,
  'beginner',
  3,
  12,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'toe_walking',
  'Toe Walking',
  'Caminar en Puntas',
  'mobility',
  'ankle',
  'Fortalecimiento activo del tobillo y gemelos mientras se trabaja el rango final de flexión plantar, fundamental para la fase de propulsión en carrera.',
  '["Ponte de puntillas lo más alto posible", "Camina hacia adelante manteniendo los talones elevados", "Mantén las piernas rectas (sin flexionar rodillas)", "Brazos relajados o en jarra", "Realiza 20 pasos manteniendo la altura constante", "Descansa y repite", "Progresión: aumenta velocidad o distancia"]'::jsonb,
  '["Bajar los talones durante la caminata", "Flexionar las rodillas", "Inclinarse hacia adelante", "Pasos demasiado largos que rompen el equilibrio"]'::jsonb,
  '["Ninguno", "Superficie plana y segura"]'::jsonb,
  5,
  'beginner',
  3,
  20,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'worlds_greatest_stretch',
  'World''s Greatest Stretch',
  'El Mejor Estiramiento del Mundo',
  'mobility',
  'hip',
  'Estiramiento dinámico multi-articular que combina movilidad de cadera, rotación torácica y estabilidad. Perfecto para warm-up pre-entrenamiento.',
  '["Posición de estocada baja (rodilla trasera en suelo)", "Coloca ambas manos dentro del pie delantero", "Baja el codo del mismo lado hacia el suelo", "Siente el estiramiento en flexor de cadera trasero", "Rota el torso llevando el brazo contrario hacia arriba", "Sigue la mano con la mirada", "Vuelve al centro, mano al suelo", "Repite 8 veces por lado"]'::jsonb,
  '["No bajar suficiente el codo (falta movilidad cadera)", "Rotar sin estabilizar la cadera", "No seguir con la mirada en la rotación", "Hacer el movimiento muy rápido"]'::jsonb,
  '["Esterilla"]'::jsonb,
  8,
  'intermediate',
  3,
  8,
  NULL
);

-- ============================================================
-- ACTIVACIÓN (7 ejercicios: 17-23)
-- ============================================================

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'fire_hydrants',
  'Fire Hydrants',
  'Hidrantes',
  'activation',
  'glute',
  'Activación del glúteo medio para estabilidad lateral de cadera. Previene el colapso de rodilla hacia dentro durante la carrera (Trendelenburg).',
  '["Posición de cuadrupedia (manos bajo hombros, rodillas bajo caderas)", "Mantén la espalda neutral y core activado", "Levanta una rodilla hacia el lateral manteniendo 90 grados", "No rotes la cadera ni la columna", "Siente la contracción en el lateral del glúteo", "Mantén 1 segundo arriba", "Baja controlado sin tocar el suelo", "Completa todas las reps de un lado antes de cambiar"]'::jsonb,
  '["Rotar la cadera o columna al levantar", "Usar impulso en lugar de control muscular", "No mantener los 90 grados en la rodilla", "Levantar demasiado perdiendo la forma"]'::jsonb,
  '["Esterilla", "Opcional: banda elástica alrededor de muslos para progresión"]'::jsonb,
  8,
  'beginner',
  3,
  15,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'banded_walks',
  'Banded Lateral Walks',
  'Caminatas Laterales con Banda',
  'activation',
  'glute',
  'Activación del glúteo medio bajo tensión constante. Simula la estabilización necesaria en la fase de apoyo monopodal de la carrera.',
  '["Coloca banda elástica alrededor de los muslos (sobre rodillas)", "Media sentadilla con pies a anchura de caderas", "Mantén tensión constante en la banda", "Da un paso lateral amplio con un pie", "Sigue con el otro pie manteniendo tensión", "No juntes los pies completamente", "15 pasos a un lado, luego 15 al otro", "Mantén el torso erguido y core activado"]'::jsonb,
  '["Perder la posición de sentadilla al caminar", "Juntar demasiado los pies (perder tensión)", "Inclinarse hacia adelante", "Pasos demasiado pequeños (banda sin tensión)", "Rotar el tronco"]'::jsonb,
  '["Banda elástica resistencia media"]'::jsonb,
  8,
  'beginner',
  3,
  15,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'single_leg_bridge',
  'Single Leg Bridge',
  'Puente a Una Pierna',
  'activation',
  'glute',
  'Activación unilateral del glúteo mayor con componente de estabilidad. Prepara para el patrón de extensión de cadera en apoyo monopodal.',
  '["Túmbate boca arriba, rodillas flexionadas", "Extiende una pierna al frente (paralela al muslo de apoyo)", "Activa el glúteo de la pierna de apoyo", "Empuja con el talón y sube la cadera", "Forma línea recta de rodilla a hombros", "Mantén la cadera nivelada (no rotar)", "Contrae el glúteo arriba 2 segundos", "Baja controlado y repite"]'::jsonb,
  '["Rotar la cadera (una cadera más baja que otra)", "Empujar con isquios en lugar de glúteo", "Arquear la espalda baja", "No mantener la pierna extendida alineada", "Bajar con gravedad sin control"]'::jsonb,
  '["Esterilla"]'::jsonb,
  10,
  'intermediate',
  3,
  12,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'bird_dog',
  'Bird Dog',
  'Perro-Pájaro',
  'activation',
  'core',
  'Estabilidad anti-rotación del core mientras se mueven las extremidades. Patrón diagonal similar al balanceo de brazos opuesto a piernas en carrera.',
  '["Posición de cuadrupedia, columna neutral", "Activa el core (zona lumbar pegada)", "Extiende brazo derecho adelante y pierna izquierda atrás simultáneamente", "Forma línea recta de mano a pie", "No rotes la cadera ni la columna", "Mantén 3 segundos sin moverte", "Vuelve al centro con control", "Alterna: brazo izquierdo + pierna derecha"]'::jsonb,
  '["Rotar la cadera al extender la pierna", "Arquear la espalda baja", "Levantar la pierna demasiado (compensando con espalda)", "Hacer el movimiento con prisa sin estabilizar", "No formar línea recta (brazo o pierna demasiado altos)"]'::jsonb,
  '["Esterilla"]'::jsonb,
  8,
  'intermediate',
  3,
  10,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'pallof_press',
  'Pallof Press',
  'Press Pallof',
  'activation',
  'core',
  'Anti-rotación del core bajo tensión lateral. Mejora la estabilidad rotacional necesaria para mantener la pelvis neutral durante la carrera.',
  '["Ancla banda elástica a altura del pecho", "Posición lateral a la banda, pies a anchura de hombros", "Agarra la banda con ambas manos al pecho", "Activa el core, pies firmemente plantados", "Extiende los brazos al frente resistiendo la rotación", "Mantén el torso completamente inmóvil", "Vuelve al pecho con control", "Completa todas las reps antes de cambiar de lado"]'::jsonb,
  '["Rotar el torso hacia la banda", "Usar los brazos en lugar del core", "Arquear o flexionar la espalda", "No mantener los pies estables", "Hacer el movimiento muy rápido"]'::jsonb,
  '["Banda elástica resistencia media-alta", "Punto de anclaje estable a altura del pecho"]'::jsonb,
  8,
  'intermediate',
  3,
  12,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'glute_kickback',
  'Glute Kickbacks',
  'Patada de Glúteo',
  'activation',
  'glute',
  'Activación del glúteo mayor con énfasis en la extensión de cadera, el movimiento principal de la fase de impulso en carrera.',
  '["Posición de cuadrupedia estable", "Core activado, columna neutral", "Mantén una rodilla flexionada a 90 grados", "Eleva la pierna hacia atrás empujando el talón al techo", "No arquees la espalda, todo el movimiento es de cadera", "Contrae el glúteo fuertemente arriba", "Mantén 1 segundo", "Baja con control sin tocar el suelo"]'::jsonb,
  '["Arquear la espalda lumbar al subir la pierna", "Usar impulso en lugar de contracción", "Rotar la cadera", "No apretar el glúteo arriba", "Bajar demasiado rápido"]'::jsonb,
  '["Esterilla", "Opcional: tobillera con peso para progresión"]'::jsonb,
  8,
  'beginner',
  3,
  15,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'side_plank',
  'Side Plank',
  'Plancha Lateral',
  'activation',
  'core',
  'Fortalecimiento del core lateral (oblicuos y cuadrado lumbar) para resistir la inclinación lateral durante el apoyo monopodal en carrera.',
  '["Túmbate de lado, antebrazo apoyado (codo bajo hombro)", "Pies apilados o pie superior adelantado (más fácil)", "Levanta la cadera formando línea recta de cabeza a pies", "No dejes caer la cadera", "Activa el core y glúteo del lado inferior", "Brazo libre: arriba o en cadera", "Mira al frente, cuello neutro"]'::jsonb,
  '["Cadera cayendo hacia el suelo", "Rotar el torso hacia adelante o atrás", "Hombro encogido hacia la oreja", "No activar el glúteo (permite cadera caída)", "Aguantar la respiración"]'::jsonb,
  '["Esterilla"]'::jsonb,
  6,
  'intermediate',
  3,
  NULL,
  30
);

-- ============================================================
-- FUERZA (6 ejercicios: 24-29)
-- ============================================================

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'bulgarian_split_squat',
  'Bulgarian Split Squat',
  'Sentadilla Búlgara',
  'strength',
  'glute',
  'Fuerza unilateral de glúteo y cuádriceps. Excelente para corregir desbalances entre piernas y mejorar estabilidad monopodal.',
  '["Coloca un pie trasero elevado en banco/step (30-40cm)", "Pie delantero adelantado, suficiente distancia", "Torso erguido, core activado", "Baja flexionando rodilla delantera", "Rodilla alineada con el pie (no colapsar)", "Baja hasta muslo paralelo al suelo", "Empuja con talón delantero para subir", "Siente el trabajo en glúteo y cuádriceps delanteros"]'::jsonb,
  '["Distancia incorrecta (muy cerca o muy lejos del banco)", "Rodilla colapsando hacia dentro", "Inclinarse demasiado hacia adelante", "Apoyar peso en pierna trasera", "No bajar lo suficiente", "Perder equilibrio lateral"]'::jsonb,
  '["Banco, step o silla estable (30-40cm altura)", "Opcional: mancuernas para progresión"]'::jsonb,
  12,
  'intermediate',
  3,
  10,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'single_leg_rdl',
  'Single Leg RDL',
  'Peso Muerto Rumano a Una Pierna',
  'strength',
  'glute',
  'Fortalecimiento de cadena posterior unilateral con gran componente de balance y estabilidad. Fundamental para la fase de apoyo en carrera.',
  '["Apoyo monopodal, rodilla ligeramente flexionada", "Brazos colgando o en jarra para balance", "Inclínate hacia adelante desde la cadera (bisagra)", "Pierna libre se extiende hacia atrás", "Mantén la espalda recta (no redondear)", "Baja hasta sentir estiramiento en isquio de apoyo", "Forma línea recta de cabeza a pie trasero", "Vuelve apretando el glúteo de apoyo"]'::jsonb,
  '["Redondear la espalda", "Rotar la cadera (cadera del pie libre cae)", "Flexionar demasiado la rodilla de apoyo", "No mantener línea recta (torso-pierna)", "Bajar con prisa sin control", "Tocar el suelo con las manos (bajar demasiado)"]'::jsonb,
  '["Ninguno", "Opcional: mancuerna en mano contraria para progresión"]'::jsonb,
  12,
  'intermediate',
  3,
  10,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'step_ups',
  'Step Ups',
  'Subidas a Cajón',
  'strength',
  'glute',
  'Fuerza funcional de glúteo y cuádriceps en patrón de subida. Simula el impulso vertical necesario en carrera, especialmente en cuestas.',
  '["Colócate frente a cajón o step (30-40cm altura)", "Coloca completamente un pie en el cajón", "Empuja con el talón del pie elevado para subir", "No uses impulso del pie trasero (queda relajado)", "Sube hasta estar completamente erguido en el cajón", "Contrae el glúteo de la pierna de trabajo arriba", "Baja controlado con el mismo pie liderando", "Completa todas las reps de un lado antes de cambiar"]'::jsonb,
  '["Usar impulso del pie trasero (trampa)", "No subir completamente (quedarse en el cajón sin extensión)", "Rodilla colapsando hacia dentro", "Inclinarse excesivamente hacia adelante", "Bajar dejándose caer", "Cajón demasiado alto (compensaciones)"]'::jsonb,
  '["Cajón, step o banco estable (30-40cm)", "Opcional: mancuernas para progresión"]'::jsonb,
  10,
  'beginner',
  3,
  12,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'hip_thrust',
  'Hip Thrust',
  'Empuje de Cadera',
  'strength',
  'glute',
  'Ejercicio de máxima activación del glúteo mayor. Desarrolla fuerza de extensión de cadera fundamental para el impulso en carrera.',
  '["Apoya la parte superior de la espalda en banco (omóplatos en el borde)", "Pies apoyados a anchura de caderas, rodillas flexionadas", "Barra o peso sobre la cadera (opcional: solo peso corporal)", "Empuja con los talones llevando la cadera hacia arriba", "Forma línea recta de rodillas a hombros en la cima", "Aprieta fuertemente los glúteos arriba", "Mantén 2 segundos la contracción", "Baja controlado sin apoyar completamente"]'::jsonb,
  '["Arquear la espalda baja al subir", "Empujar con la planta en lugar del talón", "No apretar glúteos arriba (usar espalda)", "Subir demasiado (hiperextensión lumbar)", "No alcanzar línea recta (quedarse corto)", "Bajar demasiado rápido"]'::jsonb,
  '["Banco o step estable", "Opcional: barra, disco o mancuerna para progresión", "Opcional: almohadilla para cadera"]'::jsonb,
  12,
  'intermediate',
  3,
  15,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'calf_raises',
  'Calf Raises',
  'Elevaciones de Gemelos',
  'strength',
  'ankle',
  'Fortalecimiento de gemelos (gastrocnemio y sóleo) para mejorar la propulsión en la fase final del apoyo durante la carrera.',
  '["De pie, pies a anchura de caderas", "Opcional: apoya las manos en pared para balance", "Elévate sobre las puntas de los pies lo más alto posible", "Mantén las piernas rectas (sin flexionar rodillas)", "Contrae los gemelos en la parte alta", "Mantén 1 segundo arriba", "Baja controlado hasta talones en el suelo", "Progresión: hazlo en un solo pie o al borde de escalón"]'::jsonb,
  '["No subir completamente en puntillas", "Flexionar las rodillas (facilita el ejercicio)", "Bajar con gravedad sin control", "Usar impulso en lugar de fuerza muscular", "No mantener el equilibrio (balancearse)"]'::jsonb,
  '["Ninguno", "Opcional: pared para apoyo", "Progresión: escalón para mayor rango"]'::jsonb,
  8,
  'beginner',
  3,
  20,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'lunges',
  'Lunges',
  'Zancadas',
  'strength',
  'glute',
  'Ejercicio funcional de fuerza y balance que simula la posición y esfuerzo de la zancada en carrera. Trabaja glúteo, cuádriceps y estabilidad.',
  '["De pie, pies a anchura de caderas", "Da un paso amplio hacia adelante", "Baja flexionando ambas rodillas", "Rodilla trasera casi toca el suelo", "Rodilla delantera alineada con el pie (no sobrepasa)", "Torso erguido, no te inclines hacia adelante", "Empuja con talón delantero para volver", "Alterna piernas o completa series de un lado"]'::jsonb,
  '["Rodilla delantera sobrepasa los dedos del pie", "Rodilla colapsando hacia dentro", "Paso demasiado corto (no baja suficiente)", "Inclinarse hacia adelante", "Apoyo inestable (tobillos débiles)", "Subir dejando caer el torso"]'::jsonb,
  '["Ninguno", "Opcional: mancuernas para progresión"]'::jsonb,
  10,
  'beginner',
  3,
  12,
  NULL
);

-- ============================================================
-- CAPACIDAD (1 ejercicio: 30)
-- ============================================================

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'bike_intervals',
  'Bike Intervals',
  'Intervalos en Bicicleta',
  'capacity',
  'full_body',
  'Desarrollo de capacidad aeróbica sin impacto articular. Alternativa ideal para construir base cardiovascular mientras se corrigen disfunciones estructurales.',
  '["Ajusta el sillín a altura correcta (pierna casi extendida abajo)", "Calentamiento: 5 min pedaleando suave", "Intervalos: 2 min ritmo moderado + 1 min ritmo fácil", "Repite el ciclo 6-8 veces", "Mantén cadencia constante (80-90 RPM)", "Debes poder mantener conversación en ritmo moderado", "Enfriamiento: 5 min pedaleando suave"]'::jsonb,
  '["Sillín demasiado bajo (sobrecarga rodilla)", "Sillín demasiado alto (pérdida de potencia)", "Ritmo demasiado intenso (no es sostenible)", "Agarre muy tenso del manillar", "Cadencia irregular (pedaleo brusco)", "No hacer calentamiento ni enfriamiento"]'::jsonb,
  '["Bicicleta estática o de spinning", "Toalla", "Botella de agua"]'::jsonb,
  30,
  'beginner',
  1,
  NULL,
  NULL
);

-- Note: Video URLs and thumbnails will be added in a future migration once content is uploaded
-- All exercises created with video_url and thumbnail_url as NULL
