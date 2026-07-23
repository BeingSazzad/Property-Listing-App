/* Landlord HQ — Interactive Prototype */
const imgUrl = (id, w = 600) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85&fm=jpg`;
const avatarUrl = (seed) => `https://i.pravatar.cc/152?u=landlordhq-${seed}`;

const IMG = {
    fallback: imgUrl('1600585154526-990dced4db0d', 400),
    hero: imgUrl('1600585154526-990dced4db0d', 900),
    props: [
        imgUrl('1600585154526-990dced4db0d', 800),
        imgUrl('1600596542815-ffad4c1539a9', 800),
        imgUrl('1564013799919-ab600027ffc6', 800),
        imgUrl('1512917774080-9991f1c4c750', 800),
    ],
    avatar: {
        john: avatarUrl('john'),
        sarah: avatarUrl('sarah'),
        david: avatarUrl('david'),
        michael: avatarUrl('michael'),
        plumber: avatarUrl('plumber'),
        electric: avatarUrl('electric'),
        heating: avatarUrl('heating'),
    },
    maint: [
        imgUrl('1584622650111-993a426fbf0a', 400),
        imgUrl('1621905251189-08b45d6a269e', 400),
        imgUrl('1556912172-45b7abe8b7e1', 400),
    ],
    interior: [
        imgUrl('1618221195710-dd6b41faaea6', 400),
        imgUrl('1616486338812-3dadae4b4ace', 400),
        imgUrl('1616594039964-ae9021a400a0', 400),
    ],
};

const PROPERTIES = [
    { id: 0, name: '12 Park Lane', address: 'London, SW1A 1AA', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'Sarah Johnson', rent: '£2,450', beds: 3, baths: 2, sqft: '1,200', compliance: true },
    { id: 1, name: '45 Queens Road', address: 'London, SW2 3TR', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'David Wilson', rent: '£1,850', beds: 2, baths: 1, sqft: '890', compliance: true },
    { id: 2, name: '88 King Street', address: 'London, EC2V 8BB', status: 'Vacant', statusColor: ['#FEF3C7','#D97706'], tenant: null, rent: '£2,100', beds: 3, baths: 2, sqft: '1,050', compliance: false },
    { id: 3, name: '15 Victoria Ave', address: 'London, N1 5EH', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'Michael Lee', rent: '£1,950', beds: 2, baths: 1, sqft: '920', compliance: true },
];

const STATE = {
    screen: 'dashboard', tab: 'overview', tenantTab: 'profile',
    propertyId: 0, tenantId: 0, maintId: 0, invoiceId: 0, roomId: 0,
    propertiesView: 'list', propertiesFilter: 'all', showPropFilters: false,
    propertiesAdvanced: { rent: 'all', beds: 'any' },
    search: { properties: '', tenants: '', messages: '' },
    maintFilter: 'open', logPriority: 'Medium',
    toggles: {
        'rent-reminders': true, 'maintenance-updates': true, 'compliance-alerts': true,
        'new-messages': true, 'marketing-emails': false, 'weekly-summary': true, 'biometric': true,
    },
    drawer: false, fab: false, faqId: 0, complianceId: 0, prefKey: '', paymentId: 0,
};

const MAINTENANCE_ITEMS = [
    { issue:'Kitchen sink leaking', prop:'12 Park Lane', time:'2h ago', priority:'High', contractor:'Plumber Pro', status:'open', mid:0 },
    { issue:'Window latch broken', prop:'88 King Street', time:'1d ago', priority:'Medium', contractor:'—', status:'open', mid:2 },
    { issue:'Damp patch in bedroom', prop:'12 Park Lane', time:'2d ago', priority:'Low', contractor:'—', status:'open', mid:0 },
    { issue:'Boiler not working', prop:'45 Queens Rd', time:'3d ago', priority:'High', contractor:'Heating Co.', status:'progress', mid:1 },
    { issue:'Radiator not heating', prop:'15 Victoria Ave', time:'4d ago', priority:'Medium', contractor:'Heating Co.', status:'progress', mid:1 },
    { issue:'Light flickering', prop:'15 Victoria Ave', time:'5d ago', priority:'Low', contractor:'Electric Fix', status:'done', mid:2 },
    { issue:'Tap replaced', prop:'45 Queens Rd', time:'1w ago', priority:'Low', contractor:'Plumber Pro', status:'done', mid:0 },
];
const FAQ_ITEMS = [
    { id:0, cat:'Getting Started', q:'How do I add a new property?', a:'Tap the + button on the bottom navigation bar and select "Add Property". Fill in the address, rent amount, bedrooms, and upload photos. Your property will appear in your portfolio immediately.' },
    { id:1, cat:'Getting Started', q:'How do I invite a tenant?', a:'Open the property details, go to the Tenant section, and tap "Invite Tenant". Enter their email address and we\'ll send a secure invitation link. Once accepted, their profile links to the property automatically.' },
    { id:2, cat:'Rent & Payments', q:'How does rent collection work?', a:'Landlord HQ tracks rent due dates and sends automatic reminders to tenants. You can view payment status on the Financial screen. Overdue rent is highlighted in red on your dashboard.' },
    { id:3, cat:'Rent & Payments', q:'Can I export financial reports?', a:'Yes. Go to Financial → tap any invoice → Download PDF. Full monthly reports are available on the Pro plan under Subscription settings.' },
    { id:4, cat:'Maintenance', q:'How do I log a maintenance issue?', a:'Use the + FAB menu and select "Log Maintenance", or open a property → Maintenance section → "Log New Issue". Add a title, priority, description, and photos.' },
    { id:5, cat:'Maintenance', q:'How are contractors assigned?', a:'You can assign contractors manually from the maintenance detail screen, or enable auto-assignment in Preferences. Contractors receive notifications via the app.' },
    { id:6, cat:'Compliance', q:'What compliance documents should I track?', a:'We recommend tracking Gas Safety Certificate, Electrical Installation Condition Report (EICR), EPC rating, smoke/CO alarms, landlord insurance, and Right to Rent checks. Reminders appear on your dashboard.' },
    { id:7, cat:'Account', q:'How do I change my password?', a:'Go to Profile → Change Password. Enter your current password, then your new password twice.' },
    { id:8, cat:'Account', q:'How do I cancel my subscription?', a:'Go to Profile → Subscription → Manage Plan. You can downgrade or cancel at any time. Your data remains accessible until the end of the billing period.' },
];

const legalContent = (sections) => sections.map(([title, paras]) => `
    <div class="legal-section">
        <h3 class="legal-heading">${title}</h3>
        ${paras.map(p => `<p class="legal-p">${p}</p>`).join('')}
    </div>`).join('');

const contentPage = (title, updated, body) => `
    ${topBar(title, { back: true })}
    <div class="gutter-x pb-8 screen-enter">
        <p class="legal-updated">Last updated: ${updated}</p>
        <div class="card legal-card">${body}</div>
    </div>`;

const faqList = (items, cat) => {
    const list = cat ? items.filter(f => f.cat === cat) : items;
    return `<div class="card overflow-hidden">
        ${list.map((f,i) => `
        <button data-go="faq-detail" data-fid="${f.id}" class="faq-row w-full text-left ${i < list.length - 1 ? 'border-b border-[#F1F5F9]' : ''}">
            <p class="text-[14px] font-semibold text-[#0F172A] leading-snug">${f.q}</p>
            <p class="text-[11px] text-[#64748B] mt-1">${f.cat}</p>
            <i data-lucide="chevron-right" class="faq-chevron w-5 h-5 text-[#CBD5E1]"></i>
        </button>`).join('')}
    </div>`;
};

const TENANT_TABS = ['profile','documents','lease','maintenance','messages'];

const TENANTS = [
    { id:0, firstName:'Sarah', lastName:'Johnson', email:'sarah.j@email.com', phone:'+44 7700 900456', prop:'12 Park Lane', rent:'2450', moveIn:'2024-01-15', leaseEnd:'2026-01-14', emergency:'James Johnson', emergencyPhone:'+44 7700 900789' },
    { id:1, firstName:'David', lastName:'Wilson', email:'david.w@email.com', phone:'+44 7700 900457', prop:'45 Queens Rd', rent:'1850', moveIn:'2023-06-01', leaseEnd:'2025-05-31', emergency:'Lisa Wilson', emergencyPhone:'+44 7700 900790' },
    { id:2, firstName:'Michael', lastName:'Lee', email:'michael.lee@email.com', phone:'+44 7700 900458', prop:'15 Victoria Ave', rent:'1950', moveIn:'2024-03-10', leaseEnd:'2026-03-09', emergency:'Anna Lee', emergencyPhone:'+44 7700 900791' },
];

const COMPLIANCE_ITEMS = [
    ['flame','Gas Certificate','Mar 15, 2026'],['zap','Electrical Installation','Apr 2, 2025'],
    ['bell-ring','Smoke Alarm','Annual check'],['thermometer','Heat Alarm','Annual check'],
    ['wind','CO Alarm','Annual check'],['shield','Landlord Insurance','Jun 2025'],
    ['landmark','Mortgage','Active'],['leaf','EPC Certificate','Rating B — Valid'],
];

const PREF_OPTIONS = {
    language: { title:'Language', options:['English (UK)','English (US)','Welsh'], current:'English (UK)' },
    currency: { title:'Currency', options:['GBP (£)','EUR (€)','USD ($)'], current:'GBP (£)' },
    dateFormat: { title:'Date Format', options:['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'], current:'DD/MM/YYYY' },
    timezone: { title:'Timezone', options:['GMT (London)','GMT (Dublin)','CET (Paris)'], current:'GMT (London)' },
};
const NO_NAV = ['chat','tenant-detail','property-detail','maintenance-detail','invoice-detail','inventory-room','document-preview','personal-info','notifications-settings','security','password','preferences','payment-methods','subscription','help-support','faq','faq-detail','privacy','terms','about','add-property','log-maintenance','notifications-list','transaction-history','edit-property','invite-tenant','edit-tenant','reschedule-inspection','renew-compliance','edit-inventory-room','add-payment-method','edit-payment-method','edit-preference'];

function go(screen, opts = {}) {
    Object.assign(STATE, opts, { screen, drawer: false, fab: false, showPropFilters: false });
    if (screen === 'property-detail') STATE.tab = opts.tab ?? 'overview';
    if (screen === 'tenant-detail') { STATE.tenantId = opts.tenantId ?? STATE.tenantId; STATE.tenantTab = opts.tenantTab || 'profile'; }
    if (screen === 'faq-detail') STATE.faqId = opts.faqId ?? 0;
    if (opts.complianceId !== undefined) STATE.complianceId = opts.complianceId;
    if (opts.prefKey) STATE.prefKey = opts.prefKey;
    if (opts.paymentId !== undefined) STATE.paymentId = opts.paymentId;
    render();
}

function back() {
    if (STATE.screen === 'property-detail' && STATE.tab !== 'overview') {
        setTab('overview');
        return;
    }
    const map = {
        'property-detail':'properties','tenant-detail':'tenants','chat':'messages',
        'maintenance-detail':'maintenance','invoice-detail':'financial',
        'document-preview':'property-detail','inventory-room':'property-detail',
        'personal-info':'profile','notifications-settings':'profile',
        'security':'profile','password':'profile','preferences':'profile',
        'payment-methods':'profile','subscription':'profile','help-support':'profile','transaction-history':'profile',
        'faq':'profile','faq-detail':'faq','privacy':'profile','terms':'profile','about':'profile',
        'edit-property':'property-detail','invite-tenant':'property-detail',
        'edit-tenant':'tenant-detail','reschedule-inspection':'property-detail',
        'renew-compliance':'property-detail','edit-inventory-room':'inventory-room',
        'add-payment-method':'payment-methods','edit-payment-method':'payment-methods',
        'edit-preference':'preferences',
        'add-property':'dashboard','log-maintenance':'maintenance','notifications-list':'dashboard',
        'financial':'dashboard',
    };
    const tabMap = {
        'document-preview':'documents', 'inventory-room':'inventory',
        'edit-property':'overview', 'invite-tenant':'tenant',
        'reschedule-inspection':'inspection', 'renew-compliance':'compliance',
    };
    const target = map[STATE.screen] || 'dashboard';
    const opts = {};
    if (tabMap[STATE.screen]) { opts.tab = tabMap[STATE.screen]; opts.propertyId = STATE.propertyId; }
    if (['edit-tenant'].includes(STATE.screen)) opts.tenantId = STATE.tenantId;
    if (['edit-inventory-room'].includes(STATE.screen)) opts.roomId = STATE.roomId;
    if (STATE.screen === 'edit-preference') opts.prefKey = STATE.prefKey;
    if (['edit-payment-method'].includes(STATE.screen)) opts.paymentId = STATE.paymentId;
    go(target, opts);
}

function setTab(tab) { STATE.tab = tab; render(); }
function setTenantTab(tab) { STATE.tenantTab = tab; render(); }
function setPropertiesView(v) { STATE.propertiesView = v; render(); }
function setPropFilter(f) { STATE.propertiesFilter = f; render(); }
function setPropAdvanced(key, val) { STATE.propertiesAdvanced[key] = val; render(); }
function togglePropFilters() { STATE.showPropFilters = !STATE.showPropFilters; if (STATE.showPropFilters) STATE.drawer = false; render(); }
function closePropFilters() { STATE.showPropFilters = false; render(); }
function resetPropFilters() {
    STATE.propertiesFilter = 'all';
    STATE.propertiesAdvanced = { rent: 'all', beds: 'any' };
    STATE.search.properties = '';
    render();
}

function filterProperties() {
    const q = STATE.search.properties.toLowerCase();
    const adv = STATE.propertiesAdvanced;
    return PROPERTIES.filter(p => {
        const matchFilter = STATE.propertiesFilter === 'all' ||
            (STATE.propertiesFilter === 'occupied' && p.status === 'Occupied') ||
            (STATE.propertiesFilter === 'vacant' && p.status === 'Vacant');
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) ||
            (p.tenant && p.tenant.toLowerCase().includes(q));
        const rentNum = parseInt(p.rent.replace(/[^\d]/g, ''), 10);
        const matchRent = adv.rent === 'all' || (adv.rent === 'under2k' && rentNum < 2000) || (adv.rent === 'over2k' && rentNum >= 2000);
        const matchBeds = adv.beds === 'any' || p.beds >= parseInt(adv.beds, 10);
        return matchFilter && matchSearch && matchRent && matchBeds;
    });
}
function setMaintFilter(f) { STATE.maintFilter = f; render(); }
function setLogPriority(p) { STATE.logPriority = p; render(); }
function setSearch(key, val) { STATE.search[key] = val; render(); }
function toggleSwitch(key) { STATE.toggles[key] = !STATE.toggles[key]; render(); }

function toggleDrawer() { STATE.drawer = !STATE.drawer; if (STATE.drawer) STATE.showPropFilters = false; render(); }
function toggleFab() { STATE.fab = !STATE.fab; render(); }

function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.getElementById('app').appendChild(t); }
    t.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>${msg}`;
    t.classList.add('show');
    lucide.createIcons();
    setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─── Shared Components ─── */
const statusBar = () => `
<div class="status-bar">
    <span class="status-time">9:41</span>
    <div class="status-notch"></div>
    <div class="status-icons">
        <i data-lucide="signal" class="w-4 h-4"></i>
        <i data-lucide="wifi" class="w-4 h-4"></i>
        <i data-lucide="battery-full" class="w-4 h-4"></i>
    </div>
</div>`;

const homeIndicator = () => `<div class="home-indicator"></div>`;

const topBar = (title, opts = {}) => {
    if (opts.back) {
        return `
<div class="gutter-x pt-2 pb-3 bg-[#F8FAFC] sticky top-0 z-10">
    <div class="sub-header-row">
        <div class="sub-header-left">
            <button data-action="back" class="back-btn">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <div class="min-w-0">
                <h1 class="sub-header-title">${title}</h1>
                ${opts.sub ? `<p class="text-[12px] text-[#64748B] mt-0.5 font-medium">${opts.sub}</p>` : ''}
            </div>
        </div>
        ${opts.search ? `<button data-focus-search="${opts.searchKey || 'main'}" class="top-icon-btn shrink-0 w-10 h-10 rounded-full border border-[#E2E8F0] bg-white"><i data-lucide="search" class="w-[18px] h-[18px]"></i></button>` : ''}
    </div>
</div>`;
    }
    return `
<div class="gutter-x pt-2 pb-3 bg-[#F8FAFC] sticky top-0 z-10">
    <div class="flex items-center justify-between">
        <button data-action="drawer" class="top-icon-btn">
            <i data-lucide="menu" class="w-[22px] h-[22px]"></i>
        </button>
        <div class="flex gap-1">
            ${opts.search ? `<button data-focus-search="${opts.searchKey || 'main'}" class="top-icon-btn"><i data-lucide="search" class="w-[20px] h-[20px]"></i></button>` : ''}
            ${opts.compose ? `<button data-go="messages" class="top-icon-btn"><i data-lucide="square-pen" class="w-[20px] h-[20px]"></i></button>` : ''}
            ${!opts.hideBell ? `<button data-go="notifications-list" class="top-icon-btn relative">
                <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
                <span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>` : ''}
        </div>
    </div>
    <div class="mt-1">
        <h1 class="text-[22px] font-bold text-[#0F172A] tracking-tight leading-tight">${title}</h1>
        ${opts.sub ? `<p class="text-[13px] text-[#64748B] mt-0.5 font-medium">${opts.sub}</p>` : ''}
    </div>
</div>`;
};

const buildingSvg = `<svg class="absolute right-2 bottom-0 w-28 h-24 opacity-90" viewBox="0 0 120 100" fill="none"><rect x="50" y="18" width="38" height="72" rx="4" fill="#93C5FD" opacity=".7"/><rect x="12" y="38" width="32" height="52" rx="4" fill="#BFDBFE" opacity=".9"/><rect x="58" y="28" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="70" y="28" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="58" y="44" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="70" y="44" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="20" y="48" width="6" height="8" rx="1" fill="white" opacity=".7"/><rect x="30" y="48" width="6" height="8" rx="1" fill="white" opacity=".7"/></svg>`;

const CONVERSATIONS = [
    { img: IMG.avatar.sarah, name: 'Sarah Johnson', sub: '12 Park Lane', preview: 'Hi, the maintenance issue has been fixed!', time: '10:30 AM', unread: 2, online: true },
    { img: IMG.avatar.plumber, name: 'Plumber Pro', sub: 'Regarding job #M-125', preview: 'Please let me know when you are free for access.', time: '9:15 AM', unread: 1, online: true },
    { img: IMG.avatar.david, name: 'David Wilson', sub: '45 Queens Road', preview: 'Thanks for the update.', time: 'Yesterday', unread: 0, online: false },
    { img: IMG.avatar.electric, name: 'Electric Fixers', sub: 'Job completed — #M-120', preview: 'The issue has been fixed.', time: 'Yesterday', unread: 0, online: false },
    { img: IMG.avatar.michael, name: 'Michael Lee', sub: '15 Victoria Ave', preview: 'Can we schedule an inspection?', time: '2d ago', unread: 0, online: false },
    { img: IMG.avatar.heating, name: 'Heating Experts', sub: 'Boiler service completed', preview: 'Invoice uploaded.', time: '2d ago', unread: 0, online: false },
];

const messagesHeader = () => `
<div class="inbox-header sticky top-0 z-10">
    <div class="inbox-header-row gutter-x">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <h1 class="inbox-title">Messages</h1>
        <button data-go="chat" class="top-icon-btn"><i data-lucide="square-pen" class="w-[20px] h-[20px]"></i></button>
    </div>
    <div class="gutter-x pb-3">
        <div class="search-bar inbox-search">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="messages" type="text" value="${STATE.search.messages}" placeholder="Search messages..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
        </div>
    </div>
</div>`;

const msgRow = (c) => `
<button data-go="chat" class="inbox-row">
    <div class="inbox-avatar-wrap">
        <img src="${c.img}" class="inbox-avatar" alt="">
        ${c.online ? '<span class="inbox-online"></span>' : ''}
    </div>
    <div class="inbox-body">
        <p class="inbox-name">${c.name}</p>
        <p class="inbox-preview ${c.unread ? 'inbox-preview-unread' : ''}">${c.preview}</p>
    </div>
    <div class="inbox-meta">
        <span class="inbox-time">${c.time}</span>
        ${c.unread ? `<span class="inbox-badge">${c.unread}</span>` : '<span class="inbox-badge-spacer"></span>'}
    </div>
</button>`;

const MAIN_SCREENS = ['dashboard','properties','tenants','maintenance','messages'];

const BOTTOM_NAV = [
    ['layout-dashboard', 'Home', 'dashboard'],
    ['building-2', 'Properties', 'properties'],
    ['users', 'Tenants', 'tenants'],
    ['wrench', 'Maintenance', 'maintenance'],
    ['message-square', 'Messages', 'messages'],
];

const DRAWER_NAV = [
    ['user-round', 'Profile', 'profile'],
    ['wallet', 'Financial', 'financial'],
    ['life-buoy', 'Help & FAQ', 'help-support'],
];

const TRANSACTIONS = [
    { tenant: 'Sarah Johnson', amount: '£2,450', status: 'Paid', date: 'Mar 1, 2025', prop: '12 Park Lane', iid: 0 },
    { tenant: 'David Wilson', amount: '£1,850', status: 'Overdue', date: 'Mar 1, 2025', prop: '45 Queens Rd', iid: 1 },
    { tenant: 'Michael Lee', amount: '£1,950', status: 'Paid', date: 'Feb 1, 2025', prop: '15 Victoria Ave', iid: 2 },
    { tenant: 'Sarah Johnson', amount: '£2,450', status: 'Paid', date: 'Feb 1, 2025', prop: '12 Park Lane', iid: 0 },
    { tenant: 'David Wilson', amount: '£1,850', status: 'Paid', date: 'Feb 1, 2025', prop: '45 Queens Rd', iid: 1 },
];

const DRAWER_QUICK = [
    ['building-2', 'Add Property', 'add-property'],
    ['wrench', 'Log Maintenance', 'log-maintenance'],
];

const NOTIFICATIONS = [
    { icon: 'wrench', title: 'Maintenance completed', desc: 'Kitchen sink fixed at 12 Park Lane', time: '2h ago', unread: true, screen: 'maintenance-detail', opts: { mid: 0 } },
    { icon: 'flame', title: 'Compliance alert', desc: 'Gas certificate expires in 3 days', time: '5h ago', unread: true, screen: 'property-detail', opts: { pid: 0, tab: 'compliance' } },
    { icon: 'banknote', title: 'Rent received', desc: '£2,450 from Sarah Johnson', time: '1d ago', unread: false, screen: 'invoice-detail', opts: { iid: 0 } },
    { icon: 'clipboard-check', title: 'Inspection scheduled', desc: '45 Queens Rd · Feb 28', time: '2d ago', unread: false, screen: 'property-detail', opts: { pid: 1, tab: 'inspection' } },
];

const notifAttrs = (opts = {}) => [
    opts.pid != null ? `data-pid="${opts.pid}"` : '',
    opts.tab ? `data-tab="${opts.tab}"` : '',
    opts.mid != null ? `data-mid="${opts.mid}"` : '',
    opts.iid != null ? `data-iid="${opts.iid}"` : '',
].filter(Boolean).join(' ');

const notifRow = (n) => `
<button data-go="${n.screen}" ${notifAttrs(n.opts)} class="notif-row ${n.unread ? 'notif-unread' : ''}">
    <span class="notif-dot${n.unread ? '' : ' notif-dot-hidden'}"></span>
    <div class="notif-icon"><i data-lucide="${n.icon}" class="w-4 h-4"></i></div>
    <div class="notif-body">
        <div class="notif-top">
            <p class="notif-title">${n.title}</p>
            <span class="notif-time">${n.time}</span>
        </div>
        <p class="notif-desc">${n.desc}</p>
    </div>
</button>`;

const formField = (label, value = '', type = 'text', ph = '') => `
<div><label class="form-label">${label}</label>
<input type="${type}" class="form-input" value="${value}" placeholder="${ph || 'Enter ' + label.toLowerCase()}"></div>`;

const formTextarea = (label, value = '', ph = '') => `
<div><label class="form-label">${label}</label>
<textarea class="form-input min-h-[96px] resize-none" placeholder="${ph}">${value}</textarea></div>`;

const formSelect = (label, value, options) => `
<div><label class="form-label">${label}</label>
<select class="form-input form-select">${options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;

const photoUpload = (label = 'Add photos') => `
<button type="button" data-action="toast" data-msg="Photo added" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
    <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
    <p class="text-[12px] text-[#64748B] mt-2">${label}</p>
</button>`;

const saveBtn = (label = 'Save Changes', msg = 'Changes saved') => `
<button type="button" data-action="save" data-msg="${msg}" class="btn-primary w-full py-3.5 text-[14px] mt-2">${label}</button>`;

const menuList = (items) => `
<div class="card overflow-hidden shadow-sm">
    ${items.map(([icon, label, target], i) => `
    <button data-go="${target}" class="menu-row w-full flex items-center justify-between px-4 py-[17px] text-left ${i < items.length - 1 ? 'border-b border-[#F1F5F9]' : ''}">
        <div class="flex items-center gap-4">
            <i data-lucide="${icon}" class="w-5 h-5 text-[#374151]"></i>
            <span class="text-[15px] font-medium text-[#1F2937]">${label}</span>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-[#9CA3AF]"></i>
    </button>`).join('')}
</div>`;

const bottomNav = () => {
    const parentMap = {
        'tenant-detail': 'tenants',
        'maintenance-detail': 'maintenance',
        'property-detail': 'properties',
        'invoice-detail': 'financial',
    };
    const activeScreen = parentMap[STATE.screen] || STATE.screen;
    const active = (n) => activeScreen === n ? 'active' : '';
    return `<div class="bottom-nav">
        ${BOTTOM_NAV.map(([ic, label, sc]) => `
        <button class="nav-btn ${active(sc)}" data-go="${sc}">
            <i data-lucide="${ic}"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;
};

const fabFloat = () => {
    if (!MAIN_SCREENS.includes(STATE.screen)) return '';
    return `<button class="fab-float" data-action="fab" aria-label="Quick actions"><i data-lucide="plus" class="w-6 h-6"></i></button>`;
};

const drawer = () => {
    const isActive = (sc) => STATE.screen === sc;
    const navHtml = DRAWER_NAV.map(([ic, label, sc]) => `
        <button data-go="${sc}" class="drawer-item ${isActive(sc) ? 'active' : ''}">
            <i data-lucide="${ic}" class="w-5 h-5"></i><span>${label}</span>
        </button>`).join('');
    return `
    <div class="drawer-overlay ${STATE.drawer?'open':''}" data-action="drawer-close"></div>
    <div class="drawer ${STATE.drawer?'open':''}">
        <div class="drawer-profile">
            <img src="${IMG.avatar.john}" class="drawer-avatar" alt="">
            <div class="min-w-0">
                <p class="drawer-name">John Smith</p>
                <p class="drawer-role">Property Owner</p>
            </div>
        </div>
        <nav class="drawer-nav">${navHtml}</nav>
        <div class="drawer-footer">
            <button data-action="toast" data-msg="Signed out successfully" class="drawer-logout">
                <i data-lucide="log-out" class="w-5 h-5"></i><span>Log out</span>
            </button>
        </div>
    </div>`;
};

const fabMenu = () => `
<div class="fab-menu ${STATE.fab?'open':''}">
    <div class="card p-2 shadow-xl min-w-[200px]">
        ${DRAWER_QUICK.map(([ic,l,sc])=>`
        <button data-go="${sc}" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]">
            <i data-lucide="${ic}" class="w-4 h-4 text-[#2563EB]"></i>${l}
        </button>`).join('')}
        <button data-go="messages" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]">
            <i data-lucide="message-square" class="w-4 h-4 text-[#2563EB]"></i>New Message
        </button>
    </div>
</div>`;

const propFilterSheet = () => {
    if (!STATE.showPropFilters || STATE.screen !== 'properties') return '';
    const adv = STATE.propertiesAdvanced;
    const count = filterProperties().length;
    const opt = (key, val, label, active) =>
        `<button type="button" data-adv-filter="${key}" data-adv-val="${val}" class="filter-sheet-option ${active ? 'active' : ''}">${label}</button>`;
    return `
    <div class="filter-sheet-overlay open" data-action="close-prop-filters"></div>
    <div class="filter-sheet open">
        <div class="filter-sheet-handle"></div>
        <div class="filter-sheet-header">
            <p class="filter-sheet-title">Filters</p>
            <button type="button" data-action="reset-prop-filters" class="filter-sheet-reset">Reset</button>
        </div>
        <div class="filter-sheet-body">
            <div class="filter-sheet-group">
                <p class="filter-sheet-label">Monthly Rent</p>
                <div class="filter-sheet-grid filter-sheet-grid-3">
                    ${opt('rent', 'all', 'All', adv.rent === 'all')}
                    ${opt('rent', 'under2k', 'Under £2k', adv.rent === 'under2k')}
                    ${opt('rent', 'over2k', '£2k+', adv.rent === 'over2k')}
                </div>
            </div>
            <div class="filter-sheet-group">
                <p class="filter-sheet-label">Bedrooms</p>
                <div class="filter-sheet-grid filter-sheet-grid-4">
                    ${opt('beds', 'any', 'Any', adv.beds === 'any')}
                    ${opt('beds', '1', '1+', adv.beds === '1')}
                    ${opt('beds', '2', '2+', adv.beds === '2')}
                    ${opt('beds', '3', '3+', adv.beds === '3')}
                </div>
            </div>
        </div>
        <div class="filter-sheet-footer">
            <button type="button" data-action="close-prop-filters" class="btn-primary w-full py-3.5 text-[14px]">Show ${count} propert${count === 1 ? 'y' : 'ies'}</button>
        </div>
    </div>`;
};

const PROP_SECTIONS = { details:'Overview', tenant:'Tenant', documents:'Documents', maintenance:'Maintenance', inspection:'Inspection', compliance:'Compliance', inventory:'Inventory', timeline:'Timeline' };

const propMenuList = () => {
    const items = [
        ['info','Overview','details'],['users','Tenant','tenant'],['file-text','Documents','documents'],
        ['wrench','Maintenance','maintenance'],['clipboard-list','Inspection','inspection'],
        ['shield-check','Compliance','compliance'],['package','Inventory','inventory'],['clock','Timeline','timeline'],
    ];
    return `<div class="card overflow-hidden">
        ${items.map(([ic,label,tab])=>`
        <button data-tab="${tab}" class="prop-menu-item">
            <div class="prop-menu-icon"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
            <span class="flex-1 text-[14px] font-semibold text-[#0F172A]">${label}</span>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`).join('')}
    </div>`;
};

const propSectionBar = (title, subtitle) => `
<div class="prop-section-bar gutter-x">
    <div class="sub-header-left">
        <button data-tab="overview" class="back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="min-w-0">
            <h2 class="sub-header-title">${title}</h2>
            <p class="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">${subtitle}</p>
        </div>
    </div>
</div>`;

/* ─── Screens ─── */
function screenDashboard() {
    const openMaint = MAINTENANCE_ITEMS.filter(m => m.status === 'open').length;
    const tenantCount = TENANTS.length;
    const monthlyRent = PROPERTIES.reduce((s, p) => s + parseInt(p.rent.replace(/[^\d]/g, ''), 10), 0);
    return `${topBar('Landlord HQ', { sub: 'Good morning, John 👋' })}
    <div class="gutter-x pb-6 space-y-5 screen-enter">
        <div class="portfolio-card">
            ${buildingSvg}
            <p class="text-[12px] font-medium text-blue-100">Portfolio Overview</p>
            <p class="text-[13px] text-blue-100/80 mt-3">Total Properties</p>
            <p class="text-[32px] font-bold leading-none mt-0.5">${PROPERTIES.length}</p>
            <button data-go="properties" class="view-all-btn">View all</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            ${[
                ['users','Active Tenants',tenantCount,'#ECFDF5','#059669','tenants'],
                ['wrench','Open Maintenance',openMaint,'#FFFBEB','#D97706','maintenance'],
                ['banknote','Monthly Rent','£'+monthlyRent.toLocaleString(),'#EFF6FF','#2563EB','financial'],
                ['alert-circle','Overdue Rent','£4,250','#FEF2F2','#DC2626','financial'],
            ].map(([ic,l,v,bg,c,go])=>`
            <button data-go="${go}" class="stat-mini card text-left">
                <div class="stat-icon" style="background:${bg};color:${c}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
                <p class="text-[11px] text-[#64748B] font-medium">${l}</p>
                <p class="text-[20px] font-bold text-[#0F172A] mt-0.5">${v}</p>
            </button>`).join('')}
        </div>
        <div>
            <h3 class="text-[15px] font-bold text-[#0F172A] mb-3">Upcoming Reminders</h3>
            <div class="space-y-2">
                ${[['flame','Gas Certificate Expiry','12 Park Lane','3 days left','#FEE2E2','#DC2626',0,'compliance'],['search','Inspection','45 Queens Road','5 days left','#FEF3C7','#D97706',1,'inspection'],['banknote','Rent Review','88 King Street','10 days left','#FEF3C7','#D97706',2,'overview']].map(([ic,t,p,d,bg,c,pid,tab])=>`
                <button data-go="property-detail" data-pid="${pid}" data-tab="${tab}" class="card w-full p-3.5 flex items-center gap-3 text-left">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background:${bg};color:${c}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
                    <div class="flex-1 min-w-0"><p class="text-[13px] font-semibold text-[#0F172A]">${t}</p><p class="text-[11px] text-[#64748B]">${p}</p></div>
                    <span class="badge shrink-0" style="background:${bg};color:${c}">${d}</span>
                </button>`).join('')}
            </div>
        </div>
        <div>
            <h3 class="text-[15px] font-bold text-[#0F172A] mb-3">Recent Activity</h3>
            <button data-go="maintenance-detail" data-mid="0" class="card w-full p-3.5 flex gap-3 text-left">
                <div class="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0"><i data-lucide="wrench" class="w-[18px] h-[18px]"></i></div>
                <div class="flex-1"><p class="text-[13px] font-semibold text-[#0F172A]">Maintenance request created</p><p class="text-[11px] text-[#64748B]">Kitchen sink leaking — 12 Park Lane</p></div>
                <span class="text-[11px] text-[#94A3B8] shrink-0">2h ago</span>
            </button>
        </div>
    </div>`;
}

function screenProperties() {
    const grid = STATE.propertiesView === 'grid';
    const filtered = filterProperties();
    const counts = { all: PROPERTIES.length, occupied: PROPERTIES.filter(p=>p.status==='Occupied').length, vacant: PROPERTIES.filter(p=>p.status==='Vacant').length };
    const adv = STATE.propertiesAdvanced;
    const activeAdv = adv.rent !== 'all' || adv.beds !== 'any';
    const propCard = (p, i) => grid ? `
        <button data-go="property-detail" data-pid="${p.id}" class="card overflow-hidden text-left">
            <div class="relative h-[100px]">
                <img src="${IMG.props[i]}" class="img-cover" alt="">
                <span class="badge absolute top-2 left-2" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
            </div>
            <div class="p-2.5">
                <p class="text-[12px] font-bold text-[#0F172A] leading-tight">${p.name}</p>
                <p class="text-[10px] text-[#64748B] mt-0.5 truncate">${p.tenant || 'No tenant'}</p>
                <p class="text-[13px] font-bold text-[#2563EB] mt-1">${p.rent}</p>
            </div>
        </button>` : `
        <button data-go="property-detail" data-pid="${p.id}" class="card w-full overflow-hidden text-left flex">
            <div class="relative w-[100px] shrink-0">
                <img src="${IMG.props[i]}" class="img-cover h-full min-h-[88px]" alt="">
            </div>
            <div class="p-3 flex-1 flex flex-col justify-center">
                <div class="flex justify-between items-start gap-2">
                    <p class="text-[13px] font-bold text-[#0F172A]">${p.name}</p>
                    <span class="badge shrink-0" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
                </div>
                <p class="text-[11px] text-[#64748B] mt-0.5">${p.address}</p>
                <p class="text-[13px] font-bold text-[#2563EB] mt-1">${p.rent}<span class="text-[10px] font-medium text-[#94A3B8]">/mo</span></p>
            </div>
        </button>`;
    return `${topBar('Properties', { search: true, searchKey: 'properties' })}
    <div class="gutter-x pb-6 space-y-4 screen-enter">
        <div class="flex gap-2">
            <div class="search-bar flex-1">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="properties" type="text" value="${STATE.search.properties}" placeholder="Search properties..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-action="toggle-prop-filters" class="filter-btn ${activeAdv ? 'filter-btn-active' : ''}">
                <i data-lucide="sliders-horizontal" class="w-[18px] h-[18px]"></i>
                ${activeAdv ? '<span class="filter-btn-dot"></span>' : ''}
            </button>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-0.5">
            ${[['all','All',counts.all],['occupied','Occupied',counts.occupied],['vacant','Vacant',counts.vacant]].map(([k,l,n])=>`
            <button type="button" data-prop-filter="${k}" class="filter-chip ${STATE.propertiesFilter===k?'active':''}">${l} (${n})</button>`).join('')}
        </div>
        <div class="segment-toggle">
            <button type="button" data-prop-view="grid" class="${grid?'active':''}">Grid</button>
            <button type="button" data-prop-view="list" class="${!grid?'active':''}">List</button>
        </div>
        <p class="text-[12px] text-[#94A3B8]">${filtered.length} propert${filtered.length===1?'y':'ies'} shown</p>
        ${filtered.length ? `<div class="${grid?'grid grid-cols-2 gap-3':'space-y-3'}">
            ${filtered.map(p=>propCard(p, p.id)).join('')}
        </div>` : `<div class="card p-8 text-center"><i data-lucide="building-2" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No properties found</p><p class="text-[12px] text-[#64748B] mt-1">Try a different search or filter</p></div>`}
    </div>`;
}

function screenPropertyDetail() {
    const p = PROPERTIES[STATE.propertyId];
    const isHub = STATE.tab === 'overview';
    const tabContent = {
        details: `
            <div class="gutter-x pb-6 space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    ${[[p.rent,'Monthly Rent'],[p.beds,'Bedrooms'],[p.baths,'Bathrooms'],[p.sqft,'Sq Ft']].map(([v,l])=>`
                    <div class="card p-4"><p class="text-[10px] text-[#64748B] uppercase tracking-wide font-medium">${l}</p><p class="text-xl font-bold text-[#0F172A] mt-1">${v}</p></div>`).join('')}
                </div>
                <div class="card p-4 space-y-3">
                    <h3 class="text-[14px] font-bold">Property Information</h3>
                    ${[['Type','Semi-detached'],['Built','1985'],['EPC','Rating B'],['Council Tax','Band D']].map(([k,v])=>`
                    <div class="flex justify-between py-1.5 border-b border-[#F1F5F9] last:border-0 text-[13px]"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
                </div>
                <div class="card p-4">
                    <h3 class="text-[14px] font-bold mb-3">Utilities & Parking</h3>
                    <div class="flex flex-wrap gap-2">${['Gas','Electric','Water','Broadband','Parking'].map(u=>`<span class="badge bg-[#F1F5F9] text-[#475569]">${u}</span>`).join('')}</div>
                </div>
                <div class="card p-4">
                    <h3 class="text-[14px] font-bold mb-3">Appliances</h3>
                    <div class="flex flex-wrap gap-2">${['Boiler','Oven','Fridge','Washer','Smoke Alarm'].map(u=>`<span class="badge bg-[#EFF6FF] text-[#2563EB]">${u}</span>`).join('')}</div>
                </div>
            </div>`,
        tenant: `
            <div class="gutter-x pb-6 space-y-3">
                ${p.tenant ? (() => {
                    const tid = {0:0,1:1,3:2}[STATE.propertyId] ?? 0;
                    const avatars = [IMG.avatar.sarah, IMG.avatar.david, IMG.avatar.michael];
                    return `
                <div class="card p-4 flex items-center gap-4">
                    <img src="${avatars[tid]}" class="w-14 h-14 rounded-full object-cover ring-2 ring-[#EFF6FF]" alt="">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-[16px] font-bold text-[#0F172A]">${p.tenant}</h3>
                        <span class="badge bg-[#DCFCE7] text-[#16A34A] mt-1 inline-block">Active Lease</span>
                    </div>
                    <button data-go="edit-tenant" data-tid="${tid}" class="text-[13px] font-semibold text-[#2563EB] shrink-0">Edit</button>
                </div>
                <div class="card divide-y divide-[#F1F5F9]">
                    ${[['phone','+44 7700 900456'],['mail','sarah.j@email.com'],['calendar','Move-in: Jan 15, 2024'],['calendar-clock','Lease ends: Jan 14, 2026'],['user','Emergency: James Johnson']].map(([ic,v])=>`
                    <div class="px-4 py-3.5 flex items-center gap-3"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B] shrink-0"></i><span class="text-[13px] font-medium text-[#0F172A]">${v}</span></div>`).join('')}
                </div>
                <div class="grid grid-cols-2 gap-3 pt-1">
                    <button data-go="chat" class="btn-primary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="message-square" class="w-4 h-4"></i>Message</button>
                    <button data-tab="documents" class="btn-secondary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="file-text" class="w-4 h-4"></i>Lease</button>
                </div>`;
                })() : `<div class="card p-8 text-center"><i data-lucide="user-x" class="w-12 h-12 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold mt-3 text-[#0F172A]">No tenant assigned</p><button data-go="invite-tenant" data-pid="${STATE.propertyId}" class="btn-primary w-full mt-4 py-3 text-[13px]">Invite Tenant</button></div>`}
            </div>`,
        documents: `
            <div class="gutter-x pb-6 space-y-3">
                <div class="card border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-6 text-center">
                    <i data-lucide="cloud-upload" class="w-10 h-10 text-[#2563EB] mx-auto"></i>
                    <p class="text-[13px] font-semibold mt-2">Drag & drop files</p>
                    <p class="text-[11px] text-[#64748B]">or tap to browse</p>
                </div>
                ${[['file-text','Lease Agreement','PDF · 2.4 MB','#2563EB'],['shield','Gas Certificate','Valid Mar 2026','#22C55E'],['zap','Electrical Cert','Expires 45 days','#F59E0B'],['leaf','EPC Certificate','Rating B','#22C55E'],['clipboard-list','Inspection Report','Dec 2023','#64748B']].map(([ic,n,d,c])=>`
                <div data-go="document-preview" class="card p-3.5 flex items-center gap-3 card-hover cursor-pointer">
                    <div class="w-11 h-11 rounded-xl bg-[#F8FAFC] flex items-center justify-center" style="color:${c}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                    <div class="flex-1"><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>
                    <button data-action="toast" data-msg="Downloading ${n}..." class="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="download" class="w-4 h-4 text-[#64748B]"></i></button>
                </div>`).join('')}
            </div>`,
        maintenance: `
            <div class="gutter-x pb-6">
                <div class="flex gap-3 overflow-x-auto pb-3">
                    ${['New (2)','Assigned','In Progress','Done'].map((col,i)=>`
                    <div class="shrink-0 w-[150px]">
                        <p class="text-[11px] font-bold text-[#64748B] mb-2 uppercase tracking-wide">${col}</p>
                        ${i===0?`<div class="space-y-2">
                            <div data-go="maintenance-detail" data-mid="0" class="card p-3 border-l-[3px] border-l-[#EF4444] cursor-pointer"><span class="badge bg-[#FEE2E2] text-[#DC2626]">High</span><p class="text-[12px] font-bold mt-2">Sink leaking</p><img src="${IMG.maint[0]}" class="w-full h-16 rounded-lg object-cover mt-2" alt=""><p class="text-[10px] text-[#94A3B8] mt-1">2h ago</p></div>
                            <div class="card p-3 border-l-[3px] border-l-[#F59E0B]"><span class="badge bg-[#FEF3C7] text-[#D97706]">Medium</span><p class="text-[12px] font-bold mt-2">Window latch</p><p class="text-[10px] text-[#94A3B8] mt-1">1d ago</p></div>
                        </div>`:i===2?`<div class="card p-3"><span class="badge bg-[#DBEAFE] text-[#2563EB]">In Progress</span><p class="text-[12px] font-bold mt-2">Radiator fix</p><p class="text-[10px] text-[#64748B]">Plumber Pro</p></div>`:`<div class="card p-3 opacity-50"><p class="text-[12px] font-bold">Light fixed</p></div>`}
                    </div>`).join('')}
                </div>
                <button data-go="log-maintenance" class="btn-primary w-full py-3.5 text-[13px] mt-2">Log New Issue</button>
            </div>`,
        inspection: `
            <div class="gutter-x pb-6 space-y-4">
                <div class="card p-4 bg-gradient-to-br from-[#EFF6FF] to-white border-[#BFDBFE]">
                    <p class="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Upcoming</p>
                    <p class="text-[15px] font-bold mt-1">Mid-term Inspection</p>
                    <p class="text-[12px] text-[#64748B]">Feb 28, 2025 · 10:00 AM</p>
                    <button data-go="reschedule-inspection" data-pid="${STATE.propertyId}" class="btn-primary w-full py-2.5 text-[12px] mt-3">Reschedule</button>
                </div>
                <h3 class="text-[14px] font-bold">Past Reports</h3>
                ${[['Check-in','Jan 15, 2024','4.8'],['Annual','Jan 10, 2023','4.5']].map(([n,d,r])=>`
                <div class="card p-3.5 flex justify-between items-center"><div><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${d}</p></div><span class="badge bg-[#DCFCE7] text-[#16A34A]">★ ${r}</span></div>`).join('')}
                <h3 class="text-[14px] font-bold">Photos</h3>
                <div class="grid grid-cols-3 gap-2">${IMG.interior.map(src=>`<div class="aspect-square rounded-xl overflow-hidden"><img src="${src}" class="img-cover" alt=""></div>`).join('')}</div>
            </div>`,
        compliance: `
            <div class="gutter-x pb-6 space-y-2">
                ${COMPLIANCE_ITEMS.map(([ic,n,exp],cid)=>`
                <div class="card p-3.5 flex items-center gap-3">
                    <div class="w-1 h-11 rounded-full shrink-0 bg-[#22C55E]"></div>
                    <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                    <div class="flex-1"><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${exp}</p></div>
                    <button data-go="renew-compliance" data-pid="${STATE.propertyId}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>
                </div>`).join('')}
            </div>`,
        inventory: `
            <div class="gutter-x pb-6 space-y-2">
                ${[['utensils','Kitchen','Good','4 photos'],['sofa','Living Room','Good','6 items'],['bed-double','Bedroom','Fair','5 items'],['bath','Bathroom','Good','3 items'],['door-open','Hallway','Good','2 items']].map(([ic,r,c,n],idx)=>`
                <button data-go="inventory-room" data-room="${idx}" class="card w-full p-4 flex items-center justify-between card-hover text-left">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                        <div><p class="text-[13px] font-semibold">${r}</p><p class="text-[11px] text-[#64748B]">${n}</p></div>
                    </div>
                    <span class="badge ${c==='Good'?'bg-[#DCFCE7] text-[#16A34A]':'bg-[#FEF3C7] text-[#D97706]'}">${c}</span>
                </button>`).join('')}
            </div>`,
        timeline: `
            <div class="gutter-x pb-6">
                <div class="relative pl-7 space-y-4 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
                    ${[['#2563EB','Certificate renewed','Gas cert updated','Today'],['#22C55E','Maintenance done','Sink fixed','2 days ago'],['#F59E0B','Inspection passed','Annual check','Dec 10'],['#2563EB','Lease signed','Sarah Johnson','Jan 2024'],['#94A3B8','Property added','Portfolio','Dec 2023']].map(([c,t,d,time])=>`
                    <div class="relative">
                        <div class="absolute -left-7 w-4 h-4 rounded-full border-[3px] border-[#F8FAFC] shadow-sm" style="background:${c}"></div>
                        <div class="card p-3.5"><p class="text-[13px] font-semibold">${t}</p><p class="text-[12px] text-[#64748B]">${d}</p><p class="text-[10px] text-[#94A3B8] mt-1">${time}</p></div>
                    </div>`).join('')}
                </div>
            </div>`,
    };

    if (isHub) {
        return `
        <div class="relative h-[180px] shrink-0 w-full">
            <img src="${IMG.props[STATE.propertyId]}" class="img-cover" alt="">
            <div class="absolute inset-0 hero-gradient"></div>
            <button data-action="back" class="top-icon-btn absolute bg-white/90 rounded-full shadow-md" style="top:12px;left:20px"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <span class="badge absolute bottom-3 left-5" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
        </div>
        <div class="gutter-x pt-3 pb-1 flex items-start justify-between gap-3">
            <div class="min-w-0">
                <h2 class="text-[18px] font-bold text-[#0F172A] leading-tight">${p.name}</h2>
                <p class="text-[12px] text-[#64748B] mt-0.5">${p.address}</p>
            </div>
            <button data-go="edit-property" data-pid="${STATE.propertyId}" class="text-[13px] font-semibold text-[#2563EB] shrink-0 pt-0.5">Edit</button>
        </div>
        <div class="gutter-x py-2.5 flex justify-between">
            ${[['users','Tenant','tenant'],['wrench','Maintenance','maintenance'],['file-text','Documents','documents']].map(([ic,l,tab])=>`
            <button data-tab="${tab}" class="quick-action">
                <div class="quick-action-circle"><i data-lucide="${ic}" class="w-[20px] h-[20px]"></i></div>
                <span>${l}</span>
            </button>`).join('')}
        </div>
        <div class="gutter-x pb-6 pt-1 screen-enter">
            <p class="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">All Sections</p>
            ${propMenuList()}
        </div>`;
    }

    const sectionTitle = PROP_SECTIONS[STATE.tab] || 'Section';
    return `
    ${propSectionBar(sectionTitle, p.name)}
    <div class="screen-enter pt-3">${tabContent[STATE.tab] || tabContent.details}</div>`;
}

function screenTenants() {
    const tenants = [
        { id: 0, name: 'Sarah Johnson', prop: '12 Park Lane', img: IMG.avatar.sarah, lease: 'Active', rent: 'Paid' },
        { id: 1, name: 'David Wilson', prop: '45 Queens Rd', img: IMG.avatar.david, lease: 'Active', rent: 'Overdue' },
        { id: 2, name: 'Michael Lee', prop: '15 Victoria Ave', img: IMG.avatar.michael, lease: 'Active', rent: 'Paid' },
    ];
    const q = STATE.search.tenants.toLowerCase();
    const filtered = tenants.filter(t => !q || t.name.toLowerCase().includes(q) || t.prop.toLowerCase().includes(q));
    return `${topBar('Tenants', { search: true, searchKey: 'tenants' })}
    <div class="gutter-x pb-6 space-y-3 screen-enter">
        <div class="search-bar">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="tenants" type="text" value="${STATE.search.tenants}" placeholder="Search tenants..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
        </div>
        ${filtered.length ? filtered.map(t=>`
        <button data-go="tenant-detail" data-tid="${t.id}" class="card w-full p-4 flex gap-3.5 card-hover text-left">
            <img src="${t.img}" class="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm" alt="">
            <div class="flex-1 min-w-0">
                <p class="text-[15px] font-bold text-[#0F172A]">${t.name}</p>
                <p class="text-[12px] text-[#64748B]">${t.prop}</p>
                <div class="flex gap-2 mt-2">
                    <span class="badge bg-[#DCFCE7] text-[#16A34A]">${t.lease}</span>
                    <span class="badge ${t.rent==='Paid'?'bg-[#DCFCE7] text-[#16A34A]':'bg-[#FEE2E2] text-[#DC2626]'}">${t.rent}</span>
                </div>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0 self-center"></i>
        </button>`).join('') : `<div class="card p-8 text-center"><i data-lucide="users" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No tenants found</p></div>`}
    </div>`;
}

function screenTenantDetail() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    const tabs = TENANT_TABS.map(tn => `<button data-ttab="${tn}" class="tab-pill ${STATE.tenantTab===tn?'active':''}">${tn.charAt(0).toUpperCase()+tn.slice(1)}</button>`).join('');
    const tabBody = {
        profile: `<div class="card divide-y divide-[#F1F5F9]">
            ${[['phone',t.phone],['mail',t.email],['home',t.prop],['banknote','Rent: £'+t.rent+'/month'],['calendar','Move-in: '+t.moveIn],['user','Emergency: '+t.emergency]].map(([ic,v])=>`
            <div class="p-4 flex items-center gap-3"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i><span class="text-[13px] font-medium">${v}</span></div>`).join('')}
        </div>`,
        documents: `<div class="space-y-2">${[['file-text','ID Verification','Verified'],['file-check','Reference Check','Complete'],['shield','Right to Rent','Valid']].map(([ic,n,s])=>`
        <div class="card p-3.5 flex items-center gap-3"><i data-lucide="${ic}" class="w-5 h-5 text-[#64748B]"></i><div class="flex-1"><p class="text-[13px] font-semibold">${n}</p></div><span class="badge bg-[#DCFCE7] text-[#16A34A]">${s}</span></div>`).join('')}</div>`,
        lease: `<div class="card p-4 space-y-3">
            <div class="flex justify-between text-[13px]"><span class="text-[#64748B]">Lease Type</span><span class="font-semibold">AST · 12 months</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-[#64748B]">Start Date</span><span class="font-semibold">Jan 15, 2024</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-[#64748B]">End Date</span><span class="font-semibold">Jan 14, 2026</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-[#64748B]">Deposit</span><span class="font-semibold">£2,450</span></div>
            <button data-go="document-preview" class="btn-secondary w-full py-3 text-[13px] mt-2">View Lease PDF</button>
        </div>`,
        maintenance: `<div class="space-y-2">${[['Kitchen tap dripping','Low','Resolved','Jan 2025'],['Heating issue','High','Completed','Nov 2024']].map(([issue,p,s,d])=>`
        <button data-go="maintenance-detail" data-mid="0" class="card w-full p-3.5 text-left">
            <div class="flex justify-between"><p class="text-[13px] font-semibold">${issue}</p><span class="badge bg-[#DCFCE7] text-[#16A34A]">${s}</span></div>
            <p class="text-[11px] text-[#64748B] mt-1">${p} priority · ${d}</p>
        </button>`).join('')}</div>`,
        messages: `<button data-go="chat" class="card w-full p-4 flex items-center gap-3 text-left">
            <img src="${[IMG.avatar.sarah,IMG.avatar.david,IMG.avatar.michael][STATE.tenantId]}" class="w-10 h-10 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[13px] font-semibold">Open conversation</p><p class="text-[11px] text-[#64748B]">Last message 2h ago</p></div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`,
    };
    return `
    <div class="gutter-x pt-3 pb-4 flex items-center gap-3 border-b border-[#E2E8F0] bg-white">
        <button data-action="back" class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
        <img src="${[IMG.avatar.sarah,IMG.avatar.david,IMG.avatar.michael][STATE.tenantId]}" class="w-11 h-11 rounded-xl object-cover" alt="">
        <div class="flex-1 min-w-0"><p class="text-[15px] font-bold truncate">${t.firstName} ${t.lastName}</p><p class="text-[12px] text-[#64748B]">${t.prop}</p></div>
        <button data-go="edit-tenant" data-tid="${STATE.tenantId}" class="text-[13px] font-semibold text-[#2563EB] shrink-0">Edit</button>
    </div>
    <div class="gutter-x pt-4 pb-8 screen-enter space-y-4">
        <div class="flex gap-2 overflow-x-auto">${tabs}</div>
        ${tabBody[STATE.tenantTab] || tabBody.profile}
        <div class="grid grid-cols-2 gap-3">
            <button data-go="chat" class="btn-primary py-3.5 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="message-square" class="w-4 h-4"></i>Message</button>
            <button data-action="toast" data-msg="Calling ${t.firstName}" class="btn-secondary py-3.5 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="phone" class="w-4 h-4"></i>Call</button>
        </div>
    </div>`;
}

function screenMaintenance() {
    const f = STATE.maintFilter;
    const items = MAINTENANCE_ITEMS.filter(m => m.status === f);
    const counts = {
        open: MAINTENANCE_ITEMS.filter(m=>m.status==='open').length,
        progress: MAINTENANCE_ITEMS.filter(m=>m.status==='progress').length,
        done: MAINTENANCE_ITEMS.filter(m=>m.status==='done').length,
    };
    return `${topBar('Maintenance')}
    <div class="gutter-x pb-6 space-y-4 screen-enter">
        <div class="flex gap-2 overflow-x-auto pb-1">
            ${[['open','Open',counts.open],['progress','In Progress',counts.progress],['done','Completed',counts.done]].map(([k,l,n])=>`
            <button data-maint-filter="${k}" class="filter-chip ${f===k?'active':''}">${l} (${n})</button>`).join('')}
        </div>
        <div class="space-y-3">
        ${items.length ? items.map(m=>`
        <button data-go="maintenance-detail" data-mid="${m.mid}" class="card p-3.5 flex gap-3 w-full text-left">
            <img src="${IMG.maint[m.mid % IMG.maint.length]}" class="w-[72px] h-[72px] rounded-xl object-cover shrink-0" alt="">
            <div class="flex-1 min-w-0">
                <span class="badge ${m.priority==='High'?'bg-[#FEE2E2] text-[#DC2626]':m.priority==='Medium'?'bg-[#FEF3C7] text-[#D97706]':'bg-[#DBEAFE] text-[#2563EB]'}">${m.priority}</span>
                <p class="text-[14px] font-bold text-[#0F172A] mt-1.5 leading-tight">${m.issue}</p>
                <p class="text-[11px] text-[#64748B] mt-0.5">${m.prop} · ${m.time}</p>
                <div class="flex items-center gap-2 mt-2">
                    <img src="${IMG.avatar.plumber}" class="w-5 h-5 rounded-full object-cover" alt="">
                    <span class="text-[11px] font-medium text-[#64748B]">${m.contractor}</span>
                </div>
            </div>
        </button>`).join('') : `<div class="card p-8 text-center"><i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No ${f==='open'?'open':f==='progress'?'in progress':'completed'} issues</p></div>`}
        </div>
        <button data-go="log-maintenance" class="btn-primary w-full py-3.5 text-[13px]">Log New Issue</button>
    </div>`;
}

function screenFinancial() {
    return `${topBar('Financial')}
    <div class="gutter-x pb-6 space-y-4 screen-enter">
        <div class="card p-5 border-l-4 border-l-[#2563EB]">
            <p class="text-[12px] text-[#64748B] font-medium">Total Rental Income</p>
            <p class="text-3xl font-bold text-[#0F172A] mt-1">£24,560</p>
            <p class="text-[12px] text-[#16A34A] mt-2 flex items-center gap-1"><i data-lucide="trending-up" class="w-4 h-4"></i>+8.2% vs last month</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div class="card p-4"><p class="text-[11px] text-[#64748B]">Outstanding</p><p class="text-xl font-bold text-[#EF4444]">£4,250</p></div>
            <div class="card p-4"><p class="text-[11px] text-[#64748B]">Collected</p><p class="text-xl font-bold text-[#22C55E]">£20,310</p></div>
        </div>
        <div class="card p-4">
            <h3 class="text-[14px] font-bold mb-4">Income Overview</h3>
            <div class="flex items-end justify-between h-28 gap-2">
                ${[45,68,58,82,72,95,88].map((h,i)=>`<div class="flex-1 flex flex-col items-center gap-1.5"><div class="w-full rounded-t-lg bg-gradient-to-t from-[#1D4ED8] to-[#2563EB]" style="height:${h}%"></div><span class="text-[9px] text-[#94A3B8] font-medium">${['J','F','M','A','M','J','J'][i]}</span></div>`).join('')}
            </div>
        </div>
        <h3 class="text-[14px] font-bold">Recent Invoices</h3>
        ${[['Sarah Johnson','£2,450','Paid','#22C55E'],['David Wilson','£1,850','Overdue','#EF4444'],['Michael Lee','£1,950','Paid','#22C55E']].map(([n,a,s,c],i)=>`
        <button data-go="invoice-detail" data-iid="${i}" class="card p-3.5 flex justify-between items-center card-hover w-full text-left">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="receipt" class="w-5 h-5 text-[#64748B]"></i></div>
                <div><p class="text-[13px] font-semibold">${n}</p><p class="text-[12px] text-[#64748B]">${a}</p></div>
            </div>
            <span class="badge" style="background:${c}18;color:${c}">${s}</span>
        </button>`).join('')}
    </div>`;
}

function screenMessages() {
    const q = STATE.search.messages.toLowerCase();
    const convos = CONVERSATIONS.filter(c =>
        !q || c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
    return `${messagesHeader()}
    <div class="pb-6 screen-enter">
        ${convos.length ? `<div class="inbox-list">${convos.map(c => msgRow(c)).join('')}</div>` : `
        <div class="inbox-empty gutter-x">
            <p class="text-[14px] font-semibold text-[#0F172A]">No messages found</p>
            <p class="text-[13px] text-[#64748B] mt-1">Try a different search term</p>
        </div>`}
    </div>`;
}

function screenChat() {
    return `
    <div class="screen-full chat-screen">
        <div class="chat-header gutter-x">
            <button data-action="back" class="back-btn shrink-0"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <div class="chat-header-info">
                <img src="${IMG.avatar.sarah}" class="chat-header-avatar" alt="">
                <div class="min-w-0">
                    <p class="text-[15px] font-bold text-[#0F172A] leading-tight">Sarah Johnson</p>
                    <p class="text-[11px] text-[#22C55E] font-medium flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>Online · 12 Park Lane</p>
                </div>
            </div>
            <button data-action="toast" data-msg="Calling Sarah Johnson" class="chat-header-action"><i data-lucide="phone" class="w-[18px] h-[18px]"></i></button>
        </div>
        <div class="screen-body-inner gutter-x py-4 chat-messages">
            <p class="chat-date-label">Today</p>
            <div class="chat-bubble-in">
                <p>Hi, the kitchen sink is leaking again. Could you send someone?</p>
                <span class="chat-time">10:15 AM</span>
            </div>
            <div class="chat-bubble-out">
                <p>Thanks Sarah, I'll send a plumber today before 2pm.</p>
                <span class="chat-time">10:20 AM · Sent</span>
            </div>
            <div class="chat-bubble-in">
                <p>The maintenance issue has been fixed! Thank you 🙏</p>
                <span class="chat-time">10:30 AM</span>
            </div>
        </div>
        <div class="chat-input-bar gutter-x">
            <button type="button" class="chat-input-icon"><i data-lucide="paperclip" class="w-[18px] h-[18px]"></i></button>
            <div class="chat-input-field">Type a message...</div>
            <button type="button" data-action="toast" data-msg="Message sent" class="chat-send-btn"><i data-lucide="send" class="w-[17px] h-[17px]"></i></button>
        </div>
    </div>`;
}

function screenProfile() {
    return `${topBar('Profile', { hideBell: true })}
    <div class="gutter-x pb-8 screen-enter">
        <button data-go="personal-info" class="profile-card">
            <img src="${IMG.avatar.john}" class="profile-card-avatar" alt="">
            <div class="profile-card-body">
                <p class="profile-card-name">John Smith</p>
                <p class="profile-card-hint">View & edit profile</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>
        ${menuList([
            ['bell','Notification Settings','notifications-settings'],
            ['key-round','Change Password','password'],
            ['receipt','Transaction History','transaction-history'],
            ['gem','Subscription','subscription'],
        ])}
        <p class="section-title mt-5">Support & Legal</p>
        ${menuList([
            ['help-circle','Help & Support','help-support'],
            ['shield','Privacy Policy','privacy'],
            ['file-text','Terms & Conditions','terms'],
        ])}
    </div>`;
}

function screenPersonalInfo() {
    return `${topBar('Personal Information', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="flex justify-center mb-2">
            <div class="relative"><img src="${IMG.avatar.john}" class="w-20 h-20 rounded-2xl object-cover" alt="">
            <button type="button" data-action="toast" data-msg="Photo updated" class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center"><i data-lucide="camera" class="w-4 h-4 text-white"></i></button></div>
        </div>
        ${formField('First Name', 'John')}${formField('Last Name', 'Smith')}
        ${formField('Email', 'john.smith@email.com', 'email')}${formField('Phone', '+44 7700 900123', 'tel')}
        ${formField('Address', '42 Baker Street, London')}
        ${saveBtn('Save Changes', 'Profile updated')}
    </div>`;
}

function screenNotificationsSettings() {
    const items = [
        ['rent-reminders','Rent reminders'],['maintenance-updates','Maintenance updates'],
        ['compliance-alerts','Compliance alerts'],['new-messages','New messages'],['marketing-emails','Marketing emails'],
    ];
    return `${topBar('Notifications', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <p class="section-title">Push Notifications</p>
        ${items.map(([key,l])=>`
        <button data-toggle="${key}" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium text-[#1F2937]">${l}</span>
            <div class="toggle ${STATE.toggles[key]?'':'off'}"></div>
        </button>`).join('')}
        <p class="section-title mt-4">Email Digest</p>
        <button data-toggle="weekly-summary" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium">Weekly summary</span>
            <div class="toggle ${STATE.toggles['weekly-summary']?'':'off'}"></div>
        </button>
    </div>`;
}

function screenPassword() {
    return `${topBar('Change Password', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <p class="text-[13px] text-[#64748B]">Update your account password. Use at least 8 characters.</p>
        <div><label class="form-label">Current Password</label><input type="password" class="form-input" placeholder="Enter current password"></div>
        <div><label class="form-label">New Password</label><input type="password" class="form-input" placeholder="Enter new password"></div>
        <div><label class="form-label">Confirm Password</label><input type="password" class="form-input" placeholder="Confirm new password"></div>
        <button data-action="toast" data-msg="Password updated" class="btn-primary w-full py-3.5 text-[14px]">Update Password</button>
    </div>`;
}

function screenSecurity() {
    return screenPassword();
}

function screenPreferences() {
    return `${topBar('Preferences', { back: true })}
    <div class="gutter-x pb-8 space-y-3 screen-enter">
        ${Object.entries(PREF_OPTIONS).map(([key, p]) => `
        <button data-go="edit-preference" data-pref="${key}" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium">${p.title}</span>
            <span class="text-[13px] text-[#64748B] flex items-center gap-1">${p.current} <i data-lucide="chevron-right" class="w-4 h-4"></i></span>
        </button>`).join('')}
    </div>`;
}

function screenPaymentMethods() {
    return `${topBar('Payment Methods', { back: true })}
    <div class="gutter-x pb-8 space-y-3 screen-enter">
        <button data-go="edit-payment-method" data-pmid="0" class="card p-4 flex items-center gap-3 w-full text-left">
            <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="credit-card" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div class="flex-1"><p class="text-[14px] font-semibold">Visa ···· 4242</p><p class="text-[12px] text-[#64748B]">Expires 08/27 · Default</p></div>
            <span class="badge bg-[#DCFCE7] text-[#16A34A]">Active</span>
        </button>
        <button data-go="edit-payment-method" data-pmid="1" class="card p-4 flex items-center gap-3 w-full text-left opacity-80">
            <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="landmark" class="w-5 h-5 text-[#64748B]"></i></div>
            <div class="flex-1"><p class="text-[14px] font-semibold">Barclays ···· 8901</p><p class="text-[12px] text-[#64748B]">Rent collection account</p></div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>
        <button data-go="add-payment-method" class="btn-secondary w-full py-3.5 text-[14px] mt-2">Add Payment Method</button>
    </div>`;
}

function screenSubscription() {
    return `${topBar('Subscription', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-5 border-l-4 border-l-[#2563EB]">
            <p class="text-[11px] font-bold text-[#2563EB] uppercase tracking-wide">Current Plan</p>
            <p class="text-[20px] font-bold text-[#0F172A] mt-1">Pro Landlord</p>
            <p class="text-[13px] text-[#64748B] mt-1">£19/month · Renews Mar 15, 2025</p>
        </div>
        <div class="card divide-y divide-[#F1F5F9]">
            ${['Up to 20 properties','Unlimited tenants','Compliance tracking','Priority support'].map(f=>`
            <div class="px-4 py-3 flex items-center gap-2 text-[13px]"><i data-lucide="check" class="w-4 h-4 text-[#22C55E]"></i>${f}</div>`).join('')}
        </div>
        <button data-action="toast" data-msg="Manage subscription" class="btn-primary w-full py-3.5 text-[14px]">Manage Plan</button>
    </div>`;
}

function screenTransactionHistory() {
    return `${topBar('Transaction History', { back: true, sub: 'Payments processed via Stripe' })}
    <div class="gutter-x pb-8 screen-enter">
        <div class="txn-list">
            ${TRANSACTIONS.map(t => `
            <button data-go="invoice-detail" data-iid="${t.iid}" class="txn-row">
                <div class="txn-icon ${t.status === 'Paid' ? 'txn-icon-paid' : 'txn-icon-overdue'}">
                    <i data-lucide="${t.status === 'Paid' ? 'check' : 'alert-circle'}" class="w-4 h-4"></i>
                </div>
                <div class="txn-body">
                    <p class="txn-title">${t.tenant}</p>
                    <p class="txn-sub">${t.prop} · ${t.date}</p>
                </div>
                <div class="txn-meta">
                    <p class="txn-amount">${t.amount}</p>
                    <span class="txn-badge ${t.status === 'Paid' ? 'txn-badge-paid' : 'txn-badge-overdue'}">${t.status}</span>
                </div>
            </button>`).join('')}
        </div>
    </div>`;
}

function screenHelpSupport() {
    return `${topBar('Help & Support', { back: true })}
    <div class="gutter-x pb-8 space-y-3 screen-enter">
        <p class="text-[14px] text-[#64748B] leading-relaxed">Quick answers or reach our team directly.</p>
        <button data-go="faq" class="help-card">
            <div class="help-card-icon"><i data-lucide="circle-help" class="w-5 h-5"></i></div>
            <div class="help-card-body">
                <p class="help-card-title">FAQ</p>
                <p class="help-card-sub">Common questions answered</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>
        <button data-go="chat" class="help-card">
            <div class="help-card-icon"><i data-lucide="message-circle" class="w-5 h-5"></i></div>
            <div class="help-card-body">
                <p class="help-card-title">Contact Support</p>
                <p class="help-card-sub">Chat with our team</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>
        <button data-action="toast" data-msg="support@landlordhq.com" class="help-email">
            <i data-lucide="mail" class="w-4 h-4"></i>
            <span>support@landlordhq.com</span>
        </button>
    </div>`;
}

function screenFaq() {
    return `${topBar('FAQ', { back: true })}
    <div class="gutter-x pb-8 screen-enter">
        <div class="faq-list-minimal">
            ${FAQ_ITEMS.map((f, i) => `
            <button data-go="faq-detail" data-fid="${f.id}" class="faq-minimal-row">
                <p class="faq-minimal-q">${f.q}</p>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>`).join('')}
        </div>
        <p class="text-center text-[13px] text-[#64748B] mt-6">Can't find an answer?</p>
        <button data-go="chat" class="btn-primary w-full py-3 text-[13px] mt-2">Contact Support</button>
    </div>`;
}

function screenFaqDetail() {
    const f = FAQ_ITEMS[STATE.faqId] || FAQ_ITEMS[0];
    return `${topBar('FAQ', { back: true })}
    <div class="gutter-x pb-8 screen-enter">
        <span class="badge bg-[#EFF6FF] text-[#2563EB]">${f.cat}</span>
        <h2 class="text-[18px] font-bold text-[#0F172A] mt-3 leading-snug">${f.q}</h2>
        <div class="card p-4 mt-4">
            <p class="text-[14px] text-[#475569] leading-relaxed">${f.a}</p>
        </div>
        <p class="text-[13px] text-[#64748B] mt-5 text-center">Was this helpful?</p>
        <div class="grid grid-cols-2 gap-3 mt-3">
            <button data-action="toast" data-msg="Thanks for your feedback!" class="btn-secondary py-3 text-[13px]">Yes</button>
            <button data-go="chat" class="btn-primary py-3 text-[13px]">Contact Us</button>
        </div>
    </div>`;
}

function screenPrivacy() {
    return contentPage('Privacy Policy', '15 January 2025', legalContent([
        ['Introduction', ['Landlord HQ Ltd ("we", "us") respects your privacy. This policy explains how we collect, use, and protect your personal data when you use the Landlord HQ mobile application and related services.', 'By using Landlord HQ, you agree to the collection and use of information in accordance with this policy.']],
        ['Information We Collect', ['We collect information you provide directly: name, email, phone number, property addresses, tenant details, and payment information.', 'We automatically collect device information, usage analytics, and log data to improve our services.']],
        ['How We Use Your Data', ['To provide and maintain the property management platform.', 'To send rent reminders, maintenance notifications, and compliance alerts.', 'To process payments and generate financial reports.', 'To improve our app and develop new features.']],
        ['Data Sharing', ['We do not sell your personal data. We may share data with service providers (payment processors, cloud hosting) under strict confidentiality agreements.', 'We may disclose data if required by law or to protect our rights.']],
        ['Data Security', ['We use industry-standard encryption (TLS/SSL) for data in transit and AES-256 for data at rest. Access is restricted to authorised personnel only.']],
        ['Your Rights', ['Under UK GDPR, you have the right to access, rectify, erase, restrict processing, and port your data. Contact privacy@landlordhq.com to exercise these rights.', 'You may withdraw consent for marketing communications at any time via Notification Settings.']],
        ['Contact Us', ['For privacy enquiries: privacy@landlordhq.com', 'Landlord HQ Ltd, 42 Baker Street, London, W1U 7AJ']],
    ]));
}

function screenTerms() {
    return contentPage('Terms & Conditions', '15 January 2025', legalContent([
        ['Agreement', ['These Terms govern your use of the Landlord HQ application operated by Landlord HQ Ltd. By accessing the app, you accept these Terms in full.']],
        ['Account Registration', ['You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials.', 'You must be at least 18 years old and legally able to enter into binding contracts.']],
        ['Acceptable Use', ['You agree not to misuse the platform, upload false information, harass other users, or attempt to gain unauthorised access to our systems.', 'Landlord HQ is a management tool — you remain solely responsible for compliance with UK landlord-tenant law.']],
        ['Subscription & Payments', ['Pro features require a paid subscription billed monthly or annually. Prices are shown before purchase and may change with 30 days notice.', 'Refunds are handled per our refund policy. Cancel anytime via Subscription settings.']],
        ['Intellectual Property', ['All content, trademarks, and software in Landlord HQ are owned by Landlord HQ Ltd. You may not copy, modify, or distribute without written permission.']],
        ['Limitation of Liability', ['Landlord HQ is provided "as is". We are not liable for indirect, incidental, or consequential damages arising from use of the service.', 'Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.']],
        ['Termination', ['We may suspend or terminate accounts that violate these Terms. You may delete your account at any time from Profile settings.']],
        ['Governing Law', ['These Terms are governed by the laws of England and Wales. Disputes shall be subject to the exclusive jurisdiction of English courts.']],
    ]));
}

function screenAbout() {
    return `${topBar('About', { back: true })}
    <div class="gutter-x pb-8 screen-enter">
        <div class="text-center py-6">
            <div class="w-20 h-20 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                <i data-lucide="building-2" class="w-10 h-10"></i>
            </div>
            <h2 class="text-[22px] font-bold text-[#0F172A] mt-4">Landlord HQ</h2>
            <p class="text-[13px] text-[#64748B] mt-1">Property management made simple</p>
            <span class="badge bg-[#F1F5F9] text-[#64748B] mt-3 inline-block">Version 1.0.0</span>
        </div>
        <div class="card p-4 space-y-3">
            <p class="text-[14px] text-[#475569] leading-relaxed">Landlord HQ helps UK property owners manage tenants, track rent, handle maintenance, and stay compliant — all from one app.</p>
            <p class="text-[14px] text-[#475569] leading-relaxed">Built for landlords who want clarity without complexity.</p>
        </div>
        <div class="card divide-y divide-[#F1F5F9] mt-4">
            ${[['globe','Website','www.landlordhq.com'],['mail','Email','hello@landlordhq.com'],['map-pin','Address','42 Baker Street, London']].map(([ic,l,v])=>`
            <div class="px-4 py-3.5 flex items-center gap-3">
                <i data-lucide="${ic}" class="w-5 h-5 text-[#64748B] shrink-0"></i>
                <div><p class="text-[11px] text-[#94A3B8]">${l}</p><p class="text-[13px] font-medium text-[#0F172A]">${v}</p></div>
            </div>`).join('')}
        </div>
        <p class="section-title mt-5">Legal</p>
        ${menuList([
            ['shield','Privacy Policy','privacy'],
            ['file-text','Terms & Conditions','terms'],
            ['circle-help','FAQ','faq'],
        ])}
        <p class="text-[12px] text-[#94A3B8] text-center mt-6">© 2025 Landlord HQ Ltd. All rights reserved.</p>
    </div>`;
}

function screenMaintenanceDetail() {
    const issues = [
        { title:'Kitchen sink leaking', prop:'12 Park Lane', priority:'High', status:'In Progress', contractor:'Plumber Pro', created:'2 hours ago', desc:'Water dripping from pipe under kitchen sink. Tenant reports it started this morning.' },
        { title:'Boiler not working', prop:'45 Queens Rd', priority:'Medium', status:'Assigned', contractor:'Heating Co.', created:'1 day ago', desc:'No hot water or heating. Boiler showing error code E119.' },
        { title:'Light flickering', prop:'88 King Street', priority:'Low', status:'New', contractor:'Electric Fix', created:'2 days ago', desc:'Living room ceiling light flickers intermittently.' },
    ];
    const m = issues[STATE.maintId] || issues[0];
    return `${topBar('Maintenance', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <img src="${IMG.maint[STATE.maintId]||IMG.maint[0]}" class="w-full h-44 rounded-xl object-cover" alt="">
        <div class="flex gap-2"><span class="badge ${m.priority==='High'?'bg-[#FEE2E2] text-[#DC2626]':m.priority==='Medium'?'bg-[#FEF3C7] text-[#D97706]':'bg-[#DBEAFE] text-[#2563EB]'}">${m.priority}</span><span class="badge bg-[#F1F5F9] text-[#64748B]">${m.status}</span></div>
        <h2 class="text-[18px] font-bold">${m.title}</h2>
        <p class="text-[13px] text-[#64748B]">${m.prop} · ${m.created}</p>
        <div class="card p-4"><p class="text-[13px] leading-relaxed text-[#475569]">${m.desc}</p></div>
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.avatar.plumber}" class="w-10 h-10 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[13px] font-semibold">${m.contractor}</p><p class="text-[11px] text-[#64748B]">Assigned contractor</p></div>
            <button data-go="chat" class="text-[13px] font-semibold text-[#2563EB]">Contact</button>
        </div>
        <div class="relative pl-6 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            ${[['Issue reported','Today 8:30 AM'],['Contractor assigned','Today 10:00 AM'],['Work in progress','Today 2:00 PM']].map(([t,d])=>`
            <div class="relative"><div class="absolute -left-6 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white"></div>
            <p class="text-[13px] font-medium">${t}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>`).join('')}
        </div>
        <button data-action="toast" data-msg="Marked as completed" class="btn-primary w-full py-3.5 text-[14px]">Mark Complete</button>
    </div>`;
}

function screenInvoiceDetail() {
    const invoices = [
        { tenant:'Sarah Johnson', prop:'12 Park Lane', amount:'£2,450', status:'Paid', due:'Feb 1, 2025', paid:'Feb 1, 2025' },
        { tenant:'David Wilson', prop:'45 Queens Rd', amount:'£1,850', status:'Overdue', due:'Feb 1, 2025', paid:'—' },
        { tenant:'Michael Lee', prop:'15 Victoria Ave', amount:'£1,950', status:'Paid', due:'Feb 1, 2025', paid:'Jan 31, 2025' },
    ];
    const inv = invoices[STATE.invoiceId] || invoices[0];
    const sc = inv.status==='Paid'?'#22C55E':'#EF4444';
    return `${topBar('Invoice', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-5 text-center">
            <p class="text-[13px] text-[#64748B]">Amount Due</p>
            <p class="text-3xl font-bold text-[#0F172A] mt-1">${inv.amount}</p>
            <span class="badge mt-3" style="background:${sc}18;color:${sc}">${inv.status}</span>
        </div>
        <div class="card divide-y divide-[#F1F5F9]">
            ${[['Tenant',inv.tenant],['Property',inv.prop],['Due Date',inv.due],['Paid Date',inv.paid],['Invoice #','INV-2025-00'+(STATE.invoiceId+1)]].map(([k,v])=>`
            <div class="p-4 flex justify-between text-[13px]"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
        </div>
        <div class="grid grid-cols-2 gap-3">
            <button data-action="toast" data-msg="Invoice downloaded" class="btn-secondary py-3 text-[13px]">Download PDF</button>
            <button data-action="toast" data-msg="Reminder sent" class="btn-primary py-3 text-[13px]">Send Reminder</button>
        </div>
    </div>`;
}

function screenInventoryRoom() {
    const rooms = [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    return `${topBar(room[0], { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="flex items-center justify-between">
            <span class="badge ${room[1]==='Good'?'bg-[#DCFCE7] text-[#16A34A]':'bg-[#FEF3C7] text-[#D97706]'}">Condition: ${room[1]}</span>
            <button data-go="edit-inventory-room" data-room="${STATE.roomId}" class="text-[13px] font-semibold text-[#2563EB]">Edit</button>
        </div>
        <div class="grid grid-cols-2 gap-2">${IMG.interior.map(src=>`<div class="aspect-square rounded-xl overflow-hidden"><img src="${src}" class="img-cover" alt=""></div>`).join('')}</div>
        <div class="card p-4 space-y-3">
            <h3 class="text-[14px] font-bold">Items</h3>
            ${[['Oven & Hob','Good'],['Fridge Freezer','Good'],['Washing Machine','Fair'],['Microwave','Good']].map(([item,c])=>`
            <div class="flex justify-between text-[13px] py-1.5 border-b border-[#F1F5F9] last:border-0"><span>${item}</span><span class="text-[#64748B]">${c}</span></div>`).join('')}
        </div>
        <div class="card p-4"><p class="text-[12px] text-[#64748B] mb-1">Notes</p><p class="text-[13px] leading-relaxed">Minor wear on worktop near sink. All appliances tested and working.</p></div>
    </div>`;
}

function screenDocumentPreview() {
    return `${topBar('Document', { back: true })}
    <div class="gutter-x pb-8 screen-enter">
        <div class="card p-6 text-center mt-2">
            <i data-lucide="file-text" class="w-16 h-16 text-[#2563EB] mx-auto"></i>
            <p class="text-[16px] font-bold mt-4">Lease Agreement</p>
            <p class="text-[13px] text-[#64748B]">12 Park Lane · PDF · 2.4 MB</p>
            <p class="text-[12px] text-[#94A3B8] mt-1">Signed Jan 15, 2024</p>
        </div>
        <div class="card mt-4 p-4 bg-[#F8FAFC] min-h-[300px] flex items-center justify-center">
            <p class="text-[13px] text-[#94A3B8]">Document preview</p>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-4">
            <button data-action="toast" data-msg="Downloading..." class="btn-secondary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="download" class="w-4 h-4"></i>Download</button>
            <button data-action="toast" data-msg="Shared" class="btn-primary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="share-2" class="w-4 h-4"></i>Share</button>
        </div>
    </div>`;
}

function screenNotificationsList() {
    const unread = NOTIFICATIONS.filter(n => n.unread).length;
    return `${topBar('Notifications', { back: true, sub: unread ? unread + ' unread' : 'All caught up' })}
    <div class="gutter-x pb-8 screen-enter">
        <div class="notif-list">${NOTIFICATIONS.map(notifRow).join('')}</div>
    </div>`;
}

function screenAddProperty() {
    return `${topBar('Add Property', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        ${photoUpload('Add property photos')}
        ${formField('Property Name', '', 'text', 'e.g. 12 Park Lane')}
        ${formField('Address', '', 'text', 'Street address')}
        ${formField('Postcode', '', 'text', 'e.g. SW1A 1AA')}
        ${formField('Monthly Rent', '', 'text', 'e.g. 2450')}
        ${formField('Bedrooms', '2', 'number')}${formField('Bathrooms', '1', 'number')}
        ${formSelect('Status', 'Occupied', ['Occupied', 'Vacant'])}
        ${saveBtn('Add Property', 'Property added successfully')}
    </div>`;
}

function screenEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    const rent = p.rent.replace(/[£,]/g, '');
    return `${topBar('Edit Property', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="relative h-[120px] rounded-xl overflow-hidden">
            <img src="${IMG.props[STATE.propertyId]}" class="img-cover" alt="">
            <button type="button" data-action="toast" data-msg="Photo updated" class="absolute bottom-2 right-2 bg-white/90 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#2563EB]">Change Photo</button>
        </div>
        ${formField('Property Name', p.name)}
        ${formField('Address', p.address)}
        ${formField('Monthly Rent', rent)}
        ${formField('Bedrooms', String(p.beds), 'number')}
        ${formField('Bathrooms', String(p.baths), 'number')}
        ${formField('Square Feet', p.sqft)}
        ${formSelect('Status', p.status, ['Occupied', 'Vacant'])}
        ${formTextarea('Notes', '', 'Property notes, access codes, etc.')}
        ${saveBtn('Save Property', 'Property updated')}
    </div>`;
}

function screenInviteTenant() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Invite Tenant', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.rent}/month · ${p.status}</p></div>
        </div>
        ${formField('First Name', '', 'text', 'Tenant first name')}
        ${formField('Last Name', '', 'text', 'Tenant last name')}
        ${formField('Email', '', 'email', 'tenant@email.com')}
        ${formField('Phone', '', 'tel', '+44 7...')}
        ${formField('Monthly Rent', p.rent.replace(/[£,]/g, ''))}
        ${formField('Lease Start', '2025-04-01', 'date')}
        ${formField('Lease End', '2026-03-31', 'date')}
        ${formTextarea('Message', 'Hi, you\'ve been invited to join as a tenant for ' + p.name + '. Please accept the invitation to get started.', 'Optional personal message')}
        ${saveBtn('Send Invitation', 'Invitation sent to tenant')}
    </div>`;
}

function screenEditTenant() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    return `${topBar('Edit Tenant', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="flex justify-center mb-1">
            <div class="relative">
                <img src="${[IMG.avatar.sarah,IMG.avatar.david,IMG.avatar.michael][STATE.tenantId]}" class="w-20 h-20 rounded-full object-cover" alt="">
                <button type="button" data-action="toast" data-msg="Photo updated" class="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center border-2 border-white"><i data-lucide="camera" class="w-4 h-4 text-white"></i></button>
            </div>
        </div>
        ${formField('First Name', t.firstName)}${formField('Last Name', t.lastName)}
        ${formField('Email', t.email, 'email')}${formField('Phone', t.phone, 'tel')}
        ${formField('Property', t.prop)}${formField('Monthly Rent', t.rent)}
        ${formField('Move-in Date', t.moveIn, 'date')}${formField('Lease End', t.leaseEnd, 'date')}
        ${formField('Emergency Contact', t.emergency)}${formField('Emergency Phone', t.emergencyPhone, 'tel')}
        ${saveBtn('Save Tenant', 'Tenant details updated')}
    </div>`;
}

function screenRescheduleInspection() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Reschedule Inspection', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-4 bg-[#EFF6FF]">
            <p class="text-[13px] font-semibold text-[#0F172A]">${p.name}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Mid-term Inspection · Currently Feb 28, 2025</p>
        </div>
        ${formField('Inspection Date', '2025-02-28', 'date')}
        ${formSelect('Time Slot', '10:00 AM', ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'])}
        ${formSelect('Type', 'Mid-term Inspection', ['Check-in', 'Mid-term Inspection', 'Check-out', 'Annual'])}
        ${formTextarea('Notes for Inspector', '', 'Access instructions, parking, tenant availability...')}
        ${formField('Notify Tenant', 'sarah.j@email.com', 'email')}
        ${saveBtn('Confirm Reschedule', 'Inspection rescheduled')}
    </div>`;
}

function screenRenewCompliance() {
    const item = COMPLIANCE_ITEMS[STATE.complianceId] || COMPLIANCE_ITEMS[0];
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Renew Certificate', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="${item[0]}" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div><p class="text-[15px] font-bold">${item[1]}</p><p class="text-[12px] text-[#64748B]">${p.name} · Current: ${item[2]}</p></div>
        </div>
        ${formField('Certificate Number', '', 'text', 'Enter certificate reference')}
        ${formField('Issue Date', '2025-01-15', 'date')}
        ${formField('Expiry Date', '2026-01-15', 'date')}
        ${formField('Issued By', '', 'text', 'Engineer / company name')}
        ${photoUpload('Upload certificate PDF/photo')}
        ${formTextarea('Notes', '', 'Additional compliance notes')}
        ${saveBtn('Save Certificate', 'Certificate renewed')}
    </div>`;
}

function screenEditInventoryRoom() {
    const rooms = [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    return `${topBar('Edit ' + room[0], { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        ${formSelect('Condition', room[1], ['Good', 'Fair', 'Poor', 'Needs Repair'])}
        ${formTextarea('Room Notes', 'Minor wear on worktop near sink. All appliances tested and working.', 'Condition notes for this room')}
        <p class="section-title">Items</p>
        ${[['Oven & Hob','Good'],['Fridge Freezer','Good'],['Washing Machine','Fair'],['Microwave','Good']].map(([item,c]) => `
        <div class="card p-3.5 flex items-center justify-between gap-3">
            <span class="text-[14px] font-medium">${item}</span>
            <select class="form-input form-select w-[120px] py-2 text-[13px]"><option ${c==='Good'?'selected':''}>Good</option><option ${c==='Fair'?'selected':''}>Fair</option><option>Poor</option></select>
        </div>`).join('')}
        ${photoUpload('Add room photos')}
        ${saveBtn('Save Room', 'Inventory updated')}
    </div>`;
}

function screenAddPaymentMethod() {
    return `${topBar('Add Payment Method', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        ${formSelect('Type', 'Debit / Credit Card', ['Debit / Credit Card', 'Bank Account'])}
        ${formField('Cardholder Name', 'John Smith')}
        ${formField('Card Number', '', 'text', '1234 5678 9012 3456')}
        <div class="grid grid-cols-2 gap-3">
            ${formField('Expiry', '08/27', 'text', 'MM/YY')}
            ${formField('CVV', '', 'text', '···')}
        </div>
        <label class="flex items-center gap-2 text-[13px] text-[#475569]"><input type="checkbox" checked class="accent-[#2563EB]"> Set as default payment method</label>
        ${saveBtn('Add Payment Method', 'Payment method added')}
    </div>`;
}

function screenEditPaymentMethod() {
    const cards = [
        { type:'Visa', last4:'4242', exp:'08/27', name:'John Smith', default:true },
        { type:'Barclays', last4:'8901', exp:'—', name:'Rent Collection', default:false },
    ];
    const c = cards[STATE.paymentId] || cards[0];
    return `${topBar('Edit Payment', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="${c.type==='Visa'?'credit-card':'landmark'}" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div><p class="text-[14px] font-semibold">${c.type} ···· ${c.last4}</p><p class="text-[12px] text-[#64748B]">${c.default ? 'Default method' : 'Bank account'}</p></div>
        </div>
        ${formField('Account Holder', c.name)}
        ${c.type === 'Visa' ? formField('Expiry Date', c.exp) + formField('Billing Postcode', 'SW1A 1AA') : formField('Sort Code', '20-00-00') + formField('Account Number', '****8901')}
        <label class="flex items-center gap-2 text-[13px] text-[#475569]"><input type="checkbox" ${c.default?'checked':''} class="accent-[#2563EB]"> Default payment method</label>
        ${saveBtn('Save Changes', 'Payment method updated')}
        <button type="button" data-action="toast" data-msg="Payment method removed" class="w-full py-3 text-[14px] font-semibold text-[#DC2626]">Remove Payment Method</button>
    </div>`;
}

function screenEditPreference() {
    const pref = PREF_OPTIONS[STATE.prefKey] || PREF_OPTIONS.language;
    return `${topBar(pref.title, { back: true })}
    <div class="gutter-x pb-8 space-y-2 screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Select your preferred ${pref.title.toLowerCase()}</p>
        <div class="card overflow-hidden">
            ${pref.options.map((opt, i) => `
            <button type="button" data-action="save" data-msg="${pref.title} updated" class="w-full flex items-center justify-between px-4 py-4 text-left ${i < pref.options.length - 1 ? 'border-b border-[#F1F5F9]' : ''} ${opt === pref.current ? 'bg-[#FAFCFF]' : ''}">
                <span class="text-[14px] font-medium text-[#0F172A]">${opt}</span>
                ${opt === pref.current ? '<i data-lucide="check" class="w-5 h-5 text-[#2563EB]"></i>' : ''}
            </button>`).join('')}
        </div>
    </div>`;
}

function screenLogMaintenance() {
    return `${topBar('Log Issue', { back: true })}
    <div class="gutter-x pb-8 space-y-4 screen-enter">
        <div><label class="form-label">Property</label>
        <button data-action="toast" data-msg="Select property" class="card p-3.5 flex items-center justify-between w-full text-left"><span class="text-[14px]">12 Park Lane</span><i data-lucide="chevron-down" class="w-4 h-4 text-[#94A3B8]"></i></button></div>
        <div><label class="form-label">Issue Title</label><input class="form-input" placeholder="Describe the issue"></div>
        <div><label class="form-label">Priority</label>
        <div class="flex gap-2">${['Low','Medium','High'].map(p=>`
        <button data-log-priority="${p}" class="tab-pill ${STATE.logPriority===p?'active':''}">${p}</button>`).join('')}</div></div>
        <div><label class="form-label">Description</label><textarea class="form-input h-24 resize-none" placeholder="Add details..."></textarea></div>
        <button data-action="toast" data-msg="Photo added" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[12px] text-[#64748B] mt-2">Add photos</p>
        </button>
        <button data-action="toast" data-msg="Issue logged successfully" class="btn-primary w-full py-3.5 text-[14px]">Submit Issue</button>
    </div>`;
}

/* ─── Render & Events ─── */
const SCREEN_MAP = {
    dashboard: screenDashboard,
    properties: screenProperties,
    'property-detail': screenPropertyDetail,
    tenants: screenTenants,
    'tenant-detail': screenTenantDetail,
    maintenance: screenMaintenance,
    'maintenance-detail': screenMaintenanceDetail,
    financial: screenFinancial,
    'invoice-detail': screenInvoiceDetail,
    messages: screenMessages,
    chat: screenChat,
    profile: screenProfile,
    'personal-info': screenPersonalInfo,
    'notifications-settings': screenNotificationsSettings,
    security: screenSecurity,
    password: screenPassword,
    preferences: screenPreferences,
    'payment-methods': screenPaymentMethods,
    'transaction-history': screenTransactionHistory,
    subscription: screenSubscription,
    'help-support': screenHelpSupport,
    faq: screenFaq,
    'faq-detail': screenFaqDetail,
    privacy: screenPrivacy,
    terms: screenTerms,
    about: screenAbout,
    'inventory-room': screenInventoryRoom,
    'document-preview': screenDocumentPreview,
    'notifications-list': screenNotificationsList,
    'add-property': screenAddProperty,
    'edit-property': screenEditProperty,
    'invite-tenant': screenInviteTenant,
    'edit-tenant': screenEditTenant,
    'reschedule-inspection': screenRescheduleInspection,
    'renew-compliance': screenRenewCompliance,
    'edit-inventory-room': screenEditInventoryRoom,
    'add-payment-method': screenAddPaymentMethod,
    'edit-payment-method': screenEditPaymentMethod,
    'edit-preference': screenEditPreference,
    'log-maintenance': screenLogMaintenance,
};

function bindImageFallbacks() {
    document.querySelectorAll('#app img').forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.onerror = function() {
            if (this.src !== IMG.fallback) this.src = IMG.fallback;
        };
    });
}

function render() {
    const focusId = document.activeElement?.dataset?.search;
    const selStart = document.activeElement?.selectionStart;
    const fn = SCREEN_MAP[STATE.screen] || screenDashboard;
    const showNav = !NO_NAV.includes(STATE.screen);
    const bodyClass = showNav ? 'screen-body with-nav' : 'screen-body no-nav';

    let content;
    if (STATE.screen === 'chat') {
        content = `<div class="screen-body no-nav" style="padding-bottom:0">${fn()}</div>`;
    } else {
        content = `<div class="${bodyClass}">${fn()}</div>`;
    }

    document.getElementById('app').innerHTML = statusBar() + content + (showNav ? bottomNav() : '') + (showNav ? fabFloat() : '') + homeIndicator() + drawer() + fabMenu() + propFilterSheet();
    lucide.createIcons();
    bindImageFallbacks();
    bindEvents();
    if (focusId) {
        const el = document.querySelector(`[data-search="${focusId}"]`);
        if (el) { el.focus(); if (selStart != null) el.setSelectionRange(selStart, selStart); }
    }
}

function handleAppClick(e) {
    const propFilter = e.target.closest('[data-prop-filter]');
    if (propFilter) { e.preventDefault(); setPropFilter(propFilter.dataset.propFilter); return; }

    const propView = e.target.closest('[data-prop-view]');
    if (propView) { e.preventDefault(); setPropertiesView(propView.dataset.propView); return; }

    const advFilter = e.target.closest('[data-adv-filter]');
    if (advFilter) { e.preventDefault(); setPropAdvanced(advFilter.dataset.advFilter, advFilter.dataset.advVal); return; }

    const maintFilter = e.target.closest('[data-maint-filter]');
    if (maintFilter) { e.preventDefault(); setMaintFilter(maintFilter.dataset.maintFilter); return; }
}

function bindEvents() {
    const app = document.getElementById('app');
    if (!app._delegationBound) {
        app.addEventListener('click', handleAppClick);
        app._delegationBound = true;
    }

    app.querySelectorAll('[data-go]').forEach(el => {
        el.onclick = (e) => {
            if (e.target.closest('[data-action]')) return;
            const screen = el.dataset.go;
            const opts = {};
            if (el.dataset.pid !== undefined) opts.propertyId = +el.dataset.pid;
            if (el.dataset.tid !== undefined) opts.tenantId = +el.dataset.tid;
            if (el.dataset.mid !== undefined) opts.maintId = +el.dataset.mid;
            if (el.dataset.iid !== undefined) opts.invoiceId = +el.dataset.iid;
            if (el.dataset.room !== undefined) opts.roomId = +el.dataset.room;
            if (el.dataset.fid !== undefined) opts.faqId = +el.dataset.fid;
            if (el.dataset.cid !== undefined) opts.complianceId = +el.dataset.cid;
            if (el.dataset.pref) opts.prefKey = el.dataset.pref;
            if (el.dataset.pmid !== undefined) opts.paymentId = +el.dataset.pmid;
            if (el.dataset.tab) opts.tab = el.dataset.tab;
            go(screen, opts);
        };
    });
    app.querySelectorAll('[data-tab]').forEach(el => {
        el.onclick = () => setTab(el.dataset.tab);
    });
    app.querySelectorAll('[data-ttab]').forEach(el => {
        el.onclick = () => setTenantTab(el.dataset.ttab);
    });
    app.querySelectorAll('[data-log-priority]').forEach(el => {
        el.onclick = () => setLogPriority(el.dataset.logPriority);
    });
    app.querySelectorAll('[data-toggle]').forEach(el => {
        el.onclick = () => toggleSwitch(el.dataset.toggle);
    });
    app.querySelectorAll('[data-search]').forEach(el => {
        el.oninput = () => setSearch(el.dataset.search, el.value);
    });
    app.querySelectorAll('[data-focus-search]').forEach(el => {
        el.onclick = () => document.querySelector(`[data-search="${el.dataset.focusSearch}"]`)?.focus();
    });
    app.querySelectorAll('[data-action="back"]').forEach(el => { el.onclick = back; });
    app.querySelectorAll('[data-action="drawer"]').forEach(el => { el.onclick = toggleDrawer; });
    app.querySelectorAll('[data-action="drawer-close"]').forEach(el => { el.onclick = toggleDrawer; });
    app.querySelectorAll('[data-action="fab"]').forEach(el => { el.onclick = toggleFab; });
    app.querySelectorAll('[data-action="toggle-prop-filters"]').forEach(el => { el.onclick = togglePropFilters; });
    app.querySelectorAll('[data-action="close-prop-filters"]').forEach(el => { el.onclick = closePropFilters; });
    app.querySelectorAll('[data-action="reset-prop-filters"]').forEach(el => { el.onclick = resetPropFilters; });
    app.querySelectorAll('[data-action="save"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); toast(el.dataset.msg || 'Saved'); back(); };
    });
    app.querySelectorAll('[data-action="toast"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); toast(el.dataset.msg || 'Done'); };
    });
    if (STATE.fab) {
        app.querySelector('.fab-menu')?.addEventListener('click', e => { if (e.target === e.currentTarget) toggleFab(); });
    }
}

render();
