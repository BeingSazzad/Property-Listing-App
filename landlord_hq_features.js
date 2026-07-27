/* Landlord HQ — Feature completion layer (persistence, new screens, workflows) */

const CONTRACTORS = [
    { id: 0, name: 'Plumber Pro', trade: 'Plumbing', img: IMG.avatar.plumber },
    { id: 1, name: 'Heating Co.', trade: 'Heating', img: IMG.avatar.heating },
    { id: 2, name: 'Electric Fix', trade: 'Electrical', img: IMG.avatar.electric },
];

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

const INVENTORY_ROOM_ICONS = ['utensils', 'sofa', 'bed-double', 'bath', 'door-open'];

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
            if (d.inventory) this.inventory = d.inventory;
            if (d.paymentMethods) this.paymentMethods = d.paymentMethods;
            if (d.complianceCerts) this.complianceCerts = d.complianceCerts;
            if (d.tenantDocuments) this.tenantDocuments = d.tenantDocuments;
            if (d.conversations) this.conversations = d.conversations;
            if (d.tenantList) { TENANT_LIST.splice(0, TENANT_LIST.length, ...d.tenantList); }
            if (d.tenants) { TENANTS.splice(0, TENANTS.length, ...d.tenants); }
            if (d.notifications) { NOTIFICATIONS.splice(0, NOTIFICATIONS.length, ...d.notifications); }
            if (d.toggles) Object.assign(STATE.toggles, d.toggles);
            if (d.landlordProfile) Object.assign(LANDLORD_USER, d.landlordProfile);
            if (d.preferences) Object.entries(d.preferences).forEach(([k, v]) => { if (PREF_OPTIONS[k]) PREF_OPTIONS[k].current = v; });
            if (typeof syncConversationsFromStore === 'function') syncConversationsFromStore();
            if (typeof initMaintenanceHistory === 'function') initMaintenanceHistory();
            if (typeof syncSmartReminders === 'function') syncSmartReminders(false);
            if (typeof syncSharedDocToTenants === 'function' && this.documents) {
                this.documents.filter(d => d.shared).forEach(syncSharedDocToTenants);
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
            inventory: this.inventory,
            paymentMethods: this.paymentMethods,
            complianceCerts: this.complianceCerts,
            tenantDocuments: this.tenantDocuments,
            conversations: this.conversations,
            tenantList: TENANT_LIST,
            tenants: TENANTS,
            notifications: NOTIFICATIONS,
            toggles: STATE.toggles,
            landlordProfile: LANDLORD_USER,
            preferences: Object.fromEntries(Object.entries(PREF_OPTIONS).map(([k, v]) => [k, v.current])),
        }));
    },
    seed() {
        this.reminders = [
            { id: 0, type: 'gas', propertyId: 0, title: 'Gas Certificate Expiry', due: '2026-03-12', daysLeft: 3, urgency: 'high' },
            { id: 1, type: 'inspection', propertyId: 1, title: 'Inspection Due', due: '2025-02-28', daysLeft: 5, urgency: 'medium' },
            { id: 2, type: 'rent-review', propertyId: 2, title: 'Rent Review', due: '2025-03-15', daysLeft: 10, urgency: 'medium' },
            { id: 3, type: 'electrical', propertyId: 1, title: 'Electrical Certificate Expiry', due: '2025-04-02', daysLeft: 45, urgency: 'low' },
            { id: 4, type: 'leasehold', propertyId: 0, title: 'Leasehold Service Charge', due: '2025-06-01', daysLeft: 90, urgency: 'low' },
        ];
        this.documents = [
            { id: 0, propertyId: 0, type: 'Tenancy Agreement', name: 'Lease Agreement.pdf', date: 'Jan 15, 2024', shared: true, signed: true },
            { id: 1, propertyId: 0, type: 'Gas Certificate', name: 'Gas Safety 2025.pdf', date: 'Mar 2025', shared: false, signed: false },
            { id: 2, propertyId: 0, type: 'Electrical Certificate', name: 'EICR Report.pdf', date: 'Apr 2024', shared: false, signed: false },
            { id: 3, propertyId: 0, type: 'EPC Certificate', name: 'EPC Rating B.pdf', date: '2023', shared: true, signed: false },
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
            { id: 2, propertyId: 1, type: 'Mid-term', date: '2025-02-28', rating: null, photos: 0, report: null, scheduled: true, notes: 'Tenant requested afternoon slot. Parking on street.' },
        ];
        this.complianceCerts = {
            '0-0': { certNumber: 'GS-2026-001', issueDate: '2025-03-15', expiryDate: '2026-03-15', issuedBy: 'SafeGas Ltd' },
            '0-1': { certNumber: 'EICR-8821', issueDate: '2024-04-02', expiryDate: '2025-04-02', issuedBy: 'Spark Electrical' },
            '0-7': { certNumber: 'EPC-B-4421', issueDate: '2022-06-15', expiryDate: '2027-06-15', issuedBy: 'Green Assessors', notes: 'Rating B' },
            '1-0': { certNumber: 'GS-2025-114', issueDate: '2024-11-01', expiryDate: '2025-11-01', issuedBy: 'HeatSafe' },
        };
        this.inventory = {
            '0-0': { condition: 'Good', notes: 'Minor wear on worktop near sink.', items: [], photos: IMG.interior.slice(0, 2) },
            '0-1': { condition: 'Good', notes: 'Sofa in good condition.', items: [], photos: [IMG.interior[2]] },
            '0-2': { condition: 'Fair', notes: 'Carpet showing light wear in corner.', items: [], photos: IMG.interior.slice(3, 5) },
        };
        this.contractorInvoices = [
            { id: 0, contractor: 'Plumber Pro', job: 'Kitchen sink leaking', amount: '£185', status: 'Unpaid', propertyId: 0, maintId: 0 },
            { id: 1, contractor: 'Heating Co.', job: 'Boiler service', amount: '£220', status: 'Paid', propertyId: 1, maintId: 3 },
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
        this.tenantDocuments = {
            0: [
                ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                ['file-image', 'NID Proof.jpg', 'Jan 10, 2024', '#7C3AED'],
            ],
            1: [
                ['file-text', 'Lease Agreement.pdf', 'Jun 1, 2023', '#2563EB'],
                ['file-image', 'NID Proof.jpg', 'May 28, 2023', '#7C3AED'],
            ],
            2: [], 3: [],
        };
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
                    floorPlans: [{ name: 'Ground Floor', url: IMG.interior[0] }, { name: 'First Floor', url: IMG.interior[1] }],
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
        this.save();
    },
    meta(pid) {
        if (!this.propertyMeta[pid]) {
            this.propertyMeta[pid] = {
                floorPlans: [], photos: [IMG.props[pid]], alarms: {}, appliances: [],
                utilities: {}, parking: {}, info: { type: '—', built: '—', epc: '—', councilTax: '—', notes: '' },
            };
        }
        if (!this.propertyMeta[pid].info) {
            this.propertyMeta[pid].info = { type: 'Semi-detached', built: '1985', epc: 'Rating B', councilTax: 'Band D', notes: '' };
        }
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
    inspectionPhotos: [],
    invitePrefill: null,
});

/* ─── UI Helpers ─── */
const requiredLabel = (t) => `${t} <span class="form-required">*</span>`;

const formFieldReq = (label, key, value = '', type = 'text', ph = '', helper = '') => {
    const err = STATE.formErrors[key];
    const valAttr = value !== '' && value != null ? ` value="${String(value).replace(/"/g, '&quot;')}"` : '';
    return `<div class="form-group ${err ? 'form-group-error' : ''}">
        <label class="form-label">${requiredLabel(label)}</label>
        <input type="${type}" data-field="${key}" class="form-input${err ? ' form-input-error' : ''}"${valAttr} placeholder="${ph || `Enter ${label.toLowerCase()}`}">
        ${helper ? `<p class="form-helper">${helper}</p>` : ''}
        ${err ? `<p class="form-error-msg"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>${err}</p>` : ''}
    </div>`;
};

const emptyState = (icon, title, desc, btnLabel, btnAction, btnGo) => `
<div class="empty-state card">
    <i data-lucide="${icon}" class="w-12 h-12 text-[#CBD5E1]"></i>
    <p class="empty-state-title">${title}</p>
    <p class="empty-state-desc">${desc}</p>
    ${btnGo ? `<button data-go="${btnGo}" class="btn-primary py-3 px-6 text-[13px]">${btnLabel}</button>` :
        btnAction ? `<button data-action="${btnAction}" class="btn-primary py-3 px-6 text-[13px]">${btnLabel}</button>` : ''}
</div>`;

const loadingBar = () => STATE.loading ? `<div class="app-loading-bar"></div>` : '';

const confirmModal = () => {
    if (!STATE.confirm) return '';
    const c = STATE.confirm;
    return `<div class="modal-overlay open" data-action="confirm-cancel">
        <div class="modal-sheet" onclick="event.stopPropagation()">
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
        <div class="photo-action-sheet" onclick="event.stopPropagation()">
            ${!isCover ? `<button type="button" data-action="set-cover-photo" data-idx="${idx}" class="photo-action-item">Set as cover</button>` : ''}
            ${photos.length > 1 ? `<button type="button" data-action="delete-photo" data-idx="${idx}" class="photo-action-item danger">Remove photo</button>` : ''}
            <button type="button" data-action="close-photo-menu" class="photo-action-item cancel">Cancel</button>
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
    if (!ok) { toast('Please fix the errors below'); render(); }
    return ok;
}

function fieldVal(key) {
    const el = document.querySelector(`[data-field="${key}"]`);
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked;
    return (el.value ?? '').trim();
}

const INVENTORY_ROOM_NAMES = ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Hallway'];
const DEFAULT_INVENTORY_ITEMS = [['Oven & Hob', 'Good'], ['Fridge Freezer', 'Good'], ['Washing Machine', 'Fair'], ['Microwave', 'Good']];

function inventoryKey(pid, rid) { return `${pid}-${rid}`; }

function getInventoryRooms(propertyId = STATE.propertyId) {
    return INVENTORY_ROOM_NAMES.map((name, i) => {
        const inv = AppStore.inventory[inventoryKey(propertyId, i)];
        const condition = inv?.condition || (i === 2 ? 'Fair' : 'Good');
        const photoCount = inv?.photos?.length || 0;
        const itemCount = inv?.items?.length || DEFAULT_INVENTORY_ITEMS.length;
        const sub = photoCount ? `${photoCount} photo${photoCount === 1 ? '' : 's'}` : `${itemCount} items`;
        return [name, condition, sub];
    });
}

function renderPropertyInventoryTab(propertyId) {
    const rooms = getInventoryRooms(propertyId);
    return `
    <div class="screen-content screen-content-sm">
        ${rooms.map(([r, c, n], idx) => `
        <button data-go="inventory-room" data-pid="${propertyId}" data-room="${idx}" class="card w-full p-4 flex items-center justify-between card-hover text-left">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="${INVENTORY_ROOM_ICONS[idx] || 'package'}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                <div><p class="text-[13px] font-semibold">${r}</p><p class="text-[11px] text-[#64748B]">${n}</p></div>
            </div>
            <span class="badge ${c === 'Good' ? 'bg-[#DCFCE7] text-[#16A34A]' : c === 'Fair' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#FEE2E2] text-[#DC2626]'}">${c}</span>
        </button>`).join('')}
    </div>`;
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
    return merged.length ? merged : active;
}

function getInventoryItems(pid, rid) {
    const inv = AppStore.inventory[inventoryKey(pid, rid)];
    return inv?.items || DEFAULT_INVENTORY_ITEMS.map(x => [...x]);
}

function getInventoryNotes(pid, rid) {
    return AppStore.inventory[inventoryKey(pid, rid)]?.notes || 'Minor wear on worktop near sink. All appliances tested and working.';
}

function getPaymentMethods() { return AppStore.paymentMethods; }

function getTenantDocuments(tenantId) {
    return AppStore.tenantDocuments[tenantId] || [];
}

function getTenantNidProof(tenantId) {
    const t = TENANTS[tenantId];
    if (t?.nidProof) return { name: t.nidProof, date: 'On file' };
    const docs = getTenantDocuments(tenantId);
    const match = docs.find(d => /nid/i.test(d[1]));
    return match ? { name: match[1], date: match[2] } : null;
}

function ensureTenantNidProof(tenantId, fileName = 'NID Proof.jpg') {
    const t = TENANTS[tenantId];
    if (t) t.nidProof = fileName;
    if (!AppStore.tenantDocuments[tenantId]) AppStore.tenantDocuments[tenantId] = [];
    if (!AppStore.tenantDocuments[tenantId].some(d => /nid/i.test(d[1]))) {
        AppStore.tenantDocuments[tenantId].push(['file-image', fileName, 'Just now', '#7C3AED']);
    }
}

function getTenantNotes(tenantId) {
    if (!AppStore.tenantNotes[tenantId]) AppStore.tenantNotes[tenantId] = [];
    return AppStore.tenantNotes[tenantId];
}

function renderTenantNotesSection(tenantId) {
    const notes = getTenantNotes(tenantId);
    const list = notes.length ? notes.map(n => `
        <div class="tenant-note-card" style="background:${n.bg};border-color:${n.color}22">
            <p class="tenant-note-text">${n.text}</p>
            <div class="tenant-note-footer">
                <span class="tenant-note-meta">${n.meta}</span>
                <div class="row-actions">
                    <button type="button" data-action="edit-tenant-note" data-nid="${n.id}" class="row-icon-btn row-icon-btn--primary" title="Edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                    <button type="button" data-action="delete-tenant-note" data-nid="${n.id}" class="row-icon-btn row-icon-btn--danger" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>
            </div>
        </div>`).join('') : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No notes yet</p></div>`;
    return `<div class="stack-sm">${list}<button type="button" data-go="tenant-add-note" class="btn-primary w-full py-3 text-[13px]">+ Add Note</button></div>`;
}

function formatDisplayDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
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

function getFlatCoverPhoto(propertyId, unitName) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotos) meta.unitPhotos = {};
    if (meta.unitPhotos[unitName]) return meta.unitPhotos[unitName];
    const unit = getUnitByName(propertyId, unitName);
    const idx = ((unit?.id ?? 0) + (propertyId * 3)) % IMG.interior.length;
    return IMG.interior[idx];
}

function setFlatCoverPhoto(propertyId, unitName, url) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotos) meta.unitPhotos = {};
    meta.unitPhotos[unitName] = url;
}

function renameFlatPhoto(propertyId, oldName, newName) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotos?.[oldName] || oldName === newName) return;
    meta.unitPhotos[newName] = meta.unitPhotos[oldName];
    delete meta.unitPhotos[oldName];
}

function ensureFlatPhotos(propertyId) {
    const meta = AppStore.meta(propertyId);
    if (!meta.unitPhotos) meta.unitPhotos = {};
    getPropertyUnits(propertyId).forEach(u => {
        const name = unitName(u);
        if (!meta.unitPhotos[name]) {
            meta.unitPhotos[name] = IMG.interior[((u.id ?? 0) + propertyId * 3) % IMG.interior.length];
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

function removeFlatFromProperty(propertyId, flatName) {
    const meta = AppStore.meta(propertyId);
    const units = getPropertyUnits(propertyId);
    if (units.length <= 1) {
        toast('Keep at least one flat on the property');
        return false;
    }
    const u = getUnitByName(propertyId, flatName);
    if (!u) {
        toast('Flat not found');
        return false;
    }
    if (u.status === 'occupied') {
        toast('Check out the tenant before removing this flat');
        return false;
    }
    if (tenantsForUnit(propertyId, flatName).some(t => t.status === 'pending')) {
        toast('Cancel pending invites before removing this flat');
        return false;
    }
    meta.units = (meta.units || units).filter(x => unitName(x) !== flatName);
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
        if (units.length <= 1) toast('Cannot remove the only flat');
        else toast('This flat cannot be removed right now');
        return;
    }
    showConfirm('Remove Flat', `Remove ${flatName} from this property?`, () => {
        if (!removeFlatFromProperty(STATE.propertyId, flatName)) return;
        AppStore.save();
        toast('Flat removed');
        go('property-detail', { propertyId: STATE.propertyId, tab: 'units' });
    }, { okLabel: 'Remove', danger: true });
}

function renderPropertyBuildingHeader(propertyId) {
    const p = PROPERTIES[propertyId];
    const cover = getPropertyCoverPhoto(propertyId);
    return `
    <div class="property-building-header">
        <div class="property-building-thumb"><img src="${cover}" alt=""></div>
        <div class="property-building-body">
            <p class="property-building-name">${p.name}</p>
            <p class="property-building-addr">${p.address}</p>
            <p class="property-building-meta">${propertyStructureLabel(propertyId)}</p>
        </div>
        <button data-go="edit-property" data-pid="${propertyId}" class="header-text-link">Edit</button>
    </div>`;
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

function renderBuildingStatsCard(propertyId) {
    const rs = getPropertyRentSummary(propertyId);
    const units = getPropertyUnits(propertyId);
    const occupied = units.filter(u => u.status === 'occupied').length;
    const total = units.length || 0;
    const b = getPropertyBuilding(propertyId);
    const distinctFloors = new Set(units.map(u => u.floor || 1)).size;
    const floors = b.floors > 1 ? b.floors : Math.max(1, distinctFloors);
    const occupancyPct = total ? Math.round((occupied / total) * 100) : 0;
    const rentLabel = rs.collected > 0 ? 'Rent collected' : 'Potential rent';
    const rentValue = rs.collected > 0 ? formatRentAmount(rs.collected) : (rs.potential ? formatRentAmount(rs.potential) : '—');
    const metrics = [
        ['layers', 'Flats', String(total), ''],
        ['building-2', 'Floors', String(floors), ''],
        ['users', 'Flats occupied', `${occupied}/${total}`, 'progress'],
        ['pound-sterling', rentLabel, rentValue, 'accent'],
    ];
    return `
    <div class="building-metrics card">
        <div class="building-metrics-grid">
            ${metrics.map(([icon, label, value, variant]) => `
            <div class="building-metric ${variant}">
                <div class="building-metric-top">
                    <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
                    <span>${label}</span>
                </div>
                <p class="building-metric-value">${value}</p>
                ${variant === 'progress' && total ? `<div class="building-metric-bar" aria-hidden="true"><span style="width:${occupancyPct}%"></span></div>` : ''}
            </div>`).join('')}
        </div>
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
    const utilItems = [
        ['flame', 'Gas', meta.utilities?.gas],
        ['zap', 'Electric', meta.utilities?.electric],
        ['droplets', 'Water', meta.utilities?.water],
        ['wifi', 'Broadband', meta.utilities?.broadband],
        ['landmark', 'Council Tax', meta.utilities?.councilTax || info.councilTax],
        ['car', 'Parking', meta.parking?.spaces ? `Parking (${meta.parking.spaces})` : null],
    ].filter(([, , v]) => v);
    const applianceItems = (meta.appliances || []).map(a => {
        const key = (a.name || '').toLowerCase();
        const icon = key.includes('boiler') ? 'flame' : key.includes('fridge') ? 'box' : key.includes('oven') ? 'microwave' : 'plug';
        return [icon, a.name];
    });
    const alarmItems = Object.keys(meta.alarms || {}).map(k => {
        const label = k === 'co' ? 'CO Alarm' : `${k.charAt(0).toUpperCase() + k.slice(1)} Alarm`;
        const icon = k === 'co' ? 'alert-circle' : k === 'heat' ? 'thermometer' : 'bell';
        return [icon, label];
    });
    const featureItems = [...applianceItems, ...alarmItems];
    const infoRows = [
        ['home', 'Type', info.type || '—'],
        ['calendar', 'Year Built', info.built || '—'],
        ['leaf', 'EPC', info.epc || '—'],
        ['landmark', 'Council Tax', info.councilTax || '—'],
    ];
    const b = getPropertyBuilding(propertyId);
    const floors = b.useFloors && b.floors > 1 ? b.floors : Math.max(1, new Set(units.map(u => u.floor || 1)).size);
    return `
    <div class="screen-content screen-content-sm building-info-page">
        <div class="building-info-hero">
            <div class="building-info-thumb"><img src="${cover}" alt=""></div>
            <div class="building-info-body">
                <p class="building-info-name">${p.name}</p>
                <p class="building-info-addr">${p.address}</p>
            </div>
        </div>
        ${renderBuildingStatsCard(propertyId)}
        <div class="building-section card">
            <div class="building-section-head">
                <h3>Property Photos</h3>
                <span class="building-section-meta">${photoCount} photo${photoCount === 1 ? '' : 's'}</span>
            </div>
            <div class="building-photo-grid">
                ${photos.slice(0, 3).map((src, i) => `
                <div class="building-photo-thumb">
                    <img src="${src}" alt="">
                    ${i === 0 ? '<span class="photo-cover-badge">COVER</span>' : ''}
                </div>`).join('')}
            </div>
            <button data-go="property-photos" class="btn-secondary w-full py-3 text-[13px]">Manage Photos</button>
        </div>
        <div class="building-section card">
            <div class="building-section-head">
                <h3>Property Information</h3>
                <button data-go="property-info" class="header-text-link">Edit</button>
            </div>
            <div class="building-info-rows">
                ${infoRows.map(([icon, label, value]) => `
                <div class="building-info-row">
                    <div class="building-info-row-left">
                        <i data-lucide="${icon}" class="w-4 h-4 text-[#94A3B8]"></i>
                        <span class="building-info-row-label">${label}</span>
                    </div>
                    <span class="building-info-row-value">${value}</span>
                </div>`).join('')}
            </div>
        </div>
        <div class="building-section card">
            <div class="building-section-head"><h3>Utilities & Parking</h3></div>
            ${utilItems.length ? `
            <div class="building-icon-grid cols-3">
                ${utilItems.map(([icon, label]) => `
                <div class="building-icon-item">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                    <span>${label}</span>
                </div>`).join('')}
            </div>` : `<p class="building-empty-copy">No utilities set yet.</p>`}
            <div class="grid grid-cols-2 gap-2 mt-3">
                <button data-go="property-utilities" class="btn-secondary py-2.5 text-[12px]">Edit Utilities</button>
                <button data-go="property-parking" class="btn-secondary py-2.5 text-[12px]">Edit Parking</button>
            </div>
        </div>
        <div class="building-section card">
            <div class="building-section-head"><h3>Appliances & Alarms</h3></div>
            ${featureItems.length ? `
            <div class="building-icon-grid cols-2">
                ${featureItems.map(([icon, label]) => `
                <div class="building-icon-item">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                    <span>${label}</span>
                </div>`).join('')}
            </div>` : `<p class="building-empty-copy">No appliances or alarms added yet.</p>`}
            <div class="grid grid-cols-2 gap-2 mt-3">
                <button data-go="property-appliances" class="btn-secondary py-2.5 text-[12px]">Appliances</button>
                <button data-go="property-alarms" class="btn-secondary py-2.5 text-[12px]">Alarms</button>
            </div>
        </div>
        <button data-go="property-floor-plans" class="btn-secondary w-full py-3 text-[13px]">View Floor Plans</button>
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
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unitName);
    if (!tenancy) return '';
    if (tenancy.type === 'group') return `Group · ${count} member${count === 1 ? '' : 's'}`;
    const lead = members.find(m => m.isLead) || members[0];
    return lead?.name ? `Solo · ${lead.name}` : 'Solo tenancy';
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
    if (!tenancy) return '';
    if (tenancy.type === 'group') {
        const { count } = getFlatMemberRoster(t.propertyId, t.unit);
        return count > 1 ? `Group member · ${count} on flat` : 'Group tenancy';
    }
    return 'Solo tenancy';
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
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, name);
    const flatPending = (opts.pendingInvites || []).filter(i => i.unit === name);
    if (opts.tenantsOnly && !tenancy && !count && !flatPending.length) return '';
    const tenancyHint = occ && tenancy ? flatTenancyListHint(propertyId, name) : '';
    const hintClass = tenancy ? tenancyHintClass(tenancy.type) : 'flat-list-tenancy-hint--solo';
    const lead = members.find(m => m.isLead) || members[0];
    const memberLine = count > 1
        ? `${lead?.name || 'Tenant'} +${count - 1} more`
        : lead?.name;
    const tenantMeta = memberLine
        ? `${memberLine}${tenancy ? ` · ${tenancy.rent}/month` : ''}`
        : flatPending.length
            ? `Invite pending · ${flatPending[0].firstName} ${flatPending[0].lastName}`
            : tenancy
                ? `${tenancyTypeLabel(tenancy.type)} · ${tenancy.rent}/month`
                : occ ? 'Occupied' : 'Vacant';
    const metaLine = opts.tenantsOnly ? tenantMeta : flatRentSpecLine(u);
    const typePill = tenancy && opts.showTypePill ? tenancyTypePill(tenancy.type) : '';
    return `
    <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${name}" class="flat-list-card card w-full text-left ${tenancy ? `flat-list-card--${tenancy.type}` : ''}">
        <div class="flat-list-thumb"><img src="${thumb}" alt=""></div>
        <div class="flat-list-body">
            <div class="flat-list-top">
                <p class="flat-list-name">${name}</p>
                <div class="flat-list-badges">
                    ${typePill}
                    <span class="badge shrink-0" style="background:${occ ? '#DCFCE7' : '#FEF3C7'};color:${occ ? '#16A34A' : '#D97706'}">${occ ? 'Occupied' : 'Vacant'}</span>
                </div>
            </div>
            <p class="flat-list-meta">${metaLine}</p>
            ${tenancyHint ? `<p class="flat-list-tenancy-hint ${hintClass}">${tenancyHint}</p>` : ''}
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
    </button>`;
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
    const avatars = [IMG.avatar.sarah, IMG.avatar.david, IMG.avatar.michael];
    return {
        name: member.name || listItem?.name || 'Occupant',
        email: member.email || record?.email || pendingInvite?.email || '',
        phone: member.phone || record?.phone || pendingInvite?.phone || '',
        tenantId: listItem?.status === 'active' ? tenantId : null,
        listId: listItem?.id,
        accountStatus,
        img: listItem?.img || avatars[(tenantId ?? 0) % avatars.length],
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

function renderMemberRow(member, propertyId, unitName, opts = {}) {
    const canOpenProfile = member.tenantId != null;
    const nameParts = (member.name || '').trim().split(/\s+/);
    const inviteFirst = nameParts[0] || '';
    const inviteLast = nameParts.slice(1).join(' ') || '';
    const action = canOpenProfile
        ? `data-go="tenant-detail" data-tid="${member.tenantId}"`
        : member.inviteToken
            ? `data-go="tenant-invite-sent" data-invite-token="${member.inviteToken}"`
            : `data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unitName}" data-invite-email="${member.email || ''}" data-invite-first="${inviteFirst}" data-invite-last="${inviteLast}" data-invite-phone="${member.phone || ''}"`;
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
                    <p class="tenancy-card-label">Tenancy</p>
                    ${tenancy ? tenancyTypePill(tenancy.type) : ''}
                </div>
                <p class="tenancy-card-title">${tenancy ? tenancyTypeLabel(tenancy.type) : 'Occupied'}</p>
                <p class="tenancy-card-meta">${tenancy?.rent || '—'}/month · ${leaseLine}</p>
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
    return `
    <div class="card p-4 mt-3 tenancy-card tenancy-card--group">
        <div class="detail-title-row mb-3">
            <div>
                <div class="tenancy-card-head-tags">
                    <p class="tenancy-card-label">Flat members</p>
                    ${tenancyTypePill('group')}
                </div>
                <p class="text-[14px] font-semibold text-[#0F172A]">${members.length} people on this tenancy</p>
            </div>
            <button data-go="tenancy-detail" data-pid="${listItem.propertyId}" data-unit="${listItem.unit}" class="header-text-link">View</button>
        </div>
        <div class="stack-sm">${members.map(m => renderMemberRow(m, listItem.propertyId, listItem.unit)).join('')}</div>
    </div>`;
}

function renderTenancyContextCard(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    if (!listItem) return '';
    const { tenancy, members } = getFlatMemberRoster(listItem.propertyId, listItem.unit);
    if (!tenancy) return '';
    if (tenancy.type === 'group' && members.length > 1) return renderTenancyMemberList(tenantId);
    const lead = members.find(m => m.isLead) || members[0];
    const leaseLine = `${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start} – ${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end}`;
    return `
    <div class="card p-4 mt-3 tenancy-card tenancy-card--solo">
        <div class="detail-title-row">
            <div>
                <div class="tenancy-card-head-tags">
                    <p class="tenancy-card-label">Tenancy</p>
                    ${tenancyTypePill('solo')}
                </div>
                <p class="tenancy-card-title">Solo tenancy</p>
                <p class="tenancy-card-meta">${tenancy.rent}/month · ${leaseLine}</p>
                ${lead ? `<p class="tenancy-card-meta mt-1">Tenant · ${lead.name}</p>` : ''}
            </div>
            <button data-go="tenancy-detail" data-pid="${listItem.propertyId}" data-unit="${listItem.unit}" class="header-text-link">View</button>
        </div>
    </div>`;
}

function screenTenancyDetail() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const { tenancy, members } = getFlatMemberRoster(propertyId, unit);
    if (!tenancy) {
        return `${topBar('Tenancy', { back: true })}
        <div class="screen-content"><p class="ux-intro">No active tenancy for this flat.</p>
        <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full mt-3">Back to flat</button></div>`;
    }
    const leaseStart = typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start;
    const leaseEnd = typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end;
    const lead = members.find(m => m.isLead) || members[0];
    return `${topBar('Tenancy', { back: true, sub: `${p?.name || ''} · ${unit}` })}
    <div class="screen-content screen-enter">
        <div class="tenancy-hero card p-4 ${tenancy.type === 'group' ? 'tenancy-hero--group' : 'tenancy-hero--solo'}">
            <div class="flex items-center justify-between gap-3">
                ${tenancyTypePill(tenancy.type)}
                <span class="badge" style="background:#DCFCE7;color:#16A34A">Active</span>
            </div>
            <p class="tenancy-hero-title mt-3">${tenancyTypeLabel(tenancy.type)}</p>
            <p class="tenancy-hero-rent">${tenancy.rent}<span>/month</span></p>
            <p class="tenancy-hero-dates">${leaseStart} – ${leaseEnd}</p>
            ${lead ? `<p class="tenancy-hero-lead mt-2">Lead tenant · ${lead.name}</p>` : ''}
        </div>
        <div class="ux-tip">
            <p class="ux-tip-title">Tenancy vs tenant</p>
            <p class="ux-tip-text">${tenancy.type === 'group'
                ? 'A group tenancy has several people on one lease. Each member can get their own portal account — the lead tenant is your main contact.'
                : 'A solo tenancy is one person on the lease. They get one portal account linked to this flat.'}</p>
        </div>
        <div class="screen-list-header">
            <div>
                <h2>${tenancy.type === 'group' ? 'Members' : 'Tenant'}</h2>
                <p>${tenancy.type === 'group' ? `${members.length} on this flat` : (lead?.name || 'Occupant')}</p>
            </div>
            <button data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="header-text-link">+ Invite</button>
        </div>
        <div class="stack-sm">
            ${members.length ? members.map(m => renderMemberRow(m, propertyId, unit)).join('') : `
            <div class="card p-6 text-center">
                <p class="text-[13px] text-[#64748B]">No members added yet</p>
            </div>`}
        </div>
        <button data-go="flat-detail" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full">Back to flat</button>
    </div>`;
}

function screenMemberDetail() {
    return '';
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

function pendingTenantInviteCount() {
    return TENANT_INVITATIONS.filter(i => i.status === 'pending').length;
}

function tenantPaymentSummary(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const t = TENANTS[tenantId];
    if (!listItem || !t) return { balance: '£0.00', lastPayment: '—', nextDue: '—', deposit: '—' };
    const invs = INVOICES.filter(i =>
        i.tenant === listItem.name ||
        (i.prop.includes(listItem.prop) && (!i.unit || i.unit === listItem.unit))
    );
    const pending = invs.filter(i => i.status !== 'Paid');
    const balance = pending.reduce((s, i) => s + parseRentAmount(i.amount), 0);
    const lastPaid = invs.find(i => i.status === 'Paid');
    const nextDue = invs.find(i => i.status === 'Pending' || i.status === 'Overdue');
    const depositAmt = parseRentAmount(t.rent);
    return {
        balance: balance ? formatRentAmount(balance) : '£0.00',
        lastPayment: lastPaid ? `${lastPaid.amount} · ${lastPaid.due}` : '—',
        nextDue: nextDue?.due || '—',
        deposit: depositAmt ? formatRentAmount(depositAmt) : '—',
    };
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
        { id: 0, num: 'INV-2026-1048', prop: '12 Park Lane, London SW1A 1AA', unit: 'Flat 2A', tenant: 'Sarah Johnson', amount: '£2,450', status: 'Pending', due: 'Jul 1, 2026' },
        { id: 1, num: 'INV-2026-1047', prop: '45 Queens Road, London SW2 3TR', unit: 'Flat 1A', tenant: 'David Wilson', amount: '£1,850', status: 'Overdue', due: 'Jul 1, 2026' },
        { id: 2, num: 'INV-2026-1045', prop: '15 Victoria Ave, London N1 5EH', unit: 'Flat 2A', tenant: 'Michael Lee', amount: '£1,950', status: 'Pending', due: 'Jul 28, 2026' },
    ];
    if (INVOICES.length !== canonicalInvoices.length || INVOICES.some((inv, idx) => inv.num !== canonicalInvoices[idx]?.num)) {
        INVOICES.splice(0, INVOICES.length, ...canonicalInvoices);
    }
    const canonicalTenancies = [
        { id: 0, propertyId: 0, tenantId: 0, type: 'solo', unit: 'Flat 2A', rent: '£2,450', start: '2024-01-15', end: '2027-01-14', status: 'active' },
        { id: 1, propertyId: 1, tenantId: 1, type: 'solo', unit: 'Flat 1A', rent: '£1,850', start: '2023-06-01', end: '2027-05-31', status: 'active' },
        { id: 2, propertyId: 3, tenantId: 2, type: 'solo', unit: 'Flat 2A', rent: '£1,950', start: '2024-03-10', end: '2027-03-09', status: 'active' },
        { id: 3, propertyId: 0, tenantId: 4, type: 'group', unit: 'Flat 2B', rent: '£2,200', start: '2024-06-01', end: '2027-05-31', status: 'active', occupants: 3, leadName: 'Priya Sharma', members: [
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
    TENANTS.forEach((t, i) => {
        if (!t.idNumber || String(t.idNumber).startsWith('TN-')) t.idNumber = canonicalNids[i] || t.idNumber;
        if (!t.nidProof && t.id !== 5) t.nidProof = 'NID Proof.jpg';
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
            date: inv.due,
            prop: propName,
            iid: inv.id,
        });
    });
}

function upsertTenantFromInvite(invite, activated = false) {
    const fullName = `${invite.firstName} ${invite.lastName}`;
    const p = PROPERTIES[invite.propertyId];
    const avatars = [IMG.avatar.sarah, IMG.avatar.david, IMG.avatar.michael];
    let listItem = TENANT_LIST.find(t =>
        t.propertyId === invite.propertyId && t.unit === invite.unit &&
        (t.name === fullName || t.status === 'pending')
    );
    const tid = listItem?.id ?? nextTenantListId();
    const chatId = ensureTenantConversation(fullName, p?.name || '', avatars[tid % avatars.length]);
    const rentRaw = String(invite.rent || p?.rent || '').replace(/[^\d]/g, '');
    const rentFmt = invite.rent?.startsWith('£') ? invite.rent : `£${parseInt(rentRaw || '0', 10).toLocaleString()}`;

    if (!listItem) {
        listItem = {
            id: tid, propertyId: invite.propertyId, chatId, name: fullName,
            prop: p?.name || '', unit: invite.unit,
            lease: formatLeaseRange(invite.leaseStart, invite.leaseEnd),
            leaseEnd: typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(invite.leaseEnd) : invite.leaseEnd,
            img: avatars[tid % avatars.length],
            status: activated ? 'active' : 'pending',
            rent: rentFmt.includes('/mo') ? rentFmt : `${rentFmt}/mo`,
        };
        TENANT_LIST.push(listItem);
        TENANTS.push({
            id: tid, propertyId: invite.propertyId, firstName: invite.firstName, lastName: invite.lastName,
            email: invite.email, phone: invite.phone, prop: p?.name || '', unit: invite.unit,
            idNumber: invite.idNumber || '', dob: invite.dob || '', nidProof: invite.nidProof || 'NID Proof.jpg',
            rent: rentRaw, moveIn: invite.leaseStart, leaseEnd: invite.leaseEnd,
            emergency: '—', emergencyPhone: '—',
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
            moveIn: invite.leaseStart, leaseEnd: invite.leaseEnd, rent: rentRaw,
        });
    }
    ensureTenantNidProof(tid, invite.nidProof || 'NID Proof.jpg');

    let ten = AppStore.tenancies.find(x => x.propertyId === invite.propertyId && x.unit === invite.unit && x.status !== 'ended');
    if (!ten) {
        AppStore.tenancies.push({
            id: AppStore.nextId(AppStore.tenancies), propertyId: invite.propertyId, tenantId: tid,
            type: 'solo', unit: invite.unit, rent: rentFmt, start: invite.leaseStart, end: invite.leaseEnd,
            status: activated ? 'active' : 'pending', members: [], occupants: 1,
        });
    } else {
        ten.tenantId = tid;
        ten.unit = invite.unit;
        ten.rent = rentFmt;
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
    upsertTenantFromInvite(invite, true);
    if (typeof ensureLandlordConversation === 'function') ensureLandlordConversation(invite);
    pushNotification({
        icon: 'user-check', color: ['#ECFDF5', '#059669'],
        title: 'Tenant activated', desc: `${invite.firstName} ${invite.lastName} joined the portal`,
        time: 'Just now', unread: true, screen: 'tenant-detail', opts: { tid: tenantListByProperty(invite.propertyId)?.id ?? 0 },
    });
}

function pushNotification(n) {
    NOTIFICATIONS.unshift(n);
    AppStore.save();
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
    const { occupiedFlats, units } = propertyHubStats(propertyId);
    if (!units.length || occupiedFlats === 0) return { label: 'Vacant', bg: '#FEF3C7', color: '#D97706' };
    if (occupiedFlats === units.length) return { label: 'Fully occupied', bg: '#DCFCE7', color: '#16A34A' };
    return { label: 'Active', bg: '#DCFCE7', color: '#16A34A' };
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
    return `${units.length} flat${units.length === 1 ? '' : 's'} · ${occupiedFlats}/${units.length} occupied · ${rent}`;
}

function renderPropertyQuickLinks(propertyId) {
    const { docs, openMaint } = propertyHubStats(propertyId);
    const items = [
        ['shield', 'Building info', 'details', 'Photos, utilities & certificates', '#F3E8FF', '#7C3AED'],
        ['file-text', 'Documents', 'documents', docs.length ? `${docs.length} file${docs.length === 1 ? '' : 's'}` : 'Property files', '#ECFDF5', '#059669'],
        ['wrench', 'Maintenance', 'maintenance', openMaint ? `${openMaint} open` : 'No open issues', '#FFF7ED', '#EA580C'],
        ['shield-check', 'Compliance', 'compliance', propertyComplianceHubLabel(propertyId), '#ECFDF5', '#16A34A'],
    ];
    return `
    <div class="card overflow-hidden">
        ${items.map(([ic, label, tab, status, bg, color]) => `
        <button data-tab="${tab}" class="prop-menu-item">
            <div class="prop-menu-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
            <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold text-[#0F172A]">${label}</p>
                ${status ? `<p class="text-[11px] text-[#64748B] mt-0.5">${status}</p>` : ''}
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>`).join('')}
    </div>`;
}

function renderPropertyUnitsTab(propertyId) {
    const p = PROPERTIES[propertyId];
    syncPropertyStatus(propertyId);
    ensureFlatPhotos(propertyId);
    const units = getPropertyUnits(propertyId);
    const groupFloors = shouldGroupFlatsByFloor(propertyId);
    const renderFlatRow = (u) => renderPropertyFlatRow(propertyId, u);
    const flatList = groupFloors
        ? [...new Set(units.map(u => u.floor || 1))].sort((a, b) => a - b).map(floor => {
            const floorUnits = units.filter(u => (u.floor || 1) === floor);
            const note = floorUnits[0]?.floorNote;
            return `
            <div class="prop-hub-floor-group">
                <p class="prop-hub-floor-label">${formatFloorLabel(floor)}${note ? ` · ${note}` : ''}</p>
                <div class="stack-sm">${floorUnits.map(renderFlatRow).join('')}</div>
            </div>`;
        }).join('')
        : `<div class="stack-sm">${units.map(renderFlatRow).join('')}</div>`;
    return `
    <div class="screen-content screen-content-sm prop-hub-page">
        ${renderTenancyDemoTip(propertyId)}
        <div class="screen-list-header">
            <div>
                <h2>Flats</h2>
                <p>${propertyHubMetaLine(propertyId)}</p>
            </div>
            <button data-go="add-flat" data-pid="${propertyId}" class="header-text-link">+ Add</button>
        </div>
        ${flatList}
        ${renderPropertyQuickLinks(propertyId)}
    </div>`;
}

function flatDetailMetaLine(u, tenancy, members = []) {
    const rent = String(tenancy?.rent || u.rent || '—').replace(/\s*\/month/i, '').trim();
    const rentPart = rent === '—' ? '—' : `${rent}/month`;
    const parts = [rentPart, flatSpecLine(u)];
    return parts.join(' · ');
}

function renderFlatDetailChips(u, tenancy, members = []) {
    const rent = String(tenancy?.rent || u.rent || '—').replace(/\s*\/month/i, '').trim();
    const chips = [];
    if (tenancy?.type) {
        chips.push(`<span class="flat-chip flat-chip--${tenancy.type}">${tenancy.type === 'group' ? `Group · ${members.length} people` : 'Solo'}</span>`);
    }
    if (rent !== '—') chips.push(`<span class="flat-chip">${rent}/mo</span>`);
    if (u.beds) chips.push(`<span class="flat-chip">${u.beds} bed</span>`);
    if (u.baths) chips.push(`<span class="flat-chip">${u.baths} bath</span>`);
    const lead = members.find(m => m.isLead) || members[0];
    if (lead?.name && tenancy?.type !== 'group') {
        chips.push(`<span class="flat-chip flat-chip--person">${lead.name.split(' ')[0]}</span>`);
    }
    return chips.length ? `<div class="flat-detail-chips">${chips.join('')}</div>` : '';
}

function renderFlatOccupiedPanel(propertyId, unit) {
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unit);
    const isGroup = tenancy?.type === 'group';
    const leaseLine = tenancy
        ? `${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.start) : tenancy.start} – ${typeof formatDisplayDate === 'function' ? formatDisplayDate(tenancy.end) : tenancy.end}`
        : '—';
    const humanLine = flatTenancyHumanLine(tenancy, members);
    const membersLabel = isGroup ? `Who lives here` : 'Tenant';
    return `
    <div class="card flat-tenancy-panel flat-tenancy-panel--occupied flat-tenancy-panel--human ${isGroup ? 'flat-tenancy-panel--group' : 'flat-tenancy-panel--solo'}">
        <div class="flat-tenancy-panel-accent" aria-hidden="true"></div>
        <div class="flat-tenancy-panel-head">
            <div class="min-w-0">
                <div class="flat-tenancy-panel-tags">
                    ${tenancy ? tenancyTypePill(tenancy.type) : ''}
                    <span class="flat-tenancy-panel-rent">${tenancy?.rent || '—'}/month</span>
                </div>
                <p class="flat-tenancy-human">${humanLine}</p>
                <p class="flat-tenancy-dates">${leaseLine}</p>
            </div>
            ${tenancy ? `<button data-go="tenancy-detail" data-pid="${propertyId}" data-unit="${unit}" class="flat-tenancy-view-btn">Details</button>` : ''}
        </div>
        ${count ? `
        <div class="flat-tenancy-panel-members">
            <p class="flat-tenancy-panel-members-label">${membersLabel}</p>
            <div class="member-list-human">${members.map(m => renderMemberRow(m, propertyId, unit)).join('')}</div>
        </div>` : `
        <div class="flat-tenancy-panel-members">
            <p class="flat-tenancy-panel-members-empty">No one added to this lease yet.</p>
            <button data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="btn-secondary w-full py-2.5 text-[13px] mt-2">Invite someone</button>
        </div>`}
    </div>`;
}

function screenFlatDetail() {
    const propertyId = STATE.propertyId;
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[propertyId];
    const u = getUnitByName(propertyId, unit);
    if (!u) return `${topBar('Flat', { back: true })}<div class="screen-content"><p class="ux-intro">Flat not found.</p></div>`;
    ensureFlatPhotos(propertyId);
    const thumb = getFlatCoverPhoto(propertyId, unit);
    const occ = u.status === 'occupied';
    const { tenancy, members, count } = getFlatMemberRoster(propertyId, unit);
    const pendingInvite = pendingInvitesForProperty(propertyId).find(i => i.unit === unit);
    const statusLabel = occ ? 'Occupied' : 'Vacant';
    const statusBg = occ ? '#DCFCE7' : '#FEF3C7';
    const statusColor = occ ? '#16A34A' : '#D97706';
    const moreLinks = [
        ['zap', 'Utilities', 'unit-utilities', '#FFFBEB', '#D97706'],
        ['wrench', 'Report issue', 'log-maintenance', '#FFF7ED', '#EA580C'],
        ['copy', 'Duplicate flat', 'add-flat', '#EFF6FF', '#2563EB', `data-duplicate-from="${unit}"`],
    ];
    return `
    <div class="flat-detail-page screen-enter">
        <div class="flat-detail-hero">
            <img src="${thumb}" class="img-cover" alt="">
            <div class="absolute inset-0 hero-gradient"></div>
            <button data-action="back" class="flat-detail-fab flat-detail-fab--left" aria-label="Back"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <button type="button" data-action="upload-flat-photo" class="flat-detail-fab flat-detail-fab--right" title="Change flat photo" aria-label="Change flat photo"><i data-lucide="camera" class="w-5 h-5"></i></button>
        </div>
        <div class="flat-detail-body screen-content screen-content-sm">
            <div class="flat-detail-summary card">
                <div class="flat-detail-summary-top">
                    <div class="flat-detail-summary-main">
                        <p class="flat-detail-property">${p.name}</p>
                        <div class="flat-detail-title-row">
                            <h1 class="flat-detail-name">${unitName(u)}</h1>
                            <span class="badge shrink-0" style="background:${statusBg};color:${statusColor}">${statusLabel}</span>
                        </div>
                        <p class="flat-detail-meta">${flatDetailMetaLine(u, tenancy, members)}</p>
                        ${renderFlatDetailChips(u, tenancy, members)}
                    </div>
                    <button data-go="edit-flat" data-pid="${propertyId}" data-unit="${unit}" class="flat-detail-edit" aria-label="Edit flat">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            ${occ || tenancy || count ? renderFlatOccupiedPanel(propertyId, unit) : `
            <div class="card flat-tenancy-panel flat-tenancy-panel--empty">
                <div class="flat-empty-state">
                    <div class="flat-empty-illustration" aria-hidden="true">
                        <span class="flat-empty-home">🏠</span>
                        <span class="flat-empty-spark">✦</span>
                    </div>
                    <p class="flat-empty-title">This flat is empty</p>
                    <p class="flat-empty-desc">When you're ready, set up the lease or invite someone to move in.</p>
                </div>
                <div class="flat-tenancy-panel-actions">
                    <button data-go="create-tenancy" data-pid="${propertyId}" class="btn-secondary flex-1 py-2.5 text-[13px]">Set up lease</button>
                    <button data-go="invite-tenant" data-pid="${propertyId}" data-unit="${unit}" class="btn-primary flex-1 py-2.5 text-[13px]">Invite tenant</button>
                </div>
            </div>`}
            ${!occ && pendingInvite ? `
            <button data-go="tenant-invite-sent" data-invite-token="${pendingInvite.token}" class="flat-invite-banner card w-full text-left">
                <div class="flat-invite-banner-icon"><i data-lucide="mail" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="flat-invite-banner-title">Invite pending</p>
                    <p class="flat-invite-banner-meta">${pendingInvite.firstName} ${pendingInvite.lastName} · waiting to accept</p>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
            </button>` : ''}
            <div class="card overflow-hidden">
                ${moreLinks.map(([ic, label, go, bg, color, extra = '']) => `
                <button data-go="${go}" data-pid="${propertyId}" data-unit="${unit}" ${extra} class="prop-menu-item">
                    <div class="prop-menu-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
                    <p class="flex-1 text-[13px] font-semibold text-[#0F172A]">${label}</p>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
                </button>`).join('')}
            </div>
            ${canDeleteFlat(propertyId, unit) ? `
            <div class="flat-danger-zone">
                ${dangerZoneButton('Remove flat', 'delete-flat')}
            </div>` : ''}
        </div>
    </div>`;
}

function renderPropertyTenantTab(propertyId) {
    const p = PROPERTIES[propertyId];
    syncPropertyStatus(propertyId);
    const units = getPropertyUnits(propertyId);
    const pendingInvites = pendingInvitesForProperty(propertyId);
    const activeMemberTotal = units.reduce((n, u) => n + getFlatMemberRoster(propertyId, unitName(u)).count, 0);

    if (!activeMemberTotal && !pendingInvites.length) {
        return `
        <div class="screen-content screen-content-sm prop-hub-page">
            <div class="card p-8 text-center">
                <i data-lucide="users" class="w-12 h-12 text-[#CBD5E1] mx-auto"></i>
                <p class="text-[14px] font-semibold mt-3 text-[#0F172A]">No tenancies yet</p>
                <p class="text-[12px] text-[#64748B] mt-1">Set up a tenancy per flat, then invite members.</p>
            </div>
            <button data-go="create-tenancy" data-pid="${propertyId}" class="btn-primary w-full py-3 text-[13px]">Create tenancy</button>
        </div>`;
    }

    const flatRows = units.map(u => renderPropertyFlatRow(propertyId, u, {
        tenantsOnly: true,
        showTypePill: true,
        pendingInvites,
    })).filter(Boolean).join('');

    return `
    <div class="screen-content screen-content-sm prop-hub-page">
        ${renderTenancyDemoTip(propertyId)}
        <div class="screen-list-header">
            <div>
                <h2>Tenants</h2>
                <p>${activeMemberTotal} member${activeMemberTotal === 1 ? '' : 's'}${pendingInvites.length ? ` · ${pendingInvites.length} pending` : ''}</p>
            </div>
            <button data-go="create-tenancy" data-pid="${propertyId}" class="header-text-link">+ Add</button>
        </div>
        ${flatRows ? `<div class="stack-sm">${flatRows}</div>` : ''}
    </div>`;
}

function renderPropertyTimelineTab(propertyId) {
    const events = [];
    const p = PROPERTIES[propertyId];
    AppStore.tenancies.filter(t => t.propertyId === propertyId).forEach(t => {
        const typeLabel = t.type === 'group' ? 'Group tenancy' : 'Solo tenancy';
        if (t.status === 'ended') events.push(['#94A3B8', 'Tenancy ended', `${t.unit} · ${t.leadName || 'Tenant'}`, typeof formatDisplayDate === 'function' ? formatDisplayDate(t.end) || t.end : t.end]);
        else if (t.status === 'active') events.push([t.type === 'group' ? '#7C3AED' : '#2563EB', typeLabel, `${t.unit} · ${t.rent || ''}`, typeof formatDisplayDate === 'function' ? formatDisplayDate(t.start) || t.start : t.start]);
        else events.push(['#F59E0B', `${typeLabel} created`, `${t.unit} · pending tenant`, typeof formatDisplayDate === 'function' ? formatDisplayDate(t.start) || t.start : t.start]);
    });
    pendingInvitesForProperty(propertyId).forEach(inv => {
        events.push(['#D97706', 'Invite sent', `${inv.unit} · ${inv.firstName} ${inv.lastName}`, inv.sentAt || 'Pending']);
    });
    AppStore.inspections.filter(i => i.propertyId === propertyId).slice(0, 3).forEach(i => {
        events.push(['#F59E0B', 'Inspection', `${i.type || 'Inspection'} · ${i.date}`, i.scheduled ? 'Scheduled' : 'Completed']);
    });
    MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId).slice(0, 3).forEach(m => {
        events.push(['#22C55E', m.status === 'done' ? 'Maintenance done' : 'Maintenance logged', m.issue, m.time]);
    });
    if (p?.occupancyLabel) events.push(['#2563EB', 'Occupancy', p.occupancyLabel, p.status]);
    events.push(['#94A3B8', 'Property in portfolio', p?.name || '', 'Added']);
    return `
    <div class="screen-content">
        <div class="relative pl-7 space-y-4 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2E8F0]">
            ${events.map(([c, t, d, time]) => `
            <div class="relative">
                <div class="absolute -left-7 w-4 h-4 rounded-full border-[3px] border-[#F8FAFC] shadow-sm" style="background:${c}"></div>
                <div class="card p-3.5"><p class="text-[13px] font-semibold">${t}</p><p class="text-[12px] text-[#64748B]">${d}</p><p class="text-[10px] text-[#94A3B8] mt-1">${time}</p></div>
            </div>`).join('')}
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
    </div>`;
}

function screenDocumentPreviewEnhanced() {
    let name = 'Document';
    let type = 'File';
    let date = '—';
    let docId = null;
    if (STATE.previewDocSource === 'tenant-nid') {
        const tid = STATE.tenantId ?? 0;
        const proof = getTenantNidProof(tid);
        if (proof) { name = proof.name; type = 'NID Document Proof'; date = proof.date; }
    } else if (STATE.previewDocSource === 'tenant') {
        const docs = getTenantDocuments(STATE.tenantId ?? 0);
        const row = docs[STATE.previewDocIdx ?? 0];
        if (row) { name = row[1]; type = 'Tenant Document'; date = row[2]; }
    } else {
        const doc = AppStore.documents.find(d => d.id === STATE.previewDocId);
        if (doc) { name = doc.name; type = doc.type; date = doc.date; docId = doc.id; }
    }
    const prop = PROPERTIES[STATE.propertyId]?.name || '';
    return `${topBar('Document', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center mt-2">
            <i data-lucide="file-text" class="w-16 h-16 text-[#2563EB] mx-auto"></i>
            <p class="text-[14px] font-bold mt-4">${name}</p>
            <p class="text-[13px] text-[#64748B]">${type}${prop ? ` · ${prop}` : ''} · PDF · 2.4 MB</p>
            <p class="text-[12px] text-[#94A3B8] mt-1">${date}</p>
        </div>
        <div class="card mt-4 p-4 bg-[#F8FAFC] min-h-[300px] flex items-center justify-center">
            <p class="text-[13px] text-[#94A3B8]">Preview of ${name}</p>
        </div>
        <div class="grid grid-cols-2 gap-3 mt-4">
            <button data-action="download-doc" class="btn-secondary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="download" class="w-4 h-4"></i>Download</button>
            ${docId != null ? `<button data-action="share-doc" data-doc="${docId}" class="btn-primary py-3 text-[13px] flex items-center justify-center gap-2"><i data-lucide="share-2" class="w-4 h-4"></i>Share</button>` : `<button data-action="toast" data-msg="Document saved" class="btn-primary py-3 text-[13px]">Save</button>`}
        </div>
        ${docId != null && type === 'Custom Document' ? `
        <div class="danger-zone">
            ${dangerZoneButton('Delete document', 'delete-document', `data-doc="${docId}"`)}
        </div>` : ''}
    </div>`;
}

function getUnreadNotifCount() {
    return (NOTIFICATIONS || []).filter(n => n.unread).length;
}

function screenDashboardEnhanced() {
    const stats = portfolioStats();
    const openMaint = MAINTENANCE_ITEMS.filter(m => m.status === 'open').length;
    const fin = financialStats();
    const overdueAmt = INVOICES.filter(i => i.status === 'Overdue').reduce((s, i) => s + parseInt(i.amount.replace(/[^\d]/g, ''), 10), 0);
    const overdueAmount = overdueAmt ? `£${overdueAmt.toLocaleString()}` : null;
    const collectedPct = fin.pct;
    const compliantCount = PROPERTIES.filter(p => p.compliance).length;
    const compliancePct = PROPERTIES.length ? Math.round((compliantCount / PROPERTIES.length) * 100) : 0;
    const unreadBell = getUnreadNotifCount();
    const landlordName = LANDLORD_USER.firstName || 'John';
    const reminders = AppStore.reminders.slice(0, 3).map(r => {
        const prop = PROPERTIES[r.propertyId];
        const rt = REMINDER_TYPES.find(t => t[0] === r.type) || ['custom', r.title, 'bell', '#EFF6FF', '#2563EB'];
        const tab = r.type === 'inspection' ? 'inspection' : r.type === 'rent-review' ? 'units' : 'compliance';
        return [rt[2], r.title, prop?.name || '', `${r.daysLeft} days left`, rt[3], rt[4], r.propertyId, tab, r.urgency];
    });
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <div class="flex items-center gap-2">
            <button data-go="global-search" class="top-icon-btn"><i data-lucide="search" class="w-[20px] h-[20px]"></i></button>
            <button data-go="notifications-list" class="top-icon-btn relative">
                <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
                ${unreadBell ? `<span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">${unreadBell}</span>` : ''}
            </button>
        </div>
    </div>
    <div class="dash-greeting-row">
        <img src="${IMG.avatar.john}" class="dash-avatar" alt="">
        <div>
            <p class="dash-greeting">${dashGreeting()}, ${landlordName}</p>
            <p class="dash-date">${dashDateLabel()}</p>
        </div>
    </div>
</div>
    <div class="screen-content screen-enter">
        <div class="dash-hero">
            <div class="dash-hero-glow"></div>
            ${buildingSvg}
            <div class="dash-hero-top">
                <span class="dash-hero-label">Monthly income</span>
                <button data-go="properties" class="dash-hero-link">View portfolio</button>
            </div>
            <p class="dash-hero-amount">£${stats.monthlyRent.toLocaleString()}</p>
            <p class="dash-hero-sub">From ${stats.occupiedUnits} occupied flat${stats.occupiedUnits === 1 ? '' : 's'} across ${stats.buildingCount} building${stats.buildingCount === 1 ? '' : 's'}</p>
            <div class="dash-hero-stats">
                <button data-go="properties" class="dash-hero-stat"><strong>${stats.buildingCount}</strong><span>Buildings</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="tenants" class="dash-hero-stat"><strong>${stats.activeTenants}</strong><span>Tenants</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="properties" class="dash-hero-stat"><strong>${stats.occupancy}%</strong><span>Occupied</span></button>
            </div>
        </div>
        ${overdueAmount ? `
        <button data-go="financial" data-invoice-preset="overdue" class="dash-alert">
            <div class="dash-alert-icon"><i data-lucide="alert-circle" class="w-5 h-5"></i></div>
            <div class="dash-alert-body">
                <p class="dash-alert-title">${overdueAmount} overdue rent</p>
                <p class="dash-alert-desc">Tap to create invoice or mark rent received</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 dash-alert-chevron"></i>
        </button>` : ''}
        ${compliancePct < 100 ? `
        <button data-go="compliance-dashboard" class="dash-alert" style="margin-top:8px">
            <div class="dash-alert-icon" style="background:#FEF3C7;color:#D97706"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
            <div class="dash-alert-body">
                <p class="dash-alert-title">Compliance action needed</p>
                <p class="dash-alert-desc">${compliantCount}/${PROPERTIES.length} properties fully compliant — review certificates</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 dash-alert-chevron"></i>
        </button>` : ''}
        <div class="dash-quick">
            ${[['house-plus','Add Property','add-property','primary'],['wrench','Log Issue','log-maintenance','warning'],['credit-card','Finances','financial','success'],['users','Tenants','tenants','indigo']].map(([ic,l,go,tone])=>`
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-[22px] h-[22px]"></i></div>
                <span>${l}</span>
            </button>`).join('')}
        </div>
        <div class="dash-stat-grid">
            ${dashStatCard({ go: 'maintenance', variant: 'issues', icon: 'wrench', label: 'Open Issues', value: openMaint, pill: openMaint ? 'Action' : null })}
            ${dashStatCard({ go: 'financial', variant: 'collected', icon: 'trending-up', label: 'Collected', value: `${collectedPct}%`, pill: null })}
            ${dashStatCard({ go: 'properties', variant: 'vacant', icon: 'home', label: 'Vacant Flats', value: stats.vacantUnits, pill: stats.vacantUnits ? 'Fill' : null })}
            ${dashStatCard({ go: 'compliance-dashboard', variant: 'compliant', icon: 'shield-check', label: 'Compliant', value: `${compliancePct}%`, pill: compliancePct === 100 ? 'OK' : null })}
        </div>
        <div>
            <div class="dash-section-head">
                <h3 class="screen-section-title">Reminders</h3>
                <button data-go="reminders" class="dash-view-all">View all</button>
            </div>
            ${reminders.length ? reminders.map(([ic,title,sub,time,bg,color,pid,tab])=>`
            <button data-go="property-detail" data-pid="${pid}" data-tab="${tab}" class="dash-reminder-row card w-full text-left p-4 mb-2">
                <div class="flex items-center gap-3">
                    <div class="dash-reminder-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-[18px] h-[18px]"></i></div>
                    <div class="flex-1"><p class="text-[13px] font-semibold">${title}</p><p class="text-[11px] text-[#64748B]">${sub} · ${time}</p></div>
                </div>
            </button>`).join('') : `<p class="text-[13px] text-[#64748B] px-1">No upcoming reminders</p>`}
        </div>
        <div>
            <div class="dash-section-head"><h3 class="screen-section-title">Recent notifications</h3><button data-go="notifications-list" class="dash-view-all">See all</button></div>
            <div class="card divide-y divide-[#F1F5F9]">${NOTIFICATIONS.slice(0, 3).map(n => notifRow(n)).join('')}</div>
        </div>
    </div>`;
}

function screenTenantsEnhanced() {
    const q = STATE.search.tenants.toLowerCase();
    const f = STATE.tenantFilter;
    const filtered = TENANT_LIST.filter(t => {
        const matchQ = !q || t.name.toLowerCase().includes(q) || t.prop.toLowerCase().includes(q);
        const matchF = f === 'all' || t.status === f;
        return matchQ && matchF;
    });
    const counts = {
        all: TENANT_LIST.length + pendingTenantInviteCount(),
        active: TENANT_LIST.filter(t => t.status === 'active').length,
        inactive: TENANT_LIST.filter(t => t.status === 'inactive').length,
        pending: pendingTenantInviteCount(),
    };
    const defaultPid = PROPERTIES.find(p => p.status === 'Vacant')?.id ?? PROPERTIES[0]?.id ?? 0;
  return `${topBar('Tenants', { back: true, sub: `${counts.active} active · ${counts.pending} pending invite${counts.pending === 1 ? '' : 's'}` })}
    <div class="screen-content screen-enter">
        <div class="search-bar">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="tenants" type="text" value="${STATE.search.tenants}" placeholder="Search tenants..." class="flex-1 text-[13px] bg-transparent border-none outline-none">
        </div>
        <div class="filter-tabs">
            ${[['all','All',counts.all],['active','Active',counts.active],['pending','Pending',counts.pending],['inactive','Inactive',counts.inactive]].map(([k,l,n])=>`
            <button type="button" data-tenant-filter="${k}" class="filter-chip ${f===k?'active':''}">${l} (${n})</button>`).join('')}
        </div>
        <div class="stack-sm mt-2">
            ${filtered.length ? filtered.map(t => tenantListRow(t)).join('') : `
            <div class="tenant-empty card"><i data-lucide="users" class="w-10 h-10 text-[#CBD5E1]"></i><p class="tenant-empty-title">No tenants found</p></div>`}
        </div>
        <button type="button" data-go="select-property-invite" class="btn-primary tenant-add-btn"><i data-lucide="plus" class="w-5 h-5"></i> Invite Tenant</button>
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
    if (n === 1) return occupied ? '1 flat · occupied' : '1 flat · vacant';
    let label = `${n} flats`;
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
    if (!u) return '';
    if (u.floorNote) return u.floorNote;
    if (u.floor != null && u.floor !== '' && shouldGroupFlatsByFloor !== undefined) return '';
    return '';
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
    const occupiedNames = new Set(activeTenancies.map(t => t.unit));
    units.forEach(u => {
        u.status = occupiedNames.has(unitName(u)) ? 'occupied' : 'vacant';
        const tenancy = activeTenancies.find(t => t.unit === unitName(u));
        if (tenancy?.rent) u.rent = tenancy.rent.startsWith('£') ? tenancy.rent : `£${parseRentAmount(tenancy.rent).toLocaleString()}`;
    });
    const occupied = units.filter(u => u.status === 'occupied').length;
    const total = units.length;
    if (occupied === 0) {
        p.status = 'Vacant';
        p.statusColor = ['#FEF3C7', '#D97706'];
        p.occupancyLabel = total === 1 ? 'Vacant' : `${total} vacant`;
    } else if (occupied < total) {
        p.status = 'Partial';
        p.statusColor = ['#DBEAFE', '#2563EB'];
        p.occupancyLabel = `${occupied}/${total} occupied`;
    } else {
        p.status = 'Full';
        p.statusColor = ['#DCFCE7', '#16A34A'];
        p.occupancyLabel = total === 1 ? 'Occupied' : 'Full';
    }
}

function parseRentAmount(val) {
    return parseInt(String(val ?? '').replace(/[^\d]/g, ''), 10) || 0;
}

function formatRentAmount(n) {
    return n ? `£${n.toLocaleString()}` : '—';
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
    const { collected, min } = getPropertyRentSummary(propertyId);
    if (collected > 0) return `${formatRentAmount(collected)}/mo`;
    return min ? `from ${formatRentAmount(min)}/mo` : 'Not set';
}

function propertyRentListLabel(propertyId) {
    const { collected, potential, min, flatCount } = getPropertyRentSummary(propertyId);
    if (collected > 0) {
        if (flatCount > 1 && collected < potential) return `${formatRentAmount(collected)}/mo collected`;
        return `${formatRentAmount(collected)}/mo`;
    }
    if (flatCount > 1 && min) return `from ${formatRentAmount(min)}/mo`;
    if (potential) return `${formatRentAmount(potential)}/mo`;
    return 'Rent not set';
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
        };
    }
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

function suggestContractorForIssue(item) {
    const text = `${item?.issue || ''} ${item?.desc || ''}`.toLowerCase();
    if (/boiler|radiator|heat|gas|hot water/.test(text)) return CONTRACTORS.find(c => c.trade === 'Heating') || CONTRACTORS[1];
    if (/light|electric|flicker|socket|fuse/.test(text)) return CONTRACTORS.find(c => c.trade === 'Electrical') || CONTRACTORS[2];
    if (/sink|tap|leak|pipe|plumb|water|damp/.test(text)) return CONTRACTORS.find(c => c.trade === 'Plumbing') || CONTRACTORS[0];
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
            ${chatId != null ? `<button data-go="chat" data-chat="${chatId}" class="maint-tenant-complaint-chat">Message</button>` : ''}
        </div>
        <p class="maint-tenant-complaint-text">"${item.desc || item.issue}"</p>
        <p class="maint-tenant-complaint-meta">Reported ${reportedWhen}</p>
    </div>`;
}

function renderMaintAssignmentStatus(item, contractorJob) {
    const assigned = item.contractor && item.contractor !== '—';
    const steps = [
        { label: 'Tenant reported', done: true, detail: isTenantMaintReport(item) ? (item.tenantName || 'Tenant') : 'Logged' },
        { label: 'Contractor assigned', done: assigned, detail: assigned ? item.contractor : 'Not yet' },
        { label: item.status === 'done' ? 'Resolved' : 'Work in progress', done: item.status === 'done', detail: contractorJob?.visitDate || (item.status === 'progress' ? 'On site' : 'Pending') },
    ];
    return `
    <div class="maint-assign-flow card">
        <p class="maint-assign-flow-title">What happens next</p>
        ${steps.map((s, i) => `
        <div class="maint-assign-step ${s.done ? 'maint-assign-step--done' : ''}">
            <span class="maint-assign-step-dot">${s.done ? '✓' : i + 1}</span>
            <div>
                <p class="maint-assign-step-label">${s.label}</p>
                <p class="maint-assign-step-meta">${s.detail}</p>
            </div>
        </div>`).join('')}
    </div>`;
}

function getTenantChatId(tenantId) {
    const t = TENANTS[tenantId];
    if (!t) return 0;
    const name = `${t.firstName} ${t.lastName}`;
    const conv = CONVERSATIONS.find(c => c.name === name);
    return conv?.id ?? 0;
}

function sendChatMessage() {
    const input = document.querySelector('[data-chat-input]');
    const text = (input?.value || STATE.chatDraft || '').trim();
    if (!text) return;
    const c = conversation(STATE.chatId);
    const time = formatEventTime();
    c.messages.push({ type: 'out', text, time: `${time} · Sent` });
    c.preview = text.length > 48 ? `${text.slice(0, 48)}…` : text;
    c.time = time;
    c.unread = 0;
    STATE.chatDraft = '';
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
                    title: `Lease ending · ${ten.unit || 'Flat'}`,
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
            r.daysLeft = Math.max(0, left);
            r.urgency = r.daysLeft <= 7 ? 'high' : r.daysLeft <= 30 ? 'medium' : 'low';
        }
    });
    if (persist) AppStore.save();
}

function financialStats() {
    const parseAmt = (s) => parseInt(String(s).replace(/[^\d]/g, ''), 10) || 0;
    const total = INVOICES.reduce((s, i) => s + parseAmt(i.amount), 0);
    const collected = INVOICES.filter(i => i.status === 'Paid').reduce((s, i) => s + parseAmt(i.amount), 0);
    const outstanding = INVOICES.filter(i => i.status !== 'Paid').reduce((s, i) => s + parseAmt(i.amount), 0);
    const overdue = INVOICES.filter(i => i.status === 'Overdue').reduce((s, i) => s + parseAmt(i.amount), 0);
    const pending = INVOICES.filter(i => i.status === 'Pending').reduce((s, i) => s + parseAmt(i.amount), 0);
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
    const statusLabel = inv.status === 'Overdue' ? 'Overdue' : inv.status === 'Pending' ? 'Pending' : 'Paid';
    return `
    <button type="button" data-go="invoice-detail" data-iid="${inv.id}" class="fin-inv-row">
        <div class="fin-inv-icon" style="background:${meta.bg};color:${meta.color}">
            <i data-lucide="building-2" class="w-[18px] h-[18px]"></i>
        </div>
        <div class="fin-inv-body">
            <p class="fin-inv-prop">${inv.tenant || meta.propShort}${inv.unit ? ` · ${inv.unit}` : ''}</p>
            <p class="fin-inv-due">Due ${inv.due}</p>
            <p class="fin-inv-num">${inv.num}</p>
        </div>
        <div class="fin-inv-right">
            <p class="fin-inv-amount">${inv.amount}</p>
            <span class="fin-inv-status" style="background:${bg};color:${color}">${statusLabel}</span>
        </div>
        <i data-lucide="chevron-right" class="fin-inv-chevron w-5 h-5"></i>
    </button>`;
}

function screenFinancialEnhanced() {
    const f = STATE.invoiceFilter;
    const statusMap = { pending: 'Pending', paid: 'Paid', overdue: 'Overdue' };
    const filtered = f === 'all' ? INVOICES : INVOICES.filter(inv => inv.status === statusMap[f]);
    const counts = {
        all: INVOICES.length,
        pending: INVOICES.filter(i => i.status === 'Pending').length,
        paid: INVOICES.filter(i => i.status === 'Paid').length,
        overdue: INVOICES.filter(i => i.status === 'Overdue').length,
    };
    const stats = financialStats();
    return `${topBar('Finances')}
    <div class="screen-content screen-enter financial-page">
        ${counts.overdue ? `
        <button type="button" data-go="mark-rent-received" class="fin-alert">
            <span class="fin-alert-icon"><i data-lucide="alert-triangle" class="w-5 h-5"></i></span>
            <span class="fin-alert-text"><strong>${counts.overdue} rent overdue</strong> — £${stats.overdue.toLocaleString()} to collect</span>
            <i data-lucide="chevron-right" class="w-5 h-5 fin-alert-chevron"></i>
        </button>` : ''}
        <div class="fin-summary card">
            <div class="fin-summary-head">
                <p class="fin-summary-label">Total rent this month</p>
                <button type="button" data-go="transaction-history" class="fin-summary-link">Payment history <i data-lucide="chevron-right" class="w-4 h-4"></i></button>
            </div>
            <div class="fin-summary-hero">
                <div class="fin-summary-main">
                    <p class="fin-summary-amount">£${stats.total.toLocaleString()}</p>
                    <p class="fin-summary-hint">${stats.pct}% collected · £${stats.collected.toLocaleString()} received so far</p>
                </div>
                <div class="fin-donut" style="--fin-pct:${stats.pct}">
                    <div class="fin-donut-hole">
                        <span class="fin-donut-pct">${stats.pct}%</span>
                        <span class="fin-donut-lbl">Collected</span>
                    </div>
                </div>
            </div>
            <div class="fin-summary-grid">
                <div class="fin-summary-box fin-summary-box--green">
                    <div class="fin-summary-box-icon"><i data-lucide="arrow-down-circle" class="w-4 h-4"></i></div>
                    <p class="fin-summary-box-label">Collected</p>
                    <p class="fin-summary-box-value">£${stats.collected.toLocaleString()}</p>
                </div>
                <div class="fin-summary-box fin-summary-box--amber">
                    <div class="fin-summary-box-icon"><i data-lucide="clock" class="w-4 h-4"></i></div>
                    <p class="fin-summary-box-label">Pending</p>
                    <p class="fin-summary-box-value">£${stats.pending.toLocaleString()}</p>
                </div>
                <div class="fin-summary-box fin-summary-box--red">
                    <div class="fin-summary-box-icon"><i data-lucide="alert-triangle" class="w-4 h-4"></i></div>
                    <p class="fin-summary-box-label">Overdue</p>
                    <p class="fin-summary-box-value">£${stats.overdue.toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div class="fin-actions">
            <button type="button" data-go="create-invoice" class="fin-btn-primary">
                <i data-lucide="plus" class="w-5 h-5"></i>
                <span>Create Invoice</span>
            </button>
            <button type="button" data-go="mark-rent-received" class="fin-btn-secondary">
                <i data-lucide="circle-check" class="w-5 h-5"></i>
                <span>Record Payment</span>
            </button>
            <button type="button" data-go="pay-contractor" class="fin-link-btn">Pay contractor bills <i data-lucide="chevron-right" class="w-4 h-4"></i></button>
        </div>
        <div class="fin-section-head">
            <h2 class="fin-section-title">Your invoices</h2>
        </div>
        <div class="fin-segments">
            ${[['all', 'All', counts.all], ['pending', 'Pending', counts.pending], ['paid', 'Paid', counts.paid], ['overdue', 'Overdue', counts.overdue]].map(([k, l, n]) => `
            <button type="button" data-invoice-filter="${k}" class="fin-segment ${f === k ? 'active' : ''}">
                <span class="fin-segment-label">${l}</span>
                ${k !== 'all' && n ? `<span class="fin-segment-count">${n}</span>` : ''}
            </button>`).join('')}
        </div>
        <div class="fin-invoice-list">
            ${filtered.length ? filtered.map(financialInvoiceCard).join('') : `
            <div class="fin-empty">
                <div class="fin-empty-icon"><i data-lucide="file-text" class="w-6 h-6"></i></div>
                <p class="fin-empty-title">No ${f === 'all' ? '' : f} invoices</p>
                <p class="fin-empty-sub">${f === 'all' ? 'Create your first invoice to start tracking rent.' : 'Try another filter or create a new invoice.'}</p>
                <button type="button" data-go="create-invoice" class="btn-primary py-2.5 px-5 text-[13px] mt-3">Create Invoice</button>
            </div>`}
        </div>
    </div>`;
}

function renderPropertyInspectionTab(propertyId) {
    const upcoming = AppStore.inspections.find(i => i.propertyId === propertyId && i.scheduled);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    return `
    <div class="screen-content screen-content-sm prop-hub-page">
        ${upcoming ? `
        <div class="card insp-upcoming">
            <p class="insp-upcoming-label">Upcoming</p>
            <p class="insp-upcoming-title">${upcoming.type || 'Inspection'}</p>
            <p class="insp-upcoming-date">${typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date}</p>
            <div class="insp-upcoming-actions">
                <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary py-2.5 text-[12px] flex-1">Reschedule</button>
                <button data-go="conduct-inspection" data-pid="${propertyId}" class="btn-primary py-2.5 text-[12px] flex-1">Conduct</button>
            </div>
        </div>` : `
        <div class="card insp-empty">
            <p class="insp-empty-text">No inspection scheduled</p>
            <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-primary w-full py-2.5 text-[12px]">Schedule inspection</button>
        </div>`}
        <div class="screen-list-header">
            <div><h2>Past reports</h2><p>${past.length} report${past.length === 1 ? '' : 's'}</p></div>
        </div>
        ${past.length ? `
        <div class="card overflow-hidden">
            ${past.map(i => `
            <button type="button" data-action="download-doc" class="prop-menu-item w-full text-left">
                <div class="prop-menu-icon" style="background:#EFF6FF;color:#2563EB"><i data-lucide="clipboard-check" class="w-[18px] h-[18px]"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-semibold text-[#0F172A]">${i.type || 'Inspection'}</p>
                    <p class="text-[11px] text-[#64748B] mt-0.5">${typeof formatDisplayDate === 'function' ? formatDisplayDate(i.date) || i.date : i.date}${i.report ? ` · ${i.report}` : ''}</p>
                </div>
                ${i.rating ? `<span class="badge bg-[#DCFCE7] text-[#16A34A] shrink-0">★ ${i.rating}</span>` : ''}
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
            </button>`).join('')}
        </div>` : `
        <div class="card p-6 text-center">
            <p class="text-[13px] text-[#64748B]">No past reports yet</p>
        </div>`}
        <button data-go="property-photos" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px]">Property photos</button>
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
    const contractorJob = typeof CONTRACTOR_JOBS !== 'undefined'
        ? CONTRACTOR_JOBS.find(j => j.maintId === item.id)
        : null;
    if (contractorJob && typeof syncContractorJobToMaintenance === 'function') {
        syncContractorJobToMaintenance(contractorJob);
    }
    const timeline = getMaintTimeline(item);
    if (contractorJob?.notes?.length) {
        contractorJob.notes.forEach(n => {
            if (!item.history?.some(h => h.event === 'Contractor note' && h.detail === n.text)) {
                addMaintHistoryEvent(item, 'Contractor note', n.text);
            }
        });
    }
    const contractorAvatar = item.contractor === 'Heating Co.' ? IMG.avatar.heating
        : item.contractor === 'Electric Fix' ? IMG.avatar.electric : IMG.avatar.plumber;
    const chatId = getContractorChatId(item.contractor);
    const tenant = getMaintTenantForItem(item);
    const tenantChatId = contractorJob?.tenantChatId ?? (tenant ? getTenantChatId(tenant.id) : null);
    const jobPhotos = contractorJob?.photos
        ? [...(contractorJob.photos.before || []), ...(contractorJob.photos.during || []), ...(contractorJob.photos.after || [])]
        : [];
    const photos = item.photos?.length ? item.photos : jobPhotos;
    const location = `${item.prop.split(',')[0]}${item.unit && item.unit !== '—' ? ` · ${item.unit}` : ''}`;
    const actions = [];
    if (item.contractor !== '—') {
        if (item.status !== 'done') actions.push(`<button data-action="go-assign-contractor" class="btn-secondary w-full py-3 text-[13px]">Reassign contractor</button>`);
        if (item.status === 'open') actions.push(`<button data-action="maint-status" data-status="progress" class="btn-primary w-full py-3 text-[13px]">Mark in progress</button>`);
        if (item.status === 'progress') actions.push(`<button data-action="maint-status" data-status="done" class="btn-primary w-full py-3.5 text-[14px]">Mark complete</button>`);
    }
    return `${topBar('Maintenance', { back: true })}
    <div class="screen-content screen-content-sm screen-enter prop-hub-page">
        <div class="maint-detail-summary card">
            <div class="maint-detail-top">
                <p class="maint-detail-title">${item.issue}</p>
                <div class="maint-detail-badges">
                    <span class="badge" style="background:${pBg};color:${pColor}">${item.priority}</span>
                    <span class="badge bg-[#F1F5F9] text-[#64748B]">${statusLabel}</span>
                    ${isTenantMaintReport(item) ? `<span class="badge" style="background:#FEF3C7;color:#B45309">Tenant report</span>` : ''}
                </div>
            </div>
            <p class="maint-detail-meta">${location} · ${item.time}</p>
            ${!isTenantMaintReport(item) ? `<p class="maint-detail-desc">${item.desc}</p>` : ''}
        </div>
        ${renderMaintTenantComplaint(item)}
        ${photos.length ? `
        <div class="maint-photo-strip">
            ${photos.slice(0, 3).map(src => `<div class="maint-photo-strip-item"><img src="${src}" class="img-cover" alt=""></div>`).join('')}
        </div>` : ''}
        ${renderMaintAssignmentStatus(item, contractorJob)}
        ${item.contractor !== '—' ? `
        <div class="member-row card w-full maint-contractor-row">
            <img src="${contractorAvatar}" class="member-row-avatar" alt="">
            <div class="member-row-body">
                <p class="member-row-name">${item.contractor}</p>
                <p class="member-row-meta">${contractorJob ? contractorJob.status.replace(/_/g, ' ') : 'Assigned — job sent to their app'}</p>
            </div>
            <div class="maint-detail-chats">
                ${chatId != null ? `<button data-go="chat" data-chat="${chatId}" class="header-text-link text-[12px]">Contractor</button>` : ''}
                ${tenantChatId != null ? `<button data-go="chat" data-chat="${tenantChatId}" class="header-text-link text-[12px]">Tenant</button>` : ''}
            </div>
        </div>` : `
        <div class="maint-assign-prompt card">
            <p class="maint-assign-prompt-title">Assign a contractor</p>
            <p class="maint-assign-prompt-text">They'll receive the tenant's complaint, property access details, and can update you when work is done.</p>
            <button data-action="go-assign-contractor" class="btn-primary w-full py-3 text-[13px] mt-3">Choose contractor</button>
        </div>`}
        ${actions.length ? `<div class="maint-detail-actions">${actions.join('')}</div>` : ''}
        ${item.status !== 'done' ? `
        <div class="danger-zone">
            ${dangerZoneButton('Cancel issue', 'cancel-maintenance', `data-mid="${item.id}"`)}
        </div>` : `<p class="text-[13px] text-center text-[#059669] font-semibold py-2">Issue resolved</p>`}
        ${timeline.length ? `
        <div class="screen-list-header"><div><h2>Timeline</h2></div></div>
        <div class="card maint-timeline">
            ${timeline.slice(0, 4).map(([t, d], idx) => `
            <div class="maint-timeline-item${idx < Math.min(timeline.length, 4) - 1 ? ' maint-timeline-item--border' : ''}">
                <p class="maint-timeline-title">${t}</p>
                <p class="maint-timeline-meta">${d}</p>
            </div>`).join('')}
        </div>` : ''}
    </div>`;
}

function screenInviteTenantEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    const selectedUnit = STATE.selectedUnit || '';
    const prefill = STATE.invitePrefill || {};
    const unitRent = selectedUnit
        ? (getUnitByName(STATE.propertyId, selectedUnit)?.rent || propertyDefaultFlatRent(STATE.propertyId))
        : propertyDefaultFlatRent(STATE.propertyId);
    const { tenancy, members } = selectedUnit ? getFlatMemberRoster(STATE.propertyId, selectedUnit) : { tenancy: null, members: [] };
    const pendingMembers = members.filter(m => !m.tenantId && m.accountStatus !== 'pending');
    return `${topBar('Invite Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>
        ${tenancy?.type === 'group' && pendingMembers.length ? `
        <div class="ux-tip">
            <p class="ux-tip-title">Group tenancy</p>
            <p class="ux-tip-text">${pendingMembers.length} member${pendingMembers.length === 1 ? '' : 's'} still need portal invites on this flat.</p>
        </div>` : ''}
        <p class="text-[12px] text-[#64748B] leading-relaxed">Send a secure invite link. The tenant must accept before they can log in.</p>
        ${formFieldReq('NID', 'idNumber', prefill.idNumber || '', 'text', 'National ID number')}
        <div>
            <label class="form-label">${requiredLabel('NID Document Proof')}</label>
            <button type="button" data-action="upload-nid-proof" class="card border-2 border-dashed border-[#E2E8F0] p-5 text-center w-full">
                <i data-lucide="${STATE.nidProofName ? 'file-check' : 'upload'}" class="w-7 h-7 text-[#94A3B8] mx-auto"></i>
                <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${STATE.nidProofName || 'Upload NID scan or photo'}</p>
                <p class="text-[11px] text-[#64748B] mt-1">Passport, national ID card, or driving licence</p>
            </button>
        </div>
        ${formFieldReq('First / Given Name', 'firstName', prefill.firstName || '', 'text')}
        ${formFieldReq('Last / Family Name', 'lastName', prefill.lastName || '', 'text')}
        ${formFieldReq('Date of Birth', 'dob', prefill.dob || '', 'date')}
        ${formFieldReq('Email Address', 'email', prefill.email || '', 'email')}
        ${formFieldReq('Mobile Number', 'phone', prefill.phone || '', 'tel', '+44 7700 900000')}
        <div><label class="form-label">${requiredLabel('Flat')}</label>${unitSelectHtml(STATE.propertyId, 'unit', true, selectedUnit)}</div>
        <div><label class="form-label">Flat Rent</label><input data-invite="rent" type="text" class="form-input" placeholder="${unitRent}" value="${unitRent}"></div>
        <p class="form-helper">Rent is for this flat only — not combined with other flats in the building.</p>
        <div><label class="form-label">Lease Start</label><input data-invite="leaseStart" type="date" class="form-input"></div>
        <div><label class="form-label">Lease End</label><input data-invite="leaseEnd" type="date" class="form-input"></div>
        <div><label class="form-label">Personal Message</label><textarea data-invite="message" class="form-input" rows="3" placeholder="Add a personal message (optional)"></textarea></div>
        <button type="button" data-action="send-tenant-invite" class="btn-primary w-full py-3.5 text-[14px]">Send Invitation</button>
    </div>`;
}

function renderTenantMaintenanceSection(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const f = STATE.tenantMaintFilter || 'all';
    const tenantMaint = MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === listItem?.propertyId &&
        (m.unit === listItem?.unit || m.unit === '—')
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
    <div class="stack-sm">
        ${filtered.length ? filtered.map(m => {
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
}

function renderTenantActivitySection(tenantId, t) {
    const events = [];
    const listItem = TENANT_LIST[tenantId];
    INVOICES.filter(i => i.prop.includes(listItem?.prop?.split(',')[0] || t.prop?.split(',')[0] || '')).slice(0, 2).forEach(i => {
        events.push({ ic: 'banknote', bg: '#ECFDF5', color: '#059669', title: i.status === 'Paid' ? 'Rent payment received' : `Invoice ${i.status.toLowerCase()}`, sub: `${i.amount} · ${i.due}` });
    });
    MAINTENANCE_ITEMS.filter(m =>
        m.propertyId === listItem?.propertyId &&
        (!listItem?.unit || m.unit === listItem.unit || m.unit === '—')
    ).slice(0, 3).forEach(m => {
        events.push({
            ic: 'wrench', bg: '#EFF6FF', color: '#2563EB',
            title: m.status === 'done' ? 'Maintenance resolved' : 'Maintenance update',
            sub: `${m.issue} · ${m.time}`,
            go: 'maintenance-detail', opts: { mid: m.id },
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
        });
    }
    getTenantDocuments(tenantId).slice(0, 2).forEach((doc, idx) => {
        events.push({
            ic: 'file-text', bg: '#F0FDF4', color: '#16A34A',
            title: 'Document shared',
            sub: doc[1],
            go: 'document-preview', opts: { previewSource: 'tenant', previewDocIdx: idx },
        });
    });
    if (t.moveIn) events.push({ ic: 'user-plus', bg: '#FFFBEB', color: '#D97706', title: 'Tenant moved in', sub: typeof formatDisplayDate === 'function' ? formatDisplayDate(t.moveIn) : t.moveIn });
    if (!events.length) return `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`;
    return `
    <div class="tenant-timeline">
        ${events.map(e => `
        <button type="button" ${e.go ? `data-go="${e.go}" ${e.opts?.mid != null ? `data-mid="${e.opts.mid}"` : ''} ${e.opts?.chatId != null ? `data-chat="${e.opts.chatId}"` : ''} ${e.opts?.previewSource ? `data-preview-source="${e.opts.previewSource}" data-preview-idx="${e.opts.previewDocIdx ?? 0}"` : ''}` : ''} class="tenant-timeline-item w-full text-left ${e.go ? 'card-hover' : ''}">
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
        if (name) members.push({ name, email: email || '', phone: phone || '—' });
    });
    return members;
}

function addGroupMemberRow() {
    STATE.groupMemberCount = (STATE.groupMemberCount || 1) + 1;
    render();
}

function screenCreateTenancyEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    const count = STATE.groupMemberCount || 1;
    return `${topBar('Create Tenancy', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>
        <div><label class="form-label">${requiredLabel('Tenancy Type')}</label>
        <select data-field="tenancyType" class="form-input form-select"><option value="solo">Solo Tenancy</option><option value="group">Group Tenancy</option></select></div>
        <div><label class="form-label">${requiredLabel('Flat')}</label>${unitSelectHtml(STATE.propertyId)}</div>
        <div id="group-fields" style="display:none">
            ${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}
            <p class="screen-section-title">Occupant List</p>
            <p class="form-helper mb-2">Each occupant can receive their own account invitation after tenancy is created.</p>
            <div id="member-list" class="stack-sm mb-2">
                ${Array.from({ length: count }, (_, i) => `
                <div class="card p-3" data-member-row>
                    <p class="text-[11px] font-semibold text-[#64748B] mb-2">Occupant ${i + 1}</p>
                    <input data-member-name type="text" class="form-input mb-2" placeholder="Full name">
                    <input data-member-email type="email" class="form-input mb-2" placeholder="Email">
                    <input data-member-phone type="tel" class="form-input" placeholder="Phone">
                </div>`).join('')}
            </div>
            <button type="button" data-action="add-group-member" class="btn-secondary w-full py-2.5 text-[12px]">+ Add Occupant</button>
        </div>
        ${formFieldReq('Flat Rent (£)', 'rent', propertyDefaultFlatRent(STATE.propertyId).replace(/[^\d]/g, ''), 'text')}
        <p class="form-helper">Rent applies to the selected flat only — not the whole building.</p>
        ${formFieldReq('Start Date', 'start', '', 'date')}
        ${formFieldReq('End Date', 'end', '', 'date')}
        <p class="form-helper">After creating the tenancy, invite each occupant to activate their account.</p>
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Create Tenancy</button>
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
            const metaExtra = typeof tenantTenancyMetaLine === 'function' ? tenantTenancyMetaLine(t) : '';
            const pill = tenancy && typeof tenancyTypePill === 'function' ? tenancyTypePill(tenancy.type) : '';
            return `
        <button data-go="tenant-detail" data-tid="${t.id}" class="card p-4 flex items-center gap-3 w-full text-left">
            <img src="${t.img}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-[14px] font-bold">${t.name}</p>
                    ${pill}
                </div>
                <p class="text-[12px] text-[#64748B]">${t.prop}${t.unit ? ` · ${t.unit}` : ''}</p>
                ${metaExtra ? `<p class="text-[11px] font-semibold mt-0.5 ${tenancy?.type === 'group' ? 'flat-list-tenancy-hint--group' : 'flat-list-tenancy-hint--solo'}">${metaExtra}</p>` : ''}
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
function screenPortfolioOverview() {
    syncAllPropertyStatuses();
    let totalUnits = 0;
    let occupiedUnits = 0;
    PROPERTIES.forEach(p => {
        const units = getPropertyUnits(p.id);
        totalUnits += units.length;
        occupiedUnits += units.filter(u => u.status === 'occupied').length;
    });
    const totalRent = PROPERTIES.reduce((s, p) => s + getPropertyRentSummary(p.id).collected, 0);
    return `${topBar('Portfolio Overview', { back: true })}
    <div class="screen-content screen-enter">
        <div class="financial-summary card">
            <p class="financial-summary-label">Portfolio Value</p>
            <p class="financial-summary-amount">£${(totalRent * 12 * 15).toLocaleString()}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Estimated from current rent roll</p>
            <div class="financial-summary-grid">
                <div><p class="financial-mini-label">Properties</p><p class="financial-mini-value">${PROPERTIES.length}</p></div>
                <div><p class="financial-mini-label">Flat occupancy</p><p class="financial-mini-value text-[#16A34A]">${occupiedUnits}/${totalUnits}</p></div>
            </div>
        </div>
        <p class="screen-section-title">Properties</p>
        <div class="stack-sm">
            ${PROPERTIES.map(p => `
            <button data-go="property-detail" data-pid="${p.id}" class="card p-4 flex items-center gap-3 w-full text-left">
                <img src="${IMG.props[p.id]}" class="w-14 h-14 rounded-xl object-cover" alt="">
                <div class="flex-1 min-w-0">
                    <p class="text-[14px] font-bold">${p.name}</p>
                    <p class="text-[12px] text-[#64748B]">${propertyRentListLabel(p.id)} · ${typeof propertyOccupancyBadge === 'function' ? propertyOccupancyBadge(p.id).label : (p.occupancyLabel || 'Vacant')}</p>
                </div>
                <span class="badge" style="background:${propertyOccupancyBadge(p.id).bg};color:${propertyOccupancyBadge(p.id).color}">${propertyOccupancyBadge(p.id).label}</span>
            </button>`).join('')}
        </div>
        <button data-go="add-property" class="btn-secondary w-full py-3.5 text-[14px]">+ Add Property</button>
    </div>`;
}

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
    const list = AppStore.reminders.sort((a, b) => a.daysLeft - b.daysLeft);
    return `${topBar('Reminders', { back: true })}
    <div class="screen-content screen-enter">
        ${list.length ? list.map(r => {
            const p = PROPERTIES[r.propertyId];
            const rt = REMINDER_TYPES.find(t => t[0] === r.type) || REMINDER_TYPES[11];
            return `
            <div class="card p-4 mb-2 urgency-${r.urgency}">
                <div class="flex items-center gap-3">
                    <button data-go="property-detail" data-pid="${r.propertyId}" data-tab="compliance" class="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <div class="dash-reminder-icon" style="background:${rt[3]};color:${rt[4]}"><i data-lucide="${rt[2]}" class="w-[18px] h-[18px]"></i></div>
                        <div class="flex-1 min-w-0"><p class="text-[13px] font-semibold">${r.title}</p><p class="text-[11px] text-[#64748B]">${p?.name} · Due ${r.due}</p></div>
                        <span class="badge shrink-0" style="background:${rt[3]};color:${rt[4]}">${r.daysLeft}d</span>
                    </button>
                    <button type="button" data-action="delete-reminder" data-rid="${r.id}" class="row-icon-btn row-icon-btn--danger" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </div>
            </div>`;
        }).join('') : emptyState('bell', 'No reminders', 'Add a custom reminder to track important dates.', 'Add Reminder', null, 'add-reminder')}
        <button data-go="add-reminder" class="btn-primary w-full py-3.5 text-[14px]">+ Custom Reminder</button>
        <p class="text-[11px] text-[#94A3B8] text-center mt-2">Reminders sync from alarms, certificates, leases and inspections</p>
    </div>`;
}

function screenAddReminder() {
    return `${topBar('Add Reminder', { back: true })}
    <div class="screen-content screen-enter">
        <div><label class="form-label">${requiredLabel('Reminder Type')}</label>
        <select data-field="type" class="form-input form-select">${REMINDER_TYPES.map(t => `<option value="${t[0]}">${t[1]}</option>`).join('')}</select></div>
        ${formFieldReq('Title', 'title', '', 'text', 'e.g. Gas certificate renewal')}
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" class="form-input form-select">${PROPERTIES.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select></div>
        ${formFieldReq('Due Date', 'due', '', 'date')}
        <button data-action="save-reminder" class="btn-primary w-full py-3.5 text-[14px]">Save Reminder</button>
    </div>`;
}

function screenCreateTenancy() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Create Tenancy', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address}</p></div>
        </div>
        <div><label class="form-label">${requiredLabel('Tenancy Type')}</label>
        <select data-field="tenancyType" class="form-input form-select"><option value="solo">Solo Tenancy</option><option value="group">Group Tenancy</option></select></div>
        ${formFieldReq('Flat', 'unit', '', 'text', 'Flat 1A')}
        <div id="group-fields" style="display:none">${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}</div>
        ${formFieldReq('Flat Rent (£)', 'rent', p.rent.replace('£',''), 'text')}
        ${formFieldReq('Start Date', 'start', '', 'date')}
        ${formFieldReq('End Date', 'end', '', 'date')}
        <p class="form-helper">After creating the tenancy, invite the tenant to activate their account.</p>
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Create Tenancy</button>
    </div>`;
}

function screenCheckoutTenancy() {
    const t = TENANTS[STATE.tenantId] || TENANTS[0];
    return `${topBar('Check-out Tenancy', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${t.firstName} ${t.lastName}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${t.prop} · Lease ends ${t.leaseEnd}</p>
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

function screenAssignContractor() {
    const item = maintItem(STATE.assignMaintId ?? STATE.maintId);
    const suggested = suggestContractorForIssue(item);
    const tenant = getMaintTenantForItem(item);
    return `${topBar('Assign Contractor', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${item.issue}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${item.prop}${item.unit && item.unit !== '—' ? ` · ${item.unit}` : ''} · ${item.priority} priority</p>
            ${item.contractor !== '—' ? `<p class="text-[12px] text-[#D97706] mt-2">Currently: ${item.contractor}</p>` : ''}
        </div>
        ${renderMaintTenantComplaint(item)}
        <div class="ux-tip">
            <p class="ux-tip-title">What the contractor sees</p>
            <p class="ux-tip-text">The full complaint, flat address, and tenant contact. They accept the job in their app, then schedule a visit.</p>
        </div>
        <p class="screen-section-title">Select contractor</p>
        ${CONTRACTORS.map(c => {
            const isSuggested = suggested?.id === c.id;
            return `
        <button data-action="assign-contractor" data-cid="${c.id}" class="card p-4 flex items-center gap-3 w-full text-left mb-2 ${isSuggested ? 'maint-contractor-pick--suggested' : ''}">
            <img src="${c.img}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-[14px] font-semibold">${c.name}</p>
                    ${isSuggested ? `<span class="maint-suggested-pill">Suggested</span>` : ''}
                </div>
                <p class="text-[12px] text-[#64748B]">${c.trade}${tenant ? ` · will contact ${tenant.name.split(' ')[0]}` : ''}</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`;
        }).join('')}
    </div>`;
}

function screenConductInspection() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Conduct Inspection', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 bg-[#EFF6FF]"><p class="text-[13px] font-semibold">${p.name}</p><p class="text-[12px] text-[#64748B]">Record a new property inspection</p></div>
        <div><label class="form-label">${requiredLabel('Inspection Type')}</label>
        <select data-field="inspType" class="form-input form-select"><option>Check-in</option><option>Mid-term</option><option>Annual</option><option>Check-out</option></select></div>
        ${formFieldReq('Date', 'inspDate', '', 'date')}
        ${formFieldReq('Overall Rating', 'rating', '4.5', 'number', '1.0 – 5.0')}
        ${formTextarea('Notes', '', 'Condition observations, issues found...', 'inspNotes')}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[12px] text-[#64748B] mt-2">Upload inspection photos${STATE.inspectionPhotos?.length ? ` (${STATE.inspectionPhotos.length})` : ''}</p>
        </button>
        <button data-action="save-inspection" class="btn-primary w-full py-3.5 text-[14px]">Save Inspection Report</button>
    </div>`;
}

function screenCreateInvoice() {
    return `${topBar('Create Invoice', { back: true })}
    <div class="screen-content screen-enter">
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" class="form-input form-select">${PROPERTIES.filter(p => propertyOccupiedFlatCount(p.id) > 0).map(p => `<option value="${p.id}">${p.name} — ${propertyOccupancyBadge(p.id).label}</option>`).join('')}</select></div>
        ${formFieldReq('Amount (£)', 'amount', '', 'number', '2450')}
        ${formFieldReq('Due Date', 'due', '', 'date')}
        <div><label class="form-label">${requiredLabel('Description')}</label>
        <select data-field="desc" class="form-input form-select"><option>Monthly Rent</option><option>Service Charge</option><option>Deposit Top-up</option><option>Other</option></select></div>
        <button data-action="save-invoice" class="btn-primary w-full py-3.5 text-[14px]">Create Invoice</button>
    </div>`;
}

function parseInvoiceAmount(amount) {
    return parseInt(String(amount).replace(/[^\d]/g, ''), 10) || 0;
}

function outstandingInvoices() {
    return INVOICES.filter(i => i.status !== 'Paid');
}

function initRentReceiveSelection() {
    const unpaid = outstandingInvoices();
    STATE.rentReceiveIds = unpaid.map(i => i.id);
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
    const unpaid = outstandingInvoices();
    const allSelected = unpaid.length && unpaid.every(i => STATE.rentReceiveIds.includes(i.id));
    STATE.rentReceiveIds = allSelected ? [] : unpaid.map(i => i.id);
    render();
}

function rentReceiveRow(inv) {
    const selected = STATE.rentReceiveIds.includes(inv.id);
    const [bg, color] = invoiceStatusStyle(inv.status);
    const meta = invoicePropertyMeta(inv);
    const statusLabel = inv.status === 'Overdue' ? 'Overdue' : 'Pending';
    return `
    <button type="button" data-action="toggle-rent-receive" data-iid="${inv.id}" class="rent-receive-row card ${selected ? 'rent-receive-row--selected' : ''}" aria-pressed="${selected}">
        <span class="rent-receive-check ${selected ? 'rent-receive-check--on' : ''}" aria-hidden="true">
            <i data-lucide="${selected ? 'check' : 'circle'}" class="w-4 h-4"></i>
        </span>
        <div class="fin-inv-icon rent-receive-icon" style="background:${meta.bg};color:${meta.color}">
            <i data-lucide="building-2" class="w-[18px] h-[18px]"></i>
        </div>
        <div class="rent-receive-body">
            <p class="rent-receive-tenant">${inv.tenant || meta.propShort}</p>
            <p class="rent-receive-meta">${meta.propShort}${inv.unit ? ` · ${inv.unit}` : ''}</p>
            <p class="rent-receive-due">Due ${inv.due} · ${inv.num}</p>
        </div>
        <div class="rent-receive-right">
            <p class="rent-receive-amount">${inv.amount}</p>
            <span class="fin-inv-status" style="background:${bg};color:${color}">${statusLabel}</span>
        </div>
    </button>`;
}

function confirmMarkRentReceived() {
    const ids = [...STATE.rentReceiveIds];
    if (!ids.length) {
        toast('Select at least one bill');
        return;
    }
    const date = document.querySelector('[data-field="receivedDate"]')?.value;
    if (!date) {
        toast('Select payment date');
        return;
    }
    ids.forEach(iid => {
        const inv = INVOICES.find(i => i.id === iid);
        if (inv && inv.status !== 'Paid') {
            inv.status = 'Paid';
            if (typeof formatDisplayDate === 'function') inv.paidOn = formatDisplayDate(date);
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
        desc: `£${total.toLocaleString()} recorded`,
        time: 'Just now', unread: true, screen: 'financial', opts: {},
    });
    AppStore.save();
    STATE.rentReceiveIds = [];
    toast(ids.length === 1 ? 'Rent marked as received' : `${ids.length} payments marked as received`);
    go('financial');
}

function screenMarkRentReceived() {
    const unpaid = outstandingInvoices();
    const overdue = unpaid.filter(i => i.status === 'Overdue');
    const pending = unpaid.filter(i => i.status === 'Pending');
    const dueTotal = unpaid.reduce((s, i) => s + parseInvoiceAmount(i.amount), 0);
    const selected = rentReceiveSummary();
    const allSelected = unpaid.length && unpaid.every(i => STATE.rentReceiveIds.includes(i.id));
    const receiveDate = STATE.rentReceiveDate || new Date().toISOString().slice(0, 10);

    if (!unpaid.length) {
        return `${topBar('Record Payment', { back: true })}
        <div class="screen-content screen-enter">
            ${emptyState('check-circle', 'All caught up', 'Every rent bill for this month is already marked as paid.', 'Back to Finances', null, 'financial')}
        </div>`;
    }

    const section = (title, items, tone) => items.length ? `
        <div class="rent-receive-section">
            <p class="rent-receive-section-label ${tone ? `rent-receive-section-label--${tone}` : ''}">${title} (${items.length})</p>
            <div class="rent-receive-list">${items.map(rentReceiveRow).join('')}</div>
        </div>` : '';

    return `${topBar('Record Payment', { back: true })}
    <div class="screen-content screen-enter rent-receive-page">
        <div class="rent-receive-summary card">
            <div class="rent-receive-summary-main">
                <p class="rent-receive-summary-amount">£${dueTotal.toLocaleString()}</p>
                <p class="rent-receive-summary-hint">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} due · select what you received today</p>
            </div>
            <button type="button" data-action="toggle-rent-receive-all" class="rent-receive-select-all">
                ${allSelected ? 'Deselect all' : 'Select all'}
            </button>
        </div>
        ${overdue.length ? section('Overdue', overdue, 'danger') : ''}
        ${pending.length ? section('Due soon', pending, '') : ''}
        <div class="rent-receive-date card">
            <label class="form-label">Payment received on</label>
            <input type="date" data-field="receivedDate" class="form-input" value="${receiveDate}">
        </div>
    </div>
    <div class="rent-receive-bar ${selected.count ? 'rent-receive-bar--active' : ''}">
        <div class="rent-receive-bar-info">
            <p class="rent-receive-bar-count">${selected.count} selected</p>
            <p class="rent-receive-bar-total">£${selected.total.toLocaleString()}</p>
        </div>
        <button type="button" data-action="confirm-rent-received" class="rent-receive-bar-btn" ${selected.count ? '' : 'disabled'}>
            Mark as received
        </button>
    </div>`;
}

function screenPayContractor() {
    const unpaid = AppStore.contractorInvoices.filter(c => c.status === 'Unpaid');
    return `${topBar('Pay Contractor', { back: true })}
    <div class="screen-content screen-enter">
        ${unpaid.length ? unpaid.map(c => `
        <div class="card p-4 mb-2">
            <div class="flex justify-between items-start">
                <div><p class="text-[14px] font-semibold">${c.contractor}</p><p class="text-[12px] text-[#64748B]">${c.job}</p></div>
                <p class="text-[14px] font-bold">${c.amount}</p>
            </div>
            <button data-action="pay-contractor" data-cid="${c.id}" class="btn-primary w-full py-2.5 text-[13px] mt-3">Pay Invoice</button>
        </div>`).join('') : emptyState('banknote', 'No unpaid invoices', 'All contractor invoices have been paid.', 'View Maintenance', null, 'maintenance')}
    </div>`;
}

function screenShareDocument() {
    const doc = AppStore.documents.find(d => d.id === STATE.shareDocId);
    if (!doc) return `${topBar('Share Document', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Document not found</p></div>`;
    const p = PROPERTIES[doc.propertyId];
    const tenancy = AppStore.tenancies.find(t => t.propertyId === doc.propertyId && t.status === 'active');
    const unit = doc.unit || tenancy?.unit || '';
    const targets = getDocumentShareTargets(doc.propertyId, unit);
    return `${topBar('Share with Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${doc.name}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${doc.type} · ${p.name}${unit ? ` · ${unit}` : ''}</p>
        </div>
        <p class="text-[13px] text-[#64748B]">Choose who can view this in their tenant portal.</p>
        ${targets.length ? `
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
        </div>` : `
        <div class="ux-tip">
            <p class="ux-tip-title">No active tenants yet</p>
            <p class="ux-tip-text">Invite tenants first — the document will be shared when they activate their account.</p>
        </div>`}
        <button data-action="confirm-share-doc" class="btn-primary w-full py-3.5 text-[14px]">Share Document</button>
    </div>`;
}

function screenAddFlat() {
    const p = PROPERTIES[STATE.propertyId];
    const sourceName = STATE.flatDuplicateFrom || '';
    const isDup = !!sourceName;
    const draft = flatDraftFromSource(STATE.propertyId, sourceName || null);
    const showFloor = shouldGroupFlatsByFloor(STATE.propertyId) || draft.floor !== '' && draft.floor != null;
    return `${topBar(isDup ? 'Duplicate flat' : 'Add flat', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-content-sm screen-enter flat-edit-page">
        ${isDup ? uxTip('Change only what is different for this new flat.', `Copied from ${sourceName}`) : uxIntro('Add rent, rooms and size for this flat.')}
        <div class="flat-edit-fields stack-sm">
            <div class="form-field"><label class="form-label">Flat name <span class="form-required">*</span></label><input data-field="flatName" type="text" class="form-input" value="${draft.name.replace(/"/g, '&quot;')}" placeholder="e.g. Flat 2A"></div>
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
        </div>
        <p class="form-helper flat-edit-helper">New flats start as vacant. Occupancy updates when a tenant moves in.</p>
        <button data-action="save" class="btn-primary w-full">${isDup ? 'Save duplicated flat' : 'Save flat'}</button>
    </div>`;
}

function saveAddFlat() {
    if (!validateFields([['flatName', 'Flat Name', v => v && v.trim()], ['flatRent', 'Rent', v => v && +v > 0]])) return;
    const name = fieldVal('flatName').trim();
    if (getUnitByName(STATE.propertyId, name)) {
        toast('A flat with this name already exists');
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
    });
    const wasDup = !!STATE.flatDuplicateFrom;
    if (wasDup && STATE.flatDuplicateFrom) {
        const srcPhoto = getFlatCoverPhoto(STATE.propertyId, STATE.flatDuplicateFrom);
        setFlatCoverPhoto(STATE.propertyId, name, srcPhoto);
    }
    STATE.flatDuplicateFrom = null;
    withLoading(() => {
        AppStore.save();
        toast(wasDup ? 'Flat duplicated' : 'Flat added');
        go('property-detail', { propertyId: STATE.propertyId, tab: 'units' });
    });
}

function screenEditFlat() {
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[STATE.propertyId];
    const u = getUnitByName(STATE.propertyId, unit);
    if (!u) return `${topBar('Edit flat', { back: true })}<div class="screen-content"><p class="ux-intro">Flat not found.</p></div>`;
    ensureFlatPhotos(STATE.propertyId);
    const thumb = getFlatCoverPhoto(STATE.propertyId, unit);
    const rent = (u.rent || '').replace(/[£,]/g, '');
    const occ = u.status === 'occupied';
    return `${topBar('Edit flat', { back: true, sub: `${p?.name || ''} · ${unitName(u)}` })}
    <div class="screen-content screen-content-sm screen-enter flat-edit-page">
        <div class="flat-edit-photo card overflow-hidden">
            <img src="${thumb}" class="img-cover" alt="" style="height:140px">
            <button type="button" data-action="upload-flat-photo" class="flat-edit-photo-btn">Change flat photo</button>
        </div>
        <div class="flat-edit-status card">
            <div class="flat-edit-status-body">
                <p class="flat-edit-status-title">Status</p>
                <p class="flat-edit-status-desc">Updates when a tenant moves in or out</p>
            </div>
            <span class="badge shrink-0" style="background:${occ ? '#DCFCE7' : '#FEF3C7'};color:${occ ? '#16A34A' : '#D97706'}">${occ ? 'Occupied' : 'Vacant'}</span>
        </div>
        <div class="flat-edit-fields stack-sm">
            <div class="form-field"><label class="form-label">Flat name</label><input data-field="flatName" type="text" class="form-input" value="${unitName(u).replace(/"/g, '&quot;')}"></div>
            <div class="form-field"><label class="form-label">Rent per month (£) <span class="form-required">*</span></label><input data-field="flatRent" type="number" class="form-input" value="${rent}" min="1"></div>
            <div class="grid grid-cols-3 gap-3">
                <div class="form-field"><label class="form-label">Beds</label><input data-field="flatBeds" type="number" class="form-input" value="${u.beds || 2}" min="1"></div>
                <div class="form-field"><label class="form-label">Baths</label><input data-field="flatBaths" type="number" class="form-input" value="${u.baths || 1}" min="1"></div>
                <div class="form-field"><label class="form-label">Sq ft</label><input data-field="flatSqft" type="text" class="form-input" value="${u.sqft || ''}" placeholder="750"></div>
            </div>
            ${u.floor != null ? `<div class="form-field"><label class="form-label">Floor note</label><input data-field="floorNote" type="text" class="form-input" value="${(u.floorNote || '').replace(/"/g, '&quot;')}" placeholder="e.g. Rear wing"></div>` : ''}
        </div>
        <p class="form-helper flat-edit-helper">For building-wide details, use Edit Property instead.</p>
        <div class="flat-edit-actions stack-sm">
            <button data-action="save" class="btn-primary w-full">Save flat</button>
            ${canDeleteFlat(STATE.propertyId, unit) ? `
            <div class="danger-zone flat-edit-danger">
                ${dangerZoneButton('Remove flat', 'delete-flat')}
            </div>` : ''}
        </div>
    </div>`;
}

function saveFlatDetails() {
    const oldName = STATE.selectedUnit;
    if (!oldName) { toast('Flat not selected'); return; }
    if (!validateFields([['flatRent', 'Rent', v => v && +v > 0]])) return;
    const newName = (fieldVal('flatName') || oldName).trim();
    const unit = getUnitByName(STATE.propertyId, oldName);
    if (!unit) { toast('Flat not found'); return; }
    if (newName !== oldName && getUnitByName(STATE.propertyId, newName)) {
        toast('Another flat already has that name');
        return;
    }
    unit.name = newName;
    unit.rent = `£${parseInt(fieldVal('flatRent'), 10).toLocaleString()}`;
    unit.beds = +fieldVal('flatBeds') || unit.beds || 2;
    unit.baths = +fieldVal('flatBaths') || unit.baths || 1;
    unit.sqft = fieldVal('flatSqft') || unit.sqft || '';
    if (fieldVal('floorNote') != null) unit.floorNote = fieldVal('floorNote');
    if (newName !== oldName) {
        AppStore.tenancies.filter(t => t.propertyId === STATE.propertyId && t.unit === oldName).forEach(t => { t.unit = newName; });
        TENANT_INVITATIONS.filter(i => i.propertyId === STATE.propertyId && i.unit === oldName).forEach(i => { i.unit = newName; });
        TENANT_LIST.filter(t => t.propertyId === STATE.propertyId && t.unit === oldName).forEach(t => { t.unit = newName; });
        const util = AppStore.meta(STATE.propertyId).unitUtilities?.[oldName];
        if (util) {
            AppStore.meta(STATE.propertyId).unitUtilities[newName] = util;
            delete AppStore.meta(STATE.propertyId).unitUtilities[oldName];
        }
        renameFlatPhoto(STATE.propertyId, oldName, newName);
    }
    STATE.selectedUnit = newName;
    syncPropertyStatus(STATE.propertyId);
    withLoading(() => { AppStore.save(); toast('Flat updated'); go('flat-detail', { propertyId: STATE.propertyId, unit: newName }); });
}

function screenUnitUtilities() {
    const unit = STATE.selectedUnit || '';
    const p = PROPERTIES[STATE.propertyId];
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    const billOptions = ['Electricity', 'Gas', 'Water', 'Internet', 'Council Tax'];
    return `${topBar('Unit Utilities', { back: true, sub: `${p?.name || ''} · ${unit}` })}
    <div class="screen-content screen-enter">
        <div><label class="form-label">Who pays utilities?</label>
        <select data-field="util_responsibility" class="form-input form-select">
            <option value="landlord" ${util.responsibility === 'landlord' ? 'selected' : ''}>Landlord pays all</option>
            <option value="tenant" ${util.responsibility === 'tenant' ? 'selected' : ''}>Tenant pays all</option>
            <option value="split" ${util.responsibility === 'split' ? 'selected' : ''}>Split / partial</option>
        </select></div>
        ${util.responsibility === 'split' ? `
        <div class="card p-4">
            <p class="text-[13px] font-bold mb-2">Bills included for tenant</p>
            ${billOptions.map(b => `
            <label class="flex items-center gap-2 py-2 text-[13px] text-[#475569]">
                <input type="checkbox" data-util-bill="${b}" class="accent-[#2563EB]" ${util.includedBills?.includes(b) ? 'checked' : ''}> ${b}
            </label>`).join('')}
        </div>` : ''}
        <p class="screen-section-title">Meter Numbers</p>
        ${formFieldReq('Electricity Meter', 'meter_electricity', util.meters?.electricity || '', 'text')}
        ${formFieldReq('Gas Meter', 'meter_gas', util.meters?.gas || '', 'text')}
        ${formFieldReq('Water Meter', 'meter_water', util.meters?.water || '', 'text')}
        <p class="screen-section-title">Shared Uploads</p>
        <p class="text-[12px] text-[#64748B] mb-2">Landlord and tenant can upload utility documents. Payment history is not stored in the app.</p>
        ${util.uploads?.length ? util.uploads.map(u => `
        <div class="card p-3 mb-2 flex items-center justify-between">
            <div><p class="text-[13px] font-semibold">${u.name}</p><p class="text-[11px] text-[#64748B]">${u.by} · ${u.date}</p></div>
            <button data-action="toast" data-msg="Downloaded ${u.name}" class="text-[12px] font-semibold text-[#2563EB]">View</button>
        </div>`).join('') : `<div class="card p-4 text-center text-[12px] text-[#64748B]">No utility documents uploaded yet</div>`}
        <button data-action="upload-unit-utility" class="btn-secondary w-full py-3 text-[13px]">Upload Bill / Document</button>
        <button data-action="save-unit-utilities" class="btn-primary w-full py-3.5 text-[14px] mt-2">Save Utilities</button>
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
                <span>Add Photo</span>
            </button>
        </div>
    </div>`;
}

function screenPropertyFloorPlans() {
    const meta = AppStore.meta(STATE.propertyId);
    return `${topBar('Floor Plans', { back: true })}
    <div class="screen-content screen-enter">
        ${meta.floorPlans.length ? meta.floorPlans.map((fp, i) => `
        <div class="card overflow-hidden mb-3">
            <div class="aspect-video"><img src="${fp.url}" class="img-cover" alt=""></div>
            <div class="p-3 flex justify-between items-center">
                <p class="text-[13px] font-semibold">${fp.name}</p>
                <button data-action="toast" data-msg="Downloaded ${fp.name}" class="text-[12px] font-semibold text-[#2563EB]">Download</button>
            </div>
        </div>`).join('') : emptyState('layout', 'No floor plans', 'Upload floor plan images for this property.', 'Upload Plan', 'upload-photo')}
        <button data-action="upload-photo" class="btn-secondary w-full py-3 text-[13px]">+ Upload Floor Plan</button>
    </div>`;
}

function screenPropertyDetailsEdit(section) {
    const meta = AppStore.meta(STATE.propertyId);
    const titles = { alarms: 'Alarm Information', appliances: 'Appliances', utilities: 'Utilities', parking: 'Parking', info: 'Property Information' };
    let body = '';
    if (section === 'info') {
        const info = meta.info || {};
        body = `<div><label class="form-label">Property Type</label><input data-field="info_type" class="form-input" value="${info.type || ''}" placeholder="e.g. Semi-detached"></div>
        <div><label class="form-label">Year Built</label><input data-field="info_built" class="form-input" value="${info.built || ''}" placeholder="e.g. 1985"></div>
        <div><label class="form-label">EPC Rating</label><input data-field="info_epc" class="form-input" value="${info.epc || ''}" placeholder="e.g. Rating B"></div>
        <div><label class="form-label">EPC Expiry Date</label><input data-field="info_epcExpiry" type="date" class="form-input" value="${info.epcExpiry || ''}"></div>
        <div><label class="form-label">Insurance Renewal</label><input data-field="info_insuranceExpiry" type="date" class="form-input" value="${info.insuranceExpiry || ''}"></div>
        <div><label class="form-label">Mortgage Renewal</label><input data-field="info_mortgageRenewal" type="date" class="form-input" value="${info.mortgageRenewal || ''}"></div>
        <div><label class="form-label">Council Tax Band</label><input data-field="info_council" class="form-input" value="${info.councilTax || ''}" placeholder="e.g. Band D"></div>
        <div><label class="form-label">Notes</label><textarea data-field="info_notes" class="form-input min-h-[96px] resize-none" placeholder="Access codes, parking notes...">${info.notes || ''}</textarea></div>`;
    } else if (section === 'alarms') {
        body = ['smoke', 'heat', 'co'].map(k => {
            const a = meta.alarms[k] || { expiry: '', lastCheck: '', location: '' };
            const label = k === 'co' ? 'CO' : k.charAt(0).toUpperCase() + k.slice(1);
            return `<div class="card p-4 mb-3">
                <p class="text-[13px] font-bold mb-2">${label} Alarm</p>
                <div><label class="form-label">Location</label><input data-field="${k}_location" class="form-input" value="${a.location || ''}"></div>
                <div><label class="form-label">Expiry Date</label><input data-field="${k}_expiry" type="date" class="form-input" value="${a.expiry || ''}"></div>
                <div><label class="form-label">Last Check</label><input data-field="${k}_check" type="date" class="form-input" value="${a.lastCheck || ''}"></div>
            </div>`;
        }).join('');
    } else if (section === 'appliances') {
        body = meta.appliances.map((a, i) => `
        <div class="card p-4 mb-2">
            <div><label class="form-label">Name</label><input data-field="app_name_${i}" class="form-input" value="${a.name}"></div>
            <div><label class="form-label">Brand</label><input data-field="app_brand_${i}" class="form-input" value="${a.brand}"></div>
            <div><label class="form-label">Condition</label><select data-field="app_cond_${i}" class="form-input form-select">${['Good','Fair','Poor'].map(o => `<option ${o===a.condition?'selected':''}>${o}</option>`).join('')}</select></div>
        </div>`).join('');
    } else if (section === 'utilities') {
        body = Object.entries(meta.utilities).map(([k, v]) =>
            `<div><label class="form-label">${k.charAt(0).toUpperCase() + k.slice(1)}</label><input data-field="util_${k}" class="form-input" value="${v}"></div>`
        ).join('');
    } else if (section === 'parking') {
        body = `<div><label class="form-label">Spaces</label><input data-field="park_spaces" type="number" class="form-input" value="${meta.parking.spaces || ''}"></div>
        <div><label class="form-label">Type</label><select data-field="park_type" class="form-input form-select">${['Off-street','On-street','Garage','None'].map(o => `<option ${o===(meta.parking.type||'')?'selected':''}>${o}</option>`).join('')}</select></div>
        <div><label class="form-label">Permit Number</label><input data-field="park_permit" class="form-input" value="${meta.parking.permit || ''}"></div>
        <div><label class="form-label">Notes</label><textarea data-field="park_notes" class="form-input min-h-[80px]">${meta.parking.notes || ''}</textarea></div>`;
    }
    return `${topBar(titles[section] || 'Details', { back: true })}
    <div class="screen-content screen-enter">${body}
        <button data-action="save-property-meta" data-section="${section}" class="btn-primary w-full py-3.5 text-[14px]">Save Changes</button>
    </div>`;
}

/* ─── Action Handlers ─── */
function savePropertyMeta(section) {
    const meta = AppStore.meta(STATE.propertyId);
    if (section === 'info') {
        meta.info = {
            type: fieldVal('info_type'),
            built: fieldVal('info_built'),
            epc: fieldVal('info_epc'),
            epcExpiry: fieldVal('info_epcExpiry'),
            insuranceExpiry: fieldVal('info_insuranceExpiry'),
            mortgageRenewal: fieldVal('info_mortgageRenewal'),
            councilTax: fieldVal('info_council'),
            notes: fieldVal('info_notes'),
        };
        syncSmartReminders(false);
    } else if (section === 'alarms') {
        ['smoke', 'heat', 'co'].forEach(k => {
            meta.alarms[k] = {
                location: fieldVal(`${k}_location`),
                expiry: fieldVal(`${k}_expiry`),
                lastCheck: fieldVal(`${k}_check`),
            };
        });
        syncSmartReminders(false);
    } else if (section === 'appliances') {
        meta.appliances.forEach((a, i) => {
            a.name = fieldVal(`app_name_${i}`) || a.name;
            a.brand = fieldVal(`app_brand_${i}`) || a.brand;
            a.condition = fieldVal(`app_cond_${i}`) || document.querySelector(`[data-field="app_cond_${i}"]`)?.value || a.condition;
        });
    } else if (section === 'utilities') {
        Object.keys(meta.utilities).forEach(k => { meta.utilities[k] = fieldVal(`util_${k}`) || meta.utilities[k]; });
    } else if (section === 'parking') {
        meta.parking = {
            spaces: +fieldVal('park_spaces') || 0,
            type: fieldVal('park_type') || document.querySelector('[data-field="park_type"]')?.value,
            permit: fieldVal('park_permit'),
            notes: fieldVal('park_notes'),
        };
    }
    withLoading(() => { AppStore.save(); toast('Saved'); back(); });
}

function handleFeatureSave(el) {
    const screen = STATE.screen;
    if (screen === 'add-property') return saveAddProperty();
    if (screen === 'edit-property') return saveEditProperty();
    if (screen === 'edit-flat') return saveFlatDetails();
    if (screen === 'add-flat') return saveAddFlat();
    if (screen === 'log-maintenance') return saveLogMaintenance();
    if (screen === 'create-invoice') return saveCreateInvoice();
    if (screen === 'add-reminder') return saveReminder();
    if (screen === 'create-tenancy') return saveTenancy();
    if (screen === 'checkout-tenancy') return saveCheckout();
    if (screen === 'conduct-inspection') return saveInspection();
    if (screen === 'invite-tenant') return sendTenantInvitation();
    if (screen === 'edit-tenant') return saveEditTenant();
    if (screen === 'renew-compliance') return saveRenewCompliance();
    if (screen === 'edit-inventory-room') return saveEditInventoryRoom();
    if (screen === 'reschedule-inspection') return saveRescheduleInspection();
    if (screen === 'add-payment-method') return saveAddPaymentMethod();
    if (screen === 'edit-payment-method') return saveEditPaymentMethod();
    if (screen === 'personal-info') return savePersonalInfo();
    if (screen === 'password') return savePassword();
    if (screen === 'tenant-add-note') return saveTenantNote();
    if (screen === 'tenant-edit-note') return saveTenantNote(true);
    return false;
}

function saveAddProperty() {
    if (!validateFields([['name','Property Name',v=>v],['address','Address',v=>v],['rent','Default Rent per Flat',v=>v&&+v>0],['flatCount','Total Flats',v=>v&&+v>=1]])) return;
    const id = AppStore.nextId(PROPERTIES);
    const flatRent = `£${parseInt(fieldVal('rent')).toLocaleString()}`;
    const { units, building } = buildPropertyFlats({
        flatCount: fieldVal('flatCount'),
        floors: fieldVal('floors'),
        flatsPerFloor: fieldVal('flatsPerFloor'),
        defaultRent: flatRent,
        defaultBeds: fieldVal('flatBeds'),
        defaultBaths: fieldVal('flatBaths'),
        defaultSqft: fieldVal('flatSqft'),
    });
    PROPERTIES.push({
        id, name: fieldVal('name'), address: fieldVal('address'),
        status: 'Vacant',
        statusColor: ['#FEF3C7','#D97706'],
        tenant: null, rent: flatRent,
        compliance: false,
    });
    const meta = AppStore.meta(id);
    meta.building = building;
    meta.defaultFlatRent = flatRent;
    meta.units = units;
    if (fieldVal('postcode')) {
        if (!meta.info) meta.info = {};
        meta.info.postcode = fieldVal('postcode');
    }
    syncPropertyStatus(id);
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Property added'); go('properties'); });
}

function saveEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    if (!p) return;
    p.name = fieldVal('name') || p.name;
    p.address = fieldVal('address') || p.address;
    if (fieldVal('rent')) {
        const flatRent = `£${parseInt(fieldVal('rent')).toLocaleString()}`;
        p.rent = flatRent;
        applyDefaultFlatRent(STATE.propertyId, flatRent);
    }
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.info) meta.info = {};
    meta.info.notes = fieldVal('notes') || meta.info.notes;
    const building = getPropertyBuilding(STATE.propertyId);
    const floors = +fieldVal('floors') || 0;
    const flatsPerFloor = +fieldVal('flatsPerFloor') || 0;
    if (floors > 1 && flatsPerFloor > 0) {
        building.floors = floors;
        building.flatsPerFloor = flatsPerFloor;
        building.useFloors = true;
    } else if (!floors && !flatsPerFloor) {
        building.useFloors = false;
    }
    building.flatCount = getPropertyUnits(STATE.propertyId).length;
    meta.building = building;
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

function saveLogMaintenance() {
    if (!validateFields([['title','Issue Title',v=>v],['desc','Description',v=>v]])) return;
    const isTenant = STATE.userRole === 'tenant';
    const tenant = isTenant ? getActiveTenant() : null;
    const pid = isTenant ? tenant?.propertyId : (+fieldVal('propertyId') || STATE.propertyId);
    if (isTenant && pid == null) {
        toast('Tenant account not linked to a property');
        return;
    }
    const unit = isTenant ? tenant?.unit : (fieldVal('unit') || STATE.selectedUnit || '');
    const p = PROPERTIES[pid];
    const id = AppStore.nextId(MAINTENANCE_ITEMS);
    const entry = {
        id, issue: fieldVal('title'), prop: p.name, unit: unit || '—', time: 'Just now',
        priority: STATE.logPriority, contractor: '—', status: 'open', propertyId: pid,
        desc: fieldVal('desc'),
        photos: STATE.logMaintPhotos || [],
        history: [{ event: 'Issue reported', detail: fieldVal('desc'), time: 'Just now' }],
    };
    if (isTenant) {
        entry.reportedBy = 'tenant';
        entry.tenantName = `${tenant.firstName} ${tenant.lastName}`;
        entry.reportedAt = 'Just now';
        if (typeof ensureLandlordConversation === 'function') ensureLandlordConversation({ propertyId: pid });
    } else {
        entry.reportedBy = 'landlord';
    }
    MAINTENANCE_ITEMS.unshift(entry);
    STATE.logMaintPhotos = [];
    if (isTenant) {
        pushNotification({
            icon: 'wrench', color: ['#FEE2E2', '#DC2626'],
            title: 'Tenant reported issue', desc: `${entry.issue} · ${p.name}`,
            time: 'Just now', unread: true, screen: 'maintenance-detail', opts: { mid: id },
        });
    }
    withLoading(() => {
        AppStore.save();
        toast(isTenant ? 'Issue reported to landlord' : 'Issue logged');
        go(isTenant ? 'tenant-dashboard' : 'maintenance');
    });
}

function saveCreateInvoice() {
    if (!validateFields([['amount','Amount',v=>v&&+v>0],['due','Due Date',v=>v]])) return;
    const pid = +fieldVal('propertyId');
    const p = PROPERTIES[pid];
    const id = AppStore.nextId(INVOICES);
    INVOICES.unshift({
        id, num: `INV-2025-${1049 + id}`, prop: `${p.name}, ${p.address}`,
        amount: `£${parseInt(fieldVal('amount')).toLocaleString()}`, status: 'Pending', due: fieldVal('due'),
    });
    syncTransactionsFromInvoices();
    withLoading(() => { AppStore.save(); toast('Invoice created'); go('financial'); });
}

function saveReminder() {
    if (!validateFields([['title','Title',v=>v],['due','Due Date',v=>v]])) return;
    const due = new Date(fieldVal('due'));
    const daysLeft = Math.max(0, Math.ceil((due - new Date()) / 86400000));
    AppStore.reminders.push({
        id: AppStore.nextId(AppStore.reminders),
        type: fieldVal('type') || 'custom',
        propertyId: +fieldVal('propertyId'),
        title: fieldVal('title'),
        due: fieldVal('due'),
        daysLeft,
        urgency: daysLeft <= 7 ? 'high' : daysLeft <= 30 ? 'medium' : 'low',
    });
    withLoading(() => { AppStore.save(); toast('Reminder added'); go('reminders'); });
}

function saveTenancy() {
    if (!validateFields([['unit','Flat',v=>v],['rent','Rent',v=>v],['start','Start Date',v=>v],['end','End Date',v=>v]])) return;
    const type = fieldVal('tenancyType') || 'solo';
    const members = type === 'group' ? collectGroupMembers() : [];
    const leadName = type === 'group' && members[0]?.name ? members[0].name : null;
    const tenancy = {
        id: AppStore.nextId(AppStore.tenancies),
        propertyId: STATE.propertyId,
        type,
        unit: fieldVal('unit'),
        rent: `£${fieldVal('rent')}`,
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
    withLoading(() => {
        syncSmartReminders();
        AppStore.save();
        toast(type === 'group' ? 'Group tenancy created — invite each member' : 'Tenancy created');
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
    if (listItem) {
        listItem.status = 'inactive';
        listItem.lease = `Ended ${checkoutDate}`;
        listItem.leaseEnd = typeof formatLeaseMonthYear === 'function' ? formatLeaseMonthYear(checkoutDate) : checkoutDate;
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
    if (ten) {
        ten.status = 'ended';
        ten.end = checkoutDate;
        ten.checkout = { reason, notes, deposit };
    }
    if (listItem?.propertyId != null && listItem?.unit) {
        TENANT_INVITATIONS.filter(i => i.propertyId === listItem.propertyId && i.unit === listItem.unit && i.status === 'pending')
            .forEach(i => { i.status = 'cancelled'; });
        syncPropertyStatus(listItem.propertyId);
    }
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Check-out completed'); go('tenants'); });
}

function saveInspection() {
    if (!validateFields([['inspDate','Date',v=>v],['rating','Rating',v=>v]])) return;
    AppStore.inspections.filter(i => i.propertyId === STATE.propertyId && i.scheduled).forEach(i => { i.scheduled = false; });
    const photoCount = STATE.inspectionPhotos?.length || 0;
    AppStore.inspections.unshift({
        id: AppStore.nextId(AppStore.inspections),
        propertyId: STATE.propertyId,
        type: fieldVal('inspType'),
        date: fieldVal('inspDate'),
        rating: fieldVal('rating'),
        notes: fieldVal('inspNotes') || '',
        photos: photoCount,
        photoUrls: [...(STATE.inspectionPhotos || [])],
        report: `${fieldVal('inspType') || 'Inspection'} report.pdf`,
        scheduled: false,
    });
    STATE.inspectionPhotos = [];
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Inspection saved'); go('property-detail', { propertyId: STATE.propertyId, tab: 'inspection' }); });
}

function saveEditTenant() {
    const t = TENANTS[STATE.tenantId];
    const list = TENANT_LIST[STATE.tenantId];
    if (!t) return;
    if (!validateFields([
        ['firstName', 'First Name', v => v],
        ['lastName', 'Last Name', v => v],
        ['idNumber', 'NID', v => v],
        ['email', 'Email', v => v],
    ])) return;
    t.firstName = fieldVal('firstName');
    t.lastName = fieldVal('lastName');
    t.idNumber = fieldVal('idNumber') || t.idNumber;
    t.dob = fieldVal('dob') || t.dob;
    t.email = fieldVal('email');
    t.phone = fieldVal('phone') || t.phone;
    t.emergency = fieldVal('emergency') || t.emergency;
    t.emergencyPhone = fieldVal('emergencyPhone') || t.emergencyPhone;
    if (list) list.name = `${t.firstName} ${t.lastName}`;
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
        meta.alarms[cfg.alarmKey].expiry = fieldVal('expiryDate');
        meta.alarms[cfg.alarmKey].lastCheck = expiry || 'Just updated';
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
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Certificate renewed'); go('property-detail', { propertyId: pid, tab: 'compliance' }); });
}

function saveEditInventoryRoom() {
    const pid = STATE.propertyId ?? 0;
    const rid = STATE.roomId ?? 0;
    const key = inventoryKey(pid, rid);
    const items = getInventoryItems(pid, rid).map((item, i) => [
        item[0],
        fieldVal(`item_${i}`) || item[1],
    ]);
    AppStore.inventory[key] = {
        condition: fieldVal('condition') || 'Good',
        notes: fieldVal('roomNotes'),
        items,
        photos: AppStore.inventory[key]?.photos || [],
    };
    withLoading(() => { AppStore.save(); toast('Inventory updated'); go('inventory-room', { propertyId: pid, roomId: rid }); });
}

function saveRescheduleInspection() {
    if (!validateFields([['inspDate', 'Inspection Date', v => v]])) return;
    const pid = STATE.propertyId ?? 0;
    const dateStr = formatDisplayDate(fieldVal('inspDate'));
    const insp = AppStore.inspections.find(i => i.propertyId === pid && i.scheduled)
        || AppStore.inspections.find(i => i.propertyId === pid);
    if (insp) {
        insp.date = dateStr;
        insp.type = fieldVal('inspType') || insp.type;
        insp.scheduled = true;
        insp.notes = fieldVal('inspNotes');
        insp.timeSlot = fieldVal('timeSlot');
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
            timeSlot: fieldVal('timeSlot'),
        });
    }
    withLoading(() => { AppStore.save(); toast('Inspection rescheduled'); go('property-detail', { propertyId: pid, tab: 'inspection' }); });
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

function savePersonalInfo() {
    if (!validateFields([['firstName', 'First Name', v => v], ['lastName', 'Last Name', v => v], ['email', 'Email', v => v]])) return;
    LANDLORD_USER.firstName = fieldVal('firstName');
    LANDLORD_USER.lastName = fieldVal('lastName');
    LANDLORD_USER.email = fieldVal('email');
    LANDLORD_USER.phone = fieldVal('phone') || LANDLORD_USER.phone;
    LANDLORD_USER.address = fieldVal('address') || LANDLORD_USER.address;
    withLoading(() => { AppStore.save(); toast('Profile updated'); back(); });
}

function savePassword() {
    clearFormErrors();
    const current = fieldVal('currentPassword');
    const next = fieldVal('newPassword');
    const confirm = fieldVal('confirmPassword');
    let ok = true;
    if (!current) { STATE.formErrors.currentPassword = 'Current password is required'; ok = false; }
    if (!next || next.length < 8) { STATE.formErrors.newPassword = 'Use at least 8 characters'; ok = false; }
    if (next !== confirm) { STATE.formErrors.confirmPassword = 'Passwords do not match'; ok = false; }
    if (!ok) { toast('Please fix the errors below'); render(); return; }
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
    NOTIFICATIONS.forEach(n => { n.unread = false; });
    AppStore.save();
    toast('All marked as read');
    render();
}

function downloadDocument() {
    toast('Downloading Lease Agreement.pdf…');
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
    if (!AppStore.tenantDocuments[tid]) AppStore.tenantDocuments[tid] = [];
    const id = AppStore.tenantDocuments[tid].length + 1;
    AppStore.tenantDocuments[tid].push(['file-text', `Document_${id}.pdf`, 'Just now', '#2563EB']);
    AppStore.save();
    toast('Document uploaded');
    render();
}

function uploadNidProof() {
    const fileName = 'NID Proof.jpg';
    STATE.nidProofName = fileName;
    if (STATE.screen === 'edit-tenant' && STATE.tenantId != null) {
        ensureTenantNidProof(STATE.tenantId, fileName);
        AppStore.save();
    }
    toast('NID proof uploaded');
    render();
}

function screenTenantAddNote() {
    return `${topBar('Add Note', { back: true })}
    <div class="screen-content screen-enter">
        ${formTextarea('Note', '', 'Add a note about this tenant…', 'noteText')}
        <button data-action="save" class="btn-primary w-full py-3.5 text-[14px]">Save Note</button>
    </div>`;
}

function screenTenantEditNote() {
    const note = getTenantNotes(STATE.tenantId ?? 0).find(n => n.id === STATE.noteId);
    return `${topBar('Edit Note', { back: true })}
    <div class="screen-content screen-enter">
        ${formTextarea('Note', note?.text || '', 'Edit note…', 'noteText')}
        <button data-action="save" class="btn-primary w-full py-3.5 text-[14px]">Update Note</button>
    </div>`;
}

function assignContractorToJob(cid) {
    const item = maintItem(STATE.assignMaintId ?? STATE.maintId);
    const c = CONTRACTORS[cid];
    if (!item || !c) return;
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
    if (tenant) {
        pushNotification({
            icon: 'wrench', color: ['#DBEAFE', '#2563EB'],
            title: 'Contractor assigned', desc: `${c.name} assigned to ${item.issue}`,
            time: 'Just now', unread: true, screen: 'maintenance-detail', opts: { mid: item.id },
        });
    }
    AppStore.save();
    toast(`${c.name} assigned — they'll see the tenant complaint`);
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
        inv.status = 'Paid';
        syncTransactionsFromInvoices();
        pushNotification({
            icon: 'banknote', color: ['#ECFDF5', '#16A34A'],
            title: 'Rent received', desc: `${inv.amount} · ${inv.prop.split(',')[0]}`,
            time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid },
        });
        AppStore.save();
        toast('Rent marked as received');
        render();
    }
}

function payContractorInvoice(cid) {
    const inv = AppStore.contractorInvoices.find(c => c.id === cid);
    if (!inv) return;
    inv.status = 'Paid';
    if (typeof CONTRACTOR_JOBS !== 'undefined') {
        const job = CONTRACTOR_JOBS.find(j => j.maintId === inv.maintId);
        if (job) {
            job.status = 'paid';
            if (typeof saveContractorJobs === 'function') saveContractorJobs();
        }
    }
    const item = MAINTENANCE_ITEMS.find(m => m.id === inv.maintId);
    if (item) {
        item.status = 'done';
        if (typeof addMaintHistoryEvent === 'function') addMaintHistoryEvent(item, 'Contractor paid', inv.amount);
    }
    pushNotification({
        icon: 'banknote', color: ['#ECFDF5', '#16A34A'],
        title: 'Contractor paid', desc: `${inv.amount} to ${inv.contractor}`,
        time: 'Just now', unread: false, screen: 'financial', opts: {},
    });
    AppStore.save();
    toast(`Paid ${inv.amount} to ${inv.contractor}`);
    render();
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
    util.meters = {
        electricity: fieldVal('meter_electricity') || '',
        gas: fieldVal('meter_gas') || '',
        water: fieldVal('meter_water') || '',
    };
    AppStore.save();
    toast('Unit utilities saved');
    back();
}

function uploadUnitUtilityDoc() {
    const unit = STATE.selectedUnit;
    if (!unit) return;
    const util = getUnitUtilityMeta(STATE.propertyId, unit);
    if (!util.uploads) util.uploads = [];
    util.uploads.unshift({
        name: `Utility_Bill_${util.uploads.length + 1}.pdf`,
        by: STATE.userRole === 'tenant' ? 'Tenant' : 'Landlord',
        date: 'Just now',
    });
    AppStore.save();
    toast('Utility document uploaded');
    render();
}

function uploadFlatPhotoAction() {
    const unit = STATE.selectedUnit;
    if (!unit || STATE.propertyId == null) return;
    ensureFlatPhotos(STATE.propertyId);
    const meta = AppStore.meta(STATE.propertyId);
    const idx = (meta.unitPhotos ? Object.keys(meta.unitPhotos).length : 0) % IMG.interior.length;
    setFlatCoverPhoto(STATE.propertyId, unit, IMG.interior[idx]);
    AppStore.save();
    toast('Flat photo updated');
    render();
}

function uploadPhotoAction() {
    const meta = AppStore.meta(STATE.propertyId);
    if (STATE.screen === 'log-maintenance') {
        if (!STATE.logMaintPhotos) STATE.logMaintPhotos = [];
        STATE.logMaintPhotos.push(IMG.maint[STATE.logMaintPhotos.length % IMG.maint.length]);
        toast('Simulated upload — photo added to issue');
        render();
        return;
    }
    if (STATE.screen === 'conduct-inspection') {
        if (!STATE.inspectionPhotos) STATE.inspectionPhotos = [];
        STATE.inspectionPhotos.push(IMG.interior[STATE.inspectionPhotos.length % IMG.interior.length]);
        toast('Simulated upload — inspection photo added');
        render();
        return;
    }
    if (STATE.screen === 'edit-inventory-room' || STATE.screen === 'inventory-room') {
        const key = inventoryKey(STATE.propertyId, STATE.roomId ?? 0);
        if (!AppStore.inventory[key]) AppStore.inventory[key] = { condition: 'Good', notes: '', items: [], photos: [] };
        if (!AppStore.inventory[key].photos) AppStore.inventory[key].photos = [];
        AppStore.inventory[key].photos.push(IMG.interior[AppStore.inventory[key].photos.length % IMG.interior.length]);
        AppStore.save();
        toast('Simulated upload — room photo added');
        render();
        return;
    }
    if (STATE.screen === 'property-detail' && STATE.tab === 'documents') {
        const id = AppStore.nextId(AppStore.documents);
        AppStore.documents.push({
            id, propertyId: STATE.propertyId, type: 'Custom Document',
            name: `Document_${id + 1}.pdf`, date: 'Just now', shared: false, signed: false,
        });
        AppStore.save();
        toast('Simulated upload — document added');
        render();
        return;
    }
    if (STATE.screen === 'property-floor-plans') {
        meta.floorPlans.push({
            name: `Floor ${meta.floorPlans.length + 1}`,
            url: IMG.interior[meta.floorPlans.length % IMG.interior.length],
        });
        AppStore.save();
        toast('Simulated upload — floor plan added');
        render();
        return;
    }
    if (!meta.photos) meta.photos = [IMG.props[STATE.propertyId]];
    meta.photos.push(IMG.interior[meta.photos.length % IMG.interior.length]);
    AppStore.save();
    toast('Simulated upload — photo added');
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

function deleteDocumentAction(docId) {
    const doc = AppStore.documents.find(d => d.id === docId);
    if (!doc) { toast('Document not found'); return; }
    if (doc.type !== 'Custom Document') { toast('Only uploaded documents can be deleted'); return; }
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
    showConfirm('Delete Reminder', `Remove "${reminder.title}"?`, () => {
        AppStore.reminders = AppStore.reminders.filter(r => r.id !== reminderId);
        AppStore.save();
        toast('Reminder deleted');
        render();
    }, { okLabel: 'Delete', danger: true });
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

function cancelMaintenanceAction(maintId) {
    const item = maintItem(maintId);
    if (!item || item.status === 'done') { toast('Issue cannot be cancelled'); return; }
    showConfirm('Cancel Issue', `Cancel "${item.issue}"?`, () => {
        const idx = MAINTENANCE_ITEMS.findIndex(m => m.id === maintId);
        if (idx >= 0) MAINTENANCE_ITEMS.splice(idx, 1);
        AppStore.save();
        toast('Issue cancelled');
        go('maintenance');
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
    'portfolio-overview', 'compliance-dashboard', 'reminders', 'add-reminder',
    'create-tenancy', 'checkout-tenancy', 'assign-contractor', 'conduct-inspection',
    'create-invoice', 'mark-rent-received', 'pay-contractor', 'share-document',
    'property-floor-plans', 'property-photos', 'property-alarms', 'property-appliances', 'property-utilities', 'property-parking', 'property-info', 'unit-utilities', 'edit-flat', 'add-flat', 'flat-detail', 'tenancy-detail',
    'tenant-add-note', 'tenant-edit-note', 'maintenance-history', 'select-property-invite', 'global-search',
];

Object.assign(SCREEN_MAP, {
    'portfolio-overview': screenPortfolioOverview,
    'compliance-dashboard': screenComplianceDashboard,
    'reminders': screenReminders,
    'add-reminder': screenAddReminder,
    'create-tenancy': screenCreateTenancyEnhanced,
    'checkout-tenancy': screenCheckoutTenancy,
    'assign-contractor': screenAssignContractor,
    'conduct-inspection': screenConductInspection,
    'create-invoice': screenCreateInvoice,
    'mark-rent-received': screenMarkRentReceived,
    'pay-contractor': screenPayContractor,
    'share-document': screenShareDocument,
    'property-floor-plans': screenPropertyFloorPlans,
    'property-photos': screenPropertyPhotos,
    'property-alarms': () => screenPropertyDetailsEdit('alarms'),
    'property-appliances': () => screenPropertyDetailsEdit('appliances'),
    'property-utilities': () => screenPropertyDetailsEdit('utilities'),
    'property-parking': () => screenPropertyDetailsEdit('parking'),
    'property-info': () => screenPropertyDetailsEdit('info'),
    'unit-utilities': screenUnitUtilities,
    'edit-flat': screenEditFlat,
    'add-flat': screenAddFlat,
    'flat-detail': screenFlatDetail,
    'tenancy-detail': screenTenancyDetail,
    'tenant-add-note': screenTenantAddNote,
    'tenant-edit-note': screenTenantEditNote,
    'maintenance-history': screenMaintenanceHistory,
    'maintenance-detail': screenMaintenanceDetailEnhanced,
    'financial': screenFinancialEnhanced,
    'invite-tenant': screenInviteTenantEnhanced,
    'dashboard': screenDashboardEnhanced,
    'tenants': screenTenantsEnhanced,
    'select-property-invite': screenSelectPropertyInvite,
    'global-search': screenGlobalSearch,
    'document-preview': screenDocumentPreviewEnhanced,
});

NO_NAV.push(...FEATURE_SCREENS);

const FEATURE_BACK_MAP = {
    'portfolio-overview': 'dashboard',
    'compliance-dashboard': 'dashboard',
    'reminders': 'dashboard',
    'add-reminder': 'reminders',
    'create-tenancy': 'property-detail',
    'checkout-tenancy': 'tenant-detail',
    'assign-contractor': 'maintenance-detail',
    'conduct-inspection': 'property-detail',
    'create-invoice': 'financial',
    'mark-rent-received': 'financial',
    'pay-contractor': 'financial',
    'share-document': 'property-detail',
    'property-floor-plans': 'property-detail',
    'property-photos': 'property-detail',
    'property-alarms': 'property-detail',
    'property-appliances': 'property-detail',
    'property-utilities': 'property-detail',
    'property-parking': 'property-detail',
    'property-info': 'property-detail',
    'unit-utilities': 'property-detail',
    'edit-flat': 'flat-detail',
    'add-flat': 'property-detail',
    'flat-detail': 'property-detail',
    'tenancy-detail': 'flat-detail',
    'tenant-add-note': 'tenant-detail',
    'tenant-edit-note': 'tenant-detail',
    'maintenance-history': 'maintenance',
    'select-property-invite': 'tenants',
    'global-search': 'dashboard',
    'tenant-invite-sent': 'property-detail',
    'tenants': 'dashboard',
    'profile': 'dashboard',
};

DRAWER_NAV.splice(0, 0,
    ['pie-chart', 'Portfolio', 'portfolio-overview'],
    ['shield-check', 'Compliance', 'compliance-dashboard'],
    ['bell', 'Reminders', 'reminders'],
);

DRAWER_QUICK.push(['file-plus', 'Create Invoice', 'create-invoice']);

function bindFeatureEvents() {
    const app = document.getElementById('app');
    app.querySelectorAll('[data-action="save-reminder"]').forEach(el => { el.onclick = saveReminder; });
    app.querySelectorAll('[data-action="save-tenancy"]').forEach(el => { el.onclick = saveTenancy; });
    app.querySelectorAll('[data-action="save-checkout"]').forEach(el => { el.onclick = saveCheckout; });
    app.querySelectorAll('[data-action="save-inspection"]').forEach(el => { el.onclick = saveInspection; });
    app.querySelectorAll('[data-action="save-invoice"]').forEach(el => { el.onclick = saveCreateInvoice; });
    app.querySelectorAll('[data-action="assign-contractor"]').forEach(el => {
        el.onclick = () => assignContractorToJob(+el.dataset.cid);
    });
    app.querySelectorAll('[data-action="mark-invoice-paid"]').forEach(el => {
        el.onclick = () => markInvoicePaid(+el.dataset.iid);
    });
    app.querySelectorAll('[data-action="toggle-rent-receive"]').forEach(el => {
        el.onclick = (e) => { e.stopPropagation(); toggleRentReceiveInvoice(+el.dataset.iid); };
    });
    app.querySelectorAll('[data-action="toggle-rent-receive-all"]').forEach(el => {
        el.onclick = () => toggleRentReceiveAll();
    });
    app.querySelectorAll('[data-action="confirm-rent-received"]').forEach(el => {
        el.onclick = () => confirmMarkRentReceived();
    });
    app.querySelectorAll('[data-action="pay-contractor"]').forEach(el => {
        el.onclick = () => payContractorInvoice(+el.dataset.cid);
    });
    app.querySelectorAll('[data-action="confirm-share-doc"]').forEach(el => { el.onclick = shareDocumentConfirm; });
    app.querySelectorAll('[data-action="save-unit-utilities"]').forEach(el => { el.onclick = saveUnitUtilities; });
    app.querySelectorAll('[data-action="upload-unit-utility"]').forEach(el => { el.onclick = uploadUnitUtilityDoc; });
    app.querySelectorAll('[data-action="upload-flat-photo"]').forEach(el => { el.onclick = uploadFlatPhotoAction; });
    app.querySelectorAll('[data-action="upload-photo"]').forEach(el => { el.onclick = uploadPhotoAction; });
    app.querySelectorAll('[data-action="delete-property"]').forEach(el => { el.onclick = deleteProperty; });
    app.querySelectorAll('[data-action="delete-flat"]').forEach(el => { el.onclick = deleteFlatAction; });
    app.querySelectorAll('[data-action="delete-document"]').forEach(el => {
        el.onclick = () => deleteDocumentAction(+el.dataset.doc);
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
    app.querySelectorAll('[data-action="go-assign-contractor"]').forEach(el => {
        el.onclick = () => go('assign-contractor', { maintId: STATE.maintId });
    });
    app.querySelectorAll('[data-action="share-doc"]').forEach(el => {
        el.onclick = () => go('share-document', { shareDocId: +el.dataset.doc });
    });
    app.querySelectorAll('[data-action="confirm-cancel"]').forEach(el => {
        el.onclick = () => { STATE.confirm = null; render(); };
    });
    app.querySelectorAll('[data-action="confirm-ok"]').forEach(el => {
        el.onclick = () => { const fn = STATE.confirm?.onOk; STATE.confirm = null; if (fn) fn(); else render(); };
    });
    app.querySelectorAll('[data-action="save-preference"]').forEach(el => {
        el.onclick = () => savePreference(el.dataset.opt);
    });
    app.querySelectorAll('[data-action="mark-all-read"]').forEach(el => { el.onclick = markAllNotificationsRead; });
    app.querySelectorAll('[data-action="download-doc"]').forEach(el => { el.onclick = downloadDocument; });
    app.querySelectorAll('[data-action="share-doc-preview"]').forEach(el => { el.onclick = shareDocumentPreview; });
    app.querySelectorAll('[data-action="remove-payment-method"]').forEach(el => { el.onclick = removePaymentMethod; });
    app.querySelectorAll('[data-action="upload-tenant-doc"]').forEach(el => { el.onclick = uploadTenantDocument; });
    app.querySelectorAll('[data-action="upload-nid-proof"]').forEach(el => { el.onclick = uploadNidProof; });
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
    app.querySelectorAll('[data-action="close-photo-menu"]').forEach(el => {
        el.onclick = () => { STATE.photoMenuIdx = null; render(); };
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
    app.querySelectorAll('[data-action="maint-status"]').forEach(el => {
        el.onclick = () => updateMaintStatus(el.dataset.status);
    });
    app.querySelectorAll('[data-action="add-group-member"]').forEach(el => {
        el.onclick = addGroupMemberRow;
    });
    app.querySelectorAll('[data-tenant-maint-filter]').forEach(el => {
        el.onclick = () => { STATE.tenantMaintFilter = el.dataset.tenantMaintFilter; render(); };
    });
    app.querySelectorAll('[data-action="call-tenant"]').forEach(el => {
        el.onclick = () => {
            const t = TENANTS[STATE.tenantId];
            if (t?.phone) { window.location.href = `tel:${t.phone.replace(/\s/g, '')}`; }
            else toast('No phone number on file');
        };
    });
    app.querySelectorAll('[data-action="email-tenant"]').forEach(el => {
        el.onclick = () => {
            const t = TENANTS[STATE.tenantId];
            if (t?.email) { window.location.href = `mailto:${t.email}`; }
            else toast('No email on file');
        };
    });
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
    if (app && !app.querySelector('.modal-overlay') && STATE.photoMenuIdx != null && STATE.screen === 'property-photos') {
        app.insertAdjacentHTML('beforeend', photoActionSheet());
        lucide.createIcons();
    }
    if (app && STATE.loading && !app.querySelector('.app-loading-bar')) {
        app.insertAdjacentHTML('afterbegin', loadingBar());
    }
    bindFeatureEvents();
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
    if (STATE.screen === 'tenancy-detail' && STATE.selectedUnit) {
        go('flat-detail', { propertyId: STATE.propertyId, unit: STATE.selectedUnit });
        return;
    }
    if (FEATURE_BACK_MAP[STATE.screen]) {
        if (['edit-flat', 'unit-utilities'].includes(STATE.screen) && STATE.selectedUnit) {
            go('flat-detail', { propertyId: STATE.propertyId, unit: STATE.selectedUnit });
            return;
        }
        const target = FEATURE_BACK_MAP[STATE.screen];
        const opts = {};
        if (['property-detail','create-tenancy','conduct-inspection','share-document','property-photos','property-floor-plans','property-alarms','property-appliances','property-utilities','property-parking','property-info','edit-flat','add-flat','unit-utilities','flat-detail'].includes(STATE.screen)) {
            opts.propertyId = STATE.propertyId;
            if (STATE.screen === 'conduct-inspection') opts.tab = 'inspection';
            if (STATE.screen === 'share-document') opts.tab = 'documents';
            if (['property-photos','property-floor-plans','property-alarms','property-appliances','property-utilities','property-parking','property-info'].includes(STATE.screen)) opts.tab = 'details';
            if (['edit-flat','add-flat','unit-utilities','flat-detail','tenancy-detail'].includes(STATE.screen)) opts.tab = 'units';
            if (STATE.screen === 'flat-detail' && STATE.selectedUnit) opts.unit = STATE.selectedUnit;
        }
        if (STATE.screen === 'create-tenancy') opts.tab = 'tenant';
        if (STATE.screen === 'tenant-invite-sent') opts.tab = 'tenant';
        if (STATE.screen === 'checkout-tenancy') opts.tenantId = STATE.tenantId;
        if (STATE.screen === 'assign-contractor') opts.maintId = STATE.maintId;
        if (['tenant-add-note', 'tenant-edit-note'].includes(STATE.screen)) {
            opts.tenantId = STATE.tenantId;
            opts.tenantTab = 'notes';
        }
        go(target, opts);
        return;
    }
    _origBack();
};

function goFeature(screen, opts = {}) {
    if (opts.shareDocId != null) STATE.shareDocId = opts.shareDocId;
    if (opts.assignMaintId != null) STATE.assignMaintId = opts.assignMaintId;
    if (screen === 'invite-tenant' && (opts.inviteEmail || opts.inviteFirst)) {
        STATE.invitePrefill = {
            email: opts.inviteEmail || '',
            firstName: opts.inviteFirst || '',
            lastName: opts.inviteLast || '',
            phone: opts.invitePhone || '',
        };
    } else if (screen !== 'invite-tenant') {
        STATE.invitePrefill = null;
    }
    if (screen === 'add-flat') {
        STATE.flatDuplicateFrom = opts.duplicateFrom || null;
        STATE.selectedUnit = null;
    } else if (opts.unit) STATE.selectedUnit = opts.unit;
    if (screen === 'chat') markConversationRead(opts.chatId ?? STATE.chatId ?? 0);
    if (screen === 'mark-rent-received') initRentReceiveSelection();
}
const _origGo = go;
go = function(screen, opts = {}) {
    goFeature(screen, opts);
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
