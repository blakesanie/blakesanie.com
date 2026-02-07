import readline from "readline";
import fs from "fs";
import path from "path";

// Try to load .env manually since we can't rely on flags/deps
let env = {};
try {
  const envContent = fs.readFileSync(
    path.resolve(process.cwd(), ".env"),
    "utf-8",
  );
  envContent.split("\n").forEach((line) => {
    const [key, val] = line.split("=");
    if (key && val) env[key.trim()] = val.trim();
  });
} catch (e) {}

const CLIENT_ID = process.env.STRAVA_CLIENT_ID || env.STRAVA_CLIENT_ID;
const CLIENT_SECRET =
  process.env.STRAVA_CLIENT_SECRET || env.STRAVA_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET || CLIENT_ID.includes("your_")) {
  console.error(
    "❌ Error: Please update .env with your STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET first.",
  );
  process.exit(1);
}

const SCOPE = "activity:read_all"; // CRITICAL: This was likely missing before
const REDIRECT_URI = "http://localhost";

const authUrl = `https://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${SCOPE}`;

console.log("\n🔒 Strava Token Generator");
console.log("------------------------");
console.log(
  "The token you copied likely lacks the 'activity:read_all' scope required to fetch activities.",
);
console.log("\n1. Open this URL in your browser to authorize:");
console.log(`\n    ${authUrl}\n`);
console.log("2. After authorizing, you will be redirected to localhost.");
console.log(
  "3. Copy the 'code' parameter from the URL bar (e.g. ?state=&code=...)",
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n👉 Paste the code here: ", async (code) => {
  try {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.trim(),
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (data.errors || !data.refresh_token) {
      console.error("\n❌ Error:", JSON.stringify(data, null, 2));
    } else {
      console.log(
        "\n✅ SUCCESS! Update your .env file with this NEW refresh token:\n",
      );
      console.log(`STRAVA_REFRESH_TOKEN=${data.refresh_token}\n`);
    }
  } catch (error) {
    console.error("\n❌ Failed to fetch token:", error);
  }
  rl.close();
});
