# SEMANTROPIC TRIVIA 1.0 — Biblioteca oficial de arte ART-CP01

**Fecha:** 04/11/2026. **Aprobación del Director:** estos 10 adjuntos reemplazan las referencias antiguas de B04. **Estado de GitHub:** paquete preparado, repositorio no actualizado por este trabajo.

## Fuentes verificadas

Los **10 PNG adjuntos** están preservados byte por byte en sus rutas de `art/official/masters` o `docs/design/B04/references`. Ningún personaje ha sido regenerado ni reinterpretado. El logo nuevo es el de **SEMANTROPIC TRIVIA 1.0** de los adjuntos, **no** una ampliación del PNG histórico. Sus originales se encuentran en `/art/official/masters/` y sus versiones de navegador en `/public/assets/official/`.

## Fuentes únicas de identidad

- Logo: `public/assets/official/brand/semantropic-trivia-logo-1_0-v2.png` (exacto al original nuevo). El anterior `semantropic-trivia-logo-v1.png` queda **obsoleto en el juego activo** después de una migración segura; conservar historial Git.
- Protagonista masculino: `public/assets/official/characters/protagonist-male-v1.webp` y PNG en masters.
- Protagonista femenino: `public/assets/official/characters/protagonist-female-v1.webp` y PNG en masters.
- Robot: `public/assets/official/characters/mascot-robot-v1.webp` y PNG en masters.
- Escenarios: `lobby-option-c-desktop-v2.webp` y `lobby-option-c-mobile-v2.webp`, ambos **contienen el portal dentro del fondo**. No duplicarlo.
- Portal independiente `portal-option-c-standalone-v1.webp`: usar solamente sobre un fondo **sin portal**.
- Ornamentos: el atlas original se ha preservado; cinco recortes independientes basados en sus regiones con alfa verdadero están en `public/assets/official/ornaments/`. Inspeccionar halos antes de incrustarlos.
- Las dos composiciones aprobadas, con textos/botones pintados, se guardan en `docs/design/B04/references/` **solo como maquetas, nunca como imagen runtime**.

## Regla de borrado

Se retiran del **registro activo** y de los componentes los recortes legacy (`character-boy.png`, `character-girl.png`, `robot.png`) y el logo v1 tras actualizar los consumidores. Eliminar archivos antiguos del árbol `public/` solamente si `rg` y CI confirman que no tienen referencias en el juego, pruebas o galerías históricas necesarias. No ejecutar `git clean`, `git reset --hard` ni borrar la banca editorial Q03/Q04, audio, la Arena o recursos B03. Conservar Git history o rama/etiqueta de respaldo; si algún antiguo sigue requerido por herramientas históricas, aislarlo como legacy sin uso runtime y documentar el bloqueo.

## Diseño y flujo

D-049 `#welcome`: mantener fondo, portal y botones; cambiar **solo el logo**, ahora 1.0. `#lobby-transition`: reutilizar personajes y fondos oficiales; los textos y el botón deben ser React/CSS interactivos. `#home`: encuadrar personajes más grandes de torso/medio cuerpo por CSS, sin recortar archivos maestros. Registro, login, recuperar contraseña siguen como prototipos hasta backend real. La adaptación desktop/móvil usa fondos separados, no un recorte de escritorio.

## Control de calidad

Comprobar SHA-256 contra `ASSET_MANIFEST.json`, alfa, dimensiones, no duplicación de logo/portal, carga HTTP de recursos, tamaño legible, accesibilidad, 320/390/768/1366/1920, sin overflow; build/test/guards/CI y smoke de Render DEV, `main` intacto. No publicar maestros PNG pesados ni composiciones en `public` salvo el logo PNG exacto.
