// Shared background-music control for every Unknown Frontier page. Each
// page has its own <audio id="ambient-audio"> (static multipage site, so
// playback doesn't continue across navigation) but the mute choice and
// volume persist via localStorage, so picking them once carries across
// pages as you browse.
const MUTED_KEY = 'uf-audio-muted';
const VOLUME_KEY = 'uf-audio-volume';

function init() {
  const audio = document.getElementById('ambient-audio');
  const toggle = document.getElementById('audio-toggle');
  if (!audio || !toggle) return;

  const savedVolume = parseFloat(localStorage.getItem(VOLUME_KEY));
  audio.volume = Number.isFinite(savedVolume) ? savedVolume : 0.35;
  const userMuted = localStorage.getItem(MUTED_KEY) === 'true';

  // The button itself only opens/closes this popover — the actual
  // play/pause and volume controls live inside it.
  const popover = document.createElement('div');
  popover.className = 'audio-popover';
  popover.innerHTML = `
    <button type="button" class="audio-popover-mute"></button>
    <label class="audio-popover-volume-row">
      <span>Volume</span>
      <input type="range" class="audio-popover-volume" min="0" max="100" step="1">
    </label>
  `;
  toggle.insertAdjacentElement('afterend', popover);

  const muteBtn = popover.querySelector('.audio-popover-mute');
  const volumeSlider = popover.querySelector('.audio-popover-volume');
  volumeSlider.value = String(Math.round(audio.volume * 100));

  function setState(playing) {
    toggle.classList.toggle('is-muted', !playing);
    toggle.setAttribute('aria-pressed', String(!playing));
    muteBtn.textContent = playing ? 'Disattiva musica' : 'Attiva musica';
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
      if (audio.paused && localStorage.getItem(MUTED_KEY) !== 'true') tryPlay();
      document.removeEventListener('pointerdown', resumeOnGesture);
    }, { once: true });
  }

  muteBtn.addEventListener('click', () => {
    if (audio.paused) {
      localStorage.setItem(MUTED_KEY, 'false');
      tryPlay();
    } else {
      audio.pause();
      localStorage.setItem(MUTED_KEY, 'true');
      setState(false);
    }
  });

  volumeSlider.addEventListener('input', () => {
    const volume = Number(volumeSlider.value) / 100;
    audio.volume = volume;
    localStorage.setItem(VOLUME_KEY, String(volume));
  });

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    popover.classList.toggle('is-open');
  });
  document.addEventListener('click', (event) => {
    if (!popover.contains(event.target) && event.target !== toggle) {
      popover.classList.remove('is-open');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
