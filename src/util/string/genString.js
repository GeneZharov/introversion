// @flow

import { toString } from "ramda";

export function genString(val: mixed): string {
  return typeof val === "string" ? val : toString(val);
}
