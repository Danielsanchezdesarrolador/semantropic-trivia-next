import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import catalog from '../../docs/audio/SFX02_CATALOGO.json' with { type: 'json' };
const release = process.env.ST_AUDIO_RELEASE === '1';
const url = process.env.ST_OFFICIAL_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ ...(process.env.CI ? {} : { channel: 'chrome' }), headless: true });
await mkdir('artifacts/sfx02-qa', { recursive: true });
try {
  for (const [width, height] of [[1366,900], [390,844], [320,740]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.addInitScript(() => {
      window.__sfx = []; window.__media = []; window.__voices = new Set();
      window.__allowAutoplay = false;
      document.addEventListener('pointerdown', event => { if (event.isTrusted) window.__allowAutoplay = true; }, true);
      const NativeAudio = window.Audio;
      window.Audio = function(src) { const audio = new NativeAudio(src); window.__media.push(audio); return audio; };
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function() {
        if (!window.__allowAutoplay) return Promise.reject(new DOMException('QA autoplay', 'NotAllowedError'));
        return play.call(this);
      };
      const start = AudioBufferSourceNode.prototype.start, stop = AudioBufferSourceNode.prototype.stop;
      AudioBufferSourceNode.prototype.start = function(when = 0, offset = 0, duration) {
        window.__sfx.push({ seconds:this.buffer.duration, when, offset, duration, pitch:this.playbackRate.value, at:performance.now() });
        window.__voices.add(this); this.addEventListener('ended',()=>window.__voices.delete(this));
        return start.call(this, when, offset, duration);
      };
      AudioBufferSourceNode.prototype.stop = function(...args) { window.__voices.delete(this); return stop.apply(this,args); };
    });
    const page = await context.newPage();
    const errors = [], requests = [], posts = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('request', r => { if(release ? /\.mp3(?:\?|$)/.test(r.url()) : r.url().includes('/__qa_approved__/'))requests.push(r.url());if(r.method()==='POST')posts.push(r.url()); });
    await page.goto(url);
    if(release) await page.waitForFunction(()=>document.querySelector('button[title="SFX-02: 7/7 recursos del juego verificados."]'));
    else {
      await page.waitForFunction(()=>document.querySelector('.ds01-panel')?.textContent.includes('SFX-02: 9/9'));
      await page.waitForFunction(()=>document.querySelector('.ds01-panel')?.textContent.includes('13/13 muestras'));
    }
    const info = release ? Object.fromEntries(catalog.items.map(item=>[item.code,{seconds:item.decodedSeconds}])) : await page.evaluate(async()=> (await import('/src/audio/sfx02/loadDev.ts')).decodedInfo);
    assert.equal(Object.keys(info).length,9);
    const state = () => page.evaluate(()=>({ media:window.__media.map(a=>({duration:a.duration,paused:a.paused,time:a.currentTime,volume:a.volume,loop:a.loop})),sfx:window.__sfx }));
    const reset = () => page.evaluate(()=>{window.__sfx=[];});
    const openAudio = async () => {
      const details=page.locator('.st-audio-options');
      if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
    };
    const count = async code => (await state()).sfx.filter(s=>Math.abs(s.seconds-info[code].seconds)<.001).length;
    await page.waitForFunction(()=>window.__media.length===2 && window.__media.every(a=>Number.isFinite(a.duration)));
    if(release) await page.evaluate(()=>window.__media.sort((a,b)=>a.duration-b.duration)); // L7 54 s, C 119 s; parallel loads.
    assert.deepEqual((await state()).media.map(a=>a.paused),[true,true]);
    assert.equal((await state()).sfx.length,0);
    await page.getByRole('button',{name:'Colección',exact:true}).click();
    await page.waitForFunction(()=>window.__sfx.length===1);
    assert.equal(await count('M1'),1); assert.equal(await count('V1'),0);
    await page.waitForFunction(()=>!window.__media[0].paused);
    const position=(await state()).media[0].time;
    await reset();
    await page.getByRole('button',{name:'Colección',exact:true}).click();assert.equal((await state()).sfx.length,0);
    await page.getByRole('button',{name:'Volver al inicio',exact:true}).click();
    assert.equal(await count('V1'),1);assert.equal(await count('M1'),0);
    assert.ok((await state()).media[0].time>=position);
    await page.getByRole('button',{name:'Tienda',exact:true}).click();
    await page.getByRole('button',{name:'Amigos',exact:true}).click();
    await page.getByRole('button',{name:'Ranking',exact:true}).click();
    await page.getByRole('button',{name:'Inicio',exact:true}).click();
    assert.equal((await state()).media.length,2);
    await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
    await openAudio();
    await page.getByRole('button',{name:'Silenciar reloj',exact:true}).waitFor();
    await page.waitForFunction(()=>window.__media[0].paused && !window.__media[1].paused);
    assert.equal((await state()).media[1].volume,.12);
    const originalLobbyVolume=(await state()).media[0].volume;
    await page.getByLabel('Volumen de música Arena',{exact:true}).fill('8');
    assert.equal((await state()).media[0].volume,originalLobbyVolume);
    await page.getByLabel('Volumen del reloj',{exact:true}).fill('17');
    assert.equal(await page.getByLabel('Volumen de efectos',{exact:true}).inputValue(),'50');
    await page.getByRole('button',{name:'Silenciar reloj',exact:true}).click();
    await page.locator('.st-audio-options > summary').click();
    await page.screenshot({path:`artifacts/sfx02-qa/arena-${width}x${height}.png`,fullPage:true});
    await openAudio();
    await reset();
    const choices=['C','A','C','D','C','B','B','B','C','A'];
    const total=width===1366?10:2;
    for(let index=0;index<total;index++){
      if(index===2){
        await page.getByRole('button',{name:'Activar reloj',exact:true}).click();
        await page.waitForTimeout(200);
        await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
        const hiddenCount=(await state()).sfx.length;
        await page.waitForTimeout(2500);assert.equal((await state()).sfx.length,hiddenCount,'Sin tics en pestaña oculta');
        await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
        await page.waitForTimeout(100);assert.ok((await state()).sfx.length-hiddenCount<=1,'Sin catch-up de tics');
        await page.waitForTimeout(17400);
        await page.getByRole('status').filter({hasText:'Tiempo agotado.'}).waitFor();
        const ticks=(await state()).sfx.filter(s=>Math.abs(s.seconds-info.CLK.seconds)<.001);
        assert.ok(ticks.length>=18 && ticks.length<=22,`Cadencia progresiva: ${ticks.length} tics`);
        const gaps=ticks.slice(1).map((s,i)=>s.at-ticks[i].at);
        for(const target of [2000,1000,650,350])assert.ok(gaps.some(g=>Math.abs(g-target)<140),`Cadencia ${target}; intervalos observados: ${gaps.map(g=>Math.round(g)).join(',')}`);
        assert.ok(ticks.every(s=>s.pitch===1 && s.duration===.14));
        assert.equal(await count('X3'),0);assert.equal(await count('A1'),0);
        const timeout=(await state()).sfx.filter(s=>Math.abs(s.seconds-.91)<.03);assert.equal(timeout.length,release?0:1);
        const stopped=(await state()).sfx.length;await page.waitForTimeout(500);assert.equal((await state()).sfx.length,stopped);
      }else{
        const button=page.locator('.b03-answer--interactive').filter({has:page.locator('.b03-answer-letter',{hasText:choices[index]})});
        await button.click();
        if(index<9)await page.getByRole('button',{name:'Siguiente pregunta',exact:true}).waitFor();
        else await page.getByRole('heading',{name:'Resultados de la práctica local'}).waitFor();
        // Independent expected outcomes for this fixed sequence (Q3 times out).
        const code=[1,6,7,9].includes(index)?'X3':'A1';
        assert.equal(await count(code),1,`Q${index+1} ${code}`);
        assert.equal(await count(code==='A1'?'X3':'A1'),0);
        assert.equal(await count('W1'),0);assert.equal(await count('D2'),0);
        assert.ok((await state()).media[1].volume<.08,'Música atenuada durante feedback');
        const n=(await state()).sfx.length;await button.dispatchEvent('click');await page.waitForTimeout(160);
        assert.equal((await state()).sfx.length,n,'Sin duplicados/tics después de responder');
      }
      if(index<9){await page.getByRole('button',{name:'Siguiente pregunta',exact:true}).click();await reset();}
    }
    if(total===10 && release) {
      assert.equal(await page.getByRole('button',{name:'Probar sonido de victoria (QA)',exact:true}).count(),0);
      assert.equal(await page.getByRole('button',{name:'Probar sonido de derrota (QA)',exact:true}).count(),0);
      assert.equal(await count('W1'),0);assert.equal(await count('D2'),0);
      await page.getByRole('button',{name:'Volver a jugar',exact:true}).click();
    }
    if(total===10 && !release){
      assert.equal(await count('W1'),0);assert.equal(await count('D2'),0);
      await page.getByText('SFX-02 · Audición QA de resultados',{exact:true}).click();
      const resultText=await page.locator('.b03-visual-status > p').first().textContent();
      await reset();await page.getByRole('button',{name:'Probar sonido de victoria (QA)',exact:true}).click();
      assert.equal(await count('W1'),1);assert.equal(await page.evaluate(()=>window.__voices.size),1);
      await page.getByRole('button',{name:'Probar sonido de derrota (QA)',exact:true}).click();
      assert.equal(await count('D2'),1);assert.equal(await page.evaluate(()=>window.__voices.size),1);
      assert.equal(await page.locator('.b03-visual-status > p').first().textContent(),resultText);
      await page.getByRole('button',{name:'Volver a jugar',exact:true}).click();
    }
    await reset();await page.getByRole('button',{name:'Volver al lobby',exact:true}).click();
    await page.waitForFunction(()=>!window.__media[0].paused && window.__media[1].paused);
    assert.equal(await count('V1'),1);assert.equal(await count('M1'),0);
    assert.ok((await state()).media[0].time>=position);
    if(!release) {
    const lab=page.locator('.ds01-panel');
    await lab.locator('summary').first().click();
    await lab.getByLabel('Usar maquetas DS-01 en laboratorio (desactiva SFX-02 de interfaz y respuestas)').check();
    await reset();await lab.getByRole('button',{name:'Probar Acierto',exact:true}).click();
    assert.equal(await count('A1'),0);assert.ok((await state()).sfx.some(s=>Math.abs(s.seconds-.94)<.03),'DS-01 conserva laboratorio explícito');
    await lab.getByLabel('Usar maquetas DS-01 en laboratorio (desactiva SFX-02 de interfaz y respuestas)').uncheck();
    } else assert.equal(await page.locator('.ds01-panel').count(),0);
    await openAudio();
    assert.equal(requests.length,release?7:10,'Una sola carga por recurso');assert.deepEqual(posts,[]);
    await page.getByRole('button',{name:'Silenciar música lobby',exact:true}).click();
    await page.getByRole('button',{name:'Silenciar efectos',exact:true}).click();
    await reset();await page.getByRole('button',{name:'Colección',exact:true}).click();
    assert.equal((await state()).sfx.length,0);assert.equal((await state()).media[0].paused,true);
    await page.reload();
    if(release) {
      await page.waitForFunction(()=>document.querySelector('button[title="SFX-02: 7/7 recursos del juego verificados."]') && window.__media.length===2);
      await page.evaluate(()=>window.__media.sort((a,b)=>a.duration-b.duration));
    } else await page.waitForFunction(()=>document.querySelector('.ds01-panel')?.textContent.includes('SFX-02: 9/9'));
    await page.getByRole('button',{name:'Inicio',exact:true}).click();
    assert.equal((await state()).sfx.length,0);assert.equal((await state()).media[0].paused,true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
    if(await page.locator('.st-audio-options').evaluate(el=>el.open))await page.locator('.st-audio-options > summary').click();
    await page.screenshot({path:`artifacts/sfx02-qa/${width}x${height}.png`,fullPage:true});
    await writeFile('artifacts/sfx02-qa/decoded.json',JSON.stringify(info,null,2));
    console.log(`PASS SFX02 ${release?'RELEASE':'DEV'} ${width}x${height}: M1/V1, A1/X3, músicas excluyentes/ducking, ${total} preguntas, reloj, resultados sin victoria/derrota implícita, preferencias y responsive`);
    await context.close();
  }
  if(!release) {
  const missing=await browser.newContext();const page=await missing.newPage();
  await page.route('**/__qa_approved__/floraphonic-casual-click-pop-ui-2-262119.mp3',route=>route.fulfill({status:404,body:'missing'}));
  await page.goto(url);await page.waitForFunction(()=>document.querySelector('.ds01-panel')?.textContent.includes('SFX-02: 8/9'));
  assert.match(await page.locator('.ds01-panel').textContent(),/M1: HTTP 404/);
  await page.getByRole('button',{name:'Colección',exact:true}).click();
  await page.getByRole('heading',{name:'Colección',exact:true}).waitFor();
  await page.getByRole('button',{name:'Inicio',exact:true}).click();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
  await page.locator('.b03-answer--interactive').nth(2).click();
  await page.getByRole('button',{name:'Siguiente pregunta',exact:true}).waitFor();
  console.log('PASS SFX02 M1 faltante: aviso específico, sin sustituto y navegación/partida funcional');
  await missing.close();
  }
}finally{await browser.close();}
