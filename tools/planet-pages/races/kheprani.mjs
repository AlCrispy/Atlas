// Kheprani — eusocial arthropod hive civilization of the Corvantis galaxy
// (Ninhara, Estryn). Termite-mound arcologies, leafcutter-style fungus
// farms. Rivals of the Quorai (resonance salts) and old enemies of the
// Coralith (War of the Glass Sands). Emissary Kh'tessek appears on the
// Quorai world Wexioraaess.

export const KHEPRANI = {
  slug: 'kheprani',
  name: 'Kheprani',
  plural: 'Kheprani',
  marketTheme: 'kheprani',
  species: {
    summary: [
      "I Kheprani sono artropodi a sei arti, con carapace iridescente dai riflessi bronzo e verde, occhi composti e antenne piumate che leggono gli odori con una precisione impossibile per qualsiasi strumento umano. Un operaio è grande quanto un cane da slitta; una Madre-Pozzo può superare i venti metri.",
      "Ogni Kheprani è intelligente, ma nessuno è davvero un individuo. L'«odore di nido» — una miscela di feromoni prodotta dalle Madri — lega i membri di una colonia in un'unica volontà. Un Kheprani separato dal suo nido per troppo tempo smette di mangiare.",
    ],
    traits: [
      "<strong>Caste:</strong> Madri-Pozzo (riproduzione e comando), Architetti, Operai, Guerrieri ed Emissari. La casta è decisa dalla dieta delle larve.",
      "<strong>Resistenza:</strong> carapace capace di sopportare temperature desertiche e pressioni elevate; possono restare settimane senz'acqua.",
      "<strong>Comunicazione:</strong> feromoni per il nido, stridulazioni ritmiche per le altre specie. I traduttori umani usano sintetizzatori chimici.",
      "<strong>Emissari:</strong> sterili e con un odore di nido attenuato, sono i Kheprani più simili a individui. Molti nidi li considerano necessari e un po' malati.",
    ],
  },
  civilization: {
    government: [
      "Il potere appartiene al <strong>Nido Supremo</strong>, il consiglio delle Madri-Pozzo più antiche dei tre mondi. Le decisioni non vengono discusse: vengono «annusate», finché un unico odore di consenso si diffonde in tutte le colonie.",
      "Verso l'esterno parlano gli <strong>Emissari</strong>. Commerciano, negoziano e spiano, e sono gli unici Kheprani capaci di mentire — perché sono gli unici a cui il nido lo permette.",
    ],
    culture: [
      "<strong>Arcologie-termitaio:</strong> torri di sabbia cementata alte chilometri, con camini che raffreddano milioni di camere. Da orbita sembrano foreste di stalagmiti.",
      "<strong>Coltivazione:</strong> i Kheprani non cacciano: allevano funghi nutritivi in immense camere umide, alimentate con vegetali raccolti sui mondi giungla.",
      "<strong>Il Nido non dimentica:</strong> ogni offesa subita viene registrata nell'odore dei tunnel commemorativi, e respirata dalle nuove generazioni.",
    ],
    spaceflight: [
      "I Kheprani viaggiano nello spazio da circa <strong>900 anni</strong>. Le loro navi-alveare, costruite in chitina cementata, sono lente e colossali: colonie intere che migrano tra le stelle con milioni di membri a bordo.",
      "Il salto Kheprani è rudimentale e costoso, e dipende da sali di risonanza estratti su Gravern Expanse. Per questo le loro rotte si scontrano con quelle dei Quorai.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Nidi di uno». Ogni umano è una colonia con una sola regina, e ogni regina vuole qualcosa di diverso. Clienti eccellenti, alleati impossibili." },
    { race: "Quorai", view: "Concorrenti per il sale di risonanza. I convogli si scontrano da decenni sulle rotte tra Ninhara e Quovar. Il Nido Supremo li rispetta come si rispetta un nido rivale." },
    { race: "Velmyr", view: "I Velmyr non si fidano del Nido, e il Nido lo annusa. Rapporti freddi e formalmente corretti." },
    { race: "Ythar", view: "Un coro che vuole piantare spore nelle camere dei funghi. Due navi-seme Ythar sono state bruciate nei cieli di Olouraaik: il Nido non chiede scusa per difendere il cibo." },
    { race: "Coralith", view: "La Guerra delle Sabbie di Vetro. I Kheprani scavavano sabbie ricche di silicio; i Coralith dicono che fossero tombe. L'odore della guerra è ancora nei tunnel commemorativi." },
    { race: "Vaelun", view: "Troppo lontani per essere nemici, troppo lenti per essere capiti. Il Nido non ha mai trovato un loro odore." },
    { race: "Nexari", view: "Partner utili. Le macchine non hanno odore: non si possono ingannare e non ingannano. Il Nido compra da loro componenti e cartografie." },
    { race: "Thissari", view: "Le leggende Kheprani più antiche parlano di predatori alati che scendevano sui nidi. I Thissari non ne hanno colpa, ma gli operai si agitano quando li vedono." },
    { race: "Ashkaari", view: "Rovine da scavare. Gli Emissari comprano mappe Ashkaari, e i nidi mandano squadre a svuotare ciò che le mappe indicano." },
  ],
  market: {
    title: "Camere di Scambio del Nido",
    tagline: "Emissario incaricato: Kh'vorrith · pagamento in crediti o sale",
    filters: [
      { key: 'armi', label: 'Armi del Nido' },
      { key: 'costrutti', label: 'Costrutti in Chitina' },
      { key: 'funghi', label: 'Coltivazioni' },
      { key: 'feromoni', label: 'Feromoni' },
    ],
    products: [
      { cat: 'armi', icon: '🦂', name: "Pungiglione da Guerra", desc: "Lancia in chitina con serbatoio di veleno paralizzante di casta guerriera. Leggerissima, durissima.", price: "2.200 crediti" },
      { cat: 'armi', icon: '🪲', name: "Scudo-Carapace", desc: "Placca ricavata da una muta di guerriero adulto. Ferma i proiettili cinetici standard.", price: "3.400 crediti" },
      { cat: 'costrutti', icon: '🏺', name: "Cemento di Nido", desc: "Pasta biologica che indurisce in un'ora come roccia. Usata da ogni colono che deve costruire in fretta.", price: "480 crediti / fusto" },
      { cat: 'costrutti', icon: '🐜', name: "Sciame Operaio in Affitto", desc: "Un migliaio di operai per trenta giorni, con Architetto incluso. Costruiscono qualsiasi cosa, a modo loro.", price: "58.000 crediti" },
      { cat: 'funghi', icon: '🍄', name: "Fungo Nutriente di Gravern", desc: "Una razione basta per tre giorni. Il sapore è stato descritto come «cantina bagnata».", price: "35 crediti" },
      { cat: 'feromoni', icon: '🧪', name: "Odore di Tregua", desc: "Fiala che rende un non-Kheprani «tollerato» da qualsiasi nido per un giorno. Da non confondere con l'Odore di Preda.", price: "2.700 crediti" },
      { cat: 'feromoni', icon: '⚗️', name: "Richiamo di Operaio", desc: "Feromone che attira e rende docili gli insetti sociali di quasi ogni mondo. Vietato in tre sistemi.", price: "1.900 crediti" },
    ],
  },
};

export const KHEPRANI_PLANETS = {
  'ninhara-ii': {
    race: 'kheprani',
    badge: "Mondo Natale Kheprani",
    population: "~11 miliardi",
    description: [
      "Ninhara II è il nido originario dei Kheprani: un deserto ocra coperto da foreste di torri-termitaio alte fino a tre chilometri. Ogni torre è una città, e sotto la sabbia le gallerie si estendono per profondità che nessuna mappa straniera conosce.",
      "Il clima torrido è regolato dai camini delle arcologie, che nelle ore più calde emettono colonne di vapore visibili dall'orbita. Nelle profondità, attorno ai Pozzi, vivono le Madri del Nido Supremo.",
    ],
    places: [
      { name: "Il Nido Supremo", desc: "Il sistema di camere più profondo del pianeta, dove si radunano le Madri-Pozzo più antiche. Nessuno straniero lo ha mai visto." },
      { name: "Torre degli Emissari", desc: "L'unica arcologia aperta alle altre specie, con camere a odore neutro e un piccolo spazioporto." },
      { name: "Tunnel della Memoria", desc: "Gallerie commemorative dove l'odore delle guerre passate viene respirato dalle larve." },
    ],
    characters: [
      { name: "Madre-Pozzo Vashkarri", desc: "La più antica del Nido Supremo, ha guidato la tregua con i Coralith. Non ha mai lasciato la sua camera in trecento anni." },
      { name: "Emissario Kh'vorrith", desc: "Capo degli Emissari. Affabile, curioso, spaventosamente bravo a capire cosa vuole un umano prima che lo dica." },
      { name: "Architetto Tzik-Arr", desc: "Progettista delle nuove navi-alveare. Sostiene che il Nido debba espandersi prima che lo facciano i Terrestri." },
    ],
    legend: "Sotto il Nido Supremo, dicono gli Emissari quando credono di non essere ascoltati, esiste una camera sigillata con un odore che nessun Kheprani vivente riconosce. Le Madri la chiamano «il nido prima del Nido».",
    pois: [
      { name: "Il Nido Supremo", lat: 0, lon: 20, desc: "Camere delle Madri-Pozzo." },
      { name: "Torre degli Emissari", lat: 22, lon: -35, desc: "Arcologia aperta agli stranieri." },
      { name: "Foresta di Torri di Skarr", lat: -18, lon: 110, desc: "La più grande concentrazione di arcologie." },
    ],
  },
  'ninhara-iii': {
    race: 'kheprani',
    badge: "Mondo-Cava Kheprani",
    population: "~2,8 miliardi",
    description: [
      "Gravern Expanse è una distesa sconfinata di cave. I Kheprani lo scavano da secoli per estrarre sali di risonanza e silicati, e la superficie è ormai un labirinto di voragini, terrazze e colline di detriti.",
      "È un pianeta di lavoro e di guerra: le rotte dei convogli partono da qui, ed è qui che le navi Quorai tentano periodicamente di intercettarle.",
    ],
    places: [
      { name: "La Grande Voragine", desc: "Cava larga duecento chilometri, scavata in otto secoli da miliardi di operai." },
      { name: "Moli dei Convogli", desc: "Torri di lancio da cui partono le navi-alveare cariche di sale." },
      { name: "Campo delle Mute", desc: "Distesa di carapaci abbandonati dopo la muta, riciclati come materiale da costruzione." },
    ],
    characters: [
      { name: "Guerriera-Capo Ixxa", desc: "Comanda le scorte dei convogli. Ha affondato più navi Quorai di chiunque altro, e il Concordato ha messo una taglia sul suo carapace." },
      { name: "Sovrintendente Mottik", desc: "Architetto delle cave. Ha scavato così a fondo da trovare strutture che non ha ancora comunicato al Nido Supremo." },
    ],
    legend: "In fondo alla Grande Voragine gli operai hanno toccato qualcosa di liscio, freddo e artificiale. Il Nido ha sigillato il pozzo, e gli operai che l'avevano visto sono stati trasferiti — tutti, e tutti su navi diverse.",
    pois: [
      { name: "La Grande Voragine", lat: -10, lon: 45, desc: "Cava continentale." },
      { name: "Moli dei Convogli", lat: 30, lon: -70, desc: "Torri di lancio delle navi-alveare." },
      { name: "Campo delle Mute", lat: 15, lon: 120, desc: "Distesa di carapaci riciclati." },
    ],
  },
  'estryn-ii': {
    race: 'kheprani',
    badge: "Mondo-Giardino Kheprani",
    population: "~1,3 miliardi",
    description: [
      "Olouraaik è il giardino che nutre i Kheprani. Le sue giungle vengono tagliate in modo sistematico da sciami di raccoglitori, e le foglie trasportate nelle camere-coltura dove crescono i funghi che sfamano tre mondi.",
      "È il pianeta più conteso dei Kheprani: gli Ythar lo considerano un mondo da seminare, e i nidi bruciano ogni nave-seme che entra nella sua atmosfera.",
    ],
    places: [
      { name: "Camere-Coltura di Olou", desc: "Caverne umide grandi come città, dove crescono i funghi nutritivi." },
      { name: "Sentieri dei Raccoglitori", desc: "Solchi larghi decine di metri tagliati nella giungla dai flussi di operai carichi di foglie." },
      { name: "Cicatrice di Fuoco", desc: "Area di foresta bruciata dove fu abbattuta l'ultima nave-seme Ythar." },
    ],
    characters: [
      { name: "Madre-Coltura Iressh", desc: "Regina che controlla le camere più grandi. Ha proposto al Nido di trattare con gli Ythar, ed è rimasta isolata." },
      { name: "Ranger Tomas Grieve", desc: "Guida terrestre che accompagna spedizioni scientifiche nelle zone non ancora raccolte. Pagato dai Kheprani, controllato dai Kheprani." },
    ],
    legend: "Nei funghi delle camere più antiche, i Kheprani hanno trovato filamenti che non avevano coltivato, luminosi e dall'odore sconosciuto. Gli Ythar sostengono di non averli piantati. Gli Ashkaari, interrogati, hanno solo sorriso.",
    pois: [
      { name: "Camere-Coltura di Olou", lat: 5, lon: -15, desc: "Caverne di coltivazione dei funghi." },
      { name: "Sentieri dei Raccoglitori", lat: 25, lon: 50, desc: "Solchi di raccolta nella giungla." },
      { name: "Cicatrice di Fuoco", lat: -30, lon: 140, desc: "Foresta bruciata dell'ultima nave-seme." },
    ],
  },
};
