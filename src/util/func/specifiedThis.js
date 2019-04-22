// @flow

import { detectStrictMode } from "../detect/detectStrictMode";
import { getGlobal } from "../misc/getGlobal";

export function specifiedThis(self: mixed): boolean {
  return detectStrictMode() ? self !== undefined : self !== getGlobal();
}
