import React, { useState, useLayoutEffect } from "react";
import "./styles.css";
import Typed from "react-typed";
import "react-typed/dist/animatedCursor.css";
import { Helmet } from "react-helmet";

export default function Home(props) {
  const [scroll, setScroll] = useState(0);
  useLayoutEffect(() => {
    window.addEventListener(
      "scroll",
      (e) => {
        setScroll(window.scrollY);
      },
      true
    );
  }, []);
  //(scroll);
  const data = [
    {
      text: ["^500 Hi, ^500I'm Blake ^2000", "^500 Scroll for more ^1000"],
      imageUrl: "mac3.jpg",
      links: [],
    },
    {
      text: [
        "I am a Computer Science student at the Georgia Institute of Technology.",
      ],
      imageUrl: "crosland.jpg",
      links: [],
    },
    {
      text: ["Ultimately, I am an engineer at heart"],
      imageUrl: "mac2.jpg",
      links: [
        {
          url: "/cs",
          label: "Projects",
        },
        {
          url: "/github",
          label: "GitHub",
          external: true,
        },
      ],
    },
    {
      text: ["Fascinated with automated stock trading"],
      imageUrl: "stock.png",
      links: [
        { url: "/fund", label: "Stock Fund", external: true },
        {
          url: "https://investivision.com",
          label: "Investivision",
          external: true,
        },
      ],
    },
    {
      text: ["With a sense of photographic expression."],
      imageUrl: "full/DSC_0817.jpeg",
      links: [
        {
          url: "/photo",
          label: "Portfolio",
        },
        {
          url: "/photo/gear",
          label: "Gear",
        },
      ],
    },
    {
      text: ["I encourage you to learn from my ventures,"],
      imageUrl: "mandel1.png",
      links: [{ url: "/blog", label: "Blog" }],
    },
    {
      text: ["Reach out with professional inquiries,"],
      imageUrl: "startup.jpg",
      links: [
        {
          url: "/linkedin",
          label: "LinkedIn",
          external: true,
        },
        {
          url: "/resume",
          label: "Résumé",
        },
      ],
    },
    {
      text: ["Or connect with me further."],
      imageUrl: "connect.jpg",
      links: [
        {
          url: "mailto:blake@sanie.com",
          label: "Email",
        },
        {
          url: "/instagram",
          label: "Instagram",
          external: true,
        },
      ],
    },
  ];
  return (
    <React.Fragment>
      <Helmet>
        <title>Blake Sanie</title>
        <meta
          name="description"
          content="Inquisitive student. Aspiring engineer. Photography enthusiast. Curious stock trader. Come see what I'm up to!"
        />
      </Helmet>
      {data.map((item, i) => {
        let offset = scroll - window.innerHeight * i;
        return (
          <div className="frame" key={i}>
            <img
              alt=""
              src={`/images/${item.imageUrl}`}
              style={{
                opacity: 1 - Math.abs(offset) / window.innerHeight,
              }}
            ></img>
            <div
              className="center"
              style={{
                transform: `translateY(${offset * -0.2}px)`,
              }}
            >
              {i === 0 ? (
                <Typed
                  strings={item.text}
                  typeSpeed={50}
                  backSpeed={40}
                  loop
                  style={{
                    fontSize: 70,
                  }}
                ></Typed>
              ) : (
                <React.Fragment>
                  <h2>{item.text[0]}</h2>
                  {item.links ? (
                    <div className="buttonContainer">
                      {item.links.map((link) => {
                        return (
                          <a
                            href={link.url}
                            target={link.external === true ? "_blank" : "_self"}
                          >
                            {link.label}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </React.Fragment>
              )}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}
