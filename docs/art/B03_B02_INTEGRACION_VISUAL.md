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

## B03-B02-HF1 — Pulido visual solicitado (28-10-2026)

El Director aprobó el concepto de pantalla de preguntas minimalista, pero observó desplazamientos leves en la integración real. Autorizó este microbloque para corregir SOLO layout, alineaciones y espaciados.

- Cabecera: icono, categoría y marcador distribuidos sobre áreas correspondientes del SVG original, sin superposición.
- Pregunta: kicker y texto centrados ópticamente con saltos de línea más armónicos.
- Respuestas: letras posicionadas respecto del chip del SVG (centro x≈12,35 %, y≈45,6 %), textos con márgenes idénticos y feedback separado.
- Progreso: diez columnas de igual ancho, centradas por una única rejilla.
- Cristales laterales: menor tamaño y opacidad en los bordes.
- Barra inferior de inspección: espaciados equilibrados y compactos.
- Responsive PC/móvil, mismas seis categorías y estados visuales; ningún asset original reemplazado.
- QA Chromium reforzado con comprobaciones de coordenadas y capturas Arte y cultura a 1366 / 390 / 320 px.
- **Protección:** solo integrar en rama de laboratorio B03 y Render de pruebas; la portada oficial y `main` permanecen intactos. La aprobación artística final corresponde al Director.

## B03-B02-HF2 — Ajuste de precisión de cabecera

El Director mostró una nueva captura en la que la barra superior aún presenta desalineación: el icono queda a la izquierda del círculo y «3 / 10» se aproxima al borde derecho. Se ejecuta HF2 exclusivamente sobre la cabecera.

Diagnóstico: la barra SVG aprobada mide 1200×180 unidades, con círculo izquierdo centrado en (86,81) y cápsula del contador entre x=940..1165 e y=22..141. La rejilla aproximada de HF1 no coincide exactamente con esos puntos.

Corrección: la barra original queda intacta; su icono se superpone en (7,166667%,45%) y el contador en el centro de la cápsula (87,7083%,45,2778%), utilizando posicionamiento porcentual relativo al SVG. El título ocupa el espacio intermedio sin invadir las zonas laterales. Responsive PC, tablet y celular; los demás assets, la distribución de preguntas y las cuatro respuestas siguen idénticos.

QA: medición de centro de pictograma y contador contra las coordenadas fuente (tolerancia 1,6 px) en Chromium escritorio y móviles, comprobación de no superposición título/pictograma/contador y capturas recortadas de la cabecera. Aplicar exclusivamente al laboratorio B03 y presentar al Director para aprobación visual.

## Publicación oficial B03-B02 — Aprobación del Director
Tras aprobar expresamente el hotfix HF2 (icono, barra y contador), el Director autorizó publicar la Arena en el juego oficial.

**Integración de bajo riesgo:** el inicio B02 mantiene sus dos botones principales y la estética aprobada; se añade una entrada accesible «Arena del Conocimiento» que navega por hash `#arena`. React reutiliza el mismo `QuizPreview` con propiedad `official`: muestra las seis categorías y los assets aprobados, permite salir y volver, oculta los controles inferiores de inspección y deja claro que la pregunta es una demostración. La vista de laboratorio `b03-preview.html` continúa con sus controles de QA.

**Fuera de alcance:** lógica de respuestas, temporizador en marcha, clasificación, puntos, backend, salas, jugadores falsos. B03-C, B04 y siguientes no iniciados.

**Verificación premerge:** TypeScript, node tests, compilación Vite (tres entradas), smoke Playwright de home+arena en 1366, 390 y 320, cambio de categorías, botón salir, recarga profunda `#arena`, historial Atrás/Adelante, SVG, no overflow ni errores. Posmerge: despliegue Render LIVE y smoke público real; revisión física adicional por el Director.
