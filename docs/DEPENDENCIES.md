# Dependency map

The root application is a static Astro site. Dependencies are managed with pnpm and the lockfile
is `pnpm-lock.yaml`.

## Intentional runtime/build dependencies

- `astro`, `astro-icon`, `astro-sitemap`, and `astro-google-fonts-optimizer` build the site shell.
- `vite-image-pipeline`, `sharp`, `exiftool-vendored`, and `@huggingface/transformers` power the
  local photo metadata, resizing, and embedding pipeline.
- `satori` and `sharp` generate social preview images in `CommonHead.astro`.
- `glob-promise` drives the recursive public-file page.
- `wrangler` is used for local Cloudflare Pages previews and the local deployment command.
- Iconify JSON packages are loaded by `astro-icon`; keep only collections referenced by the site.

The Aero page intentionally loads Chart.js, TensorFlow.js, and DeepLab from pinned CDN URLs in its
browser document. They are not root package dependencies because they are not bundled by Astro.

## Maintenance

Use `pnpm install --lockfile-only` for dependency updates and commit the resulting lockfile. Use
`pnpm audit` to review advisories separately from feature work. Before removing a package, search
source, config, scripts, and the icon collection list; some integrations discover packages without
a direct import statement.
