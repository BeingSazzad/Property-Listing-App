const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const files = [
  'landlord_hq_mobile_screens.html',
  'landlord_hq_screens.js',
  'landlord_hq_contractor.js',
  'landlord_hq_features.js',
  'landlord_hq_product.js',
];

const fileContents = {};
files.forEach(f => {
  const fullPath = path.join(root, f);
  if (fs.existsSync(fullPath)) {
    fileContents[f] = fs.readFileSync(fullPath, 'utf8');
  }
});

console.log('=== COMPREHENSIVE ROUTING & ACTION AUDIT ===\n');

// 1. Setup VM to extract full runtime SCREEN_MAP
const context = {
  console: { log: () => {}, warn: () => {}, error: () => {} },
  setTimeout: () => {},
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  queueMicrotask: (fn) => fn(),
  Date, Math, JSON, RegExp, Array, Object, String, Number, Boolean,
  parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent,
  Set, Map, URL, URLSearchParams,
};
const storage = {};
context.sessionStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
};
context.localStorage = { ...context.sessionStorage };
const mockApp = {
  id: 'app', innerHTML: '',
  querySelectorAll: () => [], querySelector: () => null,
  addEventListener: () => {}, appendChild: () => {}, removeChild: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  style: {}, getBoundingClientRect: () => ({ top: 0, left: 0, width: 390, height: 844 }),
};
context.document = {
  getElementById: (id) => (id === 'app' ? mockApp : null),
  querySelector: () => mockApp,
  querySelectorAll: () => [],
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, innerHTML: '' }),
  body: { classList: { add: () => {}, remove: () => {} }, style: {} },
  title: '', addEventListener: () => {},
};
context.window = context;
context.addEventListener = () => {};
context.removeEventListener = () => {};
context.navigator = { userAgent: 'NodeTest', clipboard: { writeText: async () => {} } };
context.location = { href: 'http://localhost/', search: '', reload: () => {} };
context.lucide = { createIcons: () => {} };

vm.createContext(context);

// Load script files in order
['landlord_hq_screens.js', 'landlord_hq_contractor.js', 'landlord_hq_features.js', 'landlord_hq_product.js'].forEach(file => {
  const code = fileContents[file];
  vm.runInContext(code, context, { filename: file });
});

const runtimeScreenKeys = new Set(vm.runInContext('Object.keys(SCREEN_MAP)', context));
console.log(`[Runtime SCREEN_MAP]: Found ${runtimeScreenKeys.size} registered screens.`);

// 2. Extract all data-go occurrences and go(...) occurrences
const dataGoTargets = new Map(); // target -> [file:line]
const goCallTargets = new Map(); // target -> [file:line]

files.forEach(fileName => {
  const content = fileContents[fileName];
  if (!content) return;
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    // data-go="screen-name"
    const dataGoRegex = /data-go=["']([a-zA-Z0-9_\-]+)["']/g;
    let dgMatch;
    while ((dgMatch = dataGoRegex.exec(line)) !== null) {
      const target = dgMatch[1];
      if (!dataGoTargets.has(target)) dataGoTargets.set(target, []);
      dataGoTargets.get(target).push(`${fileName}:${lineNum}`);
    }
    // go('screen-name') or go("screen-name")
    const goCallRegex = /(?:^|[^a-zA-Z0-9_])(?:window\.)?go\(["']([a-zA-Z0-9_\-]+)["']/g;
    let gcMatch;
    while ((gcMatch = goCallRegex.exec(line)) !== null) {
      const target = gcMatch[1];
      if (!goCallTargets.has(target)) goCallTargets.set(target, []);
      goCallTargets.get(target).push(`${fileName}:${lineNum}`);
    }
  });
});

console.log(`[data-go Targets]: ${dataGoTargets.size} distinct data-go targets found.`);
console.log(`[go() Calls]: ${goCallTargets.size} distinct go() target screens found.`);

// 3. Find missing / unregistered screen targets
const specialAllowed = new Set(['faq-detail', 'external', 'back', 'reload', 'close', 'logout']);
const missingScreens = [];

const allTargets = new Set([...dataGoTargets.keys(), ...goCallTargets.keys()]);
allTargets.forEach(target => {
  if (!runtimeScreenKeys.has(target) && !specialAllowed.has(target)) {
    const fromDataGo = dataGoTargets.get(target) || [];
    const fromGo = goCallTargets.get(target) || [];
    missingScreens.push({
      screen: target,
      locations: [...fromDataGo, ...fromGo]
    });
  }
});

let issuesCount = 0;

if (missingScreens.length > 0) {
  console.error(`\n❌ FOUND ${missingScreens.length} UNREGISTERED / DEAD ROUTE TARGETS:`);
  missingScreens.forEach(m => {
    issuesCount++;
    console.error(`  - Target: "${m.screen}" (found in ${m.locations.length} locations):`);
    m.locations.slice(0, 5).forEach(loc => console.error(`      ${loc}`));
  });
} else {
  console.log('✅ ALL data-go and go() targets map 100% to registered screens in SCREEN_MAP!');
}

// 4. Action Handler Check
// Extract all data-action attributes
const dataActions = new Map();
files.forEach(fileName => {
  const content = fileContents[fileName];
  if (!content) return;
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const actionRegex = /data-action=["']([a-zA-Z0-9_\-]+)["']/g;
    let aMatch;
    while ((aMatch = actionRegex.exec(line)) !== null) {
      const act = aMatch[1];
      if (!dataActions.has(act)) dataActions.set(act, []);
      dataActions.get(act).push(`${fileName}:${lineNum}`);
    }
  });
});

console.log(`\n[data-action Attributes]: Found ${dataActions.size} distinct data-action names.`);

// Extract all handled actions from handleDelegatedAction and addEventListeners
const allCode = Object.values(fileContents).join('\n');
const handledActions = new Set();

const caseRegex = /case\s+['"]([a-zA-Z0-9_\-]+)['"]\s*:/g;
let cMatch;
while ((cMatch = caseRegex.exec(allCode)) !== null) {
  handledActions.add(cMatch[1]);
}
const ifActionRegex = /action\s*===?\s*['"]([a-zA-Z0-9_\-]+)['"]/g;
let ifMatch;
while ((ifMatch = ifActionRegex.exec(allCode)) !== null) {
  handledActions.add(ifMatch[1]);
}
const actionIncludesRegex = /actions?\s*\.\s*(?:includes|has)\s*\(\s*['"]([a-zA-Z0-9_\-]+)['"]\s*\)/g;
let aiMatch;
while ((aiMatch = actionIncludesRegex.exec(allCode)) !== null) {
  handledActions.add(aiMatch[1]);
}

const unhandledActions = [];
dataActions.forEach((locs, act) => {
  // Check if it's dynamic prefix or standard pattern
  const isDynamic = act.startsWith('demo-') || act.startsWith('tab-') || act.startsWith('filter-') || act.startsWith('switch-') || act.startsWith('role-');
  if (!handledActions.has(act) && !isDynamic) {
    unhandledActions.push({ action: act, locations: locs });
  }
});

if (unhandledActions.length > 0) {
  console.warn(`\n⚠️ POTENTIALLY UNHANDLED DATA-ACTIONS (${unhandledActions.length}):`);
  unhandledActions.forEach(u => {
    console.warn(`  - Action "${u.action}" in ${u.locations[0]}`);
  });
} else {
  console.log('✅ ALL data-action attributes are handled by event delegation or listeners.');
}

console.log(`\n========================================`);
console.log(`FINAL ROUTE AUDIT RESULT: ${issuesCount === 0 ? 'ALL CLEAR (0 ISSUES)' : `${issuesCount} ISSUES FOUND`}`);
console.log(`========================================\n`);

process.exit(issuesCount > 0 ? 1 : 0);
