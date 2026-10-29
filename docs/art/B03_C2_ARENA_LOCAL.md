# B03-C2 — Arena jugable de práctica local

Fecha: 29-10-2026. **B03-C2 aprobado por el Director; ratificado para continuar en B03-C4.** Integración/publicación pendientes. Este documento registra la entrega C2; el estado actual incluye C3 y HF1, descritos en `../B03_C4_CIERRE_LOCAL.md`.
Rama conservada: `feat/b03-c1-nucleo-local`, base `3aa8f037`.
Sin commit, PR ni despliegue. No se ha verificado Render en este bloque.

## Alcance y protección artística

`QuizPreview official` conecta el motor B03-C1: diez preguntas, respuesta única,
feedback correcto/incorrecto con SVG originales, avance explícito, diez segmentos
de progreso y resumen básico debajo de la Arena. Reiniciar crea una ronda nueva.
La última pregunta y su feedback permanecen visibles al finalizar.

Cada pregunta determina su categoría, fondo PC/móvil, colores, icono y barra.
Se conservan los 42 SVG y todas las reglas geométricas existentes. El CSS añadido
normaliza los botones nativos para que mantengan las tarjetas originales.
El lobby, HomePreview y su navegación no se modifican.

`b03-preview.html` conserva su demostración independiente con seis selectores,
cuatro estados y tres apariencias de reloj. Se añade únicamente el enlace al
favicon PNG existente: Chrome solicitaba `/favicon.ico` y recibía 404.

En la entrega histórica C2, la ronda decía «Práctica local» y «Sin límite de tiempo». El espacio y
asset del reloj permanecen, con ∞; ningún cronómetro está activo. No se desarrolla
B03-C3 en aquel bloque. **Estado actual:** reloj real de 20 s y arco continuo añadidos por C3/HF1, sin selector manual durante la partida. Los ejemplos largos se acortan sin cambiar soluciones para caber en el
panel aprobado a 320 px; siguen pendientes de revisión editorial.

## QA reproducible

Fase 0 antes de editar: TypeScript y 53 tests aprobados (44 previos + 9 B03-C1).
Verificación final: `npm run check`, `npm test`, `npm run build`.

QA navegador con Playwright 1.56.1 instalado sin guardar en package.json ni crear
lockfile; Chrome instalado, headless (motor Chromium). En PowerShell:

```powershell
$env:ST_BROWSER_CHANNEL='chrome'
node scripts/b02-home-official-smoke.mjs
node scripts/b03-b02-browser-smoke.mjs
```

Los scripts recorren 1366 px de escritorio y 390/320 px móviles emulados.
El primero verifica lobby, ronda completa con las seis categorías automáticas,
fondos PC/móvil, iconos, barras, color, texto dentro del papel pintado del SVG,
feedback, bloqueo de eventos duplicados, diez respuestas, resultado 6 aciertos /
4 errores / 6 puntos, reinicio, recarga, regreso e historial. También comprueba
ausencia de scroll horizontal, errores JS y controles QA en la partida.
El segundo verifica laboratorio, geometría HF2 y sus controles visuales.
Capturas locales: `artifacts/b02-official/` y `artifacts/b03-b02/`.

## Limitaciones

No hay persistencia: salir o recargar reinicia la práctica. Un punto por acierto
es provisional y exclusivamente local. Las soluciones del cliente nunca deben
reutilizarse como validación competitiva. No hay backend, usuarios, bots, ranked
ni participantes online. Android/iOS físicos y Safari real no se han probado.
La aprobación para continuar consta en D-030; cierre/publicación y QA físico siguen pendientes.
