const snoowrap = require("snoowrap");

const reddit = new snoowrap({
  userAgent: "script:com.blakesanie.mlbVis:v1.0.0 (by u/mlbVis)",
  clientId: process.env.REDDIT_KEY,
  clientSecret: process.env.REDDIT_SECRET,
  username: "mlbVis",
  password: process.env.REDDIT_PASSWORD,
});

export default async function handler(req, res) {
  console.log(reddit);
  let posts = await reddit.getSubreddit("mlbVis").getNew();
  console.log("posts", posts);
  posts = posts
    .filter((post) => post.preview)
    .map((post) => {
      const lines = post.title.split(" || ");
      if (lines[0].startsWith("Walk off")) {
        lines[0] = lines[0]
          .replace("Walk off", "")
          .split(" ")
          .slice(2)
          .join(" ");
        lines.push("Walk Off 💥");
      }
      if (lines[0].includes(", ")) {
        const split = lines[0].split(", ");
        lines[0] = split[0];
        lines.splice(1, 0, split[1]);
      }
      return {
        permalink: post.permalink,
        title: lines[0],
        caption: lines.splice(1),
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
