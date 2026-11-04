# B04-C3 — entrega y checkpoint de continuidad

Orden del Director 04/11/2026. Alcance: navegación integral de acceso existente y canon de tres personajes. **Pantallas navegables; cuentas reales NO implementadas.** No se registra, autentica, verifica, cambia contraseñas ni envía correo. La revisión del montaje C3 pertenece al Director.

## Base, aislamiento y publicación

Rama `feat/b04-c3-access-canonical`, desde staging real `d28648c1db6f68183069e3a5347741d19ffa8c4c` (merge #21). Base comprobada con cuatro workflows verdes y Render DEV LIVE. Worktree aislado `/tmp/semantropic-b04-c3`; raíz sucia, ZIPs y Q03/Q04 no se incorporan ni se descartan.

Destino exclusivo: PR hacia staging, seis checks del HEAD en verde y merge normal respetando protecciones. La API de rama indica protected=false; no se modifica ninguna protección ni se usa bypass. Datos finales de PR/merge/deploy se añaden al cierre del PR, tras comprobarlos, sin presumir publicación por el commit local. Main preservado en `522b038caaa98cab1a0ff733b6beed8a1584d63d`.

Sitio fijo de revisión: https://semantropic-trivia-dev.onrender.com/ (`srv-dbljjvqjnfac7387cua0`), auto deploy desde staging, build `npm install && npm run build`, publish `dist`. Producción preservada: https://semantropic-trivia-next-web.onrender.com/ . No nuevos sitios/previews. El auto deploy verificado es On Commit; CI se exige antes de avanzar staging.

## Matriz de navegación

| Ruta DEV | Acciones y destino | Envío principal |
|---|---|---|
| [#welcome](https://semantropic-trivia-dev.onrender.com/#welcome) | Inicio → sign-in; Crear → register; Demostración → lobby-transition | Sin formulario; Invitado sigue Por evaluar |
| [#sign-in](https://semantropic-trivia-dev.onrender.com/#sign-in) | Registro, Recuperación, Bienvenida; recorrido visual → transición | Correo/contraseña locales; sin sesión |
| [#register](https://semantropic-trivia-dev.onrender.com/#register) | Inicio, Bienvenida; recorrido visual → verify | Nombre público, correo, clave/confirmación; sin cuenta |
| [#verify](https://semantropic-trivia-dev.onrender.com/#verify) | Registro, Inicio, Bienvenida; recorrido visual → auth-status; reenvío demostrativo | Solo forma de seis dígitos; no código generado/enviado/validado por servidor |
| [#forgot-password](https://semantropic-trivia-dev.onrender.com/#forgot-password) | Inicio, Bienvenida; recorrido visual → reset-password | Correo local; ningún enlace enviado |
| [#reset-password](https://semantropic-trivia-dev.onrender.com/#reset-password) | Inicio, Bienvenida; recorrido visual → auth-status | Claves coincidentes/mínimo visual; ningún cambio real |
| [#auth-status](https://semantropic-trivia-dev.onrender.com/#auth-status) | Inicio, Bienvenida; recorrido visual → lobby-transition | «Sin cuenta ni sesión creada», sin falso éxito |
| [#lobby-transition](https://semantropic-trivia-dev.onrender.com/#lobby-transition) | ABRIR LOBBY LOCAL → home; historial nativo | Composición C2 aprobada intacta |
| [#home](https://semantropic-trivia-dev.onrender.com/#home) | B02 real → menús existentes, Arena → home; historial | Práctica local; no sesión/online real |

En los cinco formularios, los datos válidos muestran exactamente «Vista previa: las cuentas todavía no están habilitadas» y permanecen en la misma pantalla. Los pasos posteriores son enlaces separados bajo «Recorrido visual de prueba». Errores aria-invalid/aria-describedby, alertas por campo, foco al primer error, etiquetas persistentes, mostrar/ocultar y controles de campo ≥44 px. Sin contraseñas/correo persistidos ni solicitudes de mutación. Formulario no equivale a autenticación.

## Cambios y protecciones

- `AccessPortal.tsx`, `previewValidation.ts`, CSS de acceso: validación local, estados honestos, enlaces de regreso y demo. D-049 conserva arte/CTA principales; solo su enlace inferior pasa de acceso directo al lobby a demostración mediante C2.
- `officialArtAssets.ts`, `assetRegistry.ts`, `ui/index.ts`: canon tipado con los cinco recursos, aprobación/rol/dimensiones/alfa/SHA/procedencia y portal incrustado.
- `LobbyTransitionOptionC.tsx`: sustituye literales por consultas al catálogo que devuelven exactamente las mismas rutas. CSS C2 inalterado.
- `HomePreview.tsx`, CSS del lobby: tres imágenes/alt/dimensiones oficiales en huecos existentes, object-fit contain. Sin mover botones, sidebar o contenedor de personajes. Los cuerpos completos ocupan de forma distinta los huecos antes usados por recortes; evaluar ese encaje en capturas, sin rediseñar el lobby.
- `sheetAssets.ts` y biblioteca histórica: conserva los recortes y sus rutas, ahora legacy/provisional.
- Tests y scripts B04, smoke B02 y workflow official-home: conservan controles anteriores, añaden validación/canon y comparación con build C2 en el mismo navegador/runner. No comparar hashes de capturas hechas con fuentes/sistemas distintos.
- AGENTS, roadmap, decisiones, guía de identidad/staging y propuesta C4 documentan únicamente la orden actual.

No cambian `App.tsx`, package/dependencias versionadas, Vite, public, logo, fondos, másteres, 42 SVG, audio, Arena, motor o preguntas. [Hashes y respaldo de másteres](B04_C3_IDENTIDAD.md). Los PNG másteres no están versionados: respaldo local fuera del repo, pendiente copia externa permanente del Director.

## Evidencia local comprobada

- TypeScript PASS; **91 tests PASS, 0 fallos, 0 omitidos**; build PASS; guard de audio de fuentes/dist PASS; guard editorial/assets PASS (cinco WebP y logo SHA exactos).
- C3: **54 vistas, seis recorridos, 18 comparaciones PASS**, sin errores JavaScript, HTTP o requests de mutación. Ver [resultado JSON](C3-capturas/qa-local.json).
- 320×740, 390×844, 844×390, 768×1024, 1366×900, 1920×1080: sin overflow horizontal, imágenes decodificadas y navegación mouse/touch/Tab/Enter; correo/confirmación, mostrar/ocultar, estados/reenvío y Atrás/Adelante. A 320/390 se reduce el viewport a 400 px de alto para comprobar scroll del formulario con espacio de teclado emulado. No es prueba de teclado Android físico.
- Opción C: píxeles idénticos completos en los seis tamaños. D-049: píxeles idénticos fuera del enlace inferior de demostración, ocultado únicamente en comparación manteniendo su hueco; las capturas entregadas muestran el enlace real. B02: geometría exacta de contenedor/personajes, botones y sidebar antes/después en seis tamaños.
- QA previo B04: 48 vistas y seis recorridos PASS. B02 oficial: PC, 390 y 320, menús/fullscreen, ronda de diez preguntas, Arena/retorno PASS. B03 reloj/arco: tres tamaños PASS; laboratorio/geometría Arena PASS. Audio release: PC, 390 y 320 PASS, L7/C excluyentes, SFX, reloj, preferencias/resultados sin victoria ficticia.
- Vite en http://localhost:4194/#welcome (reiniciar desde esta rama con `npm run dev -- --port 4194 --strictPort`). Recorridos comprobados; el smoke estricto extra en modo DEV encontró 404 de los dos manifiestos privados QA de audio ausentes en este worktree limpio. No se copiaron binarios privados ni se alteró audio para ocultarlo. El build público y su preview http://localhost:4193/#welcome pasan con audio oficial y sin esas solicitudes; la entrega principal usa Render DEV.

Móvil **EMULADO**. C3 requiere revisión Android física del Director; no se hereda como prueba C3 la revisión física previa de C2.

## Capturas comparativas

| Vista | Antes escritorio / móvil | C3 escritorio / móvil |
|---|---|---|
| D-049 | [PC](C3-capturas/desktop-welcome-before.png) / [móvil](C3-capturas/mobile-welcome-before.png) | [PC](C3-capturas/desktop-welcome.png) / [móvil](C3-capturas/mobile-welcome.png) |
| Opción C | [PC](C3-capturas/desktop-lobby-transition-before.png) / [móvil](C3-capturas/mobile-lobby-transition-before.png) | [PC](C3-capturas/desktop-lobby-transition.png) / [móvil](C3-capturas/mobile-lobby-transition.png) |
| B02 | [PC](C3-capturas/desktop-home-before.png) / [móvil](C3-capturas/mobile-home-before.png) | [PC](C3-capturas/desktop-home.png) / [móvil](C3-capturas/mobile-home.png) |
| Inicio | — | [PC](C3-capturas/desktop-sign-in.png) / [móvil](C3-capturas/mobile-sign-in.png) |
| Registro | — | [PC](C3-capturas/desktop-register.png) / [móvil](C3-capturas/mobile-register.png) |

Resto de capturas de rutas, seis tamaños y altura de teclado: artifacts/b04-c3 y artifact CI B02-Lobby-Oficial-PC-Mobile. Imágenes de QA en docs/artifacts; ninguna se usa como pantalla estática ni se publica en public/dist.

## Continuidad para otro chat

1. Consultar cierre del PR B04-C3 hacia staging: HEAD verificado, seis checks, merge SHA, deploy LIVE y release.json. No suponer que la revisión técnica es aprobación artística o permiso a main.
2. Leer esta entrega, guía de identidad, decisiones y staging. Comprobar ramas/remotos antes de actuar; raíz tiene trabajo ajeno protegido.
3. Mantener la misma URL DEV. Propuesta [B04-C4](B04_C4_PROPUESTA_NO_EJECUTAR.md) es solo planificación de arquitectura/seguridad/privacidad/menores y no autoriza backend. Esperar nueva orden del Director.
