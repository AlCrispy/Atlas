// Ashkaari — ancient amphibian-fungal remnant of the Vandrel peculiar
// (colliding) galaxy (Ashkar, Kethra). Hosts bonded with memory fungi that
// carry ~40,000 years of ancestral recollection; a fallen hegemony whose
// ruins dot Vandrel (e.g. Ruinvale). Hinted "seeding" of other species is
// kept deliberately ambiguous.

export const ASHKAARI = {
  slug: 'ashkaari',
  name: 'Ashkaari',
  plural: 'Ashkaari',
  marketTheme: 'ashkaari',
  species: {
    summary: [
      "Un Ashkaari è due creature in una. L'<strong>ospite</strong> è un anfibio alto e curvo, dalla pelle verde scuro e liscia, con occhi dorati e dita palmate; il <strong>simbionte</strong> è un fungo filamentoso che cresce lungo la spina dorsale e nel cranio, formando una cresta di corolle pallide e luminescenti.",
      "Il fungo conserva i ricordi. Quando un ospite muore, i filamenti vengono trapiantati in un nuovo corpo giovane, che eredita la memoria di tutte le vite precedenti. Alcune linee di simbionti ricordano quarantamila anni di storia — e sono, dicono gli Ashkaari, molto stanche.",
    ],
    traits: [
      "<strong>Memoria ancestrale:</strong> un Ashkaari anziano può ricordare eventi vissuti da decine di ospiti diversi, in lingue che nessuno parla più.",
      "<strong>Ambiente:</strong> anfibi, prosperano in climi umidi e caldi; il simbionte muore se l'ospite si disidrata.",
      "<strong>Declino:</strong> i funghi più antichi producono sempre meno spore. La popolazione Ashkaari si riduce da secoli.",
      "<strong>Fatalismo:</strong> sapere come sono finiti cento imperi prima del proprio rende difficile credere che il prossimo possa andare diversamente.",
    ],
  },
  civilization: {
    government: [
      "Ciò che resta degli Ashkaari è guidato dal <strong>Collegio della Memoria</strong>, formato dai portatori delle linee di simbionti più antiche. Il Collegio non comanda: ricorda, e consiglia sulla base di ciò che è già accaduto.",
      "Un tempo esisteva l'<strong>Egemonia di Ashkar</strong>, che si estendeva su centinaia di sistemi. Poi due galassie si scontrarono: Vandrel nacque da quella collisione, e l'Egemonia non sopravvisse. Le rovine di Ruinvale sono tra le poche rimaste visibili.",
    ],
    culture: [
      "<strong>Archivi viventi:</strong> su Kethra II i simbionti dei morti che non hanno trovato un nuovo ospite vengono coltivati in foreste-archivio consultabili.",
      "<strong>Proverbi:</strong> gli Ashkaari rispondono spesso alle domande con detti antichi. Non per evasività, dicono, ma perché la risposta è già stata data.",
      "<strong>La Semina:</strong> un tabù. Il Collegio non ne parla con gli stranieri, e neppure con i giovani ospiti.",
    ],
    spaceflight: [
      "Gli Ashkaari viaggiavano tra le stelle circa <strong>40.000 anni fa</strong>, molto prima di qualsiasi altra civiltà conosciuta. Le loro navi erano coltivate e cristallizzate insieme, con tecnologie che oggi ricordano perfettamente ma non sanno più ricostruire.",
      "Oggi possiedono meno di cento navi funzionanti, tutte antichissime. Ognuna è considerata insostituibile e viene usata solo per i pellegrinaggi agli archivi e per i rari viaggi diplomatici.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "«Un'altra primavera». Il Collegio ha visto molte specie giovani crescere in fretta; quasi tutte si sono bruciate. Guarda gli umani con affetto e senza speranza." },
    { race: "Quorai", view: "Mercanti avidi e sinceri. Le Madri di Fondale ricordano quasi quanto un simbionte, e il Collegio le considera le uniche interlocutrici alla sua altezza." },
    { race: "Velmyr", view: "Fanno sempre la stessa domanda: perché somigliano agli umani. Il Collegio risponde sempre con lo stesso proverbio: «Due semi dello stesso vento non si conoscono»." },
    { race: "Ythar", view: "I figli del Coro vengono in pellegrinaggio su Kethra II per ascoltare le spore della memoria. Il Collegio li accoglie e non conferma nulla." },
    { race: "Coralith", view: "Studiosi rispettosi delle rovine dell'Egemonia. Il Collegio ricorda il tempo in cui i Coralith erano ancora cristalli senza pensiero." },
    { race: "Vaelun", view: "Il Grande Canto ricorda gli Ashkaari, e non con gentilezza. Il Collegio non contesta: la memoria dei Vaelun è quasi lunga quanto la sua." },
    { race: "Kheprani", view: "Saccheggiatori di rovine. Il Collegio vende loro mappe di siti ormai vuoti, e tace su quelli che non lo sono." },
    { race: "Nexari", view: "Il Collegio conosceva i Costruttori di Pyxis. Sa dove sono andati. Considera la domanda dei Nexari la più triste della galassia, e per questo non risponde." },
    { race: "Thissari", view: "«I figli della luce verde». Il Collegio ricorda un'antica nave caduta sulle nevi di Thissos, e non ha mai detto ai Thissari cosa trasportasse." },
  ],
  market: {
    title: "Bottega della Memoria",
    tagline: "Ogni oggetto è più antico della vostra specie · nessun reso",
    filters: [
      { key: 'reliquie', label: 'Reliquie' },
      { key: 'memorie', label: 'Memorie Fungine' },
      { key: 'mappe', label: 'Mappe Antiche' },
      { key: 'tecnologie', label: 'Tecnologie Perdute' },
    ],
    products: [
      { cat: 'reliquie', icon: '🏺', name: "Anfora dell'Egemonia", desc: "Contenitore sigillato da trentamila anni. Il contenuto è ignoto; il Collegio sconsiglia di aprirla, ma non lo vieta.", price: "12.500 crediti" },
      { cat: 'reliquie', icon: '🪬', name: "Sigillo di Ruinvale", desc: "Disco di metallo verde che si scalda vicino alle rovine Ashkaari. Utile, se si sa cosa si cerca.", price: "4.300 crediti" },
      { cat: 'memorie', icon: '🍄', name: "Spora del Ricordo", desc: "Un'ora vissuta da un ospite di migliaia di anni fa, respirata in un sogno. Effetti collaterali: nostalgia di luoghi mai visti.", price: "2.800 crediti" },
      { cat: 'memorie', icon: '🌿', name: "Talea d'Archivio", desc: "Frammento di foresta-archivio da coltivare in serra. Cresce lentamente e, secondo alcuni, sussurra.", price: "9.900 crediti" },
      { cat: 'mappe', icon: '🗺', name: "Mappa delle Rovine Minori", desc: "Coordinate di dodici siti dell'Egemonia. Probabilmente già saccheggiati. Probabilmente.", price: "6.000 crediti" },
      { cat: 'tecnologie', icon: '🔮', name: "Nucleo di Nave Cristallizzato", desc: "Frammento di motore dell'Egemonia, ancora attivo. Nessuno sa farlo funzionare; tutti vogliono provarci.", price: "88.000 crediti" },
      { cat: 'tecnologie', icon: '💚', name: "Lanterna della Luce Verde", desc: "Emette una luce verde costante da un'epoca precedente alla collisione delle galassie. Non si spegne.", price: "15.000 crediti" },
    ],
  },
};

export const ASHKAARI_PLANETS = {
  'ashkar-v': {
    race: 'ashkaari',
    badge: "Mondo Natale Ashkaari",
    population: "~70 milioni",
    description: [
      "Ashkar V è un oceano caldo e poco profondo punteggiato di arcipelaghi, e un tempo era il cuore dell'Egemonia di Ashkar. Oggi le sue città più grandi sono sommerse: torri di pietra verde che emergono dall'acqua come dita, ricoperte di funghi luminosi.",
      "Gli Ashkaari superstiti vivono lungo le coste e nelle parti ancora emerse delle antiche capitali. La popolazione cala ogni generazione, e intere isole vengono lasciate all'oceano senza rimpianti apparenti.",
    ],
    places: [
      { name: "Ashkar la Sommersa", desc: "L'antica capitale dell'Egemonia, ora in gran parte sotto il mare. Le sue torri più alte ospitano ancora il Collegio della Memoria." },
      { name: "Baia dei Trapianti", desc: "Lagune calde dove i simbionti vengono trasferiti da un ospite morente a uno giovane, in cerimonie che durano giorni." },
      { name: "Cantiere Silente", desc: "Isola dove riposano le ultime navi funzionanti dell'Egemonia, curate come reliquie." },
    ],
    characters: [
      { name: "Decana Oluveth dei Mille Ospiti", desc: "Portatrice della linea di simbionti più antica, oltre quarantamila anni di memoria. Parla raramente, e quasi sempre di cose che non sono ancora successe." },
      { name: "Giovane Ospite Sarrik", desc: "Ha ricevuto un simbionte antichissimo a sedici anni e non riesce più a distinguere i propri ricordi da quelli ereditati. Il Collegio lo osserva con preoccupazione." },
      { name: "Prof. Anika Sørensen", desc: "Archeologa terrestre che vive ad Ashkar la Sommersa da dodici anni. È l'unica umana a cui il Collegio abbia mai risposto con qualcosa di diverso da un proverbio." },
    ],
    legend: "Nel punto più profondo sotto Ashkar la Sommersa esiste una camera asciutta, sigillata prima della collisione delle galassie. Il Collegio sa cosa contiene. Ogni linea di simbionti che lo ricorda si rifiuta di ricordarlo ad alta voce.",
    pois: [
      { name: "Ashkar la Sommersa", lat: 8, lon: 15, desc: "Antica capitale sommersa." },
      { name: "Baia dei Trapianti", lat: -20, lon: 70, desc: "Lagune delle cerimonie di trapianto." },
      { name: "Cantiere Silente", lat: 30, lon: -100, desc: "Ultime navi dell'Egemonia." },
    ],
  },
  'kethra-ii': {
    race: 'ashkaari',
    badge: "Mondo-Archivio Ashkaari",
    population: "~4 milioni",
    description: [
      "Kethra II è una giungla dove le foreste pensano — o almeno ricordano. I simbionti degli Ashkaari morti senza un nuovo ospite vengono piantati qui da migliaia di anni, e sono cresciuti in foreste-archivio che conservano le memorie di intere epoche.",
      "Pochi Ashkaari vivono stabilmente sul pianeta: custodi, lettori e pellegrini. Ma arrivano visitatori da tutta la Frontiera, soprattutto Ythar, per camminare tra alberi che sussurrano in lingue morte.",
    ],
    places: [
      { name: "Foresta dei Primi Ricordi", desc: "La sezione più antica dell'archivio, dove i funghi conservano memorie precedenti alla collisione delle galassie." },
      { name: "Radura dei Lettori", desc: "Dove i custodi respirano le spore per consultare l'archivio e trascriverne i frammenti." },
      { name: "Sentiero dei Pellegrini Ythar", desc: "Percorso aperto ai nodi del Coro, che vi restano in silenzio per settimane." },
    ],
    characters: [
      { name: "Custode Vhorala", desc: "Responsabile della Foresta dei Primi Ricordi. Da trent'anni non lascia l'archivio, e comincia a parlare con la voce di altri." },
      { name: "Tessitore Ythar Oss'Vireh", desc: "Pellegrino del Coro stabilitosi sul pianeta. Sostiene che la foresta abbia riconosciuto le sue spore." },
    ],
    legend: "Nella Foresta dei Primi Ricordi c'è un albero che conserva memorie non Ashkaari: immagini di bipedi a sangue caldo su un pianeta blu, e di umanoidi dalla pelle d'ardesia nelle chiome di una giungla. Il Collegio ha vietato di leggerlo.",
    pois: [
      { name: "Foresta dei Primi Ricordi", lat: -5, lon: 40, desc: "Archivio fungino più antico." },
      { name: "Radura dei Lettori", lat: 10, lon: 20, desc: "Luogo di consultazione dell'archivio." },
      { name: "Sentiero dei Pellegrini Ythar", lat: 25, lon: -60, desc: "Percorso dei pellegrini del Coro." },
    ],
  },
};
