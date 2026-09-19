function playHomeBackground(video) {
  video.muted = true;
  video.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
  const homeVideo = document.querySelector('.home-parallax-media');
  if (!homeVideo) return;

  playHomeBackground(homeVideo);

  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;
    homeVideo.style.setProperty('--home-parallax-scroll-y', `${scrollPos * 0.18}px`);

    const banner = document.getElementById('parallaxBanner');
    if (banner) {
      banner.style.setProperty('--parallax-scroll-y', `${scrollPos * 0.4}px`);
    }
  }, { passive: true });
});
