import "../styles/globals.css";
import Head from "next/head";
import { NextSeo } from "next-seo";

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
      <NextSeo
        title="Blake Sanie"
        description="‌‌‎Inquisitive student.‎‌‌ Aspiring engineer. Photography enthusiast. Curious stock trader."
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
