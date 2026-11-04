# Entornos permanentes de Semantropic Trivia

Orden del Director: 04/11/2026. Esta directriz sustituye previews manuales de PR.

| Entorno | Rama | Servicio | Publicación |
|---|---|---|---|
| Producción | main | semantropic-trivia-next-web | Solo tras aprobación expresa del Director, CI y protecciones |
| Desarrollo/revisión | staging | semantropic-trivia-dev | Bloques autorizados con CI verde, disponibles para evaluación |

Producción: https://semantropic-trivia-next-web.onrender.com/ (preservada).
El identificador del sitio de desarrollo, su URL y deploy se registran tras verificarlos; no inferirlos del nombre.
Build de desarrollo: `npm install && npm run build`; directorio publicado: `dist`. Sin secretos ni backend. No usar PR Previews ni cambiar la rama del servicio oficial.

## Rutina obligatoria

1. Trabajar en rama dedicada sobre base limpia; incorporar solo el bloque autorizado. Preservar cambios ajenos y privados Q03/Q04.
2. Pasar TypeScript, suite, build, guards y navegador. Actualizar PR de revisión técnica y verificar todos los checks remotos.
3. Adelantar staging al commit verificado sin force push. Si staging divergió, no sobrescribir: integrar de forma revisable y repetir verificaciones. No fusionar a main.
4. Confirmar Render LIVE, SHA por API y release.json, y navegar en la URL HTTPS real desde escritorio y móvil emulado.
5. Entregar siempre la misma URL de desarrollo. Indicar pruebas físicas pendientes. Esperar revisión del Director antes de producción u otro bloque.

Auto-Deploy preferido: After CI Checks Pass. El conector de creación disponible solo admite activado/desactivado; con On Commit la barrera es actualizar staging únicamente después de CI verde. El ajuste nativo After CI Checks Pass puede configurarse una sola vez en Settings → Auto-Deploy del sitio de desarrollo; no requiere acción por microbloque. No declarar ese ajuste nativo activo sin verificarlo.

## B04-C1: alcance de la corrección

Bienvenida en raíz y #welcome; acceso/registro visual; lobby B02 real en #home; audio comprobado dentro del lobby; Arena B03 y ronda local preservadas. Los tests conservan todas sus aserciones previas. Se agregan checks B04 y ejecución en pushes a staging. Sin cambios al juego ni dependencias: solo scripts, workflows y continuidad. El PR #20 permanece sin fusionar a main.

Las referencias y evidencias de la primera entrega se conservan como historia. El paquete limpio de main contiene 83 tests, no los 201 que incluían trabajos privados del workspace original. Evidencias de CI se guardan como artifacts/b04 y no incorporan preguntas privadas.
