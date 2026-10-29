import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const publicUrl = process.env.B03_URL;
const url = publicUrl || 'http://127.0.0.1:4188/b03-preview.html';
let server;
if (!publicUrl) {
  const root = resolve('dist');
  const MIME = { '.html': 'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png' };
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
      const data = await readFile(file);
      response.writeHead(200, {'Content-Type': MIME[extname(file)] || 'application/octet-stream'});
      response.end(data);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((res, rej) => {server.once('error',rej);server.listen(4188,'127.0.0.1',res);});
}

let browser;
try {
  await mkdir('artifacts/b03-b02', { recursive: true });
  browser = await chromium.launch({headless:true});
  const devices = [
    {name:'pc-1366', viewport:{width:1366,height:900}, isMobile:false},
    {name:'mobile-390', viewport:{width:390,height:844}, isMobile:true},
    {name:'mobile-320', viewport:{width:320,height:740}, isMobile:true},
  ];
  for(const d of devices){
    const context = await browser.newContext({viewport:d.viewport,isMobile:d.isMobile,hasTouch:d.isMobile});
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    const r = await page.goto(url,{waitUntil:'networkidle',timeout:30000});
    assert.equal(r?.status(),200, `${d.name} HTTP`);
    await page.getByRole('heading',{name:'Arena del Conocimiento'}).waitFor();
    assert.equal(await page.getByRole('heading',{name:'¿Cuál es la capital de Australia?'}).count(),1);
    assert.equal(await page.locator('.b03-answer').count(),4);
    assert.equal(await page.locator('.b03-progress img').count(),10);
    assert.equal(await page.locator('.b03-category-pill').count(),6);
    assert.equal(await page.locator('.b03-timer span').textContent(),'18');
    assert.equal(await page.getByText('B03-B02 · Previsualización de diseño:',{exact:false}).count(),1);
    await page.screenshot({path:`artifacts/b03-b02/${d.name}-geografia.png`,fullPage:true});

    const baseBackground=await page.locator('.b03-arena').evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
    assert.match(baseBackground,/arena_geografia_(pc_16x9|movil_9x16)\.svg/);
    if(d.isMobile)assert.match(baseBackground,/movil_9x16\.svg/);
    else assert.match(baseBackground,/pc_16x9\.svg/);

    for(const category of ['Ciencias','Historia','Arte y cultura','Deportes','Entretenimiento']){
      await page.getByRole('button',{name:category,exact:true}).click();
      assert.equal(await page.getByRole('button',{name:category,exact:true}).getAttribute('aria-pressed'),'true');
      const img=await page.locator('.b03-category-icon').getAttribute('src');
      assert.ok(img?.includes('icono_categoria_'));
      assert.equal((await page.locator('.b03-category-title').textContent())?.trim(), category);
      const bg=await page.locator('.b03-arena').evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
      assert.notEqual(bg,baseBackground,'Cambio de fondo al elegir '+category);
    }

    // HF1: inspección geométrica de la interfaz, no solo validación de clics.
    await page.getByRole('button',{name:'Arte y cultura',exact:true}).click();
    await page.getByRole('button',{name:'Incorrecta',exact:true}).click();
    const layout=await page.evaluate(()=>{
      const rect=selector=>document.querySelector(selector)?.getBoundingClientRect();
      const arena=rect('.b03-arena');
      const header=rect('.b03-category-header');
      // El SVG externo usa xMidYMid meet: descartar el letterboxing de CSS.
      const paintedScale=Math.min(header.width/1200,header.height/180);
      const drawnX=(header.width-1200*paintedScale)/2;
      const drawnY=(header.height-180*paintedScale)/2;
      const title=rect('.b03-category-title');
      const icon=rect('.b03-category-icon');
      const counter=rect('.b03-category-count');
      const question=rect('.b03-question');
      const questionText=rect('.b03-question-content');
      const progress=rect('.b03-progress');
      const answers=[...document.querySelectorAll('.b03-answer')].map(el=>{
        const card=el.getBoundingClientRect();
        const letter=el.querySelector('.b03-answer-letter').getBoundingClientRect();
        const answerText=el.querySelector('.b03-answer-text').getBoundingClientRect();
        const feedback=el.querySelector('.b03-answer-feedback')?.getBoundingClientRect();
        return {
          cardWidth:card.width, cardHeight:card.height,
          chipCenter:(letter.left+letter.width/2-card.left)/card.width,
          chipCenterY:(letter.top+letter.height/2-card.top)/card.height,
          letterEnd:letter.right-card.left,
          textStart:answerText.left-card.left,
          textEnd:answerText.right-card.left,
          feedbackStart:feedback?feedback.left-card.left:null,
          textContained:answerText.left>=card.left-1&&answerText.right<=card.right+1,
        };
      });
      return {
        arenaCenter:(arena.left+arena.right)/2,
        headerCenter:(header.left+header.right)/2,
        iconCenterX:(icon.left+icon.right)/2,
        iconCenterY:(icon.top+icon.bottom)/2,
        targetIconCenterX:header.left+drawnX+86*paintedScale,
        targetIconCenterY:header.top+drawnY+81*paintedScale,
        countCenterX:(counter.left+counter.right)/2,
        countCenterY:(counter.top+counter.bottom)/2,
        targetCountCenterX:header.left+drawnX+(940+225/2)*paintedScale,
        targetCountCenterY:header.top+drawnY+(22+119/2)*paintedScale,
        titleStartsAfterIcon:title.left>=icon.right+3,
        headerLeft:header.left,
        backRight:rect('.b03-back-visual').right,
        timerCenter:(rect('.b03-timer').left+rect('.b03-timer').right)/2,
        titleEndsBeforeCount:title.right<=counter.left+2,
        titleOverflows:document.querySelector('.b03-category-title').scrollWidth>
          document.querySelector('.b03-category-title').clientWidth+2,
        questionCenter:(question.left+question.right)/2,
        textCenter:(questionText.left+questionText.right)/2,
        progressCenter:(progress.left+progress.right)/2,
        progressSegments:[...document.querySelectorAll('.b03-progress img')].map(img=>img.getBoundingClientRect().width),
        answers
      };
    });
    if(d.isMobile){
      assert.ok(layout.headerLeft>=layout.backRight-8,
        'Cabecera móvil no debe superponerse a Salir: '+JSON.stringify(layout));
      assert.ok(Math.abs(layout.timerCenter-layout.arenaCenter)<5,
        'Reloj móvil debe estar centrado: '+JSON.stringify(layout));
    }else{
      assert.ok(Math.abs(layout.headerCenter-layout.arenaCenter)<5,
        'Cabecera PC centrada horizontalmente: '+JSON.stringify(layout));
    }
    assert.ok(Math.abs(layout.iconCenterX-layout.targetIconCenterX)<1.6,
      'El icono debe coincidir con el círculo dibujado en el SVG: '+JSON.stringify(layout));
    assert.ok(Math.abs(layout.iconCenterY-layout.targetIconCenterY)<1.6,
      'Icono descentrado verticalmente: '+JSON.stringify(layout));
    assert.ok(Math.abs(layout.countCenterX-layout.targetCountCenterX)<1.6,
      'El 3/10 no coincide con el centro de la cápsula: '+JSON.stringify(layout));
    assert.ok(Math.abs(layout.countCenterY-layout.targetCountCenterY)<1.6,
      'Contador descentrado verticalmente: '+JSON.stringify(layout));
    assert.ok(layout.titleStartsAfterIcon,
      'El icono invade el texto de categoría: '+JSON.stringify(layout));
    assert.ok(layout.titleEndsBeforeCount&&!layout.titleOverflows,
      'Texto de categoría invade el contador: '+JSON.stringify(layout));
    assert.ok(Math.abs(layout.questionCenter-layout.textCenter)<5,
      'Enunciado descentrado: '+JSON.stringify(layout));
    assert.ok(Math.abs(layout.progressCenter-layout.arenaCenter)<5,
      'Progreso descentrado: '+JSON.stringify(layout));
    assert.equal(layout.progressSegments.length,10);
    assert.ok(Math.max(...layout.progressSegments)-Math.min(...layout.progressSegments)<2,
      'Los segmentos deben medir lo mismo');
    for(const item of layout.answers){
      assert.ok(Math.abs(item.chipCenter-.1235)<.023,
        'Letra desalineada horizontalmente: '+JSON.stringify(item));
      assert.ok(Math.abs(item.chipCenterY-.456)<.036,
        'Letra desalineada verticalmente: '+JSON.stringify(item));
      assert.ok(item.textStart>=item.letterEnd-1,
        'El texto se superpone con el chip: '+JSON.stringify(item));
      assert.ok(item.textContained,'Texto fuera de tarjeta: '+JSON.stringify(item));
      if(item.feedbackStart!==null){
        assert.ok(item.feedbackStart>=item.textEnd-1,
          'Indicador de respuesta superpuesto: '+JSON.stringify(item));
      }
    }
    await page.screenshot({path:'artifacts/b03-b02/'+d.name+'-arte-cultura-hf2.png',fullPage:true});
    // Recorte de cabecera para inspección visual precisa.
    await page.locator('.b03-arena-top').screenshot({path:'artifacts/b03-b02/'+d.name+'-cabecera-hf2.png'});
    console.log('PASS B03-B02-HF1',d.name,'GEOMETRIA',JSON.stringify(layout));
    await page.getByRole('button',{name:'Entretenimiento',exact:true}).click();

    await page.screenshot({path:`artifacts/b03-b02/${d.name}-entretenimiento.png`,fullPage:true});
    await page.getByRole('button',{name:'Correcta',exact:true}).click();
    assert.equal(await page.locator('.b03-answer--correct').count(),1);
    await page.getByRole('button',{name:'Incorrecta',exact:true}).click();
    assert.equal(await page.locator('.b03-answer--incorrect').count(),1);
    await page.getByRole('button',{name:'Amarillo',exact:true}).click();
    assert.match(await page.locator('.b03-timer img').getAttribute('src'),/temporizador_alerta/);
    await page.getByRole('button',{name:'Rojo',exact:true}).click();
    assert.match(await page.locator('.b03-timer img').getAttribute('src'),/temporizador_urgente/);
    await page.screenshot({path:`artifacts/b03-b02/${d.name}-estados.png`,fullPage:true});

    const imgState = await page.locator('img').evaluateAll(images=>images.map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
    assert.ok(imgState.every(x=>x.loaded),'Recursos ilustrados cargados: '+JSON.stringify(imgState.filter(x=>!x.loaded)));
    const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    assert.ok(geometry.scrollWidth<=geometry.width+1,'Sin overflow horizontal: '+JSON.stringify(geometry));
    assert.deepEqual(errors,[],`${d.name} JS errors`);
    console.log('PASS B03-B02',d.name,'HTTP',r.status(),'categorias=6','estados=4','img='+imgState.length,JSON.stringify(geometry));
    await context.close();
  }
} catch(error){console.error('FAIL B03-B02',error);process.exitCode=1;}
finally{if(browser)await browser.close();if(server)await new Promise(res=>server.close(res));}
process.exit(process.exitCode??0);
