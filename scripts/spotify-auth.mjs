import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:8888/callback";
const redirect = new URL(redirectUri);

if (!clientId || !clientSecret) {
  throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env");
}
if (redirect.protocol !== "http:" || redirect.hostname !== "localhost") {
  throw new Error("SPOTIFY_REDIRECT_URI must use an http://localhost callback");
}

const state = randomBytes(24).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-read-currently-playing user-read-recently-played",
  state,
}).toString();

const server = createServer(async (request, response) => {
  const callback = new URL(request.url, redirect.origin);
  if (callback.pathname !== redirect.pathname) {
    response.writeHead(404).end("Not found");
    return;
  }
  if (callback.searchParams.get("state") !== state) {
    response.writeHead(400).end("Invalid OAuth state");
    server.close();
    return;
  }

  const error = callback.searchParams.get("error");
  const code = callback.searchParams.get("code");
  if (error || !code) {
    response.writeHead(400).end(`Spotify authorization failed: ${error || "missing code"}`);
    server.close();
    return;
  }

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
    });
    const payload = await tokenResponse.json();
    if (!tokenResponse.ok || !payload.refresh_token) {
      throw new Error(payload.error_description || payload.error || "Spotify token exchange failed");
    }
    response.writeHead(200, { "Content-Type": "text/plain" }).end(
      "Authorization complete. You can close this window and copy the terminal output.\n",
    );
    console.log("New Spotify refresh token (save as SPOTIFY_REFRESH_TOKEN):");
    console.log(payload.refresh_token);
    server.close();
  } catch (exchangeError) {
    response.writeHead(502).end("Spotify token exchange failed; see terminal.");
    console.error(exchangeError instanceof Error ? exchangeError.message : exchangeError);
    server.close();
    process.exitCode = 1;
  }
});

server.listen(Number(redirect.port || 80), redirect.hostname, () => {
  console.log(`Open this URL to authorize Spotify:\n\n${authorizeUrl}\n`);
  if (process.platform === "darwin") spawn("open", [authorizeUrl], { stdio: "ignore", detached: true });
});
