import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import catalog from '../docs/audio/SFX02_CATALOGO.json' with { type: 'json' };
import { assertPublishable } from '../scripts/audio/guard-ds01.mjs';

test('SFX-02 release: siete originales exactos, sin fanfarrias reservadas ni maquetas', () => {
  const root = new URL('../src/audio/sfx02/assets/', import.meta.url);
  const items = catalog.items.filter(item => !['W1', 'D2'].includes(item.code));
  assert.deepEqual(readdirSync(root).filter(name => name.endsWith('.mp3')).sort(), items.map(item => item.downloaded_filename).sort());
  for (const item of items) {
    const bytes = readFileSync(new URL(item.downloaded_filename, root));
    assert.equal(bytes.length, item.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256);
    assert.doesNotThrow(() => assertPublishable('/repo/src/audio/sfx02/assets/' + item.downloaded_filename, bytes));
    assert.doesNotThrow(() => assertPublishable('/repo/dist/assets/' + item.downloaded_filename, bytes));
    assert.throws(() => assertPublishable('/repo/public/downloads/' + item.downloaded_filename, bytes));
    const corrupt = Buffer.from(bytes); corrupt[corrupt.length - 1] ^= 1;
    assert.throws(() => assertPublishable('/repo/dist/assets/' + item.downloaded_filename, corrupt));
  }
});

test('SFX-02 release: el histórico se conserva en fuente y se prohíbe en dist', () => {
  const bytes = readFileSync(new URL('../public/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3', import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707');
  assert.throws(() => assertPublishable('/repo/dist/assets/historical.mp3', bytes));
});

test('SFX-02 release: motor público reproduce oficiales y rechaza DS-01/W1/D2', async () => {
  const compile = name => ts.transpileModule(readFileSync(new URL(name, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const url = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  const catalogUrl = url(compile('../src/audio/ds01/catalog.ts'));
  const module = await import(url(compile('../src/audio/ds01/audioEngine.ts').replaceAll("'./catalog'", `'${catalogUrl}'`).replaceAll('import.meta.env.DEV', 'false')));
  const previous = { AudioContext: globalThis.AudioContext, document: globalThis.document };
  const started = [];
  globalThis.document = { hidden: false };
  globalThis.AudioContext = class {
    state = 'running'; currentTime = 0; destination = {};
    async resume() {}
    createGain() { return { gain: { value: 0, setTargetAtTime() {} }, connect() {} }; }
    async decodeAudioData(bytes) { return { duration: 1, numberOfChannels: 1, tag: new Uint8Array(bytes)[0] }; }
    createBufferSource() { const voice = { connect() {}, disconnect() {}, stop() {}, start() { started.push(voice.buffer.tag); } }; return voice; }
  };
  try {
    const engine = new module.DS01AudioEngine(); engine.beginOfficial(); await engine.enable();
    for (const [code, tag] of [['A1', 1], ['X3', 2], ['M1', 3], ['W1', 4], ['D2', 5]]) await engine.importApproved(code, Uint8Array.of(tag).buffer);
    await engine.importFiles([{ name: 'POP03_TIEMPO_A.mp3', size: 1, arrayBuffer: async () => Uint8Array.of(6).buffer }]);
    engine.navigation('M1'); engine.play(['correct']); engine.play(['incorrect']); engine.play(['timeout']);
    engine.playApproved('W1', true); engine.playApproved('D2', true);
    assert.deepEqual(started, [3, 1, 2]);
    assert.equal(engine.samples.length, 0); assert.equal(engine.hasApproved('W1'), false);
  } finally { Object.assign(globalThis, previous); }
});
