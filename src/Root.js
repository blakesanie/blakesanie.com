import React, { useState, useLayoutEffect } from "react";
import Home from "./pages/Home";
import CS from "./pages/CS";
import Resume from "./pages/Resume";
import Photo from "./pages/Photo";
import Gear from "./pages/Photo/Gear";
import ExternalRedirect from "./pages/Redirect";
import "./root.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { isMobile } from "react-device-detect";

const redirects = [
  {
    path: "/github",
    name: "GitHub",
    href: "https://github.com/blakesanie",
    external: true,
  },
  {
    path: "/instagram",
    name: "Instagram",
    href: "https://www.instagram.com/blake_sanie/",
    external: true,
  },
  {
    path: "/linkedin",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/blakesanie",
    external: true,
  },
  {
    path: "/blog",
    name: "Blog",
    href: "https://blakesanie.medium.com",
    external: true,
  },
];

export default function Root(props) {
  const shouldBeMenuBar = () => {
    return window.innerWidth <= 800 || window.innerHeight > 1200;
  };

  const [menuExpanded, setMenuExpanded] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(window.innerWidth <= 800);
  const [transitionable, setTransitionable] = useState(shouldBeMenuBar());

  const toggleMenu = () => {
    // alert(menuExpanded);
    setMenuExpanded(!menuExpanded);
  };

  let currentTimeout;

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

  const handleScroll = () => {
    setHeaderVisible(
      window.scrollY < window.innerHeight || window.innerHeight > 1200
    );
  };

  useLayoutEffect(() => {
    console.log(
      "Looks like you're in the web inspector! We'll get along just fine."
    );
    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", updatePageWidth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  document.getElementsByTagName("html")[0].style.backgroundColor =
    window.location.pathname === "/" ? "black" : "white";

  const getIdealHeaderHeight = () => {
    if (window.innerWidth >= 440) {
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
    <BrowserRouter>
      <header
        className={`${window.location.pathname === "/" ? "dark" : ""} ${
          transitionable ? "transitionable" : ""
        }`}
        style={headerStyles}
      >
        <div
          id="hamburger"
          className={`${menuExpanded ? "rotated" : ""}`}
          onClick={toggleMenu}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
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
        <nav>
          <div className="navSection">
            <h3>Engineering</h3>
            <a href="/resume">Résumé</a>
            <a href="/cs">Projects</a>
            <a href="/github" target="_blank">
              Github
            </a>
          </div>
          <div className="navSection">
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
          <div className="navSection">
            <h3>Photography</h3>
            <a href="/photo">Portfolio</a>
            <a href="/photo/gear">Gear</a>
          </div>
          <div className="navSection">
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
        <p className="madeBy">
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
      <div className="page">
        <Switch>
          <Route exact path="/cs" component={CS} />
          <Route exact path="/resume" component={Resume} />
          <Route exact path="/photo" component={Photo} />
          <Route exact path="/photo/gear" component={Gear} />
          {redirects.map((redirect) => {
            return (
              <Route
                key={redirect.path}
                exact
                path={redirect.path}
                component={() => {
                  return (
                    <ExternalRedirect
                      href={redirect.href}
                      external={redirect.external}
                      name={redirect.name}
                    />
                  );
                }}
              />
            );
          })}
          <Route path="/" component={Home} />
          <Route
            component={() => {
              return <ExternalRedirect href="/404.html" />;
            }}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
