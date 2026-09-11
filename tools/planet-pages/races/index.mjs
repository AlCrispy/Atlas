// Registry of alien civilizations and the inhabited planets they hold.
// RACE_PLANETS is keyed by planet slug (solar-system-data.js); an inhabited
// planet with no entry here keeps its existing stub page. Every race's
// `relations` list covers the other nine — keep them consistent when
// editing one side of a relationship.
import { TERRESTRI, TERRESTRI_PLANETS } from './terrestri.mjs';
import { VELMYR, VELMYR_PLANETS } from './velmyr.mjs';
import { YTHAR, YTHAR_PLANETS } from './ythar.mjs';
import { CORALITH, CORALITH_PLANETS } from './coralith.mjs';
import { VAELUN, VAELUN_PLANETS } from './vaelun.mjs';
import { QUORAI, QUORAI_PLANETS } from './quorai.mjs';
import { KHEPRANI, KHEPRANI_PLANETS } from './kheprani.mjs';
import { NEXARI, NEXARI_PLANETS } from './nexari.mjs';
import { THISSARI, THISSARI_PLANETS } from './thissari.mjs';
import { ASHKAARI, ASHKAARI_PLANETS } from './ashkaari.mjs';

export const RACES = {
  terrestri: TERRESTRI,
  velmyr: VELMYR,
  ythar: YTHAR,
  coralith: CORALITH,
  vaelun: VAELUN,
  quorai: QUORAI,
  kheprani: KHEPRANI,
  nexari: NEXARI,
  thissari: THISSARI,
  ashkaari: ASHKAARI,
};

export const RACE_PLANETS = {
  ...TERRESTRI_PLANETS,
  ...VELMYR_PLANETS,
  ...YTHAR_PLANETS,
  ...CORALITH_PLANETS,
  ...VAELUN_PLANETS,
  ...QUORAI_PLANETS,
  ...KHEPRANI_PLANETS,
  ...NEXARI_PLANETS,
  ...THISSARI_PLANETS,
  ...ASHKAARI_PLANETS,
};
