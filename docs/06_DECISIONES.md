# 06 — Registro de decisiones
**Corte:** 2026-10-28 · **Estado:** consolidación del material oficial entregado.

| ID | Decisión | Estado |
|---|---|---|
| D-001 | Nuevo juego de trivia social/familiar/competitivo, no continuación automática de Unity ni TD | APROBADO |
| D-002 | Director del juego mantiene aprobación final; Codex implementa por bloques | APROBADO |
| D-003 | Repositorio independiente `Danielsanchezdesarrolador/semantropic-trivia-next` | REPOSITORIO CREADO y verificado 2026-10-28 |
| D-004 | B01 solo React/TS/Vite, Phaser 4.2.1 declarado pero sin Canvas, CI y Render estático | APROBADO como alcance |
| D-005 | Online normal y clasificatorio, y salas privadas 1v1/2v2/3v3/FFA | APROBADO como visión, NO IMPLEMENTADO |
| D-006 | IA opcional etiquetada solo casual, jamás en ranked | APROBADO como regla futura |
| D-007 | B02 define identidad visual nueva, no canon automático de assets anteriores | PENDIENTE de diseño/aprobación |
| D-008 | Node 22.16.0 y versiones de dependencias propuestas para starter B01 | VERIFICADO CI 2026-10-28 |
| D-009 | Workspace Render `My Workspace` encontrado por conector | CONFIRMADO por el Director 2026-10-28 |

No interpretar la creación local de una estructura como repositorio existente, servicio creado o deploy online. Actualizar este registro con enlaces, SHA y resultados cuando existan.

## Actualización oficial 2026-10-28 · B02
- D-010: **B01 finalizado**: repo independiente, pruebas CI, Render Live y confirmación del Director de que abre desde dispositivos. Estado: VERIFICADO y APROBADO.
- D-011: dirección **SEMANTROPIC POP — Fantasía Social** (Plaza de Ideas + Noche Galáctica), paleta viva y legibilidad. Estado: APROBADO para la pantalla principal.
- D-012: mockup vertical híbrido de pantalla principal, tamaño de referencia 1024x1536. Estado: **MOCKUP VISUAL APROBADO, NO IMPLEMENTADO**.
- D-013: **B02-C1** autoriza solo diseño de arquitectura de assets, tokens y componentes reutilizables en rama/PR; prohíbe fusión a main y cambios en Render/producción. Estado: AUTORIZADO, EN DESARROLLO.
- D-014: modos oficiales y prohibiciones B01/B02 continúan; Torneo CPU, pase de temporada y cifras ilustradas del mockup no son funcionalidades aprobadas.

- D-015: El Director **APRUEBA** como fondo oficial de home la ilustración de plaza fantástica y cielo galáctico sin interfaz, 1672×941. Se integra WebP optimizado en B02-C2 y se conserva el original PNG; logotipo, personajes y UI final siguen pendientes. **FONDO APROBADO, PREVIEW EN DESARROLLO, NO PRODUCCIÓN.**

- D-016: el Director **APRUEBA el logotipo SEMANTROPIC TRIVIA del mockup** y solicita su integración como asset independiente. Se emplea extracción PNG RGBA del mockup aprobado, sin reimaginar tipografía ni sustituirlo por un logotipo nuevo. Estado: **LOGOTIPO APROBADO, INTEGRADO EN PREVIEW B02-C2, NO PUBLICADO**.

- D-017: el Director pide que el escenario cubra todo el lobby y que el logotipo y los dos botones autorizados ganen nitidez. Se corrige altura fija del fondo y degradado opaco; el logo en la home usa el PNG oficial 585×370, los botones se renderizan mediante CSS + SVG + texto React. Las imágenes pequeñas originales permanecen solo como referencias de la biblioteca. **Hotfix visual de preview, no producción; pendiente revisión del Director.**

- D-018: el Director aprueba el lobby visual corregido (fondo continuo, logotipo nítido y botones vectoriales) y autoriza su publicación en la portada oficial de SEMANTROPIC TRIVIA. El home público debe ocultar la galería técnica y mantener todos los modos deshabilitados. Estado: **PUBLICACIÓN AUTORIZADA, SUJETA A CI/QA Y VERIFICACIÓN DE RENDER**.

- D-020 (28-10-2026): El Director solicita, antes de comenzar B03, **poder pulsar todos los botones del lobby oficial**. Se interpreta como habilitar navegación real entre menús y submenús, con regreso y soporte del botón Atrás. Online muestra Normal/Clasificatoria 1v1; Amigos muestra salas 1v1/2v2/3v3/FFA; el lateral navega Inicio, Colección, Tienda, Amigos, Ranking. Los apartados todavía no implementados estarán etiquetados claramente como «En desarrollo». No autoriza matchmaking, inventario, cuentas, MMR, salas ni partidas ficticias. Estado: AUTORIZADO PARA B02-NAV, publicación tras QA.

- D-021 (28-10-2026): el Director solicita modo pantalla completa en PC y teléfono antes de B03. Implementar botón Fullscreen API con salida reversible y detección de rechazo; ofrecer web app instalable desde pantalla de inicio como alternativa en iPhone/navegador embebido, sin afirmar fullscreen nativo donde no hay soporte. Mantener la composición B02 y el sitio oficial. Estado: **B02-FS AUTORIZADO; publicar tras CI, QA y Render LIVE**.

- D-022 (28-10-2026): El Director aprueba el mockup B03-A minimalista de Arena del Conocimiento, con colores dinámicos por categoría; autoriza iniciar la integración de los recursos B03-B01 en el juego. Se abre **B03-B02**: 42 SVG originales como assets individuales y preview React aislada (PC y móvil). Se permiten controles de inspección de categorías y skins, SIN cronómetro funcional, respuesta real, lógica de juego, cuentas o matchmaking. No fusionar en main ni modificar Render oficial hasta revisión y aprobación del Director. Estado: IMPLEMENTACIÓN VISUAL AUTORIZADA, QA PENDIENTE.

- D-023 (28-10-2026): Director ordena **B03-B02-HF1**, pulido visual de la Arena del Conocimiento: corregir alineación de cabecera, pregunta, respuestas A/B/C/D, progreso y panel QA; reducir interferencia de cristales. No autoriza rediseño, lógica jugable ni publicación en producción. QA de geometría en Chromium y revisión del Director antes de aprobar B03-B02.

- D-024 (28-10-2026): tras HF1, Director indica con captura que la cabecera sigue desalineada. Autoriza implícitamente HF2 limitado a alinear emblema, texto y contador con el SVG original y verificar capturas PC/móvil. No rediseñar assets, no modificar main/Render de producción ni iniciar juego B03-C. Estado: EN CORRECCIÓN, aprobación artística pendiente.

- D-025 (28-10-2026): El Director confirma «perfecto aprobado, ahora que quede implementado en el juego oficial» tras visualizar la corrección B03-B02-HF2. Se autoriza fusionar PR #12 a `main` **solo después de QA**, publicar en Render oficial y conectar la Arena por una entrada del lobby; la interfaz oficial se presenta como demostración sin partida, timer o resultados, conserva las seis categorías, los 42 assets y el regreso al lobby. Mantener laboratorio de arte aislado. B03-C sigue pendiente de autorización.
