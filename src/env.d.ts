/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  dataLayer: unknown[];
  headerVars: import("./components/HeaderAndFooter/shared").HeaderVars;
  bounds: unknown;
  originalConsoleLog: typeof console.log;
}
