/* ═══════════════════════════════════════════════════════════════
   SESSIONS — allineamento con masonry e timeline
   • Una voce per ogni sessione di gioco che vuoi in timeline (etichetta S1, S2, …).
   • num (numero) deve combaciare con data-sess sulle card (es. num: 3 e data-sess="3").
   • title, summary (e date se la usi) compaiono nei blocchi sessione in Timeline.
   • buildSessionButtons() crea i pulsanti "Sessione N" nei filtri da questo array.
   Dopo aver aggiunto sessione + card, ricarica la pagina (non serve altro JS).
══════════════════════════════════════════════════════════════ */
const SESSIONS = [
  {
    num: 1,
    title: "L'Approdo",
    date: "",   // opzionale, es. "12 Aprile 2025"
    summary: "Il gruppo raggiunge per la prima volta le coste del nuovo continente. L'arrivo non è privo di stranezze: le bussole impazziscono a vista della riva e il porto che li accoglie è più diffidente di quanto ci si aspettasse. I primi contatti con la popolazione locale rivelano una terra piena di segreti appena sotto la superficie."
  },
  {
    num: 2,
    title: "Oltre la Costa",
    date: "",
    summary: "L'esplorazione si spinge verso l'interno e verso sud. Le rovine ciclopiche sulla costa meridionale suggeriscono una civiltà antica e sconosciuta. Di notte, dal sottosuolo della piana settentrionale giunge un suono impossibile da ignorare — e da spiegare."
  }
];

const CAT_LABELS = {
  citta:   'Città & Insediamenti',
  misteri: 'Misteri & Anomalie',
  fazioni: 'Fazioni & Personaggi',
  punti:   'Punti di Interesse'
};

let activeCat  = 'tutti';
let activeSess = 'tutte';

window.addEventListener('DOMContentLoaded', () => {
  updateCounts();
  buildSessionButtons();
  buildTimeline();
});

function updateCounts() {
  const cards = document.querySelectorAll('.discovery-card');
  const c = { tutti:0, citta:0, misteri:0, fazioni:0, punti:0 };
  cards.forEach(card => { c.tutti++; c[card.dataset.cat]++; });
  Object.keys(c).forEach(k => {
    const el = document.getElementById(`cnt-${k}`);
    if (el) el.textContent = `(${c[k]})`;
  });
  document.getElementById('total-count').textContent    = c.tutti;
  document.getElementById('total-sessions').textContent = SESSIONS.length;
}

function buildSessionButtons() {
  const container = document.getElementById('sess-btns');
  SESSIONS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.sess = String(s.num);
    btn.textContent = `Sessione ${s.num}`;
    btn.onclick = () => filterSess(String(s.num), btn);
    container.appendChild(btn);
  });
}

function filterCat(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function filterSess(sess, btn) {
  activeSess = sess;
  document.querySelectorAll('.filter-btn[data-sess]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

/* Mostra/nasconde le card: confronta activeCat e activeSess con data-cat e data-sess.
   Nuove card: stessi attributi delle esistenti; se inventi una categoria nuova,
   servono anche CSS e pulsante filtro (filter-btn) coerenti. */
function applyFilters() {
  const cards = document.querySelectorAll('.discovery-card');
  let visible = 0;
  cards.forEach(card => {
    const ok = (activeCat  === 'tutti'  || card.dataset.cat  === activeCat)
            && (activeSess === 'tutte'  || card.dataset.sess === activeSess);
    card.classList.toggle('hidden', !ok);
    if (ok) visible++;
  });
  document.getElementById('empty-state').classList.toggle('visible', visible === 0);
}

function switchView(view, btn) {
  document.querySelectorAll('.view-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('view-scoperte').style.display = view === 'scoperte' ? 'block' : 'none';
  document.getElementById('view-timeline').style.display = view === 'timeline' ? 'block' : 'none';
}

function buildTimeline() {
  /* Per ogni sessione in SESSIONS (dalla più recente): cerca nel DOM tutte le
     .discovery-card con data-sess uguale a sess.num e genera le righe cliccabili.
     Nessuna lista duplicata: la timeline è sempre derivata da SESSIONS + card HTML. */
  const wrapper = document.getElementById('timeline-wrapper');
  wrapper.innerHTML = '';
  // Most recent first
  [...SESSIONS].reverse().forEach(sess => {
    const cards = [...document.querySelectorAll(`.discovery-card[data-sess="${sess.num}"]`)];
    const dateHtml = sess.date ? `<div class="tl-session-date">${sess.date}</div>` : '';

    const block = document.createElement('div');
    block.className = 'tl-session';
    block.innerHTML = `
      <div class="tl-header">
        <div class="tl-dot">S${sess.num}</div>
        <div>
          <div class="tl-session-label">Sessione ${sess.num}</div>
          <div class="tl-session-title">${sess.title}</div>
          ${dateHtml}
        </div>
      </div>
      <div class="tl-summary">${sess.summary}</div>
      <div class="tl-discoveries" id="tl-disc-${sess.num}"></div>
    `;
    wrapper.appendChild(block);

    const disc = block.querySelector(`#tl-disc-${sess.num}`);
    if (cards.length === 0) {
      disc.innerHTML = `<div class="tl-empty">Nessuna scoperta registrata</div>`;
    } else {
      cards.forEach(card => {
        const cat   = card.dataset.cat;
        const title = card.querySelector('.card-title')?.textContent || '';
        const item  = document.createElement('div');
        item.className = 'tl-discovery-item';
        item.title = 'Mostra nella griglia';
        item.innerHTML = `
          <div class="tl-disc-dot" data-cat="${cat}"></div>
          <div class="tl-disc-content">
            <div class="tl-disc-cat">${CAT_LABELS[cat] || cat}</div>
            <div class="tl-disc-title">${title}</div>
          </div>
          <div class="tl-disc-arrow">→</div>
        `;
        item.onclick = () => {
          // Switch to scoperte, filter by this session
          switchView('scoperte', document.querySelectorAll('.view-tab-btn')[0]);
          filterCat('tutti', document.querySelector('.filter-btn[data-cat="tutti"]'));
          const sessBtn = document.querySelector(`.filter-btn[data-sess="${sess.num}"]`);
          if (sessBtn) filterSess(String(sess.num), sessBtn);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        disc.appendChild(item);
      });
    }
  });
}
