// @flow

import { stringView } from "../../util/string/stringView";

let idNumber: number = 0;

export function genTimerID(id: mixed): string {
  return stringView(id) + "-" + idNumber++;
}
