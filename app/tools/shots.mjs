// Visual smoke test: logs in with the seeded test account and screenshots key screens.
// Usage: node tools/shots.mjs <outDir> [baseUrl]
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const out = process.argv[2], base = process.argv[3] || 'http://localhost:4173/';
const st = JSON.parse(fs.readFileSync(new URL('../.seed-test.json', import.meta.url), 'utf8'));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const logs = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => logs.push('pageerror: ' + e.message));
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const shot = async name => { await new Promise(r => setTimeout(r, 900)); await page.screenshot({ path: `${out}/${name}.png` }); };
const clickText = async (text) => {
  const ok = await page.evaluate(t => { const el = [...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith(t)); if (el) { el.click(); return true; } return false; }, text);
  if (!ok) logs.push('no button: ' + text);
};

await page.goto(base, { waitUntil: 'networkidle0' });
await page.evaluate(() => localStorage.setItem('bgdx3-onb', 'true'));
await page.goto(base, { waitUntil: 'networkidle0' });
await shot('1-login');
await page.type('input[autocomplete="username"]', st.user);
await page.type('input[autocomplete="current-password"]', st.pw);
await clickText('Sign in');
await page.waitForFunction(() => document.body.innerText.includes('to ship') || document.body.innerText.includes('All clear'), { timeout: 15000 }).catch(() => logs.push('today did not load'));
await shot('2-today');
await page.goto(base + '#/board', { waitUntil: 'networkidle0' }); await shot('3-board');
await page.goto(base + '#/detail/A-032', { waitUntil: 'networkidle0' }); await shot('4-detail');
await page.goto(base + '#/account', { waitUntil: 'networkidle0' }); await shot('5-account');
console.log(logs.length ? logs.join('\n') : 'no console errors');
await browser.close();
