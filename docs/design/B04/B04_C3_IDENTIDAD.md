# Canon de personajes — B04-C3

Decisión del Director, 04/11/2026: tras probar Opción C en Android físico y web, aprueba su composición y los tres personajes. Esa prueba física es la declarada por el Director para C2; el QA de C3 es automatizado/emulado.

La autoridad de consumo es `src/ui/assets/assetRegistry.ts`, enlazada al módulo tipado `officialArtAssets.ts`. Usar `getOfficialAsset(id)`; no copiar rutas por componente. Los IDs permanentes son `protagonist-male-v1`, `protagonist-female-v1` y `mascot-robot-v1`. También se registran `lobby-option-c-desktop-v1` y `lobby-option-c-mobile-v1`. El portal `portal-option-c-v1` es una representación incrustada en esos fondos: no tiene asset renderizable independiente, ni debe duplicarse.

Cada recurso web registra rol, formato, dimensiones, transparencia, clasificación official/approved, aprobación/fecha, SHA real y procedencia. [Auditoría original inmutable](B04_C2_ASSETS.json). Los cinco WebP se reutilizan sin reexportación ni modificaciones. El logo continúa siendo el PNG canónico existente; no se usa la referencia distinta del ZIP.

| ID / representación | Resolución | Alfa | SHA-256 web |
|---|---|---|---|
| protagonist-male-v1 | 704×1100 | Sí | 38c8f594a33cae63cc7b84c3c98d7ddf5e1e8208923184a1b8b60c512b03e115 |
| protagonist-female-v1 | 653×1100 | Sí | e7562cbf1512c5a51cbdb7f2ca01446bb01c5689dc364601d742d35334c1d160 |
| mascot-robot-v1 | 1100×1044 | Sí | 0f739713da23a632589d6ffc6eb4e7aff89bbf90fe7f02b71b0d01aafecddc58 |
| lobby-option-c-desktop-v1 | 2560×1440 | No | 36e13c1af4a129c46d5090f9e4ec0b1b10f3fc1ddeec400c2296b470c8826d9c |
| lobby-option-c-mobile-v1 | 1080×1920 | No | b57d0c968ca95a7c0a6f5d7e71ebc39b0a1aacc6436e181f5d4a220c443c1db3 |

Logo canónico protegido: `public/assets/home/brand/semantropic-trivia-logo-v1.png`, SHA `1e404c4ea2e64d1629a80a247bcd6c66fc455bcbf7d2e1515e0d9a152aa8463b`.

## Regla de identidad para futuras pantallas

Prohibido reinterpretar, regenerar por IA, redibujar, cambiar vestuario, rostro, silueta, colores o identidad de estos tres personajes sin nueva aprobación expresa. Reutilizar sus archivos separados con proporción conservada, sin recortar caras/manos ni sustituirlos por CSS, placeholders o una captura completa. Ajustes de disposición que impliquen rediseñar una composición aprobada requieren revisión artística previa.

Los recortes `character-boy.png`, `character-girl.png`, `robot.png` permanecen físicamente y en el inventario histórico, clasificados legacy/provisional. No volver a promoverlos al juego. Las claves históricas pendientes de `artAssets` se conservan por trazabilidad y apuntan documentalmente al canon; no son los IDs nuevos.

B02 conserva estructura, botones, posiciones de contenedores y navegación. Solo cambia sus tres imágenes, alt/dimensiones intrínsecas y `object-fit:contain` para el encaje. C2 conserva exactamente sus fuentes resueltas, DOM de arte y CSS. D-049 solo ajusta el texto/destino del enlace de demostración a la transición; no cambia su arte ni sus CTA principales.

## Másteres: respaldo real y límites

Másteres PNG originales: no están versionados ni se publican. Copia local verificada fuera del repositorio: `/workspaces/semantropic-trivia-art-backups/B04-C2-20261104/`, directorio 0700, archivos 0600 y receipt.json con hashes/tamaños. No sobrescribe copias diferentes. Es un respaldo en el mismo workspace, no una copia externa ni garantía de persistencia ante pérdida del Codespace. El Director conserva el ZIP fuente; queda pendiente su archivo externo permanente bajo su control.

| Máster nativo | SHA-256 |
|---|---|
| protagonist-male-v1-master-native.png | 3cd2cb5294303a601bc86eb12017593ef6158eaf23db1433e8ea15caca89c26d |
| protagonist-female-v1-master-native.png | 9149b4fd9c2aaed23126d0118bb398d3cbc9db0e61c7e74986144b177d41cbeb |
| mascot-robot-v1-master-native.png | 987731078e789257e5bc6a40cc383d830da88bf8b065456a3005eb5ee82d09fa |
