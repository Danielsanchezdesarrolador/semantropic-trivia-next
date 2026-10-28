# ROADMAP CENTRAL — Semantropic Trivia (nuevo proyecto)
Fecha: 2026-10-28 · Estado actualizado: **B01 y B02 (lobby, navegación y fullscreen) completados; B03-A mockup minimalista aprobado; B03-B01 assets generados; B03-B02 integración visual en rama de preview autorizada.** Partidas reales siguen pendientes.

| Bloque | Objetivo | Entrega comprobable | Criterio de salida |
|---|---|---|---|
| B01 | Fundación cloud | Repo nuevo, docs, React/TS/Vite, Render Static Site | Sitio carga PC y teléfono; build y CI pasan; repos antiguos intactos |
| B02 | Nueva identidad visual | Dos o tres direcciones de arte y mockups seleccionados | Director aprueba referencia y guías UI accesibles |
| B03 | Núcleo trivia | Categorías, ronda de 10 preguntas, reloj, resultados, repeticiones | Partida local completa, navegable por teclado/touch |
| B04 | Identidad y persistencia | Registro/login, perfil, PostgreSQL, control de sesión | Datos reales por usuario, errores de red controlados |
| B05a | Online 1v1 normal | Sala servidor autoritativa, matchmaking, reconexión | Dos clientes humanos juegan misma ronda sincronizada |
| B05b | Fallback CPU honesto | Bot con dificultad, oferta al buscar 1v1 casual | Bot identificado y opcional; QA diferencia humano/IA |
| B06a | Familia 1v1/2v2 | Código privado, invitación, equipos y puntos conjuntos | Partidas reales con 2 o 4 participantes |
| B06b | Familia 3v3 / FFA | 6 jugadores, FFA y validación de capacidad | Equipos, puntuación y desconexiones correctas |
| B07 | Ranked 1v1 | Rating/MMR, temporadas, clasificación real, anti-trampas | Cero bots, integridad de resultados, revisión de abusos |
| B08a | Personalización | Perfil, skins, marcos, inventario, cosméticos | Los objetos no alteran gameplay |
| B08b | Preguntas continuas | Panel editorial, versiones, categorías, moderación | Contenido publicable sin actualizar la app |
| B08c | Comercio | Compras integradas y catálogo cosmético, restauraciones | Cumplimiento stores, prueba y seguridad |
| B09 | Android/iOS | Capacitor, controles, pruebas físicas, publicación | Estabilidad, privacidad, accesibilidad y aprobaciones de tiendas |

## B01 — registro histórico de fundación (completado)
1. Crear repo GitHub separado `semantropic-trivia-next` (sin sobrescribir `semantropic-trivia` ni `semantropic-trivia-unity-web`).
2. Subir este paquete completo a `main` (ver README).
3. Conectar Render Static Site con rama `main` y build `npm install && npm run build`, publish `dist`.
4. Verificar funcionamiento en Chrome/Safari PC y móvil. La primera pantalla es un **tablero de estado**, no un juego falso.
5. Definir la primera iteración real antes de empezar B02.

## Puntos de control
- **Gate 01**: repo independiente + Render; base online.
- **Gate 02**: mockup aprobado; identidad lista para implementación.
- **Gate 03**: trivia básica verdaderamente jugable.
- **Gate 04**: online casual estable con personas reales.
- **Gate 05**: bot opcional y visiblemente IA; no ranking.
- **Gate 06**: salas familiares completas.
- **Gate 07**: clasificatorias legítimas.
- **Gate 08**: publicación Android/iOS.

## Prioridad actual — B03-B02: integración de pantalla de preguntas (solo UI)
El Director aprobó Arena del Conocimiento en su versión minimalista, con colores distintos por categoría. El kit B03-B01 contiene 42 assets (SVG editable + PNG) organizados por tipo. Integrar **fuentes SVG individuales** en una nueva entrada `b03-preview.html` y componentes React con fondos responsivos para PC/móvil, panel de pregunta, alternativas, cabecera, timer y progreso ilustrativos. No activar selección como partida, reloj real, backend ni resultados; no alterar el lobby B02 oficial. Gate: revisión de 6 categorías y estados, TypeScript, build, tests y Chromium real en PC y móvil emulado. Director revisa el laboratorio antes de aprobar la integración a producción.

## Gestión del esfuerzo y prevención del agotamiento
Un bloque/PR cada vez, no rework artístico interminable. Aprobar antes de producir 100 assets. Reusar componentes, no simplificar mockups aprobados, sin multiplicar sistemas antes de que se pruebe lo central. «MVP» significa producto que funciona, no todo el catálogo futuro.