const glob = require("glob");
const fs = require("fs");

const filenames = glob.sync("pages/**/*.js");

console.log(filenames);

const tree = {};

function getAttr(contents, starter, terminator = '"') {
  const i = contents.indexOf(starter);
  if (i == -1) {
    return undefined;
  }
  let out = contents.substring(i + starter.length);
  out = out.substring(0, out.indexOf(terminator));
  return out;
}

for (const filename of filenames) {
  if (filename.endsWith("index.js") || filename.endsWith("app.js")) {
    const contents = fs.readFileSync(filename, "utf-8");

    const description = getAttr(contents, 'description="');
    const title =
      getAttr(contents, 'title="') || getAttr(contents, 'defaultTitle="');

    if (!description || !title) {
      continue;
    }

    let routeParts = filename.split("pages/")[1].split("/");
    routeParts = routeParts
      .slice(0, routeParts.length - 1)
      .map(function (routePart) {
        return "/" + routePart;
      });

    if (routeParts.length == 0) {
      routeParts = ["/"];
    }
    // console.log(routeParts);
    currentObj = tree;
    for (const routePart of routeParts) {
      if (!tree[routePart]) {
        currentObj[routePart] = {};
      }
      currentObj[routePart].title = title;
      currentObj[routePart].description = description;
      currentObj = currentObj[routePart];
    }
  }
}

const redirects = eval(
  "(" +
    getAttr(
      fs.readFileSync("pages/[redirect]/index.js", "utf-8"),
      "redirects = ",
      ";"
    ) +
    ")"
);

for (const [key, value] of Object.entries(redirects)) {
  if (!value.hidden) {
    tree["/" + key] = {
      redirect: value.href,
    };
  }
}

tree["/fund"] = {
  title: "The Blake Sanie Fund",
  description: "Improve stock market gains with automation",
};

tree["/spotifyMosaic"] = {
  title: "Spotify Mosaic",
  description: "Craft custom photo mosaics using your favorite album covers",
};

console.log(tree);

fs.mkdir("extras/initialLog", () => {});

fs.writeFile(
  "extras/initialLog/pageTree.js",
  `module.exports = ${JSON.stringify(tree)};`,
  () => {}
);

siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xhtml="http://www.w3.org/1999/xhtml" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd">
`;

date = new Date().toISOString().split("T")[0];

function isObj(val) {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
}

function addToSiteMapRecursively(path, obj) {
  if (path && !obj.redirect) {
    siteMap += `<url>
<loc>https://blakesanie.com${path}</loc>
<lastmod>${date}</lastmod>
</url>
`;
  }
  for (const key of Object.keys(obj)) {
    if (isObj(obj[key])) {
      addToSiteMapRecursively(path + key, obj[key]);
    }
  }
}

addToSiteMapRecursively("", tree);

siteMap += `</urlset>`;

console.log(siteMap);

fs.writeFile("./public/sitemap.xml", siteMap, () => {});
