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
import Image from "next/image";

import macbook3 from "../public/images/macbook3.jpeg";
import crosland from "../public/images/crosland.jpg";
import mac2 from "../public/images/mac2.jpg";
import stock from "../public/images/stock.png";
import hawaii from "../public/images/full/DSC_0817.jpeg";
import mandel1 from "../public/images/mandel1.png";
import startup from "../public/images/startup.jpg";
import connect from "../public/images/connect.jpg";

import wwdcImage from "../public/images/wwdc_blake.png";

const data = [
  {
    text: ["^500 Hi, ^500I'm Blake ^2000", "^500 Scroll to learn more ^1000"],
    imageUrl: macbook3,
    links: [],
  },
  {
    text: [
      "I am a Computer Science student at the Georgia Institute of Technology.",
    ],
    imageUrl: crosland,
    links: [],
  },
  {
    text: ["Ultimately, I am an engineer at heart"],
    imageUrl: mac2,
    links: [
      {
        url: "/projects",
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
    imageUrl: stock,
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
    imageUrl: hawaii,
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
    imageUrl: mandel1,
    links: [{ url: "/blog", label: "Blog" }],
  },
  {
    text: ["Reach out with professional inquiries,"],
    imageUrl: startup,
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
    imageUrl: connect,
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
  const frameHeight = Math.max(300, Math.min(1000, windowHeight));
  const frameOffset = windowHeight - frameHeight;
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
        let adjustedScroll = scroll;
        if (i == data.length - 1) {
          adjustedScroll += frameOffset;
        } else if (i > 0) {
          adjustedScroll += frameOffset / 2;
        }
        let offset = adjustedScroll - frameHeight * i;
        return (
          <div
            className={styles.frame}
            key={i}
            style={{
              height:
                frameHeight -
                (i == 0 && (windowWidth <= 800 || windowHeight >= 1200)
                  ? 80
                  : 0),
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
                  <div className={styles.wwdcImage}>
                    <Image
                      src={wwdcImage}
                      width="140"
                      height="185"
                      layout="fixed"
                      style={{
                        transform: `translateY(${adjustedScroll * -0.2}px)`,
                      }}
                      priority
                    />
                  </div>

                  <Typed
                    strings={item.text}
                    typeSpeed={50}
                    backSpeed={40}
                    loop
                    style={{
                      fontSize: 50,
                      height: 60,

                      transform: `translateY(${adjustedScroll * -0.1}px)`,
                    }}
                  ></Typed>
                </div>
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    opacity: 1 - Math.abs(adjustedScroll) / frameHeight,
                    transform: `translateY(${scroll * 0.1}px)`,
                  }}
                  className={styles.imageWrapper}
                >
                  <Image
                    className={styles.coverImage}
                    src={item.imageUrl}
                    layout="responsive"
                    quality="100"
                    priority
                  />
                </div>
                <div
                  className={styles.particles}
                  style={{
                    opacity: 1 - Math.abs(adjustedScroll) / frameHeight,
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
                <div
                  style={{
                    opacity: 1 - Math.min(0.8, Math.abs(offset) / frameHeight),
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    layout="fill"
                    quality="100"
                    objectFit="cover"
                    loading="eager"
                  />
                </div>
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
          </div>
        );
      })}
    </HeaderAndFooter>
  );
}
