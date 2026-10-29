# SFX-02 — catálogo aprobado; originales pendientes

29-10-2026. Orden artística del Director recibida después de D-043.
**No es una integración SFX-02 lista ni una declaración de audio reproducido.**

## Comprobación efectiva

Se preservó `feat/audio-ds01-qa` / PR #17 y los archivos no confirmados del Director.
No se encontraron los nueve MP3 exactos en el proyecto, las carpetas locales de
audio o Descargas. `MANIFIESTO_APROBACIONES_SFX02.json` entregado contiene nombres
y fuentes, pero hashes y filenames nulos. `README_PRIMERO.txt` confirma que el
ZIP SFX-02 no incluye los MP3. No hay módulos HF4 adicionales en el árbol revisado.

Se verificaron las nueve páginas oficiales por la herramienta web: títulos/autores
coinciden con la orden. La página de C indica Content ID registrado. No se obtuvo
certificado. Se consultó el [resumen de licencia de Pixabay](https://pixabay.com/service/license-summary/),
que prohíbe distribuir contenido standalone; no se presentan estas obras como
composiciones originales de SEMANTROPIC ni se inventan garantías contra reclamos.

La descarga directa de las **nueve URLs** devolvió HTTP 403 / text/html.
Chrome también devolvió 403 y «Just a moment...» para M1, sin audio descargable.
No se eludió la verificación ni se emplearon mirrors, previews de otros sitios,
archivos parecidos, generación o recodificación. No hay bytes nuevos que permitan
calcular un SHA-256, registrar fecha real de descarga o verificar decodificación.

## Única acción requerida para continuar

Descargar los nueve originales desde sus páginas oficiales y guardarlos con su
nombre original en:

**C:/Users/Daniel/semantropic-trivia-next/.local-approved-audio/**

La carpeta se preparó y quedó ignorada por Git. No es public/ ni una ruta servida
por este cambio. Guardar también el certificado de C si Pixabay lo proporciona.
No poner MP3 en la raíz, public/, src/ o dist/. El catálogo de trazabilidad
[SFX02_CATALOGO.json](SFX02_CATALOGO.json) conserva campos de archivo/hash/fecha
vacíos hasta tener los originales; no basta con una coincidencia de nombre.

| Código | Original y autor | Página oficial | Original confirmado | Evento integrado SFX-02 | Escucha humana pendiente |
|---|---|---|---|---|---|
| M1 | Casual Click Pop UI 2 — floraphonic | https://pixabay.com/sound-effects/film-special-effects-casual-click-pop-ui-2-262119/ | No | No | Sí |
| V1 | Menu Back — freesound_gamestudio | https://pixabay.com/sound-effects/film-special-effects-menu-back-384929/ | No | No | Sí |
| A1 | The Correct Answer 33 — Tuomas_Data | https://pixabay.com/sound-effects/film-special-effects-the-correct-answer-33-183620/ | No | No | Sí |
| X3 | Negative Notification — Universfield | https://pixabay.com/sound-effects/film-special-effects-negative-notification-132470/ | No | No | Sí |
| W1 | Victory Fanfare — Universfield | https://pixabay.com/sound-effects/musical-victory-fanfare-152480/ | No | No | Sí |
| D2 | Game Over Orchestral Stinger - Cartoon Defeat — Coghezzi | https://pixabay.com/sound-effects/musical-game-over-orchestral-stinger-cartoon-defeat-546515/ | No | No | Sí |
| L7 | Videogame Queue Music — Kaden_Cook | https://pixabay.com/music/video-games-videogame-queue-music-274211/ | No | No | Sí |
| C | Fun & Quirky Upbeat Retro — moodmode | https://pixabay.com/music/funk-fun-amp-quirky-upbeat-retro-233935/ | No | No | Sí |
| CLK | Clock Tick (Tik Tak) — KaosMakinesi (Freesound), listado freesound_community | https://pixabay.com/sound-effects/household-clock-tick-tik-tak-76043/ | No | No | Sí |

## Mandato conservado para la integración pendiente

SFX-02 revoca HF1: Colección debe emitir M1 una sola vez cuando se integre el
original. Retornos/cierres usan V1 con precedencia sobre M1. A1/X3 sustituyen el
feedback DS-01, sin duplicación. Timeout permanece separado. Las maquetas DS-01
siguen siendo QA, no sustitutos definitivos de estas obras.

W1/D2 nunca se disparan por una puntuación de práctica. La entrega pendiente
debe incluir audiciones QA explícitas en Resultados, excluidas de producción,
sin alterar resultado/puntos y con un solo preview a la vez.

L7 pasa a ser el único tema elegido de lobby; se conserva 18_lobby_pop_familiar
como histórico y no se cambia su asignación efectiva antes de disponer del
original L7 exacto, según la orden. C será música de Arena independiente (12 %
inicial), mutuamente excluyente con L7. CLK tendrá cadencia 2000/1000/650/350 ms
según tiempo restante, sin cambiar pitch ni deadline, sin tics acumulados y con
detención inmediata al responder/ocultar/salir. Volúmenes/mute separados para
lobby, Arena, reloj y SFX, con prioridad de feedback sobre música.

Nada de ese comportamiento nuevo se declara comprobado sin archivos. No se
reescribe el juego a ciegas ni se aprueban fuentes por su filename. La partida
y el audio local anterior permanecen disponibles sin cambios funcionales en
http://localhost:5173/; esa URL **no representa SFX-02 integrado**.

Cambios de esta preparación: ignore de carpeta privada, catálogo, roadmap y
decisión. Sin nuevos binarios, cambios de juego, SVG, puntuación o temporizador;
sin merge, Render, publicación de assets ni inicio de B04. El QA de audio SFX-02
en Arena queda pendiente de los nueve originales y sus hashes/decodificación.
