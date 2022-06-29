import fetch from "node-fetch";

let ACCESS_TOKEN = "placeholder";

const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const processTrack = (item, live) => {
  let bestImage;
  for (const image of item.album.images.reverse()) {
    if (image.height >= 120) {
      bestImage = image.url;
      break;
    }
  }
  return {
    name: item.name,
    artists: item.artists.map((artist) => {
      return artist.name;
    }),
    album: item.album.name,
    image: bestImage,
    live: live,
    link: item.external_urls.spotify,
  };
};

let cached;
let exp = 0;

const getPreviousTrack = async () => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  const json = await response.json();
  return processTrack(json.items[0].track, false);
};

const getLastSong = async (recursion = true) => {
  let response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  if (response.status == 204) {
    console.log("USE PREVIOUS TRACK");
    return await getPreviousTrack();
  } else if (response.status == 401) {
    if (!recursion) {
      throw Error("Reached max recursion depth");
    }
    // new token needed
    console.log("NEW TOKEN NEEDED");
    const params = new URLSearchParams();
    params.append("refresh_token", REFRESH_TOKEN);
    params.append("grant_type", "refresh_token");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: params,
      headers: {
        Authorization:
          "Basic " +
          new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
    });
    const json = await response.json();
    ACCESS_TOKEN = json.access_token;
    return await getLastSong(false);
  } else if (response.status == 200) {
    const json = await response.json();
    if (json.currently_playing_type == "ad" || !json.item) {
      console.log("ADVERTIZEMENT CURRENTLY");
      return await getPreviousTrack();
    }
    console.log("CURRENTLY PLAYING TRACK");
    return processTrack(json.item, true);
  } else {
    console.error(response);
    throw Error("Spotify did not return 200, 204, or 401");
  }
};

const CACHE_TTL = 30;

export default async function handler(req, res) {
  let { host, referer } = req.headers;
  host = host.split(":")[0];
  if (
    !referer ||
    host.split(":")[0].replace("127.0.0.1", "localhost") !=
      referer.split("://")[1].split("/")[0].split(":")[0]
  ) {
    return res.status(403).json();
  }

  if (!cached || exp < new Date()) {
    console.log("CACHE MISS");
    cached = await getLastSong();
    exp = new Date();
    exp.setSeconds(exp.getSeconds() + CACHE_TTL);
  } else {
    console.log("CACHE HIT");
  }

  res.setHeader(
    "Cache-Control",
    `s-max-age=${60 * 1}, stale-while-revalidate=${60 * 1}`
  );
  return res.status(200).json(cached);
}
