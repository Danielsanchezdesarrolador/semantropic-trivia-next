# SEMANTROPIC TRIVIA 1.0 — B02-C2 — Integración de la lámina de assets

## Autorización
El Director solicitó implementar y observar en el juego los recursos aislados extraídos de la lámina de 1536×1024. Esta tarea **no autoriza pasar a mecánicas posteriores** ni fusionar directamente a `main`.

## Estrategia
- La pantalla `b02-preview.html` mantiene la ilustración panorámica **ya aprobada** como fondo.
- Encima se componen individualmente el **logo extraído de la lámina**, los **dos personajes**, **robot**, **cristales**, **vegetación**, **linterna**, **bandera** y los dos botones de modos autorizados, todos como imágenes independientes. El logo de la lámina es una **alternativa candidata** al PNG anterior, no un reemplazo final aprobado.
- La galería inferior muestra todos los recortes gráficos incluidos en esta integración, con estado de candidato o referencia, y la paleta oficial propuesta de nueve muestras CSS.
- Los botones de Torneo CPU y Ranked, más los paneles inferiores con cifras impresas, **solo figuran en la galería de referencia**. Ningún botón habilita juego; no se inventan economías, perfiles ni rankings. Ranked es modalidad dentro de Online, no un botón separado.
- Las miniaturas de cielo/islas/mapa no son capas originales realmente editables. No se mezclan con el fondo aprobado.

## Calidad técnica y riesgos
- Los PNG proceden de una **lámina aplanada**, no de archivos fuente con transparencia genuina. Sus alfas fueron reconstruidas; personajes pueden presentar bordes y partes cortadas.
- Los recortes originales son de resolución reducida (personajes ~180px ancho; logo 235×161; botones ~145×105). La prueba no demuestra acabado premium final.
- Los textos de botones de referencia forman parte del PNG: no sirven como sistema de localización ni estados interactivos futuros.
- Se preserva un manifiesto SHA-256 de 23 imágenes reales; la paleta se representa con colores CSS, no con nueve PNG redundantes.

## Gate de verificación
- TypeScript PASS, pruebas Node PASS y Vite build PASS.
- Chromium desktop y móvil emulado: HTTP 200, sin errores JS, imágenes cargadas, ausencia de overflow horizontal.
- Capturas de PC y móvil guardadas como artefactos de GitHub Actions para revisión del Director.
- **No modificar Render de producción**. Se puede levantar Static Site de preview independiente en el mismo workspace autorizado si se permite crear sin modificar servicios existentes, sujeto a revisión y límites del plan.
- El Director evaluará los recortes visuales antes de aprobar su promoción a assets comerciales.
