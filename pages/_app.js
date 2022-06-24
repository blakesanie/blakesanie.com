import "../styles/globals.css";
import Head from "next/head";
import { DefaultSeo, SocialProfileJsonLd } from "next-seo";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import { useEffect } from "react";
// import Script from "next/script";

let appleIcons = [57, 60, 72, 76, 114, 120, 144, 152, 180];
appleIcons = appleIcons.map((size) => {
  return {
    rel: "apple-touch-icon",
    href: `favicons/apple-icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
  };
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

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
      {
        "/": "Homepage",
        "/projects": "Computer Science Projects",
        "/photo": {
          "/": "Photography Portfolio",
          "/gear": "Photography Equipment and Tools",
        },
        "/resume": "Professional Résumé",
        "/linkedin": "LinkedIn Profile",
        "/github": "GitHub Profile",
        "/fund": "The Blake Sanie Fund",
        "/blog": "Medium Blog Page",
        "/instagram": "Instagram Profile",
      }
    );
    console.log(
      "%c ",
      "font-size:200px; padding: 0 150px; background:url(https://i.imgur.com/pzw4C8l.gif) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center; "
    );
    // consoleImage("https://i.imgur.com/pzw4C8l.gif");
  }, []);

  return (
    <>
      {router && router.route != "/photo" ? (
        <NextNProgress
          color="red"
          height={3}
          options={{ showSpinner: false, easing: "ease" }}
        />
      ) : null}

      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Assistant:300,400,600"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="ePB1GvvA8L5Hza96sGcmDLw_jIzjhQ2JhXbIAg_8hlA"
        />
        <script
          async="async"
          src="https://www.googletagmanager.com/gtag/js?id=UA-164774604-1"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "UA-164774604-1");`,
          }}
        ></script>
      </Head>
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
            content: "#4895d5",
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
