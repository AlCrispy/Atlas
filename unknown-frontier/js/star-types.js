// Morgan-Keenan spectral classification: canonical colors and Italian
// display labels per class. Colors follow the widely-used blackbody
// approximation table (Mitchell Charity, "What color are the stars?"),
// hottest (O) to coolest (M); temperature ranges are from the Harvard
// classification (Wikipedia: Stellar classification).
export const STAR_TYPES = {
  O: { color: '#9bb0ff', label: 'Gigante blu', tempRange: '≥ 33000 K' },
  B: { color: '#aabfff', label: 'Blu-bianca', tempRange: '10000–33000 K' },
  A: { color: '#cad7ff', label: 'Bianca', tempRange: '7300–10000 K' },
  F: { color: '#f8f7ff', label: 'Bianco-gialla', tempRange: '6000–7300 K' },
  G: { color: '#fff4ea', label: 'Gialla', tempRange: '5300–6000 K' },
  K: { color: '#ffd2a1', label: 'Arancione', tempRange: '3900–5300 K' },
  M: { color: '#ffcc6f', label: 'Nana rossa', tempRange: '2300–3900 K' },
};
