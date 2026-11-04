# ART-CP01 — instalación oficial y checkpoint

Orden del Director: 04/11/2026. Las diez fuentes PNG nuevas son la autoridad de identidad. El logo con 1.0 es un original nuevo, no remuestreo de v1. Integración para revisión visual, sin aprobación final del montaje.

## Base e integridad del paquete

- Rama feat/art-cp01-official desde staging ac216f009c7cdd88b558c14e7625e2f347bf0eb8 (merge #22). Worktree aislado /tmp/semantropic-art-cp01; raíz y Q03/Q04 preservados.
- ZIP SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip; SHA-256 bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a. CRC y rutas seguros; extracción temporal sin traversal/symlinks ni sobrescritura.
- 31 sumas verificadas, 28 imágenes con dimensiones/alfa exactos. Diez fuentes PNG (ocho masters/atlas y dos referencias), cinco recortes derivados PNG y trece recursos web. Jerarquía aplicada sin carpeta raíz extra.
- Todos los PNG fuente/referencias y documentos originales del paquete se incorporan a Git byte por byte. ASSET_MANIFEST.json, SHA256SUMS.txt y textos del paquete no se alteran. El estado previo «repositorio no actualizado» del documento suministrado describe su preparación, no el cierre del PR.

## Runtime y consumidores

Logo activo: `public/assets/official/brand/semantropic-trivia-logo-1_0-v2.png` (1536×1024), SHA `6b01ec51cfb357d588b53e3cae6669ec605cad1d43b1bb76c4d03dd5f927ee8f`. brand/logo se declara una sola vez en officialArtAssets y se enlaza al registro general. Lo consumen welcome/raíz, sign-in, register, verify, forgot-password, reset-password, auth-status, lobby-transition, home y los paneles B02 que ya recibían el logo. El marco previo se conserva por aspect-ratio y object-fit contain; no se estira ni recorta el PNG. Se retira «1.0» del rótulo textual previo del header B02 para no duplicarlo encima del logo.

Las tres identidades conservan sus IDs exactos y apuntan ahora a los WebP CP01, con rol, dimensiones, alfa, SHA, aprobación, manifiesto, fuente maestra y SHA de procedencia. Fondos v2 seleccionados por breakpoint; ambos contienen el portal. No se añade el portal independiente. Los siete recursos web alternativos/ornamentos permanecen como biblioteca declarada, sin consumidores activos ni nuevas solicitudes de imagen.

D-049: fondo, portal, acciones, textos y estructura intactos; solo logo. Opción C: misma CSS de composición y mismo CTA #home, sin plano aplanado ni portal duplicado; imágenes originales CP01. B02: ventanas CSS con overflow y escala para torso/medio cuerpo, robot centrado y mayor protagonismo; ningún PNG se recorta o sobrescribe. Contenedor/acciones/sidebar conservan geometría y funcionalidades. El encuadre y la percepción de escala del nuevo arte requieren revisión del Director.

Galería histórica: tres tarjetas conservan su registro y muestran «Archivado fuera del juego activo»; no solicitan imágenes retiradas. Los 23 registros del manifiesto B02 siguen verificándose con sus hashes originales, resolviendo los tres archivos trasladados. SVG candidatos, otras decoraciones y miniaturas históricas se conservan por compatibilidad de auditoría, sin consumidores en el juego oficial. Iconos de instalación/PWA previos se conservan; CP01 no aporta exportaciones de plataforma nuevas.

## Antes / después y archivo histórico

B04_C2_ASSETS.json y B02_SHEET_BINARY_MANIFEST.json se conservan inmutables. LEGACY_CP01.json registra rutas anteriores, archivo nuevo y SHA real. No se modifica ningún hash histórico para aparentar que los binarios son los mismos. Se retiran nueve archivos de public y se conservan bajo art/legacy, fuera de dist.

| Archivo anterior | SHA histórico | Archivo actual | SHA CP01 |
|---|---|---|---|
| semantropic-trivia-logo-v1.png | 1e404c4ea2e64d1629a80a247bcd6c66fc455bcbf7d2e1515e0d9a152aa8463b | semantropic-trivia-logo-1_0-v2.png | 6b01ec51cfb357d588b53e3cae6669ec605cad1d43b1bb76c4d03dd5f927ee8f |
| protagonist-male-v1-web.webp | 38c8f594a33cae63cc7b84c3c98d7ddf5e1e8208923184a1b8b60c512b03e115 | protagonist-male-v1.webp | 99c30bcc792a318477dd0ea42f49ee1b4a11d203a1fcb80b27fc060f291a1bf7 |
| protagonist-female-v1-web.webp | e7562cbf1512c5a51cbdb7f2ca01446bb01c5689dc364601d742d35334c1d160 | protagonist-female-v1.webp | 966e2fdeaa68e2993be4f4383aeeb1d7f27f76b41cda5e9fd4a90efb8604173d |
| mascot-robot-v1-web.webp | 0f739713da23a632589d6ffc6eb4e7aff89bbf90fe7f02b71b0d01aafecddc58 | mascot-robot-v1.webp | 1639b841e655e30207493db308939e16759954659039b87490e6c41aa51165a5 |
| lobby-option-c-desktop-2560x1440.webp | 36e13c1af4a129c46d5090f9e4ec0b1b10f3fc1ddeec400c2296b470c8826d9c | lobby-option-c-desktop-v2.webp | 65aa8333fb9c424ce3a87f6a3a6a8978b729547b0d36f2b6670b9552a4293b0e |
| lobby-option-c-mobile-1080x1920.webp | b57d0c968ca95a7c0a6f5d7e71ebc39b0a1aacc6436e181f5d4a220c443c1db3 | lobby-option-c-mobile-v2.webp | 575fe496f5f85ec6fa60a204ffac8f670f9c62b1b800a44cbe2f51f3bebfa701 |

Archivo histórico de los tres recortes B02:
- art/legacy/home/sheet/character-boy.png — a7439fc611588b6ffa477c386b7e9a40c440f38cd8bf057f3237b3865b2b248b
- art/legacy/home/sheet/character-girl.png — 3b5a25dbee739277f5b1645f76299ee6d1cefaf216f8dec43e5769a1cf8cc28b
- art/legacy/home/sheet/robot.png — 073e84bc08ee860ecfaec2b08282d1025c2fda84ab66eda3664c30a3c72a4cca

Lista completa de trece recursos web, diez fuentes y derivados con dimensiones/alfa/SHA: [manifiesto original](ASSET_MANIFEST.json). Lista de nueve retirados y destino: [LEGACY_CP01.json](LEGACY_CP01.json). Los cinco recortes ornamentales derivados del atlas no se activan por la advertencia de halos. No se ha pulido, regenerado o retocado ningún original.

## QA comprobado antes del PR

- TypeScript PASS, suite completa 93 PASS / 0 fallos / 0 omitidas, build y guard audio PASS.
- Guard CP01: 28 hashes, manifiesto original inmutable, 13 recursos web exactos, nueve históricos archivados, dist sin fuentes PNG/referencias aplanadas (excepto logo PNG canónico permitido), paths antiguos ni contenidos editorial/semantic privados. Pruebas negativas conservadas y ampliadas con fuga semantic y referencia aplanada renombrada.
- Chromium: 54 vistas / seis recorridos / 18 comparaciones en 320×740, 390×844, 844×390, 768×1024, 1366×900 y 1920×1080. D-049: igualdad exacta de píxeles salvo área del logo autorizado, sin cambio de geometría al excluirlo. Opción C: geometría de escena/personajes/logo/textos/CTA igual; se verifica el nuevo arte por SHA y carga. B02: contenedor/acciones/sidebar estables, recorte CSS de torso y robot central. Comparación a DPR 2; recorrido normal a DPR 1.
- QA de acceso heredado: 48 vistas / seis recorridos PASS, sin overflow horizontal ni errores JS/HTTP o solicitudes de autenticación.
- Smoke B02 real: diez preguntas, navegación de menús, fullscreen, Arena y regreso, PC/390/320 PASS. Audio release PC/390/320 PASS (SFX y L7/C, reloj, preferencias). No se modifica audio, Arena, 42 SVG, motor o banco.
- Los primeros procesos de QA de acceso/audio se iniciaron durante la preparación de dependencias y no encontraron Playwright; se repitieron después de completarla, ambos PASS. No se modificaron dependencias versionadas ni se saltaron checks.
- Preview local compilada comprobada: http://localhost:4201/#welcome, #lobby-transition, #home. Reinicio: npm run preview -- --port 4201 --strictPort. Se evita copiar los fixtures privados QA de audio al worktree limpio.

## Publicación y continuidad

PR dirigido exclusivamente a staging. Exigir seis checks completos del HEAD, sin conflictos y respetando protecciones, antes de merge. Después: Render DEV LIVE y release.json del merge SHA, smoke HTTPS y hashes. Datos definitivos se registran en el cierre del PR, sin presumir publicación por el commit local. URL fija: https://semantropic-trivia-dev.onrender.com/#welcome ; transición #lobby-transition y lobby #home.

Producción preservada en main 522b038caaa98cab1a0ff733b6beed8a1584d63d, https://semantropic-trivia-next-web.onrender.com/ . No nuevos servicios/previews, force push, limpieza destructiva ni cambios ajenos. Ninguna cuenta, backend, correo o sesión real; C4 permanece solo propuesta.

Identidad: reutilizar los archivos CP01 y sus IDs canónicos. No reinterpretar/generar personajes o logo sin nueva orden. Los cambios expresamente autorizados CP01 sustituyen la obligación anterior de usar el logo PNG v1 y los WebP C2; el historial anterior permanece como evidencia.

Móvil EMULADO; no se afirma prueba física. Director revisa el montaje en DEV antes de aprobar arte final o producción. Próximo chat: leer este informe y el cierre del PR, verificar staging/Render y conservar el mismo enlace. No iniciar otro bloque.

## Capturas

Comparativas y resultado de QA en CP01-capturas; capturas completas a DPR 2 en artifacts/art-cp01 y artifact CI. Las referencias suministradas solo viven en docs/design/B04/references, nunca se montan como pantallas.

Galería B02 histórica comprobada adicionalmente en Vite: PC 1366, móvil 390 y 320 PASS, 23 tarjetas, 31 imágenes cargadas, tres placeholders de archivo histórico, cero errores/overflow. Los scripts de inspección histórica de logo se migraron a resolución/SHA/alfa CP01 sin eliminar comprobaciones de identidad.
