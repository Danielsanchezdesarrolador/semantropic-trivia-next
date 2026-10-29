# B03-C3 — Cronómetro real y cierre de práctica local

29-10-2026. **B03-C3 y HF1 aprobados por el Director para continuar en B03-C4**;
sin commit, PR ni publicación. QA final y propuesta en `../B03_C4_CIERRE_LOCAL.md`.
Se conserva `feat/b03-c1-nucleo-local` y el trabajo pendiente previo sobre `3aa8f037`.

## Comportamiento

- `LOCAL_QUESTION_DURATION_MS` en `src/game/local/timedRound.ts`: **20 000 ms**,
  provisional y pendiente de balance. El motor temporal recibe timestamps para
  pruebas deterministas y mantiene un plazo fijo por pregunta.
- El hook `useLocalPractice` calcula con tiempo de pared y referencia monotónica.
  El intervalo de 100 ms refresca la vista; no cuenta ticks para decidir el plazo.
  También sincroniza en visibilitychange, focus y pageshow; elimina intervalo y
  listeners al contestar, finalizar o desmontar. Volver a la pestaña no reinicia
  el plazo; responder verifica el tiempo aunque no haya llegado el último tick.
- Contestar detiene el reloj y bloquea las cuatro alternativas. Agotar registra
  `alternativeId: null`, cero puntos y un error, sin inventar una respuesta.
  No hay avance automático: feedback legible y botón Siguiente pregunta.
- El reloj existente muestra segundos y, tras HF1, arco progresivo con color
  interpolado entre los tonos originales. La versión C3 previa a HF1 alternaba
  normal/alerta/urgente por umbrales; ese comportamiento se sustituyó por el arco
  continuo aprobado. Los aciertos y errores usan
  los SVG originales; un error o agotamiento identifica la alternativa correcta.
- Al resolver diez preguntas, el área inferior existente muestra resultados:
  completadas (siempre diez), respondidas mediante elección, agotadas, aciertos,
  errores totales y puntuación. Un punto por acierto. Volver a jugar inicia una
  ronda limpia; Volver al inicio regresa al lobby. La última pregunta permanece
  visible con feedback. La presentación de resultados es conservadora y está aprobada para continuar.
- Foco accesible al enunciado, al avance tras responder y a los resultados al
  finalizar. Sin animaciones ornamentales; HF1 anima únicamente el arco temporal. Categorías automáticas B03-C2 preservadas.
- Ningún SVG, tema, composición geométrica ni diseño del lobby se modifica.
  Se enlaza el favicon PNG existente en index.html para evitar un 404 de Chrome
  al abrir directamente #arena, sin alterar la interfaz.

## Verificación ejecutada

Antes de editar: `npm run check` y 53 tests PASS. Después: TypeScript, **63 tests**
(53 anteriores + 10 temporales) y build Vite PASS.

Los tests nuevos cubren duración/configuración, cálculo sin ticks, retroceso de
timestamps, agotamiento exacto, inactividad prolongada, respuesta antes/en/después
del límite, congelación por respuesta, duplicados y eventos tardíos, avance,
diez aciertos, diez errores, diez agotamientos, ronda mixta, resultado y reinicio.

Chrome headless (Chromium), Playwright 1.56.1 local sin cambios de dependencias
declaradas ni lockfile:

```powershell
$env:ST_BROWSER_CHANNEL='chrome'
node scripts/b03-c3-browser-smoke.mjs
node scripts/b02-home-official-smoke.mjs
node scripts/b03-b02-browser-smoke.mjs
```

- QA B03-C3: 1366×900, 390×844, 320×740 y móvil horizontal 844×390. Reloj de
  navegador controlado para probar diez aciertos, pausa por respuesta, color de
  reloj, agotamiento, reanudación sin ticks, envío después de plazo, teclado,
  duplicados, resultados 10/10 y 0/10, reinicio, desmontaje, regreso y no overflow.
- Regresión B03-C2: 1366/390/320, ronda mixta 6/10, seis temas automáticos,
  carga de assets, geometría de panel, progreso, navegación y ausencia de errores.
- Laboratorio B03-B02: PC/390/320, geometría HF2 y controles visuales PASS.
- Vite en puerto 5173: prueba adicional con tiempo **real**, sin reloj simulado:
  cuenta regresiva, agotamiento tras 20 s, bloqueo, avance y categoría Ciencias.
  HTTP local y dirección Wi-Fi 192.168.1.8:5173 comprobados desde el PC.

Capturas: `artifacts/b03-c3/`, `artifacts/b02-official/`, `artifacts/b03-b02/`.
Se revisaron visualmente los resultados a 320 px. No se han probado teléfono
físico, Safari ni suspensión real del sistema operativo; la inactividad se cubre
con tiempo y eventos controlados, y lógica pura con timestamps inyectados.

## Entrega local y límites

`npm.cmd run dev` (PowerShell) inicia Vite; usar el puerto que anuncie si 5173
estuviera ocupado. Ruta jugable `/#arena`. URL verificada en esta entrega:
`http://localhost:5173/#arena`; misma Wi-Fi `http://192.168.1.8:5173/#arena`.
El acceso desde un teléfono puede depender del firewall del PC; no fue probado.

La ronda vive en memoria: salir o recargar la reinicia. El reloj local no protege
contra manipulación del cliente ni sirve para partidas competitivas. Duración,
preguntas de ejemplo y presentación de resultados requieren revisión/balance.
No se ha consultado ni actualizado Render. B04 y multijugador no iniciados.
En C3 no se modificó AGENTS.md; B03-C4 autoriza incorporar la regla permanente
de entrega jugable. Los resultados de 63 tests anteriores son el registro de C3;
la suite vigente tras HF1 contiene 65 tests.
