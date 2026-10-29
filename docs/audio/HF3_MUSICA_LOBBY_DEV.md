# B03-C5 / HF3 — música integrada automáticamente en desarrollo

29-10-2026. Director confirma ejecutar HF3 sobre `feat/audio-ds01-qa` / PR #17.
**Local listo; asignación pública bloqueada por derechos pendientes.**

## Resultado y uso inmediato

1. Abrir **http://localhost:5173/**. No cargar archivos ni abrir un panel QA musical.
2. Pulsar **Inicio** o cualquier menú normal si el navegador bloquea autoplay.
   La primera navegación inicia la música; el control compacto permite activarla
   explícitamente si la política del navegador exige otro intento.
3. Navegar entre menús y probar Arena: música continua en el lobby, pausa en Arena
   y reanudación desde la posición conservada al regresar. **Silenciar música** y
   el volumen permanecen disponibles; silencio/volumen elegidos se conservan al recargar.

Servidor Vite existente confirmado en 5173. Se lanzó `npm.cmd run dev` y detectó
el puerto ocupado; se cerró esa segunda instancia (5174) y se comprobó el servidor
original 5173 mediante HTTP y Chrome. Reinicio: `npm.cmd run dev`, confirmar puerto.
Wi-Fi anunciado por el servidor: http://192.168.1.8:5173/; no probado en teléfono físico.

## Archivo y límites de derechos

URL local de dev: `/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3`.
Archivo existente: `public/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3`.
Es idéntico al original artístico **18_lobby_pop_familiar.mp3**, no una sustitución:
SHA-256 **e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707**,
comprobado en disco y en los bytes efectivamente servidos por Vite.
No se regenera, recodifica, renombra ni modifica ningún MP3.

No existe `docs/audio/18_lobby_pop_familiar_DERECHOS.md`. Continúa pendiente la
evidencia de titularidad/licencia y permiso suficiente de incorporación y
distribución web comercial de la composición/máster, descrita en
[HF1/HF2](HF1_HF2_COLECCION_MUSICA.md). HF3 autoriza expresamente conexión local,
no resuelve esos derechos ni autoriza una nueva asignación comercial en Render.
No se crea ni firma una declaración por el Director.

La URL automática solo existe tras `import.meta.env.DEV`; se elimina de JS de
producción. El guard de build falla si esa asignación aparece en `dist`.
El MP3 que ya estaba en public/ sigue intacto en la build previa: HF3 no añade
otro archivo ni publica una asignación nueva. DS-01, soundfont y los importadores
privados continúan fuera de dist/public/Git/releases. No se modifica DS-01.

## Archivos y comportamiento

- `lobbyMusic.ts`: prepara automáticamente el asset solo en dev, precarga `auto`,
  intenta play sin evadir autoplay y conserva intención de reproducción ante un
  rechazo. La interacción de navegación reintenta directamente dentro del gesto.
  Persiste volumen y enabled defensivamente; respeta enabled=false al recargar
  sin intentar autoplay. Un único HTMLAudioElement, loop y velocidad originales.
- `LobbyMusicControl.tsx`: retira el selector/fila de QA musical del lobby; botón
  y slider compactos con nombres accesibles. `aria-pressed` refleja reproducción,
  no un intento fallido. Hook estable durante navegación, limpieza diferida a
  microtarea para reutilizar la instancia durante el remount de StrictMode;
  desmontaje real libera audio/URL/listeners.
- `lobby-music.css`: estilo acotado a controles musicales de la cabecera.
- `HomePreview.tsx`: llamada puntual de interacción en el handler ya existente.
  HF1 permanece: destino Colección no produce POP01 ni Cartoon 6.
- `guard-ds01.mjs`: además del guard existente, bloquea URL automática dev en
  JavaScript de producción. `hf1-hf2-qa.mjs` conserva compatibilidad invocando el
  QA HF3 vigente, que ya no depende de importar música manualmente.

No se cambia Arena, 42 SVG, motor local, temporizador, preguntas, puntuación,
identidad visual, música de partida ni los cinco eventos DS-01.

## Evidencia

- `npm.cmd run check`: PASS. `npm.cmd test`: **74 PASS / 0 FAIL**.
- `npm.cmd run build`: PASS, guard anterior/posterior PASS. Build sin asignación
  musical automática, sin panel musical de carga, DS-01, soundfont o reels.
- `node scripts/audio/hf3-qa.mjs`: Chrome automatizado PASS a 1366×900, 390×844,
  844×390 y 320×740. Asset servido con hash exacto; precarga sin selector; un
  reproductor incluso bajo StrictMode; simulación determinista de autoplay
  bloqueado, inicio por primera navegación normal, Colección sin SFX, continuidad,
  Arena/retorno, volumen, silencio persistido/recarga, visibilidad y loop. También
  caso adicional con política nativa Chrome sin el gate de prueba: PASS.
- Tests unitarios de preparación única, rechazo y reintento por gesto, continuidad,
  ruta Arena, silencio persistido y guard de producción: PASS.
- Smoke de build oficial en Chrome: escritorio y móvil emulado 1366/390/320,
  diez preguntas, categorías, navegación, resultado 6/10 y reinicio: PASS.
- Capturas locales: `artifacts/hf3-qa/` y `artifacts/b02-official/`. Sin overflow ni
  errores JS en los casos automatizados. No es escucha humana ni prueba física.

Pendientes: escucha del Director, iOS/Safari y móvil físico; evidencia de derechos
y autorización específica antes de habilitar la asignación en Render. Sin merge
ni nuevo despliegue público en HF3. Terminar aquí; no iniciar B04 u otro bloque.
