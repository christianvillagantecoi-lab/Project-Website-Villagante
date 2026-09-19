let adminContacts = [];
let adminContactsUnsubscribe = null;
let contactAnalyticsChart = 'line';
let contactAnalyticsDateRange = 28;
let contactManagementSort = 'newest';

function contactAdminDate(value) {
  if (!value) return 'Not set';
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not set' : new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function contactAdminDay(value) {
  if (!value) return null;
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startContactAdminListener() {
  if (adminContactsUnsubscribe || typeof db === 'undefined') return;
  adminContactsUnsubscribe = db.collection('contacts').onSnapshot(snapshot => {
    adminContacts = [];
    snapshot.forEach(doc => adminContacts.push({ id: doc.id, ...doc.data() }));
    adminContacts.sort((first, second) => (contactAdminDay(second.createdAt)?.getTime() || 0) - (contactAdminDay(first.createdAt)?.getTime() || 0));
    renderContactManagement();
    renderContactAnalytics();
  }, error => {
    const status = document.getElementById('contactManagementStatus');
    if (status) status.textContent = `Unable to load contacts: ${error.message}`;
  });
}

function renderContactManagement() {
  const container = document.getElementById('contactManagementList');
  const status = document.getElementById('contactManagementStatus');
  if (!container) return;
  const groups = {};
  const sortedContacts = [...adminContacts].sort((first, second) => {
    if (contactManagementSort === 'name') return String(first.name || '').localeCompare(String(second.name || ''), undefined, { sensitivity: 'base' });
    if (contactManagementSort === 'email') return String(first.email || '').localeCompare(String(second.email || ''), undefined, { sensitivity: 'base' });
    if (contactManagementSort === 'status') return String(first.category || 'new').localeCompare(String(second.category || 'new'));
    return (contactAdminDay(second.createdAt)?.getTime() || 0) - (contactAdminDay(first.createdAt)?.getTime() || 0);
  });
  sortedContacts.forEach(contact => (groups[contact.category || 'new'] ||= []).push(contact));
  const order = ['new', 'in-progress', 'taken', 'replied', 'archived'];
  const categories = [...order, ...Object.keys(groups).filter(category => !order.includes(category))];
  container.innerHTML = adminContacts.length ? categories.filter(category => groups[category]).map(category => `
    <section class="contact-group">
      <h3>${contactAdminEscape(category)} <span>${groups[category].length}</span></h3>
      <div class="contact-table-scroll"><table class="contact-table">
        <thead><tr><th>Name</th><th>Email address</th><th>Message</th><th>Cellphone number</th><th>Status cabinet</th><th>Actions</th></tr></thead>
        <tbody>${groups[category].map(contact => `
          <tr>
            <td data-label="Name"><strong>${contactAdminEscape(contact.name)}</strong></td>
            <td data-label="Email address"><a href="mailto:${contactAdminEscape(contact.email)}">${contactAdminEscape(contact.email)}</a></td>
            <td data-label="Message" class="contact-table-message">${contactAdminEscape(contact.message)}<small>Received ${contactAdminDate(contact.createdAt)}</small></td>
            <td data-label="Cellphone number"><a href="tel:${contactAdminEscape(contact.phone)}">${contactAdminEscape(contact.phone)}</a></td>
            <td data-label="Status cabinet"><select onchange="updateContactCategory('${contact.id}', this.value)" aria-label="Contact category">${['new', 'in-progress', 'taken', 'replied', 'archived'].map(option => `<option value="${option}" ${option === (contact.category || 'new') ? 'selected' : ''}>${option}</option>`).join('')}</select></td>
            <td data-label="Actions"><button type="button" class="contact-delete-btn" onclick="deleteContactMessage('${contact.id}')">Delete</button></td>
          </tr>`).join('')}</tbody>
      </table></div>
    </section>`).join('') : '<p class="contact-empty-state">No contact messages received yet.</p>';
  if (status) status.textContent = `${adminContacts.length} message${adminContacts.length === 1 ? '' : 's'} loaded · Grouped by cabinet · Sorted ${contactManagementSort === 'newest' ? 'newest first' : `${contactManagementSort} first`}`;
}

function changeContactManagementSort(value) {
  contactManagementSort = value;
  renderContactManagement();
}

function contactAdminEscape(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

async function updateContactCategory(id, category) {
  const contact = adminContacts.find(item => item.id === id);
  if (!contact || typeof db === 'undefined') return;
  try {
    const update = { category, modifiedAt: firebase.firestore.FieldValue.serverTimestamp() };
    if (category === 'taken' && !contact.takenAt) update.takenAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('contacts').doc(id).update(update);
  } catch (error) {
    alert(`Unable to update contact: ${error.message}`);
  }
}

async function deleteContactMessage(id) {
  if (!confirm('⚠ Delete this contact message permanently? This cannot be undone.')) return;
  try {
    await db.collection('contacts').doc(id).delete();
  } catch (error) {
    alert(`Delete failed: ${error.message}`);
  }
}

function switchContactAnalyticsChart(type) {
  contactAnalyticsChart = type;
  document.getElementById('contactChartLineBtn')?.classList.toggle('active', type === 'line');
  document.getElementById('contactChartBarBtn')?.classList.toggle('active', type === 'bar');
  renderContactAnalytics();
  if (document.getElementById('contactChartModal')?.style.display === 'flex') renderContactAnalytics('contactModalAnalyticsChart');
}

function changeContactAnalyticsDateRange(value) {
  contactAnalyticsDateRange = value === 'year' ? 365 : Number(value);
  renderContactAnalytics();
  if (document.getElementById('contactChartModal')?.style.display === 'flex') renderContactAnalytics('contactModalAnalyticsChart');
}

function openContactChartModal() {
  const modal = document.getElementById('contactChartModal');
  if (!modal) return;
  modal.style.display = 'flex';
  renderContactAnalytics('contactModalAnalyticsChart');
}

function closeContactChartModal() {
  const modal = document.getElementById('contactChartModal');
  if (modal) modal.style.display = 'none';
}

function renderContactAnalytics(targetId = 'contactAnalyticsChart') {
  const days = contactAnalyticsDateRange;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);
  const series = Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    const count = adminContacts.filter(contact => { const created = contactAdminDay(contact.createdAt)?.getTime() || 0; return created >= date.getTime() && created < next.getTime(); }).length;
    return { date, count };
  });
  const total = series.reduce((sum, item) => sum + item.count, 0);
  const recent = series.slice(-7).reduce((sum, item) => sum + item.count, 0);
  document.getElementById('contactMetricTotal')?.replaceChildren(String(total));
  const rangeLabel = days === 365 ? 'Year-to-date messages' : `${days}-day messages`;
  document.getElementById('contactMetricTotalLabel')?.replaceChildren(rangeLabel);
  document.getElementById('contactMetricRecent')?.replaceChildren(String(recent));
  document.getElementById('contactMetricCategories')?.replaceChildren(String(new Set(adminContacts.map(contact => contact.category || 'new')).size));
  const chart = document.getElementById(targetId);
  if (!chart) return;
  const width = 720, height = 240, left = 34, right = 12, top = 14, bottom = 30;
  const plotHeight = height - top - bottom;
  const max = Math.max(1, ...series.map(item => item.count));
  const step = (width - left - right) / Math.max(1, series.length - 1);
  const grid = [0, .5, 1].map(level => { const y = top + plotHeight - level * plotHeight; const value = Math.round(level * max); return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="contact-chart-grid"/><text x="${left - 7}" y="${y + 4}" class="contact-chart-axis-value" text-anchor="end">${value}</text>`; }).join('');
  const labels = series.filter((_, index) => index % 7 === 0 || index === series.length - 1).map((item, index) => { const x = left + series.indexOf(item) * step; return `<text x="${x}" y="${height - 8}" class="contact-chart-label">${item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</text>`; }).join('');
  if (contactAnalyticsChart === 'bar') {
    const barWidth = Math.max(8, step * .55);
    const bars = series.map((item, index) => { const x = left + index * step - barWidth / 2; const barHeight = item.count ? Math.max(3, item.count / max * plotHeight) : 0; return `<rect x="${x}" y="${top + plotHeight - barHeight}" width="${barWidth}" height="${barHeight}" rx="3" class="contact-chart-bar"><title>${item.date.toLocaleDateString()}: ${item.count} messages</title></rect>`; }).join('');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Contact messages by day">${grid}${bars}${labels}</svg>`;
  } else {
    const points = series.map((item, index) => `${left + index * step},${top + plotHeight - item.count / max * plotHeight}`);
    const valueLabels = series.filter(item => item.count > 0).map(item => { const index = series.indexOf(item); return `<text x="${left + index * step}" y="${top + plotHeight - item.count / max * plotHeight - 8}" class="contact-chart-value" text-anchor="middle">${item.count}</text>`; }).join('');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Contact messages by day">${grid}<polyline points="${points.join(' ')}" class="contact-chart-line"/>${series.map((item, index) => `<circle cx="${left + index * step}" cy="${top + plotHeight - item.count / max * plotHeight}" r="3" class="contact-chart-dot"><title>${item.date.toLocaleDateString()}: ${item.count} messages</title></circle>`).join('')}${valueLabels}${labels}</svg>`;
  }
}
