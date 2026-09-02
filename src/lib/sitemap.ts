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
  const pathname = page.startsWith("/") ? page : new URL(page).pathname;
  return pathname.split("/").filter(Boolean);
}

export function shouldIncludeSitemapRoute(page: string): boolean {
  const segments = pathnameSegments(page);
  const [first, second] = segments;

  if (first && excludedRoutes.has(first)) return false;
  if (first !== "photo") return true;
  if (second !== "albums") return segments.length <= 1;

  // Keep the album index and individual albums, but never image detail routes.
  return segments.length <= 3;
}
