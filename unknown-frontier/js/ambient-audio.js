// Shared background-music control for every Unknown Frontier page. Each
// page has its own <audio id="ambient-audio"> (static multipage site, so
// playback doesn't continue across navigation) but the mute choice
// persists via localStorage, so picking "off" once keeps it off as you
// browse between pages.
const STORAGE_KEY = 'uf-audio-muted';

function init() {
  const audio = document.getElementById('ambient-audio');
  const toggle = document.getElementById('audio-toggle');
  if (!audio || !toggle) return;

  audio.volume = 0.35;
  const userMuted = localStorage.getItem(STORAGE_KEY) === 'true';

  function setState(playing) {
    toggle.classList.toggle('is-muted', !playing);
    toggle.setAttribute('aria-pressed', String(!playing));
  }

  function tryPlay() {
    audio.play().then(() => setState(true)).catch(() => setState(false));
  }

  if (userMuted) {
    setState(false);
  } else {
    tryPlay();
    // Browsers block autoplay with sound until the user interacts with the
    // page — retry once on the first click/tap/keypress, unless they've
    // explicitly muted in the meantime.
    document.addEventListener('pointerdown', function resumeOnGesture() {
      if (audio.paused && localStorage.getItem(STORAGE_KEY) !== 'true') tryPlay();
      document.removeEventListener('pointerdown', resumeOnGesture);
    }, { once: true });
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      localStorage.setItem(STORAGE_KEY, 'false');
      tryPlay();
    } else {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, 'true');
      setState(false);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
