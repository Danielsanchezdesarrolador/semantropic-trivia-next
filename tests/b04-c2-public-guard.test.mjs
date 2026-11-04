import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const repo=fileURLToPath(new URL('../',import.meta.url));
const guard=join(repo,'scripts/b04/guard-option-c.mjs');
const manifestPath='docs/design/B04/B04_C2_ASSETS.json';
const manifest=JSON.parse(await readFile(join(repo,manifestPath),'utf8'));
async function fixture(run){
 const root=await mkdtemp(join(tmpdir(),'b04-c2-public-'));
 try {
  for(const path of [manifestPath,...manifest.assets.map(a=>a.path),manifest.canonicalLogo.path]){
   await mkdir(dirname(join(root,path)),{recursive:true});await copyFile(join(repo,path),join(root,path));
   if(path.startsWith('public/')){const dist='dist/'+path.slice(7);await mkdir(dirname(join(root,dist)),{recursive:true});await copyFile(join(repo,path),join(root,dist));}
  }
  await run(root);
 }finally{await rm(root,{recursive:true,force:true});}
}
const inspect=root=>spawnSync(process.execPath,[guard],{cwd:root,encoding:'utf8'});
test('B04-C2 guard acepta los cinco assets aprobados y logo canónico',()=>fixture(async root=>{
 const result=inspect(root);assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/guard editorial/);
}));
test('B04-C2 guard rechaza contenido editorial privado en un bundle público',()=>fixture(async root=>{
 await writeFile(join(root,'dist/leak.js'),'const source="__qa_editorial__";');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Contenido editorial privado/);
}));
test('B04-C2 guard rechaza arte extra no incluido en el runtime autorizado',()=>fixture(async root=>{
 await writeFile(join(root,'public/assets/access/b04-option-c/reference.png'),'extra');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Solo cinco assets/);
}));
test('B04-C2 guard rechaza cambios en bytes del asset servido',()=>fixture(async root=>{
 await writeFile(join(root,'dist/'+manifest.assets[0].path.slice(7)),'changed');
 const result=inspect(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Build:/);
}));
