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

const deepAudit = vm.runInContext(`
(() => {
  const mismatches = [];

  // ==========================================
  // AUDIT 1: Maint Items vs Contractor Jobs
  // ==========================================
  CONTRACTOR_JOBS.forEach(j => {
    if (j.maintId != null) {
      const m = MAINTENANCE_ITEMS.find(item => item.id === j.maintId);
      if (!m) {
        mismatches.push({
          type: 'BROKEN_LINK',
          role1: 'Contractor Job #' + j.id + ' (' + j.issue + ')',
          role2: 'Landlord/Tenant Maintenance Item #' + j.maintId,
          detail: 'maintId ' + j.maintId + ' does not exist in MAINTENANCE_ITEMS'
        });
      } else {
        if (j.propertyId !== m.propertyId) {
          mismatches.push({
            type: 'PROPERTY_DESYNC',
            role1: 'Contractor Job #' + j.id + ' (propId: ' + j.propertyId + ', ' + j.property + ')',
            role2: 'Maintenance Item #' + m.id + ' (propId: ' + m.propertyId + ', ' + m.prop + ')',
            detail: 'Property ID mismatch between contractor job and maintenance item'
          });
        }
        if (j.tenant && m.tenantName && j.tenant !== '—' && m.tenantName !== '—' && j.tenant !== m.tenantName) {
          mismatches.push({
            type: 'TENANT_NAME_DESYNC',
            role1: 'Contractor Job #' + j.id + ' (Tenant: "' + j.tenant + '")',
            role2: 'Maintenance Item #' + m.id + ' (Tenant: "' + m.tenantName + '")',
            detail: 'Tenant names do not match'
          });
        }
      }
    }
  });

  // ==========================================
  // AUDIT 2: Chat ID Routing for 3 Roles
  // ==========================================
  CONTRACTOR_JOBS.forEach(j => {
    if (j.tenantChatId != null) {
      const c = CONVERSATIONS.find(x => x.id === j.tenantChatId);
      if (!c) {
        mismatches.push({
          type: 'CHAT_NOT_FOUND',
          role1: 'Contractor',
          role2: 'Tenant',
          detail: 'Job #' + j.id + ' has tenantChatId ' + j.tenantChatId + ' but conversation does not exist'
        });
      } else if (j.tenant && j.tenant !== '—' && !c.name.includes(j.tenant.split(' ')[0])) {
        mismatches.push({
          type: 'CHAT_PARTICIPANT_MISMATCH',
          role1: 'Contractor Job Tenant: ' + j.tenant,
          role2: 'Chat Contact: ' + c.name,
          detail: 'Job tenantChatId points to a conversation with a different person'
        });
      }
    }
    if (j.landlordChatId != null) {
      const c = CONVERSATIONS.find(x => x.id === j.landlordChatId);
      if (!c) {
        mismatches.push({
          type: 'CHAT_NOT_FOUND',
          role1: 'Contractor',
          role2: 'Landlord',
          detail: 'Job #' + j.id + ' has landlordChatId ' + j.landlordChatId + ' but conversation does not exist'
        });
      }
    }
  });

  // ==========================================
  // AUDIT 3: Invoicing & Approval Flow Sync
  // ==========================================
  // Test: Job 4 is waiting_approval
  const job4 = CONTRACTOR_JOBS.find(j => j.id === 4);
  if (job4) {
    const m4 = MAINTENANCE_ITEMS.find(m => m.id === job4.maintId);
    if (m4 && m4.status === 'done') {
      mismatches.push({
        type: 'STATUS_LIFECYCLE_CONFLICT',
        role1: 'Contractor Job #4 status is "waiting_approval"',
        role2: 'Landlord Maintenance Item #' + m4.id + ' status is already "done"',
        detail: 'Contractor is waiting for approval on an invoice, but landlord maintenance item is already marked done, so Landlord cannot approve!'
      });
    }
  }

  // ==========================================
  // AUDIT 4: Tenant View of Assigned Contractor & Scheduled Visit
  // ==========================================
  demoLogin('tenant');
  const activeTenant = getActiveTenant();
  const tenantIssues = tenantMaintenanceForAccount(activeTenant);
  tenantIssues.forEach(tIssue => {
    const cJob = CONTRACTOR_JOBS.find(j => j.maintId === tIssue.id);
    if (cJob) {
      if (cJob.visitDate && (!tIssue.visitDate && !tIssue.scheduledTime)) {
        mismatches.push({
          type: 'TENANT_VISIT_UNSYNCED',
          role1: 'Contractor Job #' + cJob.id + ' (visitDate: "' + cJob.visitDate + '")',
          role2: 'Tenant Maintenance Request #' + tIssue.id + ' (No visitDate on maint item)',
          detail: 'Tenant cannot see the visit date confirmed by the contractor'
        });
      }
    }
  });

  // ==========================================
  // AUDIT 5: Landlord Invoice Amount vs Contractor Invoice Amount
  // ==========================================
  if (AppStore && AppStore.contractorInvoices) {
    AppStore.contractorInvoices.forEach(inv => {
      const cJob = CONTRACTOR_JOBS.find(j => j.maintId === inv.maintId);
      if (cJob && cJob.quoteAmount != null) {
        const invNum = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''));
        if (invNum !== cJob.quoteAmount && !cJob.extraWork?.length) {
          mismatches.push({
            type: 'INVOICE_AMOUNT_DESYNC',
            role1: 'Contractor Job quoteAmount: £' + cJob.quoteAmount,
            role2: 'AppStore.contractorInvoices amount: ' + inv.amount,
            detail: 'Initial seed invoice amount differs from contractor job quote amount'
          });
        }
      }
    });
  }

  return mismatches;
})()
`, context);

console.log(JSON.stringify(deepAudit, null, 2));
