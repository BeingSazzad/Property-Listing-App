/* Landlord HQ — Interactive Prototype */
const imgUrl = (id, w = 600) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85&fm=jpg`;
const avatarUrl = (seed) => `https://i.pravatar.cc/152?u=landlordhq-${seed}`;

const IMG = {
    fallback: imgUrl('1600585154526-990dced4db0d', 400),
    hero: imgUrl('1600585154526-990dced4db0d', 900),
    props: [
        imgUrl('1572125195579-03c22b0ad9cb', 800),
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
    onboarding: {
        propertiesHouse: 'assets/onboarding-house.png',
        shieldIcon: 'assets/onboarding-shield.png',
    },
};

const PROPERTIES = [
    { id: 0, name: '12 Park Lane', address: 'London, SW1A 1AA', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'Sarah Johnson', rent: '£2,450', beds: 3, baths: 2, sqft: '1,200', compliance: true },
    { id: 1, name: '45 Queens Road', address: 'London, SW2 3TR', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'David Wilson', rent: '£1,850', beds: 2, baths: 1, sqft: '890', compliance: true },
    { id: 2, name: '88 King Street', address: 'London, EC2V 8BB', status: 'Vacant', statusColor: ['#FEF3C7','#D97706'], tenant: null, rent: '£2,100', beds: 3, baths: 2, sqft: '1,050', compliance: false },
    { id: 3, name: '15 Victoria Ave', address: 'London, N1 5EH', status: 'Occupied', statusColor: ['#DCFCE7','#16A34A'], tenant: 'Michael Lee', rent: '£1,950', beds: 2, baths: 1, sqft: '920', compliance: true },
];

const STATE = {
    screen: 'splash', tab: 'overview', tenantTab: 'overview',
    propertyId: 0, tenantId: 0, maintId: 0, invoiceId: 0, roomId: 0, chatId: 0,
    propertiesView: 'list', propertiesFilter: 'all', showPropFilters: false,
    propertiesAdvanced: { rent: 'all', beds: 'any' },
    search: { properties: '', tenants: '', messages: '' },
    maintFilter: 'open', invoiceFilter: 'pending', logPriority: 'Medium',
    onboardingStep: 0, authRole: 'landlord', userRole: 'landlord', otpDigits: [], otpContext: 'signup',
    showPassword: false, showConfirmPassword: false, resetEmail: '',
    isAuthenticated: false, onboardingComplete: false, authReturnScreen: 'sign-in',
    signInOrigin: 'role-select', resetReturnScreen: 'sign-in',
    toggles: {
        'rent-reminders': true, 'maintenance-updates': true, 'compliance-alerts': true,
        'new-messages': true, 'marketing-emails': false, 'weekly-summary': true, 'biometric': true,
    },
    drawer: false, fab: false, faqId: 0, complianceId: 0, prefKey: '', paymentId: 0,
    helpReturnScreen: 'dashboard', faqReturnScreen: 'help-support',
    docReturnScreen: 'property-detail', legalReturnScreen: 'profile',
    contractorJobId: 0, contractorJobFilter: 'all', contractorJobTab: 'overview',
    tenantFilter: 'all',
};

const MAINTENANCE_ITEMS = [
    { id: 0, issue:'Kitchen sink leaking', prop:'12 Park Lane', time:'2h ago', priority:'High', contractor:'Plumber Pro', status:'open', propertyId: 0, desc:'Water dripping from pipe under kitchen sink. Tenant reports it started this morning.' },
    { id: 1, issue:'Window latch broken', prop:'88 King Street', time:'1d ago', priority:'Medium', contractor:'—', status:'open', propertyId: 2, desc:'Bedroom window latch broken — window cannot be secured. Property currently vacant.' },
    { id: 2, issue:'Damp patch in bedroom', prop:'12 Park Lane', time:'2d ago', priority:'Low', contractor:'—', status:'open', propertyId: 0, desc:'Damp patch appearing on bedroom wall near window frame.' },
    { id: 3, issue:'Boiler not working', prop:'45 Queens Rd', time:'3d ago', priority:'High', contractor:'Heating Co.', status:'progress', propertyId: 1, desc:'No hot water or heating. Boiler showing error code E119.' },
    { id: 4, issue:'Radiator not heating', prop:'15 Victoria Ave', time:'4d ago', priority:'Medium', contractor:'Heating Co.', status:'progress', propertyId: 3, desc:'Living room radiator cold while others work. Possible air lock or valve issue.' },
    { id: 5, issue:'Light flickering', prop:'15 Victoria Ave', time:'5d ago', priority:'Low', contractor:'Electric Fix', status:'done', propertyId: 3, desc:'Living room ceiling light flickering — resolved with new fitting.' },
    { id: 6, issue:'Tap replaced', prop:'45 Queens Rd', time:'1w ago', priority:'Low', contractor:'Plumber Pro', status:'done', propertyId: 1, desc:'Kitchen tap replaced. No further issues reported.' },
];

const maintItem = (id) => MAINTENANCE_ITEMS.find(m => m.id === id) || MAINTENANCE_ITEMS[0];

const LANDLORD_USER = {
    firstName: 'John', lastName: 'Smith', email: 'john@landlordhq.co.uk',
    phone: '+44 7700 900123', address: '14 Oakwood Drive, London, SW1A 2AA',
};
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
    <div class="screen-content screen-enter">
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

const TENANT_TABS = ['overview','personal','contact','emergency','property','lease','employment','identity','documents','insurance','guarantor','payments','maintenance','notes','activity'];

const TENANT_LIST = [
    { id: 0, propertyId: 0, chatId: 0, name: 'Sarah Johnson', prop: '12 Park Lane', unit: 'Flat 2A', lease: 'Jan 2024 – Jan 2026', leaseEnd: 'Jan 2026', img: IMG.avatar.sarah, status: 'active', rent: '£2,450/mo' },
    { id: 1, propertyId: 1, chatId: 2, name: 'David Wilson', prop: '45 Queens Rd', unit: 'Unit 1', lease: 'Jun 2023 – May 2025', leaseEnd: 'May 2025', img: IMG.avatar.david, status: 'active', rent: '£1,850/mo' },
    { id: 2, propertyId: 3, chatId: 4, name: 'Michael Lee', prop: '15 Victoria Ave', unit: 'Flat B', lease: 'Mar 2024 – Mar 2026', leaseEnd: 'Mar 2026', img: IMG.avatar.michael, status: 'active', rent: '£1,950/mo' },
    { id: 3, propertyId: 2, chatId: null, name: 'Emma Roberts', prop: '88 King Street', unit: 'Flat 1', lease: 'Ended Dec 2024', leaseEnd: 'Dec 2024', img: IMG.avatar.michael, status: 'inactive', rent: '—' },
];

const TENANT_MENU = [
    { group: 'Tenant Information', items: [
        ['user', 'Personal Info', 'personal'],
        ['phone', 'Contact Info', 'contact'],
        ['heart-pulse', 'Emergency Contact', 'emergency'],
        ['building-2', 'Property Info', 'property'],
        ['file-text', 'Lease Info', 'lease'],
        ['briefcase', 'Employment Info', 'employment'],
    ]},
    { group: 'Documents & Verification', items: [
        ['shield-check', 'Identity Verification', 'identity'],
        ['folder-open', 'Uploaded Documents', 'documents'],
        ['shield', 'Insurance', 'insurance'],
        ['user-check', 'Guarantor Info', 'guarantor'],
    ]},
    { group: 'Financial & Maintenance', items: [
        ['wallet', 'Payment & Ledger', 'payments'],
        ['wrench', 'Maintenance Requests', 'maintenance'],
    ]},
    { group: 'Notes & Activity', items: [
        ['sticky-note', 'Notes', 'notes'],
        ['activity', 'Activity Timeline', 'activity'],
    ]},
];

const TENANTS = [
    { id:0, propertyId:0, firstName:'Sarah', lastName:'Johnson', email:'sarah.j@email.com', phone:'+44 7700 900456', prop:'12 Park Lane', rent:'2450', moveIn:'2024-01-15', leaseEnd:'2026-01-14', emergency:'James Johnson', emergencyPhone:'+44 7700 900789' },
    { id:1, propertyId:1, firstName:'David', lastName:'Wilson', email:'david.w@email.com', phone:'+44 7700 900457', prop:'45 Queens Rd', rent:'1850', moveIn:'2023-06-01', leaseEnd:'2025-05-31', emergency:'Lisa Wilson', emergencyPhone:'+44 7700 900790' },
    { id:2, propertyId:3, firstName:'Michael', lastName:'Lee', email:'michael.lee@email.com', phone:'+44 7700 900458', prop:'15 Victoria Ave', rent:'1950', moveIn:'2024-03-10', leaseEnd:'2026-03-09', emergency:'Anna Lee', emergencyPhone:'+44 7700 900791' },
    { id:3, propertyId:2, firstName:'Emma', lastName:'Roberts', email:'emma.r@email.com', phone:'+44 7700 900459', prop:'88 King Street', rent:'2100', moveIn:'2022-01-01', leaseEnd:'2024-12-01', emergency:'—', emergencyPhone:'—' },
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
const NO_NAV = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','forgot-password','reset-verify-code','reset-password','reset-success','chat','tenant-detail','property-detail','maintenance-detail','invoice-detail','inventory-room','document-preview','personal-info','notifications-settings','security','password','preferences','payment-methods','subscription','help-support','faq','faq-detail','privacy','terms','about','add-property','log-maintenance','notifications-list','transaction-history','edit-property','invite-tenant','edit-tenant','reschedule-inspection','renew-compliance','edit-inventory-room','add-payment-method','edit-payment-method','edit-preference'];

const PRE_AUTH_SCREENS = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','contractor-invite','contractor-welcome','tenant-welcome','forgot-password','reset-verify-code','reset-password','reset-success'];
const PUBLIC_SCREENS = [...PRE_AUTH_SCREENS];

function loadAuthSession() {
    try {
        const raw = sessionStorage.getItem('lhq_auth');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.isAuthenticated) STATE.isAuthenticated = true;
        if (data.onboardingComplete) STATE.onboardingComplete = true;
        if (data.userRole) STATE.userRole = STATE.authRole = data.userRole;
    } catch (_) { /* ignore */ }
}

function saveAuthSession() {
    sessionStorage.setItem('lhq_auth', JSON.stringify({
        isAuthenticated: STATE.isAuthenticated,
        onboardingComplete: STATE.onboardingComplete,
        userRole: STATE.userRole,
    }));
}

const AUTH_ROLES = [
    { id: 'landlord', title: 'Landlord', desc: 'Manage properties & tenants', icon: 'home', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'tenant', title: 'Tenant', desc: 'Pay rent & report issues', icon: 'user', color: '#16A34A', bg: '#DCFCE7' },
    { id: 'contractor', title: 'Contractor', desc: 'Receive & complete jobs', icon: 'wrench', color: '#EA580C', bg: '#FFEDD5' },
    { id: 'admin', title: 'Admin', desc: 'Platform management', icon: 'shield', color: '#7C3AED', bg: '#EDE9FE' },
];

const SELECTABLE_ROLES = AUTH_ROLES.filter(r => r.id !== 'admin');

const getRoleHome = () => ({
    landlord: 'dashboard',
    tenant: 'tenant-dashboard',
    contractor: 'contractor-dashboard',
}[STATE.userRole] || 'dashboard');

const getRoleWelcome = () => ({
    landlord: 'welcome',
    tenant: 'tenant-welcome',
    contractor: 'contractor-welcome',
}[STATE.userRole] || 'welcome');

function finishOnboarding() {
    STATE.onboardingComplete = true;
    saveAuthSession();
    go('role-select');
}

function skipOnboarding() {
    STATE.onboardingComplete = true;
    saveAuthSession();
    go('role-select');
}

function signIn() {
    const email = document.querySelector('[data-signin-email]')?.value?.trim();
    const password = document.querySelector('[data-signin-password]')?.value || '';
    if (!email) {
        toast('Enter your email or phone');
        return;
    }
    if (password.length < 6) {
        toast('Password must be at least 6 characters');
        return;
    }
    STATE.isAuthenticated = true;
    STATE.userRole = STATE.authRole;
    STATE.showPassword = false;
    saveAuthSession();
    go(getRoleHome());
    setTimeout(() => toast('Welcome back!'), 50);
}

function markMaintComplete() {
    const item = MAINTENANCE_ITEMS.find(m => m.id === STATE.maintId);
    if (item && item.status !== 'done') item.status = 'done';
    toast('Issue marked as completed');
    back();
}

function completeSignup() {
    STATE.isAuthenticated = true;
    STATE.userRole = STATE.authRole;
    STATE.otpDigits = [];
    saveAuthSession();
    go(getRoleWelcome());
}

function enterApp(targetScreen) {
    const screen = targetScreen || getRoleHome();
    go(screen);
}

const ONBOARDING_SLIDES = [
    {
        title: 'Manage Properties Effortlessly',
        body: 'Add properties, manage tenants, track rent and keep everything organized in one place.',
        art: 'properties',
    },
    {
        title: 'Stay on Top of Maintenance',
        body: 'Report issues, assign contractors, track progress and maintain hassle-free.',
        art: 'maintenance',
    },
    {
        title: 'Never Miss Important Things',
        body: 'Smart reminders for certificates, inspections, rent, and more.',
        art: 'reminders',
    },
];

function setOnboardingStep(step) { STATE.onboardingStep = step; render(); }
function nextOnboarding() {
    if (STATE.onboardingStep < ONBOARDING_SLIDES.length - 1) {
        STATE.onboardingStep++;
        render();
    } else finishOnboarding();
}
function setAuthRole(role) { STATE.authRole = role; render(); }
function togglePassword() { STATE.showPassword = !STATE.showPassword; render(); }
function toggleConfirmPassword() { STATE.showConfirmPassword = !STATE.showConfirmPassword; render(); }
function otpPress(key) {
    const digits = [...STATE.otpDigits];
    if (key === 'back') digits.pop();
    else if (digits.length < 6) digits.push(key);
    STATE.otpDigits = digits;
    if (digits.length === 6) {
        setTimeout(() => {
            if (STATE.otpContext === 'reset') go('reset-password');
            else completeSignup();
        }, 400);
    } else render();
}

function sendResetCode() {
    const input = document.querySelector('[data-reset-email]');
    if (input) STATE.resetEmail = input.value.trim();
    const email = STATE.resetEmail.trim();
    if (!email) {
        toast('Enter your email address');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast('Enter a valid email address');
        return;
    }
    STATE.otpContext = 'reset';
    STATE.otpDigits = [];
    const onVerify = STATE.screen === 'reset-verify-code';
    if (!onVerify) go('reset-verify-code');
    else render();
    setTimeout(() => toast(onVerify ? 'New code sent' : 'Verification code sent'), 50);
}

function verifyResetCode() {
    if (STATE.otpDigits.length < 6) {
        toast('Enter the 6-digit code');
        return;
    }
    go('reset-password');
}

const maskEmail = (email) => {
    if (!email || !email.includes('@')) return 'your email';
    const [user, domain] = email.split('@');
    const masked = user.length <= 2 ? `${user[0]}*` : `${user.slice(0, 2)}${'*'.repeat(Math.min(user.length - 2, 4))}`;
    return `${masked}@${domain}`;
};

const authStepIndicator = (step, total = 3) => `
<div class="auth-steps">
    <div class="auth-step-track">
        ${Array.from({ length: total }, (_, i) => `<span class="auth-step ${i < step ? 'done' : ''} ${i === step - 1 ? 'active' : ''}"></span>`).join('')}
    </div>
    <p class="auth-step-label">Step ${step} of ${total}</p>
</div>`;

const authStepComplete = () => `
<div class="auth-steps">
    <div class="auth-step-track">
        ${[1, 2, 3].map(() => `<span class="auth-step done"></span>`).join('')}
    </div>
    <p class="auth-step-label">All steps complete</p>
</div>`;

const otpBoxesHtml = (digits) => `
<div class="otp-boxes">
    ${Array.from({ length: 6 }, (_, i) => `<div class="otp-box ${digits[i] ? 'filled' : ''}">${digits[i] || ''}</div>`).join('')}
</div>`;

const otpKeypadHtml = () => {
    const keys = ['1','2','3','4','5','6','7','8','9','','0','back'];
    return `<div class="otp-keypad" style="padding-bottom:calc(var(--safe-bottom) + 12px)">
        ${keys.map(k => k === '' ? '<span class="otp-key otp-key-empty"></span>' :
            k === 'back' ? `<button type="button" data-action="otp-key" data-key="back" class="otp-key"><i data-lucide="delete" class="w-5 h-5"></i></button>` :
            `<button type="button" data-action="otp-key" data-key="${k}" class="otp-key">${k}</button>`).join('')}
    </div>`;
};

const passwordRequirementsHtml = () => `
<div class="pwd-req-card">
    <p class="pwd-req-title">Password must include:</p>
    ${[
        ['8+ characters', true],
        ['One number', true],
        ['One uppercase letter', false],
    ].map(([label, met]) => `
    <div class="pwd-req-row ${met ? 'met' : ''}">
        <i data-lucide="${met ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
        <span>${label}</span>
    </div>`).join('')}
</div>`;

function onboardingArt(type) {
    if (type === 'properties') return `
        <div class="onboarding-illus-props">
            <div class="ob-props-gradient">
                <div class="ob-props-rent-card">
                    <p class="ob-props-rent-amount">£24,560</p>
                    <p class="ob-props-rent-label">Rent Collected</p>
                </div>
                <div class="ob-props-shield">
                    <img src="${IMG.onboarding.shieldIcon}" alt="" class="ob-props-shield-icon">
                </div>
            </div>
            <div class="ob-props-house-wrap">
                <img src="${IMG.onboarding.propertiesHouse}" alt="" class="ob-props-house">
            </div>
        </div>`;
    if (type === 'maintenance') return `
        <div class="onboarding-illus-maint">
            <div class="ob-maint-list">
                ${[
                    [IMG.avatar.sarah, '#22C55E'],
                    [IMG.avatar.david, '#EF4444'],
                    [IMG.avatar.michael, '#A855F7'],
                ].map(([src, dot]) => `
                <div class="ob-maint-row">
                    <img src="${src}" alt="" class="ob-maint-avatar">
                    <div class="ob-maint-card">
                        <span class="ob-maint-dot" style="background:${dot}"></span>
                        <div class="ob-maint-lines">
                            <span class="ob-maint-line ob-maint-line-lg"></span>
                            <span class="ob-maint-line ob-maint-line-sm"></span>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
            <div class="ob-maint-bell-card">
                <i data-lucide="bell" class="w-5 h-5 text-[#94A3B8]"></i>
                <span class="ob-maint-bell-badge">3</span>
            </div>
            <div class="ob-maint-wrench-btn">
                <i data-lucide="wrench" class="w-11 h-11 text-white"></i>
            </div>
        </div>`;
    return `
        <div class="onboarding-illus-remind">
            <div class="ob-remind-glow"></div>
            <div class="ob-remind-calendar">
                <div class="ob-remind-cal-rings">
                    <span></span><span></span>
                </div>
                <div class="ob-remind-cal-header"></div>
                <div class="ob-remind-cal-grid">
                    ${Array.from({ length: 12 }, () => '<span></span>').join('')}
                </div>
            </div>
            <div class="ob-remind-bell">
                <i data-lucide="bell" class="w-5 h-5 text-white"></i>
            </div>
            <div class="ob-remind-card">
                <div class="ob-remind-item">
                    <div class="ob-remind-icon ob-remind-icon-red"><i data-lucide="flame" class="w-4 h-4"></i></div>
                    <div class="ob-remind-copy">
                        <p class="ob-remind-title">Gas Certificate</p>
                        <p class="ob-remind-sub">Expires in 5 days</p>
                    </div>
                </div>
                <div class="ob-remind-item">
                    <div class="ob-remind-icon ob-remind-icon-blue"><i data-lucide="search" class="w-4 h-4"></i></div>
                    <div class="ob-remind-copy">
                        <p class="ob-remind-title">Inspection</p>
                        <p class="ob-remind-sub">In 10 days</p>
                    </div>
                </div>
                <div class="ob-remind-item">
                    <div class="ob-remind-icon ob-remind-icon-green"><i data-lucide="circle-dollar-sign" class="w-4 h-4"></i></div>
                    <div class="ob-remind-copy">
                        <p class="ob-remind-title">Rent Review</p>
                        <p class="ob-remind-sub">In 30 days</p>
                    </div>
                </div>
            </div>
        </div>`;
}

function resetPasswordComplete() {
    const pw = document.querySelector('[data-reset-password]')?.value || '';
    const confirm = document.querySelector('[data-reset-confirm]')?.value || '';
    if (pw.length < 8) {
        toast('Password must be at least 8 characters');
        return;
    }
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) {
        toast('Include an uppercase letter and a number');
        return;
    }
    if (pw !== confirm) {
        toast('Passwords do not match');
        return;
    }
    STATE.showPassword = false;
    STATE.showConfirmPassword = false;
    go('reset-success');
}

function resetSuccessDone() {
    STATE.otpDigits = [];
    STATE.otpContext = 'signup';
    STATE.showPassword = false;
    STATE.showConfirmPassword = false;
    go('sign-in');
    setTimeout(() => toast('Sign in with your new password'), 50);
}

const appLogo = () => `<div class="auth-mini-logo"><i data-lucide="home" class="w-5 h-5"></i></div>`;

const authTopbar = (showLogo = false) => `
<div class="auth-topbar">
    <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
    ${showLogo ? appLogo() : '<span></span>'}
    <span style="width:40px"></span>
</div>`;

function screenSplash() {
    return `
    <div class="splash-screen" data-action="splash-continue">
        <div class="splash-content">
            <div class="splash-logo"><i data-lucide="home" class="w-9 h-9"></i></div>
            <h1 class="splash-title">Landlord HQ</h1>
            <p class="splash-tagline">All your properties. All in one place.</p>
        </div>
        <img src="${imgUrl('1600607687939-ce8a6c25118c', 800)}" class="splash-photo" alt="">
    </div>`;
}

function screenOnboarding() {
    const slide = ONBOARDING_SLIDES[STATE.onboardingStep];
    const isLast = STATE.onboardingStep === ONBOARDING_SLIDES.length - 1;
    return `
    <div class="onboarding-screen">
        <button type="button" data-action="onboarding-skip" class="onboarding-skip">Skip</button>
        <div class="onboarding-art">${onboardingArt(slide.art)}</div>
        <div class="onboarding-text">
            <h2 class="onboarding-title">${slide.title}</h2>
            <p class="onboarding-body">${slide.body}</p>
        </div>
        <div class="onboarding-footer">
            <div class="onboarding-dots">
                ${ONBOARDING_SLIDES.map((_, i) => `<button type="button" data-action="onboarding-dot" data-step="${i}" class="onboarding-dot ${i === STATE.onboardingStep ? 'active' : ''}"></button>`).join('')}
            </div>
            <button type="button" data-action="onboarding-next" class="btn-auth btn-auth-primary">${isLast ? 'Get Started' : 'Next'}</button>
        </div>
    </div>`;
}

function screenRoleSelect() {
    return `
    <div class="auth-screen">
        <div class="auth-content" style="padding-top:32px">
            <h1 class="auth-heading">Choose Your Role</h1>
            <p class="auth-sub">Select the role that best describes you to get started.</p>
            <div class="stack" style="margin-top:28px">
                ${SELECTABLE_ROLES.map(r => `
                <button type="button" data-action="set-role" data-role="${r.id}" class="role-card ${STATE.authRole === r.id ? 'selected' : ''}">
                    <div class="role-card-icon" style="background:${r.bg};color:${r.color}">
                        <i data-lucide="${r.icon}" class="w-6 h-6"></i>
                    </div>
                    <div class="role-card-body">
                        <p class="role-card-title">${r.title}</p>
                        <p class="role-card-desc">${r.desc}</p>
                    </div>
                    <div class="role-radio"><div class="role-radio-dot"></div></div>
                </button>`).join('')}
            </div>
            <button type="button" data-action="role-continue" class="btn-auth btn-auth-primary" style="margin-top:32px">Continue</button>
            <p class="auth-footer-text" style="margin-top:20px">Contractor invited? <button type="button" data-go="contractor-invite">Open invitation</button></p>
            <p class="auth-footer-text" style="margin-top:12px">Don't have an account? <button type="button" data-go="sign-up">Sign Up</button></p>
        </div>
    </div>`;
}

function screenSignIn() {
    const pwType = STATE.showPassword ? 'text' : 'password';
    const showBack = STATE.signInOrigin !== 'logout';
    return `
    <div class="auth-screen">
        <div class="auth-topbar">
            ${showBack ? '<button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>' : '<span style="width:40px"></span>'}
            ${appLogo()}
            <span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <h1 class="auth-heading">Welcome Back!</h1>
            <p class="auth-sub">Sign in to continue to Landlord HQ</p>
            <div class="auth-form">
                <div class="auth-field">
                    <label>Email or Phone</label>
                    <input type="text" data-signin-email class="auth-input" placeholder="Enter email or phone" autocomplete="username">
                </div>
                <div class="auth-field">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-signin-password class="auth-input" placeholder="Enter password" style="padding-right:44px" autocomplete="current-password">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <button type="button" data-go="forgot-password" class="auth-link">Forgot Password?</button>
                <button type="button" data-action="sign-in" class="btn-auth btn-auth-primary">Sign In</button>
            </div>
            <div class="auth-divider">or continue with</div>
            <div class="auth-social-row">
                <button type="button" data-action="sign-in" data-msg="Signed in with Google" class="auth-social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                </button>
                <button type="button" data-action="sign-in" data-msg="Signed in with Apple" class="auth-social-btn">
                    <i data-lucide="apple" class="w-5 h-5"></i> Apple
                </button>
            </div>
            <p class="auth-footer-text">Don't have an account? <button type="button" data-go="sign-up">Sign Up</button></p>
        </div>
    </div>`;
}

function screenSignUp() {
    const pwType = STATE.showPassword ? 'text' : 'password';
    return `
    <div class="auth-screen">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <span></span><span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <h1 class="auth-heading">Create Your Account</h1>
            <p class="auth-sub">Join Landlord HQ and manage your properties with ease.</p>
            <div class="auth-form">
                <div class="auth-field"><label>Full Name</label><input type="text" class="auth-input" placeholder="Enter your full name"></div>
                <div class="auth-field"><label>Email</label><input type="email" class="auth-input" placeholder="Enter your email address"></div>
                <div class="auth-field">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" class="auth-input" placeholder="Create password" style="padding-right:44px">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="auth-field"><label>Confirm Password</label><input type="password" class="auth-input" placeholder="Confirm password"></div>
                <button type="button" data-action="start-signup" class="btn-auth btn-auth-primary">Sign Up</button>
            </div>
            <div class="auth-divider">or continue with</div>
            <div class="auth-social-row">
                <button type="button" data-action="start-signup" class="auth-social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                </button>
                <button type="button" data-action="start-signup" class="auth-social-btn">
                    <i data-lucide="apple" class="w-5 h-5"></i> Apple
                </button>
            </div>
            <p class="auth-footer-text">Prefer phone? <button type="button" data-go="sign-up-phone">Sign up with phone</button></p>
            <p class="auth-footer-text" style="margin-top:12px">Already have an account? <button type="button" data-go="sign-in">Sign In</button></p>
        </div>
    </div>`;
}

function screenForgotPassword() {
    return `
    <div class="auth-screen">
        ${authTopbar()}
        <div class="auth-content">
            ${authStepIndicator(1)}
            <div class="auth-icon-wrap">
                <i data-lucide="mail" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Forgot Password?</h1>
            <p class="auth-sub">Enter the email linked to your account. We'll send a 6-digit verification code — no reset links needed.</p>
            <div class="auth-form">
                <div class="auth-field">
                    <label>Email address</label>
                    <input type="email" data-reset-email class="auth-input" placeholder="john@email.com" value="${STATE.resetEmail}" autocomplete="email">
                </div>
                <button type="button" data-action="send-reset-code" class="btn-auth btn-auth-primary">Send Verification Code</button>
            </div>
            <p class="auth-security-note"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Code expires in 10 minutes</p>
            <p class="auth-footer-text">Remember your password? <button type="button" data-go="sign-in" data-reset-return="sign-in">Sign In</button></p>
        </div>
    </div>`;
}

function screenResetVerifyCode() {
    const digits = STATE.otpDigits;
    const email = maskEmail(STATE.resetEmail);
    const codeComplete = digits.length === 6;
    return `
    <div class="auth-screen auth-screen-keypad" style="padding-bottom:0">
        ${authTopbar()}
        <div class="auth-content auth-content-otp">
            ${authStepIndicator(2)}
            <div class="auth-icon-wrap">
                <i data-lucide="key-round" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Enter Verification Code</h1>
            <p class="auth-sub">We sent a 6-digit code to<br><strong>${email}</strong></p>
            ${otpBoxesHtml(digits)}
            <button type="button" data-action="verify-reset-code" class="btn-auth btn-auth-primary ${codeComplete ? '' : 'btn-auth-disabled'}" ${codeComplete ? '' : 'disabled'}>Verify & Continue</button>
            <p class="otp-resend">Didn't get it? <button type="button" data-action="send-reset-code">Resend code</button> · <span class="otp-timer">00:59</span></p>
            <p class="auth-security-note"><i data-lucide="lock" class="w-3.5 h-3.5"></i> Never share this code with anyone</p>
            <p class="auth-footer-text">Wrong email? <button type="button" data-go="forgot-password">Change email</button></p>
        </div>
        ${otpKeypadHtml()}
    </div>`;
}

function screenResetPassword() {
    const pwType = STATE.showPassword ? 'text' : 'password';
    const confirmType = STATE.showConfirmPassword ? 'text' : 'password';
    return `
    <div class="auth-screen">
        ${authTopbar()}
        <div class="auth-content">
            ${authStepIndicator(3)}
            <div class="auth-icon-wrap">
                <i data-lucide="key-round" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Create New Password</h1>
            <p class="auth-sub">Choose a strong password you haven't used on Landlord HQ before.</p>
            <div class="auth-form">
                <div class="auth-field">
                    <label>New password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-reset-password class="auth-input" placeholder="Enter new password" style="padding-right:44px">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="auth-field">
                    <label>Confirm password</label>
                    <div class="auth-input-wrap">
                        <input type="${confirmType}" data-reset-confirm class="auth-input" placeholder="Re-enter new password" style="padding-right:44px">
                        <button type="button" data-action="toggle-confirm-password" class="auth-input-toggle"><i data-lucide="${STATE.showConfirmPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                ${passwordRequirementsHtml()}
                <button type="button" data-action="reset-password-done" class="btn-auth btn-auth-primary">Update Password</button>
            </div>
            <p class="auth-security-note"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Your password is encrypted and stored securely</p>
        </div>
    </div>`;
}

function screenResetSuccess() {
    return `
    <div class="auth-screen">
        <div class="auth-content auth-content-centered">
            ${authStepComplete()}
            <div class="auth-icon-wrap auth-icon-wrap-success auth-icon-wrap-lg">
                <i data-lucide="circle-check" class="w-8 h-8 text-[#059669]"></i>
            </div>
            <h1 class="auth-heading">Password Updated!</h1>
            <p class="auth-sub">Your password has been reset successfully. You can now sign in with your new password.</p>
            <button type="button" data-action="reset-success-done" class="btn-auth btn-auth-primary" style="margin-top:28px">Continue to Sign In</button>
            <p class="auth-footer-text" style="margin-top:20px"><i data-lucide="shield-check" class="w-3.5 h-3.5 inline -mt-0.5"></i> Secured with end-to-end encryption</p>
        </div>
    </div>`;
}

function screenSignUpPhone() {
    return `
    <div class="auth-screen">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <span></span><span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <h1 class="auth-heading">Sign Up with Phone</h1>
            <p class="auth-sub">We'll send you a verification code to confirm your number.</p>
            <div class="auth-form">
                <div class="auth-field">
                    <label>Phone Number</label>
                    <div class="phone-input-row">
                        <div class="phone-country"><span>🇧🇩</span> +880</div>
                        <input type="tel" class="auth-input" placeholder="Enter phone number" style="flex:1">
                    </div>
                </div>
                <button type="button" data-go="verify-otp" class="btn-auth btn-auth-primary">Continue</button>
            </div>
        </div>
    </div>`;
}

function screenVerifyOtp() {
    const digits = STATE.otpDigits;
    return `
    <div class="auth-screen" style="padding-bottom:0">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <span></span><span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <h1 class="auth-heading">Verify Your Number</h1>
            <p class="auth-sub">Enter the 6-digit code sent to<br><strong>+880 1712 345678</strong></p>
            ${otpBoxesHtml(digits)}
            <p class="otp-resend">Resend code in <button type="button" data-action="toast" data-msg="Code resent">00:25</button></p>
        </div>
        ${otpKeypadHtml()}
    </div>`;
}

function screenWelcome() {
    return `
    <div class="auth-screen" style="padding-bottom:0">
        <div class="welcome-header">
            <h1 class="welcome-greeting">Welcome, John! 👋</h1>
            <button type="button" data-go="notifications-list" class="top-icon-btn relative">
                <i data-lucide="bell" class="w-5 h-5"></i>
                <span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
        </div>
        <div class="auth-content" style="padding-top:0">
            <button type="button" data-action="enter-app" class="portal-card portal-card-landlord">
                <p class="portal-card-title">Landlord Dashboard</p>
                <p class="portal-card-sub">Manage properties, tenants & finances</p>
                <i data-lucide="building-2" class="portal-card-icon w-20 h-20"></i>
            </button>
            <div class="card p-4 text-left">
                <p class="text-[13px] font-semibold text-[#0F172A]">You're all set</p>
                <p class="text-[12px] text-[#64748B] mt-2 leading-relaxed">Your landlord account is ready. Tap the dashboard above to view your portfolio, tenants, and maintenance.</p>
            </div>
        </div>
        <div class="welcome-nav">
            <button type="button" data-action="enter-app" class="welcome-nav-btn active"><i data-lucide="home" class="w-5 h-5"></i>Home</button>
            <button type="button" data-action="enter-app" data-go-after="properties" class="welcome-nav-btn"><i data-lucide="building-2" class="w-5 h-5"></i>Properties</button>
            <button type="button" data-action="enter-app" data-go-after="messages" class="welcome-nav-btn"><i data-lucide="message-square" class="w-5 h-5"></i>Messages</button>
            <button type="button" data-action="enter-app" data-go-after="profile" class="welcome-nav-btn"><i data-lucide="user" class="w-5 h-5"></i>Profile</button>
        </div>
    </div>`;
}

function roleContinue() {
    if (STATE.authRole === 'admin') {
        toast('Admin access is managed separately');
        return;
    }
    go('sign-in');
}

function go(screen, opts = {}) {
    const from = STATE.screen;
    if (screen === 'sign-up' && ['sign-in', 'role-select'].includes(from)) {
        STATE.authReturnScreen = from;
    }
    if (screen === 'sign-in' && from === 'role-select') {
        STATE.signInOrigin = 'role-select';
    }
    if (screen === 'forgot-password' && from === 'sign-in') {
        STATE.resetReturnScreen = 'sign-in';
    }
    if (screen === 'help-support') STATE.helpReturnScreen = from;
    if (screen === 'faq') STATE.faqReturnScreen = from;
    if (screen === 'document-preview') STATE.docReturnScreen = from;
    if (['privacy', 'terms'].includes(screen)) STATE.legalReturnScreen = from;
    if (!PUBLIC_SCREENS.includes(screen) && !STATE.isAuthenticated) {
        screen = 'sign-in';
        opts = {};
    }
    Object.assign(STATE, opts, { screen, drawer: false, fab: false, showPropFilters: false });
    if (screen === 'verify-otp') {
        STATE.otpDigits = [];
        STATE.otpContext = 'signup';
    }
    if (screen === 'reset-verify-code') STATE.otpDigits = [];
    if (screen === 'property-detail') STATE.tab = opts.tab ?? 'overview';
    if (screen === 'maintenance-detail') STATE.maintId = opts.maintId ?? STATE.maintId ?? 0;
    if (screen === 'chat') STATE.chatId = opts.chatId ?? STATE.chatId ?? 0;
    if (screen === 'contractor-job-detail') STATE.contractorJobId = opts.jobId ?? STATE.contractorJobId ?? 0;
    if (opts.jobTab) STATE.contractorJobTab = opts.jobTab;
    if (screen === 'tenant-detail') {
        STATE.tenantId = opts.tenantId ?? STATE.tenantId;
        STATE.tenantTab = opts.tenantTab ?? (opts.tenantId !== undefined ? 'overview' : STATE.tenantTab || 'overview');
    }
    if (screen === 'faq-detail') STATE.faqId = opts.faqId ?? 0;
    if (opts.complianceId !== undefined) STATE.complianceId = opts.complianceId;
    if (opts.prefKey) STATE.prefKey = opts.prefKey;
    if (opts.paymentId !== undefined) STATE.paymentId = opts.paymentId;
    render();
}

function splashContinue() {
    clearTimeout(render._splashTimer);
    if (STATE.isAuthenticated) go(getRoleHome());
    else if (STATE.onboardingComplete) go('role-select');
    else go('onboarding');
}

function back() {
    if (STATE.screen === 'property-detail' && STATE.tab !== 'overview') {
        setTab('overview');
        return;
    }
    if (STATE.screen === 'welcome') return;
    if (STATE.screen === 'sign-up') {
        go(STATE.authReturnScreen || 'sign-in');
        return;
    }
    if (STATE.screen === 'sign-in') {
        if (STATE.signInOrigin === 'logout') return;
        go('role-select');
        return;
    }
    if (STATE.screen === 'forgot-password') {
        go(STATE.resetReturnScreen || 'sign-in');
        return;
    }
    if (STATE.screen === 'help-support') {
        go(STATE.helpReturnScreen || 'dashboard');
        return;
    }
    if (STATE.screen === 'faq') {
        go(STATE.faqReturnScreen || 'help-support');
        return;
    }
    if (STATE.screen === 'document-preview') {
        if (STATE.docReturnScreen === 'tenant-detail') {
            go('tenant-detail', { tenantId: STATE.tenantId, tenantTab: STATE.tenantTab || 'lease' });
        } else {
            go('property-detail', { propertyId: STATE.propertyId, tab: 'documents' });
        }
        return;
    }
    if (STATE.screen === 'privacy' || STATE.screen === 'terms') {
        go(STATE.legalReturnScreen || 'profile');
        return;
    }
    if (STATE.screen === 'reset-success') return;
    if (STATE.screen === 'contractor-welcome' || STATE.screen === 'tenant-welcome') return;
    if (STATE.screen === 'tenant-detail' && STATE.tenantTab !== 'overview') {
        setTenantTab('overview');
        return;
    }
    const defaultHome = getRoleHome();
    const map = {
        'property-detail':'properties','tenant-detail':'tenants','chat':'messages',
        'maintenance-detail':'maintenance','invoice-detail':'financial',
        'inventory-room':'property-detail',
        'personal-info':'profile','notifications-settings':'profile',
        'security':'profile','password':'profile','preferences':'profile',
        'payment-methods':'profile','subscription':'profile','transaction-history':'profile',
        'faq-detail':'faq','about':'profile',
        'edit-property':'property-detail','invite-tenant':'property-detail',
        'edit-tenant':'tenant-detail','reschedule-inspection':'property-detail',
        'renew-compliance':'property-detail','edit-inventory-room':'inventory-room',
        'add-payment-method':'payment-methods','edit-payment-method':'payment-methods',
        'edit-preference':'preferences',
        'add-property':'properties','log-maintenance':'maintenance','notifications-list':'dashboard',
        'financial':'dashboard',
        'sign-up-phone':'sign-up',
        'verify-otp':'sign-up-phone',
        'reset-verify-code':'forgot-password','reset-password':'reset-verify-code',
        'reset-success':'sign-in',
        'contractor-job-detail':'contractor-jobs','contractor-schedule':'contractor-job-detail',
        'contractor-work':'contractor-job-detail','contractor-documents':'contractor-job-detail',
        'contractor-company':'contractor-profile','contractor-invite':'role-select',
    };
    const tabMap = {
        'inventory-room':'inventory',
        'edit-property':'overview', 'invite-tenant':'tenant',
        'reschedule-inspection':'inspection', 'renew-compliance':'compliance',
        'contractor-work':'progress', 'contractor-documents':'documents',
    };
    const target = map[STATE.screen] || defaultHome;
    const opts = {};
    if (tabMap[STATE.screen]) {
        opts.tab = tabMap[STATE.screen];
        if (STATE.screen.startsWith('contractor-')) opts.jobTab = tabMap[STATE.screen];
        else opts.propertyId = STATE.propertyId;
    }
    if (['contractor-job-detail','contractor-schedule','contractor-work','contractor-documents'].includes(STATE.screen)) {
        opts.jobId = STATE.contractorJobId;
    }
    if (['edit-tenant'].includes(STATE.screen)) opts.tenantId = STATE.tenantId;
    if (['edit-inventory-room'].includes(STATE.screen)) opts.roomId = STATE.roomId;
    if (STATE.screen === 'edit-preference') opts.prefKey = STATE.prefKey;
    if (['edit-payment-method'].includes(STATE.screen)) opts.paymentId = STATE.paymentId;
    go(target, opts);
}

function setTab(tab) { STATE.tab = tab; render(); }
function setTenantTab(tab) { STATE.tenantTab = tab; render(); }
function setTenantFilter(f) { STATE.tenantFilter = f; render(); }
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
function setInvoiceFilter(f) { STATE.invoiceFilter = f; render(); }
function setLogPriority(p) { STATE.logPriority = p; render(); }
function setSearch(key, val) { STATE.search[key] = val; render(); }
function toggleSwitch(key) { STATE.toggles[key] = !STATE.toggles[key]; render(); }

function toggleDrawer() { STATE.drawer = !STATE.drawer; if (STATE.drawer) STATE.showPropFilters = false; render(); }
function toggleFab() { STATE.fab = !STATE.fab; render(); }

function logout() {
    STATE.isAuthenticated = false;
    STATE.signInOrigin = 'logout';
    STATE.resetReturnScreen = 'sign-in';
    STATE.drawer = false;
    STATE.fab = false;
    STATE.otpDigits = [];
    STATE.showPassword = false;
    saveAuthSession();
    go('sign-in');
    setTimeout(() => toast('Signed out successfully'), 50);
}

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
<div class="screen-header">
    <div class="sub-header-row">
        <div class="sub-header-left">
            <button data-action="back" class="back-btn">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <div class="min-w-0">
                <h1 class="sub-header-title">${title}</h1>
                ${opts.sub ? `<p class="sub-header-sub">${opts.sub}</p>` : ''}
            </div>
        </div>
        ${opts.search ? `<button data-focus-search="${opts.searchKey || 'main'}" class="top-icon-btn shrink-0 w-10 h-10 rounded-full border border-[#E2E8F0] bg-white"><i data-lucide="search" class="w-[18px] h-[18px]"></i></button>` : ''}
    </div>
</div>`;
    }
    return `
<div class="screen-header">
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
        <h1 class="page-title">${title}</h1>
        ${opts.sub ? `<p class="page-subtitle">${opts.sub}</p>` : ''}
    </div>
</div>`;
};

const buildingSvg = `<svg class="dash-hero-art" viewBox="0 0 120 100" fill="none"><rect x="50" y="18" width="38" height="72" rx="4" fill="#93C5FD" opacity=".7"/><rect x="12" y="38" width="32" height="52" rx="4" fill="#BFDBFE" opacity=".9"/><rect x="58" y="28" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="70" y="28" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="58" y="44" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="70" y="44" width="7" height="9" rx="1" fill="white" opacity=".8"/><rect x="20" y="48" width="6" height="8" rx="1" fill="white" opacity=".7"/><rect x="30" y="48" width="6" height="8" rx="1" fill="white" opacity=".7"/></svg>`;

const dashGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const dashDateLabel = () =>
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

const dashStatCard = ({ go, variant, icon, label, value, pill }) => `
<button data-go="${go}" class="dash-stat dash-stat--${variant}">
    <div class="dash-stat-row">
        <div class="dash-stat-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></div>
        <div class="dash-stat-info">
            <p class="dash-stat-label">${label}</p>
            <p class="dash-stat-value">${value}</p>
        </div>
        ${pill ? `<span class="dash-stat-pill">${pill}</span>` : ''}
    </div>
</button>`;

const dashboardHeader = () => `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn">
            <i data-lucide="menu" class="w-[22px] h-[22px]"></i>
        </button>
        <button data-go="notifications-list" class="top-icon-btn relative">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            <span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>
    </div>
    <div class="dash-greeting-row">
        <img src="${IMG.avatar.john}" class="dash-avatar" alt="">
        <div>
            <p class="dash-greeting">${dashGreeting()}, John</p>
            <p class="dash-date">${dashDateLabel()}</p>
        </div>
    </div>
</div>`;

const CONVERSATIONS = [
    { id: 0, img: IMG.avatar.sarah, name: 'Sarah Johnson', sub: '12 Park Lane', preview: 'Hi, the maintenance issue has been fixed!', time: '10:30 AM', unread: 2, online: true, messages: [
        { type: 'in', text: 'Hi, the kitchen sink is leaking again. Could you send someone?', time: '10:15 AM' },
        { type: 'out', text: "Thanks Sarah, I'll send a plumber today before 2pm.", time: '10:20 AM · Sent' },
        { type: 'in', text: 'The maintenance issue has been fixed! Thank you 🙏', time: '10:30 AM' },
    ]},
    { id: 1, img: IMG.avatar.plumber, name: 'Plumber Pro', sub: 'Regarding job #M-125', preview: 'Please let me know when you are free for access.', time: '9:15 AM', unread: 1, online: true, messages: [
        { type: 'in', text: 'Please let me know when you are free for access to 12 Park Lane.', time: '9:15 AM' },
        { type: 'out', text: 'Tenant will be home after 1 PM today.', time: '9:20 AM · Sent' },
    ]},
    { id: 2, img: IMG.avatar.david, name: 'David Wilson', sub: '45 Queens Road', preview: 'Thanks for the update.', time: 'Yesterday', unread: 0, online: false, messages: [
        { type: 'in', text: 'Is the boiler repair still scheduled for this week?', time: 'Yesterday' },
        { type: 'out', text: 'Yes, Heating Co. will visit Thursday morning.', time: 'Yesterday · Sent' },
        { type: 'in', text: 'Thanks for the update.', time: 'Yesterday' },
    ]},
    { id: 3, img: IMG.avatar.electric, name: 'Electric Fixers', sub: 'Job completed — #M-120', preview: 'The issue has been fixed.', time: 'Yesterday', unread: 0, online: false, messages: [
        { type: 'in', text: 'The light fitting has been replaced at 15 Victoria Ave.', time: 'Yesterday' },
        { type: 'out', text: 'Great, please upload the invoice.', time: 'Yesterday · Sent' },
    ]},
    { id: 4, img: IMG.avatar.michael, name: 'Michael Lee', sub: '15 Victoria Ave', preview: 'Can we schedule an inspection?', time: '2d ago', unread: 0, online: false, messages: [
        { type: 'in', text: 'Can we schedule a mid-term inspection next week?', time: '2d ago' },
        { type: 'out', text: "I'll send available dates shortly.", time: '2d ago · Sent' },
    ]},
    { id: 5, img: IMG.avatar.heating, name: 'Heating Experts', sub: 'Boiler service completed', preview: 'Invoice uploaded.', time: '2d ago', unread: 0, online: false, messages: [
        { type: 'in', text: 'Boiler service completed. Certificate and invoice uploaded.', time: '2d ago' },
    ]},
];

const conversation = (id) => CONVERSATIONS.find(c => c.id === id) || CONVERSATIONS[0];

const messagesHeader = () => `
<div class="inbox-header sticky top-0 z-10">
    <div class="inbox-header-row">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <h1 class="inbox-title">Messages</h1>
        <button data-go="chat" class="top-icon-btn"><i data-lucide="square-pen" class="w-[20px] h-[20px]"></i></button>
    </div>
    <div class="inbox-search-wrap">
        <div class="search-bar inbox-search">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="messages" type="text" value="${STATE.search.messages}" placeholder="Search messages..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
        </div>
    </div>
</div>`;

const msgRow = (c) => `
<button data-go="chat" data-chat="${c.id}" class="inbox-row">
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

const INVOICES = [
    { id: 0, num: 'INV-2025-1048', prop: '12 Park Lane, London SW1A 1AA', amount: '£2,450', status: 'Pending', due: 'May 25, 2025' },
    { id: 1, num: 'INV-2025-1047', prop: '45 Queens Road, London SW2 3TR', amount: '£1,850', status: 'Overdue', due: 'May 10, 2025' },
    { id: 2, num: 'INV-2025-1046', prop: '88 King Street, London EC2V 8BB', amount: '£2,100', status: 'Paid', due: 'May 1, 2025' },
    { id: 3, num: 'INV-2025-1045', prop: '15 Victoria Ave, London N1 5EH', amount: '£1,950', status: 'Pending', due: 'May 28, 2025' },
    { id: 4, num: 'INV-2025-1044', prop: '12 Park Lane, London SW1A 1AA', amount: '£2,450', status: 'Overdue', due: 'Apr 25, 2025' },
    { id: 5, num: 'INV-2025-1043', prop: '45 Queens Road, London SW2 3TR', amount: '£1,850', status: 'Paid', due: 'Apr 10, 2025' },
];

const invoiceStatusStyle = (status) => ({
    Pending: ['#FEF3C7', '#D97706'],
    Overdue: ['#FEE2E2', '#DC2626'],
    Paid: ['#ECFDF5', '#16A34A'],
}[status] || ['#F1F5F9', '#64748B']);

const maintStatusLabel = { open: 'Open', progress: 'In Progress', done: 'Completed' };
const maintStatusStyle = { open: ['#FEF3C7', '#D97706'], progress: ['#DBEAFE', '#2563EB'], done: ['#ECFDF5', '#16A34A'] };

const maintCard = (m) => {
    const [pBg, pColor] = maintPriorityStyle(m.priority);
    const [sBg, sColor] = maintStatusStyle[m.status];
    const avatars = [IMG.avatar.plumber, IMG.avatar.heating, IMG.avatar.electric];
    const thumb = IMG.maint[m.id % IMG.maint.length];
    return `
    <button data-go="maintenance-detail" data-mid="${m.id}" class="maint-card card w-full text-left">
        <img src="${thumb}" class="maint-card-thumb" alt="">
        <div class="maint-card-body">
            <p class="maint-card-title">${m.issue}</p>
            <p class="maint-card-sub">${m.prop}</p>
            <p class="maint-card-time">Reported ${m.time}</p>
            ${m.contractor !== '—' ? `<div class="maint-card-contractor">
                <img src="${avatars[m.id % avatars.length]}" class="maint-card-avatar" alt="">
                <span>${m.contractor}</span>
            </div>` : ''}
        </div>
        <div class="maint-card-badges">
            <span class="badge" style="background:${pBg};color:${pColor}">${m.priority}</span>
            <span class="badge" style="background:${sBg};color:${sColor}">${maintStatusLabel[m.status]}</span>
        </div>
    </button>`;
};

const invoiceRow = (inv) => {
    const [bg, color] = invoiceStatusStyle(inv.status);
    const iconBg = inv.status === 'Paid' ? '#ECFDF5' : '#F8FAFC';
    const iconColor = inv.status === 'Paid' ? '#16A34A' : '#64748B';
    return `
    <button data-go="invoice-detail" data-iid="${inv.id}" class="invoice-row">
        <div class="invoice-row-icon" style="background:${iconBg};color:${iconColor}">
            <i data-lucide="file-text" class="w-5 h-5"></i>
        </div>
        <div class="invoice-row-body">
            <p class="invoice-row-id">${inv.num}</p>
            <p class="invoice-row-prop">${inv.prop}</p>
            <p class="invoice-row-due">Due ${inv.due}</p>
        </div>
        <div class="invoice-row-meta">
            <p class="invoice-row-amount">${inv.amount}</p>
            <span class="badge" style="background:${bg};color:${color}">${inv.status}</span>
        </div>
    </button>`;
};

const infoRows = (rows) => `
<div class="info-card card">
    ${rows.map(([label, value], i) => `
    <div class="info-row ${i < rows.length - 1 ? 'info-row-border' : ''}">
        <span class="info-label">${label}</span>
        <span class="info-value">${value}</span>
    </div>`).join('')}
</div>`;

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
    { icon: 'wrench', color: ['#FEE2E2', '#DC2626'], title: 'Maintenance completed', desc: 'Kitchen sink fixed at 12 Park Lane', time: '2h ago', unread: true, screen: 'maintenance-detail', opts: { mid: 0 } },
    { icon: 'flame', color: ['#FEF3C7', '#D97706'], title: 'Compliance alert', desc: 'Gas certificate expires in 3 days', time: '5h ago', unread: true, screen: 'property-detail', opts: { pid: 0, tab: 'compliance' } },
    { icon: 'banknote', color: ['#ECFDF5', '#16A34A'], title: 'Rent received', desc: '£2,450 from Sarah Johnson', time: '1d ago', unread: false, screen: 'invoice-detail', opts: { iid: 0 } },
    { icon: 'clipboard-check', color: ['#EFF6FF', '#2563EB'], title: 'Inspection scheduled', desc: '45 Queens Rd · Feb 28', time: '2d ago', unread: false, screen: 'property-detail', opts: { pid: 1, tab: 'inspection' } },
];

const notifAttrs = (opts = {}) => [
    opts.pid != null ? `data-pid="${opts.pid}"` : '',
    opts.tab ? `data-tab="${opts.tab}"` : '',
    opts.mid != null ? `data-mid="${opts.mid}"` : '',
    opts.iid != null ? `data-iid="${opts.iid}"` : '',
].filter(Boolean).join(' ');

const notifRow = (n) => `
<button data-go="${n.screen}" ${notifAttrs(n.opts)} class="notif-row ${n.unread ? 'notif-unread' : ''}">
    <div class="notif-icon" style="background:${n.color[0]};color:${n.color[1]}">
        <i data-lucide="${n.icon}" class="w-[18px] h-[18px]"></i>
    </div>
    <div class="notif-body">
        <p class="notif-title">${n.title}</p>
        <p class="notif-desc">${n.desc}</p>
    </div>
    <div class="notif-meta">
        <span class="notif-time">${n.time}</span>
        <span class="notif-unread-pip${n.unread ? '' : ' notif-unread-pip-hidden'}"></span>
    </div>
</button>`;

const formField = (label, value = '', type = 'text', ph = '') => {
    const placeholder = ph || `Enter ${label.toLowerCase()}`;
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div><label class="form-label">${label}</label>
<input type="${type}" class="form-input"${valAttr} placeholder="${placeholder}"></div>`;
};

const formTextarea = (label, value = '', ph = '') => {
    const placeholder = ph || `Enter ${label.toLowerCase()}`;
    const content = value ? value : '';
    return `<div><label class="form-label">${label}</label>
<textarea class="form-input min-h-[96px] resize-none" placeholder="${placeholder}">${content}</textarea></div>`;
};

const formSelect = (label, value, options) => `
<div><label class="form-label">${label}</label>
<select class="form-input form-select">${options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;

const photoUpload = (label = 'Add photos') => `
<button type="button" data-action="toast" data-msg="Photo added" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
    <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
    <p class="text-[12px] text-[#64748B] mt-2">${label}</p>
</button>`;

const saveBtn = (label = 'Save Changes', msg = 'Changes saved') => `
<button type="button" data-action="save" data-msg="${msg}" class="btn-primary w-full py-3.5 text-[14px]">${label}</button>`;

const menuList = (items) => `
<div class="card overflow-hidden shadow-sm">
    ${items.map(([icon, label, target], i) => `
    <button data-go="${target}" class="menu-row menu-row-item ${i < items.length - 1 ? 'border-b border-[#F1F5F9]' : ''}">
        <div class="flex items-center gap-3 min-w-0">
            <i data-lucide="${icon}" class="w-5 h-5 text-[#374151] shrink-0"></i>
            <span class="text-[15px] font-medium text-[#1F2937]">${label}</span>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-[#9CA3AF] shrink-0"></i>
    </button>`).join('')}
</div>`;

const bottomNav = () => {
    const nav = STATE.userRole === 'contractor' ? CONTRACTOR_BOTTOM_NAV : BOTTOM_NAV;
    const parentMap = STATE.userRole === 'contractor' ? {
        'contractor-job-detail': 'contractor-jobs',
        'contractor-schedule': 'contractor-job-detail',
        'contractor-work': 'contractor-job-detail',
        'contractor-documents': 'contractor-job-detail',
        'contractor-company': 'contractor-profile',
    } : {
        'tenant-detail': 'tenants',
        'maintenance-detail': 'maintenance',
        'property-detail': 'properties',
        'invoice-detail': 'financial',
        'financial': 'dashboard',
        'profile': 'dashboard',
        'notifications-list': 'dashboard',
    };
    const activeScreen = parentMap[STATE.screen] || STATE.screen;
    const active = (n) => activeScreen === n ? 'active' : '';
    return `<div class="bottom-nav">
        ${nav.map(([ic, label, sc]) => `
        <button class="nav-btn ${active(sc)}" data-go="${sc}">
            <i data-lucide="${ic}"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;
};

const fabFloat = () => {
    if (STATE.userRole === 'contractor') return '';
    if (!MAIN_SCREENS.includes(STATE.screen)) return '';
    return `<button class="fab-float" data-action="fab" aria-label="Quick actions"><i data-lucide="plus" class="w-6 h-6"></i></button>`;
};

const drawer = () => {
    const isActive = (sc) => STATE.screen === sc;
    const isContractor = STATE.userRole === 'contractor';
    const navItems = isContractor ? CONTRACTOR_DRAWER_NAV : DRAWER_NAV;
    const navHtml = navItems.map(([ic, label, sc]) => `
        <button data-go="${sc}" class="drawer-item ${isActive(sc) ? 'active' : ''}">
            <i data-lucide="${ic}" class="w-5 h-5"></i><span>${label}</span>
        </button>`).join('');
    const profile = isContractor ? {
        img: IMG.avatar.plumber,
        name: 'Mike Thompson',
        role: 'Contractor · Plumber Pro Ltd',
    } : {
        img: IMG.avatar.john,
        name: 'John Smith',
        role: 'Property Owner',
    };
    return `
    <div class="drawer-overlay ${STATE.drawer?'open':''}" data-action="drawer-close"></div>
    <div class="drawer ${STATE.drawer?'open':''}">
        <div class="drawer-profile">
            <img src="${profile.img}" class="drawer-avatar" alt="">
            <div class="min-w-0">
                <p class="drawer-name">${profile.name}</p>
                <p class="drawer-role">${profile.role}</p>
            </div>
        </div>
        <nav class="drawer-nav">${navHtml}</nav>
        <div class="drawer-footer">
            <button data-action="logout" class="drawer-logout">
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
        <button data-go="chat" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]">
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
<div class="prop-section-bar">
    <div class="sub-header-left">
        <button data-tab="overview" class="back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="min-w-0">
            <h2 class="sub-header-title">${title}</h2>
            ${subtitle ? `<p class="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">${subtitle}</p>` : ''}
        </div>
    </div>
</div>`;

const propertyMaintenanceItems = (propertyName) =>
    MAINTENANCE_ITEMS.filter(m => m.prop.split(' ')[0] === propertyName.split(' ')[0]);

const maintPriorityStyle = (priority) => ({
    High: ['#FEE2E2', '#DC2626'],
    Medium: ['#FEF3C7', '#D97706'],
    Low: ['#DBEAFE', '#2563EB'],
}[priority] || ['#F1F5F9', '#64748B']);

/* ─── Screens ─── */
function screenDashboard() {
    const openMaint = MAINTENANCE_ITEMS.filter(m => m.status === 'open').length;
    const tenantCount = TENANTS.length;
    const vacantCount = PROPERTIES.filter(p => p.status === 'Vacant').length;
    const occupiedCount = PROPERTIES.length - vacantCount;
    const compliantCount = PROPERTIES.filter(p => p.compliance).length;
    const occupancy = PROPERTIES.length ? Math.round((occupiedCount / PROPERTIES.length) * 100) : 0;
    const monthlyRent = PROPERTIES.reduce((s, p) => s + parseInt(p.rent.replace(/[^\d]/g, ''), 10), 0);
    const overdueAmount = '£4,250';
    const collectedPct = 92;
    const compliancePct = PROPERTIES.length ? Math.round((compliantCount / PROPERTIES.length) * 100) : 0;
    const reminders = [
        ['flame', 'Gas Certificate Expiry', '12 Park Lane', '3 days left', '#FEE2E2', '#DC2626', 0, 'compliance', 'high'],
        ['search', 'Inspection Due', '45 Queens Road', '5 days left', '#FEF3C7', '#D97706', 1, 'inspection', 'medium'],
        ['banknote', 'Rent Review', '88 King Street', '10 days left', '#EFF6FF', '#2563EB', 2, 'overview', 'medium'],
    ];
    return `${dashboardHeader()}
    <div class="screen-content screen-enter">
        <div class="dash-hero">
            <div class="dash-hero-glow"></div>
            ${buildingSvg}
            <div class="dash-hero-top">
                <span class="dash-hero-label">Monthly income</span>
                <button data-go="properties" class="dash-hero-link">View portfolio</button>
            </div>
            <p class="dash-hero-amount">£${monthlyRent.toLocaleString()}</p>
            <p class="dash-hero-sub">From ${occupiedCount} occupied ${occupiedCount === 1 ? 'property' : 'properties'}</p>
            <div class="dash-hero-stats">
                <button data-go="properties" class="dash-hero-stat">
                    <strong>${PROPERTIES.length}</strong><span>Properties</span>
                </button>
                <div class="dash-hero-divider"></div>
                <button data-go="tenants" class="dash-hero-stat">
                    <strong>${tenantCount}</strong><span>Tenants</span>
                </button>
                <div class="dash-hero-divider"></div>
                <button data-go="properties" class="dash-hero-stat">
                    <strong>${occupancy}%</strong><span>Occupied</span>
                </button>
            </div>
        </div>

        <button data-go="financial" class="dash-alert">
            <div class="dash-alert-icon"><i data-lucide="alert-circle" class="w-5 h-5"></i></div>
            <div class="dash-alert-body">
                <p class="dash-alert-title">${overdueAmount} overdue rent</p>
                <p class="dash-alert-desc">Tap to review and follow up with tenant</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 dash-alert-chevron"></i>
        </button>

        <div class="dash-quick">
            ${[
                ['building-2', 'Add Property', 'add-property', 'primary'],
                ['wrench', 'Log Issue', 'log-maintenance', 'warning'],
                ['banknote', 'Finances', 'financial', 'success'],
                ['users', 'Tenants', 'tenants', 'indigo'],
            ].map(([ic, label, go, tone]) => `
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                <span>${label}</span>
            </button>`).join('')}
        </div>

        <div>
            <div class="dash-section-head">
                <div>
                    <h3 class="screen-section-title">At a glance</h3>
                    <p class="dash-section-sub">Key numbers for your portfolio</p>
                </div>
            </div>
            <div class="dash-stat-grid" style="margin-top:var(--stack-gap-sm)">
                ${dashStatCard({
                    go: 'maintenance', variant: 'issues', icon: 'wrench',
                    label: 'Open Issues', value: openMaint,
                    pill: openMaint ? 'Action' : null,
                })}
                ${dashStatCard({
                    go: 'properties', variant: 'vacant', icon: 'home',
                    label: 'Vacant Units', value: vacantCount,
                    pill: vacantCount ? 'Fill' : null,
                })}
                ${dashStatCard({
                    go: 'properties', variant: 'compliant', icon: 'shield-check',
                    label: 'Compliant', value: `${compliantCount}/${PROPERTIES.length}`,
                    pill: compliancePct === 100 ? 'OK' : null,
                })}
                ${dashStatCard({
                    go: 'financial', variant: 'collected', icon: 'trending-up',
                    label: 'Collected', value: `${collectedPct}%`,
                    pill: '+4%',
                })}
            </div>
        </div>

        <div>
            <div class="dash-section-head">
                <div>
                    <h3 class="screen-section-title">Upcoming reminders</h3>
                    <p class="dash-section-sub">${reminders.length} items coming up soon</p>
                </div>
            </div>
            <div class="dash-reminder-list card" style="margin-top:var(--stack-gap-sm)">
                ${reminders.map(([ic, t, p, d, bg, c, pid, tab, urgency]) => `
                <button data-go="property-detail" data-pid="${pid}" data-tab="${tab}" class="dash-reminder-row urgency-${urgency}">
                    <div class="dash-reminder-icon" style="background:${bg};color:${c}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
                    <div class="dash-reminder-body">
                        <p class="dash-reminder-title">${t}</p>
                        <p class="dash-reminder-prop">${p}</p>
                    </div>
                    <span class="badge shrink-0" style="background:${bg};color:${c}">${d}</span>
                </button>`).join('')}
            </div>
        </div>

        <div>
            <div class="dash-section-head">
                <div>
                    <h3 class="screen-section-title">Recent activity</h3>
                    <p class="dash-section-sub">Latest updates across your portfolio</p>
                </div>
                <button data-go="notifications-list" class="dash-view-all">View all</button>
            </div>
            <div class="notif-list" style="margin-top:var(--stack-gap-sm)">
                ${NOTIFICATIONS.slice(0, 3).map(n => notifRow(n)).join('')}
            </div>
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
        <button data-go="property-detail" data-pid="${p.id}" class="prop-list-card card w-full text-left">
            <div class="prop-list-thumb">
                <img src="${IMG.props[i]}" alt="">
            </div>
            <div class="prop-list-body">
                <div class="prop-list-top">
                    <p class="prop-list-name">${p.name}</p>
                    <span class="badge shrink-0" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
                </div>
                <p class="prop-list-addr">${p.address}</p>
                <p class="prop-list-rent">${p.rent}<span>/mo</span></p>
            </div>
        </button>`;
    return `${topBar('Properties', { search: true, searchKey: 'properties' })}
    <div class="screen-content screen-enter">
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
        ${filtered.length ? `<div class="${grid?'grid grid-cols-2 gap-4':'stack-sm'}">
            ${filtered.map(p=>propCard(p, p.id)).join('')}
        </div>` : `<div class="card p-8 text-center"><i data-lucide="building-2" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No properties found</p><p class="text-[12px] text-[#64748B] mt-1">Try a different search or filter</p></div>`}
    </div>`;
}

function screenPropertyDetail() {
    const p = PROPERTIES[STATE.propertyId];
    const isHub = STATE.tab === 'overview';
    const tabContent = {
        details: `
            <div class="screen-content">
                <div class="grid grid-cols-2 gap-4">
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
            <div class="screen-content screen-content-sm">
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
            <div class="screen-content screen-content-sm">
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
        maintenance: (() => {
            const propMaint = propertyMaintenanceItems(p.name);
            const groups = [
                ['open', 'Open'],
                ['progress', 'In Progress'],
                ['done', 'Completed'],
            ];
            const groupHtml = groups.map(([status, label]) => {
                const items = propMaint.filter(m => m.status === status);
                if (!items.length) return '';
                return `
                <div class="maint-group">
                    <p class="maint-group-label">${label} <span>${items.length}</span></p>
                    <div class="space-y-2">
                        ${items.map(m => {
                            const [bg, color] = maintPriorityStyle(m.priority);
                            return `
                        <button data-go="maintenance-detail" data-mid="${m.id}" class="maint-card card w-full text-left">
                            <div class="maint-card-top">
                                <span class="badge" style="background:${bg};color:${color}">${m.priority}</span>
                                <span class="maint-card-time">${m.time}</span>
                            </div>
                            <p class="maint-card-title">${m.issue}</p>
                            ${m.contractor !== '—' ? `<p class="maint-card-sub">${m.contractor}</p>` : ''}
                        </button>`;
                        }).join('')}
                    </div>
                </div>`;
            }).join('');
            return `
            <div class="screen-content">
                ${propMaint.length ? groupHtml : `
                <div class="card p-8 text-center">
                    <i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
                    <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No maintenance issues</p>
                    <p class="text-[12px] text-[#64748B] mt-1">Log a new issue to get started</p>
                </div>`}
                <button data-go="log-maintenance" class="btn-primary w-full py-3.5 text-[13px]">Log New Issue</button>
            </div>`;
        })(),
        inspection: `
            <div class="screen-content">
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
            <div class="screen-content screen-content-sm">
                ${COMPLIANCE_ITEMS.map(([ic,n,exp],cid)=>`
                <div class="card p-3.5 flex items-center gap-3">
                    <div class="w-1 h-11 rounded-full shrink-0 bg-[#22C55E]"></div>
                    <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                    <div class="flex-1"><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${exp}</p></div>
                    <button data-go="renew-compliance" data-pid="${STATE.propertyId}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>
                </div>`).join('')}
            </div>`,
        inventory: `
            <div class="screen-content screen-content-sm">
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
            <div class="screen-content">
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
            <button data-action="back" class="top-icon-btn absolute bg-white/90 rounded-full shadow-md" style="top:12px;left:var(--gutter)"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <span class="badge absolute bottom-3 left-5" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
        </div>
        <div class="property-hub-meta">
            <div class="min-w-0">
                <h2 class="sub-header-title">${p.name}</h2>
                <p class="sub-header-sub">${p.address}</p>
            </div>
            <button data-go="edit-property" data-pid="${STATE.propertyId}" class="text-[13px] font-semibold text-[#2563EB] shrink-0">Edit</button>
        </div>
        <div class="property-hub-actions">
            ${[['users','Tenant','tenant'],['wrench','Maintenance','maintenance'],['file-text','Documents','documents']].map(([ic,l,tab])=>`
            <button data-tab="${tab}" class="quick-action">
                <div class="quick-action-circle"><i data-lucide="${ic}" class="w-[20px] h-[20px]"></i></div>
                <span>${l}</span>
            </button>`).join('')}
        </div>
        <div class="screen-content screen-enter">
            <p class="section-title">All Sections</p>
            ${propMenuList()}
        </div>`;
    }

    const sectionTitle = PROP_SECTIONS[STATE.tab] || 'Section';
    const sectionSubtitle = STATE.tab === 'maintenance' ? '' : p.name;
    return `
    ${propSectionBar(sectionTitle, sectionSubtitle)}
    <div class="screen-enter">${tabContent[STATE.tab] || tabContent.details}</div>`;
}

function screenTenants() {
    const q = STATE.search.tenants.toLowerCase();
    const f = STATE.tenantFilter;
    const filtered = TENANT_LIST.filter(t => {
        const matchSearch = !q || t.name.toLowerCase().includes(q) || t.prop.toLowerCase().includes(q);
        const matchFilter = f === 'all' || t.status === f;
        return matchSearch && matchFilter;
    });
    const counts = {
        all: TENANT_LIST.length,
        active: TENANT_LIST.filter(t => t.status === 'active').length,
        inactive: TENANT_LIST.filter(t => t.status === 'inactive').length,
    };
    return `${topBar('Tenants', { sub: `${counts.active} active tenants` })}
    <div class="screen-content screen-content-sm screen-enter tenant-list-page">
        <div class="tenant-search-row">
            <div class="search-bar tenant-search-bar">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="tenants" type="text" value="${STATE.search.tenants}" placeholder="Search tenants..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-tenant-filter="all" class="tenant-filter-btn ${f === 'all' ? 'tenant-filter-btn-active' : ''}" aria-label="Show all tenants" title="Show all">
                <i data-lucide="sliders-horizontal" class="w-[18px] h-[18px]"></i>
            </button>
        </div>
        <div class="filter-tabs tenant-filter-tabs">
            ${[['all', 'All', counts.all], ['active', 'Active', counts.active], ['inactive', 'Inactive', counts.inactive]].map(([k, l, n]) => `
            <button type="button" data-tenant-filter="${k}" class="filter-chip ${f === k ? 'active' : ''}">${l} (${n})</button>`).join('')}
        </div>
        <div class="tenant-list">
            ${filtered.length ? filtered.map(t => tenantListRow(t)).join('') : `
            <div class="tenant-empty card">
                <i data-lucide="users" class="w-10 h-10 text-[#CBD5E1]"></i>
                <p class="tenant-empty-title">No tenants found</p>
                <p class="tenant-empty-sub">Try adjusting your search or filters</p>
            </div>`}
        </div>
        <button type="button" data-go="invite-tenant" data-pid="0" class="btn-primary tenant-add-btn">
            <i data-lucide="plus" class="w-5 h-5"></i> Add Tenant
        </button>
    </div>`;
}

const tenantStatusPill = (status) => {
    const map = {
        active: ['Active', '#ECFDF5', '#059669'],
        inactive: ['Inactive', '#F1F5F9', '#64748B'],
        pending: ['Pending', '#FFFBEB', '#D97706'],
    };
    const [label, bg, color] = map[status] || map.active;
    return `<span class="tenant-status-pill" style="background:${bg};color:${color}">${label}</span>`;
};

const tenantListRow = (t) => `
<button type="button" data-go="tenant-detail" data-tid="${t.id}" class="tenant-row card w-full text-left">
    <img src="${t.img}" class="tenant-row-avatar" alt="">
    <div class="tenant-row-body">
        <div class="tenant-row-top">
            <p class="tenant-row-name">${t.name}</p>
            ${tenantStatusPill(t.status)}
        </div>
        <p class="tenant-row-prop">${t.prop}${t.unit ? ` · ${t.unit}` : ''}</p>
        <p class="tenant-row-meta">${t.lease} · ${t.rent}</p>
    </div>
    <i data-lucide="chevron-right" class="tenant-row-chevron w-5 h-5"></i>
</button>`;

const tenantDetailField = (label, value) => `
<div class="tenant-field">
    <p class="tenant-field-label">${label}</p>
    <p class="tenant-field-value">${value}</p>
</div>`;

const tenantFieldsCard = (fields) => `
<div class="card tenant-fields-card">${fields.map(([l, v]) => tenantDetailField(l, v)).join('')}</div>`;

const tenantSectionBar = (title, showEdit = true) => `
<div class="screen-header tenant-section-header">
    <div class="sub-header-row">
        <div class="sub-header-left">
            <button type="button" data-action="tenant-back" class="back-btn">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <h1 class="sub-header-title">${title}</h1>
        </div>
        ${showEdit ? `<button type="button" data-go="edit-tenant" class="tenant-edit-link">Edit</button>` : ''}
    </div>
</div>`;

const tenantMenuItem = (icon, label, tab) => `
<button type="button" data-ttab="${tab}" class="tenant-menu-item">
    <div class="tenant-menu-icon"><i data-lucide="${icon}" class="w-[18px] h-[18px]"></i></div>
    <span class="tenant-menu-label">${label}</span>
    <i data-lucide="chevron-right" class="tenant-menu-chevron w-5 h-5"></i>
</button>`;

const tenantOverview = (t, avatar) => {
    const listItem = TENANT_LIST[STATE.tenantId] || TENANT_LIST[0];
    return `
    <div class="tenant-hero-card">
        <div class="tenant-hero-glow tenant-hero-glow-1" aria-hidden="true"></div>
        <div class="tenant-hero-glow tenant-hero-glow-2" aria-hidden="true"></div>
        <div class="tenant-hero-shine" aria-hidden="true"></div>
        <div class="tenant-hero-toolbar">
            <button type="button" data-action="back" class="tenant-hero-back"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <button type="button" data-action="toast" data-msg="More options" class="tenant-hero-more"><i data-lucide="more-horizontal" class="w-5 h-5"></i></button>
        </div>
        <div class="tenant-hero-content">
            <div class="tenant-hero-avatar-wrap">
                <img src="${avatar}" class="tenant-hero-avatar" alt="">
            </div>
            <h2 class="tenant-hero-name">${t.firstName} ${t.lastName}</h2>
            <span class="tenant-hero-badge"><span class="tenant-hero-badge-dot"></span>${listItem.status === 'active' ? 'Active Tenant' : 'Inactive'}</span>
        </div>
        <div class="tenant-hero-meta">
            <div class="tenant-hero-chip">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                <span>${listItem.prop}${listItem.unit ? ` · ${listItem.unit}` : ''}</span>
            </div>
            <div class="tenant-hero-stats">
                <div class="tenant-hero-stat">
                    <span class="tenant-hero-stat-label">Monthly Rent</span>
                    <strong>${listItem.rent}</strong>
                </div>
                <div class="tenant-hero-stat-divider"></div>
                <div class="tenant-hero-stat">
                    <span class="tenant-hero-stat-label">Lease Ends</span>
                    <strong>${listItem.leaseEnd}</strong>
                </div>
            </div>
        </div>
    </div>
    <div class="tenant-quick-actions">
        ${[
            ['phone', 'Call', `Calling ${t.firstName}`, null],
            ['message-square', 'Message', null, listItem.chatId],
            ['mail', 'Email', `Email sent to ${t.email}`, null],
            ['more-horizontal', 'More', 'More options', null],
        ].map(([ic, label, msg, chatId]) => `
        <button type="button" ${chatId != null ? `data-go="chat" data-chat="${chatId}"` : msg ? `data-action="toast" data-msg="${msg}"` : 'data-action="toast" data-msg="No messages"'} class="tenant-quick-btn">
            <div class="tenant-quick-icon"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
            <span>${label}</span>
        </button>`).join('')}
    </div>
    <div class="tenant-menu-wrap">
        ${TENANT_MENU.map(g => `
        <div class="tenant-menu-group">
            <p class="tenant-menu-group-label">${g.group}</p>
            <div class="card tenant-menu-card">${g.items.map(([ic, lb, tab]) => tenantMenuItem(ic, lb, tab)).join('')}</div>
        </div>`).join('')}
        <button type="button" data-go="edit-tenant" class="btn-secondary w-full py-3.5 text-[13px] tenant-edit-btn">
            <i data-lucide="pencil" class="w-4 h-4"></i> Edit Tenant
        </button>
    </div>`;
};

const tenantSectionContent = (tab, t) => {
    const listItem = TENANT_LIST[STATE.tenantId] || TENANT_LIST[0];
    const sections = {
        personal: () => tenantFieldsCard([
            ['Full Name', `${t.firstName} ${t.lastName}`],
            ['Date of Birth', '15 Mar 1990'],
            ['Nationality', 'British'],
            ['National Insurance', 'AB 12 34 56 C'],
            ['Preferred Language', 'English (UK)'],
        ]),
        contact: () => tenantFieldsCard([
            ['Phone', t.phone],
            ['Email', t.email],
            ['Alternate Phone', '—'],
            ['Preferred Contact', 'Email'],
        ]),
        emergency: () => tenantFieldsCard([
            ['Contact Name', t.emergency],
            ['Relationship', 'Spouse'],
            ['Phone', t.emergencyPhone],
            ['Email', 'james.j@email.com'],
        ]),
        property: () => `
            ${tenantFieldsCard([
                ['Property', listItem.prop],
                ['Unit', listItem.unit || '—'],
                ['Address', 'London, UK'],
                ['Move-in Date', 'Jan 15, 2024'],
            ])}
            <button type="button" data-go="property-detail" data-pid="${listItem.propertyId}" class="btn-secondary w-full py-3 text-[13px]">View Property</button>`,
        lease: () => `
            ${tenantFieldsCard([
                ['Lease Type', 'AST · 12 months'],
                ['Start Date', 'Jan 15, 2024'],
                ['End Date', 'Jan 14, 2026'],
                ['Monthly Rent', '£' + t.rent],
                ['Deposit', '£2,450'],
                ['Deposit Scheme', 'DPS'],
            ])}
            <button type="button" data-go="document-preview" class="btn-secondary w-full py-3 text-[13px]">View Lease PDF</button>`,
        employment: () => tenantFieldsCard([
            ['Employer', 'Tech Solutions Ltd'],
            ['Job Title', 'Software Engineer'],
            ['Annual Income', '£65,000'],
            ['Employment Status', 'Full-time'],
            ['Start Date', 'Sep 2019'],
        ]),
        identity: () => {
            const avatars = [IMG.avatar.sarah, IMG.avatar.david, IMG.avatar.michael, IMG.avatar.michael];
            const thumb = avatars[STATE.tenantId] || IMG.avatar.sarah;
            return `
            <div class="stack-sm">
                ${[
                    ['Passport', 'Verified', 'Jan 2024', thumb],
                    ['Driving Licence', 'Verified', 'Jan 2024', thumb],
                    ['Right to Rent', 'Valid', 'Jan 2026', null],
                ].map(([name, status, date, idThumb]) => `
                <div class="card tenant-id-card">
                    <div class="tenant-id-main">
                        <div class="tenant-id-icon"><i data-lucide="file-badge" class="w-5 h-5"></i></div>
                        <div class="flex-1 min-w-0">
                            <p class="tenant-id-name">${name}</p>
                            <p class="tenant-id-date">Uploaded ${date}</p>
                        </div>
                        <span class="tenant-verified-badge"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i>${status}</span>
                    </div>
                    ${idThumb ? `<img src="${idThumb}" class="tenant-id-thumb" alt="">` : ''}
                </div>`).join('')}
            </div>`;
        },
        documents: () => `
            <div class="stack-sm">
                ${[
                    ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                    ['file-image', 'ID Scan.jpg', 'Jan 10, 2024', '#7C3AED'],
                    ['file-check', 'Reference Letter.pdf', 'Jan 8, 2024', '#059669'],
                ].map(([ic, name, date, color]) => `
                <button type="button" data-go="document-preview" class="card tenant-doc-row w-full text-left">
                    <div class="tenant-doc-icon" style="color:${color}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                    <div class="flex-1 min-w-0">
                        <p class="tenant-doc-name">${name}</p>
                        <p class="tenant-doc-date">${date}</p>
                    </div>
                    <i data-lucide="download" class="w-4 h-4 text-[#94A3B8]"></i>
                </button>`).join('')}
                <button type="button" data-action="toast" data-msg="Upload document" class="tenant-upload-zone">
                    <i data-lucide="upload" class="w-6 h-6"></i>
                    <p>Upload Document</p>
                </button>
            </div>`,
        insurance: () => tenantFieldsCard([
            ['Provider', 'Contents Cover Plus'],
            ['Policy Number', 'CCP-2024-8891'],
            ['Coverage', '£25,000'],
            ['Expiry Date', 'Dec 2025'],
            ['Status', 'Active'],
        ]),
        guarantor: () => tenantFieldsCard([
            ['Name', 'James Johnson'],
            ['Relationship', 'Spouse'],
            ['Phone', '+44 7700 900789'],
            ['Email', 'james.j@email.com'],
            ['Annual Income', '£58,000'],
        ]),
        payments: () => `
            <div class="tenant-balance-card card">
                <p class="tenant-balance-label">Outstanding Balance</p>
                <p class="tenant-balance-amount">£0.00</p>
                <div class="tenant-balance-grid">
                    <div><p class="tenant-balance-mini-label">Last Payment</p><p class="tenant-balance-mini-value">£${t.rent} · Mar 1</p></div>
                    <div><p class="tenant-balance-mini-label">Next Due</p><p class="tenant-balance-mini-value">Apr 1, 2025</p></div>
                </div>
            </div>
            ${tenantFieldsCard([
                ['Payment Method', 'Bank Transfer'],
                ['Auto Pay', 'Enabled'],
                ['Security Deposit', '£2,450'],
                ['Deposit Status', 'Protected'],
            ])}
            <button type="button" data-go="transaction-history" class="btn-secondary w-full py-3 text-[13px]">View Payment History</button>`,
        maintenance: () => {
            const tenantMaint = MAINTENANCE_ITEMS.filter(m => m.propertyId === listItem.propertyId);
            const openCount = tenantMaint.filter(m => m.status === 'open' || m.status === 'progress').length;
            const doneCount = tenantMaint.filter(m => m.status === 'done').length;
            return `
            <div class="filter-tabs" style="margin-bottom:12px">
                <button type="button" class="filter-chip active">All (${tenantMaint.length})</button>
                <button type="button" class="filter-chip">Open (${openCount})</button>
                <button type="button" class="filter-chip">Resolved (${doneCount})</button>
            </div>
            <div class="stack-sm">
                ${tenantMaint.length ? tenantMaint.map(m => {
                    const [color] = maintStatusStyle[m.status];
                    return `
                <button type="button" data-go="maintenance-detail" data-mid="${m.id}" class="card tenant-maint-card w-full text-left">
                    <div class="tenant-maint-top">
                        <p class="tenant-maint-title">${m.issue}</p>
                        <span class="tenant-status-pill" style="background:#ECFDF5;color:${color}">${maintStatusLabel[m.status]}</span>
                    </div>
                    <p class="tenant-maint-meta">${m.priority} priority · ${m.time}</p>
                </button>`;
                }).join('') : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No maintenance requests for this tenant</p></div>`}
            </div>`;
        },
        notes: () => `
            <div class="stack-sm">
                ${[
                    ['Tenant prefers email for non-urgent matters. Very responsive on WhatsApp.', 'Mar 5, 2025 · You', '#FFFBEB', '#D97706'],
                    ['Requested early inspection before lease renewal discussion.', 'Feb 12, 2025 · You', '#EFF6FF', '#2563EB'],
                ].map(([text, meta, bg, color]) => `
                <div class="tenant-note-card" style="background:${bg};border-color:${color}22">
                    <p class="tenant-note-text">${text}</p>
                    <div class="tenant-note-footer">
                        <span class="tenant-note-meta">${meta}</span>
                        <button type="button" data-action="toast" data-msg="Edit note" class="tenant-note-edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                    </div>
                </div>`).join('')}
                <button type="button" data-action="toast" data-msg="Add note" class="btn-primary w-full py-3 text-[13px]">+ Add Note</button>
            </div>`,
        activity: () => `
            <div class="tenant-timeline">
                ${[
                    ['banknote', '#ECFDF5', '#059669', 'Rent payment received', '£' + t.rent + ' · Mar 1, 2025'],
                    ['wrench', '#EFF6FF', '#2563EB', 'Maintenance request resolved', 'Kitchen tap · Jan 2025'],
                    ['message-square', '#EEF2FF', '#4F46E5', 'Message sent', 'Lease renewal reminder · Feb 2025'],
                    ['user-plus', '#FFFBEB', '#D97706', 'Tenant moved in', 'Jan 15, 2024'],
                ].map(([ic, bg, color, title, sub]) => `
                <div class="tenant-timeline-item">
                    <div class="tenant-timeline-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-4 h-4"></i></div>
                    <div class="tenant-timeline-body">
                        <p class="tenant-timeline-title">${title}</p>
                        <p class="tenant-timeline-sub">${sub}</p>
                    </div>
                </div>`).join('')}
            </div>`,
    };
    return sections[tab] ? sections[tab]() : '';
};

const TENANT_SECTION_TITLES = {
    personal: 'Personal Info', contact: 'Contact Info', emergency: 'Emergency Contact',
    property: 'Property Info', lease: 'Lease Info', employment: 'Employment Info',
    identity: 'Identity Verification', documents: 'Uploaded Documents',
    insurance: 'Insurance', guarantor: 'Guarantor Info',
    payments: 'Payment & Ledger', maintenance: 'Maintenance Requests',
    notes: 'Notes', activity: 'Activity Timeline',
};

function screenTenantDetail() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    const avatars = [IMG.avatar.sarah, IMG.avatar.david, IMG.avatar.michael];
    const avatar = avatars[STATE.tenantId];
    const tab = STATE.tenantTab || 'overview';

    if (tab === 'overview') {
        return `<div class="tenant-detail-page">${tenantOverview(t, avatar)}</div>`;
    }

    const title = TENANT_SECTION_TITLES[tab] || 'Tenant';
    return `
    ${tenantSectionBar(title)}
    <div class="screen-content screen-enter tenant-section-page">
        ${tenantSectionContent(tab, t)}
    </div>`;
}

function screenMaintenance() {
    const f = STATE.maintFilter;
    const items = f === 'all' ? MAINTENANCE_ITEMS : MAINTENANCE_ITEMS.filter(m => m.status === f);
    const counts = {
        all: MAINTENANCE_ITEMS.length,
        open: MAINTENANCE_ITEMS.filter(m=>m.status==='open').length,
        progress: MAINTENANCE_ITEMS.filter(m=>m.status==='progress').length,
        done: MAINTENANCE_ITEMS.filter(m=>m.status==='done').length,
    };
    return `${topBar('Maintenance')}
    <div class="screen-content screen-enter">
        <div class="filter-tabs">
            ${[['all','All',counts.all],['open','Open',counts.open],['progress','In Progress',counts.progress],['done','Completed',counts.done]].map(([k,l,n])=>`
            <button type="button" data-maint-filter="${k}" class="filter-chip ${f===k?'active':''}">${l} (${n})</button>`).join('')}
        </div>
        <div class="stack-sm">
        ${items.length ? items.map(m => maintCard(m)).join('') : `<div class="card p-8 text-center"><i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No issues found</p></div>`}
        </div>
        <button data-go="log-maintenance" class="btn-primary w-full py-3.5 text-[13px]">Log New Issue</button>
    </div>`;
}

function screenFinancial() {
    const f = STATE.invoiceFilter;
    const statusMap = { pending: 'Pending', paid: 'Paid', overdue: 'Overdue' };
    const filtered = f === 'all' ? INVOICES : INVOICES.filter(inv => inv.status === statusMap[f]);
    const counts = {
        all: INVOICES.length,
        pending: INVOICES.filter(i=>i.status==='Pending').length,
        paid: INVOICES.filter(i=>i.status==='Paid').length,
        overdue: INVOICES.filter(i=>i.status==='Overdue').length,
    };
    return `${topBar('Financial')}
    <div class="screen-content screen-enter">
        <div class="financial-summary card">
            <p class="financial-summary-label">Total Rental Income</p>
            <p class="financial-summary-amount">£24,560</p>
            <p class="financial-summary-trend"><i data-lucide="trending-up" class="w-4 h-4"></i>+8.2% vs last month</p>
            <div class="financial-summary-grid">
                <div><p class="financial-mini-label">Collected</p><p class="financial-mini-value text-[#16A34A]">£20,310</p></div>
                <div><p class="financial-mini-label">Outstanding</p><p class="financial-mini-value text-[#DC2626]">£4,250</p></div>
            </div>
        </div>
        <p class="screen-section-title">Invoices</p>
        <div class="filter-tabs">
            ${[['all','All',counts.all],['pending','Pending',counts.pending],['paid','Paid',counts.paid],['overdue','Overdue',counts.overdue]].map(([k,l,n])=>`
            <button type="button" data-invoice-filter="${k}" class="filter-chip ${f===k?'active':''}">${l}${k!=='all' ? ` (${n})` : ''}</button>`).join('')}
        </div>
        <div class="invoice-list card">${filtered.length ? filtered.map(invoiceRow).join('') : `<div class="p-8 text-center text-[13px] text-[#64748B]">No invoices found</div>`}</div>
        <button data-action="toast" data-msg="Create invoice coming soon" class="btn-primary w-full py-3.5 text-[13px]">Create Invoice</button>
    </div>`;
}

function screenMessages() {
    const q = STATE.search.messages.toLowerCase();
    const convos = CONVERSATIONS.filter(c =>
        !q || c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
    return `${messagesHeader()}
    <div class="screen-content screen-enter">
        ${convos.length ? `<div class="inbox-list full-bleed">${convos.map(c => msgRow(c)).join('')}</div>` : `
        <div class="inbox-empty">
            <p class="text-[14px] font-semibold text-[#0F172A]">No messages found</p>
            <p class="text-[13px] text-[#64748B] mt-1">Try a different search term</p>
        </div>`}
    </div>`;
}

function screenChat() {
    const c = conversation(STATE.chatId);
    const statusLine = c.online
        ? `<p class="text-[11px] text-[#22C55E] font-medium flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>Online · ${c.sub}</p>`
        : `<p class="text-[11px] text-[#64748B] font-medium">${c.sub}</p>`;
    return `
    <div class="screen-full chat-screen">
        <div class="chat-header">
            <button data-action="back" class="back-btn shrink-0"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <div class="chat-header-info">
                <img src="${c.img}" class="chat-header-avatar" alt="">
                <div class="min-w-0">
                    <p class="text-[15px] font-bold text-[#0F172A] leading-tight">${c.name}</p>
                    ${statusLine}
                </div>
            </div>
            <button data-action="toast" data-msg="Calling ${c.name}" class="chat-header-action"><i data-lucide="phone" class="w-[18px] h-[18px]"></i></button>
        </div>
        <div class="screen-body-inner gutter-x chat-messages stack-sm" style="padding-top:var(--stack-gap);padding-bottom:var(--stack-gap)">
            <p class="chat-date-label">Today</p>
            ${c.messages.map(m => `
            <div class="chat-bubble-${m.type}">
                <p>${m.text}</p>
                <span class="chat-time">${m.time}</span>
            </div>`).join('')}
        </div>
        <div class="chat-input-bar">
            <button type="button" class="chat-input-icon"><i data-lucide="paperclip" class="w-[18px] h-[18px]"></i></button>
            <div class="chat-input-field">Type a message...</div>
            <button type="button" data-action="toast" data-msg="Message sent" class="chat-send-btn"><i data-lucide="send" class="w-[17px] h-[17px]"></i></button>
        </div>
    </div>`;
}

function screenProfile() {
    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-enter">
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
            ['sliders-horizontal','Preferences','preferences'],
            ['credit-card','Payment Methods','payment-methods'],
            ['key-round','Change Password','password'],
            ['shield','Security','security'],
            ['receipt','Transaction History','transaction-history'],
            ['gem','Subscription','subscription'],
        ])}
        <p class="section-title">Support & Legal</p>
        ${menuList([
            ['help-circle','Help & Support','help-support'],
            ['info','About','about'],
            ['shield','Privacy Policy','privacy'],
            ['file-text','Terms & Conditions','terms'],
        ])}
        <button data-action="logout" class="w-full py-3.5 mt-4 text-[14px] font-semibold text-[#DC2626]">Log Out</button>
    </div>`;
}

function screenPersonalInfo() {
    const u = LANDLORD_USER;
    return `${topBar('Personal Information', { back: true })}
    <div class="screen-content screen-enter">
        <div class="flex justify-center mb-2">
            <div class="relative"><img src="${IMG.avatar.john}" class="w-20 h-20 rounded-2xl object-cover" alt="">
            <button type="button" data-action="toast" data-msg="Photo updated" class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center"><i data-lucide="camera" class="w-4 h-4 text-white"></i></button></div>
        </div>
        ${formField('First Name', u.firstName)}${formField('Last Name', u.lastName)}
        ${formField('Email', u.email, 'email')}${formField('Phone', u.phone, 'tel')}
        ${formField('Address', u.address)}
        ${saveBtn('Save Changes', 'Profile updated')}
    </div>`;
}

function screenNotificationsSettings() {
    const items = [
        ['rent-reminders','Rent reminders'],['maintenance-updates','Maintenance updates'],
        ['compliance-alerts','Compliance alerts'],['new-messages','New messages'],['marketing-emails','Marketing emails'],
    ];
    return `${topBar('Notifications', { back: true })}
    <div class="screen-content screen-enter">
        <p class="section-title">Push Notifications</p>
        ${items.map(([key,l])=>`
        <button data-toggle="${key}" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium text-[#1F2937]">${l}</span>
            <div class="toggle ${STATE.toggles[key]?'':'off'}"></div>
        </button>`).join('')}
        <p class="section-title">Email Digest</p>
        <button data-toggle="weekly-summary" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium">Weekly summary</span>
            <div class="toggle ${STATE.toggles['weekly-summary']?'':'off'}"></div>
        </button>
    </div>`;
}

function screenPassword() {
    return `${topBar('Change Password', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B]">Update your account password. Use at least 8 characters.</p>
        <div><label class="form-label">Current Password</label><input type="password" class="form-input" placeholder="Enter current password"></div>
        <div><label class="form-label">New Password</label><input type="password" class="form-input" placeholder="Enter new password"></div>
        <div><label class="form-label">Confirm Password</label><input type="password" class="form-input" placeholder="Confirm new password"></div>
        <button data-action="save" data-msg="Password updated" class="btn-primary w-full py-3.5 text-[14px]">Update Password</button>
    </div>`;
}

function screenSecurity() {
    return `${topBar('Security', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        <div class="card divide-y divide-[#F1F5F9]">
            <button data-go="password" class="p-4 flex items-center gap-3 w-full text-left">
                <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="key-round" class="w-5 h-5 text-[#2563EB]"></i></div>
                <div class="flex-1"><p class="text-[14px] font-semibold">Change Password</p><p class="text-[12px] text-[#64748B]">Update your sign-in password</p></div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
            </button>
            <button data-action="toast" data-msg="Two-factor authentication enabled" class="p-4 flex items-center gap-3 w-full text-left">
                <div class="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center"><i data-lucide="shield-check" class="w-5 h-5 text-[#059669]"></i></div>
                <div class="flex-1"><p class="text-[14px] font-semibold">Two-Factor Authentication</p><p class="text-[12px] text-[#64748B]">Enabled via authenticator app</p></div>
                <span class="badge bg-[#DCFCE7] text-[#16A34A]">On</span>
            </button>
            <button data-action="toast" data-msg="Biometric login toggled" class="p-4 flex items-center gap-3 w-full text-left">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="fingerprint" class="w-5 h-5 text-[#64748B]"></i></div>
                <div class="flex-1"><p class="text-[14px] font-semibold">Biometric Login</p><p class="text-[12px] text-[#64748B]">Use Face ID or fingerprint</p></div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
            </button>
        </div>
        <p class="section-title">Active Sessions</p>
        <div class="card p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="smartphone" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div class="flex-1"><p class="text-[14px] font-semibold">This device</p><p class="text-[12px] text-[#64748B]">London · Active now</p></div>
            <span class="badge bg-[#DCFCE7] text-[#16A34A]">Current</span>
        </div>
        <button data-action="toast" data-msg="Signed out of other devices" class="btn-secondary w-full py-3.5 text-[14px]">Sign Out Other Devices</button>
    </div>`;
}

function screenPreferences() {
    return `${topBar('Preferences', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        ${Object.entries(PREF_OPTIONS).map(([key, p]) => `
        <button data-go="edit-preference" data-pref="${key}" class="card p-4 flex items-center justify-between w-full text-left">
            <span class="text-[14px] font-medium">${p.title}</span>
            <span class="text-[13px] text-[#64748B] flex items-center gap-1">${p.current} <i data-lucide="chevron-right" class="w-4 h-4"></i></span>
        </button>`).join('')}
    </div>`;
}

function screenPaymentMethods() {
    return `${topBar('Payment Methods', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
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
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-content-sm screen-enter">
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
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
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
        <p class="section-title">Legal</p>
        ${menuList([
            ['shield','Privacy Policy','privacy'],
            ['file-text','Terms & Conditions','terms'],
            ['circle-help','FAQ','faq'],
        ])}
        <p class="text-[12px] text-[#94A3B8] text-center mt-6">© 2025 Landlord HQ Ltd. All rights reserved.</p>
    </div>`;
}

function screenMaintenanceDetail() {
    const item = maintItem(STATE.maintId);
    const statusLabel = maintStatusLabel[item.status] || item.status;
    const [pBg, pColor] = maintPriorityStyle(item.priority);
    const timeline = {
        open: [['Issue reported', `Today · ${item.time}`]],
        progress: [['Issue reported', item.time], ['Contractor assigned', 'Today'], ['Work in progress', 'In progress']],
        done: [['Issue reported', item.time], ['Contractor assigned', 'Completed'], ['Work completed', 'Resolved']],
    }[item.status] || [['Issue reported', item.time]];
    const contractorAvatar = item.contractor === 'Heating Co.' ? IMG.avatar.heating
        : item.contractor === 'Electric Fix' ? IMG.avatar.electric : IMG.avatar.plumber;
    return `${topBar('Maintenance', { back: true })}
    <div class="screen-content screen-enter">
        <img src="${IMG.maint[item.id % IMG.maint.length]}" class="w-full h-44 rounded-xl object-cover" alt="">
        <div class="flex gap-2"><span class="badge" style="background:${pBg};color:${pColor}">${item.priority}</span><span class="badge bg-[#F1F5F9] text-[#64748B]">${statusLabel}</span></div>
        <h2 class="text-[18px] font-bold">${item.issue}</h2>
        <p class="text-[13px] text-[#64748B]">${item.prop} · ${item.time}</p>
        <div class="card p-4"><p class="text-[13px] leading-relaxed text-[#475569]">${item.desc}</p></div>
        ${item.contractor !== '—' ? `<div class="card p-4 flex items-center gap-3">
            <img src="${contractorAvatar}" class="w-10 h-10 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[13px] font-semibold">${item.contractor}</p><p class="text-[11px] text-[#64748B]">Assigned contractor</p></div>
            <button data-go="chat" data-chat="1" class="text-[13px] font-semibold text-[#2563EB]">Contact</button>
        </div>` : ''}
        <div class="relative pl-6 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            ${timeline.map(([t, d]) => `
            <div class="relative"><div class="absolute -left-6 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white"></div>
            <p class="text-[13px] font-medium">${t}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>`).join('')}
        </div>
        ${item.status !== 'done' ? `<button data-action="mark-maint-complete" class="btn-primary w-full py-3.5 text-[14px]">Mark Complete</button>` : `<p class="text-[13px] text-center text-[#059669] font-semibold py-2">This issue has been resolved</p>`}
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
    <div class="screen-content screen-enter">
        <div class="card p-5 text-center">
            <p class="text-[13px] text-[#64748B]">Amount Due</p>
            <p class="text-3xl font-bold text-[#0F172A] mt-1">${inv.amount}</p>
            <span class="badge mt-3" style="background:${sc}18;color:${sc}">${inv.status}</span>
        </div>
        <div class="card divide-y divide-[#F1F5F9]">
            ${[['Tenant',inv.tenant],['Property',inv.prop],['Due Date',inv.due],['Paid Date',inv.paid],['Invoice #','INV-2025-00'+(STATE.invoiceId+1)]].map(([k,v])=>`
            <div class="p-4 flex justify-between text-[13px]"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
        </div>
        <div class="grid grid-cols-2 gap-4">
            <button data-action="toast" data-msg="Invoice downloaded" class="btn-secondary py-3 text-[13px]">Download PDF</button>
            ${inv.status !== 'Paid' ? `<button data-action="toast" data-msg="Reminder sent" class="btn-primary py-3 text-[13px]">Send Reminder</button>` : `<button data-action="toast" data-msg="Receipt downloaded" class="btn-primary py-3 text-[13px]">Download Receipt</button>`}
        </div>
    </div>`;
}

function screenInventoryRoom() {
    const rooms = [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    return `${topBar(room[0], { back: true })}
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
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
    const unreadItems = NOTIFICATIONS.filter(n => n.unread);
    const readItems = NOTIFICATIONS.filter(n => !n.unread);
    const section = (label, items) => items.length ? `
        <div class="notif-section">
            <p class="notif-section-label">${label}</p>
            <div class="notif-list">${items.map(notifRow).join('')}</div>
        </div>` : '';
    return `
    <div class="screen-header">
        <div class="sub-header-row">
            <button data-action="back" class="back-btn shrink-0"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <div class="min-w-0 flex-1 text-center">
                <h1 class="sub-header-title">Notifications</h1>
                ${unread ? `<p class="sub-header-sub">${unread} unread</p>` : ''}
            </div>
            <button type="button" data-action="toast" data-msg="All marked as read" class="notif-mark-read">Mark all read</button>
        </div>
    </div>
    <div class="screen-content screen-enter">
        ${section('Today', unreadItems)}
        ${section('Earlier', readItems)}
    </div>`;
}

function screenAddProperty() {
    return `${topBar('Add Property', { back: true })}
    <div class="screen-content screen-enter">
        ${photoUpload('Add property photos')}
        ${formField('Property Name', '', 'text', 'e.g. 12 Park Lane')}
        ${formField('Address', '', 'text', 'Street address')}
        ${formField('Postcode', '', 'text', 'e.g. SW1A 1AA')}
        ${formField('Monthly Rent', '', 'text', 'e.g. 2450')}
        ${formField('Bedrooms', '', 'number', 'e.g. 2')}${formField('Bathrooms', '', 'number', 'e.g. 1')}
        ${formSelect('Status', 'Occupied', ['Occupied', 'Vacant'])}
        ${saveBtn('Add Property', 'Property added successfully')}
    </div>`;
}

function screenEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    const rent = p.rent.replace(/[£,]/g, '');
    return `${topBar('Edit Property', { back: true })}
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.rent}/month · ${p.status}</p></div>
        </div>
        ${formField('First Name', '', 'text', 'Tenant first name')}
        ${formField('Last Name', '', 'text', 'Tenant last name')}
        ${formField('Email', '', 'email', 'tenant@email.com')}
        ${formField('Phone', '', 'tel', '+44 7...')}
        ${formField('Monthly Rent', '', 'text', 'Enter monthly rent')}
        ${formField('Lease Start', '', 'date', 'Select start date')}
        ${formField('Lease End', '', 'date', 'Select end date')}
        ${formTextarea('Message', '', 'Add a personal message for the tenant (optional)')}
        ${saveBtn('Send Invitation', 'Invitation sent to tenant')}
    </div>`;
}

function screenEditTenant() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    return `${topBar('Edit Tenant', { back: true })}
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-enter">
        <div class="card p-4 bg-[#EFF6FF]">
            <p class="text-[13px] font-semibold text-[#0F172A]">${p.name}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Mid-term Inspection · Currently Feb 28, 2025</p>
        </div>
        ${formField('Inspection Date', '', 'date', 'Select inspection date')}
        ${formSelect('Time Slot', '10:00 AM', ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'])}
        ${formSelect('Type', 'Mid-term Inspection', ['Check-in', 'Mid-term Inspection', 'Check-out', 'Annual'])}
        ${formTextarea('Notes for Inspector', '', 'Access instructions, parking, tenant availability...')}
        ${formField('Notify Tenant', '', 'email', 'Enter tenant email')}
        ${saveBtn('Confirm Reschedule', 'Inspection rescheduled')}
    </div>`;
}

function screenRenewCompliance() {
    const item = COMPLIANCE_ITEMS[STATE.complianceId] || COMPLIANCE_ITEMS[0];
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Renew Certificate', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="${item[0]}" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div><p class="text-[15px] font-bold">${item[1]}</p><p class="text-[12px] text-[#64748B]">${p.name} · Current: ${item[2]}</p></div>
        </div>
        ${formField('Certificate Number', '', 'text', 'Enter certificate reference')}
        ${formField('Issue Date', '', 'date', 'Select issue date')}
        ${formField('Expiry Date', '', 'date', 'Select expiry date')}
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
    <div class="screen-content screen-enter">
        ${formSelect('Condition', room[1], ['Good', 'Fair', 'Poor', 'Needs Repair'])}
        ${formTextarea('Room Notes', '', 'Condition notes for this room')}
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
    <div class="screen-content screen-enter">
        ${formSelect('Type', 'Debit / Credit Card', ['Debit / Credit Card', 'Bank Account'])}
        ${formField('Cardholder Name', '', 'text', 'Enter cardholder name')}
        ${formField('Card Number', '', 'text', '1234 5678 9012 3456')}
        <div class="grid grid-cols-2 gap-4">
            ${formField('Expiry', '', 'text', 'MM/YY')}
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
    <div class="screen-content screen-enter">
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
    <div class="screen-content screen-content-sm screen-enter">
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
    <div class="screen-content screen-enter">
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
        <button data-action="save" data-msg="Issue logged successfully" class="btn-primary w-full py-3.5 text-[14px]">Submit Issue</button>
    </div>`;
}

/* ─── Render & Events ─── */
const SCREEN_MAP = {
    splash: screenSplash,
    onboarding: screenOnboarding,
    'role-select': screenRoleSelect,
    'sign-in': screenSignIn,
    'forgot-password': screenForgotPassword,
    'reset-verify-code': screenResetVerifyCode,
    'reset-password': screenResetPassword,
    'reset-success': screenResetSuccess,
    'sign-up': screenSignUp,
    'sign-up-phone': screenSignUpPhone,
    'verify-otp': screenVerifyOtp,
    welcome: screenWelcome,
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
    const fn = SCREEN_MAP[STATE.screen] || (STATE.userRole === 'contractor' ? screenContractorDashboard : screenDashboard);
    const isPreAuth = PRE_AUTH_SCREENS.includes(STATE.screen);
    const showNav = !NO_NAV.includes(STATE.screen) && !isPreAuth;
    const bodyClass = showNav ? 'screen-body with-nav' : (isPreAuth ? 'screen-body auth-body no-nav' : 'screen-body no-nav');
    const hideChrome = isPreAuth || STATE.screen === 'chat';

    let content;
    if (STATE.screen === 'chat') {
        content = `<div class="screen-body no-nav" style="padding-bottom:0">${fn()}</div>`;
    } else {
        content = `<div class="${bodyClass}">${fn()}</div>`;
    }

    const app = document.getElementById('app');
    app.className = isPreAuth ? 'app-preauth' : '';
    app.innerHTML = (hideChrome ? '' : statusBar()) + content + (showNav ? bottomNav() : '') + (showNav ? fabFloat() : '') + (hideChrome && STATE.screen !== 'splash' ? '' : homeIndicator()) + drawer() + fabMenu() + propFilterSheet();
    lucide.createIcons();
    bindImageFallbacks();
    bindEvents();
    if (STATE.screen === 'splash') {
        clearTimeout(render._splashTimer);
        render._splashTimer = setTimeout(splashContinue, 2500);
    }
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

    const invoiceFilter = e.target.closest('[data-invoice-filter]');
    if (invoiceFilter) { e.preventDefault(); setInvoiceFilter(invoiceFilter.dataset.invoiceFilter); return; }
}

function bindEvents() {
    const app = document.getElementById('app');
    if (!app._delegationBound) {
        app.addEventListener('click', handleAppClick);
        app._delegationBound = true;
    }

    app.querySelectorAll('[data-go]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (e.target.closest('[data-action]')) return;
            const screen = el.dataset.go;
            if (el.dataset.resetReturn) STATE.resetReturnScreen = el.dataset.resetReturn;
            const opts = {};
            if (el.dataset.pid !== undefined) opts.propertyId = +el.dataset.pid;
            if (el.dataset.tid !== undefined) opts.tenantId = +el.dataset.tid;
            if (el.dataset.mid !== undefined) opts.maintId = +el.dataset.mid;
            if (el.dataset.chat !== undefined) opts.chatId = +el.dataset.chat;
            if (el.dataset.iid !== undefined) opts.invoiceId = +el.dataset.iid;
            if (el.dataset.room !== undefined) opts.roomId = +el.dataset.room;
            if (el.dataset.fid !== undefined) opts.faqId = +el.dataset.fid;
            if (el.dataset.cid !== undefined) opts.complianceId = +el.dataset.cid;
            if (el.dataset.pref) opts.prefKey = el.dataset.pref;
            if (el.dataset.pmid !== undefined) opts.paymentId = +el.dataset.pmid;
            if (el.dataset.tab) opts.tab = el.dataset.tab;
            if (el.dataset.job !== undefined) opts.jobId = +el.dataset.job;
            if (el.dataset.jtab) opts.jobTab = el.dataset.jtab;
            go(screen, opts);
        };
    });
    app.querySelectorAll('[data-tab]').forEach(el => {
        el.onclick = () => setTab(el.dataset.tab);
    });
    app.querySelectorAll('[data-ttab]').forEach(el => {
        el.onclick = () => setTenantTab(el.dataset.ttab);
    });
    app.querySelectorAll('[data-tenant-filter]').forEach(el => {
        el.onclick = () => setTenantFilter(el.dataset.tenantFilter);
    });
    app.querySelectorAll('[data-action="tenant-back"]').forEach(el => {
        el.onclick = () => setTenantTab('overview');
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
    app.querySelectorAll('[data-action="logout"]').forEach(el => { el.onclick = logout; });
    app.querySelectorAll('[data-action="toast"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); toast(el.dataset.msg || 'Done'); };
    });
    app.querySelectorAll('[data-action="onboarding-next"]').forEach(el => { el.onclick = nextOnboarding; });
    app.querySelectorAll('[data-action="onboarding-skip"]').forEach(el => { el.onclick = skipOnboarding; });
    app.querySelectorAll('[data-action="onboarding-dot"]').forEach(el => {
        el.onclick = () => setOnboardingStep(+el.dataset.step);
    });
    app.querySelectorAll('[data-action="set-role"]').forEach(el => {
        el.onclick = () => setAuthRole(el.dataset.role);
    });
    app.querySelectorAll('[data-contractor-filter]').forEach(el => {
        el.onclick = () => { STATE.contractorJobFilter = el.dataset.contractorFilter; render(); };
    });
    app.querySelectorAll('[data-jtab]').forEach(el => {
        el.onclick = () => { STATE.contractorJobTab = el.dataset.jtab; render(); };
    });
    app.querySelectorAll('[data-contractor-action]').forEach(el => {
        el.onclick = () => contractorJobAction(el.dataset.contractorAction, el.dataset.msg);
    });
    app.querySelectorAll('[data-action="role-continue"]').forEach(el => {
        el.onclick = roleContinue;
    });
    app.querySelectorAll('[data-action="contractor-signup"]').forEach(el => {
        el.onclick = () => { STATE.authRole = 'contractor'; go('sign-up'); };
    });
    app.querySelectorAll('[data-action="toggle-password"]').forEach(el => { el.onclick = togglePassword; });
    app.querySelectorAll('[data-action="otp-key"]').forEach(el => {
        el.onclick = () => otpPress(el.dataset.key);
    });
    app.querySelectorAll('[data-reset-email]').forEach(el => {
        el.oninput = () => { STATE.resetEmail = el.value; };
    });
    app.querySelectorAll('[data-action="send-reset-code"]').forEach(el => {
        el.onclick = sendResetCode;
    });
    app.querySelectorAll('[data-action="verify-reset-code"]').forEach(el => {
        el.onclick = verifyResetCode;
    });
    app.querySelectorAll('[data-action="toggle-confirm-password"]').forEach(el => {
        el.onclick = toggleConfirmPassword;
    });
    app.querySelectorAll('[data-action="reset-password-done"]').forEach(el => { el.onclick = resetPasswordComplete; });
    app.querySelectorAll('[data-action="reset-success-done"]').forEach(el => { el.onclick = resetSuccessDone; });
    app.querySelectorAll('[data-action="splash-continue"]').forEach(el => {
        el.onclick = splashContinue;
    });
    app.querySelectorAll('[data-action="sign-in"]').forEach(el => {
        el.onclick = () => {
            if (el.dataset.msg) toast(el.dataset.msg);
            signIn();
        };
    });
    app.querySelectorAll('[data-action="start-signup"]').forEach(el => {
        el.onclick = () => go('sign-up-phone');
    });
    app.querySelectorAll('[data-action="mark-maint-complete"]').forEach(el => {
        el.onclick = markMaintComplete;
    });
    app.querySelectorAll('[data-action="enter-app"]').forEach(el => {
        el.onclick = () => enterApp(el.dataset.goAfter);
    });
    if (STATE.fab) {
        app.querySelector('.fab-menu')?.addEventListener('click', e => { if (e.target === e.currentTarget) toggleFab(); });
    }
}

loadAuthSession();
render();
