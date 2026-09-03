// /functions/api/spotify.js

let ACCESS_TOKEN = "placeholder";

const processTrack = (item, live) => {
  let bestImage;
  const images = item.images || item.album?.images || [];
  for (const image of [...images].reverse()) {
    if (image.height >= 120) {
      bestImage = image.url;
      break;
    }
  }
  return {
    name: item.name,
    artists: item.show ? [item.show.name] : item.artists.map((artist) => artist.name),
    album: item.album?.name || item.release_date,
    image: bestImage,
    live: live,
    link: item.external_urls?.spotify,
  };
};

const getPreviousTrack = async (env) => {
  const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=1`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  const json = await response.json();
  return processTrack(json.items[0].track, false);
};

const getLastSong = async (env, recursion = true) => {
  let response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });

  if (response.status === 204) {
    return await getPreviousTrack(env);
  } else if (response.status === 401) {
    if (!recursion) throw new Error("Reached max recursion depth due to consecutive 401s");

    const { SPOTIFY_REFRESH_TOKEN, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = env;

    // Diagnostic Check: Ensure variables exist in this runtime context
    if (!SPOTIFY_REFRESH_TOKEN || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error("Missing required Spotify credentials in context.env");
    }

    const params = new URLSearchParams();
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);
    params.append("grant_type", "refresh_token");

    const basicAuth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    });

    const json = await tokenResponse.json();

    // Catch failed token refresh payloads before trying to use them
    if (!tokenResponse.ok || !json.access_token) {
      console.error("Spotify Refresh Error Details:", json);
      throw new Error(
        `Failed to refresh access token: ${json.error_description || json.error || "Unknown Error"}`,
      );
    }

    ACCESS_TOKEN = json.access_token;
    return await getLastSong(env, false);
  } else if (response.status === 200) {
    const json = await response.json();
    if (json.currently_playing_type === "ad" || !json.item) {
      return await getPreviousTrack(env);
    }
    return processTrack(json.item, true);
  } else {
    throw new Error(`Spotify API error status: ${response.status}`);
  }
};

export async function onRequest(context) {
  try {
    const out = await getLastSong(context.env);

    return new Response(JSON.stringify(out), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=10, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
