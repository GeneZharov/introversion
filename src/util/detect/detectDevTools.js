// @flow

import { memoizeWith, identity } from "ramda";

function _detectDevTools(): boolean {
  let opened: boolean = false;
  const sample = /check/;
  Object.defineProperty(
    (sample: any),
    "toString",
    ({
      get() {
        opened = true;
        return () => "Done";
      }
    }: any)
  );
  console.log(
    "Introversion is detecting DevTools...",
    sample,
    '\n(set "devTools" option to skip it)\n'
  );
  return opened;
}

export const detectDevTools: () => boolean = memoizeWith(
  identity,
  _detectDevTools
);
