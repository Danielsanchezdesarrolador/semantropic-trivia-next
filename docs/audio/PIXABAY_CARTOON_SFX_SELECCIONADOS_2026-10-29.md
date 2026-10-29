# SEMANTROPIC TRIVIA 1.0 — Efectos cartoon seleccionados en Pixabay
Fecha: 2026-10-29 · Dirección: SEMANTROPIC POP — Caricatura Familiar.

## Decisión del Director
El Director seleccionó **tres efectos** de Pixabay para integrarlos con criterio contextual en el videojuego. Se conservan como recursos de terceros bajo la licencia Pixabay Content License; no convertir su descarga en propiedad original de SEMANTROPIC. Los archivos fuente no se incluyen en este documento ni se redistribuyen sueltos desde GitHub público.

| ID semántico propuesto | Título original / autor | Fuente oficial Pixabay | Duración subida | SHA-256 del MP3 proporcionado | Evento de juego previsto |
|---|---|---|---|---|---|
| `match_funny_event` | Funny Cartoon Sound 4 — lucadialessandro | https://pixabay.com/sound-effects/musical-funny-cartoon-sound-4-464864/ | 3.030 s | `670cdd264c8537de534d94685254bcc137874eef78edd760de8b044e83ff8a28` | Acontecimiento cómico, positivo o inesperado confirmado durante una partida; **no sonar ante cada pregunta ni disparar un evento inexistente** |
| `match_defeat_trombone` | Cartoon Trombone Sound Effect — 11325622 | https://pixabay.com/sound-effects/film-special-effects-cartoon-trombone-sound-effect-241387/ | 3.788 s | `8f1cc3ddcaf80f12645653cbfb7d3be7789f911e4d45e813d3583af14306a94e` | **Derrota real de una partida competitiva o amistosa**, una sola vez al determinar el resultado. La práctica local actual no declara victoria/derrota, por lo que no corresponde reproducir aquí |
| `ui_open_cartoon_6` | Cartoon 6 — AleXZavesa | https://pixabay.com/sound-effects/musical-cartoon-6-468373/ | 2.560 s | `54a2f8b4f7b984a4ae76ef37ae8a4110bb76a36232edd6a8f1511bbe528023ed` | Apertura efectiva de un panel o elemento relevante (p. ej., colección, ventana de información o futuro objeto, solo si existe); evitar en clic genérico, cerrar o repetición accidental |

### Integridad, duplicados y atribución
Se recibieron dos archivos `lucadialessandro-funny-cartoon-sound-4-464864.mp3` y `lucadialessandro-funny-cartoon-sound-4-464864(1).mp3`; ambos son **idénticos byte a byte** (96.966 bytes, hash registrado arriba). Conservar una sola copia. El trombón pesa 121.208 bytes y Cartoon 6 pesa 81.920 bytes. Los tres MP3 de origen suman 300.094 bytes.

Para la futura integración: asignar IDs semánticos estables, mantener las fuentes y hashes en un manifiesto de procedencia, usar versiones controladas, verificar decodificación/tamaño/picos y controlar prioridad, volumen, accesibilidad y deduplicación de eventos. Ningún sonido cambia la lógica, el cronómetro, la puntuación ni autoriza un modo de juego inexistente. Los recursos de derrota y evento especial pueden permanecer **reservados** hasta que haya eventos reales que los justifiquen.

### Licencia y condiciones
- Fuente: Pixabay Content License. Resumen: https://pixabay.com/service/license-summary/ . Términos íntegros: https://pixabay.com/service/terms/ .
- La licencia generalmente permite **uso gratuito, comercial y modificaciones dentro de una obra creativa**, sin atribución obligatoria (aunque recomendable).
- **Prohibida la distribución o venta de los MP3 como recursos independientes / standalone**. No publicar un paquete público de efectos crudos ni presentar estos sonidos como composición propia.
- Confirmar que cada URL de recurso sigue bajo esa licencia y mantener evidencia de procedencia/fecha. El titular debe comprobar derechos de terceros adicionales cuando apliquen.
- Para la producción, gestionar los originales como recursos incorporados al videojuego; evitar distribuciones públicas de archivos individuales fuera de su integración artística o funcional.

### Estado de implementación
**Selección de uso aprobada por el Director; incorporación técnica pendiente.** Este manifiesto no implementa reproductores, no modifica `main`, no añade los MP3 a GitHub público y no fusiona el PR. Incorporar en el microbloque de audio autorizado que corresponda y validar en el juego. La música del lobby anteriormente aprobada permanece intacta.
