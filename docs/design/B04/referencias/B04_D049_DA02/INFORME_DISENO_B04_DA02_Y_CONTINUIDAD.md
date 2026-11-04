# SEMANTROPIC TRIVIA 1.0 — B04 / Dirección de Arte

## D-049 congelada · DA-B04-A2: sistema visual de acceso complementario

**Corte:** 04-11-2026 (America/Santiago)  
**Autoridad artística final:** Director General del videojuego.  
**Estado inequívoco:** D-049 / Propuesta B — Portal Social es **la referencia de bienvenida APROBADA DEFINITIVAMENTE**. Este paquete DA-B04-A2 contiene **nuevos diseños de pantallas complementarias para REVISIÓN**, NO una aprobación definitiva de dichas pantallas, NI implementación técnica.

### 1. Fuentes y trazabilidad

- `REFERENCIA_OFICIAL_D049_BIENVENIDA_APROBADA_NO_MODIFICAR.png`: copia binariamente idéntica de la imagen aprobada D-049 y adjunta por el Director, 1672 × 941 px. **No tocar ni reinterpretar**.
- `LOGO_OFICIAL_B02_PNG_ORIGINAL.png`: copia binariamente idéntica del logo oficial PNG transparente proporcionado por el Director, 585 × 370 px. Todas sus colocaciones en las nuevas maquetas se hacen con escalado proporcional a partir de sus píxeles originales; no existe tipografía regenerada.
- `MANIFIESTO_SHA256.json`: hashes SHA-256 y tamaños reales de cada PNG, con comprobación binaria de las dos fuentes.
- `LAMINA_MOVIL_COMPLETA.png`, `LAMINA_ESCRITORIO_16X9.png`, `ESTADOS_UI_Y_VALIDACIONES.png` son vistas-resumen; los archivos `M01` a `M07` y `D01` a `D07` permiten revisión en tamaño individual.
- Para el fondo de estas **maquetas solamente**, se reutilizó visualmente una parte de la imagen D-049, suavizada detrás de los formularios. Este fondo derivado NO se presenta como un nuevo asset oficial ni sustituye `public/assets/home/environment/semantropic-pop-bg-v1.webp`. Para implementación futura debe emplearse el archivo canónico real.

### 2. Lo que se protege sin excepción

1. La pantalla de bienvenida de D-049 queda congelada. Portal dorado, plaza fantástica nocturna, cielo galáctico, botón azul de Iniciar sesión, botón coral Crear cuenta, opción visitante pendiente de decisión; un solo logo en el portal de la versión móvil y otro en su equivalente escritorio. El encabezado del tablero de referencia únicamente contiene «PROPUESTA B — PORTAL SOCIAL».
2. Logo aprobado B02 de archivo `public/assets/home/brand/semantropic-trivia-logo-v1.png`, sin rediseño, sin logotipo alternativo ni leyenda duplicada.
3. Lobby oficial B02, Arena B03 y sus 42 SVG, motor local, Motores B y C de preguntas, validador semántico, banco editorial de 1.250 preguntas, audio y estados de producción: **fuera de alcance**.
4. No convertir una maqueta entera en imagen de fondo con campos o botones rasterizados. Fondo/ornamentos = assets separados; formularios, tipografías y botones = React/CSS semánticos.
5. No se autorizan cambios de GitHub, Render, servidor, backend, autenticación, base de datos ni despliegue. Codex solo podrá recibir un paquete de integración cuando exista aprobación específica del Director.

### 3. Dirección artística DA-B04-A2: Portal Social ampliado

**Objetivo:** que el portal aprobado funcione como entrada emocional y que el sistema de acceso utilice la misma arquitectura (arcos dorados, profundidad, cristales, colores vivos) en pantallas operativas claras y responsivas. 

**En la maqueta:** fondo ilustrativo azul/violeta, marco de oro inspirado en el arco del portal, panel de superficie clara con relieve suave (contraste para lectura), bordes redondeados, titulares azul marino, CTA azul para continuar y coral para crear cuenta. El logotipo se coloca una sola vez por vista complementaria. No se inventan personajes nuevos. Las vistas no son funcionales ni una captura real de juegos online.

**Continuidad entre pantallas:** la bienvenida oficial ya aprobada no se altera. Elegir una acción inicia navegación a una vista distinta; no se sobrescribe el portal existente ni se presume que login esté operativo. Volver a la bienvenida debe recuperar el estado de navegación razonablemente. Después de autenticarse, mostrar confirmación breve sobre el mismo contexto visual y abrir el lobby oficial B02 real (sin simular una captura del lobby).

**Color referencial (no modifica tokens canónicos):** azul `#0B77F2`, coral `#F1356A`, violeta `#572EC7`, tinta `#14264C`, dorado `#FFD14F`, crema-lavanda `#FAFAFF`. Los valores se utilizan como muestras DA-A2, no como reemplazo de `src/ui/theme/semantropic-pop.tokens.css`. Codex deberá comparar los CSS efectivos de B02/B03 antes de parametrizar.

### 4. Inventario de pantallas visuales entregadas

| Código | Pantalla | Contenido y comportamiento futuro sugerido | Móvil | Web 16:9 |
|---|---|---|---|---|
| 01 | Inicio de sesión | Correo, contraseña, mostrar/ocultar, «¿Olvidaste…?», entrar, crear cuenta, errores de validación, opción de proveedores por evaluar | `M01_INICIAR_SESION.png` | `D01_INICIAR_SESION.png` |
| 02 | Crear cuenta | Nombre público, correo, contraseña, confirmar, aceptación explícita de términos/privacidad, aviso sobre validaciones de edad pendientes | `M02_CREAR_CUENTA.png` | `D02_CREAR_CUENTA.png` |
| 03 | Verificación de cuenta | Código de seis posiciones como **candidato UX**, en alternativa al enlace si la arquitectura futura lo elige; reenvío y ayuda | `M03_VERIFICAR_CORREO.png` | `D03_VERIFICAR_CORREO.png` |
| 04 | Recuperación | Solicitar correo, mensaje neutro de envío de instrucciones, retorno a inicio de sesión | `M04_RECUPERAR_ACCESO.png` | `D04_RECUPERAR_ACCESO.png` |
| 05 | Nueva contraseña | Nueva/confirmar, mostrar/ocultar, recomendaciones y validación contextual | `M05_NUEVA_CONTRASENA.png` | `D05_NUEVA_CONTRASENA.png` |
| 06 | Confirmación | Estado de éxito —texto y botón reales, no falso inicio de sesión— | `M06_EXITO.png` | `D06_EXITO.png` |
| 07 | Transición al lobby | Feedback breve de sesión establecida, salto a lobby B02 auténtico | `M07_TRANSICION_LOBBY.png` | `D07_TRANSICION_LOBBY.png` |

**Seis familias de estados**, detalladas en `ESTADOS_UI_Y_VALIDACIONES.png`: cargando, credenciales incorrectas, offline, correo confirmado, enlace caducado y demasiados intentos. Cada una conserva el contraste y una alternativa textual al color.

### 5. Flujo lógico propuesto (no implementado)

`Arranque → ¿sesión válida? → sí: transición → lobby B02; no: bienvenida oficial D-049 → Iniciar sesión / Crear cuenta / Explorar como invitado (pendiente)`. 

**Inicio de sesión:** email y contraseña → validación local de formato → solicitud segura a servidor futuro → éxito (solo si confirmado) → transición → B02. Si falla, mantener campos y foco, mostrar error claro sin exponer datos. La pantalla debe poder recuperar contraseña y regresar a bienvenida.

**Crear cuenta:** nombre público, correo, clave y confirmación → términos/privacidad → verificación de correo según política real → éxito → transición. No se deben crear automáticamente perfiles personales ficticios. La definición de edad/consentimiento infantil requiere diseño adicional, asesoría legal y decisiones del Director antes de implantar registro para menores. No incluir fecha de nacimiento en el formulario por defecto sin necesidad documentada.

**Verificación:** se muestran código y reenvío en esta maqueta para estudiar la experiencia. La arquitectura puede utilizar enlace, código o ambos; **no se aprueba un proveedor ni un contrato backend**. El reenvío deberá mostrar estado y controles contra abuso, sin conteos ficticios.

**Recuperación:** solicitar correo → respuesta genérica («Si existe una cuenta vinculada, enviamos instrucciones») → email de recuperación según servidor → formulario de nueva clave → confirmación → volver a entrar. Evitar revelar qué correos están registrados.

**Invitado:** botón visible como parte de D-049, pero **su activación no está aprobada**. Posible ruta solo a práctica local sin crear cuenta y con indicación clara de límites de guardado/funciones. El Director y equipo técnico decidirán si se habilita.

**Google / Apple:** presentados como referencias de método de acceso posible; no se declara funcionalidad, configuración, consentimiento, compatibilidad ni disponibilidad. La experiencia principal siempre puede diseñarse con correo/clave sin depender de ellos.

### 6. Contratos visuales de estados de componentes

- Inputs: inactivo, enfocado (borde azul + foco visible), con valor, vacío requerido, formato inválido, contraseña visible/oculta, deshabilitado y servidor cargando. Etiquetas persistentes, `autocomplete` futuro y mensaje de ayuda/error asociado al campo.
- Botón principal: normal, hover escritorio, presionado, foco visible, deshabilitado, cargando. Evitar clics repetidos por espera; no afirmar operación exitosa antes de respuesta real.
- Avisos: éxito / error / advertencia / informativo; acompañar color con icono y texto, accesibilidad `role=alert` solo para errores nuevos o importantes, foco gestionado con criterio.
- Enlaces: acciones discernibles para «Volver», «Recuperar contraseña», «Reenviar» y «Crear cuenta», con 44 × 44 CSS px recomendados para destinos táctiles cuando aplique.
- Errores propuestos: «Introduce un correo válido», «Completa la contraseña», «Las contraseñas no coinciden», «No pudimos iniciar sesión. Revisa los datos e inténtalo de nuevo», «No hay conexión. Vuelve a intentar». Controles reales y mensajes de servidor requerirán contrato técnico.
- No incluir rankings, salarios, avatares, jugadores online, bot, monedas, progreso persistente ni autenticaciones falsas.

### 7. Adaptación responsive, teclado y accesibilidad

- **Móvil 9:16/vertical:** una columna; ilustración en segundo plano y un panel legible que puede desplazarse verticalmente si la altura real o el teclado lo requiere. No forzar el diseño completo a una sola pantalla mediante tipografía diminuta. Mantener anclaje del botón y scroll del formulario para teclado. Respetar recortes, zoom 200 % y `env(safe-area-inset-*)`.
- **Escritorio 16:9:** fondo ambiental, bloque de marca/artístico y bloque funcional claramente separado; el formulario no ocupa todo el ancho. En pantallas estrechas de escritorio apilar sin scroll lateral.
- **Tableta:** interpolación, sin asumir que móvil escalado cubre todas las relaciones de aspecto.
- Lectura: texto de campos y botones recomendado ≥16 CSS px en móvil, labels persistentes, encabezado semántico, foco teclado, errores cercanos al input, contrastes comprobados, entrada por tabulación; `input type=email`, password manager y teclado apropiado en futura implementación.
- Animación propuesta: transiciones UI 160–240 ms; éxito y entrada lobby hasta 350 ms, sin impedir interacción. Respetar `prefers-reduced-motion`. Reducir brillo/partículas cerca de campos. Sin prometer pantalla completa nativa en iOS.
- Privacidad y menores: recabar solo datos necesarios, separar avisos y consentimientos, validar texto legal con asesoría de protección de datos y lineamientos de app stores; no inferir edades ni presentar un contrato legal definitivo desde mockups.

### 8. Inventario de assets y futura transferencia

**Canónicos protegidos en GitHub (no alterados):**
- `public/assets/home/brand/semantropic-trivia-logo-v1.png` — original PNG y transparencia. Un solo logo por vista; no título duplicado «SEMANTROPIC TRIVIA» aparte del propio arte cuando se trata de marca.
- `public/assets/home/environment/semantropic-pop-bg-v1.webp` — referencia de ambientación B02, sin sustituir.
- `src/ui/theme/semantropic-pop.tokens.css`, `src/ui/home/home-preview.css`, `src/ui/quiz/quiz-preview.css` — revisar valores efectivos, no reemplazarlos unilateralmente.
- `public/assets/quiz/b03-b01/` — 42 SVG protegidos, **no necesarios de modificar para el acceso**.

**Recursos candidatos de DA-A2:** cristal ornamental, arco dorado/contorno de portal para el panel, tarjetas de superficie, iconos de correo/clave/verificación/alerta y fondos complementarios. En este paquete esas formas son **conceptos dentro de las maquetas**, NO archivos finales recortados y reutilizables, NO se deben copiar como capturas del PNG compuesto. Solo producir assets individuales después de aprobación del Director y especificación de dimensiones/alpha/SVG auténtico.

**Implementación futura recomendada (no autorizada):** rutas `welcome` (D-049), `sign-in`, `register`, `verify`, `forgot-password`, `reset-password`, `auth-status`, `lobby`; componentes React para inputs, botones, overlays, estados y navegación; lógica y mensajes accesibles; guardas de sesión; gestión de contraseñas y protección contra cuentas reveladas; QA visual de 320×740, 390×844, 844×390, 1366×900 y 1920×1080, emulación y pruebas físicas claramente diferenciadas; CI y despliegue solo tras autorización.

### 9. Riesgos y decisiones pendientes para el Director

**No confundir D-049 con DA-A2:** solo la bienvenida está aprobada definitivamente. Este set de 14 mockups de nuevas pantallas + estados requiere revisión y decisión final del Director.

1. Confirmar o ajustar la arquitectura visual de las seis vistas complementarias, **en un solo bloque de revisión**.
2. Decidir si el invitado tendrá acceso exclusivo a práctica local sin persistencia, más adelante.
3. Decidir el método de verificación real (enlace, código o ambos) después de arquitectura de autenticación.
4. Valorar login con Google/Apple según viabilidad, costos, requisitos legales y reglas de cada plataforma; no se implementó.
5. Diseñar el camino adecuado para menores conforme a requisitos legales antes de llevar a producción.
6. Tras aprobar el bloque DA-A2, preparar un paquete de recursos realmente independientes y un brief de implementación acotado para Codex. **No iniciar Codex todavía**.

### 10. Regla final de continuidad

**D-049: APROBADA Y PROTEGIDA. DA-B04-A2: DISEÑADA PARA REVISIÓN, SIN IMPLEMENTAR.** Mantener historial completo, PNG originales, manifiesto SHA-256 y decisiones. La siguiente dirección artística debe partir de esta versión y jamás reiniciar las exploraciones A/B/C sin orden expresa del Director.
