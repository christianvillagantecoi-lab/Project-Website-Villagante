/* ==========================================================================
   VISITOR ANALYTICS & TRACKING LOGIC (YOUTUBE STUDIO PARITY)
   ========================================================================== */

let globalAnalyticsProjects = [];
let activeChartType = 'line';
let activeDateRange = 28;

/**
 * Increments project view count when a visitor views or opens a project
 */
async function trackProjectVisit(projectId) {
  if (!projectId || typeof db === 'undefined' || !db) return;
  
  try {
    const projectRef = db.collection("projects").doc(projectId);
    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyRef = projectRef.collection("dailyStats").doc(todayStr);

    await Promise.all([
      projectRef.update({
        views: firebase.firestore.FieldValue.increment(1),
        hourlyViews: firebase.firestore.FieldValue.arrayUnion({
          timestamp: now,
          views: 1
        })
      }),
      dailyRef.set({
        views: firebase.firestore.FieldValue.increment(1)
      }, { merge: true })
    ]);

    console.log(`[Analytics] Successfully tracked visit for: ${projectId}`);
  } catch (err) {
    console.warn("Could not increment visitor views:", err);
  }
}

/**
 * Switches chart view between SVG Line and Bar Chart
 */
function switchChartType(type) {
  activeChartType = type;
  const btnLine = document.getElementById('btnTypeLine');
  const btnBar = document.getElementById('btnTypeBar');
  if (btnLine) btnLine.classList.toggle('active', type === 'line');
  if (btnBar) btnBar.classList.toggle('active', type === 'bar');
  
  renderVisitorAnalytics(globalAnalyticsProjects);
}

/**
 * Updates selected analytics timeframe
 */
function changeAnalyticsDateRange(val) {
  activeDateRange = val === 'year' ? 365 : parseInt(val, 10);
  renderVisitorAnalytics(globalAnalyticsProjects);
}

/**
 * Handles chart modal pop-out
 */
function openChartModal() {
  const modal = document.getElementById('ytChartModal');
  if (modal) {
    modal.style.display = 'flex';
    renderChartToTarget('ytModalChartContainer', globalAnalyticsProjects, 280);
  }
}

function closeChartModal() {
  const modal = document.getElementById('ytChartModal');
  if (modal) modal.style.display = 'none';
}

/**
 * Main analytics rendering function
 */
function renderVisitorAnalytics(projectsList) {
  globalAnalyticsProjects = projectsList || [];

  const metricsContainer = document.getElementById('visitorMetricsContainer');
  const graphContainer = document.getElementById('ytVisitorGraph');
  const chartBoxContainer = document.getElementById('ytChartContainer');
  const majorStatsList = document.getElementById('majorProjectStatsList');
  const minorStatsList = document.getElementById('minorProjectStatsList');

  let totalVisitors = 0;
  let topProject = { title: 'N/A', views: 0 };

  globalAnalyticsProjects.forEach(p => {
    const views = p.views || 0;
    totalVisitors += views;
    if (views > topProject.views) {
      topProject = { title: p.title || 'Untitled', views };
    }
  });

  const estWatchTime = (totalVisitors * 0.15).toFixed(1);

  // Update YouTube Studio Style Headers & KPI Elements
  const headerTitle = document.getElementById('ytChartHeaderTitle');
  if (headerTitle) {
    headerTitle.innerText = `Your projects got ${totalVisitors.toLocaleString()} views in the last ${activeDateRange} days`;
  }

  const viewsVal = document.getElementById('ytTotalViewsVal');
  const watchVal = document.getElementById('ytWatchTimeVal');
  if (viewsVal) viewsVal.innerText = totalVisitors.toLocaleString();
  if (watchVal) watchVal.innerText = estWatchTime;

  const projVal = document.getElementById('ytProjectCountVal');
  const realtimeVal = document.getElementById('ytRealtimeTotal');

  if (projVal) projVal.innerText = globalAnalyticsProjects.length;

  const realtime48hViews = calculateRealtimeViews(globalAnalyticsProjects, 48);
  if (realtimeVal) realtimeVal.innerText = realtime48hViews.toLocaleString();

  if (metricsContainer) {
    metricsContainer.innerHTML = `
      <div class="metric-card">
        <span class="metric-card-label">Total Visitors</span>
        <span class="metric-card-value">${totalVisitors.toLocaleString()}</span>
        <span class="metric-card-sub">▲ Cumulative views across all projects</span>
      </div>
      <div class="metric-card">
        <span class="metric-card-label">Total Projects Tracked</span>
        <span class="metric-card-value">${globalAnalyticsProjects.length}</span>
        <span class="metric-card-sub">Active software projects</span>
      </div>
      <div class="metric-card">
        <span class="metric-card-label">Most Viewed Project</span>
        <span class="metric-card-value" style="font-size: 1.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(topProject.title)}</span>
        <span class="metric-card-sub">🔥 ${topProject.views.toLocaleString()} visitors</span>
      </div>
    `;
  }

  renderMicroBars();

  if (chartBoxContainer) {
    renderChartToTarget('ytChartContainer', globalAnalyticsProjects, 220);
  }
  if (graphContainer) {
    renderChartToTarget('ytVisitorGraph', globalAnalyticsProjects, 220);
  }

  const majorProjects = globalAnalyticsProjects.filter(p => (p.category || 'major').toLowerCase() === 'major');
  const minorProjects = globalAnalyticsProjects.filter(p => (p.category || 'major').toLowerCase() === 'minor');

  if (majorStatsList) {
    majorStatsList.innerHTML = majorProjects.length
      ? majorProjects.map(renderStatItem).join('')
      : `<p style="color: var(--text-muted); font-size: 0.85rem;">No major projects recorded.</p>`;
  }

  if (minorStatsList) {
    minorStatsList.innerHTML = minorProjects.length
      ? minorProjects.map(renderStatItem).join('')
      : `<p style="color: var(--text-muted); font-size: 0.85rem;">No minor projects recorded.</p>`;
  }
}

/**
 * Universal SVG / Bar Chart Builder with YouTube Studio Real-time Dates & Y-Axis
 */
function renderChartToTarget(targetId, projectsList, chartHeight) {
  const container = document.getElementById(targetId);
  if (!container) return;

  if (!projectsList || projectsList.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 40px;">No analytics data recorded yet.</div>`;
    return;
  }

  // Generate Date Range Series for Horizontal Axis
  const days = activeDateRange || 28;
  const timeSeries = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const shortLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const targetDateStr = d.toISOString().split('T')[0];

    let totalViewsOnDate = 0;
    
    // Aggregate real visit counts matching target date from hourlyViews array
    projectsList.forEach(p => {
      if (p.hourlyViews && Array.isArray(p.hourlyViews)) {
        p.hourlyViews.forEach(entry => {
          if (entry.timestamp) {
            const entryDateStr = new Date(entry.timestamp).toISOString().split('T')[0];
            if (entryDateStr === targetDateStr) {
              totalViewsOnDate += (entry.views || 1);
            }
          }
        });
      }
    });

    timeSeries.push({
      dateLabel,
      shortLabel,
      views: totalViewsOnDate
    });
  }

  const maxViews = Math.max(...timeSeries.map(d => d.views), 10);

  if (activeChartType === 'bar') {
    let html = `<div class="yt-bar-chart-container" style="height: ${chartHeight}px;">`;
    
    // Y-Axis Column
    html += `<div class="yt-y-axis">
      <span>${maxViews}</span>
      <span>${Math.round(maxViews * 0.66)}</span>
      <span>${Math.round(maxViews * 0.33)}</span>
      <span>0</span>
    </div>`;

    html += `<div class="yt-bar-plot-area">`;
    timeSeries.forEach(point => {
      const heightPercent = Math.max(4, Math.round((point.views / maxViews) * 100));
      html += `
        <div class="yt-bar-wrapper">
          <div class="yt-bar-tooltip">
            <div>${point.dateLabel}</div>
            <strong style="color:#29b6f6; font-size:1.1rem;">${point.views}</strong>
          </div>
          <div class="yt-bar-fill" style="height: ${heightPercent}%;"></div>
          <span class="yt-bar-label">${point.shortLabel}</span>
        </div>
      `;
    });
    html += `</div></div>`;
    container.innerHTML = html;
  } else {
    // Line Chart View
    const width = 800;
    const height = chartHeight;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 35;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    const stepX = plotWidth / (timeSeries.length - 1 || 1);

    let pointsCoords = [];
    let pathD = '';

    timeSeries.forEach((pt, idx) => {
      const x = paddingLeft + idx * stepX;
      const y = paddingTop + plotHeight - ((pt.views / maxViews) * plotHeight);
      pointsCoords.push({ x, y, dateLabel: pt.dateLabel, shortLabel: pt.shortLabel, views: pt.views });
      pathD += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });

    const areaD = `${pathD} L ${paddingLeft + (timeSeries.length - 1) * stepX} ${paddingTop + plotHeight} L ${paddingLeft} ${paddingTop + plotHeight} Z`;

    // Horizontal Y-Axis labels and gridlines
    const ySteps = [0, 0.33, 0.66, 1];

    let svgHtml = `
      <div class="yt-line-chart-wrapper" style="position: relative; width: 100%; height: ${height}px;">
        <svg class="yt-svg-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ytBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#29b6f6" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#29b6f6" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <!-- Y-Axis Gridlines & Numbers -->
          ${ySteps.map(ratio => {
            const yPos = paddingTop + plotHeight - (ratio * plotHeight);
            const val = Math.round(ratio * maxViews);
            return `
              <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" class="yt-chart-gridline" />
              <text x="${paddingLeft - 8}" y="${yPos + 4}" class="yt-chart-axis-text" text-anchor="end">${val}</text>
            `;
          }).join('')}

          <!-- Area & Line Paths -->
          <path d="${areaD}" fill="url(#ytBlueGradient)" />
          <path d="${pathD}" fill="none" stroke="#29b6f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

          <!-- X-Axis Date Labels -->
          ${pointsCoords.filter((_, idx) => idx % Math.ceil(timeSeries.length / 6) === 0 || idx === timeSeries.length - 1).map(pt => `
            <text x="${pt.x}" y="${height - 8}" class="yt-chart-axis-text" text-anchor="middle">${pt.shortLabel}</text>
          `).join('')}

          <!-- Interactive Points -->
          ${pointsCoords.map(pt => `
            <g class="yt-interactive-node">
              <!-- Invisible expanded target for seamless hovering -->
              <circle cx="${pt.x}" cy="${pt.y}" r="15" fill="transparent" style="cursor: pointer;" />
              <!-- Visual dot (invisible by default, revealed on hover) -->
              <circle cx="${pt.x}" cy="${pt.y}" r="3.5" class="yt-chart-point" />
              <!-- Hover Tooltip -->
              <foreignObject x="${Math.min(Math.max(pt.x - 65, 0), width - 130)}" y="${Math.max(pt.y - 65, 0)}" width="130" height="55" class="yt-node-hover-box">
                <div class="yt-svg-tooltip">
                  <div class="yt-tip-date">${pt.dateLabel}</div>
                  <div class="yt-tip-views">${pt.views}</div>
                </div>
              </foreignObject>
            </g>
          `).join('')}
        </svg>
      </div>
    `;
    container.innerHTML = svgHtml;
  }
}

/**
 * Calculates total views recorded in the last X hours
 */
function calculateRealtimeViews(projectsList, hours = 48) {
  const now = Date.now();
  const cutoffTime = now - (hours * 3600 * 1000);
  
  let realtimeTotal = 0;
  projectsList.forEach(p => {
    if (p.hourlyViews && Array.isArray(p.hourlyViews)) {
      p.hourlyViews.forEach(entry => {
        if (entry.timestamp >= cutoffTime) {
          realtimeTotal += (entry.views || 0);
        }
      });
    }
  });
  return realtimeTotal;
}

/**
 * Renders 48 Micro Bars with Realtime Tooltips & Animations
 */
function renderMicroBars() {
  const container = document.getElementById('ytMicroBars');
  if (!container) return;

  const hours = 48;
  const hourlyData = new Array(hours).fill(0);
  const now = Date.now();

  if (globalAnalyticsProjects && globalAnalyticsProjects.length > 0) {
    globalAnalyticsProjects.forEach(p => {
      if (p.hourlyViews && Array.isArray(p.hourlyViews)) {
        p.hourlyViews.forEach(entry => {
          const hourDiff = Math.floor((now - entry.timestamp) / (3600 * 1000));
          if (hourDiff >= 0 && hourDiff < hours) {
            hourlyData[hours - 1 - hourDiff] += (entry.views || 0);
          }
        });
      }
    });
  }

  const maxVal = Math.max(...hourlyData, 1);
  let html = '';

  hourlyData.forEach((val, idx) => {
    const heightPercent = Math.max(8, Math.round((val / maxVal) * 100));
    const hourOffset = hours - 1 - idx;
    
    // Construct real-time hour boundaries
    const startTime = new Date(now - (hourOffset * 3600 * 1000));
    const endTime = new Date(startTime.getTime() + (3600 * 1000));

    const dayName = startTime.toLocaleDateString('en-US', { weekday: 'long' });
    const startStr = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const endStr = endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

    const timeRangeFormatted = `${dayName}, ${startStr} - ${endStr}`;

    html += `
      <div class="yt-micro-bar-wrapper">
        <div class="yt-micro-bar-tooltip">
          <div class="yt-micro-tip-time">${timeRangeFormatted}</div>
          <div class="yt-micro-tip-views">${val.toLocaleString()} views</div>
        </div>
        <div class="yt-micro-bar" style="height: ${heightPercent}%;"></div>
      </div>`;
  });

  container.innerHTML = html;
}

function renderStatItem(item) {
  return `
    <div class="item-card">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${escapeHtml(item.image)}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover; border: 1px solid var(--accent-color, #ff4757);" onerror="this.src='images/Gradient.jpg'">
        <strong style="color: #fff;">${escapeHtml(item.title)}</strong>
      </div>
      <span class="visitor-pill-badge">👁️ ${(item.views || 0).toLocaleString()} Visitors</span>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ==========================================================================
   RESET, EXPORT, AND IMPORT ANALYTICS DATA
   ========================================================================== */

function openResetModal() {
  const modal = document.getElementById('analyticsResetModal');
  if (modal) modal.style.display = 'flex';
}

function closeResetModal() {
  const modal = document.getElementById('analyticsResetModal');
  if (modal) modal.style.display = 'none';
}

async function executeResetAnalytics() {
  if (typeof db === 'undefined' || !db) return;

  try {
    const batch = db.batch();
    
    globalAnalyticsProjects.forEach(p => {
      const ref = db.collection("projects").doc(p.id);
      // Reset total views AND clear historical hourly timestamps
      batch.update(ref, { 
        views: 0,
        hourlyViews: [] 
      });
    });

    await batch.commit();
    
    // Update local state and trigger UI re-render
    globalAnalyticsProjects.forEach(p => {
      p.views = 0;
      p.hourlyViews = [];
    });

    closeResetModal();
    renderVisitorAnalytics(globalAnalyticsProjects);
    
    alert("All visitor views and Realtime tracking logs have been successfully reset to 0.");
  } catch (err) {
    console.error("Failed to reset views:", err);
    alert("Error resetting views: " + err.message);
  }
}

function exportAnalyticsData() {
  if (!globalAnalyticsProjects || globalAnalyticsProjects.length === 0) {
    alert("No project data available to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Project ID,Project Title,Category,Views\n";

  globalAnalyticsProjects.forEach(p => {
    const titleClean = `"${(p.title || 'Untitled').replace(/"/g, '""')}"`;
    const categoryClean = `"${(p.category || 'major').replace(/"/g, '""')}"`;
    csvContent += `${p.id},${titleClean},${categoryClean},${p.views || 0}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Visitor_Analytics_Backup_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function triggerImportFileInput() {
  const fileInput = document.getElementById('importFileInput');
  if (fileInput) fileInput.click();
}

function handleImportAnalyticsFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    const text = e.target.result;
    try {
      if (file.name.endsWith('.json')) {
        await processJsonImport(JSON.parse(text));
      } else {
        await processCsvImport(text);
      }
      event.target.value = '';
    } catch (err) {
      alert("Error importing analytics data: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function processCsvImport(csvText) {
  const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) throw new Error("CSV file is empty or missing data rows.");

  const batch = db.batch();
  let updatedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 4) {
      const id = parts[0].trim();
      const views = parseInt(parts[parts.length - 1].trim(), 10);

      if (id && !isNaN(views)) {
        const ref = db.collection("projects").doc(id);
        batch.update(ref, { views: views });
        updatedCount++;
      }
    }
  }

  if (updatedCount > 0) {
    await batch.commit();
    alert(`Successfully imported view metrics for ${updatedCount} projects!`);
  } else {
    alert("No matching Project IDs were found in the uploaded file.");
  }
}

async function processJsonImport(jsonData) {
  if (!Array.isArray(jsonData)) throw new Error("Invalid JSON format. Expected an array of project objects.");

  const batch = db.batch();
  let updatedCount = 0;

  jsonData.forEach(item => {
    if (item.id && typeof item.views === 'number') {
      const ref = db.collection("projects").doc(item.id);
      batch.update(ref, { views: item.views });
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    await batch.commit();
    alert(`Successfully imported view metrics for ${updatedCount} projects!`);
  } else {
    alert("No valid project objects found in JSON file.");
  }
}

setInterval(() => {
  if (globalAnalyticsProjects && globalAnalyticsProjects.length > 0) {
    renderMicroBars();
  }
}, 60000);