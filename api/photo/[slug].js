import { readFileSync } from "fs";
import path from "path";
import thumbs from "./.thumbs.js";

export default async function handler(req, res) {
  const slug = req.query.slug;
  console.log("slug is", slug);
  const split = slug.split("?");
  const name = split[0];
  let page = "photo";
  if (split.length > 1) {
    console.log(slug, "uses map");
    page += "/map";
  }
  const thumb = thumbs[name];
  if (!thumb) {
    console.log("thumb", thumb, "not found from", Object.keys(thumbs));
    return res.redirect("/" + page);
  }
  const file = path.join(process.cwd(), "dist", page, "index.html");
  let str = readFileSync(file, "utf8");
  const initialOgUrl = str.split(" property=og:image")[0].split("content=")[1];
  const initialOgFilename = initialOgUrl.split("/").pop();
  const cleanName = decodeURIComponent(name.replaceAll("--", "%"));
  str = str.replaceAll(initialOgFilename, thumb);
  str = str.replaceAll("Photography |", cleanName + " | Photography |");

  res.setHeader("Content-Type", "text/html");
  return res.end(str);
}
