# AGENTS.md — SEMANTROPIC TRIVIA / NUEVA ETAPA
**Autoridad de dirección:** Director del juego (usuario). **Corte:** 2026-10-28. **Estado:** fundación de nuevo proyecto, no juego terminado.

## 1. Mandato innegociable
Construir Semantropic Trivia como videojuego de preguntas **social, familiar y competitivo**, para Android e iOS, con pruebas web desde PC y teléfono. Debe ser inclusivo para diversas edades, amigable, fácil de comprender, divertido, justo y respetuoso del tiempo del jugador. Las referencias a Preguntados son inspiración de categoría de producto, **no permiso para copiar** interfaz, arte, propiedad intelectual ni dinámicas invasivas.

**No convertir el proyecto en un TD, RPG, colección de minijuegos ni una app de casino.** El propósito central es responder preguntas y conectar jugadores. El principal diferencial será experiencia agradable, baja fricción, juego en familia, competencia legítima y personalización cosmética.

## 2. Modos oficiales y alcance
- **Jugar online / Normal:** 1 vs 1 por emparejamiento, sin afectar clasificación. Ofrecer rival CPU etiquetado en caso de baja concurrencia, bajo las reglas del apartado 3.
- **Jugar online / Clasificatoria:** 1 vs 1 entre dos personas REALES; ranking, MMR y temporadas. Cero CPU, cero resultados simulados.
- **Amigos y familia:** salas privadas de 1v1, 2v2, 3v3 y todos contra todos (FFA). Equipos equilibrados, códigos de sala, consentimiento de participantes. En primer lanzamiento las salas se construyen por etapas; no fingir que están implementadas.
- Un modo de práctica local puede existir para QA/onboarding, sin desplazar el foco social ni confundirse con el online.

## 3. Regla estricta de bots y honestidad
- **PROHIBIDO:** presentar CPU como una persona real; nombres, perfiles, chat o presencia simulada que induzcan a error; fabricar conteos de jugadores concurrentes o actividad online; usar bots para rellenar clasificatorias o tablas de mejores humanos.
- **PERMITIDO:** rival IA con nombre/avatar/persona ficticia y señalización visible, clara y accesible «Rival IA» o «CPU» en la oferta, presentación y resultados. Puede tener reacciones/errores/habilidades naturales, sin engañar sobre su naturaleza.
- Flujo casual: buscar rival humano; después de un umbral configurable (no hardcode comercial), presentar **«Jugar ahora contra IA»** y **«Seguir buscando persona»**. Se puede ofrecer IA inmediatamente si la persona lo solicita. No convertir silenciosamente una búsqueda humana en partida CPU.
- Un servidor debe indicar `opponentType: human | bot`, `matchType: casual | ranked | private` y metadatos verificables. Las estadísticas y economía distinguen claramente resultados CPU y humanos.
- Nunca fabricar actividad de jugadores, testimonios, rankings o emparejamientos falsos. El objetivo es combatir tiempos de espera sin destruir la confianza.
- Bots de dificultad graduada, respuestas plausibles y tiempo de respuesta humanamente entendible, pero sin suplantación. Las partidas contra bots no modifican MMR ni ranking de humanos.

## 4. Monetización y experiencia respetuosa
- El juego se disfruta sin pagar. **No** anuncios forzados entre preguntas, interrupciones invasivas, energía que bloquee el juego, trucos de escasez, pay-to-win ni ventajas competitivas pagadas.
- Compras de skins, marcos de perfil, avatares, títulos y cosméticos claros; nunca incrementan probabilidad de acertar, tiempo de respuesta ni puntuación.
- Cualquier anuncio recompensado, pase, cofres pagados o sistema de compras necesita autorización específica y revisión legal/plataforma. Nada de loot boxes pagadas por defecto.
- Publicar política de privacidad, seguridad y controles aplicables para menores **antes del lanzamiento público**; el juego busca audiencia de distintas edades y el diseño debe protegerla.

## 5. Arquitectura autorizada
- **React + TypeScript + Vite:** menús, preguntas, perfiles, formularios, accesibilidad y responsive mobile-first.
- **Phaser 4.2.1:** animaciones, escenas 2D y efectos donde realmente supere al DOM; evitar montar toda la interfaz en Canvas por inercia.
- **Backend Node.js + PostgreSQL, alojado en Render:** sesiones, preguntas, matchmaking, estado de partidas, cronómetros, validación de respuestas, clasificación, inventarios y contenido. Su integración es una fase futura, NO está desplegada en este repositorio nuevo.
- **Capacitor Android/iOS:** fase posterior de empaquetado, prueba y publicación, una vez comprobada la experiencia web móvil.
- Cliente jamás decide MMR, ganadores, recompensas, respuestas correctas de partidas competitivas ni temporizadores autoritativos. No colocar claves secretas o credenciales en frontend/GitHub.
- Auditaremos los repositorios anteriores como fuentes opcionales: `semantropic-trivia` (web legacy) y `semantropic-trivia-unity-web` (build publicado). **No migrar automáticamente** código, branding, arte, bases de datos o credenciales.

## 6. Estética: mockup de inicio aprobado (actualización 2026-10-28)
- La dirección antigua NO es canon automático. Se solicita **una nueva identidad amigable, cálida, clara, original y transversal en edades**, y su aprobación se hará después mediante mockups.
- **ALCANCE ACTUAL (2026-10-28):** El Director aprobó el lobby SEMANTROPIC POP — Fantasía Social como portada y pidió que los botones respondan al pulsarlos antes de empezar B03. Se autoriza únicamente **navegación funcional por menús y submenús**, conservando el arte aprobado. No significa partidas, matchmaking, usuarios o cuentas activos. El fondo y logo oficiales permanecen separados; los otros recortes siguen como referencias artísticas.
- Una vez aprobado un mockup, constituye especificación visual obligatoria: no simplificarlo unilateralmente ni convertirlo en una ilustración de fondo monolítica. Cuando haya conflicto técnico real, exponer alternativas y solicitar decisión.
- Evitar estética sobrecargada, infantilizada, agresiva, confusa o derivativa de Preguntados.

## 7. Método Codex: microbloques y evidencia
1. Leer `AGENTS.md`, `docs/01_VISION.md`, `docs/02_ROADMAP.md`, `docs/03_ARQUITECTURA.md`, `docs/04_MATCHMAKING_BOTS.md` antes de tocar archivos.
2. **Un objetivo por bloque**, alcance explícito y sin añadir módulos extra «por aprovechar».
3. Plan corto: archivos afectados, criterios de aceptación, riesgos y pruebas. Ejecutar lo autorizado; no pedir confirmación redundante para microcambios ya aprobados.
4. Trabajar en rama dedicada y PR. No sobrescribir ni reescribir legacy; no cambiar producción ni desplegar sin verificaciones de la etapa. Priorizar diff pequeño, rollback y commits claros.
5. Proteger lo aprobado. Un bloque funcional NO autoriza rediseños visuales, y un bloque visual NO autoriza cambios de lógica.
6. Realizar QA de navegador de escritorio y móvil horizontal/vertical según función. No decir «PASS móvil físico» sin comprobarlo físicamente; distinguir QA automatizado, emulado y dispositivo real.
7. Reportar cambios, tests ejecutados, resultados, limitaciones, commit/PR y URL **únicamente si están verificados**. No inventar capturas, disponibilidad online, usuarios concurrentes, mediciones, ni sistemas completados.
8. Mantener los archivos de decisiones y roadmap alineados con instrucciones expresas más recientes, no con comentarios históricos.

## 8. Orden de ejecución
**B01 (completado históricamente):** repositorio independiente + skeleton React TS/Vite + documentos y Render Static Site verificados. La portada técnica fue sustituida por el lobby visual B02 tras aprobación del Director.
**B02 (portada aprobada):** lobby visual publicado y menús navegables; microbloque B02-FS: botón de pantalla completa para PC/Android compatible y alternativa PWA instalable desde pantalla de inicio en móviles donde Fullscreen API no funcione. No iniciar partida trivia B03 ni simular sistemas online. Publicar tras CI/QA y verificación real de Render.
**B03:** partida trivia local de punta a punta + categorías y datos con contratos preparados para servidor.
**B04:** autenticación, perfil y base de datos real.
**B05:** online casual 1v1 con servidor autoritativo; fallback IA **revelado, opcional**.
**B06:** salas privadas de 1v1, 2v2, 3v3, FFA.
**B07:** ranking 1v1 humano, temporadas, anti-trampas.
**B08:** cosméticos, tienda y CMS de preguntas.
**B09:** empaquetado y control de calidad móvil Android/iOS.

### Definición de terminado
Una etapa es terminada solo si cumple su objetivo, QA medible, aprobación humana y despliegue verificable cuando corresponde. No asumir que subir archivos a GitHub equivale a haber lanzado un juego.