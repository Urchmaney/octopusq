(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("react")) : typeof define === "function" && define.amd ? define(["react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.myLib = factory(global.react));
})(this, function(react) {
  "use strict";
  function App() {
    const [count, setCount] = react.useState(0);
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "Vite + React"), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setCount((count2) => count2 + 1) }, "count is ", count), /* @__PURE__ */ React.createElement("p", null, "Edit ", /* @__PURE__ */ React.createElement("code", null, "src/App.tsx"), " and save to test HMR")), /* @__PURE__ */ React.createElement("p", { className: "read-the-docs" }, "Click on the Vite and React logos to learn more"));
  }
  return App;
});
