// Quorai — amphibious cephalopod-like merchant thalassocracy of the Zhorn
// galaxy (Quovar + Manoth systems). Speak with chromatophores (light/color
// patterns on the skin); flooded ships; desert worlds mined for the
// resonance salts that make their jump drives work.

export const QUORAI = {
  slug: 'quorai',
  name: 'Quorai',
  plural: 'Quorai',
  marketTheme: 'quorai',
  species: {
    summary: [
      "I Quorai sono anfibi a simmetria radiale, con un mantello muscoloso e otto braccia prensili disposte attorno a un becco corneo. Un adulto giovane misura poco più di un metro; gli anziani non smettono mai di crescere e superano i dieci metri.",
      "Non hanno corde vocali. Parlano con la pelle: milioni di cromatofori che cambiano colore, luminosità e trama in frazioni di secondo. Una conversazione tra Quorai è una tempesta di luce silenziosa, e i traduttori umani devono essere addestrati a leggerla con visori speciali.",
    ],
    traits: [
      "<strong>Respirazione:</strong> branchie interne e una sacca polmonare secondaria che permette qualche ora fuori dall'acqua, a patto di restare umidi.",
      "<strong>Cognizione:</strong> ogni braccio ospita un ganglio nervoso quasi autonomo. Un Quorai può contrattare con una mano e riparare un motore con un'altra.",
      "<strong>Ciclo vitale:</strong> nascono a milioni nelle acque di Revaix Cradle; pochissimi sopravvivono all'età adulta. La crescita non si arresta mai: dimensione e anzianità coincidono.",
      "<strong>Morte:</strong> i più anziani, troppo grandi per muoversi, si ancorano al fondale e diventano «Madri di Fondale», archivi viventi consultati per secoli.",
    ],
  },
  civilization: {
    government: [
      "Il potere appartiene al <strong>Concordato delle Maree</strong>, una rete di consigli dove il peso di ogni voce dipende letteralmente dalla stazza. Le decisioni più alte spettano alle Madri di Fondale, che però parlano lentamente: un loro verdetto può richiedere mesi di luce.",
      "Sotto di loro, le <strong>Correnti</strong> — Quorai giovani e mobili — commerciano, esplorano e combattono. Una Corrente che torna ricca da un viaggio cresce più in fretta, e sale di rango con il proprio corpo.",
    ],
    culture: [
      "<strong>Contratto come preghiera:</strong> un accordo commerciale viene scritto sulla pelle dei contraenti con pigmenti permanenti. Rompere un patto significa portarne la cicatrice cromatica per sempre.",
      "<strong>Estetica della luce:</strong> l'arte Quorai è fatta di sequenze luminose, «canti» di colore che possono durare giorni e che gli umani faticano persino a percepire tutte.",
      "<strong>Il Secco:</strong> ogni Quorai teme l'aria aperta. Lavorare sui mondi desertici è un sacrificio onorato, ricompensato con quote di sale di risonanza.",
    ],
    spaceflight: [
      "I Quorai viaggiano nello spazio da circa <strong>1.400 anni terrestri</strong> — molto prima dell'umanità. Le loro navi sono gusci allagati: gli equipaggi vivono immersi, e i ponti di comando sono vasche dove il pilota avvolge le braccia attorno ai comandi.",
      "Il salto FTL Quorai dipende dai <strong>sali di risonanza</strong>, cristalli che vibrano a frequenze precise quando sono disciolti in acqua ad alta pressione. I sali si trovano quasi solo nei letti di mari evaporati: per questo i Quorai, creature d'acqua, hanno colonizzato proprio i deserti.",
    ],
  },
  relations: [
    { race: "Terrestri", view: "Li chiamano «i Secchi». Clienti eccellenti e partner rumorosi, ma si espandono troppo in fretta e cambiano idea troppo spesso: un Terrestre non porta cicatrici dei patti che rompe." },
    { race: "Velmyr", view: "Rispettati per disciplina e parola data. Noiosi, dicono le Correnti, ma i contratti con i Velmyr sono i più sicuri della galassia." },
    { race: "Ythar", view: "Diffidenza profonda. Una nave-seme Ythar ha contaminato con spore un intero bacino di Revaix Cradle due secoli fa; il Concordato non ha mai accettato le scuse." },
    { race: "Coralith", view: "Ammirati e un po' temuti. I reticoli cristallini Coralith sono i migliori stabilizzatori per i sali di risonanza, ma i Coralith considerano i Quorai caotici e imprecisi." },
    { race: "Vaelun", view: "Oggetto di venerazione quasi religiosa: i galleggianti di Othouven Major sono visti come «mari che hanno imparato a volare». Nessuna Corrente tratta con un Vaelun senza offrire un dono." },
    { race: "Kheprani", view: "Concorrenti diretti nell'estrazione del sale. Le rotte di Ninhara e Quovar si incrociano, e le scaramucce tra convogli sono più frequenti di quanto il Concordato ammetta." },
    { race: "Nexari", view: "Paura. Le macchine non hanno pelle, non cambiano colore, non si capisce quando mentono. I Quorai commerciano con i Nexari solo attraverso intermediari." },
    { race: "Thissari", view: "Rapporti cordiali e distanti. I Thissari comprano acqua pesante e vendono vetro di Peraist; nessuno dei due popoli ama il clima dell'altro." },
    { race: "Ashkaari", view: "Pietà mescolata ad avidità. Gli archivi Ashkaari valgono una fortuna, e le Madri di Fondale li considerano la cosa più vicina a sé stesse fuori dal Concordato." },
  ],
  market: {
    title: "Emporio delle Correnti",
    tagline: "Prezzi in crediti · accettate perle di marea",
    filters: [
      { key: 'bio', label: 'Biotecnologia' },
      { key: 'scafi', label: 'Scafi & Vasche' },
      { key: 'mute', label: 'Mute & Sopravvivenza' },
      { key: 'sali', label: 'Sali di Risonanza' },
    ],
    products: [
      { cat: 'bio', icon: '🦑', name: "Innesto Cromatoforo", desc: "Pellicola viva applicata alla pelle umana: permette di emettere i colori base del linguaggio Quorai. Pruriginosa i primi mesi.", price: "3.600 crediti" },
      { cat: 'bio', icon: '🪸', name: "Corallo Guaritore", desc: "Colonia simbionte che richiude ferite superficiali in poche ore. Va tenuta in acqua salata o muore.", price: "780 crediti" },
      { cat: 'scafi', icon: '🐚', name: "Guscio da Corrente «Vel-Qor»", desc: "Nave leggera allagata per quattro Quorai o due passeggeri in muta. Sale di risonanza incluso per sei salti.", price: "212.000 crediti" },
      { cat: 'scafi', icon: '🫧', name: "Vasca di Salto Portatile", desc: "Modulo pressurizzato che converte una stiva standard in camera di risonanza Quorai.", price: "58.000 crediti" },
      { cat: 'mute', icon: '💧', name: "Mantello Umido", desc: "L'inverso di una tuta del deserto: trattiene acqua attorno al corpo invece di recuperarla. Standard sui mondi secchi.", price: "1.250 crediti" },
      { cat: 'mute', icon: '🤿', name: "Muta Abissale Classe Fondale", desc: "Permette a un umano di scendere fino a quattro chilometri nelle vasche cerimoniali. Ingombrante, affidabile.", price: "4.900 crediti" },
      { cat: 'sali', icon: '💎', name: "Sale di Risonanza Grezzo", desc: "Una dose da salto singolo, non stabilizzata. Illegale fuori dal territorio del Concordato.", price: "9.400 crediti" },
      { cat: 'sali', icon: '🔷', name: "Reticolo Stabilizzato", desc: "Sale di risonanza incastonato in un reticolo cristallino Coralith. Salti più precisi, prezzo più alto.", price: "16.800 crediti" },
    ],
  },
};

export const QUORAI_PLANETS = {
  'quovar-iii': {
    race: 'quorai',
    badge: "Mondo Natale Quorai",
    population: "~3,1 miliardi",
    description: [
      "Quoraix Halo è la culla dei Quorai e il cuore del Concordato delle Maree. Il nome deriva dall'alone luminoso che circonda il pianeta di notte: fioriture di plancton bioluminescente così vaste da essere visibili dall'orbita come un anello di luce.",
      "Le città Quorai non sono costruite ma coltivate: barriere coralline modellate per millenni, che scendono dalla superficie fino alle fosse abissali. I visitatori non acquatici restano confinati nelle «Bolle Secche», habitat pressurizzati ancorati alle scogliere.",
    ],
    places: [
      { name: "Fondale del Primo Patto", desc: "La fossa dove riposano le Madri di Fondale più antiche. Ogni decisione del Concordato viene «illuminata» qui prima di diventare legge." },
      { name: "Bolle Secche di Qor-Vel", desc: "Quartiere diplomatico per specie che respirano aria. Mercati, ambasciate e l'unico spazioporto aperto agli stranieri." },
      { name: "Anello di Luce", desc: "Fascia equatoriale di plancton bioluminescente, luogo di pellegrinaggio e di canti cromatici che durano intere stagioni." },
    ],
    characters: [
      { name: "Madre Ysqorra-Vaal", desc: "La più grande Madre di Fondale ancora cosciente, lunga oltre quaranta metri. Parla una frase ogni pochi giorni; il Concordato attende da due anni la fine del suo ultimo discorso." },
      { name: "Corrente Qeth-Imari", desc: "Ambasciatrice presso i Terrestri, cresciuta a vista d'occhio grazie ai contratti firmati con la Gilda dei Naviganti. Porta sulla pelle più patti di chiunque altro della sua età." },
      { name: "Vul-Soreth «Cicatrice»", desc: "Contrabbandiere di sali coperto di cicatrici cromatiche per i patti infranti. Nessun Quorai rispettabile lo guarda negli occhi, ma tutti sanno dove trovarlo." },
    ],
    legend: "Si racconta che la prima Madre di Fondale non sia mai morta, ma sia scesa oltre il fondo dell'oceano, in un mare più profondo di cui le sonde non trovano traccia. Alcuni canti cromatici la chiamano ancora.",
    pois: [
      { name: "Fondale del Primo Patto", lat: -12, lon: 40, desc: "Fossa sacra delle Madri di Fondale." },
      { name: "Bolle Secche di Qor-Vel", lat: 22, lon: -60, desc: "Habitat pressurizzati per stranieri e spazioporto." },
      { name: "Anello di Luce", lat: 2, lon: 150, desc: "Fioritura equatoriale di plancton bioluminescente." },
    ],
  },
  'manoth-i': {
    race: 'quorai',
    badge: "Mondo Nursery Quorai",
    population: "~8 miliardi (in massima parte larve)",
    description: [
      "Revaix Cradle è il mondo dove nascono i Quorai. Oceani caldi e poco profondi, lagune protette e un'unica stagione: ogni ciclo, miliardi di uova vengono deposte nelle sue acque, e le larve crescono lottando per la sopravvivenza.",
      "L'accesso agli stranieri è quasi totalmente vietato. Due secoli fa una nave-seme Ythar contaminò con le sue spore il Bacino di Seth-Varul, uccidendo una generazione intera: da allora le pattuglie del Concordato aprono il fuoco su qualsiasi scafo non autorizzato.",
    ],
    places: [
      { name: "Lagune Madri", desc: "Arcipelago di lagune calde dove avviene la deposizione. Sorvegliato da flotte di Correnti anziane." },
      { name: "Bacino di Seth-Varul", desc: "Area contaminata dalle spore Ythar, oggi zona morta e memoriale. Le sue acque sono ancora grigie." },
      { name: "Scogliere del Passaggio", desc: "Dove le larve sopravvissute escono per la prima volta dall'acqua e vengono accolte nel Concordato." },
    ],
    characters: [
      { name: "Guardiana Orr-Temessa", desc: "Comanda la flotta di quarantena. Ha perso metà della sua covata a Seth-Varul e non ha mai dimenticato." },
      { name: "Dottoressa Lena Farrow", desc: "Biologa terrestre, unica umana con permesso di ricerca permanente. Studia le spore Ythar nel bacino morto; molti Quorai la considerano una spia." },
    ],
    legend: "Le larve che sopravvivono alle Lagune Madri raccontano, una volta adulte, di aver sognato la stessa cosa: una luce enorme sotto il fondale. Nessun Quorai adulto accetta di parlarne con gli stranieri.",
    pois: [
      { name: "Lagune Madri", lat: 18, lon: 10, desc: "Arcipelago della deposizione." },
      { name: "Bacino di Seth-Varul", lat: -30, lon: 95, desc: "Zona contaminata dalle spore Ythar." },
      { name: "Scogliere del Passaggio", lat: 5, lon: -120, desc: "Luogo del primo approdo delle larve." },
    ],
  },
  'quovar-i': {
    race: 'quorai',
    badge: "Colonia Mineraria Quorai",
    population: "~40 milioni",
    description: [
      "Vendaem è un deserto rosso e antico, e per i Quorai è un inferno necessario. Sotto le sue saline riposa il più ricco giacimento di sali di risonanza del Concordato, abbastanza da alimentare la flotta per un millennio.",
      "Le colonie sono cupole allagate collegate da tubature: fuori, gli operai Quorai lavorano chiusi nei Mantelli Umidi, alternando turni brevi a lunghe immersioni di recupero. Le Correnti che servono qui tornano a casa ricche e, soprattutto, più grandi.",
    ],
    places: [
      { name: "Cupola Serqa-Nel", desc: "Il principale insediamento: un acquario grande come una città, sotto una volta di vetro opaco." },
      { name: "Saline del Tributo", desc: "Distese di sale dove si estraggono i cristalli di risonanza. Visibili dall'orbita come ferite bianche." },
      { name: "Posto di Guardia Kheth", desc: "Avamposto di confine eretto dopo gli scontri con i convogli Kheprani." },
    ],
    characters: [
      { name: "Sovrintendente Maal-Qorith", desc: "Gestisce le estrazioni con una rigidità quasi Coralith; ha quintuplicato la produzione e dimezzato il riposo degli operai." },
      { name: "Tessa Uriel", desc: "Ingegnera terrestre a contratto, progetta i Mantelli Umidi di nuova generazione. Si dice che sia l'unica umana a saper insultare in cromatico." },
    ],
    legend: "Gli operai dicono che nelle notti senza vento le saline si illuminano dei colori del linguaggio Quorai, come se il sale ricordasse il mare che lo ha lasciato.",
    pois: [
      { name: "Cupola Serqa-Nel", lat: 14, lon: -35, desc: "Principale insediamento allagato." },
      { name: "Saline del Tributo", lat: -8, lon: 60, desc: "Giacimento di sali di risonanza." },
      { name: "Posto di Guardia Kheth", lat: 40, lon: 130, desc: "Avamposto di confine." },
    ],
  },
  'quovar-iv': {
    race: 'quorai',
    badge: "Colonia Penale Quorai",
    population: "~6 milioni",
    description: [
      "Esorik è il luogo dove il Concordato manda chi ha infranto troppi patti. Un deserto di vetro nero e venti roventi, con giacimenti di sale poveri ma sufficienti a giustificare il lavoro forzato.",
      "La pena su Esorik si misura in acqua: ogni condannato riceve una razione che basta a stento a non seccarsi. I veterani sono piccoli, rattrappiti, coperti di cicatrici cromatiche — la crescita, per un Quorai, è la prima cosa che il Secco toglie.",
    ],
    places: [
      { name: "Pozzi di Ammenda", desc: "Miniere a cielo aperto dove lavorano i condannati, sorvegliate da droni Coralith noleggiati." },
      { name: "Cisterna Alta", desc: "L'unico serbatoio d'acqua del pianeta, fortezza e prigione insieme." },
      { name: "Distesa del Silenzio", desc: "Deserto aperto dove i fuggiaschi muoiono in poche ore. Nessuno vi luccica." },
    ],
    characters: [
      { name: "Custode Ren-Aveth", desc: "Direttore della colonia, famoso per concedere acqua extra in cambio di informazioni sui contrabbandieri." },
      { name: "«Il Pallido» Thoq", desc: "Condannato che ha perso ogni pigmento a forza di disidratazione. Guida una rete di evasioni verso le navi dei contrabbandieri." },
    ],
    legend: "Si dice che un intero equipaggio sia fuggito da Esorik attraversando la Distesa del Silenzio a piedi, chiuso in un'unica bolla d'acqua rubata. Il Concordato nega; i condannati ci contano ancora.",
    pois: [
      { name: "Pozzi di Ammenda", lat: -20, lon: -80, desc: "Miniere di lavoro forzato." },
      { name: "Cisterna Alta", lat: 10, lon: 20, desc: "Serbatoio-fortezza." },
      { name: "Distesa del Silenzio", lat: 35, lon: 110, desc: "Deserto aperto senza ripari." },
    ],
  },
  'manoth-iv': {
    race: 'quorai',
    badge: "Porto Franco Quorai",
    population: "~22 milioni",
    description: [
      "Wexioraaess è un deserto di altopiani e canyon, ma i Quorai lo hanno trasformato nel più grande mercato di confine della galassia di Zhorn. Qui il Concordato permette ciò che su Quoraix Halo sarebbe impensabile: commercio aperto con chiunque, domande poche.",
      "La città portuale scende a gradoni in un canyon allagato artificialmente. In alto le Bolle Secche per gli stranieri; in basso, nelle acque profonde, le trattative che contano davvero.",
    ],
    places: [
      { name: "Canyon di Wex-Tarra", desc: "Città portuale a gradoni in un canyon allagato: moli, vasche commerciali e bolle per stranieri." },
      { name: "Mercato delle Cicatrici", desc: "Dove i Quorai marchiati per patti infranti possono ancora commerciare. Tutto ha un prezzo, compresa la reputazione." },
      { name: "Faro Cromatico", desc: "Torre luminosa che trasmette in cromatico i prezzi dei sali a tutte le navi in orbita." },
    ],
    characters: [
      { name: "Mercante Sul-Vaqesh", desc: "Controlla metà dei moli. Grande quasi quanto una Madre di Fondale, ma rifiuta di ancorarsi: dice che il commercio è troppo divertente." },
      { name: "Capitano Idris Maro", desc: "Contrabbandiere terrestre con base fissa nel canyon; trasporta sali grezzi verso il territorio del Consorzio." },
      { name: "Kh'tessek", desc: "Emissario Kheprani, ufficialmente osservatore commerciale, ufficiosamente spia." },
    ],
    legend: "Sotto il canyon, secondo i portuali, esiste un secondo mercato più profondo, dove le Madri di Fondale in esilio vendono segreti del Concordato. Chi scende a cercarlo di solito torna — più povero.",
    pois: [
      { name: "Canyon di Wex-Tarra", lat: 25, lon: -10, desc: "Città portuale nel canyon allagato." },
      { name: "Mercato delle Cicatrici", lat: 20, lon: -5, desc: "Mercato dei marchiati." },
      { name: "Faro Cromatico", lat: 30, lon: -20, desc: "Torre di trasmissione dei prezzi." },
    ],
  },
};
