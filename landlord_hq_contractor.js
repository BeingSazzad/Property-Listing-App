/* Contractor role — MVP flow */
const CONTRACTOR_BOTTOM_NAV = [
    ['layout-dashboard', 'Home', 'contractor-dashboard'],
    ['briefcase', 'Jobs', 'contractor-jobs'],
    ['message-square', 'Messages', 'messages'],
    ['user', 'Profile', 'contractor-profile'],
];

const CONTRACTOR_DRAWER_NAV = [
    ['layout-dashboard', 'Dashboard', 'contractor-dashboard'],
    ['briefcase', 'Jobs', 'contractor-jobs'],
    ['building-2', 'Landlords', 'contractor-landlords'],
    ['message-square', 'Messages', 'messages'],
    ['bell', 'Notifications', 'contractor-notifications'],
    ['user', 'Profile', 'contractor-profile'],
    ['life-buoy', 'Help & Support', 'help-support'],
];

const CONTRACTOR_JOBS = [
    { id: 0, maintId: 0, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Kitchen sink leaking', priority: 'High', visitDate: 'Today, 2:00 PM', status: 'assigned', assignedDate: 'Mar 10, 2025', desc: 'Water dripping from pipe under kitchen sink. Tenant reports it started this morning. Access via front door — tenant will be home after 1 PM.', tenantChatId: 0, landlordChatId: 1, reportedBy: 'tenant', reportPhotos: [IMG.maint[0], IMG.maint[2]], reportVideos: [{ name: 'under-sink-leak.mp4', poster: IMG.maint[0], demo: true }] },
    { id: 1, maintId: 3, propertyId: 1, property: '45 Queens Road', address: 'London, SW2 3TR', tenant: 'David Wilson', landlord: 'John Smith', issue: 'Boiler not working', priority: 'High', visitDate: 'Tomorrow, 10:00 AM', status: 'accepted', assignedDate: 'Mar 8, 2025', desc: 'No hot water or heating. Boiler showing error code E119. Parking available on street.', tenantChatId: 2, landlordChatId: 1 },
    { id: 2, maintId: 1, propertyId: 2, property: '88 King Street', address: 'London, EC2V 8BB', tenant: '—', landlord: 'John Smith', issue: 'Window latch broken', priority: 'Medium', visitDate: 'Mar 14, 11:30 AM', status: 'scheduled', assignedDate: 'Mar 7, 2025', desc: 'Bedroom window latch broken — window cannot be secured. Main Flat currently vacant.', tenantChatId: null, landlordChatId: 1 },
    { id: 3, maintId: 4, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Radiator not heating', priority: 'Medium', visitDate: 'Mar 12, 3:00 PM', status: 'in_progress', assignedDate: 'Mar 5, 2025', desc: 'Living room radiator cold while others work. Possible air lock or valve issue.', tenantChatId: 4, landlordChatId: 1, notes: [{ text: 'Bleed radiator — still cold on return pipe', time: 'Mar 11, 2:30 PM' }], photos: { before: [IMG.maint[2]], during: [], after: [] } },
    { id: 4, maintId: 6, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Tap replacement', priority: 'Low', visitDate: 'Mar 1, 2025', status: 'waiting_approval', assignedDate: 'Feb 20, 2025', desc: 'Kitchen tap replaced. Invoice submitted awaiting landlord approval.', tenantChatId: 0, landlordChatId: 1, invoice: { amount: '£185', file: 'INV-PLB-1042.pdf', uploadedAt: 'Mar 1, 2025' } },
    { id: 5, maintId: 5, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Light flickering', priority: 'Low', visitDate: 'Feb 18, 2025', status: 'completed', assignedDate: 'Feb 10, 2025', desc: 'Living room ceiling light flickering — resolved with new fitting.', tenantChatId: 4, landlordChatId: 1 },
    { id: 6, maintId: null, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Annual gas check', priority: 'Low', visitDate: 'Jan 30, 2025', status: 'paid', assignedDate: 'Jan 15, 2025', desc: 'Annual gas safety inspection completed. Certificate uploaded.', tenantChatId: 4, landlordChatId: 1, certificates: [{ name: 'Gas Safety Certificate', uploadedAt: 'Jan 30, 2025' }] },
    { id: 7, maintId: 7, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', unit: 'Communal', scope: 'communal', communalArea: 'Hallway', tenant: '—', landlord: 'John Smith', issue: 'Hallway light out', priority: 'Medium', visitDate: 'Today, 4:30 PM', status: 'assigned', assignedDate: 'Mar 10, 2025', desc: 'Main entrance hallway ceiling light not working. Landlord reports it affects all residents. Access via front entrance — no tenant visit required.', tenantChatId: null, landlordChatId: 1 },
];

const CONTRACTOR_NOTIFS = [
    { icon: 'briefcase', color: ['#FFEDD5', '#EA580C'], title: 'New job assigned', desc: 'Kitchen sink leaking — 12 Park Lane', time: '2h ago', unread: true },
    { icon: 'calendar', color: ['#EFF6FF', '#2563EB'], title: 'Visit reminder', desc: '45 Queens Road · Tomorrow 10:00 AM', time: '5h ago', unread: true },
    { icon: 'message-square', color: ['#EEF2FF', '#4F46E5'], title: 'New message', desc: 'Sarah Johnson sent a message', time: '1d ago', unread: false },
    { icon: 'file-check', color: ['#ECFDF5', '#059669'], title: 'Invoice approved', desc: 'INV-2025-1042 · £185', time: '2d ago', unread: false },
    { icon: 'banknote', color: ['#ECFDF5', '#059669'], title: 'Payment received', desc: '£185 deposited to your account', time: '3d ago', unread: false },
];

const CONTRACTOR_STATUS = {
    assigned: { label: 'Assigned', bg: '#FFEDD5', color: '#C2410C' },
    accepted: { label: 'Accepted', bg: '#DBEAFE', color: '#1D4ED8' },
    scheduled: { label: 'Visit Scheduled', bg: '#E0E7FF', color: '#4338CA' },
    in_progress: { label: 'In Progress', bg: '#FEF3C7', color: '#D97706' },
    waiting_approval: { label: 'Awaiting Review', bg: '#F3E8FF', color: '#7C3AED' },
    approved: { label: 'Awaiting Payment', bg: '#DCFCE7', color: '#16A34A' },
    completed: { label: 'Completed', bg: '#D1FAE5', color: '#047857' },
    paid: { label: 'Paid', bg: '#ECFDF5', color: '#059669' },
};

const contractorStatusStyle = (status) => CONTRACTOR_STATUS[status] || { label: status, bg: '#F1F5F9', color: '#64748B' };

const contractorPriorityStyle = (priority) => ({
    High: ['#FEE2E2', '#DC2626'],
    Medium: ['#FEF3C7', '#D97706'],
    Low: ['#DBEAFE', '#2563EB'],
}[priority] || ['#F1F5F9', '#64748B']);

const contractorJob = (id) => ensureContractorJob(CONTRACTOR_JOBS.find(j => j.id === id) || CONTRACTOR_JOBS[0]);

function contractorJobLocation(job) {
    if (job.scope === 'communal' || job.communalArea) {
        return `${job.property} · Communal · ${job.communalArea || 'Shared area'}`;
    }
    if (job.maintId != null && typeof MAINTENANCE_ITEMS !== 'undefined' && typeof formatMaintLocation === 'function') {
        const item = MAINTENANCE_ITEMS.find(m => m.id === job.maintId);
        if (item) return formatMaintLocation(item);
    }
    return `${job.property}${job.unit ? ` · ${job.unit}` : ''}`;
}

function contractorJobIsCommunal(job) {
    return job.scope === 'communal' || job.unit === 'Communal' || !!job.communalArea;
}

function ensureContractorJob(job) {
    if (!job.photos) job.photos = { before: [], during: [], after: [] };
    if (!job.certificates) job.certificates = [];
    if (!job.notes) job.notes = [];
    if (!job.reportPhotos) job.reportPhotos = [];
    if (!job.reportVideos) job.reportVideos = [];
    if (job.maintId != null && typeof MAINTENANCE_ITEMS !== 'undefined' && typeof syncMaintMediaToContractorJob === 'function') {
        const item = MAINTENANCE_ITEMS.find(m => m.id === job.maintId);
        if (item && !job.reportPhotos.length && !job.reportVideos.length) syncMaintMediaToContractorJob(job, item);
    }
    if (job.invoice == null) job.invoice = null;
    if (job.scheduledDate == null) job.scheduledDate = '';
    if (job.scheduledTime == null) job.scheduledTime = '';
    if (job.scheduleNotes == null) job.scheduleNotes = '';
    if (!job.contractorName) job.contractorName = 'Plumber Pro';
    if (job.tenantChatId == null && job.tenant && job.tenant !== '—') {
        job.tenantChatId = { 'Sarah Johnson': 0, 'David Wilson': 2, 'Michael Lee': 4 }[job.tenant] ?? null;
    }
    if (job.landlordChatId == null && typeof getLandlordChatId === 'function') {
        job.landlordChatId = getLandlordChatId();
    } else if (job.landlordChatId === 1 && typeof getLandlordChatId === 'function') {
        job.landlordChatId = getLandlordChatId();
    }
    return job;
}

function saveContractorJobs() {
    if (typeof AppStore !== 'undefined') {
        AppStore.contractorJobs = JSON.parse(JSON.stringify(CONTRACTOR_JOBS));
        AppStore.save();
    }
}

function loadContractorJobs() {
    if (typeof AppStore === 'undefined' || !AppStore.contractorJobs?.length) return;
    CONTRACTOR_JOBS.splice(0, CONTRACTOR_JOBS.length, ...AppStore.contractorJobs);
    CONTRACTOR_JOBS.forEach(job => {
        ensureContractorJob(job);
        if (typeof syncContractorJobToMaintenance === 'function') syncContractorJobToMaintenance(job);
    });
}

function syncContractorJobToMaintenance(job) {
    if (job.maintId == null) return;
    const item = MAINTENANCE_ITEMS.find(m => m.id === job.maintId);
    if (!item) return;
    const contractorName = job.contractorName || item.contractor || 'Plumber Pro';
    const pushOnce = (event, detail) => {
        if (typeof addMaintHistoryEvent !== 'function') return;
        if (!item.history) item.history = [];
        if (item.history.some(h => h.event === event && h.detail === detail)) return;
        addMaintHistoryEvent(item, event, detail);
    };
    if (job.status === 'accepted' || job.status === 'scheduled') {
        item.status = 'progress';
        item.contractor = contractorName;
    }
    if (job.status === 'in_progress') {
        item.status = 'progress';
        item.contractor = contractorName;
    }
    if (job.status === 'accepted') pushOnce('Contractor accepted', contractorName);
    if (job.status === 'scheduled' && job.visitDate && job.visitDate !== 'Not scheduled') {
        pushOnce('Visit scheduled', job.visitDate);
    }
    if (job.status === 'in_progress') pushOnce('Work started', job.visitDate || 'On site');
    if (job.status === 'waiting_approval') {
        item.status = 'progress';
        pushOnce('Invoice submitted', job.invoice?.amount ? `${job.invoice.amount} · awaiting review` : 'Awaiting landlord review');
    }
    if (job.status === 'approved') {
        item.status = 'progress';
        item.paymentPending = true;
        pushOnce('Work approved', job.invoice?.amount ? `Awaiting payment · ${job.invoice.amount}` : 'Awaiting payment');
    }
    if (job.status === 'paid') {
        item.status = 'done';
        item.paymentPending = false;
        pushOnce('Paid via Stripe', job.invoice?.amount ? job.invoice.amount : 'Payment complete');
    }
    if (job.status === 'completed') {
        item.status = 'progress';
    }
}

function submitContractorInvoice(job) {
    if (!job.invoice || typeof AppStore === 'undefined') return;
    const exists = AppStore.contractorInvoices?.find(i => i.maintId === job.maintId && i.job === job.issue);
    if (exists) return;
    AppStore.contractorInvoices.push({
        id: AppStore.nextId(AppStore.contractorInvoices),
        contractor: job.contractorName || 'Plumber Pro',
        job: job.issue,
        amount: job.invoice.amount,
        status: 'Unpaid',
        propertyId: job.propertyId,
        maintId: job.maintId,
    });
}

const contractorPhotoSection = (kind, photos, label) => `
<div class="ctr-photo-section">
    <p class="ctr-section-label">${label}</p>
    ${photos.length ? `<div class="ctr-photo-grid">${photos.map((src, i) => `<img src="${src}" class="ctr-photo-thumb" alt="Photo ${i + 1}">`).join('')}</div>` : `<p class="ctr-photo-empty">No photos yet</p>`}
    <button type="button" data-contractor-upload="${kind}" class="ctr-upload-btn"><i data-lucide="image-plus" class="w-4 h-4"></i> Add photo</button>
</div>`;

const contractorNotesList = (notes) => notes.length ? `
<div class="ctr-notes-list">
    ${notes.map(n => `
    <div class="ctr-note-item">
        <p class="ctr-note-text">${n.text}</p>
        <p class="ctr-note-time">${n.time}</p>
    </div>`).join('')}
</div>` : `<p class="ctr-photo-empty">No notes yet — add what you did on site</p>`;

const contractorJobCard = (job) => {
    const st = contractorStatusStyle(job.status);
    const [pBg, pColor] = contractorPriorityStyle(job.priority);
    const location = contractorJobLocation(job);
    const communal = contractorJobIsCommunal(job);
    const thumb = job.reportPhotos?.[0] || job.photos?.before?.[0] || null;
    const mediaCount = (job.reportPhotos?.length || 0) + (job.reportVideos?.length || 0);
    return `
    <button data-go="contractor-job-detail" data-job="${job.id}" class="ctr-job-card card w-full text-left ctr-job-card--${job.status}">
        <div class="ctr-job-card-layout">
            <div class="ctr-job-card-main">
                <div class="ctr-job-card-top">
                    <span class="ctr-job-status-badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
                    <span class="ctr-job-priority-badge" style="background:${pBg};color:${pColor}">${job.priority}</span>
                    ${communal ? '<span class="ctr-job-priority-badge" style="background:#E0E7FF;color:#4338CA">Communal</span>' : ''}
                    ${mediaCount ? `<span class="ctr-job-media-badge"><i data-lucide="paperclip" class="w-3 h-3"></i>${mediaCount}</span>` : ''}
                </div>
                <p class="ctr-job-title">${job.issue}</p>
                <p class="ctr-job-prop">${location}</p>
                <p class="ctr-job-addr">${job.address}</p>
                <p class="ctr-job-source">Via ${job.landlord} · ${job.property}</p>
                <div class="ctr-job-meta">
                    <span><i data-lucide="user" class="w-3.5 h-3.5"></i>${job.tenant}</span>
                    <span><i data-lucide="calendar" class="w-3.5 h-3.5"></i>${job.visitDate}</span>
                </div>
            </div>
            ${thumb ? `<div class="ctr-job-card-thumb-wrap"><img src="${thumb}" alt="" class="ctr-job-card-thumb"></div>` : ''}
        </div>
    </button>`;
};

const contractorTimeline = (status) => {
    const steps = [
        ['assigned', 'Assigned'],
        ['accepted', 'Accepted'],
        ['scheduled', 'Visit Scheduled'],
        ['in_progress', 'Work Started'],
        ['waiting_approval', 'Invoice Submitted'],
        ['approved', 'Approved'],
        ['paid', 'Paid'],
    ];
    const order = steps.map(s => s[0]);
    const current = order.indexOf(status);
    return `<div class="ctr-timeline">${steps.map(([key, label], i) => {
        const done = i <= current;
        const active = i === current;
        return `<div class="ctr-timeline-step ${done ? 'done' : ''} ${active ? 'active' : ''}">
            <div class="ctr-timeline-dot"></div>
            <p class="ctr-timeline-label">${label}</p>
        </div>`;
    }).join('')}</div>`;
};

function contractorJobAction(action, msg) {
    const job = contractorJob(STATE.contractorJobId);
    const flow = { accept: 'accepted', start: 'in_progress' };
    if (action === 'decline') {
        toast(msg || 'Job declined');
        go('contractor-jobs');
        return;
    }
    if (action === 'schedule') {
        go('contractor-schedule', { jobId: job.id });
        return;
    }
    if (action === 'work') {
        go('contractor-work', { jobId: job.id, jobTab: 'work' });
        return;
    }
    if (action === 'documents') {
        go('contractor-documents', { jobId: job.id, jobTab: 'invoice' });
        return;
    }
    if (flow[action]) {
        job.status = flow[action];
        syncContractorJobToMaintenance(job);
        saveContractorJobs();
        toast(msg || 'Updated');
        render();
    }
}

function confirmContractorSchedule() {
    const job = contractorJob(STATE.contractorJobId);
    const date = document.querySelector('[data-field="visitDate"]')?.value;
    const time = document.querySelector('[data-field="visitTime"]')?.value;
    const notes = document.querySelector('[data-field="scheduleNotes"]')?.value?.trim() || '';
    if (!date || !time) {
        toast('Select visit date and time');
        return;
    }
    job.scheduledDate = date;
    job.scheduledTime = time;
    job.scheduleNotes = notes;
    const formatted = new Date(`${date}T${time}`).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    job.visitDate = Number.isNaN(new Date(`${date}T${time}`).getTime()) ? `${date} ${time}` : formatted;
    job.status = 'scheduled';
    syncContractorJobToMaintenance(job);
    saveContractorJobs();
    toast('Visit scheduled');
    go('contractor-job-detail', { jobId: job.id });
}

function saveContractorNote() {
    const job = contractorJob(STATE.contractorJobId);
    const text = document.querySelector('[data-field="workNote"]')?.value?.trim();
    if (!text) {
        toast('Write a note first');
        return;
    }
    job.notes.push({ text, time: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) });
    saveContractorJobs();
    toast('Note saved');
    render();
}

function uploadContractorFile(kind) {
    const job = contractorJob(STATE.contractorJobId);
    const src = IMG.maint[job.id % IMG.maint.length];
    if (kind === 'certificate') {
        openContractorCertSlot('other');
        STATE.contractorCertUpload.fromJob = true;
        STATE.contractorCertUpload.jobId = job.id;
        return;
    } else if (kind === 'invoice') {
        const amount = document.querySelector('[data-field="invoiceAmount"]')?.value?.trim() || '£185';
        job.invoice = {
            amount: amount.startsWith('£') ? amount : `£${amount}`,
            file: `INV-${job.id + 100}.pdf`,
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
        toast('Invoice uploaded');
    } else if (job.photos[kind]) {
        job.photos[kind].push(src);
        toast('Photo added');
    }
    saveContractorJobs();
    render();
}

function markContractorJobComplete() {
    const job = contractorJob(STATE.contractorJobId);
    if (!job.invoice) {
        job.invoice = typeof generateContractorSystemInvoice === 'function' ? generateContractorSystemInvoice(job) : null;
    }
    if (!job.invoice) {
        toast('Generate your invoice first — amount required');
        return;
    }
    job.status = 'waiting_approval';
    syncContractorJobToMaintenance(job);
    submitContractorInvoice(job);
    saveContractorJobs();
    if (typeof AppStore !== 'undefined') AppStore.save();
    toast('Invoice submitted — waiting for landlord approval');
    go('contractor-jobs');
}

const contractorFilterJobs = () => {
    const f = STATE.contractorJobFilter;
    const map = {
        all: () => true,
        assigned: j => j.status === 'assigned',
        accepted: j => ['accepted', 'scheduled'].includes(j.status),
        in_progress: j => ['in_progress', 'waiting_approval', 'approved'].includes(j.status),
        completed: j => ['completed', 'paid'].includes(j.status),
    };
    return CONTRACTOR_JOBS.filter(map[f] || map.all);
};

const CONTRACTOR_TRADE_CATALOG = [
    { id: 'plumbing', label: 'Plumbing & Heating', shortLabel: 'Plumber', icon: 'wrench', color: '#2563EB', bg: '#EFF6FF', jobsFor: 'Leaks, taps, sinks, pipes, toilets, blocked drains', keywords: ['sink', 'tap', 'leak', 'pipe', 'plumb', 'water', 'damp', 'toilet', 'drain', 'bathroom', 'basin', 'shower'] },
    { id: 'heating', label: 'Heating & Gas', shortLabel: 'Heating engineer', icon: 'flame', color: '#EA580C', bg: '#FFF7ED', jobsFor: 'Boilers, radiators, gas safety, hot water', keywords: ['boiler', 'radiator', 'heat', 'gas', 'hot water', 'thermostat', 'central heating'] },
    { id: 'electrical', label: 'Electrical', shortLabel: 'Electrician', icon: 'zap', color: '#CA8A04', bg: '#FEF9C3', jobsFor: 'Lights, sockets, wiring, fuse boxes', keywords: ['light', 'electric', 'flicker', 'socket', 'fuse', 'wiring', 'switch', 'power'] },
    { id: 'general', label: 'General Maintenance', shortLabel: 'Handyman', icon: 'hammer', color: '#64748B', bg: '#F1F5F9', jobsFor: 'Repairs, fixtures, small jobs, odd jobs', keywords: ['window', 'door', 'lock', 'latch', 'fixture', 'general', 'repair', 'handle'] },
    { id: 'roofing', label: 'Roofing', shortLabel: 'Roofer', icon: 'home', color: '#7C3AED', bg: '#F3E8FF', jobsFor: 'Roof leaks, tiles, gutters, chimneys', keywords: ['roof', 'gutter', 'tile', 'chimney', 'slate'] },
    { id: 'carpentry', label: 'Carpentry', shortLabel: 'Carpenter', icon: 'ruler', color: '#B45309', bg: '#FFEDD5', jobsFor: 'Doors, floors, frames, built-in units', keywords: ['door', 'floor', 'wood', 'frame', 'cupboard', 'shelf', 'skirting'] },
    { id: 'painting', label: 'Painting & Decorating', shortLabel: 'Decorator', icon: 'paintbrush', color: '#DB2777', bg: '#FCE7F3', jobsFor: 'Paint, wallpaper, plaster touch-ups', keywords: ['paint', 'peel', 'wallpaper', 'decorat', 'plaster', 'wall', 'mould'] },
];

const CONTRACTOR_TRADES = CONTRACTOR_TRADE_CATALOG.map(t => t.label);

function contractorTradeById(id) {
    return CONTRACTOR_TRADE_CATALOG.find(t => t.id === id) || CONTRACTOR_TRADE_CATALOG.find(t => t.id === 'general');
}

function contractorTradeFromLabel(label) {
    return CONTRACTOR_TRADE_CATALOG.find(t => t.label === label)
        || CONTRACTOR_TRADE_CATALOG.find(t => t.shortLabel === label)
        || CONTRACTOR_TRADE_CATALOG[0];
}

function resolveContractorTrade(source) {
    if (!source) return CONTRACTOR_TRADE_CATALOG[0];
    if (source.tradeId) return contractorTradeById(source.tradeId);
    if (source.trade) return contractorTradeFromLabel(source.trade);
    if (source.category) return CONTRACTOR_TRADE_CATALOG.find(t => t.shortLabel === source.category) || CONTRACTOR_TRADE_CATALOG[0];
    return CONTRACTOR_TRADE_CATALOG[0];
}

function contractorCategoryLabel(source) {
    return source?.category || resolveContractorTrade(source).shortLabel;
}

function contractorJobsForLabel(source) {
    return source?.jobsFor || resolveContractorTrade(source).jobsFor;
}

function contractorAvatarForTrade(tradeId) {
    const map = { plumbing: IMG.avatar.plumber, heating: IMG.avatar.heating, electrical: IMG.avatar.electric };
    return map[tradeId] || IMG.avatar.plumber;
}

function normalizeContractorTradeFields(source) {
    const meta = resolveContractorTrade(source);
    return {
        tradeId: meta.id,
        trade: meta.label,
        category: meta.shortLabel,
        jobsFor: meta.jobsFor,
    };
}

function renderContractorTradeBadge(source, extraClass = '') {
    const meta = resolveContractorTrade(source);
    const label = contractorCategoryLabel(source);
    return `<span class="ctr-trade-badge ${extraClass}" style="background:${meta.bg};color:${meta.color}"><i data-lucide="${meta.icon}" class="w-3 h-3"></i>${label}</span>`;
}

let CONTRACTOR_USER = {
    firstName: 'Mike',
    lastName: 'Thompson',
    email: 'mike@plumberpro.co.uk',
    phone: '+44 7700 900123',
    company: 'Plumber Pro Ltd',
    tradeId: 'plumbing',
    trade: 'Plumbing & Heating',
    category: 'Plumber',
    jobsFor: 'Leaks, taps, sinks, pipes, toilets, blocked drains',
    companyReg: '12345678',
    vatNumber: 'GB123456789',
    gasSafe: true,
    liabilityInsurance: true,
    certificates: [
        { id: 0, type: 'gas_safe', name: 'Gas Safe Registration', fileName: 'gas-safe-reg-2026.pdf', uploadedAt: 'Jan 15, 2026', validUntil: 'Mar 2027' },
        { id: 1, type: 'liability_insurance', name: 'Public Liability Insurance', fileName: 'liability-insurance-2026.pdf', uploadedAt: 'Dec 1, 2025', validUntil: 'Dec 2026' },
    ],
};

const CONTRACTOR_CERT_TYPES = [
    { type: 'gas_safe', label: 'Gas Safe Registration', icon: 'flame', color: '#EA580C', bg: '#FFF7ED' },
    { type: 'liability_insurance', label: 'Public Liability Insurance', icon: 'shield', color: '#2563EB', bg: '#EFF6FF' },
    { type: 'trade_qualification', label: 'Trade Qualification', icon: 'award', color: '#7C3AED', bg: '#F3E8FF' },
    { type: 'other', label: 'Other Certificate', icon: 'file-text', color: '#64748B', bg: '#F1F5F9' },
];

function contractorCertTypeOption(type) {
    return CONTRACTOR_CERT_TYPES.find(t => t.type === type) || CONTRACTOR_CERT_TYPES[CONTRACTOR_CERT_TYPES.length - 1];
}

function ensureContractorCertificates(profile) {
    if (!profile) return [];
    if (!profile.certificates) profile.certificates = [];
    return profile.certificates;
}

function contractorCertByType(profile, type) {
    return ensureContractorCertificates(profile).find(c => c.type === type) || null;
}

function nextContractorCertId(profile) {
    const certs = ensureContractorCertificates(profile);
    return certs.length ? Math.max(...certs.map(c => c.id)) + 1 : 0;
}

function getContractorDirectoryEntry(idOrName) {
    if (typeof CONTRACTORS === 'undefined') return null;
    if (typeof idOrName === 'number') return CONTRACTORS.find(c => c.id === idOrName) || null;
    const key = String(idOrName || '').toLowerCase();
    return CONTRACTORS.find(c =>
        c.id === idOrName
        || c.name?.toLowerCase() === key
        || c.company?.toLowerCase() === key
        || c.email?.toLowerCase() === key
    ) || null;
}

function getContractorPublicProfile(contractorId) {
    const entry = getContractorDirectoryEntry(contractorId);
    if (!entry) return null;
    const isSelf = CONTRACTOR_USER?.email && entry.email?.toLowerCase() === CONTRACTOR_USER.email.toLowerCase();
    const isSelfCompany = CONTRACTOR_USER?.company && entry.name?.toLowerCase() === CONTRACTOR_USER.company.toLowerCase();
    if (isSelf || isSelfCompany) {
        return {
            ...entry,
            firstName: CONTRACTOR_USER.firstName,
            lastName: CONTRACTOR_USER.lastName,
            phone: CONTRACTOR_USER.phone || entry.phone,
            email: CONTRACTOR_USER.email || entry.email,
            companyReg: CONTRACTOR_USER.companyReg || entry.companyReg,
            vatNumber: CONTRACTOR_USER.vatNumber || entry.vatNumber,
            gasSafe: CONTRACTOR_USER.gasSafe,
            liabilityInsurance: CONTRACTOR_USER.liabilityInsurance,
            certificates: ensureContractorCertificates(CONTRACTOR_USER).length
                ? JSON.parse(JSON.stringify(CONTRACTOR_USER.certificates))
                : ensureContractorCertificates(entry),
        };
    }
    ensureContractorCertificates(entry);
    return entry;
}

function syncContractorUserToDirectory() {
    if (typeof CONTRACTORS === 'undefined' || !CONTRACTOR_USER?.company) return;
    const idx = CONTRACTORS.findIndex(c =>
        c.email?.toLowerCase() === CONTRACTOR_USER.email?.toLowerCase()
        || c.name?.toLowerCase() === CONTRACTOR_USER.company?.toLowerCase()
    );
    if (idx < 0) return;
    CONTRACTORS[idx] = {
        ...CONTRACTORS[idx],
        ...normalizeContractorTradeFields(CONTRACTOR_USER),
        phone: CONTRACTOR_USER.phone || CONTRACTORS[idx].phone,
        email: CONTRACTOR_USER.email || CONTRACTORS[idx].email,
        companyReg: CONTRACTOR_USER.companyReg || CONTRACTORS[idx].companyReg,
        vatNumber: CONTRACTOR_USER.vatNumber || CONTRACTORS[idx].vatNumber,
        gasSafe: !!CONTRACTOR_USER.gasSafe,
        liabilityInsurance: !!CONTRACTOR_USER.liabilityInsurance,
        certificates: JSON.parse(JSON.stringify(ensureContractorCertificates(CONTRACTOR_USER))),
    };
}

function saveContractorCertificates() {
    ensureContractorCertificates(CONTRACTOR_USER);
    if (typeof loadContractorAccounts === 'function') loadContractorAccounts();
    if (typeof contractorAccountByEmail === 'function') {
        const acc = contractorAccountByEmail(CONTRACTOR_USER.email);
        if (acc) {
            acc.certificates = JSON.parse(JSON.stringify(CONTRACTOR_USER.certificates));
            if (typeof saveContractorAccounts === 'function') saveContractorAccounts();
        }
    }
    syncContractorUserToDirectory();
}

function openContractorCertSlot(certType, replaceCertId = null) {
    const opt = contractorCertTypeOption(certType);
    STATE.contractorCertUpload = {
        open: true,
        step: 'file',
        type: certType,
        replaceId: replaceCertId,
        file: null,
        displayName: replaceCertId ? '' : opt.label,
        validUntil: '',
    };
    render();
}

function closeContractorCertUpload() {
    STATE.contractorCertUpload = null;
    render();
}

async function pickContractorCertFileAction() {
    if (typeof pickDocumentFiles !== 'function') {
        toast('Upload not available');
        return;
    }
    const files = await pickDocumentFiles({ multiple: false });
    if (!files.length) return;
    if (!STATE.contractorCertUpload) STATE.contractorCertUpload = { open: true, step: 'file' };
    STATE.contractorCertUpload.file = files[0];
    STATE.contractorCertUpload.displayName = STATE.contractorCertUpload.displayName || files[0].name.replace(/\.[^.]+$/, '');
    STATE.contractorCertUpload.step = 'review';
    render();
}

function saveContractorCertUpload() {
    const upload = STATE.contractorCertUpload;
    if (!upload?.file || !upload.type) {
        toast('Choose a file to upload');
        return;
    }
    const nameInput = document.querySelector('[data-ctr-cert-name]');
    const validInput = document.querySelector('[data-ctr-cert-valid]');
    const name = (nameInput?.value?.trim() || upload.displayName || upload.file.name).trim();
    if (!name) {
        toast('Enter a certificate name');
        return;
    }
    const validUntil = validInput?.value?.trim() || '';
    const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const cert = {
        id: upload.replaceId ?? nextContractorCertId(CONTRACTOR_USER),
        type: upload.type,
        name,
        fileName: upload.file.name,
        fileUrl: upload.file.url,
        mime: upload.file.mime,
        uploadedAt: now,
        validUntil,
    };
    ensureContractorCertificates(CONTRACTOR_USER);
    if (upload.replaceId != null) {
        CONTRACTOR_USER.certificates = CONTRACTOR_USER.certificates.filter(c => c.id !== upload.replaceId);
    } else {
        const existing = contractorCertByType(CONTRACTOR_USER, upload.type);
        if (existing && upload.type !== 'other') {
            CONTRACTOR_USER.certificates = CONTRACTOR_USER.certificates.filter(c => c.id !== existing.id);
        }
    }
    CONTRACTOR_USER.certificates.push(cert);
    if (upload.type === 'gas_safe') CONTRACTOR_USER.gasSafe = true;
    if (upload.type === 'liability_insurance') CONTRACTOR_USER.liabilityInsurance = true;
    if (upload.fromJob && upload.jobId != null && typeof CONTRACTOR_JOBS !== 'undefined') {
        const job = CONTRACTOR_JOBS.find(j => j.id === upload.jobId);
        if (job) {
            if (!job.certificates) job.certificates = [];
            job.certificates.push({
                id: cert.id,
                type: cert.type,
                name: cert.name,
                fileName: cert.fileName,
                uploadedAt: cert.uploadedAt,
                validUntil: cert.validUntil,
            });
            if (typeof saveContractorJobs === 'function') saveContractorJobs();
        }
    }
    saveContractorCertificates();
    STATE.contractorCertUpload = null;
    toast(upload.replaceId != null ? 'Certificate replaced' : 'Certificate uploaded');
    render();
}

function deleteContractorCert(certId) {
    CONTRACTOR_USER.certificates = ensureContractorCertificates(CONTRACTOR_USER).filter(c => c.id !== certId);
    saveContractorCertificates();
    toast('Certificate removed');
    render();
}

function renderContractorCertSlot(certType) {
    const opt = contractorCertTypeOption(certType);
    const cert = contractorCertByType(CONTRACTOR_USER, certType);
    if (cert) {
        return `
        <div class="ctr-cert-slot ctr-cert-slot--filled">
            <button type="button" data-action="view-contractor-cert" data-cert="${cert.id}" class="ctr-cert-slot-preview" style="color:${opt.color};background:${opt.bg}">
                <i data-lucide="${opt.icon}" class="w-7 h-7"></i>
                <span class="ctr-cert-slot-view"><i data-lucide="eye" class="w-3.5 h-3.5"></i></span>
            </button>
            <div class="ctr-cert-slot-toolbar">
                <button type="button" data-action="replace-contractor-cert" data-cert-type="${certType}" data-cert="${cert.id}" class="ctr-cert-slot-btn" aria-label="Replace file"><i data-lucide="upload" class="w-3.5 h-3.5"></i></button>
                <button type="button" data-action="delete-contractor-cert" data-cert="${cert.id}" class="ctr-cert-slot-btn ctr-cert-slot-btn--danger" aria-label="Delete file"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
            <p class="ctr-cert-slot-label">${escapeHtml(opt.label)}</p>
            <p class="ctr-cert-slot-meta">${escapeHtml(cert.fileName)}</p>
            <p class="ctr-cert-slot-date">${cert.validUntil ? `Valid until ${escapeHtml(cert.validUntil)}` : `Uploaded ${escapeHtml(cert.uploadedAt)}`}</p>
        </div>`;
    }
    return `
    <button type="button" data-action="open-contractor-cert-slot" data-cert-type="${certType}" class="ctr-cert-slot ctr-cert-slot--empty">
        <span class="ctr-cert-slot-preview ctr-cert-slot-preview--empty" style="color:${opt.color};background:${opt.bg}">
            <i data-lucide="plus" class="w-6 h-6"></i>
        </span>
        <span class="ctr-cert-slot-label">${escapeHtml(opt.label)}</span>
        <span class="ctr-cert-slot-meta ctr-cert-slot-meta--hint">Tap to upload</span>
    </button>`;
}

function renderContractorCertUploadModal() {
    const upload = STATE.contractorCertUpload;
    if (!upload?.open) return '';
    const opt = contractorCertTypeOption(upload.type);
    const step = upload.step || 'file';
    const title = step === 'review' ? 'Review certificate' : `Upload ${opt.label}`;
    return `
    <div class="modal-overlay" data-action="close-contractor-cert-upload">
        <div class="modal-card ctr-cert-modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <button type="button" data-action="close-contractor-cert-upload" class="modal-close"><i data-lucide="x" class="w-5 h-5"></i></button>
                <h2 class="modal-title">${title}</h2>
            </div>
            <div class="modal-body">
                ${step === 'file' ? `
                <p class="text-[13px] text-[#64748B]">Upload a PDF or photo for <strong>${escapeHtml(opt.label)}</strong>. Landlords and tenants can view this on your profile.</p>
                <button type="button" data-action="pick-contractor-cert-file" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full mt-3">
                    <i data-lucide="upload" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
                    <p class="text-[13px] font-semibold text-[#0F172A] mt-2">Choose file</p>
                    <p class="text-[11px] text-[#64748B] mt-1">PDF, JPG or PNG</p>
                </button>` : `
                <div class="ctr-cert-review-file card p-3 flex items-center gap-3">
                    <div class="ctr-cert-review-icon" style="background:${opt.bg};color:${opt.color}"><i data-lucide="file-text" class="w-5 h-5"></i></div>
                    <div class="min-w-0">
                        <p class="text-[13px] font-semibold text-[#0F172A] truncate">${escapeHtml(upload.file?.name || 'Document')}</p>
                        <p class="text-[11px] text-[#64748B]">${escapeHtml(opt.label)}</p>
                    </div>
                </div>
                <div class="auth-field" style="margin-top:12px"><label>Certificate name</label><input type="text" data-ctr-cert-name class="auth-input" value="${escapeHtml(upload.displayName || '')}" placeholder="${escapeHtml(opt.label)}"></div>
                <div class="auth-field"><label>Valid until (optional)</label><input type="text" data-ctr-cert-valid class="auth-input" value="${escapeHtml(upload.validUntil || '')}" placeholder="e.g. Mar 2027"></div>`}
            </div>
            <div class="modal-footer">
                ${step === 'review' ? `<button type="button" data-action="save-contractor-cert" class="btn-primary w-full py-3">Save certificate</button>` : ''}
                <button type="button" data-action="close-contractor-cert-upload" class="btn-secondary w-full py-3 mt-2">Cancel</button>
            </div>
        </div>
    </div>`;
}

function renderContractorCertList(profile, { editable = false } = {}) {
    const certs = ensureContractorCertificates(profile);
    if (!certs.length) {
        return `<p class="text-[13px] text-[#64748B]">No certificates uploaded yet${editable ? ' — add your Gas Safe, insurance, and trade documents.' : '.'}</p>`;
    }
    return `
    <div class="ctr-cert-list">
        ${certs.map(cert => {
            const opt = contractorCertTypeOption(cert.type);
            return `
        <div class="ctr-cert-list-item card p-3">
            <div class="ctr-cert-list-icon" style="background:${opt.bg};color:${opt.color}"><i data-lucide="${opt.icon}" class="w-5 h-5"></i></div>
            <div class="ctr-cert-list-body min-w-0">
                <p class="ctr-cert-list-name">${escapeHtml(cert.name)}</p>
                <p class="ctr-cert-list-file"><i data-lucide="paperclip" class="w-3.5 h-3.5"></i>${escapeHtml(cert.fileName)}</p>
                <p class="ctr-cert-list-meta">${cert.validUntil ? `Valid until ${escapeHtml(cert.validUntil)}` : `Uploaded ${escapeHtml(cert.uploadedAt)}`}</p>
            </div>
            <button type="button" data-action="view-contractor-cert" data-cert="${cert.id}" data-contractor-view="${profile.id ?? ''}" class="ctr-cert-list-view">View</button>
        </div>`;
        }).join('')}
    </div>`;
}

function screenContractorCertPreview() {
    const profile = getContractorPublicProfile(STATE.contractorViewId);
    const cert = ensureContractorCertificates(profile).find(c => c.id === STATE.contractorCertPreviewId);
    if (!profile || !cert) {
        return `${topBar('Certificate', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Certificate not found</p></div>`;
    }
    const opt = contractorCertTypeOption(cert.type);
    return `${topBar(cert.name, { back: true })}
    <div class="screen-content screen-enter">
        <div class="ctr-cert-preview-hero card p-4">
            <div class="ctr-cert-preview-icon" style="background:${opt.bg};color:${opt.color}"><i data-lucide="${opt.icon}" class="w-8 h-8"></i></div>
            <p class="ctr-cert-preview-name">${escapeHtml(cert.name)}</p>
            <p class="ctr-cert-preview-file">${escapeHtml(cert.fileName)}</p>
            <p class="ctr-cert-preview-meta">${cert.validUntil ? `Valid until ${escapeHtml(cert.validUntil)}` : `Uploaded ${escapeHtml(cert.uploadedAt)}`}</p>
        </div>
        <div class="ctr-cert-preview-doc card p-6 text-center">
            <i data-lucide="file-text" class="w-12 h-12 text-[#94A3B8] mx-auto"></i>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-3">${escapeHtml(cert.fileName)}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Certificate document on file</p>
        </div>
        <p class="text-[12px] text-[#64748B] text-center mt-3">Visible to landlords and tenants assigned to your jobs</p>
    </div>`;
}

function screenContractorPublicProfile() {
    const profile = getContractorPublicProfile(STATE.contractorViewId);
    if (!profile) {
        return `${topBar('Contractor', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Contractor not found</p></div>`;
    }
    const visual = typeof resolveContractorTrade === 'function' ? resolveContractorTrade(profile) : null;
    const certCount = ensureContractorCertificates(profile).length;
    const isLandlord = STATE.userRole === 'landlord';
    const isTenant = STATE.userRole === 'tenant';
    const chatId = typeof ensureContractorConversation === 'function' ? ensureContractorConversation(profile) : null;
    const openJobs = typeof contractorOpenJobs === 'function' ? contractorOpenJobs(profile.name) : 0;
    const jobsLine = openJobs ? `${openJobs} open job${openJobs === 1 ? '' : 's'}` : 'No active jobs';
    return `${topBar('Contractor', { back: true })}
    <div class="screen-content screen-enter ctr-profile-page">
        <div class="ctr-profile-hero card">
            <img src="${profile.img || contractorAvatarForTrade(profile.tradeId)}" class="ctr-profile-avatar" alt="">
            <div class="ctr-profile-hero-copy min-w-0 flex-1">
                <h1 class="ctr-profile-name">${escapeHtml(profile.name)}</h1>
                ${profile.firstName ? `<p class="ctr-profile-person">${escapeHtml(`${profile.firstName} ${profile.lastName || ''}`.trim())}</p>` : ''}
                <div class="ctr-profile-trade-row">
                    ${typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(profile) : ''}
                </div>
                <p class="ctr-profile-jobs">${escapeHtml(contractorJobsForLabel(profile))}</p>
                <p class="ctr-profile-meta">${jobsLine}</p>
            </div>
        </div>
        ${(isLandlord || isTenant) ? `
        <div class="ctr-profile-actions">
            ${profile.phone ? `<button type="button" data-action="call-contractor" data-phone="${profile.phone.replace(/"/g, '')}" class="ctr-card-action"><i data-lucide="phone" class="w-4 h-4"></i><span>Call</span></button>` : ''}
            ${profile.email ? `<button type="button" data-action="email-contractor" data-email="${profile.email.replace(/"/g, '')}" class="ctr-card-action"><i data-lucide="mail" class="w-4 h-4"></i><span>Email</span></button>` : ''}
            ${chatId != null ? `<button type="button" data-go="chat" data-chat="${chatId}" class="ctr-card-action"><i data-lucide="message-square" class="w-4 h-4"></i><span>Message</span></button>` : ''}
        </div>` : ''}
        <div class="ctr-profile-section card">
            <div class="ctr-profile-section-head">
                <p class="ctr-section-label">Certifications</p>
                <span class="ctr-public-cert-count">${certCount} on file</span>
            </div>
            <div class="ctr-profile-badges">
                ${profile.gasSafe ? '<span class="ctr-profile-badge ctr-profile-badge--green">Gas Safe</span>' : ''}
                ${profile.liabilityInsurance ? '<span class="ctr-profile-badge ctr-profile-badge--blue">Insured</span>' : ''}
                ${visual ? `<span class="ctr-profile-badge" style="background:${visual.bg};color:${visual.color}">${escapeHtml(profile.category || visual.shortLabel)}</span>` : ''}
            </div>
            ${renderContractorCertList(profile)}
        </div>
        ${profile.companyReg ? `
        <div class="ctr-profile-section card">
            <p class="ctr-section-label">Company</p>
            <p class="ctr-profile-reg"><i data-lucide="building-2" class="w-4 h-4"></i> Reg ${escapeHtml(profile.companyReg)}</p>
        </div>` : ''}
        ${isTenant ? `<p class="ctr-profile-tenant-note">Your landlord assigned this contractor. Contact your landlord to reschedule.</p>` : ''}
    </div>`;
}

function screenContractorCertifications() {
    const certs = ensureContractorCertificates(CONTRACTOR_USER);
    const slotTypes = CONTRACTOR_CERT_TYPES.filter(t => t.type !== 'other');
    const otherCerts = certs.filter(c => c.type === 'other');
    return `${topBar('Certifications', { back: true })}
    <div class="screen-content screen-enter">
        <p class="ux-intro">Upload certificates with the document file. Landlords and tenants see these on your public profile when you are assigned to jobs.</p>
        <p class="doc-page-count">${certs.length} certificate${certs.length === 1 ? '' : 's'} on file</p>
        <div class="ctr-cert-grid">
            ${slotTypes.map(t => renderContractorCertSlot(t.type)).join('')}
        </div>
        <p class="txn-section-label txn-section-label--spaced">Other certificates</p>
        ${otherCerts.length ? renderContractorCertList({ ...CONTRACTOR_USER, id: getContractorDirectoryEntry(CONTRACTOR_USER.email || CONTRACTOR_USER.company)?.id }) : `<p class="text-[12px] text-[#64748B] mb-3">Additional trade or safety documents.</p>`}
        <button type="button" data-action="open-contractor-cert-slot" data-cert-type="other" class="btn-secondary w-full py-3 text-[13px]">+ Add other certificate</button>
    </div>
    ${renderContractorCertUploadModal()}`;
}

function setActiveContractorProfile(account) {
    if (!account) return;
    const tradeFields = normalizeContractorTradeFields(account);
    CONTRACTOR_USER = {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.phone || '',
        company: account.company || '',
        ...tradeFields,
        companyReg: account.companyReg || '',
        vatNumber: account.vatNumber || '',
        gasSafe: !!account.gasSafe,
        liabilityInsurance: !!account.liabilityInsurance,
        certificates: account.certificates?.length ? JSON.parse(JSON.stringify(account.certificates)) : (CONTRACTOR_USER.certificates || []),
    };
}

function registerContractorFromSignup(account) {
    if (typeof CONTRACTORS === 'undefined' || !account?.company) return;
    const exists = CONTRACTORS.some(c =>
        c.name.toLowerCase() === account.company.toLowerCase() || c.email?.toLowerCase() === account.email?.toLowerCase()
    );
    if (exists) return;
    const tradeFields = normalizeContractorTradeFields(account);
    CONTRACTORS.push({
        id: CONTRACTORS.length,
        name: account.company,
        ...tradeFields,
        img: contractorAvatarForTrade(tradeFields.tradeId),
        phone: account.phone || '',
        email: account.email,
        gasSafe: !!account.gasSafe,
        liabilityInsurance: !!account.liabilityInsurance,
        certificates: account.certificates ? JSON.parse(JSON.stringify(account.certificates)) : [],
    });
}

function contractorSignupField(name) {
    const el = document.querySelector(`[data-ctr-signup="${name}"]`);
    if (el?.type === 'checkbox') return el.checked;
    return el?.value?.trim() || '';
}

function captureContractorSignupDraft() {
    const prev = STATE.contractorSignupDraft || {};
    const tradeLabel = contractorSignupField('trade') || prev.trade || CONTRACTOR_TRADES[0];
    const tradeMeta = contractorTradeFromLabel(tradeLabel);
    STATE.contractorSignupDraft = {
        ...prev,
        firstName: contractorSignupField('firstName') || prev.firstName || '',
        lastName: contractorSignupField('lastName') || prev.lastName || '',
        email: contractorSignupField('email') || prev.email || '',
        phone: contractorSignupField('phone') || prev.phone || '',
        company: contractorSignupField('company') || prev.company || '',
        tradeId: tradeMeta.id,
        trade: tradeMeta.label,
        category: tradeMeta.shortLabel,
        jobsFor: tradeMeta.jobsFor,
        companyReg: contractorSignupField('companyReg') || prev.companyReg || '',
        vatNumber: contractorSignupField('vatNumber') || prev.vatNumber || '',
        gasSafe: document.querySelector('[data-ctr-signup="gasSafe"]')?.checked ?? prev.gasSafe ?? false,
        liabilityInsurance: document.querySelector('[data-ctr-signup="liabilityInsurance"]')?.checked ?? prev.liabilityInsurance ?? false,
        password: contractorSignupField('password') || prev.password || '',
        confirmPassword: contractorSignupField('confirmPassword') || prev.confirmPassword || '',
    };
    return STATE.contractorSignupDraft;
}

function validateContractorSignupStep(step) {
    const d = captureContractorSignupDraft();
    if (step === 1) {
        if (!d.firstName) { toast('Enter your first name'); return false; }
        if (!d.lastName) { toast('Enter your last name'); return false; }
        if (!isValidEmail(d.email)) { toast('Enter a valid work email'); return false; }
        loadContractorAccounts();
        if (contractorAccountByEmail(d.email)) {
            toast('This email is already registered — sign in instead');
            return false;
        }
        if (!d.phone) { toast('Enter a mobile number for job updates'); return false; }
        return true;
    }
    if (step === 2) {
        if (!d.company) { toast('Enter your company or trading name'); return false; }
        if (!d.trade) { toast('Select your trade category'); return false; }
        return true;
    }
    if (step === 3) {
        if (!d.password || d.password.length < 8) { toast('Password must be at least 8 characters'); return false; }
        if (!/[A-Z]/.test(d.password) || !/[0-9]/.test(d.password)) {
            toast('Include an uppercase letter and a number');
            return false;
        }
        if (d.password !== d.confirmPassword) { toast('Passwords do not match'); return false; }
        return true;
    }
    return true;
}

function advanceContractorSignup() {
    const step = STATE.contractorSignupStep || 1;
    if (!validateContractorSignupStep(step)) return;
    if (step < 4) {
        STATE.contractorSignupStep = step + 1;
        render();
        return;
    }
    submitContractorSignup();
}

function submitContractorSignup() {
    const d = captureContractorSignupDraft();
    if (!validateContractorSignupStep(1) || !validateContractorSignupStep(2) || !validateContractorSignupStep(3)) return;
    STATE.authRole = 'contractor';
    STATE.signupDraft = {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        company: d.company,
        tradeId: d.tradeId,
        trade: d.trade,
        category: d.category,
        jobsFor: d.jobsFor,
        companyReg: d.companyReg,
        vatNumber: d.vatNumber,
        gasSafe: d.gasSafe,
        liabilityInsurance: d.liabilityInsurance,
        password: d.password,
    };
    STATE.signupEmail = d.email;
    STATE.otpContext = 'signup';
    STATE.otpDigits = [];
    go('verify-otp');
    setTimeout(() => toast(`Verification code sent to ${d.email}`), 50);
}

function screenContractorSignUp() {
    const step = STATE.contractorSignupStep || 1;
    const d = STATE.contractorSignupDraft || {};
    const pwType = STATE.showPassword ? 'text' : 'password';
    const stepLabels = ['About you', 'Company', 'Credentials', 'Review'];
    const progress = `
        <div class="wizard-progress ctr-signup-progress">
            <div class="wizard-steps">
                ${[1, 2, 3, 4].map(s => `<div class="wizard-step ${s <= step ? 'active' : ''} ${s < step ? 'done' : ''}"></div>`).join('')}
            </div>
            <p class="wizard-step-label">Step ${step} of 4 · ${stepLabels[step - 1]}</p>
        </div>`;
    const invited = STATE.contractorInviteContext;
    const stepBody = {
        1: `
            <p class="ux-intro">Your contact details — landlords and tenants reach you here for job updates.</p>
            <div class="auth-form" style="margin-top:16px">
                <div class="auth-field"><label>First name</label><input type="text" data-ctr-signup="firstName" class="auth-input" placeholder="Mike" value="${d.firstName || ''}" autocomplete="given-name"></div>
                <div class="auth-field"><label>Last name</label><input type="text" data-ctr-signup="lastName" class="auth-input" placeholder="Thompson" value="${d.lastName || ''}" autocomplete="family-name"></div>
                <div class="auth-field"><label>Work email</label><input type="email" data-ctr-signup="email" class="auth-input" placeholder="you@company.co.uk" value="${d.email || ''}" autocomplete="email" inputmode="email"></div>
                <div class="auth-field"><label>Mobile number</label><input type="tel" data-ctr-signup="phone" class="auth-input" placeholder="+44 7700 900000" value="${d.phone || ''}" autocomplete="tel"></div>
            </div>`,
        2: `
            <p class="ux-intro">Choose your trade so landlords know which jobs to send you.</p>
            <div class="auth-form" style="margin-top:16px">
                <div class="auth-field"><label>Company / trading name</label><input type="text" data-ctr-signup="company" class="auth-input" placeholder="Plumber Pro Ltd" value="${d.company || ''}" autocomplete="organization"></div>
                <div class="auth-field">
                    <label>Contractor type</label>
                    <select data-ctr-signup="trade" class="auth-input form-select">
                        ${CONTRACTOR_TRADE_CATALOG.map(t => `<option value="${t.label}" ${(d.trade || CONTRACTOR_TRADES[0]) === t.label ? 'selected' : ''}>${t.shortLabel} — ${t.label}</option>`).join('')}
                    </select>
                </div>
                <div class="ctr-signup-trade-hint card p-3">
                    <p class="ctr-signup-trade-hint-label">Jobs landlords assign you for</p>
                    <p class="ctr-signup-trade-hint-text">${contractorJobsForLabel(d)}</p>
                </div>
                <div class="auth-field"><label>Company registration no.</label><input type="text" data-ctr-signup="companyReg" class="auth-input" placeholder="Optional — e.g. 12345678" value="${d.companyReg || ''}"></div>
                <div class="auth-field"><label>VAT number</label><input type="text" data-ctr-signup="vatNumber" class="auth-input" placeholder="Optional — e.g. GB123456789" value="${d.vatNumber || ''}"></div>
            </div>`,
        3: `
            <p class="ux-intro">Certifications help landlords trust your work. You can upload documents after sign-up.</p>
            <div class="ctr-signup-checks card p-4" style="margin-top:12px">
                <label class="ctr-signup-check">
                    <input type="checkbox" data-ctr-signup="gasSafe" ${d.gasSafe ? 'checked' : ''}>
                    <span><strong>Gas Safe registered</strong><br><span class="text-[12px] text-[#64748B]">Required for gas and boiler work</span></span>
                </label>
                <label class="ctr-signup-check">
                    <input type="checkbox" data-ctr-signup="liabilityInsurance" ${d.liabilityInsurance ? 'checked' : ''}>
                    <span><strong>Public liability insurance</strong><br><span class="text-[12px] text-[#64748B]">Recommended for all trades</span></span>
                </label>
            </div>
            <div class="auth-form" style="margin-top:16px">
                <div class="auth-field">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-ctr-signup="password" class="auth-input" placeholder="Min. 8 characters" style="padding-right:44px" autocomplete="new-password">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="auth-field"><label>Confirm password</label><input type="password" data-ctr-signup="confirmPassword" class="auth-input" placeholder="Re-enter password" autocomplete="new-password"></div>
                ${typeof passwordRequirementsHtml === 'function' ? passwordRequirementsHtml() : ''}
            </div>`,
        4: `
            <p class="ux-intro">Check everything before creating your contractor workspace.</p>
            <div class="card p-4 ctr-signup-review" style="margin-top:12px">
                <p class="ctr-section-label">Contact</p>
                <p class="text-[14px] font-semibold text-[#0F172A] mt-1">${d.firstName || '—'} ${d.lastName || ''}</p>
                <p class="text-[13px] text-[#64748B] mt-1">${d.email || '—'} · ${d.phone || '—'}</p>
                <p class="ctr-section-label" style="margin-top:14px">Trade & category</p>
                <div class="flex flex-wrap gap-2 mt-2">${renderContractorTradeBadge(d)}</div>
                <p class="text-[13px] text-[#64748B] mt-2">${d.company || '—'}</p>
                <p class="text-[12px] text-[#94A3B8] mt-1">For: ${contractorJobsForLabel(d)}</p>
                ${d.companyReg ? `<p class="text-[12px] text-[#94A3B8] mt-1">Reg ${d.companyReg}</p>` : ''}
                ${d.vatNumber ? `<p class="text-[12px] text-[#94A3B8] mt-1">VAT ${d.vatNumber}</p>` : ''}
                <p class="ctr-section-label" style="margin-top:14px">Credentials</p>
                <div class="flex flex-wrap gap-2 mt-2">
                    ${d.gasSafe ? '<span class="badge" style="background:#ECFDF5;color:#059669">Gas Safe</span>' : ''}
                    ${d.liabilityInsurance ? '<span class="badge" style="background:#EFF6FF;color:#2563EB">Liability insurance</span>' : ''}
                    ${!d.gasSafe && !d.liabilityInsurance ? '<span class="text-[12px] text-[#64748B]">None selected yet</span>' : ''}
                </div>
            </div>
            <p class="auth-security-note" style="margin-top:16px"><i data-lucide="shield" class="w-3.5 h-3.5"></i> We'll email a verification code before activating your account</p>`,
    };
    return `
    <div class="auth-screen ctr-signup-screen">
        <div class="auth-topbar">
            <button type="button" data-action="back" class="auth-back-btn"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
            ${typeof appLogo === 'function' ? appLogo() : ''}
            <span style="width:40px"></span>
        </div>
        <div class="auth-content">
            <div class="auth-icon-wrap ctr-signup-icon">
                <i data-lucide="hard-hat" class="w-7 h-7 text-[#EA580C]"></i>
            </div>
            <h1 class="auth-heading">Create Contractor Account</h1>
            <p class="auth-sub">${invited ? 'Complete your profile to accept jobs from landlords on Landlord HQ.' : 'Set up your trade business to receive maintenance jobs, schedule visits, and upload invoices.'}</p>
            ${invited ? `
            <div class="card p-3 ctr-signup-invite-strip" style="margin-top:12px">
                <p class="text-[12px] font-semibold text-[#92400E]"><i data-lucide="mail-check" class="w-4 h-4 inline-block -mt-px"></i> Invited by John Smith</p>
            </div>` : ''}
            ${progress}
            ${stepBody[step]}
            <button type="button" data-action="contractor-signup-next" class="btn-auth btn-auth-primary ctr-signup-primary">${step < 4 ? 'Continue' : 'Create account'}</button>
            ${step > 1 ? `<button type="button" data-action="contractor-signup-back" class="btn-auth btn-auth-outline" style="margin-top:12px">Back</button>` : ''}
            <p class="auth-footer-text" style="margin-top:20px">Already have an account? <button type="button" data-action="contractor-sign-in">Sign In</button></p>
        </div>
    </div>`;
}

function screenContractorInvite() {
    return `
    <div class="auth-screen">
        <div class="auth-content" style="padding-top:40px">
            <div class="ctr-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <h1 class="auth-heading">You're Invited!</h1>
            <p class="auth-sub">John Smith invited you to join Landlord HQ as a contractor for maintenance jobs at their properties.</p>
            <div class="card p-4 text-left" style="margin-top:20px">
                <p class="text-[13px] font-semibold text-[#0F172A]">Plumber Pro Ltd</p>
                <p class="text-[12px] text-[#64748B] mt-1">Trade: Plumbing & Heating</p>
                <p class="text-[12px] text-[#64748B]">Invited: Mar 10, 2025</p>
            </div>
            <button type="button" data-action="contractor-signup" class="btn-auth btn-auth-primary" style="margin-top:24px;width:100%">Create account</button>
            <button type="button" data-action="contractor-sign-in" class="btn-auth btn-auth-outline" style="margin-top:12px;width:100%">Sign In with Email</button>
        </div>
    </div>`;
}

function screenContractorWelcome() {
    const newJobs = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
    const firstName = CONTRACTOR_USER.firstName || 'there';
    return `
    <div class="welcome-screen">
        <div class="welcome-hero" style="background:linear-gradient(160deg,#EA580C 0%,#F97316 45%,#FB923C 100%)">
            <div class="welcome-hero-top">
                <div class="welcome-success-badge">
                    <i data-lucide="circle-check" class="w-5 h-5"></i>
                    <span>Account ready</span>
                </div>
                <button type="button" data-go="contractor-notifications" class="welcome-bell-btn">
                    <i data-lucide="bell" class="w-5 h-5"></i>
                    <span class="welcome-bell-dot">2</span>
                </button>
            </div>
            <h1 class="welcome-hero-title">Welcome, ${firstName}! 🔧</h1>
            <p class="welcome-hero-sub">${CONTRACTOR_USER.company || 'Your contractor workspace'} is active. View jobs, schedule visits, and upload invoices.</p>
        </div>
        <div class="welcome-body">
            <button type="button" data-action="enter-app" class="welcome-dash-card" style="background:linear-gradient(135deg,#EA580C,#C2410C)">
                <div class="welcome-dash-content">
                    <p class="welcome-dash-eyebrow">Your workspace</p>
                    <p class="welcome-dash-title">Open Contractor Dashboard</p>
                    <p class="welcome-dash-sub">Jobs, schedule, messages & invoices</p>
                </div>
                <div class="welcome-dash-arrow"><i data-lucide="arrow-right" class="w-5 h-5"></i></div>
            </button>
            ${newJobs ? `
            <div class="card p-4" style="background:#FFFBEB;border-color:#FDE68A">
                <p class="text-[14px] font-semibold text-[#92400E]">${newJobs} new job waiting</p>
                <p class="text-[13px] text-[#B45309] mt-1">Accept the job, schedule your visit, then complete the work.</p>
                <button type="button" data-go="contractor-jobs" data-contractor-filter="assigned" class="btn-primary btn-accent w-full py-3 text-[13px] mt-3">View New Jobs</button>
            </div>` : `
            <div class="card p-4">
                <p class="text-[14px] font-semibold text-[#0F172A]">You're all set</p>
                <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">Check your schedule and open jobs from the dashboard.</p>
            </div>`}
        </div>
        <div class="welcome-nav">
            <button type="button" data-action="enter-app" class="welcome-nav-btn active"><i data-lucide="home" class="w-5 h-5"></i>Home</button>
            <button type="button" data-go="contractor-jobs" class="welcome-nav-btn"><i data-lucide="briefcase" class="w-5 h-5"></i>Jobs</button>
            <button type="button" data-go="messages" class="welcome-nav-btn"><i data-lucide="message-square" class="w-5 h-5"></i>Messages</button>
            <button type="button" data-go="contractor-profile" class="welcome-nav-btn"><i data-lucide="user" class="w-5 h-5"></i>Profile</button>
        </div>
    </div>`;
}

function screenTenantInvite() {
    const invite = tenantInviteByToken(STATE.tenantInviteToken);
    if (!invite) {
        return `
        <div class="auth-screen">
            <div class="auth-content" style="padding-top:60px;text-align:center">
                <i data-lucide="alert-circle" class="w-12 h-12 text-[#DC2626] mx-auto"></i>
                <h1 class="auth-heading" style="margin-top:20px">Invalid Invitation</h1>
                <p class="auth-sub">This invitation link is invalid or has expired. Ask your landlord to send a new one.</p>
                <button type="button" data-go="role-select" class="btn-auth btn-auth-primary" style="margin-top:32px;width:100%">Back to Home</button>
            </div>
        </div>`;
    }
    const p = PROPERTIES[invite.propertyId];
    if (!p) {
        return `
        <div class="auth-screen">
            <div class="auth-content" style="padding-top:60px;text-align:center">
                <i data-lucide="alert-circle" class="w-12 h-12 text-[#DC2626] mx-auto"></i>
                <h1 class="auth-heading" style="margin-top:20px">Property Not Found</h1>
                <p class="auth-sub">This invitation references a property that is no longer available. Ask your landlord to send a new invitation.</p>
                <button type="button" data-go="role-select" class="btn-auth btn-auth-primary" style="margin-top:32px;width:100%">Back to Home</button>
            </div>
        </div>`;
    }
    const activated = invite.status === 'activated';
    return `
    <div class="auth-screen">
        <div class="auth-content" style="padding-top:32px">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <h1 class="auth-heading">You're Invited!</h1>
            <p class="auth-sub">${invite.landlord} invited you to join Landlord HQ as a tenant at <strong>${p.name}</strong>.</p>
            <div class="card p-4 text-left" style="margin-top:20px">
                <div class="flex items-center gap-3 mb-3">
                    <img src="${IMG.props[invite.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
                    <div>
                        <p class="text-[14px] font-semibold text-[#0F172A]">${p.name}</p>
                        <p class="text-[12px] text-[#64748B]">${p.address}</p>
                    </div>
                </div>
                ${[['Unit', invite.unit], ['Monthly Rent', invite.rent], ['Lease', `${invite.leaseStart || '—'} → ${invite.leaseEnd || '—'}`], ['Invited', invite.sentAt]].map(([k, v]) => `
                <div class="flex justify-between text-[13px] py-1.5 border-t border-[#F1F5F9] first:border-0"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
            </div>
            ${invite.message ? `<div class="card p-4 text-left" style="margin-top:12px"><p class="text-[11px] font-bold text-[#64748B] uppercase">Message from landlord</p><p class="text-[13px] text-[#475569] mt-2 leading-relaxed">"${invite.message}"</p></div>` : ''}
            ${activated ? `
            <div class="card p-4 text-center" style="margin-top:16px;background:#ECFDF5;border-color:#BBF7D0">
                <p class="text-[13px] font-semibold text-[#059669]">Account already activated</p>
                <p class="text-[12px] text-[#64748B] mt-1">Sign in with your email and password.</p>
            </div>
            <button type="button" data-action="tenant-sign-in" class="btn-auth btn-auth-primary" style="margin-top:20px;width:100%">Sign In</button>
            ` : `
            <button type="button" data-action="tenant-activate" class="btn-auth btn-auth-primary" style="margin-top:24px;width:100%">Accept & Set Password</button>
            <button type="button" data-action="tenant-sign-in" class="btn-auth btn-auth-outline" style="margin-top:12px;width:100%">Already activated? Sign In</button>
            `}
            <p class="auth-security-note" style="margin-top:20px"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Tenant accounts require a landlord invitation</p>
        </div>
    </div>`;
}

function screenTenantActivate() {
    const invite = tenantInviteByToken(STATE.tenantInviteToken);
    if (!invite) return screenTenantInvite();
    const pwType = STATE.showPassword ? 'text' : 'password';
    const confirmType = STATE.showConfirmPassword ? 'text' : 'password';
    return `
    <div class="auth-screen">
        ${authTopbar()}
        <div class="auth-content">
            <div class="auth-icon-wrap" style="background:#DCFCE7">
                <i data-lucide="key-round" class="w-7 h-7 text-[#16A34A]"></i>
            </div>
            <h1 class="auth-heading">Activate Your Account</h1>
            <p class="auth-sub">Set a password for <strong>${invite.email}</strong> to access your tenant portal at ${PROPERTIES[invite.propertyId].name}.</p>
            <div class="auth-form">
                <div class="auth-field">
                    <label>Create password</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-tenant-password class="auth-input" placeholder="Enter password" style="padding-right:44px">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <div class="auth-field">
                    <label>Confirm password</label>
                    <div class="auth-input-wrap">
                        <input type="${confirmType}" data-tenant-confirm class="auth-input" placeholder="Re-enter password" style="padding-right:44px">
                        <button type="button" data-action="toggle-confirm-password" class="auth-input-toggle"><i data-lucide="${STATE.showConfirmPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                <button type="button" data-action="activate-tenant-account" class="btn-auth btn-auth-primary">Activate Account</button>
            </div>
            <p class="auth-security-note"><i data-lucide="lock" class="w-3.5 h-3.5"></i> Your account will be linked to ${invite.unit} at ${PROPERTIES[invite.propertyId].name}</p>
        </div>
    </div>`;
}

function screenTenantWelcome() {
    const t = getActiveTenant();
    const p = t ? PROPERTIES[t.propertyId] : PROPERTIES[0];
    const name = t ? t.firstName : 'Tenant';
    return `
    <div class="auth-screen" style="padding-bottom:0">
        <div class="welcome-header">
            <h1 class="welcome-greeting">Welcome, ${name}! 🏠</h1>
        </div>
        <div class="auth-content" style="padding-top:0">
            <button type="button" data-action="enter-app" class="portal-card portal-card-tenant">
                <p class="portal-card-title">Tenant Portal</p>
                <p class="portal-card-sub">${p.name} · ${t?.unit || 'Your unit'}</p>
                <i data-lucide="home" class="portal-card-icon w-20 h-20"></i>
            </button>
            <div class="card p-4 text-left">
                <p class="text-[13px] font-semibold text-[#0F172A]">You're all set</p>
                <p class="text-[12px] text-[#64748B] mt-2 leading-relaxed">Your account is linked to ${p.name}. Report maintenance issues, view documents, and message your landlord from the portal.</p>
            </div>
        </div>
        <div class="welcome-nav">
            <button type="button" data-action="enter-app" class="welcome-nav-btn active"><i data-lucide="home" class="w-5 h-5"></i>Home</button>
            <button type="button" data-go="log-maintenance" class="welcome-nav-btn"><i data-lucide="wrench" class="w-5 h-5"></i>Issues</button>
            <button type="button" data-go="messages" class="welcome-nav-btn"><i data-lucide="message-square" class="w-5 h-5"></i>Messages</button>
            <button type="button" data-action="logout" class="welcome-nav-btn"><i data-lucide="log-out" class="w-5 h-5"></i>Sign Out</button>
        </div>
    </div>`;
}

function tenantDashboardHeader(t, p) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const unitLabel = t.unit ? `${t.unit}, ${(p?.name || 'Your home').replace(/,.*/, '')}` : (p?.name || 'Your property');
    const av = typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tid) : IMG.avatar.sarah;
    return `
<div class="screen-header tnt-home-header">
    <div class="tnt-home-top">
        <button type="button" data-action="drawer" class="top-icon-btn" aria-label="Menu"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <button type="button" data-go="notifications-list" class="top-icon-btn relative" aria-label="Notifications">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            <span class="notif-badge">2</span>
        </button>
    </div>
    <div class="tnt-home-greeting">
        <img src="${av}" class="tnt-home-avatar" alt="">
        <div class="min-w-0">
            <p class="tnt-home-hi">Hi, ${typeof escapeHtml === 'function' ? escapeHtml(t.firstName) : t.firstName}! 👋</p>
            <p class="tnt-home-hi-sub">${typeof escapeHtml === 'function' ? escapeHtml(unitLabel) : unitLabel}</p>
        </div>
    </div>
</div>`;
}

function screenTenantDashboard() {
    const t = getActiveTenant();
    if (!t) {
        return `${topBar('Tenant Portal', { hideBell: true })}
        <div class="screen-content screen-enter">
            <div class="card p-8 text-center">
                <i data-lucide="mail" class="w-12 h-12 text-[#16A34A] mx-auto"></i>
                <p class="text-[14px] font-bold text-[#0F172A] mt-4">Invitation Required</p>
                <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">Tenant accounts are created by your landlord. Open the invitation link from your email to activate your account.</p>
            </div>
        </div>`;
    }
    const p = PROPERTIES[t.propertyId];
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : null;
    const rentDue = pay?.balance !== '£0.00';
    const maintDue = pay?.maintBalance && pay.maintBalance !== '£0.00';
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const leaseLabel = t.leaseEnd || '—';
    const attention = typeof tenantHomeAttentionItems === 'function' ? tenantHomeAttentionItems(t, pay, tid) : [];
    const openIssueCount = typeof tenantMaintenanceForAccount === 'function'
        ? tenantMaintenanceForAccount(t).filter(m => m.status !== 'done').length
        : 0;

    return `${tenantDashboardHeader(t, p)}
    <div class="screen-content screen-enter tnt-home-page">
        <div class="tnt-rent-card card">
            <div class="tnt-rent-card-head">
                <p class="tnt-rent-label">Next rent due</p>
                <span class="tnt-rent-badge ${rentDue ? 'tnt-rent-badge--due' : 'tnt-rent-badge--ok'}">${rentDue ? 'Pending' : 'Paid'}</span>
            </div>
            <p class="tnt-rent-amount">${rentDue ? pay.balance : (t.rent ? `£${String(t.rent).replace(/^£/, '')}` : '—')}</p>
            <p class="tnt-rent-meta"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${pay?.nextDue || 'Due Apr 1, 2026'}</p>
            ${rentDue
                ? `<button type="button" data-action="tenant-pay" data-kind="rent" data-iid="${pay?.rentInvoiceId ?? ''}" class="tnt-pay-btn">Pay rent with Stripe</button>`
                : `<p class="tnt-rent-paid-note">Rent for this month is up to date.</p>`}
        </div>

        ${maintDue ? `
        <div class="tnt-maint-bill card">
            <div class="tnt-rent-card-head">
                <p class="tnt-rent-label">Bill due</p>
                <span class="tnt-rent-badge tnt-rent-badge--due">Due</span>
            </div>
            <p class="tnt-rent-amount tnt-rent-amount--sm">${pay.maintBalance}</p>
            <p class="tnt-rent-meta">${pay.nextMaintDue || 'Maintenance or utility charge'}</p>
            <button type="button" data-action="tenant-pay" data-kind="maintenance" data-iid="${pay?.maintInvoiceId ?? ''}" class="btn-secondary w-full py-3 text-[13px] mt-3">Pay with Stripe</button>
        </div>` : ''}

        <button type="button" data-go="tenant-active-tenancy" class="tnt-tenancy-strip card w-full text-left">
            <span class="tnt-tenancy-strip-icon"><i data-lucide="home" class="w-5 h-5"></i></span>
            <span class="min-w-0 flex-1">
                <p class="tnt-tenancy-strip-label">Active tenancy</p>
                <p class="tnt-tenancy-strip-title">${esc(p?.name || '—')} · ${esc(t.unit || '—')}</p>
                <p class="tnt-tenancy-strip-meta">Lease ends ${esc(leaseLabel)}</p>
            </span>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#94A3B8] shrink-0"></i>
        </button>

        <div class="tnt-section-head">
            <p class="tnt-section-title" style="margin:0">Needs attention</p>
            ${attention.length ? `<button type="button" data-go="tenant-issues" class="tnt-link">See all</button>` : ''}
        </div>
        ${attention.length ? `<div class="tnt-attention-list stack-sm">${attention.map(item => `
        <button type="button" data-go="${item.go}" ${item.opts?.maintId != null ? `data-mid="${item.opts.maintId}"` : ''}${item.opts?.tenantPayFilter ? ` data-tenant-pay-preset="${item.opts.tenantPayFilter}"` : ''} class="tnt-attention-row card w-full text-left">
            <span class="tnt-attention-icon" style="background:${item.bg};color:${item.color}"><i data-lucide="${item.icon}" class="w-4 h-4"></i></span>
            <span class="min-w-0 flex-1">
                <p class="tnt-attention-title">${esc(item.title)}</p>
                <p class="tnt-attention-sub">${esc(item.sub)}</p>
            </span>
            <span class="tnt-attention-cta">${item.cta}</span>
        </button>`).join('')}</div>` : `
        <div class="card p-5 tnt-caught-up">
            <i data-lucide="check-circle" class="w-8 h-8 text-[#16A34A] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2 text-center">You're all caught up</p>
            <p class="text-[12px] text-[#64748B] mt-1 text-center">No urgent tasks right now.</p>
        </div>`}

        <p class="tnt-section-title">Quick actions</p>
        <div class="tnt-quick-grid">
            ${[
                ['wrench', 'Report issue', 'log-maintenance', '#2563EB', '#EFF6FF'],
                ['clipboard-list', openIssueCount ? `${openIssueCount} open` : 'Issues', 'tenant-issues', '#7C3AED', '#F5F3FF'],
                ['folder-open', 'Documents', 'tenant-documents', '#059669', '#ECFDF5'],
                ['message-square', 'Messages', 'messages', '#D97706', '#FFFBEB'],
            ].map(([ic, label, go, color, bg]) => `
            <button type="button" data-go="${go}" class="tnt-quick-btn">
                <span class="tnt-quick-icon" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-5 h-5"></i></span>
                <span>${label}</span>
            </button>`).join('')}
        </div>
    </div>`;
}

function screenTenantBuildingInfo() {
    const t = getActiveTenant();
    if (!t) return `${topBar('Building', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Sign in as tenant to view building info.</p></div>`;
    const p = PROPERTIES[t.propertyId];
    const building = typeof getPropertyBuilding === 'function' ? getPropertyBuilding(t.propertyId) : {};
    const meta = typeof AppStore !== 'undefined' ? AppStore.meta(t.propertyId) : {};
    const info = meta?.info || {};
    const rows = [
        ['Address', p?.address || '—'],
        ['Your unit', t.unit || '—'],
        ['Building type', building.type || info.buildingType || 'Residential'],
        ['Floors', building.floors != null ? String(building.floors) : (info.floors || '—')],
        ['Total units', building.flatCount != null ? String(building.flatCount) : '—'],
        ['Year built', building.yearBuilt || info.yearBuilt || '—'],
        ['Parking', building.parking || info.parking || 'Street / permit'],
        ['Emergency contact', LANDLORD_USER.phone || '—'],
    ];
    return `${topBar('Your building', { back: true })}
    <div class="screen-content screen-content-sm screen-enter building-info-page">
        <div class="building-info-hero card p-4">
            <div class="building-info-thumb"><img src="${(p?.photos && p.photos[0]) || IMG.props[0]}" alt=""></div>
            <div class="mt-3">
                <p class="building-info-name">${typeof escapeHtml === 'function' ? escapeHtml(p?.name || '') : (p?.name || '')}</p>
                <p class="building-info-addr">${typeof escapeHtml === 'function' ? escapeHtml(p?.address || '') : (p?.address || '')}</p>
            </div>
        </div>
        <div class="card p-4">
            <div class="building-info-rows">
                ${rows.map(([label, value]) => `
                <div class="building-info-row${label === 'Address' ? ' building-info-row--address' : ''}">
                    <div class="building-info-row-left"><span class="building-info-row-label">${label}</span></div>
                    <span class="building-info-row-value">${typeof escapeHtml === 'function' ? escapeHtml(value) : value}</span>
                </div>`).join('')}
            </div>
        </div>
        ${info.notes ? `<div class="card p-4"><p class="text-[11px] font-bold text-[#64748B] uppercase">Building notes</p><p class="text-[13px] text-[#475569] mt-2 leading-relaxed">${typeof escapeHtml === 'function' ? escapeHtml(info.notes) : info.notes}</p></div>` : ''}
        <button type="button" data-go="tenant-house-rules" class="btn-secondary w-full py-3 text-[13px]">House rules & regulations</button>
    </div>`;
}

function screenTenantAnnouncements() {
    const t = getActiveTenant();
    if (typeof markBroadcastsReadForTenant === 'function') markBroadcastsReadForTenant(t);
    const items = typeof announcementsForTenant === 'function' ? announcementsForTenant(t) : [];
    const audienceLabel = (a) => {
        if (!a.units?.length || a.scope === 'all') return 'Building-wide';
        if (a.units.length === 1) return a.units[0];
        return `${a.units.length} flats`;
    };
    return `${topBar('Announcements', { back: true, sub: 'From your landlord' })}
    <div class="screen-content screen-enter stack-sm">
        <p class="text-[13px] text-[#64748B] mb-1">Notices from your landlord about your building or flat.</p>
        ${items.length ? items.map(a => `
        <div class="tnt-announce card">
            <div class="tnt-announce-head">
                <p class="tnt-announce-title">${typeof escapeHtml === 'function' ? escapeHtml(a.title) : a.title}</p>
                <span class="badge bg-[#F5F3FF] text-[#7C3AED]">${audienceLabel(a)}</span>
            </div>
            <p class="tnt-announce-body">${typeof escapeHtml === 'function' ? escapeHtml(a.body) : a.body}</p>
            <p class="tnt-announce-meta">${a.date} · ${typeof escapeHtml === 'function' ? escapeHtml(a.from) : a.from}</p>
        </div>`).join('') : `<div class="card p-8 text-center text-[13px] text-[#64748B]">No announcements yet. Your landlord will post building updates here.</div>`}
    </div>`;
}

function screenTenantHouseRules() {
    const t = getActiveTenant();
    const rules = typeof houseRulesForTenant === 'function' ? houseRulesForTenant(t) : [];
    return `${topBar('House rules', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Rules for your building — set by your landlord.</p>
        <div class="card p-4">
            <ul class="tnt-rules-list tnt-rules-list--full">
                ${rules.map((r, i) => `<li><span class="tnt-rule-num">${i + 1}</span>${typeof escapeHtml === 'function' ? escapeHtml(r) : r}</li>`).join('')}
            </ul>
        </div>
    </div>`;
}

function screenTenantPaymentHistory() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const kind = STATE.tenantPayFilter || 'rent';
    const rows = typeof tenantInvoicesByKind === 'function' ? tenantInvoicesByKind(tid, kind) : [];
    const tabs = [['rent', 'Rent'], ['maintenance', 'Bills']];
    const unpaid = rows.filter(i => i.status !== 'Paid');
    const paid = rows.filter(i => i.status === 'Paid');
    const dueTotal = unpaid.reduce((s, i) => s + (typeof parseRentAmount === 'function' ? parseRentAmount(i.amount) : 0), 0);
    const renderRow = inv => typeof renderTenantPaymentRow === 'function' ? renderTenantPaymentRow(inv) : '';
    const listBody = !rows.length ? `
        <div class="fin-empty">
            <div class="fin-empty-icon"><i data-lucide="receipt" class="w-6 h-6"></i></div>
            <p class="fin-empty-title">No ${kind === 'maintenance' ? 'bills' : 'rent payments'} yet</p>
            <p class="fin-empty-sub">${kind === 'maintenance' ? 'Maintenance and utility bills from your landlord will appear here.' : 'Your rent payment history will show here.'}</p>
        </div>` : `
        ${unpaid.length && dueTotal ? `
        <div class="fin-summary card">
            <p class="fin-summary-label">Amount due</p>
            <p class="fin-summary-amount">${typeof formatRentAmount === 'function' ? formatRentAmount(dueTotal) : `£${dueTotal}`}</p>
            <p class="fin-summary-hint">${unpaid.length} outstanding · tap a row to pay</p>
        </div>` : ''}
        ${unpaid.length ? `
        <p class="txn-section-label ${dueTotal ? 'txn-section-label--spaced' : ''}">Outstanding</p>
        <div class="txn-list">${unpaid.map(renderRow).join('')}</div>` : ''}
        ${paid.length ? `
        <p class="txn-section-label ${unpaid.length ? 'txn-section-label--spaced' : ''}">Paid</p>
        <div class="txn-list">${paid.map(renderRow).join('')}</div>` : ''}`;
    return `${topBar('Payment history', { back: true })}
    <div class="screen-content screen-enter txn-page">
        <div class="fin-segments txn-segments">
            ${tabs.map(([k, l]) => `
            <button type="button" data-tenant-pay-filter="${k}" class="fin-segment ${kind === k ? 'active' : ''}">
                <span class="fin-segment-label">${l}</span>
            </button>`).join('')}
        </div>
        ${listBody}
    </div>`;
}

function tenantPayBill(kind, invoiceId) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const id = invoiceId != null && invoiceId !== '' ? +invoiceId : null;
    let inv = id != null ? INVOICES.find(i => i.id === id) : null;
    if (!inv && typeof tenantInvoicesByKind === 'function') {
        inv = tenantInvoicesByKind(tid, kind).find(i => i.status !== 'Paid');
    }
    if (!inv) {
        toast('No outstanding bill found');
        return;
    }
    const payFn = typeof openStripeCheckout === 'function' ? openStripeCheckout : (opts) => {
        toast('Opening Stripe…');
        setTimeout(() => opts.onSuccess?.(), 700);
    };
    payFn({
        amount: inv.amount,
        label: kind === 'maintenance' ? 'Maintenance' : 'Rent',
        onSuccess: () => {
            inv.status = 'Paid';
            inv.paidOn = typeof formatEventDate === 'function' ? formatEventDate() : 'Today';
            inv.paymentMethod = 'Stripe';
            if (typeof markOveragePaidForInvoice === 'function') markOveragePaidForInvoice(inv);
            if (typeof syncTransactionsFromInvoices === 'function') syncTransactionsFromInvoices();
            if (typeof AppStore !== 'undefined') AppStore.save();
            toast(kind === 'maintenance' ? 'Bill paid — thank you!' : 'Rent paid — thank you!');
            render();
        },
    });
}

function screenTenantIssues() {
    const t = getActiveTenant();
    if (!t) return `${topBar('Maintenance')}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Sign in as tenant to view issues.</p></div>`;
    const issues = typeof tenantMaintenanceForAccount === 'function' ? tenantMaintenanceForAccount(t) : [];
    const openCount = issues.filter(m => m.status !== 'done').length;
    return `${topBar('Maintenance', { sub: `${openCount} open` })}
    <div class="screen-content screen-enter tnt-home-page">
        <div class="tnt-issues-head card p-4">
            <p class="tnt-issues-count">${openCount} open request${openCount === 1 ? '' : 's'}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Track status and message your landlord or assigned contractor.</p>
            <button type="button" data-go="log-maintenance" class="btn-primary w-full py-3 text-[13px] mt-3">Report new issue</button>
        </div>
        ${issues.length ? `<div class="stack-sm">${issues.map(m => typeof maintCard === 'function' ? maintCard(m, { hideProperty: true }) : '').join('')}</div>` : `
        <div class="card p-8 text-center">
            <i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No issues yet</p>
            <p class="text-[12px] text-[#64748B] mt-1">Report maintenance inside your flat — communal areas are handled by your landlord.</p>
        </div>`}
    </div>`;
}

function screenTenantDocuments() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const body = typeof renderTenantDocFolderBrowser === 'function'
        ? renderTenantDocFolderBrowser(tid)
        : (typeof getTenantDocuments === 'function' && getTenantDocuments(tid).length && typeof renderTenantDocThumbGrid === 'function'
            ? renderTenantDocThumbGrid(getTenantDocuments(tid), tid)
            : `<div class="card p-8 text-center text-[13px] text-[#64748B]">No documents shared yet.</div>`);
    return `${topBar('Documents', { back: true, sub: 'Shared with you' })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Lease, compliance certificates and files your landlord has shared — organised by folder.</p>
        ${body}
    </div>`;
}

function screenTenantReferencing() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const ref = typeof getTenantReferencing === 'function' ? getTenantReferencing(tid) : {};
    return `${topBar('Tenant referencing', { back: true, sub: 'Application & verification' })}
    <div class="screen-content screen-enter stack-sm">
        <p class="text-[13px] text-[#64748B]">Documents and details collected during your application. Upload missing items for landlord review.</p>
        ${(typeof TENANT_REF_SECTIONS !== 'undefined' ? TENANT_REF_SECTIONS : []).map(sec => {
            const data = ref[sec.key] || { status: 'missing' };
            const [label, bg, color] = typeof tenantRefStatusLabel === 'function' ? tenantRefStatusLabel(data.status) : ['Pending', '#FEF3C7', '#D97706'];
            return `
        <button type="button" data-go="tenant-ref-detail" data-ref-key="${sec.key}" class="tnt-ref-row card w-full text-left p-4">
            <span class="tnt-ref-icon"><i data-lucide="${sec.icon}" class="w-5 h-5"></i></span>
            <span class="min-w-0 flex-1">
                <p class="tnt-ref-title">${sec.label}</p>
                <p class="tnt-ref-hint">${sec.hint || ''}</p>
            </span>
            <span class="badge shrink-0" style="background:${bg};color:${color}">${label}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
        </button>`;
        }).join('')}
    </div>`;
}

function screenTenantRefDetail() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const key = STATE.tenantRefKey || 'passport';
    const sec = (typeof TENANT_REF_SECTIONS !== 'undefined' ? TENANT_REF_SECTIONS : []).find(s => s.key === key);
    const ref = typeof getTenantReferencing === 'function' ? getTenantReferencing(tid) : {};
    const data = ref[key] || { status: 'missing' };
    const title = sec?.label || 'Referencing';
    let body = '';
    if (sec?.type === 'upload') {
        body = `
        <div class="card p-4">
            <p class="text-[11px] font-bold text-[#64748B] uppercase">Status</p>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-1">${data.file || 'No file uploaded'}</p>
            ${data.date ? `<p class="text-[12px] text-[#64748B] mt-1">Uploaded ${data.date}</p>` : ''}
            ${data.shareCode ? `<p class="text-[12px] text-[#64748B] mt-2">Share code: <strong>${data.shareCode}</strong>${data.expiry ? ` · Valid until ${data.expiry}` : ''}</p>` : ''}
        </div>
        <button type="button" data-action="upload-tenant-ref" data-ref-key="${key}" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="upload" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${data.file ? 'Replace document' : 'Upload document'}</p>
            <p class="text-[11px] text-[#64748B] mt-1">${sec.hint || ''}</p>
        </button>`;
    } else if (key === 'employment') {
        body = `${typeof tenantFieldsCard === 'function' ? tenantFieldsCard([
            ['Employer', data.employer || '—'],
            ['Job title', data.role || '—'],
            ['Annual salary', data.salary || '—'],
            ['Start date', data.startDate || '—'],
            ['HR contact', data.contact || '—'],
        ]) : ''}`;
    } else if (key === 'previousLandlord') {
        body = `${typeof tenantFieldsCard === 'function' ? tenantFieldsCard([
            ['Name', data.name || '—'],
            ['Phone', data.phone || '—'],
            ['Email', data.email || '—'],
            ['Property address', data.address || '—'],
            ['Tenancy dates', data.tenancyDates || '—'],
        ]) : ''}`;
    } else if (key === 'guarantor') {
        body = data.status === 'not_required' ? `<div class="card p-5 text-center text-[13px] text-[#64748B]">No guarantor required for your tenancy.</div>` : `${typeof tenantFieldsCard === 'function' ? tenantFieldsCard([
            ['Name', data.name || '—'],
            ['Phone', data.phone || '—'],
            ['Email', data.email || '—'],
            ['Relationship', data.relationship || '—'],
        ]) : ''}`;
    }
    return `${topBar(title, { back: true })}
    <div class="screen-content screen-content-sm screen-enter stack-sm">${body}</div>`;
}

function screenTenantActiveTenancy() {
    const t = getActiveTenant();
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t?.id;
    const listItem = TENANT_LIST[tid];
    const p = PROPERTIES[t?.propertyId];
    const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(tid) : null;
    const tenancy = typeof getTenancyForUnit === 'function' ? getTenancyForUnit(t?.propertyId, t?.unit) : null;
    return `${topBar('Active tenancy', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        ${typeof renderTenantLivingCard === 'function' && listItem ? renderTenantLivingCard(listItem) : ''}
        ${typeof tenantFieldsCard === 'function' ? tenantFieldsCard([
            ['Tenancy type', tenancy?.type === 'group' ? 'Group' : 'Solo'],
            ['Monthly rent', fin?.rent || t?.rent || '—'],
            ['Deposit held', fin?.deposit || '—'],
            ['Advance paid', fin?.advancePaid || '—'],
            ['Move-in', fin?.moveIn || t?.moveIn || '—'],
            ['Lease ends', fin?.leaseEnd || t?.leaseEnd || '—'],
            ['Property', p?.name || '—'],
            ['Unit', t?.unit || '—'],
        ]) : ''}
        <div class="grid grid-cols-2 gap-3">
            <button type="button" data-go="tenant-building-info" class="btn-secondary py-3 text-[13px]">Building info</button>
            <button type="button" data-go="tenant-house-rules" class="btn-secondary py-3 text-[13px]">House rules</button>
            <button type="button" data-go="tenant-compliance" class="btn-secondary py-3 text-[13px]">Compliance</button>
            <button type="button" data-go="tenant-reminders" class="btn-secondary py-3 text-[13px]">Reminders</button>
            <button type="button" data-go="tenant-documents" class="btn-secondary py-3 text-[13px]">Documents</button>
            <button type="button" data-go="tenant-announcements" class="btn-secondary py-3 text-[13px]">Announcements</button>
        </div>
        ${typeof renderTenantAccountMembers === 'function' ? renderTenantAccountMembers(tid) : ''}
        ${typeof renderTenantAccountContractors === 'function' ? renderTenantAccountContractors(t) : ''}
    </div>`;
}

function screenTenantContact() {
    const t = getActiveTenant();
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t?.id;
    const chatId = typeof getActiveTenantLandlordChatId === 'function' ? getActiveTenantLandlordChatId() : null;
    return `${topBar('Contact details', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        ${typeof tenantFieldsCard === 'function' ? tenantFieldsCard([
            ['Phone', t?.phone || '—'],
            ['Email', t?.email || '—'],
            ['Emergency contact', t?.emergency || TENANTS[tid]?.emergency || '—'],
            ['Emergency phone', t?.emergencyPhone || TENANTS[tid]?.emergencyPhone || '—'],
        ]) : ''}
        <button type="button" data-go="tenant-edit-profile" class="btn-secondary w-full py-3 text-[13px]">Edit personal details</button>
        ${chatId != null ? `<button type="button" data-go="chat" data-chat="${chatId}" class="btn-primary w-full py-3 text-[13px]">Message landlord</button>` : ''}
    </div>`;
}

function screenTenantReminders() {
    const t = getActiveTenant();
    const rows = typeof tenantSmartReminders === 'function' ? tenantSmartReminders(t) : [];
    return `${topBar('Reminders', { back: true, sub: 'For your home' })}
    <div class="screen-content screen-enter stack-sm">
        ${rows.length ? rows.map(r => {
            const urg = r.urgency === 'high' ? ['#FEE2E2', '#DC2626'] : r.urgency === 'medium' ? ['#FEF3C7', '#D97706'] : ['#EFF6FF', '#2563EB'];
            return `
        <div class="tnt-reminder card p-4">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-[13px] font-bold text-[#0F172A]">${typeof escapeHtml === 'function' ? escapeHtml(r.title) : r.title}</p>
                    <p class="text-[12px] text-[#64748B] mt-1">Due ${r.due || '—'}</p>
                </div>
                <span class="badge shrink-0" style="background:${urg[0]};color:${urg[1]}">${r.urgency === 'high' ? 'Urgent' : r.urgency === 'medium' ? 'Soon' : 'Upcoming'}</span>
            </div>
        </div>`;
        }).join('') : `<div class="card p-8 text-center text-[13px] text-[#64748B]">No reminders right now.</div>`}
    </div>`;
}

function screenTenantCompliance() {
    const t = getActiveTenant();
    const rows = typeof tenantComplianceForTenant === 'function' ? tenantComplianceForTenant(t) : [];
    return `${topBar('Compliance', { back: true, sub: 'Your building' })}
    <div class="screen-content screen-enter stack-sm">
        <p class="text-[13px] text-[#64748B]">Safety certificates for your property. Your landlord is responsible for keeping these up to date.</p>
        ${rows.map(r => {
            const ok = r.status === 'valid';
            return `
        <div class="card p-4">
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                    <span class="tnt-compliance-icon"><i data-lucide="${r.icon}" class="w-5 h-5"></i></span>
                    <div class="min-w-0">
                        <p class="text-[13px] font-bold text-[#0F172A]">${r.name}</p>
                        <p class="text-[11px] text-[#64748B] mt-0.5">${r.certNumber} · ${r.issuedBy}</p>
                    </div>
                </div>
                <span class="badge shrink-0" style="background:${ok ? '#ECFDF5' : '#FEE2E2'};color:${ok ? '#059669' : '#DC2626'}">${ok ? 'Valid' : 'Action needed'}</span>
            </div>
            <p class="text-[12px] text-[#64748B] mt-2">Expires ${r.expiry}</p>
        </div>`;
        }).join('')}
        <button type="button" data-go="tenant-documents" class="btn-secondary w-full py-3 text-[13px]">View certificate documents</button>
    </div>`;
}

function screenTenantCommunication() {
    const t = getActiveTenant();
    const rows = typeof tenantCommunicationHistory === 'function' ? tenantCommunicationHistory(t) : [];
    return `${topBar('Communication', { back: true, sub: 'Messages & updates' })}
    <div class="screen-content screen-enter">
        ${rows.length ? rows.map(r => `
        <button type="button" data-go="${r.go}" ${r.opts?.chatId != null ? `data-chat="${r.opts.chatId}"` : ''} ${r.opts?.maintId != null ? `data-mid="${r.opts.maintId}"` : ''} class="tnt-activity-row card w-full text-left p-3 mb-2">
            <span class="tnt-activity-icon" style="background:${r.bg};color:${r.color}"><i data-lucide="${r.icon}" class="w-4 h-4"></i></span>
            <div class="min-w-0 flex-1">
                <p class="tnt-activity-title">${typeof escapeHtml === 'function' ? escapeHtml(r.title) : r.title}</p>
                <p class="tnt-activity-sub">${typeof escapeHtml === 'function' ? escapeHtml(r.sub) : r.sub}</p>
            </div>
            ${r.time ? `<span class="tnt-activity-time">${r.time}</span>` : ''}
        </button>`).join('') : `<div class="card p-8 text-center text-[13px] text-[#64748B]">No communication history yet.</div>`}
        <button type="button" data-go="messages" class="btn-primary w-full py-3 text-[13px] mt-2">Open messages</button>
    </div>`;
}

function screenTenantCheckout() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const co = typeof getTenantCheckout === 'function' ? getTenantCheckout(tid) : {};
    const checklist = co.checklist || {};
    const done = Object.values(checklist).filter(Boolean).length;
    return `${topBar('Check-out', { back: true, sub: 'End of tenancy' })}
    <div class="screen-content screen-enter stack-sm">
        <div class="card p-4 tnt-deposit-card">
            <p class="text-[11px] font-bold text-[#64748B] uppercase">Deposit status</p>
            <p class="text-[18px] font-bold text-[#0F172A] mt-1">${co.depositAmount || '—'}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${co.depositScheme || 'Deposit scheme'} · ${co.depositStatus === 'protected' ? 'Protected' : 'Pending'}</p>
        </div>
        <p class="section-title">Cleaning checklist</p>
        <p class="section-hint">${done}/${(typeof TENANT_CHECKOUT_CHECKLIST !== 'undefined' ? TENANT_CHECKOUT_CHECKLIST : []).length} completed</p>
        <div class="card p-4 stack-sm">
            ${(typeof TENANT_CHECKOUT_CHECKLIST !== 'undefined' ? TENANT_CHECKOUT_CHECKLIST : []).map(([key, label]) => `
            <label class="tnt-checkout-row">
                <input type="checkbox" data-action="toggle-checkout-item" data-key="${key}" ${checklist[key] ? 'checked' : ''}>
                <span>${label}</span>
            </label>`).join('')}
        </div>
        <p class="section-title">Final meter readings</p>
        ${typeof formFieldReq === 'function' ? formFieldReq('Electricity', 'co_meter_electricity', co.meters?.electricity || '', 'text') : ''}
        ${typeof formFieldReq === 'function' ? formFieldReq('Gas', 'co_meter_gas', co.meters?.gas || '', 'text') : ''}
        ${typeof formFieldReq === 'function' ? formFieldReq('Water', 'co_meter_water', co.meters?.water || '', 'text') : ''}
        <button type="button" data-action="save-checkout-meters" class="btn-secondary w-full py-3 text-[13px]">Save meter readings</button>
        <p class="section-title">Final photos</p>
        ${typeof renderPhotoPreviewStrip === 'function' ? renderPhotoPreviewStrip(co.photos || [], { removable: false }) : ''}
        <div class="grid grid-cols-2 gap-3">
            <button type="button" data-action="upload-photo" class="btn-secondary py-3 text-[12px]">Upload photos</button>
            <button type="button" data-action="upload-video" class="btn-secondary py-3 text-[12px]">Upload videos</button>
        </div>
        <button type="button" data-action="submit-tenant-checkout" class="btn-primary w-full py-3.5 text-[14px] mt-2">Submit check-out to landlord</button>
    </div>`;
}

function screenTenantAccountFallback() {
    return `${topBar('Account')}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Loading account…</p></div>`;
}

function screenTenantAccount() {
    const t = getActiveTenant();
    if (!t) {
        return `${topBar('Profile', { hideBell: true })}
        <div class="screen-content screen-content-sm screen-enter profile-page">
            <p class="text-[14px] text-[#64748B]">Activate your account via invitation link to view profile.</p>
        </div>`;
    }
    const p = PROPERTIES[t.propertyId];
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const av = typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tid) : IMG.avatar.sarah;
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const propLabel = (p?.name || 'Your home').split(',')[0];
    const unitMeta = `${propLabel} · ${t.unit || '—'}`;
    const docCount = typeof getTenantDocuments === 'function' ? getTenantDocuments(tid).length : 0;
    const openIssues = typeof tenantMaintenanceForAccount === 'function'
        ? tenantMaintenanceForAccount(t).filter(m => m.status !== 'done').length
        : 0;
    const ref = typeof getTenantReferencing === 'function' ? getTenantReferencing(tid) : {};
    const refDone = Object.values(ref).filter(r => ['verified', 'complete', 'not_required'].includes(r?.status)).length;
    const refTotal = typeof TENANT_REF_SECTIONS !== 'undefined' ? TENANT_REF_SECTIONS.length : 7;
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : null;
    const landlordName = typeof LANDLORD_USER !== 'undefined' ? `${LANDLORD_USER.firstName} ${LANDLORD_USER.lastName}` : 'Your landlord';

    const tenancyMenus = menuList([
        ['home', 'Active tenancy', 'tenant-active-tenancy', unitMeta],
        ['phone', 'Contact information', 'tenant-contact', t.phone || '—'],
        ['clipboard-check', 'Tenant referencing', 'tenant-referencing', `${refDone}/${refTotal} complete`],
        ['folder-open', 'Documents', 'tenant-documents', docCount ? `${docCount} files` : 'View shared files'],
        ['log-out', 'Check-out', 'tenant-checkout', `Deposit ${pay?.deposit || '—'}`],
    ]);
    const maintenanceMenus = menuList([
        ['wrench', 'Maintenance requests', 'tenant-issues', openIssues ? `${openIssues} open` : 'No open issues'],
        ['message-square', 'Your landlord', 'messages', landlordName],
    ]);
    const accountMenus = menuList([
        ['bell', 'Notification settings', 'notifications-settings'],
        ['key-round', 'Change password', 'password'],
        ['shield-check', 'Security', 'security'],
        ['receipt', 'Payment history', 'transaction-history', pay?.nextDue ? `Next ${(pay.nextDue.split('·').pop() || '').trim()}` : ''],
        ['megaphone', 'Announcements', 'tenant-announcements'],
    ]);
    const supportMenus = menuList([
        ['circle-help', 'FAQ', 'faq'],
        ['help-circle', 'Help & Support', 'help-support'],
        ['info', 'About Landlord HQ', 'about'],
        ['shield', 'Privacy Policy', 'privacy'],
        ['file-text', 'Terms & Conditions', 'terms'],
    ]);

    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-content-sm screen-enter profile-page">
        <button type="button" data-go="tenant-edit-profile" class="profile-card">
            <img src="${av}" class="profile-card-avatar" alt="">
            <div class="profile-card-body">
                <p class="profile-card-name">${esc(`${t.firstName} ${t.lastName}`)}</p>
                <p class="profile-card-email">${esc(t.email)}</p>
            </div>
            <span class="profile-card-plan">${esc(t.unit || 'Tenant')}</span>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>
        <div class="profile-section">
            <p class="section-title">Your tenancy</p>
            <p class="section-hint">Flat, documents and end-of-lease tasks.</p>
            ${tenancyMenus}
        </div>
        <div class="profile-section">
            <p class="section-title">Maintenance & landlord</p>
            <p class="section-hint">Report issues and message your landlord.</p>
            ${maintenanceMenus}
        </div>
        <div class="profile-section">
            <p class="section-title">Your account</p>
            <p class="section-hint">Sign-in, payments and notifications.</p>
            ${accountMenus}
        </div>
        <div class="profile-section">
            <p class="section-title">Support & legal</p>
            <p class="section-hint">Help centre and platform policies.</p>
            ${supportMenus}
        </div>
        <button data-action="logout" class="profile-logout">Log Out</button>
        <p class="profile-version">Tenant portal · Demo build</p>
    </div>`;
}

function screenTenantEditProfile() {
    const t = getActiveTenant();
    if (!t) {
        return `${topBar('Edit profile', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">No active tenant account.</p></div>`;
    }
    return `${topBar('Personal Information', { back: true })}
    <div class="screen-content screen-content-sm screen-enter">
        <div class="flex justify-center mb-2">
            <div class="relative"><img src="${IMG.avatar.sarah}" class="w-20 h-20 rounded-2xl object-cover" alt="">
            <button type="button" data-action="toast" data-msg="Profile photo updated" class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center"><i data-lucide="camera" class="w-4 h-4 text-white"></i></button></div>
        </div>
        <p class="text-[13px] text-[#64748B] mb-3">Property and unit are managed by your landlord.</p>
        ${formField('First Name', t.firstName, 'text', '', 'firstName')}
        ${formField('Last Name', t.lastName, 'text', '', 'lastName')}
        ${formField('Email', t.email, 'email', '', 'email')}
        ${formField('Phone', t.phone || '', 'tel', '', 'phone')}
        ${saveBtn('Save Changes', 'Profile updated')}
        <button type="button" data-action="back" class="btn-secondary w-full py-3 text-[13px] mt-2">Cancel</button>
    </div>`;
}

function screenContractorInviteLandlord() {
    return `${topBar('Invite landlord', { back: true })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-4">Invite a landlord to connect with you on Landlord HQ. They can assign you maintenance jobs directly.</p>
        ${formFieldReq('Landlord name', 'invite_landlord_name', '', 'text', 'e.g. John Smith')}
        ${formFieldReq('Email', 'invite_landlord_email', '', 'email', 'landlord@email.com')}
        <button type="button" data-action="send-landlord-invite" class="btn-primary w-full py-3.5 text-[14px]">Send invite</button>
    </div>`;
}

function sendLandlordInvite() {
    const name = fieldVal('invite_landlord_name')?.trim();
    const email = fieldVal('invite_landlord_email')?.trim();
    if (!name || !email) { toast('Name and email required'); return; }
    if (!AppStore.landlordInvites) AppStore.landlordInvites = [];
    const invite = {
        id: AppStore.nextId(AppStore.landlordInvites),
        name, email, status: 'pending', sentAt: 'Just now',
        link: `https://landlordhq.app/landlord-invite?email=${encodeURIComponent(email)}`,
    };
    AppStore.landlordInvites.unshift(invite);
    STATE.lastLandlordInviteId = invite.id;
    AppStore.save();
    go('contractor-landlord-invite-sent');
}

function screenContractorLandlordInviteSent() {
    const invite = (AppStore.landlordInvites || []).find(i => i.id === STATE.lastLandlordInviteId);
    if (!invite) {
        return `${topBar('Invite sent', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Invitation not found.</p></div>`;
    }
    return `${topBar('Invite sent', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-6 text-center">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <p class="text-[14px] font-bold text-[#0F172A] mt-4">Invitation sent!</p>
            <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">We emailed <strong>${invite.email}</strong> to connect with you on Landlord HQ.</p>
        </div>
        <div class="card p-4">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Invite link</p>
            <p class="text-[12px] text-[#2563EB] mt-2 break-all">${invite.link}</p>
            <button type="button" data-action="copy-landlord-invite-link" class="btn-secondary w-full py-3 text-[13px] mt-3">Copy link</button>
        </div>
        <button type="button" data-go="contractor-landlords" class="btn-primary w-full py-3.5 text-[14px]">Back to landlords</button>
    </div>`;
}

function copyLandlordInviteLink() {
    const invite = (AppStore.landlordInvites || []).find(i => i.id === STATE.lastLandlordInviteId);
    if (!invite?.link) return;
    navigator.clipboard?.writeText(invite.link).then(() => toast('Link copied')).catch(() => toast(invite.link));
}

function contractorLandlordRows() {
    const map = new Map();
    CONTRACTOR_JOBS.forEach(j => {
        const key = j.landlord || 'Unknown';
        if (!map.has(key)) {
            map.set(key, { name: key, jobs: 0, active: 0, properties: new Set() });
        }
        const row = map.get(key);
        row.jobs += 1;
        if (['assigned', 'accepted', 'scheduled', 'in_progress', 'waiting_approval', 'approved'].includes(j.status)) row.active += 1;
        if (j.property) row.properties.add(j.property);
    });
    return [...map.values()].map(r => ({ ...r, properties: [...r.properties] }));
}

function screenContractorLandlords() {
    const landlords = contractorLandlordRows();
    return `${topBar('Landlords', { sub: `${landlords.length} connected` })}
    <div class="screen-content screen-enter">
        <button type="button" data-go="contractor-invite-landlord" class="btn-primary w-full py-3 text-[13px] mb-3 flex items-center justify-center gap-2">
            <i data-lucide="user-plus" class="w-4 h-4"></i>Invite landlord
        </button>
        ${landlords.length ? landlords.map(l => `
        <div class="card p-4 mb-2">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-[14px] font-bold text-[#0F172A]">${l.name}</p>
                    <p class="text-[12px] text-[#64748B] mt-1">${l.properties.length} propert${l.properties.length === 1 ? 'y' : 'ies'} · ${l.jobs} job${l.jobs === 1 ? '' : 's'}</p>
                </div>
                ${l.active ? `<span class="badge" style="background:#DBEAFE;color:#2563EB">${l.active} active</span>` : ''}
            </div>
            <button type="button" data-go="chat" data-chat="${typeof getLandlordChatId === 'function' ? getLandlordChatId() : 1}" class="btn-secondary w-full py-2.5 text-[13px] mt-3">Message</button>
        </div>`).join('') : `
        <div class="card p-8 text-center">
            <p class="text-[14px] font-semibold text-[#0F172A]">No landlords yet</p>
            <p class="text-[12px] text-[#64748B] mt-1">Invite a landlord or wait for job assignments.</p>
        </div>`}
    </div>`;
}

function screenContractorDashboard() {
    const assigned = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
    const today = CONTRACTOR_JOBS.filter(j => j.visitDate.startsWith('Today')).length;
    const active = CONTRACTOR_JOBS.filter(j => ['accepted', 'scheduled', 'in_progress'].includes(j.status)).length;
    const completed = CONTRACTOR_JOBS.filter(j => ['completed', 'paid', 'waiting_approval'].includes(j.status)).length;
    const upcoming = CONTRACTOR_JOBS.filter(j => ['assigned', 'accepted', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 3);
    return `${contractorDashboardHeader('Mike Thompson', 'Plumber Pro Ltd')}
    <div class="screen-content screen-enter">
        ${assigned ? `
        <button type="button" data-go="contractor-jobs" data-contractor-filter="assigned" class="fin-alert" style="background:#FFFBEB;border-color:#FDE68A;color:#92400E">
            <span class="fin-alert-icon" style="background:#FEF3C7;color:#D97706"><i data-lucide="briefcase" class="w-5 h-5"></i></span>
            <span class="fin-alert-text"><strong>${assigned} new job${assigned > 1 ? 's' : ''}</strong> — tap to accept</span>
            <i data-lucide="chevron-right" class="w-5 h-5 fin-alert-chevron"></i>
        </button>` : ''}
        <div class="ctr-stat-grid">
            ${[
                ['briefcase', 'New Jobs', assigned, 'issues'],
                ['calendar', "Today's Visits", today, 'vacant'],
                ['clock', 'Active', active, 'collected'],
                ['check-circle', 'Done', completed, 'compliant'],
            ].map(([ic, label, val, variant]) => dashStatCard({
                go: 'contractor-jobs', variant, icon: ic, label, value: val, pill: null,
            })).join('')}
        </div>
        <div class="dash-section-head" style="margin-top:4px">
            <div><h3 class="screen-section-title">Your Jobs</h3><p class="dash-section-sub">${upcoming.length} need your attention</p></div>
            <button data-go="contractor-jobs" class="dash-view-all">View all</button>
        </div>
        <div class="stack-sm">${upcoming.length ? upcoming.map(j => contractorJobCard(j)).join('') : `<p class="text-[14px] text-[#64748B] px-1">No active jobs right now</p>`}</div>
        <div class="dash-section-head">
            <h3 class="screen-section-title">Quick Actions</h3>
        </div>
        <div class="dash-quick">
            ${[
                ['briefcase', 'View Jobs', 'contractor-jobs', 'primary'],
                ['building-2', 'Landlords', 'contractor-landlords', 'indigo'],
                ['message-square', 'Messages', 'messages', 'success'],
                ['file-text', 'Invoices', 'contractor-jobs', 'warning'],
            ].map(([ic, label, go, tone]) => `
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                <span>${label}</span>
            </button>`).join('')}
        </div>
    </div>`;
}

function contractorDashboardHeader(name, sub) {
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <button data-go="contractor-notifications" class="top-icon-btn relative">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            <span class="notif-badge">2</span>
        </button>
    </div>
    <div class="dash-greeting-row">
        <img src="${IMG.avatar.plumber}" class="dash-avatar" alt="">
        <div>
            <p class="dash-greeting">${dashGreeting()}, ${name.split(' ')[0]}</p>
            <p class="dash-date">${sub}</p>
        </div>
    </div>
</div>`;
}

function screenContractorJobs() {
    const f = STATE.contractorJobFilter || 'all';
    const tabs = [
        ['all', 'All'], ['assigned', 'Assigned'], ['accepted', 'Accepted'],
        ['in_progress', 'In Progress'], ['completed', 'Completed'],
    ];
    const jobs = contractorFilterJobs();
    const landlords = [...new Set(CONTRACTOR_JOBS.map(j => j.landlord).filter(Boolean))];
    const properties = [...new Set(CONTRACTOR_JOBS.map(j => j.property).filter(Boolean))];
    const landlordF = STATE.contractorLandlordFilter || 'all';
    const propertyF = STATE.contractorPropertyFilter || 'all';
    const activeJob = jobs[0];
    return `${topBar('Jobs', { sub: `${jobs.length} shown` })}
    <div class="screen-content screen-enter ctr-jobs-screen">
        ${activeJob ? `
        <div class="card p-4 ctr-context-card">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">Current context</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${activeJob.landlord}</p>
            <p class="text-[12px] text-[#64748B]">${activeJob.property}${activeJob.unit ? ` · ${activeJob.unit}` : ''}</p>
        </div>` : ''}
        <div class="search-bar mb-2">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="contractorJobs" type="text" value="${STATE.search.contractorJobs || ''}" placeholder="Search jobs…" class="flex-1 text-[13px] bg-transparent border-none outline-none">
        </div>
        ${landlords.length > 1 ? `
        <p class="text-[11px] font-semibold text-[#64748B] mb-1">Landlord</p>
        <div class="ctr-jobs-filter-row mb-2">
            <button type="button" data-contractor-landlord-filter="all" class="ctr-jobs-filter ${landlordF === 'all' ? 'active' : ''}">All</button>
            ${landlords.map(l => `
            <button type="button" data-contractor-landlord-filter="${l.replace(/"/g, '')}" class="ctr-jobs-filter ${landlordF === l ? 'active' : ''}">${l.split(' ')[0]}</button>`).join('')}
        </div>` : ''}
        ${properties.length > 1 ? `
        <p class="text-[11px] font-semibold text-[#64748B] mb-1">Property</p>
        <div class="ctr-jobs-filter-row mb-2">
            <button type="button" data-contractor-property-filter="all" class="ctr-jobs-filter ${propertyF === 'all' ? 'active' : ''}">All</button>
            ${properties.slice(0, 4).map(p => `
            <button type="button" data-contractor-property-filter="${p.replace(/"/g, '')}" class="ctr-jobs-filter ${propertyF === p ? 'active' : ''}">${p.split(',')[0]}</button>`).join('')}
        </div>` : ''}
        <div class="ctr-jobs-filter-row">
            ${tabs.map(([k, l]) => `
            <button type="button" data-contractor-filter="${k}" class="ctr-jobs-filter ${f === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <div class="ctr-jobs-list">
            ${jobs.length ? jobs.map(j => contractorJobCard(j)).join('') : `
            <div class="card p-8 text-center ctr-jobs-empty">
                <i data-lucide="briefcase" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
                <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No jobs in this filter</p>
                <p class="text-[12px] text-[#64748B] mt-1">Try another tab or wait for new assignments.</p>
            </div>`}
        </div>
    </div>`;
}

function screenContractorJobDetail() {
    const job = contractorJob(STATE.contractorJobId);
    const st = contractorStatusStyle(job.status);
    const [pBg, pColor] = contractorPriorityStyle(job.priority);
    const tab = STATE.contractorJobTab || 'overview';
    const tabs = [['overview', 'Overview'], ['work', 'Work & Photos'], ['invoice', 'Invoice']];
    const canMessageTenant = job.tenant && job.tenant !== '—' && job.tenantChatId != null;
    const communal = contractorJobIsCommunal(job);
    const locationSub = contractorJobLocation(job);
    const actions = {
        assigned: `
            <div class="grid grid-cols-2 gap-3">
                <button data-contractor-action="accept" data-msg="Job accepted" class="btn-primary py-4 text-[13px] font-semibold">Accept Job</button>
                <button data-contractor-action="decline" data-msg="Job declined" class="btn-secondary py-4 text-[13px]">Decline</button>
            </div>`,
        accepted: `<button data-contractor-action="schedule" class="btn-primary w-full py-4 text-[13px] font-semibold">Schedule Visit</button>`,
        scheduled: `<button data-contractor-action="start" data-msg="Work started" class="btn-primary w-full py-4 text-[13px] font-semibold">Start Work</button>`,
        in_progress: `
            <button data-contractor-action="work" class="btn-primary w-full py-4 text-[13px] font-semibold">Add Photos & Notes</button>
            <button data-contractor-action="documents" class="btn-secondary w-full py-3.5 text-[14px] mt-3">Create invoice</button>
            ${!job.milestoneRequest ? `
            <div class="card p-4 mt-3">
                <p class="ctr-section-label">Request milestone payment</p>
                <div class="grid grid-cols-2 gap-2 mt-2">
                    <input type="text" data-field="milestone_amount" class="form-input" placeholder="Amount">
                    <input type="text" data-field="milestone_label" class="form-input" placeholder="e.g. Materials">
                </div>
                <button type="button" data-action="request-milestone" class="btn-secondary w-full py-3 text-[13px] mt-3">Request from landlord</button>
            </div>` : `<div class="card p-4 mt-3 text-center"><p class="text-[13px] font-semibold">Milestone ${job.milestoneRequest.amount}</p><p class="text-[12px] text-[#64748B]">${job.milestoneRequest.status}</p></div>`}`,
        waiting_approval: `<div class="card p-4 text-center" style="background:#F5F3FF"><p class="text-[14px] font-semibold text-[#7C3AED]">Awaiting landlord review</p><p class="text-[13px] text-[#64748B] mt-1">Invoice ${job.invoice?.amount || '—'} submitted for approval</p></div>`,
        approved: `<div class="card p-4 text-center" style="background:#ECFDF5"><p class="text-[14px] font-semibold text-[#059669]">Approved — awaiting payment</p><p class="text-[13px] text-[#64748B] mt-1">${job.invoice?.amount || '—'} will be paid via Stripe</p></div>`,
        completed: `<div class="card p-4 text-center" style="background:#ECFDF5"><p class="text-[14px] font-semibold text-[#059669]">Job completed — awaiting payment</p></div>`,
        paid: `<div class="card p-4 text-center" style="background:#ECFDF5"><p class="text-[14px] font-semibold text-[#059669]">Payment received</p></div>`,
    };
    const overview = `
        <div class="card p-4">
            <p class="ctr-section-label">Property</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${job.property}</p>
            <p class="text-[14px] text-[#64748B] mt-1">${job.address}</p>
            ${communal ? `
            <p class="ctr-section-label" style="margin-top:12px">Communal area</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${job.communalArea || 'Shared area'}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Shared part of this building — not inside a tenant flat.</p>` : job.unit ? `
            <p class="ctr-section-label" style="margin-top:12px">Unit within property</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${job.unit}</p>` : ''}
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">${communal ? 'Issue details' : 'Tenant complaint'}</p>
            <p class="text-[14px] text-[#475569] mt-2 leading-relaxed">${job.desc}</p>
            <div class="flex gap-2 mt-3 flex-wrap">
                ${communal
                    ? '<span class="badge" style="background:#E0E7FF;color:#4338CA">Communal job</span>'
                    : `<span class="badge bg-[#FEF3C7] text-[#B45309]">${job.reportedBy === 'landlord' ? 'From landlord' : 'From tenant'}</span>`}
                <span class="badge" style="background:${pBg};color:${pColor}">${job.priority} priority</span>
            </div>
            ${typeof renderMaintReportMedia === 'function' ? renderMaintReportMedia(job, { title: 'Photos & videos from report', compact: true }) : ''}
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">People</p>
            <p class="text-[13px] font-semibold mt-1">Tenant: ${job.tenant}</p>
            <p class="text-[14px] text-[#64748B] mt-1">Landlord: ${job.landlord}</p>
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">Visit</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${job.visitDate}</p>
            ${job.scheduleNotes ? `<p class="text-[13px] text-[#64748B] mt-2">${job.scheduleNotes}</p>` : ''}
        </div>
        <p class="ctr-section-label" style="margin-top:4px">Progress</p>
        ${contractorTimeline(job.status)}
        <div class="grid grid-cols-2 gap-3">
            <button data-go="chat" data-chat="${job.landlordChatId}" class="btn-secondary py-3.5 flex items-center justify-center gap-2 text-[14px]"><i data-lucide="message-square" class="w-4 h-4"></i>Message Landlord</button>
            ${canMessageTenant ? `<button data-go="chat" data-chat="${job.tenantChatId}" class="btn-secondary py-3.5 flex items-center justify-center gap-2 text-[14px]"><i data-lucide="user" class="w-4 h-4"></i>Message Tenant</button>` : `<button disabled class="btn-secondary py-3.5 text-[14px] opacity-50">No tenant</button>`}
        </div>
        ${job.groupChatId != null ? `
        <button data-go="chat" data-chat="${job.groupChatId}" class="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-[14px] mt-3"><i data-lucide="users" class="w-4 h-4"></i>Job group chat</button>` : ''}`;
    const work = `
        ${contractorNotesList(job.notes)}
        <div><label class="form-label">Add work note</label><textarea data-field="workNote" class="form-input min-h-[96px]" placeholder="What did you do? Parts used, findings..."></textarea></div>
        <button type="button" data-action="save-contractor-note" class="btn-secondary w-full py-3.5 text-[14px]">Save Note</button>
        ${contractorPhotoSection('before', job.photos.before, 'Before photos')}
        ${contractorPhotoSection('during', job.photos.during, 'During work photos')}
        ${contractorPhotoSection('after', job.photos.after, 'After photos')}`;
    const invoice = `
        <div class="card p-4">
            <p class="ctr-section-label">Certificates</p>
            ${job.certificates.length ? job.certificates.map(c => `
            <div class="ctr-cert-list-item card p-3 mb-2">
                <div class="ctr-cert-list-icon" style="background:#ECFDF5;color:#059669"><i data-lucide="file-check" class="w-5 h-5"></i></div>
                <div class="ctr-cert-list-body min-w-0">
                    <p class="ctr-cert-list-name">${escapeHtml(c.name)}</p>
                    <p class="ctr-cert-list-file"><i data-lucide="paperclip" class="w-3.5 h-3.5"></i>${escapeHtml(c.fileName || 'Document on file')}</p>
                    <p class="ctr-cert-list-meta">${escapeHtml(c.uploadedAt || '')}</p>
                </div>
            </div>`).join('') : `<p class="ctr-photo-empty">No certificates uploaded</p>`}
            <button type="button" data-contractor-upload="certificate" class="ctr-upload-btn mt-3"><i data-lucide="upload" class="w-4 h-4"></i> Upload certificate</button>
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">System invoice</p>
            <p class="text-[12px] text-[#64748B] mb-3">Enter details — the app generates a professional PDF invoice. No file upload needed.</p>
            ${job.invoice ? `
            <div class="card p-3 mb-3" style="background:#F8FAFC">
                <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                        <p class="text-[14px] font-bold">${job.invoice.amount}</p>
                        <p class="text-[13px] text-[#64748B]">${job.invoice.number || job.invoice.file} · ${job.invoice.uploadedAt}</p>
                        <p class="text-[12px] text-[#64748B] mt-1">${job.invoice.description || job.issue}</p>
                    </div>
                    <span class="badge" style="background:#DCFCE7;color:#16A34A">${job.invoice.status || 'Generated'}</span>
                </div>
                <button type="button" data-action="preview-contractor-invoice" class="btn-secondary w-full py-2.5 text-[13px] mt-3">Download PDF preview</button>
            </div>` : `
            ${formField('Amount (£)', '', 'number', '185', 'invoiceAmount')}
            ${formField('Description', job.issue, 'text', 'Work completed', 'invoiceDesc')}
            <div class="form-group"><label class="form-label">Notes (optional)</label>
            <textarea data-field="invoiceNotes" class="form-input" rows="2" placeholder="Parts, labour breakdown…"></textarea></div>
            <button type="button" data-action="generate-contractor-invoice" class="btn-primary w-full py-3 text-[13px] mt-2">Generate invoice</button>`}
        </div>
        ${['in_progress', 'scheduled', 'accepted'].includes(job.status) ? `
        <button type="button" data-action="mark-contractor-complete" class="btn-primary w-full py-4 text-[13px] font-semibold">Submit for approval</button>
        <p class="text-[12px] text-[#64748B] text-center mt-2">Photos optional · system invoice required</p>` : ''}`;
    const tabBody = { overview, work, invoice };
    return `${topBar(job.issue, { back: true, sub: locationSub })}
    <div class="screen-content screen-enter">
        <div class="flex gap-2 overflow-x-auto pb-1">
            ${tabs.map(([k, l]) => `
            <button data-jtab="${k}" class="tab-pill ${tab === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <div class="flex gap-2 flex-wrap mt-3">
            <span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
            <span class="badge" style="background:${pBg};color:${pColor}">${job.priority}</span>
            ${communal ? '<span class="badge" style="background:#E0E7FF;color:#4338CA">Communal</span>' : ''}
        </div>
        <div class="stack-sm" style="margin-top:12px">${tabBody[tab] || overview}</div>
        ${tab === 'overview' ? `<div style="margin-top:16px">${actions[job.status] || ''}</div>` : ''}
    </div>
    ${typeof renderContractorCertUploadModal === 'function' ? renderContractorCertUploadModal() : ''}
    ${typeof renderMaintMediaPreviewModal === 'function' ? renderMaintMediaPreviewModal() : ''}`;
}

function screenContractorSchedule() {
    const job = contractorJob(STATE.contractorJobId);
    return `${topBar(job.property, { back: true, sub: job.issue })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] text-[#64748B] mt-1">${job.address}</p>
            <p class="text-[13px] text-[#64748B] mt-2">Tenant: ${job.tenant}</p>
        </div>
        ${formField('Visit date', job.scheduledDate || '2025-03-14', 'date', '', 'visitDate')}
        ${formField('Visit time', job.scheduledTime || '11:30', 'time', '', 'visitTime')}
        ${formTextarea('Message for tenant', job.scheduleNotes, 'e.g. I will arrive between 11:30–12:00', 'scheduleNotes')}
        <button type="button" data-action="confirm-contractor-schedule" class="btn-primary w-full py-4 text-[13px] font-semibold">Confirm Visit</button>
    </div>`;
}

function screenContractorWork() {
    STATE.contractorJobTab = 'work';
    return screenContractorJobDetail();
}

function screenContractorDocuments() {
    STATE.contractorJobTab = 'invoice';
    return screenContractorJobDetail();
}

function screenContractorNotifications() {
    const unread = CONTRACTOR_NOTIFS.filter(n => n.unread);
    const read = CONTRACTOR_NOTIFS.filter(n => !n.unread);
    const section = (label, items) => items.length ? `
        <div class="notif-section">
            <p class="notif-section-label">${label}</p>
            <div class="notif-list">${items.map(n => `
            <button data-go="contractor-jobs" class="notif-row ${n.unread ? 'notif-unread' : ''}">
                <div class="notif-icon" style="background:${n.color[0]};color:${n.color[1]}"><i data-lucide="${n.icon}" class="w-[18px] h-[18px]"></i></div>
                <div class="notif-body"><p class="notif-title">${n.title}</p><p class="notif-desc">${n.desc}</p></div>
                <span class="notif-time">${n.time}</span>
            </button>`).join('')}</div>
        </div>` : '';
    return `${topBar('Notifications', { back: true })}
    <div class="screen-content screen-enter">
        ${section('Today', unread)}
        ${section('Earlier', read)}
    </div>`;
}

function screenContractorProfile() {
    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-enter">
        <button data-go="personal-info" class="profile-card">
            <img src="${IMG.avatar.plumber}" class="profile-card-avatar" alt="">
            <div class="profile-card-body">
                <p class="profile-card-name">${CONTRACTOR_USER.firstName} ${CONTRACTOR_USER.lastName}</p>
                <p class="profile-card-hint">${CONTRACTOR_USER.company || 'Contractor'}</p>
                <div class="profile-card-trade">${renderContractorTradeBadge(CONTRACTOR_USER, 'profile-card-trade-badge')}</div>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>
        ${menuList([
            ['building-2', 'Company Information', 'contractor-company'],
            ['award', 'Certifications', 'contractor-certifications', `${ensureContractorCertificates(CONTRACTOR_USER).length} on file`],
            ['bell', 'Alerts & Notifications', 'contractor-notifications'],
            ['key-round', 'Change Password', 'password'],
        ])}
        <p class="section-title">Support</p>
        ${menuList([
            ['help-circle', 'Help & Support', 'help-support'],
            ['shield', 'Privacy Policy', 'privacy'],
            ['file-text', 'Terms & Conditions', 'terms'],
            ['info', 'About', 'about'],
        ])}
        <button data-action="logout" class="w-full py-3 mt-4 text-[14px] font-semibold text-[#DC2626]">Log Out</button>
    </div>`;
}

function screenContractorCompany() {
    return `${topBar('Company Information', { back: true })}
    <div class="screen-content screen-enter">
        ${formField('Company Name', CONTRACTOR_USER.company || '')}
        ${formSelect('Contractor type', CONTRACTOR_USER.trade || CONTRACTOR_TRADES[0], CONTRACTOR_TRADES)}
        <div class="ctr-signup-trade-hint card p-3" style="margin-bottom:16px">
            <p class="ctr-signup-trade-hint-label">Category shown to landlords</p>
            <div class="flex flex-wrap gap-2 mt-2">${renderContractorTradeBadge(CONTRACTOR_USER)}</div>
            <p class="ctr-signup-trade-hint-text" style="margin-top:8px">For: ${contractorJobsForLabel(CONTRACTOR_USER)}</p>
        </div>
        ${formField('Company Reg. No.', CONTRACTOR_USER.companyReg || '')}
        ${formField('VAT Number', CONTRACTOR_USER.vatNumber || '')}
        ${formField('Phone', CONTRACTOR_USER.phone || '')}
        ${formField('Email', CONTRACTOR_USER.email || '')}
        <p class="section-title">Certifications</p>
        <p class="text-[12px] text-[#64748B] mb-3">Manage certificates and upload documents landlords and tenants can verify.</p>
        <button type="button" data-go="contractor-certifications" class="btn-secondary w-full py-3 text-[13px] mb-3">Manage certifications (${ensureContractorCertificates(CONTRACTOR_USER).length})</button>
        ${saveBtn('Save Changes', 'Company info updated')}
    </div>`;
}

/* Register contractor screens */
Object.assign(SCREEN_MAP, {
    'contractor-invite': screenContractorInvite,
    'contractor-sign-up': screenContractorSignUp,
    'contractor-welcome': screenContractorWelcome,
    'contractor-dashboard': screenContractorDashboard,
    'contractor-jobs': screenContractorJobs,
    'contractor-job-detail': screenContractorJobDetail,
    'contractor-schedule': screenContractorSchedule,
    'contractor-work': screenContractorWork,
    'contractor-documents': screenContractorDocuments,
    'contractor-notifications': screenContractorNotifications,
    'contractor-profile': screenContractorProfile,
    'contractor-company': screenContractorCompany,
    'contractor-certifications': screenContractorCertifications,
    'contractor-public-profile': screenContractorPublicProfile,
    'contractor-cert-preview': screenContractorCertPreview,
    'contractor-landlords': screenContractorLandlords,
    'contractor-invite-landlord': screenContractorInviteLandlord,
    'contractor-landlord-invite-sent': screenContractorLandlordInviteSent,
    'tenant-invite': screenTenantInvite,
    'tenant-activate': screenTenantActivate,
    'tenant-dashboard': screenTenantDashboard,
    'tenant-welcome': screenTenantWelcome,
    'tenant-building-info': screenTenantBuildingInfo,
    'tenant-announcements': screenTenantAnnouncements,
    'tenant-house-rules': screenTenantHouseRules,
    'tenant-edit-profile': screenTenantEditProfile,
    'tenant-issues': screenTenantIssues,
    'tenant-documents': screenTenantDocuments,
    'tenant-referencing': screenTenantReferencing,
    'tenant-ref-detail': screenTenantRefDetail,
    'tenant-active-tenancy': screenTenantActiveTenancy,
    'tenant-contact': screenTenantContact,
    'tenant-reminders': screenTenantReminders,
    'tenant-compliance': screenTenantCompliance,
    'tenant-communication': screenTenantCommunication,
    'tenant-checkout': screenTenantCheckout,
});

const CONTRACTOR_NO_NAV = [
    'contractor-job-detail', 'contractor-schedule', 'contractor-work', 'contractor-documents',
    'contractor-company', 'contractor-certifications', 'contractor-public-profile', 'contractor-cert-preview',
    'contractor-invite', 'contractor-sign-up', 'contractor-welcome',
    'contractor-landlords', 'contractor-invite-landlord', 'contractor-landlord-invite-sent',
    'tenant-invite', 'tenant-activate', 'tenant-welcome', 'tenant-dashboard',
    'tenant-building-info', 'tenant-announcements', 'tenant-house-rules', 'tenant-edit-profile',
    'tenant-issues', 'tenant-documents', 'tenant-referencing', 'tenant-ref-detail',
    'tenant-active-tenancy', 'tenant-contact', 'tenant-reminders', 'tenant-compliance',
    'tenant-communication', 'tenant-checkout',
];
NO_NAV.push(...CONTRACTOR_NO_NAV);

function bindContractorEvents() {
    const app = document.getElementById('app');
    app.querySelectorAll('[data-action="tenant-pay"]').forEach(el => {
        el.onclick = () => tenantPayBill(el.dataset.kind, el.dataset.iid);
    });
    app.querySelectorAll('[data-tenant-pay-filter]').forEach(el => {
        el.onclick = () => {
            STATE.tenantPayFilter = el.dataset.tenantPayFilter;
            render();
        };
    });
    app.querySelectorAll('[data-action="confirm-contractor-schedule"]').forEach(el => { el.onclick = confirmContractorSchedule; });
    app.querySelectorAll('[data-action="save-contractor-note"]').forEach(el => { el.onclick = saveContractorNote; });
    app.querySelectorAll('[data-action="mark-contractor-complete"]').forEach(el => { el.onclick = markContractorJobComplete; });
    app.querySelectorAll('[data-action="request-milestone"]').forEach(el => {
        el.onclick = () => {
            if (typeof requestContractorMilestone === 'function') requestContractorMilestone();
        };
    });
    app.querySelectorAll('[data-action="send-landlord-invite"]').forEach(el => { el.onclick = sendLandlordInvite; });
    app.querySelectorAll('[data-action="copy-landlord-invite-link"]').forEach(el => { el.onclick = copyLandlordInviteLink; });
    app.querySelectorAll('[data-contractor-upload]').forEach(el => {
        el.onclick = () => uploadContractorFile(el.dataset.contractorUpload);
    });
    app.querySelectorAll('[data-go="contractor-jobs"][data-contractor-filter]').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            STATE.contractorJobFilter = el.dataset.contractorFilter;
            go('contractor-jobs');
        };
    });
    app.querySelectorAll('[data-action="contractor-signup-next"]').forEach(el => { el.onclick = advanceContractorSignup; });
    app.querySelectorAll('[data-action="contractor-signup-back"]').forEach(el => {
        el.onclick = () => {
            captureContractorSignupDraft();
            if ((STATE.contractorSignupStep || 1) > 1) {
                STATE.contractorSignupStep -= 1;
                render();
            }
        };
    });
    app.querySelectorAll('[data-ctr-signup="trade"]').forEach(el => {
        el.onchange = () => {
            captureContractorSignupDraft();
            const hint = app.querySelector('.ctr-signup-trade-hint-text');
            if (hint) hint.textContent = contractorJobsForLabel(STATE.contractorSignupDraft);
        };
    });
    app.querySelectorAll('[data-action="open-contractor-cert-slot"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); openContractorCertSlot(el.dataset.certType); };
    });
    app.querySelectorAll('[data-action="replace-contractor-cert"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); openContractorCertSlot(el.dataset.certType, +el.dataset.cert); };
    });
    app.querySelectorAll('[data-action="pick-contractor-cert-file"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); pickContractorCertFileAction(); };
    });
    app.querySelectorAll('[data-action="save-contractor-cert"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); saveContractorCertUpload(); };
    });
    app.querySelectorAll('[data-action="close-contractor-cert-upload"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); closeContractorCertUpload(); };
    });
    app.querySelectorAll('[data-action="delete-contractor-cert"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); deleteContractorCert(+el.dataset.cert); };
    });
    app.querySelectorAll('[data-action="view-contractor-cert"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            if (el.dataset.contractorView) STATE.contractorViewId = +el.dataset.contractorView;
            if (!STATE.contractorViewId) {
                const entry = getContractorDirectoryEntry(CONTRACTOR_USER.email || CONTRACTOR_USER.company);
                if (entry) STATE.contractorViewId = entry.id;
            }
            STATE.contractorCertPreviewId = +el.dataset.cert;
            go('contractor-cert-preview');
        };
    });
    app.querySelectorAll('[data-action="view-contractor-profile"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            STATE.contractorProfileReturn = STATE.screen;
            STATE.contractorViewId = +el.dataset.cid;
            go('contractor-public-profile');
        };
    });
    app.querySelectorAll('[data-action="preview-maint-media"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof openMaintMediaPreview === 'function') openMaintMediaPreview(el);
        };
    });
    app.querySelectorAll('[data-action="close-maint-media-preview"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            if (typeof closeMaintMediaPreview === 'function') closeMaintMediaPreview();
        };
    });
}

const _ctrOrigBindEvents = bindEvents;
bindEvents = function() {
    _ctrOrigBindEvents();
    bindContractorEvents();
};

CONTRACTOR_JOBS.forEach(ensureContractorJob);
