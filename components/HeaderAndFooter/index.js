import React, { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.css";
import Link from "next/link";
import { NewsArticleJsonLd } from "next-seo";
import ScrollProgressBar from "../ScrollProgressBar";
import { useRouter } from "next/router";
import { redirects } from "../../pages/[redirect]";
import NowPlaying from "../NowPlaying";

let mouseHistory = {
  current: undefined,
  prev: undefined,
};

let timeout;

export default function HeaderAndFooter(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [menuIsDown, setMenuIsDown] = useState(true);
  const [shouldBeMenuBar, setShouldBeMenuBar] = useState(true);
  const [transitionable, setTransitionable] = useState(false);
  const [scroll, setScroll] = useState(0);

  const headerElement = useRef(null);

  const router = useRouter();

  const toggleMenu = () => {
    // alert(menuExpanded);
    setMenuExpanded(!menuExpanded);
  };

  useEffect(() => {
    const handleScroll = () => {
      mouseHistory = {
        current: window.scrollY,
        prev: mouseHistory.current,
      };
      setScroll(window.scrollY);
      const delta = mouseHistory.current - mouseHistory.prev;
      if (delta > 0) {
        setMenuIsDown(false);
      }
      if (delta < -70) {
        setMenuIsDown(true);
      }
    };
    const handleResize = () => {
      const result = window.innerWidth < 800 || window.innerHeight > 1200;
      if (!result) {
        setTransitionable(false);
        clearInterval(timeout);
        timeout = undefined;
      } else if (result && !timeout) {
        timeout = setTimeout(() => {
          setTransitionable(true);
          timeout = undefined;
        }, 400);
        if (!mouseHistory.current) {
          setTransitionable(true);
        }
      }
      setShouldBeMenuBar(result);
      if (result) {
        headerElement.current.scrollTop = 0;
      }
    };
    handleScroll();
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerColor = props.headerColor || "rgba(0, 126, 204, 0.8)";
  let headerStyles = { ...props.headerStyles };
  if (props.headerGradient) {
    headerStyles.background = props.headerGradient;
  } else {
    headerStyles.backgroundColor = headerColor;
  }
  if (shouldBeMenuBar) {
    headerStyles.height = menuExpanded
      ? headerElement.current.scrollHeight
      : 80;
    if (scroll <= 0) {
    } else if (scroll <= 80 && !menuIsDown && !menuExpanded) {
      headerStyles.position = "absolute";
    } else if (!menuExpanded) {
      if (mouseHistory.prev <= 80 && mouseHistory.current > 80) {
        headerStyles.transition = "None";
        headerStyles.transform = `translateY(${-100}%)`;
      } else {
        headerStyles.transform = `translateY(${
          menuIsDown || menuExpanded ? 0 : "-100"
        }%)`;
      }
    }
  }

  return (
    // <div
    //   style={Object.assign(
    //     {
    //       width: "100%",
    //       paddingBottom: props.noBottomPadding
    //         ? 0
    //         : "env(safe-area-inset-bottom)",
    //     },
    //     props.style
    //   )}
    // >
    <>
      <header
        className={`
          ${styles.header}
          ${transitionable ? styles.transitionable : ""}
          ${props.className || ""}
        `}
        style={headerStyles}
        ref={headerElement}
      >
        <div
          className={`
            ${styles.hamburger}
            ${menuExpanded ? styles.rotated : ""}
          `}
          onClick={toggleMenu}
          id="hamburger"
        >
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <Link href="/">
          <a id="myName">Blake Sanie</a>
        </Link>
        <p class={styles.headerSubLine}>
          <span>‌‌Inquisitive student.</span>
          <span>Aspiring engineer.</span>
          <span>Photography enthusiast.</span>
          <span>Curious stock trader.</span>
        </p>
        <nav>
          <ul className={styles.nav}>
            <div className={styles.navSection}>
              <p className={styles.navSectionTitle}>Engineering</p>
              <li>
                <Link href="/resume">
                  <a rel="nofollow">Resume</a>
                </Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <a
                  href={redirects["github"].href}
                  target="_blank"
                  rel="nofollow"
                >
                  GitHub
                </a>
              </li>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navSectionTitle}>Ventures</p>
              <li>
                <Link href="/fund/index.html" target="_blank">
                  <a rel="nofollow">Stock Fund</a>
                </Link>
              </li>
              <li>
                <Link href="https://investivision.com" target="_blank">
                  <a rel="nofollow">Investivision</a>
                </Link>
              </li>
              <li>
                <a href={redirects["blog"].href} target="_blank" rel="nofollow">
                  Blog
                </a>
              </li>
              <li>
                <Link href="/mlbVis">r/mlbVis</Link>
              </li>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navSectionTitle}>Photography</p>
              <li>
                <Link href="/photo">Gallery</Link>
              </li>
              <li>
                <Link href="/photo/?map=true">
                  <a rel="nofollow">Capture Map</a>
                </Link>
              </li>
              <li>
                <Link href="/photo/gear">
                  <a rel="nofollow">Gear</a>
                </Link>
              </li>
            </div>
            <div className={styles.navSection}>
              <p className={styles.navSectionTitle}>Personal</p>
              <a
                href={redirects["linkedin"].href}
                target="_blank"
                rel="nofollow"
              >
                LinkedIn
              </a>
              {isMobile ? (
                <Link href="/contact.vcf">
                  <a rel="nofollow">Contact Card</a>
                </Link>
              ) : (
                <Link href="mailto:blake@sanie.com">
                  <a rel="nofollow">Email</a>
                </Link>
              )}
              <a
                href={redirects["instagram"].href}
                target="_blank"
                rel="nofollow"
              >
                Instagram
              </a>
              <a
                href={redirects["twitter"].href}
                target="_blank"
                rel="nofollow"
              >
                Twitter
              </a>
              <a href={redirects["strava"].href} target="_blank" rel="nofollow">
                Strava
              </a>
            </div>
            {/* <div className={styles.navSection}>
              <h3>Links</h3>
              <a href={redirects["spotify"].href} target="_blank">
                Spotify
              </a>
              <a href={redirects["youtube"].href} target="_blank">
                Youtube
              </a>
              <a href={redirects["source"].href} target="_blank">
                Source
              </a>
            </div> */}
          </ul>
        </nav>

        <NowPlaying className={styles.nowPlaying} />
        <div className={styles.madeBy}>
          <p>Built by Blake Sanie with</p>
          <div className={styles.madeByIcons} id="madeBy">
            <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
              <img
                alt=""
                src="/optimized/images/icons/react_w=48&q=75.webp"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
              <img
                alt=""
                src="/images/icons/nextjs.svg"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            <a href="https://vercel.com/" target="_blank" rel="noreferrer">
              <img
                alt=""
                src="/optimized/images/icons/vercel_w=48&q=75.webp"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            <a
              href="https://github.com/blakesanie/blakesanie.com"
              target="_blank"
              rel="noreferrer"
            >
              <img
                alt=""
                src="/optimized/images/icons/github_w=48&q=75.webp"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            <span>+</span>
            <a>
              <img
                alt=""
                src="/optimized/images/icons/heart_w=48&q=75.webp"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
          </div>
        </div>
      </header>
      <div
        className={styles.page}
        style={{
          paddingBottom: props.noBottomPadding
            ? 0
            : "env(safe-area-inset-bottom)",
        }}
        onClick={() => {
          setMenuExpanded(false);
        }}
      >
        {props.children}
        <ScrollProgressBar
          color={headerColor}
          pageWidth={shouldBeMenuBar ? "100%" : "calc(100% - 220px)"}
          visible={!(shouldBeMenuBar && (menuIsDown || menuExpanded))}
        />
      </div>
    </>
    // </div>
  );
}
