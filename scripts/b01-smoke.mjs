import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const url = process.env.B01_PUBLIC_URL;
assert.ok(url?.startsWith('https://'), 'Se requiere B01_PUBLIC_URL HTTPS');
await mkdir('artifacts', { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const device of [
    { name: 'desktop', viewport: { width: 1366, height: 768 }, isMobile: false, hasTouch: false },
    { name: 'mobile-emulated', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, isMobile: device.isMobile, hasTouch: device.hasTouch });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    let response;
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        if (response?.status() === 200) break;
      } catch (error) {
        if (attempt === 7) throw error;
      }
      await page.waitForTimeout(5000);
    }
    assert.equal(response?.status(), 200, 'HTTP 200 ' + device.name);
    await page.getByRole('heading', { name: 'SEMANTROPIC TRIVIA' }).waitFor({ state: 'visible' });
    assert.equal(await page.locator('h1').innerText(), 'SEMANTROPIC TRIVIA');
    assert.ok(await page.getByText('Aún no es una partida', { exact: false }).isVisible());
    const layout = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      pageTitle: document.title,
    }));
    assert.ok(layout.content <= layout.viewport + 1, 'Overflow horizontal en ' + device.name + ': ' + JSON.stringify(layout));
    assert.deepEqual(errors, [], 'Errores JS/consola en ' + device.name);
    await page.screenshot({ path: 'artifacts/' + device.name + '.png', fullPage: true });
    console.log('PASS', device.name, 'HTTP', response.status(), JSON.stringify(layout));
    await context.close();
  }
} finally {
  await browser.close();
}
