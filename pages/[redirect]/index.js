import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import { NextSeo } from "next-seo";

const redirects = {
  linkedin: {
    href: "https://www.linkedin.com/in/blakesanie/",
    title: "LinkedIn",
  },
  blog: {
    href: "https://blakesanie.medium.com/",
    title: "Blog on Medium",
  },
  instagram: {
    href: "https://www.instagram.com/blake_sanie/",
    title: "Instagram",
  },
  github: {
    href: "https://github.com/blakesanie",
    title: "GitHub",
  },
  balance: {
    href: "https://music.apple.com/us/album/balance/1478925861",
    title: "Balance on Apple Music",
  },
  twitter: {
    href: "https://twitter.com/blakesanie",
    title: "Twitter",
  },
  paypal: {
    href: "https://www.paypal.com/paypalme/blakesanie",
    title: "PayPal",
  },
  venmo: {
    href: "https://account.venmo.com/u/Blake-Sanie",
    title: "Venmo",
  },
  youtube: {
    href: "https://www.youtube.com/channel/UC5DbrnJtkkXNw-txM7NVWfw",
    title: "Youtube",
  },
  spotify: {
    href: "https://open.spotify.com/user/blake_sanie?si=uvhN4kfdTQWy4jnrlhKTVg",
    title: "Spotify",
  },
  source: {
    href: "https://github.com/blakesanie/blakesanie.com",
    title: "source code on GitHub",
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
  return (
    <HeaderAndFooter>
      {redirect ? (
        <>
          <Head>
            <meta
              httpEquiv="refresh"
              content={`0; URL=${redirects[redirect].href}`}
            />
          </Head>
          <NextSeo title={redirects[redirect].title} nofollow={true} />
          <h1 className="redirectLabel">{`Redirecting to ${redirects[redirect].title}...`}</h1>
        </>
      ) : null}
    </HeaderAndFooter>
  );
}
