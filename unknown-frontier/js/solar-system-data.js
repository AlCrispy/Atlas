// Generated solar system layouts — literal, hand-editable data.
// Units: orbitRadius/size in scene units, inclination in radians, speed in
// radians/second, phase in radians (starting angle along the orbit).
// zoomTarget for every body is always the system origin (0,0,0); only
// zoomDistance varies, so selecting any body re-centers the camera on the
// star while framing appropriately for how far out that body orbits.
// Regenerate via scratchpad/gen-solar-systems.js if you need to reshuffle
// everything; individual numbers below are safe to hand-tweak.

export const SOLAR_SYSTEMS = {
  "vessek": {
    "slug": "vessek",
    "name": "Vessek",
    "galaxy": "Aurvex",
    "stars": [
      {
        "name": "Vessek",
        "slug": "vessek",
        "color": "#ffd6a8",
        "size": 3.853,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Vessek I",
        "slug": "vessek-i",
        "color": "#8a6ae8",
        "size": 1.795,
        "orbitRadius": 10.67,
        "eccentricity": 0.287,
        "inclination": -0.1844,
        "speed": 0.1458,
        "phase": 1.671,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Vessek I-a",
            "slug": "vessek-i-a",
            "color": "#e8dcc8",
            "size": 0.44,
            "orbitRadius": 3.725,
            "speed": 1.759,
            "phase": 3.035,
            "eyebrow": "Satellite",
            "zoomDistance": 24
          }
        ],
        "zoomDistance": 27.1
      },
      {
        "name": "Vessek II",
        "slug": "vessek-ii",
        "color": "#c9a84c",
        "size": 2.185,
        "orbitRadius": 19.12,
        "eccentricity": 0.38,
        "inclination": 0.0409,
        "speed": 0.1311,
        "phase": 3.513,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Vessek II-a",
            "slug": "vessek-ii-a",
            "color": "#e8dcc8",
            "size": 0.423,
            "orbitRadius": 3.896,
            "speed": 1.703,
            "phase": 0.588,
            "eyebrow": "Satellite",
            "zoomDistance": 36.7
          }
        ],
        "zoomDistance": 40.6
      },
      {
        "name": "Vessek III",
        "slug": "vessek-iii",
        "color": "#7d8bb0",
        "size": 1.853,
        "orbitRadius": 36.29,
        "eccentricity": 0.236,
        "inclination": -0.0798,
        "speed": 0.1031,
        "phase": 2.054,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 68.1
      }
    ]
  },
  "thalir-9": {
    "slug": "thalir-9",
    "name": "Thalir-9",
    "galaxy": "Aurvex",
    "stars": [
      {
        "name": "Thalir-9",
        "slug": "thalir-9",
        "color": "#9df0fa",
        "size": 3.434,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Thalir-9 I",
        "slug": "thalir-9-i",
        "color": "#e8846f",
        "size": 1.831,
        "orbitRadius": 5.12,
        "eccentricity": 0.364,
        "inclination": -0.1293,
        "speed": 0.2094,
        "phase": 3.632,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Thalir-9 I-a",
            "slug": "thalir-9-i-a",
            "color": "#e8dcc8",
            "size": 0.463,
            "orbitRadius": 3.542,
            "speed": 2.138,
            "phase": 4.247,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          },
          {
            "name": "Thalir-9 I-b",
            "slug": "thalir-9-i-b",
            "color": "#d6dcf2",
            "size": 0.46,
            "orbitRadius": 4.933,
            "speed": 2.19,
            "phase": 4.237,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          }
        ],
        "zoomDistance": 18.2
      },
      {
        "name": "Thalir-9 II",
        "slug": "thalir-9-ii",
        "color": "#8a6ae8",
        "size": 2.201,
        "orbitRadius": 7.24,
        "eccentricity": 0.043,
        "inclination": -0.29,
        "speed": 0.2107,
        "phase": 0.272,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 21.6
      },
      {
        "name": "Thalir-9 III",
        "slug": "thalir-9-iii",
        "color": "#d685c0",
        "size": 1.808,
        "orbitRadius": 12.77,
        "eccentricity": 0.099,
        "inclination": -0.0237,
        "speed": 0.1523,
        "phase": 1.024,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Thalir-9 III-a",
            "slug": "thalir-9-iii-a",
            "color": "#9df0fa",
            "size": 0.298,
            "orbitRadius": 3.067,
            "speed": 1.536,
            "phase": 1.036,
            "eyebrow": "Satellite",
            "zoomDistance": 27.2
          }
        ],
        "zoomDistance": 30.4
      },
      {
        "name": "Thalir-9 IV",
        "slug": "thalir-9-iv",
        "color": "#7d8bb0",
        "size": 1.758,
        "orbitRadius": 20,
        "eccentricity": 0.244,
        "inclination": 0.2266,
        "speed": 0.1213,
        "phase": 5.826,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Thalir-9 IV-a",
            "slug": "thalir-9-iv-a",
            "color": "#d6dcf2",
            "size": 0.395,
            "orbitRadius": 3.668,
            "speed": 1.233,
            "phase": 5.255,
            "eyebrow": "Satellite",
            "zoomDistance": 38
          }
        ],
        "zoomDistance": 42
      },
      {
        "name": "Thalir-9 V",
        "slug": "thalir-9-v",
        "color": "#e8846f",
        "size": 2.614,
        "orbitRadius": 36.53,
        "eccentricity": 0.281,
        "inclination": -0.1242,
        "speed": 0.083,
        "phase": 4.831,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Thalir-9 V-a",
            "slug": "thalir-9-v-a",
            "color": "#b8c4e8",
            "size": 0.369,
            "orbitRadius": 4.298,
            "speed": 1.993,
            "phase": 0.744,
            "eyebrow": "Satellite",
            "zoomDistance": 62.8
          },
          {
            "name": "Thalir-9 V-b",
            "slug": "thalir-9-v-b",
            "color": "#9df0fa",
            "size": 0.504,
            "orbitRadius": 5.369,
            "speed": 1.692,
            "phase": 1.665,
            "eyebrow": "Satellite",
            "zoomDistance": 62.8
          },
          {
            "name": "Thalir-9 V-c",
            "slug": "thalir-9-v-c",
            "color": "#e8dcc8",
            "size": 0.39,
            "orbitRadius": 6.889,
            "speed": 1.821,
            "phase": 1.3,
            "eyebrow": "Satellite",
            "zoomDistance": 62.8
          }
        ],
        "zoomDistance": 68.4
      }
    ]
  },
  "kaion-rift": {
    "slug": "kaion-rift",
    "name": "Kaion Rift",
    "galaxy": "Aurvex",
    "stars": [
      {
        "name": "Kaion Rift",
        "slug": "kaion-rift",
        "color": "#c8e8ff",
        "size": 3.599,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Kaion Rift I",
        "slug": "kaion-rift-i",
        "color": "#8a6ae8",
        "size": 2.195,
        "orbitRadius": 10.11,
        "eccentricity": 0.214,
        "inclination": 0.0883,
        "speed": 0.1596,
        "phase": 4.649,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Kaion Rift I-a",
            "slug": "kaion-rift-i-a",
            "color": "#d6dcf2",
            "size": 0.513,
            "orbitRadius": 4.181,
            "speed": 1.188,
            "phase": 1.246,
            "eyebrow": "Satellite",
            "zoomDistance": 23.2
          },
          {
            "name": "Kaion Rift I-b",
            "slug": "kaion-rift-i-b",
            "color": "#9df0fa",
            "size": 0.354,
            "orbitRadius": 6.265,
            "speed": 2.199,
            "phase": 1.627,
            "eyebrow": "Satellite",
            "zoomDistance": 23.2
          }
        ],
        "zoomDistance": 26.2
      },
      {
        "name": "Kaion Rift II",
        "slug": "kaion-rift-ii",
        "color": "#4fd8e8",
        "size": 1.524,
        "orbitRadius": 18.04,
        "eccentricity": 0.341,
        "inclination": -0.1766,
        "speed": 0.1427,
        "phase": 3.073,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 38.9
      },
      {
        "name": "Kaion Rift III",
        "slug": "kaion-rift-iii",
        "color": "#e8dcc8",
        "size": 1.312,
        "orbitRadius": 26.18,
        "eccentricity": 0.115,
        "inclination": -0.2135,
        "speed": 0.1026,
        "phase": 1.218,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 51.9
      },
      {
        "name": "Kaion Rift IV",
        "slug": "kaion-rift-iv",
        "color": "#7d8bb0",
        "size": 1.806,
        "orbitRadius": 40.64,
        "eccentricity": 0.229,
        "inclination": -0.1791,
        "speed": 0.092,
        "phase": 3.275,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Kaion Rift IV-a",
            "slug": "kaion-rift-iv-a",
            "color": "#e8dcc8",
            "size": 0.453,
            "orbitRadius": 3.634,
            "speed": 1.414,
            "phase": 4.916,
            "eyebrow": "Satellite",
            "zoomDistance": 69
          },
          {
            "name": "Kaion Rift IV-b",
            "slug": "kaion-rift-iv-b",
            "color": "#d6dcf2",
            "size": 0.446,
            "orbitRadius": 5.268,
            "speed": 1.707,
            "phase": 5.239,
            "eyebrow": "Satellite",
            "zoomDistance": 69
          }
        ],
        "zoomDistance": 75
      }
    ]
  },
  "drevane": {
    "slug": "drevane",
    "name": "Drevane",
    "galaxy": "Aurvex",
    "stars": [
      {
        "name": "Drevane",
        "slug": "drevane",
        "color": "#e8dcc8",
        "size": 3.307,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Drevane I",
        "slug": "drevane-i",
        "color": "#d685c0",
        "size": 1.708,
        "orbitRadius": 3.95,
        "eccentricity": 0.088,
        "inclination": 0.0992,
        "speed": 0.2708,
        "phase": 3.075,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Drevane I-a",
            "slug": "drevane-i-a",
            "color": "#e8dcc8",
            "size": 0.285,
            "orbitRadius": 3.675,
            "speed": 1.551,
            "phase": 4.419,
            "eyebrow": "Satellite",
            "zoomDistance": 13.9
          }
        ],
        "zoomDistance": 16.3
      },
      {
        "name": "Drevane II",
        "slug": "drevane-ii",
        "color": "#4fd8e8",
        "size": 1.638,
        "orbitRadius": 6.8,
        "eccentricity": 0.284,
        "inclination": -0.0255,
        "speed": 0.2252,
        "phase": 5.464,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 20.9
      },
      {
        "name": "Drevane III",
        "slug": "drevane-iii",
        "color": "#e8dcc8",
        "size": 1.629,
        "orbitRadius": 12.07,
        "eccentricity": 0.179,
        "inclination": -0.0196,
        "speed": 0.1665,
        "phase": 1.629,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Drevane III-a",
            "slug": "drevane-iii-a",
            "color": "#b8c4e8",
            "size": 0.313,
            "orbitRadius": 2.859,
            "speed": 1.751,
            "phase": 5.476,
            "eyebrow": "Satellite",
            "zoomDistance": 26.1
          }
        ],
        "zoomDistance": 29.3
      },
      {
        "name": "Drevane IV",
        "slug": "drevane-iv",
        "color": "#e8846f",
        "size": 2.31,
        "orbitRadius": 20.73,
        "eccentricity": 0.146,
        "inclination": 0.0195,
        "speed": 0.1341,
        "phase": 5.789,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Drevane IV-a",
            "slug": "drevane-iv-a",
            "color": "#b8c4e8",
            "size": 0.288,
            "orbitRadius": 3.878,
            "speed": 1.271,
            "phase": 2.667,
            "eyebrow": "Satellite",
            "zoomDistance": 39.1
          },
          {
            "name": "Drevane IV-b",
            "slug": "drevane-iv-b",
            "color": "#b8c4e8",
            "size": 0.353,
            "orbitRadius": 5.902,
            "speed": 1.942,
            "phase": 4.395,
            "eyebrow": "Satellite",
            "zoomDistance": 39.1
          }
        ],
        "zoomDistance": 43.2
      },
      {
        "name": "Drevane V",
        "slug": "drevane-v",
        "color": "#4fd8e8",
        "size": 1.83,
        "orbitRadius": 35.41,
        "eccentricity": 0.067,
        "inclination": 0.3035,
        "speed": 0.0831,
        "phase": 2.034,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Drevane V-a",
            "slug": "drevane-v-a",
            "color": "#d6dcf2",
            "size": 0.46,
            "orbitRadius": 3.31,
            "speed": 1.415,
            "phase": 3.965,
            "eyebrow": "Satellite",
            "zoomDistance": 61.1
          },
          {
            "name": "Drevane V-b",
            "slug": "drevane-v-b",
            "color": "#9df0fa",
            "size": 0.404,
            "orbitRadius": 5.49,
            "speed": 2.024,
            "phase": 4.934,
            "eyebrow": "Satellite",
            "zoomDistance": 61.1
          }
        ],
        "zoomDistance": 66.7
      }
    ]
  },
  "solmira": {
    "slug": "solmira",
    "name": "Solmira",
    "galaxy": "Aurvex",
    "stars": [
      {
        "name": "Solmira",
        "slug": "solmira",
        "color": "#fff2c8",
        "size": 3.662,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Solmira I",
        "slug": "solmira-i",
        "color": "#d685c0",
        "size": 1.318,
        "orbitRadius": 5.15,
        "eccentricity": 0.205,
        "inclination": -0.271,
        "speed": 0.233,
        "phase": 4.115,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Solmira I-a",
            "slug": "solmira-i-a",
            "color": "#e8dcc8",
            "size": 0.475,
            "orbitRadius": 2.769,
            "speed": 2.181,
            "phase": 2.175,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          },
          {
            "name": "Solmira I-b",
            "slug": "solmira-i-b",
            "color": "#d6dcf2",
            "size": 0.372,
            "orbitRadius": 3.969,
            "speed": 1.195,
            "phase": 6.274,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          },
          {
            "name": "Solmira I-c",
            "slug": "solmira-i-c",
            "color": "#b8c4e8",
            "size": 0.318,
            "orbitRadius": 5.152,
            "speed": 1.111,
            "phase": 1.484,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          }
        ],
        "zoomDistance": 18.2
      },
      {
        "name": "Solmira II",
        "slug": "solmira-ii",
        "color": "#e8846f",
        "size": 1.814,
        "orbitRadius": 8.14,
        "eccentricity": 0.121,
        "inclination": -0.0059,
        "speed": 0.1723,
        "phase": 4.501,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Solmira II-a",
            "slug": "solmira-ii-a",
            "color": "#d6dcf2",
            "size": 0.327,
            "orbitRadius": 3.527,
            "speed": 1.28,
            "phase": 2.922,
            "eyebrow": "Satellite",
            "zoomDistance": 20.2
          }
        ],
        "zoomDistance": 23
      },
      {
        "name": "Solmira III",
        "slug": "solmira-iii",
        "color": "#8a6ae8",
        "size": 1.87,
        "orbitRadius": 12.59,
        "eccentricity": 0.355,
        "inclination": 0.19,
        "speed": 0.1513,
        "phase": 2.955,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 30.1
      },
      {
        "name": "Solmira IV",
        "slug": "solmira-iv",
        "color": "#e8dcc8",
        "size": 2.372,
        "orbitRadius": 22.8,
        "eccentricity": 0.353,
        "inclination": 0.1908,
        "speed": 0.1279,
        "phase": 2.439,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 46.5
      },
      {
        "name": "Solmira V",
        "slug": "solmira-v",
        "color": "#c9a84c",
        "size": 1.979,
        "orbitRadius": 36.64,
        "eccentricity": 0.396,
        "inclination": -0.151,
        "speed": 0.0963,
        "phase": 5.391,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 68.6
      }
    ]
  },
  "ozmun-prime": {
    "slug": "ozmun-prime",
    "name": "Ozmun Prime",
    "galaxy": "Meridian",
    "stars": [
      {
        "name": "Ozmun Prime",
        "slug": "ozmun-prime",
        "color": "#ffd6a8",
        "size": 3.475,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Ozmun Prime I",
        "slug": "ozmun-prime-i",
        "color": "#8a6ae8",
        "size": 1.183,
        "orbitRadius": 9.64,
        "eccentricity": 0.335,
        "inclination": 0.3016,
        "speed": 0.1741,
        "phase": 3.293,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ozmun Prime I-a",
            "slug": "ozmun-prime-i-a",
            "color": "#d6dcf2",
            "size": 0.346,
            "orbitRadius": 2.92,
            "speed": 2.136,
            "phase": 4.337,
            "eyebrow": "Satellite",
            "zoomDistance": 22.5
          }
        ],
        "zoomDistance": 25.4
      },
      {
        "name": "Ozmun Prime II",
        "slug": "ozmun-prime-ii",
        "color": "#c9a84c",
        "size": 1.172,
        "orbitRadius": 16.03,
        "eccentricity": 0.142,
        "inclination": 0.0776,
        "speed": 0.1207,
        "phase": 6.17,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ozmun Prime II-a",
            "slug": "ozmun-prime-ii-a",
            "color": "#d6dcf2",
            "size": 0.322,
            "orbitRadius": 2.815,
            "speed": 1.972,
            "phase": 3.253,
            "eyebrow": "Satellite",
            "zoomDistance": 32
          },
          {
            "name": "Ozmun Prime II-b",
            "slug": "ozmun-prime-ii-b",
            "color": "#b8c4e8",
            "size": 0.359,
            "orbitRadius": 4.577,
            "speed": 1.325,
            "phase": 3.557,
            "eyebrow": "Satellite",
            "zoomDistance": 32
          },
          {
            "name": "Ozmun Prime II-c",
            "slug": "ozmun-prime-ii-c",
            "color": "#d6dcf2",
            "size": 0.309,
            "orbitRadius": 5.844,
            "speed": 1.253,
            "phase": 1.579,
            "eyebrow": "Satellite",
            "zoomDistance": 32
          }
        ],
        "zoomDistance": 35.6
      },
      {
        "name": "Ozmun Prime III",
        "slug": "ozmun-prime-iii",
        "color": "#e8846f",
        "size": 2.096,
        "orbitRadius": 24.92,
        "eccentricity": 0.241,
        "inclination": -0.0739,
        "speed": 0.101,
        "phase": 3.364,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ozmun Prime III-a",
            "slug": "ozmun-prime-iii-a",
            "color": "#b8c4e8",
            "size": 0.308,
            "orbitRadius": 3.87,
            "speed": 2.187,
            "phase": 2.281,
            "eyebrow": "Satellite",
            "zoomDistance": 45.4
          },
          {
            "name": "Ozmun Prime III-b",
            "slug": "ozmun-prime-iii-b",
            "color": "#9df0fa",
            "size": 0.307,
            "orbitRadius": 5.793,
            "speed": 2.07,
            "phase": 2.593,
            "eyebrow": "Satellite",
            "zoomDistance": 45.4
          }
        ],
        "zoomDistance": 49.9
      },
      {
        "name": "Ozmun Prime IV",
        "slug": "ozmun-prime-iv",
        "color": "#c9a84c",
        "size": 2.13,
        "orbitRadius": 35.35,
        "eccentricity": 0.067,
        "inclination": -0.04,
        "speed": 0.0982,
        "phase": 6.047,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ozmun Prime IV-a",
            "slug": "ozmun-prime-iv-a",
            "color": "#e8dcc8",
            "size": 0.303,
            "orbitRadius": 3.373,
            "speed": 2.027,
            "phase": 4.967,
            "eyebrow": "Satellite",
            "zoomDistance": 61
          },
          {
            "name": "Ozmun Prime IV-b",
            "slug": "ozmun-prime-iv-b",
            "color": "#d6dcf2",
            "size": 0.474,
            "orbitRadius": 4.526,
            "speed": 1.594,
            "phase": 3.807,
            "eyebrow": "Satellite",
            "zoomDistance": 61
          },
          {
            "name": "Ozmun Prime IV-c",
            "slug": "ozmun-prime-iv-c",
            "color": "#e8dcc8",
            "size": 0.363,
            "orbitRadius": 6.018,
            "speed": 1.314,
            "phase": 2.281,
            "eyebrow": "Satellite",
            "zoomDistance": 61
          }
        ],
        "zoomDistance": 66.6
      }
    ]
  },
  "haldrin": {
    "slug": "haldrin",
    "name": "Haldrin",
    "galaxy": "Meridian",
    "stars": [
      {
        "name": "Haldrin",
        "slug": "haldrin",
        "color": "#ffd6a8",
        "size": 3.939,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Haldrin I",
        "slug": "haldrin-i",
        "color": "#e8dcc8",
        "size": 1.591,
        "orbitRadius": 5.12,
        "eccentricity": 0.271,
        "inclination": 0.2239,
        "speed": 0.2638,
        "phase": 5.243,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Haldrin I-a",
            "slug": "haldrin-i-a",
            "color": "#b8c4e8",
            "size": 0.459,
            "orbitRadius": 3.44,
            "speed": 1.29,
            "phase": 0.045,
            "eyebrow": "Satellite",
            "zoomDistance": 15.7
          }
        ],
        "zoomDistance": 18.2
      },
      {
        "name": "Haldrin II",
        "slug": "haldrin-ii",
        "color": "#4fd8e8",
        "size": 2.204,
        "orbitRadius": 7.59,
        "eccentricity": 0.38,
        "inclination": -0.2882,
        "speed": 0.2075,
        "phase": 1.886,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Haldrin II-a",
            "slug": "haldrin-ii-a",
            "color": "#d6dcf2",
            "size": 0.351,
            "orbitRadius": 3.578,
            "speed": 1.48,
            "phase": 3.589,
            "eyebrow": "Satellite",
            "zoomDistance": 19.4
          },
          {
            "name": "Haldrin II-b",
            "slug": "haldrin-ii-b",
            "color": "#b8c4e8",
            "size": 0.488,
            "orbitRadius": 5.095,
            "speed": 1.368,
            "phase": 6.067,
            "eyebrow": "Satellite",
            "zoomDistance": 19.4
          }
        ],
        "zoomDistance": 22.1
      },
      {
        "name": "Haldrin III",
        "slug": "haldrin-iii",
        "color": "#c9a84c",
        "size": 1.672,
        "orbitRadius": 11.24,
        "eccentricity": 0.298,
        "inclination": -0.0081,
        "speed": 0.1576,
        "phase": 2.967,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 28
      },
      {
        "name": "Haldrin IV",
        "slug": "haldrin-iv",
        "color": "#e8dcc8",
        "size": 2.146,
        "orbitRadius": 20.38,
        "eccentricity": 0.193,
        "inclination": -0.2311,
        "speed": 0.1199,
        "phase": 2.918,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Haldrin IV-a",
            "slug": "haldrin-iv-a",
            "color": "#e8dcc8",
            "size": 0.403,
            "orbitRadius": 3.867,
            "speed": 1.589,
            "phase": 4.326,
            "eyebrow": "Satellite",
            "zoomDistance": 38.6
          }
        ],
        "zoomDistance": 42.6
      },
      {
        "name": "Haldrin V",
        "slug": "haldrin-v",
        "color": "#e8846f",
        "size": 2.585,
        "orbitRadius": 38.35,
        "eccentricity": 0.227,
        "inclination": 0.0677,
        "speed": 0.0954,
        "phase": 4.405,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 71.4
      }
    ]
  },
  "cerevane": {
    "slug": "cerevane",
    "name": "Cerevane",
    "galaxy": "Meridian",
    "stars": [
      {
        "name": "Cerevane",
        "slug": "cerevane",
        "color": "#e8dcc8",
        "size": 3.927,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Cerevane I",
        "slug": "cerevane-i",
        "color": "#e8846f",
        "size": 1.906,
        "orbitRadius": 9,
        "eccentricity": 0.287,
        "inclination": -0.1584,
        "speed": 0.1925,
        "phase": 4.533,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cerevane I-a",
            "slug": "cerevane-i-a",
            "color": "#e8dcc8",
            "size": 0.349,
            "orbitRadius": 3.659,
            "speed": 1.103,
            "phase": 1.027,
            "eyebrow": "Satellite",
            "zoomDistance": 21.5
          }
        ],
        "zoomDistance": 24.4
      },
      {
        "name": "Cerevane II",
        "slug": "cerevane-ii",
        "color": "#e8dcc8",
        "size": 1.526,
        "orbitRadius": 14.87,
        "eccentricity": 0.13,
        "inclination": -0.3126,
        "speed": 0.1458,
        "phase": 3.937,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cerevane II-a",
            "slug": "cerevane-ii-a",
            "color": "#9df0fa",
            "size": 0.339,
            "orbitRadius": 2.87,
            "speed": 1.522,
            "phase": 5.827,
            "eyebrow": "Satellite",
            "zoomDistance": 30.3
          },
          {
            "name": "Cerevane II-b",
            "slug": "cerevane-ii-b",
            "color": "#e8dcc8",
            "size": 0.341,
            "orbitRadius": 4.399,
            "speed": 2.18,
            "phase": 1.072,
            "eyebrow": "Satellite",
            "zoomDistance": 30.3
          }
        ],
        "zoomDistance": 33.8
      },
      {
        "name": "Cerevane III",
        "slug": "cerevane-iii",
        "color": "#c9a84c",
        "size": 1.97,
        "orbitRadius": 24.37,
        "eccentricity": 0.126,
        "inclination": 0.1265,
        "speed": 0.1011,
        "phase": 3.379,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cerevane III-a",
            "slug": "cerevane-iii-a",
            "color": "#b8c4e8",
            "size": 0.39,
            "orbitRadius": 3.534,
            "speed": 2.125,
            "phase": 5.71,
            "eyebrow": "Satellite",
            "zoomDistance": 44.6
          }
        ],
        "zoomDistance": 49
      },
      {
        "name": "Cerevane IV",
        "slug": "cerevane-iv",
        "color": "#6fd6a8",
        "size": 2.149,
        "orbitRadius": 40.06,
        "eccentricity": 0.048,
        "inclination": 0.2926,
        "speed": 0.074,
        "phase": 0.451,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 74.1
      }
    ]
  },
  "tessaly": {
    "slug": "tessaly",
    "name": "Tessaly",
    "galaxy": "Meridian",
    "stars": [
      {
        "name": "Tessaly",
        "slug": "tessaly",
        "color": "#c8e8ff",
        "size": 3.636,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Tessaly I",
        "slug": "tessaly-i",
        "color": "#e8dcc8",
        "size": 1.973,
        "orbitRadius": 11.25,
        "eccentricity": 0.248,
        "inclination": -0.0077,
        "speed": 0.1662,
        "phase": 1.387,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Tessaly I-a",
            "slug": "tessaly-i-a",
            "color": "#e8dcc8",
            "size": 0.454,
            "orbitRadius": 3.537,
            "speed": 1.372,
            "phase": 4.106,
            "eyebrow": "Satellite",
            "zoomDistance": 24.9
          }
        ],
        "zoomDistance": 28
      },
      {
        "name": "Tessaly II",
        "slug": "tessaly-ii",
        "color": "#e8846f",
        "size": 2.071,
        "orbitRadius": 16.84,
        "eccentricity": 0.099,
        "inclination": -0.1279,
        "speed": 0.1259,
        "phase": 2.208,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Tessaly II-a",
            "slug": "tessaly-ii-a",
            "color": "#9df0fa",
            "size": 0.401,
            "orbitRadius": 4.049,
            "speed": 1.942,
            "phase": 1.789,
            "eyebrow": "Satellite",
            "zoomDistance": 33.3
          },
          {
            "name": "Tessaly II-b",
            "slug": "tessaly-ii-b",
            "color": "#b8c4e8",
            "size": 0.439,
            "orbitRadius": 5.93,
            "speed": 2.025,
            "phase": 1.987,
            "eyebrow": "Satellite",
            "zoomDistance": 33.3
          },
          {
            "name": "Tessaly II-c",
            "slug": "tessaly-ii-c",
            "color": "#d6dcf2",
            "size": 0.319,
            "orbitRadius": 7.72,
            "speed": 1.112,
            "phase": 5.613,
            "eyebrow": "Satellite",
            "zoomDistance": 33.3
          }
        ],
        "zoomDistance": 36.9
      },
      {
        "name": "Tessaly III",
        "slug": "tessaly-iii",
        "color": "#e8dcc8",
        "size": 2.144,
        "orbitRadius": 24.57,
        "eccentricity": 0.08,
        "inclination": -0.0814,
        "speed": 0.1199,
        "phase": 1.73,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 49.3
      },
      {
        "name": "Tessaly IV",
        "slug": "tessaly-iv",
        "color": "#4fd8e8",
        "size": 1.777,
        "orbitRadius": 37.17,
        "eccentricity": 0.142,
        "inclination": -0.0284,
        "speed": 0.1016,
        "phase": 1.289,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Tessaly IV-a",
            "slug": "tessaly-iv-a",
            "color": "#9df0fa",
            "size": 0.293,
            "orbitRadius": 3.621,
            "speed": 1.211,
            "phase": 3.833,
            "eyebrow": "Satellite",
            "zoomDistance": 63.8
          },
          {
            "name": "Tessaly IV-b",
            "slug": "tessaly-iv-b",
            "color": "#b8c4e8",
            "size": 0.442,
            "orbitRadius": 5.309,
            "speed": 1.934,
            "phase": 0.433,
            "eyebrow": "Satellite",
            "zoomDistance": 63.8
          }
        ],
        "zoomDistance": 69.5
      }
    ]
  },
  "norvun": {
    "slug": "norvun",
    "name": "Norvun",
    "galaxy": "Meridian",
    "stars": [
      {
        "name": "Norvun",
        "slug": "norvun",
        "color": "#e8dcc8",
        "size": 3.339,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Norvun I",
        "slug": "norvun-i",
        "color": "#e8dcc8",
        "size": 1.716,
        "orbitRadius": 7.13,
        "eccentricity": 0.121,
        "inclination": 0.065,
        "speed": 0.205,
        "phase": 4.461,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 21.4
      },
      {
        "name": "Norvun II",
        "slug": "norvun-ii",
        "color": "#4fd8e8",
        "size": 1.887,
        "orbitRadius": 11.79,
        "eccentricity": 0.275,
        "inclination": -0.1346,
        "speed": 0.1402,
        "phase": 2.688,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Norvun II-a",
            "slug": "norvun-ii-a",
            "color": "#b8c4e8",
            "size": 0.283,
            "orbitRadius": 3.702,
            "speed": 1.854,
            "phase": 3.837,
            "eyebrow": "Satellite",
            "zoomDistance": 25.7
          }
        ],
        "zoomDistance": 28.9
      },
      {
        "name": "Norvun III",
        "slug": "norvun-iii",
        "color": "#c9a84c",
        "size": 2.102,
        "orbitRadius": 18.42,
        "eccentricity": 0.336,
        "inclination": 0.2321,
        "speed": 0.1223,
        "phase": 4.47,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Norvun III-a",
            "slug": "norvun-iii-a",
            "color": "#d6dcf2",
            "size": 0.453,
            "orbitRadius": 3.866,
            "speed": 1.293,
            "phase": 0.8,
            "eyebrow": "Satellite",
            "zoomDistance": 35.6
          },
          {
            "name": "Norvun III-b",
            "slug": "norvun-iii-b",
            "color": "#b8c4e8",
            "size": 0.304,
            "orbitRadius": 5.108,
            "speed": 1.471,
            "phase": 5.976,
            "eyebrow": "Satellite",
            "zoomDistance": 35.6
          },
          {
            "name": "Norvun III-c",
            "slug": "norvun-iii-c",
            "color": "#b8c4e8",
            "size": 0.397,
            "orbitRadius": 6.548,
            "speed": 1.372,
            "phase": 5.434,
            "eyebrow": "Satellite",
            "zoomDistance": 35.6
          }
        ],
        "zoomDistance": 39.5
      },
      {
        "name": "Norvun IV",
        "slug": "norvun-iv",
        "color": "#e8dcc8",
        "size": 2.044,
        "orbitRadius": 34.85,
        "eccentricity": 0.09,
        "inclination": -0.2963,
        "speed": 0.0801,
        "phase": 0.553,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 65.8
      }
    ]
  },
  "rakthos": {
    "slug": "rakthos",
    "name": "Rakthos",
    "galaxy": "Zhorn",
    "stars": [
      {
        "name": "Rakthos A",
        "slug": "rakthos-a",
        "color": "#c8e8ff",
        "size": 3.101,
        "orbitRadius": 4.304,
        "speed": 0.698,
        "eyebrow": "Stella",
        "zoomDistance": 16
      },
      {
        "name": "Rakthos B",
        "slug": "rakthos-b",
        "color": "#fff2c8",
        "size": 2.096,
        "orbitRadius": 4.434,
        "speed": 0.632,
        "eyebrow": "Stella",
        "phaseOffset": 3.141592653589793,
        "zoomDistance": 16
      }
    ],
    "planets": [
      {
        "name": "Rakthos I",
        "slug": "rakthos-i",
        "color": "#6fd6a8",
        "size": 0.998,
        "orbitRadius": 8.47,
        "eccentricity": 0.388,
        "inclination": 0.1386,
        "speed": 0.2061,
        "phase": 2.484,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Rakthos I-a",
            "slug": "rakthos-i-a",
            "color": "#d6dcf2",
            "size": 0.423,
            "orbitRadius": 2.32,
            "speed": 1.701,
            "phase": 5.424,
            "eyebrow": "Satellite",
            "zoomDistance": 20.7
          },
          {
            "name": "Rakthos I-b",
            "slug": "rakthos-i-b",
            "color": "#9df0fa",
            "size": 0.446,
            "orbitRadius": 3.853,
            "speed": 1.57,
            "phase": 3.924,
            "eyebrow": "Satellite",
            "zoomDistance": 20.7
          },
          {
            "name": "Rakthos I-c",
            "slug": "rakthos-i-c",
            "color": "#9df0fa",
            "size": 0.288,
            "orbitRadius": 5.188,
            "speed": 1.84,
            "phase": 1.257,
            "eyebrow": "Satellite",
            "zoomDistance": 20.7
          }
        ],
        "zoomDistance": 23.6
      },
      {
        "name": "Rakthos II",
        "slug": "rakthos-ii",
        "color": "#e8dcc8",
        "size": 2.051,
        "orbitRadius": 16.04,
        "eccentricity": 0.397,
        "inclination": 0.0808,
        "speed": 0.1458,
        "phase": 0.62,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Rakthos II-a",
            "slug": "rakthos-ii-a",
            "color": "#9df0fa",
            "size": 0.486,
            "orbitRadius": 3.953,
            "speed": 1.366,
            "phase": 0.647,
            "eyebrow": "Satellite",
            "zoomDistance": 32.1
          }
        ],
        "zoomDistance": 35.7
      },
      {
        "name": "Rakthos III",
        "slug": "rakthos-iii",
        "color": "#4fd8e8",
        "size": 2.077,
        "orbitRadius": 24.3,
        "eccentricity": 0.269,
        "inclination": 0.2048,
        "speed": 0.1283,
        "phase": 4.639,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 48.9
      },
      {
        "name": "Rakthos IV",
        "slug": "rakthos-iv",
        "color": "#d685c0",
        "size": 1.809,
        "orbitRadius": 37.29,
        "eccentricity": 0.152,
        "inclination": 0.1624,
        "speed": 0.0804,
        "phase": 3.218,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 69.7
      }
    ]
  },
  "ybrenn": {
    "slug": "ybrenn",
    "name": "Ybrenn",
    "galaxy": "Zhorn",
    "stars": [
      {
        "name": "Ybrenn",
        "slug": "ybrenn",
        "color": "#ffd6a8",
        "size": 3.25,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Ybrenn I",
        "slug": "ybrenn-i",
        "color": "#4fd8e8",
        "size": 1.222,
        "orbitRadius": 12.8,
        "eccentricity": 0.139,
        "inclination": -0.2426,
        "speed": 0.1681,
        "phase": 3.952,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ybrenn I-a",
            "slug": "ybrenn-i-a",
            "color": "#e8dcc8",
            "size": 0.479,
            "orbitRadius": 3.135,
            "speed": 1.332,
            "phase": 3.059,
            "eyebrow": "Satellite",
            "zoomDistance": 27.2
          },
          {
            "name": "Ybrenn I-b",
            "slug": "ybrenn-i-b",
            "color": "#d6dcf2",
            "size": 0.434,
            "orbitRadius": 4.745,
            "speed": 2.024,
            "phase": 1.889,
            "eyebrow": "Satellite",
            "zoomDistance": 27.2
          },
          {
            "name": "Ybrenn I-c",
            "slug": "ybrenn-i-c",
            "color": "#b8c4e8",
            "size": 0.336,
            "orbitRadius": 5.886,
            "speed": 1.507,
            "phase": 3.115,
            "eyebrow": "Satellite",
            "zoomDistance": 27.2
          }
        ],
        "zoomDistance": 30.5
      },
      {
        "name": "Ybrenn II",
        "slug": "ybrenn-ii",
        "color": "#e8846f",
        "size": 1.698,
        "orbitRadius": 19.76,
        "eccentricity": 0.251,
        "inclination": 0.1459,
        "speed": 0.1328,
        "phase": 4.746,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ybrenn II-a",
            "slug": "ybrenn-ii-a",
            "color": "#e8dcc8",
            "size": 0.419,
            "orbitRadius": 3.161,
            "speed": 2.023,
            "phase": 5.275,
            "eyebrow": "Satellite",
            "zoomDistance": 37.6
          },
          {
            "name": "Ybrenn II-b",
            "slug": "ybrenn-ii-b",
            "color": "#e8dcc8",
            "size": 0.356,
            "orbitRadius": 4.691,
            "speed": 1.494,
            "phase": 1.999,
            "eyebrow": "Satellite",
            "zoomDistance": 37.6
          }
        ],
        "zoomDistance": 41.6
      },
      {
        "name": "Ybrenn III",
        "slug": "ybrenn-iii",
        "color": "#8a6ae8",
        "size": 2.277,
        "orbitRadius": 37.55,
        "eccentricity": 0.063,
        "inclination": 0.1012,
        "speed": 0.0864,
        "phase": 0.486,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ybrenn III-a",
            "slug": "ybrenn-iii-a",
            "color": "#e8dcc8",
            "size": 0.5,
            "orbitRadius": 3.76,
            "speed": 1.756,
            "phase": 2.672,
            "eyebrow": "Satellite",
            "zoomDistance": 64.3
          }
        ],
        "zoomDistance": 70.1
      }
    ]
  },
  "quovar": {
    "slug": "quovar",
    "name": "Quovar",
    "galaxy": "Zhorn",
    "stars": [
      {
        "name": "Quovar",
        "slug": "quovar",
        "color": "#fff2c8",
        "size": 3.781,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Quovar I",
        "slug": "quovar-i",
        "color": "#8a6ae8",
        "size": 0.901,
        "orbitRadius": 6.43,
        "eccentricity": 0.31,
        "inclination": -0.0789,
        "speed": 0.2332,
        "phase": 4.356,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Quovar I-a",
            "slug": "quovar-i-a",
            "color": "#9df0fa",
            "size": 0.406,
            "orbitRadius": 2.885,
            "speed": 1.288,
            "phase": 2.167,
            "eyebrow": "Satellite",
            "zoomDistance": 17.6
          },
          {
            "name": "Quovar I-b",
            "slug": "quovar-i-b",
            "color": "#9df0fa",
            "size": 0.326,
            "orbitRadius": 4.047,
            "speed": 1.301,
            "phase": 1.799,
            "eyebrow": "Satellite",
            "zoomDistance": 17.6
          }
        ],
        "zoomDistance": 20.3
      },
      {
        "name": "Quovar II",
        "slug": "quovar-ii",
        "color": "#d685c0",
        "size": 1.983,
        "orbitRadius": 11.32,
        "eccentricity": 0.046,
        "inclination": -0.0031,
        "speed": 0.162,
        "phase": 2.153,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 28.1
      },
      {
        "name": "Quovar III",
        "slug": "quovar-iii",
        "color": "#8a6ae8",
        "size": 1.653,
        "orbitRadius": 21.1,
        "eccentricity": 0.241,
        "inclination": 0.2146,
        "speed": 0.1149,
        "phase": 5.419,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Quovar III-a",
            "slug": "quovar-iii-a",
            "color": "#e8dcc8",
            "size": 0.493,
            "orbitRadius": 3.297,
            "speed": 1.131,
            "phase": 5.415,
            "eyebrow": "Satellite",
            "zoomDistance": 39.7
          },
          {
            "name": "Quovar III-b",
            "slug": "quovar-iii-b",
            "color": "#d6dcf2",
            "size": 0.298,
            "orbitRadius": 4.307,
            "speed": 1.774,
            "phase": 3.911,
            "eyebrow": "Satellite",
            "zoomDistance": 39.7
          },
          {
            "name": "Quovar III-c",
            "slug": "quovar-iii-c",
            "color": "#d6dcf2",
            "size": 0.303,
            "orbitRadius": 6.188,
            "speed": 1.705,
            "phase": 0.8,
            "eyebrow": "Satellite",
            "zoomDistance": 39.7
          }
        ],
        "zoomDistance": 43.8
      },
      {
        "name": "Quovar IV",
        "slug": "quovar-iv",
        "color": "#e8dcc8",
        "size": 1.738,
        "orbitRadius": 39.38,
        "eccentricity": 0.072,
        "inclination": 0.214,
        "speed": 0.0906,
        "phase": 0.411,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 73
      }
    ]
  },
  "skellith": {
    "slug": "skellith",
    "name": "Skellith",
    "galaxy": "Zhorn",
    "stars": [
      {
        "name": "Skellith",
        "slug": "skellith",
        "color": "#c8e8ff",
        "size": 3.489,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Skellith I",
        "slug": "skellith-i",
        "color": "#6fd6a8",
        "size": 1.028,
        "orbitRadius": 12.64,
        "eccentricity": 0.285,
        "inclination": -0.2574,
        "speed": 0.1369,
        "phase": 3.26,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Skellith I-a",
            "slug": "skellith-i-a",
            "color": "#9df0fa",
            "size": 0.497,
            "orbitRadius": 2.768,
            "speed": 1.38,
            "phase": 4.035,
            "eyebrow": "Satellite",
            "zoomDistance": 27
          }
        ],
        "zoomDistance": 30.2
      },
      {
        "name": "Skellith II",
        "slug": "skellith-ii",
        "color": "#7d8bb0",
        "size": 1.26,
        "orbitRadius": 19.74,
        "eccentricity": 0.181,
        "inclination": 0.0864,
        "speed": 0.1268,
        "phase": 0.035,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Skellith II-a",
            "slug": "skellith-ii-a",
            "color": "#e8dcc8",
            "size": 0.469,
            "orbitRadius": 2.934,
            "speed": 1.4,
            "phase": 4.106,
            "eyebrow": "Satellite",
            "zoomDistance": 37.6
          },
          {
            "name": "Skellith II-b",
            "slug": "skellith-ii-b",
            "color": "#9df0fa",
            "size": 0.35,
            "orbitRadius": 3.956,
            "speed": 1.562,
            "phase": 5.6,
            "eyebrow": "Satellite",
            "zoomDistance": 37.6
          }
        ],
        "zoomDistance": 41.6
      },
      {
        "name": "Skellith III",
        "slug": "skellith-iii",
        "color": "#8a6ae8",
        "size": 1.33,
        "orbitRadius": 35.57,
        "eccentricity": 0.15,
        "inclination": 0.2351,
        "speed": 0.0809,
        "phase": 4.789,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Skellith III-a",
            "slug": "skellith-iii-a",
            "color": "#9df0fa",
            "size": 0.482,
            "orbitRadius": 2.59,
            "speed": 1.438,
            "phase": 2.252,
            "eyebrow": "Satellite",
            "zoomDistance": 61.4
          }
        ],
        "zoomDistance": 66.9
      }
    ]
  },
  "manoth": {
    "slug": "manoth",
    "name": "Manoth",
    "galaxy": "Zhorn",
    "stars": [
      {
        "name": "Manoth",
        "slug": "manoth",
        "color": "#e8dcc8",
        "size": 3.755,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Manoth I",
        "slug": "manoth-i",
        "color": "#6fd6a8",
        "size": 1.487,
        "orbitRadius": 6.78,
        "eccentricity": 0.14,
        "inclination": 0.1507,
        "speed": 0.1877,
        "phase": 2.984,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Manoth I-a",
            "slug": "manoth-i-a",
            "color": "#9df0fa",
            "size": 0.36,
            "orbitRadius": 3.393,
            "speed": 1.433,
            "phase": 3.164,
            "eyebrow": "Satellite",
            "zoomDistance": 18.2
          },
          {
            "name": "Manoth I-b",
            "slug": "manoth-i-b",
            "color": "#d6dcf2",
            "size": 0.393,
            "orbitRadius": 5.401,
            "speed": 2.012,
            "phase": 3.106,
            "eyebrow": "Satellite",
            "zoomDistance": 18.2
          },
          {
            "name": "Manoth I-c",
            "slug": "manoth-i-c",
            "color": "#e8dcc8",
            "size": 0.462,
            "orbitRadius": 7.258,
            "speed": 1.956,
            "phase": 2.493,
            "eyebrow": "Satellite",
            "zoomDistance": 18.2
          }
        ],
        "zoomDistance": 20.8
      },
      {
        "name": "Manoth II",
        "slug": "manoth-ii",
        "color": "#e8dcc8",
        "size": 2.233,
        "orbitRadius": 11.34,
        "eccentricity": 0.225,
        "inclination": 0.0391,
        "speed": 0.148,
        "phase": 0.968,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Manoth II-a",
            "slug": "manoth-ii-a",
            "color": "#e8dcc8",
            "size": 0.293,
            "orbitRadius": 3.656,
            "speed": 1.342,
            "phase": 3.704,
            "eyebrow": "Satellite",
            "zoomDistance": 25
          },
          {
            "name": "Manoth II-b",
            "slug": "manoth-ii-b",
            "color": "#e8dcc8",
            "size": 0.311,
            "orbitRadius": 4.713,
            "speed": 1.42,
            "phase": 3.034,
            "eyebrow": "Satellite",
            "zoomDistance": 25
          }
        ],
        "zoomDistance": 28.1
      },
      {
        "name": "Manoth III",
        "slug": "manoth-iii",
        "color": "#6fd6a8",
        "size": 2.041,
        "orbitRadius": 20.44,
        "eccentricity": 0.279,
        "inclination": 0.1352,
        "speed": 0.114,
        "phase": 0.806,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 42.7
      },
      {
        "name": "Manoth IV",
        "slug": "manoth-iv",
        "color": "#4fd8e8",
        "size": 1.363,
        "orbitRadius": 38.49,
        "eccentricity": 0.351,
        "inclination": 0.282,
        "speed": 0.0996,
        "phase": 2.264,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 71.6
      }
    ]
  },
  "aldevik": {
    "slug": "aldevik",
    "name": "Aldevik",
    "galaxy": "Corvantis",
    "stars": [
      {
        "name": "Aldevik",
        "slug": "aldevik",
        "color": "#c8e8ff",
        "size": 3.265,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Aldevik I",
        "slug": "aldevik-i",
        "color": "#7d8bb0",
        "size": 0.997,
        "orbitRadius": 17.59,
        "eccentricity": 0.018,
        "inclination": 0.1786,
        "speed": 0.1282,
        "phase": 0.538,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Aldevik I-a",
            "slug": "aldevik-i-a",
            "color": "#9df0fa",
            "size": 0.3,
            "orbitRadius": 2.719,
            "speed": 1.446,
            "phase": 3.963,
            "eyebrow": "Satellite",
            "zoomDistance": 34.4
          },
          {
            "name": "Aldevik I-b",
            "slug": "aldevik-i-b",
            "color": "#e8dcc8",
            "size": 0.462,
            "orbitRadius": 4.396,
            "speed": 1.914,
            "phase": 4.712,
            "eyebrow": "Satellite",
            "zoomDistance": 34.4
          },
          {
            "name": "Aldevik I-c",
            "slug": "aldevik-i-c",
            "color": "#9df0fa",
            "size": 0.351,
            "orbitRadius": 5.655,
            "speed": 1.364,
            "phase": 1.917,
            "eyebrow": "Satellite",
            "zoomDistance": 34.4
          }
        ],
        "zoomDistance": 38.1
      },
      {
        "name": "Aldevik II",
        "slug": "aldevik-ii",
        "color": "#6fd6a8",
        "size": 1.577,
        "orbitRadius": 25.06,
        "eccentricity": 0.395,
        "inclination": -0.1778,
        "speed": 0.1252,
        "phase": 2.532,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 50.1
      },
      {
        "name": "Aldevik III",
        "slug": "aldevik-iii",
        "color": "#c9a84c",
        "size": 2.588,
        "orbitRadius": 39.79,
        "eccentricity": 0.14,
        "inclination": -0.2402,
        "speed": 0.0777,
        "phase": 3.218,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Aldevik III-a",
            "slug": "aldevik-iii-a",
            "color": "#b8c4e8",
            "size": 0.436,
            "orbitRadius": 4.167,
            "speed": 1.698,
            "phase": 3.204,
            "eyebrow": "Satellite",
            "zoomDistance": 67.7
          },
          {
            "name": "Aldevik III-b",
            "slug": "aldevik-iii-b",
            "color": "#e8dcc8",
            "size": 0.453,
            "orbitRadius": 5.502,
            "speed": 1.311,
            "phase": 5.531,
            "eyebrow": "Satellite",
            "zoomDistance": 67.7
          },
          {
            "name": "Aldevik III-c",
            "slug": "aldevik-iii-c",
            "color": "#e8dcc8",
            "size": 0.492,
            "orbitRadius": 7.079,
            "speed": 2.057,
            "phase": 1.681,
            "eyebrow": "Satellite",
            "zoomDistance": 67.7
          }
        ],
        "zoomDistance": 73.7
      }
    ]
  },
  "cormanth": {
    "slug": "cormanth",
    "name": "Cormanth",
    "galaxy": "Corvantis",
    "stars": [
      {
        "name": "Cormanth",
        "slug": "cormanth",
        "color": "#e8dcc8",
        "size": 3.242,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Cormanth I",
        "slug": "cormanth-i",
        "color": "#8a6ae8",
        "size": 2.026,
        "orbitRadius": 10.26,
        "eccentricity": 0.238,
        "inclination": 0.128,
        "speed": 0.186,
        "phase": 5.682,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cormanth I-a",
            "slug": "cormanth-i-a",
            "color": "#d6dcf2",
            "size": 0.384,
            "orbitRadius": 3.659,
            "speed": 2.03,
            "phase": 5.125,
            "eyebrow": "Satellite",
            "zoomDistance": 23.4
          },
          {
            "name": "Cormanth I-b",
            "slug": "cormanth-i-b",
            "color": "#b8c4e8",
            "size": 0.372,
            "orbitRadius": 5.568,
            "speed": 2.183,
            "phase": 2.518,
            "eyebrow": "Satellite",
            "zoomDistance": 23.4
          },
          {
            "name": "Cormanth I-c",
            "slug": "cormanth-i-c",
            "color": "#d6dcf2",
            "size": 0.403,
            "orbitRadius": 7.69,
            "speed": 1.938,
            "phase": 3.871,
            "eyebrow": "Satellite",
            "zoomDistance": 23.4
          }
        ],
        "zoomDistance": 26.4
      },
      {
        "name": "Cormanth II",
        "slug": "cormanth-ii",
        "color": "#e8dcc8",
        "size": 2.293,
        "orbitRadius": 17.1,
        "eccentricity": 0.169,
        "inclination": -0.1938,
        "speed": 0.1205,
        "phase": 2.874,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cormanth II-a",
            "slug": "cormanth-ii-a",
            "color": "#9df0fa",
            "size": 0.302,
            "orbitRadius": 3.866,
            "speed": 1.558,
            "phase": 1.97,
            "eyebrow": "Satellite",
            "zoomDistance": 33.7
          }
        ],
        "zoomDistance": 37.4
      },
      {
        "name": "Cormanth III",
        "slug": "cormanth-iii",
        "color": "#8a6ae8",
        "size": 1.979,
        "orbitRadius": 23.99,
        "eccentricity": 0.252,
        "inclination": 0.0337,
        "speed": 0.1008,
        "phase": 5.305,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cormanth III-a",
            "slug": "cormanth-iii-a",
            "color": "#d6dcf2",
            "size": 0.382,
            "orbitRadius": 3.782,
            "speed": 1.108,
            "phase": 5.394,
            "eyebrow": "Satellite",
            "zoomDistance": 44
          },
          {
            "name": "Cormanth III-b",
            "slug": "cormanth-iii-b",
            "color": "#9df0fa",
            "size": 0.399,
            "orbitRadius": 5.197,
            "speed": 1.879,
            "phase": 0.604,
            "eyebrow": "Satellite",
            "zoomDistance": 44
          }
        ],
        "zoomDistance": 48.4
      },
      {
        "name": "Cormanth IV",
        "slug": "cormanth-iv",
        "color": "#e8dcc8",
        "size": 1.816,
        "orbitRadius": 38.63,
        "eccentricity": 0.364,
        "inclination": 0.2642,
        "speed": 0.0852,
        "phase": 3.563,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Cormanth IV-a",
            "slug": "cormanth-iv-a",
            "color": "#e8dcc8",
            "size": 0.492,
            "orbitRadius": 3.702,
            "speed": 1.297,
            "phase": 2.731,
            "eyebrow": "Satellite",
            "zoomDistance": 65.9
          },
          {
            "name": "Cormanth IV-b",
            "slug": "cormanth-iv-b",
            "color": "#b8c4e8",
            "size": 0.471,
            "orbitRadius": 5.117,
            "speed": 2.016,
            "phase": 3.697,
            "eyebrow": "Satellite",
            "zoomDistance": 65.9
          }
        ],
        "zoomDistance": 71.8
      }
    ]
  },
  "estryn": {
    "slug": "estryn",
    "name": "Estryn",
    "galaxy": "Corvantis",
    "stars": [
      {
        "name": "Estryn",
        "slug": "estryn",
        "color": "#c8e8ff",
        "size": 3.706,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Estryn I",
        "slug": "estryn-i",
        "color": "#4fd8e8",
        "size": 2.108,
        "orbitRadius": 8.14,
        "eccentricity": 0.347,
        "inclination": 0.2891,
        "speed": 0.1928,
        "phase": 1.104,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Estryn I-a",
            "slug": "estryn-i-a",
            "color": "#d6dcf2",
            "size": 0.287,
            "orbitRadius": 4.05,
            "speed": 1.754,
            "phase": 4.467,
            "eyebrow": "Satellite",
            "zoomDistance": 20.2
          }
        ],
        "zoomDistance": 23
      },
      {
        "name": "Estryn II",
        "slug": "estryn-ii",
        "color": "#7d8bb0",
        "size": 1.455,
        "orbitRadius": 14.85,
        "eccentricity": 0.156,
        "inclination": 0.08,
        "speed": 0.1231,
        "phase": 1.727,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 33.8
      },
      {
        "name": "Estryn III",
        "slug": "estryn-iii",
        "color": "#e8dcc8",
        "size": 1.524,
        "orbitRadius": 24.01,
        "eccentricity": 0.38,
        "inclination": -0.096,
        "speed": 0.1039,
        "phase": 0.732,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Estryn III-a",
            "slug": "estryn-iii-a",
            "color": "#b8c4e8",
            "size": 0.343,
            "orbitRadius": 3.14,
            "speed": 2.057,
            "phase": 1.797,
            "eyebrow": "Satellite",
            "zoomDistance": 44
          }
        ],
        "zoomDistance": 48.4
      },
      {
        "name": "Estryn IV",
        "slug": "estryn-iv",
        "color": "#e8846f",
        "size": 2.338,
        "orbitRadius": 34.18,
        "eccentricity": 0.187,
        "inclination": 0.0277,
        "speed": 0.0974,
        "phase": 3.828,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Estryn IV-a",
            "slug": "estryn-iv-a",
            "color": "#b8c4e8",
            "size": 0.332,
            "orbitRadius": 3.909,
            "speed": 2.06,
            "phase": 3.538,
            "eyebrow": "Satellite",
            "zoomDistance": 59.3
          }
        ],
        "zoomDistance": 64.7
      }
    ]
  },
  "vallor-deep": {
    "slug": "vallor-deep",
    "name": "Vallor Deep",
    "galaxy": "Corvantis",
    "stars": [
      {
        "name": "Vallor Deep",
        "slug": "vallor-deep",
        "color": "#9df0fa",
        "size": 3.788,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Vallor Deep I",
        "slug": "vallor-deep-i",
        "color": "#4fd8e8",
        "size": 1.498,
        "orbitRadius": 14.63,
        "eccentricity": 0.043,
        "inclination": -0.2844,
        "speed": 0.1244,
        "phase": 1.432,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Vallor Deep I-a",
            "slug": "vallor-deep-i-a",
            "color": "#b8c4e8",
            "size": 0.384,
            "orbitRadius": 3.07,
            "speed": 2.16,
            "phase": 3.633,
            "eyebrow": "Satellite",
            "zoomDistance": 29.9
          }
        ],
        "zoomDistance": 33.4
      },
      {
        "name": "Vallor Deep II",
        "slug": "vallor-deep-ii",
        "color": "#e8dcc8",
        "size": 1.711,
        "orbitRadius": 25.01,
        "eccentricity": 0.144,
        "inclination": -0.1587,
        "speed": 0.1017,
        "phase": 0.446,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 50
      },
      {
        "name": "Vallor Deep III",
        "slug": "vallor-deep-iii",
        "color": "#e8846f",
        "size": 2.053,
        "orbitRadius": 36.45,
        "eccentricity": 0.197,
        "inclination": -0.3002,
        "speed": 0.0782,
        "phase": 2.801,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 68.3
      }
    ]
  },
  "ninhara": {
    "slug": "ninhara",
    "name": "Ninhara",
    "galaxy": "Corvantis",
    "stars": [
      {
        "name": "Ninhara",
        "slug": "ninhara",
        "color": "#fff2c8",
        "size": 3.862,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Ninhara I",
        "slug": "ninhara-i",
        "color": "#7d8bb0",
        "size": 2.033,
        "orbitRadius": 15.01,
        "eccentricity": 0.301,
        "inclination": -0.0896,
        "speed": 0.1491,
        "phase": 0.146,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ninhara I-a",
            "slug": "ninhara-i-a",
            "color": "#e8dcc8",
            "size": 0.497,
            "orbitRadius": 3.678,
            "speed": 2.193,
            "phase": 2.762,
            "eyebrow": "Satellite",
            "zoomDistance": 30.5
          }
        ],
        "zoomDistance": 34
      },
      {
        "name": "Ninhara II",
        "slug": "ninhara-ii",
        "color": "#c9a84c",
        "size": 1.229,
        "orbitRadius": 26.15,
        "eccentricity": 0.04,
        "inclination": -0.2117,
        "speed": 0.1132,
        "phase": 1.667,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ninhara II-a",
            "slug": "ninhara-ii-a",
            "color": "#9df0fa",
            "size": 0.409,
            "orbitRadius": 3.202,
            "speed": 1.725,
            "phase": 1.369,
            "eyebrow": "Satellite",
            "zoomDistance": 47.2
          },
          {
            "name": "Ninhara II-b",
            "slug": "ninhara-ii-b",
            "color": "#d6dcf2",
            "size": 0.387,
            "orbitRadius": 4.868,
            "speed": 1.93,
            "phase": 5.299,
            "eyebrow": "Satellite",
            "zoomDistance": 47.2
          },
          {
            "name": "Ninhara II-c",
            "slug": "ninhara-ii-c",
            "color": "#b8c4e8",
            "size": 0.37,
            "orbitRadius": 6.468,
            "speed": 1.535,
            "phase": 5.08,
            "eyebrow": "Satellite",
            "zoomDistance": 47.2
          }
        ],
        "zoomDistance": 51.8
      },
      {
        "name": "Ninhara III",
        "slug": "ninhara-iii",
        "color": "#4fd8e8",
        "size": 1.93,
        "orbitRadius": 38.76,
        "eccentricity": 0.089,
        "inclination": -0.1059,
        "speed": 0.0751,
        "phase": 4.837,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 72
      }
    ]
  },
  "yssel": {
    "slug": "yssel",
    "name": "Yssel",
    "galaxy": "Pyxis",
    "stars": [
      {
        "name": "Yssel",
        "slug": "yssel",
        "color": "#9df0fa",
        "size": 3.474,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Yssel I",
        "slug": "yssel-i",
        "color": "#e8846f",
        "size": 1.13,
        "orbitRadius": 4.77,
        "eccentricity": 0.29,
        "inclination": 0.0794,
        "speed": 0.2631,
        "phase": 4.184,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Yssel I-a",
            "slug": "yssel-i-a",
            "color": "#b8c4e8",
            "size": 0.378,
            "orbitRadius": 2.902,
            "speed": 1.82,
            "phase": 0.775,
            "eyebrow": "Satellite",
            "zoomDistance": 15.2
          }
        ],
        "zoomDistance": 17.6
      },
      {
        "name": "Yssel II",
        "slug": "yssel-ii",
        "color": "#e8dcc8",
        "size": 1.92,
        "orbitRadius": 7.97,
        "eccentricity": 0.377,
        "inclination": 0.0392,
        "speed": 0.1707,
        "phase": 4.996,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Yssel II-a",
            "slug": "yssel-ii-a",
            "color": "#d6dcf2",
            "size": 0.475,
            "orbitRadius": 3.601,
            "speed": 1.843,
            "phase": 1.681,
            "eyebrow": "Satellite",
            "zoomDistance": 20
          }
        ],
        "zoomDistance": 22.8
      },
      {
        "name": "Yssel III",
        "slug": "yssel-iii",
        "color": "#4fd8e8",
        "size": 1.484,
        "orbitRadius": 14.74,
        "eccentricity": 0.36,
        "inclination": -0.2428,
        "speed": 0.1615,
        "phase": 4.186,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Yssel III-a",
            "slug": "yssel-iii-a",
            "color": "#e8dcc8",
            "size": 0.308,
            "orbitRadius": 3.145,
            "speed": 1.314,
            "phase": 5.833,
            "eyebrow": "Satellite",
            "zoomDistance": 30.1
          },
          {
            "name": "Yssel III-b",
            "slug": "yssel-iii-b",
            "color": "#9df0fa",
            "size": 0.455,
            "orbitRadius": 4.231,
            "speed": 1.359,
            "phase": 2.624,
            "eyebrow": "Satellite",
            "zoomDistance": 30.1
          }
        ],
        "zoomDistance": 33.6
      },
      {
        "name": "Yssel IV",
        "slug": "yssel-iv",
        "color": "#8a6ae8",
        "size": 1.582,
        "orbitRadius": 21.88,
        "eccentricity": 0.196,
        "inclination": 0.1404,
        "speed": 0.1239,
        "phase": 0.063,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Yssel IV-a",
            "slug": "yssel-iv-a",
            "color": "#9df0fa",
            "size": 0.31,
            "orbitRadius": 3.499,
            "speed": 2.161,
            "phase": 4.227,
            "eyebrow": "Satellite",
            "zoomDistance": 40.8
          }
        ],
        "zoomDistance": 45
      },
      {
        "name": "Yssel V",
        "slug": "yssel-v",
        "color": "#4fd8e8",
        "size": 2.587,
        "orbitRadius": 38.94,
        "eccentricity": 0.23,
        "inclination": -0.028,
        "speed": 0.0992,
        "phase": 4.596,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Yssel V-a",
            "slug": "yssel-v-a",
            "color": "#e8dcc8",
            "size": 0.313,
            "orbitRadius": 4.479,
            "speed": 1.721,
            "phase": 4.09,
            "eyebrow": "Satellite",
            "zoomDistance": 66.4
          },
          {
            "name": "Yssel V-b",
            "slug": "yssel-v-b",
            "color": "#9df0fa",
            "size": 0.364,
            "orbitRadius": 5.846,
            "speed": 1.933,
            "phase": 2.788,
            "eyebrow": "Satellite",
            "zoomDistance": 66.4
          }
        ],
        "zoomDistance": 72.3
      }
    ]
  },
  "braxton": {
    "slug": "braxton",
    "name": "Braxton",
    "galaxy": "Pyxis",
    "stars": [
      {
        "name": "Braxton A",
        "slug": "braxton-a",
        "color": "#ffd6a8",
        "size": 2.722,
        "orbitRadius": 4.371,
        "speed": 0.598,
        "eyebrow": "Stella",
        "zoomDistance": 16
      },
      {
        "name": "Braxton B",
        "slug": "braxton-b",
        "color": "#e8dcc8",
        "size": 1.862,
        "orbitRadius": 4.16,
        "speed": 0.647,
        "eyebrow": "Stella",
        "phaseOffset": 3.141592653589793,
        "zoomDistance": 16
      }
    ],
    "planets": [
      {
        "name": "Braxton I",
        "slug": "braxton-i",
        "color": "#7d8bb0",
        "size": 1.721,
        "orbitRadius": 10.9,
        "eccentricity": 0.017,
        "inclination": 0.0486,
        "speed": 0.166,
        "phase": 4.146,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Braxton I-a",
            "slug": "braxton-i-a",
            "color": "#d6dcf2",
            "size": 0.445,
            "orbitRadius": 3.552,
            "speed": 1.573,
            "phase": 3.404,
            "eyebrow": "Satellite",
            "zoomDistance": 24.4
          },
          {
            "name": "Braxton I-b",
            "slug": "braxton-i-b",
            "color": "#d6dcf2",
            "size": 0.475,
            "orbitRadius": 4.723,
            "speed": 1.31,
            "phase": 4.158,
            "eyebrow": "Satellite",
            "zoomDistance": 24.4
          }
        ],
        "zoomDistance": 27.4
      },
      {
        "name": "Braxton II",
        "slug": "braxton-ii",
        "color": "#c9a84c",
        "size": 2.311,
        "orbitRadius": 15.48,
        "eccentricity": 0.282,
        "inclination": -0.2072,
        "speed": 0.1306,
        "phase": 4.233,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 34.8
      },
      {
        "name": "Braxton III",
        "slug": "braxton-iii",
        "color": "#6fd6a8",
        "size": 1.793,
        "orbitRadius": 24.8,
        "eccentricity": 0.115,
        "inclination": 0.2262,
        "speed": 0.1205,
        "phase": 2.427,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Braxton III-a",
            "slug": "braxton-iii-a",
            "color": "#b8c4e8",
            "size": 0.499,
            "orbitRadius": 3.586,
            "speed": 1.693,
            "phase": 4.216,
            "eyebrow": "Satellite",
            "zoomDistance": 45.2
          },
          {
            "name": "Braxton III-b",
            "slug": "braxton-iii-b",
            "color": "#9df0fa",
            "size": 0.281,
            "orbitRadius": 5.072,
            "speed": 1.801,
            "phase": 5.926,
            "eyebrow": "Satellite",
            "zoomDistance": 45.2
          },
          {
            "name": "Braxton III-c",
            "slug": "braxton-iii-c",
            "color": "#e8dcc8",
            "size": 0.397,
            "orbitRadius": 6.847,
            "speed": 2.022,
            "phase": 6.185,
            "eyebrow": "Satellite",
            "zoomDistance": 45.2
          }
        ],
        "zoomDistance": 49.7
      },
      {
        "name": "Braxton IV",
        "slug": "braxton-iv",
        "color": "#c9a84c",
        "size": 2.571,
        "orbitRadius": 38.38,
        "eccentricity": 0.285,
        "inclination": 0.1327,
        "speed": 0.0798,
        "phase": 2.496,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 71.4
      }
    ]
  },
  "corvai": {
    "slug": "corvai",
    "name": "Corvai",
    "galaxy": "Pyxis",
    "stars": [
      {
        "name": "Corvai",
        "slug": "corvai",
        "color": "#ffd6a8",
        "size": 3.28,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Corvai I",
        "slug": "corvai-i",
        "color": "#d685c0",
        "size": 1.535,
        "orbitRadius": 11.96,
        "eccentricity": 0.344,
        "inclination": -0.1069,
        "speed": 0.1412,
        "phase": 0.768,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 29.1
      },
      {
        "name": "Corvai II",
        "slug": "corvai-ii",
        "color": "#8a6ae8",
        "size": 1.258,
        "orbitRadius": 20.52,
        "eccentricity": 0.218,
        "inclination": -0.1778,
        "speed": 0.1229,
        "phase": 5.244,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Corvai II-a",
            "slug": "corvai-ii-a",
            "color": "#e8dcc8",
            "size": 0.444,
            "orbitRadius": 3.161,
            "speed": 1.602,
            "phase": 6.251,
            "eyebrow": "Satellite",
            "zoomDistance": 38.8
          },
          {
            "name": "Corvai II-b",
            "slug": "corvai-ii-b",
            "color": "#e8dcc8",
            "size": 0.305,
            "orbitRadius": 4.926,
            "speed": 1.269,
            "phase": 1.684,
            "eyebrow": "Satellite",
            "zoomDistance": 38.8
          },
          {
            "name": "Corvai II-c",
            "slug": "corvai-ii-c",
            "color": "#e8dcc8",
            "size": 0.324,
            "orbitRadius": 6.361,
            "speed": 1.272,
            "phase": 3.509,
            "eyebrow": "Satellite",
            "zoomDistance": 38.8
          }
        ],
        "zoomDistance": 42.8
      },
      {
        "name": "Corvai III",
        "slug": "corvai-iii",
        "color": "#c9a84c",
        "size": 1.746,
        "orbitRadius": 38.03,
        "eccentricity": 0.164,
        "inclination": -0.1841,
        "speed": 0.0939,
        "phase": 0.604,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Corvai III-a",
            "slug": "corvai-iii-a",
            "color": "#d6dcf2",
            "size": 0.436,
            "orbitRadius": 3.268,
            "speed": 1.712,
            "phase": 1.123,
            "eyebrow": "Satellite",
            "zoomDistance": 65
          }
        ],
        "zoomDistance": 70.8
      }
    ]
  },
  "ithera": {
    "slug": "ithera",
    "name": "Ithera",
    "galaxy": "Pyxis",
    "stars": [
      {
        "name": "Ithera A",
        "slug": "ithera-a",
        "color": "#fff2c8",
        "size": 2.781,
        "orbitRadius": 3.501,
        "speed": 0.603,
        "eyebrow": "Stella",
        "zoomDistance": 16
      },
      {
        "name": "Ithera B",
        "slug": "ithera-b",
        "color": "#fff2c8",
        "size": 1.828,
        "orbitRadius": 4.448,
        "speed": 0.567,
        "eyebrow": "Stella",
        "phaseOffset": 3.141592653589793,
        "zoomDistance": 16
      }
    ],
    "planets": [
      {
        "name": "Ithera I",
        "slug": "ithera-i",
        "color": "#6fd6a8",
        "size": 2.009,
        "orbitRadius": 6.23,
        "eccentricity": 0.175,
        "inclination": 0.0726,
        "speed": 0.1878,
        "phase": 3.444,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ithera I-a",
            "slug": "ithera-i-a",
            "color": "#9df0fa",
            "size": 0.376,
            "orbitRadius": 3.273,
            "speed": 1.855,
            "phase": 2.046,
            "eyebrow": "Satellite",
            "zoomDistance": 17.3
          }
        ],
        "zoomDistance": 20
      },
      {
        "name": "Ithera II",
        "slug": "ithera-ii",
        "color": "#c9a84c",
        "size": 1.902,
        "orbitRadius": 11.82,
        "eccentricity": 0.269,
        "inclination": -0.0988,
        "speed": 0.1404,
        "phase": 2.044,
        "eyebrow": "Pianeta",
        "moons": [],
        "zoomDistance": 28.9
      },
      {
        "name": "Ithera III",
        "slug": "ithera-iii",
        "color": "#e8dcc8",
        "size": 2.012,
        "orbitRadius": 20.3,
        "eccentricity": 0.086,
        "inclination": -0.2215,
        "speed": 0.1108,
        "phase": 2.744,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ithera III-a",
            "slug": "ithera-iii-a",
            "color": "#e8dcc8",
            "size": 0.391,
            "orbitRadius": 3.794,
            "speed": 1.379,
            "phase": 1.228,
            "eyebrow": "Satellite",
            "zoomDistance": 38.5
          },
          {
            "name": "Ithera III-b",
            "slug": "ithera-iii-b",
            "color": "#b8c4e8",
            "size": 0.471,
            "orbitRadius": 5.628,
            "speed": 2.077,
            "phase": 5.669,
            "eyebrow": "Satellite",
            "zoomDistance": 38.5
          },
          {
            "name": "Ithera III-c",
            "slug": "ithera-iii-c",
            "color": "#b8c4e8",
            "size": 0.421,
            "orbitRadius": 7.643,
            "speed": 1.996,
            "phase": 4.882,
            "eyebrow": "Satellite",
            "zoomDistance": 38.5
          }
        ],
        "zoomDistance": 42.5
      },
      {
        "name": "Ithera IV",
        "slug": "ithera-iv",
        "color": "#6fd6a8",
        "size": 1.973,
        "orbitRadius": 38.46,
        "eccentricity": 0.064,
        "inclination": -0.1065,
        "speed": 0.0783,
        "phase": 5.623,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Ithera IV-a",
            "slug": "ithera-iv-a",
            "color": "#e8dcc8",
            "size": 0.475,
            "orbitRadius": 3.809,
            "speed": 1.431,
            "phase": 0.832,
            "eyebrow": "Satellite",
            "zoomDistance": 65.7
          }
        ],
        "zoomDistance": 71.5
      }
    ]
  },
  "zennor": {
    "slug": "zennor",
    "name": "Zennor",
    "galaxy": "Pyxis",
    "stars": [
      {
        "name": "Zennor",
        "slug": "zennor",
        "color": "#fff2c8",
        "size": 3.631,
        "orbitRadius": 0,
        "speed": 0,
        "eyebrow": "Stella",
        "zoomDistance": 14
      }
    ],
    "planets": [
      {
        "name": "Zennor I",
        "slug": "zennor-i",
        "color": "#d685c0",
        "size": 1.671,
        "orbitRadius": 9.67,
        "eccentricity": 0.056,
        "inclination": -0.2749,
        "speed": 0.1985,
        "phase": 4.61,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Zennor I-a",
            "slug": "zennor-i-a",
            "color": "#e8dcc8",
            "size": 0.402,
            "orbitRadius": 3.312,
            "speed": 2.004,
            "phase": 5.551,
            "eyebrow": "Satellite",
            "zoomDistance": 22.5
          },
          {
            "name": "Zennor I-b",
            "slug": "zennor-i-b",
            "color": "#9df0fa",
            "size": 0.492,
            "orbitRadius": 4.897,
            "speed": 2.142,
            "phase": 0.266,
            "eyebrow": "Satellite",
            "zoomDistance": 22.5
          }
        ],
        "zoomDistance": 25.5
      },
      {
        "name": "Zennor II",
        "slug": "zennor-ii",
        "color": "#7d8bb0",
        "size": 1.305,
        "orbitRadius": 16.91,
        "eccentricity": 0.076,
        "inclination": -0.2885,
        "speed": 0.1223,
        "phase": 3.61,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Zennor II-a",
            "slug": "zennor-ii-a",
            "color": "#e8dcc8",
            "size": 0.35,
            "orbitRadius": 2.645,
            "speed": 1.113,
            "phase": 1.109,
            "eyebrow": "Satellite",
            "zoomDistance": 33.4
          },
          {
            "name": "Zennor II-b",
            "slug": "zennor-ii-b",
            "color": "#e8dcc8",
            "size": 0.312,
            "orbitRadius": 4.641,
            "speed": 2.14,
            "phase": 4.189,
            "eyebrow": "Satellite",
            "zoomDistance": 33.4
          },
          {
            "name": "Zennor II-c",
            "slug": "zennor-ii-c",
            "color": "#e8dcc8",
            "size": 0.386,
            "orbitRadius": 5.873,
            "speed": 1.187,
            "phase": 4.492,
            "eyebrow": "Satellite",
            "zoomDistance": 33.4
          }
        ],
        "zoomDistance": 37.1
      },
      {
        "name": "Zennor III",
        "slug": "zennor-iii",
        "color": "#c9a84c",
        "size": 1.256,
        "orbitRadius": 24.26,
        "eccentricity": 0.344,
        "inclination": 0.2063,
        "speed": 0.1227,
        "phase": 2.089,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Zennor III-a",
            "slug": "zennor-iii-a",
            "color": "#b8c4e8",
            "size": 0.288,
            "orbitRadius": 2.586,
            "speed": 1.603,
            "phase": 3.484,
            "eyebrow": "Satellite",
            "zoomDistance": 44.4
          }
        ],
        "zoomDistance": 48.8
      },
      {
        "name": "Zennor IV",
        "slug": "zennor-iv",
        "color": "#e8dcc8",
        "size": 2.469,
        "orbitRadius": 40.22,
        "eccentricity": 0.156,
        "inclination": -0.0534,
        "speed": 0.0985,
        "phase": 2.666,
        "eyebrow": "Pianeta",
        "moons": [
          {
            "name": "Zennor IV-a",
            "slug": "zennor-iv-a",
            "color": "#d6dcf2",
            "size": 0.327,
            "orbitRadius": 4.061,
            "speed": 2.199,
            "phase": 3.429,
            "eyebrow": "Satellite",
            "zoomDistance": 68.3
          },
          {
            "name": "Zennor IV-b",
            "slug": "zennor-iv-b",
            "color": "#9df0fa",
            "size": 0.5,
            "orbitRadius": 6.224,
            "speed": 1.781,
            "phase": 1.961,
            "eyebrow": "Satellite",
            "zoomDistance": 68.3
          },
          {
            "name": "Zennor IV-c",
            "slug": "zennor-iv-c",
            "color": "#9df0fa",
            "size": 0.505,
            "orbitRadius": 8.049,
            "speed": 1.691,
            "phase": 2.467,
            "eyebrow": "Satellite",
            "zoomDistance": 68.3
          }
        ],
        "zoomDistance": 74.4
      }
    ]
  }
};
