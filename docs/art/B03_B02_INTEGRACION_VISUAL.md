# SEMANTROPIC TRIVIA 1.0 · B03-B02 Integración visual de Arena del Conocimiento

**Fecha:** 28-10-2026. **Director:** usuario. **Estado:** implementación candidata en rama y preview; NO es un modo jugable.

## Mandato
El Director aprobó el mockup minimalista de B03-A y solicitó integrar los assets del paquete `SEMANTROPIC_TRIVIA_B03_B01_ASSETS_MINIMALISTAS.zip` en nuestro juego, sin desarrollar aún lógica B03-C ni modificar producción.

## Arte integrado
42 recursos **SVG vectoriales originales** procedentes exactamente de `SEMANTROPIC_TRIVIA_B03_B01_ASSETS_NUCLEO_V1` y con el mismo nombre que sus pares PNG. Se incorporan individualmente a `public/assets/quiz/b03-b01/`.
- 14 fondos por separado, para PC 16:9 y móvil 9:16; general y seis categorías (Geografía, Ciencias, Historia, Arte y cultura, Deportes y Entretenimiento).
- 6 barras y 6 pictogramas de categoría, en colores independientes.
- Un panel blanco central, 4 estados visuales de respuesta, 3 temporizadores, 3 segmentos de progreso, botón Volver, 2 indicadores de acierto/error y 2 cristales.
- Los PNG originales con hash/SHA están conservados en el ZIP proporcionado, pero la web utiliza **SVG para alta definición, bajo peso y transparencia**, sin duplicar archivos en el build.
- No se utiliza el mockup completo como fondo ni se pinta texto dentro de imágenes.

## Runtime aislado
- `b03-preview.html` → `src/b03-preview-main.tsx` → `src/ui/quiz/QuizPreview.tsx`.
- `src/ui/quiz/categoryThemes.ts` declara el color y recurso de cada categoría.
- `src/ui/quiz/quizAssets.ts` registra 42 recursos en el mismo esquema visual, sin dependencias de backend.
- `src/ui/quiz/quiz-preview.css` define PC, móvil, contraste, alineación y accesibilidad.
- Únicamente la preview puede cambiar categoría, estado de respuesta y anillo de reloj; **estos controles son QA visual**.
- Las cuatro alternativas son contenido demostrativo (Sídney, Melbourne, Canberra y Perth), no respuestas seleccionables. La pantalla afirma claramente «sin partida ni temporizador activo».
- El botón visual Salir NO está conectado a navegación ni partida. El enlace «Regresar al lobby oficial» es un enlace ordinario a `/`.

## Criterios de aceptación
1. `npm run check`, `npm test`, `npm run build` PASS.
2. Las 42 rutas SVG existen; ningún SVG incorpora texto estático ni pantallazo raster incrustado.
3. Chromiun 1366×900/390×844/320×740: 4 respuestas, 10 segmentos, 6 categorías, 3 estados de reloj inspeccionables, cambios de color y fondo sin desbordamiento horizontal ni errores JS.
4. Capturas revisadas por el Director antes de promover arte B03-B02 a producción.
5. `main` oficial y Render principal no se modifican. La preview B03 se mantiene en rama independiente; un Render de pruebas puede servir su `b03-preview.html` bajo la raíz de un laboratorio independiente.

## Pendiente
- Evaluación estética de los 42 elementos. El mockup B03-A es aprobado; integración y assets individuales permanecen **candidatos**, no definitivos.
- B03-C: preguntas y reloj reales, puntuación, validación y resultados. NO implementados en esta entrega.
- QA en Android/iOS físico depende del Director; emulación Chromium no equivale a hardware real.
