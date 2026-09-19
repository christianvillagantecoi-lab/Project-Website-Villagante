function updateVideosParallax(media, offset) {
  media.style.setProperty('--videos-parallax-scroll-y', `${offset * 0.18}px`);
}

function playVideosBackground(media) {
  media.muted = true;
  media.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
  const videosMedia = document.querySelector('.videos-parallax-media');
  if (!videosMedia) return;

  playVideosBackground(videosMedia);

  window.addEventListener('scroll', () => {
    updateVideosParallax(videosMedia, window.pageYOffset);
  }, { passive: true });
});
