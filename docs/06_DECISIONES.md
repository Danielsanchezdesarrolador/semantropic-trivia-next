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

- D-026 (29-10-2026): El Director autoriza **B03-C1**, núcleo determinista de práctica local de diez preguntas separado de la interfaz y del futuro multijugador. Contratos tipados, ejemplos de las seis categorías, respuesta única, validación local, avance y resultado tras diez respuestas; un punto por acierto provisional. Proteger SVG, CSS, composición, HomePreview y navegación. Sin reloj ni interfaz jugable, backend, login, bots o ranked. Las soluciones locales no son validación competitiva. Rama autorizada `feat/b03-c1-nucleo-local` desde `main` verificado `3aa8f037`; dependencias locales solo para verificar, sin alterar versiones ni lockfile. Entregar implementación local para revisión con check, tests y build; prohibidos commit, push, PR, merge y despliegue en este bloque. Estado: IMPLEMENTACIÓN LOCAL, PENDIENTE DE REVISIÓN DEL DIRECTOR.

- D-027 (29-10-2026): El Director establece la Arena B03-B02 como interfaz definitiva protegida de la primera partida. Categoría oficial conservada en cada pregunta; fondos, colores, iconos y barras automáticos desde `categoryThemes.ts` y los 42 SVG aprobados. Selector manual exclusivamente de laboratorio. Autoriza **B03-C2**: conectar el motor local verificado, respuesta única con feedback, avance, progreso y resumen básico, sin pantalla nueva de resultados ni reloj real (B03-C3 posterior). Conservar trabajo local B03-C1 y rama actual; no modificar main, lobby, assets ni producción. Estado: IMPLEMENTACIÓN LOCAL, PENDIENTE DE REVISIÓN DEL DIRECTOR. No autoriza commit, push, PR, merge ni despliegue.

- D-028 (29-10-2026): El Director declara **B03-C2 APROBADO** y autoriza **B03-C3**, reloj real por pregunta, agotamiento, feedback y resultados finales funcionales conservadores. Sin duración aprobada previa, usar 20 segundos centrales, pendiente de balance. Detener al responder, comprobar plazo real también al enviar respuesta o reanudar pestaña, bloquear duplicados y contabilizar agotadas como errores. Reiniciar plazo al comenzar pregunta nueva. Terminar tras diez resoluciones y ofrecer Volver a jugar / Volver al inicio. Mantener la Arena, sus assets, categorías dinámicas y lobby. Entregar Vite iniciado y URL comprobada para evaluación personal. B04 no autorizado; sin publicación. Estado: IMPLEMENTACIÓN LOCAL B03-C3, PENDIENTE DE REVISIÓN DEL DIRECTOR.

- D-029 (29-10-2026): El Director solicita **B03-C3-HF1**, arco circular continuo antes de aprobar B03-C3. Mantener 20 s, número entero y diseño original; no reemplazar SVG. Autoriza superposición SVG dinámica con longitud proporcional real, actualización fluida entre segundos y, si se conserva color, interpolación sin saltos. Congelar al responder, reiniciar en cada pregunta, vacío total a cero y agotamiento único. Preservar inactividad/reanudación/desmontaje. Implementación local pendiente de revisión; sin commit ni publicación.

- D-030 (29-10-2026): **B03-C1, B03-C2, B03-C3 y B03-C3-HF1 APROBADOS PARA CONTINUAR** por el Director. Autoriza B03-C4: proteger trabajo existente, QA final del núcleo local, consolidar roadmap/decisiones/documentación y persistir en AGENTS.md la entrega jugable con URL local comprobada después de cada microbloque. Preparar commit y PR dirigido a main, con resumen y **autorización específica antes de ejecutar commit, push o apertura de PR**. No fusionar ni desplegar producción; no iniciar B04. Conservar la rama actual, sin reset destructivo, clean, force push ni eliminación de trabajo. Estado: CIERRE LOCAL B03-C4 PARA REVISIÓN; integración y publicación pendientes.

- D-031 (29-10-2026): El Director aprueba incorporar **B03-C5 — Identidad sonora y sistema de audio premium** después del cierre C4 y antes de B04. Microbloques: C5a dirección artística/inventario de efectos y música/especificaciones; C5b efectos en interfaz, preguntas, respuestas, cronómetro y resultados; C5c música original, volúmenes independientes, preferencias, rendimiento y QA móvil. Identidad original SEMANTROPIC POP — Fantasía Social (cristales, magia suave, tecnología amigable), sin copiar otros juegos. Considerar reproducción permitida por navegador, compresión, volumen moderado, accesibilidad y evitar molestias/repetición. Solo actualización de roadmap y decisiones tras la tarea autorizada; no alterar C4 ni iniciar audio o B04. Estado: PLANIFICACIÓN APROBADA, DESARROLLO NO AUTORIZADO; requerir autorización independiente antes de comenzar.

- D-032 (29-10-2026): Tras la entrega local B03-C4 y el resumen de cambios/QA, el Director autoriza **crear el commit propuesto** `feat(b03): completar partida local de diez preguntas en Arena`, en la rama actual. Autorización limitada al commit local; no comprende push, apertura de PR, merge ni despliegue. Mantener capturas y respaldos locales fuera del commit.

- D-033 (29-10-2026): El Director amplía expresamente la autorización a **crear el commit, hacer push de feat/b03-c1-nucleo-local y abrir el PR hacia main**, conforme al resumen presentado en B03-C4. Completar estas operaciones y verificar sus resultados/CI; no fusionar ni desplegar. La autorización no inicia B03-C5 ni B04. Sustituye la limitación a commit local de D-032.
