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
    drawer: false, fab: false, faqId: 0, faqOpenId: null, complianceId: 0, prefKey: '', paymentId: 0, noteId: 0,
    helpReturnScreen: 'dashboard', faqReturnScreen: 'help-support',
    docReturnScreen: 'property-detail', legalReturnScreen: 'profile',
    contractorJobId: 0, contractorJobFilter: 'all', contractorJobTab: 'overview',
    tenantFilter: 'all',
    tenantInviteToken: null,
    activeTenantId: 0,
    signupEmail: '',
    signupDraft: null,
};

let TENANT_INVITATIONS = [
    { id: 0, token: 'DEMO-88KS', firstName: 'Emma', lastName: 'Roberts', email: 'emma.r@email.com', phone: '+44 7700 900459', propertyId: 2, unit: 'Flat 1', rent: '£2,100', leaseStart: '2025-04-01', leaseEnd: '2026-03-31', message: 'Welcome to your new home!', landlord: 'John Smith', status: 'pending', sentAt: 'Mar 10, 2025' },
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
    const demo = DEMO_CREDENTIALS[role];
    if (!demo) return '';
    const roleName = { landlord: 'Landlord', tenant: 'Tenant', contractor: 'Contractor' }[role] || 'Landlord';
    return `
    <div class="auth-demo-card">
        <div class="auth-demo-head">
            <span class="auth-demo-badge">Demo</span>
            <p class="auth-demo-title">${roleName} account for testing</p>
        </div>
        <p class="auth-demo-creds"><span>${demo.email}</span><span>Password: ${demo.password}</span></p>
        <button type="button" data-action="demo-login" data-demo-role="${role}" class="auth-demo-btn">Sign in with demo</button>
    </div>`;
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
const FAQ_BY_ROLE = {
    landlord: [
        { id: 0, cat: 'Getting Started', q: 'How do I add a new property?', a: 'Tap the + button on the bottom navigation bar and select "Add Property". Fill in the address, rent amount, bedrooms, and upload photos. Your property will appear in your portfolio immediately.' },
        { id: 1, cat: 'Getting Started', q: 'How do I invite a tenant?', a: 'Open the property details, go to the Tenant section, and tap "Invite Tenant". Enter their email address and we\'ll send a secure invitation link. Once accepted, their profile links to the property automatically.' },
        { id: 2, cat: 'Rent & Payments', q: 'How does rent collection work?', a: 'Landlord HQ tracks rent due dates and sends automatic reminders to tenants. You can view payment status on the Financial screen. Overdue rent is highlighted in red on your dashboard.' },
        { id: 3, cat: 'Rent & Payments', q: 'Can I export financial reports?', a: 'Yes. Go to Financial → tap any invoice → Download PDF. Full monthly reports are available on the Pro plan under Subscription settings.' },
        { id: 4, cat: 'Maintenance', q: 'How do I log a maintenance issue?', a: 'Use the + FAB menu and select "Log Maintenance", or open a property → Maintenance section → "Log New Issue". Add a title, priority, description, and photos.' },
        { id: 5, cat: 'Maintenance', q: 'How are contractors assigned?', a: 'Assign contractors from the maintenance detail screen. The job is sent to their contractor app, and you\'ll be notified when work is submitted or invoiced.' },
        { id: 6, cat: 'Compliance', q: 'What compliance documents should I track?', a: 'We recommend tracking Gas Safety Certificate, Electrical Installation Condition Report (EICR), EPC rating, smoke/CO alarms, landlord insurance, and Right to Rent checks. Reminders appear on your dashboard.' },
        { id: 7, cat: 'Account', q: 'How do I change my password?', a: 'Go to Profile → Change Password. Enter your current password, then your new password twice.' },
        { id: 8, cat: 'Account', q: 'How do I cancel my subscription?', a: 'Go to Profile → Subscription → Manage Plan. You can downgrade or cancel at any time. Your data remains accessible until the end of the billing period.' },
    ],
    tenant: [
        { id: 0, cat: 'Getting Started', q: 'How do I activate my tenant account?', a: 'Tenant accounts are invitation-only. Open the secure link from your landlord, set a password, and your portal will link to your property automatically.' },
        { id: 1, cat: 'Getting Started', q: 'What can I see on my dashboard?', a: 'Your home details, next rent due date, maintenance request status, and quick actions to report issues or message your landlord.' },
        { id: 2, cat: 'Rent & Payments', q: 'How do I pay rent?', a: 'Tap Pay Rent on your dashboard when payment is due. Your landlord can enable reminders and auto-pay options. Payment history appears under Recent Activity.' },
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
        ['Subscription & Payments', ['Pro features require a paid subscription. Prices are shown before purchase and may change with 30 days notice.', 'Cancel anytime via Subscription settings.']],
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
        ['Invoicing & Payment', ['Submit invoices for completed work as agreed with the landlord. Payment timing is between you and the assigning landlord.', 'Landlord HQ records payment status but does not process contractor payouts directly in this demo.']],
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
const NO_NAV = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','forgot-password','reset-verify-code','reset-password','reset-success','chat','tenant-detail','property-detail','maintenance-detail','maintenance-history','invoice-detail','inventory-room','document-preview','personal-info','notifications-settings','security','password','preferences','payment-methods','subscription','help-support','faq','faq-detail','privacy','terms','about','add-property','log-maintenance','notifications-list','transaction-history','edit-property','invite-tenant','tenant-invite-sent','edit-tenant','reschedule-inspection','renew-compliance','edit-inventory-room','add-payment-method','edit-payment-method','edit-preference','tenant-add-note','tenant-edit-note','select-property-invite'];

const PRE_AUTH_SCREENS = ['splash','onboarding','role-select','sign-in','sign-up','sign-up-phone','verify-otp','welcome','contractor-invite','contractor-welcome','tenant-invite','tenant-activate','tenant-welcome','forgot-password','reset-verify-code','reset-password','reset-success'];
const PUBLIC_SCREENS = [...PRE_AUTH_SCREENS];

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
    { id: 'admin', title: 'Admin', desc: 'Platform management', icon: 'shield', color: '#7C3AED', bg: '#EDE9FE' },
];

const SELECTABLE_ROLES = AUTH_ROLES.filter(r => !['admin', 'tenant'].includes(r.id));

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
        toast('Enter your email address');
        return;
    }
    if (!isValidEmail(email)) {
        toast('Enter a valid email address');
        return;
    }
    if (password.length < 6) {
        toast('Password must be at least 6 characters');
        return;
    }
    const tenantAccount = tenantAccountByEmail(email);
    if (STATE.authRole === 'tenant' || tenantAccount) {
        if (!tenantAccount) {
            toast('No tenant account found. Use demo login or activate via invitation.');
            return;
        }
        if (tenantAccount.password !== password) {
            toast('Incorrect password');
            return;
        }
        STATE.isAuthenticated = true;
        STATE.userRole = STATE.authRole = 'tenant';
        STATE.activeTenantId = tenantAccount.id;
        STATE.showPassword = false;
        saveAuthSession();
        go('tenant-dashboard');
        setTimeout(() => toast(`Welcome back, ${tenantAccount.firstName}!`), 50);
        return;
    }
    if (STATE.authRole === 'contractor') {
        loadContractorAccounts();
        const contractorAccount = contractorAccountByEmail(email);
        if (!contractorAccount) {
            toast('No contractor account found. Use demo login below.');
            return;
        }
        if (contractorAccount.password !== password) {
            toast('Incorrect password');
            return;
        }
        STATE.isAuthenticated = true;
        STATE.userRole = STATE.authRole = 'contractor';
        STATE.showPassword = false;
        saveAuthSession();
        go('contractor-dashboard');
        setTimeout(() => toast(`Welcome back, ${contractorAccount.firstName}!`), 50);
        return;
    }
    if (STATE.authRole === 'landlord') {
        const account = landlordAccountByEmail(email);
        if (!account) {
            toast('No account found for this email. Sign up first.');
            return;
        }
        if (account.password !== password) {
            toast('Incorrect password');
            return;
        }
        LANDLORD_USER.firstName = account.firstName;
        LANDLORD_USER.lastName = account.lastName;
        LANDLORD_USER.email = account.email;
        if (typeof AppStore !== 'undefined') AppStore.save();
        STATE.isAuthenticated = true;
        STATE.userRole = STATE.authRole = 'landlord';
        STATE.showPassword = false;
        saveAuthSession();
        go(getRoleHome());
        setTimeout(() => toast(`Welcome back, ${account.firstName}!`), 50);
        return;
    }
    toast('Select your role and try again');
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
    return document.querySelector(`[data-invite="${name}"]`)?.value?.trim() || '';
}

function sendTenantInvitation() {
    const firstName = inviteField('firstName');
    const lastName = inviteField('lastName');
    const email = inviteField('email');
    const phone = inviteField('phone');
    const unit = inviteField('unit');
    const rent = inviteField('rent');
    const leaseStart = inviteField('leaseStart');
    const leaseEnd = inviteField('leaseEnd');
    const message = inviteField('message');
    if (!firstName || !lastName) {
        toast('Enter tenant first and last name');
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
        email,
        phone,
        propertyId: STATE.propertyId,
        unit,
        rent: rent || p.rent,
        leaseStart,
        leaseEnd,
        message,
        landlord: `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`,
        status: 'pending',
        sentAt: 'Just now',
    };
    TENANT_INVITATIONS.push(invite);
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
    const invite = tenantInviteByToken(token);
    if (!invite) {
        toast('Invalid or expired invitation');
        go('tenant-invite');
        return;
    }
    STATE.tenantInviteToken = token;
    STATE.authRole = 'tenant';
    go('tenant-invite', { token });
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
            <p class="auth-footer-text" style="margin-top:20px">Tenant invited? <button type="button" data-action="open-tenant-invite" data-token="DEMO-88KS">Open invitation</button></p>
            <p class="auth-footer-text" style="margin-top:12px">Contractor invited? <button type="button" data-go="contractor-invite">Open invitation</button></p>
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
            <div class="auth-icon-wrap">
                <i data-lucide="log-in" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Welcome Back!</h1>
            <p class="auth-sub">${signInSubtitle()}</p>
            ${authDemoCard()}
            <div class="auth-form">
                <div class="auth-field">
                    <label>Email address</label>
                    <input type="email" data-signin-email class="auth-input" placeholder="${DEMO_CREDENTIALS[STATE.authRole]?.email || 'you@email.com'}" autocomplete="username" inputmode="email">
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
            <p class="auth-security-note"><i data-lucide="lock" class="w-3.5 h-3.5"></i> Demo: enter any 6 digits</p>
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
                    <button type="button" data-action="enter-app" data-go-after="select-property-invite" class="welcome-quick-item">
                        <span class="welcome-quick-icon welcome-quick-icon-green"><i data-lucide="user-plus" class="w-4 h-4"></i></span>
                        <span>Invite Tenant</span>
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
    if (screen === 'faq-detail') {
        STATE.faqOpenId = opts.faqId ?? STATE.faqId ?? 0;
        screen = 'faq';
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
    if (screen === 'tenant-invite' || screen === 'tenant-activate') {
        STATE.tenantInviteToken = opts.token ?? STATE.tenantInviteToken;
        if (opts.token) STATE.authRole = 'tenant';
    }
    if (screen === 'conduct-inspection' || screen === 'create-tenancy' || screen === 'property-photos' || screen === 'property-floor-plans' || screen === 'property-alarms' || screen === 'property-appliances' || screen === 'property-utilities' || screen === 'property-parking' || screen === 'property-info') STATE.propertyId = opts.propertyId ?? STATE.propertyId;
    if (screen === 'checkout-tenancy') STATE.tenantId = opts.tenantId ?? STATE.tenantId;
    if (screen === 'share-document') STATE.shareDocId = opts.shareDocId ?? STATE.shareDocId;
    if (screen === 'assign-contractor') STATE.assignMaintId = opts.maintId ?? STATE.maintId;
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
    if (opts.noteId !== undefined) STATE.noteId = opts.noteId;
    if (screen === 'tenant-add-note' || screen === 'tenant-edit-note') STATE.tenantId = opts.tenantId ?? STATE.tenantId;
    if (screen === 'document-preview') {
        STATE.previewDocId = opts.docId ?? STATE.previewDocId;
        STATE.previewDocIdx = opts.previewDocIdx ?? STATE.previewDocIdx;
        STATE.previewDocSource = opts.previewDocSource ?? STATE.previewDocSource ?? 'property';
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
        go(STATE.helpReturnScreen || helpReturnHome());
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
        go(STATE.legalReturnScreen || legalReturnHome());
        return;
    }
    if (STATE.screen === 'reset-success') return;
    if (STATE.screen === 'contractor-welcome' || STATE.screen === 'tenant-welcome') return;
    if (STATE.screen === 'tenant-detail' && STATE.tenantTab !== 'overview') {
        setTenantTab('overview');
        return;
    }
    const defaultHome = getRoleHome();
    const profileParent = profileHomeScreen();
    const map = {
        'property-detail':'properties','tenant-detail':'tenants','chat':'messages',
        'maintenance-detail':'maintenance','invoice-detail':'financial',
        'inventory-room':'property-detail',
        'personal-info': profileParent,'notifications-settings': profileParent,
        'security': profileParent,'password': profileParent,'preferences': profileParent,
        'payment-methods': profileParent,'subscription': profileParent,'transaction-history': profileParent,
        'faq-detail':'faq','about': profileParent,
        'edit-property':'property-detail','invite-tenant':'property-detail',
        'edit-tenant':'tenant-detail','reschedule-inspection':'property-detail',
        'renew-compliance':'property-detail','edit-inventory-room':'inventory-room',
        'add-payment-method':'payment-methods','edit-payment-method':'payment-methods',
        'edit-preference':'preferences',
        'add-property':'properties',
        'log-maintenance': STATE.userRole === 'tenant' ? 'tenant-dashboard' : 'maintenance',
        'notifications-list': defaultHome,
        'financial': defaultHome,
        'sign-up-phone':'sign-up',
        'verify-otp':'sign-up',
        'reset-verify-code':'forgot-password','reset-password':'reset-verify-code',
        'reset-success':'sign-in',
        'contractor-job-detail':'contractor-jobs','contractor-schedule':'contractor-job-detail',
        'contractor-work':'contractor-job-detail',
        'contractor-documents':'contractor-job-detail',
        'tenant-invite-sent':'invite-tenant',
        'tenant-activate':'tenant-invite',
        'contractor-company':'contractor-profile','contractor-invite':'role-select',
    };
    const tabMap = {
        'inventory-room':'inventory',
        'edit-property':'overview', 'invite-tenant':'tenant',
        'reschedule-inspection':'inspection', 'renew-compliance':'compliance',
        'contractor-work':'work', 'contractor-documents':'invoice',
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
    const role = STATE.userRole;
    STATE.isAuthenticated = false;
    STATE.signInOrigin = 'logout';
    STATE.authRole = role;
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
                ${(() => { const n = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(x => x.unread).length; return n ? `<span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">${n}</span>` : ''; })()}
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
            ${(() => { const n = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : NOTIFICATIONS.filter(x => x.unread).length; return n ? `<span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">${n}</span>` : ''; })()}
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

const formSelect = (label, value, options, key = '') => {
    const fieldAttr = key ? ` data-field="${key}"` : '';
    return `<div><label class="form-label">${label}</label>
<select class="form-input form-select"${fieldAttr}>${options.map(o => `<option ${o === value ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
};

const photoUpload = (label = 'Add photos') => `
<button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
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
    if (STATE.userRole === 'contractor' || STATE.userRole === 'tenant') return '';
    if (!MAIN_SCREENS.includes(STATE.screen)) return '';
    return `<button class="fab-float" data-action="fab" aria-label="Quick actions"><i data-lucide="plus" class="w-6 h-6"></i></button>`;
};

const drawer = () => {
    const isActive = (sc) => STATE.screen === sc;
    const isContractor = STATE.userRole === 'contractor';
    const isTenant = STATE.userRole === 'tenant';
    const navItems = isContractor ? CONTRACTOR_DRAWER_NAV : isTenant ? TENANT_DRAWER_NAV : DRAWER_NAV;
    const navHtml = navItems.map(([ic, label, sc]) => `
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

const PROP_SECTIONS = { details:'Overview', photos:'Photos', tenant:'Tenant', documents:'Documents', maintenance:'Maintenance', inspection:'Inspection', compliance:'Compliance', inventory:'Inventory', timeline:'Timeline', 'floor-plans':'Floor Plans' };

const propMenuList = () => {
    const items = [
        ['info','Overview','details'],['image','Photos','photos'],['users','Tenant','tenant'],['file-text','Documents','documents'],
        ['wrench','Maintenance','maintenance'],['clipboard-list','Inspection','inspection'],
        ['shield-check','Compliance','compliance'],['package','Inventory','inventory'],
        ['layout','Floor Plans','floor-plans'],['clock','Timeline','timeline'],
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
    const reminders = (typeof AppStore !== 'undefined' ? AppStore.reminders : [
        { title: 'Gas Certificate Expiry', propertyId: 0, daysLeft: 3, urgency: 'high', type: 'gas' },
        { title: 'Inspection Due', propertyId: 1, daysLeft: 5, urgency: 'medium', type: 'inspection' },
        { title: 'Rent Review', propertyId: 2, daysLeft: 10, urgency: 'medium', type: 'rent-review' },
    ]).slice(0, 3).map(r => {
        const p = PROPERTIES[r.propertyId];
        const rt = (typeof REMINDER_TYPES !== 'undefined' ? REMINDER_TYPES.find(t => t[0] === r.type) : null) || ['custom', r.title, 'bell', '#EFF6FF', '#2563EB'];
        const tab = r.type === 'inspection' ? 'inspection' : r.type === 'rent-review' ? 'overview' : 'compliance';
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
            ${dashStatCard({
                go: 'financial', variant: 'collected', icon: 'trending-up',
                label: 'Collected', value: `${collectedPct}%`,
                pill: '+4%',
            })}
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
        details: typeof renderPropertyOverviewDetails === 'function'
            ? renderPropertyOverviewDetails(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading property details…</p></div>`,
        tenant: typeof renderPropertyTenantTab === 'function'
            ? renderPropertyTenantTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading tenant…</p></div>`,
        documents: (() => {
            const docs = typeof AppStore !== 'undefined' ? AppStore.docsForProperty(STATE.propertyId) : [];
            const docIcons = { 'Tenancy Agreement': 'file-text', 'Deposit Certificate': 'shield', 'Gas Certificate': 'flame', 'Electrical Certificate': 'zap', 'EPC Certificate': 'leaf', 'How to Rent Guide': 'book-open', 'Signed Document': 'file-check', 'Custom Document': 'file' };
            const docColors = { 'Tenancy Agreement': '#2563EB', 'Deposit Certificate': '#059669', 'Gas Certificate': '#DC2626', 'Electrical Certificate': '#D97706', 'EPC Certificate': '#16A34A', 'How to Rent Guide': '#7C3AED', 'Signed Document': '#059669', 'Custom Document': '#64748B' };
            return `
            <div class="screen-content screen-content-sm">
                <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-6 text-center w-full mb-3">
                    <i data-lucide="cloud-upload" class="w-10 h-10 text-[#2563EB] mx-auto"></i>
                    <p class="text-[13px] font-semibold mt-2">Upload Document</p>
                    <p class="text-[11px] text-[#64748B]">PDF, JPG, PNG up to 10MB</p>
                </button>
                ${docs.length ? docs.map(d => `
                <div class="card p-3.5 flex items-center gap-3 mb-2">
                    <div class="w-11 h-11 rounded-xl bg-[#F8FAFC] flex items-center justify-center" style="color:${docColors[d.type] || '#64748B'}"><i data-lucide="${docIcons[d.type] || 'file'}" class="w-5 h-5"></i></div>
                    <button data-go="document-preview" data-doc="${d.id}" class="flex-1 text-left">
                        <p class="text-[13px] font-semibold">${d.name}</p>
                        <p class="text-[11px] text-[#64748B]">${d.type} · ${d.date}${d.shared ? ' · Shared' : ''}${d.signed ? ' · Signed' : ''}</p>
                    </button>
                    <button data-action="share-doc" data-doc="${d.id}" class="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center" title="Share"><i data-lucide="share-2" class="w-4 h-4 text-[#2563EB]"></i></button>
                </div>`).join('') : `<div class="card p-8 text-center"><i data-lucide="folder-open" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i><p class="text-[14px] font-semibold text-[#0F172A] mt-3">No documents</p><p class="text-[12px] text-[#64748B] mt-1">Upload agreements and certificates</p></div>`}
            </div>`;
        })(),
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
        inspection: typeof renderPropertyInspectionTab === 'function'
            ? renderPropertyInspectionTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading inspections…</p></div>`,
        compliance: typeof renderPropertyComplianceTab === 'function'
            ? renderPropertyComplianceTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading compliance…</p></div>`,
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
        'floor-plans': `<div class="screen-content"><p class="text-[13px] text-[#64748B] mb-3">Floor plans and layout diagrams for this property.</p><button data-go="property-floor-plans" class="btn-primary w-full py-3.5 text-[14px]">Open Floor Plans</button></div>`,
        photos: `<div class="screen-content"><p class="text-[13px] text-[#64748B] mb-3">Upload photos, set a cover image, and manage the property gallery.</p><button data-go="property-photos" data-pid="${STATE.propertyId}" class="btn-primary w-full py-3.5 text-[14px]">Open Photo Gallery</button></div>`,
        timeline: typeof renderPropertyTimelineTab === 'function'
            ? renderPropertyTimelineTab(STATE.propertyId)
            : `<div class="screen-content"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`,
    };

    if (isHub) {
        return `
        <div class="relative h-[180px] shrink-0 w-full">
            <img src="${typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(STATE.propertyId) : IMG.props[STATE.propertyId]}" class="img-cover" alt="">
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
        pending: ['Pending Invite', '#FFFBEB', '#D97706'],
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
            <span class="tenant-hero-badge"><span class="tenant-hero-badge-dot"></span>${listItem.status === 'active' ? 'Active Tenant' : listItem.status === 'pending' ? 'Invitation Pending' : 'Inactive'}</span>
        </div>
        <div class="tenant-hero-meta">
            <div class="tenant-hero-chip">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                <span>${listItem.prop}${listItem.unit ? ` · ${listItem.unit}` : ''}</span>
            </div>
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
    <div class="tenant-quick-actions">
        ${[
            ['phone', 'Call', 'call', null],
            ['message-square', 'Message', null, listItem.chatId],
            ['mail', 'Email', 'email', null],
            ['more-horizontal', 'More', 'more', null],
            ...(listItem.status === 'active' ? [['log-out', 'Check-out', null, 'checkout']] : []),
        ].map(([ic, label, action, chatOrCheckout]) => `
        <button type="button" ${action === 'checkout' || chatOrCheckout === 'checkout' ? `data-go="checkout-tenancy" data-tid="${STATE.tenantId}"` : action === 'call' ? `data-action="call-tenant"` : action === 'email' ? `data-action="email-tenant"` : chatOrCheckout != null && typeof chatOrCheckout === 'number' ? `data-go="chat" data-chat="${chatOrCheckout}"` : action === 'more' ? `data-action="toast" data-msg="More tenant options"` : `data-action="toast" data-msg="Unavailable"`} class="tenant-quick-btn">
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
                ['Start Date', typeof formatDisplayDate === 'function' ? formatDisplayDate(t.moveIn) || '—' : '—'],
                ['End Date', typeof formatDisplayDate === 'function' ? formatDisplayDate(t.leaseEnd) || '—' : '—'],
                ['Monthly Rent', '£' + Number(t.rent || 0).toLocaleString()],
                ['Deposit', '£' + Number(t.rent || 0).toLocaleString()],
                ['Deposit Scheme', 'DPS'],
            ])}
            <p class="text-[12px] text-[#64748B] leading-relaxed px-1">Dates come from tenant profile. Edit via <strong>Edit Tenant</strong> or set when inviting a new tenant.</p>
            <button type="button" data-go="edit-tenant" class="btn-secondary w-full py-3 text-[13px]">Edit Lease Dates</button>
            <button type="button" data-go="document-preview" class="btn-secondary w-full py-3 text-[13px]">View Lease PDF</button>
            ${typeof renderTenancyMemberList === 'function' ? renderTenancyMemberList(STATE.tenantId) : ''}`,
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
        documents: () => {
            const docs = typeof getTenantDocuments === 'function' ? getTenantDocuments(t.id) : [
                ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                ['file-image', 'ID Scan.jpg', 'Jan 10, 2024', '#7C3AED'],
                ['file-check', 'Reference Letter.pdf', 'Jan 8, 2024', '#059669'],
            ];
            return `
            <div class="stack-sm">
                ${docs.map(([ic, name, date, color], idx) => `
                <button type="button" data-go="document-preview" data-preview-source="tenant" data-preview-idx="${idx}" class="card tenant-doc-row w-full text-left">
                    <div class="tenant-doc-icon" style="color:${color}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                    <div class="flex-1 min-w-0">
                        <p class="tenant-doc-name">${name}</p>
                        <p class="tenant-doc-date">${date}</p>
                    </div>
                    <i data-lucide="download" class="w-4 h-4 text-[#94A3B8]"></i>
                </button>`).join('')}
                <button type="button" data-action="upload-tenant-doc" class="tenant-upload-zone">
                    <i data-lucide="upload" class="w-6 h-6"></i>
                    <p>Upload Document</p>
                </button>
            </div>`;
        },
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
        maintenance: () => typeof renderTenantMaintenanceSection === 'function'
            ? renderTenantMaintenanceSection(STATE.tenantId)
            : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No maintenance data</p></div>`,
        notes: () => typeof renderTenantNotesSection === 'function' ? renderTenantNotesSection(t.id) : `
            <div class="stack-sm">
                ${[
                    ['Tenant prefers email for non-urgent matters. Very responsive on WhatsApp.', 'Mar 5, 2025 · You', '#FFFBEB', '#D97706'],
                    ['Requested early inspection before lease renewal discussion.', 'Feb 12, 2025 · You', '#EFF6FF', '#2563EB'],
                ].map(([text, meta, bg, color]) => `
                <div class="tenant-note-card" style="background:${bg};border-color:${color}22">
                    <p class="tenant-note-text">${text}</p>
                    <div class="tenant-note-footer">
                        <span class="tenant-note-meta">${meta}</span>
                        <button type="button" data-action="edit-tenant-note" data-nid="0" class="tenant-note-edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                    </div>
                </div>`).join('')}
                <button type="button" data-go="tenant-add-note" class="btn-primary w-full py-3 text-[13px]">+ Add Note</button>
            </div>`,
        activity: () => typeof renderTenantActivitySection === 'function'
            ? renderTenantActivitySection(STATE.tenantId, t)
            : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`,
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
        <button data-go="maintenance-history" class="btn-secondary w-full py-3 text-[13px] mt-2">View Full History</button>
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
            <button type="button" class="chat-input-icon" data-action="toast" data-msg="Attachment added"><i data-lucide="paperclip" class="w-[18px] h-[18px]"></i></button>
            <input type="text" data-chat-input class="chat-input-field" placeholder="Type a message..." value="${STATE.chatDraft || ''}">
            <button type="button" data-action="send-chat" class="chat-send-btn"><i data-lucide="send" class="w-[17px] h-[17px]"></i></button>
        </div>
    </div>`;
}

function screenProfile() {
    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-enter">
        <button data-go="personal-info" class="profile-card">
            <img src="${IMG.avatar.john}" class="profile-card-avatar" alt="">
            <div class="profile-card-body">
                <p class="profile-card-name">${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}</p>
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
    if (STATE.userRole === 'tenant') {
        const t = getActiveTenant();
        if (!t) {
            return `${topBar('Account', { back: true })}
            <div class="screen-content screen-enter">
                <p class="text-[14px] text-[#64748B]">Activate your account via invitation link to view profile.</p>
            </div>`;
        }
        const p = PROPERTIES[t.propertyId];
        return `${topBar('Account', { back: true })}
        <div class="screen-content screen-enter">
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
    return `${topBar('Payment Methods', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
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
            ${items.map((f) => {
                const open = STATE.faqOpenId === f.id;
                return `
            <div class="faq-accordion-item${open ? ' open' : ''}">
                <button type="button" data-faq-toggle="${f.id}" class="faq-accordion-trigger" aria-expanded="${open}">
                    <p class="faq-minimal-q">${f.q}</p>
                    <i data-lucide="chevron-down" class="faq-accordion-icon w-4 h-4 shrink-0"></i>
                </button>
                <div class="faq-accordion-body">
                    <p class="faq-accordion-answer">${f.a}</p>
                </div>
            </div>`;
            }).join('')}
        </div>
        <p class="text-center text-[13px] text-[#64748B] mt-6">Can't find an answer?</p>
        <button data-action="toast" data-msg="support@landlordhq.com" class="btn-primary w-full py-3 text-[13px] mt-2">Contact Support</button>
    </div>`;
}

function screenFaqDetail() {
    return screenFaq();
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
            <h2 class="text-[22px] font-bold text-[#0F172A] mt-4">Landlord HQ</h2>
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
        <h2 class="text-[18px] font-bold">${item.issue}</h2>
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
    const detailRows = [
        ['Property', inv.prop],
        ['Due Date', inv.due],
        ['Invoice #', inv.num],
    ];
    if (inv.status === 'Paid') detailRows.push(['Paid Date', inv.due]);
    const sc = inv.status === 'Paid' ? '#22C55E' : inv.status === 'Overdue' ? '#EF4444' : '#D97706';
    return `${topBar('Invoice', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-5 text-center">
            <p class="text-[13px] text-[#64748B]">Amount Due</p>
            <p class="text-3xl font-bold text-[#0F172A] mt-1">${inv.amount}</p>
            <span class="badge mt-3" style="background:${sc}18;color:${sc}">${inv.status}</span>
        </div>
        <div class="card divide-y divide-[#F1F5F9]">
            ${detailRows.map(([k,v])=>`
            <div class="p-4 flex justify-between text-[13px]"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
        </div>
        <div class="grid grid-cols-2 gap-4">
            <button data-action="toast" data-msg="Invoice downloaded" class="btn-secondary py-3 text-[13px]">Download PDF</button>
            ${inv.status !== 'Paid' ? `<button data-action="mark-invoice-paid" data-iid="${inv.id}" class="btn-primary py-3 text-[13px]">Mark Received</button>` : `<button data-action="toast" data-msg="Receipt downloaded" class="btn-primary py-3 text-[13px]">Download Receipt</button>`}
        </div>
    </div>`;
}

function screenInventoryRoom() {
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms() : [['Kitchen','Good','4 items'],['Living Room','Good','6 items'],['Bedroom','Fair','5 items'],['Bathroom','Good','3 items'],['Hallway','Good','2 items']];
    const room = rooms[STATE.roomId] || rooms[0];
    const items = typeof getInventoryItems === 'function' ? getInventoryItems(STATE.propertyId, STATE.roomId) : [['Oven & Hob','Good'],['Fridge Freezer','Good'],['Washing Machine','Fair'],['Microwave','Good']];
    const notes = typeof getInventoryNotes === 'function' ? getInventoryNotes(STATE.propertyId, STATE.roomId) : 'Minor wear on worktop near sink. All appliances tested and working.';
    return `${topBar(room[0], { back: true })}
    <div class="screen-content screen-enter">
        <div class="flex items-center justify-between">
            <span class="badge ${room[1]==='Good'?'bg-[#DCFCE7] text-[#16A34A]':'bg-[#FEF3C7] text-[#D97706]'}">Condition: ${room[1]}</span>
            <button data-go="edit-inventory-room" data-room="${STATE.roomId}" class="text-[13px] font-semibold text-[#2563EB]">Edit</button>
        </div>
        <div class="grid grid-cols-2 gap-2">${IMG.interior.map(src=>`<div class="aspect-square rounded-xl overflow-hidden"><img src="${src}" class="img-cover" alt=""></div>`).join('')}</div>
        <div class="card p-4 space-y-3">
            <h3 class="text-[14px] font-bold">Items</h3>
            ${items.map(([item,c])=>`
            <div class="flex justify-between text-[13px] py-1.5 border-b border-[#F1F5F9] last:border-0"><span>${item}</span><span class="text-[#64748B]">${c}</span></div>`).join('')}
        </div>
        <div class="card p-4"><p class="text-[12px] text-[#64748B] mb-1">Notes</p><p class="text-[13px] leading-relaxed">${notes}</p></div>
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
    return `${topBar('Add Property', { back: true })}
    <div class="screen-content screen-enter">
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[12px] text-[#64748B] mt-2">Add property photos</p>
        </button>
        <div><label class="form-label">Property Name <span class="form-required">*</span></label><input data-field="name" type="text" class="form-input" placeholder="e.g. 12 Park Lane"></div>
        <div><label class="form-label">Address <span class="form-required">*</span></label><input data-field="address" type="text" class="form-input" placeholder="Street address"></div>
        <div><label class="form-label">Postcode</label><input data-field="postcode" type="text" class="form-input" placeholder="e.g. SW1A 1AA"></div>
        <div><label class="form-label">Monthly Rent (£) <span class="form-required">*</span></label><input data-field="rent" type="number" class="form-input" placeholder="2450"></div>
        <div><label class="form-label">Bedrooms</label><input data-field="beds" type="number" class="form-input" placeholder="2"></div>
        <div><label class="form-label">Bathrooms</label><input data-field="baths" type="number" class="form-input" placeholder="1"></div>
        <div><label class="form-label">Square Feet</label><input data-field="sqft" type="text" class="form-input" placeholder="1200"></div>
        <div class="grid grid-cols-2 gap-3">
            <div><label class="form-label">Floors</label><input data-field="floors" type="number" class="form-input" placeholder="2" value="2"></div>
            <div><label class="form-label">Flats / Floor</label><input data-field="flatsPerFloor" type="number" class="form-input" placeholder="2" value="2"></div>
        </div>
        <p class="form-helper">Units are auto-generated (e.g. Flat 1A, Flat 2B) for tenancy and invites.</p>
        <div><label class="form-label">Status</label><select data-field="status" class="form-input form-select"><option>Vacant</option><option>Occupied</option></select></div>
        <button data-action="save" data-msg="Property added successfully" class="btn-primary w-full py-3.5 text-[14px]">Add Property</button>
    </div>`;
}

function screenEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    const rent = p.rent.replace(/[£,]/g, '');
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
        <div><label class="form-label">Monthly Rent (£)</label><input data-field="rent" type="number" class="form-input" value="${rent}"></div>
        <div><label class="form-label">Bedrooms</label><input data-field="beds" type="number" class="form-input" value="${p.beds}"></div>
        <div><label class="form-label">Bathrooms</label><input data-field="baths" type="number" class="form-input" value="${p.baths}"></div>
        <div><label class="form-label">Square Feet</label><input data-field="sqft" type="text" class="form-input" value="${p.sqft}"></div>
        ${(() => {
            const b = typeof getPropertyBuilding === 'function' ? getPropertyBuilding(STATE.propertyId) : { floors: 1, flatsPerFloor: 1 };
            return `<div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Floors</label><input data-field="floors" type="number" class="form-input" value="${b.floors}"></div>
                <div><label class="form-label">Flats / Floor</label><input data-field="flatsPerFloor" type="number" class="form-input" value="${b.flatsPerFloor}"></div>
            </div>`;
        })()}
        ${formSelect('Status', p.status, ['Occupied', 'Vacant'], 'status')}
        ${formTextarea('Notes', notes, 'Property notes, access codes, etc.', 'notes')}
        ${saveBtn('Save Property', 'Property updated')}
        <button data-action="delete-property" class="btn-secondary w-full py-3.5 text-[14px] mt-3 text-[#DC2626] border border-[#FECACA]">Remove Property</button>
    </div>`;
}

function screenInviteTenant() {
    const p = PROPERTIES[STATE.propertyId];
    const units = ['Flat 1', 'Flat 2A', 'Unit 1', 'Flat B', 'Ground Floor'];
    return `${topBar('Invite Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address} · ${p.rent}/month</p></div>
        </div>
        <p class="text-[12px] text-[#64748B] leading-relaxed">Create a tenant profile and send a secure invitation. They must accept the invite before accessing the portal — random sign-ups are not allowed.</p>
        <div><label class="form-label">First Name</label><input data-invite="firstName" type="text" class="form-input" placeholder="Tenant first name"></div>
        <div><label class="form-label">Last Name</label><input data-invite="lastName" type="text" class="form-input" placeholder="Tenant last name"></div>
        <div><label class="form-label">Email</label><input data-invite="email" type="email" class="form-input" placeholder="tenant@email.com"></div>
        <div><label class="form-label">Phone</label><input data-invite="phone" type="tel" class="form-input" placeholder="+44 7700 900000"></div>
        <div><label class="form-label">Unit</label>
            <select data-invite="unit" class="form-input form-select">${units.map(u => `<option>${u}</option>`).join('')}</select>
        </div>
        <div><label class="form-label">Monthly Rent</label><input data-invite="rent" type="text" class="form-input" placeholder="${p.rent}" value="${p.rent}"></div>
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
    const demoLink = `${window.location.origin}${window.location.pathname}?invite=${invite.token}`;
    return `${topBar('Invitation Sent', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <p class="text-[16px] font-bold text-[#0F172A] mt-4">Invitation Sent!</p>
            <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">We emailed <strong>${invite.email}</strong> an invitation to join as tenant at <strong>${p.name}</strong> (${invite.unit}).</p>
        </div>
        <div class="card p-4 space-y-2">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Invitation Details</p>
            ${[['Tenant', `${invite.firstName} ${invite.lastName}`], ['Property', p.name], ['Unit', invite.unit], ['Rent', invite.rent], ['Status', 'Pending activation']].map(([k, v]) => `
            <div class="flex justify-between text-[13px] py-1"><span class="text-[#64748B]">${k}</span><span class="font-semibold text-right">${v}</span></div>`).join('')}
        </div>
        <div class="card p-4">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Demo Invitation Link</p>
            <p class="text-[12px] text-[#475569] mt-2 break-all leading-relaxed">${demoLink}</p>
            <button type="button" data-action="open-tenant-invite" data-token="${invite.token}" class="btn-secondary w-full py-3 text-[13px] mt-3">Preview Tenant Experience</button>
        </div>
        <button type="button" data-go="property-detail" data-pid="${invite.propertyId}" data-tab="tenant" class="btn-primary w-full py-3.5 text-[14px]">Back to Property</button>
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
        ${formField('First Name', t.firstName, 'text', '', 'firstName')}${formField('Last Name', t.lastName, 'text', '', 'lastName')}
        ${formField('Email', t.email, 'email', '', 'email')}${formField('Phone', t.phone, 'tel', '', 'phone')}
        ${formField('Property', t.prop, 'text', '', 'prop')}${formField('Monthly Rent', t.rent, 'text', '', 'rent')}
        ${formField('Move-in Date', t.moveIn, 'date', '', 'moveIn')}${formField('Lease End', t.leaseEnd, 'date', '', 'leaseEnd')}
        ${formField('Emergency Contact', t.emergency, 'text', '', 'emergency')}${formField('Emergency Phone', t.emergencyPhone, 'tel', '', 'emergencyPhone')}
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
            <div><p class="text-[15px] font-bold">${item[1]}</p><p class="text-[12px] text-[#64748B]">${p.name} · Current: ${item[2]}</p></div>
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
        <button type="button" data-action="remove-payment-method" class="w-full py-3 text-[14px] font-semibold text-[#DC2626]">Remove Payment Method</button>
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
    const pid = isTenant ? tenant?.propertyId : STATE.propertyId;
    const p = pid != null ? PROPERTIES[pid] : null;
    const propertyField = isTenant ? `
        <div class="card p-4" style="background:#F8FAFC">
            <p class="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Your Property</p>
            <p class="text-[15px] font-bold text-[#0F172A] mt-1">${p?.name || '—'}</p>
            <p class="text-[12px] text-[#64748B] mt-0.5">${tenant?.unit || ''}${tenant?.unit && p?.address ? ' · ' : ''}${p?.address || ''}</p>
        </div>` : `
        <div><label class="form-label">Property <span class="form-required">*</span></label>
        <select data-field="propertyId" class="form-input form-select">${PROPERTIES.map(prop => `<option value="${prop.id}" ${prop.id === pid ? 'selected' : ''}>${prop.name}</option>`).join('')}</select></div>`;
    return `${topBar(isTenant ? 'Report Issue' : 'Log Issue', { back: true })}
    <div class="screen-content screen-enter">
        ${propertyField}
        <div><label class="form-label">Issue Title <span class="form-required">*</span></label><input data-field="title" class="form-input" placeholder="Describe the issue"></div>
        <div><label class="form-label">Priority</label>
        <div class="flex gap-2">${['Low','Medium','High'].map(pr=>`
        <button data-log-priority="${pr}" class="tab-pill ${STATE.logPriority===pr?'active':''}">${pr}</button>`).join('')}</div></div>
        <div><label class="form-label">Description <span class="form-required">*</span></label><textarea data-field="desc" class="form-input h-24 resize-none" placeholder="Add details..."></textarea></div>
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[12px] text-[#64748B] mt-2">Add photos</p>
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

    const faqToggle = e.target.closest('[data-faq-toggle]');
    if (faqToggle) { e.preventDefault(); toggleFaqItem(+faqToggle.dataset.faqToggle); return; }
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
            if (el.dataset.doc !== undefined) opts.docId = +el.dataset.doc;
            if (el.dataset.previewIdx !== undefined) opts.previewDocIdx = +el.dataset.previewIdx;
            if (el.dataset.previewSource) opts.previewDocSource = el.dataset.previewSource;
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
        el.onclick = () => { STATE.authRole = 'contractor'; demoLogin('contractor'); };
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
