import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { createHash } from 'node:crypto';
const sizes=[['small',320,740],['mobile',390,844],['landscape',844,390],['tablet',768,1024],['desktop',1366,900],['wide',1920,1080]];
const routes=['welcome','sign-in','register','verify','forgot-password','reset-password','auth-status','lobby-transition','home'];
const output=process.env.B04_C3_EVIDENCE_DIR || 'artifacts/b04-c3';
const servers=[];
async function serve(dir) {
 const root=resolve(dir);
 const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.json':'application/json'};
 const server=createServer(async(req,res)=>{
  try {const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(path==='/'?'/index.html':path));assert.ok(file.startsWith(root+sep));res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));}
  catch {res.writeHead(404);res.end();}
 });
 await new Promise(done=>server.listen(0,'127.0.0.1',done));servers.push(server);return 'http://127.0.0.1:'+server.address().port+'/';
}
async function decoded(page) {
 await page.locator('h1').waitFor();
 await page.evaluate(async()=>{
  await document.fonts.ready;
  await Promise.all([...document.images].map(img=>img.decode()));
  const urls=new Set();
  for(const node of document.querySelectorAll('*'))for(const match of getComputedStyle(node).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(match[1]);
  await Promise.all([...urls].map(async src=>{const img=new Image();img.src=src;await img.decode();}));
  await new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done)));
 });
}
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const errors=[],failed=[],mutations=[],results=[],comparisons=[],flows=[];
let browser;
try {
 await mkdir(output,{recursive:true});
 const base=process.env.B04_BASE_URL || await serve('dist');
 const baseline=process.env.B04_C3_BASE_DIR ? await serve(process.env.B04_C3_BASE_DIR) : null;
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const [name,width,height] of sizes) {
  const options={viewport:{width,height},hasTouch:width<1000,isMobile:width<1000,reducedMotion:'reduce'};
  const page=await browser.newPage(options);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});
  page.on('requestfailed',r=>{if(!(r.url().startsWith('blob:')&&r.failure()?.errorText==='net::ERR_ABORTED'))failed.push(r.url()+' '+r.failure()?.errorText);});
  page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))mutations.push({method:r.method(),url:r.url()});});
  for(const route of routes) {
   await page.goto(base+'#'+route);await decoded(page);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' '+route+' overflow');
   if(['desktop','mobile'].includes(name)||['welcome','lobby-transition','home'].includes(route))await page.screenshot({path:`${output}/${name}-${route}.png`,fullPage:true});
   if(route==='home'){
    const actors=await page.locator('.st-home__character').evaluateAll(nodes=>nodes.map(n=>({src:n.getAttribute('src'),complete:n.complete,w:n.naturalWidth,rect:{x:n.getBoundingClientRect().x,right:n.getBoundingClientRect().right}})));
    assert.equal(actors.length,3);
    for(const id of ['protagonist-male-v1','protagonist-female-v1','mascot-robot-v1'])assert.ok(actors.some(a=>a.src.endsWith(id+'-web.webp')&&a.complete&&a.w>0));
    assert.ok(actors.every(a=>a.rect.x>=0&&a.rect.right<=width));
   }
   results.push({viewport:name,route,status:'PASS'});
  }
  if(baseline) for(const route of ['welcome','lobby-transition','home']) {
   // Mismo contexto, scroll y DPR 2: evita redondeos de rasterización subpíxel a DPR 1.
   const comparison=await browser.newPage({...options,deviceScaleFactor:2});
   comparison.on('pageerror',e=>errors.push(e.message));
   async function capture(url,suffix) {
    await comparison.goto(url+'#'+route);await decoded(comparison);
    await comparison.evaluate(()=>window.scrollTo(0,0));
    await comparison.screenshot({path:`${output}/${name}-${route}${suffix}.png`,fullPage:true});
    const geometry=await comparison.locator(route==='home'?'.st-home__actions button, .st-home__sidebar, .st-home__characters':'.b04-portal, .b04-actions > a, .b04-option-c__stage').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
    if(route==='welcome'){
     // El único texto autorizado a cambiar se iguala antes de ocultarlo; no cambia el arte.
     await comparison.locator('.b04-local-link').evaluate(node=>{node.textContent='Recorrido visual de prueba';});
     await comparison.addStyleTag({content:'.b04-local-link{visibility:hidden!important}'});
    }
    await comparison.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
    const pixels=await comparison.screenshot({path:`${output}/${name}-${route}-protected${suffix}.png`,fullPage:true});
    const protectedGeometry=await comparison.locator(route==='home'?'.st-home__actions button, .st-home__sidebar, .st-home__characters':'.b04-portal, .b04-actions > a, .b04-option-c__stage').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
    assert.deepEqual(protectedGeometry,geometry,'Excluir texto de demo no mueve arte '+name);
    return {geometry,sha256:digest(pixels)};
   }
   const before=await capture(baseline,'-before'),after=await capture(base,'');
   assert.deepEqual(after.geometry,before.geometry,'Sin desplazar composición/acciones '+name+' '+route);
   if(route!=='home')assert.equal(after.sha256,before.sha256,name+' '+route+' arte protegido idéntico');
   comparisons.push({viewport:name,route,status:'PASS',...(route==='home'?{}:{sha256:after.sha256}),comparison:route==='home'?'Slots, botones y sidebar sin desplazamiento; imágenes oficiales sustituidas':route==='welcome'?'Píxeles idénticos salvo texto/enlace de demostración, oculto solo en comparación':'Píxeles idénticos completos'});
   await comparison.close();
  }
  await page.goto(base+'#welcome');
  await page.getByRole('link',{name:'INICIAR SESIÓN',exact:false}).focus();await page.keyboard.press('Enter');
  await page.getByRole('heading',{name:'Iniciar sesión',exact:true}).waitFor();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('name')),'email');
  await page.getByRole('button',{name:'ENTRAR',exact:true}).click();
  const email=page.getByLabel('Correo electrónico');
  assert.equal(await email.getAttribute('aria-invalid'),'true');
  const errorId=await email.getAttribute('aria-describedby');assert.ok(errorId);assert.match(await page.locator('[id="'+errorId+'"]').innerText(),/correo/);
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('name')),'email');
  await email.fill('invalid');await page.getByRole('button',{name:'ENTRAR',exact:true}).click();assert.match(await page.locator('.b04-field-error').first().innerText(),/correo válido/);
  await email.fill('qa@example.invalid');
  await page.getByLabel('Contraseña',{exact:true}).fill('solo-ejemplo-123');
  await page.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();assert.equal(await page.getByLabel('Contraseña',{exact:true}).getAttribute('type'),'text');
  await page.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();assert.equal(await page.getByLabel('Contraseña',{exact:true}).getAttribute('type'),'password');
  await page.getByLabel('Contraseña',{exact:true}).press('Enter');
  assert.equal(await page.getByRole('status').innerText(),'Vista previa: las cuentas todavía no están habilitadas');assert.ok(page.url().endsWith('#sign-in'));
  await page.getByRole('link',{name:'Crear cuenta',exact:true}).click();
  await page.getByLabel('Nombre de usuario').fill('Familia QA');await page.getByLabel('Correo electrónico').fill('qa@example.invalid');
  await page.getByLabel('Contraseña',{exact:true}).fill('1234567');await page.getByLabel('Confirmar contraseña',{exact:true}).fill('different');
  await page.getByRole('button',{name:'CREAR CUENTA',exact:true}).click();assert.equal(await page.locator('[aria-invalid=true]').count(),2);
  await page.getByLabel('Contraseña',{exact:true}).fill('solo-ejemplo-123');await page.getByLabel('Confirmar contraseña',{exact:true}).fill('solo-ejemplo-123');
  await page.getByRole('button',{name:'CREAR CUENTA',exact:true}).click();assert.equal(await page.getByRole('status').innerText(),'Vista previa: las cuentas todavía no están habilitadas');assert.ok(page.url().endsWith('#register'));
  await page.getByRole('navigation',{name:'Recorrido visual de prueba'}).getByRole('link',{name:'Ver verificación →'}).click();
  await page.getByRole('button',{name:'Reenviar código · demostración'}).click();assert.match(await page.getByRole('status').innerText(),/no se ha enviado ningún código/);
  await page.getByLabel('Código de seis dígitos · ejemplo visual').fill('012345');await page.getByRole('button',{name:'VERIFICAR',exact:true}).click();assert.equal(await page.getByRole('status').innerText(),'Vista previa: las cuentas todavía no están habilitadas');
  await page.getByRole('link',{name:'Ver estado del acceso →'}).click();await page.getByRole('heading',{name:'Sin cuenta ni sesión creada'}).waitFor();
  await page.getByRole('link',{name:'CONTINUAR',exact:true}).click();
  if(width<1000)await page.getByRole('link',{name:'ABRIR LOBBY LOCAL'}).tap();else await page.getByRole('link',{name:'ABRIR LOBBY LOCAL'}).click();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();await page.waitForURL('**/#arena');
  await page.locator('button.b03-answer').first().click();await page.getByRole('button',{name:'Siguiente pregunta'}).waitFor();
  await page.getByRole('button',{name:'Salir de Arena del Conocimiento'}).click();await page.waitForURL('**/#home');
  await page.goBack();await page.waitForURL('**/#arena');await page.goBack();await page.waitForURL('**/#home');await page.goBack();await page.waitForURL('**/#lobby-transition');await page.goForward();await page.waitForURL('**/#home');
  await page.goto(base+'#sign-in');await page.getByRole('link',{name:'¿Olvidaste tu contraseña?'}).click();await page.getByRole('heading',{name:'Recuperar contraseña',exact:true}).waitFor();
  await page.getByLabel('Correo electrónico').fill('qa@example.invalid');await page.getByRole('button',{name:'ENVIAR ENLACE'}).click();assert.equal(await page.getByRole('status').innerText(),'Vista previa: las cuentas todavía no están habilitadas');
  await page.getByRole('link',{name:'Ver nueva contraseña →'}).click();
  await page.locator('input[name="password"]').fill('solo-ejemplo-123');await page.getByLabel('Confirmar contraseña',{exact:true}).fill('diferente-123');await page.getByRole('button',{name:'GUARDAR CONTRASEÑA'}).click();assert.match(await page.locator('.b04-field-error').innerText(),/no coinciden/);
  await page.getByLabel('Confirmar contraseña',{exact:true}).fill('solo-ejemplo-123');await page.getByRole('button',{name:'GUARDAR CONTRASEÑA'}).click();assert.equal(await page.getByRole('status').innerText(),'Vista previa: las cuentas todavía no están habilitadas');
  await page.getByRole('link',{name:'Ver estado del acceso →'}).click();await page.getByRole('heading',{name:'Estado del acceso',exact:true}).waitFor();await page.getByRole('link',{name:'Volver a iniciar sesión'}).click();await page.getByRole('heading',{name:'Iniciar sesión',exact:true}).waitFor();
  await page.getByRole('link',{name:'Volver a bienvenida',exact:false}).click();await page.getByRole('heading',{name:'¡Bienvenido a',exact:true}).waitFor();await page.getByRole('link',{name:'Demostración · práctica local'}).click();await page.waitForURL('**/#lobby-transition');
  // Altura reducida emula el espacio ocupado por teclado; no afirma teclado/dispositivo físico.
  if(width<=390){await page.goto(base+'#register');await page.setViewportSize({width,height:400});await page.getByLabel('Confirmar contraseña',{exact:true}).focus();await page.getByRole('button',{name:'CREAR CUENTA',exact:true}).scrollIntoViewIfNeeded();const rect=await page.getByRole('button',{name:'CREAR CUENTA',exact:true}).boundingBox();assert.ok(rect.y>=0&&rect.y+rect.height<=401);await page.screenshot({path:`${output}/${name}-keyboard-height-emulated.png`,fullPage:true});}
  const storage=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookie:document.cookie}));
  assert.ok(!JSON.stringify(storage).includes('solo-ejemplo-123'),'No persistir credenciales');assert.ok(!JSON.stringify(storage).includes('qa@example.invalid'));
  flows.push({viewport:name,status:'PASS',keyboardHeightEmulated:width<=390});console.log('PASS recorrido y regresión '+name);
  await page.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(mutations,[]);
 await writeFile(output+'/qa.json',JSON.stringify({status:'PASS',base,baselineCompared:!!baseline,comparisonDeviceScaleFactor:2,flowDeviceScaleFactor:1,views:results.length,flows,results,comparisons,errors,failed,mutations},null,2));
 console.log('PASS B04-C3: '+results.length+' vistas, '+flows.length+' recorridos, '+comparisons.length+' comparaciones, sin errores JS/HTTP/mutaciones.');
}finally{await browser?.close();for(const server of servers)await new Promise(done=>server.close(done));}
