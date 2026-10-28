import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const assets = [
  'environment/plaza-day',
  'environment/sky-night',
  'environment/islands',
  'brand/logo',
  'characters/left-hero',
  'characters/right-hero',
  'characters/robot',
  'decorations/crystal-cyan',
  'decorations/crystal-warm',
];

test('B02-C2: nueve recursos vectoriales separados sin UI rasterizada', () => {
  for (const id of assets) {
    const path = 'public/assets/home/' + id + '.svg';
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), path);
    const svg = read(path);
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/);
    assert.match(svg, /viewBox=/);
    assert.doesNotMatch(svg, /<image[\s>]/, 'No incrustar captura completa');
    assert.doesNotMatch(svg, /data:image\//, 'No rasterizar la interfaz');
  }
});

test('B02-C2: preview aislada del tablero B01 y sin deploy', () => {
  const app = read('src/App.tsx');
  assert.doesNotMatch(app, /HomePreview|b02-preview/);
  assert.match(read('b02-preview.html'), /id="preview-root"/);
  assert.match(read('vite.config.ts'), /b02-preview\.html/);
  assert.match(read('src/ui/assets/previewAssets.ts'), /candidate-not-approved/);
  assert.match(read('src/ui/assets/assetRegistry.ts'), /state: 'pending-art'/);
});

test('B02-C2: solo dos CTA principales y sin actividades simuladas', () => {
  const home = read('src/ui/home/HomePreview.tsx');
  assert.match(home, /JUGAR ONLINE/);
  assert.match(home, /JUGAR CON AMIGOS/);
  assert.match(home, /Normal 1v1 y clasificatoria 1v1/);
  assert.match(home, /1v1, 2v2, 3v3 y todos contra todos/);
  assert.doesNotMatch(home, /TORNEO CPU|PASE DE TEMPORADA|12\.450|680 monedas/);
  assert.equal((home.match(/<ActionTile/g) || []).length, 2);
  assert.doesNotMatch(home, /onClick=/);
});

test('B02-C2: responsive y movimiento reducido', () => {
  const css = read('src/ui/home/home-preview.css');
  assert.match(css, /max-width: 720px/);
  assert.match(css, /max-width: 420px/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /st-home__scene/);
});

test('B02-C2: el mockup original sigue siendo referencia, nunca textura de pantalla', () => {
  const home = read('src/ui/home/HomePreview.tsx');
  assert.doesNotMatch(home, /mockup.*(png|jpg|webp)/i);
  assert.match(home, /previewAssets.logo/);
  assert.match(home, /previewAssets.leftHero/);
  assert.match(home, /previewAssets.rightHero/);
  assert.match(home, /previewAssets.plaza/);
});
