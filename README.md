# Centuria - Atlante del Mondo Conosciuto

> *"Un mondo antico, segnato da guerre dimenticate, magie proibite e potenze che sfidano il tempo stesso."*

Sito web statico per la campagna GDR **Centuria**. Permette di esplorare nazioni e territori tramite una mappa principale e pagine tematiche dedicate.

## Struttura attuale del progetto

Il sito ospita più ambientazioni, ciascuna nella propria cartella di primo livello. `index.html` in root è l'hub di selezione; tutto ciò che è specifico di Centuria vive sotto `centuria/`. Una futura ambientazione avrà una cartella analoga accanto a `centuria/`.

```text
centuria-repo/
|- index.html                  # Hub di selezione ambientazioni (entry point del sito)
|- css/
|  `- hub.css                  # Styling dell'hub (solo root, non fa parte di Centuria)
|- README.md
|- LICENSE
|- CLAUDE.md                   # Guida per Claude Code
`- centuria/                   # Tutta l'ambientazione Centuria
   |- centuria.html            # Home Centuria con mappa, nazioni conosciute e Terre Ignote
   |- terre-ignote.html        # Diario del nuovo continente in esplorazione
   |- resources/
   |  |- Centuria_plain.png    # Mappa principale
   |  |- kassendyr/            # Asset visivi della nazione Kassendyr
   |  |- aurelion/             # Asset visivi della Lega di Aurelion
   |  `- valdherba/            # Asset visivi della nazione Valdherba
   |- nations/
   |  |- kassendyr.html        # Scheda completa: L'Impero del Sangue Persistente
   |  |- velikor.html          # Scheda completa: La Repubblica delle Pianure
   |  |- aurelion.html         # Scheda completa: Lega di Aurelion
   |  `- valdherba.html        # Scheda completa: Valdherba
   |- locations/               # Pagine dettaglio locazioni delle Terre Ignote
   |  |- sitryll.html
   |  |- porto-nero.html
   |  |- locanda-cardo.html
   |  |- foresta-nord-est.html
   |  |- colonne-nerite.html
   |  |- chiesa-sitryll.html
   |  |- caverna-funghi.html
   |  `- villaggio-maledetto.html
   |- campaign/
   |  `- first_campaign/
   |     |- first_campaign.html   # Pagina principale della Campagna I (7 sessioni)
   |     `- characters/
   |        |- magnus/
   |        |  `- magnus.html     # Scheda Magnus Volstruker
   |        |- elaris/
   |        |  `- elaris.html     # Scheda Elaris Corven
   |        |- nemeia/
   |        |  `- nemeia.html     # Scheda Nemeia
   |        `- eutirox/
   |           `- eutirox.html    # Scheda Eutirox
   |- css/
   |  |- index.css                # Styling della home Centuria
   |  |- campagne-base.css        # Styling base delle campagne
   |  |- campagne-components.css  # Componenti delle campagne
   |  |- location-detail.css      # Styling pagine locazioni
   |  |- nations-*.css            # Styling per ogni nazione
   |  |- terre-ignote-*.css       # Styling per le terre ignote
   |  `- terre-ignote-locations.css  # Styling pagine locazioni delle terre ignote
   `- js/
      |- campagne.js              # Logica timeline e filtri campagne
      |- terre-ignote.js          # Logica timeline e filtri terre ignote
      `- nation-tabs.js           # Gestione tab per le nazioni
```

## Stato contenuti

### Nazioni conosciute

| Nazione | Continente | Stato |
|---|---|---|
| **Kassendyr** | Vecchio Continente · Sud-Ovest | ✅ Disponibile |
| **Velikor** | Vecchio Continente · Nord | ✅ Disponibile |
| **Lega di Aurelion** | Vecchio Continente · Centro | ✅ Disponibile |
| **Valdherba** | Vecchio Continente · Sud-Est | ✅ Disponibile |
| Kalveor | Vecchio Continente · Sud | 🔒 In arrivo |
| Isola Perennogelo | Arcipelago · Nord-Est | 🔒 In arrivo |

### Altre aree

| Area | Stato |
|---|---|
| **Terre Ignote** (Nuovo Continente) | ✅ Disponibile |
| **Campagna I** (Diario + Personaggi · 9 sessioni) | ✅ Disponibile |
| **One-Shot** | 🔒 In arrivo |

### Personaggi disponibili

| Personaggio | Stato |
|---|---|
| **Magnus Volstruker** | ✅ Disponibile |
| **Elaris Corven** | ✅ Disponibile |
| **Nemeia** | ✅ Disponibile |
| **Eutirox** | ✅ Disponibile |

## Come aggiungere una nuova nazione

1. Crea un file in `centuria/nations/` (es. `centuria/nations/nuova-nazione.html`), usando `kassendyr.html` o `velikor.html` come base.
2. Crea un CSS personalizzato in `centuria/css/nations-<nome-nazione>.css`.
3. Aggiungi la card in `centuria/centuria.html` nella sezione **Nazioni Conosciute**.
4. Se disponibile, usa un link `<a class="nation-card" href="nations/nuova-nazione.html">`; altrimenti, usa `<div class="nation-card locked">`.
5. Inserisci eventuali immagini in `centuria/resources/<nome-nazione>/`.

## Come aggiungere un evento alla Campagna I

1. Apri `centuria/campaign/first_campaign/first_campaign.html`.
2. Nel tab **Diario**, aggiungi una nuova `<div class="discovery-card">` nella sezione masonry:
   - Imposta `data-cat` a una di: `storia`, `avventure`, `npc`, `locazioni`
   - Imposta `data-sess` al numero della sessione (deve corrispondere a `SESSIONS` in `centuria/js/campagne.js`)
3. Usa gli esempi esistenti come template per il contenuto.
4. Per aggiungere una nuova sessione, modifica l'array `SESSIONS` in `centuria/js/campagne.js`.

## Hosting

Il sito è pubblicato su GitHub Pages: [https://alcrispy.github.io/Centuria](https://alcrispy.github.io/Centuria)

Progetto completamente statico: nessun backend, nessuna build, dipendenze esterne limitate a Google Fonts e Leaflet.js.

## Autori

Progetto creato e sviluppato da:

- **Alessandro Crispini**
- **Alessandro Gusta**
- **Matteo Tonetta**
- **Andrea Baima**
- **Federica Pilloni**

*Centuria - Campagna GDR*
