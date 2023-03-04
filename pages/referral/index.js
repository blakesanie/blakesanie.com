//import fs
// import fs from "fs/promises";
import { useState } from "react";

export const referrals = [
  {
    name: "Chase Freedom",
    url: "https://www.referyourchasecard.com/18o/QQ5AO1UQTL",
  },
  {
    name: "Capital One Savor One",
    url: "https://capital.one/3I3jGzD",
  },
  {
    name: "Capital One Savor One",
    url: "https://capital.one/3I3jGzD",
  },
  {
    name: "Sofi Banking",
    url: "https://www.sofi.com/invite/money?gcp=341490ba-e40c-479e-ae40-c0c86e30a298&isAliasGcp=false",
  },
  {
    name: "Robinhood",
    url: "https://join.robinhood.com/blakes746",
  },
  {
    name: "ibotta",
    url: "https://ibotta.onelink.me/iUfE/1005cd3f?friend_code=rxclqju",
  },
  {
    name: "MaxRewards",
    url: "https://maxrewards.app.link/blakes09",
  },
  {
    name: "Capital One Platinum Secured",
    url: "https://capital.one/3YZ2rVj",
  },
];

export function getReferralId(referral) {
  return referral.id || referral.name.toLowerCase().split(" ").join("_");
}

export async function getStaticProps() {
  // read json from local file
  //   const json = await fs.readFile("./referrals.json", "utf8");
  return {
    props: {
      referrals: referrals.sort((ref) => ref.name),
    },
  };
}

export default function Referrals(props) {
  //   console.log(props);

  const [query, setQuery] = useState("");

  return (
    <>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Search"
      />
      {props.referrals
        .filter(({ name, url, id }) => {
          return (
            name?.includes(query) || url?.includes(query) || id?.includes(query)
          );
        })
        .map((referral) => {
          const { name, url } = referral;
          return (
            <a
              href={url}
              target="_blank"
              style={{
                display: "block",
              }}
              onClick={(e) => {
                // window.open(url, "_blank");
                try {
                  navigator.share({
                    url: window.location.href + "/" + getReferralId(referral),
                  });
                  e.preventDefault();
                } catch (e) {}
              }}
            >
              {name}
            </a>
          );
        })}
    </>
  );
}
