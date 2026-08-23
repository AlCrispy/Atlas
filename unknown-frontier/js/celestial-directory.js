import { SOLAR_SYSTEMS } from './solar-system-data.js';
import { PLANET_TYPES } from './planet-types.js';
import { STAR_TYPES } from './star-types.js';

// Flatten every system's stars, planets, and moons into one list the
// catalog can search/filter without touching solar-system-data.js. Stars
// and moons have no detail page of their own, so they link back to their
// system view instead.
const rows = [];
for (const systemSlug of Object.keys(SOLAR_SYSTEMS)) {
  const system = SOLAR_SYSTEMS[systemSlug];
  const systemHref = `systems/${system.slug}.html`;

  system.stars.forEach((star) => {
    rows.push({
      name: star.name,
      kind: star.eyebrow,
      system: system.name,
      systemSlug: system.slug,
      galaxy: system.galaxy,
      classificationKey: star.type,
      classificationLabel: STAR_TYPES[star.type]?.label || star.type,
      inhabited: false,
      inhabitedLabel: '—',
      exploreHref: systemHref,
    });
  });

  system.planets.forEach((planet) => {
    rows.push({
      name: planet.name,
      kind: planet.eyebrow,
      system: system.name,
      systemSlug: system.slug,
      galaxy: system.galaxy,
      classificationKey: planet.type,
      classificationLabel: PLANET_TYPES[planet.type]?.label || planet.type,
      inhabited: !!planet.inhabited,
      inhabitedLabel: planet.inhabited ? 'Sì' : 'No',
      exploreHref: `systems/planets/${planet.slug}.html`,
    });

    (planet.moons || []).forEach((moon) => {
      rows.push({
        name: moon.name,
        kind: moon.eyebrow,
        system: system.name,
        systemSlug: system.slug,
        galaxy: system.galaxy,
        classificationKey: null,
        classificationLabel: '—',
        inhabited: !!moon.inhabited,
        inhabitedLabel: moon.inhabited ? 'Sì' : 'No',
        exploreHref: systemHref,
      });
    });
  });
}
rows.sort((a, b) => a.name.localeCompare(b.name, 'it'));

const searchEl = document.getElementById('pd-search');
const galaxyEl = document.getElementById('pd-galaxy');
const systemEl = document.getElementById('pd-system');
const kindEl = document.getElementById('pd-kind');
const typeEl = document.getElementById('pd-type');
const inhabitedEl = document.getElementById('pd-inhabited');
const bodyEl = document.getElementById('pd-rows');
const countEl = document.getElementById('pd-count');
const emptyEl = document.getElementById('pd-empty');

function addOption(select, value, label) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = label;
  select.appendChild(opt);
}

[...new Set(rows.map((r) => r.galaxy))]
  .sort((a, b) => a.localeCompare(b, 'it'))
  .forEach((galaxy) => addOption(galaxyEl, galaxy, galaxy));

const systemNames = new Map();
rows.forEach((r) => { if (!systemNames.has(r.systemSlug)) systemNames.set(r.systemSlug, r.system); });
[...systemNames.entries()]
  .sort((a, b) => a[1].localeCompare(b[1], 'it'))
  .forEach(([slug, name]) => addOption(systemEl, slug, name));

// Fixed hierarchy order (star → planet → moon) rather than alphabetical.
const KIND_ORDER = ['Stella', 'Pianeta', 'Satellite'];
[...new Set(rows.map((r) => r.kind))]
  .sort((a, b) => KIND_ORDER.indexOf(a) - KIND_ORDER.indexOf(b))
  .forEach((kind) => addOption(kindEl, kind, kind));

const typeLabels = new Map();
rows.forEach((r) => {
  if (r.classificationKey && !typeLabels.has(r.classificationKey)) {
    typeLabels.set(r.classificationKey, r.classificationLabel);
  }
});
[...typeLabels.entries()]
  .sort((a, b) => a[1].localeCompare(b[1], 'it'))
  .forEach(([value, label]) => addOption(typeEl, value, label));

function matches(row) {
  const query = searchEl.value.trim().toLowerCase();
  if (query && !row.name.toLowerCase().includes(query)) return false;
  if (galaxyEl.value && row.galaxy !== galaxyEl.value) return false;
  if (systemEl.value && row.systemSlug !== systemEl.value) return false;
  if (kindEl.value && row.kind !== kindEl.value) return false;
  if (typeEl.value && row.classificationKey !== typeEl.value) return false;
  if (inhabitedEl.value === 'yes' && !row.inhabited) return false;
  if (inhabitedEl.value === 'no' && row.inhabited) return false;
  return true;
}

function render() {
  const filtered = rows.filter(matches);

  bodyEl.replaceChildren(...filtered.map((row) => {
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.className = 'directory-link';
    nameLink.href = row.exploreHref;
    nameLink.textContent = row.name;
    nameTd.appendChild(nameLink);

    const kindTd = document.createElement('td');
    kindTd.textContent = row.kind;

    const systemTd = document.createElement('td');
    const systemLink = document.createElement('a');
    systemLink.className = 'directory-link directory-link-muted';
    systemLink.href = `systems/${row.systemSlug}.html`;
    systemLink.textContent = row.system;
    systemTd.appendChild(systemLink);

    const galaxyTd = document.createElement('td');
    galaxyTd.textContent = row.galaxy;

    const typeTd = document.createElement('td');
    typeTd.textContent = row.classificationLabel;

    const inhabitedTd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `directory-badge${row.inhabited ? ' is-inhabited' : ''}`;
    badge.textContent = row.inhabitedLabel;
    inhabitedTd.appendChild(badge);

    tr.append(nameTd, kindTd, systemTd, galaxyTd, typeTd, inhabitedTd);
    return tr;
  }));

  countEl.textContent = `${filtered.length} / ${rows.length} corpi celesti`;
  emptyEl.hidden = filtered.length !== 0;
}

[searchEl, galaxyEl, systemEl, kindEl, typeEl, inhabitedEl].forEach((el) => {
  el.addEventListener('input', render);
});

render();
