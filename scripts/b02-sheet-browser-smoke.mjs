import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const url='http://127.0.0.1:4186/b02-preview.html';
const child=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4186','--strictPort'],{stdio:['ignore','pipe','pipe'],env:process.env});
let log='';for(const s of [child.stdout,child.stderr])s.on('data',x=>log+=x);
let browser;
async function ready(){for(let i=0;i<70;i++){
  try{if((await fetch(url)).ok)return;}catch{}
  if(child.exitCode!==null)throw Error('Vite terminated '+log);
  await new Promise(r=>setTimeout(r,500));
}throw Error('Vite timeout '+log)}
try{
  await ready();
  browser=await chromium.launch({headless:true});
  await mkdir('artifacts/b02-sheet',{recursive:true});
  for(const d of [
    {name:'desktop-1366',viewport:{width:1366,height:850},isMobile:false,hasTouch:false},
    {name:'mobile-390-emulated',viewport:{width:390,height:844},isMobile:true,hasTouch:true},
    {name:'mobile-320-emulated',viewport:{width:320,height:740},isMobile:true,hasTouch:true},
  ]){
    const ctx=await browser.newContext({viewport:d.viewport,isMobile:d.isMobile,hasTouch:d.hasTouch});
    const page=await ctx.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
    const r=await page.goto(url,{waitUntil:'networkidle',timeout:30000});
    assert.equal(r?.status(),200,'HTTP '+d.name);
    await page.getByRole('heading',{name:'SEMANTROPIC TRIVIA'}).waitFor();
    const actions=page.locator('.st-home__actions button');
    assert.equal(await actions.count(),2);
    assert.equal(await page.locator('.st-home__actions button:disabled').count(),2);
    assert.equal(await page.locator('.st-library__tile').count(),23);
    assert.equal(await page.locator('.st-palette__chip').count(),9);
    const imageData=await page.locator('img').evaluateAll(xs=>xs.map(x=>({src:x.getAttribute('src'),complete:x.complete,width:x.naturalWidth})));
    assert.ok(imageData.every(x=>x.complete&&x.width>0),'Image broken '+JSON.stringify(imageData.filter(x=>!x.complete||!x.width)));
    assert.ok(imageData.some(x=>x.src?.includes('semantropic-pop-bg-v1.webp')));
    assert.ok(imageData.some(x=>x.src?.includes('logo-lamina.png')));
    const geometry=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,stageWidth:document.querySelector('.st-home')?.getBoundingClientRect().width}));
    assert.ok(geometry.scrollWidth<=geometry.viewport+1,'Horizontal overflow: '+JSON.stringify(geometry));
    assert.deepEqual(errors,[],'JS errors '+d.name);
    await page.screenshot({path:`artifacts/b02-sheet/${d.name}.png`,fullPage:true});
    console.log('PASS B02-SHEET',d.name,'HTTP',r.status(),JSON.stringify(geometry),'loadedImages',imageData.length);
    await ctx.close();
  }
}catch(e){console.error('FAIL B02-SHEET:',e);process.exitCode=1;}
finally{if(browser)await browser.close();child.kill('SIGTERM');}
process.exit(process.exitCode??0);
