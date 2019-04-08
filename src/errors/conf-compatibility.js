// @flow

import { toString } from "ramda";

import type { Task } from "../types/_";

export function repeatNotAllowed() {
  return new Error('"repeat" option is not compatible with the console timer');
}

export function extraArgsNotAllowed() {
  return new Error(
    'Extra arguments are not acceptable with the console timer. Ways to solve the issue: 1. remove extra arguments; 2. alter the "timer" option; 3. enable the "format" option.'
  );
}
