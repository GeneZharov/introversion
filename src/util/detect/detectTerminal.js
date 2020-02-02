// @flow

import { identity, memoizeWith } from "ramda";

function _detectTerminal(): boolean {
  return (
    typeof process !== "undefined" &&
    process !== null &&
    typeof process.stdout !== "undefined" &&
    process.stdout !== null &&
    (process.stdout: any).isTTY === true
  );
}

export const detectTerminal: () => boolean = memoizeWith(
  identity,
  _detectTerminal
);
