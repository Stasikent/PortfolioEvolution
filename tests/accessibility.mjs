import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({headless:true,channel:"msedge"});
const findings=[];
const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:5186";
try {
 await mkdir("screenshots", {recursive:true});
 for (const width of [320,390,768,1440]) {
 for (const era of [2002,2006,2009,2013,2026]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
  await page.goto(`${base}/?era=${era}`);
  await page.locator("main").waitFor();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(()=>document.activeElement.className), "skip-link");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(()=>document.activeElement.id), "main");
  assert.equal(await page.locator('[tabindex]').evaluateAll(els=>els.some(el=>el.tabIndex>0)),false);
  assert.equal(await page.locator("main").count(),1);
  assert.equal(await page.locator("h1").count(),1);
  const contact=page.locator("#contact");
  assert.equal(await contact.locator('a[href="https://t.me/stasikent"]').count(),1);
  assert.equal(await contact.locator('a[href="mailto:stasikent@gmail.com"]').count(),1);
  if(width<=580){
    await page.getByRole("button",{name:/^Eras:/}).click();
    await page.getByRole("button",{name:"2006",exact:true}).focus();
    await page.keyboard.press("Escape");
    assert.match(await page.evaluate(()=>document.activeElement.textContent),/^Eras:/);
    assert.equal(await page.getByRole("button",{name:/^Eras:/}).getAttribute("aria-expanded"),"false");
  }
  await page.locator("main details").evaluateAll(els=>els.forEach(el=>el.open=true));
  const audit=await page.evaluate(()=>{
    const color=s=>{const m=s.match(/[\d.]+/g);return m ? m.map(Number) : [0,0,0,0]};
    const luminance=c=>c.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
    const failed=[]; const skipped=new Set();
    for(const el of document.querySelectorAll("body *")){
      if(!el.checkVisibility({checkVisibilityCSS:true})||el.closest('[aria-hidden="true"],.sr-only')||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
      const css=getComputedStyle(el); let parent=el,bg=null,gradient=false;
      while(parent){const style=getComputedStyle(parent);if(style.backgroundImage!=="none"){gradient=true;break;}const c=color(style.backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}parent=parent.parentElement;}
      if(gradient){skipped.add(el.className||el.tagName);continue;}
      bg??=[255,255,255];const fg=color(css.color);if(fg.length===4&&fg[3]!==1)continue;
      const l1=luminance(fg),l2=luminance(bg);const ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
      const size=parseFloat(css.fontSize);const minimum=size>=24||(size>=18.66&&parseInt(css.fontWeight)>=700)?3:4.5;
      if(ratio<minimum)failed.push({tag:el.tagName,cls:el.className,text:el.textContent.trim().slice(0,50),ratio:Math.round(ratio*100)/100,fg:css.color,bg,size});
    }
    return {failed,gradientSkipped:[...skipped]};
  });
  assert.deepEqual(audit.failed,[],`Solid-background text contrast ${era}/${width}`);
  if(width===390||width===1440) {
    await contact.screenshot({path:`screenshots/contact-${era}-${width}.png`});
    await writeFile(`screenshots/aria-${era}-${width}.yml`,await page.locator('body').ariaSnapshot());
  }
  // Text-only enlargement: preserve computed styles while doubling each element's font.
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body *')].map(el=>[el,getComputedStyle(el).fontSize]);for(const [el,size]of sizes)el.style.fontSize=`${parseFloat(size)*2}px`;});
  if(width<=580)await page.getByRole("button",{name:/^Eras:/}).click();
  const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>el.checkVisibility()&&!el.closest('[aria-hidden="true"],.sr-only')&&el.getBoundingClientRect().right>innerWidth+2).map(el=>({tag:el.tagName,cls:el.className,width:Math.round(el.getBoundingClientRect().width)})).slice(0,15));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`200% text overflow ${era}/${width}: ${JSON.stringify(overflow)}`);
  assert.deepEqual(overflow,[],`200% text elements ${era}/${width}`);
  findings.push({era,width,...audit,overflow});await page.close();
 }
 }
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const hash of ['%','%E0%A4%A','missing']) {await page.goto(`${base}/#${hash}`);await page.locator('main').waitFor();}
 await page.goto(`${base}/missing-page`);await page.getByRole('heading',{name:'This page isn’t here.'}).waitFor();
 await page.getByRole('link',{name:'Open the portfolio →'}).click();await page.locator('#projects').waitFor();
 assert.deepEqual(errors,[]);findings.push({malformedHash:errors});
 await writeFile('screenshots/accessibility.json',JSON.stringify(findings,null,2));
 console.log("PASS: 20 era/viewport combinations; solid-background text contrast; 200% text and expanded controls; skip-link focus; Escape; landmarks; contact links; malformed fragments; missing-page recovery. Gradients are excluded from automated contrast calculation; this is not a screen-reader audit.");
}finally{await browser.close()}
