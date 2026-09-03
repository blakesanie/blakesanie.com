# Contributing

## Prerequisites

- Node.js version in `.nvmrc` and npm
- macOS is recommended for Finder-tagged photo builds; other platforms use empty tags
- Optional Cloudflare R2 credentials for download generation (see `.env.example`)

Install dependencies with `pnpm install --frozen-lockfile`, then use `pnpm dev` for local development.

## Quality checks

Run `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, and `pnpm test` before opening a PR.

The photo pages use locally available portfolio assets and the `vite-image-pipeline` package. A
complete production build may also require its native image libraries and local ML model cache.

## Build and deployment

`pnpm build` creates the static site, applies HTML post-processing, and uploads required remote
images to R2. `pnpm deploy` runs that build, verifies every `download.blakesanie.com` image URL
referenced by `dist/`, then publishes `dist/` to Cloudflare Pages. A failed R2 upload or
verification prevents the site deployment. Deployments are intentionally local because the
portfolio images are not stored online.

Keep credentials in local `.env` or Cloudflare bindings. Never commit values to `.env.example` or
source files.
