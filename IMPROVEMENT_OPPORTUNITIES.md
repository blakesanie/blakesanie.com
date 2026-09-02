# blakesanie.com improvement opportunities

Audit date: 2026-09-02
Scope: the root Astro application, `src/`, `public/`, `api/`, `functions/`, `next/`, `plugins/`, build/deploy configuration, and checked-in data/tooling.

## Executive summary

The repository is functional and the current Astro diagnostics are clean (`npx astro check`: 0 errors, 0 warnings, 0 hints). A production build also completes successfully. The largest opportunity is not another round of isolated type fixes; it is establishing a clear product boundary and engineering system around several applications that currently share one repository and one deployment artifact.

The recommended target is a small monorepo with explicit applications and packages:

```text
apps/
  site/          Astro pages, shared site UI, content
  route-builder/ Next application, if it remains a supported product
  legacy/        static projects that are intentionally preserved
packages/
  types/         shared domain and API contracts
  image-pipeline/ build-time image processing and manifest generation
  spotify/       server-only now-playing client
```

That structure is optional; the non-optional part is making ownership, build boundaries, data contracts, and deployment behavior explicit.

## Current inventory

| Area | Current state | Main concern |
| --- | --- | --- |
| Astro site | Static output, roughly 20 page files plus shared components | Page-level data and browser scripts are tightly coupled to rendering |
| Photography | Dynamic image globs, EXIF, embeddings, map thumbnails, R2 uploads, browser CLIP search | Very expensive and difficult to test or reason about |
| Standalone projects | Many hand-written apps in `public/` (`periodicTable`, `planets`, `spotifyMosaic`, `401k`, etc.) | No common lifecycle, ownership, or quality gate |
| Next app | Separate `next/` application copied into Astro `dist/` during CI | Build errors and lint failures are explicitly ignored |
| API | Both `api/nowPlaying.js` and `functions/api/nowPlaying.js` exist | Duplicate implementations can drift and have different runtime assumptions |
| Build plugins | Local `plugins/vite-image-pipeline` is consumed through its built `dist/` output | Source/build artifact contract is unclear |
| Deployment | GitHub Actions clones a private photo repo, builds Astro and Next, then deploys | Trigger, credentials, and artifact ownership are fragile |
| Data/tooling | Large JSON, CSV, HAR, notebooks, PDFs, and generated/static files are checked in | Repository size and reviewability will degrade over time |

## Priority model

- **P0 — security or release correctness:** address before adding features.
- **P1 — architecture and maintainability:** address early; these reduce future change cost.
- **P2 — quality and product robustness:** address as the relevant area is touched.
- **P3 — polish and optimization:** worthwhile after the foundations are in place.

## P0: release, security, and correctness

### 1. Make one deployment system authoritative

Evidence: `.github/workflows/deploy.yml:11-13` triggers on `master`, while the repository’s active base branch is `main`. `vercel.json:2-4` also leaves `buildCommand` empty, and the workflow independently assembles the final output by copying `next/out/*` into `dist/`.

Recommendations:

- Decide whether Vercel configuration or GitHub Actions owns production deployment; remove the other path or document a deliberate split.
- Change branch triggers to the actual protected production branch and add pull-request validation separately from deployment.
- Give CI named build artifacts. Build Astro and Next into separate directories, validate both, then compose the deploy directory in one documented step.
- Add a smoke test that verifies representative Astro routes, Next routes, redirects, `robots.txt`, sitemap output, and the API endpoint in the final artifact.
- Pin the Node version using `.nvmrc` or `engines` and configure `actions/setup-node` with npm caching.

### 2. Stop suppressing Next quality failures

Evidence: `next/package.json:7` sets `TSC_COMPILE_ON_ERROR=true`; `next/next.config.ts:8-10` sets `eslint.ignoreDuringBuilds=true`; the workflow treats `npm run build` as sufficient.

Recommendations:

- Make `next build` fail on type errors and lint errors.
- Replace the deprecated/ambiguous `next lint` script with the repository’s chosen ESLint CLI configuration.
- Add explicit `typecheck`, `lint`, and `build` commands for both applications.
- If an existing violation must be tolerated temporarily, track it in a bounded issue list with an owner and removal date rather than disabling the gate globally.

### 3. Remove or restrict credentials and browser API keys

Evidence: `src/pages/photo/_MapGallery.astro:61` contains a Google Maps key in source. The deployment workflow passes `PORTFOLIO_PAT` into a shell command containing the token in the clone URL (`.github/workflows/deploy.yml:19-20,53-56`).

Recommendations:

- Treat the Maps key as exposed: rotate it if it has meaningful privileges, restrict it by API, HTTP referrer, and quota, and move it to the deployment environment or a deliberately public runtime configuration.
- Clone the private portfolio repository using a GitHub credential mechanism that does not interpolate the token into the command URL; limit token permissions to read-only access to that repository.
- Add secret scanning (for example, GitHub secret scanning plus a pre-commit scanner) and document which `PUBLIC_` variables are safe to expose.
- Add a CSP and restrict script/connect/image sources to the domains actually required by Maps, Leaflet, Spotify, the image CDN, and the CLIP assets.

### 4. Choose and consolidate the Spotify runtime

Evidence: `api/nowPlaying.js` and `functions/api/nowPlaying.js` implement the same feature with different response handling, caching, environment access, and error behavior. The root package includes both Node/Vercel-oriented and Cloudflare-oriented deployment tooling.

Recommendations:

- Select the production runtime and delete the unused handler, or put shared provider logic in a runtime-neutral package with two thin adapters.
- Define a `NowPlaying` response schema and validate Spotify payloads at the boundary. Handle empty history, podcast episodes, missing artwork, token refresh failures, and non-JSON error responses explicitly.
- Keep the access token in request-scoped or platform cache where possible; avoid mutable module-level state as the only cache in a serverless environment.
- Add timeout, retry/backoff, and cache headers intentionally, with tests for 200/204/401/429/5xx responses.

## P1: application architecture and maintainability

### 5. Split the repository into explicit applications and packages

Evidence: Astro routes, a separate Next 15 app, static legacy applications, serverless handlers, notebooks, and a local Vite plugin all live together. CI builds Astro, then builds Next, then copies one app over the other (`.github/workflows/deploy.yml:63-73`).

Recommendations:

- Write down the supported applications and their owners/lifecycle: actively maintained, legacy-but-hosted, experimental, or archival.
- Prefer workspaces (`npm` workspaces or pnpm) for `next/` and the local plugin so each package has a clear manifest and shared tooling.
- Use separate output directories and deployment manifests. Avoid relying on `cp -rn` to merge two independently generated sites.
- If the Next app is experimental, deploy it independently or archive it outside the main site build. If it is a product, promote it to a first-class app with its own CI and documentation.

### 6. Establish a typed domain model for page content

Evidence: project records are embedded in `src/pages/projects/index.astro`; press records and album configuration are embedded in page files; redirect data has a reusable type, but image/project/press types are still local or inferred. `src/components/Image/index.astro` uses broad `any` escape hatches in its props and intermediate values.

Recommendations:

- Create shared types such as `Project`, `ProjectLink`, `Technology`, `PressItem`, `Album`, `GalleryImage`, and `SeoMetadata` under `src/types/`.
- Move large content arrays to `src/content/` or typed data modules. Use Astro Content Collections for content that needs frontmatter, schema validation, drafts, or future authoring workflows.
- Validate external/generated JSON with a runtime schema (Zod or equivalent) before passing it into rendering code.
- Make required versus optional fields intentional. A missing project image, link, alt text, or date should be represented by the type and handled at one boundary.
- Replace `Record<string, any>` and index signatures in shared components with `unknown` plus narrow, named interfaces.

### 7. Turn the image pipeline into a build-time data pipeline

Evidence: `src/pages/photo/_Gallery.astro:80-185` performs remote R2 upload work, image optimization, embedding encoding, EXIF-derived metadata, and caching while rendering a page. `src/pages/photo/_galleryCache.ts` contains process-global caches and multiple `any`-typed values. The page also loads browser-side CLIP assets from jsDelivr, Hugging Face, and Deno (`src/pages/photo/_Gallery.astro:1585-1600`).

Recommendations:

- Create a dedicated command that scans the portfolio, validates metadata, generates optimized derivatives and a manifest, and uploads downloads. Make the command idempotent and observable.
- Have Astro consume a checked/generated manifest rather than doing uploads and expensive transforms during page rendering.
- Give the manifest a versioned schema and include source hash, dimensions, derivatives, EXIF fields, tags, coordinates, and embedding format/version.
- Replace process-global mutable caches with a deterministic manifest/cache keyed by content hash and options. Document whether caches are safe across concurrent builds.
- Lazy-load browser ML only after the user opts into search, surface progress/errors, and offer a non-ML search path.
- Add privacy policy/configuration for GPS metadata and decide whether all EXIF coordinates should be published.

### 8. Create a shared page shell and SEO contract

Evidence: `CommonHead.astro` and `HeaderAndFooter/index.astro` contain substantial layout, SEO, OG image generation, global variables, and browser behavior. Pages also manually provide `title`, `description`, `image`, theme, and header options. JSON-LD is emitted using `set:html` (`CommonHead.astro:319`), and an inline script is generated with interpolated text (`src/pages/index.astro:186`).

Recommendations:

- Separate `BaseLayout`, `SiteHeader`, `SiteFooter`, `SeoHead`, and `OpenGraphImage` responsibilities.
- Define one `PageMeta` type and one route-level metadata helper with defaults, canonical URL generation, robots policy, and social image behavior.
- Serialize JSON-LD with `JSON.stringify` from structured data rather than template-interpolating JSON. Escape or avoid interpolating user/content strings into executable `<script>` text.
- Add tests or snapshots for canonical URLs, noindex routes, redirects, OG metadata, and JSON-LD validity.

### 9. Define a browser behavior layer

Evidence: significant inline scripts are embedded directly in `.astro` files, including gallery behavior, project interactions, nav state, map initialization, and public-file toggling. `innerHTML` is used in the gallery and projects pages; `set:html` is used for descriptions and scripts.

Recommendations:

- Move non-trivial browser code into `src/scripts/` or framework components with named entry points and lifecycle functions.
- Use event delegation and `textContent` for plain text. Reserve `set:html` for sanitized, trusted content and document that trust boundary.
- Define DOM selectors/constants and small typed view-models rather than repeatedly casting query results.
- Add cleanup for listeners, timers, observers, and map instances so future client navigation does not duplicate behavior.
- Add keyboard, focus, escape-key, reduced-motion, and screen-reader behavior to gallery/fullscreen/map interactions.

## P1: data, repository boundaries, and build tooling

### 10. Separate source data from generated and exploratory artifacts

Evidence: `src/pages/_stravart/` contains notebooks, HAR files, CSV/JSON exports, a browser binary, and large datasets; several assets and generated outputs are also checked in. The three largest JSON files are hundreds of thousands of lines/bytes in the source tree.

Recommendations:

- Move notebooks, HAR captures, browser binaries, and exploratory exports to a separate research/archive repository or an explicit `research/` boundary.
- Keep only the production data needed by the page, preferably compressed/versioned with a documented generator and source URL/date.
- Add size checks for committed assets and avoid checking in build output (`dist/` is ignored, but generated source-side artifacts still need policy).
- Add provenance and refresh commands for Strava/Overpass data; avoid silently rendering stale snapshots.

### 11. Simplify and type `astro.config.mjs`

Evidence: `astro.config.mjs:2` imports `astro-compress` but never registers it. The config contains untyped custom Vite plugins, macOS-only `mdls` calls, synchronous filesystem operations, console logging inside sitemap filtering, commented-out integrations, and a custom regex rewrite of generated module code.

Recommendations:

- Remove unused/commented configuration or move optional integrations behind explicit flags.
- Make the macOS metadata plugin a separate package/module with typed Vite plugin hooks, platform detection, and a no-op behavior on CI/Linux.
- Prefer asynchronous filesystem APIs and avoid rewriting generated module code with regex; expose image metadata through the image pipeline’s supported extension point or a generated manifest.
- Remove per-page sitemap logging and add unit tests for route filtering, including trailing slashes and album/image paths.
- Pin/verify the image plugin’s source entry point. Importing `plugins/vite-image-pipeline/dist/image-pipeline` from application source couples the app to a locally generated artifact.

### 12. Make minification safe and observable

Evidence: `package.json:9` always runs `minify.mjs` after `astro build`. `minify.mjs` minifies every HTML file concurrently, drops all console calls, sorts attributes/classes, and skips files after catching parse errors. The recent build completed while skipping `dist/periodicTable/index.html`.

Recommendations:

- Decide whether Astro/Vite/framework minification already covers the target and remove redundant post-processing where possible.
- Never silently turn a malformed generated page into a successful release. Fail CI for unexpected skips, or maintain an explicit allowlist with a reason and test.
- Do not drop console calls globally unless it is a deliberate policy; production diagnostics should use a controlled logger.
- Add a canary route test after minification and compare HTML validity before and after the transform.
- Type the minifier result union and error handling; currently the script relies on inferred shapes and `err.message`.

## P2: quality, accessibility, and performance

### 13. Add a layered test strategy

There is no root test script or visible test suite. The current build and `astro check` catch compilation issues but not route behavior, accessibility, data validity, or browser regressions.

Recommended layers:

1. Unit tests for redirect filtering, slug generation, image metadata normalization, embedding encode/decode, Spotify normalization, and sitemap filtering.
2. Contract tests for generated manifests and external API payloads.
3. Playwright smoke tests for home, projects, resume, photo gallery, album, map, redirect, and the Next app’s supported routes.
4. Accessibility checks with axe on the highest-value interactive pages.
5. Build artifact checks for broken internal links, missing images, duplicate IDs, invalid JSON-LD, and unexpectedly large assets.

### 14. Add a real CI quality workflow

The current workflow is deployment-oriented and does not provide a fast PR gate. Add a separate workflow for pull requests and pushes to the production branch:

- `npm ci`
- `npm run format:check`
- `npm run typecheck`
- `npm run lint`
- Astro build
- Next typecheck/lint/build
- tests and smoke checks
- dependency and secret scanning

Use concurrency cancellation for superseded PR runs, least-privilege permissions, and artifact upload for failed builds.

### 15. Improve accessibility contracts

Evidence includes empty `alt` values in album/project imagery, image elements created by browser scripts without consistently declared dimensions, external links with inconsistent `rel` attributes, fullscreen dialogs, and iframes without titles.

Recommendations:

- Require meaningful alt text for informative images; use empty alt only for verified decorative images.
- Give every iframe a descriptive `title`, and add explicit dimensions/aspect-ratio placeholders to reduce layout shift.
- Standardize external-link behavior (`target="_blank"` plus appropriate `rel`) in a shared link component.
- Make the fullscreen gallery a complete dialog: focus trap/restore, close button label, escape handling, and announcement of the active image.
- Check color contrast, visible focus styles, motion preferences, and touch target sizes in automated audits.

### 16. Establish image and third-party performance budgets

The site has many large raster assets, remote map/ML dependencies, and custom image processing. Define budgets rather than optimizing ad hoc:

- Largest contentful image and above-the-fold image byte budgets.
- Maximum source/derivative dimensions and formats.
- JavaScript budget for normal pages versus photo/ML pages.
- Third-party request inventory and loading policy.
- Lighthouse/WebPageTest checks for home, projects, photo, and Aero.

Use Astro’s image component or the custom wrapper consistently, preload only the actual hero asset, use `fetchpriority` intentionally, and ensure the custom pipeline preserves width/height and responsive `srcset` semantics.

## P2: dependency and developer experience

### 17. Reduce and rationalize dependencies

`package.json` contains a broad mix of Astro, React, TensorFlow, Vercel, Cloudflare, image, and legacy build packages. Some appear unused or transitional (`astro-compress` is imported but not configured; `astro-imagetools` is present while a custom pipeline is used; multiple Edge runtime packages are listed individually).

Recommendations:

- Generate a dependency usage report and remove packages not imported by a supported build.
- Move build-only packages to `devDependencies` where the deployment platform does not need them at runtime.
- Keep root and `next/` dependency versions aligned where they are shared, or isolate them through workspaces.
- Run a scheduled dependency update PR with lockfile validation and review security advisories separately from feature work.
- Document why large packages such as TensorFlow, Satori, Sharp, and map libraries are needed and which pages load them.

### 18. Standardize formatting, linting, and conventions

Prettier is installed but no root format script/configuration is evident. The source uses mixed quote styles, semicolons, spacing, and naming conventions. Some route files are intentionally prefixed with `_` but are still page modules, which is not self-explanatory to new contributors.

Recommendations:

- Add root Prettier configuration with Astro support and `format`/`format:check` scripts.
- Add ESLint for Astro/TypeScript/browser scripts and a separate Next configuration.
- Use naming conventions that distinguish route pages, partials, data, and client modules.
- Add a concise CONTRIBUTING guide explaining local prerequisites, environment variables, portfolio data generation, build composition, and deploy previews.
- Add `.env.example` files containing names only, never values.

### 19. Make local development reproducible

The deployment requires macOS metadata in the local pipeline, a private portfolio clone, Python tooling, native image libraries, and two app builds, but these requirements are not documented in the root README.

Recommendations:

- Provide a one-command “content unavailable” local mode using a small fixture manifest.
- Document required Node/npm/Python versions and optional credentials.
- Add a fixture-based path for photo pages so contributors can develop without R2, private repositories, or ML downloads.
- Make macOS tags optional and ensure Linux CI produces deterministic output.

## P3: product and cleanup opportunities

### 20. Formalize route and content policy

The site mixes public portfolio pages, noindex utilities, redirects, experiments, downloads, and embedded legacy applications. Create a route registry that records status, owner, indexability, canonical URL, and deployment destination. This registry can drive sitemap filtering, navigation, smoke tests, and deprecation notices.

### 21. Replace hard-coded link and metadata conventions

Centralize canonical site URL, external link policy, social handles, image CDN host, and third-party URLs. This prevents small inconsistencies from propagating through pages and makes a domain migration or provider change safe.

### 22. Add deprecation and archival policy for legacy apps

For each directory under `public/`, record whether it is supported, frozen, or scheduled for removal. Add a lightweight security review for old JavaScript dependencies and external embeds. If an app is not part of the main experience, consider serving it from a separate origin so it cannot affect the main site’s CSP, bundle, or deployment lifecycle.

## Suggested PR roadmap

The following sequence keeps changes cohesive and provides value at each step.

1. **CI and release correctness:** align `main`/production triggers, remove ignored Next failures, add separate PR checks, pin runtimes, and validate the composed artifact.
2. **Secrets and runtime consolidation:** restrict/rotate the Maps key, harden the portfolio clone, select one Spotify adapter, and add API contracts/tests.
3. **Content and domain types:** create shared types and schemas, move project/press/album data into typed content modules, and tighten the `Image` component API.
4. **Photo manifest pipeline:** extract scanning/optimization/upload from Astro rendering, version the manifest, and add fixture-based local development.
5. **Layout and browser architecture:** split SEO/layout responsibilities, move large inline scripts into modules, and standardize accessible interactive primitives.
6. **Repository/app boundaries:** decide the fate of the Next and legacy apps, then use workspaces or separate deploys with independent ownership.
7. **Performance/accessibility:** establish budgets, third-party loading policy, image behavior, and automated Lighthouse/axe/Playwright checks.
8. **Cleanup and documentation:** remove dead dependencies/configuration, archive research artifacts, add contributor docs, and formalize route/content policy.

## Definition of “well maintained”

The repository is in a strong long-term state when:

- Every supported application has one documented build, typecheck, lint, and test command.
- Pull requests cannot merge with type/lint/build failures, and deployment only runs from the protected production branch.
- Page content and external data have named types, schema validation, provenance, and predictable refresh workflows.
- Astro rendering is deterministic and does not upload assets or depend on developer-machine metadata.
- Third-party browser code is isolated, CSP-restricted, lazy-loaded where appropriate, and covered by accessibility/smoke tests.
- A new contributor can run the site with fixtures and understand how a change reaches production from the README.
- Legacy applications and experimental routes have an explicit lifecycle instead of silently sharing the production build.
