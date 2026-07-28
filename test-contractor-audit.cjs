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
    demoLogin('contractor');
  });
  await new Promise((r) => setTimeout(r, 800));

  const home = await page.evaluate(() => ({
    screen: STATE.screen,
    role: STATE.userRole,
    hasNav: !!document.querySelector('.bottom-nav'),
    hasDrawer: !!document.querySelector('.drawer'),
    jobCards: document.querySelectorAll('.ctr-job-card').length,
  }));
  log(home.screen === 'contractor-dashboard' && home.role === 'contractor' ? 'PASS' : 'FAIL', 'Auth', `Home: ${home.screen} role=${home.role}`);
  log(home.hasNav ? 'PASS' : 'FAIL', 'Nav', 'Bottom nav visible');
  log(home.hasDrawer ? 'PASS' : 'FAIL', 'Nav', 'Drawer present');
  log(home.jobCards >= 1 ? 'PASS' : 'FAIL', 'Content', `${home.jobCards} job card(s) on dashboard`);

  await page.evaluate(() => go('contractor-jobs'));
  await new Promise((r) => setTimeout(r, 400));
  const jobs = await page.evaluate(() => ({
    screen: STATE.screen,
    count: document.querySelectorAll('.ctr-job-card').length,
    filters: document.querySelectorAll('[data-contractor-filter]').length,
  }));
  log(jobs.screen === 'contractor-jobs' ? 'PASS' : 'FAIL', 'Screen', `Jobs list: ${jobs.screen}`);
  log(jobs.count >= 1 ? 'PASS' : 'FAIL', 'Content', `${jobs.count} jobs listed`);
  log(jobs.filters >= 4 ? 'PASS' : 'FAIL', 'Filter', `${jobs.filters} filter chips`);

  await page.evaluate(() => go('contractor-job-detail', { jobId: 0 }));
  await new Promise((r) => setTimeout(r, 400));
  const detail = await page.evaluate(() => {
    const job = CONTRACTOR_JOBS[0];
    return {
      screen: STATE.screen,
      title: document.querySelector('.sub-header-title')?.textContent?.trim(),
      sub: document.querySelector('.sub-header-sub')?.textContent?.trim(),
      hasTabs: document.querySelectorAll('[data-jtab]').length,
      badTitle: document.querySelector('.sub-header-title')?.textContent?.trim() === 'Job Details',
    };
  });
  log(detail.screen === 'contractor-job-detail' ? 'PASS' : 'FAIL', 'Screen', `Job detail: ${detail.screen}`);
  log(!detail.badTitle && detail.title ? 'PASS' : 'FAIL', 'Header', `Title is issue name: ${detail.title}`);
  log(detail.sub ? 'PASS' : 'FAIL', 'Header', `Sub shows property: ${detail.sub}`);
  log(detail.hasTabs >= 3 ? 'PASS' : 'FAIL', 'Tabs', `${detail.hasTabs} job tabs`);

  await page.evaluate(() => go('contractor-schedule', { jobId: 0 }));
  await new Promise((r) => setTimeout(r, 400));
  const schedule = await page.evaluate(() => ({
    screen: STATE.screen,
    title: document.querySelector('.sub-header-title')?.textContent?.trim(),
    badTitle: document.querySelector('.sub-header-title')?.textContent?.trim() === 'Schedule Visit',
  }));
  log(schedule.screen === 'contractor-schedule' ? 'PASS' : 'FAIL', 'Screen', `Schedule: ${schedule.screen}`);
  log(!schedule.badTitle && schedule.title ? 'PASS' : 'FAIL', 'Header', `Property name header: ${schedule.title}`);

  await page.evaluate(() => go('contractor-profile'));
  await new Promise((r) => setTimeout(r, 400));
  const profile = await page.evaluate(() => ({ screen: STATE.screen, hasNav: !!document.querySelector('.bottom-nav') }));
  log(profile.screen === 'contractor-profile' ? 'PASS' : 'FAIL', 'Screen', `Profile: ${profile.screen}`);
  log(profile.hasNav ? 'PASS' : 'FAIL', 'Nav', 'Bottom nav on profile');

  await browser.close();

  console.log('\n=== CONTRACTOR AUDIT ===');
  console.log(`PASS: ${passes.length} | FAIL: ${issues.length}\n`);
  issues.forEach((i) => console.log(`[${i.s}] ${i.a}: ${i.m}`));
  if (!issues.length) console.log('All contractor audit checks passed.');
  process.exit(issues.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
