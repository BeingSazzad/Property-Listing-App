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
            { id: 0, propertyId: 0, tenantId: 0, type: 'solo', unit: 'Flat 2A', rent: '£2,450', start: '2024-01-15', end: '2026-01-14', status: 'active' },
            { id: 1, propertyId: 1, tenantId: 1, type: 'solo', unit: 'Unit 1', rent: '£1,850', start: '2023-06-01', end: '2025-05-31', status: 'active' },
            { id: 2, propertyId: 3, tenantId: 2, type: 'group', unit: 'Flat B', rent: '£1,950', start: '2024-03-10', end: '2026-03-09', status: 'active', occupants: 2, members: [
                { name: 'Michael Lee', phone: '+44 7700 900321' },
                { name: 'Emma Lee', phone: '+44 7700 900322' },
            ]},
        ];
        this.inspections = [
            { id: 0, propertyId: 0, type: 'Check-in', date: 'Jan 15, 2024', rating: '4.8', photos: 6, report: 'Check-in report.pdf' },
            { id: 1, propertyId: 0, type: 'Annual', date: 'Jan 10, 2023', rating: '4.5', photos: 8, report: 'Annual 2023.pdf' },
            { id: 2, propertyId: 1, type: 'Mid-term', date: 'Feb 28, 2025', rating: null, photos: 0, report: null, scheduled: true },
        ];
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
        this.inventory = {};
        this.paymentMethods = [
            { id: 0, type: 'Visa', last4: '4242', exp: '08/27', name: 'John Smith', default: true },
            { id: 1, type: 'Barclays', last4: '8901', exp: '—', name: 'Rent Collection', default: false },
        ];
        this.complianceCerts = {};
        this.tenantDocuments = {
            0: [
                ['file-text', 'Lease Agreement.pdf', 'Jan 15, 2024', '#2563EB'],
                ['file-image', 'ID Scan.jpg', 'Jan 10, 2024', '#7C3AED'],
                ['file-check', 'Reference Letter.pdf', 'Jan 8, 2024', '#059669'],
            ],
            1: [['file-text', 'Lease Agreement.pdf', 'Jun 1, 2023', '#2563EB']],
            2: [], 3: [],
        };
        PROPERTIES.forEach(p => {
            if (!this.propertyMeta[p.id]) {
                this.propertyMeta[p.id] = {
                    building: { floors: 2, flatsPerFloor: 2 },
                    units: generatePropertyUnits(2, 2),
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
                    info: { type: 'Semi-detached', built: '1985', epc: 'Rating B', councilTax: 'Band D', notes: '' },
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

function getInventoryRooms() {
    return INVENTORY_ROOM_NAMES.map((name, i) => {
        const inv = AppStore.inventory[inventoryKey(STATE.propertyId, i)];
        const condition = inv?.condition || (i === 2 ? 'Fair' : 'Good');
        const count = inv?.items?.length || DEFAULT_INVENTORY_ITEMS.length;
        return [name, condition, `${count} items`];
    });
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
                <button type="button" data-action="edit-tenant-note" data-nid="${n.id}" class="tenant-note-edit"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
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

function renderPropertyOverviewDetails(propertyId) {
    const p = PROPERTIES[propertyId];
    if (!p) return '';
    const meta = AppStore.meta(propertyId);
    const info = meta.info || {};
    const utilLabels = Object.entries(meta.utilities || {}).filter(([, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
    const applianceNames = (meta.appliances || []).map(a => a.name).filter(Boolean);
    const alarmNames = Object.keys(meta.alarms || {}).map(k => `${k === 'co' ? 'CO' : k.charAt(0).toUpperCase() + k.slice(1)} Alarm`);
    const parkingLabel = meta.parking?.spaces ? `Parking (${meta.parking.spaces})` : 'Parking';
    const photoCount = meta.photos?.length || 0;
    return `
    <div class="screen-content">
        <div class="grid grid-cols-2 gap-4">
            ${[[p.rent,'Monthly Rent'],[p.beds,'Bedrooms'],[p.baths,'Bathrooms'],[p.sqft,'Sq Ft']].map(([v,l])=>`
            <div class="card p-4"><p class="text-[10px] text-[#64748B] uppercase tracking-wide font-medium">${l}</p><p class="text-xl font-bold text-[#0F172A] mt-1">${v}</p></div>`).join('')}
        </div>
        <div class="card p-4">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-[14px] font-bold">Property Photos</h3>
                <span class="text-[12px] text-[#64748B]">${photoCount} photo${photoCount === 1 ? '' : 's'}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-3">
                ${(meta.photos || []).slice(0, 3).map((src, i) => `
                <div class="aspect-square rounded-xl overflow-hidden relative">
                    <img src="${src}" class="img-cover" alt="">
                    ${i === 0 ? '<span class="photo-cover-badge">Cover</span>' : ''}
                </div>`).join('')}
            </div>
            <button data-go="property-photos" class="btn-secondary w-full py-3 text-[13px]">Manage Photos</button>
        </div>
        <div class="card p-4 space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-[14px] font-bold">Property Information</h3>
                <button data-go="property-info" class="text-[12px] font-semibold text-[#2563EB]">Edit</button>
            </div>
            ${[['Type', info.type || '—'], ['Built', info.built || '—'], ['EPC', info.epc || '—'], ['Council Tax', info.councilTax || '—']].map(([k,v])=>`
            <div class="flex justify-between py-1.5 border-b border-[#F1F5F9] last:border-0 text-[13px]"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
        </div>
        <div class="card p-4">
            <h3 class="text-[14px] font-bold mb-3">Utilities & Parking</h3>
            <div class="flex flex-wrap gap-2 mb-3">${[...utilLabels, parkingLabel].map(u=>`<span class="badge bg-[#F1F5F9] text-[#475569]">${u}</span>`).join('') || '<span class="text-[12px] text-[#64748B]">No utilities set</span>'}</div>
            <div class="grid grid-cols-2 gap-2">
                <button data-go="property-utilities" class="btn-secondary py-2 text-[12px]">Edit Utilities</button>
                <button data-go="property-parking" class="btn-secondary py-2 text-[12px]">Edit Parking</button>
            </div>
        </div>
        <div class="card p-4">
            <h3 class="text-[14px] font-bold mb-3">Appliances & Alarms</h3>
            <div class="flex flex-wrap gap-2 mb-3">${[...applianceNames, ...alarmNames].map(u=>`<span class="badge bg-[#EFF6FF] text-[#2563EB]">${u}</span>`).join('') || '<span class="text-[12px] text-[#64748B]">No items added</span>'}</div>
            <div class="grid grid-cols-2 gap-2">
                <button data-go="property-appliances" class="btn-secondary py-2 text-[12px]">Appliances</button>
                <button data-go="property-alarms" class="btn-secondary py-2 text-[12px]">Alarms</button>
            </div>
        </div>
        <button data-go="property-floor-plans" class="btn-secondary w-full py-3 text-[13px]">View Floor Plans</button>
        ${(() => {
            const units = getPropertyUnits(propertyId);
            const avail = getAvailableUnits(propertyId);
            return units.length ? `
        <div class="card p-4">
            <h3 class="text-[14px] font-bold mb-2">Building Units</h3>
            <p class="text-[12px] text-[#64748B] mb-3">${getPropertyBuilding(propertyId).floors} floor(s) · ${units.length} unit(s) · ${avail.length} available</p>
            <div class="flex flex-wrap gap-2">${units.map(u => {
                const taken = !avail.includes(u);
                return `<span class="badge ${taken ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DCFCE7] text-[#16A34A]'}">${u}${taken ? ' · Occupied' : ''}</span>`;
            }).join('')}</div>
        </div>` : '';
        })()}
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

function getUnreadNotifCount() {
    return NOTIFICATIONS.filter(n => n.unread).length;
}

function syncTransactionsFromInvoices() {
    TRANSACTIONS.length = 0;
    INVOICES.forEach(inv => {
        const propName = inv.prop.split(',')[0].trim();
        const prop = PROPERTIES.find(p => inv.prop.includes(p.name));
        TRANSACTIONS.push({
            tenant: prop?.tenant || 'Tenant',
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
        t.propertyId === invite.propertyId && (t.name === fullName || t.status === 'pending')
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
            email: invite.email, phone: invite.phone, prop: p?.name || '',
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
            moveIn: invite.leaseStart, leaseEnd: invite.leaseEnd, rent: rentRaw,
        });
    }

    let ten = AppStore.tenancies.find(x => x.propertyId === invite.propertyId && (activated ? x.status === 'active' : x.status === 'pending'));
    if (!ten) {
        AppStore.tenancies.push({
            id: AppStore.nextId(AppStore.tenancies), propertyId: invite.propertyId, tenantId: tid,
            type: 'solo', unit: invite.unit, rent: rentFmt, start: invite.leaseStart, end: invite.leaseEnd,
            status: activated ? 'active' : 'pending',
        });
    } else {
        ten.tenantId = tid;
        ten.unit = invite.unit;
        ten.rent = rentFmt;
        ten.start = invite.leaseStart;
        ten.end = invite.leaseEnd;
        ten.status = activated ? 'active' : 'pending';
    }

    if (activated && p) {
        p.tenant = fullName;
        p.status = 'Occupied';
        p.statusColor = ['#DCFCE7', '#16A34A'];
        listItem.status = 'active';
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

function renderPropertyTenantTab(propertyId) {
    const p = PROPERTIES[propertyId];
    const active = tenantListByProperty(propertyId);
    const pending = pendingInviteForProperty(propertyId);
    const tenancy = AppStore.tenancies.find(t => t.propertyId === propertyId && t.status === 'active');

    if (active?.status === 'active') {
        const t = tenantRecordById(active.id);
        const chatId = active.chatId ?? getTenantChatId(active.id);
        return `
        <div class="screen-content screen-content-sm">
            <div class="card p-4 flex items-center gap-4">
                <img src="${active.img}" class="w-14 h-14 rounded-full object-cover ring-2 ring-[#EFF6FF]" alt="">
                <div class="flex-1 min-w-0">
                    <h3 class="text-[16px] font-bold text-[#0F172A]">${active.name}</h3>
                    <span class="badge bg-[#DCFCE7] text-[#16A34A] mt-1 inline-block">Active Lease</span>
                </div>
                <button data-go="tenant-detail" data-tid="${active.id}" class="text-[13px] font-semibold text-[#2563EB] shrink-0">View</button>
            </div>
            <div class="card divide-y divide-[#F1F5F9]">
                ${[
                    ['phone', t?.phone || '—'],
                    ['mail', t?.email || '—'],
                    ['home', `${active.unit || '—'} · ${active.prop}`],
                    ['calendar', `Move-in: ${typeof formatDisplayDate === 'function' ? formatDisplayDate(t?.moveIn) : '—'}`],
                    ['calendar-clock', `Lease ends: ${typeof formatDisplayDate === 'function' ? formatDisplayDate(t?.leaseEnd) : active.leaseEnd}`],
                    ['user', `Emergency: ${t?.emergency || '—'}`],
                ].map(([ic, v]) => `
                <div class="px-4 py-3.5 flex items-center gap-3"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B] shrink-0"></i><span class="text-[13px] font-medium text-[#0F172A]">${v}</span></div>`).join('')}
            </div>
            <div class="grid grid-cols-2 gap-3 pt-1">
                <button data-go="chat" data-chat="${chatId}" class="btn-primary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="message-square" class="w-4 h-4"></i>Message</button>
                <button data-tab="documents" class="btn-secondary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="file-text" class="w-4 h-4"></i>Lease</button>
            </div>
            <button data-go="checkout-tenancy" data-tid="${active.id}" class="btn-secondary w-full py-3 text-[13px] mt-3 text-[#DC2626] border border-[#FECACA]">Check-out Tenancy</button>
        </div>`;
    }

    if (pending) {
        return `
        <div class="screen-content screen-content-sm">
            <div class="card p-5 text-center border border-[#FDE68A] bg-[#FFFBEB]">
                <i data-lucide="mail" class="w-10 h-10 text-[#D97706] mx-auto"></i>
                <p class="text-[15px] font-bold text-[#0F172A] mt-3">Invitation Pending</p>
                <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed"><strong>${pending.firstName} ${pending.lastName}</strong> has been invited to <strong>${pending.unit}</strong>. Waiting for them to activate their account.</p>
                <p class="text-[12px] text-[#94A3B8] mt-2">Sent ${pending.sentAt} · ${pending.email}</p>
            </div>
            ${tenancy ? `<div class="card p-4"><p class="text-[13px] font-semibold">Tenancy created</p><p class="text-[12px] text-[#64748B] mt-1">${tenancy.unit} · ${tenancy.rent}/mo · ${formatLeaseRange(tenancy.start, tenancy.end)}</p></div>` : ''}
            <button data-go="tenant-invite-sent" class="btn-secondary w-full py-3 text-[13px] mt-2">View Invitation</button>
            <button data-go="invite-tenant" data-pid="${propertyId}" class="btn-primary w-full py-3 text-[13px] mt-2">Resend / Edit Invite</button>
        </div>`;
    }

    if (tenancy) {
        const lead = tenancy.members?.[0]?.name;
        return `
        <div class="screen-content screen-content-sm">
            <div class="card p-5 text-center">
                <i data-lucide="file-key" class="w-10 h-10 text-[#2563EB] mx-auto"></i>
                <p class="text-[15px] font-bold text-[#0F172A] mt-3">Tenancy Active</p>
                <p class="text-[13px] text-[#64748B] mt-2">${tenancy.unit} · ${tenancy.rent}/mo</p>
                <p class="text-[12px] text-[#94A3B8] mt-1">${formatLeaseRange(tenancy.start, tenancy.end)}</p>
                ${lead ? `<p class="text-[12px] text-[#64748B] mt-2">Lead: ${lead}</p>` : ''}
            </div>
            <p class="text-[12px] text-[#64748B] text-center px-2">Invite the tenant so they can access the portal and appear in your tenant list.</p>
            <button data-go="invite-tenant" data-pid="${propertyId}" class="btn-primary w-full py-3.5 text-[14px]">Invite Tenant</button>
        </div>`;
    }

    return `
    <div class="screen-content screen-content-sm">
        <div class="card p-8 text-center">
            <i data-lucide="user-x" class="w-12 h-12 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold mt-3 text-[#0F172A]">No tenant assigned</p>
            <p class="text-[12px] text-[#64748B] mt-1">Create a tenancy or send an invitation to get started.</p>
        </div>
        <button data-go="create-tenancy" data-pid="${propertyId}" class="btn-secondary w-full mt-3 py-3 text-[13px]">Create Tenancy</button>
        <button data-go="invite-tenant" data-pid="${propertyId}" class="btn-primary w-full mt-2 py-3 text-[13px]">Invite Tenant</button>
    </div>`;
}

function renderPropertyTimelineTab(propertyId) {
    const events = [];
    const p = PROPERTIES[propertyId];
    AppStore.inspections.filter(i => i.propertyId === propertyId).slice(0, 3).forEach(i => {
        events.push(['#F59E0B', 'Inspection', `${i.type || 'Inspection'} · ${i.date}`, i.scheduled ? 'Scheduled' : 'Completed']);
    });
    MAINTENANCE_ITEMS.filter(m => m.propertyId === propertyId).slice(0, 3).forEach(m => {
        events.push(['#22C55E', m.status === 'done' ? 'Maintenance done' : 'Maintenance logged', m.issue, m.time]);
    });
    if (p?.tenant) events.push(['#2563EB', 'Tenant linked', p.tenant, 'Active']);
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
    const certKey = (cid) => `${propertyId}-${cid}`;
    return `
    <div class="screen-content screen-content-sm">
        ${COMPLIANCE_ITEMS.map(([ic, n, exp], cid) => {
            const saved = AppStore.complianceCerts[certKey(cid)];
            const displayExp = saved?.expiry ? (typeof formatDisplayDate === 'function' ? formatDisplayDate(saved.expiry) : saved.expiry) : exp;
            return `
        <div class="card p-3.5 flex items-center gap-3">
            <div class="w-1 h-11 rounded-full shrink-0 bg-[#22C55E]"></div>
            <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
            <div class="flex-1"><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${displayExp}</p></div>
            <button data-go="renew-compliance" data-pid="${propertyId}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>
        </div>`;
        }).join('')}
    </div>`;
}

function screenDocumentPreviewEnhanced() {
    let name = 'Document';
    let type = 'File';
    let date = '—';
    let docId = null;
    if (STATE.previewDocSource === 'tenant') {
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
            <p class="text-[16px] font-bold mt-4">${name}</p>
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
    </div>`;
}

function screenDashboardEnhanced() {
    const openMaint = MAINTENANCE_ITEMS.filter(m => m.status === 'open').length;
    const tenantCount = TENANT_LIST.filter(t => t.status === 'active').length;
    const vacantCount = PROPERTIES.filter(p => p.status === 'Vacant').length;
    const occupiedCount = PROPERTIES.length - vacantCount;
    const compliantCount = PROPERTIES.filter(p => p.compliance).length;
    const occupancy = PROPERTIES.length ? Math.round((occupiedCount / PROPERTIES.length) * 100) : 0;
    const monthlyRent = PROPERTIES.reduce((s, p) => s + parseInt(p.rent.replace(/[^\d]/g, ''), 10), 0);
    const fin = financialStats();
    const overdueAmt = INVOICES.filter(i => i.status === 'Overdue').reduce((s, i) => s + parseInt(i.amount.replace(/[^\d]/g, ''), 10), 0);
    const overdueAmount = overdueAmt ? `£${overdueAmt.toLocaleString()}` : null;
    const collectedPct = fin.pct;
    const compliancePct = PROPERTIES.length ? Math.round((compliantCount / PROPERTIES.length) * 100) : 0;
    const unreadBell = getUnreadNotifCount();
    const landlordName = LANDLORD_USER.firstName || 'John';
    const reminders = AppStore.reminders.slice(0, 3).map(r => {
        const prop = PROPERTIES[r.propertyId];
        const rt = REMINDER_TYPES.find(t => t[0] === r.type) || ['custom', r.title, 'bell', '#EFF6FF', '#2563EB'];
        const tab = r.type === 'inspection' ? 'inspection' : r.type === 'rent-review' ? 'overview' : 'compliance';
        return [rt[2], r.title, prop?.name || '', `${r.daysLeft} days left`, rt[3], rt[4], r.propertyId, tab, r.urgency];
    });
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <button data-go="notifications-list" class="top-icon-btn relative">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            ${unreadBell ? `<span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">${unreadBell}</span>` : ''}
        </button>
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
            <p class="dash-hero-amount">£${monthlyRent.toLocaleString()}</p>
            <p class="dash-hero-sub">From ${occupiedCount} occupied ${occupiedCount === 1 ? 'property' : 'properties'}</p>
            <div class="dash-hero-stats">
                <button data-go="properties" class="dash-hero-stat"><strong>${PROPERTIES.length}</strong><span>Properties</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="tenants" class="dash-hero-stat"><strong>${tenantCount}</strong><span>Tenants</span></button>
                <div class="dash-hero-divider"></div>
                <button data-go="properties" class="dash-hero-stat"><strong>${occupancy}%</strong><span>Occupied</span></button>
            </div>
        </div>
        ${overdueAmount ? `
        <button data-go="financial" class="dash-alert">
            <div class="dash-alert-icon"><i data-lucide="alert-circle" class="w-5 h-5"></i></div>
            <div class="dash-alert-body">
                <p class="dash-alert-title">${overdueAmount} overdue rent</p>
                <p class="dash-alert-desc">Tap to review and follow up with tenant</p>
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
            ${dashStatCard({ go: 'properties', variant: 'vacant', icon: 'home', label: 'Vacant', value: vacantCount, pill: vacantCount ? 'Fill' : null })}
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
        all: TENANT_LIST.length,
        active: TENANT_LIST.filter(t => t.status === 'active').length,
        inactive: TENANT_LIST.filter(t => t.status === 'inactive').length,
        pending: TENANT_LIST.filter(t => t.status === 'pending').length,
    };
    const defaultPid = PROPERTIES.find(p => p.status === 'Vacant')?.id ?? PROPERTIES[0]?.id ?? 0;
  return `${topBar('Tenants', { sub: `${counts.active} active · ${counts.pending} pending` })}
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
            <div class="flex-1"><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.tenant || 'Vacant'} · ${p.rent}/mo</p></div>
            <span class="badge" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
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
    if (!meta.building) meta.building = { floors: 2, flatsPerFloor: 2 };
    return meta.building;
}

function generatePropertyUnits(floors, flatsPerFloor) {
    const units = [];
    const fCount = Math.max(1, +floors || 1);
    const perFloor = Math.max(1, +flatsPerFloor || 1);
    for (let f = 1; f <= fCount; f++) {
        for (let u = 1; u <= perFloor; u++) {
            units.push(perFloor > 1 ? `Flat ${f}${String.fromCharCode(64 + u)}` : `Flat ${f}`);
        }
    }
    return units;
}

function getPropertyUnits(propertyId) {
    const meta = AppStore.meta(propertyId);
    const building = getPropertyBuilding(propertyId);
    if (!meta.units?.length) meta.units = generatePropertyUnits(building.floors, building.flatsPerFloor);
    return meta.units;
}

function getAvailableUnits(propertyId) {
    const occupied = new Set(
        AppStore.tenancies
            .filter(t => t.propertyId === propertyId && t.status === 'active')
            .map(t => t.unit)
    );
    return getPropertyUnits(propertyId).filter(u => !occupied.has(u));
}

function unitSelectHtml(propertyId, fieldKey = 'unit', invite = false) {
    const avail = getAvailableUnits(propertyId);
    const all = getPropertyUnits(propertyId);
    const options = avail.length ? avail : all;
    const attr = invite ? 'data-invite' : 'data-field';
    return `<select ${attr}="${fieldKey}" class="form-input form-select">${options.map(u => `<option value="${u}">${u}${avail.length ? '' : ' (occupied)'}</option>`).join('')}</select>`;
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
        const ten = AppStore.tenancies.find(t => t.propertyId === p.id && t.status === 'active');
        if (ten?.end) {
            upsertSmartReminder({
                type: 'rent-review', propertyId: p.id, title: 'Lease Ending Soon', due: ten.end,
            });
        }
    });
    Object.entries(AppStore.complianceCerts || {}).forEach(([key, cert]) => {
        if (!cert?.expiry) return;
        const [pid, cid] = key.split('-').map(Number);
        const names = ['Gas Certificate', 'Electrical Certificate', 'EPC Certificate'];
        const types = ['gas', 'electrical', 'epc'];
        upsertSmartReminder({
            type: types[cid] || 'custom',
            propertyId: pid,
            title: `${names[cid] || 'Certificate'} Expiry`,
            due: cert.expiry,
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
            <p class="fin-inv-prop">${meta.propShort}</p>
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
    const netTrend = 12.4;
    return `${topBar('Finances')}
    <div class="screen-content screen-enter financial-page">
        ${counts.overdue ? `
        <button type="button" data-invoice-filter="overdue" class="fin-alert">
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
                <span>Mark Rent Received</span>
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
        <div class="fin-net card">
            <div class="fin-net-left">
                <div class="fin-net-icon"><i data-lucide="wallet" class="w-5 h-5"></i></div>
                <div>
                    <p class="fin-net-label">Net received this month</p>
                    <p class="fin-net-value">£${stats.collected.toLocaleString()}</p>
                </div>
            </div>
            <div class="fin-net-trend">
                <span class="fin-net-trend-up"><i data-lucide="trending-up" class="w-4 h-4"></i>${netTrend}%</span>
                <span class="fin-net-trend-sub">vs last month</span>
            </div>
        </div>
    </div>`;
}

function renderPropertyInspectionTab(propertyId) {
    const upcoming = AppStore.inspections.find(i => i.propertyId === propertyId && i.scheduled);
    const past = AppStore.inspections.filter(i => i.propertyId === propertyId && !i.scheduled);
    const meta = AppStore.meta(propertyId);
    const photos = (meta.photos || IMG.interior).slice(0, 6);
    return `
    <div class="screen-content">
        ${upcoming ? `
        <div class="card p-4 bg-gradient-to-br from-[#EFF6FF] to-white border-[#BFDBFE]">
            <p class="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Upcoming</p>
            <p class="text-[15px] font-bold mt-1">${upcoming.type || 'Inspection'}</p>
            <p class="text-[12px] text-[#64748B]">${typeof formatDisplayDate === 'function' ? formatDisplayDate(upcoming.date) || upcoming.date : upcoming.date}</p>
            <div class="grid grid-cols-2 gap-2 mt-3">
                <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-secondary py-2.5 text-[12px]">Reschedule</button>
                <button data-go="conduct-inspection" data-pid="${propertyId}" class="btn-primary py-2.5 text-[12px]">Conduct Now</button>
            </div>
        </div>` : `
        <div class="card p-4 text-center">
            <p class="text-[13px] text-[#64748B]">No upcoming inspection scheduled</p>
            <button data-go="reschedule-inspection" data-pid="${propertyId}" class="btn-primary w-full py-2.5 text-[12px] mt-3">Schedule Inspection</button>
        </div>`}
        <h3 class="text-[14px] font-bold">Past Reports</h3>
        ${past.length ? past.map(i => `
        <div class="card p-3.5 flex justify-between items-center">
            <div>
                <p class="text-[13px] font-semibold">${i.type || 'Inspection'}</p>
                <p class="text-[11px] text-[#64748B]">${typeof formatDisplayDate === 'function' ? formatDisplayDate(i.date) || i.date : i.date}</p>
            </div>
            ${i.rating ? `<span class="badge bg-[#DCFCE7] text-[#16A34A]">★ ${i.rating}</span>` : '<span class="badge bg-[#F1F5F9] text-[#64748B]">Report</span>'}
        </div>`).join('') : `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No past reports yet</p></div>`}
        <h3 class="text-[14px] font-bold">Photos</h3>
        <div class="grid grid-cols-3 gap-2">${photos.map(src => `<div class="aspect-square rounded-xl overflow-hidden"><img src="${src}" class="img-cover" alt=""></div>`).join('')}</div>
        <button data-go="property-photos" data-pid="${propertyId}" class="btn-secondary w-full py-3 text-[13px] mt-2">Manage Photos</button>
    </div>`;
}

function screenMaintenanceHistory() {
    const done = MAINTENANCE_ITEMS.filter(m => m.status === 'done');
    return `${topBar('Maintenance History', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[12px] text-[#64748B] mb-3">${done.length} completed job${done.length === 1 ? '' : 's'}</p>
        <div class="stack-sm">
            ${done.length ? done.map(m => `
            <button data-go="maintenance-detail" data-mid="${m.id}" class="maint-card card w-full text-left">
                <img src="${IMG.maint[m.id % IMG.maint.length]}" class="maint-card-thumb" alt="">
                <div class="maint-card-body">
                    <p class="maint-card-title">${m.issue}</p>
                    <p class="maint-card-sub">${m.prop}</p>
                    <p class="maint-card-time">Completed · ${m.time}</p>
                </div>
                <span class="badge bg-[#ECFDF5] text-[#16A34A]">Done</span>
            </button>`).join('') : emptyState('wrench', 'No history yet', 'Completed jobs will appear here.', 'Back to Maintenance', null, 'maintenance')}
        </div>
    </div>`;
}

function screenMaintenanceDetailEnhanced() {
    const item = maintItem(STATE.maintId);
    const statusLabel = maintStatusLabel[item.status] || item.status;
    const [pBg, pColor] = maintPriorityStyle(item.priority);
    const timeline = getMaintTimeline(item);
    const contractorAvatar = item.contractor === 'Heating Co.' ? IMG.avatar.heating
        : item.contractor === 'Electric Fix' ? IMG.avatar.electric : IMG.avatar.plumber;
    const chatId = getContractorChatId(item.contractor);
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
            ${chatId != null ? `<button data-go="chat" data-chat="${chatId}" class="text-[13px] font-semibold text-[#2563EB]">Contact</button>` : ''}
        </div>` : `<button data-action="go-assign-contractor" class="btn-secondary w-full py-3 text-[13px]">Assign Contractor</button>`}
        ${item.contractor !== '—' ? `<button data-action="go-assign-contractor" class="btn-secondary w-full py-3 text-[13px]">Reassign Contractor</button>` : ''}
        ${item.status === 'open' ? `<button data-action="maint-status" data-status="progress" class="btn-secondary w-full py-3 text-[13px]">Mark In Progress</button>` : ''}
        ${item.status === 'progress' ? `<button data-action="maint-status" data-status="done" class="btn-primary w-full py-3.5 text-[14px]">Mark Complete</button>` : ''}
        <p class="screen-section-title">Job Timeline</p>
        <div class="relative pl-6 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            ${timeline.map(([t, d]) => `
            <div class="relative"><div class="absolute -left-6 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white"></div>
            <p class="text-[13px] font-medium">${t}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>`).join('')}
        </div>
        ${item.status === 'done' ? `<p class="text-[13px] text-center text-[#059669] font-semibold py-2">This issue has been resolved</p>` : ''}
    </div>`;
}

function screenInviteTenantEnhanced() {
    const p = PROPERTIES[STATE.propertyId];
    return `${topBar('Invite Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4 flex items-center gap-3">
            <img src="${IMG.props[STATE.propertyId]}" class="w-14 h-14 rounded-xl object-cover" alt="">
            <div><p class="text-[14px] font-bold">${p.name}</p><p class="text-[12px] text-[#64748B]">${p.address} · ${p.rent}/month</p></div>
        </div>
        <p class="text-[12px] text-[#64748B] leading-relaxed">Create a tenant profile and send a secure invitation. They must accept the invite before accessing the portal.</p>
        <div><label class="form-label">First Name</label><input data-invite="firstName" type="text" class="form-input" placeholder="Tenant first name"></div>
        <div><label class="form-label">Last Name</label><input data-invite="lastName" type="text" class="form-input" placeholder="Tenant last name"></div>
        <div><label class="form-label">Email</label><input data-invite="email" type="email" class="form-input" placeholder="tenant@email.com"></div>
        <div><label class="form-label">Phone</label><input data-invite="phone" type="tel" class="form-input" placeholder="+44 7700 900000"></div>
        <div><label class="form-label">Unit</label>${unitSelectHtml(STATE.propertyId, 'unit', true)}</div>
        <div><label class="form-label">Monthly Rent</label><input data-invite="rent" type="text" class="form-input" placeholder="${p.rent}" value="${p.rent}"></div>
        <div><label class="form-label">Lease Start</label><input data-invite="leaseStart" type="date" class="form-input"></div>
        <div><label class="form-label">Lease End</label><input data-invite="leaseEnd" type="date" class="form-input"></div>
        <div><label class="form-label">Personal Message</label><textarea data-invite="message" class="form-input" rows="3" placeholder="Add a personal message (optional)"></textarea></div>
        <button type="button" data-action="send-tenant-invite" class="btn-primary w-full py-3.5 text-[14px]">Send Invitation</button>
    </div>`;
}

function renderTenancyMemberList(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const ten = AppStore.tenancies.find(t => t.propertyId === listItem?.propertyId && t.status === 'active' && t.type === 'group');
    if (!ten?.members?.length) return '';
    return `
    <div class="card p-4 mt-3">
        <p class="text-[14px] font-bold mb-2">Group Occupants (${ten.members.length})</p>
        ${ten.members.map((m, i) => `
        <div class="flex justify-between py-2 border-b border-[#F1F5F9] last:border-0 text-[13px]">
            <span class="font-medium">${m.name}${i === 0 ? ' · Lead' : ''}</span>
            <span class="text-[#64748B]">${m.phone}</span>
        </div>`).join('')}
    </div>`;
}

function renderTenantMaintenanceSection(tenantId) {
    const listItem = TENANT_LIST[tenantId];
    const f = STATE.tenantMaintFilter || 'all';
    const tenantMaint = MAINTENANCE_ITEMS.filter(m => m.propertyId === listItem?.propertyId);
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
        events.push(['banknote', '#ECFDF5', '#059669', i.status === 'Paid' ? 'Rent payment received' : 'Invoice ' + i.status.toLowerCase(), `${i.amount} · ${i.due}`]);
    });
    MAINTENANCE_ITEMS.filter(m => m.propertyId === listItem?.propertyId).slice(0, 2).forEach(m => {
        events.push(['wrench', '#EFF6FF', '#2563EB', m.status === 'done' ? 'Maintenance resolved' : 'Maintenance update', `${m.issue} · ${m.time}`]);
    });
    const chatId = getTenantChatId(tenantId);
    const conv = CONVERSATIONS[chatId];
    if (conv?.messages?.length) {
        const last = conv.messages[conv.messages.length - 1];
        events.push(['message-square', '#EEF2FF', '#4F46E5', last.type === 'out' ? 'Message sent' : 'Message received', last.text.slice(0, 60)]);
    }
    if (t.moveIn) events.push(['user-plus', '#FFFBEB', '#D97706', 'Tenant moved in', typeof formatDisplayDate === 'function' ? formatDisplayDate(t.moveIn) : t.moveIn]);
    if (!events.length) return `<div class="card p-6 text-center"><p class="text-[13px] text-[#64748B]">No activity yet</p></div>`;
    return `
    <div class="tenant-timeline">
        ${events.map(([ic, bg, color, title, sub]) => `
        <div class="tenant-timeline-item">
            <div class="tenant-timeline-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-4 h-4"></i></div>
            <div class="tenant-timeline-body">
                <p class="tenant-timeline-title">${title}</p>
                <p class="tenant-timeline-sub">${sub}</p>
            </div>
        </div>`).join('')}
    </div>`;
}

function collectGroupMembers() {
    const rows = document.querySelectorAll('[data-member-row]');
    const members = [];
    rows.forEach(row => {
        const name = row.querySelector('[data-member-name]')?.value?.trim();
        const phone = row.querySelector('[data-member-phone]')?.value?.trim();
        if (name) members.push({ name, phone: phone || '—' });
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
        <div><label class="form-label">${requiredLabel('Unit')}</label>${unitSelectHtml(STATE.propertyId)}</div>
        <div id="group-fields" style="display:none">
            ${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}
            <p class="screen-section-title">Occupant List</p>
            <p class="form-helper mb-2">Lead tenant gets app access. Other occupants are stored for records only.</p>
            <div id="member-list" class="stack-sm mb-2">
                ${Array.from({ length: count }, (_, i) => `
                <div class="card p-3" data-member-row>
                    <p class="text-[11px] font-semibold text-[#64748B] mb-2">Occupant ${i + 1}${i === 0 ? ' (Lead)' : ''}</p>
                    <input data-member-name type="text" class="form-input mb-2" placeholder="Full name">
                    <input data-member-phone type="tel" class="form-input" placeholder="Phone">
                </div>`).join('')}
            </div>
            <button type="button" data-action="add-group-member" class="btn-secondary w-full py-2.5 text-[12px]">+ Add Occupant</button>
        </div>
        ${formFieldReq('Monthly Rent', 'rent', p.rent.replace('£', ''), 'text')}
        ${formFieldReq('Start Date', 'start', '', 'date')}
        ${formFieldReq('End Date', 'end', '', 'date')}
        <p class="form-helper">After creating the tenancy, invite the lead tenant to activate their account.</p>
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Create Tenancy</button>
        <button data-go="invite-tenant" data-pid="${STATE.propertyId}" class="btn-secondary w-full py-3 text-[13px]">Or Invite Tenant Directly</button>
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

/* ─── New Screens ─── */
function screenPortfolioOverview() {
    const vacant = PROPERTIES.filter(p => p.status === 'Vacant').length;
    const occupied = PROPERTIES.length - vacant;
    const totalRent = PROPERTIES.reduce((s, p) => s + parseInt(p.rent.replace(/[^\d]/g, ''), 10) || 0, 0);
    return `${topBar('Portfolio Overview', { back: true })}
    <div class="screen-content screen-enter">
        <div class="financial-summary card">
            <p class="financial-summary-label">Portfolio Value</p>
            <p class="financial-summary-amount">£${(totalRent * 12 * 15).toLocaleString()}</p>
            <p class="financial-summary-trend"><i data-lucide="trending-up" class="w-4 h-4"></i>+3.2% YoY estimated</p>
            <div class="financial-summary-grid">
                <div><p class="financial-mini-label">Properties</p><p class="financial-mini-value">${PROPERTIES.length}</p></div>
                <div><p class="financial-mini-label">Occupancy</p><p class="financial-mini-value text-[#16A34A]">${occupied}/${PROPERTIES.length}</p></div>
            </div>
        </div>
        <p class="screen-section-title">Properties</p>
        <div class="stack-sm">
            ${PROPERTIES.map(p => `
            <button data-go="property-detail" data-pid="${p.id}" class="card p-4 flex items-center gap-3 w-full text-left">
                <img src="${IMG.props[p.id]}" class="w-14 h-14 rounded-xl object-cover" alt="">
                <div class="flex-1 min-w-0">
                    <p class="text-[14px] font-bold">${p.name}</p>
                    <p class="text-[12px] text-[#64748B]">${p.rent}/mo · ${p.tenant || 'Vacant'}</p>
                </div>
                <span class="badge" style="background:${p.statusColor[0]};color:${p.statusColor[1]}">${p.status}</span>
            </button>`).join('')}
        </div>
        <button data-go="add-property" class="btn-secondary w-full py-3.5 text-[14px]">+ Add Property</button>
    </div>`;
}

function screenComplianceDashboard() {
    const items = AppStore.reminders.filter(r => REMINDER_TYPES.slice(0, 8).some(t => t[0] === r.type) || ['gas','electrical','epc','smoke','heat','co2'].includes(r.type));
    const overdue = items.filter(r => r.daysLeft <= 7);
    return `${topBar('Compliance Dashboard', { back: true })}
    <div class="screen-content screen-enter">
        <div class="dash-stat-grid">
            ${dashStatCard({ go: 'reminders', variant: 'issues', icon: 'alert-triangle', label: 'Due Soon', value: overdue.length, pill: overdue.length ? 'Action' : null })}
            ${dashStatCard({ go: 'properties', variant: 'compliant', icon: 'shield-check', label: 'Compliant', value: `${PROPERTIES.filter(p=>p.compliance).length}/${PROPERTIES.length}`, pill: null })}
        </div>
        <p class="screen-section-title">Certificate Status</p>
        <div class="stack-sm">
            ${COMPLIANCE_ITEMS.map(([ic, n, exp], cid) => {
                const pid = PROPERTIES[cid % PROPERTIES.length]?.id ?? 0;
                return `
            <div class="card p-3.5 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center"><i data-lucide="${ic}" class="w-[18px] h-[18px] text-[#64748B]"></i></div>
                <div class="flex-1"><p class="text-[13px] font-semibold">${n}</p><p class="text-[11px] text-[#64748B]">${exp} · ${PROPERTIES[pid]?.name || ''}</p></div>
                <button data-go="renew-compliance" data-pid="${pid}" data-cid="${cid}" class="text-[11px] font-semibold text-[#2563EB]">Renew</button>
            </div>`;
            }).join('')}
        </div>
        <button data-go="reminders" class="btn-primary w-full py-3.5 text-[14px] mt-2">View All Reminders</button>
    </div>`;
}

function screenReminders() {
    const list = AppStore.reminders.sort((a, b) => a.daysLeft - b.daysLeft);
    return `${topBar('Smart Reminders', { back: true })}
    <div class="screen-content screen-enter">
        ${list.length ? list.map(r => {
            const p = PROPERTIES[r.propertyId];
            const rt = REMINDER_TYPES.find(t => t[0] === r.type) || REMINDER_TYPES[11];
            return `
            <button data-go="property-detail" data-pid="${r.propertyId}" data-tab="compliance" class="dash-reminder-row card w-full text-left p-4 mb-2 urgency-${r.urgency}">
                <div class="flex items-center gap-3">
                    <div class="dash-reminder-icon" style="background:${rt[3]};color:${rt[4]}"><i data-lucide="${rt[2]}" class="w-[18px] h-[18px]"></i></div>
                    <div class="flex-1"><p class="text-[13px] font-semibold">${r.title}</p><p class="text-[11px] text-[#64748B]">${p?.name} · Due ${r.due}</p></div>
                    <span class="badge" style="background:${rt[3]};color:${rt[4]}">${r.daysLeft}d</span>
                </div>
            </button>`;
        }).join('') : emptyState('bell', 'No reminders', 'Add a custom reminder to track important dates.', 'Add Reminder', null, 'add-reminder')}
        <button data-go="add-reminder" class="btn-primary w-full py-3.5 text-[14px]">+ Custom Reminder</button>
        <p class="text-[11px] text-[#94A3B8] text-center mt-2">Auto reminders sync from alarms, certificates, leases & inspections</p>
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
        ${formFieldReq('Unit', 'unit', '', 'text', 'Flat 2A')}
        <div id="group-fields" style="display:none">${formFieldReq('Number of Occupants', 'occupants', '2', 'number')}</div>
        ${formFieldReq('Monthly Rent', 'rent', p.rent.replace('£',''), 'text')}
        ${formFieldReq('Start Date', 'start', '', 'date')}
        ${formFieldReq('End Date', 'end', '', 'date')}
        <p class="form-helper">After creating the tenancy, invite the tenant to activate their account.</p>
        <button data-action="save-tenancy" class="btn-primary w-full py-3.5 text-[14px]">Create Tenancy</button>
        <button data-go="invite-tenant" data-pid="${STATE.propertyId}" class="btn-secondary w-full py-3 text-[13px]">Or Invite Tenant Directly</button>
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
        ${formTextarea('Final Notes', '', 'Condition of property, deposit deductions, forwarding address...')}
        <div><label class="form-label">Deposit Return</label>
        <select data-field="deposit" class="form-input form-select"><option>Full return</option><option>Partial deduction</option><option>Dispute</option></select></div>
        <button data-action="save-checkout" class="btn-primary w-full py-3.5 text-[14px]">Complete Check-out</button>
    </div>`;
}

function screenAssignContractor() {
    const item = maintItem(STATE.assignMaintId ?? STATE.maintId);
    return `${topBar('Assign Contractor', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${item.issue}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${item.prop} · ${item.priority} priority</p>
            ${item.contractor !== '—' ? `<p class="text-[12px] text-[#D97706] mt-2">Currently: ${item.contractor}</p>` : '<p class="text-[12px] text-[#64748B] mt-2">No contractor assigned</p>'}
        </div>
        <p class="screen-section-title">Select Contractor</p>
        ${CONTRACTORS.map(c => `
        <button data-action="assign-contractor" data-cid="${c.id}" class="card p-4 flex items-center gap-3 w-full text-left mb-2">
            <img src="${c.img}" class="w-12 h-12 rounded-xl object-cover" alt="">
            <div class="flex-1"><p class="text-[14px] font-semibold">${c.name}</p><p class="text-[12px] text-[#64748B]">${c.trade}</p></div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
        </button>`).join('')}
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
        ${formTextarea('Notes', '', 'Condition observations, issues found...')}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[12px] text-[#64748B] mt-2">Upload inspection photos</p>
        </button>
        <button data-action="save-inspection" class="btn-primary w-full py-3.5 text-[14px]">Save Inspection Report</button>
    </div>`;
}

function screenCreateInvoice() {
    return `${topBar('Create Invoice', { back: true })}
    <div class="screen-content screen-enter">
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" class="form-input form-select">${PROPERTIES.filter(p=>p.tenant).map(p => `<option value="${p.id}">${p.name} — ${p.tenant}</option>`).join('')}</select></div>
        ${formFieldReq('Amount (£)', 'amount', '', 'number', '2450')}
        ${formFieldReq('Due Date', 'due', '', 'date')}
        <div><label class="form-label">${requiredLabel('Description')}</label>
        <select data-field="desc" class="form-input form-select"><option>Monthly Rent</option><option>Service Charge</option><option>Deposit Top-up</option><option>Other</option></select></div>
        <button data-action="save-invoice" class="btn-primary w-full py-3.5 text-[14px]">Create Invoice</button>
    </div>`;
}

function screenMarkRentReceived() {
    const pending = INVOICES.filter(i => i.status !== 'Paid');
    return `${topBar('Mark Rent Received', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Select an invoice to mark as paid</p>
        ${pending.length ? pending.map(inv => `
        <button data-action="mark-invoice-paid" data-iid="${inv.id}" class="invoice-row card w-full text-left mb-2">
            <div class="invoice-row-body p-4">
                <p class="text-[14px] font-semibold">${inv.num}</p>
                <p class="text-[12px] text-[#64748B]">${inv.prop}</p>
                <p class="text-[16px] font-bold mt-2">${inv.amount}</p>
            </div>
        </button>`).join('') : emptyState('check-circle', 'All caught up', 'No pending or overdue invoices.', 'View Financial', null, 'financial')}
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
                <p class="text-[16px] font-bold">${c.amount}</p>
            </div>
            <button data-action="pay-contractor" data-cid="${c.id}" class="btn-primary w-full py-2.5 text-[13px] mt-3">Pay Invoice</button>
        </div>`).join('') : emptyState('banknote', 'No unpaid invoices', 'All contractor invoices have been paid.', 'View Maintenance', null, 'maintenance')}
    </div>`;
}

function screenShareDocument() {
    const doc = AppStore.documents.find(d => d.id === STATE.shareDocId);
    if (!doc) return `${topBar('Share Document', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Document not found</p></div>`;
    const p = PROPERTIES[doc.propertyId];
    return `${topBar('Share with Tenant', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-bold">${doc.name}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${doc.type} · ${p.name}</p>
        </div>
        <p class="text-[13px] text-[#64748B]">Share this document with <strong>${p.tenant || 'tenant'}</strong>. They will receive a notification and can view it in their portal.</p>
        <button data-action="confirm-share-doc" class="btn-primary w-full py-3.5 text-[14px]">Share Document</button>
    </div>`;
}

function screenPropertyPhotos() {
    const meta = AppStore.meta(STATE.propertyId);
    const photos = meta.photos?.length ? meta.photos : [IMG.props[STATE.propertyId]];
    return `${topBar('Property Photos', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">First photo is used as the property cover image.</p>
        <div class="photo-gallery-grid">
            ${photos.map((src, i) => `
            <div class="photo-gallery-item">
                <div class="aspect-square rounded-xl overflow-hidden relative">
                    <img src="${src}" class="img-cover" alt="">
                    ${i === 0 ? '<span class="photo-cover-badge">Cover</span>' : ''}
                </div>
                <div class="photo-gallery-actions">
                    ${i !== 0 ? `<button type="button" data-action="set-cover-photo" data-idx="${i}" class="photo-gallery-btn">Set Cover</button>` : '<span class="photo-gallery-btn active">Cover</span>'}
                    ${photos.length > 1 ? `<button type="button" data-action="delete-photo" data-idx="${i}" class="photo-gallery-btn danger">Remove</button>` : ''}
                </div>
            </div>`).join('')}
        </div>
        <button data-action="upload-photo" class="btn-secondary w-full py-3 text-[13px] mt-2">+ Add Photo</button>
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
            councilTax: fieldVal('info_council'),
            notes: fieldVal('info_notes'),
        };
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
    if (!validateFields([['name','Property Name',v=>v],['address','Address',v=>v],['rent','Monthly Rent',v=>v&&+v>0]])) return;
    const id = AppStore.nextId(PROPERTIES);
    const floors = +fieldVal('floors') || 2;
    const flatsPerFloor = +fieldVal('flatsPerFloor') || 2;
    PROPERTIES.push({
        id, name: fieldVal('name'), address: fieldVal('address'),
        status: document.querySelector('[data-field="status"]')?.value || 'Vacant',
        statusColor: ['#FEF3C7','#D97706'],
        tenant: null, rent: `£${parseInt(fieldVal('rent')).toLocaleString()}`,
        beds: +fieldVal('beds') || 2, baths: +fieldVal('baths') || 1, sqft: fieldVal('sqft') || '900', compliance: false,
    });
    const meta = AppStore.meta(id);
    meta.building = { floors, flatsPerFloor };
    meta.units = generatePropertyUnits(floors, flatsPerFloor);
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Property added'); go('properties'); });
}

function saveEditProperty() {
    const p = PROPERTIES[STATE.propertyId];
    if (!p) return;
    p.name = fieldVal('name') || p.name;
    p.address = fieldVal('address') || p.address;
    p.rent = fieldVal('rent') ? `£${parseInt(fieldVal('rent')).toLocaleString()}` : p.rent;
    p.beds = +fieldVal('beds') || p.beds;
    p.baths = +fieldVal('baths') || p.baths;
    p.sqft = fieldVal('sqft') || p.sqft;
    const status = fieldVal('status') || p.status;
    p.status = status;
    p.statusColor = status === 'Occupied' ? ['#DCFCE7', '#16A34A'] : ['#FEF3C7', '#D97706'];
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.info) meta.info = {};
    meta.info.notes = fieldVal('notes') || meta.info.notes;
    const floors = +fieldVal('floors') || meta.building?.floors || 2;
    const flatsPerFloor = +fieldVal('flatsPerFloor') || meta.building?.flatsPerFloor || 2;
    meta.building = { floors, flatsPerFloor };
    meta.units = generatePropertyUnits(floors, flatsPerFloor);
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
    const p = PROPERTIES[pid];
    const id = AppStore.nextId(MAINTENANCE_ITEMS);
    const entry = {
        id, issue: fieldVal('title'), prop: p.name, time: 'Just now',
        priority: STATE.logPriority, contractor: '—', status: 'open', propertyId: pid,
        desc: fieldVal('desc'),
        photos: STATE.logMaintPhotos || [],
        history: [{ event: 'Issue reported', detail: fieldVal('desc'), time: 'Just now' }],
    };
    if (isTenant) {
        entry.reportedBy = 'tenant';
        entry.tenantName = `${tenant.firstName} ${tenant.lastName}`;
        if (typeof ensureLandlordConversation === 'function') ensureLandlordConversation({ propertyId: pid });
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
    if (!validateFields([['unit','Unit',v=>v],['rent','Rent',v=>v],['start','Start Date',v=>v],['end','End Date',v=>v]])) return;
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
        status: 'active',
        occupants: type === 'group' ? (members.length || +fieldVal('occupants') || 2) : 1,
        members: type === 'group' ? members : [],
        leadName,
    };
    AppStore.tenancies.push(tenancy);
    const p = PROPERTIES[STATE.propertyId];
    p.status = 'Occupied';
    p.statusColor = ['#DCFCE7','#16A34A'];
    if (leadName) p.tenant = leadName;
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Tenancy created'); go('invite-tenant', { propertyId: STATE.propertyId }); });
}

function saveCheckout() {
    if (!validateFields([['checkoutDate','Check-out Date',v=>v]])) return;
    const t = TENANTS[STATE.tenantId];
    const listItem = TENANT_LIST.find(x => x.id === STATE.tenantId);
    if (listItem) { listItem.status = 'inactive'; listItem.lease = `Ended ${fieldVal('checkoutDate')}`; }
    const ten = AppStore.tenancies.find(x => x.tenantId === STATE.tenantId || x.propertyId === listItem?.propertyId);
    if (ten) ten.status = 'ended';
    const p = PROPERTIES[listItem?.propertyId ?? t?.propertyId];
    if (p) { p.tenant = null; p.status = 'Vacant'; p.statusColor = ['#FEF3C7','#D97706']; }
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Check-out completed'); go('tenants'); });
}

function saveInspection() {
    if (!validateFields([['inspDate','Date',v=>v],['rating','Rating',v=>v]])) return;
    AppStore.inspections.filter(i => i.propertyId === STATE.propertyId && i.scheduled).forEach(i => { i.scheduled = false; });
    AppStore.inspections.unshift({
        id: AppStore.nextId(AppStore.inspections),
        propertyId: STATE.propertyId,
        type: fieldVal('inspType'),
        date: fieldVal('inspDate'),
        rating: fieldVal('rating'),
        photos: 4,
        report: 'Inspection report.pdf',
        scheduled: false,
    });
    withLoading(() => { syncSmartReminders(); AppStore.save(); toast('Inspection saved'); go('property-detail', { propertyId: STATE.propertyId, tab: 'inspection' }); });
}

function saveEditTenant() {
    const t = TENANTS[STATE.tenantId];
    const list = TENANT_LIST[STATE.tenantId];
    if (!t) return;
    if (!validateFields([['firstName', 'First Name', v => v], ['lastName', 'Last Name', v => v], ['email', 'Email', v => v]])) return;
    t.firstName = fieldVal('firstName');
    t.lastName = fieldVal('lastName');
    t.email = fieldVal('email');
    t.phone = fieldVal('phone') || t.phone;
    t.prop = fieldVal('prop') || t.prop;
    t.rent = fieldVal('rent') || t.rent;
    t.moveIn = fieldVal('moveIn') || t.moveIn;
    t.leaseEnd = fieldVal('leaseEnd') || t.leaseEnd;
    t.emergency = fieldVal('emergency') || t.emergency;
    t.emergencyPhone = fieldVal('emergencyPhone') || t.emergencyPhone;
    if (list) {
        list.name = `${t.firstName} ${t.lastName}`;
        list.prop = t.prop;
        list.rent = formatTenantRent(t.rent);
        list.leaseEnd = formatLeaseMonthYear(t.leaseEnd);
        const start = formatLeaseMonthYear(t.moveIn);
        list.lease = start !== '—' && list.leaseEnd !== '—' ? `${start} – ${list.leaseEnd}` : list.lease;
    }
    withLoading(() => { AppStore.save(); toast('Tenant details updated'); back(); });
}

function saveRenewCompliance() {
    if (!validateFields([['certNumber', 'Certificate Number', v => v], ['expiryDate', 'Expiry Date', v => v]])) return;
    const cid = STATE.complianceId ?? 0;
    const pid = STATE.propertyId ?? 0;
    const key = `${pid}-${cid}`;
    const expiry = formatDisplayDate(fieldVal('expiryDate'));
    AppStore.complianceCerts[key] = {
        certNumber: fieldVal('certNumber'),
        issueDate: fieldVal('issueDate'),
        expiryDate: fieldVal('expiryDate'),
        issuedBy: fieldVal('issuedBy'),
        notes: fieldVal('certNotes'),
    };
    if (COMPLIANCE_ITEMS[cid]) COMPLIANCE_ITEMS[cid][2] = expiry || COMPLIANCE_ITEMS[cid][2];
    const p = PROPERTIES[pid];
    if (p && cid <= 2) p.compliance = true;
    AppStore.reminders = AppStore.reminders.filter(r => !(r.propertyId === pid && r.type === 'gas' && cid === 0));
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
    item.contractor = c.name;
    if (item.status === 'open') {
        item.status = 'progress';
        addMaintHistoryEvent(item, 'Contractor assigned', c.name);
        addMaintHistoryEvent(item, 'Work in progress', 'Awaiting contractor visit');
    }
    createContractorJobFromMaintenance(item, c);
    AppStore.save();
    toast(`${c.name} assigned — job sent to contractor`);
    go('maintenance-detail', { maintId: item.id });
}

function createContractorJobFromMaintenance(item, contractor) {
    if (typeof CONTRACTOR_JOBS === 'undefined') return;
    const p = PROPERTIES[item.propertyId];
    const activeTenant = TENANT_LIST.find(t => t.propertyId === item.propertyId && t.status === 'active');
    const tenantName = p?.tenant && p.tenant !== '—' ? p.tenant : (activeTenant?.name || '—');
    const existing = CONTRACTOR_JOBS.find(j => j.maintId === item.id);
    const jobData = {
        maintId: item.id,
        propertyId: item.propertyId,
        property: p?.name || item.prop,
        address: p?.address || '',
        tenant: tenantName,
        landlord: `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}`,
        issue: item.issue,
        priority: item.priority,
        visitDate: 'Not scheduled',
        status: 'assigned',
        assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        desc: item.desc || item.issue,
        contractorName: contractor.name,
        tenantChatId: activeTenant?.chatId ?? ({ 'Sarah Johnson': 0, 'David Wilson': 2, 'Michael Lee': 4 }[tenantName] ?? null),
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
    if (doc) { doc.shared = true; AppStore.save(); toast('Document shared with tenant'); back(); }
}

function uploadPhotoAction() {
    const meta = AppStore.meta(STATE.propertyId);
    if (STATE.screen === 'log-maintenance') {
        if (!STATE.logMaintPhotos) STATE.logMaintPhotos = [];
        STATE.logMaintPhotos.push(IMG.maint[STATE.logMaintPhotos.length % IMG.maint.length]);
        toast('Photo added to issue');
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
        toast('Document uploaded');
        render();
        return;
    }
    if (STATE.screen === 'property-floor-plans') {
        meta.floorPlans.push({
            name: `Floor ${meta.floorPlans.length + 1}`,
            url: IMG.interior[meta.floorPlans.length % IMG.interior.length],
        });
        AppStore.save();
        toast('Floor plan uploaded');
        render();
        return;
    }
    if (!meta.photos) meta.photos = [IMG.props[STATE.propertyId]];
    meta.photos.push(IMG.interior[meta.photos.length % IMG.interior.length]);
    AppStore.save();
    toast('Photo uploaded');
    render();
}

function setCoverPhoto(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.photos?.[idx]) return;
    const [photo] = meta.photos.splice(idx, 1);
    meta.photos.unshift(photo);
    AppStore.save();
    toast('Cover photo updated');
    render();
}

function deletePropertyPhoto(idx) {
    const meta = AppStore.meta(STATE.propertyId);
    if (!meta.photos || meta.photos.length <= 1) {
        toast('Keep at least one photo');
        return;
    }
    showConfirm('Remove Photo', 'Remove this photo from the property gallery?', () => {
        meta.photos.splice(idx, 1);
        AppStore.save();
        toast('Photo removed');
        render();
    }, { okLabel: 'Remove', danger: true });
}

/* ─── Register screens & nav ─── */
const FEATURE_SCREENS = [
    'portfolio-overview', 'compliance-dashboard', 'reminders', 'add-reminder',
    'create-tenancy', 'checkout-tenancy', 'assign-contractor', 'conduct-inspection',
    'create-invoice', 'mark-rent-received', 'pay-contractor', 'share-document',
    'property-floor-plans', 'property-photos', 'property-alarms', 'property-appliances', 'property-utilities', 'property-parking', 'property-info',
    'tenant-add-note', 'tenant-edit-note', 'maintenance-history', 'select-property-invite',
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
    'tenant-add-note': screenTenantAddNote,
    'tenant-edit-note': screenTenantEditNote,
    'maintenance-history': screenMaintenanceHistory,
    'maintenance-detail': screenMaintenanceDetailEnhanced,
    'financial': screenFinancialEnhanced,
    'invite-tenant': screenInviteTenantEnhanced,
    'dashboard': screenDashboardEnhanced,
    'tenants': screenTenantsEnhanced,
    'select-property-invite': screenSelectPropertyInvite,
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
    'tenant-add-note': 'tenant-detail',
    'tenant-edit-note': 'tenant-detail',
    'maintenance-history': 'maintenance',
    'select-property-invite': 'tenants',
    'tenant-invite-sent': 'property-detail',
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
    app.querySelectorAll('[data-action="pay-contractor"]').forEach(el => {
        el.onclick = () => payContractorInvoice(+el.dataset.cid);
    });
    app.querySelectorAll('[data-action="confirm-share-doc"]').forEach(el => { el.onclick = shareDocumentConfirm; });
    app.querySelectorAll('[data-action="upload-photo"]').forEach(el => { el.onclick = uploadPhotoAction; });
    app.querySelectorAll('[data-action="delete-property"]').forEach(el => { el.onclick = deleteProperty; });
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
    if (FEATURE_BACK_MAP[STATE.screen]) {
        const target = FEATURE_BACK_MAP[STATE.screen];
        const opts = {};
        if (['property-detail','create-tenancy','conduct-inspection','share-document','property-photos','property-floor-plans','property-alarms','property-appliances','property-utilities','property-parking','property-info'].includes(STATE.screen)) {
            opts.propertyId = STATE.propertyId;
            if (STATE.screen === 'conduct-inspection') opts.tab = 'inspection';
            if (STATE.screen === 'share-document') opts.tab = 'documents';
            if (['property-photos','property-floor-plans','property-alarms','property-appliances','property-utilities','property-parking','property-info'].includes(STATE.screen)) opts.tab = 'details';
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
    if (screen === 'chat') markConversationRead(opts.chatId ?? STATE.chatId ?? 0);
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
    if (!meta.building) meta.building = { floors: 2, flatsPerFloor: 2 };
    if (!meta.units?.length) meta.units = generatePropertyUnits(meta.building.floors, meta.building.flatsPerFloor);
});
syncSmartReminders(false);
syncTransactionsFromInvoices();
loadContractorJobs();
getLandlordChatId();
if (typeof CONTRACTOR_JOBS !== 'undefined' && typeof ensureContractorJob === 'function') {
    CONTRACTOR_JOBS.forEach(ensureContractorJob);
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
