import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.css";
import Link from "next/link";
import { NewsArticleJsonLd } from "next-seo";

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
  const [idealHeaderHeight, setIdealHeaderHeight] = useState(248);

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
      console.log(mouseHistory.current - mouseHistory.prev);
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
        console.log("transitionable false");
        clearInterval(timeout);
        timeout = undefined;
      } else if (result && !timeout) {
        timeout = setTimeout(() => {
          setTransitionable(true);
          console.log("transitionable true");
          timeout = undefined;
        }, 400);
      }
      if (window.innerWidth >= 440) {
        setIdealHeaderHeight(248);
      } else {
        setIdealHeaderHeight(382);
      }
      setShouldBeMenuBar(result);
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

  let headerStyles = {};
  if (shouldBeMenuBar) {
    headerStyles.height = menuExpanded ? `${idealHeaderHeight}px` : "80px";
    if (mouseHistory.current <= 80 && !menuIsDown && !menuExpanded) {
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
            <Link href="/projects">Projects</Link>
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
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            <img
              alt=""
              src="https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </a>
          ,
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
