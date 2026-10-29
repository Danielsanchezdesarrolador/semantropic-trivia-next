# ROADMAP CENTRAL — Semantropic Trivia (nuevo proyecto)
Fecha de actualización: 2026-10-29 · **B01/B02 completados; B03-B02 integrado en main. B03-C1/C2/C3/HF1 aprobados para continuar; B03-C4 validado localmente y commit, push de la rama y PR hacia main autorizados por el Director.** Merge y despliegue no autorizados. B03-C5 aprobado solo como planificación después de C4 y antes de B04; desarrollo de audio y B04 no autorizados.

| Bloque | Objetivo | Entrega comprobable | Criterio de salida |
|---|---|---|---|
| B01 | Fundación cloud | Repo nuevo, docs, React/TS/Vite, Render Static Site | Sitio carga PC y teléfono; build y CI pasan; repos antiguos intactos |
| B02 | Nueva identidad visual | Dos o tres direcciones de arte y mockups seleccionados | Director aprueba referencia y guías UI accesibles |
| B03 | Núcleo trivia | Categorías, ronda de 10 preguntas, reloj, resultados, repeticiones | Partida local completa, navegable por teclado/touch |
| B03-C5a | Dirección artística sonora | Inventario de efectos y música, identidad original y especificaciones técnicas | Director aprueba dirección e inventario antes de implementar |
| B03-C5b | Efectos sonoros | Audio de interfaz, preguntas, respuestas, cronómetro y resultados | Feedback moderado, accesible y sin repetición molesta; QA y revisión del Director |
| B03-C5c | Música y controles de audio | Música original, volúmenes independientes, preferencias, rendimiento y QA móvil | Reproducción compatible con navegador, controles verificables y aprobación del Director |
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

## Registro de integración — B03-B02 aprobado en pantalla oficial
El Director aprobó el pulido HF2 y autorizó integrar **Arena del Conocimiento** al sitio oficial. Mantener intacto el lobby B02 y agregar un botón secundario identificable «Arena del Conocimiento» que navegue a `/#arena` (con historial y regreso), en la misma aplicación React. La demostración usa las seis categorías y los 42 SVG, con pregunta, respuestas, reloj y progreso de ejemplo; no activa juego real ni muestra controles QA inferiores. Mantener `b03-preview.html` y Render del laboratorio por separado para trabajo artístico posterior. Gate obligatorio: TypeScript, 44+ tests, Vite, Chromium PC/390/320 para navegación lobby→arena→lobby, cambios de las seis categorías, carga de assets, cero JS error y overflow, además del QA público Render LIVE. B03-C requiere autorización independiente.

## Registro — B03-C1: núcleo local (autorizado 29-10-2026)

B03-B02 está integrado en `main`, commit `3aa8f03726604c4d0c955b5353b046dd7ce58a1d`; esto no constituye una nueva comprobación de Render. El Director autoriza B03-C1 en rama `feat/b03-c1-nucleo-local`: contratos TypeScript, diez preguntas de ejemplo revisables que cubren las seis categorías y motor determinista de práctica local, con una respuesta por pregunta, avance explícito y cierre al registrar la décima respuesta. Puntuación provisional: un punto por acierto, cero por error. Implementación local pendiente de revisión del Director, sin commit ni publicación.

La Arena, sus 42 SVG, CSS, lobby y navegación permanecen intactos. Reloj e interfaz jugable siguen pendientes de otro bloque. Las soluciones locales son exclusivamente de práctica; nunca validan partidas competitivas. Gate B03-C1: TypeScript, suite completa sin regresiones en los 44 tests existentes y build. No autoriza commit, push, PR, merge ni despliegue.

## Registro — B03-C2: Arena jugable local (autorizado 29-10-2026)

Conectar B03-C1 a `QuizPreview` en la ruta oficial `/#arena`: diez preguntas, cuatro alternativas, una respuesta, feedback SVG, avance explícito, progreso real y resumen básico con aciertos, errores y puntos. Reinicio local disponible. Cada pregunta selecciona automáticamente fondo, color, barra e icono desde su categoría oficial; selector manual y estados de inspección permanecen solo en `b03-preview.html`.

Mantener los 42 SVG, geometría de Arena y lobby intactos. Los botones nativos de respuesta solo requieren normalizar estilos de navegador, sin cambiar dimensiones. La ronda muestra «Sin límite de tiempo» y ∞ en el espacio existente del reloj; no hay cuenta regresiva. B03-C3 requiere autorización independiente. No hay persistencia: recargar o salir descarta la ronda. La rama conserva B03-C1 sin commit; no cambiar de rama ni publicar. Evidencia y comandos: `docs/art/B03_C2_ARENA_LOCAL.md`.

## Registro — B03-C3: cronómetro y resultados (autorizado 29-10-2026)

El Director aprueba B03-C2 y autoriza completar la práctica local. Duración provisional central: 20 segundos por pregunta, pendiente de balance. Cuenta regresiva por plazo real; detener al responder y registrar agotamiento como error sin selección inventada. No otorgar tiempo adicional al volver de pestaña inactiva. Cada pregunta requiere avance explícito tras el feedback; diez resoluciones terminan la ronda. Resultados conservadores en el área inferior existente: completadas, respondidas, agotadas, aciertos, errores, puntos y acciones Volver a jugar / Volver al inicio.

Se preservan categorías dinámicas, geometría, 42 SVG, lobby y laboratorio independiente. Implementación y QA locales; sin commit, push, PR, merge ni despliegue. Entrega comprobable desde Vite; no iniciar B04. Evidencia, comandos y límites en `docs/art/B03_C3_RELOJ_RESULTADOS.md`.

## Registro — B03-C3-HF1: temporizador circular continuo

Microcorrectivo solicitado antes de aprobar B03-C3. Conservar duración de 20 s,
motor y 42 SVG. Superponer arco dinámico en las coordenadas del reloj original,
con longitud proporcional al tiempo real (100/75/50/25/0 % a 20/15/10/5/0 s),
RAF único y color interpolado entre los tonos originales. Congelar exactamente
al responder, reiniciar sin transiciones residuales y dejar el arco vacío al
agotarse el tiempo. Cancelar RAF y listeners al ocultar/desmontar o resolver.
La validación temporal del motor continúa independiente de la animación.
Implementación local aprobada para continuar por el Director en B03-C4; evidencia en
`docs/art/B03_C3_HF1_ARCO_CONTINUO.md`. Sin publicación ni inicio de B04.

## Prioridad actual — B03-C4: cierre local y preparación de publicación

El Director aprueba C1/C2/C3/HF1 para continuar y autoriza auditar/consolidar el
trabajo existente, QA final y actualización documental. Conservar la rama y los
cambios sin duplicar implementación. La regla de entregar Vite y URL comprobada
tras cada microbloque queda incorporada en AGENTS.md. Preparar un respaldo local
y propuesta concreta de commit/PR a main; autorización específica requerida
**antes** de commit, push o apertura de PR. No fusionar ni desplegar.

El objetivo local es diez preguntas y cuatro alternativas, seis categorías
automáticas, respuesta única, reloj real de 20 s con arco/color continuos,
agotamiento, resultados, reinicio y lobby. Revisar mouse, teclado y tacto emulado;
teléfonos físicos y Safari siguen pendientes. B03 no se declara publicado ni
completado comercialmente. Evidencia y propuesta: `docs/B03_C4_CIERRE_LOCAL.md`.

## Plan aprobado — B03-C5: identidad sonora y sistema de audio premium

Ubicación obligatoria: **después del cierre B03-C4 y antes de B04**. Se aprueba
incorporar el bloque al roadmap; no se autoriza todavía diseñar o desarrollar
el sistema de audio. Solicitar autorización independiente antes de comenzar.
Esta planificación no cambia el alcance ni el trabajo aprobado de B03-C4.

- **B03-C5a:** dirección artística sonora, inventario de efectos y música y
  especificaciones técnicas, para aprobación del Director.
- **B03-C5b:** implementación de efectos de interfaz, preguntas, respuestas,
  cronómetro y resultados sobre la dirección aprobada.
- **B03-C5c:** música original, controles independientes de volumen, preferencias,
  rendimiento y QA móvil.

Identidad original coherente con **SEMANTROPIC POP — Fantasía Social**: cristales,
magia suave, tecnología amigable y efectos satisfactorios. No copiar música ni
sonidos de otros videojuegos. Considerar permiso de reproducción del navegador,
formatos comprimidos, volumen moderado, accesibilidad y ausencia de sonidos
molestos o repetitivos. B04 permanece pendiente y no se inicia.

## Gestión del esfuerzo y prevención del agotamiento
Un bloque/PR cada vez, no rework artístico interminable. Aprobar antes de producir 100 assets. Reusar componentes, no simplificar mockups aprobados, sin multiplicar sistemas antes de que se pruebe lo central. «MVP» significa producto que funciona, no todo el catálogo futuro.
