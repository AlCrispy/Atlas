// Morgan-Keenan spectral classification: hue order and temperature ranges
// are from the Harvard classification (Wikipedia: Stellar classification),
// hottest (O) to coolest (M). The colors themselves are a stylized,
// saturated take rather than literal blackbody apparent color — real O-A
// stars read as white and G as barely-yellow-white to the eye (per that
// same source), which made every mid-range type look near-identical in
// the scene. Saturating each step keeps the correct hue progression
// (blue → white → yellow → orange → red) while making each class read as
// a visibly distinct color at a glance.
export const STAR_TYPES = {
  O: { color: '#5c8cff', label: 'Gigante blu', tempRange: '≥ 33000 K' },
  B: { color: '#8fb8ff', label: 'Blu-bianca', tempRange: '10000–33000 K' },
  A: { color: '#e6ecff', label: 'Bianca', tempRange: '7300–10000 K' },
  F: { color: '#fff0b3', label: 'Bianco-gialla', tempRange: '6000–7300 K' },
  G: { color: '#ffd23f', label: 'Gialla', tempRange: '5300–6000 K' },
  K: { color: '#ff8c42', label: 'Arancione', tempRange: '3900–5300 K' },
  M: { color: '#ff5c49', label: 'Nana rossa', tempRange: '2300–3900 K' },
};
