import React, { useState, useLayoutEffect } from "react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function HeaderAndFooter(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [transitionable, setTransitionable] = useState(true);
  const [windowInnerWidth, setWindowInnerWidth] = useState(500);
  const [windowInnerHeight, setWindowInnerHeight] = useState(500);

  const router = useRouter();
  console.log(router);

  let currentTimeout;

  const toggleMenu = () => {
    // alert(menuExpanded);
    setMenuExpanded(!menuExpanded);
  };

  const shouldBeMenuBar = () => {
    return windowInnerWidth <= 800 || windowInnerHeight > 1200;
  };

  useLayoutEffect(() => {
    if (props.notFound) {
      window.history.pushState({}, null, "/");
      setTimeout(() => {
        alert("Sorry, that page doesn't appear to exist!");
      }, 500);
    }

    setWindowInnerWidth(window.innerWidth);
    setWindowInnerHeight(window.innerHeight);

    const handleScroll = () => {
      setHeaderVisible(
        window.scrollY < window.innerHeight || window.innerHeight > 1200
      );
    };

    const updatePageWidth = () => {
      if (shouldBeMenuBar()) {
        handleScroll();
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

    setHeaderVisible(window.innerWidth <= 800);
    setTransitionable(shouldBeMenuBar());

    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", updatePageWidth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getIdealHeaderHeight = () => {
    if (windowInnerWidth >= 440) {
      return 248;
    }
    return 382;
  };

  let headerStyles = {};
  if (shouldBeMenuBar()) {
    headerStyles.height = menuExpanded ? `${getIdealHeaderHeight()}px` : "80px";
    headerStyles.transform = `translateY(${
      headerVisible || menuExpanded ? 0 : "-100"
    }%)`;
  }
  return (
    <>
      <header
        className={`
          ${styles.header} ${router.pathname == "/" ? styles.dark : ""}
        `}
        style={headerStyles}
      >
        <div
          className={`
            ${styles.hamburger},
            ${menuExpanded ? styles.rotated : ""},
          `}
          onClick={toggleMenu}
        >
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <a href="/">
          <h1>Blake Sanie</h1>
        </a>
        <h2>
          <span>‌‌‎Inquisitive student.‎‌‌</span>
          <span>Aspiring engineer.</span>
          <span>Photography enthusiast.</span>
          <span>Curious stock trader.</span>
        </h2>
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <h3>Engineering</h3>
            <a href="/resume">Résumé</a>
            <a href="/cs">Projects</a>
            <a href="/github" target="_blank">
              Github
            </a>
          </div>
          <div className={styles.navSection}>
            <h3>Ventures</h3>
            <a href="/fund" target="_blank">
              Stock Fund
            </a>
            <a
              href="https://investivision.com"
              target="_blank"
              rel="noreferrer"
            >
              Investivision
            </a>
            <a href="/blog" target="_blank">
              Blog
            </a>
          </div>
          <div className={styles.navSection}>
            <h3>Photography</h3>
            <a href="/photo">Portfolio</a>
            <a href="/photo/gear">Gear</a>
          </div>
          <div className={styles.navSection}>
            <h3>Personal</h3>
            <a href="/linkedin" target="_blank">
              LinkedIn
            </a>
            {isMobile ? (
              <a href="/contact.vcf">Contact Card</a>
            ) : (
              <a href="mailto:blake@sanie.com">Email</a>
            )}
            <a href="/instagram" target="_blank">
              Instagram
            </a>
          </div>
        </nav>
        <p className={styles.madeBy}>
          Built by Blake Sanie with
          <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-512.png"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </a>
          ,
          <a href="https://pages.github.com/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://www.flaticon.com/svg/static/icons/svg/25/25231.svg"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </a>
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
