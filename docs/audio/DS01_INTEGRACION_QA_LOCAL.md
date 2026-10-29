# B03-C5 / DS-01 — motor listo, muestras privadas para QA

**Orden posterior:** el selector manual aquí descrito fue sustituido por
[autocarga local de DS-01](DS01_AUTOCARGA_LOCAL.md), solo en Vite dev. El bloqueo
de publicación, la procedencia y los eventos siguen vigentes.

29-10-2026. Autorización: Prompt Maestro DS-01 del Director, posterior a D-039.
Estado: código implementado para evaluación local; ninguna variante definitiva.
Sin merge ni publicación de audio. B04 y otras músicas no se inician.

## Base y receta verificada

Se partió de `93cd446` en `docs/b03-c5a-direccion-sonora`, con árbol limpio.
PR #16 sigue abierto/sin fusionar; `origin/main` sigue en `b4d19c1`. La nueva
rama `feat/audio-ds01-qa` conserva ese trabajo, sin reset, sustitución o mezcla
de la rama QA con main. PR de código apilado sobre la rama del PR #16: revisar
primero su dependencia antes de cualquier integración futura.

La referencia `chore/ds01-audio-qa-reproducible` fue recuperada de GitHub en
`a36dffd0e97b8f519d0b49809ddd6849b1c1c0a2`. Existen y se leyeron:

- [README](https://github.com/Danielsanchezdesarrolador/semantropic-trivia-next/blob/chore/ds01-audio-qa-reproducible/qa/audio/ds01/README.md).
- [render_local.py](https://github.com/Danielsanchezdesarrolador/semantropic-trivia-next/blob/chore/ds01-audio-qa-reproducible/qa/audio/ds01/render_local.py).

No se ejecutó el generador: en el entorno Windows actual no se dispone de la
cadena Python/numpy/scipy/soundfile + libfluidsynth/TimGM6mb + FFmpeg verificada.
No se instalaron fuentes o binarios alternativos. Se encontró el ZIP original
del Director en Descargas y se extrajeron solo los 13 MP3 individuales, catálogo
y LEEME a **C:/Users/Daniel/semantropic-ds01-qa**, fuera del repositorio.
Los 13 hashes coinciden con su catálogo original. No se pide un ZIP adicional.
No se copiaron el soundfont, reels, WAV ni el reproductor HTML del paquete.

## Procedencia y bloqueo de publicación

Las maquetas son interpretaciones MIDI/FluidSynth de TimGM6mb.sf2. No son Foley
humano original. El manifiesto [DS01_MANIFIESTO_QA.json](DS01_MANIFIESTO_QA.json)
conserva nombres, funciones, descripción, tamaño, duración, SHA-256 y estado de
licencia; las variantes reconstruidas con otras versiones pueden tener otro hash
y requieren nueva trazabilidad, nunca una equivalencia inventada.

[Debian identifica TimGM6mb.sf2 como GPL-2](https://sources.debian.org/copyright/license/timgm6mb-soundfont/1.3-5/),
con copyright de Tim Brechbill y David Bolton. La licencia aplicable a los derivados
sonoros y sus obligaciones de distribución siguen sin una evaluación suficiente.
La [FAQ de GNU sobre salidas](https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL)
se conserva como referencia de la receta; no se pudo consultar por timeout en esta
sesión. No se afirma que GPL prohíba uso comercial ni que estos audios estén libres
de obligaciones. Estado inequívoco: **QA local; publicación pendiente**.

Nada DS-01 se añade a Git, public/, build publicable, PWA, Render o releases.
Los archivos entran por File API a AudioBuffers de memoria: sin fetch, upload,
Object URLs, IndexedDB, localStorage de binarios o importación estática de assets.
Recargar exige volver a seleccionarlos. El volumen es el único ajuste persistido;
la salida siempre inicia desactivada y conserva cualquier elección de silencio.

El guard antes y después de `npm run build` revisa archivos versionados, src/,
public/ y dist/: rechaza audio no autorizado por hash, soundfonts, archivos de
audio renombrados con cabecera reconocible, archivos comprimidos y audio inline.
Solo admite los bytes de la música del lobby previamente verificada y de Cartoon 6.
También rechaza el panel privado en JavaScript de producción. No es una auditoría
jurídica de esos recursos existentes ni permite otros audios por cambiarles nombre.

## Eventos y separación de responsabilidades

`src/audio/ds01/catalog.ts`: cinco familias, 13 nombres exactos, sin reels.
`audioEngine.ts`: servicio tipado fuera de React; contexto/bus de efectos únicos,
buffers privados, volumen, mute, consentimiento, carga/decodificación y voces.
`quizAudioEvents.ts` / `useQuizAudio.ts`: observación de respuestas ya confirmadas,
con deduplicación por snapshot de sesión y questionId. Sin efectos dentro de
updaters React ni cambios al motor de respuestas, reloj, puntuación o categorías.

| Evento | Disparador real |
|---|---|
| POP01_BOTON | Navegar a otra pantalla desde un botón del lobby; entrar/salir de Arena; siguiente pregunta aceptada; reinicio al terminar; acciones efectivas de pantalla completa/ayuda |
| POP02_SELECCION | Alternativa válida que queda registrada; una vez, nunca duplicados o respuesta tardía |
| TIKI01_ACIERTO | Registro confirmado de acierto; una vez |
| TOOT01_ERROR | Registro confirmado de error de pregunta; una vez, nunca trombón de derrota Pixabay |
| POP03_TIEMPO | Registro de alternativeId nula por timeout real; una vez, también al retornar después de ocultación |

Selección inicia primero y feedback se programa 120 ms después, sin demorar
feedback visual ni lógica. Botones tienen cooldown 90 ms. Máximo cuatro voces;
botones no interrumpen feedback esencial. Resolución tiene precedencia sobre colas
anteriores si se llega al límite. Ausencia de muestras y silencio son no-ops,
sin beeps de sustitución. Importar no reproduce. Al ocultar, se detienen fuentes;
el timeout pendiente se consume una vez al volver, no en cada tick/foco. StrictMode
no duplica registros. Las nuevas preguntas y reinicios conservan claves independientes.

Los tres efectos Pixabay mantienen sus IDs. **HF1 posterior retira Colección como
disparador de Cartoon 6 y de POP01**; no se inventa otro uso, todos quedan reservados.
HF2 prepara música exacta solo en QA local; ver el correctivo enlazado abajo.

## Uso por el Director

1. Ejecutar `npm.cmd run dev` desde la raíz; confirmar puerto. Servidor actual
   comprobado en **http://localhost:5173/**, Arena en **http://localhost:5173/#arena**.
2. Desplegar **DS-01 · PREVIEW / QA local** al final de la página. No aparece en
   la vista oficial compilada de producción; sí en Vite dev del lobby y Arena.
3. En **Cargar 13 MP3 locales**, seleccionar los 13 archivos individuales de
   `C:/Users/Daniel/semantropic-ds01-qa`. No seleccionar DS01_AUDICION_COMPLETA
   o ESCUCHA_*. El panel muestra cargados/faltantes y procedencia/hashes.
4. Pulsar **Activar DS-01**, ajustar **Volumen DS-01**, probar A/B/C por familia.
   A está preseleccionada solo técnicamente; selección y tiempo terminan en B.
5. Entrar a Arena y jugar. La selección se conserva en memoria al navegar;
   no hay reproducción durante la carga inicial ni grabación de archivos en red.
   **Desactivar DS-01** silencia; **Descargar de memoria** libera las muestras.

La música física presente sigue siendo
`public/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3`, hash
`e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707`, preservado.
HF2 posteriormente encontró `18_lobby_pop_familiar.mp3` en Descargas con el mismo
hash exacto; no se sustituye ni renombra el original. Sus derechos explícitos de
publicación siguen pendientes. [Estado HF1/HF2](HF1_HF2_COLECCION_MUSICA.md).
Bombinsound continúa sin integrar. Se preservan 42 SVG, CSS de Arena, preguntas y temporizador.

## Evidencia y límites

- TypeScript PASS; **72 tests PASS / 0 FAIL**; build y guard pre/post PASS.
- Tests con mock de reproducción y motor real: selección+feedback, duplicados,
  error, respuesta tardía, timeout, avance, reinicio, ausencia de muestras,
  mute, volumen cero y rechazo de autoplay. Guard prueba audio renombrado.
- QA Chrome automatizado: 13 variantes cargadas, decodificadas y reproducidas;
  no upload ni peticiones DS-01; 1366×900, 390×844, 844×390 y 320×740.
  Escritorio: diez preguntas, 20 s reales en una pregunta y retorno de ocultación
  simulada tras otro plazo real de 20 s, dedupe, reinicio y salida. Móvil emulado:
  dos preguntas por resolución. No son pruebas en teléfono físico.
- Smoke del build oficial: rondas completas de diez preguntas, resultado 6/10,
  reinicio/navegación en 1366/390/320; cero regresiones detectadas.
- Evidencias locales: `artifacts/ds01-qa/`, `artifacts/b02-official/`. No contienen
  binarios DS-01. El guard confirma ausencia de DS-01 en contenido servido de dist/.
- Wi-Fi anunciado por Vite: http://192.168.1.8:5173/; teléfono físico no probado.
  En HTTP sin WebCrypto el panel indica que SHA no está disponible; hashes del
  paquete original ya se verificaron fuera del navegador.

Prueba manual auditiva PC por el Director, iOS/Safari, teléfono físico, elección
definitiva A/B/C y evaluación jurídica de derivados: **PENDIENTES**. Automatizar
llamadas de reproducción no certifica percepción humana o aprobación artística.
No se desplegó ni se fusionó el PR; no se declara Render actualizado con DS-01.
