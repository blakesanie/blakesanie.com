import redirects from "../redirects.json";

const excludedRoutes = new Set([
  ...Object.keys(redirects),
  "chicago",
  "lease",
  "public",
  "music",
  "resume-raw",
  "401k",
]);

function pathnameSegments(page: string): string[] {
  const pathname = new URL(page, "https://sitemap.invalid").pathname;
  return pathname.split("/").filter(Boolean);
}

export function shouldIncludeSitemapRoute(page: string): boolean {
  // 1. Astro supplies relative paths (for example, `photo/map`), while tests
  // and callers may supply absolute URLs. Normalize both to path segments.
  const segments = pathnameSegments(page);
  const [first, second] = segments;

  // 2. Omit redirect routes and other intentionally unindexed top-level pages.
  if (first && excludedRoutes.has(first)) return false;

  // 3. Keep every non-photo route.
  if (first !== "photo") return true;

  // 4. Keep photo landing page plus map and album sections.
  if (!second || second === "albums" || second === "map") return true;

  // 5. All other `/photo/:slug` routes are individual photos.
  return false;
}
