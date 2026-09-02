# Contributing

## Prerequisites

- Node.js version in `.nvmrc` and npm
- macOS is recommended for Finder-tagged photo builds; other platforms use empty tags
- Optional Cloudflare R2 credentials for download generation (see `.env.example`)

Install dependencies with `npm ci`, then use `npm run dev` for local development.

## Quality checks

Run `npm run format:check`, `npm run typecheck`, `npm run lint`, and `npm test` before opening a PR.

The photo pages use locally available portfolio assets and the `vite-image-pipeline` package. A
complete production build may also require its native image libraries and local ML model cache.

## Build and deployment

`npm run build` creates the static site and applies the HTML post-processing step. `npm run deploy`
builds and deploys `dist/` to Cloudflare Pages. Deployments are intentionally local because the
portfolio images are not stored online.

Keep credentials in local `.env` or Cloudflare bindings. Never commit values to `.env.example` or
source files.
