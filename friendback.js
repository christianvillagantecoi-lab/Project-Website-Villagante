function updateFriendsParallax(media, offset) {
  media.style.setProperty('--friends-parallax-scroll-y', `${offset * 0.18}px`);
}

function playFriendsBackground(media) {
  media.muted = true;
  media.play().catch(() => {});
}

window.addEventListener('DOMContentLoaded', () => {
  const friendsMedia = document.querySelector('.friends-parallax-media');
  if (!friendsMedia) return;

  playFriendsBackground(friendsMedia);

  window.addEventListener('scroll', () => {
    updateFriendsParallax(friendsMedia, window.pageYOffset);
  }, { passive: true });
});