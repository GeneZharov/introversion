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
  format: isCommonJS,
  showHidden: false,
  depth: 2,
  color: isCommonJS ? isTerm : true,
  times: Infinity
};

export let state: State = {
  times: new Map(),
  muted: true // Whether conditional watchers are disabled
};
