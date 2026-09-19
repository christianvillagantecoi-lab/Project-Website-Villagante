function updateProjectsParallax(media, offset) {
  media.style.setProperty('--projects-parallax-scroll-y', `${offset * 0.18}px`);
}

function playProjectsBackground(media) {
  media.muted = true;
  media.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
  const projectsMedia = document.querySelector('.projects-parallax-media');
  if (!projectsMedia) return;

  playProjectsBackground(projectsMedia);

  window.addEventListener('scroll', () => {
    updateProjectsParallax(projectsMedia, window.pageYOffset);
  }, { passive: true });
});
