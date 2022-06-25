import "../styles/globals.css";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import pageTree from "../extras/initialLog/pageTree.js";

// import Script from "next/script";

let appleIcons = [57, 60, 72, 76, 114, 120, 144, 152, 180];
appleIcons = appleIcons.map((size) => {
  return {
    rel: "apple-touch-icon",
    href: `favicons/apple-icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
  };
});

function isObj(val) {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
}

function addVisitRecursively(path, obj) {
  if (path) {
    console.log(path);
    // ${path.substring(path.lastIndexOf("/") + 1)}
    eval(
      `obj.visit = function () {
  window.location.href = obj.redirect || path;
}`
    );
  }
  for (const key of Object.keys(obj)) {
    if (isObj(obj[key])) {
      obj[key] = addVisitRecursively(path + key, obj[key]);
    }
  }
  return obj;
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  let siteDirectory = addVisitRecursively("", pageTree);

  useEffect(() => {
    console.log(
      `
%c _    _      _                          _ 
| |  | |    | |                        | |
| |  | | ___| | ___ ___  _ __ ___   ___| |
| |/\\| |/ _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\ |
\\  /\\  /  __/ | (_| (_) | | | | | |  __/_|
 \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___(_)
      `,
      "font-family: monospace; font-weight: 1000; font-size: 12px"
    );
    console.log(
      `
%cLook's like you're in the web inspector! We'll get along just fine.

Say Hi @ ${window.location.origin}/linkedin
       @ ${window.location.origin}/twitter

View source @ ${window.location.origin}/source

Site Directory: %O
`,
      "font-size: 12px; font-family: monospace; font-size: 12px;",
      siteDirectory
    );
    console.log(
      "%c ",
      "font-size:200px; padding: 0 150px; background:url(https://i.imgur.com/pzw4C8l.gif) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center; "
    );
    // consoleImage("https://i.imgur.com/pzw4C8l.gif");
  }, []);

  return (
    <>
      <NextNProgress
        height={3}
        options={{ showSpinner: false, easing: "ease" }}
        // stopDelayMs={20000000}
      />
      <DefaultSeo
        defaultTitle="Blake Sanie"
        titleTemplate="%s | Blake Sanie"
        description="Inquisitive student. Aspiring engineer. Photography enthusiast. Curious stock trader."
        openGraph={{
          images: [
            {
              url: "/siteThumb.png",
              width: 1200,
              height: 1052,
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicons/android-icon-192x192.png",
          },
          {
            rel: "icon",
            href: "/favicons/favicon-96x96.png",
          },
          {
            rel: "icon",
            href: "/favicons/favicon-16x16.png",
          },
          {
            rel: "apple-touch-icon",
            href: "https://www.test.ie/touch-icon-ipad.jpg",
            sizes: "76x76",
          },
          {
            rel: "manifest",
            href: "/favicons/manifest.json",
          },
          ...appleIcons,
        ]}
        additionalMetaTags={[
          {
            name: "msapplication-TileColor",
            content: "#ffffff",
          },
          {
            name: "msapplication-TileColor",
            content: "/favicons/ms-icon-144x144.png",
          },
          {
            name: "theme-color",
            content: "rgb(51, 152, 214)",
          },
        ]}
      />
      <SocialProfileJsonLd
        type="Person"
        name="Blake Sanie"
        url="https://blakesanie.com"
        sameAs={[
          "https://linkedin.com/in/blakesanie/",
          "https://blakesanie.medium.com/",
          "https://instagram.com/blake_sanie/",
          "https://github.com/blakesanie",
          "https://twitter.com/blakesanie",
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
