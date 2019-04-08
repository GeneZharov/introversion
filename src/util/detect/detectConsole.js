// @flow

import { memoizeWith, identity } from "ramda";

function _detectConsole(): boolean {
  return console && typeof console.log === "function";
}

export const detectConsole: () => boolean = memoizeWith(
  identity,
  _detectConsole
);
