# SEMANTROPIC TRIVIA 1.0 — Publicación oficial del lobby visual B02
Fecha: 2026-10-28 · Autoridad: Director del juego.

## Mandato
El Director revisó la actualización de laboratorio B02 con fondo completo, logotipo de mayor resolución y botones nítidos, respondió "me gusta aprobado" y pidió "dejar en la pantalla oficial". Se autoriza reemplazar el tablero técnico B01 en la URL principal existente, sin crear nuevas funcionalidades.

## Implementación
- `src/App.tsx` monta `HomePreview official showLibrary={false}`, reutilizando exactamente las capas, assets y controles de la versión visual aprobada.
- `src/main.tsx` no importa los estilos B01 para evitar interferencias con el lobby.
- `index.html` identifica el producto 1.0 y no afirma que existan partidas operativas.
- En la portada se sustituyen rótulos técnicos del laboratorio por un aviso de modos en desarrollo y se oculta la biblioteca de 23 recortes y nueve colores. Esa galería se conserva en la entrada de QA `/b02-preview.html`.
- Fondo oficial `environment/home-main` WebP y logotipo oficial PNG con alfa permanecen independientes. Botones Jugar Online y Jugar con Amigos son DOM/React, con iconos SVG y texto nítido; **ambos deshabilitados**.
- No habilitar Torneo CPU, ranked independiente, inventario, economía, tienda, matchmaking, usuarios ni perfiles simulados.
- Los personajes ilustrativos y otras piezas de lámina siguen sujetos a perfeccionamiento individual aunque el conjunto del lobby haya sido aprobado como pantalla.

## Evidencias requeridas antes de afirmar 'publicado'
1. CI `npm run check`, `npm test`, `npm run build` y Playwright en escritorio 1366×850 y emulaciones 390×844, 320×740.
2. Servir `dist/index.html` generado (no el `b02-preview.html`) y comprobar la home, botones deshabilitados, 2 imágenes aprobadas, cero consola JS / overflow, galería ausente.
3. Fusionar PR contra `main` solo tras CI PASS, sin modificar Render LAB ni repositorios anteriores.
4. Comprobar que Render principal `semantropic-trivia-next-web` esté LIVE sobre el SHA integrado en `main`.
5. Ejecutar smoke HTTPS real sobre la URL oficial y distinguir móviles emulados de teléfono físico.

## Rollback
Version B01 histórica antes de B02: commit `963ec14be014dac701f9c2761bd3ea016eda63e8`. Para revertir, usar GitHub PR de reversión y desplegar tras CI; nunca forzar refs ni borrar el historial.
