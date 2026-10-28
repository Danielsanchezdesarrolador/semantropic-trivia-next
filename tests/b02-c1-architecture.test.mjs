import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const get = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('B02-C1 conserva pantalla B01 aislada', () => {
  const app = get('src/App.tsx');
  assert.match(app, /Tablero de estado/);
  assert.doesNotMatch(app, /from ['"]\.\/ui/);
});

test('B02-C1 registra referencia sin falsear assets terminados', () => {
  const data = get('src/ui/assets/assetRegistry.ts');
  assert.match(data, /referenceMockup/);
  assert.match(data, /nativeWidth: 1024/);
  assert.match(data, /nativeHeight: 1536/);
  assert.match(data, /state: 'pending-art'/);
  assert.doesNotMatch(data, /state: 'approved', src: ['"]\//);
  assert.match(data, /return asset.state === 'approved' \? asset.src : null/);
});

test('B02-C1 componentes no simulan jugabilidad ni datos', () => {
  const source = get('src/ui/components/visual-primitives.tsx');
  assert.match(source, /disabled=\{disabled \|\| !onClick\}/);
  assert.match(source, /value: string \| number/);
  assert.match(source, /if \(!src\) return null/);
  assert.ok(!source.includes('12.450'));
});

test('B02-C1 respeta reducción movimiento, foco y scopes', () => {
  const tokens = get('src/ui/theme/semantropic-pop.tokens.css');
  const css = get('src/ui/components/visual-primitives.css');
  assert.match(tokens, /\.st-theme/);
  assert.match(tokens, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
  assert.match(css, /min-height: 44px/);
});

test('B02-C1 documentación y biblioteca disponibles', () => {
  for (const path of [
    'docs/art/B02_C1_DIRECCION_Y_FIDELIDAD.md',
    'src/ui/index.ts',
    'src/ui/assets/assetRegistry.ts',
    'src/ui/components/visual-primitives.tsx',
  ]) assert.ok(existsSync(new URL('../' + path, import.meta.url)), path);
  const docs = get('docs/art/B02_C1_DIRECCION_Y_FIDELIDAD.md');
  assert.match(docs, /Torneo CPU/);
  assert.match(docs, /NO aprobados como funcionalidad/);
});
