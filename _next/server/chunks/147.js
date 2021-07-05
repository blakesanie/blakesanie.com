exports.id = 147;
exports.ids = [147];
exports.modules = {

/***/ 4489:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ HeaderAndFooter; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5282);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2047);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_device_detect__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1217);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_index_module_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1664);







function HeaderAndFooter(props) {
  const {
    0: menuExpanded,
    1: setMenuExpanded
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const {
    0: headerVisible,
    1: setHeaderVisible
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const {
    0: shouldBeMenuBar,
    1: setShouldBeMenuBar
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const {
    0: transitionable,
    1: setTransitionable
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(shouldBeMenuBar);
  const {
    0: windowDim,
    1: setWindowDim
  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
    height: undefined,
    width: undefined,
    scrollY: undefined
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

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    setWindowDim({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY
    });
    setHeaderVisible(window.innerWidth <= 800 || window.innerHeight > 1200);

    const handleMenuBar = () => {
      setShouldBeMenuBar(window.innerWidth <= 800 || window.innerHeight > 1200);
    };

    console.log(`
%c _    _      _                          _ 
| |  | |    | |                        | |
| |  | | ___| | ___ ___  _ __ ___   ___| |
| |/\\| |/ _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\ |
\\  /\\  /  __/ | (_| (_) | | | | | |  __/_|
 \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___(_)
      `, "font-family: monospace; font-weight: 1000; font-size: 12px");
    console.log(`
%cLook's like you're in the web inspector! We'll get along just fine.

Say Hi @ https://www.linkedin.com/in/blakesanie/

View source @ https://github.com/blakesanie/blakesanie.com

Site Directory: %O

`, "font-size: 12px;", {
      "/": "Homepage",
      "/cs": "Computer Science Projects",
      "/photo": {
        "/": "Photography Portfolio",
        "/gear": "Photography Equipment and Tools"
      },
      "/resume": "Professional Résumé",
      "/linkedin": "LinkedIn Profile",
      "/github": "Github Profile",
      "/fund": "The Blake Sanie Fund",
      "/blog": "Medium Blog Page",
      "/instagram": "Instagram Profile"
    });
    console.log("%c ", "font-size:200px; padding: 0 150px; background:url(https://i.imgur.com/pzw4C8l.gif) no-repeat; background-size: cover; background-repeat: no-repeat; background-position: center; ");

    const handleScroll = () => {
      setHeaderVisible(window.scrollY < window.innerHeight || window.innerHeight > 1200);
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
    headerStyles.transform = `translateY(${headerVisible || menuExpanded ? 0 : "-100"}%)`;
  }

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("header", {
      className: `
          ${(_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().header)}
          ${transitionable ? (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().transitionable) : ""}
        `,
      style: headerStyles,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `
            ${(_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().hamburger)}
            ${menuExpanded ? (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().rotated) : ""}
          `,
        onClick: toggleMenu,
        children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().line)
        }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().line)
        }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().line)
        })]
      }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
        href: "/",
        children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
          children: "Blake Sanie"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h2", {
        children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
          children: "\u200C\u200C\u200EInquisitive student.\u200E\u200C\u200C"
        }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
          children: "Aspiring engineer."
        }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
          children: "Photography enthusiast."
        }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
          children: "Curious stock trader."
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
        className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().nav),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().navSection),
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
            children: "Engineering"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/resume",
            children: "R\xE9sum\xE9"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/projects",
            children: "Projects"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/github",
            target: "_blank",
            children: "Github"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().navSection),
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
            children: "Ventures"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/fund",
            target: "_blank",
            children: "Stock Fund"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "https://investivision.com",
            target: "_blank",
            rel: "noreferrer",
            children: "Investivision"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/blog",
            target: "_blank",
            children: "Blog"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().navSection),
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
            children: "Photography"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/photo",
            children: "Portfolio"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/photo/gear",
            children: "Gear"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
          className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().navSection),
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
            children: "Personal"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/linkedin",
            target: "_blank",
            children: "LinkedIn"
          }), react_device_detect__WEBPACK_IMPORTED_MODULE_2__.isMobile ? /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/contact.vcf",
            children: "Contact Card"
          }) : /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "mailto:blake@sanie.com",
            children: "Email"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_3__.default, {
            href: "/instagram",
            target: "_blank",
            children: "Instagram"
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
        className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().madeBy),
        children: ["Built by Blake Sanie with", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
          href: "https://nextjs.org/",
          target: "_blank",
          rel: "noreferrer",
          children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
            alt: "",
            src: "https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png",
            style: {
              filter: `invert(100%)`
            }
          })
        }), ",", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
          href: "https://reactjs.org/",
          target: "_blank",
          rel: "noreferrer",
          children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
            alt: "",
            src: "https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/react-512.png",
            style: {
              filter: `invert(100%)`
            }
          })
        }), ",", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
          href: "https://pages.github.com/",
          target: "_blank",
          rel: "noreferrer",
          children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
            alt: "",
            src: "https://www.flaticon.com/svg/static/icons/svg/25/25231.svg",
            style: {
              filter: `invert(100%)`
            }
          })
        }), ", and", /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
          alt: "",
          src: "https://cdn2.iconfinder.com/data/icons/pittogrammi/142/80-512.png",
          style: {
            filter: `invert(100%)`
          }
        })]
      })]
    }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
      className: (_index_module_css__WEBPACK_IMPORTED_MODULE_4___default().page),
      children: props.children
    })]
  });
}

/***/ }),

/***/ 1217:
/***/ (function(module) {

// Exports
module.exports = {
	"header": "HeaderAndFooter_header__3RHko",
	"dark": "HeaderAndFooter_dark__3FQWJ",
	"nav": "HeaderAndFooter_nav__2-GJy",
	"transitionable": "HeaderAndFooter_transitionable__ciRgW",
	"invisible": "HeaderAndFooter_invisible__1hDxt",
	"navSection": "HeaderAndFooter_navSection__2pHJb",
	"page": "HeaderAndFooter_page__A_QQ7",
	"fadeIn": "HeaderAndFooter_fadeIn__3Qcod",
	"hamburger": "HeaderAndFooter_hamburger__2QyO0",
	"rotated": "HeaderAndFooter_rotated__277tb",
	"line": "HeaderAndFooter_line__3vNtN",
	"madeBy": "HeaderAndFooter_madeBy__1JLby"
};


/***/ }),

/***/ 4453:
/***/ (function() {

/* (ignored) */

/***/ })

};
;