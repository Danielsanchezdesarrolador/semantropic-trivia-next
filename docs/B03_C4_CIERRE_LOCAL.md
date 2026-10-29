# B03-C4 — Cierre del núcleo local y preparación de integración

29-10-2026. Director: usuario. C1/C2/C3/HF1 **aprobados para continuar**.
C4 ejecuta consolidación, QA y preparación; commit, push y PR esperan autorización
específica. Sin merge ni despliegue. B04 no iniciado.

## Estado verificable

- Rama conservada: `feat/b03-c1-nucleo-local`.
- HEAD base: `3aa8f03726604c4d0c955b5353b046dd7ce58a1d`.
- No se crea una rama duplicada ni se sobrescribe trabajo de otros bloques.
- Cambios acumulados C1/C2/C3/HF1 y este cierre permanecen sin commit.
- HEAD y la referencia **local** origin/main coinciden. No se consultó el remoto
  en C4; no se afirma que esa referencia represente el estado remoto más reciente.
- Los 42 SVG se compararon por Git blob hash con HEAD: **idénticos byte a byte**.
  HomePreview, navegación, App, categoryThemes, quizAssets y package.json intactos.
- Capturas, logs y respaldo se conservan en artifacts/, ahora ignorado por Git
  para que no entren por accidente en el commit. No se elimina ningún archivo.
- Vite también excluye artifacts/ de su watcher: crear un ZIP bloqueado por
  Windows produjo EBUSY y cerró el servidor durante el respaldo. Se corrigió la
  configuración de desarrollo; no cambia la lógica ni la publicación del juego.

## Núcleo consolidado

Diez preguntas locales de orden fijo, cuatro alternativas y seis categorías:
Geografía 2, Ciencias 2, Historia 2, Arte y cultura 2, Deportes 1 y Entretenimiento 1.
Cada pregunta actualiza automáticamente fondo PC/móvil, paleta, barra e icono.
Selección única, solución y explicación, cero puntos por error/agotamiento,
un punto por acierto; diez resoluciones cierran la ronda. Reinicio y lobby funcionan.

El reloj dura 20 segundos por pregunta. El arco luminoso usa el plazo real con
RAF y longitud proporcional, no ticks/segundos redondeados ni fases de color.
Los colores originales se interpolan; al responder congela la fracción exacta,
al avanzar vuelve al 100 % y a cero no deja punto luminoso. Motor separado de la
animación, agotamiento único y limpieza al ocultar/desmontar. Laboratorio separado.

## QA de cierre ejecutado

| Comprobación | Resultado y alcance |
|---|---|
| TypeScript | PASS, npm run check |
| Suite Node | PASS, 65 tests: 44 existentes + 9 C1 + 10 C3 + 2 HF1 |
| Build Vite | PASS, entradas oficial y laboratorios |
| Ronda completa y seis temas | PASS, 1366/390/320, ronda mixta 6 aciertos/4 errores |
| Reloj, diez aciertos y agotamientos | PASS, 1366×900, 390×844, 320×740 y 844×390 |
| Mouse | PASS, Chrome escritorio automatizado |
| Teclado | PASS, Enter en respuesta/avance y foco, cuatro tamaños |
| Pantalla táctil | PASS emulado mediante tap; no equivale a hardware real |
| Arco proporcional y subsegundo | PASS, 100/75/50/25/0 %, RAF máximo uno, congelación y reinicio |
| Inactividad/reanudación | PASS con tiempo/eventos controlados; sin prueba de suspensión física |
| Lobby, historial, recarga y regreso | PASS, PC/390/320 |
| Laboratorio y geometría HF2 | PASS, PC/390/320 |
| SVG oficiales | PASS, 42 hashes Git iguales a HEAD |
| Cuenta regresiva sin simulación | PASS en Vite: capturas a 15/10/5/0 s, cero único, bloqueo y avance |
| Teléfonos físicos / Safari | NOT_RUN |
| CI remoto / Render del nuevo bloque | NOT_RUN; publicación no autorizada |

Comandos de reproducción:

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
$env:ST_BROWSER_CHANNEL='chrome'
node scripts/b02-home-official-smoke.mjs
node scripts/b03-c3-browser-smoke.mjs
node scripts/b03-b02-browser-smoke.mjs
# Con Vite ya iniciado en otra terminal:
node scripts/b03-c4-live-smoke.mjs
```

Chrome instalado y Playwright 1.56.1 local, sin modificar versiones declaradas ni
lockfile. En CI el workflow existente instala Playwright/Chromium; C4 prepara
pasos para el QA temporal y laboratorio además del lobby. Es configuración
preparada, todavía no un resultado de GitHub Actions.

Logs: artifacts/b03-c4/arena-qa.log, lobby-qa.log, lab-qa.log y real-clock.log.
Evidencia de assets: approved-svg-hashes.json. Capturas: artifacts/b03-c3/,
artifacts/b02-official/, artifacts/b03-b02/ y artifacts/b03-c4/reloj-real-*s.png.
Se inspeccionaron visualmente el reloj real y los resultados móviles a 320 px.

## Documentación y respaldo

AGENTS.md incorpora la entrega jugable obligatoria con Vite/URL comprobada,
reinicio, dirección Wi-Fi cuando sea viable, evidencia y aprobación del Director.
Roadmap y decisiones registran D-030. Se crea el registro del núcleo C1 y se
actualizan C2, C3 y HF1, distinguiendo comportamiento histórico de estado actual.
El documento artístico B03-B02 conserva el historial con una nota vigente.

Respaldo local preparado en artifacts/b03-c4/: snapshot de archivos rastreados
y nuevos archivos fuente/documentales, más manifiesto SHA-256 y parche de cambios
rastreados. Excluye .git, dependencias, build, secretos ignorados y capturas
generadas; estas permanecen en su ubicación original. El ZIP y sus hashes se
verifican tras crearlo. Es un respaldo local, no una copia en GitHub ni externa.

## Commit y PR propuestos — no ejecutados

Commit: `feat(b03): completar partida local de diez preguntas en Arena`

PR hacia main: **B03: partida local de diez preguntas, reloj continuo y resultados**.

Descripción preparada:

> La Arena oficial permite completar una práctica local de diez preguntas con
> cuatro alternativas, respuesta única, cambios automáticos entre seis categorías,
> reloj real de 20 segundos con arco continuo y resultados con reinicio/regreso.
> Conserva los 42 SVG, la composición aprobada y el lobby; el laboratorio visual
> mantiene sus controles independientes.
>
> Añade motor determinista separado de React, control de plazos y agotamiento,
> pruebas, QA reproducible y documentación de continuidad/entregas. Actualiza el
> workflow de PR para validar ronda y laboratorio y guardar capturas.
>
> Validación local: TypeScript, 65 tests, build, Chrome PC/móvil emulado en
> 1366/390/320 y horizontal 844 px, teclado/mouse/tap y cuenta regresiva real.
> Teléfonos físicos, Safari, CI remoto y Render pendientes. Solo práctica local:
> sin persistencia, backend, cuentas o clasificación. Duración y banco de ejemplo
> pendientes de balance/editorial comercial.

El alcance a integrar es src/game local, integración React/CSS, HTML de
favicon, scripts/tests, workflow/ignore, exclusión del watcher Vite y documentación. Se excluyen artifacts,
node_modules y dist. No se añade ningún SVG ni se modifica otro repositorio.
No se prepara una publicación automática: primero autorización de commit/push/PR,
luego revisión/CI; merge y deploy requerirán autorización aparte.

## Versión para el Director

Vite disponible en `http://localhost:5173/#arena` y Wi-Fi
`http://192.168.1.8:5173/#arena`, comprobado desde este PC. Si se detiene:
`npm.cmd run dev`; confirmar el puerto en su salida. El acceso desde teléfono
depende de la misma red/firewall y no se declara probado físicamente.

Persisten límites: salir o recargar descarta la ronda; reloj/respuestas son solo
locales y no deben validar competencia humana. Duración de 20 s y las diez
preguntas son base de prueba, no banco editorial comercial completo. Se necesita
QA real Android/iOS/Safari y completar las políticas exigidas antes de lanzamiento
público. No se declara B03 desplegado ni juego online terminado.
