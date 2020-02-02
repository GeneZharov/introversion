// @flow

import { identity, memoizeWith } from "ramda";

function _detectReactNative(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator !== null &&
    navigator.product === "ReactNative"
  );
}

export const detectReactNative: () => boolean = memoizeWith(
  identity,
  _detectReactNative
);
