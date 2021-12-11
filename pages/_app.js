import "../styles/globals.css";
import Head from "next/head";
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import NextNProgress from "nextjs-progressbar";
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
  return (
    <>
      <NextNProgress
        color="red"
        height={3}
        options={{ showSpinner: false, easing: "ease" }}
      />
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
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `[{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "P",
              "position": 1,
              "name": "About",
              "item": "https://blakesanie.com/"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "Projects",
              "item": "https://blakesanie.com/projects"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "Résumé",
              "item": "https://blakesanie.com/resume"
            },{
              "@type": "ListItem",
              "position": 4,
              "name": "Stock Fund",
              "item": "https://blakesanie.com/fund"
            },{
              "@type": "ListItem",
              "position": 5,
              "name": "Photography",
              "item": "https://blakesanie.com/photo"
            },{
              "@type": "ListItem",
              "position": 6,
              "name": "Github",
              "item": "https://blakesanie.com/github"
            },{
              "@type": "ListItem",
              "position": 7,
              "name": "Linkedin",
              "item": "https://blakesanie.com/linkedin"
            }]
          }]`,
          }}
        ></script> */}
      </Head>
      <NextSeo
        title="Blake Sanie"
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
            content: "#ffffff",
          },
        ]}
      />
      <SocialProfileJsonLd
        type="Person"
        name="Blake Sanie"
        url="https://blakesanie.com"
        sameAs={[
          "https://www.linkedin.com/in/blakesanie/",
          "https://blakesanie.medium.com/",
          "https://www.blakesanie.com/instagram",
          "https://github.com/blakesanie",
          "https://twitter.com/BlakeSanie",
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
