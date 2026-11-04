# B04-C1 · Primer resultado visual para el Director

04/11/2026. Rama dedicada: `feat/b04-c1-portal-social`.

La orden actual aprueba D-049 y DA-B04-A2 definitivamente, y autoriza implementar solo sus pantallas y navegación visual. Sustituye las menciones históricas «pendiente» del paquete, conservadas sin alteración. No autoriza autenticación, backend ni base de datos. Publicación y merge retenidos hasta revisión del primer resultado. No se inicia otro bloque.

## Fuentes y protección

ZIP localizado en raíz, abierto y comprobado sin errores de integridad. Extracción exclusiva a `referencias/B04_D049_DA02/`: 19 PNG, cuatro documentos Markdown y manifiesto JSON. Ningún archivo existente sobrescrito. Los 23 archivos declarados coinciden con sus SHA-256. El ZIP y los trabajos Q03/Q04 no se modifican ni se incluyen en el commit B04.

El logo canónico del repositorio tiene SHA-256 `1e404c4ea2e64d1629a80a247bcd6c66fc455bcbf7d2e1515e0d9a152aa8463b`; la copia del ZIP tiene `78671693df5adec2d8c6bcc2733e63e1eae289c36064ce7c9a35d8053fcc904d`. Se conserva exactamente el archivo solicitado por el Director en `public/assets/home/brand/semantropic-trivia-logo-v1.png`.

El paquete carece de capas independientes del portal/plaza D-049. El Director autorizó expresamente «Reconstruir con CSS/SVG para revisión». Se usa el fondo canónico B02 intacto; portal, arco, gemas e iconos son elementos individuales. No se emplea ninguna maqueta completa en el juego. La ilustración de fondo, el relieve y las proporciones de la reconstrucción difieren del PNG original: requieren evaluación artística, sin declarar fidelidad exacta.

## Implementación y alcance

- `src/App.tsx`: enruta la bienvenida y vistas de acceso antes del lobby; mantiene los hashes existentes del juego y no modifica el componente B02.
- `src/ui/access/AccessPortal.tsx`: bienvenida y siete vistas complementarias con campos nativos, mostrar/ocultar contraseña, validación local, seis estados visuales de ejemplo, navegación por historial y acceso al lobby real.
- `src/ui/access/access-portal.css`: estilos encapsulados, fondo independiente, marco/ornamentos CSS/SVG, adaptación escritorio/móvil y foco visible.
- `scripts/b04/visual-qa.mjs`: QA reproducible; Playwright aislado en `/tmp`, sin cambiar dependencias del proyecto. Admite `B04_PLAYWRIGHT_MODULE` para otra instalación.
- `scripts/b04/comparisons.mjs`: galería comparativa y PNG comparativos a partir de capturas reales y referencias originales.
- `docs/design/B04/`: referencias originales, continuidad, capturas y resultados.

Recorridos: `#welcome` → `#sign-in` / `#register`; registro → `#verify` → `#auth-status` → `#lobby-transition` → `#home`; recuperación → `#reset-password` → confirmación. El visitante sigue «Por evaluar»; un enlace separado permite conservar el acceso al lobby y práctica actual, sin crear sesión invitada.

Los botones de envío validan campos y explican que no se enviaron datos. Los enlaces de recorrido muestran las siguientes vistas sin simular respuestas del servidor, autenticación, verificación, correo, tiempos de espera ni perfiles. No se guardan credenciales ni hay llamadas de autenticación. Los términos y controles de edad siguen pendientes; no se recoge una aceptación legal ficticia.

## Prueba inmediata

Vite confirmado: http://localhost:5173/#welcome (HTTP 200). Reinicio: `npm run dev -- --port 5173` (PowerShell: `npm.cmd run dev -- --port 5173`).

1. Abrir la URL y pulsar Iniciar sesión o Crear cuenta.
2. Navegar con los enlaces de recorrido y Volver a bienvenida; los envíos son solo vista previa.
3. Abrir el lobby local y Arena del Conocimiento para jugar la práctica existente.

La dirección anunciada por Vite es `http://10.0.5.2:5173/`; es una IP interna del entorno cloud, sin acceso Wi-Fi físico comprobado. En Codespaces usar el puerto reenviado 5173 del entorno. No se declara enlace público ni acceso desde teléfono físico.

## Evidencia

[Comparativas de las ocho vistas en escritorio y móvil](evidencias/comparativas.html). [Resultados del navegador](evidencias/qa.json). Referencias congeladas en `referencias/B04_D049_DA02/`.

- TypeScript: PASS.
- Suite completa: 201 aprobadas, 0 fallidas.
- Build: PASS, incluidos guards de audio, editorial y semántica.
- Chromium automatizado: ocho vistas por cinco tamaños (320×740, 390×844, 844×390, 1600×900, 1920×1080), sin overflow horizontal, sin errores JS y sin solicitudes POST/PUT/PATCH.
- Navegación y validación: mostrar contraseña, envío local informativo, registro → verificación → confirmación → lobby → Arena, respuesta real de práctica, recuperación y error de contraseñas distintas, Atrás del navegador.

No se ha probado móvil físico, Safari, teclado de sistema móvil ni lector de pantalla. La revisión visual y aprobación del Director están pendientes. No hay push, PR, merge, CI remoto ni publicación Render de este bloque.
