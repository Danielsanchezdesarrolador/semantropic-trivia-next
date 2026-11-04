# Propuesta separada B04-C4 — autenticación real

Estado: planificación solicitada dentro del cierre C3; NO autorizada para implementación. No hay servicios, base de datos, proveedor, sesiones, correo ni migraciones creados. Requiere nueva orden del Director.

## Arquitectura propuesta

Conservar React/TypeScript/Vite como cliente; API Node.js/TypeScript y PostgreSQL en Render según la arquitectura autorizada. Mantener DEV/producción separados, secretos solo en servidor y migraciones revisables con respaldo/rollback. Elegir y auditar una biblioteca mantenida de autenticación antes de implementar; no crear criptografía casera. Resolver dominios/orígenes, CORS y cookies antes de conectar el sitio estático a la API.

El servidor validaría las credenciales, el estado de verificación y permisos. Propuesta de sesiones opacas revocables en servidor, rotadas al autenticar/cambiar privilegios, con vencimiento y cierre de todas las sesiones. Cookies Secure/HttpOnly/SameSite adecuadas al despliegue, protección CSRF, límites de intentos y logs sin contraseñas/tokens. OWASP recomienda esos controles de sesión y respuestas que eviten enumeración de usuarios: [sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [autenticación](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html). Aplicar una política de contraseñas de servidor revisada; el mínimo de ocho caracteres de la maqueta C3 no constituye política final de seguridad.

## Verificación y recuperación propuestas

Registro pendiente de verificación, correo transaccional con proveedor y dominio validados, enlaces de uso único con caducidad, secretos aleatorios y solo su hash en almacenamiento. Evitar filtrarlos por logs, referers o analítica; limitar reenvíos e intentos. Recuperación con respuesta neutral, sin revelar si existe el correo; no cambiar nada hasta validar el token, invalidarlo tras uso y ofrecer revocación de sesiones. No iniciar sesión automáticamente después de restablecer. Estas pautas se apoyan en [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html); los plazos y límites concretos se aprobarían tras análisis de riesgo.

## Privacidad y menores: decisiones previas

Definir mercados, edades admitidas, responsable y finalidades antes de recopilar datos reales. Minimizar datos y visibilidad de perfiles; separar nombre público del correo, consentimiento cuando corresponda, retención/borrado/exportación y mecanismos verificables de representantes legales. No pedir fecha completa de nacimiento o documentos por defecto. Revisión jurídica de las jurisdicciones elegidas y evaluación de abuso antes de activar registro. La [guía oficial FTC sobre COPPA](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) es una referencia para el análisis del mercado estadounidense, no una determinación de aplicabilidad al proyecto ni una política ya cumplida.

El Director debe aprobar flujos de edad/consentimiento, tratamiento de cuentas infantiles, proveedores y costos, política de privacidad/términos y operación de soporte. Modo Invitado, OAuth y verificación por código frente a enlace permanecen decisiones de producto abiertas; C3 no las decide.

## Criterios de autorización y aceptación futuros

Orden nueva con alcance concreto; pruebas de integración de registro/verificación/sesión/recuperación, tokens vencidos/reutilizados, enumeración, rate limiting, CSRF, revocación, borrado y acceso de menores; accesibilidad y Android/iOS; revisión de seguridad y privacidad; CI completa y DEV antes de cualquier permiso de producción. Nunca transportar respuestas competitivas, MMR o secretos al cliente. La práctica local sigue claramente distinguida del online.
