import { SOLAR_SYSTEMS } from './solar-system-data.js';
import { PLANET_TYPES } from './planet-types.js';

// Flatten every system's planets (moons excluded — they have no detail
// page or `type`/`inhabited` classification of their own) into one list
// the catalog can search/filter without touching solar-system-data.js.
const rows = [];
for (const systemSlug of Object.keys(SOLAR_SYSTEMS)) {
  const system = SOLAR_SYSTEMS[systemSlug];
  for (const planet of system.planets) {
    rows.push({
      name: planet.name,
      slug: planet.slug,
      system: system.name,
      systemSlug: system.slug,
      galaxy: system.galaxy,
      type: planet.type,
      typeLabel: PLANET_TYPES[planet.type]?.label || planet.type,
      inhabited: !!planet.inhabited,
    });
  }
}
rows.sort((a, b) => a.name.localeCompare(b.name, 'it'));

const searchEl = document.getElementById('pd-search');
const galaxyEl = document.getElementById('pd-galaxy');
const systemEl = document.getElementById('pd-system');
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

const typeLabels = new Map();
rows.forEach((r) => { if (!typeLabels.has(r.type)) typeLabels.set(r.type, r.typeLabel); });
[...typeLabels.entries()]
  .sort((a, b) => a[1].localeCompare(b[1], 'it'))
  .forEach(([value, label]) => addOption(typeEl, value, label));

function matches(row) {
  const query = searchEl.value.trim().toLowerCase();
  if (query && !row.name.toLowerCase().includes(query)) return false;
  if (galaxyEl.value && row.galaxy !== galaxyEl.value) return false;
  if (systemEl.value && row.systemSlug !== systemEl.value) return false;
  if (typeEl.value && row.type !== typeEl.value) return false;
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
    nameLink.href = `systems/planets/${row.slug}.html`;
    nameLink.textContent = row.name;
    nameTd.appendChild(nameLink);

    const systemTd = document.createElement('td');
    const systemLink = document.createElement('a');
    systemLink.className = 'directory-link directory-link-muted';
    systemLink.href = `systems/${row.systemSlug}.html`;
    systemLink.textContent = row.system;
    systemTd.appendChild(systemLink);

    const galaxyTd = document.createElement('td');
    galaxyTd.textContent = row.galaxy;

    const typeTd = document.createElement('td');
    typeTd.textContent = row.typeLabel;

    const inhabitedTd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `directory-badge${row.inhabited ? ' is-inhabited' : ''}`;
    badge.textContent = row.inhabited ? 'Sì' : 'No';
    inhabitedTd.appendChild(badge);

    tr.append(nameTd, systemTd, galaxyTd, typeTd, inhabitedTd);
    return tr;
  }));

  countEl.textContent = `${filtered.length} / ${rows.length} pianeti`;
  emptyEl.hidden = filtered.length !== 0;
}

[searchEl, galaxyEl, systemEl, typeEl, inhabitedEl].forEach((el) => {
  el.addEventListener('input', render);
});

render();
