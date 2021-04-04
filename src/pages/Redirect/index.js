import React, { useState, useEffect } from "react";
import "./styles.css";
import { Helmet } from "react-helmet";

const hashRedirects = {
  balance: {
    href: "https://music.apple.com/us/album/balance/1478925861",
    name: "Balance",
  },
};

export default function Redirect(props) {
  let href, name;
  if (!props.href && !props.name) {
    if (window) {
      const hash = window.location.hash.substring(1);
      if (hash in hashRedirects) {
        href = hashRedirects[hash].href;
        name = hashRedirects[hash].name;
      } else {
        href = "/";
        name = "Home";
      }
    }
  } else {
    href = props.href;
    name = props.name;
  }

  // useEffect(() => {
  //   if (props.useHash) {
  //     const hash = window.location.hash.substring(1);
  //     console.log(hash);
  //     if (hash in hashRedirects) {
  //       setHref(hashRedirects[hash].href);
  //       setName(hashRedirects[hash].name);
  //       console.log(href, name);
  //     } else {
  //       setHref("/");
  //       setName("/")
  //     }
  //   }
  // });

  if (href && name) {
    return (
      <React.Fragment>
        <Helmet>
          <title>Redirecting</title>
          <meta http-equiv="refresh" content={`0; URL=${href}`} />
        </Helmet>
        <h1 className="redirectLabel">{`Redirecting to ${name}...`}</h1>
      </React.Fragment>
    );
  } else {
    return null;
  }
}
