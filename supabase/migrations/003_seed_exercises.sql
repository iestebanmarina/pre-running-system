-- Seed initial exercises
-- 10 ejercicios base distribuidos en las 4 categorías principales

-- MOVILIDAD (4 ejercicios)

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'ankle_wall_mobility',
  'Ankle Wall Mobility',
  'Movilidad Tobillo - Test de Pared',
  'mobility',
  'ankle',
  'Mejora la dorsiflexión del tobillo, crucial para una zancada eficiente y prevención de lesiones en rodilla y cadera.',
  '["Colócate frente a una pared con un pie adelantado, rodilla flexionada", "Mantén el talón del pie adelantado pegado al suelo en todo momento", "Lleva la rodilla hacia la pared sin despegar el talón", "Siente el estiramiento en el gemelo y tobillo", "Mantén 3-5 segundos y regresa", "Repite alternando pies"]'::jsonb,
  '["Despegar el talón del suelo", "Rotar el pie hacia fuera", "No mantener la rodilla alineada con el pie"]'::jsonb,
  '["Pared", "Opcional: cinta métrica para medir progreso"]'::jsonb,
  5,
  'beginner',
  3,
  10,
  NULL
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'hip_flexor_stretch',
  'Hip Flexor Stretch',
  'Estiramiento Flexor de Cadera',
  'mobility',
  'hip',
  'Estira el psoas y recto femoral, músculos que se acortan por sedentarismo y limitan la extensión de cadera al correr.',
  '["Posición de estocada con rodilla trasera apoyada en el suelo", "Activa el glúteo de la pierna trasera contrayéndolo", "Lleva la cadera hacia adelante manteniendo el torso vertical", "Deberías sentir el estiramiento en la parte frontal de la cadera trasera", "Respira profundo y relaja", "Mantén la posición sin forzar"]'::jsonb,
  '["Arquear la espalda baja", "Inclinar el torso hacia adelante", "No activar el glúteo (clave para el estiramiento efectivo)"]'::jsonb,
  '["Esterilla o superficie acolchada", "Opcional: cojín para rodilla"]'::jsonb,
  6,
  'beginner',
  2,
  NULL,
  30
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  '90_90_hip',
  '90/90 Hip Mobility',
  'Movilidad Cadera 90/90',
  'mobility',
  'hip',
  'Trabaja rotación interna y externa de cadera, fundamental para una zancada fluida y prevenir compensaciones.',
  '["Siéntate en el suelo con ambas piernas dobladas a 90 grados", "Pierna frontal: rodilla hacia adentro, pierna trasera: rodilla hacia afuera", "Mantén ambas caderas pegadas al suelo", "Inclínate suavemente hacia la rodilla frontal", "Mantén la posición sintiendo el estiramiento en glúteo y cadera", "Cambia de lado"]'::jsonb,
  '["Despegar la cadera del suelo", "Forzar la posición con dolor", "No mantener la espalda recta"]'::jsonb,
  '["Esterilla"]'::jsonb,
  8,
  'intermediate',
  2,
  NULL,
  30
);

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'cat_cow',
  'Cat-Cow Stretch',
  'Gato-Vaca',
  'mobility',
  'core',
  'Moviliza la columna torácica y lumbar, mejora la conciencia corporal y prepara la columna para el movimiento.',
  '["Posición de cuadrupedia (manos bajo hombros, rodillas bajo caderas)", "Fase VACA: arquea la espalda, mira hacia arriba, pecho hacia adelante", "Fase GATO: redondea la espalda, barbilla al pecho, ombligo hacia dentro", "Alterna lentamente entre ambas posiciones", "Coordina el movimiento con la respiración", "Inhala en vaca, exhala en gato"]'::jsonb,
  '["Mover solo el cuello en lugar de toda la columna", "Hacer el movimiento muy rápido", "No coordinar con la respiración"]'::jsonb,
  '["Esterilla"]'::jsonb,
  5,
  'beginner',
  2,
  12,
  NULL
);

-- ACTIVACIÓN (3 ejercicios)

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'glute_bridge',
  'Glute Bridge',
  'Puente Glúteo',
  'activation',
  'glute',
  'Activa los glúteos y enseña el patrón de extensión de cadera, fundamental para la fase de impulso al correr.',
  '["Túmbate boca arriba con rodillas flexionadas, pies apoyados", "Pies a la anchura de caderas, brazos relajados a los lados", "ACTIVA los glúteos ANTES de subir", "Empuja con los talones y sube la cadera", "Forma una línea recta de rodillas a hombros", "Mantén arriba contrayendo glúteos", "Baja controlado y repite"]'::jsonb,
  '["Subir arqueando la espalda baja", "Activar primero los isquios en lugar de glúteos", "Separar demasiado los pies", "No mantener la contracción arriba"]'::jsonb,
  '["Esterilla"]'::jsonb,
  6,
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
  'clamshells',
  'Clamshells',
  'Almejas',
  'activation',
  'glute',
  'Activa el glúteo medio, esencial para la estabilidad lateral de cadera y prevenir el colapso de rodilla al correr.',
  '["Túmbate de lado con rodillas flexionadas a 90 grados", "Pies juntos, caderas apiladas", "Mantén los pies pegados", "Abre la rodilla superior como una almeja", "Siente la contracción en el lateral del glúteo", "No rotes la cadera hacia atrás", "Controla el descenso"]'::jsonb,
  '["Rotar la cadera hacia atrás al abrir", "Separar los pies", "Usar impulso en lugar de control", "No sentir el glúteo medio trabajando"]'::jsonb,
  '["Esterilla", "Opcional: banda elástica para progresión"]'::jsonb,
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
  'dead_bug',
  'Dead Bug',
  'Bicho Muerto',
  'activation',
  'core',
  'Enseña estabilidad del core mientras se mueven las extremidades, imitando el patrón cruzado de la carrera.',
  '["Túmbate boca arriba, brazos extendidos al techo", "Rodillas a 90 grados, espinillas paralelas al suelo", "Pega la zona lumbar al suelo (clave)", "Extiende brazo y pierna opuestos simultáneamente", "No despegues la lumbar del suelo", "Vuelve a la posición inicial", "Alterna lados"]'::jsonb,
  '["Arquear la espalda al extender las piernas", "Mover muy rápido sin control", "No coordinar brazo y pierna opuestos", "Aguantar la respiración"]'::jsonb,
  '["Esterilla"]'::jsonb,
  7,
  'intermediate',
  3,
  10,
  NULL
);

-- FUERZA (2 ejercicios)

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'bodyweight_squat',
  'Bodyweight Squat',
  'Sentadilla Peso Corporal',
  'strength',
  'full_body',
  'Fortalece cuádriceps, glúteos e isquios mientras mejora el patrón de bisagra de cadera, base para correr cuestas.',
  '["Pies a anchura de hombros, dedos ligeramente hacia fuera", "Inicia el movimiento llevando la cadera atrás", "Baja como si fueras a sentarte en una silla", "Rodillas alineadas con los pies (no colapsar hacia dentro)", "Baja hasta que muslos estén paralelos al suelo", "Empuja con los talones para subir", "Mantén el pecho alto y core activado"]'::jsonb,
  '["Rodillas colapsando hacia dentro", "Levantar los talones del suelo", "Inclinarse demasiado hacia adelante", "No bajar lo suficiente", "Perder la curvatura lumbar"]'::jsonb,
  '["Ninguno"]'::jsonb,
  8,
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
  'plank',
  'Plank',
  'Plancha',
  'strength',
  'core',
  'Fortalece el core en su función principal: resistir la extensión y mantener estabilidad durante la carrera.',
  '["Posición de antebrazo (codos bajo hombros)", "Pies juntos o separados a anchura caderas", "Cuerpo en línea recta de cabeza a talones", "Activa el core metiendo ombligo", "Activa los glúteos", "Mira al suelo (cuello neutro)", "Respira normalmente, no aguantes aire"]'::jsonb,
  '["Cadera demasiado alta (haciendo V invertida)", "Cadera cayendo (arquear espalda)", "Aguantar la respiración", "Hombros encogidos hacia las orejas", "Mirar hacia adelante (hiperextensión cuello)"]'::jsonb,
  '["Esterilla"]'::jsonb,
  5,
  'beginner',
  3,
  NULL,
  30
);

-- CAPACIDAD (1 ejercicio)

INSERT INTO public.exercises (
  id, name, name_es, category, target,
  description, instructions, common_mistakes, equipment,
  duration_minutes, difficulty, sets, reps, hold_seconds
) VALUES (
  'walking',
  'Brisk Walking',
  'Caminata Activa',
  'capacity',
  'full_body',
  'Construye capacidad aeróbica base sin impacto, preparando el sistema cardiovascular para correr.',
  '["Camina a paso ligero pero cómodo", "Debes poder mantener una conversación", "Mantén una postura erguida", "Balancea los brazos naturalmente", "Contacto talón-punta en cada paso", "Respira de forma natural y rítmica", "Mantén un ritmo constante"]'::jsonb,
  '["Caminar demasiado rápido (no debes quedarte sin aire)", "Encorvarse hacia adelante", "Pasos demasiado largos", "Tensión en hombros o cuello"]'::jsonb,
  '["Calzado cómodo"]'::jsonb,
  30,
  'beginner',
  1,
  NULL,
  NULL
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
