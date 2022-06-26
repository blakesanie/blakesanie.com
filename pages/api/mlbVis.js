import fs from "fs";
const snoowrap = require("snoowrap");

// let isDev = true;
// try {
//   // fs.readdirSync(".").forEach((file) => {
//   //   console.log(file);
//   // });
//   fs.readFileSync(".env", "utf8");
// } catch (e) {
//   isDev = false;
// }

// console.log("isDev", isDev);

const reddit = new snoowrap({
  userAgent: "script:com.blakesanie.mlbVis:v1.0.0 (by u/mlbVis)",
  clientId: process.env.REDDIT_KEY,
  clientSecret: process.env.REDDIT_SECRET,
  username: "mlbVis",
  password: process.env.REDDIT_PASSWORD,
});

export default async function handler(req, res) {
  // console.log(isDev);
  // if (!isDev && req.headers.referer != "https://blakesanie.com/mlbVis") {
  //   return res.status(403);
  // }
  console.log("host, referer", req.headers.host, req.headers.referer);
  let posts = await reddit.getSubreddit("mlbVis").getNew();
  // console.log("posts", posts);
  posts = posts
    .filter((post) => post.preview)
    .map((post) => {
      return {
        permalink: post.permalink,
        title: post.title,
        imageUrl: post.preview.images[0].source.url,
        author: post.author.name,
        ups: post.ups,
        downs: post.downs,
      };
    });
  res.setHeader(
    "Cache-Control",
    `s-max-age=${60 * 1}, stale-while-revalidate=${60 * 1}`
  );
  res.status(200).json({ posts: posts });
}
