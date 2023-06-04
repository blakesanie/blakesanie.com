import { promises as fs } from "fs";
import path from "path";
import thumbs from "./.thumbs.js";

const photoFile = path.join(process.cwd(), "dist", "photo", "index.html");
const mapFile = path.join(process.cwd(), "dist", "photo/map", "index.html");
const [photoStr, mapStr] = await Promise.all([
  fs.readFile(photoFile, "utf8"),
  fs.readFile(mapFile, "utf8"),
]);
const files = {
  photo: photoStr,
  "photo/map": mapStr,
};
const initialOgUrl = files.photo
  .split(" property=og:image")[0]
  .split("content=")
  .pop();
const initialOgFilename = initialOgUrl.split("/").pop();

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
  console.log("corresponding page is", page);
  const cleanName = decodeURIComponent(name.replaceAll("--", "%"));
  let str = files[page].replaceAll(initialOgFilename, thumb);
  str = str.replaceAll("Photography |", cleanName + " | Photography |");

  res.setHeader("Content-Type", "text/html");
  return res.end(str);
}
