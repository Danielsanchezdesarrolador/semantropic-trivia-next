# B03-C1 — Núcleo de práctica local

29-10-2026. Implementado y aprobado por el Director para continuar en B03-C4
(D-030). Integración y publicación pendientes; rama `feat/b03-c1-nucleo-local`.

## Contrato y comportamiento

`src/game/local/contracts.ts` declara seis categorías oficiales, alternativas
A/B/C/D, preguntas con cuatro opciones, resultados por pregunta y por ronda.
Las soluciones están limitadas al contrato LocalPracticeQuestion; el contrato
de presentación Question las omite. No es un límite de seguridad competitivo.

`exampleQuestions.ts` contiene diez ejemplos de orden fijo, cuatro alternativas
y una solución con explicación. Distribución: Geografía 2, Ciencias 2, Historia 2,
Arte y cultura 2, Deportes 1, Entretenimiento 1. La edición comercial del banco
de preguntas sigue pendiente; no se agregan preguntas ni aleatoriedad en C4.

`round.ts` valida diez IDs únicos y las opciones; crea una copia inmutable,
expone pregunta actual con categoría, registra una respuesta, exige avance
explícito y finaliza tras diez resoluciones. Un acierto suma un punto; un error
cero. Duplicados, selecciones inválidas y envíos de otra pregunta son inocuos.
Cada inicio crea una ronda independiente. No depende de DOM, React o red.

C3 añade agotamiento explícito mediante `alternativeId: null`, cero puntos y
error; C2/C3/HF1 reutilizan el motor sin cambiar la identidad visual. El tiempo
se maneja en `timedRound.ts`, separado del núcleo determinista.

## Verificación y límites

Nueve tests B03-C1 ejecutan el código TypeScript real: categorías compatibles
con categoryThemes, inicio, acierto/error, bloqueo, avance, cierre 0/6/10 aciertos,
validación del banco, independencia y protección frente a mutaciones.
La suite vigente acumulada tras C3/HF1 suma 65 tests; los nueve están incluidos.

Solo práctica local, sin persistencia, usuarios, ranking ni validación de servidor.
Las soluciones y puntuación del cliente nunca se reutilizan como autoridad
competitiva. Cierre y evidencia: `B03_C4_CIERRE_LOCAL.md`.
