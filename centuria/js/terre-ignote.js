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
    title: "L'Inaffondabile",
    date: "",
    summary: "Sul Vecchio Continente spendete gli ultimi averi per comprarvi un passaggio verso le Terre Ignote. Vi imbarcate sulla nave Inaffondabile, al comando del capitano Jeremy Bucket. Il viaggio è lungo; un'enorme creatura marina — metà kraken, metà figura umanoide — vi tende quasi un agguato fatale, ma riuscite a sfuggirle e a scorgere, finalmente, la costa agognata."
  },
  {
    num: 2,
    title: "Porto Nero e Sitryll",
    date: "",
    summary: "Sbarcate al Porto Nero, dove convergono i viaggiatori verso il nuovo mondo, segnato da monoliti di nerite, pietra nera intrisa di magia. Una notte alla locanda del Cardo Appassito vi fa incontrare Gorian, Cyrma, Lafa e Tarion. Poi vi dirigete verso Sitryll, capitale delle Terre ignote: vi accoglie la gilda dei cacciatori e Anne, che cura la vostra iscrizione."
  },
  {
    num: 3,
    title: "L'Iniziato e la foresta",
    date: "",
    summary: "Conoscete Phil Amor, titolare del negozio L'Iniziato, e partite per la missione: debellare i goblin nella foresta a nord-est e recuperare funghi cremisi in una caverna sulla stessa rotta. Abbattete cinque goblin, ma una calata numericamente superiore vi costringe a una ritirata precipitosa."
  },
  {
    num: 4,
    title: "Funghi e visione",
    date: "",
    summary: "Nella caverna trovate i funghi cremisi intorno allo scheletro di un beholder, quasi cresciuti dalle ossa. I vapori donano ad alcuni di voi una visione: gli ultimi istanti del beholder in fuga, abbattuto da una presenza enorme e ancora indefinita, ma di potenza terrificante."
  },
  {
    num: 5,
    title: "Ricompensa e ombre in gilda",
    date: "",
    summary: "Tornati a Sitryll riscuotete la ricompensa. Anne vi affida un incarico dei Consacratori, ordine di ecclesiastici e templari: far luce sulla sorte di cinque inviati in missione. Bardok Drum vi consegna il compito presentandosi come capo della gilda — ma uscendo dalla stanza udite una voce chiedere ad Anne se abbia adempiuto al dovere nel modo giusto. Chi comanda davvero?"
  },
  {
    num: 6,
    title: "Il culto e la sfera",
    date: "",
    summary: "Riprendete la strada verso nord-est, superate la foresta e affrontate il capo goblin che vi aveva scacciati. Il villaggio è un carnaio: abitanti prostrati, quasi succhiati di vita, corpi deturpati. Quattro Consacratori giacciono tra le vittime; le tracce del quinto portano a una chiesa dedicata a Sitryll l'esploratore, omonimo della capitale. Sconfiggete un cultista intento a prelevare parti dei corpi per un rituale e ritrovate l'ultimo consacratore. Una stanza nascosta brulica di rune antimagia attorno a una sfera enigmatica. Un'orda di non morti dal cimitero vi costringe a fuggire verso Sitryll con i corpi, gli indizi e una pagina di scritture ancora illeggibili."
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
          // Switch to scoperte (second tab), filter by this session
          switchView('scoperte', document.querySelectorAll('.view-tab-btn')[1]);
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
