import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('artifacts/ds01-auto-qa', { recursive: true });
try {
  for (const [width, height] of [[1366, 900], [390, 844], [844, 390], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__dsStarts = []; window.__music = [];
      const AudioOriginal = window.Audio;
      window.Audio = function (src) { const audio = new AudioOriginal(src); window.__music.push(audio); return audio; };
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (when = 0, ...args) {
        window.__dsStarts.push({ seconds: this.buffer.duration, when }); return original.call(this, when, ...args);
      };
    });
    const page = await context.newPage();
    const errors = [], requests = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.url().includes('/__qa_ds01__/')) requests.push(request.url());
      if (request.method() === 'POST' || (/^https?:/.test(request.url()) && !request.url().startsWith(url))) external.push(request.url());
    });
    const starts = () => page.evaluate(() => window.__dsStarts);
    const reset = () => page.evaluate(() => { window.__dsStarts = []; });
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.startsWith('13/13'));
    assert.equal((await starts()).length, 0, 'Autocarga sin ruido');
    assert.equal(await page.locator('.ds01-panel input[type=file]').count(), 0);
    assert.equal(await page.locator('.ds01-panel').evaluate(el => el.open), false, 'Panel inicialmente plegado');
    assert.equal(requests.length, 14); assert.equal(new Set(requests).size, 14, 'Una carga, incluso StrictMode');
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    await page.getByRole('button', { name: 'Silenciar efectos DS-01', exact: true }).waitFor();
    assert.equal((await starts()).length, 0, 'Colección silenciosa con SFX habilitados');
    await page.waitForFunction(() => window.__music.length === 1 && !window.__music[0].paused);
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    assert.equal((await starts()).length, 1, 'POP01 en acción real');
    const panel = page.locator('.ds01-panel');
    await panel.locator('summary').first().click();
    for (const [label, variants] of [['Botón / navegación', ['A','B','C']], ['Seleccionar respuesta', ['A','B']], ['Acierto', ['A','B','C']], ['Error de pregunta', ['A','B','C']], ['Tiempo agotado', ['A','B']]]) {
      assert.deepEqual(await panel.getByLabel(label, { exact: true }).locator('option').allTextContents(), variants);
      for (const variant of variants) {
        await page.waitForTimeout(110);
        await panel.getByLabel(label, { exact: true }).selectOption(variant);
        const count = (await starts()).length;
        await panel.getByRole('button', { name: `Probar ${label}`, exact: true }).click();
        assert.equal((await starts()).length, count + 1, `${label} ${variant}`);
        await page.waitForTimeout(Math.ceil((await starts()).at(-1).seconds * 1000) + 30);
      }
      await panel.getByLabel(label, { exact: true }).selectOption('A');
    }
    await page.waitForTimeout(1100);
    await page.getByRole('button', { name: 'Abrir Arena del Conocimiento' }).click();
    await page.locator('.b03-preview-page--official').waitFor();
    await page.getByRole('button', { name: 'Silenciar efectos DS-01', exact: true }).waitFor();
    await page.screenshot({ path: `artifacts/ds01-auto-qa/arena-${width}x${height}.png`, fullPage: true });
    assert.equal(await page.evaluate(() => window.__music[0].paused), true);
    assert.equal(requests.length, 14, 'Navegar no recarga muestras');
    const answers = ['C','A','C','D','C','B','B','B','C','A'];
    const total = width === 1366 ? 10 : 2;
    for (let index = 0; index < total; index++) {
      await reset();
      if (index === 2) {
        await page.waitForTimeout(20100);
        await page.getByRole('status').filter({ hasText: 'Tiempo agotado.' }).waitFor();
        assert.equal((await starts()).length, 1);
        assert.ok(Math.abs((await starts())[0].seconds - .91) < .03);
        await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); });
        await page.waitForTimeout(100); assert.equal((await starts()).length, 1);
      } else {
        const button = page.locator('.b03-answer--interactive').filter({ has: page.locator('.b03-answer-letter', { hasText: answers[index] }) });
        await button.click();
        if (index < 9) await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
        else await page.getByRole('heading', { name: 'Resultados de la práctica local' }).waitFor();
        assert.equal((await starts()).length, 2, 'Una selección + un feedback');
        assert.ok((await starts())[1].when - (await starts())[0].when >= .119);
        await button.dispatchEvent('click'); await page.waitForTimeout(100);
        assert.equal((await starts()).length, 2, 'Sin duplicación');
      }
      if (index < 9) await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).click();
    }
    if (total === 10) {
      await page.getByRole('button', { name: 'Volver a jugar', exact: true }).click();
      await reset();
      await page.locator('.b03-answer--interactive').nth(2).click();
      await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
      assert.equal((await starts()).length, 2, 'Reinicio sin duplicados');
    }
    await page.getByRole('button', { name: 'Volver al lobby', exact: true }).click();
    await page.waitForFunction(() => !window.__music[0].paused);
    assert.equal(requests.length, 14);
    await page.getByRole('button', { name: 'Silenciar efectos DS-01', exact: true }).click();
    await reset(); await page.getByRole('button', { name: 'Colección', exact: true }).click();
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    assert.equal((await starts()).length, 0);
    await page.reload();
    await page.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.startsWith('13/13'));
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal((await starts()).length, 0, 'Silencio persistido');
    assert.equal(requests.length, 28); // Once per page, never persisted audio.
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    await page.screenshot({ path: `artifacts/ds01-auto-qa/${width}x${height}.png`, fullPage: true });
    console.log(`PASS AUTO ${width}x${height}: 13 hashes/decode/variantes, 14 requests/page, sin selector/ruido/importación, gesto, música/HF1, ronda ${total}, dedupe, 120ms, mute/recarga y responsive`);
    await context.close();
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route('**/__qa_ds01__/TIKI01_ACIERTO_C.mp3', route => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.includes('12/13'));
  assert.match(await page.locator('.ds01-panel [role=status]').textContent(), /TIKI01_ACIERTO_C.mp3: HTTP 404/);
  await page.getByRole('button', { name: 'Abrir Arena del Conocimiento' }).click();
  await page.locator('.b03-answer--interactive').nth(2).click();
  await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
  console.log('PASS muestra faltante específica: 12/13, error con nombre, partida funcional');
  await context.close();
  const direct = await browser.newContext();
  await direct.addInitScript(() => {
    window.__dsContexts = 0; window.__dsDirect = 0;
    const NativeContext = window.AudioContext;
    window.AudioContext = class extends NativeContext { constructor(...args) { super(...args); window.__dsContexts++; } };
    Object.defineProperty(window.crypto, 'subtle', { configurable: true, value: undefined });
    const original = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args) { window.__dsDirect++; return original.apply(this, args); };
  });
  const directPage = await direct.newPage();
  const directRequests = [];
  directPage.on('request', request => { if (request.url().includes('/__qa_ds01__/')) directRequests.push(request.url()); });
  await directPage.goto(url + '#arena');
  await directPage.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.startsWith('13/13'));
  assert.equal(await directPage.evaluate(() => window.__dsContexts), 1);
  await directPage.evaluate(async () => {
    const module = await import('/src/audio/ds01/autoLoadDev.ts');
    await Promise.all([module.prepareDS01Dev(), module.prepareDS01Dev()]);
  });
  assert.equal(directRequests.length, 14, 'Reentrada de cargador no vuelve a pedir muestras');
  await directPage.getByRole('button', { name: 'Activar efectos DS-01', exact: true }).click();
  await directPage.getByRole('button', { name: 'Silenciar efectos DS-01', exact: true }).waitFor();
  await directPage.locator('.b03-answer--interactive').nth(2).click();
  await directPage.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
  assert.equal(await directPage.evaluate(() => window.__dsDirect), 2);
  assert.equal((await directPage.request.get(url + '.local-ds01-audio/POP01_BOTON_A.mp3')).status(), 403);
  assert.equal((await directPage.request.get(url + 'POP01_BOTON_B.mp3')).status(), 403);
  console.log('PASS entrada directa Arena/control explícito, SHA sin WebCrypto (LAN simulado), un contexto, reentrada sin recargas y rutas directas denegadas');
  await direct.close();
} finally { await browser.close(); }
