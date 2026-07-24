/* Contractor role — MVP flow */
const CONTRACTOR_BOTTOM_NAV = [
    ['layout-dashboard', 'Home', 'contractor-dashboard'],
    ['briefcase', 'Jobs', 'contractor-jobs'],
    ['message-square', 'Messages', 'messages'],
    ['bell', 'Alerts', 'contractor-notifications'],
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
    { id: 0, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Kitchen sink leaking', priority: 'High', visitDate: 'Today, 2:00 PM', status: 'assigned', assignedDate: 'Mar 10, 2025', desc: 'Water dripping from pipe under kitchen sink. Tenant reports it started this morning. Access via front door — tenant will be home after 1 PM.' },
    { id: 1, property: '45 Queens Road', address: 'London, SW2 3TR', tenant: 'David Wilson', landlord: 'John Smith', issue: 'Boiler not working', priority: 'High', visitDate: 'Tomorrow, 10:00 AM', status: 'accepted', assignedDate: 'Mar 8, 2025', desc: 'No hot water or heating. Boiler showing error code E119. Parking available on street.' },
    { id: 2, property: '88 King Street', address: 'London, EC2V 8BB', tenant: '—', landlord: 'John Smith', issue: 'Window latch broken', priority: 'Medium', visitDate: 'Mar 14, 11:30 AM', status: 'scheduled', assignedDate: 'Mar 7, 2025', desc: 'Bedroom window latch broken — window cannot be secured. Property currently vacant.' },
    { id: 3, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Radiator not heating', priority: 'Medium', visitDate: 'Mar 12, 3:00 PM', status: 'in_progress', assignedDate: 'Mar 5, 2025', desc: 'Living room radiator cold while others work. Possible air lock or valve issue.' },
    { id: 4, property: '12 Park Lane', address: 'London, SW1A 1AA', tenant: 'Sarah Johnson', landlord: 'John Smith', issue: 'Tap replacement', priority: 'Low', visitDate: 'Mar 1, 2025', status: 'waiting_approval', assignedDate: 'Feb 20, 2025', desc: 'Kitchen tap replaced. Invoice submitted awaiting landlord approval.' },
    { id: 5, property: '45 Queens Road', address: 'London, SW2 3TR', tenant: 'David Wilson', landlord: 'John Smith', issue: 'Light flickering', priority: 'Low', visitDate: 'Feb 18, 2025', status: 'completed', assignedDate: 'Feb 10, 2025', desc: 'Living room ceiling light flickering — resolved with new fitting.' },
    { id: 6, property: '15 Victoria Ave', address: 'London, N1 5EH', tenant: 'Michael Lee', landlord: 'John Smith', issue: 'Annual gas check', priority: 'Low', visitDate: 'Jan 30, 2025', status: 'paid', assignedDate: 'Jan 15, 2025', desc: 'Annual gas safety inspection completed. Certificate uploaded.' },
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

const contractorJob = (id) => CONTRACTOR_JOBS.find(j => j.id === id) || CONTRACTOR_JOBS[0];

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
    const flow = {
        accept: 'accepted',
        decline: null,
        schedule: 'scheduled',
        start: 'in_progress',
        complete: 'waiting_approval',
        approve: 'completed',
        pay: 'paid',
    };
    if (action === 'decline') {
        toast(msg || 'Job declined');
        go('contractor-jobs');
        return;
    }
    if (action === 'schedule') {
        go('contractor-schedule', { jobId: job.id });
        return;
    }
    if (action === 'confirm-schedule') {
        job.status = 'scheduled';
        toast(msg || 'Visit scheduled');
        go('contractor-job-detail', { jobId: job.id });
        return;
    }
    if (action === 'work') {
        go('contractor-work', { jobId: job.id, jobTab: 'progress' });
        return;
    }
    if (action === 'documents') {
        go('contractor-documents', { jobId: job.id, jobTab: 'documents' });
        return;
    }
    if (flow[action]) job.status = flow[action];
    toast(msg || 'Updated');
    if (action === 'complete') go('contractor-jobs');
    else render();
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
            <button type="button" data-go="sign-in" class="btn-auth btn-auth-outline" style="margin-top:12px;width:100%">Already have an account? Sign In</button>
        </div>
    </div>`;
}

function screenContractorWelcome() {
    return `
    <div class="auth-screen" style="padding-bottom:0">
        <div class="welcome-header">
            <h1 class="welcome-greeting">Welcome, Mike! 🔧</h1>
            <button type="button" data-go="contractor-notifications" class="top-icon-btn relative">
                <i data-lucide="bell" class="w-5 h-5"></i>
                <span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
        </div>
        <div class="auth-content" style="padding-top:0">
            <button type="button" data-action="enter-app" class="portal-card portal-card-contractor">
                <p class="portal-card-title">Contractor Dashboard</p>
                <p class="portal-card-sub">View jobs, schedule visits & upload invoices</p>
                <i data-lucide="wrench" class="portal-card-icon w-20 h-20"></i>
            </button>
            <div class="card p-4 text-left">
                <p class="text-[13px] font-semibold text-[#0F172A]">Getting started</p>
                <p class="text-[12px] text-[#64748B] mt-2 leading-relaxed">You have 1 new job waiting for your response. Accept jobs, schedule visits, and upload completion photos and invoices from the Jobs tab.</p>
            </div>
        </div>
        <div class="welcome-nav">
            <button type="button" data-action="enter-app" class="welcome-nav-btn active"><i data-lucide="home" class="w-5 h-5"></i>Home</button>
            <button type="button" data-go="contractor-jobs" class="welcome-nav-btn"><i data-lucide="briefcase" class="w-5 h-5"></i>Jobs</button>
            <button type="button" data-go="messages" class="welcome-nav-btn"><i data-lucide="message-square" class="w-5 h-5"></i>Messages</button>
            <button type="button" data-go="contractor-profile" class="welcome-nav-btn"><i data-lucide="user" class="w-5 h-5"></i>Profile</button>
        </div>
    </div>`;
}

function screenTenantDashboard() {
    return `${topBar('Tenant Portal', { hideBell: true })}
    <div class="screen-content screen-enter">
        <div class="card p-8 text-center">
            <i data-lucide="home" class="w-12 h-12 text-[#16A34A] mx-auto"></i>
            <p class="text-[16px] font-bold text-[#0F172A] mt-4">Tenant Portal</p>
            <p class="text-[13px] text-[#64748B] mt-2 leading-relaxed">Pay rent, report maintenance issues, and message your landlord. Full tenant flow coming in the next release.</p>
            <button data-action="logout" class="btn-secondary w-full py-3 mt-6 text-[13px]">Sign Out</button>
        </div>
    </div>`;
}

function screenTenantWelcome() {
    return `
    <div class="auth-screen">
        <div class="auth-content" style="padding-top:60px;text-align:center">
            <i data-lucide="home" class="w-16 h-16 text-[#16A34A] mx-auto"></i>
            <h1 class="auth-heading" style="margin-top:20px">Welcome, Tenant!</h1>
            <p class="auth-sub">Your account is ready. The full tenant portal is coming soon.</p>
            <button type="button" data-action="enter-app" class="btn-auth btn-auth-primary" style="margin-top:32px;width:100%">Continue</button>
        </div>
    </div>`;
}

function screenContractorDashboard() {
    const assigned = CONTRACTOR_JOBS.filter(j => j.status === 'assigned').length;
    const today = CONTRACTOR_JOBS.filter(j => j.visitDate.startsWith('Today')).length;
    const pending = CONTRACTOR_JOBS.filter(j => ['accepted', 'scheduled', 'in_progress'].includes(j.status)).length;
    const completed = CONTRACTOR_JOBS.filter(j => ['completed', 'paid'].includes(j.status)).length;
    const upcoming = CONTRACTOR_JOBS.filter(j => ['assigned', 'accepted', 'scheduled', 'in_progress'].includes(j.status)).slice(0, 3);
    return `${dashboardHeader('Mike Thompson', 'Plumber Pro Ltd')}
    <div class="screen-content screen-enter">
        <div class="ctr-stat-grid">
            ${[
                ['briefcase', 'Assigned Jobs', assigned, 'issues'],
                ['calendar', "Today's Visits", today, 'vacant'],
                ['clock', 'Pending', pending, 'collected'],
                ['check-circle', 'Completed', completed, 'compliant'],
            ].map(([ic, label, val, variant]) => dashStatCard({
                go: 'contractor-jobs', variant, icon: ic, label, value: val, pill: null,
            })).join('')}
        </div>
        <div class="dash-section-head" style="margin-top:4px">
            <div><h3 class="screen-section-title">Upcoming Schedule</h3><p class="dash-section-sub">${upcoming.length} visits coming up</p></div>
            <button data-go="contractor-jobs" class="dash-view-all">View all</button>
        </div>
        <div class="stack-sm">${upcoming.map(j => contractorJobCard(j)).join('')}</div>
        <div class="dash-section-head">
            <div><h3 class="screen-section-title">Quick Actions</h3></div>
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

function dashboardHeader(name, sub) {
    return `
<div class="screen-header dash-header">
    <div class="dash-header-top">
        <button data-action="drawer" class="top-icon-btn"><i data-lucide="menu" class="w-[22px] h-[22px]"></i></button>
        <button data-go="contractor-notifications" class="top-icon-btn relative">
            <i data-lucide="bell" class="w-[20px] h-[20px]"></i>
            <span class="absolute top-0 right-0 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
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
    const tabs = [['overview', 'Overview'], ['progress', 'Work Progress'], ['documents', 'Documents']];
    const actions = {
        assigned: `
            <div class="grid grid-cols-2 gap-3">
                <button data-contractor-action="accept" data-msg="Job accepted" class="btn-primary py-3.5 text-[13px]">Accept Job</button>
                <button data-contractor-action="decline" data-msg="Job declined" class="btn-secondary py-3.5 text-[13px]">Decline</button>
            </div>`,
        accepted: `<button data-contractor-action="schedule" class="btn-primary w-full py-3.5 text-[13px]">Schedule Visit</button>`,
        scheduled: `<button data-contractor-action="start" data-msg="Work started" class="btn-primary w-full py-3.5 text-[13px]">Start Work</button>`,
        in_progress: `
            <button data-contractor-action="work" class="btn-primary w-full py-3.5 text-[13px]">Add Progress & Photos</button>
            <button data-contractor-action="documents" class="btn-secondary w-full py-3.5 text-[13px] mt-3">Upload Invoice</button>`,
        waiting_approval: `<p class="text-[13px] text-[#64748B] text-center py-2">Waiting for landlord to review your invoice</p>`,
        completed: `<p class="text-[13px] text-[#059669] text-center font-semibold py-2">Job completed — awaiting payment</p>`,
        paid: `<p class="text-[13px] text-[#059669] text-center font-semibold py-2">Payment received · Job archived</p>`,
    };
    const overview = `
        <div class="card p-4">
            <p class="section-title">Property Information</p>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-2">${job.property}</p>
            <p class="text-[12px] text-[#64748B]">${job.address}</p>
        </div>
        <div class="card p-4">
            <p class="section-title">Tenant Information</p>
            <p class="text-[14px] font-semibold text-[#0F172A] mt-2">${job.tenant}</p>
            <p class="text-[12px] text-[#64748B]">Landlord: ${job.landlord}</p>
        </div>
        <div class="card p-4">
            <p class="section-title">Issue Description</p>
            <p class="text-[13px] text-[#475569] mt-2 leading-relaxed">${job.desc}</p>
            <div class="flex gap-2 mt-3">
                <span class="badge" style="background:${pBg};color:${pColor}">${job.priority} Priority</span>
                <span class="badge bg-[#F1F5F9] text-[#64748B]">Assigned ${job.assignedDate}</span>
            </div>
        </div>
        <p class="section-title">Timeline</p>
        ${contractorTimeline(job.status)}
        <div class="grid grid-cols-2 gap-3">
            <button data-go="chat" class="btn-secondary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="message-square" class="w-4 h-4"></i>Message Landlord</button>
            <button data-go="chat" class="btn-secondary py-3 flex items-center justify-center gap-2 text-[13px]"><i data-lucide="user" class="w-4 h-4"></i>Message Tenant</button>
        </div>`;
    const progress = `
        ${formTextarea('Progress Notes', '', 'Add work notes...')}
        ${photoUpload('Upload before photos')}
        ${photoUpload('Upload during photos')}
        ${photoUpload('Upload after photos')}
        <button data-action="save" data-msg="Progress saved" class="btn-primary w-full py-3.5 text-[14px]">Save Progress</button>`;
    const documents = `
        ${photoUpload('Upload completion certificate (optional)')}
        ${photoUpload('Upload warranty document')}
        ${photoUpload('Upload invoice')}
        <button data-contractor-action="complete" data-msg="Job marked complete — awaiting approval" class="btn-primary w-full py-3.5 text-[14px]">Mark Job Complete</button>`;
    const tabBody = { overview, progress, documents };
    return `${topBar('Job Details', { back: true, sub: job.property })}
    <div class="screen-content screen-enter">
        <div class="flex gap-2 flex-wrap">
            <span class="badge" style="background:${st.bg};color:${st.color}">${st.label}</span>
            <span class="badge" style="background:${pBg};color:${pColor}">${job.priority}</span>
        </div>
        <h2 class="text-[18px] font-bold text-[#0F172A] mt-2">${job.issue}</h2>
        <p class="text-[13px] text-[#64748B]"><i data-lucide="calendar" class="w-4 h-4 inline -mt-0.5"></i> Visit: ${job.visitDate}</p>
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
    return `${topBar('Schedule Visit', { back: true })}
    <div class="screen-content screen-enter">
        <div class="card p-4">
            <p class="text-[14px] font-semibold text-[#0F172A]">${job.issue}</p>
            <p class="text-[12px] text-[#64748B] mt-1">${job.property} · ${job.address}</p>
        </div>
        ${formField('Visit Date', 'Mar 14, 2025')}
        ${formField('Visit Time', '11:30 AM')}
        ${formTextarea('Notes for tenant', '', 'e.g. I will arrive between 11:30–12:00')}
        <button data-contractor-action="confirm-schedule" data-msg="Visit scheduled" class="btn-primary w-full py-3.5 text-[14px]">Confirm Schedule</button>
    </div>`;
}

function screenContractorWork() {
    STATE.contractorJobTab = 'progress';
    return screenContractorJobDetail();
}

function screenContractorDocuments() {
    STATE.contractorJobTab = 'documents';
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
            ['bell', 'Notification Settings', 'notifications-settings'],
            ['key-round', 'Change Password', 'password'],
        ])}
        <p class="section-title">Support</p>
        ${menuList([
            ['help-circle', 'Help & Support', 'help-support'],
            ['shield', 'Privacy Policy', 'privacy'],
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
    'tenant-dashboard': screenTenantDashboard,
    'tenant-welcome': screenTenantWelcome,
});

const CONTRACTOR_NO_NAV = [
    'contractor-job-detail', 'contractor-schedule', 'contractor-work', 'contractor-documents',
    'contractor-company', 'contractor-invite', 'contractor-welcome', 'tenant-welcome', 'tenant-dashboard',
];
NO_NAV.push(...CONTRACTOR_NO_NAV);
