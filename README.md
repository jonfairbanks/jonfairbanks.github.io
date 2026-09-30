# Fairbanks.io

Source for [fairbanks.io](https://fairbanks.io), a static Next.js site deployed with GitHub Pages.

The app renders a single landing page with animated canvas ribbons, profile/action buttons, and Google Analytics click tracking for the outbound controls.

## Tech Stack

- [Next.js](https://nextjs.org/) with App Router
- React
- Tailwind CSS
- Font Awesome and Lucide icons
- Playwright for browser-level tests
- GitHub Actions for quality checks and GitHub Pages deployment

## Local Development

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The main page lives in [app/page.tsx](app/page.tsx). Shared UI components are under [components](components).

## Quality Checks

Run the full local validation set:

```bash
npm run lint
npm test
npm run build
```

Useful individual commands:

```bash
npm run lint      # ESLint
npm test          # Playwright E2E tests
npm run build     # Static Next.js export
npm audit         # Dependency audit
```

The production build uses `output: "export"` in [next.config.mjs](next.config.mjs), so `npm run build` emits the static site to `out/`.

## Deployment

GitHub Pages deploys the static export through [publish.yml](.github/workflows/publish.yml).

Deployment flow:

1. Changes are developed on `develop`.
2. Pull requests target the production branch.
3. Merges to `master` or `main` trigger `publish-to-github-pages`.
4. The workflow builds the static Next.js export, uploads `out/`, and deploys it with GitHub Pages.

The live custom domain is [fairbanks.io](https://fairbanks.io).

## CSS Delivery

The single-page export uses Next.js `experimental.inlineCss` to include its
styles in the HTML and avoid blocking stylesheet requests. The icons use only
their required SVG sizing rules. This flag is experimental and works only in
production builds. Next.js does not yet recommend it for production; verify the
exported page after upgrades. Disable the flag to restore external stylesheets.

## Asset Caching

GitHub Pages does not apply `next.config` response headers to the static export.
For versioned assets, configure this rule in Cloudflare:

1. Open **fairbanks.io → Cache → Cache Rules → Cache Response Rules**.
2. Create a rule named **Cache Versioned Next.js Assets**.
3. Select **Custom Filter Expression → Edit Expression** and enter:

   ```text
   (http.host eq "fairbanks.io" and starts_with(http.request.uri.path, "/_next/static/") and http.response.code eq 200)
   ```

4. Select **Modify Cache-Control Directives**. Set `public`, set `max-age` to
   `31536000` seconds, and set `immutable`. Leave **Cloudflare Only** off for
   each directive so browsers receive the new values.
5. Place the rule after any broader rule that changes these directives, then
   deploy it.

Copy a current `/_next/static/` asset URL from the browser's Network panel and
check its headers with `curl -I`. Expect HTTP 200 and
`Cache-Control: public, max-age=31536000, immutable` (directive order may vary).
HTML, the manifest, unversioned images, and error responses do not match this
rule. To roll back, disable it.

See [Cloudflare's Cache Response Rules guide](https://developers.cloudflare.com/cache/how-to/cache-response-rules/create-dashboard/).

## CI

[quality.yml](.github/workflows/quality.yml) runs on pull requests to `master`/`main` and pushes to `develop`.

It verifies:

- Dependency installation with the shared setup action
- Playwright Chromium browser installation
- `npm run lint`
- `npm test`
- `npm run build`
- `npm audit`

Workflow actions are pinned by commit SHA with version comments.

## Analytics

Google Analytics is configured in [app/layout.tsx](app/layout.tsx). Outbound profile/action controls emit a `button_click` event through [utils/analytics.ts](utils/analytics.ts), including:

- `button_target`
- `button_label`
- `link_url`

## Dependency and Release Flow

Use Node.js 24 LTS (`nvm use`). CI also tests Node.js 26.

Feature, fix, and Dependabot branches target `develop`. Dependabot auto-merge is limited to patch and minor updates into `develop`; major updates need review. Quality requires lint, browser tests, builds, and `npm audit --audit-level=high`.

Promote releases with a PR directly from `develop` to `main`. The required `release-source` check rejects other sources. Both long-lived branches require the `test`, `dependency-audit`, and `release-source` checks before merging. Only pushes to `main` publish GitHub Pages.

The production branch is `main`. Keep Tailwind 3 and ESLint 9 as the integration branch's compatibility choices. Dependency security fixes update their compatible lockfile ranges without forcing major upgrades.

### Weekly Promotion

`.github/workflows/weekly-develop-to-main.yml` copies F5's Monday 12:17 UTC schedule (5:17 AM Pacific during daylight time, 4:17 AM during standard time). It can also run manually from `main`.

The job skips unchanged source files, creates or reuses a direct `develop` → `main` PR, waits for `test`, `dependency-audit`, and `release-source`, then enables normal merge-commit auto-merge. It watches the Pages deployment for that exact merge commit and checks the live homepage and manifest.

`PERSONAL_TOKEN` must have repository Contents and Pull Requests write access plus Actions read access. PR creation and merging use it so GitHub emits normal CI and deployment events. The workflow never checks out PR code or bypasses a failed check.

F5's production branch requires passing checks without requiring the release head to contain every production merge commit. Match that setting on `main` when activating weekly promotion; keep strict current-base checks on `develop`. Otherwise later release PRs can remain blocked solely by merge history.
