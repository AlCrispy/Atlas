# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Centuria is a static HTML/CSS/JavaScript website for a tabletop RPG campaign set in a fantasy world. The site presents information about nations, territories, and characters in an Italian-language interface styled to evoke a historical atlas.

**Key characteristics:**
- Completely static site (no build process, no server)
- Hosted on GitHub Pages at [https://alcrispy.github.io/Atlas](https://alcrispy.github.io/Atlas)
- No backend, no database, no package manager
- External dependencies: Google Fonts, Leaflet.js (for interactive maps), CDNJS for CDN resources
- All content changes are made by directly editing HTML files

## Repository Layout

The repo hosts multiple settings ("worlds"), each self-contained in its own top-level folder. `index.html` at the root is a setting-selector hub; everything specific to the Centuria setting lives under `centuria/` (its own `css/`, `js/`, `resources/`, and page folders). A future setting would get its own equivalent top-level folder rather than being mixed into `centuria/`. Because each setting's subtree is self-contained, internal relative links within `centuria/**` never need to reference paths outside that folder.

## Architecture & File Structure

### Core Pages

- **index.html** — Setting-selector hub (styled by root-level `css/hub.css`). The site's entry point on GitHub Pages; links to `centuria/centuria.html` and shows a locked "coming soon" card for future settings.
- **centuria/centuria.html** — Centuria's own landing page featuring an interactive Leaflet.js map of the world, ocean labels, and cards for known nations. Uses inline SVG-based map pins for interactive markers.
- **centuria/terre-ignote.html** — "Unknown Lands" diary documenting exploration of a newly discovered continent.
- **centuria/nations/{nation}.html** — Individual nation pages (kassendyr, velikor, aurelion, valdherba) with tabbed navigation (`switchTab()` function from centuria/js/nation-tabs.js).
- **centuria/campaign/first_campaign/first_campaign.html** — Campaign page (see "Campaign Structure" below).
- **centuria/campaign/first_campaign/characters/{character}/{character}.html** — Character detail pages (magnus, nemeia, elaris, eutirox).
- **centuria/locations/{location}.html** — Location detail pages (sitryll, porto-nero, locanda-cardo, etc.), styled by centuria/css/location-detail.css.

### Styling

- **css/hub.css** — Setting-selector hub page styles (root `index.html`). Root-level only; not part of the Centuria setting.
- **centuria/css/index.css** — Centuria landing page styles (centuria.html) including map styling, nation cards, ocean labels, and Leaflet customization.
- **centuria/css/nations-{nation}.css** — Nation-specific stylesheet for each nation page (kassendyr, velikor, aurelion, valdherba). Each nation has its own color palette and visual hierarchy.
- **centuria/css/terre-ignote-base.css**, **centuria/css/terre-ignote-components.css** & **centuria/css/terre-ignote-locations.css** — Separated stylesheets for the exploration continent page.
- **centuria/css/location-detail.css** — Shared stylesheet for the location detail pages in centuria/locations/.

### Interactivity

- **centuria/js/nation-tabs.js** — Implements `switchTab(tabId, buttonElement)` for switching between sections on nation pages. Called inline from HTML buttons.
- **centuria/js/terre-ignote.js** — Functionality for the exploration continent page.

### Assets

- **centuria/resources/Centuria_plain.png** — Main world map image used on the Centuria landing page.
- **centuria/resources/Centuria_GOT.png** — Thumbnail used by both the root hub (`index.html`) and the Centuria landing page.
- **centuria/resources/{nation}/** — Folder per nation containing images (maps, character portraits, landmarks).

## Common Development Tasks

### Adding a New Nation

1. **Create the HTML file**: Copy `centuria/nations/kassendyr.html` or `centuria/nations/velikor.html` as a template to `centuria/nations/{newname}.html`. Update:
   - The `<title>` tag
   - All text content and sections
   - Image `src` attributes to point to `../resources/{newname}/`
   - CSS link to point to `../css/nations-{newname}.css`

2. **Create the stylesheet**: Copy an existing `centuria/css/nations-{nation}.css` to `centuria/css/nations-{newname}.css` and adjust colors/styling as needed. Each nation has its own color scheme.

3. **Add to centuria/centuria.html**: 
   - Create a `.nation-card` in the "Nazioni Conosciute" section.
   - If the nation is available, link it: `<a class="nation-card" href="nations/{newname}.html">`
   - If not yet available, use `<div class="nation-card locked">` to show it as coming soon.

4. **Add images**: Place nation images in `centuria/resources/{newname}/` (maps, portraits, landmarks).

5. **Add map marker** (optional): If adding to the Leaflet map on centuria.html, create a marker with the nation's coordinates and popup content.

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

- **Nation-specific changes**: Edit `centuria/css/nations-{nation}.css`. Each nation defines its own `--primary-color`, `--secondary-color`, `--gold`, etc.
- **Global styles**: Edit `centuria/css/index.css` for changes affecting the Centuria landing page.
- **Exploration page**: Edit `centuria/css/terre-ignote-base.css` and `centuria/css/terre-ignote-components.css`.

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

## Campaign Structure

**Campaign Pages:**
- **centuria/campaign/first_campaign/first_campaign.html** — Main campaign page with header tabs in the topbar (similar to nations like kassendyr.html):
  - **Diario tab**: Event grid and timeline with subcategories (citta, misteri, fazioni, punti), with secondary Timeline/Eventi toggles below the header
  - **Personaggi tab**: Character roster with links to individual character pages in centuria/campaign/first_campaign/characters/
  - Event/session counters in the header are computed by centuria/js/campagne.js at load — never hardcode them

**Campaign Styling:**
- **centuria/css/campagne-base.css** & **centuria/css/campagne-components.css** — Identical color scheme to terre-ignote.html:
  - Background: Dark teal-blue (#060a0a)
  - Text: Light teal-gray (#ccd4d0)
  - Accents: Gold (#c9a84c)
  - Category colors: Blue (storia), Purple (avventure), Brown (npc), Green (locazioni)

**Campaign JavaScript:**
- **centuria/js/campagne.js** — Holds the `SESSIONS` array (one entry per game session) and handles category filtering, session filtering, and timeline generation for the diario view
- **switchMainView()** (inline in first_campaign.html) — Toggles between diario and personaggi views

### Adding a New Session

When the user provides session notes, do both steps:

1. **Add the session** to the `SESSIONS` array in `centuria/js/campagne.js`: `num` (next number), `title`, `date` (usually empty), and a `summary` written in Italian, second person plural ("voi"), matching the narrative tone of the existing entries.
2. **Extract discovery cards** from the notes into `centuria/campaign/first_campaign/first_campaign.html` (see below) — one card per notable event, place, character, or mystery.

### Adding Campaign Events

Edit `centuria/campaign/first_campaign/first_campaign.html` (in the diario section, before the closing `</div>` of the card grid):
1. Copy an existing `<div class="discovery-card">` block
2. Set `data-cat` to one of: `citta`, `misteri`, `fazioni`, `punti` (labels: Città & Insediamenti, Misteri & Anomalie, Fazioni & Personaggi, Punti di Interesse)
3. Set `data-sess` to the session number (must match a session in `centuria/js/campagne.js`)
4. Update the category label, session number, title, and description; an optional `<div class="card-quote">` holds a quote
5. The page rebuilds automatically on reload — counters and timeline are generated by centuria/js/campagne.js

To add a new session, update the `SESSIONS` array in `centuria/js/campagne.js` with `num`, `title`, and `summary`.

## Unknown Frontier Setting

A second, self-contained setting under `unknown-frontier/` (same pattern as `centuria/` — own `css/`, `js/`, `resources/`). `unknown-frontier/unknown-frontier.html` is the galaxy-overview scene (`unknown-frontier/js/galaxy.js`, three.js/WebGL): several procedural galaxies plus one clickable "black hole" beacon (Voro Nexus) at the origin.

### Black hole (Voro Nexus) — raymarched shader

`unknown-frontier/js/black-hole-raymarch.js` renders the black hole as a real-time gravitational-lensing raymarch (bent light rays, blackbody-ish accretion disk, event horizon), not a particle system — a classic `THREE.ShaderMaterial` (raw GLSL) on a sphere mesh under the site's normal `WebGLRenderer`. `createBlackHole({ scene, camera, position })` returns `{ mesh, update }`; `update()` must run every frame before `renderer.render()` (sets the camera-matrix uniforms the shader uses to reconstruct per-pixel view rays).

**Non-obvious lessons from getting this working (skip these and you'll re-break it):**

- **WebGPU/TSL was tried and abandoned.** An earlier version used `THREE.WebGPURenderer` + TSL (three.js's node shader language) to port a known-working WebGPU reference implementation. It rendered correctly in every environment this session could test (headless Chrome with real hardware WebGPU, the standalone reference page) but reliably broke the *entire* scene (galaxies included, not just the black hole) specifically when embedded in this page on the user's real Chromium/Brave — never reproduced, despite extensive debugging (about:gpu report showed WebGPU fully hardware-accelerated on their GPU). Ported the same algorithm to plain GLSL/WebGL2 instead — universally supported, no renderer swap, no three.js version bump, and it worked immediately. **Don't reintroduce WebGPU/TSL for this without a way to reproduce failures on the actual target hardware first.**
- **The raymarch needs a "jump to entry point" step.** The camera in this scene ranges from ~20 to ~620 units away (`OrbitControls.minDistance`/`maxDistance` in `galaxy.js`). A naive raymarch starting at the camera's own position burns its whole step budget crossing empty space (or immediately exceeds the loop's escape-radius check) and renders nothing. Fixed with an analytic ray-sphere intersection that jumps the ray straight to where it enters the "portal" sphere before marching — see the `entryT`/`bCoef`/`cCoef` block in the fragment shader.
- **Mass/disk radius ratio controls whether you get a ring or a sliver.** The event horizon needs to be small relative to the disk (~1:5, horizon:disk-inner-radius) so rays can plunge close enough to the singularity for the bend to get strong — that's what produces the Interstellar-style wraparound ring. A ~1:1.5 ratio (tried first) never bends enough; the disk reads as a thin streak instead of a ring.
- **No captured/reflected background.** An earlier version captured the real scene to a render target and reprojected it for rays that escape the black hole (so the "lensing" would bend real galaxies/labels behind it). Removed per feedback — it read as a distracting mirror-image (including UI labels) rather than a light effect. Escaped rays are now simply `discard`ed in the fragment shader (material is `transparent: true`), so the portal is invisible except where the disk/horizon actually draw — no reflection, no visible "aura" boundary circle.
- **`depthWrite: true` + `discard` together, not `depthWrite: false`.** The solid parts (horizon, disk) must occupy the depth buffer or other transparent scene objects (the starfield) can draw over the "opaque" black center depending on sort order. But `depthWrite: true` on the *whole* mesh would also depth-block anything behind the portal's empty interior. Fix: discard near-zero-alpha fragments explicitly (`if (outAlpha < 0.02) discard;`) so only the genuinely solid pixels touch the depth buffer.
- **No bloom pipeline.** No `EffectComposer`/post-processing in this scene. A first attempt to sell "glow" with a separate additive sprite behind the ring looked bad and was removed — brightness/glow now comes only from the shader's own color values (`diskBrightness`, the fire-palette color stops), not a compositing trick.
- **Disk color is a hand-picked fire palette, not physical blackbody.** `fireColor()` in the shader is a fixed 4-stop gradient (red → orange → yellow → white) instead of a temperature-derived blackbody curve — the physical formula's blue tint at high temperatures was undesired, and stop-based color gives direct control over how much of the ring reads as each hue. `temperatureFalloff` (config) still controls how far from the inner edge the hot colors extend.
- **Tuning knobs live in the `config` object** at the top of `createBlackHole()` — mass, disk inner/outer radius, brightness, rotation speed, turbulence scale/sharpness/stretch, edge softness, lensing strength, step size/count, portal radius. All were reached by iterative visual tuning (headless-Chrome screenshots), not derived — treat current values as a known-good starting point, not physically meaningful constants.

### Testing this scene without a browser session

The `claude-in-chrome` extension isn't reliably available in every session. When it isn't: run `python -m http.server 8000` from the repo root, then drive a **separate, disposable** headless Chrome instance via the Chrome DevTools Protocol (CDP) — launch with `--remote-debugging-port=<port>`, connect over the `webSocketDebuggerUrl` from `http://localhost:<port>/json/version`, and use `Page.navigate` + `Page.captureScreenshot` (add `Input.dispatchMouseEvent` for drag/scroll/zoom simulation) to get real screenshots instead of guessing. Real GPU-backed WebGPU is reachable this way too (`--enable-unsafe-webgpu --enable-features=Vulkan`, no `--use-angle=swiftshader`) — but note the lesson above: this session's own hardware is not a proxy for the user's, especially for anything WebGPU-related.

## Git Workflow

1. Create a feature branch: `git checkout -b feature/new-content`
2. Edit HTML/CSS files directly
3. Test locally in a browser
4. Commit changes: `git commit -m "Add new nation / Update styling / etc."`
5. Push to `main` or create a pull request for review
6. Site updates automatically on GitHub Pages after merge

No linting, build step, or test suite—all changes are live HTML/CSS/JS.
