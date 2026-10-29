import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const asset = 'assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3';
const hash = 'e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/hf3-qa', { recursive: true });
try {
  for (const [width, height] of [[1366, 900], [390, 844], [844, 390], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__music = []; window.__playAttempts = 0; window.__sfx = 0;
      const NativeAudio = window.Audio;
      window.Audio = function (src) { const audio = new NativeAudio(src); window.__music.push(audio); return audio; };
      const nativePlay = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        window.__playAttempts++;
        if (!navigator.userActivation.isActive) return Promise.reject(new DOMException('QA autoplay gate', 'NotAllowedError'));
        return nativePlay.call(this);
      };
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) { window.__sfx++; return original.apply(this, args); };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    const bytes = await (await page.request.get(new URL(asset, url).href)).body();
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, 'Bytes servidos exactos');
    await page.waitForFunction(() => window.__music.length === 1 && Number.isFinite(window.__music[0].duration));
    const state = () => page.evaluate(() => ({ count: window.__music.length, time: window.__music[0].currentTime,
      paused: window.__music[0].paused, duration: window.__music[0].duration, loop: window.__music[0].loop,
      volume: window.__music[0].volume, sfx: window.__sfx, attempts: window.__playAttempts }));
    assert.equal(await page.locator('.st-lobby-music input[type=file]').count(), 0);
    assert.equal((await state()).count, 1, 'StrictMode conserva una instancia');
    assert.equal((await state()).paused, true, 'Gate bloquea autoplay');
    assert.equal(await page.getByRole('button', { name: 'Activar música', exact: true }).getAttribute('aria-pressed'), 'false');
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused && window.__music[0].currentTime > .2);
    assert.equal((await state()).sfx, 0, 'Colección sin SFX');
    assert.equal((await state()).volume, .25);
    assert.equal((await state()).loop, true);
    const before = await state();
    await page.getByRole('button', { name: 'Tienda', exact: true }).click();
    await page.getByRole('button', { name: 'Amigos', exact: true }).click();
    await page.getByRole('button', { name: 'Ranking', exact: true }).click();
    assert.equal((await state()).count, 1);
    assert.ok((await state()).time >= before.time, 'Menús no reinician');
    await page.getByLabel('Volumen de música', { exact: true }).fill('13');
    assert.equal((await state()).volume, .13);
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await page.getByRole('button', { name: 'Abrir Arena del Conocimiento' }).click();
    await page.locator('.b03-preview-page--official').waitFor();
    assert.equal((await state()).paused, true);
    const arenaTime = (await state()).time;
    await page.getByRole('button', { name: 'Volver al lobby', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused);
    assert.ok((await state()).time >= arenaTime);
    assert.equal((await state()).count, 1);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal((await state()).paused, true);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    // Native browsers may require another gesture after visibility suspension.
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused);
    await page.getByRole('button', { name: 'Silenciar música', exact: true }).click();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal((await state()).paused, true, 'Silencio manda sobre interacción');
    await page.reload();
    await page.waitForFunction(() => window.__music.length === 1 && Number.isFinite(window.__music[0].duration));
    assert.equal((await state()).paused, true);
    assert.equal((await state()).attempts, 0, 'No autoplay tras preferencia de silencio');
    assert.equal((await state()).volume, .13);
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    assert.equal((await state()).paused, true);
    await page.getByRole('button', { name: 'Activar música', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused);
    await page.evaluate(() => { const audio = window.__music[0]; audio.currentTime = audio.duration - .1; });
    await page.waitForTimeout(600);
    assert.ok((await state()).time < 2 && !(await state()).paused, 'Loop nativo');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `artifacts/hf3-qa/${width}x${height}.png` });
    console.log(`PASS HF3 ${width}x${height}: hash/precarga, sin selector, primera navegación, un player StrictMode, continuidad, HF1, Arena, volumen, mute/recarga, visibilidad y loop`);
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  await page.getByRole('button', { name: 'Inicio', exact: true }).click();
  await page.getByRole('button', { name: 'Silenciar música', exact: true }).waitFor();
  console.log('PASS Chrome sin gate QA: música iniciada con interacción normal y política nativa');
  await context.close();
} finally { await browser.close(); }
