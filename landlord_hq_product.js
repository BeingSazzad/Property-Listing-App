/* Product UX layer — backend-ready flows (extends existing screens, no API) */

const DOC_FOLDER_DEFS = [
    { id: 'gas', label: 'Gas Certificates', icon: 'flame', color: '#DC2626', bg: '#FEE2E2', match: d => d.type === 'Gas Certificate' },
    { id: 'eicr', label: 'EICR Certificates', icon: 'zap', color: '#D97706', bg: '#FEF3C7', match: d => d.type === 'Electrical Certificate' },
    { id: 'epc', label: 'EPC', icon: 'leaf', color: '#16A34A', bg: '#ECFDF5', match: d => d.type === 'EPC Certificate' },
    { id: 'tenancy', label: 'Tenancy Agreements', icon: 'file-text', color: '#2563EB', bg: '#EFF6FF', match: d => d.type === 'Tenancy Agreement' },
    { id: 'deposit', label: 'Deposit Protection', icon: 'shield', color: '#059669', bg: '#DCFCE7', match: d => d.type === 'Deposit Certificate' },
    { id: 'insurance', label: 'Insurance', icon: 'shield-check', color: '#4338CA', bg: '#EEF2FF', match: d => /insurance/i.test(d.name || d.type || '') },
    { id: 'fire', label: 'Fire Safety', icon: 'flame-kindling', color: '#EA580C', bg: '#FFEDD5', match: d => /fire|smoke|alarm/i.test(d.name || '') && d.type === 'Custom Document' },
    { id: 'howto', label: 'How to Rent', icon: 'book-open', color: '#7C3AED', bg: '#F3E8FF', match: d => d.type === 'How to Rent Guide' },
    { id: 'other', label: 'Other Documents', icon: 'folder', color: '#64748B', bg: '#F1F5F9', match: () => true },
];

const CHARGE_TYPE_OPTIONS = [
    { id: 'utility', label: 'Utility charge', icon: 'zap' },
    { id: 'repair', label: 'Repair charge', icon: 'wrench' },
    { id: 'penalty', label: 'Penalty', icon: 'alert-triangle' },
    { id: 'service', label: 'Service charge', icon: 'receipt' },
    { id: 'custom', label: 'Custom charge', icon: 'plus-circle' },
];

const CHARGE_TARGET_OPTIONS = [
    { id: 'lead', label: 'Lead tenant', hint: 'Bill the primary tenant on the unit' },
    { id: 'specific', label: 'Specific tenant', hint: 'Choose one tenant' },
    { id: 'all', label: 'All tenants on unit', hint: 'Split-ready · one bill per tenant (future)' },
];

const OFFLINE_PAYMENT_METHODS = [
    { id: 'stripe', label: 'Stripe (card)' },
    { id: 'bank', label: 'Bank transfer' },
    { id: 'cash', label: 'Cash' },
    { id: 'cheque', label: 'Cheque' },
    { id: 'other', label: 'Other' },
];

const PAYMENT_MODE_LABELS = {
    combined: 'Combined rent',
    individual: 'Individual rent',
    offline: 'Offline payment',
    bank: 'Bank transfer',
    partial: 'Partial payment',
    split: 'Split payment',
};

const NOTIFICATION_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'charge', label: 'Charges' },
    { id: 'rent', label: 'Rent' },
    { id: 'payment', label: 'Payments' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'inspection', label: 'Inspections' },
    { id: 'compliance', label: 'Certificates' },
    { id: 'announcement', label: 'Announcements' },
];

function docYearFromDate(dateStr) {
    if (!dateStr) return 'Undated';
    const m = String(dateStr).match(/\d{4}/);
    return m ? m[0] : 'Undated';
}

function docsForFolder(docs, folderId) {
    const folder = DOC_FOLDER_DEFS.find(f => f.id === folderId) || DOC_FOLDER_DEFS[DOC_FOLDER_DEFS.length - 1];
    const others = DOC_FOLDER_DEFS.filter(f => f.id !== 'other');
    if (folderId === 'other') {
        return docs.filter(d => !others.some(f => f.match(d) && f.id !== 'other'));
    }
    return docs.filter(folder.match);
}

function tenantDocFolderFromName(name) {
    const n = (name || '').toLowerCase();
    if (/gas|cp12/.test(n)) return 'gas';
    if (/eicr|electrical/.test(n)) return 'eicr';
    if (/epc/.test(n)) return 'epc';
    if (/lease|tenancy/.test(n)) return 'tenancy';
    if (/deposit/.test(n)) return 'deposit';
    if (/insurance/.test(n)) return 'insurance';
    if (/fire|smoke/.test(n)) return 'fire';
    return 'other';
}

function getSharedPropertyPhotos(propertyId) {
    const meta = typeof AppStore !== 'undefined' ? AppStore.meta(propertyId) : {};
    const fallback = typeof IMG !== 'undefined' && IMG.props ? IMG.props[propertyId] : '';
    return meta.photos?.length ? [...meta.photos] : (fallback ? [fallback] : []);
}

function renderPhotoGalleryUnified(photos, opts = {}) {
    const { compact, max = 6, manageGo, propertyId } = opts;
    const list = (photos || []).slice(0, max);
    if (!list.length) {
        return `<div class="card p-6 text-center text-[13px] text-[#64748B]">No photos yet</div>`;
    }
    return `
    <div class="photo-gallery-grid ${compact ? 'photo-gallery-grid--compact' : ''}">
        ${list.map((src, i) => `
        <div class="photo-gallery-card">
            <img src="${src}" class="photo-gallery-img" alt="">
            ${i === 0 ? '<span class="photo-cover-badge">COVER</span>' : ''}
        </div>`).join('')}
    </div>
    ${manageGo ? `<button type="button" data-go="${manageGo}" data-pid="${propertyId}" class="btn-primary w-full py-3.5 text-[14px] mt-3">Manage photos</button>` : ''}`;
}

function renderDocFolderToolbar(contextKey, opts = {}) {
    const q = STATE.docSearch?.[contextKey] || '';
    const compact = !!opts.compact;
    if (compact) {
        return `
        <div class="records-doc-toolbar">
            <div class="search-bar records-doc-search">
                <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
                <input data-doc-search="${contextKey}" type="text" value="${q}" placeholder="Search documents…" class="flex-1 text-[13px] bg-transparent border-none outline-none">
            </div>
            <button type="button" data-action="open-add-document-flow" class="records-add-btn">+ Add</button>
        </div>`;
    }
    const sort = STATE.docSort?.[contextKey] || 'updated';
    return `
    <div class="doc-folder-toolbar">
        <div class="search-bar doc-folder-search">
            <i data-lucide="search" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            <input data-doc-search="${contextKey}" type="text" value="${q}" placeholder="Search documents…" class="flex-1 text-[13px] bg-transparent border-none outline-none">
        </div>
        <select data-doc-sort="${contextKey}" class="form-input form-select doc-folder-sort">
            <option value="updated" ${sort === 'updated' ? 'selected' : ''}>Last updated</option>
            <option value="name" ${sort === 'name' ? 'selected' : ''}>Name A–Z</option>
            <option value="year" ${sort === 'year' ? 'selected' : ''}>Year</option>
        </select>
    </div>`;
}

function renderDocumentRowCompact(doc, propertyId, folder) {
    const upload = typeof isUserUploadedDoc === 'function' ? isUserUploadedDoc(doc) : false;
    const visual = typeof documentRowVisual === 'function' ? documentRowVisual(doc) : { icon: 'file-text', color: folder?.color || '#64748B', bg: folder?.bg || '#F1F5F9' };
    const sub = typeof documentRowSubtitle === 'function' ? documentRowSubtitle(doc) : (doc.date || '');
    return `
    <button type="button" data-go="document-preview" data-doc="${doc.id}" class="doc-row-compact w-full text-left">
        <span class="doc-row-compact-icon" style="background:${folder?.bg || visual.bg};color:${folder?.color || visual.color}">
            <i data-lucide="${visual.icon}" class="w-4 h-4"></i>
        </span>
        <span class="doc-row-compact-copy min-w-0 flex-1">
            <span class="doc-row-compact-name${upload ? ' doc-row-compact-name--upload' : ''}">${escapeHtml(doc.name)}</span>
            <span class="doc-row-compact-sub">${escapeHtml(sub)}</span>
        </span>
        <i data-lucide="chevron-right" class="w-4 h-4 text-[#CBD5E1] shrink-0"></i>
    </button>`;
}

function sortDocList(docs, sort) {
    const list = [...docs];
    if (sort === 'name') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (sort === 'year') return list.sort((a, b) => docYearFromDate(b.date).localeCompare(docYearFromDate(a.date)));
    return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function renderDocFolderBrowser(propertyId, contextKey = `property-${propertyId}`, opts = {}) {
    const compact = !!opts.compact;
    const allDocs = sortPropertyDocuments(AppStore.docsForProperty(propertyId));
    const q = (STATE.docSearch?.[contextKey] || '').toLowerCase();
    const sort = STATE.docSort?.[contextKey] || 'updated';
    if (!STATE.docFolderOpen) STATE.docFolderOpen = {};
    const filtered = q
        ? allDocs.filter(d => `${d.name} ${d.type} ${d.date}`.toLowerCase().includes(q))
        : allDocs;
    const primaryFolderIds = new Set(['gas', 'eicr', 'epc', 'tenancy']);
    const folders = DOC_FOLDER_DEFS.map(folder => {
        const files = sortDocList(docsForFolder(filtered, folder.id), sort);
        if (!files.length && !primaryFolderIds.has(folder.id)) return null;
        const years = [...new Set(files.map(d => docYearFromDate(d.date)))].sort((a, b) => b.localeCompare(a));
        const openKey = `${contextKey}-${folder.id}`;
        const open = STATE.docFolderOpen[openKey] === true;
        const lastUpdated = files[0]?.date || '—';
        return `
        <div class="doc-folder card${compact ? ' doc-folder--compact' : ''}">
            <button type="button" data-action="toggle-doc-folder" data-folder="${folder.id}" data-ctx="${contextKey}" class="doc-folder-head w-full text-left">
                <span class="doc-folder-icon" style="background:${folder.bg};color:${folder.color}"><i data-lucide="${folder.icon}" class="w-5 h-5"></i></span>
                <span class="doc-folder-meta min-w-0 flex-1">
                    <span class="doc-folder-name">${folder.label}</span>
                    <span class="doc-folder-sub">${files.length} file${files.length === 1 ? '' : 's'}${files.length ? ` · Updated ${lastUpdated}` : ''}</span>
                </span>
                <i data-lucide="${open ? 'chevron-up' : 'chevron-down'}" class="w-5 h-5 text-[#94A3B8] shrink-0"></i>
            </button>
            ${open ? `
            <div class="doc-folder-body">
                ${files.length ? years.map(year => {
                    const yearFiles = files.filter(d => docYearFromDate(d.date) === year);
                    return `
                <div class="doc-year-group">
                    ${compact && years.length > 1 ? `<p class="doc-year-label">${year}</p>` : ''}
                    ${yearFiles.map(d => compact
                        ? renderDocumentRowCompact(d, propertyId, folder)
                        : (typeof renderDocumentRow === 'function' ? renderDocumentRow(d, propertyId) : '')).join('')}
                </div>`;
                }).join('') : `<p class="doc-folder-empty">${compact ? 'No files yet — tap + Add above.' : 'No files in this folder yet.'}</p>`}
                ${compact ? '' : `<button type="button" data-action="open-add-document-folder" data-folder="${folder.id}" data-pid="${propertyId}" class="doc-folder-add">+ Add to ${folder.label}</button>`}
            </div>` : ''}
        </div>`;
    }).filter(Boolean);
    return `
    ${renderDocFolderToolbar(contextKey, opts)}
    <div class="doc-folder-list stack-sm">${folders.length ? folders.join('') : `
        <div class="fin-empty">
            <p class="fin-empty-title">No documents match</p>
            <p class="fin-empty-sub">Try another search or add a file.</p>
        </div>`}
    </div>
    ${compact ? '' : `<button type="button" data-action="open-add-document-flow" class="btn-primary w-full py-3.5 text-[14px] mt-3">+ Upload document</button>`}`;
}

function renderPropertyDocumentsTabProduct(propertyId) {
    return `
    <div class="screen-content screen-content-sm prop-docs-page">
        ${renderDocFolderBrowser(propertyId, `property-${propertyId}`, { compact: true })}
    </div>`;
}

function renderTenantDocFolderBrowser(tenantId) {
    const docs = typeof getTenantDocuments === 'function' ? getTenantDocuments(tenantId) : [];
    const contextKey = `tenant-${tenantId}`;
    const q = (STATE.docSearch?.[contextKey] || '').toLowerCase();
    if (!STATE.docFolderOpen) STATE.docFolderOpen = {};
    const mapped = docs.map((d, i) => ({
        id: `t-${tenantId}-${i}`, name: d[1], date: d[2], type: 'tenant', folderId: tenantDocFolderFromName(d[1]),
    })).filter(d => !q || d.name.toLowerCase().includes(q));
    const folders = DOC_FOLDER_DEFS.map(folder => {
        const files = mapped.filter(d => d.folderId === folder.id || (folder.id === 'other' && !DOC_FOLDER_DEFS.slice(0, -1).some(f => f.id === d.folderId)));
        if (!files.length) return null;
        const open = STATE.docFolderOpen[`${contextKey}-${folder.id}`] !== false;
        return `
        <div class="doc-folder card">
            <button type="button" data-action="toggle-doc-folder" data-folder="${folder.id}" data-ctx="${contextKey}" class="doc-folder-head w-full text-left">
                <span class="doc-folder-icon" style="background:${folder.bg};color:${folder.color}"><i data-lucide="${folder.icon}" class="w-5 h-5"></i></span>
                <span class="doc-folder-meta min-w-0 flex-1">
                    <span class="doc-folder-name">${folder.label}</span>
                    <span class="doc-folder-sub">${files.length} file${files.length === 1 ? '' : 's'}</span>
                </span>
                <i data-lucide="${open ? 'chevron-up' : 'chevron-down'}" class="w-5 h-5 text-[#94A3B8]"></i>
            </button>
            ${open ? `<div class="doc-folder-body doc-list">${files.map(f => `
            <button type="button" data-action="toast" data-msg="Opening ${f.name}" class="doc-row w-full text-left">
                <span class="doc-row-icon" style="color:${folder.color};background:${folder.bg}"><i data-lucide="file-text" class="w-4 h-4"></i></span>
                <span class="doc-row-text min-w-0"><p class="doc-row-name">${f.name}</p><p class="doc-row-sub">${f.date}</p></span>
            </button>`).join('')}</div>` : ''}
        </div>`;
    }).filter(Boolean);
    return `
    ${renderDocFolderToolbar(contextKey)}
    <div class="doc-folder-list stack-sm">${folders.length ? folders.join('') : `<div class="card p-8 text-center text-[13px] text-[#64748B]">No documents shared yet.</div>`}</div>`;
}

function paymentStatusBadge(inv) {
    const map = {
        Paid: ['#DCFCE7', '#16A34A'],
        Overdue: ['#FEE2E2', '#DC2626'],
        Pending: ['#FEF3C7', '#D97706'],
        Partial: ['#E0E7FF', '#4338CA'],
    };
    const [bg, color] = map[inv.status] || map.Pending;
    const mode = inv.paymentMode || (inv.type === 'rent' ? 'individual' : 'offline');
    const modeLabel = PAYMENT_MODE_LABELS[mode] || mode;
    return `<span class="pay-mode-badge" style="background:${bg};color:${color}">${inv.status}</span>
    <span class="pay-mode-tag">${modeLabel}</span>`;
}

function renderPaymentFutureReadyStrip() {
    return `
    <div class="pay-future-strip card">
        <p class="pay-future-title">Payment types supported</p>
        <div class="pay-future-chips">
            ${Object.entries(PAYMENT_MODE_LABELS).map(([k, l]) => `
            <span class="pay-future-chip ${k === 'partial' || k === 'split' ? 'pay-future-chip--soon' : ''}">${l}${k === 'partial' || k === 'split' ? ' · Soon' : ''}</span>`).join('')}
        </div>
    </div>`;
}

function screenCreateChargeProduct() {
    const defaultPid = STATE.propertyId ?? PROPERTIES.find(p => propertyOccupiedFlatCount(p.id) > 0)?.id ?? 0;
    const chargeType = STATE.chargeType || 'utility';
    const chargeTarget = STATE.chargeTarget || 'lead';
    const unitTenants = TENANT_LIST.filter(t => t.propertyId === defaultPid && t.status === 'active');
    return `${topBar('Add charge', { back: true })}
    <div class="screen-content screen-enter">
        <div class="ux-tip">
            <p class="ux-tip-title">Extra bill / charge</p>
            <p class="ux-tip-text">Monthly rent is tracked per unit automatically. Use this for utilities, repairs, penalties, or custom charges.</p>
        </div>
        <p class="screen-section-title">Charge type</p>
        <div class="charge-type-grid">
            ${CHARGE_TYPE_OPTIONS.map(o => `
            <button type="button" data-charge-type="${o.id}" class="charge-type-card ${chargeType === o.id ? 'active' : ''}">
                <i data-lucide="${o.icon}" class="w-5 h-5"></i>
                <span>${o.label}</span>
            </button>`).join('')}
        </div>
        <p class="screen-section-title">Who is billed?</p>
        ${CHARGE_TARGET_OPTIONS.map(o => `
        <label class="charge-target-row card ${chargeTarget === o.id ? 'charge-target-row--active' : ''}">
            <input type="radio" name="chargeTarget" data-charge-target="${o.id}" ${chargeTarget === o.id ? 'checked' : ''} class="accent-[#2563EB]">
            <span class="min-w-0 flex-1">
                <span class="charge-target-label">${o.label}</span>
                <span class="charge-target-hint">${o.hint}</span>
            </span>
        </label>`).join('')}
        <div><label class="form-label">${requiredLabel('Property')}</label>
        <select data-field="propertyId" data-action="refresh-invoice-units" class="form-input form-select">${PROPERTIES.filter(p => propertyOccupiedFlatCount(p.id) > 0).map(p => `<option value="${p.id}" ${p.id === defaultPid ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div>
        ${typeof unitSelectHtml === 'function' ? `<div><label class="form-label">Unit</label>${unitSelectHtml(defaultPid, 'unit', false, '')}</div>` : ''}
        ${chargeTarget === 'specific' ? `
        <div><label class="form-label">Tenant</label>
        <select data-field="chargeTenantId" class="form-input form-select">
            ${unitTenants.map(t => `<option value="${t.id}">${t.name} · ${t.unit}</option>`).join('')}
        </select></div>` : ''}
        ${formFieldReq('Amount (£)', 'amount', '', 'number', '150')}
        ${formFieldReq('Due date', 'due', '', 'date')}
        ${formTextarea('Description / notes', '', 'What is this charge for?', 'chargeNotes')}
        <button data-action="save-charge" class="btn-primary w-full py-3.5 text-[14px]">Send charge</button>
    </div>`;
}

function saveChargeProduct() {
    if (!validateFields([['amount', 'Amount', v => v && +v > 0], ['due', 'Due date', v => v]])) return;
    const pid = +fieldVal('propertyId');
    const p = PROPERTIES[pid];
    const unit = fieldVal('unit') || '';
    const chargeType = STATE.chargeType || 'utility';
    const chargeTarget = STATE.chargeTarget || 'lead';
    const typeMeta = CHARGE_TYPE_OPTIONS.find(c => c.id === chargeType);
    let tenants = TENANT_LIST.filter(t => t.propertyId === pid && t.status === 'active' && (!unit || t.unit === unit));
    if (chargeTarget === 'specific') {
        const tid = +fieldVal('chargeTenantId');
        tenants = tenants.filter(t => t.id === tid);
    } else if (chargeTarget === 'lead') {
        tenants = tenants.slice(0, 1);
    }
    if (!tenants.length) { toast('No tenant found for this unit'); return; }
    const notes = fieldVal('chargeNotes') || '';
    const desc = `${typeMeta?.label || 'Charge'}${notes ? ` · ${notes}` : ''}`;
    tenants.forEach(tenant => {
        const id = AppStore.nextId(INVOICES);
        INVOICES.unshift({
            id, num: `INV-${new Date().getFullYear()}-${1000 + id}`,
            prop: `${p.name}, ${p.address}`, unit: tenant.unit, tenant: tenant.name, tenantId: tenant.id,
            propertyId: pid, amount: `£${parseInt(fieldVal('amount'), 10).toLocaleString()}`,
            status: 'Pending', due: formatDisplayDate(fieldVal('due')), month: '', type: 'bill', desc,
            chargeType, chargeTarget, paymentMode: 'offline',
        });
        pushNotification({
            category: 'charge', icon: 'receipt', color: ['#FEF3C7', '#D97706'],
            title: 'New charge', desc: `${desc} · ${tenant.name}`,
            time: 'Just now', unread: true, screen: 'invoice-detail', opts: { iid: id },
        });
    });
    syncTransactionsFromInvoices();
    withLoading(() => { AppStore.save(); toast('Charge sent'); go('financial'); });
}

function screenMarkRentReceivedProduct() {
    if (typeof initRentReceiveSelection === 'function') initRentReceiveSelection();
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
        return `${topBar('Record payment', { back: true })}
        <div class="screen-content screen-enter">
            ${emptyState('check-circle', 'All caught up', unitScoped ? 'Every rent bill for this unit is recorded as paid.' : 'Every rent bill is recorded as paid.', backLabel, null, backTarget)}
        </div>`;
    }
    const sorted = [...overdue, ...pending];
    return `${topBar('Record payment', { back: true })}
    <div class="screen-content screen-enter rent-receive-page">
        <div class="ux-tip">
            <p class="ux-tip-title">Offline payment record</p>
            <p class="ux-tip-text">Record cash, bank transfer, or cheque when a tenant pays outside Stripe.</p>
        </div>
        <div class="rent-receive-summary card">
            <div class="rent-receive-summary-main">
                <p class="rent-receive-summary-amount">£${dueTotal.toLocaleString()}</p>
                <p class="rent-receive-summary-hint">${unpaid.length} due${overdue.length ? ` · ${overdue.length} overdue` : ''}</p>
            </div>
            <button type="button" data-action="toggle-rent-receive-all" class="rent-receive-select-all">${allSelected ? 'None' : 'All'}</button>
        </div>
        <div class="rent-receive-list">${sorted.map(rentReceiveRow).join('')}</div>
        <div class="rent-receive-date card">
            <label class="form-label">Payment received on</label>
            <input type="date" data-field="receivedDate" class="form-input" value="${receiveDate}">
        </div>
        <div class="rent-receive-date card">
            <label class="form-label">Payment method</label>
            <select data-field="paymentMethod" class="form-input form-select">
                ${OFFLINE_PAYMENT_METHODS.map(m => `<option value="${m.id}" ${STATE.rentPaymentMethod === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
            </select>
        </div>
        <div class="rent-receive-date card">
            <label class="form-label">Reference number (optional)</label>
            <input type="text" data-field="paymentReference" class="form-input" placeholder="e.g. BACS ref, cheque #">
        </div>
        <div class="rent-receive-date card">
            <label class="form-label">Notes (optional)</label>
            <textarea data-field="paymentNotes" class="form-input" rows="2" placeholder="Any notes about this payment"></textarea>
        </div>
        ${selected.count === 1 ? `
        <div class="rent-receive-date card">
            <label class="form-label">Amount received (optional)</label>
            <input type="text" data-field="receivedAmount" class="form-input" placeholder="${formatInvoiceAmount(selected.total)}">
            <p class="form-helper">Leave blank for full amount · partial payments marked for future ledger</p>
        </div>` : ''}
        <label class="flex items-center gap-2 text-[13px] text-[#475569] px-1">
            <input type="checkbox" data-field="receiptSent" class="accent-[#2563EB]"> Receipt sent to tenant
        </label>
    </div>
    <div class="rent-receive-bar ${selected.count ? 'rent-receive-bar--active' : ''}">
        <div class="rent-receive-bar-info">
            <p class="rent-receive-bar-count">${selected.count} selected</p>
            <p class="rent-receive-bar-total">£${selected.total.toLocaleString()}</p>
        </div>
        <button type="button" data-action="confirm-rent-received" class="rent-receive-bar-btn" ${selected.count ? '' : 'disabled'}>Confirm payment</button>
    </div>`;
}

function confirmMarkRentReceivedProduct() {
    const ids = [...STATE.rentReceiveIds];
    if (!ids.length) { toast('Select at least one payment'); return; }
    const date = document.querySelector('[data-field="receivedDate"]')?.value;
    if (!date) { toast('Select payment date'); return; }
    const method = document.querySelector('[data-field="paymentMethod"]')?.value || 'bank';
    const methodLabel = OFFLINE_PAYMENT_METHODS.find(m => m.id === method)?.label || 'Bank transfer';
    const reference = document.querySelector('[data-field="paymentReference"]')?.value?.trim() || '';
    const notes = document.querySelector('[data-field="paymentNotes"]')?.value?.trim() || '';
    const receiptSent = document.querySelector('[data-field="receiptSent"]')?.checked;
    const paidLabel = formatDisplayDate(date);
    const overrideRaw = document.querySelector('[data-field="receivedAmount"]')?.value?.trim();
    const overrideAmt = overrideRaw ? parseInvoiceAmount(overrideRaw) : 0;
    ids.forEach(iid => {
        const inv = INVOICES.find(i => i.id === iid);
        if (inv && inv.status !== 'Paid') {
            const fullAmt = parseInvoiceAmount(inv.amount);
            const received = ids.length === 1 && overrideAmt > 0 ? overrideAmt : fullAmt;
            if (received < fullAmt) {
                inv.status = 'Partial';
                inv.amountReceived = formatInvoiceAmount(received);
                inv.paymentMode = 'partial';
            } else {
                inv.status = 'Paid';
                inv.paymentMode = inv.type === 'rent' ? 'individual' : 'offline';
            }
            inv.paidOn = paidLabel;
            inv.paymentMethod = methodLabel;
            inv.paymentReference = reference;
            inv.paymentNotes = notes;
            inv.receiptSent = receiptSent;
            if (ids.length === 1 && overrideAmt > 0 && overrideAmt < fullAmt) {
                inv.amount = formatInvoiceAmount(overrideAmt);
            }
        }
    });
    syncTransactionsFromInvoices();
    pushNotification({
        category: 'payment', icon: 'banknote', color: ['#ECFDF5', '#16A34A'],
        title: ids.length === 1 ? 'Payment recorded' : `${ids.length} payments recorded`,
        desc: receiptSent ? 'Receipt marked as sent' : 'Recorded offline',
        time: 'Just now', unread: true, screen: 'financial', opts: {},
    });
    AppStore.save();
    STATE.rentReceiveIds = [];
    STATE.rentPaymentMethod = method;
    showConfirm('Payment recorded', `${ids.length} payment${ids.length === 1 ? '' : 's'} saved${receiptSent ? ' · receipt sent' : ''}.`, () => {
        const returnScreen = STATE.rentReturnScreen || 'financial';
        const returnOpts = {};
        if (returnScreen === 'flat-rent-history' || returnScreen === 'flat-detail') {
            returnOpts.propertyId = STATE.propertyId;
            if (STATE.selectedUnit) returnOpts.unit = STATE.selectedUnit;
        }
        STATE.rentReturnScreen = null;
        STATE.rentReceiveUnitFilter = null;
        go(returnScreen, returnOpts);
    }, { okLabel: 'Done' });
}

function screenCertificateAssign() {
    const pid = STATE.propertyId ?? 0;
    const p = PROPERTIES[pid];
    const certType = STATE.certAssignType || 'gas';
    const types = [
        { id: 'gas', label: 'Gas Certificate (CP12)' },
        { id: 'eicr', label: 'Electrical Certificate (EICR)' },
        { id: 'inspection', label: 'Inspection Report' },
        { id: 'epc', label: 'EPC Certificate' },
    ];
    const history = (AppStore.certHistory?.[pid] || []).slice(0, 5);
    return `${topBar('Assign certificate', { back: true, sub: p?.name || '' })}
    <div class="screen-content screen-enter">
        <p class="ux-intro">Link a certificate to this property. Expiry reminders sync to compliance when backend is connected.</p>
        <p class="screen-section-title">Certificate type</p>
        ${types.map(t => `
        <button type="button" data-cert-assign-type="${t.id}" class="charge-target-row card w-full text-left ${certType === t.id ? 'charge-target-row--active' : ''}">
            <span class="charge-target-label">${t.label}</span>
        </button>`).join('')}
        ${formFieldReq('Issue date', 'certIssueDate', '', 'date')}
        ${formFieldReq('Expiry date', 'certExpiryDate', '', 'date')}
        <div><label class="form-label">Status</label>
        <select data-field="certStatus" class="form-input form-select">
            <option>Valid</option><option>Expiring soon</option><option>Expired</option><option>Pending upload</option>
        </select></div>
        ${formTextarea('Notes', '', 'Engineer, reference, or access notes…', 'certNotes')}
        <button type="button" data-action="save-cert-assign" class="btn-primary w-full py-3.5 text-[14px]">Save certificate</button>
        ${history.length ? `
        <p class="screen-section-title txn-section-label--spaced">Certificate history</p>
        ${history.map(h => `
        <div class="card p-3 mb-2 flex justify-between items-center">
            <div><p class="text-[13px] font-semibold">${h.type}</p><p class="text-[11px] text-[#64748B]">${h.issue} → ${h.expiry}</p></div>
            <span class="badge">${h.status}</span>
        </div>`).join('')}` : ''}
    </div>`;
}

function saveCertificateAssign() {
    const pid = STATE.propertyId ?? 0;
    if (!validateFields([['certIssueDate', 'Issue date', v => v], ['certExpiryDate', 'Expiry date', v => v]])) return;
    if (!AppStore.certHistory) AppStore.certHistory = {};
    if (!AppStore.certHistory[pid]) AppStore.certHistory[pid] = [];
    const entry = {
        type: STATE.certAssignType || 'gas',
        issue: fieldVal('certIssueDate'),
        expiry: fieldVal('certExpiryDate'),
        status: fieldVal('certStatus') || 'Valid',
        notes: fieldVal('certNotes') || '',
        at: new Date().toLocaleDateString('en-GB'),
    };
    AppStore.certHistory[pid].unshift(entry);
    pushNotification({
        category: 'compliance', icon: 'shield', color: ['#ECFDF5', '#059669'],
        title: 'Certificate recorded', desc: `${entry.type} · expires ${entry.expiry}`,
        time: 'Just now', unread: true, screen: 'compliance-dashboard', opts: {},
    });
    AppStore.save();
    toast('Certificate saved');
    go('property-detail', { propertyId: pid, tab: 'compliance' });
}

function screenNotificationsListProduct() {
    const cat = STATE.notifCategory || 'all';
    let items = typeof notificationsForRole === 'function' ? notificationsForRole() : NOTIFICATIONS;
    items = items.map(n => ({ ...n, category: n.category || inferNotifCategory(n) }));
    if (cat !== 'all') items = items.filter(n => n.category === cat);
    const unread = items.filter(n => n.unread).length;
    const unreadItems = items.filter(n => n.unread);
    const readItems = items.filter(n => !n.unread);
    const section = (label, list) => list.length ? `
        <div class="notif-section">
            <p class="notif-section-label">${label}</p>
            <div class="notif-list">${list.map(notifRow).join('')}</div>
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
        <div class="fin-segments txn-segments notif-cat-segments">
            ${NOTIFICATION_CATEGORIES.map(c => `
            <button type="button" data-notif-category="${c.id}" class="fin-segment ${cat === c.id ? 'active' : ''}"><span class="fin-segment-label">${c.label}</span></button>`).join('')}
        </div>
        ${!items.length ? `<div class="fin-empty"><p class="fin-empty-title">No notifications</p><p class="fin-empty-sub">Updates for rent, maintenance, and certificates appear here.</p></div>` : ''}
        ${section('Today', unreadItems)}
        ${section('Earlier', readItems)}
    </div>`;
}

function inferNotifCategory(n) {
    const t = `${n.title || ''} ${n.desc || ''}`.toLowerCase();
    if (/charge|bill|utility/.test(t)) return 'charge';
    if (/rent|due/.test(t)) return 'rent';
    if (/paid|payment|received/.test(t)) return 'payment';
    if (/maint|repair|contractor|job/.test(t)) return 'maintenance';
    if (/inspect/.test(t)) return 'inspection';
    if (/certif|compliance|gas|epc|eicr|expir/.test(t)) return 'compliance';
    if (/announce|broadcast/.test(t)) return 'announcement';
    return 'rent';
}

function generateContractorSystemInvoice(job) {
    const amount = document.querySelector('[data-field="invoiceAmount"]')?.value?.trim();
    const desc = document.querySelector('[data-field="invoiceDesc"]')?.value?.trim() || job.issue;
    const notes = document.querySelector('[data-field="invoiceNotes"]')?.value?.trim() || '';
    if (!amount) { toast('Enter invoice amount'); return null; }
    const num = `INV-${new Date().getFullYear()}-${String(1000 + (job.id || 0)).padStart(4, '0')}`;
    const formatted = amount.startsWith('£') ? amount : `£${amount}`;
    const inv = {
        amount: formatted,
        description: desc,
        notes,
        number: num,
        file: `${num}.pdf`,
        systemGenerated: true,
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        contractor: job.contractorName || 'Contractor',
        business: typeof CONTRACTOR_USER !== 'undefined' ? CONTRACTOR_USER.company : '',
        property: job.property,
        landlord: job.landlord,
        status: 'Submitted',
    };
    return inv;
}

function contractorFilterJobsProduct() {
    const f = STATE.contractorJobFilter || 'all';
    const landlordF = STATE.contractorLandlordFilter || 'all';
    const propertyF = STATE.contractorPropertyFilter || 'all';
    const q = (STATE.search?.contractorJobs || '').toLowerCase();
    const map = {
        all: () => true,
        assigned: j => j.status === 'assigned',
        accepted: j => ['accepted', 'scheduled'].includes(j.status),
        in_progress: j => ['in_progress', 'waiting_approval', 'approved'].includes(j.status),
        completed: j => ['completed', 'paid'].includes(j.status),
    };
    return CONTRACTOR_JOBS.filter(j => {
        if (!(map[f] || map.all)(j)) return false;
        if (landlordF !== 'all' && j.landlord !== landlordF) return false;
        if (propertyF !== 'all' && j.property !== propertyF) return false;
        if (q && !`${j.issue} ${j.property} ${j.landlord} ${j.tenant}`.toLowerCase().includes(q)) return false;
        return true;
    });
}

function openAddDocumentFolder(folderId, propertyId) {
    const map = { gas: 'Gas Certificate', eicr: 'Electrical Certificate', epc: 'EPC Certificate', tenancy: 'Tenancy Agreement', deposit: 'Deposit Certificate', howto: 'How to Rent Guide', other: 'Custom Document' };
    const type = map[folderId] || 'Custom Document';
    if (typeof openAddDocumentSlot === 'function') openAddDocumentSlot(type);
    else if (typeof openAddDocumentFlow === 'function') openAddDocumentFlow();
}

function bindProductEvents() {
    const app = document.getElementById('app');
    if (!app || app._productBound) return;
    app._productBound = true;
    app.querySelectorAll('[data-action="toggle-doc-folder"]').forEach(el => {
        el.onclick = () => {
            const key = `${el.dataset.ctx}-${el.dataset.folder}`;
            STATE.docFolderOpen = STATE.docFolderOpen || {};
            const compact = !!el.closest('.doc-folder--compact');
            STATE.docFolderOpen[key] = compact
                ? STATE.docFolderOpen[key] !== true
                : STATE.docFolderOpen[key] === false;
            render();
        };
    });
    app.querySelectorAll('[data-doc-search]').forEach(el => {
        el.oninput = () => {
            STATE.docSearch = STATE.docSearch || {};
            STATE.docSearch[el.dataset.docSearch] = el.value;
            render();
        };
    });
    app.querySelectorAll('[data-doc-sort]').forEach(el => {
        el.onchange = () => {
            STATE.docSort = STATE.docSort || {};
            STATE.docSort[el.dataset.docSort] = el.value;
            render();
        };
    });
    app.querySelectorAll('[data-action="open-add-document-folder"]').forEach(el => {
        el.onclick = () => openAddDocumentFolder(el.dataset.folder, +el.dataset.pid);
    });
    app.querySelectorAll('[data-charge-type]').forEach(el => {
        el.onclick = () => { STATE.chargeType = el.dataset.chargeType; render(); };
    });
    app.querySelectorAll('[data-charge-target]').forEach(el => {
        el.onchange = () => { STATE.chargeTarget = el.dataset.chargeTarget; render(); };
    });
    app.querySelectorAll('[data-action="save-charge"]').forEach(el => { el.onclick = saveChargeProduct; });
    app.querySelectorAll('[data-cert-assign-type]').forEach(el => {
        el.onclick = () => { STATE.certAssignType = el.dataset.certAssignType; render(); };
    });
    app.querySelectorAll('[data-action="save-cert-assign"]').forEach(el => { el.onclick = saveCertificateAssign; });
    app.querySelectorAll('[data-notif-category]').forEach(el => {
        el.onclick = () => { STATE.notifCategory = el.dataset.notifCategory; render(); };
    });
    app.querySelectorAll('[data-contractor-landlord-filter]').forEach(el => {
        el.onclick = () => { STATE.contractorLandlordFilter = el.dataset.contractorLandlordFilter; render(); };
    });
    app.querySelectorAll('[data-contractor-property-filter]').forEach(el => {
        el.onclick = () => { STATE.contractorPropertyFilter = el.dataset.contractorPropertyFilter; render(); };
    });
    app.querySelectorAll('[data-action="generate-contractor-invoice"]').forEach(el => {
        el.onclick = () => {
            const job = typeof contractorJob === 'function' ? contractorJob(STATE.contractorJobId) : null;
            if (!job) return;
            const inv = generateContractorSystemInvoice(job);
            if (!inv) return;
            job.invoice = inv;
            if (typeof saveContractorJobs === 'function') saveContractorJobs();
            toast('Invoice generated');
            render();
        };
    });
    app.querySelectorAll('[data-action="preview-contractor-invoice"]').forEach(el => {
        el.onclick = () => {
            const job = typeof contractorJob === 'function' ? contractorJob(STATE.contractorJobId) : null;
            if (!job?.invoice) return;
            if (typeof downloadHtmlFile === 'function') {
                const rows = [
                    ['Invoice #', job.invoice.number || job.invoice.file],
                    ['Contractor', job.invoice.contractor],
                    ['Business', job.invoice.business || '—'],
                    ['Property', job.invoice.property],
                    ['Landlord', job.invoice.landlord],
                    ['Description', job.invoice.description || job.issue],
                    ['Amount', job.invoice.amount],
                    ['Date', job.invoice.uploadedAt],
                    ['Status', job.invoice.status || 'Submitted'],
                ];
                downloadHtmlFile(`${job.invoice.number || 'invoice'}.html`, receiptHtmlDocument('Contractor invoice', job.issue, rows));
            }
            toast('Invoice preview downloaded');
        };
    });
}

function initProductLayer() {
    if (typeof renderPropertyDocumentsTab === 'function') {
        window._origRenderPropertyDocumentsTab = renderPropertyDocumentsTab;
        renderPropertyDocumentsTab = renderPropertyDocumentsTabProduct;
    }
    if (typeof renderPropertyPhotosTab === 'function') {
        renderPropertyPhotosTab = function(propertyId) {
            const photos = getSharedPropertyPhotos(propertyId);
            return `<div class="screen-content">${renderPhotoGalleryUnified(photos, { compact: true, max: 6, manageGo: 'property-photos', propertyId })}</div>`;
        };
    }
    if (typeof getPropertyCoverPhoto === 'function') {
        const _cover = getPropertyCoverPhoto;
        getPropertyCoverPhoto = function(propertyId) {
            const photos = getSharedPropertyPhotos(propertyId);
            return photos[0] || _cover(propertyId);
        };
    }
    const origPush = pushNotification;
    pushNotification = function(n) {
        if (!n.category) n.category = inferNotifCategory(n);
        return origPush(n);
    };
    Object.assign(SCREEN_MAP, {
        'create-invoice': screenCreateChargeProduct,
        'mark-rent-received': screenMarkRentReceivedProduct,
        'certificate-assign': screenCertificateAssign,
        'notifications-list': screenNotificationsListProduct,
    });
    const extraScreens = ['certificate-assign'];
    if (typeof NO_NAV !== 'undefined') NO_NAV.push(...extraScreens.filter(s => !NO_NAV.includes(s)));
    if (typeof FEATURE_BACK_MAP !== 'undefined') {
        FEATURE_BACK_MAP['certificate-assign'] = 'property-detail';
    }
    confirmMarkRentReceived = confirmMarkRentReceivedProduct;
    contractorFilterJobs = contractorFilterJobsProduct;
    const origBind = typeof bindFeatureEvents === 'function' ? bindFeatureEvents : null;
    if (origBind) {
        bindFeatureEvents = function() {
            origBind();
            bindProductEvents();
        };
    }
    const origBindCtr = typeof bindContractorEvents === 'function' ? bindContractorEvents : null;
    if (origBindCtr) {
        bindContractorEvents = function() {
            origBindCtr();
            bindProductEvents();
        };
    }
    if (typeof screenFinancialEnhanced === 'function') {
        const _fin = screenFinancialEnhanced;
        screenFinancialEnhanced = function() {
            let html = _fin();
            if (typeof renderPaymentFutureReadyStrip === 'function') {
                const strip = renderPaymentFutureReadyStrip();
                const marker = '<div class="screen-content screen-enter financial-page">';
                html = html.replace(marker, marker + strip);
            }
            return html;
        };
    }
    bindProductEvents();
}

initProductLayer();
