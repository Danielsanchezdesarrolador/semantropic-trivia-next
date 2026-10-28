# SEMANTROPIC TRIVIA · B02-C2 — Primera composición de home
Fecha: 2026-10-28 · Estado: **preview técnica candidata, pendiente revisión visual del Director**.

## Alcance autorizado
Componer en React una pantalla inicial basada en el mockup de SEMANTROPIC POP — Fantasía Social, reutilizando la arquitectura B02-C1; generar ilustraciones independientes. NO integrar en main ni desplegar a Render, ni comenzar gameplay.

## Qué se creó
- Nueve recursos gráficos **SVG originales separados**, en public/assets/home/:
  - environment/plaza-day.svg (plaza cálida, edificios, cascadas y pavimento);
  - environment/sky-night.svg (noche, estrellas y planeta con anillo);
  - environment/islands.svg (islas y torres);
  - brand/logo.svg (logotipo provisional con cristales);
  - characters/left-hero.svg y right-hero.svg (figuras gráficas provisionales; no identidad/personajes oficiales);
  - characters/robot.svg (mascota visual provisional, no rival CPU);
  - decorations/crystal-cyan.svg y crystal-warm.svg (ornamentos).
- Composición responsive React/TSX en src/ui/home/HomePreview.tsx y CSS exclusivo.
- Página aislada b02-preview.html, sin sustituir index.html: B01 permanece funcional.
- Previsualización accesible en **entorno de rama local** con npm run dev y ruta /b02-preview.html; NO es URL publicada en producción.
- Tests de integridad, de no-simulación de jugabilidad, de aislamiento y workflow Chrome escritorio/móvil emulado.

## Status artístico
Los nueve SVG son **CANDIDATOS de estudio**. NINGUNO es arte definitivo aprobado todavía. La imagen aprobada sigue siendo el objetivo de fidelidad; la propuesta vectorial puede requerir reemplazos por pinturas/ilustraciones premium exportadas por separado si no alcanza esa referencia.
No insertar ni usar la captura completa como fondo. No reutilizar los SVG individuales como personajes comerciales sin decisión expresa.

## UX y contenido
Las dos CTA visuales son JUGAR ONLINE y JUGAR CON AMIGOS, deshabilitadas, con leyenda “en desarrollo”. Online contempla normal y clasificatoria 1v1 humanas; familiares contemplan 1v1/2v2/3v3/FFA. No hay bots, backend, cuentas, monedas, tienda ni jugadores falsos.
La navegación restante es solo representación ornamental, no botones falsos operativos. Paneles inferiores describen pilares sociales, en vez de pase de temporada/monetización no aprobados.

## Evidencia y gates
1. npm install, typecheck, npm test, npm run build en CI GitHub.
2. Chrome real en GitHub Actions a tamaño desktop, móvil 390, móvil 320; probar errores JS, rotura horizontal, nueve imágenes y dos botones deshabilitados. Capturas como artefacto del workflow.
3. Verificar commit de main igual al anterior y Render sin nuevo despliegue.
4. Director compara capturas con referencia **antes** de aprobar integración futura.
5. No considerar B02-C2 aprobado solo por build PASS.

## Relación con PRs
PR #3 = B02-C1, draft hacia main.
PR B02-C2 = rama derivada de B02-C1, base B02-C1 para revisar diff limpio. Ambos permanecen sin fusionar hasta orden del Director.
