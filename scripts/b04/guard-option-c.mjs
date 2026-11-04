// ART-CP01 sucede al runtime B04-C2. Sus manifiestos históricos no se reescriben.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, posix } from 'node:path';
const manifest=JSON.parse(await readFile('docs/art/ASSET_MANIFEST.json','utf8'));
assert.equal(createHash('sha256').update(await readFile('docs/art/ASSET_MANIFEST.json')).digest('hex'),'e6c1414a85ee4aafd78b6362d19eb40a2b246daa9a5bbdbb88dfc8b04c99f093','Manifiesto CP01 original inmutable');
const legacy=JSON.parse(await readFile('docs/art/LEGACY_CP01.json','utf8'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const safe=path=>assert.ok(!path.includes('\\')&&!posix.isAbsolute(path)&&posix.normalize(path)===path&&!path.split('/').includes('..'),'Ruta insegura: '+path);
const paths=manifest.files.map(a=>a.path);assert.equal(new Set(paths).size,paths.length,'Rutas únicas');
assert.equal(manifest.files.filter(a=>a.kind==='official-master'||a.kind==='reference-only'||a.kind==='reference-source').length,10,'Diez fuentes originales');
assert.equal(manifest.canonical_logo,'public/assets/official/brand/semantropic-trivia-logo-1_0-v2.png');
for(const line of (await readFile('docs/art/SHA256SUMS.txt','utf8')).trim().split('\n')){
 const [sha,path]=line.split('  ');safe(path);assert.equal(digest(await readFile(path)),sha,'SHA256SUMS: '+path);
}
for(const asset of manifest.files){
 safe(asset.path);const bytes=await readFile(asset.path);assert.equal(bytes.length,asset.bytes,asset.path);assert.equal(digest(bytes),asset.sha256,'Fuente: '+asset.path);
 if(asset.path.endsWith('.png')){assert.equal(bytes.readUInt32BE(16),asset.width);assert.equal(bytes.readUInt32BE(20),asset.height);}
 if(asset.derived_from)assert.ok(paths.includes(asset.derived_from),'Procedencia: '+asset.path);
 if(asset.path.startsWith('public/'))assert.equal(digest(await readFile('dist/'+asset.path.slice(7))),asset.sha256,'Build: '+asset.path);
}
for(const asset of legacy){safe(asset.archivePath);assert.equal(digest(await readFile(asset.archivePath)),asset.sha256,'Archivo histórico: '+asset.archivePath);assert.ok(!existsSync(asset.previousPath),'Obsoleto en public: '+asset.previousPath);assert.ok(!existsSync('dist/'+asset.previousPath.slice(7)),'Obsoleto en dist: '+asset.previousPath);}
const previous=JSON.parse(await readFile('docs/design/B04/B04_C2_ASSETS.json','utf8'));
for(const asset of [...previous.assets,previous.canonicalLogo]){const archived=legacy.find(x=>x.previousPath===asset.path);assert.ok(archived,'Historia C2 conservada: '+asset.path);assert.equal(archived.sha256,asset.sha256,'SHA histórico original: '+asset.path);}
const expected=manifest.files.filter(a=>a.path.startsWith('public/')).map(a=>a.path.slice(7)).sort();
async function files(root){let result=[];for(const item of await readdir(root,{withFileTypes:true})){const path=join(root,item.name);result.push(...item.isDirectory()?await files(path):[path]);}return result;}
assert.deepEqual((await files('public/assets/official')).map(p=>p.slice(7)).sort(),expected,'Solo assets declarados en manifest');
const forbidden=/Q0[34][_-]|__qa_editorial__|__qa_semantic__|virtual:(?:editorial|semantic)|transferencia-editorial|SEMANTROPIC_TRANSFERENCIA_CODESPACES|(?:src\/|assets\/)(?:editorial|semantic)\//i;
const retired=/assets\/home\/(?:brand\/semantropic-trivia-logo-v1\.png|sheet\/(?:character-boy|character-girl|robot)\.png)|assets\/access\/b04-option-c\//;
const restrictedHashes=new Set(manifest.files.filter(a=>!a.path.startsWith('public/')&&a.path.endsWith('.png')&&a.sha256!==manifest.files.find(f=>f.path===manifest.canonical_logo).sha256).map(a=>a.sha256));
const published=await files('dist');
for(const path of published){
 assert.ok(!forbidden.test(path),'Ruta privada: '+path);assert.ok(!/\.(zip|sf2|wav)$/i.test(path),'Archivo restringido: '+path);
 const bytes=await readFile(path);assert.ok(!restrictedHashes.has(digest(bytes)),'Máster/referencia en runtime: '+path);
 if(/\.(js|css|html|json)$/i.test(path)){const text=bytes.toString('utf8');assert.ok(!forbidden.test(text),'Contenido editorial/semantic privado: '+path);assert.ok(!retired.test(text),'Referencia activa obsoleta: '+path);assert.ok(!/option-c-(?:desktop|mobile)-approved-reference|art\/official\/masters\/.*\.png["']?\s*[,}]/.test(text.replaceAll(/source:"[^"]+"/g,'')),'Composición aplanada activa: '+path);}
}
console.log(`PASS ART-CP01: 28 SHA/dimensiones, 13 assets web, históricos archivados; guard editorial/semantic ${published.length} archivos públicos.`);
