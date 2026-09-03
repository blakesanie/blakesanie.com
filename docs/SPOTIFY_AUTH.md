# Spotify API credentials

The deployed `/api/nowPlaying` Function needs three Cloudflare Pages secrets:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

The client ID and secret identify the Spotify Developer app. The refresh token
is generated through Spotify OAuth and can be reused until Spotify revokes it.

## Generate a refresh token

Make sure the redirect URI is registered in the same Spotify app as the client
ID. The redirect URI must match exactly. The existing app callback is:

```text
https://www.blakesanie.com/spotifyMosaic/app
```

Start the helper with that callback:

```bash
SPOTIFY_REDIRECT_URI="https://www.blakesanie.com/spotifyMosaic/app" pnpm spotify-auth
```

Open the printed Spotify URL and approve the requested scopes:

```text
user-read-currently-playing user-read-recently-played
```

Spotify redirects to the callback with a temporary authorization code:

```text
https://www.blakesanie.com/spotifyMosaic/app?code=...&state=...
```

Copy only the value after `code=`. Exchange it using the same redirect URI:

```bash
CODE="PASTE_AUTHORIZATION_CODE" \
SPOTIFY_REDIRECT_URI="https://www.blakesanie.com/spotifyMosaic/app" \
pnpm spotify-auth
```

The command prints a new `SPOTIFY_REFRESH_TOKEN`. The authorization code is
single-use; the refresh token is the value to keep.

## Store it in Cloudflare Pages

Add or replace the production secret:

```bash
pnpm exec wrangler pages secret put SPOTIFY_REFRESH_TOKEN \
  --project-name blakesanie-com
```

The client ID and secret must also exist as production secrets or environment
variables in the `blakesanie-com` Pages project. Local `.env` values are not
automatically deployed.

Verify the Function:

```bash
curl https://blakesanie.com/api/nowPlaying
```

It should return track JSON. `Invalid refresh token` means the token was
revoked, belongs to a different Spotify app, or was generated with a different
redirect URI; repeat the OAuth flow and replace the Cloudflare secret.
