// @flow

import { identity, memoizeWith } from "ramda";

function _detectConsoleTime(): boolean {
  return (
    typeof console !== "undefined" &&
    console !== null &&
    typeof console.time === "function" && // eslint-disable-line no-console
    typeof console.timeEnd === "function" // eslint-disable-line no-console
  );
}

export const detectConsoleTime: () => boolean = memoizeWith(
  identity,
  _detectConsoleTime
);
