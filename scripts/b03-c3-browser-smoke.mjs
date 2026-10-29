import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';
import { instrumentArcFrames, verifyContinuousArc } from './b03-c3-hf1-arc-qa.mjs';

// Local built artifact only. No public endpoint or timing override in the game itself.
const root = resolve('dist');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.webmanifest':'application/manifest+json' };
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : decodeURIComponent(pathname)));
    if (!file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': (types[extname(file)] ?? 'application/octet-stream') + '; charset=utf-8' });
    response.end(data);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise((done, reject) => { server.once('error', reject); server.listen(4189, '127.0.0.1', done); });
let browser;
const correct = ['C', 'B', 'A', 'D', 'C', 'B', 'D', 'A', 'C', 'B'];
const seconds = async page => Number(await page.locator('.b03-timer span').textContent());
const choose = (page, id) => page.locator('button.b03-answer').filter({ has: page.locator('.b03-answer-letter', { hasText: id }) });
const noOverflow = async page => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

try {
  await mkdir('artifacts/b03-c3', { recursive: true });
  browser = await chromium.launch({ headless: true, channel: process.env.ST_BROWSER_CHANNEL || undefined });
  for (const viewport of [{width:1366,height:900}, {width:390,height:844}, {width:320,height:740}, {width:844,height:390}]) {
    const name = `${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({ viewport, isMobile: viewport.width < 900, hasTouch: viewport.width < 900 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text() + ' ' + message.location().url); });
    // Control real Date/performance APIs and native timers, not application state.
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await instrumentArcFrames(page);
    await page.goto('http://127.0.0.1:4189/#arena', { waitUntil:'networkidle' });
    await verifyContinuousArc(page,name);
    assert.equal(await seconds(page), 20);
    assert.equal(await page.locator('.b03-category-pill').count(), 0);

    // Ten correct answers, keyboard interaction, stopped clock, stale events, results, replay.
    for (let i = 0; i < 10; i++) {
      assert.equal((await page.locator('.b03-category-count').textContent()).trim(), `${i + 1} / 10`);
      assert.equal(await seconds(page), 20);
      await page.clock.runFor(3_000);
      assert.equal(await seconds(page), 17);
      if (i === 0) { await choose(page, correct[i]).focus(); await page.keyboard.press('Enter'); }
      else if (viewport.width < 900) await choose(page, correct[i]).tap();
      else await choose(page, correct[i]).click();
      assert.equal(await page.locator('button.b03-answer:disabled').count(), 4);
      const frozen = await seconds(page);
      await page.clock.runFor(25_000);
      assert.equal(await seconds(page), frozen, 'Answer freezes clock');
      await page.locator('button.b03-answer').evaluateAll(buttons => buttons.forEach(button => button.dispatchEvent(new MouseEvent('click',{bubbles:true}))));
      if (i < 9) {
        assert.match(await page.getByRole('status').innerText(), /¡Correcto!/);
        assert.equal(await page.getByRole('button', {name:'Siguiente pregunta'}).evaluate(button => button === document.activeElement), true);
        await page.keyboard.press('Enter');
      }
    }
    assert.match(await page.getByRole('status').innerText(), /Aciertos: 10 de 10 · Errores: 0 · Puntuación: 10 puntos/);
    assert.match(await page.locator('.b03-visual-status').innerText(), /Preguntas completadas: 10 de 10 · Respondidas: 10 · Sin respuesta por tiempo: 0/);
    await noOverflow(page);
    await page.screenshot({ path:`artifacts/b03-c3/${name}-10-correctas.png`, fullPage:true });
    await page.getByRole('button', {name:'Volver a jugar'}).click();
    assert.equal(await seconds(page), 20);
    assert.equal(await page.locator('button.b03-answer:enabled').count(), 4);

    // Wrong answer identifies the correct option, then timeout cannot add another record.
    await choose(page, 'A').click();
    assert.equal(await page.locator('.b03-answer--incorrect').count(), 1);
    assert.equal((await page.locator('.b03-answer--correct .b03-answer-letter').textContent()).trim(), 'C');
    await page.clock.runFor(25_000);
    assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(), 1);
    await page.getByRole('button',{name:'Siguiente pregunta'}).click();
    await page.clock.runFor(10_000);
    assert.equal(await seconds(page), 10);
    assert.equal(await page.locator('.b03-timer-arc__progress').evaluate(arc => arc.style.color), 'rgb(255, 209, 68)');
    await page.clock.runFor(5_000);
    assert.equal(await seconds(page), 5);
    assert.equal(await page.locator('.b03-timer-arc__progress').evaluate(arc => arc.style.color), 'rgb(255, 141, 89)');

    // Jump wall/monotonic time without running a single interval; resume event must expire immediately.
    await page.clock.setSystemTime(new Date(await page.evaluate(() => Date.now()) + 60_000));
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    assert.equal(await seconds(page), 0);
    assert.match(await page.getByRole('status').innerText(), /Tiempo agotado/);
    assert.equal(await page.locator('button.b03-answer:disabled').count(), 4);
    assert.equal(await page.locator('button.b03-answer[aria-pressed=true]').count(), 0);
    await page.screenshot({path:`artifacts/b03-c3/${name}-tiempo-agotado.png`,fullPage:true});
    await page.getByRole('button',{name:'Siguiente pregunta'}).click();
    for (let i = 2; i < 10; i++) {
      assert.equal(await seconds(page), 20);
      await page.clock.fastForward(21_000);
      assert.equal(await seconds(page), 0);
      if (i < 9) await page.getByRole('button',{name:'Siguiente pregunta'}).click();
    }
    assert.match(await page.getByRole('status').innerText(), /Aciertos: 0 de 10 · Errores: 10 · Puntuación: 0 puntos/);
    assert.match(await page.locator('.b03-visual-status').innerText(), /Respondidas: 1 · Sin respuesta por tiempo: 9/);
    await page.clock.fastForward(60_000);
    assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(), 10);
    await page.getByRole('button',{name:'Volver al inicio'}).click();
    await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).waitFor();
    await page.clock.fastForward(60_000); // unmounted clock must not modify the next round.
    await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
    assert.equal(await seconds(page), 20);
    assert.equal((await page.locator('.b03-category-count').textContent()).trim(),'1 / 10');

    // Delayed click after deadline but before the scheduled interval still records a timeout.
    await page.clock.setSystemTime(new Date(await page.evaluate(() => Date.now()) + 21_000));
    await choose(page,'C').click();
    assert.match(await page.getByRole('status').innerText(), /Tiempo agotado/);
    assert.equal(await page.locator('button.b03-answer[aria-pressed=true]').count(),0);
    await noOverflow(page);
    assert.deepEqual(errors, []);
    console.log('PASS B03-C3',name,viewport.width < 900 ? 'táctil emulado + teclado' : 'mouse + teclado','10 correctas; errores; agotamiento; pausa; reanudación; duplicados; reinicio y lobby');
    await context.close();
  }
} catch (error) { console.error('FAIL B03-C3',error); process.exitCode=1; }
finally { if (browser) await browser.close(); await new Promise(done => server.close(done)); }
