// @flow

import { memoizeWith, identity } from "ramda";

function _detectPerformance(): boolean {
  return (
    typeof performance !== "undefined" &&
    performance !== null &&
    typeof performance.now === "function"
  );
}

export const detectPerformance: () => boolean = memoizeWith(
  identity,
  _detectPerformance
);
