const puppeteer = require('puppeteer');
const path = require('path');

const filePath = 'file:///' + path.join(__dirname, 'landlord_hq_mobile_screens.html').replace(/\\/g, '/');

const issues = [];
const passes = [];

function log(status, area, msg) {
  const row = { status, area, msg };
  if (status === 'FAIL') issues.push(row);
  else passes.push(row);
}

async function clickGo(page, screen, opts = {}) {
  await page.evaluate(({ screen, opts }) => {
    if (typeof go === 'function') go(screen, opts);
  }, { screen, opts });
  await new Promise((r) => setTimeout(r, 400));
}

async function demoLogin(page) {
  await page.evaluate(() => {
    sessionStorage.clear();
    if (typeof demoLogin === 'function') demoLogin('landlord');
  });
  await new Promise((r) => setTimeout(r, 800));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (e) => log('FAIL', 'Runtime', e.message));

  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  const splash = await page.evaluate(() => STATE?.screen);
  log(splash === 'splash' || splash === 'onboarding' ? 'PASS' : 'FAIL', 'Boot', `Initial screen: ${splash}`);

  await page.evaluate(() => {
    STATE.onboardingComplete = true;
    if (typeof render === 'function') render();
  });
  await new Promise((r) => setTimeout(r, 300));

  await clickGo(page, 'role-select');
  const role = await page.evaluate(() => STATE.screen);
  log(role === 'role-select' ? 'PASS' : 'FAIL', 'Auth', `Role select: ${role}`);

  await clickGo(page, 'sign-in');
  await demoLogin(page);
  const afterLogin = await page.evaluate(() => ({
    screen: STATE.screen,
    auth: STATE.isAuthenticated,
    role: STATE.userRole,
  }));
  log(afterLogin.auth && afterLogin.role === 'landlord' ? 'PASS' : 'FAIL', 'Auth', `Demo login → ${afterLogin.screen}, auth=${afterLogin.auth}`);

  const landlordScreens = [
    ['dashboard', {}],
    ['properties', {}],
    ['property-detail', { propertyId: 0, tab: 'units' }],
    ['flat-detail', { propertyId: 0, unit: 'Flat 1A' }],
    ['property-detail', { propertyId: 0, tab: 'tenant' }],
    ['property-detail', { propertyId: 0, tab: 'maintenance' }],
    ['property-detail', { propertyId: 0, tab: 'documents' }],
    ['property-detail', { propertyId: 0, tab: 'compliance' }],
    ['tenants', {}],
    ['tenant-detail', { tenantId: 0 }],
    ['maintenance', {}],
    ['maintenance-detail', { maintId: 0 }],
    ['financial', {}],
    ['invoice-detail', { invoiceId: 0 }],
    ['messages', {}],
    ['chat', { chatId: 0 }],
    ['notifications-list', {}],
    ['profile', {}],
    ['help-support', {}],
    ['faq', {}],
    ['privacy', {}],
    ['terms', {}],
    ['about', {}],
    ['personal-info', {}],
    ['notifications-settings', {}],
    ['security', {}],
    ['preferences', {}],
    ['payment-methods', {}],
    ['transaction-history', {}],
    ['subscription', {}],
    ['add-property', {}],
    ['invite-tenant', { propertyId: 0 }],
    ['create-tenancy', { propertyId: 0 }],
    ['log-maintenance', {}],
    ['unit-utilities', { propertyId: 0, unit: 'Flat 2A' }],
    ['reminders', {}],
    ['compliance-dashboard', {}],
    ['portfolio-overview', {}],
    ['select-property-invite', {}],
    ['global-search', {}],
  ];

  for (const [screen, opts] of landlordScreens) {
    await clickGo(page, screen, opts);
    const result = await page.evaluate((screen) => {
      const html = document.getElementById('app')?.innerHTML || '';
      const hasContent = html.replace(/<[^>]+>/g, '').trim().length > 30;
      const fn = SCREEN_MAP[screen];
      return {
        screen: STATE.screen,
        hasContent,
        hasFn: typeof fn === 'function',
        htmlLen: html.length,
      };
    }, screen);

    if (!result.hasFn) log('FAIL', 'Screen', `${screen} missing from SCREEN_MAP`);
    else if (!result.hasContent) log('FAIL', 'Screen', `${screen} renders empty (${result.htmlLen} chars)`);
    else if (result.screen !== screen && screen !== 'faq-detail') log('WARN', 'Screen', `${screen} redirected to ${result.screen}`);
    else log('PASS', 'Screen', `${screen} OK (${result.htmlLen} chars)`);
  }

  const navChecks = await page.evaluate(() => {
    const missing = [];
    const targets = new Set();
    document.querySelectorAll('[data-go]').forEach((el) => targets.add(el.dataset.go));
    targets.forEach((t) => {
      if (!SCREEN_MAP[t] && t !== 'faq-detail') missing.push(t);
    });
    return { targetCount: targets.size, missing };
  });
  if (navChecks.missing.length) log('FAIL', 'Navigation', `Missing screens: ${navChecks.missing.join(', ')}`);
  else log('PASS', 'Navigation', `All ${navChecks.targetCount} data-go targets mapped`);

  const stats = await page.evaluate(() => typeof portfolioStats === 'function' ? portfolioStats() : null);
  if (stats && stats.totalUnits > 0) log('PASS', 'Data', `Portfolio: ${stats.buildingCount} buildings, ${stats.totalUnits} units, ${stats.vacantUnits} vacant`);
  else log('FAIL', 'Data', 'portfolioStats failed or zero units');

  const unitModel = await page.evaluate(() => {
    const units = typeof getPropertyUnits === 'function' ? getPropertyUnits(0) : [];
    return { count: units.length, isObject: units[0] && typeof units[0] === 'object' };
  });
  log(unitModel.count >= 4 && unitModel.isObject ? 'PASS' : 'FAIL', 'Units', `Property 0 has ${unitModel.count} unit records`);

  await browser.close();

  console.log('\n=== LANDLORD E2E REPORT ===');
  console.log(`PASS: ${passes.length} | FAIL/WARN: ${issues.length}\n`);
  issues.forEach((i) => console.log(`[${i.status}] ${i.area}: ${i.msg}`));
  if (!issues.length) console.log('All checks passed.');
  process.exit(issues.filter((i) => i.status === 'FAIL').length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
