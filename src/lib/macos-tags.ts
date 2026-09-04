import { execFile, spawn } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function cleanImagePath(filePath: string): string {
  let cleanPath = decodeURIComponent(filePath.split("?")[0]);
  if (cleanPath.startsWith("/@fs/")) cleanPath = cleanPath.slice(4);

  // import.meta.glob() keys are rooted at the Vite project (for example,
  // `/src/assets/photo.jpg`), not the filesystem. Convert only that virtual
  // form; absolute filesystem paths must remain untouched.
  if (cleanPath.startsWith("/src/")) return resolve(process.cwd(), `.${cleanPath}`);
  return cleanPath;
}

function normalizeMacOSTag(tag: string): string {
  return tag.replace(/(?:\\n|\n)\d+$/, "").trim();
}

export function parseMacOSTags(output: string): string[] {
  if (!output || output.includes("(null)")) return [];

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("kMDItemUserTags") && line !== "(" && line !== ")")
    .map((line) =>
      line
        .replace(/,$/, "")
        .replace(/^"|"$/g, "")
        .trim(),
    )
    .map(normalizeMacOSTag)
    .filter(Boolean);
}

/** Decode the binary property list stored by Finder in its tag extended attribute. */
async function parseFinderTagAttribute(hexPlist: string): Promise<string[]> {
  const plist = Buffer.from(hexPlist.replace(/\s/g, ""), "hex");
  if (plist.length === 0) return [];

  return new Promise((resolve, reject) => {
    const plutil = spawn("plutil", ["-convert", "json", "-o", "-", "-"]);
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];

    plutil.stdout.on("data", (chunk: Buffer) => stdout.push(chunk));
    plutil.stderr.on("data", (chunk: Buffer) => stderr.push(chunk));
    plutil.once("error", reject);
    plutil.once("close", (code) => {
      if (code !== 0) {
        reject(new Error(Buffer.concat(stderr).toString("utf8")));
        return;
      }

      try {
        const tags: unknown = JSON.parse(Buffer.concat(stdout).toString("utf8"));
        resolve(
          Array.isArray(tags)
            ? tags.filter((tag): tag is string => typeof tag === "string").map(normalizeMacOSTag)
            : [],
        );
      } catch (error) {
        reject(error);
      }
    });

    plutil.stdin.end(plist);
  });
}

/**
 * Read Finder tags from the source file as Vite transforms its image module.
 * Finder stores the tags in an extended attribute, which is authoritative and
 * does not depend on Spotlight indexing iCloud-synced folders.
 */
export async function getMacOSTags(filePath: string): Promise<string[]> {
  if (process.platform !== "darwin") return [];

  try {
    const { stdout } = await execFileAsync("xattr", [
      "-px",
      "com.apple.metadata:_kMDItemUserTags",
      cleanImagePath(filePath),
    ]);
    return parseFinderTagAttribute(stdout);
  } catch {
    return [];
  }
}
