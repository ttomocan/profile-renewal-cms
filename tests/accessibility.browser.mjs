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
await writeFile(path.join(fixture,'app','page.tsx'),`import ResultsSlider from ${JSON.stringify(root+'/app/_components/ResultsSlider')}; import DiarySlider from ${JSON.stringify(root+'/app/_components/DiarySlider')}; import DynamicBodyClass from ${JSON.stringify(root+'/app/DynamicBodyClass')}; import Link from 'next/link'; const blog=Array.from({length:6},(_,i)=>({id:'article-'+i,title:'CMSの長い記事タイトル '+i+'：キーボードで全カードへ進むための制作記録',category:{id:'activity',name:'活動記録'},createdAt:'2025-10-21',description:'記事の説明を変更せずに表示します。'}));const results=Array.from({length:6},(_,i)=>({id:'result-'+i,title:'制作実績 '+i+' 複数端末に対応したコーポレートサイト',summary:'実績概要を変更せずに表示します。'})); export default function Page(){return <><DynamicBodyClass/><main id="main"><h1>スライダー検証用fixture</h1><section className="p-top-results inner"><h2>制作実績</h2><ResultsSlider results={results} personalArticle={{...blog[0],id:'iropon-release'}}/></section><section className="p-top-diary inner"><h2>日記</h2><DiarySlider blog={blog}/></section><Link href="/away">別ページへ</Link></main></>}`);
await writeFile(path.join(fixture,'app','away','page.tsx'),`import Link from 'next/link';export default function Page(){return <main><h1>遷移先</h1><Link href="/">一覧へ戻る</Link></main>}`);
await mkdir(path.join(fixture,'app','contact'),{recursive:true});await mkdir(path.join(fixture,'app','diary','sample'),{recursive:true});
await writeFile(path.join(fixture,'app','layout.tsx'),`import ${JSON.stringify(root+'/styles/common/style.scss')};import ${JSON.stringify(root+'/styles/pages/top.scss')};import Header from ${JSON.stringify(root+'/app/_components/Header')};import Smooth from ${JSON.stringify(root+'/app/_components/ClientSmoothScrollProvider')};export default function Layout({children}){return <html lang="ja"><body><Smooth/><Header/><div className="l-content">{children}</div></body></html>}`);
await writeFile(path.join(fixture,'app','contact','page.tsx'),`import Form from ${JSON.stringify(root+'/app/_components/ContactForm')};export default function Page(){return <main className="inner"><h1>お問い合わせ</h1><Form/></main>}`);
await writeFile(path.join(fixture,'app','diary','sample','page.tsx'),`import Article from ${JSON.stringify(root+'/app/_components/Article')};const data={id:'sample',title:'目次fixture',category:{id:'activity',name:'活動記録'},createdAt:'2025-10-21',description:'検証用の本文',content:'<p style="height:1200px">導入</p><h2>見出し1</h2><p><a href="/away">本文のリンク1</a></p><p style="height:600px">本文</p><h2>見出し2</h2><p><a href="/away">本文のリンク2</a></p>'};export default function Page(){return <main className="inner"><Article data={data}/></main>}`);
const log=[];const server=spawn(process.execPath,[root+'/node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port','3134'],{cwd:fixture,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
server.stdout.on('data',b=>log.push(b.toString()));server.stderr.on('data',b=>log.push(b.toString()));
let browser;const checks=[];
try {
 for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:3134', {signal:AbortSignal.timeout(10000)})).ok)break;}catch{} await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 await mkdir('/tmp/a11y-evidence',{recursive:true});
 const page=await browser.newPage({viewport:{width:590,height:378},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3134/contact/');await page.getByRole('button',{name:'メニューを開く'}).click();await page.waitForTimeout(350);
 await page.keyboard.press('Tab');await page.keyboard.press('Tab');await page.keyboard.press('Tab');
 const top=page.locator('#global-menu nav a').first();assert.equal(await top.evaluate(e=>document.activeElement===e),true);
 const rect=await top.boundingBox();console.log('Top focus rect',rect);assert.ok(rect.y>=0 && rect.y+rect.height<=378,'Top must be visible');
 const controls=await page.locator('#global-menu a').count();
 for(let i=0;i<controls;i++){await page.keyboard.press('Tab');const r=await page.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return {y:r.y,bottom:r.bottom,inMenu:document.activeElement.closest('#global-menu')!==null||document.activeElement.matches('.l-header__menuBtn-button')};});assert.equal(r.inMenu,true);assert.ok(r.y>=0&&r.bottom<=378,'Every focused menu item must be visible');}
 assert.equal(await page.locator('.l-content').evaluate(e=>e.inert),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'メニューを開く'}).evaluate(e=>e===document.activeElement),true);assert.equal(await page.locator('.l-content').evaluate(e=>e.inert),false);checks.push({menuLowHeight:true,trapEscapeInert:true});
 const groups=await page.getByRole('group',{name:'お問い合わせ項目'}).count();assert.equal(groups,1);assert.equal(await page.locator('[role="radiogroup"]').count(),0);checks.push({nativeRadioGroup:true});
 await page.getByRole('radio',{name:'採用に関するご連絡'}).focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('radio',{name:'業務委託・協業のご相談'}).isChecked(),true);checks.push({nativeRadioArrowKeys:true});
 for(const viewport of [{width:320,height:400},{width:390,height:320}]){
  await page.setViewportSize(viewport);await page.getByRole('button',{name:'メニューを開く'}).click();await page.waitForFunction(()=>document.querySelector('.l-header__menuBtn-button').getAttribute('aria-expanded')==='true' && document.activeElement===document.querySelector('.l-header__menuBtn-button') && getComputedStyle(document.querySelector('#global-menu')).visibility==='visible');
  for(let i=0;i<2;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.closest('#global-menu')!==null||document.activeElement.matches('.l-header__menuBtn-button')),true);}
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('#global-menu a')).every(e=>getComputedStyle(e).visibility==='visible'));
  await page.locator('.l-header__menuBtn-button').focus();
  for(let i=0;i<controls;i++){await page.keyboard.press('Tab');const r=await page.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();const m=document.querySelector('#global-menu');return {y:r.y,bottom:r.bottom,name:document.activeElement.tagName+':'+document.activeElement.textContent.slice(0,60),scroll:m.scrollTop};});assert.ok(r.y>=0&&r.bottom<=viewport.height,JSON.stringify({viewport,step:i,r}));}
  await page.keyboard.press('Escape');checks.push({menuViewport:viewport});
 }
 await page.setViewportSize({width:1440,height:900});await page.waitForFunction(()=>getComputedStyle(document.querySelector('.l-navigation a.current')).color==='rgb(181, 71, 8)');
 const colors=await page.evaluate(()=>{const l=rgb=>rgb.match(/[\d.]+/g).slice(0,3).map(c=>Number(c)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((a,c,i)=>a+c*[0.2126,0.7152,0.0722][i],0);const ratio=(a,b)=>{const x=[l(a),l(b)].sort((x,y)=>y-x);return(x[0]+0.05)/(x[1]+0.05)};const nav=getComputedStyle(document.querySelector('.l-navigation a.current'));const badge=getComputedStyle(document.querySelector('.p-form__required'));return {currentColor:nav.color,currentRatio:ratio(nav.color,getComputedStyle(document.body).backgroundColor),requiredColor:badge.backgroundColor,requiredRatio:ratio(badge.color,badge.backgroundColor)};});
 assert.ok(colors.currentRatio>=4.5);assert.ok(colors.requiredRatio>=4.5);checks.push(colors);
 await page.goto('http://127.0.0.1:3134/diary/sample/');await page.locator('nav[aria-labelledby="table-of-contents-title"] a').first().focus();await page.keyboard.press('Enter');await page.waitForTimeout(350);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'section-1');assert.ok(page.url().endsWith('#section-1'));await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'本文のリンク1');
 await page.locator('nav[aria-labelledby="table-of-contents-title"] a').nth(1).focus();await page.keyboard.press('Enter');await page.waitForTimeout(350);assert.equal(await page.evaluate(()=>document.activeElement.id),'section-2');assert.ok(page.url().endsWith('#section-2'));await page.goBack();await page.waitForTimeout(350);assert.ok(page.url().endsWith('#section-1'));checks.push({tocFocusAndNextTab:true,nativeHashHistory:true});
 await page.goto('http://127.0.0.1:3134/diary/sample/#section-2');await page.waitForTimeout(400);const headingRect=await page.locator('#section-2').boundingBox();assert.ok(headingRect.y>=0&&headingRect.y+headingRect.height<=page.viewportSize().height);checks.push({directHash:true});
 assert.deepEqual(errors,[]);console.log(JSON.stringify(checks,null,2));await writeFile('/tmp/a11y-evidence/five-checks.json',JSON.stringify(checks,null,2));
} finally {await browser?.close();server.kill('SIGTERM');await writeFile('/tmp/a11y-next-server.log',log.join(''));console.log('Fixture:',fixture);}
