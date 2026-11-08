// End-to-end check against the real Supabase project using the seeded test account.
// Usage: node tools/e2e.mjs [baseUrl]
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://127.0.0.1:8766/';
const env = Object.fromEntries(fs.readFileSync(new URL('../.secrets.env', import.meta.url), 'utf8').split('\n').filter(Boolean).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const st = JSON.parse(fs.readFileSync(new URL('../.seed-test.json', import.meta.url), 'utf8'));
const db = (p, o = {}) => fetch(env.SUPABASE_URL + '/rest/v1/' + p, { ...o, headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_ROLE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' } }).then(r => r.json());
let pass = 0, fail = 0; const ok = (c, n, x = '') => { c ? pass++ : fail++; console.log(c ? '  ✓' : '  ✗', n, c ? '' : x); };
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage(); const errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto(base); await page.evaluate(() => { localStorage.clear(); localStorage.setItem('bgdx3-onb', 'true'); }); await page.goto(base, { waitUntil: 'networkidle0' });
await page.type('input[autocomplete="username"]', st.user); await page.type('input[autocomplete="current-password"]', st.pw);
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Sign in').click());
await page.waitForFunction(() => document.body.innerText.includes('to ship'), { timeout: 15000 });
const btn = t => page.evaluate(t => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === t); if (b) b.click(); return !!b; }, t);

// 1. status change from the UI reaches the database
await page.goto(base + '#/detail/A-040', { waitUntil: 'networkidle0' }); await wait(500);
ok(await btn('Blocked'), 'tapped Blocked on A-040');
await wait(2500);
const a040 = (await db(`tasks?select=status,updated_by&workspace_id=eq.${st.ws}&aid=eq.A-040`))[0];
ok(a040 && a040.status === 'Blocked' && a040.updated_by === 'Nafis', 'status saved to the database, updated_by = Nafis', JSON.stringify(a040));

// 2. quick-add a task: database assigns the next ID
await page.goto(base + '#/today', { waitUntil: 'networkidle0' }); await wait(400);
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '' && b.querySelector('svg path[d^="M12 5v14"]'))?.click());
await page.keyboard.press('n'); await wait(600);
await page.keyboard.type('E2E created task !p1'); await page.keyboard.press('Enter'); await wait(3000);
const made = (await db(`tasks?select=aid,title,priority&workspace_id=eq.${st.ws}&title=eq.E2E%20created%20task`))[0];
ok(made && made.aid === 'A-051' && made.priority === 1, 'new task saved with database-assigned A-051 and priority P1', JSON.stringify(made));
ok(await page.evaluate(() => document.body.innerText.includes('E2E created task')), 'new task shows in the app');

// 3. a change made elsewhere appears live (realtime), without reload
await db(`tasks?workspace_id=eq.${st.ws}&aid=eq.A-032`, { method: "PATCH", body: JSON.stringify({ title: "Renamed live by someone else", updated_at: new Date().toISOString() }) });
await page.goto(base + '#/board', { waitUntil: 'networkidle0' }).catch(() => {});
const live = await page.waitForFunction(() => document.body.innerText.includes('Renamed live'), { timeout: 8000 }).then(() => true).catch(() => false);
ok(live, 'change made in the database appears in the open app');
await db(`tasks?workspace_id=eq.${st.ws}&aid=eq.A-006`, { method: 'PATCH', body: JSON.stringify({ title: 'Realtime only rename', updated_at: new Date().toISOString() }) });
const rt = await page.waitForFunction(() => document.body.innerText.includes('Realtime only rename'), { timeout: 8000 }).then(() => true).catch(() => false);
ok(rt, 'live update arrives without any reload or refresh');

// 4. inbox: assigning a task to the test user produces a notification in the app
await db('tasks', { method: 'POST', body: JSON.stringify({ workspace_id: st.ws, title: 'Assigned by Hamim', owner: 'Nafis', status: 'Backlog', priority: 2, updated_by: 'Hamim' }) });
await page.goto(base + '#/inbox', { waitUntil: 'networkidle0' }).catch(() => {});
const inb = await page.waitForFunction(() => document.body.innerText.includes('New task for you'), { timeout: 8000 }).then(() => true).catch(() => false);
ok(inb, 'notification "New task for you" appears on the Notifications page');

ok(errs.length === 0, 'no page errors', errs.join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
