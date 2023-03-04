import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { referrals } from "../";

function getReferralId(referral) {
  return referral.id || referral.name.toLowerCase().replaceAll(" ", "_");
}

export async function getStaticPaths() {
  const paths = referrals.map((referral) => {
    return {
      params: {
        product: getReferralId(referral),
      },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const byId = {};
  for (const referral of referrals) {
    const id = getReferralId(referral);
    byId[id] = referral;
  }
  return { props: { referrals: byId } };
}

export default function Referral({ referrals }) {
  const router = useRouter();
  const { product } = router.query;
  useEffect(() => {
    window.location.href = referrals[product].url;
  }, []);
  return (
    <>
      <NextSeo
        title={referrals[product].name + " Referral"}
        nofollow={true}
        noindex={true}
      />
      <Head>
        <meta
          httpEquiv="refresh"
          content={`0; URL=${referrals[product].url}`}
        />
      </Head>
    </>
  );
}
