import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function cleanImagePath(filePath: string): string {
  let cleanPath = decodeURIComponent(filePath.split("?")[0]);
  if (cleanPath.startsWith("/@fs/")) cleanPath = cleanPath.slice(4);
  return cleanPath;
}

export function parseMacOSTags(output: string): string[] {
  if (!output || output.includes("(null)")) return [];

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !line.startsWith("kMDItemUserTags") &&
        line !== "(" &&
        line !== ")",
    )
    .map((line) =>
      line
        .replace(/,$/, "")
        .replace(/^"|"$/g, "")
        .replace(/\\n\d+$/, "")
        .trim(),
    )
    .filter(Boolean);
}

/** Read Finder tags during local macOS builds; other platforms intentionally no-op. */
export async function getMacOSTags(filePath: string): Promise<string[]> {
  if (process.platform !== "darwin") return [];

  try {
    const { stdout } = await execFileAsync("mdls", [
      "-name",
      "kMDItemUserTags",
      cleanImagePath(filePath),
    ]);
    return parseMacOSTags(stdout);
  } catch {
    return [];
  }
}
