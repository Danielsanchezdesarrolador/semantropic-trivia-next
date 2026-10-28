# 05 — QA y entregas: criterio de evidencia
**Fecha:** 2026-10-28 · **Estado:** protocolo de validación.

## Etiquetas de avance
`PROPUESTO → EN DESARROLLO → PR → FUSIONADO → DESPLEGADO → PROBADO → APROBADO`.
El estado se adjudica según evidencia real; no se salta etapas por intención.

## B01: pruebas mínimas
1. Repositorio nuevo independiente accesible y docs incluidas.
2. `npm install` sin fallos y, si se confirma disponibilidad, registrar versiones resueltas en lockfile.
3. `npm run check`, `npm test`, `npm run build` con salida real y código 0.
4. Workflow GitHub Actions PASS en commit/PR conocido.
5. Render: URL pública abierta; HTTP 200, contenido correcto, commit y fecha de deploy verificables.
6. Navegadores escritorio y móvil: ancho adaptativo, texto legible, ausencia de desbordamiento horizontal, consola sin errores.
7. Distinguir **Chromium automatizado/emulado** de **teléfono físico** y de **Safari real**.
8. Confirmar repositorios históricos intactos.

## Reporte obligatorio
Bloque, rama, commit SHA, PR, archivos modificados, pruebas PASS/FAIL/NOT_RUN, URLs solo verificadas, limitaciones y decisión del Director. No etiquetar un sitio como juego funcional.
