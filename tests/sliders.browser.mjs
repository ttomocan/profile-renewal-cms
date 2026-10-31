import { mkdtemp, mkdir, writeFile, symlink, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
// Use a separately installed Playwright; it is not a product dependency.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=process.cwd(), fixture=await mkdtemp(path.join(os.tmpdir(),'a11y-next-'));
await mkdir(path.join(fixture,'app','away'),{recursive:true});
await symlink(path.join(root,'node_modules'),path.join(fixture,'node_modules'));
await symlink(path.join(root,'public'),path.join(fixture,'public'));
await symlink(path.join(root,'app','icon.png'),path.join(fixture,'app','icon.png'));
await writeFile(path.join(fixture,'package.json'),JSON.stringify({name:'slider-qa-fixture',private:true,scripts:{},dependencies:{next:'16.0.7',react:'19.2.1','react-dom':'19.2.1'}}));
await writeFile(path.join(fixture,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',jsx:'preserve',module:'esnext',moduleResolution:'bundler',esModuleInterop:true,paths:{'@/*':[root+'/*']}},include:['**/*.ts','**/*.tsx']}));
await writeFile(path.join(fixture,'next.config.mjs'),`export default { experimental: { externalDir: true }, webpack(c) { c.resolve.alias['@'] = ${JSON.stringify(root)}; return c; }, images: { unoptimized: true }, devIndicators: false };`);
await writeFile(path.join(fixture,'app','layout.tsx'),`import ${JSON.stringify(root+'/styles/common/style.scss')}; import ${JSON.stringify(root+'/styles/pages/top.scss')}; export default function Layout({children}) {return <html lang="ja"><head><noscript><style>{'.fadeUpTrigger{opacity:1!important;transform:none!important}'}</style></noscript></head><body className="top">{children}</body></html>}`);
await writeFile(path.join(fixture,'app','page.tsx'),`import ResultsSlider from ${JSON.stringify(root+'/app/_components/ResultsSlider')}; import DiarySlider from ${JSON.stringify(root+'/app/_components/DiarySlider')}; import DynamicBodyClass from ${JSON.stringify(root+'/app/DynamicBodyClass')}; import Link from 'next/link'; const blog=Array.from({length:6},(_,i)=>({id:'article-'+i,title:'CMSの長い記事タイトル '+i+'：キーボードで全カードへ進むための制作記録',category:{id:'activity',name:'活動記録'},createdAt:'2025-10-21',description:'記事の説明を変更せずに表示します。'}));const results=Array.from({length:6},(_,i)=>({id:'result-'+i,title:'制作実績 '+i+' 複数端末に対応したコーポレートサイト',summary:'実績概要を変更せずに表示します。'})); export default function Page(){return <><DynamicBodyClass/><main id="main"><h1>スライダー検証用fixture</h1><section className="p-top-results inner"><h2>制作実績</h2><ResultsSlider results={results}/></section><section className="p-top-diary inner"><h2>日記</h2><DiarySlider blog={blog}/></section><Link href="/away">別ページへ</Link></main></>}`);
await writeFile(path.join(fixture,'app','away','page.tsx'),`import Link from 'next/link';export default function Page(){return <main><h1>遷移先</h1><Link href="/">一覧へ戻る</Link></main>}`);
const log=[];const server=spawn(process.execPath,[root+'/node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port','3134'],{cwd:fixture,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
server.stdout.on('data',b=>log.push(b.toString()));server.stderr.on('data',b=>log.push(b.toString()));
let browser;const checks=[];
try {
 for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:3134', {signal:AbortSignal.timeout(10000)})).ok)break;}catch{} await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 await mkdir('/tmp/a11y-evidence',{recursive:true});
 for(const width of [1440,768,767,390,320]) {
  const page=await browser.newPage({viewport:{width,height:900}}); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:3134'); await page.waitForSelector('.card-slider');await page.waitForTimeout(700);
  const mobile=width<768;
  const state=await page.evaluate(()=>[...document.querySelectorAll('.card-slider')].map(s=>({label:s.getAttribute('aria-label'),listDisplay:getComputedStyle(s.querySelector('.splide__list')).display,links:s.querySelectorAll('a').length,hidden:[...s.querySelectorAll('[aria-hidden="true"] a')].map(a=>a.tabIndex),visible:[...s.querySelectorAll('.splide__slide:not([aria-hidden="true"]) a')].map(a=>a.getAttribute('href')),clones:s.querySelectorAll('.splide__slide--clone').length,live:s.querySelector('.splide__track').getAttribute('aria-live'),controls:[...s.querySelectorAll('button')].map(b=>({name:b.getAttribute('aria-label'),display:getComputedStyle(b).display,width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height}))})));
  assert.equal(state.length,2);assert.deepEqual(state.map(x=>x.links),[7,6]);assert.deepEqual(state.map(x=>x.label),['制作実績と個人開発','活動記録の記事']);
  for(const s of state){assert.equal(s.clones,0);assert.equal(s.listDisplay,mobile?'flex':'grid');if(mobile){assert.equal(s.live,'polite');assert.ok(s.hidden.every(t=>t===-1));assert.equal(s.visible.length,1);assert.ok(s.controls.every(c=>c.width>=44&&c.height>=44));}else{assert.equal(s.visible.length,s.links);}}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);
  if(width===390){
   const first=await page.locator('.results-slider-wrapper .splide__slide.is-active').getAttribute('id');
   await page.waitForTimeout(5500);
   assert.equal(await page.locator('.results-slider-wrapper .splide__slide.is-active').getAttribute('id'),first);
   checks.push({autoplayDisabledNormalMotion:true});
  }
  if(mobile){
   for(const kind of ['results','diary']){
    const slider=page.locator('.'+kind+'-slider-wrapper');const next=slider.locator('.splide__arrow--next');
    await next.focus();await page.keyboard.press('Enter');await page.waitForTimeout(450);
    assert.equal(await slider.locator('.splide__slide').nth(1).getAttribute('aria-hidden'),null);
    await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.closest('[aria-hidden="true"]')===null),true);
    const outline=await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle);assert.equal(outline,'solid');
    for(let i=2;i<(kind==='results'?7:6);i++){await next.click();await page.waitForTimeout(450);}
    assert.equal(await next.isDisabled(),true);assert.equal(await slider.locator('.splide__slide:last-child').getAttribute('aria-hidden'),null);
   }
   await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.results-slider-wrapper .splide__arrow--prev').click();
   assert.ok(await page.locator('.results-slider-wrapper .splide__list').evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration)<=0.00001));
   const before=await page.locator('.results-slider-wrapper .is-active').getAttribute('id');await page.waitForTimeout(900);assert.equal(await page.locator('.results-slider-wrapper .is-active').getAttribute('id'),before);
  }
  await page.screenshot({path:'/tmp/a11y-evidence/sliders-'+width+'.png',fullPage:true});
  // Next client navigation destroys the instance, then returning remounts cleanly.
  await page.getByRole('link',{name:'別ページへ'}).click();await page.getByRole('heading',{name:'遷移先'}).waitFor();await page.getByRole('link',{name:'一覧へ戻る'}).click();await page.waitForTimeout(500);
  assert.equal(await page.locator('.splide__slide--clone').count(),0);assert.equal(await page.locator('.card-slider').count(),2);
  assert.deepEqual(errors,[]);checks.push({width,state,hydrationErrors:errors,nextNavigation:true});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:3134');await page.waitForTimeout(700);
 await page.locator('.diary-slider-wrapper .splide__slide:last-child a').focus();await page.setViewportSize({width:390,height:900});await page.waitForTimeout(500);
 assert.equal(await page.evaluate(()=>document.activeElement.closest('[aria-hidden="true"]')===null),true);
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(500);
 assert.equal(await page.locator('.card-slider [aria-hidden="true"] a').count(),0);assert.equal(await page.locator('.card-slider a[tabindex="-1"]').count(),0);
 checks.push({resizeFocusedCard:true,desktopTabindexRestored:true});await page.close();
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});await nojs.goto('http://127.0.0.1:3134');
 assert.equal(await nojs.locator('.card-slider a').count(),13);assert.equal(await nojs.locator('.card-slider').first().isVisible(),true);checks.push({noJSLinks:13});await nojs.close();
 console.log(JSON.stringify(checks,null,2));await writeFile('/tmp/a11y-evidence/checks.json',JSON.stringify(checks,null,2));
} finally {await browser?.close();server.kill('SIGTERM');await writeFile('/tmp/a11y-next-server.log',log.join(''));console.log('Fixture:',fixture);}
