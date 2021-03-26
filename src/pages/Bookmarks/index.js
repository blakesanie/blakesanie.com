import React from "react";
import "./styles.css";

const links = [
  {
    title: "GitHub",
    url: "https://github.com",
  },
  {
    title: "Blake Sanie",
    url: "https://blakesanie.com",
  },
  {
    title: "Reddit",
    url: "https://reddit.com",
  },
  {
    title: "Medium",
    url: "https://medium.com",
  },
  {
    title: "Yahoo Finance",
    url: "https://finance.yahoo.com",
  },
  {
    title: "LinkedIn",
    url: "https://linkedin.com",
  },
  {
    title: "Robinhood",
    url: "https://robinhood.com",
  },
  {
    title: "E*Trade",
    url: "https://etrade.com",
  },
  {
    title: "PetaPixel",
    url: "https://petapixel.com",
  },
  {
    title: "Google Drive",
    url: "https://drive.google.com",
  },
  {
    title: "Google Docs",
    url: "https://docs.google.com",
  },
  {
    title: "Amazon",
    url: "https://amazon.com",
  },
  {
    title: "Canvas",
    url: "https://gatech.instructure.com",
  },
  {
    title: "Gmail",
    url: "https://mail.google.com",
  },
  {
    title: "YouTube",
    url: "https://youtube.com",
  },
  {
    title: "Google Sheets",
    url: "https://sheets.google.com",
  },
  {
    title: "Netflix",
    url: "https://netflix.com",
  },
  {
    title: "TradingView",
    url: "https://tradingview.com",
  },
  {
    title: "Dribbble",
    url: "https://dribbble.com",
  },
  {
    title: "Stripe",
    url: "https://stripe.com",
  },
  {
    title: "Buzzport",
    url: "https://buzzport.gatech.edu/",
  },
  {
    title: "Heroku",
    url: "https://www.heroku.com",
  },
].sort((a, b) => {
  a = a.title.replace(/\W/g, "").toLowerCase();
  b = b.title.replace(/\W/g, "").toLowerCase();
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
});

export default function Gear(props) {
  return (
    <>
      {links.map((link) => {
        return (
          <a href={link.url} target="_blank" key={link.url}>
            {link.title}
          </a>
        );
      })}
    </>
  );
}
