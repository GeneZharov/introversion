// @flow

import { memoizeWith, identity } from "ramda";

function _detectConsoleTime(): boolean {
  return (
    typeof console !== "undefined" &&
    console !== null &&
    typeof console.time === "function" &&
    typeof console.timeEnd === "function"
  );
}

export const detectConsoleTime: () => boolean = memoizeWith(
  identity,
  _detectConsoleTime
);
