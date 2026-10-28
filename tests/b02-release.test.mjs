import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('B02 oficial: React monta el lobby aprobado sin galería técnica', () => {
  const app=read('src/App.tsx');
  const home=read('src/ui/home/HomePreview.tsx');
  assert.match(app,/HomePreview official showLibrary=\{false\}/);
  assert.match(home, /st-preview-page--official/);
  assert.match(home, /showLibrary \? <ResourceLibrary \/>/);
  assert.match(home, /Modos próximamente/);
  assert.match(home, /Los menús ya se pueden explorar/);
  assert.match(read('index.html'), /SEMANTROPIC TRIVIA 1\.0/);
  assert.doesNotMatch(read('src/main.tsx'), /^import ['"]\.\/styles\.css['"]/m);
});

test('B02 oficial: fondo y logotipo aprobados, dos modos únicamente', () => {
  const home=read('src/ui/home/HomePreview.tsx');
  const assets=read('src/ui/assets/assetRegistry.ts');
  const css=read('src/ui/home/home-preview.css');
  assert.match(home,/getApprovedAsset\('environment\/home-main'\)/);
  assert.match(home,/getApprovedAsset\('brand\/logo'\)/);
  assert.match(assets,/semantropic-pop-bg-v1\.webp/);
  assert.match(assets,/semantropic-trivia-logo-v1\.png/);
  assert.match(home,/ModeButton id="online"/);
  assert.match(home,/ModeButton id="friends"/);
  assert.doesNotMatch(home,/id="cpu"|id="ranked"/);
  assert.match(home,/disabled=\{!onOpen\}/);
  assert.match(css,/st-home__approved-background \{[^}]*height:100%;object-fit:cover/);
});

test('B02 oficial llena el viewport móvil y evita franja inferior fuera del fondo', () => {
  const css = read('src/ui/home/home-preview.css');
  assert.match(css, /st-preview-page--official/);
  assert.match(css, /min-height: 100dvh/);
  assert.match(css, /st-preview-page--official \.st-home/);
  const app = read('src/App.tsx');
  assert.match(app, /HomePreview official showLibrary=\{false\}/);
});
