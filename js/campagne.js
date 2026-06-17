/* ═══════════════════════════════════════════════════════════════
   CAMPAGNE — Sessions e dinamica come terre-ignote.js
   • Una voce per ogni sessione di gioco che vuoi in timeline
   • num (numero) deve combaciare con data-sess sulle card (es. num: 1 e data-sess="1")
   • title, summary (e date se la usi) compaiono nei blocchi sessione in Timeline
   • buildSessionButtons() crea i pulsanti "Sessione N" nei filtri da questo array
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
  },
  {
    num: 7,
    title: "La Distesa dei Non Morti",
    date: "",
    summary: "Fuggiti dagli zombie, tornate al villaggio dei morti: la pietra si sta attivando e le rune — identiche a quelle della stanza segreta — compaiono solo alla luce della luna. Una sembra significare 'morte'. Orme vi conducono nel cuore di una foresta silenziosa, dove ragnatele di ragni giganti bloccano il cammino e occhi nell'oscurità osservano il vostro accampamento con curiosità immobile. All'uscita del bosco, lo scenario che non vi aspettavate: una distesa di non morti disposti in cerchio attorno a un macigno, sopra cui veglia una figura incappucciata con un amuleto dei Consacratori spezzato a metà. Ai suoi piedi, un cerchio interno di creature più grandi e due macchinari da guerra assembrati rozzamente. L'uomo non si muove — una statua? Tornate verso Sitryll con più domande che risposte."
  },
  {
    num: 8,
    title: "L'Assedio di Sitryll",
    date: "",
    summary: "Tornati a Sitryll, trovate Annie, il sacerdote e i consacratori ad aspettarvi con notizie sconvolgenti: la figura incappucciata sul macigno è Padre Xartamas, un consacratore corrotto da un artefatto durante l'ultima spedizione. La follia lo ha convinto che Sitryll nasconda un male da estirpare — e ora guida l'orda contro la città. L'attacco è già in corso: le strade brulicano di non morti. Zavash Kass scende in campo con i suoi poteri mentre il gruppo tenta di raggiungere le armi d'assedio zombie. Uno zombie guardiano cade sotto i vostri colpi, ma il secondo avanza. Il tempo stringe: riuscirete ad armare la balista in tempo?"
  },
  {
    num: 9,
    title: "La Fine dell'Assedio",
    date: "",
    summary: "Prendete il controllo della balista e distruggete la seconda arma d'assedio. Nel mezzo della battaglia, un gruppo di incappucciati apre un portale ovale con un rituale — lo distruggete prima che sia troppo tardi. Zavash Kass affronta Xartamas e lo sconfigge; le ultime parole del consacratore corrotto risuonano come una profezia: «Sentirete ancora parlare di me — la città di Sitryll cadrà, come cadrai tu, Zavash.» L'assedio è finito e la capitale è salva. Nel dopo-guerra emerge che il Generale a capo delle truppe cittadine proviene da Valikor ed è membro del concilio, al pari di Zavash Kass. Le voci per le strade rivelano che il concilio non gode della fiducia di tutti. Alla gilda, una Dragonide Rossa osserva gli avventurieri in silenzio dalla balconata."
  },
  {
    num: 10,
    title: "La Festa in Maschera",
    date: "",
    summary: "Esplorate il mercato di Sitryll: visitate il Sogno dell'Avventuriero, emporio di Lydia Soutart, e Da Tabalion e le sue meraviglie. Anne vi rivela l'identità della Dragonide Rossa: è Luwara Firefist, il vero capo della gilda, ultimamente ritirata dagli affari pubblici. La gilda è stata fondata dai Razorclaw — Anna, Bardok, Luwara, Cecil Madok ed Elaia Windspeaker — poco dopo l'insediamento nelle Terre Ignote, per aiutare cittadini e popolo. Dopo qualche giorno ricevete una lettera: un invito a una festa in maschera del nobile Mobius Teodonius, cacciato dalla Lega di Aurelion per infamia. La festa è affollata e bizzarra — Mobius non nasconde i propri gusti, e la serata è appena cominciata."
  }
];

const CAT_LABELS = {
  citta:    'Città & Insediamenti',
  misteri:  'Misteri & Anomalie',
  fazioni:  'Fazioni & Personaggi',
  punti:    'Punti di Interesse'
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
  const wrapper = document.getElementById('timeline-wrapper');
  wrapper.innerHTML = '';
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
      disc.innerHTML = `<div class="tl-empty">Nessun evento registrato</div>`;
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
          switchView('scoperte', document.querySelectorAll('.view-tab-btn')[1]);
          filterCat('tutti', document.querySelector('.filter-btn[data-cat="tutti"]'));
          const sessBtn = document.querySelector(`.filter-btn[data-sess="${sess.num}"]`);
          if (sessBtn) filterSess(String(sess.num), sessBtn);
          document.querySelectorAll('.discovery-card.highlighted').forEach(c => c.classList.remove('highlighted'));
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('highlighted');
          card.addEventListener('animationend', () => card.classList.remove('highlighted'), { once: true });
        };
        disc.appendChild(item);
      });
    }
  });
}
