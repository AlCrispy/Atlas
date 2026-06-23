# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Centuria is a static HTML/CSS/JavaScript website for a tabletop RPG campaign set in a fantasy world. The site presents information about nations, territories, and characters in an Italian-language interface styled to evoke a historical atlas.

**Key characteristics:**
- Completely static site (no build process, no server)
- Hosted on GitHub Pages at [https://alcrispy.github.io/Centuria](https://alcrispy.github.io/Centuria)
- No backend, no database, no package manager
- External dependencies: Google Fonts, Leaflet.js (for interactive maps), CDNJS for CDN resources
- All content changes are made by directly editing HTML files

## Architecture & File Structure

### Core Pages

- **index.html** — Main landing page featuring an interactive Leaflet.js map of the world, ocean labels, and cards for known nations. Uses inline SVG-based map pins for interactive markers.
- **terre-ignote.html** — "Unknown Lands" diary documenting exploration of a newly discovered continent.
- **nations/{nation}.html** — Individual nation pages (kassendyr, velikor, aurelion) with tabbed navigation (`switchTab()` function from js/nation-tabs.js).
- **characters/{character}/{character}.html** — Character detail pages.

### Styling

- **css/index.css** — Main page styles including map styling, nation cards, ocean labels, and Leaflet customization.
- **css/nations-{nation}.css** — Nation-specific stylesheet for each nation page (kassendyr, velikor, aurelion). Each nation has its own color palette and visual hierarchy.
- **css/terre-ignote-base.css** & **css/terre-ignote-components.css** — Separated stylesheets for the exploration continent page.

### Interactivity

- **js/nation-tabs.js** — Implements `switchTab(tabId, buttonElement)` for switching between sections on nation pages. Called inline from HTML buttons.
- **js/terre-ignote.js** — Functionality for the exploration continent page.

### Assets

- **resources/Centuria_plain.png** — Main world map image used on the landing page.
- **resources/{nation}/** — Folder per nation containing images (maps, character portraits, landmarks).

## Common Development Tasks

### Adding a New Nation

1. **Create the HTML file**: Copy `nations/kassendyr.html` or `nations/velikor.html` as a template to `nations/{newname}.html`. Update:
   - The `<title>` tag
   - All text content and sections
   - Image `src` attributes to point to `../resources/{newname}/`
   - CSS link to point to `../css/nations-{newname}.css`

2. **Create the stylesheet**: Copy an existing `css/nations-{nation}.css` to `css/nations-{newname}.css` and adjust colors/styling as needed. Each nation has its own color scheme.

3. **Add to index.html**: 
   - Create a `.nation-card` in the "Nazioni Conosciute" section.
   - If the nation is available, link it: `<a class="nation-card" href="nations/{newname}.html">`
   - If not yet available, use `<div class="nation-card locked">` to show it as coming soon.

4. **Add images**: Place nation images in `resources/{newname}/` (maps, portraits, landmarks).

5. **Add map marker** (optional): If adding to the Leaflet map on index.html, create a marker with the nation's coordinates and popup content.

### Testing the Site Locally

Since this is a static site with no build process:

- **Open directly in browser**: Double-click any `.html` file to open it (works for simple static content).
- **Use a local server** (recommended for testing Leaflet maps and external links):
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Python 2
  python -m SimpleHTTPServer 8000
  
  # Node.js (if available)
  npx serve
  ```
  Then visit `http://localhost:8000` in your browser.

### Modifying Styles

- **Nation-specific changes**: Edit `css/nations-{nation}.css`. Each nation defines its own `--primary-color`, `--secondary-color`, `--gold`, etc.
- **Global styles**: Edit `css/index.css` for changes affecting the main page.
- **Exploration page**: Edit `css/terre-ignote-base.css` and `css/terre-ignote-components.css`.

Color variables are typically defined at the top of each CSS file and used throughout for consistency.

### Adding Content

Simply edit the HTML files directly—no build step is needed. Content sections typically follow a pattern:

```html
<div class="section-banner">
  <p class="section-eyebrow">Subtitle</p>
  <h2 class="section-title">Main Title</h2>
</div>

<div class="chapter">
  <div class="chapter-heading">
    <span class="chapter-num">I</span>
    <span class="chapter-title">Chapter Title</span>
    <div class="chapter-line"></div>
  </div>
  <p>Paragraph content...</p>
</div>
```

## Important Notes

- **Language**: All content is in Italian; maintain this language when adding text.
- **Code language**: All code — comments, variable names, function names, commit messages — must be written in **English**. Only the user-visible HTML content stays in Italian.
- **External Dependencies**: The site relies on Google Fonts and Leaflet.js from CDNs. Ensure `<link>` and `<script>` tags remain in HTML `<head>` sections.
- **Character Encoding**: All HTML files use UTF-8. Maintain this when editing.
- **Relative Paths**: Use relative paths for all internal links (e.g., `../css/`, `../resources/`) so the site works both locally and on GitHub Pages.
- **GitHub Pages Deployment**: Push changes to the `main` branch; the site auto-publishes from the root directory.

## Campagne Structure

**Campaign Pages:**
- **campagne/campagna1.html** — Main campaign page with header tabs in the topbar (similar to nations like kassendyr.html):
  - **Diario tab**: Timeline and event grid with subcategories (storia, avventure, npc, locazioni), with secondary Timeline/Eventi toggles below the header
  - **Personaggi tab**: Character roster with links to individual character pages (Magnus available, others "In arrivo")
  - Contains all 6 sessions and 23 discovery cards migrated from terre-ignote.html

**Campaign Styling:**
- **css/campagne-base.css** & **css/campagne-components.css** — Identical color scheme to terre-ignote.html:
  - Background: Dark teal-blue (#060a0a)
  - Text: Light teal-gray (#ccd4d0)
  - Accents: Gold (#c9a84c)
  - Category colors: Blue (storia), Purple (avventure), Brown (npc), Green (locazioni)

**Campaign JavaScript:**
- **js/campagne.js** — Handles session management (6 sessions), category filtering, timeline generation for the diario view
- **switchMainView()** (inline in campagna1.html) — Toggles between diario and personaggi views
- Categories mapped from terre-ignote: fazioni→npc, misteri→avventure, citta/punti→locazioni

### Adding Campaign Events

Edit `campagne/campagna1.html` (in the diario section):
1. Copy an existing `<div class="discovery-card">` block
2. Set `data-cat` to one of: `storia`, `avventure`, `npc`, `locazioni`
3. Set `data-sess` to the session number (must match a session in `js/campagne.js`)
4. Update the category label, session number, title, and description
5. The page rebuilds automatically on reload

To add a new session, update the `SESSIONS` array in `js/campagne.js` with `num`, `title`, and `summary`.

## Git Workflow

1. Create a feature branch: `git checkout -b feature/new-content`
2. Edit HTML/CSS files directly
3. Test locally in a browser
4. Commit changes: `git commit -m "Add new nation / Update styling / etc."`
5. Push to `main` or create a pull request for review
6. Site updates automatically on GitHub Pages after merge

No linting, build step, or test suite—all changes are live HTML/CSS/JS.
