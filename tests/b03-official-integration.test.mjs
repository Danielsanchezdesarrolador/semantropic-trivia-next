import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('B03 aprobado: la arena tiene ruta de entrada y regreso, conservando el lobby B02',()=>{
  const home=read('src/ui/home/HomePreview.tsx');
  const navigation=read('src/ui/home/lobbyNavigation.ts');
  assert.match(home,/import QuizPreview from '\.\.\/quiz\/QuizPreview'/);
  assert.match(home,/screen === 'arena'/);
  assert.match(home,/<QuizPreview official onExit/);
  assert.match(home,/Abrir Arena del Conocimiento/);
  assert.match(home,/Los menús ya se pueden explorar/);
  assert.match(navigation,/'arena'/);
  assert.match(navigation,/hashchange/);
  const app=read('src/App.tsx');
  assert.match(app,/HomePreview official showLibrary=\{false\}/);
});

test('B03 aprobado: laboratorio conserva controles, portada oculta herramientas técnicas',()=>{
  const quiz=read('src/ui/quiz/QuizPreview.tsx');
  assert.match(quiz,/official = false/);
  assert.match(quiz,/b03-preview-page--official/);
  assert.match(quiz,/official \? <p className="b03-visual-status"/);
  assert.match(quiz,/onClick=\{onExit\}/);
  assert.match(quiz,/Salir de Arena del Conocimiento/);
  assert.match(quiz,/setAppearance\(id\)/);
  assert.match(quiz,/setTimerAppearance\(id\)/);
  assert.match(quiz,/setCategory\(id\)/);
  assert.match(quiz,/Las respuestas, el reloj y la puntuación todavía no son jugables/);
  assert.doesNotMatch(quiz,/setInterval|correctAnswer|submitAnswer|matchmaking|fetch\(/i);
  const lab=read('b03-preview.html');
  assert.match(lab,/id="b03-root"/);
});

test('B03 aprobado: CSS de arena está aislado y no reconfigura tema global del lobby',()=>{
  const css=read('src/ui/quiz/quiz-preview.css');
  assert.match(css,/Aislar B03/);
  assert.doesNotMatch(css,/(?:^|\n)\s*:root\s*\{/);
  assert.doesNotMatch(css,/(?:^|\n)\s*html\s*\{/);
  assert.match(css,/b03-preview-page--official/);
  assert.match(css,/b03-back-visual--interactive/);
  assert.match(css,/html:fullscreen \.b03-preview-page--official/);
  const homeCss=read('src/ui/home/home-preview.css');
  assert.match(homeCss,/st-home__arena-entry/);
});

test('B03 aprobado: qa de navegador recorre colores, regreso y no juego ficticio',()=>{
  const smoke=read('scripts/b02-home-official-smoke.mjs');
  assert.match(smoke,/Ruta oficial #arena/);
  assert.match(smoke,/b03-preview-page--official/);
  assert.match(smoke,/b03-category-pill/);
  assert.match(smoke,/b03-state-rows/);
  assert.match(smoke,/Las respuestas no son jugables todavía/);
  assert.match(smoke,/page\.goBack\(\)/);
  assert.match(smoke,/page\.goForward\(\)/);
});
