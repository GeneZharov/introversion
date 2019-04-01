// @flow

import type { Conf, State } from "./types";

const isCommonJS =
  typeof module !== "undefined" &&
  typeof module.exports === "object" &&
  module.exports !== null;

const isTerm = process && process.stdout && (process.stdout: any).isTTY;
// process.stdout is undefined in React Native

export let globalConf: Conf = {
  print: (...xs) => console.log(...xs),
  timer: "auto",

  // util.inspect options
  format: isCommonJS,
  showHidden: false,
  depth: 2,
  color: isCommonJS ? isTerm : true,

  // in-place options
  id: "",
  guard: Infinity,
  repeat: 1
};

export let state: State = {
  muted: true, // Whether muted watchers are disabled
  guard: new Map(),
  timers: new Map()
};
