# SFX-02 — nueve originales integrados en el juego local

**Actualización:** el Director aprobó la etapa artística y autorizó el cierre
técnico. El estado posterior y la revisión de distribución están en
[B03_C5_CIERRE_TECNICO.md](B03_C5_CIERRE_TECNICO.md). Este documento conserva la
entrega DEV anterior; sus prohibiciones operativas históricas no sustituyen la
autorización expresa posterior.

29-10-2026 · `feat/audio-ds01-qa` / PR #17 · **solo Vite dev, sin publicación**.

## Probar ahora

1. Abrir **http://localhost:5173/** y pulsar Colección u otro menú si el navegador
   necesita gesto: L7 y M1 están conectados sin importar archivos manualmente.
2. Entrar a Arena: L7 se pausa, C comienza a volumen bajo, A1/X3 acompañan el
   resultado y CLK sigue el deadline. Esperar 20 segundos comprueba el timeout
   existente, sin X3 adicional. Salir al lobby usa V1 y reanuda L7.
3. Completar las diez preguntas. En Resultados, desplegar **SFX-02 · Audición QA
   de resultados** y usar los dos botones de prueba W1/D2. No se declara victoria
   o derrota ni se modifica la puntuación por estas audiciones.

Controles independientes bajo el desplegable **Audio**: efectos, música lobby,
música Arena y reloj. Si se
guardó silencio, reactivar el control correspondiente. DS-01 queda en el panel
plegado, con modo laboratorio explícito; no se suma a M1/V1/A1/X3.
Reinicio: `npm.cmd run dev`; servidor confirmado en 5173. Wi-Fi anunciado:
http://192.168.1.8:5173/ (no comprobado en teléfono físico).

## Recepción efectiva y trazabilidad

Inicialmente no existían los nueve MP3 y las descargas oficiales devolvieron 403.
Durante la revisión final aparecieron los originales aportados por el Director
en **.local-sfx02-audio/** y Descargas. Esa nueva evidencia permitió continuar;
[el registro inicial](SFX02_ORIGINALES_PENDIENTES.md) queda como antecedente,
no como estado vigente. No se descargaron de mirrors ni se eludió la verificación.

Se conservaron los nombres y bytes originales. Los nueve SHA-256, tamaños,
autores, fuentes, licencia y decodificación efectiva están en
[SFX02_CATALOGO.json](SFX02_CATALOGO.json). Son hashes de los archivos aportados,
no checksums inventados ni certificados emitidos por Pixabay. Fecha de recepción
local: 29-10-2026; fecha exacta de descarga no proporcionada, campo null. El
certificado de C no está entre los archivos recibidos y no se inventa.

Las nueve páginas fuente se comprobaron y figuran bajo Pixabay Content License.
[C declara Content ID registrado](https://pixabay.com/music/funk-fun-amp-quirky-upbeat-retro-233935/).
No se garantiza ausencia de reclamos automatizados. Se conservan autoría y URLs;
son recursos de terceros. [La licencia](https://pixabay.com/service/license-summary/)
restringe la redistribución standalone: no se publica una biblioteca, ZIP o
descargas crudas, ni se suben estos MP3 a GitHub/Render en este bloque.

## Estado por recurso

| Código | Original confirmado y decodificado | Evento integrado | Escucha humana pendiente |
|---|---|---|---|
| M1 | Sí — Casual Click Pop UI 2 / floraphonic | Sí, transición de menú incluida Colección; misma pantalla no suena | Sí |
| V1 | Sí — Menu Back / freesound_gamestudio | Sí, retorno/cierre de sección y salida de Arena; excluye M1 del gesto | Sí |
| A1 | Sí — The Correct Answer 33 / Tuomas_Data | Sí, un acierto confirmado | Sí |
| X3 | Sí — Negative Notification / Universfield | Sí, un error confirmado; no timeout | Sí |
| W1 | Sí — Victory Fanfare / Universfield | Solo botón QA en Resultados; resultado competitivo real aún no existe | Sí |
| D2 | Sí — Game Over Orchestral Stinger - Cartoon Defeat / Coghezzi | Solo botón QA en Resultados; nunca error de pregunta o práctica perdida | Sí |
| L7 | Sí — Videogame Queue Music / Kaden_Cook | Sí, único tema lobby/submenús; 54,047 s | Sí |
| C | Sí — Fun & Quirky Upbeat Retro / moodmode | Sí, Arena; 118,596 s, inicialmente 12 % | Sí |
| CLK | Sí — Clock Tick (Tik Tak) / KaosMakinesi (Freesound), listado freesound_community | Sí, tic progresivo por deadline | Sí |

No falta ningún MP3. `18_lobby_pop_familiar.mp3` y el asset equivalente previamente
versionado conservan el SHA-256 histórico e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707;
quedan sin asignación de reproducción, sin borrar, renombrar o regenerar.

## Integración y exclusión de producción

- Se reutiliza el middleware privado de Vite, ahora con dos registros tipados:
  DS-01 y SFX-02. `/__qa_approved__/` permite solo manifiesto saneado y nueve
  nombres originales exactos en la carpeta ignorada `.local-sfx02-audio/`.
  Hash/tamaño, rutas reales, archivos regulares, no symlinks/junctions/traversal,
  red/origen privado, no-store/CORP/nosniff y bloqueo de acceso estático directo
  conservados. El manifiesto privado generado no sobrescribió archivos existentes.
- `sfx02/loadDev.ts` verifica otra vez los bytes y los decodifica; comparte el
  contexto/buses del motor existente. Para las músicas conserva el MP3 intacto
  en Blob URL y no retiene un AudioBuffer largo. Una carga local de nueve archivos
  más manifiesto; no red de terceros ni selector obligatorio.
- `sfx02/policy.ts` es el despachador semántico M1/V1. Home/LobbySection pasan
  intención open/back; el retorno a lobby tiene V1 y no suma M1. El modo oficial
  sustituye TIKI/TOOT por A1/X3. POP01/selección de maquetas no se usan por defecto;
  el timeout anterior se conserva separado. Los botones de maquetas están bajo
  modo laboratorio explícito y mantienen sus variantes originales.
- El gestor musical existente controla dos regiones con instancias estables:
  pausa la anterior antes de reanudar la nueva, conserva posición, loop, mute,
  volumen y manejo de promesas/autoplay/visibilidad. Feedback y previews atenúan
  música; nuevos efectos prioritarios sustituyen colas anteriores. Un solo preview
  W1/D2 a la vez. No se inventa un resultado competitivo para práctica.
- `useClockAudio.ts` usa RAF y el deadline existente, sin cronómetro de negocio
  nuevo: slots absolutos 2000/1000/650/350 ms. No recupera tics perdidos ni cambia
  playbackRate. Se reproduce un segmento de 140 ms del primer tic audible del
  original CLK (inicio observado 0,059625 s), sin editar los bytes, para evitar
  superponer clips completos de 2,064 s. Detención al responder/terminar/salir/
  ocultar. Volumen y mute del reloj independientes de SFX y músicas.
- Cargador, decodificador de archivos privados, endpoint, panel y previews QA se
  excluyen mediante DEV y guard de build. No se amplía la allowlist de hashes
  publicables para estos recursos. Producción no contiene los nuevos MP3 ni
  TimGM6mb/derivados. El servidor Vite se reinició realmente en 5173 cuando se
  detectó que el proceso anterior se había detenido.

## Verificación

TypeScript, **80 tests / 0 fallos**, build y guard pre/post PASS. Tests de política
M1/V1, cadencia por slots, sustitución A1/X3, independencia del reloj y ausencia
de victoria/derrota implícita. Se conservan los tests existentes de partida/20 s.

`node scripts/audio/sfx02-qa.mjs`: Chrome automatizado, 1366×900, 390×844 y 320×740.
Nueve originales decodificados; M1/V1 excluyentes, Colección y misma pantalla,
A1/X3 sin DS simultáneo, músicas mutuamente excluyentes, continuidad/ducking,
volúmenes y silencio persistidos, previews sin cambio de puntuación, sin errores
JS ni overflow. Escritorio: diez preguntas y timeout real 20 s, reloj progresivo
sin pitch ni tics después de resolver; móvil emulado: dos preguntas por tamaño.
Las pruebas de ocultación y modo laboratorio se registran en la salida del mismo
script. Capturas/metadata locales en `artifacts/sfx02-qa/`.

La reproducción se comprueba mediante decodificación, fuentes reales iniciadas y
estado de los reproductores; **no equivale a escucha humana o teléfono físico**.
Quedan pendientes revisión auditiva del Director, Safari/iOS, físico, certificado
C si se obtiene y revisión de empaquetado/distribución antes de publicar. Sin merge,
Render nuevo, B04 ni alteraciones del banco, puntuación, temporizador o arte.
