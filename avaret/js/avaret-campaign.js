import { SESSIONS, ITEMS, PLACES } from './avaret-data.js';

// Glyph shown in each inventory slot, by item type.
const TYPE_GLYPHS = {
  arma: '⚔',
  armatura: '⛨',
  chiave: '⚷',
  documento: '✉',
  reliquia: '✧',
  pozione: '⚗',
  gioiello: '◈',
  moneta: '◎',
  strumento: '⚒',
  carte: '♠',
  marchio: '☉',
};
const DEFAULT_GLYPH = '✦';

const placeById = new Map(PLACES.map(p => [p.id, p]));
const itemById = new Map(ITEMS.map(i => [i.id, i]));

const glyphFor = item => TYPE_GLYPHS[item.type] || DEFAULT_GLYPH;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

// ── DETAIL DIALOG ──
const dialog = document.getElementById('detail-dialog');
const dialogBody = dialog.querySelector('.detail-body');

function openDetail(kind, id) {
  const entry = kind === 'item' ? itemById.get(id) : placeById.get(id);
  if (!entry) return;
  const content = kind === 'item' ? itemDetail(entry) : placeDetail(entry);
  // Text goes in its own column so it stays readable next to the image.
  const text = el('div', 'detail-text');
  const image = content.querySelector('.detail-image');
  if (image) image.remove();
  text.append(content);
  dialogBody.replaceChildren(...(image ? [image, text] : [text]));
  dialog.classList.toggle('has-image', Boolean(entry.image));
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

// Image links to the full-size file so maps can be inspected in detail.
function detailImage(entry) {
  const link = el('a', 'detail-image');
  link.href = entry.image;
  link.target = '_blank';
  link.rel = 'noopener';
  const img = el('img');
  img.src = entry.image;
  img.alt = entry.name;
  link.append(img);
  return link;
}

function itemDetail(item) {
  const frag = document.createDocumentFragment();
  if (item.image) frag.append(detailImage(item));
  else frag.append(el('div', 'detail-glyph', glyphFor(item)));
  frag.append(el('p', 'detail-tag', `Oggetto · ${item.type || 'vario'}`));
  frag.append(el('h2', 'detail-title', item.name));
  frag.append(metaList([
    ['Trovato', `Sessione ${item.session}`],
    item.place && placeById.has(item.place) ? ['Luogo', placeLink(item.place)] : null,
    ['Stato', item.carried ? 'Con noi' : 'Non più con noi'],
  ]));
  frag.append(el('p', 'detail-desc', item.description));
  return frag;
}

function placeDetail(place) {
  const frag = document.createDocumentFragment();
  if (place.image) frag.append(detailImage(place));
  frag.append(el('p', 'detail-tag', `Luogo · ${place.region || 'regione ignota'}`));
  frag.append(el('h2', 'detail-title', place.name));
  frag.append(metaList([['Prima visita', `Sessione ${place.session}`]]));
  frag.append(el('p', 'detail-desc', place.description));
  const found = ITEMS.filter(i => i.place === place.id);
  if (found.length) {
    frag.append(el('p', 'detail-subhead', 'Oggetti trovati qui'));
    frag.append(chipRow(found.map(itemChip)));
  }
  return frag;
}

function metaList(rows) {
  const dl = el('dl', 'detail-meta');
  for (const row of rows.filter(Boolean)) {
    dl.append(el('dt', null, row[0]));
    const dd = el('dd');
    dd.append(row[1]);
    dl.append(dd);
  }
  return dl;
}

function placeLink(placeId) {
  const btn = el('button', 'inline-link', placeById.get(placeId).name);
  btn.type = 'button';
  btn.dataset.place = placeId;
  return btn;
}

// ── CHIPS (used in timeline and dialog) ──
function itemChip(item) {
  const chip = el('button', 'chip chip-item');
  chip.type = 'button';
  chip.dataset.item = item.id;
  chip.append(el('span', 'chip-glyph', glyphFor(item)), item.name);
  return chip;
}

function placeChip(place) {
  const chip = el('button', 'chip chip-place');
  chip.type = 'button';
  chip.dataset.place = place.id;
  chip.append(el('span', 'chip-glyph', '⌖'), place.name);
  return chip;
}

function chipRow(chips) {
  const row = el('div', 'chip-row');
  row.append(...chips);
  return row;
}

// ── TIMELINE ──
function renderTimeline() {
  const list = document.getElementById('timeline');
  const sessions = [...SESSIONS].sort((a, b) => b.num - a.num);
  if (!sessions.length) {
    list.append(el('p', 'empty-note', 'Nessuna sessione ancora registrata.'));
    return;
  }
  for (const s of sessions) {
    const entry = el('article', 'tl-entry');
    entry.append(el('div', 'tl-marker', toRoman(s.num)));
    const body = el('div', 'tl-body');
    const head = el('p', 'tl-eyebrow', `Sessione ${s.num}`);
    if (s.date) head.textContent += ` · ${s.date}`;
    body.append(head, el('h3', 'tl-title', s.title), el('p', 'tl-summary', s.summary));

    const places = PLACES.filter(p => p.session === s.num);
    const items = ITEMS.filter(i => i.session === s.num);
    if (places.length || items.length) {
      body.append(chipRow([...places.map(placeChip), ...items.map(itemChip)]));
    }
    entry.append(body);
    list.append(entry);
  }
}

// ── INVENTORY ──
function renderInventory() {
  const grid = document.getElementById('inventory');
  const carried = ITEMS.filter(i => i.carried);
  const lost = ITEMS.filter(i => !i.carried);
  document.getElementById('inventory-count').textContent = carried.length;

  if (!carried.length) grid.append(el('p', 'empty-note', 'Lo zaino è vuoto.'));
  for (const item of carried) grid.append(slot(item));

  const lostBox = document.getElementById('inventory-lost');
  if (lost.length) {
    lostBox.hidden = false;
    const lostGrid = lostBox.querySelector('.slot-grid');
    for (const item of lost) lostGrid.append(slot(item));
  }
}

function slot(item) {
  const btn = el('button', 'slot');
  btn.type = 'button';
  btn.dataset.item = item.id;
  btn.title = item.name;
  // Square frame holds the picture; the name sits below it so it is never cut off.
  const frame = el('span', 'slot-frame');
  if (item.image) {
    const img = el('img', 'slot-image');
    img.src = item.image;
    img.alt = '';
    frame.append(img);
  } else {
    frame.append(el('span', 'slot-glyph', glyphFor(item)));
  }
  btn.append(frame, el('span', 'slot-name', item.name));
  return btn;
}

// ── PLACES ──
function renderPlaces() {
  const list = document.getElementById('places');
  document.getElementById('places-count').textContent = PLACES.length;
  if (!PLACES.length) {
    list.append(el('p', 'empty-note', 'Nessun luogo ancora esplorato.'));
    return;
  }
  for (const place of [...PLACES].sort((a, b) => a.session - b.session)) {
    const btn = el('button', 'place-row');
    btn.type = 'button';
    btn.dataset.place = place.id;
    if (place.image) {
      const thumb = el('img', 'place-thumb');
      thumb.src = place.image;
      thumb.alt = '';
      btn.append(thumb);
      btn.classList.add('has-thumb');
    }
    const text = el('span', 'place-text');
    text.append(
      el('span', 'place-name', place.name),
      el('span', 'place-meta', `${place.region || 'Regione ignota'} · Sess. ${place.session}`),
    );
    btn.append(text);
    const li = el('li');
    li.append(btn);
    list.append(li);
  }
}

function toRoman(n) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [value, numeral] of map) while (n >= value) { out += numeral; n -= value; }
  return out;
}

function renderCounters() {
  document.getElementById('count-sessions').textContent = SESSIONS.length;
  document.getElementById('count-places').textContent = PLACES.length;
  document.getElementById('count-items').textContent = ITEMS.filter(i => i.carried).length;
}

// One delegated handler for every clickable item/place across the page and dialog.
document.addEventListener('click', e => {
  const target = e.target.closest('[data-item], [data-place]');
  if (target) {
    if (target.dataset.item) openDetail('item', target.dataset.item);
    else openDetail('place', target.dataset.place);
    return;
  }
  // Click on the backdrop (outside the dialog panel) closes it.
  if (e.target === dialog) dialog.close();
});
dialog.querySelector('.detail-close').addEventListener('click', () => dialog.close());

renderCounters();
renderTimeline();
renderInventory();
renderPlaces();
