import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const track = process.env.LOBBY_LOCAL_FILE || 'C:/Users/Daniel/Downloads/18_lobby_pop_familiar.mp3';
const dsButton = resolve(process.env.DS01_LOCAL_DIR || 'C:/Users/Daniel/semantropic-ds01-qa', 'POP01_BOTON_A.mp3');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/hf1-hf2-qa', { recursive: true });
try {
  for (const [width, height] of [[1366, 900], [390, 844], [844, 390], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__music = []; window.__sfx = 0;
      const NativeAudio = window.Audio;
      window.Audio = function (src) { const audio = new NativeAudio(src); window.__music.push(audio); return audio; };
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) { window.__sfx++; return original.apply(this, args); };
    });
    const page = await context.newPage();
    const errors = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith(url)) external.push(request.url()); });
    await page.goto(url);
    const music = page.getByText('Música · QA local', { exact: true });
    await music.click();
    await page.getByLabel('Cargar 18_lobby_pop_familiar.mp3').setInputFiles(track);
    await page.getByRole('button', { name: 'Activar música', exact: true }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Activar música', exact: true }).click();
    await page.waitForFunction(() => window.__music.length === 1 && !window.__music[0].paused && window.__music[0].currentTime > .3);
    const state = () => page.evaluate(() => ({ count: window.__music.length, time: window.__music[0].currentTime,
      paused: window.__music[0].paused, duration: window.__music[0].duration, loop: window.__music[0].loop, volume: window.__music[0].volume, sfx: window.__sfx }));
    assert.ok(Number.isFinite((await state()).duration));
    assert.equal((await state()).loop, true);
    assert.equal((await state()).volume, .25);
    const dsPanel = page.locator('.ds01-panel');
    await dsPanel.locator('summary').first().click();
    await dsPanel.getByLabel('Cargar 13 MP3 locales').setInputFiles(dsButton);
    await page.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.startsWith('1/13'));
    await page.getByRole('button', { name: 'Activar DS-01', exact: true }).click();
    await page.getByRole('button', { name: 'Desactivar DS-01', exact: true }).waitFor();
    for (let i = 0; i < 3; i++) {
      const before = await state();
      await page.getByRole('button', { name: 'Colección', exact: true }).click();
      const after = await state();
      assert.equal(after.sfx, before.sfx, 'Colección: ni click ni entrada');
      assert.equal(after.count, 1); assert.equal(after.paused, false);
      assert.ok(after.time >= before.time, 'Música no vuelve a cero al cambiar menú');
      await page.waitForTimeout(110);
      await page.getByRole('button', { name: 'Inicio', exact: true }).click();
      assert.equal((await state()).sfx, before.sfx + 1, 'Inicio conserva efecto');
      await page.waitForTimeout(110);
    }
    await page.getByLabel('Volumen de música', { exact: true }).fill('10');
    assert.equal(await page.getByLabel('Volumen DS-01', { exact: true }).inputValue(), '50');
    await page.getByLabel('Volumen DS-01', { exact: true }).fill('0');
    assert.equal((await state()).volume, .1, 'Buses/volúmenes independientes');
    await page.evaluate(() => { const audio = window.__music[0]; audio.currentTime = audio.duration - .1; });
    await page.waitForTimeout(600);
    assert.ok((await state()).time < 2 && !(await state()).paused, 'Bucle sigue reproduciendo');
    await page.getByRole('button', { name: 'Abrir Arena del Conocimiento' }).click();
    await page.locator('.b03-preview-page--official').waitFor();
    assert.equal((await state()).paused, true, 'Arena sin música de lobby');
    await page.getByRole('button', { name: 'Volver al lobby', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused);
    assert.equal((await state()).count, 1, 'Regreso conserva reproductor');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal((await state()).paused, true);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => !window.__music[0].paused);
    await page.getByRole('button', { name: 'Desactivar música', exact: true }).click();
    assert.equal((await state()).paused, true);
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal((await state()).paused, true, 'Respeta silencio');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    await page.screenshot({ path: `artifacts/hf1-hf2-qa/${width}x${height}.png` });
    console.log(`PASS HF1/HF2 ${width}x${height}: track exacto, decode/play, un reproductor, loop, continuidad, Colección sin SFX, Arena/visibilidad/mute y volúmenes independientes`);
    await context.close();
  }
  const context = await browser.newContext();
  await context.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(Error('autoplay')); });
  const page = await context.newPage();
  await page.goto(url); await page.getByText('Música · QA local', { exact: true }).click();
  await page.getByLabel('Cargar 18_lobby_pop_familiar.mp3').setInputFiles(track);
  await page.getByRole('button', { name: 'Activar música', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'El navegador no permitió reproducir' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Activar música', exact: true }).getAttribute('aria-pressed'), 'false');
  await page.getByRole('button', { name: 'Colección', exact: true }).click();
  console.log('PASS HF2 autoplay rechazado: no falsa confirmación, navegación intacta');
  await context.close();
} finally { await browser.close(); }
