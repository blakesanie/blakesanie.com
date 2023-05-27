import { readFileSync } from "fs";
import path from "path";
import thumbs from "./.thumbs.js";

export default async function handler(req, res) {
  //   let { host, referer } = req.headers;
  //   console.log("headers", req.headers);
  //   const out = {
  //     Hello: "World",
  //     host,
  //     referer,
  //     headers: req.headers,
  //   };
  //   res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  //   return res.status(200).json(out);
  // console.log("thumbs", thumbs);
  // console.log("query", req.query);
  const file = path.join(process.cwd(), "dist", "photo", "index.html");
  let str = readFileSync(file, "utf8");
  const { im } = req.query;
  if (im) {
    const name = im.replaceAll("_", encodeURI(" ")).replaceAll("%", "--");
    const thumb = thumbs[name];
    const cleanName = decodeURIComponent(name.replaceAll("--", "%"));
    // console.log("THUMB", thumb);
    str = str.replaceAll("/og/thumb.jpg", thumb);
    str = str.replaceAll("Photography |", cleanName + " | Photography |");
  }

  res.setHeader("Content-Type", "text/html");
  return res.end(str);
}
