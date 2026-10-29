# DS-01 — 13 pruebas de audio reproducibles (solo QA local)

**SEMANTROPIC TRIVIA 1.0 / 29-10-2026 / B03-C5**
**Rama:** chore/ds01-audio-qa-reproducible
**Estado:** el Director ha aprobado usar las pruebas para integración y evaluación; ninguna variante A/B/C se declara maestra definitiva.
**NO son grabaciones de Foley humano original.**

## Qué contiene esta carpeta

- `render_local.py`: receta y eventos originales de las 13 pruebas DS-01. Recrea 13 WAV + 13 MP3 locales; los BINARIOS NO están incluidos en GitHub.
- Esta carpeta NO forma parte del pipeline de juego, la compilación de Vite ni el sitio de Render.

## Por qué no se han subido los MP3

Las pruebas usan fragmentos sonoros de **TimGM6mb.sf2**, cuyos titulares son Tim Brechbill y David Bolton. El paquete Debian lo identifica con licencia **GPL-2**. El tratamiento de grabaciones derivadas al distribuirlas dentro de un juego comercial debe revisarse específicamente. Hasta que esa revisión concluya, los binarios se generan/usan exclusivamente en local y NO se publican en GitHub público, Render, PWA ni releases.

Fuentes:
- https://sources.debian.org/copyright/license/timgm6mb-soundfont/
- https://www.gnu.org/licenses/gpl-faq.en.html#WhatCaseIsOutputGPL

## Reproducción local, sin agregar binarios al repositorio

En Linux/WSL (instala estas dependencias si todavía no están):

```bash
sudo apt-get update
sudo apt-get install -y libfluidsynth3 timgm6mb-soundfont ffmpeg python3-pip
python3 -m pip install numpy scipy soundfile
mkdir -p /tmp/semantropic-ds01-qa
DS01_OUTPUT=/tmp/semantropic-ds01-qa python3 qa/audio/ds01/render_local.py
```

En Windows nativo: usar WSL si ya está disponible o instalar localmente las dependencias equivalentes y especificar `DS01_SOUNDFONT`, `DS01_FLUID_LIB` y `DS01_OUTPUT` según el entorno. No descargar soundfonts de sitios no verificables.

Este código replica la estructura y los parámetros de la tanda original. El archivo MP3 puede diferir en hashes entre versiones de FluidSynth/FFmpeg; antes de equiparar sonoramente resultados, comparar escuchando las variantes y comprobar la duración.

## Nombres y eventos

- Botón: `POP01_BOTON_A/B/C.mp3`
- Seleccionar alternativa: `POP02_SELECCION_A/B.mp3`
- Acierto: `TIKI01_ACIERTO_A/B/C.mp3`
- Error: `TOOT01_ERROR_A/B/C.mp3`
- Tiempo agotado: `POP03_TIEMPO_A/B.mp3`

## Para Codex B03-C5

1. Localiza esta rama y estos archivos. Si Codex está sobre `main`, puede consultar el archivo desde GitHub con su ruta y traer SOLO el script/documentación necesarios, sin cambiar la rama base del trabajo principal.
2. Crea módulo de reproducción desacoplado, mapeo de eventos, QA A/B/C e importación local según el Prompt Maestro B03-C5.
3. El render de 13 pistas es una opción para facilitar QA local; si no se pueden instalar dependencias, NO afirmes que los MP3 existen y mantén importación manual.
4. Agrega patrones `.local-ds01-audio/` y otros directorios de salida a `.gitignore` en el microbloque autorizado, verifica que nunca entren en `dist/`, `public/`, releases o un PR de producción.
5. Conserva los tres efectos Pixabay seleccionados, música del lobby, todos los SVG y el juego aprobado. No publicar muestras DS-01.
6. El trabajo en esta rama no autoriza cambios del juego ni mezcla con `main`.

**No subir el soundfont original ni el producto final de este script a GitHub público.**
