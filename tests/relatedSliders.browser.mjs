import { mkdtemp, mkdir, writeFile, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = process.cwd().replaceAll('\\', '/');
const fixture = process.env.SLIDER_FIXTURE || await mkdtemp(path.join(os.tmpdir(), 'related-slider-'));
const evidence = process.env.SLIDER_EVIDENCE || path.join(os.tmpdir(), 'related-slider-evidence');
await mkdir(evidence, { recursive: true });
await symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'junction').catch(error => { if (error.code !== 'EEXIST') throw error; });
await symlink(path.join(root, 'public'), path.join(fixture, 'public'), 'junction').catch(error => { if (error.code !== 'EEXIST') throw error; });
for (const route of ['diary/[count]', 'result/[count]', 'away']) await mkdir(path.join(fixture, 'app', route), { recursive: true });
const cmsPath = path.join(fixture, 'cms.ts').replaceAll('\\', '/');
await writeFile(cmsPath, `export const RESULT_LIST_FIELDS='id,title,techStack';
const base={publishedAt:'2026-11-08',createdAt:'2026-11-08',updatedAt:'2026-11-08'};
export async function getBlogDetail(id){return {...base,id,title:'仕事と育児を両立する方法',category:{id,name:'暮らし'},description:'本文の概要です。',content:'<h2>家事の分担</h2><p>記事の本文です。</p>'};}
export async function getBlogList(query){const count=Number(query.filters.match(/\\d+/)?.[0]||3);return {contents:Array.from({length:count},(_,i)=>({...base,id:'article-'+i,title:'関連記事 '+i+' 長いタイトルでも画面内に収まることを確認する',category:{id:'life',name:'暮らし'},description:'同じカテゴリーの関連記事の説明文です。'}))};}
export async function getResultDetail(id){return {...base,id,title:'不動産買取サービスの公式サイト',summary:'制作実績の概要です。',techStack:'tech'+id};}
export async function getAllResultList(){return [1,3].flatMap(count=>Array.from({length:count},(_,i)=>({...base,id:'related-'+count+'-'+i,title:'関連する制作実績 '+i+' レスポンシブな公式サイト制作',summary:'既存の概要と技術タグを保持します。',techStack:'tech'+count})));}`);
await writeFile(path.join(fixture,'package.json'), JSON.stringify({name:'related-slider-fixture',private:true}));
await writeFile(path.join(fixture,'tsconfig.json'), JSON.stringify({compilerOptions:{target:'ES2022',jsx:'preserve',module:'esnext',moduleResolution:'bundler',esModuleInterop:true,paths:{'@/*':[root+'/*']}},include:['**/*.ts','**/*.tsx']}));
await writeFile(path.join(fixture,'next.config.mjs'), `export default {experimental:{externalDir:true},webpack(c){c.resolve.alias['@/app/_libs/microcms$']=${JSON.stringify(cmsPath)};c.resolve.alias['@']=${JSON.stringify(root)};return c;},images:{unoptimized:true},devIndicators:false};`);
await writeFile(path.join(fixture,'app/layout.tsx'), `import ${JSON.stringify(root+'/styles/common/style.scss')}; import ${JSON.stringify(root+'/styles/pages/result.scss')}; import ${JSON.stringify(root+'/styles/common/animation.scss')}; import DynamicBodyClass from ${JSON.stringify(root+'/app/DynamicBodyClass')}; import Link from 'next/link';export default function Layout({children}){return <html lang="ja"><head><noscript><style>{'.fadeUpTrigger{opacity:1!important;transform:none!important}'}</style></noscript></head><body><DynamicBodyClass/><nav><Link href="/">トップ</Link> <Link href="/away">別ページへ</Link></nav>{children}</body></html>}`);
await writeFile(path.join(fixture,'app/diary/[count]/page.tsx'), `import Page from ${JSON.stringify(root+'/app/diary/[slug]/page')};export default async function Fixture({params}){const {count}=await params;return <Page params={Promise.resolve({slug:count})} searchParams={Promise.resolve({})}/>}`);
await writeFile(path.join(fixture,'app/result/[count]/page.tsx'), `import Page from ${JSON.stringify(root+'/app/result/[id]/page')};export default async function Fixture({params}){const {count}=await params;return <Page params={Promise.resolve({id:count})}/>}`);
await writeFile(path.join(fixture,'app/page.tsx'), `import ${JSON.stringify(root+'/styles/pages/top.scss')};import DiarySlider from ${JSON.stringify(root+'/app/_components/DiarySlider')};import ResultsSlider from ${JSON.stringify(root+'/app/_components/ResultsSlider')};const blog=Array.from({length:6},(_,i)=>({id:'article-'+i,title:'トップの記事 '+i,category:{id:'life',name:'暮らし'},createdAt:'2026-11-08',description:'記事概要'}));const results=Array.from({length:6},(_,i)=>({id:'project-'+i,title:'制作実績 '+i,summary:'実績概要'}));export default function Page(){return <main><h1>トップの回帰確認</h1>{[1,6].map(n=><div key={n} data-count={n}><section className="p-top-results inner"><div className="p-top-results__list"><ResultsSlider results={results.slice(0,n)}/></div></section><section className="p-top-diary inner"><div className="p-top-diary__list"><DiarySlider blog={blog.slice(0,n)}/></div></section></div>)}</main>}`);
await writeFile(path.join(fixture,'app/away/page.tsx'), `import Link from 'next/link';export default function Page(){return <main><h1>遷移先</h1><Link href="/diary/3">関連記事へ戻る</Link></main>}`);
const logs=[];const port=3146;
const server=spawn(process.execPath,[root+'/node_modules/next/dist/bin/next','dev','--webpack','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
server.stdout.on('data',b=>logs.push(b.toString()));server.stderr.on('data',b=>logs.push(b.toString()));
let browser;const checks=[];
try{
 for(let i=0;i<90;i++){try{if((await fetch(`http://127.0.0.1:${port}/diary/3`,{signal:AbortSignal.timeout(15000)})).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({channel:'chrome',headless:true});
 for(const width of [1440,768,767,390,320]){
  for(const kind of ['diary','result'])for(const count of [0,1,3]){
   const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(`http://127.0.0.1:${port}/${kind}/${count}`);await page.waitForTimeout(300);
   const selector=kind==='diary'?'.diary-slider-wrapper':'.results-slider-wrapper';const slider=page.locator(selector);
   assert.equal(await slider.count(),count?1:0);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${kind}/${count} overflow ${width}`);
   if(count){
    await slider.scrollIntoViewIfNeeded();
    assert.equal(await slider.locator('.splide__slide').count(),count);
    if(count===1){assert.equal(await slider.locator('button').count(),0);assert.equal(await slider.locator('.splide__slide[aria-hidden="true"]').count(),0);}
    if(count===3 && width<768){
     await slider.locator('.splide__arrow--next').waitFor({state:'visible'});
     const next=slider.locator('.splide__arrow--next');await next.focus();await page.keyboard.press('Enter');await page.waitForTimeout(450);
     assert.equal(await slider.locator('.splide__slide').nth(1).getAttribute('aria-hidden'),null);
     await next.click();await page.waitForTimeout(450);assert.equal(await next.isDisabled(),true);
     assert.equal(await slider.locator('.splide__slide').nth(2).getAttribute('aria-hidden'),null);
     await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!document.activeElement.closest('[aria-hidden="true"]')),true);
     await page.emulateMedia({reducedMotion:'reduce'});await slider.locator('.splide__arrow--prev').click();
     assert.ok(await slider.locator('.splide__list').evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration)<0.001));
    }
    if(count===3 && width>=768){assert.equal(await slider.locator('.splide__list').evaluate(e=>getComputedStyle(e).display),'grid');assert.equal(await slider.locator('a[tabindex="-1"]').count(),0);}
    if(width===1440||width===390)await slider.screenshot({path:path.join(evidence,`${kind}-${count}-${width}.png`)});
   }
   assert.deepEqual(errors,[]);checks.push({kind,count,width,passed:true});await page.close();
  }
 }
 const page=await browser.newPage({viewport:{width:390,height:900}});await page.goto(`http://127.0.0.1:${port}/`);await page.waitForTimeout(400);
 for(const s of await page.locator('[data-count="1"] .card-slider--static').all()) {assert.equal(await s.locator('button').count(),0);assert.equal(await s.locator('ul').evaluate(e=>getComputedStyle(e).paddingLeft),'0px');}
 assert.equal(await page.locator('[data-count="6"] .splide.is-active').count(),2);checks.push({homepageSingleAndMultiple:true});
 await page.goto(`http://127.0.0.1:${port}/diary/3`);await page.waitForTimeout(300);await page.setViewportSize({width:1440,height:900});await page.locator('.diary-slider-wrapper .splide__slide:last-child a').focus();await page.setViewportSize({width:390,height:900});await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>!document.activeElement.closest('[aria-hidden="true"]')),true);await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(300);assert.equal(await page.locator('.diary-slider-wrapper a[tabindex="-1"]').count(),0);checks.push({resizeFocusRestoration:true});
 await page.getByRole('link',{name:'別ページへ',exact:true}).click();await page.getByRole('heading',{name:'遷移先'}).waitFor();await page.getByRole('link',{name:'関連記事へ戻る'}).click();await page.getByRole('heading',{name:'同じカテゴリーの関連記事'}).waitFor();assert.equal(await page.locator('.diary-slider-wrapper').count(),1);assert.equal(await page.locator('.splide__slide--clone').count(),0);checks.push({navigationRemount:true});await page.close();
 for(const kind of ['diary','result'])for(const count of [1,3]){const p=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:900}});await p.goto(`http://127.0.0.1:${port}/${kind}/${count}`);assert.equal(await p.locator('.splide__slide a').count(),count);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await p.locator('.splide__arrows').isVisible().catch(()=>false),false);checks.push({kind,count,noJS:true});await p.close();}
 console.log(JSON.stringify(checks,null,2));await writeFile(path.join(evidence,'checks.json'),JSON.stringify(checks,null,2));
}finally{await browser?.close();server.kill();await writeFile(path.join(evidence,'server.log'),logs.join(''));console.log('Fixture:',fixture);}
