import React, { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import styles from "./index.module.css";
import Link from "next/link";
import { NewsArticleJsonLd } from "next-seo";
import ScrollProgressBar from "../ScrollProgressBar";
import { useRouter } from "next/router";

let mouseHistory = {
  current: undefined,
  prev: undefined,
};

let timeout;

const initialIdealHeaderHeight = 290;

const wrappedHeaderHeight = 410;

export default function HeaderAndFooter(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [menuIsDown, setMenuIsDown] = useState(true);
  const [shouldBeMenuBar, setShouldBeMenuBar] = useState(true);
  const [transitionable, setTransitionable] = useState(false);
  const [idealHeaderHeight, setIdealHeaderHeight] = useState(
    initialIdealHeaderHeight
  );
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
      if (window.innerWidth >= 440) {
        setIdealHeaderHeight(initialIdealHeaderHeight);
      } else {
        setIdealHeaderHeight(wrappedHeaderHeight);
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

  let headerStyles = {};
  if (shouldBeMenuBar) {
    headerStyles.height = menuExpanded ? `${idealHeaderHeight}px` : "80px";
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
    <div
      style={Object.assign(
        {
          width: "100%",
          paddingBottom: props.noBottomPadding
            ? 0
            : "env(safe-area-inset-bottom)",
        },
        props.style
      )}
    >
      <header
        className={`
          ${styles.header}
          ${transitionable ? styles.transitionable : ""}
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
        >
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <Link href="/">
          <h1>Blake Sanie</h1>
        </Link>
        <h2>
          <span>‌‌Inquisitive student.</span>
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
            <Link href="/fund/index.html" target="_blank">
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
            <Link href="/twitter" target="_blank">
              Twitter
            </Link>
          </div>
        </nav>
        <div className={styles.madeBy}>
          <p>Built by Blake Sanie with</p>
          <div className={styles.madeByIcons}>
            <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
              <img
                alt=""
                src="/images/icons/react.png"
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
                src="/images/icons/vercel.png"
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
                src="/images/icons/github.png"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            <span>+</span>
            <a>
              <img
                alt=""
                src="/images/icons/heart.png"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
          </div>
        </div>
      </header>
      <div className={styles.page}>
        {props.children}
        <ScrollProgressBar
          color={
            router.pathname == "/"
              ? "rgba(0, 126, 204, 0.8)"
              : "rgba(0, 126, 204, 0.8)"
          }
          pageWidth={shouldBeMenuBar ? "100%" : "calc(100% - 220px)"}
          visible={!(shouldBeMenuBar && (menuIsDown || menuExpanded))}
        />
      </div>
    </div>
  );
}
