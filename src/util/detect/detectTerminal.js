// @flow

import { memoizeWith, identity } from "ramda";

function _detectTerminal(): boolean {
  return process && process.stdout && (process.stdout: any).isTTY;
  // process.stdout is undefined in React Native
}

export const detectTerminal: () => boolean = memoizeWith(
  identity,
  _detectTerminal
);
