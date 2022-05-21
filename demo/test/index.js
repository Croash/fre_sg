"use strict";

var _h = require("../src/dom/h");

var _reconciler = require("../src/fiber/reconciler");

var _hooks = require("../src/fiber/hooks");

function App() {
  const [val, updateVal] = (0, _hooks.useState)(1234);
  const [val1, updateVal1] = (0, _hooks.useState)(5678);
  return (0, _h.h)("div", null, "test", (0, _h.h)("button", {
    onClick: () => {
      updateVal(val + 1);
    }
  }, val), (0, _h.h)("button", {
    onClick: () => {
      updateVal1(val1 + 1);
    }
  }, val1));
}

(0, _reconciler.render)((0, _h.h)(App, null), document.getElementById('app'));