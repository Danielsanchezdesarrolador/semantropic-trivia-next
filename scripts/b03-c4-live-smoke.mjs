import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// Delivery check against an already running Vite. No fake clocks or application overrides.
const baseUrl = process.env.ST_DEV_URL || 'http://localhost:5173/';
const url = new URL('/#arena', baseUrl).href;
const browser = await chromium.launch({ headless:true, channel:process.env.ST_BROWSER_CHANNEL || undefined });
try {
  await mkdir('artifacts/b03-c4', {recursive:true});
  const page = await browser.newPage({viewport:{width:1366,height:900}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if(message.type()==='error') errors.push(message.text()); });
  assert.equal((await page.goto(url,{waitUntil:'networkidle'})).status(),200);
  const arc = page.locator('.b03-timer-arc__progress');
  await arc.waitFor();
  const samples = await page.evaluate(() => new Promise(done => {
    const values=[];
    const frame=()=>{
      values.push(Number(document.querySelector('.b03-timer-arc__progress').getAttribute('data-progress')));
      if(values.length===30) done(values); else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }));
  assert.ok(new Set(samples).size>=25,'Arco se actualiza entre segundos con RAF real');
  assert.ok(samples.every((value,index)=>index===0 || value<=samples[index-1]));
  for (const seconds of [15,10,5,0]) {
    await page.waitForFunction(target => Number(document.querySelector('.b03-timer span').textContent)<=target,seconds,{timeout:25000});
    const fraction = Number(await arc.getAttribute('data-progress'));
    assert.ok(Math.abs(fraction-seconds/20)<.03,`Proporción real en ${seconds} s: ${fraction}`);
    await page.locator('.b03-timer').screenshot({path:`artifacts/b03-c4/reloj-real-${seconds}s.png`});
    console.log('PASS RELOJ REAL',seconds,'segundos, fracción',fraction);
  }
  await page.getByText('Tiempo agotado.',{exact:false}).waitFor();
  assert.equal(await arc.evaluate(element=>element.style.opacity),'0');
  assert.equal(await page.locator('button.b03-answer:disabled').count(),4);
  assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(),1);
  await page.screenshot({path:'artifacts/b03-c4/arena-real-agotada.png',fullPage:true});
  await page.getByRole('button',{name:'Siguiente pregunta'}).click();
  assert.equal(await page.locator('.b03-category-title').textContent(),'Ciencias');
  assert.ok(Number(await arc.getAttribute('data-progress'))>.98);
  await page.locator('button.b03-answer').nth(1).click();
  const stopped = await arc.getAttribute('stroke-dashoffset');
  await page.waitForTimeout(400);
  assert.equal(await arc.getAttribute('stroke-dashoffset'),stopped);
  await page.getByRole('button',{name:'Salir de Arena del Conocimiento'}).click();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).waitFor();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
  assert.equal((await page.locator('.b03-category-count').textContent()).trim(),'1 / 10');
  assert.deepEqual(errors,[]);
  console.log('PASS ENTREGA VITE',url,'reloj real 20s, agotamiento único, avance, congelación y lobby');
} finally { await browser.close(); }
