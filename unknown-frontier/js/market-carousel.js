// Mercato tab behavior: category filter chips + a horizontal product
// carousel (prev/next arrows, dot indicators). Operates generically on any
// `.market-industrial` block, so a future planet's market tab can reuse
// this file just by copying the same markup with different product cards.
// The blast-door open animation itself is pure CSS (see market-industrial.css)
// and replays automatically whenever the tab-panel goes display:none -> block.

document.querySelectorAll('.market-industrial').forEach((root) => {
  const filterBtns = root.querySelectorAll('.market-filter-btn');
  const track = root.querySelector('.market-carousel-track');
  const cards = Array.from(track.querySelectorAll('.product-card'));
  const prevBtn = root.querySelector('.market-carousel-prev');
  const nextBtn = root.querySelector('.market-carousel-next');
  const dotsEl = root.querySelector('.market-carousel-dots');

  let visibleCards = cards;
  let index = 0;

  function cardStep() {
    if (!visibleCards.length) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    return visibleCards[0].getBoundingClientRect().width + gap;
  }

  function renderDots() {
    dotsEl.innerHTML = '';
    visibleCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'market-carousel-dot';
      dot.setAttribute('aria-label', `Vai al prodotto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });
  }

  function update() {
    const step = cardStep();
    track.style.transform = `translateX(${-index * step}px)`;
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= visibleCards.length - 1;
    dotsEl.querySelectorAll('.market-carousel-dot').forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, visibleCards.length - 1));
    update();
  }

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  function applyFilter(filter) {
    cards.forEach((card) => {
      card.style.display = (filter === 'tutti' || card.dataset.category === filter) ? '' : 'none';
    });
    visibleCards = cards.filter((card) => card.style.display !== 'none');
    index = 0;
    renderDots();
    update();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  window.addEventListener('resize', update);

  renderDots();
  update();
});
