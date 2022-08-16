import HeaderAndFooter from "../components/HeaderAndFooter";
import styles from "./index.module.css";
import React, { useState, useEffect, useRef } from "react";
// import Typed from "react-typed";
import Typed from "typed.js";
import "react-typed/dist/animatedCursor.css";
import Div100vh, { use100vh } from "react-div-100vh";
import { isMobile } from "react-device-detect";
import Particles from "react-particles-js";
import { particlesParams } from "../extras/particlesParams.js";
import CopyRight from "../components/Copyright";
import Link from "next/link";
import Image from "../components/Image";
import { NextSeo } from "next-seo";

const markupData = [
  {
    imageUrl: "/images/macbook3.jpeg",
    links: [],
  },
  {
    text: [
      "I am a Computer Science undergrad student at the Georgia Institute of Technology, concentrating in Information Internetworks and Intelligence.",
    ],
    imageUrl: "/images/crosland.jpg",
    links: [],
  },
  {
    text: [
      "Ultimately, I am an exuberant software engineer at heart, and a problem-solver at my core,",
    ],
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
        nofollow: true,
      },
    ],
  },
  {
    text: [
      "Fascinated with Machine Learning and Automation surrounding stock market research and trading.",
    ],
    imageUrl: "/images/stock.png",
    links: [
      { url: "/fund/index.html", label: "Stock Fund", external: true },
      {
        url: "https://investivision.com",
        label: "Investivision",
        external: true,
        nofollow: true,
      },
    ],
  },
  {
    text: ["With a sense of photographic expression put on full display."],
    imageUrl: "/images/portfolio/DSC_0817.jpg",
    links: [
      {
        url: "/photo",
        label: "Gallery",
      },
      {
        url: "/photo?map=true",
        label: "Capture Map",
        nofollow: true,
      },
      {
        url: "/photo/gear",
        label: "Gear",
      },
    ],
  },
  {
    text: ["I encourage you to learn about my various ventures, old and new,"],
    imageUrl: "/images/mandel1.png",
    links: [{ url: "/blog", label: "Blog", external: true, nofollow: true }],
  },
  {
    text: [
      "Reach out with professional inquiries surrounding new opportunities,",
    ],
    imageUrl: "/images/startup.jpg",
    links: [
      {
        url: "/linkedin",
        label: "LinkedIn",
        external: true,
        nofollow: true,
      },
      {
        url: "/resume",
        label: "Resume",
        external: true,
        nofollow: true,
      },
    ],
  },
  {
    text: ["Or connect with me further through my online presence."],
    imageUrl: "/images/connect.jpg",
    links: [
      {
        url: "mailto:blake@sanie.com",
        label: "Email",
        nofollow: true,
      },
      {
        url: "/instagram",
        label: "Instagram",
        external: true,
        nofollow: true,
      },
      {
        url: "/twitter",
        label: "Twitter",
        external: true,
        nofollow: true,
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
  const typed = useRef();

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

  useEffect(() => {
    typed.current.innerHTML = "";
    const t = new Typed(typed.current, {
      strings: [
        "^500 Hi, ^500I'm Blake ^2000",
        "^500 Scroll to learn more ^1000",
      ],
      typeSpeed: 50,
      backSpeed: 40,
      loop: true,
    });
    return () => {
      t.destroy();
    };
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
                    />
                  </div>
                  <h1
                    className={styles.typed}
                    style={{
                      height: Math.min(60, (24 + 0.03 * windowWidth) * 1.6),
                      transform: `translateY(${adjustedScroll * -0.1}px)`,
                    }}
                  >
                    <span ref={typed}>Hi, I'm Blake.</span>
                  </h1>
                  {/* <Typed
                    strings={item.text}
                    typeSpeed={50}
                    backSpeed={40}
                    loop
                    className={styles.typed}
                    style={{
                      height: Math.min(60, (24 + 0.03 * windowWidth) * 1.6),
                      transform: `translateY(${adjustedScroll * -0.1}px)`,
                    }}
                  ></Typed> */}
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
                    opacity:
                      0.7 * (1 - Math.min(1, Math.abs(offset) / frameHeight)),
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    transition: "opacity 0.1s ease",
                  }}
                >
                  <Image
                    src={item.imageUrl}
                    layout="fill"
                    objectFit="cover"
                    blurry
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
                          console.log("link", link);
                          return (
                            <Link
                              key={i}
                              href={link.url}
                              target={link.external ? "_blank" : "_self"}
                            >
                              <a rel={link.nofollow ? "nofollow" : ""}>
                                {link.label}
                              </a>
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
