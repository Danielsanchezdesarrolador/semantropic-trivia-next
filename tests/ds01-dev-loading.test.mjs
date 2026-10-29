import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import ts from 'typescript';
import { ds01Middleware, isPrivateHost } from '../scripts/audio/ds01-dev-middleware.mjs';
import approved from '../docs/audio/DS01_MANIFIESTO_QA.json' with { type: 'json' };

const source = ts.transpileModule(readFileSync(new URL('../src/audio/ds01/sha256.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { sha256Hex } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('DS-01: SHA-256 LAN coincide con Node, vectores y fronteras de bloques', () => {
  for (const bytes of [Buffer.alloc(0), Buffer.from('abc'), Buffer.from('a'.repeat(1_000_000)),
    ...[1, 55, 56, 63, 64, 65, 128, 3812, 12860].map(size => randomBytes(size))]) {
    assert.equal(sha256Hex(bytes), createHash('sha256').update(bytes).digest('hex'));
  }
});
async function invoke(handler, path, options = {}) {
  const result = { status: 0, body: undefined, next: false };
  const req = { url: path, method: options.method ?? 'GET', headers: { host: 'localhost:5173', ...options.headers }, socket: { remoteAddress: options.remote ?? '127.0.0.1' } };
  const res = { writeHead(status, headers) { result.status = status; result.headers = headers; }, end(body) { result.body = body; } };
  await handler(req, res, () => { result.next = true; });
  return result;
}
test('DS-01 dev: allowlist, origen privado, traversal, manifiesto, faltantes y hash corrupto', async () => {
  const root = await mkdtemp(join(tmpdir(), 'st-ds01-dev-'));
  try {
    const directory = join(root, '.local-ds01-audio');
    await mkdir(directory);
    await writeFile(join(directory, 'MANIFIESTO_SHA256.json'), JSON.stringify({ archivos: approved.samples.map(item => ({ archivo: item.filename, sha256: item.sha256, tamano: item.bytes })) }));
    const handler = ds01Middleware(root);
    assert.equal((await invoke(handler, '/__qa_ds01__/manifest.json')).status, 200);
    assert.equal((await invoke(handler, '/__qa_ds01__/manifest.json', { method: 'POST' })).status, 405);
    for (const path of ['/__qa_ds01__/', '/__qa_ds01__/../secret.txt', '/__qa_ds01__/%2e%2e%2fsecret', '/__qa_ds01__/sub/POP01_BOTON_A.mp3', '/__qa_ds01__/anything.wav']) {
      assert.equal((await invoke(handler, path)).status, 404, path);
    }
    assert.equal((await invoke(handler, '/.local-ds01-audio/POP01_BOTON_A.mp3')).status, 403);
    assert.equal((await invoke(handler, '/@fs/anything/.local-ds01-audio/POP01_BOTON_A.mp3')).status, 403);
    for (const options of [{ remote: '8.8.8.8' }, { headers: { host: 'evil.example' } },
      { headers: { origin: 'https://evil.example' } }, { headers: { 'sec-fetch-site': 'cross-site' } }]) {
      assert.equal((await invoke(handler, '/__qa_ds01__/manifest.json', options)).status, 403);
    }
    assert.equal((await invoke(handler, '/__qa_ds01__/POP01_BOTON_A.mp3')).status, 404);
    await writeFile(join(directory, 'POP01_BOTON_A.mp3'), Buffer.from('bad mp3'));
    assert.equal((await invoke(handler, '/__qa_ds01__/POP01_BOTON_A.mp3')).status, 422);
    await writeFile(join(directory, 'MANIFIESTO_SHA256.json'), 'bad manifest');
    assert.equal((await invoke(handler, '/__qa_ds01__/manifest.json')).status, 422);
    for (const host of ['127.0.0.1', '::1', '::ffff:127.0.0.1', '192.168.1.8', '10.1.2.3', '172.16.0.1']) assert.equal(isPrivateHost(host), true);
    for (const host of ['8.8.8.8', '172.32.0.1', '192.168.999.1', 'localhost.evil']) assert.equal(isPrivateHost(host), false);
  } finally {
    if (!resolve(root).startsWith(resolve(tmpdir())) || !root.includes('st-ds01-dev-')) throw Error('Temp fuera de ámbito');
    await rm(root, { recursive: true });
  }
});
test('DS-01 dev: rechaza carpeta symlink/junction fuera del proyecto', async () => {
  const root = await mkdtemp(join(tmpdir(), 'st-ds01-link-'));
  try {
    const external = join(root, 'other'); await mkdir(external);
    await symlink(external, join(root, '.local-ds01-audio'), process.platform === 'win32' ? 'junction' : 'dir');
    const response = await invoke(ds01Middleware(root), '/__qa_ds01__/manifest.json');
    assert.equal(response.status, 422);
  } finally {
    if (!resolve(root).startsWith(resolve(tmpdir())) || !root.includes('st-ds01-link-')) throw Error('Temp fuera de ámbito');
    await rm(root, { recursive: true });
  }
});
