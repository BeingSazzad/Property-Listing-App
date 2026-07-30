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
    html: document.getElementById('app')?.innerHTML || '',
    hasNav: !!document.querySelector('.bottom-nav'),
  }));
  log(home.screen === 'tenant-dashboard' && home.role === 'tenant' ? 'PASS' : 'FAIL', 'Auth', `Home: ${home.screen} role=${home.role}`);
  log(home.hasNav ? 'PASS' : 'FAIL', 'Nav', 'Bottom nav visible');
  log(home.html.includes('Next rent due') ? 'PASS' : 'FAIL', 'Dashboard', 'Rent due first');
  log(home.html.includes('Active tenancy') ? 'PASS' : 'FAIL', 'Dashboard', 'Compact tenancy strip');
  log(home.html.includes('Needs attention') ? 'PASS' : 'FAIL', 'Dashboard', 'Attention section');
  log(home.html.includes('Quick actions') ? 'PASS' : 'FAIL', 'Dashboard', 'Quick actions');
  log(!home.html.includes('House rules') ? 'PASS' : 'FAIL', 'Dashboard', 'House rules moved off home');

  await page.evaluate(() => go('tenant-issues'));
  await new Promise((r) => setTimeout(r, 400));
  const issuesTab = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(issuesTab.screen === 'tenant-issues' ? 'PASS' : 'FAIL', 'Screen', `Issues tab: ${issuesTab.screen}`);
  log(issuesTab.html.includes('Report new issue') ? 'PASS' : 'FAIL', 'Maintenance', 'Issues list with report CTA');

  await page.evaluate(() => go('log-maintenance'));
  await new Promise((r) => setTimeout(r, 400));
  const report = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(report.screen === 'log-maintenance' ? 'PASS' : 'FAIL', 'Screen', `Report issue: ${report.screen}`);
  log(report.html.includes('Add photos') && report.html.includes('Add videos') ? 'PASS' : 'FAIL', 'Maintenance', 'Photo & video upload on report form');

  await page.evaluate(() => go('maintenance-detail', { maintId: 0 }));
  await new Promise((r) => setTimeout(r, 400));
  const detail = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
    hasAssign: !!document.querySelector('[data-action="go-assign-contractor"]'),
    hasTimeline: !!document.querySelector('.maint-progress'),
  }));
  log(detail.screen === 'maintenance-detail' ? 'PASS' : 'FAIL', 'Screen', `Maint detail: ${detail.screen}`);
  log(!detail.hasAssign ? 'PASS' : 'FAIL', 'Tenant UX', 'No assign contractor');
  log(detail.html.includes('Message contractor') ? 'PASS' : 'FAIL', 'Messaging', 'Message contractor on assigned issue');

  await page.evaluate(() => go('personal-info'));
  await new Promise((r) => setTimeout(r, 400));
  const account = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(account.screen === 'personal-info' ? 'PASS' : 'FAIL', 'Screen', `Account: ${account.screen}`);
  log(account.html.includes('profile-card') && account.html.includes('profile-card-name') ? 'PASS' : 'FAIL', 'Profile', 'Landlord-style profile card');
  log(account.html.includes('Flat 2A') ? 'PASS' : 'FAIL', 'Profile', 'Unit badge on profile card');
  log(account.html.includes('Active tenancy') ? 'PASS' : 'FAIL', 'Profile', 'Tenancy menu section');
  log(account.html.includes('Tenant referencing') ? 'PASS' : 'FAIL', 'Profile', 'Referencing menu');
  log(account.html.includes('Documents') ? 'PASS' : 'FAIL', 'Profile', 'Documents menu');
  log(account.html.includes('Check-out') ? 'PASS' : 'FAIL', 'Profile', 'Check-out menu');
  log(account.html.includes('Change password') ? 'PASS' : 'FAIL', 'Profile', 'Change password');
  log(account.html.includes('Your landlord') ? 'PASS' : 'FAIL', 'Profile', 'Landlord contact');

  await page.evaluate(() => go('tenant-documents'));
  await new Promise((r) => setTimeout(r, 400));
  const docs = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(docs.screen === 'tenant-documents' ? 'PASS' : 'FAIL', 'Screen', `Documents: ${docs.screen}`);
  log(docs.html.includes('Lease Agreement') ? 'PASS' : 'FAIL', 'Documents', 'Shared lease visible');

  await page.evaluate(() => go('tenant-referencing'));
  await new Promise((r) => setTimeout(r, 400));
  const ref = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(ref.screen === 'tenant-referencing' ? 'PASS' : 'FAIL', 'Screen', `Referencing: ${ref.screen}`);
  log(ref.html.includes('Right to Rent') && ref.html.includes('Guarantor') ? 'PASS' : 'FAIL', 'Referencing', 'All referencing sections');

  await page.evaluate(() => go('tenant-checkout'));
  await new Promise((r) => setTimeout(r, 400));
  const checkout = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
  }));
  log(checkout.screen === 'tenant-checkout' ? 'PASS' : 'FAIL', 'Screen', `Check-out: ${checkout.screen}`);
  log(checkout.html.includes('Deposit status') && /meter/i.test(checkout.html) ? 'PASS' : 'FAIL', 'Check-out', 'Deposit & meters');

  await page.evaluate(() => go('messages'));
  await new Promise((r) => setTimeout(r, 400));
  const msgs = await page.evaluate(() => ({
    screen: STATE.screen,
    count: document.querySelectorAll('[data-go="chat"]').length,
    names: [...document.querySelectorAll('.inbox-name')].map((n) => n.textContent.trim()),
  }));
  log(msgs.screen === 'messages' ? 'PASS' : 'FAIL', 'Screen', `Messages: ${msgs.screen}`);
  log(msgs.names.includes('John Smith') ? 'PASS' : 'FAIL', 'Messages', 'Landlord thread');
  log(msgs.names.includes('Plumber Pro') ? 'PASS' : 'FAIL', 'Messages', 'Contractor thread for assigned job');

  const routeChecks = [
    ['maintenance', 'tenant-issues'],
    ['financial', 'transaction-history'],
    ['dashboard', 'tenant-dashboard'],
    ['properties', 'tenant-active-tenancy'],
    ['profile', 'personal-info'],
  ];
  for (const [from, expected] of routeChecks) {
    await page.evaluate((s) => go(s), from);
    await new Promise((r) => setTimeout(r, 300));
    const r = await page.evaluate((exp) => ({ screen: STATE.screen, ok: STATE.screen === exp }), expected);
    log(r.ok ? 'PASS' : 'FAIL', 'Routing', `${from} → ${r.screen} (expected ${expected})`);
  }

  await page.evaluate(() => go('notifications-list'));
  await new Promise((r) => setTimeout(r, 400));
  const notifs = await page.evaluate(() => ({
    screen: STATE.screen,
    html: document.getElementById('app')?.innerHTML || '',
    hasLandlordNotif: document.body.innerHTML.includes('Rent received') && document.body.innerHTML.includes('Sarah Johnson'),
    hasTenantNotif: document.body.innerHTML.includes('Rent due') || document.body.innerHTML.includes('Issue update'),
  }));
  log(notifs.screen === 'notifications-list' ? 'PASS' : 'FAIL', 'Screen', `Notifications: ${notifs.screen}`);
  log(notifs.hasTenantNotif ? 'PASS' : 'FAIL', 'Routing', 'Tenant notifications shown');
  log(!notifs.hasLandlordNotif ? 'PASS' : 'FAIL', 'Routing', 'No landlord rent-received notification for tenant');

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
