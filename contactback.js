function updateContactParallax(media, offset) {
  media.style.setProperty('--contact-parallax-scroll-y', `${offset * 0.18}px`);
}

function playContactBackground(media) {
  media.muted = true;
  media.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
  const contactMedia = document.querySelector('.contact-parallax-media');
  if (!contactMedia) return;

  playContactBackground(contactMedia);

  window.addEventListener('scroll', () => {
    updateContactParallax(contactMedia, window.pageYOffset);
  }, { passive: true });
});