import fetch from "node-fetch";

let ACCESS_TOKEN = "placeholder";

const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const processTrack = (item, live) => {
  return {
    name: item.name,
    artists: item.artists.map((artist) => {
      return artist.name;
    }),
    album: item.album.name,
    image: item.album.images[0].url,
    live: live,
  };
};

let cached;
let exp = 0;

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
    response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    const json = await response.json();
    return processTrack(json.items[0].track, false);
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
    console.log("CURRENTLY PLAYING TRACK");
    const json = await response.json();
    return processTrack(json.item, true);
  } else {
    console.error(response);
    throw Error("Spotify did not return 200, 204, or 401");
  }
};

const CACHE_TTL = 30;

export default async function handler(req, res) {
  if (!cached || exp < new Date()) {
    console.log("CACHE MISS");
    cached = await getLastSong();
    exp = new Date();
    exp.setSeconds(exp.getSeconds() + CACHE_TTL);
  } else {
    console.log("CACHE HIT");
  }
  return res.status(200).json(cached);
}
