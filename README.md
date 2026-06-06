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
