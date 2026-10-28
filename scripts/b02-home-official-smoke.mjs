import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const publicUrl = process.env.ST_OFFICIAL_URL;
const url = publicUrl || 'http://127.0.0.1:4190/';
let server;
let serverLog = '';
if (!publicUrl) {
  server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4190', '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'], env: process.env,
  });
  for (const channel of [server.stdout, server.stderr]) {
    channel.on('data', chunk => { serverLog += String(chunk); });
  }
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const ready = async () => {
  for (let i = 0; i < 60; i++) {
    if (server?.exitCode != null) throw Error('Error de servidor Vite: ' + serverLog);
    try { if ((await fetch(url)).ok) return; } catch {}
    await sleep(500);
  }
  throw Error('No se pudo abrir la URL: ' + url + ' ' + serverLog);
};

let browser;
try {
  await ready();
  await mkdir('artifacts/b02-official', { recursive: true });
  browser = await chromium.launch({ headless: true });
  for (const device of [
    { name: 'desktop-1366', viewport: { width: 1366, height: 850 }, isMobile: false, hasTouch: false },
    { name: 'mobile-390-emulado', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    { name: 'mobile-320-emulado', viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
    const page = await context.newPage();
    let response;
    let isOfficial = false;
    // En producción puede seguir sirviéndose B01 mientras Render compila el commit.
    // Reintenta y REQUIERE comprobar el lobby oficial real, no solo HTTP 200.
    for (let attempt = 0; attempt < (publicUrl ? 26 : 5); attempt++) {
      try {
        response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        isOfficial = response?.status() === 200 && await page.locator('.st-preview-page--official').count() === 1;
        if (isOfficial) break;
      } catch (error) {
        if (attempt === (publicUrl ? 25 : 4)) throw error;
      }
      await sleep(publicUrl ? 5000 : 1000);
    }
    assert.equal(response?.status(), 200, 'HTTP 200 ' + device.name);
    assert.ok(isOfficial, 'No llegó la nueva portada a ' + url + ' (' + device.name + ')');

    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    await page.locator('.st-home').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.st-library').count(), 0, 'La biblioteca NO debe estar en portada oficial');
    assert.equal(await page.locator('.st-home__actions button').count(), 2);
    assert.equal(await page.locator('.st-home__actions button:disabled').count(), 2);
    assert.equal(await page.locator('.st-sheet-action svg').count(), 2);
    assert.equal(await page.locator('.st-sheet-action img').count(), 0);
    assert.equal(await page.getByText('Modos próximamente', { exact: true }).count(), 1);
    assert.equal(await page.getByText('B02-C2 · PRUEBA DE ASSETS', { exact: true }).count(), 0);
    assert.equal(await page.getByText('Biblioteca de recursos', { exact: false }).count(), 0);

    const state = await page.evaluate(() => {
      const background = document.querySelector('.st-home__approved-background');
      const logo = document.querySelector('.st-home__official-logo');
      const stage = document.querySelector('.st-home__scene');
      return {
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        background: background instanceof HTMLImageElement
          ? { width: background.naturalWidth, height: background.naturalHeight, renderedHeight: background.getBoundingClientRect().height, fit: getComputedStyle(background).objectFit, complete: background.complete }
          : null,
        logo: logo instanceof HTMLImageElement
          ? { width: logo.naturalWidth, height: logo.naturalHeight, complete: logo.complete }
          : null,
        sceneHeight: stage?.getBoundingClientRect().height,
        heading: document.querySelector('h1')?.textContent?.trim(),
      };
    });
    assert.ok(state.background?.complete && state.background.width === 1672 && state.background.height === 941, 'Fondo aprobado cargado: ' + JSON.stringify(state));
    assert.ok(state.logo?.complete && state.logo.width === 585 && state.logo.height === 370, 'Logo oficial cargado: ' + JSON.stringify(state));
    assert.equal(state.background.fit, 'cover');
    assert.ok(Math.abs(state.background.renderedHeight - state.sceneHeight) <= 2, 'Fondo debe cubrir todo el lobby: ' + JSON.stringify(state));
    assert.equal(state.heading, 'SEMANTROPIC TRIVIA');
    assert.ok(state.scrollWidth <= state.viewport + 1, 'Overflow horizontal: ' + JSON.stringify(state));
    assert.deepEqual(errors, [], 'Errores JavaScript: ' + device.name);
    const screenshot = 'artifacts/b02-official/' + device.name + '.png';
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log('PASS HOME OFICIAL', device.name, 'HTTP', response.status(), JSON.stringify(state), screenshot);
    await context.close();
  }
} catch (error) {
  console.error('FAIL HOME OFICIAL', error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
}
process.exit(process.exitCode ?? 0);
