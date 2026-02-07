import fetch from "node-fetch";

let ACCESS_TOKEN = "placeholder";

const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN;
const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

const getActivities = async (recursion = true) => {
  const response = await fetch(
    "https://www.strava.com/api/v3/athlete/activities?per_page=10",
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    },
  );

  if (response.status === 401) {
    if (!recursion) {
      throw Error("Reached max recursion depth for Strava auth");
    }
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("refresh_token", REFRESH_TOKEN);
    params.append("grant_type", "refresh_token");

    const tokenRes = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      body: params,
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Refresh Token HTTP Error:", errorText);
      throw Error(`Failed to refresh Strava token: ${errorText}`);
    }

    const tokenJson = await tokenRes.json();
    console.log("Strava Refresh Data:", JSON.stringify(tokenJson, null, 2)); // Debug log (check logs, remove later)

    if (!tokenJson.access_token) {
      throw Error("Strava response missing access_token");
    }

    ACCESS_TOKEN = tokenJson.access_token;
    return await getActivities(false);
  } else if (response.ok) {
    const activities = await response.json();
    // Return the first activity that is visible to 'everyone'
    const publicActivity = activities.find(
      (activity) => activity.visibility === "everyone",
    );
    return publicActivity || null;
  } else {
    throw Error(`Strava API error: ${response.status} ${response.statusText}`);
  }
};

export default async function handler(req, res) {
  try {
    const activity = await getActivities();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(activity);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
