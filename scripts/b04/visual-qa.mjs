const { chromium } = await import(process.env.B04_PLAYWRIGHT_MODULE || 'playwright');
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import assert from 'node:assert/strict';
let server;
let localBase;
if (!process.env.B04_BASE_URL) {
  const root=resolve('dist');
  const types={'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.mp3':'audio/mpeg', '.json':'application/json', '.webmanifest':'application/manifest+json'};
  server=createServer(async (request,response) => {
    try {
      const path=decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
      const file=resolve(root, '.'+(path==='/' ? '/index.html' : path));
      if (!file.startsWith(root+sep)) {response.writeHead(403);response.end();return;}
      const body=await readFile(file);
      response.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream'});
      response.end(body);
    } catch {response.writeHead(404);response.end();}
  });
  await new Promise((done,reject) => {server.once('error',reject);server.listen(0,'127.0.0.1',done);});
  localBase='http://127.0.0.1:'+server.address().port+'/';
}
let browser;
const evidence=process.env.B04_EVIDENCE_DIR || 'artifacts/b04';
const baseUrl=new URL(process.env.B04_BASE_URL || localBase);
const routeUrl=route => { const url=new URL(baseUrl); url.hash=route; return url.href; };
await mkdir(evidence, {recursive:true});
const routes=['welcome','sign-in','register','verify','forgot-password','reset-password','auth-status','lobby-transition'];
const sizes=[['desktop',1366,900],['mobile',390,844],['small',320,740],['landscape',844,390],['wide',1920,1080],['tablet',768,1024]];
const failed=[];
const cancelledMedia=[];
const errors=[]; const requests=[]; const results=[];
try {
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const [name,width,height] of sizes){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,isMobile:width<1000,reducedMotion:'reduce'});
  assert.equal((await page.request.get(baseUrl.href)).status(),200);
  page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
  page.on('requestfailed',r=>{
   if(r.url().startsWith('blob:') && r.failure()?.errorText==='net::ERR_ABORTED')cancelledMedia.push({url:r.url(),reason:r.failure().errorText});
   else failed.push(r.url()+' '+r.failure()?.errorText);
  });
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))requests.push(r.url());});
  for(const route of routes){
   const response=await page.goto(routeUrl(route)); if(response) assert.equal(response.status(),200);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.b04-logo').evaluate(i=>i.decode());
   assert.equal(await page.locator('.b04-logo').count(),1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,name+' '+route+' overflow');
   if(route==='lobby-transition') await page.locator('.b04-option-c img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));
   if(['desktop','mobile'].includes(name) || route==='lobby-transition')await page.screenshot({path:`${evidence}/${name}-${route}.png`,fullPage:true});
   if(route==='lobby-transition'){
    assert.equal(await page.locator('.b04-option-c__character').count(),3);
    const geometry=await page.locator('.b04-option-c').evaluate(root=>{
     const stage=root.querySelector('.b04-option-c__stage').getBoundingClientRect();
     const actors=[...root.querySelectorAll('.b04-option-c__character')].map(i=>{const r=i.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};});
     const cta=root.querySelector('.b04-option-c__cta').getBoundingClientRect();
     return {actors,stage:{width:stage.width,height:stage.height},cta:{height:cta.height,width:cta.width},background:root.querySelector('picture img').currentSrc};
    });
    assert.ok(geometry.actors.every(r=>r.x>=0 && r.right<=width && r.y>=0 && r.bottom<=geometry.stage.height),'Personajes íntegros dentro de la escena');
    assert.ok(geometry.actors[0].x<geometry.actors[2].x && geometry.actors[2].x<geometry.actors[1].x,'Masculino izquierda, robot centro, femenina derecha');
    assert.ok(geometry.cta.height>=44 && geometry.cta.width>=44,'CTA táctil');
    assert.match(geometry.background,width/height<=.8 ? /mobile-1080x1920/ : /desktop-2560x1440/);
    assert.equal(await page.getByRole('heading',{name:'¡Bienvenido/a!',exact:true}).count(),1);
    assert.equal(await page.getByText('Preparando tu entrada al lobby',{exact:true}).count(),1);
   }
   results.push({viewport:name,route,overflow:false});
  }
  await page.goto(routeUrl('welcome'));
  await page.getByRole('link',{name:'INICIAR SESIÓN',exact:false}).click();
  await page.getByLabel('Correo electrónico').fill('qa@example.invalid');
  await page.getByLabel('Contraseña',{exact:true}).fill('local-example');
  await page.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();
  assert.equal(await page.getByLabel('Contraseña',{exact:true}).getAttribute('type'),'text');
  await page.getByRole('button',{name:'ENTRAR',exact:true}).click();
  await page.getByRole('status').waitFor();
  await page.getByRole('link',{name:'Crear cuenta',exact:true}).click();
  await page.getByRole('link',{name:'Ver verificación →'}).click();
  await page.getByRole('link',{name:'Ver confirmación →'}).click();
  await page.getByRole('link',{name:'CONTINUAR',exact:true}).click();
  const openLobby=page.getByRole('link',{name:'ABRIR LOBBY LOCAL',exact:true});
  if(width<1000) await openLobby.tap(); else await openLobby.click();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
  await page.waitForURL('**/#arena');
  await page.locator('button.b03-answer').first().click();
  await page.getByRole('button',{name:'Siguiente pregunta'}).waitFor();
  await page.getByRole('button',{name:'Salir de Arena del Conocimiento'}).click();
  await page.waitForURL('**/#home');
  await page.goBack();
  await page.waitForURL('**/#arena');
  await page.goBack();
  await page.waitForURL('**/#home');
  await page.goBack();
  await page.waitForURL('**/#lobby-transition');
  await page.goForward();
  await page.waitForURL('**/#home');
  await page.goBack();
  await page.waitForURL('**/#lobby-transition');
  const cta=page.getByRole('link',{name:'ABRIR LOBBY LOCAL',exact:true});
  await cta.focus();
  await page.keyboard.press('Space');
  await page.waitForURL('**/#home');
  await page.goBack();
  await page.waitForURL('**/#lobby-transition');
  await page.getByRole('link',{name:'ABRIR LOBBY LOCAL',exact:true}).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/#home');
  await page.screenshot({path:`${evidence}/${name}-home-return.png`,fullPage:true});
  await page.goto(routeUrl('forgot-password'));
  await page.getByRole('link',{name:'Ver nueva contraseña →'}).click();
  await page.locator('input[name="password"]').fill('ejemplo-123');
  await page.getByLabel('Confirmar contraseña',{exact:true}).fill('diferente-123');
  await page.getByRole('button',{name:'GUARDAR CONTRASEÑA'}).click();
  assert.match(await page.getByRole('status').innerText(),/no coinciden/);
  await page.goBack();
  assert.match(page.url(),/#forgot-password$/);
  await page.close();
 }
 assert.deepEqual(failed,[]);
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await writeFile(`${evidence}/qa.json`,JSON.stringify({status:'PASS',routes:results.length,flowViewports:sizes.length,cancelledMedia,failed,errors,mutationRequests:requests,results},null,2));
 console.log(`PASS: ${results.length} vistas, ${sizes.length} recorridos transición/lobby/Arena, sin overflow, errores JS ni solicitudes de autenticación.`);
} finally {if(browser) await browser.close();if(server) await new Promise(done=>server.close(done));}
