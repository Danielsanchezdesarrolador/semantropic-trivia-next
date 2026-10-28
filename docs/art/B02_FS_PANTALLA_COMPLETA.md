# SEMANTROPIC TRIVIA 1.0 · B02-FS pantalla completa PC y celular
Fecha: 2026-10-28 · Director: «antes dejaras un modo para celular dónde pueda tener pantalla completa y pc»

## Alcance
- Botón accesible de pantalla completa en la esquina del encabezado del lobby y sus submenús oficiales (no en la galería B02).
- La Fullscreen API necesita un clic directo del usuario. El botón entra y sale y responde a eventos fullscreenchange, incluso Esc.
- Escritorio: en pantalla completa se expande la ilustración a todo el ancho y alto del monitor, sin deformar la proporción del fondo.
- Android compatible: el mismo control solicita ocultar el chrome del navegador mediante su Fullscreen API.
- Navegadores sin API o que la deniegan: ayuda honesta para abrir desde navegador completo e instalar/añadir el juego a pantalla de inicio; jamás simular una pantalla completa que no exista.
- Manifest web con display fullscreen y fallback standalone, metadatos de iOS, iconos 192/512 reutilizando logo oficial aprobado. No registrar service worker ni afirmar soporte offline.
- CSS respeta safe-area-inset en móviles con muesca y mantiene modo responsive y navegación.

## Restricciones
- B03 (preguntas y partidas), autenticación, matchmaking y backend quedan fuera de alcance.
- Compatibilidad real depende de navegador/OS. iPhone Safari puede no permitir requestFullscreen para elementos ordinarios; Añadir a pantalla de inicio es la alternativa del sistema.
- No manipular la orientación del móvil ni prometer ocultar botones de navegación del sistema.
- El arte aprobado del lobby queda intacto salvo la adaptación temporal de ancho al activar pantalla completa.

## QA
- TypeScript, test unitarios (incluye firma/dimensiones de iconos), Vite.
- Playwright PC 1366, móvil emulado 390 y 320: botón visible, solicitud fullscreen, salida o fallback explícito; sin errores JS, sin overflow, lobby funcional y enlaces intactos.
- QA pública HTTPS y Render LIVE antes del cierre. Prueba en Android físico pendiente revisión del Director.
