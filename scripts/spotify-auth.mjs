import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8888/callback";
const redirect = new URL(redirectUri);
if (!clientId || !clientSecret) throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env");
if (redirect.protocol !== "https:" && !(redirect.protocol === "http:" && ["localhost", "127.0.0.1"].includes(redirect.hostname))) {
  throw new Error("SPOTIFY_REDIRECT_URI must be HTTPS or an HTTP loopback callback");
}

const state = randomBytes(24).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({ client_id: clientId, response_type: "code", redirect_uri: redirectUri, scope: "user-read-currently-playing user-read-recently-played", state }).toString();

async function exchangeCode(code) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.refresh_token) throw new Error(payload.error_description || payload.error || "Spotify token exchange failed");
  console.log("New Spotify refresh token (save as SPOTIFY_REFRESH_TOKEN):");
  console.log(payload.refresh_token);
}

async function handleCallback(callback) {
  if (callback.searchParams.get("state") !== state) throw new Error("Invalid OAuth state");
  const error = callback.searchParams.get("error");
  if (error) throw new Error(`Spotify authorization failed: ${error}`);
  const code = callback.searchParams.get("code");
  if (!code) throw new Error("Redirect URL does not contain an authorization code");
  await exchangeCode(code);
}

if (redirect.protocol === "https:") {
  console.log(`Open this URL, authorize Spotify, then paste the full redirected URL here:\n\n${authorizeUrl}\n`);
  if (process.platform === "darwin") spawn("open", [authorizeUrl], { stdio: "ignore", detached: true });
  const rl = createInterface({ input, output });
  try { await handleCallback(new URL(await rl.question("Redirected URL: "))); } finally { rl.close(); }
} else {
  const server = createServer(async (request, response) => {
    try {
      await handleCallback(new URL(request.url, redirect.origin));
      response.writeHead(200).end("Authorization complete. You can close this window.");
    } catch (error) {
      response.writeHead(400).end(error instanceof Error ? error.message : "Authorization failed");
      console.error(error instanceof Error ? error.message : error);
    } finally { server.close(); }
  });
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") console.error(`Callback port ${redirect.port} is already in use.`);
    else console.error(error);
    process.exitCode = 1;
  });
  server.listen(Number(redirect.port || 80), redirect.hostname, () => {
    console.log(`Open this URL to authorize Spotify:\n\n${authorizeUrl}\n`);
    if (process.platform === "darwin") spawn("open", [authorizeUrl], { stdio: "ignore", detached: true });
  });
}
