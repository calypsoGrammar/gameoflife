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

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`: `npm ci`, `npm test`, `npm run build`. It also supports manual runs from the Actions tab. A failing test or build fails the check and prevents deployment. Pull requests only test and build; successful runs on `main` also deploy.

## Deployment (GitHub Pages)

The expected site URL is https://calypsoGrammar.github.io/gameoflife/. Keep `base: '/gameoflife/'` in `vite.config.js` so asset URLs work under the repository path.

### One-time setup

1. In [Settings → Pages](https://github.com/calypsoGrammar/gameoflife/settings/pages), set **Build and deployment → Source** to **GitHub Actions**. Replace any existing branch-based source; no generated starter workflow is needed.
2. In **Settings → Actions → General**, ensure Actions are enabled and repository policy allows the `actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages` actions used by the workflow.
3. Merge the deployment workflow into `main`. That push starts the first deployment. If the workflow was merged before Pages was configured, open **Actions → CI → Run workflow**, select `main` and run it again.
4. Check that both `test-and-build` and `deploy` succeed. The `deploy` job reports the published URL. The `github-pages` environment is created automatically if absent; if it already has deployment branch rules, allow `main`. Required reviewers on that environment will make each deployment wait for approval.

No personal access token or repository secret is needed. The workflow grants Pages and OIDC write permissions only to the deployment job; the test/build job has read-only repository access. Do not enable broad write permissions globally.

### Future releases and recovery

Every push or merged pull request to `main` installs locked dependencies, runs tests, builds fresh `dist/` output and deploys that artifact. The checked-in `dist/` files are not the deployment source. There is no manual subtree push or `gh-pages` branch maintenance.

To redeploy, use **Actions → CI → Run workflow → main**. Manual runs on other branches can test and build but cannot publish. Deployments are serialized and an active deployment is allowed to finish. To roll back, revert the faulty change through a pull request and merge it into `main`; the same workflow tests and publishes the reverted source.

If deployment fails, check the `deploy` job logs, the Pages source setting and the `github-pages` environment rules. A failed test/build skips deployment and leaves the previously published site in place.

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
