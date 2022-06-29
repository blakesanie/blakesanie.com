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
import imageLoader from "../extras/imageLoader";
import { NextSeo } from "next-seo";

const markupData = [
  {
    text: ["^500 Hi, ^500I'm Blake ^2000", "^500 Scroll to learn more ^1000"],
    imageUrl: "/images/macbook3.jpeg",
    links: [],
  },
  {
    text: [
      "I am a Computer Science student at the Georgia Institute of Technology.",
    ],
    imageUrl: "/images/crosland.jpg",
    links: [],
  },
  {
    text: ["Ultimately, I am an engineer at heart"],
    imageUrl: "/images/mac2.jpg",
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
    imageUrl: "/images/stock.png",
    links: [
      { url: "/fund/index.html", label: "Stock Fund", external: true },
      {
        url: "https://investivision.com",
        label: "Investivision",
        external: true,
      },
    ],
  },
  {
    text: ["With a sense of photographic expression."],
    imageUrl: "/images/portfolio/DSC_0817.jpg",
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
    imageUrl: "/images/mandel1.png",
    links: [{ url: "/blog", label: "Blog" }],
  },
  {
    text: ["Reach out with professional inquiries,"],
    imageUrl: "/images/startup.jpg",
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
    imageUrl: "/images/connect.jpg",
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
      {
        url: "/twitter",
        label: "Twitter",
        external: true,
      },
    ],
  },
];

export async function getStaticProps() {
  return {
    props: {
      data: markupData,
    },
  };
}

export default function Home(props) {
  const [data, setData] = useState(props.data || markupData);
  useEffect(() => {
    if (isMobile) {
      data[data.length - 1].links.push({
        url: "/contact.vcf",
        label: "Contact Card",
      });
      setData([...data]);
    }
  }, [isMobile]);
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
    window.addEventListener(
      "resize",
      (e) => {
        setWindowWidth(window.innerWidth);
      },
      true
    );
  }, []);
  //(scroll);
  const frameHeight = Math.max(400, Math.min(1000, windowHeight));
  const frameOffset = windowHeight - frameHeight;
  return (
    <HeaderAndFooter noBottomPadding>
      <style jsx global>{`
        html {
          background-color: black;
        }
        header {
          background-color: #00000080 !important;
        }
        #nowPlaying {
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        #nowPlaying * {
          --highlight-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      <NextSeo
        additionalMetaTags={[
          {
            name: "theme-color",
            content: "rgb(0,0,0)",
          },
        ]}
      />
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
                <div className={`${styles.center}`}>
                  <div
                    className={styles.gradient}
                    style={{
                      position: "absolute",
                      left: `50%`,
                      transform: "translateX(-100px)",
                      width: 200,
                      height: 200,
                      background: `radial-gradient(closest-side, #ffa00060 0%, #00000000 100%)`,
                    }}
                  ></div>
                  <div
                    className={styles.wwdcImage}
                    style={{
                      transform: `translateY(${adjustedScroll * -0.2}px)`,
                    }}
                  >
                    <Image
                      src="/images/wwdc_blake.png"
                      width="140"
                      height="185"
                      layout="intrinsic"
                      priority
                      loader={imageLoader}
                    />
                  </div>

                  <Typed
                    strings={item.text}
                    typeSpeed={50}
                    backSpeed={40}
                    loop
                    className={styles.typed}
                    style={{
                      height: Math.min(60, (24 + 0.03 * windowWidth) * 1.6),
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
                    layout="fill"
                    priority
                    loader={imageLoader}
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
                    objectFit="cover"
                    loading="eager"
                    loader={imageLoader}
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
