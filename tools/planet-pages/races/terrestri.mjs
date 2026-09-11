// Terrestri — human colonies of the Consorzio Terrestre in the Via Lattea
// (Ferrandis). Names/institutions must match the hand-written Terra page
// (Consorzio, Direttorato Coloniale, Gilda dei Naviganti, Ordine degli
// Artefici, Flotta di Sorveglianza). Market reuses the industrial theme.

export const TERRESTRI = {
  slug: 'terrestri',
  name: 'Umani',
  plural: 'Terrestri',
  marketTheme: 'industrial',
  species: {
    summary: [
      "Gli umani sono bipedi a sangue caldo originari della Terra, nel Sistema Solare. Rispetto alla maggior parte delle specie della Frontiera sono fragili: tollerano una fascia ristretta di temperature e pressioni, dipendono da ossigeno e acqua dolce e vivono poco più di un secolo, anche con le terapie di prolungamento.",
      "Compensano con un'adattabilità fuori dal comune. Nessun'altra specie conosciuta ha colonizzato ghiacci, deserti e stazioni orbitali in così poco tempo, e nessun'altra cambia così spesso idea su come farlo.",
    ],
    traits: [
      "<strong>Respirazione:</strong> ossigeno al 18–25%; al di fuori servono respiratori o habitat sigillati.",
      "<strong>Ciclo vitale:</strong> maturità a circa vent'anni, aspettativa di vita coloniale tra 90 e 120 anni.",
      "<strong>Punto di forza:</strong> tolleranza allo stress e capacità di improvvisare con strumenti di fortuna; i Coralith lo chiamano «rumore creativo».",
      "<strong>Punto debole:</strong> sistemi immunitari impreparati ai patogeni alieni; ogni colonia ha il suo reparto di quarantena.",
    ],
  },
  civilization: {
    government: [
      "Le colonie di frontiera rispondono al <strong>Direttorato Coloniale</strong> del Consorzio Terrestre, che nomina un governatore per ogni insediamento. Nei fatti, però, il potere è diviso con le corporazioni che finanziano le rotte: la <strong>Gilda dei Naviganti</strong> controlla gli attracchi, l'<strong>Ordine degli Artefici</strong> l'equipaggiamento.",
      "Lontano dalla Terra, la legge della Carta Coloniale si piega spesso alle necessità: chi controlla acqua, energia e rifornimenti conta più di qualunque decreto.",
    ],
    culture: [
      "<strong>Coloni di terza generazione:</strong> molti non hanno mai visto la Terra e la considerano più un'autorità fiscale che una patria.",
      "<strong>Pluralità:</strong> lingue, religioni e blocchi regionali terrestri convivono nelle colonie, spesso in quartieri separati.",
      "<strong>Frontiera:</strong> il mito del pioniere è ovunque — nelle canzoni, nella propaganda del Direttorato e nei contratti capestro delle corporazioni.",
    ],
    spaceflight: [
      "L'umanità ha compiuto il <strong>Primo Salto</strong> poco più di <strong>230 anni fa</strong>: la specie più giovane tra quelle che viaggiano nella Frontiera, e quella che si è espansa più in fretta.",
      "Le navi terrestri sono scafi metallici modulari con moduli di salto certificati dalla Gilda dei Naviganti. Brutte, secondo quasi tutti gli alieni. Riparabili con quasi niente, secondo gli umani.",
    ],
  },
  relations: [
    { race: "Quorai", view: "Partner commerciali indispensabili e contrattatori spietati. I coloni li chiamano «i Polpi», mai davanti a un ambasciatore." },
    { race: "Velmyr", view: "Il primo contatto ha scioccato entrambi: così simili da sembrare uno specchio. Alleati prudenti, rispettati per la disciplina, invidiati per la longevità." },
    { race: "Ythar", view: "Affascinanti e inquietanti. Le loro navi vive sono un sogno per i biologi del Consorzio e un incubo per gli ufficiali di quarantena." },
    { race: "Coralith", view: "Fornitori di tecnologia di precisione e interlocutori impossibili: ogni trattativa con i Coralith dura il triplo del previsto." },
    { race: "Vaelun", view: "Il Consorzio vorrebbe l'elio-3 di Othouven Major; i Vaelun vorrebbero che nessuno lo toccasse. La questione è aperta da decenni." },
    { race: "Kheprani", view: "Clienti affidabili per armi e macchinari, alleati impensabili. Chi ha visto un nido Kheprani da vicino non dorme tranquillo." },
    { race: "Nexari", view: "Nessuno sa cosa vogliano davvero. La Flotta di Sorveglianza tiene sotto osservazione ogni loro sonda che entra nella Via Lattea." },
    { race: "Thissari", view: "Simpatici e lontani. Le loro vele solari hanno ispirato un'intera generazione di ingegneri terrestri." },
    { race: "Ashkaari", view: "Una civiltà antica in rovina che sa più di quanto dica. Tre spedizioni archeologiche del Consorzio sono tornate a mani vuote, una non è tornata." },
  ],
  market: {
    title: "Spaccio Coloniale",
    tagline: "Merce certificata Ordine degli Artefici · prezzi in crediti",
    filters: [
      { key: 'armi', label: 'Armi' },
      { key: 'astronavi', label: 'Astronavi & Veicoli' },
      { key: 'equipaggiamento', label: 'Equipaggiamento Tattico' },
    ],
    products: [
      { cat: 'armi', icon: '⚡', name: "Fucile a Plasma Ashgate Mk.III", desc: "Standard delle milizie coloniali. Cella ricaricabile, tre modalità di fuoco.", price: "2.600 crediti" },
      { cat: 'armi', icon: '🔫', name: "Pistola a Chiodi Industriale", desc: "Nata come utensile da cantiere, diventata l'arma più diffusa della Frontiera.", price: "420 crediti" },
      { cat: 'astronavi', icon: '🚙', name: "Rover Cingolato «Mulo»", desc: "Sei posti, cabina pressurizzata, autonomia di tre settimane. Brutto e indistruttibile.", price: "38.000 crediti" },
      { cat: 'astronavi', icon: '🛰', name: "Navetta da Carico «Brennan-2»", desc: "Stiva modulare, modulo di salto opzionale. Il cavallo da tiro delle colonie.", price: "142.000 crediti" },
      { cat: 'equipaggiamento', icon: '🛡', name: "Corpetto Tattico Ashgate", desc: "Piastre in composito leggero, sigillatura ambientale per atmosfere non catalogate.", price: "1.900 crediti" },
      { cat: 'equipaggiamento', icon: '🧪', name: "Kit di Quarantena da Campo", desc: "Scanner patogeni, siero ad ampio spettro e tenda sigillante. Obbligatorio per legge, spesso ignorato.", price: "760 crediti" },
    ],
  },
};

export const TERRESTRI_PLANETS = {
  'ferrandis-iii': {
    race: 'terrestri',
    badge: "Colonia di Ricerca Terrestre",
    population: "~180.000",
    description: [
      "Creeith Shard è una scheggia di ghiaccio azzurro dove il Consorzio Terrestre ha scommesso una fortuna. Sotto venti chilometri di crosta si nasconde un oceano liquido, e nel ghiaccio sopra di esso sono intrappolati isotopi che non esistono in nessun altro luogo conosciuto: il «ghiaccio di Creeith», combustibile per reattori di nuova generazione.",
      "La colonia vive in habitat semi-interrati riscaldati dai reattori, collegati da tunnel scavati nel ghiaccio. Metà dei coloni sono ricercatori del Reparto Scientifico, l'altra metà minatori a contratto della Gilda dei Naviganti. Le due metà non si sopportano.",
    ],
    places: [
      { name: "Stazione di Perforazione Abisso-7", desc: "La trivella più profonda mai costruita dall'umanità, a pochi chilometri dall'oceano sotterraneo." },
      { name: "Borgo Brina", desc: "Il principale insediamento: habitat, serre idroponiche e l'unico bar del pianeta, «Il Crepaccio»." },
      { name: "Cave di Creeith", desc: "Gallerie di estrazione degli isotopi, illuminate dal bagliore azzurrino del ghiaccio radioattivo." },
    ],
    characters: [
      { name: "Dott.ssa Amara Veltri", desc: "Direttrice scientifica della colonia. Vuole raggiungere l'oceano a ogni costo; il Direttorato vuole solo gli isotopi." },
      { name: "Caposquadra Jonas Kade", desc: "Guida i minatori della Gilda. Ha perso tre uomini in un crollo e accusa apertamente i ricercatori di aver ignorato i rischi." },
      { name: "Osservatore Vel'Sarin", desc: "Scienziato Velmyr ospite della colonia, ufficialmente per cooperazione. Passa le notti ad ascoltare i sensori sismici." },
    ],
    legend: "I trivellatori di Abisso-7 giurano che, oltre i diciotto chilometri, i sensori registrano colpi regolari provenienti dal basso — come se qualcosa, dall'altra parte del ghiaccio, bussasse. Il registro ufficiale parla di assestamenti termici.",
    pois: [
      { name: "Stazione Abisso-7", lat: -48, lon: 20, desc: "Trivella verso l'oceano sotterraneo." },
      { name: "Borgo Brina", lat: -35, lon: 5, desc: "Insediamento principale della colonia." },
      { name: "Cave di Creeith", lat: -40, lon: 60, desc: "Estrazione degli isotopi del ghiaccio." },
    ],
  },
  'ferrandis-iv': {
    race: 'terrestri',
    badge: "Colonia di Frontiera Terrestre",
    population: "~2,4 milioni",
    description: [
      "Ferrandis IV è la frontiera come la raccontano le canzoni: sabbia rossa, città di lamiera, pozzi d'acqua sorvegliati da uomini armati. La colonia è nata come scalo di rifornimento per le navi dirette verso Creeith Shard ed è cresciuta senza un piano, attorno alle falde profonde.",
      "Qui l'acqua vale più dei crediti. Il Direttorato Coloniale ha nominato un governatore, ma i veri padroni del pianeta sono i «baroni dei pozzi», che controllano le trivelle e decidono chi beve.",
    ],
    places: [
      { name: "Nuova Ashgate", desc: "Capitale coloniale: spazioporto, fonderie dell'Ordine degli Artefici e quartieri cresciuti in verticale con container impilati." },
      { name: "Pozzi di Sangue", desc: "Il campo di trivelle più ricco del pianeta, conteso da tre baroni in trent'anni di faide." },
      { name: "Mercato Velmyr", desc: "Enclave commerciale Velmyr fuori dalle mura di Nuova Ashgate, unico luogo del pianeta dove si trovano filtri d'acqua di qualità." },
    ],
    characters: [
      { name: "Governatore Silas Brennan", desc: "Nominato dal Direttorato per «riportare l'ordine». Onesto, idealista e isolato: nessun barone lo prende sul serio." },
      { name: "Mara «Polvere» Okafor", desc: "Contrabbandiera d'acqua e leggenda locale. Porta cisterne ai villaggi che i baroni lasciano a secco." },
      { name: "Barone Teodor Vance", desc: "Il più potente dei signori dei pozzi. Ha una milizia privata e un seggio non ufficiale al tavolo di ogni decisione." },
    ],
    legend: "Si dice che sotto il deserto esista un lago intero, grande quanto un mare, e che il primo barone ne abbia fatto saltare l'accesso per mantenere alto il prezzo dell'acqua. Chi cerca la mappa originale della spedizione di rilevamento sparisce.",
    pois: [
      { name: "Nuova Ashgate", lat: 12, lon: -40, desc: "Capitale coloniale e spazioporto." },
      { name: "Pozzi di Sangue", lat: -5, lon: 15, desc: "Campo di trivelle conteso." },
      { name: "Mercato Velmyr", lat: 14, lon: -32, desc: "Enclave commerciale Velmyr." },
    ],
  },
};
