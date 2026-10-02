import assert from 'node:assert/strict';
import { build } from 'vite';
import { readFile, copyFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const original = process.env.SITE_URL;
const browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge'});
try {
  for (const site of ['', 'https://portfolio.example/folio/']) {
    if(site) process.env.SITE_URL=site; else delete process.env.SITE_URL;
    const root=resolve('.verification',site?'subpath':'root');
    await build({configFile:'vite.config.ts',configLoader:'runner',logLevel:'error',build:{outDir:root}});
    await copyFile(resolve(root,'index.html'),resolve(root,'404.html'));
    const mount=site?'/folio/':'/';
    const server=createServer(async(req,res)=>{
      try {
        const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
        const relative=pathname.startsWith(mount)?pathname.slice(mount.length):'missing';
        const target=resolve(root,relative||'index.html');
        if(!target.startsWith(root+sep))throw new Error('Outside root');
        let bytes;let extension=extname(target);
        try{bytes=await readFile(target);}catch{bytes=await readFile(resolve(root,'404.html'));res.statusCode=404;extension='.html';}
        const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
        res.setHeader('Content-Type',types[extension]||'application/octet-stream');res.end(bytes);
      }catch{res.statusCode=400;res.end('Bad request');}
    });
    await new Promise(done=>server.listen(0,'127.0.0.1',done));
    const origin=`http://127.0.0.1:${server.address().port}`;
    const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    try {
      for(const era of [2002,2006,2009,2013,2026]) {
        const response=await page.goto(`${origin}${mount}?era=${era}#contact`);
        assert.equal(response.status(),200);await page.locator('#contact').waitFor();
        assert.equal(await page.locator('.era-control button[aria-pressed="true"]').textContent(),String(era));
      }
      const image=await page.locator('meta[property="og:image"]').getAttribute('content');
      assert.equal(image,site?`${site}social-preview.png`:'/social-preview.png');
      assert.equal(await page.locator('link[rel="canonical"]').count(),site?1:0);
      if(site)assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),site);
      for(const file of ['social-preview.png','apple-touch-icon.png','icon-192.png','icon-512.png','site.webmanifest']){
        const response=await page.request.get(`${origin}${mount}${file}`);assert.equal(response.status(),200,file);
        if(file==='social-preview.png'){const bytes=await response.body();assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),630);}
      }
      const response=await page.goto(`${origin}${mount}missing-page`);assert.equal(response.status(),404);
      await page.getByRole('heading',{name:'This page isn’t here.'}).waitFor();
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex');
      await page.getByRole('link',{name:'Open the portfolio →'}).click();await page.locator('#projects').waitFor();
      assert.equal(new URL(page.url()).pathname,mount);
      assert.deepEqual(errors,[]);
      const plain=await browser.newPage({javaScriptEnabled:false});
      await plain.goto(`${origin}${mount}`);
      assert.equal(await plain.getByRole('link',{name:'Email: stasikent@gmail.com'}).isVisible(),true);
      assert.equal(await plain.getByRole('link',{name:'Telegram: @stasikent'}).isVisible(),true);
      await plain.close();
    }finally{await page.close();await new Promise(done=>server.close(done));}
  }
  console.log('PASS: production root/subpath builds, five eras, assets, social metadata, optional canonical URL, HTTP 404 and recovery link. No deployment performed.');
}finally{if(original===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=original;await browser.close();}
