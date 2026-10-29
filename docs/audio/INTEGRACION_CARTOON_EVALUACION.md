# Tres efectos cartoon — integración local para evaluación

29-10-2026. Autorización: petición del Director posterior a D-038.
Estado: implementación acotada preparada para evaluación; **no fusionar**.

## Asignaciones y originales

El manifiesto de procedencia y sus autores, enlaces, tamaños y SHA-256 se conserva
en [selección aprobada](PIXABAY_CARTOON_SFX_SELECCIONADOS_2026-10-29.md).
Se encontraron los tres originales en Descargas y se verificaron contra esos
hashes, sin esperar el ZIP anunciado, sin descargar ni regenerar ningún sonido.
La importación copia bytes idénticos, sin recorte, normalización ni recodificación.
Ganancia de reproducción inicial: volumen de efectos 40 % por factor conservador
0,5; no modifica el MP3 ni certifica un nivel auditivo físico.

| ID | Integración de esta entrega |
|---|---|
| ui_open_cartoon_6 — AleXZavesa | Solo apertura efectiva de Colección desde otra sección, por acción explícita. Es un panel informativo existente; no se simula inventario. No en cualquier click, cierre, misma sección, carga inicial o historial |
| match_funny_event — lucadialessandro | Original reservado localmente; sin importación en runtime ni disparador. La práctica no tiene un acontecimiento especial aprobado que lo justifique |
| match_defeat_trombone — 11325622 | Original reservado localmente; sin importación en runtime ni disparador. Solo futura derrota real confirmada por la autoridad de partida; jamás error, agotamiento o resultado de práctica |

## Preparación privada y reproducción de la evaluación

Originales en `artifacts/private-cartoon-sfx/`, excluido por el .gitignore existente.
El importador valida los tres hashes antes de escribir y no sobrescribe originales
distintos. Desde la raíz del repositorio:

```powershell
node scripts/audio/import-pixabay-cartoon.mjs C:/Users/Daniel/Downloads
npm.cmd run dev
```

También admite la carpeta del ZIP una vez extraído, con nombres originales.
Los MP3 no se agregan al repositorio público ni se crea catálogo descargable,
galería de reproductores, ZIP público o biblioteca independiente. Solo el sonido
de apertura se incorpora a la aplicación compilada local cuando está disponible,
para su uso contextual en el juego. Los otros dos quedan fuera del bundle.

**Límite importante:** un clon/CI sin los originales privados compila y funciona
en silencio; el control aparece deshabilitado. El push de código no entrega los
binarios ni publica una versión con audio. Antes de una futura publicación se
debe acordar la provisión privada de este único asset en la compilación del juego,
sin introducir los originales como descargas independientes en GitHub. Esta
entrega no configura secretos, CI de assets ni despliegue de Render.

Evaluación: abrir `/`, pulsar **Activar efectos**, luego **Colección**. Ajustar
Volumen de efectos o Silenciar efectos. Esperar al menos cuatro segundos entre
aperturas para probar nuevamente. El sonido no se dispara al activar el control.
El navegador puede bloquearlo; se muestra un reintento explícito al fallar resume.

## Arquitectura mínima y comportamiento

Módulo separado de React: un AudioContext, un bus de efectos, un único buffer y
una voz. `cartoonPolicy` admite solo la apertura asignada; no recibe resultados.
La música aprobada del lobby no se conecta, reproduce ni modifica en este bloque;
sus futuros bus y volumen permanecen independientes.

Consentimiento por sesión mediante botón; preferencia enabled/volumen versionada
en localStorage y tolerante a datos inválidos/almacenamiento bloqueado. Una
preferencia guardada nunca evade autoplay. Volumen cero impide fuentes; silencio
cancela carga pendiente lógicamente y detiene voz. Al ocultar pestaña o desmontar,
se detiene/suspende y se requiere reactivar; no se reproducen eventos perdidos.
Cambio de sección corta el efecto. No cola ni superposición; cooldown de 4 s,
una sola reproducción por apertura, descarte de carga que tarde más de 800 ms.
Red, decode o hash fallidos no bloquean menús y no provocan reintentos automáticos.

Importación siempre verifica SHA-256; runtime verifica de nuevo en localhost/HTTPS
con WebCrypto. En HTTP por Wi-Fi sin WebCrypto se conserva la verificación de
importación, sin prometer validación criptográfica de transporte en ese contexto.
No hay información exclusivamente sonora. Controles nativos con teclado, foco y
etiquetas; sin rediseño del lobby ni cambios al arte de Arena.

## Licencia y verificación

Se consultaron las tres páginas originales, el resumen y términos de Pixabay
el 29-10-2026; las páginas indican Pixabay Content License. Fuentes enlazadas en
el manifiesto. [Resumen](https://pixabay.com/service/license-summary/) y
[términos completos](https://pixabay.com/service/terms/) conservan la prohibición
de distribución standalone. Son recursos de terceros, no composición original
de SEMANTROPIC. No se asegura exclusividad ni se inventa certificado de descarga.

QA reproducible: `npm.cmd run check`, `npm.cmd test`, `npm.cmd run build` y
`$env:ST_BROWSER_CHANNEL='chrome'; node scripts/audio/cartoon-sfx-qa.mjs`.
El script valida decodificación real y llamadas de reproducción, consentimiento,
repetición/cooldown, volumen cero, persistencia, errores JS y overflow en Chrome
headless a 1366×900, 390×844, 844×390 y 320×740. Es QA automatizado/emulado,
no escucha artística ni prueba física. Evidencias locales en `artifacts/cartoon-qa/`.
Pendientes: aprobación auditiva del Director, teléfono físico, iOS/Safari y
provisión privada para una futura compilación publicada. No fusionar antes de evaluar.

### Resultados locales de esta entrega

- TypeScript y build PASS; 67 tests PASS / 0 FAIL; diff --check PASS.
- QA de efectos PASS en las cuatro resoluciones indicadas; interrupción/reanudación
  simulada y rechazo de resume PASS. Chrome instalado ejecutado mediante Playwright.
- Smoke de build oficial PASS en 1366, 390 y 320 px, con rondas de diez preguntas,
  seis categorías, bloqueo de duplicados, resultado 6/10 y reinicio.
- Decodificación de originales: Funny 3,0301875 s, trombón 3,78775 s, Cartoon 6
  2,56 s; todos estéreo. Picos absolutos decodificados: 0,79345 / 0,80029 / 0,84096.
  No son mediciones de true peak ni certifican sonoridad percibida.
- MP3 emitido por Vite conserva el SHA-256 aprobado de Cartoon 6. Música oficial
  conserva SHA-256 e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707.
- Vite confirmado en http://localhost:5173/ y red http://192.168.1.8:5173/;
  acceso comprobado desde PC mediante navegador automatizado. Teléfono físico
  no comprobado. Reinicio: npm.cmd run dev (confirmar puerto en su salida).
