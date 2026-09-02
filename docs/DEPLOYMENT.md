# Deployment

Production deployment is local. Cloudflare Pages is the hosting target, and Wrangler is the only
deployment client used by this repository.

## Production flow

1. Download or otherwise prepare the local image and photo data required by the photo pages.
2. Run `npm run deploy` from the repository root.
3. The script builds the Astro output, runs the post-build minification, and publishes `dist/` to
   the `main` branch of the Cloudflare Pages project defined by `wrangler.toml`.

GitHub is used for source control only. It must not be treated as a production build or deployment
environment because the local image assets are not available there.

## Local prerequisites

- Node.js matching `.nvmrc`
- Installed npm dependencies via `npm ci`
- Wrangler authentication for the Cloudflare account
- Locally available image/photo data required by the build
- Local values from `.env.example` for build-time integrations
- Cloudflare Pages Function values from `.dev.vars.example`

Use `npm run build` when you only need to produce or inspect `dist/` without publishing it. Pull
request validation belongs in a separate GitHub Actions quality workflow and must not publish
production assets.

## Secrets

Never place secret values in `wrangler.toml`, source files, or committed environment files. Use
`.env` for local build-time values and `.dev.vars` for local Pages Function bindings. Configure
the three Spotify values as Cloudflare Pages production secrets before publishing the API
function. The Google Maps key is intentionally browser-visible; restrict it by HTTP referrer,
API, and quota because it is embedded into generated HTML at build time.
