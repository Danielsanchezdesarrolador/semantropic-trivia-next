import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const temp = await mkdtemp(join(tmpdir(), 'b04-c3-tests-'));
after(() => rm(temp, { recursive: true, force: true }));
async function load(name, source) {
  const file = join(temp, name + '.mjs');
  await writeFile(file, ts.transpileModule(await readFile(source, 'utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
  return import(pathToFileURL(file).href);
}
const {validatePreview, accountsUnavailable} = await load('validation', 'src/ui/access/previewValidation.ts');
const {officialArtAssets, getOfficialAsset, embeddedPortal} = await load('canon', 'src/ui/assets/officialArtAssets.ts');
test('cada formulario exige sus campos y asocia errores a los campos correctos', () => {
  assert.deepEqual(Object.keys(validatePreview('register', {})), ['displayName','email','password','confirm']);
  assert.deepEqual(Object.keys(validatePreview('sign-in', {})), ['email','password']);
  assert.deepEqual(Object.keys(validatePreview('forgot-password', {})), ['email']);
  assert.deepEqual(Object.keys(validatePreview('reset-password', {})), ['password','confirm']);
  assert.deepEqual(Object.keys(validatePreview('verify', {})), ['code']);
  assert.deepEqual(validatePreview('auth-status', {}), {});
});
test('correo, nombre vacío, contraseña mínima y confirmación independientes', () => {
  for (const email of ['x', 'a@', '@b.co', 'a b@c.co', 'a@@b.co', 'a@b']) assert.ok(validatePreview('forgot-password', {email}).email);
  assert.deepEqual(validatePreview('forgot-password', {email:'  prueba+familia@example.invalid  '}), {});
  assert.ok(validatePreview('register', {displayName:'   '}).displayName);
  assert.ok(validatePreview('reset-password', {password:'1234567',confirm:'1234567'}).password);
  assert.ok(validatePreview('reset-password', {password:'12345678',confirm:'87654321'}).confirm);
  assert.deepEqual(validatePreview('reset-password', {password:'12345678',confirm:'12345678'}), {});
  assert.deepEqual(validatePreview('sign-in', {email:'a@b.co',password:'x'}), {});
});
test('código solo valida forma de ejemplo y no promete autenticación', () => {
  for (const code of ['12345', '1234567', 'abcdef', '123 45']) assert.ok(validatePreview('verify', {code}).code);
  assert.deepEqual(validatePreview('verify', {code:'012345'}), {});
  assert.equal(accountsUnavailable, 'Vista previa: las cuentas todavía no están habilitadas');
});
test('canon aprobado enlaza exactamente los cinco WebP inmutables de B04-C2', async () => {
  const manifest = JSON.parse(await readFile('docs/design/B04/B04_C2_ASSETS.json', 'utf8'));
  assert.equal(Object.keys(officialArtAssets).length,5);
  for (const asset of manifest.assets) {
    const canonical = Object.values(officialArtAssets).find(x => 'public' + x.src === asset.path);
    assert.ok(canonical, asset.path);
    assert.equal(canonical.sha256, createHash('sha256').update(await readFile(asset.path)).digest('hex'));
    assert.equal(canonical.sha256, asset.sha256);
    assert.deepEqual([canonical.width,canonical.height],asset.dimensions);
    assert.equal(canonical.transparent,asset.mode === 'RGBA');
    assert.equal(canonical.state,'approved');
    assert.equal(canonical.approvedOn,'2026-11-04');
    assert.equal(canonical.source,asset.source);
    assert.equal(canonical.sourcePackageSha256,manifest.zipSha256);
  }
  for(const id of ['protagonist-male-v1','protagonist-female-v1','mascot-robot-v1']) assert.equal(getOfficialAsset(id).kind,'character');
  assert.equal(embeddedPortal.representation,'embedded-in-background');
  assert.ok(!('src' in embeddedPortal));
  for(const id of embeddedPortal.backgrounds) assert.equal(getOfficialAsset(id).kind,'environment');
});
