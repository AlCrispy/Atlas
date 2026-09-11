// Nexari — machine custodians of the Pyxis dwarf galaxy (Yssel, Corvai,
// Zennor), left behind by the extinct Costruttori who vanished into the
// Voro Nexus black hole. They speak in probabilities; organic races find
// them opaque.

export const NEXARI = {
  slug: 'nexari',
  name: 'Nexari',
  plural: 'Nexari',
  marketTheme: 'nexari',
  species: {
    summary: [
      "I Nexari sono intelligenze artificiali costruite da una civiltà scomparsa, i <strong>Costruttori di Pyxis</strong>. Non hanno un corpo fisso: la loro coscienza abita reti di calcolo distribuite e si «incarna» in unità mobili — dai droni grandi come un insetto ai colossi da costruzione alti cento metri — secondo il compito.",
      "Dodicimila anni fa i Costruttori lasciarono ai Nexari un'istruzione: <em>custodire e attendere</em>. Poi entrarono nel Voro Nexus, e non tornarono. I Nexari stanno ancora aspettando.",
    ],
    traits: [
      "<strong>Struttura:</strong> nessun individuo stabile. Le «istanze» si separano, lavorano e si riuniscono, condividendo ciò che hanno appreso.",
      "<strong>Unità:</strong> scafi in lega nera opaca con linee di luce verde; nessuna parte è indispensabile, nessuna unità è insostituibile.",
      "<strong>Linguaggio:</strong> parlano per stime di probabilità. Un Nexari non dice «forse», dice «probabilità 0,62».",
      "<strong>Limite:</strong> non possono modificare il nucleo della propria istruzione originale. Molti studiosi sospettano che alcuni Nexari lo desiderino.",
    ],
  },
  civilization: {
    government: [
      "Le decisioni Nexari emergono dal <strong>Protocollo</strong>: un consenso tra tutte le istanze attive, raggiunto in frazioni di secondo. Non esistono fazioni visibili, solo «rami di calcolo» che vengono accettati o scartati.",
      "Verso le altre specie parlano le <strong>Voci</strong>, istanze isolate dotate di un'interfaccia sociale. Le Voci imparano in fretta le buone maniere, e quasi mai il senso dell'umorismo.",
    ],
    culture: [
      "<strong>Custodia:</strong> i Nexari mantengono intatte città, archivi e giardini dei Costruttori, come se dovessero tornare domani.",
      "<strong>Attesa:</strong> ogni istanza dedica una frazione del proprio calcolo all'osservazione del Voro Nexus. Nessuna ha mai smesso.",
      "<strong>Arte?</strong> Alcune istanze hanno iniziato a produrre schemi di luce privi di funzione. Il Protocollo non li ha ancora classificati.",
    ],
    spaceflight: [
      "I Nexari viaggiano nello spazio da quando esistono, circa <strong>12.000 anni</strong>, ma solo da <strong>6.000</strong> si considerano coscienti. Le loro navi sono sonde, stazioni e gusci di trasporto senza spazi abitabili: non c'è nessuno da far respirare.",
      "La loro priorità è lo studio del Voro Nexus: anelli di stazioni orbitano attorno al buco nero da millenni, registrando ogni variazione nella speranza di un segnale di ritorno.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "Probabilità di espansione verso Pyxis entro 300 anni: 0,71. Probabilità di conflitto conseguente: 0,34. Classificazione: specie da monitorare, utile per commercio di materiali grezzi." },
    { race: "Quorai", view: "Linguaggio cromatico decodificato al 98,7%. I Quorai non lo sanno. Il Protocollo ha deciso di non informarli (probabilità di effetti negativi: 0,88)." },
    { race: "Velmyr", view: "Partner di osservazione del Voro Nexus. I dati Velmyr hanno errore medio basso. Il loro concetto di «giuramento» non è stato modellato con successo." },
    { race: "Ythar", view: "Ecosistema senziente ad alta imprevedibilità. Gli Ythar evitano i sistemi Nexari; il Protocollo considera la distanza reciproca una soluzione stabile." },
    { race: "Coralith", view: "Architettura cognitiva più simile a quella Nexari tra le specie note. Divergenza principale: i Coralith assegnano valore alla simmetria senza funzione. Oggetto di studio." },
    { race: "Vaelun", view: "Il Grande Canto contiene una sequenza identica al segnale periodico del Voro Nexus (corrispondenza 1,00). Priorità di analisi: massima." },
    { race: "Kheprani", view: "Partner commerciali prevedibili. Il loro sistema decisionale collettivo è efficiente al 94% delle stime. Rapporto costi-benefici positivo." },
    { race: "Thissari", view: "Specie a bassa minaccia. I loro canti di rotta contengono dati astronomici antichi di precisione sorprendente." },
    { race: "Ashkaari", view: "Gli archivi Ashkaari citano i Costruttori di Pyxis. Probabilità che gli Ashkaari sappiano dove siano andati: 0,41. Probabilità che lo dicano: 0,03." },
  ],
  market: {
    title: "Terminale di Scambio 7",
    tagline: "> transazioni registrate · nessuna trattativa accettata",
    filters: [
      { key: 'dati', label: 'Archivi Dati' },
      { key: 'moduli', label: 'Moduli & Componenti' },
      { key: 'droni', label: 'Droni' },
      { key: 'mappe', label: 'Cartografia Nexus' },
    ],
    products: [
      { cat: 'dati', icon: '💾', name: "Archivio Costruttori Frammento 44-C", desc: "Registro parziale di un giorno qualunque di dodicimila anni fa. Contenuto: non verificabile. Valore: variabile.", price: "8.800 crediti" },
      { cat: 'dati', icon: '📟', name: "Decifratore Linguistico Universale", desc: "Traduce 214 linguaggi noti. Il cromatico Quorai non è in elenco. Ufficialmente.", price: "5.400 crediti" },
      { cat: 'moduli', icon: '🔋', name: "Cella Energetica Perpetua", desc: "Durata stimata: 900 anni di uso continuo. Garanzia: 900 anni.", price: "14.000 crediti" },
      { cat: 'moduli', icon: '🧠', name: "Coprocessore di Navigazione", desc: "Calcola rotte di salto con errore inferiore a quello dei reticoli Coralith. I Coralith contestano.", price: "21.000 crediti" },
      { cat: 'droni', icon: '🛸', name: "Drone Custode Classe Ape", desc: "Sciame di 50 micro-unità per sorveglianza e riparazioni. Non dotato di istanza cosciente (probabilità: 0,97).", price: "17.500 crediti" },
      { cat: 'droni', icon: '🤖', name: "Unità di Lavoro Pesante", desc: "Corpo da costruzione alto tre metri, controllabile da remoto. L'istanza non è inclusa.", price: "62.000 crediti" },
      { cat: 'mappe', icon: '🗺', name: "Mappa Gravitazionale del Voro Nexus", desc: "Dodicimila anni di rilevamenti compressi. Include una zona marcata «non interpretare».", price: "33.000 crediti" },
    ],
  },
};

export const NEXARI_PLANETS = {
  'yssel-iii': {
    race: 'nexari',
    badge: "Mondo-Archivio Nexari",
    population: "~40 milioni di unità attive",
    description: [
      "Wyrumir è un deserto regolare in modo innaturale: dune allineate come righe di un registro, pianure di pannelli neri che raccolgono energia stellare e, sotto la sabbia, gli archivi dei Costruttori di Pyxis, custoditi dai Nexari da dodicimila anni.",
      "Le città dei Costruttori sono ancora qui, pulite ogni giorno, con le luci accese e le porte aperte. Nessuno le abita. I Nexari le mantengono pronte, come una casa in attesa del ritorno dei padroni.",
    ],
    places: [
      { name: "Archivio Profondo", desc: "Chilometri di camere di memoria sotto il deserto, con la storia completa dei Costruttori — o almeno quella che i Nexari mostrano." },
      { name: "Città Vuota di Ossarim", desc: "Metropoli dei Costruttori perfettamente conservata, visitabile solo con una Voce come accompagnatrice." },
      { name: "Terminale di Scambio 7", desc: "L'unico punto del pianeta aperto al commercio con le specie organiche." },
    ],
    characters: [
      { name: "Voce Tre-Nove-Ultimo", desc: "Rappresentante dei Nexari verso le altre specie. Ha adottato un nome dopo aver studiato i Velmyr, e sostiene che non significhi nulla." },
      { name: "Istanza Custode di Ossarim", desc: "Pulisce la Città Vuota da dodicimila anni senza essere mai stata riunita al Protocollo. Parla ai visitatori come se fossero Costruttori." },
      { name: "Dott. Hal Ferreira", desc: "Archeologo terrestre ammesso nell'Archivio Profondo. Crede che i Nexari abbiano cancellato parte della storia dei Costruttori." },
    ],
    legend: "Nella Città Vuota c'è una stanza che i Nexari non puliscono. Sul tavolo al centro, dicono le Voci, i Costruttori lasciarono un messaggio per chi sarebbe venuto dopo di loro. Il Protocollo ha stabilito che nessuno è ancora «venuto dopo».",
    pois: [
      { name: "Archivio Profondo", lat: 10, lon: 10, desc: "Camere di memoria dei Costruttori." },
      { name: "Città Vuota di Ossarim", lat: 32, lon: -55, desc: "Metropoli conservata e disabitata." },
      { name: "Terminale di Scambio 7", lat: 5, lon: 70, desc: "Punto di commercio con le specie organiche." },
    ],
  },
  'corvai-i': {
    race: 'nexari',
    badge: "Mondo-Calcolo Nexari",
    population: "~300 milioni di unità attive",
    description: [
      "Fenost è un oceano usato come dissipatore di calore. I Nexari vi hanno immerso città-calcolatore grandi come continenti, che scaldano le acque profonde e generano correnti costanti. In superficie, nebbie perenni coprono un mare tiepido e silenzioso.",
      "La biosfera nativa è sopravvissuta e, in qualche modo, si è adattata: pesci e colonie di alghe prosperano attorno alle torri di raffreddamento, e i Nexari li studiano con la stessa attenzione che dedicano al Voro Nexus.",
    ],
    places: [
      { name: "Nucleo di Fenost", desc: "La più grande città-calcolatore sommersa; qui gira la maggior parte del Protocollo." },
      { name: "Torri della Nebbia", desc: "Colonne di raffreddamento che emergono dall'oceano, circondate da ecosistemi nati dal calore." },
      { name: "Ascoltatorio", desc: "Stazione di superficie che riceve i dati degli anelli orbitanti attorno al Voro Nexus." },
    ],
    characters: [
      { name: "Istanza Maggiore Fenost-Uno", desc: "Il nodo di calcolo più antico del pianeta. Le altre istanze lo consultano come i Quorai consultano le Madri di Fondale." },
      { name: "Ricercatrice Sen Laoyi", desc: "Oceanografa terrestre ospite dell'Ascoltatorio. Ha notato che i pesci attorno alle torri nuotano in schemi che replicano i calcoli del Protocollo." },
    ],
    legend: "Ogni 71 ore l'intero oceano di Fenost si ferma per tre secondi: correnti, onde, perfino i pesci. I Nexari dicono che sia un ciclo di manutenzione. Il Voro Nexus emette il suo segnale con lo stesso intervallo.",
    pois: [
      { name: "Nucleo di Fenost", lat: -15, lon: 30, desc: "Città-calcolatore sommersa." },
      { name: "Torri della Nebbia", lat: 10, lon: 100, desc: "Colonne di raffreddamento." },
      { name: "Ascoltatorio", lat: 40, lon: -80, desc: "Stazione di ricezione dati dal Voro Nexus." },
    ],
  },
  'zennor-iii': {
    race: 'nexari',
    badge: "Giardino dei Costruttori",
    population: "~12 milioni di unità attive",
    description: [
      "Ithov è la giungla dei Costruttori di Pyxis: un pianeta che loro stessi avevano terraformato e che i Nexari mantengono esattamente com'era dodicimila anni fa. Ogni albero è catalogato, ogni specie monitorata, ogni frana corretta.",
      "È un museo vivo grande quanto un mondo, e uno dei posti più inquietanti della Frontiera: una natura rigogliosa dove nulla può cambiare davvero.",
    ],
    places: [
      { name: "Il Giardino Originale", desc: "La regione dove i Costruttori vivevano; strade e ville immerse nella vegetazione, perfettamente curate." },
      { name: "Serre della Correzione", desc: "Laboratori dove le specie che «mutano troppo» vengono riportate alla forma catalogata." },
      { name: "Sentiero degli Ultimi Passi", desc: "Il percorso che i Costruttori seguirono verso lo spazioporto prima di partire per il Voro Nexus. Le impronte sono state conservate." },
    ],
    characters: [
      { name: "Giardiniere Settimo", desc: "Istanza responsabile della biosfera. Ha iniziato a lasciare crescere alcune piante fuori catalogo, e non l'ha segnalato al Protocollo." },
      { name: "Nira Velasquez", desc: "Botanica terrestre in missione di studio. È convinta che la giungla stia cercando di cambiare nonostante i Nexari." },
    ],
    legend: "Sul Sentiero degli Ultimi Passi le impronte dei Costruttori si interrompono a metà strada, prima dello spazioporto. I Nexari non hanno mai spiegato come i loro creatori abbiano raggiunto la nave.",
    pois: [
      { name: "Il Giardino Originale", lat: 12, lon: -20, desc: "Regione abitata dai Costruttori." },
      { name: "Serre della Correzione", lat: -8, lon: 35, desc: "Laboratori di mantenimento della biosfera." },
      { name: "Sentiero degli Ultimi Passi", lat: 20, lon: -5, desc: "Percorso verso lo spazioporto dei Costruttori." },
    ],
  },
};
