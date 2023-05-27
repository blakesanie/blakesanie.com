import { readFileSync } from "fs";
import path from "path";
import thumbs from "./.thumbs.js";

export default async function handler(req, res) {
  console.log("req", req);
  console.log("url", req.url);
  let url = req.url.split("?")[0];
  const file = path.join(
    process.cwd(),
    "dist",
    ...(url.startsWith("/api/") ? url.substring(5) : url.substring(1)).split(
      "/"
    ),
    "index.html"
  );
  let str = readFileSync(file, "utf8");
  const { im } = req.query;
  if (im) {
    const name = im.replaceAll("_", encodeURI(" ")).replaceAll("%", "--");
    const thumb = thumbs[name];
    if (thumb) {
      const cleanName = decodeURIComponent(name.replaceAll("--", "%"));
      console.log("THUMB", thumb);
      str = str.replaceAll("/og/thumb.jpg", thumb);
      str = str.replaceAll("Photography |", cleanName + " | Photography |");
    }
  }

  res.setHeader("Content-Type", "text/html");
  return res.end(str);
}
