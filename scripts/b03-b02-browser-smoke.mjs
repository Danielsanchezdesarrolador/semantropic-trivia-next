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
