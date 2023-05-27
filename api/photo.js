import { readFileSync } from "fs";
import path from "path";

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

  const file = path.join(process.cwd(), "dist", "photo", "index.html");
  const stringified = readFileSync(file, "utf8");

  res.setHeader("Content-Type", "text/html");
  return res.end(stringified);
}
