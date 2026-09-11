// Thissari — cold-adapted avian star-sailors of the Cygnix galaxy
// (Talvenor, Novandra, Brythe). Sublight solar-sail arks for millennia,
// jump lattices bought from the Coralith 350 years ago; sell Peraist glass
// to the Quorai.

export const THISSARI = {
  slug: 'thissari',
  name: 'Thissari',
  plural: 'Thissari',
  marketTheme: 'thissari',
  species: {
    summary: [
      "I Thissari sono avianoidi alti e snelli, con ossa cave, un piumaggio fitto bianco e grigio perla e grandi membrane tra le braccia e i fianchi. Non volano davvero, ma nella gravità leggera e nell'aria densa e fredda di Thissos planano per chilometri giù dalle scogliere di ghiaccio.",
      "Hanno occhi enormi adatti alla lunga notte polare e una voce capace di due note contemporaneamente. Tutta la loro memoria collettiva è affidata ai <strong>Canti di Rotta</strong>, che ogni Thissari impara prima ancora di saper leggere.",
    ],
    traits: [
      "<strong>Clima:</strong> a loro agio fino a −60 °C; sopra i 20 °C soffrono come un umano nel deserto.",
      "<strong>Ciclo vitale:</strong> depongono uova in covate comuni; maturità a trent'anni, vita fino a 300.",
      "<strong>Orientamento:</strong> percepiscono i campi magnetici, e riconoscono le stelle a occhio nudo con una precisione da strumento.",
      "<strong>Muta:</strong> ogni pochi anni cambiano completamente il piumaggio; il colore delle nuove piume segna l'età e il rango nello stormo.",
    ],
  },
  civilization: {
    government: [
      "I Thissari vivono in <strong>Stormi</strong>, clan nomadi che si spostano seguendo stagioni e rotte. Il <strong>Consiglio degli Stormi</strong> si riunisce su Thissos una volta ogni ciclo migratorio; la guida passa a rotazione allo stormo che ha compiuto il viaggio più lungo.",
      "Ogni stormo ha una <strong>Guida di Rotta</strong>, l'anziano che conosce più Canti. Contraddire una Guida su una rotta è impensabile; contraddirla su tutto il resto è considerato sano.",
    ],
    culture: [
      "<strong>Canti di Rotta:</strong> poemi lunghissimi che codificano posizioni stellari, venti e distanze. Un Thissari che dimentica un verso può mandare fuori rotta un'arca.",
      "<strong>Vetro:</strong> il vetro soffiato è la loro arte principale — finestre, vele solari, strumenti. Il vetro di Peraist è venduto in tutta la Frontiera.",
      "<strong>Ospitalità del freddo:</strong> a un ospite si offre il posto più caldo del nido. Per un umano, significa comunque dormire sotto zero.",
    ],
    spaceflight: [
      "I Thissari hanno lasciato il loro pianeta circa <strong>2.200 anni fa</strong> a bordo delle <strong>Arche di Vento</strong>: navi generazionali spinte da vele solari larghe centinaia di chilometri, che impiegavano secoli a raggiungere i sistemi vicini. Così hanno colonizzato Cygnix, un volo lento alla volta.",
      "Solo <strong>350 anni fa</strong> hanno acquistato dai Coralith i primi reticoli di salto. Molti stormi tradizionalisti continuano a viaggiare a vela, sostenendo che una rotta raggiunta in un istante non entra nei Canti.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Piccoli caldi». Simpatici, curiosi, sempre di fretta. Gli ingegneri umani adorano le vele solari Thissari, e i Thissari adorano vedere gli umani provare a costruirle." },
    { race: "Quorai", view: "Rapporti cordiali e distanti: i Thissari vendono vetro di Peraist e comprano acqua pesante. Nessuno dei due popoli sopporterebbe il clima dell'altro per più di un'ora." },
    { race: "Velmyr", view: "Amici antichi. Condividono l'archivio delle rotte di Cygnix e una passione quasi religiosa per le mappe stellari." },
    { race: "Ythar", view: "Pochi contatti. I Canti li ricordano come «foreste che volano» e raccomandano di non accettare i loro semi." },
    { race: "Coralith", view: "Rispetto e un debito: i reticoli di salto hanno cambiato la civiltà Thissari in una generazione. Alcuni stormi non l'hanno mai perdonato." },
    { race: "Vaelun", view: "«Fratelli del vento». I Thissari e i Vaelun si capiscono senza traduttori: entrambi cantano per ricordare. Uno stormo intero vive in pellegrinaggio permanente attorno a Othouven Major." },
    { race: "Kheprani", view: "I Thissari non capiscono perché i Kheprani si agitino al loro passaggio. I Canti più vecchi, però, parlano di «nidi d'insetti» sui mondi caldi dove gli antenati cacciavano." },
    { race: "Nexari", view: "Le macchine chiedono spesso di registrare i Canti di Rotta. I Thissari acconsentono, ma cantano solo le versioni «per ospiti»." },
    { race: "Ashkaari", view: "I Canti più antichi parlano di una «luce verde caduta dal cielo» sulle nevi di Thissos prima della prima migrazione. I Thissari sospettano che fosse Ashkaari." },
  ],
  market: {
    title: "Bazar delle Rotte",
    tagline: "Stormo di Nevealta · si accettano crediti, vetro e buoni canti",
    filters: [
      { key: 'vele', label: 'Vele & Scafi' },
      { key: 'vetro', label: 'Vetro di Peraist' },
      { key: 'vesti', label: 'Piumaggi & Vesti' },
      { key: 'mappe', label: 'Canti di Rotta' },
    ],
    products: [
      { cat: 'vele', icon: '⛵', name: "Vela Solare da Scialuppa", desc: "Membrana di vetro filato larga due chilometri, ripiegabile in una cassa. Nessun carburante, molta pazienza.", price: "68.000 crediti" },
      { cat: 'vele', icon: '🪁', name: "Aliante da Scogliera", desc: "Ali rigide per planare nelle atmosfere dense e fredde. Consigliato solo a chi pesa poco.", price: "4.100 crediti" },
      { cat: 'vetro', icon: '🔍', name: "Lente di Peraist", desc: "Vetro ottico senza difetti, soffiato a mano. I telescopi Velmyr ne usano migliaia.", price: "2.600 crediti" },
      { cat: 'vetro', icon: '🏮', name: "Lanterna del Freddo", desc: "Vetro che assorbe luce di giorno e la restituisce per tutta la notte polare.", price: "380 crediti" },
      { cat: 'vesti', icon: '🧣', name: "Mantello di Piume di Muta", desc: "Tessuto con piume cadute dopo la muta, caldo fino a −70 °C. Donarlo è segno di grande amicizia.", price: "1.700 crediti" },
      { cat: 'vesti', icon: '🥶', name: "Tuta da Nido per Ospiti Caldi", desc: "Termica e imbottita, pensata per i visitatori che trovano «tiepido» un nido Thissari.", price: "950 crediti" },
      { cat: 'mappe', icon: '📜', name: "Canto di Rotta per Ospiti", desc: "Un poema navigabile verso tre sistemi di Cygnix, con traduzione in coordinate standard. Versione ufficiale, quindi incompleta.", price: "5.200 crediti" },
    ],
  },
};

export const THISSARI_PLANETS = {
  'talvenor-iii': {
    race: 'thissari',
    badge: "Mondo Natale Thissari",
    population: "~420 milioni",
    description: [
      "Thissos è un mondo di ghiaccio azzurro, scogliere alte chilometri e venti costanti. Qui i Thissari si sono evoluti planando tra le pareti gelate, e qui tornano gli Stormi al termine di ogni ciclo migratorio.",
      "I nidi-città sono scavati nelle scogliere, con grandi finestre di vetro che catturano la luce pallida della stella. Nella lunga notte polare, le aurore illuminano i voli rituali degli Stormi che rientrano.",
    ],
    places: [
      { name: "Nevealta", desc: "La grande città-nido scolpita nella scogliera più alta del pianeta, sede del Consiglio degli Stormi." },
      { name: "Scogliera del Primo Volo", desc: "Da dove, secondo i Canti, il primo Thissari si lanciò nel vento. Ogni giovane deve planare da qui una volta." },
      { name: "Porto delle Arche", desc: "Cantiere orbitale dove riposano le Arche di Vento storiche, ancora in grado di spiegare le vele." },
    ],
    characters: [
      { name: "Guida di Rotta Ysveth", desc: "L'anziana che conosce più Canti di qualsiasi Thissari vivente. Ha 290 anni e ricorda l'arrivo dei primi reticoli Coralith." },
      { name: "Capitano Oril Bianconeve", desc: "Comandante di un'Arca di Vento tradizionale; si rifiuta di usare il salto e impiega cinquant'anni per ogni viaggio." },
      { name: "Linh Aldana", desc: "Linguista terrestre accolta nello stormo di Nevealta, la prima umana ad aver imparato un Canto intero. Ha perso due dita per il freddo, e dice che ne è valsa la pena." },
    ],
    legend: "Sotto i ghiacci di Nevealta, i Canti parlano di una «luce verde» caduta dal cielo prima della prima migrazione. Una spedizione recente ha trovato, a otto chilometri di profondità, un oggetto che emette esattamente quel colore.",
    pois: [
      { name: "Nevealta", lat: 55, lon: 20, desc: "Città-nido del Consiglio degli Stormi." },
      { name: "Scogliera del Primo Volo", lat: 48, lon: 40, desc: "Luogo del volo rituale dei giovani." },
      { name: "Luce Sotto il Ghiaccio", lat: 60, lon: -10, desc: "Oggetto luminoso sepolto nella calotta." },
    ],
  },
  'novandra-iii': {
    race: 'thissari',
    badge: "Colonia degli Stormi",
    population: "~60 milioni",
    description: [
      "Torilliven è stata la prima colonia raggiunta da un'Arca di Vento, dopo un viaggio di duecentotrenta anni. Più freddo e più buio di Thissos, è il pianeta preferito dagli stormi tradizionalisti, che vi hanno costruito città di vetro sospese sui crepacci.",
      "La colonia vive di pesca negli oceani sotto la crosta, raggiunti attraverso pozzi scavati a mano nel corso dei secoli.",
    ],
    places: [
      { name: "Arca Radicata", desc: "La prima Arca di Vento, atterrata e trasformata in città. Le sue vele sono ancora stese sul ghiaccio come un lago di vetro." },
      { name: "Pozzi di Pesca", desc: "Condotti profondi fino all'oceano sotterraneo, dove i pescatori scendono appesi a funi di vetro filato." },
      { name: "Crepaccio dei Canti", desc: "Frattura dove l'eco moltiplica la voce; qui gli stormi insegnano i Canti ai giovani." },
    ],
    characters: [
      { name: "Anziana Pescatrice Kiv", desc: "Scende nei Pozzi da ottant'anni e dice di conoscere per nome le creature dell'oceano nero." },
      { name: "Stormo-guida Tessar", desc: "Leader dei tradizionalisti, contrario ai reticoli di salto e al commercio con le altre specie." },
    ],
    legend: "Nei Pozzi di Pesca più profondi, le funi tornano su a volte annodate in modi che nessun Thissari sa fare. I pescatori lasciano in cambio un verso di Canto inciso nel vetro.",
    pois: [
      { name: "Arca Radicata", lat: 35, lon: -30, desc: "Prima Arca di Vento trasformata in città." },
      { name: "Pozzi di Pesca", lat: 30, lon: 15, desc: "Condotti verso l'oceano sotterraneo." },
      { name: "Crepaccio dei Canti", lat: 40, lon: 75, desc: "Luogo di insegnamento dei Canti." },
    ],
  },
  'talvenor-ii': {
    race: 'thissari',
    badge: "Colonia Vetraria Thissari",
    population: "~25 milioni",
    description: [
      "Peraist è un deserto troppo caldo per i Thissari, e proprio per questo è diventato la loro fornace. Le sabbie di silice purissima e il calore della stella permettono di produrre il vetro più limpido della Frontiera.",
      "I vetrai lavorano solo di notte, protetti da tute refrigerate, e passano il giorno in città sotterranee raffreddate. Chi serve a Peraist lo fa per pochi anni, e torna su Thissos con piume bruciate e una fortuna.",
    ],
    places: [
      { name: "Fornaci Notturne", desc: "Distese di specchi che concentrano la luce della stella per fondere la sabbia; di notte i vetrai soffiano il vetro sotto le stelle." },
      { name: "Città Fresca", desc: "Insediamento sotterraneo con ghiaccio importato da Thissos per mantenere le camere sotto zero." },
      { name: "Molo del Vetro", desc: "Spazioporto da cui partono i carichi verso Quovar e verso i telescopi Velmyr." },
    ],
    characters: [
      { name: "Maestra Vetraia Aelis", desc: "La più grande soffiatrice di vele solari vivente. Rifiuta di lavorare di giorno anche con le tute migliori." },
      { name: "Mercante Quorai Seth-Ulam", desc: "Rappresentante del Concordato, chiuso in una cupola allagata. Si lamenta del caldo quanto i Thissari." },
    ],
    legend: "Una lastra di vetro antico, trovata nella sabbia prima dell'arrivo dei Thissari, mostra riflessi di un paesaggio di ghiaccio sconosciuto. I vetrai dicono che cambi immagine a ogni inverno di Thissos.",
    pois: [
      { name: "Fornaci Notturne", lat: 5, lon: 25, desc: "Campi di specchi per la fusione del vetro." },
      { name: "Città Fresca", lat: 12, lon: 40, desc: "Insediamento sotterraneo refrigerato." },
      { name: "Molo del Vetro", lat: -10, lon: -60, desc: "Spazioporto commerciale." },
    ],
  },
  'brythe-iii': {
    race: 'thissari',
    badge: "Cantiere delle Vele Thissari",
    population: "~9 milioni",
    description: [
      "Yolomiraedor è un deserto d'alta quota, con un'atmosfera così sottile che i cieli restano neri anche di giorno. I Thissari lo hanno scelto come cantiere per le vele solari: la bassa gravità e l'aria rarefatta permettono di stendere membrane larghe chilometri prima di lanciarle in orbita.",
      "Il pianeta ospita anche il più grande osservatorio Thissari, dove le Guide di Rotta verificano i Canti confrontandoli con le stelle vere.",
    ],
    places: [
      { name: "Distese delle Vele", desc: "Pianure dove le vele vengono stese e controllate, lucenti come laghi d'argento sotto il cielo nero." },
      { name: "Osservatorio dei Canti", desc: "Torre-telescopio dove ogni verso di rotta viene confrontato con il cielo reale." },
      { name: "Catapulta di Brythe", desc: "Anello di lancio elettromagnetico che porta in orbita le vele ripiegate." },
    ],
    characters: [
      { name: "Guida Astronoma Merrow", desc: "Ha scoperto tre errori nei Canti antichi e ha scatenato un dibattito che dura da vent'anni." },
      { name: "Ingegnere Velmyr Aran Thel", desc: "Consulente della catapulta, uno dei tanti Velmyr che lavorano nei cantieri di Cygnix." },
    ],
    legend: "Uno dei tre errori trovati nei Canti antichi non è un errore: indica una stella che non esiste più, esplosa migliaia di anni fa. Ma il verso che la nomina è stato composto, secondo i Canti stessi, dopo l'esplosione.",
    pois: [
      { name: "Distese delle Vele", lat: 20, lon: 60, desc: "Pianure di stesura delle vele solari." },
      { name: "Osservatorio dei Canti", lat: 28, lon: -10, desc: "Verifica astronomica dei Canti di Rotta." },
      { name: "Catapulta di Brythe", lat: 0, lon: 120, desc: "Anello di lancio orbitale." },
    ],
  },
};
