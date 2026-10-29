import assert from 'node:assert/strict';

/** Install before navigation; instrument native/mock RAF without touching game state. */
export async function instrumentArcFrames(page) {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const pending = new Set();
    let peak = 0;
    window.requestAnimationFrame = callback => {
      const id = request(timestamp => { pending.delete(id); callback(timestamp); });
      pending.add(id);
      peak = Math.max(peak, pending.size);
      return id;
    };
    window.cancelAnimationFrame = id => { pending.delete(id); cancel(id); };
    window.arcFrameStats = () => ({pending:pending.size,peak});
  });
}

export async function verifyContinuousArc(page, name) {
  const arc = page.locator('.b03-timer-arc__progress');
  const progress = async () => Number(await arc.getAttribute('data-progress'));
  const frames = () => page.evaluate(() => window.arcFrameStats());
  const approx = (actual, expected) => assert.ok(Math.abs(actual-expected)<.001, `${name}: ${actual} vs ${expected}`);
  const started = await page.evaluate(() => Date.now());
  approx(await progress(),1);
  assert.equal(await page.locator('.b03-timer img').getAttribute('src'),'/assets/quiz/b03-b01/temporizador_normal.svg');
  assert.equal((await frames()).pending,1);
  const samples=[];
  for(let i=0;i<5;i++) {
    await page.clock.runFor(32);
    samples.push(await progress());
    assert.equal(await page.locator('.b03-timer span').textContent(),'20');
  }
  assert.ok(samples.every((value,index)=>index===0 || value<samples[index-1]), 'Arco avanza dentro del mismo segundo');
  for(const [elapsed, fraction] of [[5000,.75],[10000,.5],[15000,.25],[20000,0]]) {
    const now=await page.evaluate(()=>Date.now());
    await page.clock.runFor(started+elapsed-now);
    approx(await progress(),fraction);
    approx(Number(await arc.getAttribute('stroke-dashoffset')), (1-fraction)*100);
    if(fraction===0) assert.equal(await arc.evaluate(element=>element.style.opacity),'0');
    await page.screenshot({path:`artifacts/b03-c3/${name}-hf1-${fraction*100}porciento.png`,fullPage:true});
  }
  assert.match(await page.getByRole('status').innerText(),/Tiempo agotado/);
  assert.equal((await frames()).pending,0);
  await page.clock.runFor(3000);
  assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(),1);
  await page.getByRole('button',{name:'Siguiente pregunta'}).click();
  approx(await progress(),1);
  assert.equal((await frames()).pending,1);
  await page.clock.runFor(1234);
  await page.locator('button.b03-answer').nth(1).click();
  approx(await progress(),(20000-1234)/20000);
  const stopped=await arc.getAttribute('stroke-dashoffset');
  assert.equal((await frames()).pending,0);
  await page.clock.runFor(10000);
  assert.equal(await arc.getAttribute('stroke-dashoffset'),stopped,'Congelación subsegundo exacta');
  await page.getByRole('button',{name:'Siguiente pregunta'}).click();
  approx(await progress(),1);

  // Simulated hidden tab: no frames, then a long gap without timer callbacks.
  await page.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  assert.equal((await frames()).pending,0);
  await page.clock.setSystemTime(new Date(await page.evaluate(()=>Date.now())+30000));
  await page.evaluate(()=>{
    Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
    document.dispatchEvent(new Event('visibilitychange'));
  });
  // The arc paints synchronously; React commits the engine's timeout asynchronously.
  // Wait for that observable state before asserting the exact resolved count.
  await page.getByText('Tiempo agotado.',{exact:false}).waitFor();
  approx(await progress(),0);
  assert.equal((await frames()).pending,0);
  assert.equal(await page.locator('.b03-progress img[src$="progreso_completada.svg"]').count(),3);
  await page.getByRole('button',{name:'Salir de Arena del Conocimiento'}).click();
  assert.equal((await frames()).pending,0);
  assert.equal((await frames()).peak,1,'Nunca hay dos RAF pendientes');
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
  approx(await progress(),1);
  assert.equal((await frames()).pending,1);
  // Reload restores document.hidden and starts a clean round for the regression suite.
  await page.reload({waitUntil:'networkidle'});
  console.log('PASS B03-C3-HF1',name,'100/75/50/25/0%; RAF subsegundo único, congelación, reinicio, ocultación y cleanup');
}
