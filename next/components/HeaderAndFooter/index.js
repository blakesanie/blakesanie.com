import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.css";
import Link from "next/link";

export default function HeaderAndFooter(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [shouldBeMenuBar, setShouldBeMenuBar] = useState(true);
  const [transitionable, setTransitionable] = useState(shouldBeMenuBar);
  const [windowDim, setWindowDim] = useState({
    height: undefined,
    width: undefined,
    scrollY: undefined,
  });

  const toggleMenu = () => {
    // alert(menuExpanded);
    setMenuExpanded(!menuExpanded);
  };

  let currentTimeout;

  const updatePageWidth = () => {
    if (shouldBeMenuBar) {
      setTransitionable(false);
      currentTimeout = setTimeout(() => {
        setTransitionable(true);
      }, 200);
    } else {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      setTransitionable(false);
    }
  };

  useEffect(() => {
    setWindowDim({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY,
    });
    setHeaderVisible(window.innerWidth <= 800);
    const handleMenuBar = () => {
      console.log(
        "transitionable",
        window.innerWidth <= 800 || window.innerHeight > 1200
      );
      setShouldBeMenuBar(window.innerWidth <= 800 || window.innerHeight > 1200);
    };
    console.log(
      `
%c _    _      _                          _ 
| |  | |    | |                        | |
| |  | | ___| | ___ ___  _ __ ___   ___| |
| |/\\| |/ _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\ |
\\  /\\  /  __/ | (_| (_) | | | | | |  __/_|
 \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___(_)
      `,
      "font-family: monospace; font-weight: 1000; font-size: 12px"
    );
    console.log(
      `
%cLook's like you're in the web inspector! We'll get along just fine.

Say Hi @ https://www.linkedin.com/in/blakesanie/

View source @ https://github.com/blakesanie/blakesanie.com

Site Directory: %O

`,
      "font-size: 12px;",
      {
        "/": "Homepage",
        "/cs": "Computer Science Projects",
        "/photo": {
          "/": "Photography Portfolio",
          "/gear": "Photography Equipment and Tools",
        },
        "/resume": "Professional Résumé",
        "/linkedin": "LinkedIn Profile",
        "/github": "Github Profile",
        "/fund": "The Blake Sanie Fund",
        "/blog": "Medium Blog Page",
        "/instagram": "Instagram Profile",
      }
    );
    console.log(
      "%c ",
      "font-size:200px; padding: 0 150px; background:url(https://i.imgur.com/pzw4C8l.gif) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center; "
    );
    const handleScroll = () => {
      setHeaderVisible(
        window.scrollY < window.innerHeight || window.innerHeight > 1200
      );
      handleMenuBar();
    };
    const handleResize = () => {
      setShouldBeMenuBar(window.innerWidth <= 800 || window.innerHeight > 1200);
      updatePageWidth();
      handleScroll();
      handleMenuBar();
    };
    handleMenuBar();
    updatePageWidth();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getIdealHeaderHeight = () => {
    if (windowDim.width >= 440) {
      return 248;
    }
    return 382;
  };

  let headerStyles = {};
  if (shouldBeMenuBar) {
    headerStyles.height = menuExpanded ? `${getIdealHeaderHeight()}px` : "80px";
    headerStyles.transform = `translateY(${
      headerVisible || menuExpanded ? 0 : "-100"
    }%)`;
  }
  return (
    <>
      <header
        className={`
          ${styles.header}
          ${transitionable ? styles.transitionable : ""}
        `}
        style={headerStyles}
      >
        <div
          className={`
            ${styles.hamburger}
            ${menuExpanded ? styles.rotated : ""}
          `}
          onClick={toggleMenu}
        >
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <Link href="/">
          <h1>Blake Sanie</h1>
        </Link>
        <h2>
          <span>‌‌‎Inquisitive student.‎‌‌</span>
          <span>Aspiring engineer.</span>
          <span>Photography enthusiast.</span>
          <span>Curious stock trader.</span>
        </h2>
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <h3>Engineering</h3>
            <Link href="/resume">Résumé</Link>
            <Link href="/cs">Projects</Link>
            <Link href="/github" target="_blank">
              Github
            </Link>
          </div>
          <div className={styles.navSection}>
            <h3>Ventures</h3>
            <Link href="/fund" target="_blank">
              Stock Fund
            </Link>
            <Link
              href="https://investivision.com"
              target="_blank"
              rel="noreferrer"
            >
              Investivision
            </Link>
            <Link href="/blog" target="_blank">
              Blog
            </Link>
          </div>
          <div className={styles.navSection}>
            <h3>Photography</h3>
            <Link href="/photo">Portfolio</Link>
            <Link href="/photo/gear">Gear</Link>
          </div>
          <div className={styles.navSection}>
            <h3>Personal</h3>
            <Link href="/linkedin" target="_blank">
              LinkedIn
            </Link>
            {isMobile ? (
              <Link href="/contact.vcf">Contact Card</Link>
            ) : (
              <Link href="mailto:blake@sanie.com">Email</Link>
            )}
            <Link href="/instagram" target="_blank">
              Instagram
            </Link>
          </div>
        </nav>
        <p className={styles.madeBy}>
          Built by Blake Sanie with
          <Link href="https://reactjs.org/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-512.png"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </Link>
          ,
          <Link
            href="https://pages.github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              alt=""
              src="https://www.flaticon.com/svg/static/icons/svg/25/25231.svg"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </Link>
          , and
          <img
            alt=""
            src="https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-512.png"
            style={{
              filter: `invert(100%)`,
            }}
          ></img>
        </p>
      </header>
      <div className={styles.page}>{props.children}</div>
    </>
  );
}
