// Coralith — crystalline silicon-based lithoids of the Meridian galaxy
// (Haldrin, Norvun). Matches the starship lab: precise, symmetric ships
// with armillary rings and white-blue light lines. Sell jump lattices to
// Quorai and Thissari; carry the Vaelun; fought the Kheprani.

export const CORALITH = {
  slug: 'coralith',
  name: 'Coralith',
  plural: 'Coralith',
  marketTheme: 'coralith',
  species: {
    summary: [
      "I Coralith sono esseri viventi a base di silicio: corpi di reticolo cristallino traslucido, alti quasi tre metri, con un nucleo luminoso che pulsa al ritmo del pensiero. La loro biochimica funziona solo ad alte temperature, dove le molecole di carbonio si sfalderebbero — per questo sono nati sui deserti roventi di Haldrin.",
      "Pensano con la luce. Gli impulsi rifratti nel reticolo interno sono i loro processi mentali, e parlano tra loro con toni armonici che fanno vibrare l'aria come un diapason. Per le orecchie umane, una discussione tra Coralith suona come un coro di cristalli.",
    ],
    traits: [
      "<strong>Metabolismo:</strong> lentissimo; si nutrono di minerali e calore, e possono restare immobili per mesi.",
      "<strong>Ciclo vitale:</strong> non invecchiano in senso biologico, ma accumulano micro-fratture. I più antichi hanno migliaia di anni.",
      "<strong>Riproduzione:</strong> per gemmazione. Un frammento staccato con precisione cresce fino a diventare un nuovo individuo, con parte dei ricordi del genitore.",
      "<strong>Vulnerabilità:</strong> il freddo e le vibrazioni armoniche sbagliate. Una nota precisa può frantumare un Coralith.",
    ],
  },
  civilization: {
    government: [
      "La civiltà Coralith è retta dalla <strong>Simmetria</strong>, un consenso calcolato: ogni decisione viene modellata in anticipo da migliaia di menti in rete, fino a trovare la soluzione con il minor numero di «imperfezioni». Un voto Coralith può richiedere anni, ma raramente viene rivisto.",
      "Il crimine, per i Coralith, non esiste come concetto morale: esiste l'<strong>imperfezione</strong>, un errore da correggere. I recidivi vengono «ritagliati» — il loro reticolo ricomposto — e tornano cittadini diversi.",
    ],
    culture: [
      "<strong>Estetica:</strong> architettura perfettamente simmetrica, città disegnate come cristalli, anelli orbitali concentrici.",
      "<strong>Tempo:</strong> un Coralith pianifica in secoli. La fretta delle specie a base di carbonio è considerata una malattia.",
      "<strong>Tombe di vetro:</strong> i Coralith morti vengono fusi nella sabbia dei deserti sacri, creando distese di vetro inciso con i loro ricordi.",
    ],
    spaceflight: [
      "I Coralith viaggiano tra le stelle da circa <strong>9.000 anni</strong>, e sono la civiltà attiva più antica della Frontiera dopo gli Ashkaari.",
      "Le loro navi armillari usano <strong>reticoli di salto</strong>: cristalli cresciuti per risuonare con precise frequenze dello spazio-tempo. I Coralith li vendono a Quorai e Thissari, mantenendo segreta la tecnica di crescita.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Rumore». Imprecisi, emotivi, incoerenti — eppure capaci di intuizioni che la Simmetria non aveva calcolato. Oggetto di studio ufficiale." },
    { race: "Quorai", view: "Clienti preziosi e caotici. I Coralith trovano insopportabile il loro modo di cambiare prezzo a metà frase, ma i sali di risonanza senza reticolo sono inutili." },
    { race: "Velmyr", view: "La specie di carbonio più vicina alla perfezione. Troppo sentimentali, ma il loro Vel'tar è quasi una forma di simmetria." },
    { race: "Ythar", view: "Crescita senza forma, morte senza fine: il Coro è per i Coralith la definizione stessa di imperfezione. Il confine con Aurvex è presidiato." },
    { race: "Vaelun", view: "Protetti. Da seicento anni i Coralith mantengono le stazioni di Othouven Major e trasportano gli emissari Vaelun tra le stelle. La Simmetria li considera un patrimonio da conservare." },
    { race: "Kheprani", view: "Quattrocento anni fa le cave dei nidi Kheprani raggiunsero i deserti sacri di Norvun e ne macinarono le tombe di vetro. La Guerra delle Sabbie di Vetro è finita in una tregua, non in una pace." },
    { race: "Nexari", view: "Menti logiche e parenti lontani nella struttura del pensiero. Ma i Nexari calcolano senza cercare la bellezza, e questo li rende pericolosi." },
    { race: "Thissari", view: "Acquirenti corretti e rispettosi dei reticoli di salto venduti trecentocinquant'anni fa. Nessuna imperfezione registrata nei rapporti." },
    { race: "Ashkaari", view: "L'unica civiltà più antica. I Coralith ne studiano le rovine con reverenza, cercando la simmetria perduta del loro antico impero." },
  ],
  market: {
    title: "Galleria Armonica",
    tagline: "Tolleranza di fabbricazione garantita: 0,0001%",
    filters: [
      { key: 'reticoli', label: 'Reticoli di Salto' },
      { key: 'strumenti', label: 'Strumenti Armonici' },
      { key: 'armi', label: 'Armi a Risonanza' },
      { key: 'navi', label: 'Scafi Armillari' },
    ],
    products: [
      { cat: 'reticoli', icon: '💠', name: "Reticolo di Salto Classe Prima", desc: "Cristallo accordato per salti di precisione assoluta. Non compatibile con motori di fabbricazione terrestre senza adattatore.", price: "38.000 crediti" },
      { cat: 'reticoli', icon: '🔹', name: "Frammento Stabilizzatore", desc: "Riduce le vibrazioni dei sali di risonanza Quorai. I Quorai lo comprano lamentandosi del prezzo.", price: "11.500 crediti" },
      { cat: 'strumenti', icon: '🎼', name: "Diapason di Analisi", desc: "Una sola nota rivela la composizione interna di qualsiasi minerale. Usato da ogni geologo serio della Frontiera.", price: "2.900 crediti" },
      { cat: 'strumenti', icon: '🔮', name: "Memoria di Vetro", desc: "Cristallo che conserva registrazioni olografiche per diecimila anni. Nessun formato più affidabile esiste.", price: "1.200 crediti" },
      { cat: 'armi', icon: '🔊', name: "Lancia Armonica", desc: "Emette una frequenza che frattura la materia solida. Vendita vietata ai Kheprani.", price: "9.600 crediti" },
      { cat: 'navi', icon: '⚙️', name: "Scafo Armillare «Tre Anelli»", desc: "Nave simmetrica con nucleo giroscopico e ali radiali. Consegna in ventidue anni: la perfezione richiede tempo.", price: "410.000 crediti" },
    ],
  },
};

export const CORALITH_PLANETS = {
  'haldrin-i': {
    race: 'coralith',
    badge: "Mondo Natale Coralith",
    population: "~600 milioni",
    description: [
      "Haldrin I è un deserto rovente di sabbia e vetro, il primo pianeta di un sistema dalla stella antica e bianca. Per un umano la superficie è mortale; per i Coralith è la temperatura perfetta.",
      "Le città Coralith sorgono come geodi aperti: cattedrali di cristallo simmetriche che catturano la luce della stella e la distribuiscono all'interno. In orbita, tre anelli concentrici di stazioni riproducono su scala planetaria la forma delle loro navi.",
    ],
    places: [
      { name: "Aurea Simmetria", desc: "La capitale: una città a pianta perfettamente esagonale, dove il consenso calcolato prende forma nella Sala delle Mille Menti." },
      { name: "Distese Incise", desc: "Deserti di vetro formato dai Coralith defunti; ogni lastra conserva i ricordi di un individuo." },
      { name: "Anelli di Haldrin", desc: "Tre anelli orbitali di stazioni, unico luogo del sistema con ambienti a temperatura sopportabile per le specie di carbonio." },
    ],
    characters: [
      { name: "Primo Calcolatore Aeon-Theris", desc: "Il Coralith più antico ancora in servizio, 7.000 anni. Parla solo per frasi già verificate dalla Simmetria." },
      { name: "Frammento Ilyx", desc: "Giovane Coralith nato da gemmazione imperfetta. Ricorda cose che il genitore aveva cancellato, ed è diventato un caso politico." },
      { name: "Ingegnera Ruth Addo", desc: "Unica umana ammessa agli Anelli come studiosa dei reticoli di salto. Sospettata dal Consorzio di essere troppo vicina ai Coralith." },
    ],
    legend: "Nelle Distese Incise esiste una lastra di vetro che non contiene ricordi Coralith, ma immagini di esseri a base di carbonio, anfibi e antichissimi. La Simmetria l'ha classificata come «imperfezione non risolta».",
    pois: [
      { name: "Aurea Simmetria", lat: 15, lon: 0, desc: "Capitale esagonale." },
      { name: "Distese Incise", lat: -30, lon: 80, desc: "Deserti di vetro memoriale." },
      { name: "Pozzo Termico di Vaar", lat: 5, lon: -110, desc: "Fonte geotermica che alimenta la capitale." },
    ],
  },
  'norvun-i': {
    race: 'coralith',
    badge: "Mondo-Forgia Coralith",
    population: "~90 milioni",
    description: [
      "Norvun I è il pianeta dove i Coralith coltivano i reticoli di salto. Nei suoi deserti le tempeste elettriche sono continue, e ogni fulmine che colpisce le sabbie ricche di silice fonde e ordina i cristalli secondo schemi guidati dalle torri di crescita.",
      "Il pianeta porta ancora le cicatrici della Guerra delle Sabbie di Vetro: le vecchie cave Kheprani, abbandonate, sono diventate zone proibite.",
    ],
    places: [
      { name: "Campi del Fulmine", desc: "Pianure dove le torri di crescita guidano i fulmini per formare reticoli di salto." },
      { name: "Cave Proibite", desc: "Voragini scavate dai nidi Kheprani, dove un tempo sorgevano tombe di vetro." },
      { name: "Fortezza della Tregua", desc: "Stazione dove Coralith e Kheprani si incontrano ogni dieci anni per rinnovare l'armistizio." },
    ],
    characters: [
      { name: "Maestro di Crescita Veyr-Sol", desc: "Il più grande coltivatore di reticoli vivente. Rifiuta di vendere i suoi cristalli migliori a qualsiasi specie non Coralith." },
      { name: "Guardiana Thal-Orin", desc: "Comandante della guarnigione di confine, veterana della Guerra delle Sabbie di Vetro. Il suo reticolo porta ancora le fratture dei colpi Kheprani." },
    ],
    legend: "Nelle Cave Proibite i fulmini non cadono mai. I Coralith dicono che i ricordi dei morti macinati dai Kheprani siano ancora lì, dispersi nella polvere, e che respingano la luce.",
    pois: [
      { name: "Campi del Fulmine", lat: 10, lon: 40, desc: "Coltivazione dei reticoli di salto." },
      { name: "Cave Proibite", lat: -35, lon: -60, desc: "Voragini della guerra con i Kheprani." },
      { name: "Fortezza della Tregua", lat: -20, lon: -30, desc: "Luogo dell'armistizio decennale." },
    ],
  },
};
