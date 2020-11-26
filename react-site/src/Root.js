import React, { useEffect, useState, useLayoutEffect } from "react";
import Home from "./pages/Home";
import CS from "./pages/CS";
import Resume from "./pages/Resume";
import Photo from "./pages/Photo";
import Gear from "./pages/Photo/Gear";
import NotFound from "./pages/NotFound";
import "./root.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import useDocumentScrollThrottled from "./hooks/useDocumentScrollThrottled";

export default function Root(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [headerVisible, setHeaderVisible] = useState(window.innerWidth <= 800);
  const [transitionable, setTransitionable] = useState(
    window.innerWidth >= 800
  );

  const toggleMenu = () => {
    alert(menuExpanded);
    setMenuExpanded(!menuExpanded);
  };

  let currentTimeout;

  const updatePageWidth = () => {
    //console.log(transitionable);
    if (window.innerWidth <= 800) {
      currentTimeout = setTimeout(() => {
        setTransitionable(true);
      }, 200);
    } else {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      setTransitionable(false);
    }
    setPageWidth(window.innerWidth);
  };

  const handleScroll = () => {
    setHeaderVisible(window.scrollY < window.innerHeight);
  };

  useLayoutEffect(() => {
    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", updatePageWidth);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  document.getElementsByTagName("html")[0].style.backgroundColor =
    window.location.pathname == "/" ? "black" : "white";

  let headerStyles = {
    transform: `translateY(${
      headerVisible || menuExpanded || window.innerWidth > 800 ? 0 : -100
    }%)`,
  };
  //   if (window.innerWidth <= 800) {
  //     if (scroll < 0) {
  //     } else if (scroll < 80) {
  //       headerStyles.transform = `translateY(${-scroll}px)`;
  //     } else {
  //       headerStyles.transform = `translateY(-100%)`;
  //     }
  //   }
  return (
    <BrowserRouter>
      <header
        style={headerStyles}
        className={window.location.pathname == "/" ? "dark" : ""}
      >
        <div className="bannerBlur"></div>
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
        <nav
          className={`${pageWidth > 800 || menuExpanded ? "" : "invisible"} ${
            transitionable ? "transitionable" : ""
          }`}
        >
          <a href="/">Home</a>
          <h3>Engineering</h3>
          <a href="/resume">Résumé</a>
          <a href="/cs">Projects</a>
          <a href="/fund" target="_blank">
            Stock Fund
          </a>
          <a href="https://investivision.com" target="_blank">
            Investivision
          </a>
          <a href="/blog">Blog</a>
          <a href="/github" target="_blank">
            Github
          </a>
          <h3>Photography</h3>
          <a href="/photo">Portfolio</a>
          <a href="/photo/gear">Gear</a>
          <h3>Personal</h3>
          <a href="/linkedin" target="_blank">
            LinkedIn
          </a>
          <a href="mailto:blake@sanie.com">Email</a>
          <a href="/instagram" target="_blank">
            Instagram
          </a>
          <p className="madeBy">
            Built by Blake Sanie with<br></br>
            <a href="https://reactjs.org/" target="_blank">
              <img
                src="https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-512.png"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            ,
            <a href="https://pages.github.com/" target="_blank">
              <img
                src="https://www.flaticon.com/svg/static/icons/svg/25/25231.svg"
                style={{
                  filter: `invert(100%)`,
                }}
              ></img>
            </a>
            , and
            <img
              src="https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-512.png"
              style={{
                filter: `invert(100%)`,
              }}
            ></img>
          </p>
        </nav>
      </header>
      <div className="page">
        <Switch>
          <Route exact path="/cs" component={CS} />
          <Route exact path="/resume" component={Resume} />
          <Route exact path="/photo" component={Photo} />
          <Route exact path="/photo/gear" component={Gear} />
          <Route
            exact
            path="/linkedin"
            component={() => {
              window.location.href = "https://linkedin.com/in/blakesanie";
              return null;
            }}
          />
          <Route
            exact
            path="/github"
            component={() => {
              window.location.href = "https://github.com/blakesanie";
              return null;
            }}
          />

          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
