const puppeteer = require('puppeteer');
const path = require('path');

const filePath = 'file:///' + path.join(__dirname, 'landlord_hq_mobile_screens.html').replace(/\\/g, '/');

const issues = [];
const passes = [];
const log = (status, area, msg) => (status === 'FAIL' ? issues : passes).push({ status, area, msg });

async function run(page, fn) {
  await page.evaluate(fn);
  await new Promise((r) => setTimeout(r, 700));
}

function setField(page, key, value, invite = false) {
  const attr = invite ? 'data-invite' : 'data-field';
  return page.evaluate(({ attr, key, value }) => {
    const el = document.querySelector(`[${attr}="${key}"]`);
    if (el) el.value = value;
  }, { attr, key, value });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (e) => log('FAIL', 'Runtime', e.message));

  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));

  await run(page, () => {
    sessionStorage.clear();
    STATE.onboardingComplete = true;
    demoLogin('landlord');
  });

  // Add property
  await run(page, () => go('add-property'));
  await setField(page, 'name', 'E2E Test Building');
  await setField(page, 'address', '1 Test Street');
  await setField(page, 'rent', '1200');
  await setField(page, 'floors', '2');
  await setField(page, 'flatsPerFloor', '2');
  const beforeProps = await page.evaluate(() => PROPERTIES.length);
  await run(page, () => saveAddProperty());
  const afterAdd = await page.evaluate(() => ({
    len: PROPERTIES.length,
    screen: STATE.screen,
    last: PROPERTIES[PROPERTIES.length - 1]?.name,
  }));
  log(afterAdd.len > beforeProps && afterAdd.screen === 'properties' ? 'PASS' : 'FAIL', 'Flow', `Add property: ${JSON.stringify(afterAdd)}`);

  // Invite tenant validation (empty form)
  await run(page, () => go('invite-tenant', { propertyId: 0 }));
  await run(page, () => sendTenantInvitation());
  const toastAfterEmpty = await page.evaluate(() => document.querySelector('.toast')?.textContent || '');
  log(toastAfterEmpty.includes('NID') || toastAfterEmpty.includes('name') ? 'PASS' : 'FAIL', 'Flow', `Invite validation: "${toastAfterEmpty}"`);

  // Fill and send invite
  await setField(page, 'idNumber', '4859217360');
  await setField(page, 'firstName', 'Test');
  await setField(page, 'lastName', 'Tenant');
  await setField(page, 'dob', '1990-01-15');
  await setField(page, 'email', 'e2e.tenant@test.com');
  await setField(page, 'phone', '07700900123');
  await setField(page, 'leaseStart', '2026-02-01', true);
  await setField(page, 'leaseEnd', '2027-01-31', true);
  await page.evaluate(() => {
    const unit = document.querySelector('[data-invite="unit"], [data-field="unit"]');
    if (unit && unit.options.length) unit.value = unit.options[0].value;
    STATE.nidProofName = 'NID Proof.jpg';
  });
  const invitesBefore = await page.evaluate(() => TENANT_INVITATIONS.length);
  await run(page, () => sendTenantInvitation());
  const afterInvite = await page.evaluate(() => ({
    screen: STATE.screen,
    invites: TENANT_INVITATIONS.length,
    last: TENANT_INVITATIONS[TENANT_INVITATIONS.length - 1],
  }));
  log(afterInvite.screen === 'tenant-invite-sent' && afterInvite.invites > invitesBefore ? 'PASS' : 'FAIL', 'Flow', `Invite sent: ${afterInvite.screen}, unit=${afterInvite.last?.unit}`);

  // Log maintenance with unit
  await run(page, () => go('log-maintenance'));
  await setField(page, 'title', 'E2E Leak');
  await setField(page, 'desc', 'Test leak in kitchen');
  await page.evaluate(() => {
    const unit = document.querySelector('[data-field="unit"]');
    if (unit && unit.options.length) unit.value = unit.options[0].value;
  });
  const maintBefore = await page.evaluate(() => MAINTENANCE_ITEMS.length);
  await run(page, () => saveLogMaintenance());
  const afterMaint = await page.evaluate(() => ({
    len: MAINTENANCE_ITEMS.length,
    last: MAINTENANCE_ITEMS[0],
    screen: STATE.screen,
  }));
  log(afterMaint.len > maintBefore && afterMaint.last?.unit && afterMaint.screen === 'maintenance' ? 'PASS' : 'FAIL', 'Flow', `Log maintenance: unit=${afterMaint.last?.unit}`);

  // Unit utilities
  await run(page, () => go('unit-utilities', { propertyId: 0, unit: 'Flat 2A' }));
  await setField(page, 'util_responsibility', 'tenant');
  await setField(page, 'meter_electricity', 'ELEC-123');
  await run(page, () => saveUnitUtilities());
  const utilMeta = await page.evaluate(() => getUnitUtilityMeta(0, 'Flat 2A'));
  log(utilMeta?.meters?.electricity === 'ELEC-123' ? 'PASS' : 'FAIL', 'Flow', `Unit utilities: ${JSON.stringify(utilMeta?.meters)}`);

  // Create tenancy
  await run(page, () => go('create-tenancy', { propertyId: 0 }));
  const tenancyBefore = await page.evaluate(() => AppStore.tenancies.length);
  await setField(page, 'unit', 'Flat 2B');
  await setField(page, 'rent', '950');
  await setField(page, 'start', '2026-02-01');
  await setField(page, 'end', '2027-01-31');
  await run(page, () => saveTenancy());
  const afterTenancy = await page.evaluate(() => ({
    len: AppStore.tenancies.length,
    screen: STATE.screen,
    last: AppStore.tenancies[AppStore.tenancies.length - 1],
  }));
  log(afterTenancy.len > tenancyBefore && afterTenancy.last?.unit === 'Flat 2B' ? 'PASS' : 'FAIL', 'Flow', `Create tenancy: unit=${afterTenancy.last?.unit}, screen=${afterTenancy.screen}`);

  // Property detail units tab
  await run(page, () => go('property-detail', { propertyId: 0, tab: 'units' }));
  const unitsTab = await page.evaluate(() => ({
    screen: STATE.screen,
    tab: STATE.tab,
    hasUnits: document.getElementById('app')?.textContent?.includes('Flat'),
  }));
  log(unitsTab.hasUnits && unitsTab.tab === 'units' ? 'PASS' : 'FAIL', 'Flow', `Units tab renders: tab=${unitsTab.tab}`);

  // Bottom nav
  for (const tab of ['dashboard', 'properties', 'maintenance', 'financial', 'profile']) {
    await page.evaluate((screen) => go(screen), tab);
    await new Promise((r) => setTimeout(r, 700));
    const s = await page.evaluate(() => STATE.screen);
    log(s === tab ? 'PASS' : 'FAIL', 'Nav', `Bottom nav ${tab} -> ${s}`);
  }

  // Logout
  await run(page, () => logout());
  const loggedOut = await page.evaluate(() => ({ auth: STATE.isAuthenticated, screen: STATE.screen }));
  log(!loggedOut.auth ? 'PASS' : 'FAIL', 'Auth', `Logout: screen=${loggedOut.screen}`);

  await browser.close();

  console.log('\n=== LANDLORD INTERACTIVE E2E ===');
  console.log(`PASS: ${passes.length} | FAIL: ${issues.length}\n`);
  issues.forEach((i) => console.log(`[${i.status}] ${i.area}: ${i.msg}`));
  if (!issues.length) console.log('All interactive checks passed.');
  process.exit(issues.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
