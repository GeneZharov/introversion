// @flow

import { memoizeWith, identity } from "ramda";

function _detectReactNative(): boolean {
  return (
    typeof navigator !== "undefined" && navigator.product === "ReactNative"
  );
}

export const detectReactNative: () => mixed = memoizeWith(
  identity,
  _detectReactNative
);
