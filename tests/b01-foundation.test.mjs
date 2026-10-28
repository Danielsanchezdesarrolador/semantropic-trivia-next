import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const text = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const config = JSON.parse(text('package.json'));

test('B01: dependencias y scripts autorizados', () => {
  assert.equal(config.dependencies.phaser, '4.2.1');
  assert.ok(config.dependencies.react);
  assert.ok(config.devDependencies.vite);
  assert.ok(config.scripts.check.includes('tsc'));
  assert.ok(config.scripts.build.includes('vite build'));
});

test('B01: sitio estático Render, sin backend', () => {
  const render = text('render.yaml');
  assert.match(render, /runtime: static/);
  assert.match(render, /staticPublishPath: dist/);
  assert.match(render, /branch: main/);
  assert.doesNotMatch(render, /runtime: node/);
});

test('B01: tablero técnico no presume juego funcional', () => {
  const page = text('src/App.tsx');
  assert.match(page, /Aún no es una partida/);
  assert.match(page, /No implementados ni desplegados/);
  assert.match(page, /todavía no jugables/);
  assert.doesNotMatch(page, /import .*phaser/i);
});

test('B01: documentación y autoridad de dirección presentes', () => {
  for (const path of [
    'AGENTS.md','README.md','docs/01_VISION.md','docs/02_ROADMAP.md',
    'docs/03_ARQUITECTURA.md','docs/04_MATCHMAKING_BOTS.md',
    'docs/05_QA_Y_ENTREGAS.md','docs/06_DECISIONES.md',
  ]) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), path);
  assert.match(text('AGENTS.md'), /Director del juego/);
});
