import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const REMOTE_ORIGIN = "https://download.blakesanie.com";
const TEXT_FILE_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
const MAX_CONCURRENT_REQUESTS = 10;
const MAX_ATTEMPTS = 5;

function isTextBuildFile(filePath) {
  return TEXT_FILE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function findBuildFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findBuildFiles(entryPath);
      return isTextBuildFile(entryPath) ? [entryPath] : [];
    }),
  );
  return files.flat();
}

async function findReferencedRemoteImages() {
  const buildFiles = await findBuildFiles(DIST_DIR);
  const urlPattern = /https:\/\/download\.blakesanie\.com\/[^\s"'<>`()\\]+/g;
  const urls = new Set();

  for (const filePath of buildFiles) {
    const contents = await readFile(filePath, "utf8");
    for (const match of contents.matchAll(urlPattern)) {
      const url = new URL(match[0]);
      if (url.origin !== REMOTE_ORIGIN) continue;
      urls.add(`${url.origin}${url.pathname}`);
    }
  }

  return [...urls].sort();
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function verifyRemoteImage(url) {
  let lastError = "unknown error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "error" });
      const contentType = response.headers.get("content-type") || "";

      if (response.ok && contentType.startsWith("image/")) return;

      lastError = `${response.status} ${response.statusText}; content-type: ${contentType || "missing"}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    if (attempt < MAX_ATTEMPTS) await wait(250 * 2 ** (attempt - 1));
  }

  throw new Error(`${url} (${lastError})`);
}

async function verifyInBatches(urls) {
  const failures = [];

  for (let start = 0; start < urls.length; start += MAX_CONCURRENT_REQUESTS) {
    const batch = urls.slice(start, start + MAX_CONCURRENT_REQUESTS);
    const results = await Promise.allSettled(batch.map(verifyRemoteImage));
    for (const result of results) {
      if (result.status === "rejected") failures.push(result.reason);
    }
  }

  if (failures.length > 0) {
    throw new AggregateError(
      failures,
      `[deploy] ${failures.length} referenced R2 image${failures.length === 1 ? "" : "s"} failed verification`,
    );
  }
}

try {
  const buildStats = await stat(DIST_DIR);
  if (!buildStats.isDirectory()) throw new Error("dist/ is not a directory");

  const remoteImages = await findReferencedRemoteImages();
  console.log(
    `[deploy] Verifying ${remoteImages.length} remote image URL${remoteImages.length === 1 ? "" : "s"}`,
  );
  await verifyInBatches(remoteImages);
  console.log("[deploy] All referenced remote images are available from R2");
} catch (error) {
  if (error instanceof AggregateError) {
    for (const failure of error.errors) console.error(`[deploy] ${failure.message}`);
  } else {
    console.error(`[deploy] ${error instanceof Error ? error.message : String(error)}`);
  }
  process.exitCode = 1;
}
