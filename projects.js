// projects.js - Real-time Firestore sync & Visitor View Tracking

let currentProjectCategory = 'major';
let cachedProjects = [];

/**
 * Renders and attaches view-tracking logic to all major and minor projects.
 */
function loadProjects() {
  if (typeof db === 'undefined') {
    console.error("Firestore database instance (db) is not initialized.");
    return;
  }

  const gridContainer = document.getElementById('projectsGrid');
  if (!gridContainer) return;

  // Real-time listener on the "projects" collection
  db.collection("projects").onSnapshot((snapshot) => {
    cachedProjects = [];

    if (snapshot.empty) {
      gridContainer.innerHTML = `<p class="no-projects" style="color: var(--text-muted); padding: 20px 0;">No projects found.</p>`;
      return;
    }

    snapshot.forEach((doc) => {
      cachedProjects.push({ id: doc.id, ...doc.data() });
    });

    renderProjectsByCategory(currentProjectCategory);

  }, (error) => {
    console.error("Error loading projects from Firestore:", error);
    gridContainer.innerHTML = `<p style="color: #ff4757; padding: 20px 0;">Failed to load projects: ${error.message}</p>`;
  });
}

/**
 * Filter and render projects inside #projectsGrid
 */
function renderProjectsByCategory(category) {
  const gridContainer = document.getElementById('projectsGrid');
  if (!gridContainer) return;

  const filtered = cachedProjects.filter(p => (p.category || 'major').toLowerCase() === category.toLowerCase());

  if (filtered.length === 0) {
    gridContainer.innerHTML = `<p class="no-projects" style="color: var(--text-muted); padding: 20px 0;">No ${category} projects uploaded yet.</p>`;
    return;
  }

  gridContainer.innerHTML = filtered.map((project) => {
    const formattedViews = (project.views || 0).toLocaleString();
    
    // Fallback if project.image is empty or points to an invalid string
    const imageSrc = project.image && project.image.trim() !== '' ? project.image : 'images/Gradient.jpg';

    return `
      <div class="project-card" id="project-card-${project.id}">
        <div class="project-thumb-wrapper">
          <img 
            src="${escapeHtml(imageSrc)}" 
            alt="${escapeHtml(project.title)}" 
            onerror="this.onerror=null; this.src='images/Gradient.jpg';"
          >
          <span class="project-badge">👁️ ${formattedViews} Views</span>
        </div>

        <div class="project-card-body">
          <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
          <p class="project-card-desc">${escapeHtml(project.description)}</p>

          <div class="project-card-footer">
            ${project.githubLink ? `
              <a href="${escapeHtml(project.githubLink)}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="project-btn project-btn-github"
                 onclick="trackProjectVisit('${project.id}')">
                 GitHub Repo
              </a>
            ` : ''}

            ${project.demoLink ? `
              <a href="${escapeHtml(project.demoLink)}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="project-btn project-btn-demo"
                 onclick="trackProjectVisit('${project.id}')">
                 Live Demo ↗
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}
/**
 * Category Tab Switcher Handler
 */
function switchProjectCategory(category, btnElement) {
  currentProjectCategory = category;

  document.querySelectorAll('.project-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  renderProjectsByCategory(category);
}

/**
 * Increments the view counter in Cloud Firestore when a user opens a project link.
 */
async function trackProjectVisit(projectId) {
  if (!projectId || typeof db === 'undefined') return;

  try {
    const projectRef = db.collection("projects").doc(projectId);
    await projectRef.update({
      views: firebase.firestore.FieldValue.increment(1)
    });
  } catch (error) {
    console.error("Failed to record visitor view count:", error);
  }
}

/**
 * Utility function to prevent XSS vulnerabilities in dynamic strings.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

// Automatically initialize projects on DOM content load
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});