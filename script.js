const API_KEY = 'AIzaSyBaf_IoYogFmZ70jCSttnGhOyO2vPg8Xsc';
const CHANNEL_ID = 'UCh7hMghSQgfhqPlwyNIHFRw';

let rawVideos = [];
let currentModalIndex = -1;

/* Minimize & Drag States */
let isMinimized = false;
let isDragging = false;
let startX = 0, startY = 0;
let initialX = 0, initialY = 0;

let isPlaying = false;
let raceInterval = null;
let currentSimTime = 0;

let minTime = new Date('2023-01-01').getTime();
let maxTime = Date.now();

let speedMultiplier = 1;
const baseStepDays = 0.8;
let isScrubbing = false;

function resetAndRebuildRevealAnimations() {
  document.querySelectorAll('.reveal-card').forEach((node) => {
    node.classList.remove('reveal-visible');
    node.style.removeProperty('opacity');
    node.style.removeProperty('filter');
  });

  setupScrollRevealAnimations();
}

function setupScrollRevealAnimations() {
  const pageViews = Array.from(document.querySelectorAll('.page-view'));
  if (!pageViews.length) return;

  const nodes = [];
  pageViews.forEach((view) => {
    const viewNodes = Array.from(view.querySelectorAll('div, section, article, ul, li, h1, h2, h3, h4, p, img, span, a, button, form, label, input'));
    viewNodes.forEach((node, index) => {
      if (node.classList.contains('settings-drawer') || node.classList.contains('settings-backdrop')) return;
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      if (node.matches('.resume-grid-layout, .resume-sidebar, .resume-content-area, .resume-photo-container, .resume-avatar, .resume-education-accent, .home-parallax-container, .home-parallax-media, .home-parallax-shadow, .friends-parallax, .friends-parallax-media, .friends-parallax-shadow, .timeline-parallax, .timeline-parallax-media, .timeline-parallax-shadow, .projects-parallax, .projects-parallax-media, .projects-parallax-shadow, .contact-parallax, .contact-parallax-media, .contact-parallax-shadow, .aichatbox-parallax, .aichatbox-parallax-media, .aichatbox-parallax-shadow, .resume-parallax, .resume-parallax-media, .resume-parallax-shadow, .contact-carousel-image')) return;

      if (!node.classList.contains('reveal-card')) {
        node.classList.add('reveal-card');
      }

      node.style.setProperty('--reveal-delay', `${Math.min(index * 45, 650)}ms`);
      nodes.push(node);
    });
  });

  if (!nodes.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('reveal-visible');
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.12 });

    nodes.forEach((node) => observer.observe(node));
  } else {
    nodes.forEach((node) => node.classList.add('reveal-visible'));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setupScrollRevealAnimations();
  const featuredIframe = document.getElementById('featuredIframe');
  const featuredFallback = document.getElementById('featuredVideoFallback');
  if (featuredIframe && featuredFallback) {
    featuredIframe.addEventListener('error', () => {
      featuredIframe.hidden = true;
      featuredFallback.hidden = false;
    });
  }
});

function switchPage(pageId, element) {
  document.body.classList.toggle('ai-chatbox-page-active', pageId === 'aichatbox');

  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active-page');
  });

  const targetView = document.getElementById(`page-${pageId}`);
  if (targetView) {
    targetView.classList.add('active-page');

    
    // FIX: Force immediate visibility for the videos grid items so they never get stuck hidden
    if (pageId === 'videos') {
      targetView.querySelectorAll('.reveal-card').forEach((node) => {
        node.classList.add('reveal-visible');
        node.style.opacity = '1';
        node.style.transform = 'none';
        node.style.filter = 'none';
      });
    }
  }

  const navItems = document.querySelectorAll('.nav-container .nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  if (element) {
    element.classList.add('active');
  }

  window.scrollTo({
    top: 0,
    behavior: pageId === 'resume' ? 'auto' : 'smooth'
  });

  if (pageId !== 'videos') {
    resetAndRebuildRevealAnimations();
  }

  const featuredIframe = document.getElementById('featuredIframe');
  if (featuredIframe && rawVideos.length > 0) {
    if (pageId !== 'home') {
      featuredIframe.src = '';
    } else {
      const activeId = rawVideos[0].id;
      featuredIframe.src = `https://www.youtube.com/embed/${activeId}?enablejsapi=1&origin=${window.location.origin}`;
    }
  }

  if (pageId !== 'timeline' && isPlaying) {
    stopRaceTimer();
  }
}

function submitContactForm(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const subject = `Portfolio contact from ${formData.get('name')}`;
  const body = [
    `Name: ${formData.get('name')}`,
    `Email: ${formData.get('email')}`,
    `Cell phone: ${formData.get('phone')}`,
    '',
    formData.get('message')
  ].join('\n');

  window.location.href = `mailto:kouseilarscii@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function initContactImageCarousel() {
  const carousel = document.querySelector('.contact-image-carousel');
  if (!carousel) return;
  const transitionDuration = 820;

  const images = [...carousel.querySelectorAll('.contact-carousel-image')];
  const roles = ['is-slot-far-left', 'is-slot-left', 'is-slot-front', 'is-slot-right', 'is-slot-far-right'];
  const transientRoles = ['is-exit-left', 'is-enter-right', 'is-enter-active', 'is-queued'];
  const visibleImages = images.slice(0, roles.length);
  let queuedImages = images.slice(roles.length);

  images.forEach(image => image.classList.remove(...roles, ...transientRoles, 'is-front'));
  visibleImages.forEach((image, index) => image.classList.add(roles[index]));
  queuedImages.forEach(image => image.classList.add('is-queued'));

  let isRotating = false;
  window.setInterval(() => {
    if (isRotating) return;
    if (queuedImages.length === 0) return;

    isRotating = true;
    const exitingImage = visibleImages[0];
    const enteringImage = queuedImages.shift();
    const movingImages = visibleImages.slice(1);

    movingImages.forEach((image, index) => {
      image.classList.remove(...roles, ...transientRoles, 'is-front');
      image.classList.add(roles[index]);
    });
    exitingImage.classList.remove(...roles, ...transientRoles, 'is-front');
    enteringImage.classList.remove(...roles, ...transientRoles, 'is-front');
    exitingImage.classList.add('is-exit-left');
    enteringImage.classList.add('is-enter-right');
    void enteringImage.offsetWidth;
    window.setTimeout(() => enteringImage.classList.add('is-enter-active'), 0);
    window.setTimeout(() => {
      enteringImage.classList.remove('is-enter-right', 'is-enter-active');
      enteringImage.classList.add('is-slot-far-right');
      exitingImage.classList.remove(...roles, ...transientRoles, 'is-front');
      exitingImage.classList.add('is-queued');
      carousel.appendChild(exitingImage);
      queuedImages.push(exitingImage);
      visibleImages.shift();
      visibleImages.push(enteringImage);
      isRotating = false;
    }, transitionDuration);
  }, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactImageCarousel);
} else {
  initContactImageCarousel();
}

/* --- FETCH CHANNEL DETAILS --- */
async function loadChannelDetails() {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      document.getElementById('subCount').innerText = `${parseInt(stats.subscriberCount).toLocaleString()} subscribers`;
      document.getElementById('viewCount').innerText = `${parseInt(stats.viewCount).toLocaleString()} views`;
      document.getElementById('videoCount').innerText = `${parseInt(stats.videoCount).toLocaleString()} videos`;

      const uploadsPlaylistId = data.items[0].contentDetails.relatedPlaylists.uploads;
      loadVideosData(uploadsPlaylistId);
    }
  } catch (err) {
    console.error('Error fetching channel details:', err);
  }
}

/* --- FETCH CHANNEL VIDEOS --- */
async function loadVideosData(uploadsId) {
  try {
    const plRes1 = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=50&key=${API_KEY}`);
    const plData1 = await plRes1.json();
    let allPlaylistItems = plData1.items || [];

    if (plData1.nextPageToken) {
      const plRes2 = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=50&pageToken=${plData1.nextPageToken}&key=${API_KEY}`);
      const plData2 = await plRes2.json();
      if (plData2.items) allPlaylistItems = allPlaylistItems.concat(plData2.items);
    }

    let videoDetails = [];
    for (let i = 0; i < allPlaylistItems.length; i += 50) {
      const batchIds = allPlaylistItems.slice(i, i + 50).map(item => item.snippet.resourceId.videoId).join(',');
      const vRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${batchIds}&key=${API_KEY}`);
      const vData = await vRes.json();
      if (vData.items) videoDetails.push(...vData.items);
    }

    rawVideos = videoDetails.map(v => {
      const pubDate = new Date(v.snippet.publishedAt).getTime();
      const totalViews = parseInt(v.statistics.viewCount) || 0;
      const likesCount = parseInt(v.statistics.likeCount) || 0;
      const commentCount = parseInt(v.statistics.commentCount) || 0;
      const totalAgeDays = Math.max(1, (maxTime - pubDate) / (1000 * 60 * 60 * 24));
      const dailyGrowthRate = totalViews / totalAgeDays;

      return {
        id: v.id,
        title: v.snippet.title,
        description: v.snippet.description || 'No description provided.',
        views: totalViews,
        likes: likesCount,
        commentsCount: commentCount,
        pubDate: pubDate,
        pubDateStr: new Date(pubDate).toLocaleDateString(),
        dailyGrowthRate: dailyGrowthRate,
        thumb: (v.snippet.thumbnails.maxres || v.snippet.thumbnails.standard || v.snippet.thumbnails.high || v.snippet.thumbnails.medium || v.snippet.thumbnails.default).url
      };
    });

    if (rawVideos.length > 0) {
      const firstId = rawVideos[0].id;
      document.getElementById('featuredIframe').src = `https://www.youtube.com/embed/${firstId}?enablejsapi=1&origin=${window.location.origin}`;
      document.getElementById('featuredTitle').innerText = rawVideos[0].title;
      document.getElementById('featuredDesc').innerText = rawVideos[0].description.slice(0, 250) + '...';

      renderVideoGrid();
      renderLiveTop10();

      const earliestUpload = Math.min(...rawVideos.map(v => v.pubDate));
      if (earliestUpload < minTime) minTime = earliestUpload;

      currentSimTime = minTime;
      createRaceElements();
      updateRaceFrame();
      setupTimelineScrubber();
    }
  } catch (err) {
    console.error('Error fetching videos:', err);
  }
}

let currentSortMode = 'latest';
let currentSearchQuery = '';

/* --- RENDER VIDEOS GRID WITH FILTER & SEARCH --- */
function renderVideoGrid() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = rawVideos.filter(v => 
    v.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(currentSearchQuery.toLowerCase())
  );

  if (currentSortMode === 'latest') {
    filtered.sort((a, b) => b.pubDate - a.pubDate);
  } else if (currentSortMode === 'popular') {
    filtered.sort((a, b) => b.views - a.views);
  } else if (currentSortMode === 'oldest') {
    filtered.sort((a, b) => a.pubDate - b.pubDate);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="color: var(--text-muted); padding: 20px 0;">No videos found matching your search.</div>';
    return;
  }

  filtered.forEach((v) => {
    const originalIndex = rawVideos.findIndex(raw => raw.id === v.id);
    const card = document.createElement('div');
    
    // FIX: Add 'reveal-card reveal-visible' directly so dynamic elements show up instantly
    card.className = 'grid-card reveal-card reveal-visible';
    card.onclick = () => openVideoModal(originalIndex);
    card.innerHTML = `
      <div class="grid-card-thumb-wrapper">
        <img src="${v.thumb}" alt="thumbnail" />
        <div class="play-overlay">
          <div class="play-icon">\u25B6</div>
        </div>
      </div>
      <div class="grid-card-body">
        <div class="grid-card-title">${v.title}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">${v.views.toLocaleString()} views \u2022 ${v.pubDateStr}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setSortMode(mode, btnElement) {
  currentSortMode = mode;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderVideoGrid();
}

function handleVideoFilterSearch() {
  const input = document.getElementById('videoSearchInput');
  currentSearchQuery = input ? input.value.trim() : '';
  renderVideoGrid();
}

/* --- COMMENTS FETCH --- */
async function fetchVideoComments(videoId) {
  const listEl = document.getElementById('modalCommentsList');
  if (!listEl) return;
  listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">Loading top comments...</div>';

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=8&order=relevance&key=${API_KEY}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      listEl.innerHTML = '';
      data.items.forEach(item => {
        const comment = item.snippet.topLevelComment.snippet;
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
          <img class="comment-avatar" src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}">
          <div class="comment-content">
            <div class="comment-author">${comment.authorDisplayName}</div>
            <div class="comment-text">${comment.textDisplay}</div>
          </div>
        `;
        listEl.appendChild(commentDiv);
      });
    } else {
      listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">No comments found.</div>';
    }
  } catch (err) {
    listEl.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">Comments disabled or unavailable.</div>';
  }
}

/* --- VIDEO MODAL CONTROL --- */
function openVideoModal(index) {
  if (index < 0 || index >= rawVideos.length) return;
  currentModalIndex = index;
  const video = rawVideos[index];

  const modal = document.getElementById('videoModal');
  const container = document.getElementById('modalContainer');

  resetContainerPosition(container);

  document.getElementById('modalTitle').innerText = video.title;
  document.getElementById('modalIframe').src = `https://www.youtube.com/embed/${video.id}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;
  
  document.getElementById('modalViews').innerText = `\u{1F441}\uFE0F ${video.views.toLocaleString()} views`;
  document.getElementById('modalLikes').innerText = `\u{1F44D} ${video.likes.toLocaleString()} likes`;
  document.getElementById('modalCommentCount').innerText = `\u{1F4AC} ${video.commentsCount.toLocaleString()} comments`;
  document.getElementById('modalDate').innerText = `\u{1F4C5} ${video.pubDateStr}`;
  
  document.getElementById('modalDescription').innerText = video.description;

  const prevBtns = document.querySelectorAll('.prev-vid-btn');
  const nextBtns = document.querySelectorAll('.next-vid-btn');
  prevBtns.forEach(b => b.disabled = (index === 0));
  nextBtns.forEach(b => b.disabled = (index === rawVideos.length - 1));

  modal.classList.add('active');

  fetchVideoComments(video.id);
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const container = document.getElementById('modalContainer');
  const minBtn = document.getElementById('minimizeBtn');

  document.getElementById('modalIframe').src = '';
  modal.style.display = 'none';

  modal.classList.remove('active');
  modal.classList.remove('minimized-state');
  container.classList.remove('is-minimized');
  currentModalIndex = -1;

  isMinimized = false;
  isDragging = false;

  if (minBtn) {
    minBtn.innerText = '\u2212';
    minBtn.title = 'Minimize Video';
  }

  resetContainerPosition(container);

  requestAnimationFrame(() => {
    modal.style.display = '';
  });
}

function resetContainerPosition(container) {
  if (!container) return;
  container.style.position = '';
  container.style.left = '';
  container.style.top = '';
  container.style.bottom = '';
  container.style.right = '';
  container.style.margin = '';
  container.style.transform = '';
  container.style.transition = 'none';
  
  requestAnimationFrame(() => {
    container.style.transition = '';
  });
}

function toggleMinimizeVideo(e) {
  if (e) e.stopPropagation();
  const overlay = document.getElementById('videoModal');
  const container = document.getElementById('modalContainer');
  const minBtn = document.getElementById('minimizeBtn');

  isMinimized = !isMinimized;
  resetContainerPosition(container);

  if (isMinimized) {
    overlay.classList.add('minimized-state');
    container.classList.add('is-minimized');
    moveMiniVideoAwayFromAiLauncher(container);
    if (minBtn) {
      minBtn.innerText = '\u25A1';
      minBtn.title = 'Expand Video';
    }
  } else {
    overlay.classList.remove('minimized-state');
    container.classList.remove('is-minimized');
    if (minBtn) {
      minBtn.innerText = '\u2212';
      minBtn.title = 'Minimize Video';
    }
  }
}

function moveMiniVideoAwayFromAiLauncher(container) {
  const launcher = document.getElementById('floatingAiLauncher');
  if (!container || !launcher) return;

  const videoRect = container.getBoundingClientRect();
  const launcherRect = launcher.getBoundingClientRect();
  const overlaps = videoRect.left < launcherRect.right
    && videoRect.right > launcherRect.left
    && videoRect.top < launcherRect.bottom
    && videoRect.bottom > launcherRect.top;
  if (!overlaps) return;

  const gap = 14;
  const topAboveLauncher = launcherRect.top - videoRect.height - gap;
  if (topAboveLauncher >= 10) {
    container.style.left = `${Math.max(10, Math.min(videoRect.left, window.innerWidth - videoRect.width - 10))}px`;
    container.style.top = `${topAboveLauncher}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
    return;
  }

  const leftOfLauncher = launcherRect.left - videoRect.width - gap;
  if (leftOfLauncher >= 10) {
    container.style.left = `${leftOfLauncher}px`;
    container.style.top = `${Math.max(10, Math.min(videoRect.top, window.innerHeight - videoRect.height - 10))}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  }
}

function navigateModalVideo(direction) {
  const newIndex = currentModalIndex + direction;
  if (newIndex >= 0 && newIndex < rawVideos.length) {
    openVideoModal(newIndex);
  }
}

function handleBackdropClick(e) {
  if (e.target.id === 'videoModal' && !isMinimized) {
    closeVideoModal();
  }
}

/* --- DRAGGABLE IMPLEMENTATION --- */
function setupDraggableModal() {
  const header = document.getElementById('modalHeader');
  const container = document.getElementById('modalContainer');

  if (!header || !container) return;

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  header.addEventListener('touchstart', dragStart, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    if (e.target.closest('.modal-close-btn') || e.target.closest('.header-nav-btn')) return;

    const rect = container.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;

    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }

    isDragging = true;
    container.style.transition = 'none';

    container.style.position = 'fixed';
    container.style.left = `${initialX}px`;
    container.style.top = `${initialY}px`;
    container.style.bottom = 'auto';
    container.style.right = 'auto';
    container.style.margin = '0';

    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.style.pointerEvents = 'none';
    });
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    let deltaX = clientX - startX;
    let deltaY = clientY - startY;

    let newX = initialX + deltaX;
    let newY = initialY + deltaY;

    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    container.style.left = `${newX}px`;
    container.style.top = `${newY}px`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    container.style.transition = '';

    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.style.pointerEvents = 'auto';
    });
  }
}

window.addEventListener('keydown', (e) => {
  const modal = document.getElementById('videoModal');
  if (!modal || !modal.classList.contains('active')) return;

  if (e.key === 'Escape') closeVideoModal();
  if (e.key === 'ArrowRight') navigateModalVideo(1);
  if (e.key === 'ArrowLeft') navigateModalVideo(-1);
});

window.addEventListener('resize', () => {
  const container = document.getElementById('modalContainer');
  if (!container || !isMinimized) return;

  const rect = container.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width;
  const maxY = window.innerHeight - rect.height;

  let currentX = Math.max(10, Math.min(rect.left, maxX - 10));
  let currentY = Math.max(10, Math.min(rect.top, maxY - 10));

  container.style.left = `${currentX}px`;
  container.style.top = `${currentY}px`;
});

/* --- TIMELINE DASHBOARD --- */
function switchAnalyticsTab(tab) {
  const liveTab = document.getElementById('liveTabContent');
  const timelineTab = document.getElementById('timelineTabContent');
  const btn1 = document.getElementById('tabBtn1');
  const btn2 = document.getElementById('tabBtn2');

  if (tab === 'live') {
    liveTab.classList.remove('hidden');
    timelineTab.classList.add('hidden');
    btn1.classList.add('active');
    btn2.classList.remove('active');
    if (isPlaying) stopRaceTimer();
  } else {
    liveTab.classList.add('hidden');
    timelineTab.classList.remove('hidden');
    btn1.classList.remove('active');
    btn2.classList.add('active');
    updateRaceFrame();
  }

  resetAndRebuildRevealAnimations();
}

function renderLiveTop10() {
  const container = document.getElementById('leaderboard');
  if (!container) return;
  container.innerHTML = '';
  const sorted = [...rawVideos].sort((a, b) => b.views - a.views).slice(0, 10);

  sorted.forEach((video, index) => {
    const rank = index + 1;
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <span class="rank ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-4-plus'}">#${rank}</span>
      <img class="thumb" src="${video.thumb}" alt="thumbnail" />
      <div class="title-box">
        <div class="title" title="${video.title}">${video.title}</div>
        <div class="sub-info">Published: ${video.pubDateStr}</div>
      </div>
      <div class="views">${video.views.toLocaleString()} views</div>
    `;
    container.appendChild(card);
  });
}

function createRaceElements() {
  const container = document.getElementById('raceContainer');
  if (!container) return;
  container.innerHTML = '';
  rawVideos.forEach(v => {
    const el = document.createElement('div');
    el.className = 'bar-item';
    el.id = `bar-${v.id}`;
    el.style.display = 'none';
    el.innerHTML = `
      <div class="bar-rank">#</div>
      <img class="bar-thumb" src="${v.thumb}" alt="${v.title} thumbnail">
      <div class="bar-track">
        <div class="bar-fill" id="fill-${v.id}"></div>
        <div class="bar-content">
          <span class="bar-title">${v.title}</span>
          <span class="bar-views" id="views-${v.id}">0</span>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

function updateRaceFrame() {
  const currentDate = new Date(currentSimTime);
  const dateDisplay = document.getElementById('dateDisplay');
  if (dateDisplay) dateDisplay.innerText = currentDate.toISOString().split('T')[0];
  
  const progressPct = Math.min(100, Math.max(0, ((currentSimTime - minTime) / (maxTime - minTime)) * 100));
  const fill = document.getElementById('progressFill');
  const handle = document.getElementById('progressHandle');
  if (fill) fill.style.width = `${progressPct}%`;
  if (handle) handle.style.left = `${progressPct}%`;

  const activeVideos = rawVideos
    .filter(v => currentSimTime >= v.pubDate)
    .map(v => {
      const activeDays = (currentSimTime - v.pubDate) / (1000 * 60 * 60 * 24);
      const viewsAtDate = Math.min(v.views, Math.floor(activeDays * v.dailyGrowthRate));
      return { ...v, viewsAtDate };
    });

  activeVideos.sort((a, b) => b.viewsAtDate - a.viewsAtDate);

  rawVideos.forEach(v => {
    const bar = document.getElementById(`bar-${v.id}`);
    if (bar) bar.style.display = 'none';
  });

  if (activeVideos.length === 0) return;

  const maxViewsInTop = Math.max(1, activeVideos[0].viewsAtDate);

  activeVideos.slice(0, 10).forEach((v, index) => {
    const bar = document.getElementById(`bar-${v.id}`);
    const barFill = document.getElementById(`fill-${v.id}`);
    const viewsText = document.getElementById(`views-${v.id}`);

    if (bar) {
      bar.style.display = 'flex';
      bar.style.top = `${index * 48 + 15}px`;

      const widthPct = (v.viewsAtDate / maxViewsInTop) * 100;
      if (barFill) barFill.style.width = `${Math.max(2, widthPct)}%`;
      if (viewsText) viewsText.innerText = `${v.viewsAtDate.toLocaleString()} views`;

      const rankEl = bar.querySelector('.bar-rank');
      if (rankEl) {
        rankEl.innerText = `#${index + 1}`;
        rankEl.className = `bar-rank ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-4-plus'}`;
      }
    }
  });
}

function setupTimelineScrubber() {
  const track = document.getElementById('progressTrack');
  if (!track) return;
  function scrub(e) {
    const rect = track.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    let pct = offsetX / rect.width;
    currentSimTime = minTime + (pct * (maxTime - minTime - 1000));
    updateRaceFrame();
  }

  track.addEventListener('mousedown', (e) => { isScrubbing = true; scrub(e); });
  window.addEventListener('mousemove', (e) => { if (isScrubbing) scrub(e); });
  window.addEventListener('mouseup', () => { isScrubbing = false; });
}

function setSpeed(multiplier, btnElement) {
  speedMultiplier = multiplier;
  document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  if (isPlaying) {
    clearInterval(raceInterval);
    startTimerLoop();
  }
}

function stopRaceTimer() {
  clearInterval(raceInterval);
  raceInterval = null;
  isPlaying = false;
  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.innerText = "\u25B6 Play";
}

function startTimerLoop() {
  raceInterval = setInterval(() => {
    if (!isScrubbing) {
      currentSimTime += baseStepDays * speedMultiplier * 24 * 60 * 60 * 1000;
      if (currentSimTime >= maxTime) {
        currentSimTime = maxTime;
        stopRaceTimer();
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.innerText = "\u21BB Replay";
      }
      updateRaceFrame();
    }
  }, 50);
}

function toggleRace() {
  if (isPlaying) {
    stopRaceTimer();
  } else {
    if (currentSimTime >= maxTime - 86400000) currentSimTime = minTime;
    isPlaying = true;
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.innerText = "\u23F8 Pause";
    startTimerLoop();
  }
}

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
  setupDraggableModal();
  loadChannelDetails();
});

/* --- SCROLL LISTENER TO SHOW 3-BAR ICON AT TOP RIGHT --- */
window.addEventListener('scroll', () => {
  const squeezedBtn = document.querySelector('.squeezed-3bar-trigger');
  const navBar = document.querySelector('.nav-bar');

  if (squeezedBtn && navBar) {
    const navTop = navBar.getBoundingClientRect().top;
    if (navTop <= 0) {
      squeezedBtn.classList.add('nav-scrolled');
    } else {
      squeezedBtn.classList.remove('nav-scrolled');
    }
  }
});

/* --- FIREBASE CONFIGURATION & REAL-TIME LISTENERS --- */
const firebaseConfig = {
  apiKey: "AIzaSyC2E3LJsCxPsGl3yXE81J1MRB0hFbI0mIg",
  authDomain: "villagantecontentdata.firebaseapp.com",
  projectId: "villagantecontentdata",
  storageBucket: "villagantecontentdata.firebasestorage.app",
  messagingSenderId: "899843775768",
  appId: "1:899843775768:web:3bab141c961435b8f1d26d",
  measurementId: "G-C2RR7S2RJ1"
};

function formatHomepageDate(timestamp) {
  if (!timestamp) return '\u{1F4C5} Just now';
  let date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  if (isNaN(date.getTime())) return '\u{1F4C5} Just now';

  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return `\u{1F4C5} ${formattedDate} \u2022 ${formattedTime}`;
}

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // 1. Real-time Site Title Listener
  db.collection("site_control").doc("config")
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();

        // Dynamic Site Title & Subtitle updates
        if (data.siteTitle) {
          const channelTitleEl = document.querySelector('.channel-title');
          if (channelTitleEl) channelTitleEl.innerText = data.siteTitle;
        }
        if (data.siteSubtitle) {
          const subtitleEl = document.querySelector('.about-subtitle');
          if (subtitleEl) subtitleEl.innerText = data.siteSubtitle;
        }
      }
    });

  // Announcements published from the admin dashboard live in this collection.
  db.collection("announcements").orderBy("createdAt", "desc").limit(1)
    .onSnapshot((snapshot) => {
      const bannerCard = document.getElementById('homepageAnnouncementCard');
      const bannerText = document.getElementById('homepageAnnouncementText');
      const bannerDate = document.getElementById('homepageAnnouncementDate');
      const latestAnnouncement = snapshot.empty ? null : snapshot.docs[0].data();

      if (latestAnnouncement && latestAnnouncement.text && latestAnnouncement.text.trim() !== '') {
        if (bannerText) bannerText.innerText = latestAnnouncement.text;
        if (bannerDate) bannerDate.innerText = formatHomepageDate(latestAnnouncement.createdAt || latestAnnouncement.updatedAt);
        if (bannerCard) bannerCard.style.display = 'block';
      } else if (bannerCard) {
        bannerCard.style.display = 'none';
      }
    }, (err) => console.error('Homepage announcements error:', err));

  // 2. Real-time Friends & Crew Listener
  db.collection("friends").orderBy("createdAt", "asc").onSnapshot((snapshot) => {
    const friendsGrid = document.querySelector('#page-friends .friends-grid');
    if (!friendsGrid) return;

    if (snapshot.empty) {
      friendsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No friends added yet.</p>';
      return;
    }

    friendsGrid.innerHTML = '';
    snapshot.forEach((doc) => {
      const friend = doc.data();
      const card = document.createElement('div');
      card.className = 'friend-card';
      card.innerHTML = `
        <div class="friend-card-thumb-wrapper">
          <img src="${friend.image}" alt="${friend.name}" onerror="this.src='Friends/BlezelRamos.png'">
        </div>
        <div class="friend-card-body">
          <h3 class="friend-card-title">${friend.name}</h3>
          <p class="friend-card-desc">${friend.desc}</p>
        </div>
      `;
      friendsGrid.appendChild(card);
    });
  });
}
