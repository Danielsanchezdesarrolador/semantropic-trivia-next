import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, channel: process.env.ST_BROWSER_CHANNEL || undefined });
await mkdir('artifacts/cartoon-qa', { recursive: true });
try {
  const inspection = await browser.newPage();
  for (const [id, seconds] of [['match_funny_event', 3.03], ['match_defeat_trombone', 3.788], ['ui_open_cartoon_6', 2.56]]) {
    const original = await readFile(`artifacts/private-cartoon-sfx/${id}.mp3`);
    const result = await inspection.evaluate(async base64 => {
      const ctx = new AudioContext();
      try {
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const buffer = await ctx.decodeAudioData(bytes.buffer);
        let peak = 0;
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
          for (const value of buffer.getChannelData(channel)) peak = Math.max(peak, Math.abs(value));
        }
        return { duration: buffer.duration, channels: buffer.numberOfChannels, peak };
      } finally { await ctx.close(); }
    }, original.toString('base64'));
    assert.ok(Math.abs(result.duration - seconds) < 0.1, `${id}: duración`);
    assert.ok(result.peak > 0 && result.peak <= 1.05, `${id}: pico decodificado`);
    console.log(`DECODE ${id}: ${JSON.stringify(result)}`);
  }
  await inspection.close();
  for (const [width, height] of [[1366, 900], [390, 844], [844, 390], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__audioStarts = [];
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (...args) {
        window.__audioStarts.push(this.buffer.duration);
        return original.apply(this, args);
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const starts = () => page.evaluate(() => window.__audioStarts.length);
    await page.goto(url);
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal(await starts(), 0, 'Silencioso antes de consentimiento');
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await page.getByRole('button', { name: 'Activar efectos', exact: true }).click();
    await page.getByRole('button', { name: 'Silenciar efectos', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    await page.waitForFunction(() => window.__audioStarts.length === 1);
    assert.ok(await page.evaluate(() => Math.abs(window.__audioStarts[0] - 2.56) < 0.1), 'MP3 decodificado real');
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal(await starts(), 1, 'No repetición del mismo panel');
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal(await starts(), 1, 'Cooldown evita cascada');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.getByRole('button', { name: 'Activar efectos', exact: true }).waitFor();
    assert.equal(await starts(), 1, 'Reanudación no repite eventos');
    await page.getByRole('button', { name: 'Activar efectos', exact: true }).click();
    await page.getByRole('button', { name: 'Silenciar efectos', exact: true }).waitFor();
    await page.getByRole('slider', { name: 'Volumen de efectos' }).fill('0');
    await page.waitForTimeout(4100);
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal(await starts(), 1, 'Volumen cero no dispara fuentes');
    await page.getByRole('button', { name: 'Silenciar efectos', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Activar efectos', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal(await starts(), 0, 'Silencio persistido tras recarga');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Sin overflow');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `artifacts/cartoon-qa/${width}x${height}.png` });
    console.log(`PASS ${width}x${height}: consentimiento, decode, evento, dedupe, cooldown, volumen, persistencia, overflow`);
    await context.close();
  }
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { AudioContext.prototype.resume = () => Promise.reject(Error('Bloqueado')); });
  const page = await blocked.newPage();
  await page.goto(url);
  await page.getByRole('button', { name: 'Activar efectos', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'No se pudo activar' }).waitFor();
  await page.getByRole('button', { name: 'Colección', exact: true }).click();
  await page.getByRole('heading', { name: 'Colección', exact: true }).waitFor();
  console.log('PASS autoplay rechazado: aviso, navegación funcional, sin error no capturado');
  await blocked.close();
} finally { await browser.close(); }
