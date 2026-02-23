-- 005_improve_exercise_instructions.sql
-- Mejora de instrucciones para todos los 30 ejercicios: más detalladas, profesionales y accionables
-- Alta prioridad (8-10 pasos): 10 ejercicios más usados
-- Media prioridad (6-7 pasos): resto de ejercicios

-- ============================================================
-- ALTA PRIORIDAD — Instrucciones excepcionales (8-10 pasos)
-- ============================================================

-- 1. ANKLE_WALL_MOBILITY
UPDATE public.exercises
SET
  instructions = '[
    "Colócate descalzo frente a una pared lisa, con los pies separados al ancho de las caderas",
    "Posiciona tu pie derecho a 10cm de la pared — usa los dedos de la mano o un libro como referencia inicial",
    "Mantén el pie completamente recto, apuntando directamente hacia la pared (sin rotar hacia afuera)",
    "Flexiona la rodilla hacia adelante intentando tocar la pared con la rótula, manteniendo el talón SIEMPRE pegado al suelo",
    "Si la rodilla toca la pared sin despegar el talón, aleja el pie 1cm más y repite el intento",
    "Continúa alejando el pie gradualmente hasta encontrar la distancia máxima donde ya NO puedas tocar sin despegar el talón",
    "Mide la distancia desde el dedo gordo del pie hasta la pared con regla o cinta métrica — anota el número",
    "Realiza 2-3 intentos por pie para asegurar la medición más precisa",
    "Repite el proceso completo con el pie izquierdo",
    "Registra la mayor distancia alcanzada por cada pie — este es tu ROM de tobillo actual que mejorará semana a semana"
  ]'::jsonb,
  common_mistakes = '[
    "Despegar el talón del suelo — invalida completamente la medición, el talón debe permanecer en contacto total con el suelo en todo momento",
    "Rotar el pie hacia afuera para compensar la falta de movilidad — el pie debe apuntar directamente a la pared sin rotación externa",
    "Forzar con dolor agudo — detente si sientes dolor punzante, solo debes sentir un estiramiento moderado en la parte trasera del tobillo y el gemelo",
    "Medir de forma inconsistente entre intentos — usa siempre el mismo punto de referencia (dedo gordo del pie) para que las comparaciones semana a semana sean válidas",
    "No calentar antes del test — camina 2-3 minutos antes para obtener resultados más representativos de tu movilidad real"
  ]'::jsonb,
  equipment = '[
    "Pared lisa",
    "Regla o cinta métrica (la app de medición del móvil también funciona)",
    "Opcional: libro o post-it para marcar la distancia en la pared"
  ]'::jsonb
WHERE id = 'ankle_wall_mobility';

-- 2. GLUTE_BRIDGE
UPDATE public.exercises
SET
  instructions = '[
    "Acuéstate boca arriba sobre una esterilla con las rodillas flexionadas a 90 grados",
    "Posiciona los pies planos en el suelo, separados al ancho de caderas, con los talones a 10-15cm de los glúteos",
    "Coloca los brazos a los lados del cuerpo, palmas hacia abajo, para mayor estabilidad",
    "ANTES de subir: activa conscientemente los glúteos apretándolos como si sostuvieras una moneda entre ellos durante 2 segundos",
    "Inhala profundamente, y al exhalar empuja con los talones y eleva la cadera formando una línea recta desde rodillas hasta hombros",
    "En la posición superior, aprieta los glúteos al máximo durante 2 segundos — no arquees la espalda baja para subir más",
    "Mantén el core activado y comprueba que las rodillas no se abren ni se cierran durante el movimiento",
    "Baja controladamente en 3 segundos hasta que los glúteos casi toquen la esterilla — sin relajar completamente entre repeticiones",
    "Realiza las repeticiones indicadas manteniendo el ritmo: 1 segundo arriba, 2 segundos de contracción, 3 segundos bajando"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear excesivamente la espalda baja en vez de elevar con los glúteos — debes sentir el trabajo en los glúteos, no en la zona lumbar",
    "Dejar que las rodillas se abran hacia afuera o colapsen hacia adentro durante el movimiento — mantén la alineación rodilla-pie en todo momento",
    "Subir empujando con los cuádriceps en vez de activar primero los glúteos — apriétalos conscientemente antes de empujar, no al mismo tiempo",
    "No mantener la contracción en la cima — la pausa de 2 segundos apretando es lo que produce la activación neurológica correcta",
    "Bajar demasiado rápido sin control — el descenso lento activa el glúteo de forma excéntrica, igual de importante que la subida"
  ]'::jsonb,
  equipment = '[
    "Esterilla o superficie acolchada"
  ]'::jsonb
WHERE id = 'glute_bridge';

-- 3. PLANK
UPDATE public.exercises
SET
  instructions = '[
    "Posiciónate boca abajo con los antebrazos apoyados en el suelo, codos directamente bajo los hombros",
    "Entrelaza las manos frente a ti o manténlas paralelas — elige la posición más cómoda para tus hombros",
    "Extiende las piernas hacia atrás, apoyándote sobre los dedos de los pies, pies a la anchura de caderas",
    "Activa el abdomen como si esperaras un golpe en el estómago — contrae toda la zona media antes de levantar",
    "Levanta el cuerpo del suelo formando una línea completamente recta desde la cabeza hasta los talones",
    "Aprieta los glúteos activamente — esto protege la espalda baja y mantiene la alineación de cadera",
    "Mira al suelo manteniendo el cuello en posición neutra (mirar hacia adelante hiperextiende el cuello)",
    "Respira de forma controlada y continua — no aguantes la respiración (inhala por nariz, exhala por boca)",
    "Detente en el momento en que la forma se rompa: cadera baja, hombros colapsan o temblor excesivo — calidad sobre tiempo",
    "Con el tiempo, progresa añadiendo segundos solo cuando puedas mantener la forma perfecta durante todo el set"
  ]'::jsonb,
  common_mistakes = '[
    "Dejar caer la cadera hacia el suelo o elevarla en pico — rompe la línea recta y reduce drásticamente la efectividad del ejercicio",
    "Mirar hacia adelante en vez de al suelo — crea tensión innecesaria en el cuello y a veces sube la cadera como compensación",
    "Aguantar la respiración — debes respirar normalmente durante todo el ejercicio, aguantar el aire eleva la presión arterial sin aumentar el beneficio",
    "Seguir aguantando cuando la forma ya se perdió — mejor 20 segundos perfectos que 60 segundos con cadera caída",
    "No activar los glúteos — los glúteos apretados protegen la espalda baja y contribuyen directamente a mantener la alineación"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'plank';

-- 4. CLAMSHELLS
UPDATE public.exercises
SET
  instructions = '[
    "Túmbate de lado sobre la esterilla con la cadera y los hombros perfectamente apilados — no te inclines hacia adelante ni hacia atrás",
    "Flexiona ambas rodillas a 90 grados, con los pies juntos y alineados con el cuerpo",
    "Apoya la cabeza sobre el brazo extendido para mantener el cuello relajado y la columna en posición neutra",
    "Coloca la mano libre en la cadera de arriba para detectar inmediatamente si la cadera rota durante el movimiento",
    "Activa conscientemente el glúteo medio antes de iniciar — imagina que tienes algo que apretar en el lateral de la cadera",
    "Abre la rodilla superior como una almeja que se abre, manteniendo los pies siempre juntos — el pie es el eje fijo",
    "Lleva la rodilla tan arriba como puedas SIN que la cadera rote hacia atrás — la mano en la cadera te avisará si esto ocurre",
    "Mantén la posición abierta 1-2 segundos apretando el glúteo medio al máximo",
    "Baja la rodilla lentamente en 3 segundos — no la dejes caer con gravedad, el descenso controlado es igual de importante",
    "Completa todas las repeticiones de un lado antes de cambiar"
  ]'::jsonb,
  common_mistakes = '[
    "Rotar la cadera hacia atrás al abrir la rodilla — el movimiento debe venir puramente del glúteo medio, no del giro de la pelvis. La mano en la cadera es tu detector",
    "Dejar que los pies se separen durante el movimiento — los pies son el eje fijo del ejercicio y deben permanecer juntos en todo momento",
    "No sentir el glúteo medio trabajando y sí los isquios — reposiciona el ángulo de la cadera o reduce el rango hasta aislar el glúteo medio",
    "Abrir la rodilla demasiado rápido usando impulso en lugar de control muscular — la lentitud es clave para la activación correcta",
    "Bajar la rodilla rápidamente dejándola caer — el descenso controlado produce trabajo excéntrico igual de importante"
  ]'::jsonb,
  equipment = '[
    "Esterilla",
    "Opcional: banda elástica sobre las rodillas para mayor activación o como progresión"
  ]'::jsonb
WHERE id = 'clamshells';

-- 5. HIP_FLEXOR_STRETCH
UPDATE public.exercises
SET
  instructions = '[
    "Coloca una esterilla o cojín en el suelo y arrodíllate sobre la rodilla derecha (la pierna que vas a estirar)",
    "Adelanta el pie izquierdo hasta que la rodilla izquierda forme un ángulo de 90 grados",
    "CLAVE ANTES DE MOVERSE: activa conscientemente el glúteo derecho (pierna trasera) contrayéndolo — sin esta activación el estiramiento del psoas es mínimo",
    "Manteniendo el glúteo derecho activado, lleva la cadera hacia adelante — no el torso, solo la cadera",
    "El torso debe permanecer completamente vertical durante todo el estiramiento — si cae hacia adelante, el psoas deja de estirarse",
    "Debes sentir el estiramiento en la parte frontal de la cadera derecha, no en la espalda baja — si sientes la espalda, reduce la intensidad y activa más el glúteo",
    "Inhala profundamente expandiendo el pecho hacia arriba, y al exhalar relaja la tensión permitiendo que la cadera vaya más hacia adelante",
    "Mantén la posición estática los segundos indicados — el estiramiento debería intensificarse suavemente con cada exhalación",
    "Cambia de lado después del tiempo indicado"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear la espalda baja para compensar — si la espalda se arquea, retrocede hasta encontrar una posición donde el torso sea perpendicular al suelo",
    "No activar el glúteo de la pierna trasera — sin esta activación el psoas no se estira realmente, es el error más común y que más elimina la efectividad",
    "Inclinar el torso hacia adelante sobre la rodilla delantera — esto elimina completamente el estiramiento del flexor de cadera",
    "Permitir que la rodilla delantera se vaya hacia adentro o afuera — mantén la rodilla alineada con el segundo dedo del pie",
    "Forzar hasta sentir dolor en la rodilla trasera — coloca un cojín grueso o dobla la esterilla si el suelo es duro"
  ]'::jsonb,
  equipment = '[
    "Esterilla o yoga mat",
    "Opcional: cojín o toalla doblada para la rodilla trasera"
  ]'::jsonb
WHERE id = 'hip_flexor_stretch';

-- 6. DEAD_BUG
UPDATE public.exercises
SET
  instructions = '[
    "Túmbate completamente boca arriba sobre una esterilla, rodillas flexionadas y pies en el suelo inicialmente",
    "Levanta los brazos extendiéndolos verticalmente hacia el techo, palmas mirando hacia tu cuerpo",
    "Levanta las piernas formando 90 grados en rodillas y caderas — espinillas paralelas al suelo, como si apoyaras los pies en una mesa invisible",
    "PASO CRÍTICO: presiona la zona lumbar contra el suelo activamente — no debe haber espacio entre tu espalda baja y la esterilla. Si hay espacio, activa más el abdomen",
    "Inhala, y al exhalar extiende lentamente el brazo derecho hacia atrás (hacia tu cabeza) y la pierna izquierda hacia adelante de forma simultánea",
    "Mantén la lumbar pegada al suelo durante toda la extensión — si se despega, has llegado más lejos de lo que tu core puede controlar",
    "Para cuando el brazo y la pierna queden casi paralelos al suelo sin tocar, mantén 2 segundos",
    "Vuelve al centro con control en 3 segundos — sin usar impulso ni dejar caer las extremidades",
    "Repite con brazo izquierdo + pierna derecha",
    "Exhala siempre al extender, inhala al volver — la respiración coordina el ejercicio"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear la espalda lumbar al extender las extremidades — la lumbar DEBE permanecer pegada al suelo en todo momento, es el único criterio de éxito del ejercicio",
    "Extender la pierna hasta tocar el suelo (excede el control del core) — para cuando empieces a perder el contacto lumbar, aunque solo hayas bajado a la mitad",
    "Mover muy rápido sin control — el dead bug debe hacerse lento y deliberado. Si parece fácil, ve más despacio y extiende más",
    "No coordinar brazo y pierna opuestos — el patrón cruzado es específico y activa el patrón diagonal de la carrera",
    "Aguantar la respiración — la respiración coordinada es parte integral, no la omitas por concentrarte en el movimiento"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'dead_bug';

-- 7. BODYWEIGHT_SQUAT
UPDATE public.exercises
SET
  instructions = '[
    "Colócate de pie con los pies separados a la anchura de hombros o ligeramente más, dedos apuntando ligeramente hacia afuera (15-30 grados)",
    "Extiende los brazos hacia adelante o coloca las manos en el pecho para equilibrio",
    "Activa el core antes de iniciar: aspira, cierra la caja torácica y endurece el abdomen como si fueras a recibir un golpe",
    "Inicia el movimiento empujando la cadera hacia ATRÁS (como si buscaras sentarte en una silla detrás de ti) ANTES de doblar las rodillas",
    "A medida que bajas, las rodillas se doblan siguiendo la dirección de los dedos del pie — ni hacia adentro ni hacia afuera",
    "Mantén el pecho levantado y la espalda recta durante todo el descenso — si el torso cae hacia adelante, trabaja movilidad de tobillo",
    "Baja hasta que los muslos estén paralelos al suelo o más abajo si tu movilidad lo permite — a más profundidad (con buena forma), mayor activación de glúteos",
    "Empuja el suelo con los talones para subir, extendiendo caderas y rodillas simultáneamente",
    "Al final del movimiento, extiende completamente las caderas apretando los glúteos",
    "Exhala al subir, inhala controladamente al bajar"
  ]'::jsonb,
  common_mistakes = '[
    "Rodillas colapsando hacia adentro (valgo de rodilla) — el error más peligroso, indica glúteo medio débil o rigidez de tobillo. Trabaja clamshells y ankle mobility primero",
    "Levantar los talones del suelo al bajar — señal de movilidad de tobillo insuficiente, trabaja ankle_wall_mobility primero",
    "Inclinar excesivamente el torso hacia adelante — indica movilidad de cadera limitada o posición de pies incorrecta, prueba a separar más los pies",
    "Iniciar el movimiento doblando las rodillas en vez de la cadera — lleva la cadera atrás PRIMERO, las rodillas siguen",
    "No bajar lo suficiente (sentadilla parcial) — con buena forma, intenta muslos paralelos al suelo como mínimo",
    "Perder la curvatura lumbar natural al bajar (butt wink excesivo) — trabaja movilidad de cadera antes de aumentar profundidad"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Opcional: silla detrás para aprender el patrón de movimiento (siéntate y levántate controlado)"
  ]'::jsonb
WHERE id = 'bodyweight_squat';

-- 8. COUCH_STRETCH
UPDATE public.exercises
SET
  instructions = '[
    "Coloca una esterilla o cojín grueso en el suelo frente a un sofá o pared sólida",
    "Arrodíllate y coloca la rodilla derecha en el suelo, cerca de la base del sofá",
    "Lleva el pie derecho hacia arriba apoyándolo verticalmente contra el sofá o la pared — el empeine apoyado, no los dedos",
    "Adelanta la pierna izquierda formando un ángulo de 90 grados en la rodilla izquierda",
    "CRUCIAL: Aprieta fuertemente el glúteo derecho (pierna trasera) — esta contracción es lo que produce el estiramiento real del psoas, no simplemente la posición",
    "Manteniendo el glúteo activo, lleva la cadera hacia adelante lentamente — no el torso",
    "El torso debe permanecer completamente vertical o ligeramente inclinado hacia atrás — si cae hacia adelante, el estiramiento disminuye",
    "Siente el estiramiento profundo en la parte frontal de la cadera y muslo derecho — si no lo sientes, activa más el glúteo",
    "Respira profundamente: inhala expandiendo el pecho, exhala relajando sin perder la activación del glúteo",
    "Mantén los segundos indicados sin soltar en ningún momento la contracción del glúteo trasero"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear la espalda baja hacia adelante — es la compensación más común cuando el psoas está muy tenso. Corrige llevando el torso más vertical y reduce la intensidad",
    "No activar el glúteo trasero — sin esta contracción, el estiramiento es superficial y el psoas no se alarga realmente",
    "Inclinar el torso hacia adelante sobre la rodilla delantera — mantén el torso erguido durante todo el tiempo",
    "Forzar hasta sentir dolor agudo en la rodilla trasera — coloca un cojín grueso debajo de la rodilla si el suelo es duro",
    "No mantener el pie trasero completamente apoyado en la pared — el empeine debe quedar plano contra la superficie para no tensionar los dedos"
  ]'::jsonb,
  equipment = '[
    "Sofá, pared o cama (cualquier superficie vertical sólida de 40-60cm de altura)",
    "Esterilla o cojín grueso para la rodilla trasera"
  ]'::jsonb
WHERE id = 'couch_stretch';

-- 9. FIRE_HYDRANTS
UPDATE public.exercises
SET
  instructions = '[
    "Colócate en posición de cuadrupedia: manos directamente bajo los hombros, rodillas directamente bajo las caderas",
    "Mantén la espalda en posición neutra — ni arqueada ni redondeada, como si equilibraras un vaso de agua sobre la espalda",
    "Activa el core suavemente para evitar que la columna se mueva durante el ejercicio",
    "Coloca la mano libre en la cadera para detectar si ésta rota durante el movimiento",
    "Mantén la rodilla flexionada a 90 grados y levanta la rodilla derecha hacia el lateral — como un perro levantando la pata hacia una boca de incendios",
    "Levanta solo hasta donde el glúteo medio trabaje sin que la cadera suba o rote — la mano en la cadera te avisa inmediatamente",
    "Mantén la posición superior 1-2 segundos apretando el glúteo medio al máximo",
    "Baja la rodilla lentamente en 2-3 segundos, sin tocar el suelo entre repeticiones — mantén la tensión",
    "Completa todas las repeticiones del lado derecho antes de cambiar al izquierdo",
    "Si notas que un lado llega menos alto o te cuesta más, es el lado más débil — presta atención extra"
  ]'::jsonb,
  common_mistakes = '[
    "Rotar o elevar la cadera al levantar la pierna — el movimiento debe ser aislado en la articulación de cadera, no en la columna. La mano en la cadera es tu detector",
    "Usar impulso o balanceo para levantar en lugar de contracción muscular controlada — si vas rápido, probablemente estás usando inercia",
    "No mantener la rodilla a 90 grados durante el movimiento — la pierna no debe extenderse, la rodilla permanece doblada todo el tiempo",
    "Levantar la rodilla más allá de tu rango controlado — más alto no es mejor si la cadera rota para conseguirlo",
    "Tocar el suelo entre repeticiones — mantén la rodilla suspendida para mantener la tensión en el glúteo"
  ]'::jsonb,
  equipment = '[
    "Esterilla",
    "Opcional: banda elástica sobre los muslos para mayor resistencia y activación"
  ]'::jsonb
WHERE id = 'fire_hydrants';

-- 10. SINGLE_LEG_BRIDGE
UPDATE public.exercises
SET
  instructions = '[
    "Túmbate boca arriba con ambas rodillas flexionadas, pies planos en el suelo a la anchura de las caderas",
    "Extiende la pierna derecha hacia arriba con el muslo en la misma posición que el izquierdo, pierna recta apuntando al techo",
    "Coloca los brazos a los lados del cuerpo, palmas hacia abajo, para mayor estabilidad",
    "CLAVE: Activa conscientemente el glúteo izquierdo (pierna de apoyo) apretándolo firmemente antes de iniciar el movimiento",
    "Inhala, y al exhalar empuja con el talón izquierdo y eleva la cadera hacia arriba",
    "En la posición superior, forma una línea recta desde el hombro hasta la rodilla izquierda — comprueba que la cadera esté nivelada",
    "CRUCIAL: Mantén la cadera completamente nivelada — no dejes que el lado de la pierna extendida caiga hacia abajo (señal de glúteo medio débil)",
    "Aprieta fuertemente el glúteo de la pierna de apoyo durante 2 segundos en la posición superior",
    "Baja controladamente en 3 segundos hasta que los glúteos casi toquen el suelo, sin relajar completamente entre repeticiones",
    "Completa todas las repeticiones de un lado antes de cambiar — si un lado es más difícil, es tu lado débil dominante"
  ]'::jsonb,
  common_mistakes = '[
    "Dejar caer el lado de la pierna libre (la cadera se inclina) — el mayor error del ejercicio, indica glúteo medio débil en la pierna de apoyo",
    "Empujar con los cuádriceps o isquios en vez del glúteo de apoyo — concéntrate en sentir el trabajo específicamente en el glúteo",
    "Arquear la espalda baja al subir — si ocurre, reduce la altura a la que subes hasta que el glúteo sea suficientemente fuerte",
    "No mantener la pierna libre en posición fija — la pierna extendida actúa como contrapeso y no debe moverse durante el ejercicio",
    "Bajar demasiado rápido sin control — el descenso excéntrico lento activa el glúteo de forma diferente y es igual de importante"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'single_leg_bridge';


-- ============================================================
-- MEDIA PRIORIDAD — Instrucciones sólidas (6-7 pasos)
-- ============================================================

-- 11. 90_90_HIP
UPDATE public.exercises
SET
  instructions = '[
    "Siéntate en el suelo y coloca ambas piernas dobladas a 90 grados: pierna frontal con la rodilla hacia afuera, pierna trasera con la rodilla hacia adentro",
    "Intenta que ambas caderas permanezcan en contacto con el suelo — si una cadera se levanta, ese es tu rango de movimiento actual, no lo fuerces",
    "Mantén la espalda recta y el pecho levantado — no te redondees ni te apoyes en las manos si puedes evitarlo",
    "Inclínate lentamente hacia adelante sobre la pierna frontal desde la cadera (no desde la espalda), manteniendo el torso recto",
    "Siente el estiramiento en el glúteo de la pierna frontal y en el flexor de cadera de la pierna trasera",
    "Mantén los segundos indicados respirando profundamente — con cada exhalación permite que la cadera se relaje un poco más",
    "Cambia de posición rotando las piernas al lado contrario"
  ]'::jsonb,
  common_mistakes = '[
    "Despegar la cadera del suelo para conseguir la posición — trabaja en el rango que tu cadera permite sin compensar con la pelvis",
    "Redondear la espalda al inclinarse hacia adelante — el movimiento debe ser una bisagra desde la cadera, no una flexión de columna",
    "Forzar la posición con dolor en la articulación — debes sentir estiramiento muscular, nunca dolor articular punzante",
    "No cambiar de lado o dar menos tiempo a uno — los dos lados necesitan la misma atención, especialmente el más limitado"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = '90_90_hip';

-- 12. CAT_COW
UPDATE public.exercises
SET
  instructions = '[
    "Comienza en posición de cuadrupedia: manos directamente bajo los hombros, rodillas bajo las caderas, columna en posición neutra",
    "Fase VACA (inhala lentamente): deja caer el abdomen hacia el suelo, levanta el pecho y la cabeza mirando hacia arriba, lleva también las caderas hacia arriba — toda la columna se curva cóncavamente",
    "Mantén la fase vaca 1-2 segundos sintiendo el estiramiento en el abdomen y la apertura del pecho",
    "Fase GATO (exhala lentamente): redondea completamente la espalda empujando el suelo con las manos, lleva el mentón al pecho y el ombligo hacia dentro y arriba — como un gato asustado",
    "Mantén la fase gato 1-2 segundos sintiendo el estiramiento en toda la columna dorsal",
    "Alterna entre ambas posiciones de forma fluida y continua, sincronizando siempre con la respiración — el movimiento nace de la respiración, no al revés"
  ]'::jsonb,
  common_mistakes = '[
    "Mover solo el cuello o solo la espalda baja en lugar de movilizar toda la columna — busca que el movimiento recorra cada vértebra como una ola, desde el cuello hasta el sacro",
    "Hacer el movimiento demasiado rápido perdiendo la coordinación con la respiración — la lentitud y la respiración son lo que hace efectivo este ejercicio",
    "No llegar al rango completo en ninguna de las dos fases — busca la máxima curvatura cóncava en vaca y máxima curvatura convexa en gato"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'cat_cow';

-- 13. ANKLE_CIRCLES
UPDATE public.exercises
SET
  instructions = '[
    "Siéntate en una silla o apóyate con una mano en la pared para mantener el equilibrio cómodamente",
    "Levanta el pie derecho del suelo flexionando la rodilla a unos 90 grados",
    "Mantén la rodilla completamente inmóvil — el movimiento debe venir exclusivamente del tobillo",
    "Dibuja círculos grandes y lentos con los dedos del pie, como si pintaras con el dedo gordo en el aire",
    "Realiza 15 círculos completos en sentido horario, maximizando el rango en cada dirección del círculo — especialmente hacia arriba (dorsiflexión)",
    "Luego 15 círculos en sentido antihorario — nota si alguna dirección es más limitada o rígida",
    "Repite el proceso completo con el pie izquierdo"
  ]'::jsonb,
  common_mistakes = '[
    "Hacer círculos pequeños usando solo los dedos — el tobillo debe moverse en su rango completo en los cuatro planos",
    "Mover la rodilla entera en lugar de aislar el tobillo — la pierna debe permanecer quieta",
    "Hacer el movimiento demasiado rápido — la lentitud permite sentir los puntos de restricción y trabajarlos",
    "No completar el rango en la dirección de dorsiflexión (hacia arriba) — precisamente la dirección más limitada en personas sedentarias"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Opcional: silla para apoyo si el equilibrio es limitado"
  ]'::jsonb
WHERE id = 'ankle_circles';

-- 14. HIP_CAR
UPDATE public.exercises
SET
  instructions = '[
    "Posición de cuadrupedia estable: manos bajo hombros, rodillas bajo caderas, core activado",
    "Mantén la columna completamente inmóvil durante todo el ejercicio — el movimiento es solo de la cadera, la columna no se mueve",
    "Levanta la rodilla derecha hacia el pecho comprimiéndola, manteniendo la flexión de 90 grados en la rodilla",
    "Abre la rodilla hacia el lateral derecho manteniendo la flexión de rodilla — como un fire hydrant pero en movimiento",
    "Lleva la rodilla hacia atrás en extensión máxima de cadera, sintiendo el glúteo trabajando",
    "Cierra el círculo volviendo hacia adentro y al punto inicial — el movimiento completo es un círculo en el plano tridimensional",
    "Realiza cada círculo en 5-8 segundos — la lentitud es lo que lo hace efectivo. Cambia de dirección y repite"
  ]'::jsonb,
  common_mistakes = '[
    "Mover la columna o la cadera de apoyo para compensar el rango limitado — mantén un lado absolutamente fijo mientras el otro trabaja",
    "Hacer el movimiento con impulso o rapidez — los CARs son efectivos precisamente por su lentitud y control total en todos los ángulos",
    "No mantener la rodilla a 90 grados durante el movimiento — la rodilla actúa como palanca del movimiento de cadera",
    "Perder la activación del core permitiendo que la espalda baja se mueva — el core estabilizador es más importante que la amplitud del círculo"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'hip_car';

-- 15. THORACIC_ROTATION
UPDATE public.exercises
SET
  instructions = '[
    "Siéntate en posición de cuadrupedia o sobre los talones en el suelo con la espalda recta",
    "Coloca la mano derecha detrás de la cabeza, con el codo apuntando hacia el lateral",
    "Apoya la mano izquierda firmemente en el suelo directamente bajo el hombro — esta mano es tu punto fijo de referencia",
    "Activa el core y mantén la cadera completamente inmóvil durante todo el movimiento",
    "Lleva el codo derecho hacia abajo (hacia la mano de apoyo) rotando la parte superior del torso",
    "Luego rota hacia arriba abriendo el torso y llevando el codo hacia el techo — sigue el codo con la mirada hasta el final del movimiento",
    "Siente cómo el movimiento ocurre en la parte media de la espalda, no en la zona lumbar — realízalo de forma controlada llegando al rango máximo sin forzar"
  ]'::jsonb,
  common_mistakes = '[
    "Rotar la cadera o la zona lumbar en lugar de la columna torácica — la parte de abajo del cuerpo debe permanecer absolutamente inmóvil",
    "Mover solo el cuello mirando en lugar de rotar el torso completo — la cabeza sigue el movimiento del torso, no lo lidera",
    "No llegar al rango completo por no tomarse el tiempo — este ejercicio necesita lentitud para llegar al rango final de la columna torácica",
    "Forzar el rango más allá de lo que la columna permite con dolor articular"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'thoracic_rotation';

-- 16. TOE_WALKING
UPDATE public.exercises
SET
  instructions = '[
    "Colócate descalzo o con calzado ligero en una superficie plana y segura",
    "Elévate completamente sobre las puntas de los pies, llevando los talones tan alto como puedas — apunta hacia el techo con los talones",
    "Mantén las piernas rectas sin flexionar las rodillas durante toda la caminata",
    "Da pasos hacia adelante manteniendo los talones elevados a la misma altura durante todo el recorrido — no los bajes entre pasos",
    "Mantén una postura erguida: pecho levantado, mirada al frente, hombros relajados",
    "Realiza los pasos indicados enfocándote en mantener la altura constante — la consistencia en la altura es más importante que la velocidad",
    "Descansa y repite, progresando la distancia a medida que tu fuerza y control de tobillo mejoran"
  ]'::jsonb,
  common_mistakes = '[
    "Bajar los talones entre pasos — los talones deben mantenerse elevados constantemente durante todo el set, no solo en el momento de pisar",
    "Flexionar las rodillas para facilitar el ejercicio — piernas completamente rectas en todo momento para trabajar correctamente los gemelos",
    "Inclinarse hacia adelante perdiendo la postura erguida — el torso debe permanecer vertical",
    "Pasos demasiado largos que desestabilizan el equilibrio — comienza con pasos cortos y controlados, luego progresa"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Superficie plana y segura (interior mejor que exterior para empezar)"
  ]'::jsonb
WHERE id = 'toe_walking';

-- 17. WORLD''S GREATEST STRETCH
UPDATE public.exercises
SET
  instructions = '[
    "Comienza en posición de estocada baja: pie derecho adelantado, rodilla izquierda apoyada en el suelo con cojín si es necesario",
    "Coloca ambas manos en el suelo, dentro del pie derecho (una a cada lado del pie como un soporte)",
    "Baja el codo derecho hacia el suelo lo máximo posible — cuanto más bajo, mayor estiramiento del flexor de cadera trasero",
    "Siente el estiramiento en la cadera izquierda frontal y en la ingle derecha — ese es el primer componente",
    "Desde esa posición, lleva la mano derecha hacia el techo rotando el torso — sigue la mano con los ojos hasta el punto máximo de rotación",
    "Vuelve al centro colocando la mano en el suelo con control",
    "Repite la rotación 8 veces de forma fluida antes de cambiar de lado — exhala al girar hacia arriba, inhala al bajar"
  ]'::jsonb,
  common_mistakes = '[
    "No bajar suficientemente el codo hacia el suelo — si no puedes acercarte al suelo, trabaja primero movilidad de cadera con otros ejercicios",
    "Rotar el torso sin estabilizar la cadera primero — la base debe estar sólida antes de rotar",
    "No seguir la mano con la mirada durante la rotación — la mirada amplifica la rotación torácica significativamente",
    "Hacer el movimiento muy rápido — cada rotación debe ser lenta y deliberada para aprovechar ambos componentes del estiramiento"
  ]'::jsonb,
  equipment = '[
    "Esterilla",
    "Opcional: cojín para la rodilla trasera"
  ]'::jsonb
WHERE id = 'worlds_greatest_stretch';

-- 18. BANDED_WALKS
UPDATE public.exercises
SET
  instructions = '[
    "Coloca la banda elástica alrededor de ambos muslos, a 5-10cm por encima de las rodillas",
    "Adopta una posición de media sentadilla: pies a anchura de caderas, rodillas semiflexionadas, torso ligeramente inclinado con la espalda recta",
    "Activa los glúteos separando activamente los muslos contra la resistencia de la banda — siente el trabajo lateral desde el inicio",
    "Da un paso lateral amplio con el pie derecho, seguido del pie izquierdo recuperando la separación inicial — mantén siempre tensión en la banda",
    "Mantén la posición de sentadilla durante toda la caminata — las caderas deben permanecer a la misma altura, no te levantes entre pasos",
    "Realiza los pasos indicados en una dirección, luego el mismo número al lado contrario",
    "Mantén el torso erguido y mirando al frente — no te inclines ni rotes hacia el lado de movimiento"
  ]'::jsonb,
  common_mistakes = '[
    "Perder la posición de sentadilla levantándose entre pasos — las caderas deben mantenerse a la misma altura durante todo el ejercicio",
    "Juntar demasiado los pies entre pasos perdiendo la tensión de la banda — mantén siempre la separación suficiente para tensión constante",
    "Pasos demasiado pequeños que no generan tensión lateral significativa",
    "Rotar el tronco hacia el lado de movimiento — el torso debe permanecer mirando al frente en todo momento",
    "Dejar que las rodillas caigan hacia adentro — es precisamente lo contrario de lo que estás entrenando con este ejercicio"
  ]'::jsonb,
  equipment = '[
    "Banda elástica de resistencia media (comenzar ligera y progresar)"
  ]'::jsonb
WHERE id = 'banded_walks';

-- 19. BIRD_DOG
UPDATE public.exercises
SET
  instructions = '[
    "Posición de cuadrupedia: manos bajo hombros, rodillas bajo caderas, columna en posición neutra",
    "Antes de moverse, activa el core como si esperaras un empujón lateral — el objetivo es que la columna no se mueva durante el ejercicio",
    "De forma simultánea, extiende el brazo derecho hacia adelante y la pierna izquierda hacia atrás en el mismo momento",
    "Forma una línea recta desde la mano extendida hasta el pie extendido — ni brazo demasiado alto ni pierna demasiado alta (altura de cadera y hombro respectivamente)",
    "Mantén la posición 3 segundos sin que la columna rote ni se doble — esto es más difícil de lo que parece, no te apresures",
    "Vuelve al centro con control sin dejarte caer, toca levemente el suelo con la rodilla y la mano",
    "Alterna: brazo izquierdo + pierna derecha, manteniendo el mismo tempo controlado"
  ]'::jsonb,
  common_mistakes = '[
    "Rotar la cadera al extender la pierna — el error más común. Imagina un vaso de agua en tu espalda que no debe derramarse",
    "Levantar la pierna demasiado alta compensando con la zona lumbar — la pierna solo sube hasta la altura de la cadera, no más",
    "Hacer el movimiento con prisa sin estabilizar el core antes de extender las extremidades",
    "No formar la línea recta — tanto el brazo como la pierna deben quedar a la altura del cuerpo, no por encima ni por debajo"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'bird_dog';

-- 20. PALLOF_PRESS
UPDATE public.exercises
SET
  instructions = '[
    "Ancla una banda elástica a una altura media (al nivel del pecho) en una puerta, columna o rack",
    "Agarra la banda con ambas manos y sepárate lateralmente hasta que la banda tenga tensión suficiente",
    "Colócate de lado a la banda, pies a anchura de hombros, rodillas ligeramente flexionadas — postura atlética",
    "Lleva las manos al centro del pecho y activa el core fuertemente antes de extender",
    "Extiende los brazos hacia adelante de forma lenta y controlada — resiste activamente la rotación que la banda intenta producir en tu torso",
    "Mantén el torso completamente inmóvil durante la extensión — si rota, reduce la tensión de la banda",
    "Vuelve las manos al pecho con el mismo control que la extensión. Completa todas las repeticiones de un lado antes de girar y repetir al otro"
  ]'::jsonb,
  common_mistakes = '[
    "Rotar el torso hacia la banda durante la extensión — debes resistir esa rotación activamente, es el objetivo principal del ejercicio",
    "Usar demasiada tensión de banda para tu nivel — empieza con menos tensión, la forma correcta siempre primero",
    "Arquear o flexionar la espalda en lugar de mantenerla recta y neutra durante el movimiento",
    "No mantener los pies firmemente plantados — el anclaje de los pies es fundamental para que la fuerza se transfiera correctamente"
  ]'::jsonb,
  equipment = '[
    "Banda elástica de resistencia media-alta",
    "Punto de anclaje estable a altura del pecho (poste, marco de puerta, rack)"
  ]'::jsonb
WHERE id = 'pallof_press';

-- 21. GLUTE_KICKBACK
UPDATE public.exercises
SET
  instructions = '[
    "Posición de cuadrupedia estable: manos directamente bajo los hombros, rodillas bajo las caderas",
    "Activa el core para que la columna permanezca neutra e inmóvil durante todo el ejercicio",
    "Mantén la rodilla derecha flexionada a 90 grados con el pie apuntando al techo",
    "Empuja el talón derecho hacia el techo extendiendo la cadera — como si aplastaras el techo con el talón",
    "Todo el movimiento debe ocurrir en la articulación de la cadera, no en la espalda — si la espalda se mueve, estás usando la musculatura equivocada",
    "Contrae el glúteo fuertemente en la posición alta y mantén 1-2 segundos antes de bajar",
    "Baja controladamente en 2-3 segundos sin apoyar la rodilla en el suelo entre repeticiones — mantén la tensión"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear la espalda lumbar al subir la pierna — señal de que estás usando los músculos de la espalda en lugar del glúteo. Reduce el rango hasta dominar el aislamiento",
    "No apretar el glúteo en la posición alta — la pausa con contracción máxima es lo que produce la activación neurológica",
    "Rotar la cadera para subir más — la cadera debe permanecer nivelada durante todo el movimiento",
    "Bajar demasiado rápido perdiendo el control excéntrico — baja siempre en 2-3 segundos"
  ]'::jsonb,
  equipment = '[
    "Esterilla",
    "Opcional: tobillera con peso para progresar la dificultad"
  ]'::jsonb
WHERE id = 'glute_kickback';

-- 22. SIDE_PLANK
UPDATE public.exercises
SET
  instructions = '[
    "Túmbate de lado con el antebrazo derecho apoyado en el suelo, codo directamente bajo el hombro",
    "Apila los pies uno sobre otro (pie izquierdo sobre derecho) o coloca el pie de arriba adelantado en el suelo para mayor base de apoyo",
    "Antes de levantar, activa el core y el glúteo del lado inferior — ambos son necesarios para mantener la posición",
    "Levanta la cadera hasta que el cuerpo forme una línea recta de cabeza a pies — comprueba visualmente o con un espejo inicialmente",
    "Mantén el hombro alejado de la oreja activamente — no dejes que se encoja durante el esfuerzo",
    "El brazo libre puede ir extendido hacia arriba perpendicular al suelo o apoyado en la cadera",
    "Respira normalmente durante todo el tiempo — la tendencia es aguantar la respiración, resiste esa tendencia"
  ]'::jsonb,
  common_mistakes = '[
    "La cadera cae hacia el suelo — el objetivo es mantenerla elevada y en línea con el cuerpo en todo momento",
    "Rotar el torso hacia adelante o hacia atrás perdiendo la posición lateral estricta",
    "Hombro encogido hacia la oreja — aleja activamente el hombro de la oreja para proteger la articulación",
    "No activar el glúteo del lado inferior — el glúteo es lo que mantiene la cadera arriba, no solo el core lateral",
    "Aguantar la respiración para conseguir más tiempo — mejor 20 segundos respirando que 40 aguantando el aire"
  ]'::jsonb,
  equipment = '[
    "Esterilla"
  ]'::jsonb
WHERE id = 'side_plank';

-- 23. BULGARIAN_SPLIT_SQUAT
UPDATE public.exercises
SET
  instructions = '[
    "Coloca una silla, banco o step sólido y antideslizante a tus espaldas, a una altura de 40-50cm",
    "Adopta una posición de estocada larga hacia adelante — el pie delantero debe quedar suficientemente adelantado para que la rodilla no sobrepase los dedos al bajar",
    "Coloca el empeine del pie trasero sobre el banco, con la pierna relajada",
    "Mantén el torso erguido y el core activado durante todo el movimiento",
    "Baja flexionando la rodilla delantera, manteniéndola alineada con el segundo dedo del pie",
    "Baja hasta que el muslo delantero quede paralelo al suelo y la rodilla trasera casi toque el suelo",
    "Empuja con el talón del pie delantero (no los dedos) para volver a la posición inicial"
  ]'::jsonb,
  common_mistakes = '[
    "Distancia incorrecta al banco — si la rodilla sobrepasa los dedos al bajar, mueve el pie delantero más hacia adelante",
    "Rodilla delantera colapsando hacia adentro — activa conscientemente el glúteo para mantener la alineación",
    "Apoyar demasiado peso en el pie trasero — el 90% del peso debe estar en la pierna delantera en todo momento",
    "Inclinarse excesivamente hacia adelante — mantén el torso perpendicular al suelo para maximizar el trabajo de glúteo",
    "Altura incorrecta del banco — si es demasiado alto, compensa con la cadera y reduce el trabajo de glúteo"
  ]'::jsonb,
  equipment = '[
    "Banco, silla o step sólido y antideslizante (40-50cm de altura)",
    "Opcional: mancuernas para progresar la dificultad"
  ]'::jsonb
WHERE id = 'bulgarian_split_squat';

-- 24. SINGLE_LEG_RDL
UPDATE public.exercises
SET
  instructions = '[
    "Apóyate sobre la pierna derecha con la rodilla ligeramente flexionada — nunca completamente recta para proteger la articulación",
    "Fija la mirada en un punto en el suelo a 1-2 metros al frente — ayuda enormemente al equilibrio",
    "Inicia la bisagra de cadera llevando el torso hacia adelante y la pierna izquierda hacia atrás de forma simultánea",
    "Mantén la espalda completamente recta durante todo el movimiento — no redondees la columna aunque reduzcas el rango",
    "La pierna libre se extiende hacia atrás formando línea recta con el torso — ambos forman la misma línea horizontal",
    "Para cuando sientas un estiramiento claro en el isquio de la pierna de apoyo — ese es tu rango actual, no lo fuerces más",
    "Vuelve apretando el glúteo de la pierna de apoyo — este apretón es lo que inicia el retorno, no los isquios"
  ]'::jsonb,
  common_mistakes = '[
    "Redondear la espalda al bajar — mantén la columna absolutamente neutra aunque el rango sea menor. La espalda recta primero, el rango después",
    "Rotar la cadera (la cadera del pie libre cae hacia abajo) — mantén ambas caderas niveladas durante todo el movimiento",
    "Perder el equilibrio por no fijar la mirada — elige un punto fijo en el suelo y no lo pierdas de vista",
    "Bajar demasiado sin mantener la línea recta torso-pierna — para en el punto de control máximo"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Opcional: mancuerna en la mano contralateral para progresar y paradójicamente mejorar el balance"
  ]'::jsonb
WHERE id = 'single_leg_rdl';

-- 25. STEP_UPS
UPDATE public.exercises
SET
  instructions = '[
    "Colócate frente a un cajón o step sólido y antideslizante de 30-40cm de altura",
    "Coloca completamente el pie derecho sobre el cajón — todo el pie debe quedar apoyado, no solo los dedos",
    "Empuja con el TALÓN del pie derecho (no con los dedos) para subir — este detalle determina qué músculo trabaja: talón activa glúteo, dedos activan cuádriceps",
    "El pie izquierdo (trasero) queda completamente relajado y solo roza el cajón al llegar arriba — no te impulses con él",
    "Sube hasta estar completamente erguido sobre la pierna derecha, extendiendo completamente la cadera y apretando el glúteo arriba",
    "Baja lentamente con control, tocando suavemente el suelo con el pie izquierdo antes de iniciar la siguiente repetición",
    "Completa todas las repeticiones de un lado antes de cambiar al otro"
  ]'::jsonb,
  common_mistakes = '[
    "Usar el pie trasero para impulsarse — si te ayudas con la pierna de atrás, el ejercicio pierde gran parte de su efectividad",
    "No extender completamente la cadera arriba — en la cima debes estar completamente erguido, glúteo apretado",
    "Rodilla colapsando hacia adentro durante la subida — activa el glúteo medio para mantener la rodilla alineada con el pie",
    "Inclinarse excesivamente hacia adelante al subir — mantén el torso erguido para maximizar el trabajo de glúteo",
    "Cajón demasiado alto que obliga a compensar — empieza con una altura donde puedas mantener buena forma"
  ]'::jsonb,
  equipment = '[
    "Cajón, step o banco sólido y antideslizante (30-40cm)",
    "Opcional: mancuernas para progresar la dificultad"
  ]'::jsonb
WHERE id = 'step_ups';

-- 26. HIP_THRUST
UPDATE public.exercises
SET
  instructions = '[
    "Apoya la parte superior de la espalda en el borde de un banco firme, con los omóplatos rozando el extremo del banco",
    "Coloca los pies planos en el suelo a la anchura de las caderas, talones a 30-40cm del banco",
    "Deja que la cadera descanse en el suelo o cerca del suelo — posición de inicio baja",
    "Activa el core y los glúteos antes de subir",
    "Empuja con los talones y eleva la cadera hacia arriba hasta que el torso quede paralelo al suelo — no más alto",
    "En la posición alta, aprieta los glúteos al máximo durante 2 segundos — si sientes la espalda baja en vez de los glúteos, estás arqueando demasiado",
    "Baja controladamente hasta casi tocar el suelo, sin descansar completamente entre repeticiones"
  ]'::jsonb,
  common_mistakes = '[
    "Arquear la espalda baja al subir en lugar de elevar con los glúteos — si las costillas bajas se separan del torso, estás usando la espalda",
    "Empujar con la punta del pie en vez del talón — el talón activa el glúteo, los dedos activan los cuádriceps",
    "No llegar a la posición paralela al suelo (quedarse corto) — busca la línea rodilla-cadera-hombro paralela al suelo",
    "Subir demasiado produciendo hiperextensión lumbar — la posición alta es torso paralelo al suelo, no en arco hacia atrás",
    "No mantener la contracción de glúteos arriba — la pausa de 2 segundos apretando es la diferencia entre activar bien o mal"
  ]'::jsonb,
  equipment = '[
    "Banco, sofá o step firme y estable",
    "Opcional: barra o disco para añadir resistencia",
    "Opcional: almohadilla o toalla enrollada para proteger la cadera si usas peso"
  ]'::jsonb
WHERE id = 'hip_thrust';

-- 27. CALF_RAISES
UPDATE public.exercises
SET
  instructions = '[
    "Colócate de pie con los pies a la anchura de las caderas, dedos apuntando al frente",
    "Apoya ligeramente las manos en una pared o respaldo para equilibrio — no uses las manos para empujarte",
    "Elévate sobre las puntas de los pies tan alto como puedas, apretando los gemelos al máximo en la posición superior",
    "Mantén la posición superior 1-2 segundos con máxima contracción antes de bajar",
    "Baja lentamente en 3 segundos hasta que los talones toquen el suelo — el descenso lento produce la adaptación, no lo omitas",
    "Progresión natural: hazlo apoyado en el borde de un escalón con el talón colgando para mayor rango de movimiento",
    "Progresión avanzada: una sola pierna — dobla el número de repeticiones de lo que puedes hacer a dos piernas"
  ]'::jsonb,
  common_mistakes = '[
    "No subir completamente a la máxima altura — el rango completo es lo que produce fuerza y movilidad, a medias no sirve",
    "Flexionar las rodillas para facilitar el ejercicio — las piernas deben estar rectas para trabajar el gastrocnemio correctamente",
    "Bajar con gravedad sin control — el descenso controlado es igual o más importante que la subida",
    "Hacer demasiadas repeticiones rápidas en vez de pocas lentas y con rango completo — la calidad siempre supera a la cantidad"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Opcional: pared para equilibrio",
    "Progresión: escalón o step para mayor rango de movimiento"
  ]'::jsonb
WHERE id = 'calf_raises';

-- 28. LUNGES
UPDATE public.exercises
SET
  instructions = '[
    "Colócate de pie con los pies a la anchura de las caderas, postura erguida y core activado",
    "Da un paso largo hacia adelante con el pie derecho — la longitud del paso determina el trabajo muscular: más largo activa más el glúteo",
    "Baja flexionando ambas rodillas simultáneamente: la rodilla delantera hacia adelante, la trasera hacia el suelo",
    "La rodilla trasera debe casi tocar el suelo — sin golpearlo, baja de forma controlada",
    "Mantén el torso perpendicular al suelo — no te inclines sobre la rodilla delantera",
    "La rodilla delantera debe permanecer alineada con el segundo dedo del pie, sin sobrepasar los dedos en exceso",
    "Empuja con el talón del pie delantero para volver a la posición inicial, y alterna con la pierna izquierda"
  ]'::jsonb,
  common_mistakes = '[
    "Paso demasiado corto — si el muslo delantero no queda paralelo al suelo al bajar, necesitas alargar el paso",
    "Rodilla delantera colapsando hacia adentro — activa el glúteo medio para mantener la alineación correcta",
    "Inclinarse hacia adelante sobre la rodilla delantera — el torso debe permanecer vertical durante todo el movimiento",
    "Rodilla trasera golpeando el suelo con fuerza — baja de forma controlada, el suelo es la referencia, no el destino",
    "Perder el equilibrio al alternar — si ocurre constantemente, practica primero series completas de un solo lado"
  ]'::jsonb,
  equipment = '[
    "Ninguno",
    "Opcional: mancuernas para aumentar la dificultad progresivamente"
  ]'::jsonb
WHERE id = 'lunges';

-- 29. WALKING
UPDATE public.exercises
SET
  instructions = '[
    "Usa calzado cómodo con buen soporte o camina descalzo si el terreno lo permite",
    "Adopta una postura erguida: cabeza levantada, hombros relajados hacia atrás y abajo, pecho abierto — no te encorves",
    "Comienza a un ritmo al que puedas mantener una conversación completa — este es el límite superior correcto de intensidad aeróbica de baja intensidad",
    "Contacto talón-planta-punta en cada paso: el talón aterriza primero, luego el pie se despliega hacia los dedos",
    "Balancea los brazos de forma natural y opuesta a cada pierna, doblados aproximadamente a 90 grados",
    "Respira de forma rítmica y natural — si te quedas sin aire para hablar, reduce el ritmo",
    "Mantén el tiempo indicado de forma continua — si necesitas parar, habrás ido demasiado rápido la próxima vez"
  ]'::jsonb,
  common_mistakes = '[
    "Caminar demasiado rápido sin poder mantener conversación — pierdes el beneficio aeróbico de baja intensidad que buscamos en esta fase",
    "Encorvarse hacia adelante — la postura erguida es parte del entrenamiento postural, no solo el caminar",
    "Pasos demasiado largos (overstriding) — pasos más cortos y frecuentes es más eficiente y seguro para las articulaciones",
    "Tensión en hombros, cuello o mandíbula — escanea tu cuerpo cada 5 minutos y relaja las tensiones innecesarias"
  ]'::jsonb,
  equipment = '[
    "Calzado cómodo",
    "Ropa transpirable",
    "Opcional: bastones de senderismo para mayor implicación del tren superior"
  ]'::jsonb
WHERE id = 'walking';

-- 30. BIKE_INTERVALS
UPDATE public.exercises
SET
  instructions = '[
    "Ajusta el sillín a la altura correcta: al pedalear, la pierna de abajo debe quedar casi extendida con una ligera flexión de rodilla — ni recta ni muy doblada",
    "Ajusta el manillar a una altura que te permita mantener la espalda relativamente recta sin tensión en el cuello",
    "Calentamiento obligatorio: 5 minutos pedaleando a ritmo muy suave (conversación fluida, sin ningún esfuerzo aparente)",
    "Intervalo de trabajo (2 minutos): aumenta el ritmo a uno donde puedas hablar pero con algo de esfuerzo — no es un sprint",
    "Intervalo de recuperación (1 minuto): vuelve al ritmo suave de calentamiento para recuperarte",
    "Repite el ciclo 6-8 veces manteniendo una cadencia constante de 80-90 RPM durante los intervalos",
    "Enfriamiento obligatorio: 5 minutos a ritmo muy suave antes de parar — nunca pares de golpe"
  ]'::jsonb,
  common_mistakes = '[
    "Sillín demasiado bajo — obliga a flexionar en exceso la rodilla, sobrecargando la articulación y reduciendo la eficiencia del pedaleo",
    "Sillín demasiado alto — produce balanceo de cadera y tensión en la espalda baja que acumula con el tiempo",
    "Ritmo demasiado intenso en los intervalos de trabajo — no debe ser un sprint, debes poder decir frases cortas aunque con esfuerzo",
    "No realizar calentamiento ni enfriamiento — el inicio y parada bruscos estresan innecesariamente el sistema cardiovascular",
    "Agarre muy tenso del manillar acumulando tensión en hombros y cuello — relaja las manos y los hombros conscientemente durante la sesión"
  ]'::jsonb,
  equipment = '[
    "Bicicleta estática o de spinning",
    "Toalla",
    "Botella de agua (hidrátate antes y durante)",
    "Opcional: monitor de frecuencia cardíaca para control objetivo de la intensidad"
  ]'::jsonb
WHERE id = 'bike_intervals';
