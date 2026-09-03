# Image Pipeline Audit

Audited 2026-09-03 against the checked-out Astro site and local
`plugins/vite-image-pipeline` repository. This document describes the current
implementation, measured build output, caching behavior, and a safe order for
improvement. It does not change image behavior.

## Executive summary

The pipeline has two separate jobs:

1. Astro creates optimized, hashed display assets with `getImage()`.
2. `vite-image-pipeline` reads source files for EXIF, CLIP embeddings, blur
   placeholders, colors, and optional R2 downloads.

Astro already has the most important transformation cache. It persists image
outputs under `node_modules/.astro/assets`; the current cache holds 1,867 files
and is 319 MiB. Astro deduplicates a transformation by its source and transform
options before generation, then restores local transformed files from that
cache on a later build. The custom module cache in `_galleryCache.ts` is safe,
but it is not where the material build-time win is.

Current output is dominated by photo fan-out, not repeated JavaScript imports:

- 226 generated `/photo/**/index.html` pages: 69.6 MiB total, 315 KiB average.
- `/photo/` and `/photo/map/` each embed about 328 KiB of gallery data.
- 1,643 AVIFs consume 280.2 MiB; all `dist/_astro` images consume 348 MiB.
- Full `dist` is 537 MiB after deleting original JPEGs.
- Source photo aliases expose 1,340 files totaling about 6.1 GiB.

The shared-gallery `/photo/*` architecture and its `data-*` payload are
intentional. A direct photo URL must keep enough state for client-side movement
between gallery, map, and photo views without a full page reload. Do not split
those pages into separate reduced payloads or move the existing metadata,
embeddings, and control data to a deferred manifest.

First priority: redesign package cache writes. Today every individual
`<Image placeholder="color">` call serializes behind one global lock and can
rewrite the complete JSON cache. This is a much better target than adding more
module-level caches.

## Current architecture

```text
source files (local assets and iCloud alias directories)
        |
        +-- Astro import / getImage()
        |     -> transform registry
        |     -> node_modules/.astro/assets cache
        |     -> dist/_astro/<hashed image>
        |
        +-- vite-image-pipeline
              -> EXIF cache
              -> CLIP embedding cache + local model files
              -> blur cache / color cache
              -> gallery page data attributes
              -> optional R2 upload queue at astro:build:done
```

Relevant site boundaries:

- `src/components/Image/index.astro` calls Astro `getImage()` and then one
  pipeline lookup for a requested placeholder.
- `src/pages/photo/_Gallery.astro` requests full-gallery EXIF and embeddings,
  generates thumbnails, optional fullscreen AVIFs, map thumbnails, and optional
  R2 download assets.
- `src/pages/photo/_galleryCache.ts` holds process-local maps for lazy image
  modules, processed gallery records, and map thumbnails.
- `astro.config.ts` installs `astroImagePipelinePlugin()`, then deletes original
  emitted JPEGs after the build.
- Package entry points live in `src/image-pipeline.ts`, `src/utils.ts`, and
  `src/remote.ts` under the local package repository.

## Product decisions

- Keep `/photo/`, `/photo/map/`, and `/photo/[slug]/` on one shared gallery
  data model. Client-side transitions are a required user experience.
- Keep gallery `data-*` attributes, including metadata and encoded embeddings.
  They are the client-side state contract, not accidental page bloat.
- Optimize build work and cache behavior without changing that contract.
- Evolve `vite-image-pipeline` into a robust standalone package. Astro support
  is an optional adapter, not a requirement for consumers that only need core
  image data features.

## Cache assessment

### Keep: Astro asset cache

Astro's build cache is the correct cache for `getImage()` output. It stores the
encoded image result, not only metadata, and copies it back into `dist` on a
cache hit. Preserve `node_modules/.astro/assets` between CI builds if build
time matters. Do not put that directory in Git.

Astro's documented image API also explicitly supports `getImage()` for custom
image components. This site's component is a valid use of that API.

References: [Astro images guide](https://docs.astro.build/en/guides/images/),
[Astro `getImage()` reference](https://docs.astro.build/en/reference/modules/astro-assets/).

### Keep, but simplify: `_galleryCache.ts` module cache

`getCachedImageModule()` remembers the result of an `import.meta.glob()` loader.
It is correct and inexpensive. Vite's module graph also caches loaded modules,
so this extra map avoids repeated promise plumbing more than disk or image work.
Keep it only if it makes gallery code easier to read; do not expect a meaningful
build-time change from expanding it.

`processedImagesCache` and `optimizedMapImagesCache` can avoid repeated page
work during one static build. Their keys need correction before relying on them:

- `processedImagesCache` key includes `allowClip` and `allowMetadata`, but not
  `allowFullscreen`. A first call with fullscreen disabled can cache an entry
  without `highRes`, then a later fullscreen-enabled caller receives that entry.
- Key also omits data versions. If a caller supplies a different metadata or
  embedding map for the same path in one process, stale derived fields can win.
- Process-local maps disappear between builds. They are not a substitute for
  Astro's on-disk output cache or the package's source-data caches.

Fix the key or split cache layers when changing gallery behavior. This is a
correctness fix, not the primary performance project.

### Replace: package per-call JSON persistence

Each `getMetadata`, `getEmbeddings`, `getImageColors`, and
`getImageBlurPlaceholders` call does the following:

1. Waits for a global lock for that data type.
2. Stats and hashes every requested file.
3. Mutates an in-memory object.
4. Rewrites the whole pretty-printed JSON cache if it had misses.

This is safe against concurrent writes, but bad for a component-oriented Astro
render. The gallery renders many `<Image placeholder="color">` components,
which each call `getImageColors([filepath])`. Calls are serialized rather than
coalesced. A build with cache misses can repeatedly write the entire color JSON
file. Current cache sizes make that visible:

| Cache | Current size |
| --- | ---: |
| blur | 24 KiB |
| color | 776 KiB |
| embeddings | 3.1 MiB |
| metadata | 3.3 MiB |

Recommended package design:

1. Maintain one in-memory cache object per feature, as today.
2. Add an in-flight map keyed by canonical file path so concurrent requests for
   the same source share one operation.
3. Mark a cache dirty after a miss; debounce or flush once at an explicit
   `flushCaches()` call / Astro build hook, rather than after each public call.
4. Add `prune` support to remove entries no longer in a supplied asset set.
5. Expose batch APIs as the preferred path. The site can collect gallery file
   paths once and preload colors or blur values in parallel. Keep rendering
   through the existing `<Image>` component and `data-*` contract.

An atomic temp-file-and-rename write should replace direct `writeFile()` so an
interrupted build cannot leave invalid JSON. The current loader recovers by
returning an empty cache, but then forces expensive regeneration.

### Improve: cache validation

`getFileStatsAndHash()` reads and MD5-hashes the first 4 KiB on every lookup,
including a cache hit. The current tuple is `mtime + size + first-4-KiB hash`.
It is fast enough for a few files, but does unnecessary I/O when hundreds of
component calls arrive separately. It can also miss a content change that keeps
mtime, size, and first 4 KiB identical.

Use a two-stage policy:

1. Compare `mtimeMs` and `size` first. Treat matching values as a local hit by
   default.
2. Offer an opt-in full-content SHA-256 verification mode for CI or imports
   where timestamp preservation is plausible.

Do not compute a full hash on every normal build: the source collection is
several gigabytes, and it would make caching slower than processing it.

## Site opportunities

### P0 — preserve shared gallery, optimize only its build work

`src/pages/photo/[slug].astro` deliberately renders the same gallery state as
`/photo/`. Individual routes are around 328 KiB each because that enables
client-side movement among photographs, gallery, and map without a page reload.
This duplication is an accepted output-size tradeoff, not a refactor target.

Focus optimization on data production instead:

- cache EXIF, embeddings, colors, blur placeholders, image modules, and Astro
  transforms correctly;
- batch source-data lookups before rendering many image components;
- preserve every current `data-*` field and client-side navigation behavior;
- measure output and warm-build time after package cache changes, rather than
  reducing page state.

### P1 — select responsive sizes intentionally

Gallery thumbnails currently use one calculated width with no `sizes` hint.
The calculation bottoms out at 600 px, even on narrow phones. Projects use a
single 800 px output. That is simple, but it does not let browser choose a
smaller candidate.

Use a small responsive width set and an accurate `sizes` attribute for images
whose rendered width changes by viewport. Do not generate broad breakpoint sets
for every photo by default: Astro notes that every candidate increases SSG build
work. Start with gallery-specific candidates based on its CSS maximum width,
then measure LCP and transferred bytes.

`aero/index.astro` already demonstrates multiple breakpoints; it should also be
checked against actual CSS layout and `sizes` before treating it as a template.

### Accepted tradeoff — gallery page data

Gallery HTML includes metadata, tags, encoded CLIP vectors, full-resolution
URLs, and download URLs as `data-*` attributes for each image. This is required
for current client-side navigation and controls. Keep it in page HTML.

The two root gallery modes each emit essentially same 328 KiB data payload.
That is accepted. Improvements must preserve it, not replace it with an
on-demand manifest. GPS coordinates are intentionally public for map mode;
continue treating that as an explicit privacy policy decision.

### P2 — fetch external press content outside rendering

`src/pages/press/_index.astro` fetches every external article during each build
to derive title, image, and date. It is not image transformation, but it is
part of image acquisition and can make builds flaky or slow. Generate and
commit/cache a press manifest in a separate refresh command. The page should
only render that manifest.

### P2 — use content-addressed immutable delivery for R2 assets

Astro output names are content-hashed, which is ideal for long CDN caching.
When configuring the R2 custom domain, send immutable cache headers for hashed
`/_astro/*` objects. Keep a lower TTL for non-hashed objects. The package's
current R2 `PutObject` omits `CacheControl`, so deployment policy must be set at
the bucket/CDN or added as an option.

The R2 pipeline must also support a custom public bucket domain. For this site,
generated download URLs must use `https://download.blakesanie.com/<object-key>`
rather than R2's bucket endpoint. Make `bucketDomain` an optional
`cloudflare-r2` setting, validate it as a hostname or URL, normalize a trailing
slash, and use it only when generating public URLs. Uploads must still use the
account-scoped S3 API endpoint. Document this separately from `bucketName`: the
former is a browser-facing URL origin; the latter is an R2 API bucket identifier.

## Package opportunities

### P0 — fail build when required remote upload fails

`RemotePlatform.upload()` catches each upload error, logs it, and continues.
`processRemoteUploads()` catches errors again. The resulting build can succeed
while HTML points at remote URLs which were never uploaded. This is dangerous
for production downloads.

Change default behavior to collect failures and throw an aggregate error after
the batch. An explicit `continueOnError` option can preserve best-effort mode.
Only remove local emitted assets after a confirmed upload or confirmed
same-content conditional response.

### P0 — package test/install health

The local package does not have installed dependencies in this checkout. Its
`npm run build` currently stops before tests with unresolved imports for
`exiftool-vendored`, `@huggingface/transformers`, and `@aws-sdk/client-s3`.
The repository also has compiled stale test files in `dist` but no visible
source test files. Restore a deterministic install and source tests before
changing cache internals.

Minimum test matrix:

- canonical path handling (`/src`, `/@fs`, absolute paths, Windows paths),
- cache hit/miss, dirty flush, corrupt-cache recovery, and pruning,
- parallel callers for same and different assets,
- one failed R2 upload must fail required mode and retain local output,
- matching ETag skips upload and removes local output,
- integration hook ordering with Astro static builds.

### P0 — separate standalone core from framework adapters

The README describes a framework-agnostic package, but the sole public entry
point exports Astro integration code and its declarations reference Astro. A
consumer that only needs `getImageColors()` should not need Astro installed or
know about its lifecycle.

Publish explicit entry points:

```text
vite-image-pipeline          core API: pipeline instance and feature APIs
vite-image-pipeline/astro    Astro integration and Astro-only types
vite-image-pipeline/remote   optional R2 upload adapter
```

Use a `package.json` `exports` map with JavaScript, declaration, and package
metadata entries for each path. Keep framework imports type-only and scoped to
the Astro entry point. `sharp`, EXIF, Transformers/ONNX, and AWS should be
feature-scoped optional dependencies where package tooling permits it, so a
color-only consumer does not necessarily install remote-upload and ML stacks.

### P1 — make global state instance-scoped

The package writes `metadataCache`, `embeddingCache`, locks, and remote platform
registry onto `globalThis`. This can leak state across multiple Vite servers,
tests, or differently configured pipeline instances in one Node process.
`setOptions()` also changes module-global options without resetting loaded
caches, so changing a cache path after first use does not load the new file.

Export `createImagePipeline(options)` and let the Astro integration own an
instance. Keep existing top-level methods as a backwards-compatible default
instance. This also makes tests isolated and permits two projects in one process.

### P1 — correct API/types and package boundaries

- `RemotePlatform.upload` is typed `() => void` but is implemented as async.
  Type it as `() => Promise<void>`.
- `RemotePlatform` is both an interface and function name. Rename factory to
  `createRemotePlatform` to improve stack traces and readability.
- `crypto` and `existsSync` imports in `image-pipeline.ts` are unused.
- Public option types should be imported with `import type`.
- Implement and test custom `bucketDomain` support, including
  `download.blakesanie.com` as this site's production domain. Release it with
  documentation, then update site dependency to that release. Do not point
  production at `file:plugins/vite-image-pipeline`; use it only for local
  development and CI validation.

### P2 — use bounded concurrency

Metadata, blur, and color miss paths use unbounded `Promise.all`. A large batch
can open too many image files or run too many `sharp` operations at once.
Use a configurable limiter, defaulting near available CPU / libvips capacity.
CLIP already has a batch size, but input preparation also runs concurrently
within that batch. Keep concurrency explicit and benchmark it.

### P2 — separate optional heavyweight dependencies

Every package consumer installs AWS SDK, ExifTool, Transformers.js, ONNX, and
Sharp even when only blur placeholders are needed. Consider optional feature
entry points such as `vite-image-pipeline/metadata`, `/embeddings`, and
`/remote`, or peer/optional dependencies. This reduces install size and native
dependency surface for simple users.

## Recommended implementation sequence

1. Add package tests and make installation reproducible.
2. Split standalone core, Astro adapter, and remote adapter entry points without
   changing current site API.
3. Fix remote failure semantics, custom-domain support, type/API issues, and
   instance isolation in package PRs.
4. Implement dirty, atomic, batched cache persistence plus in-flight request
   coalescing. Benchmark cold and warm builds before and after.
5. Release package. Update site to released version; use local `file:` link only
   during integration testing.
6. Preserve shared photo pages and `data-*` attributes. Add intentional
   thumbnail candidates and `sizes`; compare total output, page transfer, and
   LCP without changing navigation behavior.
7. Persist `node_modules/.astro/assets` and `.image-pipeline` in CI caches.
   Cache the Transformers model directory only if deployment environment permits
   it and cache keys include package lockfile plus model name/version.

## What not to do

- Do not remove Astro's transform cache or replace it with a custom cache.
- Do not hash every source image fully on every build.
- Do not add module caches around every `getImage()` call before measuring; Astro
  already deduplicates transform definitions and persists encoded results.
- Do not silently continue after a required remote upload failure.
- Do not commit the `.image-pipeline` caches or local iCloud source aliases.

## Verification baseline

Performed in this checkout:

- Read all site pipeline call sites and package source files.
- Inspected Astro 7.2.10 local asset-generation implementation and its cache.
- Measured generated output and local cache sizes listed above.
- Ran local package `npm run build`; it correctly exposed missing installed
  package dependencies before test execution.

No production credentials, remote R2 upload, or cold build were run for this
audit. Those should be measured in a dedicated benchmark after cache-write
changes land.
