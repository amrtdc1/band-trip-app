#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const base = process.argv[2] || 'http://localhost:3000';
const outDir = path.resolve(process.cwd(), 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const pages = ['/', '/admin.html'];
  const viewports = [
    { name: 'desktop', viewport: { width: 1280, height: 800, isMobile: false }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36' },
    { name: 'mobile', viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' }
  ];

  for (const p of pages) {
    for (const v of viewports) {
      await page.setViewport(v.viewport);
      await page.setUserAgent(v.userAgent);
      const url = new URL(p, base).toString();
      try {
        console.log('Loading', url, 'at', v.name);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(r => setTimeout(r, 600));
        const slug = p === '/' ? 'index' : p.replace(/^\//, '').replace(/\.html$/, '') || 'page';
        const fileName = `${slug}-${v.name}.png`;
        const out = path.join(outDir, fileName);
        await page.screenshot({ path: out, fullPage: true });
        console.log('Saved', out);
      } catch (err) {
        console.error('Error capturing', url, '-', err.message);
      }
    }
  }

  await browser.close();
})();
