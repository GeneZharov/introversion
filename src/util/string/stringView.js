// @flow

import { toString } from "ramda";

export function stringView(val: mixed): string {
  return typeof val === "string" ? val : toString(val);
}
