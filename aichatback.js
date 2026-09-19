function updateAichatboxParallax(media, offset) {
  media.style.setProperty('--aichatbox-parallax-scroll-y', `${offset * 0.18}px`);
}

window.addEventListener('DOMContentLoaded', () => {
  const aichatboxMedia = document.querySelector('.aichatbox-parallax-media');
  if (!aichatboxMedia) return;

  window.addEventListener('scroll', () => {
    updateAichatboxParallax(aichatboxMedia, window.pageYOffset);
  }, { passive: true });
});