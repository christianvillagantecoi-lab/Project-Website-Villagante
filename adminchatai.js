function adminAiEscape(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function adminAiDate(value) {
  if (!value) return 'Unknown date';
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

let adminAiHistoryUnsubscribe = null;
let adminAiChartType = 'line';
let adminAiDateRange = 28;
let adminAiAvailabilityUnsubscribe = null;
let adminAiAvailabilityState = 'online';

function adminAiSessionDate(session) {
  const value = session.createdAt || session.updatedAt;
  return value?.toDate ? value.toDate() : new Date(value || 0);
}

function switchAiAnalyticsChart(type) {
  adminAiChartType = type;
  document.getElementById('aiChartLineBtn')?.classList.toggle('active', type === 'line');
  document.getElementById('aiChartBarBtn')?.classList.toggle('active', type === 'bar');
  if (window.adminAiLatestSessions) renderAdminAiAnalytics(window.adminAiLatestSessions);
}

function changeAiAnalyticsDateRange(value) {
  adminAiDateRange = value === 'year' ? 365 : Number(value);
  if (window.adminAiLatestSessions) renderAdminAiAnalytics(window.adminAiLatestSessions);
}

function openAiChartModal() {
  const modal = document.getElementById('aiChartModal');
  if (!modal) return;
  modal.style.display = 'flex';
  if (window.adminAiLatestSessions) renderAdminAiAnalyticsChart(window.adminAiLatestSessions, 'aiModalSessionChart');
}

function closeAiChartModal() {
  const modal = document.getElementById('aiChartModal');
  if (modal) modal.style.display = 'none';
}

function renderAiAvailability(status, changedAt) {
  const current = document.getElementById('aiAvailabilityStatus');
  const toggle = document.getElementById('aiAvailabilityToggle');
  const value = status === 'offline' || status === 'online' ? status : 'online';
  adminAiAvailabilityState = value;
  if (current) current.innerHTML = `Current status: <strong class="${value}">${value}</strong>${changedAt ? ` · Changed ${adminAiDate(changedAt)}` : ''}`;
  if (toggle) {
    toggle.classList.toggle('is-offline', value === 'offline');
    toggle.setAttribute('aria-pressed', String(value === 'online'));
    const label = toggle.querySelector('.ai-availability-toggle-label');
    if (label) label.textContent = value.toUpperCase();
  }
}

function startAiAvailabilityAdminListener() {
  if (adminAiAvailabilityUnsubscribe || typeof db === 'undefined') return;
  adminAiAvailabilityUnsubscribe = db.collection('site_control').doc('ai_status').onSnapshot(snapshot => {
    if (!snapshot.exists) {
      renderAiAvailability(adminAiAvailabilityState);
      return;
    }
    const data = snapshot.data();
    if (data.status === 'online' || data.status === 'offline') renderAiAvailability(data.status, data.changedAt);
  }, error => {
    const current = document.getElementById('aiAvailabilityStatus');
    if (current) current.textContent = `Unable to read AI status: ${error.message}`;
  });
}

function toggleAiAvailability() {
  const nextStatus = adminAiAvailabilityState === 'offline' ? 'online' : 'offline';
  setAiAvailability(nextStatus);
}

async function setAiAvailability(status) {
  if (typeof db === 'undefined' || !db) return;
  const user = typeof auth !== 'undefined' ? auth.currentUser : null;
  const changedBy = user?.email || user?.uid || 'test-admin';
  renderAiAvailability(status, new Date());
  try {
    const now = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection('site_control').doc('ai_status').set({ status, changedAt: now, changedBy }, { merge: true });
    try {
      await db.collection('ai_availability_history').add({ status, changedAt: now, changedBy });
      await loadAiAvailabilityHistory();
    } catch (historyError) {
      const current = document.getElementById('aiAvailabilityStatus');
      if (current) current.textContent = `Current status saved as ${status}. History permission still needs to be published.`;
      console.warn('AI availability history could not be saved:', historyError);
    }
  } catch (error) {
    const current = document.getElementById('aiAvailabilityStatus');
    if (current) current.textContent = `Unable to change AI status: ${error.message}`;
  }
}

async function loadAiAvailabilityHistory() {
  const container = document.getElementById('aiAvailabilityHistoryList');
  if (!container || typeof db === 'undefined') return;
  container.innerHTML = '<p>Loading status changes...</p>';
  try {
    const snapshot = await db.collection('ai_availability_history').limit(100).get();
    const entries = [];
    snapshot.forEach(doc => entries.push({ id: doc.id, ...doc.data() }));
    entries.sort((first, second) => {
      const firstTime = first.changedAt?.toDate ? first.changedAt.toDate().getTime() : new Date(first.changedAt || 0).getTime();
      const secondTime = second.changedAt?.toDate ? second.changedAt.toDate().getTime() : new Date(second.changedAt || 0).getTime();
      return secondTime - firstTime;
    });
    const onlineCount = entries.filter(entry => entry.status === 'online').length;
    const offlineCount = entries.filter(entry => entry.status === 'offline').length;
    const onlineCountElement = document.getElementById('aiOnlineChangeCount');
    const offlineCountElement = document.getElementById('aiOfflineChangeCount');
    if (onlineCountElement) onlineCountElement.textContent = onlineCount;
    if (offlineCountElement) offlineCountElement.textContent = offlineCount;
    container.innerHTML = entries.length
      ? entries.map(entry => `<div class="ai-status-history-item ${entry.status === 'offline' ? 'offline' : 'online'}"><div class="ai-status-history-details"><strong>${adminAiEscape(entry.status || 'online')}</strong><span>${adminAiDate(entry.changedAt)}${entry.changedBy ? ` · ${adminAiEscape(entry.changedBy)}` : ''}</span></div><button type="button" class="ai-status-history-delete" title="Delete this availability record" aria-label="Delete this availability record" onclick="deleteAiAvailabilityHistory('${adminAiEscape(entry.id)}')">⚠ Delete</button></div>`).join('')
      : '<p>No availability changes recorded yet.</p>';
  } catch (error) {
    container.innerHTML = `<p>Unable to load availability history: ${adminAiEscape(error.message)}</p>`;
  }
}

async function deleteAiAvailabilityHistory(id) {
  if (!id || typeof db === 'undefined' || !db) return;
  if (!confirm('⚠ Delete this online/offline history record? This cannot be undone.')) return;
  try {
    await db.collection('ai_availability_history').doc(id).delete();
    await loadAiAvailabilityHistory();
  } catch (error) {
    const container = document.getElementById('aiAvailabilityHistoryList');
    if (container) container.insertAdjacentHTML('afterbegin', `<p>Unable to delete record: ${adminAiEscape(error.message)}</p>`);
  }
}

function getAiAnalyticsSeries(sessions) {
  const days = adminAiDateRange;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days + 1);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    return { date, count: sessions.filter(session => { const created = adminAiSessionDate(session).getTime(); return created >= date.getTime() && created < next.getTime(); }).length };
  });
}

function renderAdminAiAnalytics(sessions) {
  window.adminAiLatestSessions = sessions;
  const now = Date.now();
  const validSessions = sessions.filter(session => (session.messages || []).some(message => message.type === 'user' && message.message?.trim()));
  const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
  const rangeStart = now - adminAiDateRange * 24 * 60 * 60 * 1000;
  const metricTotal = document.getElementById('aiMetricTotal');
  const metricRecent = document.getElementById('aiMetricRecent');
  const metricYear = document.getElementById('aiMetricYear');
  if (metricTotal) metricTotal.textContent = validSessions.filter(session => adminAiSessionDate(session).getTime() >= rangeStart).length;
  if (metricRecent) metricRecent.textContent = validSessions.filter(session => now - adminAiSessionDate(session).getTime() <= 48 * 60 * 60 * 1000).length;
  if (metricYear) metricYear.textContent = validSessions.filter(session => adminAiSessionDate(session).getTime() >= yearStart).length;

  renderAdminAiAnalyticsChart(validSessions, 'aiSessionChart');
  const updated = document.getElementById('aiAnalyticsUpdated');
  if (updated) updated.textContent = `${validSessions.length} real conversation${validSessions.length === 1 ? '' : 's'} · Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

function renderAdminAiAnalyticsChart(sessions, targetId) {
  const chart = document.getElementById(targetId);
  if (!chart) return;
  const dayCounts = getAiAnalyticsSeries(sessions.filter(session => (session.messages || []).some(message => message.type === 'user' && message.message?.trim())));
  const max = Math.max(1, ...dayCounts.map(item => item.count));
  chart.classList.toggle('ai-chart-bar-mode', adminAiChartType === 'bar');
  chart.classList.toggle('ai-chart-line-mode', adminAiChartType === 'line');

  if (adminAiChartType === 'bar') {
    const width = Math.max(640, dayCounts.length * 28);
    const height = 240;
    const left = 42;
    const right = 14;
    const top = 14;
    const bottom = 34;
    const plotHeight = height - top - bottom;
    const step = (width - left - right) / Math.max(1, dayCounts.length);
    const barWidth = Math.max(8, Math.min(18, step * .58));
    const grid = [0, .33, .66, 1].map(level => { const y = top + plotHeight - level * plotHeight; return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="ai-chart-gridline" /><text x="${left - 7}" y="${y + 4}" class="ai-chart-axis-value" text-anchor="end">${Math.round(level * max)}</text>`; }).join('');
    const bars = dayCounts.map((item, index) => {
      const x = left + index * step + (step - barWidth) / 2;
      const barHeight = item.count ? Math.max(2, item.count / max * plotHeight) : 0;
      const y = top + plotHeight - barHeight;
      return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" class="ai-session-svg-bar"><title>${item.date.toLocaleDateString()}: ${item.count} sessions</title></rect>`;
    }).join('');
    const labels = dayCounts.filter((_, index) => dayCounts.length <= 14 || index % Math.ceil(dayCounts.length / 8) === 0 || index === dayCounts.length - 1).map((item) => {
      const index = dayCounts.indexOf(item);
      return `<text x="${left + index * step + step / 2}" y="${height - 8}" class="ai-chart-label" text-anchor="middle">${item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</text>`;
    }).join('');
    chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${grid}${bars}${labels}</svg>`;
    return;
  }

  const width = Math.max(640, dayCounts.length * 28);
  const height = 240;
  const left = 42;
  const right = 14;
  const top = 14;
  const bottom = 34;
  const plotHeight = height - top - bottom;
  const points = dayCounts.map((item, index) => ({ x: left + index * ((width - left - right) / Math.max(1, dayCounts.length - 1)), y: top + plotHeight - (item.count / max * plotHeight), item }));
  const linePath = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${linePath} L ${points.at(-1).x} ${top + plotHeight} L ${points[0].x} ${top + plotHeight} Z`;
  const labels = points.filter((_, index) => dayCounts.length <= 14 || index % Math.ceil(dayCounts.length / 8) === 0 || index === dayCounts.length - 1).map(point => `<text x="${point.x}" y="${height - 8}" class="ai-chart-label" text-anchor="middle">${point.item.date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</text>`).join('');
  const grid = [0, .33, .66, 1].map(level => { const y = top + plotHeight - level * plotHeight; return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="ai-chart-gridline" /><text x="${left - 7}" y="${y + 4}" class="ai-chart-axis-value" text-anchor="end">${Math.round(level * max)}</text>`; }).join('');
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><path d="${areaPath}" class="ai-chart-area"></path>${grid}<path d="${linePath}" class="ai-chart-line"></path>${points.map(point => `<circle cx="${point.x}" cy="${point.y}" r="3.5" class="ai-chart-dot"><title>${point.item.date.toLocaleDateString()}: ${point.item.count} sessions</title></circle>`).join('')}${labels}</svg>`;
}

function startAdminAiAnalyticsListener() {
  if (adminAiHistoryUnsubscribe || typeof db === 'undefined') return;
  adminAiHistoryUnsubscribe = db.collection('ai_chat_sessions').limit(200).onSnapshot(snapshot => {
    const sessions = [];
    snapshot.forEach(doc => sessions.push({ id: doc.id, ...doc.data() }));
    renderAdminAiAnalytics(sessions);
  }, error => console.warn('AI analytics listener error:', error));
}

async function loadAdminAiHistory() {
  const container = document.getElementById('adminAiHistoryList');
  const status = document.getElementById('adminAiHistoryStatus');
  if (!container || typeof db === 'undefined') return;
  startAdminAiAnalyticsListener();
  container.innerHTML = '<p>Loading saved conversations...</p>';
  try {
    const snapshot = await db.collection('ai_chat_sessions').orderBy('updatedAt', 'desc').limit(100).get();
    if (snapshot.empty) {
      container.innerHTML = '<p>No saved AI conversations yet.</p>';
      return;
    }
    const grouped = {};
    const cleanupTasks = [];
    snapshot.forEach(doc => {
      const item = { id: doc.id, ...doc.data() };
      if (!(item.messages || []).some(message => message.type === 'user' && message.message?.trim())) {
        cleanupTasks.push(db.collection('ai_chat_sessions').doc(doc.id).delete());
        return;
      }
      const date = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt || item.createdAt || Date.now());
      const group = date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
      (grouped[group] ||= []).push(item);
    });
    await Promise.all(cleanupTasks);
    container.innerHTML = Object.entries(grouped).map(([group, sessions]) => `
      <div class="admin-ai-history-group">${adminAiEscape(group)}</div>
      ${sessions.map(session => `
        <article class="admin-ai-history-card">
          <div>
            <h4>${adminAiEscape(session.title || 'Untitled AI conversation')}</h4>
            <p>${adminAiEscape((session.messages || []).slice(-1)[0]?.message || 'No message preview')}</p>
            <div class="admin-ai-history-meta">${adminAiDate(session.updatedAt || session.createdAt)} · ${(session.messages || []).length} messages · Session ${adminAiEscape(session.id)}</div>
            <div class="admin-ai-history-messages">${(session.messages || []).slice(-8).map(message => `<div class="admin-ai-history-message"><strong>${message.type === 'user' ? 'Visitor' : 'AI'}</strong>${adminAiEscape(message.message)}<br><small>${adminAiDate(message.createdAt)}</small></div>`).join('')}</div>
          </div>
          <div class="admin-ai-history-actions"><button class="action-btn-delete" onclick="deleteAdminAiSession('${adminAiEscape(session.id)}')">Delete</button></div>
        </article>`).join('')}`).join('');
    if (status) status.textContent = `${snapshot.size} saved conversation${snapshot.size === 1 ? '' : 's'} loaded.`;
  } catch (error) {
    container.innerHTML = `<p class="error-text">Unable to load AI history: ${adminAiEscape(error.message)}. Sign in with the configured admin account; testAdmin mode only bypasses the screen and does not grant Firestore permissions.</p>`;
  }
}

async function deleteAdminAiSession(id) {
  if (!confirm('Delete this saved AI chat session?')) return;
  try {
    await db.collection('ai_chat_sessions').doc(id).delete();
    const status = document.getElementById('adminAiHistoryStatus');
    if (status) status.textContent = `Session deleted on ${new Date().toLocaleString()}.`;
    loadAdminAiHistory();
  } catch (error) {
    alert(`Delete failed: ${error.message}`);
  }
}
