# B02-NAV — Menús navegables de SEMANTROPIC TRIVIA 1.0
Fecha: 2026-10-28. Autorización del Director: antes de avanzar dejemos el juego jugable, me refiero a esto que al entrar ya se pueda apretar los botones.

## Alcance implementado
- Dos botones principales del lobby: Jugar Online y Jugar con Amigos, ahora clicables en la versión oficial.
- Sidebar: Inicio, Colección, Tienda, Amigos, Ranking, todos botones con navegación real y foco visible.
- Online: submenús **Normal 1v1** y **Clasificatoria 1v1**, con pantalla de detalles. Clasificatoria siempre exige humanos; IA opcional y declarada solo en normal casual futura.
- Amigos: submenús 1v1, 2v2, 3v3 y FFA, con pantalla de detalles.
- Volver al menú padre, Inicio en sidebar y retroceso/adelanto del navegador mediante fragmentos hash (#online, #friends, #online-ranked, etc.).
- Colección/Tienda/Ranking enseñan pantalla de estado real Próximamente sin cifras, usuarios o premios simulados.
- El laboratorio b02-preview.html permanece como referencia con controles no interactivos.
- Fondo y logotipo oficiales y figuras ilustrativas intactos.

## Límites obligatorios
**Esto NO es una partida jugable todavía.** Solo la navegación de menú está habilitada. B03 será la primera ronda de preguntas local, con resultados reales; B04 cuentas; B05/B06 partidas online.
No contactar backend, simular búsqueda rival, generar códigos de sala, crear economía o rankings ficticios. Los botones que conducen a páginas de detalle funcionan, pero allí se explica que esas modalidades aún no están disponibles.

## QA de aceptación
- npm run check, npm test, npm run build.
- Chromium desktop 1366×850, mobile 390×844 y 320×740: pulsar ambos botones, escoger opciones, usar Atrás, recargar hash de submenú, recorrer cinco iconos laterales, comprobar arte/background completo, sin galería, sin overflow ni errores JS.
- Capturas en GitHub Actions.
- PR a main tras PASS, esperar Render LIVE y probar la URL oficial pública.
- En teléfono físico se valida adicionalmente por el Director; no confundir móvil emulado con prueba de dispositivo real.
