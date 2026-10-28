# 04 — Matchmaking y rival IA (requisito futuro; no implementado)
**Fecha:** 2026-10-28 · **Estado:** norma de producto aprobada; B05 posterior.

## Casual 1v1
Buscar humanos reales primero. Tras un tiempo de espera configurable por servidor, presentar una elección explícita: «Jugar ahora contra Rival IA» o «Seguir buscando una persona». No introducir IA silenciosamente.

## Clasificatoria
Solo humanos. Nunca otorgar MMR por CPU, rellenar partidas ni presentar perfiles artificiales como jugadores.

## Integridad de datos
Contratos futuros con `opponentType: human | bot`, `matchType: casual | ranked | private` y consentimiento trazable. Una IA puede tener dificultad y reacciones variadas siempre que su etiqueta sea visible antes, durante y después. No inventar concurrencia, testimonios, chat de personas o rankings.

**B01 no desarrolla bots, matchmaking ni backend.**
