const snoowrap = require("snoowrap");

const reddit = new snoowrap({
  userAgent: "script:com.blakesanie.mlbVis:v1.0.0 (by u/mlbVis)",
  clientId: process.env.REDDIT_KEY,
  clientSecret: process.env.REDDIT_SECRET,
  username: "mlbVis",
  password: process.env.REDDIT_PASSWORD,
});

export default async function handler(req, res) {
  let { host, referer } = req.headers;
  host = host.split(":")[0];
  if (
    !referer ||
    host.split(":")[0].replace("127.0.0.1", "localhost") !=
      referer.split("://")[1].split("/")[0].split(":")[0] ||
    referer.replace("//", "").split("/")[1] != "mlbVis"
  ) {
    return res.status(403).json();
  }
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
