# B03-C3-HF1 — Arco circular continuo

29-10-2026. **B03-C3-HF1 aprobado por el Director para continuar en B03-C4**.
Se conserva la rama y todos los cambios pendientes de B03-C1/C2/C3.
Sin commit, push, PR, merge ni despliegue. En HF1 no se modificó AGENTS.md;
B03-C4 autoriza incorporar la regla de entregas. Cierre: `../B03_C4_CIERRE_LOCAL.md`.

## Corrección

Los SVG originales contienen arcos fijos (normal/alerta/urgente); intercambiarlos
no representa una reducción continua. La vista jugable conserva el SVG normal
como base y superpone un círculo dinámico en sus coordenadas originales:
viewBox 320×320, centro (160,150), radio 115 y trazo 24. Una pista oscura cubre
solo el arco estático; se conservan marco, esfera, sombra y dimensiones.
El laboratorio sigue utilizando los tres SVG originales sin cambios.

`TimerArc.tsx` aplica stroke-dashoffset normalizado a 100 mediante un único
requestAnimationFrame. Calcula la fracción desde el plazo real, sin redondear a
segundos. El componente escribe solo los atributos del arco por fotograma;
no hace renderizar toda la Arena a 60 fps. El número central conserva enteros.
Color interpolado entre los tonos oficiales #12CAFF → #FFD144 → #FF496D,
sin intercambiar assets ni usar transiciones CSS que arrastren un estado anterior.

`timerArcMath.ts` contiene la fórmula pura y la interpolación. `localClock.ts`
centraliza la misma referencia temporal ya usada por el motor y la animación.
El motor temporal y la duración de 20 segundos permanecen intactos.

Al responder, el arco se dibuja con los milisegundos congelados por el motor y
se cancela RAF. Al comenzar otra pregunta, el nuevo plazo se dibuja antes de
pintar, sin animación residual. A cero el trazo tiene opacidad cero: tampoco
queda el punto de los extremos redondeados. El marco decorativo original sigue
visible. RAF no decide agotamientos ni puntuación.

Se cancela el fotograma anterior al reanudar/focalizar y al ocultar la pestaña;
se eliminan callbacks/listeners al resolver o desmontar. Al volver se calcula
desde el plazo original, sin regalar tiempo. Nunca hay más de un RAF pendiente.

## Archivos de este microcorrectivo

- Nuevos: `src/ui/quiz/TimerArc.tsx`, `timerArcMath.ts`, `localClock.ts`.
- Integración: `useLocalPractice.ts`, `QuizPreview.tsx`, `quiz-preview.css`.
- Pruebas: `tests/b03-c3-hf1-timer-arc.test.mjs`, nuevo helper
  `scripts/b03-c3-hf1-arc-qa.mjs` y actualización de `b03-c3-browser-smoke.mjs`.
- Documentación: roadmap, decisiones y este registro.

No se modifican los 42 SVG, motor, categorías, preguntas, lobby ni navegación.

## Evidencia

- Base previa: TypeScript y 63 tests PASS.
- Resultado: `npm run check`, **65 tests** y `npm run build` PASS.
- Dos tests nuevos: porcentajes exactos 20/15/10/5/0 s, cálculo subsegundo y
  continuidad de color en 2000 muestras separadas por 10 ms.
- Chrome headless/Playwright: 1366×900, 390×844, 320×740 y 844×390.
  Comprobados 100/75/50/25/0 %, variaciones dentro del mismo segundo, congelación,
  reinicio, transparencia total al cero y solo un agotamiento por pregunta.
  Instrumentación RAF: máximo un callback pendiente; cero tras responder,
  ocultar, agotar o salir. Reanudación con salto temporal sin callbacks.
- Regresión B03-C3 completa: diez aciertos, errores, teclado, resultados,
  reinicio y lobby en los cuatro tamaños. B03-C2 y laboratorio HF2: PC/390/320 PASS.
- Capturas: `artifacts/b03-c3/*-hf1-*porciento.png`.
- Vite reiniciado en 5173 para limpiar una referencia en caché tras renombrar un
  módulo que colisionaba por mayúsculas en Windows; no fue un problema del build.

Comandos de navegador:

```powershell
$env:ST_BROWSER_CHANNEL='chrome'
node scripts/b03-c3-browser-smoke.mjs
node scripts/b02-home-official-smoke.mjs
node scripts/b03-b02-browser-smoke.mjs
```

## Entrega y límites

Vite: `http://localhost:5173/#arena`; Wi-Fi del PC:
`http://192.168.1.8:5173/#arena`. Reiniciar con `npm.cmd run dev` si se detiene;
usar el puerto anunciado por Vite. Sin Render ni producción modificados.

La fluidez efectiva depende de la frecuencia de pantalla/carga del navegador.
La pérdida de fotogramas no cambia el tiempo concedido: manda el plazo real.
Pruebas móviles emuladas; no se ha comprobado un teléfono físico ni Safari.
La aprobación para continuar consta en D-030; C4 requiere revisión del cierre
y autorización específica para las operaciones Git de integración.
