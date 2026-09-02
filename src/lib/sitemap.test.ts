import { describe, expect, it } from "vitest";
import { shouldIncludeSitemapRoute } from "./sitemap";

describe("shouldIncludeSitemapRoute", () => {
  it.each([
    "/",
    "/projects/",
    "https://blakesanie.com/photo/",
    "/photo/albums/",
    "/photo/albums/landscape/",
  ])("includes %s", (route) => {
    expect(shouldIncludeSitemapRoute(route)).toBe(true);
  });

  it.each([
    "/chicago/",
    "/photo/map/",
    "/photo/sunset/",
    "/photo/albums/landscape/sunset/",
    "https://blakesanie.com/music/",
  ])("excludes %s", (route) => {
    expect(shouldIncludeSitemapRoute(route)).toBe(false);
  });
});
