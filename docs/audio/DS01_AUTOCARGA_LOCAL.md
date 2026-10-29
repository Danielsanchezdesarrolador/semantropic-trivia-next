# DS-01 — integración jugable inmediata sin selector

29-10-2026. Orden del Director posterior a HF3, sobre `feat/audio-ds01-qa` / PR #17.
**Solo preview local: reproducción en Arena, sin autorización de redistribución.**

## Probar ahora

1. Abrir **http://localhost:5173/** y pulsar Inicio u otro botón normal. La música
   oficial y los efectos se habilitan con el gesto si el navegador lo requiere.
   Si se había elegido silencio, usar los controles compactos para reactivarlos.
2. Entrar a **Arena del Conocimiento** y responder. Selección y acierto/error
   suenan dentro de la partida, separados 120 ms; esperar 20 s produce un timeout.
3. Salir/regresar o reiniciar. No hay que seleccionar archivos otra vez. El panel
   **DS-01 · PREVIEW / QA local** permanece plegado y solo sirve para comparar
   variantes A/B/C y revisar estado/hashes; A continúa provisional.

Reinicio: `npm.cmd run dev`. El servidor previo sigue en 5173; el intento de
iniciar otra instancia con `--strictPort` confirmó puerto ocupado y no abrió otra.
Wi-Fi: http://192.168.1.8:5173/ (no se declara teléfono físico probado).

## Archivos recibidos y conservación

Se comprobó que `.local-ds01-audio/` no existía inicialmente. Había muestras
sueltas en la raíz y el archivo no versionado `MANIFIESTO_SHA256.json` seguía siendo
un MP3 con nombre equivocado. No se sobrescribieron, movieron ni borraron.

Se encontró **SEMANTROPIC_TRIVIA_DS01_VSCODE_INTEGRACION_LOCAL.zip** en Descargas.
Se copiaron únicamente sus 13 MP3 y el manifiesto JSON correcto a la carpeta
`.local-ds01-audio/`, ya ignorada por Git. La extracción usó allowlist de rutas y
no sobrescribió destinos existentes. No hubo descargas, regeneración o recodificación.
Los 13 SHA-256 y tamaños coinciden con el manifiesto entregado y con
[DS01_MANIFIESTO_QA.json](DS01_MANIFIESTO_QA.json), previamente versionado sin binarios.

## Endpoint privado exclusivo de Vite dev

`scripts/audio/ds01-dev-middleware.mjs` se registra con `apply: serve` y
`configureServer`, nunca con preview/build. Rutas:

- `/__qa_ds01__/manifest.json`: metadatos saneados de los 13 originales, solo si
  el manifiesto privado coincide con los hashes y tamaños aprobados.
- `/__qa_ds01__/<NOMBRE_EXACTO.mp3>`: únicamente los 13 nombres del catálogo;
  comprueba tamaño y SHA-256 antes de responder.

No listados, subdirectorios, WAV, reels, soundfont u otros archivos. Solo GET/HEAD,
conexión y Host de localhost/IPv4 privada autorizada; se rechaza origen diferente
y `Sec-Fetch-Site: cross-site`. Sin CORS abierto, con no-store, nosniff y CORP
same-origin. Se rechazan traversal y symlinks/junctions, se comprueban rutas reales
y archivo regular y se verifica identidad del handle abierto antes de leer.

Vite niega además accesos estáticos directos a `.local-ds01-audio`, muestras
sueltas y al manifiesto privado, incluso por `/@fs`. No se agrega la carpeta a
`public/`, a imports de assets o a una biblioteca de descargas.

## Cargador y controles

`autoLoadDev.ts` se importa dinámicamente solo en dev. Una promesa compartida por
página/HMR evita cargas duplicadas; el motor se conserva en `import.meta.hot.data`.
Son 14 GET locales por página: manifiesto + 13 muestras. No peticiones a terceros,
uploads, localStorage de audio, IndexedDB ni caché persistente de muestras.

El cliente compara el manifiesto con la referencia aprobada y calcula SHA-256 de
los bytes recibidos antes de decodificar. `sha256.ts` permite validar también HTTP
de LAN sin WebCrypto; pruebas comparan el resultado con Node en vectores, límites
de bloques y un millón de bytes. El manifiesto visual conserva los hashes verificados.
Faltantes o corrupción se muestran con nombre/estado; el resto del juego funciona.

La importación no reproduce. Un listener de gestos válidos solo desbloquea el
contexto; no dispara SFX indiscriminadamente. Los controles explícitos manejan su
propio gesto. Los handlers/observer de los cinco eventos siguen determinando qué
suena; no cambian reglas, reloj o preguntas. Mute y volumen son independientes de
la música y se conservan defensivamente como preferencias. Confirmación de
AudioContext running antes de informar activo; los rechazos permiten reintentar.

| Familia | Uso vigente |
|---|---|
| POP01_BOTON A/B/C | Acción real de botón/navegación, **excepto Colección** |
| POP02_SELECCION A/B | Una alternativa válida registrada, sin duplicados |
| TIKI01_ACIERTO A/B/C | Un acierto confirmado |
| TOOT01_ERROR A/B/C | Un error confirmado; nunca trombón de derrota Pixabay |
| POP03_TIEMPO A/B | Un agotamiento real de 20 s; no ticks |

La música de HF3 no se modifica: archivo, bytes, loop, primer gesto, continuidad
entre menús y pausa/retorno de Arena conservados. Colección no tiene clic/entrada,
pero la música continúa allí. Se preservan 42 SVG, arte y toda lógica local.

## Build, pruebas y límites

`guard-ds01.mjs --sources` revisa fuentes versionadas/public/src antes de compilar;
el guard completo revisa también el `dist` recién generado después. Esta separación
evita evaluar una build antigua como si fuera la nueva. Se bloquean binarios no
permitidos, comprimidos, contenido audio renombrado, soundfont, endpoint/cargador,
panel y decodificador privado DS-01 en JS de producción. La URL automática de
música HF3 también sigue bloqueada fuera de dev. No se incluyen muestras GPL.

Verificación: TypeScript PASS, **77 tests PASS / 0 FAIL**, build y ambos guards
PASS. Pruebas de middleware: allowlist, red/origen, traversal, manifiesto corrupto,
muestra faltante/hash distinto y symlink/junction PASS. Ninguna dependencia nueva.

Chrome automatizado a 1366×900, 390×844, 844×390 y 320×740: 13 variantes cargadas
y reproducidas, cero sonido durante importación, sin selector, una carga por
página, primer gesto, 120 ms selección/resultado y cero duplicados. Escritorio:
diez preguntas, timeout real 20 s, reinicio y retorno. Móvil emulado: dos preguntas
por resolución. Ausencia de muestra específica: 12/13 con nombre de error y juego
funcional. HF3 y smoke oficial también pasan; no hay prueba auditiva humana o
dispositivo físico. Capturas en `artifacts/ds01-auto-qa/`.
Entrada directa a Arena y control explícito PASS; un AudioContext y reentrada del
cargador sin peticiones duplicadas PASS. Verificación cliente sin WebCrypto
(HTTP/LAN simulado) y denegación real de rutas estáticas directas PASS.

La fuente sigue siendo **TimGM6mb.sf2 / GPL-2, interpretada con MIDI/FluidSynth**,
no Foley humano, CC0 o Pixabay. La GPL no prohíbe por sí misma uso comercial;
siguen pendientes términos de derivados y plan de cumplimiento de distribución.
La preview local autorizada no se bloquea por esa revisión. No fusionar/publicar
MP3/WAV/soundfont en GitHub, releases, PWA o Render. Si se solicita publicación
posterior, revisar avisos, fuente/forma editable y alcance en el juego web antes
de decidir; no sustituir variantes por otra fuente sin aprobación.

No hay nuevo despliegue ni merge. Permanecen pendientes escucha del Director,
variantes definitivas, iOS/Safari, teléfono físico, derechos musicales de publicación
y evaluación de redistribución DS-01. No iniciar B04 u otro bloque.
