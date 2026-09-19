const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== STARTING COMPREHENSIVE END-TO-END SCREEN AUDIT ===\n');

// Set up virtual browser environment
const context = {
    console: {
        log: () => {},
        warn: (...args) => console.warn('[WARN]', ...args),
        error: (...args) => console.error('[ERROR]', ...args),
    },
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    setInterval: () => {},
    clearInterval: () => {},
    queueMicrotask: (fn) => fn(),
    Date: Date,
    Math: Math,
    JSON: JSON,
    RegExp: RegExp,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    Set: Set,
    Map: Map,
    URL: URL,
    URLSearchParams: URLSearchParams,
};

// Storage mocks
const storage = {};
context.sessionStorage = {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { for (const k in storage) delete storage[k]; },
};
context.localStorage = { ...context.sessionStorage };

// Document / DOM mock
const elements = {};
const mockApp = {
    id: 'app',
    innerHTML: '',
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    appendChild: () => {},
    removeChild: () => {},
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    style: {},
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 390, height: 844 }),
};

context.document = {
    getElementById: (id) => (id === 'app' ? mockApp : null),
    querySelector: () => mockApp,
    querySelectorAll: () => [],
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        style: {},
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {},
        innerHTML: '',
    }),
    body: { classList: { add: () => {}, remove: () => {} }, style: {} },
    title: '',
    addEventListener: () => {},
};

context.window = context;
context.addEventListener = () => {};
context.removeEventListener = () => {};
context.navigator = { userAgent: 'NodeTest', clipboard: { writeText: async () => {} } };
context.location = { href: 'http://localhost/', search: '', reload: () => {} };
context.lucide = { createIcons: () => {} };

vm.createContext(context);

// Load script files in proper dependency order (same as HTML)
const files = [
    'landlord_hq_screens.js',
    'landlord_hq_contractor.js',
    'landlord_hq_features.js',
    'landlord_hq_product.js'
];

for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
        console.error(`File missing: ${file}`);
        process.exit(1);
    }
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        vm.runInContext(code, context, { filename: file });
        console.log(`✓ Loaded: ${file}`);
    } catch (e) {
        console.error(`✗ Error loading ${file}:`, e);
        process.exit(1);
    }
}

console.log('\n--- Initializing App State & Store ---');
vm.runInContext(`
    if (typeof AppStore !== 'undefined' && AppStore.seed) {
        AppStore.seed();
    }
`, context);

// Test all screens across all 3 roles: Landlord, Tenant, Contractor
const roles = ['landlord', 'tenant', 'contractor'];
let totalScreensTested = 0;
let totalPassed = 0;
const failures = [];

for (const role of roles) {
    console.log(`\n========================================`);
    console.log(`AUDITING SCREENS FOR ROLE: [${role.toUpperCase()}]`);
    console.log(`========================================`);

    vm.runInContext(`
        STATE.userRole = '${role}';
        STATE.propertyId = 0;
        STATE.tenantId = 0;
        STATE.chatId = 0;
        STATE.selectedUnit = 'Flat 2A';
        STATE.invoiceId = 0;
        STATE.maintId = 0;
        STATE.inspectionId = 0;
        STATE.docId = 0;
    `, context);

    const screenKeys = vm.runInContext(`Object.keys(SCREEN_MAP)`, context);
    console.log(`Total registered screens in SCREEN_MAP: ${screenKeys.length}`);

    for (const screen of screenKeys) {
        totalScreensTested++;
        const testScript = `
            (() => {
                try {
                    STATE.screen = '${screen}';
                    const fn = SCREEN_MAP['${screen}'];
                    if (typeof fn !== 'function') {
                        return { ok: false, error: 'Screen handler is not a function: ' + typeof fn };
                    }
                    const html = fn() || '';
                    if (!html || typeof html !== 'string') {
                        return { ok: false, error: 'Screen returned empty/non-string content' };
                    }
                    if (html.includes('Something went wrong')) {
                        return { ok: false, error: 'Screen rendered error state: Something went wrong' };
                    }
                    if (html.trim().length < 20) {
                        return { ok: false, error: 'Screen rendered suspiciously short content: ' + html.trim() };
                    }
                    return { ok: true, length: html.length };
                } catch (err) {
                    return { ok: false, error: err.stack || err.message };
                }
            })()
        `;

        const result = vm.runInContext(testScript, context);
        if (result.ok) {
            totalPassed++;
        } else {
            console.error(`✗ [${role}] Screen "${screen}" FAILED: ${result.error}`);
            failures.push({ role, screen, error: result.error });
        }
    }

    // Now test specific HMO property 2 screens
    console.log(`Testing HMO Property 2 (88 King Street) screens for role [${role}]...`);
    vm.runInContext(`
        STATE.propertyId = 2;
        STATE.selectedUnit = 'Room 1';
    `, context);

    const hmoScreens = ['property-detail', 'flat-detail', 'unit-utilities', 'flat-keys', 'flat-members', 'edit-flat', 'add-flat', 'property-flat-documents'];
    for (const s of hmoScreens) {
        totalScreensTested++;
        const testHmo = `
            (() => {
                try {
                    STATE.screen = '${s}';
                    const fn = SCREEN_MAP['${s}'];
                    const html = fn() || '';
                    if (!html || html.includes('Something went wrong') || html.trim().length < 20) {
                        return { ok: false, error: 'HMO Screen returned empty or error' };
                    }
                    return { ok: true, length: html.length };
                } catch (e) {
                    return { ok: false, error: e.stack || e.message };
                }
            })()
        `;
        const res = vm.runInContext(testHmo, context);
        if (res.ok) {
            totalPassed++;
        } else {
            console.error(`✗ [${role}] HMO Screen "${s}" FAILED: ${res.error}`);
            failures.push({ role, screen: `${s} (HMO)`, error: res.error });
        }
    }
}

console.log(`\n========================================`);
console.log(`AUDIT RESULTS:`);
console.log(`Total screen executions tested: ${totalScreensTested}`);
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${failures.length}`);
console.log(`========================================\n`);

if (failures.length > 0) {
    console.error('FAILURES SUMMARY:');
    failures.forEach(f => console.error(`- [${f.role}] ${f.screen}: ${f.error}`));
    process.exit(1);
} else {
    console.log('🎉 ALL SCREENS PASSED END-TO-END AUDIT WITH ZERO ERRORS AND NO WHITE SCREENS!');
    process.exit(0);
}
