import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import "./styles.css";
import Typed from "react-typed";
import "react-typed/dist/animatedCursor.css";

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
      text: ["^500 Hi, I'm Blake ^2000", "^500 Scroll for more ^1000"],
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
  return data.map((item, i) => {
    let offset = scroll - window.innerHeight * i;
    return (
      <div className="frame" key={i}>
        <img
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
          {i == 0 ? (
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
  });
  return (
    <div
      style={{
        height: `100%`,
        width: `100%`,
      }}
    >
      <div className="frame">
        <img
          src="/images/mac3.jpg"
          // style={{
          //   opacity: 1 - Math.abs(scroll) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${(scroll - 0) * -0.4}px)`,
          // }}
        >
          <Typed
            strings={["Hi, I'm Blake ^2000", "^500 Scroll for More ^1000"]}
            typeSpeed={50}
            backSpeed={70}
            loop
            style={{
              color: "white",
              fontSize: 70,
            }}
          ></Typed>
        </div>
      </div>
      <div className="frame">
        <img
          src="/images/crosland.jpg"
          // style={{
          //   opacity:
          //     1 - Math.abs(scroll - window.innerHeight) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${(scroll - window.innerHeight) * -0.4}px)`,
          // }}
        >
          <h2>
            I am a Computer Science student at the Georgia Institute of
            Technology.
          </h2>
        </div>
      </div>
      <div className="frame">
        <img
          src="/images/mac2.jpg"
          // style={{
          //   filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 2) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 2) * -0.4
          //   }px)`,
          // }}
        >
          <h2>Ultimately, I am an engineer at heart</h2>
          <div className="buttonContainer">
            <a href="/cs">Projects</a>
            <a href="https://github.com/blakesanie">Github</a>
          </div>
        </div>
      </div>
      <div className="frame">
        <img
          src="/images/stock.png"
          // style={{
          //   filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 3) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 3) * -0.4
          //   }px)`,
          // }}
        >
          <h2>Fascinated with automated stock trading</h2>
          <div className="buttonContainer">
            <a href="/fund">Stock Fund</a>
            <a href="https://investivision.com">Investivision</a>
          </div>
        </div>
      </div>

      <div className="frame">
        <img
          src="/images/full/DSC_0817.jpeg"
          // style={{
          //   // filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 4) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 4) * -0.4
          //   }px)`,
          // }}
        >
          <h2>With a sense of photographic expression.</h2>
          <div className="buttonContainer">
            <a href="/photo">Portfolio</a>
          </div>
        </div>
      </div>

      <div className="frame">
        <img
          src="/images/mandel1.png"
          // style={{
          //   // filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 5) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 5) * -0.4
          //   }px)`,
          // }}
        >
          <h2>I encourage you to learn from my ventures,</h2>
          <div className="buttonContainer">
            <a href="/blog">Blog</a>
          </div>
        </div>
      </div>

      <div className="frame">
        <img
          src="/images/startup.jpg"
          // style={{
          //   // filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 6) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 6) * -0.4
          //   }px)`,
          // }}
        >
          <h2>Reach out with professional inquiries,</h2>
          <div className="buttonContainer">
            <a href="/resume">Résumé</a>
            <a href="/linkedin">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="frame">
        <img
          src="/images/connect.jpg"
          // style={{
          //   // filter: `brightness(70%)`,
          //   opacity:
          //     1 -
          //     Math.abs(scroll - window.innerHeight * 7) / window.innerHeight,
          // }}
        ></img>
        <div
          className="center"
          // style={{
          //   transform: `translateY(${
          //     (scroll - window.innerHeight * 7) * -0.4
          //   }px)`,
          // }}
        >
          <h2>Or connect with me further.</h2>
          <div className="buttonContainer">
            <a href="mailto:blake@sanie.com">Email</a>
            <a href="/instagram">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
}
