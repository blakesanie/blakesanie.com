import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import { NextSeo } from "next-seo";

export const redirects = {
  linkedin: {
    href: "https://www.linkedin.com/in/blakesanie/",
    title: "Blake's LinkedIn profile",
    headerColor: "#2B66BC",
  },
  blog: {
    href: "https://blakesanie.medium.com/",
    title: "Blake's blog on Medium",
    headerColor: "#666666",
  },
  instagram: {
    href: "https://www.instagram.com/blake_sanie/",
    title: "Blake's Instagram profile",
    headerGradient:
      "radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)",
    headerColor: "black",
  },
  github: {
    href: "https://github.com/blakesanie",
    title: "Blake's GitHub profile",
    headerColor: "#171B21",
  },
  balance: {
    href: "https://music.apple.com/us/album/balance/1478925861",
    title: "Balance on Apple Music",
    hidden: true,
    headerColor: "#000000",
  },
  twitter: {
    href: "https://twitter.com/blakesanie",
    title: "Blake's Twitter timeline",
    headerColor: "#489BE9",
  },
  paypal: {
    href: "https://www.paypal.com/paypalme/blakesanie",
    title: "Blake's PayPal",
    headerColor: "#051D60",
  },
  venmo: {
    href: "https://account.venmo.com/u/Blake-Sanie",
    title: "Blake's Venmo",
    headerColor: "#3A8CF7",
  },
  youtube: {
    href: "https://www.youtube.com/channel/UC5DbrnJtkkXNw-txM7NVWfw",
    title: "Youtube",
    headerColor: "#EB3323",
  },
  spotify: {
    href: "https://open.spotify.com/user/blake_sanie?si=uvhN4kfdTQWy4jnrlhKTVg",
    title: "Blake's Spotify profile",
    headerColor: "#60C868",
  },
  source: {
    href: "https://github.com/blakesanie/blakesanie.com",
    title: "source code on GitHub",
  },
  blakeOS: {
    href: "https://www.notion.so/blakesanie/blakeOS-5ddea8783f0f40088effd7720bf059f5",
    title: "blakeOS on Notion",
  },
  strava: {
    href: "https://www.strava.com/athletes/44274878",
    title: "Blake's Strava profile",
    headerColor: "#E95E2A",
  },
};

export async function getStaticPaths() {
  let paths = [];
  for (const redirect in redirects) {
    paths.push({
      params: {
        redirect: redirect,
      },
    });
  }
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}

export default function Redirect(props) {
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    window.location.href = redirects[redirect].href;
  }, []);
  return (
    <HeaderAndFooter
      headerGradient={redirects[redirect].headerGradient}
      headerColor={redirects[redirect].headerColor}
      headerStyles={redirects[redirect].headerStyles}
    >
      {redirects[redirect].headerColor && (
        <NextSeo
          additionalMetaTags={[
            {
              name: "theme-color",
              content: redirects[redirect].headerColor,
            },
          ]}
        />
      )}
      <NextSeo
        title={redirects[redirect].title}
        nofollow={true}
        noindex={true}
      />
      <Head>
        <meta
          httpEquiv="refresh"
          content={`0; URL=${redirects[redirect].href}`}
        />
      </Head>
      <h1 className="redirectLabel">{`Redirecting to ${redirects[redirect].title}...`}</h1>
    </HeaderAndFooter>
  );
}
