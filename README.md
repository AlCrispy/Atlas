# Centuria — Atlante del Mondo Conosciuto

> *"Un mondo antico, segnato da guerre dimenticate, magie proibite e potenze che sfidano il tempo stesso."*

Sito web interattivo per la campagna GDR **Centuria**. Permette di esplorare le nazioni, la storia e i luoghi del mondo di gioco in modo visivo e organizzato.

---

## Struttura del progetto

```
centuria/
├── index.html              # Schermata principale — mappa e selezione nazioni
├── README.md
├── resources/
│   └── Centuria_plain.png  # Mappa del continente
└── nations/
    └── kassendyr.html      # L'Impero del Sangue Persistente
```

## Nazioni

| Nazione | Continente | Stato |
|---|---|---|
| **Kassendyr** | Vecchio Continente · Sud | ✅ Disponibile |
| Lega di Aurelion | Vecchio Continente · Centro | 🔒 In arrivo |
| Velikor | Vecchio Continente · Nord | 🔒 In arrivo |
| Valdherba | Vecchio Continente · Est | 🔒 In arrivo |
| Kalveor | Vecchio Continente · Sud | 🔒 In arrivo |
| Isola Perennogelo | Arcipelago · Nord-Est | 🔒 In arrivo |

## Come aggiungere una nuova nazione

1. Creare un file `nations/nomegazione.html` (usare `kassendyr.html` come template)
2. Aggiungere la card corrispondente in `index.html` nella griglia delle nazioni, cambiando `locked` in link `<a href="nations/nomegazione.html">`

## Hosting

Il sito è hostato su **GitHub Pages**:
`https://alcrispy.github.io/Centuria`

È un sito completamente statico — nessun backend, nessuna dipendenza esterna tranne Google Fonts.

---

## Autori

Progetto creato e sviluppato da:

- **Alessandro Crispini**
- **Alessandro Gusta**
- **Matteo Tonetta**
- **Andrea Baima**
- **Federica Pilloni**

---

*Centuria — Campagna GDR*
