# B04 — pausa segura y respaldo · 04/11/2026

**Estado: PAUSADO por orden expresa del Director. No continuar implementación, merge o despliegue hasta una nueva orden de reanudación.**

## Ramas y commits al pausar

- Rama de trabajo ART-CP01: feat/art-cp01-official.
- Último commit de implementación, ya confirmado en GitHub: abffb9c8213cf50d805d0d0ada39e9a0861d95b2 (80 archivos, fuentes oficiales y capturas incluidas).
- Rama activa de este worktree para el respaldo: backup/b04-art-cp01-pausa-20261104. Parte exactamente de abffb9c; solo añade este checkpoint, evidencia y ZIP originales. El SHA del commit que contiene el checkpoint se verifica con `git log -1 --format=%H -- docs/checkpoints/B04_PAUSA_SEGURA_20261104.md` y se entrega al Director tras el push.
- Worktree propio: /tmp/semantropic-art-cp01. Sin cambios de implementación sin confirmar antes del respaldo.
- Raíz compartida: /workspaces/semantropic-trivia-next; rama feat/b04-c1-portal-social; HEAD 7660b4015a12fb583c3b199e478ebf2198a76e28. Tiene trabajo ajeno sin confirmar, que no se toca ni incorpora al respaldo B04.
- PR #23: https://github.com/Danielsanchezdesarrolador/semantropic-trivia-next/pull/23 ; destino staging, ABIERTO EN BORRADOR por la pausa, autoMergeRequest=null. No fusionado.

## Trabajo terminado y respaldado en la implementación

CP01 se localizó y verificó con CRC, rutas seguras, 31 sumas y 28 dimensiones/alfa/SHA. Diez fuentes PNG nuevas, cinco recortes derivados y trece recursos web. Fuentes y documentos originales están versionados sin alterar en art/official/masters, public/assets/official, docs/design/B04/references y docs/art. Los tres IDs de identidad se conservan; el registro enlaza los nuevos binarios y su procedencia.

Logo activo en el código pendiente de integración: public/assets/official/brand/semantropic-trivia-logo-1_0-v2.png (1536×1024), SHA 6b01ec51cfb357d588b53e3cae6669ec605cad1d43b1bb76c4d03dd5f927ee8f. Es el original nuevo con 1.0, no remuestreo de v1. Se usa en B04 y B02; D-049 conserva estructura, textos, botones y fondo. El marco conserva proporción y object-fit contain.

Lobby: implementado encuadre de torso/medio cuerpo por ventanas CSS, protagonistas más grandes y robot central. No se recortaron ni sobrescribieron PNG. La geometría de contenedor, botones y sidebar está conservada. Opción C usa nuevos fondos por breakpoint con portal ya incluido, personajes separados y CTA HTML a #home; sin composición aplanada ni segundo portal.

Nueve archivos históricos se archivaron en art/legacy y retiraron de public en la rama propia después de migrar consumidores/pruebas. Sus SHA originales permanecen verificables; no se eliminó la historia ni se alteraron los ZIP. La galería conserva 23 tarjetas y muestra tres archivos retirados sin pedir imágenes obsoletas. No activar ornamentos recortados ni portal independiente; pendientes de revisión específica si se desean usar.

Sin cambios en App.tsx, audio, Arena, 42 SVG, motor, banco, dependencias versionadas ni Q03/Q04. No cuentas, sesiones, backend o correo reales. El montaje continúa pendiente de aprobación visual final.

## Pruebas y CI al pausar

- Local: TypeScript PASS; 93 tests PASS, 0 fallos/omitidas; build PASS; guard audio y guard editorial/semantic/assets PASS.
- Chromium local: 54 vistas, seis recorridos y 18 comparaciones en seis tamaños (320×740, 390×844, 844×390, 768×1024, 1366×900, 1920×1080). D-049 idéntico fuera del logo autorizado. Opción C conserva geometría y textos/CTA. Otros 48 casos de acceso PASS.
- Lobby: diez preguntas, menús, fullscreen, Arena/retorno PASS en PC/390/320. Audio público del build PASS en esos tres tamaños. Galería histórica PASS. Móvil EMULADO, no físico.
- Capturas seleccionadas, JSON y hashes antes/después están en docs/art/CP01-capturas y docs/art/ART_CP01_ENTREGA.md; logs se conservan en evidence/20261104-art-cp01.
- CI NO COMPLETA: cinco check-runs SUCCESS en abffb9c, pero el workflow official-home no pudo crearse correctamente. Run FALLIDO de archivo YAML: https://github.com/Danielsanchezdesarrolador/semantropic-trivia-next/actions/runs/41904454036 . Snapshot completo en actions-snapshot.json y pr23-status.json.
- Causa confirmada por parser YAML: .github/workflows/b02-official-premerge.yml, línea 49, columna 32, `mapping values are not allowed here`. El `name` contiene `Acceso y ART-CP01: navegación, canon y regresión visual protegida` sin comillas. Codex añadió ese nombre; requiere corregirlo al REANUDAR, no durante esta pausa.
- Corrección pendiente exacta: poner entre comillas el valor completo del name. No quitar ni saltar el workflow, tests o aserciones. Después validar YAML y volver a ejecutar CI completa. No considerar suficientes los cinco checks visibles: deben aparecer y aprobarse los seis previstos, incluido official-home.

## Estado de publicación preservado

- NO se ha integrado ART-CP01 en staging. NO se ha publicado ART-CP01 en DEV.
- staging conserva ac216f009c7cdd88b558c14e7625e2f347bf0eb8 (B04-C3, merge #22).
- Render DEV: https://semantropic-trivia-dev.onrender.com/ ; último deploy comprobado dep-dblno0g473hc73bopg80, LIVE de ac216f0. Conserva la versión anterior, incluido su logo anterior. No se dispara otro deploy para respaldar.
- main y Render oficial conservan 522b038caaa98cab1a0ff733b6beed8a1584d63d, https://semantropic-trivia-next-web.onrender.com/ . No se modifica producción.
- Los servidores locales propios de B04 han sido detenidos mediante SIGTERM selectivo. No se detuvieron procesos editoriales ajenos. Preview anterior 4201 no se declara disponible tras la pausa; puede reiniciarse solo al reanudar.

## ZIP originales preservados y copia remota de respaldo

Los originales siguen en la raíz compartida, intactos. Se añaden copias byte a byte bajo backups/B04 únicamente en la rama de respaldo, nunca public/dist ni staging. Ninguno supera el límite individual de GitHub de 100 MB; no hace falta omitirlos ni depender del disco local.

| ZIP | Bytes | SHA-256 |
|---|---:|---|
| B04_DISENOS_APROBADOS.zip | 10699879 | aa4c69995670b03994affc7ac93b080888e576ba8ff0c22137ed434ca3539c71 |
| SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip | 43201624 | 5cb9ddc146274dc96c582be85f47e870124464ace1b2cfdd2a0694329e9eb63f |
| SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip | 29264269 | bbb5c7b8cf0f5e5cbc0e02f05721bc815bbdb3f9679caf95fa7b3a711c4d0b4a |

Comprobar con `cd backups/B04 && sha256sum -c SHA256SUMS.txt`. BACKUP_MANIFEST.json conserva rutas originales y de copia. La verificación remota debe contrastar origin/backup/b04-art-cp01-pausa-20261104 con el HEAD local y confirmar la presencia de cada blob. La rama de respaldo no coincide con los filtros de push de CI ni con las ramas de Render; no se abre PR para ella.

## Archivos sin confirmar y separación editorial

Antes de crear el checkpoint, el worktree ART-CP01 estaba limpio. Este commit de respaldo solo añade ZIP B04, checkpoint y evidencia propia. No se incluyen contenidos editoriales, credenciales ni cambios ajenos.

La raíz tiene 79 rutas pendientes: 7 modificadas y 72 sin seguimiento. Tres de esas rutas sin seguimiento son los ZIP B04 que se copian al respaldo remoto; el resto conserva su estado local. El inventario siguiente enumera solo rutas/estados, NO copia contenidos de Q03/Q04.

**Q03/Q04 y demás cambios ajenos permanecen locales, sin confirmar en este bloque y SIN respaldo remoto verificado por esta operación. No confundir conservación local con respaldo remoto. No eliminar ni reconstruir el Codespace hasta asegurar esos datos por su propio flujo autorizado.**

```text
 M AGENTS.md
 M docs/02_ROADMAP.md
 M docs/06_DECISIONES.md
 M package.json
 M src/ui/quiz/QuizPreview.tsx
 M src/ui/quiz/useLocalPractice.ts
 M vite.config.ts
?? B04_DISENOS_APROBADOS.zip
?? SEMANTROPIC_Q03_CE01_AUDITORIA_INDEPENDIENTE_20261103.zip
?? SEMANTROPIC_TRIVIA_1_0_BIBLIOTECA_OFICIAL_CP01_20261104.zip
?? SEMANTROPIC_TRIVIA_B04_CODEX_OPCION_C_IMPLEMENTACION_20261104.zip
?? SEMANTROPIC_TRIVIA_Q03_1B_AUDITORIA_INDEPENDIENTE_2026-10-30.md
?? SEMANTROPIC_TRIVIA_Q03_1B_RESULTADO.zip
?? SEMANTROPIC_TRIVIA_Q03_1C_RESULTADO.zip
?? SEMANTROPIC_TRIVIA_Q03_1D_RESULTADO.zip
?? SEMANTROPIC_TRIVIA_Q03_ENTREGA_MASIVA_2026-10-29.zip
?? docs/Q04_M1_MOTOR_B.md
?? docs/Q04_M2_MOTOR_C.md
?? docs/Q04_M3_VALIDADOR_SEMANTICO.md
?? docs/Q04_M4_ADAPTADOR_EDITORIAL.md
?? docs/editorial/Q03_2B_2C_REVISION_LOCAL.md
?? docs/editorial/Q03_CE01_CONTINUIDAD_AUDITORIA_20261103.md
?? docs/editorial/Q03_CIERRE_1250.md
?? docs/editorial/Q03_CONSOLIDACION_EDITORIAL.md
?? docs/editorial/Q03_PRODUCCION_DEV_1250.md
?? docs/editorial/Q03_REANUDACION_20261103.md
?? package-lock.json
?? scripts/editorial/experimental-dev-plugin.d.mts
?? scripts/editorial/experimental-dev-plugin.mjs
?? scripts/editorial/guard-production.mjs
?? scripts/editorial/review-dev-plugin.d.mts
?? scripts/editorial/review-dev-plugin.mjs
?? scripts/editorial/review-gate.mjs
?? scripts/q04-editorial/adapter.mjs
?? scripts/q04-editorial/browser-qa.mjs
?? scripts/q04-editorial/dev-plugin.d.mts
?? scripts/q04-editorial/dev-plugin.mjs
?? scripts/q04-editorial/fixtures.mjs
?? scripts/q04-editorial/report.mjs
?? scripts/q04-editorial/selection.mjs
?? scripts/q04-editorial/source.mjs
?? scripts/q04-editorial/taxonomy.mjs
?? scripts/q04-m1-browser-qa.mjs
?? scripts/q04-m1-guard.mjs
?? scripts/q04-m2-browser-qa.mjs
?? scripts/semantic/arena-regression.mjs
?? scripts/semantic/fixtures.mjs
?? scripts/semantic/guard-private.mjs
?? scripts/semantic/load-engine.mjs
?? scripts/semantic/measure.mjs
?? scripts/semantic/run.mjs
?? src/editorial/devReviewSource.ts
?? src/editorial/q04/contracts.ts
?? src/editorial/q04/virtual.d.ts
?? src/editorial/virtual-review.d.ts
?? src/game/selection/balanceContracts.ts
?? src/game/selection/contracts.ts
?? src/game/selection/dev/syntheticCatalog.ts
?? src/game/selection/dev/syntheticMetadataCatalog.ts
?? src/game/selection/history.ts
?? src/game/selection/practice.ts
?? src/game/selection/selectBalanced.ts
?? src/game/selection/selectWithHistory.ts
?? src/game/selection/storage.ts
?? src/game/selection/taxonomy.ts
?? src/semantic/canonical.ts
?? src/semantic/contracts.ts
?? src/semantic/export.ts
?? src/semantic/normalize.ts
?? src/semantic/review.ts
?? src/semantic/validator.ts
?? src/ui/quiz/practiceSource.ts
?? tests/q03-experimental-dev.test.mjs
?? tests/q03-review-gate.test.mjs
?? tests/q04-m1-memory.test.mjs
?? tests/q04-m2-balance.test.mjs
?? tests/q04-m3-semantic.test.mjs
?? tests/q04-m4-editorial.test.mjs
?? transferencia-editorial/SEMANTROPIC_TRANSFERENCIA_CODESPACES.zip
```

La orden de pausa no autoriza a mezclar ni publicar los cambios editoriales. Se comprueban hashes locales antes/después para asegurar que esta operación no los altere; los contenidos privados no se añaden a GitHub.

## Instrucciones exactas para continuar

1. Esperar una nueva orden explícita de reanudación. Leer este checkpoint y docs/art/ART_CP01_ENTREGA.md. Comprobar PR #23 y los remotos; no suponer CI aprobada ni publicación CP01.
2. Desde la raíz compartida, consultar el respaldo SIN cambiar su rama sucia:

```bash
git fetch origin backup/b04-art-cp01-pausa-20261104 feat/art-cp01-official staging
git show origin/backup/b04-art-cp01-pausa-20261104:docs/checkpoints/B04_PAUSA_SEGURA_20261104.md
git worktree add -b resume/art-cp01-20261104 ../semantropic-art-cp01-resume origin/feat/art-cp01-official
cd ../semantropic-art-cp01-resume
```

Si el directorio o rama resume ya existen, inspeccionarlos y elegir un nombre libre, nunca borrarlos ni resetearlos. El nuevo worktree parte de la implementación abffb9c, SIN los ZIP extras de respaldo. No fusionar la rama backup en staging/main ni usarla como rama del producto.

3. Corregir únicamente el name YAML pendiente, con comillas. Mantener el resto de CI y toda la implementación de arte para revisión. Instalar dependencias en ese worktree y repetir TypeScript, suite, build, guards y QA exigido. Registrar commit y hacer push normal (sin force) a la rama del PR existente: `git push origin HEAD:feat/art-cp01-official`.
4. Al reanudar se puede sacar PR #23 de borrador, comprobar seis checks completos, conflictos y protecciones. Solo después de cumplirlos y bajo la autorización de reanudación integrar a staging, nunca main.
5. Confirmar Render DEV LIVE del nuevo merge, release.json, fuentes/PNG/logo por SHA y smoke HTTPS de todas las rutas. La caché de Render puede servir la versión anterior brevemente; no afirmar publicación por el estado LIVE solamente. Entregar capturas móvil/escritorio y enlace fijo al Director; mantener pendiente aprobación artística final.
6. Si hace falta recuperar ZIP, crear otro worktree desde origin/backup/b04-art-cp01-pausa-20261104 y copiar únicamente el ZIP deseado a un lugar seguro. Verificar SHA256SUMS. Los PNG fuente/referencias exactos ya están también en la rama de implementación, no hace falta regenerar nada.

## Mensaje exacto de reanudación

> Reanuda ART-CP01 desde el respaldo `backup/b04-art-cp01-pausa-20261104`. Lee `docs/checkpoints/B04_PAUSA_SEGURA_20261104.md`; conserva Q03/Q04 y la raíz sin confirmar. Corrige primero el error YAML de la línea 49 del workflow official-home, retoma el PR #23 desde `feat/art-cp01-official` y verifica todos los checks. Solo con CI completa en verde continúa hacia staging y el mismo Render DEV; no main ni producción. No rediseñes los originales ni inicies otro bloque.

No se inicia ninguna implementación después de asegurar este respaldo.
