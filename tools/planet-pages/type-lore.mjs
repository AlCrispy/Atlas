// Per-classification content pools for generated planet pages. The
// generator picks from these with a per-planet seeded RNG, so every planet
// gets a stable, distinct mix. Fauna/flora names are `<alien root> <label>`
// (root generated per planet), which keeps repeated pool entries from
// reading as copy-pasted between worlds.
//
// Placeholders filled by the generator: {name} planet, {system} system,
// {ordinal} orbital position ("terzo"), {root} a fresh alien word.
//
// Inspirations (loose, never copied): Sagan & Salpeter's floaters/hunters/
// sinkers for giant-planet life; Arrakis's water economy and sand-dwelling
// megafauna; Solaris's thinking ocean; Hoth-style ice worlds with
// subsurface oceans ("steppenwolf" worlds); Pandora's networked biosphere;
// derelicts à la LV-426 and Rama; silicon biochemistry on hot worlds;
// terminator-zone life on tidally locked planets.

export const SCIENCE_SHIPS = [
  'NRS Ardea', 'NRS Kestrel-4', 'Sonda Vigilia-9', 'NRS Halcyon', 'NRS Meridiana',
  'Sonda Astrolabio', 'NRS Corvina', 'NRS Tessitrice', 'Sonda Lucerna-2', 'NRS Fenice Grigia',
];

export const RISK_ASSESSMENT = {
  Bassa: "Il Reparto Scientifico classifica {name} come accessibile a squadre di rilevamento standard, con protocolli ambientali di base.",
  Moderata: "Il Reparto Scientifico autorizza sbarchi solo con tute sigillate e supporto orbitale attivo: {name} non perdona le distrazioni.",
  Elevata: "Sbarchi su {name} consentiti solo a squadre specializzate, con finestra di evacuazione garantita. Due missioni su cinque rientrano prima del previsto.",
  Estrema: "{name} è marcato in rosso nei registri del Reparto Scientifico: nessuno sbarco autorizzato senza via libera del Direttorato Coloniale. Le sonde automatiche sono l'unico approccio raccomandato.",
};

export const TYPE_LORE = {
  roccioso: {
    gravity: [0.4, 1.1],
    dayHours: [14, 90],
    lifeChance: 0.3,
    risk: { Bassa: 3, Moderata: 4, Elevata: 2, Estrema: 1 },
    intro: [
      "{name} è il {ordinal} pianeta del sistema {system}: una sfera di roccia nuda, crateri sovrapposti e pianure di basalto antico che nessun vento ha mai levigato.",
      "Mondo roccioso e silenzioso, {name} orbita come {ordinal} pianeta di {system}. Da orbita appare grigio e uniforme; da vicino rivela canyon profondi chilometri e faglie ancora attive.",
      "Il {ordinal} pianeta di {system}, {name}, è un mondo di pietra e polvere fine, con un'atmosfera troppo sottile per trattenere calore o suono.",
    ],
    detail: [
      "Le sonde hanno misurato scosse sismiche regolari, quasi ritmiche, la cui origine non è ancora stata spiegata.",
      "Il sottosuolo è ricco di metalli pesanti: le compagnie minerarie hanno già presentato tre richieste di concessione al Direttorato Coloniale.",
      "Le escursioni termiche tra giorno e notte superano i duecento gradi, fratturando la roccia in lastre affilate come vetro.",
      "Sotto la regolite si estende una rete di tunnel di lava fossili, abbastanza ampi da ospitare un'intera colonia.",
    ],
    climate: [
      "Assente in senso stretto: giorni roventi e notti glaciali si alternano senza alcuna mediazione atmosferica.",
      "Freddo e stabile, con tempeste di polvere elettrostatica stagionali che oscurano la superficie per settimane.",
      "Arido e immobile; l'unico fenomeno meteorologico rilevato è la brina di anidride carbonica che si deposita all'alba.",
    ],
    atmosphere: [
      { short: "Tenue", desc: "Traccia di argon e anidride carbonica, pressione inferiore all'1% dello standard terrestre." },
      { short: "Assente", desc: "Esosfera trascurabile: la superficie è esposta direttamente al vento stellare." },
      { short: "Sottile, azotata", desc: "Sottile velo di azoto, irrespirabile ma sufficiente a trasportare polvere fine." },
    ],
    temperature: ["−120 °C / +140 °C", "−60 °C medi", "−180 °C notturni", "+30 °C diurni, −90 °C notturni"],
    flora: [
      { label: "delle faglie", kind: "Licheni litotrofi", desc: "Croste nere che si nutrono di ferro e zolfo, crescono di un millimetro ogni secolo nelle fessure ombreggiate." },
      { label: "a vetro", kind: "Colonie cristalline", desc: "Filamenti traslucidi di silice biologica che vibrano con le scosse sismiche; il loro metabolismo resta un enigma." },
      { label: "dei tunnel", kind: "Tappeti microbici", desc: "Pellicole viola che rivestono le pareti dei tunnel di lava, alimentate dal calore residuo del sottosuolo." },
      { label: "di brina", kind: "Spore criptobiotiche", desc: "Spore dormienti che si riattivano per poche ore quando la brina dell'alba si scioglie." },
    ],
    fauna: [
      { label: "scavaroccia", kind: "Invertebrato litofago", desc: "Organismo segmentato lungo un palmo che scava gallerie nutrendosi di minerali; le sue gallerie spiegano parte delle vibrazioni rilevate." },
      { label: "dei crateri", kind: "Filtratore sessile", desc: "Coni di guscio minerale che intrappolano la polvere trasportata dalle tempeste e ne estraggono composti organici." },
      { label: "d'ombra", kind: "Predatore lento", desc: "Creatura piatta e opaca che vive sotto le lastre di roccia e aspetta per settimane che qualcosa ci passi sopra." },
      { label: "sismico", kind: "Organismo coloniale", desc: "Migliaia di individui microscopici che si muovono in sincronia, generando le scosse ritmiche registrate dalle sonde." },
    ],
    noLife: "Nessuna forma di vita rilevata. Le analisi della regolite non mostrano tracce organiche, né presenti né fossili.",
    hazards: [
      { name: "Lastre termiche", desc: "Rocce fratturate dagli sbalzi di temperatura che cedono sotto il peso di un veicolo, aprendo crepacci improvvisi." },
      { name: "Radiazione stellare diretta", desc: "Senza magnetosfera né atmosfera, una sola esposizione prolungata supera le soglie di sicurezza delle tute standard." },
      { name: "Polvere elettrostatica", desc: "Particelle finissime che aderiscono a visori e giunti, cortocircuitano l'elettronica e si infilano in ogni guarnizione." },
      { name: "Collassi dei tunnel", desc: "Le gallerie laviche sono instabili: le scosse ritmiche possono farne crollare interi tratti senza preavviso." },
      { name: "Micrometeoriti", desc: "Pioggia costante di detriti ad alta velocità, capace di perforare scafi leggeri e habitat non schermati." },
    ],
    scans: [
      { title: "Anomalia gravimetrica", desc: "Una massa densa e perfettamente sferica rilevata a quattro chilometri di profondità. Troppo regolare per essere naturale, secondo metà del team." },
      { title: "Struttura sepolta", desc: "Il radar a penetrazione ha restituito il profilo di mura rettilinee sotto una pianura basaltica. Nessuna civiltà nota ha mai reclamato questo sistema." },
      { title: "Segnale periodico", desc: "Un impulso radio debole, ripetuto ogni 71 ore, proveniente dal polo sud. La sorgente non è stata localizzata." },
      { title: "Giacimento di iridio", desc: "Concentrazioni di iridio e platino tra le più alte mai registrate dal Reparto Scientifico, affioranti ai bordi di un grande cratere." },
      { title: "Relitto non identificato", desc: "Scafo di foggia sconosciuta incastrato nella parete di un canyon, con segni di impatto vecchi di almeno ottomila anni." },
    ],
    pois: [
      { name: "Cratere {root}", desc: "Bacino da impatto largo centinaia di chilometri, con picco centrale ricco di metalli." },
      { name: "Faglia di {root}", desc: "Frattura attiva da cui provengono le scosse più intense." },
      { name: "Tunnel di {root}", desc: "Ingresso della principale rete di tunnel lavici fossili." },
      { name: "Pianura {root}", desc: "Distesa basaltica sotto cui il radar ha rilevato strutture rettilinee." },
    ],
  },

  desertico: {
    gravity: [0.6, 1.35],
    dayHours: [18, 40],
    lifeChance: 0.75,
    risk: { Bassa: 2, Moderata: 4, Elevata: 3, Estrema: 1 },
    intro: [
      "{name}, {ordinal} pianeta del sistema {system}, è un oceano di dune color ruggine che si muove lentamente sotto venti costanti. L'acqua esiste, ma solo sepolta o intrappolata nei minerali.",
      "Visto da orbita, {name} è un disco ocra striato da catene montuose erose. Il {ordinal} pianeta di {system} ha perso i suoi mari milioni di anni fa, ma ne conserva i letti fossili.",
      "Il {ordinal} pianeta di {system} è un deserto quasi totale: {name} alterna altopiani di arenaria, saline accecanti e mari di sabbia che cantano quando il vento li attraversa.",
      "{name} è un mondo arido e luminoso, {ordinal} in ordine di distanza dalla stella di {system}. Qui ogni forma di vita ruota attorno a un'unica ossessione: trattenere l'acqua.",
    ],
    detail: [
      "Le calotte polari, piccole e sporche di polvere, sono l'unica riserva d'acqua visibile dalla superficie.",
      "Sotto le saline scorre una rete di falde salmastre che alimenta oasi nascoste in fondo ai canyon.",
      "Le tempeste di sabbia raggiungono dimensioni continentali e possono durare mesi, oscurando interi emisferi.",
      "Il vento ha scolpito gli altopiani in archi e pinnacoli alti centinaia di metri, visibili anche dalle navi in orbita bassa.",
      "Durante la notte la temperatura crolla sotto lo zero e l'umidità residua si condensa in brina, raccolta avidamente da piante e animali.",
    ],
    climate: [
      "Arido estremo, con venti costanti da ovest e tempeste di sabbia stagionali di scala continentale.",
      "Semi-arido nelle fasce temperate, torrido all'equatore; piogge brevi e violente una volta ogni pochi anni.",
      "Secco e ventoso, con forti escursioni termiche tra il giorno rovente e le notti gelide.",
    ],
    atmosphere: [
      { short: "Respirabile a fatica", desc: "Azoto e ossigeno in proporzioni vicine allo standard, ma estremamente secca e carica di polvere fine: servono filtri." },
      { short: "Sottile, secca", desc: "Pressione pari a circa metà dello standard terrestre, con alta concentrazione di anidride carbonica." },
      { short: "Densa, polverosa", desc: "Atmosfera spessa e calda, con particolato in sospensione che tinge il cielo di arancio anche a mezzogiorno." },
    ],
    temperature: ["+48 °C diurni", "+35 °C medi", "+62 °C all'equatore", "+40 °C diurni, −15 °C notturni"],
    flora: [
      { label: "a otre", kind: "Succulenta gigante", desc: "Tronco rigonfio che immagazzina fino a mille litri d'acqua; si ritira sottoterra durante le tempeste." },
      { label: "delle saline", kind: "Alga cristallina", desc: "Crosta rosata che cresce sul sale e riflette la luce per non surriscaldarsi; da lontano sembra un campo di quarzo." },
      { label: "a radice profonda", kind: "Albero fossatore", desc: "Chioma bassa e piatta, radici che scendono per oltre cento metri fino alle falde. Le carovane le usano come segnavia." },
      { label: "di brina", kind: "Pianta igroscopica", desc: "Rete di filamenti argentei che si aprono solo di notte per catturare la condensa, poi si richiudono prima dell'alba." },
      { label: "girovaga", kind: "Cespuglio rotolante", desc: "Si stacca dal terreno nella stagione secca e si lascia trasportare dal vento per centinaia di chilometri, disperdendo semi." },
      { label: "a specchio", kind: "Pianta fototropica", desc: "Foglie lucide orientabili che concentrano la luce su fiori scuri, ustionando gli insetti che ci si posano." },
    ],
    fauna: [
      { label: "delle dune", kind: "Megafauna fossoria", desc: "Invertebrato lungo decine di metri che nuota sotto la sabbia seguendo le vibrazioni. Le carovane evitano i passi ritmici." },
      { label: "otre", kind: "Erbivoro da carovana", desc: "Quadrupede lento e gobbo che trattiene acqua nei tessuti per mesi; addomesticabile, secondo i primi rapporti." },
      { label: "vetroso", kind: "Rettile termoregolatore", desc: "Squame semitrasparenti che disperdono il calore; resta immobile per ore e sembra un sasso levigato." },
      { label: "dell'ombra", kind: "Predatore notturno", desc: "Cacciatore in branco, esce solo al crepuscolo; comunica con fischi ultrasonici che le tute registrano come interferenze." },
      { label: "cantante", kind: "Insetto sociale", desc: "Sciami che costruiscono torri di sabbia cementata; il vento che le attraversa produce il canto delle dune." },
      { label: "delle saline", kind: "Crostaceo alofilo", desc: "Piccolo e corazzato, vive nelle pozze salmastre sotto la crosta di sale; commestibile, se bollito a lungo." },
      { label: "planatore", kind: "Volatore termico", desc: "Membrane ampie e corpo leggerissimo: sfrutta le correnti calde per restare in volo giorni senza posarsi." },
    ],
    noLife: "Nessuna forma di vita complessa rilevata. I campioni di sabbia contengono solo tracce di attività microbica fossile, risalente all'epoca dei mari.",
    hazards: [
      { name: "Tempeste di sabbia", desc: "Fronti alti chilometri che avanzano a oltre duecento chilometri orari; abrasione sufficiente a opacizzare un visore in minuti." },
      { name: "Disidratazione", desc: "Senza sistemi di recupero dell'umidità, una persona sopravvive meno di due giorni in superficie." },
      { name: "Sabbie mobili secche", desc: "Sacche di sabbia finissima non compattata che inghiottono veicoli interi senza lasciare traccia." },
      { name: "Megafauna fossoria", desc: "Le vibrazioni dei motori attirano i grandi scavatori; almeno un mezzo di rilevamento è stato perso così." },
      { name: "Colpi di calore", desc: "A mezzogiorno la superficie supera temperature che mandano in crisi i sistemi di raffreddamento delle tute." },
      { name: "Miraggi elettromagnetici", desc: "Le tempeste caricano l'aria di elettricità statica: sensori e bussole restituiscono dati falsi per ore." },
    ],
    scans: [
      { title: "Letto oceanico fossile", desc: "Sotto le dune dell'emisfero nord il radar ha tracciato coste, estuari e scogliere di un mare scomparso da milioni di anni." },
      { title: "Falda profonda", desc: "Riserva d'acqua dolce stimata in miliardi di metri cubi a seicento metri di profondità. Da sola potrebbe sostenere una colonia." },
      { title: "Città sepolta", desc: "Una tempesta ha scoperto per pochi giorni la sommità di edifici a gradoni, poi di nuovo coperti. Coordinate registrate, nessuna squadra inviata." },
      { title: "Vetro da impatto", desc: "Vaste distese di sabbia vetrificata disposte in cerchi concentrici. Alcuni analisti ipotizzano un bombardamento, non un meteorite." },
      { title: "Canto anomalo", desc: "Il canto delle dune contiene sequenze che si ripetono identiche a distanza di migliaia di chilometri. Nessuna spiegazione soddisfacente." },
      { title: "Sonda abbandonata", desc: "Un lander di fabbricazione non terrestre, parzialmente sepolto, con i serbatoi d'acqua svuotati dall'interno." },
    ],
    pois: [
      { name: "Mare di {root}", desc: "Erg sconfinato attraversato dalle rotte della megafauna fossoria." },
      { name: "Saline di {root}", desc: "Distesa bianca sotto cui scorrono falde salmastre." },
      { name: "Archi di {root}", desc: "Altopiano scolpito dal vento in archi e pinnacoli giganteschi." },
      { name: "Oasi di {root}", desc: "Canyon profondo con acqua in superficie e flora rigogliosa." },
      { name: "Vetri di {root}", desc: "Cerchi concentrici di sabbia vetrificata di origine incerta." },
    ],
  },

  oceanico: {
    gravity: [0.8, 1.4],
    dayHours: [16, 36],
    lifeChance: 0.95,
    risk: { Bassa: 2, Moderata: 4, Elevata: 3, Estrema: 1 },
    intro: [
      "{name} è il {ordinal} pianeta del sistema {system}: un unico oceano che avvolge il globo, profondo fino a sessanta chilometri, interrotto solo da arcipelaghi vulcanici.",
      "Da orbita {name} brilla di un blu intenso screziato di bianco. Il {ordinal} pianeta di {system} ha meno terre emerse di quante ne abbia una singola regione della Terra.",
      "Il {ordinal} pianeta di {system}, {name}, è un mondo d'acqua dalle maree colossali, dove intere isole galleggianti di vegetazione migrano seguendo le correnti.",
    ],
    detail: [
      "Di notte vasti banchi di plancton bioluminescente disegnano sulla superficie spirale luminose visibili dallo spazio.",
      "Sul fondo, a pressioni schiaccianti, sorgenti idrotermali alimentano ecosistemi che non hanno mai visto la luce.",
      "Le maree, spinte dai satelliti, sollevano onde lunghe che percorrono l'intero pianeta senza incontrare ostacoli.",
      "Alcuni oceanografi del Reparto Scientifico sostengono che le correnti rispondano alla presenza delle sonde. Nessuno ha ancora pubblicato i dati.",
    ],
    climate: [
      "Umido e temperato, con uragani permanenti nelle fasce tropicali e nebbie perenni alle alte latitudini.",
      "Mite e stabile grazie all'inerzia termica dell'oceano; tempeste rare ma di dimensioni planetarie.",
      "Caldo e piovoso, con cicloni che si formano e si dissolvono in pochi giorni.",
    ],
    atmosphere: [
      { short: "Respirabile, umida", desc: "Azoto e ossigeno vicini allo standard, umidità costante oltre il 90%." },
      { short: "Densa, salmastra", desc: "Pressione superiore allo standard e aerosol salini corrosivi per l'equipaggiamento." },
      { short: "Ricca di ossigeno", desc: "Ossigeno al 30%: respirabile, ma ogni scintilla rischia di diventare un incendio." },
    ],
    temperature: ["+22 °C medi", "+18 °C medi", "+29 °C medi", "+12 °C medi"],
    flora: [
      { label: "galleggiante", kind: "Isola vegetale", desc: "Intrecci di radici e gas che formano isole larghe chilometri, con ecosistemi propri; migrano con le correnti." },
      { label: "abissale", kind: "Foresta chemiosintetica", desc: "Colonne di tubi viventi alte come torri attorno alle sorgenti idrotermali, nutrite da zolfo invece che da luce." },
      { label: "di marea", kind: "Alga a nastro", desc: "Nastri lunghi centinaia di metri che si ancorano alle scogliere e si allungano con l'alta marea." },
      { label: "lucente", kind: "Fitoplancton bioluminescente", desc: "Microrganismi che si illuminano quando vengono disturbati; le scie delle navi restano visibili per ore." },
      { label: "a vela", kind: "Pianta di superficie", desc: "Foglie rigide che fanno da vela: la pianta naviga controvento cambiando l'inclinazione delle lamine." },
    ],
    fauna: [
      { label: "d'abisso", kind: "Leviatano", desc: "Sagome lunghe oltre duecento metri rilevate dal sonar a grande profondità; salgono in superficie solo durante le tempeste." },
      { label: "a lanterna", kind: "Branco pelagico", desc: "Pesci luminosi che si muovono in banchi da milioni di individui formando figure geometriche." },
      { label: "corazzato", kind: "Crostaceo di scogliera", desc: "Grande quanto un veicolo leggero, filtra l'acqua con appendici piumate; pacifico, a meno di bloccargli la ritirata." },
      { label: "delle isole", kind: "Anfibio arboricolo", desc: "Vive sulle isole galleggianti e nuota da una all'altra; costruisce nidi con alghe intrecciate." },
      { label: "cantore", kind: "Mammifero marino", desc: "Emette canti a bassa frequenza che viaggiano per migliaia di chilometri; alcuni schemi sembrano rispondere ai segnali delle sonde." },
      { label: "a medusa", kind: "Colonia fluttuante", desc: "Campane trasparenti larghe decine di metri con filamenti urticanti lunghi un chilometro." },
    ],
    noLife: "Contro ogni aspettativa, l'oceano risulta sterile: acqua chimicamente adatta alla vita, ma nessun organismo rilevato. Il Reparto Scientifico considera il dato sospetto.",
    hazards: [
      { name: "Onde planetarie", desc: "Onde lunghe che crescono senza ostacoli fino a decine di metri; nessuna struttura costiera resiste a lungo." },
      { name: "Pressione abissale", desc: "Sotto i dieci chilometri servono scafi da trincea; molti batiscafi standard sono implosi." },
      { name: "Uragani permanenti", desc: "Tempeste vecchie di secoli con venti oltre i trecento chilometri orari; aggirarle allunga di giorni ogni tragitto." },
      { name: "Filamenti urticanti", desc: "Tossine neurotossiche delle colonie fluttuanti, capaci di attraversare i tessuti delle mute standard." },
      { name: "Corrosione salina", desc: "Aerosol carichi di sale che degradano giunti, filtri ed elettronica in pochi giorni di esposizione." },
    ],
    scans: [
      { title: "Struttura sommersa", desc: "Il sonar ha mappato una formazione a spirale perfetta sul fondale, larga undici chilometri, priva di sedimenti come se venisse pulita." },
      { title: "Risposta delle correnti", desc: "Tre sonde diverse hanno registrato deviazioni delle correnti locali entro un'ora dal loro ammaraggio. Coincidenza, secondo il rapporto ufficiale." },
      { title: "Canto strutturato", desc: "Le vocalizzazioni dei mammiferi marini contengono pattern ricorsivi compatibili con un linguaggio. Analisi in corso." },
      { title: "Deposito di idrati", desc: "Enormi riserve di idrati di metano sui fondali polari: una risorsa energetica e un rischio di rilascio catastrofico." },
      { title: "Isola artificiale?", desc: "Un'isola galleggiante percorre una rotta perfettamente circolare da tre cicli di osservazione, contro le correnti prevalenti." },
    ],
    pois: [
      { name: "Fossa di {root}", desc: "Punto più profondo dell'oceano, sede di leviatani e sorgenti idrotermali." },
      { name: "Arcipelago di {root}", desc: "Catena di isole vulcaniche, unica terra emersa stabile." },
      { name: "Spirale di {root}", desc: "Struttura geometrica sul fondale, di origine sconosciuta." },
      { name: "Occhio di {root}", desc: "Uragano permanente osservato da secoli." },
    ],
  },

  glaciale: {
    gravity: [0.5, 1.2],
    dayHours: [20, 60],
    lifeChance: 0.55,
    risk: { Bassa: 1, Moderata: 4, Elevata: 4, Estrema: 1 },
    intro: [
      "{name}, {ordinal} pianeta del sistema {system}, è un mondo sepolto sotto chilometri di ghiaccio. In superficie domina il bianco; sotto, secondo le sonde, si nasconde un oceano liquido.",
      "Il {ordinal} pianeta di {system} è una sfera di ghiaccio azzurro percorsa da fratture lunghe migliaia di chilometri. {name} è freddo, silenzioso e sorprendentemente attivo.",
      "{name} è una distesa di ghiacciai, altipiani spazzati dal vento e geyser criovulcanici: il {ordinal} pianeta di {system} sembra morto solo a chi non guarda sotto la crosta.",
    ],
    detail: [
      "Getti d'acqua salata eruttano dalle fratture polari fino all'orbita bassa, ricadendo come neve fine.",
      "Il riscaldamento mareale dei satelliti mantiene liquido l'oceano interno, profondo decine di chilometri.",
      "Durante il lungo inverno l'atmosfera stessa congela e ricade sulla superficie come brina d'azoto.",
      "Le aurore sono così intense da proiettare ombre sul ghiaccio anche nella notte più profonda.",
    ],
    climate: [
      "Glaciale perenne, con venti catabatici che scendono dagli altipiani a velocità da uragano.",
      "Freddo estremo, con un breve disgelo estivo all'equatore che forma laghi di acqua salmastra.",
      "Gelido e stabile; tormente di cristalli di ghiaccio che riducono la visibilità a pochi metri.",
    ],
    atmosphere: [
      { short: "Sottile, azotata", desc: "Azoto e tracce di metano; irrespirabile e abbastanza fredda da cristallizzare l'umidità del respiro." },
      { short: "Respirabile, gelida", desc: "Ossigeno sufficiente, ma a temperature che bruciano i polmoni senza riscaldatori d'aria." },
      { short: "Stagionale", desc: "Si forma d'estate per sublimazione del ghiaccio e ricade al suolo d'inverno." },
    ],
    temperature: ["−85 °C medi", "−40 °C medi", "−130 °C medi", "−20 °C all'equatore"],
    flora: [
      { label: "sottoghiaccio", kind: "Alga criofila", desc: "Venature verde scuro visibili nel ghiaccio trasparente, dove la luce filtra abbastanza per la fotosintesi." },
      { label: "dei geyser", kind: "Colonia chemiosintetica", desc: "Pinnacoli minerali abitati da microrganismi attorno alle bocche criovulcaniche." },
      { label: "a lanterna", kind: "Fungo bioluminescente", desc: "Cresce nelle caverne di ghiaccio e ne illumina le pareti di azzurro; si nutre di sali trasportati dall'acqua di fusione." },
      { label: "di disgelo", kind: "Muschio stagionale", desc: "Ricopre in pochi giorni le rive dei laghi estivi, poi si incista e sopravvive congelato per il resto dell'anno." },
    ],
    fauna: [
      { label: "delle fratture", kind: "Predatore criofilo", desc: "Corpo allungato e privo di occhi, si muove nell'acqua salata delle fratture cacciando per vibrazione." },
      { label: "a pelliccia", kind: "Erbivoro migratore", desc: "Mandrie di grandi animali dal pelo cavo e isolante che attraversano gli altipiani seguendo il disgelo." },
      { label: "d'oceano nero", kind: "Fauna abissale", desc: "Organismi traslucidi dell'oceano interno, rilevati solo dalle telecamere delle sonde di perforazione." },
      { label: "scavaghiaccio", kind: "Tunnellatore", desc: "Scioglie il ghiaccio con secrezioni calde e scava gallerie abitate da intere colonie." },
      { label: "d'aurora", kind: "Volatore elettrico", desc: "Piccolo e luminescente, sembra orientarsi seguendo le aurore; si raduna in stormi prima delle tempeste magnetiche." },
    ],
    noLife: "Nessuna forma di vita rilevata in superficie. L'oceano sotto la crosta resta inesplorato: le perforazioni non hanno ancora raggiunto l'acqua liquida.",
    hazards: [
      { name: "Crepacci nascosti", desc: "Ponti di neve sottile coprono fratture profonde chilometri; i sensori a penetrazione sono obbligatori." },
      { name: "Venti catabatici", desc: "Masse d'aria gelida che scendono dagli altipiani a oltre duecento chilometri orari, senza preavviso." },
      { name: "Geyser criovulcanici", desc: "Eruzioni improvvise di acqua e ghiaccio a pressione, capaci di scagliare blocchi a centinaia di metri." },
      { name: "Ipotermia di sistema", desc: "Batterie, lubrificanti e giunti si degradano in fretta; un guasto al riscaldamento della tuta è fatale in minuti." },
      { name: "Tormente di cristalli", desc: "Visibilità azzerata e cristalli taglienti trasportati dal vento; perdersi a venti metri dal campo è comune." },
    ],
    scans: [
      { title: "Oceano sotterraneo", desc: "La sismologia conferma un oceano liquido sotto diciotto chilometri di ghiaccio, con un volume superiore a tutti i mari terrestri." },
      { title: "Calore localizzato", desc: "Un punto caldo sotto la calotta sud mantiene un lago liquido a pochi metri dalla superficie. Troppo stabile per essere vulcanico." },
      { title: "Ombra nel ghiaccio", desc: "A tre chilometri di profondità il radar mostra una sagoma lunga quattrocento metri, affusolata, intrappolata nel ghiaccio antico." },
      { title: "Composti organici nei geyser", desc: "I getti polari contengono amminoacidi complessi: qualcosa, là sotto, è vivo o lo è stato." },
      { title: "Luci sotto la crosta", desc: "Durante l'inverno, dalle fratture filtra una luminescenza pulsante che le sonde non riescono a riprendere da vicino." },
    ],
    pois: [
      { name: "Frattura di {root}", desc: "Crepaccio lunghissimo da cui eruttano i geyser salati." },
      { name: "Altopiano {root}", desc: "Ghiacciaio spazzato dai venti catabatici." },
      { name: "Lago di {root}", desc: "Lago liquido sotto la calotta, sede di un'anomalia termica." },
      { name: "Caverne di {root}", desc: "Grotte di ghiaccio illuminate da funghi bioluminescenti." },
    ],
  },

  giungla: {
    gravity: [0.8, 1.5],
    dayHours: [20, 34],
    lifeChance: 1,
    risk: { Bassa: 1, Moderata: 3, Elevata: 4, Estrema: 2 },
    intro: [
      "{name} è il {ordinal} pianeta del sistema {system} ed è ricoperto da una foresta continua che scala montagne e affonda radici negli oceani poco profondi.",
      "Il {ordinal} pianeta di {system} è verde, caldo e rumoroso. Su {name} la biomassa per metro quadro supera di dieci volte quella delle foreste pluviali terrestri.",
      "Da orbita {name} sembra velluto verde scuro. Il {ordinal} pianeta di {system} è una giungla stratificata, dove il suolo non vede luce da milioni di anni.",
    ],
    detail: [
      "Gli alberi più alti superano i quattrocento metri e ospitano ecosistemi sospesi che non toccano mai terra.",
      "Una rete di funghi sotterranei collega intere foreste scambiando nutrienti e, forse, informazioni.",
      "Le piogge sono quotidiane e brevi; l'umidità costante alimenta nebbie che salgono dalle valli ogni mattina.",
      "La competizione tra specie è così feroce che quasi ogni pianta è velenosa, spinosa o carnivora.",
    ],
    climate: [
      "Tropicale umido su tutto il pianeta, con piogge quotidiane e temperature quasi costanti.",
      "Caldo e piovoso, con una stagione dei monsoni che allaga le foreste di pianura per mesi.",
      "Umido e nebbioso nelle valli, temperato sugli altopiani coperti di foresta nana.",
    ],
    atmosphere: [
      { short: "Respirabile, ricca", desc: "Ossigeno al 28%, spore e pollini in sospensione: respirabile, ma i filtri anti-allergeni sono indispensabili." },
      { short: "Densa, umida", desc: "Pressione alta e umidità satura; la voce si propaga lontano e i suoni della foresta non si fermano mai." },
      { short: "Respirabile, sporigena", desc: "Composizione vicina allo standard, ma carica di spore fungine di effetto sconosciuto sull'organismo umano." },
    ],
    temperature: ["+31 °C medi", "+27 °C medi", "+36 °C medi"],
    flora: [
      { label: "colonnare", kind: "Albero titanico", desc: "Tronchi larghi come edifici e alti oltre quattrocento metri; le chiome formano un secondo suolo sospeso." },
      { label: "a rete", kind: "Micelio planetario", desc: "Rete fungina che collega le radici di intere foreste; segnali elettrici la attraversano più veloci di quanto dovrebbero." },
      { label: "a trappola", kind: "Pianta carnivora", desc: "Fiori larghi due metri che imitano l'odore di acqua fresca; digeriscono animali di taglia media in pochi giorni." },
      { label: "lucciola", kind: "Epifita bioluminescente", desc: "Ricopre i rami più alti e si accende al tramonto, trasformando la volta in un cielo stellato artificiale." },
      { label: "strangolatrice", kind: "Liana predatrice", desc: "Si muove lentamente verso fonti di calore; nei campi base va potata ogni giorno." },
      { label: "a spore rosse", kind: "Fungo psicoattivo", desc: "Rilascia nubi di spore che causano allucinazioni condivise tra chi le respira insieme." },
    ],
    fauna: [
      { label: "delle chiome", kind: "Primate a sei arti", desc: "Vive in gruppi sociali complessi nella volta; usa strumenti rudimentali e sembra riconoscere le tute umane." },
      { label: "d'agguato", kind: "Predatore mimetico", desc: "Pelle che replica colori e trame della corteccia; i sensori termici sono l'unico modo di individuarlo." },
      { label: "tuono", kind: "Megaerbivoro", desc: "Animale colossale che apre sentieri abbattendo alberi; il suo richiamo si sente a decine di chilometri." },
      { label: "sciame", kind: "Insetto collettivo", desc: "Nubi di insetti che agiscono come un unico organismo, capaci di spolpare un animale in minuti." },
      { label: "planante", kind: "Rettile volatore", desc: "Membrane colorate tra gli arti, plana da un albero titanico all'altro; molto territoriale in stagione riproduttiva." },
      { label: "del sottobosco", kind: "Anfibio velenoso", desc: "Colori sgargianti e secrezioni cutanee paralizzanti; basta toccare dove è passato per sentire gli effetti." },
      { label: "tessitore", kind: "Aracnide architetto", desc: "Costruisce reti tra i tronchi larghe centinaia di metri, così resistenti da fermare un drone." },
    ],
    noLife: "Dati anomali: la vegetazione è rigogliosa ma nessuna fauna è stata rilevata. Il Reparto Scientifico ha richiesto nuove scansioni.",
    hazards: [
      { name: "Patogeni sconosciuti", desc: "Batteri e funghi capaci di colonizzare tessuti umani; la quarantena dopo lo sbarco è obbligatoria." },
      { name: "Predatori mimetici", desc: "Cacciatori invisibili a occhio nudo; le perdite tra le squadre di rilevamento sono le più alte del settore." },
      { name: "Spore psicoattive", desc: "Nubi di spore che alterano percezione e giudizio; più di una squadra si è persa seguendo allucinazioni." },
      { name: "Flora aggressiva", desc: "Liane, spine e piante carnivore rendono ogni campo base un assedio lento." },
      { name: "Alluvioni monsoniche", desc: "In poche ore i fiumi crescono di decine di metri, spazzando via equipaggiamento e sentieri." },
      { name: "Sciami", desc: "Insetti collettivi attratti dal calore dei generatori; possono intasare filtri e prese d'aria in minuti." },
    ],
    scans: [
      { title: "Attività della rete micelica", desc: "La rete fungina ha aumentato l'attività elettrica del 400% nella regione dello sbarco, per poi tornare normale alla partenza della squadra." },
      { title: "Radura geometrica", desc: "Una radura perfettamente esagonale nel cuore della foresta, dove nulla cresce. Il suolo è sterile ma non contaminato." },
      { title: "Utensili primitivi", desc: "Oggetti di pietra e osso lavorati trovati sotto la volta: i primati a sei arti potrebbero essere una specie pre-senziente." },
      { title: "Composti medicinali", desc: "Estratti di corteccia con proprietà rigenerative straordinarie. Tre corporazioni farmaceutiche hanno già chiesto i campioni." },
      { title: "Rovine inglobate", desc: "Strutture di pietra completamente avvolte dalle radici degli alberi titanici; stima di età superiore ai diecimila anni." },
    ],
    pois: [
      { name: "Colonne di {root}", desc: "Foresta di alberi titanici con ecosistema sospeso." },
      { name: "Radura di {root}", desc: "Radura esagonale sterile, di origine sconosciuta." },
      { name: "Delta di {root}", desc: "Pianura alluvionale invasa dai monsoni." },
      { name: "Rovine di {root}", desc: "Strutture antiche inglobate dalle radici." },
    ],
  },

  tossico: {
    gravity: [0.8, 1.3],
    dayHours: [30, 120],
    lifeChance: 0.6,
    risk: { Elevata: 2, Estrema: 3 },
    intro: [
      "{name}, {ordinal} pianeta del sistema {system}, è avvolto da nubi giallo-verdi di acido e zolfo. Sotto, pianure corrose e laghi dal colore innaturale.",
      "Il {ordinal} pianeta di {system} è un laboratorio chimico a cielo aperto: {name} ha un'atmosfera che scioglie il metallo e piogge che bruciano la roccia.",
    ],
    detail: [
      "L'effetto serra ha portato la superficie a temperature capaci di fondere il piombo.",
      "I laghi di acido solforico riflettono la luce in toni verdi visibili anche dall'orbita.",
      "Nonostante tutto, alcune molecole organiche complesse sono state rilevate nelle nubi alte, dove temperatura e pressione sono più miti.",
    ],
    climate: [
      "Serra estrema, con piogge acide che evaporano prima di toccare il suolo.",
      "Caldo e corrosivo, con tempeste di nubi solforiche che ruotano più veloci del pianeta stesso.",
    ],
    atmosphere: [
      { short: "Corrosiva", desc: "Anidride carbonica densa, nubi di acido solforico e cloro: letale in pochi secondi senza scafandro pesante." },
      { short: "Tossica, densa", desc: "Pressione novanta volte lo standard terrestre, carica di composti di zolfo." },
    ],
    temperature: ["+420 °C in superficie", "+180 °C medi"],
    flora: [
      { label: "delle nubi", kind: "Aeroplancton acidofilo", desc: "Microrganismi sospesi negli strati alti delle nubi, dove l'acido è più diluito; colorano il cielo di verde." },
      { label: "a crosta", kind: "Colonia minerale", desc: "Croste gialle di zolfo biologico sulle rive dei laghi acidi, che crescono a strati come stromatoliti." },
      { label: "silicea", kind: "Organismo al silicio", desc: "Strutture ramificate che resistono a temperature che distruggerebbero qualsiasi molecola di carbonio." },
    ],
    fauna: [
      { label: "d'acido", kind: "Filtratore aereo", desc: "Sacche galleggianti con pareti di silice che filtrano l'aeroplancton negli strati alti." },
      { label: "sulfureo", kind: "Scavatore termofilo", desc: "Organismo corazzato che vive vicino alle bocche vulcaniche, nutrendosi di composti di zolfo." },
    ],
    noLife: "Nessuna forma di vita rilevata. La chimica di superficie distrugge qualsiasi molecola organica in pochi secondi.",
    hazards: [
      { name: "Atmosfera corrosiva", desc: "L'acido attacca guarnizioni e visori in minuti; servono scafandri pesanti in leghe speciali." },
      { name: "Pressione schiacciante", desc: "La pressione al suolo equivale a novecento metri sotto il mare terrestre." },
      { name: "Calore infernale", desc: "Le temperature di superficie mandano in crisi qualsiasi sistema di raffreddamento portatile." },
      { name: "Fulmini acidi", desc: "Scariche continue nelle nubi, abbastanza potenti da mettere fuori uso i sensori di una nave in orbita bassa." },
    ],
    scans: [
      { title: "Molecole organiche nelle nubi", desc: "Fosfina e composti complessi negli strati alti delle nubi: la firma chimica di un possibile metabolismo." },
      { title: "Fosse di vetro", desc: "Crateri dalle pareti vetrificate e lisce, disposti in linea retta per ottocento chilometri." },
      { title: "Sonda sopravvissuta", desc: "Un lander terrestre dato per distrutto trasmette ancora un segnale di stato, anni dopo il limite teorico di resistenza." },
    ],
    pois: [
      { name: "Laghi di {root}", desc: "Distese di acido solforico dal riflesso verde." },
      { name: "Fosse di {root}", desc: "Crateri vetrificati allineati di origine incerta." },
      { name: "Bocche di {root}", desc: "Campo vulcanico attivo, habitat degli scavatori termofili." },
    ],
  },

  gg: {
    gravity: [1.8, 3.2],
    dayHours: [8, 16],
    lifeChance: 0.4,
    risk: { Moderata: 2, Elevata: 4, Estrema: 3 },
    intro: [
      "{name} è il {ordinal} pianeta del sistema {system}: un gigante gassoso fasciato da bande color crema e ruggine, senza superficie solida su cui posarsi.",
      "Il {ordinal} pianeta di {system} è un colosso di idrogeno ed elio. {name} irradia più calore di quanto ne riceva dalla sua stella e ruota così in fretta da apparire schiacciato ai poli.",
      "{name}, {ordinal} pianeta di {system}, è un mondo di nubi stratificate e tempeste più grandi di interi pianeti rocciosi.",
    ],
    detail: [
      "Una tempesta ovale, attiva da secoli, domina l'emisfero sud e potrebbe contenere tre Terre.",
      "La magnetosfera è così intensa da rendere letali le orbite basse per qualsiasi nave non schermata.",
      "Tra gli strati di nubi esiste una fascia temperata dove pressione e temperatura sono simili a quelle di un mondo abitabile.",
      "Il suo sistema di satelliti è quasi un sistema solare in miniatura, e le sue lune sono più interessanti del pianeta stesso.",
    ],
    climate: [
      "Correnti a getto opposte che scorrono a oltre cinquecento chilometri orari, separate da turbolenze violentissime.",
      "Tempeste perenni e fulmini grandi come continenti negli strati di nubi d'acqua.",
      "Bande atmosferiche stabili da millenni, interrotte da vortici che nascono e muoiono in pochi giorni.",
    ],
    atmosphere: [
      { short: "Idrogeno-elio", desc: "Idrogeno ed elio con nubi di ammoniaca, idrosolfuro d'ammonio e acqua a strati sempre più profondi." },
      { short: "Idrogeno, metano", desc: "Idrogeno dominante con tracce di metano e composti organici che colorano le bande." },
    ],
    temperature: ["−110 °C alla sommità delle nubi", "−140 °C alla sommità delle nubi", "+20 °C nella fascia temperata"],
    flora: [
      { label: "dei venti", kind: "Aeroplancton", desc: "Minuscoli organismi fotosintetici trasportati dalle correnti; colorano alcune bande di sfumature rossastre." },
      { label: "a zattera", kind: "Tappeto sporigeno", desc: "Reti di filamenti larghe chilometri che galleggiano nella fascia temperata trattenendo gas caldi." },
    ],
    fauna: [
      { label: "galleggiante", kind: "Galleggiatore", desc: "Organismo simile a una mongolfiera vivente largo mezzo chilometro: scalda l'idrogeno interno per restare in quota e filtra l'aeroplancton." },
      { label: "cacciatore", kind: "Predatore aereo", desc: "Veloce e affusolato, caccia in branco i galleggiatori sfruttando le correnti a getto." },
      { label: "sprofondatore", kind: "Organismo discendente", desc: "Minuscolo e numerosissimo, si nutre in quota finché cresce troppo e sprofonda negli strati caldi, dove muore e rilascia nutrienti." },
      { label: "fulminivoro", kind: "Colonia elettrica", desc: "Si raduna attorno alle celle temporalesche e assorbe energia dai fulmini; brilla per ore dopo ogni tempesta." },
    ],
    noLife: "Nessuna forma di vita rilevata nelle nubi. Il Reparto Scientifico non esclude organismi negli strati più profondi, oltre la portata delle sonde.",
    hazards: [
      { name: "Nessuna superficie", desc: "Qualsiasi mezzo che perda quota continua a scendere fino a essere schiacciato dalla pressione." },
      { name: "Fasce di radiazione", desc: "La magnetosfera intrappola particelle ad altissima energia: pochi minuti in orbita bassa bruciano l'elettronica non schermata." },
      { name: "Correnti a getto", desc: "Venti opposti che possono strappare un aerostato in due lungo la linea di taglio." },
      { name: "Fulmini planetari", desc: "Scariche mille volte più potenti di quelle terrestri, capaci di vaporizzare una sonda." },
      { name: "Gravità elevata", desc: "Rientrare in orbita dagli strati alti richiede spinte che pochi scafi leggeri possono garantire." },
    ],
    scans: [
      { title: "Fascia abitabile", desc: "Strato di nubi a pressione e temperatura compatibili con la vita terrestre, largo venti chilometri. Candidato per stazioni galleggianti." },
      { title: "Riserve di elio-3", desc: "Concentrazione di elio-3 sufficiente a rifornire flotte intere di reattori a fusione per secoli." },
      { title: "Sagome nelle nubi", desc: "Oggetti lenticolari larghi centinaia di metri si muovono controvento nella fascia temperata. Organici, secondo lo spettrometro." },
      { title: "Segnale dal vortice", desc: "Un'emissione radio modulata proviene dal centro della grande tempesta; si interrompe ogni volta che una sonda si avvicina." },
      { title: "Anelli anomali", desc: "Parte del materiale degli anelli ha composizione metallica raffinata, incompatibile con la formazione naturale." },
    ],
    pois: [
      { name: "Occhio di {root}", desc: "Grande tempesta ovale attiva da secoli." },
      { name: "Banda di {root}", desc: "Corrente a getto equatoriale, la più veloce del pianeta." },
      { name: "Fascia temperata {root}", desc: "Strato di nubi dove vivono i galleggiatori." },
      { name: "Aurora di {root}", desc: "Anello aurorale polare generato dalla magnetosfera." },
    ],
  },

  gh: {
    gravity: [1.0, 1.6],
    dayHours: [14, 20],
    lifeChance: 0.2,
    risk: { Moderata: 3, Elevata: 4, Estrema: 2 },
    intro: [
      "{name} è il {ordinal} pianeta del sistema {system}: un gigante di ghiaccio blu, fatto di acqua, ammoniaca e metano compressi sotto un velo di nubi quasi senza tratti.",
      "Il {ordinal} pianeta di {system} è freddo, lontano e tinto di azzurro dal metano. {name} nasconde un mantello di ghiacci ad alta pressione più caldo di quanto la sua superficie lasci supporre.",
      "{name}, {ordinal} pianeta di {system}, è un gigante di ghiaccio con l'asse inclinato in modo estremo: ogni polo vive decenni di luce seguiti da decenni di buio.",
    ],
    detail: [
      "Nel mantello profondo la pressione è tale che, secondo i modelli, il carbonio precipita come pioggia di diamanti.",
      "Venti supersonici attraversano l'atmosfera nonostante la scarsa energia ricevuta dalla stella.",
      "Il campo magnetico è inclinato e disassato rispetto all'asse di rotazione, generando aurore imprevedibili.",
      "Un sistema di anelli scuri e sottili, fatti di ghiaccio e polvere carbonizzata, lo circonda quasi invisibile.",
    ],
    climate: [
      "Venti supersonici e tempeste scure che compaiono e scompaiono nell'arco di mesi.",
      "Stagioni lunghissime dovute all'inclinazione dell'asse; atmosfera superiore quasi immobile.",
    ],
    atmosphere: [
      { short: "Idrogeno, metano", desc: "Idrogeno ed elio, con metano che assorbe il rosso e tinge il pianeta di blu." },
      { short: "Metano, ammoniaca", desc: "Nubi di metano ghiacciato sopra strati di ammoniaca e idrosolfuro." },
    ],
    temperature: ["−200 °C alla sommità delle nubi", "−215 °C alla sommità delle nubi", "−190 °C alla sommità delle nubi"],
    flora: [
      { label: "criogenica", kind: "Aeroplancton al metano", desc: "Ipotetici organismi a base di metano liquido rilevati come anomalie spettrali negli strati freddi." },
    ],
    fauna: [
      { label: "di vento blu", kind: "Veleggiatore criogenico", desc: "Forme lente e sottilissime, larghe chilometri, che sembrano scivolare sulle correnti supersoniche. Mai osservate da vicino." },
    ],
    noLife: "Nessuna forma di vita rilevata. Le temperature estreme rendono improbabile qualsiasi biochimica conosciuta.",
    hazards: [
      { name: "Venti supersoniche", desc: "Correnti oltre i duemila chilometri orari che rendono impossibile qualsiasi discesa controllata." },
      { name: "Freddo assoluto", desc: "Temperature vicine ai limiti di funzionamento di scafi, lubrificanti e batterie." },
      { name: "Magnetosfera disassata", desc: "Tempeste magnetiche improvvise che mandano in tilt navigazione e comunicazioni." },
      { name: "Anelli scuri", desc: "Detriti quasi invisibili ai sensori ottici: le rotte vanno tracciate solo con il radar." },
    ],
    scans: [
      { title: "Pioggia di diamanti", desc: "Le misure sismiche confermano cristalli di carbonio che precipitano nel mantello: una miniera irraggiungibile, per ora." },
      { title: "Oceano superionico", desc: "Nel mantello esiste acqua superionica, solida e conduttiva allo stesso tempo, responsabile del campo magnetico anomalo." },
      { title: "Macchia scura", desc: "Una tempesta scura grande quanto un continente è scomparsa in dodici giorni. Nessun modello ne spiega la dissoluzione." },
      { title: "Satellite catturato", desc: "Una delle lune orbita in senso retrogrado ed è quasi certamente un corpo catturato da un altro sistema." },
    ],
    pois: [
      { name: "Macchia di {root}", desc: "Grande tempesta scura dal comportamento imprevedibile." },
      { name: "Polo di {root}", desc: "Regione polare immersa in una notte lunga decenni." },
      { name: "Corrente {root}", desc: "Getto supersonico equatoriale." },
    ],
  },
};
