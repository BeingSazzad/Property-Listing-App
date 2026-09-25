/* Contractor role — MVP flow */
const CONTRACTOR_BOTTOM_NAV = [
    ['layout-dashboard', 'Home', 'contractor-dashboard'],
    ['briefcase', 'Jobs', 'contractor-jobs'],
    ['message-square', 'Messages', 'messages'],
    ['user-round', 'Profile', 'contractor-profile'],
];

const CONTRACTOR_DRAWER_NAV = [
    ['building-2', 'Landlords', 'contractor-landlords'],
    ['bell', 'Notifications', 'contractor-notifications'],
    ['life-buoy', 'Help & Support', 'help-support'],
];

const CONTRACTOR_JOBS = [
    { id: 0, maintId: 0, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Kitchen sink leaking', priority: 'High', visitDate: 'Today, 4:30 PM', status: 'assigned', assignedDate: 'Mar 10, 2025', inactiveHours: 48, desc: 'Water dripping from pipe under kitchen sink. Tenant reports it started this morning. Access via front door — tenant will be home after 1 PM.', tenantChatId: 0, landlordChatId: 1, reportedBy: 'tenant', reportPhotos: [IMG.maint[0], IMG.maint[2]], reportVideos: [{ name: 'under-sink-leak.mp4', poster: IMG.maint[0], demo: true }] },
    { id: 1, maintId: 3, propertyId: 1, property: '45 Queens Road', address: 'London, SW2 3TR', tenant: 'David Wilson', landlord: 'John Smith', issue: 'Boiler not working', priority: 'High', visitDate: 'Tomorrow, 10:00 AM', status: 'accepted', assignedDate: 'Mar 8, 2025', desc: 'No hot water or heating. Boiler showing error code E119. Parking available on street.', tenantChatId: 2, landlordChatId: 1 },
    { id: 2, maintId: 1, propertyId: 2, property: '88 King Street', address: 'London, EC2V 8BB', tenant: '—', landlord: 'John Smith', issue: 'Window latch broken', priority: 'Medium', visitDate: 'Mar 14, 11:30 AM', status: 'scheduled', assignedDate: 'Mar 7, 2025', desc: 'Bedroom window latch broken — window cannot be secured. Room 2 currently vacant.', tenantChatId: null, landlordChatId: 1 },
    { id: 3, maintId: 4, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Radiator not heating', priority: 'Medium', visitDate: 'Mar 12, 3:00 PM', status: 'in_progress', assignedDate: 'Mar 5, 2025', desc: 'Living room radiator cold while others work. Possible air lock or valve issue.', tenantChatId: 4, landlordChatId: 1, notes: [{ text: 'Bleed radiator — still cold on return pipe', time: 'Mar 11, 2:30 PM' }], photos: { before: [IMG.maint[2]], during: [], after: [] } },
    { id: 4, maintId: 6, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Tap replacement', priority: 'Low', visitDate: 'Mar 1, 2025', status: 'waiting_approval', assignedDate: 'Feb 20, 2025', desc: 'Kitchen tap replaced. Invoice submitted awaiting landlord approval.', tenantChatId: 0, landlordChatId: 1, invoice: { amount: '£185', file: 'INV-PLB-1042.pdf', uploadedAt: 'Mar 1, 2025' } },
    { id: 5, maintId: 5, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Pipe valve replacement', priority: 'Low', visitDate: 'Feb 18, 2025', status: 'completed', assignedDate: 'Feb 10, 2025', desc: 'Living room radiator pipe valve replaced — resolved heating flow.', tenantChatId: 4, landlordChatId: 1 },
    { id: 6, maintId: null, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Annual gas check', priority: 'Low', visitDate: 'Jan 30, 2025', status: 'paid', assignedDate: 'Jan 15, 2025', desc: 'Annual gas safety inspection completed. Certificate uploaded.', tenantChatId: 4, landlordChatId: 1, certificates: [{ name: 'Gas Safety Certificate', uploadedAt: 'Jan 30, 2025' }] },
    { id: 7, maintId: 7, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', unit: 'Communal', scope: 'communal', communalArea: 'Hallway', tenant: '—', landlord: 'John Smith', issue: 'Hallway pipe leaking', priority: 'Medium', visitDate: 'Tomorrow, 11:30 AM', status: 'assigned', assignedDate: 'Mar 10, 2025', desc: 'Main entrance hallway pipe leaking onto floor. Landlord reports water dripping near entrance.', tenantChatId: null, landlordChatId: 1 },
];

const CONTRACTOR_NOTIFS = [
    { icon: 'briefcase', color: ['#FFEDD5', '#EA580C'], title: 'New job assigned', desc: 'Kitchen sink leaking — 12 Park Lane', time: '2h ago', unread: true },
    { icon: 'calendar', color: ['#EFF6FF', '#2563EB'], title: 'Visit reminder', desc: '45 Queens Road · Tomorrow 10:00 AM', time: '5h ago', unread: true },
    { icon: 'message-square', color: ['#EFF6FF', '#2563EB'], title: 'New message', desc: 'Sarah Johnson sent a message', time: '1d ago', unread: false },
    { icon: 'file-check', color: ['#ECFDF5', '#059669'], title: 'Invoice approved', desc: 'INV-2025-1042 · £185', time: '2d ago', unread: false },
    { icon: 'banknote', color: ['#ECFDF5', '#059669'], title: 'Payment received', desc: '£185 deposited to your account', time: '3d ago', unread: false },
];

const CONTRACTOR_STATUS = {
    assigned: { label: 'Assigned', bg: '#FFEDD5', color: '#C2410C' },
    accepted: { label: 'Accepted', bg: '#DBEAFE', color: '#1D4ED8' },
    scheduled: { label: 'Visit Scheduled', bg: '#DBEAFE', color: '#1D4ED8' },
    in_progress: { label: 'In Progress', bg: '#FEF3C7', color: '#D97706' },
    waiting_approval: { label: 'Awaiting Review', bg: '#EFF6FF', color: '#2563EB' },
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
                    ${communal ? '<span class="ctr-job-priority-badge" style="background:#DBEAFE;color:#1D4ED8">Communal</span>' : ''}
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
        const amount = document.querySelector('[data-field="invoiceAmount"]')?.value?.trim() || '185';
        const desc = document.querySelector('[data-field="invoiceDesc"]')?.value?.trim() || job.issue;
        const notes = document.querySelector('[data-field="invoiceNotes"]')?.value?.trim() || '';
        job.invoice = typeof generateContractorSystemInvoice === 'function'
            ? generateContractorSystemInvoice(job)
            : {
                amount: amount.startsWith('£') ? amount : `£${amount}`,
                description: desc,
                notes,
                file: `INV-${job.id + 100}.pdf`,
                uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            };
        if (!job.invoice) return;
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
    const note = document.querySelector('[data-field="workNote"]')?.value?.trim();
    if (note) {
        job.notes.push({ text: note, time: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) });
    }
    if (!job.invoice) {
        job.invoice = typeof generateContractorSystemInvoice === 'function' ? generateContractorSystemInvoice(job) : null;
    }
    if (!job.invoice) {
        toast('Add invoice details first');
        go('contractor-documents', { jobId: job.id });
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

let contractorFilterJobs = () => {
    const f = STATE.contractorJobFilter || 'all';
    const map = {
        all: () => true,
        pending: j => ['assigned', 'accepted'].includes(j.status),
        assigned: j => j.status === 'assigned',
        accepted: j => ['accepted', 'scheduled'].includes(j.status),
        in_progress: j => ['scheduled', 'in_progress', 'waiting_approval', 'approved'].includes(j.status),
        completed: j => ['completed', 'paid'].includes(j.status),
    };
    let jobs = CONTRACTOR_JOBS.filter(map[f] || map.all);
    const landlordF = STATE.contractorLandlordFilter || 'all';
    const propertyF = STATE.contractorPropertyFilter || 'all';
    const q = (STATE.search?.contractorJobs || '').trim().toLowerCase();
    if (landlordF !== 'all') jobs = jobs.filter(j => j.landlord === landlordF);
    if (propertyF !== 'all') jobs = jobs.filter(j => j.property === propertyF);
    if (q) {
        jobs = jobs.filter(j => [j.issue, j.property, j.address, j.tenant, j.landlord].join(' ').toLowerCase().includes(q));
    }
    return jobs;
};

function contractorJobFilterCounts() {
    const all = CONTRACTOR_JOBS.length;
    const pending = CONTRACTOR_JOBS.filter(j => ['assigned', 'accepted'].includes(j.status)).length;
    const inProgress = CONTRACTOR_JOBS.filter(j => ['scheduled', 'in_progress', 'waiting_approval', 'approved'].includes(j.status)).length;
    const completed = CONTRACTOR_JOBS.filter(j => ['completed', 'paid'].includes(j.status)).length;
    return { all, pending, inProgress, completed };
}

function contractorJobEstimate(job) {
    if (!job) return 'Quote Pending';
    if (job.quoteAmount != null) return `£${job.quoteAmount}`;
    if (job.invoice?.amount) return job.invoice.amount;
    if (['in_progress', 'waiting_approval', 'approved', 'completed', 'paid'].includes(job.status)) {
        return ({ High: '£185', Medium: '£120', Low: '£85' })[job.priority] || '£120';
    }
    return 'Quote Pending';
}

function contractorJobDisplayStatus(job) {
    const st = contractorStatusStyle(job.status);
    const label = {
        assigned: 'Pending', accepted: 'Pending', scheduled: 'In progress',
        in_progress: 'In progress', waiting_approval: 'Pending review',
        approved: 'Pending review', completed: 'Completed', paid: 'Completed',
    }[job.status] || st.label;
    return { label, bg: st.bg, color: st.color };
}

function contractorJobListCard(job) {
    const thumb = job.reportPhotos?.[0] || job.photos?.before?.[0] || IMG.maint[job.id % IMG.maint.length];
    const disp = contractorJobDisplayStatus(job);
    const location = `${job.property}${job.unit && job.unit !== '—' ? ` · ${job.unit}` : ''}`;
    return `
    <button type="button" data-go="contractor-job-detail" data-job="${job.id}" class="ctr-v2-job-card card w-full text-left">
        <img src="${thumb}" alt="" class="ctr-v2-job-thumb">
        <div class="ctr-v2-job-body">
            <p class="ctr-v2-job-title">${job.issue}</p>
            <p class="ctr-v2-job-addr">${location}</p>
            <div class="ctr-v2-job-meta">
                <span class="ctr-v2-job-badge" style="background:${disp.bg};color:${disp.color}">${disp.label}</span>
                <span class="ctr-v2-job-time"><i data-lucide="clock" class="w-3 h-3"></i>${job.visitDate || '—'}</span>
            </div>
        </div>
        <i data-lucide="chevron-right" class="ctr-v2-job-chevron"></i>
    </button>`;
}

function contractorEarningsSummary() {
    const paidJobs = CONTRACTOR_JOBS.filter(j => ['paid', 'completed', 'waiting_approval', 'approved'].includes(j.status));
    const total = paidJobs.reduce((sum, j) => {
        const amt = parseFloat(String(contractorJobEstimate(j)).replace(/[^\d.]/g, '')) || 0;
        return sum + amt;
    }, 0);
    const completed = CONTRACTOR_JOBS.filter(j => ['completed', 'paid'].includes(j.status)).length;
    return { total, completed, jobs: paidJobs.slice(0, 5) };
}

function contractorReviewDistribution(reviews) {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (reviews || []).forEach(r => { if (dist[r.stars] != null) dist[r.stars]++; });
    const max = Math.max(1, ...Object.values(dist));
    return [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: dist[stars],
        pct: Math.round((dist[stars] / max) * 100),
    }));
}

function renderCtrProgressChecklist(job) {
    if (!['scheduled', 'in_progress', 'waiting_approval'].includes(job.status)) return '';
    const steps = [
        ['Arrive at property', ['in_progress', 'waiting_approval', 'approved', 'paid', 'completed'].includes(job.status)],
        ['Diagnose & repair', ['waiting_approval', 'approved', 'paid', 'completed'].includes(job.status)],
        ['Add work photos', (job.photos?.after?.length || 0) > 0],
        ['Submit invoice', !!job.invoice],
    ];
    return `
    <div class="card ctr-compact-block">
        <p class="ctr-compact-label">Progress</p>
        <ul class="ctr-compact-checklist">
            ${steps.map(([label, done]) => `
            <li class="ctr-compact-check-item${done ? ' is-done' : ''}">
                <span class="ctr-compact-check-dot" aria-hidden="true"></span>
                <span>${label}</span>
            </li>`).join('')}
        </ul>
    </div>`;
}

function renderCtrEarnPeriodPills() {
    const period = STATE.contractorEarnPeriod || '1M';
    const periods = [['1W', '1W'], ['1M', '1M'], ['3M', '3M'], ['1Y', '1Y'], ['all', 'All']];
    return `<div class="ctr-compact-periods">${periods.map(([k, l]) => `
        <button type="button" data-contractor-earn-period="${k}" class="ctr-compact-period${period === k ? ' is-active' : ''}">${l}</button>`).join('')}</div>`;
}

function contractorProfileCompleteness() {
    let score = 40;
    if (CONTRACTOR_USER.phone) score += 15;
    if (CONTRACTOR_USER.companyReg) score += 15;
    if (ensureContractorCertificates(CONTRACTOR_USER).length >= 2) score += 20;
    if (CONTRACTOR_USER.vatNumber) score += 10;
    return Math.min(100, score);
}

const CONTRACTOR_TRADE_CATALOG = [
    { id: 'plumbing', label: 'Plumbing & Heating', shortLabel: 'Plumber', icon: 'wrench', color: '#2563EB', bg: '#EFF6FF', jobsFor: 'Leaks, taps, sinks, pipes, toilets, blocked drains', keywords: ['sink', 'tap', 'leak', 'pipe', 'plumb', 'water', 'damp', 'toilet', 'drain', 'bathroom', 'basin', 'shower'] },
    { id: 'heating', label: 'Heating & Gas', shortLabel: 'Heating engineer', icon: 'flame', color: '#EA580C', bg: '#FFF7ED', jobsFor: 'Boilers, radiators, gas safety, hot water', keywords: ['boiler', 'radiator', 'heat', 'gas', 'hot water', 'thermostat', 'central heating'] },
    { id: 'electrical', label: 'Electrical', shortLabel: 'Electrician', icon: 'zap', color: '#CA8A04', bg: '#FEF9C3', jobsFor: 'Lights, sockets, wiring, fuse boxes', keywords: ['light', 'electric', 'flicker', 'socket', 'fuse', 'wiring', 'switch', 'power'] },
    { id: 'general', label: 'General Maintenance', shortLabel: 'Handyman', icon: 'hammer', color: '#64748B', bg: '#F1F5F9', jobsFor: 'Repairs, fixtures, small jobs, odd jobs', keywords: ['window', 'door', 'lock', 'latch', 'fixture', 'general', 'repair', 'handle'] },
    { id: 'roofing', label: 'Roofing', shortLabel: 'Roofer', icon: 'home', color: '#2563EB', bg: '#EFF6FF', jobsFor: 'Roof leaks, tiles, gutters, chimneys', keywords: ['roof', 'gutter', 'tile', 'chimney', 'slate'] },
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
    { type: 'trade_qualification', label: 'Trade Qualification', icon: 'award', color: '#2563EB', bg: '#EFF6FF' },
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
            if (typeof autoFileContractorCertToLandlord === 'function') {
                autoFileContractorCertToLandlord(job, cert);
            }
        }
    }
    saveContractorCertificates();
    STATE.contractorCertUpload = null;
    toast(upload.replaceId != null ? 'Certificate replaced & synced' : 'Certificate uploaded & synced to Landlord & Tenants');
    render();
}

function autoFileContractorCertToLandlord(job, cert) {
    if (!job || !cert) return;
    const pid = (job.propertyId != null && job.propertyId >= 0)
        ? job.propertyId
        : (typeof PROPERTIES !== 'undefined' && job.property ? PROPERTIES.findIndex(p => p.name === job.property || job.property.includes(p.name)) : 0);
    const validPid = pid >= 0 ? pid : 0;
    
    // Map contractor cert type to landlord document folder & compliance cert index
    let folderId = 'custom';
    let docType = 'Custom Document';
    let complianceIdx = null;

    const lower = `${cert.type || ''} ${cert.name || ''}`.toLowerCase();
    if (lower.includes('gas')) {
        folderId = 'gas';
        docType = 'Gas Certificate';
        complianceIdx = 0;
    } else if (lower.includes('electric') || lower.includes('eicr')) {
        folderId = 'eicr';
        docType = 'Electrical Certificate';
        complianceIdx = 1;
    } else if (lower.includes('epc') || lower.includes('energy')) {
        folderId = 'epc';
        docType = 'EPC Certificate';
        complianceIdx = 5;
    } else if (lower.includes('fire') || lower.includes('smoke')) {
        folderId = 'fire';
        docType = 'Custom Document';
        complianceIdx = 2;
    } else if (lower.includes('insurance') || lower.includes('liability')) {
        folderId = 'insurance';
        docType = 'Custom Document';
        complianceIdx = 3;
    } else if (lower.includes('licence') || lower.includes('license') || lower.includes('hmo')) {
        folderId = 'licence';
        docType = 'Property Licence';
        complianceIdx = 4;
    }

    if (typeof AppStore !== 'undefined') {
        if (!AppStore.documents) AppStore.documents = [];
        const docId = AppStore.nextId(AppStore.documents);
        const newDoc = {
            id: docId,
            propertyId: validPid,
            type: docType,
            folderId,
            name: cert.name || cert.fileName || `${docType}.pdf`,
            date: typeof formatDocUploadDate === 'function' ? formatDocUploadDate() : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            uploadedAt: Date.now(),
            shared: true,
            userUpload: true,
            fileUrl: cert.fileUrl || 'assets/sample_cert.pdf',
            mime: cert.mime || 'application/pdf',
            uploadedByRole: 'contractor',
            contractorName: (typeof CONTRACTOR_USER !== 'undefined' && CONTRACTOR_USER.company) ? CONTRACTOR_USER.company : 'Contractor',
            expiryDate: cert.validUntil || '2027-10-15',
        };
        AppStore.documents.push(newDoc);

        // Update compliance status so Property Compliance immediately shows Valid
        if (complianceIdx != null) {
            if (!AppStore.complianceCerts) AppStore.complianceCerts = {};
            const certKey = `${validPid}-${complianceIdx}`;
            AppStore.complianceCerts[certKey] = {
                expiryDate: cert.validUntil || '2027-10-15',
                issuedBy: (typeof CONTRACTOR_USER !== 'undefined' && CONTRACTOR_USER.company) ? CONTRACTOR_USER.company : 'Contractor',
                certNumber: `CERT-${Date.now().toString().slice(-6)}`,
                file: cert.fileName || cert.name,
                status: 'Valid',
            };
        }

        // Auto-sync to all active tenants in this property
        const propTenants = (typeof TENANT_LIST !== 'undefined' ? TENANT_LIST : []).filter(t => t.propertyId === validPid);
        propTenants.forEach(t => {
            if (!AppStore.tenantDocuments) AppStore.tenantDocuments = {};
            if (!AppStore.tenantDocuments[t.id]) AppStore.tenantDocuments[t.id] = [];
            if (!AppStore.tenantDocuments[t.id].some(d => d[1] === newDoc.name)) {
                AppStore.tenantDocuments[t.id].push(['file-text', newDoc.name, 'Just now', '#2563EB']);
            }
            
            if (typeof pushNotification === 'function') {
                pushNotification({
                    icon: 'file-text',
                    color: ['#EFF6FF', '#2563EB'],
                    title: 'New compliance certificate uploaded',
                    desc: `${newDoc.name} · ${typeof PROPERTIES !== 'undefined' && PROPERTIES[validPid]?.name ? PROPERTIES[validPid].name : 'Property'}`,
                    time: 'Just now',
                    unread: true,
                    screen: 'tenant-documents',
                    opts: { tid: t.id },
                });
            }
        });

        // Push notification to Landlord
        if (typeof pushNotification === 'function') {
            pushNotification({
                icon: 'check-circle-2',
                color: ['#ECFDF5', '#059669'],
                title: 'Certificate auto-synced by contractor',
                desc: `${newDoc.name} filed to ${typeof PROPERTIES !== 'undefined' && PROPERTIES[validPid]?.name ? PROPERTIES[validPid].name : 'Property'}`,
                time: 'Just now',
                unread: true,
                screen: 'property-compliance',
                opts: { propertyId: validPid },
            });
        }

        if (typeof AppStore.save === 'function') AppStore.save();
    }
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
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    if (cert) {
        return `
        <div data-action="view-contractor-cert" data-cert="${cert.id}" class="card p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3 text-left cursor-pointer hover:border-[#2563EB] transition-all group">
            <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style="color:${opt.color};background:${opt.bg}">
                    <i data-lucide="${opt.icon}" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0 space-y-0.5">
                    <h4 class="text-[14px] font-extrabold text-[#0F172A] m-0 truncate group-hover:text-[#2563EB] transition-colors">${esc(opt.label)}</h4>
                    <p class="text-[11.5px] font-medium text-[#64748B] m-0 truncate">
                        ${esc(cert.fileName)}
                        ${cert.validUntil ? ` · <span class="font-bold text-[#059669]">Expires ${esc(cert.validUntil)}</span>` : ''}
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
                <button type="button" data-action="delete-contractor-cert" data-cert="${cert.id}" class="w-8 h-8 rounded-xl bg-[#F8FAFC] text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] border border-[#E2E8F0] flex items-center justify-center transition-colors cursor-pointer" title="Delete Certificate">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] transition-colors"></i>
            </div>
        </div>`;
    }

    return `
    <button type="button" data-action="open-contractor-cert-slot" data-cert-type="${certType}" class="card p-3.5 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all flex items-center justify-between gap-3 text-left w-full cursor-pointer group">
        <div class="flex items-center gap-3.5 min-w-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style="color:${opt.color};background:${opt.bg}">
                <i data-lucide="${opt.icon}" class="w-5 h-5"></i>
            </div>
            <div class="min-w-0">
                <h4 class="text-[14px] font-extrabold text-[#0F172A] m-0 truncate">${esc(opt.label)}</h4>
                <p class="text-[11.5px] font-medium text-[#64748B] m-0 truncate mt-0.5">Required document</p>
            </div>
        </div>
        <span class="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold text-[12px] flex items-center gap-1 shrink-0 shadow-2xs group-hover:bg-[#1D4ED8]">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Upload
        </span>
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

function renderContractorCertList(profile, { editable = false, compact = false } = {}) {
    const certs = ensureContractorCertificates(profile);
    if (!certs.length) {
        return `<p class="text-[13px] text-[#64748B]">No certificates uploaded yet${editable ? ' — add your Gas Safe, insurance, and trade documents.' : '.'}</p>`;
    }
    if (compact) {
        return `
    <div class="ctr-cert-compact-list">
        ${certs.map(cert => `
        <div class="ctr-cert-compact-row">
            <div class="ctr-cert-compact-body min-w-0">
                <p class="ctr-cert-compact-name">${escapeHtml(cert.name)}</p>
                <p class="ctr-cert-compact-meta">${cert.validUntil ? `Valid until ${escapeHtml(cert.validUntil)}` : `Uploaded ${escapeHtml(cert.uploadedAt)}`}</p>
            </div>
            <button type="button" data-action="view-contractor-cert" data-cert="${cert.id}" data-contractor-view="${profile.id ?? ''}" class="ctr-cert-compact-view">View</button>
        </div>`).join('')}
    </div>`;
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
        <div class="ctr-cert-preview-doc card overflow-hidden">
            ${typeof renderDemoDocumentSheet === 'function' ? renderDemoDocumentSheet({
                name: cert.fileName || cert.name,
                type: cert.type || 'Certificate',
                date: cert.validUntil ? `Valid until ${cert.validUntil}` : cert.uploadedAt,
                kind: 'file',
            }) : `<p class="p-6 text-center text-[13px] text-[#64748B]">Certificate on file</p>`}
        </div>
        <p class="text-[12px] text-[#64748B] text-center mt-3">Visible to landlords and tenants assigned to your jobs</p>
    </div>`;
}

function screenContractorPublicProfile() {
    const profile = getContractorPublicProfile(STATE.contractorViewId);
    if (!profile) {
        return `${topBar('Contractor', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Contractor not found</p></div>`;
    }
    const certCount = ensureContractorCertificates(profile).length;
    const isLandlord = STATE.userRole === 'landlord';
    const isTenant = STATE.userRole === 'tenant';
    const chatId = typeof ensureContractorConversation === 'function' ? ensureContractorConversation(profile) : null;
    const rating = typeof contractorDisplayRating === 'function' ? contractorDisplayRating(profile) : '4.8';
    const verified = (profile.certificates?.length || profile.gasSafe || profile.liabilityInsurance);
    const jobsLine = escapeHtml(contractorJobsForLabel(profile));

    return `${topBar('Contractor', { back: true })}
    <div class="screen-content screen-content-sm screen-enter ctr-profile-page space-y-4">
        <!-- Hero Header Card -->
        <div class="card p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
            <div class="flex items-start gap-3.5">
                <div class="relative shrink-0">
                    <img src="${profile.img || contractorAvatarForTrade(profile.tradeId)}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs" alt="">
                    <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white" title="Active"></span>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <h1 class="text-[17px] font-bold text-[#0F172A] leading-tight truncate m-0">${escapeHtml(profile.name)}</h1>
                        ${verified ? '<i data-lucide="badge-check" class="w-4 h-4 text-[#2563EB] shrink-0" title="Verified Contractor"></i>' : ''}
                    </div>
                    
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                        ${typeof renderContractorTradeBadge === 'function' ? renderContractorTradeBadge(profile) : `<span class="ctr-trade-badge">${escapeHtml(profile.category || profile.trade)}</span>`}
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#D97706] text-[11.5px] font-bold border border-[#FDE68A]">
                            <i data-lucide="star" class="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"></i>
                            ${rating}
                        </span>
                    </div>

                    ${(profile.gasSafe || profile.liabilityInsurance || certCount) ? `
                    <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                        ${profile.gasSafe ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F0FDF4] text-[#166534] text-[11px] font-bold border border-[#BBF7D0]"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#16A34A]"></i> Gas Safe</span>` : ''}
                        ${profile.liabilityInsurance ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-bold border border-[#BFDBFE]"><i data-lucide="file-check" class="w-3.5 h-3.5 text-[#2563EB]"></i> Insured</span>` : ''}
                        ${certCount ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F8FAFC] text-[#475569] text-[11px] font-bold border border-[#E2E8F0]"><i data-lucide="award" class="w-3.5 h-3.5 text-[#64748B]"></i> ${certCount} Certs</span>` : ''}
                    </div>` : ''}

                    ${jobsLine ? `<p class="text-[12.5px] text-[#64748B] mt-2 leading-relaxed font-medium m-0">${jobsLine}</p>` : ''}
                </div>
            </div>

            <!-- Quick Action Buttons Bar -->
            ${(isLandlord || isTenant) ? `
            <div class="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-[#F1F5F9]">
                ${chatId != null ? `
                <button type="button" data-go="chat" data-chat="${chatId}" class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[13px] shadow-2xs transition-all active:scale-95 cursor-pointer">
                    <i data-lucide="message-square" class="w-4 h-4"></i>
                    <span>Message</span>
                </button>` : '<div></div>'}
                
                ${profile.phone ? `
                <a href="tel:${profile.phone}" class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] font-bold text-[13px] border border-[#CBD5E1] transition-all active:scale-95 cursor-pointer no-underline">
                    <i data-lucide="phone" class="w-4 h-4 text-[#2563EB]"></i>
                    <span>Call</span>
                </a>` : '<div></div>'}

                ${profile.email ? `
                <a href="mailto:${profile.email}" class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] font-bold text-[13px] border border-[#CBD5E1] transition-all active:scale-95 cursor-pointer no-underline">
                    <i data-lucide="mail" class="w-4 h-4 text-[#2563EB]"></i>
                    <span>Email</span>
                </a>` : '<div></div>'}
            </div>` : ''}
        </div>

        ${(isLandlord || isTenant) && (profile.phone || profile.email) ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2.5">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider m-0">Contact Details</p>
            ${profile.phone ? `
            <div class="flex items-center justify-between py-1 text-[13px]">
                <span class="text-[#64748B] font-semibold flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4 text-[#2563EB]"></i>Phone</span>
                <button type="button" class="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors cursor-pointer" data-action="copy-contact" data-text="${profile.phone.replace(/"/g, '')}">${escapeHtml(profile.phone)}</button>
            </div>` : ''}
            ${profile.email ? `
            <div class="flex items-center justify-between py-1 text-[13px]">
                <span class="text-[#64748B] font-semibold flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4 text-[#2563EB]"></i>Email</span>
                <button type="button" class="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors cursor-pointer text-right truncate max-w-[200px]" data-action="copy-contact" data-text="${profile.email.replace(/"/g, '')}">${escapeHtml(profile.email)}</button>
            </div>` : ''}
            <p class="text-[11px] text-[#94A3B8] m-0 pt-1 border-t border-[#F1F5F9]">Tap to copy details · Use phone or email to reach directly</p>
        </div>` : ''}

        ${isTenant ? `<p class="text-[12px] text-[#64748B] text-center italic">Contact your landlord to reschedule or change contractor.</p>` : ''}
    </div>`;
}

function screenContractorCertifications() {
    const certs = ensureContractorCertificates(CONTRACTOR_USER);
    const slotTypes = CONTRACTOR_CERT_TYPES.filter(t => t.type !== 'other');
    const otherCerts = certs.filter(c => c.type === 'other');

    return `${topBar('Certifications', { back: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-4 text-left pb-16">
        <!-- Primary Certificate Slots List -->
        <div class="space-y-2.5">
            ${slotTypes.map(t => renderContractorCertSlot(t.type)).join('')}
        </div>

        <!-- Additional Certificates -->
        <div class="pt-2 space-y-2.5">
            <h3 class="text-[14px] font-extrabold text-[#0F172A] m-0 px-1">Additional Certificates</h3>
            ${otherCerts.length ? renderContractorCertList({ ...CONTRACTOR_USER, id: getContractorDirectoryEntry(CONTRACTOR_USER.email || CONTRACTOR_USER.company)?.id }) : ''}
            
            <button type="button" data-action="open-contractor-cert-slot" data-cert-type="other" class="btn-secondary w-full py-3 text-[13px] font-bold flex items-center justify-center gap-1.5 rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs hover:border-[#2563EB] transition-colors cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i> Add Certificate
            </button>
        </div>
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
    captureContractorSignupDraft();
    return true;
}

function advanceContractorSignup() {
    // Prototype: skip field checks — enter contractor demo from any signup step
    if (typeof demoLogin === 'function') {
        demoLogin('contractor');
        return;
    }
    submitContractorSignup();
}

function submitContractorSignup() {
    if (typeof demoLogin === 'function') {
        demoLogin('contractor');
        return;
    }
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
            <div class="auth-icon-wrap">
                <i data-lucide="hard-hat" class="w-7 h-7 text-[#2563EB]"></i>
            </div>
            <h1 class="auth-heading">Create Contractor Account</h1>
            <p class="auth-sub">${invited ? 'Complete your profile to accept jobs from landlords on Landlord HQ.' : 'Set up your trade business to receive maintenance jobs, schedule visits, and upload invoices.'}</p>
            ${invited ? `
            <div class="card p-3 ctr-signup-invite-strip" style="margin-top:12px">
                <p class="text-[12px] font-semibold text-[#1E40AF]"><i data-lucide="mail-check" class="w-4 h-4 inline-block -mt-px"></i> Invited by John Smith</p>
            </div>` : ''}
            ${progress}
            ${stepBody[step]}
            <button type="button" data-action="contractor-signup-next" class="btn-auth btn-auth-primary">${step < 4 ? 'Continue' : 'Create account'}</button>
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
            <h1 class="welcome-hero-title">Welcome, ${firstName}!</h1>
            <p class="welcome-hero-sub">${CONTRACTOR_USER.company || 'Your contractor workspace'} is active. View jobs, schedule visits, and upload invoices.</p>
            <div class="free-account-pill free-account-pill--on-dark">
                <i data-lucide="gift" class="w-3.5 h-3.5"></i>
                <span>Contractor account · Always free</span>
            </div>
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
    const loggedIn = STATE.isAuthenticated && STATE.userRole === 'tenant' ? getActiveTenant() : null;
    const emailMatch = loggedIn && String(loggedIn.email || '').toLowerCase() === String(invite.email || '').toLowerCase();
    return `
    <div class="auth-screen">
        <div class="auth-content" style="padding-top:32px">
            <div class="tenant-invite-icon"><i data-lucide="mail-check" class="w-8 h-8"></i></div>
            <h1 class="auth-heading">You're Invited!</h1>
            <p class="auth-sub">${invite.landlord} invited you to join as a tenant at <strong>${p.name}</strong> (${invite.unit}).</p>
            <div class="card p-4 text-left" style="margin-top:20px">
                <div class="flex items-center gap-3 mb-3">
                    <img src="${IMG.props[invite.propertyId]}" class="w-12 h-12 rounded-xl object-cover" alt="">
                    <div>
                        <p class="text-[14px] font-semibold text-[#0F172A]">${p.name}</p>
                        <p class="text-[12px] text-[#64748B]">${p.address}</p>
                    </div>
                </div>
                ${[['Unit', invite.unit], ['Monthly Rent', invite.rent], ['Lease', `${typeof formatDisplayDate === 'function' && invite.leaseStart ? formatDisplayDate(invite.leaseStart) : (invite.leaseStart || '—')} → ${typeof formatDisplayDate === 'function' && invite.leaseEnd ? formatDisplayDate(invite.leaseEnd) : (invite.leaseEnd || '—')}`], ['Invited', invite.sentAt]].map(([k, v]) => `
                <div class="flex justify-between text-[13px] py-1.5 border-t border-[#F1F5F9] first:border-0"><span class="text-[#64748B]">${k}</span><span class="font-semibold">${v}</span></div>`).join('')}
                <div class="flex justify-between text-[13px] py-1.5 border-t border-[#F1F5F9]"><span class="text-[#64748B]">Invite email</span><span class="font-semibold">${invite.email}</span></div>
            </div>
            ${invite.message ? `<div class="card p-4 text-left" style="margin-top:12px"><p class="text-[11px] font-bold text-[#64748B] uppercase">Message from landlord</p><p class="text-[13px] text-[#475569] mt-2 leading-relaxed">"${invite.message}"</p></div>` : ''}
            ${activated ? `
            <div class="card p-4 text-center" style="margin-top:16px;background:#ECFDF5;border-color:#BBF7D0">
                <p class="text-[13px] font-semibold text-[#059669]">Invitation already accepted</p>
                <p class="text-[12px] text-[#64748B] mt-1">Sign in with your email and password.</p>
            </div>
            <button type="button" data-action="tenant-sign-in" class="btn-auth btn-auth-primary" style="margin-top:20px;width:100%">Sign In</button>
            ` : emailMatch ? `
            <button type="button" data-action="accept-tenant-invite" data-token="${invite.token}" class="btn-auth btn-auth-primary" style="margin-top:24px;width:100%">Accept & join this flat</button>
            <p class="auth-security-note" style="margin-top:16px"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Signed in as ${loggedIn.email}</p>
            ` : `
            <button type="button" data-action="tenant-activate" class="btn-auth btn-auth-primary" style="margin-top:24px;width:100%">${invite.reattachExisting ? 'Sign in password & join flat' : 'Accept & create login'}</button>
            <button type="button" data-action="tenant-sign-in" class="btn-auth btn-auth-outline" style="margin-top:12px;width:100%">Already have an account? Sign In</button>
            `}
            <p class="auth-security-note" style="margin-top:20px"><i data-lucide="shield" class="w-3.5 h-3.5"></i> Flat membership is invitation-only — only your landlord can send this link</p>
        </div>
    </div>`;
}

function screenTenantActivate() {
    const invite = tenantInviteByToken(STATE.tenantInviteToken);
    if (!invite) return screenTenantInvite();
    const pwType = STATE.showPassword ? 'text' : 'password';
    const confirmType = STATE.showConfirmPassword ? 'text' : 'password';
    const existing = TENANT_ACCOUNTS.find(a => a.email && a.email.toLowerCase() === String(invite.email || '').toLowerCase());
    const needsProfile = !invite.reattachExisting && !existing;
    const reattach = !!(invite.reattachExisting || existing);
    const prefName = [invite.firstName, invite.lastName].filter(n => n && n !== 'Invited' && n !== 'Tenant').join(' ');
    return `
    <div class="auth-screen">
        ${authTopbar()}
        <div class="auth-content">
            <div class="auth-icon-wrap" style="background:#DCFCE7">
                <i data-lucide="user-plus" class="w-7 h-7 text-[#16A34A]"></i>
            </div>
            <h1 class="auth-heading">${reattach ? 'Join this flat' : 'Create your profile'}</h1>
            <p class="auth-sub">${reattach
                ? `Confirm your password for <strong>${invite.email}</strong> to join <strong>${invite.unit}</strong> at ${PROPERTIES[invite.propertyId]?.name || 'this property'}.`
                : `Complete your details for <strong>${invite.email}</strong>, then set a password. This invitation is what links you to the flat.`}</p>
            <div class="auth-form">
                ${needsProfile ? `
                <div class="auth-field"><label>Full name</label><input type="text" data-tenant-fullname class="auth-input" placeholder="e.g. Sarah Johnson" value="${prefName}"></div>
                <div class="auth-field"><label>Date of birth</label><input type="date" data-tenant-dob class="auth-input" value="${invite.dob || ''}"></div>
                <div class="auth-field"><label>NID / ID number</label><input type="text" data-tenant-nid class="auth-input" placeholder="National ID number" value="${invite.idNumber || ''}"></div>
                <div class="auth-field"><label>Mobile number</label><input type="tel" data-tenant-phone class="auth-input" placeholder="+44 7700 900000" value="${invite.phone || ''}"></div>` : ''}
                <div class="auth-field">
                    <label>${reattach ? 'Your password' : 'Create password'}</label>
                    <div class="auth-input-wrap">
                        <input type="${pwType}" data-tenant-password class="auth-input" placeholder="${reattach ? 'Enter your password' : 'Enter password'}" style="padding-right:44px">
                        <button type="button" data-action="toggle-password" class="auth-input-toggle"><i data-lucide="${STATE.showPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>
                ${reattach ? '' : `
                <div class="auth-field">
                    <label>Confirm password</label>
                    <div class="auth-input-wrap">
                        <input type="${confirmType}" data-tenant-confirm class="auth-input" placeholder="Re-enter password" style="padding-right:44px">
                        <button type="button" data-action="toggle-confirm-password" class="auth-input-toggle"><i data-lucide="${STATE.showConfirmPassword ? 'eye-off' : 'eye'}" class="w-5 h-5"></i></button>
                    </div>
                </div>`}
                <button type="button" data-action="activate-tenant-account" class="btn-auth btn-auth-primary">${reattach ? 'Join flat' : 'Activate & join flat'}</button>
            </div>
            <p class="auth-security-note"><i data-lucide="lock" class="w-3.5 h-3.5"></i> You become a member of ${invite.unit} at ${PROPERTIES[invite.propertyId]?.name || 'this property'} only through this landlord invitation</p>
        </div>
    </div>`;
}

function screenTenantWelcome() {
    const t = getActiveTenant();
    const linked = typeof tenantHasPropertyLink === 'function' ? tenantHasPropertyLink(t) : !!(t?.propertyId != null && t?.unit);
    const p = linked && t ? PROPERTIES[t.propertyId] : null;
    const name = t ? t.firstName : 'Tenant';
    return `
    <div class="auth-screen" style="padding-bottom:0">
        <div class="welcome-header">
            <h1 class="welcome-greeting">Welcome, ${name}!</h1>
            <div class="free-account-pill">
                <i data-lucide="gift" class="w-3.5 h-3.5"></i>
                <span>Tenant portal · Always free</span>
            </div>
        </div>
        <div class="auth-content" style="padding-top:0">
            <button type="button" data-action="enter-app" class="portal-card portal-card-tenant">
                <p class="portal-card-title">Tenant Portal</p>
                <p class="portal-card-sub">${linked && p ? `${p.name} · ${t.unit}` : 'Waiting for landlord invitation'}</p>
                <i data-lucide="home" class="portal-card-icon w-20 h-20"></i>
            </button>
            <div class="card p-4 text-left">
                <p class="text-[13px] font-semibold text-[#0F172A]">${linked ? "You're all set" : 'Account ready — invite needed'}</p>
                <p class="text-[12px] text-[#64748B] mt-2 leading-relaxed">${linked && p
                    ? `Your account is linked to ${p.name}. Report maintenance, view documents, and message your landlord from the portal.`
                    : 'You can sign in anytime. You cannot join a flat until your landlord emails you an invitation link — only they can add you as a member.'}</p>
            </div>
        </div>
        <div class="welcome-nav">
            <button type="button" data-action="enter-app" class="welcome-nav-btn active"><i data-lucide="home" class="w-5 h-5"></i>Home</button>
            <button type="button" data-go="${linked ? 'log-maintenance' : 'tenant-dashboard'}" class="welcome-nav-btn"><i data-lucide="wrench" class="w-5 h-5"></i>Issues</button>
            <button type="button" data-go="${linked ? 'messages' : 'tenant-dashboard'}" class="welcome-nav-btn"><i data-lucide="message-square" class="w-5 h-5"></i>Messages</button>
            <button type="button" data-action="logout" class="welcome-nav-btn"><i data-lucide="log-out" class="w-5 h-5"></i>Sign Out</button>
        </div>
    </div>`;
}

function tenantDashboardHeader(t, p) {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const av = typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tid) : (IMG?.avatar?.sarah || 'assets/sarah.png');
    const unread = typeof getUnreadNotifCount === 'function' ? getUnreadNotifCount() : 0;
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `
<div class="screen-header dash-header px-4 pt-3 pb-2 bg-transparent">
    <div class="flex items-center justify-between">
        <button type="button" data-action="drawer" class="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer" aria-label="Menu">
            <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
        <button type="button" data-go="notifications-list" class="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer" aria-label="Notifications">
            <i data-lucide="bell" class="w-6 h-6"></i>
            ${unread ? `<span class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-white"></span>` : ''}
        </button>
    </div>
    <div class="flex items-center gap-3.5 mt-2">
        <img src="${av}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0" alt="">
        <div class="min-w-0 text-left">
            <p class="text-[13px] font-medium text-[#64748B] m-0">Good evening,</p>
            <h2 class="text-[22px] font-black text-[#0F172A] m-0 tracking-tight flex items-center gap-1.5">
                <span>${esc(t.firstName || 'Sarah')}</span>
                <span class="text-[20px]">👋</span>
            </h2>
            <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">Here's an overview of your tenancy</p>
        </div>
    </div>
</div>`;
}

function renderTenantHomePropertyCard(t, p) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const cover = (t.unit && typeof getFlatCoverPhoto === 'function'
        ? getFlatCoverPhoto(t.propertyId, t.unit)
        : null)
        || (typeof getPropertyCoverPhoto === 'function'
            ? getPropertyCoverPhoto(t.propertyId)
            : (IMG?.props?.[t.propertyId] || 'assets/house1.jpg'));
    return `
    <button type="button" data-go="tenant-active-tenancy" class="relative w-full h-[180px] rounded-3xl overflow-hidden text-left group shadow-md transition-transform active:scale-[0.99] cursor-pointer">
        <img src="${esc(cover)}" alt="" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-transparent p-5 flex flex-col justify-between">
            <div class="flex items-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-[#065F46]/90 text-[#34D399] border border-[#059669]/40 uppercase shadow-xs">
                    <span class="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
                    ACTIVE TENANCY
                </span>
            </div>
            <div>
                <h3 class="text-[22px] font-black text-white m-0 tracking-tight leading-tight">${esc(p?.name || '12 Park Lane')}</h3>
                <p class="text-[12.5px] font-semibold text-white/90 m-0 mt-1 flex items-center gap-1 truncate">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-white/80 shrink-0"></i>
                    <span>${esc(t.unit ? `${t.unit}, ${p?.address || ''}` : (p?.address || 'Flat 2A, London, SW1A 1AA'))}</span>
                </p>
                <div class="mt-3">
                    <span class="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-[12px] font-bold group-hover:bg-white/25 transition-all">
                        <span>View home details</span>
                        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                    </span>
                </div>
            </div>
        </div>
    </button>`;
}

function renderTenantHomeLandlordContact(t, p) {
    return '';
}

function renderTenantHomeRentStrip(t, pay, rentDue) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const rentAmt = rentDue
        ? (pay?.balance || '£2,450')
        : (t.rent ? `£${String(t.rent).replace(/^£/, '')}` : '£2,450');
    const lastAmt = pay?.lastPaymentAmount || ((pay?.lastPayment || '£2,450').split('·')[0]?.trim()) || '£2,450';
    const lastDate = pay?.lastPaymentDate || ((pay?.lastPayment || 'May 2, 2026').split('·').pop()?.trim()) || 'May 2, 2026';
    const dueMeta = pay?.nextDueDate || (pay?.nextDue ? pay.nextDue.split('·').pop()?.trim() : 'Jul 1, 2026');

    const hasMaint = pay?.maintBalance && pay.maintBalance !== '£0.00';
    const hasCharge = pay?.chargeBalance && pay.chargeBalance !== '£0.00';
    const maintInv = (hasMaint && pay.maintInvoiceId != null) ? INVOICES.find(i => i.id === pay.maintInvoiceId) : null;
    const maintDesc = maintInv?.desc || 'Kitchen sink repair share';
    const maintDue = maintInv?.due || 'Jul 20, 2026';

    return `
    <div class="card p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm text-left space-y-3">
        <div class="flex items-center justify-between">
            <span class="text-[13px] font-bold text-[#64748B]">Next rent due</span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${rentDue ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#ECFDF5] text-[#059669]'}">
                <i data-lucide="${rentDue ? 'clock' : 'check-circle-2'}" class="w-3.5 h-3.5"></i>
                <span>${rentDue ? 'Payment due' : 'Paid in full'}</span>
            </span>
        </div>
        <div class="flex items-center justify-between gap-3">
            <div>
                <p class="text-[32px] font-black text-[#0F172A] tracking-tight leading-none m-0">${esc(rentAmt)}</p>
                <p class="text-[12px] font-medium text-[#64748B] m-0 mt-2 flex items-center gap-1">
                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-[#94A3B8]"></i>
                    <span>Due ${esc(dueMeta)}</span>
                </p>
                <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">
                    Last paid: <strong class="text-[#0F172A] font-bold">${esc(lastAmt)}</strong> on ${esc(lastDate)}
                </p>
            </div>
            <button type="button" ${rentDue
                ? `data-action="tenant-pay" data-kind="rent" data-iid="${pay?.rentInvoiceId ?? ''}"`
                : `data-go="transaction-history"`} class="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-2xl text-[13.5px] font-extrabold shadow-sm transition-all cursor-pointer shrink-0">
                <span>${rentDue ? 'Pay Rent' : 'View Ledger'}</span>
            </button>
        </div>
    </div>

    <!-- Pending Charges Section -->
    ${(hasMaint || hasCharge || true) ? `
    <div class="space-y-2 text-left pt-1">
        <div class="flex items-center justify-between px-1">
            <h3 class="text-[15px] font-extrabold text-[#0F172A] m-0">Pending charges</h3>
            <button type="button" data-go="transaction-history" class="text-[#2563EB] text-[12px] font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                <span>View all</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
        </div>
        <div class="card p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                    <i data-lucide="wrench" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                    <p class="text-[13px] font-bold text-[#0F172A] truncate m-0">${esc(hasMaint ? maintDesc : 'Kitchen sink repair share')}</p>
                    <p class="text-[11px] text-[#64748B] m-0 mt-0.5">Due ${esc(hasMaint ? maintDue : 'Jul 20, 2026')}</p>
                </div>
            </div>
            <div class="flex items-center gap-2.5 shrink-0">
                <span class="text-[15px] font-black text-[#0F172A]">${esc(hasMaint ? pay.maintBalance : '£85')}</span>
                <button type="button" data-action="tenant-pay" data-kind="maintenance" data-iid="${pay?.maintInvoiceId ?? ''}" class="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-extrabold px-4 py-1.5 rounded-xl text-[12px] transition-colors cursor-pointer">
                    Pay
                </button>
            </div>
        </div>
    </div>` : ''}`;
}

function renderTenantHomeChargeCard(pay) {
    return '';
}

function renderTenantHomeMaintBill(pay) {
    return '';
}

function renderTenantHomeMaintSection(tenant, tid) {
    const issues = typeof tenantMaintenanceForAccount === 'function'
        ? tenantMaintenanceForAccount(tenant).filter(m => m.status !== 'done')
        : [];
    const body = issues.length
        ? `<div class="maint-list tnt-home-maint-list">${issues.slice(0, 1).map(m =>
            typeof maintCard === 'function'
                ? maintCard(m, { hideProperty: true, hideAssign: true })
                : ''
        ).join('')}</div>`
        : `
        <div class="empty-state card">
            <i data-lucide="wrench" class="w-10 h-10 text-[#CBD5E1]"></i>
            <p class="empty-state-title">No open maintenance requests</p>
            <p class="empty-state-desc">Report an issue and your landlord will be notified.</p>
        </div>`;
    return `
    <div class="dash-section-head">
        <div>
            <h3 class="screen-section-title">My maintenance requests</h3>
            <p class="dash-section-sub">${issues.length ? `${issues.length} open` : 'Nothing pending right now'}</p>
        </div>
        ${issues.length ? `<button type="button" data-go="tenant-issues" class="dash-view-all">View all</button>` : ''}
    </div>
    ${body}`;
}

function renderTenantHomeAnnouncement(t) {
    const items = typeof announcementsForTenant === 'function' ? announcementsForTenant(t) : [];
    const a = items[0];
    if (!a) return '';
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const preview = a.body.length > 72 ? `${a.body.slice(0, 72)}…` : a.body;
    return `
    <button type="button" data-go="tenant-announcements" class="tnt-announce-strip card w-full text-left">
        <span class="tnt-announce-strip-icon"><i data-lucide="megaphone" class="w-5 h-5"></i></span>
        <span class="min-w-0 flex-1">
            <p class="tnt-announce-strip-title">Building announcement</p>
            <p class="tnt-announce-strip-body"><strong>${esc(a.title)}</strong> — ${esc(preview)}</p>
        </span>
        <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
    </button>`;
}

function renderTenantStandbyDashboard(t) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const name = [t?.firstName, t?.lastName].filter(Boolean).join(' ') || 'Tenant';
    const email = t?.email || '';
    const pendingInvites = typeof pendingInvitesForTenantEmail === 'function' ? pendingInvitesForTenantEmail(email) : [];
    const history = t?.tenancyHistory || [];

    return `${topBar('Tenant Portal', { hideBell: false })}
    <div class="screen-content screen-enter tnt-home-page space-y-4">
        <!-- Verified Account Summary Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-left">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[18px] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                    ${esc(t?.firstName ? t.firstName[0] : 'T')}
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                        <p class="text-[16px] font-bold text-[#0F172A] truncate">${esc(name)}</p>
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                            <i data-lucide="check-circle-2" class="w-3 h-3"></i> Verified
                        </span>
                    </div>
                    <p class="text-[12px] text-[#64748B] truncate mt-0.5">${esc(email)}</p>
                </div>
            </div>
            <div class="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span class="text-[12px] text-[#64748B]">Tenancy Status</span>
                <span class="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">No active flat · Standby</span>
            </div>
        </div>

        <!-- Pending Landlord Invitations (if any) -->
        ${pendingInvites.length > 0 ? `
        <div class="dash-section-head">
            <div>
                <h3 class="screen-section-title">New Flat Invitations (${pendingInvites.length})</h3>
                <p class="dash-section-sub">A landlord has invited you to join a flat</p>
            </div>
        </div>
        <div class="space-y-3">
            ${pendingInvites.map(inv => {
                const prop = PROPERTIES[inv.propertyId];
                return `
                <div class="card p-4 rounded-2xl bg-white border border-[#BFDBFE] shadow-sm space-y-3 text-left">
                    <div class="flex items-center gap-3">
                        <img src="${(IMG.props && IMG.props[inv.propertyId]) || 'assets/house1.jpg'}" class="w-12 h-12 rounded-xl object-cover" alt="">
                        <div class="min-w-0 flex-1">
                            <p class="text-[14px] font-bold text-[#0F172A] truncate">${esc(prop?.name || 'Property')}</p>
                            <p class="text-[12px] text-[#64748B] truncate">${esc(inv.unit)} · ${esc(prop?.address || '')}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl text-[12px]">
                        <div><span class="text-[#64748B]">Rent:</span> <strong class="text-[#0F172A]">${esc(inv.rent)}</strong></div>
                        <div><span class="text-[#64748B]">Landlord:</span> <strong class="text-[#0F172A]">${esc(inv.landlord || 'Landlord')}</strong></div>
                    </div>
                    <button type="button" data-action="accept-tenant-invite" data-token="${inv.token}" class="btn-primary w-full py-3 text-[13px] font-bold flex items-center justify-center gap-1.5">
                        <i data-lucide="check-circle" class="w-4 h-4"></i> Accept &amp; Join This Flat
                    </button>
                </div>`;
            }).join('')}
        </div>` : ''}

        <!-- Join with Invite Code Box -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3 text-left">
            <div>
                <h4 class="text-[14px] font-bold text-[#0F172A]">Have an Invitation Code?</h4>
                <p class="text-[12px] text-[#64748B] mt-0.5">Enter the code from your landlord to link your account to your new flat.</p>
            </div>
            <div class="flex gap-2">
                <input type="text" data-tenant-invite-code-input class="form-input flex-1 uppercase tracking-wider font-semibold" placeholder="e.g. INV-ABC123">
                <button type="button" data-action="tenant-join-code" class="btn-primary px-4 py-2.5 text-[13px] font-bold shrink-0">Join Flat</button>
            </div>
        </div>

        <!-- Share Email Note Banner -->
        <div class="card p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-2 text-left">
            <div class="flex items-center gap-2 text-[#1D4ED8]">
                <i data-lucide="info" class="w-4 h-4 shrink-0"></i>
                <span class="text-[13px] font-bold">Moving into a new flat?</span>
            </div>
            <p class="text-[12px] text-[#3B82F6] leading-relaxed">
                Give your email <strong class="text-[#1E40AF]">${esc(email)}</strong> to your landlord. When they send the invite, you'll see it here and can connect with 1 click without re-uploading documents.
            </p>
        </div>

        <!-- Rental History (Past Tenancies) -->
        ${history.length > 0 ? `
        <div class="dash-section-head">
            <div>
                <h3 class="screen-section-title">Rental History</h3>
                <p class="dash-section-sub">Past flats and leases on your account</p>
            </div>
        </div>
        <div class="space-y-2">
            ${history.map(h => {
                const prop = PROPERTIES[h.propertyId];
                return `
                <div class="card p-3 rounded-xl bg-white border border-[#E2E8F0] text-left">
                    <div class="flex items-center justify-between">
                        <p class="text-[13px] font-bold text-[#0F172A]">${esc(prop?.name || h.propertyName || 'Previous Property')} · ${esc(h.unit)}</p>
                        <span class="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">Completed</span>
                    </div>
                    <p class="text-[11px] text-[#64748B] mt-1">Landlord: ${esc(h.landlord || '—')} · Lease: ${esc(h.leaseStart || '—')} → ${esc(h.leaseEnd || '—')}</p>
                    ${h.deposit ? `<p class="text-[11px] text-[#059669] font-medium mt-0.5">Deposit: ${esc(h.deposit)}</p>` : ''}
                </div>`;
            }).join('')}
        </div>` : ''}

        <!-- Quick Access Profile Link -->
        <button type="button" data-go="personal-info" class="btn-secondary w-full py-3 text-[13px] font-bold">
            <i data-lucide="user" class="w-4 h-4 mr-1.5 inline"></i> View My Profile &amp; Documents
        </button>
    </div>`;
}

function screenTenantDashboard() {
    if (typeof ensureDemoTenantAccount === 'function') ensureDemoTenantAccount();
    let t = getActiveTenant();
    if (!t && typeof DEMO_CREDENTIALS !== 'undefined') {
        t = tenantAccountByEmail(DEMO_CREDENTIALS.tenant.email);
        if (t) STATE.activeTenantId = t.id;
    }
    if (!t) {
        return `${topBar('Tenant Portal', { hideBell: true })}
        <div class="screen-content screen-enter">
            <div class="empty-state card">
                <p class="empty-state-title">Opening tenant demo…</p>
                <button type="button" data-action="tenant-sign-in" class="btn-primary w-full py-3 text-[13px] mt-3">Enter as Tenant</button>
            </div>
        </div>`;
    }

    const isLinked = !t.awaitingInvite && t.propertyId != null && t.propertyId !== '' && t.unit && !!PROPERTIES[t.propertyId];
    if (!isLinked) {
        return renderTenantStandbyDashboard(t);
    }

    const p = PROPERTIES[t.propertyId];
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : null;
    const rentDue = pay?.balance !== '£0.00';

    return `${tenantDashboardHeader(t, p)}
    <div class="screen-content screen-enter tnt-home-page space-y-4">
        ${renderTenantHomePropertyCard(t, p)}
        ${renderTenantHomeRentStrip(t, pay, rentDue)}
        
        <!-- Quick Actions Row (Circular Icon Badges matching reference screen) -->
        <div class="space-y-2.5 text-left pt-1">
            <h3 class="text-[15px] font-extrabold text-[#0F172A] m-0 px-1">Quick actions</h3>
            <div class="grid grid-cols-3 gap-3">
                <button type="button" data-go="log-maintenance" class="flex flex-col items-center gap-2 group cursor-pointer text-center">
                    <div class="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#DBEAFE] group-hover:scale-105 group-hover:bg-[#DBEAFE] transition-all shadow-xs">
                        <i data-lucide="file-text" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[12px] font-bold text-[#334155] group-hover:text-[#2563EB] transition-colors leading-tight">Report an issue</span>
                </button>
                <button type="button" data-go="messages" class="flex flex-col items-center gap-2 group cursor-pointer text-center">
                    <div class="w-14 h-14 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-[#A7F3D0] group-hover:scale-105 group-hover:bg-[#D1FAE5] transition-all shadow-xs">
                        <i data-lucide="message-circle" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[12px] font-bold text-[#334155] group-hover:text-[#059669] transition-colors leading-tight">Message landlord</span>
                </button>
                <button type="button" data-go="transaction-history" class="flex flex-col items-center gap-2 group cursor-pointer text-center">
                    <div class="w-14 h-14 rounded-full bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center border border-[#DDD6FE] group-hover:scale-105 group-hover:bg-[#EDE9FE] transition-all shadow-xs">
                        <i data-lucide="credit-card" class="w-6 h-6"></i>
                    </div>
                    <span class="text-[12px] font-bold text-[#334155] group-hover:text-[#7C3AED] transition-colors leading-tight">View payments</span>
                </button>
            </div>
        </div>

        ${renderTenantHomeMaintSection(t, tid)}
        ${renderTenantHomeAnnouncement(t)}
    </div>`;
}

function renderTenantBuildingUtilities(meta, pid) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const utils = meta?.utilities || {};
    const info = meta?.info || {};

    const gasEntry = typeof getUtilityEntry === 'function' ? getUtilityEntry(meta, 'gas') : null;
    const elecEntry = typeof getUtilityEntry === 'function' ? getUtilityEntry(meta, 'electricity') : null;
    const waterEntry = typeof getUtilityEntry === 'function' ? getUtilityEntry(meta, 'water') : null;
    const wifiEntry = typeof getUtilityEntry === 'function' ? getUtilityEntry(meta, 'wifi') : null;

    const entries = [
        {
            key: 'gas',
            title: 'Gas Supply',
            icon: 'flame',
            provider: gasEntry?.provider || utils.gasSupplier || 'British Gas',
            meter: gasEntry?.meterNumber ? (gasEntry.meterNumber.startsWith('MPRN') ? gasEntry.meterNumber : `MPRN ${gasEntry.meterNumber}`) : (utils.gasNo ? `MPRN ${utils.gasNo}` : 'MPRN 84920173'),
            loc: gasEntry?.meterLocation || utils.gasLoc || 'Outside meter box',
            badge: 'Gas Safe CP12',
            badgeBg: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]',
            iconBg: 'bg-[#FFF7ED] text-[#EA580C]',
        },
        {
            key: 'electricity',
            title: 'Electricity',
            icon: 'zap',
            provider: elecEntry?.provider || utils.electricitySupplier || 'Octopus Energy',
            meter: elecEntry?.meterNumber ? (elecEntry.meterNumber.startsWith('MPAN') ? elecEntry.meterNumber : `MPAN ${elecEntry.meterNumber}`) : (utils.electricityNo ? `MPAN ${utils.electricityNo}` : 'MPAN 12093841'),
            loc: elecEntry?.meterLocation || utils.electricityLoc || 'Intake cupboard in hallway',
            badge: 'EICR Certified',
            badgeBg: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]',
            iconBg: 'bg-[#FFFBEB] text-[#D97706]',
        },
        {
            key: 'water',
            title: 'Water Supply',
            icon: 'droplets',
            provider: waterEntry?.provider || utils.waterSupplier || 'Thames Water',
            meter: waterEntry?.meterNumber ? (waterEntry.meterNumber.startsWith('Meter') || waterEntry.meterNumber.startsWith('Account') ? waterEntry.meterNumber : `Meter ${waterEntry.meterNumber}`) : (utils.waterNo ? `Meter ${utils.waterNo}` : 'Account 902184'),
            loc: waterEntry?.meterLocation || utils.waterLoc || 'Stopcock under kitchen sink',
            badge: 'Stopcock Active',
            badgeBg: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
            iconBg: 'bg-[#F0F9FF] text-[#0284C7]',
        },
        {
            key: 'wifi',
            title: 'Wi-Fi & Broadband',
            icon: 'wifi',
            provider: wifiEntry?.provider || utils.broadbandSupplier || 'BT Fibre 500',
            meter: utils.wifiPassword ? `Password: ${utils.wifiPassword}` : 'Password: London2026!Fast',
            loc: utils.wifiSsid ? `SSID: ${utils.wifiSsid}` : 'BT-Hub-Fast-5GHz',
            badge: '500 Mbps Fibre',
            badgeBg: 'bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]',
            iconBg: 'bg-[#F5F3FF] text-[#8B5CF6]',
        },
        {
            key: 'council',
            title: 'Council & Bins',
            icon: 'landmark',
            provider: utils.council?.name || (typeof utils.council === 'string' ? utils.council : '') || 'Westminster City Council',
            meter: info.councilTax ? `Council Tax Band ${info.councilTax}` : 'Council Tax Band D',
            loc: 'Waste: Tuesdays · Recycling: Fridays',
            badge: info.councilTax ? `Band ${info.councilTax}` : 'Band D',
            badgeBg: 'bg-[#F8FAFC] text-[#475569] border border-[#CBD5E1]',
            iconBg: 'bg-[#F1F5F9] text-[#334155]',
        },
    ];

    return `
    <div class="card p-4">
        <div class="flex items-center justify-between gap-2 mb-3">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Building Services &amp; Utilities</p>
            <span class="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">${entries.length} Active</span>
        </div>
        <div class="space-y-2.5">
            ${entries.map(e => `
            <div class="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-left">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl ${e.iconBg} flex items-center justify-center shrink-0 shadow-xs">
                        <i data-lucide="${e.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-[13px] font-bold text-[#0F172A]">${esc(e.title)}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${e.badgeBg}">${esc(e.badge)}</span>
                        </div>
                        <p class="text-[12px] font-semibold text-[#334155] mt-0.5 truncate">${esc(e.provider)} · <span class="font-medium text-[#64748B]">${esc(e.meter)}</span></p>
                        <p class="text-[11px] text-[#64748B] mt-0.5 truncate"><i data-lucide="map-pin" class="w-3 h-3 inline mr-0.5"></i>${esc(e.loc)}</p>
                    </div>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
}

function screenTenantBuildingInfo() {
    const t = getActiveTenant();
    if (!t) return `${topBar('Building', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Sign in as tenant to view building info.</p></div>`;
    const pid = t.propertyId;
    const p = PROPERTIES[pid];
    const building = typeof getPropertyBuilding === 'function' ? getPropertyBuilding(pid) : {};
    const meta = typeof AppStore !== 'undefined' ? AppStore.meta(pid) : {};
    const info = meta?.info || {};
    const utils = meta?.utilities || {};
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const parkingDisplay = typeof propertyHasParking === 'function' && propertyHasParking(meta)
        ? (typeof propertyParkingSummary === 'function' ? propertyParkingSummary(meta) : '—')
        : (building.parking || info.parking || 'Street / permit');

    const floorPlans = meta.floorPlans || [];
    const propertyPhotos = meta.photos?.length
        ? meta.photos
        : [IMG.props[pid] || IMG.props[0]];
    const cover = (t.unit && typeof getFlatCoverPhoto === 'function'
        ? getFlatCoverPhoto(pid, t.unit)
        : null)
        || (typeof getPropertyCoverPhoto === 'function' ? getPropertyCoverPhoto(pid) : propertyPhotos[0]);
    const unitGal = t.unit && typeof getFlatPhotoGallery === 'function' ? getFlatPhotoGallery(pid, t.unit) : null;
    const unitPhotos = unitGal?.photos?.length ? unitGal.photos : [];
    const appliances = meta.appliances || [];
    const rawAlarms = meta.alarms || [];
    const alarmEntries = (Array.isArray(rawAlarms) && rawAlarms.length)
        ? rawAlarms
        : (typeof ALARM_CATALOG !== 'undefined' && typeof alarmHasData === 'function'
            ? [
                ...ALARM_CATALOG.filter(a => alarmHasData(meta.alarms?.[a.key])).map(a => ({
                    ...meta.alarms[a.key],
                    name: `${a.label} Alarm`,
                    icon: a.icon,
                })),
                ...(meta.customAlarms || []).filter(a => typeof alarmHasData === 'function' ? alarmHasData(a) : true),
            ]
            : [
                { id: 'smoke', name: 'Smoke Alarm', location: 'Hallway / Landing', expiry: 'Exp: 15 Jan 2026', photo: typeof DEMO_ALARM_PHOTOS !== 'undefined' ? DEMO_ALARM_PHOTOS.smoke : '', icon: 'bell-ring' },
                { id: 'heat', name: 'Heat Alarm', location: 'Kitchen Ceiling', expiry: 'Exp: 15 Jan 2026', photo: typeof DEMO_ALARM_PHOTOS !== 'undefined' ? DEMO_ALARM_PHOTOS.heat : '', icon: 'thermometer' },
                { id: 'co', name: 'CO Alarm', location: 'Boiler Room / Bedroom', expiry: 'Exp: 15 Jan 2026', photo: typeof DEMO_ALARM_PHOTOS !== 'undefined' ? DEMO_ALARM_PHOTOS.co : '', icon: 'shield-alert' },
            ]);
    const invRooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(pid) : [];
    const photoGrid = typeof renderTenantReadonlyPhotoGrid === 'function'
        ? renderTenantReadonlyPhotoGrid
        : (photos) => `<div class="photo-gallery-grid">${(photos || []).map(src => `<img src="${esc(src)}" class="photo-gallery-img" alt="">`).join('')}</div>`;

    const buildingType = building.type || info.type || 'Block of Flats';
    const floorCount = building.floors != null ? String(building.floors) : (info.floors || '3');
    const unitCount = building.flatCount != null ? String(building.flatCount) : '4';
    const yearBuilt = building.yearBuilt || info.built || '2019';
    const landlordPhone = LANDLORD_USER.phone || '+44 7700 900123';

    const activeTab = STATE.buildingInfoTab || 'overview';

    const tabBtn = (tabKey, label, icon) => `
    <button type="button" data-action="set-building-tab" data-tab="${tabKey}" class="flex-1 py-2 px-2 rounded-xl text-[11.5px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === tabKey ? 'bg-white text-[#2563EB] shadow-xs border border-[#DBEAFE]' : 'text-[#64748B] hover:text-[#0F172A]'}">
        <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
        <span>${label}</span>
    </button>`;

    return `${topBar('Your building', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-content-sm screen-enter space-y-3.5 text-left pb-12">
        <!-- Sticky Top Category Segmented Control -->
        <div class="card p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center gap-1 shadow-inner">
            ${tabBtn('overview', 'Overview', 'building-2')}
            ${tabBtn('safety', 'Safety &amp; Meters', 'shield-alert')}
            ${tabBtn('appliances', 'Appliances', 'plug')}
            ${tabBtn('gallery', 'Photos &amp; Rules', 'image')}
        </div>

        ${activeTab === 'overview' ? `
        <!-- TAB 1: OVERVIEW -->
        <!-- 1. Building Passport Hero Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] mb-1.5">
                        <i data-lucide="building-2" class="w-3 h-3"></i>
                        Building &amp; Estate
                    </span>
                    <h2 class="text-[18px] font-extrabold text-[#0F172A] tracking-tight leading-snug m-0">${esc(p?.name || '')}</h2>
                    <p class="text-[12px] text-[#64748B] mt-0.5 m-0 flex items-center gap-1 leading-normal">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#94A3B8] shrink-0"></i>
                        <span>${esc(p?.address || '')}</span>
                    </p>
                </div>
                <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E2E8F0] shadow-2xs">
                    <img src="${esc(cover)}" alt="" class="w-full h-full object-cover">
                </div>
            </div>
            <div class="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#059669]"></span>
                    <span class="text-[12.5px] font-bold text-[#0F172A]">Your Home: <span class="text-[#2563EB]">${esc(t.unit || 'Flat')}</span></span>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]">Active Tenancy</span>
            </div>
        </div>

        <!-- 2. Modern 2x2 Bento Vitals Grid -->
        <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <i data-lucide="building-2" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Type</span>
                    <p class="text-[12.5px] font-bold text-[#0F172A] m-0 truncate">${esc(buildingType)}</p>
                </div>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    <i data-lucide="layers" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Floors</span>
                    <p class="text-[12.5px] font-bold text-[#0F172A] m-0">${esc(floorCount)} Storeys</p>
                </div>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    <i data-lucide="home" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Community</span>
                    <p class="text-[12.5px] font-bold text-[#0F172A] m-0">${esc(unitCount)} Flats</p>
                </div>
            </div>
            <div class="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                </div>
                <div class="min-w-0">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Year Built</span>
                    <p class="text-[12.5px] font-bold text-[#0F172A] m-0">${esc(yearBuilt)}</p>
                </div>
            </div>
        </div>

        <!-- 3. Dedicated Emergency Assistance Card -->
        <div class="card p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-xs space-y-2.5">
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                        <i data-lucide="phone-call" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0">
                        <span class="block text-[10.5px] font-bold text-[#92400E] uppercase tracking-wider">24/7 Landlord &amp; Emergency</span>
                        <p class="text-[13px] font-bold text-[#0F172A] m-0">${esc(landlordPhone)}</p>
                    </div>
                </div>
                <a href="tel:${esc(landlordPhone)}" class="px-3 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-[12px] font-bold shadow-2xs flex items-center gap-1.5 transition-colors shrink-0">
                    <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                    <span>Call</span>
                </a>
            </div>
            <p class="text-[11px] text-[#78350F] m-0 leading-normal">
                For urgent gas, electrical, or water leak emergencies, call immediately. For routine repairs, use <button type="button" data-go="log-maintenance" class="font-bold underline text-[#92400E] cursor-pointer">Report Issue</button>.
            </p>
        </div>

        <!-- 4. Inventory & Schedule of Condition Portal -->
        <button type="button" data-go="tenant-inventory" class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all w-full text-left flex items-center justify-between gap-3 group cursor-pointer">
            <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <i data-lucide="clipboard-check" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                        <h4 class="text-[14.5px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors m-0">Inventory &amp; Condition</h4>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] shrink-0">Deposit Protected</span>
                    </div>
                    <p class="text-[12px] text-[#64748B] m-0 truncate">Schedule of Condition · ${invRooms.length} room checklists &amp; photos</p>
                </div>
            </div>
            <div class="flex items-center gap-1 text-[#2563EB] text-[12px] font-bold shrink-0">
                <span>View</span>
                <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
            </div>
        </button>

        <!-- 5. Parking & EV Access -->
        ${(meta.parking?.type || meta.parking?.details || meta.parking?.permit || parkingDisplay !== '—') ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2.5">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Parking &amp; EV Access</p>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">Allocated Space</span>
            </div>
            <div class="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 shadow-xs">
                    <i data-lucide="car" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0">
                    <p class="text-[13px] font-bold text-[#0F172A] m-0">${esc(meta.parking?.type || parkingDisplay || 'Allocated Space')}</p>
                    <p class="text-[12px] text-[#475569] mt-0.5 m-0 font-medium">${esc(meta.parking?.details || (meta.parking?.bay ? `Bay #${meta.parking?.bay}` : 'Bay #PL-02'))} · <span class="text-[#64748B]">${esc(meta.parking?.permit ? (meta.parking.permit.toLowerCase().startsWith('permit') ? meta.parking.permit : `Permit ${meta.parking.permit}`) : 'Permit PL-BAY-02')}</span></p>
                    <p class="text-[11px] text-[#059669] font-medium mt-1 m-0 flex items-center gap-1"><i data-lucide="zap" class="w-3.5 h-3.5 text-[#059669]"></i> 7.4kW Type 2 Pod Point Charger Available</p>
                </div>
            </div>
        </div>` : ''}
        ` : activeTab === 'safety' ? `
        <!-- TAB 2: SAFETY & METERS -->
        <!-- Safety & Smoke Alarms -->
        ${alarmEntries.length ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Safety &amp; Detectors</p>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">All Tested OK</span>
            </div>
            <div class="space-y-2">
                ${alarmEntries.map(a => {
                    const sub = [a.location, a.makeModel, a.expiry && typeof formatInfoDate === 'function' ? `Expires ${formatInfoDate(a.expiry)}` : ''].filter(Boolean).join(' · ');
                    return `
                    <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-9 h-9 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                                <i data-lucide="${a.icon || 'bell-ring'}" class="w-4 h-4"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[13px] font-bold text-[#0F172A] m-0">${esc(a.name || 'Safety Detector')}</p>
                                <p class="text-[11px] text-[#64748B] m-0 mt-0.5">${esc(sub || 'Hallway')} · <span class="text-[#059669] font-semibold">Tested OK</span></p>
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-[#475569] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md shrink-0">Interlinked</span>
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}

        <!-- Meters & Emergency Isolation -->
        ${(utils.water || utils.elec || utils.gas) ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Meters &amp; Emergency Isolation</p>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">Connected</span>
            </div>
            <div class="space-y-2">
                ${utils.water ? `
                <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                            <i data-lucide="droplet" class="w-4 h-4"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[13px] font-bold text-[#0F172A] m-0">Water Stopcock</p>
                            <p class="text-[11.5px] text-[#64748B] m-0 mt-0.5 truncate">${esc(utils.water.shutOff || utils.water.meterLocation || 'Under kitchen sink')} · ${esc(utils.water.provider || 'Thames Water')}</p>
                        </div>
                    </div>
                    ${utils.water.meterNumber ? `<span class="text-[11px] font-mono text-[#475569] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md shrink-0">${esc(utils.water.meterNumber)}</span>` : ''}
                </div>` : ''}

                ${utils.elec ? `
                <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                            <i data-lucide="zap" class="w-4 h-4"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[13px] font-bold text-[#0F172A] m-0">Electricity Breaker</p>
                            <p class="text-[11.5px] text-[#64748B] m-0 mt-0.5 truncate">${esc(utils.elec.meterLocation || 'Hallway cupboard')} · ${esc(utils.elec.provider || 'EDF Energy')}</p>
                        </div>
                    </div>
                    ${utils.elec.meterNumber ? `<span class="text-[11px] font-mono text-[#475569] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md shrink-0">${esc(utils.elec.meterNumber)}</span>` : ''}
                </div>` : ''}

                ${utils.gas ? `
                <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-lg bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                            <i data-lucide="flame" class="w-4 h-4"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[13px] font-bold text-[#0F172A] m-0">Gas Isolation Valve</p>
                            <p class="text-[11.5px] text-[#64748B] m-0 mt-0.5 truncate">${esc(utils.gas.shutOff || utils.gas.meterLocation || 'External meter box')} · ${esc(utils.gas.provider || 'British Gas')}</p>
                        </div>
                    </div>
                    ${utils.gas.meterNumber ? `<span class="text-[11px] font-mono text-[#475569] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md shrink-0">${esc(utils.gas.meterNumber)}</span>` : ''}
                </div>` : ''}
            </div>
        </div>` : ''}
        ` : activeTab === 'appliances' ? `
        <!-- TAB 3: APPLIANCES -->
        ${appliances.length ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Appliances &amp; Manuals</p>
                <span class="text-[11px] font-semibold text-[#64748B]">${appliances.length} Recorded</span>
            </div>
            <div class="space-y-2">
                ${appliances.map(a => {
                    const photo = typeof isFieldPhotoPreviewable === 'function' && isFieldPhotoPreviewable(a.photo) ? a.photo : '';
                    const icon = typeof applianceIcon === 'function' ? applianceIcon(a.name) : 'plug';
                    return `
                    <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                        ${photo ? `<img src="${esc(photo)}" alt="" class="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#E2E8F0]">`
                            : `<div class="w-10 h-10 rounded-xl bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0"><i data-lucide="${icon}" class="w-5 h-5"></i></div>`}
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                                <p class="text-[13px] font-bold text-[#0F172A] m-0 truncate">${esc(a.name || 'Appliance')}</p>
                                ${a.warranty ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] shrink-0">${esc(a.warranty)}</span>` : ''}
                            </div>
                            ${a.brand ? `<p class="text-[12px] text-[#64748B] mt-0.5 m-0 font-medium">${esc(a.brand)}</p>` : ''}
                            ${a.description ? `<p class="text-[11px] text-[#475569] mt-0.5 m-0 leading-relaxed">${esc(a.description)}</p>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>` : `<div class="card p-6 rounded-2xl bg-white border border-[#E2E8F0] text-center"><p class="text-[13px] text-[#64748B]">No appliances recorded yet.</p></div>`}
        ` : `
        <!-- TAB 4: GALLERY & RULES -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Property Photos</p>
                <span class="text-[11px] font-semibold text-[#64748B]">${propertyPhotos.length} photo${propertyPhotos.length === 1 ? '' : 's'}</span>
            </div>
            <p class="text-[12px] text-[#64748B] m-0">Uploaded by your landlord for the building.</p>
            ${photoGrid(propertyPhotos, { coverBadge: true, empty: 'No property photos uploaded yet.' })}
        </div>

        ${t.unit && unitPhotos.length ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between gap-2">
                <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">${esc(t.unit)} Photos</p>
                <span class="text-[11px] font-semibold text-[#64748B]">${unitPhotos.length} photo${unitPhotos.length === 1 ? '' : 's'}</span>
            </div>
            ${photoGrid(unitPhotos, { coverBadge: true, empty: 'No unit photos uploaded yet.' })}
        </div>` : ''}

        ${floorPlans.length ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-0">Floor Plans</p>
            ${photoGrid(floorPlans, { empty: 'No floor plans yet.' })}
        </div>` : ''}

        ${info.notes ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider m-0">Building Notes</p>
            <p class="text-[13px] text-[#475569] leading-relaxed m-0 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">${esc(info.notes)}</p>
        </div>` : ''}

        <button type="button" data-go="tenant-house-rules" class="btn-secondary w-full py-3.5 rounded-2xl text-[13px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="scroll-text" class="w-4 h-4 text-[#2563EB]"></i>
            <span>House Rules &amp; Regulations</span>
        </button>
        `}
    </div>`;
}

function screenTenantInventory() {
    const t = getActiveTenant();
    if (t?.propertyId == null) {
        return `${topBar('Inventory', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Join a flat first to view inventory.</p></div>`;
    }
    const pid = t.propertyId;
    const p = PROPERTIES[pid];
    const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(t.id) : null;
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(pid) : [];
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const depAmount = fin?.deposit || '£2,450';

    let totalItems = 0;
    let totalPhotos = 0;
    const roomCards = rooms.map(([name, sub, icon, idx, condSum]) => {
        const itemObjs = typeof getInventoryItemObjects === 'function'
            ? getInventoryItemObjects(pid, idx)
            : (typeof getInventoryItems === 'function' ? getInventoryItems(pid, idx).map(n => ({ name: n })) : []);
        totalItems += itemObjs.length;
        const invKey = typeof inventoryKey === 'function' ? inventoryKey(pid, idx) : `${pid}-${idx}`;
        const photos = AppStore.inventory?.[invKey]?.photos || [];
        totalPhotos += photos.length;
        const previewItems = itemObjs.slice(0, 3).map(it => it.name).join(' · ');
        return { name, sub, icon, idx, condSum, itemCount: itemObjs.length, photoCount: photos.length, previewItems };
    });

    return `${topBar('Inventory & Condition', { back: true, sub: [t?.unit, p?.name].filter(Boolean).join(' · ') })}
    <div class="screen-content screen-content-sm space-y-3.5 text-left pb-12">
        <!-- 1. Deposit & Legal Protection Passport Banner -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5] mb-1.5">
                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                        Deposit Protected
                    </span>
                    <h2 class="text-[17px] font-extrabold text-[#0F172A] tracking-tight m-0">Check-in Schedule of Condition</h2>
                    <p class="text-[12px] text-[#64748B] mt-1 m-0 leading-relaxed">
                        Handover report recorded at move-in for <strong class="text-[#0F172A]">${esc(t.unit || 'your unit')}</strong>. Protects your <strong class="text-[#0F172A]">${esc(depAmount)}</strong> deposit from pre-existing wear.
                    </p>
                </div>
            </div>

            <!-- 3-Column Balanced Vitals KPI Grid -->
            <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#F1F5F9]">
                <div class="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Rooms</span>
                    <span class="text-[15px] font-black text-[#0F172A] mt-0.5 block">${rooms.length}</span>
                </div>
                <div class="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Fixtures</span>
                    <span class="text-[15px] font-black text-[#0F172A] mt-0.5 block">${totalItems}</span>
                </div>
                <div class="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <span class="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Photos</span>
                    <span class="text-[15px] font-black text-[#2563EB] mt-0.5 block">${totalPhotos}</span>
                </div>
            </div>
        </div>

        <!-- 2. Room Checklists Section -->
        <div class="flex items-center justify-between px-1 mt-1">
            <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Room Checklists (${rooms.length})</span>
            <span class="text-[11px] text-[#64748B]">Tap room to inspect items</span>
        </div>

        <div class="space-y-2.5">
            ${roomCards.length ? roomCards.map(r => `
            <button type="button" data-go="tenant-inventory-room" data-room="${r.idx}" class="card w-full p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all text-left flex items-start justify-between gap-3 group cursor-pointer">
                <div class="flex items-start gap-3.5 min-w-0 flex-1">
                    <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs mt-0.5">
                        <i data-lucide="${r.icon || 'package'}" class="w-5 h-5"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="text-[14.5px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors m-0 truncate">${esc(r.name)}</h4>
                            ${r.condSum ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${r.condSum.class}">${r.condSum.label}</span>` : ''}
                        </div>
                        <div class="flex items-center gap-2 text-[11.5px] text-[#64748B] mb-1.5 flex-wrap">
                            <span class="font-medium">${r.itemCount} fixture${r.itemCount === 1 ? '' : 's'}</span>
                            ${r.photoCount ? `<span>·</span><span class="text-[#2563EB] font-semibold">${r.photoCount} photo${r.photoCount === 1 ? '' : 's'}</span>` : ''}
                        </div>
                        ${r.previewItems ? `<p class="text-[11.5px] text-[#94A3B8] m-0 truncate leading-tight">${esc(r.previewItems)}</p>` : ''}
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0 mt-3"></i>
            </button>`).join('') : `
            <div class="empty-state card p-6 text-center rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
                <i data-lucide="package" class="w-10 h-10 text-[#CBD5E1] mx-auto mb-2"></i>
                <p class="text-[14px] font-bold text-[#0F172A] m-0">No room inventory recorded</p>
                <p class="text-[12px] text-[#64748B] m-0 mt-1">When your landlord finishes recording check-in condition, it will appear here.</p>
            </div>`}
        </div>

        <!-- 3. Actions / Export -->
        <div class="pt-2 space-y-2">
            <button type="button" data-action="download-inventory-report" class="btn-primary w-full py-3.5 rounded-2xl text-[13px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Download Signed Report (PDF)</span>
            </button>
            <button type="button" data-go="log-maintenance" class="btn-secondary w-full py-3 rounded-2xl text-[12.5px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-[#D97706]"></i>
                <span>Report Inventory Discrepancy</span>
            </button>
        </div>
    </div>`;
}

function screenTenantInventoryRoom() {
    const t = getActiveTenant();
    const pid = t?.propertyId;
    const rid = STATE.roomId ?? 0;
    if (pid == null) {
        return `${topBar('Room', { back: true })}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Room not found.</p></div>`;
    }
    const rooms = typeof getInventoryRooms === 'function' ? getInventoryRooms(pid) : [];
    const room = rooms[rid] || rooms[0];
    const roomName = room?.[0] || 'Room';
    const items = typeof getInventoryItemObjects === 'function' ? getInventoryItemObjects(pid, rid) : [];
    const notes = typeof getInventoryNotes === 'function' ? getInventoryNotes(pid, rid) : '';
    const roomSize = typeof getInventoryRoomSize === 'function' ? getInventoryRoomSize(pid, rid) : '';
    const invKey = typeof inventoryKey === 'function' ? inventoryKey(pid, rid) : `${pid}-${rid}`;
    const roomPhotos = AppStore.inventory?.[invKey]?.photos || [];
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const photoGrid = typeof renderTenantReadonlyPhotoGrid === 'function'
        ? renderTenantReadonlyPhotoGrid(roomPhotos, { coverBadge: true, empty: 'No photos for this room yet.' })
        : '';
    const condSum = room?.[4] || { label: 'All Good', class: 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]' };

    return `${topBar(roomName, { back: true, sub: 'Room Inventory & Fixtures' })}
    <div class="screen-content screen-content-sm space-y-3.5 text-left pb-12">
        <!-- 1. Room Overview Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Room Details</span>
                    <h3 class="text-[18px] font-extrabold text-[#0F172A] tracking-tight m-0 mt-0.5">${esc(roomName)}</h3>
                </div>
                <span class="text-[10.5px] font-bold px-2.5 py-1 rounded-full ${condSum.class} shrink-0">
                    ${condSum.label}
                </span>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                ${roomSize ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11.5px] font-semibold text-[#334155]"><i data-lucide="maximize" class="w-3.5 h-3.5 text-[#2563EB]"></i> ${esc(roomSize)} sq ft</span>` : ''}
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EFF6FF] text-[11.5px] font-semibold text-[#2563EB]"><i data-lucide="package" class="w-3.5 h-3.5"></i> ${items.length} ${items.length === 1 ? 'fixture' : 'fixtures'}</span>
                ${roomPhotos.length ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ECFDF5] text-[11.5px] font-semibold text-[#059669]"><i data-lucide="camera" class="w-3.5 h-3.5"></i> ${roomPhotos.length} ${roomPhotos.length === 1 ? 'photo' : 'photos'}</span>` : ''}
            </div>
        </div>

        <!-- 2. Room Inspection Photos Section -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between">
                <div>
                    <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider m-0">Room Photos (${roomPhotos.length})</span>
                    <span class="text-[11px] text-[#94A3B8]">Recorded at check-in handover</span>
                </div>
                <span class="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">Verified</span>
            </div>
            ${photoGrid || `<p class="text-[12px] text-[#94A3B8] m-0 italic">No room photos uploaded yet.</p>`}
        </div>

        <!-- 3. Fixtures & Condition Schedule -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div>
                    <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider m-0">Fixtures &amp; Condition (${items.length})</span>
                    <span class="text-[11px] text-[#94A3B8]">Handover condition recorded</span>
                </div>
                <span class="text-[10.5px] text-[#64748B] font-semibold">Protected</span>
            </div>

            ${items.length ? `
            <div class="divide-y divide-[#F1F5F9]">
                ${items.map(item => {
                    const itemName = item.name || 'Fixture';
                    const cond = item.condition || 'Good';
                    const itemPhotos = item.photos || [];
                    const badgeClass = typeof inventoryConditionBadgeClass === 'function' ? inventoryConditionBadgeClass(cond) : 'bg-[#DCFCE7] text-[#16A34A]';
                    return `
                    <div class="py-3 space-y-2">
                        <div class="flex items-center justify-between gap-2.5">
                            <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                <span class="w-1.5 h-1.5 rounded-full ${cond === 'Good' ? 'bg-[#10B981]' : (cond === 'Fair' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]')} shrink-0"></span>
                                <span class="text-[13.5px] font-bold text-[#0F172A] truncate">${esc(itemName)}</span>
                            </div>
                            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs ${badgeClass} shrink-0">
                                ${esc(cond)}
                            </span>
                        </div>
                        ${itemPhotos.length ? `
                        <div class="flex items-center gap-2 pl-4 overflow-x-auto py-1">
                            ${itemPhotos.map((pUrl) => `
                            <div class="relative group/photo shrink-0">
                                <img src="${esc(pUrl)}" alt="${esc(itemName)}" class="w-14 h-14 object-cover rounded-xl border border-[#E2E8F0] shadow-2xs">
                            </div>`).join('')}
                        </div>` : ''}
                    </div>`;
                }).join('')}
            </div>` : `
            <div class="text-center py-4">
                <p class="text-[13px] text-[#94A3B8] m-0">No items listed for this room.</p>
            </div>`}
        </div>

        <!-- 4. Room Handover Notes -->
        ${notes ? `
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
            <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Handover Notes &amp; Observations</span>
            <p class="text-[13px] text-[#334155] leading-relaxed m-0 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">${esc(notes)}</p>
        </div>` : ''}

        <!-- 5. Action: Report Discrepancy -->
        <button type="button" data-go="log-maintenance" class="btn-secondary w-full py-3 rounded-2xl text-[12.5px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-[#2563EB]"></i>
            <span>Report Discrepancy for ${esc(roomName)}</span>
        </button>
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
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `${topBar('Announcements', { back: true, sub: 'From your landlord' })}
    <div class="screen-content screen-enter stack-sm">
        ${items.length ? items.map(a => `
        <button type="button" data-go="tenant-announcement-detail" data-bid="${a.id}" class="tnt-announce card w-full text-left">
            ${a.image ? `<img src="${a.image}" alt="" class="tnt-announce-thumb">` : ''}
            <div class="tnt-announce-head">
                <p class="tnt-announce-title">${esc(a.title)}</p>
                <span class="badge bg-[#EFF6FF] text-[#2563EB]">${audienceLabel(a)}</span>
            </div>
            <p class="tnt-announce-body">${esc(a.body.length > 100 ? `${a.body.slice(0, 100)}…` : a.body)}</p>
            <p class="tnt-announce-meta"><i data-lucide="calendar" class="w-3 h-3"></i>${esc(a.date)} · ${esc(a.from)}</p>
            <i data-lucide="chevron-right" class="tnt-announce-chevron w-4 h-4"></i>
        </button>`).join('') : `
        <div class="empty-state card">
            <i data-lucide="megaphone" class="w-10 h-10 text-[#CBD5E1]"></i>
            <p class="empty-state-title">No announcements yet</p>
            <p class="empty-state-desc">Your landlord will post building updates here.</p>
        </div>`}
    </div>`;
}

function screenTenantAnnouncementDetail() {
    const t = getActiveTenant();
    const b = typeof broadcastById === 'function' ? broadcastById(STATE.broadcastId) : null;
    if (!b || !t || !broadcastVisibleToTenant(b, t)) {
        return `${topBar('Announcement', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">Announcement not found.</p></div>`;
    }
    if (typeof markBroadcastsReadForTenant === 'function') markBroadcastsReadForTenant(t);
    const content = typeof renderBroadcastDetailContent === 'function'
        ? renderBroadcastDetailContent(b)
        : `<div class="card p-4"><p>${typeof escapeHtml === 'function' ? escapeHtml(b.body) : b.body}</p></div>`;
    return `${topBar('Announcement', { back: true, sub: b.date })}
    <div class="screen-content screen-enter broadcast-detail-page">
        ${content}
    </div>`;
}

function screenTenantHouseRules() {
    const t = getActiveTenant();
    const rules = typeof houseRulesForTenant === 'function' ? houseRulesForTenant(t) : [];
    const pid = t?.propertyId ?? 0;
    const p = (typeof PROPERTIES !== 'undefined' && PROPERTIES[pid]) ? PROPERTIES[pid] : { name: 'Your Building' };

    const badge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">${rules.length} Rules</span>`;

    return `${topBar('House rules', { back: true, sub: p.name || '', rightBtn: badge })}
    <div class="screen-content screen-enter space-y-3 text-left pb-8">
        <div class="space-y-2">
            ${rules.map((r, i) => `
            <div class="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-3">
                <span class="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-[11.5px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#DBEAFE]">${i + 1}</span>
                <div class="text-[13.5px] font-normal text-[#334155] leading-relaxed flex-1 min-w-0">${typeof formatHouseRuleDisplay === 'function' ? formatHouseRuleDisplay(r) : (typeof escapeHtml === 'function' ? escapeHtml(r) : r)}</div>
            </div>`).join('')}
        </div>
    </div>`;
}

function screenTenantPaymentHistory() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const kind = STATE.tenantPayFilter || 'rent';
    const rows = typeof tenantInvoicesByKind === 'function' ? tenantInvoicesByKind(tid, kind) : [];
    const tabs = [['rent', 'Rent'], ['charges', 'Extra charges'], ['maintenance', 'Maintenance']];
    const unpaid = rows.filter(i => i.status !== 'Paid');
    const paid = rows.filter(i => i.status === 'Paid');
    const dueTotal = unpaid.reduce((s, i) => s + (typeof parseRentAmount === 'function' ? parseRentAmount(i.amount) : 0), 0);
    const renderRow = inv => typeof renderTenantPaymentRow === 'function' ? renderTenantPaymentRow(inv) : '';
    const emptyCopy = {
        rent: { title: 'No rent payments yet', desc: 'Your monthly rent payments will show here.' },
        charges: { title: 'No extra charges', desc: 'Utility, repair, penalty and custom charges from your landlord appear here.' },
        maintenance: { title: 'No maintenance bills', desc: 'Repair shares and utility overage bills will show here.' },
    };
    const empty = emptyCopy[kind] || emptyCopy.charges;
    const pay = typeof tenantPaymentSummary === 'function' ? tenantPaymentSummary(tid) : {};
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const nextDue = pay.nextDueDate && pay.nextDueDate !== '—' ? pay.nextDueDate : 'Jul 1, 2026';
    const formattedDue = typeof formatRentAmount === 'function' ? formatRentAmount(dueTotal) : `£${dueTotal}`;

    return `${topBar('Payment history', { back: true, sub: 'Rent & charges ledger' })}
    <div class="screen-content screen-enter txn-page space-y-4 pb-12">
        <!-- 1. Executive Financial Balance Hero Card (Single unified card matching landlord design) -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3.5">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                        ${kind === 'rent' ? 'Rent Balance' : kind === 'charges' ? 'Extra Charges' : 'Maintenance Balance'}
                    </span>
                    <div class="flex items-baseline gap-2 mt-1">
                        <span class="text-[30px] font-black text-[#0F172A] tracking-tight leading-none">${formattedDue}</span>
                    </div>
                    <p class="text-[12px] text-[#64748B] mt-2 m-0 flex items-center gap-1.5 leading-normal">
                        <i data-lucide="calendar" class="w-3.5 h-3.5 text-[#94A3B8] shrink-0"></i>
                        ${dueTotal > 0 ? `<span>Next payment due <strong class="text-[#0F172A]">${esc(nextDue)}</strong></span>` : `<span class="text-[#059669] font-medium">All payments up to date</span>`}
                    </p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 shadow-2xs ${dueTotal > 0 ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' : 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'}">
                    ${dueTotal > 0 ? `${unpaid.length} Bill${unpaid.length === 1 ? '' : 's'} Outstanding` : 'Settled'}
                </span>
            </div>

            ${dueTotal > 0 ? `
            <button type="button" data-action="tenant-pay" data-kind="${kind}" data-iid="${unpaid[0]?.id ?? ''}" class="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer text-[13.5px]">
                <i data-lucide="credit-card" class="w-4 h-4"></i>
                <span>Pay ${formattedDue} now</span>
            </button>` : ''}
        </div>

        <!-- 2. Consistent Filter Tabs (Landlord Design Tokens) -->
        <div class="fin-segments txn-segments">
            ${tabs.map(([k, l]) => `
            <button type="button" data-tenant-pay-filter="${k}" class="fin-segment ${kind === k ? 'active' : ''}">
                <span class="fin-segment-label">${l}</span>
            </button>`).join('')}
        </div>

        <!-- 3. Transaction Lists -->
        ${!rows.length ? `
        <div class="empty-state card p-6 text-center rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <i data-lucide="receipt" class="w-10 h-10 text-[#CBD5E1] mx-auto mb-2"></i>
            <p class="text-[14px] font-bold text-[#0F172A] m-0">${empty.title}</p>
            <p class="text-[12px] text-[#64748B] m-0 mt-1">${empty.desc}</p>
        </div>` : `
        ${unpaid.length ? `
        <div>
            <div class="flex items-center justify-between px-1 mb-2">
                <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Outstanding (${unpaid.length})</span>
                <span class="text-[11px] text-[#D97706] font-semibold">Action required</span>
            </div>
            <div class="txn-list">${unpaid.map(renderRow).join('')}</div>
        </div>` : ''}

        ${paid.length ? `
        <div>
            <div class="flex items-center justify-between px-1 mb-2 mt-2">
                <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Paid History (${paid.length})</span>
                <span class="text-[11px] text-[#059669] font-medium flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> Verified</span>
            </div>
            <div class="txn-list">${paid.map(renderRow).join('')}</div>
        </div>` : ''}

        <button type="button" data-action="export-rent-pdf" class="btn-secondary w-full py-3 rounded-2xl text-[12.5px] font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-1">
            <i data-lucide="download" class="w-3.5 h-3.5 text-[#2563EB]"></i>
            <span>Download Statement (PDF)</span>
        </button>`}
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
    const payLabel = kind === 'rent'
        ? 'Rent'
        : (typeof chargeInvoiceLabel === 'function' ? chargeInvoiceLabel(inv) : 'Bill');
    const payFn = typeof openStripeCheckout === 'function' ? openStripeCheckout : (opts) => {
        toast('Opening Stripe…');
        setTimeout(() => opts.onSuccess?.(), 700);
    };
    payFn({
        amount: inv.amount,
        label: payLabel,
        onSuccess: () => {
            stampInvoicePaid(inv, {
                paidOn: typeof formatEventDate === 'function' ? formatEventDate() : 'Today',
                paymentMethod: 'Stripe',
            });
            if (typeof syncTransactionsFromInvoices === 'function') syncTransactionsFromInvoices();
            if (typeof AppStore !== 'undefined') AppStore.save();
            toast(kind === 'rent' ? 'Rent paid — download your receipt' : `${payLabel} paid — download receipt`);
            go('invoice-detail', { invoiceId: inv.id });
        },
    });
}

function renderTenantIssueCard(item) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const photos = typeof getMaintReportPhotos === 'function' ? getMaintReportPhotos(item) : [];
    const photoSrc = photos[0] || (IMG.maint[item.id % IMG.maint.length]);
    const rawVideos = typeof getMaintReportVideos === 'function' ? getMaintReportVideos(item) : (item.videos || item.reportVideos || []);
    const hasVideo = rawVideos.length > 0;

    const isDone = item.status === 'done';
    const isProgress = item.status === 'progress' || item.status === 'in_progress';
    const isScheduled = item.status === 'scheduled';

    let statusLabel = 'Awaiting Review';
    let statusCls = 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
    if (isDone) {
        statusLabel = 'Completed';
        statusCls = 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]';
    } else if (isProgress) {
        statusLabel = 'In Progress';
        statusCls = 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]';
    } else if (isScheduled) {
        statusLabel = 'Visit Scheduled';
        statusCls = 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
    }

    const contractor = item.contractor && item.contractor !== '—' ? item.contractor : 'Landlord Reviewing';
    const when = item.reportedAt || item.time || 'Today';
    const isUrgent = String(item.priority || '').toLowerCase() === 'high' || String(item.priority || '').toLowerCase() === 'urgent';

    return `
    <button type="button" data-go="maintenance-detail" data-mid="${item.id}" class="card p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-sm hover:border-[#CBD5E1] transition-all flex items-start gap-3.5 w-full text-left group cursor-pointer">
        <div class="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E2E8F0] shadow-2xs">
            <img src="${esc(photoSrc)}" alt="" class="w-full h-full object-cover">
            ${hasVideo ? `<span class="absolute inset-0 bg-black/30 flex items-center justify-center text-white"><i data-lucide="play" class="w-4 h-4 fill-white"></i></span>` : ''}
        </div>
        <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
                <h4 class="text-[14px] font-bold text-[#0F172A] m-0 group-hover:text-[#2563EB] transition-colors truncate">${esc(item.issue)}</h4>
                <span class="text-[11px] font-medium text-[#94A3B8] shrink-0">${esc(when)}</span>
            </div>
            <p class="text-[12px] font-medium text-[#64748B] m-0 mt-1 flex items-center gap-1.5">
                <i data-lucide="hard-hat" class="w-3.5 h-3.5 text-[#64748B]"></i>
                <span class="truncate">${esc(contractor)}</span>
            </p>
            <div class="flex flex-wrap items-center gap-1.5 mt-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCls}">
                    ${statusLabel}
                </span>
                ${isUrgent ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">Urgent</span>` : ''}
                ${hasVideo ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] flex items-center gap-1"><i data-lucide="video" class="w-3 h-3"></i> Video</span>` : ''}
                ${photos.length > 1 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">${photos.length} photos</span>` : ''}
            </div>
        </div>
        <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0 mt-4"></i>
    </button>`;
}

function screenTenantIssues() {
    const t = getActiveTenant();
    if (!t) return `${topBar('Maintenance')}<div class="screen-content"><p class="text-[13px] text-[#64748B]">Sign in as tenant to view issues.</p></div>`;
    const issues = typeof tenantMaintenanceForAccount === 'function' ? tenantMaintenanceForAccount(t) : [];
    const openCount = issues.filter(m => m.status !== 'done').length;
    return `${topBar('Maintenance', { back: true, sub: `${openCount} open` })}
    <div class="screen-content screen-enter tnt-issues-page space-y-3.5 pb-8 text-left">
        <div class="flex items-center justify-between pb-1">
            <div>
                <h3 class="text-[16px] font-bold text-[#0F172A] m-0">Your Requests</h3>
                <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">${openCount} active request${openCount === 1 ? '' : 's'}</p>
            </div>
            <button type="button" data-go="log-maintenance" class="btn-primary py-2 px-3.5 rounded-xl text-[12px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Report Issue</span>
            </button>
        </div>
        ${issues.length ? `
        <div class="space-y-2.5">
            ${issues.map(m => renderTenantIssueCard(m)).join('')}
        </div>` : `
        <div class="empty-state card p-8 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div class="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-3">
                <i data-lucide="wrench" class="w-6 h-6"></i>
            </div>
            <p class="text-[15px] font-bold text-[#0F172A] m-0">No open requests</p>
            <p class="text-[12px] text-[#64748B] mt-1 m-0">Report maintenance inside your flat — your landlord will dispatch a certified contractor.</p>
            <button type="button" data-go="log-maintenance" class="btn-primary w-full py-3 rounded-xl text-[13px] font-bold mt-4 shadow-sm">+ Report new issue</button>
        </div>`}
    </div>`;
}

function screenTenantDocuments() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const body = typeof renderTenantDocFolderBrowser === 'function'
        ? renderTenantDocFolderBrowser(tid)
        : (typeof getTenantDocuments === 'function' && getTenantDocuments(tid).length && typeof renderTenantDocThumbGrid === 'function'
            ? renderTenantDocThumbGrid(getTenantDocuments(tid), tid)
            : `<div class="empty-state card">
                <i data-lucide="folder-open" class="w-10 h-10 text-[#CBD5E1]"></i>
                <p class="empty-state-title">No documents shared yet</p>
                <p class="empty-state-desc">Your landlord will share tenancy files and certificates here.</p>
            </div>`);
    return `${topBar('Documents', { back: true, sub: 'Shared with you' })}
    <div class="screen-content screen-enter">
        <p class="text-[13px] text-[#64748B] mb-3">Tenancy agreement, compliance certificates and files your landlord has shared — organised by folder.</p>
        ${body}
    </div>`;
}

function screenTenantReferencing() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const ref = typeof getTenantReferencing === 'function' ? getTenantReferencing(tid) : {};
    return `${topBar('Tenant referencing', { back: true })}
    <div class="screen-content screen-enter space-y-3 text-left">
        <p class="text-[12.5px] font-medium text-[#64748B] m-0 mb-3 leading-relaxed">Documents and details collected during your application. Upload missing items for landlord review.</p>
        ${(typeof TENANT_REF_SECTIONS !== 'undefined' ? TENANT_REF_SECTIONS : []).map(sec => {
            const data = ref[sec.key] || { status: 'missing' };
            const [label, bg, color] = typeof tenantRefStatusLabel === 'function' ? tenantRefStatusLabel(data.status) : ['Pending', '#FEF3C7', '#D97706'];
            return `
        <button type="button" data-go="tenant-ref-detail" data-ref-key="${sec.key}" class="card p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm w-full text-left flex items-center justify-between gap-3 min-h-[72px] hover:border-[#BFDBFE] transition-all cursor-pointer group">
            <div class="flex items-center gap-3.5 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE] group-hover:bg-[#DBEAFE] transition-colors">
                    <i data-lucide="${sec.icon}" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <h4 class="text-[14px] font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate m-0">${sec.label}</h4>
                    <p class="text-[11.5px] font-medium text-[#64748B] m-0 mt-0.5 truncate">${sec.hint || 'Verification & details'}</p>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0" style="background:${bg};color:${color}">${label}</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform shrink-0"></i>
            </div>
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
    const p = PROPERTIES[t?.propertyId];
    const fin = typeof getTenantFinancials === 'function' ? getTenantFinancials(tid) : null;
    const tenancy = typeof getTenancyForUnit === 'function' ? getTenancyForUnit(t?.propertyId, t?.unit) : null;
    const moveInLabel = fin?.moveIn && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.moveIn) || fin.moveIn
        : (fin?.moveIn || t?.moveIn || '—');
    const leaseEndLabel = fin?.leaseEnd && typeof formatDisplayDate === 'function'
        ? formatDisplayDate(fin.leaseEnd) || fin.leaseEnd
        : (fin?.leaseEnd || t?.leaseEnd || '—');
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    const unitObj = p && typeof getPropertyUnits === 'function'
        ? getPropertyUnits(p.id).find(u => (typeof unitName === 'function' ? unitName(u) : u.name) === t?.unit)
        : null;
    const cover = (t?.unit && typeof getFlatCoverPhoto === 'function'
        ? getFlatCoverPhoto(t.propertyId, t.unit)
        : null)
        || (typeof getPropertyCoverPhoto === 'function'
            ? getPropertyCoverPhoto(t.propertyId)
            : (IMG.props[t?.propertyId] || IMG.props[0]));
    const unitGal = (t?.unit && typeof getFlatPhotoGallery === 'function')
        ? getFlatPhotoGallery(t.propertyId, t.unit)
        : null;
    const photoCount = unitGal?.photos?.length || 0;

    const beds = unitObj?.beds ?? 3;
    const baths = unitObj?.baths ?? 2;
    const sqft = unitObj?.sqft ?? 1050;
    const rentAmount = fin?.rent || t?.rent || '£2,450';
    const isGroup = tenancy?.type === 'group';

    const more = [
        ['file-text', 'Documents', 'tenant-documents'],
        ['scroll-text', 'House rules', 'tenant-house-rules'],
        ['package', 'Inventory', 'tenant-inventory'],
        ['building-2', 'Building info', 'tenant-building-info'],
        ['shield-check', 'Compliance', 'tenant-compliance'],
        ['bell', 'Reminders', 'tenant-reminders'],
        ['megaphone', 'Announcements', 'tenant-announcements'],
    ];
    const { members } = typeof getFlatMemberRoster === 'function'
        ? getFlatMemberRoster(t?.propertyId, t?.unit)
        : { members: [] };
    const showHousehold = isGroup && members.length > 1;

    return `${topBar('Active tenancy', { back: true, sub: [t?.unit, p?.name].filter(Boolean).join(' · ') })}
    <div class="screen-content screen-enter space-y-3.5 text-left pb-6">
        <!-- 1. Property & Home Hero Card (Balanced, cohesive, with photos & vitals) -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5] mb-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                        Currently living here
                    </span>
                    <h2 class="text-[17px] font-extrabold text-[#0F172A] tracking-tight leading-snug m-0">${esc(t?.unit || 'Unit')} · ${esc(p?.name || 'Property')}</h2>
                    <p class="text-[12px] text-[#64748B] mt-0.5 m-0 leading-normal">${esc(p?.address || '—')}</p>
                </div>
                <button type="button" data-go="tenant-building-info" class="relative rounded-xl overflow-hidden shrink-0 w-16 h-16 border border-[#E2E8F0] group cursor-pointer" title="View property photos">
                    <img src="${esc(cover)}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    ${photoCount ? `<span class="absolute bottom-1 right-1 px-1.5 py-0.2 rounded-md bg-black/70 text-white text-[9px] font-bold">${photoCount}📷</span>` : ''}
                </button>
            </div>

            <!-- Balanced Unit Vitals Chips (Clean flex-wrap layout - NO scrollbars) -->
            <div class="pt-3 border-t border-[#F1F5F9] flex items-center flex-wrap gap-1.5 py-0.5">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#334155] shrink-0">
                    <i data-lucide="bed-double" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                    <span>${beds} Beds</span>
                </span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#334155] shrink-0">
                    <i data-lucide="bath" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                    <span>${baths} Baths</span>
                </span>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#334155] shrink-0">
                    <i data-lucide="ruler" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                    <span>${Number(sqft).toLocaleString()} sq ft</span>
                </span>
                ${unitObj?.furnished ? `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#334155] shrink-0">
                    <i data-lucide="sofa" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                    <span>${esc(unitObj.furnished)}</span>
                </span>` : ''}
            </div>
        </div>

        <!-- 2. Lease & Financial Terms Card (High-hierarchy, 2-column balanced grid) -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3.5">
            <div class="flex items-start justify-between">
                <div>
                    <span class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Lease Agreement</span>
                    <div class="flex items-baseline gap-1.5 mt-1">
                        <span class="text-[28px] font-black text-[#0F172A] tracking-tight">${esc(rentAmount)}</span>
                        <span class="text-[12px] font-semibold text-[#64748B]">/ month</span>
                    </div>
                </div>
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] shrink-0">
                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
                    <span>${isGroup ? 'Group Lease' : 'Solo Lease'}</span>
                </span>
            </div>

            <!-- Clean Key Dates Row (No inner background boxes) -->
            <div class="grid grid-cols-2 gap-3 py-1 border-t border-[#F1F5F9] text-left">
                <div>
                    <span class="block text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">Move-in Date</span>
                    <p class="text-[14px] font-extrabold text-[#0F172A] mt-0.5 m-0">${esc(moveInLabel)}</p>
                </div>
                <div>
                    <span class="block text-[10.5px] font-bold text-[#64748B] uppercase tracking-wider">Lease Ends</span>
                    <p class="text-[14px] font-extrabold text-[#0F172A] mt-0.5 m-0">${esc(leaseEndLabel)}</p>
                </div>
            </div>

            <div class="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11.5px] text-[#64748B]">
                <span class="flex items-center gap-1.5">
                    <i data-lucide="calendar" class="w-3.5 h-3.5 text-[#94A3B8]"></i>
                    <span>Fixed term tenancy</span>
                </span>
                <button type="button" data-go="tenant-documents" class="text-[#2563EB] font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                    <span>View Agreement</span>
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                </button>
            </div>
        </div>

        <!-- 3. Deposit Section -->
        ${typeof renderTenantDepositSection === 'function' ? renderTenantDepositSection(tid) : ''}

        <!-- 4. Group Members (if applicable) -->
        ${showHousehold && typeof renderTenantAccountMembers === 'function' ? renderTenantAccountMembers(tid) : ''}

        <!-- 5. Hub & Records List -->
        <div>
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1 mb-2">Property Records &amp; Info</p>
            <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden">
                ${more.map(([icon, label, go]) => `
                <button type="button" data-go="${go}" class="w-full p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                            <i data-lucide="${icon}" class="w-4 h-4"></i>
                        </div>
                        <span class="text-[13px] font-bold text-[#0F172A] truncate">${label}</span>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
                </button>`).join('')}
            </div>
        </div>

        ${t?.tenancyHistory && t.tenancyHistory.length > 0 ? `
        <div>
            <p class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider px-1 mb-2">Previous Rental History</p>
            <div class="space-y-2">
                ${t.tenancyHistory.map(h => {
                    const prop = PROPERTIES[h.propertyId];
                    return `
                    <div class="card p-3.5 rounded-2xl bg-white border border-[#E2E8F0] text-left">
                        <div class="flex items-center justify-between">
                            <p class="text-[13px] font-bold text-[#0F172A] m-0">${prop?.name || h.propertyName || 'Previous Property'} · ${h.unit}</p>
                            <span class="text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">Completed</span>
                        </div>
                        <p class="text-[11px] text-[#64748B] mt-1 m-0">Landlord: ${h.landlord || '—'} · Lease: ${h.leaseStart || '—'} → ${h.leaseEnd || '—'}</p>
                        ${h.deposit ? `<p class="text-[11px] text-[#059669] font-medium mt-0.5 m-0">Deposit: ${h.deposit}</p>` : ''}
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}
    </div>`;
}

function screenTenantContact() {
    const t = getActiveTenant();
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t?.id;
    const chatId = typeof getActiveTenantLandlordChatId === 'function' ? getActiveTenantLandlordChatId() : null;
    return `${topBar('Contact details', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        ${typeof renderTenantContactCard === 'function' ? renderTenantContactCard(tid, { actions: false }) : ''}
        ${typeof renderTenantPersonalIdCard === 'function' ? renderTenantPersonalIdCard(tid, { showPreviousAddress: true, viewDocs: true }) : ''}
        <button type="button" data-go="tenant-edit-profile" class="btn-secondary w-full py-3 text-[13px]">Edit my profile</button>
        ${chatId != null ? `<button type="button" data-go="chat" data-chat="${chatId}" class="btn-primary w-full py-3 text-[13px]">Message landlord</button>` : ''}
    </div>`;
}

function screenTenantReminders() {
    const t = getActiveTenant();
    const rows = typeof tenantSmartReminders === 'function' ? tenantSmartReminders(t) : [];
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `${topBar('Smart Reminders', { back: true, sub: 'For your home' })}
    <div class="screen-content screen-enter stack-sm">
        ${rows.length ? rows.map(r => {
            const urg = r.urgency === 'high' ? ['#FEE2E2', '#DC2626'] : r.urgency === 'medium' ? ['#FEF3C7', '#D97706'] : ['#EFF6FF', '#2563EB'];
            const key = r.id != null ? String(r.id) : `${r.type}-${r.title}`;
            const dueLabel = typeof formatReminderDue === 'function' ? formatReminderDue(r.due) : (r.due || '—');
            return `
        <button type="button" data-go="tenant-reminder-detail" data-reminder-key="${esc(key)}" class="tnt-reminder card p-4 w-full text-left">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <p class="text-[13px] font-bold text-[#0F172A]">${esc(r.title)}</p>
                    <p class="text-[12px] text-[#64748B] mt-1">Due ${esc(dueLabel)}</p>
                </div>
                <span class="badge shrink-0" style="background:${urg[0]};color:${urg[1]}">${r.urgency === 'high' ? 'Urgent' : r.urgency === 'medium' ? 'Soon' : 'Upcoming'}</span>
            </div>
        </button>`;
        }).join('') : `
        <div class="empty-state card">
            <i data-lucide="bell" class="w-10 h-10 text-[#CBD5E1]"></i>
            <p class="empty-state-title">No Smart Reminders right now</p>
            <p class="empty-state-desc">Lease dates and compliance deadlines will appear here.</p>
        </div>`}
    </div>`;
}

function screenTenantReminderDetail() {
    const t = getActiveTenant();
    const rows = typeof tenantSmartReminders === 'function' ? tenantSmartReminders(t) : [];
    const key = STATE.tenantReminderKey;
    const r = rows.find(x => String(x.id) === key || `${x.type}-${x.title}` === key);
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    if (!r) {
        return `${topBar('Smart Reminder', { back: true })}
        <div class="screen-content screen-enter"><p class="text-[13px] text-[#64748B]">Smart Reminder not found.</p></div>`;
    }
    const dueLabel = typeof formatReminderDue === 'function' ? formatReminderDue(r.due) : (r.due || '—');
    const urg = r.urgency === 'high' ? ['Urgent', '#FEE2E2', '#DC2626'] : r.urgency === 'medium' ? ['Due soon', '#FEF3C7', '#D97706'] : ['Upcoming', '#EFF6FF', '#2563EB'];
    const photoReq = typeof tenantInspectionPhotoRequest === 'function' ? tenantInspectionPhotoRequest(t) : null;
    const isPhotoUpload = r.type === 'inspection' && !!photoReq;
    const hint = r.id === 'rent-due'
        ? 'Pay rent from your home screen or payment history.'
        : r.id === 'lease-end'
            ? 'Your landlord manages lease renewals. Message them if you have questions.'
            : isPhotoUpload
                ? 'Your landlord asked you to photograph the property. Upload pictures from this request.'
                : 'Your landlord is responsible for keeping compliance items up to date.';
    return `${topBar('Smart Reminder', { back: true })}
    <div class="screen-content screen-enter stack-sm">
        <div class="reminder-detail-hero card p-4">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <p class="reminder-detail-type">For your home</p>
                    <h2 class="reminder-detail-title">${esc(r.title)}</h2>
                </div>
                <span class="badge shrink-0" style="background:${urg[1]};color:${urg[2]}">${urg[0]}</span>
            </div>
            <div class="reminder-detail-meta">
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Due</span>
                    <span class="reminder-detail-meta-value">${esc(dueLabel)}</span>
                </div>
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Property</span>
                    <span class="reminder-detail-meta-value">${esc(PROPERTIES[t?.propertyId]?.name || '—')}</span>
                </div>
                <div class="reminder-detail-meta-item">
                    <span class="reminder-detail-meta-label">Unit</span>
                    <span class="reminder-detail-meta-value">${esc(t?.unit || '—')}</span>
                </div>
            </div>
        </div>
        <p class="text-[13px] text-[#64748B] leading-relaxed">${hint}</p>
        ${isPhotoUpload ? `
        <button type="button" data-go="tenant-inspection-upload" class="btn-primary w-full py-3 text-[13px]">Upload inspection photos</button>` : r.id === 'rent-due' ? `
        <button type="button" data-go="transaction-history" class="btn-primary w-full py-3 text-[13px]">View payments</button>` : `
        <button type="button" data-go="tenant-active-tenancy" class="btn-primary w-full py-3 text-[13px]">View my tenancy</button>`}
        <button type="button" data-go="tenant-compliance" class="btn-secondary w-full py-3 text-[13px]">Building compliance</button>
    </div>`;
}

function screenTenantInspectionUpload() {
    const t = getActiveTenant();
    const req = typeof tenantInspectionPhotoRequest === 'function' ? tenantInspectionPhotoRequest(t) : null;
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    if (!req) {
        return `${topBar('Inspection photos', { back: true })}
        <div class="screen-content screen-enter">
            <div class="empty-state card">
                <i data-lucide="camera" class="w-10 h-10 text-[#CBD5E1]"></i>
                <p class="empty-state-title">No photo request</p>
                <p class="empty-state-desc">Your landlord has not asked for inspection pictures right now.</p>
            </div>
        </div>`;
    }
    const dueLabel = typeof formatReminderDue === 'function' ? formatReminderDue(req.date) : (req.date || '—');
    const existing = req.tenantPhotoUrls || [];
    const draft = STATE.tenantInspectionPhotos || [];
    const allPhotos = [...existing, ...draft];
    const submitted = !!req.tenantPhotosSubmitted;
    return `${topBar('Upload inspection photos', { back: true, sub: req.type || 'Inspection' })}
    <div class="screen-content screen-enter stack-sm">
        <div class="card p-4 bg-[#FFFBEB] border border-[#FDE68A]">
            <p class="text-[13px] font-semibold text-[#92400E]">${esc(req.type || 'Inspection')} pictures</p>
            <p class="text-[12px] text-[#B45309] mt-1">Due ${esc(dueLabel)}${t?.unit ? ` · ${esc(t.unit)}` : ''}</p>
            ${req.notes?.trim() ? `<p class="text-[12px] text-[#78350F] mt-2 leading-relaxed">${esc(req.notes)}</p>` : ''}
        </div>
        ${typeof renderPhotoPreviewStrip === 'function' ? renderPhotoPreviewStrip(allPhotos, { removable: true, removeAction: 'remove-tenant-insp-photo' }) : ''}
        ${submitted ? `
        <p class="form-helper">Photos sent to your landlord. You can add more if needed.</p>` : ''}
        <button type="button" data-action="upload-photo" class="card border-2 border-dashed border-[#E2E8F0] p-6 text-center w-full">
            <i data-lucide="camera" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
            <p class="text-[13px] font-semibold text-[#0F172A] mt-2">${allPhotos.length ? 'Add more photos' : 'Add inspection photos'}</p>
            <p class="text-[11px] text-[#64748B] mt-1">Take or choose pictures of each room</p>
        </button>
        <button type="button" data-action="submit-tenant-insp-photos" class="btn-primary w-full py-3.5 text-[14px]" ${draft.length || existing.length ? '' : 'disabled'}>${submitted ? 'Send more photos' : 'Send to landlord'}</button>
    </div>`;
}

function screenTenantCompliance() {
    const t = getActiveTenant();
    const rows = typeof tenantComplianceForTenant === 'function' ? tenantComplianceForTenant(t) : [];
    return `${topBar('Compliance', { back: true, sub: 'Your building' })}
    <div class="screen-content screen-enter space-y-3 text-left pb-8">
        <div class="space-y-2.5">
            ${rows.map(r => {
                const ok = r.status === 'valid';
                return `
            <div class="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <i data-lucide="${r.icon || 'shield-check'}" class="w-5 h-5"></i>
                    </div>
                    <div class="min-w-0">
                        <p class="text-[13.5px] font-bold text-[#0F172A] m-0 truncate">${r.name}</p>
                        <p class="text-[11px] text-[#64748B] m-0 mt-0.5 truncate">${r.certNumber} · Expires ${r.expiry}</p>
                    </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold border shrink-0 ${ok ? 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]'}">
                    ${ok ? 'Valid' : 'Expired'}
                </span>
            </div>`;
            }).join('')}
        </div>
        <button type="button" data-go="tenant-documents" class="w-full py-3.5 rounded-2xl bg-[#2563EB] text-white font-bold text-[13px] hover:bg-[#1D4ED8] transition-all shadow-xs cursor-pointer mt-4">
            View Certificate Documents
        </button>
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
        </button>`).join('') : `
        <div class="empty-state card">
            <i data-lucide="message-square" class="empty-state-icon"></i>
            <p class="empty-state-title">No communication history yet</p>
            <p class="empty-state-desc">Messages and maintenance updates will show up here.</p>
        </div>`}
    </div>`;
}

function screenTenantCheckout() {
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : 0;
    const co = typeof getTenantCheckout === 'function' ? getTenantCheckout(tid) : {};
    return `${topBar('Check-out', { back: true, sub: 'End of tenancy' })}
    <div class="screen-content screen-enter stack-sm">
        ${co.checklistSent ? `<div class="ux-tip"><p class="ux-tip-title">Cleaning checklist from your landlord</p><p class="ux-tip-text">Complete each item below before submitting your check-out.</p></div>` : ''}
        ${typeof renderSharedCheckoutPack === 'function'
            ? renderSharedCheckoutPack(tid, { editable: true, showVacate: true })
            : '<p class="text-[13px] text-[#64748B]">Check-out form unavailable.</p>'}
        <button type="button" data-action="submit-tenant-checkout" class="btn-primary w-full py-3.5 text-[14px] mt-2">${co.submitted ? 'Resubmit check-out to landlord' : 'Submit check-out to landlord'}</button>
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
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t.id;
    const rec = tid != null ? TENANTS[tid] : null;
    const displayName = typeof fullNameFromParts === 'function'
        ? fullNameFromParts(rec?.firstName || t.firstName, rec?.lastName || t.lastName)
        : `${rec?.firstName || t.firstName} ${rec?.lastName || t.lastName}`.trim();
    const av = typeof tenantAvatarUrl === 'function' ? tenantAvatarUrl(tid) : (IMG?.avatar?.sarah || 'assets/sarah.png');
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const unitTag = t.unit ? `Tenant · ${t.unit}` : 'Tenant';

    const group1 = [
        ['user', 'Personal Information', 'tenant-edit-profile'],
        ['home', 'My Tenancy & Lease', 'tenant-active-tenancy'],
        ['credit-card', 'Payment History', 'transaction-history'],
        ['building-2', 'Building Information', 'tenant-building-info'],
        ['bell', 'Notification Settings', 'notifications-settings'],
        ['key-round', 'Change Password', 'password'],
    ];

    const group2 = [
        ['circle-help', 'Help & Support', 'help-support'],
        ['info', 'About Landlord HQ', 'about'],
        ['shield-check', 'Privacy Policy', 'privacy'],
        ['file-text', 'Terms & Conditions', 'terms'],
    ];

    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-4 text-left pb-8">
        <!-- Top Profile User Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-3 text-left">
            <div class="flex items-center gap-3.5 min-w-0">
                <img src="${av}" class="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E2E8F0]" alt="">
                <div class="min-w-0">
                    <h3 class="text-[16px] font-extrabold text-[#0F172A] truncate m-0">${esc(displayName)}</h3>
                    <p class="text-[12.5px] font-medium text-[#64748B] m-0 mt-0.5">${esc(unitTag)}</p>
                </div>
            </div>
            <button type="button" data-go="tenant-edit-profile" class="text-[#2563EB] text-[12px] font-bold hover:underline cursor-pointer shrink-0">Edit</button>
        </div>

        <!-- Inset Group 1: Account Settings -->
        <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden text-left">
            ${group1.map(([icon, label, targetGo]) => `
            <button type="button" data-go="${targetGo}" class="w-full p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-[#334155] group-hover:text-[#2563EB] transition-colors shrink-0"></i>
                    <span class="text-[14px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">${label}</span>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform shrink-0"></i>
            </button>`).join('')}
        </div>

        <!-- Inset Group 2: Support & Policies -->
        <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden text-left">
            ${group2.map(([icon, label, targetGo]) => `
            <button type="button" data-go="${targetGo}" class="w-full p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-[#334155] group-hover:text-[#2563EB] transition-colors shrink-0"></i>
                    <span class="text-[14px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">${label}</span>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform shrink-0"></i>
            </button>`).join('')}
        </div>

        <!-- Red Outline Log Out Button -->
        <button type="button" data-action="logout" class="w-full py-3.5 rounded-2xl border border-[#FCA5A5] bg-white text-[#EF4444] font-extrabold text-[14px] hover:bg-[#FEF2F2] transition-colors cursor-pointer text-center shadow-xs mt-2">
            Log out
        </button>
        <div class="text-center pt-1">
            <button type="button" data-go="delete-account" class="text-[12px] font-semibold text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer">Delete account</button>
        </div>
    </div>`;
}

function screenTenantEditProfile() {
    const t = getActiveTenant();
    const tid = typeof activeTenantListId === 'function' ? activeTenantListId() : t?.id;
    const rec = tid != null ? TENANTS[tid] : null;
    if (!t) {
        return `${topBar('Edit profile', { back: true })}
        <div class="screen-content"><p class="text-[13px] text-[#64748B]">No active tenant account.</p></div>`;
    }
    const photo = typeof getTenantProfilePhoto === 'function' && tid != null ? getTenantProfilePhoto(tid) : IMG.avatar.sarah;
    const nidDraft = {
        nidProofFrontName: rec?.nidProofFront || STATE.nidProofFrontName || '',
        nidProofBackName: rec?.nidProofBack || STATE.nidProofBackName || '',
        nidProofName: (!rec?.nidProofFront && !rec?.nidProofBack && rec?.nidProof) ? rec.nidProof : (STATE.nidProofName || ''),
    };
    return `${topBar('Personal Information', { back: true })}
    <div class="screen-content screen-content-sm profile-form-page screen-enter">
        ${typeof renderProfilePhotoPicker === 'function' ? renderProfilePhotoPicker(photo, 'profilePhoto', IMG.avatar.sarah) : ''}
        <div class="form-stack">
        ${formField('Full Name', typeof fullNameFromParts === 'function' ? fullNameFromParts(rec?.firstName || t.firstName, rec?.lastName || t.lastName) : `${rec?.firstName || t.firstName} ${rec?.lastName || t.lastName}`.trim(), 'text', 'e.g. Sarah Johnson', 'fullName')}
        ${formField('Date of Birth', typeof toDateInputValue === 'function' ? toDateInputValue(rec?.dob || t.dob) : (rec?.dob || t.dob || ''), 'date', '', 'dob')}
        ${formField('NID number', rec?.idNumber || '', 'text', 'National ID number', 'idNumber')}
        </div>
        ${typeof renderNidProofUploadFields === 'function' ? renderNidProofUploadFields(nidDraft) : ''}
        <div class="form-stack">
        ${formField('Email', rec?.email || t.email, 'email', '', 'email')}
        ${formField('Phone', t.phone || rec?.phone || '', 'tel', '', 'phone')}
        ${formField('Emergency contact', rec?.emergency && rec.emergency !== '—' ? rec.emergency : '', 'text', 'Full name', 'emergency')}
        ${formField('Emergency phone', rec?.emergencyPhone && rec.emergencyPhone !== '—' ? rec.emergencyPhone : '', 'tel', '+44 7700 900000', 'emergencyPhone')}
        ${formField('Previous / home address', rec?.homeAddress || '', 'text', 'Optional', 'homeAddress')}
        </div>
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

function contractorHomeStats() {
    const assigned = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
    const inProgress = CONTRACTOR_JOBS.filter(j => ['accepted', 'scheduled', 'in_progress'].includes(j.status)).length;
    const completed = CONTRACTOR_JOBS.filter(j => ['completed', 'paid'].includes(j.status)).length;
    const pendingReview = CONTRACTOR_JOBS.filter(j => ['waiting_approval', 'approved'].includes(j.status)).length;
    return { assigned, inProgress, completed, pendingReview };
}

function contractorNextVisitJob() {
    const today = CONTRACTOR_JOBS.filter(j => (j.visitDate || '').toLowerCase().includes('today'));
    if (today.length) return today[0];
    const upcoming = CONTRACTOR_JOBS.filter(j => ['assigned', 'accepted', 'scheduled', 'in_progress'].includes(j.status));
    return upcoming[0] || null;
}

function contractorHomeHeader(name, company) {
    const unread = CONTRACTOR_NOTIFS.filter(n => n.unread).length;
    const first = (name || 'Mike').split(' ')[0];
    const greeting = typeof dashGreeting === 'function' ? dashGreeting() : 'Good morning';
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button type="button" data-action="drawer" class="top-icon-btn" aria-label="Menu">
            <i data-lucide="menu" class="w-[22px] h-[22px]"></i>
        </button>
        <button type="button" data-go="contractor-notifications" class="top-icon-btn relative" aria-label="Notifications">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            ${unread ? `<span class="notif-badge">${unread}</span>` : ''}
        </button>
    </div>
    <div class="dash-greeting-row">
        <img src="${IMG.avatar.plumber}" class="dash-avatar" alt="">
        <div class="min-w-0">
            <p class="dash-greeting">${greeting}, ${first}</p>
            <p class="dash-date">${company}</p>
        </div>
    </div>
</div>`;
}

function renderCtrScheduleHero(job) {
    if (!job) {
        return `
        <div class="card p-4 rounded-3xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] text-white shadow-md space-y-2 text-left relative overflow-hidden">
            <div class="flex items-center justify-between">
                <span class="text-[10.5px] font-extrabold uppercase tracking-wider text-white/90 flex items-center gap-1">
                    <i data-lucide="calendar" class="w-3.5 h-3.5"></i> TODAY'S SCHEDULE
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#4ADE80]"></span> On duty
                </span>
            </div>
            <p class="text-[24px] font-black text-white m-0 tracking-tight">No visits scheduled today</p>
            <p class="text-[12px] text-white/90 m-0">Check your active jobs for upcoming assignments.</p>
            <button type="button" data-go="contractor-jobs" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#2563EB] text-[12.5px] font-extrabold shadow-sm mt-1 hover:bg-[#F8FAFC] transition-colors cursor-pointer border-none outline-none">
                View jobs <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
        </div>`;
    }
    const timeMatch = (job.visitDate || '').match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    const timeLabel = timeMatch ? timeMatch[1] : (job.visitDate || '4:30 PM');
    const location = contractorJobLocation(job);
    return `
    <button type="button" data-go="contractor-job-detail" data-job="${job.id}" class="card w-full p-4 rounded-3xl bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] text-white shadow-md space-y-2 text-left relative overflow-hidden group border-none outline-none cursor-pointer">
        <div class="flex items-center justify-between">
            <span class="text-[10.5px] font-extrabold uppercase tracking-wider text-white/90 flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i> TODAY'S SCHEDULE
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold text-white inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span> On duty
            </span>
        </div>
        <p class="text-[26px] font-black text-white m-0 tracking-tight leading-none pt-0.5">${timeLabel}</p>
        <p class="text-[16px] font-black text-white m-0 truncate leading-snug">${job.issue}</p>
        <p class="text-[12px] font-medium text-white/90 m-0 truncate flex items-center gap-1">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 shrink-0 text-white"></i> ${location}
        </p>
        <div class="pt-1">
            <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#2563EB] text-[12.5px] font-extrabold shadow-sm group-hover:bg-[#F8FAFC] transition-colors">
                View schedule <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </span>
        </div>
    </button>`;
}

function renderCtrOverviewCard(icon, label, value, sub) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const badgeStyles = {
        'briefcase': 'bg-[#EFF6FF] text-[#2563EB]',
        'wrench': 'bg-[#EFF6FF] text-[#2563EB]',
        'check-circle': 'bg-[#ECFDF5] text-[#059669]',
        'clock': 'bg-[#FFFBEB] text-[#D97706]',
    }[icon] || 'bg-[#EFF6FF] text-[#2563EB]';

    return `
    <button type="button" data-go="contractor-jobs" class="card p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] transition-all text-left flex flex-col justify-between h-[92px] group cursor-pointer relative">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-full ${badgeStyles} flex items-center justify-center shrink-0">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                </span>
                <span class="text-[20px] font-black text-[#0F172A] tracking-tight leading-none">${value}</span>
            </div>
            <span class="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0">
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </span>
        </div>
        <div class="min-w-0 pt-1">
            <p class="text-[12px] font-extrabold text-[#0F172A] m-0 leading-snug truncate group-hover:text-[#2563EB] transition-colors">${esc(label)}</p>
            <p class="text-[10px] font-semibold text-[#64748B] m-0 mt-0.5 truncate">${esc(sub)}</p>
        </div>
    </button>`;
}

function renderCtrHomeJobRow(job) {
    const st = contractorStatusStyle(job.status);
    const thumb = job.reportPhotos?.[0] || job.photos?.before?.[0] || IMG.maint[job.id % IMG.maint.length];
    const location = contractorJobLocation(job);
    return `
    <button type="button" data-go="contractor-job-detail" data-job="${job.id}" class="card p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3 text-left hover:border-[#2563EB] transition-all cursor-pointer group w-full">
        <div class="flex items-center gap-3 min-w-0">
            <img src="${thumb}" alt="" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E2E8F0]">
            <div class="min-w-0">
                <p class="text-[13.5px] font-extrabold text-[#0F172A] m-0 truncate group-hover:text-[#2563EB] transition-colors">${job.issue}</p>
                <p class="text-[11.5px] font-semibold text-[#64748B] m-0 mt-0.5 truncate flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-[#94A3B8] shrink-0"></i> ${location}
                </p>
                <p class="text-[10.5px] font-medium text-[#94A3B8] m-0 mt-0.5">${job.visitDate || 'Today · 4:30 PM'}</p>
            </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
            <span class="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold tracking-wide" style="background:${st.bg};color:${st.color}">${st.label}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:text-[#2563EB] transition-colors"></i>
        </div>
    </button>`;
}

function screenContractorDashboard() {
    const stats = contractorHomeStats();
    const nextVisit = contractorNextVisitJob();
    const recent = CONTRACTOR_JOBS
        .filter(j => ['in_progress', 'waiting_approval', 'completed', 'assigned', 'scheduled'].includes(j.status))
        .slice(0, 3);
    const newAssigned = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
    return `${contractorHomeHeader('Mike Thompson', 'Plumber Pro Ltd')}
    <div class="screen-content screen-enter ctr-home-page space-y-4 text-left pb-16">
        ${renderCtrScheduleHero(nextVisit)}
        
        <!-- Work Overview -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-[15px] font-black text-[#0F172A] m-0">Work overview</h3>
                    <p class="text-[11.5px] font-medium text-[#64748B] m-0">Snapshot for this week</p>
                </div>
                <span class="px-2.5 py-1 rounded-xl bg-[#F1F5F9] text-[#475569] text-[11.5px] font-bold border border-[#E2E8F0] flex items-center gap-1 cursor-pointer">
                    This week <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[#64748B]"></i>
                </span>
            </div>
            <div class="grid grid-cols-2 gap-2.5">
                ${renderCtrOverviewCard('briefcase', 'Assigned jobs', stats.assigned, newAssigned ? `${newAssigned} new` : 'Up to date')}
                ${renderCtrOverviewCard('wrench', 'In progress', stats.inProgress, stats.inProgress ? 'Active now' : 'None active')}
                ${renderCtrOverviewCard('check-circle', 'Completed', stats.completed, 'This month')}
                ${renderCtrOverviewCard('clock', 'Pending review', stats.pendingReview, stats.pendingReview ? 'Needs action' : 'All clear')}
            </div>
        </div>

        <!-- Recent Jobs -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-[15px] font-black text-[#0F172A] m-0">Recent jobs</h3>
                    <p class="text-[11.5px] font-medium text-[#64748B] m-0">${recent.length ? `${recent.length} active` : 'No recent activity'}</p>
                </div>
                <button type="button" data-go="contractor-jobs" class="text-[12.5px] font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0">
                    View all <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
            </div>
            <div class="space-y-2">
                ${recent.length ? recent.map(j => renderCtrHomeJobRow(j)).join('') : `
                <div class="empty-state card">
                    <i data-lucide="briefcase" class="empty-state-icon"></i>
                    <p class="empty-state-title">No jobs yet</p>
                    <p class="empty-state-desc">New assignments from landlords appear here.</p>
                </div>`}
            </div>
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
    const counts = contractorJobFilterCounts();
    const tabs = [
        ['all', 'All', counts.all],
        ['pending', 'Pending', counts.pending],
        ['in_progress', 'In progress', counts.inProgress],
        ['completed', 'Completed', counts.completed],
    ];
    const jobs = contractorFilterJobs();
    return `${topBar('Jobs', { hideBell: true })}
    <div class="screen-content screen-enter ctr-compact-page ctr-v2-jobs-page">
        <div class="dash-section-head">
            <div>
                <h3 class="screen-section-title">Your jobs</h3>
                <p class="dash-section-sub">${counts.all} total · filter by status</p>
            </div>
        </div>
        <div class="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] text-center my-3">
            ${tabs.map(([k, l, n]) => {
                const isActive = f === k;
                return `
                <button type="button" data-contractor-filter="${k}" class="py-2 px-1 rounded-xl text-[11.5px] font-extrabold transition-all cursor-pointer truncate ${isActive ? 'bg-[#2563EB] text-white shadow-2xs' : 'text-[#64748B] hover:text-[#0F172A]'}">
                    ${l} <span class="text-[10.5px] opacity-80">(${n})</span>
                </button>`;
            }).join('')}
        </div>
        <div class="search-bar ctr-jobs-search">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-search="contractorJobs" type="text" value="${STATE.search.contractorJobs || ''}" placeholder="Search jobs…" class="flex-1 text-[13px] bg-transparent border-none outline-none">
        </div>
        <div class="ctr-v2-jobs-list">
            ${jobs.length ? jobs.map(j => contractorJobListCard(j)).join('') : `
            <div class="empty-state card">
                <i data-lucide="briefcase" class="empty-state-icon"></i>
                <p class="empty-state-title">No jobs in this filter</p>
                <p class="empty-state-desc">Try another tab or wait for new assignments.</p>
            </div>`}
        </div>
    </div>`;
}

function screenContractorJobDetail() {
    const job = contractorJob(STATE.contractorJobId);
    if (!job) return `${topBar('Job details', { back: true })}<div class="screen-content p-4"><p class="text-[13px] text-[#64748B]">Job not found.</p></div>`;

    const st = contractorJobDisplayStatus(job);
    const tab = STATE.contractorJobTab || 'overview';
    if (tab === 'work') return screenContractorCompleteJob();
    if (tab === 'invoice') return screenContractorJobInvoice();

    const canMessageTenant = job.tenant && job.tenant !== '—' && job.tenantChatId != null;
    const contactName = canMessageTenant ? job.tenant : job.landlord;
    const contactInitials = contactName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const maintItem = job.maintId != null && typeof MAINTENANCE_ITEMS !== 'undefined'
        ? MAINTENANCE_ITEMS.find(m => m.id === job.maintId)
        : null;

    const photos = [...(job.reportPhotos || []), ...(job.photos?.before || [])];
    const mainFeaturedPhoto = photos[0] || (typeof IMG !== 'undefined' && IMG.maint ? IMG.maint[job.id % IMG.maint.length] : 'assets/plumber.png');

    const rawVideos = typeof getMaintReportVideos === 'function'
        ? getMaintReportVideos(job || maintItem)
        : (job.reportVideos || maintItem?.videos || []);
    const videos = rawVideos.map(v => typeof normalizeMaintVideo === 'function' ? normalizeMaintVideo(v) : v);
    const totalMediaCount = photos.length + videos.length;

    const price = contractorJobEstimate(job);
    const paymentStatus = ['paid', 'approved'].includes(job.status) ? 'Paid' : (job.status === 'waiting_approval' ? 'Awaiting approval' : 'Upon completion');
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    // Check utilities for emergency shutoff / stopcock / fusebox
    const pid = job.propertyId ?? maintItem?.propertyId ?? 0;
    const meta = typeof AppStore !== 'undefined' ? AppStore.meta(pid) : {};
    const utils = meta?.utilities || {};
    const waterStopcock = utils.water?.shutOff || utils.water?.meterLocation || 'Pavement outside front boundary';
    const elecLocation = utils.elec?.meterLocation || utils.elec?.meter || 'Hallway intake / meter box';
    const isPlumbing = /sink|pipe|water|tap|toilet|leak|basin|drain/i.test(job.issue || '') || (maintItem?.categoryId === 'plumbing');
    const isElectrical = /power|plug|light|fuse|electric|breaker|wire/i.test(job.issue || '') || (maintItem?.categoryId === 'electrical');

    const primaryAction = {
        assigned: `<button type="button" data-contractor-action="accept" data-msg="Job accepted" class="btn-primary w-full py-3.5 text-[14px] font-extrabold flex items-center justify-center gap-2 rounded-2xl shadow-md cursor-pointer">Accept job</button>`,
        accepted: `<button type="button" data-contractor-action="schedule" class="btn-primary w-full py-3.5 text-[14px] font-extrabold flex items-center justify-center gap-2 rounded-2xl shadow-md cursor-pointer">Schedule visit</button>`,
        scheduled: `<button type="button" data-contractor-action="start" data-msg="Work started" class="btn-primary w-full py-3.5 text-[14px] font-extrabold flex items-center justify-center gap-2 rounded-2xl shadow-md cursor-pointer">Start job</button>`,
        in_progress: `<button type="button" data-contractor-action="work" class="btn-primary w-full py-3.5 text-[14px] font-extrabold flex items-center justify-center gap-2 rounded-2xl shadow-md cursor-pointer"><i data-lucide="file-text" class="w-4 h-4"></i> Finish &amp; invoice</button>`,
        waiting_approval: `<div class="p-3.5 rounded-2xl bg-[#F3E8FF] text-[#7E22CE] text-[13px] font-bold text-center border border-[#E9D5FF]">Invoice submitted — awaiting landlord review</div>`,
        approved: `<div class="p-3.5 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] text-[13px] font-bold text-center border border-[#DBEAFE]">Approved — payment via Stripe</div>`,
        completed: `<div class="p-3.5 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] text-[13px] font-bold text-center border border-[#DBEAFE]">Job completed</div>`,
        paid: `<div class="p-3.5 rounded-2xl bg-[#ECFDF5] text-[#047857] text-[13px] font-bold text-center border border-[#A7F3D0]">Payment received</div>`,
    }[job.status] || '';

    const reviewsBlock = typeof renderContractorJobReviewsReadonly === 'function'
        ? renderContractorJobReviewsReadonly(maintItem, job) : '';

    return `${topBar('Job details', { back: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-4 text-left pb-24">
        
        <!-- Unified Main Job Card (Clean cohesive layout, no fragmented box clutter) -->
        <div class="card p-4.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3.5 text-left">
            <!-- Status & Job Ref Badge -->
            <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase" style="background:${st.bg};color:${st.color}">
                    <i data-lucide="clock" class="w-3 h-3 inline-block -mt-0.5 mr-0.5"></i> ${st.label}
                </span>
                <span class="px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-[11px] font-mono font-extrabold tracking-wider border border-[#DBEAFE]">
                    #JOB-${1000 + job.id}
                </span>
            </div>

            <!-- Title & Meta Information -->
            <div>
                <h1 class="text-[20px] font-black text-[#0F172A] tracking-tight leading-snug m-0">${esc(job.issue)}</h1>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-[#64748B] mt-2">
                    <span class="flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                        ${esc(job.address)}
                    </span>
                    <span class="flex items-center gap-1.5">
                        <i data-lucide="calendar" class="w-3.5 h-3.5 text-[#2563EB]"></i>
                        ${esc(job.visitDate || 'Today, 4:30 PM')}
                    </span>
                </div>
            </div>

            <!-- Utility Location Note (Inline info banner, not a giant card) -->
            ${(isPlumbing && waterStopcock) || (isElectrical && elecLocation) ? `
            <div class="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-[12px]">
                <i data-lucide="${isPlumbing ? 'droplet' : 'zap'}" class="w-4 h-4 ${isPlumbing ? 'text-[#0284C7]' : 'text-[#D97706]'} shrink-0"></i>
                <div class="min-w-0">
                    <span class="text-[#64748B] font-semibold">${isPlumbing ? 'Water Stopcock:' : 'Fuse Box:'}</span>
                    <span class="text-[#0F172A] font-bold ml-1">${esc(isPlumbing ? waterStopcock : elecLocation)}</span>
                </div>
            </div>` : ''}

            <!-- Description -->
            <div class="space-y-1 pt-1 border-t border-[#F1F5F9]">
                <h3 class="text-[12px] font-extrabold text-[#64748B] uppercase tracking-wider m-0">Job Description</h3>
                <p class="text-[13px] font-medium text-[#334155] leading-relaxed m-0">${esc(job.desc)}</p>
            </div>

            <!-- Attached Media Thumbnails (Compact, clean thumbnails at bottom) -->
            ${(photos.length || videos.length) ? `
            <div class="space-y-2 pt-1 border-t border-[#F1F5F9]">
                <span class="text-[12px] font-extrabold text-[#64748B] uppercase tracking-wider block">Evidence Media (${totalMediaCount})</span>
                <div class="flex items-center gap-2.5 overflow-x-auto pb-1">
                    ${videos.map((v) => `
                    <button type="button" class="relative w-20 h-16 rounded-xl overflow-hidden border border-[#CBD5E1] shrink-0 group cursor-pointer bg-black" data-action="preview-maint-media" data-kind="video" data-src="${String(v.url || '').replace(/"/g, '&quot;')}" data-poster="${String(v.poster || photos[0] || '').replace(/"/g, '&quot;')}" data-name="${String(v.name || 'Video attachment').replace(/"/g, '&quot;')}">
                        <img src="${v.poster || photos[0] || IMG.maint[0]}" alt="" class="w-full h-full object-cover">
                        <span class="absolute inset-0 bg-black/30 flex items-center justify-center text-white"><i data-lucide="play" class="w-4 h-4 fill-white"></i></span>
                    </button>`).join('')}

                    ${photos.map((src) => `
                    <button type="button" class="relative w-20 h-16 rounded-xl overflow-hidden border border-[#E2E8F0] shrink-0 group cursor-pointer bg-[#F8FAFC]" data-action="preview-maint-media" data-kind="photo" data-src="${String(src).replace(/"/g, '&quot;')}">
                        <img src="${src}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                    </button>`).join('')}
                </div>
            </div>` : ''}

            <!-- Contact Row (Seamlessly integrated at the bottom of the card) -->
            <div class="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[12px] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                        ${contactInitials}
                    </div>
                    <div class="min-w-0">
                        <p class="text-[13.5px] font-bold text-[#0F172A] m-0 truncate">${esc(contactName)}</p>
                        <p class="text-[11px] font-medium text-[#64748B] m-0">${canMessageTenant ? 'Tenant' : 'Landlord'}</p>
                    </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" data-action="toast" data-msg="Calling ${esc(contactName)}…" class="w-8.5 h-8.5 rounded-xl bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F1F5F9] transition-colors cursor-pointer" title="Call">
                        <i data-lucide="phone" class="w-4 h-4"></i>
                    </button>
                    <button type="button" data-go="chat" data-chat="${canMessageTenant ? job.tenantChatId : job.landlordChatId}" class="w-8.5 h-8.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] flex items-center justify-center hover:bg-[#DBEAFE] transition-colors cursor-pointer" title="Message">
                        <i data-lucide="message-square" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>

        ${reviewsBlock}

        <!-- Sticky Bottom Primary Action -->
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-[#E2E8F0] z-40 max-w-[430px] mx-auto">
            ${primaryAction}
        </div>
    </div>
    ${typeof renderMaintMediaPreviewModal === 'function' ? renderMaintMediaPreviewModal() : ''}
    ${renderContractorQuoteModal()}`;
}

function renderContractorQuoteModal() {
    const job = contractorJob(STATE.contractorJobId);
    if (!STATE.showContractorQuoteModal || !job) return '';
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    return `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 screen-enter">
        <div class="card p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl w-full max-w-md space-y-4 text-left">
            <div class="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div>
                    <h3 class="text-[16px] font-extrabold text-[#0F172A] m-0">Submit Price Quote</h3>
                    <p class="text-[12px] text-[#64748B] m-0 mt-0.5">#JOB-${1000 + job.id} · ${esc(job.issue)}</p>
                </div>
                <button type="button" data-action="close-contractor-quote-modal" class="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="space-y-3">
                ${formFieldReq('Quoted Amount (£)', 'ctr_quote_amount', job.quoteAmount || '185', 'number', 'e.g. 185')}
                ${formTextarea('Scope of Work & Notes', 'ctr_quote_notes', job.quoteNotes || 'Inspected site. Replaced worn washer and pipe fitting under kitchen sink.', 'e.g. Parts breakdown and labor estimate')}
            </div>
            <div class="flex items-center gap-2 pt-2">
                <button type="button" data-action="close-contractor-quote-modal" class="btn-secondary flex-1 py-3 text-[13px] font-bold">Cancel</button>
                <button type="button" data-action="submit-contractor-quote" class="btn-primary flex-1 py-3 text-[13px] font-bold">Send Quote</button>
            </div>
        </div>
    </div>`;
}

function submitContractorQuote() {
    const job = contractorJob(STATE.contractorJobId);
    const amt = fieldVal('ctr_quote_amount')?.trim();
    const notes = fieldVal('ctr_quote_notes')?.trim();
    if (!amt || isNaN(parseFloat(amt))) {
        toast('Please enter a valid quoted amount');
        return;
    }
    if (job) {
        job.quoteAmount = parseFloat(amt);
        job.quoteNotes = notes || '';
        job.status = 'scheduled';
        AppStore?.save();
    }
    STATE.showContractorQuoteModal = false;
    toast(`Quote of £${amt} submitted to landlord`);
    render();
}

function screenContractorCompleteJob() {
    const job = contractorJob(STATE.contractorJobId);
    const afterPhotos = job.photos?.after || [];
    const price = contractorJobEstimate(job);
    const hasInvoice = !!job.invoice;
    return `${topBar(job.property, { back: true, sub: job.issue })}
    <div class="screen-content screen-enter ctr-compact-page">
        <div class="card ctr-compact-block">
            <p class="ctr-compact-muted">${job.address} · ${job.tenant}</p>
            <p class="ctr-compact-payout-amt">${price}</p>
        </div>
        <div class="card ctr-compact-block">
            <p class="ctr-compact-label">Work photos</p>
            <div class="ctr-compact-photo-row">
                ${afterPhotos.map(src => `<img src="${src}" alt="" class="ctr-compact-photo">`).join('')}
                <button type="button" data-contractor-upload="after" class="ctr-compact-photo-add" aria-label="Add photos">
                    <i data-lucide="image-plus" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
        ${formTextarea('Work note', '', 'What did you fix on site? (optional)', 'workNote')}
        ${hasInvoice ? `
        <div class="card ctr-compact-block">
            <p class="ctr-compact-label">Invoice</p>
            <p class="ctr-compact-payout-amt" style="font-size:18px">${job.invoice.amount}</p>
            <p class="ctr-compact-muted">${job.invoice.number || job.invoice.file || 'Ready to submit'}</p>
        </div>` : `
        <div class="card ctr-compact-block">
            <p class="ctr-compact-text">No invoice yet — <button type="button" data-go="contractor-documents" class="ctr-compact-link">add invoice</button> or we generate one on submit.</p>
        </div>`}
        <button type="button" data-action="mark-contractor-complete" class="btn-primary ctr-compact-cta">Submit for approval</button>
    </div>`;
}

function screenContractorScheduleHub() {
    const today = new Date();
    const monthLabel = today.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const dayNum = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDow = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const blanks = (firstDow + 6) % 7;
    const todayJobs = CONTRACTOR_JOBS.filter(j => (j.visitDate || '').toLowerCase().includes('today') || ['assigned', 'accepted', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 4);
    const calCells = [];
    for (let i = 0; i < blanks; i++) calCells.push('<span class="ctr-cal-cell ctr-cal-cell--empty"></span>');
    for (let d = 1; d <= daysInMonth; d++) {
        calCells.push(`<span class="ctr-cal-cell${d === dayNum ? ' is-today' : ''}">${d}</span>`);
    }
    return `${topBar('Schedule', { hideBell: true })}
    <div class="screen-content screen-enter ctr-compact-page">
        <div class="ctr-cal card ctr-compact-block">
            <div class="ctr-cal-head">
                <span class="ctr-cal-month">${monthLabel}</span>
                <i data-lucide="calendar" class="w-4 h-4 text-[#64748B]"></i>
            </div>
            <div class="ctr-cal-weekdays">
                ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span>${d}</span>`).join('')}
            </div>
            <div class="ctr-cal-grid ctr-cal-grid--compact">${calCells.join('')}</div>
        </div>
        <p class="ctr-compact-section-title">Today · ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
        <div class="ctr-compact-schedule-list">
            ${todayJobs.length ? todayJobs.map(j => {
                const time = (j.visitDate || '').split(',')[1]?.trim() || (j.visitDate || '').split(' ').slice(-2).join(' ') || '—';
                const disp = contractorJobDisplayStatus(j);
                return `
            <button type="button" data-go="contractor-job-detail" data-job="${j.id}" class="card ctr-compact-schedule-row w-full text-left">
                <span class="ctr-compact-schedule-time">${time}</span>
                <span class="ctr-compact-schedule-body">
                    <span class="ctr-compact-schedule-title">${j.issue}</span>
                    <span class="ctr-compact-schedule-loc">${contractorJobLocation(j)}</span>
                </span>
                <span class="ctr-v2-job-badge" style="background:${disp.bg};color:${disp.color}">${disp.label}</span>
            </button>`;
            }).join('') : `
            <div class="card ctr-compact-block">
                <p class="ctr-compact-text">No visits scheduled for today.</p>
            </div>`}
        </div>
    </div>`;
}

function getContractorEarningsDataset(period) {
    switch (period) {
        case '1W':
            return {
                periodLabel: 'This week',
                total: 355,
                change: '+15% vs last week',
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [45, 110, 80, 0, 120, 0, 0],
                maxVal: 150
            };
        case '1M':
            return {
                periodLabel: 'This month',
                total: 1280,
                change: '+12% vs last month',
                labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
                values: [280, 340, 355, 305],
                maxVal: 400
            };
        case '3M':
            return {
                periodLabel: 'Last 3 months',
                total: 3650,
                change: '+22% vs Q4',
                labels: ['Jan', 'Feb', 'Mar'],
                values: [1100, 1200, 1350],
                maxVal: 1500
            };
        case '1Y':
            return {
                periodLabel: 'This year',
                total: 14200,
                change: '+18% YoY',
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                values: [2100, 2400, 2050, 2300, 2550, 2800],
                maxVal: 3000
            };
        default: // 'all'
            return {
                periodLabel: 'All time',
                total: 28500,
                change: 'Lifetime earnings',
                labels: ['2023', '2024', '2025', '2026'],
                values: [5400, 8800, 11500, 2800],
                maxVal: 12000
            };
    }
}

function renderContractorEarningsTrendChart(data) {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const maxVal = data.maxVal || 100;
    const maxIdx = data.values.indexOf(Math.max(...data.values));
    
    return `
    <div class="space-y-2">
        <div class="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] pb-1 border-b border-[#F1F5F9]">
            <span>Peak: £${data.maxVal.toLocaleString()}</span>
            <span>Scale: GBP (£)</span>
        </div>
        
        <!-- Bar Chart with X-Axis Date Labels -->
        <div class="flex items-end justify-between gap-2 h-36 pt-5 pb-1 px-1">
            ${data.values.map((v, i) => {
                const pct = Math.max(12, Math.round((v / maxVal) * 100));
                const isPeak = i === maxIdx && v > 0;
                const barColor = isPeak ? 'bg-[#2563EB]' : 'bg-[#DBEAFE] hover:bg-[#93C5FD]';
                const label = data.labels[i] || '';
                return `
                <div class="flex-1 flex flex-col items-center h-full justify-end group relative">
                    <!-- Tooltip value on hover -->
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 px-2 py-0.5 rounded bg-[#0F172A] text-white text-[10.5px] font-bold whitespace-nowrap z-10 pointer-events-none shadow-xs">
                        £${v.toLocaleString()}
                    </div>
                    <div class="w-full ${barColor} rounded-t-lg transition-all duration-300 relative" style="height:${pct}%">
                        ${isPeak ? `<span class="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-[#2563EB]">£${v.toLocaleString()}</span>` : ''}
                    </div>
                    <span class="text-[11px] font-bold ${isPeak ? 'text-[#0F172A]' : 'text-[#64748B]'} mt-2 truncate w-full text-center">${esc(label)}</span>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

function screenContractorEarnings() {
    const summary = contractorEarningsSummary();
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    return `${topBar('Earnings', { back: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-3.5 text-left pb-16">
        <!-- Recent Payouts Ledger -->
        <div class="space-y-2.5">
            <h3 class="text-[14px] font-extrabold text-[#0F172A] uppercase tracking-wider px-1 m-0">Recent Payouts</h3>
            ${summary.jobs.length ? `
            <div class="card p-0 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs divide-y divide-[#F1F5F9] overflow-hidden">
                ${summary.jobs.map(j => `
                <div data-go="contractor-job-detail" data-job="${j.id}" class="p-3.5 flex items-center justify-between gap-3 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
                            <i data-lucide="arrow-down-left" class="w-4.5 h-4.5"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[14px] font-bold text-[#0F172A] truncate m-0 group-hover:text-[#2563EB] transition-colors">${esc(j.issue)}</p>
                            <p class="text-[12px] font-medium text-[#64748B] truncate m-0 mt-0.5">${esc(j.visitDate || j.assignedDate || 'Completed')}</p>
                        </div>
                    </div>
                    <span class="text-[14px] font-extrabold text-[#059669] shrink-0">+${contractorJobEstimate(j)}</span>
                </div>`).join('')}
            </div>` : `
            <div class="card p-6 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-2">
                <i data-lucide="banknote" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
                <p class="text-[13px] font-semibold text-[#64748B] m-0">No payouts yet — completed jobs will appear here.</p>
            </div>`}
        </div>
    </div>`;
}

function screenContractorJobInvoice() {
    const job = contractorJob(STATE.contractorJobId);
    if (!job) return `${topBar('Payout', { back: true })}<div class="screen-content p-4"><p class="text-[13px] text-[#64748B]">No job selected.</p></div>`;
    
    const certs = job.certificates || [];
    const agreedAmount = job.quoteAmount ? String(job.quoteAmount) : (job.invoice?.amount ? String(job.invoice.amount).replace(/[^\d.]/g, '') : '185');
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    return `${topBar('Payout', { back: true, sub: 'Create an invoice for this job' })}
    <div class="screen-content screen-enter ctr-compact-page space-y-4 text-left pb-12">
        
        <!-- 1. Invoice Details Card -->
        <div class="card p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs space-y-3 text-left">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-[10px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-[15px] font-extrabold text-[#0F172A] m-0">Invoice details</h3>
                    <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">Add the job details and amount to generate the invoice.</p>
                </div>
            </div>

            ${job.invoice ? `
            <div class="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 mt-2">
                <div class="flex items-center justify-between gap-2">
                    <div>
                        <p class="text-[16px] font-black text-[#0F172A] m-0">${job.invoice.amount}</p>
                        <p class="text-[12px] font-medium text-[#64748B] m-0">${job.invoice.number || job.invoice.file} · ${job.invoice.uploadedAt || 'Today'}</p>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold">
                        ${job.invoice.status || 'Generated'}
                    </span>
                </div>
                <p class="text-[12px] text-[#475569] m-0">${esc(job.invoice.description || job.issue)}</p>
                <button type="button" data-action="preview-contractor-invoice" class="w-full py-2.5 rounded-[12px] bg-white border border-[#CBD5E1] text-[#0F172A] text-[12.5px] font-bold hover:bg-[#F1F5F9] transition-colors cursor-pointer text-center mt-1">
                    <i data-lucide="download" class="w-3.5 h-3.5 inline-block mr-1"></i> Download PDF preview
                </button>
            </div>` : `
            <div class="space-y-3 pt-1">
                <div>
                    <label class="block text-[12px] font-bold text-[#475569] mb-1">Invoice amount (£)</label>
                    <div class="relative flex items-center">
                        <span class="absolute left-3.5 text-[14px] font-bold text-[#64748B]">£</span>
                        <input type="number" data-field="invoiceAmount" value="${agreedAmount}" class="w-full pl-8 pr-3.5 py-2.5 rounded-[12px] border border-[#CBD5E1] text-[14px] font-bold text-[#0F172A] focus:border-[#2563EB] focus:outline-none" placeholder="185">
                    </div>
                </div>

                <div>
                    <label class="block text-[12px] font-bold text-[#475569] mb-1">Description</label>
                    <input type="text" data-field="invoiceDesc" value="${esc(job.issue)}" class="w-full px-3.5 py-2.5 rounded-[12px] border border-[#CBD5E1] text-[13.5px] font-medium text-[#0F172A] focus:border-[#2563EB] focus:outline-none" placeholder="Kitchen sink leaking">
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="text-[12px] font-bold text-[#475569]">Notes (optional)</label>
                        <span class="text-[11px] text-[#94A3B8]">0/500</span>
                    </div>
                    <textarea data-field="invoiceNotes" rows="3" class="w-full p-3 rounded-[12px] border border-[#CBD5E1] text-[13px] font-medium text-[#0F172A] focus:border-[#2563EB] focus:outline-none" placeholder="Parts, labour breakdown..."></textarea>
                </div>

                <button type="button" data-action="generate-contractor-invoice" class="w-full py-3 rounded-[12px] bg-[#2563EB] text-white text-[13.5px] font-bold hover:bg-[#1D4ED8] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs">
                    <i data-lucide="file-text" class="w-4 h-4"></i> Generate invoice
                </button>
            </div>`}
        </div>

        <!-- 2. Extra Work Card -->
        <div class="card p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs space-y-3 text-left">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-[10px] bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <i data-lucide="wrench" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-[15px] font-extrabold text-[#0F172A] m-0">Extra work</h3>
                    <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">Add any additional work done for this job.</p>
                </div>
            </div>

            ${job.extraWork?.length ? `
            <div class="divide-y divide-[#F1F5F9] border-t border-b border-[#F1F5F9]">
                ${job.extraWork.map(w => `
                <div class="py-2.5 flex items-center justify-between text-[13px]">
                    <span class="font-medium text-[#0F172A]">${esc(w.desc)}</span>
                    <span class="font-bold text-[#16A34A]">+${esc(w.amount)}</span>
                </div>`).join('')}
            </div>` : ''}

            <button type="button" data-action="add-extra-work" class="w-full py-3 px-4 rounded-[12px] border border-dashed border-[#2563EB] bg-[#EFF6FF]/50 text-[#2563EB] text-[13px] font-bold hover:bg-[#EFF6FF] transition-colors cursor-pointer flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] font-black">+</span>
                    Request extra work
                </span>
                <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- 3. Job Certificates Card -->
        <div class="card p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs space-y-3 text-left">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-[10px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
                    <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-[15px] font-extrabold text-[#0F172A] m-0">Job certificates</h3>
                    <p class="text-[12px] font-medium text-[#64748B] m-0 mt-0.5">Upload relevant certificates (if any).</p>
                </div>
            </div>

            ${certs.length ? `
            <div class="space-y-2">
                ${certs.map(c => `
                <div class="p-3 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3 text-left">
                    <div class="w-8 h-8 rounded-[8px] bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                        <i data-lucide="file-check" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-[13px] font-bold text-[#0F172A] truncate m-0">${esc(c.name)}</p>
                        <p class="text-[11px] text-[#64748B] truncate m-0">${esc(c.fileName || 'Document on file')} · ${esc(c.uploadedAt || 'Today')}</p>
                    </div>
                </div>`).join('')}
            </div>` : ''}

            <button type="button" data-contractor-upload="certificate" class="w-full py-4 rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] text-[12.5px] font-bold hover:bg-[#F1F5F9] hover:border-[#94A3B8] transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5">
                <div class="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <i data-lucide="upload-cloud" class="w-4 h-4"></i>
                </div>
                <span>Upload certificate</span>
                <span class="text-[10.5px] font-normal text-[#94A3B8]">PDF, JPG or PNG (Max 5MB)</span>
            </button>
        </div>

        <!-- 4. Final Submission Button -->
        <div class="space-y-2 pt-2">
            <button type="button" data-action="mark-contractor-complete" class="w-full py-3.5 rounded-[12px] bg-[#2563EB] text-white text-[14px] font-extrabold hover:bg-[#1D4ED8] transition-colors cursor-pointer text-center shadow-md flex items-center justify-center gap-2">
                <i data-lucide="send" class="w-4 h-4"></i> Submit for approval
            </button>
            <p class="text-[11.5px] font-medium text-[#64748B] text-center flex items-center justify-center gap-1">
                <i data-lucide="info" class="w-3.5 h-3.5 text-[#94A3B8]"></i>
                Photos optional · System invoice required
            </p>
        </div>
    </div>
    ${typeof renderContractorCertUploadModal === 'function' ? renderContractorCertUploadModal() : ''}`;
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
    return screenContractorCompleteJob();
}

function screenContractorDocuments() {
    return screenContractorJobInvoice();
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

function screenContractorReviews() {
    const summary = typeof contractorReviewSummary === 'function' ? contractorReviewSummary() : { avg: '4.8', count: 5 };
    const reviews = typeof collectContractorReviews === 'function' ? collectContractorReviews() : [];
    const dist = contractorReviewDistribution(reviews);
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;

    return `${topBar('Reviews', { back: true })}
    <div class="screen-content screen-enter space-y-4 text-left pb-16">
        <!-- Rating Overview Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-5 text-left">
            <div class="flex flex-col items-center justify-center shrink-0 px-2">
                <span class="text-[34px] font-black text-[#0F172A] tracking-tight leading-none">${summary.avg}</span>
                <div class="flex items-center gap-0.5 text-[#F59E0B] text-[14px] mt-2">
                    <i data-lucide="star" class="w-4 h-4 fill-[#F59E0B]"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-[#F59E0B]"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-[#F59E0B]"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-[#F59E0B]"></i>
                    <i data-lucide="star" class="w-4 h-4 fill-[#F59E0B]"></i>
                </div>
                <span class="text-[11.5px] font-semibold text-[#64748B] mt-1.5">${summary.count} review${summary.count === 1 ? '' : 's'}</span>
            </div>

            <div class="flex-1 space-y-1.5 min-w-0 pr-1">
                ${dist.map(d => `
                <div class="flex items-center gap-2 text-[11px] font-bold text-[#64748B]">
                    <span class="w-2 text-right font-bold text-[#475569]">${d.stars}</span>
                    <i data-lucide="star" class="w-3 h-3 text-[#F59E0B] fill-[#F59E0B] shrink-0"></i>
                    <div class="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div class="h-full rounded-full bg-[#F59E0B] transition-all duration-500" style="width:${d.pct}%"></div>
                    </div>
                    <span class="w-3 text-right text-[11px] font-medium text-[#94A3B8]">${d.count}</span>
                </div>`).join('')}
            </div>
        </div>

        <!-- Review Cards List -->
        <div class="space-y-3">
            <h3 class="text-[15px] font-black text-[#0F172A] m-0 px-1">Recent Feedback</h3>
            ${reviews.length ? reviews.map(r => {
                const initials = (r.from || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                const isLandlord = (r.role === 'landlord' || (r.from && r.from.includes('Landlord')));
                return `
            <article class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2.5 text-left">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-black text-[13px] flex items-center justify-center shrink-0">
                            ${initials}
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5">
                                <h4 class="text-[14px] font-extrabold text-[#0F172A] m-0 truncate">${esc(r.from)}</h4>
                                ${isLandlord ? `<span class="px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706] text-[10px] font-extrabold">Landlord</span>` : `<span class="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-extrabold">Tenant</span>`}
                            </div>
                            <p class="text-[12px] font-medium text-[#64748B] m-0 truncate mt-0.5">${esc(r.job)}</p>
                        </div>
                    </div>
                    <span class="text-[11.5px] font-medium text-[#94A3B8] shrink-0">${esc(r.at)}</span>
                </div>

                <div class="flex items-center gap-0.5 text-[#F59E0B] text-[13px]">
                    ${Array.from({ length: r.stars }).map(() => `<i data-lucide="star" class="w-3.5 h-3.5 fill-[#F59E0B]"></i>`).join('')}
                    ${Array.from({ length: 5 - r.stars }).map(() => `<i data-lucide="star" class="w-3.5 h-3.5 text-[#E2E8F0] fill-[#E2E8F0]"></i>`).join('')}
                </div>

                <p class="text-[13px] font-medium text-[#334155] leading-relaxed m-0">${esc(r.comment)}</p>
            </article>`;
            }).join('') : `
            <div class="card p-6 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-2">
                <i data-lucide="star" class="w-8 h-8 text-[#94A3B8] mx-auto"></i>
                <p class="text-[13px] font-semibold text-[#64748B] m-0">No reviews yet — they appear after completed jobs.</p>
            </div>`}
        </div>
    </div>`;
}

function screenContractorProfile() {
    const u = CONTRACTOR_USER;
    const displayName = typeof fullNameFromParts === 'function' ? fullNameFromParts(u.firstName, u.lastName) : `${u.firstName} ${u.lastName}`.trim();
    const trade = contractorTradeFromLabel(u.trade);
    const av = typeof getContractorProfilePhoto === 'function' ? getContractorProfilePhoto() : (IMG?.avatar?.plumber || 'assets/plumber.png');
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const subLabel = `${trade.shortLabel || 'Contractor'} · ${u.company || 'Service Pro'}`;
    const certCount = typeof ensureContractorCertificates === 'function' ? ensureContractorCertificates(u).length : 2;
    const reviewSummary = typeof contractorReviewSummary === 'function' ? contractorReviewSummary() : { avg: '4.8', count: 12 };

    const group1 = [
        ['user', 'Personal Information', 'personal-info'],
        ['building-2', 'Company Information', 'contractor-company'],
        ['shield-check', 'Certifications', 'contractor-certifications', `${certCount} on file`],
        ['bell', 'Notification Settings', 'notifications-settings'],
        ['key-round', 'Change Password', 'password'],
    ];

    const group2 = [
        ['banknote', 'Earnings & Payouts', 'contractor-earnings'],
        ['star', 'Reviews & Ratings', 'contractor-reviews', reviewSummary.count ? `${reviewSummary.avg} (${reviewSummary.count})` : '—'],
    ];

    const group3 = [
        ['circle-help', 'Help & Support', 'help-support'],
        ['info', 'About Landlord HQ', 'about'],
        ['shield-check', 'Privacy Policy', 'privacy'],
        ['file-text', 'Terms & Conditions', 'terms'],
    ];

    return `${topBar('Profile', { hideBell: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-4 text-left pb-8">
        <!-- Top Profile User Card -->
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-3 text-left">
            <div class="flex items-center gap-3.5 min-w-0">
                <img src="${av}" class="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E2E8F0]" alt="">
                <div class="min-w-0">
                    <h3 class="text-[16px] font-extrabold text-[#0F172A] truncate m-0">${esc(displayName)}</h3>
                    <p class="text-[12.5px] font-medium text-[#64748B] m-0 mt-0.5 truncate">${esc(subLabel)}</p>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] mt-1">
                        <i data-lucide="gift" class="w-3 h-3"></i> Always free
                    </span>
                </div>
            </div>
            <button type="button" data-go="personal-info" class="text-[#2563EB] text-[12px] font-bold hover:underline cursor-pointer shrink-0">Edit</button>
        </div>

        <!-- Inset Group 1: Business & Account Settings -->
        <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden text-left">
            ${group1.map(([icon, label, targetGo, hint]) => `
            <button type="button" data-go="${targetGo}" class="w-full p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-[#334155] group-hover:text-[#2563EB] transition-colors shrink-0"></i>
                    <span class="text-[14px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">${label}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${hint ? `<span class="text-[11.5px] font-medium text-[#64748B]">${esc(hint)}</span>` : ''}
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform"></i>
                </div>
            </button>`).join('')}
        </div>

        <!-- Inset Group 2: Earnings & Reviews -->
        <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden text-left">
            ${group2.map(([icon, label, targetGo, hint]) => `
            <button type="button" data-go="${targetGo}" class="w-full p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-[#334155] group-hover:text-[#2563EB] transition-colors shrink-0"></i>
                    <span class="text-[14px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">${label}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${hint ? `<span class="text-[11.5px] font-medium text-[#64748B]">${esc(hint)}</span>` : ''}
                    <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform"></i>
                </div>
            </button>`).join('')}
        </div>

        <!-- Inset Group 3: Support & Policies -->
        <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9] overflow-hidden text-left">
            ${group3.map(([icon, label, targetGo]) => `
            <button type="button" data-go="${targetGo}" class="w-full p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <i data-lucide="${icon}" class="w-5 h-5 text-[#334155] group-hover:text-[#2563EB] transition-colors shrink-0"></i>
                    <span class="text-[14px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">${label}</span>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] group-hover:translate-x-0.5 transition-transform shrink-0"></i>
            </button>`).join('')}
        </div>

        <!-- Red Outline Log Out Button -->
        <button type="button" data-action="logout" class="w-full py-3.5 rounded-2xl border border-[#FCA5A5] bg-white text-[#EF4444] font-extrabold text-[14px] hover:bg-[#FEF2F2] transition-colors cursor-pointer text-center shadow-xs mt-2">
            Log out
        </button>
        <div class="text-center space-y-1 pt-1">
            <button type="button" data-go="delete-account" class="text-[12px] font-semibold text-[#94A3B8] hover:text-[#DC2626] transition-colors cursor-pointer">Delete account</button>
            <p class="text-[11px] text-[#CBD5E1] m-0">Contractor portal · Demo build</p>
        </div>
    </div>`;
}

function screenContractorOrg() {
    const members = [
        { name: 'Mike Thompson', role: 'Owner / Lead Gas Safe Engineer', status: 'Master Account', email: 'mike@plumberpro.co.uk', initials: 'MT', bg: 'bg-blue-600' },
        { name: 'Jack Davis', role: 'Plumbing Apprentice', status: 'Field Tech', email: 'jack.d@plumberpro.co.uk', initials: 'JD', bg: 'bg-emerald-600' },
        { name: 'Dave Miller', role: 'Subcontractor Electrician', status: 'Sub-account', email: 'dave.m@electricians.co.uk', initials: 'DM', bg: 'bg-indigo-600' },
    ];
    return `${topBar('Organisation & Teams', { back: true })}
    <div class="screen-content screen-enter space-y-4 text-left pb-8">
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
            <div class="flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Master Account</span>
                    <h3 class="text-[16px] font-bold text-[#0F172A]">${escapeHtml(CONTRACTOR_USER.company || 'Plumber Pro Ltd')}</h3>
                    <p class="text-[12px] text-[#64748B]">3 active team members · Dispatch enabled</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                    <i data-lucide="users" class="w-5 h-5"></i>
                </div>
            </div>
        </div>

        <div class="space-y-2.5">
            <div class="flex items-center justify-between px-1">
                <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Team Members (${members.length})</span>
            </div>
            <div class="card rounded-2xl bg-white border border-[#E2E8F0] shadow-sm divide-y divide-slate-100 overflow-hidden">
                ${members.map(m => `
                <div class="p-3.5 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-9 h-9 rounded-xl ${m.bg} text-white font-bold text-[12px] flex items-center justify-center shrink-0 shadow-xs">
                            ${m.initials}
                        </div>
                        <div class="min-w-0">
                            <p class="text-[13px] font-bold text-[#0F172A] truncate">${escapeHtml(m.name)}</p>
                            <p class="text-[11px] text-[#64748B] truncate">${escapeHtml(m.role)}</p>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold shrink-0">${m.status}</span>
                </div>`).join('')}
            </div>
        </div>

        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
            <p class="text-[13px] font-bold text-[#0F172A]">Dispatch & Field Permissions</p>
            <label class="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" class="accent-[#2563EB] mt-0.5" checked>
                <span class="text-[12px] text-slate-700 font-medium">Allow field technicians to accept jobs and update job progress</span>
            </label>
            <label class="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" class="accent-[#2563EB] mt-0.5" checked>
                <span class="text-[12px] text-slate-700 font-medium">Allow upload of completion photos and safety certificates</span>
            </label>
            <label class="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" class="accent-[#2563EB] mt-0.5">
                <span class="text-[12px] text-slate-700 font-medium">Allow technicians to view full landlord pricing and margins</span>
            </label>
        </div>

        <button type="button" data-action="save" data-msg="Organisation settings saved!" class="btn-primary w-full py-3.5 text-[14px]">Save Team Settings</button>
    </div>`;
}

function saveContractorCompany() {
    const company = (typeof fieldVal === 'function' ? fieldVal('companyName') : document.querySelector('[data-field="companyName"]')?.value)?.trim();
    if (!company) { toast('Enter company name'); return true; }
    CONTRACTOR_USER.company = company;
    const trade = (typeof fieldVal === 'function' ? fieldVal('trade') : document.querySelector('[data-field="trade"]')?.value) || CONTRACTOR_USER.trade;
    CONTRACTOR_USER.trade = trade;
    if (typeof normalizeContractorTradeFields === 'function') {
        Object.assign(CONTRACTOR_USER, normalizeContractorTradeFields(CONTRACTOR_USER));
    }
    CONTRACTOR_USER.companyReg = (typeof fieldVal === 'function' ? fieldVal('companyReg') : '') || '';
    CONTRACTOR_USER.vatNumber = (typeof fieldVal === 'function' ? fieldVal('vatNumber') : '') || '';
    CONTRACTOR_USER.phone = (typeof fieldVal === 'function' ? fieldVal('phone') : CONTRACTOR_USER.phone) || CONTRACTOR_USER.phone;
    CONTRACTOR_USER.email = (typeof fieldVal === 'function' ? fieldVal('email') : CONTRACTOR_USER.email) || CONTRACTOR_USER.email;
    if (typeof contractorAccountByEmail === 'function') {
        const acc = contractorAccountByEmail(CONTRACTOR_USER.email);
        if (acc) {
            acc.company = CONTRACTOR_USER.company;
            acc.trade = CONTRACTOR_USER.trade;
            acc.tradeId = CONTRACTOR_USER.tradeId;
            acc.category = CONTRACTOR_USER.category;
            acc.jobsFor = CONTRACTOR_USER.jobsFor;
            acc.companyReg = CONTRACTOR_USER.companyReg;
            acc.vatNumber = CONTRACTOR_USER.vatNumber;
            acc.phone = CONTRACTOR_USER.phone;
            acc.email = CONTRACTOR_USER.email;
            if (typeof saveContractorAccounts === 'function') saveContractorAccounts();
        }
    }
    if (typeof syncContractorUserToDirectory === 'function') syncContractorUserToDirectory();
    if (typeof AppStore !== 'undefined') AppStore.save();
    toast('Company info updated');
    back();
    return true;
}

function renderContractorMultiTradesPicker() {
    const activeTrades = CONTRACTOR_USER.trades || (CONTRACTOR_USER.trade ? [CONTRACTOR_USER.trade] : [CONTRACTOR_TRADES[0]]);
    const selectedTrades = new Set(activeTrades);
    return `
    <div class="mb-4">
        <label class="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Trades & Services Offered (Select all that apply)</label>
        <div class="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9]">
            ${CONTRACTOR_TRADES.map(t => {
                const active = selectedTrades.has(t);
                return `
                <button type="button" data-action="toggle-contractor-trade" data-trade="${escapeHtml(t)}" class="px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${active ? 'bg-[#2563EB] text-white shadow-sm' : 'bg-white text-[#334155] border border-[#E2E8F0] hover:border-[#CBD5E1]'}">
                    <i data-lucide="${active ? 'check' : 'plus'}" class="w-3.5 h-3.5"></i>
                    <span>${escapeHtml(t)}</span>
                </button>`;
            }).join('')}
        </div>
    </div>`;
}

function toggleContractorTradeHandler(trade) {
    if (!CONTRACTOR_USER.trades) {
        CONTRACTOR_USER.trades = CONTRACTOR_USER.trade ? [CONTRACTOR_USER.trade] : [CONTRACTOR_TRADES[0]];
    }
    const idx = CONTRACTOR_USER.trades.indexOf(trade);
    if (idx >= 0) {
        if (CONTRACTOR_USER.trades.length > 1) {
            CONTRACTOR_USER.trades.splice(idx, 1);
        } else {
            toast('You must select at least one trade');
            return;
        }
    } else {
        CONTRACTOR_USER.trades.push(trade);
    }
    CONTRACTOR_USER.trade = CONTRACTOR_USER.trades[0];
    if (typeof syncContractorUserToDirectory === 'function') syncContractorUserToDirectory();
    render();
}

function screenContractorCompany() {
    const esc = typeof escapeHtml === 'function' ? escapeHtml : (s) => s;
    const tradesList = CONTRACTOR_USER.trades || [CONTRACTOR_USER.trade];
    return `${topBar('Company Information', { back: true })}
    <div class="screen-content screen-content-sm screen-enter space-y-3.5 text-left pb-8">
        <div class="card p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-3.5">
            ${formField('Company Name', CONTRACTOR_USER.company || '', 'text', 'Plumber Pro Ltd', 'companyName')}
            ${renderContractorMultiTradesPicker()}
            ${formField('Company Reg. No.', CONTRACTOR_USER.companyReg || '', 'text', '12345678', 'companyReg')}
            ${formField('VAT Number', CONTRACTOR_USER.vatNumber || '', 'text', 'GB123456789', 'vatNumber')}
            ${formField('Phone', CONTRACTOR_USER.phone || '', 'tel', '', 'phone')}
            ${formField('Email', CONTRACTOR_USER.email || '', 'email', '', 'email')}
        </div>
        ${saveBtn('Save Changes', 'Company info updated')}
    </div>`;
}

function screenContractorPropertyDocs() {
    const docs = AppStore.documents || [];
    return `${topBar('Property Documents', { back: true })}
    <div class="screen-content screen-enter space-y-4">
        <div class="card p-4 bg-[#EFF6FF] border border-[#BFDBFE]">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                    <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>
                <div>
                    <p class="text-[13px] font-bold text-[#0F172A]">Property Compliance Portal</p>
                    <p class="text-[11px] text-[#64748B] mt-0.5">Certificates uploaded here automatically sync to the Landlord and Tenant accounts for the property.</p>
                </div>
            </div>
            <button type="button" onclick="openContractorCertUploadModal()" class="btn-primary w-full py-3 text-[13px] font-semibold mt-3 flex items-center justify-center gap-2">
                <i data-lucide="upload" class="w-4 h-4"></i>
                Upload Certificate to Landlord & Tenant
            </button>
        </div>

        <p class="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-1">Uploaded & Synced Property Certificates (${docs.length})</p>

        <div class="space-y-2">
            ${docs.slice(0, 10).map(d => `
            <div class="card p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#2563EB] shrink-0">
                        <i data-lucide="file-text" class="w-4 h-4"></i>
                    </div>
                    <div class="min-w-0">
                        <span class="block text-[13px] font-bold text-[#0F172A] truncate">${escapeHtml(d.name || d.type || 'Certificate')}</span>
                        <span class="block text-[11px] text-[#64748B] truncate mt-0.5">${escapeHtml(d.type || 'Document')} · ${escapeHtml(d.date || 'Synced')}</span>
                    </div>
                </div>
                <span class="badge bg-[#ECFDF5] text-[#059669] text-[10px] shrink-0">Synced to 3 Roles</span>
            </div>`).join('')}
        </div>
    </div>`;
}

function openContractorCertUploadModal() {
    openModal(`
    <div class="card p-5 space-y-4 text-left screen-enter">
        <div class="flex items-center justify-between">
            <h3 class="text-[16px] font-bold text-[#0F172A] m-0">Upload Property Certificate</h3>
            <button type="button" onclick="closeModal()" class="text-[#94A3B8] hover:text-[#0F172A]"><i data-lucide="x" class="w-5 h-5"></i></button>
        </div>
        <p class="text-[12px] text-[#64748B] m-0">Select property and certificate category. Uploaded file will immediately sync to the Landlord and Tenant document folders.</p>
        <div>
            <label class="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Target Property</label>
            <select id="contractor-upload-property" class="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-[13px] outline-none">
                ${PROPERTIES.map((p, i) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
            </select>
        </div>
        <div>
            <label class="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Certificate Type / Folder</label>
            <select id="contractor-upload-type" class="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-[13px] outline-none">
                <option value="Gas Safety Certificate">Gas Safety Certificate (CP12)</option>
                <option value="EICR">Electrical Safety (EICR)</option>
                <option value="Energy Performance Certificate">Energy Performance Certificate (EPC)</option>
                <option value="Property Licence">Property Licence</option>
                <option value="Maintenance Record">Maintenance / Inspection Certificate</option>
            </select>
        </div>
        <div>
            <label class="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Expiry Date (Optional)</label>
            <input type="date" id="contractor-upload-expiry" class="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-[13px] outline-none">
        </div>
        <div>
            <label class="block text-[11px] font-bold text-[#64748B] uppercase mb-1">Certificate Document File</label>
            <input type="file" id="contractor-upload-file" accept="image/*,.pdf" class="w-full p-2 rounded-xl border border-[#CBD5E1] text-[12px]">
        </div>
        <div class="pt-2 flex gap-2">
            <button type="button" onclick="closeModal()" class="flex-1 py-3 text-[13px] font-semibold text-[#64748B] bg-[#F1F5F9] rounded-xl">Cancel</button>
            <button type="button" onclick="submitContractorCertUploadHandler()" class="flex-1 py-3 text-[13px] font-semibold text-white bg-[#2563EB] rounded-xl shadow-sm">Upload & Sync</button>
        </div>
    </div>`);
    if (window.lucide) lucide.createIcons();
}

function submitContractorCertUploadHandler() {
    const pid = Number(document.getElementById('contractor-upload-property')?.value || 0);
    const certType = document.getElementById('contractor-upload-type')?.value || 'Gas Safety Certificate';
    const expiry = document.getElementById('contractor-upload-expiry')?.value || '';
    const fileInput = document.getElementById('contractor-upload-file');
    const fileName = fileInput?.files?.[0]?.name || `${certType}.pdf`;

    if (!AppStore.documents) AppStore.documents = [];
    const docId = AppStore.nextId(AppStore.documents);
    const newDoc = {
        id: docId,
        propertyId: pid,
        type: certType,
        name: fileName,
        url: 'assets/sample_cert.pdf',
        date: new Date().toISOString().slice(0, 10),
        expiryDate: expiry,
        uploadedByRole: 'contractor',
        sharedWith: ['landlord', 'tenant', 'contractor'],
        autoSynced: true,
    };
    AppStore.documents.push(newDoc);

    if (expiry) {
        if (!AppStore.complianceCerts) AppStore.complianceCerts = {};
        let cid = 0;
        if (certType.includes('Gas')) cid = 0;
        else if (certType.includes('EICR')) cid = 1;
        else if (certType.includes('Energy')) cid = 5;
        const certKey = `${pid}-${cid}`;
        AppStore.complianceCerts[certKey] = {
            expiryDate: expiry,
            issuedBy: CONTRACTOR_USER.company || 'Contractor',
            certNumber: `CERT-${Date.now().toString().slice(-6)}`,
            file: fileName,
        };
    }

    closeModal();
    toast('Certificate uploaded & synced to Landlord and Tenant portals!');
    render();
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
    'contractor-schedule-hub': screenContractorScheduleHub,
    'contractor-earnings': screenContractorEarnings,
    'contractor-reviews': screenContractorReviews,
    'contractor-work': screenContractorWork,
    'contractor-documents': screenContractorDocuments,
    'contractor-notifications': screenContractorNotifications,
    'contractor-profile': screenContractorProfile,
    'contractor-org': screenContractorOrg,
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
    'tenant-inventory': screenTenantInventory,
    'tenant-inventory-room': screenTenantInventoryRoom,
    'tenant-announcements': screenTenantAnnouncements,
    'tenant-announcement-detail': screenTenantAnnouncementDetail,
    'tenant-house-rules': screenTenantHouseRules,
    'tenant-edit-profile': screenTenantEditProfile,
    'tenant-issues': screenTenantIssues,
    'tenant-documents': screenTenantDocuments,
    'tenant-referencing': screenTenantReferencing,
    'tenant-ref-detail': screenTenantRefDetail,
    'tenant-active-tenancy': screenTenantActiveTenancy,
    'tenant-contact': screenTenantContact,
    'tenant-reminders': screenTenantReminders,
    'tenant-reminder-detail': screenTenantReminderDetail,
    'tenant-inspection-upload': screenTenantInspectionUpload,
    'tenant-compliance': screenTenantCompliance,
    'tenant-communication': screenTenantCommunication,
    'tenant-checkout': screenTenantCheckout,
});

const CONTRACTOR_NO_NAV = [
    'contractor-job-detail', 'contractor-schedule', 'contractor-schedule-hub', 'contractor-earnings', 'contractor-reviews',
    'contractor-work', 'contractor-documents',
    'contractor-company', 'contractor-certifications', 'contractor-public-profile', 'contractor-cert-preview',
    'contractor-invite', 'contractor-sign-up', 'contractor-welcome',
    'contractor-landlords', 'contractor-invite-landlord', 'contractor-landlord-invite-sent',
    'tenant-invite', 'tenant-activate', 'tenant-welcome', 'tenant-dashboard',
    'tenant-building-info', 'tenant-inventory', 'tenant-inventory-room', 'tenant-announcements', 'tenant-announcement-detail', 'tenant-house-rules', 'tenant-edit-profile',
    'tenant-issues', 'tenant-documents', 'tenant-referencing', 'tenant-ref-detail',
    'tenant-active-tenancy', 'tenant-contact', 'tenant-reminders', 'tenant-reminder-detail', 'tenant-compliance',
    'tenant-communication', 'tenant-checkout', 'tenant-inspection-upload',
];
NO_NAV.push(...CONTRACTOR_NO_NAV);

function bindContractorEvents() {
    const app = document.getElementById('app');
    app.querySelectorAll('[data-contractor-earn-period]').forEach(el => {
        el.onclick = () => {
            STATE.contractorEarnPeriod = el.dataset.contractorEarnPeriod;
            render();
        };
    });
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
    app.querySelectorAll('[data-action="open-contractor-quote-modal"]').forEach(el => {
        el.onclick = () => { STATE.showContractorQuoteModal = true; render(); };
    });
    app.querySelectorAll('[data-action="close-contractor-quote-modal"]').forEach(el => {
        el.onclick = () => { STATE.showContractorQuoteModal = false; render(); };
    });
    app.querySelectorAll('[data-action="submit-contractor-quote"]').forEach(el => {
        el.onclick = submitContractorQuote;
    });
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
    app.querySelectorAll('[data-action="add-extra-work"]').forEach(el => {
        el.onclick = () => {
            const job = contractorJob(STATE.contractorJobId);
            if (!job) return;
            if (!job.extraWork) job.extraWork = [];
            job.extraWork.push({
                desc: 'Approved extra work',
                amount: '£75',
                at: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                status: 'pending_approval',
            });
            if (typeof saveContractorJobs === 'function') saveContractorJobs();
            toast('Extra work request sent to landlord for approval');
            render();
        };
    });
    app.querySelectorAll('[data-action="close-contractor-cert-upload"]').forEach(el => {
        el.onclick = (e) => { e.preventDefault(); closeContractorCertUpload(); };
    });
    app.querySelectorAll('[data-action="delete-contractor-cert"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteContractorCert(+el.dataset.cert);
        };
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
    app.querySelectorAll('[data-action="set-building-tab"]').forEach(el => {
        el.onclick = (e) => {
            e.preventDefault();
            STATE.buildingInfoTab = el.dataset.tab || 'overview';
            if (typeof render === 'function') render();
        };
    });
}

const _ctrOrigBindEvents = bindEvents;
bindEvents = function() {
    _ctrOrigBindEvents();
    bindContractorEvents();
};

CONTRACTOR_JOBS.forEach(ensureContractorJob);
