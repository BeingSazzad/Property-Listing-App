const puppeteer = require('puppeteer');
const path = require('path');

const filePath = 'file:///' + path.join(__dirname, 'landlord_hq_mobile_screens.html').replace(/\\/g, '/');
const issues = [];
const passes = [];
const log = (s, a, m) => (s === 'FAIL' ? issues : passes).push({ s, a, m });

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (e) => log('FAIL', 'Runtime', e.message));

  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.evaluate(() => {
    sessionStorage.clear();
    STATE.onboardingComplete = true;
    demoLogin('tenant');
  });
  await new Promise((r) => setTimeout(r, 800));

  const home = await page.evaluate(() => ({
    screen: STATE.screen,
    role: STATE.userRole,
    hasNav: !!document.querySelector('.bottom-nav'),
    hasDrawer: !!document.querySelector('.drawer'),
    hasMaintList: !!document.querySelector('.maint-row'),
  }));
  log(home.screen === 'tenant-dashboard' && home.role === 'tenant' ? 'PASS' : 'FAIL', 'Auth', `Home: ${home.screen} role=${home.role}`);
  log(home.hasNav ? 'PASS' : 'FAIL', 'Nav', 'Bottom nav visible on dashboard');
  log(home.hasDrawer ? 'PASS' : 'FAIL', 'Nav', 'Drawer present');

  await page.evaluate(() => go('log-maintenance'));
  await new Promise((r) => setTimeout(r, 400));
  const report = await page.evaluate(() => ({
    screen: STATE.screen,
    title: (document.querySelector('.sub-header-title') || document.querySelector('.page-title'))?.textContent?.trim(),
    hasProperty: (document.getElementById('app')?.innerHTML || '').includes('Your Property'),
  }));
  log(report.screen === 'log-maintenance' ? 'PASS' : 'FAIL', 'Screen', `Report issue: ${report.screen}`);
  log(report.title === 'Report Issue' ? 'PASS' : 'FAIL', 'Header', `Title: ${report.title}`);
  log(report.hasProperty ? 'PASS' : 'FAIL', 'Form', 'Shows tenant property context');

  await page.evaluate(() => go('maintenance-detail', { maintId: 0 }));
  await new Promise((r) => setTimeout(r, 400));
  const detail = await page.evaluate(() => ({
    screen: STATE.screen,
    title: document.querySelector('.sub-header-title')?.textContent?.trim(),
    hasAssign: !!document.querySelector('[data-action="go-assign-contractor"]'),
    hasCancel: !!document.querySelector('[data-action="cancel-maintenance"]'),
    hasTimeline: !!document.querySelector('.maint-progress'),
  }));
  log(detail.screen === 'maintenance-detail' ? 'PASS' : 'FAIL', 'Screen', `Maint detail: ${detail.screen}`);
  log(detail.title && detail.title !== 'Maintenance' ? 'PASS' : 'FAIL', 'Header', `Issue title shown: ${detail.title}`);
  log(!detail.hasAssign ? 'PASS' : 'FAIL', 'Tenant UX', 'No assign contractor action');
  log(!detail.hasCancel ? 'PASS' : 'FAIL', 'Tenant UX', 'No cancel issue action');
  log(detail.hasTimeline ? 'PASS' : 'FAIL', 'Content', 'Progress timeline visible');

  await page.evaluate(() => go('tenant-dashboard'));
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => go('personal-info'));
  await new Promise((r) => setTimeout(r, 400));
  const account = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(account.screen === 'personal-info' ? 'PASS' : 'FAIL', 'Screen', `Account: ${account.screen}`);
  log(account.html.includes('Property') && account.html.includes('Unit') ? 'PASS' : 'FAIL', 'Profile', 'Shows property and unit');

  await page.evaluate(() => go('messages'));
  await new Promise((r) => setTimeout(r, 400));
  const msgs = await page.evaluate(() => ({
    screen: STATE.screen,
    count: document.querySelectorAll('[data-go="chat"]').length,
  }));
  log(msgs.screen === 'messages' ? 'PASS' : 'FAIL', 'Screen', `Messages: ${msgs.screen}`);
  log(msgs.count >= 1 ? 'PASS' : 'FAIL', 'Messages', `${msgs.count} conversation(s)`);

  await browser.close();

  console.log('\n=== TENANT AUDIT ===');
  console.log(`PASS: ${passes.length} | FAIL: ${issues.length}\n`);
  issues.forEach((i) => console.log(`[${i.s}] ${i.a}: ${i.m}`));
  if (!issues.length) console.log('All tenant audit checks passed.');
  process.exit(issues.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
