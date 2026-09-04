import { describe, expect, it } from "vitest";
import { shouldIncludeSitemapRoute } from "./sitemap";

describe("shouldIncludeSitemapRoute", () => {
  it.each([
    "/",
    "/projects/",
    "https://blakesanie.com/photo/",
    "/photo/engagement/",
    "/photo/map/",
    "/photo/albums/",
    "/photo/albums/landscape/",
    "/photo/albums/landscape/sunset/",
  ])("includes %s", (route) => {
    expect(shouldIncludeSitemapRoute(route)).toBe(true);
  });

  it.each([
    "/chicago/",
    "/photo/sunset/",
    "https://blakesanie.com/music/",
  ])("excludes %s", (route) => {
    expect(shouldIncludeSitemapRoute(route)).toBe(false);
  });
});
