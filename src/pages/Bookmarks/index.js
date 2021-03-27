import React, { useState, useRef, useEffect } from "react";
import styles from "./Bookmarks.module.css";
import { bookmarks } from "./bookmarkData";

// const links = [
//   {
//     title: "GitHub",
//     url: "https://blakesanie.github.com",
//   },
//   {
//     title: "Blake Sanie",
//     url: "/",
//   },
//   {
//     title: "Reddit",
//     url: "https://www.reddit.com/user/Sheev_For_Senate",
//   },
//   {
//     title: "Medium",
//     url: "https://blakesanie.medium.com",
//   },
//   {
//     title: "Yahoo Finance",
//     url: "https://finance.yahoo.com",
//   },
//   {
//     title: "LinkedIn",
//     url: "https://linkedin.com/blakesanie",
//   },
//   {
//     title: "Robinhood",
//     url: "https://robinhood.com",
//   },
//   {
//     title: "E*Trade",
//     url: "https://etrade.com",
//   },
//   {
//     title: "PetaPixel",
//     url: "https://petapixel.com",
//   },
//   {
//     title: "Google Drive",
//     url: "https://drive.google.com",
//   },
//   {
//     title: "Google Docs",
//     url: "https://docs.google.com",
//   },
//   {
//     title: "Amazon",
//     url: "https://amazon.com",
//   },
//   {
//     title: "Canvas",
//     url: "https://gatech.instructure.com",
//   },
//   {
//     title: "Gmail",
//     url: "https://mail.google.com",
//   },
//   {
//     title: "YouTube",
//     url: "https://youtube.com",
//   },
//   {
//     title: "Google Sheets",
//     url: "https://sheets.google.com",
//   },
//   {
//     title: "Netflix",
//     url: "https://netflix.com",
//   },
//   {
//     title: "TradingView",
//     url: "https://tradingview.com",
//   },
//   {
//     title: "Dribbble",
//     url: "https://dribbble.com",
//   },
//   {
//     title: "Stripe",
//     url: "https://stripe.com",
//   },
//   {
//     title: "Buzzport",
//     url: "https://buzzport.gatech.edu/",
//   },
//   {
//     title: "Heroku",
//     url: "https://www.heroku.com",
//   },
//   {
//     title: "Investivision",
//     url: "https://investivision.com",
//   },
// ].sort((a, b) => {
//   a = a.title.replace(/\W/g, "").toLowerCase();
//   b = b.title.replace(/\W/g, "").toLowerCase();
//   if (a > b) {
//     return 1;
//   }
//   if (b > a) {
//     return -1;
//   }
//   return 0;
// });

export default function Gear(props) {
  const [query, setQuery] = useState("");

  const [sortableAttribute, setSortableAttribute] = useState("title");
  const [orderDirection, setOrderDirection] = useState(1);

  const textInput = useRef();

  useEffect(() => {}, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        className="search"
        ref={textInput}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      ></input>
      <select
        value={sortableAttribute}
        onChange={(event) => {
          setSortableAttribute(event.target.value);
        }}
      >
        {Object.keys(bookmarks[0]).map((key) => {
          return <option key={key}>{key}</option>;
        })}
      </select>
      <select
        value={orderDirection}
        onChange={(event) => {
          setOrderDirection(event.target.value);
        }}
      >
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
      {bookmarks
        .filter((item) => {
          if (query.length == 0) {
            return true;
          }
          for (var value of Object.values(item)) {
            if (
              typeof value == "string" &&
              value.toLowerCase().includes(query)
            ) {
              return true;
            }
          }
          return false;
        })
        .sort((a, b) => {
          a = a[sortableAttribute];
          b = b[sortableAttribute];
          if (typeof a == "string") {
            a = a.toLowerCase();
            b = b.toLowerCase();
          }
          if (a > b) {
            return orderDirection;
          }
          if (a < b) {
            return -orderDirection;
          }
          return 0;
        })
        .map((bm) => {
          return (
            <a href={bm.HREF} key={bm.HREF} className={styles.a}>
              <img
                src={bm.ICON}
                style={{
                  marginRight: 10,
                }}
              />
              {bm.title}
            </a>
          );
        })}
    </div>
  );
}
