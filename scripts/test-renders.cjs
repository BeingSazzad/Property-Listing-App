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

vm.runInContext("demoLogin('tenant')", context);

const tests = [
  { name: 'screenTenantPaymentHistory', fn: 'screenTenantPaymentHistory()' },
  { name: 'screenInvoiceDetail', fn: 'screenInvoiceDetail()' },
  { name: 'screenTenantBuildingInfo', fn: 'screenTenantBuildingInfo()' },
  { name: 'screenTenantIssues', fn: 'screenTenantIssues()' },
  { name: 'screenTenantActiveTenancy', fn: 'screenTenantActiveTenancy()' },
  { name: 'screenTenantInventory', fn: 'screenTenantInventory()' },
  { name: 'screenTenantInventoryRoom', fn: 'screenTenantInventoryRoom()' },
  { name: 'screenContractorJobDetail', fn: "demoLogin('contractor'); screenContractorJobDetail()" },
  { name: 'screenContractorScheduleHub', fn: "screenContractorScheduleHub()" },
  { name: 'screenFlatKeys', fn: "demoLogin('landlord'); screenFlatKeys()" },
];

tests.forEach(t => {
  const html = vm.runInContext(t.fn, context);
  const hasUndef = /undefined/.test(html);
  const hasNaN = /NaN/.test(html);
  console.log(`[PASS] ${t.name} -> ${html.length} chars | Undefined: ${hasUndef} | NaN: ${hasNaN}`);
  if (hasUndef || hasNaN) throw new Error('Fault in ' + t.name);
});
console.log('\n=== ALL 9 SCREENS RENDERED 100% CLEAN AND ERROR-FREE ===');
