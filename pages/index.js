import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import React, { useState, useEffect } from "react";
import Typed from "react-typed";
import "react-typed/dist/animatedCursor.css";
import Div100vh, { use100vh } from "react-div-100vh";
import { isMobile } from "react-device-detect";
import Particles from "react-particles-js";
import { particlesParams } from "../extras/particlesParams.js";
import CopyRight from "../components/Copyright";
import Link from "next/link";

const data = [
  {
    text: ["^500 Hi, ^500I'm Blake ^2000", "^500 Scroll to learn more ^1000"],
    imageUrl: "macbook3.jpeg",
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
if (isMobile) {
  data[data.length - 1].links.push({
    url: "/contact.vcf",
    label: "Contact Card",
  });
}

export default function Home(props) {
  const [scroll, setScroll] = useState(0);
  const windowHeight = use100vh();
  const [windowWidth, setWindowWidth] = useState(500);
  useEffect(() => {
    window.addEventListener(
      "scroll",
      (e) => {
        setScroll(window.scrollY);
      },
      true
    );
    setWindowWidth(window.innerWidth);
    // window.addEventListener(
    //   "resize",
    //   (e) => {
    //     setWindowHeight(window.innerHeight);
    //   },
    //   true
    // );
  }, []);
  //(scroll);
  return (
    <HeaderAndFooter>
      <style jsx global>{`
        html {
          background-color: black;
        }
        header {
          background-color: #00000080 !important;
        }
      `}</style>
      <CopyRight
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 9999,
        }}
      />
      {data.map((item, i) => {
        let offset = scroll - windowHeight * i;
        return (
          <Div100vh
            className={styles.frame}
            key={i}
            style={{
              maxHeight:
                i == 0 && (windowWidth <= 800 || windowHeight >= 1200)
                  ? windowHeight - 80
                  : "none",
              justifyContent: i == 0 ? "flex-start" : "center",
            }}
          >
            {i == 0 ? (
              <>
                <div
                  className={styles.center}
                  style={{
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: `50%`,
                      transform: "translateX(-100px)",
                      top: 26,
                      width: 200,
                      height: 200,
                      background: `radial-gradient(closest-side, #ffa00060 0%, #00000000 100%)`,
                    }}
                  ></div>
                  <img
                    src="/images/wwdc_blake.png"
                    className={styles.wwdcImage}
                    style={{
                      transform: `translateY(${offset * -0.2}px)`,
                    }}
                  />

                  <Typed
                    strings={item.text}
                    typeSpeed={50}
                    backSpeed={40}
                    loop
                    style={{
                      fontSize: 50,
                      height: 60,

                      transform: `translateY(${offset * -0.1}px)`,
                    }}
                  ></Typed>
                </div>
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    opacity: 1 - Math.abs(offset) / windowHeight,
                    transform: `translateY(${offset * 0.1}px)`,
                  }}
                >
                  <img
                    src={`/images/${item.imageUrl}`}
                    style={{
                      position: `relative`,
                    }}
                  ></img>
                </div>
                <div
                  className={styles.particles}
                  style={{
                    opacity: 1 - Math.abs(offset) / windowHeight,
                  }}
                >
                  <Particles
                    className={styles.particles}
                    params={particlesParams}
                  />
                </div>
              </>
            ) : (
              <>
                <img
                  alt=""
                  src={`/images/${item.imageUrl}`}
                  style={{
                    opacity: 1 - Math.abs(offset) / windowHeight,
                  }}
                ></img>
                <div
                  className={styles.center}
                  style={{
                    transform: `translateY(${offset * -0.2}px)`,
                  }}
                >
                  <React.Fragment>
                    <h2>{item.text[0]}</h2>
                    {item.links ? (
                      <div className={styles.buttonContainer}>
                        {item.links.map((link, i) => {
                          return (
                            <Link
                              key={i}
                              href={link.url}
                              target={
                                link.external === true ? "_blank" : "_self"
                              }
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </React.Fragment>
                </div>
              </>
            )}
          </Div100vh>
        );
      })}
    </HeaderAndFooter>
  );
}
