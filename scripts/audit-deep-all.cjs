const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const files = ['landlord_hq_screens.js', 'landlord_hq_contractor.js', 'landlord_hq_features.js', 'landlord_hq_product.js'];

const context = {
  console: { log: console.log, warn: console.warn, error: console.error },
  setTimeout: () => {}, clearTimeout: () => {}, setInterval: () => {}, clearInterval: () => {},
  queueMicrotask: (fn) => fn(),
  Date, Math, JSON, RegExp, Array, Object, String, Number, Boolean,
  parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent,
  Set, Map, URL, URLSearchParams,
};
const storage = {};
context.sessionStorage = { getItem: (k) => storage[k] || null, setItem: (k, v) => { storage[k] = String(v); }, removeItem: (k) => { delete storage[k]; }, clear: () => {} };
context.localStorage = { ...context.sessionStorage };
const mockApp = { id: 'app', innerHTML: '', querySelectorAll: () => [], querySelector: () => null, addEventListener: () => {}, appendChild: () => {}, removeChild: () => {}, classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }, style: {}, getBoundingClientRect: () => ({ top: 0, left: 0, width: 390, height: 844 }) };
context.document = { getElementById: (id) => mockApp, querySelector: () => mockApp, querySelectorAll: () => [], createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, innerHTML: '' }), body: { classList: { add: () => {}, remove: () => {} }, style: {} }, title: '', addEventListener: () => {} };
context.window = context;
context.addEventListener = () => {};
context.removeEventListener = () => {};
context.navigator = { userAgent: 'NodeTest', clipboard: { writeText: async () => {} } };
context.location = { href: 'http://localhost/', search: '', reload: () => {} };
context.lucide = { createIcons: () => {} };

vm.createContext(context);
files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), context, { filename: f }));

const results = vm.runInContext(`
(() => {
  const issues = [];

  // Check 1: CONTRACTOR_JOBS vs MAINTENANCE_ITEMS
  CONTRACTOR_JOBS.forEach(j => {
    if (j.maintId != null) {
      const m = MAINTENANCE_ITEMS.find(item => item.id === j.maintId);
      if (!m) {
        issues.push({ item: 'Job #' + j.id, issue: 'Missing maint item #' + j.maintId });
      } else {
        if (j.propertyId !== m.propertyId) {
          issues.push({ item: 'Job #' + j.id, issue: 'propertyId mismatch: job ' + j.propertyId + ' vs maint ' + m.propertyId });
        }
        if (j.tenant && m.tenantName && j.tenant !== '—' && m.tenantName !== '—' && j.tenant !== m.tenantName) {
          issues.push({ item: 'Job #' + j.id, issue: 'Tenant mismatch: "' + j.tenant + '" vs "' + m.tenantName + '"' });
        }
        if (j.visitDate && (!m.visitDate && !m.scheduledTime)) {
          issues.push({ item: 'Job #' + j.id, issue: 'Visit date "' + j.visitDate + '" not synced to maint #' + m.id });
        }
      }
    }
  });

  // Check 2: AppStore.contractorInvoices amounts vs CONTRACTOR_JOBS
  if (AppStore && AppStore.contractorInvoices) {
    AppStore.contractorInvoices.forEach(inv => {
      const cJob = CONTRACTOR_JOBS.find(j => j.maintId === inv.maintId);
      if (cJob) {
        const invNum = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''));
        const jobNum = cJob.invoice?.amount ? parseFloat(String(cJob.invoice.amount).replace(/[^0-9.]/g, '')) : cJob.quoteAmount;
        if (invNum !== jobNum) {
          issues.push({
            item: 'Invoice #' + inv.id + ' (maint #' + inv.maintId + ')',
            issue: 'Amount mismatch: AppStore ' + inv.amount + ' vs Job £' + jobNum
          });
        }
      }
    });
  }

  // Check 3: Chat routing
  CONTRACTOR_JOBS.forEach(j => {
    if (j.tenantChatId != null) {
      const c = CONVERSATIONS.find(x => x.id === j.tenantChatId);
      if (!c) issues.push({ item: 'Job #' + j.id, issue: 'tenantChatId ' + j.tenantChatId + ' not found' });
      else if (j.tenant && j.tenant !== '—' && !c.name.includes(j.tenant.split(' ')[0])) {
        issues.push({ item: 'Job #' + j.id, issue: 'tenantChatId ' + j.tenantChatId + ' is with ' + c.name + ', expected ' + j.tenant });
      }
    }
  });

  // Check 4: Access info available for contractor
  CONTRACTOR_JOBS.forEach(j => {
    const maint = j.maintId != null ? MAINTENANCE_ITEMS.find(m => m.id === j.maintId) : null;
    const propId = j.propertyId;
    const unit = j.unit || maint?.unit;
    // Check if flat keys exist
    const keys = (STATE.flatKeys && STATE.flatKeys[propId]) || [];
    // Can contractor see how to access?
  });

  return issues;
})()
`, context);

console.log("Found issues:", JSON.stringify(results, null, 2));
