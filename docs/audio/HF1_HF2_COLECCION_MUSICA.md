# B03-C5 / HF1 + HF2 — cierre sobre DS-01

29-10-2026. El Director confirmó expresamente aplicar ambos correctivos al trabajo
DS-01 actual. Rama conservada: `feat/audio-ds01-qa`; no reinicio ni descarte de cambios.

## Estado

- **HF1 REAL:** Colección conserva UI/navegación/foco, sin POP01 de botón ni Cartoon 6
  de entrada, incluso con DS-01 activado. No cambia el volumen/mute de música o juego.
- **HF2 REAL PARA QA LOCAL / PUBLICACIÓN BLOQUEADA:** reproductor y controles listos,
  reproducción comprobada del original exacto mediante File API local. No se activa
  una URL musical pública ni se añade otro MP3 al repositorio o build.

## Archivo exacto y derechos pendientes

Se buscó la pista en el repositorio y en Descargas. Existe físicamente:
`C:/Users/Daniel/Downloads/18_lobby_pop_familiar.mp3` (371.170 bytes).
SHA-256: `e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707`.
La copia «18_lobby_pop_familiar (1).mp3» y el recurso ya versionado
`public/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3` tienen los
mismos bytes. Se conserva cada original sin renombrar, sustituir o regenerar.

La receta existente `scripts/audio/generate_approved_lobby.py` documenta síntesis
matemática con numpy/scipy/soundfile y codificación FFmpeg. No es TimGM6mb ni la
música Bombinsound. Esta procedencia y la coincidencia de bytes son verificables;
no se halló una declaración explícita de titularidad/licencia que resuelva el uso
y distribución web comercial exigidos por HF2. No se inventan permisos a partir
de la aprobación artística ni del hecho de que el MP3 ya estuviera en GitHub.

Falta documentación en **docs/audio/18_lobby_pop_familiar_DERECHOS.md**, que el
Director/titular puede aportar con autoría, origen, derechos sobre composición y
máster, herramientas/fuentes utilizadas y permiso de incorporación/distribución
web comercial, GitHub/Render y plataformas previstas. No es una declaración que
Codex pueda firmar por el titular. La nueva asignación pública permanece bloqueada
hasta evidencia suficiente y autorización específica; no se elimina el asset previo
aprobado ni se finge un despliegue nuevo.

Para QA el único archivo aceptado se llama exactamente `18_lobby_pop_familiar.mp3`
y debe coincidir con el SHA-256. Se carga manualmente, se reproduce como objeto
local y se revoca la URL al liberar recursos. No se envía a servidores ni se guarda
en localStorage. No se usan placeholders, MIDI, tonos, descargas o pistas alternas.

## Arquitectura y handlers

- `HomePreview.tsx`: handler puntual de navegación omite POP01 si destino es
  collection y mantiene navegación normal; avisa al reproductor al entrar a Arena.
- `cartoonPolicy.ts` / `cartoonAudio.ts`: Colección deja de ser un evento activo
  de Cartoon 6. Los tres originales Pixabay quedan reservados, sin roles nuevos
  ni MP3 privados importados al bundle por este correctivo.
- `lobbyMusic.ts`: singleton HTMLAudioElement; misma instancia y currentTime entre
  Inicio/Colección/Tienda/Amigos/Ranking y submenús. Pausa en Arena, visibilidad
  oculta y silencio; reanuda desde la posición anterior si el navegador lo permite.
  loop nativo, velocidad original y sin filtros/remezcla. Promesas invalidadas por
  cambios de estado no encienden una reproducción obsoleta.
- `LobbyMusicControl.tsx`: hook montado en HomePreview antes del retorno de Arena,
  estable entre menús, con limpieza de listeners/URL/audio al desmontar. Control
  Activar/Desactivar música y volumen independiente, inicial 25 %. Solo persiste
  volumen; silencio/consentimiento nunca se convierten en autoplay al recargar.
  Cargador local exclusivamente en Vite dev; producción no tiene archivo asignado
  al reproductor y muestra el control deshabilitado con motivo accesible en title.
- `guard-ds01.mjs`: verifica también ausencia del cargador privado musical en JS
  de producción. DS-01 sigue solo en memoria y fuera de dist/public/Git/releases.

## Cómo escuchar esta evaluación

1. Abrir **http://localhost:5173/**. Reinicio del servidor: `npm.cmd run dev`.
2. En cabecera, desplegar **Música · QA local**; seleccionar el original exacto
   de Descargas. Se exige localhost/HTTPS para verificar SHA-256 con WebCrypto.
3. Pulsar **Activar música** y ajustar **Volumen de música**. Visitar Colección,
   Inicio y otras secciones: continuidad musical sin efecto al entrar a Colección.
4. Cargar DS-01 como indica [su entrega](DS01_INTEGRACION_QA_LOCAL.md); su volumen
   y mute son independientes. Arena pausa música del lobby y conserva cinco eventos
   del juego; al volver se reanuda la música si seguía habilitada.

## QA y límites

`node scripts/audio/hf1-hf2-qa.mjs` usa el MP3 original externo y navegador Chrome
real ejecutado en headless. PASS en 1366×900, 390×844, 844×390 y 320×740:
archivo exacto verificado y decodificado, play resuelto, un único reproductor,
loop tras buscar el final, continuidad de currentTime, Colección sin SFX y otras
pestañas con POP01, Arena/retorno, ocultación simulada, silencio y volúmenes
independientes. Caso de rechazo de play PASS: sin falsa confirmación ni bloqueo UI.
Cero errores JS, requests externos o overflow detectados. Capturas locales en
`artifacts/hf1-hf2-qa/`. Esto no certifica escucha humana ni gaplessness perceptual.

La build conserva el MP3 previo del lobby, con hash aprobado, pero no lo asigna
al nuevo reproductor público. No contiene derivados DS-01, TimGM6mb, reels ni panel
de importación. El guard permite exclusivamente los hashes previamente aprobados,
no constituye permiso jurídico ni autorización de publicación. No hay nueva música
en dist introducida por HF2 y ya no se empaqueta el Cartoon 6 privado sin evento.

Pendientes: declaración de derechos, autorización específica de publicación de la
nueva asignación, escucha humana/manual PC, iOS/Safari y teléfono físico. PR para
revisión, **sin merge ni deploy Render** en esta entrega. Se preservan arte, 42 SVG,
preguntas, temporizador, resultados, accesibilidad y sistemas ajenos. B04 no se inicia.
