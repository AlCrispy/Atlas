# Centuria - Atlante del Mondo Conosciuto

> *"Un mondo antico, segnato da guerre dimenticate, magie proibite e potenze che sfidano il tempo stesso."*

Sito web statico per la campagna GDR **Centuria**. Permette di esplorare nazioni e territori tramite una mappa principale e pagine tematiche dedicate.

## Struttura attuale del progetto

```text
centuria/
|- index.html                  # Home con mappa, nazioni conosciute e Terre Ignote
|- terre-ignote.html           # Diario del nuovo continente in esplorazione
|- README.md
|- LICENSE
|- CLAUDE.md                   # Guida per Claude Code
|- resources/
|  |- Centuria_plain.png       # Mappa principale
|  `- kassendyr/               # Asset visivi della nazione Kassendyr
|- nations/
|  |- kassendyr.html           # Scheda completa: L'Impero del Sangue Persistente
|  |- velikor.html             # Scheda completa: La Repubblica delle Pianure
|  `- aurelion.html            # Scheda completa: Lega di Aurelion
|- campagne/
|  `- campagna1/
|     |- campagna1.html        # Pagina principale della Campagna I
|     `- characters/
|        `- magnus/
|           `- magnus.html     # Scheda Magnus
|- css/
|  |- index.css                # Styling della home
|  |- campagne-base.css        # Styling base delle campagne
|  |- campagne-components.css  # Componenti delle campagne
|  |- nations-*.css            # Styling per ogni nazione
|  `- terre-ignote-*.css       # Styling per le terre ignote
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
| Valdherba | Vecchio Continente · Sud-Est | 🔒 In arrivo |
| Kalveor | Vecchio Continente · Sud | 🔒 In arrivo |
| Isola Perennogelo | Arcipelago · Nord-Est | 🔒 In arrivo |

### Altre aree

| Area | Stato |
|---|---|
| **Terre Ignote** (Nuovo Continente) | ✅ Disponibile |
| **Campagna I** (Diario + Personaggi) | ✅ Disponibile |

### Personaggi disponibili

| Personaggio | Classe | Stato |
|---|---|---|
| **Magnus Volstruker** | Mago · Cronomagia | ✅ Disponibile |
| Elara Stonefist | Guerriero · Compagnia del Ferro | 🔒 In arrivo |
| Raven Nightwhisper | Ladro · Gilda dei Segreti | 🔒 In arrivo |
| Brother Marcus | Clerico · Ordine della Luce | 🔒 In arrivo |

## Come aggiungere una nuova nazione

1. Crea un file in `nations/` (es. `nations/nuova-nazione.html`), usando `kassendyr.html` o `velikor.html` come base.
2. Crea un CSS personalizzato in `css/nations-<nome-nazione>.css`.
3. Aggiungi la card in `index.html` nella sezione **Nazioni Conosciute**.
4. Se disponibile, usa un link `<a class="nation-card" href="nations/nuova-nazione.html">`; altrimenti, usa `<div class="nation-card locked">`.
5. Inserisci eventuali immagini in `resources/<nome-nazione>/`.

## Come aggiungere un evento alla Campagna I

1. Apri `campagne/campagna1/campagna1.html`.
2. Nel tab **Diario**, aggiungi una nuova `<div class="discovery-card">` nella sezione masonry:
   - Imposta `data-cat` a una di: `storia`, `avventure`, `npc`, `locazioni`
   - Imposta `data-sess` al numero della sessione (deve corrispondere a `SESSIONS` in `js/campagne.js`)
3. Usa gli esempi esistenti come template per il contenuto.
4. Per aggiungere una nuova sessione, modifica l'array `SESSIONS` in `js/campagne.js`.

## Hosting

Il sito e pubblicato su GitHub Pages: [https://alcrispy.github.io/Centuria](https://alcrispy.github.io/Centuria)

Progetto completamente statico: nessun backend, nessuna build, dipendenze esterne limitate a Google Fonts.

## Autori

Progetto creato e sviluppato da:

- **Alessandro Crispini**
- **Alessandro Gusta**
- **Matteo Tonetta**
- **Andrea Baima**
- **Federica Pilloni**

*Centuria - Campagna GDR*
