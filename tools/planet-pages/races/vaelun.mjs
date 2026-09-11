// Vaelun — sentient living floaters of the gas giant Othouven Major
// (Meridian). Directly inspired by Sagan & Salpeter's floaters/hunters/
// sinkers. No ships of their own: emissaries travel aboard Coralith ships.

export const VAELUN = {
  slug: 'vaelun',
  name: 'Vaelun',
  plural: 'Vaelun',
  marketTheme: 'vaelun',
  species: {
    summary: [
      "I Vaelun sono galleggiatori viventi grandi fino a un chilometro: sacche di gas colossali, semitrasparenti, che scaldano l'idrogeno interno per restare sospese nella fascia temperata di Othouven Major. Sotto di loro pendono foreste di filamenti che filtrano l'aeroplancton, e lungo i fianchi scorrono bande di colore mutevoli.",
      "Sono senzienti, ma pensano con una lentezza vertiginosa. Parlano con canti a bassissima frequenza che attraversano l'intero pianeta; una singola frase può durare un giorno, un racconto una stagione. Nessuna specie ha mai visto un Vaelun morire di vecchiaia.",
    ],
    traits: [
      "<strong>Galleggiamento:</strong> camere di idrogeno riscaldato; un Vaelun che perde calore sprofonda negli strati bassi e muore schiacciato.",
      "<strong>Nutrimento:</strong> aeroplancton e piccoli «sprofondatori» catturati dai filamenti.",
      "<strong>Predatori:</strong> i Cacciatori, animali veloci e non senzienti che attaccano in branco i Vaelun giovani.",
      "<strong>Emissari:</strong> i Vaelun generano «spore-cantori», piccoli organismi di pochi metri che possono vivere in vasche di gas a bordo delle navi e parlare a nome del loro genitore.",
    ],
  },
  civilization: {
    government: [
      "Non esistono capi tra i Vaelun. Esiste il <strong>Grande Canto</strong>: una conversazione ininterrotta che coinvolge ogni individuo del pianeta, dove una decisione viene presa quando tutte le voci trovano un'armonia comune. È successo, a memoria umana, tre volte.",
      "Verso le altre specie parlano le <strong>spore-cantori</strong>, che portano con sé una parte del Canto. Ma una spora lontana da casa dimentica in fretta: gli ambasciatori Vaelun vengono sostituiti ogni pochi anni.",
    ],
    culture: [
      "<strong>Memoria cantata:</strong> la storia Vaelun è un unico canto che ogni generazione ripete e allunga. Le sue strofe più antiche parlano di stelle che oggi non esistono più.",
      "<strong>Giardini d'aria:</strong> i Vaelun coltivano campi di aeroplancton guidando le correnti con i propri corpi, disegnando spirali visibili dall'orbita.",
      "<strong>Il Cadere:</strong> precipitare negli strati profondi è la morte e insieme il ritorno all'origine. I canti funebri scendono di tono fino a diventare silenzio.",
    ],
    spaceflight: [
      "I Vaelun non hanno mai costruito un'astronave: non possono lasciare il loro pianeta. Da circa <strong>600 anni</strong>, però, le loro spore-cantori viaggiano tra le stelle a bordo delle navi Coralith, in camere di gas pressurizzate.",
      "Per i Vaelun, lo spazio non è un luogo da conquistare ma «un cielo senza vento», e ogni emissario che torna porta nuove strofe al Grande Canto.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Voci giovani che corrono». Il Canto teme i loro progetti di estrazione dell'elio-3: per i Vaelun, pompare gas da Othouven Major è come togliere sangue a un corpo." },
    { race: "Quorai", view: "«Piccoli mari che viaggiano». I pellegrini Quorai portano doni d'acqua pesante e ascoltano il Canto per giorni. Il Canto li ricambia con strofe dedicate." },
    { race: "Velmyr", view: "«Quelli che ascoltano davvero». Il Canto ricorda con gratitudine i trascrittori Velmyr che ne conservano le strofe." },
    { race: "Ythar", view: "«Il coro che respira». Parenti nel pensiero condiviso. Le spore Ythar hanno arricchito i giardini d'aria, e i Vaelun le hanno accolte." },
    { race: "Coralith", view: "«I portatori». Gratitudine profonda per seicento anni di viaggi e protezione — e una tristezza lenta, perché anche la protezione più gentile somiglia a una gabbia." },
    { race: "Kheprani", view: "Il Canto non li ha mai sentiti. Quando le spore-cantori si avvicinano a un nido Kheprani, restano in silenzio." },
    { race: "Nexari", view: "Le macchine sostengono che anche il Voro Nexus canti. Il Canto non sa se crederci, ma da quando i Nexari lo hanno detto una strofa nuova è comparsa, e nessuno sa chi l'abbia iniziata." },
    { race: "Thissari", view: "«Sorelle del vento». Anche i Thissari viaggiano con le vele e cantano le rotte: tra tutte le specie, sono quelle che il Canto capisce meglio." },
    { race: "Ashkaari", view: "Le strofe più antiche del Grande Canto nominano gli Ashkaari, prima della collisione delle galassie. Non dicono cose gentili." },
  ],
  market: {
    title: "Mercato delle Correnti Alte",
    tagline: "Stazione galleggiante di Othouven · scambi mediati dalle spore-cantori",
    filters: [
      { key: 'canti', label: 'Registrazioni del Canto' },
      { key: 'aero', label: 'Aeroflora' },
      { key: 'stazioni', label: 'Tecnologia Galleggiante' },
      { key: 'elio', label: 'Gas Concessi' },
    ],
    products: [
      { cat: 'canti', icon: '🎶', name: "Strofa del Primo Vento", desc: "Registrazione compressa di un frammento del Grande Canto. Per ascoltarla tutta servono nove giorni.", price: "1.800 crediti" },
      { cat: 'canti', icon: '🌀', name: "Pietra d'Eco", desc: "Cristallo Coralith accordato al Canto: vibra quando un Vaelun parla, anche a distanza di sistemi.", price: "4.500 crediti" },
      { cat: 'aero', icon: '🎈', name: "Vescica di Galleggiamento", desc: "Organo donato da un Vaelun giovane: sostiene fino a una tonnellata in qualsiasi atmosfera densa.", price: "12.000 crediti" },
      { cat: 'aero', icon: '☁️', name: "Coltura di Aeroplancton", desc: "Microrganismi che producono ossigeno sospesi nell'aria di un habitat. Profumano di temporale.", price: "650 crediti" },
      { cat: 'stazioni', icon: '🛩', name: "Aerostato da Ricerca «Nuvola»", desc: "Piattaforma abitabile per giganti gassosi, progettata dai Coralith con consulenza del Canto.", price: "96.000 crediti" },
      { cat: 'elio', icon: '🫙', name: "Elio-3 Concesso", desc: "Una quota raccolta solo dai Vaelun morti durante il Cadere. Rarissimo, e l'unico legale.", price: "22.000 crediti" },
    ],
  },
};

export const VAELUN_PLANETS = {
  'tessaly-ii': {
    race: 'vaelun',
    badge: "Mondo del Grande Canto",
    population: "~40.000 adulti · miliardi di spore",
    description: [
      "Othouven Major è un gigante gassoso color crema e rame, e l'unico pianeta noto abitato da una specie senziente che non ha mai toccato una superficie solida. Nella sua fascia temperata, a una pressione simile a quella del mare terrestre, fluttuano i Vaelun.",
      "Attorno alla fascia orbitano le stazioni galleggianti costruite dai Coralith, e un piccolo avamposto di ricerca del Consorzio Terrestre che, ufficialmente, studia l'atmosfera. Ufficiosamente, misura quanto elio-3 ci sia sotto le nubi.",
    ],
    places: [
      { name: "La Fascia del Canto", desc: "Lo strato temperato dove vivono i Vaelun; di notte le loro bande luminose disegnano costellazioni mobili tra le nubi." },
      { name: "Stazione Armonia", desc: "Piattaforma Coralith sospesa, porto delle navi e sede del Mercato delle Correnti Alte." },
      { name: "L'Abisso Caldo", desc: "Gli strati profondi dove i Vaelun scendono a morire. Qui si raccoglie il solo elio-3 concesso." },
    ],
    characters: [
      { name: "Voce-di-Nube-che-Ricorda", desc: "Il Vaelun più grande conosciuto, lungo quasi due chilometri. Le altre voci del Canto si fermano quando parla." },
      { name: "Spora-cantore Iliau", desc: "Emissaria presso gli Anelli di Haldrin da undici anni, più del doppio del normale. Comincia a dimenticare il Canto e a ricordare cose sue." },
      { name: "Comandante Petra Holm", desc: "Direttrice dell'avamposto terrestre. Non vuole estrarre l'elio-3, ma sa che chi verrà dopo di lei lo farà." },
    ],
    legend: "Il Grande Canto contiene una strofa che nessun Vaelun vivente ha iniziato: una sequenza di toni che si ripete identica a quelli captati dai Nexari vicino al Voro Nexus. Le spore-cantori si rifiutano di tradurla.",
    pois: [
      { name: "La Fascia del Canto", lat: 20, lon: 0, desc: "Strato temperato abitato dai Vaelun." },
      { name: "Stazione Armonia", lat: 18, lon: 60, desc: "Piattaforma Coralith sospesa." },
      { name: "L'Abisso Caldo", lat: -40, lon: -120, desc: "Strati profondi del Cadere." },
    ],
  },
};
