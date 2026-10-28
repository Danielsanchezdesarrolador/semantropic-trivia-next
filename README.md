# SEMANTROPIC TRIVIA 1.0 — Fundación B01

**Estado:** starter técnico; NO juego jugable ni despliegue confirmado. Fuente de autoridad: `AGENTS.md`, `docs/01_VISION.md` a `docs/06_DECISIONES.md` y decisiones posteriores del Director.

## Objetivo
Preparar un frontend móvil/desktop para pruebas en PC y teléfono; el único componente de UI es un tablero técnico neutro. Phaser 4.2.1 se instala como dependencia, pero no se usa aún. No hay backend ni datos reales.

## Requisitos
Node 22.16+ (se incluye `.node-version`) y npm; GitHub nuevo del Director y un workspace Render confirmado.

```bash
npm install
npm run check
npm test
npm run build
npm run dev
```

La primera instalación generará `package-lock.json`: **guardarlo en GitHub** y sustituir posteriormente `npm install` por `npm ci` en CI/Render tras validarlo. No se incluye un lockfile fabricado sin resolución real de paquetes.

## GitHub (acción del Director si el conector no permite crear repos)
1. Crear `Danielsanchezdesarrolador/semantropic-trivia-next`, inicializando `main` con README si se usará el conector de archivos.
2. Incorporar archivos de este paquete sin sobrescribir ningún repo antiguo. Si hay conflictos de README, conservar el de este paquete tras revisión del diff.
3. Trabajar en rama `feat/b01-fundacion-web` para correcciones y PR; no fusionar sin pruebas/revisión.

## Render (solo con workspace previamente confirmado)
- Tipo: **Static Site**; nombre propuesto: `semantropic-trivia-next-web`.
- Repo: `https://github.com/Danielsanchezdesarrolador/semantropic-trivia-next`.
- Branch: `main`.
- Build Command: `npm install && npm run build`.
- Publish Directory: `dist`.
- Verificar URL y HTTP 200 realmente. `render.yaml` es referencia de configuración, no un despliegue.

## Límites
No mockups, identidad final, usuarios, inicio de sesión, bots, matchmaking, economía, juego real, backend, ranking o publicación móvil en B01. No declarar PASS a una prueba no ejecutada.
