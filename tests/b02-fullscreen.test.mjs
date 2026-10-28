import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const bytes = path => readFileSync(new URL('../' + path, import.meta.url));

test('B02-FS: botón visible solo en home oficial y en sus submenús', () => {
  const home = read('src/ui/home/HomePreview.tsx');
  const control = read('src/ui/home/FullscreenControl.tsx');
  assert.match(home, /import FullscreenControl from '\.\/FullscreenControl'/);
  assert.match(home, /official \? <FullscreenControl \/> : null/);
  assert.match(control, /document\.documentElement/);
  assert.match(control, /requestFullscreen\(\)/);
  assert.match(control, /document\.exitFullscreen\(\)/);
  assert.match(control, /fullscreenchange/);
  assert.match(control, /aria-pressed=\{fullscreen\}/);
  assert.match(control, /onClick=\{\(\) => \{ void toggle\(\); \}\}/);
  assert.match(control, /Cerrar ayuda de pantalla completa/);
  assert.match(control, /Añadir a pantalla de inicio/);
});

test('B02-FS: manifest e integración de iPhone sin servicio offline falso', () => {
  const manifest=JSON.parse(read('public/manifest.webmanifest'));
  const html=read('index.html');
  assert.equal(manifest.name,'SEMANTROPIC TRIVIA 1.0');
  assert.equal(manifest.display,'fullscreen');
  assert.deepEqual(manifest.display_override,['fullscreen','standalone']);
  assert.equal(manifest.start_url,'/');
  assert.equal(manifest.scope,'/');
  assert.match(html,/rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html,/apple-mobile-web-app-capable" content="yes"/);
  assert.match(html,/viewport-fit=cover/);
  assert.doesNotMatch(html,/serviceWorker/);
});

test('B02-FS: iconos PWA PNG reales basados en logo oficial', () => {
  const manifest=JSON.parse(read('public/manifest.webmanifest'));
  const expected={
    '192x192':'6caa93adfb7117e8abc891e7335d2a0ecff8a64493c49ce7edfb2e9560b39e4e',
    '512x512':'69d96108f8fc63ca363a0323feaa5938c2ef37cfc3c8a972fa60edade9cfb737'
  };
  for(const entry of manifest.icons){
    const png=bytes('public'+entry.src);
    const n=Number(entry.sizes.split('x')[0]);
    assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16),n);
    assert.equal(png.readUInt32BE(20),n);
    assert.equal(createHash('sha256').update(png).digest('hex'),expected[entry.sizes]);
  }
});

test('B02-FS: CSS pantalla completa expandido pero no deforma arte',()=>{
  const css=read('src/ui/home/home-preview.css');
  assert.match(css,/html:fullscreen \.st-preview-page--official/);
  assert.match(css,/html:fullscreen \.st-preview-page--official \.st-home/);
  assert.match(css,/max-width:none/);
  assert.match(css,/safe-area-inset-top/);
  assert.match(css,/safe-area-inset-bottom/);
  assert.match(css,/st-fullscreen-control__button:focus-visible/);
  assert.match(css,/prefers-reduced-motion/);
});
