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
|- resources/
|  |- Centuria_plain.png       # Mappa principale
|  `- kassendyr/               # Asset visivi della nazione Kassendyr
`- nations/
   |- kassendyr.html           # Scheda completa: L'Impero del Sangue Persistente
   `- velikor.html             # Scheda completa: La Repubblica delle Pianure
```

## Stato contenuti

### Nazioni conosciute

| Nazione | Continente | Stato |
|---|---|---|
| **Kassendyr** | Vecchio Continente · Estremo Sud | ✅ Disponibile |
| **Velikor** | Vecchio Continente · Nord | ✅ Disponibile |
| **Lega di Aurelion** | Vecchio Continente · Centro | ✅ Disponibile |
| Valdherba | Vecchio Continente · Sud-Est | 🔒 In arrivo |
| Kalveor | Vecchio Continente · Sud | 🔒 In arrivo |
| Isola Perennogelo | Arcipelago · Nord-Est | 🔒 In arrivo |

### Altri territori

| Area | Stato |
|---|---|
| **Terre Ignote** (Nuovo Continente) | ✅ Disponibile |

## Come aggiungere una nuova nazione

1. Crea un file in `nations/` (es. `nations/nuova-nazione.html`), usando `kassendyr.html` o `velikor.html` come base.
2. Aggiungi la card in `index.html` nella sezione **Nazioni Conosciute**.
3. Se la nazione e disponibile, usa un link `<a class="nation-card" href="nations/nuova-nazione.html">`; se non lo e, mantieni la card con classe `locked`.
4. Inserisci eventuali immagini in `resources/<nome-nazione>/` e collegale nella pagina della nazione.

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
