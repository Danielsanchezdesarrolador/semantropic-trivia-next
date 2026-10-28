import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const address = 'http://127.0.0.1:4185/b02-preview.html';
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4185', '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});
let output = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => { output += String(chunk); });

const waitReady = async () => {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Servidor falló: ' + output);
    try {
      const response = await fetch(address);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error('Vite no inició: ' + output);
};

let browser;
try {
  await waitReady();
  browser = await chromium.launch({ headless: true });
  await mkdir('artifacts/b02-c2', { recursive: true });
  for (const device of [
    { name: 'pc-1366', viewport: { width: 1366, height: 900 }, isMobile: false, hasTouch: false },
    { name: 'mobile-390-emulado', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    { name: 'mobile-320-emulado', viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    const response = await page.goto(address, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200, device.name + ' response');
    await page.getByRole('heading', { name: 'Modalidades oficiales previstas' }).waitFor();
    const actions = page.locator('.st-home__actions button');
    assert.equal(await actions.count(), 2);
    assert.equal(await actions.filter({ hasText: 'JUGAR ONLINE' }).count(), 1);
    assert.equal(await actions.filter({ hasText: 'JUGAR CON AMIGOS' }).count(), 1);
    assert.equal(await page.locator('.st-home__actions button:disabled').count(), 2, 'Sin simular interacción');
    const imgs = await page.locator('.st-home__asset').evaluateAll(items => items.map(i => ({
      src: i.getAttribute('src'),
      complete: i.complete,
      naturalWidth: i.naturalWidth,
      naturalHeight: i.naturalHeight,
    })));
    assert.equal(imgs.length, 1, 'Solo fondo oficial integrado por ahora');
    assert.ok(imgs[0].src?.endsWith('/assets/home/environment/semantropic-pop-bg-v1.webp'));
    assert.equal(imgs[0].naturalWidth, 1672);
    assert.equal(imgs[0].naturalHeight, 941);
    assert.ok(imgs.every(x => x.complete && x.naturalWidth > 0), 'Falta ilustración ' + JSON.stringify(imgs));
    const layout = await page.evaluate(() => ({
      vw: window.innerWidth,
      contentWidth: document.documentElement.scrollWidth,
      stageWidth: document.querySelector('.st-home')?.getBoundingClientRect().width,
      title: document.title,
    }));
    assert.ok(layout.contentWidth <= layout.vw + 1, 'Overflow horizontal ' + device.name + ': ' + JSON.stringify(layout));
    assert.deepEqual(errors, [], 'Errores JS/console ' + device.name);
    const shot = 'artifacts/b02-c2/' + device.name + '.png';
    await page.screenshot({ path: shot, fullPage: true });
    console.log('PASS B02-C2', device.name, 'HTTP', response.status(), JSON.stringify(layout), 'images', imgs.length, 'capture', shot);
    await context.close();
  }
} catch (error) {
  console.error('FAIL B02-C2:', error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
// Vite puede conservar tuberías abiertas en un proceso nieto del npm CLI.
// El resultado se fija tras finalizar el navegador y reportar todos los errores.
process.exit(process.exitCode ?? 0);
