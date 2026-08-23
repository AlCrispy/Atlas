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
        classificationLabel: 'Satellite',
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
const resetEl = document.getElementById('pd-reset');
const bodyEl = document.getElementById('pd-rows');
const countEl = document.getElementById('pd-count');
const emptyEl = document.getElementById('pd-empty');

function addOption(select, value, label) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = label;
  select.appendChild(opt);
}

// Fixed hierarchy order (star → planet → moon) rather than alphabetical.
const KIND_ORDER = ['Stella', 'Pianeta', 'Satellite'];

function matchesFacet(row, facet) {
  switch (facet) {
    case 'galaxy': return !galaxyEl.value || row.galaxy === galaxyEl.value;
    case 'system': return !systemEl.value || row.systemSlug === systemEl.value;
    case 'kind': return !kindEl.value || row.kind === kindEl.value;
    case 'type': return !typeEl.value || row.classificationKey === typeEl.value;
    case 'inhabited':
      if (inhabitedEl.value === 'yes') return row.inhabited;
      if (inhabitedEl.value === 'no') return !row.inhabited;
      return true;
    default: return true;
  }
}

const FACETS = ['galaxy', 'system', 'kind', 'type', 'inhabited'];

// Rows matching every facet filter except the one whose own options we're
// about to rebuild — so a select always offers everything still reachable
// given the *other* active filters, without filtering out its own value.
function rowsForFacetOptions(excludeFacet) {
  return rows.filter((row) => FACETS.every((facet) => facet === excludeFacet || matchesFacet(row, facet)));
}

// Rebuilds one <select>'s options from `available` rows, keeping the
// current selection if it's still a valid choice, resetting to "any"
// otherwise (e.g. the previously picked system fell outside a newly
// picked galaxy).
function repopulateSelect(select, available, allLabel, getValue, getLabel, sortEntries) {
  const previous = select.value;
  const entries = new Map();
  available.forEach((row) => {
    const value = getValue(row);
    if (value == null) return;
    if (!entries.has(value)) entries.set(value, getLabel(row));
  });

  select.replaceChildren();
  addOption(select, '', allLabel);
  [...entries.entries()].sort(sortEntries).forEach(([value, label]) => addOption(select, value, label));

  select.value = entries.has(previous) ? previous : '';
}

function refreshFacetOptions() {
  repopulateSelect(
    galaxyEl, rowsForFacetOptions('galaxy'), 'Tutte le galassie',
    (r) => r.galaxy, (r) => r.galaxy,
    (a, b) => a[1].localeCompare(b[1], 'it'),
  );
  repopulateSelect(
    systemEl, rowsForFacetOptions('system'), 'Tutti i sistemi',
    (r) => r.systemSlug, (r) => r.system,
    (a, b) => a[1].localeCompare(b[1], 'it'),
  );
  repopulateSelect(
    kindEl, rowsForFacetOptions('kind'), 'Ogni corpo',
    (r) => r.kind, (r) => r.kind,
    (a, b) => KIND_ORDER.indexOf(a[0]) - KIND_ORDER.indexOf(b[0]),
  );
  repopulateSelect(
    typeEl, rowsForFacetOptions('type'), 'Tutte le tipologie',
    (r) => r.classificationKey, (r) => r.classificationLabel,
    (a, b) => a[1].localeCompare(b[1], 'it'),
  );
}

function matches(row) {
  const query = searchEl.value.trim().toLowerCase();
  if (query && !row.name.toLowerCase().includes(query)) return false;
  return FACETS.every((facet) => matchesFacet(row, facet));
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

searchEl.addEventListener('input', render);

[galaxyEl, systemEl, kindEl, typeEl, inhabitedEl].forEach((el) => {
  el.addEventListener('change', () => {
    refreshFacetOptions();
    render();
  });
});

resetEl.addEventListener('click', () => {
  searchEl.value = '';
  galaxyEl.value = '';
  systemEl.value = '';
  kindEl.value = '';
  typeEl.value = '';
  inhabitedEl.value = '';
  refreshFacetOptions();
  render();
});

refreshFacetOptions();
render();
