# B04-C2 · Opción C en la transición al lobby

Orden del Director: 04/11/2026. Base limpia: staging `8e05eeaa05efeb76334e0861c264cd089f6df768`. Rama: `feat/b04-c2-option-c`. Integración exclusivamente por PR a staging tras CI verde. Main/producción y PR #20 se conservan. Publicar en DEV no aprueba el montaje visual.

URL de destino fija: https://semantropic-trivia-dev.onrender.com/#lobby-transition. Commit/deploy publicados y resultado HTTPS se registran en el PR de entrega tras comprobarlos; este documento no presume publicación antes del merge.

## Material auditado

ZIP `SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip`, abierto y extraído exclusivamente en un directorio temporal externo al árbol del app. Se rechazaron rutas absolutas, `..`, separadores inversos y symlinks; escritura exclusiva sin sobrescrituras. Integridad ZIP correcta; 36 registros del manifiesto y 37 de SHA256SUMS coinciden. Las imágenes abren con dimensiones declaradas. No se distribuyen ZIP, masters, tableros, referencias, composiciones aplanadas, portal alternativo ni ornamentos no usados.

[Auditoría completa con SHA-256, tamaños, resoluciones y alfa](B04_C2_ASSETS.json).

| Asset WebP del runtime | Resolución | Alfa |
|---|---|---|
| protagonist-male-v1-web.webp | 704×1100 | Real, 0–255 |
| protagonist-female-v1-web.webp | 653×1100 | Real, 0–255 |
| mascot-robot-v1-web.webp | 1100×1044 | Real, 0–255 |
| lobby-option-c-desktop-2560x1440.webp | 2560×1440 | RGB opaco |
| lobby-option-c-mobile-1080x1920.webp | 1080×1920 | RGB opaco |

Únicamente esos cinco archivos están en `public/assets/access/b04-option-c/`, copiados byte por byte del ZIP. Son derivados web entregados; no se generan personajes ni se reescalan masters de 2048 pretendiendo detalle nuevo. Los fondos ya incluyen el portal.

Logo: se usa exactamente `public/assets/home/brand/semantropic-trivia-logo-v1.png` (SHA `1e404c4ea2e64d1629a80a247bcd6c66fc455bcbf7d2e1515e0d9a152aa8463b`). La referencia del ZIP tiene SHA diferente; no se copia ni se crea UI-v2. No se añade “1.0”.

Alerta de metadatos: los conteos de píxeles transparentes de los tres masters coinciden; sus cajas declaradas `native_visible_bbox` difieren del soporte de alfa > 0 medido. Se conservan ambas medidas en la auditoría sin atribuir un umbral no documentado ni retocar el arte. Esto no altera los SHA o dimensiones de los cinco assets runtime. Los maestros son raster; la fidelidad del montaje corresponde a revisión del Director.

## Implementación y archivos

- `src/ui/access/LobbyTransitionOptionC.tsx`: fondo por picture, tres personajes independientes, logo único, h1/p y enlace #home con Enter/Espacio nativos o adaptados. Sin autenticación ni estado de usuario.
- `src/ui/access/lobby-transition-option-c.css`: escena encapsulada, paisaje y retrato por aspect ratio, cuerpos completos con object-fit contain, safe-area, foco visible y reduced-motion. En 844×390 la escena tiene altura mínima de 600 px y scroll vertical para mantener personajes/texto/CTA legibles.
- `src/ui/access/AccessPortal.tsx`: import y derivación exclusiva de lobby-transition. La interfaz anterior del resto de rutas permanece intacta; App.tsx y access-portal.css no cambian.
- `scripts/b04/visual-qa.mjs`: 48 vistas en seis tamaños, historial, teclado, interacción, geometría y recursos. Las cancelaciones `net::ERR_ABORTED` de blobs de audio al abandonar vistas se registran separadamente; errores HTTP, carga de archivos y otros fallos no se descartan.
- `scripts/b04/guard-option-c.mjs`: exactamente cinco assets con SHA aprobado, logo canónico y auditoría editorial del dist. Sin dependencias ni fuentes Q03/Q04 privadas.
- `tests/b04-c2-public-guard.test.mjs`: acepta el conjunto aprobado y rechaza contenido privado, arte extra y alteración del asset servido mediante fixtures temporales propios.
- Cuatro workflows: PR a staging además de main, guard editorial/assets añadido sin eliminar controles anteriores. Se mantienen tests de lobby, audio, Arena, reloj y arco.
- `docs/02_ROADMAP.md`, `docs/06_DECISIONES.md` y esta carpeta: continuidad, manifiesto y capturas; fuera de public/dist.

## Resultados locales y regresión

TypeScript PASS. Suite completa: 87 aprobadas, 0 fallidas. Build PASS con guard de audio; guard editorial/assets PASS. Vite activo verificado en http://localhost:5175/#lobby-transition (reinicio `npm run dev -- --port 5175 --strictPort`), escena y CTA hacia lobby comprobados en navegador. La URL local es complementaria: el Director revisa en el enlace fijo de Render.

Chromium sobre build: 48 vistas / seis tamaños y seis recorridos de acceso/transición/lobby/Arena; cero errores JS, fallos HTTP o overflow horizontal. Las cancelaciones normales de audio blob se distinguen en qa-local.json. Los cinco tamaños pedidos están cubiertos, más tablet 768×1024. Móvil táctil EMULADO, no Android físico.

- [x] #welcome → #sign-in / #register; verificación, recuperación y confirmación conservadas.
- [x] #lobby-transition → #home → #arena → #home; respuesta local real, Atrás/Adelante y Enter/Espacio sobre CTA.
- [x] Tres personajes visibles íntegros, masculino izquierda, robot centro, femenina derecha; fondos correctos por aspecto, sin segundo portal.
- [x] Logo único; CTA ≥44 px, texto legible y sin recorte horizontal.
- [x] App, CSS anterior, lobby, Arena, motor, 42 SVG, assets home, audio y dependencias sin cambios respecto a staging base.
- [ ] CI remoto y despliegue: consultar resultado definitivo del PR, obligatorio antes de integrar staging.
- [ ] Revisión artística final y Android físico: Director.

## Capturas reales

[320×740](C2-capturas/small-lobby-transition.png) · [390×844](C2-capturas/mobile-lobby-transition.png) · [844×390](C2-capturas/landscape-lobby-transition.png) · [1366×900](C2-capturas/desktop-lobby-transition.png) · [1920×1080](C2-capturas/wide-lobby-transition.png) · [768×1024 tablet](C2-capturas/tablet-lobby-transition.png).
[Resultado automatizado](C2-capturas/qa-local.json).

Las referencias originales permanecen en el ZIP del Director y la extracción temporal. Las capturas son del montaje React, no imágenes usadas como pantallas del juego. Las posiciones responsive y el scroll vertical son parte del resultado a evaluar; no se declara equivalencia píxel a píxel con las láminas.
