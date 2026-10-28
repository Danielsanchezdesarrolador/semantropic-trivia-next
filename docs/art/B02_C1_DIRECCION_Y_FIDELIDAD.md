# SEMANTROPIC TRIVIA · B02-C1 — Arquitectura artística y fidelidad
Fecha: 2026-10-28 · Estado: **mockup principal APROBADO / componentes BASE IMPLEMENTADOS / arte modular PENDIENTE**.

## Referencia visual protegida
- Dirección híbrida autorizada: **SEMANTROPIC POP — Fantasía Social** (Plaza de Ideas + Noche Galáctica).
- Mockup aprobado por el Director en esta conversación, imagen original de **1024 × 1536 px**.
- La ilustración completa es una **referencia de fidelidad**, NO una textura para pintar toda la interfaz ni una pantalla jugable.
- Debe preservarse la composición: arco día/noche, plaza luminosa, islas flotantes, cielo galáctico, logotipo central sobre cristales, protagonistas laterales, botones azul y coral como acciones principales, paneles de cristal con relieve, sombras y contraste controlado.
- No reducir a rectángulos genéricos ni perder la profundidad, los acabados cartoon premium y el equilibrio de saturación. La UI real siempre debe ser React/DOM accesible; separar cada capa de arte.

## Jerarquía real de la pantalla (contrato B02-C2)
1. Encabezado: marca y acceso futuro a perfil real (no mostrar el nombre/cifras ficticias de la ilustración).
2. Contenido principal: dos acciones **Jugar Online** y **Jugar con Amigos**.
3. Subopciones de **Jugar Online**: normal 1v1 y clasificatoria 1v1 (nunca un modo Ranked independiente del online).
4. Sala privada en fase posterior: 1v1, 2v2, 3v3, FFA.
5. Navegación complementaria y paneles opcionales solo cuando estén autorizados/implementados.

### Elementos representados pero NO aprobados como funcionalidad
- Torneo CPU no forma parte de los modos oficiales. Se excluye como botón operativo.
- Pase de temporada, cofres/llaves, inventario, tienda, economía, misiones, eventos y números mostrados son **ilustrativos**, NO evidencia de sistemas existentes.
- Los héroes y robot del mockup se conservan como referencia de apariencia. Identidad/nombres, expresiones y exportaciones oficiales individuales requieren validación posterior.
- No poblar datos ficticios ni mostrar botones que aparenten funcionar. Bot opcional solo bajo regla futura de fallback casual, explícito y etiquetado.

## Contrato de asset pipeline
Catálogo técnico de IDs: src/ui/assets/assetRegistry.ts. Ningún asset obtiene estado approved hasta revisión visual y archivo real.
Cada imagen debe contener **un solo elemento por archivo**; usar PNG con alfa cuando corresponda, WebP para fondos y SVG solo para iconografía original/autorizada. Mantener bordes limpios y alfa correcto; no recortar personajes directamente desde una captura con el fondo mezclado. Si la imagen no se puede separar limpiamente, REGENERAR el recurso individual siguiendo la referencia.
Cada capa decorativa se coloca por CSS/DOM independiente del contenido. Logo separado del escenario; personajes separados; efectos y cristales separados.
Propuesta de futuras rutas: public/assets/home/environment/, brand/, characters/, decorations/. **En B02-C1 son contratos, no archivos descargables ya producidos.**
Meta de presupuesto a validar luego: fondos WebP comprimidos; personajes y logo al tamaño necesario para pantalla con DPR 2; carga diferida para capas no críticas. Valores finales se fijarán después de medir.

## Componentes y estilos creados en B02-C1
- src/ui/theme/semantropic-pop.tokens.css — variables de color, relieve, radio, tipografía, espaciado y reducción de movimiento, encapsuladas en .st-theme.
- GameFrame — raíz futura de la interfaz; no altera App actual.
- GamePanel — panel temático de contenido real.
- ActionTile — botón accesible, deshabilitado cuando no tiene acción; admite azul/coral/dorado/violeta.
- StatusChip — valor **obligatorio por prop**; no inventa economía ni jugadores conectados.
- ArtworkLayer — únicamente renderiza imágenes con state approved y ruta definida.
- src/ui/index.ts — punto de entrada del sistema.

La pantalla B01 permanece igual. **Ningún componente está montado en la ruta principal**: prueba visual de la nueva home y composición queda para B02-C2 bajo autorización.

## Responsive / accesibilidad
- Mobile-first, sin forzar orientación: conservar prioridad de Online / Amigos tanto en vertical como horizontal.
- En tamaños estrechos colapsar navegación y reorganizar la parrilla sin tapar los CTA.
- Evitar el texto rasterizado en botones, insignias o perfiles: los textos pertenecen a React.
- Contraste, lectura, navegación teclado y touch; objetivos táctiles >=44px para controles pequeños; foco visible; respetar prefers-reduced-motion.
- No asumir que un mockup vertical 1024x1536 se escala íntegro para todos los móviles.

## Aceptación B02-C1
- [x] Inventario de capas y estados pendientes explícitos.
- [x] Tokens/estilos encapsulados sin tocar App B01.
- [x] Primitivas React reutilizables y accesibles.
- [x] Registro de restricciones de fidelidad y del alcance aprobado.
- [ ] Imágenes definitivas separadas: **pendiente B02-C2 / futuro encargo de assets**.
- [ ] Nueva home visible, pruebas visuales de fidelidad y mobile físico: **NO INICIADAS**.
- [ ] Fusión a main / Render: **PROHIBIDAS en este microbloque**.

El Director aprobará por separado cada avance. No declarar mockup implementado por disponer de tokens o interfaces.
