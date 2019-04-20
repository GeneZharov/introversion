// @flow

import { genString } from "../string/genString";

let idNumber: number = 0;

export function genTimerID(id: mixed): string {
  return genString(id) + "-" + idNumber++;
}
