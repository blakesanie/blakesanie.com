import React, { useState, useEffect } from "react";
import NotFound from "../404";
import { useRouter } from "next/router";
import Head from "next/head";
import HeaderAndFooter from "../../components/HeaderAndFooter";

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
    href: "https://www.blakesanie.com/instagram",
    title: "Instagram",
  },
  github: {
    href: "https://github.com/blakesanie",
    title: "Github",
  },
  balance: {
    href: "https://music.apple.com/us/album/balance/1478925861",
    title: "Balance on Apple Music",
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
              http-equiv="refresh"
              content={`0; URL=${redirects[redirect].href}`}
            />
          </Head>
          <h1 className="redirectLabel">{`Redirecting to ${redirects[redirect].title}...`}</h1>
        </>
      ) : null}
    </HeaderAndFooter>
  );
}
