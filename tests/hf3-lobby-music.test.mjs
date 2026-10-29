import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { assertPublishable } from '../scripts/audio/guard-ds01.mjs';
const compiled = ts.transpileModule(readFileSync(new URL('../src/audio/lobbyMusic.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const load = dev => import(`data:text/javascript;base64,${Buffer.from(compiled.replaceAll('import.meta.env.DEV', String(dev))).toString('base64')}`);

test('HF3: preparación única, autoplay rechazado, primer gesto, continuidad y mute persistido', async () => {
  const previous = { Audio: globalThis.Audio, document: globalThis.document, localStorage: globalThis.localStorage };
  const data = new Map();
  const media = [];
  let blocked = true;
  globalThis.localStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  globalThis.document = { hidden: false };
  globalThis.Audio = class {
    paused = true; currentTime = 0; calls = 0;
    constructor(src) { this.src = src; media.push(this); }
    async play() { this.calls++; if (blocked) throw Error('NotAllowedError'); this.paused = false; }
    pause() { this.paused = true; }
    removeAttribute() {} load() {}
  };
  try {
    const { LobbyMusic } = await load(true);
    const player = new LobbyMusic();
    player.assignVerified(new Blob(['test-fixture']), 'L7.mp3'); await Promise.resolve(); await Promise.resolve();
    assert.equal(media.length, 1);
    assert.equal(player.playing, false);
    player.prepareDev(); assert.equal(media.length, 1);
    blocked = false; player.interaction(); await Promise.resolve();
    assert.equal(player.playing, true);
    media[0].currentTime = 17;
    const calls = media[0].calls;
    player.setLobby(true); player.interaction();
    assert.equal(media[0].calls, calls);
    assert.equal(media[0].currentTime, 17);
    player.setLobby(false); assert.equal(media[0].paused, true);
    player.setLobby(true); await Promise.resolve(); assert.equal(player.playing, true);
    player.setVolume(.13); player.disable();
    player.interaction(); assert.equal(player.playing, false);
    const reloaded = new LobbyMusic(); reloaded.assignVerified(new Blob(['test-fixture']), 'L7.mp3');
    assert.equal(reloaded.enabled, false); assert.equal(reloaded.volume, .13);
    assert.equal(media[1].calls, 0);
    player.clear(); reloaded.clear();
  } finally { Object.assign(globalThis, previous); }
});

test('HF3: producción sin asignación automática y guard rechaza URL dev en JS público', async () => {
  const { LobbyMusic } = await load(false);
  const player = new LobbyMusic();
  player.prepareDev();
  assert.equal(player.available, false);
  assert.throws(() => assertPublishable('/repo/dist/assets/a.js', Buffer.from(
    'new Audio("/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3")')));
});
