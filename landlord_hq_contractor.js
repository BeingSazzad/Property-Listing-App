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
    ['message-square', 'Messages', 'messages'],
    ['bell', 'Notifications', 'contractor-notifications'],
    ['user', 'Profile', 'contractor-profile'],
    ['life-buoy', 'Help & Support', 'help-support'],
];

const CONTRACTOR_JOBS = [
    { id: 0, maintId: 0, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Kitchen sink leaking', priority: 'High', visitDate: 'Today, 2:00 PM', status: 'assigned', assignedDate: 'Mar 10, 2025', desc: 'Water dripping from pipe under kitchen sink. Tenant reports it started this morning. Access via front door — tenant will be home after 1 PM.', tenantChatId: 0, landlordChatId: 1 },
    { id: 1, maintId: 3, propertyId: 1, property: '45 Queens Road', address: 'London, SW2 3TR', tenant: 'David Wilson', landlord: 'John Smith', issue: 'Boiler not working', priority: 'High', visitDate: 'Tomorrow, 10:00 AM', status: 'accepted', assignedDate: 'Mar 8, 2025', desc: 'No hot water or heating. Boiler showing error code E119. Parking available on street.', tenantChatId: 2, landlordChatId: 1 },
    { id: 2, maintId: 1, propertyId: 2, property: '88 King Street', address: 'London, EC2V 8BB', tenant: '—', landlord: 'John Smith', issue: 'Window latch broken', priority: 'Medium', visitDate: 'Mar 14, 11:30 AM', status: 'scheduled', assignedDate: 'Mar 7, 2025', desc: 'Bedroom window latch broken — window cannot be secured. Main Flat currently vacant.', tenantChatId: null, landlordChatId: 1 },
    { id: 3, maintId: 4, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Radiator not heating', priority: 'Medium', visitDate: 'Mar 12, 3:00 PM', status: 'in_progress', assignedDate: 'Mar 5, 2025', desc: 'Living room radiator cold while others work. Possible air lock or valve issue.', tenantChatId: 4, landlordChatId: 1, notes: [{ text: 'Bleed radiator — still cold on return pipe', time: 'Mar 11, 2:30 PM' }], photos: { before: [IMG.maint[2]], during: [], after: [] } },
    { id: 4, maintId: 6, propertyId: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Tap replacement', priority: 'Low', visitDate: 'Mar 1, 2025', status: 'waiting_approval', assignedDate: 'Feb 20, 2025', desc: 'Kitchen tap replaced. Invoice submitted awaiting landlord approval.', tenantChatId: 0, landlordChatId: 1, invoice: { amount: '£185', file: 'INV-PLB-1042.pdf', uploadedAt: 'Mar 1, 2025' } },
    { id: 5, maintId: 5, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Light flickering', priority: 'Low', visitDate: 'Feb 18, 2025', status: 'completed', assignedDate: 'Feb 10, 2025', desc: 'Living room ceiling light flickering — resolved with new fitting.', tenantChatId: 4, landlordChatId: 1 },
    { id: 6, maintId: null, propertyId: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Annual gas check', priority: 'Low', visitDate: 'Jan 30, 2025', status: 'paid', assignedDate: 'Jan 15, 2025', desc: 'Annual gas safety inspection completed. Certificate uploaded.', tenantChatId: 4, landlordChatId: 1, certificates: [{ name: 'Gas Safety Certificate', uploadedAt: 'Jan 30, 2025' }] },
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
    waiting_approval: { label: 'Waiting Approval', bg: '#F3E8FF', color: '#7C3AED' },
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

function ensureContractorJob(job) {
    if (!job.photos) job.photos = { before: [], during: [], after: [] };
    if (!job.certificates) job.certificates = [];
    if (!job.notes) job.notes = [];
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
    const contractorName = job.contractorName || 'Plumber Pro';
    if (job.status === 'accepted' || job.status === 'scheduled') {
        item.status = 'progress';
        item.contractor = contractorName;
    }
    if (job.status === 'in_progress') {
        item.status = 'progress';
        item.contractor = contractorName;
    }
    if (job.status === 'waiting_approval' && typeof addMaintHistoryEvent === 'function') {
        addMaintHistoryEvent(item, 'Work submitted', 'Awaiting landlord approval');
    }
    if (job.status === 'completed' || job.status === 'paid') {
        item.status = 'done';
        if (typeof addMaintHistoryEvent === 'function') addMaintHistoryEvent(item, 'Work completed', 'Marked complete by contractor');
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
    return `
    <button data-go="contractor-job-detail" data-job="${job.id}" class="ctr-job-card card w-full text-left">
        <div class="ctr-job-card-top">
            <span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
            <span class="badge" style="background:${pBg};color:${pColor}">${job.priority}</span>
        </div>
        <p class="ctr-job-title">${job.issue}</p>
        <p class="ctr-job-prop">${job.property}</p>
        <p class="ctr-job-addr">${job.address}</p>
        <div class="ctr-job-meta">
            <span><i data-lucide="user" class="w-3.5 h-3.5"></i>${job.tenant}</span>
            <span><i data-lucide="calendar" class="w-3.5 h-3.5"></i>${job.visitDate}</span>
        </div>
    </button>`;
};

const contractorTimeline = (status) => {
    const steps = [
        ['assigned', 'Assigned'],
        ['accepted', 'Accepted'],
        ['scheduled', 'Visit Scheduled'],
        ['in_progress', 'Work Started'],
        ['waiting_approval', 'Invoice Uploaded'],
        ['completed', 'Completed'],
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
        job.certificates.push({ name: 'Work Certificate', uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });
        toast('Certificate uploaded');
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
    const amount = document.querySelector('[data-field="invoiceAmount"]')?.value?.trim();
    if (!job.invoice && amount) {
        job.invoice = {
            amount: amount.startsWith('£') ? amount : `£${amount}`,
            file: `INV-${job.id + 100}.pdf`,
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };
    }
    if (!job.invoice) {
        toast('Upload your invoice first');
        return;
    }
    job.status = 'waiting_approval';
    syncContractorJobToMaintenance(job);
    submitContractorInvoice(job);
    saveContractorJobs();
    if (typeof AppStore !== 'undefined') AppStore.save();
    toast('Job submitted — waiting for landlord approval');
    go('contractor-jobs');
}

const contractorFilterJobs = () => {
    const f = STATE.contractorJobFilter;
    const map = {
        all: () => true,
        assigned: j => j.status === 'assigned',
        accepted: j => ['accepted', 'scheduled'].includes(j.status),
        in_progress: j => ['in_progress', 'waiting_approval'].includes(j.status),
        completed: j => ['completed', 'paid'].includes(j.status),
    };
    return CONTRACTOR_JOBS.filter(map[f] || map.all);
};

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
            <button type="button" data-action="contractor-signup" class="btn-auth btn-auth-primary" style="margin-top:24px;width:100%">Create Account</button>
            <button type="button" data-action="contractor-sign-in" class="btn-auth btn-auth-outline" style="margin-top:12px;width:100%">Sign In with Email</button>
        </div>
    </div>`;
}

function screenContractorWelcome() {
    const newJobs = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
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
            <h1 class="welcome-hero-title">Welcome, Mike! 🔧</h1>
            <p class="welcome-hero-sub">Your contractor account is active. View jobs, schedule visits, and upload invoices.</p>
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
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
    </div>
    <div class="dash-greeting-row">
        <img src="${IMG.avatar.sarah}" class="dash-avatar" alt="">
        <div>
            <p class="dash-greeting">${dashGreeting()}, ${t.firstName}</p>
            <p class="dash-date">${p?.name || 'Your home'}${t.unit ? ` · ${t.unit}` : ''}</p>
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
    const tenantIssues = typeof MAINTENANCE_ITEMS !== 'undefined'
        ? MAINTENANCE_ITEMS.filter(m =>
            m.propertyId === t.propertyId &&
            (!t.unit || !m.unit || m.unit === '—' || m.unit === t.unit)
        ).slice(0, 4)
        : [];
    return `${tenantDashboardHeader(t, p)}
    <div class="screen-content screen-enter">
        <div class="card p-4" style="background:linear-gradient(135deg,#16A34A,#15803D);color:#fff;border:none">
            <p class="text-[11px] font-semibold opacity-80 uppercase tracking-wide">Your Home</p>
            <p class="text-[14px] font-bold mt-1">${p.name}</p>
            <p class="text-[12px] opacity-85 mt-1">${t.unit} · ${p.address}</p>
            <div class="flex gap-4 mt-4 pt-4 border-t border-white/20">
                <div><p class="text-[10px] opacity-75">Monthly Rent</p><p class="text-[13px] font-bold">${t.rent}</p></div>
                <div><p class="text-[10px] opacity-75">Lease Ends</p><p class="text-[13px] font-bold">${t.leaseEnd || '—'}</p></div>
                <div><p class="text-[10px] opacity-75">Landlord</p><p class="text-[13px] font-bold">${t.landlord.split(' ')[0]}</p></div>
            </div>
        </div>
        <div class="dash-quick">
            ${[
                ['wrench', 'Report Issue', 'log-maintenance', 'primary'],
                ['message-square', 'Message Landlord', 'messages', 'success'],
                ['file-text', 'Lease', 'document-preview', 'indigo'],
            ].map(([ic, label, go, tone]) => `
            <button data-go="${go}" class="dash-quick-btn">
                <div class="dash-quick-icon dash-quick-icon--${tone}"><i data-lucide="${ic}" class="w-5 h-5"></i></div>
                <span>${label}</span>
            </button>`).join('')}
        </div>
        <div class="card p-4">
            <p class="text-[13px] font-semibold text-[#0F172A]">Next Rent Due</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${t.rent}</p>
            <p class="text-[12px] text-[#64748B] mt-1">Due Apr 1, 2025 · Contact landlord to pay</p>
        </div>
        <div class="card p-4">
            <div class="flex items-center justify-between mb-2">
                <p class="text-[13px] font-semibold text-[#0F172A]">Your Maintenance Requests</p>
                <button data-go="log-maintenance" class="text-[12px] font-semibold text-[#2563EB]">Report new</button>
            </div>
            ${tenantIssues.length ? `<div class="maint-list">${tenantIssues.map(m => maintCard(m, { hideProperty: true })).join('')}</div>` : `<p class="text-[12px] text-[#64748B] py-2">No issues reported yet. Tap Report Issue to notify your landlord.</p>`}
        </div>
        <div class="card p-4">
            <div class="flex items-center justify-between mb-2">
                <p class="text-[13px] font-semibold text-[#0F172A]">Shared Documents</p>
            </div>
            ${(() => {
                const docs = typeof getTenantDocuments === 'function' ? getTenantDocuments(t.id) : [];
                return docs.length ? docs.slice(0, 3).map((doc, idx) => `
            <button data-go="document-preview" data-preview-source="tenant" data-preview-idx="${idx}" class="flex items-center gap-3 py-2.5 border-b border-[#F1F5F9] last:border-0 w-full text-left">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#EFF6FF;color:#2563EB"><i data-lucide="file-text" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-semibold text-[#0F172A] truncate">${doc[1]}</p>
                    <p class="text-[11px] text-[#64748B]">${doc[2]}</p>
                </div>
                <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1]"></i>
            </button>`).join('') : `<p class="text-[12px] text-[#64748B] py-2">Your landlord will share lease and compliance documents here.</p>`;
            })()}
        </div>
        <div class="card p-4">
            <p class="text-[13px] font-semibold text-[#0F172A] mb-2">Recent Activity</p>
            ${(() => {
                const rows = [];
                const chatId = typeof getTenantChatId === 'function' ? getTenantChatId(t.id) : null;
                const conv = chatId != null && typeof CONVERSATIONS !== 'undefined' ? CONVERSATIONS[chatId] : null;
                if (conv?.preview) rows.push(['message-square', '#EEF2FF', '#4F46E5', 'Message from landlord', conv.preview]);
                tenantIssues.slice(0, 2).forEach(m => {
                    const label = typeof maintStatusLabel !== 'undefined' ? (maintStatusLabel[m.status] || m.status) : m.status;
                    rows.push(['wrench', '#EFF6FF', '#2563EB', m.issue, `${label} · ${m.time}`]);
                });
                if (!rows.length) rows.push(['check-circle', '#ECFDF5', '#059669', 'Rent paid', `Mar 1, 2025 · ${t.rent || ''}`]);
                return rows.map(([ic, bg, color, title, sub]) => `
            <div class="flex items-center gap-3 py-2.5 border-b border-[#F1F5F9] last:border-0">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:${bg};color:${color}"><i data-lucide="${ic}" class="w-4 h-4"></i></div>
                <div class="flex-1 min-w-0"><p class="text-[13px] font-semibold">${title}</p><p class="text-[11px] text-[#64748B]">${sub}</p></div>
            </div>`).join('');
            })()}
        </div>
        <button data-action="logout" class="btn-secondary w-full py-3 text-[13px]">Sign Out</button>
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
                ['calendar', 'Schedule', 'contractor-jobs', 'indigo'],
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
    const f = STATE.contractorJobFilter;
    const tabs = [
        ['all', 'All'], ['assigned', 'Assigned'], ['accepted', 'Accepted'],
        ['in_progress', 'In Progress'], ['completed', 'Completed'],
    ];
    const jobs = contractorFilterJobs();
    return `${topBar('Jobs', { sub: `${jobs.length} jobs` })}
    <div class="screen-content screen-enter">
        <div class="filter-tabs" style="overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">
            ${tabs.map(([k, l]) => `
            <button type="button" data-contractor-filter="${k}" class="filter-chip ${f === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <div class="stack-sm" style="margin-top:12px">
            ${jobs.length ? jobs.map(j => contractorJobCard(j)).join('') : `
            <div class="card p-8 text-center">
                <i data-lucide="briefcase" class="w-10 h-10 text-[#CBD5E1] mx-auto"></i>
                <p class="text-[14px] font-semibold text-[#0F172A] mt-3">No jobs found</p>
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
            <button data-contractor-action="documents" class="btn-secondary w-full py-3.5 text-[14px] mt-3">Upload Invoice</button>`,
        waiting_approval: `<div class="card p-4 text-center" style="background:#F5F3FF"><p class="text-[14px] font-semibold text-[#7C3AED]">Waiting for landlord approval</p><p class="text-[13px] text-[#64748B] mt-1">Your invoice of ${job.invoice?.amount || '—'} is being reviewed</p></div>`,
        completed: `<div class="card p-4 text-center" style="background:#ECFDF5"><p class="text-[14px] font-semibold text-[#059669]">Job completed — awaiting payment</p></div>`,
        paid: `<div class="card p-4 text-center" style="background:#ECFDF5"><p class="text-[14px] font-semibold text-[#059669]">Payment received</p></div>`,
    };
    const overview = `
        <div class="card p-4">
            <p class="ctr-section-label">Property</p>
            <p class="text-[14px] font-bold text-[#0F172A] mt-1">${job.property}${job.unit ? ` · ${job.unit}` : ''}</p>
            <p class="text-[14px] text-[#64748B] mt-1">${job.address}</p>
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">Tenant complaint</p>
            <p class="text-[14px] text-[#475569] mt-2 leading-relaxed">${job.desc}</p>
            <div class="flex gap-2 mt-3 flex-wrap">
                <span class="badge bg-[#FEF3C7] text-[#B45309]">From tenant</span>
                <span class="badge" style="background:${pBg};color:${pColor}">${job.priority} priority</span>
            </div>
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
        </div>`;
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
            <div class="flex items-center gap-3 py-2 border-b border-[#F1F5F9] last:border-0">
                <i data-lucide="file-check" class="w-5 h-5 text-[#059669]"></i>
                <div><p class="text-[14px] font-semibold">${c.name}</p><p class="text-[12px] text-[#64748B]">${c.uploadedAt}</p></div>
            </div>`).join('') : `<p class="ctr-photo-empty">No certificates uploaded</p>`}
            <button type="button" data-contractor-upload="certificate" class="ctr-upload-btn mt-3"><i data-lucide="upload" class="w-4 h-4"></i> Upload certificate</button>
        </div>
        <div class="card p-4">
            <p class="ctr-section-label">Invoice</p>
            ${job.invoice ? `
            <div class="flex items-center justify-between py-2">
                <div><p class="text-[14px] font-bold">${job.invoice.amount}</p><p class="text-[13px] text-[#64748B]">${job.invoice.file} · ${job.invoice.uploadedAt}</p></div>
                <i data-lucide="check-circle" class="w-6 h-6 text-[#059669]"></i>
            </div>` : `
            ${formField('Invoice amount (£)', job.invoice?.amount?.replace('£', '') || '', 'number', '185', 'invoiceAmount')}
            <button type="button" data-contractor-upload="invoice" class="ctr-upload-btn mt-2"><i data-lucide="upload" class="w-4 h-4"></i> Upload invoice</button>`}
        </div>
        ${['in_progress', 'scheduled', 'accepted'].includes(job.status) ? `
        <button type="button" data-action="mark-contractor-complete" class="btn-primary w-full py-4 text-[13px] font-semibold">Mark Job Complete</button>
        <p class="text-[12px] text-[#64748B] text-center mt-2">Upload invoice first, then submit for landlord approval</p>` : ''}`;
    const tabBody = { overview, work, invoice };
    return `${topBar(job.issue, { back: true, sub: `${job.property}${job.unit ? ` · ${job.unit}` : ''}` })}
    <div class="screen-content screen-enter">
        <div class="flex gap-2 flex-wrap">
            <span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
            <span class="badge" style="background:${pBg};color:${pColor}">${job.priority}</span>
        </div>
        <p class="text-[12px] text-[#64748B] mt-2">${job.address}</p>
        <div class="flex gap-2 overflow-x-auto pb-1 mt-3">
            ${tabs.map(([k, l]) => `
            <button data-jtab="${k}" class="tab-pill ${tab === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        <div class="stack-sm" style="margin-top:12px">${tabBody[tab] || overview}</div>
        ${tab === 'overview' ? `<div style="margin-top:16px">${actions[job.status] || ''}</div>` : ''}
    </div>`;
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
                <p class="profile-card-name">Mike Thompson</p>
                <p class="profile-card-hint">Plumber Pro Ltd</p>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-[#CBD5E1] shrink-0"></i>
        </button>
        ${menuList([
            ['building-2', 'Company Information', 'contractor-company'],
            ['award', 'Certifications', 'contractor-company'],
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
        ${formField('Company Name', 'Plumber Pro Ltd')}
        ${formSelect('Trade Category', 'Plumbing & Heating', ['Plumbing & Heating', 'Electrical', 'General Maintenance', 'Roofing'])}
        ${formField('Company Reg. No.', '12345678')}
        ${formField('VAT Number', 'GB123456789')}
        ${formField('Phone', '+44 7700 900123')}
        ${formField('Email', 'mike@plumberpro.co.uk')}
        <p class="section-title">Certifications</p>
        <div class="card divide-y divide-[#F1F5F9]">
            ${[['Gas Safe Registered', 'Valid until Mar 2026'], ['Public Liability Insurance', 'Valid until Dec 2025']].map(([t, d]) => `
            <div class="px-4 py-3.5 flex items-center justify-between">
                <div><p class="text-[13px] font-semibold">${t}</p><p class="text-[11px] text-[#64748B]">${d}</p></div>
                <i data-lucide="check-circle" class="w-5 h-5 text-[#16A34A]"></i>
            </div>`).join('')}
        </div>
        ${photoUpload('Upload certification')}
        ${saveBtn('Save Changes', 'Company info updated')}
    </div>`;
}

/* Register contractor screens */
Object.assign(SCREEN_MAP, {
    'contractor-invite': screenContractorInvite,
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
    'tenant-invite': screenTenantInvite,
    'tenant-activate': screenTenantActivate,
    'tenant-dashboard': screenTenantDashboard,
    'tenant-welcome': screenTenantWelcome,
});

const CONTRACTOR_NO_NAV = [
    'contractor-job-detail', 'contractor-schedule', 'contractor-work', 'contractor-documents',
    'contractor-company', 'contractor-invite', 'contractor-welcome',
    'tenant-invite', 'tenant-activate', 'tenant-welcome', 'tenant-dashboard',
];
NO_NAV.push(...CONTRACTOR_NO_NAV);

function bindContractorEvents() {
    const app = document.getElementById('app');
    app.querySelectorAll('[data-action="confirm-contractor-schedule"]').forEach(el => { el.onclick = confirmContractorSchedule; });
    app.querySelectorAll('[data-action="save-contractor-note"]').forEach(el => { el.onclick = saveContractorNote; });
    app.querySelectorAll('[data-action="mark-contractor-complete"]').forEach(el => { el.onclick = markContractorJobComplete; });
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
}

const _ctrOrigBindEvents = bindEvents;
bindEvents = function() {
    _ctrOrigBindEvents();
    bindContractorEvents();
};

CONTRACTOR_JOBS.forEach(ensureContractorJob);
