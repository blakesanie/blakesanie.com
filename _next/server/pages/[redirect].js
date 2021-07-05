(function() {
var exports = {};
exports.id = 209;
exports.ids = [209,197,405];
exports.modules = {

/***/ 6506:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ NotFound; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5282);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6124);



function NotFound(props) {
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    window.history.pushState({}, null, "/");
    setTimeout(() => {
      alert("Sorry, that page doesn't appear to exist!");
    }, 500);
  }, []);
  return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(___WEBPACK_IMPORTED_MODULE_2__.default, {});
}

/***/ }),

/***/ 9593:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ Redirect; },
  "getStaticPaths": function() { return /* binding */ getStaticPaths; },
  "getStaticProps": function() { return /* binding */ getStaticProps; }
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
// EXTERNAL MODULE: ./pages/404.js
var _404 = __webpack_require__(6506);
;// CONCATENATED MODULE: external "next/router"
var router_namespaceObject = require("next/router");;
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(701);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
// EXTERNAL MODULE: ./components/HeaderAndFooter/index.js
var HeaderAndFooter = __webpack_require__(4489);
;// CONCATENATED MODULE: ./pages/[redirect]/index.js








const redirects = {
  linkedin: {
    href: "https://www.linkedin.com/in/blakesanie/",
    title: "LinkedIn"
  },
  blog: {
    href: "https://blakesanie.medium.com/",
    title: "Blog on Medium"
  },
  instagram: {
    href: "https://www.blakesanie.com/instagram",
    title: "Instagram"
  },
  github: {
    href: "https://github.com/blakesanie",
    title: "Github"
  },
  balance: {
    href: "https://music.apple.com/us/album/balance/1478925861",
    title: "Balance on Apple Music"
  }
};
async function getStaticPaths() {
  let paths = [];

  for (const redirect in redirects) {
    paths.push({
      params: {
        redirect: redirect
      }
    });
  }

  return {
    paths: paths,
    fallback: false
  };
}
async function getStaticProps({
  params
}) {
  return {
    props: {}
  };
}
function Redirect(props) {
  const router = (0,router_namespaceObject.useRouter)();
  const {
    redirect
  } = router.query;
  return /*#__PURE__*/jsx_runtime_.jsx(HeaderAndFooter/* default */.Z, {
    children: redirect ? /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
      children: [/*#__PURE__*/jsx_runtime_.jsx((head_default()), {
        children: /*#__PURE__*/jsx_runtime_.jsx("meta", {
          httpEquiv: "refresh",
          content: `0; URL=${redirects[redirect].href}`
        })
      }), /*#__PURE__*/jsx_runtime_.jsx("h1", {
        className: "redirectLabel",
        children: `Redirecting to ${redirects[redirect].title}...`
      })]
    }) : null
  });
}

/***/ }),

/***/ 8417:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router-context.js");;

/***/ }),

/***/ 2238:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router/utils/get-asset-path-from-route.js");;

/***/ }),

/***/ 701:
/***/ (function(module) {

"use strict";
module.exports = require("next/head");;

/***/ }),

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 2047:
/***/ (function(module) {

"use strict";
module.exports = require("react-device-detect");;

/***/ }),

/***/ 4525:
/***/ (function(module) {

"use strict";
module.exports = require("react-div-100vh");;

/***/ }),

/***/ 5394:
/***/ (function(module) {

"use strict";
module.exports = require("react-particles-js");;

/***/ }),

/***/ 2367:
/***/ (function(module) {

"use strict";
module.exports = require("react-typed");;

/***/ }),

/***/ 5282:
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-runtime");;

/***/ }),

/***/ 3289:
/***/ (function(module) {

"use strict";
module.exports = require("styled-jsx/style");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [63,147,498,124], function() { return __webpack_exec__(9593); });
module.exports = __webpack_exports__;

})();