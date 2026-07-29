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
        emma: avatarUrl('emma'),
        priya: avatarUrl('priya'),
        james: avatarUrl('james'),
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
        propertiesHouse: imgUrl('1600596542815-ffad4c1539a9', 600),
        shieldIcon: 'assets/onboarding-shield.png',
    },
};

const PROPERTIES = [
    { id: 0, name: '12 Park Lane', address: 'London, SW1A 1AA', status: 'Partial', statusColor: ['#DBEAFE','#2563EB'], rent: '£2,450', compliance: true },
    { id: 1, name: '45 Queens Road', address: 'London, SW2 3TR', status: 'Partial', statusColor: ['#DBEAFE','#2563EB'], rent: '£1,850', compliance: true },
    { id: 2, name: '88 King Street', address: 'London, EC2V 8BB', status: 'Vacant', statusColor: ['#FEF3C7','#D97706'], rent: '£2,100', compliance: false },
    { id: 3, name: '15 Victoria Ave', address: 'London, N1 5EH', status: 'Partial', statusColor: ['#DBEAFE','#2563EB'], rent: '£1,950', compliance: true },
];

const STATE = {
    screen: 'splash', tab: 'overview', tenantTab: 'overview', flatTab: 'overview',
    propertyId: 0, tenantId: 0, maintId: 0, invoiceId: 0, roomId: 0, chatId: 0,
    propertiesView: 'grid', propertiesFilter: 'all', showPropFilters: false,
    propertiesAdvanced: { rent: 'all', beds: 'any' },
    search: { properties: '', tenants: '', messages: '', contractors: '', global: '', maintenance: '' },
    maintFilter: 'open', invoiceFilter: 'pending', logPriority: 'Medium',
    maintScopeFilter: 'all',
    logMaintScope: 'unit', logMaintCommunalArea: 'Hallway',
    onboardingStep: 0, authRole: 'landlord', userRole: 'landlord', otpDigits: [], otpContext: 'signup',
    showPassword: false, showConfirmPassword: false, resetEmail: '',
    isAuthenticated: false, onboardingComplete: false, authReturnScreen: 'sign-in',
    signInOrigin: 'role-select', resetReturnScreen: 'sign-in',
    toggles: {
        'rent-reminders': true, 'maintenance-updates': true, 'compliance-alerts': true,
        'new-messages': true, 'marketing-emails': false, 'weekly-summary': true, 'biometric': true,
    },
    drawer: false, fab: false, faqId: 0, faqOpenId: null, complianceId: 0, prefKey: '', paymentId: 0, noteId: 0,
    helpReturnScreen: 'dashboard', faqReturnScreen: 'help-support',
    docReturnScreen: 'property-detail', legalReturnScreen: 'profile',
    contractorJobId: 0, contractorJobFilter: 'all', contractorJobTab: 'overview',
    tenantFilter: 'all', unitFilter: 'all', showUnitFilters: false, showPropertyMore: false,
    collapsedFloors: {},
    tenantInviteToken: null,
    activeTenantId: 0,
    signupEmail: '',
    signupDraft: null,
    selectedUnit: null,
    flatDuplicateFrom: null,
    logMaintPrefill: null,
    inspectionPhotos: [],
    inspectionRating: 4,
    inspectionPrefill: null,
    inspectionId: 0,
    photoMenuIdx: null,
    actionMenuKey: null,
    inviteReturn: null,
    inviteStep: 1,
    inviteDraft: null,
    renameDocId: null,
    newMessagePicker: false,
    screenLoading: null,
    faqCameFromFaq: false,
    rentReceiveIds: [],
    rentReceiveDate: '',
    rentPaymentMethod: 'bank',
    rentReturnScreen: null,
    rentReceiveUnitFilter: null,
    txnReturnScreen: null,
    flatReturn: null,
    propertyMaintUnit: null,
    navStack: [],
};

let TENANT_INVITATIONS = [
    { id: 0, token: 'DEMO-88KS', firstName: 'Emma', lastName: 'Roberts', email: 'emma.r@email.com', phone: '+44 7700 900459', propertyId: 2, unit: 'Main Flat', rent: '£2,100', leaseStart: '2025-04-01', leaseEnd: '2026-03-31', message: 'Welcome to your new home!', landlord: 'John Smith', status: 'pending', sentAt: 'Mar 10, 2025' },
];

let TENANT_ACCOUNTS = [];

let LANDLORD_ACCOUNTS = [];
let CONTRACTOR_ACCOUNTS = [];

const DEMO_CREDENTIALS = {
    landlord: { email: 'john@landlordhq.co.uk', password: 'Password1' },
    tenant: { email: 'sarah.j@email.com', password: 'Password1' },
    contractor: { email: 'mike@plumberpro.co.uk', password: 'Password1' },
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function loadLandlordAccounts() {
    try {
        const raw = sessionStorage.getItem('lhq_landlord_accounts');
        if (raw) {
            LANDLORD_ACCOUNTS = JSON.parse(raw);
            return;
        }
    } catch (_) { /* ignore */ }
    LANDLORD_ACCOUNTS = [{
        id: 0, firstName: 'John', lastName: 'Smith',
        email: 'john@landlordhq.co.uk', password: 'Password1',
    }];
    saveLandlordAccounts();
}

function saveLandlordAccounts() {
    sessionStorage.setItem('lhq_landlord_accounts', JSON.stringify(LANDLORD_ACCOUNTS));
}

function landlordAccountByEmail(email) {
    return LANDLORD_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
}

function loadTenantData() {
    try {
        const invites = sessionStorage.getItem('lhq_tenant_invites');
        const accounts = sessionStorage.getItem('lhq_tenant_accounts');
        if (invites) TENANT_INVITATIONS = JSON.parse(invites);
        if (accounts) TENANT_ACCOUNTS = JSON.parse(accounts);
    } catch (_) { /* ignore */ }
}

function saveTenantData() {
    sessionStorage.setItem('lhq_tenant_invites', JSON.stringify(TENANT_INVITATIONS));
    sessionStorage.setItem('lhq_tenant_accounts', JSON.stringify(TENANT_ACCOUNTS));
}

function ensureDemoTenantAccount() {
    if (tenantAccountByEmail(DEMO_CREDENTIALS.tenant.email)) return;
    TENANT_ACCOUNTS.push({
        id: 0,
        inviteToken: 'DEMO-TENANT',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: DEMO_CREDENTIALS.tenant.email,
        phone: '+44 7700 900456',
        propertyId: 0,
        unit: 'Flat 2A',
        rent: '£2,450',
        leaseStart: 'Jan 2024',
        leaseEnd: 'Jan 2026',
        landlord: 'John Smith',
        password: DEMO_CREDENTIALS.tenant.password,
    });
    saveTenantData();
}

function loadContractorAccounts() {
    try {
        const raw = sessionStorage.getItem('lhq_contractor_accounts');
        if (raw) {
            CONTRACTOR_ACCOUNTS = JSON.parse(raw);
            return;
        }
    } catch (_) { /* ignore */ }
    CONTRACTOR_ACCOUNTS = [{
        id: 0,
        firstName: 'Mike',
        lastName: 'Thompson',
        email: DEMO_CREDENTIALS.contractor.email,
        company: 'Plumber Pro Ltd',
        trade: 'Plumbing & Heating',
        password: DEMO_CREDENTIALS.contractor.password,
    }];
    saveContractorAccounts();
}

function saveContractorAccounts() {
    sessionStorage.setItem('lhq_contractor_accounts', JSON.stringify(CONTRACTOR_ACCOUNTS));
}

function contractorAccountByEmail(email) {
    return CONTRACTOR_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
}

function signInSubtitle() {
    if (STATE.authRole === 'tenant') return 'Sign in to your tenant portal with email and password';
    if (STATE.authRole === 'contractor') return 'Sign in to your contractor workspace';
    return 'Sign in with your landlord email and password';
}

function authDemoCard() {
    const role = STATE.authRole || 'landlord';
    const labels = { landlord: 'Landlord', tenant: 'Tenant', contractor: 'Contractor' };
    const label = labels[role] || 'Landlord';
    return `
    <div class="auth-demo-card">
        <div class="auth-demo-head">
            <span class="auth-demo-badge">Prototype</span>
            <p class="auth-demo-title">Quick login</p>
        </div>
        <p class="auth-demo-creds">
            <span>Enter as ${label}</span>
            <span>No email or password needed — tap below to continue.</span>
        </p>
        <button type="button" data-action="demo-login" data-demo-role="${role}" class="auth-demo-btn">Enter as ${label}</button>
    </div>`;
}

function roleContinueLabel() {
    const role = AUTH_ROLES.find(r => r.id === (STATE.authRole || 'landlord'));
    return role ? `Enter as ${role.title}` : 'Enter app';
}

function completeDemoLogin(role) {
    const demo = DEMO_CREDENTIALS[role];
    if (!demo) return;
    STATE.authRole = role;
    STATE.showPassword = false;
    if (role === 'landlord') {
        const account = landlordAccountByEmail(demo.email);
        if (!account) {
            toast('Demo landlord account not found');
            return;
        }
        LANDLORD_USER.firstName = account.firstName;
        LANDLORD_USER.lastName = account.lastName;
        LANDLORD_USER.email = account.email;
        if (typeof AppStore !== 'undefined') AppStore.save();
    }
    if (role === 'tenant') {
        loadTenantData();
        ensureDemoTenantAccount();
        const account = tenantAccountByEmail(demo.email);
        if (!account) {
            toast('Demo tenant account not available');
            return;
        }
        STATE.activeTenantId = account.id;
    }
    if (role === 'contractor') {
        loadContractorAccounts();
        if (!contractorAccountByEmail(demo.email)) {
            toast('Demo contractor account not available');
            return;
        }
    }
    clearNavStack();
    STATE.isAuthenticated = true;
    STATE.userRole = role;
    saveAuthSession();
    go(getRoleHome());
    const name = role === 'landlord' ? LANDLORD_USER.firstName
        : role === 'tenant' ? getActiveTenant()?.firstName || 'Tenant'
        : 'Mike';
    setTimeout(() => toast(`Welcome back, ${name}!`), 50);
}

function demoLogin(role) {
    completeDemoLogin(role || STATE.authRole || 'landlord');
}

const tenantInviteByToken = (token) => TENANT_INVITATIONS.find(i => i.token === token);
const tenantAccountByEmail = (email) => TENANT_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
const getActiveTenant = () => {
    if (STATE.activeTenantId != null) {
        const match = TENANT_ACCOUNTS.find(a => a.id === STATE.activeTenantId);
        if (match) return match;
    }
    return TENANT_ACCOUNTS.length === 1 ? TENANT_ACCOUNTS[0] : null;
};

const makeInviteToken = () => `INV-${Date.now().toString(36).toUpperCase().slice(-6)}`;

const MAINTENANCE_ITEMS = [
    { id: 0, issue:'Kitchen sink leaking', prop:'12 Park Lane', unit:'Flat 2A', time:'2h ago', priority:'High', contractor:'Plumber Pro', status:'open', propertyId: 0, photos: [IMG.maint[0]], desc:'Water dripping from pipe under kitchen sink. Tenant reports it started this morning.', reportedBy:'tenant', tenantName:'Sarah Johnson', reportedAt:'2h ago' },
    { id: 1, issue:'Window latch broken', prop:'88 King Street', unit:'Main Flat', time:'1d ago', priority:'Medium', contractor:'—', status:'open', propertyId: 2, photos: [IMG.maint[1]], desc:'Bedroom window latch broken — window cannot be secured. Unit currently vacant.', reportedBy:'landlord' },
    { id: 2, issue:'Damp patch in bedroom', prop:'12 Park Lane', unit:'Flat 2A', time:'2d ago', priority:'Low', contractor:'—', status:'open', propertyId: 0, photos: [IMG.maint[2]], desc:'Damp patch appearing on bedroom wall near window frame. Getting worse after recent rain.', reportedBy:'tenant', tenantName:'Sarah Johnson', reportedAt:'2d ago' },
    { id: 3, issue:'Boiler not working', prop:'45 Queens Road', unit:'Flat 1A', time:'3d ago', priority:'High', contractor:'Heating Co.', status:'progress', propertyId: 1, photos: [IMG.maint[2]], desc:'No hot water or heating. Boiler showing error code E119.', reportedBy:'tenant', tenantName:'David Wilson', reportedAt:'3d ago' },
    { id: 4, issue:'Radiator not heating', prop:'15 Victoria Ave', unit:'Flat 2A', time:'4d ago', priority:'Medium', contractor:'Heating Co.', status:'progress', propertyId: 3, photos: [IMG.maint[1]], desc:'Living room radiator cold while others work. Possible air lock or valve issue.', reportedBy:'tenant', tenantName:'Michael Lee', reportedAt:'4d ago' },
    { id: 5, issue:'Light flickering', prop:'15 Victoria Ave', unit:'Flat 2B', time:'5d ago', priority:'Low', contractor:'Electric Fix', status:'done', propertyId: 3, photos: [IMG.maint[2]], desc:'Living room ceiling light flickering — resolved with new fitting.', reportedBy:'tenant', tenantName:'Michael Lee', reportedAt:'5d ago' },
    { id: 6, issue:'Tap replaced', prop:'45 Queens Road', unit:'Flat 1A', time:'1w ago', priority:'Low', contractor:'Plumber Pro', status:'done', propertyId: 1, photos: [IMG.maint[0]], desc:'Kitchen tap replaced. No further issues reported.', reportedBy:'landlord', scope:'unit' },
    { id: 7, issue:'Hallway light out', prop:'12 Park Lane', unit:'Communal', scope:'communal', communalArea:'Hallway', time:'6h ago', priority:'Medium', contractor:'—', status:'open', propertyId: 0, photos: [IMG.maint[1]], desc:'Main entrance hallway ceiling light not working. Affects all residents.', reportedBy:'landlord' },
];

const COMMUNAL_AREAS = ['Hallway', 'Stairwell', 'Roof', 'Garden', 'Boiler room', 'Other'];

const maintItem = (id) => MAINTENANCE_ITEMS.find(m => m.id === id) || MAINTENANCE_ITEMS[0];

const LANDLORD_USER = {
    firstName: 'John', lastName: 'Smith', email: 'john@landlordhq.co.uk',
    phone: '+44 7700 900123', address: '14 Oakwood Drive, London, SW1A 2AA',
    subscriptionPlanId: 'pro',
};

const SUBSCRIPTION_PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: 9,
        tagline: 'Your first few lets',
        properties: 'Up to 3 properties',
        features: ['Up to 3 properties', 'Unlimited tenants', 'Rent & invoice tracking', 'Maintenance log', 'Email support'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 19,
        tagline: 'Growing portfolios',
        properties: 'Up to 20 properties',
        popular: true,
        features: ['Up to 20 properties', 'Compliance reminders', 'Inventory & inspections', 'Contractor jobs', 'Priority support'],
    },
    {
        id: 'portfolio',
        name: 'Portfolio',
        price: 39,
        tagline: 'Professional landlords',
        properties: 'Unlimited properties',
        features: ['Unlimited properties', 'Team access (3 seats)', 'Advanced reporting', 'Bulk document export', 'Dedicated account manager'],
    },
];

function getSubscriptionPlan(id) {
    return SUBSCRIPTION_PLANS.find(p => p.id === id) || SUBSCRIPTION_PLANS.find(p => p.id === 'pro');
}

function setSubscriptionPlan(id) {
    if (!SUBSCRIPTION_PLANS.some(p => p.id === id)) return;
    LANDLORD_USER.subscriptionPlanId = id;
    if (typeof AppStore !== 'undefined' && AppStore.save) AppStore.save();
    render();
}
const FAQ_BY_ROLE = {
    landlord: [
        { id: 0, cat: 'Getting Started', q: 'How do I add a new property?', a: 'Tap the + button (bottom right) and select Add Property, or go to Properties → Add. Enter the address and unit details — your building appears in your portfolio immediately.' },
        { id: 1, cat: 'Getting Started', q: 'How do I invite a tenant?', a: 'Go to Tenants → Invite Tenant, choose the property and unit, then enter their details. We\'ll email a secure invitation link. Once accepted, their profile links to the unit automatically.' },
        { id: 2, cat: 'Rent & Payments', q: 'How does rent collection work?', a: 'Landlord HQ tracks rent due dates and payment status on the Financial screen. Mark rent received when payment arrives, or create invoices for tenants. Overdue rent is highlighted on your dashboard.' },
        { id: 3, cat: 'Rent & Payments', q: 'Can I export financial reports?', a: 'Go to Financial → Payment history, or open any invoice and tap Download PDF for a record of that payment.' },
        { id: 4, cat: 'Maintenance', q: 'How do I log a maintenance issue?', a: 'Use the + FAB menu and select "Log Maintenance", or open a property → Maintenance section → "Log New Issue". Add a title, priority, description, and photos.' },
        { id: 5, cat: 'Maintenance', q: 'How are contractors assigned?', a: 'Assign contractors from the maintenance detail screen. The job is sent to their contractor app, and you\'ll be notified when work is submitted or invoiced.' },
        { id: 6, cat: 'Compliance', q: 'What compliance documents should I track?', a: 'We recommend tracking Gas Safety Certificate, Electrical Installation Condition Report (EICR), EPC rating, smoke/CO alarms, landlord insurance, and Right to Rent checks. Reminders appear on your dashboard.' },
        { id: 7, cat: 'Account', q: 'How do I change my password?', a: 'Go to Profile → Change Password. Enter your current password, then your new password twice.' },
        { id: 8, cat: 'Account', q: 'How do I update my account details?', a: 'Open Profile → Personal Information to update your name, email, and contact details. Change your password under Security.' },
    ],
    tenant: [
        { id: 0, cat: 'Getting Started', q: 'How do I activate my tenant account?', a: 'Tenant accounts are invitation-only. Open the secure link from your landlord, set a password, and your portal will link to your property automatically.' },
        { id: 1, cat: 'Getting Started', q: 'What can I see on my dashboard?', a: 'Your home details, next rent due date, maintenance request status, and quick actions to report issues or message your landlord.' },
        { id: 2, cat: 'Rent & Payments', q: 'How do I pay rent?', a: 'Your rent due date appears on your dashboard. Pay using the method agreed with your landlord (bank transfer, standing order, etc.). Payment status updates when your landlord records it.' },
        { id: 3, cat: 'Rent & Payments', q: 'Who receives my rent payment?', a: 'Rent is paid directly to your landlord through their configured payment method. Landlord HQ tracks status but does not hold tenant funds.' },
        { id: 4, cat: 'Maintenance', q: 'How do I report a maintenance issue?', a: 'Tap Report Issue on your dashboard or Issues tab. Your property is pre-selected. Add a title, priority, description, and photos — your landlord is notified immediately.' },
        { id: 5, cat: 'Maintenance', q: 'Who handles repairs in my home?', a: 'Your landlord manages repairs and may assign a contractor. You can track progress on your dashboard and message your landlord for updates.' },
        { id: 6, cat: 'Messages', q: 'How do I contact my landlord?', a: 'Go to Messages to chat with your landlord. You can also reach them about urgent issues after reporting a maintenance request.' },
        { id: 7, cat: 'Account', q: 'Can I update my contact details?', a: 'View your details under Account. Contact your landlord if any tenancy-related information needs updating on your lease record.' },
        { id: 8, cat: 'Account', q: 'How do I sign out?', a: 'Open Account from the bottom navigation and tap Sign Out. Use the same email and password to sign back in later.' },
    ],
    contractor: [
        { id: 0, cat: 'Getting Started', q: 'How do I receive new jobs?', a: 'When a landlord assigns you to a maintenance job, it appears under Jobs with status Assigned. You\'ll also get a notification on your dashboard.' },
        { id: 1, cat: 'Jobs', q: 'How do I accept and schedule a visit?', a: 'Open the job → Accept Job → Schedule Visit. Pick a date and time, then confirm. The landlord and tenant are notified of your visit.' },
        { id: 2, cat: 'Jobs', q: 'How do I upload photos and notes?', a: 'On the job detail screen, open Work & Photos. Add before, during, and after photos plus on-site notes so the landlord has a full record.' },
        { id: 3, cat: 'Jobs', q: 'How do I submit an invoice?', a: 'After completing work, go to the Invoice tab, enter the amount, upload your invoice PDF, and mark the job complete. The landlord reviews and pays from their Financial screen.' },
        { id: 4, cat: 'Payments', q: 'When do I get paid?', a: 'After the landlord approves your invoice, payment is recorded in the app. Bank transfer timing depends on your agreement with the landlord.' },
        { id: 5, cat: 'Messages', q: 'Can I message the tenant or landlord?', a: 'Yes. Each job links to the relevant chats. Use Message Tenant for access arrangements and Message Landlord for approvals or scope changes.' },
        { id: 6, cat: 'Compliance', q: 'What certifications should I keep updated?', a: 'Keep Gas Safe, public liability insurance, and trade certifications current. Upload certificates on the job or in Company Information.' },
        { id: 7, cat: 'Account', q: 'How do I update company details?', a: 'Go to Profile → Company Information to update your business name, trade category, VAT number, and contact details.' },
        { id: 8, cat: 'Account', q: 'How do I change my password?', a: 'Go to Profile → Change Password. Use a strong password to protect your contractor account and job history.' },
    ],
};

const PRIVACY_BY_ROLE = {
    landlord: [
        ['Introduction', ['Landlord HQ Ltd ("we", "us") respects your privacy. This policy explains how we collect, use, and protect your personal data when you use the Landlord HQ landlord application.', 'As a landlord, you may also store tenant and property data — you are responsible for handling that data lawfully under UK GDPR.']],
        ['Information We Collect', ['Account details: name, email, phone, billing information.', 'Property data: addresses, tenancy records, compliance documents, and financial records.', 'Tenant data you upload: contact details, lease documents, and maintenance history.']],
        ['How We Use Your Data', ['To manage your property portfolio, tenants, rent tracking, and maintenance workflows.', 'To send compliance reminders, payment alerts, and contractor notifications.', 'To generate financial reports and invoices.']],
        ['Data Sharing', ['We share data only with service providers (payments, hosting) under strict agreements. Tenant data is visible only to you and invited tenants.', 'We do not sell personal data.']],
        ['Your Rights', ['Under UK GDPR you may access, rectify, or delete your account data. Contact privacy@landlordhq.com.', 'You must also honour tenant data rights for information you hold about tenants.']],
        ['Contact Us', ['privacy@landlordhq.com · Landlord HQ Ltd, 42 Baker Street, London, W1U 7AJ']],
    ],
    tenant: [
        ['Introduction', ['This policy explains how Landlord HQ handles your data as a tenant using the portal invited by your landlord.', 'Your landlord controls your tenancy record. Landlord HQ processes data on their behalf to provide the tenant portal.']],
        ['Information We Collect', ['Account details: name, email, phone, and password you set during activation.', 'Tenancy data: property, unit, rent amount, and lease dates provided by your landlord.', 'Activity data: maintenance requests, messages, and payment status visible in your portal.']],
        ['How We Use Your Data', ['To show your home details, rent due dates, and maintenance request status.', 'To let you message your landlord and report issues.', 'To send rent reminders and maintenance updates if enabled by your landlord.']],
        ['Who Can See Your Data', ['Your landlord can see your profile, messages, and maintenance requests for their properties.', 'Contractors assigned to your issue may see access details needed to complete the job.', 'We do not sell your data to third parties.']],
        ['Your Rights', ['You may request access, correction, or deletion of your portal account data via privacy@landlordhq.com.', 'For lease or rent disputes, contact your landlord directly.']],
        ['Contact Us', ['privacy@landlordhq.com · Landlord HQ Ltd, 42 Baker Street, London, W1U 7AJ']],
    ],
    contractor: [
        ['Introduction', ['This policy covers how Landlord HQ processes data for contractors using the job management workspace.', 'You receive jobs from landlords who use Landlord HQ to manage their properties.']],
        ['Information We Collect', ['Business profile: company name, trade, registrations, insurance, and contact details.', 'Job data: visit schedules, photos, notes, certificates, and invoices you upload.', 'Communications with landlords and tenants related to assigned jobs.']],
        ['How We Use Your Data', ['To deliver assigned maintenance jobs and share progress with landlords.', 'To store invoices and certificates linked to completed work.', 'To send job alerts, visit reminders, and payment status updates.']],
        ['Data Sharing', ['Job details are shared with the assigning landlord and, where relevant, the tenant for property access.', 'We use secure cloud providers to store photos and documents.', 'We do not sell contractor data.']],
        ['Your Rights', ['Request access, correction, or deletion of your contractor account via privacy@landlordhq.com.', 'Retain copies of your own invoices and certificates for your business records.']],
        ['Contact Us', ['privacy@landlordhq.com · Landlord HQ Ltd, 42 Baker Street, London, W1U 7AJ']],
    ],
};

const TERMS_BY_ROLE = {
    landlord: [
        ['Agreement', ['These Terms govern your use of Landlord HQ as a property owner or manager. By using the app, you accept these Terms in full.']],
        ['Account Registration', ['You must provide accurate information and keep login credentials secure. You must be 18+ and legally able to manage rental properties.']],
        ['Your Responsibilities', ['You are solely responsible for compliance with UK landlord-tenant law, deposit protection, licensing, and safety certificates.', 'Landlord HQ is a management tool — it does not provide legal advice.']],
        ['Subscription & Payments', ['Billing and plan management is handled separately from the mobile app.', 'Contact support@landlordhq.com for billing questions.']],
        ['Tenant & Contractor Data', ['You must have lawful grounds to store tenant data and only invite tenants who have agreed to use the portal.', 'Contractor assignments should follow your own service agreements.']],
        ['Limitation of Liability', ['Landlord HQ is provided "as is". We are not liable for indirect damages or losses arising from tenancy disputes or missed compliance deadlines.']],
        ['Governing Law', ['These Terms are governed by the laws of England and Wales.']],
    ],
    tenant: [
        ['Agreement', ['These Terms govern your use of the Landlord HQ tenant portal. Access is by landlord invitation only.']],
        ['Account Activation', ['You must activate your account via the invitation link and keep your password secure.', 'Do not share your login or allow others to access your tenancy portal.']],
        ['Acceptable Use', ['Use the portal to communicate with your landlord, report genuine maintenance issues, and view tenancy information.', 'Do not upload false reports, abusive messages, or unrelated content.']],
        ['Rent & Payments', ['Rent payment terms are between you and your landlord. Landlord HQ displays status but is not a party to your tenancy agreement.']],
        ['Maintenance Requests', ['Report issues accurately and allow reasonable access for repairs arranged by your landlord or their contractors.']],
        ['Termination', ['Your landlord may deactivate portal access when your tenancy ends. You may sign out at any time from Account settings.']],
        ['Governing Law', ['These Terms are governed by the laws of England and Wales. Your tenancy agreement with your landlord is separate.']],
    ],
    contractor: [
        ['Agreement', ['These Terms govern your use of Landlord HQ as a contractor receiving jobs from landlords on the platform.']],
        ['Account & Profile', ['Keep company details, insurance, and trade certifications accurate and up to date.', 'You are responsible for the security of your account and any staff who use it.']],
        ['Job Performance', ['Accept jobs only when you can attend within a reasonable timeframe. Update visit schedules promptly.', 'Complete work to a professional standard and upload accurate photos, notes, and invoices.']],
        ['Invoicing & Payment', ['Submit invoices for completed work as agreed with the landlord. Payment timing is between you and the assigning landlord.', 'Landlord HQ records payment status when the landlord marks an invoice as paid.']],
        ['Safety & Compliance', ['Hold valid insurance and trade registrations required for the work undertaken. Upload certificates when requested.']],
        ['Limitation of Liability', ['Landlord HQ facilitates job assignment but is not liable for disputes between you and landlords or tenants regarding workmanship or payment.']],
        ['Governing Law', ['These Terms are governed by the laws of England and Wales.']],
    ],
};

const HELP_BY_ROLE = {
    landlord: {
        intro: 'Quick answers for managing properties, tenants, and compliance — or reach our team directly.',
        faqSub: 'Landlord guides & common questions',
        supportTitle: 'Contact Support',
        supportSub: 'Chat with our landlord success team',
    },
    tenant: {
        intro: 'Help using your tenant portal — rent, maintenance, and messaging your landlord.',
        faqSub: 'Tenant portal questions answered',
        supportTitle: 'Contact Support',
        supportSub: 'Email our team for account help',
    },
    contractor: {
        intro: 'Help with jobs, invoicing, and working with landlords on the platform.',
        faqSub: 'Contractor workspace questions answered',
        supportTitle: 'Contact Support',
        supportSub: 'Email our contractor support team',
    },
};

const ABOUT_BY_ROLE = {
    landlord: {
        tagline: 'Property management made simple',
        body: [
            'Landlord HQ helps UK property owners manage tenants, track rent, handle maintenance, and stay compliant — all from one app.',
            'Built for landlords who want clarity without complexity.',
        ],
    },
    tenant: {
        tagline: 'Your home, organised',
        body: [
            'The Landlord HQ tenant portal lets you view your tenancy, report maintenance issues, and message your landlord in one place.',
            'Access is by invitation only — your landlord sets up your account securely.',
        ],
    },
    contractor: {
        tagline: 'Jobs, visits, invoices — in one place',
        body: [
            'The Landlord HQ contractor workspace helps you accept jobs, schedule visits, document work, and submit invoices to landlords.',
            'Built for tradespeople who want less admin and faster approvals.',
        ],
    },
};

const faqItemsForRole = () => FAQ_BY_ROLE[STATE.userRole] || FAQ_BY_ROLE.landlord;
const faqItemById = (id) => faqItemsForRole().find(f => f.id === id) || faqItemsForRole()[0];
const profileHomeScreen = () => ({
    landlord: 'profile',
    tenant: 'personal-info',
    contractor: 'contractor-profile',
}[STATE.userRole] || 'profile');
const helpReturnHome = () => getRoleHome();
const legalReturnHome = () => profileHomeScreen();

const FAQ_ITEMS = FAQ_BY_ROLE.landlord;

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
        <button type="button" data-faq-toggle="${f.id}" class="faq-row w-full text-left ${i < list.length - 1 ? 'border-b border-[#F1F5F9]' : ''}">
            <p class="text-[14px] font-semibold text-[#0F172A] leading-snug">${f.q}</p>
            <p class="text-[11px] text-[#64748B] mt-1">${f.cat}</p>
            <i data-lucide="chevron-right" class="faq-chevron w-5 h-5 text-[#CBD5E1]"></i>
        </button>`).join('')}
    </div>`;
};

const TENANT_TABS = ['overview','personal','contact','property','documents','payments','maintenance','notes','activity'];

const TENANT_LIST = [
    { id: 0, propertyId: 0, chatId: 0, name: 'Sarah Johnson', prop: '12 Park Lane', unit: 'Flat 2A', lease: 'Jan 2024 – Jan 2027', leaseEnd: 'Jan 2027', img: IMG.avatar.sarah, status: 'active', rent: '£2,450/mo' },
    { id: 1, propertyId: 1, chatId: 2, name: 'David Wilson', prop: '45 Queens Road', unit: 'Flat 1A', lease: 'Jun 2023 – Jun 2027', leaseEnd: 'Jun 2027', img: IMG.avatar.david, status: 'active', rent: '£1,850/mo' },
    { id: 2, propertyId: 3, chatId: 4, name: 'Michael Lee', prop: '15 Victoria Ave', unit: 'Flat 2A', lease: 'Mar 2024 – Mar 2027', leaseEnd: 'Mar 2027', img: IMG.avatar.michael, status: 'active', rent: '£1,950/mo' },
    { id: 3, propertyId: 2, chatId: null, name: 'Emma Roberts', prop: '88 King Street', unit: 'Main Flat', lease: 'Ended Dec 2024', leaseEnd: 'Dec 2024', img: IMG.avatar.emma, status: 'inactive', rent: '—' },
    { id: 4, propertyId: 0, chatId: null, name: 'Priya Sharma', prop: '12 Park Lane', unit: 'Flat 2B', lease: 'Jun 2024 – May 2027', leaseEnd: 'May 2027', img: IMG.avatar.priya, status: 'active', rent: '£2,200/mo' },
    { id: 5, propertyId: 0, chatId: null, name: 'James Chen', prop: '12 Park Lane', unit: 'Flat 2B', lease: 'Jun 2024 – May 2027', leaseEnd: 'May 2027', img: IMG.avatar.james, status: 'pending', rent: '£2,200/mo' },
];

const TENANT_MENU = [
    { group: 'Tenant', items: [
        ['user', 'Personal & ID', 'personal'],
        ['phone', 'Contact', 'contact'],
        ['building-2', 'Tenancy', 'property'],
    ]},
    { group: 'Records', items: [
        ['folder-open', 'Documents', 'documents'],
        ['wallet', 'Payments', 'payments'],
        ['wrench', 'Maintenance', 'maintenance'],
        ['sticky-note', 'Notes', 'notes'],
        ['activity', 'Activity', 'activity'],
    ]},
];

const TENANTS = [
    { id:0, propertyId:0, firstName:'Sarah', lastName:'Johnson', email:'sarah.j@email.com', phone:'+44 7700 900456', prop:'12 Park Lane', unit:'Flat 2A', idNumber:'4859217360', nidProof:'NID Proof.jpg', dob:'1992-04-18', rent:'2450', moveIn:'2024-01-15', leaseEnd:'2027-01-14', emergency:'James Johnson', emergencyPhone:'+44 7700 900789' },
    { id:1, propertyId:1, firstName:'David', lastName:'Wilson', email:'david.w@email.com', phone:'+44 7700 900457', prop:'45 Queens Road', unit:'Flat 1A', idNumber:'7391045826', nidProof:'NID Proof.jpg', dob:'1988-11-02', rent:'1850', moveIn:'2023-06-01', leaseEnd:'2027-05-31', emergency:'Lisa Wilson', emergencyPhone:'+44 7700 900790' },
    { id:2, propertyId:3, firstName:'Michael', lastName:'Lee', email:'michael.lee@email.com', phone:'+44 7700 900458', prop:'15 Victoria Ave', unit:'Flat 2A', idNumber:'6028471935', nidProof:'NID Proof.jpg', dob:'1990-07-09', rent:'1950', moveIn:'2024-03-10', leaseEnd:'2027-03-09', emergency:'Anna Lee', emergencyPhone:'+44 7700 900791' },
    { id:3, propertyId:2, firstName:'Emma', lastName:'Roberts', email:'emma.r@email.com', phone:'+44 7700 900459', prop:'88 King Street', unit:'Main Flat', idNumber:'9183746502', nidProof:'NID Proof.jpg', dob:'1995-01-22', rent:'2100', moveIn:'2022-01-01', leaseEnd:'2024-12-01', emergency:'—', emergencyPhone:'—' },
    { id:4, propertyId:0, firstName:'Priya', lastName:'Sharma', email:'priya.sh@email.com', phone:'+44 7700 900501', prop:'12 Park Lane', unit:'Flat 2B', idNumber:'3849201756', nidProof:'NID Proof.jpg', dob:'1993-08-14', rent:'2200', moveIn:'2024-06-01', leaseEnd:'2027-05-31', emergency:'Raj Sharma', emergencyPhone:'+44 7700 900502' },
    { id:5, propertyId:0, firstName:'James', lastName:'Chen', email:'james.chen@email.com', phone:'+44 7700 900503', prop:'12 Park Lane', unit:'Flat 2B', idNumber:'5928173046', nidProof:'', dob:'1994-02-03', rent:'2200', moveIn:'2024-06-01', leaseEnd:'2027-05-31', emergency:'—', emergencyPhone:'—' },
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
const NO_NAV = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','forgot-password','reset-verify-code','reset-password','reset-success','chat','tenant-detail','property-detail','flat-detail','flat-members','tenancy-detail','maintenance-detail','maintenance-history','invoice-detail','inventory-room','document-preview','personal-info','notifications-settings','security','password','preferences','payment-methods','subscription','help-support','faq','faq-detail','privacy','terms','about','add-property','log-maintenance','notifications-list','transaction-history','edit-property','edit-flat','add-flat','invite-tenant','tenant-invite-sent','edit-tenant','reschedule-inspection','renew-compliance','edit-inventory-room','add-payment-method','edit-payment-method','edit-preference','tenant-add-note','tenant-edit-note','select-property-invite','global-search'];

const PRE_AUTH_SCREENS = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','contractor-invite','contractor-welcome','tenant-invite','tenant-activate','tenant-welcome','forgot-password','reset-verify-code','reset-password','reset-success'];
const PUBLIC_SCREENS = [...PRE_AUTH_SCREENS];

const NAV_MAIN_TABS = new Set([
    'dashboard', 'properties', 'financial', 'maintenance', 'messages', 'tenants', 'profile',
    'tenant-dashboard', 'contractor-dashboard', 'contractor-jobs', 'contractor-profile', 'personal-info',
]);

const FLAT_QUICK_ACTION_SCREENS = new Set([
    'log-maintenance', 'flat-rent-history', 'unit-utilities', 'flat-members',
    'property-detail', 'mark-rent-received', 'maintenance-detail', 'invite-tenant',
    'create-tenancy', 'conduct-inspection',
]);

function setFlatReturnFromDetail() {
    if (STATE.propertyId != null && STATE.selectedUnit) {
        STATE.flatReturn = { propertyId: STATE.propertyId, unit: STATE.selectedUnit };
    }
}

function restoreFlatDetailNav() {
    const ret = STATE.flatReturn;
    if (!ret?.unit) return false;
    STATE.flatReturn = null;
    go('flat-detail', { propertyId: ret.propertyId, unit: ret.unit, noHistory: true });
    return true;
}

function snapshotNav() {
    return {
        screen: STATE.screen,
        tab: STATE.tab,
        tenantTab: STATE.tenantTab,
        propertyId: STATE.propertyId,
        tenantId: STATE.tenantId,
        maintId: STATE.maintId,
        invoiceId: STATE.invoiceId,
        roomId: STATE.roomId,
        chatId: STATE.chatId,
        selectedUnit: STATE.selectedUnit,
        contractorJobId: STATE.contractorJobId,
        contractorJobTab: STATE.contractorJobTab,
        shareDocId: STATE.shareDocId,
        invoiceFilter: STATE.invoiceFilter,
    };
}

function restoreNav(snap) {
    Object.assign(STATE, snap, { drawer: false, fab: false, showPropFilters: false });
    render();
}

function clearNavStack() {
    STATE.navStack = [];
}

function shouldRecordNav(from, to) {
    if (!from || from === to || from === 'splash') return false;
    if (PRE_AUTH_SCREENS.includes(from) || PRE_AUTH_SCREENS.includes(to)) return false;
    return true;
}

function recordNavHistory(from, to, opts = {}) {
    if (opts.noHistory) return;
    if (opts.resetNav) {
        clearNavStack();
        STATE.flatReturn = null;
        return;
    }
    if (NAV_MAIN_TABS.has(to) && to !== from) {
        clearNavStack();
        STATE.flatReturn = null;
        return;
    }
    if (shouldRecordNav(from, to)) {
        STATE.navStack.push(snapshotNav());
        if (STATE.navStack.length > 40) STATE.navStack.shift();
    }
}

function loadAuthSession() {
    try {
        const raw = sessionStorage.getItem('lhq_auth');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.isAuthenticated) STATE.isAuthenticated = true;
        if (data.onboardingComplete) STATE.onboardingComplete = true;
        if (data.userRole) STATE.userRole = STATE.authRole = data.userRole;
        if (data.activeTenantId != null) STATE.activeTenantId = data.activeTenantId;
    } catch (_) { /* ignore */ }
}

function saveAuthSession() {
    sessionStorage.setItem('lhq_auth', JSON.stringify({
        isAuthenticated: STATE.isAuthenticated,
        onboardingComplete: STATE.onboardingComplete,
        userRole: STATE.userRole,
        activeTenantId: STATE.activeTenantId,
    }));
}

const AUTH_ROLES = [
    { id: 'landlord', title: 'Landlord', desc: 'Manage properties & tenants', icon: 'home', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'tenant', title: 'Tenant', desc: 'Pay rent & report issues', icon: 'user', color: '#16A34A', bg: '#DCFCE7' },
    { id: 'contractor', title: 'Contractor', desc: 'Receive & complete jobs', icon: 'wrench', color: '#EA580C', bg: '#FFEDD5' },
];

const SELECTABLE_ROLES = AUTH_ROLES.filter(r => r.id !== 'tenant');

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
    demoLogin(STATE.authRole || 'landlord');
}

function markMaintComplete() {
    const item = MAINTENANCE_ITEMS.find(m => m.id === STATE.maintId);
    if (!item || item.status === 'done') return;
    if (typeof addMaintHistoryEvent === 'function') addMaintHistoryEvent(item, 'Work completed', 'Marked as resolved by landlord');
    item.status = 'done';
    if (typeof AppStore !== 'undefined') AppStore.save();
    toast('Issue marked as completed');
    back();
}

function completeSignup() {
    if (STATE.authRole === 'tenant') {
        toast('Tenant accounts require a landlord invitation');
        go('tenant-invite');
        return;
    }
    if (STATE.authRole === 'landlord' && STATE.signupDraft) {
        const d = STATE.signupDraft;
        LANDLORD_ACCOUNTS.push({
            id: LANDLORD_ACCOUNTS.length,
            firstName: d.firstName,
            lastName: d.lastName,
            email: d.email,
            password: d.password,
        });
        saveLandlordAccounts();
        LANDLORD_USER.firstName = d.firstName;
        LANDLORD_USER.lastName = d.lastName;
        LANDLORD_USER.email = d.email;
        if (typeof AppStore !== 'undefined') AppStore.save();
        STATE.signupDraft = null;
        STATE.signupEmail = '';
    }
    STATE.isAuthenticated = true;
    STATE.userRole = STATE.authRole;
    STATE.otpDigits = [];
    saveAuthSession();
    go(getRoleWelcome());
}

function startLandlordSignup() {
    const name = document.querySelector('[data-signup-name]')?.value?.trim() || '';
    const email = document.querySelector('[data-signup-email]')?.value?.trim() || '';
    const password = document.querySelector('[data-signup-password]')?.value || '';
    const confirm = document.querySelector('[data-signup-confirm]')?.value || '';
    if (!name) {
        toast('Enter your full name');
        return;
    }
    if (!isValidEmail(email)) {
        toast('Enter a valid email address');
        return;
    }
    if (landlordAccountByEmail(email)) {
        toast('This email is already registered. Sign in instead.');
        return;
    }
    if (password.length < 8) {
        toast('Password must be at least 8 characters');
        return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        toast('Include an uppercase letter and a number');
        return;
    }
    if (password !== confirm) {
        toast('Passwords do not match');
        return;
    }
    const parts = name.split(/\s+/);
    STATE.signupDraft = {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ') || '',
        email,
        password,
    };
    STATE.signupEmail = email;
    STATE.otpContext = 'signup';
    STATE.otpDigits = [];
    go('verify-otp');
    setTimeout(() => toast(`Verification code sent to ${email}`), 50);
}

function resendSignupCode() {
    if (!STATE.signupEmail) return;
    STATE.otpDigits = [];
    render();
    toast(`New code sent to ${STATE.signupEmail}`);
}

function inviteField(name) {
    const el = document.querySelector(`[data-invite="${name}"]`) || document.querySelector(`[data-field="${name}"]`);
    if (el?.value?.trim()) return el.value.trim();
    const draft = STATE.inviteDraft?.[name];
    return draft != null ? String(draft).trim() : '';
}

function splitFullName(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return { firstName: '', lastName: '' };
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function sendTenantInvitation() {
    if (typeof captureInviteDraft === 'function') captureInviteDraft();
    const draft = STATE.inviteDraft || {};
    const fullName = inviteField('fullName') || draft.fullName || `${inviteField('firstName') || draft.firstName || ''} ${inviteField('lastName') || draft.lastName || ''}`.trim();
    const { firstName, lastName } = splitFullName(fullName);
    const idNumber = inviteField('idNumber') || draft.idNumber;
    const dob = inviteField('dob') || draft.dob;
    const email = inviteField('email') || draft.email;
    const phone = inviteField('phone') || draft.phone;
    const unit = inviteField('unit') || draft.unit || STATE.selectedUnit;
    const rent = inviteField('rent') || draft.rent;
    const leaseStart = inviteField('leaseStart') || draft.leaseStart;
    const leaseEnd = inviteField('leaseEnd') || draft.leaseEnd;
    const message = inviteField('message') || draft.message;
    if (!idNumber) {
        toast('Enter tenant NID');
        return;
    }
    if (!STATE.nidProofName && STATE.screen === 'invite-tenant') {
        toast('Upload NID document proof');
        return;
    }
    if (!firstName) {
        toast('Enter tenant full name');
        return;
    }
    if (!dob) {
        toast('Enter date of birth');
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast('Enter a valid email address');
        return;
    }
    if (!phone) {
        toast('Enter tenant phone number');
        return;
    }
    if (!unit) {
        toast('Select a unit');
        return;
    }
    if (!leaseStart || !leaseEnd) {
        toast('Enter lease start and end dates');
        return;
    }
    if (leaseEnd <= leaseStart) {
        toast('Lease end must be after start date');
        return;
    }
    const p = PROPERTIES[STATE.propertyId];
    const token = makeInviteToken();
    const invite = {
        id: TENANT_INVITATIONS.length,
        token,
        firstName,
        lastName,
        idNumber,
        dob,
        nidProof: STATE.nidProofName || 'NID Proof.jpg',
        email,
        phone,
        propertyId: STATE.propertyId,
        unit,
        rent: rent || getUnitByName(STATE.propertyId, unit)?.rent || propertyDefaultFlatRent(STATE.propertyId),
        leaseStart,
        leaseEnd,
        message,
        landlord: `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`,
        status: 'pending',
        sentAt: 'Just now',
    };
    TENANT_INVITATIONS.push(invite);
    STATE.nidProofName = null;
    saveTenantData();
    if (typeof syncLandlordAfterInviteSent === 'function') syncLandlordAfterInviteSent(invite);
    STATE.tenantInviteToken = token;
    go('tenant-invite-sent');
    setTimeout(() => toast(`Invitation sent to ${email}`), 50);
}

function activateTenantAccount() {
    const invite = tenantInviteByToken(STATE.tenantInviteToken);
    if (!invite) {
        toast('Invitation not found or expired');
        return;
    }
    if (invite.status === 'activated') {
        toast('This invitation was already used. Please sign in.');
        go('sign-in');
        return;
    }
    const password = document.querySelector('[data-tenant-password]')?.value || '';
    const confirm = document.querySelector('[data-tenant-confirm]')?.value || '';
    if (password.length < 6) {
        toast('Password must be at least 6 characters');
        return;
    }
    if (password !== confirm) {
        toast('Passwords do not match');
        return;
    }
    const listItem = typeof tenantListByProperty === 'function' ? tenantListByProperty(invite.propertyId) : null;
    const account = {
        id: listItem?.id ?? TENANT_ACCOUNTS.length,
        inviteToken: invite.token,
        firstName: invite.firstName,
        lastName: invite.lastName,
        email: invite.email,
        phone: invite.phone,
        propertyId: invite.propertyId,
        unit: invite.unit,
        rent: invite.rent,
        leaseStart: invite.leaseStart,
        leaseEnd: invite.leaseEnd,
        landlord: invite.landlord,
        password,
    };
    if (typeof syncLandlordAfterActivation === 'function') syncLandlordAfterActivation(invite);
    TENANT_ACCOUNTS.push(account);
    invite.status = 'activated';
    saveTenantData();
    STATE.isAuthenticated = true;
    STATE.userRole = STATE.authRole = 'tenant';
    STATE.activeTenantId = account.id;
    STATE.showPassword = false;
    STATE.showConfirmPassword = false;
    saveAuthSession();
    go('tenant-welcome');
    setTimeout(() => toast('Account activated successfully!'), 50);
}

function openTenantInvite(token) {
    loadTenantData();
    const inviteToken = token || new URLSearchParams(window.location.search).get('invite');
    if (!inviteToken) {
        toast('Open the invitation link from your email');
        return;
    }
    const invite = tenantInviteByToken(inviteToken);
    if (!invite) {
        toast('Invalid or expired invitation');
        go('role-select');
        return;
    }
    STATE.tenantInviteToken = inviteToken;
    STATE.authRole = 'tenant';
    go('tenant-invite', { token: inviteToken });
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
        body: 'Reminders for certificates, inspections, rent due dates, and lease renewals.',
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
    if (!isValidEmail(email)) {
        toast('Enter a valid email address');
        return;
    }
    if (!landlordAccountByEmail(email) && !tenantAccountByEmail(email)) {
        toast('No account found for this email');
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
    const account = landlordAccountByEmail(STATE.resetEmail);
    if (account) {
        account.password = pw;
        saveLandlordAccounts();
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
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            ${appLogo()}
            <span style="width:40px"></span>
        </div>
        <div class="auth-content">
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
            <button type="button" data-action="role-continue" class="btn-auth btn-auth-primary" style="margin-top:32px">${roleContinueLabel()}</button>
            <p class="auth-footer-text" style="margin-top:20px">Tenant invited? <button type="button" data-action="open-tenant-invite">Open invitation link</button></p>
            <p class="auth-footer-text" style="margin-top:12px">Contractor invited? <button type="button" data-go="contractor-invite">Open invitation</button></p>
            <p class="auth-footer-text" style="margin-top:12px">Don't have an account? <button type="button" data-go="sign-up">Sign Up</button></p>
        </div>
    </div>`;
}

function screenSignIn() {
    const pwType = STATE.showPassword ? 'text' : 'password';
    return `
    <div class="auth-screen">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            ${appLogo()}
            <span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <div class="auth-icon-wrap">
                <i data-lucide="log-in" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Welcome Back!</h1>
            <p class="auth-sub">${signInSubtitle()}</p>
            ${authDemoCard()}
            <div class="auth-form">
                <div class="auth-field">
                    <label>Email address</label>
                    <input type="email" data-signin-email class="auth-input" placeholder="you@email.com" autocomplete="username" inputmode="email">
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
            ${appLogo()}
            <span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <div class="auth-icon-wrap">
                <i data-lucide="user-plus" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Create Your Account</h1>
            <p class="auth-sub">Sign up with your email. We'll send a verification code to confirm it's you.</p>
            <div class="auth-form">
                <div class="auth-field"><label>Full Name</label><input type="text" data-signup-name class="auth-input" placeholder="John Smith" autocomplete="name"></div>
                <div class="auth-field"><label>Email address</label><input type="email" data-signup-email class="auth-input" placeholder="you@email.com" autocomplete="email" inputmode="email"></div>
                <div class="auth-field">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-signup-password class="auth-input" placeholder="Create password" style="padding-right:44px" autocomplete="new-password">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="auth-field"><label>Confirm Password</label><input type="password" data-signup-confirm class="auth-input" placeholder="Confirm password" autocomplete="new-password"></div>
                ${passwordRequirementsHtml()}
                <button type="button" data-action="start-signup" class="btn-auth btn-auth-primary">Create Account</button>
            </div>
            <p class="auth-footer-text" style="margin-top:20px">Already have an account? <button type="button" data-go="sign-in">Sign In</button></p>
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
    const isSignup = STATE.otpContext === 'signup';
    const target = isSignup ? maskEmail(STATE.signupEmail) : 'your email';
    return `
    <div class="auth-screen auth-screen-keypad" style="padding-bottom:0">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <span></span><span style="width:40px"></span>
        </div>
        <div class="auth-content auth-content-otp">
            <div class="auth-icon-wrap">
                <i data-lucide="mail" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Verify Your Email</h1>
            <p class="auth-sub">Enter the 6-digit code sent to<br><strong>${target}</strong></p>
            ${otpBoxesHtml(digits)}
            <p class="otp-resend">Didn't get it? <button type="button" data-action="resend-signup-code">Resend code</button></p>
            <p class="auth-security-note"><i data-lucide="lock" class="w-3.5 h-3.5"></i> Enter the 6-digit code from your email</p>
        </div>
        ${otpKeypadHtml()}
    </div>`;
}

function screenWelcome() {
    const name = LANDLORD_USER.firstName || 'there';
    const initials = `${(LANDLORD_USER.firstName || 'L')[0]}${(LANDLORD_USER.lastName || 'H')[0]}`.toUpperCase();
    const email = LANDLORD_USER.email || '';
    const propCount = PROPERTIES.length;
    const tenantCount = TENANTS.length;
    return `
    <div class="welcome-screen">
        <div class="welcome-hero">
            <div class="welcome-hero-top">
                <div class="welcome-success-badge">
                    <i data-lucide="circle-check" class="w-5 h-5"></i>
                    <span>Account verified</span>
                </div>
                <button type="button" data-go="notifications-list" class="welcome-bell-btn">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    <span class="welcome-bell-dot">3</span>
                </button>
            </div>
            <h1 class="welcome-hero-title">Welcome, ${name}! 👋</h1>
            <p class="welcome-hero-sub">You're all set to manage your rental portfolio.</p>
        </div>
        <div class="welcome-body">
            <div class="welcome-profile-card">
                <div class="welcome-avatar">${initials}</div>
                <div class="welcome-profile-info">
                    <p class="welcome-profile-name">${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}</p>
                    <p class="welcome-profile-email">${email}</p>
                </div>
                <span class="welcome-role-pill">Landlord</span>
            </div>
            <div class="welcome-stats">
                <div class="welcome-stat">
                    <i data-lucide="building-2" class="w-4 h-4"></i>
                    <span class="welcome-stat-val">${propCount}</span>
                    <span class="welcome-stat-lbl">Properties</span>
                </div>
                <div class="welcome-stat">
                    <i data-lucide="users" class="w-4 h-4"></i>
                    <span class="welcome-stat-val">${tenantCount}</span>
                    <span class="welcome-stat-lbl">Tenants</span>
                </div>
                <div class="welcome-stat">
                    <i data-lucide="wallet" class="w-4 h-4"></i>
                    <span class="welcome-stat-val">£0</span>
                    <span class="welcome-stat-lbl">Collected</span>
                </div>
            </div>
            <button type="button" data-action="enter-app" class="welcome-dash-card">
                <div class="welcome-dash-glow"></div>
                <div class="welcome-dash-content">
                    <p class="welcome-dash-eyebrow">Your workspace</p>
                    <p class="welcome-dash-title">Open Landlord Dashboard</p>
                    <p class="welcome-dash-sub">Properties, tenants, rent & maintenance</p>
                </div>
                <div class="welcome-dash-arrow">
                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </div>
                <i data-lucide="building-2" class="welcome-dash-bg-icon w-24 h-24"></i>
            </button>
            <div class="welcome-quick">
                <p class="welcome-quick-title">Quick start</p>
                <div class="welcome-quick-grid">
                    <button type="button" data-action="enter-app" data-go-after="add-property" class="welcome-quick-item">
                        <span class="welcome-quick-icon welcome-quick-icon-blue"><i data-lucide="plus" class="w-4 h-4"></i></span>
                        <span>Add Property</span>
                    </button>
                    <button type="button" data-action="enter-app" data-go-after="tenants" class="welcome-quick-item">
                        <span class="welcome-quick-icon welcome-quick-icon-green"><i data-lucide="users" class="w-4 h-4"></i></span>
                        <span>View Tenants</span>
                    </button>
                    <button type="button" data-action="enter-app" data-go-after="profile" class="welcome-quick-item">
                        <span class="welcome-quick-icon welcome-quick-icon-purple"><i data-lucide="settings" class="w-4 h-4"></i></span>
                        <span>Profile</span>
                    </button>
                </div>
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
    demoLogin(STATE.authRole || 'landlord');
}

function go(screen, opts = {}) {
    const from = STATE.screen;
    if (screen === 'sign-up' && ['sign-in', 'role-select'].includes(from)) {
        STATE.authReturnScreen = from;
        if (from === 'role-select' && STATE.authRole !== 'contractor') STATE.authRole = 'landlord';
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
    if (from === 'flat-detail' && screen !== 'flat-detail' && FLAT_QUICK_ACTION_SCREENS.has(screen)) {
        setFlatReturnFromDetail();
    }
    recordNavHistory(from, screen, opts);
    Object.assign(STATE, opts, { screen, drawer: false, fab: false, showPropFilters: false, showUnitFilters: false, showPropertyMore: false, actionMenuKey: null });
    if (screen === 'verify-otp') {
        STATE.otpDigits = [];
        STATE.otpContext = 'signup';
    }
    if (screen === 'reset-verify-code') STATE.otpDigits = [];
    if (screen === 'property-detail') {
        const legacyTabs = { photos: 'details', 'floor-plans': 'details', timeline: 'details' };
        const tab = legacyTabs[opts.tab] ?? opts.tab ?? 'units';
        STATE.tab = tab;
        if (opts.propertyId !== undefined && opts.propertyId !== STATE.propertyId) STATE.unitFilter = 'all';
        if (opts.unit && tab === 'maintenance') {
            STATE.propertyMaintUnit = opts.unit;
            STATE.selectedUnit = opts.unit;
        } else if (tab !== 'maintenance') {
            STATE.propertyMaintUnit = null;
        }
    }
    if (screen === 'flat-detail') {
        STATE.propertyId = opts.propertyId ?? STATE.propertyId;
        const prevUnit = STATE.selectedUnit;
        if (opts.unit) STATE.selectedUnit = opts.unit;
        if (opts.flatTab) STATE.flatTab = opts.flatTab;
        else if (opts.unit && opts.unit !== prevUnit) STATE.flatTab = 'overview';
        if (!opts.noHistory) STATE.flatReturn = null;
    }
    if (screen === 'flat-members') {
        STATE.propertyId = opts.propertyId ?? STATE.propertyId;
        if (opts.unit) STATE.selectedUnit = opts.unit;
    }
    if (screen === 'flat-rent-history') {
        STATE.propertyId = opts.propertyId ?? STATE.propertyId;
        if (opts.unit) STATE.selectedUnit = opts.unit;
    }
    if (screen === 'tenancy-detail') {
        STATE.propertyId = opts.propertyId ?? STATE.propertyId;
        if (opts.unit) STATE.selectedUnit = opts.unit;
    }
    if (screen === 'financial' && opts.invoiceFilter) STATE.invoiceFilter = opts.invoiceFilter;
    if (screen === 'transaction-history') {
        if (from === 'financial') STATE.txnReturnScreen = 'financial';
        else if (from === 'tenant-detail') STATE.txnReturnScreen = 'tenant-detail';
        else STATE.txnReturnScreen = typeof profileHomeScreen === 'function' ? profileHomeScreen() : 'profile';
        if (opts.invoiceFilter) STATE.invoiceFilter = opts.invoiceFilter;
        else if (from === 'financial' || from === 'profile') STATE.invoiceFilter = 'all';
    }
    if (screen === 'maintenance-detail') STATE.maintId = opts.maintId ?? STATE.maintId ?? 0;
    if (screen === 'inspection-detail') {
        STATE.inspectionId = opts.inspectionId ?? STATE.inspectionId ?? 0;
        if (opts.propertyId != null) STATE.propertyId = opts.propertyId;
    }
    if (screen === 'chat') STATE.chatId = opts.chatId ?? STATE.chatId ?? 0;
    if (screen === 'tenant-invite' || screen === 'tenant-activate') {
        STATE.tenantInviteToken = opts.token ?? STATE.tenantInviteToken;
        if (opts.token) STATE.authRole = 'tenant';
    }
    if (screen === 'tenant-invite-sent') {
        if (opts.token) STATE.tenantInviteToken = opts.token;
    }
    if (screen === 'conduct-inspection') STATE.inspectionPhotos = [];
    if (screen === 'log-maintenance') STATE.selectedUnit = opts.unit ?? STATE.selectedUnit;
    if (screen === 'invite-tenant' || screen === 'unit-utilities' || screen === 'edit-flat' || screen === 'flat-detail' || screen === 'flat-members') {
        if (opts.unit) STATE.selectedUnit = opts.unit;
    }
    if (screen === 'invite-tenant') {
        if (from !== 'invite-tenant') {
            STATE.inviteStep = 1;
            STATE.inviteDraft = null;
        }
        STATE.nidProofName = null;
        if (from === 'property-detail' && (opts.tab === 'tenant' || STATE.tab === 'tenant')) {
            STATE.inviteReturn = { screen: 'property-detail', tab: 'tenant' };
        } else if (from === 'flat-members' && (opts.unit || STATE.selectedUnit)) {
            STATE.inviteReturn = { screen: 'flat-members', unit: opts.unit || STATE.selectedUnit };
        } else if (from === 'flat-detail' || opts.unit || STATE.selectedUnit) {
            STATE.inviteReturn = { screen: 'flat-detail', unit: opts.unit || STATE.selectedUnit };
        } else if (from === 'tenants' || from === 'select-property-invite') {
            STATE.inviteReturn = { screen: 'tenants' };
        } else {
            STATE.inviteReturn = { screen: 'property-detail', tab: 'tenant' };
        }
    }
    if (screen === 'add-flat') {
        STATE.flatDuplicateFrom = opts.duplicateFrom || null;
        STATE.selectedUnit = null;
    }
    if (screen === 'conduct-inspection' || screen === 'create-tenancy' || screen === 'property-photos' || screen === 'property-floor-plans' || screen === 'property-alarms' || screen === 'property-appliances' || screen === 'property-utilities' || screen === 'property-parking' || screen === 'property-info' || screen === 'unit-utilities' || screen === 'edit-flat' || screen === 'add-flat') STATE.propertyId = opts.propertyId ?? STATE.propertyId;
    if (screen === 'checkout-tenancy') STATE.tenantId = opts.tenantId ?? STATE.tenantId;
    if (screen === 'share-document') STATE.shareDocId = opts.shareDocId ?? STATE.shareDocId;
    if (screen === 'assign-contractor') STATE.assignMaintId = opts.maintId ?? STATE.maintId;
    if (screen === 'contractor-job-detail') STATE.contractorJobId = opts.jobId ?? STATE.contractorJobId ?? 0;
    if (opts.jobTab) STATE.contractorJobTab = opts.jobTab;
    if (screen === 'tenant-detail') {
        STATE.tenantId = opts.tenantId ?? STATE.tenantId;
        const sectionTab = opts.tenantTab || opts.tab;
        STATE.tenantTab = sectionTab ?? (opts.tenantId !== undefined ? 'overview' : STATE.tenantTab || 'overview');
    }
    if (screen === 'faq-detail') {
        STATE.faqId = opts.faqId ?? STATE.faqId ?? 0;
        if (from === 'faq') STATE.faqCameFromFaq = true;
        else if (from !== 'faq-detail') {
            STATE.faqCameFromFaq = false;
            STATE.faqReturnScreen = from;
        }
    }
    if (opts.complianceId !== undefined) STATE.complianceId = opts.complianceId;
    if (opts.prefKey) STATE.prefKey = opts.prefKey;
    if (opts.paymentId !== undefined) STATE.paymentId = opts.paymentId;
    if (opts.noteId !== undefined) STATE.noteId = opts.noteId;
    if (screen === 'tenant-add-note' || screen === 'tenant-edit-note') STATE.tenantId = opts.tenantId ?? STATE.tenantId;
    if (screen === 'document-preview') {
        STATE.previewDocId = opts.docId ?? STATE.previewDocId;
        STATE.previewDocIdx = opts.previewDocIdx ?? STATE.previewDocIdx;
        STATE.previewDocSource = opts.previewDocSource ?? STATE.previewDocSource ?? 'property';
        if (opts.tenantId != null) STATE.tenantId = opts.tenantId;
    }
    if (screen === 'tenant-invite-sent' && STATE.tenantInviteToken) {
        const inv = tenantInviteByToken(STATE.tenantInviteToken);
        if (inv) STATE.propertyId = inv.propertyId;
    }
    render();
}

function splashContinue() {
    clearTimeout(render._splashTimer);
    if (STATE.isAuthenticated) go(getRoleHome());
    else if (STATE.onboardingComplete) go('role-select');
    else go('onboarding');
}

function navigateBackFallback() {
    if (restoreFlatDetailNav()) return;
    const defaultHome = getRoleHome();
    const profileParent = profileHomeScreen();
    const map = {
        'property-detail': 'properties', 'tenant-detail': 'tenants', 'chat': 'messages',
        'maintenance-detail': STATE.userRole === 'tenant' ? 'tenant-dashboard' : 'maintenance', 'invoice-detail': 'financial',
        'inventory-room': 'property-detail',
        'personal-info': profileParent, 'notifications-settings': profileParent,
        'security': profileParent, 'password': profileParent, 'preferences': profileParent,
        'payment-methods': profileParent, 'subscription': profileParent, 'transaction-history': profileParent,
        'faq-detail': 'faq', 'about': profileParent,
        'edit-property': 'property-detail', 'add-flat': 'property-detail', 'invite-tenant': 'property-detail',
        'edit-flat': 'flat-detail', 'flat-detail': 'property-detail', 'flat-members': 'flat-detail', 'flat-rent-history': 'flat-detail', 'tenancy-detail': 'flat-detail',
        'edit-tenant': 'tenant-detail', 'reschedule-inspection': 'property-detail',
        'inspection-detail': 'property-detail',
        'renew-compliance': 'property-detail', 'edit-inventory-room': 'inventory-room',
        'add-payment-method': 'payment-methods', 'edit-payment-method': 'payment-methods',
        'edit-preference': 'preferences',
        'add-property': 'properties',
        'tenants': 'dashboard',
        'profile': 'dashboard',
        'log-maintenance': STATE.userRole === 'tenant' ? 'tenant-dashboard' : 'maintenance',
        'notifications-list': defaultHome,
        'financial': defaultHome,
        'sign-up-phone': 'sign-up',
        'verify-otp': 'sign-up-phone',
        'reset-verify-code': 'forgot-password', 'reset-password': 'reset-verify-code',
        'reset-success': 'sign-in',
        'contractor-job-detail': 'contractor-jobs', 'contractor-schedule': 'contractor-job-detail',
        'contractor-work': 'contractor-job-detail',
        'contractor-documents': 'contractor-job-detail',
        'tenant-invite-sent': 'invite-tenant',
        'tenant-activate': 'tenant-invite',
        'contractor-company': 'contractor-profile', 'contractor-invite': 'role-select',
        'contractor-notifications': 'contractor-dashboard',
        'portfolio-overview': 'dashboard', 'compliance-dashboard': 'dashboard',
        'reminders': 'dashboard', 'add-reminder': 'reminders',
        'create-tenancy': 'property-detail', 'checkout-tenancy': 'tenant-detail',
        'assign-contractor': 'maintenance-detail', 'conduct-inspection': 'property-detail',
        'create-invoice': 'financial', 'mark-rent-received': STATE.rentReturnScreen || 'financial', 'pay-contractor': 'financial',
        'share-document': 'property-detail',
        'property-floor-plans': 'property-detail', 'property-photos': 'property-detail',
        'property-alarms': 'property-detail', 'property-appliances': 'property-detail',
        'property-utilities': 'property-detail', 'property-parking': 'property-detail',
        'property-info': 'property-detail', 'unit-utilities': 'property-detail',
        'maintenance-history': 'maintenance', 'select-property-invite': 'tenants',
        'global-search': 'dashboard',
        'contractors': 'dashboard',
        'tenant-add-note': 'tenant-detail', 'tenant-edit-note': 'tenant-detail',
    };
    const tabMap = {
        'inventory-room': 'inventory',
        'edit-property': 'units', 'add-flat': 'units', 'invite-tenant': 'tenant',
        'flat-detail': 'units', 'flat-members': 'units', 'flat-rent-history': 'units', 'tenancy-detail': 'units',
        'reschedule-inspection': 'inspection', 'renew-compliance': 'compliance',
        'contractor-work': 'work', 'contractor-documents': 'invoice',
        'create-tenancy': 'tenant', 'tenant-invite-sent': 'tenant',
        'conduct-inspection': 'inspection', 'share-document': 'documents',
        'inspection-detail': 'inspection',
        'property-photos': 'details', 'property-floor-plans': 'details',
        'property-alarms': 'details', 'property-appliances': 'details',
        'property-utilities': 'details', 'property-parking': 'details', 'property-info': 'details',
        'unit-utilities': 'units', 'edit-flat': 'units',
    };
    const target = map[STATE.screen] || defaultHome;
    const opts = { noHistory: true };
    if (tabMap[STATE.screen]) {
        opts.tab = tabMap[STATE.screen];
        if (STATE.screen.startsWith('contractor-')) opts.jobTab = tabMap[STATE.screen];
        else opts.propertyId = STATE.propertyId;
    }
    if (['contractor-job-detail', 'contractor-schedule', 'contractor-work', 'contractor-documents'].includes(STATE.screen)) {
        opts.jobId = STATE.contractorJobId;
    }
    if (['edit-tenant', 'checkout-tenancy', 'tenant-add-note', 'tenant-edit-note'].includes(STATE.screen)) {
        opts.tenantId = STATE.tenantId;
    }
    if (STATE.screen === 'tenant-add-note' || STATE.screen === 'tenant-edit-note') opts.tenantTab = 'notes';
    if (['edit-inventory-room'].includes(STATE.screen)) opts.roomId = STATE.roomId;
    if (STATE.screen === 'edit-preference') opts.prefKey = STATE.prefKey;
    if (['edit-payment-method'].includes(STATE.screen)) opts.paymentId = STATE.paymentId;
    if (STATE.screen === 'assign-contractor') opts.maintId = STATE.maintId;
    if (STATE.screen === 'flat-detail' || STATE.screen === 'flat-members' || STATE.screen === 'tenancy-detail' || STATE.screen === 'edit-flat' || STATE.screen === 'flat-rent-history') {
        opts.unit = STATE.selectedUnit;
    }
    if (STATE.screen === 'invite-tenant') {
        const ret = STATE.inviteReturn;
        STATE.inviteReturn = null;
        if (ret?.screen === 'property-detail') {
            go('property-detail', { propertyId: STATE.propertyId, tab: ret.tab || 'tenant', noHistory: true });
            return;
        }
        if (ret?.screen === 'flat-members' && ret.unit) {
            go('flat-members', { propertyId: STATE.propertyId, unit: ret.unit, noHistory: true });
            return;
        }
        if (ret?.screen === 'flat-detail' && ret.unit) {
            go('flat-detail', { propertyId: STATE.propertyId, unit: ret.unit, noHistory: true });
            return;
        }
        if (ret?.screen === 'tenants') {
            go('tenants', { noHistory: true });
            return;
        }
        if (STATE.selectedUnit) {
            go('flat-detail', { propertyId: STATE.propertyId, unit: STATE.selectedUnit, noHistory: true });
            return;
        }
    }
    go(target, opts);
}

function back() {
    if (restoreFlatDetailNav()) return;
    if (STATE.screen === 'property-detail' && STATE.tab !== 'units' && !STATE.flatReturn) {
        setTab('units');
        return;
    }
    if (STATE.screen === 'tenant-detail' && STATE.tenantTab !== 'overview') {
        setTenantTab('overview');
        return;
    }
    if (STATE.screen === 'welcome') return;
    if (STATE.screen === 'contractor-welcome' || STATE.screen === 'tenant-welcome') return;
    if (STATE.screen === 'reset-success') return;
    if (STATE.screen === 'onboarding') {
        if (STATE.onboardingStep > 0) setOnboardingStep(STATE.onboardingStep - 1);
        return;
    }
    if (STATE.screen === 'role-select') {
        go('onboarding', { noHistory: true });
        return;
    }
    if (STATE.screen === 'sign-up') {
        go(STATE.authReturnScreen || 'role-select', { noHistory: true });
        return;
    }
    if (STATE.screen === 'sign-in') {
        go('role-select', { noHistory: true });
        return;
    }
    if (STATE.screen === 'sign-up-phone') {
        go('sign-up', { noHistory: true });
        return;
    }
    if (STATE.screen === 'verify-otp') {
        go('sign-up-phone', { noHistory: true });
        return;
    }
    if (STATE.screen === 'forgot-password') {
        go(STATE.resetReturnScreen || 'sign-in', { noHistory: true });
        return;
    }
    if (STATE.screen === 'reset-verify-code') {
        go('forgot-password', { noHistory: true });
        return;
    }
    if (STATE.screen === 'reset-password') {
        go('reset-verify-code', { noHistory: true });
        return;
    }
    if (STATE.screen === 'help-support') {
        go(STATE.helpReturnScreen || helpReturnHome(), { noHistory: true });
        return;
    }
    if (STATE.screen === 'faq') {
        go(STATE.faqReturnScreen || 'help-support', { noHistory: true });
        return;
    }
    if (STATE.screen === 'faq-detail') {
        go(STATE.faqCameFromFaq ? 'faq' : (STATE.faqReturnScreen || 'help-support'), { noHistory: true });
        return;
    }
    if (STATE.screen === 'document-preview') {
        if (STATE.docReturnScreen === 'tenant-detail') {
            go('tenant-detail', { tenantId: STATE.tenantId, tenantTab: STATE.tenantTab || 'lease', noHistory: true });
        } else {
            go('property-detail', { propertyId: STATE.propertyId, tab: 'documents', noHistory: true });
        }
        return;
    }
    if (STATE.screen === 'privacy' || STATE.screen === 'terms') {
        go(STATE.legalReturnScreen || legalReturnHome(), { noHistory: true });
        return;
    }
    if (STATE.screen === 'transaction-history') {
        const ret = STATE.txnReturnScreen || (typeof profileHomeScreen === 'function' ? profileHomeScreen() : 'profile');
        const backOpts = { noHistory: true };
        if (ret === 'tenant-detail') {
            backOpts.tenantId = STATE.tenantId;
            backOpts.tenantTab = 'payments';
        }
        go(ret, backOpts);
        return;
    }
    const prev = STATE.navStack.pop();
    if (prev) {
        restoreNav(prev);
        return;
    }
    navigateBackFallback();
}

function setTab(tab) {
    if (tab === 'info' && typeof isPropertyInfoSection === 'function' && isPropertyInfoSection(STATE.tab)) {
        STATE.tab = 'info';
    } else {
        STATE.tab = tab;
    }
    STATE.showUnitFilters = false;
    STATE.showPropertyMore = false;
    if (tab !== 'maintenance') STATE.propertyMaintUnit = null;
    render();
}
function setTenantTab(tab) { STATE.tenantTab = tab; render(); }
function setFlatTab(tab) { STATE.flatTab = tab; render(); }
function setTenantFilter(f) { STATE.tenantFilter = f; render(); }
function setUnitFilter(f) { STATE.unitFilter = f; STATE.showUnitFilters = false; render(); }
function toggleUnitFilters() { STATE.showUnitFilters = !STATE.showUnitFilters; if (STATE.showUnitFilters) STATE.actionMenuKey = null; render(); }
function closeUnitFilters() { STATE.showUnitFilters = false; render(); }
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
        const occupiedFlats = typeof propertyOccupiedFlatCount === 'function'
            ? propertyOccupiedFlatCount(p.id)
            : (['Occupied', 'Partial', 'Full'].includes(p.status) ? 1 : 0);
        const matchFilter = STATE.propertiesFilter === 'all' ||
            (STATE.propertiesFilter === 'occupied' && occupiedFlats > 0) ||
            (STATE.propertiesFilter === 'vacant' && occupiedFlats === 0);
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) ||
            (typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id).label : p.occupancyLabel || '').toLowerCase().includes(q);
        const rentNum = (() => {
            if (typeof getPropertyRentSummary === 'function') {
                const { potential, min } = getPropertyRentSummary(p.id);
                return potential || min || 0;
            }
            return parseInt(p.rent.replace(/[^\d]/g, ''), 10);
        })();
        const matchRent = adv.rent === 'all' || (adv.rent === 'under2k' && rentNum < 2000) || (adv.rent === 'over2k' && rentNum >= 2000);
        const matchBeds = adv.beds === 'any' || (typeof getPropertyUnits === 'function'
            ? getPropertyUnits(p.id).some(u => (u.beds || 0) >= parseInt(adv.beds, 10))
            : true);
        return matchFilter && matchSearch && matchRent && matchBeds;
    });
}
function setMaintFilter(f) { STATE.maintFilter = f; render(); }
function setMaintScopeFilter(f) { STATE.maintScopeFilter = f; render(); }
function setInvoiceFilter(f) { STATE.invoiceFilter = f; render(); }
function setLogPriority(p) { STATE.logPriority = p; render(); }
function setLogMaintScope(scope) { STATE.logMaintScope = scope; render(); }
function setSearch(key, val) { STATE.search[key] = val; render(); }
function toggleSwitch(key) { STATE.toggles[key] = !STATE.toggles[key]; render(); }

function toggleDrawer() { STATE.drawer = !STATE.drawer; if (STATE.drawer) { STATE.showPropFilters = false; STATE.fab = false; STATE.showUnitFilters = false; STATE.showPropertyMore = false; } render(); }
function toggleFab() { STATE.fab = !STATE.fab; render(); }

function logout() {
    const role = STATE.userRole;
    STATE.isAuthenticated = false;
    STATE.signInOrigin = 'logout';
    STATE.authRole = role;
    STATE.resetReturnScreen = 'sign-in';
    STATE.drawer = false;
    STATE.fab = false;
    STATE.otpDigits = [];
    STATE.showPassword = false;
    clearNavStack();
    saveAuthSession();
    go('sign-in', { noHistory: true });
    setTimeout(() => toast('Signed out successfully'), 50);
}

function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.getElementById('app').appendChild(t); }
    t.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>${msg}`;
    t.classList.add('show');
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
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
        ${opts.more ? `<button data-go="edit-property" data-pid="${opts.pid != null ? opts.pid : STATE.propertyId}" class="top-icon-btn shrink-0 w-10 h-10 rounded-full border border-[#E2E8F0] bg-white" title="Property options"><i data-lucide="more-horizontal" class="w-5 h-5"></i></button>` : ''}
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
                ${(() => { const n = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(x => x.unread).length; return n ? `<span class="notif-badge">${n}</span>` : ''; })()}
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
            ${(() => { const n = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(x => x.unread).length; return n ? `<span class="notif-badge">${n}</span>` : ''; })()}
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

let CONVERSATIONS = [
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

function conversationsForRole() {
    if (STATE.userRole === 'tenant') {
        const t = getActiveTenant();
        if (!t) return [];
        const landlordName = t.landlord || `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
        return CONVERSATIONS.filter(c => c.name === landlordName || c.sub === 'Your landlord');
    }
    if (STATE.userRole === 'contractor') {
        const chatIds = new Set();
        if (typeof CONTRACTOR_JOBS !== 'undefined') {
            CONTRACTOR_JOBS.forEach(j => {
                if (j.tenantChatId != null) chatIds.add(j.tenantChatId);
                if (j.landlordChatId != null) chatIds.add(j.landlordChatId);
            });
        }
        if (typeof getLandlordChatId === 'function') chatIds.add(getLandlordChatId());
        return CONVERSATIONS.filter(c => chatIds.has(c.id));
    }
    return CONVERSATIONS;
}

const messagesHeader = () => `
<div class="inbox-header sticky top-0 z-10">
    <div class="inbox-header-row">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <h1 class="inbox-title">Messages</h1>
        <button type="button" data-action="new-message" class="top-icon-btn" aria-label="New message"><i data-lucide="square-pen" class="w-[20px] h-[20px]"></i></button>
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

const MAIN_SCREENS = ['dashboard','properties','tenants','financial','maintenance','messages'];
const TENANT_NAV_SCREENS = ['tenant-dashboard','log-maintenance','messages','personal-info'];
const CONTRACTOR_NAV_SCREENS = ['contractor-dashboard','contractor-jobs','messages','contractor-profile'];

function shouldShowBottomNav(screen = STATE.screen) {
    if (PRE_AUTH_SCREENS.includes(screen)) return false;
    if (STATE.userRole === 'contractor') return CONTRACTOR_NAV_SCREENS.includes(screen);
    if (STATE.userRole === 'tenant') return TENANT_NAV_SCREENS.includes(screen);
    return MAIN_SCREENS.includes(screen);
}

const BOTTOM_NAV = [
    ['layout-dashboard', 'Home', 'dashboard'],
    ['building-2', 'Properties', 'properties'],
    ['wrench', 'Maintenance', 'maintenance'],
    ['wallet', 'Finance', 'financial'],
];

const LANDLORD_DRAWER_NAV = [
    ['users', 'Tenants', 'tenants'],
    ['message-square', 'Messages', 'messages'],
    ['hard-hat', 'Contractors', 'contractors'],
    ['user-round', 'Profile', 'profile'],
    ['life-buoy', 'Help & FAQ', 'help-support'],
];

const TENANT_BOTTOM_NAV = [
    ['home', 'Home', 'tenant-dashboard'],
    ['wrench', 'Issues', 'log-maintenance'],
    ['message-square', 'Messages', 'messages'],
    ['user', 'Account', 'personal-info'],
];

const TENANT_DRAWER_NAV = [
    ['home', 'Home', 'tenant-dashboard'],
    ['wrench', 'Report Issue', 'log-maintenance'],
    ['message-square', 'Messages', 'messages'],
    ['life-buoy', 'Help & Support', 'help-support'],
];

const INVOICES = [
    { id: 0, num: 'INV-2026-1048', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Pending', due: 'Jul 1, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
    { id: 1, num: 'INV-2026-1047', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Overdue', due: 'Jul 1, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
    { id: 2, num: 'INV-2026-1045', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', tenantId: 2, propertyId: 3, amount: '£1,950', status: 'Pending', due: 'Jul 28, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
    { id: 3, num: 'INV-2026-1044', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Jun 2, 2026', paymentMethod: 'Bank transfer' },
    { id: 4, num: 'INV-2026-1043', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Jun 3, 2026', paymentMethod: 'Standing order' },
];

const invoiceStatusStyle = (status) => ({
    Pending: ['#FEF3C7', '#D97706'],
    Overdue: ['#FEE2E2', '#DC2626'],
    Paid: ['#ECFDF5', '#16A34A'],
}[status] || ['#F1F5F9', '#64748B']);

const maintStatusLabel = { open: 'Open', progress: 'In Progress', done: 'Completed' };
const maintStatusShort = { open: 'Open', progress: 'In Progress', done: 'Done' };
const maintStatusStyle = { open: ['#FEF3C7', '#D97706'], progress: ['#DBEAFE', '#2563EB'], done: ['#ECFDF5', '#16A34A'] };

const maintCard = (m, opts = {}) => {
    const [sBg, sColor] = maintStatusStyle[m.status];
    const priority = typeof maintPriorityTone === 'function' ? maintPriorityTone(m.priority) : { label: m.priority, cls: 'maint-priority-pill--low' };
    const photo = typeof maintIssuePhoto === 'function' ? maintIssuePhoto(m) : IMG.maint[m.id % IMG.maint.length];
    const propName = m.prop.split(',')[0];
    const location = typeof formatMaintLocation === 'function'
        ? formatMaintLocation(m, { hideProperty: opts.hideProperty, propName })
        : (opts.hideProperty
            ? (m.unit && m.unit !== '—' ? m.unit : propName)
            : `${propName}${m.unit && m.unit !== '—' ? ` · ${m.unit}` : ''}`);
    const when = m.reportedAt || m.time || '—';
    const statusLabel = maintStatusShort[m.status] || maintStatusLabel[m.status];
    return `
    <button data-go="maintenance-detail" data-mid="${m.id}" class="maint-card-row card w-full text-left">
        <img src="${photo}" alt="" class="maint-card-row-img">
        <div class="maint-card-row-body min-w-0">
            <div class="maint-card-row-top">
                <p class="maint-card-row-title">${m.issue}</p>
                <span class="maint-card-row-badge badge shrink-0" style="background:${sBg};color:${sColor}">${statusLabel}</span>
            </div>
            <p class="maint-card-row-loc"><i data-lucide="map-pin" class="w-3 h-3"></i>${location}</p>
            <div class="maint-card-row-meta">
                <span class="maint-priority-pill ${priority.cls}">${priority.label}</span>
                <span class="maint-card-row-time">${when}</span>
            </div>
        </div>
        <i data-lucide="chevron-right" class="maint-card-row-chevron w-4 h-4"></i>
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
    ['wallet', 'Finance', 'financial'],
    ['life-buoy', 'Help & FAQ', 'help-support'],
];

const TRANSACTIONS = [
    { tenant: 'Sarah Johnson', amount: '£2,450', status: 'Pending', date: 'Jul 1, 2026', prop: '12 Park Lane', unit: 'Flat 2A', iid: 0, month: 'Jul 2026', type: 'rent' },
    { tenant: 'David Wilson', amount: '£1,850', status: 'Overdue', date: 'Jul 1, 2026', prop: '45 Queens Rd', unit: 'Flat 1A', iid: 1, month: 'Jul 2026', type: 'rent' },
    { tenant: 'Michael Lee', amount: '£1,950', status: 'Pending', date: 'Jul 28, 2026', prop: '15 Victoria Ave', unit: 'Flat 2A', iid: 2, month: 'Jul 2026', type: 'rent' },
    { tenant: 'Sarah Johnson', amount: '£2,450', status: 'Paid', date: 'Jun 2, 2026', prop: '12 Park Lane', unit: 'Flat 2A', iid: 3, month: 'Jun 2026', type: 'rent' },
    { tenant: 'David Wilson', amount: '£1,850', status: 'Paid', date: 'Jun 3, 2026', prop: '45 Queens Rd', unit: 'Flat 1A', iid: 4, month: 'Jun 2026', type: 'rent' },
];

const DRAWER_QUICK = [
    ['circle-check', 'Record Rent', 'mark-rent-received'],
    ['wrench', 'Log Maintenance', 'log-maintenance'],
    ['user-plus', 'Invite Tenant', 'select-property-invite'],
    ['building-2', 'Add Property', 'add-property'],
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
    opts.tid != null ? `data-tid="${opts.tid}"` : '',
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

const formField = (label, value = '', type = 'text', ph = '', key = '') => {
    const placeholder = ph || `Enter ${label.toLowerCase()}`;
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    const fieldAttr = key ? ` data-field="${key}"` : '';
    return `<div><label class="form-label">${label}</label>
<input type="${type}" class="form-input"${fieldAttr}${valAttr} placeholder="${placeholder}"></div>`;
};

const formTextarea = (label, value = '', ph = '', key = '') => {
    const placeholder = ph || `Enter ${label.toLowerCase()}`;
    const content = value ? value : '';
    const fieldAttr = key ? ` data-field="${key}"` : '';
    return `<div><label class="form-label">${label}</label>
<textarea class="form-input min-h-[96px] resize-none"${fieldAttr} placeholder="${placeholder}">${content}</textarea></div>`;
};

const uxIntro = (text) => `<p class="ux-intro">${text}</p>`;
const uxTip = (text, title = '') => `<div class="ux-tip">${title ? `<p class="ux-tip-title">${title}</p>` : ''}<p class="ux-tip-text">${text}</p></div>`;
const uxStatGrid = (items) => `<div class="ux-stat-grid">${items.map(([v, l]) => `<div class="ux-stat"><p class="ux-stat-label">${l}</p><p class="ux-stat-value">${v}</p></div>`).join('')}</div>`;

const formSelect = (label, value, options, key = '') => {
    const fieldAttr = key ? ` data-field="${key}"` : '';
    return `<div><label class="form-label">${label}</label>
<select class="form-input form-select"${fieldAttr}>${options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
};

const photoUpload = (label = 'Add photos') => `
<button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
    <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
    <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${label}</p>
    <p class="text-[11px] text-[#64748B] mt-1">Select multiple from your device</p>
</button>`;

const saveBtn = (label = 'Save Changes', msg = 'Changes saved') => `
<button type="button" data-action="save" data-msg="${msg}" class="btn-primary w-full">${label}</button>`;

const menuList = (items) => `
<div class="card overflow-hidden shadow-sm">
    ${items.map(([icon, label, target], i) => `
    <button data-go="${target}" class="menu-row menu-row-item ${i < items.length - 1 ? 'border-b border-[#F1F5F9]' : ''}">
        <div class="flex items-center gap-3 min-w-0">
            <i data-lucide="${icon}" class="w-5 h-5 text-[#374151] shrink-0"></i>
            <span class="text-[13px] font-medium text-[#1F2937]">${label}</span>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-[#9CA3AF] shrink-0"></i>
    </button>`).join('')}
</div>`;

const bottomNav = () => {
    const nav = STATE.userRole === 'contractor' ? CONTRACTOR_BOTTOM_NAV
        : STATE.userRole === 'tenant' ? TENANT_BOTTOM_NAV
        : BOTTOM_NAV;
    const parentMap = STATE.userRole === 'contractor' ? {
        'contractor-job-detail': 'contractor-jobs',
        'contractor-schedule': 'contractor-job-detail',
        'contractor-work': 'contractor-job-detail',
        'contractor-documents': 'contractor-job-detail',
        'contractor-company': 'contractor-profile',
    } : STATE.userRole === 'tenant' ? {
        'log-maintenance': 'tenant-dashboard',
        'personal-info': 'tenant-dashboard',
        'chat': 'messages',
    } : {
        'tenant-detail': 'tenants',
        'maintenance-detail': 'maintenance',
        'property-detail': 'properties',
        'invoice-detail': 'financial',
        'financial': 'financial',
        'maintenance': 'maintenance',
        'profile': 'profile',
        'notifications-list': 'dashboard',
        'compliance-dashboard': 'dashboard',
        'reminders': 'dashboard',
        'portfolio-overview': 'dashboard',
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

const fabFloat = () => '';

const drawer = () => {
    const isActive = (sc) => STATE.screen === sc;
    const isContractor = STATE.userRole === 'contractor';
    const isTenant = STATE.userRole === 'tenant';
    const navHtml = isContractor
        ? CONTRACTOR_DRAWER_NAV.map(([ic, label, sc]) => `
        <button data-go="${sc}" class="drawer-item ${isActive(sc) ? 'active' : ''}">
            <i data-lucide="${ic}" class="w-5 h-5"></i><span>${label}</span>
        </button>`).join('')
        : isTenant
        ? TENANT_DRAWER_NAV.map(([ic, label, sc]) => `
        <button data-go="${sc}" class="drawer-item ${isActive(sc) ? 'active' : ''}">
            <i data-lucide="${ic}" class="w-5 h-5"></i><span>${label}</span>
        </button>`).join('')
        : LANDLORD_DRAWER_NAV.map(([ic, label, sc]) => `
        <button data-go="${sc}" class="drawer-item ${isActive(sc) ? 'active' : ''}">
            <i data-lucide="${ic}" class="w-5 h-5"></i><span>${label}</span>
        </button>`).join('');
    const profile = isContractor ? {
        img: IMG.avatar.plumber,
        name: 'Mike Thompson',
        role: 'Contractor · Plumber Pro Ltd',
    } : isTenant ? {
        img: getActiveTenant() ? IMG.avatar.sarah : IMG.avatar.john,
        name: getActiveTenant() ? `${getActiveTenant().firstName} ${getActiveTenant().lastName}` : 'Tenant',
        role: 'Tenant Portal',
    } : {
        img: IMG.avatar.john,
        name: 'John Smith',
        role: 'Landlord',
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
                <p class="filter-sheet-label">Unit rent (from)</p>
                <div class="filter-sheet-grid filter-sheet-grid-3">
                    ${opt('rent', 'all', 'All', adv.rent === 'all')}
                    ${opt('rent', 'under2k', 'Under £2k', adv.rent === 'under2k')}
                    ${opt('rent', 'over2k', '£2k+', adv.rent === 'over2k')}
                </div>
            </div>
            <div class="filter-sheet-group">
                <p class="filter-sheet-label">Bedrooms (any unit)</p>
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

const propertySectionHeader = (propertyId) => {
    const p = PROPERTIES[propertyId];
    const unit = STATE.propertyMaintUnit;
    if (unit) return { title: unit, subtitle: p?.address || p?.name || '' };
    return { title: p?.name || 'Property', subtitle: p?.address || '' };
};

const propSectionBar = (title, subtitle, detail = '') => {
    const pid = STATE.propertyId;
    const propertyMenuKey = `property:${pid}`;
    const propertyMenuOpen = STATE.actionMenuKey === propertyMenuKey;
    const showSummary = STATE.tab === 'units';
    const summary = showSummary && typeof renderPropertyHubSummaryCard === 'function'
        ? renderPropertyHubSummaryCard(pid)
        : '';
    return `
<div class="prop-section-header">
<div class="prop-section-bar">
    <div class="sub-header-left">
        <button type="button" data-action="back" class="back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
        <div class="min-w-0">
            <h2 class="sub-header-title">${title}</h2>
            ${subtitle ? `<p class="prop-section-sub">${subtitle}</p>` : (detail ? `<p class="prop-section-sub">${detail}</p>` : '')}
        </div>
    </div>
    <div class="prop-section-bar-actions">
        <button type="button" data-action="open-action-menu" data-menu-key="${propertyMenuKey}" class="prop-section-menu-btn action-menu-btn" aria-label="Property options" aria-expanded="${propertyMenuOpen}">
            <i data-lucide="more-vertical" class="w-5 h-5"></i>
        </button>
        ${typeof renderActionMenuPopover === 'function' ? renderActionMenuPopover(propertyMenuKey, propertyActionMenuItems(pid)) : ''}
    </div>
</div>
${summary ? `<div class="prop-section-summary-wrap">${summary}</div>` : ''}
${typeof renderPropertySectionNav === 'function' ? renderPropertySectionNav(STATE.tab) : ''}
</div>`;
};

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
    const monthlyRent = typeof portfolioStats === 'function' ? portfolioStats().monthlyRent : PROPERTIES.reduce((s, p) => s + parseInt(p.rent.replace(/[^\d]/g, ''), 10), 0);
    const overdueAmt = INVOICES.filter(i => i.status === 'Overdue').reduce((s, i) => s + parseInt(i.amount.replace(/[^\d]/g, ''), 10), 0);
    const overdueAmount = overdueAmt ? `£${overdueAmt.toLocaleString()}` : null;
    const fin = typeof financialStats === 'function' ? financialStats() : null;
    const collectedPct = fin?.pct ?? null;
    const compliancePct = PROPERTIES.length ? Math.round((compliantCount / PROPERTIES.length) * 100) : 0;
    const reminders = (typeof AppStore !== 'undefined' ? AppStore.reminders : [
        { title: 'Gas Certificate Expiry', propertyId: 0, daysLeft: 3, urgency: 'high', type: 'gas' },
        { title: 'Inspection Due', propertyId: 1, daysLeft: 5, urgency: 'medium', type: 'inspection' },
        { title: 'Rent Review', propertyId: 2, daysLeft: 10, urgency: 'medium', type: 'rent-review' },
    ]).slice(0, 3).map(r => {
        const p = PROPERTIES[r.propertyId];
        const rt = (typeof REMINDER_TYPES !== 'undefined' ? REMINDER_TYPES.find(t => t[0] === r.type) : null) || ['custom', r.title, 'bell', '#EFF6FF', '#2563EB'];
        const tab = r.type === 'inspection' ? 'inspection' : r.type === 'rent-review' ? 'units' : 'compliance';
        return [rt[2], r.title, p?.name || '', `${r.daysLeft} days left`, rt[3], rt[4], r.propertyId, tab, r.urgency];
    });
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

        ${overdueAmount ? `
        <button data-go="financial" data-invoice-preset="overdue" class="dash-alert">
            <div class="dash-alert-icon"><i data-lucide="alert-circle" class="w-5 h-5"></i></div>
            <div class="dash-alert-body">
                <p class="dash-alert-title">${overdueAmount} overdue rent</p>
                <p class="dash-alert-desc">Tap to review and follow up with tenant</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 dash-alert-chevron"></i>
        </button>` : ''}

        <div class="dash-quick">
            ${[
                ['house-plus', 'Add Property', 'add-property', 'primary'],
                ['wrench', 'Log Issue', 'log-maintenance', 'warning'],
                ['credit-card', 'Finances', 'financial', 'success'],
                ['users', 'Tenants', 'tenants', 'indigo'],
            ].map(([ic, label, go, tone]) => `
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-[22px] h-[22px]"></i></div>
                <span>${label}</span>
            </button>`).join('')}
        </div>

        <div class="dash-stat-grid">
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
                go: 'compliance-dashboard', variant: 'compliant', icon: 'shield-check',
                label: 'Compliant', value: `${compliantCount}/${PROPERTIES.length}`,
                pill: compliancePct === 100 ? 'OK' : null,
            })}
            ${collectedPct != null ? dashStatCard({
                go: 'financial', variant: 'collected', icon: 'trending-up',
                label: 'Collected', value: `${collectedPct}%`,
                pill: null,
            }) : ''}
        </div>

        <div>
            <div class="dash-section-head">
                <div>
                    <h3 class="screen-section-title">Upcoming reminders</h3>
                    <p class="dash-section-sub">${reminders.length} items coming up soon</p>
                </div>
                <button data-go="reminders" class="dash-view-all">View all</button>
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
    if (typeof syncPropertyStatus === 'function') PROPERTIES.forEach(p => syncPropertyStatus(p.id));
    const filtered = filterProperties();
    const counts = {
        all: PROPERTIES.length,
        occupied: PROPERTIES.filter(p => typeof propertyOccupiedFlatCount === 'function' ? propertyOccupiedFlatCount(p.id) > 0 : ['Occupied', 'Partial', 'Full'].includes(p.status)).length,
        vacant: PROPERTIES.filter(p => typeof propertyOccupiedFlatCount === 'function' ? propertyOccupiedFlatCount(p.id) === 0 : p.status === 'Vacant').length,
    };
    const adv = STATE.propertiesAdvanced;
    const activeAdv = adv.rent !== 'all' || adv.beds !== 'any';
    const portfolio = typeof portfolioStats === 'function' ? portfolioStats() : {
        buildingCount: PROPERTIES.length, totalUnits: 0, occupancy: 0,
    };
    const coverFor = (p) => typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(p.id) : IMG.props[p.id];
    const propCard = (p) => {
        const badge = typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id) : { label: p.status, bg: p.statusColor[0], color: p.statusColor[1] };
        const cardStats = typeof propertyCardStats === 'function' ? propertyCardStats(p.id) : { total: 0, monthlyRent: 0, occupancy: 0 };
        const monthlyRentLabel = cardStats.monthlyRent > 0 ? formatRentAmount(cardStats.monthlyRent) : '—';
        const unitLabel = `${cardStats.total} unit${cardStats.total === 1 ? '' : 's'}`;
        const propertyMenuKey = `property:${p.id}`;
        const propertyMenuOpen = STATE.actionMenuKey === propertyMenuKey;
        const primaryTenant = typeof propertyPrimaryTenant === 'function' ? propertyPrimaryTenant(p.id) : null;
        const primaryTenantData = primaryTenant?.tid != null ? TENANTS[primaryTenant.tid] : null;
        return `
        <article class="prop-card-v2 card${propertyMenuOpen ? ' prop-card-v2--menu-open' : ''}">
            <button type="button" data-go="property-detail" data-pid="${p.id}" data-tab="units" class="prop-card-v2-tap">
                <div class="prop-card-v2-top">
                    <div class="prop-card-v2-media">
                        <img src="${coverFor(p)}" alt="">
                        <span class="prop-card-v2-units-badge"><i data-lucide="image" class="w-3 h-3"></i>${unitLabel}</span>
                    </div>
                    <div class="prop-card-v2-info">
                        <p class="prop-card-v2-name">${p.name}</p>
                        <p class="prop-card-v2-addr"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${p.address}</p>
                        <span class="prop-card-v2-badge" style="background:${badge.bg};color:${badge.color}">${badge.label}</span>
                    </div>
                </div>
                <div class="prop-card-v2-stats">
                    <div class="prop-card-v2-stat">
                        <span class="prop-card-v2-stat-label">Monthly Rent</span>
                        <span class="prop-card-v2-stat-value prop-card-v2-stat-value--money">
                            ${cardStats.monthlyRent > 0 ? '<i data-lucide="pound-sterling" class="w-3.5 h-3.5 text-[#94A3B8]"></i>' : ''}
                            ${monthlyRentLabel}
                        </span>
                    </div>
                    <div class="prop-card-v2-stat">
                        <span class="prop-card-v2-stat-label">Total Units</span>
                        <span class="prop-card-v2-stat-value"><i data-lucide="building-2" class="w-3.5 h-3.5 text-[#94A3B8]"></i>${cardStats.total}</span>
                    </div>
                    <div class="prop-card-v2-stat">
                        <span class="prop-card-v2-stat-label">Occupancy Rate</span>
                        <span class="prop-card-v2-stat-value">
                            ${typeof occupancyRing === 'function' ? occupancyRing(cardStats.occupancy) : ''}
                            ${cardStats.occupancy}%
                        </span>
                    </div>
                </div>
            </button>
            ${primaryTenant ? `
            <div class="prop-card-v2-tenant">
                <button type="button" data-go="tenant-detail" data-tid="${primaryTenant.tid}" class="prop-card-v2-tenant-main">
                    ${primaryTenant.img ? `<img src="${primaryTenant.img}" alt="" class="prop-card-v2-tenant-avatar">` : `<span class="prop-card-v2-tenant-avatar prop-card-v2-tenant-avatar--ph">${primaryTenant.name.charAt(0)}</span>`}
                    <div class="min-w-0">
                        <p class="prop-card-v2-tenant-label">${primaryTenant.pending ? 'Pending tenant' : 'Primary tenant'}</p>
                        <p class="prop-card-v2-tenant-name">${primaryTenant.name}</p>
                        <p class="prop-card-v2-tenant-unit">${primaryTenant.unit}</p>
                    </div>
                </button>
                ${!primaryTenant.pending && primaryTenantData ? `
                <div class="prop-card-v2-tenant-actions">
                    ${primaryTenantData.phone ? `<button type="button" data-action="call-tenant" data-tid="${primaryTenant.tid}" class="prop-card-v2-contact" aria-label="Call ${primaryTenant.name}"><i data-lucide="phone" class="w-4 h-4"></i></button>` : ''}
                    ${primaryTenantData.email ? `<button type="button" data-action="email-tenant" data-tid="${primaryTenant.tid}" class="prop-card-v2-contact" aria-label="Email ${primaryTenant.name}"><i data-lucide="mail" class="w-4 h-4"></i></button>` : ''}
                </div>` : ''}
            </div>` : ''}
            <div class="prop-card-v2-menu-slot">
                <button type="button" data-action="open-action-menu" data-menu-key="${propertyMenuKey}" class="prop-card-v2-menu action-menu-btn" aria-label="Property options" aria-expanded="${propertyMenuOpen}">
                    <i data-lucide="more-vertical" class="w-4 h-4"></i>
                </button>
                ${typeof renderActionMenuPopover === 'function' ? renderActionMenuPopover(propertyMenuKey, propertyActionMenuItems(p.id)) : ''}
            </div>
        </article>`;
    };
    const filterChips = [
        ['all', 'All', counts.all, 'building-2'],
        ['occupied', 'Occupied', counts.occupied, 'users'],
        ['vacant', 'Vacant', counts.vacant, 'home'],
    ];
    return `
    <div class="screen-header properties-page-header">
        <div class="dash-header-top">
            <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
            <div class="flex gap-1">
                <button type="button" data-focus-search="properties" class="top-icon-btn"><i data-lucide="search" class="w-[20px] h-[20px]"></i></button>
                <button data-go="notifications-list" class="top-icon-btn relative">
                    <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
                    ${(() => { const n = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(x => x.unread).length; return n ? `<span class="notif-badge">${n}</span>` : ''; })()}
                </button>
            </div>
        </div>
        <div class="properties-title-row">
            <div class="min-w-0">
                <h1 class="page-title">Properties</h1>
                <p class="page-subtitle">Manage your properties and units.</p>
            </div>
            <button type="button" data-go="add-property" class="properties-add-btn"><i data-lucide="plus" class="w-4 h-4"></i>Add Property</button>
        </div>
    </div>
    <div class="screen-content screen-enter properties-page">
        <div class="properties-search-row">
            <div class="search-bar flex-1">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="properties" type="text" value="${STATE.search.properties}" placeholder="Search by property name, address..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-action="toggle-prop-filters" class="filter-btn ${activeAdv ? 'filter-btn-active' : ''}" aria-label="Filter properties">
                <i data-lucide="sliders-horizontal" class="w-[18px] h-[18px]"></i>
                ${activeAdv ? '<span class="filter-btn-dot"></span>' : ''}
            </button>
        </div>
        <div class="properties-filter-row">
            ${filterChips.map(([k, l, n, ic]) => `
            <button type="button" data-prop-filter="${k}" class="properties-filter-chip ${STATE.propertiesFilter === k ? 'active' : ''}">
                <i data-lucide="${ic}" class="w-3.5 h-3.5"></i>${l} (${n})
            </button>`).join('')}
        </div>
        <div class="properties-summary-bar properties-summary-bar--top">
            <div class="properties-summary-item">
                <span class="properties-summary-icon properties-summary-icon--blue"><i data-lucide="building-2" class="w-4 h-4"></i></span>
                <div><p class="properties-summary-val">${portfolio.buildingCount}</p><p class="properties-summary-lbl">Total Properties</p></div>
            </div>
            <div class="properties-summary-item">
                <span class="properties-summary-icon properties-summary-icon--green"><i data-lucide="home" class="w-4 h-4"></i></span>
                <div><p class="properties-summary-val">${portfolio.totalUnits}</p><p class="properties-summary-lbl">Total Units</p></div>
            </div>
            <div class="properties-summary-item">
                <span class="properties-summary-icon properties-summary-icon--purple"><i data-lucide="pie-chart" class="w-4 h-4"></i></span>
                <div><p class="properties-summary-val">${portfolio.occupancy}%</p><p class="properties-summary-lbl">Overall Occupancy</p></div>
            </div>
        </div>
        ${filtered.length ? `<div class="properties-card-list">
            ${filtered.map(p => propCard(p)).join('')}
        </div>` : `<div class="card p-8 text-center"><i data-lucide="building-2" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No properties found</p><p class="text-[12px] text-[#64748B] mt-1">Try a different search or filter</p></div>`}
    </div>`;
}

function screenPropertyDetail() {
    const p = PROPERTIES[STATE.propertyId];
    const tabContent = {
        details: typeof renderPropertyOverviewDetails === 'function'
            ? renderPropertyOverviewDetails(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading property details…</p></div>`,
        tenant: typeof renderPropertyTenantTab === 'function'
            ? renderPropertyTenantTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading tenants…</p></div>`,
        units: typeof renderPropertyUnitsTab === 'function'
            ? renderPropertyUnitsTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading units…</p></div>`,
        documents: typeof renderPropertyDocumentsTab === 'function'
            ? renderPropertyDocumentsTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading documents…</p></div>`,
        maintenance: (() => {
            const unitScope = STATE.propertyMaintUnit;
            let propMaint = propertyMaintenanceItems(p.name);
            if (unitScope && typeof maintenanceForUnit === 'function') {
                propMaint = maintenanceForUnit(STATE.propertyId, unitScope);
            }
            const openItems = propMaint.filter(m => m.status !== 'done');
            return `
            <div class="screen-content screen-content-sm prop-hub-page">
                <div class="maint-toolbar maint-toolbar--inline">
                    <p class="maint-section-label maint-toolbar-label">${openItems.length ? `${openItems.length} open issue${openItems.length === 1 ? '' : 's'}` : 'All clear — no open issues'}</p>
                    <button type="button" data-go="log-maintenance" data-pid="${STATE.propertyId}"${unitScope ? ` data-unit="${unitScope}"` : ''} class="maint-log-btn" title="Log new issue" aria-label="Log new issue">
                        <i data-lucide="plus" class="w-5 h-5"></i>
                    </button>
                </div>
                ${openItems.length ? `<div class="maint-list">${openItems.map(m => maintCard(m, { hideProperty: true })).join('')}</div>` : `
                <div class="card p-8 text-center">
                    <i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
                    <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No open issues</p>
                    <p class="text-[12px] text-[#64748B] mt-1">Tap + to log a new issue</p>
                </div>`}
            </div>`;
        })(),
        inspection: typeof renderPropertyInspectionTab === 'function'
            ? renderPropertyInspectionTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading inspections…</p></div>`,
        compliance: typeof renderPropertyComplianceTab === 'function'
            ? renderPropertyComplianceTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading compliance…</p></div>`,
        inventory: typeof renderPropertyInventoryTab === 'function'
            ? renderPropertyInventoryTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading inventory…</p></div>`,
        'floor-plans': `<div class="screen-content"><button data-tab="details" class="btn-primary w-full py-3.5 text-[14px]">Open Building Info</button></div>`,
        photos: `<div class="screen-content"><button data-tab="details" class="btn-primary w-full py-3.5 text-[14px]">Open Building Info</button></div>`,
        timeline: `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Activity is shown on the dashboard and in each section (maintenance, compliance, inspections).</p></div>`,
        info: typeof renderPropertyMoreHub === 'function'
            ? renderPropertyMoreHub(STATE.propertyId)
            : (typeof renderPropertyInfoHub === 'function'
                ? renderPropertyInfoHub(STATE.propertyId)
                : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading…</p></div>`),
    };

    const infoBack = typeof propertyInfoSectionBackBar === 'function' ? propertyInfoSectionBackBar(STATE.tab) : '';
    const { title: sectionTitle, subtitle: sectionSubtitle } = propertySectionHeader(STATE.propertyId);
    return `
    ${propSectionBar(sectionTitle, sectionSubtitle)}
    <div class="screen-enter">${infoBack}${tabContent[STATE.tab] || tabContent.units}</div>`;
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
        <button type="button" data-go="select-property-invite" class="btn-primary tenant-add-btn">
            <i data-lucide="plus" class="w-5 h-5"></i> Invite Tenant
        </button>
    </div>`;
}

const tenantStatusPill = (status) => {
    const map = {
        active: ['Active', '#ECFDF5', '#059669'],
        inactive: ['Inactive', '#F1F5F9', '#64748B'],
        pending: ['Pending Invite', '#FFFBEB', '#D97706'],
    };
    const [label, bg, color] = map[status] || map.active;
    return `<span class="tenant-status-pill" style="background:${bg};color:${color}">${label}</span>`;
};

const tenantListRow = (t, opts = {}) => {
    const tenancy = typeof getTenancyForTenantListItem === 'function' ? getTenancyForTenantListItem(t) : null;
    const typePill = tenancy && typeof tenancyTypePill === 'function' ? tenancyTypePill(tenancy.type) : '';
    const groupMeta = typeof tenantTenancyMetaLine === 'function' ? tenantTenancyMetaLine(t) : '';
    const locationLine = opts.hideProperty
        ? (t.unit || '—')
        : `${t.prop}${t.unit ? ` · ${t.unit}` : ''}`;
    const menuKey = `tenant:${t.id}`;
    const menuOpen = STATE.actionMenuKey === menuKey;
    const menuBtn = typeof renderActionMenuButton === 'function' ? renderActionMenuButton(menuKey, 'Tenant options') : '';
    const menuPop = typeof renderActionMenuPopover === 'function' && typeof tenantActionMenuItems === 'function'
        ? renderActionMenuPopover(menuKey, tenantActionMenuItems(t, { includeView: false }))
        : '';
    return `
<div class="tenant-row-wrap card ${tenancy ? `tenant-row--${tenancy.type}` : ''}${menuOpen ? ' tenant-row-wrap--menu-open' : ''}">
<div class="tenant-row-content">
<button type="button" data-go="tenant-detail" data-tid="${t.id}" class="tenant-row w-full text-left">
    <img src="${t.img}" class="tenant-row-avatar" alt="">
    <div class="tenant-row-body">
        <div class="tenant-row-top">
            <p class="tenant-row-name">${t.name}</p>
            <div class="tenant-row-badges">
                ${typePill}
                ${tenantStatusPill(t.status)}
            </div>
        </div>
        <p class="tenant-row-prop">${locationLine}</p>
        <p class="tenant-row-meta">${t.rent}${groupMeta ? ` · ${groupMeta}` : ''}</p>
    </div>
    <i data-lucide="chevron-right" class="tenant-row-chevron w-5 h-5"></i>
</button>
${typeof tenantListQuickActions === 'function' ? tenantListQuickActions(t) : ''}
</div>
<div class="tenant-row-menu-slot">${menuBtn}${menuPop}</div>
</div>`;
};

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
    const tenancy = typeof getTenancyForTenantListItem === 'function' ? getTenancyForTenantListItem(listItem) : null;
    const typePill = tenancy && typeof tenancyTypePill === 'function' ? tenancyTypePill(tenancy.type) : '';
    const tenantMenuKey = `tenant:${listItem.id}`;
    const tenantMenuOpen = STATE.actionMenuKey === tenantMenuKey;
    const locLabel = listItem.unit ? `${listItem.prop} · ${listItem.unit}` : listItem.prop;
    const locNav = listItem.unit && listItem.propertyId != null
        ? `data-go="flat-detail" data-pid="${listItem.propertyId}" data-unit="${listItem.unit}"`
        : `data-go="property-detail" data-pid="${listItem.propertyId ?? 0}"`;
    return `
    <div class="tenant-hero-card ${tenancy ? `tenant-hero-card--${tenancy.type}` : ''}">
        <div class="tenant-hero-glow tenant-hero-glow-1" aria-hidden="true"></div>
        <div class="tenant-hero-glow tenant-hero-glow-2" aria-hidden="true"></div>
        <div class="tenant-hero-shine" aria-hidden="true"></div>
        <div class="tenant-hero-toolbar">
            <button type="button" data-action="back" class="tenant-hero-back"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <div class="tenant-hero-menu-slot${tenantMenuOpen ? ' tenant-hero-menu-slot--menu-open' : ''}">
                ${typeof renderActionMenuButton === 'function' ? renderActionMenuButton(tenantMenuKey, 'Tenant options') : ''}
                ${typeof renderActionMenuPopover === 'function' && typeof tenantActionMenuItems === 'function' ? renderActionMenuPopover(tenantMenuKey, tenantActionMenuItems(listItem)) : ''}
            </div>
        </div>
        <div class="tenant-hero-content">
            <div class="tenant-hero-avatar-wrap">
                <img src="${avatar}" class="tenant-hero-avatar" alt="">
            </div>
            <h2 class="tenant-hero-name">${t.firstName} ${t.lastName}</h2>
            <div class="tenant-hero-tags">
                <span class="tenant-hero-badge"><span class="tenant-hero-badge-dot"></span>${listItem.status === 'active' ? 'Active' : listItem.status === 'pending' ? 'Pending invite' : 'Inactive'}</span>
                ${typePill}
            </div>
        </div>
        <div class="tenant-hero-meta">
            <button type="button" class="tenant-hero-chip" ${locNav} aria-label="View ${locLabel}">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                <span>${locLabel}</span>
                <i data-lucide="chevron-right" class="tenant-hero-chip-arrow w-3.5 h-3.5"></i>
            </button>
            <div class="tenant-hero-stats">
                <div class="tenant-hero-stat">
                    <span class="tenant-hero-stat-label">Monthly Rent</span>
                    <strong>${typeof formatTenantRent === 'function' ? formatTenantRent(t.rent) : listItem.rent}</strong>
                </div>
                <div class="tenant-hero-stat-divider"></div>
                <div class="tenant-hero-stat">
                    <span class="tenant-hero-stat-label">Lease Ends</span>
                    <strong>${typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(t.leaseEnd) : listItem.leaseEnd}</strong>
                </div>
            </div>
        </div>
    </div>
    ${typeof renderTenantNotesPreview === 'function' ? renderTenantNotesPreview(STATE.tenantId) : ''}
    <div class="tenant-menu-wrap">
        ${TENANT_MENU.map(g => `
        <div class="tenant-menu-group">
            <p class="tenant-menu-group-label">${g.group}</p>
            <div class="card tenant-menu-card">${g.items.map(([ic, lb, tab]) => tenantMenuItem(ic, lb, tab)).join('')}</div>
        </div>`).join('')}
    </div>`;
};

const tenantSectionContent = (tab, t) => {
    const listItem = TENANT_LIST[STATE.tenantId] || TENANT_LIST[0];
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(STATE.tenantId) : null;
    const formatDob = (dob) => {
        if (!dob) return '—';
        const d = new Date(dob);
        return Number.isNaN(d.getTime()) ? dob : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    const sections = {
        personal: () => {
            const nidDoc = typeof getTenantNidProof === 'function' ? getTenantNidProof(STATE.tenantId) : null;
            return `
            ${tenantFieldsCard([
                ['Full Name', `${t.firstName} ${t.lastName}`],
                ['Date of Birth', formatDob(t.dob)],
                ['NID', t.idNumber || '—'],
            ])}
            <div class="card p-4">
                <div class="flex items-center gap-3">
                    <div class="tenant-doc-icon" style="color:#7C3AED"><i data-lucide="id-card" class="w-5 h-5"></i></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[13px] font-semibold text-[#0F172A]">NID Document Proof</p>
                        <p class="text-[12px] text-[#64748B] mt-0.5">${nidDoc ? nidDoc.name : 'Not uploaded'}</p>
                    </div>
                    ${nidDoc ? `<button type="button" data-go="document-preview" data-preview-source="tenant-nid" data-tid="${STATE.tenantId}" class="header-text-link text-[12px]">View</button>` : ''}
                </div>
            </div>`;
        },
        contact: () => `
            ${typeof renderContactOutlineRow === 'function' ? renderContactOutlineRow([
                ['phone', 'Call', `data-action="call-tenant" data-tid="${STATE.tenantId}"`],
                ['mail', 'Email', `data-action="email-tenant" data-tid="${STATE.tenantId}"`],
            ]) : ''}
            ${tenantFieldsCard([
            ['Phone', t.phone || '—'],
            ['Email', t.email || '—'],
            ['Emergency Contact', t.emergency || '—'],
            ['Emergency Phone', t.emergencyPhone || '—'],
        ])}`,
        property: () => {
            const tenancy = typeof getTenancyForUnit === 'function' ? getTenancyForUnit(listItem.propertyId, listItem.unit) : null;
            const checkoutRec = typeof AppStore !== 'undefined'
                ? AppStore.checkoutRecords?.find(r => r.tenantId === STATE.tenantId)
                : null;
            const checkoutNotes = checkoutRec?.notes?.trim() || tenancy?.checkout?.notes?.trim() || '';
            return `
            ${typeof renderTenantLivingCard === 'function' ? renderTenantLivingCard(listItem) : ''}
            ${tenancy ? tenantFieldsCard([
                ['Tenancy', tenancy.type === 'group' ? 'Group' : 'Solo'],
                ['Move-in', typeof formatDisplayDate === 'function' ? formatDisplayDate(t.moveIn) || '—' : '—'],
            ]) : ''}
            ${checkoutNotes ? `
            <div class="card p-4 note-block-item">
                <p class="note-block-label">Check-out note</p>
                <p class="note-block-text">${checkoutNotes}</p>
                ${checkoutRec?.date ? `<p class="note-block-meta">${typeof formatDisplayDate === 'function' ? formatDisplayDate(checkoutRec.date) || checkoutRec.date : checkoutRec.date}</p>` : ''}
            </div>` : ''}
            <div class="grid grid-cols-2 gap-3">
                <button type="button" data-go="flat-detail" data-pid="${listItem.propertyId}" data-unit="${listItem.unit || ''}" class="btn-secondary py-3 text-[13px]">View unit</button>
                ${tenancy ? `<button type="button" data-go="tenancy-detail" data-pid="${listItem.propertyId}" data-unit="${listItem.unit || ''}" class="btn-secondary py-3 text-[13px]">View tenancy</button>` : `<button type="button" data-go="property-detail" data-pid="${listItem.propertyId}" class="btn-secondary py-3 text-[13px]">View property</button>`}
            </div>
            ${typeof renderTenancyContextCard === 'function' ? renderTenancyContextCard(STATE.tenantId) : (typeof renderTenancyMemberList === 'function' ? renderTenancyMemberList(STATE.tenantId) : '')}`;
        },
        lease: () => sections.property(),
        identity: () => sections.documents(),
        documents: () => {
            const docs = typeof getTenantDocuments === 'function' ? getTenantDocuments(t.id) : [
                ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                ['file-image', 'NID Proof.jpg', 'Jan 10, 2024', '#7C3AED'],
            ];
            return `
            <div class="stack-sm">
                ${typeof renderTenantDocThumbGrid === 'function' ? renderTenantDocThumbGrid(docs, t.id) : docs.map(([ic, name, date, color], idx) => `
                <button type="button" data-go="document-preview" data-preview-source="tenant" data-preview-idx="${idx}" class="card tenant-doc-row w-full text-left">
                    <div class="tenant-doc-icon" style="color:${color}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                    <div class="flex-1 min-w-0">
                        <p class="tenant-doc-name">${name}</p>
                        <p class="tenant-doc-date">${date}</p>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#94A3B8]"></i>
                </button>`).join('')}
                <button type="button" data-action="upload-tenant-doc" class="tenant-upload-zone">
                    <i data-lucide="upload" class="w-6 h-6"></i>
                    <p>Upload document</p>
                </button>
            </div>`;
        },
        payments: () => {
            const unpaidInv = typeof invoicesForTenant === 'function'
                ? invoicesForTenant(STATE.tenantId).find(i => i.status !== 'Paid')
                : null;
            return `
            <div class="tenant-balance-card card ${pay?.balance !== '£0.00' ? 'tenant-balance-card--due' : ''}">
                <p class="tenant-balance-label">${pay?.balance !== '£0.00' ? 'Outstanding balance' : 'All paid up'}</p>
                <p class="tenant-balance-amount">${pay?.balance || '£0.00'}</p>
                <div class="tenant-balance-grid">
                    <div><p class="tenant-balance-mini-label">Last payment</p><p class="tenant-balance-mini-value">${pay?.lastPayment || '—'}</p></div>
                    <div><p class="tenant-balance-mini-label">Next due</p><p class="tenant-balance-mini-value">${pay?.nextDue || '—'}</p></div>
                </div>
            </div>
            ${unpaidInv ? `
            <button type="button" data-go="mark-rent-received" data-iid="${unpaidInv.id}" class="btn-primary w-full py-3 text-[13px]">Record payment for this tenant</button>` : ''}
            <div class="screen-list-header"><div><h2>Monthly history</h2><p>Per flat · ${listItem.unit || 'unit'}</p></div></div>
            ${typeof renderTenantRentHistory === 'function' ? renderTenantRentHistory(STATE.tenantId) : ''}
            <button type="button" data-go="transaction-history" class="btn-secondary w-full py-3 text-[13px]">All payment history</button>`;
        },
        maintenance: () => typeof renderTenantMaintenanceSection === 'function'
            ? renderTenantMaintenanceSection(STATE.tenantId)
            : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No maintenance data</p></div>`,
        notes: () => typeof renderTenantNotesSection === 'function'
            ? renderTenantNotesSection(STATE.tenantId)
            : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No notes yet</p></div>`,
        activity: () => typeof renderTenantActivitySection === 'function'
            ? renderTenantActivitySection(STATE.tenantId, t)
            : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`,
    };
    return sections[tab] ? sections[tab]() : '';
};

const TENANT_SECTION_TITLES = {
    personal: 'Personal & ID', contact: 'Contact',
    property: 'Tenancy', lease: 'Tenancy',
    identity: 'Documents', documents: 'Documents',
    payments: 'Payments', maintenance: 'Maintenance',
    notes: 'Notes',
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
    const f = STATE.maintFilter || 'all';
    const scopeF = STATE.maintScopeFilter || 'all';
    const q = (STATE.search.maintenance || '').toLowerCase();
    const isCommunal = typeof isCommunalMaint === 'function' ? isCommunalMaint : () => false;
    const counts = {
        all: MAINTENANCE_ITEMS.length,
        open: MAINTENANCE_ITEMS.filter(m => m.status === 'open').length,
        progress: MAINTENANCE_ITEMS.filter(m => m.status === 'progress').length,
        done: MAINTENANCE_ITEMS.filter(m => m.status === 'done').length,
    };
    const activeCount = counts.open + counts.progress;
    let items = f === 'all' ? MAINTENANCE_ITEMS : MAINTENANCE_ITEMS.filter(m => m.status === f);
    if (scopeF === 'unit') items = items.filter(m => !isCommunal(m));
    else if (scopeF === 'communal') items = items.filter(m => isCommunal(m));
    if (q) {
        items = items.filter(m =>
            m.issue.toLowerCase().includes(q)
            || m.prop.toLowerCase().includes(q)
            || (m.unit || '').toLowerCase().includes(q)
            || (m.communalArea || '').toLowerCase().includes(q)
            || (m.tenantName || '').toLowerCase().includes(q)
        );
    }
    const unreadBell = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(n => n.unread).length;
    const summaryCards = [
        ['open', 'alert-circle', counts.open, 'Open', 'maint-summary-icon--open'],
        ['progress', 'loader', counts.progress, 'In Progress', 'maint-summary-icon--progress'],
        ['done', 'check-circle', counts.done, 'Done', 'maint-summary-icon--done'],
        ['all', 'archive', counts.all, 'All', 'maint-summary-icon--all'],
    ];
    return `
    <div class="screen-header maint-page-header">
        <div class="dash-header-top">
            <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
            <button data-go="notifications-list" class="top-icon-btn relative">
                <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
                ${unreadBell ? `<span class="notif-badge">${unreadBell}</span>` : ''}
            </button>
        </div>
        <div class="maint-title-block">
            <h1 class="page-title">Maintenance</h1>
            <p class="page-subtitle">${activeCount} active issue${activeCount === 1 ? '' : 's'}</p>
        </div>
    </div>
    <div class="screen-content screen-enter maint-page">
        <div class="maint-search-row">
            <div class="search-bar flex-1">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="maintenance" type="text" value="${STATE.search.maintenance || ''}" placeholder="Search issues..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-go="log-maintenance" class="maint-log-btn" title="Log new issue" aria-label="Log new issue">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
        </div>
        <div class="maint-summary-row">
            ${summaryCards.map(([key, icon, n, label, cls]) => `
            <button type="button" data-maint-filter="${key}" class="maint-summary-card ${f === key ? 'maint-summary-card--active' : ''}">
                <span class="maint-summary-icon ${cls}"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
                <span class="maint-summary-val">${n}</span>
                <span class="maint-summary-lbl">${label}</span>
            </button>`).join('')}
        </div>
        <div class="filter-tabs" style="margin-bottom:12px">
            ${[
                ['all', 'All locations'],
                ['unit', 'Units'],
                ['communal', 'Communal'],
            ].map(([key, label]) => `
            <button type="button" data-maint-scope-filter="${key}" class="filter-chip ${scopeF === key ? 'active' : ''}">${label}</button>`).join('')}
        </div>
        ${items.length ? `<div class="maint-list">${items.map(m => maintCard(m)).join('')}</div>` : `
        <div class="card p-8 text-center">
            <i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No issues found</p>
            <p class="text-[12px] text-[#64748B] mt-1">${q ? 'Try a different search' : 'Tap + to log a new issue'}</p>
        </div>`}
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
        <div class="invoice-list card">${filtered.length ? filtered.map(invoiceRow).join('') : `<div class="p-8 text-center"><i data-lucide="file-text" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No invoices found</p><p class="text-[12px] text-[#64748B] mt-1">Create an invoice to get started</p></div>`}</div>
        <div class="grid grid-cols-2 gap-3">
            <button data-go="create-invoice" class="btn-primary py-3 text-[13px]">Create Invoice</button>
            <button data-go="mark-rent-received" class="btn-secondary py-3 text-[13px]">Mark Received</button>
        </div>
        <button data-go="pay-contractor" class="btn-secondary w-full py-3 text-[13px] mt-2">Pay Contractor Invoices</button>
    </div>`;
}

function screenMessages() {
    const q = STATE.search.messages.toLowerCase();
    const convos = conversationsForRole().filter(c =>
        !q || c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
    const emptyMsg = STATE.userRole === 'tenant'
        ? 'Your landlord will appear here once your account is activated'
        : STATE.userRole === 'contractor'
        ? 'Job-related chats with landlords and tenants appear here'
        : 'Try a different search term';
    return `${messagesHeader()}
    <div class="screen-content screen-enter">
        ${convos.length ? `<div class="inbox-list full-bleed">${convos.map(c => msgRow(c)).join('')}</div>` : `
        <div class="inbox-empty">
            <p class="text-[14px] font-semibold text-[#0F172A]">No messages found</p>
            <p class="text-[13px] text-[#64748B] mt-1">${emptyMsg}</p>
        </div>`}
    </div>`;
}

function screenChat() {
    const allowed = conversationsForRole().map(c => c.id);
    if (STATE.userRole !== 'landlord' && allowed.length && !allowed.includes(STATE.chatId)) {
        STATE.chatId = allowed[0];
    }
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
                    <p class="text-[13px] font-bold text-[#0F172A] leading-tight">${c.name}</p>
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
            <button type="button" class="chat-input-icon" data-action="toast" data-msg="Attachment added"><i data-lucide="paperclip" class="w-[18px] h-[18px]"></i></button>
            <input type="text" data-chat-input class="chat-input-field" placeholder="Type a message..." value="${STATE.chatDraft || ''}">
            <button type="button" data-action="send-chat" class="chat-send-btn"><i data-lucide="send" class="w-[17px] h-[17px]"></i></button>
        </div>
    </div>`;
}

function screenProfile() {
    const accountMenus = menuList([
        ['bell', 'Notification Settings', 'notifications-settings'],
        ['sliders-horizontal', 'Preferences', 'preferences'],
        ['key-round', 'Change Password', 'password'],
        ['shield', 'Security', 'security'],
    ]);
    const rentMenus = menuList([
        ['landmark', 'Rent Collection Accounts', 'payment-methods'],
        ['receipt', 'Transaction History', 'transaction-history'],
    ]);
    const platformMenus = menuList([
        ['credit-card', 'Subscription & Billing', 'subscription'],
        ['help-circle', 'Help & Support', 'help-support'],
        ['info', 'About Landlord HQ', 'about'],
        ['shield', 'Privacy Policy', 'privacy'],
        ['file-text', 'Terms & Conditions', 'terms'],
    ]);
    return `${topBar('Profile', { back: true, hideBell: true })}
    <div class="screen-content screen-enter">
        <button data-go="personal-info" class="profile-card">
            <img src="${IMG.avatar.john}" class="profile-card-avatar" alt="">
            <div class="profile-card-body">
                <p class="profile-card-name">${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}</p>
                <p class="profile-card-hint">Your landlord account</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>
        <p class="section-title">Your account</p>
        <p class="section-hint">Settings you control for your portfolio.</p>
        ${accountMenus}
        <p class="section-title">Rent & payouts</p>
        <p class="section-hint">How you collect rent from tenants.</p>
        ${rentMenus}
        <p class="section-title">Landlord HQ platform</p>
        <p class="section-hint">Billing and legal info managed by Landlord HQ — read only here.</p>
        ${platformMenus}
        <button data-action="logout" class="w-full py-3.5 mt-4 text-[14px] font-semibold text-[#DC2626]">Log Out</button>
    </div>`;
}

function screenPersonalInfo() {
    if (STATE.userRole === 'tenant') {
        const t = getActiveTenant();
        const tenantNav = typeof shouldShowBottomNav === 'function' && shouldShowBottomNav('personal-info');
        if (!t) {
            return `${topBar('Account', { back: !tenantNav })}
            <div class="screen-content screen-enter">
                <p class="text-[14px] text-[#64748B]">Activate your account via invitation link to view profile.</p>
            </div>`;
        }
        const p = PROPERTIES[t.propertyId];
        return `${topBar('Account', { back: !tenantNav })}
        <div class="screen-content screen-content-sm screen-enter">
            <div class="flex justify-center mb-2">
                <img src="${IMG.avatar.sarah}" class="w-20 h-20 rounded-2xl object-cover" alt="">
            </div>
            ${formField('First Name', t.firstName, 'text', '', 'firstName')}${formField('Last Name', t.lastName, 'text', '', 'lastName')}
            ${formField('Email', t.email, 'email', '', 'email')}${formField('Phone', t.phone || '—', 'tel', '', 'phone')}
            <div><label class="form-label">Property</label><input class="form-input" value="${p?.name || '—'}" readonly></div>
            <div><label class="form-label">Unit</label><input class="form-input" value="${t.unit || '—'}" readonly></div>
            <p class="section-title">Support & Legal</p>
            ${menuList([
                ['help-circle', 'Help & Support', 'help-support'],
                ['shield', 'Privacy Policy', 'privacy'],
                ['file-text', 'Terms & Conditions', 'terms'],
                ['info', 'About', 'about'],
            ])}
            <button data-action="logout" class="btn-secondary w-full py-3 text-[13px] mt-4 text-[#DC2626] border border-[#FECACA]">Sign Out</button>
        </div>`;
    }
    const u = LANDLORD_USER;
    return `${topBar('Personal Information', { back: true })}
    <div class="screen-content screen-enter">
        <div class="flex justify-center mb-2">
            <div class="relative"><img src="${IMG.avatar.john}" class="w-20 h-20 rounded-2xl object-cover" alt="">
            <button type="button" data-action="toast" data-msg="Photo updated" class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center"><i data-lucide="camera" class="w-4 h-4 text-white"></i></button></div>
        </div>
        ${formField('First Name', u.firstName, 'text', '', 'firstName')}${formField('Last Name', u.lastName, 'text', '', 'lastName')}
        ${formField('Email', u.email, 'email', '', 'email')}${formField('Phone', u.phone, 'tel', '', 'phone')}
        ${formField('Address', u.address, 'text', '', 'address')}
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
        <div><label class="form-label">Current Password</label><input data-field="currentPassword" type="password" class="form-input" placeholder="Enter current password"></div>
        <div><label class="form-label">New Password</label><input data-field="newPassword" type="password" class="form-input" placeholder="Enter new password"></div>
        <div><label class="form-label">Confirm Password</label><input data-field="confirmPassword" type="password" class="form-input" placeholder="Confirm new password"></div>
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
    const cards = typeof getPaymentMethods === 'function' ? getPaymentMethods() : [
        { id: 0, type:'Visa', last4:'4242', exp:'08/27', name:'John Smith', default:true },
        { id: 1, type:'Barclays', last4:'8901', exp:'—', name:'Rent Collection', default:false },
    ];
    return `${topBar('Rent Collection Accounts', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        <p class="ux-intro">Bank accounts and cards where tenants pay rent. This is your money — not your Landlord HQ subscription.</p>
        ${cards.map(c => `
        <button data-go="edit-payment-method" data-pmid="${c.id}" class="card p-4 flex items-center gap-3 w-full text-left ${c.default ? '' : 'opacity-80'}">
            <div class="w-10 h-10 rounded-xl ${c.type === 'Visa' ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]'} flex items-center justify-center"><i data-lucide="${c.type === 'Visa' ? 'credit-card' : 'landmark'}" class="w-5 h-5 ${c.type === 'Visa' ? 'text-[#2563EB]' : 'text-[#64748B]'}"></i></div>
            <div class="flex-1"><p class="text-[14px] font-semibold">${c.type} ···· ${c.last4}</p><p class="text-[12px] text-[#64748B]">${c.default ? `Expires ${c.exp} · Default` : c.name}</p></div>
            ${c.default ? '<span class="badge bg-[#DCFCE7] text-[#16A34A]">Active</span>' : '<i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>'}
        </button>`).join('')}
        <button data-go="add-payment-method" class="btn-secondary w-full py-3.5 text-[14px] mt-2">Add Payment Method</button>
    </div>`;
}

function screenSubscription() {
    const currentId = LANDLORD_USER.subscriptionPlanId || 'pro';
    const current = getSubscriptionPlan(currentId);
    const renewDate = '15 Mar 2026';
    const renderPlanCard = (plan) => {
        const isCurrent = plan.id === currentId;
        return `
        <div class="sub-plan-card card ${isCurrent ? 'sub-plan-card--current' : ''} ${plan.popular ? 'sub-plan-card--popular' : ''}">
            ${plan.popular ? '<span class="sub-plan-badge">Most popular</span>' : ''}
            <div class="sub-plan-head">
                <div>
                    <p class="sub-plan-name">${plan.name}</p>
                    <p class="sub-plan-tagline">${plan.tagline}</p>
                </div>
                <div class="sub-plan-price-wrap">
                    <p class="sub-plan-price">£${plan.price}<span>/mo</span></p>
                </div>
            </div>
            <p class="sub-plan-properties">${plan.properties}</p>
            <ul class="sub-plan-features">
                ${plan.features.map(f => `<li><i data-lucide="check" class="w-3.5 h-3.5"></i>${f}</li>`).join('')}
            </ul>
            ${isCurrent
                ? `<button type="button" class="sub-plan-btn sub-plan-btn--current" disabled>Current plan</button>`
                : `<button type="button" data-subscription-plan="${plan.id}" class="sub-plan-btn">Switch to ${plan.name}</button>`}
        </div>`;
    };
    return `${topBar('Subscription & Billing', { back: true })}
    <div class="screen-content screen-enter subscription-page">
        <div class="sub-current card">
            <div class="sub-current-top">
                <div>
                    <p class="sub-current-label">Your plan</p>
                    <p class="sub-current-name">${current.name}</p>
                </div>
                <span class="sub-current-pill">Active</span>
            </div>
            <p class="sub-current-meta">£${current.price}/month · Renews ${renewDate}</p>
        </div>
        <p class="screen-section-title">Compare plans</p>
        <p class="section-hint">Demo only — switch plans to preview billing tiers.</p>
        <div class="sub-plan-list">
            ${SUBSCRIPTION_PLANS.map(renderPlanCard).join('')}
        </div>
        <button type="button" data-action="toast" data-msg="Billing history opens in a full release" class="btn-secondary w-full py-3 text-[13px]">View billing history</button>
        <button type="button" data-action="toast" data-msg="support@landlordhq.com" class="btn-secondary w-full py-3 text-[13px] mt-2">Contact support</button>
    </div>`;
}

function screenTransactionHistory() {
    const paid = TRANSACTIONS.filter(t => t.status === 'Paid');
    const due = TRANSACTIONS.filter(t => t.status !== 'Paid');
    const renderTxn = (t) => `
            <button data-go="invoice-detail" data-iid="${t.iid}" class="txn-row">
                <div class="txn-icon ${t.status === 'Paid' ? 'txn-icon-paid' : t.status === 'Overdue' ? 'txn-icon-overdue' : 'txn-icon-pending'}">
                    <i data-lucide="${t.status === 'Paid' ? 'check' : t.status === 'Overdue' ? 'alert-circle' : 'clock'}" class="w-4 h-4"></i>
                </div>
                <div class="txn-body">
                    <p class="txn-title">${t.tenant}</p>
                    <p class="txn-sub">${t.unit ? `${t.unit} · ` : ''}${t.prop}${t.month ? ` · ${t.month}` : ''}</p>
                    <p class="txn-sub">${t.status === 'Paid' && t.paymentMethod ? t.paymentMethod + ' · ' : ''}${t.date}</p>
                </div>
                <div class="txn-meta">
                    <p class="txn-amount">${t.amount}</p>
                    <span class="txn-badge ${t.status === 'Paid' ? 'txn-badge-paid' : t.status === 'Overdue' ? 'txn-badge-overdue' : 'txn-badge-pending'}">${t.status}</span>
                </div>
            </button>`;
    return `${topBar('Payment history', { back: true, sub: 'Rent & bills per flat' })}
    <div class="screen-content screen-enter">
        ${due.length ? `
        <p class="screen-section-title">Outstanding</p>
        <div class="txn-list">${due.map(renderTxn).join('')}</div>` : ''}
        ${paid.length ? `
        <p class="screen-section-title ${due.length ? 'mt-4' : ''}">Paid</p>
        <div class="txn-list">${paid.map(renderTxn).join('')}</div>` : `
        <div class="card p-8 text-center">
            <p class="text-[14px] font-semibold text-[#0F172A]">No payments yet</p>
            <p class="text-[12px] text-[#64748B] mt-1">Record rent when a tenant pays you.</p>
        </div>`}
    </div>`;
}

function screenHelpSupport() {
    const help = HELP_BY_ROLE[STATE.userRole] || HELP_BY_ROLE.landlord;
    const supportAction = STATE.userRole === 'landlord'
        ? `<button data-go="chat" class="help-card">
            <div class="help-card-icon"><i data-lucide="message-circle" class="w-5 h-5"></i></div>
            <div class="help-card-body">
                <p class="help-card-title">${help.supportTitle}</p>
                <p class="help-card-sub">${help.supportSub}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`
        : `<button data-action="toast" data-msg="support@landlordhq.com" class="help-card">
            <div class="help-card-icon"><i data-lucide="message-circle" class="w-5 h-5"></i></div>
            <div class="help-card-body">
                <p class="help-card-title">${help.supportTitle}</p>
                <p class="help-card-sub">${help.supportSub}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`;
    return `${topBar('Help & Support', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        <p class="text-[14px] text-[#64748B] leading-relaxed">${help.intro}</p>
        <button data-go="faq" class="help-card">
            <div class="help-card-icon"><i data-lucide="circle-help" class="w-5 h-5"></i></div>
            <div class="help-card-body">
                <p class="help-card-title">FAQ</p>
                <p class="help-card-sub">${help.faqSub}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>
        ${supportAction}
        <button data-action="toast" data-msg="support@landlordhq.com" class="help-email">
            <i data-lucide="mail" class="w-4 h-4"></i>
            <span>support@landlordhq.com</span>
        </button>
    </div>`;
}

function toggleFaqItem(id) {
    STATE.faqOpenId = STATE.faqOpenId === id ? null : id;
    render();
}

function screenFaq() {
    const items = faqItemsForRole();
    const roleLabel = { landlord: 'Landlord', tenant: 'Tenant', contractor: 'Contractor' }[STATE.userRole] || 'Landlord';
    return `${topBar('FAQ', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-3">${roleLabel} FAQ</p>
        <div class="faq-list-minimal">
            ${items.map((f) => `
            <div class="faq-accordion-item">
                <button type="button" data-go="faq-detail" data-fid="${f.id}" class="faq-accordion-trigger">
                    <p class="faq-minimal-q">${f.q}</p>
                    <i data-lucide="chevron-right" class="faq-accordion-icon w-4 h-4 shrink-0"></i>
                </button>
            </div>`).join('')}
        </div>
        <p class="text-center text-[13px] text-[#64748B] mt-6">Can't find an answer?</p>
        <button data-action="toast" data-msg="support@landlordhq.com" class="btn-primary w-full py-3 text-[13px] mt-2">Contact Support</button>
    </div>`;
}

function screenFaqDetail() {
    const item = faqItemById(STATE.faqId ?? 0);
    const items = faqItemsForRole();
    const idx = items.findIndex(f => f.id === item.id);
    const prev = idx > 0 ? items[idx - 1] : null;
    const next = idx < items.length - 1 ? items[idx + 1] : null;
    return `${topBar('FAQ', { back: true })}
    <div class="screen-content screen-enter">
        <span class="faq-detail-cat">${item.cat}</span>
        <h2 class="faq-detail-q">${item.q}</h2>
        <p class="faq-detail-a">${item.a}</p>
        ${prev || next ? `
        <div class="faq-detail-nav">
            ${prev ? `
            <button type="button" data-go="faq-detail" data-fid="${prev.id}" class="faq-detail-link">
                <div><p class="faq-detail-link-label">Previous</p><p class="faq-detail-link-q">${prev.q}</p></div>
                <i data-lucide="chevron-up" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
            ${next ? `
            <button type="button" data-go="faq-detail" data-fid="${next.id}" class="faq-detail-link">
                <div><p class="faq-detail-link-label">Next</p><p class="faq-detail-link-q">${next.q}</p></div>
                <i data-lucide="chevron-down" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
        </div>` : ''}
        <button type="button" data-go="faq" class="btn-secondary w-full py-3 text-[13px] mt-4">Browse all questions</button>
        <button data-action="toast" data-msg="support@landlordhq.com" class="btn-primary w-full py-3 text-[13px] mt-2">Contact Support</button>
    </div>`;
}

function screenPrivacy() {
    const sections = PRIVACY_BY_ROLE[STATE.userRole] || PRIVACY_BY_ROLE.landlord;
    return contentPage('Privacy Policy', '15 January 2025', legalContent(sections));
}

function screenTerms() {
    const sections = TERMS_BY_ROLE[STATE.userRole] || TERMS_BY_ROLE.landlord;
    return contentPage('Terms & Conditions', '15 January 2025', legalContent(sections));
}

function screenAbout() {
    const about = ABOUT_BY_ROLE[STATE.userRole] || ABOUT_BY_ROLE.landlord;
    return `${topBar('About', { back: true })}
    <div class="screen-content screen-enter">
        <div class="text-center py-6">
            <div class="w-20 h-20 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
                <i data-lucide="building-2" class="w-10 h-10"></i>
            </div>
            <h2 class="text-[14px] font-bold text-[#0F172A] mt-4">Landlord HQ</h2>
            <p class="text-[13px] text-[#64748B] mt-1">${about.tagline}</p>
            <span class="badge bg-[#F1F5F9] text-[#64748B] mt-3 inline-block">Version 1.0.0</span>
        </div>
        <div class="card p-4 space-y-3">
            ${about.body.map(p => `<p class="text-[14px] text-[#475569] leading-relaxed">${p}</p>`).join('')}
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
        <h2 class="text-[14px] font-bold">${item.issue}</h2>
        <p class="text-[13px] text-[#64748B]">${item.prop} · ${item.time}</p>
        <div class="card p-4"><p class="text-[13px] leading-relaxed text-[#475569]">${item.desc}</p></div>
        ${item.contractor !== '—' ? `<div class="card p-4 flex items-center gap-3">
            <img src="${contractorAvatar}" class="w-10 h-10 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[13px] font-semibold">${item.contractor}</p><p class="text-[11px] text-[#64748B]">Assigned contractor</p></div>
            <button data-go="chat" data-chat="1" class="text-[13px] font-semibold text-[#2563EB]">Contact</button>
        </div>` : `<button data-action="go-assign-contractor" class="btn-secondary w-full py-3 text-[13px]">Assign Contractor</button>`}
        ${item.contractor !== '—' ? `<button data-action="go-assign-contractor" class="btn-secondary w-full py-3 text-[13px]">Reassign Contractor</button>` : ''}
        <div class="relative pl-6 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            ${timeline.map(([t, d]) => `
            <div class="relative"><div class="absolute -left-6 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white"></div>
            <p class="text-[13px] font-medium">${t}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>`).join('')}
        </div>
        ${item.status !== 'done' ? `<button data-action="mark-maint-complete" class="btn-primary w-full py-3.5 text-[14px]">Mark Complete</button>` : `<p class="text-[13px] text-center text-[#059669] font-semibold py-2">This issue has been resolved</p>`}
    </div>`;
}

function screenInvoiceDetail() {
    const inv = INVOICES.find(i => i.id === STATE.invoiceId) || INVOICES[0];
    const paid = inv.status === 'Paid';
    const detailRows = [
        ['Tenant', inv.tenant || tenantNameForInvoice(inv)],
        ['Property', inv.prop.split(',')[0]],
        ...(inv.unit ? [['Unit', inv.unit]] : []),
        ['Type', inv.type === 'bill' ? (inv.desc || 'Bill') : 'Monthly rent'],
        ['Due date', inv.due],
        ['Invoice #', inv.num],
    ];
    if (paid) {
        detailRows.push(['Paid on', inv.paidOn || '—']);
        detailRows.push(['Payment method', inv.paymentMethod || '—']);
    }
    const sc = paid ? '#22C55E' : inv.status === 'Overdue' ? '#EF4444' : '#D97706';
    const tenantItem = TENANT_LIST.find(t => t.id === inv.tenantId || (t.name === inv.tenant && inv.prop.includes(t.prop)));
    return `${topBar(paid ? 'Payment record' : 'Rent due', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-5 text-center">
            <p class="text-[13px] text-[#64748B]">${paid ? 'Amount received' : 'Amount due'}</p>
            <p class="text-3xl font-bold text-[#0F172A] mt-1">${inv.amount}</p>
            <span class="badge mt-3" style="background:${sc}18;color:${sc}">${inv.status}</span>
            ${inv.month ? `<p class="text-[12px] text-[#64748B] mt-2">${inv.month}</p>` : ''}
        </div>
        <div class="card divide-y divide-[#F1F5F9]">
            ${detailRows.map(([k,v])=>`
            <div class="p-4 flex justify-between text-[13px] gap-4"><span class="text-[#64748B] shrink-0">${k}</span><span class="font-semibold text-right">${v}</span></div>`).join('')}
        </div>
        ${tenantItem ? `
        <button type="button" data-go="tenant-detail" data-tid="${tenantItem.id}" data-tab="payments" class="btn-secondary w-full py-3 text-[13px]">View tenant payment history</button>` : ''}
        <div class="grid grid-cols-2 gap-4">
            <button data-action="toast" data-msg="Receipt downloaded" class="btn-secondary py-3 text-[13px]">Download PDF</button>
            ${!paid ? `<button data-action="mark-invoice-paid" data-iid="${inv.id}" class="btn-primary py-3 text-[13px]">Record payment</button>` : `<button data-action="toast" data-msg="Receipt downloaded" class="btn-primary py-3 text-[13px]">Download receipt</button>`}
        </div>
        ${!paid ? `<button type="button" data-action="delete-invoice" data-iid="${inv.id}" class="btn-danger-outline mt-3">Cancel bill</button>` : ''}
    </div>`;
}

function screenInventoryRoom() {
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(STATE.propertyId) : [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    const items = typeof getInventoryItems === 'function' ? getInventoryItems(STATE.propertyId, STATE.roomId) : [['Oven & Hob','Good'],['Fridge Freezer','Good'],['Washing Machine','Fair'],['Microwave','Good']];
    const notes = typeof getInventoryNotes === 'function' ? getInventoryNotes(STATE.propertyId, STATE.roomId) : '';
    const invKey = typeof inventoryKey === 'function' ? inventoryKey(STATE.propertyId, STATE.roomId) : `${STATE.propertyId}-${STATE.roomId}`;
    const roomPhotos = (typeof AppStore !== 'undefined' && AppStore.inventory?.[invKey]?.photos?.length)
        ? AppStore.inventory[invKey].photos
        : [];
    const photoPreview = typeof renderPhotoPreviewStrip === 'function'
        ? renderPhotoPreviewStrip(roomPhotos, { removable: true, removeAction: 'remove-inventory-photo' })
        : (roomPhotos.length ? `<div class="grid grid-cols-2 gap-2">${roomPhotos.map(src => `<div class="aspect-square rounded-xl overflow-hidden"><img src="${src}" class="img-cover" alt=""></div>`).join('')}</div>` : '');
    return `${topBar(room[0], { back: true })}
    <div class="screen-content screen-enter">
        <div class="flex items-center justify-between">
            <span class="badge ${room[1]==='Good'?'bg-[#DCFCE7] text-[#16A34A]':'bg-[#FEF3C7] text-[#D97706]'}">Condition: ${room[1]}</span>
            <button data-go="edit-inventory-room" data-room="${STATE.roomId}" class="text-[13px] font-semibold text-[#2563EB]">Edit</button>
        </div>
        ${photoPreview}
        <button type="button" data-action="upload-photo" class="btn-secondary w-full py-3 text-[13px]">+ Add room photos</button>
        <p class="form-helper text-center">${roomPhotos.length ? `${roomPhotos.length} photo${roomPhotos.length === 1 ? '' : 's'}` : 'No photos yet'} · select multiple at once</p>
        <div class="card p-4 space-y-3">
            <h3 class="text-[14px] font-bold">Items</h3>
            ${items.map(([item,c])=>`
            <div class="flex justify-between text-[13px] py-1.5 border-b border-[#F1F5F9] last:border-0"><span>${item}</span><span class="text-[#64748B]">${c}</span></div>`).join('')}
        </div>
        <div class="card p-4">${notes ? `<p class="text-[12px] text-[#64748B] mb-1">Notes</p><p class="text-[13px] leading-relaxed">${notes}</p>` : `<p class="text-[13px] text-[#94A3B8]">No notes for this room yet.</p>`}</div>
    </div>`;
}

function screenDocumentPreview() {
    return `${topBar('Document', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center mt-2">
            <i data-lucide="file-text" class="w-16 h-16 text-[#2563EB] mx-auto"></i>
            <p class="text-[14px] font-bold mt-4">Lease Agreement</p>
            <p class="text-[13px] text-[#64748B]">12 Park Lane · PDF · 2.4 MB</p>
            <p class="text-[12px] text-[#94A3B8] mt-1">Signed Jan 15, 2024</p>
        </div>
        <div class="card mt-4 p-4 bg-[#F8FAFC] min-h-[300px] flex items-center justify-center">
            <p class="text-[13px] text-[#94A3B8]">Document preview</p>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-4">
            <button data-action="download-doc" class="btn-secondary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="download" class="w-4 h-4"></i>Download</button>
            <button data-action="share-doc-preview" class="btn-primary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="share-2" class="w-4 h-4"></i>Share</button>
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
            <button type="button" data-action="mark-all-read" class="notif-mark-read">Mark all read</button>
        </div>
    </div>
    <div class="screen-content screen-enter">
        ${section('Today', unreadItems)}
        ${section('Earlier', readItems)}
    </div>`;
}

function screenAddProperty() {
    const pending = STATE.pendingPropertyPhotos || [];
    const preview = typeof renderPhotoPreviewStrip === 'function'
        ? renderPhotoPreviewStrip(pending, { removable: true, removeAction: 'remove-pending-property-photo' })
        : '';
    return `${topBar('Add Property', { back: true })}
    <div class="screen-content screen-enter">
        ${uxIntro('Add the building first. You can add units separately after saving.')}
        ${preview}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${pending.length ? 'Add more photos' : 'Add property photos'}</p>
            <p class="text-[11px] text-[#64748B] mt-1">Select multiple from your device${pending.length ? ` · ${pending.length} selected` : ''}</p>
        </button>
        <div><label class="form-label">Property name <span class="form-required">*</span></label><input data-field="name" type="text" class="form-input" placeholder="e.g. 12 Park Lane"></div>
        <div><label class="form-label">Address <span class="form-required">*</span></label><input data-field="address" type="text" class="form-input" placeholder="Street and town"></div>
        <div><label class="form-label">Postcode</label><input data-field="postcode" type="text" class="form-input" placeholder="e.g. SW1A 1AA"></div>
        <button data-action="save" data-msg="Property added successfully" class="btn-primary w-full">Save property</button>
    </div>`;
}

function screenEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    const cover = typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(STATE.propertyId) : IMG.props[STATE.propertyId];
    const notes = typeof AppStore !== 'undefined' ? (AppStore.meta(STATE.propertyId).info?.notes || '') : '';
    return `${topBar('Edit Property', { back: true })}
    <div class="screen-content screen-enter">
        <div class="relative h-[120px] rounded-xl overflow-hidden">
            <img src="${cover}" class="img-cover" alt="">
            <button type="button" data-go="property-photos" data-pid="${STATE.propertyId}" class="absolute bottom-2 right-2 bg-white/90 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-[#2563EB]">Manage Photos</button>
        </div>
        <div><label class="form-label">Property Name</label><input data-field="name" type="text" class="form-input" value="${p.name.replace(/"/g, '&quot;')}"></div>
        <div><label class="form-label">Address</label><input data-field="address" type="text" class="form-input" value="${p.address.replace(/"/g, '&quot;')}"></div>
        <p class="form-helper">This screen is for the building only. Units, rent, and tenants are managed separately.</p>
        <div class="card p-4 flex items-center justify-between gap-3">
            <div class="min-w-0">
                <p class="text-[14px] font-bold text-[#0F172A]">Units</p>
                <p class="text-[12px] text-[#64748B] mt-0.5">Add or edit flats from the property page</p>
            </div>
            <button type="button" data-go="property-detail" data-pid="${STATE.propertyId}" data-tab="units" class="header-text-link shrink-0">Manage units</button>
        </div>
        ${formTextarea('Notes', notes, 'Building notes, floor remarks, access codes…', 'notes')}
        ${saveBtn('Save Property', 'Property updated')}
        <button data-action="delete-property" class="btn-danger-outline mt-3">Remove property</button>
    </div>`;
}

function screenInviteTenant() {
    const p = PROPERTIES[STATE.propertyId];
    const selectedUnit = STATE.selectedUnit || '';
    const unitField = typeof unitSelectHtml === 'function'
        ? `<div><label class="form-label">Unit <span class="form-required">*</span></label>${unitSelectHtml(STATE.propertyId, 'unit', true, selectedUnit)}</div>`
        : `<div><label class="form-label">Unit</label><input data-invite="unit" type="text" class="form-input" placeholder="e.g. Flat 1A"></div>`;
    const defaultRent = typeof propertyDefaultFlatRent === 'function' ? propertyDefaultFlatRent(STATE.propertyId) : p.rent;
    return `${topBar('Invite Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address} · ${typeof propertyRentRangeLabel === 'function' ? propertyRentRangeLabel(STATE.propertyId) : defaultRent}</p></div>
        </div>
        <p class="text-[12px] text-[#64748B] leading-relaxed">Create a tenant profile and send a secure invitation. They must accept the invite before accessing the portal — random sign-ups are not allowed.</p>
        <div><label class="form-label">Full Name</label><input data-invite="fullName" type="text" class="form-input" placeholder="e.g. Sarah Johnson" autocomplete="name"></div>
        <div><label class="form-label">Email</label><input data-invite="email" type="email" class="form-input" placeholder="tenant@email.com"></div>
        <div><label class="form-label">Phone</label><input data-invite="phone" type="tel" class="form-input" placeholder="+44 7700 900000"></div>
        ${unitField}
        <div><label class="form-label">Unit rent (£)</label><input data-invite="rent" type="text" class="form-input" placeholder="${defaultRent}" value="${(selectedUnit && typeof getUnitByName === 'function' ? getUnitByName(STATE.propertyId, selectedUnit)?.rent : null) || defaultRent}"></div>
        <div><label class="form-label">Lease Start</label><input data-invite="leaseStart" type="date" class="form-input"></div>
        <div><label class="form-label">Lease End</label><input data-invite="leaseEnd" type="date" class="form-input"></div>
        <div><label class="form-label">Personal Message</label><textarea data-invite="message" class="form-input" rows="3" placeholder="Add a personal message for the tenant (optional)"></textarea></div>
        <button type="button" data-action="send-tenant-invite" class="btn-primary w-full py-3.5 text-[14px]">Send Invitation</button>
    </div>`;
}

function screenTenantInviteSent() {
    const invite = tenantInviteByToken(STATE.tenantInviteToken);
    if (!invite) return `${topBar('Invitation Sent', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Invitation not found.</p></div>`;
    const p = PROPERTIES[invite.propertyId];
    const roster = typeof getFlatMemberRoster === 'function' ? getFlatMemberRoster(invite.propertyId, invite.unit) : { members: [] };
    const nextMember = roster.members.find(m =>
        !m.tenantId && m.accountStatus !== 'pending' && m.email && m.email !== invite.email
    );
    const nextParts = nextMember?.name?.trim().split(/\s+/) || [];
    return `${topBar('Invitation Sent', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <p class="text-[14px] font-bold text-[#0F172A] mt-4">Invitation Sent!</p>
            <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">We emailed <strong>${invite.email}</strong> an invitation to join as tenant at <strong>${p.name}</strong> (${invite.unit}).</p>
        </div>
        <div class="card p-4 space-y-2">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Invitation Details</p>
            ${[['Tenant', `${invite.firstName} ${invite.lastName}`], ['Property', p.name], ['Unit', invite.unit], ['Rent', invite.rent], ['Status', 'Pending activation']].map(([k, v]) => `
            <div class="flex justify-between text-[13px] py-1"><span class="text-[#64748B]">${k}</span><span class="font-semibold text-right">${v}</span></div>`).join('')}
        </div>
        ${nextMember ? `
        <button type="button" data-go="invite-tenant" data-pid="${invite.propertyId}" data-unit="${invite.unit}" data-invite-email="${nextMember.email || ''}" data-invite-first="${nextParts[0] || ''}" data-invite-last="${nextParts.slice(1).join(' ') || ''}" data-invite-phone="${nextMember.phone || ''}" class="btn-primary w-full py-3.5 text-[14px]">Invite Next Member</button>` : ''}
        <button type="button" data-go="property-detail" data-pid="${invite.propertyId}" data-tab="tenant" class="btn-secondary w-full py-3.5 text-[14px] ${nextMember ? 'mt-2' : ''}">Back to Property</button>
    </div>`;
}

function screenEditTenant() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    const hasNidProof = !!(t.nidProof || (typeof getTenantNidProof === 'function' && getTenantNidProof(STATE.tenantId)));
    return `${topBar('Edit Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <p class="ux-intro">Update tenant identity and contact details. Tenancy info is managed from the unit or property screen.</p>
        ${formField('First Name', t.firstName, 'text', '', 'firstName')}${formField('Last Name', t.lastName, 'text', '', 'lastName')}
        ${formField('NID', t.idNumber || '', 'text', 'National ID number', 'idNumber')}${formField('Date of Birth', t.dob || '', 'date', '', 'dob')}
        <div>
            <label class="form-label">NID Document Proof</label>
            <button type="button" data-action="upload-nid-proof" class="card border-2 border-dashed border-[#E2E8F0] p-5 text-center w-full">
                <i data-lucide="${hasNidProof ? 'file-check' : 'upload'}" class="w-7 h-7 text-[#94A3B8] mx-auto"></i>
                <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${hasNidProof ? (t.nidProof || 'NID proof on file') : 'Upload NID scan or photo'}</p>
                <p class="text-[11px] text-[#64748B] mt-1">Passport, national ID card, or driving licence</p>
            </button>
        </div>
        ${formField('Email', t.email, 'email', '', 'email')}${formField('Phone', t.phone, 'tel', '', 'phone')}
        ${formField('Emergency Contact', t.emergency, 'text', '', 'emergency')}${formField('Emergency Phone', t.emergencyPhone, 'tel', '', 'emergencyPhone')}
        ${saveBtn('Save Tenant', 'Tenant details updated')}
        ${(TENANT_LIST[STATE.tenantId] || {}).status === 'active' ? `
        <button type="button" data-go="checkout-tenancy" data-tid="${STATE.tenantId}" class="btn-secondary w-full">Check-out tenant</button>` : ''}
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
        ${formField('Inspection Date', '', 'date', 'Select inspection date', 'inspDate')}
        ${formSelect('Time Slot', '10:00 AM', ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'], 'timeSlot')}
        ${formSelect('Type', 'Mid-term Inspection', ['Check-in', 'Mid-term Inspection', 'Check-out', 'Annual'], 'inspType')}
        ${formTextarea('Notes for Inspector', '', 'Access instructions, parking, tenant availability...', 'inspNotes')}
        ${formField('Notify Tenant', '', 'email', 'Enter tenant email', 'notifyEmail')}
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
            <div><p class="text-[13px] font-bold">${item[1]}</p><p class="text-[12px] text-[#64748B]">${p.name} · Current: ${item[2]}</p></div>
        </div>
        ${formField('Certificate Number', '', 'text', 'Enter certificate reference', 'certNumber')}
        ${formField('Issue Date', '', 'date', 'Select issue date', 'issueDate')}
        ${formField('Expiry Date', '', 'date', 'Select expiry date', 'expiryDate')}
        ${formField('Issued By', '', 'text', 'Engineer / company name', 'issuedBy')}
        ${photoUpload('Upload certificate PDF/photo')}
        ${formTextarea('Notes', '', 'Additional compliance notes', 'certNotes')}
        ${saveBtn('Save Certificate', 'Certificate renewed')}
    </div>`;
}

function screenEditInventoryRoom() {
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms() : [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    const items = typeof getInventoryItems === 'function' ? getInventoryItems(STATE.propertyId, STATE.roomId) : [['Oven & Hob','Good'],['Fridge Freezer','Good'],['Washing Machine','Fair'],['Microwave','Good']];
    return `${topBar('Edit ' + room[0], { back: true })}
    <div class="screen-content screen-enter">
        ${formSelect('Condition', room[1], ['Good', 'Fair', 'Poor', 'Needs Repair'], 'condition')}
        ${formTextarea('Room Notes', typeof getInventoryNotes === 'function' ? getInventoryNotes(STATE.propertyId, STATE.roomId) : '', 'Condition notes for this room', 'roomNotes')}
        <p class="section-title">Items</p>
        ${items.map(([item, c], i) => `
        <div class="card p-3.5 flex items-center justify-between gap-3">
            <span class="text-[14px] font-medium">${item}</span>
            <select data-field="item_${i}" class="form-input form-select w-[120px] py-2 text-[13px]"><option ${c==='Good'?'selected':''}>Good</option><option ${c==='Fair'?'selected':''}>Fair</option><option ${c==='Poor'?'selected':''}>Poor</option></select>
        </div>`).join('')}
        ${photoUpload('Add room photos')}
        ${saveBtn('Save Room', 'Inventory updated')}
    </div>`;
}

function screenAddPaymentMethod() {
    return `${topBar('Add Payment Method', { back: true })}
    <div class="screen-content screen-enter">
        ${formSelect('Type', 'Debit / Credit Card', ['Debit / Credit Card', 'Bank Account'], 'payType')}
        ${formField('Cardholder Name', '', 'text', 'Enter cardholder name', 'cardholder')}
        ${formField('Card Number', '', 'text', '1234 5678 9012 3456', 'cardNumber')}
        <div class="grid grid-cols-2 gap-4">
            ${formField('Expiry', '', 'text', 'MM/YY', 'expiry')}
            ${formField('CVV', '', 'text', '···', 'cvv')}
        </div>
        <label class="flex items-center gap-2 text-[13px] text-[#475569]"><input data-field="isDefault" type="checkbox" checked class="accent-[#2563EB]"> Set as default payment method</label>
        ${saveBtn('Add Payment Method', 'Payment method added')}
    </div>`;
}

function screenEditPaymentMethod() {
    const cards = typeof getPaymentMethods === 'function' ? getPaymentMethods() : [
        { id: 0, type:'Visa', last4:'4242', exp:'08/27', name:'John Smith', default:true },
        { id: 1, type:'Barclays', last4:'8901', exp:'—', name:'Rent Collection', default:false },
    ];
    const c = cards[STATE.paymentId] || cards[0];
    return `${topBar('Edit Payment', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center"><i data-lucide="${c.type==='Visa'?'credit-card':'landmark'}" class="w-5 h-5 text-[#2563EB]"></i></div>
            <div><p class="text-[14px] font-semibold">${c.type} ···· ${c.last4}</p><p class="text-[12px] text-[#64748B]">${c.default ? 'Default method' : 'Bank account'}</p></div>
        </div>
        ${formField('Account Holder', c.name, 'text', '', 'accountHolder')}
        ${c.type === 'Visa' ? formField('Expiry Date', c.exp, 'text', '', 'expiry') + formField('Billing Postcode', 'SW1A 1AA', 'text', '', 'postcode') : formField('Sort Code', '20-00-00', 'text', '', 'sortCode') + formField('Account Number', '****8901', 'text', '', 'accountNumber')}
        <label class="flex items-center gap-2 text-[13px] text-[#475569]"><input data-field="isDefault" type="checkbox" ${c.default?'checked':''} class="accent-[#2563EB]"> Default payment method</label>
        ${saveBtn('Save Changes', 'Payment method updated')}
        <button type="button" data-action="remove-payment-method" class="btn-danger-outline">Remove payment method</button>
    </div>`;
}

function screenEditPreference() {
    const pref = PREF_OPTIONS[STATE.prefKey] || PREF_OPTIONS.language;
    return `${topBar(pref.title, { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Select your preferred ${pref.title.toLowerCase()}</p>
        <div class="card overflow-hidden">
            ${pref.options.map((opt, i) => `
            <button type="button" data-action="save-preference" data-opt="${opt.replace(/"/g, '&quot;')}" class="w-full flex items-center justify-between px-4 py-4 text-left ${i < pref.options.length - 1 ? 'border-b border-[#F1F5F9]' : ''} ${opt === pref.current ? 'bg-[#FAFCFF]' : ''}">
                <span class="text-[14px] font-medium text-[#0F172A]">${opt}</span>
                ${opt === pref.current ? '<i data-lucide="check" class="w-5 h-5 text-[#2563EB]"></i>' : ''}
            </button>`).join('')}
        </div>
    </div>`;
}

function screenLogMaintenance() {
    const isTenant = STATE.userRole === 'tenant';
    const tenant = isTenant ? getActiveTenant() : null;
    const maintCtx = !isTenant && STATE.logMaintPrefill;
    const scope = maintCtx || isTenant ? 'unit' : (STATE.logMaintScope || 'unit');
    const pid = isTenant ? tenant?.propertyId : (maintCtx?.propertyId ?? STATE.propertyId);
    const p = pid != null ? PROPERTIES[pid] : null;
    const selectedUnit = STATE.selectedUnit || tenant?.unit || maintCtx?.unit || '';
    const titlePrefill = maintCtx?.unit ? `${maintCtx.unit} — ` : '';
    const communalArea = STATE.logMaintCommunalArea || COMMUNAL_AREAS[0];
    const propertyField = isTenant ? `
        <div class="card p-4" style="background:#F8FAFC">
            <p class="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Your Property</p>
            <p class="text-[13px] font-bold text-[#0F172A] mt-1">${p?.name || '—'}</p>
            <p class="text-[12px] text-[#64748B] mt-0.5">${tenant?.unit || ''}${tenant?.unit && p?.address ? ' · ' : ''}${p?.address || ''}</p>
        </div>` : maintCtx ? `
        <div class="card p-4" style="background:#F8FAFC">
            <p class="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Reporting for</p>
            <p class="text-[13px] font-bold text-[#0F172A] mt-1">${maintCtx.unit}</p>
            <p class="text-[12px] text-[#64748B] mt-0.5">${p?.name || '—'}${p?.address ? ` · ${p.address}` : ''}</p>
        </div>
        <input type="hidden" data-field="propertyId" value="${pid}">
        <input type="hidden" data-field="unit" value="${selectedUnit}">` : `
        <div>
            <label class="form-label">Where is the issue?</label>
            <div class="flex gap-2">
                <button type="button" data-log-maint-scope="unit" class="tab-pill flex-1 ${scope === 'unit' ? 'active' : ''}">In a unit</button>
                <button type="button" data-log-maint-scope="communal" class="tab-pill flex-1 ${scope === 'communal' ? 'active' : ''}">Communal</button>
            </div>
            <p class="text-[11px] text-[#64748B] mt-1">${scope === 'communal' ? 'Shared areas — hallway, roof, garden, boiler room, etc.' : 'Inside a specific flat or unit.'}</p>
        </div>
        <div><label class="form-label">Property <span class="form-required">*</span></label>
        <select data-field="propertyId" class="form-input form-select" data-action="refresh-maint-units">${PROPERTIES.map(prop => `<option value="${prop.id}" ${prop.id === pid ? 'selected' : ''}>${prop.name}</option>`).join('')}</select></div>
        ${scope === 'communal' ? `
        <div><label class="form-label">Communal area <span class="form-required">*</span></label>
        <select data-field="communalArea" class="form-input form-select">${COMMUNAL_AREAS.map(area => `<option value="${area}" ${communalArea === area ? 'selected' : ''}>${area}</option>`).join('')}</select></div>`
        : (typeof unitSelectHtml === 'function' ? `<div><label class="form-label">Unit <span class="form-required">*</span></label>${unitSelectHtml(pid ?? 0, 'unit', false, selectedUnit)}</div>` : '')}`;
    return `${topBar(isTenant ? 'Report Issue' : 'Log Issue', { back: !shouldShowBottomNav('log-maintenance') })}
    <div class="screen-content screen-enter">
        ${propertyField}
        <div><label class="form-label">Issue Title <span class="form-required">*</span></label><input data-field="title" class="form-input" value="${titlePrefill.replace(/"/g, '&quot;')}" placeholder="Describe the issue"></div>
        <div><label class="form-label">Priority</label>
        <div class="flex gap-2">${['Low','Medium','High'].map(pr=>`
        <button data-log-priority="${pr}" class="tab-pill ${STATE.logPriority===pr?'active':''}">${pr}</button>`).join('')}</div></div>
        <div><label class="form-label">Description <span class="form-required">*</span></label><textarea data-field="desc" class="form-input h-24 resize-none" placeholder="Add details..."></textarea></div>
        ${typeof renderPhotoPreviewStrip === 'function' ? renderPhotoPreviewStrip(STATE.logMaintPhotos, { removable: true, removeAction: 'remove-log-maint-photo' }) : ''}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2">Add photos</p>
            <p class="text-[11px] text-[#64748B] mt-1">Select multiple from your device${STATE.logMaintPhotos?.length ? ` · ${STATE.logMaintPhotos.length} added` : ''}</p>
        </button>
        <button data-action="save" data-msg="Issue logged successfully" class="btn-primary w-full py-3.5 text-[14px]">${isTenant ? 'Report to Landlord' : 'Submit Issue'}</button>
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
    'tenant-invite-sent': screenTenantInviteSent,
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
    try {
        _renderApp();
    } catch (err) {
        console.error('Render failed:', err);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `<div style="padding:24px;font-family:system-ui;color:#0F172A"><h2 style="font-size:18px;margin:0 0 8px">Something went wrong</h2><p style="font-size:14px;color:#64748B;margin:0">Please refresh the page.</p></div>`;
        }
    }
}

function _renderApp() {
    const focusId = document.activeElement?.dataset?.search;
    const selStart = document.activeElement?.selectionStart;
    const fn = SCREEN_MAP[STATE.screen] || (STATE.userRole === 'contractor' ? screenContractorDashboard : screenDashboard);
    const isPreAuth = PRE_AUTH_SCREENS.includes(STATE.screen);
    const showNav = shouldShowBottomNav();
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
    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
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

function collectGoOptions(el) {
    const opts = {};
    if (el.dataset.pid !== undefined) opts.propertyId = +el.dataset.pid;
    if (el.dataset.tid !== undefined) opts.tenantId = +el.dataset.tid;
    if (el.dataset.mid !== undefined) opts.maintId = +el.dataset.mid;
    if (el.dataset.chat !== undefined) opts.chatId = +el.dataset.chat;
    if (el.dataset.insp !== undefined) opts.inspectionId = +el.dataset.insp;
    if (el.dataset.iid !== undefined) opts.invoiceId = +el.dataset.iid;
    if (el.dataset.room !== undefined) opts.roomId = +el.dataset.room;
    if (el.dataset.fid !== undefined) opts.faqId = +el.dataset.fid;
    if (el.dataset.cid !== undefined) opts.complianceId = +el.dataset.cid;
    if (el.dataset.pref) opts.prefKey = el.dataset.pref;
    if (el.dataset.pmid !== undefined) opts.paymentId = +el.dataset.pmid;
    if (el.dataset.tab) opts.tab = el.dataset.tab;
    if (el.dataset.tenantTab) opts.tenantTab = el.dataset.tenantTab;
    if (el.dataset.flatTab) opts.flatTab = el.dataset.flatTab;
    if (el.dataset.unit) opts.unit = el.dataset.unit;
    if (el.dataset.duplicateFrom) opts.duplicateFrom = el.dataset.duplicateFrom;
    if (el.dataset.inviteToken) opts.token = el.dataset.inviteToken;
    if (el.dataset.inviteEmail) opts.inviteEmail = el.dataset.inviteEmail;
    if (el.dataset.inviteFirst) opts.inviteFirst = el.dataset.inviteFirst;
    if (el.dataset.inviteLast) opts.inviteLast = el.dataset.inviteLast;
    if (el.dataset.invitePhone) opts.invitePhone = el.dataset.invitePhone;
    if (el.dataset.job !== undefined) opts.jobId = +el.dataset.job;
    if (el.dataset.jtab) opts.jobTab = el.dataset.jtab;
    if (el.dataset.doc !== undefined) opts.docId = +el.dataset.doc;
    if (el.dataset.previewIdx !== undefined) opts.previewDocIdx = +el.dataset.previewIdx;
    if (el.dataset.previewSource) opts.previewDocSource = el.dataset.previewSource;
    if (el.dataset.invoicePreset) opts.invoiceFilter = el.dataset.invoicePreset;
    if (el.dataset.resetReturn) STATE.resetReturnScreen = el.dataset.resetReturn;
    return opts;
}

function handleDelegatedAction(e, el) {
    const action = el.dataset.action;
    if (!action) return false;
    const run = (fn) => { e.preventDefault(); fn(); return true; };
    switch (action) {
        case 'back': return run(back);
        case 'drawer':
        case 'drawer-close': return run(toggleDrawer);
        case 'close-unit-filters': return run(closeUnitFilters);
        case 'toggle-unit-filters': return run(toggleUnitFilters);
        case 'toggle-floor-group': return run(() => {
            if (typeof toggleFloorGroup === 'function') toggleFloorGroup(+el.dataset.pid, +el.dataset.floor);
        });
        case 'reset-unit-filters': return run(() => setUnitFilter('all'));
        case 'close-prop-filters': return run(closePropFilters);
        case 'toggle-prop-filters': return run(togglePropFilters);
        case 'reset-prop-filters': return run(resetPropFilters);
        case 'confirm-cancel': return run(() => { STATE.confirm = null; render(); });
        case 'confirm-ok': return run(() => { const fn = STATE.confirm?.onOk; STATE.confirm = null; if (fn) fn(); else render(); });
        case 'close-rename-doc': return run(() => { STATE.renameDocId = null; render(); });
        case 'confirm-rename-doc': return run(() => { if (typeof confirmRenameDoc === 'function') confirmRenameDoc(); });
        case 'open-add-document': return run(() => { if (typeof openAddDocumentFlow === 'function') openAddDocumentFlow(); });
        case 'close-add-document': return run(() => { if (typeof closeAddDocumentFlow === 'function') closeAddDocumentFlow(); });
        case 'add-document-back': return run(() => { if (typeof addDocumentBackStep === 'function') addDocumentBackStep(); });
        case 'select-doc-type': return run(() => { if (typeof selectAddDocumentType === 'function') selectAddDocumentType(el.dataset.docType); });
        case 'pick-add-document-file': return run(() => { if (typeof pickAddDocumentFileAction === 'function') pickAddDocumentFileAction(); });
        case 'save-add-document': return run(() => { if (typeof saveAddDocumentAction === 'function') saveAddDocumentAction(); });
        case 'close-new-message': return run(() => { STATE.newMessagePicker = false; render(); });
        case 'pick-message-chat': return run(() => { STATE.newMessagePicker = false; go('chat', { chatId: +el.dataset.chat }); });
        case 'close-photo-menu': return run(() => { STATE.photoMenuIdx = null; render(); });
        case 'toast': return run(() => toast(el.dataset.msg || 'Done'));
        case 'maint-status': return run(() => { if (typeof updateMaintStatus === 'function') updateMaintStatus(el.dataset.status); });
        case 'go-assign-contractor': return run(() => go('assign-contractor', { maintId: STATE.maintId }));
        case 'mark-invoice-paid': return run(() => { if (typeof markInvoicePaid === 'function') markInvoicePaid(+el.dataset.iid); });
        case 'toggle-rent-receive': return run(() => { e.stopPropagation(); if (typeof toggleRentReceiveInvoice === 'function') toggleRentReceiveInvoice(+el.dataset.iid); });
        case 'toggle-rent-receive-all': return run(() => { if (typeof toggleRentReceiveAll === 'function') toggleRentReceiveAll(); });
        case 'confirm-rent-received': return run(() => { if (typeof confirmMarkRentReceived === 'function') confirmMarkRentReceived(); });
        case 'send-tenant-invite': return run(() => sendTenantInvitation());
        case 'confirm-contractor-schedule': return run(() => { if (typeof confirmContractorSchedule === 'function') confirmContractorSchedule(); });
        case 'save-contractor-note': return run(() => { if (typeof saveContractorNote === 'function') saveContractorNote(); });
        case 'mark-contractor-complete': return run(() => { if (typeof markContractorJobComplete === 'function') markContractorJobComplete(); });
        default: return false;
    }
}

function handleContractorUpload(el) {
    if (typeof uploadContractorFile === 'function') uploadContractorFile(el.dataset.contractorUpload);
}

function handleContractorAction(el) {
    if (typeof contractorJobAction === 'function') contractorJobAction(el.dataset.contractorAction, el.dataset.msg);
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

    const maintScopeFilter = e.target.closest('[data-maint-scope-filter]');
    if (maintScopeFilter) { e.preventDefault(); setMaintScopeFilter(maintScopeFilter.dataset.maintScopeFilter); return; }

    const invoiceFilter = e.target.closest('[data-invoice-filter]');
    if (invoiceFilter) { e.preventDefault(); setInvoiceFilter(invoiceFilter.dataset.invoiceFilter); return; }

    const unitFilter = e.target.closest('[data-unit-filter]');
    if (unitFilter) { e.preventDefault(); setUnitFilter(unitFilter.dataset.unitFilter); return; }

    const faqToggle = e.target.closest('[data-faq-toggle]');
    if (faqToggle) { e.preventDefault(); toggleFaqItem(+faqToggle.dataset.faqToggle); return; }

    const actionEl = e.target.closest('[data-action]');
    if (actionEl && handleDelegatedAction(e, actionEl)) return;

    const ttabEl = e.target.closest('[data-ttab]');
    if (ttabEl) { e.preventDefault(); setTenantTab(ttabEl.dataset.ttab); return; }

    const ftabEl = e.target.closest('[data-ftab]');
    if (ftabEl) { e.preventDefault(); setFlatTab(ftabEl.dataset.ftab); return; }

    const tabEl = e.target.closest('[data-tab]');
    if (tabEl && !tabEl.dataset.go) { e.preventDefault(); setTab(tabEl.dataset.tab); return; }

    const tenantFilterEl = e.target.closest('[data-tenant-filter]');
    if (tenantFilterEl) { e.preventDefault(); setTenantFilter(tenantFilterEl.dataset.tenantFilter); return; }

    const tenantMaintFilter = e.target.closest('[data-tenant-maint-filter]');
    if (tenantMaintFilter) {
        e.preventDefault();
        STATE.tenantMaintFilter = tenantMaintFilter.dataset.tenantMaintFilter;
        render();
        return;
    }

    const contractorFilter = e.target.closest('[data-contractor-filter]');
    if (contractorFilter && !contractorFilter.dataset.go) {
        e.preventDefault();
        STATE.contractorJobFilter = contractorFilter.dataset.contractorFilter;
        render();
        return;
    }

    const jtabEl = e.target.closest('[data-jtab]');
    if (jtabEl) { e.preventDefault(); STATE.contractorJobTab = jtabEl.dataset.jtab; render(); return; }

    const contractorAction = e.target.closest('[data-contractor-action]');
    if (contractorAction) { e.preventDefault(); handleContractorAction(contractorAction); return; }

    const contractorUpload = e.target.closest('[data-contractor-upload]');
    if (contractorUpload) { e.preventDefault(); handleContractorUpload(contractorUpload); return; }

    const goEl = e.target.closest('[data-go]');
    if (goEl && goEl.dataset.go && !goEl.dataset.action) {
        const nestedAction = e.target.closest('[data-action]');
        if (nestedAction && nestedAction !== goEl && goEl.contains(nestedAction)) return;
        e.preventDefault();
        go(goEl.dataset.go, collectGoOptions(goEl));
    }
}

function bindEvents() {
    const app = document.getElementById('app');
    if (!app._delegationBound) {
        app.addEventListener('click', handleAppClick);
        app._delegationBound = true;
    }

    app.querySelectorAll('[data-action="tenant-back"]').forEach(el => {
        el.onclick = () => setTenantTab('overview');
    });
    app.querySelectorAll('[data-log-maint-scope]').forEach(el => {
        el.onclick = () => setLogMaintScope(el.dataset.logMaintScope);
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
    app.querySelectorAll('[data-action="fab"]').forEach(el => { el.onclick = toggleFab; });
    app.querySelectorAll('[data-action="save"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); toast(el.dataset.msg || 'Saved'); back(); };
    });
    app.querySelectorAll('[data-action="logout"]').forEach(el => { el.onclick = logout; });
    app.querySelectorAll('[data-subscription-plan]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const planId = el.dataset.subscriptionPlan;
            if (planId === LANDLORD_USER.subscriptionPlanId) return;
            const plan = getSubscriptionPlan(planId);
            setSubscriptionPlan(planId);
            toast(`Switched to ${plan.name} (demo)`);
        };
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
    app.querySelectorAll('[data-action="contractor-sign-in"]').forEach(el => {
        el.onclick = () => { STATE.authRole = 'contractor'; go('sign-in'); };
    });
    app.querySelectorAll('[data-action="demo-login"]').forEach(el => {
        el.onclick = () => demoLogin(el.dataset.demoRole || STATE.authRole);
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
            if (el.dataset.msg) {
                toast('Please sign in with your email and password above');
                return;
            }
            signIn();
        };
    });
    app.querySelectorAll('[data-action="start-signup"]').forEach(el => {
        el.onclick = startLandlordSignup;
    });
    app.querySelectorAll('[data-action="resend-signup-code"]').forEach(el => {
        el.onclick = resendSignupCode;
    });
    app.querySelectorAll('[data-action="send-tenant-invite"]').forEach(el => {
        el.onclick = sendTenantInvitation;
    });
    app.querySelectorAll('[data-action="open-tenant-invite"]').forEach(el => {
        el.onclick = () => openTenantInvite(el.dataset.token);
    });
    app.querySelectorAll('[data-action="tenant-activate"]').forEach(el => {
        el.onclick = () => go('tenant-activate');
    });
    app.querySelectorAll('[data-action="activate-tenant-account"]').forEach(el => {
        el.onclick = activateTenantAccount;
    });
    app.querySelectorAll('[data-action="tenant-sign-in"]').forEach(el => {
        el.onclick = () => { STATE.authRole = 'tenant'; go('sign-in'); };
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
loadLandlordAccounts();
loadTenantData();
ensureDemoTenantAccount();
loadContractorAccounts();
const _inviteToken = new URLSearchParams(window.location.search).get('invite');
if (_inviteToken && tenantInviteByToken(_inviteToken)) {
    STATE.tenantInviteToken = _inviteToken;
    STATE.authRole = 'tenant';
    STATE.onboardingComplete = true;
    go('tenant-invite');
} else {
    render();
}
