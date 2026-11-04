const { chromium } = await import(process.env.B04_PLAYWRIGHT_MODULE || '/tmp/b04-browser/node_modules/playwright/index.mjs');
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const evidence='docs/design/B04/evidencias';
const routes=['welcome','sign-in','register','verify','forgot-password','reset-password','auth-status','lobby-transition'];
const sizes=[['desktop',1600,900],['mobile',390,844],['small',320,740],['landscape',844,390],['wide',1920,1080]];
const errors=[]; const requests=[]; const results=[];
try {
 for(const [name,width,height] of sizes){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))requests.push(r.url());});
  for(const route of routes){
   await page.goto('http://localhost:5173/#'+route);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.b04-logo').evaluate(i=>i.decode());
   assert.equal(await page.locator('.b04-logo').count(),1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,name+' '+route+' overflow');
   if(['desktop','mobile'].includes(name))await page.screenshot({path:`${evidence}/${name}-${route}.png`,fullPage:true});
   results.push({viewport:name,route,overflow:false});
  }
  await page.goto('http://localhost:5173/#welcome');
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
  await page.getByRole('link',{name:'ABRIR LOBBY LOCAL',exact:true}).click();
  await page.getByRole('button',{name:'Abrir Arena del Conocimiento'}).click();
  await page.waitForURL('**/#arena');
  await page.locator('button.b03-answer').first().click();
  await page.getByRole('button',{name:'Siguiente pregunta'}).waitFor();
  await page.screenshot({path:`${evidence}/${name}-arena.png`,fullPage:true});
  await page.goto('http://localhost:5173/#forgot-password');
  await page.getByRole('link',{name:'Ver nueva contraseña →'}).click();
  await page.locator('input[name="password"]').fill('ejemplo-123');
  await page.getByLabel('Confirmar contraseña',{exact:true}).fill('diferente-123');
  await page.getByRole('button',{name:'GUARDAR CONTRASEÑA'}).click();
  assert.match(await page.getByRole('status').innerText(),/no coinciden/);
  await page.goBack();
  assert.match(page.url(),/#forgot-password$/);
  await page.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 await writeFile(`${evidence}/qa.json`,JSON.stringify({status:'PASS',routes:results.length,flowViewports:sizes.length,errors,mutationRequests:requests,results},null,2));
 console.log('PASS: 40 vistas, 5 recorridos hasta Arena, sin overflow, errores JS ni solicitudes de autenticación.');
} finally {await browser.close();}
