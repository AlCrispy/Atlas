// Ythar — bio-shaping collective of the Aurvex galaxy (Drevane, Kaion
// Rift). Matches the starship lab: grown, asymmetric bio-ships with teal/
// violet bioluminescent vents and no visible engines. Their "gift" seeding
// caused the Revaix Cradle disaster referenced in the Quorai file.

export const YTHAR = {
  slug: 'ythar',
  name: 'Ythar',
  plural: 'Ythar',
  marketTheme: 'ythar',
  species: {
    summary: [
      "Un Ythar non è mai davvero solo. Ogni individuo — un corpo alto e sottile, coperto di placche traslucide sotto cui pulsano vene bioluminescenti — è un «nodo» del Coro: una mente condivisa che si propaga attraverso spore e feromoni nell'aria.",
      "Più nodi sono vicini, più il Coro è intelligente. Un Ythar isolato su una nave terrestre è lento, confuso, quasi infantile; mille Ythar in una foresta di Holailis pensano più velocemente di qualsiasi computer.",
    ],
    traits: [
      "<strong>Biochimica:</strong> base carbonio, ma con un sistema di spore simbionti che trasporta memoria e segnali tra gli individui.",
      "<strong>Comunicazione:</strong> luce delle vene per le emozioni, spore per il pensiero. Traduzione umana possibile solo con filtri chimici.",
      "<strong>Ciclo vitale:</strong> i nodi nascono da baccelli coltivati e alla morte vengono assorbiti dal Coro, spesso diventando parte di una nave o di una città viva.",
      "<strong>Plasmatori:</strong> gli Ythar non costruiscono nulla. Coltivano edifici, strumenti e astronavi guidando la crescita di organismi per decenni.",
    ],
  },
  civilization: {
    government: [
      "Non esiste un governo Ythar in senso umano. Esiste il <strong>Coro</strong>, e le sue decisioni emergono come un clima: lentamente, poi tutte insieme. I diplomatici delle altre specie trattano con i <strong>Tessitori</strong>, nodi specializzati che «traducono» la volontà del Coro in qualcosa di comprensibile.",
      "I <strong>Semi</strong> sono nodi addestrati a vivere lontano dal Coro: esploratori, messaggeri e piloti delle navi-seme. Tornano a casa cambiati, e il Coro li riassorbe con cautela.",
    ],
    culture: [
      "<strong>La Semina:</strong> diffondere la vita è l'atto più sacro. Donare spore a un mondo è per gli Ythar ciò che per gli umani è un dono di pace.",
      "<strong>Nessuna morte, solo ritorno:</strong> ciò che muore diventa nutrimento, casa o nave. Le carcasse metalliche delle navi altrui li disturbano profondamente.",
      "<strong>Il Silenzio:</strong> la condizione più temuta è la disconnessione dal Coro; la pena peggiore è l'esilio in una stanza sigillata.",
    ],
    spaceflight: [
      "Gli Ythar viaggiano nello spazio da circa <strong>3.000 anni</strong>. Le loro navi vengono coltivate da semi stellari su Dunathund Major e impiegano decenni a maturare.",
      "Non hanno motori: organi pulsanti chiamati «ventricoli» piegano lo spazio con un processo che nessun'altra specie ha replicato. Una nave Ythar può ammalarsi, guarire e, secondo alcuni rapporti, avere paura.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "Giovani, rumorosi e circondati di metallo morto. Il Coro li trova affascinanti come si trova affascinante un incendio." },
    { race: "Quorai", view: "La ferita di Revaix. Due secoli fa il Coro inviò una nave-seme come dono alle acque dove nascono i Quorai; le spore uccisero una generazione di larve. Gli Ythar offrono doni riparatori ogni anno. I Quorai li distruggono ogni anno." },
    { race: "Velmyr", view: "Un popolo che ama le foreste ma le abita come ospite, non come parte. Rispetto reciproco, molta distanza." },
    { race: "Coralith", view: "«I morti che pensano». Menti di cristallo che non crescono e non marciscono: l'opposto di tutto ciò che il Coro comprende. Il confine con Meridian è teso." },
    { race: "Vaelun", view: "Fratelli del cielo. Il Coro ha cantato con i Vaelun per la prima volta secoli fa, e considera Othouven Major un giardino da proteggere." },
    { race: "Kheprani", view: "Anche loro sono molti in uno, ma sono sordi: il loro nido non canta. La contesa per le giungle di Olouraaik ha già visto navi vive bruciare." },
    { race: "Nexari", view: "Il Silenzio fatto popolo. Il Coro evita i sistemi Nexari e non accetta a bordo nulla che abbiano toccato." },
    { race: "Thissari", view: "Pochi contatti. Il Coro li ricorda come «piume nel vento freddo» e li considera innocui." },
    { race: "Ashkaari", view: "Gli Ythar chiamano le spore della memoria Ashkaari «la nonna del Coro». Pellegrinaggi di nodi raggiungono Kethra II per ascoltarle." },
  ],
  market: {
    title: "Serra del Coro",
    tagline: "Ogni articolo è vivo · nutrire secondo le istruzioni",
    filters: [
      { key: 'semi', label: 'Semi & Innesti' },
      { key: 'navi', label: 'Navi Coltivate' },
      { key: 'simbionti', label: 'Simbionti' },
      { key: 'essenze', label: 'Essenze' },
    ],
    products: [
      { cat: 'semi', icon: '🌱', name: "Seme di Rifugio", desc: "Piantato nel terreno, cresce in tre giorni fino a diventare una cupola abitabile per quattro persone.", price: "6.400 crediti" },
      { cat: 'semi', icon: '🍄', name: "Innesto di Filtraggio", desc: "Fungo che vive nei filtri della tuta e purifica l'aria da spore e tossine. Da nutrire con zuccheri.", price: "980 crediti" },
      { cat: 'navi', icon: '🐛', name: "Larva di Nave «Ossh'Ven»", desc: "Nave giovane per un equipaggio ridotto. Matura in otto anni; nel frattempo va nutrita e rassicurata.", price: "190.000 crediti" },
      { cat: 'navi', icon: '🫀', name: "Ventricolo di Ricambio", desc: "Organo di propulsione per navi Ythar ferite. Deve essere accettato dalla nave, non installato.", price: "74.000 crediti" },
      { cat: 'simbionti', icon: '🪱', name: "Verme Suturatore", desc: "Richiude le ferite cucendole con la propria seta. Inquietante, ma più efficace di qualsiasi kit medico.", price: "1.600 crediti" },
      { cat: 'simbionti', icon: '🦠', name: "Pelle Corazza", desc: "Colonia simbionte che indurisce la pelle dell'ospite in placche. Reversibile, secondo i Tessitori.", price: "7.200 crediti" },
      { cat: 'essenze', icon: '🧴', name: "Spora del Coro", desc: "Un respiro e, per qualche minuto, si sente il pensiero di chi è accanto. Vietata dal Consorzio Terrestre.", price: "3.300 crediti" },
    ],
  },
};

export const YTHAR_PLANETS = {
  'drevane-v': {
    race: 'ythar',
    badge: "Mondo Natale Ythar",
    population: "~6 miliardi di nodi",
    description: [
      "Holailis non è un pianeta abitato dagli Ythar: è un pianeta che, in un certo senso, è gli Ythar. Le foreste sono coltivate da millenni, le città crescono come alveari vegetali e l'intera biosfera è attraversata dalle spore del Coro.",
      "Di notte l'emisfero oscuro pulsa di luce teal e viola, al ritmo del pensiero collettivo. Le navi straniere possono atterrare solo nei «Giardini Esterni», dove le spore sono filtrate e il Coro parla lentamente.",
    ],
    places: [
      { name: "Il Cuore del Coro", desc: "Una foresta-cervello grande come un continente, dove miliardi di nodi pensano insieme. Nessuno straniero vi è mai entrato e tornato uguale." },
      { name: "Giardini Esterni", desc: "Spazioporto coltivato con serre filtranti per specie non Ythar; qui si svolgono tutte le trattative." },
      { name: "Campi del Ritorno", desc: "Dove i nodi morti vengono restituiti alla terra e rinascono come radici, città o navi." },
    ],
    characters: [
      { name: "Tessitrice Ilh'Asseth", desc: "La voce del Coro verso le altre specie. Parla con una gentilezza disarmante e non ha mai dato una risposta diretta." },
      { name: "Seme Varr'Uun", desc: "Esploratore rimasto lontano dal Coro per quarant'anni. Il Coro non riesce più a riassorbirlo, e lui non sa più se vuole." },
      { name: "Dott. Elias Mbeki", desc: "Xenobiologo terrestre residente nei Giardini Esterni. Sostiene di sognare in colori che non esistono." },
    ],
    legend: "Il Coro ricorda un tempo in cui su Holailis c'era un'altra voce, più antica, che cantava sotto la terra. Quando i Tessitori ne parlano, le vene di tutti i nodi vicini si spengono per qualche istante.",
    pois: [
      { name: "Il Cuore del Coro", lat: 5, lon: 90, desc: "Foresta-cervello continentale." },
      { name: "Giardini Esterni", lat: 30, lon: -40, desc: "Spazioporto per stranieri." },
      { name: "Campi del Ritorno", lat: -25, lon: 10, desc: "Luogo della rinascita dei nodi." },
    ],
  },
  'kaion-rift-iv': {
    race: 'ythar',
    badge: "Mondo-Vivaio Ythar",
    population: "~800 milioni di nodi",
    description: [
      "Dunathund Major è il cantiere navale degli Ythar, anche se nessuno vi costruisce nulla. In giungle gigantesche, dentro alberi-matrice alti chilometri, crescono le navi-seme: bozzoli che impiegano decenni a maturare prima di staccarsi e salire in orbita.",
      "Il pianeta è sorvegliato dalle navi più antiche del Coro, ormai troppo vecchie per viaggiare, che orbitano come sentinelle addormentate.",
    ],
    places: [
      { name: "Alberi-Matrice di Dun'Arak", desc: "Foresta dove maturano le navi-seme, ciascuna appesa come un frutto enorme." },
      { name: "Anello delle Sentinelle", desc: "Orbita delle navi anziane, che reagiscono a qualsiasi scafo non annunciato." },
      { name: "Palude del Primo Seme", desc: "Dove crebbe la prima nave Ythar, oggi fossile vivente venerato dal Coro." },
    ],
    characters: [
      { name: "Coltivatrice Oss'Hemel", desc: "Guida la maturazione delle navi. Si dice che conosca per nome ogni bozzolo del pianeta." },
      { name: "La Nave Senza Nome", desc: "Una nave-seme nata «sbagliata», che rifiuta di staccarsi dal suo albero e canta di notte. Il Coro non ha deciso cosa farne." },
    ],
    legend: "La nave-seme che contaminò Revaix Cradle è ancora in orbita attorno a Dunathund Major, sigillata. Il Coro la tiene lì come promemoria — o, sussurrano i Semi, perché nessuno sa come ucciderla.",
    pois: [
      { name: "Alberi-Matrice di Dun'Arak", lat: -12, lon: 55, desc: "Foresta delle navi-seme." },
      { name: "Palude del Primo Seme", lat: 20, lon: -95, desc: "Fossile della prima nave Ythar." },
      { name: "Radura della Partenza", lat: 0, lon: 150, desc: "Dove le navi mature si staccano e salgono in orbita." },
    ],
  },
};
