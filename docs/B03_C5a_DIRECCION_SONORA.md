# B03-C5a — Dirección Sonora Premium

Fecha: 29-10-2026. Producto: **SEMANTROPIC TRIVIA 1.0**.
Estado: **diseño documental preparado para revisión artística del Director**.
Autoriza este documento la instrucción expresa del Director de ejecutar B03-C5a.
Ninguna propuesta equivale a aprobación artística ni autoriza C5b/C5c o B04.
No se producen archivos de audio ni se implementa reproducción en este bloque.

## 1. Identidad: Cristal cercano

La identidad propone conocimiento compartido como descubrimiento luminoso:
cristal con cuerpo suave, tecnología que responde con claridad y una fantasía
cálida que acompaña a personas de distintas edades. El carácter premium nace
del detalle, la coherencia y el espacio entre sonidos, sin aumentar el volumen.

Paleta: cristal sintetizado de ataque redondeado, madera afinada, pequeños
pulsos electrónicos y colchones armónicos aireados. Evitar campanillas agudas
persistentes, bajos dominantes, alarmas, voces, risas, aplausos y fanfarrias de
casino. Sin referencias melódicas, grabaciones ni imitaciones de otros juegos.
No se asocian culturas o edades a clichés musicales.

Firma propuesta: tres notas propias sobre grados 1–2–5, con ritmo corto–corto–largo
y una pequeña resonancia de cristal sobre base de madera. Es una célula a
componer, no una melodía aprobada; su originalidad debe revisarse al escuchar
el material producido. Las acciones frecuentes usan fragmentos de una o dos
notas; la firma completa se reserva a entrada y cierre. Registro medio, armonía
mayor abierta con segundas y sextas suaves; sin modulación brusca ni tensión
creciente al acercarse el plazo.

La interfaz se siente ágil; la Arena, curiosa y concentrada; el resultado,
satisfecho y acogedor. Una respuesta incorrecta invita a continuar y nunca
ridiculiza. La celebración final reconoce completar la práctica: no proclama
victoria online, rango ni recompensa inexistente.

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
| ui_press / Toque de luz | Confirmar botón común; madera con brillo corto | 70–110 ms | −9 dB | P3 | Activación aceptada por click, toque o teclado; sin duplicar pointerdown/click |
| ui_navigate / Paso luminoso | Cambio de menú; dos gotas suaves ascendentes | 150–220 ms | −8 dB | P3 | Navegación efectiva a otro menú; sustituye ui_press |
| ui_back / Regreso cálido | Orientar regreso; caída breve sin tono de error | 140–220 ms | −8 dB | P3 | Regreso efectivo por acción de usuario; sustituye ui_press |
| arena_enter / Umbral de cristal | Presentar Arena; firma sobre aire cálido | 800–1100 ms | −4 dB | P2 | Entrada efectiva desde lobby, una vez por entrada |
| question_reveal / Ventana de conocimiento | Señalar pregunta legible; destello amortiguado | 160–240 ms | −9 dB | P2 | Nueva pregunta visible y activa; una vez por questionId |
| category_geografia / Horizonte | Identificar Geografía; cristal abierto y soplo breve | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Geografía si cambia categoría |
| category_ciencias / Órbita | Identificar Ciencias; dos pulsos redondos y cristal | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Ciencias si cambia categoría |
| category_historia / Memoria | Identificar Historia; madera resonante con luz cálida | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Historia si cambia categoría |
| category_arte_cultura / Prisma | Identificar Arte y cultura; cristal y cuerda pulsada suave | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Arte y cultura si cambia categoría |
| category_deportes / Impulso | Identificar Deportes; pulso de madera elástico | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Deportes si cambia categoría |
| category_entretenimiento / Chispa | Identificar Entretenimiento; dos notas juguetonas moderadas | 280–400 ms | −10 dB | P2 | Entrada de pregunta de Entretenimiento si cambia categoría |
| answer_select / Encaje | Reconocer selección aceptada; cierre táctil suave | 70–110 ms | −10 dB | P3 | Una alternativa aceptada por motor; sin sonar ante duplicado o fuera de plazo |
| answer_correct / Cristal resuelto | Acierto; dos notas abiertas con resonancia luminosa | 450–650 ms | 0 dB | P1 | Resolución correcta confirmada; una vez por pregunta |
| answer_incorrect / Otra oportunidad | Error amable; madera y intervalo neutro que se posa | 300–450 ms | −4 dB | P1 | Resolución incorrecta confirmada; sin zumbador ni caída dramática |
| timer_soft / Pulso de atención | Recordar tiempo sin alarma; pulso mate único | 60–100 ms | −14 dB | P3 | Cruce real de 5 s restantes, solo pregunta activa y aviso habilitado |
| time_expired / Cierre suave | Expresar plazo terminado; aire y cristal que se apaga | 350–500 ms | −5 dB | P1 | Resolución por agotamiento; excluye answer_incorrect |
| question_next / Paso de página | Reconocer avance; barrido breve de madera/cristal | 140–220 ms | −9 dB | P2 | Avance explícito aceptado a otra pregunta; sustituye ui_press |
| round_complete / Constelación | Celebrar completar diez preguntas; firma cálida completa | 1200–1800 ms | −2 dB | P1 | Apertura de resumen después de avance final; una vez por roundId |
| replay / Nueva chispa | Reinicio optimista; pequeño ascenso abierto | 350–500 ms | −6 dB | P2 | Volver a jugar aceptado y nueva ronda creada |
| audio_enable / Luz encendida | Previsualizar control sin sorpresa; toque redondeado | 80–120 ms | −12 dB | P3 | Activar efectos explícitamente, una vez y al volumen elegido |
| audio_adjust / Punto de escucha | Ayudar a ajustar volumen; toque neutro | 70–100 ms | −12 dB | P3 | Final de ajuste de efectos, con máximo una muestra cada 500 ms |

No sonido al hover, foco, scroll, botón deshabilitado o pulsación rechazada.
Las seis categorías comparten duración y fuerza; su identificación no es
información necesaria para responder y no sugiere dificultad ni valor de puntos.
El aviso cubre los últimos segundos con un solo pulso a 5 s; no hay tic por
segundo, aceleración ni crescendo. Se puede desactivar independientemente.

### Música: 3 recursos

| ID / nombre | Propósito y carácter | Duración | Nivel | Prioridad | Evento exacto propuesto |
|---|---|---|---|---|---|
| music_lobby / Plaza de luz | Identidad social; madera, cristal espaciado y armonía cálida; 92 BPM, 4/4 | 32 compases ≈83,5 s, bucle | −18 dB | P4 | Lobby visible, audio desbloqueado y música habilitada |
| music_arena / Ideas en órbita | Sostener concentración; textura ligera y pocos ataques; 80 BPM, 4/4 | 24 compases =72 s, bucle | −23 dB | P4 | Ronda activa visible; sin sincronizar con respuestas o plazo |
| music_results / Luz compartida | Reposo satisfactorio; variante armónica del motivo, sin fanfarria; 88 BPM, 4/4 | 16 compases ≈43,6 s, bucle | −20 dB | P4 | Resumen visible; entrar después de round_complete |

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
  cristal/base/ambiente y exportaciones sin normalización destructiva. Efectos
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

## 6. Primera producción recomendada y aprobación

Primera tanda futura: **ocho efectos** — ui_press, ui_back, arena_enter,
question_reveal, answer_correct, answer_incorrect, timer_soft y time_expired —
y **un boceto de lobby de 20–30 s**, sin bucle final todavía. Presentar dos
variantes de firma (cristal con madera / cristal con pulso) dentro de la misma
identidad y elegir una antes de extenderla a categorías y tres músicas.
No producir el catálogo entero antes de esta escucha. Esta recomendación no
autoriza producción ni implementación de C5b/C5c.

Revisión del Director: aprobar o ajustar identidad, intensidad de acierto/error,
aviso único a 5 s, timbres de categoría, papel de la música y primera tanda.
Después se solicita el alcance concreto de producción, por separado de C5a.

Criterios para futura aceptación de audio: contraste comprensible en escucha
ciega de acierto/error/agotamiento sin carácter punitivo; mezcla agradable tras
dos rondas; ausencia de saturación, clicks y cortes de bucle; funcionamiento
en silencio; una reproducción por evento aceptado y ninguna tras reanudar;
preferencias, bloqueo autoplay y errores de red controlados. Validar Chrome y
Firefox escritorio, Android Chrome e iOS Safari reales, altavoz y auriculares,
mono y lector de pantalla. Nada de este QA sonoro se declara ejecutado ahora.

## 7. Entrega y límites del bloque

Documento, roadmap y decisiones constituyen la entrega. B03 publicado y PR #15
fusionado son antecedentes confirmados por el Director, no una nueva auditoría
de Render. Se preservan los registros históricos y las especificaciones visuales.
PR documental preparado para revisión; **prohibido fusionar antes de la
aprobación del catálogo por el Director**. Sin cambios al juego, assets, lobby,
Arena, infraestructura o dependencias. Sin URL jugable nueva ni despliegue.
