# Game of Life

A static Conway's Game of Life simulator built with Vite, Alpine and Tailwind CSS 3, published on GitHub Pages at `/gameoflife/`.

## Requirements

Node.js `^20.19.0 || >=22.12.0` (required by Vite 8) and npm. CI uses Node 22.

## Local setup

```sh
npm ci            # install exact dependencies from package-lock.json
npm run dev       # dev server with hot reload
npm test          # run the Vitest regression suite once
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Project layout

- `src/javascripts/life.js` – DOM-free logic: Conway rules, import/export, viewport (pan/zoom/coordinate mapping).
- `src/javascripts/main.js` – DOM wiring, canvas drawing, controls.
- `tests/life.test.js` – regression tests (still lifes, blinker, glider, import/export round-trip, viewport).
- `vite.config.js` – sets `base: '/gameoflife/'` for GitHub Pages.

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`: `npm ci`, `npm test`, `npm run build`. A failing test or build fails the check.

## Deployment (GitHub Pages)

The site is served at `https://<owner>.github.io/gameoflife/`, so `base` in `vite.config.js` must equal `/<repository name>/`.

GitHub Pages can only serve a branch root, a branch's `/docs` folder, or a GitHub Actions artifact; it cannot serve `dist/` on `main` directly. There is no automated deploy workflow, so deploy manually to a `gh-pages` branch:

```sh
npm ci && npm test && npm run build
git add -f dist && git commit -m "Rebuild dist"      # dist is in .gitignore but tracked, so it must be force-added
git subtree push --prefix dist origin gh-pages
```

Then in the repository's Settings → Pages, set the source to "Deploy from a branch", branch `gh-pages`, folder `/ (root)`. (The repository owner should confirm this setting; the current Pages configuration is not recorded in the repository.)

CI only tests and builds; it does not deploy.

## Controls

- Left click on the grid: toggle a cell (only before the first generation has run).
- Play / pause / step / reset buttons; the frequency field sets seconds per generation (0.01–10).
- Middle or right mouse drag-release: pan the view (press, then release at the target position).
- `w` `a` `s` `d`: pan. `m` / mouse wheel up: zoom in. `n` / mouse wheel down: zoom out.
- `i`: advance one generation. `c` / `v`: run the count and apply phases separately (debug).
- Keyboard and wheel shortcuts and canvas clicks are active only while the menu is hidden.
- Grid, theme, cell colour and hide-controls toggles are in the toolbar.

## Import / export schema

Download saves a JSON file; Select + Load restores it.

```json
{
  "alive": [{ "x": 0, "y": 0, "count": 0 }],
  "settings": {
    "generations": 0,
    "col": "#af1919",
    "offset_x": 0,
    "offset_y": 0,
    "square_width": 50,
    "frequency": "1",
    "grid": true,
    "dark": false,
    "name": "my-pattern",
    "edit": true
  }
}
```

- `alive`: live cells at integer grid coordinates (`x` right, `y` down, may be negative). `count` is the neighbour count and is recomputed on each step.
- `settings`: all fields are applied together when present. Either section may be omitted; a missing section is skipped with a console warning, and invalid JSON logs an error and changes nothing.

## Performance

Each generation is computed in one pass over the live cells: every live cell
adds one to the tally of its eight neighbours (a `Map` keyed by an integer
coordinate key), so work is proportional to the live cells plus their
neighbour frontier, not to repeated array scans. Playback uses chained
timeouts, so a slow generation delays the next one instead of queueing ticks.

Documented bound: imports are capped at 10,000 cells (`LIMITS.max_cells`), and
a generation of a 10,000-cell pattern is expected to take well under a second
(typically a few tens of milliseconds). Coordinates must stay within about
±33 million. `tests/performance.test.js` holds small/medium/large fixtures and
an equivalence check against a naive implementation; run with `npm test`.
