import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const text = path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const manifest = JSON.parse(text('docs/art/B02_SHEET_BINARY_MANIFEST.json'));

test('La galería registra 23 archivos separados, con tamaño y hash verificables',()=>{
  assert.equal(manifest.length,23);
  for(const item of manifest){
    const p = new URL('../'+item.path,import.meta.url);
    assert.ok(existsSync(p),item.path);
    const data=readFileSync(p);
    assert.equal(data.length,item.byte_size,item.path);
    assert.equal(createHash('sha256').update(data).digest('hex'),item.sha256,item.path);
  }
});
test('Conserva los dos modos oficiales y no incorpora CPU/Ranked como botones centrales',()=>{
  const home=text('src/ui/home/HomePreview.tsx');
  assert.match(home,/id="online"/);
  assert.match(home,/id="friends"/);
  assert.equal((home.match(/<ModeButton id=/g)||[]).length,2);
  assert.doesNotMatch(home, /id="cpu"|id="ranked"/);
  assert.match(home,/button className="st-sheet-action" type="button" disabled/);
});
test('El fondo aprobado no se reemplaza con el mapa miniatura de la lámina',()=>{
  const home=text('src/ui/home/HomePreview.tsx');
  assert.match(home,/getApprovedAsset\('environment\/home-main'\)/);
  assert.match(home,/st-home__approved-background/);
  assert.doesNotMatch(home,/map-sheet-reference.webp.*st-home__approved-background/);
});
test('Las imágenes extraídas se clasifican expresamente como candidatas o referencias',()=>{
  const list=text('src/ui/assets/sheetAssets.ts');
  assert.match(list,/candidato/);
  assert.match(list,/referencia/);
  assert.match(list,/state:'referencia'/);
  assert.match(list,/sheetPalette/);
  assert.match(list,/sheetAssets/);
});
test('Vista B01 continua aislada',()=>{
  const app=text('src/App.tsx');
  assert.doesNotMatch(app,/HomePreview|sheetAssets/);
  assert.match(text('vite.config.ts'),/b02-preview\.html/);
});
