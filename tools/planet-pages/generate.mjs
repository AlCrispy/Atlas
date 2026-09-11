// Generates the static planet encyclopedia pages in
// unknown-frontier/systems/planets/ from solar-system-data.js.
//
//   node tools/planet-pages/generate.mjs
//
// - Uninhabited planets: content assembled from per-classification pools in
//   type-lore.mjs with a per-slug seeded RNG (stable across runs).
// - Inhabited planets: planet + civilization content from races/*.mjs, plus
//   native biosphere/environment from the same type pools. Inhabited planets
//   with no race entry yet keep their current page.
// - Sol-system pages (Terra, Marte, ...) are hand-written and never touched.
//
// Output is plain HTML meant to be hand-editable afterwards; re-running the
// generator overwrites generated pages, so prefer editing the data files.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { TYPE_LORE, SCIENCE_SHIPS, RISK_ASSESSMENT } from './type-lore.mjs';
import { RACES, RACE_PLANETS } from './races/index.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '../../unknown-frontier');
const PLANETS_DIR = path.join(SITE, 'systems/planets');
const { SOLAR_SYSTEMS } = await import(pathToFileURL(path.join(SITE, 'js/solar-system-data.js')).href);
const { PLANET_TYPES } = await import(pathToFileURL(path.join(SITE, 'js/planet-types.js')).href);

const HAND_WRITTEN_SYSTEMS = new Set(['sistema-solare']);

// === Seeded helpers ===
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, list) {
  return list[Math.floor(rand() * list.length)];
}

function sample(rand, list, count) {
  const pool = [...list];
  const out = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return out;
}

function pickWeighted(rand, weights) {
  const entries = Object.entries(weights);
  let roll = rand() * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [key, w] of entries) {
    roll -= w;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function between(rand, [min, max]) {
  return min + rand() * (max - min);
}

const SYLLABLES = ['kha', 'vel', 'dro', 'sy', 'mir', 'tor', 'ath', 'quo', 'zen', 'ul', 'rek', 'iss', 'ven', 'oth', 'bra', 'ny', 'lor', 'sae', 'gri', 'thu', 'kor', 'ael', 'vas', 'ym', 'dra', 'nel', 'orr', 'ith'];

function alienRoot(rand) {
  const count = rand() < 0.6 ? 2 : 3;
  let word = '';
  for (let i = 0; i < count; i++) word += pick(rand, SYLLABLES);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const ORDINALS = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo', 'nono', 'decimo'];

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function fill(template, ctx, rand) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key === 'root' ? alienRoot(rand) : ctx[key] ?? `{${key}}`));
}

function formatDecimal(value, digits = 2) {
  return value.toFixed(digits).replace('.', ',');
}

function attrJson(value) {
  return JSON.stringify(value).replace(/&/g, '&amp;').replace(/'/g, '&#39;');
}

// === Shared markup ===
function head({ title, css, scripts }) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Unknown Frontier</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
${css.map((href) => `<link rel="stylesheet" href="../../css/${href}">`).join('\n')}
${scripts.map((src) => `<script src="../../js/${src}" defer></script>`).join('\n')}
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}
</script>
<script type="module" src="../../js/planet-globe.js"></script>
</head>`;
}

function topbar(system, planet, tabs) {
  const buttons = tabs
    .map(([id, label], i) => `    <button class="tab-btn${i === 0 ? ' active' : ''}" onclick="switchTab('${id}', this)">${label}</button>`)
    .join('\n');
  return `<div class="topbar">
  <a class="back-btn" href="../${system.slug}.html">← <span>${system.name}</span></a>
  <span class="topbar-planet-name">${planet.name}</span>
  <nav class="tabs-nav">
${buttons}
  </nav>
  <audio id="ambient-audio" src="../../music/Beyond-the-Nebula.mp3" loop preload="auto"></audio>
  <button type="button" id="audio-toggle" class="audio-toggle" aria-pressed="false" aria-label="Attiva o disattiva la musica">♪</button>
</div>`;
}

function stats(list) {
  return `<div class="system-stats">
${list.map(([label, value]) => `      <div class="system-stat">
        <span class="system-stat-label">${label}</span>
        <span class="system-stat-value">${value}</span>
      </div>`).join('\n')}
    </div>`;
}

function listItems(items) {
  return `<ul>\n${items.map((item) => `        <li>${item}</li>`).join('\n')}\n      </ul>`;
}

function globe(planet, pois, intro) {
  const ringAttr = planet.rings ? ` data-ring-color="${planet.ringColor || planet.color}"` : '';
  return `<section class="content-block">
      <h2>Visione Dettagliata</h2>
      <p>${intro}</p>
    </section>

    <div class="globe-viewport"
      data-slug="${planet.slug}" data-type="${planet.type}" data-color="${planet.color}" data-size="${planet.size}"${ringAttr}
      data-pois='${attrJson(pois)}'>
      <p class="globe-hint">Trascina per ruotare · Scroll per zoom · Click su un marker per info</p>
      <div class="poi-card">
        <button type="button" class="poi-card-close" aria-label="Chiudi">&times;</button>
        <p class="poi-card-eyebrow">Punto di Interesse</p>
        <h3 class="poi-card-title"></h3>
        <p class="poi-card-desc"></p>
      </div>
    </div>`;
}

function footer() {
  return `<script src="../../js/ambient-audio.js"></script>

</body>
</html>
`;
}

// Physical environment shared by both page kinds: a seeded roll per planet.
function rollEnvironment(system, planet, index, rand) {
  const lore = TYPE_LORE[planet.type] ?? TYPE_LORE.roccioso;
  const ctx = { name: planet.name, system: system.name, ordinal: ORDINALS[index] ?? `${index + 1}°` };
  const moons = planet.moons ?? [];
  return {
    lore,
    ctx,
    typeLabel: PLANET_TYPES[planet.type]?.label ?? 'Pianeta',
    intro: fill(pick(rand, lore.intro), ctx, rand),
    detail: fill(pick(rand, lore.detail), ctx, rand),
    climate: pick(rand, lore.climate),
    atmosphere: pick(rand, lore.atmosphere),
    temperature: pick(rand, lore.temperature),
    gravity: formatDecimal(between(rand, lore.gravity)),
    dayHours: Math.round(between(rand, lore.dayHours)),
    risk: pickWeighted(rand, lore.risk),
    hasLife: rand() < lore.lifeChance,
    moons,
    moonsLabel: moons.length === 0 ? 'Nessuno' : moons.length === 1 ? '1 rilevato' : `${moons.length} rilevati`,
  };
}

function environmentBlock(system, planet, env) {
  const items = [
    `<strong>Posizione:</strong> ${capitalize(env.ctx.ordinal)} pianeta del sistema ${system.name}, galassia ${system.galaxy}.`,
    `<strong>Clima:</strong> ${env.climate}`,
    `<strong>Atmosfera:</strong> ${env.atmosphere.desc}`,
    `<strong>Gravità:</strong> ${env.gravity} G.`,
    `<strong>Durata del giorno:</strong> circa ${env.dayHours} ore standard.`,
    `<strong>Satelliti:</strong> ${env.moons.length ? env.moons.map((m) => m.name).join(', ') : 'nessuno rilevato'}.`,
  ];
  if (planet.rings) items.push('<strong>Anelli:</strong> sistema di anelli visibile anche con strumenti ottici di bordo.');
  return `<section class="content-block">
      <h2>Ambiente & Orbita</h2>
      ${listItems(items)}
    </section>`;
}

function lifeEntries(rand, pool, count) {
  return sample(rand, pool, count).map((entry) => `<strong>${alienRoot(rand)} ${entry.label}</strong> <em>(${entry.kind})</em> — ${entry.desc}`);
}

// === Uninhabited page ===
function uninhabitedPage(system, planet, index) {
  const rand = mulberry32(hashString(planet.slug));
  const env = rollEnvironment(system, planet, index, rand);
  const { lore } = env;

  const pois = sample(rand, lore.pois, 3).map((poi) => ({
    name: fill(poi.name, env.ctx, rand),
    lat: Math.round(between(rand, [-60, 60])),
    lon: Math.round(between(rand, [-180, 180])),
    desc: poi.desc,
  }));

  const biosphere = env.hasLife
    ? `<section class="content-block">
      <h2>Flora</h2>
      ${listItems(lifeEntries(rand, lore.flora, Math.min(lore.flora.length, 2 + Math.floor(rand() * 2))))}
    </section>

    <section class="content-block">
      <h2>Fauna</h2>
      ${listItems(lifeEntries(rand, lore.fauna, Math.min(lore.fauna.length, 2 + Math.floor(rand() * 3))))}
    </section>`
    : `<section class="content-block">
      <h2>Biosfera</h2>
      <p>${lore.noLife}</p>
    </section>`;

  const hazardCount = env.risk === 'Elevata' || env.risk === 'Estrema' ? 4 : 3;
  const hazards = sample(rand, lore.hazards, hazardCount).map((h) => `<strong>${h.name}:</strong> ${h.desc}`);

  const scans = sample(rand, lore.scans, 2 + Math.floor(rand() * 2)).map((scan) => {
    const code = 1000 + Math.floor(rand() * 9000);
    return `<h3>RS-${code} · ${pick(rand, SCIENCE_SHIPS)}</h3>
      <p><strong>${scan.title}.</strong> ${scan.desc}</p>`;
  });

  return `${head({ title: planet.name, css: ['unknown-frontier.css', 'system-detail.css', 'planet-detail.css'], scripts: ['planet-tabs.js'] })}
<body class="system-detail-body">

${topbar(system, planet, [['panoramica', 'Panoramica'], ['globo', 'Visione Dettagliata'], ['biosfera', 'Biosfera'], ['pericoli', 'Pericoli'], ['rilevamenti', 'Rilevamenti']])}

<main>
  <div class="planet-content">

  <div id="tab-panoramica" class="tab-panel active">
    <div class="planet-header">
      <p class="placeholder-eyebrow">Pianeta · ${env.typeLabel}</p>
      <h1 class="placeholder-title">${planet.name}</h1>
      <span class="placeholder-badge">Non colonizzato</span>
    </div>

    ${stats([
      ['Classificazione', env.typeLabel],
      ['Satelliti', env.moonsLabel],
      ['Gravità', `${env.gravity} G`],
      ['Temperatura', env.temperature],
      ['Atmosfera', env.atmosphere.short],
      ['Pericolosità', env.risk],
    ])}

    <section class="content-block">
      <h2>Descrizione</h2>
      <p>${env.intro}</p>
      <p>${env.detail}</p>
    </section>

    ${environmentBlock(system, planet, env)}
  </div>

  <div id="tab-globo" class="tab-panel">
    ${globe(planet, pois, `Ricostruzione orbitale di ${planet.name} dai dati delle navi scientifiche. Trascina per ruotare, scroll per zoom, click su un marker per i punti rilevati.`)}
  </div>

  <div id="tab-biosfera" class="tab-panel">
    ${biosphere}
  </div>

  <div id="tab-pericoli" class="tab-panel">
    <section class="content-block">
      <h2>Pericoli Noti</h2>
      ${listItems(hazards)}
    </section>

    <section class="content-block">
      <h2>Valutazione del Reparto Scientifico</h2>
      <p>${fill(RISK_ASSESSMENT[env.risk], env.ctx, rand)}</p>
    </section>
  </div>

  <div id="tab-rilevamenti" class="tab-panel">
    <section class="content-block">
      <h2>Registro dei Rilevamenti</h2>
      <p>Estratti dai rapporti delle navi del Reparto Scientifico che hanno sorvolato ${planet.name}. I dati non verificati sono riportati così come trasmessi.</p>
      ${scans.join('\n      ')}
    </section>
  </div>

  </div>
</main>

${footer()}`;
}

// === Inhabited page ===
function marketBlock(race, planetData) {
  const { market } = race;
  const labels = Object.fromEntries(market.filters.map((f) => [f.key, f.label]));
  const products = [...market.products, ...(planetData.extraProducts ?? [])];
  const filterButtons = [{ key: 'tutti', label: 'Tutti' }, ...market.filters]
    .map((f, i) => `          <button type="button" class="market-filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>`)
    .join('\n');
  const cards = products.map((p) => `              <div class="product-card" data-category="${p.cat}">
                <div class="product-card-image">${p.icon}</div>
                <div class="product-card-body">
                  <span class="product-card-category">${labels[p.cat]}</span>
                  <span class="product-card-name">${p.name}</span>
                  <p class="product-card-desc">${p.desc}</p>
                  <span class="product-card-price">${p.price}</span>
                </div>
              </div>`).join('\n\n');

  // Terrestri colonies reuse Terra's industrial market verbatim (blast
  // door, no heading); every alien race gets a themed `.market-shell`.
  const industrial = race.marketTheme === 'industrial';
  const heading = industrial ? '' : `
        <div class="market-heading">
          <p class="market-title">${market.title}</p>
          <p class="market-tagline">${market.tagline}</p>
        </div>
`;

  return `<div id="tab-mercato" class="tab-panel market-page">
    <div class="${industrial ? 'market-industrial' : `market-shell market-${race.marketTheme}`}">
      <div class="${industrial ? 'market-industrial-body' : 'market-shell-body'}">${heading}
        <div class="market-filters">
${filterButtons}
        </div>

        <div class="market-carousel">
          <button type="button" class="market-carousel-arrow market-carousel-prev" aria-label="Prodotto precedente">‹</button>
          <div class="market-carousel-viewport">
            <div class="market-carousel-track">
${cards}
            </div>
          </div>
          <button type="button" class="market-carousel-arrow market-carousel-next" aria-label="Prodotto successivo">›</button>
        </div>

        <div class="market-carousel-dots"></div>
      </div>

      ${industrial
        ? `<div class="market-blast-door" aria-hidden="true">
        <div class="market-door-panel market-door-left"></div>
        <div class="market-door-panel market-door-right"></div>
      </div>`
        : '<div class="market-reveal" aria-hidden="true"><span></span><span></span><span></span></div>'}
    </div>
  </div>`;
}

function inhabitedPage(system, planet, index, planetData) {
  const race = RACES[planetData.race];
  const rand = mulberry32(hashString(planet.slug));
  const env = rollEnvironment(system, planet, index, rand);
  const { lore } = env;

  return `${head({
    title: planet.name,
    css: [
      'unknown-frontier.css', 'system-detail.css', 'planet-detail.css', 'market-industrial.css',
      ...(race.marketTheme === 'industrial' ? [] : ['market-shell.css', `market-${race.marketTheme}.css`]),
    ],
    scripts: ['planet-tabs.js', 'market-carousel.js'],
  })}
<body class="system-detail-body">

${topbar(system, planet, [['panoramica', 'Panoramica'], ['globo', 'Visione Dettagliata'], ['specie', 'Specie'], ['civilta', 'Civiltà'], ['relazioni', 'Relazioni'], ['luoghi', 'Luoghi & Personaggi'], ['mercato', 'Mercato']])}

<main>
  <div class="planet-content">

  <div id="tab-panoramica" class="tab-panel active">
    <div class="planet-header">
      <p class="placeholder-eyebrow">Pianeta · ${env.typeLabel}</p>
      <h1 class="placeholder-title">${planet.name}</h1>
      <span class="placeholder-badge">${planetData.badge}</span>
    </div>

    ${stats([
      ['Classificazione', env.typeLabel],
      ['Satelliti', env.moonsLabel],
      ['Specie dominante', race.name],
      ['Popolazione', planetData.population],
    ])}

    <section class="content-block">
      <h2>Descrizione</h2>
      ${planetData.description.map((p) => `<p>${p}</p>`).join('\n      ')}
    </section>

    ${environmentBlock(system, planet, env)}

    <section class="content-block">
      <h2>Biosfera Nativa</h2>
      <h3>Flora</h3>
      ${listItems(lifeEntries(rand, lore.flora, Math.min(lore.flora.length, 2)))}
      <h3>Fauna</h3>
      ${listItems(lifeEntries(rand, lore.fauna, Math.min(lore.fauna.length, 2)))}
    </section>
  </div>

  <div id="tab-globo" class="tab-panel">
    ${globe(planet, planetData.pois, `Vista orbitale ravvicinata di ${planet.name}. Trascina per ruotare, scroll per zoom, click su un marker per informazioni sul punto di interesse.`)}
  </div>

  <div id="tab-specie" class="tab-panel">
    <section class="content-block">
      <h2>${race.name}</h2>
      ${race.species.summary.map((p) => `<p>${p}</p>`).join('\n      ')}
      <h3>Biologia</h3>
      ${listItems(race.species.traits)}
    </section>
  </div>

  <div id="tab-civilta" class="tab-panel">
    <section class="content-block">
      <h2>Governo & Società</h2>
      ${race.civilization.government.map((p) => `<p>${p}</p>`).join('\n      ')}
      <h3>Cultura</h3>
      ${listItems(race.civilization.culture)}
    </section>

    <section class="content-block">
      <h2>Viaggi Spaziali</h2>
      ${race.civilization.spaceflight.map((p) => `<p>${p}</p>`).join('\n      ')}
    </section>
  </div>

  <div id="tab-relazioni" class="tab-panel">
    <section class="content-block">
      <h2>Rapporti con le Altre Civiltà</h2>
      <p>Come i ${race.plural} vedono i popoli conosciuti della Frontiera.</p>
      ${listItems(race.relations.map((r) => `<strong>${r.race}:</strong> ${r.view}`))}
    </section>
  </div>

  <div id="tab-luoghi" class="tab-panel">
    <section class="content-block">
      <h2>Luoghi Notevoli</h2>
      ${listItems(planetData.places.map((p) => `<strong>${p.name}:</strong> ${p.desc}`))}
    </section>

    <section class="content-block">
      <h2>Personaggi Notevoli</h2>
      ${listItems(planetData.characters.map((c) => `<strong>${c.name}:</strong> ${c.desc}`))}
    </section>

    <section class="content-block">
      <h2>Leggende e Segreti</h2>
      <p>${planetData.legend}</p>
    </section>
  </div>

  </div>

  ${marketBlock(race, planetData)}
</main>

${footer()}`;
}

// === Run ===
let uninhabited = 0;
let inhabited = 0;
const pendingInhabited = [];

for (const system of Object.values(SOLAR_SYSTEMS)) {
  if (HAND_WRITTEN_SYSTEMS.has(system.slug)) continue;
  system.planets.forEach((planet, index) => {
    const outFile = path.join(PLANETS_DIR, `${planet.slug}.html`);
    if (planet.inhabited) {
      const planetData = RACE_PLANETS[planet.slug];
      if (!planetData) {
        pendingInhabited.push(planet.slug);
        return;
      }
      writeFileSync(outFile, inhabitedPage(system, planet, index, planetData));
      inhabited++;
    } else {
      writeFileSync(outFile, uninhabitedPage(system, planet, index));
      uninhabited++;
    }
  });
}

console.log(`Generated ${uninhabited} uninhabited and ${inhabited} inhabited planet pages.`);
if (pendingInhabited.length) console.log(`Inhabited planets without race data (left untouched): ${pendingInhabited.join(', ')}`);
