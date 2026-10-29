# B03-C5a — Dirección Sonora Premium

Fecha: 29-10-2026. Producto: **SEMANTROPIC TRIVIA 1.0**.
Estado: **diseño documental preparado para revisión artística del Director**.
Autoriza este documento la instrucción expresa del Director de ejecutar B03-C5a.
La personalidad Caricatura Familiar fue elegida por el Director; catálogo y audio
requieren escucha antes de aprobación. No autoriza C5b/C5c o B04.
No se producen archivos de audio ni se implementa reproducción en este bloque.

## 1. Identidad oficial: SEMANTROPIC POP — CARICATURA FAMILIAR

**Decisión del Director:** «Cristal cercano» queda rechazada y sustituida por
**Caricatura Familiar**. La personalidad es oficial; catálogo y realizaciones
audibles requieren revisión. La dirección visual aprobada permanece intacta.

Personalidad caricaturesca, cercana, simpática, familiar, expresiva y juguetona;
pop colorida y optimista, con humor amable y acabado comercial profesional.
Preguntados es referencia conceptual de alegría social, nunca fuente de melodías,
efectos, grabaciones ni imitaciones. No infantilizar ni burlarse de quien falla.

Paleta: boing elástico corto, pop de burbuja, plop redondo, boop electrónico
cómico, silbidos ascendentes/descendentes suaves, xilófono y marimba. Música con
percusión ligera, bajo saltarín y pequeñas trompetas sordas como puntuación
ocasional. No apilar todos los timbres en cada evento. Silbidos de registro medio
y trompetas sin estridencia. Sin risas, voces de burla, bocinas fuertes,
zumbadores punitivos ni percusión incesante.

Quedan excluidos como identidad sonidos mágicos, cristales, hechizos, ambientes
galácticos, fantasía mística y música épica. Sin colas etéreas, drones espaciales
ni grandes reverberaciones. Predominan ataques redondos y colas cortas.

Motivo nuevo a componer: pregunta de dos notas repetidas y respuesta de tres
notas sincopadas en marimba, pausa cómica breve y remate de boop. Contorno
propuesto 3–3 / 5–2–1, 4/4, sin fijar tonalidad ni melodía definitiva. Bajo a
contratiempo con saltos moderados; xilófono solo en remates. No reutilizar la
célula 1–2–5 ni el arreglo rechazado. Originalidad y memorabilidad se evalúan
escuchando muestras, no por una descripción escrita.

Los botones hacen pop; los avances rebotan; el acierto responde con una frase
alegre breve; el error usa un boop bajo amable distinto del agotamiento. El lobby
invita a reunirse, la partida deja espacio para leer y el resultado celebra
completar una ronda, sin anunciar victorias online, rangos ni premios inexistentes.

## 2. Convenciones del catálogo

Duraciones objetivo incluyen la cola. Son especificaciones para producción,
no mediciones. Ganancia relativa en dB respecto del recurso de acierto a 0 dB,
después de igualar perceptualmente los archivos en escucha; no indica volumen
físico ni seguridad auditiva. Se multiplica posteriormente por el volumen del
bus y el maestro. Prioridades: P1 resultado/resolución; P2 transición; P3
interfaz/aviso; P4 ambiente. P1 tiene precedencia, nunca vence silencio.
Cada ID es estable y cada evento es un contrato propuesto, no una API existente.

### Efectos: 21 recursos

| ID / nombre | Propósito y carácter | Duración | Nivel | Prioridad | Evento exacto propuesto |
|---|---|---|---|---|---|
| ui_press / Pop de botón | Confirmar botón; burbuja seca redonda con pequeño rebote | 70–110 ms | −9 dB | P3 | Activación aceptada por click, toque o teclado; sin duplicar pointerdown/click |
| ui_navigate / Boop de paseo | Cambio de menú; dos boops medios ascendentes de ataque blando | 150–220 ms | −8 dB | P3 | Navegación efectiva a otro menú; sustituye ui_press |
| ui_back / Plop de regreso | Orientar regreso; plop descendente corto y simpático | 140–220 ms | −8 dB | P3 | Regreso efectivo por acción de usuario; sustituye ui_press |
| arena_enter / ¡A jugar! | Presentar Arena; boing breve, marimba sincopada y acento de trompeta sorda | 800–1100 ms | −4 dB | P2 | Entrada efectiva desde lobby, una vez por entrada |
| question_reveal / Pregunta al salto | Señalar pregunta legible; pop y golpe seco de xilófono | 160–240 ms | −9 dB | P2 | Nueva pregunta visible y activa; una vez por questionId |
| category_geografia / De paseo | Identificar Geografía; silbido ascendente corto con plop, sin cliché regional | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Geografía si cambia categoría |
| category_ciencias / Boop curioso | Identificar Ciencias; boop de dos alturas con modulación cómica breve | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Ciencias si cambia categoría |
| category_historia / Toc-toc | Identificar Historia; dos golpes de marimba y remate de bloque de madera | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Historia si cambia categoría |
| category_arte_cultura / Pincel travieso | Identificar Arte y cultura; tres notas de xilófono con pausa juguetona | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Arte y cultura si cambia categoría |
| category_deportes / Rebote | Identificar Deportes; boing amortiguado y palmada sintética ligera | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Deportes si cambia categoría |
| category_entretenimiento / Ta-dá pequeño | Identificar Entretenimiento; dos notas de trompeta sorda y pop seco | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Entretenimiento si cambia categoría |
| answer_select / Plop encajado | Reconocer selección aceptada; plop compacto de tono medio | 70–110 ms | −10 dB | P3 | Una alternativa aceptada por motor; sin sonar ante duplicado o fuera de plazo |
| answer_correct / ¡Bien ahí! | Acierto; marimba ascendente sincopada y pop final, celebración breve | 450–650 ms | 0 dB | P1 | Resolución correcta confirmada; una vez por pregunta |
| answer_incorrect / Ups amable | Error; boop grave redondo con deslizamiento y rebote neutro; sin burla ni trombón de fracaso | 300–450 ms | −4 dB | P1 | Resolución incorrecta confirmada; sin zumbador ni caída dramática |
| timer_soft / Toc de atención | Recordar tiempo; único toc de madera de cuerpo redondo | 60–100 ms | −14 dB | P3 | Cruce real de 5 s restantes, solo pregunta activa y aviso habilitado |
| time_expired / Se cerró el turno | Plazo terminado; silbido descendente moderado y plop seco | 350–500 ms | −5 dB | P1 | Resolución por agotamiento; excluye answer_incorrect |
| question_next / Salto de página | Avance; mini boing ascendente con tope de madera | 140–220 ms | −9 dB | P2 | Avance explícito aceptado a otra pregunta; sustituye ui_press |
| round_complete / Ronda redonda | Celebrar completar; motivo de marimba, bajo saltarín y dos acentos cortos de trompeta | 1200–1800 ms | −2 dB | P1 | Apertura de resumen después de avance final; una vez por roundId |
| replay / Otro saltito | Reinicio; boing corto y respuesta optimista de xilófono | 350–500 ms | −6 dB | P2 | Volver a jugar aceptado y nueva ronda creada |
| audio_enable / Boop de prueba | Previsualizar control; boop medio amistoso sin remate extra | 80–120 ms | −12 dB | P3 | Activar efectos explícitamente, una vez y al volumen elegido |
| audio_adjust / Pop de escucha | Ayudar a ajustar; pop neutro sin barrido ni sorpresa | 70–100 ms | −12 dB | P3 | Final de ajuste de efectos, con máximo una muestra cada 500 ms |

No sonido al hover, foco, scroll, botón deshabilitado o pulsación rechazada.
Las seis categorías comparten duración y fuerza; su identificación no es
información necesaria para responder y no sugiere dificultad ni valor de puntos.
El aviso cubre los últimos segundos con un solo pulso a 5 s; no hay tic por
segundo, aceleración ni crescendo. Se puede desactivar independientemente.

### Música: 3 recursos

| ID / nombre | Propósito y carácter | Duración | Nivel | Prioridad | Evento exacto propuesto |
|---|---|---|---|---|---|
| music_lobby / Patio Pop | Encuentro social; melodía original pegadiza de marimba, xilófono de respuesta, bajo saltarín, shaker y escobillas; trompeta sorda puntual; 108 BPM, 4/4 | 32 compases ≈71,1 s, bucle | −18 dB | P4 | Lobby visible, audio desbloqueado y música habilitada |
| music_arena / Piensa y salta | Concentración juguetona; marimba espaciada, bajo pizzicato sintetizado, percusión mínima y pausas; sin silbidos durante lectura; 96 BPM, 4/4 | 24 compases =60 s, bucle | −23 dB | P4 | Ronda activa visible; sin sincronizar con respuestas o plazo |
| music_results / Otra ronda juntos | Cierre optimista; respuesta al motivo con marimba, bajo rebotado y trompeta suave solo en entrada, después arreglo ligero; 104 BPM, 4/4 | 16 compases ≈36,9 s, bucle | −20 dB | P4 | Resumen visible; entrar después de round_complete |

Composición original con desarrollo y silencios; ninguna pista es un preset
genérico repetido. Sin letra, voces ni percusión insistente. Entregar bucles
musicales completos, colas compatibles y puntos de loop documentados en muestras.
La viabilidad del bucle comprimido se comprobará en navegador antes de elegir
la entrega definitiva; evitar prometer reproducción sin cortes no medida.

## 3. Reglas de mezcla y coexistencia

- Máximo tres voces de efectos y dos fuentes musicales solo durante fundido.
  Una única música estable. El límite se aplica antes de crear nodos.
- Un grupo de resolución admite solo un P1 por pregunta. Agotamiento y respuesta
  son mutuamente excluyentes según el estado ya resuelto del motor.
- Primera pregunta: arena_enter sustituye categoría/reveal. Después, si cambia
  categoría, su acento sustituye question_reveal. Misma categoría: solo reveal.
  Al avanzar, question_next tiene precedencia y el acento/reveal se descarta si
  llega dentro de 300 ms; nunca se espera para mostrar pregunta o iniciar reloj.
- Si la respuesta se valida en el mismo paso que la selección, P1 sustituye
  answer_select. Si existiera separación real, omitir select cuando se recibió
  resolución antes de iniciar su reproducción; no retrasar feedback para oírlo.
- Al resolver, cancelar aviso y cortar colas de interfaz con rampa de 20 ms.
  Al acabar la ronda, el último feedback suena primero; el resumen tras avance
  activa round_complete, que sustituye navegación. Replay sustituye click y
  descarta el reveal inicial si coincide dentro de 300 ms.
- Antirrebote de interfaz: 100 ms por grupo; deduplicación por
  roundId/questionId/eventType y descarte de eventos fuera del estado vigente.
  No guardar una cola para reproducir sonidos viejos después.
- P1 atenúa música 5 dB con entrada de 30 ms y recuperación de 350 ms tras su
  cola. Transición musical de 600 ms; verificar suma y margen al cruzar pistas.
  Prioridad baja nueva se descarta al llegar al límite; P1 puede retirar P3
  más antiguo mediante rampa. Nunca cortar otra resolución para un click.
- Propuesta de mezcla: efectos a 60 %, música a 30 %, maestro a 80 % cuando
  la persona habilite audio; antes, salida silenciosa. Evitar compresión agresiva.
  Son valores iniciales a evaluar, no niveles aprobados ni garantía auditiva.

## 4. Arquitectura propuesta para React + Vite

Diseño para implementación futura; no se crean módulos ni dependencias ahora.

| Módulo futuro | Responsabilidad y límite |
|---|---|
| audioCatalog | Manifiesto tipado: ID, fuentes/MIME, categoría, ganancia, prioridad, grupo, cooldown, versión, duración y licencia |
| audioEngine | Un AudioContext diferido; buffers SFX, fuentes musicales, buses sfx/music/master, rampas, ducking y límites |
| audioPolicy | Reducir eventos semánticos a intenciones deduplicadas; nunca decidir aciertos, tiempo o resultados |
| audioPreferences | Versión, mute, musicVolume, sfxVolume, timerCueEnabled; validación y persistencia local tolerante a errores |
| AudioProvider + adaptador React | Suscripción única fuera del render; limpieza idempotente en desmontaje/StrictMode; exponer acciones y estado |
| controles accesibles | Silencio, volúmenes independientes y aviso; diseño visual se revisará en C5c antes de tocar lobby/Arena |

Flujo: acción/estado confirmado → política → motor → bus → salida.
El reloj de juego existente es fuente del cruce a 5 s; el reloj del audio nunca
modifica tiempos, respuestas o puntuación. Si se reanuda con menos de 5 s,
no reproducir el aviso perdido. Futuro servidor: consumir resolución autoritativa,
sin anticipar resultado local. No añadir un segundo motor de audio en Phaser.

Se propone Web Audio nativo para efectos cortos en AudioBuffer; música mediante
HTMLAudioElement conectado al bus correspondiente para carga progresiva.
Reusar un elemento por pista activa, liberar fuentes y buffers innecesarios;
evaluar bucles comprimidos en Safari. Si sus cortes son audibles, estudiar un
buffer de la pista activa dentro del presupuesto antes de cambiar arquitectura.
La distinción entre buffers cortos y medios largos sigue las
[prácticas de Web Audio de MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

### Inicio, interrupciones y fallos

Crear/reanudar contexto dentro de una acción explícita para habilitar sonido;
comprobar promesas de resume/play y estado. No asumir permiso por cargar página
o por preferencias guardadas. Si se bloquea, mantener juego funcional y permitir
reintento explícito, sin diálogos repetidos ni sonidos acumulados. Estas medidas
responden a las [restricciones de autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

Al ocultar pestaña, pausar música, detener efectos y suspender contexto sin
alterar el reloj de la partida. Al volver, recalcular estado de juego antes de
considerar audio y comprobar permiso; nunca reproducir eventos históricos.
Interrupciones del sistema, auriculares y bloqueo de pantalla requieren pruebas
reales. Carga o decodificación fallida: probar una fuente alternativa una vez,
después silencio y diagnóstico técnico sin bloquear preguntas. Evitar bucles de
reintentos. Cancelar cargas al cambiar de escena; no recrear motor por render.

### Archivos y presupuesto

- Máster de producción WAV PCM 48 kHz / 24 bits, proyectos editables, stems de
  melodía/marimba/bajo/percusión/acentos cómicos y exportaciones sin normalización destructiva. Efectos
  mono salvo entrada/cierre que justifiquen estéreo; música estéreo compatible
  con mono. No introducir silencio inicial perceptible; rampas evitan clicks.
- Entrega candidata Opus en WebM (SFX 64–96 kb/s, música 96–128 kb/s) y alternativa
  MP3 (SFX 128 kb/s, música 160 kb/s). Seleccionar fuente por capacidad declarada
  y decodificación real; no descargar ambos formatos por defecto. La elección
  requiere pruebas con los contenedores y dispositivos objetivo, conforme a la
  [guía de códecs de MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs).
- Objetivos, no resultados medidos: SFX elegidos ≤1 MB transferido, primera
  música ≤2 MB; catálogo completo de una codificación ≤6 MB. Precarga solo SFX
  esenciales tras habilitación; músicas por ruta, sin bloquear trivia.
- Presupuesto de buffers SFX ≤12 MiB decodificados; música progresiva preferida.
  Una pista de 84 s estéreo float32 a 48 kHz costaría aproximadamente 31 MiB
  adicionales si se decodifica completa: no cargar las tres como buffers.
- Manifiesto y archivos versionados mediante URL/hash, caché HTTP estática;
  confirmar Content-Type. Nombres futuros st_sfx_<id>_v001 y st_music_<id>_v001.
  No instalar librerías ni editar render.yaml en C5a.
- Techo propuesto del máster −1,5 dBTP; música alrededor de −20 LUFS integrados
  antes de ganancias, sin forzar LUFS en transitorios breves. Verificar peaks
  tras codificar y mezcla con máxima concurrencia. Rechazar clipping, ruido y
  colas cortadas; los valores se ajustarán mediante escucha y medición futura.

## 5. Accesibilidad y derechos

Toda información sonora tiene equivalente visual ya existente o que deberá
especificarse antes de implementar; se puede completar la ronda en silencio.
Sin panorámica obligatoria, frecuencias extremas o pistas de respuesta correcta
antes de resolver. Controles por teclado con nombres, valores y foco visibles;
no deducir uso de lector de pantalla. El modo discreto propuesto desactiva
música y aviso, manteniendo feedback opcional. Silenciar detiene fuentes y
colas inmediatamente mediante rampa corta; nunca emite sonido de confirmación.
Preferencias locales no son cuenta ni sincronización entre dispositivos.
La necesidad de control independiente del audio también está descrita en
[WCAG 1.4.2](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html).

Producción preferida: composición y síntesis originales por encargo con derechos
comerciales documentados. Cada recurso tendrá autor, procedencia, fecha, contrato
o licencia y versión, permisos para web/Android/iOS, edición, distribución y
promoción; registrar atribución si corresponde. No usar material sin procedencia
ni asumir que una descarga gratuita permite explotación comercial. Las muestras,
instrumentos y herramientas usados deben permitir el uso previsto, y la entrega
de stems debe respetar sus condiciones. Si se propone generación asistida,
documentar herramienta, términos aplicables y revisión humana de similitud antes
de admitir el asset. No hay recursos adquiridos ni derechos verificados en C5a;
la revisión contractual corresponde a la futura producción.

## 6. Especificación de muestras originales y reproducibles

**Orden obligatorio:** primero corrección documental, después archivos de audio
reproducibles y comparación audible antes de aprobar producción definitiva. Esta
revisión prepara la especificación: no afirma haber producido ni escuchado audio.
Los prototipos se entregarán separados del juego. No se aprueba por onomatopeyas.

### Paquete de escucha

Dos variantes dentro de Caricatura Familiar: **A — Pop redondo**, elástica y
contenida; **B — Comedia rítmica**, más expresiva con marimba y remates breves.
Mismas duraciones y niveles de referencia; ninguna es definitiva. No comparar
contra la identidad rechazada ni reintroducirla como alternativa.

| Muestras por variante | Contenido exigido | Comparación audible |
|---|---|---|
| ui_press y ui_back | Dos archivos: pop y plop; A seco, B con rebote corto | Diez pulsaciones a 500 ms y tres regresos; valorar fatiga |
| answer_correct | Frase original de marimba; A dos ataques, B frase sincopada | Alegría y claridad a igual sonoridad percibida |
| answer_incorrect y time_expired | Dos archivos: boop amable y silbido/plop | Alternar sin rótulos para comprobar distinción sin humillación |
| Seis category_* | Los seis timbres del catálogo, no un archivo renombrado | Orden fijo, pausas de 800 ms, misma secuencia A/B |
| Boing, pop, plop, boop, silbido arriba y silbido abajo | Seis estudios aislados de 100–500 ms; no nuevos eventos de juego | Carácter cómico, registro y ausencia de estridencia |
| music_lobby | Boceto de ocho compases a 108 BPM ≈17,8 s, repetido dos veces ≈35,6 s | Dos arreglos originales: bajo saltarín y percusión ligera; B suma trompeta breve, no volumen |

**18 archivos individuales por variante, 36 en total**, más montaje comparativo:
2 botones + acierto + error + agotamiento + 6 categorías + 6 estudios + música.
Los estudios pueden compartir síntesis con efectos, etiquetados como estudios.
No producir el catálogo completo antes de evaluar esta tanda.

Entrega futura WAV PCM 48 kHz/24 bits, SFX mono y música estéreo, más MP3 de
escucha. Carpeta separada del runtime, nunca public/ ni importaciones desde src/.
Nombres c5a_<id>_<A|B>_v001.wav; índice Markdown con enlaces relativos, duración,
autor/procedencia y estado PROTOTIPO, NO APROBADO. Montaje
c5a_comparacion_AB_v001.wav: A, pausa de 1 s y B por pareja; hoja con orden y
tiempos exactos. Primera comparación de SFX sin música encima ni voces necesarias
para identificar archivos.

Reproducibilidad: entregar fuente de síntesis/arreglo o proyecto editable,
versiones de herramientas, semilla si hay aleatoriedad, parámetros, tempo,
notas/ritmo, comando o pasos de exportación y manifiesto SHA-256. Sin extraer
audios de videojuegos ni transcribir sus melodías. Registrar licencias de
instrumentos/muestras; sustituir fuentes que impidan la entrega reproducible.

QA de entrega: apertura y decodificación real de cada archivo, duración, canales,
clipping, silencios accidentales, correspondencia A/B y hashes. Igualar sonoridad
por pareja sin eliminar expresión y medir picos tras exportar. Escuchar en
altavoz de teléfono, auriculares, mono y volumen bajo; registrar dispositivo,
herramienta y resultado. Validar archivos no equivale a aprobación humana ni a
PASS físico. No declarar escucha o aprobación que no se haya realizado.

Hoja del Director por pareja: A/B/ninguna, simpatía, claridad, molestia tras
repetición y ajuste solicitado. Evaluar música tras dos repeticiones y distinción
de acierto/error/agotamiento sin etiquetas. Solo después de escuchar se fija
variante, catálogo y alcance de producción definitiva. Mantener aviso único a
5 s, silencio y límites; el humor no penaliza ni añade presión competitiva.

Se conservan criterios posteriores de implementación: una reproducción por evento
aceptado, ninguna tras reanudar; preferencias, autoplay y errores de red
controlados. Validar Chrome y Firefox escritorio, Android Chrome e iOS Safari
reales, altavoz, auriculares, mono y lector de pantalla. Este QA sonoro aún no
se ha ejecutado; C5b/C5c y B04 permanecen sin iniciar.

## 7. Entrega y límites del bloque

Documento, roadmap y decisiones constituyen la entrega. B03 publicado y PR #15
fusionado son antecedentes confirmados por el Director, no una nueva auditoría
de Render. Se preservan los registros históricos y las especificaciones visuales.
PR documental preparado para revisión; **prohibido fusionar antes de la
aprobación del catálogo por el Director**. Sin cambios al juego, assets, lobby,
Arena, infraestructura o dependencias. Sin URL jugable nueva ni despliegue.
