# B03-C5 — cierre técnico de Caricatura Familiar

29-10-2026. Aprobación artística expresa del Director recibida. **B03-C5 cerrado
y publicado para evaluación final.** B04 es próxima etapa y no se inicia.

Primera publicación: `d90e24505e1cebc0a53e19812b030b3f5e383124`, merge de #16.
Render `dep-dbht2qff3r2c7383tsjg` LIVE, comprobado en My Workspace, servicio
`semantropic-trivia-next-web` / `srv-dbh2d5bl550s73epp23g`, rama main.
[Juego](https://semantropic-trivia-next-web.onrender.com/) y
[SHA del build servido](https://semantropic-trivia-next-web.onrender.com/release.json).
Los commits documentales posteriores actualizan ese marcador; la referencia
anterior registra la primera publicación funcional, no un SHA actual inventado.

## Recuperación y evidencia pública

Se recuperó la rama docs/b03-c5a-direccion-sonora en 2cc66ee, sin divergencia
respecto a origin. AGENTS, roadmap y workflow ya estaban guardados; solo quedaba
sin commit la ampliación del mensaje de diagnóstico de cadencia en la prueba.
Se conservó en 377319e sin cambiar criterios, tolerancias ni reproducción.
Los seis archivos aportados sin seguimiento y los nueve originales privados
permanecieron intactos; no hubo reset, clean, force push ni descartes.

Vite se arrancó de nuevo en http://localhost:5173/. El manifiesto privado devolvió
SFX02 y nueve entradas; hashes y decodificación reales 9/9. TypeScript, 83 tests,
build y guard PASS. QA DEV PC1366/móvil390/320 PASS, incluidos W1/D2 solo audición,
preferencias y ausencia de sustitutos ante M1 faltante. El incidente de cadencia
DEV anterior no se reprodujo en la recuperación; se conserva el diagnóstico
ampliado sin relajar la comprobación.

Tras los cuatro checks aprobados de #16 se verificó el despliegue automático por
API, SHA público exacto y los siete MP3 por tamaño y SHA-256 efectivo usando
scripts/audio/verify-published.mjs. Chrome sobre la URL pública: 1366×900,
390×844 y 320×740 PASS; navegación/retroceso, acierto/error, dos músicas
excluyentes, ducking, volumen/silencio, reloj progresivo, diez preguntas y timeout
real en escritorio, sin errores JS ni overflow. No es prueba en teléfono físico.

## Recursos y permiso de uso

Se revisaron las nueve páginas oficiales del [catálogo SFX-02](SFX02_CATALOGO.json),
sus títulos/autores y la indicación Pixabay Content License, los
[términos, apartado 5](https://pixabay.com/service/terms/), el
[resumen](https://pixabay.com/service/license-summary/) y las
[FAQ](https://pixabay.com/service/faq/), incluidas incorporación a juegos y Content ID.
La licencia permite uso comercial en una obra creativa y prohíbe redistribución
standalone. La conclusión operativa de este bloque es incorporar los recursos
a los eventos del videojuego completo, sin ofrecer biblioteca, reproductor de
stock, descargas, ZIP ni derechos exclusivos. No se declara autoría propia.
Los recursos de terceros no pasan a una eventual licencia del código.

Los originales llegaron del Director, con nombre exacto, SHA-256, tamaño y
decodificación verificados. Se conservan intactos; sus hashes están en el
catálogo. La fecha exacta de descarga no fue aportada: se conserva null y se
registra recepción 29-10-2026. C declara Content ID: falta certificado de descarga,
que las FAQ describen como evidencia para disputar reclamos, no como condición
general de la licencia. Se conservan URL/autor/licencia y no se garantiza ausencia
de reclamos. No se sustituye la pista elegida para evitar Content ID.

| Código | Recurso / autor | Build del juego | Evento |
|---|---|---|---|
| M1 | Casual Click Pop UI 2 / floraphonic | Sí | Transición de menú, Colección incluida |
| V1 | Menu Back / freesound_gamestudio | Sí | Regresar; excluye M1 del mismo gesto |
| A1 | The Correct Answer 33 / Tuomas_Data | Sí | Acierto confirmado, sin TIKI DS-01 |
| X3 | Negative Notification / Universfield | Sí | Error confirmado, sin TOOT DS-01 ni derrota |
| L7 | Videogame Queue Music / Kaden_Cook | Sí | Lobby/submenús, conserva posición |
| C | Fun & Quirky Upbeat Retro / moodmode | Sí | Arena y resultados locales, inicialmente 12 % |
| CLK | Clock Tick (Tik Tak) / KaosMakinesi (Freesound), listado freesound_community | Sí | Cadencia por deadline, sin cambiar pitch |
| W1 | Victory Fanfare / Universfield | No | Solo botón QA privado; victoria real futura |
| D2 | Game Over Orchestral Stinger - Cartoon Defeat / Coghezzi | No | Solo botón QA privado; derrota real futura |

Los siete originales de producción se guardan como componentes del juego en
src/audio/sfx02/assets, con NOTICE de licencia. Vite los emite con nombres hash
y el cargador verifica otra vez tamaño/SHA antes de reproducir. No son una
biblioteca independiente. Los nueve originales locales permanecen intactos en
.local-sfx02-audio; W1/D2 y DS-01 siguen fuera de Git/build públicos.

La pista histórica 18 y su equivalente versionado conservan bytes y ubicación de
fuente; un paso de build excluye ese archivo de dist porque su declaración de
derechos sigue pendiente. El guard falla si reaparece en dist. Tampoco se emiten
derivados TimGM6mb: el timeout de producción conserva aviso visual y no reproduce
su maqueta DS-01, X3 ni D2. En desarrollo sigue la audición anterior. No se
inventa otro sonido ni se altera el temporizador de veinte segundos.

## Integración

Se reutilizan el contexto, buses, gestores y observador del bloque local.
Solo se habilita la carga de recursos autorizados en producción; el importador
DS-01, endpoint privado, panel de laboratorio y botones W1/D2 siguen DEV.
Dos reproductores musicales estables y excluyentes, ducking de feedback,
silencio/volumen independientes para lobby, Arena, reloj y efectos. Autoplay
requiere gesto según navegador; se toleran preferencias/almacenamiento/red no
disponibles. Al ocultar se pausa y no se acumulan tics; al responder se detienen.
CLK reproduce el segmento de 140 ms ya aprobado sin modificar el MP3 original.
El juego puede seguir sin audio si un recurso falla; no hay sustitución oculta.

El arte, los 42 SVG, preguntas, puntuación y lógica del cronómetro no cambian.
No hay backend, ganador competitivo, cuentas ni simulación de online nuevos.

## Verificación y dependencias

- TypeScript y 83 tests / 0 fallos; integridad de los siete MP3, bloqueo del
  histórico en dist y motor público sin importación/reproducción DS-01/W1/D2.
- Build y guard pre/post; producción sin endpoints, importadores o paneles QA.
- Chrome real automatizado: 1366×900, 390×844 y 320×740; build con siete audios,
  menús y retroceso excluyentes, músicas, preferencias, ducking, ausencia de
  overflow/errores JS. Escritorio: diez preguntas y timeout real de 20 s;
  móviles emulados: dos preguntas. QA DEV conserva nueve audiciones y laboratorio.
- Workflow B03-C5 repite QA del build en GitHub Actions sin necesitar archivos
  privados. Prueba del juego completo adicional con el smoke B03/B02 existente.
- La regresión del arco cuenta ahora un RAF visual y otro sonoro, sin duplicados;
  ambos quedan en cero al responder, ocultar o salir. El gestor central de
  visibilidad cancela/reanuda el RAF de audio, sin modificar TimerArc o el motor.
- PR #18 cambia AGENTS y parte de main. PR #16 parte de main; PR #17 depende
  de #16. Orden aplicado: #18 a main, #17 dentro de #16 y #16 consolidado a main,
  evitando un despliegue intermedio con audio histórico. Sin force push.
  El cierre incorpora la regla de #18 y aclara su asignación histórica revocada.

Publicación inicial comprobada; el roadmap refleja cierre real, con B04 pendiente.
La aprobación artística ya está concedida; no se presenta QA automatizado como
escucha humana ni prueba física. Pendientes no simulados: Safari/iOS y teléfono
físico, certificado C para archivo de evidencia, futuras victorias/derrotas reales.

Prueba local: http://localhost:5173/ (DEV, nueve originales y audiciones QA).
Build local: http://localhost:4188/ durante la evaluación (siete recursos reales).
Reinicio DEV: npm.cmd run dev. Tras primer gesto, abrir Audio si hay silencio
guardado; navegar y entrar a Arena. W1/D2: completar ronda y usar botones QA.
