// Campaign data for Avaret. Edit this file to add sessions, items and places;
// avaret-campaign.js renders everything from these arrays.
//
// SESSIONS: one entry per game session (num must be unique and increasing).
// ITEMS:    things the party found. `session` = session it was found in,
//           `place` = id of the PLACES entry where it was found (optional),
//           `carried` = true while the party still has it with them.
// PLACES:   explored locations. `session` = session of the first visit.
// Places and items accept an optional `image` (path relative to avaret.html,
// e.g. 'resources/places/{id}.jpg'), shown in the detail dialog.

export const SESSIONS = [
  {
    num: 1,
    title: 'La Festa del Raccolto',
    date: '',
    summary: 'A Roccaquercia si celebra la festa del raccolto: chi cucina nella piazza grande, chi si gode una zuppa o una birra in santa pace. Poi un\'esplosione squarcia la quiete e il mulino prende fuoco. Correte ad aiutare la gente in pericolo, ma dentro la struttura in fiamme trovate soltanto due mephit, che vi attaccano. Li sconfiggete e ne catturate uno, ma la creatura sembra conoscervi e riesce a fuggire in cielo, lasciando cadere un medaglione con quattro simboli: una fiamma al centro, una padella, un guscio e una zampa. Una volpe del paese vi parla di una strana luce blu avvistata nel bosco; la seguite fino a una grotta, dove un laghetto incantato tenta di trattenervi in un\'estasi senza fine e una piccola tartaruga lascia un segno su Kay. Più in profondità, una sala porta sulle pareti gli stessi simboli del medaglione e, su un altare, un mazzo di carte con tre carte già girate. Un guardiano cerca di cacciarvi mentre le tre carte vengono divorate dalle fiamme; lo sconfiggete e girate l\'ultima carta: una figura incappucciata e un nome, «Il Quarto». Uscite dalla grotta con il mazzo, molte domande e poche risposte.',
  },
];

export const ITEMS = [
  {
    id: 'medaglione-quattro-simboli',
    name: 'Medaglione dei Quattro Simboli',
    type: 'gioiello',
    session: 1,
    place: 'mulino-roccaquercia',
    carried: true,
    image: 'resources/items/medaglione-quattro-simboli.jpg',
    description: 'Lasciato cadere dal mephit fuggito dal mulino in fiamme. Reca quattro simboli: una fiamma al centro, circondata da una padella, un guscio e una zampa. Tre di essi sembrano richiamare proprio voi; il quarto resta un mistero. Gli stessi simboli sono incisi sulle pareti della sala dell\'altare nella grotta.',
  },
  {
    id: 'mazzo-il-quarto',
    name: 'Mazzo di carte de «Il Quarto»',
    type: 'carte',
    session: 1,
    place: 'sala-altare',
    carried: true,
    image: 'resources/items/mazzo-il-quarto.jpg',
    description: 'Il mazzo trovato sull\'altare della grotta. Tre carte, girate a mostrare i simboli del medaglione, sono state divorate dalle fiamme all\'apparire del guardiano. L\'ultima carta rimasta raffigura una figura oscura e incappucciata, con sopra un nome: «Il Quarto».',
  },
  {
    id: 'segno-tartaruga',
    name: 'Segno della tartaruga',
    type: 'marchio',
    session: 1,
    place: 'lago-estatico',
    carried: true,
    description: 'Uno strano segno lasciato su Kay da una piccola tartaruga nei pressi del laghetto incantato. Il suo significato è ancora sconosciuto.',
  },
];

export const PLACES = [
  {
    id: 'roccaquercia',
    name: 'Roccaquercia',
    region: 'Città',
    session: 1,
    image: 'resources/places/roccaquercia.jpg',
    description: '«Tra le radici il domani.» La città in cui inizia il viaggio, cresciuta attorno alla Grande Quercia e protetta da mura, con la Cittadella, il Mercato Grande, la locanda La Quercia e il Boccale, il porto sul fiume e la Porta della Foresta. Durante la festa del raccolto la Piazza del Raccolto si riempie di cucine, zuppe e birra, finché l\'esplosione del Vecchio Mulino non interrompe i festeggiamenti.',
  },
  {
    id: 'mulino-roccaquercia',
    name: 'Il Vecchio Mulino',
    region: 'Roccaquercia',
    session: 1,
    description: 'Il mulino della città, sul fiume ai margini delle mura, avvolto dalle fiamme dopo un\'esplosione improvvisa. All\'interno non c\'era nessuno, se non due mephit che vi hanno attaccato. Uno è stato catturato ma è riuscito a fuggire in volo.',
  },
  {
    id: 'grotta-luce-blu',
    name: 'La Grotta della Luce Blu',
    region: 'Bosco di Quercia Nera',
    session: 1,
    description: 'Un\'apertura nel bosco che conduce a una caverna, trovata seguendo le voci di una strana luce blu riferite da una volpe di Roccaquercia.',
  },
  {
    id: 'lago-estatico',
    name: 'Il Laghetto Incantato',
    region: 'Grotta della Luce Blu',
    session: 1,
    description: 'Un laghetto molto strano all\'interno della grotta: chi gli si avvicina viene colto da un\'estasi profonda e da un completo rilassamento, e desidera restare lì il più a lungo possibile. Qui una piccola tartaruga ha lasciato il suo segno su Kay.',
  },
  {
    id: 'sala-altare',
    name: 'La Sala dell\'Altare',
    region: 'Grotta della Luce Blu',
    session: 1,
    description: 'Una stanza nel cuore della grotta. Sulle pareti sono incisi i simboli del medaglione; su un altare giaceva un mazzo di carte. Un guardiano è apparso per allontanarvi, ma è stato sconfitto.',
  },
];
