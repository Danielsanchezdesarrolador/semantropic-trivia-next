import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const repo=fileURLToPath(new URL('../',import.meta.url));
const guard=join(repo,'scripts/b04/guard-option-c.mjs');
const manifestPath='docs/art/ASSET_MANIFEST.json';
const manifest=JSON.parse(await readFile(join(repo,manifestPath),'utf8'));
async function fixture(run){
 const root=await mkdtemp(join(tmpdir(),'b04-c2-public-'));
 try {
  const legacy=JSON.parse(await readFile(join(repo,'docs/art/LEGACY_CP01.json'),'utf8'));
  for(const path of [manifestPath,'docs/design/B04/B04_C2_ASSETS.json','docs/art/SHA256SUMS.txt','docs/art/ASSETS_OFICIALES_CANON_CP01.md','docs/art/PROMPT_CODEX_INSTALACION_OFICIAL.txt','docs/art/LEGACY_CP01.json',...manifest.files.map(a=>a.path),...legacy.map(a=>a.archivePath)]){
   await mkdir(dirname(join(root,path)),{recursive:true});await copyFile(join(repo,path),join(root,path));
   if(path.startsWith('public/')){const dist='dist/'+path.slice(7);await mkdir(dirname(join(root,dist)),{recursive:true});await copyFile(join(repo,path),join(root,dist));}
  }
  await run(root);
 }finally{await rm(root,{recursive:true,force:true});}
}
const inspect=root=>spawnSync(process.execPath,[guard],{cwd:root,encoding:'utf8'});
test('ART-CP01 guard acepta los assets CP01 y sus fuentes inmutables',()=>fixture(async root=>{
 const result=inspect(root);assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/guard editorial/);
}));
test('ART-CP01 guard rechaza contenido editorial privado en un bundle público',()=>fixture(async root=>{
 await writeFile(join(root,'dist/leak.js'),'const source="__qa_editorial__";');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Contenido editorial\/semantic privado/);
}));
test('ART-CP01 guard rechaza arte extra no incluido en el runtime autorizado',()=>fixture(async root=>{
 await writeFile(join(root,'public/assets/official/reference.png'),'extra');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Solo assets declarados/);
}));
test('ART-CP01 guard rechaza cambios en bytes del asset servido',()=>fixture(async root=>{
 await writeFile(join(root,'dist/'+manifest.files.find(a=>a.path.startsWith('public/')).path.slice(7)),'changed');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Build:/);
}));

test('ART-CP01 guard rechaza contenido semantic privado',()=>fixture(async root=>{
 await writeFile(join(root,'dist/leak.js'),'const source="__qa_semantic__";');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Contenido editorial\/semantic privado/);
}));
test('ART-CP01 guard rechaza una referencia aplanada renombrada como arte',()=>fixture(async root=>{
 const source=manifest.files.find(a=>a.kind==='reference-only');
 await copyFile(join(repo,source.path),join(root,'dist/renamed.png'));
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Máster\/referencia en runtime/);
}));
