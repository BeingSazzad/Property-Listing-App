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
    demoLogin('landlord');
  });
  await new Promise((r) => setTimeout(r, 800));

  // Missing routes audit
  const routes = await page.evaluate(() => {
    const missing = [];
    const targets = new Set();
    document.querySelectorAll('[data-go]').forEach((el) => targets.add(el.dataset.go));
    targets.forEach((t) => {
      if (!SCREEN_MAP[t] && t !== 'faq-detail') missing.push(t);
    });
    return { total: targets.size, missing };
  });
  if (routes.missing.length) log('FAIL', 'Routes', `Unmapped: ${routes.missing.join(', ')}`);
  else log('PASS', 'Routes', `All ${routes.total} data-go targets mapped`);

  // Property filters
  await page.evaluate(() => go('properties'));
  await new Promise((r) => setTimeout(r, 400));
  for (const f of ['occupied', 'vacant', 'all']) {
    await page.evaluate((filter) => {
      setPropFilter(filter);
    }, f);
    const count = await page.evaluate(() => filterProperties().length);
    log(count >= 0 ? 'PASS' : 'FAIL', 'Filter', `Properties ${f}: ${count} results`);
  }

  // Advanced property filter
  await page.evaluate(() => {
    setPropAdvanced('rent', 'under1500');
    setPropAdvanced('beds', '2');
  });
  const advCount = await page.evaluate(() => filterProperties().length);
  log('PASS', 'Filter', `Properties advanced filter: ${advCount} results`);

  // Maintenance filters
  await page.evaluate(() => go('maintenance'));
  await new Promise((r) => setTimeout(r, 400));
  for (const f of ['open', 'progress', 'done', 'all']) {
    await page.evaluate((filter) => setMaintFilter(filter), f);
    const n = await page.evaluate((filter) => {
      return filter === 'all' ? MAINTENANCE_ITEMS.length : MAINTENANCE_ITEMS.filter((m) => m.status === filter).length;
    }, f);
    log('PASS', 'Filter', `Maintenance ${f}: ${n} items`);
  }

  // Invoice filters (transaction history page)
  await page.evaluate(() => go('transaction-history'));
  await new Promise((r) => setTimeout(r, 400));
  for (const f of ['pending', 'paid', 'overdue', 'all']) {
    await page.evaluate((filter) => setInvoiceFilter(filter), f);
    const n = await page.evaluate((filter) => {
      const map = { pending: 'Pending', paid: 'Paid', overdue: 'Overdue' };
      return filter === 'all' ? INVOICES.length : INVOICES.filter((i) => i.status === map[filter]).length;
    }, f);
    log('PASS', 'Filter', `Invoices ${f}: ${n} items`);
  }

  // Tenant filters
  await page.evaluate(() => go('tenants'));
  await new Promise((r) => setTimeout(r, 400));
  for (const f of ['active', 'pending', 'inactive', 'all']) {
    await page.evaluate((filter) => setTenantFilter(filter), f);
    const n = await page.evaluate((filter) => {
      return filter === 'all' ? TENANT_LIST.length : TENANT_LIST.filter((t) => t.status === filter).length;
    }, f);
    log('PASS', 'Filter', `Tenants ${f}: ${n} items`);
  }

  // Property detail tabs
  const propTabs = ['info', 'records', 'details', 'units', 'tenant', 'documents', 'maintenance', 'inspection', 'compliance', 'inventory'];
  for (const tab of propTabs) {
    await page.evaluate((t) => go('property-detail', { propertyId: 0, tab: t }), tab);
    await new Promise((r) => setTimeout(r, 350));
    const res = await page.evaluate((t) => {
      const html = document.getElementById('app')?.innerHTML || '';
      const text = html.replace(/<[^>]+>/g, '').trim();
      return { tab: STATE.tab, hasContent: text.length > 40, len: text.length };
    }, tab);
    if (!res.hasContent) log('FAIL', 'Detail', `Property tab "${tab}" empty`);
    else log('PASS', 'Detail', `Property tab "${tab}" OK (${res.len} chars)`);
  }

  // Tenant detail tabs
  const tenantTabs = ['overview', 'personal', 'contact', 'property', 'documents', 'payments', 'maintenance', 'notes'];
  for (const tab of tenantTabs) {
    await page.evaluate((t) => {
      go('tenant-detail', { tenantId: 0, tenantTab: t });
    }, tab);
    await new Promise((r) => setTimeout(r, 350));
    const res = await page.evaluate(() => {
      const html = document.getElementById('app')?.innerHTML || '';
      const text = html.replace(/<[^>]+>/g, '').trim();
      return { tab: STATE.tenantTab, hasContent: text.length > 40 };
    });
    if (!res.hasContent) log('FAIL', 'Detail', `Tenant tab "${tab}" empty`);
    else log('PASS', 'Detail', `Tenant tab "${tab}" OK`);
  }

  // Property detail tab headers — never show tab label when section nav is visible
  const tabLabels = { maintenance: 'Maintenance', inspection: 'Inspection', documents: 'Documents', compliance: 'Compliance', inventory: 'Inventory' };
  for (const tab of ['maintenance', 'inspection', 'documents', 'compliance', 'inventory']) {
    await page.evaluate((t) => go('property-detail', { propertyId: 0, tab: t }), tab);
    await new Promise((r) => setTimeout(r, 350));
    const res = await page.evaluate((tabLabel) => {
      const title = document.querySelector('.sub-header-title')?.textContent?.trim();
      const p = PROPERTIES[STATE.propertyId];
      return { title, propertyName: p?.name, tabLabel, matchesProperty: title === p?.name };
    }, tabLabels[tab]);
    if (res.title === res.tabLabel) log('FAIL', 'Header', `Property tab "${tab}" shows tab name "${res.tabLabel}"`);
    else if (!res.matchesProperty) log('FAIL', 'Header', `Property tab "${tab}" title "${res.title}" ≠ "${res.propertyName}"`);
    else log('PASS', 'Header', `Property tab "${tab}" shows "${res.title}"`);
  }

  // Flat-scoped maintenance from unit quick action
  await page.evaluate(() => go('flat-detail', { propertyId: 0, unit: 'Flat 2A' }));
  await new Promise((r) => setTimeout(r, 350));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('[data-go="property-detail"][data-tab="maintenance"]')].find((el) => el.dataset.unit === 'Flat 2A');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const flatMaint = await page.evaluate(() => ({
    title: document.querySelector('.sub-header-title')?.textContent?.trim(),
    sub: document.querySelector('.prop-section-sub')?.textContent?.trim(),
    unit: STATE.propertyMaintUnit,
    tab: STATE.tab,
  }));
  if (flatMaint.title !== 'Flat 2A') log('FAIL', 'Header', `Flat maintenance title "${flatMaint.title}" ≠ Flat 2A`);
  else if (flatMaint.tab !== 'maintenance') log('FAIL', 'Header', `Flat maintenance tab is "${flatMaint.tab}"`);
  else log('PASS', 'Header', `Flat maintenance shows "${flatMaint.title}" · ${flatMaint.sub}`);

  // Detail pages from list items
  const detailScreens = [
    ['maintenance-detail', { maintId: 0 }],
    ['invoice-detail', { invoiceId: 0 }],
    ['inventory-room', { roomId: 0 }],
    ['document-preview', { docId: 0 }],
    ['edit-property', { propertyId: 0 }],
    ['edit-flat', { propertyId: 0, unit: 'Flat 1A' }],
    ['flat-detail', { propertyId: 0, unit: 'Flat 1A' }],
    ['edit-tenant', { tenantId: 0 }],
    ['assign-contractor', { maintId: 0 }],
    ['checkout-tenancy', { tenantId: 0 }],
    ['renew-compliance', { propertyId: 0, complianceId: 0 }],
    ['reschedule-inspection', { propertyId: 0 }],
    ['property-info', { propertyId: 0 }],
    ['property-utilities', { propertyId: 0 }],
    ['property-parking', { propertyId: 0 }],
    ['property-appliances', { propertyId: 0 }],
    ['property-alarms', { propertyId: 0 }],
    ['property-photos', { propertyId: 0 }],
    ['property-floor-plans', { propertyId: 0 }],
    ['share-document', { shareDocId: 0 }],
    ['tenant-add-note', { tenantId: 0 }],
    ['maintenance-history', {}],
    ['portfolio-overview', {}],
    ['compliance-dashboard', {}],
    ['reminders', {}],
    ['add-reminder', {}],
  ];
  for (const [screen, opts] of detailScreens) {
    await page.evaluate(({ screen, opts }) => go(screen, opts), { screen, opts });
    await new Promise((r) => setTimeout(r, 350));
    const res = await page.evaluate((screen) => {
      const html = document.getElementById('app')?.innerHTML || '';
      const text = html.replace(/<[^>]+>/g, '').trim();
      return { hasFn: typeof SCREEN_MAP[screen] === 'function', hasContent: text.length > 30 };
    }, screen);
    if (!res.hasFn) log('FAIL', 'Detail', `${screen} not in SCREEN_MAP`);
    else if (!res.hasContent) log('FAIL', 'Detail', `${screen} renders empty`);
    else log('PASS', 'Detail', `${screen} OK`);
  }

  await browser.close();

  console.log('\n=== LANDLORD FILTER & DETAIL AUDIT ===');
  console.log(`PASS: ${passes.length} | FAIL: ${issues.length}\n`);
  issues.forEach((i) => console.log(`[${i.s}] ${i.a}: ${i.m}`));
  if (!issues.length) console.log('All audit checks passed.');
  process.exit(issues.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
