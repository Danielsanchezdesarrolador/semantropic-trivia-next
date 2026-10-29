import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const content = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const assetDir = new URL('../public/assets/quiz/b03-b01/', import.meta.url);
const assetNames = readdirSync(assetDir).filter(name => name.endsWith('.svg'));

const categories = ['geografia', 'ciencias', 'historia', 'arte_cultura', 'deportes', 'entretenimiento'];

// No introducir un screenshot como reemplazo de una interfaz funcional.
test('B03-B02: 42 recursos vectoriales individuales, sin textos ni imágenes incrustadas', () => {
  assert.equal(assetNames.length, 42);
  for (const name of assetNames) {
    const svg = content('public/assets/quiz/b03-b01/' + name);
    assert.match(svg, /<svg\b/);
    assert.match(svg, /viewBox=/);
    assert.doesNotMatch(svg, /<text\b|<image\b|<foreignObject\b/);
    assert.doesNotMatch(svg, /<(?:image|script)\b|(?:href|xlink:href)\s*=\s*['\"]https?:/i, 'SVG sin recursos remotos');
  }
});

test('B03-B02: seis categorías con fondos separados de escritorio y móvil', () => {
  const themes = content('src/ui/quiz/categoryThemes.ts');
  for (const category of categories) {
    assert.ok(themes.includes(category), 'Falta categoría ' + category);
    for (const format of ['pc_16x9', 'movil_9x16']) {
      assert.ok(existsSync(new URL('../public/assets/quiz/b03-b01/arena_' + category + '_' + format + '.svg', import.meta.url)));
    }
    assert.ok(existsSync(new URL('../public/assets/quiz/b03-b01/barra_categoria_' + category + '.svg', import.meta.url)));
    assert.ok(existsSync(new URL('../public/assets/quiz/b03-b01/icono_categoria_' + category + '.svg', import.meta.url)));
  }
  assert.match(themes, /QuizCategory/);
});

test('B03-B02: textos, reloj y progreso son componentes, no sprites pintados', () => {
  const jsx = content('src/ui/quiz/QuizPreview.tsx');
  assert.match(jsx, /¿Cuál es la capital de Australia\?/);
  assert.match(jsx, /Sídney|Melbourne|Canberra|Perth/);
  assert.match(jsx, /categoryThemes\[category\]/);
  assert.match(jsx, /setCategory\(id\)/);
  assert.match(jsx, /setAppearance\(id\)/);
  assert.match(jsx, /setTimerAppearance\(id\)/);
  assert.match(jsx, /Array\.from\(\{ length: 10 \}/);
  assert.match(jsx, /sin partida|no se calculan puntos/i);
  assert.doesNotMatch(jsx, /setInterval|setTimeout|correctAnswer|submitAnswer|matchmaking|fetch\(/i);
  assert.doesNotMatch(jsx, /dangerouslySetInnerHTML/);
});

test('B03-B02: preview separada de la portada oficial', () => {
  const entry = content('b03-preview.html');
  const main = content('src/b03-preview-main.tsx');
  const app = content('src/App.tsx');
  const vite = content('vite.config.ts');
  assert.match(entry, /id="b03-root"/);
  assert.match(main, /QuizPreview/);
  assert.doesNotMatch(app, /QuizPreview|b03-preview/);
  assert.match(vite, /b03-preview\.html/);
});

test('B03-B02: estilo minimalista, mobile y sin barra horizontal', () => {
  const css = content('src/ui/quiz/quiz-preview.css');
  assert.match(css, /--quiz-background-desktop/);
  assert.match(css, /--quiz-background-mobile/);
  assert.match(css, /@media\(max-width:600px\)/);
  assert.match(css, /grid-template-columns:1fr/);
  assert.match(css, /\.b03-question/);
  assert.match(css, /\.b03-answer-grid/);
  assert.match(css, /focus-visible/);
});


test('B03-B02-HF1: cabecera y chips proporcionales a sus SVG originales', () => {
  const css = content('src/ui/quiz/quiz-preview.css');
  const smoke = content('scripts/b03-b02-browser-smoke.mjs');
  assert.match(css,/B03-B02-HF1/);
  assert.match(css,/grid-template-columns:15% minmax\(0,1fr\) 19%/);
  assert.match(css,/left:4\.17%/);
  assert.match(css,/width:16\.36%/);
  assert.match(css,/grid-template-columns:repeat\(10,minmax\(0,1fr\)\)/);
  assert.match(css,/text-wrap:balance/);
  assert.match(smoke,/chipCenter/);
  assert.match(smoke,/titleEndsBeforeCount/);
  assert.match(smoke,/progressSegments/);
});
