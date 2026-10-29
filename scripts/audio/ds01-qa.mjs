import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const folder = process.env.DS01_LOCAL_DIR || 'C:/Users/Daniel/semantropic-ds01-qa';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const names = (await readdir(folder)).filter(name => /^(POP01_BOTON_[ABC]|POP02_SELECCION_[AB]|TIKI01_ACIERTO_[ABC]|TOOT01_ERROR_[ABC]|POP03_TIEMPO_[AB])\.mp3$/.test(name));
assert.equal(names.length, 13, 'Se requieren las 13 muestras privadas fuera del repo');
const catalog = JSON.parse(await readFile(resolve(folder, 'CATALOGO.json'), 'utf8'));
for (const name of names) {
  const expected = catalog.find(item => item.archivo + '.mp3' === name)?.sha256_mp3;
  assert.equal(createHash('sha256').update(await readFile(resolve(folder, name))).digest('hex'), expected, name);
}
const browser = await chromium.launch({ channel: process.env.ST_BROWSER_CHANNEL || 'chrome', headless: true });
const log = [];
await mkdir('artifacts/ds01-qa', { recursive: true });
try {
  for (const [width, height] of [[1366, 900], [390, 844], [844, 390], [320, 740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__dsStarts = [];
      const original = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function (when = 0, ...args) {
        window.__dsStarts.push({ seconds: this.buffer.duration, when });
        return original.call(this, when, ...args);
      };
    });
    const page = await context.newPage();
    const errors = [], posts = [], audioRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (request.method() === 'POST') posts.push(request.url());
      if (/POP01_|POP02_|TIKI01_|TOOT01_|POP03_|blob:/.test(request.url())) audioRequests.push(request.url());
    });
    const starts = () => page.evaluate(() => window.__dsStarts);
    const reset = () => page.evaluate(() => { window.__dsStarts = []; });
    await page.goto(url);
    const panel = page.locator('.ds01-panel');
    await panel.locator('summary').first().click();
    await page.getByRole('button', { name: 'Activar DS-01', exact: true }).click();
    await page.getByRole('button', { name: 'Desactivar DS-01', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Colección', exact: true }).click();
    assert.equal((await starts()).length, 0, 'Sin muestras, sin fallback');
    await page.getByRole('button', { name: 'Inicio', exact: true }).click();
    await panel.getByLabel('Cargar 13 MP3 locales').setInputFiles(names.map(name => resolve(folder, name)));
    await page.waitForFunction(() => document.querySelector('.ds01-panel [role=status]')?.textContent.startsWith('13/13'));
    assert.equal((await starts()).length, 0, 'Importar no reproduce');
    for (const [label, variants] of [['Botón / navegación', ['A', 'B', 'C']], ['Seleccionar respuesta', ['A', 'B']], ['Acierto', ['A', 'B', 'C']], ['Error de pregunta', ['A', 'B', 'C']], ['Tiempo agotado', ['A', 'B']]]) {
      assert.deepEqual(await panel.getByLabel(label, { exact: true }).locator('option').allTextContents(), variants);
      for (const variant of variants) {
        await page.waitForTimeout(110);
        await panel.getByLabel(label, { exact: true }).selectOption(variant);
        const before = (await starts()).length;
        await panel.getByRole('button', { name: `Probar ${label}`, exact: true }).click();
        assert.equal((await starts()).length, before + 1, `${label} ${variant}`);
      }
      await panel.getByLabel(label, { exact: true }).selectOption('A');
    }
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: 'Abrir Arena del Conocimiento' }).click();
    await page.locator('.b03-preview-page--official').waitFor();
    await page.waitForTimeout(100);
    const arenaPanel = page.locator('.ds01-panel');
    await arenaPanel.locator('summary').first().click();
    await page.screenshot({ path: `artifacts/ds01-qa/loaded-${width}x${height}.png`, fullPage: true });
    await reset();
    const answers = ['C', 'A', 'C', 'D', 'C', 'B', 'B', 'B', 'C', 'A'];
    const rounds = width === 1366 ? 10 : 2;
    for (let index = 0; index < rounds; index++) {
      await reset();
      if (index === 2) {
        // Real 20 s deadline: no test changes to game clocks, duration or engine.
        await page.waitForTimeout(20100);
        await page.getByRole('status').filter({ hasText: 'Tiempo agotado.' }).waitFor();
        assert.equal((await starts()).length, 1, 'Timeout emite solo una fuente');
        assert.ok(Math.abs((await starts())[0].seconds - .91) < .03);
        await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); });
        await page.waitForTimeout(150);
        assert.equal((await starts()).length, 1, 'Visibilidad/foco no duplican timeout');
      } else {
        const button = page.locator('.b03-answer--interactive').filter({ hasText: new RegExp(`^${answers[index]}`) });
        await button.click();
        if (index < 9) await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
        else await page.getByRole('heading', { name: 'Resultados de la práctica local' }).waitFor();
        assert.equal((await starts()).length, 2, 'Una selección + un feedback');
        assert.ok((await starts())[1].when - (await starts())[0].when >= .119, 'Separación intencional');
        await button.dispatchEvent('click');
        await page.waitForTimeout(100);
        assert.equal((await starts()).length, 2, 'Segunda pulsación no duplica');
      }
      if (index < 9) await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).click();
    }
    if (rounds === 10) {
      await page.getByRole('heading', { name: 'Resultados de la práctica local' }).waitFor();
      await page.getByRole('button', { name: 'Volver a jugar', exact: true }).click();
      await reset();
      await page.locator('.b03-answer--interactive').nth(2).click();
      await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
      assert.equal((await starts()).length, 2, 'Reinicio restablece dedupe');
      await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).click();
      await reset();
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(20100);
      assert.equal((await starts()).length, 0, 'Timeout oculto no suena en background');
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: false });
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
      });
      await page.waitForFunction(() => window.__dsStarts.length === 1);
      await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); });
      await page.waitForTimeout(100);
      assert.equal((await starts()).length, 1, 'Timeout tras retorno una sola vez');
    }
    await page.getByRole('button', { name: 'Desactivar DS-01', exact: true }).click();
    await reset();
    if (await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).count()) {
      await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).click();
    }
    await page.locator('.b03-answer--interactive').first().click();
    await page.getByRole('button', { name: 'Siguiente pregunta', exact: true }).waitFor();
    assert.equal((await starts()).length, 0, 'Silencio no reproduce');
    await page.getByRole('button', { name: 'Volver al lobby', exact: true }).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(posts, [], 'Los archivos nunca se suben');
    assert.deepEqual(audioRequests, [], 'Sin URLs/requests de DS-01');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: `artifacts/ds01-qa/${width}x${height}.png` });
    log.push(`PASS ${width}x${height}: 13 variantes, importación privada, selección/feedback, dedupe, silencio, navegación y responsive; ronda ${rounds} preguntas`);
    console.log(log.at(-1));
    await context.close();
  }
} finally {
  await writeFile('artifacts/ds01-qa/results.txt', log.join('\n'));
  await browser.close();
}
