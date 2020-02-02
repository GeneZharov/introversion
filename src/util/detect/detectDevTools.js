// @flow

import { identity, memoizeWith } from "ramda";

function _detectDevTools(): boolean {
  let opened: boolean = false;
  const sample = /check/u;
  Object.defineProperty(
    (sample: any),
    "toString",
    ({
      get() {
        opened = true;
        return () => "Done";
      },
    }: any)
  );
  // eslint-disable-next-line no-console
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
