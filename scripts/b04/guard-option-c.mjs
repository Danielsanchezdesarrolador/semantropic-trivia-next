import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const manifest=JSON.parse(await readFile('docs/design/B04/B04_C2_ASSETS.json','utf8'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const expected=manifest.assets.map(x=>x.path.split('/').pop()).sort();
assert.equal(expected.length,5);
assert.deepEqual((await readdir('public/assets/access/b04-option-c')).sort(),expected,'Solo cinco assets necesarios; sin referencias ni arte no usado');
assert.equal(digest(await readFile(manifest.canonicalLogo.path)),manifest.canonicalLogo.sha256,'Logo canónico preservado');
for(const asset of manifest.assets){
 assert.equal(digest(await readFile(asset.path)),asset.sha256,asset.path);
 assert.equal(digest(await readFile('dist/'+asset.path.slice('public/'.length))),asset.sha256,'Build: '+asset.path);
}
assert.equal(digest(await readFile('dist/'+manifest.canonicalLogo.path.slice('public/'.length))),manifest.canonicalLogo.sha256);

// Guard editorial autónomo: audita únicamente el árbol que realmente se publica.
const forbidden=/Q0[34][_-]|__qa_editorial__|virtual:editorial|__qa_semantic__|transferencia-editorial|SEMANTROPIC_TRANSFERENCIA_CODESPACES/i;
let count=0;
async function scan(root){
 for(const item of await readdir(root,{withFileTypes:true})){
  const path=join(root,item.name);
  assert.ok(!forbidden.test(path), 'Ruta privada: '+path);
  assert.ok(!/\.(zip|sf2|wav)$/i.test(item.name),'Archivo restringido/no permitido: '+path);
  if(item.isDirectory())await scan(path);
  else {
   count++;
   if(/\.(js|css|html|json)$/i.test(path))assert.ok(!forbidden.test(await readFile(path,'utf8')),'Contenido editorial privado: '+path);
  }
 }
}
await scan('dist');
console.log(`PASS B04-C2: cinco WebP con SHA exacto, logo preservado; guard editorial ${count} archivos públicos.`);
