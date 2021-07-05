exports.id = 124;
exports.ids = [124];
exports.modules = {

/***/ 9985:
/***/ (function(module) {

const particlesParams = {
  autoPlay: true,
  background: {
    opacity: 0
  },
  detectRetina: true,
  fpsLimit: 60,
  interactivity: {
    detectsOn: "window",
    events: {
      onClick: {
        enable: true,
        mode: "push"
      },
      onHover: {
        enable: true,
        mode: "grab",
        parallax: {
          enable: false,
          force: 2,
          smooth: 10
        }
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 200,
        links: {
          blink: false,
          consent: false,
          opacity: 1
        }
      },
      push: {
        quantity: 1
      }
    }
  },
  particles: {
    color: {
      value: "#ffffff"
    },
    links: {
      distance: 110,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    move: {
      direction: "top",
      distance: 0,
      enable: true,
      outModes: {
        default: "out"
      },
      random: false,
      size: false,
      speed: 1
    },
    number: {
      density: {
        enable: true,
        area: 800,
        factor: 600
      },
      limit: 0
    },
    opacity: {
      value: 0.4
    },
    size: {
      value: 4,
      animation: {
        destroy: "none",
        enable: true,
        minimumValue: 1,
        speed: 2,
        startValue: "max",
        sync: false
      }
    }
  },
  pauseOnBlur: true,
  pauseOnOutsideViewport: false
};
module.exports.X = particlesParams;

/***/ }),

/***/ 6124:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5282);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3289);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_HeaderAndFooter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4489);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1739);
/* harmony import */ var _index_module_css__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_index_module_css__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_typed__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2367);
/* harmony import */ var react_typed__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_typed__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_div_100vh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4525);
/* harmony import */ var react_div_100vh__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_div_100vh__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2047);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_device_detect__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_particles_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5394);
/* harmony import */ var react_particles_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_particles_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _extras_particlesParams_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9985);
/* harmony import */ var _components_Copyright__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1498);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1664);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(701);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_11__);
















const data = [{
  text: ["^500 Hi, ^500I'm Blake ^2000", "^500 Scroll to learn more ^1000"],
  imageUrl: "macbook3.jpeg",
  links: []
}, {
  text: ["I am a Computer Science student at the Georgia Institute of Technology."],
  imageUrl: "crosland.jpg",
  links: []
}, {
  text: ["Ultimately, I am an engineer at heart"],
  imageUrl: "mac2.jpg",
  links: [{
    url: "/projects",
    label: "Projects"
  }, {
    url: "/github",
    label: "GitHub",
    external: true
  }]
}, {
  text: ["Fascinated with automated stock trading"],
  imageUrl: "stock.png",
  links: [{
    url: "/fund",
    label: "Stock Fund",
    external: true
  }, {
    url: "https://investivision.com",
    label: "Investivision",
    external: true
  }]
}, {
  text: ["With a sense of photographic expression."],
  imageUrl: "full/DSC_0817.jpeg",
  links: [{
    url: "/photo",
    label: "Portfolio"
  }, {
    url: "/photo/gear",
    label: "Gear"
  }]
}, {
  text: ["I encourage you to learn from my ventures,"],
  imageUrl: "mandel1.png",
  links: [{
    url: "/blog",
    label: "Blog"
  }]
}, {
  text: ["Reach out with professional inquiries,"],
  imageUrl: "startup.jpg",
  links: [{
    url: "/linkedin",
    label: "LinkedIn",
    external: true
  }, {
    url: "/resume",
    label: "Résumé"
  }]
}, {
  text: ["Or connect with me further."],
  imageUrl: "connect.jpg",
  links: [{
    url: "mailto:blake@sanie.com",
    label: "Email"
  }, {
    url: "/instagram",
    label: "Instagram",
    external: true
  }]
}];

if (react_device_detect__WEBPACK_IMPORTED_MODULE_6__.isMobile) {
  data[data.length - 1].links.push({
    url: "/contact.vcf",
    label: "Contact Card"
  });
}

function Home(props) {
  const {
    0: scroll,
    1: setScroll
  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(0);
  const windowHeight = (0,react_div_100vh__WEBPACK_IMPORTED_MODULE_5__.use100vh)();
  const {
    0: windowWidth,
    1: setWindowWidth
  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(500);
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    window.addEventListener("scroll", e => {
      setScroll(window.scrollY);
    }, true);
    setWindowWidth(window.innerWidth); // window.addEventListener(
    //   "resize",
    //   (e) => {
    //     setWindowHeight(window.innerHeight);
    //   },
    //   true
    // );
  }, []); //(scroll);

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components_HeaderAndFooter__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z, {
    children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {
      id: "330139141",
      children: ["html{background-color:black;}", "header{background-color:#00000080 !important;}"]
    }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_Copyright__WEBPACK_IMPORTED_MODULE_9__/* .default */ .Z, {
      style: {
        position: "absolute",
        bottom: 0,
        zIndex: 9999
      }
    }), data.map((item, i) => {
      let offset = scroll - windowHeight * i;
      return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_div_100vh__WEBPACK_IMPORTED_MODULE_5___default()), {
        className: (_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().frame),
        style: {
          maxHeight: i == 0 && (windowWidth <= 800 || windowHeight >= 1200) ? windowHeight - 80 : "none",
          justifyContent: i == 0 ? "flex-start" : "center"
        },
        children: i == 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            style: {
              zIndex: 5
            },
            className: "jsx-330139141" + " " + ((_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().center) || ""),
            children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
              style: {
                position: "absolute",
                left: `50%`,
                transform: "translateX(-100px)",
                top: 26,
                width: 200,
                height: 200,
                background: `radial-gradient(closest-side, #ffa00060 0%, #00000000 100%)`
              },
              className: "jsx-330139141"
            }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
              src: "/images/wwdc_blake.png",
              style: {
                transform: `translateY(${offset * -0.2}px)`
              },
              className: "jsx-330139141" + " " + ((_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().wwdcImage) || "")
            }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_typed__WEBPACK_IMPORTED_MODULE_4___default()), {
              strings: item.text,
              typeSpeed: 50,
              backSpeed: 40,
              loop: true,
              style: {
                fontSize: 50,
                height: 60,
                transform: `translateY(${offset * -0.1}px)`
              }
            })]
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            style: {
              flex: 1,
              width: "100%",
              opacity: 1 - Math.abs(offset) / windowHeight,
              transform: `translateY(${offset * 0.1}px)`
            },
            className: "jsx-330139141",
            children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
              src: `/images/${item.imageUrl}`,
              style: {
                position: `relative`
              },
              className: "jsx-330139141"
            })
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            style: {
              opacity: 1 - Math.abs(offset) / windowHeight
            },
            className: "jsx-330139141" + " " + ((_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().particles) || ""),
            children: /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_particles_js__WEBPACK_IMPORTED_MODULE_7___default()), {
              className: (_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().particles),
              params: _extras_particlesParams_js__WEBPACK_IMPORTED_MODULE_8__/* .particlesParams */ .X
            })
          })]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
          children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
            alt: "",
            src: `/images/${item.imageUrl}`,
            style: {
              opacity: 1 - Math.abs(offset) / windowHeight
            },
            className: "jsx-330139141"
          }), /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            style: {
              transform: `translateY(${offset * -0.2}px)`
            },
            className: "jsx-330139141" + " " + ((_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().center) || ""),
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((react__WEBPACK_IMPORTED_MODULE_3___default().Fragment), {
              children: [/*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h2", {
                className: "jsx-330139141",
                children: item.text[0]
              }), item.links ? /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "jsx-330139141" + " " + ((_index_module_css__WEBPACK_IMPORTED_MODULE_12___default().buttonContainer) || ""),
                children: item.links.map((link, i) => {
                  return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_link__WEBPACK_IMPORTED_MODULE_10__.default, {
                    href: link.url,
                    target: link.external === true ? "_blank" : "_self",
                    children: link.label
                  }, i);
                })
              }) : null]
            })
          })]
        })
      }, i);
    })]
  });
}

/***/ }),

/***/ 1739:
/***/ (function(module) {

// Exports
module.exports = {
	"frame": "index_frame__uybHQ",
	"centerContainer": "index_centerContainer__11wk0",
	"center": "index_center__2xYut",
	"buttonContainer": "index_buttonContainer__2leOX",
	"particles": "index_particles__YmJN5",
	"wwdcImage": "index_wwdcImage__2dyk7"
};


/***/ })

};
;