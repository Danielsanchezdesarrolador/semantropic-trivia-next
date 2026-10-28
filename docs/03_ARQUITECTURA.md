# 03 — Arquitectura autorizada
**Fecha:** 2026-10-28 · **Estado:** objetivos arquitectónicos; solo web estática de B01 preparada.

## B01 (único alcance actual)
- **React + TypeScript + Vite** para un tablero de estado web y maquetación adaptable a PC/teléfono.
- **Phaser 4.2.1** declarado como dependencia exacta, sin inicializar Game, escenas ni Canvas.
- **Render Static Site** propuesto para servir el `dist/` generado por Vite desde rama `main`.
- **GitHub Actions** verifica tipo, pruebas estructurales y compilación.
- Sin secrets, tokens, API, usuarios, registro, partidas, WebSockets ni métricas simuladas.

## Después de B01 (no ejecutar ahora)
- B03: cliente de partidas trivia locales, separación de estado/presentación/contratos.
- B04: backend Node.js + TypeScript y PostgreSQL para persistencia.
- B05–B07: servidor autoritativo para emparejamiento, preguntas, tiempos, puntuación, clasificación y seguridad.
- B09: Capacitor Android/iOS tras validar experiencia web móvil; compilación iOS exige macOS/Xcode.

## Límites de confianza
El cliente no decide preguntas y respuestas de partidas competitivas, ganadores, MMR, recompensas o tiempos autoritativos. Datos sensibles nunca en bundle frontend.

## Despliegue
GitHub repo nuevo `Danielsanchezdesarrolador/semantropic-trivia-next` → `main` → Render Static Site. Build `npm install && npm run build`, publicación `dist`. La configuración en `render.yaml` **no crea ni demuestra un deploy**; requiere confirmación del workspace y publicación verificable.

Se fija la versión Node de trabajo `22.16.0` como configuración propuesta de B01 y sujeta a revisión si CI revela incompatibilidades. El director aprueba cambios de arquitectura de alcance.
