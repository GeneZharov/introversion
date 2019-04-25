// @flow

import type { Task } from "../types/_";

export function errInvalidConfType(task: string): string[] {
  return [`${task}() argument must be object`];
}

export function errExpectedFuncArg(task: Task): string[] {
  return [`${task}() expected function argument`];
}

export function errNotCallableLastArg(task: Task): string[] {
  return [`${task}() last argument is not a function`];
}
