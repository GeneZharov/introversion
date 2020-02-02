"use strict";

module.exports = {
  exclude: "node_modules/**",
  presets: [
    ["@babel/preset-env", { targets: { browsers: ["ie >= 11"] } }],
    "@babel/preset-flow",
  ],
};
