# Atlas - Ambientazioni GDR

> *"Un mondo antico, segnato da guerre dimenticate, magie proibite e potenze che sfidano il tempo stesso."*

Sito web statico che ospita più ambientazioni per campagne GDR. `index.html` in root è l'hub di selezione; ogni ambientazione vive nella propria cartella di primo livello, completamente autonoma (CSS, JS, risorse e pagine incluse).

Ambientazioni attive:

- **[Centuria](#centuria)** — mondo fantasy in stile atlante storico, con mappa Leaflet, nazioni e campagna in corso.
- **[Unknown Frontier](#unknown-frontier)** — ambientazione fantascientifica con galassia e sistemi stellari navigabili in 3D (Three.js).

## Struttura del progetto

```text
Atlas/
|- index.html                  # Hub di selezione ambientazioni (entry point del sito)
|- hub.css                     # Styling dell'hub (solo root, non fa parte di nessuna ambientazione)
|- README.md
|- LICENSE
|- CLAUDE.md                   # Guida per Claude Code
|
|- centuria/                   # Ambientazione fantasy "Centuria"
|  |- centuria.html            # Home con mappa, nazioni conosciute e Terre Ignote
|  |- terre-ignote.html        # Diario del nuovo continente in esplorazione
|  |- nations/                 # Schede nazione (kassendyr, velikor, aurelion, valdherba)
|  |- locations/               # Pagine dettaglio locazioni delle Terre Ignote
|  |- campaign/first_campaign/  # Pagina campagna + schede personaggi
|  |- resources/                # Mappe e asset per nazione
|  |- css/
|  `- js/
|
`- unknown-frontier/           # Ambientazione sci-fi "Unknown Frontier"
   |- unknown-frontier.html    # Mappa galattica 3D (Three.js) con le fazioni/sistemi noti
   |- systems/                 # Una pagina per sistema stellare (vista 3D del sistema)
   |  `- planets/              # Una pagina per pianeta/corpo celeste
   |- resources/                # Texture e sfondi della galassia
   |- music/                    # Traccia ambient condivisa dalle pagine
   |- css/
   `- js/                       # Rendering galassia/sistemi (Three.js), audio, interazione scene
```

## Centuria

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
| **Campagna I** (Diario + Personaggi · 12 sessioni) | ✅ Disponibile |
| **One-Shot** | 🔒 In arrivo |

### Personaggi disponibili

| Personaggio | Stato |
|---|---|
| **Magnus Volstruker** | ✅ Disponibile |
| **Elaris Corven** | ✅ Disponibile |
| **Nemeia** | ✅ Disponibile |
| **Eutirox** | ✅ Disponibile |

### Come aggiungere una nuova nazione

1. Crea un file in `centuria/nations/` (es. `centuria/nations/nuova-nazione.html`), usando `kassendyr.html` o `velikor.html` come base.
2. Crea un CSS personalizzato in `centuria/css/nations-<nome-nazione>.css`.
3. Aggiungi la card in `centuria/centuria.html` nella sezione **Nazioni Conosciute**.
4. Se disponibile, usa un link `<a class="nation-card" href="nations/nuova-nazione.html">`; altrimenti, usa `<div class="nation-card locked">`.
5. Inserisci eventuali immagini in `centuria/resources/<nome-nazione>/`.

### Come aggiungere un evento alla Campagna I

1. Apri `centuria/campaign/first_campaign/first_campaign.html`.
2. Nel tab **Diario**, aggiungi una nuova `<div class="discovery-card">` nella sezione masonry:
   - Imposta `data-cat` a una di: `citta`, `misteri`, `fazioni`, `punti`
   - Imposta `data-sess` al numero della sessione (deve corrispondere a `SESSIONS` in `centuria/js/campagne.js`)
3. Usa gli esempi esistenti come template per il contenuto.
4. Per aggiungere una nuova sessione, modifica l'array `SESSIONS` in `centuria/js/campagne.js`.

## Unknown Frontier

Ambientazione sci-fi navigabile in 3D: la home mostra la galassia, da cui si accede ai singoli sistemi stellari e ai pianeti che li compongono.

## Hosting

Il sito è pubblicato su GitHub Pages: [https://alcrispy.github.io/Atlas](https://alcrispy.github.io/Atlas)

Progetto completamente statico: nessun backend, nessuna build. Dipendenze esterne: Google Fonts, Leaflet.js, Three.js via CDN.

## Autori

Progetto creato e sviluppato da:

- **Alessandro Crispini**
- **Alessandro Gusta**
- **Matteo Tonetta**
- **Andrea Baima**
- **Federica Pilloni**

*Atlas - Campagne GDR*
