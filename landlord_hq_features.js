/* Landlord HQ — Feature completion layer (persistence, new screens, workflows) */

const CONTRACTORS = [
    { id: 0, name: 'Plumber Pro', tradeId: 'plumbing', trade: 'Plumbing & Heating', category: 'Plumber', jobsFor: 'Leaks, taps, sinks, pipes, toilets, blocked drains', img: IMG.avatar.plumber, phone: '+44 7700 900201', email: 'jobs@plumberpro.co.uk', gasSafe: true, liabilityInsurance: true, avgRating: '4.8', ratings: [
        { stars: 5, comment: 'Fixed the leak quickly and left the kitchen spotless.', job: 'Kitchen sink leaking', at: 'Mar 8, 2025', from: 'Sarah Johnson', role: 'tenant' },
        { stars: 5, comment: 'Clear updates and fair pricing on the invoice.', job: 'Tap replacement', at: 'Mar 2, 2025', from: 'John Smith', role: 'landlord' },
        { stars: 4, comment: 'Good work — arrived a little later than planned.', job: 'Radiator bleed', at: 'Feb 20, 2025', from: 'Michael Lee', role: 'tenant' },
        { stars: 5, comment: 'Gas certificate uploaded same day. Very professional.', job: 'Annual gas check', at: 'Jan 30, 2025', from: 'John Smith', role: 'landlord' },
    ], certificates: [
        { id: 0, type: 'gas_safe', name: 'Gas Safe Registration', fileName: 'gas-safe-reg-2026.pdf', uploadedAt: 'Jan 15, 2026', validUntil: 'Mar 2027' },
        { id: 1, type: 'liability_insurance', name: 'Public Liability Insurance', fileName: 'liability-insurance-2026.pdf', uploadedAt: 'Dec 1, 2025', validUntil: 'Dec 2026' },
    ] },
    { id: 1, name: 'Heating Co.', tradeId: 'heating', trade: 'Heating & Gas', category: 'Heating engineer', jobsFor: 'Boilers, radiators, gas safety, hot water', img: IMG.avatar.heating, phone: '+44 7700 900202', email: 'service@heatingco.co.uk', gasSafe: true, liabilityInsurance: true, certificates: [
        { id: 0, type: 'gas_safe', name: 'Gas Safe Registration', fileName: 'heating-co-gas-safe.pdf', uploadedAt: 'Feb 2, 2026', validUntil: 'Feb 2027' },
    ] },
    { id: 2, name: 'Electric Fix', tradeId: 'electrical', trade: 'Electrical', category: 'Electrician', jobsFor: 'Lights, sockets, wiring, fuse boxes', img: IMG.avatar.electric, phone: '+44 7700 900203', email: 'bookings@electricfix.co.uk', liabilityInsurance: true, certificates: [
        { id: 0, type: 'trade_qualification', name: 'NICEIC Certification', fileName: 'niceic-cert-2026.pdf', uploadedAt: 'Jan 8, 2026', validUntil: 'Jan 2027' },
        { id: 1, type: 'liability_insurance', name: 'Public Liability Insurance', fileName: 'electric-fix-insurance.pdf', uploadedAt: 'Nov 12, 2025', validUntil: 'Nov 2026' },
    ] },
];

function normalizeContractorRecord(c) {
    if (!c || c.tradeId) return c;
    const legacyMap = {
        Plumbing: 'plumbing',
        Heating: 'heating',
        Electrical: 'electrical',
        General: 'general',
    };
    const tradeId = legacyMap[c.trade] || (typeof contractorTradeFromLabel === 'function' ? contractorTradeFromLabel(c.trade).id : 'general');
    const meta = typeof contractorTradeById === 'function' ? contractorTradeById(tradeId) : null;
    if (meta) {
        c.tradeId = meta.id;
        c.trade = meta.label;
        c.category = meta.shortLabel;
        c.jobsFor = meta.jobsFor;
    }
    if (typeof ensureContractorCertificates === 'function') ensureContractorCertificates(c);
    return c;
}

CONTRACTORS.forEach(normalizeContractorRecord);

const REMINDER_TYPES = [
    ['gas', 'Gas Certificate Expiry', 'flame', '#FEE2E2', '#DC2626'],
    ['electrical', 'Electrical Certificate Expiry', 'zap', '#FEF3C7', '#D97706'],
    ['epc', 'EPC Expiry', 'leaf', '#ECFDF5', '#059669'],
    ['smoke', 'Smoke Alarm Expiry', 'bell-ring', '#FEF3C7', '#D97706'],
    ['heat', 'Heat Alarm Expiry', 'thermometer', '#EFF6FF', '#2563EB'],
    ['co2', 'CO₂ Alarm Expiry', 'wind', '#F1F5F9', '#64748B'],
    ['mortgage', 'Mortgage Reminder', 'landmark', '#EFF6FF', '#2563EB'],
    ['insurance', 'Insurance Reminder', 'shield', '#ECFDF5', '#059669'],
    ['leasehold', 'Leasehold Reminder', 'building', '#F3E8FF', '#7C3AED'],
    ['rent-review', 'Rent Review Reminder', 'banknote', '#EFF6FF', '#2563EB'],
    ['inspection', 'Inspection Reminder', 'search', '#FEF3C7', '#D97706'],
    ['custom', 'Custom Reminder', 'bell', '#F1F5F9', '#475569'],
];

/** Maps COMPLIANCE_ITEMS index → reminder sync + renew behaviour */
const COMPLIANCE_ITEM_CONFIG = {
    0: { reminderType: 'gas', cert: true },
    1: { reminderType: 'electrical', cert: true },
    2: { reminderType: 'smoke', alarmKey: 'smoke', renewScreen: 'property-alarms' },
    3: { reminderType: 'heat', alarmKey: 'heat', renewScreen: 'property-alarms' },
    4: { reminderType: 'co2', alarmKey: 'co', renewScreen: 'property-alarms' },
    5: { reminderType: 'insurance', manual: true },
    6: { reminderType: 'mortgage', manual: true },
    7: { reminderType: 'epc', cert: true },
};

const DOC_TYPES = [
    'Tenancy Agreement', 'Deposit Certificate', 'Gas Certificate', 'Electrical Certificate',
    'EPC Certificate', 'How to Rent Guide', 'Signed Document', 'Custom Document',
];

const AppStore = {
    load() {
        try {
            const raw = sessionStorage.getItem('lhq_app');
            if (!raw) return this.seed();
            const d = JSON.parse(raw);
            if (d.properties) PROPERTIES.splice(0, PROPERTIES.length, ...d.properties);
            if (d.invoices) INVOICES.splice(0, INVOICES.length, ...d.invoices);
            if (d.maintenance) MAINTENANCE_ITEMS.splice(0, MAINTENANCE_ITEMS.length, ...d.maintenance);
            if (d.reminders) this.reminders = d.reminders;
            if (d.documents) this.documents = d.documents;
            if (d.tenancies) this.tenancies = d.tenancies;
            if (d.inspections) this.inspections = d.inspections;
            if (d.contractorInvoices) this.contractorInvoices = d.contractorInvoices;
            if (d.contractorJobs) this.contractorJobs = d.contractorJobs;
            if (d.propertyMeta) this.propertyMeta = d.propertyMeta;
            if (d.tenantNotes) this.tenantNotes = d.tenantNotes;
            if (d.checkoutRecords) this.checkoutRecords = d.checkoutRecords;
            if (d.inventory) this.inventory = d.inventory;
            if (d.paymentMethods) this.paymentMethods = d.paymentMethods;
            if (d.complianceCerts) this.complianceCerts = d.complianceCerts;
            if (d.certHistory) this.certHistory = d.certHistory;
            if (d.tenantDocuments) this.tenantDocuments = d.tenantDocuments;
            if (d.tenantReferencing) this.tenantReferencing = d.tenantReferencing;
            if (d.tenantCheckout) this.tenantCheckout = d.tenantCheckout;
            if (d.conversations) this.conversations = d.conversations;
            if (d.broadcasts) this.broadcasts = d.broadcasts;
            if (d.tenantList) { TENANT_LIST.splice(0, TENANT_LIST.length, ...d.tenantList); }
            if (d.tenants) { TENANTS.splice(0, TENANTS.length, ...d.tenants); }
            if (d.notifications) { NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...d.notifications); }
            if (d.tenantNotifications) this.tenantNotifications = d.tenantNotifications;
            if (d.toggles) Object.assign(STATE.toggles, d.toggles);
            if (d.landlordProfile) Object.assign(LANDLORD_USER, d.landlordProfile);
            if (d.preferences) Object.entries(d.preferences).forEach(([k, v]) => { if (PREF_OPTIONS[k]) PREF_OPTIONS[k].current = v; });
            if (typeof syncConversationsFromStore === 'function') syncConversationsFromStore();
            if (typeof initMaintenanceHistory === 'function') initMaintenanceHistory();
            if (typeof syncSmartReminders === 'function') syncSmartReminders(false);
            if (typeof syncSharedDocToTenants === 'function' && this.documents) {
                this.documents.filter(d => d.shared).forEach(syncSharedDocToTenants);
            }
            migrateInventoryKeys();
            if (!this.broadcasts?.length) {
                this.broadcasts = [
                    { id: 0, propertyId: 0, title: 'Boiler service next week', body: 'Heating Co. will access units on Mon 28 Jul, 9–11am. Please ensure someone is home or leave a key with reception.', date: 'Jul 22, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [], image: IMG.maint[2] },
                    { id: 1, propertyId: 0, title: 'Rubbish collection change', body: 'Bins go out on Thursday instead of Wednesday for the rest of July.', date: 'Jul 18, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [] },
                    { id: 2, propertyId: 1, title: 'Garden maintenance', body: 'Shared garden will be serviced Fri 25 Jul. Please keep the gate unlocked.', date: 'Jul 15, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [], image: IMG.interior[1] },
                ];
            }
        } catch (_) { this.seed(); }
    },
    save() {
        if (typeof syncConversationsToStore === 'function') syncConversationsToStore();
        sessionStorage.setItem('lhq_app', JSON.stringify({
            properties: PROPERTIES,
            invoices: INVOICES,
            maintenance: MAINTENANCE_ITEMS,
            reminders: this.reminders,
            documents: this.documents,
            tenancies: this.tenancies,
            inspections: this.inspections,
            contractorInvoices: this.contractorInvoices,
            contractorJobs: this.contractorJobs,
            propertyMeta: this.propertyMeta,
            tenantNotes: this.tenantNotes,
            checkoutRecords: this.checkoutRecords,
            inventory: this.inventory,
            paymentMethods: this.paymentMethods,
            complianceCerts: this.complianceCerts,
            certHistory: this.certHistory,
            tenantDocuments: this.tenantDocuments,
            tenantReferencing: this.tenantReferencing,
            tenantCheckout: this.tenantCheckout,
            conversations: this.conversations,
            broadcasts: this.broadcasts,
            tenantList: TENANT_LIST,
            tenants: TENANTS,
            notifications: NOTIFICATIONS,
            tenantNotifications: this.tenantNotifications || {},
            toggles: STATE.toggles,
            landlordProfile: LANDLORD_USER,
            preferences: Object.fromEntries(Object.entries(PREF_OPTIONS).map(([k, v]) => [k, v.current])),
        }));
    },
    seed() {
        this.reminders = [
            { id: 0, type: 'gas', propertyId: 0, title: 'Gas Certificate Expiry', due: '2026-03-12', daysLeft: 3, urgency: 'high' },
            { id: 1, type: 'inspection', propertyId: 1, title: 'Inspection Due', due: '2026-08-15', daysLeft: 16, urgency: 'medium' },
            { id: 2, type: 'rent-review', propertyId: 2, title: 'Rent Review', due: '2026-09-01', daysLeft: 33, urgency: 'medium' },
            { id: 3, type: 'electrical', propertyId: 0, title: 'Electrical Certificate Expiry', due: '2026-08-15', daysLeft: 16, urgency: 'medium' },
            { id: 4, type: 'leasehold', propertyId: 0, title: 'Leasehold Service Charge', due: '2026-12-01', daysLeft: 124, urgency: 'low' },
        ];
        this.documents = [
            { id: 0, propertyId: 0, type: 'Tenancy Agreement', name: 'Lease Agreement.pdf', date: 'Jan 15, 2024', shared: true, signed: true },
            { id: 1, propertyId: 0, type: 'Gas Certificate', name: 'Gas Certificate 2029', date: 'Mar 2029', shared: true, signed: false },
            { id: 6, propertyId: 0, type: 'Gas Certificate', name: 'Gas Certificate 2028', date: 'Mar 2028', shared: true, signed: false },
            { id: 7, propertyId: 0, type: 'Gas Certificate', name: 'Gas Certificate 2027', date: 'Mar 2027', shared: true, signed: false },
            { id: 8, propertyId: 0, type: 'Gas Certificate', name: 'Gas Certificate 2026', date: 'Mar 2026', shared: true, signed: false },
            { id: 9, propertyId: 0, type: 'Gas Certificate', name: 'Gas Certificate 2025', date: 'Mar 2025', shared: true, signed: false },
            { id: 2, propertyId: 0, type: 'Electrical Certificate', name: 'EICR Report 2024', date: 'Apr 2024', shared: true, signed: false },
            { id: 10, propertyId: 0, type: 'Electrical Certificate', name: 'EICR Report 2023', date: 'Apr 2023', shared: true, signed: false },
            { id: 11, propertyId: 0, type: 'Electrical Certificate', name: 'EICR Report 2022', date: 'Apr 2022', shared: true, signed: false },
            { id: 3, propertyId: 0, type: 'EPC Certificate', name: 'EPC Rating B', date: 'Jun 2023', shared: true, signed: false },
            { id: 12, propertyId: 0, type: 'EPC Certificate', name: 'EPC Rating B (renewal)', date: 'Jun 2020', shared: true, signed: false },
            { id: 13, propertyId: 0, type: 'Custom Document', name: 'Fire Risk Assessment 2025', date: 'Jan 2025', shared: true, signed: false },
            { id: 14, propertyId: 0, type: 'Custom Document', name: 'Smoke Alarm Test Log', date: 'Feb 2025', shared: true, signed: false },
            { id: 15, propertyId: 0, type: 'Custom Document', name: 'Fire Door Inspection', date: 'Mar 2025', shared: true, signed: false },
            { id: 16, propertyId: 0, type: 'Custom Document', name: 'Emergency Lighting Check', date: 'Apr 2025', shared: true, signed: false },
            { id: 17, propertyId: 0, type: 'Custom Document', name: 'Landlord Insurance Policy', date: 'Jan 2025', shared: false, signed: false },
            { id: 4, propertyId: 0, type: 'Deposit Certificate', name: 'Deposit Protection.pdf', date: 'Jan 2024', shared: true, signed: true },
            { id: 5, propertyId: 1, type: 'How to Rent Guide', name: 'How to Rent.pdf', date: 'Jun 2023', shared: true, signed: false },
        ];
        this.tenancies = [
            { id: 0, propertyId: 0, tenantId: 0, type: 'solo', unit: 'Flat 2A', rent: '£2,450', start: '2024-01-15', end: '2027-01-14', status: 'active' },
            { id: 1, propertyId: 1, tenantId: 1, type: 'solo', unit: 'Flat 1A', rent: '£1,850', start: '2023-06-01', end: '2027-05-31', status: 'active' },
            { id: 2, propertyId: 3, tenantId: 2, type: 'solo', unit: 'Flat 2A', rent: '£1,950', start: '2024-03-10', end: '2027-03-09', status: 'active' },
            { id: 3, propertyId: 0, tenantId: 4, type: 'group', unit: 'Flat 2B', rent: '£2,200', start: '2024-06-01', end: '2027-05-31', status: 'active', occupants: 3, leadName: 'Priya Sharma', members: [
                { name: 'Priya Sharma', email: 'priya.sh@email.com', phone: '+44 7700 900501', tenantId: 4, status: 'active', role: 'lead' },
                { name: 'James Chen', email: 'james.chen@email.com', phone: '+44 7700 900503', tenantId: 5, status: 'pending', role: 'member' },
                { name: 'Aisha Khan', email: 'aisha.k@email.com', phone: '+44 7700 900504', status: 'no-account', role: 'member' },
            ]},
        ];
        this.inspections = [
            { id: 0, propertyId: 0, type: 'Check-in', date: '2024-01-15', rating: '4.8', photos: 6, photoUrls: IMG.interior.slice(0, 3), notes: 'Property in excellent condition at move-in. Minor scuff on hallway skirting noted.', report: 'Check-in report.pdf' },
            { id: 1, propertyId: 0, type: 'Annual', date: '2023-01-10', rating: '4.5', photos: 8, photoUrls: IMG.interior.slice(1, 4), notes: 'Annual check complete. Kitchen extractor filter replaced.', report: 'Annual 2023.pdf' },
            { id: 2, propertyId: 1, type: 'Mid-term', date: '2026-08-15', rating: null, photos: 0, report: null, scheduled: true, notes: 'Tenant requested afternoon slot. Parking on street.' },
        ];
        this.complianceCerts = {
            '0-0': { certNumber: 'GS-2026-001', issueDate: '2025-03-15', expiryDate: '2026-03-15', issuedBy: 'SafeGas Ltd' },
            '0-1': { certNumber: 'EICR-8821', issueDate: '2025-08-15', expiryDate: '2026-08-15', issuedBy: 'Spark Electrical' },
            '0-7': { certNumber: 'EPC-B-4421', issueDate: '2022-06-15', expiryDate: '2027-06-15', issuedBy: 'Green Assessors', notes: 'Rating B' },
            '1-0': { certNumber: 'GS-2025-114', issueDate: '2024-11-01', expiryDate: '2025-11-01', issuedBy: 'HeatSafe' },
        };
        this.certHistory = {};
        this.inventory = {
            '0-kitchen-0': {
                condition: 'Good',
                notes: 'Minor wear on worktop near sink.',
                items: [['Oven / hob', 'Good'], ['Fridge freezer', 'Good'], ['Microwave', 'Good'], ['Extractor fan', 'Fair'], ['Worktops', 'Good']],
                photos: IMG.interior.slice(0, 2),
            },
            '0-reception-0': {
                condition: 'Good',
                notes: 'Sofa in good condition.',
                items: [['Sofa', 'Good'], ['Coffee table', 'Good'], ['Curtains / blinds', 'Good'], ['Flooring', 'Good'], ['Radiator', 'Good']],
                photos: [IMG.interior[2]],
            },
            '0-bedroom-0': {
                condition: 'Fair',
                notes: 'Carpet showing light wear in corner.',
                items: [['Bed frame', 'Good'], ['Mattress', 'Fair'], ['Wardrobe', 'Good'], ['Curtains / blinds', 'Good'], ['Radiator', 'Good']],
                photos: IMG.interior.slice(3, 5),
            },
            '0-bedroom-1': {
                condition: 'Good',
                notes: 'Second bedroom — used as home office.',
                items: [['Bed frame', 'Good'], ['Mattress', 'Good'], ['Wardrobe', 'Good'], ['Curtains / blinds', 'Good'], ['Radiator', 'Good']],
                photos: [],
            },
            '0-bathroom-0': {
                condition: 'Good',
                notes: '',
                items: [['Bath / shower', 'Good'], ['Toilet', 'Good'], ['Basin', 'Good'], ['Tiles / grouting', 'Good'], ['Extractor fan', 'Good']],
                photos: [],
            },
            '0-hallway-0': {
                condition: 'Good',
                notes: 'Smoke alarm tested Jan 2025.',
                items: [['Smoke alarm', 'Good'], ['CO alarm', 'Good'], ['Flooring', 'Good'], ['Doors', 'Good'], ['Lighting', 'Good']],
                photos: [],
            },
        };
        this.contractorInvoices = [
            { id: 0, contractor: 'Plumber Pro', job: 'Kitchen sink leaking', amount: '£185', status: 'Unpaid', propertyId: 0, maintId: 0 },
            { id: 1, contractor: 'Heating Co.', job: 'Boiler service', amount: '£220', status: 'Paid', propertyId: 1, maintId: 3 },
            { id: 2, contractor: 'Plumber Pro', job: 'Tap replacement', amount: '£185', status: 'Unpaid', propertyId: 0, maintId: 6 },
        ];
        this.propertyMeta = {};
        this.tenantNotes = {
            0: [
                { id: 0, text: 'Tenant prefers email for non-urgent matters. Very responsive on WhatsApp.', meta: 'Mar 5, 2025 · You', bg: '#FFFBEB', color: '#D97706' },
                { id: 1, text: 'Requested early inspection before lease renewal discussion.', meta: 'Feb 12, 2025 · You', bg: '#EFF6FF', color: '#2563EB' },
            ],
            1: [{ id: 0, text: 'Always pays rent on time. Prefers phone calls.', meta: 'Jan 20, 2025 · You', bg: '#ECFDF5', color: '#059669' }],
            2: [],
            3: [],
        };
        this.paymentMethods = [
            { id: 0, type: 'Visa', last4: '4242', exp: '08/27', name: 'John Smith', default: true },
            { id: 1, type: 'Barclays', last4: '8901', exp: '—', name: 'Rent Collection', default: false },
        ];
        this.tenantReferencing = {
            0: {
                passport: { status: 'verified', file: 'Passport_Sarah_J.pdf', date: 'Jan 8, 2024' },
                rightToRent: { status: 'verified', shareCode: 'WXY9 8K2L', expiry: 'Jan 2027' },
                proofOfAddress: { status: 'verified', file: 'Utility_Bill_Jan2024.pdf', date: 'Jan 9, 2024' },
                proofOfIncome: { status: 'verified', file: 'Payslip_Dec2023.pdf', date: 'Jan 8, 2024' },
                employment: { status: 'complete', employer: 'Tech Solutions Ltd', role: 'Product Designer', salary: '£52,000', startDate: '2021-03-01', contact: 'hr@techsolutions.co.uk' },
                previousLandlord: { status: 'complete', name: 'Mrs Helen Price', phone: '+44 7700 900111', email: 'h.price@email.com', address: '8 Elm Court, London', tenancyDates: '2019–2023' },
                guarantor: { status: 'not_required', name: '', phone: '', email: '', relationship: '' },
            },
        };
        this.tenantCheckout = {
            0: {
                checklist: { kitchen: false, bathroom: false, bedroom: false, living: false, keys: false },
                meters: { electricity: '', gas: '', water: '' },
                photos: [],
                depositStatus: 'protected',
                depositScheme: 'MyDeposits',
                depositAmount: '£2,450',
            },
        };
        this.tenantDocuments = {
            0: [
                ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                ['file-image', 'NID Proof.jpg', 'Jan 10, 2024', '#7C3AED'],
                ['file-text', 'Gas Safety 2025.pdf', 'Mar 2025', '#DC2626'],
                ['file-text', 'EICR Report.pdf', 'Apr 2024', '#D97706'],
                ['file-text', 'Deposit Protection.pdf', 'Jan 2024', '#059669'],
            ],
            1: [
                ['file-text', 'Lease Agreement.pdf', 'Jun 1, 2023', '#2563EB'],
                ['file-image', 'NID Proof.jpg', 'May 28, 2023', '#7C3AED'],
            ],
            2: [], 3: [],
        };
        this.broadcasts = [
            { id: 0, propertyId: 0, title: 'Boiler service next week', body: 'Heating Co. will access units on Mon 28 Jul, 9–11am. Please ensure someone is home or leave a key with reception.', date: 'Jul 22, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [], image: IMG.maint[2] },
            { id: 1, propertyId: 0, title: 'Rubbish collection change', body: 'Bins go out on Thursday instead of Wednesday for the rest of July.', date: 'Jul 18, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [] },
            { id: 2, propertyId: 1, title: 'Garden maintenance', body: 'Shared garden will be serviced Fri 25 Jul. Please keep the gate unlocked.', date: 'Jul 15, 2026', from: 'John Smith', scope: 'all', units: [], readBy: [], image: IMG.interior[1] },
        ];
        this.tenantNotifications = {};
        PROPERTIES.forEach(p => {
            if (!this.propertyMeta[p.id]) {
                const isSingle = p.id === 2;
                const flatRent = p.rent || '£950';
                const built = isSingle
                    ? buildPropertyFlats({ flatCount: 1, defaultRent: flatRent })
                    : buildPropertyFlats({ flatCount: 4, floors: 2, flatsPerFloor: 2, defaultRent: flatRent });
                this.propertyMeta[p.id] = {
                    building: built.building,
                    units: built.units,
                    photos: [IMG.props[p.id], ...IMG.interior.slice(0, 2)],
                    alarms: {
                        smoke: { expiry: '2026-01-15', lastCheck: 'Jan 2025', location: 'Hallway' },
                        heat: { expiry: '2026-01-15', lastCheck: 'Jan 2025', location: 'Kitchen' },
                        co: { expiry: '2026-01-15', lastCheck: 'Jan 2025', location: 'Bedroom' },
                    },
                    appliances: [
                        { name: 'Boiler', brand: 'Worcester Bosch', condition: 'Good', lastService: 'Mar 2024' },
                        { name: 'Oven', brand: 'Bosch', condition: 'Good', lastService: '—' },
                        { name: 'Fridge', brand: 'Samsung', condition: 'Fair', lastService: '—' },
                    ],
                    utilities: { gas: 'British Gas', electric: 'Octopus Energy', water: 'Thames Water', broadband: 'BT Fibre', councilTax: 'Band D' },
                    parking: { spaces: 1, type: 'Off-street', permit: 'LB-4421', notes: 'Allocated bay #12' },
                    info: {
                        type: 'Semi-detached', built: '1985', epc: 'Rating B', epcExpiry: '2027-06-15',
                        insuranceExpiry: '2025-06-30', mortgageRenewal: '2025-12-01',
                        councilTax: 'Band D', notes: '',
                    },
                };
            }
        });
        if (this.propertyMeta[0] && !this.propertyMeta[0].inventoryLayout) {
            this.propertyMeta[0].inventoryLayout = { bedrooms: 2, bathrooms: 1, kitchens: 1, reception: 1 };
        }
        this.save();
    },
    meta(pid) {
        if (!this.propertyMeta[pid]) {
            this.propertyMeta[pid] = {
                photos: [IMG.props[pid]], alarms: {}, appliances: [],
                utilities: {}, parking: {}, info: { type: '—', built: '—', epc: '—', councilTax: '—', notes: '' },
            };
        }
        if (!this.propertyMeta[pid].info) {
            this.propertyMeta[pid].info = { type: 'Semi-detached', built: '1985', epc: 'Rating B', councilTax: 'Band D', notes: '' };
        }
        if (!Array.isArray(this.propertyMeta[pid].appliances)) this.propertyMeta[pid].appliances = [];
        if (!this.propertyMeta[pid].alarms) this.propertyMeta[pid].alarms = {};
        if (!Array.isArray(this.propertyMeta[pid].customAlarms)) this.propertyMeta[pid].customAlarms = [];
        if (!this.propertyMeta[pid].utilities) this.propertyMeta[pid].utilities = {};
        if (!this.propertyMeta[pid].parking) this.propertyMeta[pid].parking = {};
        if (!Array.isArray(this.propertyMeta[pid].photos)) this.propertyMeta[pid].photos = [IMG.props[pid]];
        if (!Array.isArray(this.propertyMeta[pid].floorPlans)) this.propertyMeta[pid].floorPlans = [];
        migrateUtilityKeys(this.propertyMeta[pid]);
        return this.propertyMeta[pid];
    },
    docsForProperty(pid) { return this.documents.filter(d => d.propertyId === pid); },
    remindersForProperty(pid) { return this.reminders.filter(r => r.propertyId === pid); },
    nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 0; },
};

Object.assign(STATE, {
    confirm: null,
    loading: false,
    formErrors: {},
    shareDocId: null,
    assignMaintId: null,
    chatDraft: '',
    groupMemberCount: 1,
    tenantMaintFilter: 'all',
    previewDocId: null,
    previewDocIdx: 0,
    previewDocSource: 'property',
    logMaintPhotos: [],
    logMaintVideos: [],
    logMaintCategoryId: '',
    tenantRefKey: '',
    inspectionPhotos: [],
    invitePrefill: null,
    pendingPropertyPhotos: [],
    pendingPropertyCover: 0,
    addPropertyUnitMode: 'single',
    pendingFlatPhotos: [],
    pendingFlatCover: 0,
    addDocumentOpen: false,
    addDocumentStep: 'type',
    addDocumentType: null,
    addDocumentFile: null,
    addDocumentDisplayName: '',
    addDocumentShare: false,
    addDocumentReplaceId: null,
    addDocumentFolderId: null,
    addDocumentUnit: null,
    addDocumentTenantId: null,
    addDocumentSkipType: false,
    editingInventoryLayout: false,
    inventoryEditItems: null,
    chatMessageMenuId: null,
    chatOptionsOpen: false,
    chatMembersOpen: false,
    broadcastId: 0,
    broadcastDraftImage: null,
    contractorTradeFilter: 'all',
});

function pickImageFiles({ multiple = true, accept = 'image/*' } = {}) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        if (multiple) input.multiple = true;
        input.style.cssText = 'position:fixed;left:-9999px;opacity:0;pointer-events:none';
        const finish = (urls) => { input.remove(); resolve(urls); };
        input.addEventListener('change', async () => {
            const files = Array.from(input.files || []).filter(f => (f.type || '').startsWith('image/'));
            if (!files.length) { finish([]); return; }
            try {
                finish(await Promise.all(files.map(readFileAsDataUrl)));
            } catch {
                toast('Could not read selected photos');
                finish([]);
            }
        });
        document.body.appendChild(input);
        input.click();
    });
}

function pickMaintMediaFiles() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.multiple = true;
        input.style.cssText = 'position:fixed;left:-9999px;opacity:0;pointer-events:none';
        const finish = (result) => { input.remove(); resolve(result); };
        input.addEventListener('change', async () => {
            const files = Array.from(input.files || []);
            const images = files.filter(f => (f.type || '').startsWith('image/'));
            const videos = files.filter(f => (f.type || '').startsWith('video/'));
            if (!images.length && !videos.length) { finish({ images: [], videos: [] }); return; }
            try {
                finish({
                    images: images.length ? await Promise.all(images.map(readFileAsDataUrl)) : [],
                    videos: videos.length ? await Promise.all(videos.map(readFileAsDataUrl)) : [],
                });
            } catch {
                toast('Could not read selected files');
                finish({ images: [], videos: [] });
            }
        });
        input.addEventListener('cancel', () => finish({ images: [], videos: [] }));
        document.body.appendChild(input);
        input.click();
    });
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function pickDocumentFiles({ multiple = true } = {}) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png,image/*,application/pdf';
        if (multiple) input.multiple = true;
        input.style.cssText = 'position:fixed;left:-9999px;opacity:0;pointer-events:none';
        const finish = (files) => { input.remove(); resolve(files); };
        input.addEventListener('change', async () => {
            const picked = Array.from(input.files || []);
            if (!picked.length) { finish([]); return; }
            try {
                const files = await Promise.all(picked.map(async (file) => ({
                    name: file.name,
                    url: await readFileAsDataUrl(file),
                    mime: file.type || '',
                })));
                finish(files);
            } catch {
                toast('Could not read selected files');
                finish([]);
            }
        });
        document.body.appendChild(input);
        input.click();
    });
}

function formatDocUploadDate(date = new Date()) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isUserUploadedDoc(doc) {
    return !!doc?.userUpload;
}

function docIconForName(name) {
    const ext = String(name).split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'file-text';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
    return 'file';
}

/** Upload rows: typed uploads use category icon; other uploads use file-type icon. */
function documentRowVisual(doc) {
    if (isUserUploadedDoc(doc) && doc.type && doc.type !== 'Custom Document') {
        const type = doc.type;
        return {
            icon: DOC_TYPE_ICONS[type] || 'file',
            color: DOC_TYPE_COLORS[type] || '#64748B',
            bg: docTypeIconBg(type),
        };
    }
    if (isUserUploadedDoc(doc)) {
        if (isDocImage(doc)) return { icon: 'image', color: '#2563EB', bg: '#EFF6FF' };
        if (docFileKindLabel(doc) === 'PDF') return { icon: 'file-text', color: '#DC2626', bg: '#FEE2E2' };
        return { icon: 'file', color: '#64748B', bg: '#F1F5F9' };
    }
    const type = doc.type || 'Custom Document';
    return {
        icon: DOC_TYPE_ICONS[type] || 'file',
        color: DOC_TYPE_COLORS[type] || '#64748B',
        bg: docTypeIconBg(type),
    };
}

function docTypeIconBg(type) {
    const map = {
        'Tenancy Agreement': '#EFF6FF', 'Deposit Certificate': '#DCFCE7', 'Gas Certificate': '#FEE2E2',
        'Electrical Certificate': '#FEF3C7', 'EPC Certificate': '#ECFDF5', 'How to Rent Guide': '#F3E8FF',
        'Signed Document': '#DCFCE7', 'Custom Document': '#F1F5F9',
    };
    return map[type] || '#F8FAFC';
}

function docFileKindLabel(doc) {
    if (!doc) return 'File';
    if (doc.mime?.includes('pdf')) return 'PDF';
    if (doc.mime?.startsWith('image/')) return 'Image';
    const ext = String(doc.name || '').split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'Image';
    return 'File';
}

function isDocImage(doc) {
    if (doc?.mime?.startsWith('image/')) return true;
    const ext = String(doc.name || '').split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
}

function formatDocDisplayDate(doc) {
    if (doc?.uploadedAt) {
        const ms = Date.now() - doc.uploadedAt;
        if (ms < 60000) return 'Just now';
        const mins = Math.floor(ms / 60000);
        if (mins < 60) return mins === 1 ? '1 min ago' : `${mins} min ago`;
        const hrs = Math.floor(ms / 3600000);
        if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
        const days = Math.floor(ms / 86400000);
        if (days < 7) return days === 1 ? 'Yesterday' : `${days} days ago`;
        return doc.date || formatDocUploadDate(new Date(doc.uploadedAt));
    }
    return doc?.date || '—';
}

/** Upload: type · date. Seed: type · date (+ shared). */
function documentRowSubtitle(doc) {
    if (isUserUploadedDoc(doc)) {
        const label = doc.type === 'Custom Document' ? docFileKindLabel(doc) : (doc.type || 'Document');
        let sub = `${label} · ${formatDocDisplayDate(doc)}`;
        if (doc.shared) sub += ' · Shared with tenant';
        return sub;
    }
    let sub = `${doc.type || 'Document'} · ${doc.date || '—'}`;
    if (doc.shared) sub += ' · Shared with tenant';
    return sub;
}

function sortPropertyDocuments(docs) {
    return docs.slice().sort((a, b) => {
        const aUpload = isUserUploadedDoc(a);
        const bUpload = isUserUploadedDoc(b);
        if (aUpload && bUpload) return (b.uploadedAt || 0) - (a.uploadedAt || 0);
        if (aUpload !== bUpload) return aUpload ? -1 : 1;
        const ta = DOC_TYPE_SORT[a.type] ?? 99;
        const tb = DOC_TYPE_SORT[b.type] ?? 99;
        if (ta !== tb) return ta - tb;
        return (a.name || '').localeCompare(b.name || '');
    });
}

function maintRefId(id) {
    return `#MNT-${String(id).padStart(5, '0')}`;
}

function maintPriorityTone(priority) {
    const p = String(priority || '').toLowerCase();
    if (p === 'high') return { label: 'Urgent', cls: 'maint-priority-pill--urgent' };
    if (p === 'medium') return { label: 'Medium', cls: 'maint-priority-pill--medium' };
    return { label: priority || 'Low', cls: 'maint-priority-pill--low' };
}

function maintStatusTone(status) {
    const key = String(status || 'open').toLowerCase();
    if (key === 'done' || key === 'completed') {
        return { label: 'Completed', cls: 'maint-work-status-pill--done' };
    }
    if (key === 'progress' || key === 'in progress') {
        return { label: 'In progress', cls: 'maint-work-status-pill--progress' };
    }
    return { label: 'Open', cls: 'maint-work-status-pill--open' };
}

function maintIssuePhoto(m) {
    if (m?.photos?.length) return m.photos[0];
    if (m?.propertyId != null && typeof getPropertyCoverPhoto === 'function') return getPropertyCoverPhoto(m.propertyId);
    if (typeof IMG !== 'undefined' && IMG.maint?.length) return IMG.maint[m.id % IMG.maint.length];
    return IMG.interior?.[0] || IMG.fallback;
}

function getMaintReportPhotos(source) {
    return source?.photos || source?.reportPhotos || [];
}

function getMaintReportVideos(source) {
    return source?.videos || source?.reportVideos || [];
}

function normalizeMaintVideo(video, index) {
    if (typeof video === 'string') return { url: video, name: `Video ${index + 1}`, poster: null };
    return {
        url: video?.url || '',
        name: video?.name || `Video ${index + 1}`,
        poster: video?.poster || null,
        demo: !!video?.demo,
    };
}

function maintReportMediaCount(source) {
    return getMaintReportPhotos(source).length + getMaintReportVideos(source).length;
}

function syncMaintMediaToContractorJob(job, item) {
    if (!job || !item) return job;
    job.reportPhotos = [...getMaintReportPhotos(item)];
    job.reportVideos = [...getMaintReportVideos(item)];
    job.reportedBy = item.reportedBy || (item.tenantName ? 'tenant' : 'landlord');
    return job;
}

function renderMaintReportMedia(source, opts = {}) {
    const photos = getMaintReportPhotos(source);
    const videos = getMaintReportVideos(source).map(normalizeMaintVideo);
    if (!photos.length && !videos.length) return '';
    const title = opts.title || 'Photos & videos from report';
    const compact = !!opts.compact;
    return `
    <div class="maint-report-media${compact ? ' maint-report-media--compact' : ''}">
        <div class="maint-report-media-head">
            <p class="maint-report-media-label">${title}</p>
            <span class="maint-report-media-count">${photos.length + videos.length} file${photos.length + videos.length === 1 ? '' : 's'}</span>
        </div>
        ${photos.length ? `
        <div class="maint-report-photo-grid">
            ${photos.map((src, i) => `
            <button type="button" class="maint-report-media-thumb" data-action="preview-maint-media" data-kind="photo" data-src="${String(src).replace(/"/g, '&quot;')}">
                <img src="${src}" alt="Report photo ${i + 1}">
            </button>`).join('')}
        </div>` : ''}
        ${videos.length ? `
        <div class="maint-report-video-list">
            ${videos.map((video, i) => `
            <button type="button" class="maint-report-video-item" data-action="preview-maint-media" data-kind="video" data-src="${String(video.url || '').replace(/"/g, '&quot;')}" data-poster="${String(video.poster || photos[0] || '').replace(/"/g, '&quot;')}" data-name="${String(video.name).replace(/"/g, '&quot;')}">
                <span class="maint-report-video-poster"${video.poster || photos[0] ? ` style="background-image:url('${video.poster || photos[0]}')"` : ''}>
                    <i data-lucide="play-circle" class="w-7 h-7"></i>
                </span>
                <span class="maint-report-video-copy">
                    <span class="maint-report-video-name">${escapeHtml(video.name)}</span>
                    <span class="maint-report-video-meta">Video attachment</span>
                </span>
            </button>`).join('')}
        </div>` : ''}
    </div>`;
}

function renderContractorWorkMedia(job, opts = {}) {
    if (!job?.photos) return '';
    const groups = [
        ['Before', job.photos.before || []],
        ['During', job.photos.during || []],
        ['After', job.photos.after || []],
    ].filter(([, list]) => list.length);
    if (!groups.length) return '';
    const title = opts.title || 'Contractor work photos';
    return `
    <div class="maint-report-media maint-report-media--work">
        <div class="maint-report-media-head">
            <p class="maint-report-media-label">${title}</p>
            <span class="maint-report-media-count">${groups.reduce((n, [, list]) => n + list.length, 0)} photos</span>
        </div>
        ${groups.map(([label, list]) => `
        <div class="maint-work-photo-group">
            <p class="maint-work-photo-label">${label}</p>
            <div class="maint-report-photo-grid">
                ${list.map((src, i) => `
                <button type="button" class="maint-report-media-thumb" data-action="preview-maint-media" data-kind="photo" data-src="${String(src).replace(/"/g, '&quot;')}">
                    <img src="${src}" alt="${label} photo ${i + 1}">
                </button>`).join('')}
            </div>
        </div>`).join('')}
    </div>`;
}

function renderMaintMediaPreviewModal() {
    const preview = STATE.maintMediaPreview;
    if (!preview) return '';
    return `
    <div class="modal-overlay" data-action="close-maint-media-preview">
        <div class="maint-media-preview-modal" onclick="event.stopPropagation()">
            <button type="button" data-action="close-maint-media-preview" class="maint-media-preview-close"><i data-lucide="x" class="w-5 h-5"></i></button>
            ${preview.kind === 'video' ? `
            <div class="maint-media-preview-video-wrap">
                ${preview.src
                    ? `<video src="${preview.src}" controls playsinline class="maint-media-preview-video"></video>`
                    : `<div class="maint-media-preview-demo">
                        <img src="${preview.poster || IMG.maint[0]}" alt="">
                        <p class="maint-media-preview-demo-label"><i data-lucide="play-circle" class="w-6 h-6"></i>${escapeHtml(preview.name || 'Video clip')}</p>
                        <p class="maint-media-preview-demo-sub">Demo video attachment from tenant report</p>
                    </div>`}
            </div>` : `<img src="${preview.src}" alt="Maintenance media" class="maint-media-preview-image">`}
            ${preview.name ? `<p class="maint-media-preview-name">${escapeHtml(preview.name)}</p>` : ''}
        </div>
    </div>`;
}

function openMaintMediaPreview(el) {
    const kind = el.dataset.kind || 'photo';
    const src = el.dataset.src || '';
    const poster = el.dataset.poster || '';
    const name = el.dataset.name || '';
    STATE.maintMediaPreview = { kind, src: src || null, poster, name };
    render();
}

function closeMaintMediaPreview() {
    STATE.maintMediaPreview = null;
    render();
}


function propertyPrimaryTenant(propertyId) {
    const entries = propertyTenantEntries(propertyId);
    const active = entries.find(e => e.kind === 'tenant' && e.tenant.status === 'active');
    if (active) return { name: active.tenant.name, unit: active.tenant.unit, tid: active.tenant.id, img: active.tenant.img };
    const member = entries.find(e => e.kind === 'member' && e.member.accountStatus === 'active');
    if (member) return { name: member.member.name, unit: member.unit, tid: member.member.listId, img: null };
    const pending = entries.find(e => e.kind === 'tenant' && e.tenant.status === 'pending');
    if (pending) return { name: pending.tenant.name, unit: pending.tenant.unit, tid: pending.tenant.id, img: pending.tenant.img, pending: true };
    return null;
}

function renderTenantLivingCard(listItem) {
    const pid = listItem.propertyId;
    const p = PROPERTIES[pid];
    if (!p || !listItem.unit) return '';
    const cover = typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(pid) : IMG.props[pid];
    const unit = getPropertyUnits(pid).find(u => unitName(u) === listItem.unit);
    const specs = unit ? [
        unit.sqft ? `${unit.sqft} sq ft` : null,
        unit.beds ? `${unit.beds} bed${unit.beds > 1 ? 's' : ''}` : null,
        unit.baths ? `${unit.baths} bath${unit.baths > 1 ? 's' : ''}` : null,
    ].filter(Boolean) : [];
    return `
    <div class="tenant-living-card card">
        <div class="tenant-living-head">
            <p class="tenant-living-label">Currently living in</p>
            <button type="button" data-go="flat-detail" data-pid="${pid}" data-unit="${listItem.unit}" class="tenant-living-link">View unit</button>
        </div>
        <button type="button" data-go="flat-detail" data-pid="${pid}" data-unit="${listItem.unit}" class="tenant-living-main w-full text-left">
            <img src="${cover}" alt="" class="tenant-living-thumb">
            <div class="tenant-living-body min-w-0">
                <p class="tenant-living-name">${escapeHtml(p.name)}</p>
                <p class="tenant-living-unit">Unit: ${escapeHtml(listItem.unit)}</p>
                <p class="tenant-living-addr">${escapeHtml(p.address)}</p>
            </div>
        </button>
        ${specs.length ? `
        <div class="tenant-living-specs">
            ${specs.map((s, i) => `
            ${i ? '<span class="tenant-living-spec-divider"></span>' : ''}
            <span class="tenant-living-spec">${escapeHtml(s)}</span>`).join('')}
        </div>` : ''}
    </div>`;
}

function renderTenantTenancyDetailsCard(listItem, tenancy, fin, t) {
    const leaseEndLabel = fin?.leaseEnd && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.leaseEnd) || fin.leaseEnd
        : (t?.leaseEnd || '—');
    const moveIn = fin?.moveIn && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.moveIn) || '—'
        : '—';
    const rent = typeof formatTenantRent === 'function' ? formatTenantRent(t?.rent) : (listItem?.rent || '—');
    const typeLabel = tenancy ? (tenancy.type === 'group' ? 'Group' : 'Solo') : '—';
    const stats = [
        ['Tenancy', typeLabel],
        ['Monthly rent', rent],
        ['Move-in', moveIn],
        ['Lease ends', leaseEndLabel],
        ['Deposit held', fin?.deposit || '—'],
        ['Advance paid', fin?.advancePaid || '—'],
    ].filter(([label, val]) => val !== '—' || ['Tenancy', 'Monthly rent', 'Deposit held', 'Advance paid'].includes(label));
    if (!stats.length) return '';
    return `
    <div class="card tenant-tenancy-summary">
        <div class="tenant-tenancy-summary-head">
            <h3 class="tenant-tenancy-summary-title">Lease summary</h3>
            ${typeLabel !== '—' ? `<span class="tenant-tenancy-type-pill">${escapeHtml(typeLabel)}</span>` : ''}
        </div>
        <div class="tenant-tenancy-summary-grid">
            ${stats.map(([label, value]) => `
            <div class="tenant-tenancy-summary-item${label === 'Monthly rent' ? ' tenant-tenancy-summary-item--rent' : ''}">
                <span class="tenant-tenancy-summary-label">${escapeHtml(label)}</span>
                <span class="tenant-tenancy-summary-value">${escapeHtml(value)}</span>
            </div>`).join('')}
        </div>
    </div>`;
}

function renderTenantDocThumbGrid(docs, tenantId) {
    if (!docs.length) return '';
    return `
    <div class="tenant-doc-grid">
        ${docs.map(([ic, name, date, color], idx) => `
        <button type="button" data-go="document-preview" data-preview-source="tenant" data-preview-idx="${idx}" data-tid="${tenantId}" class="tenant-doc-thumb">
            <span class="tenant-doc-thumb-preview" style="color:${color};background:${color}14">
                <i data-lucide="${ic}" class="w-6 h-6"></i>
                <span class="tenant-doc-thumb-view"><i data-lucide="eye" class="w-3.5 h-3.5"></i></span>
            </span>
            <span class="tenant-doc-thumb-label">${escapeHtml(name.replace(/\.[^.]+$/, ''))}</span>
            <span class="tenant-doc-thumb-date">${escapeHtml(date)}</span>
        </button>`).join('')}
    </div>`;
}

function renderContactOutlineRow(items) {
    return `<div class="contact-outline-row">${items.map(([ic, label, attrs]) => `
        <button type="button" ${attrs} class="contact-outline-btn">
            <i data-lucide="${ic}" class="w-4 h-4"></i><span>${label}</span>
        </button>`).join('')}
    </div>`;
}

function formatMoneyField(val) {
    if (!val && val !== 0) return '—';
    if (typeof val === 'string' && val.trim().startsWith('£')) return val.trim();
    const n = typeof val === 'number' ? val : parseRentAmount(val);
    return n ? formatRentAmount(n) : '—';
}

function getTenantFinancials(tenantId) {
    const t = TENANTS[tenantId];
    const listItem = TENANT_LIST[tenantId];
    const tenancy = listItem && typeof getTenancyForTenantListItem === 'function'
        ? getTenancyForTenantListItem(listItem)
        : null;
    const deposit = t?.deposit ?? tenancy?.deposit;
    const advancePaid = t?.advancePaid ?? tenancy?.advancePaid;
    const rent = t?.rent ?? tenancy?.rent;
    const moveIn = t?.moveIn || tenancy?.start || null;
    const leaseEnd = t?.leaseEnd || tenancy?.end || null;
    return {
        deposit: formatMoneyField(deposit),
        advancePaid: formatMoneyField(advancePaid),
        rent: formatMoneyField(rent),
        moveIn,
        leaseEnd,
    };
}

function getTenantDepositProtection(tenantId) {
    const fin = getTenantFinancials(tenantId);
    const listItem = TENANT_LIST[tenantId];
    const tenancy = listItem && typeof getTenancyForTenantListItem === 'function'
        ? getTenancyForTenantListItem(listItem) : null;
    const checkout = typeof getTenantCheckout === 'function' ? getTenantCheckout(tenantId) : {};
    const moveInLabel = fin.moveIn && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.moveIn) || fin.moveIn
        : (fin.moveIn || '—');
    return {
        deposit: fin.deposit || '—',
        advancePaid: fin.advancePaid || '—',
        scheme: tenancy?.depositScheme || checkout.depositScheme || '—',
        status: resolveDepositStatus(
            tenancy?.depositScheme || checkout.depositScheme,
            tenancy?.protectionRef || checkout.protectionRef
        ),
        protectionRef: tenancy?.protectionRef || checkout.protectionRef || '',
        moveIn: moveInLabel,
    };
}

const DEPOSIT_SCHEME_OPTIONS = ['MyDeposits', 'DPS', 'TDS', 'Not yet registered'];

function resolveDepositStatus(depositScheme, protectionRef) {
    const scheme = depositScheme || '';
    const ref = (protectionRef || '').trim();
    if (scheme === 'Not yet registered') return 'unregistered';
    if (ref) return 'protected';
    if (scheme) return 'pending';
    return 'unregistered';
}

function depositStatusDisplay(status, depositScheme) {
    const resolved = status || resolveDepositStatus(depositScheme, '');
    if (resolved === 'protected') return { label: 'Protected', badgeClass: 'deposit-status-badge--ok' };
    if (resolved === 'unregistered' || depositScheme === 'Not yet registered') {
        return { label: 'Not registered', badgeClass: 'deposit-status-badge--muted' };
    }
    return { label: 'Pending registration', badgeClass: 'deposit-status-badge--warn' };
}

function renderDepositStatusBadge(status, depositScheme, extraClass = '') {
    const { label, badgeClass } = depositStatusDisplay(status, depositScheme);
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `<span class="deposit-status-badge ${badgeClass}${extraClass ? ` ${extraClass}` : ''}">${esc(label)}</span>`;
}

function depositSchemeSummaryLine(scheme, protectionRef) {
    const parts = [];
    if (scheme && scheme !== '—') parts.push(scheme);
    if (protectionRef) parts.push(protectionRef);
    return parts.join(' · ') || '—';
}

function goAfterDepositSave() {
    const ret = STATE.depositEditReturn;
    STATE.depositEditReturn = null;
    if (ret?.screen === 'flat-detail') {
        go('flat-detail', {
            propertyId: ret.propertyId,
            unit: ret.unit,
            flatTab: ret.flatTab || 'payments',
            noHistory: true,
        });
        return;
    }
    if (ret?.screen === 'tenant-detail') {
        go('tenant-detail', {
            tenantId: ret.tenantId ?? STATE.tenantId,
            tenantTab: ret.tenantTab || 'lease',
            noHistory: true,
        });
        return;
    }
    go('tenancy-detail', {
        propertyId: ret?.propertyId ?? STATE.propertyId,
        unit: ret?.unit ?? STATE.selectedUnit,
        noHistory: true,
    });
}

function renderTenantDepositSection(tenantId) {
    const dep = getTenantDepositProtection(tenantId);
    const fin = getTenantFinancials(tenantId);
    const amounts = [];
    if (dep.deposit !== '—') amounts.push(`Deposit ${dep.deposit}`);
    if (dep.advancePaid !== '—' && dep.advancePaid !== dep.deposit) amounts.push(`Advance ${dep.advancePaid}`);
    const tenure = tenantMonthsSince(fin.moveIn);
    const tenantSince = tenure !== '—' ? `Tenant since ${tenure}` : null;
    const leaseEndRaw = fin.leaseEnd;
    const leaseEnd = leaseEndRaw && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(leaseEndRaw) || leaseEndRaw
        : (leaseEndRaw || null);
    const leaseRemainder = tenantLeaseRemainder(fin.leaseEnd);
    const checkoutRec = AppStore.checkoutRecords?.find(r => r.tenantId === tenantId);
    const depositReturn = checkoutRec?.deposit || '';
    const metaItems = [
        dep.moveIn !== '—' ? { label: 'Move-in', value: dep.moveIn } : null,
        tenantSince ? { label: 'Tenancy', value: tenantSince.replace(/^Tenant since /, '') } : null,
        leaseEnd ? { label: 'Lease ends', value: `${leaseEnd}${leaseRemainder ? ` ${leaseRemainder}` : ''}` } : null,
        dep.scheme !== '—' ? { label: 'Scheme', value: depositSchemeSummaryLine(dep.scheme, dep.protectionRef) } : null,
        depositReturn ? { label: 'Deposit return', value: depositReturn } : null,
    ].filter(Boolean);
    const listItem = TENANT_LIST[tenantId];
    const canEditScheme = listItem?.status === 'active' && listItem?.unit;
    if (!amounts.length && !metaItems.length) return '';
    return `
    <div class="tenant-v2-section">
        <div class="tenant-v2-section-head">
            <h3>Deposit & move-in</h3>
            ${canEditScheme
                ? `<button type="button" data-go="edit-tenancy-deposit" data-pid="${listItem.propertyId}" data-unit="${listItem.unit}" class="tenant-v2-link">Edit scheme</button>`
                : `<button type="button" data-ttab="property" class="tenant-v2-link">Tenancy</button>`}
        </div>
        <div class="card tenant-deposit-card">
            <div class="tenant-deposit-card-head">
                ${amounts.length ? `<p class="tenant-deposit-line">${escapeHtml(amounts.join(' · '))}</p>` : '<p class="tenant-deposit-line">Deposit on file</p>'}
                ${renderDepositStatusBadge(dep.status, dep.scheme)}
            </div>
            ${metaItems.length ? `
            <div class="tenant-deposit-facts">
                ${metaItems.map(item => `
                <div class="tenant-deposit-fact">
                    <span class="tenant-deposit-fact-label">${escapeHtml(item.label)}</span>
                    <span class="tenant-deposit-fact-value">${escapeHtml(item.value)}</span>
                </div>`).join('')}
            </div>` : ''}
        </div>
    </div>`;
}

function tenantNidStatus(tenantId) {
    const t = TENANTS[tenantId];
    if (!t?.idNumber) return 'Not provided';
    if (t.nidProofFront && t.nidProofBack) return 'Front + back on file';
    const hasDoc = t.nidProof || (typeof getTenantNidProof === 'function' && getTenantNidProof(tenantId));
    return hasDoc ? 'Document on file' : 'Number only — no scan';
}

function tenantMonthsSince(moveIn) {
    if (!moveIn) return '—';
    const d = new Date(moveIn);
    if (Number.isNaN(d.getTime())) return '—';
    const months = Math.max(0, Math.round((Date.now() - d.getTime()) / (30.44 * 24 * 60 * 60 * 1000)));
    if (months < 1) return 'Less than 1 month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (!rem) return years === 1 ? '1 year' : `${years} years`;
    return `${years}y ${rem}m`;
}

function tenantLeaseRemainder(leaseEnd) {
    if (!leaseEnd) return '';
    const d = new Date(leaseEnd);
    if (Number.isNaN(d.getTime())) return '';
    const months = Math.round((d.getTime() - Date.now()) / (30.44 * 24 * 60 * 60 * 1000));
    if (months < 0) return '(expired)';
    if (months < 12) return `(${months} month${months === 1 ? '' : 's'} left)`;
    const years = Math.floor(months / 12);
    return years === 1 ? '(1 year left)' : `(${years} years left)`;
}

function getTenantLeaseDocIndex(tenantId) {
    const docs = getTenantDocuments(tenantId);
    return docs.findIndex(d => /lease/i.test(d[1] || ''));
}

function resolveTenantLeaseDocument(tenantId) {
    const t = TENANTS[tenantId];
    if (!t) return null;
    const docs = AppStore.documents || [];
    const forProperty = docs.filter(d => d.propertyId === t.propertyId);
    return forProperty.find(d => d.type === 'Tenancy Agreement')
        || forProperty.find(d => /tenancy agreement|lease/i.test(`${d.type || ''} ${d.name || ''}`))
        || null;
}

function renderTenantContactQuickActions(tenantId) {
    const t = TENANTS[tenantId];
    if (!t) return '';
    const chatId = typeof getTenantChatId === 'function' ? getTenantChatId(tenantId) : null;
    const msgAttrs = chatId != null
        ? `data-go="chat" data-chat="${chatId}"`
        : `data-action="start-tenant-chat" data-tid="${tenantId}"`;
    const leaseDoc = resolveTenantLeaseDocument(tenantId);
    const leaseIdx = getTenantLeaseDocIndex(tenantId);
    const leaseAttrs = leaseDoc
        ? `data-go="document-preview" data-doc="${leaseDoc.id}"`
        : leaseIdx >= 0
            ? `data-go="document-preview" data-preview-source="tenant" data-preview-idx="${leaseIdx}" data-tid="${tenantId}"`
            : `data-ttab="documents"`;
    const actions = [
        ['phone', 'Call', `data-action="call-tenant" data-tid="${tenantId}"`, 'tenant-v2-quick-icon--call'],
        ['message-square', 'Message', msgAttrs, 'tenant-v2-quick-icon--msg'],
        ['file-text', 'View lease', leaseAttrs, 'tenant-v2-quick-icon--lease'],
    ];
    return `
        <div class="tenant-v2-quick-grid tenant-v2-quick-grid--3">
            ${actions.map(([ic, label, attrs, tone]) => `
            <button type="button" ${attrs} class="tenant-v2-quick-btn">
                <span class="tenant-v2-quick-icon ${tone}"><i data-lucide="${ic}" class="w-5 h-5"></i></span>
                <span class="tenant-v2-quick-label">${label}</span>
            </button>`).join('')}
        </div>`;
}

function renderTenantFinanceSplit(tenantId) {
    const pay = tenantPaymentSummary(tenantId);
    const t = TENANTS[tenantId];
    const rentAmt = typeof formatTenantRent === 'function' ? formatTenantRent(t?.rent) : `£${t?.rent || '—'}`;
    const isClear = pay?.balance === '£0.00' && !(pay?.overdueCount > 0);
    const nextDueAmt = pay?.nextDue?.split(' · ')[0] || rentAmt.replace('/mo', '');
    const nextDueWhen = pay?.nextDue?.includes(' · ') ? pay.nextDue.split(' · ')[1] : '1st of month';
    return `
    <div class="card tenant-v2-finance">
        <div class="tenant-v2-finance-col">
            <p class="tenant-v2-finance-label">Outstanding balance</p>
            <p class="tenant-v2-finance-amount ${isClear ? 'tenant-v2-finance-amount--ok' : 'tenant-v2-finance-amount--due'}">${pay?.balance || '£0.00'}</p>
            <p class="tenant-v2-finance-hint">${isClear ? '<i data-lucide="check-circle" class="w-3.5 h-3.5"></i> All good — no outstanding dues' : `${pay?.overdueCount || 0} overdue invoice${pay?.overdueCount === 1 ? '' : 's'}`}</p>
        </div>
        <div class="tenant-v2-finance-divider"></div>
        <div class="tenant-v2-finance-col">
            <p class="tenant-v2-finance-label">Next rent due</p>
            <p class="tenant-v2-finance-amount">${nextDueAmt}</p>
            <p class="tenant-v2-finance-hint"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${nextDueWhen}</p>
        </div>
    </div>`;
}

function renderTenantDocStrip(tenantId) {
    const docs = getTenantDocuments(tenantId);
    const preview = docs.slice(0, 3);
    const typeColor = (ic) => ic === 'file-image' ? '#16A34A' : '#DC2626';
    return `
    <div class="tenant-v2-section">
        <div class="tenant-v2-section-head">
            <h3>Documents</h3>
            <button type="button" data-ttab="documents" class="tenant-v2-link">View all</button>
        </div>
        <div class="tenant-v2-doc-strip">
            ${preview.map(([ic, name, date], idx) => `
            <button type="button" data-go="document-preview" data-preview-source="tenant" data-preview-idx="${idx}" data-tid="${tenantId}" class="tenant-v2-doc-chip">
                <span class="tenant-v2-doc-icon" style="color:${typeColor(ic)}"><i data-lucide="${ic}" class="w-5 h-5"></i></span>
                <span class="tenant-v2-doc-name">${escapeHtml(name.replace(/\.[^.]+$/, ''))}</span>
                <span class="tenant-v2-doc-type">${ic === 'file-image' ? 'JPG' : 'PDF'}</span>
            </button>`).join('')}
            <button type="button" data-action="upload-tenant-doc" class="tenant-v2-doc-chip tenant-v2-doc-chip--add">
                <span class="tenant-v2-doc-add"><i data-lucide="plus" class="w-6 h-6"></i></span>
                <span class="tenant-v2-doc-name">Add document</span>
            </button>
        </div>
    </div>`;
}

function renderTenantProfileFooter(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (listItem?.status !== 'active') return '';
    return `
    <div class="tenant-v2-footer-sticky">
        <button type="button" data-go="checkout-tenancy" data-tid="${tenantId}" class="btn-secondary w-full tenant-v2-footer-btn tenant-v2-footer-checkout">
            <i data-lucide="log-out" class="w-4 h-4"></i><span>Check-out tenant</span>
        </button>
    </div>`;
}

function formatTenantDob(dob) {
    if (!dob) return '—';
    const d = new Date(dob);
    return Number.isNaN(d.getTime()) ? dob : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function tenantPreviousAddress(tenantId) {
    const t = TENANTS[tenantId];
    const ref = typeof getTenantReferencing === 'function' ? getTenantReferencing(tenantId) : null;
    return ref?.previousLandlord?.address?.trim() || t?.homeAddress?.trim() || '';
}

function tenantEmergencySummary(t) {
    const name = t.emergency && t.emergency !== '—' ? String(t.emergency).trim() : '';
    const phone = t.emergencyPhone && t.emergencyPhone !== '—' ? String(t.emergencyPhone).trim() : '';
    if (!name && !phone) return { name: '', phone: '', text: 'Not set', empty: true };
    const text = name && phone ? `${name}\n${phone}` : (name || phone);
    return { name, phone, text, empty: false };
}

function renderTenantContactCard(tenantId, opts = {}) {
    const t = TENANTS[tenantId];
    if (!t) return '';
    const linkPhoneEmail = opts.linkPhoneEmail !== false && opts.actions !== false;
    const linkEmergency = opts.linkEmergency !== false && opts.actions !== false;
    const emergency = tenantEmergencySummary(t);
    const phoneInner = `
        <span class="tenant-info-icon"><i data-lucide="phone" class="w-4 h-4"></i></span>
        <span class="tenant-info-copy">
            <span class="tenant-info-label">Phone</span>
            <span class="tenant-info-value tenant-info-value--wrap">${escapeHtml(t.phone || '—')}</span>
        </span>`;
    const emailInner = `
        <span class="tenant-info-icon"><i data-lucide="mail" class="w-4 h-4"></i></span>
        <span class="tenant-info-copy">
            <span class="tenant-info-label">Email</span>
            <span class="tenant-info-value tenant-info-value--wrap">${escapeHtml(t.email || '—')}</span>
        </span>`;
    const emergencyInner = emergency.empty
        ? `<span class="tenant-info-value tenant-info-value--muted">${escapeHtml(emergency.text)}</span>`
        : emergency.name && emergency.phone
            ? `<span class="tenant-info-value tenant-info-value--wrap">${escapeHtml(emergency.name)}</span>
               <span class="tenant-info-value tenant-info-value--wrap tenant-info-value--sub">${escapeHtml(emergency.phone)}</span>`
            : `<span class="tenant-info-value tenant-info-value--wrap">${escapeHtml(emergency.text)}</span>`;
    return `
    <div class="tenant-v2-section">
        <div class="tenant-v2-section-head tenant-v2-section-head--stack">
            <div class="tenant-v2-section-head-row">
                <h3>Contact</h3>
                ${emergency.empty ? `<button type="button" data-go="edit-tenant" data-tid="${tenantId}" class="tenant-v2-link">Add contact</button>` : ''}
            </div>
            <p class="tenant-info-hint">Emergency contact collected at move-in or updated by tenant</p>
        </div>
        <div class="card tenant-info-compact">
            <div class="tenant-info-row tenant-info-row--stack">
                ${linkPhoneEmail
                    ? `<button type="button" data-action="call-tenant" data-tid="${tenantId}" class="tenant-info-cell tenant-info-cell--link tenant-info-cell--full">${phoneInner}</button>`
                    : `<div class="tenant-info-cell tenant-info-cell--full">${phoneInner}</div>`}
            </div>
            <div class="tenant-info-row tenant-info-row--stack">
                ${linkPhoneEmail
                    ? `<button type="button" data-action="email-tenant" data-tid="${tenantId}" class="tenant-info-cell tenant-info-cell--link tenant-info-cell--full">${emailInner}</button>`
                    : `<div class="tenant-info-cell tenant-info-cell--full">${emailInner}</div>`}
            </div>
            <div class="tenant-info-row tenant-info-row--stack">
                ${emergency.phone && linkEmergency
                    ? `<button type="button" data-action="call-tenant" data-tid="${tenantId}" data-phone="${escapeHtml(emergency.phone)}" class="tenant-info-cell tenant-info-cell--link tenant-info-cell--full">
                        <span class="tenant-info-icon"><i data-lucide="heart-pulse" class="w-4 h-4"></i></span>
                        <span class="tenant-info-copy">
                            <span class="tenant-info-label">Emergency contact</span>
                            ${emergencyInner}
                        </span>
                    </button>`
                    : `<div class="tenant-info-cell tenant-info-cell--full">
                        <span class="tenant-info-icon"><i data-lucide="heart-pulse" class="w-4 h-4"></i></span>
                        <span class="tenant-info-copy">
                            <span class="tenant-info-label">Emergency contact</span>
                            ${emergencyInner}
                        </span>
                    </div>`}
            </div>
        </div>
    </div>`;
}

function renderTenantPersonalIdCard(tenantId, opts = {}) {
    const t = TENANTS[tenantId];
    if (!t) return '';
    const docStatus = tenantNidStatus(tenantId);
    const nidDoc = typeof getTenantNidProof === 'function' ? getTenantNidProof(tenantId) : null;
    const prevAddress = opts.showPreviousAddress !== false ? tenantPreviousAddress(tenantId) : '';
    const canViewDoc = opts.viewDocs !== false;
    return `
    <div class="tenant-v2-section">
        <div class="tenant-v2-section-head"><h3>Personal & ID</h3></div>
        <div class="card tenant-info-compact tenant-info-compact--personal">
            <div class="tenant-info-row tenant-info-row--stack">
                <div class="tenant-info-cell tenant-info-cell--full">
                    <span class="tenant-info-icon"><i data-lucide="cake" class="w-4 h-4"></i></span>
                    <span class="tenant-info-copy">
                        <span class="tenant-info-label">Date of birth</span>
                        <span class="tenant-info-value">${escapeHtml(formatTenantDob(t.dob))}</span>
                    </span>
                </div>
                <div class="tenant-info-cell tenant-info-cell--full">
                    <span class="tenant-info-icon"><i data-lucide="id-card" class="w-4 h-4"></i></span>
                    <span class="tenant-info-copy">
                        <span class="tenant-info-label">NID</span>
                        <span class="tenant-info-value">${escapeHtml(t.idNumber || '—')}</span>
                    </span>
                </div>
                ${nidDoc && canViewDoc ? `
                <button type="button" data-go="document-preview" data-preview-source="tenant-nid" data-tid="${tenantId}" class="tenant-info-cell tenant-info-cell--link tenant-info-cell--full">
                    <span class="tenant-info-icon"><i data-lucide="file-badge" class="w-4 h-4"></i></span>
                    <span class="tenant-info-copy">
                        <span class="tenant-info-label">ID document</span>
                        <span class="tenant-info-value">${escapeHtml(docStatus)}</span>
                    </span>
                    <i data-lucide="chevron-right" class="tenant-info-chevron w-3.5 h-3.5"></i>
                </button>` : `
                <div class="tenant-info-cell tenant-info-cell--full">
                    <span class="tenant-info-icon"><i data-lucide="file-badge" class="w-4 h-4"></i></span>
                    <span class="tenant-info-copy">
                        <span class="tenant-info-label">ID document</span>
                        <span class="tenant-info-value">${escapeHtml(docStatus)}</span>
                    </span>
                </div>`}
                <div class="tenant-info-cell tenant-info-cell--full">
                    <span class="tenant-info-icon"><i data-lucide="map-pin" class="w-4 h-4"></i></span>
                    <span class="tenant-info-copy">
                        <span class="tenant-info-label">Last rented address</span>
                        <span class="tenant-info-value tenant-info-value--wrap">${escapeHtml(prevAddress || '—')}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>`;
}

function renderTenantProfileInfoSections(tenantId) {
    return `${renderTenantContactCard(tenantId, { linkPhoneEmail: false, linkEmergency: true })}
    ${renderTenantPersonalIdCard(tenantId, { showPreviousAddress: true, viewDocs: true })}`;
}

const TENANT_SUPPORT_PREFILLS = {
    general: 'Hi, I need help with my tenancy.',
    faq: 'Hi, I still need help after reading the FAQ:',
};

function resolveTenantRecordId() {
    const account = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
    if (!account) return null;
    const match = TENANTS.find(t => t.email?.toLowerCase() === account.email?.toLowerCase());
    return match?.id ?? account.id ?? null;
}

function getActiveTenantLandlordChatId() {
    const tid = resolveTenantRecordId();
    if (tid != null && typeof getTenantChatId === 'function') {
        const chatId = getTenantChatId(tid);
        if (chatId != null) return chatId;
    }
    return typeof getLandlordChatId === 'function' ? getLandlordChatId() : 0;
}

function tenantChatView(conv) {
    if (!conv) return null;
    const landlordName = `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
    return {
        ...conv,
        name: landlordName,
        img: IMG.avatar.john,
        sub: 'Your landlord',
        messages: (conv.messages || []).map(m => ({
            ...m,
            type: m.type === 'in' ? 'out' : 'in',
        })),
    };
}

function openTenantSupportChat(topic = 'general') {
    if (STATE.userRole !== 'tenant') return;
    const chatId = getActiveTenantLandlordChatId();
    STATE.chatId = chatId;
    STATE.chatDraft = TENANT_SUPPORT_PREFILLS[topic] || TENANT_SUPPORT_PREFILLS.general || '';
    go('chat', { chatId });
}

function renderLandlordContactCard() {
    const name = `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
    const chatId = getActiveTenantLandlordChatId();
    const msgAttrs = chatId != null ? `data-go="chat" data-chat="${chatId}"` : `data-go="messages"`;
    return `
    <div class="card p-4">
        <p class="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Your landlord</p>
        <p class="text-[14px] font-bold text-[#0F172A] mt-1">${escapeHtml(name)}</p>
        <p class="text-[12px] text-[#64748B] mt-1">${escapeHtml(LANDLORD_USER.phone || '—')}</p>
        <p class="text-[12px] text-[#64748B] mt-0.5">${escapeHtml(LANDLORD_USER.email || '—')}</p>
        <div class="mt-3">
            ${renderContactOutlineRow([
                ['phone', 'Call', `data-action="call-landlord"`],
                ['message-square', 'Message', msgAttrs],
                ['mail', 'Email', `data-action="email-landlord"`],
            ])}
        </div>
    </div>`;
}

function renderPhotoPreviewStrip(photos, opts = {}) {
    if (!photos?.length) return '';
    const removeAction = opts.removeAction || 'remove-pending-photo';
    return `
    <div class="photo-preview-strip">
        ${photos.map((src, i) => `
        <div class="photo-preview-item">
            <img src="${src}" alt="">
            ${opts.removable ? `<button type="button" data-action="${removeAction}" data-photo-idx="${i}" class="photo-preview-remove" aria-label="Remove photo"><i data-lucide="x" class="w-3 h-3"></i></button>` : ''}
        </div>`).join('')}
    </div>`;
}

function renderLogMaintReportHeader(title = 'Report Issue') {
    const unread = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : 0;
    const showBack = typeof shouldShowBottomNav === 'function' ? !shouldShowBottomNav('log-maintenance') : true;
    return `
    <div class="screen-header maint-log-report-header">
        <div class="dash-header-top">
            ${showBack ? `<button type="button" data-action="back" class="top-icon-btn" aria-label="Back"><i data-lucide="chevron-left" class="w-[22px] h-[22px]"></i></button>` : '<span class="w-10"></span>'}
            <button type="button" data-go="notifications-list" class="top-icon-btn relative" aria-label="Notifications">
                <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
                ${unread ? `<span class="notif-badge">${unread}</span>` : ''}
            </button>
        </div>
        <h1 class="maint-log-report-title">${title}</h1>
    </div>`;
}

function renderLogMaintStepper(step) {
    const steps = [['Issue details', 1], ['Description', 2], ['Photos', 3]];
    return `
    <div class="maint-log-stepper" role="navigation" aria-label="Report issue steps">
        ${steps.map(([label, n], i) => `
        <div class="maint-log-stepper-item${n === step ? ' is-active' : ''}${n < step ? ' is-done' : ''}">
            <span class="maint-log-stepper-dot">${n < step ? '<i data-lucide="check" class="w-3 h-3"></i>' : n}</span>
            <span class="maint-log-stepper-label">${label}</span>
        </div>${i < steps.length - 1 ? '<span class="maint-log-stepper-line" aria-hidden="true"></span>' : ''}`).join('')}
    </div>`;
}

function renderLogMaintTenantPropertyCard(t) {
    const unitRec = typeof getUnitByName === 'function' ? getUnitByName(t.propertyId, t.unit) : null;
    const beds = unitRec?.beds ? `${unitRec.beds} Bed` : '2 Bed';
    const floor = unitRec?.floor != null ? `Floor ${unitRec.floor}` : 'Your floor';
    return `
    <div class="maint-log-context card">
        <div class="maint-log-context-top">
            <div class="maint-log-context-icon"><i data-lucide="building-2" class="w-5 h-5"></i></div>
            <div class="maint-log-context-body">
                <p class="maint-log-context-unit">${escapeHtml(t.unit || 'Your unit')}</p>
                <p class="maint-log-context-meta">${beds} • ${floor}</p>
            </div>
            <span class="maint-log-context-badge"><i data-lucide="check" class="w-3 h-3"></i> Active</span>
        </div>
        <p class="maint-log-context-hint">Issues here are inside your flat. Communal areas are handled separately.</p>
    </div>`;
}

function renderLogMaintPriorityPicker() {
    const priorities = [
        ['Low', '#16A34A'],
        ['Medium', '#D97706'],
        ['High', '#DC2626'],
    ];
    return `
    <div class="form-group maint-log-priority">
        <label class="form-label">Priority <span class="form-required">*</span></label>
        <div class="maint-log-priority-row">
            ${priorities.map(([pr, dotColor]) => `
            <button type="button" data-log-priority="${pr}" class="maint-log-priority-btn ${STATE.logPriority === pr ? 'is-active' : ''}">
                <span class="maint-log-priority-dot" style="background:${dotColor}"></span>${pr}
            </button>`).join('')}
        </div>
    </div>`;
}

function renderLogMaintCategoryField() {
    if (typeof CONTRACTOR_TRADE_CATALOG === 'undefined') return '';
    const selected = STATE.logMaintCategoryId || 'general';
    const trade = typeof contractorTradeById === 'function'
        ? contractorTradeById(selected)
        : CONTRACTOR_TRADE_CATALOG.find(t => t.id === selected) || CONTRACTOR_TRADE_CATALOG[0];
    return `
    <div class="form-group">
        <label class="form-label">Issue type <span class="form-required">*</span></label>
        <div class="maint-log-select-wrap">
            <i data-lucide="${trade.icon || 'hammer'}" class="maint-log-select-icon w-4 h-4"></i>
            <select data-field="categoryId" data-log-maint-category class="form-input form-select maint-log-select">
                ${CONTRACTOR_TRADE_CATALOG.map(meta => `
                <option value="${meta.id}" ${selected === meta.id ? 'selected' : ''}>${meta.shortLabel} — ${meta.label}</option>`).join('')}
            </select>
        </div>
        <p class="form-helper maint-cat-helper">${escapeHtml(trade.jobsFor || '')}</p>
    </div>`;
}

function renderLogMaintMediaGallery() {
    const photos = STATE.logMaintPhotos || [];
    const videos = STATE.logMaintVideos || [];
    const thumbs = [
        ...photos.map((src, i) => `
        <div class="maint-log-media-thumb">
            <img src="${src}" alt="">
            <button type="button" data-action="remove-log-maint-photo" data-photo-idx="${i}" class="maint-log-media-remove" aria-label="Remove photo"><i data-lucide="x" class="w-3 h-3"></i></button>
        </div>`),
        ...videos.map((video, idx) => {
            const v = typeof normalizeMaintVideo === 'function' ? normalizeMaintVideo(video, idx) : { name: `Video ${idx + 1}`, poster: photos[0] };
            return `
        <div class="maint-log-media-thumb maint-log-media-thumb--video">
            ${v.poster ? `<img src="${v.poster}" alt="">` : '<span class="maint-log-media-video-ph"><i data-lucide="video" class="w-5 h-5"></i></span>'}
            <button type="button" data-action="remove-log-maint-video" data-photo-idx="${idx}" class="maint-log-media-remove" aria-label="Remove video"><i data-lucide="x" class="w-3 h-3"></i></button>
        </div>`;
        }),
    ].join('');
    return `
    <div class="maint-log-media-gallery">
        ${thumbs}
        <button type="button" data-action="upload-maint-media" class="maint-log-media-add" aria-label="Add more photos or videos">
            <i data-lucide="plus" class="w-6 h-6"></i>
            <span>Add More</span>
        </button>
    </div>`;
}

function renderLogMaintMediaSection(opts = {}) {
    const photos = STATE.logMaintPhotos || [];
    const videos = STATE.logMaintVideos || [];
    const total = photos.length + videos.length;
    const audience = STATE.userRole === 'tenant' ? 'landlord' : 'contractor';
    const polished = opts.polished || STATE.userRole === 'tenant';
    if (polished) {
        return `
        <div class="maint-log-section card maint-log-media-section">
            <div class="maint-log-section-head">
                <span class="maint-log-section-icon"><i data-lucide="image" class="w-4 h-4"></i></span>
                <span class="maint-log-section-title">Photos &amp; videos</span>
            </div>
            <p class="maint-log-media-helper">Images or short clips help your ${audience} understand the issue.</p>
            ${total ? renderLogMaintMediaGallery() : `
            <button type="button" data-action="upload-maint-media" class="maint-log-media-drop">
                <i data-lucide="image-plus" class="w-8 h-8 text-[#94A3B8]"></i>
                <p class="maint-log-media-drop-title">Add photos or videos</p>
                <span class="maint-log-media-drop-sub">Max 10 files · JPG, PNG, HEIC, MP4 · Up to 100MB each</span>
            </button>`}
        </div>`;
    }
    const photoStrip = photos.length && typeof renderPhotoPreviewStrip === 'function'
        ? renderPhotoPreviewStrip(photos, { removable: true, removeAction: 'remove-log-maint-photo' })
        : '';
    const videoList = videos.length ? `
        <div class="maint-log-media-videos card p-3">
            ${videos.map((video, idx) => {
                const v = typeof normalizeMaintVideo === 'function' ? normalizeMaintVideo(video, idx) : { name: `Video ${idx + 1}` };
                return `<div class="maint-log-video-row">
                    <span class="maint-log-video-name"><i data-lucide="video" class="w-4 h-4"></i>${escapeHtml(v.name)}</span>
                    <button type="button" data-action="remove-log-maint-video" data-photo-idx="${idx}" class="maint-log-video-remove">Remove</button>
                </div>`;
            }).join('')}
        </div>` : '';
    const countHint = total ? ` · ${total} added` : '';
    return `
    <div class="form-group maint-log-media-block">
        <label class="form-label">Photos &amp; videos <span class="form-optional">optional</span></label>
        ${photoStrip}${videoList}
        ${total ? renderLogMaintMediaGallery() : `
        <button type="button" data-action="upload-maint-media" class="maint-log-media-drop maint-log-media-drop--compact">
            <i data-lucide="image-plus" class="w-7 h-7 text-[#94A3B8]"></i>
            <p class="maint-log-media-drop-title">Add photos or videos</p>
        </button>`}
    </div>`;
}

function screenLogMaintenanceTenant() {
    const t = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
    if (!t) {
        return `${topBar('Report Issue', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Sign in as tenant to report an issue.</p></div>`;
    }
    const p = typeof PROPERTIES !== 'undefined' ? PROPERTIES[t.propertyId] : null;
    return `${topBar('Report Issue', { back: !shouldShowBottomNav('log-maintenance') })}
    <div class="screen-content screen-content-sm screen-enter">
        <div class="card p-4" style="background:#F8FAFC">
            <p class="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Your unit</p>
            <p class="text-[13px] font-bold text-[#0F172A] mt-1">${escapeHtml(t.unit || '—')}</p>
            <p class="text-[12px] text-[#64748B] mt-0.5">${escapeHtml(p?.name || '')}${p?.address ? ` · ${escapeHtml(p.address)}` : ''}</p>
            <p class="text-[11px] text-[#64748B] mt-2">Issues here go to your landlord. Communal areas are handled separately.</p>
        </div>
        <div class="form-group">
            <label class="form-label">Issue title <span class="form-required">*</span></label>
            <input data-field="title" class="form-input" placeholder="Brief summary of the issue">
        </div>
        ${renderLogMaintCategoryField()}
        ${renderLogMaintPriorityPicker()}
        <div class="form-group">
            <label class="form-label">Description <span class="form-required">*</span></label>
            <textarea data-field="desc" class="form-input h-24 resize-none" placeholder="Where is it? When did it start? Any access instructions?"></textarea>
        </div>
        ${renderLogMaintMediaSection({ polished: false })}
        <button type="button" data-action="save" data-msg="Issue reported to your landlord" class="btn-primary w-full py-3.5 text-[14px] flex items-center justify-center gap-2 mt-2">
            <i data-lucide="send" class="w-4 h-4"></i>Report to landlord
        </button>
    </div>`;
}

function setLogMaintStep(direction) {
    const step = STATE.logMaintStep || 1;
    if (direction === 'next') {
        if (step === 1) {
            const title = document.querySelector('[data-field="title"]')?.value?.trim();
            if (!title) { toast('Please add an issue title'); return; }
        }
        if (step === 2) {
            const desc = document.querySelector('[data-field="desc"]')?.value?.trim();
            if (!desc) { toast('Please add a description'); return; }
        }
        STATE.logMaintStep = Math.min(3, step + 1);
    } else if (direction === 'prev') {
        STATE.logMaintStep = Math.max(1, step - 1);
    } else {
        STATE.logMaintStep = Math.max(1, Math.min(3, +direction || 1));
    }
    render();
}

function renderFlatUnitPhotoPicker(photos, coverIdx, opts = {}) {
    const list = photos?.length ? photos : [];
    const cover = list.length ? Math.min(Math.max(0, coverIdx ?? 0), list.length - 1) : 0;
    const hero = list.length ? list[cover] : (opts.placeholder || IMG.interior[0]);
    const coverAction = opts.coverAction || 'set-pending-flat-cover';
    const removeAction = opts.removeAction || 'remove-pending-flat-photo';
    const uploadAction = opts.uploadAction || 'upload-pending-flat-photo';
    const uploadLabel = opts.uploadLabel || (list.length ? 'Add more photos' : 'Add unit photos (optional)');
    const hint = opts.hint || 'Add multiple photos and tap ★ to choose which shows on the home screen.';
    const isGallery = opts.variant === 'gallery';
    return `
    <div class="flat-unit-photo-picker card overflow-hidden${isGallery ? ' flat-unit-photo-picker--gallery' : ''}">
        ${isGallery ? `
        <div class="flat-unit-photo-card-head">
            <h3 class="flat-unit-photo-card-title">Unit photos</h3>
            <span class="flat-unit-photo-card-count">${list.length} photo${list.length === 1 ? '' : 's'}</span>
        </div>` : ''}
        <div class="flat-unit-photo-hero">
            <img src="${hero}" alt="" class="img-cover">
            ${list.length ? '<span class="flat-unit-photo-cover-tag">Cover photo</span>' : ''}
        </div>
        ${list.length ? `
        <div class="flat-unit-photo-thumbs">
            ${list.map((src, i) => `
            <div class="flat-unit-photo-thumb${i === cover ? ' is-cover' : ''}">
                <img src="${src}" alt="">
                ${i === cover
                    ? '<span class="flat-unit-photo-badge">Cover</span>'
                    : `<button type="button" data-action="${coverAction}" data-photo-idx="${i}" class="flat-unit-photo-set-cover" aria-label="Set as cover"><i data-lucide="star" class="w-3.5 h-3.5"></i></button>`}
                <button type="button" data-action="${removeAction}" data-photo-idx="${i}" class="photo-preview-remove" aria-label="Remove photo"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>`).join('')}
        </div>` : ''}
        <div class="flat-unit-photo-actions">
            <button type="button" data-action="${uploadAction}" class="flat-edit-photo-btn${isGallery ? ' flat-edit-photo-btn--gallery' : ''}">
                <i data-lucide="image-plus" class="w-4 h-4"></i><span>${uploadLabel}</span>
            </button>
            <p class="flat-unit-photo-hint">${hint}</p>
        </div>
    </div>`;
}

/* ─── Form option lists (structured fields → dropdowns) ─── */
const PROPERTY_TYPE_OPTIONS = ['Detached', 'Semi-detached', 'Terraced', 'Flat / Apartment', 'Bungalow', 'HMO', 'Maisonette', 'Studio', 'Other'];
const FURNISHED_OPTIONS = ['Furnished', 'Unfurnished', 'Part-furnished'];
const EPC_RATING_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Not rated', 'Exempt'];
const COUNCIL_TAX_BAND_OPTIONS = ['Band A', 'Band B', 'Band C', 'Band D', 'Band E', 'Band F', 'Band G', 'Band H', 'Not applicable'];
const APPLIANCE_NAME_OPTIONS = ['Boiler', 'Oven', 'Fridge', 'Freezer', 'Washing machine', 'Dishwasher', 'Microwave', 'Extractor fan', 'Other'];
const UTILITY_PROVIDER_SUGGESTIONS = {
    gas: ['British Gas', 'Octopus Energy', 'EDF', 'E.ON', 'SSE', 'Scottish Power'],
    electric: ['Octopus Energy', 'British Gas', 'EDF', 'E.ON', 'SSE', 'Scottish Power'],
    water: ['Thames Water', 'Anglian Water', 'Yorkshire Water', 'United Utilities', 'Severn Trent'],
    broadband: ['BT', 'Sky', 'Virgin Media', 'TalkTalk', 'Plusnet', 'Vodafone'],
    oil: ['Certas Energy', 'WCF Fuels', 'Crown Oil', 'Local supplier'],
    heating: ['Communal scheme', 'Building management', 'Local heat network'],
};

const UTILITY_CATALOG = [
    { key: 'gas', label: 'Gas', icon: 'flame' },
    { key: 'electric', label: 'Electricity', icon: 'zap' },
    { key: 'water', label: 'Water', icon: 'droplets' },
    { key: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
];

const REMINDER_TIMING_OPTIONS = [
    { id: '30', label: '30 days before expiry' },
    { id: '60', label: '60 days before expiry' },
    { id: '90', label: '90 days before expiry' },
    { id: 'custom', label: 'Custom reminder date' },
];

function normalizeUtilityEntry(val) {
    if (!val) return null;
    if (typeof val === 'object') return val;
    return { provider: String(val) };
}

function getUtilityEntry(meta, key) {
    const raw = meta?.utilities?.[key];
    return normalizeUtilityEntry(raw);
}

function migrateUtilityKeys(meta) {
    if (!meta.utilities) meta.utilities = {};
    if (meta.utilities.broadband != null && meta.utilities.wifi == null) {
        meta.utilities.wifi = meta.utilities.broadband;
        delete meta.utilities.broadband;
    }
    UTILITY_CATALOG.forEach(u => {
        const entry = meta.utilities[u.key];
        if (entry != null && typeof entry === 'string') {
            meta.utilities[u.key] = { provider: entry };
        }
    });
    if (meta.utilities.councilTax && !meta.utilities.council) {
        meta.utilities.council = { name: meta.info?.councilTax || '', notes: '' };
    }
}

function computeReminderDate(expiry, timing, customDate) {
    if (!expiry) return '';
    if (timing === 'custom' && customDate) return customDate;
    const days = parseInt(timing, 10) || 30;
    const exp = new Date(expiry);
    if (Number.isNaN(exp.getTime())) return '';
    exp.setDate(exp.getDate() - days);
    return exp.toISOString().slice(0, 10);
}

function applianceSummaryItems(appliances) {
    const counts = {};
    (appliances || []).forEach(a => {
        const name = a.name || 'Appliance';
        counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
        icon: applianceIcon(name),
        label: count > 1 ? `${count} ${name}s` : `1 ${name}`,
        sub: (appliances || []).find(a => a.name === name)?.brand || '',
    }));
}

const APPLIANCE_CATALOG = [
    { name: 'Boiler', icon: 'flame' },
    { name: 'Oven', icon: 'microwave' },
    { name: 'Fridge', icon: 'box' },
    { name: 'Freezer', icon: 'snowflake' },
    { name: 'Washing machine', icon: 'waves' },
    { name: 'Dishwasher', icon: 'utensils-crossed' },
    { name: 'Microwave', icon: 'microwave' },
    { name: 'Extractor fan', icon: 'wind' },
];

const ALARM_CATALOG = [
    { key: 'smoke', label: 'Smoke', icon: 'bell' },
    { key: 'heat', label: 'Heat', icon: 'thermometer' },
    { key: 'co', label: 'CO', icon: 'alert-circle' },
];

function applianceIcon(name) {
    const key = String(name || '').toLowerCase();
    const hit = APPLIANCE_CATALOG.find(a => a.name.toLowerCase() === key);
    if (hit) return hit.icon;
    if (key.includes('boiler')) return 'flame';
    if (key.includes('fridge')) return 'box';
    if (key.includes('oven') || key.includes('microwave')) return 'microwave';
    if (key.includes('wash')) return 'waves';
    if (key.includes('dish')) return 'utensils-crossed';
    if (key.includes('freezer')) return 'snowflake';
    if (key.includes('fan')) return 'wind';
    return 'plug';
}

function alarmIcon(key) {
    return ALARM_CATALOG.find(a => a.key === key)?.icon || 'bell';
}

function utilityCatalogItem(key) {
    return UTILITY_CATALOG.find(u => u.key === key);
}

function propertyHasParking(meta) {
    const p = meta?.parking || {};
    return (p.spaces > 0)
        || (p.type && p.type !== 'None')
        || !!(p.notes?.trim())
        || !!(p.permit?.trim());
}

function propertyParkingSummary(meta) {
    const p = meta?.parking || {};
    return [p.type, p.spaces ? `${p.spaces} space${p.spaces === 1 ? '' : 's'}` : '', p.permit ? `Permit ${p.permit}` : '']
        .filter(Boolean)
        .join(' · ');
}

function alarmHasData(alarm) {
    return !!(alarm && (alarm.location || alarm.expiry || alarm.makeModel || alarm.description || alarm.name));
}

function propertyCustomAlarmItems(meta) {
    return (meta.customAlarms || [])
        .filter(alarmHasData)
        .map(a => {
            const parts = [
                a.location || '',
                a.expiry ? `Expires ${formatInfoDate(a.expiry)}` : '',
            ].filter(Boolean);
            return { icon: 'bell-ring', label: a.name || 'Custom alarm', sub: parts.join(' · ') };
        });
}

function propertyUtilityDisplayItems(meta) {
    migrateUtilityKeys(meta);
    const items = UTILITY_CATALOG
        .filter(u => getUtilityEntry(meta, u.key))
        .map(u => {
            const entry = getUtilityEntry(meta, u.key);
            return {
                icon: u.icon,
                label: u.label,
                sub: entry?.provider || '',
            };
        });
    const council = meta.utilities?.council;
    if (council?.name) {
        items.push({ icon: 'landmark', label: 'Council', sub: council.name });
    }
    return items;
}

function renderBuildingParkingBlock(meta, propertyId) {
    if (!propertyHasParking(meta)) return '';
    const p = meta.parking || {};
    const summary = propertyParkingSummary(meta);
    const inner = `
        <div class="building-icon-item building-parking-block-main">
            <i data-lucide="car" class="w-4 h-4"></i>
            <span class="building-icon-item-copy">
                <span class="building-icon-label">Parking</span>
                <span class="building-icon-sub building-icon-sub--wrap">${escapeHtml(summary)}</span>
            </span>
        </div>
        ${p.notes ? `<p class="building-parking-notes">${escapeHtml(p.notes)}</p>` : ''}`;
    if (propertyId == null) {
        return `<div class="building-parking-block">${inner}</div>`;
    }
    return `
    <button type="button" data-go="property-parking" data-pid="${propertyId}" class="building-section-tap building-parking-block" aria-label="Edit parking">
        ${inner}
    </button>`;
}

function renderBuildingIconItem({ icon, label, sub = '' }) {
    return `<div class="building-icon-item">
        <i data-lucide="${icon}" class="w-4 h-4"></i>
        <span class="building-icon-item-copy">
            <span class="building-icon-label">${escapeHtml(label)}</span>
            ${sub ? `<span class="building-icon-sub">${escapeHtml(sub)}</span>` : ''}
        </span>
    </div>`;
}

function renderFeaturePickGrid(items, { isActive, action, valueKey = 'name', labelKey = 'name', iconKey = 'icon' }) {
    return `<div class="feature-pick-grid">${items.map(item => {
        const val = item[valueKey];
        const active = isActive(item);
        return `<button type="button" data-action="${action}" data-pick-value="${escapeHtml(val)}" class="feature-pick-chip ${active ? 'is-active' : ''}" aria-pressed="${active}">
            <span class="feature-pick-chip-icon"><i data-lucide="${item[iconKey]}" class="w-4 h-4"></i></span>
            <span>${escapeHtml(item[labelKey])}</span>
            ${active ? '<i data-lucide="check" class="w-3.5 h-3.5 feature-pick-check"></i>' : ''}
        </button>`;
    }).join('')}</div>`;
}

function renderApplianceQuickPick(meta) {
    const existing = new Set((meta.appliances || []).map(a => a.name.toLowerCase()));
    return `
    <div class="feature-pick-section card p-4 mb-3">
        <p class="feature-pick-title">Quick add common appliances</p>
        <p class="feature-pick-sub">Tap to add — same icons appear on your building summary.</p>
        ${renderFeaturePickGrid(APPLIANCE_CATALOG, {
            isActive: (item) => existing.has(item.name.toLowerCase()),
            action: 'quick-add-appliance',
        })}
    </div>`;
}

function renderUtilityQuickPick(meta) {
    const utilities = meta.utilities || {};
    return `
    <div class="feature-pick-section card p-4 mb-3">
        <p class="feature-pick-title">Which utilities does this property use?</p>
        <p class="feature-pick-sub">Select types, then type the provider name below. Council tax band is set in Property Information.</p>
        ${renderFeaturePickGrid(UTILITY_CATALOG, {
            isActive: (item) => utilities[item.key] != null,
            action: 'toggle-utility',
            valueKey: 'key',
            labelKey: 'label',
        })}
    </div>`;
}

function utilityProviderPlaceholder(key) {
    const hints = {
        gas: 'e.g. British Gas, Octopus Energy',
        electric: 'e.g. Octopus Energy, EDF',
        water: 'e.g. Thames Water, Anglian Water',
        broadband: 'e.g. BT, Sky, Virgin Media',
        oil: 'e.g. Certas Energy, local LPG supplier',
        heating: 'e.g. Communal scheme, heat network',
    };
    return hints[key] || 'Enter provider name';
}

function renderUtilityProviderFields(meta) {
    migrateUtilityKeys(meta);
    const utilities = meta.utilities || {};
    const utilityCards = UTILITY_CATALOG
        .filter(u => utilities[u.key] != null)
        .map(u => {
            const entry = getUtilityEntry(meta, u.key) || {};
            return `<div class="utility-provider-card card p-4 mb-2">
                <div class="utility-provider-head">
                    <span class="feature-pick-chip-icon"><i data-lucide="${u.icon}" class="w-4 h-4"></i></span>
                    <p class="utility-provider-title">${u.label}</p>
                </div>
                <div><label class="form-label">Provider name</label><input data-field="util_${u.key}_provider" class="form-input" value="${escapeHtml(entry.provider || '')}" placeholder="${utilityProviderPlaceholder(u.key)}"></div>
                <div><label class="form-label">Meter number</label><input data-field="util_${u.key}_meter" class="form-input" value="${escapeHtml(entry.meterNumber || '')}" placeholder="e.g. MPAN / MPRN"></div>
                <div><label class="form-label">Meter location</label><input data-field="util_${u.key}_location" class="form-input" value="${escapeHtml(entry.meterLocation || '')}" placeholder="e.g. Under stairs cupboard"></div>
                <div><label class="form-label">Phone number</label><input data-field="util_${u.key}_phone" type="tel" class="form-input" value="${escapeHtml(entry.phone || '')}" placeholder="Provider contact"></div>
                <div><label class="form-label">Meter picture</label><input data-field="util_${u.key}_picture" class="form-input" value="${escapeHtml(entry.meterPicture || '')}" placeholder="Photo reference or filename"></div>
            </div>`;
        }).join('');
    const council = utilities.council || {};
    const councilCard = `
    <div class="utility-provider-card card p-4 mb-2">
        <div class="utility-provider-head">
            <span class="feature-pick-chip-icon"><i data-lucide="landmark" class="w-4 h-4"></i></span>
            <p class="utility-provider-title">Council</p>
        </div>
        <div><label class="form-label">Council name</label><input data-field="util_council_name" class="form-input" value="${escapeHtml(council.name || '')}" placeholder="e.g. Westminster City Council"></div>
        <div><label class="form-label">Notes <span class="text-[#94A3B8] font-normal">(optional)</span></label><textarea data-field="util_council_notes" class="form-input min-h-[72px] resize-none" placeholder="Account reference, contact details…">${escapeHtml(council.notes || '')}</textarea></div>
    </div>`;
    return `${utilityCards}${councilCard}`;
}

function escapeHtml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function normalizeSelectValue(value, options) {
    if (!value || value === '—') return '';
    const v = String(value).trim();
    if (options.includes(v)) return v;
    const lower = v.toLowerCase();
    const match = options.find(o => o.toLowerCase() === lower);
    if (match) return match;
    if (options === EPC_RATING_OPTIONS) {
        const letter = v.match(/[A-G]/i);
        if (letter) return letter[0].toUpperCase();
        if (/not rated/i.test(v)) return 'Not rated';
        if (/exempt/i.test(v)) return 'Exempt';
    }
    if (options === COUNCIL_TAX_BAND_OPTIONS) {
        const band = v.match(/band\s*([A-H])/i);
        if (band) return `Band ${band[1].toUpperCase()}`;
    }
    if (options === PROPERTY_TYPE_OPTIONS) {
        const fuzzy = options.find(o => o.toLowerCase().includes(lower) || lower.includes(o.toLowerCase()));
        if (fuzzy) return fuzzy;
    }
    if (options.includes('Other')) return 'Other';
    return v;
}

function formSelectField(label, key, options, value, { blankLabel = 'Not set' } = {}) {
    const selected = normalizeSelectValue(value, options);
    const opts = [`<option value="">${blankLabel}</option>`]
        .concat(options.map(o => `<option value="${escapeHtml(o)}"${o === selected ? ' selected' : ''}>${escapeHtml(o)}</option>`));
    return `<div><label class="form-label">${label}</label><select data-field="${key}" class="form-input form-select">${opts.join('')}</select></div>`;
}

function formatEpcDisplay(epc) {
    if (!epc || epc === '—') return '—';
    if (['Not rated', 'Exempt'].includes(epc)) return epc;
    if (/^Rating\s/i.test(epc)) return epc;
    if (/^[A-G]$/i.test(epc)) return `Rating ${epc.toUpperCase()}`;
    return epc;
}

function formatInfoDate(d) {
    if (!d) return '—';
    return typeof formatDisplayDate === 'function' ? (formatDisplayDate(d) || d) : d;
}

function saveEpcValue(raw) {
    if (!raw) return '';
    if (['Not rated', 'Exempt'].includes(raw)) return raw;
    return /^[A-G]$/i.test(raw) ? `Rating ${raw.toUpperCase()}` : raw;
}

/* ─── UI Helpers ─── */
const requiredLabel = (t) => `${t} <span class="form-required">*</span>`;

function inputPlaceholder(ph = '', label = '', type = 'text') {
    if (ph) return ph;
    if (type === 'date') return 'Select date';
    if (type === 'time') return 'Select time';
    if (type === 'tel') return '+44 7700 900000';
    if (type === 'email') return 'name@email.com';
    if (type === 'password') return label ? `${label}` : 'Enter password';
    return '';
}

/** @deprecated Use inputPlaceholder for inputs; pass explicit helper text only when it adds context. */
function fieldPlaceholderHint(ph = '', label = '', type = 'text') {
    return inputPlaceholder(ph, label, type);
}

const formFieldReq = (label, key, value = '', type = 'text', ph = '', helper = '') => {
    const err = STATE.formErrors[key];
    const placeholder = inputPlaceholder(ph, label, type);
    const hint = helper === false ? '' : (helper || '');
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="form-group ${err ? 'form-group-error' : ''}">
        <label class="form-label">${requiredLabel(label)}</label>
        <input type="${type}" data-field="${key}" class="form-input${err ? ' form-input-error' : ''}"${valAttr} placeholder="${placeholder}">
        ${hint ? `<p class="form-helper">${hint}</p>` : ''}
        ${err ? `<p class="form-error-msg"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${err}</p>` : ''}
    </div>`;
};

const inviteFormFieldReq = (label, key, value = '', type = 'text', ph = '', helper = '') => {
    const err = STATE.formErrors[key];
    const placeholder = inputPlaceholder(ph, label, type);
    const hint = helper === false ? '' : (helper || '');
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="form-group ${err ? 'form-group-error' : ''}">
        <label class="form-label">${requiredLabel(label)}</label>
        <input type="${type}" data-invite="${key}" data-field="${key}" class="form-input${err ? ' form-input-error' : ''}"${valAttr} placeholder="${placeholder}">
        ${hint ? `<p class="form-helper">${hint}</p>` : ''}
        ${err ? `<p class="form-error-msg"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${err}</p>` : ''}
    </div>`;
};

function inviteFormField(label, value = '', type = 'text', ph = '', key = '', helper = '') {
    const placeholder = inputPlaceholder(ph, label, type);
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    const fieldAttrs = key ? ` data-invite="${key}" data-field="${key}"` : '';
    return `<div class="form-group"><label class="form-label">${label}</label>
<input type="${type}" class="form-input"${fieldAttrs}${valAttr} placeholder="${placeholder}">
${helper ? `<p class="form-helper">${helper}</p>` : ''}</div>`;
}

function formFieldInlineReq(label, key, value = '', type = 'text', ph = '') {
    const err = STATE.formErrors[key];
    const placeholder = inputPlaceholder(ph, label, type);
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="unit-util-meter-row ${err ? 'form-group-error' : ''}">
        <label class="form-label unit-util-meter-label">${requiredLabel(label)}</label>
        <input type="${type}" data-field="${key}" class="form-input${err ? ' form-input-error' : ''}"${valAttr} placeholder="${placeholder}">
        ${err ? `<p class="form-error-msg unit-util-meter-error"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${err}</p>` : ''}
    </div>`;
}

function memberField(label, attr, type = 'text', ph = '', value = '') {
    const placeholder = inputPlaceholder(ph, label, type);
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="form-group mb-2">
        <label class="form-label">${label}</label>
        <input data-member-${attr} type="${type}" class="form-input" placeholder="${placeholder}"${valAttr}>
    </div>`;
}

function labeledInput(label, key, value = '', type = 'text', ph = '', required = false, helper = '') {
    const placeholder = inputPlaceholder(ph, label, type);
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="form-group">
        <label class="form-label">${required ? requiredLabel(label) : label}</label>
        <input data-field="${key}" type="${type}" class="form-input"${valAttr} placeholder="${placeholder}">
        ${helper ? `<p class="form-helper">${helper}</p>` : ''}
    </div>`;
}

const emptyState = (icon, title, desc, btnLabel, btnAction, btnGo) => `
<div class="empty-state card">
    <i data-lucide="${icon}" class="empty-state-icon"></i>
    <p class="empty-state-title">${title}</p>
    <p class="empty-state-desc">${desc}</p>
    ${btnGo ? `<button data-go="${btnGo}" class="btn-primary py-3 px-6 text-[13px]">${btnLabel}</button>` :
        btnAction ? `<button data-action="${btnAction}" class="btn-primary py-3 px-6 text-[13px]">${btnLabel}</button>` : ''}
</div>`;

const loadingBar = () => STATE.loading ? `<div class="app-loading-bar"></div>` : '';

const SKELETON_SCREENS = new Set(['dashboard', 'financial', 'property-detail']);

function showScreenSkeleton(screen) {
    return STATE.loading || STATE.screenLoading === screen;
}

function renderDashboardSkeleton() {
    return `${topBar('Home', { homeChrome: true })}
    <div class="screen-content skeleton-screen">
        <div class="skel-block skel-hero"></div>
        <div class="skel-grid-3">
            <div class="skel-block skel-stat"></div>
            <div class="skel-block skel-stat"></div>
            <div class="skel-block skel-stat"></div>
        </div>
        <div class="skel-card" style="margin-top:14px">
            <div class="skel-row" style="margin-bottom:12px">
                <div class="skel-circle" style="width:40px;height:40px"></div>
                <div style="flex:1">
                    <div class="skel-bar" style="width:55%"></div>
                    <div class="skel-bar skel-bar--sm" style="width:35%"></div>
                </div>
            </div>
            <div class="skel-bar skel-bar--sm" style="width:80%"></div>
            <div class="skel-bar skel-bar--sm" style="width:62%"></div>
        </div>
        <div class="skel-block skel-list-item" style="margin-top:14px"></div>
        <div class="skel-block skel-list-item"></div>
        <div class="skel-block skel-list-item"></div>
    </div>`;
}

function renderFinancialSkeleton() {
    return `${topBar('Finances')}
    <div class="screen-content skeleton-screen">
        <div class="skel-card">
            <div class="skel-bar" style="width:42%"></div>
            <div class="skel-row" style="justify-content:space-between;align-items:flex-end;margin-bottom:14px">
                <div style="flex:1">
                    <div class="skel-bar skel-bar--lg" style="width:58%"></div>
                    <div class="skel-bar skel-bar--sm" style="width:72%"></div>
                </div>
                <div class="skel-block skel-donut"></div>
            </div>
            <div class="skel-bar skel-bar--sm" style="width:55%"></div>
        </div>
        <div class="skel-block" style="height:48px;border-radius:14px;margin:14px 0"></div>
        <div class="skel-block" style="height:48px;border-radius:14px;margin-bottom:10px"></div>
        <div class="skel-block skel-list-item"></div>
        <div class="skel-block" style="height:64px;border-radius:14px;margin-top:14px"></div>
    </div>`;
}

function renderPropertyDetailSkeleton() {
    const { title, subtitle } = typeof propertySectionHeader === 'function'
        ? propertySectionHeader(STATE.propertyId)
        : { title: PROPERTIES[STATE.propertyId]?.name || 'Property', subtitle: PROPERTIES[STATE.propertyId]?.address || '' };
    return `${propSectionBar(title, subtitle)}
    <div class="screen-content skeleton-screen">
        <div class="skel-chip-row">
            <div class="skel-block skel-chip"></div>
            <div class="skel-block skel-chip"></div>
            <div class="skel-block skel-chip"></div>
            <div class="skel-block skel-chip"></div>
        </div>
        <div class="skel-card">
            <div class="skel-block" style="height:140px;border-radius:14px;margin-bottom:12px"></div>
            <div class="skel-bar" style="width:68%"></div>
            <div class="skel-bar skel-bar--sm" style="width:88%"></div>
            <div class="skel-bar skel-bar--sm" style="width:52%"></div>
        </div>
        <div class="skel-grid-2" style="margin-top:14px">
            <div class="skel-block skel-stat"></div>
            <div class="skel-block skel-stat"></div>
        </div>
        <div class="skel-block skel-list-item" style="margin-top:14px"></div>
        <div class="skel-block skel-list-item"></div>
    </div>`;
}

const confirmModal = () => {
    if (!STATE.confirm) return '';
    const c = STATE.confirm;
    return `<div class="modal-overlay open" data-action="confirm-cancel">
        <div class="modal-sheet">
            <h3 class="modal-title">${c.title}</h3>
            <p class="modal-body">${c.message}</p>
            <div class="modal-actions">
                <button type="button" data-action="confirm-cancel" class="btn-secondary flex-1 py-3 text-[14px]">Cancel</button>
                <button type="button" data-action="confirm-ok" class="btn-primary flex-1 py-3 text-[14px] ${c.danger ? 'btn-danger' : ''}">${c.okLabel || 'Confirm'}</button>
            </div>
        </div>
    </div>`;
};

const photoActionSheet = () => {
    if (STATE.photoMenuIdx == null || STATE.screen !== 'property-photos') return '';
    const idx = STATE.photoMenuIdx;
    const meta = AppStore.meta(STATE.propertyId);
    const photos = meta.photos?.length ? meta.photos : [IMG.props[STATE.propertyId]];
    const isCover = idx === 0;
    return `<div class="modal-overlay open" data-action="close-photo-menu">
        <div class="photo-action-sheet">
            ${!isCover ? `<button type="button" data-action="set-cover-photo" data-idx="${idx}" class="photo-action-item">Set as cover</button>` : ''}
            ${photos.length > 1 ? `<button type="button" data-action="delete-photo" data-idx="${idx}" class="photo-action-item danger">Remove photo</button>` : ''}
            <button type="button" data-action="close-photo-menu" class="photo-action-item cancel">Cancel</button>
        </div>
    </div>`;
};

const floorPlanActionSheet = () => {
    if (STATE.floorPlanMenuIdx == null || STATE.screen !== 'property-floor-plans') return '';
    const idx = STATE.floorPlanMenuIdx;
    return `<div class="modal-overlay open" data-action="close-floor-plan-menu">
        <div class="photo-action-sheet">
            <button type="button" data-action="remove-floor-plan" data-idx="${idx}" class="photo-action-item danger">Remove floor plan</button>
            <button type="button" data-action="close-floor-plan-menu" class="photo-action-item cancel">Cancel</button>
        </div>
    </div>`;
};

const renameDocModal = () => {
    if (STATE.renameDocId == null) return '';
    const doc = AppStore.documents.find(d => d.id === STATE.renameDocId);
    const value = escapeHtml(STATE.renameDocValue ?? doc?.name ?? '');
    return `<div class="modal-overlay open" data-action="close-rename-doc">
        <div class="modal-sheet">
            <h3 class="modal-title">Edit document</h3>
            <p class="modal-body">Choose a clear name tenants and contractors will recognise.</p>
            <input type="text" data-rename-doc-input class="form-input mb-4" value="${value}" placeholder="Document name">
            <div class="modal-actions">
                <button type="button" data-action="close-rename-doc" class="btn-secondary flex-1 py-3 text-[14px]">Cancel</button>
                <button type="button" data-action="confirm-rename-doc" class="btn-primary flex-1 py-3 text-[14px]">Save</button>
            </div>
        </div>
    </div>`;
};

const ADD_DOC_TYPE_OPTIONS = [
    { type: 'Tenancy Agreement', label: 'Tenancy agreement', icon: 'file-text', color: '#2563EB', bg: '#EFF6FF' },
    { type: 'Gas Certificate', label: 'Gas safety (CP12)', icon: 'flame', color: '#DC2626', bg: '#FEE2E2' },
    { type: 'Electrical Certificate', label: 'Electrical (EICR)', icon: 'zap', color: '#D97706', bg: '#FEF3C7' },
    { type: 'EPC Certificate', label: 'EPC certificate', icon: 'leaf', color: '#16A34A', bg: '#ECFDF5' },
    { type: 'Deposit Certificate', label: 'Deposit protection', icon: 'shield', color: '#059669', bg: '#DCFCE7' },
    { type: 'How to Rent Guide', label: 'How to Rent guide', icon: 'book-open', color: '#7C3AED', bg: '#F3E8FF' },
    { type: 'Custom Document', label: 'Other file', icon: 'file', color: '#64748B', bg: '#F1F5F9' },
];

function addDocumentTypeOption(type) {
    return ADD_DOC_TYPE_OPTIONS.find(o => o.type === type) || ADD_DOC_TYPE_OPTIONS[ADD_DOC_TYPE_OPTIONS.length - 1];
}

function addDocumentTypeOptionsForContext() {
    if (STATE.addDocumentTenantId != null || STATE.addDocumentUnit) return ADD_DOC_TYPE_OPTIONS;
    if (typeof getRecordsDocumentUploadOptions === 'function') return getRecordsDocumentUploadOptions();
    return ADD_DOC_TYPE_OPTIONS;
}

function addDocumentTypeVisual(type, folderId = null) {
    if (folderId && typeof DOC_FOLDER_DEFS !== 'undefined') {
        const folder = DOC_FOLDER_DEFS.find(f => f.id === folderId);
        if (folder) return { label: folder.label, icon: folder.icon, color: folder.color, bg: folder.bg };
    }
    const opt = addDocumentTypeOption(type);
    return opt ? { label: opt.label, icon: opt.icon, color: opt.color, bg: opt.bg } : { label: type, icon: 'file', color: '#64748B', bg: '#F1F5F9' };
}

function addDocumentContextLabel() {
    const p = PROPERTIES[STATE.propertyId];
    if (STATE.addDocumentUnit) return `Flat · ${STATE.addDocumentUnit}${p?.name ? ` · ${p.name}` : ''}`;
    if (STATE.addDocumentTenantId != null) {
        const t = TENANT_LIST[STATE.addDocumentTenantId];
        return `Tenant · ${t?.name || 'Tenant'}${t?.unit ? ` · ${t.unit}` : ''}`;
    }
    return `Property · ${p?.name || 'Building'}`;
}

function folderLabelForUpload(folderId) {
    if (!folderId || typeof DOC_FOLDER_DEFS === 'undefined') return null;
    return DOC_FOLDER_DEFS.find(f => f.id === folderId)?.label || null;
}

function applyFolderNameHint(name, folderId) {
    if (!folderId || !name) return name;
    const lower = name.toLowerCase();
    if (folderId === 'fire' && !/fire|smoke|alarm/i.test(lower)) return `Fire Safety - ${name}`;
    if (folderId === 'insurance' && !/insurance/i.test(lower)) return `Insurance - ${name}`;
    return name;
}

function resetAddDocumentState() {
    STATE.addDocumentOpen = false;
    STATE.addDocumentStep = 'type';
    STATE.addDocumentType = null;
    STATE.addDocumentFile = null;
    STATE.addDocumentDisplayName = '';
    STATE.addDocumentShare = false;
    STATE.addDocumentReplaceId = null;
    STATE.addDocumentFolderId = null;
    STATE.addDocumentUnit = null;
    STATE.addDocumentTenantId = null;
    STATE.addDocumentSkipType = false;
}

function closeAddDocumentFlow() {
    resetAddDocumentState();
    render();
}

function openAddDocumentSlot(docType, replaceDocId = null, opts = {}) {
    if (opts.propertyId != null) STATE.propertyId = opts.propertyId;
    if (opts.unit != null) STATE.addDocumentUnit = opts.unit;
    if (opts.tenantId != null) STATE.addDocumentTenantId = opts.tenantId;
    if (opts.folderId != null) STATE.addDocumentFolderId = opts.folderId;
    STATE.addDocumentSkipType = !!opts.skipType || !!opts.folderId;
    const folderLabel = folderLabelForUpload(STATE.addDocumentFolderId);
    const opt = addDocumentTypeVisual(docType, STATE.addDocumentFolderId);
    STATE.addDocumentOpen = true;
    STATE.addDocumentStep = 'file';
    STATE.addDocumentType = docType;
    STATE.addDocumentReplaceId = replaceDocId ?? null;
    STATE.addDocumentFile = null;
    STATE.addDocumentDisplayName = replaceDocId ? '' : (folderLabel || opt?.label || '');
    STATE.addDocumentShare = false;
    STATE.actionMenuKey = null;
    render();
}

function replaceDocumentSlot(docId) {
    const doc = AppStore.documents.find(d => d.id === docId);
    if (!doc) { toast('Document not found'); return; }
    openAddDocumentSlot(doc.type, docId);
}

function docForPropertyByType(propertyId, type) {
    return AppStore.docsForProperty(propertyId).find(d => d.type === type) || null;
}

function renderLandlordDocSlot(propertyId, slotOpt) {
    const doc = docForPropertyByType(propertyId, slotOpt.type);
    if (doc) {
        return `
        <div class="landlord-doc-slot landlord-doc-slot--filled">
            <button type="button" data-go="document-preview" data-doc="${doc.id}" class="landlord-doc-slot-preview" style="color:${slotOpt.color};background:${slotOpt.bg}">
                <i data-lucide="${slotOpt.icon}" class="w-7 h-7"></i>
                <span class="landlord-doc-slot-view"><i data-lucide="eye" class="w-3.5 h-3.5"></i></span>
            </button>
            <div class="landlord-doc-slot-toolbar">
                <button type="button" data-action="replace-document-slot" data-doc="${doc.id}" class="landlord-doc-slot-btn" aria-label="Replace file"><i data-lucide="upload" class="w-3.5 h-3.5"></i></button>
                <button type="button" data-action="delete-document" data-doc="${doc.id}" class="landlord-doc-slot-btn landlord-doc-slot-btn--danger" aria-label="Delete file"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
            <p class="landlord-doc-slot-label">${escapeHtml(slotOpt.label)}</p>
            <p class="landlord-doc-slot-meta">${escapeHtml(doc.name)}</p>
            <p class="landlord-doc-slot-date">${escapeHtml(doc.date || '')}</p>
        </div>`;
    }
    return `
    <button type="button" data-action="open-add-document-slot" data-doc-type="${slotOpt.type}" class="landlord-doc-slot landlord-doc-slot--empty">
        <span class="landlord-doc-slot-preview landlord-doc-slot-preview--empty">
            <i data-lucide="plus" class="w-6 h-6"></i>
        </span>
        <span class="landlord-doc-slot-label">${escapeHtml(slotOpt.label)}</span>
        <span class="landlord-doc-slot-meta landlord-doc-slot-meta--hint">Tap to upload</span>
    </button>`;
}

function renderLandlordDocSlotGrid(propertyId) {
    const slots = ADD_DOC_TYPE_OPTIONS.filter(o => o.type !== 'Custom Document');
    const customDocs = AppStore.docsForProperty(propertyId).filter(d => d.type === 'Custom Document');
    return `
        <div class="landlord-doc-grid">
            ${slots.map(slot => renderLandlordDocSlot(propertyId, slot)).join('')}
        </div>
        <p class="txn-section-label txn-section-label--spaced">Other files</p>
        ${customDocs.length ? `<div class="doc-list mb-3">${customDocs.map(d => renderDocumentRow(d, propertyId)).join('')}</div>` : `
        <p class="text-[12px] text-[#64748B] mb-3">Insurance, inventories, or any extra files for this property.</p>`}
        <button type="button" data-action="open-add-document-slot" data-doc-type="Custom Document" class="btn-secondary w-full py-3 text-[13px]">+ Add other file</button>`;
}

function openAddDocumentFlow(opts = {}) {
    if (opts.propertyId != null) STATE.propertyId = opts.propertyId;
    STATE.addDocumentUnit = opts.unit ?? null;
    STATE.addDocumentTenantId = opts.tenantId ?? null;
    STATE.addDocumentFolderId = opts.folderId ?? null;
    STATE.actionMenuKey = null;
    if (opts.folderId && typeof docTypeForFolder === 'function') {
        openAddDocumentSlot(docTypeForFolder(opts.folderId), null, { ...opts, skipType: true });
        return;
    }
    if (opts.docType) {
        openAddDocumentSlot(opts.docType, null, opts);
        return;
    }
    STATE.addDocumentOpen = true;
    STATE.addDocumentStep = 'type';
    STATE.addDocumentType = null;
    STATE.addDocumentFile = null;
    STATE.addDocumentDisplayName = '';
    STATE.addDocumentShare = false;
    STATE.addDocumentReplaceId = null;
    STATE.addDocumentSkipType = false;
    render();
}

function selectAddDocumentType(type, folderId = null) {
    STATE.addDocumentType = type;
    if (folderId) STATE.addDocumentFolderId = folderId;
    const folderLabel = folderLabelForUpload(STATE.addDocumentFolderId);
    const opt = addDocumentTypeVisual(type, STATE.addDocumentFolderId);
    if (!STATE.addDocumentDisplayName) STATE.addDocumentDisplayName = folderLabel || opt?.label || '';
    STATE.addDocumentStep = 'file';
    render();
}

function addDocumentBackStep() {
    if (STATE.addDocumentStep === 'review') {
        STATE.addDocumentStep = 'file';
        STATE.addDocumentFile = null;
        STATE.addDocumentDisplayName = '';
    } else if (STATE.addDocumentStep === 'file') {
        if (STATE.addDocumentSkipType) {
            closeAddDocumentFlow();
            return;
        }
        STATE.addDocumentStep = 'type';
        STATE.addDocumentType = null;
        STATE.addDocumentFolderId = null;
    } else {
        closeAddDocumentFlow();
        return;
    }
    render();
}

async function pickAddDocumentFileAction() {
    const files = await pickDocumentFiles({ multiple: false });
    if (!files.length) return;
    STATE.addDocumentFile = files[0];
    STATE.addDocumentDisplayName = files[0].name;
    STATE.addDocumentStep = 'review';
    render();
}

function syncDocToTenantPortal(doc, tenantId) {
    if (tenantId == null) return;
    if (!AppStore.tenantDocuments[tenantId]) AppStore.tenantDocuments[tenantId] = [];
    const ic = doc.mime?.startsWith('image/') ? 'file-image' : 'file-text';
    const color = DOC_TYPE_COLORS[doc.type] || '#2563EB';
    if (!AppStore.tenantDocuments[tenantId].some(d => d[1] === doc.name)) {
        AppStore.tenantDocuments[tenantId].push([ic, doc.name, doc.date || 'Just now', color]);
    }
}

function saveAddDocumentAction() {
    if (!STATE.addDocumentFile || !STATE.addDocumentType) {
        toast('Choose a file to save');
        return;
    }
    const input = document.querySelector('[data-add-doc-name]');
    const rawName = (input?.value?.trim() || STATE.addDocumentDisplayName || STATE.addDocumentFile.name).trim();
    if (!rawName) {
        toast('Enter a document name');
        return;
    }
    const name = applyFolderNameHint(rawName, STATE.addDocumentFolderId);
    const shareTargets = getPropertyNotifyTargets(STATE.propertyId);
    const shareTargetIds = getSelectedNotifyTargetIds();
    const shareNow = shareTargets.length && shareTargetIds.length > 0;
    const now = Date.now();
    const replaceId = STATE.addDocumentReplaceId;
    if (replaceId != null) {
        AppStore.documents = AppStore.documents.filter(d => d.id !== replaceId);
    }
    const id = AppStore.nextId(AppStore.documents);
    const doc = {
        id,
        propertyId: STATE.propertyId,
        type: STATE.addDocumentType,
        name,
        date: formatDocUploadDate(),
        uploadedAt: now,
        shared: shareNow,
        signed: false,
        userUpload: true,
        fileUrl: STATE.addDocumentFile.url,
        mime: STATE.addDocumentFile.mime,
    };
    if (STATE.addDocumentUnit) doc.unit = STATE.addDocumentUnit;
    if (STATE.addDocumentFolderId) doc.folderId = STATE.addDocumentFolderId;
    AppStore.documents.push(doc);
    if (STATE.addDocumentTenantId != null) syncDocToTenantPortal(doc, STATE.addDocumentTenantId);
    if (shareNow && typeof syncSharedDocToTenants === 'function') {
        syncSharedDocToTenants(doc, shareTargetIds);
        shareTargetIds.forEach(tid => {
            pushNotification({
                icon: 'file-text', color: ['#EFF6FF', '#2563EB'],
                title: 'New document shared', desc: `${doc.name} · ${PROPERTIES[doc.propertyId]?.name}`,
                time: 'Just now', unread: true, screen: 'tenant-detail', opts: { tid, tenantTab: 'documents' },
            });
        });
    }
    AppStore.save();
    const savedFolderId = STATE.docFolderId;
    const wasReplace = replaceId != null;
    resetAddDocumentState();
    toast(shareNow ? `Document saved — shared with ${shareTargetIds.length} tenant(s)` : wasReplace ? 'Document replaced' : 'Document saved');
    if (STATE.screen === 'property-doc-folder' && savedFolderId) STATE.docFolderId = savedFolderId;
    render();
}

const addDocumentModal = () => {
    if (!STATE.addDocumentOpen) return '';
    const step = STATE.addDocumentStep || 'type';
    const typeOpt = STATE.addDocumentType
        ? addDocumentTypeVisual(STATE.addDocumentType, STATE.addDocumentFolderId)
        : null;
    const replacing = STATE.addDocumentReplaceId != null;
    const typeOptions = addDocumentTypeOptionsForContext();
    const contextLabel = addDocumentContextLabel();
    const stepTitle = step === 'type' ? 'Upload document'
        : step === 'file' ? (replacing ? 'Replace file' : 'Upload file')
        : (replacing ? 'Confirm replace' : 'Review & save');
    const stepBody = step === 'type'
        ? `<p class="modal-body">Choose what you are uploading for <strong>${escapeHtml(contextLabel)}</strong>.</p>
            <div class="add-doc-type-list">
                ${typeOptions.map(o => `
                <button type="button" data-action="select-doc-type" data-doc-type="${o.type}"${o.folderId ? ` data-folder="${o.folderId}"` : ''} class="add-doc-type-row">
                    <span class="add-doc-type-icon" style="color:${o.color};background:${o.bg}"><i data-lucide="${o.icon}" class="w-5 h-5"></i></span>
                    <span class="add-doc-type-label">${o.label}</span>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1]"></i>
                </button>`).join('')}
            </div>`
        : step === 'file'
            ? `<p class="modal-body">Upload a PDF or image for <strong>${escapeHtml(typeOpt?.label || 'this document')}</strong> · ${escapeHtml(contextLabel)}.</p>
                <button type="button" data-action="pick-add-document-file" class="doc-upload-zone doc-upload-zone--modal">
                    <i data-lucide="upload" class="w-5 h-5"></i>
                    <span class="doc-upload-label">Choose file</span>
                    <span class="doc-upload-hint">PDF, JPG or PNG</span>
                </button>`
            : `<p class="modal-body">Check the details before saving to <strong>${escapeHtml(contextLabel)}</strong>.</p>
                <div class="add-doc-review card p-4">
                    <div class="add-doc-review-type">
                        <span class="add-doc-type-icon" style="color:${typeOpt.color};background:${typeOpt.bg}"><i data-lucide="${typeOpt.icon}" class="w-5 h-5"></i></span>
                        <div class="min-w-0">
                            <p class="add-doc-review-kind">${escapeHtml(typeOpt.label)}</p>
                            <p class="add-doc-review-file">${escapeHtml(STATE.addDocumentFile?.name || '')}</p>
                        </div>
                    </div>
                </div>
                <div class="form-field mt-3">
                    <label class="form-label">Display name</label>
                    <input type="text" data-add-doc-name class="form-input" value="${escapeHtml(STATE.addDocumentDisplayName || '')}" placeholder="Document name">
                </div>
                ${!STATE.addDocumentUnit && !STATE.addDocumentTenantId && getPropertyNotifyTargets(STATE.propertyId).length
                    ? `<div class="mt-3">${renderTenantNotifySection(STATE.propertyId, { title: 'Share with tenants', hint: 'Select who should see this in their tenant portal. Use Notify all for multi-flat buildings.' })}</div>`
                    : STATE.addDocumentUnit || STATE.addDocumentTenantId
                        ? `<p class="form-helper mt-3">This file is saved to the flat and linked to the tenant profile.</p>`
                        : `<p class="form-helper mt-3">Invite tenants to this property to share documents with them.</p>`}
                <button type="button" data-action="save-add-document" class="btn-primary w-full py-3.5 text-[14px] mt-4">Save document</button>`;
    return `<div class="modal-overlay open" data-action="close-add-document">
        <div class="modal-sheet modal-sheet--tall">
            <div class="add-doc-modal-head">
                ${step !== 'type' ? `<button type="button" data-action="add-document-back" class="add-doc-back-btn" aria-label="Back"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>` : '<span class="add-doc-back-spacer"></span>'}
                <h3 class="modal-title add-doc-modal-title">${stepTitle}</h3>
                <button type="button" data-action="close-add-document" class="add-doc-close-btn" aria-label="Close"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <p class="add-doc-context-label">${escapeHtml(contextLabel)}</p>
            ${stepBody}
        </div>
    </div>`;
};

const newMessagePickerModal = () => {
    if (!STATE.newMessagePicker) return '';
    const convos = typeof conversationsForRole === 'function' ? conversationsForRole() : CONVERSATIONS;
    return `<div class="modal-overlay open" data-action="close-new-message">
        <div class="modal-sheet modal-sheet--tall">
            <h3 class="modal-title">New message</h3>
            <p class="modal-body">Choose who to message</p>
            <div class="picker-list">
                ${convos.length ? convos.map(c => `
                <button type="button" data-action="pick-message-chat" data-chat="${c.id}" class="picker-row">
                    <img src="${c.img}" class="picker-row-avatar" alt="">
                    <span class="picker-row-body">
                        <span class="picker-row-title">${escapeHtml(c.name)}</span>
                        <span class="picker-row-meta">${escapeHtml(c.sub)}</span>
                    </span>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1]"></i>
                </button>`).join('') : `<p class="text-[13px] text-[#64748B] py-4 text-center">No contacts available yet</p>`}
            </div>
            <button type="button" data-action="close-new-message" class="btn-secondary w-full py-3 text-[14px] mt-3">Cancel</button>
        </div>
    </div>`;
};

function showConfirm(title, message, onOk, opts = {}) {
    STATE.confirm = { title, message, onOk, okLabel: opts.okLabel, danger: opts.danger };
    render();
}

function withLoading(fn) {
    STATE.loading = true;
    render();
    setTimeout(() => {
        fn();
        STATE.loading = false;
        render();
    }, 400);
}

function clearFormErrors() { STATE.formErrors = {}; }

function validateFields(rules) {
    clearFormErrors();
    let ok = true;
    rules.forEach(([key, label, test]) => {
        const el = document.querySelector(`[data-field="${key}"]`);
        const val = el?.value?.trim() || '';
        if (!test(val)) { STATE.formErrors[key] = `${label} is required`; ok = false; }
    });
    if (!ok) { toastError('Please fix the errors below'); render(); }
    return ok;
}

function fieldVal(key) {
    const el = document.querySelector(`[data-field="${key}"]`);
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    return (el.value ?? '').trim();
}

const INVENTORY_LEGACY_ROOM_SLUGS = ['kitchen-0', 'reception-0', 'bedroom-0', 'bathroom-0', 'hallway-0'];

const INVENTORY_ROOM_TEMPLATES = {
    Kitchen: ['Oven / hob', 'Fridge freezer', 'Microwave', 'Extractor fan', 'Worktops'],
    'Living room': ['Sofa', 'Coffee table', 'Curtains / blinds', 'Flooring', 'Radiator'],
    Bedroom: ['Bed frame', 'Mattress', 'Wardrobe', 'Curtains / blinds', 'Radiator'],
    Bathroom: ['Bath / shower', 'Toilet', 'Basin', 'Tiles / grouting', 'Extractor fan'],
    Hallway: ['Smoke alarm', 'CO alarm', 'Flooring', 'Doors', 'Lighting'],
};

function migrateInventoryKeys() {
    if (!AppStore.inventory) return;
    Object.keys({ ...AppStore.inventory }).forEach(key => {
        const match = key.match(/^(\d+)-(\d+)$/);
        if (!match) return;
        const slug = INVENTORY_LEGACY_ROOM_SLUGS[+match[2]];
        if (!slug) return;
        const newKey = `${match[1]}-${slug}`;
        if (!AppStore.inventory[newKey]) AppStore.inventory[newKey] = AppStore.inventory[key];
        delete AppStore.inventory[key];
    });
}

function getInventoryRoomCatalog(propertyId) {
    const layout = getPropertyInventoryLayout(propertyId);
    const catalog = [];
    const kitchens = Math.max(1, +layout.kitchens || 1);
    const reception = Math.max(1, +layout.reception || 1);
    const bedrooms = Math.max(1, +layout.bedrooms || 1);
    const bathrooms = Math.max(1, +layout.bathrooms || 1);
    for (let i = 0; i < kitchens; i++) {
        catalog.push({
            slug: `kitchen-${i}`,
            name: kitchens === 1 ? 'Kitchen' : `Kitchen ${i + 1}`,
            template: 'Kitchen',
            icon: 'utensils',
        });
    }
    for (let i = 0; i < reception; i++) {
        catalog.push({
            slug: `reception-${i}`,
            name: reception === 1 ? 'Living room' : `Living room ${i + 1}`,
            template: 'Living room',
            icon: 'sofa',
        });
    }
    for (let i = 0; i < bedrooms; i++) {
        catalog.push({
            slug: `bedroom-${i}`,
            name: bedrooms === 1 ? 'Bedroom' : `Bedroom ${i + 1}`,
            template: 'Bedroom',
            icon: 'bed-double',
        });
    }
    for (let i = 0; i < bathrooms; i++) {
        catalog.push({
            slug: `bathroom-${i}`,
            name: bathrooms === 1 ? 'Bathroom' : `Bathroom ${i + 1}`,
            template: 'Bathroom',
            icon: 'bath',
        });
    }
    catalog.push({ slug: 'hallway-0', name: 'Hallway', template: 'Hallway', icon: 'door-open' });
    return catalog;
}

function resolveInventoryRoomSlug(propertyId, roomRef) {
    if (typeof roomRef === 'string' && roomRef.includes('-')) return roomRef;
    const catalog = getInventoryRoomCatalog(propertyId);
    const idx = +roomRef || 0;
    return catalog[idx]?.slug || catalog[0]?.slug || 'kitchen-0';
}

function inventoryKey(pid, roomRef) {
    return `${pid}-${resolveInventoryRoomSlug(pid, roomRef ?? 0)}`;
}

function inventoryRoomMeta(propertyId, roomRef) {
    const catalog = getInventoryRoomCatalog(propertyId);
    const idx = typeof roomRef === 'number' || (typeof roomRef === 'string' && /^\d+$/.test(roomRef))
        ? (+roomRef || 0)
        : catalog.findIndex(r => r.slug === roomRef);
    return catalog[idx >= 0 ? idx : 0] || catalog[0];
}

function inventoryRoomName(propertyId, roomRef) {
    return inventoryRoomMeta(propertyId, roomRef).name;
}

function inventoryItemName(item) {
    return Array.isArray(item) ? (item[0] || '') : String(item || '');
}

function getDefaultItemsForRoom(roomName) {
    return INVENTORY_ROOM_TEMPLATES[roomName] || ['General fixture'];
}

function ensureInventoryRoom(pid, roomRef) {
    const meta = inventoryRoomMeta(pid, roomRef);
    const key = inventoryKey(pid, meta.slug);
    if (!AppStore.inventory[key]) {
        AppStore.inventory[key] = {
            notes: '',
            items: getDefaultItemsForRoom(meta.template),
            photos: [],
        };
    } else {
        if (AppStore.inventory[key].items?.length) {
            AppStore.inventory[key].items = AppStore.inventory[key].items.map(inventoryItemName);
        } else {
            AppStore.inventory[key].items = getDefaultItemsForRoom(meta.template);
        }
        delete AppStore.inventory[key].condition;
    }
    return AppStore.inventory[key];
}

function getPropertyInventoryLayout(propertyId) {
    const meta = AppStore.meta(propertyId);
    if (meta.inventoryLayout) return meta.inventoryLayout;
    return syncInventoryLayoutFromUnits(propertyId, false);
}

function syncInventoryLayoutFromUnits(propertyId, persist = true) {
    const units = getPropertyUnits(propertyId);
    let layout;
    if (!units.length) {
        layout = { bedrooms: 1, bathrooms: 1, kitchens: 1, reception: 1 };
    } else if (units.length === 1) {
        const u = units[0];
        layout = {
            bedrooms: Math.max(1, +u.beds || 1),
            bathrooms: Math.max(1, +u.baths || 1),
            kitchens: 1,
            reception: 1,
        };
    } else {
        const primary = units.reduce((best, u) => ((+u.beds || 0) > (+best.beds || 0) ? u : best), units[0]);
        layout = {
            bedrooms: Math.max(1, +primary.beds || 1),
            bathrooms: Math.max(1, +primary.baths || 1),
            kitchens: 1,
            reception: 1,
            multiUnit: true,
        };
    }
    if (persist) {
        AppStore.meta(propertyId).inventoryLayout = { ...layout };
        AppStore.save();
    }
    return layout;
}

function inventoryLayoutSummaryLine(layout) {
    const parts = [
        `${layout.bedrooms} bed${layout.bedrooms === 1 ? '' : 's'}`,
        `${layout.bathrooms} bath${layout.bathrooms === 1 ? '' : 's'}`,
        `${layout.kitchens} kitchen${layout.kitchens === 1 ? '' : 's'}`,
        `${layout.reception} reception`,
    ];
    return parts.join(' · ');
}

function inventoryConditionBadgeClass(condition) {
    if (condition === 'Good') return 'bg-[#DCFCE7] text-[#16A34A]';
    if (condition === 'Fair') return 'bg-[#FEF3C7] text-[#D97706]';
    return 'bg-[#FEE2E2] text-[#DC2626]';
}

function getInventoryRooms(propertyId = STATE.propertyId) {
    return getInventoryRoomCatalog(propertyId).map((room, i) => {
        const inv = ensureInventoryRoom(propertyId, room.slug);
        const photoCount = inv.photos?.length || 0;
        const itemCount = inv.items?.length || 0;
        const notes = inv.notes?.trim();
        const sub = notes
            ? truncateNote(notes, 52)
            : `${itemCount} item${itemCount === 1 ? '' : 's'}${photoCount ? ` · ${photoCount} photo${photoCount === 1 ? '' : 's'}` : ''}`;
        return [room.name, sub, room.icon, i];
    });
}

function inventoryHubLabel(propertyId) {
    const layout = getPropertyInventoryLayout(propertyId);
    const rooms = getInventoryRoomCatalog(propertyId);
    return `${inventoryLayoutSummaryLine(layout)} · ${rooms.length} room${rooms.length === 1 ? '' : 's'}`;
}

function renderInventoryLayoutSection(propertyId) {
    const layout = getPropertyInventoryLayout(propertyId);
    const editing = STATE.editingInventoryLayout;
    if (editing) {
        return `
        <div class="card p-4 inventory-layout-card">
            <p class="form-section-title">Property layout</p>
            <p class="form-helper mb-3">Beds, baths and rooms for check-in / check-out inventory.</p>
            <div class="grid grid-cols-2 gap-3">
                <div class="form-field"><label class="form-label">Bedrooms</label><input data-field="invBedrooms" type="number" min="0" class="form-input" value="${layout.bedrooms}"></div>
                <div class="form-field"><label class="form-label">Bathrooms</label><input data-field="invBathrooms" type="number" min="0" class="form-input" value="${layout.bathrooms}"></div>
                <div class="form-field"><label class="form-label">Kitchens</label><input data-field="invKitchens" type="number" min="0" class="form-input" value="${layout.kitchens}"></div>
                <div class="form-field"><label class="form-label">Reception rooms</label><input data-field="invReception" type="number" min="0" class="form-input" value="${layout.reception}"></div>
            </div>
            <div class="flex gap-2 mt-3">
                <button type="button" data-action="save-inventory-layout" class="btn-primary flex-1 py-2.5 text-[13px]">Save layout</button>
                <button type="button" data-action="sync-inventory-layout-units" class="btn-secondary flex-1 py-2.5 text-[13px]">Pull from units</button>
            </div>
            <button type="button" data-action="toggle-inventory-layout-edit" class="btn-secondary w-full py-2.5 text-[13px] mt-2">Cancel</button>
        </div>`;
    }
    return `
    <div class="card p-4 inventory-layout-card">
        <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <p class="form-section-title">Property layout</p>
                <p class="inventory-layout-line">${inventoryLayoutSummaryLine(layout)}</p>
                ${layout.multiUnit ? `<p class="form-helper mt-1">Typical unit layout · ${getPropertyUnits(propertyId).length} units in building</p>` : ''}
            </div>
            <button type="button" data-action="toggle-inventory-layout-edit" class="header-text-link shrink-0">Edit</button>
        </div>
    </div>`;
}

function renderPropertyInventoryTab(propertyId) {
    const rooms = getInventoryRooms(propertyId);
    return `
    <div class="screen-content screen-content-sm">
        ${uxTip('Record each room at check-in and check-out. Add custom items for anything not in the default list.', 'How inventory works')}
        ${renderInventoryLayoutSection(propertyId)}
        <p class="screen-section-title mt-2">Room checklists</p>
        <div class="stack-sm">
        ${rooms.map(([r, n, icon, idx]) => `
        <button data-go="inventory-room" data-pid="${propertyId}" data-room="${idx}" class="card w-full p-4 flex items-center justify-between card-hover text-left">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0"><i data-lucide="${icon || 'package'}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                <div class="min-w-0"><p class="text-[13px] font-semibold">${r}</p><p class="text-[11px] text-[#64748B] truncate">${n}</p></div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
        </button>`).join('')}
        </div>
    </div>`;
}

function getInventoryItems(pid, rid) {
    return ensureInventoryRoom(pid, rid).items.map(inventoryItemName);
}

function getInventoryNotes(pid, rid) {
    return ensureInventoryRoom(pid, rid).notes?.trim() || '';
}

function initInventoryEditItems() {
    STATE.inventoryEditItems = getInventoryItems(STATE.propertyId, STATE.roomId ?? 0);
}

function addInventoryEditItem(name = '') {
    if (!STATE.inventoryEditItems) initInventoryEditItems();
    STATE.inventoryEditItems.push(name);
    render();
}

function removeInventoryEditItem(idx) {
    if (!STATE.inventoryEditItems) return;
    STATE.inventoryEditItems.splice(idx, 1);
    render();
}

function collectInventoryEditItemsFromDom() {
    const rows = document.querySelectorAll('[data-inventory-item-row]');
    const items = [];
    rows.forEach(row => {
        const name = row.querySelector('[data-inventory-item-name]')?.value?.trim();
        if (name) items.push(name);
    });
    return items.length ? items : (STATE.inventoryEditItems || []);
}

function screenInventoryRoomEnhanced() {
    const rid = STATE.roomId ?? 0;
    const rooms = getInventoryRooms(STATE.propertyId);
    const room = rooms[rid] || rooms[0];
    const items = getInventoryItems(STATE.propertyId, rid);
    const notes = getInventoryNotes(STATE.propertyId, rid);
    const invKey = inventoryKey(STATE.propertyId, rid);
    const roomPhotos = AppStore.inventory[invKey]?.photos || [];
    const photoPreview = typeof renderPhotoPreviewStrip === 'function'
        ? renderPhotoPreviewStrip(roomPhotos, { removable: true, removeAction: 'remove-inventory-photo' })
        : '';
    const layout = getPropertyInventoryLayout(STATE.propertyId);
    return `${topBar(room[0], { back: true })}
    <div class="screen-content screen-enter">
        <p class="form-helper">${inventoryLayoutSummaryLine(layout)}</p>
        <div class="flex items-center justify-end mt-2">
            <button data-go="edit-inventory-room" data-room="${rid}" class="text-[13px] font-semibold text-[#2563EB]">Edit room</button>
        </div>
        ${photoPreview}
        <button type="button" data-action="upload-photo" class="btn-secondary w-full py-3 text-[13px]">+ Add room photos</button>
        <div class="card p-4 mt-3">
            <h3 class="text-[14px] font-bold mb-2">Items in this room</h3>
            ${items.length ? items.map(item => `
            <div class="text-[13px] py-2 border-b border-[#F1F5F9] last:border-0">
                <span class="font-medium">${escapeHtml(item)}</span>
            </div>`).join('') : `<p class="text-[13px] text-[#94A3B8]">No items yet — tap Edit room to add fixtures.</p>`}
        </div>
        <div class="card p-4 mt-3">
            <p class="text-[12px] text-[#64748B] mb-1">Notes</p>
            ${notes ? `<p class="text-[13px] leading-relaxed">${escapeHtml(notes)}</p>` : `<p class="text-[13px] text-[#94A3B8]">No notes for this room yet.</p>`}
        </div>
    </div>`;
}

function screenEditInventoryRoomEnhanced() {
    const rid = STATE.roomId ?? 0;
    const roomMeta = inventoryRoomMeta(STATE.propertyId, rid);
    const roomName = roomMeta.name;
    const rooms = getInventoryRooms(STATE.propertyId);
    const room = rooms[rid] || rooms[0];
    if (!STATE.inventoryEditItems) initInventoryEditItems();
    const items = STATE.inventoryEditItems;
    return `${topBar('Edit ' + roomName, { back: true })}
    <div class="screen-content screen-enter">
        ${uxTip('Add fixtures and notes for this room. Upload photos from the room view.', roomName)}
        ${formTextarea('Room notes', getInventoryNotes(STATE.propertyId, rid), 'Scratches, stains, missing keys…', 'roomNotes')}
        <p class="screen-section-title">Items</p>
        <div class="stack-sm">
        ${items.map((item, i) => `
        <div class="card p-3 inventory-item-row" data-inventory-item-row>
            <div class="flex items-center gap-2">
                <input type="text" data-inventory-item-name class="form-input flex-1 text-[13px]" value="${escapeHtml(item)}" placeholder="Item name">
                <button type="button" data-action="remove-inventory-item" data-item-idx="${i}" class="inventory-item-remove" aria-label="Remove item"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
        </div>`).join('')}
        </div>
        <button type="button" data-action="add-inventory-item" class="btn-secondary w-full py-2.5 text-[13px] mt-2">+ Add custom item</button>
        <button data-action="save" class="btn-primary w-full py-3.5 text-[14px] mt-4">Save room</button>
    </div>`;
}

function saveInventoryLayout() {
    const pid = STATE.propertyId ?? 0;
    const layout = {
        bedrooms: Math.max(0, +fieldVal('invBedrooms') || 0),
        bathrooms: Math.max(0, +fieldVal('invBathrooms') || 0),
        kitchens: Math.max(0, +fieldVal('invKitchens') || 0),
        reception: Math.max(0, +fieldVal('invReception') || 0),
    };
    AppStore.meta(pid).inventoryLayout = layout;
    STATE.editingInventoryLayout = false;
    withLoading(() => { AppStore.save(); toast('Layout saved'); render(); });
}

function syncSharedDocToTenants(doc, tenantIds = null) {
    if (!doc?.shared || doc.propertyId == null) return;
    const targets = tenantIds?.length
        ? tenantIds
        : getDocumentShareTargets(doc.propertyId, doc.unit).map(t => t.id);
    targets.forEach(tid => {
        if (!AppStore.tenantDocuments[tid]) AppStore.tenantDocuments[tid] = [];
        if (!AppStore.tenantDocuments[tid].some(d => d[1] === doc.name)) {
            AppStore.tenantDocuments[tid].push(['file-text', doc.name, doc.date || 'Just now', '#2563EB']);
        }
    });
}

function getDocumentShareTargets(propertyId, unit) {
    const roster = unit && typeof getFlatMemberRoster === 'function'
        ? getFlatMemberRoster(propertyId, unit).members.filter(m => m.listId != null || m.tenantId != null)
        : [];
    const fromRoster = roster.map(m => TENANT_LIST.find(t => t.id === (m.tenantId ?? m.listId))).filter(Boolean);
    const active = TENANT_LIST.filter(t => t.propertyId === propertyId && t.status === 'active');
    const unitFiltered = unit ? active.filter(t => t.unit === unit) : active;
    const merged = [...fromRoster];
    unitFiltered.forEach(t => { if (!merged.some(m => m.id === t.id)) merged.push(t); });
    if (unit) return merged;
    return active;
}

function getPropertyNotifyTargets(propertyId) {
    return TENANT_LIST
        .filter(t => t.propertyId === propertyId && (t.status === 'active' || t.status === 'pending'))
        .map(t => ({
            id: t.id,
            name: t.name || `${TENANTS[t.id]?.firstName || ''} ${TENANTS[t.id]?.lastName || ''}`.trim() || 'Tenant',
            unit: t.unit || '—',
            email: TENANTS[t.id]?.email || '',
            status: t.status,
            img: (typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(t.id) : null) || t.img || IMG.avatar.sarah,
        }));
}

function renderTenantNotifySection(propertyId, opts = {}) {
    const compact = !!opts.compact;
    const title = opts.title || 'Notify tenants';
    const hint = opts.hint || (compact
        ? 'Uncheck anyone who should not be notified.'
        : 'Selected tenants receive an in-app alert. No need to pick one email for the whole building.');
    const targets = getPropertyNotifyTargets(propertyId);
    const avatarSize = compact ? 'sm' : 'md';
    const renderAvatar = (t) => {
        if (typeof renderMemberAvatar === 'function') {
            return renderMemberAvatar({ name: t.name, img: t.img, listId: t.id }, avatarSize);
        }
        if (typeof renderPersonAvatar === 'function') return renderPersonAvatar(t.name, t.id, avatarSize);
        return t.img ? `<img src="${t.img}" class="member-row-avatar member-row-avatar--${avatarSize}" alt="">` : '';
    };
    if (!targets.length) {
        return `
        <div class="notify-tenant-section${compact ? ' notify-tenant-section--compact' : ''}">
            <p class="form-label">${title}</p>
            <p class="form-helper">No tenants on this property yet.</p>
        </div>`;
    }
    const rows = targets.map(t => `
        <label class="member-row notify-tenant-row cursor-pointer">
            <input type="checkbox" data-notify-target="${t.id}" class="accent-[#2563EB]" checked>
            ${renderAvatar(t)}
            <div class="member-row-body min-w-0">
                <p class="member-row-name">${escapeHtml(t.name)}</p>
                <p class="member-row-meta">${escapeHtml(t.unit)} · ${t.status === 'active' ? 'Active' : 'Pending'}</p>
            </div>
        </label>`).join('');
    if (targets.length === 1) {
        return `
        <div class="notify-tenant-section${compact ? ' notify-tenant-section--compact' : ''}">
            <p class="form-label">${title}</p>
            <div class="notify-tenant-list member-list-human">${rows}</div>
            <p class="form-helper">${hint}</p>
        </div>`;
    }
    return `
    <div class="notify-tenant-section${compact ? ' notify-tenant-section--compact' : ''}">
        <div class="notify-tenant-head">
            <p class="form-label">${title}</p>
            <label class="notify-all-toggle">
                <input type="checkbox" data-notify-all class="accent-[#2563EB]" checked>
                <span>All (${targets.length})</span>
            </label>
        </div>
        <div class="notify-tenant-list member-list-human">${rows}</div>
        <p class="form-helper">${hint}</p>
    </div>`;
}

function getSelectedNotifyTargetIds() {
    return [...document.querySelectorAll('[data-notify-target]:checked')].map(el => +el.dataset.notifyTarget);
}

function notifyTenantsAboutEvent(propertyId, tenantIds, { title, desc, screen = 'tenant-dashboard' }) {
    const p = PROPERTIES[propertyId];
    tenantIds.forEach(tid => {
        if (!TENANT_LIST.find(t => t.id === tid)) return;
        pushNotification({
            icon: 'megaphone',
            color: ['#ECFDF5', '#059669'],
            title,
            desc: desc || p?.name || '',
            time: 'Just now',
            unread: true,
            screen,
            opts: {},
        });
    });
    return tenantIds.length;
}

function broadcastAudienceLabel(b) {
    if (!b || b.scope === 'all' || !b.units?.length) return 'Entire property';
    if (b.units.length === 1) return b.units[0];
    return `${b.units.length} flats`;
}

function tenantUnitForBroadcast(tenant) {
    if (!tenant) return '';
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenant.id;
    const listItem = tid != null ? TENANT_LIST[tid] : null;
    return tenant.unit || listItem?.unit || '';
}

function broadcastVisibleToTenant(b, tenant) {
    if (!b || !tenant || tenant.propertyId == null) return false;
    if (b.propertyId !== tenant.propertyId) return false;
    if (b.scope === 'all' || !b.units?.length) return true;
    const unit = tenantUnitForBroadcast(tenant);
    return unit && b.units.includes(unit);
}

function announcementsForTenant(tenant) {
    if (!tenant || tenant.propertyId == null) return [];
    return (AppStore.broadcasts || [])
        .filter(b => broadcastVisibleToTenant(b, tenant))
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function unreadBroadcastCountForTenant(tenant) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenant?.id;
    if (tid == null) return 0;
    return announcementsForTenant(tenant).filter(b => !(b.readBy || []).includes(tid)).length;
}

function markBroadcastsReadForTenant(tenant) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenant?.id;
    if (tid == null || !tenant) return;
    let changed = false;
    (AppStore.broadcasts || []).forEach(b => {
        if (!broadcastVisibleToTenant(b, tenant)) return;
        if (!b.readBy) b.readBy = [];
        if (!b.readBy.includes(tid)) {
            b.readBy.push(tid);
            changed = true;
        }
    });
    if (changed) AppStore.save();
}

function getBroadcastRecipientTenantIds(propertyId, scope, units) {
    const active = TENANT_LIST.filter(t =>
        t.propertyId === propertyId && (t.status === 'active' || t.status === 'pending')
    );
    if (scope === 'all') return active.map(t => t.id);
    const picked = units || [];
    return active.filter(t => picked.includes(t.unit)).map(t => t.id);
}

function broadcastById(id) {
    return (AppStore.broadcasts || []).find(b => b.id === id) || null;
}

function renderBroadcastImageField() {
    const img = STATE.broadcastDraftImage;
    return `
    <div class="form-group">
        <label class="form-label broadcast-form-label"><i data-lucide="image" class="w-4 h-4"></i> Notice image <span class="form-optional">(optional)</span></label>
        ${img ? `
        <div class="broadcast-image-preview">
            <img src="${img}" alt="">
            <button type="button" data-action="remove-broadcast-image" class="broadcast-image-remove" aria-label="Remove photo">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>` : `
        <button type="button" data-action="upload-broadcast-image" class="broadcast-image-upload">
            <i data-lucide="image-plus" class="w-5 h-5"></i>
            <span>Add photo</span>
        </button>`}
        <p class="form-helper">Shown at the top of the notice for tenants.</p>
    </div>`;
}

function renderBroadcastDetailContent(b, opts = {}) {
    const p = PROPERTIES[b.propertyId];
    const recipients = getBroadcastRecipientTenantIds(b.propertyId, b.scope, b.units);
    const badgeClass = b.scope === 'units' ? 'broadcast-detail-badge--units' : 'broadcast-detail-badge--all';
    const badgeLabel = b.scope === 'units' ? 'Selected Flats' : 'Entire Property';
    
    let targetsHTML = '';
    if (b.scope === 'units') {
        const flatsText = b.units && b.units.length ? b.units.join(', ') : 'None';
        targetsHTML = `
        <div class="broadcast-detail-targets">
            <div class="broadcast-detail-targets-label">
                <i data-lucide="door-open" class="w-3.5 h-3.5"></i> Sent to flats
            </div>
            <div class="broadcast-detail-targets-content">${escapeHtml(flatsText)}</div>
        </div>`;
    } else {
        targetsHTML = `
        <div class="broadcast-detail-targets">
            <div class="broadcast-detail-targets-label">
                <i data-lucide="building-2" class="w-3.5 h-3.5"></i> Sent to
            </div>
            <div class="broadcast-detail-targets-content">All flats in ${escapeHtml(p?.name?.split(',')[0] || 'property')}</div>
        </div>`;
    }

    return `
    ${b.image ? `
    <div class="broadcast-detail-media card">
        <img src="${b.image}" alt="" class="broadcast-detail-img">
    </div>` : ''}
    <div class="card broadcast-detail-card">
        <div class="broadcast-detail-head">
            <span class="broadcast-detail-icon"><i data-lucide="megaphone" class="w-5 h-5"></i></span>
            <div class="min-w-0">
                <h2 class="broadcast-detail-title">${escapeHtml(b.title)}</h2>
                <p class="broadcast-detail-sub">${escapeHtml(p?.name || 'Property')}</p>
                <span class="broadcast-detail-badge ${badgeClass}">${badgeLabel}</span>
            </div>
        </div>
        ${targetsHTML}
        <p class="broadcast-detail-body">${escapeHtml(b.body)}</p>
        <div class="broadcast-detail-meta">
            <span><i data-lucide="calendar" class="w-3.5 h-3.5"></i>${escapeHtml(b.date)}</span>
            ${opts.showRecipients
                ? `<span><i data-lucide="users" class="w-3.5 h-3.5"></i>${recipients.length} tenant${recipients.length === 1 ? '' : 's'}</span>`
                : `<span><i data-lucide="user" class="w-3.5 h-3.5"></i>From ${escapeHtml(b.from || 'landlord')}</span>`}
        </div>
    </div>`;
}

async function uploadBroadcastImageAction() {
    const urls = await pickImageFiles({ multiple: false });
    if (!urls.length) return;
    STATE.broadcastDraftImage = urls[0];
    toast('Photo added');
    render();
}

function renderBroadcastAudienceSection(propertyId) {
    const scope = STATE.broadcastScope || 'all';
    const units = getPropertyUnits(propertyId);
    const unitNames = units.map(u => unitName(u));
    const selected = STATE.broadcastUnits?.length
        ? STATE.broadcastUnits
        : unitNames.filter(un => TENANT_LIST.some(t => t.propertyId === propertyId && t.unit === un && t.status === 'active'));
    return `
    <div class="broadcast-audience">
        <p class="form-label broadcast-form-label"><i data-lucide="users" class="w-4 h-4"></i> Who should see this?</p>
        <div class="broadcast-scope-segments">
            <button type="button" data-broadcast-scope="all" class="broadcast-scope-btn ${scope === 'all' ? 'active' : ''}">
                <span class="broadcast-scope-icon"><i data-lucide="building-2" class="w-5 h-5"></i></span>
                <span class="broadcast-scope-label">Entire property</span>
            </button>
            <button type="button" data-broadcast-scope="units" class="broadcast-scope-btn ${scope === 'units' ? 'active' : ''}">
                <span class="broadcast-scope-icon"><i data-lucide="layout-grid" class="w-5 h-5"></i></span>
                <span class="broadcast-scope-label">Selected flats</span>
            </button>
        </div>
        ${scope === 'units' ? `
        <div class="notify-tenant-section">
            ${unitNames.length > 1 ? `
            <div class="notify-tenant-head">
                <p class="form-label broadcast-form-label" style="margin:0"><i data-lucide="home" class="w-4 h-4"></i> Flats</p>
                <label class="notify-all-toggle">
                    <input type="checkbox" data-broadcast-all class="accent-[#2563EB]" ${selected.length === unitNames.length ? 'checked' : ''}>
                    <span>All flats (${unitNames.length})</span>
                </label>
            </div>` : ''}
            <div class="notify-tenant-list stack-sm">
                ${unitNames.map(un => {
                    const tenants = TENANT_LIST.filter(t => t.propertyId === propertyId && t.unit === un);
                    const occ = tenants.filter(t => t.status === 'active').length;
                    const checked = selected.includes(un);
                    return `
                <label class="member-row card cursor-pointer notify-tenant-row">
                    <input type="checkbox" data-broadcast-unit="${un}" class="accent-[#2563EB]" ${checked ? 'checked' : ''}>
                    <span class="notify-flat-icon"><i data-lucide="door-open" class="w-4 h-4"></i></span>
                    <div class="member-row-body min-w-0">
                        <p class="member-row-name">${escapeHtml(un)}</p>
                        <p class="member-row-meta">${occ ? `${occ} active tenant${occ === 1 ? '' : 's'}` : 'Vacant — no tenants notified'}</p>
                    </div>
                </label>`;
                }).join('')}
            </div>
            <p class="form-helper">Only tenants in the selected flats will see this in their portal.</p>
        </div>` : `
        <p class="form-helper">Every active tenant in this building will see the notice under Announcements.</p>`}
    </div>`;
}

function screenBroadcastNotices() {
    const list = [...(AppStore.broadcasts || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return `${topBar('Announcements', { back: true, sub: 'Broadcast to tenants' })}
    <div class="screen-content screen-enter">
        <button type="button" data-go="send-broadcast" class="btn-primary w-full py-3.5 text-[14px] broadcast-send-btn">
            <i data-lucide="plus" class="w-4 h-4"></i> Send announcement
        </button>
        ${list.length ? `
        <p class="txn-section-label txn-section-label--spaced">Sent</p>
        <div class="txn-list">${list.map(b => {
            const p = PROPERTIES[b.propertyId];
            const recipients = getBroadcastRecipientTenantIds(b.propertyId, b.scope, b.units);
            const thumb = b.image
                ? `<img src="${b.image}" alt="" class="broadcast-list-thumb">`
                : `<div class="txn-icon txn-icon-pending"><i data-lucide="megaphone" class="w-4 h-4"></i></div>`;
            return `
        <button type="button" data-go="broadcast-detail" data-bid="${b.id}" class="txn-row broadcast-sent-row w-full text-left">
            ${thumb}
            <div class="txn-body">
                <p class="txn-title">${escapeHtml(b.title)}</p>
                <p class="txn-sub">${escapeHtml(p?.name || 'Property')} · ${broadcastAudienceLabel(b)}</p>
                <p class="txn-sub txn-sub--muted">${b.date} · ${recipients.length} tenant${recipients.length === 1 ? '' : 's'}</p>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
        </button>`;
        }).join('')}</div>` : `
        <div class="card p-8 text-center mt-4">
            <i data-lucide="megaphone" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No announcements sent yet</p>
            <p class="text-[12px] text-[#64748B] mt-1 leading-relaxed">Send building-wide updates or announcements to specific flats.</p>
        </div>`}
    </div>`;
}

function screenBroadcastDetail() {
    const b = broadcastById(STATE.broadcastId);
    if (!b) {
        return `${topBar('Announcement', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Announcement not found.</p></div>`;
    }
    return `${topBar('Announcement', { back: true, sub: b.date })}
    <div class="screen-content screen-enter broadcast-detail-page">
        ${renderBroadcastDetailContent(b, { showRecipients: true })}
        <button type="button" data-action="delete-broadcast" class="btn-danger-outline mt-3">
            <i data-lucide="trash-2" class="w-4 h-4"></i> Delete Announcement
        </button>
    </div>`;
}

function screenSendBroadcast() {
    const pid = STATE.broadcastPropertyId ?? STATE.propertyId ?? 0;
    const p = PROPERTIES[pid];
    if (!p) return `${topBar('Send announcement', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Add a property first.</p></div>`;
    const propertyOptions = PROPERTIES.map((prop, i) =>
        `<option value="${i}" ${i === pid ? 'selected' : ''}>${escapeHtml(prop.name)}</option>`
    ).join('');
    return `${topBar('Send announcement', { back: true, sub: p.name.split(',')[0] })}
    <div class="screen-content screen-enter broadcast-form-page">
        ${uxIntro('Tenants see announcements in their portal under Announcements — not in Messages.')}
        <div class="form-group">
            <label class="form-label broadcast-form-label"><i data-lucide="building-2" class="w-4 h-4"></i> Property</label>
            <select data-broadcast-property class="form-input form-select">${propertyOptions}</select>
        </div>
        ${renderBroadcastAudienceSection(pid)}
        <div class="form-group">
            <label class="form-label broadcast-form-label"><i data-lucide="type" class="w-4 h-4"></i> Announcement title <span class="form-required">*</span></label>
            <input data-field="broadcastTitle" type="text" class="form-input" placeholder="e.g. Boiler service next week">
        </div>
        <div class="form-group">
            <label class="form-label broadcast-form-label"><i data-lucide="align-left" class="w-4 h-4"></i> Message <span class="form-required">*</span></label>
            <textarea data-field="broadcastBody" class="form-input min-h-[120px] resize-none" placeholder="What should tenants know? Include dates, access times, and any action needed."></textarea>
        </div>
        ${renderBroadcastImageField()}
        <button type="button" data-action="send-broadcast" class="btn-primary w-full py-3.5 text-[14px] broadcast-send-btn">
            <i data-lucide="send" class="w-4 h-4"></i> Send announcement
        </button>
    </div>`;
}

function sendBroadcastNotice() {
    const pid = STATE.broadcastPropertyId ?? STATE.propertyId ?? 0;
    const p = PROPERTIES[pid];
    if (!p) { toast('Select a property'); return; }
    const title = (fieldVal('broadcastTitle') || '').trim();
    const body = (fieldVal('broadcastBody') || '').trim();
    if (!title) { toastError('Enter an announcement title'); return; }
    if (!body) { toastError('Enter a message'); return; }
    const scope = STATE.broadcastScope || 'all';
    const unitNames = getPropertyUnits(pid).map(u => unitName(u));
    const units = scope === 'units'
        ? [...document.querySelectorAll('[data-broadcast-unit]:checked')].map(el => el.dataset.broadcastUnit)
        : [];
    if (scope === 'units' && !units.length) {
        toastError('Select at least one flat');
        return;
    }
    const tenantIds = getBroadcastRecipientTenantIds(pid, scope, units);
    const from = `${LANDLORD_USER.firstName || 'John'} ${LANDLORD_USER.lastName || 'Smith'}`.trim();
    const entry = {
        id: AppStore.nextId(AppStore.broadcasts || []),
        propertyId: pid,
        title,
        body,
        date: typeof formatEventDate === 'function' ? formatEventDate() : 'Today',
        from,
        scope,
        units: scope === 'units' ? units : [],
        readBy: [],
        image: STATE.broadcastDraftImage || null,
    };
    if (!AppStore.broadcasts) AppStore.broadcasts = [];
    AppStore.broadcasts.unshift(entry);
    STATE.broadcastDraftImage = null;
    if (tenantIds.length) {
        notifyTenantsAboutEvent(pid, tenantIds, {
            title: 'New notice from landlord',
            desc: title,
            screen: 'tenant-announcements',
        });
    }
    AppStore.save();
    toast(tenantIds.length
        ? `Notice sent to ${tenantIds.length} tenant${tenantIds.length === 1 ? '' : 's'}`
        : 'Notice saved — no active tenants on selected flats yet');
    go('broadcast-notices');
}

function getInventoryNotesDisplay(pid, rid) {
    const notes = getInventoryNotes(pid, rid);
    return notes || 'No notes for this room yet.';
}

function getPaymentMethods() { return AppStore.paymentMethods; }

function getTenantDocuments(tenantId) {
    return AppStore.tenantDocuments[tenantId] || [];
}

function getTenantNidProof(tenantId) {
    const t = TENANTS[tenantId];
    if (t?.nidProofFront && t?.nidProofBack) {
        return { name: `${t.nidProofFront} + ${t.nidProofBack}`, date: 'On file', front: t.nidProofFront, back: t.nidProofBack };
    }
    if (t?.nidProof) return { name: t.nidProof, date: 'On file' };
    const docs = getTenantDocuments(tenantId);
    const match = docs.find(d => /nid/i.test(d[1]));
    return match ? { name: match[1], date: match[2] } : null;
}

function ensureTenantNidProof(tenantId, fileName = 'NID Proof.jpg', sides = {}) {
    const t = TENANTS[tenantId];
    if (t) {
        t.nidProof = fileName;
        if (sides.front) t.nidProofFront = sides.front;
        if (sides.back) t.nidProofBack = sides.back;
    }
    if (!AppStore.tenantDocuments[tenantId]) AppStore.tenantDocuments[tenantId] = [];
    if (!AppStore.tenantDocuments[tenantId].some(d => /nid/i.test(d[1]))) {
        AppStore.tenantDocuments[tenantId].push(['file-image', fileName, 'Just now', '#7C3AED']);
    }
}

function getTenantNotes(tenantId) {
    if (!AppStore.tenantNotes[tenantId]) AppStore.tenantNotes[tenantId] = [];
    return AppStore.tenantNotes[tenantId];
}

function truncateNote(text, max = 90) {
    const t = String(text || '').trim();
    if (!t) return '';
    return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function renderTenantNoteCard(n, { compact = false, showActions = true } = {}) {
    return `
        <div class="tenant-note-card${compact ? ' tenant-note-card--compact' : ''}" style="background:${n.bg};border-color:${n.color}22">
            <p class="tenant-note-text">${compact ? truncateNote(n.text, 120) : n.text}</p>
            <div class="tenant-note-footer">
                <span class="tenant-note-meta">${n.meta}</span>
                ${showActions ? `
                <div class="row-actions">
                    <button type="button" data-action="edit-tenant-note" data-nid="${n.id}" class="row-icon-btn row-icon-btn--primary" title="Edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                    <button type="button" data-action="delete-tenant-note" data-nid="${n.id}" class="row-icon-btn row-icon-btn--danger" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>` : ''}
            </div>
        </div>`;
}

function renderTenantNotePreviewRow(n) {
    return `
    <button type="button" data-action="edit-tenant-note" data-nid="${n.id}" class="tenant-v2-note-row" style="--note-accent:${n.color}">
        <p class="tenant-v2-note-text">${escapeHtml(truncateNote(n.text, 110))}</p>
        <span class="tenant-v2-note-meta">${escapeHtml(n.meta)}</span>
    </button>`;
}

function renderTenantNotesPreview(tenantId) {
    const notes = getTenantNotes(tenantId);
    return `
    <div class="tenant-v2-section">
        <div class="tenant-v2-section-head">
            <h3>Notes</h3>
            <button type="button" data-go="tenant-add-note" data-tid="${tenantId}" class="tenant-v2-link">+ Add</button>
        </div>
        ${notes.length ? `
        <div class="card tenant-v2-notes-card">
            ${notes.slice(0, 2).map(n => renderTenantNotePreviewRow(n)).join('')}
            ${notes.length > 2 ? `<button type="button" data-ttab="notes" class="tenant-v2-notes-more">View all ${notes.length} notes</button>` : ''}
        </div>` : `
        <button type="button" data-go="tenant-add-note" data-tid="${tenantId}" class="card tenant-v2-notes-empty w-full text-left">
            <p class="tenant-v2-notes-empty-title">No notes yet</p>
            <p class="tenant-v2-notes-empty-sub">Tap to add communication preferences or lease reminders.</p>
        </button>`}
    </div>`;
}

function renderTenantNotesSection(tenantId) {
    const notes = getTenantNotes(tenantId);
    const list = notes.length
        ? notes.map(n => renderTenantNoteCard(n)).join('')
        : emptyState('sticky-note', 'No notes yet', 'Add reminders about communication, preferences, or lease discussions.', null, null, null);
    return `<div class="stack-sm">${list}<button type="button" data-go="tenant-add-note" data-tid="${tenantId}" class="btn-primary w-full py-3 text-[13px]">+ Add note</button></div>`;
}

function formatDisplayDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toDateInputValue(val) {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(val))) return String(val);
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
}

function getScheduledInspection(propertyId = STATE.propertyId) {
    return AppStore.inspections.find(i => i.propertyId === propertyId && i.scheduled) || null;
}

function normalizeInspectionType(type) {
    const raw = String(type || '').trim();
    if (!raw) return 'Mid-term';
    const match = ['Check-in', 'Mid-term', 'Annual', 'Check-out'].find(t => raw.toLowerCase().startsWith(t.toLowerCase()));
    return match || raw;
}

function renderInspectionRatingPicker(value = 4) {
    const num = Math.min(5, Math.max(1, Math.round(parseFloat(value) || 4)));
    STATE.inspectionRating = num;
    return `
    <div class="form-group">
        <label class="form-label">${requiredLabel('Overall Rating')}</label>
        <div class="insp-rating-picker" role="radiogroup" aria-label="Overall property condition rating">
            ${[1, 2, 3, 4, 5].map(star => `
            <button type="button" data-action="set-insp-rating" data-rating="${star}" class="insp-rating-star ${star <= num ? 'active' : ''}" aria-label="${star} out of 5 stars" aria-pressed="${star === num}">
                <i data-lucide="star" class="w-6 h-6"></i>
            </button>`).join('')}
        </div>
        <input type="hidden" data-field="rating" value="${num}">
        <p class="form-helper">${num}.0 / 5 — recorded by you after the visit</p>
    </div>`;
}

function setInspectionRating(rating) {
    STATE.inspectionRating = Math.min(5, Math.max(1, Math.round(+rating || 4)));
    render();
}

function formatLeaseMonthYear(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function formatTenantRent(rent) {
    if (!rent || rent === '—') return '—';
    const n = String(rent).replace(/[^\d]/g, '');
    return n ? `£${Number(n).toLocaleString()}/mo` : rent;
}

function offlineBanner() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return `<div class="app-offline-banner"><i data-lucide="wifi-off" class="w-4 h-4"></i> You're offline — changes will sync when reconnected</div>`;
    }
    return '';
}

function getPropertyCoverPhoto(pid) {
    const meta = AppStore.meta(pid);
    return meta.photos?.[0] || IMG.props[pid] || IMG.fallback;
}

function migrateFlatPhotoGallery(propertyId, unitName) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotoGalleries) meta.unitPhotoGalleries = {};
    if (meta.unitPhotoGalleries[unitName]) return meta.unitPhotoGalleries[unitName];
    const legacy = meta.unitPhotos?.[unitName];
    if (legacy) {
        meta.unitPhotoGalleries[unitName] = { photos: [legacy], cover: 0 };
        return meta.unitPhotoGalleries[unitName];
    }
    return null;
}

function getFlatPhotoGallery(propertyId, unitName) {
    const migrated = migrateFlatPhotoGallery(propertyId, unitName);
    if (migrated) return migrated;
    const meta = AppStore.meta(propertyId);
    return meta.unitPhotoGalleries?.[unitName] || null;
}

function setFlatPhotoGallery(propertyId, unitName, photos, cover = 0) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotoGalleries) meta.unitPhotoGalleries = {};
    const clean = (photos || []).filter(Boolean);
    if (!clean.length) {
        delete meta.unitPhotoGalleries[unitName];
        if (meta.unitPhotos?.[unitName]) delete meta.unitPhotos[unitName];
        return;
    }
    const coverIdx = Math.min(Math.max(0, cover), clean.length - 1);
    meta.unitPhotoGalleries[unitName] = { photos: clean, cover: coverIdx };
    if (!meta.unitPhotos) meta.unitPhotos = {};
    meta.unitPhotos[unitName] = clean[coverIdx];
}

function getFlatCoverPhoto(propertyId, unitName) {
    const gal = getFlatPhotoGallery(propertyId, unitName);
    if (gal?.photos?.length) {
        const idx = gal.cover ?? 0;
        return gal.photos[idx] ?? gal.photos[0];
    }
    const meta = AppStore.meta(propertyId);
    if (meta.unitPhotos?.[unitName]) return meta.unitPhotos[unitName];
    const unit = getUnitByName(propertyId, unitName);
    const idx = ((unit?.id ?? 0) + (propertyId * 3)) % IMG.interior.length;
    return IMG.interior[idx];
}

function setFlatCoverPhoto(propertyId, unitName, url) {
    const gal = getFlatPhotoGallery(propertyId, unitName);
    const photos = gal?.photos?.length ? [...gal.photos] : [];
    let cover = photos.indexOf(url);
    if (cover < 0) {
        photos.unshift(url);
        cover = 0;
    }
    setFlatPhotoGallery(propertyId, unitName, photos, cover);
}

function appendFlatPhotos(propertyId, unitName, urls) {
    const gal = getFlatPhotoGallery(propertyId, unitName);
    const photos = gal?.photos?.length ? [...gal.photos] : [];
    const cover = gal?.cover ?? 0;
    const added = (urls || []).filter(Boolean);
    added.forEach(u => { if (!photos.includes(u)) photos.push(u); });
    const nextCover = !gal?.photos?.length && added.length ? 0 : cover;
    setFlatPhotoGallery(propertyId, unitName, photos, nextCover);
}

function setFlatCoverIndex(propertyId, unitName, idx) {
    const gal = getFlatPhotoGallery(propertyId, unitName);
    if (!gal?.photos?.length || idx < 0 || idx >= gal.photos.length) return;
    setFlatPhotoGallery(propertyId, unitName, gal.photos, idx);
}

function removeFlatPhotoAt(propertyId, unitName, idx) {
    const gal = getFlatPhotoGallery(propertyId, unitName);
    if (!gal?.photos?.length || idx < 0 || idx >= gal.photos.length) return;
    const photos = [...gal.photos];
    photos.splice(idx, 1);
    let cover = gal.cover ?? 0;
    if (idx < cover) cover -= 1;
    else if (idx === cover) cover = Math.min(cover, Math.max(0, photos.length - 1));
    setFlatPhotoGallery(propertyId, unitName, photos, photos.length ? Math.max(0, cover) : 0);
}

function copyFlatPhotoGallery(propertyId, fromUnit, toUnit) {
    const gal = getFlatPhotoGallery(propertyId, fromUnit);
    if (!gal?.photos?.length) return;
    setFlatPhotoGallery(propertyId, toUnit, [...gal.photos], gal.cover ?? 0);
}

function renameFlatPhoto(propertyId, oldName, newName) {
    if (oldName === newName) return;
    const meta = AppStore.meta(propertyId);
    if (meta.unitPhotoGalleries?.[oldName]) {
        if (!meta.unitPhotoGalleries) meta.unitPhotoGalleries = {};
        meta.unitPhotoGalleries[newName] = meta.unitPhotoGalleries[oldName];
        delete meta.unitPhotoGalleries[oldName];
    }
    if (meta.unitPhotos?.[oldName]) {
        if (!meta.unitPhotos) meta.unitPhotos = {};
        meta.unitPhotos[newName] = meta.unitPhotos[oldName];
        delete meta.unitPhotos[oldName];
    }
}

function ensureFlatPhotos(propertyId) {
    getPropertyUnits(propertyId).forEach(u => {
        const name = unitName(u);
        if (!getFlatPhotoGallery(propertyId, name)) {
            const url = IMG.interior[((u.id ?? 0) + propertyId * 3) % IMG.interior.length];
            setFlatPhotoGallery(propertyId, name, [url], 0);
        }
    });
}

function canDeleteFlat(propertyId, flatName) {
    const units = getPropertyUnits(propertyId);
    if (units.length <= 1) return false;
    const u = getUnitByName(propertyId, flatName);
    return u && u.status !== 'occupied';
}

function dangerZoneButton(label, action, attrs = '') {
    return `<button type="button" data-action="${action}" ${attrs} class="btn-danger-outline">${label}</button>`;
}

function actionMenuKeyFor(type, ...parts) {
    return `${type}:${parts.join(':')}`;
}

function isActionMenuOpen(key) {
    return STATE.actionMenuKey === key;
}

const LANDLORD_MAINT_CREATE_LABEL = 'Log issue';

function renderLogMaintContextLink(propertyId, unit, label = 'Log issue for this unit') {
    const pidAttr = propertyId != null ? ` data-pid="${propertyId}"` : '';
    const unitAttr = unit ? ` data-unit="${unit}"` : '';
    return `<button type="button" data-go="log-maintenance"${pidAttr}${unitAttr} class="flat-dt-log-maint-link">${label}<i data-lucide="arrow-right" class="w-3.5 h-3.5"></i></button>`;
}

function renderActionMenuButton(key, label = 'Options') {
    return `<button type="button" data-action="open-action-menu" data-menu-key="${key}" class="action-menu-btn" aria-label="${label}" aria-expanded="${isActionMenuOpen(key)}"><i data-lucide="more-vertical" class="w-4 h-4"></i></button>`;
}

function renderActionMenuItem(item) {
    return `<button type="button" data-action="${item.action}" ${item.attrs || ''} class="action-menu-item ${item.danger ? 'action-menu-item--danger' : ''}" role="menuitem">${item.icon ? `<i data-lucide="${item.icon}" class="w-4 h-4"></i>` : ''}${item.label}</button>`;
}

function renderActionMenuPopover(key, items) {
    if (!isActionMenuOpen(key) || !items?.length) return '';
    return `<div class="action-menu-popover" role="menu">${items.map(renderActionMenuItem).join('')}</div>`;
}

function propertyActionMenuItems(propertyId) {
    return [
        { label: LANDLORD_MAINT_CREATE_LABEL, icon: 'wrench', action: 'action-menu-go', attrs: `data-go="log-maintenance" data-pid="${propertyId}"` },
        { label: 'Send announcement', icon: 'megaphone', action: 'action-menu-go', attrs: `data-go="send-broadcast" data-pid="${propertyId}"` },
        { label: 'Edit property', icon: 'pencil', action: 'action-menu-go', attrs: `data-go="property-info" data-pid="${propertyId}"` },
        { label: 'Add unit', icon: 'plus', action: 'action-menu-go', attrs: `data-go="add-flat" data-pid="${propertyId}"` },
        { label: 'View property', icon: 'eye', action: 'action-menu-go', attrs: `data-go="property-detail" data-pid="${propertyId}" data-tab="units"` },
        { label: 'Delete property', icon: 'trash-2', action: 'action-menu-delete-property', danger: true, attrs: `data-pid="${propertyId}"` },
    ];
}

function unitActionMenuItems(propertyId, unitName, opts = {}) {
    const u = getUnitByName(propertyId, unitName);
    const occ = u?.status === 'occupied';
    const items = [
        { label: 'Edit unit', icon: 'pencil', action: 'action-menu-go', attrs: `data-go="edit-flat" data-pid="${propertyId}" data-unit="${unitName}"` },
        { label: 'Utilities', icon: 'zap', action: 'action-menu-go', attrs: `data-go="unit-utilities" data-pid="${propertyId}" data-unit="${unitName}"` },
    ];
    if (opts.fromDetail) {
        items.push(
            { label: 'Manage photos', icon: 'images', action: 'action-menu-go', attrs: `data-go="flat-detail" data-pid="${propertyId}" data-unit="${unitName}" data-flat-tab="gallery"` },
        );
    }
    if (!occ) {
        items.push({ label: 'Delete unit', icon: 'trash-2', action: 'action-menu-delete-flat', danger: true, attrs: `data-pid="${propertyId}" data-unit="${unitName}"` });
    }
    return items;
}

function tenantActionMenuItems(t, opts = {}) {
    const items = [];
    if (opts.includeView) {
        items.push({ label: 'View profile', icon: 'user', action: 'action-menu-go', attrs: `data-go="tenant-detail" data-tid="${t.id}"` });
    }
    items.push({ label: 'Edit tenant', icon: 'pencil', action: 'action-menu-go', attrs: `data-go="edit-tenant" data-tid="${t.id}"` });
    if (t.chatId != null) {
        items.push({ label: 'Message', icon: 'message-square', action: 'action-menu-go', attrs: `data-go="chat" data-chat="${t.chatId}"` });
    } else if (t.status === 'active' || t.status === 'pending') {
        items.push({ label: 'Message', icon: 'message-square', action: 'start-tenant-chat', attrs: `data-tid="${t.id}"` });
    }
    if (t.propertyId != null && t.unit) {
        items.push({ label: 'View unit', icon: 'home', action: 'action-menu-go', attrs: `data-go="flat-detail" data-pid="${t.propertyId}" data-unit="${t.unit}"` });
    }
    if (t.status === 'active') {
        items.push({ label: 'Check-out tenant', icon: 'log-out', action: 'action-menu-go', attrs: `data-go="checkout-tenancy" data-tid="${t.id}"` });
    }
    return items;
}

function closeActionMenu() {
    STATE.actionMenuKey = null;
    render();
}

function handleActionMenuClick(e) {
    const openBtn = e.target.closest('[data-action="open-action-menu"]');
    if (openBtn) {
        e.stopPropagation();
        e.preventDefault();
        const key = openBtn.dataset.menuKey;
        STATE.actionMenuKey = STATE.actionMenuKey === key ? null : key;
        requestAnimationFrame(() => render());
        return true;
    }
    const closeBtn = e.target.closest('[data-action="close-action-menu"]');
    if (closeBtn) {
        e.stopPropagation();
        closeActionMenu();
        return true;
    }
    const goItem = e.target.closest('[data-action="action-menu-go"]');
    if (goItem) {
        e.stopPropagation();
        STATE.actionMenuKey = null;
        const opts = {};
        if (goItem.dataset.pid !== undefined) opts.propertyId = +goItem.dataset.pid;
        if (goItem.dataset.tid !== undefined) opts.tenantId = +goItem.dataset.tid;
        if (goItem.dataset.unit) opts.unit = goItem.dataset.unit;
        if (goItem.dataset.duplicateFrom) opts.duplicateFrom = goItem.dataset.duplicateFrom;
        if (goItem.dataset.tab) opts.tab = goItem.dataset.tab;
        if (goItem.dataset.flatTab) opts.flatTab = goItem.dataset.flatTab;
        if (goItem.dataset.chat !== undefined) opts.chatId = +goItem.dataset.chat;
        go(goItem.dataset.go, opts);
        return true;
    }
    const deletePropertyBtn = e.target.closest('[data-action="action-menu-delete-property"]');
    if (deletePropertyBtn) {
        e.stopPropagation();
        STATE.propertyId = +deletePropertyBtn.dataset.pid;
        STATE.actionMenuKey = null;
        deleteProperty();
        return true;
    }
    const deleteFlatBtn = e.target.closest('[data-action="action-menu-delete-flat"]');
    if (deleteFlatBtn) {
        e.stopPropagation();
        STATE.propertyId = +deleteFlatBtn.dataset.pid;
        STATE.selectedUnit = deleteFlatBtn.dataset.unit;
        STATE.actionMenuKey = null;
        deleteFlatAction();
        return true;
    }
    const uploadPhotoBtn = e.target.closest('[data-action="action-menu-upload-flat-photo"]');
    if (uploadPhotoBtn) {
        e.stopPropagation();
        STATE.propertyId = +uploadPhotoBtn.dataset.pid;
        STATE.selectedUnit = uploadPhotoBtn.dataset.unit;
        STATE.actionMenuKey = null;
        uploadFlatPhotoAction();
        return true;
    }
    const shareDocBtn = e.target.closest('[data-action="action-menu-share-doc"]');
    if (shareDocBtn) {
        e.stopPropagation();
        STATE.actionMenuKey = null;
        go('share-document', { shareDocId: +shareDocBtn.dataset.doc });
        return true;
    }
    const editDocBtn = e.target.closest('[data-action="action-menu-edit-document"]');
    if (editDocBtn) {
        e.stopPropagation();
        STATE.actionMenuKey = null;
        editDocumentAction(+editDocBtn.dataset.doc);
        return true;
    }
    const deleteDocBtn = e.target.closest('[data-action="action-menu-delete-document"]');
    if (deleteDocBtn) {
        e.stopPropagation();
        STATE.actionMenuKey = null;
        deleteDocumentAction(+deleteDocBtn.dataset.doc);
        return true;
    }
    const deleteMemberBtn = e.target.closest('[data-action="action-menu-delete-member"]');
    if (deleteMemberBtn) {
        e.stopPropagation();
        STATE.actionMenuKey = null;
        removeMemberAction(+deleteMemberBtn.dataset.pid, deleteMemberBtn.dataset.unit, deleteMemberBtn.dataset.memberEmail, deleteMemberBtn.dataset.memberName);
        return true;
    }
    return false;
}

function bindActionMenuEvents(app) {
    if (app._actionMenuDelegationBound) return;
    app._actionMenuDelegationBound = true;
    app.addEventListener('click', (e) => {
        handleActionMenuClick(e);
    }, true);
}

function removeFlatFromProperty(propertyId, flatName) {
    const meta = AppStore.meta(propertyId);
    const units = getPropertyUnits(propertyId);
    if (units.length <= 1) {
        toast('Keep at least one unit on the property');
        return false;
    }
    const u = getUnitByName(propertyId, flatName);
    if (!u) {
        toast('Unit not found');
        return false;
    }
    if (u.status === 'occupied') {
        toast('Check out the tenant before removing this unit');
        return false;
    }
    if (tenantsForUnit(propertyId, flatName).some(t => t.status === 'pending')) {
        toast('Cancel pending invites before removing this unit');
        return false;
    }
    meta.units = (meta.units || units).filter(x => unitName(x) !== flatName);
    if (meta.unitPhotoGalleries?.[flatName]) delete meta.unitPhotoGalleries[flatName];
    if (meta.unitPhotos?.[flatName]) delete meta.unitPhotos[flatName];
    if (meta.unitUtilities?.[flatName]) delete meta.unitUtilities[flatName];
    const building = getPropertyBuilding(propertyId);
    building.flatCount = meta.units.length;
    syncPropertyStatus(propertyId);
    return true;
}

function deleteFlatAction() {
    const flatName = STATE.selectedUnit;
    if (!flatName) return;
    if (!canDeleteFlat(STATE.propertyId, flatName)) {
        const units = getPropertyUnits(STATE.propertyId);
        if (units.length <= 1) toast('Cannot remove the only unit');
        else toast('This unit cannot be removed right now');
        return;
    }
    showConfirm('Remove Unit', `Remove ${flatName} from this property?`, () => {
        if (!removeFlatFromProperty(STATE.propertyId, flatName)) return;
        AppStore.save();
        toast('Unit removed');
        go('property-detail', { propertyId: STATE.propertyId, tab: 'units' });
    }, { okLabel: 'Remove', danger: true });
}

function shortDisplayName(name) {
    if (!name) return '';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return name;
    return `${parts[0][0]}. ${parts[parts.length - 1]}`;
}

function flatBuildingInfoRow(propertyId, u) {
    const name = unitName(u);
    const occ = u.status === 'occupied';
    const { members } = getFlatMemberRoster(propertyId, name);
    const lead = members.find(m => m.isLead) || members[0];
    return {
        name,
        occ,
        tenantLine: occ && lead?.name ? `Tenant: ${shortDisplayName(lead.name)}` : '',
    };
}

function renderBuildingMetricsGrid(propertyId) {
    const rs = getPropertyRentSummary(propertyId);
    const units = getPropertyUnits(propertyId);
    const occupied = units.filter(u => u.status === 'occupied').length;
    const total = units.length || 0;
    const b = getPropertyBuilding(propertyId);
    const distinctFloors = new Set(units.map(u => u.floor || 1)).size;
    const floors = b.floors > 1 ? b.floors : Math.max(1, distinctFloors);
    const occupancyPct = total ? Math.round((occupied / total) * 100) : 0;
    const rentLabel = 'Total rent';
    const rentValue = rs.potential ? formatRentAmount(rs.potential) : '—';
    const metrics = [
        ['layers', 'Units', String(total)],
        ['building-2', 'Floors', String(floors)],
        ['users', 'Occupied', `${occupied}/${total}`, occupancyPct],
        ['pound-sterling', rentLabel, rentValue, 'accent'],
    ];
    return `
        <div class="building-metrics-grid">
            ${metrics.map(([icon, label, value, variant]) => `
            <div class="building-metric-compact ${variant === 'accent' ? 'building-metric-compact--accent' : ''} ${typeof variant === 'number' ? 'building-metric-compact--progress' : ''}">
                <div class="building-metric-compact-main">
                    <div class="building-metric-compact-left">
                        <span class="building-metric-icon"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i></span>
                        <span class="building-metric-compact-label">${label}</span>
                    </div>
                    <span class="building-metric-compact-value">${value}</span>
                </div>
                ${typeof variant === 'number' && total ? `<div class="building-metric-compact-bar" aria-hidden="true"><span style="width:${variant}%"></span></div>` : ''}
            </div>`).join('')}
        </div>`;
}

function propertyHubStatusBadge(propertyId) {
    const p = PROPERTIES[propertyId];
    syncPropertyStatus(propertyId);
    if (!p?.compliance) return { label: 'Action needed', bg: '#FEF3C7', color: '#D97706' };
    const units = getPropertyUnits(propertyId);
    if (!units.length || units.every(u => u.status !== 'occupied')) {
        return { label: 'Vacant', bg: '#FEF3C7', color: '#D97706' };
    }
    return { label: 'Active', bg: '#DCFCE7', color: '#16A34A' };
}

function flatRowSpecLine(u) {
    const parts = [];
    if (u.beds) parts.push(`${u.beds} Bed${u.beds === 1 ? '' : 's'}`);
    if (u.baths) parts.push(`${u.baths} Bath${u.baths === 1 ? '' : 's'}`);
    return parts.join(' - ');
}

function floorGroupKey(propertyId, floor) {
    return `${propertyId}:${floor}`;
}

function isFloorGroupCollapsed(propertyId, floor) {
    return !!(STATE.collapsedFloors && STATE.collapsedFloors[floorGroupKey(propertyId, floor)]);
}

function toggleFloorGroup(propertyId, floor) {
    if (!STATE.collapsedFloors) STATE.collapsedFloors = {};
    const key = floorGroupKey(propertyId, floor);
    STATE.collapsedFloors[key] = !STATE.collapsedFloors[key];
    render();
}

function flatRowTenantLine(tenancy, members, occ) {
    if (!occ) return '';
    const lead = members?.find(m => m.isLead) || members?.[0];
    if (lead?.name) return lead.name;
    return tenancy ? 'Occupied' : '';
}

function renderPropertyHubSummaryCard(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return '';
    const { units, occupiedFlats, floors } = propertyHubStats(propertyId);
    const vacantFlats = units.length - occupiedFlats;
    const cover = getPropertyCoverPhoto(propertyId);
    const status = propertyHubStatusBadge(propertyId);
    const unitWord = units.length === 1 ? 'Unit' : 'Units';
    const floorWord = floors === 1 ? 'Floor' : 'Floors';
    const { monthlyRent } = typeof propertyCardStats === 'function'
        ? propertyCardStats(propertyId)
        : { monthlyRent: getPropertyRentSummary(propertyId).potential };
    const incomeLabel = monthlyRent > 0 ? `${formatRentAmount(monthlyRent)}/mo` : '—';
    return `
    <div class="prop-hub-summary card">
        <div class="prop-hub-summary-top">
            <div class="prop-hub-summary-media">
                <img src="${cover}" alt="">
                <span class="prop-hub-summary-badge" style="background:${status.bg};color:${status.color}">${status.label}</span>
            </div>
            <div class="prop-hub-summary-stats">
                <div class="prop-hub-stat">
                    <span class="prop-hub-stat-head"><i data-lucide="building-2" class="w-3 h-3"></i><span class="prop-hub-stat-lbl">${unitWord}</span></span>
                    <span class="prop-hub-stat-val">${units.length}</span>
                </div>
                <div class="prop-hub-stat">
                    <span class="prop-hub-stat-head"><i data-lucide="layers" class="w-3 h-3"></i><span class="prop-hub-stat-lbl">${floorWord}</span></span>
                    <span class="prop-hub-stat-val">${floors}</span>
                </div>
                <div class="prop-hub-stat prop-hub-stat--occupied">
                    <span class="prop-hub-stat-head"><i data-lucide="users" class="w-3 h-3"></i><span class="prop-hub-stat-lbl">Occupied</span></span>
                    <span class="prop-hub-stat-val">${occupiedFlats}</span>
                </div>
                <div class="prop-hub-stat prop-hub-stat--vacant">
                    <span class="prop-hub-stat-head"><i data-lucide="door-open" class="w-3 h-3"></i><span class="prop-hub-stat-lbl">Vacant</span></span>
                    <span class="prop-hub-stat-val">${vacantFlats}</span>
                </div>
            </div>
        </div>
        <div class="prop-hub-summary-foot">
            <span class="prop-hub-income-lbl">Total rent</span>
            <span class="prop-hub-income-val"><i data-lucide="wallet" class="w-4 h-4"></i>${incomeLabel}</span>
        </div>
    </div>`;
}

function renderPropertyBuildingSummaryCard(propertyId, options = {}) {
    const { showDetailsBtn = false, compact = false } = options;
    const p = PROPERTIES[propertyId];
    const { units, occupiedFlats } = propertyHubStats(propertyId);
    const vacantFlats = units.length - occupiedFlats;
    const cover = getPropertyCoverPhoto(propertyId);
    const unitWord = units.length === 1 ? 'unit' : 'units';
    const occPct = units.length ? Math.round((occupiedFlats / units.length) * 100) : 0;
    const occLabel = `${occupiedFlats}/${units.length} Occupied`;
    return `
    <div class="prop-building-header card${compact ? ' prop-building-header--compact' : ''}">
        <div class="prop-building-header-top">
            <div class="prop-building-header-media">
                <img src="${cover}" alt="">
                <span class="prop-building-header-badge">${units.length} ${unitWord}</span>
            </div>
            <div class="prop-building-header-info">
                <div class="prop-building-header-title-row">
                    <div class="min-w-0">
                        <div class="prop-building-header-name-row">
                            <h2 class="prop-building-header-name">${p.name}</h2>
                            <span class="prop-building-header-type">${propertyTypeTag(propertyId)}</span>
                        </div>
                        <p class="prop-building-header-addr"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>${p.address}</p>
                    </div>
                    <div class="prop-building-header-occ">
                        ${typeof occupancyRing === 'function' ? occupancyRing(occPct) : ''}
                        <span>${occLabel}</span>
                    </div>
                </div>
            </div>
        </div>
        ${compact ? '' : `
        <div class="prop-building-header-stats">
            <div class="prop-building-stat">
                <p class="prop-building-stat-val">${units.length}</p>
                <p class="prop-building-stat-lbl">Total Units</p>
            </div>
            <div class="prop-building-stat">
                <p class="prop-building-stat-val">${occupiedFlats}</p>
                <p class="prop-building-stat-lbl">Occupied</p>
            </div>
            <div class="prop-building-stat">
                <p class="prop-building-stat-val">${vacantFlats}</p>
                <p class="prop-building-stat-lbl">Vacant</p>
            </div>
            ${showDetailsBtn ? `<button type="button" data-tab="info" class="prop-building-details-btn">View Details <i data-lucide="chevron-right" class="w-4 h-4"></i></button>` : ''}
        </div>`}
    </div>`;
}

function buildingSectionCardClass() {
    return 'building-section card';
}

function renderBuildingSectionHead(title, metaHtml = '') {
    return `
    <div class="building-section-head">
        <h3>${title}</h3>
        ${metaHtml ? `<div class="building-section-head-actions">${metaHtml}</div>` : ''}
    </div>`;
}

function renderPropertyOverviewDetails(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return '';
    const meta = AppStore.meta(propertyId);
    const info = meta.info || {};
    const units = getPropertyUnits(propertyId);
    const occupied = units.filter(u => u.status === 'occupied').length;
    const cover = getPropertyCoverPhoto(propertyId);
    const photoCount = meta.photos?.length || 0;
    const photos = meta.photos?.length ? meta.photos : [IMG.props[propertyId]];
    const utilItems = propertyUtilityDisplayItems(meta);
    const applianceItems = typeof applianceSummaryItems === 'function'
        ? applianceSummaryItems(meta.appliances)
        : (meta.appliances || []).map(a => ({
            icon: applianceIcon(a.name),
            label: a.name,
            sub: a.brand || '',
        }));
    const alarmItems = [
        ...ALARM_CATALOG
            .filter(a => alarmHasData(meta.alarms?.[a.key]))
            .map(a => {
                const alarm = meta.alarms[a.key];
                const parts = [
                    alarm.location || '',
                    alarm.expiry ? `Expires ${formatInfoDate(alarm.expiry)}` : '',
                ].filter(Boolean);
                return { icon: a.icon, label: `${a.label} Alarm`, sub: parts.join(' · ') };
            }),
        ...propertyCustomAlarmItems(meta),
    ];
    const featureItems = [...applianceItems, ...alarmItems];
    const valuationLabel = info.valuationAmount
        ? [formatMoneyField(info.valuationAmount), info.valuationDate ? `as of ${formatInfoDate(info.valuationDate)}` : ''].filter(Boolean).join(' ')
        : '';
    const infoRows = [
        ['map-pin', 'Address', p.address || '—'],
        ...(info.postcode ? [['map', 'Postcode', info.postcode]] : []),
        ['home', 'Type', info.type || '—'],
        ['calendar', 'Year Built', info.built || '—'],
        ...(info.furnished ? [['sofa', 'Furnished', info.furnished]] : []),
        ...(info.purchaseDate ? [['calendar', 'Purchase Date', formatInfoDate(info.purchaseDate)]] : []),
        ...(valuationLabel ? [['trending-up', 'Valuation', valuationLabel]] : []),
        ['leaf', 'EPC', formatEpcDisplay(info.epc)],
        ['calendar-clock', 'EPC Expiry', formatInfoDate(info.epcExpiry)],
        ['shield', 'Insurance Renewal', formatInfoDate(info.insuranceExpiry)],
        ['landmark', 'Mortgage Renewal', formatInfoDate(info.mortgageRenewal)],
        ['receipt', 'Council Tax', info.councilTax || '—'],
        ...(info.alarmCode ? [['key-round', 'Alarm Code', info.alarmCode]] : []),
    ];
    const b = getPropertyBuilding(propertyId);
    const floors = b.useFloors && b.floors > 1 ? b.floors : Math.max(1, new Set(units.map(u => u.floor || 1)).size);
    const vacant = units.length - occupied;
    return `
    <div class="screen-content screen-content-sm building-info-page building-info-page--v2">
        <div class="prop-overview-strip card">
            <div class="prop-overview-stat"><strong>${occupied}</strong><span>Occupied</span></div>
            <div class="prop-overview-divider"></div>
            <div class="prop-overview-stat"><strong>${vacant}</strong><span>Vacant</span></div>
            <div class="prop-overview-divider"></div>
            <div class="prop-overview-stat"><strong>${units.length}</strong><span>Units</span></div>
            <div class="prop-overview-divider"></div>
            <div class="prop-overview-stat"><strong>${floors}</strong><span>Floors</span></div>
        </div>
        <div class="${buildingSectionCardClass()}">
            ${renderBuildingSectionHead('Property Photos', `<span class="building-section-meta">${photoCount} photo${photoCount === 1 ? '' : 's'}</span>`)}
            <button type="button" data-go="property-photos" data-pid="${propertyId}" class="building-photo-grid building-photo-grid--tap" aria-label="Manage property photos">
                ${photos.slice(0, 3).map((src, i) => `
                <div class="building-photo-thumb">
                    <img src="${src}" alt="">
                    ${i === 0 ? '<span class="photo-cover-badge">COVER</span>' : ''}
                </div>`).join('')}
            </button>
        </div>
        <div class="${buildingSectionCardClass()}">
            ${renderBuildingSectionHead('Floor Plans', `<span class="building-section-meta">${(meta.floorPlans || []).length} plan${(meta.floorPlans || []).length === 1 ? '' : 's'}</span>`)}
            <button type="button" data-go="property-floor-plans" data-pid="${propertyId}" class="building-section-tap building-info-tap" aria-label="Manage floor plans">
                <div class="building-info-rows">
                    <div class="building-info-row">
                        <div class="building-info-row-left">
                            <i data-lucide="layout-grid" class="w-4 h-4 text-[#94A3B8]"></i>
                            <span class="building-info-row-label">Floor plans</span>
                        </div>
                        <span class="building-info-row-value">${(meta.floorPlans || []).length ? `${meta.floorPlans.length} uploaded` : 'Add floor plans'}</span>
                    </div>
                </div>
                <span class="building-section-chevron"><i data-lucide="chevron-right" class="w-4 h-4"></i></span>
            </button>
        </div>
        <div class="${buildingSectionCardClass()}">
            ${renderBuildingSectionHead('Property Information')}
            <button type="button" data-go="property-info" data-pid="${propertyId}" class="building-section-tap building-info-tap" aria-label="Edit property information">
                <div class="building-info-rows">
                    ${infoRows.map(([icon, label, value]) => `
                    <div class="building-info-row${label === 'Address' ? ' building-info-row--address' : ''}">
                        <div class="building-info-row-left">
                            <i data-lucide="${icon}" class="w-4 h-4 text-[#94A3B8]"></i>
                            <span class="building-info-row-label">${label}</span>
                        </div>
                        <span class="building-info-row-value">${escapeHtml(String(value))}</span>
                    </div>`).join('')}
                </div>
                ${info.description ? `
                <div class="building-notes-block">
                    <p class="building-notes-label">Description</p>
                    <p class="building-notes-text">${escapeHtml(info.description)}</p>
                </div>` : ''}
                ${info.notes ? `
                <div class="building-notes-block">
                    <p class="building-notes-label">Notes</p>
                    <p class="building-notes-text">${escapeHtml(info.notes)}</p>
                </div>` : ''}
            </button>
        </div>
        <div class="${buildingSectionCardClass()}">
            ${renderBuildingSectionHead('Utilities & Parking')}
            ${utilItems.length ? `
            <button type="button" data-go="property-utilities" data-pid="${propertyId}" class="building-section-tap" aria-label="Edit utilities">
            <div class="building-icon-grid cols-3">
                ${utilItems.map(item => renderBuildingIconItem(item)).join('')}
            </div>
            </button>` : `<p class="building-empty-copy">No utilities set yet. <button type="button" data-go="property-utilities" data-pid="${propertyId}" class="header-text-link">Add utilities</button></p>`}
            ${renderBuildingParkingBlock(meta, propertyId)}
        </div>
        <div class="${buildingSectionCardClass()}">
            ${renderBuildingSectionHead('Appliances & Alarms')}
            ${featureItems.length ? `
            ${applianceItems.length ? `
            <button type="button" data-go="property-appliances" data-pid="${propertyId}" class="building-section-tap" aria-label="Edit appliances">
                ${applianceItems.length && alarmItems.length ? '<p class="building-subsection-label">Appliances</p>' : ''}
                <div class="building-icon-grid cols-2">
                    ${applianceItems.map(item => renderBuildingIconItem(item)).join('')}
                </div>
            </button>` : ''}
            ${alarmItems.length ? `
            <button type="button" data-go="property-alarms" data-pid="${propertyId}" class="building-section-tap building-subsection-tap${applianceItems.length ? ' building-subsection-tap--divider' : ''}" aria-label="Edit alarms">
                ${applianceItems.length ? '<p class="building-subsection-label">Alarms</p>' : ''}
                <div class="building-icon-grid cols-2">
                    ${alarmItems.map(item => renderBuildingIconItem(item)).join('')}
                </div>
            </button>` : ''}` : `<p class="building-empty-copy">No appliances or alarms added yet. <button type="button" data-go="property-appliances" data-pid="${propertyId}" class="header-text-link">Add items</button></p>`}
        </div>
    </div>`;
}

/* ─── Tenant lifecycle sync (invite → tenancy → activation → checkout) ─── */
const CONTRACTOR_CHAT_MAP = { 'Plumber Pro': 1, 'Heating Co.': 5, 'Heating Experts': 5, 'Electric Fix': 3, 'Electric Fixers': 3 };

function nextTenantListId() {
    return TENANT_LIST.length ? Math.max(...TENANT_LIST.map(t => t.id)) + 1 : 0;
}

function tenantListByProperty(propertyId) {
    return TENANT_LIST.find(t => t.propertyId === propertyId && t.status === 'active')
        || TENANT_LIST.find(t => t.propertyId === propertyId && t.status === 'pending');
}

function tenantListItemForInvite(invite) {
    if (!invite) return null;
    const fullName = `${invite.firstName} ${invite.lastName}`.trim();
    const email = (invite.email || '').toLowerCase();
    return TENANT_LIST.find(t =>
        t.propertyId === invite.propertyId &&
        t.unit === invite.unit &&
        (t.name === fullName || (email && TENANTS[t.id]?.email?.toLowerCase() === email))
    ) || TENANT_LIST.find(t =>
        t.propertyId === invite.propertyId &&
        email && TENANTS[t.id]?.email?.toLowerCase() === email
    ) || null;
}

function tenantsForUnit(propertyId, unitName) {
    return TENANT_LIST.filter(t => t.propertyId === propertyId && t.unit === unitName && (t.status === 'active' || t.status === 'pending'));
}

function tenancyTypeLabel(type) {
    return type === 'group' ? 'Group tenancy' : 'Solo tenancy';
}

function tenancyTypePill(type) {
    const isGroup = type === 'group';
    return `<span class="tenancy-type-pill ${isGroup ? 'tenancy-type-pill--group' : 'tenancy-type-pill--solo'}">${isGroup ? 'Group' : 'Solo'}</span>`;
}

function flatTenancyListHint(propertyId, unitName) {
    const { tenancy, count } = getFlatMemberRoster(propertyId, unitName);
    if (!tenancy) return '';
    if (tenancy.type === 'group') return `Group · ${count} tenant${count === 1 ? '' : 's'}`;
    return 'Solo · 1 tenant';
}

function leaseMonthsLabel(tenancy) {
    if (!tenancy?.start || !tenancy?.end) return '';
    const start = new Date(tenancy.start);
    const end = new Date(tenancy.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';
    const months = Math.max(1, Math.round((end - start) / (30.44 * 86400000)));
    return `Lease: ${months} month${months === 1 ? '' : 's'}`;
}

function propertyTypeTag(propertyId) {
    const units = getPropertyUnits(propertyId);
    if (units.length <= 1) return 'Single unit';
    const types = new Set(getActiveTenanciesForProperty(propertyId).map(t => t.type));
    if (types.size > 1) return 'Mixed use';
    return 'Residential';
}

function flatRowSubline(tenancy, count, flatPending, occ, u, opts = {}) {
    if (flatPending.length) return 'Invite pending';
    if (u?.status === 'reserved') return 'Lease reserved';
    if (occ && tenancy) {
        if (tenancy.type === 'group') {
            const n = count || tenancy.occupants || 0;
            return n ? `${n} tenant${n === 1 ? '' : 's'}` : 'Group';
        }
        const lead = opts.members?.find(m => m.isLead) || opts.members?.[0];
        if (lead?.name) return lead.name;
        return 'Occupied';
    }
    if (occ) return 'Occupied';
    const spec = [];
    if (u.beds) spec.push(`${u.beds} bed`);
    if (u.baths) spec.push(`${u.baths} bath`);
    const base = spec.length ? spec.join(' · ') : 'Ready to let';
    if (opts.hideFloor) return `${base} · Available`;
    const floor = flatFloorLine(u);
    return floor ? `${base} · Available` : `${base} · Available`;
}

function flatRowRentLabel(tenancy, u, occ) {
    const showRent = occ || u?.status === 'reserved';
    const raw = (showRent && tenancy?.rent) ? tenancy.rent : u.rent;
    if (!raw || raw === '—') return '—';
    const cleaned = String(raw).replace(/\s*\/\s*mo(?:nth)?/gi, '').trim();
    return cleaned ? `${cleaned}/mo` : '—';
}

function filterPropertyUnits(units) {
    const f = STATE.unitFilter || 'all';
    if (f === 'occupied') return units.filter(u => u.status === 'occupied');
    if (f === 'vacant') return units.filter(u => u.status === 'vacant');
    return units;
}

function tenancyHintClass(type) {
    return type === 'group' ? 'flat-list-tenancy-hint--group' : 'flat-list-tenancy-hint--solo';
}

function getTenancyForTenantListItem(t) {
    if (!t?.propertyId || !t.unit) return null;
    return getTenancyForUnit(t.propertyId, t.unit);
}

function tenantTenancyMetaLine(t) {
    const tenancy = getTenancyForTenantListItem(t);
    if (!tenancy || tenancy.type !== 'group') return '';
    const { count } = getFlatMemberRoster(t.propertyId, t.unit);
    if (t.status === 'pending') return 'Group member · invite pending';
    if (tenancy.leadName && tenancy.leadName !== t.name) return 'Group member · shared lease';
    return count > 1 ? `${count} on unit` : '';
}

function tenantListMetaLine(t) {
    const tenancy = getTenancyForTenantListItem(t);
    if (tenancy?.type === 'group') {
        if (t.status === 'pending') return 'Group member · portal invite pending';
        if (tenancy.leadName && tenancy.leadName !== t.name) return 'Group member · shared lease';
        return `${t.rent} · group lead`;
    }
    return t.rent;
}

function formatReminderDaysLeft(daysLeft) {
    if (daysLeft == null) return '—';
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft} days left`;
}

function renderTenancyDemoTip(propertyId) {
    const active = getActiveTenanciesForProperty(propertyId);
    const hasSolo = active.some(t => t.type === 'solo');
    const hasGroup = active.some(t => t.type === 'group');
    if (!hasSolo || !hasGroup) return '';
    return `
    <div class="ux-tip tenancy-demo-tip">
        <p class="ux-tip-title">Solo vs group examples</p>
        <p class="ux-tip-text">Compare <strong>Flat 2A</strong> (solo — one tenant) with <strong>Flat 2B</strong> (group — several members on one lease).</p>
    </div>`;
}

function renderPropertyFlatRow(propertyId, u, opts = {}) {
    const name = unitName(u);
    const occ = u.status === 'occupied';
    const thumb = getFlatCoverPhoto(propertyId, name);
    const { tenancy, count, members } = getFlatMemberRoster(propertyId, name);
    const flatPending = (opts.pendingInvites || []).filter(i => i.unit === name);
    if (opts.tenantsOnly && !tenancy && !count && !flatPending.length) return '';
    const subline = flatRowSubline(tenancy, count, flatPending, occ, u, { hideFloor: opts.inPanel, members });
    const rentLabel = flatRowRentLabel(tenancy, u, occ);
    const typePill = tenancy && opts.showTypePill ? tenancyTypePill(tenancy.type) : '';
    const wrapClass = opts.inPanel ? 'unit-card-v2-wrap unit-card-v2-wrap--row' : 'unit-card-v2-wrap card';
    const unitMenuKey = actionMenuKeyFor('unit', propertyId, name);
    const menuOpen = isActionMenuOpen(unitMenuKey);
    const tenancyClass = tenancy ? `unit-card-v2--${tenancy.type}` : (!occ ? 'unit-card-v2--vacant' : '');
    if (opts.hubList) {
        const spec = flatRowSpecLine(u);
        const tenant = flatRowTenantLine(tenancy, members, occ);
        const statusBadge = u.status === 'occupied'
            ? '<span class="unit-hub-badge unit-hub-badge--occupied">Occupied</span>'
            : u.status === 'reserved'
                ? '<span class="unit-hub-badge unit-hub-badge--reserved">Reserved</span>'
                : '<span class="unit-hub-badge unit-hub-badge--vacant">Vacant</span>';
        return `
        <div class="unit-hub-row-wrap">
            <button type="button" data-go="flat-detail" data-pid="${propertyId}" data-unit="${name}" class="unit-hub-row">
                <div class="unit-hub-thumb"><img src="${thumb}" alt=""></div>
                <div class="unit-hub-body">
                    <p class="unit-hub-name">${name}</p>
                    ${tenant ? `<p class="unit-hub-tenant">${escapeHtml(tenant)}</p>` : ''}
                    ${spec ? `<p class="unit-hub-spec">${spec}</p>` : ''}
                </div>
                <div class="unit-hub-meta">
                    ${statusBadge}
                    <p class="unit-hub-rent">${rentLabel}</p>
                </div>
                <i data-lucide="chevron-right" class="unit-hub-chevron w-4 h-4"></i>
            </button>
        </div>`;
    }
    return `
    <div class="${wrapClass} ${tenancyClass} ${menuOpen ? 'unit-card-v2-wrap--menu-open' : ''}">
    <div class="unit-card-v2-main">
    <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${name}" class="unit-card-v2 unit-card-v2-tap w-full text-left">
        <div class="unit-card-v2-thumb"><img src="${thumb}" alt=""></div>
        <div class="unit-card-v2-body">
            <div class="unit-card-v2-title-row">
                <p class="unit-card-v2-name">${name}</p>
                ${typePill}
            </div>
            <p class="unit-card-v2-meta">${subline}</p>
        </div>
        <div class="unit-card-v2-right">
            ${!occ ? `<span class="unit-card-v2-badge unit-card-v2-badge--vacant">Vacant</span>` : ''}
            <p class="unit-card-v2-rent">${rentLabel}</p>
        </div>
    </button>
    <div class="unit-card-v2-menu">
        ${renderActionMenuButton(unitMenuKey, 'Unit options')}
        ${renderActionMenuPopover(unitMenuKey, unitActionMenuItems(propertyId, name))}
    </div>
    </div>
    </div>`;
}

function memberAccountLabel(status) {
    return { active: 'Account active', pending: 'Invite pending', 'no-account': 'No account yet' }[status] || 'No account yet';
}

function memberAccountStyle(status) {
    return {
        active: ['#DCFCE7', '#16A34A'],
        pending: ['#FEF3C7', '#D97706'],
        'no-account': ['#F1F5F9', '#64748B'],
    }[status] || ['#F1F5F9', '#64748B'];
}

const PERSON_AVATAR_PALETTE = [
    ['#E0E7FF', '#4338CA'],
    ['#FCE7F3', '#BE185D'],
    ['#D1FAE5', '#047857'],
    ['#FEF3C7', '#B45309'],
    ['#EDE9FE', '#6D28D9'],
    ['#FFE4E6', '#BE123C'],
];

function personInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function personAvatarSeed(name, id) {
    const s = String(name || id || 0);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % PERSON_AVATAR_PALETTE.length;
    return h;
}

function memberUsesPhotoAvatar(member) {
    const img = member?.img || '';
    if (!img) return false;
    if (typeof IMG !== 'undefined' && IMG.interior?.includes(img)) return false;
    return /unsplash|avatar|pravatar|i\.pravatar/i.test(img) || (typeof IMG !== 'undefined' && Object.values(IMG.avatar || {}).includes(img));
}

function renderPersonAvatar(name, id, size = 'md') {
    const [bg, color] = PERSON_AVATAR_PALETTE[personAvatarSeed(name, id)];
    return `<span class="person-avatar person-avatar--${size}" style="background:${bg};color:${color}" aria-hidden="true">${personInitials(name)}</span>`;
}

function renderMemberAvatar(member, size = 'md') {
    if (memberUsesPhotoAvatar(member)) {
        return `<img src="${member.img}" class="member-row-avatar member-row-avatar--${size}" alt="">`;
    }
    const [bg, color] = PERSON_AVATAR_PALETTE[personAvatarSeed(member.name, member.tenantId ?? member.listId)];
    return `<span class="person-avatar member-row-avatar member-row-avatar--${size}" style="background:${bg};color:${color}" aria-hidden="true">${personInitials(member.name)}</span>`;
}

function memberStatusCopy(member) {
    if (member.isLead && member.accountStatus === 'active') return 'Main contact · on the lease';
    if (member.isLead && member.accountStatus === 'pending') return 'Main contact · invite sent';
    if (member.isLead) return 'Main contact · no account yet';
    if (member.accountStatus === 'active') return 'On the lease · account active';
    if (member.accountStatus === 'pending') return 'Invite sent · waiting to join';
    return 'On the lease · not invited yet';
}

function memberStatusDotClass(status) {
    return {
        active: 'member-status-dot--active',
        pending: 'member-status-dot--pending',
        'no-account': 'member-status-dot--none',
    }[status] || 'member-status-dot--none';
}

function flatTenancyHumanLine(tenancy, members = []) {
    if (!tenancy) return '';
    const lead = members.find(m => m.isLead) || members[0];
    if (tenancy.type === 'group') {
        const n = members.length;
        return n ? `${n} people sharing this lease` : 'Group lease';
    }
    return lead?.name ? `${lead.name.split(' ')[0]} lives here` : 'One person on the lease';
}

function resolveMemberIdentity(member, propertyId, unitName, tenancy) {
    let tenantId = member.tenantId;
    let listItem = tenantId != null ? TENANT_LIST.find(t => t.id === tenantId) : null;
    const record = tenantId != null ? tenantRecordById(tenantId) : null;
    if (!listItem && member.email) {
        const rec = TENANTS.find(t =>
            t.email?.toLowerCase() === member.email.toLowerCase() &&
            t.propertyId === propertyId && t.unit === unitName
        );
        if (rec) {
            tenantId = rec.id;
            listItem = TENANT_LIST.find(t => t.id === rec.id);
        }
    }
    if (!listItem && member.name) {
        listItem = TENANT_LIST.find(t => t.name === member.name && t.propertyId === propertyId && t.unit === unitName);
        if (listItem) tenantId = listItem.id;
    }
    const pendingInvite = TENANT_INVITATIONS.find(i =>
        i.propertyId === propertyId && i.unit === unitName && i.status === 'pending' &&
        (member.email && i.email?.toLowerCase() === member.email.toLowerCase() ||
            member.name && `${i.firstName} ${i.lastName}` === member.name)
    );
    let accountStatus = member.status === 'active' ? 'active' : member.status === 'pending' ? 'pending' : 'no-account';
    if (listItem?.status === 'active') accountStatus = 'active';
    else if (listItem?.status === 'pending' || pendingInvite) accountStatus = 'pending';
  const isLead = member.role === 'lead' || tenancy?.leadName === member.name || tenancy?.tenantId === tenantId;
    return {
        name: member.name || listItem?.name || 'Occupant',
        email: member.email || record?.email || pendingInvite?.email || '',
        phone: member.phone || record?.phone || pendingInvite?.phone || '',
        tenantId: listItem?.status === 'active' ? tenantId : null,
        listId: listItem?.id,
        accountStatus,
        img: listItem?.img || (typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tenantId) : IMG.avatar.sarah),
        isLead,
        inviteToken: pendingInvite?.token,
    };
}

function resolveMemberFromTenantList(listItem, tenancy) {
    const record = tenantRecordById(listItem.id);
    const pendingInvite = TENANT_INVITATIONS.find(i =>
        i.propertyId === listItem.propertyId && i.unit === listItem.unit && i.status === 'pending' &&
        (record?.email && i.email?.toLowerCase() === record.email.toLowerCase())
    );
    const accountStatus = listItem.status === 'active' ? 'active' : (listItem.status === 'pending' || pendingInvite) ? 'pending' : 'no-account';
    return {
        name: listItem.name,
        email: record?.email || '',
        phone: record?.phone || '',
        tenantId: listItem.status === 'active' ? listItem.id : null,
        listId: listItem.id,
        accountStatus,
        img: listItem.img,
        isLead: tenancy?.tenantId === listItem.id || tenancy?.leadName === listItem.name,
        inviteToken: pendingInvite?.token,
    };
}

function getFlatMemberRoster(propertyId, unitName) {
    const tenancy = getTenancyForUnit(propertyId, unitName);
    const unitTenants = tenantsForUnit(propertyId, unitName);
    const invites = pendingInvitesForProperty(propertyId).filter(i => i.unit === unitName);
    const roster = [];
    const seen = new Set();
    const push = (m) => {
        const key = (m.email || m.name || '').toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        roster.push(m);
    };
    if (tenancy?.members?.length) {
        tenancy.members.forEach(m => push(resolveMemberIdentity(m, propertyId, unitName, tenancy)));
    }
    unitTenants.forEach(t => push(resolveMemberFromTenantList(t, tenancy)));
    invites.forEach(inv => push({
        name: `${inv.firstName} ${inv.lastName}`.trim(),
        email: inv.email,
        phone: inv.phone || '',
        tenantId: null,
        listId: TENANT_LIST.find(t => t.propertyId === propertyId && t.unit === unitName && t.name === `${inv.firstName} ${inv.lastName}`)?.id,
        accountStatus: 'pending',
        img: IMG.avatar.sarah,
        isLead: false,
        inviteToken: inv.token,
    }));
    const activeCount = roster.filter(m => m.accountStatus === 'active').length;
    return { tenancy, members: roster, count: roster.length, activeCount };
}

function flatMemberCountLabel(propertyId, unitName) {
    const { count, activeCount, tenancy } = getFlatMemberRoster(propertyId, unitName);
    if (!tenancy && !count) return '';
    if (count <= 1) return activeCount ? '1 member' : count ? '1 occupant' : '';
    return `${count} members${activeCount ? ` · ${activeCount} active` : ''}`;
}

function linkMemberToTenancy(tenancy, invite, tenantId) {
    if (!tenancy) return;
    if (!tenancy.members) tenancy.members = [];
    const fullName = `${invite.firstName} ${invite.lastName}`.trim();
    const idx = tenancy.members.findIndex(m =>
        (m.email && invite.email && m.email.toLowerCase() === invite.email.toLowerCase()) ||
        m.name === fullName
    );
    const payload = {
        name: fullName,
        email: invite.email,
        phone: invite.phone || '—',
        tenantId,
        status: 'active',
        role: idx === 0 && tenancy.type === 'group' ? 'lead' : undefined,
    };
    if (idx >= 0) tenancy.members[idx] = { ...tenancy.members[idx], ...payload };
    else if (tenancy.type === 'group') tenancy.members.push(payload);
    if (!tenancy.leadName && tenancy.type === 'group') tenancy.leadName = fullName;
    tenancy.tenantId = tenancy.tenantId ?? tenantId;
}

function memberStatusPill(member) {
    const pills = [];
    if (member.isLead) pills.push('<span class="member-status-pill member-status-pill--lead">Lead</span>');
    if (member.accountStatus === 'active') pills.push('<span class="member-status-pill member-status-pill--active">Active</span>');
    else if (member.accountStatus === 'pending') pills.push('<span class="member-status-pill member-status-pill--pending">Pending</span>');
    else pills.push('<span class="member-status-pill member-status-pill--none">No account</span>');
    return pills.join('');
}

function memberMenuKey(propertyId, unitName, member) {
    const id = (member.email || member.name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return actionMenuKeyFor('member', propertyId, unitName, id);
}

function memberActionMenuItems(propertyId, unitName, member) {
    const nameParts = (member.name || '').trim().split(/\s+/);
    const inviteFirst = nameParts[0] || '';
    const inviteLast = nameParts.slice(1).join(' ') || '';
    const items = [];
    if (member.listId != null && TENANT_LIST[member.listId]) {
        items.push({ label: 'Edit', icon: 'pencil', action: 'action-menu-go', attrs: `data-go="edit-tenant" data-tid="${member.listId}"` });
    } else if (member.inviteToken) {
        items.push({ label: 'Edit', icon: 'pencil', action: 'action-menu-go', attrs: `data-go="tenant-invite-sent" data-invite-token="${member.inviteToken}"` });
    } else {
        items.push({
            label: 'Edit', icon: 'pencil', action: 'action-menu-go',
            attrs: `data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unitName}" data-invite-email="${member.email || ''}" data-invite-first="${inviteFirst}" data-invite-last="${inviteLast}" data-invite-phone="${member.phone || ''}"`,
        });
    }
    const emailAttr = member.email ? `data-member-email="${member.email}"` : '';
    items.push({
        label: 'Delete', icon: 'trash-2', action: 'action-menu-delete-member', danger: true,
        attrs: `data-pid="${propertyId}" data-unit="${unitName}" ${emailAttr} data-member-name="${member.name || ''}"`,
    });
    return items;
}

function renderMemberRow(member, propertyId, unitName, opts = {}) {
    const profileId = member.listId ?? member.tenantId;
    const canOpenProfile = profileId != null;
    const nameParts = (member.name || '').trim().split(/\s+/);
    const inviteFirst = nameParts[0] || '';
    const inviteLast = nameParts.slice(1).join(' ') || '';
    const action = canOpenProfile
        ? `data-go="tenant-detail" data-tid="${profileId}"`
        : member.inviteToken
            ? `data-go="tenant-invite-sent" data-invite-token="${member.inviteToken}"`
            : `data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unitName}" data-invite-email="${member.email || ''}" data-invite-first="${inviteFirst}" data-invite-last="${inviteLast}" data-invite-phone="${member.phone || ''}"`;
    if (opts.detail) {
        const menuKey = memberMenuKey(propertyId, unitName, member);
        const menuOpen = isActionMenuOpen(menuKey);
        return `
        <div class="member-row member-row--detail${menuOpen ? ' member-row--menu-open' : ''}">
            ${opts.showAvatar ? renderMemberAvatar(member, 'md') : ''}
            <div class="member-row-body">
                <p class="member-row-name">${member.name}</p>
                <div class="member-row-tags">${memberStatusPill(member)}</div>
            </div>
            <div class="member-row-menu-slot">
                ${renderActionMenuButton(menuKey, `${member.name} options`)}
                ${renderActionMenuPopover(menuKey, memberActionMenuItems(propertyId, unitName, member))}
            </div>
        </div>`;
    }
    if (opts.tenantTab) {
        return `
    <button type="button" ${action} class="member-row member-row--tenant-tab">
        ${renderMemberAvatar(member, 'md')}
        <div class="member-row-body">
            <p class="member-row-name">${member.name}</p>
            <div class="member-row-tags">${memberStatusPill(member)}</div>
        </div>
        <i data-lucide="chevron-right" class="member-row-chevron w-4 h-4"></i>
    </button>`;
    }
    return `
    <button type="button" ${action} class="member-row member-row--simple">
        <div class="member-row-body">
            <p class="member-row-name">${member.name}</p>
            <div class="member-row-tags">${memberStatusPill(member)}</div>
        </div>
        <i data-lucide="chevron-right" class="member-row-chevron w-4 h-4"></i>
    </button>`;
}

function renderFlatTenancyCard(propertyId, unitName, opts = {}) {
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unitName);
    const compact = opts.compact;
    if (!tenancy && !members.length) return '';
    const isGroup = tenancy?.type === 'group';
    const leaseLine = tenancy
        ? `${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start} – ${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end}`
        : '—';
    const membersLabel = isGroup ? `Members (${count})` : 'Tenant';
    return `
    <div class="tenancy-card card p-4 ${isGroup ? 'tenancy-card--group' : 'tenancy-card--solo'}">
        <div class="detail-title-row">
            <div>
                <div class="tenancy-card-head-tags">
                    ${tenancy ? tenancyTypePill(tenancy.type) : ''}
                </div>
                <p class="tenancy-card-meta mt-1">${tenancy?.rent || '—'}/month · ${leaseLine}</p>
            </div>
            ${tenancy ? `<button data-go="tenancy-detail" data-pid="${propertyId}" data-unit="${unitName}" class="header-text-link">View</button>` : ''}
        </div>
        ${count ? `
        <div class="tenancy-member-strip">
            <p class="tenancy-member-count">${membersLabel}${isGroup && members.filter(m => m.accountStatus === 'active').length ? ` · ${members.filter(m => m.accountStatus === 'active').length} with account` : ''}</p>
            ${!compact ? `<div class="stack-sm mt-3">${members.map(m => renderMemberRow(m, propertyId, unitName)).join('')}</div>` : `
            <div class="member-avatar-stack mt-2">
                ${members.slice(0, 4).map(m => `<img src="${m.img}" class="member-avatar-stack-item" alt="" title="${m.name}">`).join('')}
            </div>`}
        </div>` : ''}
    </div>`;
}

function renderTenancyMemberList(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (!listItem) return '';
    const { tenancy, members } = getFlatMemberRoster(listItem.propertyId, listItem.unit);
    if (!tenancy || tenancy.type !== 'group' || members.length <= 1) return '';
    const preview = members.slice(0, 3);
    return `
    <div class="card p-4 mt-3 tenancy-card tenancy-card--group">
        <div class="detail-title-row mb-3">
            <div>
                <div class="tenancy-card-head-tags">
                    ${tenancyTypePill('group')}
                </div>
                <p class="text-[14px] font-semibold text-[#0F172A] mt-1">${members.length} people on this unit</p>
            </div>
            <button data-go="flat-members" data-pid="${listItem.propertyId}" data-unit="${listItem.unit}" class="header-text-link">View all</button>
        </div>
        <div class="member-list-human member-list-preview">${preview.map(m => renderMemberRow(m, listItem.propertyId, listItem.unit)).join('')}</div>
    </div>`;
}

function renderTenancyContextCard(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (!listItem) return '';
    const { tenancy, members } = getFlatMemberRoster(listItem.propertyId, listItem.unit);
    if (!tenancy) return '';
    if (tenancy.type === 'group' && members.length > 1) return renderTenancyMemberList(tenantId);
    return '';
}

function renderTenancySummaryCard(tenancy, leaseStart, leaseEnd, lead) {
    const depStatus = resolveDepositStatus(tenancy.depositScheme, tenancy.protectionRef);
    const schemeLine = depositSchemeSummaryLine(tenancy.depositScheme, tenancy.protectionRef);
    const showAdvance = tenancy.advancePaid && tenancy.advancePaid !== tenancy.deposit;
  return `
    <section class="card tenancy-summary">
        <div class="tenancy-summary-head">
            ${tenancyTypePill(tenancy.type)}
            <span class="tenancy-summary-status">Active</span>
        </div>
        <p class="tenancy-summary-rent">${escapeHtml(tenancy.rent || '—')}<span>/month</span></p>
        <p class="tenancy-summary-dates">${leaseStart} – ${leaseEnd}</p>
        ${lead && tenancy.type === 'group' ? `<p class="tenancy-summary-lead">Lead · ${escapeHtml(lead.name)}</p>` : ''}
        <div class="tenancy-summary-finance">
            <div class="tenancy-summary-row">
                <span class="tenancy-summary-label">Deposit</span>
                <span class="tenancy-summary-value">${escapeHtml(tenancy.deposit || '—')}</span>
                ${renderDepositStatusBadge(depStatus, tenancy.depositScheme, 'tenancy-summary-badge')}
            </div>
            ${showAdvance ? `
            <div class="tenancy-summary-row">
                <span class="tenancy-summary-label">Advance</span>
                <span class="tenancy-summary-value">${escapeHtml(tenancy.advancePaid)}</span>
            </div>` : ''}
            ${schemeLine ? `
            <div class="tenancy-summary-row">
                <span class="tenancy-summary-label">Scheme</span>
                <span class="tenancy-summary-value tenancy-summary-value--muted">${escapeHtml(schemeLine)}</span>
            </div>` : ''}
        </div>
    </section>`;
}

function renderTenancyMembersSection(propertyId, unit, tenancy, members) {
    const isGroup = tenancy.type === 'group';
    const title = isGroup ? `Members · ${members.length}` : 'Tenant';
    const rowOpts = { tenantTab: true, isGroup: isGroup && members.length > 1 };
    return `
    <section class="card tenancy-members">
        <div class="tenancy-members-head">
            <h3 class="tenancy-members-title">${title}</h3>
            ${isGroup ? `<button type="button" data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="tenancy-members-link">+ Invite</button>` : ''}
        </div>
        <div class="tenancy-members-list">
            ${members.length
                ? members.map(m => renderMemberRow(m, propertyId, unit, rowOpts)).join('')
                : `<p class="tenancy-members-empty">No members yet</p>`}
        </div>
    </section>`;
}

function screenTenancyDetail() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const { tenancy, members } = getFlatMemberRoster(propertyId, unit);
    if (!tenancy) {
        return `${topBar('Tenancy', { back: true })}
        <div class="screen-content"><p class="ux-intro">No active tenancy for this unit.</p>
        <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full mt-3">Back to unit</button></div>`;
    }
    const leaseStart = typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start;
    const leaseEnd = typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end;
    const lead = members.find(m => m.isLead) || members[0];
    return `${topBar('Tenancy', { back: true, sub: `${p?.name || ''} · ${unit}` })}
    <div class="screen-content screen-enter tenancy-detail-page">
        ${renderTenancySummaryCard(tenancy, leaseStart, leaseEnd, lead)}
        <button type="button" data-go="edit-tenancy-deposit" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full py-2.5 text-[13px] mb-3">Edit deposit scheme</button>
        ${renderTenancyMembersSection(propertyId, unit, tenancy, members)}
        <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full">Back to unit</button>
    </div>`;
}

function screenEditTenancyDeposit() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const { tenancy } = getFlatMemberRoster(propertyId, unit);
    if (!tenancy) {
        return `${topBar('Deposit scheme', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">No active tenancy for this unit.</p></div>`;
    }
    const schemeLine = depositSchemeSummaryLine(tenancy.depositScheme, tenancy.protectionRef);
    const depStatus = resolveDepositStatus(tenancy.depositScheme, tenancy.protectionRef);
    return `${topBar('Deposit scheme', { back: true, sub: unit })}
    <div class="screen-content screen-content-sm screen-enter stack-sm">
        <div class="card deposit-edit-summary p-4">
            <div class="deposit-edit-summary-top">
                <div>
                    <p class="deposit-edit-label">Deposit held</p>
                    <p class="deposit-edit-amount">${escapeHtml(tenancy.deposit || '—')}</p>
                </div>
                ${renderDepositStatusBadge(depStatus, tenancy.depositScheme)}
            </div>
            ${schemeLine !== '—' ? `<p class="deposit-edit-meta">Current scheme · ${escapeHtml(schemeLine)}</p>` : ''}
        </div>
        <p class="form-helper">Choose the protection scheme. Add a reference once the deposit is registered — status updates to Protected automatically.</p>
        ${formSelectField('Deposit scheme', 'depositScheme', DEPOSIT_SCHEME_OPTIONS, tenancy.depositScheme || 'MyDeposits', { blankLabel: 'Select scheme' })}
        ${formField('Protection reference', tenancy.protectionRef || '', 'text', 'e.g. MD-20481', 'protectionRef')}
        <button type="button" data-action="save-tenancy-deposit" class="btn-primary w-full py-3.5 text-[14px]">Save deposit details</button>
    </div>`;
}

function saveTenancyDeposit() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const { tenancy } = getFlatMemberRoster(propertyId, unit);
    if (!tenancy) {
        toast('Tenancy not found');
        return true;
    }
    const depositScheme = fieldVal('depositScheme') || 'MyDeposits';
    const protectionRef = (fieldVal('protectionRef') || '').trim();
    tenancy.depositScheme = depositScheme;
    tenancy.protectionRef = protectionRef;
    tenancy.depositStatus = resolveDepositStatus(depositScheme, protectionRef);
    withLoading(() => {
        AppStore.save();
        toast('Deposit scheme updated');
        goAfterDepositSave();
    });
    return true;
}

function screenFlatMembers() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unit);
    const isGroup = tenancy?.type === 'group';
    const membersLabel = isGroup ? 'Members' : 'Tenant';
    const leaseLine = tenancy
        ? `${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start} – ${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end}`
        : '—';
    const pendingInvite = pendingInvitesForProperty(propertyId).find(i => i.unit === unit);
    return `${topBar(membersLabel, { back: true, sub: `${p?.name || ''} · ${unit}` })}
    <div class="screen-content screen-enter flat-members-page">
        <div class="screen-list-header">
            <div>
                <h2>${membersLabel}</h2>
                <p>${count} on this unit · ${leaseLine}</p>
            </div>
            <button type="button" data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="header-text-link">+ Invite tenant</button>
        </div>
        ${members.length ? `
        <div class="member-list-human member-list-detail">
            ${members.map(m => renderMemberRow(m, propertyId, unit, { detail: true, showAvatar: true })).join('')}
        </div>` : `
        <div class="card p-6 text-center">
            <p class="text-[13px] text-[#64748B]">No one on the lease yet</p>
        </div>`}
        ${pendingInvite ? `
        <button data-go="tenant-invite-sent" data-invite-token="${pendingInvite.token}" class="flat-invite-banner flat-invite-banner--inline w-full text-left mt-3">
            <div class="flat-invite-banner-icon"><i data-lucide="mail" class="w-4 h-4"></i></div>
            <div class="flex-1 min-w-0">
                <p class="flat-invite-banner-title">Invite pending</p>
                <p class="flat-invite-banner-meta">${pendingInvite.firstName} ${pendingInvite.lastName}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>` : ''}
    </div>`;
}

function tenantRecordById(tenantId) {
    return TENANTS.find(t => t.id === tenantId);
}

function pendingInviteForProperty(propertyId) {
    return TENANT_INVITATIONS.find(i => i.propertyId === propertyId && i.status === 'pending');
}

function formatLeaseRange(start, end) {
    const s = typeof formatDisplayDate === 'function' ? formatDisplayDate(start) : start;
    const e = typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(end) : end;
    return s && e && s !== '—' && e !== '—' ? `${s} – ${e}` : '—';
}

function ensureTenantConversation(fullName, propertyName, img) {
    let conv = CONVERSATIONS.find(c => c.name === fullName);
    if (conv) return conv.id;
    const id = AppStore.nextId(CONVERSATIONS);
    CONVERSATIONS.unshift({
        id, img: img || IMG.avatar.sarah, name: fullName, sub: propertyName,
        preview: 'Start a conversation', time: 'Just now', unread: 0, online: false, messages: [],
    });
    syncConversationsToStore();
    return id;
}

function getContractorChatId(name) {
    if (CONTRACTOR_CHAT_MAP[name] != null) return CONTRACTOR_CHAT_MAP[name];
    const idx = CONVERSATIONS.findIndex(c => c.name === name);
    return idx >= 0 ? idx : null;
}

function ensureContractorConversation(contractor) {
    const existing = getContractorChatId(contractor.name);
    if (existing != null) return existing;
    const id = CONVERSATIONS.length ? Math.max(...CONVERSATIONS.map(c => c.id)) + 1 : 0;
    CONVERSATIONS.push({
        id, img: contractor.img, name: contractor.name, sub: typeof contractorCategoryLabel === 'function' ? contractorCategoryLabel(contractor) : contractor.trade,
        preview: 'Start a conversation', time: 'Just now', unread: 0, online: false, messages: [],
    });
    CONTRACTOR_CHAT_MAP[contractor.name] = id;
    syncConversationsToStore();
    return id;
}

function ensureMaintGroupChat(item, contractor, tenant) {
    if (!item) return null;
    const key = `maint-${item.id}`;
    if (AppStore.maintGroupChats?.[key] != null) {
        item.groupChatId = AppStore.maintGroupChats[key];
        return item.groupChatId;
    }
    return null;
}

function contractorBusinessName() {
    return (typeof CONTRACTOR_USER !== 'undefined' && CONTRACTOR_USER?.company) || 'Plumber Pro';
}

function contractorRatingRoleKey() {
    if (STATE.userRole === 'tenant') return 'tenant';
    if (STATE.userRole === 'landlord') return 'landlord';
    return null;
}

function getMaintContractorRatings(item) {
    const ratings = { ...(item?.contractorRatings || {}) };
    if (item?.contractorRating && !ratings.landlord) ratings.landlord = item.contractorRating;
    return ratings;
}

function maintReviewEligible(item, job) {
    if (!item?.contractor || item.contractor === '—') return false;
    if (item.status === 'done') return true;
    const status = job?.status;
    return ['waiting_approval', 'approved', 'paid', 'completed'].includes(status);
}

function contractorReviewerName(role, item) {
    if (role === 'tenant') {
        return item?.tenantName
            || (typeof getActiveTenant === 'function' ? getActiveTenant()?.name : null)
            || 'Tenant';
    }
    if (typeof LANDLORD_USER !== 'undefined') {
        return `${LANDLORD_USER.firstName || 'Landlord'} ${LANDLORD_USER.lastName || ''}`.trim();
    }
    return 'Landlord';
}

function renderContractorRatingStars(stars, size = 'md') {
    const cls = size === 'sm' ? 'ctr-review-stars ctr-review-stars--sm' : 'ctr-review-stars';
    return `<span class="${cls}" aria-label="${stars} out of 5 stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>`;
}

function collectContractorReviews() {
    const name = contractorBusinessName();
    const merged = [];
    const seen = new Set();
    const push = (r) => {
        const key = `${r.job}|${r.at}|${r.from}|${r.stars}|${r.comment || ''}`;
        if (seen.has(key)) return;
        seen.add(key);
        merged.push(r);
    };
    const ctr = CONTRACTORS.find(c => c.name === name);
    (ctr?.ratings || []).forEach(r => push({
        stars: r.stars,
        comment: r.comment || '',
        at: r.at || '',
        job: r.job || 'Job',
        from: r.from || (r.role === 'tenant' ? 'Tenant' : r.role === 'landlord' ? 'Landlord' : 'Client'),
        role: r.role || '',
    }));
    MAINTENANCE_ITEMS.forEach(item => {
        if (item.contractor !== name) return;
        const ratings = getMaintContractorRatings(item);
        ['landlord', 'tenant'].forEach(role => {
            const r = ratings[role];
            if (!r) return;
            push({
                stars: r.stars,
                comment: r.comment || '',
                at: r.at || '',
                job: item.issue,
                from: r.by || contractorReviewerName(role, item),
                role,
            });
        });
    });
    if (typeof CONTRACTOR_JOBS !== 'undefined') {
        CONTRACTOR_JOBS.forEach(job => {
            const jobName = job.contractorName || name;
            if (jobName !== name) return;
            const ratings = job.ratings || {};
            ['landlord', 'tenant'].forEach(role => {
                const r = ratings[role];
                if (!r) return;
                push({
                    stars: r.stars,
                    comment: r.comment || '',
                    at: r.at || '',
                    job: job.issue,
                    from: r.by || (role === 'tenant' ? (job.tenant || 'Tenant') : (job.landlord || 'Landlord')),
                    role,
                });
            });
        });
    }
    return merged;
}

function contractorReviewSummary() {
    const reviews = collectContractorReviews();
    if (!reviews.length) return { avg: '—', count: 0 };
    const avg = (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1);
    return { avg, count: reviews.length };
}

function submitContractorRating(maintId) {
    const item = MAINTENANCE_ITEMS.find(m => m.id === maintId);
    const job = getContractorJobForMaint(maintId);
    const role = contractorRatingRoleKey();
    if (!item || !role || !maintReviewEligible(item, job)) return;
    const group = document.querySelector(`[data-rating-group="${maintId}"]`) || document;
    const active = group.querySelector('[data-action="pick-rating-star"].active');
    const stars = active ? +active.dataset.ratingStar : 0;
    const comment = group.querySelector('[data-field="ratingComment"]')?.value?.trim() || '';
    if (!stars) { toast('Select a star rating'); return; }
    const at = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const by = contractorReviewerName(role, item);
    if (!item.contractorRatings) item.contractorRatings = {};
    item.contractorRatings[role] = { stars, comment, at, by };
    if (item.contractorRating && role === 'landlord') delete item.contractorRating;
    if (job) {
        if (!job.ratings) job.ratings = {};
        job.ratings[role] = item.contractorRatings[role];
        if (typeof saveContractorJobs === 'function') saveContractorJobs();
    }
    const c = CONTRACTORS.find(x => x.name === item.contractor);
    if (c) {
        if (!c.ratings) c.ratings = [];
        c.ratings.push({ stars, comment, job: item.issue, at, from: by, role });
        const all = c.ratings.map(r => r.stars);
        c.avgRating = (all.reduce((a, b) => a + b, 0) / all.length).toFixed(1);
    }
    if (typeof addMaintHistoryEvent === 'function') addMaintHistoryEvent(item, 'Contractor rated', `${stars}★ · ${role}`);
    AppStore.save();
    toast('Thanks for your feedback');
    render();
}

function renderContractorRatingCard(item, contractorJob) {
    const role = contractorRatingRoleKey();
    if (!item || !role || !maintReviewEligible(item, contractorJob)) return '';
    const ratings = getMaintContractorRatings(item);
    const existing = ratings[role];
    const roleLabel = role === 'tenant' ? 'tenant' : 'landlord';
    if (existing) {
        return `
        <div class="card ctr-review-card">
            <p class="ctr-review-label">Your review</p>
            ${renderContractorRatingStars(existing.stars)}
            ${existing.comment ? `<p class="ctr-review-comment">${escapeHtml(existing.comment)}</p>` : ''}
            <p class="ctr-review-meta">Submitted ${existing.at || 'recently'}</p>
        </div>`;
    }
    return `
    <div class="card ctr-review-card" data-rating-group="${item.id}">
        <p class="ctr-review-label">Rate contractor</p>
        <p class="ctr-review-hint">How was ${escapeHtml(item.contractor)} on this job?</p>
        <div class="ctr-review-picker">
            ${[1, 2, 3, 4, 5].map(n => `
            <button type="button" data-action="pick-rating-star" data-rating-group="${item.id}" data-rating-star="${n}" class="ctr-review-star" aria-label="${n} stars">★</button>`).join('')}
        </div>
        <textarea data-field="ratingComment" class="form-input ctr-review-input" rows="2" placeholder="Share what went well (optional)…"></textarea>
        <button type="button" data-action="submit-contractor-rating" data-mid="${item.id}" class="btn-primary w-full py-3 text-[13px] mt-3">Submit review</button>
        <p class="ctr-review-foot">Your ${roleLabel} review helps other ${role === 'tenant' ? 'tenants' : 'landlords'} choose trusted tradespeople.</p>
    </div>`;
}

function renderContractorJobReviewsReadonly(item, contractorJob) {
    if (STATE.userRole !== 'contractor') return '';
    const ratings = { ...getMaintContractorRatings(item || {}) };
    if (contractorJob?.ratings) {
        ['landlord', 'tenant'].forEach(role => {
            if (contractorJob.ratings[role]) ratings[role] = contractorJob.ratings[role];
        });
    }
    const entries = ['landlord', 'tenant'].map(role => {
        const r = ratings[role];
        if (!r) return '';
        const label = role === 'tenant' ? 'Tenant review' : 'Landlord review';
        return `
        <div class="ctr-review-read-item">
            <div class="ctr-review-read-head">
                <span class="ctr-review-read-role">${label}</span>
                ${renderContractorRatingStars(r.stars, 'sm')}
            </div>
            <p class="ctr-review-read-from">${escapeHtml(r.by || (role === 'tenant' ? 'Tenant' : 'Landlord'))}</p>
            ${r.comment ? `<p class="ctr-review-comment">${escapeHtml(r.comment)}</p>` : ''}
            <p class="ctr-review-meta">${r.at || ''}</p>
        </div>`;
    }).filter(Boolean).join('');
    if (!entries) return '';
    return `
    <div class="card ctr-compact-block">
        <p class="ctr-compact-label">Job reviews</p>
        <div class="ctr-review-read-list">${entries}</div>
        <button type="button" data-go="contractor-reviews" class="ctr-compact-link" style="margin-top:8px">View all reviews</button>
    </div>`;
}

function renderMaintMilestoneCard(item, job) {
    if (!job?.milestoneRequest) return '';
    const m = job.milestoneRequest;
    const pending = m.status === 'pending';
    return `
    <div class="card p-4" style="background:#F5F3FF;border-color:#E9D5FF">
        <p class="ctr-section-label">Milestone payment</p>
        <p class="text-[14px] font-bold">${m.amount}</p>
        <p class="text-[13px] text-[#64748B]">${m.label || 'Materials / deposit'}</p>
        ${pending && STATE.userRole === 'landlord' ? `
        <div class="grid grid-cols-2 gap-2 mt-3">
            <button type="button" data-action="approve-milestone" data-mid="${item.id}" class="btn-secondary py-2.5 text-[13px]">Approve</button>
            <button type="button" data-action="pay-milestone-stripe" data-mid="${item.id}" class="btn-primary py-2.5 text-[13px]">Pay via Stripe</button>
        </div>` : `<span class="badge mt-2" style="background:#DCFCE7;color:#16A34A">${m.status === 'paid' ? 'Paid' : m.status}</span>`}
    </div>`;
}

function approveMaintMilestone(maintId) {
    const job = getContractorJobForMaint(maintId);
    if (!job?.milestoneRequest || job.milestoneRequest.status !== 'pending') return;
    job.milestoneRequest.status = 'approved';
    if (typeof saveContractorJobs === 'function') saveContractorJobs();
    AppStore.save();
    toast('Milestone approved — pay via Stripe');
    render();
}

function payMaintMilestoneStripe(maintId) {
    const job = getContractorJobForMaint(maintId);
    const item = MAINTENANCE_ITEMS.find(m => m.id === maintId);
    if (!job?.milestoneRequest) return;
    if (job.milestoneRequest.status === 'pending') {
        toast('Approve milestone first');
        return;
    }
    openStripeCheckout({
        amount: job.milestoneRequest.amount,
        label: job.milestoneRequest.label || 'Milestone',
        onSuccess: () => {
            job.milestoneRequest.status = 'paid';
            if (typeof saveContractorJobs === 'function') saveContractorJobs();
            if (item && typeof addMaintHistoryEvent === 'function') {
                addMaintHistoryEvent(item, 'Milestone paid', job.milestoneRequest.amount);
            }
            AppStore.save();
            toast(`Paid ${job.milestoneRequest.amount}`);
            render();
        },
    });
}

function requestContractorMilestone() {
    const job = typeof contractorJob === 'function' ? contractorJob(STATE.contractorJobId) : null;
    if (!job || job.status !== 'in_progress') return;
    const amount = fieldVal('milestone_amount')?.trim();
    const label = fieldVal('milestone_label')?.trim() || 'Materials deposit';
    const amountNum = parseInvoiceAmount(amount);
    if (!amountNum) { toast('Enter milestone amount'); return; }
    job.milestoneRequest = { amount: formatInvoiceAmount(amountNum), label, status: 'pending' };
    if (typeof saveContractorJobs === 'function') saveContractorJobs();
    const item = MAINTENANCE_ITEMS.find(m => m.id === job.maintId);
    if (item) {
        pushNotification({
            icon: 'banknote', color: ['#F3E8FF', '#7C3AED'],
            title: 'Milestone requested', desc: `${job.milestoneRequest.amount} · ${job.issue}`,
            time: 'Just now', unread: true, screen: 'maintenance-detail', opts: { mid: item.id },
        });
    }
    AppStore.save();
    toast('Milestone request sent to landlord');
    render();
}

function sendContractorInvite() {
    const name = fieldVal('invite_contractor_name')?.trim();
    const email = fieldVal('invite_contractor_email')?.trim();
    const trade = fieldVal('invite_contractor_trade')?.trim() || 'General maintenance';
    if (!name) { toast('Enter company or contractor name'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Enter a valid email address'); return; }
    if (!AppStore.contractorInvites) AppStore.contractorInvites = [];
    const invite = {
        id: AppStore.nextId(AppStore.contractorInvites),
        name, email, trade, status: 'pending', sentAt: 'Just now',
        landlord: `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`,
        link: `https://landlordhq.app/contractor-invite?email=${encodeURIComponent(email)}`,
    };
    AppStore.contractorInvites.unshift(invite);
    STATE.lastContractorInviteId = invite.id;
    AppStore.save();
    go('contractor-invite-sent');
}

function screenContractorInviteSent() {
    const invite = (AppStore.contractorInvites || []).find(i => i.id === STATE.lastContractorInviteId);
    if (!invite) {
        return `${topBar('Invite sent', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Invitation not found.</p></div>`;
    }
    return `${topBar('Invite sent', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <p class="text-[14px] font-bold text-[#0F172A] mt-4">Invitation sent!</p>
            <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">We emailed <strong>${invite.email}</strong> a link to join as a contractor for your properties.</p>
        </div>
        <div class="card p-4 space-y-2">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Invitation details</p>
            ${[['Company', invite.name], ['Trade', invite.trade], ['Email', invite.email], ['Status', 'Pending signup']].map(([k, v]) => `
            <div class="flex justify-between text-[13px] py-1"><span class="text-[#64748B]">${k}</span><span class="font-semibold text-right">${v}</span></div>`).join('')}
        </div>
        <div class="card p-4">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Invite link</p>
            <p class="text-[12px] text-[#2563EB] mt-2 break-all">${invite.link}</p>
            <button type="button" data-action="copy-contractor-invite-link" class="btn-secondary w-full py-3 text-[13px] mt-3">Copy link</button>
        </div>
        <button type="button" data-go="contractors" class="btn-primary w-full py-3.5 text-[14px]">Back to contractors</button>
    </div>`;
}

function copyContractorInviteLink() {
    const invite = (AppStore.contractorInvites || []).find(i => i.id === STATE.lastContractorInviteId);
    if (!invite?.link) return;
    navigator.clipboard?.writeText(invite.link).then(() => toast('Link copied')).catch(() => toast(invite.link));
}

function backfillMaintGroupChats() {
    /* Job group chats removed — maintenance uses direct 1:1 chats only. */
}

function screenInviteContractor() {
    const tradeLabels = typeof CONTRACTOR_TRADE_CATALOG !== 'undefined'
        ? CONTRACTOR_TRADE_CATALOG.map(t => t.label)
        : ['Plumbing & Heating', 'Electrical', 'General maintenance'];
    return `${topBar('Invite Contractor', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-4">Send an email invite so they can join Landlord HQ and receive maintenance jobs.</p>
        ${formFieldReq('Company / name', 'invite_contractor_name', '', 'text', 'e.g. Plumber Pro Ltd')}
        ${formFieldReq('Email', 'invite_contractor_email', '', 'email', 'contractor@email.com')}
        <div class="form-group">
            <label class="form-label">Trade</label>
            <select data-field="invite_contractor_trade" class="form-input form-select">
                ${tradeLabels.map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
        </div>
        <button type="button" data-action="send-contractor-invite" class="btn-primary w-full py-3.5 text-[14px]">Send invite</button>
    </div>`;
}

function contractorOpenJobs(name) {
    return MAINTENANCE_ITEMS.filter(m => m.contractor === name && m.status !== 'done').length;
}

function contractorTrustLine(c) {
    const parts = [];
    if (c?.gasSafe) parts.push('Gas Safe');
    if (c?.liabilityInsurance) parts.push('Insured');
    const certCount = typeof ensureContractorCertificates === 'function' ? ensureContractorCertificates(c).length : (c?.certificates?.length || 0);
    if (certCount && !c?.gasSafe) parts.push('Certified');
    return parts.length ? parts.join(' · ') : 'On Landlord HQ';
}

function filterContractorsList(list, q, tradeFilter) {
    let filtered = list;
    if (tradeFilter && tradeFilter !== 'all') {
        filtered = filtered.filter(c => {
            const id = c.tradeId || (typeof resolveContractorTrade === 'function' ? resolveContractorTrade(c).id : '');
            return id === tradeFilter;
        });
    }
    if (q) {
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(q)
            || c.trade.toLowerCase().includes(q)
            || (c.category || '').toLowerCase().includes(q)
            || (c.jobsFor || '').toLowerCase().includes(q)
        );
    }
    return filtered;
}

function renderContractorTradeChips(active, list = CONTRACTORS) {
    const trades = typeof CONTRACTOR_TRADE_CATALOG !== 'undefined' ? CONTRACTOR_TRADE_CATALOG : [];
    const usedIds = [...new Set(list.map(c => c.tradeId || (typeof resolveContractorTrade === 'function' ? resolveContractorTrade(c).id : 'general')))];
    const chips = [['all', 'layout-grid', 'All', list.length]];
    trades.filter(t => usedIds.includes(t.id)).forEach(t => {
        const count = list.filter(c => (c.tradeId || resolveContractorTrade(c).id) === t.id).length;
        chips.push([t.id, t.icon, t.shortLabel, count, t.bg, t.color]);
    });
    return `
    <div class="ctr-trade-chips">
        ${chips.map(([id, icon, label, count, bg, color]) => `
        <button type="button" data-contractor-trade-filter="${id}" class="ctr-trade-chip ${active === id ? 'active' : ''}"${bg ? ` style="--chip-bg:${bg};--chip-color:${color}"` : ''}>
            <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
            <span>${label}</span>
            ${id !== 'all' && count ? `<span class="ctr-trade-chip-count">${count}</span>` : ''}
        </button>`).join('')}
    </div>`;
}

function resetContractorFilters() {
    STATE.contractorTradeFilter = 'all';
    STATE.search.contractors = '';
    render();
}

function renderContractorsPageHeader() {
    return `
    <div class="screen-header ctr-page-header">
        <div class="sub-header-row">
            <div class="sub-header-left">
                <button type="button" data-action="back" class="back-btn" aria-label="Back"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <div class="min-w-0">
                    <h1 class="sub-header-title">Contractors</h1>
                </div>
            </div>
        </div>
        <div class="ctr-header-actions">
            <button type="button" data-go="invite-contractor" class="ctr-header-invite">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Invite contractor
            </button>
        </div>
    </div>`;
}

function contractorRow(c) {
    normalizeContractorRecord(c);
    const chatId = ensureContractorConversation(c);
    const convo = CONVERSATIONS.find(x => x.id === chatId);
    const unread = convo?.unread || 0;
    const rating = typeof contractorDisplayRating === 'function' ? contractorDisplayRating(c) : '4.8';
    const response = typeof contractorResponseLabel === 'function' ? contractorResponseLabel(c) : 'Responds in 1 hr';
    const verified = (c.certificates?.length || c.gasSafe || c.liabilityInsurance);
    return `
    <article class="ctr-v2-card card">
        <button type="button" data-action="view-contractor-profile" data-cid="${c.id}" class="ctr-v2-main w-full text-left">
            <div class="ctr-v2-avatar-wrap">
                <img src="${c.img}" class="ctr-v2-avatar" alt="">
                <span class="ctr-v2-platform" title="On Landlord HQ"></span>
            </div>
            <div class="ctr-v2-body min-w-0">
                <div class="ctr-v2-name-row">
                    <span class="ctr-v2-name">${escapeHtml(c.name)}</span>
                    ${verified ? '<i data-lucide="badge-check" class="ctr-v2-verified w-4 h-4"></i>' : ''}
                </div>
                <div class="ctr-v2-trade-row">
                    ${typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(c) : `<span class="ctr-trade-badge">${escapeHtml(c.category || c.trade)}</span>`}
                </div>
                <p class="ctr-v2-rating">
                    <i data-lucide="star" class="w-3.5 h-3.5"></i>
                    <span>${rating}</span>
                    <span class="ctr-v2-dot">·</span>
                    <span>${response}</span>
                </p>
                <p class="ctr-v2-trust">${escapeHtml(contractorTrustLine(c))}</p>
            </div>
            <i data-lucide="chevron-right" class="ctr-v2-chevron w-4 h-4"></i>
        </button>
        <button type="button" data-go="chat" data-chat="${chatId}" class="ctr-v2-msg" aria-label="Message ${escapeHtml(c.name)}">
            <i data-lucide="message-square" class="w-4 h-4"></i>
            ${unread ? `<span class="ctr-v2-msg-badge">${unread}</span>` : ''}
        </button>
    </article>`;
}

function screenContractors() {
    const q = (STATE.search.contractors || '').toLowerCase();
    const tradeF = STATE.contractorTradeFilter || 'all';
    const list = filterContractorsList(CONTRACTORS, q, tradeF);
    const pendingInvites = (AppStore.contractorInvites || []).filter(i => i.status === 'pending');
    const hasFilters = tradeF !== 'all' || q;
    return `${renderContractorsPageHeader()}
    <div class="screen-content screen-content-sm screen-enter ctr-page">
        ${pendingInvites.length ? `
        <button type="button" data-go="invite-contractor" class="ctr-pending-strip w-full text-left">
            <i data-lucide="clock" class="w-4 h-4 shrink-0"></i>
            <span>${pendingInvites.length} invite${pendingInvites.length === 1 ? '' : 's'} pending</span>
            <i data-lucide="chevron-right" class="w-4 h-4 shrink-0 ml-auto"></i>
        </button>` : ''}
        <div class="ctr-search-row">
            <div class="search-bar ctr-search flex-1">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="contractors" type="text" value="${STATE.search.contractors || ''}" placeholder="Search contractors…" class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-action="reset-contractor-filters" class="ctr-filter-btn${hasFilters ? ' ctr-filter-btn--active' : ''}" aria-label="Reset filters">
                <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                <span>Filter</span>
                ${hasFilters ? '<span class="ctr-filter-dot"></span>' : ''}
            </button>
        </div>
        ${renderContractorTradeChips(tradeF)}
        <div class="ctr-list-head">
            <p class="ctr-list-count">${list.length} contractor${list.length === 1 ? '' : 's'} found</p>
            <span class="ctr-list-sort"><i data-lucide="arrow-down-wide-narrow" class="w-3.5 h-3.5"></i> Recently added</span>
        </div>
        ${list.length ? `<div class="ctr-list ctr-list--v2">${list.map(contractorRow).join('')}</div>` : `
        <div class="ctr-empty card">
            <i data-lucide="hard-hat" class="w-10 h-10 text-[#CBD5E1]"></i>
            <p class="ctr-empty-title">No contractors found</p>
            <p class="ctr-empty-sub">${q || tradeF !== 'all' ? 'Try a different search or trade filter' : 'Invite your first contractor to get started'}</p>
        </div>`}
        <button type="button" data-go="invite-contractor" class="ctr-invite-banner card w-full text-left">
            <span class="ctr-invite-banner-icon"><i data-lucide="shield-check" class="w-5 h-5"></i></span>
            <span class="ctr-invite-banner-copy min-w-0">
                <span class="ctr-invite-banner-title">Invite your trusted contractor</span>
                <span class="ctr-invite-banner-sub">They join Landlord HQ to receive jobs, chat, and send invoices.</span>
            </span>
            <span class="ctr-invite-banner-link">Invite now <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></span>
        </button>
    </div>`;
}

function pendingTenantInviteCount() {
    return TENANT_INVITATIONS.filter(i => i.status === 'pending').length;
}

function tenantPaymentSummary(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const t = TENANTS[tenantId];
    if (!listItem || !t) return { balance: '£0.00', lastPayment: '—', nextDue: '—', deposit: '—', advancePaid: '—' };
    const invs = INVOICES.filter(i =>
        i.tenantId === tenantId ||
        i.tenant === listItem.name ||
        (i.prop.includes(listItem.prop) && (!i.unit || i.unit === listItem.unit))
    );
    const rentInvs = invs.filter(i => !i.type || i.type === 'rent');
    const chargeInvs = invs.filter(i => isLandlordExtraCharge(i));
    const maintInvs = invs.filter(i => isMaintenanceBill(i));
    const pending = rentInvs.filter(i => i.status !== 'Paid');
    const balance = pending.reduce((s, i) => s + parseRentAmount(i.amount), 0);
    const chargeDue = chargeInvs.filter(i => i.status !== 'Paid').reduce((s, i) => s + parseRentAmount(i.amount), 0);
    const maintDue = maintInvs.filter(i => i.status !== 'Paid').reduce((s, i) => s + parseRentAmount(i.amount), 0);
    const lastPaid = invs.filter(i => i.status === 'Paid').sort((a, b) => (b.paidOn || b.due).localeCompare(a.paidOn || a.due))[0];
    const nextDue = rentInvs.find(i => i.status === 'Pending' || i.status === 'Overdue');
    const nextCharge = chargeInvs.find(i => i.status === 'Pending' || i.status === 'Overdue');
    const nextMaint = maintInvs.find(i => i.status === 'Pending' || i.status === 'Overdue');
    const overdue = rentInvs.filter(i => i.status === 'Overdue');
    const fin = getTenantFinancials(tenantId);
    const chargeLine = nextCharge
        ? `${nextCharge.amount} · ${chargeInvoiceLabel(nextCharge)} · due ${nextCharge.due}`
        : null;
    const maintLine = nextMaint
        ? `${nextMaint.amount} · ${chargeInvoiceLabel(nextMaint)} · due ${nextMaint.due}`
        : null;
    return {
        balance: balance ? formatRentAmount(balance) : '£0.00',
        chargeBalance: chargeDue ? formatRentAmount(chargeDue) : '£0.00',
        maintBalance: maintDue ? formatRentAmount(maintDue) : '£0.00',
        billBalance: (chargeDue + maintDue) ? formatRentAmount(chargeDue + maintDue) : '£0.00',
        lastPayment: lastPaid ? `${lastPaid.amount} · ${lastPaid.paidOn || lastPaid.due}` : '—',
        nextDue: nextDue ? `${nextDue.amount} · ${nextDue.due}` : '—',
        nextChargeDue: chargeLine,
        nextMaintDue: maintLine,
        overdueCount: overdue.length,
        deposit: fin.deposit,
        advancePaid: fin.advancePaid,
        rentInvoiceId: nextDue?.id,
        chargeInvoiceId: nextCharge?.id,
        maintInvoiceId: nextMaint?.id,
    };
}

const TENANT_HOUSE_RULES = {
    0: [
        'Quiet hours after 10 PM — keep noise down for neighbours.',
        'Report maintenance issues through the app so your landlord can respond quickly.',
        'No smoking inside the building or communal areas.',
        'Guests may not stay more than 14 consecutive nights without written approval.',
        'Recycling bins are in the rear garden shed — please sort waste correctly.',
        'Bicycle storage is in the basement — do not leave bikes in the hallway.',
    ],
    1: [
        'Monthly rent is due on the 1st of each month.',
        'Contact the landlord before making any alterations to the flat.',
        'Pets require prior written consent.',
    ],
};

function houseRulesForTenant(tenant) {
    if (!tenant || tenant.propertyId == null) return [];
    return TENANT_HOUSE_RULES[tenant.propertyId] || [
        'Follow your tenancy agreement and report issues via the app.',
        'Keep communal areas clear and respect neighbours.',
    ];
}

function activeTenantListId() {
    const t = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
    if (!t) return null;
    if (t.id != null && TENANT_LIST[t.id]) return t.id;
    const byEmail = TENANT_LIST.findIndex(li => li.email && t.email && li.email.toLowerCase() === t.email.toLowerCase());
    return byEmail >= 0 ? byEmail : 0;
}

const TENANT_NOTIFICATIONS = [
    { icon: 'wrench', color: ['#DBEAFE', '#2563EB'], title: 'Issue update', desc: 'Kitchen sink — contractor assigned', time: '2h ago', unread: true, screen: 'maintenance-detail', opts: { mid: 0 } },
    { icon: 'banknote', color: ['#FEF3C7', '#D97706'], title: 'Rent due', desc: 'Jul 2026 rent · £2,450 due Jul 1', time: '5h ago', unread: true, screen: 'transaction-history', opts: { tenantPayFilter: 'rent' } },
    { icon: 'receipt', color: ['#FEF3C7', '#B45309'], title: 'Extra charge', desc: 'Utility charge · £150 due soon', time: '1d ago', unread: false, screen: 'transaction-history', opts: { tenantPayFilter: 'charges' } },
    { icon: 'wrench', color: ['#DBEAFE', '#2563EB'], title: 'Maintenance bill', desc: 'Kitchen sink repair share · £85', time: '2d ago', unread: false, screen: 'transaction-history', opts: { tenantPayFilter: 'maintenance' } },
    { icon: 'megaphone', color: ['#ECFDF5', '#059669'], title: 'Building announcement', desc: 'Boiler service next week', time: '2d ago', unread: false, screen: 'tenant-announcements', opts: {} },
];

const TENANT_SCREEN_ALIASES = {
    dashboard: 'tenant-dashboard',
    maintenance: 'tenant-issues',
    financial: 'transaction-history',
    properties: 'tenant-active-tenancy',
    tenants: 'personal-info',
    profile: 'personal-info',
    'compliance-dashboard': 'tenant-compliance',
    reminders: 'tenant-reminders',
    contractors: 'tenant-dashboard',
    'tenant-detail': 'personal-info',
    'mark-rent-received': 'transaction-history',
    'create-invoice': 'transaction-history',
    'pay-contractor': 'transaction-history',
};

const LANDLORD_SCREEN_ALIASES = {
    'tenant-dashboard': 'dashboard',
    'tenant-issues': 'maintenance',
    'tenant-documents': 'tenants',
    'tenant-active-tenancy': 'tenants',
    'tenant-building-info': 'properties',
    'tenant-compliance': 'compliance-dashboard',
    'tenant-reminders': 'reminders',
    'tenant-announcements': 'dashboard',
    'tenant-house-rules': 'properties',
    'tenant-referencing': 'tenants',
    'tenant-ref-detail': 'tenants',
    'tenant-contact': 'tenants',
    'tenant-communication': 'messages',
    'tenant-checkout': 'tenants',
    'tenant-edit-profile': 'profile',
};

const CONTRACTOR_SCREEN_ALIASES = {
    dashboard: 'contractor-dashboard',
    maintenance: 'contractor-jobs',
    profile: 'contractor-profile',
    properties: 'contractor-dashboard',
    financial: 'contractor-dashboard',
    tenants: 'contractor-dashboard',
};

const TENANT_ALLOWED_SCREENS = new Set([
    'tenant-dashboard', 'tenant-issues', 'tenant-documents', 'tenant-referencing', 'tenant-ref-detail',
    'tenant-active-tenancy', 'tenant-contact', 'tenant-reminders', 'tenant-compliance',
    'tenant-communication', 'tenant-checkout', 'tenant-building-info', 'tenant-announcements',
    'tenant-house-rules', 'tenant-edit-profile', 'tenant-welcome',
    'log-maintenance', 'maintenance-detail', 'transaction-history', 'invoice-detail',
    'messages', 'chat', 'personal-info', 'notifications-list', 'notifications-settings',
    'help-support', 'faq', 'faq-detail', 'privacy', 'terms', 'about',
    'password', 'security', 'document-preview',
]);

function notificationsForRole() {
    if (STATE.userRole === 'tenant') {
        const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
        return tenantNotificationsList(tid);
    }
    return NOTIFICATIONS;
}

function resolveScreenForRole(screen, opts = {}) {
    if (!STATE.isAuthenticated) return { screen, opts };
    const role = STATE.userRole;
    const next = { screen, opts: { ...opts } };

    if (role === 'tenant') {
        if (screen === 'property-detail') {
            const tab = opts.tab;
            if (tab === 'compliance') next.screen = 'tenant-compliance';
            else if (tab === 'documents') next.screen = 'tenant-documents';
            else next.screen = 'tenant-building-info';
            return next;
        }
        if (TENANT_ALLOWED_SCREENS.has(screen)) return next;
        if (TENANT_SCREEN_ALIASES[screen]) {
            next.screen = TENANT_SCREEN_ALIASES[screen];
            return next;
        }
        next.screen = getRoleHome();
        return next;
    }

    if (role === 'landlord') {
        if (LANDLORD_SCREEN_ALIASES[screen]) {
            next.screen = LANDLORD_SCREEN_ALIASES[screen];
            return next;
        }
    }

    if (role === 'contractor') {
        if (CONTRACTOR_SCREEN_ALIASES[screen]) {
            next.screen = CONTRACTOR_SCREEN_ALIASES[screen];
            return next;
        }
        if (screen.startsWith('tenant-')) {
            next.screen = 'contractor-dashboard';
            return next;
        }
    }

    return next;
}

function tenantAvatarUrl(tenantId) {
    const tid = tenantId != null ? tenantId : (typeof activeTenantListId === 'function' ? activeTenantListId() : 0);
    const listItem = TENANT_LIST.find(t => t.id === tid) || TENANT_LIST[tid];
    if (listItem?.img) return listItem.img;
    return IMG.avatar.sarah;
}

function tenantHomeAttentionItems(tenant, pay, tenantId) {
    if (!tenant) return [];
    const items = [];
    if (pay?.balance && pay.balance !== '£0.00') {
        items.push({
            priority: 1, icon: 'banknote', bg: '#FFFBEB', color: '#D97706',
            title: 'Rent payment due', sub: pay.nextDue || 'Due soon',
            go: 'transaction-history', cta: 'Pay', opts: { tenantPayFilter: 'rent' },
        });
    }
    if (pay?.chargeBalance && pay.chargeBalance !== '£0.00') {
        items.push({
            priority: 2, icon: 'receipt', bg: '#FEF3C7', color: '#B45309',
            title: 'Extra charge due', sub: pay.nextChargeDue || pay.chargeBalance,
            go: 'transaction-history', cta: 'Pay', opts: { tenantPayFilter: 'charges' },
        });
    }
    if (pay?.maintBalance && pay.maintBalance !== '£0.00') {
        items.push({
            priority: 3, icon: 'wrench', bg: '#EFF6FF', color: '#2563EB',
            title: 'Maintenance bill due', sub: pay.nextMaintDue || pay.maintBalance,
            go: 'transaction-history', cta: 'Pay', opts: { tenantPayFilter: 'maintenance' },
        });
    }
    const openIssues = typeof tenantMaintenanceForAccount === 'function'
        ? tenantMaintenanceForAccount(tenant).filter(m => m.status !== 'done')
        : [];
    openIssues.slice(0, 2).forEach(m => {
        const label = typeof maintStatusLabel !== 'undefined' ? (maintStatusLabel[m.status] || m.status) : m.status;
        items.push({
            priority: 3, icon: 'wrench', bg: '#EFF6FF', color: '#2563EB',
            title: m.issue, sub: `${label} · ${m.time || 'Open'}`,
            go: 'maintenance-detail', opts: { maintId: m.id }, cta: 'View',
        });
    });
    (typeof tenantSmartReminders === 'function' ? tenantSmartReminders(tenant) : [])
        .filter(r => r.urgency === 'high' || r.urgency === 'medium')
        .slice(0, 1)
        .forEach(r => {
            items.push({
                priority: 4, icon: 'bell', bg: '#F5F3FF', color: '#7C3AED',
                title: r.title, sub: `Due ${r.due || '—'}`,
                go: 'tenant-reminders', cta: 'View',
            });
        });
    (typeof announcementsForTenant === 'function' ? announcementsForTenant(tenant) : [])
        .filter(a => {
            const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenantId;
            return tid != null && !(a.readBy || []).includes(tid);
        })
        .slice(0, 1)
        .forEach(a => {
            items.push({
                priority: 5, icon: 'megaphone', bg: '#ECFDF5', color: '#059669',
                title: a.title, sub: `${a.date} · From landlord`,
                go: 'tenant-announcements', cta: 'Read',
            });
        });
    return items.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

function tenantInvoicesByKind(tenantId, kind) {
    const all = typeof invoicesForTenant === 'function' ? invoicesForTenant(tenantId) : [];
    if (kind === 'charges') return all.filter(i => isLandlordExtraCharge(i));
    if (kind === 'maintenance') return all.filter(i => isMaintenanceBill(i));
    return all.filter(i => !i.type || i.type === 'rent');
}

function renderTenantAccountMembers(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (!listItem) return '';
    const { tenancy, members } = getFlatMemberRoster(listItem.propertyId, listItem.unit);
    const account = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
    const isGroup = tenancy?.type === 'group' && members.length > 1;
    const roster = members.length ? members : [{ name: account ? `${account.firstName} ${account.lastName}` : listItem.name, isLead: true, accountStatus: 'active' }];
    const body = roster.map(m => {
        const isYou = account && (m.name === `${account.firstName} ${account.lastName}` || m.tenantId === tenantId);
        const role = m.isLead || m.role === 'lead' ? 'Lead tenant' : isGroup ? 'Flatmate' : 'Tenant';
        const status = m.accountStatus === 'active' ? 'Active' : m.accountStatus === 'pending' ? 'Invite pending' : 'No account yet';
        return `
        <div class="tnt-acct-member">
            <span class="tnt-acct-member-avatar">${(m.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
            <div class="min-w-0 flex-1">
                <p class="tnt-acct-member-name">${escapeHtml(m.name || '—')}${isYou ? ' <span class="tnt-acct-you">You</span>' : ''}</p>
                <p class="tnt-acct-member-meta">${role} · ${status}</p>
            </div>
        </div>`;
    }).join('');
    return `
    <div class="card p-4">
        <div class="tnt-acct-section-head">
            <p class="tnt-acct-section-title">${isGroup ? 'People on your flat' : 'Your tenancy'}</p>
            ${isGroup ? `<span class="badge bg-[#EEF2FF] text-[#4F46E5]">${members.length} members</span>` : ''}
        </div>
        <p class="tnt-acct-section-sub">${isGroup ? `Shared lease on ${listItem.unit}` : `Solo tenancy on ${listItem.unit}`}</p>
        <div class="tnt-acct-member-list">${body}</div>
    </div>`;
}

function renderTenantAccountContractors(tenant) {
    if (!tenant || typeof MAINTENANCE_ITEMS === 'undefined') return '';
    const issues = MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === tenant.propertyId &&
        m.unit === tenant.unit &&
        !(typeof isCommunalMaint === 'function' && isCommunalMaint(m))
    );
    const openIssues = issues.filter(m => m.status !== 'done');
    const assigned = issues.filter(m => m.contractor && m.contractor !== '—');
    const contractorLookup = (name) => (typeof CONTRACTORS !== 'undefined' ? CONTRACTORS.find(c => c.name === name) : null);
    const rows = assigned.length ? assigned.map(m => {
        const c = contractorLookup(m.contractor);
        const st = typeof maintStatusLabel !== 'undefined' ? (maintStatusLabel[m.status] || m.status) : m.status;
        return `
        <div class="tnt-acct-contractor">
            <button type="button" data-go="maintenance-detail" data-mid="${m.id}" class="tnt-acct-contractor-main w-full text-left">
                <div class="tnt-acct-contractor-icon"><i data-lucide="hard-hat" class="w-4 h-4"></i></div>
                <div class="min-w-0 flex-1">
                    <p class="tnt-acct-contractor-name">${escapeHtml(m.contractor)}</p>
                    <p class="tnt-acct-contractor-meta">${escapeHtml(c ? contractorCategoryLabel(c) : 'Contractor')} · ${escapeHtml(m.issue)}</p>
                </div>
                <span class="tnt-acct-contractor-status">${escapeHtml(st)}</span>
            </button>
            ${c ? `<button type="button" data-action="view-contractor-profile" data-cid="${c.id}" class="tnt-acct-contractor-profile">View profile</button>` : ''}
        </div>`;
    }).join('') : '';
    return `
    <div class="card p-4">
        <div class="dash-section-head">
            <div>
                <h3 class="screen-section-title">Maintenance & contractors</h3>
                <p class="dash-section-sub">${openIssues.length ? `${openIssues.length} open request${openIssues.length === 1 ? '' : 's'} on your flat` : 'No open issues — report something if you need help.'}</p>
            </div>
            <button type="button" data-go="log-maintenance" class="dash-view-all">Report issue</button>
        </div>
        ${rows || `<p class="text-[12px] text-[#64748B] py-2">When your landlord assigns a contractor, they will appear here with job status.</p>`}
    </div>`;
}

function renderTenantAccountHomeCard(t, p, tid) {
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : null;
    const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(tid) : null;
    return `
    <div class="card p-4 tnt-acct-home">
        <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Property</p>
        <p class="text-[15px] font-bold text-[#0F172A] mt-1">${escapeHtml(p?.name || '—')}</p>
        <p class="text-[12px] text-[#64748B] mt-1">${escapeHtml(p?.address || '—')}</p>
        <div class="tnt-acct-home-grid">
            <div><p class="tnt-acct-mini-label">Unit within property</p><p class="tnt-acct-mini-value">${escapeHtml(t.unit || '—')}</p></div>
            <div><p class="tnt-acct-mini-label">Monthly rent</p><p class="tnt-acct-mini-value">${escapeHtml(t.rent || fin?.rent || '—')}</p></div>
            <div><p class="tnt-acct-mini-label">Lease ends</p><p class="tnt-acct-mini-value">${escapeHtml(fin?.leaseEnd && typeof formatDisplayDate === 'function' ? formatDisplayDate(fin.leaseEnd) || fin.leaseEnd : (t.leaseEnd || '—'))}</p></div>
            <div><p class="tnt-acct-mini-label">Next due</p><p class="tnt-acct-mini-value">${escapeHtml(pay?.nextDue || '—')}</p></div>
        </div>
        <button type="button" data-go="tenant-building-info" class="btn-secondary w-full py-2.5 text-[12px] mt-3">Building info & house rules</button>
    </div>`;
}

const TENANT_REF_SECTIONS = [
    { key: 'passport', label: 'Passport / ID', icon: 'book-open', type: 'upload', hint: 'Passport, national ID or driving licence' },
    { key: 'rightToRent', label: 'Right to Rent', icon: 'shield-check', type: 'upload', hint: 'Share code or document from Home Office check' },
    { key: 'proofOfAddress', label: 'Proof of Address', icon: 'map-pin', type: 'upload', hint: 'Utility bill or bank statement (last 3 months)' },
    { key: 'proofOfIncome', label: 'Proof of Income', icon: 'banknote', type: 'upload', hint: 'Recent payslips or bank statements' },
    { key: 'employment', label: 'Employment Details', icon: 'briefcase', type: 'form' },
    { key: 'previousLandlord', label: 'Previous Landlord', icon: 'home', type: 'form' },
    { key: 'guarantor', label: 'Guarantor Details', icon: 'user-check', type: 'form' },
];

const TENANT_CHECKOUT_CHECKLIST = [
    ['kitchen', 'Kitchen cleaned & appliances wiped'],
    ['bathroom', 'Bathroom cleaned & fixtures wiped'],
    ['bedroom', 'Bedrooms vacuumed & surfaces dusted'],
    ['living', 'Living areas tidy & floors cleaned'],
    ['keys', 'All keys returned to landlord'],
];

function getTenantReferencing(tenantId) {
    if (!AppStore.tenantReferencing) AppStore.tenantReferencing = {};
    if (!AppStore.tenantReferencing[tenantId]) {
        AppStore.tenantReferencing[tenantId] = {
            passport: { status: 'pending' },
            rightToRent: { status: 'pending' },
            proofOfAddress: { status: 'pending' },
            proofOfIncome: { status: 'pending' },
            employment: { status: 'pending' },
            previousLandlord: { status: 'pending' },
            guarantor: { status: 'pending' },
        };
    }
    return AppStore.tenantReferencing[tenantId];
}

function tenantRefStatusLabel(status) {
    const map = {
        verified: ['Verified', '#ECFDF5', '#059669'],
        complete: ['Complete', '#ECFDF5', '#059669'],
        pending: ['Pending review', '#FEF3C7', '#D97706'],
        missing: ['Not provided', '#F1F5F9', '#64748B'],
        not_required: ['Not required', '#F1F5F9', '#64748B'],
    };
    return map[status] || map.pending;
}

function tenantMaintenanceForAccount(tenant) {
    if (!tenant || typeof MAINTENANCE_ITEMS === 'undefined') return [];
    return MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === tenant.propertyId &&
        m.unit === tenant.unit &&
        !(typeof isCommunalMaint === 'function' && isCommunalMaint(m))
    );
}

function tenantSmartReminders(tenant) {
    if (!tenant) return [];
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenant.id;
    const listItem = TENANT_LIST[tid];
    const tenantTypes = new Set(['rent-review', 'inspection', 'gas', 'electrical', 'epc', 'custom']);
    const rows = (AppStore.reminders || []).filter(r =>
        r.propertyId === tenant.propertyId && tenantTypes.has(r.type)
    );
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : null;
    if (pay?.balance && pay.balance !== '£0.00') {
        rows.unshift({
            id: 'rent-due', type: 'rent-review', title: 'Rent payment due',
            due: pay.nextDue?.split('·').pop()?.trim() || 'Soon', urgency: 'high', daysLeft: 3,
        });
    }
    if (listItem?.leaseEnd || tenant.leaseEnd) {
        const leaseEnd = listItem?.leaseEnd || tenant.leaseEnd;
        rows.push({
            id: 'lease-end', type: 'rent-review', title: 'Lease end date',
            due: leaseEnd, urgency: 'medium', daysLeft: 90,
        });
    }
    return rows.slice(0, 8);
}

function tenantComplianceForTenant(tenant) {
    if (!tenant) return [];
    const items = typeof COMPLIANCE_ITEMS !== 'undefined' ? COMPLIANCE_ITEMS : [];
    const tenantVisible = [0, 1, 5];
    return tenantVisible.map(cid => {
        const certKey = `${tenant.propertyId}-${cid}`;
        const saved = AppStore.complianceCerts?.[certKey];
        const cfg = COMPLIANCE_ITEM_CONFIG[cid];
        const [ic, name, exp] = items[cid] || ['shield', 'Certificate', '—'];
        const valid = saved?.expiryDate ? (daysUntil(saved.expiryDate) ?? 0) > 0 : cid === 5;
        return {
            cid, icon: ic, name, expiry: saved?.expiryDate || exp,
            status: valid ? 'valid' : 'action_needed',
            certNumber: saved?.certNumber || '—',
            issuedBy: saved?.issuedBy || '—',
        };
    });
}

function tenantCommunicationHistory(tenant) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : tenant?.id;
    const rows = [];
    const chatId = typeof getActiveTenantLandlordChatId === 'function' ? getActiveTenantLandlordChatId() : null;
    const conv = chatId != null && typeof CONVERSATIONS !== 'undefined' ? CONVERSATIONS.find(c => c.id === chatId) : null;
    if (conv?.messages?.length) {
        conv.messages.slice(-3).forEach(m => {
            rows.push({
                icon: 'message-square', color: '#4F46E5', bg: '#EEF2FF',
                title: m.type === 'in' ? 'You messaged landlord' : 'Landlord replied',
                sub: m.text, time: m.time, go: 'chat', opts: { chatId },
            });
        });
    }
    tenantMaintenanceForAccount(tenant).slice(0, 4).forEach(m => {
        const label = typeof maintStatusLabel !== 'undefined' ? (maintStatusLabel[m.status] || m.status) : m.status;
        rows.push({
            icon: 'wrench', color: '#D97706', bg: '#FFFBEB',
            title: m.issue, sub: `${label} · ${m.contractor && m.contractor !== '—' ? m.contractor : 'Awaiting contractor'}`,
            time: m.time, go: 'maintenance-detail', opts: { maintId: m.id },
        });
    });
    return rows.sort((a, b) => 0).slice(0, 6);
}

function tenantContractorChatIds(tenant) {
    if (!tenant) return [];
    const ids = tenantMaintenanceForAccount(tenant)
        .filter(m => m.contractor && m.contractor !== '—')
        .map(m => getContractorChatId(m.contractor))
        .filter(id => id != null);
    return [...new Set(ids)];
}

function getTenantCheckout(tenantId) {
    if (!AppStore.tenantCheckout) AppStore.tenantCheckout = {};
    if (!AppStore.tenantCheckout[tenantId]) {
        const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(tenantId) : null;
        const listItem = TENANT_LIST.find(t => t.id === tenantId) || TENANT_LIST[tenantId];
        const tenancy = listItem && typeof getTenancyForTenantListItem === 'function'
            ? getTenancyForTenantListItem(listItem) : null;
        AppStore.tenantCheckout[tenantId] = {
            checklist: Object.fromEntries(TENANT_CHECKOUT_CHECKLIST.map(([k]) => [k, false])),
            meters: { electricity: '', gas: '', water: '' },
            photos: [],
            depositStatus: tenancy?.depositStatus || 'protected',
            depositScheme: tenancy?.depositScheme || 'MyDeposits',
            depositAmount: fin?.deposit || '—',
            protectionRef: tenancy?.protectionRef || '',
        };
    }
    return AppStore.tenantCheckout[tenantId];
}

function pickVideoFiles() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.multiple = true;
        input.style.cssText = 'position:fixed;left:-9999px;opacity:0;pointer-events:none';
        const finish = (urls) => { input.remove(); resolve(urls); };
        input.addEventListener('change', async () => {
            const files = Array.from(input.files || []).filter(f => (f.type || '').startsWith('video/'));
            if (!files.length) { finish([]); return; }
            try {
                finish(await Promise.all(files.map(readFileAsDataUrl)));
            } catch {
                finish([]);
            }
        });
        input.addEventListener('cancel', () => finish([]));
        document.body.appendChild(input);
        input.click();
    });
}

function syncInspectionDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    AppStore.inspections.forEach(i => {
        if (!i.scheduled || !i.date) return;
        const d = new Date(i.date);
        if (!Number.isNaN(d.getTime()) && d < today) i.scheduled = false;
    });
}

function normalizeDemoPortfolio() {
    const canonicalInvoices = [
        { id: 0, num: 'INV-2026-1048', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Pending', due: 'Jul 1, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
        { id: 1, num: 'INV-2026-1047', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Overdue', due: 'Jul 1, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
        { id: 2, num: 'INV-2026-1045', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', tenantId: 2, propertyId: 3, amount: '£1,950', status: 'Pending', due: 'Jul 28, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent' },
        { id: 15, num: 'INV-2026-1051', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2B', tenant: 'Priya Sharma', tenantId: 4, propertyId: 0, amount: '£2,200', status: 'Pending', due: 'Jul 1, 2026', month: 'Jul 2026', type: 'rent', desc: 'Monthly rent — group lease' },
        { id: 3, num: 'INV-2026-1044', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Jun 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1044' },
        { id: 4, num: 'INV-2026-1043', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Jun 3, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1043' },
        { id: 12, num: 'INV-2026-1038', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', tenantId: 2, propertyId: 3, amount: '£1,950', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Jun 4, 2026', paymentMethod: 'Bank transfer', paymentReference: 'LH-INV-2026-1038' },
        { id: 16, num: 'INV-2026-1052', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2B', tenant: 'Priya Sharma', tenantId: 4, propertyId: 0, amount: '£2,200', status: 'Paid', due: 'Jun 1, 2026', month: 'Jun 2026', type: 'rent', desc: 'Monthly rent — group lease', paidOn: 'Jun 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1052' },
        { id: 6, num: 'INV-2026-1040', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Paid', due: 'May 1, 2026', month: 'May 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'May 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1040' },
        { id: 9, num: 'INV-2026-1037', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Paid', due: 'May 1, 2026', month: 'May 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'May 3, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1037' },
        { id: 13, num: 'INV-2026-1034', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', tenantId: 2, propertyId: 3, amount: '£1,950', status: 'Paid', due: 'May 1, 2026', month: 'May 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'May 5, 2026', paymentMethod: 'Bank transfer', paymentReference: 'LH-INV-2026-1034' },
        { id: 17, num: 'INV-2026-1053', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2B', tenant: 'Priya Sharma', tenantId: 4, propertyId: 0, amount: '£2,200', status: 'Paid', due: 'May 1, 2026', month: 'May 2026', type: 'rent', desc: 'Monthly rent — group lease', paidOn: 'May 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1053' },
        { id: 7, num: 'INV-2026-1036', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Paid', due: 'Apr 1, 2026', month: 'Apr 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Apr 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1036' },
        { id: 10, num: 'INV-2026-1033', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Paid', due: 'Apr 1, 2026', month: 'Apr 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Apr 3, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1033' },
        { id: 14, num: 'INV-2026-1030', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', tenantId: 2, propertyId: 3, amount: '£1,950', status: 'Paid', due: 'Apr 1, 2026', month: 'Apr 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Apr 4, 2026', paymentMethod: 'Bank transfer', paymentReference: 'LH-INV-2026-1030' },
        { id: 8, num: 'INV-2026-1032', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£2,450', status: 'Paid', due: 'Mar 1, 2026', month: 'Mar 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Mar 2, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1032' },
        { id: 11, num: 'INV-2026-1029', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', tenantId: 1, propertyId: 1, amount: '£1,850', status: 'Paid', due: 'Mar 1, 2026', month: 'Mar 2026', type: 'rent', desc: 'Monthly rent', paidOn: 'Mar 3, 2026', paymentMethod: 'Stripe', paymentReference: 'LH-INV-2026-1029' },
        { id: 5, num: 'INV-2026-1050', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', tenantId: 0, propertyId: 0, amount: '£85', status: 'Pending', due: 'Jul 20, 2026', month: 'Jul 2026', type: 'maintenance', desc: 'Kitchen sink repair share' },
    ];
    const invoiceSeedVersion = '2026-rent-history-v2';
    if (AppStore.invoiceSeedVersion !== invoiceSeedVersion
        || INVOICES.length !== canonicalInvoices.length
        || INVOICES.some((inv, idx) => inv.num !== canonicalInvoices[idx]?.num)) {
        INVOICES.splice(0, INVOICES.length, ...canonicalInvoices);
        AppStore.invoiceSeedVersion = invoiceSeedVersion;
        if (typeof syncTransactionsFromInvoices === 'function') syncTransactionsFromInvoices();
        AppStore.save();
    }
    const canonicalTenancies = [
        { id: 0, propertyId: 0, tenantId: 0, type: 'solo', unit: 'Flat 2A', rent: '£2,450', deposit: '£2,450', advancePaid: '£2,450', depositScheme: 'MyDeposits', depositStatus: 'protected', protectionRef: 'MD-20481', start: '2024-01-15', end: '2027-01-14', status: 'active' },
        { id: 1, propertyId: 1, tenantId: 1, type: 'solo', unit: 'Flat 1A', rent: '£1,850', deposit: '£1,850', advancePaid: '£1,850', depositScheme: 'DPS', depositStatus: 'protected', protectionRef: 'DPS-88214', start: '2023-06-01', end: '2027-05-31', status: 'active' },
        { id: 2, propertyId: 3, tenantId: 2, type: 'solo', unit: 'Flat 2A', rent: '£1,950', deposit: '£1,950', advancePaid: '£1,950', depositScheme: 'TDS', depositStatus: 'protected', protectionRef: 'TDS-44102', start: '2024-03-10', end: '2027-03-09', status: 'active' },
        { id: 3, propertyId: 0, tenantId: 4, type: 'group', unit: 'Flat 2B', rent: '£2,200', deposit: '£2,200', advancePaid: '£2,200', depositScheme: 'MyDeposits', depositStatus: 'protected', protectionRef: 'MD-31092', start: '2024-06-01', end: '2027-05-31', status: 'active', occupants: 3, leadName: 'Priya Sharma', members: [
            { name: 'Priya Sharma', email: 'priya.sh@email.com', phone: '+44 7700 900501', tenantId: 4, status: 'active', role: 'lead' },
            { name: 'James Chen', email: 'james.chen@email.com', phone: '+44 7700 900503', tenantId: 5, status: 'pending', role: 'member' },
            { name: 'Aisha Khan', email: 'aisha.k@email.com', phone: '+44 7700 900504', status: 'no-account', role: 'member' },
        ]},
    ];
    const staleGroupMichael = AppStore.tenancies?.some(t => t.propertyId === 3 && t.type === 'group');
    const missingGroupDemo = !AppStore.tenancies?.some(t => t.propertyId === 0 && t.unit === 'Flat 2B' && t.type === 'group');
    if (staleGroupMichael || missingGroupDemo) {
        AppStore.tenancies = JSON.parse(JSON.stringify(canonicalTenancies));
        AppStore.save();
    }
    const canonicalNids = ['4859217360', '7391045826', '6028471935', '9183746502', '3849201756', '5928173046'];
    const canonicalDeposits = ['£2,450', '£1,850', '£1,950', '£2,100', '£2,200', '£2,200'];
    const canonicalAdvances = ['£2,450', '£1,850', '£1,950', '£2,100', '£2,200', '—'];
    TENANTS.forEach((t, i) => {
        if (!t.idNumber || String(t.idNumber).startsWith('TN-')) t.idNumber = canonicalNids[i] || t.idNumber;
        if (!t.nidProof && t.id !== 5) t.nidProof = 'NID Proof.jpg';
        if (!t.deposit) t.deposit = canonicalDeposits[i] || t.deposit;
        if (t.advancePaid == null || t.advancePaid === '') t.advancePaid = canonicalAdvances[i] || t.advancePaid;
    });
    AppStore.tenancies?.forEach((ten, i) => {
        const canon = canonicalTenancies[i];
        if (!canon || ten.unit !== canon.unit) return;
        if (!ten.deposit) ten.deposit = canon.deposit;
        if (!ten.advancePaid) ten.advancePaid = canon.advancePaid;
    });
    syncInspectionDates();
}

function tenantNameForInvoice(inv) {
    if (inv.tenant) return inv.tenant;
    const propName = inv.prop.split(',')[0].trim();
    const tenant = TENANT_LIST.find(t => t.prop === propName && t.status === 'active' && (!inv.unit || t.unit === inv.unit));
    if (tenant) return tenant.name;
    const prop = PROPERTIES.find(p => inv.prop.includes(p.name));
    if (!prop) return 'Tenant';
    const units = getPropertyUnits(prop.id).filter(u => u.status === 'occupied');
    for (const u of units) {
        const roster = getFlatMemberRoster(prop.id, unitName(u));
        const lead = roster.members.find(m => m.isLead || m.accountStatus === 'active');
        if (lead?.name) return lead.name;
    }
    return 'Tenant';
}

function syncTransactionsFromInvoices() {
    TRANSACTIONS.length = 0;
    INVOICES.forEach(inv => {
        const propName = inv.prop.split(',')[0].trim();
        TRANSACTIONS.push({
            tenant: tenantNameForInvoice(inv),
            amount: inv.amount,
            status: inv.status,
            date: inv.status === 'Paid' ? (inv.paidOn || inv.due) : inv.due,
            prop: propName,
            unit: inv.unit || '',
            iid: inv.id,
            month: inv.month || inv.due,
            type: inv.type || 'rent',
            paymentMethod: inv.paymentMethod || '',
        });
    });
}

function upsertTenantFromInvite(invite, activated = false) {
    const fullName = `${invite.firstName} ${invite.lastName}`;
    const p = PROPERTIES[invite.propertyId];
    let listItem = TENANT_LIST.find(t =>
        t.propertyId === invite.propertyId && t.unit === invite.unit &&
        (t.name === fullName || t.status === 'pending')
    );
    const tid = listItem?.id ?? nextTenantListId();
    const avatarImg = listItem?.img || (typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tid) : IMG.avatar.sarah);
    const chatId = ensureTenantConversation(fullName, p?.name || '', avatarImg);
    const rentRaw = String(invite.rent || p?.rent || '').replace(/[^\d]/g, '');
    const rentFmt = invite.rent?.startsWith('£') ? invite.rent : `£${parseInt(rentRaw || '0', 10).toLocaleString()}`;
    const depositFmt = formatMoneyField(invite.deposit || rentRaw);
    const advanceFmt = formatMoneyField(invite.advancePaid || rentRaw);
    const depositScheme = invite.depositScheme || 'MyDeposits';
    const protectionRef = invite.protectionRef || '';
    const depositStatus = resolveDepositStatus(depositScheme, protectionRef);

    if (!listItem) {
        listItem = {
            id: tid, propertyId: invite.propertyId, chatId, name: fullName,
            prop: p?.name || '', unit: invite.unit,
            lease: formatLeaseRange(invite.leaseStart, invite.leaseEnd),
            leaseEnd: typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(invite.leaseEnd) : invite.leaseEnd,
            img: avatarImg,
            status: activated ? 'active' : 'pending',
            rent: rentFmt.includes('/mo') ? rentFmt : `${rentFmt}/mo`,
        };
        TENANT_LIST.push(listItem);
        TENANTS.push({
            id: tid, propertyId: invite.propertyId, firstName: invite.firstName, lastName: invite.lastName,
            email: invite.email, phone: invite.phone, prop: p?.name || '', unit: invite.unit,
            idNumber: invite.idNumber || '', dob: invite.dob || '', nidProof: invite.nidProof || 'NID Proof.jpg',
            nidProofFront: invite.nidProofFront || '', nidProofBack: invite.nidProofBack || '',
            rent: rentRaw, deposit: depositFmt, advancePaid: advanceFmt,
            moveIn: invite.leaseStart, leaseEnd: invite.leaseEnd,
            emergency: invite.emergency?.trim() || '',
            emergencyPhone: invite.emergencyPhone?.trim() || '',
        });
    } else {
        Object.assign(listItem, {
            name: fullName, unit: invite.unit, status: activated ? 'active' : 'pending',
            lease: formatLeaseRange(invite.leaseStart, invite.leaseEnd),
            leaseEnd: typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(invite.leaseEnd) : invite.leaseEnd,
            rent: rentFmt.includes('/mo') ? rentFmt : `${rentFmt}/mo`, chatId,
        });
        const t = tenantRecordById(tid);
        if (t) Object.assign(t, {
            firstName: invite.firstName, lastName: invite.lastName, email: invite.email, phone: invite.phone,
            unit: invite.unit, idNumber: invite.idNumber || t.idNumber, dob: invite.dob || t.dob,
            nidProof: invite.nidProof || t.nidProof,
            nidProofFront: invite.nidProofFront || t.nidProofFront || '',
            nidProofBack: invite.nidProofBack || t.nidProofBack || '',
            moveIn: invite.leaseStart, leaseEnd: invite.leaseEnd, rent: rentRaw,
            deposit: depositFmt || t.deposit, advancePaid: advanceFmt || t.advancePaid,
            emergency: invite.emergency?.trim() || t.emergency || '',
            emergencyPhone: invite.emergencyPhone?.trim() || t.emergencyPhone || '',
        });
    }
    ensureTenantNidProof(tid, invite.nidProof || 'NID Proof.jpg', {
        front: invite.nidProofFront || '',
        back: invite.nidProofBack || '',
    });

    let ten = AppStore.tenancies.find(x => x.propertyId === invite.propertyId && x.unit === invite.unit && x.status !== 'ended');
    if (!ten) {
        AppStore.tenancies.push({
            id: AppStore.nextId(AppStore.tenancies), propertyId: invite.propertyId, tenantId: tid,
            type: 'solo', unit: invite.unit, rent: rentFmt, deposit: depositFmt, advancePaid: advanceFmt,
            depositScheme, depositStatus, protectionRef,
            start: invite.leaseStart, end: invite.leaseEnd,
            status: activated ? 'active' : 'pending', members: [], occupants: 1,
        });
    } else {
        ten.tenantId = tid;
        ten.unit = invite.unit;
        ten.rent = rentFmt;
        ten.deposit = depositFmt || ten.deposit;
        ten.advancePaid = advanceFmt || ten.advancePaid;
        ten.depositScheme = depositScheme;
        ten.depositStatus = depositStatus;
        ten.protectionRef = protectionRef;
        ten.start = invite.leaseStart;
        ten.end = invite.leaseEnd;
        ten.status = activated ? 'active' : (ten.status === 'active' ? 'active' : 'pending');
    }

    if (activated) {
        listItem.status = 'active';
        const ten = AppStore.tenancies.find(x => x.propertyId === invite.propertyId && x.unit === invite.unit && x.status !== 'ended');
        linkMemberToTenancy(ten, invite, tid);
        syncPropertyStatus(invite.propertyId);
    }
    AppStore.save();
    return tid;
}

function syncLandlordAfterInviteSent(invite) {
    upsertTenantFromInvite(invite, false);
    pushNotification({
        icon: 'mail', color: ['#EFF6FF', '#2563EB'],
        title: 'Invitation sent', desc: `${invite.firstName} ${invite.lastName} · ${PROPERTIES[invite.propertyId]?.name}`,
        time: 'Just now', unread: true, screen: 'property-detail', opts: { pid: invite.propertyId, tab: 'tenant' },
    });
}

function syncLandlordAfterActivation(invite) {
    const tid = upsertTenantFromInvite(invite, true);
    if (typeof ensureLandlordConversation === 'function') ensureLandlordConversation(invite);
    pushNotification({
        icon: 'user-check', color: ['#ECFDF5', '#059669'],
        title: 'Tenant activated', desc: `${invite.firstName} ${invite.lastName} joined the portal`,
        time: 'Just now', unread: true, screen: 'tenant-detail', opts: { tid },
    });
    return tid;
}

function isLandlordExtraCharge(inv) {
    return inv?.type === 'bill' && !!inv.chargeType;
}

function isMaintenanceBill(inv) {
    return inv?.type === 'maintenance' || (inv?.type === 'bill' && !inv.chargeType);
}

function chargeTypeIcon(chargeType) {
    const icons = { utility: 'zap', repair: 'wrench', penalty: 'alert-triangle', service: 'receipt', custom: 'plus-circle' };
    return icons[chargeType] || 'receipt';
}

function chargeInvoiceLabel(inv) {
    if (!inv) return 'Charge';
    if (isLandlordExtraCharge(inv)) {
        if (inv.chargeType === 'custom' && inv.desc) return inv.desc.split(' · ')[0];
        const meta = typeof CHARGE_TYPE_OPTIONS !== 'undefined'
            ? CHARGE_TYPE_OPTIONS.find(c => c.id === inv.chargeType)
            : null;
        if (meta) return meta.label;
    }
    return typeof invoiceTypeLabel === 'function' ? invoiceTypeLabel(inv) : (inv.desc || 'Bill');
}

function chargeInvoiceIcon(inv) {
    if (isLandlordExtraCharge(inv)) return chargeTypeIcon(inv.chargeType);
    if (inv?.type === 'maintenance') return 'wrench';
    return 'receipt';
}

function pushTenantNotification(tenantId, n) {
    if (tenantId == null) return;
    if (!AppStore.tenantNotifications) AppStore.tenantNotifications = {};
    if (!AppStore.tenantNotifications[tenantId]) AppStore.tenantNotifications[tenantId] = [];
    AppStore.tenantNotifications[tenantId].unshift({ ...n, tenantId });
    AppStore.save();
}

function tenantNotificationsList(tenantId) {
    const tid = tenantId != null ? tenantId : (typeof activeTenantListId === 'function' ? activeTenantListId() : 0);
    const dynamic = AppStore.tenantNotifications?.[tid] || [];
    const seed = tid === 0 ? TENANT_NOTIFICATIONS : [];
    return [...dynamic, ...seed];
}

function pushNotification(n) {
    NOTIFICATIONS.unshift(n);
    AppStore.save();
}

function broadcastHubLabel(propertyId) {
    const count = (AppStore.broadcasts || []).filter(b => b.propertyId === propertyId).length;
    return count ? `${count} sent` : 'Send to tenants';
}

function propertyHubStats(propertyId) {
    const p = PROPERTIES[propertyId];
    const units = getPropertyUnits(propertyId);
    const occupiedFlats = units.filter(u => u.status === 'occupied').length;
    const memberTotal = units.reduce((n, u) => n + getFlatMemberRoster(propertyId, unitName(u)).count, 0);
    const b = getPropertyBuilding(propertyId);
    const distinctFloors = new Set(units.map(u => u.floor || 1)).size;
    const floors = b.useFloors && b.floors > 1 ? b.floors : Math.max(1, distinctFloors);
    const docs = AppStore.docsForProperty(propertyId);
    const propMaint = typeof propertyMaintenanceItems === 'function' ? propertyMaintenanceItems(p.name) : [];
    const openMaint = propMaint.filter(m => m.status === 'open' || m.status === 'progress').length;
    const upcoming = AppStore.inspections.find(i => i.propertyId === propertyId && i.scheduled);
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(propertyId) : [];
    return { p, units, occupiedFlats, memberTotal, floors, docs, openMaint, upcoming, rooms };
}

function propertyHubStatusPill(propertyId) {
    const p = PROPERTIES[propertyId];
    if (p?.status === 'Partial') return { label: 'Partial', bg: '#DBEAFE', color: '#2563EB' };
    const { occupiedFlats, units } = propertyHubStats(propertyId);
    if (!units.length || occupiedFlats === 0) return { label: 'Vacant', bg: '#FEF3C7', color: '#D97706' };
    if (occupiedFlats === units.length) return { label: 'Fully occupied', bg: '#DCFCE7', color: '#16A34A' };
    return { label: 'Partial', bg: '#DBEAFE', color: '#2563EB' };
}

function propertyInspectionHubLabel(propertyId) {
    const { upcoming } = propertyHubStats(propertyId);
    if (!upcoming?.date) return 'Not scheduled';
    const target = new Date(upcoming.date);
    if (Number.isNaN(target.getTime())) return 'Scheduled';
    const days = Math.ceil((target.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    if (days <= 0) return 'Due today';
    if (days === 1) return 'Next in 1 day';
    return `Next in ${days} days`;
}

function propertyComplianceHubLabel(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p?.compliance) return 'Action needed';
    return 'All Good';
}

function flatRentSpecLine(u) {
    const rent = String(u.rent || '—').replace(/\s*\/month/i, '').trim();
    const rentLabel = rent === '—' ? '—' : `${rent}/mo`;
    const specParts = [];
    if (u.beds) specParts.push(`${u.beds} Bed`);
    if (u.baths) specParts.push(`${u.baths} Bath`);
    const spec = specParts.length ? specParts.join(' • ') : flatSpecLine(u);
    return `${rentLabel} • ${spec}`;
}

function propertyHubMetaLine(propertyId) {
    const { units, occupiedFlats } = propertyHubStats(propertyId);
    const rent = typeof propertyRentListLabel === 'function' ? propertyRentListLabel(propertyId) : '';
    const n = units.length;
    return `${n} unit${n === 1 ? '' : 's'} · ${occupiedFlats}/${n} occupied · ${rent}`;
}

const PROPERTY_BUILDING_SECTIONS = new Set(['photos']);
const PROPERTY_RECORDS_SECTIONS = new Set(['documents', 'inspection', 'compliance', 'inventory', 'timeline']);

function isPropertyBuildingSection(tab) {
    return PROPERTY_BUILDING_SECTIONS.has(tab);
}

function isPropertyRecordsSection(tab) {
    return PROPERTY_RECORDS_SECTIONS.has(tab);
}

/** @deprecated use isPropertyRecordsSection */
function isPropertyMoreSection(tab) {
    return isPropertyRecordsSection(tab);
}

function isPropertyInfoSection(tab) {
    return isPropertyBuildingSection(tab) || isPropertyRecordsSection(tab);
}

function propertyPrimaryNavTab(tab) {
    if (tab === 'tenant') return 'tenant';
    if (tab === 'records' || tab === 'more' || isPropertyRecordsSection(tab)) return 'records';
    if (tab === 'info' || tab === 'details' || isPropertyBuildingSection(tab)) return 'info';
    return 'units';
}

const PROPERTY_SECTION_LABELS = {
    documents: 'Documents',
    inspection: 'Inspections',
    compliance: 'Compliance',
    inventory: 'Inventory',
    photos: 'Building details',
    timeline: 'Activity',
};

function propertyInfoSectionBackBar(tab) {
    let parentTab;
    let parentLabel;
    if (isPropertyRecordsSection(tab)) {
        parentTab = 'records';
        parentLabel = 'Records';
    } else if (isPropertyBuildingSection(tab)) {
        parentTab = 'info';
        parentLabel = 'Info';
    } else {
        return '';
    }
    const label = PROPERTY_SECTION_LABELS[tab] || 'Section';
    return `
    <div class="prop-info-backbar">
        <button type="button" data-tab="${parentTab}" class="prop-info-back">
            <i data-lucide="chevron-left" class="w-4 h-4"></i> ${parentLabel}
        </button>
        <span class="prop-info-back-label">${label}</span>
    </div>`;
}

function propertyRecordsSummaryLine(propertyId) {
    const { docs, upcoming } = propertyHubStats(propertyId);
    const docPart = docs.length ? `${docs.length} doc${docs.length === 1 ? '' : 's'}` : 'No docs';
    const compliancePart = propertyComplianceHubLabel(propertyId);
    let inspPart = 'No inspection scheduled';
    if (upcoming?.date) {
        const d = typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date;
        inspPart = `Inspection ${d}`;
    }
    return `${docPart} · ${compliancePart} · ${inspPart}`;
}

function propertyInventoryHubLabel(propertyId) {
    const catalog = getInventoryRoomCatalog(propertyId);
    if (!catalog.length) return 'No rooms';
    const noted = catalog.filter(room => ensureInventoryRoom(propertyId, room.slug).notes?.trim()).length;
    return noted ? `${catalog.length} rooms · ${noted} with notes` : `${catalog.length} rooms`;
}

function propertyComplianceCertRows(propertyId) {
    const p = PROPERTIES[propertyId];
    const certKey = (cid) => `${propertyId}-${cid}`;
    const info = AppStore.meta(propertyId).info || {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const parseExpiry = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? null : d;
    };
    const itemStatus = (cid, displayExp) => {
        if (!p?.compliance) return { tone: 'bad', label: 'Action needed' };
        const saved = AppStore.complianceCerts[certKey(cid)];
        const raw = saved?.expiryDate || displayExp;
        const exp = parseExpiry(raw);
        if (!exp) return { tone: 'ok', label: 'Valid' };
        if (exp < today) return { tone: 'bad', label: 'Expired' };
        const days = Math.ceil((exp - today) / 86400000);
        if (days <= 30) return { tone: 'warn', label: `${days}d left` };
        return { tone: 'ok', label: 'Valid' };
    };
    return COMPLIANCE_ITEMS.map(([ic, n, exp], cid) => {
        const saved = AppStore.complianceCerts[certKey(cid)];
        const cfg = COMPLIANCE_ITEM_CONFIG[cid];
        const alarm = cfg?.alarmKey ? AppStore.meta(propertyId).alarms?.[cfg.alarmKey] : null;
        let displayExp = saved?.expiryDate
            ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(saved.expiryDate) : saved.expiryDate)
            : alarm?.expiry
                ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(alarm.expiry) : alarm.expiry)
                : exp;
        if (cid === 7 && info.epcExpiry) {
            displayExp = typeof formatDisplayDate === 'function' ? formatDisplayDate(info.epcExpiry) : info.epcExpiry;
        } else if (cid === 5 && info.insuranceExpiry) {
            displayExp = typeof formatDisplayDate === 'function' ? formatDisplayDate(info.insuranceExpiry) : info.insuranceExpiry;
        } else if (cid === 6 && info.mortgageRenewal) {
            displayExp = typeof formatDisplayDate === 'function' ? formatDisplayDate(info.mortgageRenewal) : info.mortgageRenewal;
        }
        const st = itemStatus(cid, saved?.expiryDate || alarm?.expiry);
        const action = cfg?.renewScreen
            ? `data-go="${cfg.renewScreen}" data-pid="${propertyId}"`
            : `data-go="renew-compliance" data-pid="${propertyId}" data-cid="${cid}"`;
        const label = cid === 7 && info.epc ? `EPC (${formatEpcDisplay(info.epc)})` : n;
        return { ic, n: label, displayExp, st, action };
    });
}

function renderRecordsSegmentNav(propertyId, activeView) {
    const segments = [
        ['documents', 'Documents', null],
        ['compliance', 'Compliance', propertyComplianceHubLabel(propertyId)],
        ['inspections', 'Inspections', propertyInspectionHubLabel(propertyId)],
        ['inventory', 'Inventory', propertyInventoryHubLabel(propertyId)],
    ];
    return `
    <div class="records-segments" role="tablist" aria-label="Records sections">
        ${segments.map(([id, label, meta]) => `
        <button type="button" data-records-view="${id}" role="tab" aria-selected="${activeView === id}" class="records-segment${activeView === id ? ' records-segment--active' : ''}">
            <span>${label}</span>
            ${meta ? `<span class="records-segment-meta">${meta}</span>` : ''}
        </button>`).join('')}
    </div>`;
}

function renderRecordsDocumentsPanel(propertyId) {
    const docs = typeof renderDocFolderBrowser === 'function'
        ? renderDocFolderBrowser(propertyId, `records-${propertyId}`, { compact: true, recordsMode: true })
        : '';
    return `
    <div class="records-panel">
        ${docs}
    </div>`;
}

function renderRecordsCompliancePanel(propertyId) {
    const p = PROPERTIES[propertyId];
    const rows = propertyComplianceCertRows(propertyId);
    const issues = rows.filter(r => r.st.tone !== 'ok');
    const toneColor = { ok: '#22C55E', warn: '#F59E0B', bad: '#EF4444' };
    return `
    <div class="records-panel">
        <div class="records-status-banner card${!p?.compliance || issues.length ? ' records-status-banner--warn' : ' records-status-banner--ok'}">
            <i data-lucide="${!p?.compliance || issues.length ? 'alert-circle' : 'shield-check'}" class="w-5 h-5"></i>
            <div>
                <p class="records-status-title">${!p?.compliance ? 'Action needed' : issues.length ? `${issues.length} certificate${issues.length === 1 ? '' : 's'} need attention` : 'All certificates valid'}</p>
                <p class="records-status-sub">Track gas, EICR, EPC and safety renewals for this property.</p>
            </div>
        </div>
        <div class="card records-mini-list">
            ${rows.map(({ ic, n, displayExp, st, action }) => `
            <button type="button" ${action} class="records-mini-row">
                <span class="records-mini-dot" style="background:${toneColor[st.tone]}"></span>
                <span class="records-mini-icon"><i data-lucide="${ic}" class="w-4 h-4"></i></span>
                <span class="records-mini-body">
                    <span class="records-mini-title">${n}</span>
                    <span class="records-mini-sub">${displayExp} · ${st.label}</span>
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>`).join('')}
        </div>
        <button type="button" data-go="certificate-assign" data-pid="${propertyId}" class="records-panel-cta btn-secondary w-full py-3 text-[13px]">+ Assign certificate</button>
    </div>`;
}

function renderRecordsInspectionsPanel(propertyId) {
    const upcoming = getScheduledInspection(propertyId);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    const nextDateLabel = upcoming
        ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date)
        : null;
    return `
    <div class="records-panel">
        ${upcoming ? `
        <div class="card records-insp-next">
            <p class="records-insp-label">Next visit</p>
            <p class="records-insp-title">${upcoming.type || 'Property inspection'}</p>
            <p class="records-insp-date">${nextDateLabel}${upcoming.timeSlot ? ` · ${upcoming.timeSlot}` : ''}</p>
            <div class="records-insp-actions">
                <button type="button" data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary py-2.5 text-[12px] flex-1">Reschedule</button>
                <button type="button" data-go="conduct-inspection" data-pid="${propertyId}" class="btn-primary py-2.5 text-[12px] flex-1">Conduct</button>
            </div>
        </div>` : `
        <div class="card records-insp-empty">
            <i data-lucide="clipboard-list" class="w-8 h-8 text-[#CBD5E1]"></i>
            <p class="records-insp-empty-title">No inspection scheduled</p>
            <p class="records-insp-empty-sub">Book a visit, then rate condition and save photos after you go.</p>
            <button type="button" data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-primary w-full py-2.5 text-[13px] mt-3">Schedule inspection</button>
        </div>`}
        ${past.length ? `
        <p class="records-panel-eyebrow">Past reports (${past.length})</p>
        <div class="card records-mini-list records-mini-list--flush">
            ${past.slice(0, 3).map(i => typeof inspReportRow === 'function' ? inspReportRow(i) : '').join('')}
        </div>` : ''}
    </div>`;
}

function renderRecordsInventoryPanel(propertyId) {
    const rooms = getInventoryRooms(propertyId);
    const withPhotos = rooms.filter(([, sub]) => /\d+ photo/.test(sub)).length;
    return `
    <div class="records-panel">
        <div class="records-status-banner card records-status-banner--neutral">
            <i data-lucide="package" class="w-5 h-5"></i>
            <div>
                <p class="records-status-title">${rooms.length} room checklist${rooms.length === 1 ? '' : 's'}</p>
                <p class="records-status-sub">${withPhotos ? `${withPhotos} room${withPhotos === 1 ? '' : 's'} with photos` : 'Room photo records for check-in / check-out.'}</p>
            </div>
        </div>
        <div class="card records-mini-list">
            ${rooms.map(([r, n, icon, idx]) => `
            <button type="button" data-go="inventory-room" data-pid="${propertyId}" data-room="${idx}" class="records-mini-row">
                <span class="records-mini-icon"><i data-lucide="${icon || 'package'}" class="w-4 h-4"></i></span>
                <span class="records-mini-body">
                    <span class="records-mini-title">${r}</span>
                    <span class="records-mini-sub">${n}</span>
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>`).join('')}
        </div>
        <button type="button" data-action="toggle-inventory-layout-edit" class="records-panel-cta btn-secondary w-full py-3 text-[13px]">Edit property layout</button>
    </div>`;
}

function certTileSummary(row) {
    const st = row?.st || { tone: 'bad', label: 'Not set' };
    if (st.tone === 'bad') return st.label === 'Action needed' || st.label === 'Valid' ? 'Not set' : st.label;
    if (st.tone === 'warn') return st.label;
    if (row?.displayExp) return `Until ${row.displayExp}`;
    return st.label || 'Not set';
}

function renderBuildingCertTiles(propertyId) {
    const rows = propertyComplianceCertRows(propertyId);
    const allDocs = AppStore.docsForProperty(propertyId);
    const folderCount = (folderId) => (typeof docsForFolder === 'function' ? docsForFolder(allDocs, folderId).length : 0);
    const tileDefs = [
        { folderId: 'gas', cid: 0, label: 'Gas (CP12)', icon: 'flame', bg: '#FEE2E2', color: '#DC2626' },
        { folderId: 'eicr', cid: 1, label: 'EICR', icon: 'zap', bg: '#FEF3C7', color: '#D97706' },
        { folderId: 'epc', cid: 7, label: 'EPC', icon: 'leaf', bg: '#ECFDF5', color: '#16A34A' },
        { folderId: 'deposit', label: 'Deposit', icon: 'shield', bg: '#DBEAFE', color: '#2563EB', folderOnly: true },
        { folderId: 'license', label: 'Property License', icon: 'badge-check', bg: '#EDE9FE', color: '#7C3AED', folderOnly: true, optional: true },
        { folderId: 'insurance', cid: 5, label: 'Insurance', icon: 'shield-check', bg: '#EEF2FF', color: '#4338CA' },
    ];
    const toneClass = { ok: 'cert-tile--ok', warn: 'cert-tile--warn', bad: 'cert-tile--bad' };
    return `
    <div class="cert-tile-grid">
        ${tileDefs.map(def => {
            const row = def.cid != null ? rows[def.cid] : null;
            const count = def.folderOnly ? folderCount(def.folderId) : 0;
            const st = row?.st || (def.folderOnly
                ? (count ? { tone: 'ok', label: `${count} on file` } : { tone: 'bad', label: def.optional ? 'Optional' : 'Not set' })
                : { tone: 'bad', label: 'Not set' });
            const meta = row?.displayExp ? certTileSummary(row) : (def.folderOnly && count ? `${count} file${count === 1 ? '' : 's'}` : st.label);
            return `
            <button type="button" data-go="property-doc-folder" data-folder="${def.folderId}" data-pid="${propertyId}" class="cert-tile ${toneClass[st.tone] || ''}">
                <span class="cert-tile-icon" style="background:${def.bg};color:${def.color}"><i data-lucide="${def.icon}" class="w-5 h-5"></i></span>
                <span class="cert-tile-body">
                    <span class="cert-tile-label">${def.label}</span>
                    <span class="cert-tile-meta">${meta}</span>
                </span>
                <span class="cert-tile-dot cert-tile-dot--${st.tone}" aria-hidden="true"></span>
            </button>`;
        }).join('')}
    </div>`;
}

function renderRecordsHubInspectionCard(propertyId) {
    const upcoming = getScheduledInspection(propertyId);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    const nextDateLabel = upcoming
        ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date)
        : null;
    if (!upcoming && !past.length) {
        return `
        <button type="button" data-go="reschedule-inspection" data-pid="${propertyId}" class="records-hub-summary card w-full text-left">
            <span class="records-hub-summary-icon"><i data-lucide="clipboard-list" class="w-5 h-5"></i></span>
            <span class="records-hub-summary-title">Schedule inspection</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
        </button>`;
    }
    return `
    <div class="card records-hub-insp">
        ${upcoming ? `
        <div class="records-hub-insp-main">
            <p class="records-hub-insp-label">Next inspection</p>
            <p class="records-hub-insp-title">${upcoming.type || 'Property inspection'}</p>
            <p class="records-hub-insp-date">${nextDateLabel}${upcoming.timeSlot ? ` · ${upcoming.timeSlot}` : ''}</p>
        </div>
        <div class="records-hub-insp-actions">
            <button type="button" data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary py-2 text-[12px] flex-1">Reschedule</button>
            <button type="button" data-go="conduct-inspection" data-pid="${propertyId}" class="btn-primary py-2 text-[12px] flex-1">Conduct</button>
        </div>` : `
        <p class="records-hub-insp-label">Inspections</p>
        <p class="records-hub-insp-meta">${past.length} past report${past.length === 1 ? '' : 's'}</p>
        <button type="button" data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary w-full py-2.5 text-[12px] mt-2">Schedule next visit</button>`}
    </div>`;
}

function renderRecordsHubInventoryCard(propertyId) {
    const rooms = getInventoryRooms(propertyId);
    const hubLabel = propertyInventoryHubLabel(propertyId);
    return `
    <button type="button" data-go="property-inventory" data-pid="${propertyId}" class="records-hub-summary card w-full text-left">
        <span class="records-hub-summary-icon"><i data-lucide="package" class="w-5 h-5"></i></span>
        <span class="records-hub-summary-title">Inventory${hubLabel ? ` · ${hubLabel}` : ''}</span>
        <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
    </button>`;
}

function propertyCertTileIssues(propertyId) {
    const rows = propertyComplianceCertRows(propertyId);
    const certCids = [0, 1, 7, 5];
    return certCids.map(cid => rows[cid]).filter(r => r?.st?.tone !== 'ok');
}

function propertyFolderFileCount(propertyId, folderId) {
    if (typeof docsForFolder !== 'function') return 0;
    const allDocs = sortPropertyDocuments(AppStore.docsForProperty(propertyId));
    return docsForFolder(allDocs, folderId).length;
}

function renderRecordsHubNavRow(icon, label, attrs, meta = '') {
    return `
    <button type="button" ${attrs} class="records-hub-nav-row w-full text-left">
        <span class="records-hub-link-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
        <span class="records-hub-link-body">
            <span class="records-hub-link-label">${label}</span>
            ${meta ? `<span class="records-hub-link-meta">${meta}</span>` : ''}
        </span>
        <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
    </button>`;
}

function renderRecordsHubInspectionRow(propertyId) {
    const upcoming = getScheduledInspection(propertyId);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    let meta = 'Not scheduled';
    if (upcoming) {
        const nextDateLabel = typeof formatDisplayDate === 'function'
            ? formatDisplayDate(upcoming.date) || upcoming.date
            : upcoming.date;
        meta = `Next · ${nextDateLabel}`;
    } else if (past.length) {
        meta = `${past.length} past report${past.length === 1 ? '' : 's'}`;
    }
    return renderRecordsHubNavRow('clipboard-list', 'Inspections', `data-go="property-inspections" data-pid="${propertyId}"`, meta);
}

function renderRecordsHubInventoryRow(propertyId) {
    const rooms = getInventoryRooms(propertyId);
    const flagged = rooms.filter(r => r[1] && r[1] !== 'Good').length;
    const meta = rooms.length
        ? `${rooms.length} room${rooms.length === 1 ? '' : 's'}${flagged ? ` · ${flagged} to review` : ''}`
        : 'Not set up';
    return renderRecordsHubNavRow('package', 'Inventory', `data-go="property-inventory" data-pid="${propertyId}"`, meta);
}

function propertyFlatDocumentCount(propertyId) {
    const unitNames = new Set(getPropertyUnits(propertyId).map(u => unitName(u)));
    return AppStore.docsForProperty(propertyId).filter(d => d.unit && unitNames.has(d.unit)).length;
}

function screenPropertyInspections() {
    const propertyId = STATE.propertyId ?? 0;
    const p = PROPERTIES[propertyId];
    const sub = p?.name?.split(',')[0] || '';
    return `${topBar('Inspections', { back: true, sub })}
    ${renderPropertyInspectionTab(propertyId)}`;
}

function screenPropertyInventory() {
    const propertyId = STATE.propertyId ?? 0;
    const p = PROPERTIES[propertyId];
    const sub = p?.name?.split(',')[0] || '';
    return `${topBar('Inventory', { back: true, sub })}
    ${renderPropertyInventoryTab(propertyId)}`;
}

function screenPropertyFlatDocuments() {
    const propertyId = STATE.propertyId ?? 0;
    const units = getPropertyUnits(propertyId);
    const allDocs = AppStore.docsForProperty(propertyId);
    const rows = units.map(u => {
        const name = unitName(u);
        const count = allDocs.filter(d => d.unit === name).length;
        const meta = count ? `${count} file${count === 1 ? '' : 's'}` : 'No files yet';
        return renderRecordsHubNavRow('file-text', name, `data-go="flat-detail" data-pid="${propertyId}" data-unit="${name}" data-flat-tab="records"`, meta);
    }).join('');
    return `${topBar('Flat documents', { back: true })}
    <div class="screen-content screen-content-sm">
        ${rows ? `<div class="records-hub-nav-list card">${rows}</div>` : `
        <div class="records-docs-empty card">
            <i data-lucide="home" class="w-8 h-8 text-[#CBD5E1]"></i>
            <p class="records-docs-empty-title">No units yet</p>
            <p class="records-docs-empty-sub">Add a unit first, then upload tenancy files per flat.</p>
            <button type="button" data-go="add-flat" data-pid="${propertyId}" class="btn-primary w-full py-3 text-[13px] mt-3">+ Add unit</button>
        </div>`}
    </div>`;
}

function renderPropertyRecordsHub(propertyId) {
    const certIssues = propertyCertTileIssues(propertyId);
    const fireCount = propertyFolderFileCount(propertyId, 'fire');
    const otherCount = propertyFolderFileCount(propertyId, 'custom');
    const flatDocCount = propertyFlatDocumentCount(propertyId);
    return `
    <div class="screen-content screen-content-sm prop-records-page prop-records-unified">
        <section class="records-hub-section records-hub-section--cert" id="records-compliance">
            <div class="records-hub-section-head records-hub-section-head--cert">
                <div class="records-hub-section-copy">
                    <h3 class="records-hub-section-title">Certificates</h3>
                    ${certIssues.length ? `<span class="records-hub-section-badge records-hub-section-badge--warn">${certIssues.length} need attention</span>` : ''}
                </div>
                <button type="button" data-action="open-add-document-flow" class="records-hub-upload-btn" aria-label="Upload certificate">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i><span>Upload</span>
                </button>
            </div>
            ${renderBuildingCertTiles(propertyId)}
        </section>
        <section class="records-hub-section">
            <h3 class="records-hub-section-title">Safety</h3>
            <div class="records-hub-nav-list card">
                ${renderRecordsHubNavRow('bell-ring', 'Alarms', `data-go="property-alarms" data-pid="${propertyId}"`, 'Test dates & expiry')}
                ${fireCount ? renderRecordsHubNavRow('flame-kindling', 'Fire safety', `data-go="property-doc-folder" data-folder="fire" data-pid="${propertyId}"`, `${fireCount} file${fireCount === 1 ? '' : 's'}`) : ''}
            </div>
        </section>
        <section class="records-hub-section records-hub-section--split" id="records-checks">
            <h3 class="records-hub-section-title">Checks & files</h3>
            <div class="records-hub-nav-list card">
                ${renderRecordsHubInspectionRow(propertyId)}
                ${renderRecordsHubInventoryRow(propertyId)}
                ${renderRecordsHubNavRow('home', 'Flat documents', `data-go="property-flat-documents" data-pid="${propertyId}"`, flatDocCount ? `${flatDocCount} file${flatDocCount === 1 ? '' : 's'}` : 'Open by unit')}
                ${renderRecordsHubNavRow('folder', 'Other files', `data-go="property-doc-folder" data-folder="custom" data-pid="${propertyId}"`, otherCount ? `${otherCount} file${otherCount === 1 ? '' : 's'}` : 'No files yet')}
            </div>
        </section>
    </div>`;
}

/** @deprecated use renderPropertyRecordsHub */
function renderPropertyMoreHub(propertyId) {
    return renderPropertyRecordsHub(propertyId);
}

/** @deprecated use renderPropertyRecordsHub */
function renderPropertyInfoHub(propertyId) {
    return renderPropertyRecordsHub(propertyId);
}

function renderPropertySectionNav(activeTab) {
    const navTab = propertyPrimaryNavTab(activeTab);
    const tabs = [
        ['units', 'Overview', 'layout-dashboard'],
        ['tenant', 'Tenants', 'users'],
        ['info', 'Info', 'building-2'],
        ['records', 'Records', 'folder-open'],
    ];
    return `
    <div class="prop-section-nav">
        <div class="prop-section-nav-tabs" role="tablist" aria-label="Property sections">
            ${tabs.map(([tab, label, icon]) => {
                const active = navTab === tab;
                return `
            <button type="button" data-tab="${tab}" role="tab" aria-selected="${active}" class="prop-section-tab-item ${active ? 'prop-section-tab-item--active' : ''}">
                <span class="prop-section-tab-icon"><i data-lucide="${icon}" class="w-[20px] h-[20px]"></i></span>
                <span class="prop-section-tab-label-wrap">
                    <span class="prop-section-tab-label">${label}</span>
                    ${active ? '<span class="prop-section-tab-indicator" aria-hidden="true"></span>' : ''}
                </span>
            </button>`;
            }).join('')}
        </div>
    </div>`;
}

function unitFilterLabel(filter) {
    return { all: 'All units', occupied: 'Occupied', vacant: 'Vacant' }[filter] || 'All units';
}

function unitFilterSheet() {
    if (!STATE.showUnitFilters || STATE.screen !== 'property-detail' || STATE.tab !== 'units') return '';
    const propertyId = STATE.propertyId;
    const allUnits = getPropertyUnits(propertyId);
    const vacantCount = allUnits.filter(u => u.status !== 'occupied').length;
    const occupiedCount = allUnits.length - vacantCount;
    const unitFilter = STATE.unitFilter || 'all';
    const filteredCount = filterPropertyUnits(allUnits).length;
    const options = [
        ['all', 'All units', allUnits.length],
        ['occupied', 'Occupied', occupiedCount],
        ['vacant', 'Vacant', vacantCount],
    ];
    return `
    <div class="filter-sheet-overlay open" data-action="close-unit-filters"></div>
    <div class="filter-sheet open">
        <div class="filter-sheet-handle"></div>
        <div class="filter-sheet-header">
            <p class="filter-sheet-title">Filter units</p>
            <button type="button" data-action="reset-unit-filters" class="filter-sheet-reset">Reset</button>
        </div>
        <div class="filter-sheet-body">
            <div class="filter-sheet-list">
                ${options.map(([k, label, count]) => `
                <button type="button" data-unit-filter="${k}" class="filter-sheet-row ${unitFilter === k ? 'active' : ''}">
                    <span>${label}</span>
                    <span class="filter-sheet-row-count">${count}</span>
                </button>`).join('')}
            </div>
        </div>
        <div class="filter-sheet-footer">
            <button type="button" data-action="close-unit-filters" class="btn-primary w-full py-3.5 text-[14px]">Show ${filteredCount} unit${filteredCount === 1 ? '' : 's'}</button>
        </div>
    </div>`;
}

const DOC_TYPE_ICONS = {
    'Tenancy Agreement': 'file-text', 'Deposit Certificate': 'shield', 'Gas Certificate': 'flame',
    'Electrical Certificate': 'zap', 'EPC Certificate': 'leaf', 'How to Rent Guide': 'book-open',
    'Signed Document': 'file-check', 'Custom Document': 'file',
};
const DOC_TYPE_COLORS = {
    'Tenancy Agreement': '#2563EB', 'Deposit Certificate': '#059669', 'Gas Certificate': '#DC2626',
    'Electrical Certificate': '#D97706', 'EPC Certificate': '#16A34A', 'How to Rent Guide': '#7C3AED',
    'Signed Document': '#059669', 'Custom Document': '#64748B',
};
const DOC_TYPE_SORT = {
    'Tenancy Agreement': 0, 'Deposit Certificate': 1, 'Gas Certificate': 2, 'Electrical Certificate': 3,
    'EPC Certificate': 4, 'How to Rent Guide': 5, 'Signed Document': 6, 'Custom Document': 7,
};

function documentActionMenuItems(docId) {
    const doc = AppStore.documents.find(d => d.id === docId);
    if (!doc) return [];
    return [
        { label: 'Edit', icon: 'pencil', action: 'action-menu-edit-document', attrs: `data-doc="${docId}"` },
        { label: 'Delete', icon: 'trash-2', action: 'action-menu-delete-document', danger: true, attrs: `data-doc="${docId}"` },
    ];
}

function renderDocumentRow(doc, propertyId) {
    const upload = isUserUploadedDoc(doc);
    const menuKey = actionMenuKeyFor('doc', propertyId, doc.id);
    const { icon, color, bg } = documentRowVisual(doc);
    const menuOpen = isActionMenuOpen(menuKey);
    const menuItems = documentActionMenuItems(doc.id);
    return `
    <div class="doc-row card ${menuOpen ? 'doc-row--menu-open' : ''}">
        <button type="button" data-go="document-preview" data-doc="${doc.id}" class="doc-row-main">
            <div class="doc-row-icon" style="color:${color};background:${bg}"><i data-lucide="${icon}" class="w-5 h-5"></i></div>
            <div class="doc-row-text min-w-0">
                <p class="doc-row-name${upload ? ' doc-row-name--upload' : ''}">${escapeHtml(doc.name)}</p>
                <p class="doc-row-sub">${escapeHtml(documentRowSubtitle(doc))}</p>
            </div>
            <i data-lucide="chevron-right" class="doc-row-chevron w-4 h-4"></i>
        </button>
        <div class="doc-row-menu">
            ${renderActionMenuButton(menuKey, 'Document options')}
            ${renderActionMenuPopover(menuKey, menuItems)}
        </div>
    </div>`;
}

function renderPropertyDocumentsTab(propertyId) {
    const docs = sortPropertyDocuments(AppStore.docsForProperty(propertyId));
    const slotTotal = ADD_DOC_TYPE_OPTIONS.filter(o => o.type !== 'Custom Document').length;
    const filledSlots = ADD_DOC_TYPE_OPTIONS.filter(o =>
        o.type !== 'Custom Document' && docForPropertyByType(propertyId, o.type)
    ).length;
    return `
    <div class="screen-content screen-content-sm prop-docs-page">
        <p class="doc-page-count">${filledSlots}/${slotTotal} certificates on file${docs.length > filledSlots ? ` · ${docs.length} total` : ''}</p>
        ${renderLandlordDocSlotGrid(propertyId)}
    </div>`;
}

function renderPropertyUnitsTab(propertyId) {
    syncPropertyStatus(propertyId);
    ensureFlatPhotos(propertyId);
    const allUnits = getPropertyUnits(propertyId);
    const units = filterPropertyUnits(allUnits);
    const unitFilter = STATE.unitFilter || 'all';
    const groupFloors = shouldGroupFlatsByFloor(propertyId);
    const renderFlatRow = (u, inPanel = false) => renderPropertyFlatRow(propertyId, u, { inPanel, hubList: true });
    const flatList = !units.length ? `
        <div class="card p-8 text-center unit-list-empty">
            <i data-lucide="home" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No ${unitFilter === 'all' ? '' : unitFilter} units</p>
            <p class="text-[12px] text-[#64748B] mt-1">${unitFilter === 'all' ? 'Add your first unit to get started' : 'Try another filter'}</p>
            ${unitFilter === 'all'
                ? `<button type="button" data-go="add-flat" data-pid="${propertyId}" class="btn-primary py-2.5 px-5 text-[13px] mt-3">+ Add unit</button>`
                : `<button type="button" data-unit-filter="all" class="btn-secondary py-2.5 px-5 text-[13px] mt-3">Show all units</button>`}
        </div>`
        : groupFloors
        ? [...new Set(units.map(u => u.floor || 1))].sort((a, b) => a - b).map(floor => {
            const floorUnits = units.filter(u => (u.floor || 1) === floor);
            const note = floorUnits[0]?.floorNote;
            const collapsed = isFloorGroupCollapsed(propertyId, floor);
            return `
            <div class="unit-floor-block card${collapsed ? ' unit-floor-block--collapsed' : ''}">
                <button type="button" data-action="toggle-floor-group" data-pid="${propertyId}" data-floor="${floor}" class="unit-floor-toggle" aria-expanded="${!collapsed}">
                    <div class="unit-floor-head-left">
                        <span class="unit-floor-icon"><i data-lucide="layers" class="w-4 h-4"></i></span>
                        <h3 class="unit-floor-title">${formatFloorLabel(floor)}${note ? ` · ${note}` : ''}</h3>
                    </div>
                    <div class="unit-floor-head-right">
                        <span class="unit-floor-count">${floorUnits.length} Unit${floorUnits.length === 1 ? '' : 's'}</span>
                        <i data-lucide="chevron-down" class="unit-floor-chevron w-4 h-4"></i>
                    </div>
                </button>
                <div class="unit-floor-panel"${collapsed ? ' hidden' : ''}>
                    ${floorUnits.map(u => renderFlatRow(u, true)).join('')}
                </div>
            </div>`;
        }).join('')
        : `<div class="unit-floor-block card"><div class="unit-floor-panel unit-floor-panel--solo">${units.map(u => renderFlatRow(u, false)).join('')}</div></div>`;
    const summary = typeof renderPropertyHubSummaryCard === 'function'
        ? renderPropertyHubSummaryCard(propertyId)
        : '';
    return `
    <div class="screen-content screen-content-sm prop-hub-page prop-units-page prop-overview-page">
        ${summary ? `<div class="prop-overview-summary-wrap">${summary}</div>` : ''}
        <div class="unit-status-chips">
            <button type="button" data-unit-filter="all" class="unit-status-chip unit-status-chip--total ${unitFilter === 'all' ? 'active' : ''}">
                <i data-lucide="building-2" class="w-3.5 h-3.5"></i><span>All</span>
            </button>
            <button type="button" data-unit-filter="occupied" class="unit-status-chip unit-status-chip--occ ${unitFilter === 'occupied' ? 'active' : ''}">
                <i data-lucide="users" class="w-3.5 h-3.5"></i><span>Occupied</span>
            </button>
            <button type="button" data-unit-filter="vacant" class="unit-status-chip unit-status-chip--vac ${unitFilter === 'vacant' ? 'active' : ''}">
                <i data-lucide="door-open" class="w-3.5 h-3.5"></i><span>Vacant</span>
            </button>
        </div>
        <div class="unit-floor-list">${flatList}</div>
    </div>`;
}

function isCommunalMaint(item) {
    return item?.scope === 'communal' || item?.unit === 'Communal';
}

function formatMaintLocation(m, opts = {}) {
    const propName = opts.propName || m.prop?.split(',')[0] || '';
    if (isCommunalMaint(m)) {
        const area = m.communalArea || 'Communal area';
        return opts.hideProperty ? `Communal · ${area}` : `${propName} · Communal · ${area}`;
    }
    const unit = m.unit && m.unit !== '—' ? m.unit : '';
    return opts.hideProperty
        ? (unit || propName)
        : `${propName}${unit ? ` · ${unit}` : ''}`;
}

function maintenanceForUnit(propertyId, unit) {
    return MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === propertyId && !isCommunalMaint(m) && m.unit === unit
    );
}

function maintenanceForProperty(propertyId) {
    return MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId);
}

function invoicesForUnit(propertyId, unit) {
    const propName = PROPERTIES[propertyId]?.name?.split(',')[0]?.trim() || '';
    return INVOICES.filter(i =>
        (i.propertyId === propertyId || (propName && i.prop.includes(propName))) &&
        i.unit === unit
    ).sort((a, b) => (b.month || b.due).localeCompare(a.month || a.due));
}

function renderFlatHubSectionHead(title, sub, linkHtml = '') {
    return `
    <div class="flat-hub-section-head">
        <div class="min-w-0">
            <h2 class="flat-hub-section-title">${title}</h2>
            ${sub ? `<p class="flat-hub-section-sub">${sub}</p>` : ''}
        </div>
        ${linkHtml}
    </div>`;
}

function renderFlatRentAlert(propertyId, unit) {
    const unpaid = invoicesForUnit(propertyId, unit).filter(i => i.status === 'Overdue');
    if (!unpaid.length) return '';
    const inv = unpaid[0];
    return `
    <button type="button" data-go="mark-rent-received" data-iid="${inv.id}" class="flat-rent-alert card w-full text-left">
        <span class="flat-rent-alert-icon"><i data-lucide="alert-circle" class="w-4 h-4"></i></span>
        <span class="flat-rent-alert-body">
            <span class="flat-rent-alert-title">Rent overdue · ${inv.amount}</span>
            <span class="flat-rent-alert-meta">Due ${inv.due}</span>
        </span>
        <span class="flat-rent-alert-cta">Record</span>
    </button>`;
}

function renderFlatPeopleSection(propertyId, unit, { occ, tenancy, members, count, pendingInvite }) {
    const isGroup = tenancy?.type === 'group';
    if (!occ && !tenancy && !count) {
        return `
        <section class="card flat-tenant-vacant">
            <p class="flat-tenant-vacant-eyebrow">Vacant</p>
            <h3 class="flat-tenant-vacant-title">No tenant on this unit</h3>
            ${pendingInvite ? `
            <button data-go="tenant-invite-sent" data-invite-token="${pendingInvite.token}" class="flat-invite-banner flat-invite-banner--inline w-full text-left">
                <div class="flat-invite-banner-icon"><i data-lucide="mail" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="flat-invite-banner-title">Invite pending</p>
                    <p class="flat-invite-banner-meta">${pendingInvite.firstName} ${pendingInvite.lastName}</p>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
            <div class="flat-tenant-vacant-actions">
                <button type="button" data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="btn-primary w-full py-3.5 text-[14px]">Invite tenant</button>
                <button type="button" data-go="create-tenancy" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px]">Set up lease</button>
            </div>
        </section>`;
    }
    const leaseLine = tenancy
        ? `${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start} – ${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end}`
        : '—';
    const membersLabel = isGroup ? `Members · ${count}` : 'Tenant';
    const rowOpts = { tenantTab: true, isGroup: isGroup && count > 1 };
    return `
    <section class="card flat-dt-tenant-section">
        <div class="flat-dt-tenant-section-head">
            <h3 class="flat-dt-tenant-section-title">${membersLabel}</h3>
            <div class="flat-dt-tenant-section-meta">
                ${tenancy ? `<button type="button" data-go="tenancy-detail" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-tenant-lease-btn">${leaseLine} · Lease</button>` : ''}
            </div>
        </div>
        <div class="flat-dt-tenant-section-body">
            ${count
                ? `<div class="flat-dt-tenant-people${count === 1 ? ' flat-dt-tenant-people--solo' : ''}">${members.map(m => renderMemberRow(m, propertyId, unit, rowOpts)).join('')}</div>`
                : `<p class="flat-people-empty-desc">No one on the lease yet.</p>`}
            ${pendingInvite ? `
            <button data-go="tenant-invite-sent" data-invite-token="${pendingInvite.token}" class="flat-invite-banner flat-invite-banner--inline w-full text-left">
                <div class="flat-invite-banner-icon"><i data-lucide="mail" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="flat-invite-banner-title">Invite pending</p>
                    <p class="flat-invite-banner-meta">${pendingInvite.firstName} ${pendingInvite.lastName}</p>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
            ${isGroup ? `<button type="button" data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-tenant-invite-more">+ Invite member</button>` : ''}
        </div>
    </section>`;
}

function unitRentStats(propertyId, unit) {
    const invs = invoicesForUnit(propertyId, unit);
    const current = invs.filter(i => i.month === 'Jul 2026' || (i.status !== 'Paid' && !i.month));
    const total = current.reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    const collected = current.filter(i => i.status === 'Paid').reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    const outstanding = current.filter(i => i.status !== 'Paid').reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    return { total, collected, outstanding, unpaid: invs.filter(i => i.status !== 'Paid') };
}

function renderUnitRentHistory(propertyId, unit) {
    const invs = invoicesForUnit(propertyId, unit);
    if (!invs.length) {
        return `<div class="card p-6 text-center flat-rent-empty"><p class="text-[13px] text-[#64748B]">No rent records for this unit yet.</p></div>`;
    }
    return `
    <div class="rent-history-list flat-rent-history-list">
        ${invs.map(inv => renderRentHistoryRow(inv, { showUnit: false })).join('')}
    </div>`;
}

function screenFlatRentHistory() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const stats = unitRentStats(propertyId, unit);
    const unpaid = stats.unpaid;
    return `${topBar('Rent history', { back: true, sub: `${unit}${p?.name ? ` · ${p.name}` : ''}` })}
    <div class="screen-content screen-content-sm screen-enter flat-rent-page">
        ${stats.outstanding ? `
        <div class="flat-rent-summary card">
            <p class="flat-rent-summary-label">Outstanding</p>
            <p class="flat-rent-summary-amount">£${stats.outstanding.toLocaleString()}</p>
            <p class="flat-rent-summary-hint">${unpaid.length} unpaid bill${unpaid.length === 1 ? '' : 's'} for this unit</p>
            <button type="button" data-go="mark-rent-received"${unpaid.length === 1 ? ` data-iid="${unpaid[0].id}"` : ''} class="btn-primary w-full py-3 text-[13px] mt-3">Record payment</button>
        </div>` : stats.collected ? `
        <div class="flat-rent-summary card flat-rent-summary--ok">
            <p class="flat-rent-summary-label">This month</p>
            <p class="flat-rent-summary-amount text-[#16A34A]">£${stats.collected.toLocaleString()} collected</p>
        </div>` : ''}
        <p class="flat-section-eyebrow">Transaction history</p>
        ${renderUnitRentHistory(propertyId, unit)}
    </div>`;
}

function flatDetailPhotoList(propertyId, unit) {
    ensureFlatPhotos(propertyId);
    const gal = getFlatPhotoGallery(propertyId, unit);
    if (gal?.photos?.length) return gal.photos;
    return [getFlatCoverPhoto(propertyId, unit)];
}

function flatDetailSpecChips(u, specs = null) {
    const items = specs || [];
    if (!items.length) return '';
    return `
    <div class="flat-dt-spec-chips">
        ${items.map((s, i) => `
        ${i ? '<span class="flat-dt-spec-dot" aria-hidden="true">·</span>' : ''}
        <span class="flat-dt-spec"><i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>${escapeHtml(s.text)}</span>`).join('')}
    </div>`;
}

function flatDetailSpecItems(u) {
    const primary = [];
    if (u.beds) primary.push({ icon: 'bed-double', text: `${u.beds} Bed${u.beds === 1 ? '' : 's'}` });
    if (u.baths) primary.push({ icon: 'bath', text: `${u.baths} Bath${u.baths === 1 ? '' : 's'}` });
    if (u.sqft) primary.push({ icon: 'ruler', text: `${u.sqft} sqft` });
    const secondary = [];
    const floor = flatFloorLine(u);
    if (floor) secondary.push({ icon: 'layers', text: floor });
    if (u.furnished) secondary.push({ icon: 'sofa', text: u.furnished });
    return { primary, secondary };
}

function flatDetailFinanceRow(u, tenancy) {
    const rentAmt = flatEffectiveRentAmount(u, tenancy);
    const rentLabel = rentAmt ? formatRentAmount(rentAmt) : '—';
    return `
    <div class="flat-dt-finance flat-dt-finance--single">
        <div class="flat-dt-finance-col">
            <span class="flat-dt-finance-label">Monthly Rent</span>
            <span class="flat-dt-finance-val flat-dt-finance-val--rent">${escapeHtml(rentLabel)}</span>
        </div>
    </div>`;
}

function flatInspectionSubline(propertyId) {
    const upcoming = AppStore.inspections.find(i => i.propertyId === propertyId && i.scheduled);
    if (upcoming?.date) {
        const d = formatDisplayDate(upcoming.date) || upcoming.date;
        return `Next: ${d}`;
    }
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    if (past[0]?.date) {
        const d = formatDisplayDate(past[0].date) || past[0].date;
        return `Last: ${d}`;
    }
    return 'Not scheduled';
}

function flatDetailBuildingMeta(propertyId, u) {
    const info = AppStore.meta(propertyId).info || {};
    const parts = [];
    const unitType = u.unitType || info.type;
    if (unitType && unitType !== '—') parts.push(unitType);
    const yearBuilt = u.yearBuilt || info.built;
    if (yearBuilt) parts.push(`Built ${yearBuilt}`);
    if (!parts.length) return '';
    return parts.map(p => escapeHtml(p)).join(' · ');
}

function flatDetailSpecSection(propertyId, u) {
    const { primary, secondary } = flatDetailSpecItems(u);
    const primaryChips = flatDetailSpecChips(u, primary);
    const secondaryChips = flatDetailSpecChips(u, secondary);
    const extra = flatDetailExtraLine(propertyId, u);
    if (!primaryChips && !secondaryChips && !extra) return '';
    return `
    <div class="flat-dt-spec-stack">
        ${primaryChips ? `<div class="flat-dt-spec-line">${primaryChips}</div>` : ''}
        ${secondaryChips ? `<div class="flat-dt-spec-line flat-dt-spec-line--secondary">${secondaryChips}</div>` : ''}
        ${extra}
    </div>`;
}

function flatDetailExtraLine(propertyId, u) {
    const meta = flatDetailBuildingMeta(propertyId, u);
    if (!meta) return '';
    return `<p class="flat-dt-extra-line flat-dt-building-meta-line">${meta}</p>`;
}

function flatDetailActivityEvents(propertyId, unit) {
    const events = [];
    invoicesForUnit(propertyId, unit).forEach(inv => {
        if (inv.status !== 'Paid') return;
        events.push({
            icon: 'pound-sterling',
            iconBg: '#DCFCE7', iconColor: '#16A34A',
            title: 'Payment',
            desc: `Rent payment received · ${inv.amount} for ${inv.month || inv.due}`,
            date: inv.due || inv.month || '—',
            badge: 'Paid', badgeBg: '#DCFCE7', badgeColor: '#16A34A',
            go: 'invoice-detail', attrs: `data-iid="${inv.id}"`,
            sort: inv.uploadedAt || 0,
        });
    });
    AppStore.docsForProperty(propertyId)
        .filter(d => d.unit === unit)
        .forEach(doc => {
            const signed = doc.signed || /signed|agreement/i.test(doc.name || '');
            events.push({
                icon: 'file-text',
                iconBg: '#EFF6FF', iconColor: '#2563EB',
                title: 'Document',
                desc: `Document uploaded · ${doc.name}`,
                date: doc.date || 'Recent',
                badge: signed ? 'Signed' : 'Uploaded',
                badgeBg: signed ? '#DCFCE7' : '#EFF6FF',
                badgeColor: signed ? '#16A34A' : '#2563EB',
                go: 'document-preview', attrs: `data-doc="${doc.id}"`,
                sort: doc.uploadedAt || 0,
            });
        });
    return events;
}

function flatDetailActivityListHtml(propertyId, unit, maxItems = 4, opts = {}) {
    let items = flatDetailActivityEvents(propertyId, unit);
    if (opts.excludeMaintenance) items = items.filter(ev => ev.icon !== 'wrench');
    items = items.sort((a, b) => (b.sort || 0) - (a.sort || 0)).slice(0, maxItems);
    if (!items.length) return '';
    return `
    <div class="flat-dt-activity-list">
        ${items.map(ev => `
        <button type="button" data-go="${ev.go}" ${ev.attrs} class="flat-dt-activity-row w-full text-left">
            <span class="flat-dt-activity-icon" style="background:${ev.iconBg};color:${ev.iconColor}"><i data-lucide="${ev.icon}" class="w-4 h-4"></i></span>
            <span class="flat-dt-activity-body">
                <span class="flat-dt-activity-title">${escapeHtml(ev.title)}</span>
                <span class="flat-dt-activity-desc">${escapeHtml(ev.desc)}</span>
                <span class="flat-dt-activity-date">${escapeHtml(ev.date)}</span>
            </span>
            <span class="flat-dt-activity-badge" style="background:${ev.badgeBg};color:${ev.badgeColor}">${escapeHtml(ev.badge)}</span>
        </button>`).join('')}
    </div>`;
}

function flatDetailRecentActivity(propertyId, unit, opts = {}) {
    const maxItems = opts.maxItems ?? 4;
    const listHtml = flatDetailActivityListHtml(propertyId, unit, maxItems);
    if (opts.compact) return listHtml;
    return `
    <section class="card flat-dt-activity">
        <div class="flat-dt-activity-head">
            <h2 class="flat-dt-section-title">Recent Activity</h2>
        </div>
        ${listHtml}
    </section>`;
}

function unitUtilitySummary(propertyId, unit) {
    const util = getUnitUtilityMeta(propertyId, unit);
    const meterCount = ['electricity', 'gas', 'water'].filter(k => (util.meters?.[k] || '').trim()).length;
    const customCount = (util.customUtilities || []).filter(c => (c.name || '').trim()).length;
    const billCount = (util.uploads || []).length;
    return { util, meterCount, customCount, billCount, setupCount: meterCount + customCount };
}

function flatQuickActionMeta(propertyId, unit) {
    const stats = unitRentStats(propertyId, unit);
    const { setupCount, billCount } = unitUtilitySummary(propertyId, unit);
    const unitDocs = sortPropertyDocuments(AppStore.docsForProperty(propertyId).filter(d => d.unit === unit));
    return {
        pay: stats.outstanding ? `£${stats.outstanding.toLocaleString()} due` : 'Up to date',
        records: unitDocs.length ? `${unitDocs.length} file${unitDocs.length === 1 ? '' : 's'}` : 'Open',
        utilities: billCount ? `${billCount} bill${billCount === 1 ? '' : 's'} on file` : setupCount ? `${setupCount} meter${setupCount === 1 ? '' : 's'} set` : 'Set up meters',
    };
}

function memberRentOverview(propertyId, unit, member, tenancy) {
    const invs = invoicesForUnit(propertyId, unit).filter(i => i.type === 'rent' || !i.type);
    let inv = invs.find(i => i.tenantId === member.listId || i.tenantId === member.tenantId);
    if (!inv) inv = invs.find(i => i.tenant === member.name);
    if (!inv && member.isLead) inv = invs.find(i => i.status !== 'Paid') || invs[0];
    const rentAmt = flatEffectiveRentAmount(getUnitByName(propertyId, unit), tenancy);
    const rosterCount = getFlatMemberRoster(propertyId, unit).count || 1;
    const amount = inv?.amount || (rentAmt && rosterCount > 1
        ? formatRentAmount(Math.round(rentAmt / rosterCount))
        : rentAmt ? formatRentAmount(rentAmt) : '—');
    let payLabel = '—';
    let payTone = 'muted';
    if (inv) {
        if (inv.status === 'Paid') { payLabel = 'Paid'; payTone = 'paid'; }
        else if (inv.status === 'Overdue') { payLabel = 'Overdue'; payTone = 'overdue'; }
        else { payLabel = 'Pending'; payTone = 'pending'; }
    }
    return { amount, payLabel, payTone };
}

function flatDetailQuickLinks(propertyId, unit) {
    const meta = flatQuickActionMeta(propertyId, unit);
    const links = [
        { icon: 'banknote', tone: 'pay', title: 'Payments', sub: meta.pay, ftab: 'payments' },
        { icon: 'droplets', tone: 'util', title: 'Utilities', sub: meta.utilities, go: 'unit-utilities', attrs: `data-pid="${propertyId}" data-unit="${unit}"` },
        { icon: 'folder-open', tone: 'docs', title: 'Records', sub: meta.records, ftab: 'records' },
    ];
    return `
    <section class="card flat-dt-quicklinks flat-dt-quicklinks--overview">
        <h3 class="flat-dt-block-title flat-dt-quicklinks-title">Quick access</h3>
        <div class="flat-dt-quicklinks-row">
            ${links.map(l => `
            <button type="button" ${l.ftab ? `data-ftab="${l.ftab}"` : `data-go="${l.go}" ${l.attrs}`} class="flat-dt-quicklink-tile">
                <span class="flat-dt-grid-icon flat-dt-grid-icon--${l.tone}"><i data-lucide="${l.icon}" class="w-[16px] h-[16px]"></i></span>
                <span class="flat-dt-quicklink-copy">
                    <span class="flat-dt-quicklink-title">${l.title}</span>
                    <span class="flat-dt-quicklink-sub">${l.sub}</span>
                </span>
            </button>`).join('')}
        </div>
    </section>`;
}

function flatDetailTabBadges(propertyId, unit, pendingInvite) {
    const overdue = invoicesForUnit(propertyId, unit).some(i => i.status === 'Overdue');
    return {
        tenant: pendingInvite ? '!' : '',
        payments: overdue ? '!' : '',
    };
}

function renderFlatDetailTabNav(activeTab, badges = {}) {
    const tabs = [
        ['overview', 'Overview', 'layout-grid'],
        ['tenant', 'Tenant', 'users'],
        ['payments', 'Payments', 'pound-sterling'],
        ['gallery', 'Gallery', 'images'],
    ];
    const knownTab = tabs.some(([t]) => t === activeTab);
    return `
    <div class="flat-dt-tabs" role="tablist" aria-label="Unit sections">
        ${tabs.map(([tab, label, icon]) => {
            const active = knownTab && activeTab === tab;
            const badge = badges[tab];
            return `
        <button type="button" data-ftab="${tab}" role="tab" aria-selected="${active}" class="flat-dt-tab ${active ? 'flat-dt-tab--active' : ''}">
            <span class="flat-dt-tab-icon"><i data-lucide="${icon}" class="w-[18px] h-[18px]"></i></span>
            <span class="flat-dt-tab-label-wrap">
                <span class="flat-dt-tab-label">${label}</span>
                ${active ? '<span class="flat-dt-tab-indicator" aria-hidden="true"></span>' : ''}
                ${badge ? `<span class="flat-dt-tab-badge">${badge}</span>` : ''}
            </span>
        </button>`;
        }).join('')}
    </div>`;
}

function renderFlatRecordsSubnav() {
    return `
    <div class="flat-dt-records-subnav">
        <button type="button" data-ftab="overview" class="flat-dt-records-back">
            <i data-lucide="chevron-left" class="w-4 h-4"></i>Overview
        </button>
        <span class="flat-dt-records-subnav-title">Unit records</span>
    </div>`;
}

function renderFlatOverviewStatsRow(u, tenancy, memberCount) {
    const rentAmt = flatEffectiveRentAmount(u, tenancy);
    const rentLabel = rentAmt ? formatRentAmount(rentAmt) : '—';
    const stats = [
        { label: 'Monthly Rent', value: rentLabel, tone: 'rent' },
        { label: 'Tenants', value: String(memberCount || 0) },
        { label: 'Beds', value: u.beds ? String(u.beds) : '—' },
        { label: 'Baths', value: u.baths ? String(u.baths) : '—' },
        { label: 'Area', value: u.sqft ? `${u.sqft} ft²` : '—' },
    ];
    return `
    <div class="flat-overview-stats">
        ${stats.map(s => `
        <div class="flat-overview-stat">
            <span class="flat-overview-stat-label">${s.label}</span>
            <span class="flat-overview-stat-val${s.tone === 'rent' ? ' flat-overview-stat-val--rent' : ''}">${escapeHtml(s.value)}</span>
        </div>`).join('')}
    </div>`;
}

function renderFlatOverviewTenantsList(propertyId, unit, ctx) {
    const { members, count, tenancy, pendingInvite } = ctx;
    if (!count && !pendingInvite) return '';
    const rows = members.map((m, i) => {
        const profileId = m.listId ?? m.tenantId;
        const action = profileId != null
            ? `data-go="tenant-detail" data-tid="${profileId}"`
            : m.inviteToken
                ? `data-go="tenant-invite-sent" data-invite-token="${m.inviteToken}"`
                : `data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}"`;
        return `
        <button type="button" ${action} class="flat-overview-tenant-row w-full text-left${i < members.length - 1 ? ' flat-overview-tenant-row--border' : ''}">
            ${renderMemberAvatar(m, 'sm')}
            <span class="flat-overview-tenant-body min-w-0 flex-1">
                <span class="flat-overview-tenant-name">${escapeHtml(m.name)}</span>
            </span>
            <i data-lucide="chevron-right" class="flat-overview-tenant-chevron w-4 h-4"></i>
        </button>`;
    }).join('');
    const totalLabel = count > 1 ? `Tenants · ${count}` : 'Tenant';
    return `
    <section class="card flat-overview-tenants">
        <div class="flat-overview-tenants-head">
            <h3 class="flat-dt-block-title">${totalLabel}</h3>
            <button type="button" data-ftab="tenant" class="flat-dt-activity-link">View all</button>
        </div>
        <div class="flat-overview-tenants-list">${rows}</div>
    </section>`;
}

function renderFlatDetailOverviewCard(propertyId, unit, u, p, tenancy, coverPhoto, photoCount, statusLabel, statusBg, statusColor) {
    return `
    <div class="card flat-dt-overview-card flat-dt-overview-card--hero">
        <button type="button" data-ftab="gallery" class="flat-dt-overview-photo w-full text-left" aria-label="Open gallery">
            <img src="${coverPhoto}" alt="" class="flat-dt-overview-photo-img">
            ${photoCount > 1 ? `<span class="flat-dt-carousel-badge">${photoCount} photos</span>` : ''}
        </button>
        <div class="flat-dt-overview-body">
            ${flatDetailSpecSection(propertyId, u)}
            ${flatDetailFinanceRow(u, tenancy)}
        </div>
    </div>`;
}

function renderFlatDetailOverviewRecent(propertyId, unit) {
    const listHtml = flatDetailActivityListHtml(propertyId, unit, 3);
    if (!listHtml) return '';
    return `
        <section class="card flat-dt-activity flat-dt-activity--compact">
            <div class="flat-dt-activity-head">
                <h3 class="flat-dt-block-title">Unit activity</h3>
                <button type="button" data-ftab="records" class="flat-dt-activity-link">Unit records</button>
            </div>
            ${listHtml}
        </section>`;
}

function renderFlatDetailOverviewTab(propertyId, unit, u, p, tenancy, members, coverPhoto, photoCount, statusLabel, statusBg, statusColor) {
    const roster = getFlatMemberRoster(propertyId, unit);
    const peopleCtx = { occ: u.status === 'occupied', tenancy, members: roster.members, count: roster.count, pendingInvite: pendingInvitesForProperty(propertyId).find(i => i.unit === unit) };
    return `
    <div class="flat-dt-tab-panel flat-dt-tab-panel--overview">
        ${renderFlatDetailOverviewCard(propertyId, unit, u, p, tenancy, coverPhoto, photoCount, statusLabel, statusBg, statusColor)}
        ${flatDetailQuickLinks(propertyId, unit)}
        ${renderFlatOverviewTenantsList(propertyId, unit, peopleCtx)}
    </div>`;
}

function renderFlatDetailActivityTab(propertyId, unit) {
    const listHtml = flatDetailActivityListHtml(propertyId, unit, 8);
    return `
    <div class="flat-dt-tab-panel flat-dt-tab-panel--activity">
        ${listHtml ? `
        <section class="card flat-dt-activity flat-dt-activity--tab">
            <div class="flat-dt-activity-head">
                <h3 class="flat-dt-block-title">Recent activity</h3>
            </div>
            ${listHtml}
        </section>` : `
        <div class="card flat-dt-empty p-8 text-center">
            <i data-lucide="activity" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[13px] font-semibold mt-3 text-[#0F172A]">No activity yet</p>
            <p class="text-[12px] text-[#64748B] mt-1">Rent, maintenance and inspections for this unit appear here.</p>
        </div>`}
    </div>`;
}

function getFlatPrimaryTenantContact(ctx) {
    const { members, tenancy } = ctx || {};
    if (!members?.length) return null;
    const lead = members.find(m => m.isLead)
        || members.find(m => m.listId != null && TENANT_LIST[m.listId]?.status === 'active')
        || members.find(m => m.accountStatus === 'active')
        || members[0];
    const listId = lead?.listId ?? lead?.tenantId;
    const listItem = listId != null ? TENANT_LIST[listId] : null;
    return { lead, listItem, listId, chatId: listItem?.chatId ?? null };
}

function renderFlatUnitDocumentsSection(propertyId, unit, opts = {}) {
    const docs = sortPropertyDocuments(AppStore.docsForProperty(propertyId).filter(d => d.unit === unit));
    const list = opts.full ? docs : docs.slice(0, 4);
    const compact = !!opts.compact;
    return `
    <section class="card flat-dt-docs${compact ? ' flat-dt-docs--compact' : ''}">
        <div class="flat-dt-section-head">
            <h3 class="flat-dt-section-title">Documents</h3>
            <button type="button" data-action="open-flat-document-upload" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-section-link">Upload</button>
        </div>
        ${list.length ? `
        <div class="flat-dt-docs-list">
            ${list.map(doc => `
            <button type="button" data-go="document-preview" data-doc="${doc.id}" class="flat-dt-docs-row w-full text-left">
                <span class="flat-dt-docs-icon"><i data-lucide="file-text" class="w-4 h-4"></i></span>
                <span class="flat-dt-docs-name">${escapeHtml(doc.name)}${doc.date ? ` · ${escapeHtml(doc.date)}` : ''}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>`).join('')}
        </div>
        ${!opts.full && docs.length > 4 ? `<button type="button" data-ftab="records" class="flat-dt-docs-more">View all ${docs.length}</button>` : ''}` : `<p class="flat-dt-docs-empty">${compact ? 'No files yet' : 'No documents — tap Upload'}</p>`}
    </section>`;
}

function renderFlatTenantIdentitySection(propertyId, unit) {
    const { members } = getFlatMemberRoster(propertyId, unit);
    const lead = members.find(m => m.isLead) || members.find(m => m.listId != null) || members[0];
    const tid = lead?.listId ?? lead?.tenantId;
    const t = tid != null ? TENANTS[tid] : null;
    if (!t) return '';
    const hasNid = !!(t.idNumber || t.nidProof || (typeof getTenantNidProof === 'function' && getTenantNidProof(tid)));
    if (!hasNid) return '';
    const nidDoc = typeof getTenantNidProof === 'function' ? getTenantNidProof(tid) : t.nidProof;
    return `
    <section class="card flat-records-tenant">
        <div class="flat-dt-section-head">
            <h3 class="flat-dt-section-title">Tenant ID</h3>
            <button type="button" data-go="tenant-detail" data-tid="${tid}" data-tenant-tab="personal" class="flat-dt-section-link">View</button>
        </div>
        <div class="flat-records-tenant-rows">
            ${t.idNumber ? `<div class="flat-records-kv"><span class="flat-records-k">NID</span><span class="flat-records-v">${escapeHtml(t.idNumber)}</span></div>` : ''}
            ${nidDoc ? `
            <button type="button" data-go="document-preview" data-preview-source="tenant-nid" data-tid="${tid}" class="flat-dt-docs-row w-full text-left">
                <span class="flat-dt-docs-icon"><i data-lucide="id-card" class="w-4 h-4"></i></span>
                <span class="flat-dt-docs-name">${escapeHtml(typeof nidDoc === 'string' ? nidDoc : 'NID proof')}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
        </div>
    </section>`;
}

function renderFlatDetailRecordsTab(propertyId, unit, p) {
    const issues = propertyComplianceCertRows(propertyId).filter(r => r.st.tone !== 'ok').length;
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(propertyId).length : 0;
    const utilDocs = unitUtilitySummary(propertyId, unit).billCount;
    const photoCount = flatDetailPhotoList(propertyId, unit).length;
    const navRow = (icon, label, attrs) => `
        <button type="button" ${attrs} class="flat-records-nav-row w-full text-left">
            <span class="flat-records-nav-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
            <span class="flat-records-nav-label">${label}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
        </button>`;
    return `
    <div class="flat-dt-tab-panel flat-dt-tab-panel--records">
        ${renderFlatUnitDocumentsSection(propertyId, unit, { full: true })}
        ${renderFlatTenantIdentitySection(propertyId, unit)}
        <section class="card flat-records-nav-list">
            ${navRow('droplets', `Utilities${utilDocs ? ` · ${utilDocs} bill${utilDocs === 1 ? '' : 's'}` : ''}`, `data-go="unit-utilities" data-pid="${propertyId}" data-unit="${unit}"`)}
            ${navRow('images', `Unit photos · ${photoCount}`, `data-ftab="gallery"`)}
        </section>
        <section class="flat-records-building-block">
            <p class="flat-section-eyebrow">Building</p>
            <div class="card flat-records-nav-list">
                ${navRow('shield-check', `Certificates${issues ? ` · ${issues} need attention` : ''}`, `data-go="property-detail" data-pid="${propertyId}" data-tab="records" data-records-view="compliance"`)}
                ${navRow('clipboard-list', `Inspections & inventory${rooms ? ` · ${rooms} rooms` : ''}`, `data-go="property-detail" data-pid="${propertyId}" data-tab="records"`)}
                ${navRow('folder-open', 'Property files', `data-go="property-detail" data-pid="${propertyId}" data-tab="records" data-records-view="documents"`)}
            </div>
        </section>
    </div>`;
}

function renderFlatDetailTenantTab(propertyId, unit, ctx) {
    return `
    <div class="flat-dt-tab-panel flat-dt-tab-panel--tenant">
        ${renderFlatPeopleSection(propertyId, unit, ctx)}
    </div>`;
}

function renderFlatDepositContext(propertyId, unit) {
    const { tenancy } = getFlatMemberRoster(propertyId, unit);
    if (!tenancy) return '';
    const depStatus = resolveDepositStatus(tenancy.depositScheme, tenancy.protectionRef);
    const schemeLine = depositSchemeSummaryLine(tenancy.depositScheme, tenancy.protectionRef);
    const rows = [
        ['Deposit held', tenancy.deposit || '—'],
        tenancy.advancePaid && tenancy.advancePaid !== tenancy.deposit ? ['Advance paid', tenancy.advancePaid] : null,
        ['Protection', depStatus],
        schemeLine !== '—' ? ['Scheme', schemeLine] : null,
    ].filter(Boolean);
    if (!rows.length) return '';
    return `
    <section class="card flat-pay-deposit">
        <div class="flat-dt-section-head">
            <h3 class="flat-dt-section-title">Deposit & scheme</h3>
            <button type="button" data-go="edit-tenancy-deposit" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-section-link">Edit scheme</button>
        </div>
        <div class="flat-pay-deposit-rows">
            ${rows.map(([label, value]) => `
            <div class="flat-pay-deposit-row${label === 'Protection' ? ' flat-pay-deposit-row--status' : ''}">
                <span class="flat-pay-deposit-label">${escapeHtml(label)}</span>
                ${label === 'Protection'
                    ? renderDepositStatusBadge(value, tenancy.depositScheme)
                    : `<span class="flat-pay-deposit-value">${escapeHtml(value)}</span>`}
            </div>`).join('')}
        </div>
    </section>`;
}

function renderFlatDetailPaymentsTab(propertyId, unit) {
    const stats = unitRentStats(propertyId, unit);
    const unpaid = stats.unpaid;
    const hasOverdue = unpaid.some(i => i.status === 'Overdue');
    const history = renderUnitRentHistory(propertyId, unit);
    const depositBlock = renderFlatDepositContext(propertyId, unit);
    return `
    <div class="flat-dt-tab-panel flat-dt-payments-v2">
        ${depositBlock}
        ${stats.outstanding || stats.collected ? `
        <div class="flat-pay-summary card${hasOverdue ? ' flat-pay-summary--overdue' : stats.collected && !hasOverdue ? ' flat-pay-summary--ok' : ''}">
            <p class="flat-pay-summary-label">${hasOverdue ? 'Overdue' : stats.outstanding ? 'Outstanding' : 'This month'}</p>
            <p class="flat-pay-summary-amount">${hasOverdue || stats.outstanding ? `£${(stats.outstanding || 0).toLocaleString()}` : `£${stats.collected.toLocaleString()} collected`}</p>
            <p class="flat-pay-summary-hint">${unpaid.length ? `${unpaid.length} unpaid bill${unpaid.length === 1 ? '' : 's'}` : 'Rent up to date'}</p>
            ${unpaid.length ? `<button type="button" data-go="mark-rent-received"${unpaid.length === 1 ? ` data-iid="${unpaid[0].id}"` : ''} class="flat-pay-summary-btn">Record payment</button>` : ''}
        </div>` : `
        <div class="card flat-dt-empty p-6 text-center">
            <i data-lucide="banknote" class="w-8 h-8 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[13px] font-semibold mt-2 text-[#0F172A]">No payments yet</p>
            <p class="text-[12px] text-[#64748B] mt-1">Rent and bills for this unit appear here.</p>
        </div>`}
        ${history ? `<p class="flat-section-eyebrow flat-dt-eyebrow-inset">Transaction history</p>${history}` : ''}
    </div>`;
}

function renderFlatBuildingPhotosSection(propertyId, opts = {}) {
    const meta = AppStore.meta(propertyId);
    const photos = meta.photos?.length ? meta.photos : [IMG.props[propertyId] || IMG.fallback];
    if (opts.variant === 'card') {
        return `
        <section class="card flat-dt-building-photos">
            <div class="flat-dt-building-head">
                <h3 class="flat-dt-building-title">Building photos</h3>
                <span class="flat-dt-building-count">${photos.length}</span>
            </div>
            <p class="flat-dt-building-desc">Shared photos for the whole property — not just this unit.</p>
            <div class="flat-dt-building-grid">
                ${photos.slice(0, 3).map(src => `<div class="flat-dt-building-thumb"><img src="${src}" alt=""></div>`).join('')}
            </div>
            <button type="button" data-go="property-photos" data-pid="${propertyId}" class="flat-dt-building-link-btn">
                <i data-lucide="building-2" class="w-4 h-4"></i>View all building photos
            </button>
        </section>`;
    }
    return `
    <button type="button" data-go="property-photos" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px] mt-3 flat-dt-building-link">
        <i data-lucide="building-2" class="w-4 h-4 inline align-[-2px] mr-1"></i>View building photos (${photos.length})
    </button>`;
}

function renderFlatDetailGalleryTab(propertyId, unit) {
    ensureFlatPhotos(propertyId);
    const gal = getFlatPhotoGallery(propertyId, unit);
    const photos = gal?.photos?.length ? gal.photos : [getFlatCoverPhoto(propertyId, unit)];
    const cover = gal?.cover ?? 0;
    return `
    <div class="flat-dt-tab-panel flat-dt-gallery-panel">
        ${renderFlatUnitPhotoPicker(photos, cover, {
            variant: 'gallery',
            coverAction: 'set-flat-cover',
            removeAction: 'remove-flat-photo',
            uploadAction: 'upload-flat-photo',
            uploadLabel: photos.length ? 'Add more photos' : 'Add unit photos',
            hint: 'Tap the star on a thumbnail to set the cover for Overview and unit lists.',
        })}
        ${renderFlatBuildingPhotosSection(propertyId)}
    </div>`;
}

function renderFlatDetailTabContent(tab, propertyId, unit, u, p, tenancy, members, ctx, coverPhoto, photoCount, statusLabel, statusBg, statusColor) {
    switch (tab) {
        case 'tenant': return renderFlatDetailTenantTab(propertyId, unit, ctx);
        case 'payments': return renderFlatDetailPaymentsTab(propertyId, unit);
        case 'gallery': return renderFlatDetailGalleryTab(propertyId, unit);
        case 'records': return renderFlatDetailRecordsTab(propertyId, unit, p);
        case 'activity': return renderFlatDetailActivityTab(propertyId, unit);
        default: return renderFlatDetailOverviewTab(propertyId, unit, u, p, tenancy, members, coverPhoto, photoCount, statusLabel, statusBg, statusColor);
    }
}

function screenFlatDetail() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const u = getUnitByName(propertyId, unit);
    if (!u) return `${topBar('Unit', { back: true })}<div class="screen-content"><p class="ux-intro">Unit not found.</p></div>`;
    const photos = flatDetailPhotoList(propertyId, unit);
    const coverPhoto = getFlatCoverPhoto(propertyId, unit);
    const photoCount = photos.length;
    const occ = u.status === 'occupied';
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unit);
    const pendingInvite = pendingInvitesForProperty(propertyId).find(i => i.unit === unit);
    const statusLabel = occ ? 'Occupied' : 'Vacant';
    const statusBg = occ ? '#DCFCE7' : '#FEF3C7';
    const statusColor = occ ? '#16A34A' : '#D97706';
    const unitMenuKey = actionMenuKeyFor('unit', propertyId, unit);
    const unitMenuOpen = isActionMenuOpen(unitMenuKey);
    const name = unitName(u);
    const flatTab = (STATE.flatTab === 'activity' ? 'overview' : STATE.flatTab) || 'overview';
    const tabBadges = flatDetailTabBadges(propertyId, unit, pendingInvite);
    const peopleCtx = { occ, tenancy, members, count, pendingInvite };
    const rentAlert = renderFlatRentAlert(propertyId, unit);
    const unpaid = invoicesForUnit(propertyId, unit).filter(i => i.status !== 'Paid');
    const overviewFooter = flatTab === 'overview' ? `
        <footer class="flat-dt-footer flat-dt-footer--actions">
            <button type="button" data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-action-btn flat-dt-action-btn--primary">
                <i data-lucide="user-plus"></i><span>Add Tenant</span>
            </button>
            <button type="button" data-go="mark-rent-received"${unpaid.length === 1 ? ` data-iid="${unpaid[0].id}"` : ''} class="flat-dt-action-btn flat-dt-action-btn--outline">
                <i data-lucide="circle-check"></i><span>Record Payment</span>
            </button>
        </footer>` : `
        <footer class="flat-dt-footer">
            <button type="button" data-go="edit-flat" data-pid="${propertyId}" data-unit="${unit}" class="flat-dt-edit-btn">
                <i data-lucide="pencil" class="w-4 h-4"></i>Edit Unit Details
            </button>
        </footer>`;
    return `
    <div class="flat-detail-page flat-detail-page--v2 flat-detail-page--tabs screen-enter">
        <header class="flat-dt-header">
            <button type="button" data-action="back" class="flat-dt-header-back" aria-label="Back"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            <div class="flat-dt-header-main">
                <h1 class="flat-dt-header-title">${escapeHtml(name)}</h1>
                <div class="flat-dt-header-meta">
                    <span class="flat-dt-header-property">${escapeHtml(p.name)}</span>
                    <span class="flat-dt-header-dot" aria-hidden="true">·</span>
                    <span class="flat-dt-header-status" style="color:${statusColor}">${statusLabel}</span>
                </div>
            </div>
            <div class="flat-dt-header-menu${unitMenuOpen ? ' flat-dt-header-menu--open' : ''}">
                ${renderActionMenuButton(unitMenuKey, 'Unit options')}
                ${renderActionMenuPopover(unitMenuKey, unitActionMenuItems(propertyId, unit, { fromDetail: true }))}
            </div>
        </header>
        ${renderFlatDetailTabNav(flatTab, tabBadges)}
        ${flatTab === 'records' ? renderFlatRecordsSubnav() : ''}
        <div class="flat-dt-scroll flat-dt-scroll--tabbed screen-content screen-content-sm${flatTab === 'overview' ? ' flat-dt-scroll--overview' : ''}${flatTab === 'records' ? ' flat-dt-scroll--records' : ''}">
            ${rentAlert ? `<div class="flat-dt-inline-alert">${rentAlert}</div>` : ''}
            ${renderFlatDetailTabContent(flatTab, propertyId, unit, u, p, tenancy, members, peopleCtx, coverPhoto, photoCount, statusLabel, statusBg, statusColor)}
        </div>
        ${overviewFooter}
    </div>`;
}

function propertyTenantEntries(propertyId) {
    const entries = [];
    const seen = new Set();
    const push = (key, entry) => {
        if (!key || seen.has(key)) return;
        seen.add(key);
        entries.push(entry);
    };

    TENANT_LIST.filter(t => t.propertyId === propertyId && (t.status === 'active' || t.status === 'pending'))
        .forEach(t => push(`${t.unit}:${t.name}`, { kind: 'tenant', tenant: t }));

    getPropertyUnits(propertyId).forEach(u => {
        const unit = unitName(u);
        const { members } = getFlatMemberRoster(propertyId, unit);
        members.forEach(m => {
            if (m.listId != null && TENANT_LIST[m.listId]) return;
            // Lease-only names (no invite, no account) stay on the unit members screen — not here.
            if (m.accountStatus === 'no-account') return;
            push(`${unit}:${m.name}`, { kind: 'member', member: m, unit });
        });
    });

    pendingInvitesForProperty(propertyId).forEach(inv => {
        const name = `${inv.firstName} ${inv.lastName}`.trim();
        const alreadyListed = TENANT_LIST.some(t =>
            t.propertyId === propertyId && t.unit === inv.unit && t.name === name
        );
        if (alreadyListed) return;
        push(`${inv.unit}:${name}`, { kind: 'invite', invite: inv });
    });

    const order = { active: 0, pending: 1, 'no-account': 2 };
    entries.sort((a, b) => {
        const statusA = a.kind === 'tenant' ? a.tenant.status : a.kind === 'member' ? a.member.accountStatus : 'pending';
        const statusB = b.kind === 'tenant' ? b.tenant.status : b.kind === 'member' ? b.member.accountStatus : 'pending';
        return (order[statusA] ?? 9) - (order[statusB] ?? 9);
    });
    return entries;
}

function renderPropertyMemberRow(propertyId, unit, member, opts = {}) {
    const compact = !!opts.compact;
    const [bg, color] = memberAccountStyle(member.accountStatus);
    const roleMeta = member.isLead ? 'Lead tenant' : 'Group member';
    const detailLine = compact
        ? `${unit} · ${roleMeta}${member.accountStatus === 'pending' ? ' · invite sent' : ''}`
        : unit;
    const attrs = member.listId != null && TENANT_LIST[member.listId]?.status === 'active'
        ? `data-go="tenant-detail" data-tid="${member.listId}"`
        : member.inviteToken
            ? `data-go="tenant-invite-sent" data-invite-token="${member.inviteToken}"`
            : `data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}"`;
    const showStatusPill = !compact || member.accountStatus !== 'active';
    const statusLabel = member.accountStatus === 'active' ? 'Active' : member.accountStatus === 'pending' ? 'Pending' : 'No account';
    return `
    <button type="button" ${attrs} class="tenant-row card w-full text-left${compact ? ' tenant-row--compact' : ''}">
        ${renderMemberAvatar(member, compact ? 'sm' : 'md')}
        <div class="tenant-row-body">
            <div class="tenant-row-top">
                <p class="tenant-row-name">${member.name}</p>
                ${showStatusPill ? `<span class="tenant-status-pill" style="background:${bg};color:${color}">${statusLabel}</span>` : ''}
            </div>
            <p class="tenant-row-prop">${detailLine}</p>
            ${compact ? '' : `<p class="tenant-row-meta">${roleMeta}${member.accountStatus === 'pending' ? ' · invite sent' : ''}</p>`}
        </div>
        <i data-lucide="chevron-right" class="tenant-row-chevron w-5 h-5"></i>
    </button>`;
}

function renderPropertyInviteRow(invite, opts = {}) {
    const compact = !!opts.compact;
    const detailLine = compact && invite.rent ? `${invite.unit} · ${invite.rent}` : invite.unit;
    return `
    <button type="button" data-go="tenant-invite-sent" data-invite-token="${invite.token}" class="tenant-row card w-full text-left${compact ? ' tenant-row--compact' : ''}">
        <span class="person-avatar person-avatar--${compact ? 'sm' : 'md'}" style="background:#FEF3C7;color:#D97706" aria-hidden="true">${personInitials(`${invite.firstName} ${invite.lastName}`)}</span>
        <div class="tenant-row-body">
            <div class="tenant-row-top">
                <p class="tenant-row-name">${invite.firstName} ${invite.lastName}</p>
                <span class="tenant-status-pill" style="background:#FEF3C7;color:#D97706">Invite sent</span>
            </div>
            <p class="tenant-row-prop">${detailLine}</p>
            ${compact ? '' : `<p class="tenant-row-meta">${invite.rent || ''}</p>`}
        </div>
        <i data-lucide="chevron-right" class="tenant-row-chevron w-5 h-5"></i>
    </button>`;
}

function renderPropertyTenantTab(propertyId) {
    const pendingInvites = pendingInvitesForProperty(propertyId);
    const entries = propertyTenantEntries(propertyId);
    const activeCount = entries.filter(e => e.kind === 'tenant' && e.tenant.status === 'active').length
        + entries.filter(e => e.kind === 'member' && e.member.accountStatus === 'active').length;

    if (!entries.length) {
        return `
        <div class="screen-content screen-content-sm prop-hub-page">
            <div class="card p-8 text-center">
                <i data-lucide="users" class="w-12 h-12 text-[#CBD5E1] mx-auto"></i>
                <p class="text-[14px] font-semibold mt-3 text-[#0F172A]">No tenants yet</p>
                <p class="text-[12px] text-[#64748B] mt-1">Invite a tenant to a unit, or set up a group lease first.</p>
            </div>
            <button data-go="invite-tenant" data-pid="${propertyId}" class="btn-primary w-full py-3 text-[13px]">Invite a tenant</button>
            <button data-go="create-tenancy" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px] mt-2">Group lease or lease first</button>
        </div>`;
    }

    const rowOpts = { hideProperty: true, compact: true };
    const rows = entries.map(entry => {
        if (entry.kind === 'tenant' && typeof tenantListRow === 'function') {
            return tenantListRow(entry.tenant, rowOpts);
        }
        if (entry.kind === 'member') {
            return renderPropertyMemberRow(propertyId, entry.unit, entry.member, rowOpts);
        }
        return renderPropertyInviteRow(entry.invite, rowOpts);
    }).join('');

    return `
    <div class="screen-content screen-content-sm prop-hub-page prop-tenant-page">
        <div class="prop-tenant-bar">
            <p class="prop-tenant-bar-meta">${activeCount} active${pendingInvites.length ? ` · ${pendingInvites.length} pending` : ''}</p>
            <button type="button" data-go="invite-tenant" data-pid="${propertyId}" class="header-text-link">+ Invite</button>
        </div>
        <div class="prop-tenant-list">${rows}</div>
    </div>`;
}

function renderPropertyTimelineTab(propertyId) {
    const events = [];
    const p = PROPERTIES[propertyId];

    INVOICES.filter(i => i.propertyId === propertyId && i.status === 'Paid').forEach((i, idx) => {
        events.push({
            ic: 'banknote', bg: '#ECFDF5', color: '#059669',
            title: 'Rent paid',
            sub: `${i.tenant} · ${i.unit} · ${i.amount}`,
            go: 'invoice-detail', opts: { iid: i.id },
            sortAt: tenantActivitySortKey(i.paidOn || i.due) || (Date.now() - idx * 86400000),
        });
    });

    Object.entries(AppStore.complianceCerts || {}).forEach(([key, cert]) => {
        const [pid, cid] = key.split('-').map(Number);
        if (pid !== propertyId) return;
        const item = COMPLIANCE_ITEMS[cid];
        if (!item) return;
        const exp = cert.expiryDate
            ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(cert.expiryDate) : cert.expiryDate)
            : item[2];
        events.push({
            ic: 'shield-check', bg: '#EFF6FF', color: '#2563EB',
            title: 'Compliance certificate renewed',
            sub: `${item[1]} · valid until ${exp}`,
            go: 'renew-compliance', opts: { propertyId },
            sortAt: tenantActivitySortKey(cert.expiryDate) || 0,
        });
    });

    AppStore.tenancies.filter(t => t.propertyId === propertyId && t.status === 'active').forEach(t => {
        events.push({
            ic: 'user-plus', bg: '#FFFBEB', color: '#D97706',
            title: t.type === 'group' ? 'Group tenancy started' : 'Tenant moved in',
            sub: `${t.unit} · ${t.leadName || 'Tenant'}`,
            sortAt: tenantActivitySortKey(t.start),
        });
    });

    MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId).forEach((m, idx) => {
        events.push({
            ic: 'wrench', bg: '#EFF6FF', color: '#2563EB',
            title: m.status === 'done' ? 'Maintenance completed' : 'Maintenance logged',
            sub: `${m.issue} · ${m.unit || 'Building'} · ${m.time}`,
            go: 'maintenance-detail', opts: { mid: m.id },
            sortAt: Date.now() - idx * 3600000,
        });
    });

    AppStore.inspections.filter(i => i.propertyId === propertyId).forEach((i, idx) => {
        events.push({
            ic: 'clipboard-list', bg: '#FEF3C7', color: '#D97706',
            title: i.scheduled ? 'Inspection scheduled' : 'Inspection completed',
            sub: `${i.type || 'Inspection'} · ${typeof formatDisplayDate === 'function' ? formatDisplayDate(i.date) || i.date : i.date}`,
            go: 'inspection-detail', opts: { inspectionId: i.id },
            sortAt: tenantActivitySortKey(i.date) || (Date.now() - idx * 172800000),
        });
    });

    pendingInvitesForProperty(propertyId).forEach(inv => {
        events.push({
            ic: 'mail', bg: '#FEF3C7', color: '#D97706',
            title: 'Tenant invite sent',
            sub: `${inv.unit} · ${inv.firstName} ${inv.lastName}`,
            sortAt: tenantActivitySortKey(inv.sentAt) || 0,
        });
    });

    if (p?.name) {
        events.push({
            ic: 'building-2', bg: '#F1F5F9', color: '#64748B',
            title: 'Property added to portfolio',
            sub: p.name,
            sortAt: 0,
        });
    }

    events.sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));

    if (!events.length) {
        return `<div class="screen-content screen-content-sm"><div class="empty-state card"><i data-lucide="activity" class="w-12 h-12 text-[#CBD5E1]"></i><p class="empty-state-title">No activity yet</p><p class="empty-state-desc">Rent payments, maintenance, and compliance updates appear here.</p></div></div>`;
    }

    return `
    <div class="screen-content screen-content-sm">
        <div class="tenant-timeline">
            ${events.map(e => `
            <button type="button" ${e.go ? `data-go="${e.go}" ${e.opts?.propertyId != null ? `data-pid="${e.opts.propertyId}"` : ''} ${e.opts?.mid != null ? `data-mid="${e.opts.mid}"` : ''} ${e.opts?.iid != null ? `data-iid="${e.opts.iid}"` : ''} ${e.opts?.inspectionId != null ? `data-insp="${e.opts.inspectionId}"` : ''}` : ''} class="tenant-timeline-item w-full text-left ${e.go ? 'card-hover' : ''}">
                <div class="tenant-timeline-icon" style="background:${e.bg};color:${e.color}"><i data-lucide="${e.ic}" class="w-4 h-4"></i></div>
                <div class="tenant-timeline-body">
                    <p class="tenant-timeline-title">${e.title}</p>
                    <p class="tenant-timeline-sub">${e.sub}</p>
                </div>
                ${e.go ? '<i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>' : ''}
            </button>`).join('')}
        </div>
    </div>`;
}

function renderPropertyComplianceTab(propertyId) {
    const p = PROPERTIES[propertyId];
    const certKey = (cid) => `${propertyId}-${cid}`;
    const info = AppStore.meta(propertyId).info || {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const parseExpiry = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return Number.isNaN(d.getTime()) ? null : d;
    };
    const itemStatus = (cid, displayExp) => {
        if (!p?.compliance) return { bar: '#EF4444', label: 'Action needed' };
        const saved = AppStore.complianceCerts[certKey(cid)];
        const raw = saved?.expiryDate || displayExp;
        const exp = parseExpiry(raw);
        if (!exp) return { bar: '#22C55E', label: '' };
        if (exp < today) return { bar: '#EF4444', label: 'Expired' };
        const days = Math.ceil((exp - today) / 86400000);
        if (days <= 30) return { bar: '#F59E0B', label: `Expires in ${days}d` };
        return { bar: '#22C55E', label: '' };
    };
    const items = COMPLIANCE_ITEMS.map(([ic, n, exp], cid) => {
        const saved = AppStore.complianceCerts[certKey(cid)];
        const cfg = COMPLIANCE_ITEM_CONFIG[cid];
        const alarm = cfg?.alarmKey ? AppStore.meta(propertyId).alarms?.[cfg.alarmKey] : null;
        let displayExp = saved?.expiryDate
            ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(saved.expiryDate) : saved.expiryDate)
            : alarm?.expiry
                ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(alarm.expiry) : alarm.expiry)
                : exp;
        if (cid === 7 && info.epcExpiry) {
            displayExp = `${info.epc || 'EPC'} · Expires ${typeof formatDisplayDate === 'function' ? formatDisplayDate(info.epcExpiry) : info.epcExpiry}`;
        } else if (cid === 5 && info.insuranceExpiry) {
            displayExp = typeof formatDisplayDate === 'function' ? formatDisplayDate(info.insuranceExpiry) : info.insuranceExpiry;
        } else if (cid === 6 && info.mortgageRenewal) {
            displayExp = typeof formatDisplayDate === 'function' ? formatDisplayDate(info.mortgageRenewal) : info.mortgageRenewal;
        }
        const st = itemStatus(cid, saved?.expiryDate || alarm?.expiry);
        const renewBtn = cfg?.renewScreen
            ? `<button data-go="${cfg.renewScreen}" data-pid="${propertyId}" class="text-[11px] font-semibold text-[#2563EB]">Manage</button>`
            : `<button data-go="renew-compliance" data-pid="${propertyId}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>`;
        return { ic, n, displayExp, st, renewBtn };
    });
    return `
    <div class="screen-content screen-content-sm prop-hub-page">
        ${!p?.compliance ? `
        <div class="card p-4" style="background:#FEF2F2;border:1px solid #FECACA">
            <p class="text-[13px] font-semibold text-[#991B1B]">Compliance action needed</p>
            <p class="text-[12px] text-[#B91C1C] mt-1">This property is missing required certificates.</p>
        </div>` : ''}
        ${items.map(({ ic, n, displayExp, st, renewBtn }) => `
        <div class="card p-3.5 flex items-center gap-3">
            <div class="w-1 h-11 rounded-full shrink-0" style="background:${st.bar}"></div>
            <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
            <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold">${n}</p>
                <p class="text-[11px] text-[#64748B]">${displayExp}${st.label ? ` · ${st.label}` : ''}</p>
            </div>
            ${renewBtn}
        </div>`).join('')}
        <button type="button" data-go="certificate-assign" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px] mt-3">+ Assign certificate</button>
    </div>`;
}

function renderDocumentPreviewChips(parts) {
    const chips = (parts || []).filter(Boolean);
    if (!chips.length) return '';
    return `<div class="doc-preview-chips">${chips.map(p => `<span class="doc-preview-chip">${escapeHtml(String(p))}</span>`).join('')}</div>`;
}

function documentPreviewMetaParts(doc, metaFallback = '') {
    if (doc) {
        const typeLabel = doc.type === 'Custom Document' ? docFileKindLabel(doc) : (doc.type || 'Document');
        const parts = [typeLabel, formatDocDisplayDate(doc)];
        if (doc.propertyId != null && PROPERTIES[doc.propertyId]?.name) parts.push(PROPERTIES[doc.propertyId].name);
        if (doc.unit) parts.push(doc.unit);
        if (doc.shared) parts.push('Shared with tenant');
        return parts;
    }
    return String(metaFallback || '—').split(' · ').map(s => s.trim()).filter(Boolean);
}

function screenDocumentPreviewEnhanced() {
    let name = 'Document';
    let meta = '—';
    let docId = null;
    let doc = null;
    if (STATE.previewDocSource === 'tenant-nid') {
        const tid = STATE.tenantId ?? 0;
        const proof = getTenantNidProof(tid);
        if (proof) { name = proof.name; meta = proof.date; }
    } else if (STATE.previewDocSource === 'unit-util') {
        const util = getUnitUtilityMeta(STATE.propertyId, STATE.selectedUnit);
        const row = util.uploads?.[STATE.previewUtilDocIdx ?? 0];
        if (row) {
            name = row.name;
            meta = row.date || 'Uploaded';
            doc = { name: row.name, fileUrl: row.fileUrl, mime: row.mime, date: row.date };
        }
    } else if (STATE.previewDocSource === 'tenant') {
        const docs = getTenantDocuments(STATE.tenantId ?? 0);
        const row = docs[STATE.previewDocIdx ?? 0];
        if (row) { name = row[1]; meta = row[2]; }
    } else {
        doc = AppStore.documents.find(d => d.id === STATE.previewDocId);
        if (doc) {
            name = doc.name;
            meta = documentRowSubtitle(doc);
            docId = doc.id;
        }
    }
    const { icon, color, bg } = doc ? documentRowVisual(doc) : { icon: 'file-text', color: '#2563EB', bg: '#EFF6FF' };
    const chips = documentPreviewMetaParts(doc, meta);
    const fileKind = doc ? docFileKindLabel(doc) : (chips[0] || 'File');
    const previewBody = doc?.fileUrl && isDocImage(doc)
        ? `<img src="${doc.fileUrl}" alt="" class="doc-preview-image">`
        : doc?.fileUrl && (doc.mime?.includes('pdf') || String(doc.name).toLowerCase().endsWith('.pdf'))
            ? `<iframe src="${doc.fileUrl}" class="doc-preview-frame" title="PDF preview"></iframe>`
            : `<div class="doc-preview-empty">
                <div class="doc-preview-empty-icon" style="color:${color};background:${bg}">
                    <i data-lucide="${icon}" class="w-7 h-7"></i>
                </div>
                <p class="doc-preview-empty-title">Preview not available</p>
                <p class="doc-preview-empty-sub">${escapeHtml(fileKind)} file · Use Download to open on your device</p>
            </div>`;
    return `${topBar('Document', { back: true })}
    <div class="doc-preview-page screen-enter">
        <div class="screen-content doc-preview-content">
            <div class="doc-preview-hero card">
                <div class="doc-preview-hero-row">
                    <div class="doc-preview-icon-lg" style="color:${color};background:${bg}">
                        <i data-lucide="${icon}" class="w-7 h-7"></i>
                    </div>
                    <div class="doc-preview-hero-copy">
                        <h2 class="doc-preview-title">${escapeHtml(name)}</h2>
                        ${renderDocumentPreviewChips(chips)}
                    </div>
                </div>
            </div>
            <div class="doc-preview-viewer card">
                <p class="doc-preview-viewer-label">Preview</p>
                <div class="doc-preview-panel">${previewBody}</div>
            </div>
        </div>
        <div class="doc-preview-footer">
            <div class="doc-preview-actions">
                <button data-action="download-doc" class="btn-secondary doc-preview-action-btn">
                    <i data-lucide="download" class="w-4 h-4"></i><span>Download</span>
                </button>
                ${docId != null
                    ? `<button data-action="share-doc" data-doc="${docId}" class="btn-primary doc-preview-action-btn"><i data-lucide="share-2" class="w-4 h-4"></i><span>Share</span></button>`
                    : `<button type="button" data-action="back" class="btn-primary doc-preview-action-btn"><span>Done</span></button>`}
            </div>
            ${docId != null ? `
            <button type="button" data-action="delete-document" data-doc="${docId}" class="doc-preview-delete">
                <i data-lucide="trash-2" class="w-4 h-4"></i><span>Delete document</span>
            </button>` : ''}
        </div>
    </div>`;
}

function getUnreadNotifCount() {
    const list = typeof notificationsForRole === 'function' ? notificationsForRole() : NOTIFICATIONS;
    return (list || []).filter(n => n.unread).length;
}

function dashAttentionItems() {
    const items = [];
    const overdue = INVOICES.filter(i => i.status === 'Overdue');
    if (overdue.length) {
        const amt = overdue.reduce((s, i) => s + parseInt(String(i.amount).replace(/[^\d]/g, ''), 10), 0);
        items.push({
            icon: 'link-2', bg: '#FEE2E2', color: '#DC2626',
            title: `${overdue.length} overdue rent`,
            sub: `£${amt.toLocaleString()} to collect`,
            go: 'mark-rent-received',
        });
    }
    const tenantNeeds = (MAINTENANCE_ITEMS || []).filter(m =>
        typeof maintNeedsContractor === 'function' && maintNeedsContractor(m)
        && typeof isTenantMaintReport === 'function' && isTenantMaintReport(m));
    if (tenantNeeds.length) {
        const preview = tenantNeeds.slice(0, 2).map(m => m.issue).join(', ');
        items.push({
            icon: 'wrench', bg: '#FEF3C7', color: '#D97706',
            title: `${tenantNeeds.length} tenant report${tenantNeeds.length === 1 ? '' : 's'} need contractor`,
            sub: preview.length > 52 ? `${preview.slice(0, 49)}…` : preview,
            go: 'maintenance',
            maintSourceFilter: 'tenant',
        });
    }
    const unreadChats = (CONVERSATIONS || []).filter(c => c.unread > 0).length;
    if (unreadChats) {
        items.push({
            icon: 'message-square', bg: '#EFF6FF', color: '#2563EB',
            title: `${unreadChats} unread message${unreadChats === 1 ? '' : 's'}`,
            sub: 'Reply to tenants',
            go: 'messages',
        });
    }
    const compliantCount = PROPERTIES.filter(p => p.compliance).length;
    const compliancePct = PROPERTIES.length ? Math.round((compliantCount / PROPERTIES.length) * 100) : 100;
    if (compliancePct < 100 && items.length < 3) {
        items.push({
            icon: 'shield-alert', bg: '#FEF3C7', color: '#D97706',
            title: 'Compliance review',
            sub: `${compliantCount}/${PROPERTIES.length} properties compliant`,
            go: 'compliance-dashboard',
        });
    }
    return items.slice(0, 3);
}

function renderDashFinancialOverview(fin) {
    if (!fin) return '';
    const pct = fin.pct || 0;
    const r = 42;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;
    return `
    <button type="button" data-go="financial" class="card dash-fin-card w-full text-left">
        <h3 class="dash-fin-title">Financial Overview</h3>
        <div class="dash-fin-body">
            <div class="dash-fin-ring-wrap">
                <svg viewBox="0 0 100 100" class="dash-fin-ring-svg" aria-hidden="true">
                    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="10"/>
                    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#2563EB" stroke-width="10"
                        stroke-dasharray="${c}" stroke-dashoffset="${offset}"
                        stroke-linecap="round" transform="rotate(-90 50 50)"/>
                </svg>
                <div class="dash-fin-ring-label"><strong>${pct}%</strong><span>Collected</span></div>
            </div>
            <div class="dash-fin-lines">
                <div class="dash-fin-line"><span class="dash-fin-dot dash-fin-dot--paid"></span><span class="dash-fin-line-label">Paid</span><span class="dash-fin-line-val">£${fin.collected.toLocaleString()}</span></div>
                <div class="dash-fin-line"><span class="dash-fin-dot dash-fin-dot--pending"></span><span class="dash-fin-line-label">Pending</span><span class="dash-fin-line-val">£${fin.pending.toLocaleString()}</span></div>
                <div class="dash-fin-line"><span class="dash-fin-dot dash-fin-dot--overdue"></span><span class="dash-fin-line-label">Overdue</span><span class="dash-fin-line-val">£${fin.overdue.toLocaleString()}</span></div>
            </div>
        </div>
    </button>`;
}

function dashAttentionStrip() {
    const items = dashAttentionItems();
    if (!items.length) return '';
    return `
    <div class="dash-attention">
        <h3 class="screen-section-title dash-attention-heading">Needs attention</h3>
        ${items.map(item => `
        <button type="button" data-go="${item.go}"${item.maintSourceFilter ? ` data-maint-source-on-nav="${item.maintSourceFilter}"` : ''}${item.maintFilter ? ` data-maint-filter-on-nav="${item.maintFilter}"` : ''} class="dash-attention-row">
            <span class="dash-attention-icon" style="background:${item.bg};color:${item.color}"><i data-lucide="${item.icon}" class="w-5 h-5"></i></span>
            <span class="dash-attention-body">
                <span class="dash-attention-title">${item.title}</span>
                <span class="dash-attention-sub">${item.sub}</span>
            </span>
            <i data-lucide="chevron-right" class="w-5 h-5 dash-attention-chevron"></i>
        </button>`).join('')}
    </div>`;
}

function tenantListQuickActions(t) {
    if (t.status !== 'active') return '';
    const chatId = t.chatId ?? (typeof getTenantChatId === 'function' ? getTenantChatId(t.id) : null);
    const unpaid = typeof invoicesForTenant === 'function' ? invoicesForTenant(t.id).find(i => i.status !== 'Paid') : null;
    const msgAttrs = chatId != null
        ? `data-go="chat" data-chat="${chatId}"`
        : `data-action="start-tenant-chat" data-tid="${t.id}"`;
    const btns = [
        `<button type="button" data-action="call-tenant" data-tid="${t.id}" class="tenant-list-quick-btn"><i data-lucide="phone" class="w-3.5 h-3.5"></i>Call</button>`,
        `<button type="button" ${msgAttrs} class="tenant-list-quick-btn"><i data-lucide="message-square" class="w-3.5 h-3.5"></i>Message</button>`,
    ];
    if (unpaid) {
        btns.push(`<button type="button" data-go="mark-rent-received" data-iid="${unpaid.id}" class="tenant-list-quick-btn tenant-list-quick-btn--success"><i data-lucide="circle-check" class="w-3.5 h-3.5"></i>Record rent</button>`);
    }
    return `<div class="tenant-list-quick">${btns.join('')}</div>`;
}

function renderRentCollectionCard() {
    const finStats = typeof financialStats === 'function' ? financialStats() : null;
    if (!finStats) return '';

    const pct = finStats.pct || 0;
    const radius = 36;
    const circumference = 2 * Math.PI * radius; // 226.19
    const strokeDashoffset = circumference - (pct / 100) * circumference;

    return `
    <div class="dash-analytics-card">
        <h3 class="dash-analytics-title">Rent Status Overview</h3>
        <div class="dash-chart-donut-wrapper">
            <div class="dash-donut-container">
                <svg class="dash-donut-svg" viewBox="0 0 84 84">
                    <circle class="dash-donut-bg" cx="42" cy="42" r="${radius}" />
                    <circle class="dash-donut-segment" cx="42" cy="42" r="${radius}" 
                            stroke="#16A34A" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${strokeDashoffset}" />
                </svg>
                <div class="dash-donut-text">
                    ${pct}%
                    <span>Collected</span>
                </div>
            </div>
            <div class="dash-donut-legend">
                <div class="dash-legend-item">
                    <span class="dash-legend-dot dash-legend-dot--collected"></span>
                    <span class="dash-legend-name">Paid</span>
                    <span class="dash-legend-val">£${finStats.collected.toLocaleString()}</span>
                </div>
                <div class="dash-legend-item">
                    <span class="dash-legend-dot dash-legend-dot--pending"></span>
                    <span class="dash-legend-name">Pending</span>
                    <span class="dash-legend-val">£${finStats.pending.toLocaleString()}</span>
                </div>
                <div class="dash-legend-item">
                    <span class="dash-legend-dot dash-legend-dot--overdue"></span>
                    <span class="dash-legend-name">Overdue</span>
                    <span class="dash-legend-val">£${finStats.overdue.toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>`;
}

function renderCashFlowCard() {
    const finStats = typeof financialStats === 'function' ? financialStats() : null;
    if (!finStats) return '';

    const months = ['May 2026', 'Jun 2026', 'Jul 2026'];
    const barData = months.map(m => {
        const invs = INVOICES.filter(i => i.month === m);
        const income = invs.filter(i => i.type !== 'bill').reduce((sum, i) => sum + (parseInt(String(i.amount).replace(/[^\d]/g, ''), 10) || 0), 0);
        const expense = invs.filter(i => i.type === 'bill').reduce((sum, i) => sum + (parseInt(String(i.amount).replace(/[^\d]/g, ''), 10) || 0), 0);
        return { label: m.split(' ')[0], income, expense };
    });

    if (barData[0].income === 0) barData[0].income = 8250;
    if (barData[0].expense === 0) barData[0].expense = 1450;
    if (barData[1].income === 0) barData[1].income = 9850;
    if (barData[1].expense === 0) barData[1].expense = 2100;
    if (barData[2].income === 0) {
        barData[2].income = finStats.collected || 8200;
        barData[2].expense = 1200;
    }

    const maxVal = Math.max(...barData.map(d => Math.max(d.income, d.expense))) || 1;

    const barColumnsHTML = barData.map(d => {
        const incHeight = Math.round((d.income / maxVal) * 100);
        const expHeight = Math.round((d.expense / maxVal) * 100);
        return `
        <div class="dash-bar-column">
            <div class="dash-bar-visual-group">
                <div class="dash-bar dash-bar--income" style="height:${incHeight}%" title="Income: £${d.income.toLocaleString()}"></div>
                <div class="dash-bar dash-bar--expense" style="height:${expHeight}%" title="Expense: £${d.expense.toLocaleString()}"></div>
            </div>
            <span class="dash-bar-label">${d.label}</span>
        </div>`;
    }).join('');

    return `
    <div class="dash-analytics-card">
        <h3 class="dash-analytics-title">Monthly Cash Flow</h3>
        <div class="dash-bar-chart-wrapper">
            <div class="dash-bar-chart">
                ${barColumnsHTML}
            </div>
            <div class="dash-bar-chart-legend">
                <span class="dash-bar-legend-item">
                    <span class="dash-bar-legend-color dash-bar-legend-color--income"></span>Income (In)
                </span>
                <span class="dash-bar-legend-item">
                    <span class="dash-bar-legend-color dash-bar-legend-color--expense"></span>Expense (Out)
                </span>
            </div>
        </div>
    </div>`;
}

function screenDashboardEnhanced() {
    if (showScreenSkeleton('dashboard')) return renderDashboardSkeleton();
    const stats = portfolioStats();
    const occupiedProps = stats.occupiedProperties ?? PROPERTIES.filter(p => propertyOccupiedFlatCount(p.id) > 0).length;
    const reminders = AppStore.reminders.slice().map(r => recalcReminderMeta({ ...r }))
        .sort((a, b) => (a.daysLeft ?? 99) - (b.daysLeft ?? 99))
        .slice(0, 3)
        .map(r => {
            const prop = PROPERTIES[r.propertyId];
            const rt = reminderTypeMeta(r.type);
            return { id: r.id, ic: rt[2], title: r.title, sub: prop?.name || '', time: formatReminderDaysLeft(r.daysLeft), bg: rt[3], color: rt[4], urgency: r.urgency };
        });
    const unreadBell = getUnreadNotifCount();
    const finStats = typeof financialStats === 'function' ? financialStats() : null;
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top dash-header-top--brand">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <div class="dash-brand">
            <img src="${IMG.onboarding.splashLogo}" alt="" class="dash-brand-logo">
            <div class="dash-brand-text">
                <p class="dash-brand-name">LandlordHQ</p>
            </div>
        </div>
        <button data-go="notifications-list" class="top-icon-btn relative">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            ${unreadBell ? `<span class="notif-badge">${unreadBell}</span>` : ''}
        </button>
    </div>
</div>
    <div class="screen-content screen-enter">
        <div class="dash-hero">
            <div class="dash-hero-glow"></div>
            ${buildingSvg}
            <span class="dash-hero-label">Monthly income</span>
            <p class="dash-hero-amount">£${stats.monthlyRent.toLocaleString()}</p>
            <p class="dash-hero-sub">From ${occupiedProps} occupied propert${occupiedProps === 1 ? 'y' : 'ies'}</p>
            <div class="dash-hero-stats">
                <button data-go="properties" class="dash-hero-stat"><strong>${stats.buildingCount}</strong><span>Properties</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="tenants" class="dash-hero-stat"><strong>${stats.activeTenants}</strong><span>Tenants</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="properties" class="dash-hero-stat"><strong>${stats.occupancy}%</strong><span>Occupied</span></button>
            </div>
        </div>
        ${renderDashFinancialOverview(finStats)}
        <div class="dash-quick">
            ${[['megaphone','Announcement','broadcast-notices','indigo'],['wrench','Maintenance','maintenance','warning'],['wallet','Finance','financial','primary']].map(([ic,l,go,tone])=>`
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                <span>${l}</span>
            </button>`).join('')}
        </div>
        ${dashAttentionStrip()}
        ${reminders.length ? `
        <div class="dash-reminder-section">
            <div class="dash-section-head">
                <h3 class="screen-section-title">Reminder</h3>
                <button data-go="reminders" class="dash-view-all">View all</button>
            </div>
            <div class="card dash-reminder-list">
                ${reminders.slice(0, 2).map(r => `
                <button type="button" data-go="reminder-detail" data-rid="${r.id}" class="dash-reminder-row${r.urgency === 'high' ? ' urgency-high' : r.urgency === 'medium' ? ' urgency-medium' : ''}">
                    <span class="dash-reminder-icon" style="background:${r.bg};color:${r.color}"><i data-lucide="${r.ic}" class="w-[18px] h-[18px]"></i></span>
                    <span class="dash-reminder-body">
                        <span class="dash-reminder-title">${r.title}</span>
                        <span class="dash-reminder-prop">${r.sub} · ${r.time}</span>
                    </span>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] flex-shrink-0"></i>
                </button>`).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

function renderTenantPlaceFilters() {
    const propF = STATE.tenantPropertyFilter;
    const unitF = STATE.tenantUnitFilter;
    const units = propF != null && typeof getPropertyUnits === 'function'
        ? getPropertyUnits(propF)
        : [];
    const propLabel = propF != null ? (PROPERTIES[propF]?.name || 'Property') : 'All properties';
    const unitLabel = unitF || 'All flats';
    return `
    <div class="maint-place-filters tenant-place-filters">
        <label class="maint-place-select-wrap">
            <select data-tenant-property-filter class="maint-place-select" aria-label="Filter by property">
                <option value="all"${propF == null ? ' selected' : ''}>All properties</option>
                ${PROPERTIES.map(p => `<option value="${p.id}"${propF === p.id ? ' selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
        <label class="maint-place-select-wrap">
            <select data-tenant-unit-filter class="maint-place-select" aria-label="Filter by flat"${propF == null ? ' disabled' : ''}>
                <option value="all"${!unitF ? ' selected' : ''}>All flats</option>
                ${units.map(u => {
                    const name = typeof unitName === 'function' ? unitName(u) : u.name;
                    return `<option value="${escapeHtml(name)}"${unitF === name ? ' selected' : ''}>${escapeHtml(name)}</option>`;
                }).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
    </div>
    ${propF != null ? `
    <div class="maint-place-banner">
        <span>${escapeHtml(propLabel)}${unitF ? ` · ${escapeHtml(unitF)}` : ''}</span>
        <button type="button" data-action="clear-tenant-place-filters" class="maint-place-clear">Clear</button>
    </div>` : ''}`;
}

function screenTenantsEnhanced() {
    const q = STATE.search.tenants.toLowerCase();
    const f = STATE.tenantFilter;
    const propF = STATE.tenantPropertyFilter;
    const unitF = STATE.tenantUnitFilter;
    const filtered = TENANT_LIST.filter(t => {
        const matchQ = !q || t.name.toLowerCase().includes(q) || t.prop.toLowerCase().includes(q) || (t.unit && t.unit.toLowerCase().includes(q));
        const matchF = f === 'all' || t.status === f;
        const matchProp = propF == null || t.propertyId === propF;
        const matchUnit = !unitF || t.unit === unitF;
        return matchQ && matchF && matchProp && matchUnit;
    });
    const counts = {
        all: TENANT_LIST.length + pendingTenantInviteCount(),
        active: TENANT_LIST.filter(t => t.status === 'active').length,
        inactive: TENANT_LIST.filter(t => t.status === 'inactive').length,
        pending: pendingTenantInviteCount(),
    };
    const defaultPid = PROPERTIES.find(p => p.status === 'Vacant')?.id ?? PROPERTIES[0]?.id ?? 0;
  return `${topBar('Tenants', { back: true })}
    <div class="screen-content screen-enter tenant-list-page tenant-list-page--minimal">
        <div class="tenant-list-toolbar">
            <span class="tenant-list-count">${counts.active} active tenant${counts.active === 1 ? '' : 's'}</span>
            <button type="button" data-go="select-property-invite" class="header-text-link">+ Invite</button>
        </div>
        <div class="search-bar">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="tenants" type="text" value="${STATE.search.tenants}" placeholder="Search tenants..." class="flex-1 text-[13px] bg-transparent border-none outline-none">
        </div>
        ${typeof renderTenantPlaceFilters === 'function' ? renderTenantPlaceFilters() : ''}
        <div class="tenant-filter-row">
            ${[['all', 'All'], ['active', 'Active'], ['pending', 'Pending'], ['inactive', 'Inactive']].map(([k, l]) => `
            <button type="button" data-tenant-filter="${k}" class="filter-chip ${f === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <div class="tenant-list tenant-list--minimal">
            ${filtered.length ? filtered.map(t => tenantListRow(t, { minimal: true })).join('') : emptyState('users', 'No tenants found', propF != null || unitF ? 'Try another property, flat, or status filter.' : 'Invite a tenant to get started.', propF != null || unitF ? null : 'Invite Tenant', null, propF != null || unitF ? null : 'select-property-invite')}
        </div>
    </div>`;
}

function screenSelectPropertyInvite() {
    return `${topBar('Select Property', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Choose which property to invite a tenant to.</p>
        ${PROPERTIES.map(p => `
        <button data-go="invite-tenant" data-pid="${p.id}" class="card p-4 flex items-center gap-3 w-full text-left mb-2">
            <img src="${IMG.props[p.id]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id).label : (p.occupancyLabel || 'Vacant')} · ${propertyRentListLabel(p.id)}</p></div>
            <span class="badge" style="background:${(typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id) : { bg: p.statusColor[0], color: p.statusColor[1] }).bg};color:${(typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id) : { bg: p.statusColor[0], color: p.statusColor[1] }).color}">${typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id).label : p.status}</span>
        </button>`).join('')}
    </div>`;
}

/* ─── Building units, messaging, maintenance history, smart reminders ─── */
const ALARM_REMINDER_MAP = { smoke: 'smoke', heat: 'heat', co: 'co2' };

function formatEventTime(d = new Date()) {
    return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' });
}

function formatEventDate(d = new Date()) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((today - day) / 86400000);
    if (diff === 0) return `Today · ${formatEventTime(d)}`;
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getPropertyBuilding(propertyId) {
    const meta = AppStore.meta(propertyId);
    if (!meta.building) meta.building = { flatCount: 4, floors: 2, flatsPerFloor: 2, useFloors: true };
    if (!meta.building.flatCount) {
        meta.building.flatCount = meta.units?.length || ((meta.building.floors || 1) * (meta.building.flatsPerFloor || 1)) || 1;
    }
    return meta.building;
}

function isSingleFlatProperty(propertyId) {
    return getPropertyUnits(propertyId).length === 1;
}

function shouldGroupFlatsByFloor(propertyId) {
    const units = getPropertyUnits(propertyId);
    if (units.length <= 1) return false;
    const b = getPropertyBuilding(propertyId);
    if (b.useFloors === false) return false;
    const distinct = new Set(units.map(u => u.floor).filter(f => f != null && f !== ''));
    return distinct.size > 1;
}

function propertyStructureLabel(propertyId) {
    const units = getPropertyUnits(propertyId);
    const n = units.length;
    const vacant = units.filter(u => u.status === 'vacant').length;
    const occupied = n - vacant;
    if (n === 1) return occupied ? '1 unit · occupied' : '1 unit · vacant';
    let label = `${n} units`;
    if (shouldGroupFlatsByFloor(propertyId)) {
        const b = getPropertyBuilding(propertyId);
        label += ` · ${b.floors} floors`;
    }
    if (occupied && occupied < n) label += ` · ${occupied}/${n} occupied`;
    else if (occupied === n) label += ' · full';
    else if (vacant === n) label += ' · all vacant';
    return label;
}

function flatUnitMetaLabel(u) {
    return flatFloorLine(u);
}

function flatFloorLine(u) {
    if (!u) return '';
    const hasNote = !!String(u.floorNote || '').trim();
    const hasFloor = u.floor != null && u.floor !== '';
    if (!hasNote && !hasFloor) return '';
    if (!hasNote && hasFloor && +u.floor === 1) return '';
    const parts = [];
    if (hasFloor) parts.push(formatFloorLabel(u.floor));
    if (hasNote) parts.push(u.floorNote.trim());
    return parts.join(' · ');
}

function flatSpecLine(u) {
    const parts = [];
    if (u.beds) parts.push(`${u.beds} bed`);
    if (u.baths) parts.push(`${u.baths} bath`);
    if (u.sqft) parts.push(`${u.sqft} sqft`);
    return parts.join(' · ') || 'Specs not set';
}

function suggestNextFlatName(propertyId, sourceUnit) {
    const existing = new Set(getPropertyUnits(propertyId).map(unitName));
    const source = sourceUnit ? getUnitByName(propertyId, sourceUnit) : null;
    if (source) {
        const m = unitName(source).match(/^Flat\s+(\d+)([A-Z])$/i);
        if (m) {
            const floor = m[1];
            let code = m[2].toUpperCase().charCodeAt(0);
            for (let i = 0; i < 26; i++) {
                code++;
                if (code > 90) break;
                const candidate = `Flat ${floor}${String.fromCharCode(code)}`;
                if (!existing.has(candidate)) return candidate;
            }
        }
        const copyBase = `${unitName(source)} (copy)`;
        if (!existing.has(copyBase)) return copyBase;
        let n = 2;
        while (existing.has(`${unitName(source)} (copy ${n})`)) n++;
        return `${unitName(source)} (copy ${n})`;
    }
    if (existing.has('Main Flat') || existing.size === 0) {
        let n = existing.size + 1;
        while (existing.has(`Flat ${n}`)) n++;
        return `Flat ${n}`;
    }
    let n = existing.size + 1;
    while (existing.has(`Flat ${n}`)) n++;
    return `Flat ${n}`;
}

function flatDraftFromSource(propertyId, sourceName) {
    const source = sourceName ? getUnitByName(propertyId, sourceName) : null;
    if (source) {
        return {
            name: suggestNextFlatName(propertyId, sourceName),
            rent: (source.rent || propertyDefaultFlatRent(propertyId)).replace(/[£,]/g, ''),
            beds: source.beds || 2,
            baths: source.baths || 1,
            sqft: source.sqft || '',
            floor: source.floor ?? '',
            floorNote: source.floorNote || '',
            unitType: source.unitType || '',
            furnished: source.furnished || '',
            yearBuilt: source.yearBuilt || '',
        };
    }
    return {
        name: suggestNextFlatName(propertyId),
        rent: propertyDefaultFlatRent(propertyId).replace(/[£,]/g, ''),
        beds: 2,
        baths: 1,
        sqft: '',
        floor: '',
        floorNote: '',
        unitType: '',
        furnished: '',
        yearBuilt: '',
    };
}

function appendFlatToProperty(propertyId, flatData) {
    const meta = AppStore.meta(propertyId);
    const units = getPropertyUnits(propertyId);
    const nextId = units.length ? Math.max(...units.map(u => u.id ?? 0)) + 1 : 0;
    const newUnit = {
        id: nextId,
        name: flatData.name,
        floor: flatData.floor === '' || flatData.floor == null ? null : +flatData.floor,
        flatIndex: units.length + 1,
        floorNote: flatData.floorNote || '',
        status: 'vacant',
        rent: flatData.rent,
        beds: flatData.beds,
        baths: flatData.baths,
        sqft: flatData.sqft || '',
        unitType: flatData.unitType || '',
        furnished: flatData.furnished || '',
        yearBuilt: flatData.yearBuilt || '',
    };
    meta.units.push(newUnit);
    const building = getPropertyBuilding(propertyId);
    building.flatCount = meta.units.length;
    ensureFlatPhotos(propertyId);
    syncPropertyStatus(propertyId);
    return newUnit;
}

function applyFlatDefaults(units, opts = {}) {
    const beds = +opts.defaultBeds || 2;
    const baths = +opts.defaultBaths || 1;
    const sqft = opts.defaultSqft || '750';
    units.forEach(u => {
        if (!u.beds) u.beds = beds;
        if (!u.baths) u.baths = baths;
        if (!u.sqft) u.sqft = sqft;
    });
    return units;
}

function generateSimpleFlatRecords(flatCount, defaultRent = '', specs = {}) {
    const count = Math.max(1, +flatCount || 1);
    const beds = +specs.beds || 2;
    const baths = +specs.baths || 1;
    const sqft = specs.sqft || '750';
    const records = [];
    for (let i = 1; i <= count; i++) {
        records.push({
            id: i - 1,
            name: count === 1 ? 'Main Flat' : `Flat ${i}`,
            floor: null,
            flatIndex: i,
            floorNote: '',
            status: 'vacant',
            rent: defaultRent,
            beds,
            baths,
            sqft,
        });
    }
    return records;
}

function buildPropertyFlats({ flatCount, floors, flatsPerFloor, defaultRent, defaultBeds, defaultBaths, defaultSqft }) {
    const specs = { beds: defaultBeds, baths: defaultBaths, sqft: defaultSqft };
    const f = +floors || 0;
    const pf = +flatsPerFloor || 0;
    if (f > 1 && pf > 0) {
        const units = generatePropertyUnitRecords(f, pf, defaultRent);
        applyFlatDefaults(units, specs);
        return {
            units,
            building: { flatCount: units.length, floors: f, flatsPerFloor: pf, useFloors: true },
        };
    }
    const count = Math.max(1, +flatCount || 1);
    return {
        units: generateSimpleFlatRecords(count, defaultRent, specs),
        building: { flatCount: count, floors: f > 0 ? f : 1, flatsPerFloor: pf || count, useFloors: false },
    };
}

function unitName(u) {
    return typeof u === 'string' ? u : (u?.name || '');
}

function renderEditPropertyUnitsSection(propertyId) {
    const units = getPropertyUnits(propertyId);
    const unitRow = (u) => {
        const occ = u.status === 'occupied';
        const badgeBg = occ ? '#DCFCE7' : '#FEF3C7';
        const badgeColor = occ ? '#16A34A' : '#D97706';
        const name = unitName(u);
        const spec = [u.beds ? `${u.beds} bed` : '', u.baths ? `${u.baths} bath` : ''].filter(Boolean).join(' · ');
        const floor = flatFloorLine(u);
        const unitMenuKey = actionMenuKeyFor('unit', propertyId, name);
        const menuOpen = isActionMenuOpen(unitMenuKey);
        return `
        <div class="card edit-prop-unit-row ${menuOpen ? 'edit-prop-unit-row--menu-open' : ''}">
            <button type="button" data-go="flat-detail" data-pid="${propertyId}" data-unit="${name}" class="edit-prop-unit-main text-left">
                <p class="edit-prop-unit-name">${name}</p>
                <p class="edit-prop-unit-meta">${u.rent || '—'}${spec ? ` · ${spec}` : ''}${floor ? ` · ${floor}` : ''}</p>
            </button>
            <span class="badge shrink-0" style="background:${badgeBg};color:${badgeColor}">${occ ? 'Occupied' : 'Vacant'}</span>
            <div class="unit-card-v2-menu">
                ${renderActionMenuButton(unitMenuKey, 'Unit options')}
                ${renderActionMenuPopover(unitMenuKey, unitActionMenuItems(propertyId, name))}
            </div>
        </div>`;
    };
    return `
    <div class="form-section edit-prop-units">
        <div class="edit-prop-units-head">
            <div>
                <p class="form-section-title">Units</p>
                <p class="form-helper edit-prop-units-hint">Add or edit each unit here</p>
            </div>
            <button type="button" data-go="add-flat" data-pid="${propertyId}" class="header-text-link">+ Add unit</button>
        </div>
        ${units.length ? `<div class="edit-prop-units-list">${units.map(unitRow).join('')}</div>` : `
        <div class="card edit-prop-units-empty">
            <p class="edit-prop-units-empty-title">No units yet</p>
            <p class="edit-prop-units-empty-copy">Add your first unit to track rent and tenancy.</p>
            <button type="button" data-go="add-flat" data-pid="${propertyId}" class="btn-secondary w-full mt-3 py-2.5 text-[13px]">+ Add unit</button>
        </div>`}
        <button type="button" data-go="property-detail" data-pid="${propertyId}" data-tab="units" class="edit-prop-units-view">View full units page</button>
    </div>`;
}

function formatFloorLabel(floor) {
    const n = +floor;
    if (n === 0) return 'Ground Floor';
    if (n === 1) return '1st Floor';
    if (n === 2) return '2nd Floor';
    if (n === 3) return '3rd Floor';
    return `${n}th Floor`;
}

function inferFloorFromFlatName(name) {
    const m = String(name || '').match(/^Flat\s+(\d+)/i);
    if (m) return parseInt(m[1], 10);
    if (/ground/i.test(name)) return 0;
    return 1;
}

function flatLabelFor(floor, flatIndex, flatsPerFloor) {
    if (flatsPerFloor <= 26) return `Flat ${floor}${String.fromCharCode(64 + flatIndex)}`;
    return `Flat ${floor}-${String(flatIndex).padStart(2, '0')}`;
}

function generatePropertyUnitRecords(floors, flatsPerFloor, defaultRent = '') {
    const records = [];
    const fCount = Math.max(1, +floors || 1);
    const perFloor = Math.max(1, +flatsPerFloor || 1);
    let id = 0;
    for (let f = 1; f <= fCount; f++) {
        for (let u = 1; u <= perFloor; u++) {
            records.push({
                id: id++,
                name: flatLabelFor(f, u, perFloor),
                floor: f,
                flatIndex: u,
                status: 'vacant',
                rent: defaultRent,
                beds: 1,
                baths: 1,
            });
        }
    }
    return records;
}

function generatePropertyUnits(floors, flatsPerFloor) {
    return generatePropertyUnitRecords(floors, flatsPerFloor).map(u => u.name);
}

function normalizePropertyUnits(propertyId) {
    const meta = AppStore.meta(propertyId);
    const building = getPropertyBuilding(propertyId);
    if (!meta.units?.length) {
        const rent = PROPERTIES[propertyId]?.rent?.replace(/[^\d]/g, '') || '';
        meta.units = generatePropertyUnitRecords(building.floors, building.flatsPerFloor, rent ? `£${parseInt(rent, 10).toLocaleString()}` : '');
    } else if (typeof meta.units[0] === 'string') {
        meta.units = meta.units.map((name, i) => ({
            id: i,
            name,
            floor: inferFloorFromFlatName(name),
            flatIndex: 1,
            status: 'vacant',
            rent: PROPERTIES[propertyId]?.rent || '',
            beds: 1,
            baths: 1,
        }));
    } else {
        meta.units.forEach(u => {
            if (u.floor == null) u.floor = inferFloorFromFlatName(unitName(u));
            if (u.flatIndex == null) {
                const m = unitName(u).match(/^Flat\s+\d+([A-Z])$/i);
                u.flatIndex = m ? m[1].toUpperCase().charCodeAt(0) - 64 : 1;
            }
        });
    }
    if (!meta.unitUtilities) meta.unitUtilities = {};
    return meta.units;
}

function getPropertyUnits(propertyId) {
    return normalizePropertyUnits(propertyId);
}

function getUnitNames(propertyId) {
    return getPropertyUnits(propertyId).map(unitName);
}

function getUnitByName(propertyId, name) {
    return getPropertyUnits(propertyId).find(u => unitName(u) === name) || null;
}

function getActiveTenanciesForProperty(propertyId) {
    return AppStore.tenancies.filter(t => t.propertyId === propertyId && t.status === 'active');
}

function getPendingTenanciesForProperty(propertyId) {
    return AppStore.tenancies.filter(t => t.propertyId === propertyId && t.status === 'pending');
}

function getTenancyForUnit(propertyId, unitName) {
    return AppStore.tenancies.find(t => t.propertyId === propertyId && t.unit === unitName && t.status === 'active') || null;
}

function tenantsAllByProperty(propertyId) {
    return TENANT_LIST.filter(t => t.propertyId === propertyId && (t.status === 'active' || t.status === 'pending'));
}

function pendingInvitesForProperty(propertyId) {
    return TENANT_INVITATIONS.filter(i => i.propertyId === propertyId && i.status === 'pending');
}

function syncPropertyStatus(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return;
    const units = getPropertyUnits(propertyId);
    const activeTenancies = getActiveTenanciesForProperty(propertyId);
    const pendingTenancies = getPendingTenanciesForProperty(propertyId);
    const occupiedNames = new Set(activeTenancies.map(t => t.unit));
    const reservedNames = new Set(pendingTenancies.map(t => t.unit));
    units.forEach(u => {
        const name = unitName(u);
        if (occupiedNames.has(name)) {
            u.status = 'occupied';
            const tenancy = activeTenancies.find(t => t.unit === name);
            if (tenancy?.rent) u.rent = tenancy.rent.startsWith('£') ? tenancy.rent : `£${parseRentAmount(tenancy.rent).toLocaleString()}`;
        } else if (reservedNames.has(name)) {
            u.status = 'reserved';
            const tenancy = pendingTenancies.find(t => t.unit === name);
            if (tenancy?.rent) u.rent = tenancy.rent.startsWith('£') ? tenancy.rent : `£${parseRentAmount(tenancy.rent).toLocaleString()}`;
        } else {
            u.status = 'vacant';
        }
    });
    const occupied = units.filter(u => u.status === 'occupied').length;
    const reserved = units.filter(u => u.status === 'reserved').length;
    const total = units.length;
    if (occupied === 0 && reserved === 0) {
        p.status = 'Vacant';
        p.statusColor = ['#FEF3C7', '#D97706'];
        p.occupancyLabel = total === 0 ? 'No units' : (total === 1 ? 'Vacant' : `${total} vacant`);
    } else if (occupied + reserved < total) {
        p.status = 'Partial';
        p.statusColor = ['#DBEAFE', '#2563EB'];
        p.occupancyLabel = reserved
            ? `${occupied}/${total} occupied · ${reserved} reserved`
            : `${occupied}/${total} occupied`;
    } else {
        p.status = occupied === total ? 'Full' : 'Partial';
        p.statusColor = occupied === total ? ['#DCFCE7', '#16A34A'] : ['#DBEAFE', '#2563EB'];
        p.occupancyLabel = occupied === total
            ? (total === 1 ? 'Occupied' : 'Full')
            : `${occupied}/${total} occupied`;
    }
    syncPropertyRent(propertyId);
}

function syncPropertyRent(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return;
    const { potential } = getPropertyRentSummary(propertyId);
    p.rent = potential > 0 ? formatRentAmount(potential) : '—';
}

function parseRentAmount(val) {
    return parseInt(String(val ?? '').replace(/[^\d]/g, ''), 10) || 0;
}

function formatRentAmount(n) {
    return n ? `£${n.toLocaleString()}` : '—';
}

function flatEffectiveRentAmount(u, tenancy) {
    return parseRentAmount(tenancy?.rent || u?.rent);
}

function flatUnitExtraFieldsHtml(unitOrDraft, propertyId) {
    const info = AppStore.meta(propertyId).info || {};
    const unitType = unitOrDraft.unitType || '';
    const furnished = unitOrDraft.furnished || '';
    const yearBuilt = unitOrDraft.yearBuilt || '';
    const builtPlaceholder = info.built ? `Building default: ${info.built}` : 'e.g. 2020';
    return `
        ${formSelectField('Unit type', 'flatUnitType', PROPERTY_TYPE_OPTIONS, unitType, { blankLabel: 'Same as building' })}
        ${formSelectField('Furnished', 'flatFurnished', FURNISHED_OPTIONS, furnished, { blankLabel: 'Not set' })}
        <div class="form-field"><label class="form-label">Year built</label><input data-field="flatYearBuilt" type="number" class="form-input" value="${escapeHtml(String(yearBuilt || ''))}" placeholder="${escapeHtml(builtPlaceholder)}" min="1700" max="2030"></div>`;
}

function applyFlatUnitExtraFields(unit) {
    unit.unitType = fieldVal('flatUnitType') || '';
    unit.furnished = fieldVal('flatFurnished') || '';
    const yb = fieldVal('flatYearBuilt');
    unit.yearBuilt = yb ? String(yb) : '';
}

function syncUnitRentAcrossRecords(propertyId, unitName, rentFormatted) {
    const rentMo = rentFormatted.includes('/mo') ? rentFormatted : `${rentFormatted}/mo`;
    AppStore.tenancies
        .filter(t => t.propertyId === propertyId && t.unit === unitName && t.status === 'active')
        .forEach(t => { t.rent = rentFormatted; });
    TENANT_LIST
        .filter(t => t.propertyId === propertyId && t.unit === unitName && (t.status === 'active' || t.status === 'pending'))
        .forEach(t => { t.rent = rentMo; });
    TENANT_INVITATIONS
        .filter(i => i.propertyId === propertyId && i.unit === unitName)
        .forEach(i => { i.rent = rentFormatted; });
}

function renameUnitReferences(propertyId, oldName, newName) {
    AppStore.tenancies.filter(t => t.propertyId === propertyId && t.unit === oldName).forEach(t => { t.unit = newName; });
    TENANT_INVITATIONS.filter(i => i.propertyId === propertyId && i.unit === oldName).forEach(i => { i.unit = newName; });
    TENANT_LIST.filter(t => t.propertyId === propertyId && t.unit === oldName).forEach(t => { t.unit = newName; });
    MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId && m.unit === oldName).forEach(m => { m.unit = newName; });
    INVOICES.filter(i => i.propertyId === propertyId && i.unit === oldName).forEach(i => { i.unit = newName; });
    const util = AppStore.meta(propertyId).unitUtilities?.[oldName];
    if (util) {
        AppStore.meta(propertyId).unitUtilities[newName] = util;
        delete AppStore.meta(propertyId).unitUtilities[oldName];
    }
    renameFlatPhoto(propertyId, oldName, newName);
}

function syncPropertyDisplayReferences(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return;
    const full = `${p.name}, ${p.address}`;
    MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId).forEach(m => { m.prop = p.name; });
    INVOICES.filter(i => i.propertyId === propertyId).forEach(i => { i.prop = full; });
    TENANT_LIST.filter(t => t.propertyId === propertyId).forEach(t => { t.prop = p.name; });
}

function getPropertyRentSummary(propertyId) {
    const units = getPropertyUnits(propertyId);
    const flatAmounts = units.map(u => parseRentAmount(u.rent)).filter(n => n > 0);
    const collected = getActiveTenanciesForProperty(propertyId)
        .reduce((s, t) => s + parseRentAmount(t.rent), 0);
    const fallback = parseRentAmount(PROPERTIES[propertyId]?.rent);
    const min = flatAmounts.length ? Math.min(...flatAmounts) : fallback;
    const max = flatAmounts.length ? Math.max(...flatAmounts) : fallback;
    const potential = flatAmounts.reduce((s, n) => s + n, 0);
    return { min, max, potential, collected, flatCount: units.length, flatAmounts };
}

function propertyRentRangeLabel(propertyId) {
    const { potential, flatCount } = getPropertyRentSummary(propertyId);
    if (!potential) return 'Not set';
    if (flatCount > 1) return `${formatRentAmount(potential)}/mo total`;
    return `${formatRentAmount(potential)}/mo`;
}

function propertyRentListLabel(propertyId) {
    const { potential, flatCount } = getPropertyRentSummary(propertyId);
    if (!potential) return 'Rent not set';
    if (flatCount > 1) return `${formatRentAmount(potential)}/mo total`;
    return `${formatRentAmount(potential)}/mo`;
}

function propertyOccupancyBadge(propertyId) {
    syncPropertyStatus(propertyId);
    const p = PROPERTIES[propertyId];
    return {
        label: p?.occupancyLabel || p?.status || '—',
        bg: p?.statusColor?.[0] || '#F1F5F9',
        color: p?.statusColor?.[1] || '#64748B',
    };
}

function propertyOccupiedFlatCount(propertyId) {
    return getPropertyUnits(propertyId).filter(u => u.status === 'occupied').length;
}

function propertyCardStats(propertyId) {
    const units = getPropertyUnits(propertyId);
    const total = units.length;
    const occupied = units.filter(u => u.status === 'occupied').length;
    const { potential } = getPropertyRentSummary(propertyId);
    const occupancy = total ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, monthlyRent: potential, occupancy };
}

function occupancyRing(pct) {
    const deg = Math.min(100, Math.max(0, pct)) * 3.6;
    return `<span class="occ-ring" style="--occ-deg:${deg}deg" role="img" aria-label="${pct}% occupancy"></span>`;
}

function propertyDefaultFlatRent(propertyId) {
    const meta = AppStore.meta(propertyId);
    if (meta.defaultFlatRent) return meta.defaultFlatRent;
    const { min } = getPropertyRentSummary(propertyId);
    return min ? formatRentAmount(min) : (PROPERTIES[propertyId]?.rent || '');
}

function applyDefaultFlatRent(propertyId, rentStr) {
    const meta = AppStore.meta(propertyId);
    meta.defaultFlatRent = rentStr;
    PROPERTIES[propertyId].rent = rentStr;
    getPropertyUnits(propertyId).forEach(u => {
        if (u.status !== 'occupied') u.rent = rentStr;
    });
}

function syncAllPropertyStatuses() {
    PROPERTIES.forEach(p => syncPropertyStatus(p.id));
}

function portfolioStats() {
    syncAllPropertyStatuses();
    let totalUnits = 0;
    let vacantUnits = 0;
    let occupiedUnits = 0;
    let monthlyRent = 0;
    PROPERTIES.forEach(p => {
        const units = getPropertyUnits(p.id);
        totalUnits += units.length;
        vacantUnits += units.filter(u => u.status === 'vacant').length;
        occupiedUnits += units.filter(u => u.status === 'occupied').length;
        getActiveTenanciesForProperty(p.id).forEach(t => {
            monthlyRent += parseInt(String(t.rent).replace(/[^\d]/g, ''), 10) || 0;
        });
    });
    return {
        buildingCount: PROPERTIES.length,
        totalUnits,
        vacantUnits,
        occupiedUnits,
        occupiedProperties: PROPERTIES.filter(p => propertyOccupiedFlatCount(p.id) > 0).length,
        monthlyRent,
        occupancy: totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
        activeTenants: TENANT_LIST.filter(t => t.status === 'active').length,
    };
}

function getAvailableUnits(propertyId) {
    const occupied = new Set(getActiveTenanciesForProperty(propertyId).map(t => t.unit));
    return getPropertyUnits(propertyId).filter(u => !occupied.has(unitName(u)));
}

function unitSelectHtml(propertyId, fieldKey = 'unit', invite = false, selected = '') {
    const avail = getAvailableUnits(propertyId);
    const all = getPropertyUnits(propertyId);
    const options = avail.length ? avail : all;
    const attr = invite ? 'data-invite' : 'data-field';
    const groupFloors = shouldGroupFlatsByFloor(propertyId);
    return `<select ${attr}="${fieldKey}" class="form-input form-select">${options.map(u => {
        const name = unitName(u);
        const occ = !avail.find(a => unitName(a) === name);
        return `<option value="${name}" ${selected === name ? 'selected' : ''}>${name}${!isSingleFlatProperty(propertyId) && groupFloors && u.floor != null ? ` · ${formatFloorLabel(u.floor)}` : ''}${avail.length || !occ ? '' : ' (occupied)'}</option>`;
    }).join('')}</select>`;
}

function getUnitUtilityMeta(propertyId, unitName) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitUtilities) meta.unitUtilities = {};
    if (!meta.unitUtilities[unitName]) {
        meta.unitUtilities[unitName] = {
            responsibility: 'tenant',
            includedBills: [],
            meters: { electricity: '', gas: '', water: '' },
            uploads: [],
            monthlyAllowance: '',
            customUtilities: [],
            overageCharges: [],
        };
    }
    if (!meta.unitUtilities[unitName].customUtilities) meta.unitUtilities[unitName].customUtilities = [];
    if (!meta.unitUtilities[unitName].overageCharges) meta.unitUtilities[unitName].overageCharges = [];
    return meta.unitUtilities[unitName];
}

function syncConversationsFromStore() {
    if (!AppStore.conversations?.length) return;
    CONVERSATIONS.length = 0;
    CONVERSATIONS.push(...AppStore.conversations);
}

function syncConversationsToStore() {
    AppStore.conversations = JSON.parse(JSON.stringify(CONVERSATIONS));
}

function seedConversationsIfNeeded() {
    if (AppStore.conversations?.length) {
        syncConversationsFromStore();
        return;
    }
    AppStore.conversations = JSON.parse(JSON.stringify(CONVERSATIONS));
}

function getMaintTenantForItem(item) {
    if (!item) return null;
    if (isCommunalMaint(item)) return null;
    if (item.tenantName) {
        const byName = TENANT_LIST.find(t =>
            t.name === item.tenantName && t.propertyId === item.propertyId &&
            (!item.unit || item.unit === '—' || t.unit === item.unit)
        );
        if (byName) return byName;
    }
    return TENANT_LIST.find(t =>
        t.propertyId === item.propertyId && t.status === 'active' &&
        (!item.unit || item.unit === '—' || t.unit === item.unit)
    ) || null;
}

function isTenantMaintReport(item) {
    return item?.reportedBy === 'tenant' || !!item?.tenantName;
}

function suggestMaintTradeCategory(source) {
    const text = (typeof source === 'string' ? source : `${source?.issue || ''} ${source?.desc || ''}`).toLowerCase();
    if (typeof CONTRACTOR_TRADE_CATALOG !== 'undefined') {
        let bestMeta = null;
        let bestScore = 0;
        CONTRACTOR_TRADE_CATALOG.forEach(meta => {
            const score = meta.keywords.filter(k => text.includes(k)).length;
            if (score > bestScore) {
                bestScore = score;
                bestMeta = meta;
            }
        });
        if (bestMeta && bestScore > 0) return bestMeta;
    }
    return typeof contractorTradeById === 'function' ? contractorTradeById('general') : null;
}

function resolveMaintTradeCategory(item) {
    if (!item) return suggestMaintTradeCategory('') || { id: 'general', shortLabel: 'General', label: 'General Maintenance', icon: 'hammer', color: '#64748B', bg: '#F1F5F9' };
    if (item.categoryId && typeof contractorTradeById === 'function') return contractorTradeById(item.categoryId);
    return suggestMaintTradeCategory(item) || contractorTradeById('general');
}

function contractorDisplayRating(c) {
    if (c?.ratings?.length) {
        const avg = c.ratings.reduce((s, r) => s + r.stars, 0) / c.ratings.length;
        return avg.toFixed(1);
    }
    return ({ 0: '4.9', 1: '4.7', 2: '4.8' })[c?.id] || '4.8';
}

function contractorResponseLabel(c) {
    return ({ 0: 'Responds in 30 min', 1: 'Responds in 1 hr', 2: 'Responds in 2 hrs' })[c?.id] || 'Responds in 1 hr';
}

function getMaintDetailStatusBadge(item, contractorJob) {
    if (item.status === 'done') return { label: 'Completed', bg: '#DCFCE7', color: '#16A34A' };
    if ((!item.contractor || item.contractor === '—') && !contractorJob) {
        return { label: 'Needs contractor', bg: '#F1F5F9', color: '#64748B' };
    }
    const label = getMaintWorkflowLabel(item, contractorJob);
    return { label, bg: '#EFF6FF', color: '#2563EB' };
}

function renderMaintDetailMediaGallery(item) {
    const photos = getMaintReportPhotos(item);
    const videos = getMaintReportVideos(item).map(normalizeMaintVideo);
    if (!photos.length && !videos.length) return '';
    const videoLabel = videos.length ? ` · ${videos.length} video${videos.length === 1 ? '' : 's'}` : '';
    return `
    <div class="maint-v2-media">
        <div class="maint-v2-media-head">
            <span>Photos (${photos.length}${videoLabel})</span>
            ${photos.length > 3 ? '<span class="maint-v2-media-hint">Swipe gallery</span>' : ''}
        </div>
        <div class="maint-v2-media-grid">
            ${photos.slice(0, 3).map((src, i) => `
            <button type="button" class="maint-v2-media-thumb" data-action="preview-maint-media" data-kind="photo" data-src="${String(src).replace(/"/g, '&quot;')}">
                <img src="${src}" alt="Issue photo ${i + 1}">
            </button>`).join('')}
            ${videos.slice(0, 1).map((video, i) => `
            <button type="button" class="maint-v2-media-thumb maint-v2-media-thumb--video" data-action="preview-maint-media" data-kind="video" data-src="${String(video.url || '').replace(/"/g, '&quot;')}" data-poster="${String(video.poster || photos[0] || '').replace(/"/g, '&quot;')}" data-name="${String(video.name).replace(/"/g, '&quot;')}">
                <span class="maint-v2-media-play"><i data-lucide="play" class="w-5 h-5"></i></span>
            </button>`).join('')}
        </div>
    </div>`;
}

function renderMaintTenantPropertyCard(item) {
    const pid = item.propertyId ?? STATE.propertyId ?? 0;
    const p = PROPERTIES[pid];
    const cover = typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(pid) : IMG.props[pid];
    const unitLabel = item.unit && item.unit !== '—' ? item.unit : 'Your unit';
    const landlordChatId = typeof getActiveTenantLandlordChatId === 'function' ? getActiveTenantLandlordChatId() : null;
    return `
    <div class="card maint-v2-property-card maint-v2-property-card--tenant">
        <img src="${cover}" alt="" class="maint-v2-property-img">
        <div class="maint-v2-property-copy min-w-0 flex-1">
            <p class="maint-v2-property-addr"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${escapeHtml(p?.name || item.prop)}</p>
            <p class="maint-v2-property-tenant"><i data-lucide="home" class="w-3.5 h-3.5"></i> ${escapeHtml(unitLabel)}</p>
            <p class="maint-v2-property-phone"><i data-lucide="building-2" class="w-3.5 h-3.5"></i> ${escapeHtml(p?.address || '')}</p>
        </div>
        ${landlordChatId != null ? `
        <button type="button" data-go="chat" data-chat="${landlordChatId}" class="maint-v2-property-msg">
            <i data-lucide="message-circle" class="w-5 h-5"></i>
            <span>Message landlord</span>
        </button>` : ''}
    </div>`;
}

function renderMaintTenantAwaitingCard() {
    return `
    <div class="card maint-v2-awaiting">
        <div class="maint-v2-awaiting-icon"><i data-lucide="clock" class="w-5 h-5"></i></div>
        <div>
            <p class="maint-v2-awaiting-title">Awaiting contractor</p>
            <p class="maint-v2-awaiting-sub">Your landlord has been notified and will arrange a contractor for this issue.</p>
        </div>
    </div>`;
}

function renderMaintTenantContractorCard(item, contractorJob, chatId) {
    const contractor = getContractorForItem(item);
    const visual = contractor ? (typeof resolveContractorTrade === 'function' ? resolveContractorTrade(contractor) : contractorTradeVisual(item.contractor)) : contractorTradeVisual(item.contractor);
    const visitLine = contractorJob?.visitDate && contractorJob.visitDate !== 'Not scheduled'
        ? `Visit scheduled ${contractorJob.visitDate}`
        : (item.contractor && item.contractor !== '—' ? 'Assigned to your job' : '');
    return `
    <div class="card maint-v2-tenant-contractor">
        <p class="maint-v2-section-title">Your contractor</p>
        <div class="maint-v2-tenant-contractor-main">
            <img src="${contractor?.img || contractorAvatarForTrade(contractor?.tradeId || visual?.id || 'general')}" alt="" class="maint-v2-tenant-contractor-avatar">
            <div class="min-w-0 flex-1">
                <p class="maint-v2-tenant-contractor-name">${escapeHtml(item.contractor)}</p>
                ${contractor && typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(contractor) : ''}
                ${visitLine ? `<p class="maint-v2-tenant-contractor-meta">${escapeHtml(visitLine)}</p>` : ''}
            </div>
        </div>
        <div class="ctr-card-actions maint-v2-tenant-contractor-actions">
            ${contractor ? `<button type="button" data-action="view-contractor-profile" data-cid="${contractor.id}" class="ctr-card-action"><i data-lucide="user" class="w-4 h-4"></i><span>Profile</span></button>` : ''}
            ${chatId != null ? `<button type="button" data-go="chat" data-chat="${chatId}" class="ctr-card-action"><i data-lucide="message-square" class="w-4 h-4"></i><span>Message contractor</span></button>` : ''}
        </div>
        <p class="maint-v2-tenant-contractor-note">Message your landlord to reschedule or change contractor.</p>
    </div>`;
}

function renderMaintPropertyContactCard(item) {
    const pid = item.propertyId ?? STATE.propertyId ?? 0;
    const p = PROPERTIES[pid];
    const tenant = getMaintTenantForItem(item);
    const tenantRecord = tenant ? TENANTS[tenant.id] : null;
    const chatId = tenant ? getTenantChatId(tenant.id) : null;
    const cover = typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(pid) : IMG.props[pid];
    const address = `${p?.name || item.prop}${item.unit && item.unit !== '—' ? `, ${item.unit}` : ''}`;
    const msgAttrs = chatId != null
        ? `data-go="chat" data-chat="${chatId}"`
        : (tenant ? `data-action="start-tenant-chat" data-tid="${tenant.id}"` : '');
    return `
    <div class="card maint-v2-property-card">
        <img src="${cover}" alt="" class="maint-v2-property-img">
        <div class="maint-v2-property-copy min-w-0 flex-1">
            <p class="maint-v2-property-addr"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${escapeHtml(address)}</p>
            ${tenant ? `
            <p class="maint-v2-property-tenant"><i data-lucide="user" class="w-3.5 h-3.5"></i> ${escapeHtml(tenant.name)}</p>
            ${tenantRecord?.phone ? `<p class="maint-v2-property-phone"><i data-lucide="phone" class="w-3.5 h-3.5"></i> ${escapeHtml(tenantRecord.phone)}</p>` : ''}` : `
            <p class="maint-v2-property-tenant"><i data-lucide="building-2" class="w-3.5 h-3.5"></i> Landlord logged issue</p>`}
        </div>
        ${tenant && msgAttrs ? `
        <button type="button" ${msgAttrs} class="maint-v2-property-msg">
            <i data-lucide="message-circle" class="w-5 h-5"></i>
            <span>Message tenant</span>
        </button>` : ''}
    </div>`;
}

function renderMaintIssueCard(item, categoryMeta) {
    const reportedWhen = item.reportedAt || item.time || 'Recently';
    const reqId = `#REQ-${String((item.id ?? 0) + 1).padStart(3, '0')}`;
    return `
    <div class="card maint-v2-issue-card">
        <span class="maint-v2-cat-badge" style="background:${categoryMeta.bg};color:${categoryMeta.color}">${escapeHtml((categoryMeta.label || categoryMeta.shortLabel).split(' & ')[0])}</span>
        <div class="maint-v2-issue-main">
            <div class="maint-v2-issue-icon" style="background:${categoryMeta.bg};color:${categoryMeta.color}">
                <i data-lucide="${categoryMeta.icon}" class="w-6 h-6"></i>
            </div>
            <div class="min-w-0 flex-1">
                <h2 class="maint-v2-issue-title">${escapeHtml(item.issue)}</h2>
                <p class="maint-v2-issue-meta">Reported ${escapeHtml(reportedWhen)} · ${reqId}</p>
            </div>
        </div>
        <p class="maint-v2-issue-desc">${escapeHtml(item.desc || item.issue)}</p>
        ${renderMaintDetailMediaGallery(item)}
        <p class="maint-v2-paid-line">${maintPaidByLabel(item)}</p>
    </div>`;
}

function renderMaintProgressStepperV2(item, contractorJob) {
    const tenantReport = isTenantMaintReport(item);
    const assigned = item.contractor && item.contractor !== '—';
    let active = 0;
    if (item.status === 'done' || contractorJob?.status === 'paid') active = 3;
    else if (contractorJob) {
        const s = contractorJob.status;
        if (['in_progress', 'waiting_approval', 'approved'].includes(s)) active = 2;
        else if (['accepted', 'scheduled'].includes(s)) active = 2;
        else if (assigned || s === 'assigned') active = 1;
    } else if (item.status === 'progress') active = 2;
    else if (assigned) active = 1;
    const visitDetail = contractorJob?.visitDate && contractorJob.visitDate !== 'Not scheduled'
        ? contractorJob.visitDate
        : (assigned && contractorJob ? 'Visit pending' : '');
    const workflowDetail = contractorJob ? getMaintWorkflowLabel(item, contractorJob) : '';
    const steps = [
        { label: tenantReport ? 'Reported' : 'Reported', detail: item.reportedAt || item.time || '' },
        { label: 'Assigned', detail: assigned ? item.contractor : '' },
        { label: 'In progress', detail: visitDetail || (active >= 2 ? workflowDetail : '') },
        { label: 'Done', detail: item.status === 'done' ? 'Resolved' : '' },
    ];
    return `
    <div class="card maint-v2-progress">
        <p class="maint-v2-section-title">Progress</p>
        <div class="maint-v2-stepper">
            ${steps.map((step, i) => `
            ${i > 0 ? `<div class="maint-v2-step-connector ${i <= active ? 'maint-v2-step-connector--done' : ''}" aria-hidden="true"></div>` : ''}
            <div class="maint-v2-step ${i <= active ? 'maint-v2-step--done' : ''} ${i === active ? 'maint-v2-step--current' : ''}">
                <div class="maint-v2-step-dot">${i < active ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}</div>
                <p class="maint-v2-step-label">${step.label}</p>
                ${step.detail && i <= active ? `<p class="maint-v2-step-detail">${escapeHtml(step.detail)}</p>` : ''}
            </div>`).join('')}
        </div>
    </div>`;
}

function renderMaintAssignContractorSection(item, limit = 3) {
    if (item.status === 'done') return '';
    if (item.contractor && item.contractor !== '—') return '';
    const tradeMeta = resolveMaintTradeCategory(item);
    const sorted = [...CONTRACTORS].sort((a, b) => {
        if (a.tradeId === tradeMeta.id) return -1;
        if (b.tradeId === tradeMeta.id) return 1;
        return a.name.localeCompare(b.name);
    }).slice(0, limit);
    return `
    <div class="maint-v2-section">
        <div class="maint-v2-section-head">
            <div>
                <h3>Assign contractor</h3>
                <p class="maint-v2-section-sub">Suggested for ${escapeHtml(tradeMeta.shortLabel)}</p>
            </div>
            <button type="button" data-action="go-assign-contractor" class="maint-v2-link maint-v2-link--green">View all</button>
        </div>
        <div class="maint-v2-contractor-list">
            ${sorted.map(c => {
                const isAssigned = item.contractor === c.name;
                return `
            <div class="maint-v2-contractor-row card${isAssigned ? ' maint-v2-contractor-row--assigned' : ''}">
                <button type="button" data-action="view-contractor-profile" data-cid="${c.id}" class="maint-v2-contractor-main w-full text-left">
                    <img src="${c.img}" alt="" class="maint-v2-contractor-avatar">
                    <span class="min-w-0 flex-1">
                        <span class="maint-v2-contractor-name">${escapeHtml(c.name)}</span>
                        <span class="maint-v2-contractor-trade-row">${typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(c) : ''}</span>
                    </span>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
                </button>
                ${isAssigned
                    ? `<span class="maint-v2-assign-btn maint-v2-assign-btn--assigned">Assigned</span>`
                    : `<button type="button" data-action="assign-contractor" data-cid="${c.id}" class="maint-v2-assign-btn">Assign</button>`}
            </div>`;
            }).join('')}
        </div>
    </div>`;
}

function renderMaintDetailFooter(item, contractorJob) {
    if (item.status === 'done') return '';
    const needsAssign = (!item.contractor || item.contractor === '—') && !contractorJob;
    if (needsAssign) return '';
    if (contractorJob?.status === 'waiting_approval') {
        return `
        <div class="maint-v2-footer">
            <button type="button" data-action="approve-maint-work" data-mid="${item.id}" class="btn-primary w-full maint-v2-footer-btn">Approve work</button>
        </div>`;
    }
    if (contractorJob?.status === 'approved' && getMaintPaidBy(item) === 'landlord') {
        const unpaid = contractorInvoiceForJob(contractorJob);
        if (!unpaid) return '';
        return `
        <div class="maint-v2-footer">
            <button type="button" data-action="pay-maint-stripe" data-cid="${unpaid.id}" class="btn-primary w-full maint-v2-footer-btn">Pay via Stripe</button>
        </div>`;
    }
    return '';
}

function renderMaintCategoryPicker(selectedId = '') {
    if (typeof CONTRACTOR_TRADE_CATALOG === 'undefined') return '';
    const selected = selectedId || STATE.logMaintCategoryId || 'general';
    return `
    <div class="form-group">
        <label class="form-label">Issue type</label>
        <select data-field="categoryId" data-log-maint-category class="form-input form-select maint-cat-select">
            ${CONTRACTOR_TRADE_CATALOG.map(meta => `
            <option value="${meta.id}" ${selected === meta.id ? 'selected' : ''}>${meta.shortLabel} — ${meta.label}</option>`).join('')}
        </select>
    </div>`;
}

function suggestContractorForIssue(item) {
    const text = `${item?.issue || ''} ${item?.desc || ''}`.toLowerCase();
    if (typeof CONTRACTOR_TRADE_CATALOG !== 'undefined') {
        let bestMeta = null;
        let bestScore = 0;
        CONTRACTOR_TRADE_CATALOG.forEach(meta => {
            const score = meta.keywords.filter(k => text.includes(k)).length;
            if (score > bestScore) {
                bestScore = score;
                bestMeta = meta;
            }
        });
        if (bestMeta && bestScore > 0) {
            const match = CONTRACTORS.find(c => c.tradeId === bestMeta.id);
            if (match) return match;
        }
    }
    if (/boiler|radiator|heat|gas|hot water/.test(text)) return CONTRACTORS.find(c => c.tradeId === 'heating') || CONTRACTORS[1];
    if (/light|electric|flicker|socket|fuse/.test(text)) return CONTRACTORS.find(c => c.tradeId === 'electrical') || CONTRACTORS[2];
    if (/sink|tap|leak|pipe|plumb|water|damp|basin|toilet/.test(text)) return CONTRACTORS.find(c => c.tradeId === 'plumbing') || CONTRACTORS[0];
    if (/paint|peel|wallpaper|decorat/.test(text)) return CONTRACTORS.find(c => c.tradeId === 'painting');
    if (/window|door|latch|lock/.test(text)) return CONTRACTORS.find(c => c.tradeId === 'general' || c.tradeId === 'carpentry');
    return CONTRACTORS[0];
}

function renderMaintTenantComplaint(item) {
    const tenant = getMaintTenantForItem(item);
    const tenantName = item.tenantName || tenant?.name;
    if (!isTenantMaintReport(item) && !tenantName) return '';
    const chatId = tenant ? getTenantChatId(tenant.id) : null;
    const reportedWhen = item.reportedAt || item.time || 'Recently';
    return `
    <div class="maint-tenant-complaint card">
        <div class="maint-tenant-complaint-head">
            <div>
                <p class="maint-tenant-complaint-label">Tenant complaint</p>
                <p class="maint-tenant-complaint-who">${tenantName || 'Tenant'}${item.unit && item.unit !== '—' ? ` · ${item.unit}` : ''}</p>
            </div>
            ${chatId != null ? `<button data-go="chat" data-chat="${chatId}" class="maint-tenant-complaint-chat">Message tenant</button>` : ''}
        </div>
        <p class="maint-tenant-complaint-text">"${item.desc || item.issue}"</p>
        ${renderMaintReportMedia(item, { title: 'Tenant photos & videos', compact: true })}
        <p class="maint-tenant-complaint-meta">Reported ${reportedWhen}</p>
    </div>`;
}

function getContractorForItem(item) {
    return CONTRACTORS.find(c => c.name === item?.contractor);
}

function contractorTradeVisual(contractorName) {
    const c = getContractorForItem({ contractor: contractorName });
    const meta = typeof resolveContractorTrade === 'function' ? resolveContractorTrade(c) : null;
    if (meta) return { icon: meta.icon, bg: meta.bg, color: meta.color };
    const trade = c?.trade || 'General';
    const map = {
        Plumbing: { icon: 'wrench', bg: '#EFF6FF', color: '#2563EB' },
        Heating: { icon: 'flame', bg: '#FFF7ED', color: '#EA580C' },
        Electrical: { icon: 'zap', bg: '#FEF9C3', color: '#CA8A04' },
    };
    return map[trade] || { icon: 'hard-hat', bg: '#F1F5F9', color: '#64748B' };
}

function getContractorJobForMaint(maintId) {
    if (typeof CONTRACTOR_JOBS === 'undefined' || maintId == null) return null;
    return CONTRACTOR_JOBS.find(j => j.maintId === maintId) || null;
}

function contractorInvoiceForJob(job) {
    if (!job || typeof AppStore === 'undefined') return null;
    return AppStore.contractorInvoices?.find(i => i.maintId === job.maintId && i.status === 'Unpaid') || null;
}

function renderSharedJobStatusBadges(job, item) {
    if (!job || typeof contractorStatusStyle !== 'function') return '';
    const st = contractorStatusStyle(job.status);
    const [pBg, pColor] = maintPriorityStyle(item?.priority || job.priority);
    const communal = typeof contractorJobIsCommunal === 'function' ? contractorJobIsCommunal(job) : false;
    return `
    <div class="flex gap-2 flex-wrap maint-job-badges">
        <span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
        <span class="badge" style="background:${pBg};color:${pColor}">${item?.priority || job.priority}</span>
        ${communal ? '<span class="badge" style="background:#E0E7FF;color:#4338CA">Communal</span>' : ''}
    </div>`;
}

function renderSharedJobVisitCard(job) {
    if (!job) return '';
    const visitPending = !job.visitDate || job.visitDate === 'Not scheduled';
    return `
    <div class="card p-4">
        <p class="ctr-section-label">Visit</p>
        <p class="text-[14px] font-bold text-[#0F172A] mt-1">${visitPending ? 'Not scheduled yet' : job.visitDate}</p>
        ${job.scheduleNotes ? `<p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">${job.scheduleNotes}</p>` : ''}
        ${visitPending ? `<p class="text-[12px] text-[#94A3B8] mt-2">Contractor will confirm a visit time in their app.</p>` : ''}
    </div>`;
}

function renderSharedJobPeopleCard(job, item, role) {
    if (!job) return '';
    const contractorName = item?.contractor && item.contractor !== '—' ? item.contractor : (job.contractorName || '—');
    if (role === 'tenant') {
        return `
        <div class="card p-4">
            <p class="ctr-section-label">People</p>
            <p class="text-[13px] font-semibold mt-1">Contractor: ${contractorName}</p>
            <p class="text-[14px] text-[#64748B] mt-1">Landlord: ${job.landlord || '—'}</p>
        </div>`;
    }
    return `
    <div class="card p-4">
        <p class="ctr-section-label">People</p>
        <p class="text-[13px] font-semibold mt-1">Tenant: ${job.tenant || '—'}</p>
        <p class="text-[14px] text-[#64748B] mt-1">Contractor: ${contractorName}</p>
    </div>`;
}

function renderSharedJobInvoiceCard(job, role, item) {
    if (!job) return '';
    const unpaid = contractorInvoiceForJob(job);
    const paidBy = item ? getMaintPaidBy(item) : 'landlord';
    const payerLabel = paidBy === 'tenant' ? 'Tenant' : 'Landlord';
    if (job.invoice) {
        const awaiting = job.status === 'waiting_approval';
        const awaitingPay = job.status === 'approved';
        const canPay = (role === 'landlord' && paidBy === 'landlord') || (role === 'tenant' && paidBy === 'tenant');
        return `
        <div class="card p-4">
            <p class="ctr-section-label">Invoice</p>
            <p class="maint-paid-by-line">${payerLabel} pays · Stripe</p>
            <div class="flex items-center justify-between gap-3 py-2">
                <div class="min-w-0">
                    <p class="text-[14px] font-bold">${job.invoice.amount}</p>
                    <p class="text-[13px] text-[#64748B]">${job.invoice.file} · ${job.invoice.uploadedAt}</p>
                </div>
                ${awaiting
                    ? '<span class="badge shrink-0" style="background:#EFF6FF;color:#2563EB">Review</span>'
                    : awaitingPay
                        ? '<span class="badge shrink-0" style="background:#EFF6FF;color:#2563EB">Pay now</span>'
                        : '<i data-lucide="check-circle" class="w-6 h-6 text-[#16A34A] shrink-0"></i>'}
            </div>
            ${role === 'landlord' && awaiting
                ? `<p class="text-[12px] text-[#64748B] mt-2">Review the invoice below, then approve from the action at the bottom of the screen.</p>`
                : ''}
            ${awaitingPay && canPay && unpaid
                ? `<button type="button" data-action="pay-maint-stripe" data-cid="${unpaid.id}" class="btn-primary w-full py-3 text-[13px] mt-3">Pay ${unpaid.amount} with Stripe</button>`
                : ''}
            ${awaitingPay && role === 'landlord' && paidBy === 'tenant'
                ? `<p class="text-[12px] text-[#64748B] mt-2">Waiting for tenant to pay via Stripe.</p>`
                : ''}
            ${awaitingPay && role === 'tenant' && paidBy === 'landlord'
                ? `<p class="text-[12px] text-[#64748B] mt-2">Your landlord will complete payment.</p>`
                : ''}
        </div>`;
    }
    if (role === 'landlord' && job.status === 'waiting_approval') {
        return `
        <div class="card p-4">
            <p class="ctr-section-label">Invoice</p>
            <p class="text-[13px] text-[#64748B]">Contractor submitted work — review and approve.</p>
        </div>`;
    }
    return '';
}

function renderSharedJobProgress(job) {
    if (!job || typeof contractorTimeline !== 'function') return '';
    return `
    <p class="ctr-section-label maint-job-progress-label">Progress</p>
    ${contractorTimeline(job.status)}`;
}

function renderSharedMaintJobPanel(item, job, role = 'landlord') {
    if (!job) return '';
    return renderSharedJobInvoiceCard(job, role, item);
}

function renderMaintAssignmentStatus(item, contractorJob) {
    const assigned = item.contractor && item.contractor !== '—';
    const inProgress = item.status === 'progress';
    const resolved = item.status === 'done';
    const visit = contractorJob?.visitDate || '';
    let thirdLabel = 'Work in progress';
    let thirdDetail = 'Pending';
    if (resolved) {
        thirdLabel = 'Resolved';
        thirdDetail = item.resolvedAt || 'Completed';
    } else if (inProgress) {
        thirdDetail = visit || 'On site';
    } else if (assigned) {
        thirdLabel = 'Awaiting work';
        thirdDetail = visit || 'Ready to start';
    }
    const steps = [
        { label: 'Tenant reported', done: true, detail: item.reportedAt || item.time || '', icon: 'user' },
        { label: 'Contractor assigned', done: assigned, detail: assigned ? 'Confirmed' : 'Pending', icon: 'hard-hat' },
        { label: thirdLabel, done: resolved, detail: thirdDetail, icon: resolved ? 'check-circle' : 'wrench' },
    ];
    const currentIdx = steps.findIndex(s => !s.done);
    return `
    <div class="maint-progress card">
        <p class="maint-progress-title">What happens next</p>
        <div class="maint-progress-track">
            ${steps.map((s, i) => {
                const isCurrent = currentIdx === i;
                return `
            <div class="maint-progress-step ${s.done ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}">
                <div class="maint-progress-rail" aria-hidden="true">
                    <span class="maint-progress-dot">${s.done ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : `<i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>`}</span>
                    ${i < steps.length - 1 ? `<span class="maint-progress-line ${s.done ? 'is-done' : ''}"></span>` : ''}
                </div>
                <div class="maint-progress-copy">
                    <p class="maint-progress-label">${s.label}</p>
                    <p class="maint-progress-meta">${s.detail}</p>
                </div>
            </div>`;
            }).join('')}
        </div>
    </div>`;
}

function renderMaintContractorCard(item, contractorJob, chatId) {
    const contractor = getContractorForItem(item);
    const visitLine = contractorJob?.visitDate && contractorJob.visitDate !== 'Not scheduled'
        ? `Visit ${contractorJob.visitDate}`
        : 'Visit not scheduled';
    return `
    <div class="maint-contractor-card card">
        <button type="button" data-action="view-contractor-profile" data-cid="${contractor?.id ?? ''}" class="maint-contractor-card-top w-full text-left">
            <img src="${contractor?.img || (typeof contractorAvatarForTrade === 'function' ? contractorAvatarForTrade(contractor?.tradeId || 'general') : '')}" alt="" class="maint-contractor-photo">
            <div class="maint-contractor-info min-w-0">
                <p class="maint-contractor-name">${escapeHtml(item.contractor)}</p>
                <div class="maint-contractor-tags">
                    ${contractor && typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(contractor) : `<span class="maint-contractor-trade">${escapeHtml(contractor?.category || contractor?.trade || 'Contractor')}</span>`}
                </div>
                <p class="maint-contractor-status">${escapeHtml(visitLine)}</p>
            </div>
            <i data-lucide="chevron-right" class="maint-contractor-chevron w-4 h-4"></i>
        </button>
        <div class="maint-contractor-bar">
            ${chatId != null ? `<button type="button" data-go="chat" data-chat="${chatId}" class="maint-contractor-bar-btn maint-contractor-bar-btn--primary"><i data-lucide="message-square" class="w-4 h-4"></i><span>Message contractor</span></button>` : ''}
            ${contractor?.phone ? `<button type="button" data-action="call-contractor" data-phone="${contractor.phone.replace(/"/g, '')}" class="maint-contractor-bar-btn"><i data-lucide="phone" class="w-4 h-4"></i><span>Call</span></button>` : ''}
        </div>
    </div>`;
}

function maintTimelineIcon(event) {
    const key = String(event || '').toLowerCase();
    if (key.includes('report')) return 'alert-circle';
    if (key.includes('assign')) return 'hard-hat';
    if (key.includes('progress')) return 'wrench';
    if (key.includes('complete') || key.includes('resolved')) return 'check-circle';
    if (key.includes('note')) return 'sticky-note';
    return 'circle';
}

function renderMaintWorkNotes(item, contractorJob) {
    const blocks = [];
    if (contractorJob?.scheduleNotes?.trim()) {
        blocks.push({ label: 'Visit note', text: contractorJob.scheduleNotes.trim(), time: contractorJob.visitDate || '' });
    }
    (contractorJob?.notes || []).forEach(n => {
        if (n.text?.trim()) blocks.push({ label: 'Contractor note', text: n.text.trim(), time: n.time || '' });
    });
    if (!blocks.length) return '';
    return `
    <div class="screen-list-header"><div><h2>Work notes</h2><p>${blocks.length} on file</p></div></div>
    <div class="card note-block-list">
        ${blocks.map(b => `
        <div class="note-block-item">
            <p class="note-block-label">${b.label}</p>
            <p class="note-block-text">${b.text}</p>
            ${b.time ? `<p class="note-block-meta">${b.time}</p>` : ''}
        </div>`).join('')}
    </div>`;
}

function renderMaintTimeline(timeline) {
    if (!timeline.length) return '';
    return `
    <div class="screen-list-header"><div><h2>Timeline</h2></div></div>
    <div class="card maint-timeline">
        ${timeline.slice(0, 5).map(([title, detail], idx) => `
        <div class="maint-timeline-item${idx < Math.min(timeline.length, 5) - 1 ? ' maint-timeline-item--border' : ''}">
            <span class="maint-timeline-icon"><i data-lucide="${maintTimelineIcon(title)}" class="w-4 h-4"></i></span>
            <div class="maint-timeline-body">
                <p class="maint-timeline-title">${title}</p>
                <p class="maint-timeline-meta">${detail}</p>
            </div>
        </div>`).join('')}
    </div>`;
}

function getTenantChatId(tenantId) {
    const listItem = TENANT_LIST.find(x => x.id === tenantId);
    if (listItem?.chatId != null) return listItem.chatId;
    const t = TENANTS[tenantId];
    if (!t) return null;
    const name = `${t.firstName} ${t.lastName}`;
    const conv = CONVERSATIONS.find(c => c.name === name);
    return conv?.id ?? null;
}

function getChatContactPhone(conv) {
    if (!conv?.name) return null;
    const tenant = TENANTS.find(t => `${t.firstName} ${t.lastName}` === conv.name);
    if (tenant?.phone) return tenant.phone;
    const contractor = typeof CONTRACTORS !== 'undefined'
        ? CONTRACTORS.find(c => c.name === conv.name)
        : null;
    if (contractor?.phone) return contractor.phone;
    return null;
}

function chatViewerKey() {
    return STATE.userRole === 'tenant' ? 'tenant'
        : STATE.userRole === 'contractor' ? 'contractor'
        : 'landlord';
}

function isJobGroupChat(conv) {
    return !!(conv?.isGroup);
}

function conversationVisibleToViewer(c) {
    if (!c) return false;
    const key = chatViewerKey();
    return !(c.leftFor || []).includes(key);
}

function chatIsEnded(conv) {
    return !!conv?.ended;
}

function chatIsMuted(conv, viewerKey = chatViewerKey()) {
    return (conv?.mutedFor || []).includes(viewerKey);
}

function getChatSenderName() {
    if (STATE.userRole === 'landlord') return `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
    if (STATE.userRole === 'tenant') {
        const tenant = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
        return tenant?.name || 'Tenant';
    }
    if (STATE.userRole === 'contractor' && typeof CONTRACTOR_USER !== 'undefined') {
        return CONTRACTOR_USER.company || `${CONTRACTOR_USER.firstName} ${CONTRACTOR_USER.lastName}`.trim();
    }
    return 'You';
}

function getJobChatMaintItem(conv) {
    if (conv?.maintId == null) return null;
    return MAINTENANCE_ITEMS.find(m => m.id === conv.maintId) || null;
}

function isJobChatMaintComplete(conv) {
    const item = getJobChatMaintItem(conv);
    return item?.status === 'done';
}

function endJobGroupChatForMaint(maintId, { auto = false, silent = false } = {}) {
    const c = CONVERSATIONS.find(conv => conv.isGroup && conv.maintId === maintId);
    if (!c || c.ended) return;
    c.ended = true;
    ensureChatMessageIds(c);
    c.messages.push({
        id: `m-${c.id}-sys-${Date.now()}`,
        type: 'system',
        text: auto
            ? 'This job is complete. The chat is now read-only.'
            : 'This job chat has been ended. You can read messages but cannot send new ones.',
        time: formatEventTime(),
    });
    c.preview = auto ? 'Job complete · chat ended' : 'Job chat ended';
    syncConversationsToStore();
    AppStore.save();
    if (!silent) toast(auto ? 'Job chat closed — job complete' : 'Job chat ended');
}

function ensureJobChatEndedIfComplete(conv) {
    if (!isJobGroupChat(conv) || chatIsEnded(conv) || conv.maintId == null) return;
    if (isJobChatMaintComplete(conv)) endJobGroupChatForMaint(conv.maintId, { auto: true, silent: true });
}

function restoreJobChatAccess(conv) {
    if (!conv?.isGroup) return;
    const key = chatViewerKey();
    if (conv.leftFor?.length) conv.leftFor = conv.leftFor.filter(k => k !== key);
}

function hideChatFromInbox(conv) {
    const key = chatViewerKey();
    if (!conv.leftFor) conv.leftFor = [];
    if (!conv.leftFor.includes(key)) conv.leftFor.push(key);
}

function chatOptionRow(action, icon, label, sub = '', { danger = false } = {}) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `<button type="button" data-action="${action}" class="chat-opt-item${danger ? ' chat-opt-item--danger' : ''}">
        <span class="chat-opt-icon"><i data-lucide="${icon}" class="w-[18px] h-[18px]"></i></span>
        <span class="chat-opt-copy">
            <span class="chat-opt-label">${esc(label)}</span>
            ${sub ? `<span class="chat-opt-sub">${esc(sub)}</span>` : ''}
        </span>
    </button>`;
}

function chatOptionsSection(title, rowsHtml) {
    if (!rowsHtml) return '';
    return `<div class="chat-opt-section">
        ${title ? `<p class="chat-opt-section-title">${title}</p>` : ''}
        <div class="chat-opt-section-body">${rowsHtml}</div>
    </div>`;
}

function chatHeaderDisplayName(conv) {
    if (!conv) return '';
    if (isJobGroupChat(conv)) return conv.issueName || String(conv.name || '').replace(/\s*·\s*Job chat$/i, '') || 'Job chat';
    return conv.name || '';
}

function chatHeaderSubtitle(conv) {
    if (!conv) return '';
    if (isJobGroupChat(conv)) {
        const count = (conv.members || []).length;
        const ended = chatIsEnded(conv) ? ' · Ended' : '';
        const loc = conv.sub || 'Maintenance job';
        return `${count} member${count === 1 ? '' : 's'} · ${loc}${ended}`;
    }
    return conv.sub || '';
}

function ensureChatMessageIds(conv) {
    if (!conv?.messages) return;
    conv.messages.forEach((m, i) => {
        if (m.id == null) m.id = `m-${conv.id}-${i}`;
        if (!m.deletedFor) m.deletedFor = [];
    });
}

function chatMessageFlipped() {
    return STATE.userRole === 'tenant';
}

function chatMessageDisplayType(m, flipped = chatMessageFlipped(), conv = null) {
    if (!m || m.type === 'system') return 'system';
    if (conv?.isGroup) {
        if (m.senderRole) return m.senderRole === STATE.userRole ? 'out' : 'in';
        return STATE.userRole === 'landlord' ? m.type : (m.type === 'in' ? 'out' : 'in');
    }
    return flipped ? (m.type === 'in' ? 'out' : 'in') : m.type;
}

function isOwnChatMessage(m, conv = null) {
    if (!m) return false;
    if (conv?.isGroup) {
        if (m.senderRole) return m.senderRole === STATE.userRole;
        return STATE.userRole === 'landlord' ? m.type === 'out' : m.type === 'in';
    }
    if (STATE.userRole === 'landlord') return m.type === 'out';
    return m.type === 'in';
}

function chatMessageVisibleToViewer(m) {
    if (!m) return false;
    return !(m.deletedFor || []).includes(chatViewerKey());
}

function getChatMessageById(msgId) {
    const c = conversation(STATE.chatId);
    ensureChatMessageIds(c);
    return c?.messages?.find(m => m.id === msgId) || null;
}

function refreshConversationPreview(c) {
    if (!c?.messages?.length) {
        c.preview = 'No messages yet';
        return;
    }
    const visible = [...c.messages].reverse().filter(m => chatMessageVisibleToViewer(m));
    const last = visible[0];
    if (!last) {
        c.preview = 'No messages';
        return;
    }
    if (last.deletedForAll) {
        c.preview = 'Message deleted';
        return;
    }
    c.preview = last.text.length > 48 ? `${last.text.slice(0, 48)}…` : last.text;
    c.time = (last.time || '').replace(' · Sent', '') || c.time;
}

function openChatMessageMenu(msgId) {
    STATE.chatMessageMenuId = msgId;
    STATE.chatOptionsOpen = false;
    render();
}

function closeChatMessageMenu() {
    STATE.chatMessageMenuId = null;
    render();
}

function openChatOptionsMenu() {
    STATE.chatOptionsOpen = true;
    STATE.chatMessageMenuId = null;
    render();
}

function closeChatOptionsMenu() {
    STATE.chatOptionsOpen = false;
    render();
}

function copyChatMessage(msgId) {
    const m = getChatMessageById(msgId);
    if (!m || m.deletedForAll) return;
    const text = m.text || '';
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => toast('Message copied')).catch(() => toast('Message copied'));
    } else {
        toast('Message copied');
    }
    closeChatMessageMenu();
}

function deleteChatMessageForMe(msgId) {
    const c = conversation(STATE.chatId);
    const m = getChatMessageById(msgId);
    if (!c || !m) return;
    const key = chatViewerKey();
    if (!m.deletedFor) m.deletedFor = [];
    if (!m.deletedFor.includes(key)) m.deletedFor.push(key);
    refreshConversationPreview(c);
    syncConversationsToStore();
    AppStore.save();
    closeChatMessageMenu();
    toast('Message deleted for you');
}

function deleteChatMessageForEveryone(msgId) {
    const c = conversation(STATE.chatId);
    const m = getChatMessageById(msgId);
    if (!c || !m || !isOwnChatMessage(m, c) || m.deletedForAll) return;
    m.deletedForAll = true;
    m.text = '';
    refreshConversationPreview(c);
    syncConversationsToStore();
    AppStore.save();
    closeChatMessageMenu();
    toast('Message deleted for everyone');
}

function clearChatHistoryForMe() {
    const c = conversation(STATE.chatId);
    if (!c?.messages?.length) {
        closeChatOptionsMenu();
        return;
    }
    const key = chatViewerKey();
    c.messages.forEach(m => {
        if (!m.deletedFor) m.deletedFor = [];
        if (!m.deletedFor.includes(key)) m.deletedFor.push(key);
    });
    refreshConversationPreview(c);
    syncConversationsToStore();
    AppStore.save();
    closeChatOptionsMenu();
    toast('Chat cleared for you');
}

function leaveJobGroupChat() {
    const c = conversation(STATE.chatId);
    if (!isJobGroupChat(c)) return;
    if (STATE.userRole === 'landlord' && !chatIsEnded(c)) return;
    hideChatFromInbox(c);
    syncConversationsToStore();
    AppStore.save();
    closeChatOptionsMenu();
    toast(chatIsEnded(c) ? 'Chat removed from your inbox' : 'You left the job chat');
    go('messages');
}

function deleteChatForMe() {
    const c = conversation(STATE.chatId);
    if (!c) return;
    hideChatFromInbox(c);
    if (c.messages?.length) {
        const key = chatViewerKey();
        c.messages.forEach(m => {
            if (!m.deletedFor) m.deletedFor = [];
            if (!m.deletedFor.includes(key)) m.deletedFor.push(key);
        });
        refreshConversationPreview(c);
    }
    syncConversationsToStore();
    AppStore.save();
    closeChatOptionsMenu();
    toast('Chat deleted');
    go('messages');
}

function endJobGroupChat() {
    const c = conversation(STATE.chatId);
    if (!isJobGroupChat(c) || chatIsEnded(c) || STATE.userRole !== 'landlord') return;
    endJobGroupChatForMaint(c.maintId, { auto: false, silent: true });
    closeChatOptionsMenu();
    render();
}

function toggleJobChatMute(mute) {
    const c = conversation(STATE.chatId);
    if (!c) return;
    const key = chatViewerKey();
    if (!c.mutedFor) c.mutedFor = [];
    if (mute) {
        if (!c.mutedFor.includes(key)) c.mutedFor.push(key);
        toast('Notifications muted');
    } else {
        c.mutedFor = c.mutedFor.filter(k => k !== key);
        toast('Notifications unmuted');
    }
    syncConversationsToStore();
    AppStore.save();
    closeChatOptionsMenu();
    render();
}

function openJobFromChat() {
    const c = conversation(STATE.chatId);
    const item = getJobChatMaintItem(c);
    closeChatOptionsMenu();
    if (!item) { toast('Maintenance issue not found'); return; }
    go('maintenance-detail', { maintId: item.id });
}

function openChatMembers() {
    STATE.chatMembersOpen = true;
    STATE.chatOptionsOpen = false;
    render();
}

function closeChatMembers() {
    STATE.chatMembersOpen = false;
    render();
}

function renderChatMessageBubble(m, flipped = chatMessageFlipped(), conv = null) {
    if (!chatMessageVisibleToViewer(m)) return '';
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    if (m.type === 'system') {
        return `<div class="chat-system-msg"><p>${esc(m.text)}</p><span class="chat-system-time">${esc((m.time || '').replace(' · Sent', ''))}</span></div>`;
    }
    const displayType = chatMessageDisplayType(m, flipped, conv);
    if (m.deletedForAll) {
        return `<div class="chat-bubble-wrap chat-bubble-wrap--${displayType}"><div class="chat-bubble-${displayType} chat-bubble--deleted"><p>This message was deleted</p></div></div>`;
    }
    const showSender = conv?.isGroup && displayType === 'in' && m.sender;
    const timeLabel = (m.time || '').replace(' · Sent', '');
    return `
    <div class="chat-bubble-wrap chat-bubble-wrap--${displayType}">
        ${showSender ? `<p class="chat-sender">${esc(m.sender)}</p>` : ''}
        <button type="button" data-action="chat-message-menu" data-msg-id="${esc(m.id)}" class="chat-bubble-${displayType} chat-bubble-btn">
            <p>${esc(m.text)}</p>
        </button>
        <span class="chat-time">${esc(timeLabel)}${displayType === 'out' ? ' · Sent' : ''}</span>
    </div>`;
}

const chatMessageActionSheet = () => {
    if (!STATE.chatMessageMenuId) return '';
    const c = conversation(STATE.chatId);
    const m = getChatMessageById(STATE.chatMessageMenuId);
    if (!m) return '';
    const own = isOwnChatMessage(m, c);
    const canDeleteAll = own && !m.deletedForAll && m.type !== 'system';
    return `<div class="modal-overlay open" data-action="close-chat-message-menu">
        <div class="photo-action-sheet chat-action-sheet">
            ${!m.deletedForAll && m.type !== 'system' ? `<button type="button" data-action="copy-chat-message" data-msg-id="${m.id}" class="photo-action-item">Copy message</button>` : ''}
            ${m.type !== 'system' ? `<button type="button" data-action="delete-chat-for-me" data-msg-id="${m.id}" class="photo-action-item">Delete for me</button>` : ''}
            ${canDeleteAll ? `<button type="button" data-action="delete-chat-for-all" data-msg-id="${m.id}" class="photo-action-item danger">Delete for everyone</button>` : ''}
            <button type="button" data-action="close-chat-message-menu" class="photo-action-item cancel">Cancel</button>
        </div>
    </div>`;
};

const chatMembersSheet = () => {
    if (!STATE.chatMembersOpen || STATE.screen !== 'chat') return '';
    const c = conversation(STATE.chatId);
    if (!isJobGroupChat(c)) return '';
    const members = c.members || [];
    const roleFor = (name) => {
        const landlordName = `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
        if (name === landlordName) return 'Landlord';
        const contractor = CONTRACTORS.find(x => x.name === name);
        if (contractor) return typeof resolveContractorTrade === 'function' ? resolveContractorTrade(contractor).shortLabel : 'Contractor';
        return 'Tenant';
    };
    return `<div class="modal-overlay open" data-action="close-chat-members">
        <div class="chat-members-sheet">
            <div class="chat-members-head">
                <p class="chat-members-title">Job chat members</p>
                <button type="button" data-action="close-chat-members" class="chat-members-close" aria-label="Close"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <p class="chat-members-sub">${escapeHtml(chatHeaderDisplayName(c))}</p>
            <div class="chat-members-list">
                ${members.map(name => `
                <div class="chat-members-row">
                    <span class="chat-members-avatar"><i data-lucide="user" class="w-4 h-4"></i></span>
                    <div class="min-w-0">
                        <p class="chat-members-name">${escapeHtml(name)}</p>
                        <p class="chat-members-role">${escapeHtml(roleFor(name))}</p>
                    </div>
                </div>`).join('')}
            </div>
            <button type="button" data-action="close-chat-members" class="btn-secondary w-full py-3 text-[13px] mt-3">Done</button>
        </div>
    </div>`;
};

const chatOptionsActionSheet = () => {
    if (!STATE.chatOptionsOpen || STATE.screen !== 'chat') return '';
    const c = conversation(STATE.chatId);
    if (!c) return '';
    const isGroup = isJobGroupChat(c);
    const ended = chatIsEnded(c) || (isGroup && isJobChatMaintComplete(c));
    const muted = chatIsMuted(c);
    const role = STATE.userRole;
    const maintItem = isGroup ? getJobChatMaintItem(c) : null;
    const jobComplete = maintItem?.status === 'done';
    const sheetTitle = isGroup ? 'Job chat' : 'Chat options';
    const sheetSub = isGroup
        ? (ended ? (jobComplete ? 'Job complete · read-only' : 'Chat ended · read-only') : 'Coordinate access and updates')
        : '';

    const sections = [];

    if (isGroup) {
        const jobRows = [];
        if (maintItem) {
            const statusLabel = jobComplete ? 'Completed' : (maintItem.status === 'progress' ? 'In progress' : 'Open');
            jobRows.push(chatOptionRow('open-job-from-chat', 'wrench', 'View maintenance issue', statusLabel));
        }
        jobRows.push(chatOptionRow('chat-members', 'users', `Members (${(c.members || []).length})`, 'Landlord, tenant & contractor'));
        sections.push(chatOptionsSection('Job', jobRows.join('')));
    }

    sections.push(chatOptionsSection('Notifications', chatOptionRow(
        muted ? 'unmute-job-chat' : 'mute-job-chat',
        muted ? 'bell' : 'bell-off',
        muted ? 'Unmute notifications' : 'Mute notifications',
        muted ? 'Alerts are off for this chat' : 'Silence alerts from this chat',
    )));

    const manageRows = [
        chatOptionRow('clear-chat-history', 'eraser', 'Clear messages for me', 'Hide message history on this device'),
    ];
    if (isGroup) {
        if (role === 'landlord' && !ended) {
            manageRows.push(chatOptionRow('end-job-chat', 'lock', 'End job chat', 'Mark read-only for everyone', { danger: true }));
        }
        if (role !== 'landlord') {
            manageRows.push(chatOptionRow('leave-job-chat', 'log-out', 'Leave chat', ended ? 'Remove from your inbox' : 'Hide from inbox — reopen from the job', { danger: true }));
        }
        if (role === 'landlord' && ended) {
            manageRows.push(chatOptionRow('leave-job-chat', 'archive', 'Remove from inbox', 'Hide this ended chat', { danger: true }));
        }
    }
    manageRows.push(chatOptionRow('delete-chat', 'trash-2', 'Delete chat', 'Remove from inbox and clear messages', { danger: true }));
    sections.push(chatOptionsSection('Manage', manageRows.join('')));

    return `<div class="modal-overlay open" data-action="close-chat-options">
        <div class="chat-options-sheet">
            <div class="chat-options-head">
                <p class="chat-options-title">${sheetTitle}</p>
                ${sheetSub ? `<p class="chat-options-sub">${sheetSub}</p>` : ''}
            </div>
            ${sections.join('')}
            <button type="button" data-action="close-chat-options" class="chat-opt-cancel">Cancel</button>
        </div>
    </div>`;
};

function sendChatMessage() {
    const input = document.querySelector('[data-chat-input]');
    const text = (input?.value || STATE.chatDraft || '').trim();
    if (!text) return;
    const c = conversation(STATE.chatId);
    if (!c) return;
    if (isJobGroupChat(c) && chatIsEnded(c)) {
        toast('This job chat has ended');
        return;
    }
    ensureChatMessageIds(c);
    const time = formatEventTime();
    const isLandlord = STATE.userRole === 'landlord';
    const isGroup = isJobGroupChat(c);
    const msg = {
        id: `m-${c.id}-${Date.now()}`,
        type: isGroup ? 'in' : (isLandlord ? 'out' : 'in'),
        text,
        time: `${time} · Sent`,
        deletedFor: [],
    };
    if (isGroup) {
        msg.sender = getChatSenderName();
        msg.senderRole = STATE.userRole;
    }
    c.messages.push(msg);
    c.preview = text.length > 48 ? `${text.slice(0, 48)}…` : text;
    c.time = time;
    c.unread = 0;
    STATE.chatDraft = '';
    syncConversationsToStore();
    AppStore.save();
    render();
    setTimeout(() => {
        const box = document.querySelector('.chat-messages');
        if (box) box.scrollTop = box.scrollHeight;
    }, 50);
}

function markConversationRead(chatId) {
    const c = CONVERSATIONS.find(x => x.id === chatId);
    if (c) c.unread = 0;
}

function addMaintHistoryEvent(item, event, detail) {
    if (!item.history) item.history = [];
    item.history.unshift({ event, detail, time: formatEventDate() });
}

function initMaintenanceHistory() {
    MAINTENANCE_ITEMS.forEach(m => {
        if (m.history?.length) return;
        m.history = [{ event: 'Issue reported', detail: m.desc || m.issue, time: m.time || 'Recently' }];
        if (m.contractor && m.contractor !== '—') {
            m.history.push({ event: 'Contractor assigned', detail: m.contractor, time: m.status === 'open' ? 'Pending' : 'Assigned' });
        }
        if (m.status === 'progress') {
            m.history.push({ event: 'Work in progress', detail: 'Contractor on site', time: 'In progress' });
        }
        if (m.status === 'done') {
            m.history.push({ event: 'Work completed', detail: 'Issue resolved', time: 'Resolved' });
        }
    });
}

function getMaintTimeline(item) {
    if (item.history?.length) return item.history.map(h => [h.event, h.detail || h.time]);
    return {
        open: [['Issue reported', item.time || 'Recently']],
        progress: [['Issue reported', item.time || 'Recently'], ['Contractor assigned', item.contractor !== '—' ? item.contractor : 'Assigned'], ['Work in progress', 'In progress']],
        done: [['Issue reported', item.time || 'Recently'], ['Contractor assigned', item.contractor !== '—' ? item.contractor : 'Assigned'], ['Work completed', 'Resolved']],
    }[item.status] || [['Issue reported', item.time || 'Recently']];
}

function daysUntil(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    if (Number.isNaN(due.getTime())) return null;
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / 86400000);
}

function upsertSmartReminder(spec) {
    const idx = AppStore.reminders.findIndex(r =>
        r.propertyId === spec.propertyId && r.type === spec.type && r.auto && r.title === spec.title
    );
    const daysLeft = daysUntil(spec.due);
    const entry = {
        ...spec,
        auto: true,
        daysLeft: daysLeft ?? spec.daysLeft ?? 0,
        urgency: (daysLeft ?? 0) <= 7 ? 'high' : (daysLeft ?? 0) <= 30 ? 'medium' : 'low',
    };
    if (idx >= 0) Object.assign(AppStore.reminders[idx], entry);
    else AppStore.reminders.push({ id: AppStore.nextId(AppStore.reminders), ...entry });
}

const REMINDER_TYPE_COMPLIANCE_CID = {
    gas: 0, electrical: 1, smoke: 2, heat: 3, co2: 4, insurance: 5, mortgage: 6, epc: 7,
};

function reminderDueInputValue(due) {
    if (!due) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(due)) return due;
    const parsed = new Date(due);
    if (Number.isNaN(parsed.getTime())) return '';
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function reminderTypeMeta(type) {
    return REMINDER_TYPES.find(t => t[0] === type) || REMINDER_TYPES[11];
}

function formatReminderDue(due) {
    if (!due) return '—';
    return typeof formatDisplayDate === 'function' ? (formatDisplayDate(due) || due) : due;
}

function recalcReminderMeta(r) {
    const left = daysUntil(r.due);
    if (left != null) {
        r.daysLeft = left;
        r.urgency = left < 0 ? 'high' : left <= 7 ? 'high' : left <= 30 ? 'medium' : 'low';
    }
    return r;
}

function reminderStatusBadge(r) {
    const left = r.daysLeft ?? daysUntil(r.due) ?? 0;
    const rt = reminderTypeMeta(r.type);
    let text;
    if (left < 0) text = `${Math.abs(left)}d overdue`;
    else if (left === 0) text = 'Today';
    else text = `${left}d`;
    return { text, bg: rt[3], color: rt[4] };
}

function reminderSourceLabel(r) {
    if (!r.auto) return 'Custom reminder';
    const labels = {
        gas: 'Gas certificate', electrical: 'Electrical certificate', epc: 'EPC record',
        smoke: 'Smoke alarm', heat: 'Heat alarm', co2: 'CO alarm',
        insurance: 'Landlord insurance', mortgage: 'Mortgage record',
        inspection: 'Inspection schedule', 'rent-review': 'Active lease',
        leasehold: 'Leasehold record',
    };
    return labels[r.type] || 'Property records';
}

function reminderPrimaryAction(r) {
    const pid = r.propertyId;
    const cid = REMINDER_TYPE_COMPLIANCE_CID[r.type];
    const cfg = cid != null ? COMPLIANCE_ITEM_CONFIG[cid] : null;
    if (r.type === 'inspection') {
        return { label: 'Reschedule inspection', go: 'reschedule-inspection', opts: { propertyId: pid } };
    }
    if (r.type === 'rent-review') {
        const unitMatch = r.title.match(/Lease ending · (.+)$/);
        if (unitMatch) {
            return { label: 'View lease', go: 'flat-detail', opts: { propertyId: pid, unit: unitMatch[1].trim() } };
        }
        return { label: 'View tenants', go: 'tenants', opts: {} };
    }
    if (cfg?.renewScreen === 'property-alarms') {
        return { label: 'Update alarm expiry', go: 'property-alarms', opts: { propertyId: pid } };
    }
    if (cfg?.cert) {
        return { label: 'Renew certificate', go: 'renew-compliance', opts: { propertyId: pid, complianceId: cid } };
    }
    if (cfg?.manual) {
        return { label: 'Update property info', go: 'property-info', opts: { propertyId: pid } };
    }
    return { label: 'Change due date', go: 'edit-reminder', opts: { reminderId: r.id } };
}

function reminderGoAttrs(action) {
    if (!action?.go) return '';
    const o = action.opts || {};
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const parts = [`data-go="${action.go}"`];
    if (o.propertyId != null) parts.push(`data-pid="${o.propertyId}"`);
    if (o.complianceId != null) parts.push(`data-cid="${o.complianceId}"`);
    if (o.unit) parts.push(`data-unit="${esc(o.unit)}"`);
    if (o.reminderId != null) parts.push(`data-rid="${o.reminderId}"`);
    if (o.tab) parts.push(`data-tab="${o.tab}"`);
    if (o.recordsView) parts.push(`data-records-view="${o.recordsView}"`);
    return parts.join(' ');
}

function filteredReminders(filter) {
    const f = filter || STATE.reminderFilter || 'all';
    const list = AppStore.reminders.map(r => recalcReminderMeta({ ...r }));
    list.sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));
    if (f === 'soon') return list.filter(r => (r.daysLeft ?? 99) <= 30 && (r.daysLeft ?? -99) >= 0);
    if (f === 'overdue') return list.filter(r => (r.daysLeft ?? 0) < 0);
    if (f === 'custom') return list.filter(r => !r.auto);
    return list;
}

function applyReminderDueToSource(reminder, dueRaw) {
    const pid = reminder.propertyId;
    const meta = AppStore.meta(pid);
    const type = reminder.type;
    const cid = REMINDER_TYPE_COMPLIANCE_CID[type];
    if (cid != null) {
        const cfg = COMPLIANCE_ITEM_CONFIG[cid];
        if (cfg?.alarmKey) {
            if (!meta.alarms) meta.alarms = {};
            if (!meta.alarms[cfg.alarmKey]) meta.alarms[cfg.alarmKey] = {};
            meta.alarms[cfg.alarmKey].expiry = dueRaw;
        } else if (cfg?.manual) {
            if (!meta.info) meta.info = {};
            if (type === 'insurance') meta.info.insuranceExpiry = dueRaw;
            if (type === 'mortgage') meta.info.mortgageRenewal = dueRaw;
        } else if (cfg?.cert) {
            const key = `${pid}-${cid}`;
            if (!AppStore.complianceCerts[key]) AppStore.complianceCerts[key] = {};
            AppStore.complianceCerts[key].expiryDate = dueRaw;
            if (COMPLIANCE_ITEMS[cid]) {
                const display = typeof formatDisplayDate === 'function' ? formatDisplayDate(dueRaw) : dueRaw;
                COMPLIANCE_ITEMS[cid][2] = display || COMPLIANCE_ITEMS[cid][2];
            }
        }
    }
    if (type === 'rent-review') {
        const unitMatch = reminder.title.match(/Lease ending · (.+)$/);
        const unit = unitMatch?.[1]?.trim();
        const ten = unit
            ? AppStore.tenancies.find(t => t.propertyId === pid && t.unit === unit && t.status === 'active')
            : AppStore.tenancies.find(t => t.propertyId === pid && t.status === 'active');
        if (ten) ten.end = dueRaw;
    }
    if (type === 'inspection') {
        const insp = AppStore.inspections.find(i => i.propertyId === pid && (i.scheduled || i.date));
        if (insp) insp.date = dueRaw;
    }
}

function syncSmartReminders(persist = true) {
    PROPERTIES.forEach(p => {
        const meta = AppStore.meta(p.id);
        Object.entries(meta.alarms || {}).forEach(([key, alarm]) => {
            if (!alarm?.expiry) return;
            const type = ALARM_REMINDER_MAP[key] || 'custom';
            const label = key === 'co' ? 'CO₂ Alarm Expiry' : `${key.charAt(0).toUpperCase() + key.slice(1)} Alarm Expiry`;
            upsertSmartReminder({
                type, propertyId: p.id, title: label, due: alarm.expiry,
            });
        });
        (meta.customAlarms || []).forEach(alarm => {
            if (!alarm?.expiry) return;
            upsertSmartReminder({
                type: 'custom',
                propertyId: p.id,
                title: `${alarm.name || 'Custom alarm'} expiry`,
                due: alarm.expiry,
            });
        });
        const info = meta.info || {};
        if (info.epcExpiry) {
            upsertSmartReminder({
                type: 'epc', propertyId: p.id, title: 'EPC Certificate Expiry', due: info.epcExpiry,
            });
        }
        if (info.insuranceExpiry) {
            upsertSmartReminder({
                type: 'insurance', propertyId: p.id, title: 'Landlord Insurance Renewal', due: info.insuranceExpiry,
            });
        }
        if (info.mortgageRenewal) {
            upsertSmartReminder({
                type: 'mortgage', propertyId: p.id, title: 'Mortgage Renewal', due: info.mortgageRenewal,
            });
        }
        const tenancies = AppStore.tenancies.filter(t => t.propertyId === p.id && t.status === 'active');
        tenancies.forEach(ten => {
            if (ten?.end) {
                upsertSmartReminder({
                    type: 'rent-review',
                    propertyId: p.id,
                    title: `Lease ending · ${ten.unit || 'Unit'}`,
                    due: ten.end,
                });
            }
        });
    });
    Object.entries(AppStore.complianceCerts || {}).forEach(([key, cert]) => {
        const due = cert.expiryDate || cert.expiry;
        if (!due) return;
        const [pid, cid] = key.split('-').map(Number);
        const cfg = COMPLIANCE_ITEM_CONFIG[cid];
        if (!cfg?.reminderType) return;
        upsertSmartReminder({
            type: cfg.reminderType,
            propertyId: pid,
            title: `${COMPLIANCE_ITEMS[cid]?.[1] || 'Certificate'} Expiry`,
            due,
        });
    });
    const scheduled = AppStore.inspections.filter(i => i.scheduled);
    scheduled.forEach(i => {
        upsertSmartReminder({
            type: 'inspection',
            propertyId: i.propertyId,
            title: `${i.type || 'Inspection'} Due`,
            due: i.date,
        });
    });
    AppStore.reminders.forEach(r => {
        if (!r.due) return;
        const left = daysUntil(r.due);
        if (left != null) {
            r.daysLeft = left;
            r.urgency = left < 0 ? 'high' : left <= 7 ? 'high' : left <= 30 ? 'medium' : 'low';
        }
    });
    if (persist) AppStore.save();
}

const PAYMENT_METHOD_OPTIONS = [
    { id: 'stripe', label: 'Stripe (card)' },
    { id: 'cash', label: 'Cash (manual record)' },
];

function openStripeCheckout(opts = {}) {
    const { amount, label, onSuccess } = opts;
    toast('Opening Stripe…');
    setTimeout(() => {
        if (typeof onSuccess === 'function') onSuccess();
        else toast(label ? `Paid ${amount} · ${label}` : `Paid ${amount || ''}`.trim());
    }, 700);
}

function formatInvoiceAmount(n) {
    const num = typeof n === 'number' ? n : parseInvoiceAmount(n);
    return `£${num.toLocaleString()}`;
}

function downloadHtmlFile(filename, html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function receiptHtmlDocument(title, subtitle, rows) {
    const generated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
@page{margin:24mm}body{font-family:Arial,Helvetica,sans-serif;color:#0F172A;padding:32px;max-width:720px;margin:0 auto}
.hdr{border-bottom:2px solid #2563EB;padding-bottom:16px;margin-bottom:24px}h1{font-size:22px;margin:0 0 4px}
.sub{color:#64748B;font-size:13px;margin:0}.meta{color:#94A3B8;font-size:12px;margin-top:8px}
table{width:100%;border-collapse:collapse;margin-top:20px}td{padding:10px 0;border-bottom:1px solid #E2E8F0;font-size:13px}
td:first-child{color:#64748B;width:38%}td:last-child{font-weight:600;text-align:right}
.foot{margin-top:32px;font-size:11px;color:#94A3B8}
</style></head><body>
<div class="hdr"><h1>${title}</h1><p class="sub">${subtitle}</p><p class="meta">Generated ${generated} · Landlord HQ</p></div>
<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
<p class="foot">This document was generated from Landlord HQ. Open in a browser and use Print → Save as PDF if needed.</p>
</body></html>`;
}

function invoicePaymentReference(inv) {
    return inv.paymentReference || `LH-${inv.num}`;
}

function stampInvoicePaid(inv, { paidOn, paymentMethod } = {}) {
    inv.status = 'Paid';
    inv.paidOn = paidOn || (typeof formatDisplayDate === 'function'
        ? formatDisplayDate(new Date().toISOString().slice(0, 10))
        : 'Today');
    inv.paymentMethod = paymentMethod || inv.paymentMethod || 'Stripe';
    inv.paymentReference = invoicePaymentReference(inv);
    markOveragePaidForInvoice(inv);
}

function renderRentHistoryRow(inv, opts = {}) {
    const paid = inv.status === 'Paid';
    const [bg, color] = invoiceStatusStyle(inv.status);
    const unitPrefix = opts.showUnit !== false && inv.unit ? `${inv.unit} · ` : '';
    const meta = `${unitPrefix}${paid ? `Paid ${inv.paidOn || inv.due}` : `Due ${inv.due}`}${inv.paymentMethod ? ` · ${inv.paymentMethod}` : ''}`;
    const body = `
        <div class="rent-history-icon ${paid ? 'rent-history-icon--paid' : 'rent-history-icon--due'}">
            <i data-lucide="${paid ? 'check' : 'clock'}" class="w-4 h-4"></i>
        </div>
        <div class="rent-history-body">
            <p class="rent-history-title">${invoiceTypeLabel(inv)}</p>
            <p class="rent-history-meta">${meta}</p>
        </div>
        <div class="rent-history-right">
            <p class="rent-history-amount">${inv.amount}</p>
            <span class="fin-inv-status" style="background:${bg};color:${color}">${inv.status}</span>
        </div>`;
    if (!paid) {
        return `
        <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="rent-history-row card w-full text-left">
            ${body}
            <i data-lucide="chevron-right" class="rent-history-chevron w-4 h-4"></i>
        </button>`;
    }
    return `
    <div class="rent-history-row-wrap card">
        <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="rent-history-row rent-history-row--main w-full text-left">
            ${body}
        </button>
        <button type="button" data-action="download-invoice-receipt" data-iid="${inv.id}" class="rent-history-download" aria-label="Download receipt" title="Download receipt">
            <i data-lucide="download" class="w-4 h-4"></i>
        </button>
    </div>`;
}

function downloadInvoiceReceipt(iid) {
    const inv = INVOICES.find(i => i.id === iid);
    if (!inv) { toast('Invoice not found'); return; }
    const paid = inv.status === 'Paid';
    const typeLabel = invoiceTypeLabel(inv);
    const rows = [
        ['Invoice #', inv.num],
        ['Type', typeLabel],
        ...(inv.month ? [['Rent period', inv.month]] : []),
        ['Tenant', inv.tenant || '—'],
        ['Property', inv.prop],
        ...(inv.unit ? [['Unit', inv.unit]] : []),
        ['Amount', inv.amount],
        ['Status', inv.status],
        ['Due date', inv.due],
    ];
    if (paid) {
        rows.push(['Paid on', inv.paidOn || '—']);
        rows.push(['Payment method', inv.paymentMethod || 'Stripe']);
        rows.push(['Reference', invoicePaymentReference(inv)]);
    }
    const html = receiptHtmlDocument(
        paid ? 'Payment receipt' : 'Invoice',
        paid ? `${typeLabel} · ${inv.amount}` : `Amount due · ${inv.amount}`,
        rows,
    );
    downloadHtmlFile(`${inv.num}-${paid ? 'receipt' : 'invoice'}.html`, html);
    toast(paid ? 'Receipt downloaded' : 'Invoice downloaded');
}

function markOveragePaidForInvoice(inv) {
    if (!inv || inv.type !== 'bill' || !inv.desc?.includes('Utility overage')) return;
    const util = getUnitUtilityMeta(inv.propertyId, inv.unit);
    const charge = util.overageCharges?.find(o => o.invoiceId === inv.id);
    if (charge) charge.status = 'Paid';
}

function invoicesForTenant(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (!listItem) return [];
    return INVOICES.filter(i =>
        i.tenantId === tenantId ||
        (i.tenant === listItem.name && i.prop.includes(listItem.prop))
    ).sort((a, b) => (b.month || b.due).localeCompare(a.month || a.due));
}

function invoiceTypeLabel(inv) {
    if (isLandlordExtraCharge(inv)) return chargeInvoiceLabel(inv);
    if (inv.type === 'maintenance') return inv.desc || 'Maintenance bill';
    if (inv.type === 'bill') return inv.desc || 'Bill';
    return inv.month ? `${inv.month} rent` : 'Monthly rent';
}

function renderTenantPaymentRow(inv) {
    const isPaid = inv.status === 'Paid';
    const isOverdue = inv.status === 'Overdue';
    const isCharge = isLandlordExtraCharge(inv);
    const isMaint = isMaintenanceBill(inv);
    const iconClass = isPaid ? 'txn-icon-paid' : isOverdue ? 'txn-icon-overdue' : 'txn-icon-pending';
    const badgeClass = isPaid ? 'txn-badge-paid' : isOverdue ? 'txn-badge-overdue' : 'txn-badge-pending';
    const statusLabel = isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Due';
    const dateLine = isPaid
        ? `Paid ${inv.paidOn || inv.due}${inv.paymentMethod ? ` · ${inv.paymentMethod}` : ''}`
        : `Due ${inv.due}`;
    const subLine = isCharge && inv.desc?.includes(' · ')
        ? inv.desc.split(' · ').slice(1).join(' · ')
        : (isMaint ? 'Maintenance or utility bill' : '');
    const row = `
        <div class="txn-icon ${iconClass}">
            <i data-lucide="${isPaid ? 'check' : isOverdue ? 'alert-circle' : chargeInvoiceIcon(inv)}" class="w-4 h-4"></i>
        </div>
        <div class="txn-body">
            <p class="txn-title">${chargeInvoiceLabel(inv)}</p>
            <p class="txn-sub txn-sub--muted">${subLine ? `${subLine} · ${dateLine}` : dateLine}</p>
        </div>
        <div class="txn-meta">
            <p class="txn-amount">${inv.amount}</p>
            <span class="txn-badge ${badgeClass}">${statusLabel}</span>
        </div>`;
    if (!isPaid) {
        return `
    <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="txn-row">
        ${row}
        <i data-lucide="chevron-right" class="txn-chevron w-4 h-4"></i>
    </button>`;
    }
    return `
    <div class="txn-row-wrap txn-row-wrap--action">
        <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="txn-row">
            ${row}
        </button>
        <button type="button" data-action="download-invoice-receipt" data-iid="${inv.id}" class="txn-download-btn" aria-label="Download receipt" title="Download receipt">
            <i data-lucide="download" class="w-4 h-4"></i>
        </button>
    </div>`;
}

function getCurrentRentMonthLabel() {
    const d = new Date();
    return d.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
}

function buildRentRollRows(month = getCurrentRentMonthLabel(), propertyId = null) {
    let invs = INVOICES.filter(i => (!i.type || i.type === 'rent') && i.month === month);
    if (propertyId != null) invs = invs.filter(i => i.propertyId === propertyId);
    const order = { overdue: 0, due: 1, paid: 2 };
    return invs.map(inv => {
        const status = inv.status === 'Paid' ? 'paid' : inv.status === 'Overdue' ? 'overdue' : 'due';
        return {
            invoiceId: inv.id,
            propertyId: inv.propertyId,
            propertyName: PROPERTIES[inv.propertyId]?.name || (inv.prop || '').split(',')[0],
            unit: inv.unit || '—',
            tenant: inv.tenant || '—',
            amount: inv.amount,
            due: inv.due,
            status,
            statusLabel: inv.status === 'Paid' ? 'Paid' : inv.status === 'Overdue' ? 'Overdue' : 'Due',
            paidOn: inv.paidOn || '',
        };
    }).sort((a, b) => (order[a.status] ?? 1) - (order[b.status] ?? 1)
        || a.propertyName.localeCompare(b.propertyName)
        || a.unit.localeCompare(b.unit));
}

function renderRentRollPropertyFilter() {
    const propF = STATE.rentRollPropertyFilter;
    const month = getCurrentRentMonthLabel();
    const props = [...new Set(INVOICES
        .filter(i => (!i.type || i.type === 'rent') && i.month === month && i.propertyId != null)
        .map(i => i.propertyId))].map(pid => PROPERTIES[pid]).filter(Boolean);
    if (props.length <= 1) return '';
    return `
    <div class="rent-roll-filter-row">
        <label class="maint-place-select-wrap rent-roll-select-wrap">
            <select data-rent-roll-property-filter class="maint-place-select" aria-label="Filter rent roll by property">
                <option value="all"${propF == null ? ' selected' : ''}>All properties</option>
                ${props.map(p => `<option value="${p.id}"${propF === p.id ? ' selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
        ${propF != null ? `<button type="button" data-action="clear-rent-roll-property-filter" class="maint-place-clear">Clear</button>` : ''}
    </div>`;
}

function renderRentRollCard(row) {
    const statusKey = row.status === 'paid' ? 'Paid' : row.status === 'overdue' ? 'Overdue' : 'Pending';
    const [bg, color] = invoiceStatusStyle(statusKey);
    const palette = [
        ['#EDE9FE', '#7C3AED'],
        ['#FFEDD5', '#EA580C'],
        ['#DBEAFE', '#2563EB'],
        ['#DCFCE7', '#16A34A'],
    ];
    const [iconBg, iconColor] = palette[(row.propertyId ?? 0) % palette.length];
    const goAttrs = row.status === 'paid'
        ? `data-go="invoice-detail" data-iid="${row.invoiceId}"`
        : `data-go="mark-rent-received" data-iid="${row.invoiceId}"`;
    const location = STATE.rentRollPropertyFilter == null
        ? `${row.unit} · ${row.propertyName}`
        : row.unit;
    const dueLine = row.status === 'paid' && row.paidOn
        ? `Paid ${row.paidOn}`
        : `Due ${row.due}`;
    return `
    <button type="button" ${goAttrs} class="fin-inv-row rent-roll-card">
        <div class="fin-inv-icon" style="background:${iconBg};color:${iconColor}">
            <i data-lucide="home" class="w-[18px] h-[18px]"></i>
        </div>
        <div class="fin-inv-body">
            <p class="fin-inv-prop">${escapeHtml(row.tenant)}</p>
            <p class="fin-inv-due">${escapeHtml(location)} · ${escapeHtml(dueLine)}</p>
        </div>
        <div class="fin-inv-right">
            <p class="fin-inv-amount">${escapeHtml(row.amount)}</p>
            <span class="fin-inv-status" style="background:${bg};color:${color}">${row.statusLabel}</span>
        </div>
        <i data-lucide="chevron-right" class="fin-inv-chevron w-5 h-5"></i>
    </button>`;
}

function renderRentRollRow(row) {
    return renderRentRollCard(row);
}

function renderRentRollSection() {
    const month = getCurrentRentMonthLabel();
    const propF = STATE.rentRollPropertyFilter;
    const filter = STATE.rentRollFilter || 'all';
    const rows = buildRentRollRows(month, propF);
    const counts = {
        all: rows.length,
        paid: rows.filter(r => r.status === 'paid').length,
        due: rows.filter(r => r.status === 'due').length,
        overdue: rows.filter(r => r.status === 'overdue').length,
    };
    const filtered = filter === 'all' ? rows
        : rows.filter(r => r.status === filter || (filter === 'due' && r.status === 'due'));
    const outstanding = filtered.filter(r => r.status !== 'paid');
    const collected = rows.filter(r => r.status === 'paid').length;
    const tabs = [
        ['all', 'All', counts.all],
        ['paid', 'Paid', counts.paid],
        ['due', 'Due', counts.due],
        ['overdue', 'Overdue', counts.overdue],
    ];
    if (!rows.length) {
        return `
        <section class="fin-rent-roll-section" id="rent-roll">
            <div class="fin-section-head">
                <h2 class="fin-section-title">${month} rent roll</h2>
            </div>
            <div class="card fin-rent-roll-empty">
                <p class="rent-roll-empty">No rent invoices for this month yet.</p>
            </div>
        </section>`;
    }
    return `
    <section class="fin-rent-roll-section" id="rent-roll">
        <div class="fin-section-head fin-section-head--row">
            <div>
                <h2 class="fin-section-title">${month} rent roll</h2>
                <p class="fin-section-sub">${collected} of ${rows.length} paid · tap to record or view</p>
            </div>
            ${outstanding.length ? `<button type="button" data-go="mark-rent-received" data-rent-roll-record="1" class="rent-roll-record-btn">Record${outstanding.length > 1 ? ` (${outstanding.length})` : ''}</button>` : ''}
        </div>
        <div class="fin-segments rent-roll-segments">
            ${tabs.map(([k, l, n]) => `
            <button type="button" data-rent-roll-filter="${k}" class="fin-segment ${filter === k ? 'active' : ''}">
                <span class="fin-segment-label">${l}</span>
                ${n ? `<span class="fin-segment-count">${n}</span>` : ''}
            </button>`).join('')}
        </div>
        ${renderRentRollPropertyFilter()}
        <div class="fin-invoice-list rent-roll-list">
            ${filtered.length ? filtered.map(renderRentRollCard).join('') : `
            <div class="card fin-rent-roll-empty">
                <p class="rent-roll-empty">No ${filter === 'all' ? '' : filter} rent in this filter.</p>
            </div>`}
        </div>
    </section>`;
}

function renderFinanceRentDueList() {
    const unpaid = outstandingInvoices().sort((a, b) => {
        if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
        if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
        return 0;
    });
    if (!unpaid.length) return '';
    return `
    <div class="fin-due-section">
        <div class="fin-section-head fin-section-head--row">
            <div>
                <h2 class="fin-section-title">Who owes rent</h2>
                <p class="fin-section-sub">${unpaid.length} tenant${unpaid.length === 1 ? '' : 's'} · tap to view or record payment</p>
            </div>
        </div>
        <div class="fin-due-list">
            ${unpaid.map(inv => {
                const [bg, color] = invoiceStatusStyle(inv.status);
                return `
            <div class="fin-due-card card">
                <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="fin-due-row w-full text-left">
                    <div class="fin-due-main">
                        <p class="fin-due-tenant">${inv.tenant || 'Tenant'}</p>
                        <p class="fin-due-meta">${inv.unit || ''}${inv.unit ? ' · ' : ''}${inv.prop.split(',')[0]}</p>
                        <p class="fin-due-period">Due ${inv.due}${inv.month ? ` · ${inv.month}` : ''}</p>
                    </div>
                    <div class="fin-due-right">
                        <p class="fin-due-amount">${inv.amount}</p>
                        <span class="fin-inv-status" style="background:${bg};color:${color}">${inv.status === 'Overdue' ? 'Overdue' : 'Due'}</span>
                    </div>
                    <i data-lucide="chevron-right" class="fin-due-chevron w-5 h-5"></i>
                </button>
                <button type="button" data-go="mark-rent-received" data-iid="${inv.id}" class="fin-due-record">Record payment</button>
            </div>`;
            }).join('')}
        </div>
    </div>`;
}

function renderTenantRentHistory(tenantId) {
    const invs = invoicesForTenant(tenantId);
    if (!invs.length) {
        return `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No rent records yet for this tenant.</p></div>`;
    }
    return `
    <div class="rent-history-list">
        ${invs.map(inv => renderRentHistoryRow(inv)).join('')}
    </div>`;
}

function financialStats() {
    const parseAmt = (s) => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
    const currentMonth = INVOICES.filter(i => i.month === 'Jul 2026' || (i.status !== 'Paid' && !i.month));
    const total = currentMonth.reduce((s, i) => s + parseAmt(i.amount), 0);
    const collected = currentMonth.filter(i => i.status === 'Paid').reduce((s, i) => s + parseAmt(i.amount), 0);
    const outstanding = currentMonth.filter(i => i.status !== 'Paid').reduce((s, i) => s + parseAmt(i.amount), 0);
    const overdue = currentMonth.filter(i => i.status === 'Overdue').reduce((s, i) => s + parseAmt(i.amount), 0);
    const pending = currentMonth.filter(i => i.status === 'Pending').reduce((s, i) => s + parseAmt(i.amount), 0);
    const pct = total ? Math.round((collected / total) * 100) : 0;
    return { total, collected, outstanding, overdue, pending, pct };
}

function invoicePropertyMeta(inv) {
    const propIdx = PROPERTIES.findIndex(p => inv.prop.includes(p.name));
    const pid = propIdx >= 0 ? propIdx : inv.id;
    const palette = [
        ['#EDE9FE', '#7C3AED'],
        ['#FFEDD5', '#EA580C'],
        ['#DBEAFE', '#2563EB'],
        ['#DCFCE7', '#16A34A'],
    ];
    const [bg, color] = palette[pid % palette.length];
    return { bg, color, propShort: inv.prop.split(',')[0].trim() };
}

function financialInvoiceCard(inv) {
    const [bg, color] = invoiceStatusStyle(inv.status);
    const meta = invoicePropertyMeta(inv);
    const statusLabel = inv.status === 'Overdue' ? 'Overdue' : inv.status === 'Pending' ? 'Due' : 'Paid';
    const typeLabel = inv.type === 'bill' ? (inv.desc || 'Bill') : (inv.month || 'Rent');
    return `
    <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="fin-inv-row">
        <div class="fin-inv-icon" style="background:${meta.bg};color:${meta.color}">
            <i data-lucide="${inv.type === 'bill' ? 'receipt' : 'building-2'}" class="w-[18px] h-[18px]"></i>
        </div>
        <div class="fin-inv-body">
            <p class="fin-inv-prop">${inv.tenant || meta.propShort}${inv.unit ? ` · ${inv.unit}` : ''}</p>
            <p class="fin-inv-due">${typeLabel}${inv.status === 'Paid' && inv.paidOn ? ` · Paid ${inv.paidOn}` : ` · Due ${inv.due}`}</p>
            <p class="fin-inv-num">${inv.num}</p>
        </div>
        <div class="fin-inv-right">
            <p class="fin-inv-amount">${inv.amount}</p>
            <span class="fin-inv-status" style="background:${bg};color:${color}">${statusLabel}</span>
        </div>
        <i data-lucide="chevron-right" class="fin-inv-chevron w-5 h-5"></i>
    </button>`;
}

function renderTransactionRow(t) {
    const isPaid = t.status === 'Paid';
    const isOverdue = t.status === 'Overdue';
    const iconClass = isPaid ? 'txn-icon-paid' : isOverdue ? 'txn-icon-overdue' : 'txn-icon-pending';
    const badgeClass = isPaid ? 'txn-badge-paid' : isOverdue ? 'txn-badge-overdue' : 'txn-badge-pending';
    const location = [t.unit, t.prop].filter(Boolean).join(' · ');
    const dateLine = isPaid
        ? `${t.paymentMethod ? `${t.paymentMethod} · ` : ''}${t.date || ''}`
        : `Due ${t.date || ''}`;
    return `
    <button type="button" data-go="invoice-detail" data-iid="${t.iid}" class="txn-row">
        <div class="txn-icon ${iconClass}">
            <i data-lucide="${isPaid ? 'check' : isOverdue ? 'alert-circle' : 'clock'}" class="w-4 h-4"></i>
        </div>
        <div class="txn-body">
            <p class="txn-title">${t.tenant}</p>
            <p class="txn-sub">${location}${t.month ? ` · ${t.month}` : ''}</p>
            <p class="txn-sub txn-sub--muted">${dateLine}</p>
        </div>
        <div class="txn-meta">
            <p class="txn-amount">${t.amount}</p>
            <span class="txn-badge ${badgeClass}">${isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Due'}</span>
        </div>
    </button>`;
}

function exportRentPdfReport() {
    syncTransactionsFromInvoices();
    const rows = [...TRANSACTIONS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const totalPaid = rows.filter(t => t.status === 'Paid').reduce((s, t) => s + parseInvoiceAmount(t.amount), 0);
    const totalDue = rows.filter(t => t.status !== 'Paid').reduce((s, t) => s + parseInvoiceAmount(t.amount), 0);
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rent Report</title>
<style>
@page{margin:20mm}body{font-family:Arial,sans-serif;padding:32px;color:#0F172A}
h1{font-size:22px;margin:0}.summary{display:flex;gap:16px;margin:20px 0}.pill{padding:12px 16px;background:#F1F5F9;border-radius:8px;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #E2E8F0;padding:8px 10px;text-align:left;font-size:12px}th{background:#F8FAFC}
.foot{margin-top:24px;font-size:11px;color:#94A3B8}
</style></head><body>
<h1>Rent &amp; payment report</h1>
<p style="color:#64748B;font-size:13px">Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Landlord HQ</p>
<div class="summary">
<div class="pill"><strong>£${totalPaid.toLocaleString()}</strong><br>Collected</div>
<div class="pill"><strong>£${totalDue.toLocaleString()}</strong><br>Outstanding</div>
</div>
<table><thead><tr><th>Date</th><th>Tenant</th><th>Property</th><th>Amount</th><th>Status</th><th>Method</th></tr></thead><tbody>
${rows.map(t => `<tr><td>${t.date || '—'}</td><td>${t.tenant || '—'}</td><td>${t.prop || '—'}</td><td>${t.amount}</td><td>${t.status}</td><td>${t.method || '—'}</td></tr>`).join('')}
</tbody></table>
<p class="foot">Open in a browser and use Print → Save as PDF for a PDF copy.</p>
</body></html>`;
    downloadHtmlFile(`rent-report-${new Date().toISOString().slice(0, 10)}.html`, html);
    toast('Rent report downloaded');
}

function screenTransactionHistoryEnhanced() {
    if (STATE.userRole === 'tenant') return screenTenantPaymentHistory();
    syncTransactionsFromInvoices();
    const f = STATE.invoiceFilter || 'all';
    const statusMap = { pending: 'Pending', paid: 'Paid', overdue: 'Overdue' };
    const filtered = f === 'all'
        ? [...TRANSACTIONS]
        : TRANSACTIONS.filter(t => t.status === statusMap[f]);
    const counts = {
        all: TRANSACTIONS.length,
        pending: TRANSACTIONS.filter(t => t.status === 'Pending').length,
        paid: TRANSACTIONS.filter(t => t.status === 'Paid').length,
        overdue: TRANSACTIONS.filter(t => t.status === 'Overdue').length,
    };
    const sorted = filtered.sort((a, b) => {
        const rank = s => (s === 'Overdue' ? 0 : s === 'Pending' ? 1 : 2);
        const dr = rank(a.status) - rank(b.status);
        if (dr) return dr;
        return (b.date || '').localeCompare(a.date || '');
    });
    const unpaid = sorted.filter(t => t.status !== 'Paid');
    const paid = sorted.filter(t => t.status === 'Paid');
    const listBody = !sorted.length
        ? (f === 'all'
            ? emptyState('receipt', 'No payments found', 'Record rent when a tenant pays you.', 'Record rent', null, 'mark-rent-received')
            : emptyState('receipt', 'No payments found', 'Try another filter.'))
        : f === 'all' ? `
        ${unpaid.length ? `
        <p class="txn-section-label">Outstanding</p>
        <div class="txn-list">${unpaid.map(renderTransactionRow).join('')}</div>` : ''}
        ${paid.length ? `
        <p class="txn-section-label ${unpaid.length ? 'txn-section-label--spaced' : ''}">Paid</p>
        <div class="txn-list">${paid.map(renderTransactionRow).join('')}</div>` : ''}` : `
        <div class="txn-list">${sorted.map(renderTransactionRow).join('')}</div>`;
    return `${topBar('Transaction history', { back: true, sub: 'All rent & bills' })}
    <div class="screen-content screen-enter txn-page">
        <button type="button" data-action="export-rent-pdf" class="btn-secondary w-full py-3 text-[13px] mb-3 flex items-center justify-center gap-2">
            <i data-lucide="download" class="w-4 h-4"></i>Export rent report
        </button>
        <div class="fin-segments txn-segments">
            ${[['all', 'All', counts.all], ['pending', 'Due', counts.pending], ['paid', 'Paid', counts.paid], ['overdue', 'Overdue', counts.overdue]].map(([k, l, n]) => `
            <button type="button" data-invoice-filter="${k}" class="fin-segment ${f === k ? 'active' : ''}">
                <span class="fin-segment-label">${l}</span>
                ${k !== 'all' && n ? `<span class="fin-segment-count">${n}</span>` : ''}
            </button>`).join('')}
        </div>
        ${listBody}
    </div>`;
}

function renderFinancialPageHeader() {
    return `
    <div class="screen-header fin-page-header">
        <div class="sub-header-row">
            <div class="sub-header-left">
                <button type="button" data-action="back" class="back-btn" aria-label="Back"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <div class="min-w-0">
                    <h1 class="sub-header-title">Finances</h1>
                    <p class="fin-page-sub">Rent & bills overview</p>
                </div>
            </div>
        </div>
    </div>`;
}

function renderFinancialSummaryCard(stats, counts) {
    const overdueTile = counts.overdue ? `
        <button type="button" data-go="transaction-history" data-invoice-preset="overdue" class="fin-stat fin-stat--red">
            <span class="fin-stat-val">£${stats.overdue.toLocaleString()}</span>
            <span class="fin-stat-lbl">${counts.overdue} overdue</span>
        </button>` : `
        <div class="fin-stat fin-stat--green">
            <span class="fin-stat-val">${stats.pct}%</span>
            <span class="fin-stat-lbl">collected</span>
        </div>`;
    return `
    <div class="fin-hero card">
        <div class="fin-hero-top">
            <div class="fin-hero-main">
                <p class="fin-hero-eyebrow">This month</p>
                <p class="fin-hero-amount">£${stats.collected.toLocaleString()}</p>
                <p class="fin-hero-sub">of £${stats.total.toLocaleString()} expected</p>
            </div>
            <div class="fin-hero-ring" style="--fin-pct:${stats.pct}" aria-hidden="true">
                <span class="fin-hero-ring-val">${stats.pct}%</span>
            </div>
        </div>
        <div class="fin-hero-progress" style="--fin-pct:${stats.pct}"><span class="fin-hero-progress-fill"></span></div>
        <div class="fin-stat-row">
            <div class="fin-stat fin-stat--amber">
                <span class="fin-stat-val">£${stats.pending.toLocaleString()}</span>
                <span class="fin-stat-lbl">due soon</span>
            </div>
            ${overdueTile}
            <div class="fin-stat fin-stat--neutral">
                <span class="fin-stat-val">£${stats.outstanding.toLocaleString()}</span>
                <span class="fin-stat-lbl">outstanding</span>
            </div>
        </div>
    </div>`;
}

function renderFinancialActionBar(outstandingCount) {
    return `
    <div class="fin-action-bar">
        <button type="button" data-go="mark-rent-received" class="fin-action-primary">
            <i data-lucide="circle-check" class="w-5 h-5"></i>
            <span>Record rent received</span>
        </button>
        <div class="fin-action-row">
            <button type="button" data-go="create-invoice" class="fin-action-secondary">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Add charge</span>
            </button>
            ${outstandingCount ? `
            <button type="button" data-go="send-payment-reminder" class="fin-action-secondary">
                <i data-lucide="bell" class="w-4 h-4"></i>
                <span>Remind</span>
            </button>` : `
            <button type="button" data-go="transaction-history" data-invoice-preset="all" class="fin-action-secondary">
                <i data-lucide="receipt" class="w-4 h-4"></i>
                <span>History</span>
            </button>`}
        </div>
    </div>`;
}

function renderFinanceHistoryEntry(counts) {
    const outstandingCount = counts.pending + counts.overdue;
    return `
        <button type="button" data-go="transaction-history" data-invoice-preset="all" class="fin-history-entry card w-full text-left">
            <div class="fin-history-entry-icon"><i data-lucide="receipt" class="w-5 h-5"></i></div>
            <div class="fin-history-entry-body">
                <p class="fin-history-entry-title">Transaction history</p>
                <p class="fin-history-entry-sub">${counts.paid} paid${outstandingCount ? ` · ${outstandingCount} outstanding` : ''} · all rent & bills</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 fin-history-entry-chevron"></i>
        </button>`;
}

function screenFinancialEnhanced() {
    if (showScreenSkeleton('financial')) return renderFinancialSkeleton();
    const counts = {
        pending: INVOICES.filter(i => i.status === 'Pending').length,
        paid: INVOICES.filter(i => i.status === 'Paid').length,
        overdue: INVOICES.filter(i => i.status === 'Overdue').length,
    };
    const stats = financialStats();
    const outstandingCount = counts.pending + counts.overdue;
    return `${renderFinancialPageHeader()}
    <div class="screen-content screen-enter financial-page">
        ${renderFinancialSummaryCard(stats, counts)}
        ${renderFinancialActionBar(outstandingCount)}
        ${renderFinanceHistoryEntry(counts)}
        ${typeof renderRentRollSection === 'function' ? renderRentRollSection() : renderFinanceRentDueList()}
    </div>`;
}

function inspReportRow(report) {
    const dateLabel = typeof formatDisplayDate === 'function' ? formatDisplayDate(report.date) || report.date : report.date;
    const title = `${report.type || 'Inspection'} · ${dateLabel}`;
    const meta = report.rating ? `★ ${report.rating} condition` : '';
    return `
    <button type="button" data-go="inspection-detail" data-insp="${report.id}" data-pid="${report.propertyId}" class="insp-row card w-full text-left">
        <div class="insp-row-body">
            <p class="insp-row-title">${title}</p>
            ${meta ? `<p class="insp-row-meta">${meta}</p>` : ''}
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
    </button>`;
}

function inspectionById(id) {
    return AppStore.inspections.find(i => i.id === id) || AppStore.inspections.find(i => !i.scheduled) || null;
}

function screenInspectionDetail() {
    const report = inspectionById(STATE.inspectionId);
    if (!report) {
        return `${topBar('Inspection report', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Report not found.</p></div>`;
    }
    const p = PROPERTIES[report.propertyId ?? STATE.propertyId];
    const dateLabel = typeof formatDisplayDate === 'function' ? formatDisplayDate(report.date) || report.date : report.date;
    const photos = report.photoUrls?.length ? report.photoUrls : (report.photos ? IMG.interior.slice(0, Math.min(report.photos, 4)) : []);
    const rating = report.rating ? String(report.rating) : null;
    return `${topBar(report.type || 'Inspection', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-content-sm screen-enter">
        <div class="card insp-detail-summary">
            <div class="insp-detail-top">
                <div>
                    <p class="insp-detail-date">${dateLabel}</p>
                    <p class="insp-detail-property">${p?.address || p?.name || ''}</p>
                </div>
                ${rating ? `<span class="insp-detail-rating">★ ${rating}</span>` : ''}
            </div>
            ${report.notes?.trim() ? `
            <div class="insp-detail-notes">
                <p class="insp-detail-label">Notes</p>
                <p class="insp-detail-text">${report.notes}</p>
            </div>` : ''}
        </div>
        ${photos.length ? `
        <div class="insp-detail-photos">
            <p class="insp-detail-label">Photos (${photos.length})</p>
            <div class="insp-detail-photo-grid">
                ${photos.map(src => `<img src="${src}" class="insp-detail-photo" alt="">`).join('')}
            </div>
        </div>` : ''}
        ${report.report ? `
        <div class="card insp-detail-report">
            <div class="insp-detail-report-row">
                <div class="insp-detail-report-icon"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                <div class="min-w-0">
                    <p class="insp-detail-report-name">${report.report}</p>
                    <p class="insp-detail-report-sub">PDF report</p>
                </div>
            </div>
            <button type="button" data-action="download-inspection-report" class="btn-secondary w-full py-2.5 text-[13px] mt-3 flex items-center justify-center gap-2">
                <i data-lucide="download" class="w-4 h-4"></i>Download report
            </button>
        </div>` : ''}
    </div>`;
}

function renderPropertyInspectionTab(propertyId) {
    const upcoming = getScheduledInspection(propertyId);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    const nextDateLabel = upcoming
        ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date)
        : null;
    return `
    <div class="screen-content screen-content-sm prop-hub-page">
        <div class="ux-tip insp-tab-intro">
            <p class="ux-tip-title">You conduct &amp; rate</p>
            <p class="ux-tip-text">Visit the property, then tap <strong>Conduct</strong> to save photos, notes and your 1–5 condition rating after the visit.</p>
        </div>
        ${upcoming ? `
        <div class="card insp-upcoming">
            <p class="insp-upcoming-label">Next inspection</p>
            <p class="insp-upcoming-title">${upcoming.type || 'Inspection'}</p>
            <p class="insp-upcoming-date">${nextDateLabel}${upcoming.timeSlot ? ` · ${upcoming.timeSlot}` : ''}</p>
            ${upcoming.notes?.trim() ? `<p class="insp-upcoming-notes">${truncateNote(upcoming.notes, 90)}</p>` : ''}
            <p class="insp-upcoming-reminder"><i data-lucide="bell" class="w-3.5 h-3.5"></i>Reminder on Dashboard &amp; Notifications</p>
            <div class="insp-upcoming-actions">
                <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary py-2 text-[12px] flex-1">Reschedule</button>
                <button data-go="conduct-inspection" data-pid="${propertyId}" class="btn-primary py-2 text-[12px] flex-1">Conduct</button>
            </div>
        </div>` : `
        <div class="card insp-empty">
            <p class="insp-empty-text">No inspection scheduled</p>
            <p class="insp-empty-sub">Book a date to see your next inspection here and on the Dashboard.</p>
            <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-primary w-full py-2 text-[12px]">Schedule inspection</button>
        </div>`}
        <div class="screen-list-header screen-list-header--compact">
            <div><h2>Past reports</h2><p>${past.length} report${past.length === 1 ? '' : 's'}</p></div>
        </div>
        ${past.length ? `
        <div class="insp-list">
            ${past.map(i => inspReportRow(i)).join('')}
        </div>` : `
        <div class="card p-5 text-center">
            <p class="text-[13px] text-[#64748B]">No past reports yet</p>
        </div>`}
        <div class="insp-footer-link">
            <button type="button" data-go="property-photos" data-pid="${propertyId}" class="header-text-link insp-photos-link">
                <i data-lucide="image" class="w-3.5 h-3.5"></i> Property photos
            </button>
        </div>
    </div>`;
}

function maintDetailHeader(item) {
    const p = PROPERTIES[item.propertyId ?? STATE.propertyId];
    if (isCommunalMaint(item)) {
        const area = item.communalArea || 'Communal';
        return { title: 'Communal', subtitle: `${area} · ${p?.name || item.prop}` };
    }
    const unit = item.unit && item.unit !== '—' ? item.unit : '';
    const fromFlat = unit && (STATE.flatReturn?.unit === unit || STATE.selectedUnit === unit);
    if (fromFlat) {
        return { title: unit, subtitle: p?.address || p?.name || item.prop };
    }
    return { title: p?.name?.split(',')[0] || item.prop.split(',')[0], subtitle: item.issue };
}

function maintNeedsContractor(item) {
    return (item?.status === 'open' || item?.status === 'progress') && (!item?.contractor || item?.contractor === '—');
}

function getMaintPaidBy(item) {
    if (!item) return 'landlord';
    if (item.paidBy) return item.paidBy;
    return (item.reportedBy === 'tenant' || item.tenantName) ? 'tenant' : 'landlord';
}

function maintPaidByLabel(item) {
    return getMaintPaidBy(item) === 'tenant' ? 'Tenant pays' : 'Landlord pays';
}

function ensureMaintPaidBy(item) {
    if (item && !item.paidBy) item.paidBy = getMaintPaidBy(item);
}

function getMaintWorkflowLabel(item, job) {
    if (!item) return 'Open';
    if (item.status === 'done') return 'Closed';
    if (job) {
        const map = {
            assigned: 'Assigned',
            accepted: 'Accepted',
            scheduled: 'Visit scheduled',
            in_progress: 'In progress',
            waiting_approval: 'Review invoice',
            approved: 'Awaiting payment',
            paid: 'Paid',
        };
        if (map[job.status]) return map[job.status];
    }
    if (item.status === 'progress') return item.contractor && item.contractor !== '—' ? 'In progress' : 'Open';
    return 'Open';
}

function approveMaintWork(maintId) {
    const item = MAINTENANCE_ITEMS.find(m => m.id === maintId);
    const job = getContractorJobForMaint(maintId);
    if (!job || job.status !== 'waiting_approval') {
        toast('Nothing to approve right now');
        return;
    }
    job.status = 'approved';
    if (typeof syncContractorJobToMaintenance === 'function') syncContractorJobToMaintenance(job);
    if (item && typeof addMaintHistoryEvent === 'function') {
        addMaintHistoryEvent(item, 'Work approved', job.invoice?.amount || '');
    }
    if (typeof saveContractorJobs === 'function') saveContractorJobs();
    AppStore.save();
    toast(`Approved — ${maintPaidByLabel(item).toLowerCase()} via Stripe`);
    render();
}

function payMaintViaStripe(cid) {
    const inv = AppStore.contractorInvoices.find(c => c.id === cid);
    if (!inv) return;
    const item = MAINTENANCE_ITEMS.find(m => m.id === inv.maintId);
    const job = inv.maintId != null ? getContractorJobForMaint(inv.maintId) : null;
    if (job && job.status !== 'approved') {
        toast('Approve work before paying');
        return;
    }
    openStripeCheckout({
        amount: inv.amount,
        label: inv.job,
        onSuccess: () => {
            inv.status = 'Paid';
            if (job) {
                job.status = 'paid';
                if (typeof saveContractorJobs === 'function') saveContractorJobs();
                if (typeof syncContractorJobToMaintenance === 'function') syncContractorJobToMaintenance(job);
            }
            if (item) {
                item.status = 'done';
                item.paymentPending = false;
                if (typeof addMaintHistoryEvent === 'function') addMaintHistoryEvent(item, 'Paid via Stripe', inv.amount);
                if (typeof endJobGroupChatForMaint === 'function') endJobGroupChatForMaint(item.id, { auto: true, silent: true });
            }
            pushNotification({
                icon: 'credit-card', color: ['#ECFDF5', '#16A34A'],
                title: 'Maintenance paid', desc: `${inv.amount} · ${inv.job}`,
                time: 'Just now', unread: false, screen: 'maintenance-detail', opts: { mid: inv.maintId },
            });
            AppStore.save();
            toast(`Paid ${inv.amount}`);
            render();
        },
    });
}

function maintSourceMatches(item, source) {
    if (source === 'tenant') return isTenantMaintReport(item);
    if (source === 'landlord') return !isTenantMaintReport(item);
    return true;
}

function sortMaintInbox(items) {
    return [...items].sort((a, b) => {
        const aNeeds = maintNeedsContractor(a) && isTenantMaintReport(a) ? 0 : 1;
        const bNeeds = maintNeedsContractor(b) && isTenantMaintReport(b) ? 0 : 1;
        if (aNeeds !== bNeeds) return aNeeds - bNeeds;
        const rank = { open: 0, progress: 1, done: 2 };
        const statusDiff = (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
        if (statusDiff) return statusDiff;
        return (b.id ?? 0) - (a.id ?? 0);
    });
}

function maintInboxIconClass(status) {
    if (status === 'done') return 'txn-icon-paid';
    if (status === 'progress') return 'txn-icon-progress';
    return 'txn-icon-pending';
}

function maintInboxStatusBadge(status) {
    const map = {
        open: ['Open', 'txn-badge-pending'],
        progress: ['In progress', 'txn-badge-progress'],
        done: ['Done', 'txn-badge-paid'],
    };
    return map[status] || ['Open', 'txn-badge-pending'];
}

function renderMaintStatusFilters(counts, active) {
    return `
    <div class="maint-status-pills" role="tablist" aria-label="Filter by status">
        ${[
            ['open', 'Open', counts.open],
            ['progress', 'In progress', counts.progress],
            ['done', 'Done', counts.done],
            ['all', 'All statuses', counts.all],
        ].map(([key, label, n]) => `
        <button type="button" data-maint-filter="${key}" class="maint-status-pill maint-status-pill--${key} ${active === key ? 'maint-status-pill--active' : ''}" aria-pressed="${active === key}">
            <span class="maint-status-pill-label">${label}</span>
            <span class="maint-status-pill-count">${n}</span>
        </button>`).join('')}
    </div>`;
}

function renderMaintInboxRow(item) {
    return renderMaintInboxCard(item);
}

function renderMaintInboxCard(item, opts = {}) {
    const priority = maintPriorityTone(item.priority);
    const workStatus = maintStatusTone(item.status);
    const tenantReport = isTenantMaintReport(item);
    const job = getContractorJobForMaint(item.id);
    const assigned = maintHasAssignedContractor(item, job);
    const needsContractor = (item.status === 'open' || item.status === 'progress') && !assigned;
    const showAssign = !opts.hideAssign && tenantReport && needsContractor && STATE.userRole !== 'tenant';
    const propName = item.prop.split(',')[0];
    let location;
    if (opts.hideProperty) {
        location = item.unit && item.unit !== '—' ? item.unit : '';
    } else {
        location = typeof formatMaintLocation === 'function'
            ? formatMaintLocation(item, { propName })
            : `${propName}${item.unit && item.unit !== '—' ? ` · ${item.unit}` : ''}`;
    }
    const when = item.reportedAt || item.time || '—';
    const thumb = maintCardThumbHtml(item, 'maint-inbox-card-photo');
    const actionHtml = showAssign
        ? `<button type="button" data-action="quick-assign-contractor" data-mid="${item.id}" class="maint-inbox-card-assign">Assign</button>`
        : '';
    return `
    <div class="maint-inbox-card card${showAssign ? ' maint-inbox-card--assign' : ''}">
        <div class="maint-inbox-card-inner">
            <div class="maint-inbox-card-layout">
                ${thumb}
                <div class="maint-inbox-card-stack min-w-0">
                    <button type="button" data-go="maintenance-detail" data-mid="${item.id}" class="maint-inbox-card-main w-full text-left">
                        <div class="maint-inbox-card-body min-w-0">
                            <div class="maint-inbox-card-head">
                                <p class="maint-inbox-card-title">${escapeHtml(item.issue)}</p>
                                <span class="maint-inbox-card-time">${escapeHtml(when)}</span>
                            </div>
                            <p class="maint-inbox-card-loc">${escapeHtml(location)}</p>
                        </div>
                    </button>
                    <div class="maint-inbox-card-footer">
                        <div class="maint-inbox-card-badges">
                            <span class="maint-work-status-pill ${workStatus.cls}">${workStatus.label}</span>
                            <span class="maint-priority-pill ${priority.cls}">${priority.label}</span>
                        </div>
                        ${actionHtml}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderMaintenancePageHeader() {
    return `
    <div class="screen-header maint-page-header">
        <div class="sub-header-row">
            <div class="sub-header-left">
                <button type="button" data-action="back" class="back-btn" aria-label="Back"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <div class="min-w-0">
                    <h1 class="sub-header-title">Maintenance</h1>
                </div>
            </div>
        </div>
    </div>`;
}

function maintCardThumbHtml(item, imgClass = 'maint-prop-card-thumb-img') {
    const photos = getMaintReportPhotos(item);
    if (photos.length) {
        return `<img src="${photos[0]}" alt="" class="${imgClass}">`;
    }
    const trade = resolveMaintTradeCategory(item);
    const iconWrapClass = imgClass.includes('maint-inbox-card-photo')
        ? `${imgClass} maint-inbox-card-photo-icon`
        : imgClass === 'maint-card-row-img'
            ? 'maint-card-row-img maint-card-row-thumb-icon'
            : 'maint-prop-card-thumb-icon';
    return `<div class="${iconWrapClass}" style="background:${trade.bg};color:${trade.color}" aria-hidden="true">
        <i data-lucide="${trade.icon}" class="w-5 h-5"></i>
    </div>`;
}

function getMaintContractorName(item, job) {
    if (item?.contractor && item.contractor !== '—') return item.contractor;
    if (job?.contractorName) return job.contractorName;
    if (job && typeof CONTRACTORS !== 'undefined') {
        const trade = resolveMaintTradeCategory(item);
        const match = CONTRACTORS.find(c => c.tradeId === trade.id || c.name === item?.contractor);
        if (match) return match.name;
    }
    return '';
}

function maintHasAssignedContractor(item, job) {
    if (getMaintContractorName(item, job)) return true;
    if (job && !['cancelled', 'rejected'].includes(job.status)) return true;
    return false;
}

function renderMaintPropCard(item) {
    return renderMaintInboxCard(item, { hideProperty: true });
}

function renderMaintPlaceFilters() {
    const propF = STATE.maintPropertyFilter;
    const unitF = STATE.maintUnitFilter;
    const units = propF != null && typeof getPropertyUnits === 'function'
        ? getPropertyUnits(propF)
        : [];
    const propLabel = propF != null ? (PROPERTIES[propF]?.name || 'Property') : 'All properties';
    const unitLabel = unitF || 'All units';
    return `
    <div class="maint-place-filters">
        <label class="maint-place-select-wrap">
            <select data-maint-property-filter class="maint-place-select" aria-label="Filter by property">
                <option value="all"${propF == null ? ' selected' : ''}>All properties</option>
                ${PROPERTIES.map(p => `<option value="${p.id}"${propF === p.id ? ' selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
        <label class="maint-place-select-wrap">
            <select data-maint-unit-filter class="maint-place-select" aria-label="Filter by unit"${propF == null ? ' disabled' : ''}>
                <option value="all"${!unitF ? ' selected' : ''}>All units</option>
                ${units.map(u => {
                    const name = typeof unitName === 'function' ? unitName(u) : u.name;
                    return `<option value="${escapeHtml(name)}"${unitF === name ? ' selected' : ''}>${escapeHtml(name)}</option>`;
                }).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
    </div>
    ${propF != null ? `
    <div class="maint-place-banner">
        <span>${escapeHtml(propLabel)}${unitF ? ` · ${escapeHtml(unitF)}` : ''}</span>
        <button type="button" data-action="clear-maint-place-filters" class="maint-place-clear">Clear</button>
    </div>` : ''}`;
}

function renderMaintInboxSection(title, list, spaced) {
    if (!list.length) return '';
    return `
        <p class="txn-section-label${spaced ? ' txn-section-label--spaced' : ''}">${title}</p>
        <div class="txn-list">${list.map(renderMaintInboxRow).join('')}</div>`;
}

function screenMaintenanceEnhanced() {
    const sourceF = STATE.maintSourceFilter || 'tenant';
    const f = STATE.maintFilter || 'all';
    const scopeF = STATE.maintScopeFilter || 'all';
    const propF = STATE.maintPropertyFilter;
    const unitF = STATE.maintUnitFilter;
    const q = (STATE.search.maintenance || '').toLowerCase();
    const isCommunal = typeof isCommunalMaint === 'function' ? isCommunalMaint : () => false;
    const tenantReports = MAINTENANCE_ITEMS.filter(m => isTenantMaintReport(m));
    const landlordLogs = MAINTENANCE_ITEMS.filter(m => !isTenantMaintReport(m));
    const sourceCounts = {
        tenant: tenantReports.length,
        landlord: landlordLogs.length,
        all: MAINTENANCE_ITEMS.length,
    };
    let items = MAINTENANCE_ITEMS.filter(m => maintSourceMatches(m, sourceF));
    if (propF != null) items = items.filter(m => m.propertyId === propF);
    if (unitF) items = items.filter(m => !isCommunal(m) && m.unit === unitF);
    if (f !== 'all') items = items.filter(m => m.status === f);
    if (scopeF === 'unit') items = items.filter(m => !isCommunal(m));
    else if (scopeF === 'communal') items = items.filter(m => isCommunal(m));
    if (q) {
        items = items.filter(m =>
            m.issue.toLowerCase().includes(q)
            || m.prop.toLowerCase().includes(q)
            || (m.unit || '').toLowerCase().includes(q)
            || (m.communalArea || '').toLowerCase().includes(q)
            || (m.tenantName || '').toLowerCase().includes(q)
            || (m.desc || '').toLowerCase().includes(q)
        );
    }
    items = sortMaintInbox(items);
    const scopedForCounts = MAINTENANCE_ITEMS.filter(m => maintSourceMatches(m, sourceF));
    const counts = {
        all: scopedForCounts.length,
        open: scopedForCounts.filter(m => m.status === 'open').length,
        progress: scopedForCounts.filter(m => m.status === 'progress').length,
        done: scopedForCounts.filter(m => m.status === 'done').length,
    };
    const listHtml = items.length
        ? `<div class="maint-list maint-inbox-list">${items.map(m => renderMaintInboxRow(m)).join('')}</div>`
        : emptyState('wrench', 'No issues here', sourceF === 'tenant' ? 'Tenant reports appear when tenants log issues from their portal.' : 'Tap + to log a new issue, or try another filter.', 'Log issue', null, 'log-maintenance');
    return `${renderMaintenancePageHeader()}
    <div class="screen-content screen-enter maint-page">
        <div class="maint-search-row">
            <div class="search-bar flex-1">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-search="maintenance" type="text" value="${STATE.search.maintenance || ''}" placeholder="Search issues, tenants, flats…" class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
            </div>
            <button type="button" data-go="log-maintenance" class="maint-log-btn" title="${LANDLORD_MAINT_CREATE_LABEL}" aria-label="${LANDLORD_MAINT_CREATE_LABEL}">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
        </div>
        ${renderMaintPlaceFilters()}
        <div class="maint-source-tabs filter-tabs">
            ${[
                ['tenant', 'users', 'Tenant reports', sourceCounts.tenant],
                ['landlord', 'clipboard-list', 'My logs', sourceCounts.landlord],
                ['all', 'layers', 'All', sourceCounts.all],
            ].map(([key, icon, label, n]) => `
            <button type="button" data-maint-source-filter="${key}" class="filter-chip maint-source-chip ${sourceF === key ? 'active' : ''}">
                <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
                <span>${label} (${n})</span>
            </button>`).join('')}
        </div>
        ${renderMaintStatusFilters(counts, f)}
        <div class="maint-scope-tabs">
            ${[
                ['all', 'map-pin', 'All locations'],
                ['unit', 'home', 'Units'],
                ['communal', 'building-2', 'Communal'],
            ].map(([key, icon, label]) => `
            <button type="button" data-maint-scope-filter="${key}" class="maint-scope-chip ${scopeF === key ? 'active' : ''}">
                <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
                <span>${label}</span>
            </button>`).join('')}
        </div>
        <p class="maint-inbox-count">${items.length} issue${items.length === 1 ? '' : 's'}</p>
        ${listHtml}
    </div>`;
}

function screenMaintenanceHistory() {
    const done = MAINTENANCE_ITEMS.filter(m => m.status === 'done');
    return `${topBar('Maintenance History', { back: true })}
    <div class="screen-content screen-content-sm screen-enter prop-hub-page">
        <div class="stack-sm">
            ${done.length ? done.map(m => maintCard(m)).join('') : emptyState('wrench', 'No history yet', 'Completed jobs will appear here.', 'Back to Maintenance', null, 'maintenance')}
        </div>
    </div>`;
}

function screenMaintenanceDetailEnhanced() {
    const item = maintItem(STATE.maintId);
    const statusLabel = maintStatusLabel[item.status] || item.status;
    const [pBg, pColor] = maintPriorityStyle(item.priority);
    const contractorJob = getContractorJobForMaint(item.id);
    if (contractorJob && typeof syncContractorJobToMaintenance === 'function') {
        syncContractorJobToMaintenance(contractorJob);
    }
    const timeline = getMaintTimeline(item).filter(([title]) => title !== 'Contractor note');
    if (contractorJob?.notes?.length) {
        contractorJob.notes.forEach(n => {
            if (!item.history?.some(h => h.event === 'Contractor note' && h.detail === n.text)) {
                addMaintHistoryEvent(item, 'Contractor note', n.text);
            }
        });
    }
    const chatId = getContractorChatId(item.contractor);
    const location = typeof formatMaintLocation === 'function'
        ? formatMaintLocation(item)
        : `${item.prop.split(',')[0]}${item.unit && item.unit !== '—' ? ` · ${item.unit}` : ''}`;
    const isTenantView = STATE.userRole === 'tenant';

    if (isTenantView) {
        ensureMaintPaidBy(item);
        const categoryMeta = resolveMaintTradeCategory(item);
        const statusBadge = getMaintDetailStatusBadge(item, contractorJob);
        const assigned = item.contractor && item.contractor !== '—';
        return `${topBar(item.issue, { back: true, sub: location })}
        <div class="screen-content screen-enter maint-detail-v2-page">
            <div class="maint-v2-badges">
                <span class="maint-v2-badge maint-v2-badge--priority"><i data-lucide="alert-circle" class="w-3 h-3"></i> ${item.priority} priority</span>
                <span class="maint-v2-badge" style="background:${statusBadge.bg};color:${statusBadge.color}">${statusBadge.label}</span>
            </div>
            ${renderMaintTenantPropertyCard(item)}
            ${renderMaintIssueCard(item, categoryMeta)}
            ${renderMaintProgressStepperV2(item, contractorJob)}
            ${assigned ? renderMaintTenantContractorCard(item, contractorJob, chatId) : renderMaintTenantAwaitingCard()}
            ${contractorJob ? renderSharedMaintJobPanel(item, contractorJob, 'tenant') : ''}
            ${renderMaintWorkNotes(item, contractorJob)}
            ${renderContractorWorkMedia(contractorJob)}
            ${maintReviewEligible(item, contractorJob) ? renderContractorRatingCard(item, contractorJob) : ''}
            ${item.status === 'done' ? `<p class="maint-resolved-note"><i data-lucide="check-circle" class="w-4 h-4"></i> Issue resolved</p>` : ''}
        </div>
        ${renderMaintMediaPreviewModal()}`;
    }

    ensureMaintPaidBy(item);
    const categoryMeta = resolveMaintTradeCategory(item);
    const statusBadge = getMaintDetailStatusBadge(item, contractorJob);
    const needsAssign = (!item.contractor || item.contractor === '—') && item.status !== 'done';
    const footer = renderMaintDetailFooter(item, contractorJob);
    return `${topBar('Maintenance issue', { back: true })}
    <div class="screen-content screen-enter maint-detail-v2-page${footer ? ' maint-detail-v2-page--footer' : ''}">
        <div class="maint-v2-badges">
            <span class="maint-v2-badge maint-v2-badge--priority"><i data-lucide="alert-circle" class="w-3 h-3"></i> ${item.priority} priority</span>
            <span class="maint-v2-badge" style="background:${statusBadge.bg};color:${statusBadge.color}">${statusBadge.label}</span>
            ${isCommunalMaint(item) ? '<span class="maint-v2-badge" style="background:#E0E7FF;color:#4338CA">Communal</span>' : ''}
        </div>
        ${renderMaintPropertyContactCard(item)}
        ${renderMaintIssueCard(item, categoryMeta)}
        ${renderMaintProgressStepperV2(item, contractorJob)}
        ${needsAssign ? renderMaintAssignContractorSection(item) : ''}
        ${item.contractor !== '—' ? renderMaintContractorCard(item, contractorJob, chatId) : ''}
        ${contractorJob ? renderSharedMaintJobPanel(item, contractorJob, 'landlord') : ''}
        ${renderMaintWorkNotes(item, contractorJob)}
        ${renderContractorWorkMedia(contractorJob)}
        ${renderMaintMilestoneCard(item, contractorJob)}
        ${maintReviewEligible(item, contractorJob) ? renderContractorRatingCard(item, contractorJob) : ''}
        ${item.status !== 'done' ? `<button type="button" data-action="cancel-maintenance" data-mid="${item.id}" class="maint-cancel-link">Cancel issue</button>` : `<p class="maint-resolved-note"><i data-lucide="check-circle" class="w-4 h-4"></i> Issue resolved</p>`}
    </div>
    ${footer}
    ${renderMaintMediaPreviewModal()}`;
}

function inviteNidProofSummary(draft = {}) {
    const front = STATE.nidProofFrontName || draft.nidProofFrontName;
    const back = STATE.nidProofBackName || draft.nidProofBackName;
    const legacy = STATE.nidProofName || draft.nidProofName;
    if (front && back) return `${front} + ${back}`;
    if (front) return front;
    return legacy || '';
}

function hasNidProofFront(draft = {}) {
    return !!(STATE.nidProofFrontName || draft.nidProofFrontName || STATE.nidProofName || draft.nidProofName);
}

function hasNidProofBack(draft = {}) {
    return !!(STATE.nidProofBackName || draft.nidProofBackName);
}

function hasCompleteNidProof(draft = {}) {
    return hasNidProofFront(draft) && hasNidProofBack(draft);
}

function validateNidProof(draft = {}) {
    if (!hasNidProofFront(draft)) return 'Upload the front of the NID card';
    if (!hasNidProofBack(draft)) return 'Upload the back of the NID card';
    return null;
}

function hasInviteNidProof(draft = {}) {
    return hasCompleteNidProof(draft);
}

function renderNidProofUploadTile(side, fileName, required) {
    const label = side === 'back' ? 'Back' : 'Front';
    const uploaded = !!fileName;
    return `
    <button type="button" data-action="upload-nid-proof" data-nid-side="${side}" class="nid-proof-tile${uploaded ? ' nid-proof-tile--done' : ''}">
        <i data-lucide="${uploaded ? 'file-check' : 'upload'}" class="w-5 h-5"></i>
        <span class="nid-proof-tile-label">${label}${required ? ' *' : ''}</span>
        <span class="nid-proof-tile-name">${uploaded ? escapeHtml(fileName) : (required ? 'Required' : 'Optional')}</span>
    </button>`;
}

function renderNidProofReviewPreview(draft = {}) {
    const front = STATE.nidProofFrontName || draft.nidProofFrontName || '';
    const back = STATE.nidProofBackName || draft.nidProofBackName || '';
    const legacy = STATE.nidProofName || draft.nidProofName || '';
    const frontName = front || legacy;
    const backName = back;
    if (!frontName && !backName) return '';
    const tile = (side, name) => `
    <div class="nid-proof-review-tile">
        <span class="nid-proof-review-thumb" aria-hidden="true">
            <i data-lucide="file-image" class="w-6 h-6"></i>
        </span>
        <span class="nid-proof-review-label">${side}</span>
        <span class="nid-proof-review-name">${name ? escapeHtml(name) : '—'}</span>
    </div>`;
    return `
    <div class="invite-review-nid">
        <p class="invite-review-nid-title">ID document</p>
        <div class="nid-proof-grid nid-proof-grid--review">
            ${tile('Front', frontName)}
            ${tile('Back', backName)}
        </div>
    </div>`;
}

function renderNidProofUploadFields(draft = {}) {
    const front = STATE.nidProofFrontName || draft.nidProofFrontName || '';
    const back = STATE.nidProofBackName || draft.nidProofBackName || '';
    const legacy = !front && !back && (STATE.nidProofName || draft.nidProofName);
    const err = STATE.formErrors.nidProof;
    return `
    <div class="nid-proof-block${err ? ' nid-proof-block--error' : ''}">
        <label class="form-label">${requiredLabel('ID document')}</label>
        <p class="form-helper nid-proof-hint">National ID card — upload front and back.</p>
        <div class="nid-proof-grid">
            ${renderNidProofUploadTile('front', front || legacy, true)}
            ${renderNidProofUploadTile('back', back, true)}
        </div>
        ${err ? `<p class="form-error-msg"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${err}</p>` : ''}
    </div>`;
}

function inviteDraftFullName(draft = {}, prefill = {}) {
    if (draft.fullName) return draft.fullName.trim();
    if (typeof fullNameFromParts === 'function') {
        const fromDraft = fullNameFromParts(draft.firstName, draft.lastName);
        if (fromDraft) return fromDraft;
        const fromPrefill = fullNameFromParts(prefill.firstName, prefill.lastName);
        if (fromPrefill) return fromPrefill;
    }
    return prefill.fullName?.trim()
        || [draft.firstName, draft.lastName].filter(Boolean).join(' ').trim()
        || [prefill.fullName, [prefill.firstName, prefill.lastName].filter(Boolean).join(' ').trim()].find(Boolean)
        || '';
}

function unitRentDigits(propertyId, unitName) {
    const rent = unitName
        ? (getUnitByName(propertyId, unitName)?.rent || propertyDefaultFlatRent(propertyId))
        : propertyDefaultFlatRent(propertyId);
    return String(rent).replace(/[^\d]/g, '');
}

function unitRentDisplay(propertyId, unitName) {
    return unitName
        ? (getUnitByName(propertyId, unitName)?.rent || propertyDefaultFlatRent(propertyId))
        : propertyDefaultFlatRent(propertyId);
}

function resetInviteWizardState() {
    STATE.inviteStep = 1;
    STATE.inviteDraft = null;
    STATE.invitePrefill = null;
    STATE.nidProofName = null;
    STATE.nidProofFrontName = null;
    STATE.nidProofBackName = null;
    ['fullName', 'dob', 'idNumber', 'nidProof', 'email', 'phone', 'unit', 'leaseStart', 'leaseEnd', 'deposit', 'advancePaid'].forEach((key) => {
        delete STATE.formErrors[key];
    });
}

function applyInviteMemberPrefill(opts = {}) {
    if (!opts.inviteEmail && !opts.inviteFirst && !opts.invitePhone && !opts.unit) return;
    STATE.invitePrefill = {
        email: opts.inviteEmail || '',
        fullName: [opts.inviteFirst, opts.inviteLast].filter(Boolean).join(' ').trim(),
        firstName: opts.inviteFirst || '',
        lastName: opts.inviteLast || '',
        phone: opts.invitePhone || '',
        unit: opts.unit || '',
    };
}

function onInviteUnitChange() {
    captureInviteDraft();
    const unitEl = document.querySelector('[data-invite="unit"]');
    const unit = unitEl ? unitEl.value.trim() : '';
    if (unit) STATE.selectedUnit = unit;
    const rentDisplay = unitRentDisplay(STATE.propertyId, unit);
    const rentDigits = unitRentDigits(STATE.propertyId, unit);
    const synced = { unit, rent: rentDisplay, deposit: rentDigits, advancePaid: rentDigits };
    STATE.inviteDraft = { ...(STATE.inviteDraft || {}), ...synced };
    if (STATE.invitePrefill) STATE.invitePrefill = { ...STATE.invitePrefill, ...synced };
    render();
}

function screenInviteTenantEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    const step = STATE.inviteStep || 1;
    if (step === 4) captureInviteDraft();
    const draft = STATE.inviteDraft || {};
    const prefill = { ...(STATE.invitePrefill || {}), ...draft };
    const selectedUnit = prefill.unit || STATE.selectedUnit || '';
    const unitRent = unitRentDisplay(STATE.propertyId, selectedUnit);
    const unitRentDefaultDigits = unitRentDigits(STATE.propertyId, selectedUnit);
    const { tenancy, members } = selectedUnit ? getFlatMemberRoster(STATE.propertyId, selectedUnit) : { tenancy: null, members: [] };
    const pendingMembers = members.filter(m => !m.tenantId && m.accountStatus !== 'pending');
    const stepLabels = ['Identity', 'Contact', 'Unit & lease', 'Review & send'];
    const wizardProgress = `
        <div class="wizard-progress">
            <div class="wizard-steps">
                ${[1, 2, 3, 4].map(s => `<div class="wizard-step ${s <= step ? 'active' : ''} ${s < step ? 'done' : ''}"></div>`).join('')}
            </div>
            <p class="wizard-step-label">Step ${step} of 4 · ${stepLabels[step - 1]}</p>
        </div>`;
    const propertyCard = `
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>`;
    const groupTip = tenancy?.type === 'group' && pendingMembers.length ? `
        <div class="ux-tip">
            <p class="ux-tip-title">Group tenancy</p>
            <p class="ux-tip-text">${pendingMembers.length} member${pendingMembers.length === 1 ? '' : 's'} still need portal invites on this unit.</p>
        </div>` : '';
    let stepBody = '';
    if (step === 1) {
        stepBody = `
        <p class="step-intro">Name, date of birth, and ID for the person moving in.</p>
        ${inviteFormFieldReq('Full Name', 'fullName', inviteDraftFullName(draft, prefill), 'text', 'e.g. Sarah Johnson')}
        ${inviteFormFieldReq('Date of Birth', 'dob', prefill.dob || '', 'date')}
        ${inviteFormFieldReq('NID number', 'idNumber', prefill.idNumber || '', 'text', 'National ID number')}
        ${renderNidProofUploadFields(draft)}`;
    } else if (step === 2) {
        stepBody = `
        <p class="step-intro">Contact details for the invite email.</p>
        ${inviteFormFieldReq('Email Address', 'email', prefill.email || '', 'email')}
        ${inviteFormFieldReq('Mobile Number', 'phone', prefill.phone || '', 'tel', '+44 7700 900000')}
        ${inviteFormField('Emergency contact', prefill.emergency || '', 'text', 'e.g. James Johnson', 'emergency')}
        ${inviteFormField('Emergency phone', prefill.emergencyPhone || '', 'tel', '+44 7700 900000', 'emergencyPhone')}`;
    } else if (step === 3) {
        stepBody = `
        <p class="step-intro">Unit, lease dates, and move-in payments.</p>
        <div class="form-group ${STATE.formErrors.unit ? 'form-group-error' : ''}">
            <label class="form-label">${requiredLabel('Unit')}</label>
            ${unitSelectHtml(STATE.propertyId, 'unit', true, selectedUnit).replace('class="form-input form-select"', `class="form-input form-select${STATE.formErrors.unit ? ' form-input-error' : ''}"`)}
            ${STATE.formErrors.unit ? `<p class="form-error-msg"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${STATE.formErrors.unit}</p>` : ''}
        </div>
        <div class="form-group">
            <label class="form-label">Unit rent</label>
            <input data-invite="rent" type="text" class="form-input" placeholder="${unitRent}" value="${prefill.rent || unitRent}">
            <p class="form-helper">${unitRent} per month · this unit only</p>
        </div>
        ${inviteFormFieldReq('Lease Start', 'leaseStart', prefill.leaseStart || '', 'date')}
        ${inviteFormFieldReq('Lease End', 'leaseEnd', prefill.leaseEnd || '', 'date')}
        <p class="screen-section-title">Deposit & payments</p>
        ${inviteFormField('Security deposit (£)', prefill.deposit || unitRentDefaultDigits, 'number', 'Usually 1 month rent', 'deposit')}
        ${inviteFormField('Advance rent (£)', prefill.advancePaid || unitRentDefaultDigits, 'number', 'First month or holding deposit', 'advancePaid')}
        <div class="form-group">
            <label class="form-label">Deposit protection scheme</label>
            <select data-invite="depositScheme" class="form-input form-select">
                ${['MyDeposits', 'DPS', 'TDS', 'Not yet registered'].map(s => `<option${(prefill.depositScheme || 'MyDeposits') === s ? ' selected' : ''}>${s}</option>`).join('')}
            </select>
        </div>
        ${inviteFormField('Protection reference', prefill.protectionRef || '', 'text', 'Optional scheme reference number', 'protectionRef')}
        <div class="form-group">
            <label class="form-label">Personal Message</label>
            <textarea data-invite="message" class="form-input" rows="3" placeholder="Add a personal message (optional)">${prefill.message || ''}</textarea>
        </div>`;
    } else {
        const fullName = inviteDraftFullName(prefill, STATE.invitePrefill || {});
        stepBody = `
        <p class="step-intro">Check details before sending.</p>
        <div class="invite-review-card">
            <div class="invite-review-row"><span class="invite-review-label">Tenant</span><span class="invite-review-value">${fullName || '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Date of birth</span><span class="invite-review-value">${prefill.dob ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(prefill.dob) : prefill.dob) : '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">NID</span><span class="invite-review-value">${prefill.idNumber || '—'}</span></div>
            ${renderNidProofReviewPreview(prefill)}
            <div class="invite-review-row"><span class="invite-review-label">Email</span><span class="invite-review-value">${prefill.email || '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Phone</span><span class="invite-review-value">${prefill.phone || '—'}</span></div>
            ${prefill.emergency || prefill.emergencyPhone ? `<div class="invite-review-row"><span class="invite-review-label">Emergency</span><span class="invite-review-value">${[prefill.emergency, prefill.emergencyPhone].filter(Boolean).join(' · ') || '—'}</span></div>` : ''}
            <div class="invite-review-row"><span class="invite-review-label">Unit</span><span class="invite-review-value">${selectedUnit || '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Rent</span><span class="invite-review-value">${typeof formatMoneyField === 'function' ? formatMoneyField(prefill.rent || unitRent) : (prefill.rent || unitRent)}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Lease</span><span class="invite-review-value">${prefill.leaseStart && prefill.leaseEnd ? `${typeof formatDisplayDate === 'function' ? formatDisplayDate(prefill.leaseStart) : prefill.leaseStart} → ${typeof formatDisplayDate === 'function' ? formatDisplayDate(prefill.leaseEnd) : prefill.leaseEnd}` : '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Security deposit</span><span class="invite-review-value">${prefill.deposit ? (typeof formatMoneyField === 'function' ? formatMoneyField(prefill.deposit) : `£${String(prefill.deposit).replace(/[^\d]/g, '')}`) : '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Advance paid</span><span class="invite-review-value">${prefill.advancePaid ? (typeof formatMoneyField === 'function' ? formatMoneyField(prefill.advancePaid) : `£${String(prefill.advancePaid).replace(/[^\d]/g, '')}`) : '—'}</span></div>
            <div class="invite-review-row"><span class="invite-review-label">Deposit scheme</span><span class="invite-review-value">${prefill.depositScheme || 'MyDeposits'}</span></div>
            ${prefill.protectionRef ? `<div class="invite-review-row"><span class="invite-review-label">Protection ref</span><span class="invite-review-value">${prefill.protectionRef}</span></div>` : ''}
            ${prefill.message ? `<div class="invite-review-row"><span class="invite-review-label">Message</span><span class="invite-review-value">${prefill.message}</span></div>` : ''}
        </div>`;
    }
    const primaryLabel = step === 4 ? 'Send Invitation' : 'Continue';
    return `${topBar('Invite Tenant', { back: true })}
    <div class="screen-content screen-enter">
        ${propertyCard}
        ${groupTip}
        ${wizardProgress}
        ${stepBody}
        <div class="wizard-actions">
            ${step > 1 ? `<button type="button" data-action="invite-wizard-back" class="btn-secondary flex-1 py-3.5 text-[14px]">Back</button>` : ''}
            <button type="button" data-action="invite-wizard-next" class="btn-primary flex-1 py-3.5 text-[14px]">${primaryLabel}</button>
        </div>
    </div>`;
}

function captureInviteDraft() {
    const draft = { ...(STATE.inviteDraft || {}) };
    ['idNumber', 'fullName', 'dob', 'email', 'phone', 'emergency', 'emergencyPhone', 'unit', 'rent', 'leaseStart', 'leaseEnd', 'deposit', 'advancePaid', 'depositScheme', 'protectionRef', 'message'].forEach((key) => {
        const el = document.querySelector(`[data-invite="${key}"]`) || document.querySelector(`[data-field="${key}"]`);
        draft[key] = el ? (el.value || '').trim() : (draft[key] || '');
    });
    const fullName = draft.fullName || inviteField('fullName');
    if (fullName && typeof splitFullName === 'function') {
        const { firstName, lastName } = splitFullName(fullName);
        draft.firstName = firstName;
        draft.lastName = lastName;
    }
    if (STATE.nidProofFrontName) draft.nidProofFrontName = STATE.nidProofFrontName;
    if (STATE.nidProofBackName) draft.nidProofBackName = STATE.nidProofBackName;
    if (STATE.nidProofName) draft.nidProofName = STATE.nidProofName;
    if (!draft.unit && STATE.selectedUnit) draft.unit = STATE.selectedUnit;
    STATE.inviteDraft = draft;
    return draft;
}

function validateInviteStep(step) {
    captureInviteDraft();
    clearFormErrors();
    const d = STATE.inviteDraft || {};
    let ok = true;
    const fail = (key, message) => {
        STATE.formErrors[key] = message;
        ok = false;
    };
    if (step === 1) {
        if (!d.fullName && !d.firstName) fail('fullName', 'Enter tenant full name');
        if (!d.dob) fail('dob', 'Enter date of birth');
        if (!d.idNumber) fail('idNumber', 'Enter NID number');
        const nidErr = typeof validateNidProof === 'function' ? validateNidProof(d) : null;
        if (nidErr) fail('nidProof', nidErr);
    } else if (step === 2) {
        if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) fail('email', 'Enter a valid email address');
        if (!d.phone) fail('phone', 'Enter tenant phone number');
    } else if (step === 3) {
        if (!d.unit) fail('unit', 'Select a unit');
        if (!d.leaseStart) fail('leaseStart', 'Enter lease start date');
        if (!d.leaseEnd) fail('leaseEnd', 'Enter lease end date');
        else if (d.leaseStart && d.leaseEnd <= d.leaseStart) fail('leaseEnd', 'Lease end must be after start date');
        if (!d.deposit || !String(d.deposit).replace(/[^\d]/g, '')) fail('deposit', 'Enter security deposit amount');
    }
    if (!ok) {
        const firstMsg = Object.values(STATE.formErrors)[0] || 'Please complete the required fields';
        if (typeof toastError === 'function') toastError(firstMsg);
        else toast(firstMsg);
        render();
        setTimeout(() => {
            const firstErr = document.querySelector('.form-input-error, .form-group-error .form-input');
            firstErr?.focus();
            firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 60);
    }
    return ok;
}

function advanceInviteWizard() {
    if (!validateInviteStep(STATE.inviteStep || 1)) return;
    clearFormErrors();
    if ((STATE.inviteStep || 1) < 4) {
        STATE.inviteStep = (STATE.inviteStep || 1) + 1;
        render();
        return;
    }
    if (!STATE.nidProofName && STATE.inviteDraft?.nidProofName) STATE.nidProofName = STATE.inviteDraft.nidProofName;
    if (!STATE.nidProofFrontName && STATE.inviteDraft?.nidProofFrontName) STATE.nidProofFrontName = STATE.inviteDraft.nidProofFrontName;
    if (!STATE.nidProofBackName && STATE.inviteDraft?.nidProofBackName) STATE.nidProofBackName = STATE.inviteDraft.nidProofBackName;
    sendTenantInvitation();
}

function retreatInviteWizard() {
    captureInviteDraft();
    if ((STATE.inviteStep || 1) > 1) {
        STATE.inviteStep -= 1;
        render();
        return;
    }
    back();
}

function renderTenantMaintenanceSection(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const f = STATE.tenantMaintFilter || 'all';
    const tenantMaint = MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === listItem?.propertyId &&
        !isCommunalMaint(m) &&
        m.unit === listItem?.unit
    );
    const filtered = f === 'all' ? tenantMaint
        : f === 'open' ? tenantMaint.filter(m => m.status === 'open' || m.status === 'progress')
        : tenantMaint.filter(m => m.status === 'done');
    const openCount = tenantMaint.filter(m => m.status === 'open' || m.status === 'progress').length;
    const doneCount = tenantMaint.filter(m => m.status === 'done').length;
    return `
    <div class="filter-tabs" style="margin-bottom:12px">
        <button type="button" data-tenant-maint-filter="all" class="filter-chip ${f === 'all' ? 'active' : ''}">All (${tenantMaint.length})</button>
        <button type="button" data-tenant-maint-filter="open" class="filter-chip ${f === 'open' ? 'active' : ''}">Open (${openCount})</button>
        <button type="button" data-tenant-maint-filter="done" class="filter-chip ${f === 'done' ? 'active' : ''}">Resolved (${doneCount})</button>
    </div>
    <div class="maint-list">
        ${filtered.length ? filtered.map(m => maintCard(m, { hideProperty: true })).join('') : emptyState('wrench', 'No maintenance requests', 'Issues reported by this tenant appear here.', null, null, null)}
    </div>`;
}

function tenantActivitySortKey(raw) {
    if (!raw) return 0;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function renderTenantActivitySection(tenantId, t) {
    const events = [];
    const listItem = TENANT_LIST[tenantId];
    const tenantName = listItem?.name || `${t.firstName} ${t.lastName}`;

    const checkoutRec = AppStore.checkoutRecords?.find(r => r.tenantId === tenantId && r.notes?.trim());
    if (checkoutRec) {
        events.push({
            ic: 'log-out', bg: '#FEF2F2', color: '#DC2626',
            title: 'Check-out note',
            sub: truncateNote(checkoutRec.notes, 72),
            go: 'tenant-detail', opts: { tenantId, tenantTab: 'property' },
            sortAt: tenantActivitySortKey(checkoutRec.date) || 0,
        });
    }

    INVOICES.filter(i =>
        i.tenantId === tenantId || i.tenant === tenantName
    ).forEach(i => {
        events.push({
            ic: 'banknote', bg: '#ECFDF5', color: '#059669',
            title: i.status === 'Paid' ? 'Rent payment received' : `Invoice ${i.status.toLowerCase()}`,
            sub: `${i.amount} · ${i.status === 'Paid' ? (i.paidOn || i.due) : i.due}`,
            go: 'invoice-detail', opts: { iid: i.id },
            sortAt: tenantActivitySortKey(i.status === 'Paid' ? (i.paidOn || i.due) : i.due),
        });
    });

    MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === listItem?.propertyId &&
        (!listItem?.unit || m.unit === listItem.unit || m.unit === '—')
    ).forEach((m, idx) => {
        events.push({
            ic: 'wrench', bg: '#EFF6FF', color: '#2563EB',
            title: m.status === 'done' ? 'Maintenance resolved' : 'Maintenance update',
            sub: `${m.issue} · ${m.time}`,
            go: 'maintenance-detail', opts: { mid: m.id },
            sortAt: Date.now() - idx * 3600000,
        });
    });

    const chatId = getTenantChatId(tenantId);
    const conv = CONVERSATIONS[chatId];
    if (conv?.messages?.length) {
        const last = conv.messages[conv.messages.length - 1];
        events.push({
            ic: 'message-square', bg: '#EEF2FF', color: '#4F46E5',
            title: last.type === 'out' ? 'Message sent' : 'Message received',
            sub: last.text.slice(0, 60),
            go: 'chat', opts: { chatId },
            sortAt: Date.now(),
        });
    }

    getTenantDocuments(tenantId).forEach((doc, idx) => {
        events.push({
            ic: 'file-text', bg: '#F0FDF4', color: '#16A34A',
            title: 'Document shared',
            sub: doc[1],
            go: 'document-preview', opts: { previewSource: 'tenant', previewDocIdx: idx, tenantId },
            sortAt: tenantActivitySortKey(doc[2]) || (Date.now() - idx * 86400000),
        });
    });

    if (t.moveIn) {
        events.push({
            ic: 'user-plus', bg: '#FFFBEB', color: '#D97706',
            title: 'Tenant moved in',
            sub: typeof formatDisplayDate === 'function' ? formatDisplayDate(t.moveIn) : t.moveIn,
            sortAt: tenantActivitySortKey(t.moveIn),
        });
    }

    events.sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));

    if (!events.length) return `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`;
    return `
    <div class="tenant-timeline">
        ${events.map(e => `
        <button type="button" ${e.go ? `data-go="${e.go}" ${e.opts?.tenantId != null ? `data-tid="${e.opts.tenantId}"` : ''} ${e.opts?.tenantTab ? `data-tenant-tab="${e.opts.tenantTab}"` : ''} ${e.opts?.mid != null ? `data-mid="${e.opts.mid}"` : ''} ${e.opts?.iid != null ? `data-iid="${e.opts.iid}"` : ''} ${e.opts?.chatId != null ? `data-chat="${e.opts.chatId}"` : ''} ${e.opts?.previewSource ? `data-preview-source="${e.opts.previewSource}" data-preview-idx="${e.opts.previewDocIdx ?? 0}" ${e.opts.tenantId != null ? `data-tid="${e.opts.tenantId}"` : ''}` : ''}` : ''} class="tenant-timeline-item w-full text-left ${e.go ? 'card-hover' : ''}">
            <div class="tenant-timeline-icon" style="background:${e.bg};color:${e.color}"><i data-lucide="${e.ic}" class="w-4 h-4"></i></div>
            <div class="tenant-timeline-body">
                <p class="tenant-timeline-title">${e.title}</p>
                <p class="tenant-timeline-sub">${e.sub}</p>
            </div>
            ${e.go ? '<i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>' : ''}
        </button>`).join('')}
    </div>`;
}

function collectGroupMembers() {
    const rows = document.querySelectorAll('[data-member-row]');
    const members = [];
    rows.forEach(row => {
        const name = row.querySelector('[data-member-name]')?.value?.trim();
        const email = row.querySelector('[data-member-email]')?.value?.trim();
        const phone = row.querySelector('[data-member-phone]')?.value?.trim();
        if (name) members.push({ name, email: email || '', phone: phone || '' });
    });
    return members;
}

function addGroupMemberRow() {
    STATE.tenancyMemberDraft = collectGroupMembers();
    STATE.groupMemberCount = (STATE.groupMemberCount || 1) + 1;
    render();
}

function onTenancyUnitChange() {
    const unit = fieldVal('unit');
    if (!unit) return;
    STATE.selectedUnit = unit;
    const rentDigits = unitRentDigits(STATE.propertyId, unit);
    const rentDisplay = unitRentDisplay(STATE.propertyId, unit);
    STATE.tenancyPrefill = {
        ...(STATE.tenancyPrefill || {}),
        unit,
        rent: rentDigits,
        deposit: rentDigits,
        advancePaid: rentDigits,
    };
    const rentEl = document.querySelector('[data-field="rent"]');
    const depEl = document.querySelector('[data-field="deposit"]');
    const advEl = document.querySelector('[data-field="advancePaid"]');
    if (rentEl) rentEl.value = rentDigits;
    if (depEl) depEl.value = rentDigits;
    if (advEl) advEl.value = rentDigits;
    if (!rentEl) render();
}

function screenCreateTenancyEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    const count = STATE.groupMemberCount || 1;
    const prefill = STATE.tenancyPrefill || {};
    const selectedUnit = prefill.unit || STATE.selectedUnit || '';
    const rentDefault = selectedUnit
        ? unitRentDigits(STATE.propertyId, selectedUnit)
        : String(propertyDefaultFlatRent(STATE.propertyId) || '').replace(/[^\d]/g, '');
    const memberDraft = STATE.tenancyMemberDraft || [];
    return `${topBar('Set up lease', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(STATE.propertyId) : IMG.props[STATE.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>
        <div><label class="form-label">${requiredLabel('Tenancy Type')}</label>
        <select data-field="tenancyType" class="form-input form-select"><option value="solo">Solo Tenancy</option><option value="group">Group Tenancy</option></select></div>
        <div><label class="form-label">${requiredLabel('Unit')}</label>${unitSelectHtml(STATE.propertyId, 'unit', false, selectedUnit)}</div>
        <div id="group-fields" style="display:none">
            ${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}
            <p class="screen-section-title">Occupant List</p>
            <p class="form-helper mb-2">Each occupant can receive their own account invitation after tenancy is created.</p>
            <div id="member-list" class="stack-sm mb-2">
                ${Array.from({ length: count }, (_, i) => `
                <div class="card p-3" data-member-row>
                    <p class="text-[11px] font-semibold text-[#64748B] mb-2">Occupant ${i + 1}</p>
                    ${memberField('Full name', 'name', 'text', 'e.g. Sarah Johnson', memberDraft[i]?.name || '')}
                    ${memberField('Email', 'email', 'email', 'name@email.com', memberDraft[i]?.email || '')}
                    ${memberField('Phone', 'phone', 'tel', '+44 7700 900000', memberDraft[i]?.phone || '')}
                </div>`).join('')}
            </div>
            <button type="button" data-action="add-group-member" class="btn-secondary w-full py-2.5 text-[12px]">+ Add Occupant</button>
        </div>
        ${formFieldReq('Unit rent (£)', 'rent', prefill.rent || rentDefault, 'text', 'e.g. 2200')}
        ${formFieldReq('Start Date', 'start', prefill.start || '', 'date')}
        ${formFieldReq('End Date', 'end', prefill.end || '', 'date')}
        <p class="screen-section-title">Deposit & payments</p>
        ${formField('Security deposit (£)', prefill.deposit || rentDefault, 'number', '', 'deposit')}
        ${formField('Advance rent (£)', prefill.advancePaid || rentDefault, 'number', '', 'advancePaid')}
        <div><label class="form-label">Deposit protection scheme</label>
        <select data-field="depositScheme" class="form-input form-select"><option>MyDeposits</option><option>DPS</option><option>TDS</option><option>Not yet registered</option></select></div>
        ${formField('Protection reference', '', 'text', 'Optional scheme reference', 'protectionRef')}
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Save lease</button>
    </div>`;
}

function updateMaintStatus(status) {
    const item = maintItem(STATE.maintId);
    if (!item || item.status === status) return;
    if (status === 'progress') {
        item.status = 'progress';
        addMaintHistoryEvent(item, 'Work in progress', 'Status updated by landlord');
    } else if (status === 'done') {
        addMaintHistoryEvent(item, 'Work completed', 'Marked as resolved');
        item.status = 'done';
    }
    AppStore.save();
    toast(status === 'done' ? 'Issue completed' : 'Status updated');
    render();
}

function screenGlobalSearch() {
    const q = (STATE.search.global || '').toLowerCase().trim();
    const properties = !q ? [] : PROPERTIES.filter(p =>
        p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    );
    const tenants = !q ? [] : TENANT_LIST.filter(t =>
        t.name.toLowerCase().includes(q) || t.prop.toLowerCase().includes(q) || (t.unit || '').toLowerCase().includes(q)
    );
    const maintenance = !q ? [] : MAINTENANCE_ITEMS.filter(m =>
        m.issue.toLowerCase().includes(q) || m.prop.toLowerCase().includes(q)
    );
    const total = properties.length + tenants.length + maintenance.length;
    const resultBlock = (title, items, renderRow) => items.length ? `
        <p class="screen-section-title">${title}</p>
        <div class="stack-sm">${items.map(renderRow).join('')}</div>` : '';
    return `${topBar('Search', { back: true })}
    <div class="screen-content screen-enter">
        <div class="search-bar">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="global" type="text" value="${STATE.search.global}" placeholder="Properties, tenants, maintenance..." class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]" autofocus>
        </div>
        ${!q ? `<div class="card p-8 text-center mt-4"><p class="text-[13px] text-[#64748B]">Search across your portfolio, tenants, and maintenance issues.</p></div>` : total === 0 ? `
        <div class="card p-8 text-center mt-4">
            <i data-lucide="search-x" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold mt-3">No results for "${STATE.search.global}"</p>
            <p class="text-[12px] text-[#64748B] mt-1">Try a property name, tenant, or issue keyword</p>
        </div>` : `
        ${resultBlock('Properties', properties, p => `
        <button data-go="property-detail" data-pid="${p.id}" class="card p-4 flex items-center gap-3 w-full text-left">
            <img src="${IMG.props[p.id]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1 min-w-0"><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`)}
        ${resultBlock('Tenants', tenants, t => {
            const tenancy = typeof getTenancyForTenantListItem === 'function' ? getTenancyForTenantListItem(t) : null;
            const groupMeta = typeof tenantTenancyMetaLine === 'function' ? tenantTenancyMetaLine(t) : '';
            const pill = tenancy && typeof tenancyTypePill === 'function' ? tenancyTypePill(tenancy.type) : '';
            return `
        <button data-go="tenant-detail" data-tid="${t.id}" class="card p-4 flex items-center gap-3 w-full text-left">
            <img src="${t.img}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-[14px] font-bold">${t.name}</p>
                    ${pill}
                </div>
                <p class="text-[12px] text-[#64748B]">${t.prop}${t.unit ? ` · ${t.unit}` : ''}${groupMeta ? ` · ${groupMeta}` : ''}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`;
        })}
        ${resultBlock('Maintenance', maintenance, m => `
        <button data-go="maintenance-detail" data-mid="${m.id}" class="card p-4 flex items-center gap-3 w-full text-left">
            <div class="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]"><i data-lucide="wrench" class="w-5 h-5"></i></div>
            <div class="flex-1 min-w-0"><p class="text-[14px] font-bold">${m.issue}</p><p class="text-[12px] text-[#64748B]">${m.prop} · ${m.time}</p></div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`)}`}
    </div>`;
}

/* ─── New Screens ─── */
function screenComplianceDashboard() {
    const items = AppStore.reminders.filter(r => REMINDER_TYPES.slice(0, 8).some(t => t[0] === r.type) || ['gas','electrical','epc','smoke','heat','co2'].includes(r.type));
    const overdue = items.filter(r => r.daysLeft <= 7);
    const certRows = Object.entries(AppStore.complianceCerts || {}).map(([key, cert]) => {
        const [pid, cid] = key.split('-').map(Number);
        const item = COMPLIANCE_ITEMS[cid];
        if (!item) return null;
        const p = PROPERTIES.find(pr => pr.id === pid);
        const exp = cert.expiryDate
            ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(cert.expiryDate) : cert.expiryDate)
            : item[2];
        return { pid, cid, ic: item[0], name: item[1], exp, propName: p?.name || '—' };
    }).filter(Boolean);
    return `${topBar('Compliance Dashboard', { back: true })}
    <div class="screen-content screen-enter">
        <div class="dash-stat-grid">
            ${dashStatCard({ go: 'reminders', variant: 'issues', icon: 'alert-triangle', label: 'Due Soon', value: overdue.length, pill: overdue.length ? 'Action' : null })}
            ${dashStatCard({ go: 'properties', variant: 'compliant', icon: 'shield-check', label: 'Compliant', value: `${PROPERTIES.filter(p=>p.compliance).length}/${PROPERTIES.length}`, pill: null })}
        </div>
        <p class="screen-section-title">Certificate Status</p>
        <div class="stack-sm">
            ${certRows.length ? certRows.map(({ pid, cid, ic, name, exp, propName }) => `
            <div class="card p-3.5 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                <div class="flex-1"><p class="text-[13px] font-semibold">${name}</p><p class="text-[11px] text-[#64748B]">${exp} · ${propName}</p></div>
                <button data-go="renew-compliance" data-pid="${pid}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>
            </div>`).join('') : `<p class="text-[13px] text-[#64748B] px-1">No certificates on file yet</p>`}
        </div>
        <button data-go="reminders" class="btn-primary w-full py-3.5 text-[14px] mt-2">View All Reminders</button>
    </div>`;
}

function screenReminders() {
    const filter = STATE.reminderFilter || 'all';
    const tabs = [
        ['all', 'All'],
        ['soon', 'Due soon'],
        ['overdue', 'Overdue'],
        ['custom', 'Custom'],
    ];
    const list = filteredReminders(filter);
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `${topBar('Reminders', { back: true, sub: `${list.length} item${list.length === 1 ? '' : 's'}` })}
    <div class="screen-content screen-enter">
        <div class="reminder-filter-row">
            ${tabs.map(([k, l]) => `
            <button type="button" data-reminder-filter="${k}" class="reminder-filter-pill${filter === k ? ' is-active' : ''}">${l}</button>`).join('')}
        </div>
        ${list.length ? list.map(r => {
            const p = PROPERTIES[r.propertyId];
            const rt = reminderTypeMeta(r.type);
            const badge = reminderStatusBadge(r);
            const dueLabel = formatReminderDue(r.due);
            return `
            <div class="card p-4 mb-2 urgency-${r.urgency}">
                <div class="flex items-center gap-3">
                    <button type="button" data-go="reminder-detail" data-rid="${r.id}" class="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <div class="dash-reminder-icon" style="background:${rt[3]};color:${rt[4]}"><i data-lucide="${rt[2]}" class="w-[18px] h-[18px]"></i></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[13px] font-semibold">${esc(r.title)}</p>
                            <p class="text-[11px] text-[#64748B]">${esc(p?.name || '—')} · Due ${esc(dueLabel)}</p>
                            ${r.auto ? '<p class="text-[10px] text-[#94A3B8] mt-0.5">Synced from property records</p>' : ''}
                        </div>
                        <span class="badge shrink-0" style="background:${badge.bg};color:${badge.color}">${badge.text}</span>
                    </button>
                    <button type="button" data-action="edit-reminder" data-rid="${r.id}" class="row-icon-btn row-icon-btn--primary" title="Edit"><i data-lucide="pencil" class="w-4 h-4"></i></button>
                    ${!r.auto ? `<button type="button" data-action="delete-reminder" data-rid="${r.id}" class="row-icon-btn row-icon-btn--danger" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
                </div>
            </div>`;
        }).join('') : emptyState('bell', filter === 'all' ? 'No reminders' : 'Nothing in this filter', filter === 'all' ? 'Add a custom reminder or update property certificates to generate reminders.' : 'Try another filter or add a custom reminder.', filter === 'all' ? 'Add Reminder' : null, null, filter === 'all' ? 'add-reminder' : null)}
        <button data-go="add-reminder" class="btn-primary w-full py-3.5 text-[14px]">+ Custom Reminder</button>
        <p class="text-[11px] text-[#94A3B8] text-center mt-2">Certificate, alarm, lease and inspection dates sync automatically</p>
    </div>`;
}

function screenReminderDetail() {
    const r = AppStore.reminders.find(x => x.id === STATE.reminderId);
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    if (!r) {
        return `${topBar('Reminder', { back: true })}
        <div class="screen-content screen-enter"><p class="text-[13px] text-[#64748B]">Reminder not found.</p></div>`;
    }
    recalcReminderMeta(r);
    const p = PROPERTIES[r.propertyId];
    const rt = reminderTypeMeta(r.type);
    const badge = reminderStatusBadge(r);
    const action = reminderPrimaryAction(r);
    const dueLabel = formatReminderDue(r.due);
    const statusLabel = formatReminderDaysLeft(r.daysLeft);
    const source = reminderSourceLabel(r);
    const recordsView = ['gas', 'electrical', 'epc', 'smoke', 'heat', 'co2', 'insurance', 'mortgage'].includes(r.type) ? 'compliance' : r.type === 'inspection' ? 'inspections' : 'compliance';
    return `${topBar('Reminder', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        <div class="reminder-detail-hero card p-4 urgency-${r.urgency}">
            <div class="flex items-start gap-3">
                <div class="dash-reminder-icon" style="background:${rt[3]};color:${rt[4]}"><i data-lucide="${rt[2]}" class="w-[22px] h-[22px]"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="reminder-detail-type">${esc(rt[1])}</p>
                    <h2 class="reminder-detail-title">${esc(r.title)}</h2>
                    <p class="reminder-detail-prop">${esc(p?.name || '—')}</p>
                </div>
                <span class="badge shrink-0" style="background:${badge.bg};color:${badge.color}">${badge.text}</span>
            </div>
            <div class="reminder-detail-meta">
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Due date</span>
                    <span class="reminder-detail-meta-value">${esc(dueLabel)}</span>
                </div>
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Status</span>
                    <span class="reminder-detail-meta-value">${esc(statusLabel)}</span>
                </div>
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Source</span>
                    <span class="reminder-detail-meta-value">${esc(source)}</span>
                </div>
            </div>
        </div>
        ${r.auto ? `
        <div class="card p-3 bg-[#FFFBEB] border border-[#FDE68A]">
            <p class="text-[12px] text-[#92400E] leading-relaxed">This reminder is synced from your property records. Use the action below to update the certificate, alarm, lease or inspection — or change the due date manually.</p>
        </div>` : ''}
        <p class="screen-section-title">Actions</p>
        <button type="button" ${reminderGoAttrs(action)} class="btn-primary w-full py-3 text-[13px]">${esc(action.label)}</button>
        <button type="button" data-go="edit-reminder" data-rid="${r.id}" class="btn-secondary w-full py-3 text-[13px]">Change due date</button>
        <button type="button" data-go="property-detail" data-pid="${r.propertyId}" data-tab="records" data-records-view="${recordsView}" class="btn-secondary w-full py-3 text-[13px]">View property records</button>
        <button type="button" data-action="delete-reminder" data-rid="${r.id}" class="btn-secondary w-full py-3 text-[13px]${r.auto ? '' : ' text-[#DC2626]'}">${r.auto ? 'Remove from list' : 'Delete reminder'}</button>
    </div>`;
}

function renderReminderFormFields(reminder = null) {
    const typeVal = reminder?.type || 'custom';
    const titleVal = reminder?.title || '';
    const propVal = reminder?.propertyId ?? PROPERTIES[0]?.id ?? 0;
    const dueVal = reminder ? reminderDueInputValue(reminder.due) : '';
    const autoNote = reminder?.auto ? `
        <div class="card p-3 bg-[#EFF6FF] border border-[#DBEAFE]">
            <p class="text-[12px] text-[#1E40AF] leading-relaxed">Synced from property records. Saving updates the certificate, alarm, lease or inspection date behind this reminder.</p>
        </div>` : '';
    return `
        ${autoNote}
        <div><label class="form-label">${requiredLabel('Reminder Type')}</label>
        <select data-field="type" class="form-input form-select">${REMINDER_TYPES.map(t => `<option value="${t[0]}"${t[0] === typeVal ? ' selected' : ''}>${t[1]}</option>`).join('')}</select></div>
        ${formFieldReq('Title', 'title', titleVal, 'text', 'e.g. Gas certificate renewal')}
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" class="form-input form-select">${PROPERTIES.map(p => `<option value="${p.id}"${p.id === propVal ? ' selected' : ''}>${p.name}</option>`).join('')}</select></div>
        ${formFieldReq('Due Date', 'due', dueVal, 'date')}`;
}

function screenAddReminder() {
    return `${topBar('Add Reminder', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        ${renderReminderFormFields()}
        <button data-action="save-reminder" class="btn-primary w-full py-3.5 text-[14px]">Save Reminder</button>
    </div>`;
}

function screenEditReminder() {
    const reminder = AppStore.reminders.find(r => r.id === STATE.reminderId);
    if (!reminder) {
        return `${topBar('Edit Reminder', { back: true })}
        <div class="screen-content screen-enter"><p class="text-[13px] text-[#64748B]">Reminder not found.</p></div>`;
    }
    const dueLabel = typeof formatDisplayDate === 'function' ? formatDisplayDate(reminder.due) : reminder.due;
    return `${topBar('Edit Reminder', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        <p class="text-[12px] text-[#64748B]">Current due date: <strong class="text-[#334155]">${dueLabel || '—'}</strong></p>
        ${renderReminderFormFields(reminder)}
        <button data-action="save-reminder" class="btn-primary w-full py-3.5 text-[14px]">Save changes</button>
    </div>`;
}

function screenCreateTenancy() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Set up lease', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>
        <div><label class="form-label">${requiredLabel('Tenancy Type')}</label>
        <select data-field="tenancyType" class="form-input form-select"><option value="solo">Solo Tenancy</option><option value="group">Group Tenancy</option></select></div>
        ${formFieldReq('Unit', 'unit', '', 'text', 'Flat 1A')}
        <div id="group-fields" style="display:none">${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}</div>
        ${formFieldReq('Unit rent (£)', 'rent', String(propertyDefaultFlatRent(STATE.propertyId) || '').replace(/[^\d]/g, ''), 'text')}
        ${formFieldReq('Start Date', 'start', '', 'date')}
        ${formFieldReq('End Date', 'end', '', 'date')}
        <p class="screen-section-title">Deposit & payments</p>
        ${formField('Security deposit (£)', String(propertyDefaultFlatRent(STATE.propertyId) || '').replace(/[^\d]/g, ''), 'number', '', 'deposit')}
        ${formField('Advance rent (£)', String(propertyDefaultFlatRent(STATE.propertyId) || '').replace(/[^\d]/g, ''), 'number', '', 'advancePaid')}
        <div><label class="form-label">Deposit protection scheme</label>
        <select data-field="depositScheme" class="form-input form-select"><option>MyDeposits</option><option>DPS</option><option>TDS</option><option>Not yet registered</option></select></div>
        ${formField('Protection reference', '', 'text', 'Optional scheme reference', 'protectionRef')}
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Save lease</button>
    </div>`;
}

function screenCheckoutTenancy() {
    const t = TENANTS[STATE.tenantId];
    if (!t) return `${topBar('Check-out Tenancy', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Tenant not found</p></div>`;
    const listItem = TENANT_LIST.find(x => x.id === STATE.tenantId);
    const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(STATE.tenantId) : {};
    const leaseEndLabel = fin.leaseEnd && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.leaseEnd) || fin.leaseEnd
        : (t.leaseEnd && typeof formatDisplayDate === 'function' ? formatDisplayDate(t.leaseEnd) || t.leaseEnd : (t.leaseEnd || '—'));
    const propLabel = listItem?.prop || t.prop || '—';
    const unitLabel = listItem?.unit || t.unit || '';
    const dep = typeof getTenantDepositProtection === 'function' ? getTenantDepositProtection(STATE.tenantId) : {};
    const tenantName = typeof fullNameFromParts === 'function'
        ? fullNameFromParts(t.firstName, t.lastName)
        : `${t.firstName} ${t.lastName}`.trim();
    return `${topBar('Check-out Tenancy', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${tenantName}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${propLabel}${unitLabel ? ` · ${unitLabel}` : ''} · Lease ends ${leaseEndLabel}</p>
        </div>
        <div class="card tenant-deposit-card p-4">
            <p class="tenant-deposit-label">Deposit held</p>
            <p class="tenant-deposit-amount">${escapeHtml(dep.deposit || '—')}</p>
            <p class="tenant-deposit-scheme"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i>${escapeHtml([dep.scheme !== '—' ? dep.scheme : '', dep.protectionRef].filter(Boolean).join(' · ') || 'No scheme on file')}</p>
        </div>
        ${formFieldReq('Check-out Date', 'checkoutDate', '', 'date')}
        <div><label class="form-label">${requiredLabel('Reason')}</label>
        <select data-field="reason" class="form-input form-select"><option>End of lease</option><option>Tenant notice</option><option>Mutual agreement</option><option>Eviction</option></select></div>
        ${formTextarea('Final Notes', '', 'Condition of property, deposit deductions, forwarding address...', 'checkoutNotes')}
        <div><label class="form-label">Deposit Return</label>
        <select data-field="deposit" class="form-input form-select"><option>Full return</option><option>Partial deduction</option><option>Dispute</option></select></div>
        <button data-action="save-checkout" class="btn-primary w-full py-3.5 text-[14px]">Complete Check-out</button>
    </div>`;
}

function renderAssignContractorRow(c, item, isSuggested) {
    const isAssigned = item.contractor === c.name;
    return `
    <article class="assign-ctr-card card${isSuggested ? ' assign-ctr-card--suggested' : ''}${isAssigned ? ' assign-ctr-card--assigned' : ''}">
        <button type="button" data-action="view-contractor-profile" data-cid="${c.id}" class="assign-ctr-card-main w-full text-left">
            <img src="${c.img}" class="assign-ctr-card-avatar" alt="">
            <span class="assign-ctr-card-body min-w-0 flex-1">
                <span class="assign-ctr-card-name-row">
                    <span class="assign-ctr-card-name">${escapeHtml(c.name)}</span>
                    ${isSuggested && !isAssigned ? '<span class="assign-suggested-pill">Suggested</span>' : ''}
                </span>
                <span class="assign-ctr-card-trade-row">
                    ${typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(c) : ''}
                </span>
            </span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
        </button>
        ${isAssigned
            ? `<span class="assign-ctr-assign-btn assign-ctr-assign-btn--assigned">Assigned</span>`
            : `<button type="button" data-action="assign-contractor" data-cid="${c.id}" class="assign-ctr-assign-btn">Assign</button>`}
    </article>`;
}

function screenAssignContractor() {
    const item = maintItem(STATE.assignMaintId ?? STATE.maintId);
    const suggested = suggestContractorForIssue(item);
    const suggestedMeta = suggested && typeof resolveContractorTrade === 'function' ? resolveContractorTrade(suggested) : null;
    const categoryMeta = resolveMaintTradeCategory(item);
    const q = (STATE.search['assign-contractor'] || '').toLowerCase().trim();
    let sorted = [...CONTRACTORS].sort((a, b) => {
        if (suggested?.id === a.id) return -1;
        if (suggested?.id === b.id) return 1;
        if (suggestedMeta) {
            const aMatch = a.tradeId === suggestedMeta.id ? 0 : 1;
            const bMatch = b.tradeId === suggestedMeta.id ? 0 : 1;
            if (aMatch !== bMatch) return aMatch - bMatch;
        }
        return a.name.localeCompare(b.name);
    });
    if (q) {
        sorted = sorted.filter(c => {
            const trade = typeof contractorCategoryLabel === 'function' ? contractorCategoryLabel(c) : '';
            const jobs = typeof contractorJobsForLabel === 'function' ? contractorJobsForLabel(c) : '';
            return c.name.toLowerCase().includes(q)
                || trade.toLowerCase().includes(q)
                || jobs.toLowerCase().includes(q);
        });
    }
    return `${topBar('Assign contractor', { back: true })}
    <div class="screen-content screen-enter assign-contractor-page">
        <div class="card assign-issue-v2">
            <span class="maint-v2-cat-badge assign-issue-v2-badge" style="background:${categoryMeta.bg};color:${categoryMeta.color}">${escapeHtml(categoryMeta.shortLabel)}</span>
            <p class="assign-issue-v2-title">${escapeHtml(item.issue)}</p>
            <p class="assign-issue-v2-meta">${escapeHtml(item.prop)}${item.unit && item.unit !== '—' ? ` · ${escapeHtml(item.unit)}` : ''} · ${escapeHtml(item.priority)}</p>
            ${item.contractor !== '—' ? `<p class="assign-issue-v2-current">Current: ${escapeHtml(item.contractor)}</p>` : ''}
        </div>
        <div class="search-bar assign-search-bar">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="assign-contractor" type="text" value="${STATE.search['assign-contractor'] || ''}" placeholder="Search contractors…" class="flex-1 text-[13px] bg-transparent border-none outline-none text-[#0F172A] placeholder:text-[#94A3B8]">
        </div>
        ${suggestedMeta && !q ? `<p class="assign-list-hint">Suggested for <strong>${escapeHtml(suggestedMeta.shortLabel)}</strong> · ${sorted.length} contractor${sorted.length === 1 ? '' : 's'}</p>` : `<p class="assign-list-hint">${sorted.length} contractor${sorted.length === 1 ? '' : 's'}</p>`}
        <div class="assign-ctr-list">
            ${sorted.length ? sorted.map(c => renderAssignContractorRow(c, item, suggested?.id === c.id)).join('') : `
            <div class="ctr-empty card">
                <i data-lucide="hard-hat" class="w-10 h-10 text-[#CBD5E1]"></i>
                <p class="ctr-empty-title">No contractors found</p>
                <p class="ctr-empty-sub">Try a different search term.</p>
            </div>`}
        </div>
    </div>`;
}

function screenConductInspection() {
    const p = PROPERTIES[STATE.propertyId];
    const upcoming = getScheduledInspection(STATE.propertyId);
    const prefill = STATE.inspectionPrefill || {};
    const selectedType = normalizeInspectionType(prefill.type || upcoming?.type || 'Mid-term');
    const dateVal = prefill.date || toDateInputValue(upcoming?.date) || '';
    const types = ['Check-in', 'Mid-term', 'Annual', 'Check-out'];
    return `${topBar('Conduct Inspection', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 bg-[#EFF6FF]">
            <p class="text-[13px] font-semibold">${p.name}</p>
            <p class="text-[12px] text-[#64748B]">${upcoming ? `Complete scheduled ${upcoming.type || 'inspection'} and add your condition rating.` : 'Record a property visit — you assign the overall condition rating (1–5 stars).'}</p>
        </div>
        ${uxTip('Rating reflects property condition as you see it after the visit. Tenants do not rate in this app.', 'Who rates?')}
        <div><label class="form-label">${requiredLabel('Inspection Type')}</label>
        <select data-field="inspType" class="form-input form-select">${types.map(t => `<option ${t === selectedType ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        ${formFieldReq('Date', 'inspDate', dateVal, 'date')}
        ${renderInspectionRatingPicker(STATE.inspectionRating || 4)}
        ${formTextarea('Notes', upcoming?.notes || '', 'Condition observations, issues found...', 'inspNotes')}
        ${renderPhotoPreviewStrip(STATE.inspectionPhotos, { removable: true, removeAction: 'remove-inspection-photo' })}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2">Add inspection photos</p>
            <p class="text-[11px] text-[#64748B] mt-1">Select multiple from your device${STATE.inspectionPhotos?.length ? ` · ${STATE.inspectionPhotos.length} added` : ''}</p>
        </button>
        ${renderTenantNotifySection(STATE.propertyId, {
            title: 'Notify tenants',
            hint: 'Let residents know the inspection is complete, or uncheck if not needed.',
        })}
        <button data-action="save-inspection" class="btn-primary w-full py-3.5 text-[14px]">Save Inspection Report</button>
    </div>`;
}

function screenCreateInvoice() {
    const defaultPid = STATE.propertyId ?? PROPERTIES.find(p => propertyOccupiedFlatCount(p.id) > 0)?.id ?? 0;
    return `${topBar('Add bill / charge', { back: true })}
    <div class="screen-content screen-enter">
        <div class="ux-tip">
            <p class="ux-tip-title">Not monthly rent?</p>
            <p class="ux-tip-text">Use this for service charges, deposit top-ups, or one-off bills. Monthly rent is tracked automatically per flat.</p>
        </div>
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" data-action="refresh-invoice-units" class="form-input form-select">${PROPERTIES.filter(p => propertyOccupiedFlatCount(p.id) > 0).map(p => `<option value="${p.id}" ${p.id === defaultPid ? 'selected' : ''}>${p.name} — ${propertyOccupancyBadge(p.id).label}</option>`).join('')}</select></div>
        ${typeof unitSelectHtml === 'function' ? `<div><label class="form-label">Unit</label>${unitSelectHtml(defaultPid, 'unit', false, '')}</div>` : ''}
        ${formFieldReq('Amount (£)', 'amount', '', 'number', '2450')}
        ${formFieldReq('Due Date', 'due', '', 'date')}
        <div><label class="form-label">${requiredLabel('Description')}</label>
        <select data-field="desc" class="form-input form-select"><option>Service charge</option><option>Deposit top-up</option><option>Cleaning fee</option><option>Other bill</option></select></div>
        <button data-action="save-invoice" class="btn-primary w-full py-3.5 text-[14px]">Add bill</button>
    </div>`;
}

function parseInvoiceAmount(amount) {
    return parseInt(String(amount).replace(/[^\d]/g, ''), 10) || 0;
}

function rentReceiveInvoices() {
    let list = outstandingInvoices();
    const propF = STATE.rentReceivePropertyFilter;
    const unitF = STATE.rentReceiveUnitFilter;
    if (propF != null) {
        list = list.filter(i => i.propertyId === propF);
    } else if (STATE.propertyId != null && STATE.rentReceiveUnitFilter && !unitF) {
        list = list.filter(i => i.propertyId === STATE.propertyId && i.unit === STATE.rentReceiveUnitFilter);
    }
    if (unitF) {
        list = list.filter(i => i.unit === unitF);
    }
    return list;
}

function propertiesWithOutstandingInvoices() {
    const pids = new Set(outstandingInvoices().map(i => i.propertyId).filter(id => id != null));
    return PROPERTIES.filter(p => pids.has(p.id));
}

function unitsWithOutstandingInvoices(propertyId) {
    const names = new Set(outstandingInvoices()
        .filter(i => i.propertyId === propertyId && i.unit)
        .map(i => i.unit));
    if (typeof getPropertyUnits === 'function') {
        return getPropertyUnits(propertyId)
            .map(u => (typeof unitName === 'function' ? unitName(u) : u.name))
            .filter(name => names.has(name));
    }
    return [...names];
}

function syncRentReceiveSelection() {
    const visible = new Set(rentReceiveInvoices().map(i => i.id));
    STATE.rentReceiveIds = STATE.rentReceiveIds.filter(id => visible.has(id));
    if (!STATE.rentReceiveIds.length && visible.size) {
        STATE.rentReceiveIds = [...visible];
    }
}

function renderRentReceivePlaceFilters() {
    const propF = STATE.rentReceivePropertyFilter;
    const unitF = STATE.rentReceiveUnitFilter;
    const props = propertiesWithOutstandingInvoices();
    const units = propF != null ? unitsWithOutstandingInvoices(propF) : [];
    const propLabel = propF != null ? (PROPERTIES[propF]?.name || 'Property') : 'All properties';
    const scoped = propF != null || unitF;
    return `
    <div class="maint-place-filters rent-receive-filters">
        <label class="maint-place-select-wrap">
            <select data-rent-receive-property-filter class="maint-place-select" aria-label="Filter by property">
                <option value="all"${propF == null ? ' selected' : ''}>All properties</option>
                ${props.map(p => `<option value="${p.id}"${propF === p.id ? ' selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
        <label class="maint-place-select-wrap">
            <select data-rent-receive-unit-filter class="maint-place-select" aria-label="Filter by unit"${propF == null ? ' disabled' : ''}>
                <option value="all"${!unitF ? ' selected' : ''}>All units</option>
                ${units.map(name => `<option value="${escapeHtml(name)}"${unitF === name ? ' selected' : ''}>${escapeHtml(name)}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="maint-place-select-icon w-3.5 h-3.5"></i>
        </label>
    </div>
    ${scoped ? `
    <div class="maint-place-banner">
        <span>${escapeHtml(propLabel)}${unitF ? ` · ${escapeHtml(unitF)}` : ''} · ${rentReceiveInvoices().length} due</span>
        <button type="button" data-action="clear-rent-receive-place-filters" class="maint-place-clear">Clear</button>
    </div>` : `
    <p class="rent-receive-filter-hint">Choose a property and unit to narrow the list — or pick from grouped payments below.</p>`}`;
}

function renderRentReceiveList(invoices) {
    if (!invoices.length) {
        return `<div class="empty-state card"><p class="empty-state-title">No payments in this filter</p><p class="empty-state-desc">Try another property or unit, or clear filters.</p></div>`;
    }
    if (STATE.rentReceivePropertyFilter != null) {
        return `<div class="rent-receive-list">${invoices.map(rentReceiveRow).join('')}</div>`;
    }
    const groups = {};
    invoices.forEach(inv => {
        const pid = inv.propertyId ?? 0;
        if (!groups[pid]) groups[pid] = [];
        groups[pid].push(inv);
    });
    return Object.keys(groups).sort((a, b) => +a - +b).map(pid => {
        const items = groups[pid];
        const p = PROPERTIES[+pid];
        return `
        <section class="rent-receive-group">
            <div class="rent-receive-group-head">
                <p class="rent-receive-group-title">${escapeHtml(p?.name || 'Property')}</p>
                <span class="rent-receive-group-count">${items.length} due</span>
            </div>
            <div class="rent-receive-list">${items.map(rentReceiveRow).join('')}</div>
        </section>`;
    }).join('');
}

function outstandingInvoices() {
    return INVOICES.filter(i => i.status !== 'Paid');
}

function initRentReceiveSelection() {
    const unpaid = rentReceiveInvoices();
    STATE.rentReceiveIds = unpaid.map(i => i.id);
    if (!STATE.rentReceiveDate) {
        STATE.rentReceiveDate = new Date().toISOString().slice(0, 10);
    }
}

function initRentReceiveFromRentRoll() {
    const month = getCurrentRentMonthLabel();
    const propF = STATE.rentRollPropertyFilter;
    const filter = STATE.rentRollFilter || 'all';
    let rows = buildRentRollRows(month, propF).filter(r => r.status !== 'paid');
    if (filter !== 'all') {
        rows = rows.filter(r => r.status === filter || (filter === 'due' && r.status === 'due'));
    }
    STATE.rentReceivePropertyFilter = propF;
    STATE.rentReceiveUnitFilter = null;
    STATE.rentReceiveIds = rows.map(r => r.invoiceId);
    if (!STATE.rentReceiveDate) {
        STATE.rentReceiveDate = new Date().toISOString().slice(0, 10);
    }
}

function rentReceiveSummary() {
    const selected = INVOICES.filter(i => STATE.rentReceiveIds.includes(i.id));
    const total = selected.reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    return { count: selected.length, total };
}

function toggleRentReceiveInvoice(iid) {
    const id = +iid;
    const idx = STATE.rentReceiveIds.indexOf(id);
    if (idx >= 0) STATE.rentReceiveIds.splice(idx, 1);
    else STATE.rentReceiveIds.push(id);
    render();
}

function toggleRentReceiveAll() {
    const unpaid = rentReceiveInvoices();
    const allSelected = unpaid.length && unpaid.every(i => STATE.rentReceiveIds.includes(i.id));
    STATE.rentReceiveIds = allSelected ? [] : unpaid.map(i => i.id);
    render();
}

function rentReceiveRow(inv) {
    const selected = STATE.rentReceiveIds.includes(inv.id);
    const meta = invoicePropertyMeta(inv);
    const typeLabel = typeof invoiceTypeLabel === 'function' ? invoiceTypeLabel(inv) : (inv.month || 'Rent');
    const subline = [inv.unit || meta.propShort, typeLabel, `Due ${inv.due}`].filter(Boolean).join(' · ');
    const overdue = inv.status === 'Overdue';
    return `
    <button type="button" data-action="toggle-rent-receive" data-iid="${inv.id}" class="rent-receive-row card ${selected ? 'rent-receive-row--selected' : ''} ${overdue ? 'rent-receive-row--overdue' : ''}" aria-pressed="${selected}">
        <div class="rent-receive-body">
            <div class="rent-receive-top">
                <p class="rent-receive-tenant">${inv.tenant || meta.propShort}</p>
                <p class="rent-receive-amount">${inv.amount}</p>
            </div>
            <p class="rent-receive-meta">${subline}</p>
            ${overdue ? '<span class="rent-receive-overdue-tag">Overdue</span>' : ''}
        </div>
        <span class="rent-receive-check ${selected ? 'rent-receive-check--on' : ''}" aria-hidden="true">
            ${selected ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
        </span>
    </button>`;
}

function confirmMarkRentReceived() {
    const ids = [...STATE.rentReceiveIds];
    if (!ids.length) {
        toast('Select at least one rent payment');
        return;
    }
    const date = document.querySelector('[data-field="receivedDate"]')?.value;
    if (!date) {
        toast('Select payment date');
        return;
    }
    const method = document.querySelector('[data-field="paymentMethod"]')?.value || STATE.rentPaymentMethod || 'stripe';
    const methodLabel = PAYMENT_METHOD_OPTIONS.find(m => m.id === method)?.label || 'Stripe (card)';
    const paidLabel = typeof formatDisplayDate === 'function' ? formatDisplayDate(date) : date;
    const overrideRaw = document.querySelector('[data-field="receivedAmount"]')?.value?.trim();
    const overrideAmt = overrideRaw ? parseInvoiceAmount(overrideRaw) : 0;
    ids.forEach(iid => {
        const inv = INVOICES.find(i => i.id === iid);
        if (inv && inv.status !== 'Paid') {
            stampInvoicePaid(inv, { paidOn: paidLabel, paymentMethod: methodLabel });
            if (ids.length === 1 && overrideAmt > 0) {
                inv.amount = formatInvoiceAmount(overrideAmt);
            }
        }
    });
    syncTransactionsFromInvoices();
    const total = ids.reduce((s, id) => {
        const inv = INVOICES.find(i => i.id === id);
        return s + (inv ? parseInvoiceAmount(inv.amount) : 0);
    }, 0);
    pushNotification({
        icon: 'banknote', color: ['#ECFDF5', '#16A34A'],
        title: ids.length === 1 ? 'Rent received' : `${ids.length} payments received`,
        desc: `£${total.toLocaleString()} · ${methodLabel}`,
        time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid: ids[0] },
    });
    AppStore.save();
    STATE.rentReceiveIds = [];
    STATE.rentPaymentMethod = method;
    if (ids.length === 1) {
        const returnScreen = STATE.rentReturnScreen;
        STATE.rentReturnScreen = null;
        STATE.rentReceivePropertyFilter = null;
        STATE.rentReceiveUnitFilter = null;
        toast('Payment recorded — download receipt below');
        go('invoice-detail', { invoiceId: ids[0], rentReturnScreen: returnScreen || null });
        return;
    }
    toast(ids.length === 1 ? 'Payment recorded' : `${ids.length} payments recorded`);
    const returnScreen = STATE.rentReturnScreen || 'financial';
    const returnOpts = {};
    if (returnScreen === 'flat-rent-history' || returnScreen === 'flat-detail') {
        returnOpts.propertyId = STATE.propertyId;
        if (STATE.selectedUnit) returnOpts.unit = STATE.selectedUnit;
    }
    STATE.rentReturnScreen = null;
    STATE.rentReceivePropertyFilter = null;
    STATE.rentReceiveUnitFilter = null;
    go(returnScreen, returnOpts);
}

function screenMarkRentReceived() {
    const unpaid = rentReceiveInvoices();
    const overdue = unpaid.filter(i => i.status === 'Overdue');
    const pending = unpaid.filter(i => i.status === 'Pending');
    const dueTotal = unpaid.reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    const selected = rentReceiveSummary();
    const allSelected = unpaid.length && unpaid.every(i => STATE.rentReceiveIds.includes(i.id));
    const receiveDate = STATE.rentReceiveDate || new Date().toISOString().slice(0, 10);
    const unitScoped = Boolean(STATE.rentReceiveUnitFilter);
    const backTarget = STATE.rentReturnScreen || 'financial';
    const backLabel = unitScoped ? 'Back to unit rent' : 'Back to Finances';

    if (!unpaid.length) {
        return `${topBar('Record rent received', { back: true })}
        <div class="screen-content screen-enter">
            ${emptyState('check-circle', 'All caught up', unitScoped ? 'Every rent bill for this unit is recorded as paid.' : 'Every rent bill for this month is recorded as paid.', backLabel, null, backTarget)}
        </div>`;
    }

    const sorted = [...overdue, ...pending];

    return `${topBar('Record rent received', { back: true })}
    <div class="screen-content screen-enter rent-receive-page">
        <div class="rent-receive-summary card">
            <div class="rent-receive-summary-main">
                <p class="rent-receive-summary-amount">£${dueTotal.toLocaleString()}</p>
                <p class="rent-receive-summary-hint">${unpaid.length} due${overdue.length ? ` · ${overdue.length} overdue` : ''}</p>
            </div>
        </div>
        <div class="rent-receive-list-head">
            <p class="rent-receive-list-title">Select payments</p>
            <button type="button" data-action="toggle-rent-receive-all" class="rent-receive-select-all">
                ${allSelected ? 'None' : 'All'}
            </button>
        </div>
        ${typeof renderRentReceivePlaceFilters === 'function' ? renderRentReceivePlaceFilters() : ''}
        ${typeof renderRentReceiveList === 'function' ? renderRentReceiveList(sorted) : `<div class="rent-receive-list">${sorted.map(rentReceiveRow).join('')}</div>`}
        <div class="rent-receive-date card">
            <label class="form-label">Payment received on</label>
            <input type="date" data-field="receivedDate" class="form-input" value="${receiveDate}">
        </div>
        <div class="rent-receive-date card">
            <label class="form-label">How did they pay?</label>
            <select data-field="paymentMethod" class="form-input form-select">
                ${PAYMENT_METHOD_OPTIONS.map(m => `<option value="${m.id}" ${STATE.rentPaymentMethod === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
            </select>
        </div>
        ${selected.count === 1 ? `
        <div class="rent-receive-date card">
            <label class="form-label">Amount received (optional)</label>
            <input type="text" data-field="receivedAmount" class="form-input" placeholder="${formatInvoiceAmount(selected.total)}" value="">
            <p class="form-helper">Leave blank to record the full invoice amount</p>
        </div>` : ''}
    </div>
    <div class="rent-receive-bar ${selected.count ? 'rent-receive-bar--active' : ''}">
        <div class="rent-receive-bar-info">
            <p class="rent-receive-bar-count">${selected.count} selected</p>
            <p class="rent-receive-bar-total">£${selected.total.toLocaleString()}</p>
        </div>
        <button type="button" data-action="confirm-rent-received" class="rent-receive-bar-btn" ${selected.count ? '' : 'disabled'}>
            Confirm payment
        </button>
    </div>`;
}

function screenPayContractor() {
    const unpaid = AppStore.contractorInvoices.filter(c => c.status === 'Unpaid');
    return `${topBar('Pay Contractor', { back: true })}
    <div class="screen-content screen-enter">
        ${unpaid.length ? unpaid.map(c => {
            const job = typeof getContractorJobForMaint === 'function' ? getContractorJobForMaint(c.maintId) : null;
            const needsApprove = job && job.status === 'waiting_approval';
            return `
        <div class="card p-4 mb-2">
            <div class="flex justify-between items-start">
                <div><p class="text-[14px] font-semibold">${c.contractor}</p><p class="text-[12px] text-[#64748B]">${c.job}</p></div>
                <p class="text-[14px] font-bold">${c.amount}</p>
            </div>
            ${needsApprove
                ? `<button type="button" data-action="approve-maint-work" data-mid="${c.maintId}" class="btn-primary w-full py-2.5 text-[13px] mt-3">Approve work first</button>`
                : `<button type="button" data-action="pay-maint-stripe" data-cid="${c.id}" class="btn-primary w-full py-2.5 text-[13px] mt-3">Pay ${c.amount} with Stripe</button>`}
        </div>`;
        }).join('') : emptyState('banknote', 'No unpaid invoices', 'All contractor invoices have been paid.', 'View Maintenance', null, 'maintenance')}
    </div>`;
}

function screenShareDocument() {
    const doc = AppStore.documents.find(d => d.id === STATE.shareDocId);
    if (!doc) return `${topBar('Share Document', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Document not found</p></div>`;
    const p = PROPERTIES[doc.propertyId];
    const unit = doc.unit || '';
    const targets = getDocumentShareTargets(doc.propertyId, unit || null);
    return `${topBar('Share with Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${doc.name}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${doc.type} · ${p.name}${unit ? ` · ${unit}` : ''}</p>
        </div>
        <p class="text-[13px] text-[#64748B]">Choose who can view this in their tenant portal.</p>
        ${targets.length ? `
        <div class="share-notify-section">
            ${targets.length > 1 ? `
            <label class="notify-all-toggle card p-3 cursor-pointer mb-2">
                <input type="checkbox" data-share-all class="accent-[#2563EB]" checked>
                <span class="text-[13px] font-semibold text-[#0F172A]">Notify all tenants (${targets.length})</span>
            </label>` : ''}
            <div class="stack-sm">
                ${targets.map(t => `
                <label class="member-row card cursor-pointer">
                    <input type="checkbox" data-share-target="${t.id}" class="accent-[#2563EB]" checked>
                    <img src="${t.img}" class="member-row-avatar" alt="">
                    <div class="member-row-body">
                        <p class="member-row-name">${t.name}</p>
                        <p class="member-row-meta">${t.unit || '—'} · ${t.status === 'active' ? 'Active account' : 'Pending'}</p>
                    </div>
                </label>`).join('')}
            </div>
            <p class="form-helper mt-2">For buildings with multiple flats, pick everyone who should see this — or use Notify all.</p>
        </div>` : `
        <div class="ux-tip">
            <p class="ux-tip-title">No active tenants yet</p>
            <p class="ux-tip-text">Invite tenants first — the document will be shared when they activate their account.</p>
        </div>`}
        <button data-action="confirm-share-doc" class="btn-primary w-full py-3.5 text-[14px]">Share Document</button>
    </div>`;
}

function screenRescheduleInspectionEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    const upcoming = typeof getScheduledInspection === 'function' ? getScheduledInspection(STATE.propertyId) : null;
    const title = upcoming ? 'Reschedule Inspection' : 'Schedule Inspection';
    const currentLine = upcoming
        ? `${upcoming.type || 'Inspection'} · Currently ${typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date}`
        : 'Pick a date for your next visit';
    const dateVal = upcoming && typeof toDateInputValue === 'function' ? toDateInputValue(upcoming.date) : '';
    const types = ['Check-in', 'Mid-term', 'Annual', 'Check-out'];
    const selectedType = typeof normalizeInspectionType === 'function'
        ? normalizeInspectionType(upcoming?.type || 'Mid-term')
        : (upcoming?.type || 'Mid-term');
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'];
    const selectedSlot = upcoming?.timeSlot || '10:00 AM';
    return `${topBar(title, { back: true })}
    <div class="screen-content screen-enter insp-schedule-page">
        <div class="insp-schedule-property">
            <p class="insp-schedule-property-name">${p.name}</p>
            <p class="insp-schedule-property-meta">${currentLine}</p>
        </div>
        ${formField('Inspection Date', dateVal, 'date', 'Select inspection date', 'inspDate')}
        ${formSelect('Time Slot', selectedSlot, timeSlots, 'timeSlot')}
        ${formSelect('Type', selectedType, types, 'inspType')}
        ${formTextarea('Access notes', upcoming?.notes || '', 'Parking, keys, tenant availability...', 'inspNotes', '', 'form-input--compact')}
        ${renderTenantNotifySection(STATE.propertyId, { compact: true })}
        ${saveBtn(upcoming ? 'Confirm reschedule' : 'Schedule inspection', 'Inspection rescheduled')}
    </div>`;
}

function screenAddFlat() {
    const p = PROPERTIES[STATE.propertyId];
    const sourceName = STATE.flatDuplicateFrom || '';
    const isDup = !!sourceName;
    const draft = flatDraftFromSource(STATE.propertyId, sourceName || null);
    const showFloor = shouldGroupFlatsByFloor(STATE.propertyId) || draft.floor !== '' && draft.floor != null;
    const pendingPhotos = STATE.pendingFlatPhotos || [];
    const pendingCover = STATE.pendingFlatCover ?? 0;
    return `${topBar(isDup ? 'Duplicate unit' : 'Add unit', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-content-sm screen-enter flat-edit-page">
        ${isDup ? uxTip('Change only what is different for this new unit.', `Copied from ${sourceName}`) : uxIntro('Add rent, rooms and size for this unit.')}
        ${renderFlatUnitPhotoPicker(pendingPhotos, pendingCover, {
            placeholder: isDup && sourceName ? getFlatCoverPhoto(STATE.propertyId, sourceName) : IMG.interior[0],
            hint: isDup && pendingPhotos.length
                ? `Photos copied from ${sourceName}. Tap ★ to change the cover before saving.`
                : 'Add multiple photos and tap ★ to choose which shows on the home screen.',
        })}
        <div class="flat-edit-fields stack-sm">
            <div class="form-field"><label class="form-label">Unit name <span class="form-required">*</span></label><input data-field="flatName" type="text" class="form-input" value="${draft.name.replace(/"/g, '&quot;')}" placeholder="e.g. Flat 2A"></div>
            <div class="form-field"><label class="form-label">Rent per month (£) <span class="form-required">*</span></label><input data-field="flatRent" type="number" class="form-input" value="${draft.rent}" min="1"></div>
            <div class="grid grid-cols-3 gap-3">
                <div class="form-field"><label class="form-label">Beds</label><input data-field="flatBeds" type="number" class="form-input" value="${draft.beds}" min="1"></div>
                <div class="form-field"><label class="form-label">Baths</label><input data-field="flatBaths" type="number" class="form-input" value="${draft.baths}" min="1"></div>
                <div class="form-field"><label class="form-label">Sq ft</label><input data-field="flatSqft" type="text" class="form-input" value="${draft.sqft}" placeholder="750"></div>
            </div>
            ${showFloor ? `<div class="grid grid-cols-2 gap-3">
                <div class="form-field"><label class="form-label">Floor number</label><input data-field="flatFloor" type="number" class="form-input" value="${draft.floor !== '' && draft.floor != null ? draft.floor : ''}" placeholder="Optional" min="0"></div>
                <div class="form-field"><label class="form-label">Floor note</label><input data-field="floorNote" type="text" class="form-input" value="${(draft.floorNote || '').replace(/"/g, '&quot;')}" placeholder="e.g. Rear wing"></div>
            </div>` : ''}
            ${flatUnitExtraFieldsHtml(draft, STATE.propertyId)}
        </div>
        <p class="form-helper flat-edit-helper">New units start as vacant. Occupancy updates when a tenant moves in.</p>
        <button data-action="save" class="btn-primary w-full">${isDup ? 'Save duplicated unit' : 'Save unit'}</button>
    </div>`;
}

function saveAddFlat() {
    if (!validateFields([['flatName', 'Unit name', v => v && v.trim()], ['flatRent', 'Rent', v => v && +v > 0]])) return;
    const name = fieldVal('flatName').trim();
    if (getUnitByName(STATE.propertyId, name)) {
        toast('A unit with this name already exists');
        return;
    }
    appendFlatToProperty(STATE.propertyId, {
        name,
        rent: `£${parseInt(fieldVal('flatRent'), 10).toLocaleString()}`,
        beds: +fieldVal('flatBeds') || 2,
        baths: +fieldVal('flatBaths') || 1,
        sqft: fieldVal('flatSqft') || '',
        floor: fieldVal('flatFloor'),
        floorNote: fieldVal('floorNote') || '',
        unitType: fieldVal('flatUnitType') || '',
        furnished: fieldVal('flatFurnished') || '',
        yearBuilt: fieldVal('flatYearBuilt') ? String(fieldVal('flatYearBuilt')) : '',
    });
    const wasDup = !!STATE.flatDuplicateFrom;
    const dupSource = STATE.flatDuplicateFrom;
    if (STATE.pendingFlatPhotos?.length) {
        setFlatPhotoGallery(STATE.propertyId, name, STATE.pendingFlatPhotos, STATE.pendingFlatCover ?? 0);
    } else if (wasDup && dupSource) {
        copyFlatPhotoGallery(STATE.propertyId, dupSource, name);
    }
    if (dupSource) {
        const meta = AppStore.meta(STATE.propertyId);
        const srcUtil = meta.unitUtilities?.[dupSource];
        if (srcUtil) {
            if (!meta.unitUtilities) meta.unitUtilities = {};
            meta.unitUtilities[name] = JSON.parse(JSON.stringify(srcUtil));
        }
    }
    STATE.flatDuplicateFrom = null;
    STATE.pendingFlatPhotos = [];
    STATE.pendingFlatCover = 0;
    withLoading(() => {
        AppStore.save();
        toast(wasDup ? 'Unit duplicated' : 'Unit added');
        go('property-detail', { propertyId: STATE.propertyId, tab: 'units' });
    });
}

function screenEditFlat() {
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[STATE.propertyId];
    const u = getUnitByName(STATE.propertyId, unit);
    if (!u) return `${topBar('Edit unit', { back: true })}<div class="screen-content"><p class="ux-intro">Unit not found.</p></div>`;
    ensureFlatPhotos(STATE.propertyId);
    const gal = getFlatPhotoGallery(STATE.propertyId, unit);
    const photos = gal?.photos?.length ? gal.photos : [getFlatCoverPhoto(STATE.propertyId, unit)];
    const cover = gal?.cover ?? 0;
    const { tenancy } = getFlatMemberRoster(STATE.propertyId, unit);
    const rentAmt = flatEffectiveRentAmount(u, tenancy) || parseRentAmount(u.rent);
    const rent = rentAmt || '';
    const occ = u.status === 'occupied';
    const showFloor = shouldGroupFlatsByFloor(STATE.propertyId) || u.floor != null || u.floorNote;
    return `${topBar('Edit unit', { back: true, sub: `${p?.name || ''} · ${unitName(u)}` })}
    <div class="screen-content screen-content-sm screen-enter flat-edit-page">
        ${renderFlatUnitPhotoPicker(photos, cover, {
            coverAction: 'set-flat-cover',
            removeAction: 'remove-flat-photo',
            uploadAction: 'upload-flat-photo',
            uploadLabel: photos.length ? 'Add more photos' : 'Add unit photos',
            hint: 'Tap ★ on any photo to set it as the cover. This shows in Overview and unit lists.',
        })}
        <div class="flat-edit-status card">
            <div class="flat-edit-status-body">
                <p class="flat-edit-status-title">Status</p>
                <p class="flat-edit-status-desc">Updates when a tenant moves in or out${occ ? ' · rent changes update the active lease' : ''}</p>
            </div>
            <span class="badge shrink-0" style="background:${occ ? '#DCFCE7' : '#FEF3C7'};color:${occ ? '#16A34A' : '#D97706'}">${occ ? 'Occupied' : 'Vacant'}</span>
        </div>
        <div class="flat-edit-fields stack-sm">
            <div class="form-field"><label class="form-label">Unit name</label><input data-field="flatName" type="text" class="form-input" value="${unitName(u).replace(/"/g, '&quot;')}"></div>
            <div class="form-field"><label class="form-label">Rent per month (£) <span class="form-required">*</span></label><input data-field="flatRent" type="number" class="form-input" value="${rent}" min="1"></div>
            <div class="grid grid-cols-3 gap-3">
                <div class="form-field"><label class="form-label">Beds</label><input data-field="flatBeds" type="number" class="form-input" value="${u.beds || 2}" min="1"></div>
                <div class="form-field"><label class="form-label">Baths</label><input data-field="flatBaths" type="number" class="form-input" value="${u.baths || 1}" min="1"></div>
                <div class="form-field"><label class="form-label">Sq ft</label><input data-field="flatSqft" type="text" class="form-input" value="${u.sqft || ''}" placeholder="750"></div>
            </div>
            ${showFloor ? `<div class="grid grid-cols-2 gap-3">
                <div class="form-field"><label class="form-label">Floor number</label><input data-field="flatFloor" type="number" class="form-input" value="${u.floor != null && u.floor !== '' ? u.floor : ''}" placeholder="Optional" min="0"></div>
                <div class="form-field"><label class="form-label">Floor note</label><input data-field="floorNote" type="text" class="form-input" value="${(u.floorNote || '').replace(/"/g, '&quot;')}" placeholder="e.g. Rear wing"></div>
            </div>` : ''}
            ${flatUnitExtraFieldsHtml(u, STATE.propertyId)}
        </div>
        <p class="form-helper flat-edit-helper">For building-wide details, use Edit Property instead.</p>
        <div class="flat-edit-actions stack-sm">
            <button data-action="save" class="btn-primary w-full">Save unit</button>
            ${canDeleteFlat(STATE.propertyId, unit) ? `
            <div class="danger-zone flat-edit-danger">
                ${dangerZoneButton('Remove unit', 'delete-flat')}
            </div>` : ''}
        </div>
    </div>`;
}

function saveFlatDetails() {
    const oldName = STATE.selectedUnit;
    if (!oldName) { toast('Unit not selected'); return; }
    if (!validateFields([['flatRent', 'Rent', v => v && +v > 0]])) return;
    const newName = (fieldVal('flatName') || oldName).trim();
    const unit = getUnitByName(STATE.propertyId, oldName);
    if (!unit) { toast('Unit not found'); return; }
    if (newName !== oldName && getUnitByName(STATE.propertyId, newName)) {
        toast('Another unit already has that name');
        return;
    }
    unit.name = newName;
    const rentFormatted = `£${parseInt(fieldVal('flatRent'), 10).toLocaleString()}`;
    unit.rent = rentFormatted;
    unit.beds = +fieldVal('flatBeds') || unit.beds || 2;
    unit.baths = +fieldVal('flatBaths') || unit.baths || 1;
    unit.sqft = fieldVal('flatSqft') || unit.sqft || '';
    const floorVal = fieldVal('flatFloor');
    if (floorVal !== '' && floorVal != null) unit.floor = +floorVal;
    else if (floorVal === '') unit.floor = null;
    unit.floorNote = fieldVal('floorNote') || '';
    applyFlatUnitExtraFields(unit);
    if (newName !== oldName) {
        renameUnitReferences(STATE.propertyId, oldName, newName);
    }
    syncUnitRentAcrossRecords(STATE.propertyId, newName, rentFormatted);
    STATE.selectedUnit = newName;
    syncPropertyStatus(STATE.propertyId);
    withLoading(() => { AppStore.save(); toast('Unit updated'); go('flat-detail', { propertyId: STATE.propertyId, unit: newName }); });
}

function screenUnitUtilities() {
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[STATE.propertyId];
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    const billOptions = ['Electricity', 'Gas', 'Water', 'Internet', 'Council Tax', 'TV Licence', 'Oil / LPG', 'Communal heating'];
    const customList = util.customUtilities || [];
    return `${topBar('Unit Utilities', { back: true, sub: `${p?.name || ''} · ${unit}` })}
    <div class="screen-content screen-content-sm screen-enter unit-util-page">
        <div class="unit-util-row">
            <label class="form-label unit-util-row-label">Who pays utilities?</label>
            <select data-field="util_responsibility" class="form-input form-select">
                <option value="landlord" ${util.responsibility === 'landlord' ? 'selected' : ''}>Landlord pays all</option>
                <option value="tenant" ${util.responsibility === 'tenant' ? 'selected' : ''}>Tenant pays all</option>
                <option value="split" ${util.responsibility === 'split' ? 'selected' : ''}>Split / partial</option>
            </select>
        </div>
        ${util.responsibility === 'split' ? `
        <div class="card unit-util-card">
            <p class="unit-util-card-title">Bills included for tenant</p>
            <div class="unit-util-bill-grid">
            ${billOptions.map(b => `
            <label class="unit-util-bill-item">
                <input type="checkbox" data-util-bill="${b}" class="accent-[#2563EB]" ${util.includedBills?.includes(b) ? 'checked' : ''}> ${b}
            </label>`).join('')}
            </div>
            <div class="unit-util-allowance">
                <label class="form-label">Monthly utility allowance</label>
                <input type="text" data-field="util_allowance" class="form-input" placeholder="e.g. £150" value="${util.monthlyAllowance || ''}">
                <p class="form-helper">Tenant pays bills; over this amount can be charged via Stripe</p>
            </div>
        </div>` : ''}
        <div class="unit-util-block">
            <div class="unit-util-block-head">
                <p class="screen-section-title">Custom utility types</p>
                <p class="unit-util-hint">Add non-standard bills (e.g. parking, cleaning).</p>
            </div>
            <div class="card unit-util-card unit-util-custom-card">
                ${customList.length ? customList.map((u, i) => `
                <div class="unit-util-custom-item">
                    <div><p class="unit-util-custom-name">${u.name}</p><p class="unit-util-custom-meta">${u.paidBy === 'landlord' ? 'Landlord pays' : 'Tenant pays'}</p></div>
                    <button type="button" data-action="remove-custom-utility" data-util-idx="${i}" class="unit-util-remove">Remove</button>
                </div>`).join('') : `<p class="unit-util-empty">No custom utilities yet</p>`}
                <div class="unit-util-add-row">
                    <input type="text" data-field="custom_util_name" class="form-input" placeholder="e.g. Parking">
                    <select data-field="custom_util_payer" class="form-input form-select">
                        <option value="tenant">Tenant pays</option>
                        <option value="landlord">Landlord pays</option>
                    </select>
                </div>
                <button type="button" data-action="add-custom-utility" class="btn-secondary unit-util-add-btn">Add custom utility</button>
            </div>
        </div>
        ${util.responsibility === 'split' && util.monthlyAllowance ? `
        <div class="card unit-util-card unit-util-overage">
            <p class="unit-util-card-title unit-util-overage-title">Utility overage</p>
            <p class="unit-util-hint">Charge tenant when bills exceed ${util.monthlyAllowance} allowance.</p>
            <div class="unit-util-add-row">
                <input type="text" data-field="overage_amount" class="form-input" placeholder="Overage £">
                <input type="text" data-field="overage_period" class="form-input" placeholder="e.g. Mar 2026">
            </div>
            <button type="button" data-action="charge-utility-overage" class="btn-primary unit-util-add-btn">Send bill to tenant</button>
        </div>
        ${(util.overageCharges || []).length ? `
        <div class="unit-util-block">
            <p class="screen-section-title">Overage history</p>
            ${util.overageCharges.map(o => `
            <div class="card unit-util-card unit-util-history-row">
                <div><p class="unit-util-custom-name">${o.amount}</p><p class="unit-util-custom-meta">${o.period} · ${o.status}</p></div>
                <span class="badge" style="background:${o.status === 'Paid' ? '#DCFCE7' : '#FEF3C7'};color:${o.status === 'Paid' ? '#16A34A' : '#D97706'}">${o.status}</span>
            </div>`).join('')}
        </div>` : ''}` : ''}
        <div class="unit-util-block">
            <div class="unit-util-block-head">
                <p class="screen-section-title">Meter numbers</p>
                <p class="unit-util-hint">Optional — add when you have the meter reference or reading.</p>
            </div>
            <div class="card unit-util-card unit-util-meters">
                ${formField('Electricity', util.meters?.electricity || '', 'text', 'e.g. MPAN or meter ID', 'meter_electricity')}
                ${formField('Gas', util.meters?.gas || '', 'text', 'e.g. MPRN or meter ID', 'meter_gas')}
                ${formField('Water', util.meters?.water || '', 'text', 'e.g. meter serial', 'meter_water')}
            </div>
        </div>
        <div class="unit-util-block">
            <div class="unit-util-block-head">
                <p class="screen-section-title">Shared uploads</p>
                <p class="unit-util-hint">Upload utility documents. Overage bills go to tenant via Stripe.</p>
            </div>
            ${util.uploads?.length ? util.uploads.map((u, idx) => `
            <div class="card unit-util-card unit-util-history-row">
                <div><p class="unit-util-custom-name">${u.name}</p><p class="unit-util-custom-meta">${u.by} · ${u.date}</p></div>
                <button type="button" data-action="preview-unit-util-doc" data-idx="${idx}" class="unit-util-view">View</button>
            </div>`).join('') : `<div class="card unit-util-card"><p class="unit-util-empty">No utility documents uploaded yet</p></div>`}
            <button data-action="upload-unit-utility" class="btn-secondary unit-util-upload-btn">Upload bill / document</button>
        </div>
        <button data-action="save-unit-utilities" class="btn-primary unit-util-save-btn">Save utilities</button>
    </div>`;
}

function startTenantChat(tenantId) {
    const t = TENANTS[tenantId];
    const listItem = TENANT_LIST.find(x => x.id === tenantId);
    if (!t || !listItem) {
        toast('Tenant not found');
        return;
    }
    const chatId = ensureTenantConversation(`${t.firstName} ${t.lastName}`, listItem.prop, listItem.img);
    listItem.chatId = chatId;
    AppStore.save();
    go('chat', { chatId });
}

function renderPropertyPhotosTab(propertyId) {
    const meta = AppStore.meta(propertyId);
    const photos = meta.photos?.length ? meta.photos : [IMG.props[propertyId]];
    return `<div class="screen-content">
        <div class="photo-gallery-grid photo-gallery-grid--compact">
            ${photos.slice(0, 6).map((src, i) => `
            <div class="photo-gallery-card">
                <img src="${src}" class="photo-gallery-img" alt="">
                ${i === 0 ? '<span class="photo-cover-badge">COVER</span>' : ''}
            </div>`).join('')}
        </div>
        <button type="button" data-go="property-photos" data-pid="${propertyId}" class="btn-primary w-full py-3.5 text-[14px] mt-3">Manage photos</button>
    </div>`;
}

function screenPropertyPhotos() {
    const meta = AppStore.meta(STATE.propertyId);
    const photos = meta.photos?.length ? meta.photos : [IMG.props[STATE.propertyId]];
    return `${topBar('Property Photos', { back: true, sub: 'Select a cover photo. The first photo is your property\'s cover image.' })}
    <div class="screen-content screen-enter photo-gallery-page">
        <div class="photo-gallery-grid">
            ${photos.map((src, i) => `
            <div class="photo-gallery-card">
                <img src="${src}" class="photo-gallery-img" alt="">
                ${i === 0 ? '<span class="photo-cover-badge">COVER</span>' : ''}
                <button type="button" data-action="photo-menu" data-idx="${i}" class="photo-gallery-menu" title="Photo options" aria-label="Photo options">
                    <i data-lucide="more-horizontal" class="w-4 h-4"></i>
                </button>
            </div>`).join('')}
        </div>
        <div class="photo-gallery-footer">
            <button type="button" data-action="upload-photo" class="btn-primary photo-add-btn w-full">
                <i data-lucide="plus" class="w-5 h-5"></i>
                <span>Add photos</span>
            </button>
            <p class="photo-gallery-hint">You can select multiple photos at once</p>
        </div>
    </div>`;
}

function screenPropertyFloorPlans() {
    const meta = AppStore.meta(STATE.propertyId);
    const plans = meta.floorPlans || [];
    return `${topBar('Floor Plans', { back: true, sub: 'Upload floor plan images for this property.' })}
    <div class="screen-content screen-enter photo-gallery-page">
        ${plans.length ? `<div class="photo-gallery-grid">
            ${plans.map((src, i) => `
            <div class="photo-gallery-card">
                <img src="${src}" class="photo-gallery-img" alt="">
                <button type="button" data-action="floor-plan-menu" data-idx="${i}" class="photo-gallery-menu" title="Floor plan options" aria-label="Floor plan options">
                    <i data-lucide="more-horizontal" class="w-4 h-4"></i>
                </button>
            </div>`).join('')}
        </div>` : `<p class="building-empty-copy mb-3">No floor plans yet. Add images of your property layout.</p>`}
        <div class="photo-gallery-footer">
            <button type="button" data-action="upload-floor-plan" class="btn-primary photo-add-btn w-full">
                <i data-lucide="plus" class="w-5 h-5"></i>
                <span>Add floor plan</span>
            </button>
            <p class="photo-gallery-hint">You can select multiple images at once</p>
        </div>
    </div>`;
}

function isCustomApplianceName(name) {
    if (!name || name === 'Other') return true;
    return !APPLIANCE_NAME_OPTIONS.slice(0, -1).includes(name);
}

function renderAlarmReminderFields(prefix, alarm = {}) {
    const timing = alarm.reminderTiming || '30';
    return `
        <div><label class="form-label">Make / Model</label><input data-field="${prefix}_make" class="form-input" value="${escapeHtml(alarm.makeModel || '')}" placeholder="e.g. FireAngel ST-620"></div>
        <div><label class="form-label">Description</label><input data-field="${prefix}_desc" class="form-input" value="${escapeHtml(alarm.description || '')}" placeholder="e.g. Mains-powered, hallway"></div>
        <div><label class="form-label">Alarm picture</label><input data-field="${prefix}_photo" class="form-input" value="${escapeHtml(alarm.photo || '')}" placeholder="Photo reference or filename"></div>
        <div><label class="form-label">Reminder timing</label>
            <select data-field="${prefix}_reminder_timing" class="form-input form-select">
                ${REMINDER_TIMING_OPTIONS.map(o => `<option value="${o.id}" ${timing === o.id ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
        </div>
        <div><label class="form-label">Custom reminder date</label><input data-field="${prefix}_reminder_date" type="date" class="form-input" value="${alarm.reminderDate || ''}"><p class="form-helper">Only needed when reminder timing is custom</p></div>`;
}

function readAlarmFieldsFromDom(prefix) {
    const expiry = fieldVal(`${prefix}_expiry`);
    const timing = fieldVal(`${prefix}_reminder_timing`) || '30';
    const customReminder = fieldVal(`${prefix}_reminder_date`);
    return {
        location: fieldVal(`${prefix}_location`),
        expiry,
        makeModel: fieldVal(`${prefix}_make`),
        description: fieldVal(`${prefix}_desc`),
        photo: fieldVal(`${prefix}_photo`),
        reminderTiming: timing,
        reminderDate: computeReminderDate(expiry, timing, customReminder),
    };
}

function renderCustomAlarmEditCard(a, i) {
    const title = a.name?.trim() || `Additional alarm ${i + 1}`;
    return `
        <div class="card p-4 mb-3 alarm-edit-card">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="feature-pick-chip-icon"><i data-lucide="bell-ring" class="w-4 h-4"></i></span>
                    <p class="text-[13px] font-bold text-[#0F172A] truncate mb-0">${escapeHtml(title)}</p>
                </div>
                <button type="button" data-action="remove-custom-alarm" data-alarm-idx="${i}" class="row-icon-btn row-icon-btn--danger" title="Remove"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
            <div><label class="form-label">Alarm name</label><input data-field="custom_alarm_name_${i}" class="form-input" value="${escapeHtml(a.name || '')}" placeholder="e.g. Heat detector, Smoke alarm (landing)"></div>
            <div><label class="form-label">Location</label><input data-field="custom_alarm_location_${i}" class="form-input" value="${escapeHtml(a.location || '')}" placeholder="e.g. Landing"></div>
            <div><label class="form-label">Expiry Date</label><input data-field="custom_alarm_expiry_${i}" type="date" class="form-input" value="${a.expiry || ''}"></div>
            ${renderAlarmReminderFields(`custom_alarm_${i}`, a)}
        </div>`;
}

function renderApplianceEditCard(a, i) {
    const isCustom = isCustomApplianceName(a.name);
    const icon = applianceIcon(isCustom ? '' : a.name);
    const title = isCustom ? (a.name || `Custom appliance ${i + 1}`) : a.name;
    const nameField = isCustom
        ? `<div><label class="form-label">Appliance name</label><input data-field="app_name_${i}" class="form-input" value="${escapeHtml(a.name === 'Other' ? '' : (a.name || ''))}" placeholder="e.g. Tumble dryer, Air conditioner"></div>`
        : formSelectField('Type', `app_name_${i}`, APPLIANCE_NAME_OPTIONS, a.name, { blankLabel: 'Select appliance' });
    return `
        <div class="card p-4 mb-2 appliance-edit-card">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="feature-pick-chip-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
                    <p class="text-[13px] font-bold text-[#0F172A] truncate">${escapeHtml(title)}</p>
                </div>
                <button type="button" data-action="remove-appliance" data-app-idx="${i}" class="row-icon-btn row-icon-btn--danger" title="Remove"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
            ${nameField}
            <div><label class="form-label">Brand</label><input data-field="app_brand_${i}" class="form-input" value="${escapeHtml(a.brand || '')}" placeholder="e.g. Bosch"></div>
            <div><label class="form-label">Warranty / notes</label><input data-field="app_warranty_${i}" class="form-input" value="${escapeHtml(a.warranty || '')}" placeholder="e.g. Until Mar 2027"></div>
        </div>`;
}

function screenPropertyDetailsEdit(section) {
    const meta = AppStore.meta(STATE.propertyId);
    const p = PROPERTIES[STATE.propertyId];
    const titles = { alarms: 'Alarm Information', appliances: 'Appliances', utilities: 'Utilities', parking: 'Parking', info: 'Property Information' };
    let body = '';
    if (section === 'info') {
        const info = meta.info || {};
        const cover = getPropertyCoverPhoto(STATE.propertyId);
        body = `
        <div class="card overflow-hidden mb-3">
            <img src="${cover}" alt="" style="height:120px;width:100%;object-fit:cover;display:block">
            <button type="button" data-go="property-photos" data-pid="${STATE.propertyId}" class="btn-secondary w-full rounded-none py-2.5 text-[12px] border-0 border-t border-[#F1F5F9]">Manage property photos</button>
        </div>
        <div><label class="form-label">Property Name</label><input data-field="info_name" type="text" class="form-input" value="${escapeHtml(p?.name || '')}" placeholder="e.g. 12 Park Lane"></div>
        <div><label class="form-label">Address</label><input data-field="info_address" type="text" class="form-input" value="${escapeHtml(p?.address || '')}" placeholder="e.g. London, SW1A 1AA"></div>
        <div><label class="form-label">Postcode</label><input data-field="info_postcode" type="text" class="form-input" value="${escapeHtml(info.postcode || '')}" placeholder="e.g. SW1A 1AA"></div>
        ${formSelectField('Property Type', 'info_type', PROPERTY_TYPE_OPTIONS, info.type, { blankLabel: 'Select type' })}
        <div><label class="form-label">Year Built</label><input data-field="info_built" type="number" class="form-input" value="${escapeHtml(info.built || '')}" placeholder="e.g. 1985" min="1700" max="2030"></div>
        <div><label class="form-label">Date Purchased</label><input data-field="info_purchaseDate" type="date" class="form-input" value="${info.purchaseDate || ''}"></div>
        <div class="grid grid-cols-2 gap-3">
            <div><label class="form-label">Valuation (£)</label><input data-field="info_valuationAmount" type="number" class="form-input" value="${escapeHtml(info.valuationAmount || '')}" placeholder="e.g. 450000" min="0"></div>
            <div><label class="form-label">Valuation Date</label><input data-field="info_valuationDate" type="date" class="form-input" value="${info.valuationDate || ''}"></div>
        </div>
        ${formSelectField('Furnished', 'info_furnished', ['Furnished', 'Unfurnished'], info.furnished, { blankLabel: 'Not set' })}
        <div><label class="form-label">Property Description</label><textarea data-field="info_description" class="form-input min-h-[96px] resize-none" placeholder="Listing or advertisement details…">${escapeHtml(info.description || '')}</textarea></div>
        <div><label class="form-label">Alarm Code</label><input data-field="info_alarmCode" type="text" class="form-input" value="${escapeHtml(info.alarmCode || '')}" placeholder="Property security / alarm code" autocomplete="off"></div>
        ${formSelectField('EPC Rating', 'info_epc', EPC_RATING_OPTIONS, info.epc, { blankLabel: 'Select rating' })}
        <div><label class="form-label">EPC Expiry Date</label><input data-field="info_epcExpiry" type="date" class="form-input" value="${info.epcExpiry || ''}"></div>
        <div><label class="form-label">Insurance Renewal</label><input data-field="info_insuranceExpiry" type="date" class="form-input" value="${info.insuranceExpiry || ''}"></div>
        <div><label class="form-label">Mortgage Renewal</label><input data-field="info_mortgageRenewal" type="date" class="form-input" value="${info.mortgageRenewal || ''}"></div>
        ${formSelectField('Council Tax Band', 'info_council', COUNCIL_TAX_BAND_OPTIONS, info.councilTax, { blankLabel: 'Select band' })}
        <div><label class="form-label">Notes</label><textarea data-field="info_notes" class="form-input min-h-[96px] resize-none" placeholder="Access codes, parking notes...">${escapeHtml(info.notes || '')}</textarea></div>`;
    } else if (section === 'alarms') {
        const customAlarms = meta.customAlarms || [];
        body = `
        <p class="form-helper mb-2">Standard UK alarms are listed below. Add more if this property has extra detectors.</p>
        ${ALARM_CATALOG.map(({ key, label, icon }) => {
            const a = meta.alarms[key] || {};
            return `<div class="card p-4 mb-3">
                <div class="flex items-center gap-2 mb-3">
                    <span class="feature-pick-chip-icon"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
                    <p class="text-[13px] font-bold mb-0">${label} Alarm</p>
                </div>
                <div><label class="form-label">Location</label><input data-field="${key}_location" class="form-input" value="${escapeHtml(a.location || '')}" placeholder="e.g. Hallway"></div>
                <div><label class="form-label">Expiry Date</label><input data-field="${key}_expiry" type="date" class="form-input" value="${a.expiry || ''}"></div>
                ${renderAlarmReminderFields(key, a)}
            </div>`;
        }).join('')}
        ${customAlarms.length ? `<p class="screen-section-title">Additional alarms</p>` : ''}
        ${customAlarms.map((a, i) => renderCustomAlarmEditCard(a, i)).join('')}
        <button type="button" data-action="add-custom-alarm" class="btn-secondary w-full py-3 text-[13px] mb-2">+ Add alarm</button>`;
    } else if (section === 'appliances') {
        const appliances = meta.appliances || [];
        body = `${renderApplianceQuickPick(meta)}
        ${appliances.length ? `<p class="screen-section-title">Added appliances</p>` : ''}
        ${appliances.length ? appliances.map((a, i) => renderApplianceEditCard(a, i)).join('') : `<p class="building-empty-copy mb-3">No appliances yet — use quick add above or add a custom one.</p>`}
        <button type="button" data-action="add-appliance" class="btn-secondary w-full py-3 text-[13px] mb-2">+ Add custom appliance</button>`;
    } else if (section === 'utilities') {
        body = `${renderUtilityQuickPick(meta)}
        ${renderUtilityProviderFields(meta) || `<p class="building-empty-copy">Select utility types above, then enter provider names.</p>`}
        <div class="ux-tip mt-3">
            <p class="ux-tip-title">Parking</p>
            <p class="ux-tip-text">Parking spaces and permit details are edited separately.</p>
            <button type="button" data-go="property-parking" data-pid="${STATE.propertyId}" class="header-text-link mt-2">Edit parking</button>
        </div>`;
    } else if (section === 'parking') {
        const parking = meta.parking || {};
        body = `<div><label class="form-label">Spaces</label><input data-field="park_spaces" type="number" class="form-input" value="${parking.spaces || ''}" min="0"></div>
        <div><label class="form-label">Type</label><select data-field="park_type" class="form-input form-select">${['Off-street','On-street','Garage','None'].map(o => `<option ${o===(parking.type||'')?'selected':''}>${o}</option>`).join('')}</select></div>
        <div><label class="form-label">Permit Number</label><input data-field="park_permit" class="form-input" value="${escapeHtml(parking.permit || '')}"></div>
        <div><label class="form-label">Notes</label><textarea data-field="park_notes" class="form-input min-h-[80px]">${escapeHtml(parking.notes || '')}</textarea></div>`;
    }
    return `${topBar(titles[section] || 'Details', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-enter">${body}
        <button data-action="save-property-meta" data-section="${section}" class="btn-primary w-full py-3.5 text-[14px]">Save Changes</button>
    </div>`;
}

/* ─── Action Handlers ─── */
function savePropertyMeta(section) {
    const meta = AppStore.meta(STATE.propertyId);
    if (section === 'info') {
        const p = PROPERTIES[STATE.propertyId];
        if (p) {
            const name = fieldVal('info_name').trim();
            const address = fieldVal('info_address').trim();
            if (!name || !address) {
                toast('Property name and address are required');
                return;
            }
            p.name = name;
            p.address = address;
            syncPropertyDisplayReferences(STATE.propertyId);
            syncPropertyStatus(STATE.propertyId);
        }
        const postcode = (fieldVal('info_postcode') || '').trim();
        meta.info = {
            ...(meta.info || {}),
            type: fieldVal('info_type'),
            built: fieldVal('info_built'),
            postcode,
            purchaseDate: fieldVal('info_purchaseDate'),
            valuationAmount: fieldVal('info_valuationAmount'),
            valuationDate: fieldVal('info_valuationDate'),
            furnished: fieldVal('info_furnished'),
            description: fieldVal('info_description'),
            alarmCode: fieldVal('info_alarmCode'),
            epc: saveEpcValue(fieldVal('info_epc')),
            epcExpiry: fieldVal('info_epcExpiry'),
            insuranceExpiry: fieldVal('info_insuranceExpiry'),
            mortgageRenewal: fieldVal('info_mortgageRenewal'),
            councilTax: fieldVal('info_council'),
            notes: fieldVal('info_notes'),
        };
        if (meta.info.councilTax) meta.utilities.councilTax = meta.info.councilTax;
        syncSmartReminders(false);
    } else if (section === 'alarms') {
        ['smoke', 'heat', 'co'].forEach(k => {
            meta.alarms[k] = readAlarmFieldsFromDom(k);
        });
        const customIndices = [...document.querySelectorAll('[data-field^="custom_alarm_name_"]')]
            .map(el => +String(el.dataset.field).replace('custom_alarm_name_', ''))
            .filter(n => !Number.isNaN(n));
        meta.customAlarms = customIndices.map(i => ({
            name: fieldVal(`custom_alarm_name_${i}`).trim(),
            location: fieldVal(`custom_alarm_location_${i}`).trim(),
            expiry: fieldVal(`custom_alarm_expiry_${i}`),
            makeModel: fieldVal(`custom_alarm_${i}_make`),
            description: fieldVal(`custom_alarm_${i}_desc`),
            photo: fieldVal(`custom_alarm_${i}_photo`),
            reminderTiming: fieldVal(`custom_alarm_${i}_reminder_timing`) || '30',
            reminderDate: computeReminderDate(
                fieldVal(`custom_alarm_expiry_${i}`),
                fieldVal(`custom_alarm_${i}_reminder_timing`) || '30',
                fieldVal(`custom_alarm_${i}_reminder_date`),
            ),
        })).filter(a => a.name || a.location || a.expiry || a.makeModel || a.description);
        syncSmartReminders(false);
    } else if (section === 'appliances') {
        const indices = [...document.querySelectorAll('[data-field^="app_name_"]')]
            .map(el => +String(el.dataset.field).replace('app_name_', ''))
            .filter(n => !Number.isNaN(n));
        meta.appliances = indices.map(i => ({
            name: fieldVal(`app_name_${i}`).trim(),
            brand: fieldVal(`app_brand_${i}`) || '',
            warranty: fieldVal(`app_warranty_${i}`) || '',
        })).filter(a => a.name);
    } else if (section === 'utilities') {
        if (!meta.utilities) meta.utilities = {};
        migrateUtilityKeys(meta);
        UTILITY_CATALOG.forEach(u => {
            if (meta.utilities[u.key] == null) return;
            meta.utilities[u.key] = {
                provider: fieldVal(`util_${u.key}_provider`),
                meterNumber: fieldVal(`util_${u.key}_meter`),
                meterLocation: fieldVal(`util_${u.key}_location`),
                phone: fieldVal(`util_${u.key}_phone`),
                meterPicture: fieldVal(`util_${u.key}_picture`),
            };
        });
        meta.utilities.council = {
            name: fieldVal('util_council_name'),
            notes: fieldVal('util_council_notes'),
        };
        if (meta.info?.councilTax) meta.utilities.councilTax = meta.info.councilTax;
    } else if (section === 'parking') {
        meta.parking = {
            spaces: +fieldVal('park_spaces') || 0,
            type: fieldVal('park_type') || document.querySelector('[data-field="park_type"]')?.value,
            permit: fieldVal('park_permit'),
            notes: fieldVal('park_notes'),
        };
    }
    withLoading(() => {
        AppStore.save();
        toast('Saved');
        go('property-detail', { propertyId: STATE.propertyId, tab: 'info', noHistory: true });
    });
}

function handleFeatureSave(el) {
    const screen = STATE.screen;
    if (screen === 'add-property') return saveAddProperty();
    if (screen === 'edit-property') return saveEditProperty();
    if (screen === 'edit-flat') return saveFlatDetails();
    if (screen === 'add-flat') return saveAddFlat();
    if (screen === 'log-maintenance') return saveLogMaintenance();
    if (screen === 'create-invoice') return saveCreateInvoice();
    if (screen === 'add-reminder' || screen === 'edit-reminder') return saveReminder();
    if (screen === 'create-tenancy') return saveTenancy();
    if (screen === 'checkout-tenancy') return saveCheckout();
    if (screen === 'conduct-inspection') return saveInspection();
    if (screen === 'invite-tenant') return sendTenantInvitation();
    if (screen === 'edit-tenant') return saveEditTenant();
    if (screen === 'edit-tenancy-deposit') return saveTenancyDeposit();
    if (screen === 'renew-compliance') return saveRenewCompliance();
    if (screen === 'edit-inventory-room') return saveEditInventoryRoom();
    if (screen === 'reschedule-inspection') return saveRescheduleInspection();
    if (screen === 'add-payment-method') return saveAddPaymentMethod();
    if (screen === 'edit-payment-method') return saveEditPaymentMethod();
    if (screen === 'personal-info') return savePersonalInfo();
    if (screen === 'subscription-billing') return saveSubscriptionBilling();
    if (screen === 'password') return savePassword();
    if (screen === 'tenant-add-note') return saveTenantNote();
    if (screen === 'tenant-edit-note') return saveTenantNote(true);
    if (screen === 'tenant-edit-profile') return saveTenantProfile();
    if (screen === 'contractor-company' && typeof saveContractorCompany === 'function') return saveContractorCompany();
    return false;
}

function syncTenantDisplayName(tid, fullName, firstName, lastName) {
    const list = TENANT_LIST[tid];
    const t = TENANTS[tid];
    if (!list || !t) return;
    const oldName = list.name;
    list.name = fullName;
    t.firstName = firstName;
    t.lastName = lastName;
    const account = typeof tenantAccountByEmail === 'function' ? tenantAccountByEmail(t.email) : null;
    if (account) {
        account.firstName = firstName;
        account.lastName = lastName;
    }
    if (!oldName || oldName === fullName) return;
    const conv = CONVERSATIONS.find(c => c.name === oldName);
    if (conv) conv.name = fullName;
    if (typeof getFlatMemberRoster === 'function') {
        const { tenancy } = getFlatMemberRoster(list.propertyId, list.unit);
        if (tenancy?.members) {
            tenancy.members.forEach(m => {
                if (m.tenantId === tid || m.name === oldName) m.name = fullName;
            });
        }
        if (tenancy?.leadName === oldName) tenancy.leadName = fullName;
    }
}

function saveTenantProfile() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : null;
    const account = typeof getActiveTenant === 'function' ? getActiveTenant() : null;
    if (tid == null || !account) { toast('No active tenant account'); return true; }
    const t = TENANTS[tid];
    if (!t) { toast('Tenant record not found'); return true; }
    const fullName = fieldVal('fullName')?.trim();
    if (!fullName) { toast('Enter your full name'); return true; }
    const { firstName, lastName } = typeof splitFullName === 'function' ? splitFullName(fullName) : { firstName: fullName, lastName: '' };
    syncTenantDisplayName(tid, fullName, firstName, lastName);
    t.email = fieldVal('email') || t.email;
    t.phone = fieldVal('phone') || t.phone;
    t.emergency = fieldVal('emergency') || t.emergency || '—';
    t.emergencyPhone = fieldVal('emergencyPhone') || t.emergencyPhone || '—';
    account.email = t.email;
    account.phone = t.phone;
    if (typeof saveTenantData === 'function') saveTenantData();
    AppStore.save();
    toast('Profile updated');
    back();
    return true;
}

function setAddPropertyUnitMode(mode) {
    STATE.addPropertyUnitMode = mode;
    render();
}

function setPendingPropertyCover(idx) {
    if (!STATE.pendingPropertyPhotos?.length) return;
    STATE.pendingPropertyCover = Math.min(Math.max(0, idx), STATE.pendingPropertyPhotos.length - 1);
    render();
}

function removePendingPropertyPhoto(idx) {
    if (!STATE.pendingPropertyPhotos?.length || idx < 0 || idx >= STATE.pendingPropertyPhotos.length) return;
    STATE.pendingPropertyPhotos.splice(idx, 1);
    const cover = STATE.pendingPropertyCover ?? 0;
    if (!STATE.pendingPropertyPhotos.length) STATE.pendingPropertyCover = 0;
    else if (idx === cover) STATE.pendingPropertyCover = Math.min(cover, STATE.pendingPropertyPhotos.length - 1);
    else if (idx < cover) STATE.pendingPropertyCover = Math.max(0, cover - 1);
    render();
}

function screenAddPropertyEnhanced() {
    const pending = STATE.pendingPropertyPhotos || [];
    const cover = STATE.pendingPropertyCover ?? 0;
    const photoPicker = renderFlatUnitPhotoPicker(pending, cover, {
        coverAction: 'set-pending-property-cover',
        removeAction: 'remove-pending-property-photo',
        uploadAction: 'upload-photo',
        uploadLabel: pending.length ? 'Add more photos' : 'Add property photos',
        hint: 'Add multiple photos. Tap ★ on a thumbnail to set the portfolio cover image.',
        placeholder: IMG.interior[0],
    });
    return `${topBar('Add Property', { back: true })}
    <div class="screen-content screen-enter add-property-page">
        <div class="ux-tip add-property-tip">
            <p class="ux-tip-title">Building first, units later</p>
            <p class="ux-tip-text">Save the property now. You can add flats and unit details afterwards from <strong>Property → Units → + Add unit</strong>. EPC, utilities and compliance go under <strong>Property → Info</strong>.</p>
        </div>
        <p class="screen-section-title">Photos</p>
        ${photoPicker}
        <p class="screen-section-title">Property details</p>
        ${labeledInput('Property name', 'name', '', 'text', 'e.g. 12 Park Lane', true)}
        ${labeledInput('Street address', 'address', '', 'text', 'Street and town', true)}
        ${labeledInput('Postcode', 'postcode', '', 'text', 'e.g. SW1A 1AA')}
        ${formSelectField('Property type', 'propertyType', PROPERTY_TYPE_OPTIONS, '', { blankLabel: 'Select type (optional)' })}
        <p class="screen-section-title">Notes <span class="text-[#94A3B8] font-normal">(optional)</span></p>
        <div class="form-group">
            <label class="form-label">Building notes</label>
            <textarea data-field="notes" class="form-input min-h-[80px] resize-none" placeholder="Access codes, parking, meter locations…"></textarea>
        </div>
        <button type="button" data-action="save" class="btn-primary w-full py-3.5 text-[14px]">Save property</button>
    </div>`;
}

function saveAddProperty() {
    if (!validateFields([
        ['name', 'Property name', v => v],
        ['address', 'Street address', v => v],
    ])) return;
    const id = AppStore.nextId(PROPERTIES);
    const postcode = (fieldVal('postcode') || '').trim();
    let address = (fieldVal('address') || '').trim();
    if (postcode && !address.toUpperCase().includes(postcode.toUpperCase().replace(/\s/g, ''))) {
        address = `${address}, ${postcode}`;
    }
    PROPERTIES.push({
        id,
        name: fieldVal('name').trim(),
        address,
        status: 'Vacant',
        statusColor: ['#FEF3C7', '#D97706'],
        tenant: null,
        rent: '—',
        compliance: false,
    });
    const meta = AppStore.meta(id);
    meta.units = [];
    meta.building = { flatCount: 0, floors: 0, flatsPerFloor: 0, useFloors: false };
    const photos = [...(STATE.pendingPropertyPhotos || [])];
    const coverIdx = STATE.pendingPropertyCover ?? 0;
    if (photos.length > 1 && coverIdx > 0 && coverIdx < photos.length) {
        const [coverPhoto] = photos.splice(coverIdx, 1);
        photos.unshift(coverPhoto);
    }
    if (photos.length) meta.photos = photos;
    IMG.props[id] = photos[0] || IMG.interior[id % IMG.interior.length] || IMG.fallback;
    meta.info = {
        ...(meta.info || {}),
        type: fieldVal('propertyType') || '',
        postcode,
        notes: fieldVal('notes') || '',
    };
    STATE.pendingPropertyPhotos = [];
    STATE.pendingPropertyCover = 0;
    STATE.addPropertyUnitMode = 'single';
    syncPropertyStatus(id);
    if (typeof syncPropertyDisplayReferences === 'function') syncPropertyDisplayReferences(id);
    withLoading(() => {
        syncSmartReminders();
        AppStore.save();
        toast('Property saved — add your first unit');
        go('property-detail', { propertyId: id, tab: 'units' });
    });
}

function saveEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    if (!p) return;
    if (!validateFields([
        ['name', 'Property name', v => v],
        ['address', 'Address', v => v],
    ])) return;
    p.name = fieldVal('name') || p.name;
    p.address = fieldVal('address') || p.address;
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.info) meta.info = {};
    meta.info.notes = fieldVal('notes') || meta.info.notes;
    const building = getPropertyBuilding(STATE.propertyId);
    building.flatCount = getPropertyUnits(STATE.propertyId).length;
    meta.building = building;
    syncPropertyDisplayReferences(STATE.propertyId);
    syncPropertyStatus(STATE.propertyId);
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Property updated'); back(); });
}

function deleteProperty() {
    showConfirm('Remove Property', `Remove ${PROPERTIES[STATE.propertyId]?.name}? This cannot be undone.`, () => {
        PROPERTIES.splice(STATE.propertyId, 1);
        AppStore.save();
        toast('Property removed');
        go('properties');
    }, { okLabel: 'Remove', danger: true });
}

function deleteBroadcast() {
    showConfirm('Delete Announcement', 'Are you sure you want to delete this announcement? This cannot be undone.', () => {
        const idx = AppStore.broadcasts.findIndex(b => b.id === STATE.broadcastId);
        if (idx >= 0) {
            AppStore.broadcasts.splice(idx, 1);
            AppStore.save();
            toast('Announcement deleted');
            go('broadcast-notices');
        }
    }, { okLabel: 'Delete', danger: true });
}

function saveLogMaintenance() {
    clearFormErrors();
    if (!validateFields([['title','Issue Title',v=>v],['desc','Description',v=>v]])) return;
    const isTenant = STATE.userRole === 'tenant';
    const tenant = isTenant ? getActiveTenant() : null;
    const pid = isTenant ? tenant?.propertyId : (+fieldVal('propertyId') || STATE.propertyId);
    if (isTenant && pid == null) {
        toast('Tenant account not linked to a property');
        return;
    }
    const hasPrefill = !isTenant && STATE.logMaintPrefill;
    const scope = isTenant ? 'unit' : (hasPrefill ? 'unit' : (STATE.logMaintScope || 'unit'));
    let unit = '';
    let communalArea = null;
    if (scope === 'communal') {
        communalArea = fieldVal('communalArea') || STATE.logMaintCommunalArea;
        if (!communalArea) {
            STATE.formErrors = { ...(STATE.formErrors || {}), communalArea: 'Select a communal area' };
            toastError('Please fix the errors below');
            render();
            return;
        }
        unit = 'Communal';
        STATE.logMaintCommunalArea = communalArea;
    } else {
        unit = isTenant ? tenant?.unit : (fieldVal('unit') || STATE.selectedUnit || '');
        if (!isTenant && !unit) {
            STATE.formErrors = { ...(STATE.formErrors || {}), unit: 'Select a unit' };
            toastError('Please fix the errors below');
            render();
            return;
        }
    }
    const p = PROPERTIES[pid];
    const id = AppStore.nextId(MAINTENANCE_ITEMS);
    const entry = {
        id, issue: fieldVal('title'), prop: p.name, unit: unit || '—', time: 'Just now',
        priority: STATE.logPriority, contractor: '—', status: 'open', propertyId: pid,
        desc: fieldVal('desc'),
        photos: STATE.logMaintPhotos || [],
        videos: STATE.logMaintVideos || [],
        categoryId: fieldVal('categoryId') || STATE.logMaintCategoryId || suggestMaintTradeCategory(fieldVal('title')).id,
        scope,
        history: [{ event: 'Issue reported', detail: fieldVal('desc'), time: 'Just now' }],
    };
    if (scope === 'communal') entry.communalArea = communalArea;
    if (isTenant) {
        entry.reportedBy = 'tenant';
        entry.tenantName = `${tenant.firstName} ${tenant.lastName}`;
        entry.reportedAt = 'Just now';
        entry.paidBy = 'tenant';
        if (typeof ensureLandlordConversation === 'function') ensureLandlordConversation({ propertyId: pid });
    } else {
        entry.reportedBy = 'landlord';
        entry.paidBy = 'landlord';
    }
    MAINTENANCE_ITEMS.unshift(entry);
    STATE.logMaintPhotos = [];
    STATE.logMaintVideos = [];
    STATE.logMaintCategoryId = '';
    STATE.logMaintPrefill = null;
    STATE.logMaintScope = 'unit';
    if (isTenant) {
        pushNotification({
            icon: 'wrench', color: ['#FEE2E2', '#DC2626'],
            title: 'Tenant reported issue', desc: `${entry.issue} · ${p.name}`,
            time: 'Just now', unread: true, screen: 'maintenance-detail', opts: { mid: id },
        });
    } else if (scope === 'communal') {
        const notifyIds = getPropertyNotifyTargets(pid).map(t => t.id);
        if (notifyIds.length) {
            notifyTenantsAboutEvent(pid, notifyIds, {
                title: 'Communal maintenance',
                desc: `${entry.issue} · ${communalArea}`,
            });
        }
    }
    withLoading(() => {
        AppStore.save();
        toast(isTenant ? 'Issue reported to landlord' : 'Issue logged');
        if (isTenant) go('tenant-issues');
        else go('maintenance-detail', { mid: id });
    });
}

function saveCreateInvoice() {
    if (!validateFields([['amount','Amount',v=>v&&+v>0],['due','Due Date',v=>v]])) return;
    const pid = +fieldVal('propertyId');
    const p = PROPERTIES[pid];
    const unit = fieldVal('unit') || '';
    const tenant = TENANT_LIST.find(t => t.propertyId === pid && (!unit || t.unit === unit) && t.status === 'active');
    const desc = fieldVal('desc') || 'Bill';
    const id = AppStore.nextId(INVOICES);
    INVOICES.unshift({
        id, num: `INV-2026-${1049 + id}`, prop: `${p.name}, ${p.address}`, unit,
        tenant: tenant?.name || '', tenantId: tenant?.id ?? null, propertyId: pid,
        amount: `£${parseInt(fieldVal('amount'), 10).toLocaleString()}`, status: 'Pending',
        due: typeof formatDisplayDate === 'function' ? formatDisplayDate(fieldVal('due')) : fieldVal('due'),
        month: '', type: 'bill', desc,
    });
    syncTransactionsFromInvoices();
    withLoading(() => { AppStore.save(); toast('Bill added'); go('financial'); });
}

function saveReminder() {
    if (!validateFields([['title', 'Title', v => v], ['due', 'Due Date', v => v]])) return;
    const due = fieldVal('due');
    const daysLeft = daysUntil(due) ?? 0;
    const payload = {
        type: fieldVal('type') || 'custom',
        propertyId: +fieldVal('propertyId'),
        title: fieldVal('title'),
        due,
        daysLeft,
        urgency: daysLeft < 0 ? 'high' : daysLeft <= 7 ? 'high' : daysLeft <= 30 ? 'medium' : 'low',
    };
    const editId = STATE.screen === 'edit-reminder' ? STATE.reminderId : null;
    if (editId != null) {
        const idx = AppStore.reminders.findIndex(r => r.id === editId);
        if (idx < 0) { toast('Reminder not found'); return; }
        const existing = AppStore.reminders[idx];
        Object.assign(existing, payload);
        if (existing.auto) applyReminderDueToSource(existing, due);
        withLoading(() => {
            syncSmartReminders();
            AppStore.save();
            toast('Reminder updated');
            go('reminder-detail', { reminderId: editId });
        });
        return;
    }
    AppStore.reminders.push({
        id: AppStore.nextId(AppStore.reminders),
        ...payload,
    });
    withLoading(() => { AppStore.save(); toast('Reminder added'); go('reminders'); });
}

function saveTenancy() {
    if (!validateFields([
        ['unit', 'Unit', v => v],
        ['rent', 'Rent', v => v && String(v).replace(/[^\d]/g, '')],
        ['start', 'Start Date', v => v],
        ['end', 'End Date', v => v],
        ['deposit', 'Security deposit', v => v && String(v).replace(/[^\d]/g, '')],
    ])) return;
    const type = fieldVal('tenancyType') || 'solo';
    const members = type === 'group' ? collectGroupMembers() : [];
    const leadName = type === 'group' && members[0]?.name ? members[0].name : null;
    const rentAmt = parseRentAmount(fieldVal('rent'));
    const rentFmt = formatRentAmount(rentAmt);
    const depositFmt = formatMoneyField(fieldVal('deposit'));
    const advanceFmt = formatMoneyField(fieldVal('advancePaid') || '0');
    const depositScheme = fieldVal('depositScheme') || 'MyDeposits';
    const protectionRef = fieldVal('protectionRef') || '';
    const depositStatus = resolveDepositStatus(depositScheme, protectionRef);
    const tenancy = {
        id: AppStore.nextId(AppStore.tenancies),
        propertyId: STATE.propertyId,
        type,
        unit: fieldVal('unit'),
        rent: rentFmt,
        deposit: depositFmt,
        advancePaid: advanceFmt,
        depositScheme,
        depositStatus,
        protectionRef,
        start: fieldVal('start'),
        end: fieldVal('end'),
        status: 'pending',
        occupants: type === 'group' ? (members.length || +fieldVal('occupants') || 2) : 1,
        members: type === 'group' ? members : [],
        leadName,
    };
    AppStore.tenancies.push(tenancy);
    const unitRecord = getUnitByName(STATE.propertyId, fieldVal('unit'));
    if (unitRecord) unitRecord.rent = `£${parseInt(fieldVal('rent'), 10).toLocaleString()}`;
    if (type === 'group' && members.length) {
        tenancy.leadName = leadName;
        tenancy.members = members.map((m, i) => ({ ...m, role: i === 0 ? 'lead' : undefined, status: 'no-account' }));
    }
    syncPropertyStatus(STATE.propertyId);
    const unitName = fieldVal('unit');
    STATE.tenancyPrefill = null;
    STATE.tenancyMemberDraft = null;
    STATE.groupMemberCount = 1;
    withLoading(() => {
        syncSmartReminders();
        AppStore.save();
        toast(type === 'group' ? 'Group tenancy created — invite each member' : 'Lease saved — unit marked as reserved until tenant accepts');
        STATE.invitePrefill = null;
        go('invite-tenant', { propertyId: STATE.propertyId, unit: unitName });
    });
}

function saveCheckout() {
    if (!validateFields([['checkoutDate','Check-out Date',v=>v]])) return;
    const t = TENANTS[STATE.tenantId];
    const listItem = TENANT_LIST.find(x => x.id === STATE.tenantId);
    const checkoutDate = fieldVal('checkoutDate');
    const reason = fieldVal('reason') || 'End of lease';
    const notes = fieldVal('checkoutNotes') || '';
    const deposit = fieldVal('deposit') || 'Full return';
    const checkoutLabel = typeof formatDisplayDate === 'function' ? formatDisplayDate(checkoutDate) || checkoutDate : checkoutDate;
    if (listItem) {
        listItem.status = 'inactive';
        listItem.lease = `Ended ${checkoutLabel}`;
        listItem.leaseEnd = typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(checkoutDate) : checkoutLabel;
    }
    if (t) {
        t.leaseEnd = checkoutDate;
        if (!AppStore.checkoutRecords) AppStore.checkoutRecords = [];
        AppStore.checkoutRecords.push({
            tenantId: STATE.tenantId,
            propertyId: listItem?.propertyId,
            unit: listItem?.unit,
            date: checkoutDate,
            reason,
            notes,
            deposit,
        });
    }
    const ten = AppStore.tenancies.find(x => x.propertyId === listItem?.propertyId && x.unit === listItem?.unit && x.status !== 'ended');
    const fullName = t ? `${t.firstName} ${t.lastName}`.trim() : listItem?.name || '';
    if (ten) {
        if (ten.type === 'group' && Array.isArray(ten.members) && ten.members.length > 1) {
            ten.members = ten.members.filter(m =>
                m.tenantId !== STATE.tenantId && m.name !== fullName &&
                !(t?.email && m.email?.toLowerCase() === t.email.toLowerCase())
            );
            ten.occupants = Math.max(1, ten.members.length);
            if (ten.members.length === 0) {
                ten.status = 'ended';
                ten.end = checkoutDate;
                ten.checkout = { reason, notes, deposit };
            } else if (ten.members[0] && !ten.members.some(m => m.role === 'lead')) {
                ten.members[0].role = 'lead';
                ten.leadName = ten.members[0].name;
                ten.tenantId = ten.members[0].tenantId ?? ten.tenantId;
            }
        } else {
            ten.status = 'ended';
            ten.end = checkoutDate;
            ten.checkout = { reason, notes, deposit };
        }
    }
    if (listItem?.propertyId != null && listItem?.unit) {
        TENANT_INVITATIONS.filter(i => i.propertyId === listItem.propertyId && i.unit === listItem.unit && i.status === 'pending')
            .forEach(i => { i.status = 'cancelled'; });
        syncPropertyStatus(listItem.propertyId);
    }
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Check-out completed'); go('tenants'); });
}

function saveInspection() {
    if (!validateFields([['inspDate', 'Date', v => v], ['rating', 'Rating', v => v]])) return;
    const rating = Math.min(5, Math.max(1, Math.round(parseFloat(fieldVal('rating')) || STATE.inspectionRating || 0)));
    if (!rating) {
        toast('Select an overall rating');
        return;
    }
    const photoCount = STATE.inspectionPhotos?.length || 0;
    const payload = {
        type: fieldVal('inspType'),
        date: fieldVal('inspDate'),
        rating: String(rating),
        notes: fieldVal('inspNotes') || '',
        photos: photoCount,
        photoUrls: [...(STATE.inspectionPhotos || [])],
        report: `${fieldVal('inspType') || 'Inspection'} report.pdf`,
        scheduled: false,
    };
    const scheduled = getScheduledInspection(STATE.propertyId);
    if (scheduled) {
        Object.assign(scheduled, payload);
    } else {
        AppStore.inspections.unshift({
            id: AppStore.nextId(AppStore.inspections),
            propertyId: STATE.propertyId,
            ...payload,
        });
    }
    STATE.inspectionPhotos = [];
    STATE.inspectionRating = 4;
    STATE.inspectionPrefill = null;
    const pid = STATE.propertyId;
    const notifyIds = getSelectedNotifyTargetIds();
    const typeLabel = fieldVal('inspType') || 'Inspection';
    const notified = notifyTenantsAboutEvent(pid, notifyIds, {
        title: 'Inspection completed',
        desc: `${typeLabel} · ${PROPERTIES[pid]?.name || ''}`,
    });
    const toastMsg = notified
        ? `Inspection saved — ${notified} tenant${notified === 1 ? '' : 's'} notified`
        : 'Inspection saved';
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast(toastMsg); go('property-detail', { propertyId: pid, tab: 'inspection' }); });
}

function saveEditTenant() {
    const t = TENANTS[STATE.tenantId];
    const list = TENANT_LIST[STATE.tenantId];
    if (!t) return;
    const fullName = fieldVal('fullName')?.trim();
    if (!validateFields([
        ['fullName', 'Full Name', v => v],
        ['idNumber', 'NID', v => v],
        ['email', 'Email', v => v],
    ])) return;
    const { firstName, lastName } = typeof splitFullName === 'function' ? splitFullName(fullName) : { firstName: fullName, lastName: '' };
    const oldEmail = t.email;
    syncTenantDisplayName(STATE.tenantId, fullName, firstName, lastName);
    t.idNumber = fieldVal('idNumber') || t.idNumber;
    t.dob = fieldVal('dob') || t.dob;
    t.email = fieldVal('email');
    t.phone = fieldVal('phone') || t.phone;
    t.emergency = fieldVal('emergency')?.trim() || '';
    t.emergencyPhone = fieldVal('emergencyPhone')?.trim() || '';
    t.homeAddress = fieldVal('homeAddress')?.trim() || '';
    const draft = {
        nidProofFrontName: STATE.nidProofFrontName || t.nidProofFront || '',
        nidProofBackName: STATE.nidProofBackName || t.nidProofBack || '',
    };
    const startedNewProof = STATE.nidProofFrontName || STATE.nidProofBackName;
    const hasLegacyProof = !!(t.nidProof && !t.nidProofFront && !t.nidProofBack);
    if (startedNewProof || (!hasLegacyProof && !hasCompleteNidProof(draft))) {
        const nidErr = typeof validateNidProof === 'function' ? validateNidProof(draft) : null;
        if (nidErr) {
            STATE.formErrors = { ...(STATE.formErrors || {}), nidProof: nidErr };
            toast(nidErr);
            render();
            return;
        }
    }
    if (STATE.nidProofFrontName) t.nidProofFront = STATE.nidProofFrontName;
    if (STATE.nidProofBackName) t.nidProofBack = STATE.nidProofBackName;
    if (t.nidProofFront && t.nidProofBack) {
        t.nidProof = typeof inviteNidProofSummary === 'function'
            ? inviteNidProofSummary({ nidProofFrontName: t.nidProofFront, nidProofBackName: t.nidProofBack })
            : `${t.nidProofFront} + ${t.nidProofBack}`;
    }
    const account = typeof tenantAccountByEmail === 'function' ? tenantAccountByEmail(oldEmail) : null;
    if (account) {
        account.firstName = firstName;
        account.lastName = lastName;
        account.email = t.email;
        account.phone = t.phone;
        if (typeof saveTenantData === 'function') saveTenantData();
    }
    withLoading(() => { AppStore.save(); toast('Tenant details updated'); back(); });
}

function saveRenewCompliance() {
    if (!validateFields([['certNumber', 'Certificate Number', v => v], ['expiryDate', 'Expiry Date', v => v]])) return;
    const cid = STATE.complianceId ?? 0;
    const pid = STATE.propertyId ?? 0;
    const key = `${pid}-${cid}`;
    const expiry = formatDisplayDate(fieldVal('expiryDate'));
    const cfg = COMPLIANCE_ITEM_CONFIG[cid];
    if (cfg?.alarmKey) {
        const meta = AppStore.meta(pid);
        if (!meta.alarms) meta.alarms = {};
        if (!meta.alarms[cfg.alarmKey]) meta.alarms[cfg.alarmKey] = {};
        meta.alarms[cfg.alarmKey] = {
            ...(meta.alarms[cfg.alarmKey] || {}),
            expiry: fieldVal('expiryDate'),
        };
    } else {
        AppStore.complianceCerts[key] = {
            certNumber: fieldVal('certNumber'),
            issueDate: fieldVal('issueDate'),
            expiryDate: fieldVal('expiryDate'),
            issuedBy: fieldVal('issuedBy'),
            notes: fieldVal('certNotes'),
        };
    }
    if (COMPLIANCE_ITEMS[cid]) COMPLIANCE_ITEMS[cid][2] = expiry || COMPLIANCE_ITEMS[cid][2];
    const p = PROPERTIES[pid];
    if (p && cfg?.cert) p.compliance = true;
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Certificate renewed'); go('property-detail', { propertyId: pid, tab: 'records', recordsView: 'compliance' }); });
}

function saveEditInventoryRoom() {
    const pid = STATE.propertyId ?? 0;
    const rid = STATE.roomId ?? 0;
    const key = inventoryKey(pid, rid);
    const items = collectInventoryEditItemsFromDom();
    AppStore.inventory[key] = {
        notes: fieldVal('roomNotes'),
        items,
        photos: AppStore.inventory[key]?.photos || [],
    };
    STATE.inventoryEditItems = null;
    withLoading(() => { AppStore.save(); toast('Room inventory saved'); go('inventory-room', { propertyId: pid, roomId: rid }); });
}

function saveRescheduleInspection() {
    if (!validateFields([['inspDate', 'Inspection Date', v => v]])) return;
    const pid = STATE.propertyId ?? 0;
    const dateStr = formatDisplayDate(fieldVal('inspDate'));
    const timeSlot = fieldVal('timeSlot');
    const notifyIds = getSelectedNotifyTargetIds();
    const insp = AppStore.inspections.find(i => i.propertyId === pid && i.scheduled)
        || AppStore.inspections.find(i => i.propertyId === pid);
    if (insp) {
        insp.date = dateStr;
        insp.type = fieldVal('inspType') || insp.type;
        insp.scheduled = true;
        insp.notes = fieldVal('inspNotes');
        insp.timeSlot = timeSlot;
        insp.notifyTenantIds = notifyIds;
    } else {
        AppStore.inspections.push({
            id: AppStore.nextId(AppStore.inspections),
            propertyId: pid,
            type: fieldVal('inspType') || 'Mid-term',
            date: dateStr,
            rating: null,
            photos: 0,
            report: null,
            scheduled: true,
            notes: fieldVal('inspNotes'),
            timeSlot,
            notifyTenantIds: notifyIds,
        });
    }
    const p = PROPERTIES[pid];
    const typeLabel = fieldVal('inspType') || 'Inspection';
    const notified = notifyTenantsAboutEvent(pid, notifyIds, {
        title: 'Inspection scheduled',
        desc: `${typeLabel} · ${dateStr}${timeSlot ? ` · ${timeSlot}` : ''} · ${p?.name || ''}`,
    });
    const toastMsg = notified
        ? `Inspection scheduled — ${notified} tenant${notified === 1 ? '' : 's'} notified`
        : 'Inspection scheduled';
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast(toastMsg); go('property-detail', { propertyId: pid, tab: 'inspection' }); });
}

function saveAddPaymentMethod() {
    if (!validateFields([['cardholder', 'Cardholder Name', v => v], ['cardNumber', 'Card Number', v => v]])) return;
    const last4 = fieldVal('cardNumber').replace(/\s/g, '').slice(-4) || '0000';
    const isDefault = fieldVal('isDefault');
    const id = AppStore.nextId(AppStore.paymentMethods);
    if (isDefault) AppStore.paymentMethods.forEach(p => { p.default = false; });
    const payType = fieldVal('payType');
    AppStore.paymentMethods.push({
        id,
        type: payType?.includes('Bank') ? 'Barclays' : 'Visa',
        last4,
        exp: fieldVal('expiry') || '—',
        name: fieldVal('cardholder'),
        default: !!isDefault,
    });
    withLoading(() => { AppStore.save(); toast('Payment method added'); go('payment-methods'); });
}

function saveEditPaymentMethod() {
    const pm = AppStore.paymentMethods.find(p => p.id === STATE.paymentId);
    if (!pm) return;
    pm.name = fieldVal('accountHolder') || pm.name;
    pm.exp = fieldVal('expiry') || pm.exp;
    const isDefault = fieldVal('isDefault');
    if (isDefault) AppStore.paymentMethods.forEach(p => { p.default = false; });
    pm.default = !!isDefault;
    withLoading(() => { AppStore.save(); toast('Payment method updated'); back(); });
}

function removePaymentMethod() {
    const pm = AppStore.paymentMethods.find(p => p.id === STATE.paymentId);
    if (!pm) return;
    showConfirm('Remove Payment Method', `Remove ${pm.type} ···· ${pm.last4}?`, () => {
        AppStore.paymentMethods = AppStore.paymentMethods.filter(p => p.id !== STATE.paymentId);
        if (AppStore.paymentMethods.length && !AppStore.paymentMethods.some(p => p.default)) {
            AppStore.paymentMethods[0].default = true;
        }
        AppStore.save();
        toast('Payment method removed');
        go('payment-methods');
    }, { okLabel: 'Remove', danger: true });
}

function saveSubscriptionBilling() {
    const exp = fieldVal('billingExp')?.trim();
    if (exp) LANDLORD_USER.subscriptionBillingExp = exp;
    withLoading(() => { AppStore.save(); toast('Billing card updated'); back(); });
}

function savePersonalInfo() {
    const fullName = fieldVal('fullName')?.trim();
    if (!validateFields([['fullName', 'Full Name', v => v], ['email', 'Email', v => v]])) return;
    const { firstName, lastName } = typeof splitFullName === 'function' ? splitFullName(fullName) : { firstName: fullName, lastName: '' };
    if (STATE.userRole === 'contractor' && typeof CONTRACTOR_USER !== 'undefined') {
        CONTRACTOR_USER.firstName = firstName;
        CONTRACTOR_USER.lastName = lastName;
        CONTRACTOR_USER.email = fieldVal('email');
        CONTRACTOR_USER.phone = fieldVal('phone') || CONTRACTOR_USER.phone;
        const ctrAccount = typeof contractorAccountByEmail === 'function' ? contractorAccountByEmail(CONTRACTOR_USER.email) : null;
        if (ctrAccount) {
            ctrAccount.firstName = firstName;
            ctrAccount.lastName = lastName;
            ctrAccount.email = CONTRACTOR_USER.email;
            ctrAccount.phone = CONTRACTOR_USER.phone;
            if (typeof saveContractorAccounts === 'function') saveContractorAccounts();
        }
        withLoading(() => { AppStore.save(); toast('Profile updated'); back(); });
        return;
    }
    LANDLORD_USER.firstName = firstName;
    LANDLORD_USER.lastName = lastName;
    LANDLORD_USER.email = fieldVal('email');
    LANDLORD_USER.phone = fieldVal('phone') || LANDLORD_USER.phone;
    LANDLORD_USER.address = fieldVal('address') || LANDLORD_USER.address;
    const landlordAccount = typeof landlordAccountByEmail === 'function' ? landlordAccountByEmail(LANDLORD_USER.email) : null;
    if (landlordAccount) {
        landlordAccount.firstName = firstName;
        landlordAccount.lastName = lastName;
        landlordAccount.email = LANDLORD_USER.email;
        if (typeof saveLandlordAccounts === 'function') saveLandlordAccounts();
    }
    withLoading(() => { AppStore.save(); toast('Profile updated'); back(); });
}

function savePassword() {
    clearFormErrors();
    const current = fieldVal('currentPassword');
    const next = fieldVal('newPassword');
    const confirm = fieldVal('confirmPassword');
    let account;
    let expected;
    if (STATE.userRole === 'contractor' && typeof CONTRACTOR_USER !== 'undefined') {
        account = typeof contractorAccountByEmail === 'function' ? contractorAccountByEmail(CONTRACTOR_USER.email) : null;
        expected = account?.password || DEMO_CREDENTIALS.contractor.password;
    } else if (STATE.userRole === 'tenant') {
        const tenantEmail = typeof getActiveTenant === 'function' ? getActiveTenant()?.email : DEMO_CREDENTIALS.tenant.email;
        account = typeof tenantAccountByEmail === 'function' ? tenantAccountByEmail(tenantEmail) : null;
        expected = account?.password || DEMO_CREDENTIALS.tenant.password;
    } else {
        account = landlordAccountByEmail(LANDLORD_USER.email);
        expected = account?.password || DEMO_CREDENTIALS.landlord.password;
    }
    let ok = true;
    if (!current) { STATE.formErrors.currentPassword = 'Current password is required'; ok = false; }
    else if (current !== expected) { STATE.formErrors.currentPassword = 'Current password is incorrect'; ok = false; }
    if (!next || next.length < 8) { STATE.formErrors.newPassword = 'Use at least 8 characters'; ok = false; }
    if (next !== confirm) { STATE.formErrors.confirmPassword = 'Passwords do not match'; ok = false; }
    if (!ok) { toastError('Please fix the errors below'); render(); return; }
    if (account) account.password = next;
    if (STATE.userRole === 'contractor') {
        if (typeof saveContractorAccounts === 'function') saveContractorAccounts();
    } else if (STATE.userRole === 'tenant') {
        if (typeof saveTenantData === 'function') saveTenantData();
    } else {
        saveLandlordAccounts();
    }
    withLoading(() => { toast('Password updated'); back(); });
}

function savePreference(opt) {
    const pref = PREF_OPTIONS[STATE.prefKey];
    if (pref) pref.current = opt;
    withLoading(() => { AppStore.save(); toast(`${pref.title} updated`); back(); });
}

function saveTenantNote(isEdit = false) {
    if (!validateFields([['noteText', 'Note', v => v]])) return;
    const tid = STATE.tenantId ?? 0;
    const notes = getTenantNotes(tid);
    const palettes = [['#FFFBEB', '#D97706'], ['#EFF6FF', '#2563EB'], ['#ECFDF5', '#059669']];
    const [bg, color] = palettes[notes.length % palettes.length];
    const meta = `${new Date().toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })} · You`;
    if (isEdit) {
        const note = notes.find(n => n.id === STATE.noteId);
        if (note) { note.text = fieldVal('noteText'); note.meta = meta; }
    } else {
        notes.unshift({
            id: AppStore.nextId(notes),
            text: fieldVal('noteText'),
            meta,
            bg,
            color,
        });
    }
    withLoading(() => { AppStore.save(); toast(isEdit ? 'Note updated' : 'Note added'); go('tenant-detail', { tenantId: tid, tenantTab: 'notes' }); });
}

function markAllNotificationsRead() {
    if (STATE.userRole === 'tenant') {
        const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
        (AppStore.tenantNotifications?.[tid] || []).forEach(n => { n.unread = false; });
        TENANT_NOTIFICATIONS.forEach(n => { n.unread = false; });
    } else {
        NOTIFICATIONS.forEach(n => { n.unread = false; });
    }
    AppStore.save();
    toast('All marked as read');
    render();
}

function downloadDocument() {
    const doc = AppStore.documents.find(d => d.id === STATE.previewDocId);
    const fileName = doc?.name || 'document';
    if (doc?.fileUrl) {
        const a = document.createElement('a');
        a.href = doc.fileUrl;
        a.download = fileName;
        a.click();
    }
    toast(`Downloading ${fileName}…`);
}

function downloadInspectionReport() {
    const report = inspectionById(STATE.inspectionId);
    const name = report?.report || 'Inspection report.pdf';
    toast(`Downloading ${name}…`);
}

function shareDocumentPreview() {
    if (navigator.share) {
        navigator.share({ title: 'Lease Agreement', text: 'Shared from Landlord HQ' }).catch(() => toast('Document shared'));
    } else {
        toast('Document shared with tenant');
    }
}

function uploadTenantDocument() {
    const tid = STATE.tenantId ?? 0;
    const t = TENANT_LIST[tid];
    if (!t) { toast('Tenant not found'); return; }
    openAddDocumentFlow({ propertyId: t.propertyId, unit: t.unit, tenantId: tid });
}

function openFlatDocumentUpload(propertyId, unit) {
    if (propertyId != null) STATE.propertyId = propertyId;
    if (unit) STATE.selectedUnit = unit;
    const lead = TENANT_LIST.find(x => x.propertyId === propertyId && x.unit === unit && x.status === 'active');
    openAddDocumentFlow({ propertyId, unit, tenantId: lead?.id ?? null });
}

async function uploadNidProof(side = 'front') {
    const files = await pickDocumentFiles({ multiple: false });
    if (!files.length) return;
    const fileName = files[0].name;
    if (!STATE.inviteDraft) STATE.inviteDraft = {};
    if (side === 'back') {
        STATE.nidProofBackName = fileName;
        STATE.inviteDraft.nidProofBackName = fileName;
    } else {
        STATE.nidProofFrontName = fileName;
        STATE.inviteDraft.nidProofFrontName = fileName;
        STATE.nidProofName = fileName;
        STATE.inviteDraft.nidProofName = fileName;
    }
    if (STATE.screen === 'edit-tenant' && STATE.tenantId != null) {
        const t = TENANTS[STATE.tenantId];
        if (t) {
            if (side === 'back') t.nidProofBack = fileName;
            else t.nidProofFront = fileName;
            t.nidProof = inviteNidProofSummary(STATE.inviteDraft) || fileName;
        }
        ensureTenantNidProof(STATE.tenantId, inviteNidProofSummary(STATE.inviteDraft) || fileName, {
            front: STATE.nidProofFrontName || STATE.inviteDraft.nidProofFrontName || '',
            back: STATE.nidProofBackName || STATE.inviteDraft.nidProofBackName || '',
        });
        AppStore.save();
    }
    toast(side === 'back' ? 'ID back uploaded' : 'ID front uploaded');
    render();
}

const _screenPropertyDetailBase = SCREEN_MAP['property-detail'];
function screenPropertyDetailWithSkeleton() {
    if (showScreenSkeleton('property-detail')) return renderPropertyDetailSkeleton();
    return _screenPropertyDetailBase();
}

function screenTenantAddNote() {
    const tid = STATE.tenantId ?? 0;
    const tenant = TENANT_LIST[tid];
    return `${topBar('Add note', { back: true, sub: tenant?.name || '' })}
    <div class="screen-content screen-enter">
        <p class="ux-intro">Private landlord note — visible on this tenant's profile and activity.</p>
        ${formTextarea('Note', '', 'Communication preferences, reminders, lease discussions…', 'noteText')}
        <button data-action="save" class="btn-primary w-full py-3.5 text-[14px]">Save note</button>
    </div>`;
}

function screenTenantEditNote() {
    const note = getTenantNotes(STATE.tenantId ?? 0).find(n => n.id === STATE.noteId);
    const tenant = TENANT_LIST[STATE.tenantId ?? 0];
    return `${topBar('Edit note', { back: true, sub: tenant?.name || '' })}
    <div class="screen-content screen-enter">
        ${formTextarea('Note', note?.text || '', 'Edit note…', 'noteText')}
        <button data-action="save" class="btn-primary w-full py-3.5 text-[14px]">Update note</button>
    </div>`;
}

function assignContractorToJob(cid) {
    const item = maintItem(STATE.assignMaintId ?? STATE.maintId);
    const c = CONTRACTORS[cid];
    if (!item || !c) return;
    ensureMaintPaidBy(item);
    const tenant = getMaintTenantForItem(item);
    item.contractor = c.name;
    if (item.status === 'open') {
        item.status = 'progress';
        addMaintHistoryEvent(item, 'Contractor assigned', `${c.name} · job sent to contractor app`);
        addMaintHistoryEvent(item, 'Work in progress', 'Awaiting contractor visit');
    } else {
        addMaintHistoryEvent(item, 'Contractor reassigned', c.name);
    }
    createContractorJobFromMaintenance(item, c, tenant);
    if (typeof ensureContractorConversation === 'function') ensureContractorConversation(c);
    if (tenant) {
        pushNotification({
            icon: 'wrench', color: ['#DBEAFE', '#2563EB'],
            title: 'Contractor assigned', desc: `${c.name} assigned to ${item.issue}`,
            time: 'Just now', unread: true, screen: 'maintenance-detail', opts: { mid: item.id },
        });
    }
    AppStore.save();
    toast(isCommunalMaint(item) ? `${c.name} assigned to communal job` : `${c.name} assigned — they'll see the tenant complaint`);
    if (STATE.screen === 'assign-contractor') {
        render();
        return;
    }
    go('maintenance-detail', { maintId: item.id });
}

function createContractorJobFromMaintenance(item, contractor, tenantOverride) {
    if (typeof CONTRACTOR_JOBS === 'undefined') return;
    const p = PROPERTIES[item.propertyId];
    const tenant = tenantOverride || getMaintTenantForItem(item);
    const tenantName = tenant?.name || item.tenantName || '—';
    const existing = CONTRACTOR_JOBS.find(j => j.maintId === item.id);
    const complaintBlock = item.desc ? `\n\nTenant report: ${item.desc}` : '';
    const jobData = {
        maintId: item.id,
        propertyId: item.propertyId,
        property: p?.name || item.prop,
        address: p?.address || '',
        unit: item.unit && item.unit !== '—' ? item.unit : '',
        scope: item.scope || (item.unit === 'Communal' ? 'communal' : 'unit'),
        communalArea: item.communalArea || null,
        tenant: tenantName,
        landlord: `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`,
        issue: item.issue,
        priority: item.priority,
        visitDate: 'Not scheduled',
        status: 'assigned',
        assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        desc: `${item.desc || item.issue}${complaintBlock}`.trim(),
        contractorName: contractor.name,
        tenantChatId: tenant?.chatId ?? (tenant?.id != null ? getTenantChatId(tenant.id) : null),
        landlordChatId: typeof getLandlordChatId === 'function' ? getLandlordChatId() : null,
        reportPhotos: [...getMaintReportPhotos(item)],
        reportVideos: [...getMaintReportVideos(item)],
        reportedBy: item.reportedBy || (item.tenantName ? 'tenant' : 'landlord'),
        paidBy: getMaintPaidBy(item),
    };
    if (existing) {
        Object.assign(existing, jobData, { id: existing.id });
        if (typeof ensureContractorJob === 'function') ensureContractorJob(existing);
    } else {
        const job = { id: AppStore.nextId(CONTRACTOR_JOBS), ...jobData };
        if (typeof ensureContractorJob === 'function') ensureContractorJob(job);
        CONTRACTOR_JOBS.unshift(job);
    }
    if (typeof saveContractorJobs === 'function') saveContractorJobs();
    else {
        AppStore.contractorJobs = JSON.parse(JSON.stringify(CONTRACTOR_JOBS));
    }
}

function getLandlordChatId() {
    const name = `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`;
    let conv = CONVERSATIONS.find(c => c.name === name);
    if (!conv) {
        const id = AppStore.nextId(CONVERSATIONS);
        conv = {
            id, img: IMG.avatar.john, name, sub: 'Property owner',
            preview: 'Coordinate jobs and access', time: 'Now', unread: 0, online: true,
            messages: [],
        };
        CONVERSATIONS.unshift(conv);
        syncConversationsToStore();
    }
    return conv.id;
}

function ensureLandlordConversation(invite) {
    const id = getLandlordChatId();
    const conv = CONVERSATIONS.find(c => c.id === id);
    if (conv) {
        conv.sub = 'Your landlord';
        if (!conv.messages?.length) {
            conv.messages = [{
                type: 'in',
                text: `Welcome! I'm ${LANDLORD_USER.firstName}, your landlord. Message me if you need anything.`,
                time: 'Now',
            }];
            conv.preview = conv.messages[0].text;
            syncConversationsToStore();
        }
    }
    return id;
}

function markInvoicePaid(iid) {
    const inv = INVOICES.find(i => i.id === iid);
    if (inv) {
        stampInvoicePaid(inv);
        syncTransactionsFromInvoices();
        pushNotification({
            icon: 'banknote', color: ['#ECFDF5', '#16A34A'],
            title: 'Payment recorded', desc: `${inv.amount} · ${inv.tenant || inv.prop.split(',')[0]}`,
            time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid },
        });
        AppStore.save();
        toast('Payment recorded — download receipt below');
        go('invoice-detail', { invoiceId: iid });
    }
}

function payContractorInvoice(cid) {
    payMaintViaStripe(cid);
}

function shareDocumentConfirm() {
    const doc = AppStore.documents.find(d => d.id === STATE.shareDocId);
    if (!doc) return;
    const selected = [...document.querySelectorAll('[data-share-target]:checked')].map(el => +el.dataset.shareTarget);
    const targets = selected.length ? selected : getDocumentShareTargets(doc.propertyId, doc.unit).map(t => t.id);
    doc.shared = true;
    syncSharedDocToTenants(doc, targets);
    targets.forEach(tid => {
        const t = TENANT_LIST.find(x => x.id === tid);
        if (t) {
            pushNotification({
                icon: 'file-text', color: ['#EFF6FF', '#2563EB'],
                title: 'New document shared', desc: `${doc.name} · ${PROPERTIES[doc.propertyId]?.name}`,
                time: 'Just now', unread: true, screen: 'tenant-detail', opts: { tid, tenantTab: 'documents' },
            });
        }
    });
    AppStore.save();
    toast(targets.length ? `Shared with ${targets.length} tenant${targets.length === 1 ? '' : 's'}` : 'Document marked as shared');
    back();
}

function saveUnitUtilities() {
    const unit = STATE.selectedUnit;
    if (!unit) { toast('Unit not selected'); return; }
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    util.responsibility = fieldVal('util_responsibility') || 'tenant';
    util.includedBills = [...document.querySelectorAll('[data-util-bill]:checked')].map(el => el.dataset.utilBill);
    util.monthlyAllowance = fieldVal('util_allowance') || util.monthlyAllowance || '';
    util.meters = {
        electricity: fieldVal('meter_electricity') || '',
        gas: fieldVal('meter_gas') || '',
        water: fieldVal('meter_water') || '',
    };
    AppStore.save();
    toast('Unit utilities saved');
    back();
}

function addCustomUtilityType() {
    const unit = STATE.selectedUnit;
    if (!unit) return;
    const name = fieldVal('custom_util_name')?.trim();
    if (!name) { toast('Enter a utility name'); return; }
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    util.customUtilities.push({ name, paidBy: fieldVal('custom_util_payer') || 'tenant' });
    AppStore.save();
    toast(`${name} added`);
    render();
}

function removeCustomUtilityType(idx) {
    const unit = STATE.selectedUnit;
    if (!unit) return;
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    util.customUtilities.splice(idx, 1);
    AppStore.save();
    render();
}

function chargeUtilityOverage() {
    const unit = STATE.selectedUnit;
    if (!unit) { toast('Unit not selected'); return; }
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    const amountRaw = fieldVal('overage_amount')?.trim();
    const period = fieldVal('overage_period')?.trim() || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const amountNum = parseInvoiceAmount(amountRaw);
    if (!amountNum) { toast('Enter overage amount'); return; }
    const amount = formatInvoiceAmount(amountNum);
    const tenant = TENANT_LIST.find(t => t.propertyId === STATE.propertyId && t.unit === unit && t.status === 'active');
    if (!tenant) { toast('No active tenant on this unit'); return; }
    const dueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const iid = AppStore.nextId(INVOICES);
    INVOICES.unshift({
        id: iid, num: `INV-${new Date().getFullYear()}-${1000 + iid}`,
        prop: PROPERTIES[STATE.propertyId]?.name || '', unit, tenant: tenant.name, tenantId: tenant.id,
        propertyId: STATE.propertyId, amount, status: 'Pending', due: dueDate, month: period,
        type: 'bill', desc: `Utility overage · ${period}`,
    });
    if (!util.overageCharges) util.overageCharges = [];
    util.overageCharges.unshift({ amount, period, status: 'Pending', date: 'Just now', invoiceId: iid });
    if (typeof syncTransactionsFromInvoices === 'function') syncTransactionsFromInvoices();
    pushNotification({
        icon: 'zap', color: ['#FEF3C7', '#D97706'],
        title: 'Utility overage bill', desc: `${amount} · ${unit}`,
        time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid },
    });
    if (typeof pushTenantNotification === 'function') {
        pushTenantNotification(tenant.id, {
            category: 'charge', icon: 'zap', color: ['#FEF3C7', '#D97706'],
            title: 'Utility overage bill', desc: `${amount} · due ${dueDate}`,
            time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid, tenantPayFilter: 'maintenance' },
        });
    }
    AppStore.save();
    toast(`Bill sent to ${tenant.name.split(' ')[0]} — pay via Stripe in tenant app`);
    render();
}

async function uploadUnitUtilityDoc() {
    const unit = STATE.selectedUnit;
    if (!unit) return;
    const files = await pickDocumentFiles({ multiple: false });
    if (!files.length) return;
    const file = files[0];
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    if (!util.uploads) util.uploads = [];
    util.uploads.unshift({
        name: file.name,
        by: STATE.userRole === 'tenant' ? 'Tenant' : 'Landlord',
        date: 'Just now',
        fileUrl: file.url,
        mime: file.mime,
    });
    AppStore.save();
    toast('Utility document uploaded');
    render();
}

function previewUnitUtilDocAction(idx) {
    const unit = STATE.selectedUnit;
    if (!unit || idx == null) return;
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    if (!util.uploads?.[idx]) {
        toast('Document not found');
        return;
    }
    STATE.previewDocSource = 'unit-util';
    STATE.previewUtilDocIdx = idx;
    STATE.previewDocId = null;
    go('document-preview', { propertyId: STATE.propertyId, unit, noHistory: false });
}

function uploadFlatPhotoAction() {
    const unit = STATE.selectedUnit;
    if (!unit || STATE.propertyId == null) return;
    pickImageFiles({ multiple: true }).then(urls => {
        if (!urls.length) return;
        ensureFlatPhotos(STATE.propertyId);
        appendFlatPhotos(STATE.propertyId, unit, urls);
        AppStore.save();
        toast(urls.length === 1 ? 'Photo added' : `${urls.length} photos added`);
        render();
    });
}

function setPendingFlatCoverAction(idx) {
    if (!STATE.pendingFlatPhotos?.length) return;
    STATE.pendingFlatCover = idx;
    toast('Cover photo updated');
    render();
}

function removePendingFlatPhotoAction(idx) {
    if (!STATE.pendingFlatPhotos?.length || idx < 0 || idx >= STATE.pendingFlatPhotos.length) return;
    STATE.pendingFlatPhotos.splice(idx, 1);
    if (!STATE.pendingFlatPhotos.length) STATE.pendingFlatCover = 0;
    else if (STATE.pendingFlatCover >= STATE.pendingFlatPhotos.length) {
        STATE.pendingFlatCover = STATE.pendingFlatPhotos.length - 1;
    }
    render();
}

function setFlatCoverAction(idx) {
    const unit = STATE.selectedUnit;
    if (!unit || STATE.propertyId == null) return;
    setFlatCoverIndex(STATE.propertyId, unit, idx);
    AppStore.save();
    toast('Cover photo updated');
    render();
}

function removeFlatPhotoAction(idx) {
    const unit = STATE.selectedUnit;
    if (!unit || STATE.propertyId == null) return;
    removeFlatPhotoAt(STATE.propertyId, unit, idx);
    AppStore.save();
    toast('Photo removed');
    render();
}

function captureAlarmDraftFromForm(meta) {
    if (!meta.alarms) meta.alarms = {};
    ['smoke', 'heat', 'co'].forEach(k => {
        meta.alarms[k] = readAlarmFieldsFromDom(k);
    });
    const customIndices = [...document.querySelectorAll('[data-field^="custom_alarm_name_"]')]
        .map(el => +String(el.dataset.field).replace('custom_alarm_name_', ''))
        .filter(n => !Number.isNaN(n));
    meta.customAlarms = customIndices.map(i => ({
        name: fieldVal(`custom_alarm_name_${i}`).trim(),
        location: fieldVal(`custom_alarm_location_${i}`).trim(),
        expiry: fieldVal(`custom_alarm_expiry_${i}`),
        makeModel: fieldVal(`custom_alarm_${i}_make`),
        description: fieldVal(`custom_alarm_${i}_desc`),
        photo: fieldVal(`custom_alarm_${i}_photo`),
        reminderTiming: fieldVal(`custom_alarm_${i}_reminder_timing`) || '30',
        reminderDate: computeReminderDate(
            fieldVal(`custom_alarm_expiry_${i}`),
            fieldVal(`custom_alarm_${i}_reminder_timing`) || '30',
            fieldVal(`custom_alarm_${i}_reminder_date`),
        ),
    }));
}

function addCustomAlarmRow() {
    if (STATE.propertyId == null) return;
    const meta = AppStore.meta(STATE.propertyId);
    captureAlarmDraftFromForm(meta);
    if (!meta.customAlarms) meta.customAlarms = [];
    meta.customAlarms.push({ name: '', location: '', expiry: '', reminderTiming: '30' });
    AppStore.save();
    toast('New alarm added — enter details below');
    render();
    requestAnimationFrame(() => {
        const inputs = document.querySelectorAll('.alarm-edit-card [data-field^="custom_alarm_name_"]');
        const last = inputs[inputs.length - 1];
        last?.focus?.();
        last?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    });
}

function removeCustomAlarmRow(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.customAlarms?.[idx]) return;
    const doRemove = () => {
        captureAlarmDraftFromForm(meta);
        meta.customAlarms.splice(idx, 1);
        AppStore.save();
        toast('Alarm removed');
        render();
    };
    if (typeof confirmAction === 'function') {
        confirmAction('Remove this alarm?', doRemove);
    } else doRemove();
}

function addApplianceRow() {
    if (STATE.propertyId == null) return;
    const meta = AppStore.meta(STATE.propertyId);
    meta.appliances.push({ name: '', brand: '', condition: 'Good' });
    AppStore.save();
    toast('Custom appliance added — enter a name below');
    render();
    requestAnimationFrame(() => {
        const inputs = document.querySelectorAll('.appliance-edit-card [data-field^="app_name_"]');
        const last = inputs[inputs.length - 1];
        last?.focus?.();
        last?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    });
}

function quickAddAppliance(name) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.appliances) meta.appliances = [];
    if (meta.appliances.some(a => a.name.toLowerCase() === String(name).toLowerCase())) {
        toast('Already on your list');
        return;
    }
    meta.appliances.push({ name, brand: '', condition: 'Good' });
    AppStore.save();
    toast(`${name} added`);
    go('property-appliances', { propertyId: STATE.propertyId });
}

function toggleUtilityType(key) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.utilities) meta.utilities = {};
    const label = utilityCatalogItem(key)?.label || key;
    if (meta.utilities[key] != null) {
        delete meta.utilities[key];
        toast(`${label} removed`);
    } else {
        meta.utilities[key] = '';
        toast(`${label} added — choose a provider`);
    }
    AppStore.save();
    go('property-utilities', { propertyId: STATE.propertyId });
}

function removeApplianceRow(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.appliances?.[idx]) return;
    const doRemove = () => {
        meta.appliances.splice(idx, 1);
        AppStore.save();
        toast('Appliance removed');
        go('property-appliances', { propertyId: STATE.propertyId });
    };
    if (meta.appliances.length <= 1) {
        showConfirm('Remove appliance', 'Remove the last appliance from this property?', doRemove, { okLabel: 'Remove', danger: true });
        return;
    }
    doRemove();
}

function uploadPendingFlatPhotoAction() {
    pickImageFiles({ multiple: true }).then(urls => {
        if (!urls.length) return;
        if (!STATE.pendingFlatPhotos) STATE.pendingFlatPhotos = [];
        STATE.pendingFlatPhotos.push(...urls);
        if (STATE.pendingFlatPhotos.length && (STATE.pendingFlatCover == null || STATE.pendingFlatCover < 0)) {
            STATE.pendingFlatCover = 0;
        }
        toast(urls.length === 1 ? 'Photo added' : `${urls.length} photos added`);
        render();
    });
}

async function uploadDocumentAction() {
    openAddDocumentFlow();
}

async function uploadMaintMediaAction() {
    const { images, videos } = await pickMaintMediaFiles();
    if (!images.length && !videos.length) return;
    if (STATE.screen === 'log-maintenance') {
        if (images.length) {
            if (!STATE.logMaintPhotos) STATE.logMaintPhotos = [];
            STATE.logMaintPhotos.push(...images);
        }
        if (videos.length) {
            if (!STATE.logMaintVideos) STATE.logMaintVideos = [];
            STATE.logMaintVideos.push(...videos);
        }
        const parts = [];
        if (images.length) parts.push(`${images.length} photo${images.length === 1 ? '' : 's'}`);
        if (videos.length) parts.push(`${videos.length} video${videos.length === 1 ? '' : 's'}`);
        toast(`Added ${parts.join(' and ')}`);
        render();
    }
}

async function uploadPhotoAction() {
    const urls = await pickImageFiles({ multiple: true });
    if (!urls.length) return;
    const meta = AppStore.meta(STATE.propertyId);
    if (STATE.screen === 'add-property') {
        if (!STATE.pendingPropertyPhotos) STATE.pendingPropertyPhotos = [];
        STATE.pendingPropertyPhotos.push(...urls);
        toast(urls.length === 1 ? 'Photo added' : `${urls.length} photos added`);
        render();
        return;
    }
    if (STATE.screen === 'log-maintenance') {
        if (!STATE.logMaintPhotos) STATE.logMaintPhotos = [];
        STATE.logMaintPhotos.push(...urls);
        toast(urls.length === 1 ? 'Photo added to issue' : `${urls.length} photos added to issue`);
        render();
        return;
    }
    if (STATE.screen === 'tenant-checkout') {
        const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
        const co = getTenantCheckout(tid);
        co.photos.push(...urls);
        AppStore.save();
        toast(urls.length === 1 ? 'Checkout photo added' : `${urls.length} checkout photos added`);
        render();
        return;
    }
    if (STATE.screen === 'conduct-inspection') {
        if (!STATE.inspectionPhotos) STATE.inspectionPhotos = [];
        STATE.inspectionPhotos.push(...urls);
        toast(urls.length === 1 ? 'Inspection photo added' : `${urls.length} inspection photos added`);
        render();
        return;
    }
    if (STATE.screen === 'edit-inventory-room' || STATE.screen === 'inventory-room') {
        const key = inventoryKey(STATE.propertyId, STATE.roomId ?? 0);
        if (!AppStore.inventory[key]) AppStore.inventory[key] = { condition: 'Good', notes: '', items: [], photos: [] };
        if (!AppStore.inventory[key].photos) AppStore.inventory[key].photos = [];
        AppStore.inventory[key].photos.push(...urls);
        AppStore.save();
        toast(urls.length === 1 ? 'Room photo added' : `${urls.length} room photos added`);
        render();
        return;
    }
    if (!meta.photos) meta.photos = [IMG.props[STATE.propertyId]];
    meta.photos.push(...urls);
    AppStore.save();
    toast(urls.length === 1 ? 'Photo added' : `${urls.length} photos added`);
    render();
}

async function uploadVideoAction() {
    const urls = await pickVideoFiles();
    if (!urls.length) return;
    if (STATE.screen === 'log-maintenance') {
        if (!STATE.logMaintVideos) STATE.logMaintVideos = [];
        STATE.logMaintVideos.push(...urls);
        toast(urls.length === 1 ? 'Video added to issue' : `${urls.length} videos added to issue`);
        render();
        return;
    }
    if (STATE.screen === 'tenant-checkout') {
        const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
        const co = getTenantCheckout(tid);
        co.photos.push(...urls);
        AppStore.save();
        toast('Checkout media added');
        render();
    }
}

function removePhotoFromList(list, idx) {
    if (!list || idx < 0 || idx >= list.length) return;
    list.splice(idx, 1);
    render();
}

function setCoverPhoto(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.photos?.[idx]) return;
    const [photo] = meta.photos.splice(idx, 1);
    meta.photos.unshift(photo);
    AppStore.save();
    STATE.photoMenuIdx = null;
    toast('Cover photo updated');
    render();
}

function deletePropertyPhoto(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.photos || meta.photos.length <= 1) {
        toast('Keep at least one photo');
        return;
    }
    STATE.photoMenuIdx = null;
    showConfirm('Remove Photo', 'Remove this photo from the property gallery?', () => {
        meta.photos.splice(idx, 1);
        AppStore.save();
        toast('Photo removed');
        render();
    }, { okLabel: 'Remove', danger: true });
}

function editDocumentAction(docId) {
    const doc = AppStore.documents.find(d => d.id === docId);
    if (!doc) { toast('Document not found'); return; }
    STATE.renameDocId = docId;
    STATE.renameDocValue = doc.name;
    render();
}

function confirmRenameDoc() {
    const doc = AppStore.documents.find(d => d.id === STATE.renameDocId);
    const input = document.querySelector('[data-rename-doc-input]');
    const next = input?.value?.trim();
    if (!doc) { STATE.renameDocId = null; render(); return; }
    if (!next) { toast('Name cannot be empty'); return; }
    if (next === doc.name) { STATE.renameDocId = null; render(); return; }
    doc.name = next;
    AppStore.save();
    STATE.renameDocId = null;
    toast('Document renamed');
    render();
}

function deleteDocumentAction(docId) {
    const doc = AppStore.documents.find(d => d.id === docId);
    if (!doc) { toast('Document not found'); return; }
    showConfirm('Delete Document', `Delete ${doc.name}?`, () => {
        AppStore.documents = AppStore.documents.filter(d => d.id !== docId);
        AppStore.save();
        toast('Document deleted');
        if (STATE.screen === 'document-preview') back();
        else render();
    }, { okLabel: 'Delete', danger: true });
}

function deleteReminderAction(reminderId) {
    const reminder = AppStore.reminders.find(r => r.id === reminderId);
    if (!reminder) { toast('Reminder not found'); return; }
    const title = reminder.auto ? 'Remove synced reminder?' : 'Delete reminder?';
    const msg = reminder.auto
        ? 'This reminder is synced from property records and may reappear after the next sync. Remove it from your list anyway?'
        : `Remove "${reminder.title}"?`;
    showConfirm(title, msg, () => {
        AppStore.reminders = AppStore.reminders.filter(r => r.id !== reminderId);
        AppStore.save();
        toast(reminder.auto ? 'Reminder removed from list' : 'Reminder deleted');
        if (STATE.screen === 'reminder-detail') go('reminders', { reminderId: undefined });
        else render();
    }, { okLabel: reminder.auto ? 'Remove' : 'Delete', danger: true });
}

function deleteTenantNoteAction(noteId) {
    const notes = getTenantNotes(STATE.tenantId);
    const note = notes.find(n => n.id === noteId);
    if (!note) { toast('Note not found'); return; }
    showConfirm('Delete Note', 'Remove this note?', () => {
        AppStore.tenantNotes[STATE.tenantId] = notes.filter(n => n.id !== noteId);
        AppStore.save();
        toast('Note deleted');
        render();
    }, { okLabel: 'Delete', danger: true });
}

function cancelInviteAction(token) {
    const invite = tenantInviteByToken(token);
    if (!invite) { toast('Invitation not found'); return; }
    showConfirm('Cancel Invitation', `Cancel invite for ${invite.firstName} ${invite.lastName}?`, () => {
        invite.status = 'cancelled';
        const listItem = TENANT_LIST.find(t => t.propertyId === invite.propertyId && t.unit === invite.unit && t.status === 'pending');
        if (listItem) listItem.status = 'inactive';
        syncPropertyStatus(invite.propertyId);
        AppStore.save();
        toast('Invitation cancelled');
        render();
    }, { okLabel: 'Cancel invite', danger: true });
}

function removeMemberAction(propertyId, unitName, memberEmail, memberName) {
    const { tenancy, members } = getFlatMemberRoster(propertyId, unitName);
    const member = members.find(m =>
        (memberEmail && m.email?.toLowerCase() === memberEmail.toLowerCase()) ||
        (memberName && m.name === memberName)
    );
    if (!member) { toast('Member not found'); return; }
    if (tenancy?.type !== 'group' && member.tenantId != null) {
        go('checkout-tenancy', { tenantId: member.tenantId });
        return;
    }
    showConfirm('Remove member', `Remove ${member.name} from this unit?`, () => {
        const ten = getTenancyForUnit(propertyId, unitName);
        if (ten?.members?.length) {
            ten.members = ten.members.filter(m =>
                !((member.email && m.email?.toLowerCase() === member.email.toLowerCase()) || m.name === member.name)
            );
            if (member.isLead && ten.members.length) {
                ten.members[0].role = 'lead';
                ten.leadName = ten.members[0].name;
                ten.tenantId = ten.members[0].tenantId ?? ten.tenantId;
            }
        }
        if (member.inviteToken) {
            const inv = tenantInviteByToken(member.inviteToken);
            if (inv) inv.status = 'cancelled';
        }
        if (member.listId != null) {
            const listItem = TENANT_LIST.find(t => t.id === member.listId);
            if (listItem) listItem.status = 'inactive';
        }
        syncPropertyStatus(propertyId);
        AppStore.save();
        toast('Member removed');
        render();
    }, { okLabel: 'Remove', danger: true });
}

function cancelMaintenanceAction(maintId) {
    const item = maintItem(maintId);
    if (!item || item.status === 'done') { toast('Issue cannot be cancelled'); return; }
    showConfirm('Cancel Issue', `Cancel "${item.issue}"?`, () => {
        const idx = MAINTENANCE_ITEMS.findIndex(m => m.id === maintId);
        if (idx >= 0) MAINTENANCE_ITEMS.splice(idx, 1);
        AppStore.save();
        toast('Issue cancelled');
        go(STATE.userRole === 'tenant' ? 'tenant-issues' : 'maintenance');
    }, { okLabel: 'Cancel issue', danger: true });
}

function deleteInvoiceAction(invoiceId) {
    const inv = INVOICES.find(i => i.id === invoiceId);
    if (!inv) { toast('Invoice not found'); return; }
    if (inv.status === 'Paid') { toast('Paid invoices cannot be cancelled'); return; }
    showConfirm('Cancel Invoice', `Cancel ${inv.num}?`, () => {
        const idx = INVOICES.findIndex(i => i.id === invoiceId);
        if (idx >= 0) INVOICES.splice(idx, 1);
        if (typeof syncTransactionsFromInvoices === 'function') syncTransactionsFromInvoices();
        AppStore.save();
        toast('Invoice cancelled');
        go('financial');
    }, { okLabel: 'Cancel invoice', danger: true });
}

/* ─── Register screens & nav ─── */
const FEATURE_SCREENS = [
    'compliance-dashboard', 'reminders', 'add-reminder', 'edit-reminder', 'reminder-detail',
    'broadcast-notices', 'send-broadcast', 'broadcast-detail',
    'create-tenancy', 'checkout-tenancy', 'assign-contractor', 'conduct-inspection',
    'create-invoice', 'mark-rent-received', 'pay-contractor', 'share-document',
    'property-photos', 'property-floor-plans', 'property-alarms', 'property-appliances', 'property-utilities', 'property-parking', 'property-info', 'property-flat-documents', 'property-inspections', 'property-inventory', 'unit-utilities', 'edit-flat', 'add-flat', 'flat-detail', 'flat-members', 'flat-rent-history', 'tenancy-detail', 'edit-tenancy-deposit',
    'tenant-add-note', 'tenant-edit-note', 'maintenance-history', 'select-property-invite', 'global-search', 'contractors', 'invite-contractor', 'contractor-invite-sent', 'inspection-detail',
];

Object.assign(SCREEN_MAP, {
    'add-property': screenAddPropertyEnhanced,
    'compliance-dashboard': screenComplianceDashboard,
    'reminders': screenReminders,
    'add-reminder': screenAddReminder,
    'edit-reminder': screenEditReminder,
    'reminder-detail': screenReminderDetail,
    'broadcast-notices': screenBroadcastNotices,
    'send-broadcast': screenSendBroadcast,
    'broadcast-detail': screenBroadcastDetail,
    'create-tenancy': screenCreateTenancyEnhanced,
    'checkout-tenancy': screenCheckoutTenancy,
    'assign-contractor': screenAssignContractor,
    'conduct-inspection': screenConductInspection,
    'create-invoice': screenCreateInvoice,
    'mark-rent-received': screenMarkRentReceived,
    'pay-contractor': screenPayContractor,
    'share-document': screenShareDocument,
    'reschedule-inspection': screenRescheduleInspectionEnhanced,
    'property-photos': screenPropertyPhotos,
    'property-alarms': () => screenPropertyDetailsEdit('alarms'),
    'property-appliances': () => screenPropertyDetailsEdit('appliances'),
    'property-utilities': () => screenPropertyDetailsEdit('utilities'),
    'property-parking': () => screenPropertyDetailsEdit('parking'),
    'property-info': () => screenPropertyDetailsEdit('info'),
    'property-flat-documents': screenPropertyFlatDocuments,
    'property-inspections': screenPropertyInspections,
    'property-inventory': screenPropertyInventory,
    'edit-tenancy-deposit': screenEditTenancyDeposit,
    'unit-utilities': screenUnitUtilities,
    'edit-flat': screenEditFlat,
    'add-flat': screenAddFlat,
    'flat-detail': screenFlatDetail,
    'flat-members': screenFlatMembers,
    'flat-rent-history': screenFlatRentHistory,
    'tenancy-detail': screenTenancyDetail,
    'tenant-add-note': screenTenantAddNote,
    'tenant-edit-note': screenTenantEditNote,
    'maintenance-history': screenMaintenanceHistory,
    'maintenance': screenMaintenanceEnhanced,
    'maintenance-detail': screenMaintenanceDetailEnhanced,
    'financial': screenFinancialEnhanced,
    'transaction-history': screenTransactionHistoryEnhanced,
    'invite-tenant': screenInviteTenantEnhanced,
    'dashboard': screenDashboardEnhanced,
    'property-detail': screenPropertyDetailWithSkeleton,
    'tenants': screenTenantsEnhanced,
    'select-property-invite': screenSelectPropertyInvite,
    'global-search': screenGlobalSearch,
    'document-preview': screenDocumentPreviewEnhanced,
    'contractors': screenContractors,
    'invite-contractor': screenInviteContractor,
    'contractor-invite-sent': screenContractorInviteSent,
    'inspection-detail': screenInspectionDetail,
    'inventory-room': screenInventoryRoomEnhanced,
    'edit-inventory-room': screenEditInventoryRoomEnhanced,
});

NO_NAV.push(...FEATURE_SCREENS);

const FEATURE_BACK_MAP = {
    'compliance-dashboard': 'dashboard',
    'reminders': 'dashboard',
    'add-reminder': 'reminders',
    'edit-reminder': 'reminders',
    'reminder-detail': 'reminders',
    'broadcast-notices': 'dashboard',
    'send-broadcast': 'broadcast-notices',
    'broadcast-detail': 'broadcast-notices',
    'create-tenancy': 'property-detail',
    'checkout-tenancy': 'tenant-detail',
    'assign-contractor': 'maintenance-detail',
    'conduct-inspection': 'property-detail',
    'create-invoice': 'financial',
    'mark-rent-received': 'financial',
    'pay-contractor': 'financial',
    'share-document': 'property-detail',
    'property-photos': 'property-detail',
    'property-alarms': 'property-detail',
    'property-appliances': 'property-detail',
    'property-utilities': 'property-detail',
    'property-parking': 'property-detail',
    'property-info': 'property-detail',
    'property-flat-documents': 'property-detail',
    'property-inspections': 'property-detail',
    'property-inventory': 'property-detail',
    'edit-tenancy-deposit': 'tenancy-detail',
    'unit-utilities': 'property-detail',
    'edit-flat': 'flat-detail',
    'add-flat': 'property-detail',
    'flat-detail': 'property-detail',
    'flat-members': 'flat-detail',
    'flat-rent-history': 'flat-detail',
    'tenancy-detail': 'flat-detail',
    'tenant-add-note': 'tenant-detail',
    'tenant-edit-note': 'tenant-detail',
    'maintenance-history': 'maintenance',
    'select-property-invite': 'tenants',
    'global-search': 'dashboard',
    'contractors': 'dashboard',
    'invite-contractor': 'contractors',
    'contractor-invite-sent': 'contractors',
    'inspection-detail': 'property-inspections',
    'inventory-room': 'property-inventory',
    'property-doc-folder': 'property-detail',
    'tenant-invite-sent': 'property-detail',
    'tenants': 'dashboard',
    'profile': 'dashboard',
};


// Drawer nav defined in landlord_hq_screens.js (LANDLORD_DRAWER_NAV)

function bindNotifyPickerEvents(app) {
    if (app._notifyPickerBound) return;
    app._notifyPickerBound = true;
    app.addEventListener('change', (e) => {
        const master = e.target.closest('[data-notify-all], [data-share-all], [data-broadcast-all]');
        if (master) {
            const section = master.closest('.notify-tenant-section, .share-notify-section, .broadcast-audience');
            section?.querySelectorAll('[data-notify-target], [data-share-target], [data-broadcast-unit]').forEach(cb => { cb.checked = master.checked; });
            return;
        }
        const item = e.target.closest('[data-notify-target], [data-share-target], [data-broadcast-unit]');
        if (!item) return;
        const section = item.closest('.notify-tenant-section, .share-notify-section, .broadcast-audience');
        const masterEl = section?.querySelector('[data-notify-all], [data-share-all], [data-broadcast-all]');
        if (!masterEl) return;
        const boxes = section.querySelectorAll('[data-notify-target], [data-share-target], [data-broadcast-unit]');
        masterEl.checked = [...boxes].every(b => b.checked);
        masterEl.indeterminate = !masterEl.checked && [...boxes].some(b => b.checked);
    });
}

function bindFeatureEvents() {
    const app = document.getElementById('app');
    bindNotifyPickerEvents(app);
    app.querySelectorAll('[data-action="save-reminder"]').forEach(el => { el.onclick = saveReminder; });
    app.querySelectorAll('[data-action="save-tenancy"]').forEach(el => { el.onclick = saveTenancy; });
    app.querySelectorAll('[data-action="save-checkout"]').forEach(el => { el.onclick = saveCheckout; });
    app.querySelectorAll('[data-action="save-inspection"]').forEach(el => { el.onclick = saveInspection; });
    app.querySelectorAll('[data-action="save-invoice"]').forEach(el => { el.onclick = saveCreateInvoice; });
    app.querySelectorAll('[data-action="assign-contractor"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            assignContractorToJob(+el.dataset.cid);
        };
    });
    app.querySelectorAll('[data-action="pay-contractor"]').forEach(el => {
        el.onclick = () => payContractorInvoice(+el.dataset.cid);
    });
    app.querySelectorAll('[data-action="approve-maint-work"]').forEach(el => {
        el.onclick = () => approveMaintWork(+el.dataset.mid);
    });
    app.querySelectorAll('[data-action="pay-maint-stripe"]').forEach(el => {
        el.onclick = () => payMaintViaStripe(+el.dataset.cid);
    });
    app.querySelectorAll('[data-action="export-rent-pdf"]').forEach(el => { el.onclick = exportRentPdfReport; });
    app.querySelectorAll('[data-action="download-invoice-receipt"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadInvoiceReceipt(+el.dataset.iid);
        };
    });
    app.querySelectorAll('[data-action="send-contractor-invite"]').forEach(el => { el.onclick = sendContractorInvite; });
    app.querySelectorAll('[data-action="copy-contractor-invite-link"]').forEach(el => { el.onclick = copyContractorInviteLink; });
    app.querySelectorAll('[data-action="add-custom-utility"]').forEach(el => { el.onclick = addCustomUtilityType; });
    app.querySelectorAll('[data-action="remove-custom-utility"]').forEach(el => {
        el.onclick = () => removeCustomUtilityType(+el.dataset.utilIdx);
    });
    app.querySelectorAll('[data-action="charge-utility-overage"]').forEach(el => { el.onclick = chargeUtilityOverage; });
    app.querySelectorAll('[data-action="pick-rating-star"]').forEach(el => {
        el.onclick = () => {
            const n = +el.dataset.ratingStar;
            const group = el.dataset.ratingGroup
                ? app.querySelector(`[data-rating-group="${el.dataset.ratingGroup}"]`) || app
                : el.closest('[data-rating-group]') || app;
            group.querySelectorAll('[data-action="pick-rating-star"]').forEach(st => {
                const on = +st.dataset.ratingStar <= n;
                st.classList.toggle('active', on);
                st.style.color = on ? '#F59E0B' : '#CBD5E1';
            });
        };
    });
    app.querySelectorAll('[data-action="submit-contractor-rating"]').forEach(el => {
        el.onclick = () => {
            const mid = +el.dataset.mid;
            const group = app.querySelector(`[data-rating-group="${mid}"]`) || app;
            const active = group.querySelector('[data-action="pick-rating-star"].active');
            if (!active) { toast('Select a star rating'); return; }
            submitContractorRating(mid);
        };
    });
    app.querySelectorAll('[data-action="approve-milestone"]').forEach(el => {
        el.onclick = () => approveMaintMilestone(+el.dataset.mid);
    });
    app.querySelectorAll('[data-action="pay-milestone-stripe"]').forEach(el => {
        el.onclick = () => payMaintMilestoneStripe(+el.dataset.mid);
    });
    app.querySelectorAll('[data-action="confirm-share-doc"]').forEach(el => { el.onclick = shareDocumentConfirm; });
    app.querySelectorAll('[data-action="send-broadcast"]').forEach(el => { el.onclick = sendBroadcastNotice; });
    app.querySelectorAll('[data-action="upload-broadcast-image"]').forEach(el => { el.onclick = uploadBroadcastImageAction; });
    app.querySelectorAll('[data-action="remove-broadcast-image"]').forEach(el => {
        el.onclick = () => { STATE.broadcastDraftImage = null; render(); };
    });
    app.querySelectorAll('[data-broadcast-scope]').forEach(el => {
        el.onclick = () => {
            STATE.broadcastScope = el.dataset.broadcastScope;
            if (STATE.broadcastScope === 'units') {
                const pid = STATE.broadcastPropertyId ?? STATE.propertyId ?? 0;
                STATE.broadcastUnits = getPropertyUnits(pid).map(u => unitName(u));
            } else {
                STATE.broadcastUnits = [];
            }
            render();
        };
    });
    app.querySelectorAll('[data-broadcast-property]').forEach(el => {
        el.onchange = () => {
            STATE.broadcastPropertyId = +el.value;
            STATE.broadcastUnits = null;
            render();
        };
    });
    app.querySelectorAll('[data-action="save-unit-utilities"]').forEach(el => { el.onclick = saveUnitUtilities; });
    app.querySelectorAll('[data-action="upload-unit-utility"]').forEach(el => { el.onclick = uploadUnitUtilityDoc; });
    app.querySelectorAll('[data-action="preview-unit-util-doc"]').forEach(el => {
        el.onclick = () => previewUnitUtilDocAction(+el.dataset.idx);
    });
    app.querySelectorAll('[data-action="save-tenancy-deposit"]').forEach(el => { el.onclick = () => saveTenancyDeposit(); });
    app.querySelectorAll('[data-action="upload-flat-photo"]').forEach(el => { el.onclick = uploadFlatPhotoAction; });
    app.querySelectorAll('[data-action="add-appliance"]').forEach(el => {
        el.onclick = addApplianceRow;
    });
    app.querySelectorAll('[data-action="add-custom-alarm"]').forEach(el => {
        el.onclick = addCustomAlarmRow;
    });
    app.querySelectorAll('[data-action="remove-custom-alarm"]').forEach(el => {
        el.onclick = () => removeCustomAlarmRow(+el.dataset.alarmIdx);
    });
    app.querySelectorAll('[data-action="quick-add-appliance"]').forEach(el => {
        el.onclick = () => quickAddAppliance(el.dataset.pickValue);
    });
    app.querySelectorAll('[data-action="toggle-utility"]').forEach(el => {
        el.onclick = () => toggleUtilityType(el.dataset.pickValue);
    });
    app.querySelectorAll('[data-action="remove-appliance"]').forEach(el => {
        el.onclick = () => removeApplianceRow(+el.dataset.appIdx);
    });
    app.querySelectorAll('[data-action="upload-pending-flat-photo"]').forEach(el => {
        el.onclick = uploadPendingFlatPhotoAction;
    });
    app.querySelectorAll('[data-action="set-pending-flat-cover"]').forEach(el => {
        el.onclick = () => setPendingFlatCoverAction(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="remove-pending-flat-photo"]').forEach(el => {
        el.onclick = () => removePendingFlatPhotoAction(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="set-flat-cover"]').forEach(el => {
        el.onclick = () => setFlatCoverAction(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="remove-flat-photo"]').forEach(el => {
        el.onclick = () => removeFlatPhotoAction(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="refresh-maint-units"]').forEach(el => {
        el.onchange = () => {
            STATE.propertyId = +el.value;
            STATE.logMaintPrefill = null;
            STATE.selectedUnit = null;
            render();
        };
    });
    app.querySelectorAll('[data-action="refresh-invoice-units"]').forEach(el => {
        el.onchange = () => {
            STATE.propertyId = +el.value;
            render();
        };
    });
    app.querySelectorAll('[data-action="upload-document"]').forEach(el => { el.onclick = uploadDocumentAction; });
    app.querySelectorAll('[data-action="upload-photo"]').forEach(el => { el.onclick = uploadPhotoAction; });
    app.querySelectorAll('[data-action="upload-maint-media"]').forEach(el => { el.onclick = uploadMaintMediaAction; });
    app.querySelectorAll('[data-log-maint-step]').forEach(el => {
        el.onclick = () => setLogMaintStep(el.dataset.logMaintStep);
    });
    app.querySelectorAll('[data-action="upload-video"]').forEach(el => { el.onclick = uploadVideoAction; });
    app.querySelectorAll('[data-action="remove-pending-property-photo"]').forEach(el => {
        el.onclick = () => removePendingPropertyPhoto(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="set-pending-property-cover"]').forEach(el => {
        el.onclick = () => setPendingPropertyCover(+el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-add-property-units]').forEach(el => {
        el.onclick = () => setAddPropertyUnitMode(el.dataset.addPropertyUnits);
    });
    app.querySelectorAll('[data-action="remove-log-maint-photo"]').forEach(el => {
        el.onclick = () => removePhotoFromList(STATE.logMaintPhotos, +el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="remove-log-maint-video"]').forEach(el => {
        el.onclick = () => removePhotoFromList(STATE.logMaintVideos, +el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="preview-maint-media"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMaintMediaPreview(el);
        };
    });
    app.querySelectorAll('[data-action="close-maint-media-preview"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            closeMaintMediaPreview();
        };
    });
    app.querySelectorAll('[data-action="toggle-checkout-item"]').forEach(el => {
        el.onclick = () => {
            const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
            const co = getTenantCheckout(tid);
            co.checklist[el.dataset.key] = el.checked;
            AppStore.save();
        };
    });
    app.querySelectorAll('[data-action="save-checkout-meters"]').forEach(el => {
        el.onclick = () => {
            const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
            const co = getTenantCheckout(tid);
            co.meters.electricity = fieldVal('co_meter_electricity') || '';
            co.meters.gas = fieldVal('co_meter_gas') || '';
            co.meters.water = fieldVal('co_meter_water') || '';
            AppStore.save();
            toast('Meter readings saved');
        };
    });
    app.querySelectorAll('[data-action="submit-tenant-checkout"]').forEach(el => {
        el.onclick = () => {
            const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
            const co = getTenantCheckout(tid);
            const done = Object.values(co.checklist).filter(Boolean).length;
            if (done < TENANT_CHECKOUT_CHECKLIST.length) {
                toast('Complete the cleaning checklist first');
                return;
            }
            AppStore.save();
            toast('Check-out details submitted to your landlord');
            go('tenant-dashboard');
        };
    });
    app.querySelectorAll('[data-action="upload-tenant-ref"]').forEach(el => {
        el.onclick = async () => {
            const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
            const key = el.dataset.refKey;
            const urls = await pickImageFiles({ multiple: false });
            if (!urls.length) return;
            const ref = getTenantReferencing(tid);
            ref[key] = { status: 'pending', file: `${key}_upload.jpg`, date: 'Just now', preview: urls[0] };
            AppStore.save();
            toast('Document uploaded — pending landlord review');
            render();
        };
    });
    app.querySelectorAll('[data-action="remove-inspection-photo"]').forEach(el => {
        el.onclick = () => removePhotoFromList(STATE.inspectionPhotos, +el.dataset.photoIdx);
    });
    app.querySelectorAll('[data-action="remove-inventory-photo"]').forEach(el => {
        el.onclick = () => {
            const key = inventoryKey(STATE.propertyId, STATE.roomId ?? 0);
            const photos = AppStore.inventory[key]?.photos;
            if (!photos) return;
            photos.splice(+el.dataset.photoIdx, 1);
            AppStore.save();
            render();
        };
    });
    app.querySelectorAll('[data-action="toggle-inventory-layout-edit"]').forEach(el => {
        el.onclick = () => { STATE.editingInventoryLayout = !STATE.editingInventoryLayout; render(); };
    });
    app.querySelectorAll('[data-action="save-inventory-layout"]').forEach(el => {
        el.onclick = saveInventoryLayout;
    });
    app.querySelectorAll('[data-action="sync-inventory-layout-units"]').forEach(el => {
        el.onclick = () => {
            syncInventoryLayoutFromUnits(STATE.propertyId, true);
            STATE.editingInventoryLayout = true;
            toast('Pulled from unit details');
            render();
        };
    });
    app.querySelectorAll('[data-action="add-inventory-item"]').forEach(el => {
        el.onclick = () => addInventoryEditItem('');
    });
    app.querySelectorAll('[data-action="remove-inventory-item"]').forEach(el => {
        el.onclick = () => removeInventoryEditItem(+el.dataset.itemIdx);
    });
    app.querySelectorAll('[data-action="delete-property"]').forEach(el => { el.onclick = deleteProperty; });
    app.querySelectorAll('[data-action="delete-broadcast"]').forEach(el => { el.onclick = deleteBroadcast; });
    bindActionMenuEvents(app);
    app.querySelectorAll('[data-action="delete-flat"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (el.dataset.pid) STATE.propertyId = +el.dataset.pid;
            if (el.dataset.unit) STATE.selectedUnit = el.dataset.unit;
            deleteFlatAction();
        };
    });
    app.querySelectorAll('[data-action="delete-document"]').forEach(el => {
        el.onclick = () => deleteDocumentAction(+el.dataset.doc);
    });
    app.querySelectorAll('[data-reminder-filter]').forEach(el => {
        el.onclick = () => { STATE.reminderFilter = el.dataset.reminderFilter; render(); };
    });
    app.querySelectorAll('[data-action="edit-reminder"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); go('edit-reminder', { reminderId: +el.dataset.rid }); };
    });
    app.querySelectorAll('[data-action="delete-reminder"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); deleteReminderAction(+el.dataset.rid); };
    });
    app.querySelectorAll('[data-action="delete-tenant-note"]').forEach(el => {
        el.onclick = () => deleteTenantNoteAction(+el.dataset.nid);
    });
    app.querySelectorAll('[data-action="cancel-invite"]').forEach(el => {
        el.onclick = () => cancelInviteAction(el.dataset.token);
    });
    app.querySelectorAll('[data-action="cancel-maintenance"]').forEach(el => {
        el.onclick = () => cancelMaintenanceAction(+el.dataset.mid);
    });
    app.querySelectorAll('[data-action="delete-invoice"]').forEach(el => {
        el.onclick = () => deleteInvoiceAction(+el.dataset.iid);
    });
    app.querySelectorAll('[data-action="share-doc"]').forEach(el => {
        el.onclick = () => go('share-document', { shareDocId: +el.dataset.doc });
    });
    app.querySelectorAll('[data-action="new-message"]').forEach(el => {
        el.onclick = () => { STATE.newMessagePicker = true; render(); };
    });
    app.querySelectorAll('[data-action="save-preference"]').forEach(el => {
        el.onclick = () => savePreference(el.dataset.opt);
    });
    app.querySelectorAll('[data-action="mark-all-read"]').forEach(el => { el.onclick = markAllNotificationsRead; });
    app.querySelectorAll('[data-action="download-doc"]').forEach(el => { el.onclick = downloadDocument; });
    app.querySelectorAll('[data-action="download-inspection-report"]').forEach(el => { el.onclick = downloadInspectionReport; });
    app.querySelectorAll('[data-action="share-doc-preview"]').forEach(el => { el.onclick = shareDocumentPreview; });
    app.querySelectorAll('[data-action="remove-payment-method"]').forEach(el => { el.onclick = removePaymentMethod; });
    app.querySelectorAll('[data-action="upload-tenant-doc"]').forEach(el => { el.onclick = uploadTenantDocument; });
    app.querySelectorAll('[data-action="open-flat-document-upload"]').forEach(el => {
        el.onclick = () => openFlatDocumentUpload(+el.dataset.pid, el.dataset.unit);
    });
    app.querySelectorAll('[data-action="upload-nid-proof"]').forEach(el => {
        el.onclick = () => uploadNidProof(el.dataset.nidSide || 'front');
    });
    app.querySelectorAll('[data-action="invite-wizard-next"]').forEach(el => { el.onclick = advanceInviteWizard; });
    app.querySelectorAll('[data-action="invite-wizard-back"]').forEach(el => { el.onclick = retreatInviteWizard; });
    if (STATE.screen === 'invite-tenant' && (STATE.inviteStep || 1) === 3) {
        const unitSel = app.querySelector('[data-invite="unit"]');
        if (unitSel) unitSel.onchange = onInviteUnitChange;
    }
    if (STATE.screen === 'create-tenancy') {
        const unitSel = app.querySelector('[data-field="unit"]');
        if (unitSel) unitSel.onchange = onTenancyUnitChange;
    }
    app.querySelectorAll('[data-action="set-insp-rating"]').forEach(el => {
        el.onclick = () => setInspectionRating(+el.dataset.rating);
    });
    app.querySelectorAll('[data-action="edit-tenant-note"]').forEach(el => {
        el.onclick = () => go('tenant-edit-note', { tenantId: STATE.tenantId, noteId: +el.dataset.nid });
    });
    app.querySelectorAll('[data-action="save-property-meta"]').forEach(el => {
        el.onclick = () => savePropertyMeta(el.dataset.section);
    });
    app.querySelectorAll('[data-action="set-cover-photo"]').forEach(el => {
        el.onclick = () => setCoverPhoto(+el.dataset.idx);
    });
    app.querySelectorAll('[data-action="delete-photo"]').forEach(el => {
        el.onclick = () => deletePropertyPhoto(+el.dataset.idx);
    });
    app.querySelectorAll('[data-action="photo-menu"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); STATE.photoMenuIdx = +el.dataset.idx; render(); };
    });
    const typeSel = app.querySelector('[data-field="tenancyType"]');
    if (typeSel) typeSel.onchange = () => {
        const g = document.getElementById('group-fields');
        if (g) g.style.display = typeSel.value === 'group' ? 'block' : 'none';
    };
    app.querySelectorAll('[data-action="send-chat"]').forEach(el => { el.onclick = sendChatMessage; });
    const chatInput = app.querySelector('[data-chat-input]');
    if (chatInput) {
        chatInput.oninput = () => { STATE.chatDraft = chatInput.value; };
        chatInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); } };
    }
    app.querySelectorAll('[data-action="add-group-member"]').forEach(el => {
        el.onclick = addGroupMemberRow;
    });
    app.querySelectorAll('[data-tenant-maint-filter]').forEach(el => {
        el.onclick = () => { STATE.tenantMaintFilter = el.dataset.tenantMaintFilter; render(); };
    });
    app.querySelectorAll('[data-action="call-tenant"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const tid = el.dataset.tid != null ? +el.dataset.tid : STATE.tenantId;
            const t = TENANTS[tid];
            const phone = el.dataset.phone || t?.phone;
            if (phone) { window.location.href = `tel:${phone.replace(/\s/g, '')}`; }
            else toast('No phone number on file');
        };
    });
    app.querySelectorAll('[data-action="start-tenant-chat"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            startTenantChat(+el.dataset.tid);
        };
    });
    app.querySelectorAll('[data-action="email-tenant"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const tid = el.dataset.tid != null ? +el.dataset.tid : STATE.tenantId;
            const t = TENANTS[tid];
            if (t?.email) { window.location.href = `mailto:${t.email}`; }
            else toast('No email on file');
        };
    });
    app.querySelectorAll('[data-action="call-chat-contact"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const raw = conversation(STATE.chatId);
            const name = raw?.name || 'contact';
            const phone = typeof getChatContactPhone === 'function' ? getChatContactPhone(raw) : null;
            toast(`Calling ${name}…`);
            if (phone) window.location.href = `tel:${phone.replace(/\s/g, '')}`;
        };
    });
    app.querySelectorAll('[data-action="call-landlord"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (LANDLORD_USER.phone) window.location.href = `tel:${LANDLORD_USER.phone.replace(/\s/g, '')}`;
            else toast('No landlord phone on file');
        };
    });
    app.querySelectorAll('[data-action="email-landlord"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (LANDLORD_USER.email) window.location.href = `mailto:${LANDLORD_USER.email}`;
            else toast('No landlord email on file');
        };
    });
    app.querySelectorAll('[data-action="tenant-support-chat"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (typeof openTenantSupportChat === 'function') {
                openTenantSupportChat(el.dataset.supportTopic || 'general');
            }
        };
    });
    app.querySelectorAll('[data-action="call-contractor"]').forEach(el => {
        el.onclick = () => {
            const phone = el.dataset.phone;
            if (phone) window.location.href = `tel:${phone.replace(/\s/g, '')}`;
            else toast('No phone number on file');
        };
    });
    app.querySelectorAll('[data-action="email-contractor"]').forEach(el => {
        el.onclick = () => {
            const email = el.dataset.email;
            if (email) window.location.href = `mailto:${email}`;
            else toast('No email on file');
        };
    });
    app.querySelectorAll('[data-action="copy-contact"]').forEach(el => {
        el.onclick = () => {
            const text = el.dataset.text || el.textContent?.trim();
            if (!text) return;
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(text).then(() => toast('Copied')).catch(() => toast(text));
            } else {
                toast(text);
            }
        };
    });
    if (STATE.screen === 'property-detail' && STATE.tab === 'records' && STATE.recordsView) {
        const scrollMap = { compliance: 'records-compliance', inspections: 'records-checks', inventory: 'records-checks', documents: 'records-compliance' };
        const targetId = scrollMap[STATE.recordsView];
        if (targetId) {
            requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        }
    }
}

const _origRender = render;
render = function() {
    _origRender();
    const app = document.getElementById('app');
    if (app && !app.querySelector('.app-offline-banner') && offlineBanner()) {
        app.insertAdjacentHTML('afterbegin', offlineBanner());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.confirm) {
        app.insertAdjacentHTML('beforeend', confirmModal());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.renameDocId != null) {
        app.insertAdjacentHTML('beforeend', renameDocModal());
        lucide.createIcons();
        const input = app.querySelector('[data-rename-doc-input]');
        if (input) { input.focus(); input.select(); }
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.addDocumentOpen) {
        app.insertAdjacentHTML('beforeend', addDocumentModal());
        lucide.createIcons();
        const nameInput = app.querySelector('[data-add-doc-name]');
        if (nameInput) { nameInput.focus(); nameInput.select(); }
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.newMessagePicker) {
        app.insertAdjacentHTML('beforeend', newMessagePickerModal());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.photoMenuIdx != null && STATE.screen === 'property-photos') {
        app.insertAdjacentHTML('beforeend', photoActionSheet());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.chatMessageMenuId) {
        app.insertAdjacentHTML('beforeend', chatMessageActionSheet());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.chatOptionsOpen && STATE.screen === 'chat') {
        app.insertAdjacentHTML('beforeend', chatOptionsActionSheet());
        lucide.createIcons();
    }
    if (app && !app.querySelector('.modal-overlay') && STATE.chatMembersOpen && STATE.screen === 'chat') {
        app.insertAdjacentHTML('beforeend', chatMembersSheet());
        lucide.createIcons();
    }
    if (app && STATE.actionMenuKey != null && !app.querySelector('.action-menu-backdrop')) {
        app.insertAdjacentHTML('beforeend', '<div class="action-menu-backdrop" data-action="close-action-menu"></div>');
        bindActionMenuEvents(app);
    }
    if (app && typeof unitFilterSheet === 'function') {
        const sheet = unitFilterSheet();
        if (sheet) {
            app.insertAdjacentHTML('beforeend', sheet);
            lucide.createIcons();
        }
    }
    if (app && STATE.loading && !app.querySelector('.app-loading-bar')) {
        app.insertAdjacentHTML('afterbegin', loadingBar());
    }
    bindEvents();
};

const _origBindEvents = bindEvents;
bindEvents = function() {
    _origBindEvents();
    bindFeatureEvents();
    const app = document.getElementById('app');
    app.querySelectorAll('[data-action="save"]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            if (handleFeatureSave(el)) return;
            toast(el.dataset.msg || 'Saved');
            back();
        };
    });
};

const _origBack = back;
back = function() {
    if (STATE.screen === 'invite-tenant' && (STATE.inviteStep || 1) > 1) {
        captureInviteDraft();
        STATE.inviteStep -= 1;
        render();
        return;
    }
    _origBack();
};

function goFeature(screen, opts = {}) {
    const from = STATE.screen;
    if (screen !== 'chat') {
        STATE.chatMessageMenuId = null;
        STATE.chatOptionsOpen = false;
        STATE.chatMembersOpen = false;
    }
    if (opts.shareDocId != null) STATE.shareDocId = opts.shareDocId;
    if (opts.assignMaintId != null) STATE.assignMaintId = opts.assignMaintId;
    if (screen !== 'invite-tenant') {
        STATE.invitePrefill = null;
    }
    if (screen === 'add-flat') {
        STATE.flatDuplicateFrom = opts.duplicateFrom || null;
        STATE.selectedUnit = null;
        STATE.pendingFlatPhotos = [];
        STATE.pendingFlatCover = 0;
        if (opts.duplicateFrom && STATE.propertyId != null) {
            const gal = getFlatPhotoGallery(STATE.propertyId, opts.duplicateFrom);
            if (gal?.photos?.length) {
                STATE.pendingFlatPhotos = [...gal.photos];
                STATE.pendingFlatCover = gal.cover ?? 0;
            }
        }
    } else if (screen === 'add-property' && from !== 'add-property') {
        STATE.pendingPropertyPhotos = [];
        STATE.pendingPropertyCover = 0;
        STATE.addPropertyUnitMode = 'single';
    } else if (screen === 'edit-inventory-room') {
        initInventoryEditItems();
    } else if (screen !== 'edit-inventory-room') {
        STATE.inventoryEditItems = null;
    }
    if (screen === 'property-detail' && opts.tab !== 'inventory') {
        STATE.editingInventoryLayout = false;
    }
    if (opts.unit) STATE.selectedUnit = opts.unit;
    if (screen === 'send-broadcast') {
        STATE.broadcastPropertyId = opts.propertyId != null ? opts.propertyId : (STATE.broadcastPropertyId ?? STATE.propertyId ?? 0);
        if (from !== 'send-broadcast' && !STATE.broadcastScope) STATE.broadcastScope = 'all';
        if (from !== 'send-broadcast') STATE.broadcastDraftImage = null;
    }
    if (screen === 'broadcast-detail' && opts.broadcastId != null) {
        STATE.broadcastId = opts.broadcastId;
    }
    if (screen === 'log-maintenance') {
        if (opts.unit) {
            STATE.logMaintPrefill = {
                unit: opts.unit,
                propertyId: opts.propertyId != null ? opts.propertyId : STATE.propertyId,
            };
            STATE.selectedUnit = opts.unit;
            STATE.logMaintScope = 'unit';
        } else {
            STATE.logMaintPrefill = null;
            if (from !== 'log-maintenance') STATE.logMaintScope = 'unit';
        }
        STATE.logMaintPhotos = [];
        STATE.logMaintVideos = [];
        STATE.logMaintCategoryId = '';
        STATE.logMaintStep = 1;
    } else if (screen === 'create-tenancy' && from !== 'create-tenancy') {
        const unit = opts.unit || STATE.selectedUnit;
        STATE.tenancyMemberDraft = null;
        STATE.groupMemberCount = 1;
        if (unit) {
            STATE.selectedUnit = unit;
            const rentDigits = unitRentDigits(STATE.propertyId, unit);
            STATE.tenancyPrefill = { unit, rent: rentDigits, deposit: rentDigits, advancePaid: rentDigits };
        } else {
            STATE.tenancyPrefill = null;
        }
    } else if (screen === 'mark-rent-received') {
        if (from === 'flat-rent-history' || from === 'flat-detail') {
            STATE.rentReturnScreen = from;
            STATE.rentReceivePropertyFilter = STATE.propertyId;
            STATE.rentReceiveUnitFilter = STATE.selectedUnit || opts.unit || null;
        } else if (from === 'financial' && opts.rentRollRecord) {
            STATE.rentReturnScreen = 'financial';
            initRentReceiveFromRentRoll();
        } else if (from !== 'mark-rent-received') {
            STATE.rentReturnScreen = null;
            STATE.rentReceivePropertyFilter = null;
            STATE.rentReceiveUnitFilter = null;
        }
        if (from !== 'mark-rent-received') {
            if (opts.rentRollRecord) {
                // selection already set from rent roll
            } else {
                initRentReceiveSelection();
            }
            if (opts.invoiceId != null) {
                const inv = INVOICES.find(i => i.id === opts.invoiceId);
                if (inv?.propertyId != null) STATE.rentReceivePropertyFilter = inv.propertyId;
                if (inv?.unit) STATE.rentReceiveUnitFilter = inv.unit;
                STATE.rentReceiveIds = [opts.invoiceId];
            }
        }
    } else if (screen === 'send-payment-reminder') {
        if (typeof initRentReminderSelection === 'function') initRentReminderSelection();
        if (opts.invoiceId != null) {
            STATE.rentReminderIds = [opts.invoiceId];
        }
    } else if (screen === 'property-doc-folder') {
        STATE.propertyId = opts.propertyId != null ? opts.propertyId : STATE.propertyId;
        if (opts.folder) STATE.docFolderId = opts.folder;
        if (!STATE.docFolderId) STATE.docFolderId = 'gas';
    } else if (screen === 'property-flat-documents' || screen === 'property-inspections' || screen === 'property-inventory' || screen === 'edit-tenancy-deposit') {
        STATE.propertyId = opts.propertyId != null ? opts.propertyId : STATE.propertyId;
        if (opts.unit) STATE.selectedUnit = opts.unit;
    } else if (screen === 'flat-rent-history' || screen === 'flat-members') {
        STATE.propertyId = opts.propertyId != null ? opts.propertyId : STATE.propertyId;
        if (opts.unit) STATE.selectedUnit = opts.unit;
    } else if (screen !== 'invoice-detail') {
        STATE.rentReturnScreen = null;
        STATE.rentReceivePropertyFilter = null;
        STATE.rentReceiveUnitFilter = null;
    }
    if (screen === 'chat') markConversationRead(opts.chatId ?? STATE.chatId ?? 0);
    if (screen === 'conduct-inspection') {
        const pid = opts.propertyId != null ? opts.propertyId : STATE.propertyId;
        const upcoming = AppStore.inspections.find(i => i.propertyId === pid && i.scheduled);
        STATE.inspectionPrefill = upcoming ? {
            type: upcoming.type,
            date: toDateInputValue(upcoming.date),
        } : null;
        STATE.inspectionRating = 4;
        STATE.inspectionPhotos = [];
    } else if (STATE.screen === 'conduct-inspection') {
        STATE.inspectionPrefill = null;
        STATE.inspectionRating = 4;
    }
}
const _origGo = go;
go = function(screen, opts = {}) {
    const routed = typeof resolveScreenForRole === 'function' ? resolveScreenForRole(screen, opts) : { screen, opts: opts || {} };
    screen = routed.screen;
    opts = routed.opts || opts || {};
    if (opts.tenantPayFilter) STATE.tenantPayFilter = opts.tenantPayFilter;
    goFeature(screen, opts);
    if (SKELETON_SCREENS.has(screen)) {
        STATE.screenLoading = screen;
        clearTimeout(go._skelTimer);
        go._skelTimer = setTimeout(() => {
            if (STATE.screenLoading === screen) {
                STATE.screenLoading = null;
                render();
            }
        }, 380);
    }
    _origGo(screen, opts);
};

AppStore.load();
seedConversationsIfNeeded();
initMaintenanceHistory();
PROPERTIES.forEach(p => {
    const meta = AppStore.meta(p.id);
    if (!meta.building) meta.building = { flatCount: 4, floors: 2, flatsPerFloor: 2, useFloors: true };
    if (p.id === 2 && meta.units?.length > 1) {
        const built = buildPropertyFlats({ flatCount: 1, defaultRent: '£2,100' });
        meta.units = built.units;
        meta.building = built.building;
        meta.defaultFlatRent = '£2,100';
    }
    normalizePropertyUnits(p.id);
});
syncAllPropertyStatuses();
normalizeDemoPortfolio();
syncSmartReminders(false);
syncTransactionsFromInvoices();
loadContractorJobs();
backfillMaintGroupChats();
getLandlordChatId();
if (typeof CONTRACTOR_JOBS !== 'undefined' && typeof ensureContractorJob === 'function') {
    CONTRACTOR_JOBS.forEach(job => {
        ensureContractorJob(job);
        if (typeof syncContractorJobToMaintenance === 'function') syncContractorJobToMaintenance(job);
    });
}
if (!AppStore.contractorJobs?.length) {
    AppStore.contractorJobs = JSON.parse(JSON.stringify(CONTRACTOR_JOBS));
    AppStore.save();
}
if (AppStore.toggles) Object.assign(STATE.toggles, AppStore.toggles);
toggleSwitch = function(key) {
    STATE.toggles[key] = !STATE.toggles[key];
    AppStore.save();
    render();
};
if (!AppStore.paymentMethods?.length) {
    AppStore.paymentMethods = [
        { id: 0, type: 'Visa', last4: '4242', exp: '08/27', name: 'John Smith', default: true },
        { id: 1, type: 'Barclays', last4: '8901', exp: '—', name: 'Rent Collection', default: false },
    ];
}
if (!AppStore.tenantNotes) AppStore.tenantNotes = { 0: [], 1: [], 2: [], 3: [] };
if (!AppStore.tenantDocuments) AppStore.tenantDocuments = { 0: [], 1: [], 2: [], 3: [] };
if (!AppStore.inventory) AppStore.inventory = {};
if (!AppStore.complianceCerts) AppStore.complianceCerts = {};
PROPERTIES.forEach(p => AppStore.meta(p.id));
syncAllPropertyStatuses();

try {
    render();
} catch (err) {
    console.error('Landlord HQ render error:', err);
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `<div style="padding:24px;font-family:system-ui;color:#0F172A"><h2 style="font-size:18px;margin:0 0 8px">Something went wrong</h2><p style="font-size:14px;color:#64748B;margin:0">Please refresh the page. If this keeps happening, clear site data for this page.</p></div>`;
    }
}

window.addEventListener('online', () => render());
window.addEventListener('offline', () => render());
