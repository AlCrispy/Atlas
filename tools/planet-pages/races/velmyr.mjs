// Velmyr — humanoid species convergent with (but unrelated to) humans,
// Via Lattea (Kylenne). Matches the starship lab: saucer + twin-nacelle
// explorer, cream/white hull with deep red accents.

export const VELMYR = {
  slug: 'velmyr',
  name: 'Velmyr',
  plural: 'Velmyr',
  marketTheme: 'velmyr',
  species: {
    summary: [
      "I Velmyr sono umanoidi alti in media due metri, con pelle color ardesia attraversata da sottili venature ramate e occhi interamente scuri, senza sclera. A prima vista sembrano umani disegnati da qualcuno che li aveva visti solo di sfuggita — ed è esattamente questo a turbare entrambe le specie.",
      "Si sono evoluti nelle chiome delle foreste di Eldousk, e il loro corpo lo ricorda: arti lunghi, presa fortissima, un senso dell'equilibrio che rende naturale camminare su travi sospese a centinaia di metri d'altezza.",
    ],
    traits: [
      "<strong>Anatomia:</strong> due cuori in serie, sangue ricco di rame dal riflesso bluastro, ossa leggere ma elastiche.",
      "<strong>Ciclo vitale:</strong> maturità a quarant'anni, aspettativa di vita attorno ai 180 anni.",
      "<strong>Sonno segmentato:</strong> dormono in quattro brevi fasi al giorno e restano vigili durante la notte di Eldousk.",
      "<strong>Convergenza:</strong> nessuna parentela genetica con gli umani è mai stata dimostrata, nonostante le somiglianze. Alcuni studiosi Velmyr sospettano un antico intervento esterno.",
    ],
  },
  civilization: {
    government: [
      "La società Velmyr è guidata dall'<strong>Assemblea dei Sette Rami</strong>: sette grandi casate, ciascuna legata a una disciplina — scienza, diplomazia, difesa, costruzione, medicina, memoria e rotta. I seggi si guadagnano con esami e servizio, non per nascita.",
      "Ogni Velmyr adulto presta giuramento al <strong>Vel'tar</strong>, il codice del dovere. Mancare alla parola data non è un reato: è peggio, è una vergogna che segue la famiglia per generazioni.",
    ],
    culture: [
      "<strong>Architettura:</strong> città di pietra bianca e legno vivo intrecciate tra i tronchi degli alberi titanici, collegate da ponti sospesi.",
      "<strong>Musica del silenzio:</strong> composizioni in cui le pause contano più delle note; un concerto Velmyr può sembrare vuoto a orecchie umane.",
      "<strong>Colore rituale:</strong> il rosso è riservato ai giuramenti e ai lutti. Le navi portano bande rosse per ricordare che ogni viaggio è una promessa.",
    ],
    spaceflight: [
      "I Velmyr viaggiano nello spazio da circa <strong>500 anni</strong>. Hanno sviluppato il salto da soli, con un programma durato tre secoli e costato due intere flotte sperimentali.",
      "Il primo contatto con gli umani, sessant'anni fa, è ricordato come «lo Specchio»: due equipaggi che si guardavano attraverso i visori, convinti per ore di trovarsi davanti a un'altra fazione della propria specie.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Lo Specchio». Fascino e disagio in parti uguali: gli umani sembrano Velmyr senza disciplina, capaci di tutto nel bene e nel male. Alleati, sotto stretta osservazione." },
    { race: "Quorai", view: "I contratti più affidabili della Frontiera, se si sa leggere la pelle di chi li firma. I diplomatici Velmyr sono tra i pochi a parlare correntemente il cromatico." },
    { race: "Ythar", view: "Rispetto per la loro scienza della vita, timore per la loro indifferenza ai confini. Ogni nave-seme Ythar entrata nella Via Lattea è stata scortata fuori." },
    { race: "Coralith", view: "Spiriti affini nella precisione. Scambi scientifici regolari, anche se i Coralith trovano i Velmyr «troppo sentimentali»." },
    { race: "Vaelun", view: "Una meraviglia da proteggere. La casata della memoria finanzia da decenni la trascrizione del Grande Canto." },
    { race: "Kheprani", view: "Diffidenza. Un popolo senza individui non può prestare giuramento, e ciò che non giura non può essere creduto." },
    { race: "Nexari", view: "Partner di ricerca sul Voro Nexus e interlocutori opachi. I Velmyr non hanno mai capito se i Nexari collaborino o semplicemente li osservino." },
    { race: "Thissari", view: "Amici antichi. Condividono la passione per la cartografia stellare e un archivio comune delle rotte della galassia di Cygnix." },
    { race: "Ashkaari", view: "I Velmyr sospettano che gli Ashkaari sappiano perché umani e Velmyr si somigliano. Gli Ashkaari rispondono con proverbi." },
  ],
  market: {
    title: "Galleria del Ramo Bianco",
    tagline: "Ogni oggetto è garantito dal Vel'tar del suo artigiano",
    filters: [
      { key: 'strumenti', label: 'Strumenti di Precisione' },
      { key: 'navi', label: 'Scafi' },
      { key: 'vesti', label: 'Vesti & Protezioni' },
      { key: 'arte', label: 'Arte del Silenzio' },
    ],
    products: [
      { cat: 'strumenti', icon: '🔭', name: "Astrolabio di Rotta", desc: "Strumento di navigazione a triangolazione stellare, funziona anche con i sistemi di bordo spenti.", price: "4.200 crediti" },
      { cat: 'strumenti', icon: '🩺', name: "Lama Chirurgica a Due Cuori", desc: "Bisturi a vibrazione calibrato per anatomie diverse; la casata della medicina lo vende anche agli umani.", price: "1.350 crediti" },
      { cat: 'navi', icon: '🛸', name: "Esploratore Classe Veyl", desc: "Sezione a disco, doppia nacella e laboratori di bordo. L'orgoglio della casata della rotta.", price: "265.000 crediti" },
      { cat: 'navi', icon: '🚤', name: "Scialuppa Sospesa", desc: "Veicolo leggero antigravitazionale nato per muoversi tra le chiome di Eldousk.", price: "22.500 crediti" },
      { cat: 'vesti', icon: '🧥', name: "Mantello di Giuramento", desc: "Tessuto bianco con banda rossa, isolante e ignifugo. Indossarlo senza aver giurato è un insulto grave.", price: "2.100 crediti" },
      { cat: 'vesti', icon: '🥋', name: "Armatura del Ramo di Difesa", desc: "Lamine articolate leggere in lega ceramica, silenziose anche in corsa.", price: "5.800 crediti" },
      { cat: 'arte', icon: '🎐', name: "Campana del Silenzio", desc: "Suona una sola nota, poi resta muta per un giorno intero. I Velmyr la usano per meditare.", price: "900 crediti" },
    ],
  },
};

export const VELMYR_PLANETS = {
  'kylenne-v': {
    race: 'velmyr',
    badge: "Mondo Natale Velmyr",
    population: "~1,9 miliardi",
    description: [
      "Eldousk è la patria dei Velmyr: una giungla antica di alberi titanici dove le città non toccano quasi mai il suolo. Da orbita, di notte, le capitali delle sette casate appaiono come costellazioni bianche sospese sopra un mare scuro di foglie.",
      "Il suolo della foresta è considerato terra dei morti e dei predatori: vi scendono solo i cacciatori rituali, i medici in cerca di piante rare e i condannati all'esilio.",
    ],
    places: [
      { name: "Vel'Ossar, la Città dei Sette Rami", desc: "Capitale costruita attorno a sette tronchi colossali, uno per casata, collegati da un anello di ponti bianchi." },
      { name: "Il Suolo Scuro", desc: "Il sottobosco sotto le città, regno di predatori mimetici e luogo delle prove di maturità." },
      { name: "Osservatorio della Prima Rotta", desc: "Dove partì il primo salto Velmyr. Oggi museo e sacrario delle due flotte perdute." },
    ],
    characters: [
      { name: "Alta Custode Irael Vonn", desc: "Portavoce dell'Assemblea dei Sette Rami, 160 anni, ha negoziato il trattato con il Consorzio Terrestre dopo lo Specchio." },
      { name: "Capitano Sareth Kael", desc: "Comandante dell'esploratore Veyl-Ashen, il primo a incontrare una nave umana. Da allora studia la storia terrestre con ossessione." },
      { name: "Nira dei Senza Ramo", desc: "Esiliata per aver infranto un giuramento, vive nel Suolo Scuro e guida chi vuole scendere dove le casate non guardano." },
    ],
    legend: "Nel cuore del Suolo Scuro esisterebbe un albero più antico di tutti gli altri, con incise nella corteccia figure di due specie gemelle che si tengono per mano. Nessuna spedizione ufficiale lo ha mai trovato, e l'Assemblea ne ha vietato la ricerca.",
    pois: [
      { name: "Vel'Ossar", lat: 8, lon: 30, desc: "Capitale dei Sette Rami." },
      { name: "Il Suolo Scuro", lat: -10, lon: 70, desc: "Sottobosco delle prove di maturità." },
      { name: "Osservatorio della Prima Rotta", lat: 42, lon: -50, desc: "Sacrario delle flotte perdute." },
    ],
  },
  'kylenne-iv': {
    race: 'velmyr',
    badge: "Colonia Scientifica Velmyr",
    population: "~35 milioni",
    description: [
      "Mirelloull è un deserto chiaro e luminoso che i Velmyr hanno trasformato nel più grande osservatorio della Via Lattea. Il cielo limpido e l'aria secca offrono condizioni ideali, e la casata della scienza vi ha costruito campi di specchi larghi decine di chilometri.",
      "La colonia è anche un avamposto diplomatico: qui passano le delegazioni verso il territorio del Consorzio, e qui i Velmyr studiano gli umani con la stessa attenzione con cui studiano le stelle.",
    ],
    places: [
      { name: "Specchi di Mirelloull", desc: "Campi di telescopi a specchio che puntano verso il Voro Nexus, in collaborazione con i Nexari." },
      { name: "Città Riflessa", desc: "L'insediamento principale, costruito sotto tende bianche che respingono il calore." },
      { name: "Casa dello Specchio", desc: "Ambasciata e centro studi dedicato all'umanità, con la più grande biblioteca terrestre fuori dalla Via Lattea interna." },
    ],
    characters: [
      { name: "Maestra Astronoma Tiv Oranel", desc: "Dirige gli Specchi. Sostiene che il Voro Nexus emetta segnali periodici e che i Nexari lo sappiano da secoli." },
      { name: "Ambasciatore Daran Veluth", desc: "Rappresentante presso il Consorzio. Parla un italiano coloniale impeccabile e colleziona musica terrestre." },
    ],
    legend: "Un vecchio telescopio abbandonato ai margini del deserto continua a orientarsi da solo verso lo stesso punto del cielo ogni notte. Gli astronomi dicono che punti verso il Sistema Solare.",
    pois: [
      { name: "Specchi di Mirelloull", lat: 25, lon: 10, desc: "Campi di telescopi a specchio." },
      { name: "Città Riflessa", lat: 18, lon: -20, desc: "Insediamento principale." },
      { name: "Casa dello Specchio", lat: 20, lon: -24, desc: "Ambasciata e centro studi sull'umanità." },
    ],
  },
};
